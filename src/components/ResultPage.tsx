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
  currentStreak,
  testId,
  onRestart,
  onNextTest,
  onBackToHome
}: ResultPageProps) {
  const [filter, setFilter] = useState<'all' | 'correct' | 'incorrect'>('all');

  // Calculate score details
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
  const missedCount = wrongCount + unansweredCount;
  const showRecommendation = missedCount >= 3;

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
    return true; // 'all'
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in animate-duration-300">
      {/* Top Banner / Heading */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
          Test Report Card
        </h1>
        <p className="mt-2 text-base text-slate-650 font-bold uppercase tracking-widest bg-indigo-50/50 border border-indigo-100 rounded-lg px-3 py-1.5 inline-block text-indigo-700">
          Mock Test {testId} completed
        </p>
      </div>

      {/* Main 6 Summary Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {/* Score Card */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Total Score</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          <span className="text-2xl font-extrabold text-slate-800">{score} / {totalQuestions}</span>
        </div>

        {/* Accuracy Card */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Accuracy</span>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${accuracy >= 80 ? 'bg-emerald-50 text-emerald-600' : accuracy >= 50 ? 'bg-indigo-50 text-indigo-600' : 'bg-rose-50 text-rose-600'}`}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <span className="text-2xl font-extrabold text-slate-800">{accuracy}%</span>
        </div>

        {/* Time Taken Card */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Time Taken</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <span className="text-2xl font-extrabold text-slate-800">{formatTime(timeTaken)}</span>
        </div>

        {/* Questions Correct Card */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Correct</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <span className="text-2xl font-extrabold text-emerald-600">{correctCount}</span>
        </div>

        {/* Questions Incorrect Card */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Incorrect / Skipped</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
          <span className="text-2xl font-extrabold text-rose-600">{missedCount}</span>
        </div>

        {/* Current Streak Card */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Current Streak</span>
            <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          </div>
          <span className="text-2xl font-extrabold text-orange-600">🔥 {currentStreak} {currentStreak === 1 ? 'Day' : 'Days'}</span>
        </div>
      </div>

      {/* Action Progression Panel: Retake vs Proceed to Next Test */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 mb-8 flex flex-col sm:flex-row gap-5 items-center justify-between shadow-xs">
        <div className="text-center sm:text-left space-y-0.5">
          <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">Test Progression</h3>
          <p className="text-xs text-slate-505">
            You can retake this test for a higher score or advance to the next set.
          </p>
        </div>
        <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-3">
          <button
            onClick={onBackToHome}
            className="w-full sm:w-auto py-3 px-5 border border-slate-205 hover:bg-slate-50 text-slate-700 font-bold rounded-xl transition duration-150 flex items-center justify-center gap-2 cursor-pointer text-sm"
          >
            <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Back to Dashboard
          </button>
          
          <button
            onClick={onRestart}
            className="w-full sm:w-auto py-3 px-5 border border-slate-205 hover:bg-slate-50 text-slate-700 font-bold rounded-xl transition duration-150 flex items-center justify-center gap-2 cursor-pointer text-sm"
          >
            <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H18.2" />
            </svg>
            Retake Test {testId}
          </button>
          
          <button
            onClick={onNextTest}
            className="w-full sm:w-auto py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl transition duration-150 shadow-md shadow-indigo-200/50 flex items-center justify-center gap-2 cursor-pointer text-sm"
          >
            Proceed to Test {testId + 1}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Adaptive Practice Recommendation Card */}
      {showRecommendation && (
        <div className="bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-100 rounded-2xl p-6 mb-10 shadow-xs flex items-start gap-4 animate-fade-in animate-duration-300">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/10 flex items-center justify-center text-indigo-600 shrink-0">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div className="space-y-1">
            <h4 className="text-base font-extrabold text-indigo-905">Practice More Recommended</h4>
            <p className="text-sm text-indigo-700 font-medium">
              You missed {missedCount} {missedCount === 1 ? 'question' : 'questions'} in this test.
            </p>
            <p className="text-xs text-indigo-500 leading-relaxed mt-1">
              Review your incorrect questions below to understand the gaps in grammar or spelling rules before taking the next test.
            </p>
          </div>
        </div>
      )}

      {/* Review Analysis */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            Detailed Question Analysis
          </h2>

          {/* Filtering Control */}
          <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200 shadow-xs self-start sm:self-auto">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filter === 'all'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              All ({questions.length})
            </button>
            <button
              onClick={() => setFilter('correct')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filter === 'correct'
                  ? 'bg-white text-emerald-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Correct ({correctCount})
            </button>
            <button
              onClick={() => setFilter('incorrect')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filter === 'incorrect'
                  ? 'bg-white text-rose-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Incorrect ({missedCount})
            </button>
          </div>
        </div>

        {/* Empty State for Filters */}
        {filteredQuestions.length === 0 ? (
          <div className="bg-white border border-slate-100 rounded-2xl p-10 text-center shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 mx-auto mb-4 border border-slate-100">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h4 className="text-slate-800 font-bold text-sm">No Questions Found</h4>
            <p className="text-slate-505 text-xs mt-1">There are no questions matching this filter criteria.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredQuestions.map((q) => {
              // Find the absolute question index from the original array
              const originalIndex = questions.findIndex((origQ) => origQ.Question_ID === q.Question_ID);
              const selected = selectedAnswers[q.Question_ID];
              const isCorrect = selected !== undefined && String(selected).trim() === String(q.Correct_Answer_Index).trim();
              const wasSkipped = selected === undefined || selected === null;

              return (
                <div
                  key={q.Question_ID}
                  className={`bg-white border rounded-2xl p-6 shadow-sm transition-all hover:shadow-md ${
                    wasSkipped
                      ? 'border-amber-200 bg-amber-50/10'
                      : isCorrect
                      ? 'border-emerald-200 bg-emerald-50/10'
                      : 'border-rose-200 bg-rose-50/10'
                  }`}
                >
                  {/* Badge Header */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-slate-800 text-sm">
                        Question {originalIndex + 1}
                      </span>
                    </div>
                    
                    {/* Status Indicator */}
                    {wasSkipped ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                        Skipped
                      </span>
                    ) : isCorrect ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                        Correct
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800">
                        Incorrect
                      </span>
                    )}
                  </div>

                  {/* Question Stem */}
                  <p className="text-slate-800 font-medium text-base mb-4 leading-relaxed" dangerouslySetInnerHTML={{ __html: q.Question }} />

                  {/* Options List */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    {[
                      { key: '0', val: q.Option_0 },
                      { key: '1', val: q.Option_1 },
                      { key: '2', val: q.Option_2 },
                      { key: '3', val: q.Option_3 },
                    ].map(({ key, val }) => {
                      const isKeySelected = selected !== undefined && String(selected).trim() === String(key);
                      const isKeyCorrect = String(q.Correct_Answer_Index).trim() === String(key);

                      let optionStyle = "border-slate-100 bg-slate-50/50 text-slate-700";
                      
                      if (isKeyCorrect) {
                        optionStyle = "border-emerald-400 bg-emerald-50 text-emerald-900 font-medium";
                      } else if (isKeySelected && !isCorrect) {
                        optionStyle = "border-rose-400 bg-rose-50 text-rose-900 font-medium";
                      }

                      return (
                        <div
                          key={key}
                          className={`flex items-start p-3 border rounded-xl text-sm ${optionStyle}`}
                        >
                          <span className="font-bold uppercase mr-2.5 text-xs px-2 py-0.5 bg-white border border-slate-200 rounded-md">
                            {getOptionLetter(key)}
                          </span>
                          <span dangerouslySetInnerHTML={{ __html: val }} />
                        </div>
                      );
                    })}
                  </div>

                  {/* Solution Explanation Box */}
                  {q.Solution && (
                    <div className="text-xs bg-indigo-50/50 border border-indigo-100 rounded-xl p-4 mt-4 text-slate-700">
                      <span className="font-bold text-indigo-905 block mb-1">Explanation & Solution:</span>
                      <p className="leading-relaxed" dangerouslySetInnerHTML={{ __html: q.Solution }} />
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
