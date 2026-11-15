export function Footer() {
  return (
    <footer className="mt-10 pb-4 text-center text-xs text-white/60">
      <p>
        Weather data by{' '}
        <a
          href="https://open-meteo.com/"
          target="_blank"
          rel="noreferrer noopener"
          className="font-medium text-white/80 underline decoration-dotted underline-offset-2 hover:text-white"
        >
          Open-Meteo.com
        </a>{' '}
        (CC BY 4.0)
      </p>
    </footer>
  )
}
