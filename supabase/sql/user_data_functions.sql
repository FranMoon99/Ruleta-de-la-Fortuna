
-- Get user points function
CREATE OR REPLACE FUNCTION public.get_user_points(user_id_param UUID)
RETURNS INTEGER
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT total_points 
  FROM public.user_points 
  WHERE user_id = user_id_param;
$$;

-- Get user spin history
CREATE OR REPLACE FUNCTION public.get_user_spin_history(
  user_id_param UUID,
  limit_count INTEGER DEFAULT 30
)
RETURNS TABLE (
  id UUID,
  fecha TIMESTAMP WITH TIME ZONE,
  premio_id TEXT,
  points_earned INTEGER
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    id,
    fecha,
    premio_id,
    points_earned
  FROM 
    public.resultados
  WHERE 
    user_id = user_id_param
  ORDER BY 
    fecha DESC
  LIMIT 
    limit_count;
$$;
