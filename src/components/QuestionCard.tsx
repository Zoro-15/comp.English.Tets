import React from 'react';
import type { Question } from '../types';

interface QuestionCardProps {
  question: Question | undefined;
  selectedAnswer: string | number | undefined;
  onSelectAnswer: (key: string) => void;
}

export default function QuestionCard({ question, selectedAnswer, onSelectAnswer }: QuestionCardProps) {
  if (!question) return null;

  const options = [
    { key: '0', val: question.Option_0 },
    { key: '1', val: question.Option_1 },
    { key: '2', val: question.Option_2 },
    { key: '3', val: question.Option_3 },
  ];

  const getOptionLetter = (key: string) => {
    const mapping: Record<string, string> = { '0': 'A', '1': 'B', '2': 'C', '3': 'D' };
    return mapping[key] || key;
  };

  return (
    <div className="bg-[#F4F2EC] border border-[#ECECEC] rounded-lg p-6 sm:p-8 flex flex-col gap-6 font-source">
      <div>
        {/* Question Header */}
        <div className="mb-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B6B6B]">
            English Mock Test
          </span>
        </div>

        {/* Question Stem */}
        <h3 className="text-lg sm:text-xl font-normal text-slate-800 leading-relaxed font-lora" dangerouslySetInnerHTML={{ __html: question.Question }} />
      </div>

      {/* Selectable Options */}
      <div className="space-y-3">
        {options.map(({ key, val }) => {
          const isSelected = selectedAnswer !== undefined && String(selectedAnswer) === String(key);

          return (
            <button
              key={key}
              onClick={() => onSelectAnswer(key)}
              className={`w-full text-left p-4 rounded-lg border transition-colors duration-150 flex items-center gap-3.5 group outline-none cursor-pointer ${
                isSelected
                  ? 'border-[#4F6F52] bg-[#E7EFE9] text-slate-800 font-medium'
                  : 'border-[#ECECEC] bg-[#FAF9F6] hover:border-[#4F6F52] hover:bg-[#E7EFE9]/40 text-[#6B6B6B]'
              }`}
            >
              {/* Option Letter */}
              <span
                className={`text-xs px-2 py-0.5 border rounded-md uppercase font-semibold transition-colors duration-150 shrink-0 ${
                  isSelected
                    ? 'bg-white border-[#4F6F52] text-[#4F6F52]'
                    : 'bg-white border-[#ECECEC] text-[#6B6B6B] group-hover:border-[#4F6F52] group-hover:text-[#4F6F52]'
                }`}
              >
                {getOptionLetter(key)}
              </span>
              <span className="text-sm sm:text-base leading-snug" dangerouslySetInnerHTML={{ __html: val }} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
