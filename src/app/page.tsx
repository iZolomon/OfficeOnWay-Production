"use client";

import React from 'react';
import Link from 'next/link';
import { FaCar, FaUserTie, FaFileContract, FaFileInvoiceDollar, FaFileAlt, FaBell } from 'react-icons/fa';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-700 text-white">
      <header className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <FaCar className="text-3xl mr-2" />
            <h1 className="text-2xl font-bold">OfficeOnWay</h1>
          </div>
          <div>
            <Link href="/auth/login" className="bg-white text-blue-700 px-4 py-2 rounded-md font-medium hover:bg-blue-100 transition-colors">
              تسجيل الدخول
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">نظام إدارة مكاتب الأجرة والنقل الخاص</h2>
          <p className="text-xl max-w-3xl mx-auto">
            منصة متكاملة لإدارة مكاتب الأجرة والنقل الخاص والتوصيل، تساعدك على إدارة السائقين والمركبات والعقود والوثائق والمحاسبة بكل سهولة.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-white bg-opacity-10 p-6 rounded-lg backdrop-blur-sm">
            <div className="text-blue-300 text-4xl mb-4">
              <FaUserTie />
            </div>
            <h3 className="text-xl font-bold mb-2">إدارة السائقين</h3>
            <p>سجل بيانات السائقين وتتبع حالتهم ووثائقهم وأدائهم بسهولة.</p>
          </div>
          
          <div className="bg-white bg-opacity-10 p-6 rounded-lg backdrop-blur-sm">
            <div className="text-blue-300 text-4xl mb-4">
              <FaCar />
            </div>
            <h3 className="text-xl font-bold mb-2">إدارة المركبات</h3>
            <p>سجل بيانات المركبات وتتبع حالتها وصيانتها ووثائقها.</p>
          </div>
          
          <div className="bg-white bg-opacity-10 p-6 rounded-lg backdrop-blur-sm">
            <div className="text-blue-300 text-4xl mb-4">
              <FaFileContract />
            </div>
            <h3 className="text-xl font-bold mb-2">إدارة العقود</h3>
            <p>أنشئ وأدر عقود العملاء والسائقين بسهولة مع تنبيهات تلقائية عند الانتهاء.</p>
          </div>
          
          <div className="bg-white bg-opacity-10 p-6 rounded-lg backdrop-blur-sm">
            <div className="text-blue-300 text-4xl mb-4">
              <FaFileInvoiceDollar />
            </div>
            <h3 className="text-xl font-bold mb-2">إدارة المحاسبة</h3>
            <p>تتبع المدفوعات والإيرادات والمصروفات وإنشاء تقارير مالية.</p>
          </div>
          
          <div className="bg-white bg-opacity-10 p-6 rounded-lg backdrop-blur-sm">
            <div className="text-blue-300 text-4xl mb-4">
              <FaFileAlt />
            </div>
            <h3 className="text-xl font-bold mb-2">إدارة الوثائق</h3>
            <p>حفظ وتنظيم وثائق المكتب والسائقين والمركبات مع تنبيهات انتهاء الصلاحية.</p>
          </div>
          
          <div className="bg-white bg-opacity-10 p-6 rounded-lg backdrop-blur-sm">
            <div className="text-blue-300 text-4xl mb-4">
              <FaBell />
            </div>
            <h3 className="text-xl font-bold mb-2">نظام التنبيهات</h3>
            <p>تنبيهات تلقائية لانتهاء الوثائق والعقود ومواعيد الصيانة والمدفوعات.</p>
          </div>
        </div>

        <div className="text-center">
          <Link href="/auth/login" className="bg-white text-blue-700 px-6 py-3 rounded-md font-medium text-lg hover:bg-blue-100 transition-colors">
            ابدأ الآن
          </Link>
        </div>
      </main>

      <footer className="bg-blue-900 py-8 mt-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p>&copy; {new Date().getFullYear()} OfficeOnWay - جميع الحقوق محفوظة</p>
            </div>
            <div className="flex space-x-4 rtl:space-x-reverse">
              <Link href="/terms" className="hover:text-blue-300 transition-colors">
                شروط الاستخدام
              </Link>
              <Link href="/privacy" className="hover:text-blue-300 transition-colors">
                سياسة الخصوصية
              </Link>
              <Link href="/dashboard/help" className="hover:text-blue-300 transition-colors">
                المساعدة والدعم
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
