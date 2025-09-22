'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Paperclip,
  Image,
  File,
  AlertCircle,
  CheckCircle,
  Clock,
  User,
  Mail,
  Bell,
  MessageSquare,
  Phone,
  Video,
  MoreVertical,
  Search,
  Star,
  Archive,
  Trash2,
  Reply,
  Forward,
  Download,
  X,
  ChevronDown,
  Info
} from 'lucide-react';

interface Message {
  id: string;
  conversationId: string;
  sender: {
    id: string;
    name: string;
    email: string;
    role: 'client' | 'admin' | 'team';
    avatar?: string;
  };
  content: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  attachments?: {
    id: string;
    name: string;
    type: string;
    size: string;
    url?: string;
  }[];
  isStatusUpdate?: boolean;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  replyTo?: string;
}

interface Conversation {
  id: string;
  projectId: string;
  projectName: string;
  participants: {
    id: string;
    name: string;
    role: string;
  }[];
  lastMessage?: Message;
  unreadCount: number;
  isPinned?: boolean;
  isArchived?: boolean;
}

interface MessagingSystemProps {
  projectId: string;
  currentUserId: string;
  currentUserRole: 'client' | 'admin' | 'team';
  onSendMessage?: (message: Partial<Message>) => void;
  onEmailNotification?: (recipient: string, message: Message) => void;
  onStatusUpdateRequest?: (projectId: string) => void;
}

export default function MessagingSystem({
  projectId,
  currentUserId,
  currentUserRole,
  onSendMessage,
  onEmailNotification,
  onStatusUpdateRequest
}: MessagingSystemProps) {
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: '1',
      projectId,
      projectName: 'Downtown Office Building',
      participants: [
        { id: '1', name: 'John Doe', role: 'Client' },
        { id: '2', name: 'Mike Johnson', role: 'Project Manager' }
      ],
      unreadCount: 2,
      isPinned: true
    }
  ]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      conversationId: '1',
      sender: {
        id: '2',
        name: 'Mike Johnson',
        email: 'mike@pennkraft.com',
        role: 'admin'
      },
      content: 'Project is progressing well. We\'ve completed the first phase of construction and are on track to meet the deadline.',
      timestamp: '2024-11-14 09:30 AM',
      status: 'read'
    },
    {
      id: '2',
      conversationId: '1',
      sender: {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'client'
      },
      content: 'Great to hear! Can you provide an update on the material deliveries for phase 2?',
      timestamp: '2024-11-14 10:15 AM',
      status: 'read',
      isStatusUpdate: true
    },
    {
      id: '3',
      conversationId: '1',
      sender: {
        id: '2',
        name: 'Mike Johnson',
        email: 'mike@pennkraft.com',
        role: 'admin'
      },
      content: 'Materials for phase 2 are scheduled to arrive next Monday. I\'ll send you the delivery confirmation once received.',
      timestamp: '2024-11-14 11:00 AM',
      status: 'delivered'
    }
  ]);

  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(conversations[0]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [showAttachmentPreview, setShowAttachmentPreview] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [messageFilter, setMessageFilter] = useState<'all' | 'unread' | 'starred'>('all');
  const [showStatusUpdatePrompt, setShowStatusUpdatePrompt] = useState(false);
  const [messagePriority, setMessagePriority] = useState<Message['priority']>('normal');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() && attachments.length === 0) return;

    const message: Message = {
      id: Math.random().toString(36).substr(2, 9),
      conversationId: selectedConversation?.id || '1',
      sender: {
        id: currentUserId,
        name: currentUserRole === 'client' ? 'John Doe' : 'Mike Johnson',
        email: currentUserRole === 'client' ? 'john@example.com' : 'mike@pennkraft.com',
        role: currentUserRole
      },
      content: newMessage,
      timestamp: new Date().toLocaleString(),
      status: 'sent',
      priority: messagePriority,
      attachments: attachments.map(file => ({
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: file.type,
        size: formatFileSize(file.size)
      }))
    };

    setMessages([...messages, message]);
    setNewMessage('');
    setAttachments([]);
    setMessagePriority('normal');

    // Send email notification if high priority or status update
    if ((messagePriority === 'high' || messagePriority === 'urgent' || showStatusUpdatePrompt) && onEmailNotification) {
      const adminEmail = 'admin@pennkraft.com';
      onEmailNotification(adminEmail, message);
    }

    if (onSendMessage) {
      onSendMessage(message);
    }

    // Update conversation
    if (selectedConversation) {
      const updatedConversation = {
        ...selectedConversation,
        lastMessage: message
      };
      setConversations(conversations.map(c =>
        c.id === selectedConversation.id ? updatedConversation : c
      ));
    }
  };

  const handleStatusUpdateRequest = () => {
    setShowStatusUpdatePrompt(true);
    setMessagePriority('high');
    setNewMessage('I would like to request a status update on the project. Please provide details on current progress, any challenges, and expected timeline for completion.');

    if (onStatusUpdateRequest) {
      onStatusUpdateRequest(projectId);
    }
  };

  const handleFileAttachment = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments([...attachments, ...files]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    if (bytes < 1024 * 1024 * 1024) return (bytes / 1024 / 1024).toFixed(1) + ' MB';
    return (bytes / 1024 / 1024 / 1024).toFixed(1) + ' GB';
  };

  const getStatusIcon = (status: Message['status']) => {
    switch(status) {
      case 'sent': return <Clock className="h-3 w-3 text-gray-400" />;
      case 'delivered': return <CheckCircle className="h-3 w-3 text-gray-500" />;
      case 'read': return <CheckCircle className="h-3 w-3 text-blue-500" />;
    }
  };

  const getPriorityBadge = (priority?: Message['priority']) => {
    if (!priority || priority === 'normal') return null;

    const colors = {
      low: 'bg-gray-100 text-gray-600',
      high: 'bg-orange-100 text-orange-600',
      urgent: 'bg-red-100 text-red-600'
    };

    return (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors[priority as keyof typeof colors]}`}>
        {priority}
      </span>
    );
  };

  const filteredMessages = messages.filter(msg =>
    msg.conversationId === selectedConversation?.id &&
    msg.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-[600px] bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Conversations Sidebar */}
      <div className="w-80 border-r bg-gray-50">
        <div className="p-4 border-b bg-white">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div className="flex items-center space-x-2 mt-3">
            <button
              onClick={() => setMessageFilter('all')}
              className={`px-3 py-1 text-xs rounded-full ${
                messageFilter === 'all' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setMessageFilter('unread')}
              className={`px-3 py-1 text-xs rounded-full ${
                messageFilter === 'unread' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              Unread
            </button>
            <button
              onClick={() => setMessageFilter('starred')}
              className={`px-3 py-1 text-xs rounded-full ${
                messageFilter === 'starred' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              Starred
            </button>
          </div>
        </div>

        <div className="overflow-y-auto">
          {conversations.map(conversation => (
            <button
              key={conversation.id}
              onClick={() => setSelectedConversation(conversation)}
              className={`w-full p-4 text-left hover:bg-gray-100 transition-colors ${
                selectedConversation?.id === conversation.id ? 'bg-white border-l-4 border-primary-500' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-medium text-gray-900 text-sm">{conversation.projectName}</h3>
                    {conversation.isPinned && <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {conversation.participants.map(p => p.name).join(', ')}
                  </p>
                  {conversation.lastMessage && (
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                      {conversation.lastMessage.content}
                    </p>
                  )}
                </div>
                {conversation.unreadCount > 0 && (
                  <span className="bg-primary-600 text-white text-xs px-2 py-1 rounded-full">
                    {conversation.unreadCount}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between bg-white">
          <div className="flex items-center space-x-3">
            <div>
              <h2 className="font-semibold text-gray-900">{selectedConversation?.projectName}</h2>
              <p className="text-sm text-gray-500">
                {selectedConversation?.participants.map(p => p.name).join(', ')}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Phone className="h-5 w-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Video className="h-5 w-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Info className="h-5 w-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <MoreVertical className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {showStatusUpdatePrompt && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <div className="flex items-start space-x-2">
                <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm text-blue-900 font-medium">Status Update Requested</p>
                  <p className="text-sm text-blue-700 mt-1">
                    An email notification will be sent to the project manager.
                  </p>
                </div>
              </div>
            </div>
          )}

          <AnimatePresence>
            {filteredMessages.map((message, index) => {
              const isOwnMessage = message.sender.role === currentUserRole;

              return (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[70%] ${isOwnMessage ? 'order-2' : ''}`}>
                    <div className="flex items-end space-x-2">
                      {!isOwnMessage && (
                        <div className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-gray-600" />
                        </div>
                      )}
                      <div>
                        <div className={`rounded-lg p-3 ${
                          isOwnMessage ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-900'
                        }`}>
                          <div className="flex items-center space-x-2 mb-1">
                            <p className={`text-xs font-medium ${
                              isOwnMessage ? 'text-primary-100' : 'text-gray-600'
                            }`}>
                              {message.sender.name} • {message.sender.role}
                            </p>
                            {getPriorityBadge(message.priority)}
                            {message.isStatusUpdate && (
                              <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full text-xs">
                                Status Update
                              </span>
                            )}
                          </div>
                          <p className="text-sm">{message.content}</p>

                          {/* Attachments */}
                          {message.attachments && message.attachments.length > 0 && (
                            <div className="mt-2 space-y-1">
                              {message.attachments.map(attachment => (
                                <div
                                  key={attachment.id}
                                  className={`flex items-center space-x-2 p-2 rounded ${
                                    isOwnMessage ? 'bg-primary-700' : 'bg-white'
                                  }`}
                                >
                                  <File className="h-4 w-4" />
                                  <span className="text-xs flex-1">{attachment.name}</span>
                                  <span className="text-xs opacity-70">{attachment.size}</span>
                                  <button className={`${
                                    isOwnMessage ? 'hover:text-primary-200' : 'hover:text-primary-600'
                                  }`}>
                                    <Download className="h-3 w-3" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 mt-1 px-1">
                          <p className={`text-xs ${
                            isOwnMessage ? 'text-gray-500' : 'text-gray-400'
                          }`}>
                            {message.timestamp}
                          </p>
                          {isOwnMessage && getStatusIcon(message.status)}
                        </div>
                      </div>
                      {isOwnMessage && (
                        <div className="h-8 w-8 bg-primary-600 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {isTyping && (
            <div className="flex items-center space-x-2 text-gray-500">
              <div className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-gray-600" />
              </div>
              <div className="bg-gray-100 rounded-lg px-3 py-2">
                <div className="flex space-x-1">
                  <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        <div className="px-4 py-2 border-t bg-gray-50">
          <div className="flex items-center space-x-2">
            <button
              onClick={handleStatusUpdateRequest}
              className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-medium hover:bg-blue-200 transition-colors"
            >
              Request Status Update
            </button>
            <select
              value={messagePriority}
              onChange={(e) => setMessagePriority(e.target.value as Message['priority'])}
              className="px-3 py-1 border rounded-full text-xs focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="low">Low Priority</option>
              <option value="normal">Normal Priority</option>
              <option value="high">High Priority</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
        </div>

        {/* Attachment Preview */}
        {attachments.length > 0 && (
          <div className="px-4 py-2 border-t bg-gray-50">
            <div className="flex items-center space-x-2">
              {attachments.map((file, index) => (
                <div key={index} className="flex items-center space-x-1 bg-white px-2 py-1 rounded border">
                  <File className="h-3 w-3 text-gray-400" />
                  <span className="text-xs text-gray-600">{file.name}</span>
                  <button
                    onClick={() => removeAttachment(index)}
                    className="text-gray-400 hover:text-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="p-4 border-t bg-white">
          <div className="flex items-end space-x-2">
            <input
              type="file"
              ref={fileInputRef}
              multiple
              className="hidden"
              onChange={handleFileAttachment}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Paperclip className="h-5 w-5" />
            </button>
            <div className="flex-1">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onFocus={() => setIsTyping(true)}
                onBlur={() => setIsTyping(false)}
                placeholder="Type your message..."
                className="w-full px-4 py-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
                rows={2}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim() && attachments.length === 0}
              className="bg-primary-600 text-white p-2 rounded-lg hover:bg-primary-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Press Enter to send • Shift + Enter for new line • High priority messages trigger email notifications
          </p>
        </div>
      </div>
    </div>
  );
}