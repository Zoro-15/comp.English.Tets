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
    <div className="bg-brand-card border border-brand-border rounded-lg p-6 sm:p-8 flex flex-col gap-6 font-source">
      <div>
        {/* Question Header */}
        <div className="mb-4 flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-text">
            {index !== undefined ? `Question ${index + 1}` : "English Mock Test"}
          </span>
          <span className="text-[10px] font-bold text-brand-primary bg-brand-secondary px-2.5 py-0.5 rounded border border-brand-border">
            4 Marks &bull; -1.3 Neg
          </span>
        </div>

        {/* Question Stem */}
        <h3 className="text-lg sm:text-xl font-normal text-brand-title leading-relaxed font-lora" dangerouslySetInnerHTML={{ __html: question.Question }} />
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
                  ? 'border-brand-primary bg-brand-secondary text-brand-title font-medium'
                  : 'border-brand-border bg-brand-bg hover:border-brand-primary hover:bg-brand-secondary/40 text-brand-text'
              }`}
            >
              {/* Option Letter */}
              <span
                className={`text-xs px-2 py-0.5 border rounded-md uppercase font-semibold transition-colors duration-150 shrink-0 ${
                  isSelected
                    ? 'bg-brand-card border-brand-primary text-brand-primary'
                    : 'bg-brand-card border-brand-border text-brand-text group-hover:border-brand-primary group-hover:text-brand-primary'
                }`}
              >
                {getOptionLetter(key)}
              </span>
              <span className="text-sm sm:text-base leading-snug text-brand-title" dangerouslySetInnerHTML={{ __html: val }} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
