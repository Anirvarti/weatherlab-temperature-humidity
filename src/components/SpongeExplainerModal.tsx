import React, { useState } from 'react';
import { X, Droplets, Thermometer, Sparkles } from 'lucide-react';

interface SpongeExplainerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SpongeExplainerModal: React.FC<SpongeExplainerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [demoTemp, setDemoTemp] = useState<number>(30); // 10 to 35

  if (!isOpen) return null;

  // Sponge size scales with temperature
  // At 10°C: small sponge (scale 0.7)
  // At 35°C: giant sponge (scale 1.35)
  const spongeScale = 0.7 + ((demoTemp - 10) / 25) * 0.65;
  // Water capacity: e.g. 10 drops at 10°C, 35 drops at 35°C
  const maxCapacity = Math.round(10 + ((demoTemp - 10) / 25) * 30);
  const currentWaterDrops = 10; // fixed amount of actual water vapor in the room
  const relativeHumidityPercent = Math.min(
    100,
    Math.round((currentWaterDrops / maxCapacity) * 100)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          title="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2.5 mb-2">
          <span className="p-2 rounded-xl bg-amber-100 text-amber-800 text-xl">🧽</span>
          <div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
              The Famous &quot;Air Sponge&quot; Secret
            </h3>
            <p className="text-xs text-slate-500">
              Why does humidity drop when it gets hot? Move the slider to test!
            </p>
          </div>
        </div>

        {/* Interactive Sponge Experiment */}
        <div className="my-5 p-5 bg-gradient-to-b from-slate-50 to-amber-50/40 rounded-2xl border border-slate-200/80 text-center">
          {/* Interactive Temperature Slider */}
          <div className="max-w-xs mx-auto mb-6">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1.5">
              <span className="flex items-center gap-1 text-orange-600">
                <Thermometer className="w-4 h-4" /> Air Temperature:
              </span>
              <span className="font-mono-numbers text-orange-700 bg-orange-100 px-2 py-0.5 rounded-md">
                {demoTemp}°C
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="35"
              value={demoTemp}
              onChange={(e) => setDemoTemp(parseInt(e.target.value, 10))}
              className="w-full accent-orange-500 cursor-pointer h-2 bg-slate-200 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>❄️ 10°C (Cold Morning)</span>
              <span>🔥 35°C (Hot Afternoon)</span>
            </div>
          </div>

          {/* Visual Sponge Graphic */}
          <div className="h-44 flex flex-col items-center justify-center relative">
            {/* The Sponge Container */}
            <div
              className="rounded-2xl bg-amber-300 border-4 border-amber-400 shadow-md p-4 transition-all duration-300 flex flex-col items-center justify-center relative"
              style={{
                width: `${120 * spongeScale}px`,
                height: `${90 * spongeScale}px`,
              }}
            >
              <div className="text-[11px] font-bold text-amber-900 mb-1">
                {demoTemp < 18 ? 'Tiny Sponge (Cold Air)' : 'Giant Sponge (Hot Air)'}
              </div>
              <div className="text-[10px] text-amber-800 font-medium">
                Max Capacity: {maxCapacity} units
              </div>
              {/* Moisture Droplets inside sponge */}
              <div className="flex items-center justify-center gap-1 mt-1 text-sky-700">
                <Droplets className="w-4 h-4 fill-sky-600" />
                <span className="text-[11px] font-bold">{currentWaterDrops} units moisture</span>
              </div>
            </div>

            {/* Dew overflow alert when 100% full */}
            {relativeHumidityPercent >= 100 && (
              <div className="mt-2 text-xs font-bold text-cyan-800 bg-cyan-100 px-3 py-1 rounded-full border border-cyan-300 flex items-center gap-1 animate-bounce">
                <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
                <span>Sponge is 100% full! Water spills out as Morning Dew!</span>
              </div>
            )}
          </div>

          {/* Live Calculations */}
          <div className="grid grid-cols-2 gap-3 mt-4 text-xs font-semibold max-w-sm mx-auto">
            <div className="p-2.5 bg-white rounded-xl border border-slate-200">
              <div className="text-slate-500 text-[10px]">Actual Water in Air</div>
              <div className="text-sm font-bold text-slate-800">10 units (Fixed)</div>
            </div>
            <div className="p-2.5 bg-sky-50 rounded-xl border border-sky-200">
              <div className="text-sky-700 text-[10px]">Relative Humidity (%)</div>
              <div className="text-sm font-bold text-sky-800 font-mono-numbers">
                {relativeHumidityPercent}% Full
              </div>
            </div>
          </div>
        </div>

        {/* Explanation Prose */}
        <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
          <p>
            <strong>Think of warm air like a hungry giant sponge:</strong> As the sun heats the air,
            the air molecules spread apart, allowing the air to hold vastly more water vapor. Because the
            capacity grew so much, the <em>percentage</em> of how full the air is (Relative Humidity)
            drops down!
          </p>
          <p>
            When the air chills at night, the sponge shrinks. The same amount of water suddenly fills
            the small sponge completely (100% humidity), causing liquid water to condense onto grass
            blades as <strong>morning dew</strong>!
          </p>
        </div>

        {/* Got it button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 shadow-xs"
          >
            I Understand the Sponge Secret!
          </button>
        </div>
      </div>
    </div>
  );
};
