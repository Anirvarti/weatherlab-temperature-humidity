/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { WeatherSliders } from './types/mathGraph';
import { calculate4QuadrantPoints, getMathQuestions } from './utils/mathData';
import { MathGraphCard } from './components/MathGraphCard';
import { ControlQuadrant } from './components/ControlQuadrant';
import { MathQuestionsQuadrant } from './components/MathQuestionsQuadrant';

export default function App() {
  const [sliders, setSliders] = useState<WeatherSliders>({
    baseTemp: 6,
    tempRange: 8,
    baseHumidity: 50,
  });

  const [selectedX, setSelectedX] = useState<number>(2);
  const [targetHighlightX, setTargetHighlightX] = useState<number | undefined>(undefined);

  // Calculate 4-quadrant points
  const points = useMemo(() => calculate4QuadrantPoints(sliders), [sliders]);

  // Generate 4 math questions
  const questions = useMemo(() => getMathQuestions(points), [points]);

  const handleUpdateSliders = (newSliders: Partial<WeatherSliders>) => {
    setSliders((prev) => ({
      ...prev,
      ...newSliders,
    }));
  };

  return (
    <div className="min-h-screen bg-slate-100 p-3 sm:p-5 flex flex-col justify-between">
      {/* Header */}
      <header className="max-w-7xl w-full mx-auto pb-3 flex items-center justify-between border-b border-slate-200">
        <div>
          <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            4-Quadrant Graphs & Weather Coordinates
          </h1>
          <p className="text-xs text-slate-500">
            Graph 1 (Temperature) & Graph 2 (Humidity) plotted across Quadrants I, II, III, and IV
          </p>
        </div>
        <div className="text-xs font-mono font-bold bg-white border border-slate-200 px-3 py-1 rounded-md text-slate-800 shadow-2xs">
          Selected: x = {selectedX > 0 ? `+${selectedX}` : selectedX}
        </div>
      </header>

      {/* Main Grid: 2 Graphs + Controls + Math Questions */}
      <main className="max-w-7xl w-full mx-auto my-3 flex-1 grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
        {/* Graph 1: Temperature in 4 Quadrants */}
        <div className="h-full">
          <MathGraphCard
            title="Graph 1: Temperature vs Time (4 Quadrants)"
            graphType="temp"
            data={points}
            selectedX={selectedX}
            onSelectX={setSelectedX}
            targetHighlightX={targetHighlightX}
          />
        </div>

        {/* Graph 2: Humidity in 4 Quadrants */}
        <div className="h-full">
          <MathGraphCard
            title="Graph 2: Humidity vs Time (4 Quadrants)"
            graphType="humidity"
            data={points}
            selectedX={selectedX}
            onSelectX={setSelectedX}
            targetHighlightX={targetHighlightX}
          />
        </div>

        {/* Sliders & Coordinate Data Table */}
        <div className="h-full">
          <ControlQuadrant
            sliders={sliders}
            data={points}
            selectedX={selectedX}
            onUpdateSliders={handleUpdateSliders}
            onSelectX={setSelectedX}
          />
        </div>

        {/* 4 Math & Graph Plotting Questions */}
        <div className="h-full">
          <MathQuestionsQuadrant
            questions={questions}
            onHighlightTargetX={setTargetHighlightX}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl w-full mx-auto text-center text-[11px] text-slate-500 pt-2 border-t border-slate-200">
        Coordinate Plane (x, y) · Quadrants I (+, +), II (−, +), III (−, −), IV (+, −)
      </footer>
    </div>
  );
}
