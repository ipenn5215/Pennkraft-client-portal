'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AuthCard } from '@/components/auth/AuthCard';
import { FormInput } from '@/components/auth/FormInput';
import { LoadingButton } from '@/components/auth/LoadingButton';
import { SocialLogin } from '@/components/auth/SocialLogin';
import { validators } from '@/lib/auth';

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  company?: string;
  phone?: string;
  general?: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    company: '',
    phone: '',
    agreeToTerms: false,
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState('');
  
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
    
    const nameError = validators.name(formData.name);
    if (nameError) newErrors.name = nameError;
    
    const emailError = validators.email(formData.email);
    if (emailError) newErrors.email = emailError;
    
    const passwordError = validators.password(formData.password);
    if (passwordError) newErrors.password = passwordError;
    
    const confirmPasswordError = validators.confirmPassword(formData.password, formData.confirmPassword);
    if (confirmPasswordError) newErrors.confirmPassword = confirmPasswordError;
    
    if (formData.phone && formData.phone.length > 0) {
      const phoneRegex = /^[\+]?[1-9][\d\s\-\(\)]{7,15}$/;
      if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
        newErrors.phone = 'Please enter a valid phone number';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    if (!formData.agreeToTerms) {
      setErrors({ general: 'Please agree to the Terms of Service and Privacy Policy' });
      return;
    }
    
    try {
      const response = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        company: formData.company || undefined,
        phone: formData.phone || undefined,
      });
      
      if (response.success) {
        setSuccessMessage('Account created successfully! Redirecting to dashboard...');
        setTimeout(() => {
          router.push('/portal/dashboard');
        }, 2000);
      } else {
        setErrors({ general: response.error || 'Registration failed' });
      }
    } catch (error) {
      setErrors({ general: 'An unexpected error occurred' });
    }
  };
  
  return (
    <ProtectedRoute requireAuth={false}>
      <div className="min-h-screen flex items-center justify-center section-padding py-12">
        <div className="w-full max-w-md">
          <AuthCard 
            title="Create Account" 
            subtitle="Join Pennkraft and start managing your projects"
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
            
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2"
              >
                <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-green-700 text-sm">{successMessage}</span>
              </motion.div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <FormInput
                label="Full Name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                error={errors.name}
                required
                autoComplete="name"
                disabled={isLoading}
              />
              
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
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput
                  label="Password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Create password"
                  error={errors.password}
                  required
                  autoComplete="new-password"
                  disabled={isLoading}
                />
                
                <FormInput
                  label="Confirm Password"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm password"
                  error={errors.confirmPassword}
                  required
                  autoComplete="new-password"
                  disabled={isLoading}
                />
              </div>
              
              <FormInput
                label="Company Name"
                type="text"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                placeholder="Enter company name (optional)"
                error={errors.company}
                autoComplete="organization"
                disabled={isLoading}
              />
              
              <FormInput
                label="Phone Number"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter phone number (optional)"
                error={errors.phone}
                autoComplete="tel"
                disabled={isLoading}
              />
              
              <div className="flex items-start">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-1"
                  required
                />
                <div className="ml-3">
                  <label htmlFor="agreeToTerms" className="text-sm text-gray-600">
                    I agree to the{' '}
                    <Link href="/terms" className="text-primary-600 hover:text-primary-500 font-medium">
                      Terms of Service
                    </Link>
                    {' '}and{' '}
                    <Link href="/privacy" className="text-primary-600 hover:text-primary-500 font-medium">
                      Privacy Policy
                    </Link>
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                </div>
              </div>
              
              <LoadingButton
                type="submit"
                isLoading={isLoading}
                className="w-full"
                size="lg"
              >
                Create Account
              </LoadingButton>
            </form>
            
            <div className="mt-8">
              <SocialLogin isLoading={isLoading} />
            </div>
            
            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link 
                  href="/portal/login" 
                  className="font-medium text-primary-600 hover:text-primary-500 transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </AuthCard>
        </div>
      </div>
    </ProtectedRoute>
  );
}