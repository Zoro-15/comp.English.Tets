import React, { useState } from 'react';
import type { Question } from '../types';

interface ResultPageProps {
  questions: Question[];
  selectedAnswers: Record<number, string | number>;
  timeTaken: number; // in seconds
  currentStreak: number;
  testId: number;
  onRestart: () => void;
  onNextTest: () => void;
  onBackToHome: () => void;
}

export default function ResultPage({
  questions,
  selectedAnswers,
  timeTaken,
  testId,
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
  const score = correctCount;
  const attemptedCount = correctCount + wrongCount;
  const accuracy = attemptedCount > 0 ? Math.round((correctCount / attemptedCount) * 100) : 0;

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
    <div className="max-w-4xl mx-auto px-4 py-8 font-source text-[#6B6B6B]">
      {/* Top Heading */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-normal text-slate-800 font-lora">
          Test Report Card
        </h2>
        <p className="text-xs text-[#6B6B6B] mt-1 font-light tracking-wide uppercase">
          Mock Test {testId} completed
        </p>
      </div>

      {/* Horizontal Summary Row */}
      <div className="bg-[#F4F2EC] border border-[#ECECEC] rounded-lg p-5 mb-6">
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-4 text-center divide-y sm:divide-y-0 sm:divide-x divide-[#ECECEC]/70">
          <div className="pt-2 sm:pt-0">
            <span className="block text-[10px] uppercase tracking-wider text-[#6B6B6B] font-semibold mb-0.5">Score</span>
            <span className="text-lg font-bold text-slate-850 font-lora">{score} / {totalQuestions}</span>
          </div>
          <div className="pt-2 sm:pt-0">
            <span className="block text-[10px] uppercase tracking-wider text-[#6B6B6B] font-semibold mb-0.5">Accuracy</span>
            <span className="text-lg font-bold text-slate-855">{accuracy}%</span>
          </div>
          <div className="pt-2 sm:pt-0">
            <span className="block text-[10px] uppercase tracking-wider text-[#6B6B6B] font-semibold mb-0.5">Time Taken</span>
            <span className="text-lg font-bold text-slate-855 font-mono">{formatTime(timeTaken)}</span>
          </div>
          <div className="pt-2 sm:pt-0">
            <span className="block text-[10px] uppercase tracking-wider text-[#6B6B6B] font-semibold mb-0.5">Correct</span>
            <span className="text-lg font-bold text-[#4F6F52]">{correctCount}</span>
          </div>
          <div className="pt-2 sm:pt-0">
            <span className="block text-[10px] uppercase tracking-wider text-[#6B6B6B] font-semibold mb-0.5">Incorrect</span>
            <span className="text-lg font-bold text-rose-600">{wrongCount}</span>
          </div>
          <div className="pt-2 sm:pt-0">
            <span className="block text-[10px] uppercase tracking-wider text-[#6B6B6B] font-semibold mb-0.5">Skipped</span>
            <span className="text-lg font-bold text-amber-600">{unansweredCount}</span>
          </div>
        </div>

        {/* Thin progress bar underneath */}
        <div className="mt-5 w-full bg-[#FAF9F6] h-1 rounded-full overflow-hidden border border-[#ECECEC]">
          <div className="bg-[#4F6F52] h-full rounded-full transition-all duration-300" style={{ width: `${accuracy}%` }} />
        </div>
      </div>

      {/* Performance Insights */}
      <div className="bg-[#F4F2EC] border border-[#ECECEC] rounded-lg p-6 mb-8 space-y-4">
        <h3 className="text-sm font-normal text-slate-800 font-lora border-b border-[#ECECEC] pb-1.5">
          Performance Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs leading-relaxed">
          <div>
            <span className="block text-[10px] font-bold uppercase tracking-wider text-[#6B6B6B] mb-1">Strong Areas</span>
            <p className="text-slate-700">
              {accuracy >= 80 
                ? "Excellent sentence structure comprehension and vocabulary recognition." 
                : accuracy >= 50 
                ? "Solid recognition of basic grammar conventions." 
                : "Active question participation under strict timing constraints."}
            </p>
          </div>
          <div>
            <span className="block text-[10px] font-bold uppercase tracking-wider text-[#6B6B6B] mb-1">Needs Improvement</span>
            <p className="text-slate-700">
              {wrongCount > 0 
                ? "Review introductory modifying phrases, spelling patterns, and preposition choices." 
                : unansweredCount > 0 
                ? "Improve speed to ensure all questions are answered before time runs out." 
                : "Excellent work! Keep maintaining this high level of accuracy."}
            </p>
          </div>
          <div>
            <span className="block text-[10px] font-bold uppercase tracking-wider text-[#6B6B6B] mb-1">Next Recommended Test</span>
            <p className="text-slate-700 font-semibold">
              {accuracy >= 70 
                ? `Mock Test ${testId + 1}` 
                : `Mock Test ${testId} (Retake suggested)`}
            </p>
          </div>
        </div>
      </div>

      {/* Action Progression Panel */}
      <div className="bg-[#F4F2EC] border border-[#ECECEC] rounded-lg p-5 mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="text-center sm:text-left">
          <h4 className="text-xs font-semibold text-slate-800 uppercase tracking-wider">Test Progression</h4>
          <p className="text-[11px] text-[#6B6B6B] mt-0.5">
            You can retake this test for a higher score or advance to the next set.
          </p>
        </div>
        <div className="w-full sm:w-auto flex flex-wrap gap-2.5 justify-center">
          <button
            onClick={onBackToHome}
            className="py-2 px-4 border border-[#6B6B6B] text-[#6B6B6B] hover:bg-[#6B6B6B]/5 font-semibold rounded-md transition-colors duration-150 flex items-center gap-1.5 cursor-pointer text-xs"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Back to Dashboard
          </button>
          
          <button
            onClick={onRestart}
            className="py-2 px-4 border border-[#6B6B6B] text-[#6B6B6B] hover:bg-[#6B6B6B]/5 font-semibold rounded-md transition-colors duration-150 flex items-center gap-1.5 cursor-pointer text-xs"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H18.2" />
            </svg>
            Retake Test {testId}
          </button>
          
          <button
            onClick={onNextTest}
            className="py-2 px-4 border border-[#4F6F52] text-[#4F6F52] hover:bg-[#4F6F52] hover:text-white font-semibold rounded-md transition-colors duration-150 flex items-center gap-1.5 cursor-pointer text-xs"
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-3 border-b border-[#ECECEC]">
          <h3 className="text-base font-normal text-slate-800 font-lora">
            Detailed Question Analysis
          </h3>

          {/* Filtering Control */}
          <div className="inline-flex rounded-md bg-[#FAF9F6] p-0.5 border border-[#ECECEC]">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded text-xs transition-colors cursor-pointer ${
                filter === 'all'
                  ? 'bg-[#E7EFE9] text-[#4F6F52] font-semibold'
                  : 'text-[#6B6B6B] hover:text-slate-800'
              }`}
            >
              All ({questions.length})
            </button>
            <button
              onClick={() => setFilter('correct')}
              className={`px-3 py-1 rounded text-xs transition-colors cursor-pointer ${
                filter === 'correct'
                  ? 'bg-[#E7EFE9] text-[#4F6F52] font-semibold'
                  : 'text-[#6B6B6B] hover:text-slate-800'
              }`}
            >
              Correct ({correctCount})
            </button>
            <button
              onClick={() => setFilter('incorrect')}
              className={`px-3 py-1 rounded text-xs transition-colors cursor-pointer ${
                filter === 'incorrect'
                  ? 'bg-rose-50 text-rose-700 font-semibold'
                  : 'text-[#6B6B6B] hover:text-slate-800'
              }`}
            >
              Incorrect ({wrongCount + unansweredCount})
            </button>
          </div>
        </div>

        {/* Empty State */}
        {filteredQuestions.length === 0 ? (
          <div className="bg-[#F4F2EC] border border-[#ECECEC] rounded-lg p-8 text-center">
            <h5 className="text-[#6B6B6B] font-semibold text-sm">No questions found matching this filter.</h5>
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
                  className={`bg-[#F4F2EC] border rounded-lg p-5 transition-colors ${
                    wasSkipped
                      ? 'border-amber-200'
                      : isCorrect
                      ? 'border-[#E7EFE9]'
                      : 'border-rose-200'
                  }`}
                >
                  {/* Badge Header */}
                  <div className="flex items-center justify-between mb-3 text-xs">
                    <span className="font-semibold text-slate-800">
                      Question {originalIndex + 1}
                    </span>
                    
                    {wasSkipped ? (
                      <span className="text-amber-700 font-semibold">Skipped</span>
                    ) : isCorrect ? (
                      <span className="text-[#4F6F52] font-semibold">Correct</span>
                    ) : (
                      <span className="text-rose-650 font-semibold">Incorrect</span>
                    )}
                  </div>

                  {/* Question Stem */}
                  <p className="text-slate-800 font-medium text-sm sm:text-base mb-4 leading-relaxed" dangerouslySetInnerHTML={{ __html: q.Question }} />

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

                      let optionStyle = "border-[#ECECEC] bg-[#FAF9F6] text-[#6B6B6B]";
                      
                      if (isKeyCorrect) {
                        optionStyle = "border-[#4F6F52] bg-[#E7EFE9] text-slate-850 font-medium";
                      } else if (isKeySelected && !isCorrect) {
                        optionStyle = "border-rose-350 bg-rose-50/50 text-rose-850";
                      }

                      return (
                        <div
                          key={key}
                          className={`flex items-start p-3 border rounded-md text-xs sm:text-sm ${optionStyle}`}
                        >
                          <span className="font-semibold uppercase mr-2 text-[10px] px-1.5 py-0.5 bg-white border border-[#ECECEC] rounded">
                            {getOptionLetter(key)}
                          </span>
                          <span dangerouslySetInnerHTML={{ __html: val }} />
                        </div>
                      );
                    })}
                  </div>

                  {/* Solution Explanation Box */}
                  {q.Solution && (
                    <div className="text-xs bg-[#FAF9F6] border border-[#ECECEC] rounded-md p-3.5 mt-4 text-[#6B6B6B] leading-relaxed">
                      <span className="font-bold text-[#4F6F52] block mb-1">Explanation:</span>
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
