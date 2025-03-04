
CREATE OR REPLACE FUNCTION public.save_spin_result(
  user_id_param UUID,
  premio_id_param TEXT,
  points_earned_param INTEGER DEFAULT 0
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Insert the result
  INSERT INTO public.resultados (user_id, premio_id, points_earned)
  VALUES (user_id_param, premio_id_param, points_earned_param);
  
  -- No need to manually update points or spin count here
  -- The database trigger will handle that automatically
END;
$$;
