import type { Units } from '../types'

interface UnitToggleProps {
  units: Units
  onChange: (units: Units) => void
}

const OPTIONS: { value: Units; label: string }[] = [
  { value: 'metric', label: '°C · km/h' },
  { value: 'imperial', label: '°F · mph' },
]

export function UnitToggle({ units, onChange }: UnitToggleProps) {
  return (
    <div
      role="group"
      aria-label="Measurement units"
      className="inline-flex rounded-full border border-white/20 bg-white/10 p-1 backdrop-blur-md"
    >
      {OPTIONS.map((option) => {
        const active = option.value === units
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.value)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition sm:text-sm ${
              active
                ? 'bg-white text-slate-900 shadow'
                : 'text-white/80 hover:text-white'
            }`}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
