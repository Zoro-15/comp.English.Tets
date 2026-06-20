const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://zwqjyagfffpqjdecayja.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp3cWp5YWdmZmZwcWpkZWNheWphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4NzM5MTMsImV4cCI6MjA5NzQ0OTkxM30.8PSKGLB1Oj4Pnp7YmI27XeHfhnuljJXSorelemeFBEY';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function main() {
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .ilike('Question', '%rupee%');

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log('Found questions matching rupee:');
  data.forEach(q => {
    console.log(`ID: ${q.Question_ID}`);
    console.log(`Question: ${q.Question}`);
    console.log(`Option_0: ${q.Option_0}`);
    console.log(`Option_1: ${q.Option_1}`);
    console.log(`Option_2: ${q.Option_2}`);
    console.log(`Option_3: ${q.Option_3}`);
    console.log(`Correct_Answer_Index: ${q.Correct_Answer_Index}`);
    console.log(`Correct_Answer_Index Type: ${typeof q.Correct_Answer_Index}`);
    console.log(`Solution: ${q.Solution}`);
    console.log('----------------------------');
  });
}

main();
