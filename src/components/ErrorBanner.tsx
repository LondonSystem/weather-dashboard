import { AlertTriangle, RefreshCw } from 'lucide-react'

interface ErrorBannerProps {
  message: string
  onRetry: () => void
}

export function ErrorBanner({ message, onRetry }: ErrorBannerProps) {
  return (
    <div
      role="alert"
      className="flex flex-col gap-4 rounded-2xl border border-amber-300/40 bg-amber-400/15 p-4 text-amber-50 backdrop-blur-md sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-200" />
        <p className="text-sm font-medium">{message}</p>
      </div>
      <button
        type="button"
        onClick={onRetry}
        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-amber-300/90 px-4 py-2 text-sm font-semibold text-amber-950 transition hover:bg-amber-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        <RefreshCw className="h-4 w-4" />
        Retry
      </button>
    </div>
  )
}
