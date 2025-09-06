-- Create help_articles table for managing help content
CREATE TABLE public.help_articles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  tags TEXT[],
  views INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.help_articles ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access to published articles
CREATE POLICY "Published articles are publicly readable"
ON public.help_articles
FOR SELECT
USING (is_published = true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_help_articles_updated_at
BEFORE UPDATE ON public.help_articles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample help articles
INSERT INTO public.help_articles (title, content, category, slug, description, tags) VALUES
('How to create your first resource', 
'Creating your first resource is easy! Here''s a step-by-step guide:

## Getting Started

1. **Click the "Create Resource" button** - You can find this on your dashboard or in the navigation menu.

2. **Choose a title** - Make it descriptive and engaging. This will be the first thing people see.

3. **Write a description** - Provide a brief overview of what your resource covers.

4. **Add content** - This is where you share your knowledge. You can include:
   - Text content
   - Code examples
   - Links to external resources
   - Best practices

5. **Tag your resource** - Add relevant tags to help others discover your content.

6. **Preview and publish** - Review your resource and click publish when ready.

## Tips for Success

- Keep your content organized with clear headings
- Include practical examples
- Make it actionable
- Keep it concise but comprehensive

Your resource will be visible to other users and can help build your reputation in the community!',
'Getting Started', 'create-first-resource', 'Learn how to create and publish your first resource on our platform', ARRAY['resources', 'getting-started', 'tutorial']),

('Setting up your profile', 
'Your profile is your digital identity on our platform. Here''s how to set it up properly:

## Profile Basics

1. **Add your name** - Use your real name or professional pseudonym
2. **Upload an avatar** - A professional photo works best
3. **Write a bio** - Brief description of your expertise and interests
4. **Add your skills** - List technologies and areas you''re knowledgeable about

## Privacy Settings

You can control what information is visible to other users:
- Public profile visibility
- Email address display
- Contact preferences

## Professional Benefits

A complete profile helps you:
- Build credibility with other users
- Get discovered by potential collaborators
- Establish your expertise in specific areas

Remember to keep your profile updated as your skills and interests evolve!',
'Getting Started', 'setup-profile', 'Complete guide to setting up your professional profile', ARRAY['profile', 'getting-started', 'setup']),

('Understanding the dashboard', 
'The dashboard is your command center. Here''s what each section does:

## Main Sections

**Resources Feed** - Discover new resources from your network and trending topics

**Quick Actions** - Fast access to common tasks like creating resources or viewing bookmarks

**Recent Activity** - See what''s happening in your network

**Trending Topics** - Popular tags and subjects being discussed

**Upcoming Deadlines** - Project tasks that need attention

## Navigation

Use the sidebar to quickly access:
- Your projects
- Bookmarks
- Notifications
- Settings

## Customization

You can customize your dashboard experience through settings:
- Notification preferences
- Privacy controls
- Theme selection

The dashboard adapts to your usage patterns and shows the most relevant information first.',
'Getting Started', 'understand-dashboard', 'Navigate and understand your dashboard layout and features', ARRAY['dashboard', 'navigation', 'interface']),

('Creating and editing resources', 
'Master the art of creating compelling resources that others will find valuable.

## Content Structure

**Title** - Clear, descriptive, and engaging
**Description** - 1-2 sentences summarizing the content
**Main Content** - The meat of your resource
**Tags** - Help others discover your content

## Writing Best Practices

1. **Start with an outline** - Plan your content structure
2. **Use clear headings** - Break up your content logically
3. **Include examples** - Make abstract concepts concrete
4. **Add links** - Reference other useful resources
5. **Keep it focused** - One main topic per resource

## Editing Tips

- Use the preview feature before publishing
- Check for typos and formatting issues
- Ensure links work properly
- Update content periodically to keep it current

## Collaboration

You can collaborate with others by:
- Sharing drafts for feedback
- Co-authoring resources
- Building on existing resources with new perspectives

Quality resources get more engagement and help establish your expertise in the community.',
'Resources & Content', 'create-edit-resources', 'Complete guide to creating and editing high-quality resources', ARRAY['resources', 'writing', 'content-creation']),

('Managing your bookmarks', 
'Keep track of valuable resources with the bookmark system.

## How Bookmarks Work

Click the bookmark icon on any resource to save it to your personal collection. You can access bookmarks anytime from your dashboard or navigation menu.

## Organization Tips

While browsing bookmarks:
- Use the search function to find specific saved resources
- Filter by tags to narrow down results
- Sort by date saved or resource popularity

## Best Practices

1. **Bookmark strategically** - Save resources you''ll actually reference later
2. **Regular cleanup** - Remove outdated bookmarks periodically
3. **Use search** - Instead of scrolling through long lists
4. **Share collections** - Create resources that link to useful bookmarks

## Bookmark Limits

There are no limits on bookmarks, but keeping a manageable collection helps you find things faster.

## Privacy

Your bookmarks are private - only you can see what you''ve saved. This lets you freely bookmark content without worrying about what others think.',
'Resources & Content', 'manage-bookmarks', 'Learn how to effectively use and organize your bookmarks', ARRAY['bookmarks', 'organization', 'productivity']),

('Creating projects', 
'Projects help you organize collaborative work and track progress toward goals.

## Project Setup

1. **Choose a clear name** - Something that immediately conveys the project''s purpose
2. **Write a description** - Explain what you''re trying to accomplish
3. **Set a deadline** - Even rough timelines help with planning
4. **Add team members** - Invite collaborators to join

## Project Management

**Tasks** - Break work into manageable pieces
- Assign tasks to team members
- Set due dates
- Track progress with status updates

**Communication** - Keep everyone aligned
- Use project comments for discussions
- Share updates regularly
- Document decisions

## Collaboration Best Practices

- Define roles and responsibilities clearly
- Set up regular check-ins
- Use shared resources for reference
- Celebrate milestones

## Project Privacy

You can control who sees your projects:
- Private: Only team members
- Team visible: Your network can see it exists
- Public: Anyone can view details

Projects are great for building your portfolio and demonstrating your ability to work with others.',
'Collaboration', 'create-projects', 'Step-by-step guide to creating and managing successful projects', ARRAY['projects', 'collaboration', 'management']),

('Inviting team members', 
'Grow your projects by inviting the right people to collaborate.

## Finding Team Members

**Search by skills** - Use our collaborator finder to locate people with specific expertise
**Network connections** - Invite people you''ve worked with before
**Community recommendations** - Ask for referrals in project discussions

## Invitation Process

1. **Go to your project settings**
2. **Click "Invite Members"**
3. **Search for users** by name or email
4. **Add a personal message** explaining the project and their role
5. **Set permissions** for what they can access

## Permission Levels

- **Admin** - Full project control
- **Member** - Can create/edit tasks and resources
- **Viewer** - Read-only access to project content

## Best Practices

**Clear expectations** - Explain time commitment and responsibilities upfront
**Skill matching** - Invite people whose skills complement the project needs  
**Team size** - Keep initial teams small (3-5 people) for better coordination
**Follow up** - Check if invitees have questions before they accept

## Managing Invitations

Track pending invitations in project settings. You can cancel invites or resend them if needed. Once someone accepts, they''ll appear in your team roster.',
'Collaboration', 'invite-team-members', 'Learn how to find and invite the right people to join your projects', ARRAY['teams', 'invitations', 'collaboration']);