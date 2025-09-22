# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Pennkraft Estimating is a comprehensive Next.js web application for construction estimating services, real estate photography, AI tech integration, and marketing solutions. The application features a modern, animated interface with a customer portal for project management and bidding.

## Common Commands

```bash
# Development
npm run dev          # Start development server (localhost:3001)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking

# Database
npx prisma migrate dev   # Run database migrations
npx prisma db seed       # Seed the database with test data
npx prisma studio        # Open Prisma Studio GUI
npx prisma generate      # Generate Prisma client

# Testing
npm test                 # Run unit tests
npx playwright test      # Run E2E tests
npx playwright show-report # View test results

# Git
git status              # Check current changes
git add .               # Stage all changes
git commit -m "message" # Commit changes
git push                # Push to remote
```

## Technology Stack

### Core Technologies
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS with custom animations
- **Database**: Prisma ORM with SQLite (dev) / PostgreSQL (prod)
- **Authentication**: NextAuth.js with JWT
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **UI Components**: Headless UI
- **Testing**: Playwright (E2E), Jest (unit)

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── auth/          # NextAuth endpoints
│   │   ├── projects/      # Project CRUD operations
│   │   ├── documents/     # Document management
│   │   └── messages/      # Messaging system
│   ├── portal/            # Client portal (protected)
│   │   ├── layout.tsx     # Portal layout with navbar
│   │   ├── page.tsx       # Dashboard
│   │   └── project/[id]/  # Project details
│   └── admin/             # Admin dashboard
├── components/            # Reusable React components
│   ├── PortalNavbar.tsx  # Persistent navigation
│   ├── DocumentManager/   # Document upload/management
│   ├── MessagingSystem/   # Real-time messaging
│   └── BillingSystem/     # Quotes and invoices
├── lib/                   # Utility functions
│   ├── db.ts             # Prisma client instance
│   ├── auth.ts           # Auth configuration
│   └── api-client.ts     # API helper functions
├── providers/            # Context providers
│   └── session-provider.tsx # NextAuth session
└── types/                # TypeScript definitions
```

## Coding Standards

### TypeScript Guidelines
```typescript
// ✅ ALWAYS use proper types
interface ProjectProps {
  id: string;
  name: string;
  status: 'active' | 'pending' | 'completed';
}

// ❌ NEVER use 'any' type
const data: any = {}; // Avoid this

// ✅ Use const assertions for literals
const STATUS = {
  ACTIVE: 'active',
  PENDING: 'pending',
  COMPLETED: 'completed'
} as const;

// ✅ Proper error handling
try {
  const result = await prisma.project.create({ data });
  return NextResponse.json(result);
} catch (error) {
  console.error('Error creating project:', error);
  return NextResponse.json(
    { error: 'Failed to create project' },
    { status: 500 }
  );
}
```

### React/Next.js Patterns
```typescript
// ✅ Use 'use client' only when needed
'use client'; // Only for client components

// ✅ Proper component structure
export default function ComponentName() {
  // Hooks first
  const { data: session } = useSession();
  const [state, setState] = useState('');

  // Effects after hooks
  useEffect(() => {
    // Effect logic
  }, [dependencies]);

  // Handler functions
  const handleClick = () => {
    // Handler logic
  };

  // Render
  return <div>Content</div>;
}

// ✅ Use Server Components by default
// No 'use client' directive for server components
```

### Styling Guidelines

**IMPORTANT**: Always follow the STYLE_GUIDE.md for consistent UI/UX across the application.

```tsx
// ✅ Use Tailwind CSS utilities
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

// ✅ Responsive design with breakpoints (mobile-first)
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">

// ✅ Follow button styles from style guide
// Primary button
<button className="bg-primary-600 hover:bg-primary-700 text-white font-medium px-4 py-2 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md">

// ✅ Use consistent card styles
<div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-6 border border-gray-100">

// ❌ Avoid inline styles
<div style={{ backgroundColor: 'blue' }}> // Don't do this

// ✅ Use semantic colors for status
const statusColors = {
  active: 'bg-green-100 text-green-800 border-green-200',
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  completed: 'bg-gray-100 text-gray-800 border-gray-200',
  error: 'bg-red-100 text-red-800 border-red-200'
};
```

#### Key Style Rules
1. **Colors**: Use primary-XXX for brand, gray-XXX for UI, semantic colors for status
2. **Spacing**: Use multiples of 4px (space-1 through space-20)
3. **Typography**: Inter font, rem units, consistent weights
4. **Shadows**: shadow-sm for cards, shadow-md on hover, shadow-lg for modals
5. **Borders**: rounded-lg for containers, border-gray-100/200/300 for lines
6. **Animations**: 200ms transitions, Framer Motion for complex animations
7. **Focus States**: Always include focus:ring-2 focus:ring-primary-500

## Database Guidelines

### Prisma Schema Management
```prisma
// Always define proper relationships
model Project {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Use proper field types
  budget    Decimal  @db.Decimal(10, 2)
  status    String   @default("pending")

  // Index frequently queried fields
  @@index([userId, status])
}
```

### Database Queries
```typescript
// ✅ Use proper Prisma queries with includes
const projects = await prisma.project.findMany({
  where: { userId: session.user.id },
  include: {
    documents: true,
    messages: { where: { isRead: false } }
  },
  orderBy: { createdAt: 'desc' }
});

// ✅ Use transactions for multiple operations
await prisma.$transaction([
  prisma.quote.create({ data: quoteData }),
  prisma.activity.create({ data: activityLog })
]);

// ❌ Avoid N+1 queries
// Don't fetch in loops, use includes instead
```

## API Design Patterns

### RESTful API Routes
```typescript
// app/api/projects/route.ts
export async function GET(req: Request) {
  // List all projects
}

export async function POST(req: Request) {
  // Create new project
}

// app/api/projects/[id]/route.ts
export async function GET(req: Request, { params }: { params: { id: string } }) {
  // Get single project
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  // Update project
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  // Delete project
}
```

## Authentication & Security

### Protected Routes
```typescript
// Always check authentication in protected pages
const { data: session, status } = useSession();

useEffect(() => {
  if (status === 'loading') return;
  if (!session) {
    router.push('/login');
  }
}, [session, status, router]);

// API route protection
const session = await getServerSession(authOptions);
if (!session) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
```

### Security Best Practices
- Never commit `.env.local` or database files
- Always hash passwords with bcrypt
- Use HTTPS in production
- Validate all user input
- Sanitize data before database operations
- Implement rate limiting for APIs

## MCP Server Usage

### When to Use MCP Servers

#### Sequential Thinking (`mcp__sequential-thinking`)
Use for complex problem-solving and multi-step analysis:
```bash
# Use when:
- Debugging complex issues
- Planning architecture changes
- Analyzing performance problems
- Making systematic improvements
```

#### Context7 (`mcp__context7`)
Use for library documentation and best practices:
```bash
# Use when:
- Looking up Next.js patterns
- Finding Prisma query examples
- Checking React best practices
- Understanding library APIs
```

#### Magic UI (`mcp__magic`)
Use for UI component generation:
```bash
# Use when:
- Creating new UI components
- Building forms and modals
- Implementing responsive layouts
- Adding interactive elements
```

#### Playwright (`mcp__playwright`)
Use for browser testing and automation:
```bash
# Use when:
- Running E2E tests
- Testing user workflows
- Validating UI interactions
- Checking responsive design
```

#### Morphllm Fast Apply (`mcp__morphllm-fast-apply`)
Use for bulk file operations:
```bash
# Use when:
- Applying consistent changes across files
- Refactoring code patterns
- Updating import statements
- Enforcing code standards
```

## Testing Standards

### E2E Testing with Playwright
```typescript
test('should display portal dashboard', async ({ page }) => {
  await page.goto('/portal');
  await expect(page.locator('h1')).toContainText('Welcome');
  await expect(page.locator('.project-card')).toHaveCount(4);
});
```

### Component Testing
```typescript
describe('ProjectCard', () => {
  it('should display project information', () => {
    render(<ProjectCard project={mockProject} />);
    expect(screen.getByText(mockProject.name)).toBeInTheDocument();
  });
});
```

## Git Workflow

### Branch Strategy
```bash
main           # Production-ready code
├── develop    # Integration branch
├── feature/*  # New features
├── fix/*      # Bug fixes
└── hotfix/*   # Emergency fixes
```

### Commit Standards
```bash
# Use conventional commits
feat: add user authentication
fix: resolve navbar display issue
docs: update API documentation
style: format code with prettier
refactor: simplify project structure
test: add portal integration tests
chore: update dependencies
```

## Performance Optimization

### Best Practices
- Use Next.js Image component for optimized images
- Implement lazy loading for heavy components
- Use dynamic imports for code splitting
- Optimize bundle size with tree shaking
- Cache API responses appropriately
- Use React.memo for expensive renders
- Implement virtual scrolling for long lists

### Monitoring
- Check Lighthouse scores regularly
- Monitor Core Web Vitals
- Track API response times
- Review bundle analyzer output

## Error Handling

### Consistent Error Responses
```typescript
// API error format
{
  error: string;
  message?: string;
  statusCode: number;
  timestamp: string;
}

// Client-side error handling
try {
  const response = await fetch('/api/projects');
  if (!response.ok) throw new Error('Failed to fetch');
  const data = await response.json();
} catch (error) {
  console.error('Error:', error);
  toast.error('Failed to load projects');
}
```

## Development Workflow

### Before Starting Work
1. Check current branch: `git status`
2. Pull latest changes: `git pull`
3. Install dependencies: `npm install`
4. Run migrations: `npx prisma migrate dev`
5. Start dev server: `npm run dev`

### Before Committing
1. Run linter: `npm run lint`
2. Check types: `npm run type-check`
3. Run tests: `npm test`
4. Review changes: `git diff`
5. Stage and commit: `git add . && git commit`

### Before Pushing
1. Pull latest: `git pull --rebase`
2. Resolve conflicts if any
3. Run build: `npm run build`
4. Push changes: `git push`

## Important Notes

- **Authentication**: Always use NextAuth session, never create custom auth
- **Database**: Always use Prisma ORM, never raw SQL queries
- **Styling**: Always use Tailwind classes, avoid inline styles
- **Components**: Prefer server components, use client only when needed
- **State**: Use React hooks, no external state management yet
- **Testing**: Write tests for critical paths and new features
- **Security**: Never expose sensitive data in client code
- **Performance**: Monitor and optimize bundle size regularly

## Environment Variables

Required variables in `.env.local`:
```bash
# Database
DATABASE_URL="file:./prisma/dev.db"

# Authentication
NEXTAUTH_URL="http://localhost:3001"
NEXTAUTH_SECRET="your-secret-here"

# Email (future)
SMTP_HOST=""
SMTP_PORT=""
SMTP_USER=""
SMTP_PASS=""

# Stripe (future)
STRIPE_SECRET_KEY=""
STRIPE_WEBHOOK_SECRET=""
```

## Support & Documentation

- Next.js: https://nextjs.org/docs
- Prisma: https://www.prisma.io/docs
- NextAuth: https://next-auth.js.org
- Tailwind CSS: https://tailwindcss.com/docs
- Framer Motion: https://www.framer.com/motion
- Playwright: https://playwright.dev/docs