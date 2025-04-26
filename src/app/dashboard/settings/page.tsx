"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

export default function SettingsPage() {
  const { user } = useAuth();
  const [selectedOfficeId, setSelectedOfficeId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'general' | 'subscription' | 'backup' | 'security'>('general');
  
  // استخدام المكتب المحدد من URL أو localStorage
  useEffect(() => {
    const getSelectedOffice = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const officeId = urlParams.get('office');
      
      if (officeId) {
        setSelectedOfficeId(officeId);
        localStorage.setItem('selectedOfficeId', officeId);
      } else {
        const savedOfficeId = localStorage.getItem('selectedOfficeId');
        if (savedOfficeId) {
          setSelectedOfficeId(savedOfficeId);
        }
      }
    };
    
    getSelectedOffice();
    setLoading(false);
  }, []);

  return (
    <div className="h-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">إعدادات النظام</h1>
        <p className="text-gray-600">إدارة إعدادات المكتب والنظام</p>
      </div>
      
      {/* تبويبات الإعدادات */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="border-b">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('general')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'general'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              إعدادات عامة
            </button>
            <button
              onClick={() => setActiveTab('subscription')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'subscription'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              الاشتراك والحدود
            </button>
            <button
              onClick={() => setActiveTab('backup')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'backup'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              النسخ الاحتياطي
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'security'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              الأمان والخصوصية
            </button>
          </nav>
        </div>
        
        <div className="p-6">
          {/* إعدادات عامة */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-medium text-gray-900">معلومات المكتب</h2>
                <p className="mt-1 text-sm text-gray-500">
                  تعديل المعلومات الأساسية للمكتب
                </p>
                <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                  <div>
                    <label htmlFor="office-name" className="block text-sm font-medium text-gray-700">
                      اسم المكتب
                    </label>
                    <input
                      type="text"
                      id="office-name"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="اسم المكتب"
                    />
                  </div>
                  <div>
                    <label htmlFor="office-phone" className="block text-sm font-medium text-gray-700">
                      رقم الهاتف
                    </label>
                    <input
                      type="tel"
                      id="office-phone"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="رقم الهاتف"
                    />
                  </div>
                  <div>
                    <label htmlFor="office-email" className="block text-sm font-medium text-gray-700">
                      البريد الإلكتروني
                    </label>
                    <input
                      type="email"
                      id="office-email"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="البريد الإلكتروني"
                    />
                  </div>
                  <div>
                    <label htmlFor="office-address" className="block text-sm font-medium text-gray-700">
                      العنوان
                    </label>
                    <input
                      type="text"
                      id="office-address"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="العنوان"
                    />
                  </div>
                </div>
              </div>
              
              <div className="pt-5 border-t border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">إعدادات اللغة والمنطقة</h2>
                <p className="mt-1 text-sm text-gray-500">
                  تخصيص إعدادات اللغة والمنطقة الزمنية
                </p>
                <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                  <div>
                    <label htmlFor="language" className="block text-sm font-medium text-gray-700">
                      اللغة
                    </label>
                    <select
                      id="language"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <option value="ar">العربية</option>
                      <option value="en">English</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="timezone" className="block text-sm font-medium text-gray-700">
                      المنطقة الزمنية
                    </label>
                    <select
                      id="timezone"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <option value="Asia/Riyadh">الرياض (GMT+3)</option>
                      <option value="Asia/Dubai">دبي (GMT+4)</option>
                      <option value="Asia/Kuwait">الكويت (GMT+3)</option>
                      <option value="Africa/Cairo">القاهرة (GMT+2)</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="pt-5 border-t border-gray-200">
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="mr-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    حفظ التغييرات
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* إعدادات الاشتراك والحدود */}
          {activeTab === 'subscription' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-medium text-gray-900">معلومات الاشتراك</h2>
                <p className="mt-1 text-sm text-gray-500">
                  تفاصيل اشتراكك الحالي وحدود الاستخدام
                </p>
                
                <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-md font-medium text-blue-800">الباقة الأساسية</h3>
                      <p className="text-sm text-blue-700 mt-1">تاريخ التجديد: 24 أبريل 2026</p>
                    </div>
                    <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      نشط
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="pt-5 border-t border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">حدود الاستخدام</h2>
                <p className="mt-1 text-sm text-gray-500">
                  الحدود القصوى المسموح بها في اشتراكك الحالي
                </p>
                
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="bg-white overflow-hidden shadow rounded-lg border">
                    <div className="px-4 py-5 sm:p-6">
                      <dt className="text-sm font-medium text-gray-500 truncate">السائقين والموظفين</dt>
                      <dd className="mt-1 text-3xl font-semibold text-gray-900">
                        <span className="text-blue-600">12</span> / 35
                      </dd>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '34%' }}></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white overflow-hidden shadow rounded-lg border">
                    <div className="px-4 py-5 sm:p-6">
                      <dt className="text-sm font-medium text-gray-500 truncate">المركبات</dt>
                      <dd className="mt-1 text-3xl font-semibold text-gray-900">
                        <span className="text-blue-600">8</span> / 30
                      </dd>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '27%' }}></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white overflow-hidden shadow rounded-lg border">
                    <div className="px-4 py-5 sm:p-6">
                      <dt className="text-sm font-medium text-gray-500 truncate">العقود النشطة</dt>
                      <dd className="mt-1 text-3xl font-semibold text-gray-900">
                        <span className="text-blue-600">15</span> / غير محدود
                      </dd>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                        <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '100%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="mr-3">
                      <h3 className="text-sm font-medium text-yellow-800">ملاحظة حول حدود الاستخدام</h3>
                      <div className="mt-2 text-sm text-yellow-700">
                        <p>
                          الحد الأقصى المسموح به لكل مكتب هو 30 سيارة و 35 سائق وموظف. في حالة الحاجة إلى زيادة هذه الحدود، يرجى التواصل مع فريق الدعم الفني.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="pt-5 border-t border-gray-200">
                <div className="flex justify-end">
                  <Link
                    href="/dashboard/help/contact"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    طلب ترقية الاشتراك
                  </Link>
                </div>
              </div>
            </div>
          )}
          
          {/* إعدادات النسخ الاحتياطي */}
          {activeTab === 'backup' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-medium text-gray-900">النسخ الاحتياطي للبيانات</h2>
                <p className="mt-1 text-sm text-gray-500">
                  إدارة النسخ الاحتياطي واستعادة البيانات
                </p>
                
                <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="mr-3">
                      <h3 className="text-sm font-medium text-green-800">النسخ الاحتياطي التلقائي مفعل</h3>
                      <div className="mt-2 text-sm text-green-700">
                        <p>
                          يتم عمل نسخ احتياطي لجميع بيانات النظام يومياً بشكل آلي، وتخزن في مكان آمن خارج الخادم الأساسي لضمان إمكانية استعادة البيانات في حالات الطوارئ.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="pt-5 border-t border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">آخر نسخ احتياطي</h2>
                <p className="mt-1 text-sm text-gray-500">
                  سجل النسخ الاحتياطي الأخيرة
                </p>
                
                <div className="mt-4 overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="py-3.5 pr-4 pl-3 text-right text-sm font-semibold text-gray-900">التاريخ</th>
                        <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">الحجم</th>
                        <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">الحالة</th>
                        <th scope="col" className="relative py-3.5 pr-3 pl-4">
                          <span className="sr-only">الإجراءات</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      <tr>
                        <td className="whitespace-nowrap py-4 pr-4 pl-3 text-sm text-gray-900">24 أبريل 2025، 03:00 صباحاً</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">2.4 MB</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">مكتمل</span>
                        </td>
                        <td className="relative whitespace-nowrap py-4 pr-3 pl-4 text-left text-sm font-medium">
                          <button className="text-blue-600 hover:text-blue-900">استعادة</button>
                        </td>
                      </tr>
                      <tr>
                        <td className="whitespace-nowrap py-4 pr-4 pl-3 text-sm text-gray-900">23 أبريل 2025، 03:00 صباحاً</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">2.3 MB</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">مكتمل</span>
                        </td>
                        <td className="relative whitespace-nowrap py-4 pr-3 pl-4 text-left text-sm font-medium">
                          <button className="text-blue-600 hover:text-blue-900">استعادة</button>
                        </td>
                      </tr>
                      <tr>
                        <td className="whitespace-nowrap py-4 pr-4 pl-3 text-sm text-gray-900">22 أبريل 2025، 03:00 صباحاً</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">2.3 MB</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">مكتمل</span>
                        </td>
                        <td className="relative whitespace-nowrap py-4 pr-3 pl-4 text-left text-sm font-medium">
                          <button className="text-blue-600 hover:text-blue-900">استعادة</button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="pt-5 border-t border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">استعادة البيانات</h2>
                <p className="mt-1 text-sm text-gray-500">
                  استعادة البيانات من نسخة احتياطية أو ملف خارجي
                </p>
                
                <div className="mt-4 flex items-center justify-between">
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    استعادة من نسخة احتياطية
                  </button>
                  
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    تصدير البيانات
                  </button>
                </div>
                
                <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="mr-3">
                      <h3 className="text-sm font-medium text-yellow-800">تنبيه</h3>
                      <div className="mt-2 text-sm text-yellow-700">
                        <p>
                          استعادة البيانات ستؤدي إلى استبدال جميع البيانات الحالية. يرجى التأكد من أنك تريد القيام بذلك قبل المتابعة.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* إعدادات الأمان والخصوصية */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-medium text-gray-900">إعدادات الأمان</h2>
                <p className="mt-1 text-sm text-gray-500">
                  إدارة إعدادات الأمان والخصوصية
                </p>
                
                <div className="mt-4 space-y-4">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="two-factor"
                        name="two-factor"
                        type="checkbox"
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="mr-3 text-sm">
                      <label htmlFor="two-factor" className="font-medium text-gray-700">تفعيل المصادقة الثنائية</label>
                      <p className="text-gray-500">تفعيل طبقة إضافية من الأمان عند تسجيل الدخول</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="session-timeout"
                        name="session-timeout"
                        type="checkbox"
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        checked
                      />
                    </div>
                    <div className="mr-3 text-sm">
                      <label htmlFor="session-timeout" className="font-medium text-gray-700">تسجيل الخروج التلقائي</label>
                      <p className="text-gray-500">تسجيل الخروج تلقائياً بعد فترة من عدم النشاط</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="activity-log"
                        name="activity-log"
                        type="checkbox"
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        checked
                      />
                    </div>
                    <div className="mr-3 text-sm">
                      <label htmlFor="activity-log" className="font-medium text-gray-700">تسجيل نشاط المستخدمين</label>
                      <p className="text-gray-500">تسجيل جميع أنشطة المستخدمين في النظام</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="pt-5 border-t border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">تغيير رقم الهاتف</h2>
                <p className="mt-1 text-sm text-gray-500">
                  تحديث رقم الهاتف المستخدم لتسجيل الدخول
                </p>
                
                <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                  <div>
                    <label htmlFor="current-phone" className="block text-sm font-medium text-gray-700">
                      رقم الهاتف الحالي
                    </label>
                    <input
                      type="tel"
                      id="current-phone"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="رقم الهاتف الحالي"
                    />
                  </div>
                  <div>
                    <label htmlFor="new-phone" className="block text-sm font-medium text-gray-700">
                      رقم الهاتف الجديد
                    </label>
                    <input
                      type="tel"
                      id="new-phone"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="رقم الهاتف الجديد"
                    />
                  </div>
                </div>
                
                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    تحديث رقم الهاتف
                  </button>
                </div>
              </div>
              
              <div className="pt-5 border-t border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">سياسة الخصوصية وشروط الاستخدام</h2>
                <p className="mt-1 text-sm text-gray-500">
                  مراجعة سياسة الخصوصية وشروط استخدام النظام
                </p>
                
                <div className="mt-4 flex space-x-4 space-x-reverse">
                  <Link
                    href="/privacy"
                    className="text-blue-600 hover:text-blue-500"
                  >
                    سياسة الخصوصية
                  </Link>
                  <Link
                    href="/terms"
                    className="text-blue-600 hover:text-blue-500"
                  >
                    شروط الاستخدام
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
