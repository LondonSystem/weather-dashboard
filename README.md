# Weather Dashboard

A real-time, responsive weather dashboard powered by the [Open-Meteo](https://open-meteo.com/)
API (free tier, **no API key required**).

## Tech Stack

- **React 18 + TypeScript** (Vite)
- **Tailwind CSS v4** for styling
- **Recharts** for the hourly temperature / rain-chance chart
- **Lucide React** for weather glyphs and UI icons

## Features

- City search with **300 ms debounced autocomplete** (Geocoding API)
- **"Use my location"** via the browser Geolocation API
- **Saved cities** persisted in `localStorage` (defaults to **Nairobi** on first load)
- Hero card with local time, temperature, "feels like", and **WMO condition mapping**
- Dynamic **day / night** theming
- Atmospheric metrics: wind, humidity, precipitation, sunrise & sunset
- **24-hour** temperature + precipitation-probability chart
- **7-day** forecast with min/max range bars
- Global **°C / km/h ↔ °F / mph** unit toggle (server-side via API query params)
- Skeleton loaders, empty-state handling, and a retry banner for network / HTTP 429 errors

## File Structure

```
weather-dashboard/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── src/
    ├── main.tsx
    ├── index.css
    ├── App.tsx
    ├── types.ts
    ├── lib/
    │   ├── api.ts          # Open-Meteo client + error normalization
    │   ├── weather.ts      # WMO weather_code → label + icon
    │   └── format.ts       # time / temperature formatting helpers
    ├── hooks/
    │   ├── useDebounce.ts
    │   ├── useForecast.ts
    │   └── useLocalStorage.ts
    └── components/
        ├── SearchBar.tsx
        ├── SavedCities.tsx
        ├── CurrentWeatherCard.tsx
        ├── MetricsGrid.tsx
        ├── HourlyChart.tsx
        ├── DailyForecast.tsx
        ├── UnitToggle.tsx
        ├── ErrorBanner.tsx
        ├── Skeleton.tsx
        └── Footer.tsx
```

## Run Locally

```bash
npm install     # install dependencies
npm run dev     # start the dev server (http://localhost:5173)
```

Production build & preview:

```bash
npm run build   # type-check + bundle to dist/
npm run preview # serve the production build
npm run typecheck
```

## Data & Licensing

Weather data by [Open-Meteo.com](https://open-meteo.com/) (CC BY 4.0).
The free tier allows 10,000 calls/day; search input is debounced to conserve quota.
