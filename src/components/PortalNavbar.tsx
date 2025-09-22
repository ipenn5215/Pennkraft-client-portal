'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import {
  Home,
  Briefcase,
  FileText,
  MessageSquare,
  DollarSign,
  Bell,
  User,
  LogOut,
  Settings,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';

export default function PortalNavbar() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Use session data or fallback
  const user = session?.user || {
    name: 'User',
    email: 'user@example.com',
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/login' });
  };

  // Determine active page based on pathname
  const getActiveSection = () => {
    if (pathname === '/portal') return 'dashboard';
    if (pathname.startsWith('/portal/project')) return 'projects';
    if (pathname.startsWith('/portal/documents')) return 'documents';
    if (pathname.startsWith('/portal/messages')) return 'messages';
    if (pathname.startsWith('/portal/billing')) return 'billing';
    return 'dashboard';
  };

  const activeSection = getActiveSection();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', href: '/portal', icon: Home },
    { id: 'projects', label: 'Projects', href: '/portal#projects', icon: Briefcase },
    { id: 'documents', label: 'Documents', href: '/portal/documents', icon: FileText },
    { id: 'messages', label: 'Messages', href: '/portal/messages', icon: MessageSquare },
    { id: 'billing', label: 'Billing', href: '/portal/billing', icon: DollarSign },
  ];

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            {/* Logo/Brand with back navigation when in sub-pages */}
            <div className="flex items-center space-x-4">
              {pathname !== '/portal' && (
                <Link
                  href="/portal"
                  className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors"
                  title="Back to Dashboard"
                >
                  <ArrowLeft className="h-5 w-5" />
                  <span className="hidden sm:inline">Back</span>
                </Link>
              )}
              <Link href="/" className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors">
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">P</span>
                  </div>
                  <span className="font-semibold text-lg hidden sm:inline">Pennkraft</span>
                </div>
              </Link>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-6">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-all ${
                      activeSection === item.id
                        ? 'text-primary-600 bg-primary-50 font-medium'
                        : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right side - Notifications and User Menu */}
          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Bell className="h-6 w-6" />
              <span className="absolute top-0 right-0 block h-2 w-2 bg-red-500 rounded-full animate-pulse"></span>
            </button>

            {/* User Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-3 text-gray-700 hover:text-primary-600 transition-colors"
              >
                <div className="h-8 w-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {user.name?.charAt(0) || 'U'}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium">{user.name || 'User'}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                <ChevronRight className={`h-4 w-4 transition-transform ${showUserMenu ? 'rotate-90' : ''}`} />
              </button>

              {/* User Dropdown Menu */}
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border overflow-hidden"
                >
                  <div className="p-4 border-b bg-gray-50">
                    <p className="text-sm font-medium text-gray-900">{user.name || 'User'}</p>
                    <p className="text-xs text-gray-500">{user.email || ''}</p>
                  </div>
                  <div className="py-2">
                    <Link
                      href="/portal/profile"
                      className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <User className="h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                    <Link
                      href="/portal/settings"
                      className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                    <hr className="my-2" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t">
        <div className="flex overflow-x-auto scrollbar-hide px-4 py-2 space-x-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg whitespace-nowrap transition-all ${
                  activeSection === item.id
                    ? 'text-primary-600 bg-primary-50 font-medium'
                    : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="text-sm">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}