import React, { useState, useRef, useMemo } from 'react';
import { HourlyData, WeatherSettings } from '../types/weather';
import { Thermometer, Droplets, Info, Eye, Layers } from 'lucide-react';

interface InteractiveGraphProps {
  data: HourlyData[];
  selectedHour: number;
  onSelectHour: (hour: number) => void;
  settings: WeatherSettings;
  highlightRange?: [number, number];
}

export type GraphViewMode = 'combined' | 'temperature' | 'humidity' | 'side-by-side';

export const InteractiveGraph: React.FC<InteractiveGraphProps> = ({
  data,
  selectedHour,
  onSelectHour,
  settings,
  highlightRange,
}) => {
  const [viewMode, setViewMode] = useState<GraphViewMode>('combined');
  const [hoveredHour, setHoveredHour] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const isF = settings.unit === 'F';

  // SVG dimensions & padding
  const width = 850;
  const height = 360;
  const padding = { top: 40, right: 60, bottom: 50, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Temperature domain calculation
  const tempValues = data.map((d) => (isF ? d.temperatureF : d.temperatureC));
  const minTempRaw = Math.min(...tempValues);
  const maxTempRaw = Math.max(...tempValues);

  // Round domain nicely with buffer
  const minTemp = Math.floor(minTempRaw / 5) * 5 - 5;
  const maxTemp = Math.ceil(maxTempRaw / 5) * 5 + 5;

  // Humidity domain is fixed 0 to 100%
  const minHum = 0;
  const maxHum = 100;

  // Coordinate mappers
  const getX = (hour: number) => {
    return padding.left + (hour / 23) * chartWidth;
  };

  const getTempY = (temp: number) => {
    const fraction = (temp - minTemp) / (maxTemp - minTemp || 1);
    return padding.top + chartHeight - fraction * chartHeight;
  };

  const getHumY = (hum: number) => {
    const fraction = (hum - minHum) / (maxHum - minHum || 1);
    return padding.top + chartHeight - fraction * chartHeight;
  };

  // Generate smooth SVG paths
  const createSmoothPath = (points: { x: number; y: number }[]) => {
    if (points.length === 0) return '';
    if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i === 0 ? i : i - 1];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[i + 2 < points.length ? i + 2 : i + 1];

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return path;
  };

  const tempPoints = useMemo(() => {
    return data.map((d) => ({
      x: getX(d.hour),
      y: getTempY(isF ? d.temperatureF : d.temperatureC),
    }));
  }, [data, isF, minTemp, maxTemp]);

  const humPoints = useMemo(() => {
    return data.map((d) => ({
      x: getX(d.hour),
      y: getHumY(d.humidity),
    }));
  }, [data]);

  const tempLinePath = useMemo(() => createSmoothPath(tempPoints), [tempPoints]);
  const humLinePath = useMemo(() => createSmoothPath(humPoints), [humPoints]);

  const tempAreaPath = useMemo(() => {
    if (tempPoints.length === 0) return '';
    const bottomY = padding.top + chartHeight;
    const first = tempPoints[0];
    const last = tempPoints[tempPoints.length - 1];
    return `${tempLinePath} L ${last.x} ${bottomY} L ${first.x} ${bottomY} Z`;
  }, [tempLinePath, tempPoints, chartHeight]);

  const humAreaPath = useMemo(() => {
    if (humPoints.length === 0) return '';
    const bottomY = padding.top + chartHeight;
    const first = humPoints[0];
    const last = humPoints[humPoints.length - 1];
    return `${humLinePath} L ${last.x} ${bottomY} L ${first.x} ${bottomY} Z`;
  }, [humLinePath, humPoints, chartHeight]);

  // Find peak temp and lowest humidity
  const peakTempIndex = tempValues.indexOf(maxTempRaw);
  const minTempIndex = tempValues.indexOf(minTempRaw);
  const lowestHumVal = Math.min(...data.map((d) => d.humidity));
  const lowestHumIndex = data.findIndex((d) => d.humidity === lowestHumVal);
  const highestHumVal = Math.max(...data.map((d) => d.humidity));
  const highestHumIndex = data.findIndex((d) => d.humidity === highestHumVal);

  // Handle pointer scrub
  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const svgX = (clientX / rect.width) * width;

    // Calculate closest hour (0 to 23)
    const relativeX = svgX - padding.left;
    const hourFloat = (relativeX / chartWidth) * 23;
    const clampedHour = Math.max(0, Math.min(23, Math.round(hourFloat)));
    setHoveredHour(clampedHour);

    if (e.buttons === 1) {
      onSelectHour(clampedHour);
    }
  };

  const handlePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const svgX = (clientX / rect.width) * width;
    const relativeX = svgX - padding.left;
    const hourFloat = (relativeX / chartWidth) * 23;
    const clampedHour = Math.max(0, Math.min(23, Math.round(hourFloat)));
    onSelectHour(clampedHour);
  };

  const activeHour = hoveredHour !== null ? hoveredHour : selectedHour;
  const activeData = data[activeHour] || data[0];

  // Grid tick markers
  const hourTicks = [0, 3, 6, 9, 12, 15, 18, 21, 23];
  const tempStep = Math.max(5, Math.round((maxTemp - minTemp) / 5));
  const tempTicks: number[] = [];
  for (let t = minTemp; t <= maxTemp; t += tempStep) {
    tempTicks.push(t);
  }
  const humTicks = [0, 20, 40, 60, 80, 100];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 sm:p-6">
      {/* Top Header Controls: Mode Toggles & Legend */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              24-Hour Weather Interactive Graph
            </h2>
            <span className="text-xs text-slate-500 font-medium">· Grade 6 Lab</span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Hover or drag across the graph to explore how temperature and humidity interact.
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100/90 rounded-xl self-start md:self-auto">
          <button
            onClick={() => setViewMode('combined')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              viewMode === 'combined'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Combined View
          </button>
          <button
            onClick={() => setViewMode('temperature')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              viewMode === 'temperature'
                ? 'bg-white text-amber-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Temperature
          </button>
          <button
            onClick={() => setViewMode('humidity')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              viewMode === 'humidity'
                ? 'bg-white text-sky-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Humidity
          </button>
        </div>
      </div>

      {/* Visual Color Legend Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 py-3 text-xs border-b border-slate-100">
        <div className="flex items-center gap-4 sm:gap-6">
          {(viewMode === 'combined' || viewMode === 'temperature') && (
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-md bg-amber-500 shadow-xs flex items-center justify-center">
                <Thermometer className="w-2.5 h-2.5 text-white" />
              </span>
              <span className="font-semibold text-amber-700">
                Temperature ({isF ? '°F' : '°C'}) — Left Axis
              </span>
            </div>
          )}

          {(viewMode === 'combined' || viewMode === 'humidity') && (
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-md bg-sky-500 shadow-xs flex items-center justify-center">
                <Droplets className="w-2.5 h-2.5 text-white" />
              </span>
              <span className="font-semibold text-sky-700">
                Relative Humidity (%) — Right Axis
              </span>
            </div>
          )}
        </div>

        {/* Day/Night Band Guide */}
        <div className="flex items-center gap-3 text-slate-500 text-[11px]">
          <span className="inline-flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-xs bg-indigo-50 border border-indigo-200" />
            Nighttime (Cooler)
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-xs bg-amber-50 border border-amber-200" />
            Daytime Sun (Warmer)
          </span>
        </div>
      </div>

      {/* Main SVG Graph Container */}
      <div className="relative mt-3 select-none">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto cursor-crosshair touch-none overflow-visible"
          onPointerMove={handlePointerMove}
          onPointerDown={handlePointerDown}
          onPointerLeave={() => setHoveredHour(null)}
        >
          <defs>
            {/* Gradients */}
            <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F97316" stopOpacity="0.32" />
              <stop offset="100%" stopColor="#F97316" stopOpacity="0.02" />
            </linearGradient>

            <linearGradient id="humGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0284C7" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#0284C7" stopOpacity="0.02" />
            </linearGradient>

            <linearGradient id="lineTempGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#EA580C" />
              <stop offset="50%" stopColor="#F97316" />
              <stop offset="100%" stopColor="#EA580C" />
            </linearGradient>

            <linearGradient id="lineHumGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#0284C7" />
              <stop offset="50%" stopColor="#06B6D4" />
              <stop offset="100%" stopColor="#0284C7" />
            </linearGradient>

            {/* Drop shadow for markers */}
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.15" />
            </filter>
          </defs>

          {/* Background Shading: Night / Day bands */}
          {/* Night band 1: 0:00 to 6:00 */}
          <rect
            x={getX(0)}
            y={padding.top}
            width={getX(6) - getX(0)}
            height={chartHeight}
            fill="#EEF2FF"
            opacity="0.5"
          />
          {/* Day band: 6:00 to 19:00 */}
          <rect
            x={getX(6)}
            y={padding.top}
            width={getX(19) - getX(6)}
            height={chartHeight}
            fill="#FFFBEB"
            opacity="0.6"
          />
          {/* Night band 2: 19:00 to 23:00 */}
          <rect
            x={getX(19)}
            y={padding.top}
            width={getX(23) - getX(19)}
            height={chartHeight}
            fill="#EEF2FF"
            opacity="0.5"
          />

          {/* Question Highlight Band if active */}
          {highlightRange && (
            <rect
              x={getX(highlightRange[0])}
              y={padding.top}
              width={Math.max(12, getX(highlightRange[1]) - getX(highlightRange[0]))}
              height={chartHeight}
              fill="#FDE047"
              opacity="0.25"
              className="animate-pulse"
            />
          )}

          {/* Horizontal Gridlines */}
          {tempTicks.map((temp) => {
            const y = getTempY(temp);
            return (
              <g key={`grid-temp-${temp}`}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={padding.left + chartWidth}
                  y2={y}
                  stroke="#F1F5F9"
                  strokeWidth="1"
                />
              </g>
            );
          })}

          {/* Vertical Hour Tick Lines */}
          {hourTicks.map((h) => {
            const x = getX(h);
            return (
              <line
                key={`vert-${h}`}
                x1={x}
                y1={padding.top}
                x2={x}
                y2={padding.top + chartHeight}
                stroke="#F1F5F9"
                strokeWidth="1"
                strokeDasharray={h === 6 || h === 12 || h === 19 ? '3,3' : undefined}
              />
            );
          })}

          {/* Y Axis Left: Temperature Ticks */}
          {(viewMode === 'combined' || viewMode === 'temperature') && (
            <g className="text-xs font-semibold">
              {tempTicks.map((t) => (
                <text
                  key={`temp-tick-${t}`}
                  x={padding.left - 12}
                  y={getTempY(t) + 4}
                  textAnchor="end"
                  fill="#C2410C"
                  fontSize="11"
                  className="font-mono-numbers"
                >
                  {t}°
                </text>
              ))}
              {/* Axis Label */}
              <text
                x={padding.left - 36}
                y={padding.top - 12}
                textAnchor="start"
                fill="#EA580C"
                fontSize="11"
                fontWeight="700"
              >
                Temp ({isF ? '°F' : '°C'})
              </text>
            </g>
          )}

          {/* Y Axis Right: Humidity Ticks */}
          {(viewMode === 'combined' || viewMode === 'humidity') && (
            <g className="text-xs font-semibold">
              {humTicks.map((h) => (
                <text
                  key={`hum-tick-${h}`}
                  x={padding.left + chartWidth + 12}
                  y={getHumY(h) + 4}
                  textAnchor="start"
                  fill="#0284C7"
                  fontSize="11"
                  className="font-mono-numbers"
                >
                  {h}%
                </text>
              ))}
              {/* Axis Label */}
              <text
                x={padding.left + chartWidth + 12}
                y={padding.top - 12}
                textAnchor="start"
                fill="#0284C7"
                fontSize="11"
                fontWeight="700"
              >
                Humidity (%)
              </text>
            </g>
          )}

          {/* Area Fills */}
          {(viewMode === 'combined' || viewMode === 'temperature') && (
            <path d={tempAreaPath} fill="url(#tempGradient)" />
          )}

          {(viewMode === 'combined' || viewMode === 'humidity') && (
            <path d={humAreaPath} fill="url(#humGradient)" />
          )}

          {/* Curve Lines */}
          {(viewMode === 'combined' || viewMode === 'humidity') && (
            <path
              d={humLinePath}
              fill="none"
              stroke="url(#lineHumGradient)"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {(viewMode === 'combined' || viewMode === 'temperature') && (
            <path
              d={tempLinePath}
              fill="none"
              stroke="url(#lineTempGradient)"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Data Points on Curves */}
          {data.map((d) => {
            const x = getX(d.hour);
            const isSelected = d.hour === activeHour;
            return (
              <g key={`points-${d.hour}`}>
                {(viewMode === 'combined' || viewMode === 'temperature') && (
                  <circle
                    cx={x}
                    cy={getTempY(isF ? d.temperatureF : d.temperatureC)}
                    r={isSelected ? 6 : 3}
                    fill={isSelected ? '#EA580C' : '#F97316'}
                    stroke="#FFFFFF"
                    strokeWidth={isSelected ? 2.5 : 1.5}
                    className="transition-all duration-150"
                  />
                )}
                {(viewMode === 'combined' || viewMode === 'humidity') && (
                  <circle
                    cx={x}
                    cy={getHumY(d.humidity)}
                    r={isSelected ? 6 : 3}
                    fill={isSelected ? '#0284C7' : '#38BDF8'}
                    stroke="#FFFFFF"
                    strokeWidth={isSelected ? 2.5 : 1.5}
                    className="transition-all duration-150"
                  />
                )}
              </g>
            );
          })}

          {/* Peak Annotations (Always visible for educational clarity) */}
          {(viewMode === 'combined' || viewMode === 'temperature') && (
            <g transform={`translate(${getX(peakTempIndex)}, ${getTempY(maxTempRaw) - 16})`}>
              <rect
                x="-44"
                y="-14"
                width="88"
                height="20"
                rx="6"
                fill="#EA580C"
                filter="url(#shadow)"
              />
              <text
                x="0"
                y="0"
                fill="#FFFFFF"
                fontSize="10"
                fontWeight="700"
                textAnchor="middle"
              >
                🔥 Max: {maxTempRaw}°
              </text>
            </g>
          )}

          {(viewMode === 'combined' || viewMode === 'humidity') && (
            <g
              transform={`translate(${getX(lowestHumIndex)}, ${getHumY(lowestHumVal) + 24})`}
            >
              <rect
                x="-44"
                y="-14"
                width="88"
                height="20"
                rx="6"
                fill="#0284C7"
                filter="url(#shadow)"
              />
              <text
                x="0"
                y="0"
                fill="#FFFFFF"
                fontSize="10"
                fontWeight="700"
                textAnchor="middle"
              >
                💧 Min: {lowestHumVal}%
              </text>
            </g>
          )}

          {/* Vertical Scrubber Cursor Line */}
          <line
            x1={getX(activeHour)}
            y1={padding.top - 8}
            x2={getX(activeHour)}
            y2={padding.top + chartHeight + 10}
            stroke="#0F172A"
            strokeWidth="2"
            strokeDasharray="4,4"
          />

          {/* X Axis Time Labels */}
          {hourTicks.map((h) => {
            const x = getX(h);
            const hourLabel =
              h === 0
                ? '12 AM'
                : h === 6
                ? '6 AM 🌅'
                : h === 12
                ? '12 PM ☀️'
                : h === 15
                ? '3 PM 🔥'
                : h === 18
                ? '6 PM 🌇'
                : h === 21
                ? '9 PM'
                : h === 23
                ? '11 PM'
                : `${h}:00`;

            const isCurrent = h === activeHour;

            return (
              <g key={`x-tick-${h}`}>
                <line
                  x1={x}
                  y1={padding.top + chartHeight}
                  x2={x}
                  y2={padding.top + chartHeight + 6}
                  stroke="#94A3B8"
                  strokeWidth="1.5"
                />
                <text
                  x={x}
                  y={padding.top + chartHeight + 22}
                  textAnchor="middle"
                  fill={isCurrent ? '#0F172A' : '#64748B'}
                  fontSize={isCurrent ? '11' : '10'}
                  fontWeight={isCurrent ? '800' : '600'}
                >
                  {hourLabel}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Floating Tooltip Box (position follows active hour) */}
        <div
          className="pointer-events-none mt-2 sm:mt-0 transition-all duration-150"
          style={{
            // Keep tooltip within visible frame
            marginLeft: `${Math.min(70, Math.max(5, (activeHour / 23) * 100 - 15))}%`,
          }}
        >
          <div className="inline-block bg-slate-900 text-white rounded-xl shadow-lg p-3 text-xs border border-slate-700 max-w-xs">
            <div className="flex items-center justify-between gap-3 font-bold border-b border-slate-700/80 pb-1.5 mb-1.5">
              <span className="text-amber-300 flex items-center gap-1.5">
                <span>⏱️</span> {activeData.timeLabel}
              </span>
              <span className="text-[11px] text-slate-300 font-normal">
                {activeData.isDaytime ? 'Daytime' : 'Night'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-semibold mb-2">
              <div className="flex items-center gap-1.5 text-orange-300">
                <Thermometer className="w-3.5 h-3.5" />
                <span className="font-mono-numbers">
                  {isF ? `${activeData.temperatureF}°F` : `${activeData.temperatureC}°C`}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-cyan-300">
                <Droplets className="w-3.5 h-3.5" />
                <span className="font-mono-numbers">{activeData.humidity}% RH</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-300 leading-snug">
              {activeData.description}
            </p>
          </div>
        </div>
      </div>

      {/* Grade 6 Discovery Callout Box */}
      <div className="mt-4 p-3.5 bg-amber-50/80 rounded-xl border border-amber-200/80 flex items-start gap-3 text-xs text-amber-950">
        <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-amber-900">
            Grade 6 Secret to Remember:{' '}
          </span>
          Notice how the two curves cross and oppose each other! Mid-afternoon (3 PM) has the{' '}
          <strong>highest temperature</strong>, but the <strong>lowest relative humidity</strong>.
          That&apos;s because hot air behaves like an expanding sponge that can hold way more moisture!
        </div>
      </div>
    </div>
  );
};
