-- Create some resources for Sarah Chen (if they don't exist)
INSERT INTO resources (title, description, content, tags, author_id, read_time, views, likes, comments_count, created_at, updated_at)
SELECT 
  'Design Systems That Scale: A Comprehensive Guide',
  'Learn how to build and maintain design systems that grow with your organization and ensure consistency across all touchpoints.',
  'Building a scalable design system is one of the most impactful things a designer can do for their organization. It''s not just about creating a collection of components—it''s about establishing a shared language that enables teams to work more efficiently and consistently.

## The Foundation: Design Tokens

Start with design tokens—the fundamental building blocks of your design system. These include colors, typography, spacing, and other visual properties that define your brand''s visual language.

```css
:root {
  --color-primary: #007bff;
  --color-secondary: #6c757d;
  --spacing-unit: 8px;
  --font-family-primary: "Inter", sans-serif;
}
```

## Component Architecture

When building components, think in terms of atomic design. Start with atoms (buttons, inputs), combine them into molecules (search bars, cards), and then organisms (headers, sections).

## Documentation is Key

Your design system is only as good as its documentation. Include:
- Component usage guidelines
- Do''s and don''ts
- Code examples
- Accessibility considerations

## Governance and Evolution

Establish clear processes for:
- Proposing new components
- Updating existing ones
- Deprecating outdated elements
- Regular audits and improvements

Remember, a design system is never "done"—it''s a living, breathing part of your product that should evolve with your needs.',
  ARRAY['Design Systems', 'UI/UX', 'Frontend', 'Documentation', 'Component Libraries'],
  '2bdcce68-b238-4915-bdd8-bcd3133964d6',
  '12 min read',
  145,
  23,
  8,
  now() - interval '2 weeks',
  now() - interval '2 weeks'
WHERE NOT EXISTS (
  SELECT 1 FROM resources 
  WHERE author_id = '2bdcce68-b238-4915-bdd8-bcd3133964d6' 
  AND title = 'Design Systems That Scale: A Comprehensive Guide'
);

INSERT INTO resources (title, description, content, tags, author_id, read_time, views, likes, comments_count, created_at, updated_at)
SELECT 
  'User Research Methods for Remote Teams',
  'Effective strategies for conducting user research when your team and users are distributed across different locations and time zones.',
  'The shift to remote work has fundamentally changed how we conduct user research. But with the right methods and tools, remote research can be just as effective—and sometimes even more insightful—than in-person studies.

## Remote Interview Best Practices

**Preparation is Everything**
- Test your tech setup beforehand
- Send calendar invites with clear instructions  
- Prepare backup communication methods
- Have a co-facilitator when possible

**Creating Comfort in Digital Spaces**
- Start with small talk to build rapport
- Use video when appropriate, but respect preferences
- Be mindful of different time zones and energy levels
- Keep sessions shorter than in-person equivalents

## Asynchronous Research Methods

**Diary Studies**
Perfect for understanding long-term behaviors and contexts that are difficult to observe in real-time.

**Survey + Follow-up Interviews**
Use surveys to gather broad insights, then dive deeper with strategic follow-up interviews.

**Unmoderated Testing**
Great for gathering large sample sizes and removing facilitator bias.

## Tools That Work

- **Video Calls**: Zoom, Google Meet, Microsoft Teams
- **Collaboration**: Miro, Figma, Notion
- **Testing**: UserTesting, Maze, Lookback
- **Surveys**: Typeform, Google Forms, Airtable

## Inclusive Research Practices

Remote research opens doors to more diverse participants who might not be able to attend in-person sessions. Consider:
- Different accessibility needs
- Varying internet speeds
- Time zone differences
- Technology comfort levels

The key is being flexible and meeting participants where they are.',
  ARRAY['User Research', 'Remote Work', 'UX Methods', 'Research Tools', 'Inclusive Design'],
  '2bdcce68-b238-4915-bdd8-bcd3133964d6',
  '8 min read',
  89,
  17,
  5,
  now() - interval '1 week',
  now() - interval '1 week'
WHERE NOT EXISTS (
  SELECT 1 FROM resources 
  WHERE author_id = '2bdcce68-b238-4915-bdd8-bcd3133964d6' 
  AND title = 'User Research Methods for Remote Teams'
);

INSERT INTO resources (title, description, content, tags, author_id, read_time, views, likes, comments_count, created_at, updated_at)
SELECT 
  'Accessibility in Design: Beyond Compliance',
  'Moving past checkbox accessibility to create truly inclusive experiences that work for everyone.',
  'Accessibility in design isn''t just about meeting WCAG guidelines—it''s about creating experiences that truly work for everyone. When we design with accessibility in mind from the start, we create better products for all users.

## The Business Case for Accessibility

Beyond being the right thing to do, accessible design:
- Expands your potential user base
- Improves SEO and discoverability
- Reduces development costs when built in early
- Often leads to cleaner, more intuitive interfaces

## Core Principles

**Perceivable**
Information must be presentable in ways users can perceive:
- Provide text alternatives for images
- Use sufficient color contrast
- Ensure content is readable and accessible to screen readers

**Operable**
Interface components must be operable:
- Make all functionality keyboard accessible
- Give users enough time to read content
- Don''t use content that causes seizures

**Understandable**
Information and UI operation must be understandable:
- Make text readable and understandable
- Make content appear and operate predictably
- Help users avoid and correct mistakes

**Robust**
Content must be robust enough for various assistive technologies:
- Use valid, semantic HTML
- Ensure compatibility with screen readers
- Test with actual assistive technologies

## Practical Implementation

**Color and Contrast**
- Don''t rely on color alone to convey information
- Maintain at least 4.5:1 contrast ratio for normal text
- Test your designs with color blindness simulators

**Typography and Layout**
- Use relative units (rem, em) instead of fixed pixels
- Maintain readable line heights (1.4-1.6)
- Ensure adequate spacing between interactive elements

**Interactive Elements**
- Provide clear focus states
- Use descriptive labels and instructions
- Make clickable areas large enough (minimum 44px)

## Testing with Real Users

The best way to ensure accessibility is to test with people who actually use assistive technologies. Consider:
- Partnering with disability advocacy organizations
- Including accessibility testing in your regular research
- Using automated tools as a starting point, not the end goal

Remember: accessibility is not a feature to be added later—it''s a fundamental part of good design.',
  ARRAY['Accessibility', 'Inclusive Design', 'WCAG', 'UX Design', 'Web Standards'],
  '2bdcce68-b238-4915-bdd8-bcd3133964d6',
  '10 min read',
  203,
  31,
  12,
  now() - interval '3 days',
  now() - interval '3 days'
WHERE NOT EXISTS (
  SELECT 1 FROM resources 
  WHERE author_id = '2bdcce68-b238-4915-bdd8-bcd3133964d6' 
  AND title = 'Accessibility in Design: Beyond Compliance'
);