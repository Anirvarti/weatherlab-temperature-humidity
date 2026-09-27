import React, { useState } from 'react';
import { Point4Q } from '../types/mathGraph';

interface MathGraphCardProps {
  title: string;
  graphType: 'temp' | 'humidity';
  data: Point4Q[];
  selectedX: number;
  onSelectX: (x: number) => void;
  targetHighlightX?: number;
}

export const MathGraphCard: React.FC<MathGraphCardProps> = ({
  title,
  graphType,
  data,
  selectedX,
  onSelectX,
  targetHighlightX,
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<Point4Q | null>(null);

  const isTemp = graphType === 'temp';

  // 4-Quadrant Coordinate Dimensions
  const svgWidth = 560;
  const svgHeight = 320;
  const pad = { top: 35, right: 35, bottom: 35, left: 45 };
  const graphWidth = svgWidth - pad.left - pad.right;
  const graphHeight = svgHeight - pad.top - pad.bottom;

  // Domain: X from -6 to +6 (Origin in center)
  const minX = -6;
  const maxX = 6;

  // Range: Y centered with positive and negative
  const yValues = data.map((d) => (isTemp ? d.tempY : d.humidityY));
  const rawMinY = Math.min(...yValues);
  const rawMaxY = Math.max(...yValues);

  // Symmetrical or balanced Y-axis so Origin (0,0) is centered
  const absMaxY = Math.max(Math.abs(rawMinY), Math.abs(rawMaxY), isTemp ? 15 : 30);
  const maxY = Math.ceil(absMaxY / 5) * 5;
  const minY = -maxY;

  // Grid steps
  const xTicks = [-6, -4, -2, 0, 2, 4, 6];
  const yStep = isTemp ? 5 : 10;
  const yTicks: number[] = [];
  for (let y = minY; y <= maxY; y += yStep) {
    yTicks.push(y);
  }

  // Coordinate mapping functions
  const mapX = (x: number) => pad.left + ((x - minX) / (maxX - minX)) * graphWidth;
  const mapY = (y: number) => pad.top + graphHeight - ((y - minY) / (maxY - minY)) * graphHeight;

  const originX = mapX(0);
  const originY = mapY(0);

  // Active point
  const activePoint = hoveredPoint || data.find((d) => d.x === selectedX) || data[3];
  const activeY = isTemp ? activePoint.tempY : activePoint.humidityY;
  const activeQuad = isTemp ? activePoint.tempQuadrant : activePoint.humQuadrant;

  const lineColor = isTemp ? '#EA580C' : '#0284C7';
  const dotColor = isTemp ? '#F97316' : '#0EA5E9';
  const yAxisTitle = isTemp ? 'Temperature y (°C)' : 'Humidity y (Deviation from 50%)';

  // Points string for line
  const pointsString = data
    .map((d) => `${mapX(d.x)},${mapY(isTemp ? d.tempY : d.humidityY)}`)
    .join(' ');

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">{title}</h3>
          <span className="text-[11px] text-slate-500">4-Quadrant Cartesian Plane (Origin at 0, 0)</span>
        </div>
        <div className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 border border-slate-200">
          Point: ({activePoint.x}, {activeY}) · {activeQuad === 'Axis' ? 'On Axis' : `Quadrant ${activeQuad}`}
        </div>
      </div>

      {/* 4-Quadrant Coordinate SVG */}
      <div className="relative my-2 select-none">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto cursor-crosshair overflow-visible"
        >
          {/* Quadrant Region Watermarks / Labels */}
          {/* Quadrant II (Top-Left): (-, +) */}
          <text
            x={pad.left + 12}
            y={pad.top + 20}
            fill="#94A3B8"
            fontSize="11"
            fontWeight="bold"
            fontFamily="sans-serif"
          >
            Quadrant II (−, +)
          </text>

          {/* Quadrant I (Top-Right): (+, +) */}
          <text
            x={pad.left + graphWidth - 12}
            y={pad.top + 20}
            textAnchor="end"
            fill="#94A3B8"
            fontSize="11"
            fontWeight="bold"
            fontFamily="sans-serif"
          >
            Quadrant I (+, +)
          </text>

          {/* Quadrant III (Bottom-Left): (-, -) */}
          <text
            x={pad.left + 12}
            y={pad.top + graphHeight - 12}
            fill="#94A3B8"
            fontSize="11"
            fontWeight="bold"
            fontFamily="sans-serif"
          >
            Quadrant III (−, −)
          </text>

          {/* Quadrant IV (Bottom-Right): (+, -) */}
          <text
            x={pad.left + graphWidth - 12}
            y={pad.top + graphHeight - 12}
            textAnchor="end"
            fill="#94A3B8"
            fontSize="11"
            fontWeight="bold"
            fontFamily="sans-serif"
          >
            Quadrant IV (+, −)
          </text>

          {/* Grid Paper Lines (Horizontal) */}
          {yTicks.map((yVal) => {
            const yPos = mapY(yVal);
            if (yVal === 0) return null; // Axis drawn separately
            return (
              <g key={`y-grid-${yVal}`}>
                <line
                  x1={pad.left}
                  y1={yPos}
                  x2={pad.left + graphWidth}
                  y2={yPos}
                  stroke="#E2E8F0"
                  strokeWidth="1"
                  strokeDasharray="2,2"
                />
                <text
                  x={originX - 6}
                  y={yPos + 3.5}
                  textAnchor="end"
                  fill="#64748B"
                  fontSize="9.5"
                  fontFamily="monospace"
                  fontWeight="600"
                >
                  {yVal > 0 ? `+${yVal}` : yVal}
                </text>
              </g>
            );
          })}

          {/* Grid Paper Lines (Vertical) */}
          {xTicks.map((xVal) => {
            const xPos = mapX(xVal);
            if (xVal === 0) return null; // Axis drawn separately
            return (
              <g key={`x-grid-${xVal}`}>
                <line
                  x1={xPos}
                  y1={pad.top}
                  x2={xPos}
                  y2={pad.top + graphHeight}
                  stroke="#E2E8F0"
                  strokeWidth="1"
                  strokeDasharray="2,2"
                />
                <text
                  x={xPos}
                  y={originY + 14}
                  textAnchor="middle"
                  fill="#64748B"
                  fontSize="9.5"
                  fontFamily="monospace"
                  fontWeight="600"
                >
                  {xVal > 0 ? `+${xVal}` : xVal}
                </text>
              </g>
            );
          })}

          {/* Question Target Highlight Band */}
          {targetHighlightX !== undefined && (
            <rect
              x={mapX(targetHighlightX) - 16}
              y={pad.top}
              width="32"
              height={graphHeight}
              fill="#FDE047"
              opacity="0.25"
            />
          )}

          {/* Main X Axis (y = 0) with arrows at both ends */}
          <line
            x1={pad.left - 6}
            y1={originY}
            x2={pad.left + graphWidth + 10}
            y2={originY}
            stroke="#1E293B"
            strokeWidth="2"
          />
          {/* Arrow Left */}
          <polygon
            points={`${pad.left - 8},${originY} ${pad.left - 2},${originY - 4} ${pad.left - 2},${originY + 4}`}
            fill="#1E293B"
          />
          {/* Arrow Right */}
          <polygon
            points={`${pad.left + graphWidth + 12},${originY} ${pad.left + graphWidth + 6},${originY - 4} ${pad.left + graphWidth + 6},${originY + 4}`}
            fill="#1E293B"
          />

          {/* Main Y Axis (x = 0) with arrows at both ends */}
          <line
            x1={originX}
            y1={pad.top + graphHeight + 6}
            x2={originX}
            y2={pad.top - 10}
            stroke="#1E293B"
            strokeWidth="2"
          />
          {/* Arrow Top */}
          <polygon
            points={`${originX},${pad.top - 12} ${originX - 4},${pad.top - 6} ${originX + 4},${pad.top - 6}`}
            fill="#1E293B"
          />
          {/* Arrow Bottom */}
          <polygon
            points={`${originX},${pad.top + graphHeight + 8} ${originX - 4},${pad.top + graphHeight + 2} ${originX + 4},${pad.top + graphHeight + 2}`}
            fill="#1E293B"
          />

          {/* Origin (0, 0) Label */}
          <text
            x={originX - 7}
            y={originY + 14}
            fill="#1E293B"
            fontSize="10"
            fontWeight="bold"
            fontFamily="monospace"
          >
            0
          </text>

          {/* Axis End Titles */}
          <text
            x={originX}
            y={pad.top - 16}
            textAnchor="middle"
            fill="#1E293B"
            fontSize="11"
            fontWeight="bold"
          >
            +y ({yAxisTitle})
          </text>
          <text
            x={pad.left + graphWidth + 16}
            y={originY - 6}
            textAnchor="end"
            fill="#1E293B"
            fontSize="11"
            fontWeight="bold"
          >
            +x (Hours from Noon)
          </text>

          {/* Plotted Line Path across Quadrants */}
          <polyline
            fill="none"
            stroke={lineColor}
            strokeWidth="2.5"
            strokeLinejoin="round"
            points={pointsString}
          />

          {/* Projection Dashed Lines for Active Point */}
          <line
            x1={originX}
            y1={mapY(activeY)}
            x2={mapX(activePoint.x)}
            y2={mapY(activeY)}
            stroke="#0F172A"
            strokeWidth="1.2"
            strokeDasharray="3,3"
          />
          <line
            x1={mapX(activePoint.x)}
            y1={originY}
            x2={mapX(activePoint.x)}
            y2={mapY(activeY)}
            stroke="#0F172A"
            strokeWidth="1.2"
            strokeDasharray="3,3"
          />

          {/* Plotted Coordinate Points */}
          {data.map((pt) => {
            const ptY = isTemp ? pt.tempY : pt.humidityY;
            const cx = mapX(pt.x);
            const cy = mapY(ptY);
            const isSelected = pt.x === activePoint.x;

            return (
              <g
                key={`point-${pt.x}`}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredPoint(pt)}
                onMouseLeave={() => setHoveredPoint(null)}
                onClick={() => onSelectX(pt.x)}
              >
                {/* Hit target */}
                <circle cx={cx} cy={cy} r="14" fill="transparent" />

                {/* Point dot */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={isSelected ? 6 : 4}
                  fill={isSelected ? '#0F172A' : dotColor}
                  stroke="#FFFFFF"
                  strokeWidth="2"
                />

                {/* Coordinate Bubble */}
                {isSelected && (
                  <g transform={`translate(${cx}, ${cy - 12})`}>
                    <rect
                      x="-32"
                      y="-16"
                      width="64"
                      height="18"
                      rx="4"
                      fill="#0F172A"
                    />
                    <text
                      x="0"
                      y="-4"
                      fill="#FFFFFF"
                      fontSize="10"
                      fontWeight="bold"
                      fontFamily="monospace"
                      textAnchor="middle"
                    >
                      ({pt.x}, {ptY})
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Coordinate & Time explanation footer */}
      <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
        <span>
          Time at x = {activePoint.x}: <strong className="text-slate-800">{activePoint.timeLabel}</strong>
        </span>
        <span className="font-mono text-slate-800 font-semibold">
          Ordered Pair: ({activePoint.x}, {activeY})
        </span>
      </div>
    </div>
  );
};
