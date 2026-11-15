import { Droplets, Sunrise, Sunset, Umbrella, Wind } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { formatTime } from '../lib/format'
import type { ForecastResponse } from '../types'

interface MetricsGridProps {
  data: ForecastResponse
}

interface MetricCardProps {
  icon: LucideIcon
  label: string
  value: string
  hint: string
}

function MetricCard({ icon: Icon, label, value, hint }: MetricCardProps) {
  return (
    <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-md transition hover:bg-white/15">
      <div className="flex items-center gap-2 text-white/70">
        <Icon className="h-4 w-4" />
        <span className="text-xs font-medium uppercase tracking-wide">{label}</span>
      </div>
      <p className="mt-3 text-2xl font-semibold text-white">{value}</p>
      <p className="mt-1 text-xs text-white/60">{hint}</p>
    </div>
  )
}

export function MetricsGrid({ data }: MetricsGridProps) {
  const { current, current_units: units, daily } = data
  const sunrise = daily.sunrise[0]
  const sunset = daily.sunset[0]

  return (
    <section
      aria-label="Current atmospheric metrics"
      className="grid grid-cols-2 gap-4 sm:grid-cols-4"
    >
      <MetricCard
        icon={Wind}
        label="Wind"
        value={`${Math.round(current.wind_speed_10m)} ${units.wind_speed_10m ?? 'km/h'}`}
        hint="10 m above ground"
      />
      <MetricCard
        icon={Droplets}
        label="Humidity"
        value={`${Math.round(current.relative_humidity_2m)}%`}
        hint="Relative humidity"
      />
      <MetricCard
        icon={Umbrella}
        label="Precipitation"
        value={`${current.precipitation} ${units.precipitation ?? 'mm'}`}
        hint="Current hour"
      />
      <MetricCard
        icon={Sunrise}
        label="Sunrise"
        value={formatTime(sunrise)}
        hint={`Sunset at ${formatTime(sunset)}`}
      />
      <div className="col-span-2 flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white/80 backdrop-blur-md sm:col-span-4">
        <Sunset className="h-4 w-4 text-orange-300" />
        <span>
          Sunset today at{' '}
          <span className="font-semibold text-white">{formatTime(sunset)}</span>
        </span>
      </div>
    </section>
  )
}
