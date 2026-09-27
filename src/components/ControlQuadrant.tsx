import React from 'react';
import { Point4Q, WeatherSliders } from '../types/mathGraph';
import { RotateCcw, Sliders } from 'lucide-react';

interface ControlQuadrantProps {
  sliders: WeatherSliders;
  data: Point4Q[];
  selectedX: number;
  onUpdateSliders: (newSliders: Partial<WeatherSliders>) => void;
  onSelectX: (x: number) => void;
}

export const ControlQuadrant: React.FC<ControlQuadrantProps> = ({
  sliders,
  data,
  selectedX,
  onUpdateSliders,
  onSelectX,
}) => {
  const handleReset = () => {
    onUpdateSliders({
      baseTemp: 6,
      tempRange: 8,
      baseHumidity: 50,
    });
    onSelectX(2);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">
            Weather Sliders & Coordinates
          </h3>
          <span className="text-[11px] text-slate-500">
            Shift values across the X-axis (y = 0) into negative & positive quadrants
          </span>
        </div>
        <button
          onClick={handleReset}
          className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-3">
        {/* Base Temperature Slider */}
        <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
          <div className="flex justify-between text-xs font-bold text-slate-700">
            <span>Base Temperature</span>
            <span className="font-mono text-orange-600">{sliders.baseTemp}°C</span>
          </div>
          <input
            type="range"
            min="-5"
            max="15"
            value={sliders.baseTemp}
            onChange={(e) => onUpdateSliders({ baseTemp: parseInt(e.target.value, 10) })}
            className="w-full accent-orange-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
          />
          <div className="text-[10px] text-slate-500">
            Slide below 0 to push points into Quadrants III & IV!
          </div>
        </div>

        {/* Temperature Swing Slider */}
        <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
          <div className="flex justify-between text-xs font-bold text-slate-700">
            <span>Daily Swing (±)</span>
            <span className="font-mono text-orange-600">±{sliders.tempRange}°C</span>
          </div>
          <input
            type="range"
            min="3"
            max="12"
            value={sliders.tempRange}
            onChange={(e) => onUpdateSliders({ tempRange: parseInt(e.target.value, 10) })}
            className="w-full accent-orange-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
          />
          <div className="text-[10px] text-slate-500">
            Changes vertical spread across the axes
          </div>
        </div>

        {/* Base Humidity Slider */}
        <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
          <div className="flex justify-between text-xs font-bold text-slate-700">
            <span>Base Humidity</span>
            <span className="font-mono text-sky-600">{sliders.baseHumidity}%</span>
          </div>
          <input
            type="range"
            min="30"
            max="70"
            value={sliders.baseHumidity}
            onChange={(e) => onUpdateSliders({ baseHumidity: parseInt(e.target.value, 10) })}
            className="w-full accent-sky-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
          />
          <div className="text-[10px] text-slate-500">
            Shifts humidity curve up/down on Graph 2
          </div>
        </div>
      </div>

      {/* Coordinate Table */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700">
          <span>Coordinate Table: (x, y) & Quadrant</span>
          <span className="text-[11px] text-slate-500 font-normal">Click any row to inspect</span>
        </div>
        <div className="max-h-36 overflow-y-auto border border-slate-200 rounded-lg">
          <table className="w-full text-xs text-left font-mono">
            <thead className="bg-slate-100 text-slate-700 sticky top-0 font-bold border-b border-slate-200">
              <tr>
                <th className="py-1 px-2">x (Hours)</th>
                <th className="py-1 px-2">Time</th>
                <th className="py-1 px-2 text-orange-600">Temp (y)</th>
                <th className="py-1 px-2">Temp Quad</th>
                <th className="py-1 px-2 text-sky-600">Hum (y)</th>
                <th className="py-1 px-2">Hum Quad</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.map((d) => {
                const isSelected = d.x === selectedX;
                return (
                  <tr
                    key={`row-${d.x}`}
                    onClick={() => onSelectX(d.x)}
                    className={`cursor-pointer transition-colors ${
                      isSelected ? 'bg-amber-100/70 font-bold text-slate-900' : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <td className="py-1 px-2 font-bold">{d.x > 0 ? `+${d.x}` : d.x}</td>
                    <td className="py-1 px-2 font-sans">{d.timeLabel}</td>
                    <td className="py-1 px-2 text-orange-600">{d.tempY > 0 ? `+${d.tempY}` : d.tempY}°</td>
                    <td className="py-1 px-2 font-sans text-[11px]">
                      {d.tempQuadrant === 'Axis' ? 'Axis' : `Quad ${d.tempQuadrant}`}
                    </td>
                    <td className="py-1 px-2 text-sky-600">{d.humidityY > 0 ? `+${d.humidityY}` : d.humidityY}</td>
                    <td className="py-1 px-2 font-sans text-[11px]">
                      {d.humQuadrant === 'Axis' ? 'Axis' : `Quad ${d.humQuadrant}`}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
