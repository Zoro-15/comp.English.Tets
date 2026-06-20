interface QuestionNavigatorProps {
  currentIndex: number;
  totalQuestions: number;
  onPrev: () => void;
  onNext: () => void;
  onSubmit: () => void;
  answeredCount: number;
}

export default function QuestionNavigator({
  currentIndex,
  totalQuestions,
  onPrev,
  onNext,
  onSubmit,
  answeredCount
}: QuestionNavigatorProps) {
  const percentComplete = totalQuestions > 0 ? Math.round(((currentIndex + 1) / totalQuestions) * 100) : 0;

  return (
    <div className="bg-brand-bg border-t border-brand-border p-4 sm:p-5 font-inter text-brand-text">
      <div className="max-w-[1024px] mx-auto flex flex-col gap-4">
        {/* Progress Bar */}
        <div className="w-full font-inter">
          <div className="flex justify-between items-center text-[10px] font-extrabold uppercase tracking-widest mb-1.5 text-brand-title">
            <span>Progress: {percentComplete}% completed</span>
            <span>{answeredCount} of {totalQuestions} Answered</span>
          </div>
          <div className="w-full bg-brand-border rounded-full h-1.5 overflow-hidden">
            <div
               className="bg-brand-primary h-full rounded-full transition-all duration-300 ease-out"
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
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border transition-none flex items-center gap-1 cursor-pointer outline-none ${
              currentIndex === 0
                ? 'opacity-25 border-brand-border text-brand-text bg-brand-bg cursor-not-allowed'
                : 'bg-brand-bg hover:border-brand-primary hover:text-brand-title text-brand-text border-brand-border'
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            <span>Prev</span>
          </button>

          {/* Question Counter Label */}
          <span className="text-xs font-bold uppercase tracking-wider text-brand-title bg-brand-tile px-3 py-1.5 rounded-lg border border-brand-border">
            Question <span className="font-extrabold text-brand-title">{currentIndex + 1}</span> of <span className="text-brand-text">{totalQuestions}</span>
          </span>

          {/* Next or Submit Button */}
          {currentIndex === totalQuestions - 1 ? (
            <button
              onClick={onSubmit}
              className="px-5 py-2.5 bg-brand-primary text-brand-secondary hover:opacity-90 font-bold uppercase tracking-wider rounded-xl text-xs transition-none flex items-center gap-1 cursor-pointer outline-none border-none"
            >
              <span>Submit Test</span>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </button>
          ) : (
            <button
              onClick={onNext}
              className="px-4 py-2 bg-brand-primary text-brand-secondary hover:opacity-90 font-bold uppercase tracking-wider rounded-xl text-xs transition-none flex items-center gap-1 cursor-pointer outline-none border-none"
            >
              <span>Next</span>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
