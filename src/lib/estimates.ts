import { ServiceType } from './projects';

export type EstimateStatus = 'draft' | 'submitted' | 'under-review' | 'approved' | 'rejected' | 'expired';
export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export interface EstimateRequest {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  company?: string;
  serviceType: ServiceType;
  title: string;
  description: string;
  address: string;
  preferredStartDate?: Date;
  budget?: number;
  priority: Priority;
  status: EstimateStatus;
  requirements: string[];
  attachments: EstimateAttachment[];
  notes?: string;
  estimatedValue?: number;
  estimatedDuration?: number; // in days
  assignedTo?: string;
  createdAt: Date;
  updatedAt: Date;
  reviewedAt?: Date;
  expiresAt?: Date;
}

export interface EstimateAttachment {
  id: string;
  estimateId: string;
  name: string;
  type: string;
  url: string;
  size: number;
  uploadedAt: Date;
}

export interface EstimateResponse {
  id: string;
  estimateId: string;
  lineItems: LineItem[];
  subtotal: number;
  tax: number;
  total: number;
  validUntil: Date;
  terms: string;
  notes?: string;
  createdBy: string;
  createdAt: Date;
}

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  total: number;
  category: string;
}

// Mock data for estimate requests
export const mockEstimateRequests: EstimateRequest[] = [
  {
    id: 'est-001',
    clientName: 'Emily Davis',
    clientEmail: 'emily@email.com',
    clientPhone: '(555) 234-5678',
    serviceType: 'residential-painting',
    title: 'Kitchen Cabinet Painting',
    description: 'Looking to paint kitchen cabinets and possibly some trim work. Kitchen is medium-sized with 20+ cabinet doors.',
    address: '567 Pine Street, Springfield, IL 62705',
    preferredStartDate: new Date('2024-10-15'),
    budget: 3000,
    priority: 'medium',
    status: 'submitted',
    requirements: [
      'Paint existing kitchen cabinets',
      'Include primer for proper adhesion',
      'Prefer semi-gloss or satin finish',
      'Color consultation included'
    ],
    attachments: [
      {
        id: 'att-001',
        estimateId: 'est-001',
        name: 'kitchen-photos.jpg',
        type: 'image/jpeg',
        url: '/uploads/est-001/kitchen-photos.jpg',
        size: 2048576,
        uploadedAt: new Date('2024-09-15')
      }
    ],
    notes: 'Customer mentioned they want to match existing trim color',
    createdAt: new Date('2024-09-15'),
    updatedAt: new Date('2024-09-15')
  },
  {
    id: 'est-002',
    clientName: 'Robert Chen',
    clientEmail: 'robert@techstartup.com',
    company: 'Tech Startup Inc',
    serviceType: 'commercial-painting',
    title: 'Office Space Paint & Refresh',
    description: 'New office space needs complete paint job - walls, ceilings, and some accent walls. Modern, professional look desired.',
    address: '890 Innovation Drive, Springfield, IL 62706',
    preferredStartDate: new Date('2024-11-01'),
    budget: 8000,
    priority: 'high',
    status: 'under-review',
    requirements: [
      'Paint 2,500 sq ft office space',
      'Include ceiling work',
      'Modern color palette',
      'Weekend/evening work preferred'
    ],
    attachments: [],
    estimatedValue: 7500,
    estimatedDuration: 5,
    assignedTo: 'Project Manager',
    createdAt: new Date('2024-09-10'),
    updatedAt: new Date('2024-09-12'),
    reviewedAt: new Date('2024-09-12')
  },
  {
    id: 'est-003',
    clientName: 'Lisa Thompson',
    clientEmail: 'lisa@homeowner.com',
    serviceType: 'drywall-repair',
    title: 'Basement Water Damage Repair',
    description: 'Basement had minor flooding. Need drywall replacement in several areas and repainting.',
    address: '234 Elm Avenue, Springfield, IL 62707',
    priority: 'urgent',
    status: 'approved',
    requirements: [
      'Assess water damage extent',
      'Remove and replace damaged drywall',
      'Moisture treatment if needed',
      'Prime and paint affected areas'
    ],
    attachments: [
      {
        id: 'att-002',
        estimateId: 'est-003',
        name: 'basement-damage.pdf',
        type: 'application/pdf',
        url: '/uploads/est-003/basement-damage.pdf',
        size: 1048576,
        uploadedAt: new Date('2024-09-08')
      }
    ],
    estimatedValue: 2800,
    estimatedDuration: 3,
    assignedTo: 'Project Manager',
    createdAt: new Date('2024-09-08'),
    updatedAt: new Date('2024-09-14'),
    reviewedAt: new Date('2024-09-09')
  },
  {
    id: 'est-004',
    clientName: 'David Rodriguez',
    clientEmail: 'david@restaurant.com',
    company: 'Casa Rodriguez Restaurant',
    serviceType: 'flooring',
    title: 'Restaurant Flooring Upgrade',
    description: 'Replace dining area flooring with commercial-grade luxury vinyl. High-traffic area needs durable solution.',
    address: '456 Food Court, Springfield, IL 62708',
    preferredStartDate: new Date('2024-12-01'),
    budget: 15000,
    priority: 'low',
    status: 'draft',
    requirements: [
      'Commercial-grade flooring',
      'High-traffic durability',
      'Food service appropriate',
      'Quick installation preferred'
    ],
    attachments: [],
    createdAt: new Date('2024-09-17'),
    updatedAt: new Date('2024-09-17')
  },
  {
    id: 'est-005',
    clientName: 'Amanda Foster',
    clientEmail: 'amanda@boutique.com',
    company: 'Foster Fashion Boutique',
    serviceType: 'glass-installation',
    title: 'Storefront Glass Replacement',
    description: 'Need to replace large storefront window that was damaged. Security glass preferred.',
    address: '123 Shopping Plaza, Springfield, IL 62709',
    preferredStartDate: new Date('2024-10-01'),
    priority: 'urgent',
    status: 'submitted',
    requirements: [
      'Large storefront window replacement',
      'Security/tempered glass',
      'Professional installation',
      'Same-day service if possible'
    ],
    attachments: [
      {
        id: 'att-003',
        estimateId: 'est-005',
        name: 'storefront-dimensions.jpg',
        type: 'image/jpeg',
        url: '/uploads/est-005/storefront-dimensions.jpg',
        size: 1536000,
        uploadedAt: new Date('2024-09-16')
      }
    ],
    notes: 'Insurance claim involved - need detailed documentation',
    createdAt: new Date('2024-09-16'),
    updatedAt: new Date('2024-09-16')
  }
];

export const getEstimatesByStatus = (status: EstimateStatus): EstimateRequest[] => {
  return mockEstimateRequests.filter(estimate => estimate.status === status);
};

export const getEstimateById = (id: string): EstimateRequest | undefined => {
  return mockEstimateRequests.find(estimate => estimate.id === id);
};

export const getPriorityColor = (priority: Priority): string => {
  switch (priority) {
    case 'low': return 'bg-gray-100 text-gray-800';
    case 'medium': return 'bg-blue-100 text-blue-800';
    case 'high': return 'bg-orange-100 text-orange-800';
    case 'urgent': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const getEstimateStatusColor = (status: EstimateStatus): string => {
  switch (status) {
    case 'draft': return 'bg-gray-100 text-gray-800';
    case 'submitted': return 'bg-blue-100 text-blue-800';
    case 'under-review': return 'bg-yellow-100 text-yellow-800';
    case 'approved': return 'bg-green-100 text-green-800';
    case 'rejected': return 'bg-red-100 text-red-800';
    case 'expired': return 'bg-gray-100 text-gray-600';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const getEstimateStatusDisplay = (status: EstimateStatus): string => {
  switch (status) {
    case 'draft': return 'Draft';
    case 'submitted': return 'Submitted';
    case 'under-review': return 'Under Review';
    case 'approved': return 'Approved';
    case 'rejected': return 'Rejected';
    case 'expired': return 'Expired';
    default: return 'Unknown';
  }
};

export const getPriorityDisplay = (priority: Priority): string => {
  switch (priority) {
    case 'low': return 'Low';
    case 'medium': return 'Medium';
    case 'high': return 'High';
    case 'urgent': return 'Urgent';
    default: return 'Unknown';
  }
};

// Service type requirements templates
export const getServiceRequirements = (serviceType: ServiceType): string[] => {
  switch (serviceType) {
    case 'residential-painting':
      return [
        'Interior or exterior painting',
        'Surface preparation needed',
        'Color preferences',
        'Paint type/finish preferences'
      ];
    case 'commercial-painting':
      return [
        'Building type and size',
        'Business hours constraints',
        'Safety/access requirements',
        'Professional color consultation'
      ];
    case 'drywall-repair':
      return [
        'Extent of damage',
        'Cause of damage (water, impact, etc.)',
        'Moisture testing needed',
        'Matching existing texture'
      ];
    case 'flooring':
      return [
        'Room size and layout',
        'Flooring material preference',
        'Subfloor condition',
        'Traffic level considerations'
      ];
    case 'glass-installation':
      return [
        'Glass type and specifications',
        'Safety/security requirements',
        'Measurements and access',
        'Timeframe constraints'
      ];
    case 'custom-work':
      return [
        'Detailed project description',
        'Materials preferences',
        'Timeline requirements',
        'Special considerations'
      ];
    default:
      return ['Project requirements', 'Timeline preferences', 'Budget considerations'];
  }
};