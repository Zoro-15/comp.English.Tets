import React from 'react';

export default function QuestionNavigator({
  currentIndex,
  totalQuestions,
  onPrev,
  onNext,
  onSubmit,
  answeredCount
}) {
  const percentComplete = Math.round(((currentIndex + 1) / totalQuestions) * 100);

  return (
    <div className="bg-white border-t border-slate-100 p-4 sm:p-5">
      <div className="max-w-4xl mx-auto flex flex-col gap-4">
        {/* Progress Bar */}
        <div className="w-full">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-500 mb-1.5">
            <span>Progress: {percentComplete}% completed</span>
            <span>{answeredCount} of {totalQuestions} Answered</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-indigo-600 h-1.5 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${percentComplete}%` }}
            ></div>
          </div>
        </div>

        {/* Buttons & Index Selector */}
        <div className="flex items-center justify-between">
          {/* Previous Button */}
          <button
            onClick={onPrev}
            disabled={currentIndex === 0}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold border transition duration-150 flex items-center gap-1.5 shadow-xs ${
              currentIndex === 0
                ? 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed'
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300 active:bg-slate-100'
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Prev
          </button>

          {/* Question Counter Label */}
          <span className="text-sm font-bold text-slate-700 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
            Question <span className="text-indigo-600 font-extrabold">{currentIndex + 1}</span> of <span className="text-slate-800 font-extrabold">{totalQuestions}</span>
          </span>

          {/* Next or Submit Button */}
          {currentIndex === totalQuestions - 1 ? (
            <button
              onClick={onSubmit}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold rounded-xl text-sm transition duration-150 shadow-sm shadow-emerald-200/50 flex items-center gap-1.5"
            >
              Submit Test
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </button>
          ) : (
            <button
              onClick={onNext}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold rounded-xl text-sm transition duration-150 shadow-sm shadow-indigo-200/50 flex items-center gap-1.5"
            >
              Next
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
