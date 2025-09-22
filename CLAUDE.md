# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Pennkraft Estimating is a comprehensive Next.js web application for construction estimating services, real estate photography, AI tech integration, and marketing solutions. The application features a modern, animated interface with a customer portal for project management and bidding.

## Common Commands

```bash
# Development
npm run dev          # Start development server (localhost:3000)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking

# Package management
npm install          # Install all dependencies
npm install <package> # Install specific package
```

## Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom animations
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **UI Components**: Headless UI
- **Fonts**: Inter (Google Fonts)

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles and animations
│   ├── layout.tsx         # Root layout with metadata
│   ├── page.tsx           # Home page with loading screen
│   ├── portal/            # Customer portal (to be implemented)
│   └── admin/             # Admin dashboard (to be implemented)
├── components/            # Reusable React components
│   ├── LoadingScreen.tsx  # Animated site loader
│   ├── Navigation.tsx     # Responsive navigation with scroll effects
│   ├── HeroSection.tsx    # Animated hero with parallax elements
│   ├── ServicesSection.tsx # Services showcase with animations
│   ├── AboutSection.tsx   # Company info and statistics
│   ├── ContactSection.tsx # Contact form and information
│   └── Footer.tsx         # Site footer
├── lib/                   # Utility functions
│   └── utils.ts          # Common utilities (cn, formatters, etc.)
└── types/                 # TypeScript type definitions
    └── index.ts          # Core business types
```

## Key Features

### Landing Page
- Animated loading screen with company branding
- Parallax hero section with floating elements
- Responsive navigation with scroll effects
- Service sections with fade/slide animations
- Interactive contact form with validation
- Modern gradient designs and glass effects

### Services Offered
1. **Construction Estimating**: Painting, tile, flooring, drywall, glass work
2. **Real Estate Photography**: Property photos and videography
3. **Tech Solutions**: AI integration and custom tools
4. **Marketing**: Brand strategy and social media

### Planned Features (To Implement)
- Customer portal with project tracking
- File upload system for bidding documents
- Client management system
- Admin dashboard
- Project status updates
- Building list with due dates
- Email integration

## Design System

### Colors
- Primary: Blue palette (50-900)
- Secondary: Gray palette (50-900)
- Success: Green accents
- Warning: Orange accents

### Animations
- `fade-in`: 0.5s ease-in-out
- `slide-up/down/left/right`: 0.5s ease-out
- `parallax`: 20s linear infinite
- Custom loader dots animation

### Components
- `.glass-effect`: Backdrop blur with transparency
- `.section-padding`: Consistent section spacing
- `.parallax-bg`: Fixed background attachment

## Development Guidelines

### Component Structure
- Use 'use client' for client-side interactivity
- Implement Framer Motion for animations
- Use `useInView` for scroll-triggered animations
- Follow TypeScript best practices

### Styling Approach
- Utility-first with Tailwind CSS
- Custom animations in tailwind.config.js
- Responsive design mobile-first
- Glass morphism effects for modern UI

### State Management
- React hooks for local state
- Form state managed with controlled components
- No global state management yet (to be added for portal)

## cPanel Hosting Configuration

### Build Settings
- Output: 'standalone' mode configured
- Static files in public/ directory
- Optimized for shared hosting

### Deployment Notes
- Use `npm run build` for production builds
- Upload .next and public folders to hosting
- Configure server to serve static files
- Set up proper redirects for SPA routing

## API Integration (Future)

The application is structured to support:
- RESTful API endpoints for estimates
- File upload handling
- Email service integration
- Database integration for client management
- Authentication system for portal access

## Performance Considerations

- Lazy loading for images and components
- Optimized animations with `transform` properties
- Minimal bundle size with tree shaking
- Server-side rendering for SEO optimization
- Progressive loading with suspense boundaries