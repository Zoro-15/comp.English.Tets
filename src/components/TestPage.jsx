import React, { useState, useEffect, useRef } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import QuestionCard from './QuestionCard';
import QuestionNavigator from './QuestionNavigator';
import ResultPage from './ResultPage';

// High-quality mock questions covering grammar, syntax, vocabulary, spelling, and comprehension
const MOCK_QUESTIONS = [
  {
    id: 1,
    question: "Identify the correct sentence structure.",
    option_a: "Having finished the report, the computer was turned off by Sarah.",
    option_b: "Sarah turned off the computer having finished the report.",
    option_c: "Having finished the report, Sarah turned off the computer.",
    option_d: "The computer Sarah turned off, having finished the report.",
    correct_answer: "c",
    topic: "Grammar & Syntax"
  },
  {
    id: 2,
    question: "Complete the sentence: 'She had hardly stepped out of the house _______ it began to pour.'",
    option_a: "than",
    option_b: "then",
    option_c: "when",
    option_d: "while",
    correct_answer: "c",
    topic: "Conjunctions"
  },
  {
    id: 3,
    question: "Choose the synonym for 'Ephemeral'.",
    option_a: "Eternal",
    option_b: "Transitory",
    option_c: "Spacious",
    option_d: "Enigmatic",
    correct_answer: "b",
    topic: "Vocabulary"
  },
  {
    id: 4,
    question: "Which of the following words is spelt correctly?",
    option_a: "Ocurred",
    option_b: "Occured",
    option_c: "Ocurred",
    option_d: "Occurred",
    correct_answer: "d",
    topic: "Spelling"
  },
  {
    id: 5,
    question: "Fill in the blank with the correct preposition: 'The committee members agreed _______ the proposal without any hesitation.'",
    option_a: "to",
    option_b: "with",
    option_c: "on",
    option_d: "at",
    correct_answer: "a",
    topic: "Prepositions"
  },
  {
    id: 6,
    question: "What is the antonym of 'Mitigate'?",
    option_a: "Alleviate",
    option_b: "Exacerbate",
    option_c: "Ameliorate",
    option_d: "Pacify",
    correct_answer: "b",
    topic: "Vocabulary"
  },
  {
    id: 7,
    question: "Identify the part of speech of the underlined word: 'The dancer performed gracefully on the stage.'",
    option_a: "Adjective",
    option_b: "Adverb",
    option_c: "Noun",
    option_d: "Preposition",
    correct_answer: "b",
    topic: "Parts of Speech"
  },
  {
    id: 8,
    question: "Change to Indirect Speech: He said, 'I will leave tomorrow.'",
    option_a: "He said that he will leave tomorrow.",
    option_b: "He said that he would leave the next day.",
    option_c: "He said that he would leave tomorrow.",
    option_d: "He told he would leave the next day.",
    correct_answer: "b",
    topic: "Indirect Speech"
  },
  {
    id: 9,
    question: "Choose the correct active voice of: 'The trophy was won by the school team.'",
    option_a: "The school team won the trophy.",
    option_b: "The school team had won the trophy.",
    option_c: "The school team wins the trophy.",
    option_d: "The school team has won the trophy.",
    correct_answer: "a",
    topic: "Active & Passive Voice"
  },
  {
    id: 10,
    question: "Identify the figure of speech: 'The wind whispered through the trees.'",
    option_a: "Simile",
    option_b: "Metaphor",
    option_c: "Personification",
    option_d: "Hyperbole",
    correct_answer: "c",
    topic: "Figures of Speech"
  },
  {
    id: 11,
    question: "Choose the word closest in meaning to 'Pragmatic'.",
    option_a: "Practical",
    option_b: "Theoretical",
    option_c: "Idealistic",
    option_d: "Imaginative",
    correct_answer: "a",
    topic: "Vocabulary"
  },
  {
    id: 12,
    question: "Select the sentence that has a subject-verb agreement issue.",
    option_a: "The group of students is going on a field trip.",
    option_b: "Neither the teacher nor the students are attending.",
    option_c: "Bread and butter is my favorite breakfast.",
    option_d: "Every one of the books were damaged in the rain.",
    correct_answer: "d",
    topic: "Subject-Verb Agreement"
  },
  {
    id: 13,
    question: "Choose the correct word to fill in: 'The manager _______ the staff of their security clearances.'",
    option_a: "assured",
    option_b: "insured",
    option_c: "ensured",
    option_d: "secured",
    correct_answer: "a",
    topic: "Homophones & Word Choice"
  },
  {
    id: 14,
    question: "Identify the idiom's meaning: 'To burn the midnight oil'",
    option_a: "To waste resources inefficently",
    option_b: "To study or work late into the night",
    option_c: "To create an unnecessary light source",
    option_d: "To start a fire by mistake",
    correct_answer: "b",
    topic: "Idioms & Phrases"
  },
  {
    id: 15,
    question: "Which word means 'characterized by a desire to do run-of-the-mill or standard work'?",
    option_a: "Exemplary",
    option_b: "Mediocre",
    option_c: "Peculiar",
    option_d: "Splendid",
    correct_answer: "b",
    topic: "Vocabulary"
  },
  {
    id: 16,
    question: "Fill in the blank: 'If he _______ harder, he would have passed the exam.'",
    option_a: "studied",
    option_b: "had studied",
    option_c: "studies",
    option_d: "would study",
    correct_answer: "b",
    topic: "Conditionals"
  },
  {
    id: 17,
    question: "Find the odd one out.",
    option_a: "Meticulous",
    option_b: "Scrupulous",
    option_c: "Fastidious",
    option_d: "Negligent",
    correct_answer: "d",
    topic: "Odd One Out"
  },
  {
    id: 18,
    question: "Complete the sentence: 'The price of groceries has risen, _______ making it difficult for many families.'",
    option_a: "thereby",
    option_b: "therefore",
    option_c: "nevertheless",
    option_d: "whereas",
    correct_answer: "a",
    topic: "Transitions"
  },
  {
    id: 19,
    question: "Choose the correct spelling:",
    option_a: "Accomodate",
    option_b: "Accommodate",
    option_c: "Acomodate",
    option_d: "Acommodate",
    correct_answer: "b",
    topic: "Spelling"
  },
  {
    id: 20,
    question: "What does the root word 'chrono' mean?",
    option_a: "Color",
    option_b: "Shape",
    option_c: "Sound",
    option_d: "Time",
    correct_answer: "d",
    topic: "Word Roots"
  }
];

export default function TestPage() {
  const [questions, setQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [testSubmitted, setTestSubmitted] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Timer state (20 minutes = 1200 seconds)
  const [timeLeft, setTimeLeft] = useState(1200);
  const timerRef = useRef(null);

  // Fetch questions on component mount
  useEffect(() => {
    async function loadQuestions() {
      setLoading(true);
      setError(null);
      setIsDemoMode(false);

      if (!isSupabaseConfigured) {
        console.warn('Supabase is not configured. Falling back to local mock questions.');
        setIsDemoMode(true);
        // Shuffle and slice mock questions
        const shuffled = [...MOCK_QUESTIONS].sort(() => 0.5 - Math.random());
        setQuestions(shuffled.slice(0, 20));
        setLoading(false);
        return;
      }

      try {
        // Fetch questions ordered by ID (ascending), up to 20 questions
        const { data, error: tableError } = await supabase
          .from('questions')
          .select('*')
          .order('id', { ascending: true })
          .limit(20);

        if (tableError) throw tableError;

        if (data && data.length > 0) {
          setQuestions(data);
        } else {
          throw new Error('Questions table is empty. Please populate it in Supabase.');
        }
      } catch (err) {
        console.error('Supabase fetch error, using fallback mock data:', err);
        setError(err.message || 'Failed to fetch from database');
        setIsDemoMode(true);
        // Fallback: Sort mock questions by ID
        const sortedMock = [...MOCK_QUESTIONS].sort((a, b) => a.id - b.id);
        setQuestions(sortedMock.slice(0, 20));
      } finally {
        setLoading(false);
      }
    }

    loadQuestions();
  }, []);

  // Timer interval setup
  useEffect(() => {
    if (!loading && !testSubmitted && questions.length > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleSubmitTest(true); // auto-submit on timeout
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [loading, testSubmitted, questions]);

  // Format time (seconds -> MM:SS)
  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  const handleSelectAnswer = (optionKey) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questions[currentIndex].id]: optionKey,
    }));
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleSubmitTest = (auto = false) => {
    if (!auto) {
      const answeredCount = Object.keys(selectedAnswers).length;
      const confirmMessage = answeredCount === questions.length 
        ? "Are you sure you want to submit your mock test?" 
        : `You have only answered ${answeredCount} of ${questions.length} questions. Submit anyway?`;
      
      if (!window.confirm(confirmMessage)) return;
    }
    
    if (timerRef.current) clearInterval(timerRef.current);
    setTestSubmitted(true);
  };

  const handleRestart = () => {
    setSelectedAnswers({});
    setCurrentIndex(0);
    setTimeLeft(1200);
    setTestSubmitted(false);
    // Sort local fallback questions by ID if in demo mode
    if (isDemoMode) {
      const sortedMock = [...MOCK_QUESTIONS].sort((a, b) => a.id - b.id);
      setQuestions(sortedMock.slice(0, 20));
    }
  };

  const answeredCount = Object.keys(selectedAnswers).length;

  // Render loading skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl space-y-6">
          <div className="h-8 bg-slate-200 rounded-md w-1/3 animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-3 space-y-4">
              <div className="bg-white p-8 rounded-2xl border border-slate-100 h-64 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="h-4 bg-slate-200 rounded-md w-1/4 animate-pulse"></div>
                  <div className="h-6 bg-slate-200 rounded-md w-5/6 animate-pulse"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-10 bg-slate-100 rounded-lg w-full animate-pulse"></div>
                  <div className="h-10 bg-slate-100 rounded-lg w-full animate-pulse"></div>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100 h-80 space-y-4">
              <div className="h-6 bg-slate-200 rounded-md w-1/2 animate-pulse"></div>
              <div className="grid grid-cols-5 gap-2">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div key={i} className="h-8 bg-slate-100 rounded-md animate-pulse"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render result screen
  if (testSubmitted) {
    return (
      <div className="min-h-screen bg-slate-50">
        <ResultPage
          questions={questions}
          selectedAnswers={selectedAnswers}
          onRestart={handleRestart}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between select-none">
      {/* Header Banner */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-100 px-4 py-3.5 shadow-xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-extrabold text-lg">
              E
            </div>
            <h1 className="text-lg font-extrabold text-slate-800 tracking-tight sm:text-xl">
              LexiPrep <span className="font-medium text-slate-400">Mock Test</span>
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Countdown Timer */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border font-mono font-bold text-sm transition-colors ${
              timeLeft < 180 
                ? 'bg-rose-50 border-rose-200 text-rose-600 animate-pulse' 
                : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{formatTime(timeLeft)}</span>
            </div>

            {/* Mobile Sidebar Toggle Button */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 active:bg-slate-300"
              title="Open Navigation"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Demo Warning Header Banner */}
      {isDemoMode && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 text-amber-800 px-4 py-2 text-xs font-semibold text-center flex items-center justify-center gap-1.5">
          <svg className="w-4 h-4 shrink-0 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          Running in offline preview mode (Supabase unconfigured or connection error). Interactive test is fully playable.
        </div>
      )}

      {/* Main Body Layout */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6 md:py-8 flex flex-col md:flex-row gap-6 items-stretch overflow-hidden">
        {/* Left Side: Question area */}
        <div className="flex-1 flex flex-col">
          <QuestionCard
            question={questions[currentIndex]}
            selectedAnswer={selectedAnswers[questions[currentIndex]?.id]}
            onSelectAnswer={handleSelectAnswer}
          />
        </div>

        {/* Right Side / Sidebar: Desktop layout (visible md+) */}
        <aside className="hidden md:flex md:w-80 flex-col bg-white border border-slate-100 rounded-2xl p-6 shadow-sm justify-between gap-6">
          <div>
            <h2 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
              <svg className="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              Question Grid
            </h2>
            <div className="grid grid-cols-5 gap-2 max-h-72 overflow-y-auto pr-1">
              {questions.map((q, idx) => {
                const isSelected = currentIndex === idx;
                const isAnswered = selectedAnswers[q.id] !== undefined;

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-9 w-9 flex items-center justify-center rounded-lg text-xs font-bold transition duration-150 border ${
                      isSelected
                        ? 'bg-indigo-600 border-indigo-600 text-white ring-2 ring-indigo-500/30'
                        : isAnswered
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700 font-semibold'
                        : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {/* Legend indicators */}
            <div className="mt-6 space-y-2 border-t border-slate-100 pt-4 text-xs font-medium text-slate-500">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded bg-indigo-600 border border-indigo-600"></span>
                <span className="text-slate-800">Current Question</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded bg-emerald-50 border border-emerald-200"></span>
                <span className="text-slate-800">Answered</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded bg-slate-50 border border-slate-200"></span>
                <span className="text-slate-500">Unanswered</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => handleSubmitTest(false)}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl transition duration-150 shadow-sm flex items-center justify-center gap-2"
          >
            Submit Test
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </aside>

        {/* Mobile Slide-out Drawer Panel */}
        {isSidebarOpen && (
          <div className="fixed inset-0 z-50 md:hidden animate-fade-in">
            {/* Backdrop overlay */}
            <div 
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"
              onClick={() => setIsSidebarOpen(false)}
            ></div>
            
            {/* Drawer sheet content */}
            <div className="absolute right-0 top-0 bottom-0 w-80 bg-white shadow-2xl p-6 flex flex-col justify-between z-10 animate-slide-in-right">
              <div>
                <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-100">
                  <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                    Question Grid
                  </h2>
                  <button 
                    onClick={() => setIsSidebarOpen(false)}
                    className="p-1 rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="grid grid-cols-5 gap-2 max-h-[60vh] overflow-y-auto">
                  {questions.map((q, idx) => {
                    const isSelected = currentIndex === idx;
                    const isAnswered = selectedAnswers[q.id] !== undefined;

                    return (
                      <button
                        key={q.id}
                        onClick={() => {
                          setCurrentIndex(idx);
                          setIsSidebarOpen(false);
                        }}
                        className={`h-9 w-9 flex items-center justify-center rounded-lg text-xs font-bold transition duration-150 border ${
                          isSelected
                            ? 'bg-indigo-600 border-indigo-600 text-white ring-2 ring-indigo-500/30'
                            : isAnswered
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-700 font-semibold'
                            : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300'
                        }`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>

                {/* Legend indicators */}
                <div className="mt-6 space-y-2 border-t border-slate-100 pt-4 text-xs font-medium text-slate-500">
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded bg-indigo-600 border border-indigo-600"></span>
                    <span className="text-slate-800">Current Question</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded bg-emerald-50 border border-emerald-200"></span>
                    <span className="text-slate-800">Answered</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded bg-slate-50 border border-slate-200"></span>
                    <span className="text-slate-500">Unanswered</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsSidebarOpen(false);
                  handleSubmitTest(false);
                }}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl transition duration-150 shadow-sm flex items-center justify-center gap-2"
              >
                Submit Test
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer Navigation Bar */}
      <QuestionNavigator
        currentIndex={currentIndex}
        totalQuestions={questions.length}
        onPrev={handlePrev}
        onNext={handleNext}
        onSubmit={() => handleSubmitTest(false)}
        answeredCount={answeredCount}
      />
    </div>
  );
}
