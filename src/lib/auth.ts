// Authentication utilities and mock API

export interface User {
  id: string;
  email: string;
  name: string;
  company?: string;
  role: 'customer' | 'admin';
  createdAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  company?: string;
  phone?: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  error?: string;
}

// Mock user database
const mockUsers: User[] = [
  {
    id: '1',
    email: 'demo@pennkraft.com',
    name: 'Demo User',
    company: 'Demo Construction',
    role: 'customer',
    createdAt: new Date().toISOString(),
  },
];

// Mock authentication service
export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const user = mockUsers.find(u => u.email === credentials.email);
    
    if (!user) {
      return {
        success: false,
        error: 'Invalid email or password',
      };
    }
    
    // For demo, accept any password
    const token = `mock-jwt-token-${user.id}`;
    
    // Store in localStorage if "remember me" is checked
    if (credentials.rememberMe) {
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user_data', JSON.stringify(user));
    } else {
      sessionStorage.setItem('auth_token', token);
      sessionStorage.setItem('user_data', JSON.stringify(user));
    }
    
    return {
      success: true,
      user,
      token,
    };
  },
  
  async register(data: RegisterData): Promise<AuthResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Check if user already exists
    const existingUser = mockUsers.find(u => u.email === data.email);
    if (existingUser) {
      return {
        success: false,
        error: 'An account with this email already exists',
      };
    }
    
    // Validate password confirmation
    if (data.password !== data.confirmPassword) {
      return {
        success: false,
        error: 'Passwords do not match',
      };
    }
    
    // Create new user
    const newUser: User = {
      id: Date.now().toString(),
      email: data.email,
      name: data.name,
      company: data.company,
      role: 'customer',
      createdAt: new Date().toISOString(),
    };
    
    mockUsers.push(newUser);
    
    const token = `mock-jwt-token-${newUser.id}`;
    
    // Store in session
    sessionStorage.setItem('auth_token', token);
    sessionStorage.setItem('user_data', JSON.stringify(newUser));
    
    return {
      success: true,
      user: newUser,
      token,
    };
  },
  
  async logout(): Promise<void> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Clear all stored data
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    sessionStorage.removeItem('auth_token');
    sessionStorage.removeItem('user_data');
  },
  
  getCurrentUser(): User | null {
    try {
      const userData = localStorage.getItem('user_data') || sessionStorage.getItem('user_data');
      const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
      
      if (!userData || !token) return null;
      
      return JSON.parse(userData);
    } catch {
      return null;
    }
  },
  
  isAuthenticated(): boolean {
    const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
    return !!token;
  },
  
  async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const user = mockUsers.find(u => u.email === email);
    
    if (!user) {
      return {
        success: false,
        message: 'No account found with this email address',
      };
    }
    
    return {
      success: true,
      message: 'Password reset instructions have been sent to your email',
    };
  },
};

// Form validation helpers
export const validators = {
  email: (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'Email is required';
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return null;
  },
  
  password: (password: string) => {
    if (!password) return 'Password is required';
    if (password.length < 8) return 'Password must be at least 8 characters long';
    if (!/(?=.*[a-z])/.test(password)) return 'Password must contain at least one lowercase letter';
    if (!/(?=.*[A-Z])/.test(password)) return 'Password must contain at least one uppercase letter';
    if (!/(?=.*\d)/.test(password)) return 'Password must contain at least one number';
    return null;
  },
  
  confirmPassword: (password: string, confirmPassword: string) => {
    if (!confirmPassword) return 'Please confirm your password';
    if (password !== confirmPassword) return 'Passwords do not match';
    return null;
  },
  
  name: (name: string) => {
    if (!name) return 'Name is required';
    if (name.length < 2) return 'Name must be at least 2 characters long';
    return null;
  },
};