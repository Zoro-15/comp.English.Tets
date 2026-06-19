import React from 'react';

export default function ResultPage({ questions, selectedAnswers, onRestart }) {
  // Calculate score details
  let correctCount = 0;
  let wrongCount = 0;
  let unansweredCount = 0;

  questions.forEach((q) => {
    const selected = selectedAnswers[q.id];
    if (selected === undefined || selected === null) {
      unansweredCount++;
    } else if (String(selected).trim().toLowerCase() === String(q.correct_answer).trim().toLowerCase()) {
      correctCount++;
    } else {
      wrongCount++;
    }
  });

  const totalQuestions = questions.length;
  const score = correctCount;
  const accuracy = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  // Determine feedback message based on score
  let feedbackMessage = "Keep practicing!";
  let feedbackColor = "text-amber-500";
  if (accuracy >= 80) {
    feedbackMessage = "Excellent work! Outstanding performance.";
    feedbackColor = "text-emerald-500";
  } else if (accuracy >= 50) {
    feedbackMessage = "Good job! You have a solid grasp.";
    feedbackColor = "text-indigo-500";
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      {/* Top Banner / Heading */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
          Test Report Card
        </h1>
        <p className="mt-2 text-lg text-slate-600">
          Here is how you performed in your English Mock Test.
        </p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* Score Ring Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col items-center justify-center">
          <div className="relative w-36 h-36 flex items-center justify-center">
            {/* SVG Ring */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="72"
                cy="72"
                r="64"
                stroke="#f1f5f9"
                strokeWidth="10"
                fill="transparent"
              />
              <circle
                cx="72"
                cy="72"
                r="64"
                stroke={accuracy >= 80 ? '#10b981' : accuracy >= 50 ? '#6366f1' : '#f43f5e'}
                strokeWidth="10"
                fill="transparent"
                strokeDasharray={402}
                strokeDashoffset={402 - (402 * accuracy) / 100}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute text-center">
              <span className="text-4xl font-extrabold text-slate-900">{accuracy}%</span>
              <span className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mt-0.5">Accuracy</span>
            </div>
          </div>
          <p className={`mt-4 font-semibold text-center ${feedbackColor}`}>{feedbackMessage}</p>
        </div>

        {/* Breakdown Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col justify-between md:col-span-2">
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">
              Performance Breakdown
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-slate-50 rounded-xl p-4 text-center">
                <span className="block text-3xl font-extrabold text-slate-800">{score}</span>
                <span className="text-xs font-medium text-slate-500">Correct Score</span>
              </div>
              <div className="bg-emerald-50 rounded-xl p-4 text-center">
                <span className="block text-3xl font-extrabold text-emerald-600">{correctCount}</span>
                <span className="text-xs font-medium text-emerald-600">Correct</span>
              </div>
              <div className="bg-rose-50 rounded-xl p-4 text-center">
                <span className="block text-3xl font-extrabold text-rose-600">{wrongCount}</span>
                <span className="text-xs font-medium text-rose-600">Incorrect</span>
              </div>
              <div className="bg-amber-50 rounded-xl p-4 text-center">
                <span className="block text-3xl font-extrabold text-amber-600">{unansweredCount}</span>
                <span className="text-xs font-medium text-amber-600">Skipped</span>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <button
              onClick={onRestart}
              className="flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition duration-150 shadow-sm flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H18.2" />
              </svg>
              Retake Mock Test
            </button>
          </div>
        </div>
      </div>

      {/* Review Analysis */}
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 mb-6 flex items-center gap-2">
          <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
          Detailed Question Analysis
        </h2>

        <div className="space-y-6">
          {questions.map((q, idx) => {
            const selected = selectedAnswers[q.id];
            const isCorrect = selected && String(selected).trim().toLowerCase() === String(q.correct_answer).trim().toLowerCase();
            const wasSkipped = selected === undefined || selected === null;

            return (
              <div
                key={q.id}
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
                      Question {idx + 1}
                    </span>
                    {q.topic && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700">
                        {q.topic}
                      </span>
                    )}
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
                <p className="text-slate-800 font-medium text-base mb-4 leading-relaxed">
                  {q.question}
                </p>

                {/* Options List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  {[
                    { key: 'a', val: q.option_a },
                    { key: 'b', val: q.option_b },
                    { key: 'c', val: q.option_c },
                    { key: 'd', val: q.option_d },
                  ].map(({ key, val }) => {
                    const isKeySelected = selected && String(selected).trim().toLowerCase() === key;
                    const isKeyCorrect = String(q.correct_answer).trim().toLowerCase() === key;

                    let optionStyle = "border-slate-100 bg-slate-50/50 text-slate-700";
                    
                    if (isKeyCorrect) {
                      // Correct option is always highlighted green for reference
                      optionStyle = "border-emerald-400 bg-emerald-50 text-emerald-900 font-medium";
                    } else if (isKeySelected && !isCorrect) {
                      // User's incorrect choice is highlighted red
                      optionStyle = "border-rose-400 bg-rose-50 text-rose-900 font-medium";
                    }

                    return (
                      <div
                        key={key}
                        className={`flex items-start p-3 border rounded-xl text-sm ${optionStyle}`}
                      >
                        <span className="font-bold uppercase mr-2.5 text-xs px-2 py-0.5 bg-white border border-slate-200 rounded-md">
                          {key}
                        </span>
                        <span>{val}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Bottom Result Review Banner */}
                {!isCorrect && (
                  <div className="text-xs bg-slate-50 border border-slate-100 rounded-xl p-3 text-slate-600">
                    <span className="font-bold text-slate-800 mr-2">Explanation/Correct Answer:</span>
                    Your choice: <span className="font-semibold text-rose-600 uppercase">{selected || 'None'}</span> | 
                    Correct answer: <span className="font-semibold text-emerald-600 uppercase">{q.correct_answer}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
