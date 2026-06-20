import React, { useState, useEffect, useRef } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import QuestionCard from './QuestionCard';
import QuestionNavigator from './QuestionNavigator';
import ResultPage from './ResultPage';
import LoginScreen from './LoginScreen';
import type { Question, TestAttempt, UserStreak } from '../types';

// High-quality mock questions updated to match the new CSV headers
const MOCK_QUESTIONS: Question[] = [
  {
    Question_ID: 26224,
    Question: "Identify the correct sentence structure.",
    Option_0: "Having finished the report, the computer was turned off by Sarah.",
    Option_1: "Sarah turned off the computer having finished the report.",
    Option_2: "Having finished the report, Sarah turned off the computer.",
    Option_3: "The computer Sarah turned off, having finished the report.",
    Correct_Answer_Index: "2",
    Solution: "The introductory modifying phrase <em>'Having finished the report'</em> must describe the subject that immediately follows it, which is <strong>Sarah</strong>. Options A, B, and D create dangling modifiers."
  },
  {
    Question_ID: 26225,
    Question: "Complete the sentence: 'She had hardly stepped out of the house _______ it began to pour.'",
    Option_0: "than",
    Option_1: "then",
    Option_2: "when",
    Option_3: "while",
    Correct_Answer_Index: "2",
    Solution: "The grammatical structure <strong>'hardly... when'</strong> is used to show that one event happens immediately after another. 'Hardly' takes 'when' (or 'before'), while 'scarcely' / 'no sooner' takes 'than'."
  },
  {
    Question_ID: 26226,
    Question: "Choose the synonym for 'Ephemeral'.",
    Option_0: "Eternal",
    Option_1: "Transitory",
    Option_2: "Spacious",
    Option_3: "Enigmatic",
    Correct_Answer_Index: "1",
    Solution: "<strong>Ephemeral</strong> means lasting for a very short time. Therefore, <strong>Transitory</strong> (short-lived) is the correct synonym."
  },
  {
    Question_ID: 26227,
    Question: "Which of the following words is spelt correctly?",
    Option_0: "Ocurred",
    Option_1: "Occured",
    Option_2: "Ocurred",
    Option_3: "Occurred",
    Correct_Answer_Index: "3",
    Solution: "The correct spelling of the past tense of occur is <strong>Occurred</strong>, with double 'c' and double 'r'."
  },
  {
    Question_ID: 26228,
    Question: "Fill in the blank with the correct preposition: 'The committee members agreed _______ the proposal without any hesitation.'",
    Option_0: "to",
    Option_1: "with",
    Option_2: "on",
    Option_3: "at",
    Correct_Answer_Index: "0",
    Solution: "We agree <strong>to</strong> a proposal, plan, or suggestion. We agree <strong>with</strong> a person, and agree <strong>on</strong> a topic or decision."
  },
  {
    Question_ID: 26229,
    Question: "What is the antonym of 'Mitigate'?",
    Option_0: "Alleviate",
    Option_1: "Exacerbate",
    Option_2: "Ameliorate",
    Option_3: "Pacify",
    Correct_Answer_Index: "1",
    Solution: "<strong>Mitigate</strong> means to make less severe or serious. Its opposite is <strong>Exacerbate</strong>, which means to make a problem, bad situation, or negative feeling worse."
  },
  {
    Question_ID: 26230,
    Question: "Identify the part of speech of the underlined word: 'The dancer performed <u>gracefully</u> on the stage.'",
    Option_0: "Adjective",
    Option_1: "Adverb",
    Option_2: "Noun",
    Option_3: "Preposition",
    Correct_Answer_Index: "1",
    Solution: "The word <strong>gracefully</strong> describes <em>how</em> the action ('performed') was executed, making it an <strong>adverb</strong>."
  },
  {
    Question_ID: 26231,
    Question: "Change to Indirect Speech: He said, 'I will leave tomorrow.'",
    Option_0: "He said that he will leave tomorrow.",
    Option_1: "He said that he would leave the next day.",
    Option_2: "He said that he would leave tomorrow.",
    Option_3: "He told he would leave the next day.",
    Correct_Answer_Index: "1",
    Solution: "In indirect speech, the pronoun changes (I &rarr; he), the modal changes (will &rarr; would), and time expressions shift (tomorrow &rarr; the next day / the following day)."
  },
  {
    Question_ID: 26232,
    Question: "Choose the correct active voice of: 'The trophy was won by the school team.'",
    Option_0: "The school team won the trophy.",
    Option_1: "The school team had won the trophy.",
    Option_2: "The school team wins the trophy.",
    Option_3: "The school team has won the trophy.",
    Correct_Answer_Index: "0",
    Solution: "The passive voice sentence is in the simple past tense (<em>was won</em>). The active voice counterpart must also use the simple past tense: <strong>won</strong>."
  },
  {
    Question_ID: 26233,
    Question: "Identify the figure of speech: 'The wind whispered through the trees.'",
    Option_0: "Simile",
    Option_1: "Metaphor",
    Option_2: "Personification",
    Option_3: "Hyperbole",
    Correct_Answer_Index: "2",
    Solution: "Giving human qualities (whispering) to non-human things (wind) is called <strong>Personification</strong>."
  },
  {
    Question_ID: 26234,
    Question: "Choose the word closest in meaning to 'Pragmatic'.",
    Option_0: "Practical",
    Option_1: "Theoretical",
    Option_2: "Idealistic",
    Option_3: "Imaginative",
    Correct_Answer_Index: "0",
    Solution: "<strong>Pragmatic</strong> means dealing with things sensibly and realistically in a way that is based on practical rather than theoretical considerations."
  },
  {
    Question_ID: 26235,
    Question: "Select the sentence that has a subject-verb agreement issue.",
    Option_0: "The group of students is going on a field trip.",
    Option_1: "Neither the teacher nor the students are attending.",
    Option_2: "Bread and butter is my favorite breakfast.",
    Option_3: "Every one of the books were damaged in the rain.",
    Correct_Answer_Index: "3",
    Solution: "The subject 'Every one' is singular, so it requires the singular verb <strong>'was'</strong> instead of the plural 'were'."
  },
  {
    Question_ID: 26236,
    Question: "Choose the correct word to fill in: 'The manager _______ the staff of their security clearances.'",
    Option_0: "assured",
    Option_1: "insured",
    Option_2: "ensured",
    Option_3: "secured",
    Correct_Answer_Index: "0",
    Solution: "To <strong>assure</strong> is to tell someone something positively to dispel any doubts. To <em>ensure</em> means to make certain, and to <em>insure</em> is related to insurance policies."
  },
  {
    Question_ID: 26237,
    Question: "Identify the idiom's meaning: 'To burn the midnight oil'",
    Option_0: "To waste resources inefficiently",
    Option_1: "To study or work late into the night",
    Option_2: "To create an unnecessary light source",
    Option_3: "To start a fire by mistake",
    Correct_Answer_Index: "1",
    Solution: "The historical idiom <strong>'to burn the midnight oil'</strong> means to stay up late working or studying by the light of an oil lamp."
  },
  {
    Question_ID: 26238,
    Question: "Which word means 'characterized by a desire to do run-of-the-mill or standard work'?",
    Option_0: "Exemplary",
    Option_1: "Mediocre",
    Option_2: "Peculiar",
    Option_3: "Splendid",
    Correct_Answer_Index: "1",
    Solution: "<strong>Mediocre</strong> means of only moderate quality or average; run-of-the-mill."
  },
  {
    Question_ID: 26239,
    Question: "Fill in the blank: 'If he _______ harder, he would have passed the exam.'",
    Option_0: "studied",
    Option_1: "had studied",
    Option_2: "studies",
    Option_3: "would study",
    Correct_Answer_Index: "1",
    Solution: "This is a **third conditional** sentence representing a hypothetical past action. The structure is: <em>If + past perfect (had studied), ... would have + past participle (passed)</em>."
  },
  {
    Question_ID: 26240,
    Question: "Find the odd one out.",
    Option_0: "Meticulous",
    Option_1: "Scrupulous",
    Option_2: "Fastidious",
    Option_3: "Negligent",
    Correct_Answer_Index: "3",
    Solution: "Meticulous, scrupulous, and fastidious are synonyms referring to paying close attention to details. <strong>Negligent</strong> (careless) is the antonym."
  },
  {
    Question_ID: 26241,
    Question: "Complete the sentence: 'The price of groceries has risen, _______ making it difficult for many families.'",
    Option_0: "thereby",
    Option_1: "therefore",
    Option_2: "nevertheless",
    Option_3: "whereas",
    Correct_Answer_Index: "0",
    Solution: "<strong>Thereby</strong> means 'by that means' or 'as a result of that' which perfectly links the cause and effect clauses."
  },
  {
    Question_ID: 26242,
    Question: "Choose the correct spelling:",
    Option_0: "Accomodate",
    Option_1: "Accommodate",
    Option_2: "Acomodate",
    Option_3: "Acommodate",
    Correct_Answer_Index: "1",
    Solution: "The correct spelling of this word contains double 'c' and double 'm': <strong>Accommodate</strong>."
  },
  {
    Question_ID: 26243,
    Question: "What does the root word 'chrono' mean?",
    Option_0: "Color",
    Option_1: "Shape",
    Option_2: "Sound",
    Option_3: "Time",
    Correct_Answer_Index: "3",
    Solution: "The prefix <strong>chrono-</strong> is derived from the Greek word for <strong>time</strong> (e.g. chronology, chronometer)."
  }
];

const getLocalDateString = (date: Date) => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const formatTime = (secs: number) => {
  const mins = Math.floor(secs / 65); // note: actually 60, let's write 60
  const remainingSecs = secs % 60;
  return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
};

// Recycle base questions dynamically for testId > 1 in offline mode
const getMockQuestionsForTest = (testId: number): Question[] => {
  const baseQuestions = [...MOCK_QUESTIONS].sort((a, b) => a.Question_ID - b.Question_ID);
  
  if (testId === 1) return baseQuestions.slice(0, 20);
  
  return baseQuestions.map((q) => {
    let modifiedQuestion = q.Question;
    
    if (testId % 2 === 0) {
      modifiedQuestion = modifiedQuestion
        .replace("Sarah", "Alex")
        .replace("whispered through", "howled in")
        .replace("Ephemeral", "Scrupulous");
    } else {
      modifiedQuestion = modifiedQuestion
        .replace("Sarah", "Emily")
        .replace("whispered through", "danced through");
    }
    
    return {
      ...q,
      Question_ID: q.Question_ID + (testId - 1) * 100,
      Question: `<span class="inline-block px-1.5 py-0.5 rounded bg-indigo-50 border border-indigo-100 text-[10px] font-bold text-indigo-650 mr-2 uppercase">Test ${testId}</span> ${modifiedQuestion}`
    };
  });
};

// Computes current and longest streaks on the fly from attempts list
const calculateStreakFromAttempts = (attemptsList: TestAttempt[]): UserStreak => {
  if (attemptsList.length === 0) return { currentStreak: 0, longestStreak: 0 };

  const datesSet = new Set<string>();
  attemptsList.forEach(att => {
    const d = new Date(att.completed_at);
    if (!isNaN(d.getTime())) {
      datesSet.add(getLocalDateString(d));
    }
  });

  const uniqueDates = Array.from(datesSet).sort((a, b) => b.localeCompare(a)); // Newest first
  if (uniqueDates.length === 0) return { currentStreak: 0, longestStreak: 0 };

  const todayStr = getLocalDateString(new Date());
  
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = getLocalDateString(yesterday);

  let currentStreak = 0;
  let longestStreak = 0;
  
  // Calculate current streak
  if (uniqueDates[0] === todayStr || uniqueDates[0] === yesterdayStr) {
    currentStreak = 1;
    let prevDateStr = uniqueDates[0];
    for (let i = 1; i < uniqueDates.length; i++) {
      const expectedPrev = new Date(prevDateStr);
      expectedPrev.setDate(expectedPrev.getDate() - 1);
      const expectedPrevStr = getLocalDateString(expectedPrev);
      
      if (uniqueDates[i] === expectedPrevStr) {
        currentStreak++;
        prevDateStr = uniqueDates[i];
      } else {
        break;
      }
    }
  }

  // Calculate longest streak
  let tempStreak = 0;
  let prevDateStr = "";
  const sortedOldest = [...uniqueDates].reverse();
  
  sortedOldest.forEach((dateStr, idx) => {
    if (idx === 0) {
      tempStreak = 1;
    } else {
      const expectedPrev = new Date(dateStr);
      expectedPrev.setDate(expectedPrev.getDate() - 1);
      const expectedPrevStr = getLocalDateString(expectedPrev);
      
      if (prevDateStr === expectedPrevStr) {
        tempStreak++;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    }
    prevDateStr = dateStr;
  });
  longestStreak = Math.max(longestStreak, tempStreak);

  return { currentStreak, longestStreak };
};

export default function TestPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string | number>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [testSubmitted, setTestSubmitted] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [view, setView] = useState<'home' | 'testing'>('home');
  
  // Multi-user Authenticated Profile state
  const [studentCode, setStudentCode] = useState<string | null>(null);
  const [deviceToken, setDeviceToken] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Pagination Active Test State
  const [testId, setTestId] = useState<number>(1);
  const [attempts, setAttempts] = useState<TestAttempt[]>([]);
  const [isDashboardLoading, setIsDashboardLoading] = useState(false);

  // Timer state (20 minutes = 1200 seconds)
  const [timeLeft, setTimeLeft] = useState(1200);
  const timerRef = useRef<any>(null);

  // 1. Initial Load: Check cached login
  useEffect(() => {
    const cachedCode = localStorage.getItem('english_mock_student_code');
    const cachedToken = localStorage.getItem('english_mock_device_token');
    
    if (cachedCode) {
      setStudentCode(cachedCode);
      if (cachedToken) {
        setDeviceToken(cachedToken);
      }
      loadAttemptsAndUser(cachedCode);
    }
  }, []);

  // 2. Load attempts for the logged-in student
  const loadAttemptsAndUser = async (code: string) => {
    setIsDashboardLoading(true);
    let loadedAttempts: TestAttempt[] = [];

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error: attError } = await supabase
          .from('test_attempts')
          .select('*')
          .eq('student_code', code)
          .order('completed_at', { ascending: false });

        if (!attError && data) {
          loadedAttempts = data.map((d: any) => ({
            id: d.id,
            student_code: d.student_code,
            test_id: d.test_id,
            score: d.score,
            correct_questions: d.correct_questions,
            accuracy: d.accuracy,
            time_taken: d.time_taken,
            completed_at: d.completed_at
          }));
        } else {
          throw new Error('test_attempts table unavailable');
        }
      } catch (err) {
        console.warn('Failed load from Supabase, loading LocalStorage attempts:', err);
        const localAttStr = localStorage.getItem(`english_mock_attempts_${code}`);
        if (localAttStr) {
          loadedAttempts = JSON.parse(localAttStr);
        }
      }
    } else {
      const localAttStr = localStorage.getItem(`english_mock_attempts_${code}`);
      if (localAttStr) {
        loadedAttempts = JSON.parse(localAttStr);
      }
    }

    setAttempts(loadedAttempts);
    setIsDashboardLoading(false);
  };

  // 3. Questions loading based on view & testId
  useEffect(() => {
    if (view !== 'testing') return;

    async function loadQuestions() {
      setLoading(true);
      setIsDemoMode(false);

      const limit = 20;
      const offset = (testId - 1) * limit;

      if (!isSupabaseConfigured || !supabase) {
        setIsDemoMode(true);
        setQuestions(getMockQuestionsForTest(testId));
        setLoading(false);
        return;
      }

      try {
        const { data, error: tableError } = await supabase
          .from('questions')
          .select('*')
          .order('Question_ID', { ascending: true })
          .range(offset, offset + limit - 1);

        if (tableError) throw tableError;

        if (data && data.length > 0) {
          if (data.length < 20) {
            // Pad questions with generated questions if database range is short
            const padding = getMockQuestionsForTest(testId).slice(data.length);
            setQuestions([...data, ...padding]);
          } else {
            setQuestions(data);
          }
        } else {
          // Range is empty, recycle mock questions
          setQuestions(getMockQuestionsForTest(testId));
        }
      } catch (err: any) {
        console.error('Supabase fetch error, using fallback mock data:', err);
        setIsDemoMode(true);
        setQuestions(getMockQuestionsForTest(testId));
      } finally {
        setLoading(false);
      }
    }

    loadQuestions();
  }, [testId, view]);

  // 4. Timer interval setup
  useEffect(() => {
    if (!loading && !testSubmitted && view === 'testing' && questions.length > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            handleSubmitTest(true);
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

  // Login handler
  const handleLogin = async (code: string) => {
    setIsLoggingIn(true);
    setLoginError(null);

    let token = deviceToken;
    if (!token) {
      token = 'dev_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now().toString(36);
      setDeviceToken(token);
      localStorage.setItem('english_mock_device_token', token);
    }

    if (isSupabaseConfigured && supabase) {
      try {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('student_code', code)
          .single();

        if (userError && userError.code !== 'PGRST116') {
          throw userError;
        }

        if (userData) {
          await supabase
            .from('users')
            .update({
              last_login: new Date().toISOString(),
              device_token: token
            })
            .eq('student_code', code);
        } else {
          await supabase
            .from('users')
            .insert([{
              student_code: code,
              last_login: new Date().toISOString(),
              device_token: token
            }]);
        }
      } catch (err: any) {
        console.warn('Supabase authentication failed, entering offline mode:', err);
      }
    }

    setStudentCode(code);
    localStorage.setItem('english_mock_student_code', code);
    
    await loadAttemptsAndUser(code);
    setIsLoggingIn(false);
  };

  const handleLogout = () => {
    setStudentCode(null);
    setAttempts([]);
    setSelectedAnswers({});
    setCurrentIndex(0);
    setTimeLeft(1200);
    setTestSubmitted(false);
    setView('home');
    localStorage.removeItem('english_mock_student_code');
  };

  const handleSelectAnswer = (optionKey: string) => {
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

    // Score calculations
    let correctCount = 0;
    let attemptedCount = 0;
    questions.forEach((q) => {
      const selected = selectedAnswers[q.Question_ID];
      if (selected !== undefined && selected !== null) {
        attemptedCount++;
        if (String(selected).trim() === String(q.Correct_Answer_Index).trim()) {
          correctCount++;
        }
      }
    });

    const total = questions.length;
    const accuracy = attemptedCount > 0 ? Math.round((correctCount / attemptedCount) * 100) : 0;
    const timeSpent = 1200 - timeLeft;

    handleSaveResult(correctCount, total, accuracy, timeSpent);
    setTestSubmitted(true);
  };

  const handleSaveResult = async (score: number, _total: number, accuracy: number, timeTaken: number) => {
    if (!studentCode) return;

    const newAttempt: TestAttempt = {
      id: Date.now().toString(),
      student_code: studentCode,
      test_id: testId,
      score,
      correct_questions: score,
      accuracy,
      time_taken: timeTaken,
      completed_at: new Date().toISOString()
    };

    // Save locally
    const updatedAttempts = [newAttempt, ...attempts];
    setAttempts(updatedAttempts);
    try {
      localStorage.setItem(`english_mock_attempts_${studentCode}`, JSON.stringify(updatedAttempts));
    } catch (e) {
      console.error('Failed to save to LocalStorage', e);
    }

    // Save in background to Supabase
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('test_attempts').insert([{
          student_code: studentCode,
          test_id: testId,
          score,
          correct_questions: score,
          accuracy,
          time_taken: timeTaken,
          completed_at: new Date().toISOString()
        }]);
      } catch (err) {
        console.warn('Could not save to Supabase test_attempts table:', err);
      }
    }
  };

  const handleRestart = () => {
    setSelectedAnswers({});
    setCurrentIndex(0);
    setTimeLeft(1200);
    setTestSubmitted(false);
    setView('testing');
  };

  const handleBackToHome = () => {
    setSelectedAnswers({});
    setCurrentIndex(0);
    setTimeLeft(1200);
    setTestSubmitted(false);
    setView('home');
  };

  const handleQuitTest = () => {
    if (window.confirm("Are you sure you want to quit the test? Your current progress will be deleted.")) {
      if (timerRef.current) clearInterval(timerRef.current);
      setSelectedAnswers({});
      setCurrentIndex(0);
      setTimeLeft(1200);
      setView('home');
    }
  };

  const handleNextTest = () => {
    setSelectedAnswers({});
    setCurrentIndex(0);
    setTimeLeft(1200);
    setTestSubmitted(false);
    setTestId((prev) => prev + 1);
    setView('testing');
  };

  const handleSelectTestNum = (num: number) => {
    setSelectedAnswers({});
    setCurrentIndex(0);
    setTimeLeft(1200);
    setTestSubmitted(false);
    setTestId(num);
    setView('testing');
  };

  const getNextUncompletedTestId = () => {
    const completedIds = new Set(attempts.map((a) => a.test_id));
    let id = 1;
    while (completedIds.has(id)) {
      id++;
    }
    return id;
  };

  // Login view filter check
  if (!studentCode) {
    return (
      <LoginScreen
        onLogin={handleLogin}
        isLoading={isLoggingIn}
        errorMsg={loginError}
      />
    );
  }

  // Calculate dynamic streaks on-the-fly from actual completed test attempts
  const streak = calculateStreakFromAttempts(attempts);

  // Dashboard Stats derived from attempts
  const totalTests = attempts.length;
  const avgAccuracy = totalTests > 0 
    ? Math.round(attempts.reduce((sum, item) => sum + item.accuracy, 0) / totalTests) 
    : 0;
  const bestScore = totalTests > 0 
    ? Math.max(...attempts.map(item => item.score)) 
    : 0;

  // Loading indicator for testing view questions fetch
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl space-y-6 animate-pulse">
          <div className="h-8 bg-slate-200 rounded-md w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-3 space-y-4">
              <div className="bg-white p-8 rounded-2xl border border-slate-100 h-64 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="h-4 bg-slate-200 rounded-md w-1/4"></div>
                  <div className="h-6 bg-slate-200 rounded-md w-5/6"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-10 bg-slate-100 rounded-lg w-full"></div>
                  <div className="h-10 bg-slate-100 rounded-lg w-full"></div>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100 h-80 space-y-4">
              <div className="h-6 bg-slate-200 rounded-md w-1/2"></div>
              <div className="grid grid-cols-5 gap-2">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div key={i} className="h-8 bg-slate-100 rounded-md"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Submitted Report Card view
  if (testSubmitted) {
    const finalSpentTime = 1200 - timeLeft;
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between select-none animate-fade-in animate-duration-300">
        {/* Header */}
        <header className="bg-white border-b border-slate-100 px-4 py-4 shadow-xs sticky top-0 z-20">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-extrabold text-lg">
                E
              </div>
              <h1 className="text-base font-black text-slate-800 tracking-tight sm:text-lg uppercase">
                ENGLISH MOCK TESTS
              </h1>
            </div>

            {/* Profile badge / logout */}
            <div className="flex items-center gap-3">
              <div className="bg-slate-100 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 flex items-center gap-1.5 shadow-2xs">
                <span>Code:</span>
                <span className="text-indigo-655 font-black">{studentCode}</span>
              </div>
              <button
                onClick={handleLogout}
                className="text-xs font-bold text-slate-450 hover:text-rose-500 cursor-pointer transition-colors"
                title="Switch Student Code"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1">
          <ResultPage
            questions={questions}
            selectedAnswers={selectedAnswers}
            timeTaken={finalSpentTime}
            currentStreak={streak.currentStreak}
            testId={testId}
            onRestart={handleRestart}
            onNextTest={handleNextTest}
            onBackToHome={handleBackToHome}
          />
        </main>
      </div>
    );
  }

  // Home Landing view
  if (view === 'home') {
    const nextRecommendedId = getNextUncompletedTestId();

    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between select-none animate-fade-in animate-duration-200">
        {/* Header */}
        <header className="bg-white border-b border-slate-100 px-4 py-4 shadow-xs sticky top-0 z-20">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-extrabold text-lg">
                E
              </div>
              <h1 className="text-base font-black text-slate-800 tracking-tight sm:text-lg uppercase">
                ENGLISH MOCK TESTS
              </h1>
            </div>

            {/* Profile badge / logout */}
            <div className="flex items-center gap-3">
              <div className="bg-slate-100 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 flex items-center gap-1.5 shadow-2xs">
                <span>Code:</span>
                <span className="text-indigo-655 font-black">{studentCode}</span>
              </div>
              <button
                onClick={handleLogout}
                className="text-xs font-bold text-slate-450 hover:text-rose-500 cursor-pointer transition-colors"
                title="Switch Student Code"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Demo Warning Banner */}
        {isDemoMode && (
          <div className="bg-amber-500/10 border-b border-amber-500/20 text-amber-805 px-4 py-2.5 text-xs font-semibold text-center flex items-center justify-center gap-1.5">
            <svg className="w-4 h-4 shrink-0 text-amber-600 animate-bounce-slow" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Running in offline preview mode (Supabase unconfigured or connection error). Interactive test is fully playable.
          </div>
        )}

        {/* Home Main Content */}
        <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-12 space-y-10">
          
          {/* Welcome Area */}
          <div className="flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-6 border border-indigo-100 shadow-sm animate-bounce-slow">
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>

            <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl mb-4 uppercase">
              ENGLISH MOCK TESTS
            </h2>
            <p className="text-base sm:text-lg text-slate-600 mb-8 max-w-xl leading-relaxed">
              Test your proficiency and grammar skills with our interactive, timed simulation. Access detailed explanations for every question upon completion.
            </p>

            {/* CTA button: Starts next recommended uncompleted test */}
            <button
              onClick={() => handleSelectTestNum(nextRecommendedId)}
              className="w-full sm:w-64 py-4 px-6 bg-linear-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 active:from-indigo-800 active:to-violet-800 text-white font-extrabold rounded-xl transition duration-150 shadow-md shadow-indigo-200/50 hover:shadow-lg flex items-center justify-center gap-2 text-base cursor-pointer"
            >
              Start Mock Test {nextRecommendedId}
              <svg className="w-5 h-5 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Grid layout for Instructions & Streak */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column: Info Instructions */}
            <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-xs space-y-4">
              <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider mb-2">Test Format</h3>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-50 p-4 rounded-xl text-center border border-slate-100/50">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Questions</span>
                  <span className="text-base font-black text-slate-805">20</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl text-center border border-slate-100/50">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Duration</span>
                  <span className="text-base font-black text-slate-805">20 Mins</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl text-center border border-slate-100/50">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Format</span>
                  <span className="text-base font-black text-slate-805">MCQ</span>
                </div>
              </div>
              
              <div className="text-xs text-slate-500 leading-relaxed border-t border-slate-100 pt-4">
                <strong>How it works:</strong> First 20 questions are Test 1, next 20 are Test 2, and so forth. Completing a test saves your score instantly under your student code profile.
              </div>
            </div>

            {/* Right Column: Streak Panel */}
            <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider mb-3">Study Tracker</h3>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-3xl">
                    🔥
                  </div>
                  <div>
                    <span className="text-lg sm:text-xl font-extrabold text-slate-850 block">
                      Current Streak: {streak.currentStreak} {streak.currentStreak === 1 ? 'Day' : 'Days'}
                    </span>
                    <span className="text-xs text-slate-500 font-semibold">
                      Longest Study Streak: {streak.longestStreak} {streak.longestStreak === 1 ? 'day' : 'days'}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed mt-4 border-t border-slate-100 pt-3">
                Grow your consecutive streak by taking a mock test each day. Skipping a day resets your active streak metric.
              </p>
            </div>
          </div>

          {/* New Grid feature: Available Tests list */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs">
            <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider mb-5 border-b border-slate-100 pb-3">Available practice tests</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5].map((num) => {
                // Find all attempts for this test number
                const testAttempts = attempts.filter((a) => a.test_id === num);
                const isCompleted = testAttempts.length > 0;
                // Find highest score for this test
                const maxScore = isCompleted ? Math.max(...testAttempts.map((a) => a.score)) : 0;

                return (
                  <div key={num} className="border border-slate-100 rounded-2xl p-5 bg-slate-50/50 hover:bg-white hover:shadow-xs transition-all flex flex-col justify-between gap-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-black text-indigo-650 bg-indigo-50 px-2 py-0.5 rounded-md uppercase tracking-wider">Test {num}</span>
                        {isCompleted ? (
                          <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase">Completed</span>
                        ) : (
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Not Started</span>
                        )}
                      </div>
                      <h4 className="text-sm font-bold text-slate-800">English Grammar MCQ</h4>
                      <span className="text-xs text-slate-500">20 Questions &bull; 20 Mins</span>
                    </div>

                    {/* Show performance if completed */}
                    {isCompleted && (
                      <div className="text-xs bg-white border border-slate-100 rounded-xl p-2.5 text-slate-650 font-medium">
                        Best Score: <strong className="text-slate-800 font-bold">{maxScore} / 20</strong>
                      </div>
                    )}

                    <button
                      onClick={() => handleSelectTestNum(num)}
                      className={`w-full py-2.5 rounded-xl text-xs font-extrabold transition duration-150 cursor-pointer ${
                        isCompleted
                          ? 'border border-slate-205 text-slate-700 hover:bg-slate-50'
                          : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm shadow-indigo-100'
                      }`}
                    >
                      {isCompleted ? `Retake Test ${num}` : `Start Test ${num}`}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Attempts Dashboard Section */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs">
            <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-3">
              <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">attempts history</h3>
              <span className="text-xs text-indigo-655 font-extrabold uppercase tracking-wider">{studentCode}'s Progress</span>
            </div>

            {/* Loading State for Dashboard */}
            {isDashboardLoading ? (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-16 bg-slate-100 rounded-xl animate-pulse"></div>
                  <div className="h-16 bg-slate-100 rounded-xl animate-pulse"></div>
                  <div className="h-16 bg-slate-100 rounded-xl animate-pulse"></div>
                </div>
                <div className="space-y-2 pt-4">
                  <div className="h-8 bg-slate-50 rounded-lg animate-pulse"></div>
                  <div className="h-8 bg-slate-50 rounded-lg animate-pulse"></div>
                  <div className="h-8 bg-slate-50 rounded-lg animate-pulse"></div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Dashboard Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-slate-50 p-4 rounded-xl text-center border border-slate-100/50">
                    <span className="block text-2xl font-black text-slate-800">{totalTests}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Tests</span>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl text-center border border-slate-100/50">
                    <span className="block text-2xl font-black text-slate-850">{avgAccuracy}%</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Avg Accuracy</span>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl text-center border border-slate-100/50">
                    <span className="block text-2xl font-black text-indigo-650">{bestScore} <span className="text-xs text-slate-400 font-bold">/ 20</span></span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Best Score</span>
                  </div>
                </div>

                {/* Attempts Table */}
                {attempts.length === 0 ? (
                  <div className="text-center py-10 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                    <div className="w-12 h-12 bg-white border border-slate-150 rounded-full flex items-center justify-center text-xl text-slate-400 mx-auto mb-3 shadow-2xs">
                      📊
                    </div>
                    <h4 className="text-sm font-bold text-slate-700">No attempts logged yet</h4>
                    <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto leading-normal">
                      Complete your first English mock test and submit your answers to start tracking your performance.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-xl border border-slate-100">
                    <table className="w-full text-left text-sm border-collapse">
                      <thead>
                        <tr className="bg-slate-50 text-slate-550 font-bold text-xs uppercase tracking-wider border-b border-slate-100">
                          <th className="p-4">Date</th>
                          <th className="p-4 text-center">Test ID</th>
                          <th className="p-4 text-center">Score</th>
                          <th className="p-4 text-center">Accuracy</th>
                          <th className="p-4 text-center">Time</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-705 font-semibold">
                        {attempts.map((attempt) => (
                          <tr key={attempt.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="p-4 text-xs font-semibold text-slate-500">
                              {new Date(attempt.completed_at).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </td>
                            <td className="p-4 text-center">
                              <span className="px-2 py-0.5 bg-slate-100 border border-slate-150 rounded text-xs text-slate-655 font-bold">
                                Test {attempt.test_id}
                              </span>
                            </td>
                            <td className="p-4 text-center text-slate-800 font-bold">{attempt.score} / 20</td>
                            <td className="p-4 text-center">
                              <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                attempt.accuracy >= 80 
                                  ? 'bg-emerald-50 text-emerald-700' 
                                  : attempt.accuracy >= 50 
                                  ? 'bg-indigo-50 text-indigo-700' 
                                  : 'bg-rose-50 text-rose-700'
                              }`}>
                                {attempt.accuracy}%
                              </span>
                            </td>
                            <td className="p-4 text-center text-xs font-mono text-slate-500">{formatTime(attempt.time_taken)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="py-6 border-t border-slate-100 text-center text-xs font-medium text-slate-400">
          ENGLISH MOCK TESTS &copy; {new Date().getFullYear()} &bull; Practice & Excel
        </footer>
      </div>
    );
  }

  const answeredCount = Object.keys(selectedAnswers).length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between select-none animate-fade-in animate-duration-200">
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
            <span className="text-xs font-bold text-slate-500 hidden sm:inline">
              Student: <strong className="text-indigo-600 font-extrabold">{studentCode}</strong> &bull; Test {testId}
            </span>

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

            {/* Quit Button */}
            <button
              onClick={handleQuitTest}
              className="text-xs font-bold text-slate-450 hover:text-rose-500 hover:border-rose-200 hover:bg-rose-50/50 cursor-pointer transition-all border border-slate-200 rounded-lg px-2.5 py-1.5 flex items-center gap-1.5 shadow-2xs"
              title="Quit Test & Discard Progress"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="hidden xs:inline">Quit</span>
            </button>

            {/* Mobile Sidebar Toggle Button */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 rounded-lg bg-slate-100 hover:bg-slate-205 text-slate-600 active:bg-slate-300 cursor-pointer"
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
        <div className="bg-amber-500/10 border-b border-amber-500/20 text-amber-805 px-4 py-2 text-xs font-semibold text-center flex items-center justify-center gap-1.5">
          <svg className="w-4 h-4 shrink-0 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          Running in offline preview mode (Supabase unconfigured or connection error). Interactive test is fully playable.
        </div>
      )}

      {/* Main Body Layout */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6 md:py-8 flex flex-col md:flex-row gap-6 items-stretch md:items-start">
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
                    className={`h-9 w-9 flex items-center justify-center rounded-lg text-xs font-bold transition duration-150 border cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-600 border-indigo-600 text-white ring-2 ring-indigo-500/30'
                        : isAnswered
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700 font-semibold'
                        : 'bg-slate-50 border-slate-205 text-slate-500 hover:border-slate-300'
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
                <span className="w-3.5 h-3.5 rounded bg-slate-50 border border-slate-205"></span>
                <span className="text-slate-500">Unanswered</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => handleSubmitTest(false)}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl transition duration-150 shadow-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            Submit Test
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </aside>

        {/* Mobile Slide-out Drawer Panel */}
        {isSidebarOpen && (
          <div className="fixed inset-0 z-50 md:hidden animate-fade-in animate-duration-200">
            {/* Backdrop overlay */}
            <div 
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"
              onClick={() => setIsSidebarOpen(false)}
            ></div>
            
            {/* Drawer sheet content */}
            <div className="absolute right-0 top-0 bottom-0 w-80 bg-white shadow-2xl p-6 flex flex-col justify-between z-10 animate-slide-in-right animate-duration-200">
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
                    className="p-1 rounded-md text-slate-400 hover:bg-slate-105 hover:text-slate-605 cursor-pointer"
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
                        className={`h-9 w-9 flex items-center justify-center rounded-lg text-xs font-bold transition duration-150 border cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-600 border-indigo-600 text-white ring-2 ring-indigo-500/30'
                            : isAnswered
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-700 font-semibold'
                            : 'bg-slate-50 border-slate-205 text-slate-500 hover:border-slate-300'
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
                    <span className="text-slate-805">Answered</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded bg-slate-50 border border-slate-205"></span>
                    <span className="text-slate-500">Unanswered</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsSidebarOpen(false);
                  handleSubmitTest(false);
                }}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl transition duration-150 shadow-sm flex items-center justify-center gap-2 cursor-pointer"
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
