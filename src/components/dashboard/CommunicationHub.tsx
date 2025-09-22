'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MessageSquare,
  Send,
  Paperclip,
  Mail,
  Phone,
  User,
  Clock,
  CheckCircle,
  Circle
} from 'lucide-react';
import { Communication } from '@/lib/projects';
import { formatDate } from '@/lib/utils';

interface CommunicationHubProps {
  communications: Communication[];
  projectId: string;
  currentUser: string;
  onSendMessage?: (message: { subject: string; message: string; attachments?: File[] }) => void;
  readonly?: boolean;
}

export const CommunicationHub: React.FC<CommunicationHubProps> = ({
  communications,
  projectId,
  currentUser,
  onSendMessage,
  readonly = false
}) => {
  const [isComposing, setIsComposing] = useState(false);
  const [newMessage, setNewMessage] = useState({
    subject: '',
    message: ''
  });
  const [attachments, setAttachments] = useState<File[]>([]);

  const sortedCommunications = [...communications].sort(
    (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
  );

  const handleSendMessage = () => {
    if (!newMessage.subject.trim() || !newMessage.message.trim()) return;

    onSendMessage?.({
      ...newMessage,
      attachments: attachments.length > 0 ? attachments : undefined
    });

    setNewMessage({ subject: '', message: '' });
    setAttachments([]);
    setIsComposing(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(Array.from(e.target.files));
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Compose Message */}
      {!readonly && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-effect rounded-lg p-6 border border-white/20"
        >
          {!isComposing ? (
            <button
              onClick={() => setIsComposing(true)}
              className="w-full flex items-center justify-center space-x-2 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-400 hover:bg-primary-50 transition-colors"
            >
              <MessageSquare className="h-5 w-5 text-gray-400" />
              <span className="text-gray-600">Send a message</span>
            </button>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">New Message</h3>
                <button
                  onClick={() => {
                    setIsComposing(false);
                    setNewMessage({ subject: '', message: '' });
                    setAttachments([]);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  Cancel
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  value={newMessage.subject}
                  onChange={(e) => setNewMessage(prev => ({ ...prev, subject: e.target.value }))}
                  placeholder="Enter message subject..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  value={newMessage.message}
                  onChange={(e) => setNewMessage(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Type your message..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              {/* Attachments */}
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <label
                    htmlFor="message-attachments"
                    className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm cursor-pointer hover:bg-gray-50"
                  >
                    <Paperclip className="h-4 w-4 mr-1" />
                    Attach Files
                  </label>
                  <input
                    id="message-attachments"
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                </div>

                {attachments.length > 0 && (
                  <div className="space-y-1">
                    {attachments.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm"
                      >
                        <span className="truncate">
                          {file.name} ({formatFileSize(file.size)})
                        </span>
                        <button
                          onClick={() => removeAttachment(index)}
                          className="text-red-500 hover:text-red-700 ml-2"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.subject.trim() || !newMessage.message.trim()}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send Message
                </button>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Messages List */}
      <div className="space-y-4">
        {sortedCommunications.map((comm, index) => (
          <motion.div
            key={comm.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`glass-effect rounded-lg p-6 border ${
              comm.read ? 'border-white/20' : 'border-blue-200 bg-blue-50/30'
            }`}
          >
            {/* Message Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="font-semibold text-gray-900">{comm.from}</h4>
                    {!comm.read && (
                      <Circle className="h-3 w-3 text-blue-500 fill-current" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600">to {comm.to}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Clock className="h-4 w-4" />
                  <span>{formatDate(comm.timestamp)}</span>
                </div>
              </div>
            </div>

            {/* Subject */}
            <h5 className="font-medium text-gray-900 mb-2">{comm.subject}</h5>

            {/* Message Content */}
            <div className="prose prose-sm max-w-none">
              <p className="text-gray-700 whitespace-pre-line">{comm.message}</p>
            </div>

            {/* Attachments */}
            {comm.attachments && comm.attachments.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-600 mb-2">Attachments:</div>
                <div className="space-y-1">
                  {comm.attachments.map((attachment, idx) => (
                    <div key={idx} className="flex items-center space-x-2 text-sm">
                      <Paperclip className="h-4 w-4 text-gray-400" />
                      <span className="text-blue-600 hover:text-blue-800 cursor-pointer">
                        {attachment}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="flex items-center space-x-4 mt-4 pt-4 border-t border-gray-200">
              <button className="text-sm text-gray-600 hover:text-primary-600 flex items-center space-x-1">
                <Mail className="h-4 w-4" />
                <span>Reply</span>
              </button>
              {comm.from !== currentUser && (
                <button className="text-sm text-gray-600 hover:text-primary-600 flex items-center space-x-1">
                  <Phone className="h-4 w-4" />
                  <span>Call</span>
                </button>
              )}
              {!comm.read && (
                <button className="text-sm text-gray-600 hover:text-primary-600 flex items-center space-x-1">
                  <CheckCircle className="h-4 w-4" />
                  <span>Mark as Read</span>
                </button>
              )}
            </div>
          </motion.div>
        ))}

        {sortedCommunications.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <MessageSquare className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>No messages yet</p>
            <p className="text-sm">Start a conversation with your project team</p>
          </div>
        )}
      </div>
    </div>
  );
};