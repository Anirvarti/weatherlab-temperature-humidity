import React, { useState } from 'react';
import { MathQuestion4Q } from '../types/mathGraph';
import { CheckCircle2, XCircle, ChevronLeft, ChevronRight } from 'lucide-react';

interface MathQuestionsQuadrantProps {
  questions: MathQuestion4Q[];
  onHighlightTargetX: (x?: number) => void;
}

export const MathQuestionsQuadrant: React.FC<MathQuestionsQuadrantProps> = ({
  questions,
  onHighlightTargetX,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});

  if (!questions || questions.length === 0) {
    return null;
  }

  const safeIndex = Math.min(currentIndex, questions.length - 1);
  const currentQ = questions[safeIndex];

  const selectedOptId = selectedAnswers[currentQ.id];
  const selectedOpt = currentQ.options.find((opt) => opt.id === selectedOptId);

  const handleSelectOption = (optId: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optId,
    }));
    if (currentQ.targetPoint) {
      onHighlightTargetX(currentQ.targetPoint.x);
    }
  };

  const handleNav = (index: number) => {
    setCurrentIndex(index);
    const q = questions[index];
    if (q?.targetPoint) {
      onHighlightTargetX(q.targetPoint.x);
    } else {
      onHighlightTargetX(undefined);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">
            Math & Graph Plotting Questions
          </h3>
          <span className="text-[11px] text-slate-500">
            Coordinate Geometry & 4 Quadrants
          </span>
        </div>

        {/* Question Selector Tabs */}
        <div className="flex items-center gap-1.5">
          {questions.map((q, idx) => {
            const answeredOpt = selectedAnswers[q.id];
            const opt = answeredOpt ? q.options.find((o) => o.id === answeredOpt) : null;
            const isCorrect = opt?.isCorrect;
            const isCurrent = idx === safeIndex;

            return (
              <button
                key={q.id}
                onClick={() => handleNav(idx)}
                className={`w-7 h-7 rounded-md text-xs font-bold transition-all flex items-center justify-center border ${
                  isCurrent
                    ? 'border-indigo-600 bg-indigo-600 text-white'
                    : isCorrect
                    ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                    : answeredOpt
                    ? 'border-rose-300 bg-rose-50 text-rose-800'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                Q{idx + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Question Details */}
      <div className="my-2 space-y-2">
        <div className="flex items-center justify-between text-xs text-indigo-700 font-semibold">
          <span>{currentQ.numberLabel}: {currentQ.topic}</span>
          {currentQ.targetPoint && (
            <span className="text-[11px] font-mono text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
              Target x = {currentQ.targetPoint.x}
            </span>
          )}
        </div>

        <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-snug">
          {currentQ.question}
        </p>

        {/* Options List */}
        <div className="space-y-1.5 pt-1">
          {currentQ.options.map((option) => {
            const isChosen = selectedOptId === option.id;
            let optStyle = 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-800';

            if (isChosen) {
              optStyle = option.isCorrect
                ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold'
                : 'bg-rose-50 border-rose-400 text-rose-950 font-bold';
            }

            return (
              <button
                key={option.id}
                onClick={() => handleSelectOption(option.id)}
                className={`w-full p-2.5 text-left text-xs rounded-lg border transition-all flex items-center justify-between gap-2 ${optStyle}`}
              >
                <span>{option.text}</span>
                {isChosen && option.isCorrect && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                )}
                {isChosen && !option.isCorrect && (
                  <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Math Explanation Card */}
        {selectedOpt && (
          <div
            className={`p-2.5 rounded-lg border text-xs leading-relaxed ${
              selectedOpt.isCorrect
                ? 'bg-emerald-50/90 border-emerald-200 text-emerald-950'
                : 'bg-rose-50/90 border-rose-200 text-rose-950'
            }`}
          >
            <span className="font-bold">Step-by-Step Math: </span>
            {selectedOpt.explanation}
          </div>
        )}
      </div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
        <button
          onClick={() => handleNav(Math.max(0, safeIndex - 1))}
          disabled={safeIndex === 0}
          className={`flex items-center gap-1 font-semibold ${
            safeIndex === 0 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ChevronLeft className="w-4 h-4" /> Previous
        </button>

        <span className="text-slate-400 font-mono text-[11px]">
          {safeIndex + 1} of {questions.length}
        </span>

        <button
          onClick={() => handleNav(Math.min(questions.length - 1, safeIndex + 1))}
          disabled={safeIndex === questions.length - 1}
          className={`flex items-center gap-1 font-semibold ${
            safeIndex === questions.length - 1 ? 'text-slate-300 cursor-not-allowed' : 'text-indigo-600 hover:text-indigo-900'
          }`}
        >
          Next <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
