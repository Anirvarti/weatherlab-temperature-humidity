import React, { useEffect } from 'react';
import { WeatherSettings, WeatherPreset } from '../types/weather';
import { WEATHER_PRESETS, formatHour, cToF } from '../utils/weatherPhysics';
import {
  Play,
  Pause,
  RotateCcw,
  SunMedium,
  CloudSun,
  Droplets,
  FastForward,
  Flame,
} from 'lucide-react';

interface WeatherControlsProps {
  settings: WeatherSettings;
  onUpdateSettings: (newSettings: Partial<WeatherSettings>) => void;
  selectedHour: number;
  onHourChange: (hour: number) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
}

export const WeatherControls: React.FC<WeatherControlsProps> = ({
  settings,
  onUpdateSettings,
  selectedHour,
  onHourChange,
  isPlaying,
  onTogglePlay,
}) => {
  const isF = settings.unit === 'F';

  // Apply a preset
  const handleApplyPreset = (preset: WeatherPreset) => {
    onUpdateSettings({
      baseTempC: preset.settings.baseTempC,
      moistureLevel: preset.settings.moistureLevel,
      cloudCover: preset.settings.cloudCover,
    });
  };

  const resetAll = () => {
    onUpdateSettings({
      baseTempC: 28,
      moistureLevel: 45,
      cloudCover: 15,
      unit: 'C',
    });
    onHourChange(15);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 sm:p-6 space-y-6">
      {/* Section 1: Presets for Fast Fun */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Weather Presets
            </h3>
            <span className="text-xs text-slate-500 font-medium">· Click to test</span>
          </div>
          <button
            onClick={resetAll}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 transition-colors"
            title="Reset to default settings"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {WEATHER_PRESETS.map((preset) => {
            const isMatch =
              settings.baseTempC === preset.settings.baseTempC &&
              settings.moistureLevel === preset.settings.moistureLevel &&
              settings.cloudCover === preset.settings.cloudCover;

            return (
              <button
                key={preset.id}
                onClick={() => handleApplyPreset(preset)}
                className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  isMatch
                    ? 'bg-amber-50/80 border-amber-300 ring-2 ring-amber-200 shadow-xs'
                    : 'bg-slate-50/60 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-1.5 text-sm font-bold text-slate-800">
                  <span>{preset.emoji}</span>
                  <span className="truncate">{preset.name}</span>
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">
                  {preset.tagline}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Section 2: Time of Day Scrubber & Playback */}
      <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={onTogglePlay}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs ${
                isPlaying
                  ? 'bg-amber-600 text-white hover:bg-amber-700'
                  : 'bg-slate-900 text-white hover:bg-slate-800'
              }`}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  <span>Pause Time</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Simulate 24 Hours</span>
                </>
              )}
            </button>
            <span className="text-xs text-slate-600 font-medium">
              Current Time: <strong className="text-slate-900">{formatHour(selectedHour)}</strong>
            </span>
          </div>

          {/* Unit Toggle */}
          <div className="flex items-center gap-1 p-0.5 bg-slate-200 rounded-lg text-xs">
            <button
              onClick={() => onUpdateSettings({ unit: 'C' })}
              className={`px-2 py-0.5 rounded-md font-semibold transition-all ${
                !isF ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              °C
            </button>
            <button
              onClick={() => onUpdateSettings({ unit: 'F' })}
              className={`px-2 py-0.5 rounded-md font-semibold transition-all ${
                isF ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              °F
            </button>
          </div>
        </div>

        {/* Time Slider */}
        <div className="space-y-1">
          <input
            type="range"
            min="0"
            max="23"
            value={selectedHour}
            onChange={(e) => onHourChange(parseInt(e.target.value, 10))}
            className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-200 rounded-lg"
          />
          <div className="flex justify-between text-[11px] text-slate-600 font-medium px-0.5">
            <span>12 AM (Midnight)</span>
            <span>6 AM (Dawn)</span>
            <span>12 PM (Noon)</span>
            <span>3 PM (Peak)</span>
            <span>6 PM (Sunset)</span>
            <span>11 PM</span>
          </div>
        </div>
      </div>

      {/* Section 3: Weather Simulation Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Slider 1: Peak Afternoon Heat */}
        <div className="space-y-2 p-3 bg-orange-50/40 rounded-xl border border-orange-100">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-orange-900 flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-orange-600" />
              Peak Afternoon Heat
            </span>
            <span className="font-mono-numbers font-bold text-orange-700 bg-orange-100 px-2 py-0.5 rounded-md">
              {isF ? `${cToF(settings.baseTempC)}°F` : `${settings.baseTempC}°C`}
            </span>
          </div>
          <input
            type="range"
            min="14"
            max="40"
            value={settings.baseTempC}
            onChange={(e) => onUpdateSettings({ baseTempC: parseInt(e.target.value, 10) })}
            className="w-full accent-orange-600 cursor-pointer h-2 bg-orange-200/60 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-orange-700 font-medium">
            <span>Cool (14°C / 57°F)</span>
            <span>Sizzling (40°C / 104°F)</span>
          </div>
          <p className="text-[11px] text-orange-800 leading-snug">
            Shifts how hot the afternoon peak reaches. Notice how hotter air pulls humidity lower!
          </p>
        </div>

        {/* Slider 2: Moisture / Water Vapor */}
        <div className="space-y-2 p-3 bg-sky-50/40 rounded-xl border border-sky-100">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-sky-900 flex items-center gap-1.5">
              <Droplets className="w-4 h-4 text-sky-600" />
              Moisture in the Air
            </span>
            <span className="font-mono-numbers font-bold text-sky-700 bg-sky-100 px-2 py-0.5 rounded-md">
              {settings.moistureLevel}%
            </span>
          </div>
          <input
            type="range"
            min="10"
            max="90"
            value={settings.moistureLevel}
            onChange={(e) => onUpdateSettings({ moistureLevel: parseInt(e.target.value, 10) })}
            className="w-full accent-sky-600 cursor-pointer h-2 bg-sky-200/60 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-sky-700 font-medium">
            <span>Dry Desert (10%)</span>
            <span>Humid Coast (90%)</span>
          </div>
          <p className="text-[11px] text-sky-800 leading-snug">
            Changes total water vapor present. High moisture triggers morning dew when cool!
          </p>
        </div>

        {/* Slider 3: Cloud Cover */}
        <div className="space-y-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
              <CloudSun className="w-4 h-4 text-slate-600" />
              Cloud Cover
            </span>
            <span className="font-mono-numbers font-bold text-slate-700 bg-slate-200 px-2 py-0.5 rounded-md">
              {settings.cloudCover}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={settings.cloudCover}
            onChange={(e) => onUpdateSettings({ cloudCover: parseInt(e.target.value, 10) })}
            className="w-full accent-slate-700 cursor-pointer h-2 bg-slate-200 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-700 font-medium">
            <span>Clear Sky (0%)</span>
            <span>Overcast (100%)</span>
          </div>
          <p className="text-[11px] text-slate-700 leading-snug">
            Clouds act like a blanket: higher clouds flatten the graph into a smoother line.
          </p>
        </div>
      </div>
    </div>
  );
};
