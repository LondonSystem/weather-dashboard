import { Droplet } from 'lucide-react'
import { formatTemp, isToday, weekdayShort } from '../lib/format'
import { describeWeather } from '../lib/weather'
import type { ForecastResponse } from '../types'

interface DailyForecastProps {
  data: ForecastResponse
}

export function DailyForecast({ data }: DailyForecastProps) {
  const { daily, daily_units: units } = data
  const tempUnit = units.temperature_2m_max ?? '°C'

  const allMin = Math.min(...daily.temperature_2m_min)
  const allMax = Math.max(...daily.temperature_2m_max)
  const span = allMax - allMin || 1

  return (
    <section className="rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur-md sm:p-6">
      <h3 className="text-base font-semibold text-white sm:text-lg">
        7-Day Forecast
      </h3>
      <p className="text-xs text-white/60">Daily highs, lows, and rain chance</p>

      <ul className="mt-5 space-y-2">
        {daily.time.map((day, index) => {
          const { label, Icon } = describeWeather(daily.weather_code[index], true)
          const min = daily.temperature_2m_min[index]
          const max = daily.temperature_2m_max[index]
          const pop = daily.precipitation_probability_max[index] ?? 0
          const left = ((min - allMin) / span) * 100
          const width = Math.max(((max - min) / span) * 100, 6)
          const today = isToday(day, daily.time[0])

          return (
            <li
              key={day}
              className="grid grid-cols-[3.25rem_2rem_2.75rem_1fr] items-center gap-3 rounded-2xl px-2 py-2.5 transition hover:bg-white/10 sm:grid-cols-[4rem_2.25rem_3rem_1fr_5.5rem]"
            >
              <span className="text-sm font-semibold text-white/90">
                {today ? 'Today' : weekdayShort(day)}
              </span>

              <Icon
                aria-label={label}
                className="h-6 w-6 text-white"
                strokeWidth={1.75}
              />

              <span className="inline-flex items-center gap-1 text-xs text-sky-200">
                <Droplet className="h-3 w-3" />
                {Math.round(pop)}%
              </span>

              <div className="flex items-center gap-2">
                <span className="w-8 shrink-0 text-right text-sm text-white/70">
                  {formatTemp(min)}
                </span>
                <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-white/15">
                  <div
                    className="absolute inset-y-0 rounded-full bg-gradient-to-r from-sky-400 via-amber-300 to-rose-400"
                    style={{ left: `${left}%`, width: `${width}%` }}
                  />
                </div>
                <span className="w-8 shrink-0 text-sm font-medium text-white">
                  {formatTemp(max)}
                </span>
              </div>

              <span className="hidden text-right text-xs text-white/50 sm:block">
                {tempUnit}
              </span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
