import { HourlyData, WeatherSettings } from '../types/weather';

export function formatHour(hour: number): string {
  if (hour === 0) return '12:00 AM';
  if (hour < 12) return `${hour}:00 AM`;
  if (hour === 12) return '12:00 PM';
  return `${hour - 12}:00 PM`;
}

export function cToF(celsius: number): number {
  return Math.round((celsius * 9) / 5 + 32);
}

export function fToC(fahrenheit: number): number {
  return Math.round(((fahrenheit - 32) * 5) / 9);
}

/**
 * Calculates 24 hours of simulated realistic temperature and relative humidity.
 *
 * Diurnal cycle:
 * - Minimum temperature occurs near sunrise (~06:00).
 * - Maximum temperature occurs in mid-afternoon (~15:00 / 3 PM) due to thermal lag.
 * - Cloud cover dampens the day-night swing (warmer nights, cooler days).
 * - Relative humidity relates inversely to temperature: warmer air holds more moisture,
 *   so relative humidity (%) drops as temperature peaks.
 */
export function generate24HourData(settings: WeatherSettings): HourlyData[] {
  const { baseTempC, moistureLevel, cloudCover } = settings;

  // Clear skies have larger daily swings (e.g., 14°C swing); 100% clouds reduce swing to ~4°C
  const cloudFactor = 1 - (cloudCover / 100) * 0.7; // between 0.3 and 1.0
  const tempAmplitude = 7.5 * cloudFactor; // half-amplitude

  // Average 24-hr temperature
  const meanTemp = baseTempC - tempAmplitude * 0.8;

  const data: HourlyData[] = [];

  for (let hour = 0; hour < 24; hour++) {
    // Phase calculation:
    // Peak at hour 15 (3 PM), minimum at hour 6 (6 AM)
    // cos((hour - 15) * 2pi / 24) is 1 at hour 15, and -0.96 at hour 6 (approx -1)
    const angle = ((hour - 15) * 2 * Math.PI) / 24;
    const tempC = Math.round((meanTemp + tempAmplitude * Math.cos(angle)) * 10) / 10;
    const tempF = cToF(tempC);

    // Saturation vapor pressure SVP(T) in hPa (Tetens formula)
    const svp = 6.1078 * Math.exp((17.27 * tempC) / (tempC + 237.3));

    // Actual vapor pressure based on moistureLevel (scaled reasonably for ambient air)
    // At moistureLevel 50, vapor pressure is around 12-16 hPa
    const targetVp = 4 + (moistureLevel / 100) * 18;

    // Relative humidity = (actual VP / saturation VP) * 100
    let rh = Math.round((targetVp / svp) * 100);
    // Clamp between 15% and 100%
    if (rh > 100) rh = 100;
    if (rh < 15) rh = 15;

    // Dew point approximation (Magnus formula)
    const a = 17.27;
    const b = 237.7;
    const alpha = (a * tempC) / (b + tempC) + Math.log(rh / 100);
    const dewPointC = Math.round(((b * alpha) / (a - alpha)) * 10) / 10;
    const dewPointF = cToF(dewPointC);

    const isDaytime = hour >= 6 && hour <= 19;
    const hasDew = rh >= 90 && hour >= 4 && hour <= 7;

    // Grade 6 student friendly description of what is happening
    let description = '';
    if (hour >= 5 && hour <= 7) {
      description = hasDew
        ? 'Chilly dawn! The air reached its dew point, forming sparkling morning dew.'
        : 'Early morning: air is coolest, making humidity naturally high.';
    } else if (hour >= 8 && hour <= 11) {
      description = 'Morning sun warms the ground. As temperature rises, humidity begins dropping.';
    } else if (hour >= 12 && hour <= 16) {
      description = 'Afternoon peak warmth! The warm air holds more vapor, so humidity drops to its lowest.';
    } else if (hour >= 17 && hour <= 20) {
      description = 'Sun setting: ground loses heat. As air cools, relative humidity climbs back up.';
    } else {
      description = 'Nighttime chill: quiet hours when air stays cool and humidity stays high.';
    }

    data.push({
      hour,
      timeLabel: formatHour(hour),
      temperatureC: tempC,
      temperatureF: tempF,
      humidity: rh,
      dewPointC,
      dewPointF,
      description,
      isDaytime,
      hasDew,
    });
  }

  return data;
}

export const WEATHER_PRESETS = [
  {
    id: 'sunny_summer',
    name: 'Sunny Summer Day',
    emoji: '☀️',
    tagline: 'Big temperature swing with a steep humidity dip!',
    settings: {
      baseTempC: 30,
      moistureLevel: 45,
      cloudCover: 10,
    },
  },
  {
    id: 'crisp_autumn',
    name: 'Crisp Morning Dew',
    emoji: '🍁',
    tagline: 'Cold dawn brings 95%+ humidity and sparkling grass dew.',
    settings: {
      baseTempC: 19,
      moistureLevel: 65,
      cloudCover: 15,
    },
  },
  {
    id: 'rainy_overcast',
    name: 'Overcast & Drizzly',
    emoji: '☁️',
    tagline: 'Clouds insulate the day, keeping temperature steady and humidity high.',
    settings: {
      baseTempC: 20,
      moistureLevel: 85,
      cloudCover: 90,
    },
  },
  {
    id: 'desert_oasis',
    name: 'Dry Desert Oasis',
    emoji: '🌵',
    tagline: 'Hot afternoon with very low humidity and huge night cooling.',
    settings: {
      baseTempC: 36,
      moistureLevel: 15,
      cloudCover: 5,
    },
  },
];
