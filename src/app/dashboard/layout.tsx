import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  const menuItems = [
    { name: 'لوحة التحكم', path: '/dashboard', icon: 'home' },
    { name: 'المكاتب', path: '/dashboard/offices', icon: 'building' },
    { name: 'السائقين', path: '/dashboard/drivers', icon: 'users' },
    { name: 'المركبات', path: '/dashboard/vehicles', icon: 'truck' },
    { name: 'العقود', path: '/dashboard/contracts', icon: 'file-text' },
    { name: 'المدفوعات', path: '/dashboard/payments', icon: 'dollar-sign' },
    { name: 'الوثائق', path: '/dashboard/documents', icon: 'file' },
    { name: 'التنبيهات', path: '/dashboard/alerts', icon: 'bell' },
    { name: 'التحليلات', path: '/dashboard/analytics', icon: 'bar-chart' },
    { name: 'الموظفين', path: '/dashboard/staff', icon: 'users' },
    { name: 'الإعدادات', path: '/dashboard/settings', icon: 'settings' },
    { name: 'المساعدة', path: '/dashboard/help', icon: 'help-circle' },
  ];

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden" dir="rtl">
      {/* Sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64 bg-white border-l">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 bg-blue-600 text-white">
            <span className="text-xl font-semibold">OfficeOnWay</span>
          </div>
          
          {/* Navigation */}
          <div className="flex flex-col flex-grow overflow-y-auto">
            <nav className="flex-1 px-2 py-4 space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100"
                >
                  <span className="mr-3">{/* Icon would go here */}</span>
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>
            
            {/* User info */}
            <div className="p-4 border-t">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                </div>
                <div className="mr-3">
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.phone}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="mt-3 w-full flex items-center px-4 py-2 text-sm text-red-600 rounded-lg hover:bg-red-50"
              >
                <span className="mr-2">{/* Logout icon */}</span>
                <span>تسجيل الخروج</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top header */}
        <header className="flex items-center justify-between h-16 px-6 bg-white border-b">
          {/* Mobile menu button */}
          <button className="md:hidden text-gray-500 focus:outline-none">
            {/* Menu icon */}
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          {/* Header actions */}
          <div className="flex items-center">
            {/* Notifications */}
            <button className="p-2 text-gray-500 rounded-full hover:bg-gray-100 focus:outline-none">
              {/* Bell icon */}
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            
            {/* User dropdown (mobile) */}
            <div className="mr-3 relative md:hidden">
              <button className="flex items-center text-gray-500 focus:outline-none">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  {user?.name?.charAt(0) || 'U'}
                </div>
              </button>
            </div>
          </div>
        </header>
        
        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
