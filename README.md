# LexiPrep English Mock Test

A modern, high-performance, and mobile-friendly mock examination platform designed for competitive English exams (such as TOEFL, IELTS, and GRE). Built using **Astro**, **React**, **Tailwind CSS v4**, and **Supabase**.

---

## Features

- **Supabase Integration:** Connects to your custom questions table to load questions sorted by ID.
- **Interactive Timer:** 20-minute countdown timer that automatically grades and submits the test when it reaches zero.
- **Smart Navigation Grid:**
  - **Desktop Sidebar / Mobile Drawer:** Visual overview of all 20 questions. Answered questions are marked green, active is highlighted, and unanswered remains neutral.
  - **Single Question Card:** Displays one question at a time with large, clean, tap-friendly options.
- **Report Card Dashboard:** Detailed analytics including total score, accuracy percentage, correct answers, incorrect answers, and skipped counts.
- **Detailed Question Review:** Visual post-test analysis displaying every question, what option you selected, and highlights showing the correct answers.
- **Offline Preview Mode:** If Supabase credentials are missing or have a connection issue, the app automatically runs in offline demo mode using 20 preloaded, high-quality mock questions.

---

## Tech Stack

- **Astro** - Static routing and container page
- **React** - Dynamic state machinery and interactive components
- **Tailwind CSS v4** - Premium styling engine
- **Supabase** - Postgres backend database

---

## Setup Instructions

### 1. Install Dependencies
Run the following command at the root of the project to install necessary packages:
```bash
npm install
```

### 2. Configure Supabase Environment Variables
Create a file named `.env` in the root of the project and add your Supabase connection parameters:
```env
PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```
*(Alternatively, you can open `src/lib/supabaseClient.js` and paste your credentials directly into `SUPABASE_URL` and `SUPABASE_ANON_KEY` variables).*

### 3. Setup the Supabase Database Table
Follow these steps to create your questions table:
1. Go to your **Supabase Dashboard** -> **Table Editor** -> click **New Table**.
2. Name the table **`questions`**.
3. Disable **Row Level Security (RLS)** for read access, or set a SELECT policy for anonymous read access: `true`.
4. Configure columns as follows:
   - `id` (int8, Primary Key, Auto-increment)
   - `question` (text)
   - `option_a` (text)
   - `option_b` (text)
   - `option_c` (text)
   - `option_d` (text)
   - `correct_answer` (text, typically 'a', 'b', 'c', or 'd')
5. Click **Save**.
6. Import your questions by clicking **Insert** -> **Import data from CSV** and uploading your quiz file.

### 4. Run Locally
Start the local development server:
```bash
npm run dev
```
Open `http://localhost:4321` in your browser to start practicing!
