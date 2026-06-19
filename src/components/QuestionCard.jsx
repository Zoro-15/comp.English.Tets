import React from 'react';

export default function QuestionCard({ question, selectedAnswer, onSelectAnswer }) {
  if (!question) return null;

  const options = [
    { key: '0', val: question.Option_0 },
    { key: '1', val: question.Option_1 },
    { key: '2', val: question.Option_2 },
    { key: '3', val: question.Option_3 },
  ];

  const getOptionLetter = (key) => {
    const mapping = { '0': 'A', '1': 'B', '2': 'C', '3': 'D' };
    return mapping[key] || key;
  };

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-6 sm:p-8 shadow-sm flex-1 flex flex-col justify-between">
      <div>
        {/* Question Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-5">
          <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
            English Mock Test
          </span>
        </div>

        {/* Question Stem */}
        <h3 className="text-lg sm:text-xl font-bold text-slate-800 leading-relaxed mb-8" dangerouslySetInnerHTML={{ __html: question.Question }} />
      </div>

      {/* Selectable Options */}
      <div className="space-y-4">
        {options.map(({ key, val }) => {
          // Compare as strings to prevent strict type mismatch issues (e.g. number vs string)
          const isSelected = selectedAnswer !== undefined && String(selectedAnswer) === String(key);

          return (
            <button
              key={key}
              onClick={() => onSelectAnswer(key)}
              className={`w-full text-left p-4 rounded-xl border transition-all duration-150 flex items-center justify-between group outline-hidden ${
                isSelected
                  ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900 ring-2 ring-indigo-500/25 font-semibold'
                  : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <div className="flex items-center gap-4 pr-4">
                {/* Visual Circle Counter A, B, C, D */}
                <span
                  className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs font-extrabold border transition-all duration-150 uppercase shrink-0 ${
                    isSelected
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs'
                      : 'bg-white border-slate-200 text-slate-400 group-hover:border-indigo-400 group-hover:text-indigo-600'
                  }`}
                >
                  {getOptionLetter(key)}
                </span>
                <span className="text-sm sm:text-base leading-snug" dangerouslySetInnerHTML={{ __html: val }} />
              </div>

              {/* Radio Indicator */}
              <div
                className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-all duration-150 ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-600'
                    : 'border-slate-300 group-hover:border-indigo-400'
                }`}
              >
                {isSelected && (
                  <div className="w-2 h-2 rounded-full bg-white animate-scale-up" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
