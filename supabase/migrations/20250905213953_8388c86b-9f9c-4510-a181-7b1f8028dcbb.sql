-- Update existing profile for the new test user
UPDATE profiles SET
  name = 'Sarah Chen',
  bio = 'Creative designer and UX researcher with a passion for crafting intuitive digital experiences. I specialize in user-centered design methodologies and have worked with various tech startups to improve their product interfaces. My background combines visual design with behavioral psychology, allowing me to create solutions that are both beautiful and functional.

I enjoy collaborating with cross-functional teams and believe that the best products come from diverse perspectives working together. When I''m not designing, you can find me exploring art galleries, experimenting with new design tools, or mentoring aspiring designers in my community.',
  skills = ARRAY['UI/UX Design', 'User Research', 'Figma', 'Adobe Creative Suite', 'Prototyping', 'Design Systems', 'Accessibility', 'Psychology'],
  reputation = 250,
  updated_at = now()
WHERE id = '2bdcce68-b238-4915-bdd8-bcd3133964d6';

-- Create user settings for new user (if not exists)
INSERT INTO user_settings (user_id, push_notifications, weekly_digest, public_profile, collaboration_alerts, analytics_tracking, created_at, updated_at)
VALUES (
  '2bdcce68-b238-4915-bdd8-bcd3133964d6',
  true,
  true,
  true,
  true,
  true,
  now(),
  now()
) ON CONFLICT (user_id) DO NOTHING;

-- Create some resources for the new user
INSERT INTO resources (title, description, content, tags, author_id, read_time, views, likes, comments_count, created_at, updated_at)
VALUES 
(
  'Design Systems That Scale: A Comprehensive Guide',
  'Learn how to build and maintain design systems that grow with your organization and ensure consistency across all touchpoints.',
  'Building a scalable design system is one of the most impactful things a designer can do for their organization. It''s not just about creating a collection of components—it''s about establishing a shared language that enables teams to work more efficiently and consistently.

## The Foundation: Design Tokens

Start with design tokens—the fundamental building blocks of your design system. These include colors, typography, spacing, and other visual properties that define your brand''s visual language.

## Component Architecture

When building components, think in terms of atomic design. Start with atoms (buttons, inputs), combine them into molecules (search bars, cards), and then organisms (headers, sections).

## Documentation is Key

Your design system is only as good as its documentation. Include component usage guidelines, do''s and don''ts, code examples, and accessibility considerations.

Remember, a design system is never "done"—it''s a living, breathing part of your product that should evolve with your needs.',
  ARRAY['Design Systems', 'UI/UX', 'Frontend', 'Documentation', 'Component Libraries'],
  '2bdcce68-b238-4915-bdd8-bcd3133964d6',
  '12 min read',
  145,
  23,
  8,
  now() - interval '2 weeks',
  now() - interval '2 weeks'
),
(
  'User Research Methods for Remote Teams',
  'Effective strategies for conducting user research when your team and users are distributed across different locations and time zones.',
  'The shift to remote work has fundamentally changed how we conduct user research. But with the right methods and tools, remote research can be just as effective—and sometimes even more insightful—than in-person studies.

## Remote Interview Best Practices

Preparation is everything. Test your tech setup beforehand, send calendar invites with clear instructions, and prepare backup communication methods.

## Asynchronous Research Methods

Diary studies are perfect for understanding long-term behaviors. Survey + follow-up interviews help you gather broad insights, then dive deeper with strategic follow-ups.

## Tools That Work

Video Calls: Zoom, Google Meet, Microsoft Teams
Collaboration: Miro, Figma, Notion  
Testing: UserTesting, Maze, Lookback
Surveys: Typeform, Google Forms, Airtable

The key is being flexible and meeting participants where they are.',
  ARRAY['User Research', 'Remote Work', 'UX Methods', 'Research Tools', 'Inclusive Design'],
  '2bdcce68-b238-4915-bdd8-bcd3133964d6',
  '8 min read',
  89,
  17,
  5,
  now() - interval '1 week',
  now() - interval '1 week'
);

-- Create a connection between the two test users (if not exists)
INSERT INTO connections (requester_id, addressee_id, status, created_at, updated_at)
VALUES (
  'ff7e510a-7682-411e-af2c-b3a7b68a21d2',
  '2bdcce68-b238-4915-bdd8-bcd3133964d6',
  'accepted',
  now() - interval '1 day',
  now() - interval '1 day'
) ON CONFLICT (requester_id, addressee_id) DO NOTHING;