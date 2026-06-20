import { useState } from 'react';
import type { Question } from '../types';

const formatQuestionText = (text: string) => {
  if (!text) return "";
  return text.replace(/<br\s*\/?>/gi, '<br><span class="block h-3"></span>');
};

interface ResultPageProps {
  questions: Question[];
  selectedAnswers: Record<number, string | number>;
  timeTaken: number; // in seconds
  currentStreak: number;
  testId: number;
  theme: 'light' | 'dark';
  onRestart: () => void;
  onNextTest: () => void;
  onBackToHome: () => void;
}

export default function ResultPage({
  questions,
  selectedAnswers,
  timeTaken,
  testId,
  theme,
  onRestart,
  onNextTest,
  onBackToHome
}: ResultPageProps) {
  const [filter, setFilter] = useState<'all' | 'correct' | 'incorrect'>('all');

  let correctCount = 0;
  let wrongCount = 0;
  let unansweredCount = 0;

  questions.forEach((q) => {
    const selected = selectedAnswers[q.Question_ID];
    if (selected === undefined || selected === null) {
      unansweredCount++;
    } else if (String(selected).trim() === String(q.Correct_Answer_Index).trim()) {
      correctCount++;
    } else {
      wrongCount++;
    }
  });

  const totalQuestions = questions.length;
  // Negative marking calculation: +4 for correct, -1.3 for incorrect, 0 for skipped
  const score = (correctCount * 4) - (wrongCount * 1.3);
  const attemptedCount = correctCount + wrongCount;
  const accuracy = attemptedCount > 0 ? Math.round((correctCount / attemptedCount) * 100) : 0;
  
  // Format score to 1 decimal place if it has fractional parts, otherwise integer
  const formattedScore = score % 1 === 0 ? score.toFixed(0) : score.toFixed(1);
  const maxPossibleScore = totalQuestions * 4;

  // Format time (seconds -> MM:SS)
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  const getOptionLetter = (key: string | number) => {
    const mapping: Record<string, string> = { '0': 'A', '1': 'B', '2': 'C', '3': 'D' };
    return mapping[String(key)] || String(key);
  };

  // Filtered questions list
  const filteredQuestions = questions.filter((q) => {
    const selected = selectedAnswers[q.Question_ID];
    const isCorrect = selected !== undefined && String(selected).trim() === String(q.Correct_Answer_Index).trim();
    
    if (filter === 'correct') return isCorrect;
    if (filter === 'incorrect') return !isCorrect;
    return true;
  });

  return (
    <div className="max-w-[1024px] mx-auto px-4 py-8 font-inter text-brand-text">
      {/* Top Heading */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-black text-brand-title uppercase tracking-tight font-inter">
          Test Report Card
        </h2>
        <p className="text-xs text-brand-text mt-1.5 font-bold uppercase tracking-widest">
          Mock Test {testId} completed
        </p>
      </div>

      {/* Horizontal Summary Row (Component C inspired style) */}
      <div className="bg-brand-card border border-brand-border rounded-2xl p-6 mb-8 font-inter">
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-4 text-center divide-y sm:divide-y-0 sm:divide-x divide-brand-border">
          <div className="pt-2 sm:pt-0">
            <span className="block text-[10px] uppercase tracking-widest text-brand-text font-extrabold mb-1.5">Score</span>
            <span className="text-xl font-black text-brand-title">{formattedScore} / {maxPossibleScore}</span>
          </div>
          <div className="pt-2 sm:pt-0">
            <span className="block text-[10px] uppercase tracking-widest text-brand-text font-extrabold mb-1.5">Accuracy</span>
            <span className="text-xl font-black text-brand-title">{accuracy}%</span>
          </div>
          <div className="pt-2 sm:pt-0">
            <span className="block text-[10px] uppercase tracking-widest text-brand-text font-extrabold mb-1.5">Time Taken</span>
            <span className="text-xl font-black text-brand-title font-mono">{formatTime(timeTaken)}</span>
          </div>
          <div className="pt-2 sm:pt-0">
            <span className="block text-[10px] uppercase tracking-widest text-brand-text font-extrabold mb-1.5">Correct</span>
            <span className="text-xl font-black text-brand-title">{correctCount}</span>
          </div>
          <div className="pt-2 sm:pt-0">
            <span className="block text-[10px] uppercase tracking-widest text-brand-text font-extrabold mb-1.5">Incorrect</span>
            <span className="text-xl font-black text-brand-title">{wrongCount}</span>
          </div>
          <div className="pt-2 sm:pt-0">
            <span className="block text-[10px] uppercase tracking-widest text-brand-text font-extrabold mb-1.5">Skipped</span>
            <span className="text-xl font-black text-brand-title">{unansweredCount}</span>
          </div>
        </div>

        {/* Thin progress bar underneath */}
        <div className="mt-6 w-full bg-brand-bg h-1.5 rounded-full overflow-hidden border border-brand-border">
          <div className="bg-brand-primary h-full rounded-full transition-all duration-300" style={{ width: `${accuracy}%` }} />
        </div>
      </div>

      {/* Performance Insights */}
      <div className="bg-brand-card border border-brand-border rounded-2xl p-6 mb-8 space-y-4 font-inter">
        <h3 className="text-base font-extrabold text-brand-title uppercase tracking-tight border-b border-brand-border pb-2">
          Performance Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs leading-relaxed">
          <div>
            <span className="block text-[10px] font-extrabold uppercase tracking-widest text-brand-text mb-1">Strong Areas</span>
            <p className="text-brand-title font-medium">
              {accuracy >= 80 
                ? "Excellent sentence structure comprehension and vocabulary recognition." 
                : accuracy >= 50 
                ? "Solid recognition of basic grammar conventions." 
                : "Active question participation under strict timing constraints."}
            </p>
          </div>
          <div>
            <span className="block text-[10px] font-extrabold uppercase tracking-widest text-brand-text mb-1">Needs Improvement</span>
            <p className="text-brand-title font-medium">
              {wrongCount > 0 
                ? "Review introductory modifying phrases, spelling patterns, and preposition choices." 
                : unansweredCount > 0 
                ? "Improve speed to ensure all questions are answered before time runs out." 
                : "Excellent work! Keep maintaining this high level of accuracy."}
            </p>
          </div>
          <div>
            <span className="block text-[10px] font-extrabold uppercase tracking-widest text-brand-text mb-1">Next Recommended Test</span>
            <p className="text-brand-title font-black uppercase tracking-tight">
              {accuracy >= 70 
                ? `Mock Test ${testId + 1}` 
                : `Mock Test ${testId} (Retake suggested)`}
            </p>
          </div>
        </div>
      </div>

      {/* Question Review Grid */}
      <div className="bg-brand-card border border-brand-border rounded-2xl p-6 mb-8 font-inter">
        <h4 className="text-xs font-extrabold text-brand-title uppercase tracking-widest mb-4 flex items-center gap-1.5">
          Question Review Grid
        </h4>
        
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 pr-1 max-w-xl">
          {questions.map((q, idx) => {
            const selected = selectedAnswers[q.Question_ID];
            const isCorrect = selected !== undefined && String(selected).trim() === String(q.Correct_Answer_Index).trim();
            const wasSkipped = selected === undefined || selected === null;

            let btnStyle = "";
            if (wasSkipped) {
              btnStyle = "bg-brand-neutral text-white";
            } else if (isCorrect) {
              btnStyle = "bg-brand-success text-white font-bold";
            } else {
              btnStyle = "bg-brand-error text-white font-bold";
            }

            return (
              <button
                key={q.Question_ID}
                onClick={() => {
                  document.getElementById(`review-q-${idx}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }}
                className={`h-9 w-9 flex flex-col items-center justify-center rounded-lg text-xs font-bold transition-none border-none cursor-pointer outline-none hover:opacity-80 ${btnStyle}`}
              >
                <span>{idx + 1}</span>
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-5 pt-4 border-t border-brand-border/60 flex flex-wrap gap-2 text-[10px] font-extrabold uppercase tracking-widest">
          <div className="px-2.5 py-1.5 rounded-lg border-none bg-brand-success text-white flex items-center gap-1.5">
            <span>✓ Correct</span>
          </div>
          <div className="px-2.5 py-1.5 rounded-lg border-none bg-brand-error text-white flex items-center gap-1.5">
            <span>✗ Wrong</span>
          </div>
          <div className="px-2.5 py-1.5 rounded-lg border-none bg-brand-neutral text-white flex items-center gap-1.5">
            <span>— Skipped</span>
          </div>
        </div>
      </div>

      {/* Action Progression Panel */}
      <div className="bg-brand-card border border-brand-border rounded-2xl p-6 mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between font-inter">
        <div className="text-center sm:text-left">
          <h4 className="text-xs font-bold text-brand-title uppercase tracking-wider">Test Retake</h4>
          <p className="text-[11px] text-brand-text mt-1">
            You can retake this mock test to improve your score and mastery of these concepts.
          </p>
        </div>
        <div className="w-full sm:w-auto flex justify-center">
          <button
            onClick={onRestart}
            className="py-2 px-6 border border-brand-border bg-brand-bg text-brand-text hover:border-brand-primary hover:text-brand-title font-bold uppercase tracking-wider rounded-xl transition-none flex items-center gap-1.5 cursor-pointer text-xs"
          >
            Retake Test {testId}
          </button>
        </div>
      </div>

      {/* Review Analysis */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-3 border-b border-brand-border font-inter">
          <h3 className="text-base font-extrabold text-brand-title uppercase tracking-tight">
            Detailed Question Analysis
          </h3>

          {/* Filtering Control */}
          <div className="inline-flex rounded-xl bg-brand-bg p-0.5 border border-brand-border">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-lg text-xs transition-none cursor-pointer uppercase font-bold tracking-wider ${
                filter === 'all'
                  ? 'bg-brand-primary text-brand-secondary font-bold'
                  : 'text-brand-text hover:text-brand-title'
              }`}
            >
              All ({questions.length})
            </button>
            <button
              onClick={() => setFilter('correct')}
              className={`px-3 py-1 rounded-lg text-xs transition-none cursor-pointer uppercase font-bold tracking-wider ${
                filter === 'correct'
                  ? 'bg-brand-primary text-brand-secondary font-bold'
                  : 'text-brand-text hover:text-brand-title'
              }`}
            >
              Correct ({correctCount})
            </button>
            <button
              onClick={() => setFilter('incorrect')}
              className={`px-3 py-1 rounded-lg text-xs transition-none cursor-pointer uppercase font-bold tracking-wider ${
                filter === 'incorrect'
                  ? 'bg-brand-primary text-brand-secondary font-bold'
                  : 'text-brand-text hover:text-brand-title'
              }`}
            >
              Incorrect ({wrongCount + unansweredCount})
            </button>
          </div>
        </div>

        {/* Empty State */}
        {filteredQuestions.length === 0 ? (
          <div className="bg-brand-bg border border-brand-border rounded-2xl p-8 text-center font-inter">
            <h5 className="text-brand-text font-bold uppercase tracking-wider text-sm">No questions found matching this filter.</h5>
          </div>
        ) : (
          <div className="space-y-6 font-inter">
            {filteredQuestions.map((q) => {
              const originalIndex = questions.findIndex((origQ) => origQ.Question_ID === q.Question_ID);
              const selected = selectedAnswers[q.Question_ID];
              const isCorrect = selected !== undefined && String(selected).trim() === String(q.Correct_Answer_Index).trim();
              const wasSkipped = selected === undefined || selected === null;

              return (
                <div
                  key={q.Question_ID}
                  id={`review-q-${originalIndex}`}
                  className="bg-brand-card rounded-2xl p-5 border border-brand-border scroll-mt-24"
                >
                  {/* Badge Header */}
                  <div className="flex items-center justify-between mb-3 text-xs uppercase font-extrabold tracking-wider">
                    <span className="text-brand-title font-black">
                      Question {originalIndex + 1}
                    </span>
                    
                    {wasSkipped ? (
                      <span className="text-brand-text">Skipped</span>
                    ) : isCorrect ? (
                      <span className="text-brand-title font-black">Correct</span>
                    ) : (
                      <span className="text-brand-title underline decoration-2">Incorrect</span>
                    )}
                  </div>

                  {/* Question Stem */}
                  <p className="text-brand-title font-bold text-sm sm:text-base mb-4 leading-relaxed" dangerouslySetInnerHTML={{ __html: formatQuestionText(q.Question) }} />

                  {/* Options List */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {[
                      { key: '0', val: q.Option_0 },
                      { key: '1', val: q.Option_1 },
                      { key: '2', val: q.Option_2 },
                      { key: '3', val: q.Option_3 },
                    ].map(({ key, val }) => {
                      const isKeySelected = selected !== undefined && String(selected).trim() === String(key);
                      const isKeyCorrect = String(q.Correct_Answer_Index).trim() === String(key);

                      let optionStyle = "border-brand-border bg-brand-tile text-brand-text";
                      let badgeStyle = "bg-brand-card border-brand-border text-brand-text";
                      
                      if (isKeyCorrect) {
                        optionStyle = "border-brand-border bg-brand-success/20 text-brand-title font-bold";
                        badgeStyle = "bg-brand-success border-brand-success text-white";
                      } else if (isKeySelected && !isCorrect) {
                        optionStyle = "border-brand-border bg-brand-error/20 text-brand-title font-bold";
                        badgeStyle = "bg-brand-error border-brand-error text-white";
                      }

                      return (
                        <div
                          key={key}
                          className={`flex items-start p-3 border rounded-xl text-xs sm:text-sm ${optionStyle}`}
                        >
                          <span className={`font-extrabold uppercase mr-2 text-[10px] px-1.5 py-0.5 border rounded-lg transition-none ${badgeStyle}`}>
                            {getOptionLetter(key)}
                          </span>
                          <span className="text-brand-title" dangerouslySetInnerHTML={{ __html: val }} />
                        </div>
                      );
                    })}
                  </div>

                  {/* Solution Explanation Box */}
                  {q.Solution && (
                    <div className="text-xs bg-brand-tile border border-brand-border rounded-[8px] p-4 mt-4 text-brand-text leading-relaxed">
                      <span className="font-extrabold text-brand-title uppercase tracking-wider block mb-1.5">Explanation</span>
                      <p dangerouslySetInnerHTML={{ __html: q.Solution }} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Proceed to Next Test Button (Shifted here to the bottom of the explanations review) */}
        <div className="mt-8 pt-6 border-t border-brand-border flex justify-center">
          <button
            onClick={onNextTest}
            className="py-3 px-8 bg-brand-primary text-brand-secondary hover:opacity-90 font-bold uppercase tracking-wider rounded-xl transition-none flex items-center gap-1.5 cursor-pointer text-sm border-none shadow-sm"
          >
            <span>Proceed to Test {testId + 1}</span>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
