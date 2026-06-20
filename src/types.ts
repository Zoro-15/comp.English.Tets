export interface User {
  id?: string;
  student_code: string;
  last_login?: string;
  device_token?: string;
}

export interface TestAttempt {
  id?: string;
  student_code: string;
  test_id: number;
  score: number;
  correct_questions: number;
  accuracy: number;
  time_taken: number; // in seconds
  completed_at: string; // ISO timestamp
}

export interface UserStreak {
  currentStreak: number;
  longestStreak: number;
}

export interface Question {
  Question_ID: number;
  Question: string;
  Option_0: string;
  Option_1: string;
  Option_2: string;
  Option_3: string;
  Correct_Answer_Index: string | number;
  Solution?: string;
}
