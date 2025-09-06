# Knowledge Hub

A collaborative knowledge platform for professionals that combines the best of Notion, GitHub Wiki, and LinkedIn for knowledge sharing and team collaboration.

![Task Dashboard Screenshot](/public/screenshot.png)

## Live Demo

[View Live Application](https://main.dqmj7t8wgu1v0.amplifyapp.com/dashboard/)

## Test Login Credentials

For quick testing without creating an account:
- **Email**: test@email.com
- **Password**: password

## Features

### Core Functionality
- **Knowledge Resources** - Create, share, and discover structured knowledge articles
- **Real-time Collaboration** - Work together with team members in real-time
- **Project Management** - Organize resources and collaborate on projects
- **Smart Search** - Find relevant content quickly with intelligent search
- **Collaboration Scoring** - Rate and track collaboration quality
- **User Profiles** - Professional profiles with skills and expertise

### Advanced Features
- **Bookmarking System** - Save and organize important resources
- **Messaging** - Direct communication with collaborators
- **Notifications** - Stay updated on project activities
- **Analytics Dashboard** - Track engagement and platform usage
- **Help Center** - Comprehensive documentation and support
- **Dark/Light Mode** - Customizable theme preferences

## Technology Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **Backend**: Supabase (Database, Auth, Real-time)
- **Routing**: React Router DOM v7
- **State Management**: TanStack Query
- **Theme**: next-themes
- **Icons**: Lucide React

## Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone <YOUR_GIT_URL>
   cd <YOUR_PROJECT_NAME>
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   Configure your Supabase credentials in the `.env` file.

4. **Start development server**
   ```bash
   npm run dev
   ```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── AppLayout.tsx   # Main layout wrapper
│   ├── AppSidebar.tsx  # Navigation sidebar
│   └── Header.tsx      # Application header
├── pages/              # Page components
│   ├── Dashboard.tsx   # Main dashboard
│   ├── Projects.tsx    # Project management
│   ├── Resources.tsx   # Knowledge resources
│   └── ...
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
└── integrations/       # External service integrations
    └── supabase/       # Supabase client and types
```

## Key Pages

- **Dashboard** - Overview of activities and quick actions
- **Projects** - Create and manage collaborative projects
- **Resources** - Browse and create knowledge articles
- **Collaborators** - Find and connect with team members
- **Messages** - Direct communication hub
- **Profile** - User profile and settings management

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Deployment
The application can be deployed to any static hosting service like Vercel, Netlify, or AWS S3.

## Authentication & Security

- Supabase Authentication with email/password
- Row Level Security (RLS) policies
- Protected routes for authenticated users
- Secure API endpoints

## Responsive Design

The application is fully responsive and optimized for:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)