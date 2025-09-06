-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  skills TEXT[],
  reputation INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create resources table
CREATE TABLE public.resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  content TEXT, -- Markdown content
  author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  tags TEXT[],
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  read_time TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create projects table
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  members UUID[],
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create project tasks table
CREATE TABLE public.project_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  assignee_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'todo',
  due_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create comments table
CREATE TABLE public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id UUID REFERENCES public.resources(id) ON DELETE CASCADE,
  author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bookmarks table
CREATE TABLE public.bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  resource_id UUID REFERENCES public.resources(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, resource_id)
);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Create RLS policies for resources
CREATE POLICY "Resources are viewable by everyone" ON public.resources
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert resources" ON public.resources
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update own resources" ON public.resources
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Users can delete own resources" ON public.resources
  FOR DELETE USING (auth.uid() = author_id);

-- Create RLS policies for projects
CREATE POLICY "Projects are viewable by members" ON public.projects
  FOR SELECT USING (auth.uid() = owner_id OR auth.uid() = ANY(members));

CREATE POLICY "Authenticated users can insert projects" ON public.projects
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Project owners can update projects" ON public.projects
  FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Project owners can delete projects" ON public.projects
  FOR DELETE USING (auth.uid() = owner_id);

-- Create RLS policies for project_tasks
CREATE POLICY "Tasks viewable by project members" ON public.project_tasks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.projects 
      WHERE id = project_id 
      AND (owner_id = auth.uid() OR auth.uid() = ANY(members))
    )
  );

CREATE POLICY "Project members can insert tasks" ON public.project_tasks
  FOR INSERT TO authenticated WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects 
      WHERE id = project_id 
      AND (owner_id = auth.uid() OR auth.uid() = ANY(members))
    )
  );

CREATE POLICY "Project members can update tasks" ON public.project_tasks
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.projects 
      WHERE id = project_id 
      AND (owner_id = auth.uid() OR auth.uid() = ANY(members))
    )
  );

-- Create RLS policies for comments
CREATE POLICY "Comments are viewable by everyone" ON public.comments
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert comments" ON public.comments
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update own comments" ON public.comments
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Users can delete own comments" ON public.comments
  FOR DELETE USING (auth.uid() = author_id);

-- Create RLS policies for bookmarks
CREATE POLICY "Users can view own bookmarks" ON public.bookmarks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own bookmarks" ON public.bookmarks
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own bookmarks" ON public.bookmarks
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for notifications
CREATE POLICY "Users can view own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert notifications" ON public.notifications
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Create function to update updated_at timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_resources_updated_at
  BEFORE UPDATE ON public.resources
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_project_tasks_updated_at
  BEFORE UPDATE ON public.project_tasks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert test profile for the specified user
INSERT INTO public.profiles (id, name, email, bio, skills, reputation) VALUES
('ff7e510a-7682-411e-af2c-b3a7b68a21d2', 'Test User', 'test@email.com', 'Professional knowledge contributor and collaborator', ARRAY['React', 'TypeScript', 'Supabase', 'Design Systems'], 150);

-- Insert test resources
INSERT INTO public.resources (title, description, content, author_id, tags, views, likes, comments_count, read_time) VALUES
('Advanced React Patterns & Performance Optimization', 'A comprehensive guide covering advanced React patterns including render props, compound components, and performance optimization techniques for large-scale applications.', '# Advanced React Patterns

This guide covers the most important React patterns...', 'ff7e510a-7682-411e-af2c-b3a7b68a21d2', ARRAY['React', 'Performance', 'Advanced', 'JavaScript'], 1247, 89, 23, '12 min read'),

('TypeScript Best Practices for Team Collaboration', 'Essential TypeScript patterns and conventions that improve code quality and team productivity in enterprise applications.', '# TypeScript Best Practices

Essential patterns for better collaboration...', 'ff7e510a-7682-411e-af2c-b3a7b68a21d2', ARRAY['TypeScript', 'Best Practices', 'Collaboration'], 892, 67, 18, '8 min read'),

('Building Scalable Design Systems', 'Step-by-step approach to creating and maintaining design systems that scale across multiple products and teams.', '# Scalable Design Systems

Learn how to build design systems...', 'ff7e510a-7682-411e-af2c-b3a7b68a21d2', ARRAY['Design Systems', 'UI/UX', 'Scaling'], 1456, 124, 31, '15 min read'),

('API Security Checklist for Modern Applications', 'Essential security practices and checklist for protecting APIs in modern web applications, covering authentication, authorization, and data validation.', '# API Security Checklist

Essential security practices...', 'ff7e510a-7682-411e-af2c-b3a7b68a21d2', ARRAY['Security', 'API', 'Backend', 'Checklist'], 743, 56, 14, '10 min read'),

('Frontend Architecture Patterns', 'Exploring different architectural patterns for frontend applications including MVC, MVP, MVVM, and component-based architectures.', '# Frontend Architecture

Different patterns for frontend apps...', 'ff7e510a-7682-411e-af2c-b3a7b68a21d2', ARRAY['Architecture', 'Frontend', 'Patterns'], 1089, 78, 25, '18 min read'),

('Modern CSS Layout Techniques', 'Master CSS Grid, Flexbox, and container queries to create responsive and maintainable layouts for modern web applications.', '# Modern CSS Layout

Master CSS Grid and Flexbox...', 'ff7e510a-7682-411e-af2c-b3a7b68a21d2', ARRAY['CSS', 'Layout', 'Responsive Design'], 924, 71, 19, '14 min read');

-- Insert test projects
INSERT INTO public.projects (name, description, owner_id, members, status) VALUES
('Design System Documentation', 'Comprehensive documentation and examples for our company design system', 'ff7e510a-7682-411e-af2c-b3a7b68a21d2', ARRAY['ff7e510a-7682-411e-af2c-b3a7b68a21d2'], 'active'),
('React Best Practices Guide', 'Collaborative guide for React development standards', 'ff7e510a-7682-411e-af2c-b3a7b68a21d2', ARRAY['ff7e510a-7682-411e-af2c-b3a7b68a21d2'], 'active');

-- Insert bookmarks for some resources
INSERT INTO public.bookmarks (user_id, resource_id) VALUES
('ff7e510a-7682-411e-af2c-b3a7b68a21d2', (SELECT id FROM public.resources WHERE title = 'Advanced React Patterns & Performance Optimization')),
('ff7e510a-7682-411e-af2c-b3a7b68a21d2', (SELECT id FROM public.resources WHERE title = 'Building Scalable Design Systems')),
('ff7e510a-7682-411e-af2c-b3a7b68a21d2', (SELECT id FROM public.resources WHERE title = 'Modern CSS Layout Techniques'));

-- Insert test notifications
INSERT INTO public.notifications (user_id, type, message, link, is_read) VALUES
('ff7e510a-7682-411e-af2c-b3a7b68a21d2', 'like', 'Someone liked your resource "Advanced React Patterns"', '/resources/1', false),
('ff7e510a-7682-411e-af2c-b3a7b68a21d2', 'comment', 'New comment on your resource "TypeScript Best Practices"', '/resources/2', false),
('ff7e510a-7682-411e-af2c-b3a7b68a21d2', 'project', 'You were added to project "API Documentation"', '/projects/1', true);