const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://zwqjyagfffpqjdecayja.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp3cWp5YWdmZmZwcWpkZWNheWphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4NzM5MTMsImV4cCI6MjA5NzQ0OTkxM30.8PSKGLB1Oj4Pnp7YmI27XeHfhnuljJXSorelemeFBEY';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function main() {
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .order('Question_ID', { ascending: true })
    .limit(20);

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log('First 20 questions loaded by the app:');
  data.forEach((q, index) => {
    console.log(`Index: ${index + 1} | ID: ${q.Question_ID} | Correct: ${q.Correct_Answer_Index} | Stem: ${q.Question.substring(0, 100)}...`);
  });
}

main();
