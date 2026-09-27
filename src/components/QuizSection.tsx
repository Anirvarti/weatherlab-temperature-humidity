import React, { useState } from 'react';
import { QuizQuestion } from '../types/weather';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  Lightbulb,
  Award,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

interface QuizSectionProps {
  questions: QuizQuestion[];
  onHighlightRangeChange: (range?: [number, number]) => void;
  onJumpToHour: (hour: number) => void;
}

export const QuizSection: React.FC<QuizSectionProps> = ({
  questions,
  onHighlightRangeChange,
  onJumpToHour,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [showHint, setShowHint] = useState<Record<number, boolean>>({});

  const currentQ = questions[currentIndex];
  const totalQuestions = questions.length;
  const selectedOptionId = selectedAnswers[currentQ.id];
  const selectedOption = currentQ.options.find((opt) => opt.id === selectedOptionId);

  // Calculate score
  const correctCount = Object.entries(selectedAnswers).reduce((count, [qIdStr, optId]) => {
    const qId = parseInt(qIdStr, 10);
    const q = questions.find((item) => item.id === qId);
    if (!q) return count;
    const opt = q.options.find((o) => o.id === optId);
    return opt?.isCorrect ? count + 1 : count;
  }, 0);

  const isCompleted = Object.keys(selectedAnswers).length === totalQuestions;

  const handleSelectOption = (optId: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optId,
    }));

    // If correct and has highlight, show it briefly
    const opt = currentQ.options.find((o) => o.id === optId);
    if (opt?.isCorrect && currentQ.graphHighlightRange) {
      onHighlightRangeChange(currentQ.graphHighlightRange);
      onJumpToHour(currentQ.graphHighlightRange[0]);
    }
  };

  const handleToggleHint = () => {
    const nextVal = !showHint[currentQ.id];
    setShowHint((prev) => ({
      ...prev,
      [currentQ.id]: nextVal,
    }));

    if (nextVal && currentQ.graphHighlightRange) {
      onHighlightRangeChange(currentQ.graphHighlightRange);
      onJumpToHour(currentQ.graphHighlightRange[0]);
    } else {
      onHighlightRangeChange(undefined);
    }
  };

  const goToQuestion = (index: number) => {
    setCurrentIndex(index);
    const q = questions[index];
    if (showHint[q.id] && q.graphHighlightRange) {
      onHighlightRangeChange(q.graphHighlightRange);
    } else {
      onHighlightRangeChange(undefined);
    }
  };

  const resetQuiz = () => {
    setSelectedAnswers({});
    setShowHint({});
    setCurrentIndex(0);
    onHighlightRangeChange(undefined);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 sm:p-6 space-y-6">
      {/* Quiz Header & Progress */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
              <Award className="w-4 h-4" />
            </span>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              Interactive 6th Grade Science Challenges
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Test your weather graph skills! Read the graphs and learn how the variables interact.
          </p>
        </div>

        {/* Question Stepper Tabs */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {questions.map((q, idx) => {
            const answered = selectedAnswers[q.id];
            const opt = answered ? q.options.find((o) => o.id === answered) : null;
            const isCorrect = opt?.isCorrect;
            const isCurrent = idx === currentIndex;

            return (
              <button
                key={q.id}
                onClick={() => goToQuestion(idx)}
                className={`w-8 h-8 rounded-xl text-xs font-bold transition-all flex items-center justify-center border ${
                  isCurrent
                    ? 'border-emerald-600 bg-emerald-600 text-white shadow-xs'
                    : isCorrect
                    ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                    : answered
                    ? 'border-rose-300 bg-rose-50 text-rose-800'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
                title={`Question ${idx + 1}`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Question Card */}
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">
              {currentQ.title}
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-slate-900 leading-snug">
              {currentQ.question}
            </h3>
          </div>

          {/* Hint Button */}
          <button
            onClick={handleToggleHint}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all shrink-0 ${
              showHint[currentQ.id]
                ? 'bg-amber-100 border-amber-300 text-amber-900 shadow-xs'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-500 fill-amber-300" />
            <span>{showHint[currentQ.id] ? 'Hide Hint' : 'Show Hint'}</span>
          </button>
        </div>

        {/* Hint Box (if active) */}
        {showHint[currentQ.id] && (
          <div className="p-3 bg-amber-50/90 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5 animate-fadeIn">
            <span className="text-base">💡</span>
            <div>
              <strong className="font-bold text-amber-950">Detective Clue: </strong>
              {currentQ.hint}
              <div className="mt-1 text-[11px] text-amber-800 font-medium">
                (The yellow highlighted band on the graph above shows the exact time range!)
              </div>
            </div>
          </div>
        )}

        {/* Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {currentQ.options.map((option) => {
            const isChosen = selectedOptionId === option.id;
            const hasAnswered = !!selectedOption;

            let buttonStyle = 'bg-slate-50/80 border-slate-200 hover:bg-slate-100 text-slate-800';

            if (isChosen) {
              if (option.isCorrect) {
                buttonStyle = 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-300 text-emerald-950 font-bold';
              } else {
                buttonStyle = 'bg-rose-50 border-rose-400 ring-2 ring-rose-200 text-rose-950 font-bold';
              }
            } else if (hasAnswered && option.isCorrect) {
              // Highlight correct answer if wrong was picked
              buttonStyle = 'bg-emerald-50/60 border-emerald-300 text-emerald-900 font-semibold';
            }

            return (
              <button
                key={option.id}
                onClick={() => handleSelectOption(option.id)}
                className={`p-3.5 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-start justify-between gap-3 ${buttonStyle}`}
              >
                <span className="leading-snug">{option.text}</span>
                {isChosen && option.isCorrect && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                )}
                {isChosen && !option.isCorrect && (
                  <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Explanation Card after selection */}
        {selectedOption && (
          <div
            className={`p-4 rounded-xl border text-xs sm:text-sm leading-relaxed transition-all ${
              selectedOption.isCorrect
                ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                : 'bg-rose-50/80 border-rose-200 text-rose-950'
            }`}
          >
            <div className="flex items-center gap-2 font-bold mb-1">
              {selectedOption.isCorrect ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Correct! Outstanding work!</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 text-rose-600" />
                  <span>Let&apos;s think about this again!</span>
                </>
              )}
            </div>
            <p>{selectedOption.explanation}</p>
          </div>
        )}

        {/* Bottom Navigation between questions */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={() => goToQuestion(Math.max(0, currentIndex - 1))}
            disabled={currentIndex === 0}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border ${
              currentIndex === 0
                ? 'border-slate-100 text-slate-300 cursor-not-allowed'
                : 'border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          <span className="text-xs text-slate-600 font-medium">
            Question {currentIndex + 1} of {totalQuestions}
          </span>

          {currentIndex < totalQuestions - 1 ? (
            <button
              onClick={() => goToQuestion(currentIndex + 1)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 shadow-xs"
            >
              <span>Next Question</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={() => goToQuestion(0)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs"
            >
              <span>Review Quiz</span>
            </button>
          )}
        </div>
      </div>

      {/* Completion Banner */}
      {isCompleted && (
        <div className="p-4 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl text-white shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl shrink-0">
              🏆
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-sm font-bold">
                <Sparkles className="w-4 h-4 text-amber-200" />
                <span>Certificate of Achievement: Grade 6 Weather Detective!</span>
              </div>
              <p className="text-xs text-emerald-100 mt-0.5">
                You scored {correctCount} out of {totalQuestions} correct! You understand how temperature and humidity interact on real graphs!
              </p>
            </div>
          </div>

          <button
            onClick={resetQuiz}
            className="flex items-center gap-1.5 px-4 py-2 bg-white text-emerald-900 rounded-xl text-xs font-bold shadow-sm hover:bg-emerald-50 transition-all shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retake Quiz</span>
          </button>
        </div>
      )}
    </div>
  );
};
