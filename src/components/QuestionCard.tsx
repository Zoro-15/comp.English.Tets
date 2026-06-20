import type { Question } from '../types';

interface QuestionCardProps {
  question: Question | undefined;
  selectedAnswer: string | number | undefined;
  onSelectAnswer: (key: string) => void;
  index?: number;
}

export default function QuestionCard({ 
  question, 
  selectedAnswer, 
  onSelectAnswer,
  index
}: QuestionCardProps) {
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
    <div className="bg-brand-card border border-brand-border rounded-none p-6 sm:p-8 flex flex-col gap-6 font-inter">
      <div>
        {/* Question Header */}
        <div className="mb-4 flex items-center justify-between">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-text">
            {index !== undefined ? `Question ${index + 1}` : "English Mock Test"}
          </span>
          <span className="text-[10px] font-extrabold text-black bg-brand-bg px-2.5 py-0.5 border border-brand-border uppercase tracking-wider rounded-none">
            4 Marks &bull; -1.3 Neg
          </span>
        </div>

        {/* Question Stem */}
        <h3 className="text-lg sm:text-xl font-bold text-black leading-relaxed font-inter tracking-tight" dangerouslySetInnerHTML={{ __html: question.Question }} />
      </div>

      {/* Selectable Options */}
      <div className="space-y-3">
        {options.map(({ key, val }) => {
          const isSelected = selectedAnswer !== undefined && String(selectedAnswer) === String(key);

          return (
            <button
              key={key}
              onClick={() => onSelectAnswer(key)}
              className={`w-full text-left p-4 rounded-none border transition-none flex items-center gap-3.5 group outline-none cursor-pointer ${
                isSelected
                  ? 'border-black bg-brand-bg text-black font-bold'
                  : 'border-brand-border bg-brand-bg hover:border-black text-brand-text hover:text-black font-normal'
              }`}
            >
              {/* Option Letter */}
              <span
                className={`text-xs px-2 py-0.5 border rounded-none uppercase font-extrabold transition-none shrink-0 ${
                  isSelected
                    ? 'bg-black border-black text-white'
                    : 'bg-brand-bg border-brand-border text-brand-text group-hover:border-black group-hover:text-black'
                }`}
              >
                {getOptionLetter(key)}
              </span>
              <span className="text-sm sm:text-base leading-snug text-black" dangerouslySetInnerHTML={{ __html: val }} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
