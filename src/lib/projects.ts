export type ProjectStatus = 'pending' | 'in-progress' | 'review' | 'completed' | 'cancelled';
export type DocumentType = 'plans' | 'specs' | 'photos' | 'contracts' | 'invoices' | 'other';
export type ServiceType = 'residential-painting' | 'commercial-painting' | 'drywall-repair' | 'flooring' | 'glass-installation' | 'custom-work';

export interface Project {
  id: string;
  title: string;
  description: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  status: ProjectStatus;
  serviceType: ServiceType;
  startDate: Date;
  endDate: Date;
  estimatedCost: number;
  actualCost?: number;
  progress: number; // 0-100
  address: string;
  milestones: Milestone[];
  documents: Document[];
  communications: Communication[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Milestone {
  id: string;
  projectId: string;
  title: string;
  description: string;
  dueDate: Date;
  completed: boolean;
  completedAt?: Date;
  order: number;
}

export interface Document {
  id: string;
  projectId: string;
  name: string;
  type: DocumentType;
  url: string;
  size: number;
  uploadedAt: Date;
  uploadedBy: string;
}

export interface Communication {
  id: string;
  projectId: string;
  from: string;
  to: string;
  subject: string;
  message: string;
  attachments?: string[];
  timestamp: Date;
  read: boolean;
}

// Mock data
export const mockProjects: Project[] = [
  {
    id: 'proj-001',
    title: 'Residential Painting - Oak Street',
    description: 'Complete interior and exterior painting for 2-story residential home',
    clientName: 'John Smith',
    clientEmail: 'john@email.com',
    clientPhone: '(555) 123-4567',
    status: 'in-progress',
    serviceType: 'residential-painting',
    startDate: new Date('2024-09-15'),
    endDate: new Date('2024-10-01'),
    estimatedCost: 8500,
    actualCost: 8200,
    progress: 65,
    address: '123 Oak Street, Springfield, IL 62701',
    milestones: [
      {
        id: 'ms-001',
        projectId: 'proj-001',
        title: 'Surface Preparation',
        description: 'Prep all surfaces, fill holes, sand rough areas',
        dueDate: new Date('2024-09-18'),
        completed: true,
        completedAt: new Date('2024-09-17'),
        order: 1
      },
      {
        id: 'ms-002',
        projectId: 'proj-001',
        title: 'Interior Painting',
        description: 'Paint all interior walls and ceilings',
        dueDate: new Date('2024-09-25'),
        completed: true,
        completedAt: new Date('2024-09-24'),
        order: 2
      },
      {
        id: 'ms-003',
        projectId: 'proj-001',
        title: 'Exterior Painting',
        description: 'Paint exterior walls and trim',
        dueDate: new Date('2024-10-01'),
        completed: false,
        order: 3
      }
    ],
    documents: [
      {
        id: 'doc-001',
        projectId: 'proj-001',
        name: 'Color Scheme Plan.pdf',
        type: 'plans',
        url: '/documents/proj-001/color-scheme.pdf',
        size: 2048576,
        uploadedAt: new Date('2024-09-10'),
        uploadedBy: 'John Smith'
      },
      {
        id: 'doc-002',
        projectId: 'proj-001',
        name: 'Before Photos.zip',
        type: 'photos',
        url: '/documents/proj-001/before-photos.zip',
        size: 15728640,
        uploadedAt: new Date('2024-09-12'),
        uploadedBy: 'Project Manager'
      }
    ],
    communications: [
      {
        id: 'comm-001',
        projectId: 'proj-001',
        from: 'John Smith',
        to: 'Pennkraft Team',
        subject: 'Color confirmation needed',
        message: 'Hi team, can you confirm the final color selection for the living room?',
        timestamp: new Date('2024-09-20'),
        read: true
      }
    ],
    createdAt: new Date('2024-09-01'),
    updatedAt: new Date('2024-09-20')
  },
  {
    id: 'proj-002',
    title: 'Commercial Flooring - Downtown Office',
    description: 'Install luxury vinyl plank flooring in 3,000 sq ft office space',
    clientName: 'Sarah Johnson',
    clientEmail: 'sarah@businesscorp.com',
    clientPhone: '(555) 987-6543',
    status: 'completed',
    serviceType: 'flooring',
    startDate: new Date('2024-08-01'),
    endDate: new Date('2024-08-15'),
    estimatedCost: 12000,
    actualCost: 11500,
    progress: 100,
    address: '456 Business Ave, Springfield, IL 62702',
    milestones: [
      {
        id: 'ms-004',
        projectId: 'proj-002',
        title: 'Floor Preparation',
        description: 'Remove old carpet and prep subfloor',
        dueDate: new Date('2024-08-03'),
        completed: true,
        completedAt: new Date('2024-08-02'),
        order: 1
      },
      {
        id: 'ms-005',
        projectId: 'proj-002',
        title: 'Installation',
        description: 'Install luxury vinyl planks',
        dueDate: new Date('2024-08-12'),
        completed: true,
        completedAt: new Date('2024-08-11'),
        order: 2
      },
      {
        id: 'ms-006',
        projectId: 'proj-002',
        title: 'Final Cleanup',
        description: 'Clean and inspect completed work',
        dueDate: new Date('2024-08-15'),
        completed: true,
        completedAt: new Date('2024-08-14'),
        order: 3
      }
    ],
    documents: [
      {
        id: 'doc-003',
        projectId: 'proj-002',
        name: 'Floor Plan Layout.dwg',
        type: 'plans',
        url: '/documents/proj-002/floor-plan.dwg',
        size: 1048576,
        uploadedAt: new Date('2024-07-28'),
        uploadedBy: 'Sarah Johnson'
      }
    ],
    communications: [
      {
        id: 'comm-002',
        projectId: 'proj-002',
        from: 'Pennkraft Team',
        to: 'Sarah Johnson',
        subject: 'Project Completed',
        message: 'Your flooring project has been completed successfully. Please review and let us know if you have any feedback.',
        timestamp: new Date('2024-08-15'),
        read: true
      }
    ],
    createdAt: new Date('2024-07-15'),
    updatedAt: new Date('2024-08-15')
  },
  {
    id: 'proj-003',
    title: 'Glass Installation - Retail Store',
    description: 'Install storefront windows and interior glass partitions',
    clientName: 'Mike Wilson',
    clientEmail: 'mike@retailstore.com',
    status: 'pending',
    serviceType: 'glass-installation',
    startDate: new Date('2024-10-01'),
    endDate: new Date('2024-10-20'),
    estimatedCost: 15000,
    progress: 0,
    address: '789 Main Street, Springfield, IL 62703',
    milestones: [
      {
        id: 'ms-007',
        projectId: 'proj-003',
        title: 'Measurements & Design',
        description: 'Take final measurements and confirm design specifications',
        dueDate: new Date('2024-10-03'),
        completed: false,
        order: 1
      },
      {
        id: 'ms-008',
        projectId: 'proj-003',
        title: 'Glass Fabrication',
        description: 'Custom glass panels fabricated to specifications',
        dueDate: new Date('2024-10-12'),
        completed: false,
        order: 2
      },
      {
        id: 'ms-009',
        projectId: 'proj-003',
        title: 'Installation',
        description: 'Install all glass panels and hardware',
        dueDate: new Date('2024-10-20'),
        completed: false,
        order: 3
      }
    ],
    documents: [],
    communications: [],
    createdAt: new Date('2024-09-10'),
    updatedAt: new Date('2024-09-10')
  },
  {
    id: 'proj-004',
    title: 'Drywall Repair - Apartment Complex',
    description: 'Repair water damage and repaint 12 apartment units',
    clientName: 'Property Management Co',
    clientEmail: 'maintenance@propertyco.com',
    status: 'review',
    serviceType: 'drywall-repair',
    startDate: new Date('2024-09-10'),
    endDate: new Date('2024-09-30'),
    estimatedCost: 6500,
    progress: 85,
    address: '321 Apartment Way, Springfield, IL 62704',
    milestones: [
      {
        id: 'ms-010',
        projectId: 'proj-004',
        title: 'Damage Assessment',
        description: 'Assess extent of water damage in all units',
        dueDate: new Date('2024-09-12'),
        completed: true,
        completedAt: new Date('2024-09-11'),
        order: 1
      },
      {
        id: 'ms-011',
        projectId: 'proj-004',
        title: 'Drywall Replacement',
        description: 'Remove damaged drywall and install new sections',
        dueDate: new Date('2024-09-20'),
        completed: true,
        completedAt: new Date('2024-09-19'),
        order: 2
      },
      {
        id: 'ms-012',
        projectId: 'proj-004',
        title: 'Painting & Finishing',
        description: 'Prime and paint all repaired areas',
        dueDate: new Date('2024-09-28'),
        completed: false,
        order: 3
      }
    ],
    documents: [
      {
        id: 'doc-004',
        projectId: 'proj-004',
        name: 'Damage Assessment Report.pdf',
        type: 'other',
        url: '/documents/proj-004/damage-report.pdf',
        size: 3145728,
        uploadedAt: new Date('2024-09-11'),
        uploadedBy: 'Project Manager'
      }
    ],
    communications: [
      {
        id: 'comm-003',
        projectId: 'proj-004',
        from: 'Property Management Co',
        to: 'Pennkraft Team',
        subject: 'Additional unit discovered',
        message: 'We found another unit with similar damage. Can this be added to the current project scope?',
        timestamp: new Date('2024-09-18'),
        read: false
      }
    ],
    createdAt: new Date('2024-09-05'),
    updatedAt: new Date('2024-09-18')
  }
];

export const getProjectsByStatus = (status: ProjectStatus): Project[] => {
  return mockProjects.filter(project => project.status === status);
};

export const getProjectById = (id: string): Project | undefined => {
  return mockProjects.find(project => project.id === id);
};

export const getProjectProgress = (project: Project): number => {
  if (project.milestones.length === 0) return 0;
  const completedMilestones = project.milestones.filter(m => m.completed).length;
  return Math.round((completedMilestones / project.milestones.length) * 100);
};

export const getOverdueProjects = (): Project[] => {
  const now = new Date();
  return mockProjects.filter(project =>
    project.status !== 'completed' &&
    project.status !== 'cancelled' &&
    project.endDate < now
  );
};

export const getUpcomingMilestones = (days: number = 7): Milestone[] => {
  const now = new Date();
  const future = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

  const allMilestones = mockProjects.flatMap(project =>
    project.milestones.filter(milestone =>
      !milestone.completed &&
      milestone.dueDate >= now &&
      milestone.dueDate <= future
    )
  );

  return allMilestones.sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
};

export const getServiceTypeDisplay = (serviceType: ServiceType): string => {
  switch (serviceType) {
    case 'residential-painting': return 'Residential Painting';
    case 'commercial-painting': return 'Commercial Painting';
    case 'drywall-repair': return 'Drywall Repair';
    case 'flooring': return 'Flooring';
    case 'glass-installation': return 'Glass Installation';
    case 'custom-work': return 'Custom Work';
    default: return 'Unknown Service';
  }
};

export const getDocumentTypeDisplay = (docType: DocumentType): string => {
  switch (docType) {
    case 'plans': return 'Plans & Drawings';
    case 'specs': return 'Specifications';
    case 'photos': return 'Photos';
    case 'contracts': return 'Contracts';
    case 'invoices': return 'Invoices';
    case 'other': return 'Other';
    default: return 'Unknown';
  }
};