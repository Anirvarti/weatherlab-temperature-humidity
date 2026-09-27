import { Point4Q, WeatherSliders, MathQuestion4Q } from '../types/mathGraph';

export function getQuadrant(x: number, y: number): 'I' | 'II' | 'III' | 'IV' | 'Axis' {
  if (x === 0 || y === 0) return 'Axis';
  if (x > 0 && y > 0) return 'I';
  if (x < 0 && y > 0) return 'II';
  if (x < 0 && y < 0) return 'III';
  return 'IV';
}

export function formatTimeFromX(x: number): string {
  const hour24 = 12 + x;
  if (hour24 === 0 || hour24 === 24) return '12 AM';
  if (hour24 === 12) return '12 PM';
  if (hour24 < 12) return `${hour24} AM`;
  return `${hour24 - 12} PM`;
}

export function calculate4QuadrantPoints(sliders: WeatherSliders): Point4Q[] {
  const { baseTemp, tempRange, baseHumidity } = sliders;
  const xValues = [-6, -4, -2, 0, 2, 4, 6];

  return xValues.map((x) => {
    // Peak temperature at x = 2 (2:00 PM), trough at x = -6 (6:00 AM)
    // Cosine cycle centered at x = 2 with period 24 (half-period 12)
    const angle = ((x - 2) * Math.PI) / 8;
    const tempY = Math.round(baseTemp + tempRange * Math.cos(angle));

    // Humidity is inverted relative to temperature
    const rawHum = Math.round(baseHumidity - (tempRange * 3) * Math.cos(angle));
    const clampedRawHum = Math.max(10, Math.min(90, rawHum));
    // Humidity deviation relative to 50% baseline (so it crosses 0 into negative and positive)
    const humidityY = clampedRawHum - 50;

    return {
      x,
      tempY,
      humidityY,
      rawHumidity: clampedRawHum,
      timeLabel: formatTimeFromX(x),
      tempQuadrant: getQuadrant(x, tempY),
      humQuadrant: getQuadrant(x, humidityY),
    };
  });
}

export function getMathQuestions(points: Point4Q[]): MathQuestion4Q[] {
  // Find point at x = -4 and x = 2
  const ptNeg4 = points.find((p) => p.x === -4) || points[1];
  const ptPos2 = points.find((p) => p.x === 2) || points[4];
  const ptZero = points.find((p) => p.x === 0) || points[3];
  const ptNeg6 = points.find((p) => p.x === -6) || points[0];

  const qAtNeg4 = getQuadrant(ptNeg4.x, ptNeg4.tempY);
  const qAtPos2 = getQuadrant(ptPos2.x, ptPos2.tempY);

  const verticalDiff = Math.abs(ptPos2.tempY - ptNeg6.tempY);

  return [
    {
      id: 1,
      numberLabel: 'Question 1',
      topic: 'Identifying Quadrants (I, II, III, IV)',
      question: `On Graph 1 (Temperature), look at the point at x = ${ptNeg4.x} (8 AM), where y = ${ptNeg4.tempY}°C. In which quadrant of the coordinate plane is this point located?`,
      targetPoint: { x: ptNeg4.x, y: ptNeg4.tempY, graph: 'temp' },
      options: [
        {
          id: '1a',
          text: `Quadrant ${qAtNeg4} (${ptNeg4.x < 0 ? 'Negative x' : 'Positive x'}, ${ptNeg4.tempY >= 0 ? 'Positive y' : 'Negative y'})`,
          isCorrect: true,
          explanation: `Correct! Because x = ${ptNeg4.x} (${ptNeg4.x < 0 ? 'negative' : 'positive'}) and y = ${ptNeg4.tempY} (${ptNeg4.tempY >= 0 ? 'positive' : 'negative'}), the point lies in Quadrant ${qAtNeg4}.`,
        },
        {
          id: '1b',
          text: `Quadrant ${qAtNeg4 === 'I' ? 'III' : 'I'}`,
          isCorrect: false,
          explanation: `Incorrect. In Quadrant I both x and y are positive (+, +). Here x is ${ptNeg4.x}.`,
        },
        {
          id: '1c',
          text: `Quadrant ${qAtNeg4 === 'IV' ? 'II' : 'IV'}`,
          isCorrect: false,
          explanation: `Incorrect. Check the signs: x is ${ptNeg4.x < 0 ? 'negative (-)' : 'positive (+)'} and y is ${ptNeg4.tempY < 0 ? 'negative (-)' : 'positive (+)'}.`,
        },
        {
          id: '1d',
          text: `On the origin (0, 0)`,
          isCorrect: false,
          explanation: `Incorrect. The origin is strictly at (0, 0). Here coordinates are (${ptNeg4.x}, ${ptNeg4.tempY}).`,
        },
      ],
    },
    {
      id: 2,
      numberLabel: 'Question 2',
      topic: 'Reading Coordinates (x, y)',
      question: `On Graph 1 (Temperature), what is the ordered pair (x, y) at the peak afternoon temperature (x = 2)?`,
      targetPoint: { x: ptPos2.x, y: ptPos2.tempY, graph: 'temp' },
      options: [
        {
          id: '2a',
          text: `(${ptPos2.x}, ${ptPos2.tempY})`,
          isCorrect: true,
          explanation: `Correct! Ordered pairs are always written (x, y). The horizontal position is x = ${ptPos2.x} and the vertical position is y = ${ptPos2.tempY}.`,
        },
        {
          id: '2b',
          text: `(${ptPos2.tempY}, ${ptPos2.x})`,
          isCorrect: false,
          explanation: `Incorrect. Coordinates must be written in alphabetical order: (x, y), not (y, x).`,
        },
        {
          id: '2c',
          text: `(${ptPos2.x}, 0)`,
          isCorrect: false,
          explanation: `Incorrect. (${ptPos2.x}, 0) is on the x-axis, but the plotted point has a y-value of ${ptPos2.tempY}.`,
        },
        {
          id: '2d',
          text: `(0, ${ptPos2.tempY})`,
          isCorrect: false,
          explanation: `Incorrect. (0, ${ptPos2.tempY}) would be on the vertical y-axis where x = 0.`,
        },
      ],
    },
    {
      id: 3,
      numberLabel: 'Question 3',
      topic: 'Understanding Quadrant Signs',
      question: `In a 4-quadrant coordinate plane, what are the signs of x and y in Quadrant II (top-left)?`,
      options: [
        {
          id: '3a',
          text: `(−, +) : Negative x and Positive y`,
          isCorrect: true,
          explanation: `Correct! In Quadrant II, you move left along the negative x-axis (−) and up along the positive y-axis (+).`,
        },
        {
          id: '3b',
          text: `(+, +) : Positive x and Positive y`,
          isCorrect: false,
          explanation: `Incorrect. (+, +) is Quadrant I (top-right).`,
        },
        {
          id: '3c',
          text: `(−, −) : Negative x and Negative y`,
          isCorrect: false,
          explanation: `Incorrect. (−, −) is Quadrant III (bottom-left).`,
        },
        {
          id: '3d',
          text: `(+, −) : Positive x and Negative y`,
          isCorrect: false,
          explanation: `Incorrect. (+, −) is Quadrant IV (bottom-right).`,
        },
      ],
    },
    {
      id: 4,
      numberLabel: 'Question 4',
      topic: 'Vertical Distance on the Coordinate Plane',
      question: `At x = 2, Temperature is at y = ${ptPos2.tempY}. At x = −6, Temperature is at y = ${ptNeg6.tempY}. What is the vertical distance |y₂ − y₁| between these two points?`,
      options: [
        {
          id: '4a',
          text: `${verticalDiff} units (|${ptPos2.tempY} − (${ptNeg6.tempY})| = ${verticalDiff})`,
          isCorrect: true,
          explanation: `Correct! To find vertical distance on a coordinate graph, calculate |y₂ − y₁|: |${ptPos2.tempY} − (${ptNeg6.tempY})| = ${verticalDiff}.`,
        },
        {
          id: '4b',
          text: `${Math.abs(ptPos2.tempY)} units`,
          isCorrect: false,
          explanation: `Incorrect. You must find the total distance between the highest point (${ptPos2.tempY}) and lowest point (${ptNeg6.tempY}).`,
        },
        {
          id: '4c',
          text: `${ptPos2.x - ptNeg6.x} units`,
          isCorrect: false,
          explanation: `Incorrect. That is the horizontal distance along x (8 hours), not the vertical distance along y.`,
        },
        {
          id: '4d',
          text: `0 units`,
          isCorrect: false,
          explanation: `Incorrect. The two points have different y-values, so the distance is greater than 0.`,
        },
      ],
    },
  ];
}
