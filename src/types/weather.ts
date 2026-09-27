export interface HourlyData {
  hour: number; // 0 to 23
  timeLabel: string; // e.g., "6:00 AM"
  temperatureC: number; // in Celsius
  temperatureF: number; // in Fahrenheit
  humidity: number; // in % (0 - 100)
  dewPointC: number;
  dewPointF: number;
  description: string;
  isDaytime: boolean;
  hasDew: boolean;
}

export interface WeatherSettings {
  baseTempC: number; // average/target afternoon peak (e.g. 28)
  moistureLevel: number; // 10 (very dry) to 90 (very moist)
  cloudCover: number; // 0 (clear sky) to 100 (heavy clouds)
  unit: 'C' | 'F';
}

export interface WeatherPreset {
  id: string;
  name: string;
  emoji: string;
  tagline: string;
  settings: {
    baseTempC: number;
    moistureLevel: number;
    cloudCover: number;
  };
}

export interface QuizQuestion {
  id: number;
  title: string;
  question: string;
  hint: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    explanation: string;
  }[];
  graphHighlightRange?: [number, number]; // [startHour, endHour] to highlight on graph
}
