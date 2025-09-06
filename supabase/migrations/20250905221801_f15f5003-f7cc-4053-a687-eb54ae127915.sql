-- Create collaboration ratings table
CREATE TABLE public.collaboration_ratings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  rater_id UUID NOT NULL,
  rated_user_id UUID NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(rater_id, rated_user_id)
);

-- Enable RLS
ALTER TABLE public.collaboration_ratings ENABLE ROW LEVEL SECURITY;

-- Create policies for collaboration ratings
CREATE POLICY "Users can view ratings they gave or received" 
ON public.collaboration_ratings 
FOR SELECT 
USING (auth.uid() = rater_id OR auth.uid() = rated_user_id);

CREATE POLICY "Users can create ratings for their collaborators" 
ON public.collaboration_ratings 
FOR INSERT 
WITH CHECK (
  auth.uid() = rater_id 
  AND EXISTS (
    SELECT 1 FROM connections 
    WHERE status = 'accepted' 
    AND ((requester_id = auth.uid() AND addressee_id = rated_user_id) 
         OR (requester_id = rated_user_id AND addressee_id = auth.uid()))
  )
);

CREATE POLICY "Users can update their own ratings" 
ON public.collaboration_ratings 
FOR UPDATE 
USING (auth.uid() = rater_id);

-- Add trigger for updated_at
CREATE TRIGGER update_collaboration_ratings_updated_at
BEFORE UPDATE ON public.collaboration_ratings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to calculate collaboration score
CREATE OR REPLACE FUNCTION public.get_collaboration_score(user_id UUID)
RETURNS DECIMAL(3,2)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(ROUND(AVG(rating)::decimal, 2), 0.0)
  FROM collaboration_ratings
  WHERE rated_user_id = user_id;
$$;