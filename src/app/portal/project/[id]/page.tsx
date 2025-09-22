'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  FileText,
  Upload,
  Download,
  MessageSquare,
  Calendar,
  Clock,
  DollarSign,
  CheckCircle,
  AlertCircle,
  User,
  Send,
  Paperclip,
  Image,
  File,
  Trash2,
  Edit,
  Home,
  Bell,
  ChevronRight,
  MapPin,
  Phone,
  Mail,
  Activity
} from 'lucide-react';

// Mock project data (in real app, this would come from API based on ID)
const mockProjectData = {
  id: '1',
  name: 'Downtown Office Building',
  type: 'Commercial Renovation',
  status: 'active',
  statusLabel: 'In Progress',
  progress: 65,
  startDate: '2024-10-01',
  dueDate: '2024-12-15',
  budget: '$125,000',
  spent: '$81,250',
  location: '123 Main Street, Downtown',
  client: {
    name: 'John Doe',
    company: 'ABC Construction',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567'
  },
  contractor: {
    name: 'Mike Johnson',
    role: 'Project Manager',
    email: 'mike@pennkraft.com',
    phone: '+1 (555) 987-6543'
  },
  milestones: [
    { id: '1', name: 'Initial Assessment', status: 'completed', date: '2024-10-05' },
    { id: '2', name: 'Design Approval', status: 'completed', date: '2024-10-15' },
    { id: '3', name: 'Materials Procurement', status: 'completed', date: '2024-10-25' },
    { id: '4', name: 'Construction Phase 1', status: 'active', date: '2024-11-15' },
    { id: '5', name: 'Construction Phase 2', status: 'pending', date: '2024-12-01' },
    { id: '6', name: 'Final Inspection', status: 'pending', date: '2024-12-15' }
  ],
  documents: [
    { id: '1', name: 'Initial_Estimate.pdf', type: 'pdf', size: '2.4 MB', uploadedBy: 'Mike Johnson', date: '2024-10-01', category: 'Estimates' },
    { id: '2', name: 'Floor_Plans.dwg', type: 'cad', size: '8.2 MB', uploadedBy: 'Sarah Chen', date: '2024-10-03', category: 'Blueprints' },
    { id: '3', name: 'Material_List.xlsx', type: 'excel', size: '145 KB', uploadedBy: 'Mike Johnson', date: '2024-10-20', category: 'Materials' },
    { id: '4', name: 'Progress_Photos.zip', type: 'archive', size: '45.6 MB', uploadedBy: 'Field Team', date: '2024-11-10', category: 'Photos' },
    { id: '5', name: 'Change_Order_1.pdf', type: 'pdf', size: '1.1 MB', uploadedBy: 'John Doe', date: '2024-11-12', category: 'Changes' }
  ],
  messages: [
    {
      id: '1',
      sender: 'Mike Johnson',
      role: 'Project Manager',
      message: 'Project is progressing well. We\'ve completed the first phase of construction and are on track to meet the deadline.',
      timestamp: '2024-11-14 09:30 AM',
      isClient: false
    },
    {
      id: '2',
      sender: 'John Doe',
      role: 'Client',
      message: 'Great to hear! Can you provide an update on the material deliveries for phase 2?',
      timestamp: '2024-11-14 10:15 AM',
      isClient: true
    },
    {
      id: '3',
      sender: 'Mike Johnson',
      role: 'Project Manager',
      message: 'Materials for phase 2 are scheduled to arrive next Monday. I\'ll send you the delivery confirmation once received.',
      timestamp: '2024-11-14 11:00 AM',
      isClient: false
    }
  ],
  activities: [
    { id: '1', action: 'Document uploaded', detail: 'Change_Order_1.pdf', user: 'John Doe', time: '2 hours ago' },
    { id: '2', action: 'Milestone completed', detail: 'Construction Phase 1', user: 'Mike Johnson', time: '1 day ago' },
    { id: '3', action: 'Message sent', detail: 'Project update', user: 'Mike Johnson', time: '2 days ago' },
    { id: '4', action: 'Photos uploaded', detail: 'Progress_Photos.zip', user: 'Field Team', time: '4 days ago' }
  ]
};

export default function ProjectDetailPage() {
  const params = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  const [newMessage, setNewMessage] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const project = mockProjectData; // In real app, fetch based on params.id

  const getFileIcon = (type: string) => {
    switch(type) {
      case 'pdf': return <FileText className="h-5 w-5 text-red-500" />;
      case 'excel': return <File className="h-5 w-5 text-green-500" />;
      case 'cad': return <File className="h-5 w-5 text-blue-500" />;
      case 'archive': return <File className="h-5 w-5 text-purple-500" />;
      case 'image': return <Image className="h-5 w-5 text-yellow-500" />;
      default: return <File className="h-5 w-5 text-gray-500" />;
    }
  };

  const getMilestoneIcon = (status: string) => {
    switch(status) {
      case 'completed': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'active': return <Clock className="h-5 w-5 text-blue-500" />;
      case 'pending': return <AlertCircle className="h-5 w-5 text-gray-400" />;
      default: return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/portal" className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors">
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Projects</span>
              </Link>
              <span className="text-gray-300">|</span>
              <h1 className="text-lg font-semibold text-gray-900">{project.name}</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Bell className="h-6 w-6" />
                <span className="absolute top-0 right-0 block h-2 w-2 bg-red-500 rounded-full"></span>
              </button>
              <Link href="/" className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors">
                <Home className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Project Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm p-6 mb-6"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <h2 className="text-2xl font-bold text-gray-900">{project.name}</h2>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  project.status === 'active' ? 'bg-green-100 text-green-800' :
                  project.status === 'review' ? 'bg-blue-100 text-blue-800' :
                  project.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {project.statusLabel}
                </span>
              </div>
              <p className="text-gray-600">{project.type}</p>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                <span className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4" />
                  <span>{project.location}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>Due: {project.dueDate}</span>
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Project Budget</p>
              <p className="text-2xl font-bold text-gray-900">{project.budget}</p>
              <p className="text-sm text-gray-600 mt-1">Spent: {project.spent}</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Overall Progress</span>
              <span className="text-sm font-medium text-gray-900">{project.progress}%</span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${project.progress}%` }}
                transition={{ duration: 1 }}
                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
              />
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {['overview', 'documents', 'communication', 'milestones', 'activity'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Project Details */}
              <div className="md:col-span-2 bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Start Date</p>
                    <p className="font-medium">{project.startDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Due Date</p>
                    <p className="font-medium">{project.dueDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Budget</p>
                    <p className="font-medium">{project.budget}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Spent to Date</p>
                    <p className="font-medium">{project.spent}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium">{project.location}</p>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t">
                  <h4 className="font-semibold text-gray-900 mb-3">Team Contacts</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-primary-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{project.contractor.name}</p>
                          <p className="text-sm text-gray-500">{project.contractor.role}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-400 hover:text-primary-600">
                          <Mail className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-primary-600">
                          <Phone className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {project.activities.slice(0, 4).map(activity => (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className="h-2 w-2 bg-primary-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">
                          <span className="font-medium">{activity.action}</span>
                          {activity.detail && (
                            <span className="text-gray-600"> - {activity.detail}</span>
                          )}
                        </p>
                        <p className="text-xs text-gray-500">{activity.user} • {activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="mt-4 text-sm text-primary-600 hover:text-primary-700 font-medium">
                  View All Activity →
                </button>
              </div>
            </div>
          )}

          {/* Documents Tab */}
          {activeTab === 'documents' && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Project Documents</h3>
                <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2">
                  <Upload className="h-4 w-4" />
                  <span>Upload Document</span>
                </button>
              </div>

              <div className="space-y-2">
                {project.documents.map(doc => (
                  <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      {getFileIcon(doc.type)}
                      <div>
                        <p className="font-medium text-gray-900">{doc.name}</p>
                        <p className="text-sm text-gray-500">
                          {doc.size} • {doc.category} • Uploaded by {doc.uploadedBy} on {doc.date}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-400 hover:text-primary-600 transition-colors">
                        <Download className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-primary-600 transition-colors">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(doc.id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Communication Tab */}
          {activeTab === 'communication' && (
            <div className="bg-white rounded-lg shadow-sm">
              <div className="h-[500px] flex flex-col">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {project.messages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.isClient ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] ${msg.isClient ? 'order-2' : ''}`}>
                        <div className={`rounded-lg p-4 ${
                          msg.isClient ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-900'
                        }`}>
                          <p className="text-sm font-medium mb-1">{msg.sender} • {msg.role}</p>
                          <p>{msg.message}</p>
                          <p className={`text-xs mt-2 ${msg.isClient ? 'text-primary-100' : 'text-gray-500'}`}>
                            {msg.timestamp}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="border-t p-4">
                  <div className="flex items-end space-x-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <Paperclip className="h-5 w-5" />
                    </button>
                    <div className="flex-1">
                      <textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="w-full px-4 py-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
                        rows={2}
                      />
                    </div>
                    <button className="bg-primary-600 text-white p-2 rounded-lg hover:bg-primary-700 transition-colors">
                      <Send className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Milestones Tab */}
          {activeTab === 'milestones' && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Project Milestones</h3>
              <div className="space-y-4">
                {project.milestones.map((milestone, index) => (
                  <div key={milestone.id} className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {getMilestoneIcon(milestone.status)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className={`font-medium ${
                            milestone.status === 'completed' ? 'text-gray-500 line-through' : 'text-gray-900'
                          }`}>
                            {milestone.name}
                          </p>
                          <p className="text-sm text-gray-500">Target: {milestone.date}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          milestone.status === 'completed' ? 'bg-green-100 text-green-800' :
                          milestone.status === 'active' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {milestone.status}
                        </span>
                      </div>
                    </div>
                    {index < project.milestones.length - 1 && (
                      <div className="absolute left-7 top-10 h-full w-px bg-gray-200"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Activity Tab */}
          {activeTab === 'activity' && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Project Activity Log</h3>
              <div className="space-y-4">
                {project.activities.map(activity => (
                  <div key={activity.id} className="flex items-start space-x-3 pb-4 border-b last:border-0">
                    <Activity className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-gray-900">
                        <span className="font-medium">{activity.user}</span>
                        {' '}
                        <span className="text-gray-600">{activity.action.toLowerCase()}</span>
                        {activity.detail && (
                          <>
                            {': '}
                            <span className="font-medium text-gray-900">{activity.detail}</span>
                          </>
                        )}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </main>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 max-w-sm w-full mx-4"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Document?</h3>
            <p className="text-gray-600 mb-4">Are you sure you want to delete this document? This action cannot be undone.</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 text-gray-700 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Handle delete
                  setShowDeleteConfirm(null);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}