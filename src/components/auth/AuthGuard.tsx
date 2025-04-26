"use client";

import { ReactNode, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

interface AuthGuardProps {
  children: ReactNode;
  requireAuth?: boolean;
}

// مكون حماية المصادقة
export const AuthGuard = ({ children, requireAuth = true }: AuthGuardProps) => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // تجاهل التحقق أثناء تحميل حالة المصادقة
    if (loading) return;

    // إذا كان المستخدم غير مصادق عليه وتتطلب الصفحة المصادقة
    if (!isAuthenticated && requireAuth) {
      // حفظ المسار الحالي للعودة إليه بعد تسجيل الدخول
      if (pathname !== '/auth/login') {
        sessionStorage.setItem('redirectAfterLogin', pathname);
        router.push('/auth/login');
      }
    }

    // إذا كان المستخدم مصادق عليه وكان في صفحة تسجيل الدخول
    if (isAuthenticated && pathname === '/auth/login') {
      // التحقق من وجود مسار للعودة إليه
      const redirectPath = sessionStorage.getItem('redirectAfterLogin') || '/dashboard';
      sessionStorage.removeItem('redirectAfterLogin');
      router.push(redirectPath);
    }
  }, [isAuthenticated, loading, pathname, requireAuth, router]);

  // عرض شاشة التحميل أثناء التحقق من حالة المصادقة
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // إذا كان المستخدم غير مصادق عليه وتتطلب الصفحة المصادقة، لا تعرض المحتوى
  if (!isAuthenticated && requireAuth) {
    return null;
  }

  // إذا كان المستخدم مصادق عليه وكان في صفحة تسجيل الدخول، لا تعرض المحتوى
  if (isAuthenticated && pathname === '/auth/login') {
    return null;
  }

  // في الحالات الأخرى، عرض المحتوى
  return <>{children}</>;
};
