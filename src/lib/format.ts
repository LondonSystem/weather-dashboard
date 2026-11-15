export function formatTemp(value: number): string {
  return `${Math.round(value)}°`
}

export function formatTime(iso: string): string {
  return iso.slice(11, 16)
}

export function formatClock(iso: string): string {
  const [hourStr, minuteStr] = iso.slice(11, 16).split(':')
  const hour = Number(hourStr)
  const minute = minuteStr.padStart(2, '0')
  const period = hour >= 12 ? 'PM' : 'AM'
  const hour12 = hour % 12 === 0 ? 12 : hour % 12
  return `${hour12}:${minute} ${period}`
}

export function formatDateLabel(iso: string): string {
  const [year, month, day] = iso.slice(0, 10).split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return date.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  })
}

export function weekdayShort(iso: string): string {
  const [year, month, day] = iso.slice(0, 10).split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return date.toLocaleDateString(undefined, { weekday: 'short' })
}

export function isToday(iso: string, reference: string): boolean {
  return iso.slice(0, 10) === reference.slice(0, 10)
}
