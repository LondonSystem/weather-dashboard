export type Units = 'metric' | 'imperial'

export interface GeoResult {
  id: number
  name: string
  latitude: number
  longitude: number
  country?: string
  country_code?: string
  admin1?: string
  timezone?: string
}

export interface GeocodingResponse {
  results?: GeoResult[]
  generationtime_ms: number
}

export interface SavedCity {
  id: string
  name: string
  country?: string
  latitude: number
  longitude: number
}

export interface CurrentWeather {
  time: string
  temperature_2m: number
  relative_humidity_2m: number
  apparent_temperature: number
  is_day: number
  precipitation: number
  weather_code: number
  wind_speed_10m: number
}

export interface HourlyWeather {
  time: string[]
  temperature_2m: number[]
  precipitation_probability: number[]
  weather_code: number[]
}

export interface DailyWeather {
  time: string[]
  weather_code: number[]
  temperature_2m_max: number[]
  temperature_2m_min: number[]
  precipitation_probability_max: number[]
  sunrise: string[]
  sunset: string[]
}

export interface ForecastResponse {
  latitude: number
  longitude: number
  timezone: string
  timezone_abbreviation: string
  utc_offset_seconds: number
  current: CurrentWeather
  current_units: Record<string, string>
  hourly: HourlyWeather
  hourly_units: Record<string, string>
  daily: DailyWeather
  daily_units: Record<string, string>
}

export interface HourlyPoint {
  time: string
  label: string
  temp: number
  pop: number
  code: number
}
