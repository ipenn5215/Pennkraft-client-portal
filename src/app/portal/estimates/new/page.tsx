'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Upload,
  X,
  AlertCircle,
  Calendar,
  DollarSign,
  MapPin,
  FileText,
  User,
  Building,
  Phone,
  Mail,
  Save,
  Send
} from 'lucide-react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { ServiceType, Priority, getServiceRequirements } from '@/lib/estimates';
import { getServiceTypeDisplay } from '@/lib/projects';
import { generateId } from '@/lib/utils';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface FormData {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  company: string;
  serviceType: ServiceType | '';
  title: string;
  description: string;
  address: string;
  preferredStartDate: string;
  budget: string;
  priority: Priority;
  requirements: string[];
  notes: string;
}

export default function NewEstimatePage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    company: '',
    serviceType: '',
    title: '',
    description: '',
    address: '',
    preferredStartDate: '',
    budget: '',
    priority: 'medium',
    requirements: [],
    notes: ''
  });

  const [attachments, setAttachments] = useState<File[]>([]);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const serviceTypes: Array<{ value: ServiceType; label: string }> = [
    { value: 'residential-painting', label: 'Residential Painting' },
    { value: 'commercial-painting', label: 'Commercial Painting' },
    { value: 'drywall-repair', label: 'Drywall Repair' },
    { value: 'flooring', label: 'Flooring' },
    { value: 'glass-installation', label: 'Glass Installation' },
    { value: 'custom-work', label: 'Custom Work' }
  ];

  const priorityOptions: Array<{ value: Priority; label: string; description: string }> = [
    { value: 'low', label: 'Low', description: 'Standard timeline, flexible scheduling' },
    { value: 'medium', label: 'Medium', description: 'Normal priority, preferred timeline' },
    { value: 'high', label: 'High', description: 'Important project, quick response needed' },
    { value: 'urgent', label: 'Urgent', description: 'Critical timeline, immediate attention' }
  ];

  const handleInputChange = (field: keyof FormData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleServiceTypeChange = (serviceType: ServiceType | '') => {
    setFormData(prev => ({
      ...prev,
      serviceType,
      requirements: serviceType ? getServiceRequirements(serviceType) : []
    }));
  };

  const handleRequirementChange = (index: number, value: string) => {
    const newRequirements = [...formData.requirements];
    newRequirements[index] = value;
    setFormData(prev => ({ ...prev, requirements: newRequirements }));
  };

  const addRequirement = () => {
    setFormData(prev => ({
      ...prev,
      requirements: [...prev.requirements, '']
    }));
  };

  const removeRequirement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index)
    }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.clientName.trim()) newErrors.clientName = 'Client name is required';
    if (!formData.clientEmail.trim()) newErrors.clientEmail = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.clientEmail)) newErrors.clientEmail = 'Invalid email format';
    if (!formData.serviceType) newErrors.serviceType = 'Service type is required';
    if (!formData.title.trim()) newErrors.title = 'Project title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (action: 'draft' | 'submit') => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      const estimateId = generateId();
      console.log('Estimate saved:', {
        id: estimateId,
        ...formData,
        status: action === 'draft' ? 'draft' : 'submitted',
        attachments,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      // Redirect to estimates page with success message
      router.push('/portal/estimates?created=' + estimateId);
    } catch (error) {
      console.error('Error submitting estimate:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center space-x-4 mb-6">
              <Link href="/portal/estimates">
                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <ArrowLeft className="h-6 w-6" />
                </button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">New Estimate Request</h1>
                <p className="text-gray-600 mt-1">Submit a new project estimate request</p>
              </div>
            </div>
          </motion.div>

          <form className="space-y-8">
            {/* Client Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-effect rounded-xl p-6 border border-white/20"
            >
              <div className="flex items-center space-x-2 mb-6">
                <User className="h-5 w-5 text-primary-600" />
                <h2 className="text-xl font-semibold text-gray-900">Client Information</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.clientName}
                    onChange={(e) => handleInputChange('clientName', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                      errors.clientName ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter your full name"
                  />
                  {errors.clientName && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.clientName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={formData.clientEmail}
                    onChange={(e) => handleInputChange('clientEmail', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                      errors.clientEmail ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="your@email.com"
                  />
                  {errors.clientEmail && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.clientEmail}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.clientPhone}
                    onChange={(e) => handleInputChange('clientPhone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Your company name"
                  />
                </div>
              </div>
            </motion.div>

            {/* Project Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-effect rounded-xl p-6 border border-white/20"
            >
              <div className="flex items-center space-x-2 mb-6">
                <FileText className="h-5 w-5 text-primary-600" />
                <h2 className="text-xl font-semibold text-gray-900">Project Details</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service Type *
                  </label>
                  <select
                    value={formData.serviceType}
                    onChange={(e) => handleServiceTypeChange(e.target.value as ServiceType | '')}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                      errors.serviceType ? 'border-red-300' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select a service type</option>
                    {serviceTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                  {errors.serviceType && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.serviceType}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                      errors.title ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Brief title for your project"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.title}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={4}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                      errors.description ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Detailed description of your project requirements"
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.description}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Address *
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                      errors.address ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Full address where work will be performed"
                  />
                  {errors.address && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.address}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Start Date
                    </label>
                    <input
                      type="date"
                      value={formData.preferredStartDate}
                      onChange={(e) => handleInputChange('preferredStartDate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Budget Range
                    </label>
                    <input
                      type="number"
                      value={formData.budget}
                      onChange={(e) => handleInputChange('budget', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="0"
                      min="0"
                      step="100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority Level
                  </label>
                  <div className="space-y-2">
                    {priorityOptions.map(option => (
                      <label key={option.value} className="flex items-start space-x-3">
                        <input
                          type="radio"
                          name="priority"
                          value={option.value}
                          checked={formData.priority === option.value}
                          onChange={(e) => handleInputChange('priority', e.target.value)}
                          className="mt-1 text-primary-600 focus:ring-primary-500"
                        />
                        <div>
                          <div className="font-medium">{option.label}</div>
                          <div className="text-sm text-gray-500">{option.description}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Requirements */}
            {formData.requirements.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass-effect rounded-xl p-6 border border-white/20"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Project Requirements</h2>
                  <button
                    type="button"
                    onClick={addRequirement}
                    className="text-sm text-primary-600 hover:text-primary-700"
                  >
                    Add Requirement
                  </button>
                </div>

                <div className="space-y-4">
                  {formData.requirements.map((req, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <input
                        type="text"
                        value={req}
                        onChange={(e) => handleRequirementChange(index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Requirement description"
                      />
                      <button
                        type="button"
                        onClick={() => removeRequirement(index)}
                        className="p-2 text-gray-400 hover:text-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* File Attachments */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass-effect rounded-xl p-6 border border-white/20"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Attachments</h2>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 mb-4">
                  Upload photos, plans, or other relevant documents
                </p>
                <input
                  type="file"
                  multiple
                  accept="image/*,.pdf,.doc,.docx"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                >
                  Select Files
                </label>
              </div>

              {attachments.length > 0 && (
                <div className="mt-4 space-y-2">
                  {attachments.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900">{file.name}</p>
                        <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeAttachment(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Additional Notes */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="glass-effect rounded-xl p-6 border border-white/20"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Additional Notes</h2>
              <textarea
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Any additional information or special requirements..."
              />
            </motion.div>

            {/* Form Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-end"
            >
              <button
                type="button"
                onClick={() => handleSubmit('draft')}
                disabled={isSubmitting}
                className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="h-5 w-5 mr-2" />
                {isSubmitting ? 'Saving...' : 'Save Draft'}
              </button>

              <button
                type="button"
                onClick={() => handleSubmit('submit')}
                disabled={isSubmitting}
                className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-5 w-5 mr-2" />
                {isSubmitting ? 'Submitting...' : 'Submit Request'}
              </button>
            </motion.div>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}