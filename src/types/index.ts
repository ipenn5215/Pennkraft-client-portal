export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
  category: 'estimating' | 'photography' | 'tech' | 'marketing';
}

export interface Project {
  id: string;
  title: string;
  description: string;
  clientId: string;
  status: 'pending' | 'in-progress' | 'review' | 'completed' | 'cancelled';
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  estimateAmount?: number;
  documents: ProjectDocument[];
  notes: ProjectNote[];
}

export interface ProjectDocument {
  id: string;
  name: string;
  type: 'pdf' | 'dwg' | 'image' | 'excel' | 'word' | 'other';
  url: string;
  uploadedAt: string;
  uploadedBy: string;
  size: number;
}

export interface ProjectNote {
  id: string;
  content: string;
  createdAt: string;
  createdBy: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  address?: string;
  createdAt: string;
  projects: Project[];
  notes: string;
}

export interface EstimateRequest {
  id: string;
  clientId: string;
  projectType: 'painting' | 'tile' | 'flooring' | 'drywall' | 'glass' | 'storefront';
  scope: 'residential' | 'commercial';
  prevailingWage: boolean;
  description: string;
  location: string;
  timeline: string;
  budget?: string;
  documents: ProjectDocument[];
  status: 'submitted' | 'reviewing' | 'estimating' | 'completed';
  submittedAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'client';
  createdAt: string;
}