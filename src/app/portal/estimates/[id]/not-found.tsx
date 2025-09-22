'use client';

import { motion } from 'framer-motion';
import { FileText, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function EstimateNotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="glass-effect rounded-xl p-12 border border-white/20">
            <FileText className="h-16 w-16 mx-auto text-gray-300 mb-6" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Estimate Not Found</h1>
            <p className="text-gray-600 mb-8">
              The estimate request you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/portal/estimates">
              <button className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Estimates
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}