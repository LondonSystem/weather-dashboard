import { useCallback, useEffect, useState } from 'react'
import { ApiError, fetchForecast, isAbortError } from '../lib/api'
import type { ForecastResponse, SavedCity, Units } from '../types'

interface UseForecastResult {
  data: ForecastResponse | null
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useForecast(
  city: SavedCity | null,
  units: Units,
): UseForecastResult {
  const [data, setData] = useState<ForecastResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  const latitude = city?.latitude
  const longitude = city?.longitude

  useEffect(() => {
    if (latitude === undefined || longitude === undefined) {
      setData(null)
      return
    }

    const controller = new AbortController()
    setLoading(true)
    setError(null)

    fetchForecast(latitude, longitude, units, controller.signal)
      .then((result) => {
        setData(result)
      })
      .catch((err: unknown) => {
        if (isAbortError(err)) {
          return
        }
        setError(
          err instanceof ApiError
            ? err.message
            : 'Something went wrong while loading the forecast.',
        )
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      })

    return () => controller.abort()
  }, [latitude, longitude, units, reloadKey])

  const refetch = useCallback(() => setReloadKey((key) => key + 1), [])

  return { data, loading, error, refetch }
}
