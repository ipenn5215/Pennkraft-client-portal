# Pennkraft Style Guide

## Brand Identity

### Logo & Branding
- **Primary Logo**: "P" lettermark in gradient box
- **Company Name**: Pennkraft Estimating
- **Tagline**: "Precision in Every Estimate"

### Brand Values
- **Professional**: Clean, modern, trustworthy
- **Efficient**: Fast, streamlined, organized
- **Innovative**: Tech-forward, AI-enhanced
- **Reliable**: Consistent, accurate, dependable

## Color System

### Primary Colors
```css
/* Blues - Main Brand Color */
--primary-50: #eff6ff;   /* Lightest blue for backgrounds */
--primary-100: #dbeafe;  /* Light blue for hover states */
--primary-200: #bfdbfe;  /* Soft blue for borders */
--primary-300: #93c5fd;  /* Medium blue for accents */
--primary-400: #60a5fa;  /* Bright blue for icons */
--primary-500: #3b82f6;  /* Main blue for buttons */
--primary-600: #2563eb;  /* Dark blue for CTAs */
--primary-700: #1d4ed8;  /* Darker blue for hover */
--primary-800: #1e40af;  /* Deep blue for text */
--primary-900: #1e3a8a;  /* Darkest blue for headers */
```

### Neutral Colors
```css
/* Grays - Text and UI Elements */
--gray-50: #f9fafb;    /* Background */
--gray-100: #f3f4f6;   /* Light background */
--gray-200: #e5e7eb;   /* Borders */
--gray-300: #d1d5db;   /* Disabled states */
--gray-400: #9ca3af;   /* Placeholder text */
--gray-500: #6b7280;   /* Secondary text */
--gray-600: #4b5563;   /* Body text */
--gray-700: #374151;   /* Primary text */
--gray-800: #1f2937;   /* Headings */
--gray-900: #111827;   /* Dark text */
```

### Semantic Colors
```css
/* Status Colors */
--success: #10b981;    /* Green - Success, Active */
--warning: #f59e0b;    /* Amber - Warning, Pending */
--error: #ef4444;      /* Red - Error, Rejected */
--info: #3b82f6;       /* Blue - Info, In Review */

/* Accent Colors */
--purple: #8b5cf6;     /* Purple - Premium features */
--indigo: #6366f1;     /* Indigo - Secondary actions */
--teal: #14b8a6;       /* Teal - Highlights */
```

## Typography

### Font Families
```css
--font-sans: 'Inter', system-ui, -apple-system, sans-serif;
--font-mono: 'Fira Code', 'Courier New', monospace;
```

### Font Sizes
```css
/* Headings */
--text-4xl: 2.25rem;   /* 36px - Page titles */
--text-3xl: 1.875rem;  /* 30px - Section headers */
--text-2xl: 1.5rem;    /* 24px - Card titles */
--text-xl: 1.25rem;    /* 20px - Subsections */
--text-lg: 1.125rem;   /* 18px - Large body */

/* Body Text */
--text-base: 1rem;     /* 16px - Normal text */
--text-sm: 0.875rem;   /* 14px - Secondary text */
--text-xs: 0.75rem;    /* 12px - Captions */
```

### Font Weights
```css
--font-normal: 400;    /* Body text */
--font-medium: 500;    /* Emphasized text */
--font-semibold: 600;  /* Subheadings */
--font-bold: 700;      /* Headings */
```

## Spacing System

### Base Unit: 4px
```css
/* Spacing Scale */
--space-0: 0;          /* 0px */
--space-1: 0.25rem;    /* 4px */
--space-2: 0.5rem;     /* 8px */
--space-3: 0.75rem;    /* 12px */
--space-4: 1rem;       /* 16px */
--space-5: 1.25rem;    /* 20px */
--space-6: 1.5rem;     /* 24px */
--space-8: 2rem;       /* 32px */
--space-10: 2.5rem;    /* 40px */
--space-12: 3rem;      /* 48px */
--space-16: 4rem;      /* 64px */
--space-20: 5rem;      /* 80px */
```

## Component Styles

### Buttons

#### Primary Button
```tsx
className="bg-primary-600 hover:bg-primary-700 text-white font-medium px-4 py-2 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
```

#### Secondary Button
```tsx
className="bg-white hover:bg-gray-50 text-gray-700 font-medium px-4 py-2 rounded-lg border border-gray-300 transition-colors duration-200"
```

#### Ghost Button
```tsx
className="text-primary-600 hover:text-primary-700 hover:bg-primary-50 font-medium px-4 py-2 rounded-lg transition-colors duration-200"
```

#### Danger Button
```tsx
className="bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-lg transition-colors duration-200"
```

### Cards

#### Basic Card
```tsx
className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-6 border border-gray-100"
```

#### Interactive Card
```tsx
className="bg-white rounded-lg shadow hover:shadow-lg transition-all duration-300 p-6 cursor-pointer hover:translate-y-[-2px]"
```

#### Glass Card (Hero/Landing)
```tsx
className="bg-white/80 backdrop-blur-lg rounded-xl shadow-xl p-8 border border-white/20"
```

### Forms

#### Input Field
```tsx
className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
```

#### Label
```tsx
className="block text-sm font-medium text-gray-700 mb-1"
```

#### Error State
```tsx
className="border-red-500 focus:ring-red-500 focus:border-red-500"
// Error message
className="text-sm text-red-600 mt-1"
```

### Navigation

#### Nav Link (Default)
```tsx
className="text-gray-600 hover:text-primary-600 font-medium transition-colors duration-200"
```

#### Nav Link (Active)
```tsx
className="text-primary-600 font-semibold"
```

#### Mobile Nav Item
```tsx
className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-primary-600 transition-colors"
```

## Layout Patterns

### Container Widths
```css
/* Max widths for different sections */
--max-w-7xl: 80rem;    /* 1280px - Main content */
--max-w-6xl: 72rem;    /* 1152px - Narrow content */
--max-w-4xl: 56rem;    /* 896px - Reading width */
--max-w-2xl: 42rem;    /* 672px - Forms/modals */
```

### Grid Systems

#### Dashboard Grid
```tsx
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
```

#### Two Column Layout
```tsx
className="grid grid-cols-1 lg:grid-cols-2 gap-8"
```

#### Sidebar Layout
```tsx
<div className="flex">
  <aside className="w-64 flex-shrink-0">...</aside>
  <main className="flex-1 min-w-0">...</main>
</div>
```

## Page-Specific Styles

### Main Landing Page
- **Hero Section**: Gradient background with animated elements
- **Animation**: Parallax effects, fade-in on scroll
- **Cards**: Glass morphism effect
- **CTAs**: Large, prominent buttons with shadows

```tsx
// Hero gradient
className="bg-gradient-to-br from-primary-50 via-white to-blue-50"

// Floating elements
className="absolute animate-float opacity-20"

// Service cards
className="group hover:scale-105 transition-transform duration-300"
```

### Client Portal
- **Layout**: Clean, professional, data-focused
- **Navigation**: Persistent top navbar with user menu
- **Cards**: Minimal shadows, clear information hierarchy
- **Tables**: Striped rows, hover states

```tsx
// Portal container
className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100"

// Project cards
className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"

// Status badges
className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
```

### Admin/Manager Portal
- **Layout**: Dense information, dashboard-style
- **Sidebar**: Fixed navigation with icons
- **Widgets**: Stats cards, charts, activity feeds
- **Tables**: Sortable, filterable, with actions

```tsx
// Admin layout
className="flex h-screen bg-gray-100"

// Sidebar
className="w-64 bg-gray-900 text-white"

// Stats card
className="bg-white rounded-lg shadow p-4 border-l-4 border-primary-600"

// Data table
className="min-w-full divide-y divide-gray-200"
```

## Animation Guidelines

### Transitions
```css
/* Standard transitions */
--transition-fast: 150ms;
--transition-base: 200ms;
--transition-slow: 300ms;

/* Easing functions */
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in: cubic-bezier(0.4, 0, 1, 1);
```

### Framer Motion Variants
```tsx
// Fade in
const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

// Slide in
const slideIn = {
  initial: { x: -20, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  transition: { duration: 0.3 }
};

// Scale in
const scaleIn = {
  initial: { scale: 0.9, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  transition: { duration: 0.2 }
};
```

## Responsive Design

### Breakpoints
```css
--screen-sm: 640px;   /* Mobile landscape */
--screen-md: 768px;   /* Tablet */
--screen-lg: 1024px;  /* Desktop */
--screen-xl: 1280px;  /* Large desktop */
--screen-2xl: 1536px; /* Extra large */
```

### Mobile-First Approach
```tsx
// Start with mobile styles, add larger screens
className="text-sm md:text-base lg:text-lg"
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
className="px-4 sm:px-6 lg:px-8"
```

## Accessibility

### Focus States
```tsx
className="focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
```

### ARIA Labels
```tsx
<button aria-label="Close dialog">
<nav aria-label="Main navigation">
<main role="main">
```

### Color Contrast
- Text on white: minimum #4B5563 (gray-600)
- Text on primary: always white
- Interactive elements: minimum 3:1 contrast

## Icons

### Icon Sizes
```css
--icon-xs: 1rem;     /* 16px */
--icon-sm: 1.25rem;  /* 20px */
--icon-md: 1.5rem;   /* 24px */
--icon-lg: 2rem;     /* 32px */
--icon-xl: 3rem;     /* 48px */
```

### Icon Usage
- Use Lucide React icons consistently
- Default size: 20px (h-5 w-5)
- Match icon color to text color
- Add hover states for interactive icons

## Loading States

### Spinner
```tsx
className="animate-spin h-5 w-5 text-primary-600"
```

### Skeleton
```tsx
className="animate-pulse bg-gray-200 rounded"
```

### Progress Bar
```tsx
<div className="w-full bg-gray-200 rounded-full h-2">
  <div className="bg-primary-600 h-2 rounded-full transition-all duration-300"
       style={{ width: `${progress}%` }} />
</div>
```

## Error & Success States

### Success Message
```tsx
className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg"
```

### Error Message
```tsx
className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg"
```

### Warning Message
```tsx
className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg"
```

### Info Message
```tsx
className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg"
```

## Best Practices

### Do's ✅
- Use consistent spacing (multiples of 4px)
- Apply hover states to all interactive elements
- Use semantic colors for status indicators
- Maintain consistent border radius (rounded-lg)
- Apply transitions to state changes
- Use proper heading hierarchy
- Test on mobile devices

### Don'ts ❌
- Don't use inline styles
- Don't mix border radius sizes
- Don't use pure black (#000000)
- Don't skip heading levels
- Don't use px for font sizes (use rem)
- Don't forget focus states
- Don't use color alone for status

## Component Examples

### Project Card (Portal)
```tsx
<div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6">
  <div className="flex justify-between items-start mb-4">
    <div>
      <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
      <p className="text-sm text-gray-500">{project.type}</p>
    </div>
    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
      Active
    </span>
  </div>
  <div className="space-y-2 text-sm text-gray-600">
    <div className="flex items-center">
      <Calendar className="h-4 w-4 mr-2" />
      <span>Due {project.dueDate}</span>
    </div>
    <div className="flex items-center">
      <DollarSign className="h-4 w-4 mr-2" />
      <span>{project.budget}</span>
    </div>
  </div>
</div>
```

### Stats Widget (Admin)
```tsx
<div className="bg-white rounded-lg shadow p-6">
  <div className="flex items-center justify-between">
    <div>
      <p className="text-sm font-medium text-gray-600">Total Revenue</p>
      <p className="text-2xl font-semibold text-gray-900 mt-2">$125,000</p>
      <p className="text-sm text-green-600 mt-1">+12% from last month</p>
    </div>
    <div className="bg-primary-100 rounded-full p-3">
      <DollarSign className="h-6 w-6 text-primary-600" />
    </div>
  </div>
</div>
```

## Theme Implementation

### CSS Variables (globals.css)
```css
:root {
  /* Colors */
  --color-primary: 37 99 235;
  --color-gray: 107 114 128;

  /* Spacing */
  --spacing-unit: 0.25rem;

  /* Borders */
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;

  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1);
}