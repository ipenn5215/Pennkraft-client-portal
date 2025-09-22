'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AuthCard } from '@/components/auth/AuthCard';
import { FormInput } from '@/components/auth/FormInput';
import { LoadingButton } from '@/components/auth/LoadingButton';
import { SocialLogin } from '@/components/auth/SocialLogin';
import { validators } from '@/lib/auth';

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState('');
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    
    // Clear errors when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined, general: undefined }));
    }
  };
  
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    const emailError = validators.email(formData.email);
    if (emailError) newErrors.email = emailError;
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      const response = await login({
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe,
      });
      
      if (response.success) {
        router.push('/portal/dashboard');
      } else {
        setErrors({ general: response.error || 'Login failed' });
      }
    } catch (error) {
      setErrors({ general: 'An unexpected error occurred' });
    }
  };
  
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const emailError = validators.email(forgotPasswordEmail);
    if (emailError) {
      setForgotPasswordMessage(emailError);
      return;
    }
    
    setForgotPasswordLoading(true);
    try {
      // TODO: Implement password reset with Supabase
      const response = { success: true, message: 'Password reset instructions sent to your email' };
      setForgotPasswordMessage(response.message);
      
      if (response.success) {
        setTimeout(() => {
          setShowForgotPassword(false);
          setForgotPasswordEmail('');
          setForgotPasswordMessage('');
        }, 3000);
      }
    } catch (error) {
      setForgotPasswordMessage('An error occurred. Please try again.');
    } finally {
      setForgotPasswordLoading(false);
    }
  };
  
  return (
    <ProtectedRoute requireAuth={false}>
      <div className="min-h-screen flex items-center justify-center section-padding">
        <div className="w-full max-w-md">
          <AnimatePresence mode="wait">
            {!showForgotPassword ? (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <Link
                  href="/"
                  className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  <span>Back to Main Site</span>
                </Link>
                <AuthCard
                  title="Welcome Back"
                  subtitle="Sign in to your Pennkraft account"
                >
                  {errors.general && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2"
                    >
                      <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                      <span className="text-red-700 text-sm">{errors.general}</span>
                    </motion.div>
                  )}
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <FormInput
                      label="Email Address"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                      error={errors.email}
                      required
                      autoComplete="email"
                      disabled={isLoading}
                    />
                    
                    <FormInput
                      label="Password"
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter your password"
                      error={errors.password}
                      required
                      autoComplete="current-password"
                      disabled={isLoading}
                    />
                    
                    <div className="flex items-center justify-between">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="rememberMe"
                          checked={formData.rememberMe}
                          onChange={handleInputChange}
                          disabled={isLoading}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-600">Remember me</span>
                      </label>
                      
                      <button
                        type="button"
                        onClick={() => setShowForgotPassword(true)}
                        disabled={isLoading}
                        className="text-sm text-primary-600 hover:text-primary-500 font-medium disabled:opacity-50"
                      >
                        Forgot password?
                      </button>
                    </div>
                    
                    <LoadingButton
                      type="submit"
                      isLoading={isLoading}
                      className="w-full"
                      size="lg"
                    >
                      Sign In
                    </LoadingButton>
                  </form>
                  
                  <div className="mt-8">
                    <SocialLogin isLoading={isLoading} />
                  </div>
                  
                  <div className="mt-8 text-center">
                    <p className="text-gray-600">
                      Don't have an account?{' '}
                      <Link 
                        href="/portal/register" 
                        className="font-medium text-primary-600 hover:text-primary-500 transition-colors"
                      >
                        Sign up
                      </Link>
                    </p>
                  </div>
                </AuthCard>
              </motion.div>
            ) : (
              <motion.div
                key="forgot-password"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Link
                  href="/"
                  className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  <span>Back to Main Site</span>
                </Link>
                <AuthCard
                  title="Forgot Password"
                  subtitle="Enter your email to receive reset instructions"
                >
                  {forgotPasswordMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`mb-6 p-4 border rounded-lg flex items-center space-x-2 ${
                        forgotPasswordMessage.includes('sent') || forgotPasswordMessage.includes('instructions')
                          ? 'bg-green-50 border-green-200'
                          : 'bg-red-50 border-red-200'
                      }`}
                    >
                      {forgotPasswordMessage.includes('sent') || forgotPasswordMessage.includes('instructions') ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                      )}
                      <span className={`text-sm ${
                        forgotPasswordMessage.includes('sent') || forgotPasswordMessage.includes('instructions')
                          ? 'text-green-700'
                          : 'text-red-700'
                      }`}>
                        {forgotPasswordMessage}
                      </span>
                    </motion.div>
                  )}
                  
                  <form onSubmit={handleForgotPassword} className="space-y-6">
                    <FormInput
                      label="Email Address"
                      type="email"
                      name="forgotPasswordEmail"
                      value={forgotPasswordEmail}
                      onChange={(e) => {
                        setForgotPasswordEmail(e.target.value);
                        setForgotPasswordMessage('');
                      }}
                      placeholder="Enter your email"
                      required
                      autoComplete="email"
                      disabled={forgotPasswordLoading}
                    />
                    
                    <div className="space-y-3">
                      <LoadingButton
                        type="submit"
                        isLoading={forgotPasswordLoading}
                        className="w-full"
                        size="lg"
                      >
                        Send Reset Instructions
                      </LoadingButton>
                      
                      <button
                        type="button"
                        onClick={() => {
                          setShowForgotPassword(false);
                          setForgotPasswordEmail('');
                          setForgotPasswordMessage('');
                        }}
                        disabled={forgotPasswordLoading}
                        className="w-full py-3 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                      >
                        Back to Sign In
                      </button>
                    </div>
                  </form>
                </AuthCard>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </ProtectedRoute>
  );
}