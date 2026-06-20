-- Create the universal leaderboard view
-- This view aggregates statistics from the test_attempts table grouped by student_code.
-- Sorting should be done by: avg_accuracy DESC, avg_time_taken ASC.
CREATE OR REPLACE VIEW public.leaderboard AS
SELECT 
  student_code,
  COUNT(id) as tests_taken,
  ROUND(AVG(accuracy))::integer as avg_accuracy,
  ROUND(AVG(time_taken))::integer as avg_time_taken,
  MAX(score)::numeric(5,1) as best_score
FROM 
  public.test_attempts
GROUP BY 
  student_code
HAVING 
  COUNT(id) > 0;

-- Adjust owner and grant permissions
ALTER VIEW public.leaderboard OWNER TO postgres;
GRANT SELECT ON public.leaderboard TO anon;
GRANT SELECT ON public.leaderboard TO authenticated;
