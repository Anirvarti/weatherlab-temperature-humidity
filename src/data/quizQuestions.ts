import { QuizQuestion } from '../types/weather';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    title: 'Question 1: Finding Peak Heat',
    question: 'Look at the orange Temperature line. At what time of day is the temperature usually the HIGHEST?',
    hint: 'Look for the highest crest (peak) on the orange curve. Notice whether it is at noon or a bit later in the afternoon.',
    graphHighlightRange: [14, 16],
    options: [
      {
        id: '1a',
        text: '6:00 AM (Dawn / Sunrise)',
        isCorrect: false,
        explanation: 'Not quite! 6:00 AM is actually when the temperature is at its lowest because the ground cooled off all night.',
      },
      {
        id: '1b',
        text: '12:00 PM (Noon / Lunchtime)',
        isCorrect: false,
        explanation: 'Close! The sun is highest at noon, but the ground takes time to heat up and warm the atmosphere.',
      },
      {
        id: '1c',
        text: '3:00 PM - 4:00 PM (Mid-Afternoon)',
        isCorrect: true,
        explanation: 'Spot on! Even though the sun is highest at noon, the ground absorbs heat and keeps radiating warmth into the air for several hours. This is called thermal lag!',
      },
      {
        id: '1d',
        text: '11:00 PM (Late Night)',
        isCorrect: false,
        explanation: 'At 11:00 PM the sun has set and heat has escaped back into space, so it is quite cool.',
      },
    ],
  },
  {
    id: 2,
    title: 'Question 2: The Sponge Secret (Inverse Rule)',
    question: 'Compare the orange Temperature curve and the cyan Humidity curve. What happens to humidity when the temperature rises in the afternoon?',
    hint: 'Watch how the two lines move between 9:00 AM and 3:00 PM. Do they go in the same direction or opposite directions?',
    graphHighlightRange: [11, 16],
    options: [
      {
        id: '2a',
        text: 'Humidity rises together with temperature (same direction)',
        isCorrect: false,
        explanation: 'Check the graph again! Notice how the blue line dips down while the orange line goes up.',
      },
      {
        id: '2b',
        text: 'Humidity drops DOWN as temperature goes UP (Opposite directions!)',
        isCorrect: true,
        explanation: 'Bingo! This is an "inverse relationship". Warm afternoon air acts like a giant sponge that can hold way more moisture, so the relative percentage goes down!',
      },
      {
        id: '2c',
        text: 'Humidity stays a completely flat straight line',
        isCorrect: false,
        explanation: 'Look closely at the cyan curve — it has a noticeable valley in the afternoon!',
      },
      {
        id: '2d',
        text: 'Humidity vanishes to zero percent',
        isCorrect: false,
        explanation: 'The air still has water vapor in it; the percentage just drops because warm air has much greater capacity.',
      },
    ],
  },
  {
    id: 3,
    title: 'Question 3: Morning Dew Detective',
    question: 'Dew forms on grass blades when air cools down and relative humidity reaches near 100%. Based on your graph, when are you most likely to see morning dew?',
    hint: 'Look for the time where the blue Humidity curve is at its very highest point and the orange temperature is lowest.',
    graphHighlightRange: [5, 7],
    options: [
      {
        id: '3a',
        text: '3:00 PM (Hottest time of day)',
        isCorrect: false,
        explanation: 'At 3:00 PM the air is warm and dry, so any water droplets quickly evaporate into invisible gas.',
      },
      {
        id: '3b',
        text: '6:00 AM (Coldest dawn right before sunrise)',
        isCorrect: true,
        explanation: 'Awesome detective work! Right before sunrise, the air has chilled down to its lowest temperature. The cold air "sponge" shrinks and can no longer hold all the water vapor, condensing into sparkling dew!',
      },
      {
        id: '3c',
        text: '12:00 PM (Midday bright sun)',
        isCorrect: false,
        explanation: 'By noon, the sun has evaporated morning dew away into water vapor.',
      },
      {
        id: '3d',
        text: '8:00 PM (Dinner time)',
        isCorrect: false,
        explanation: 'While it is cooling down at 8:00 PM, maximum cooling takes all night until dawn.',
      },
    ],
  },
  {
    id: 4,
    title: 'Question 4: Cloud Blanket Experiment',
    question: 'Try dragging the "Cloud Cover" slider up to 90% (Overcast). What happens to the daily temperature curve on the graph?',
    hint: 'Watch how high the peak goes and how low the valley drops as you add more clouds.',
    graphHighlightRange: [0, 23],
    options: [
      {
        id: '4a',
        text: 'The temperature swing gets MUCH BIGGER with huge spikes',
        isCorrect: false,
        explanation: 'Actually, clear skies have bigger swings. Try moving the slider to see what clouds do!',
      },
      {
        id: '4b',
        text: 'The temperature curve gets FLATTER (smaller difference between day & night)',
        isCorrect: true,
        explanation: 'Correct! Clouds act like an umbrella during the day (blocking direct sunlight) and like a cozy blanket at night (trapping heat near the ground). This keeps temperatures much more even!',
      },
      {
        id: '4c',
        text: 'The temperature instantly drops to absolute zero',
        isCorrect: false,
        explanation: 'Clouds moderate the weather rather than freezing everything!',
      },
      {
        id: '4d',
        text: 'The blue humidity line disappears completely',
        isCorrect: false,
        explanation: 'Cloudy and overcast days actually have higher and steadier humidity!',
      },
    ],
  },
];
