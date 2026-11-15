import { useEffect, useRef } from 'react'
import { Crosshair, Loader2, MapPin, Search, X } from 'lucide-react'
import type { GeoResult } from '../types'

interface SearchBarProps {
  query: string
  onQueryChange: (value: string) => void
  suggestions: GeoResult[]
  searching: boolean
  searchError: string | null
  onSelect: (city: GeoResult) => void
  onUseLocation: () => void
  locating: boolean
}

function subtitle(city: GeoResult): string {
  return [city.admin1, city.country].filter(Boolean).join(', ')
}

export function SearchBar({
  query,
  onQueryChange,
  suggestions,
  searching,
  searchError,
  onSelect,
  onUseLocation,
  locating,
}: SearchBarProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        onQueryChange(query)
      }
    }
    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [onQueryChange, query])

  const trimmed = query.trim()
  const showEmpty =
    trimmed.length >= 2 && !searching && !searchError && suggestions.length === 0
  const showPanel = trimmed.length >= 2 && (searching || Boolean(searchError) || suggestions.length > 0 || showEmpty)

  return (
    <div ref={containerRef} className="relative z-20">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/60" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search for a city…"
            aria-label="Search for a city"
            autoComplete="off"
            className="w-full rounded-2xl border border-white/20 bg-white/10 py-3.5 pl-12 pr-11 text-base text-white placeholder:text-white/50 backdrop-blur-md transition focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/30"
          />
          {query.length > 0 && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => {
                onQueryChange('')
                inputRef.current?.focus()
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={onUseLocation}
          disabled={locating}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-5 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {locating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Crosshair className="h-4 w-4" />
          )}
          Use my location
        </button>
      </div>

      {showPanel && (
        <div className="absolute inset-x-0 top-full mt-2 overflow-hidden rounded-2xl border border-white/15 bg-slate-900/85 shadow-2xl backdrop-blur-xl sm:right-auto sm:w-[calc(100%-13rem)]">
          {searching && (
            <div className="flex items-center gap-3 px-4 py-3 text-sm text-white/70">
              <Loader2 className="h-4 w-4 animate-spin" />
              Searching…
            </div>
          )}

          {!searching && searchError && (
            <div className="px-4 py-3 text-sm text-amber-200">{searchError}</div>
          )}

          {!searching && !searchError && showEmpty && (
            <div className="px-4 py-3 text-sm text-white/70">
              No matching cities found. Try a different spelling.
            </div>
          )}

          {!searching &&
            !searchError &&
            suggestions.map((city) => (
              <button
                key={`${city.id}-${city.latitude}-${city.longitude}`}
                type="button"
                onClick={() => onSelect(city)}
                className="flex w-full items-center gap-3 border-b border-white/5 px-4 py-3 text-left transition last:border-b-0 hover:bg-white/10"
              >
                <MapPin className="h-4 w-4 shrink-0 text-sky-300" />
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-white">
                    {city.name}
                  </span>
                  <span className="block truncate text-xs text-white/60">
                    {subtitle(city)}
                  </span>
                </span>
              </button>
            ))}
        </div>
      )}
    </div>
  )
}
