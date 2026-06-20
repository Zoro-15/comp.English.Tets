import { useState, useEffect, useRef } from 'react';
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
  const mins = Math.floor(secs / 60);
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
      Question: `<span class="inline-block px-1.5 py-0.5 rounded bg-brand-secondary border border-brand-border text-[10px] font-bold text-brand-primary mr-2 uppercase">Test ${testId}</span> ${modifiedQuestion}`
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

  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme as 'light' | 'dark');
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

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

  const handleSelectAnswerForQuestion = (questionId: number, optionKey: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionKey,
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

    // Negative Marking Score calculations
    let correctCount = 0;
    let wrongCount = 0;
    let attemptedCount = 0;

    questions.forEach((q) => {
      const selected = selectedAnswers[q.Question_ID];
      if (selected !== undefined && selected !== null) {
        attemptedCount++;
        if (String(selected).trim() === String(q.Correct_Answer_Index).trim()) {
          correctCount++;
        } else {
          wrongCount++;
        }
      }
    });

    // Score based on negative marking (+4 correct, -1.3 wrong, 0 skipped)
    const score = (correctCount * 4) - (wrongCount * 1.3);
    const accuracy = attemptedCount > 0 ? Math.round((correctCount / attemptedCount) * 100) : 0;
    const timeSpent = 1200 - timeLeft;

    handleSaveResult(score, correctCount, accuracy, timeSpent);
    setTestSubmitted(true);
  };

  const handleSaveResult = async (score: number, correctCount: number, accuracy: number, timeTaken: number) => {
    if (!studentCode) return;

    const preciseScore = parseFloat(score.toFixed(1));

    const newAttempt: TestAttempt = {
      id: Date.now().toString(),
      student_code: studentCode,
      test_id: testId,
      score: preciseScore,
      correct_questions: correctCount,
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
          score: Math.round(score), // Rounded integer to match database score schema constraints
          correct_questions: correctCount,
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

  const handleNextTest = () => {
    setSelectedAnswers({});
    setCurrentIndex(0);
    setTimeLeft(1200);
    setTestSubmitted(false);
    setTestId((prev) => prev + 1);
    setView('testing');
  };

  const handleSelectTestNum = (num: number) => {
    const testAttempts = attempts.filter((a) => a.test_id === num);
    setTestId(num);
    
    if (testAttempts.length > 0) {
      // If completed, view results directly
      setSelectedAnswers({});
      // Pull questions for the viewed test to show the report
      setView('testing');
      setTestSubmitted(true);
    } else {
      // Start test
      setSelectedAnswers({});
      setView('testing');
      setTestSubmitted(false);
    }
  };

  const handleQuitTest = () => {
    if (window.confirm("Are you sure you want to quit? This will discard your current mock test progress.")) {
      setSelectedAnswers({});
      setCurrentIndex(0);
      setTimeLeft(1200);
      setTestSubmitted(false);
      setView('home');
    }
  };

  const getNextUncompletedTestId = () => {
    for (let num = 1; num <= 10; num++) {
      const testAttempts = attempts.filter((a) => a.test_id === num);
      if (testAttempts.length === 0) return num;
    }
    return 1;
  };

  // If user not logged in, render login portal
  if (!studentCode) {
    return (
      <LoginScreen
        onLogin={handleLogin}
        isLoading={isLoggingIn}
        errorMsg={loginError}
        theme={theme}
        toggleTheme={toggleTheme}
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
      <div className="min-h-screen bg-brand-bg flex items-center justify-center p-4">
        <div className="w-full max-w-4xl space-y-6 animate-pulse">
          <div className="h-8 bg-brand-card rounded-md w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-3 space-y-4">
              <div className="bg-brand-card p-8 rounded-2xl border border-brand-border h-64 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="h-4 bg-brand-bg rounded-md w-1/4"></div>
                  <div className="h-6 bg-brand-bg rounded-md w-5/6"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-10 bg-brand-bg rounded-lg w-full"></div>
                  <div className="h-10 bg-brand-bg rounded-lg w-full"></div>
                </div>
              </div>
            </div>
            <div className="bg-brand-card p-6 rounded-2xl border border-brand-border h-80 space-y-4">
              <div className="h-6 bg-brand-bg rounded-md w-1/2"></div>
              <div className="grid grid-cols-5 gap-2">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div key={i} className="h-8 bg-brand-bg rounded-md"></div>
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
      <div className="min-h-screen bg-brand-bg flex flex-col justify-between select-none font-source text-brand-text">
        {/* Header */}
        <header className="bg-brand-bg border-b border-brand-border px-6 py-4 sticky top-0 z-20">
          <div className="max-w-[1100px] mx-auto flex items-center justify-between">
            <h1 className="text-base font-normal text-brand-title font-lora">
              English Mock Tests
            </h1>

            {/* Profile info / logout */}
            <div className="flex items-center gap-4 text-xs">
              <span className="text-brand-text">
                Student Code: <strong className="font-semibold text-brand-title">{studentCode}</strong>
              </span>
              <button
                onClick={toggleTheme}
                className="text-brand-text hover:text-brand-primary cursor-pointer transition-colors p-1.5 rounded-md border border-brand-border bg-brand-card hover:bg-brand-bg flex items-center justify-center outline-none"
                title="Toggle Theme"
              >
                {theme === 'dark' ? (
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                  </svg>
                ) : (
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
              <button
                onClick={handleLogout}
                className="text-brand-text hover:text-rose-455 cursor-pointer transition-colors"
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
      <div className="min-h-screen bg-brand-bg flex flex-col justify-between select-none font-source text-brand-text animate-fade-in animate-duration-200">
        {/* Header */}
        <header className="bg-brand-bg border-b border-brand-border px-6 py-4 sticky top-0 z-20">
          <div className="max-w-[1100px] mx-auto flex items-center justify-between">
            <h1 className="text-base font-normal text-brand-title font-lora">
              English Mock Tests
            </h1>

            {/* Profile info / logout */}
            <div className="flex items-center gap-4 text-xs">
              <span className="text-brand-text">
                Student Code: <strong className="font-semibold text-brand-title">{studentCode}</strong>
              </span>
              <button
                onClick={toggleTheme}
                className="text-brand-text hover:text-brand-primary cursor-pointer transition-colors p-1.5 rounded-md border border-brand-border bg-brand-card hover:bg-brand-bg flex items-center justify-center outline-none"
                title="Toggle Theme"
              >
                {theme === 'dark' ? (
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                  </svg>
                ) : (
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
              <button
                onClick={handleLogout}
                className="text-brand-text hover:text-rose-455 cursor-pointer transition-colors"
                title="Switch Student Code"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Demo Warning Banner */}
        {isDemoMode && (
          <div className="bg-brand-card border-b border-brand-border text-brand-text px-6 py-2.5 text-xs text-center flex items-center justify-center gap-1.5 font-medium">
            <svg className="w-3.5 h-3.5 shrink-0 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>Running in offline preview mode (using local storage mock data). Test is fully functional.</span>
          </div>
        )}

        {/* Home Main Content */}
        <main className="flex-1 max-w-[1100px] mx-auto w-full px-6 py-12 space-y-10">
          
          {/* Welcome Area */}
          <div className="text-center py-6 space-y-4 max-w-xl mx-auto">
            <h2 className="text-3xl font-normal text-brand-title font-lora">
              Welcome back.
            </h2>
            <p className="text-sm text-brand-text leading-relaxed">
              Continue your preparation with today's mock tests. Timed simulations with detailed reviews will help you refine grammar and structure rules.
            </p>
            <div className="pt-2">
              <button
                onClick={() => handleSelectTestNum(nextRecommendedId)}
                className="inline-flex py-3 px-6 border border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-brand-bg font-semibold rounded-md transition-colors duration-150 text-sm cursor-pointer bg-transparent"
              >
                Start Mock Test {nextRecommendedId} →
              </button>
            </div>
          </div>

          {/* Student Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-brand-card border border-brand-border rounded-lg p-5 flex items-center gap-4">
              <div className="text-brand-primary shrink-0">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <span className="block text-[10px] uppercase tracking-wider text-brand-text font-semibold">Tests Taken</span>
                <span className="text-lg font-bold text-brand-title font-lora">{totalTests}</span>
              </div>
            </div>
            
            <div className="bg-brand-card border border-brand-border rounded-lg p-5 flex items-center gap-4">
              <div className="text-brand-primary shrink-0">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <span className="block text-[10px] uppercase tracking-wider text-brand-text font-semibold">Avg Accuracy</span>
                <span className="text-lg font-bold text-brand-title font-lora">{avgAccuracy}%</span>
              </div>
            </div>

            <div className="bg-brand-card border border-brand-border rounded-lg p-5 flex items-center gap-4">
              <div className="text-brand-primary shrink-0">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <div>
                <span className="block text-[10px] uppercase tracking-wider text-brand-text font-semibold">Best Score</span>
                <span className="text-lg font-bold text-brand-title font-lora">
                  {bestScore % 1 === 0 ? bestScore.toFixed(0) : bestScore.toFixed(1)} / 80
                </span>
              </div>
            </div>

            <div className="bg-brand-card border border-brand-border rounded-lg p-5 flex items-center gap-4">
              <div className="text-brand-primary shrink-0">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
              </div>
              <div>
                <span className="block text-[10px] uppercase tracking-wider text-brand-text font-semibold">Streak</span>
                <span className="text-lg font-bold text-brand-title font-lora">{streak.currentStreak} {streak.currentStreak === 1 ? 'Day' : 'Days'}</span>
              </div>
            </div>
          </div>

          {/* Available practice tests */}
          <div className="space-y-4">
            <h3 className="text-base font-normal text-brand-title font-lora border-b border-brand-border pb-2">
              Available Mock Tests
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5].map((num) => {
                const testAttempts = attempts.filter((a) => a.test_id === num);
                const isCompleted = testAttempts.length > 0;
                const maxScore = isCompleted ? Math.max(...testAttempts.map((a) => a.score)) : 0;

                return (
                  <div key={num} className="border border-brand-border rounded-lg p-5 bg-brand-card flex flex-col justify-between gap-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-brand-text">Test {num}</span>
                        <span className={`text-[10px] font-semibold uppercase tracking-wider ${isCompleted ? 'text-brand-primary' : 'text-slate-500'}`}>
                          {isCompleted ? 'Completed' : 'Not Started'}
                        </span>
                      </div>
                      <h4 className="text-sm font-semibold text-brand-title">English Grammar MCQ</h4>
                      <p className="text-[11px] text-brand-text mt-0.5">20 Questions &bull; 20 Mins</p>
                    </div>

                    {isCompleted && (
                      <div className="text-[11px] text-brand-text">
                        Best Score: <strong className="text-brand-title font-semibold">
                          {maxScore % 1 === 0 ? maxScore.toFixed(0) : maxScore.toFixed(1)} / 80
                        </strong>
                      </div>
                    )}

                    <div className="pt-1">
                      <button
                        onClick={() => handleSelectTestNum(num)}
                        className={`text-xs font-semibold hover:underline flex items-center gap-1 cursor-pointer transition-colors bg-transparent border-none p-0 ${
                          isCompleted ? 'text-slate-400' : 'text-brand-primary font-bold'
                        }`}
                      >
                        {isCompleted ? 'View Report →' : 'Start Test →'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Attempts History */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-brand-border pb-2">
              <h3 className="text-base font-normal text-brand-title font-lora">
                Attempts History
              </h3>
              <span className="text-[10px] font-semibold text-brand-text uppercase tracking-wider">{studentCode}'s Progress</span>
            </div>

            {isDashboardLoading ? (
              <div className="space-y-4">
                <div className="h-6 bg-brand-card rounded-md w-full animate-pulse"></div>
                <div className="h-6 bg-brand-card rounded-md w-5/6 animate-pulse"></div>
                <div className="h-6 bg-brand-card rounded-md w-4/6 animate-pulse"></div>
              </div>
            ) : attempts.length === 0 ? (
              <div className="text-center py-10 border border-dashed border-brand-border rounded-lg bg-brand-card/30">
                <p className="text-xs text-brand-text">No test attempts logged yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-source border-collapse" style={{ borderCollapse: 'collapse' }}>
                  <thead>
                    <tr className="border-b border-brand-border text-brand-text font-bold uppercase tracking-wider">
                      <th className="py-3 px-4 font-semibold">Date</th>
                      <th className="py-3 px-4 font-semibold text-center">Test ID</th>
                      <th className="py-3 px-4 font-semibold text-center">Score</th>
                      <th className="py-3 px-4 font-semibold text-center">Accuracy</th>
                      <th className="py-3 px-4 font-semibold text-center">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-border text-brand-text">
                    {attempts.map((attempt) => (
                      <tr key={attempt.id} className="hover:bg-brand-card/20 transition-colors">
                        <td className="py-3 px-4 text-brand-text">
                          {new Date(attempt.completed_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="text-brand-text">Test {attempt.test_id}</span>
                        </td>
                        <td className="py-3 px-4 text-center font-semibold text-brand-title">
                          {attempt.score % 1 === 0 ? attempt.score.toFixed(0) : attempt.score.toFixed(1)} / 80
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={attempt.accuracy >= 70 ? 'text-brand-primary font-semibold' : 'text-brand-text'}>
                            {attempt.accuracy}%
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center font-mono">{formatTime(attempt.time_taken)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="py-6 border-t border-brand-border text-center text-[10px] text-brand-text/70">
          English Mock Tests &copy; {new Date().getFullYear()} &bull; Academic Practice Journal
        </footer>
      </div>
    );
  }

  const answeredCount = Object.keys(selectedAnswers).length;

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col justify-between select-none font-source text-brand-text animate-fade-in animate-duration-200">
      {/* Header Banner */}
      <header className="sticky top-0 z-30 bg-brand-bg border-b border-brand-border px-6 py-4">
        <div className="max-w-[1100px] mx-auto flex items-center justify-between">
          <h1 className="text-base font-normal text-brand-title font-lora">
            English Mock Tests
          </h1>

          <div className="flex items-center gap-4 text-xs">
            <span className="text-brand-text hidden sm:inline">
              Student Code: <strong className="font-semibold text-brand-title">{studentCode}</strong> &bull; Test {testId}
            </span>

            {/* Countdown Timer */}
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-none border font-mono font-bold text-xs transition-colors ${
              timeLeft < 180 
                ? 'bg-rose-950/20 border-rose-900/40 text-rose-300' 
                : 'bg-brand-card border-brand-border text-brand-text'
            }`}>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{formatTime(timeLeft)}</span>
            </div>

            {/* Theme Toggle Button next to Countdown Timer */}
            <button
              onClick={toggleTheme}
              className="text-brand-text hover:text-brand-primary cursor-pointer transition-colors p-1.5 rounded-none border border-brand-border bg-brand-card hover:bg-brand-bg flex items-center justify-center outline-none"
              title="Toggle Theme"
            >
              {theme === 'dark' ? (
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                </svg>
              ) : (
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            {/* Quit Button */}
            <button
              onClick={handleQuitTest}
              className="text-xs font-semibold text-brand-text border border-brand-border bg-brand-card hover:bg-brand-bg hover:border-brand-text hover:text-brand-title transition-colors rounded-md px-2.5 py-1.5 flex items-center gap-1.5 cursor-pointer outline-none"
              title="Quit Test & Discard Progress"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Quit</span>
            </button>

            {/* Mobile Sidebar Toggle Button */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 rounded-md bg-brand-card border border-brand-border hover:bg-brand-bg text-brand-text cursor-pointer"
              title="Open Navigation"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Demo Warning Header Banner */}
      {isDemoMode && (
        <div className="bg-brand-card border-b border-brand-border text-brand-text px-6 py-2 text-xs text-center flex items-center justify-center gap-1.5 font-medium">
          <svg className="w-3.5 h-3.5 shrink-0 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>Running in offline preview mode (mock database).</span>
        </div>
      )}

      {/* Main Body Layout */}
      <main className="flex-1 max-w-[1100px] mx-auto w-full px-6 py-8 flex flex-col md:flex-row gap-6 items-stretch md:items-start animate-fade-in animate-duration-200">
        {/* Left Side: Question area displaying a single card */}
        <div className="flex-1 flex flex-col">
          <QuestionCard
            question={questions[currentIndex]}
            selectedAnswer={selectedAnswers[questions[currentIndex]?.Question_ID]}
            onSelectAnswer={(key) => handleSelectAnswerForQuestion(questions[currentIndex].Question_ID, key)}
            index={currentIndex}
          />
        </div>

        {/* Right Side / Sidebar: Desktop layout (visible md+) */}
        <aside className="hidden md:flex md:w-72 flex-col bg-brand-card border border-brand-border rounded-lg p-5 gap-6">
          <div>
            <h4 className="text-xs font-bold text-brand-text uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              Navigator
            </h4>
            <div className="grid grid-cols-5 gap-2 pr-1">
              {questions.map((q, idx) => {
                const isSelected = currentIndex === idx;
                const isAnswered = selectedAnswers[q.Question_ID] !== undefined;

                return (
                  <button
                    key={q.Question_ID}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-8 w-8 flex items-center justify-center rounded-md text-xs font-semibold transition duration-150 border cursor-pointer outline-none ${
                      isSelected
                        ? 'bg-brand-bg border-brand-primary text-brand-primary font-bold ring-1 ring-brand-primary/50'
                        : isAnswered
                        ? 'bg-brand-secondary border-brand-border text-brand-primary font-medium'
                        : 'bg-brand-bg border-brand-border text-brand-text/60 hover:border-brand-text hover:text-brand-title'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {/* Legend indicators */}
            <div className="mt-6 space-y-2 border-t border-brand-border pt-4 text-[10px] font-bold uppercase tracking-wider text-brand-text/70">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm bg-brand-bg border border-brand-primary"></span>
                <span>Current Question</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm bg-brand-secondary border border-brand-border"></span>
                <span>Answered</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm bg-brand-bg border border-brand-border"></span>
                <span>Unanswered</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => handleSubmitTest(false)}
            className="w-full py-3 bg-brand-primary hover:bg-brand-primary/95 text-brand-bg font-bold rounded-md transition-all duration-150 flex items-center justify-center gap-1.5 cursor-pointer text-xs outline-none shadow-sm hover:shadow-brand-primary/20"
          >
            <span>Submit Test</span>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </aside>

        {/* Mobile Slide-out Drawer Panel */}
        {isSidebarOpen && (
          <div className="fixed inset-0 z-50 md:hidden animate-fade-in animate-duration-200">
            {/* Backdrop overlay */}
            <div 
              className="absolute inset-0 bg-slate-950/45"
              onClick={() => setIsSidebarOpen(false)}
            ></div>
            
            {/* Drawer sheet content */}
            <div className="absolute right-0 top-0 bottom-0 w-72 bg-brand-card p-6 flex flex-col justify-between z-10 animate-slide-in-right animate-duration-200 border-l border-brand-border">
              <div>
                <div className="flex items-center justify-between mb-6 pb-2 border-b border-brand-border">
                  <h4 className="text-xs font-bold text-brand-text uppercase tracking-wider flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                    Navigator
                  </h4>
                  <button 
                    onClick={() => setIsSidebarOpen(false)}
                    className="p-1 rounded text-slate-400 hover:bg-brand-border cursor-pointer outline-none bg-transparent border-none"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
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
                        className={`h-8 w-8 flex items-center justify-center rounded-md text-xs font-semibold transition duration-150 border cursor-pointer outline-none ${
                          isSelected
                            ? 'bg-brand-bg border-brand-primary text-brand-primary font-bold ring-1 ring-brand-primary/50'
                            : isAnswered
                            ? 'bg-brand-secondary border-brand-border text-brand-primary font-medium'
                            : 'bg-brand-bg border-brand-border text-brand-text/60 hover:border-brand-text hover:text-brand-title'
                        }`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>

                {/* Legend indicators */}
                <div className="mt-6 space-y-2 border-t border-brand-border pt-4 text-[10px] font-bold uppercase tracking-wider text-brand-text/70">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-sm bg-brand-bg border border-brand-primary"></span>
                    <span>Current Question</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-sm bg-brand-secondary border border-brand-border"></span>
                    <span>Answered</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-sm bg-brand-bg border border-brand-border"></span>
                    <span>Unanswered</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsSidebarOpen(false);
                  handleSubmitTest(false);
                }}
                className="w-full py-3.5 bg-brand-primary hover:bg-brand-primary/95 text-brand-bg font-bold rounded-md transition-all duration-150 flex items-center justify-center gap-1.5 cursor-pointer text-xs outline-none shadow-sm hover:shadow-brand-primary/20"
              >
                <span>Submit Test</span>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
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
