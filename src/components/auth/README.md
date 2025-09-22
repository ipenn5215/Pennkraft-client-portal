# Pennkraft Authentication System

A complete authentication system for the Pennkraft customer portal built with Next.js 14, TypeScript, and Framer Motion.

## Features

### 🔐 Authentication
- Email/password login and registration
- Mock authentication service for development
- Session management with localStorage/sessionStorage
- "Remember me" functionality
- Password visibility toggle
- Forgot password flow

### 🎨 Modern UI/UX
- Glass morphism design matching main site
- Framer Motion animations and transitions
- Responsive design for all devices
- Professional loading states
- Real-time form validation with error messages

### 🛡️ Security & Validation
- Input sanitization and validation
- Password strength requirements
- Email format validation
- Protected routes with authentication checks
- Automatic session management

### 📱 Responsive Design
- Mobile-first approach
- Tablet and desktop optimized
- Touch-friendly interactions
- Consistent branding

## File Structure

```
src/
├── app/portal/
│   ├── layout.tsx          # Portal layout with AuthProvider
│   ├── page.tsx            # Portal homepage with routing
│   ├── login/page.tsx      # Login form with forgot password
│   ├── register/page.tsx   # Registration form
│   └── dashboard/page.tsx  # Main dashboard
├── contexts/
│   └── AuthContext.tsx    # Authentication context and hooks
├── components/auth/
│   ├── AuthCard.tsx       # Reusable auth form container
│   ├── FormInput.tsx      # Enhanced form input with validation
│   ├── LoadingButton.tsx  # Button with loading states
│   ├── ProtectedRoute.tsx # Route protection wrapper
│   ├── SocialLogin.tsx    # Social login buttons
│   └── index.ts           # Component exports
└── lib/
    └── auth.ts            # Authentication utilities and mock API
```

## Components

### AuthCard
Reusable container for authentication forms with consistent styling and animations.

### FormInput
Enhanced input component with:
- Real-time validation
- Error state handling
- Password visibility toggle
- Accessibility features

### LoadingButton
Button component with loading states and animations.

### ProtectedRoute
Wrapper component that handles authentication checks and redirects.

### SocialLogin
Social authentication buttons (Google, Microsoft) with placeholders for OAuth integration.

## Authentication Flow

1. **Login**: Email/password → validation → API call → session storage → redirect
2. **Register**: Form validation → API call → session storage → redirect
3. **Logout**: Clear session → redirect to login
4. **Protected Routes**: Check authentication → redirect if needed

## Mock API

The authentication system includes a complete mock API for development:

```typescript
// Demo credentials
email: "demo@pennkraft.com"
password: any password (for demo purposes)
```

## Usage

### Basic Setup
```tsx
import { AuthProvider } from '@/contexts/AuthContext';

export default function App({ children }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}
```

### Using Authentication
```tsx
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();
  
  // Your component logic
}
```

### Protected Routes
```tsx
import { ProtectedRoute } from '@/components/auth';

function DashboardPage() {
  return (
    <ProtectedRoute>
      {/* Your protected content */}
    </ProtectedRoute>
  );
}
```

## Styling

The authentication system uses:
- Tailwind CSS for styling
- Glass morphism effects (`.glass-effect` class)
- Custom primary color palette
- Consistent spacing and typography
- Responsive design patterns

## Next Steps

1. **Backend Integration**: Replace mock API with real authentication service
2. **OAuth Integration**: Complete Google and Microsoft OAuth flows
3. **Email Verification**: Add email verification for new accounts
4. **Password Reset**: Implement actual password reset functionality
5. **Multi-factor Authentication**: Add 2FA support
6. **Session Management**: Implement JWT token refresh logic
