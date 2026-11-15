import {
  Area,
  Bar,
  CartesianGrid,
  ComposedChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { formatTime } from '../lib/format'
import type { ForecastResponse, HourlyPoint } from '../types'

interface HourlyChartProps {
  data: ForecastResponse
}

interface TooltipEntry {
  dataKey?: string | number
  value?: number
}

interface ChartTooltipProps {
  active?: boolean
  payload?: TooltipEntry[]
  label?: string
  tempUnit: string
}

function ChartTooltip({ active, payload, label, tempUnit }: ChartTooltipProps) {
  if (!active || !payload || payload.length === 0) {
    return null
  }

  const temp = payload.find((entry) => entry.dataKey === 'temp')
  const pop = payload.find((entry) => entry.dataKey === 'pop')

  return (
    <div className="rounded-xl border border-white/15 bg-slate-900/90 px-3 py-2 text-xs shadow-xl backdrop-blur">
      <p className="font-semibold text-white">{label}</p>
      {temp ? (
        <p className="mt-1 text-sky-300">
          Temperature: {Math.round(temp.value ?? 0)}
          {tempUnit}
        </p>
      ) : null}
      {pop ? (
        <p className="text-indigo-300">
          Precipitation: {Math.round(pop.value ?? 0)}%
        </p>
      ) : null}
    </div>
  )
}

function buildPoints(data: ForecastResponse): HourlyPoint[] {
  const { hourly, current } = data
  const found = hourly.time.findIndex((time) => time >= current.time)
  const start = found === -1 ? 0 : found

  return hourly.time.slice(start, start + 24).map((time, offset) => {
    const index = start + offset
    return {
      time,
      label: formatTime(time),
      temp: hourly.temperature_2m[index],
      pop: hourly.precipitation_probability[index] ?? 0,
      code: hourly.weather_code[index],
    }
  })
}

export function HourlyChart({ data }: HourlyChartProps) {
  const points = buildPoints(data)
  const tempUnit = data.hourly_units.temperature_2m ?? '°C'

  return (
    <section className="rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur-md sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-white sm:text-lg">
            24-Hour Trend
          </h3>
          <p className="text-xs text-white/60">
            Temperature and precipitation probability
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs text-white/70">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-sky-400" />
            Temperature
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-indigo-400/70" />
            Rain chance
          </span>
        </div>
      </div>

      <div className="mt-5 h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={points} margin={{ top: 8, right: 4, left: -12, bottom: 0 }}>
            <defs>
              <linearGradient id="tempFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.45} />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.12)"
              vertical={false}
            />
            <XAxis
              dataKey="label"
              interval={2}
              tick={{ fill: 'rgba(255,255,255,0.65)', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              yAxisId="temp"
              width={42}
              unit="°"
              tick={{ fill: 'rgba(255,255,255,0.65)', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              yAxisId="pop"
              orientation="right"
              domain={[0, 100]}
              width={42}
              unit="%"
              tick={{ fill: 'rgba(129,140,248,0.85)', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              cursor={{ stroke: 'rgba(255,255,255,0.25)' }}
              content={<ChartTooltip tempUnit={tempUnit} />}
            />
            <Bar
              yAxisId="pop"
              dataKey="pop"
              fill="rgba(129,140,248,0.45)"
              radius={[3, 3, 0, 0]}
              barSize={10}
            />
            <Area
              yAxisId="temp"
              type="monotone"
              dataKey="temp"
              stroke="#38bdf8"
              strokeWidth={2.5}
              fill="url(#tempFill)"
              dot={false}
              activeDot={{ r: 4, fill: '#38bdf8' }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}
