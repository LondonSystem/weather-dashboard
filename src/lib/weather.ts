import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudMoon,
  CloudRain,
  CloudSnow,
  CloudSun,
  Cloudy,
  Moon,
  Snowflake,
  Sun,
  type LucideIcon,
} from 'lucide-react'

export interface WeatherDescriptor {
  label: string
  Icon: LucideIcon
}

export function describeWeather(code: number, isDay = true): WeatherDescriptor {
  switch (code) {
    case 0:
      return { label: 'Clear sky', Icon: isDay ? Sun : Moon }
    case 1:
      return { label: 'Mainly clear', Icon: isDay ? Sun : Moon }
    case 2:
      return { label: 'Partly cloudy', Icon: isDay ? CloudSun : CloudMoon }
    case 3:
      return { label: 'Overcast', Icon: Cloudy }
    case 45:
      return { label: 'Fog', Icon: CloudFog }
    case 48:
      return { label: 'Depositing rime fog', Icon: CloudFog }
    case 51:
      return { label: 'Light drizzle', Icon: CloudDrizzle }
    case 53:
      return { label: 'Moderate drizzle', Icon: CloudDrizzle }
    case 55:
      return { label: 'Dense drizzle', Icon: CloudDrizzle }
    case 56:
      return { label: 'Light freezing drizzle', Icon: CloudDrizzle }
    case 57:
      return { label: 'Dense freezing drizzle', Icon: CloudDrizzle }
    case 61:
      return { label: 'Slight rain', Icon: CloudRain }
    case 63:
      return { label: 'Moderate rain', Icon: CloudRain }
    case 65:
      return { label: 'Heavy rain', Icon: CloudRain }
    case 66:
      return { label: 'Light freezing rain', Icon: CloudRain }
    case 67:
      return { label: 'Heavy freezing rain', Icon: CloudRain }
    case 71:
      return { label: 'Slight snow', Icon: CloudSnow }
    case 73:
      return { label: 'Moderate snow', Icon: CloudSnow }
    case 75:
      return { label: 'Heavy snow', Icon: CloudSnow }
    case 77:
      return { label: 'Snow grains', Icon: Snowflake }
    case 80:
      return { label: 'Slight rain showers', Icon: CloudRain }
    case 81:
      return { label: 'Moderate rain showers', Icon: CloudRain }
    case 82:
      return { label: 'Violent rain showers', Icon: CloudRain }
    case 85:
      return { label: 'Slight snow showers', Icon: CloudSnow }
    case 86:
      return { label: 'Heavy snow showers', Icon: CloudSnow }
    case 95:
      return { label: 'Thunderstorm', Icon: CloudLightning }
    case 96:
      return { label: 'Thunderstorm with slight hail', Icon: CloudLightning }
    case 99:
      return { label: 'Thunderstorm with heavy hail', Icon: CloudLightning }
    default:
      return { label: 'Unknown conditions', Icon: Cloud }
  }
}
