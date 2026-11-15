import type { ForecastResponse, GeoResult, Units } from '../types'

const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search'
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast'

export class ApiError extends Error {
  readonly status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError'
}

function normalizeError(status: number): string {
  if (status === 429) {
    return 'Open-Meteo rate limit reached. Please wait a moment and retry.'
  }
  if (status >= 500) {
    return 'The weather service is temporarily unavailable. Please retry shortly.'
  }
  if (status === 400) {
    return 'The weather service rejected the request. Try a different location.'
  }
  return `Request failed with status ${status}.`
}

async function request(url: URL, signal?: AbortSignal): Promise<Response> {
  let response: Response
  try {
    response = await fetch(url, { signal })
  } catch (error) {
    if (isAbortError(error)) {
      throw error
    }
    throw new ApiError('Network error. Check your connection and retry.', 0)
  }

  if (!response.ok) {
    throw new ApiError(normalizeError(response.status), response.status)
  }

  return response
}

export async function searchCities(
  query: string,
  signal?: AbortSignal,
): Promise<GeoResult[]> {
  const url = new URL(GEOCODING_URL)
  url.searchParams.set('name', query)
  url.searchParams.set('count', '5')
  url.searchParams.set('language', 'en')
  url.searchParams.set('format', 'json')

  const response = await request(url, signal)
  const data = (await response.json()) as { results?: GeoResult[] }
  return data.results ?? []
}

export async function fetchForecast(
  latitude: number,
  longitude: number,
  units: Units,
  signal?: AbortSignal,
): Promise<ForecastResponse> {
  const url = new URL(FORECAST_URL)
  url.searchParams.set('latitude', latitude.toString())
  url.searchParams.set('longitude', longitude.toString())
  url.searchParams.set(
    'current',
    [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'is_day',
      'precipitation',
      'weather_code',
      'wind_speed_10m',
    ].join(','),
  )
  url.searchParams.set(
    'hourly',
    ['temperature_2m', 'precipitation_probability', 'weather_code'].join(','),
  )
  url.searchParams.set(
    'daily',
    [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'precipitation_probability_max',
      'sunrise',
      'sunset',
    ].join(','),
  )
  url.searchParams.set('timezone', 'auto')
  url.searchParams.set('forecast_days', '7')
  url.searchParams.set(
    'temperature_unit',
    units === 'imperial' ? 'fahrenheit' : 'celsius',
  )
  url.searchParams.set('wind_speed_unit', units === 'imperial' ? 'mph' : 'kmh')
  url.searchParams.set('precipitation_unit', units === 'imperial' ? 'inch' : 'mm')

  const response = await request(url, signal)
  return (await response.json()) as ForecastResponse
}
