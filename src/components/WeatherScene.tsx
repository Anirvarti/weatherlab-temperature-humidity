import React from 'react';
import { HourlyData, WeatherSettings } from '../types/weather';
import { Sun, Moon, Cloud, Droplets, Thermometer, Wind, Sparkles } from 'lucide-react';

interface WeatherSceneProps {
  currentData: HourlyData;
  settings: WeatherSettings;
  onHourChange: (hour: number) => void;
}

export const WeatherScene: React.FC<WeatherSceneProps> = ({
  currentData,
  settings,
  onHourChange,
}) => {
  const { hour, temperatureC, temperatureF, humidity, hasDew, isDaytime } = currentData;
  const isF = settings.unit === 'F';
  const displayTemp = isF ? `${temperatureF}°F` : `${temperatureC}°C`;

  // Sun / Moon positioning along an arc
  // Sun travels from hour 6 (left: 10%) to hour 12 (top: 15%, center: 50%) to hour 19 (right: 90%)
  let celestialLeft = 50;
  let celestialTop = 30;
  let isSun = false;

  if (hour >= 6 && hour <= 19) {
    isSun = true;
    const dayProgress = (hour - 6) / 13; // 0 at 6 AM, 1 at 7 PM
    celestialLeft = 10 + dayProgress * 80;
    // Parabolic arc for height: highest (lowest top value) at noon
    const arcHeight = Math.sin(dayProgress * Math.PI);
    celestialTop = 55 - arcHeight * 40; // 55% at horizon, 15% at noon
  } else {
    isSun = false;
    // Moon travels between 20:00 and 05:00
    const nightProgress = hour >= 20 ? (hour - 20) / 10 : (hour + 4) / 10;
    celestialLeft = 10 + nightProgress * 80;
    const arcHeight = Math.sin(nightProgress * Math.PI);
    celestialTop = 55 - arcHeight * 35;
  }

  // Sky background styling based on time
  const getSkyStyle = () => {
    if (hour >= 5 && hour < 7) {
      // Dawn
      return 'from-amber-200 via-rose-300 to-sky-400';
    } else if (hour >= 7 && hour < 11) {
      // Morning
      return 'from-sky-300 via-sky-200 to-blue-300';
    } else if (hour >= 11 && hour < 16) {
      // Midday peak
      return 'from-sky-400 via-sky-300 to-blue-400';
    } else if (hour >= 16 && hour < 19) {
      // Sunset
      return 'from-amber-400 via-orange-400 to-indigo-600';
    } else if (hour >= 19 && hour < 21) {
      // Twilight
      return 'from-indigo-600 via-purple-700 to-slate-900';
    } else {
      // Deep night
      return 'from-slate-900 via-indigo-950 to-slate-900';
    }
  };

  // Weather Character description
  let avatarEmoji = '🧑‍🔬';
  let characterThought = '';
  if (hasDew) {
    avatarEmoji = '🧤';
    characterThought = "Brrr, chilly morning! Look at the grass — it's covered in dewdrops!";
  } else if (temperatureC >= 29) {
    avatarEmoji = '😎';
    characterThought = 'Whew, afternoon peak heat! The air is warm and the relative humidity feels low.';
  } else if (settings.cloudCover >= 80) {
    avatarEmoji = '🧥';
    characterThought = 'Heavy cloud cover today! The clouds block the sun and keep temperature steady.';
  } else if (hour >= 21 || hour <= 4) {
    avatarEmoji = '😴';
    characterThought = 'Quiet night sky. Heat has radiated into space, so the air is cooling down.';
  } else {
    avatarEmoji = '😊';
    characterThought = 'Pleasant day! Watch how temperature and humidity dance on the graph below.';
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      {/* Sky Canvas Illustration */}
      <div
        className={`relative h-44 sm:h-52 w-full bg-gradient-to-b ${getSkyStyle()} transition-colors duration-700 p-4 overflow-hidden select-none`}
      >
        {/* Night Stars */}
        {!isDaytime && (
          <div className="absolute inset-0 opacity-70 pointer-events-none">
            <span className="absolute top-4 left-10 text-white text-xs animate-pulse">✦</span>
            <span className="absolute top-12 left-1/4 text-amber-200 text-xs">★</span>
            <span className="absolute top-6 left-1/2 text-white text-xs animate-pulse">✦</span>
            <span className="absolute top-16 right-1/4 text-white text-xs">★</span>
            <span className="absolute top-8 right-12 text-amber-100 text-xs animate-pulse">✦</span>
          </div>
        )}

        {/* Celestial Body: Sun or Moon */}
        <div
          className="absolute transition-all duration-500 ease-out -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{ left: `${celestialLeft}%`, top: `${celestialTop}%` }}
        >
          {isSun ? (
            <div className="relative">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-amber-300 shadow-lg shadow-amber-300/60 border-2 border-amber-100 flex items-center justify-center animate-spin-slow">
                <Sun className="w-7 h-7 sm:w-8 sm:h-8 text-amber-600" />
              </div>
              {/* Sun rays glow */}
              <div className="absolute inset-0 -m-3 rounded-full bg-amber-400/20 blur-sm pointer-events-none" />
            </div>
          ) : (
            <div className="relative">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-100 shadow-lg shadow-indigo-300/40 border border-slate-200 flex items-center justify-center">
                <Moon className="w-6 h-6 text-indigo-900 fill-indigo-100" />
              </div>
              <div className="absolute inset-0 -m-2 rounded-full bg-blue-300/20 blur-sm pointer-events-none" />
            </div>
          )}
        </div>

        {/* Clouds based on Cloud Cover Slider */}
        {settings.cloudCover > 10 && (
          <div
            className="absolute top-4 left-6 transition-opacity duration-500 pointer-events-none"
            style={{ opacity: Math.min(1, settings.cloudCover / 80) }}
          >
            <div className="flex items-center text-white/90 drop-shadow-sm">
              <Cloud className="w-12 h-12 fill-white/80" />
            </div>
          </div>
        )}
        {settings.cloudCover > 40 && (
          <div
            className="absolute top-8 right-16 transition-opacity duration-500 pointer-events-none"
            style={{ opacity: Math.min(1, (settings.cloudCover - 20) / 70) }}
          >
            <div className="flex items-center text-white/85 drop-shadow-sm">
              <Cloud className="w-16 h-16 fill-white/70" />
            </div>
          </div>
        )}
        {settings.cloudCover > 70 && (
          <div className="absolute top-2 left-1/3 transition-opacity duration-500 pointer-events-none opacity-80">
            <Cloud className="w-20 h-20 fill-white/75 text-slate-100" />
          </div>
        )}

        {/* Rolling Green Hills Ground */}
        <div className="absolute bottom-0 left-0 right-0 h-16 sm:h-20 pointer-events-none">
          {/* Back hill */}
          <svg
            className="absolute bottom-0 w-full h-16 text-emerald-700/80"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M0,40 C300,10 600,60 1200,20 L1200,120 L0,120 Z"
              fill="currentColor"
            />
          </svg>
          {/* Front hill */}
          <svg
            className="absolute bottom-0 w-full h-12 text-emerald-600"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M0,60 C400,20 800,80 1200,30 L1200,120 L0,120 Z"
              fill="currentColor"
            />
          </svg>

          {/* Morning Dew Indicator on Grass */}
          {hasDew && (
            <div className="absolute bottom-2 left-12 right-12 flex justify-around text-cyan-200 pointer-events-none">
              <span className="flex items-center gap-1 text-[11px] font-semibold bg-cyan-900/80 px-2 py-0.5 rounded-full text-cyan-100 shadow-sm animate-bounce">
                <Sparkles className="w-3 h-3 text-cyan-300" /> Morning Dew Forming!
              </span>
            </div>
          )}
        </div>

        {/* Interactive Time Badge on Sky */}
        <div className="absolute top-3 left-3 bg-slate-900/60 backdrop-blur-md text-white px-3 py-1.5 rounded-xl border border-white/20 text-xs font-semibold flex items-center gap-2">
          <span>{currentData.timeLabel}</span>
          <span className="text-white/40">·</span>
          <span>{isDaytime ? 'Daytime' : 'Nighttime'}</span>
        </div>

        {/* Live Gauges Overlay on Sky */}
        <div className="absolute top-3 right-3 flex items-center gap-2">
          <div className="bg-amber-500/90 text-white backdrop-blur-md px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm">
            <Thermometer className="w-3.5 h-3.5" />
            <span className="font-mono-numbers">{displayTemp}</span>
          </div>
          <div className="bg-sky-600/90 text-white backdrop-blur-md px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm">
            <Droplets className="w-3.5 h-3.5" />
            <span className="font-mono-numbers">{humidity}%</span>
          </div>
        </div>
      </div>

      {/* Student Character & Interactive Explanation Strip */}
      <div className="p-4 bg-slate-50/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white shadow-xs border border-slate-200 flex items-center justify-center text-2xl shrink-0">
            {avatarEmoji}
          </div>
          <div>
            <div className="text-xs font-bold text-slate-800">
              Leo the Weather Detective says:
            </div>
            <p className="text-xs text-slate-600 leading-relaxed max-w-xl">
              {characterThought}
            </p>
          </div>
        </div>

        {/* Quick jump time buttons */}
        <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0">
          <span className="text-[11px] text-slate-600 font-medium mr-1 hidden md:inline">
            Jump to:
          </span>
          <button
            onClick={() => onHourChange(6)}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all ${
              hour === 6
                ? 'bg-amber-100 border-amber-300 text-amber-900 font-bold shadow-xs'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            Dawn 6 AM
          </button>
          <button
            onClick={() => onHourChange(12)}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all ${
              hour === 12
                ? 'bg-amber-100 border-amber-300 text-amber-900 font-bold shadow-xs'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            Noon 12 PM
          </button>
          <button
            onClick={() => onHourChange(15)}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all ${
              hour === 15
                ? 'bg-amber-100 border-amber-300 text-amber-900 font-bold shadow-xs'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            Peak 3 PM
          </button>
          <button
            onClick={() => onHourChange(0)}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all ${
              hour === 0
                ? 'bg-amber-100 border-amber-300 text-amber-900 font-bold shadow-xs'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            Midnight
          </button>
        </div>
      </div>
    </div>
  );
};
