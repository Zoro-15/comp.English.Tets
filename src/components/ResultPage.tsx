import { useState } from 'react';
import type { Question } from '../types';

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
    <div className="max-w-4xl mx-auto px-4 py-8 font-source text-brand-text">
      {/* Top Heading */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-normal text-brand-title font-lora">
          Test Report Card
        </h2>
        <p className="text-xs text-brand-text mt-1 font-light tracking-wide uppercase">
          Mock Test {testId} completed
        </p>
      </div>

      {/* Horizontal Summary Row */}
      <div className="bg-brand-card border border-brand-border rounded-lg p-5 mb-6">
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-4 text-center divide-y sm:divide-y-0 sm:divide-x divide-brand-border/70">
          <div className="pt-2 sm:pt-0">
            <span className="block text-[10px] uppercase tracking-wider text-brand-text font-semibold mb-0.5">Score</span>
            <span className="text-lg font-bold text-brand-title font-lora">{formattedScore} / {maxPossibleScore}</span>
          </div>
          <div className="pt-2 sm:pt-0">
            <span className="block text-[10px] uppercase tracking-wider text-brand-text font-semibold mb-0.5">Accuracy</span>
            <span className="text-lg font-bold text-brand-title">{accuracy}%</span>
          </div>
          <div className="pt-2 sm:pt-0">
            <span className="block text-[10px] uppercase tracking-wider text-brand-text font-semibold mb-0.5">Time Taken</span>
            <span className="text-lg font-bold text-brand-title font-mono">{formatTime(timeTaken)}</span>
          </div>
          <div className="pt-2 sm:pt-0">
            <span className="block text-[10px] uppercase tracking-wider text-brand-text font-semibold mb-0.5">Correct</span>
            <span className="text-lg font-bold text-emerald-450">{correctCount}</span>
          </div>
          <div className="pt-2 sm:pt-0">
            <span className="block text-[10px] uppercase tracking-wider text-brand-text font-semibold mb-0.5">Incorrect</span>
            <span className="text-lg font-bold text-rose-455">{wrongCount}</span>
          </div>
          <div className="pt-2 sm:pt-0">
            <span className="block text-[10px] uppercase tracking-wider text-brand-text font-semibold mb-0.5">Skipped</span>
            <span className="text-lg font-bold text-amber-500">{unansweredCount}</span>
          </div>
        </div>

        {/* Thin progress bar underneath */}
        <div className="mt-5 w-full bg-brand-bg h-1 rounded-full overflow-hidden border border-brand-border">
          <div className="bg-brand-primary h-full rounded-full transition-all duration-300" style={{ width: `${accuracy}%` }} />
        </div>
      </div>

      {/* Performance Insights */}
      <div className="bg-brand-card border border-brand-border rounded-lg p-6 mb-8 space-y-4">
        <h3 className="text-sm font-normal text-brand-title font-lora border-b border-brand-border pb-1.5">
          Performance Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs leading-relaxed">
          <div>
            <span className="block text-[10px] font-bold uppercase tracking-wider text-brand-text mb-1">Strong Areas</span>
            <p className="text-brand-text">
              {accuracy >= 80 
                ? "Excellent sentence structure comprehension and vocabulary recognition." 
                : accuracy >= 50 
                ? "Solid recognition of basic grammar conventions." 
                : "Active question participation under strict timing constraints."}
            </p>
          </div>
          <div>
            <span className="block text-[10px] font-bold uppercase tracking-wider text-brand-text mb-1">Needs Improvement</span>
            <p className="text-brand-text">
              {wrongCount > 0 
                ? "Review introductory modifying phrases, spelling patterns, and preposition choices." 
                : unansweredCount > 0 
                ? "Improve speed to ensure all questions are answered before time runs out." 
                : "Excellent work! Keep maintaining this high level of accuracy."}
            </p>
          </div>
          <div>
            <span className="block text-[10px] font-bold uppercase tracking-wider text-brand-text mb-1">Next Recommended Test</span>
            <p className="text-brand-text font-semibold">
              {accuracy >= 70 
                ? `Mock Test ${testId + 1}` 
                : `Mock Test ${testId} (Retake suggested)`}
            </p>
          </div>
        </div>
      </div>

      {/* Question Review Grid */}
      <div className="bg-brand-card border border-brand-border rounded-lg p-5 mb-8">
        <h4 className="text-xs font-bold text-brand-text uppercase tracking-wider mb-4 flex items-center gap-1.5 font-lora">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          Question Review Grid
        </h4>
        
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 pr-1 max-w-xl">
          {questions.map((q, idx) => {
            const selected = selectedAnswers[q.Question_ID];
            const isCorrect = selected !== undefined && String(selected).trim() === String(q.Correct_Answer_Index).trim();
            const wasSkipped = selected === undefined || selected === null;
            const isDark = theme === 'dark';

            let btnStyle = "";
            if (wasSkipped) {
              btnStyle = isDark 
                ? "bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20 hover:border-amber-400"
                : "bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100 hover:border-amber-400";
            } else if (isCorrect) {
              btnStyle = isDark
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-400"
                : "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100 hover:border-emerald-450";
            } else {
              btnStyle = isDark
                ? "bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20 hover:border-rose-455"
                : "bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100 hover:border-rose-455";
            }

            return (
              <button
                key={q.Question_ID}
                onClick={() => {
                  document.getElementById(`review-q-${idx}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }}
                className={`h-9 w-9 flex flex-col items-center justify-center rounded-md text-xs font-semibold transition duration-150 border cursor-pointer outline-none ${btnStyle}`}
              >
                <span>{idx + 1}</span>
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-5 pt-4 border-t border-brand-border/60 flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-wider">
          <div className={`px-2.5 py-1.5 rounded-md border flex items-center gap-1.5 ${
            theme === 'dark' 
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
              : "bg-emerald-50 border-emerald-200 text-emerald-700"
          }`}>
            <span>✓ Correct</span>
          </div>
          <div className={`px-2.5 py-1.5 rounded-md border flex items-center gap-1.5 ${
            theme === 'dark' 
              ? "bg-rose-500/10 border-rose-500/20 text-rose-400" 
              : "bg-rose-50 border-rose-200 text-rose-700"
          }`}>
            <span>✗ Wrong</span>
          </div>
          <div className={`px-2.5 py-1.5 rounded-md border flex items-center gap-1.5 ${
            theme === 'dark' 
              ? "bg-amber-500/10 border-amber-500/20 text-amber-400" 
              : "bg-amber-50 border-amber-200 text-amber-700"
          }`}>
            <span>— Skipped</span>
          </div>
        </div>
      </div>

      {/* Action Progression Panel */}
      <div className="bg-brand-card border border-brand-border rounded-lg p-5 mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="text-center sm:text-left">
          <h4 className="text-xs font-semibold text-brand-title uppercase tracking-wider">Test Progression</h4>
          <p className="text-[11px] text-brand-text mt-0.5">
            You can retake this test for a higher score or advance to the next set.
          </p>
        </div>
        <div className="w-full sm:w-auto flex flex-wrap gap-2.5 justify-center">
          <button
            onClick={onBackToHome}
            className="py-2 px-4 border border-brand-border bg-brand-bg text-brand-text hover:bg-brand-border/30 font-semibold rounded-md transition-colors duration-150 flex items-center gap-1.5 cursor-pointer text-xs"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Back to Dashboard
          </button>
          
          <button
            onClick={onRestart}
            className="py-2 px-4 border border-brand-border bg-brand-bg text-brand-text hover:bg-brand-border/30 font-semibold rounded-md transition-colors duration-150 flex items-center gap-1.5 cursor-pointer text-xs"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H18.2" />
            </svg>
            Retake Test {testId}
          </button>
          
          <button
            onClick={onNextTest}
            className="py-2 px-4 border border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-brand-bg font-semibold rounded-md transition-colors duration-150 flex items-center gap-1.5 cursor-pointer text-xs bg-transparent"
          >
            Proceed to Test {testId + 1}
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Review Analysis */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-3 border-b border-brand-border">
          <h3 className="text-base font-normal text-brand-title font-lora">
            Detailed Question Analysis
          </h3>

          {/* Filtering Control */}
          <div className="inline-flex rounded-md bg-brand-bg p-0.5 border border-brand-border">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded text-xs transition-colors cursor-pointer ${
                filter === 'all'
                  ? 'bg-brand-secondary text-brand-primary font-semibold'
                  : 'text-brand-text hover:text-brand-title'
              }`}
            >
              All ({questions.length})
            </button>
            <button
              onClick={() => setFilter('correct')}
              className={`px-3 py-1 rounded text-xs transition-colors cursor-pointer ${
                filter === 'correct'
                  ? 'bg-brand-secondary text-brand-primary font-semibold'
                  : 'text-brand-text hover:text-brand-title'
              }`}
            >
              Correct ({correctCount})
            </button>
            <button
              onClick={() => setFilter('incorrect')}
              className={`px-3 py-1 rounded text-xs transition-colors cursor-pointer ${
                filter === 'incorrect'
                  ? 'bg-rose-950/30 text-rose-300 font-semibold'
                  : 'text-brand-text hover:text-brand-title'
              }`}
            >
              Incorrect ({wrongCount + unansweredCount})
            </button>
          </div>
        </div>

        {/* Empty State */}
        {filteredQuestions.length === 0 ? (
          <div className="bg-brand-card border border-brand-border rounded-lg p-8 text-center">
            <h5 className="text-brand-text font-semibold text-sm">No questions found matching this filter.</h5>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredQuestions.map((q) => {
              const originalIndex = questions.findIndex((origQ) => origQ.Question_ID === q.Question_ID);
              const selected = selectedAnswers[q.Question_ID];
              const isCorrect = selected !== undefined && String(selected).trim() === String(q.Correct_Answer_Index).trim();
              const wasSkipped = selected === undefined || selected === null;

              return (
                <div
                  key={q.Question_ID}
                  id={`review-q-${originalIndex}`}
                  className="bg-brand-card rounded-lg p-5 transition-colors border-none scroll-mt-24"
                >
                  {/* Badge Header */}
                  <div className="flex items-center justify-between mb-3 text-xs">
                    <span className="font-semibold text-brand-title">
                      Question {originalIndex + 1}
                    </span>
                    
                    {wasSkipped ? (
                      <span className="text-amber-500 font-semibold">Skipped</span>
                    ) : isCorrect ? (
                      <span className="text-emerald-400 font-semibold">Correct</span>
                    ) : (
                      <span className="text-rose-455 font-semibold">Incorrect</span>
                    )}
                  </div>

                  {/* Question Stem */}
                  <p className="text-brand-title font-medium text-sm sm:text-base mb-4 leading-relaxed" dangerouslySetInnerHTML={{ __html: q.Question }} />

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

                      const isDark = theme === 'dark';
                      let optionStyle = "border-brand-border bg-brand-bg text-brand-text";
                      
                      if (isKeyCorrect) {
                        optionStyle = isDark
                          ? "border-emerald-800/65 bg-emerald-950/20 text-emerald-300 font-medium"
                          : "border-emerald-200 bg-emerald-50 text-emerald-800 font-semibold";
                      } else if (isKeySelected && !isCorrect) {
                        optionStyle = isDark
                          ? "border-rose-900/60 bg-rose-950/25 text-rose-300"
                          : "border-rose-200 bg-rose-50 text-rose-800";
                      }

                      return (
                        <div
                          key={key}
                          className={`flex items-start p-3 border rounded-md text-xs sm:text-sm ${optionStyle}`}
                        >
                          <span className="font-semibold uppercase mr-2 text-[10px] px-1.5 py-0.5 bg-brand-card border border-brand-border rounded text-brand-title">
                            {getOptionLetter(key)}
                          </span>
                          <span dangerouslySetInnerHTML={{ __html: val }} />
                        </div>
                      );
                    })}
                  </div>

                  {/* Solution Explanation Box */}
                  {q.Solution && (
                    <div className="text-xs bg-brand-bg border border-brand-border rounded-md p-3.5 mt-4 text-brand-text leading-relaxed">
                      <span className="font-bold text-brand-primary block mb-1">Explanation:</span>
                      <p dangerouslySetInnerHTML={{ __html: q.Solution }} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
