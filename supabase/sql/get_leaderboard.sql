
-- Function to get leaderboard data
CREATE OR REPLACE FUNCTION public.get_leaderboard(limit_count INTEGER DEFAULT 5)
RETURNS TABLE (
  user_id uuid,
  total_points integer,
  username text,
  display_name text
) 
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    up.user_id,
    up.total_points,
    p.username,
    p.display_name
  FROM 
    public.user_points up
  JOIN 
    public.profiles p ON p.id = up.user_id
  ORDER BY 
    up.total_points DESC
  LIMIT 
    limit_count;
$$;
