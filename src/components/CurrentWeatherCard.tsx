import { ArrowDown, ArrowUp, MapPin } from 'lucide-react'
import { formatClock, formatDateLabel, formatTemp } from '../lib/format'
import { describeWeather } from '../lib/weather'
import type { ForecastResponse, SavedCity } from '../types'

interface CurrentWeatherCardProps {
  city: SavedCity
  data: ForecastResponse
  refreshing: boolean
}

export function CurrentWeatherCard({
  city,
  data,
  refreshing,
}: CurrentWeatherCardProps) {
  const { current, current_units: currentUnits, daily, daily_units: dailyUnits } = data
  const isDay = current.is_day === 1
  const { label, Icon } = describeWeather(current.weather_code, isDay)
  const tempUnit = currentUnits.temperature_2m ?? '°C'
  const todayMax = daily.temperature_2m_max[0]
  const todayMin = daily.temperature_2m_min[0]
  const maxUnit = dailyUnits.temperature_2m_max ?? tempUnit
  const minUnit = dailyUnits.temperature_2m_min ?? tempUnit

  return (
    <section
      className={`relative overflow-hidden rounded-3xl border border-white/15 p-6 backdrop-blur-md transition sm:p-8 ${
        refreshing ? 'opacity-80' : 'opacity-100'
      }`}
      style={{
        background: isDay
          ? 'linear-gradient(140deg, rgba(56,189,248,0.35), rgba(59,130,246,0.15))'
          : 'linear-gradient(140deg, rgba(79,70,229,0.35), rgba(15,23,42,0.35))',
      }}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-white/90">
            <MapPin className="h-4 w-4" />
            <h2 className="text-lg font-semibold sm:text-xl">
              {city.name}
              {city.country ? (
                <span className="ml-2 text-sm font-normal text-white/60">
                  {city.country}
                </span>
              ) : null}
            </h2>
          </div>
          <p className="mt-1 text-sm text-white/70">
            {formatDateLabel(current.time)} · {formatClock(current.time)}
          </p>
        </div>

        <div className="flex flex-col items-end gap-1 text-right">
          <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-wide text-white/80">
            {isDay ? 'Daytime' : 'Nighttime'}
          </span>
          <span className="text-xs text-white/60">{data.timezone}</span>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <Icon
            aria-hidden
            className="h-20 w-20 text-white drop-shadow-lg sm:h-24 sm:w-24"
            strokeWidth={1.5}
          />
          <div>
            <div className="flex items-start">
              <span className="text-6xl font-semibold leading-none tracking-tight sm:text-7xl">
                {formatTemp(current.temperature_2m)}
              </span>
              <span className="mt-2 ml-1 text-xl font-medium text-white/80">
                {tempUnit}
              </span>
            </div>
            <p className="mt-2 text-base font-medium text-white/90">{label}</p>
            <p className="mt-1 text-sm text-white/70">
              Feels like {formatTemp(current.apparent_temperature)}
              {tempUnit}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm">
          <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1.5 font-medium">
            <ArrowUp className="h-4 w-4 text-rose-300" />
            {formatTemp(todayMax)}
            {maxUnit}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1.5 font-medium">
            <ArrowDown className="h-4 w-4 text-sky-300" />
            {formatTemp(todayMin)}
            {minUnit}
          </span>
        </div>
      </div>
    </section>
  )
}
