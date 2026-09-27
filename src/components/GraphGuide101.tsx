import React from 'react';
import { Compass, TrendingDown, Clock, HelpCircle, Layers } from 'lucide-react';

export const GraphGuide101: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 sm:p-6 space-y-4">
      <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
        <span className="p-1.5 rounded-lg bg-indigo-100 text-indigo-700">
          <Compass className="w-4 h-4" />
        </span>
        <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
          Graph Reading 101: 6th Grade Science Field Guide
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        {/* Card 1: The X-Axis */}
        <div className="p-3.5 bg-slate-50/70 rounded-xl border border-slate-200/70 space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-slate-900">
            <Clock className="w-3.5 h-3.5 text-slate-600" />
            <span>The Horizontal X-Axis (Time)</span>
          </div>
          <p className="text-slate-600 leading-relaxed">
            Runs along the bottom from left to right. It represents the <strong>independent variable</strong>:
            the 24 hours of one complete day (from 12:00 AM midnight to 11:00 PM).
          </p>
        </div>

        {/* Card 2: The Two Y-Axes */}
        <div className="p-3.5 bg-slate-50/70 rounded-xl border border-slate-200/70 space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-slate-900">
            <Layers className="w-3.5 h-3.5 text-slate-600" />
            <span>Dual Y-Axes (Two Measurements)</span>
          </div>
          <p className="text-slate-600 leading-relaxed">
            The left vertical axis measures <strong className="text-amber-700">Temperature (°C or °F)</strong>.
            The right vertical axis measures <strong className="text-sky-700">Relative Humidity (%)</strong>.
            Both share the exact same timeline!
          </p>
        </div>

        {/* Card 3: The Inverse Relationship */}
        <div className="p-3.5 bg-slate-50/70 rounded-xl border border-slate-200/70 space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-slate-900">
            <TrendingDown className="w-3.5 h-3.5 text-indigo-600" />
            <span>The &quot;Inverse Relationship&quot;</span>
          </div>
          <p className="text-slate-600 leading-relaxed">
            When one variable climbs up and the other drops down, scientists call this an{' '}
            <strong>inverse relationship</strong>. On the graph, you see the orange mountain peak
            matching the blue valley!
          </p>
        </div>
      </div>
    </div>
  );
};
