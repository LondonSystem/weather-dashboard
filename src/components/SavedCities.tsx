import { MapPin, X } from 'lucide-react'
import type { SavedCity } from '../types'

interface SavedCitiesProps {
  cities: SavedCity[]
  activeId: string
  onSelect: (city: SavedCity) => void
  onRemove: (id: string) => void
}

export function SavedCities({
  cities,
  activeId,
  onSelect,
  onRemove,
}: SavedCitiesProps) {
  if (cities.length === 0) {
    return null
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-medium uppercase tracking-wide text-white/50">
        Saved
      </span>
      {cities.map((city) => {
        const active = city.id === activeId
        return (
          <span
            key={city.id}
            className={`inline-flex items-center gap-1 rounded-full border py-1 pl-3 pr-1 text-sm transition ${
              active
                ? 'border-white/60 bg-white text-slate-900'
                : 'border-white/20 bg-white/10 text-white/90 hover:bg-white/20'
            }`}
          >
            <button
              type="button"
              onClick={() => onSelect(city)}
              className="inline-flex items-center gap-1.5"
            >
              <MapPin className="h-3.5 w-3.5" />
              {city.name}
            </button>
            <button
              type="button"
              aria-label={`Remove ${city.name}`}
              onClick={() => onRemove(city.id)}
              className={`rounded-full p-1 transition ${
                active ? 'hover:bg-black/10' : 'hover:bg-white/20'
              }`}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </span>
        )
      })}
    </div>
  )
}
