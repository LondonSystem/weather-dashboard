import { useCallback, useEffect, useState } from 'react'
import { CloudSun } from 'lucide-react'
import { CurrentWeatherCard } from './components/CurrentWeatherCard'
import { DailyForecast } from './components/DailyForecast'
import { ErrorBanner } from './components/ErrorBanner'
import { Footer } from './components/Footer'
import { HourlyChart } from './components/HourlyChart'
import { MetricsGrid } from './components/MetricsGrid'
import { SavedCities } from './components/SavedCities'
import { SearchBar } from './components/SearchBar'
import { DashboardSkeleton } from './components/Skeleton'
import { UnitToggle } from './components/UnitToggle'
import { useDebounce } from './hooks/useDebounce'
import { useForecast } from './hooks/useForecast'
import { useLocalStorage } from './hooks/useLocalStorage'
import { ApiError, isAbortError, searchCities } from './lib/api'
import type { GeoResult, SavedCity, Units } from './types'

const DEFAULT_CITY: SavedCity = {
  id: 'geo:184745',
  name: 'Nairobi',
  country: 'Kenya',
  latitude: -1.28333,
  longitude: 36.81667,
}

function App() {
  const [units, setUnits] = useLocalStorage<Units>('weather.units', 'metric')
  const [savedCities, setSavedCities] = useLocalStorage<SavedCity[]>(
    'weather.cities',
    [DEFAULT_CITY],
  )
  const [activeCity, setActiveCity] = useLocalStorage<SavedCity>(
    'weather.activeCity',
    DEFAULT_CITY,
  )

  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 300)
  const [suggestions, setSuggestions] = useState<GeoResult[]>([])
  const [searching, setSearching] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)
  const [locating, setLocating] = useState(false)

  const { data, loading, error, refetch } = useForecast(activeCity, units)

  useEffect(() => {
    const term = debouncedQuery.trim()
    if (term.length < 2) {
      setSuggestions([])
      setSearching(false)
      setSearchError(null)
      return
    }

    const controller = new AbortController()
    setSearching(true)
    setSearchError(null)

    searchCities(term, controller.signal)
      .then((results) => {
        setSuggestions(results)
      })
      .catch((err: unknown) => {
        if (isAbortError(err)) {
          return
        }
        setSuggestions([])
        setSearchError(
          err instanceof ApiError ? err.message : 'Search failed. Please retry.',
        )
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setSearching(false)
        }
      })

    return () => controller.abort()
  }, [debouncedQuery])

  const selectCity = useCallback(
    (city: SavedCity) => {
      setActiveCity(city)
      setSavedCities((previous) => {
        if (previous.some((item) => item.id === city.id)) {
          return previous
        }
        return [city, ...previous].slice(0, 8)
      })
      setQuery('')
      setSuggestions([])
      setSearchError(null)
    },
    [setActiveCity, setSavedCities],
  )

  const handleSelectSuggestion = useCallback(
    (geo: GeoResult) => {
      selectCity({
        id: `geo:${geo.id}`,
        name: geo.name,
        country: geo.country ?? geo.admin1,
        latitude: geo.latitude,
        longitude: geo.longitude,
      })
    },
    [selectCity],
  )

  const removeCity = useCallback(
    (id: string) => {
      const next = savedCities.filter((city) => city.id !== id)
      setSavedCities(next)
      if (activeCity.id === id) {
        setActiveCity(next[0] ?? DEFAULT_CITY)
      }
    },
    [activeCity.id, savedCities, setActiveCity, setSavedCities],
  )

  const useMyLocation = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setSearchError('Geolocation is not supported by this browser.')
      return
    }

    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocating(false)
        selectCity({
          id: `coords:${position.coords.latitude.toFixed(3)},${position.coords.longitude.toFixed(3)}`,
          name: 'Current location',
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
      },
      () => {
        setLocating(false)
        setSearchError('Unable to access your location. Check browser permissions.')
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 },
    )
  }, [selectCity])

  const isDay = data?.current.is_day === 1
  const theme = isDay
    ? 'from-sky-400 via-blue-500 to-indigo-600'
    : 'from-slate-900 via-indigo-950 to-slate-950'

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${theme} text-white transition-colors duration-700`}
    >
      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 py-6 sm:px-6 sm:py-10">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <CloudSun className="h-7 w-7 text-white" aria-hidden />
            <div>
              <h1 className="text-lg font-semibold leading-tight sm:text-xl">
                Weather Dashboard
              </h1>
              <p className="text-xs text-white/60">Powered by Open-Meteo</p>
            </div>
          </div>
          <UnitToggle units={units} onChange={setUnits} />
        </header>

        <div className="mt-6 space-y-4">
          <SearchBar
            query={query}
            onQueryChange={setQuery}
            suggestions={suggestions}
            searching={searching}
            searchError={searchError}
            onSelect={handleSelectSuggestion}
            onUseLocation={useMyLocation}
            locating={locating}
          />
          <SavedCities
            cities={savedCities}
            activeId={activeCity.id}
            onSelect={selectCity}
            onRemove={removeCity}
          />
        </div>

        <main className="mt-6 flex-1">
          {error ? (
            <div className="mb-5">
              <ErrorBanner message={error} onRetry={refetch} />
            </div>
          ) : null}

          {!data && loading ? <DashboardSkeleton /> : null}

          {!data && !loading && !error ? (
            <p className="mt-16 text-center text-white/70">
              Search for a city to see its weather.
            </p>
          ) : null}

          {data ? (
            <div className="animate-fade-in-up space-y-5">
              <CurrentWeatherCard
                city={activeCity}
                data={data}
                refreshing={loading}
              />
              <MetricsGrid data={data} />
              <HourlyChart data={data} />
              <DailyForecast data={data} />
            </div>
          ) : null}
        </main>

        <Footer />
      </div>
    </div>
  )
}

export default App
