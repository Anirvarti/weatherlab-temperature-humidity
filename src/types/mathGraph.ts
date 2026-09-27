export interface Point4Q {
  x: number; // e.g. -6 to +6 (hours relative to noon: -6 = 6 AM, 0 = 12 PM Noon, +6 = 6 PM)
  tempY: number; // in °C (e.g. -10 to +20, crosses 0)
  humidityY: number; // deviation from 50% average (-40 to +40, crosses 0)
  rawHumidity: number; // actual % (10 to 90%)
  timeLabel: string; // e.g. "8 AM" or "2 PM"
  tempQuadrant: 'I' | 'II' | 'III' | 'IV' | 'Axis';
  humQuadrant: 'I' | 'II' | 'III' | 'IV' | 'Axis';
}

export interface WeatherSliders {
  baseTemp: number; // -5 to 15 °C (shifts graph up/down through 0)
  tempRange: number; // 4 to 12 °C (amplitude of swing)
  baseHumidity: number; // 30 to 70%
}

export interface MathQuestion4Q {
  id: number;
  numberLabel: string;
  topic: string;
  question: string;
  targetPoint?: { x: number; y: number; graph: 'temp' | 'humidity' };
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    explanation: string;
  }[];
}
