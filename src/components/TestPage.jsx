import React, { useState, useEffect, useRef } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import QuestionCard from './QuestionCard';
import QuestionNavigator from './QuestionNavigator';
import ResultPage from './ResultPage';

// High-quality mock questions updated to match the new CSV headers
const MOCK_QUESTIONS = [
  {
    Question_ID: 26224,
    Question: "Identify the correct sentence structure.",
    Option_0: "Having finished the report, the computer was turned off by Sarah.",
    Option_1: "Sarah turned off the computer having finished the report.",
    Option_2: "Having finished the report, Sarah turned off the computer.",
    Option_3: "The computer Sarah turned off, having finished the report.",
    Correct_Answer: "2",
    Solution: "The introductory modifying phrase <em>'Having finished the report'</em> must describe the subject that immediately follows it, which is <strong>Sarah</strong>. Options A, B, and D create dangling modifiers."
  },
  {
    Question_ID: 26225,
    Question: "Complete the sentence: 'She had hardly stepped out of the house _______ it began to pour.'",
    Option_0: "than",
    Option_1: "then",
    Option_2: "when",
    Option_3: "while",
    Correct_Answer: "2",
    Solution: "The grammatical structure <strong>'hardly... when'</strong> is used to show that one event happens immediately after another. 'Hardly' takes 'when' (or 'before'), while 'scarcely' / 'no sooner' takes 'than'."
  },
  {
    Question_ID: 26226,
    Question: "Choose the synonym for 'Ephemeral'.",
    Option_0: "Eternal",
    Option_1: "Transitory",
    Option_2: "Spacious",
    Option_3: "Enigmatic",
    Correct_Answer: "1",
    Solution: "<strong>Ephemeral</strong> means lasting for a very short time. Therefore, <strong>Transitory</strong> (short-lived) is the correct synonym."
  },
  {
    Question_ID: 26227,
    Question: "Which of the following words is spelt correctly?",
    Option_0: "Ocurred",
    Option_1: "Occured",
    Option_2: "Ocurred",
    Option_3: "Occurred",
    Correct_Answer: "3",
    Solution: "The correct spelling of the past tense of occur is <strong>Occurred</strong>, with double 'c' and double 'r'."
  },
  {
    Question_ID: 26228,
    Question: "Fill in the blank with the correct preposition: 'The committee members agreed _______ the proposal without any hesitation.'",
    Option_0: "to",
    Option_1: "with",
    Option_2: "on",
    Option_3: "at",
    Correct_Answer: "0",
    Solution: "We agree <strong>to</strong> a proposal, plan, or suggestion. We agree <strong>with</strong> a person, and agree <strong>on</strong> a topic or decision."
  },
  {
    Question_ID: 26229,
    Question: "What is the antonym of 'Mitigate'?",
    Option_0: "Alleviate",
    Option_1: "Exacerbate",
    Option_2: "Ameliorate",
    Option_3: "Pacify",
    Correct_Answer: "1",
    Solution: "<strong>Mitigate</strong> means to make less severe or serious. Its opposite is <strong>Exacerbate</strong>, which means to make a problem, bad situation, or negative feeling worse."
  },
  {
    Question_ID: 26230,
    Question: "Identify the part of speech of the underlined word: 'The dancer performed <u>gracefully</u> on the stage.'",
    Option_0: "Adjective",
    Option_1: "Adverb",
    Option_2: "Noun",
    Option_3: "Preposition",
    Correct_Answer: "1",
    Solution: "The word <strong>gracefully</strong> describes <em>how</em> the action ('performed') was executed, making it an <strong>adverb</strong>."
  },
  {
    Question_ID: 26231,
    Question: "Change to Indirect Speech: He said, 'I will leave tomorrow.'",
    Option_0: "He said that he will leave tomorrow.",
    Option_1: "He said that he would leave the next day.",
    Option_2: "He said that he would leave tomorrow.",
    Option_3: "He told he would leave the next day.",
    Correct_Answer: "1",
    Solution: "In indirect speech, the pronoun changes (I &rarr; he), the modal changes (will &rarr; would), and time expressions shift (tomorrow &rarr; the next day / the following day)."
  },
  {
    Question_ID: 26232,
    Question: "Choose the correct active voice of: 'The trophy was won by the school team.'",
    Option_0: "The school team won the trophy.",
    Option_1: "The school team had won the trophy.",
    Option_2: "The school team wins the trophy.",
    Option_3: "The school team has won the trophy.",
    Correct_Answer: "0",
    Solution: "The passive voice sentence is in the simple past tense (<em>was won</em>). The active voice counterpart must also use the simple past tense: <strong>won</strong>."
  },
  {
    Question_ID: 26233,
    Question: "Identify the figure of speech: 'The wind whispered through the trees.'",
    Option_0: "Simile",
    Option_1: "Metaphor",
    Option_2: "Personification",
    Option_3: "Hyperbole",
    Correct_Answer: "2",
    Solution: "Giving human qualities (whispering) to non-human things (wind) is called <strong>Personification</strong>."
  },
  {
    Question_ID: 26234,
    Question: "Choose the word closest in meaning to 'Pragmatic'.",
    Option_0: "Practical",
    Option_1: "Theoretical",
    Option_2: "Idealistic",
    Option_3: "Imaginative",
    Correct_Answer: "0",
    Solution: "<strong>Pragmatic</strong> means dealing with things sensibly and realistically in a way that is based on practical rather than theoretical considerations."
  },
  {
    Question_ID: 26235,
    Question: "Select the sentence that has a subject-verb agreement issue.",
    Option_0: "The group of students is going on a field trip.",
    Option_1: "Neither the teacher nor the students are attending.",
    Option_2: "Bread and butter is my favorite breakfast.",
    Option_3: "Every one of the books were damaged in the rain.",
    Correct_Answer: "3",
    Solution: "The subject 'Every one' is singular, so it requires the singular verb <strong>'was'</strong> instead of the plural 'were'."
  },
  {
    Question_ID: 26236,
    Question: "Choose the correct word to fill in: 'The manager _______ the staff of their security clearances.'",
    Option_0: "assured",
    Option_1: "insured",
    Option_2: "ensured",
    Option_3: "secured",
    Correct_Answer: "0",
    Solution: "To <strong>assure</strong> is to tell someone something positively to dispel any doubts. To <em>ensure</em> means to make certain, and to <em>insure</em> is related to insurance policies."
  },
  {
    Question_ID: 26237,
    Question: "Identify the idiom's meaning: 'To burn the midnight oil'",
    Option_0: "To waste resources inefficiently",
    Option_1: "To study or work late into the night",
    Option_2: "To create an unnecessary light source",
    Option_3: "To start a fire by mistake",
    Correct_Answer: "1",
    Solution: "The historical idiom <strong>'to burn the midnight oil'</strong> means to stay up late working or studying by the light of an oil lamp."
  },
  {
    Question_ID: 26238,
    Question: "Which word means 'characterized by a desire to do run-of-the-mill or standard work'?",
    Option_0: "Exemplary",
    Option_1: "Mediocre",
    Option_2: "Peculiar",
    Option_3: "Splendid",
    Correct_Answer: "1",
    Solution: "<strong>Mediocre</strong> means of only moderate quality or average; run-of-the-mill."
  },
  {
    Question_ID: 26239,
    Question: "Fill in the blank: 'If he _______ harder, he would have passed the exam.'",
    Option_0: "studied",
    Option_1: "had studied",
    Option_2: "studies",
    Option_3: "would study",
    Correct_Answer: "1",
    Solution: "This is a **third conditional** sentence representing a hypothetical past action. The structure is: <em>If + past perfect (had studied), ... would have + past participle (passed)</em>."
  },
  {
    Question_ID: 26240,
    Question: "Find the odd one out.",
    Option_0: "Meticulous",
    Option_1: "Scrupulous",
    Option_2: "Fastidious",
    Option_3: "Negligent",
    Correct_Answer: "3",
    Solution: "Meticulous, scrupulous, and fastidious are synonyms referring to paying close attention to details. <strong>Negligent</strong> (careless) is the antonym."
  },
  {
    Question_ID: 26241,
    Question: "Complete the sentence: 'The price of groceries has risen, _______ making it difficult for many families.'",
    Option_0: "thereby",
    Option_1: "therefore",
    Option_2: "nevertheless",
    Option_3: "whereas",
    Correct_Answer: "0",
    Solution: "<strong>Thereby</strong> means 'by that means' or 'as a result of that' which perfectly links the cause and effect clauses."
  },
  {
    Question_ID: 26242,
    Question: "Choose the correct spelling:",
    Option_0: "Accomodate",
    Option_1: "Accommodate",
    Option_2: "Acomodate",
    Option_3: "Acommodate",
    Correct_Answer: "1",
    Solution: "The correct spelling of this word contains double 'c' and double 'm': <strong>Accommodate</strong>."
  },
  {
    Question_ID: 26243,
    Question: "What does the root word 'chrono' mean?",
    Option_0: "Color",
    Option_1: "Shape",
    Option_2: "Sound",
    Option_3: "Time",
    Correct_Answer: "3",
    Solution: "The prefix <strong>chrono-</strong> is derived from the Greek word for <strong>time</strong> (e.g. chronology, chronometer)."
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
  const [view, setView] = useState('home'); // 'home' | 'testing'
  
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
        // Sort mock questions by Question_ID
        const sortedMock = [...MOCK_QUESTIONS].sort((a, b) => a.Question_ID - b.Question_ID);
        setQuestions(sortedMock.slice(0, 20));
        setLoading(false);
        return;
      }

      try {
        // Fetch questions ordered by Question_ID (ascending), up to 20 questions
        const { data, error: tableError } = await supabase
          .from('questions')
          .select('*')
          .order('Question_ID', { ascending: true })
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
        const sortedMock = [...MOCK_QUESTIONS].sort((a, b) => a.Question_ID - b.Question_ID);
        setQuestions(sortedMock.slice(0, 20));
      } finally {
        setLoading(false);
      }
    }

    loadQuestions();
  }, []);

  // Timer interval setup
  useEffect(() => {
    if (!loading && !testSubmitted && view === 'testing' && questions.length > 0) {
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
  }, [loading, testSubmitted, view, questions]);

  // Format time (seconds -> MM:SS)
  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  const handleSelectAnswer = (optionKey) => {
    if (questions[currentIndex]) {
      setSelectedAnswers((prev) => ({
        ...prev,
        [questions[currentIndex].Question_ID]: optionKey,
      }));
    }
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
    setView('home'); // Go back to landing home view
    // Sort local fallback questions by ID if in demo mode
    if (isDemoMode) {
      const sortedMock = [...MOCK_QUESTIONS].sort((a, b) => a.Question_ID - b.Question_ID);
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

  // Render Home/Landing View
  if (view === 'home') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between select-none">
        {/* Header */}
        <header className="bg-white border-b border-slate-100 px-4 py-4 shadow-xs">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-extrabold text-lg">
                E
              </div>
              <h1 className="text-lg font-extrabold text-slate-800 tracking-tight sm:text-xl uppercase">
                ENGLISH MOCK TESTS
              </h1>
            </div>
          </div>
        </header>

        {/* Demo Warning Banner */}
        {isDemoMode && (
          <div className="bg-amber-500/10 border-b border-amber-500/20 text-amber-800 px-4 py-2 text-xs font-semibold text-center flex items-center justify-center gap-1.5">
            <svg className="w-4 h-4 shrink-0 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Running in offline preview mode (Supabase unconfigured or connection error). Interactive test is fully playable.
          </div>
        )}

        {/* Home Main Content */}
        <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-12 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-8 border border-indigo-100 shadow-sm animate-bounce-slow">
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>

          <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl mb-4">
            ENGLISH MOCK TESTS
          </h2>
          <p className="text-lg text-slate-600 mb-10 max-w-xl leading-relaxed">
            Test your proficiency and grammar skills with our interactive, timed simulation. Access detailed explanations for every question upon completion.
          </p>

          {/* Test Specs Cards */}
          <div className="grid grid-cols-3 gap-4 w-full mb-10 text-left">
            <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-xs">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Questions</span>
              <span className="text-xl font-bold text-slate-800">{questions.length} Questions</span>
            </div>
            <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-xs">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Duration</span>
              <span className="text-xl font-bold text-slate-800">20 Minutes</span>
            </div>
            <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-xs">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Format</span>
              <span className="text-xl font-bold text-slate-800">Multiple Choice</span>
            </div>
          </div>

          {/* Instructions Box */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 text-left w-full shadow-xs mb-10">
            <h3 className="text-base font-bold text-slate-800 mb-3 uppercase tracking-wider">Test Instructions</h3>
            <ul className="space-y-2 text-sm text-slate-600 list-disc pl-5 leading-relaxed">
              <li>Each question has <strong>four options</strong> with only <strong>one correct answer</strong>.</li>
              <li>You can navigate back and forth between questions using the bottom panel or the side grid.</li>
              <li>The test timer will run continuously. If time runs out, your progress will be <strong>submitted automatically</strong>.</li>
              <li>Detailed solutions and report statistics will be presented instantly after clicking <strong>Submit</strong>.</li>
            </ul>
          </div>

          <button
            onClick={() => setView('testing')}
            className="w-full sm:w-64 py-4 px-6 bg-linear-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 active:from-indigo-800 active:to-violet-800 text-white font-extrabold rounded-xl transition duration-150 shadow-md shadow-indigo-200/50 hover:shadow-lg flex items-center justify-center gap-2 text-base cursor-pointer"
          >
            Start Mock Test
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          </button>
        </main>

        {/* Footer */}
        <footer className="py-6 border-t border-slate-100 text-center text-xs font-medium text-slate-400">
          ENGLISH MOCK TESTS &copy; {new Date().getFullYear()} &bull; Practice & Excel
        </footer>
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
            <h1 className="text-lg font-extrabold text-slate-800 tracking-tight sm:text-xl uppercase">
              ENGLISH MOCK TESTS
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
            selectedAnswer={selectedAnswers[questions[currentIndex]?.Question_ID]}
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
                const isAnswered = selectedAnswers[q.Question_ID] !== undefined;

                return (
                  <button
                    key={q.Question_ID}
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
                    const isAnswered = selectedAnswers[q.Question_ID] !== undefined;

                    return (
                      <button
                        key={q.Question_ID}
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
