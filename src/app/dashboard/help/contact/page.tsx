import React from 'react';
import Link from 'next/link';

export default function ContactPage() {
  return (
    <div className="h-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">اتصل بنا</h1>
        <p className="text-gray-600">تواصل مع فريق الدعم الفني للحصول على المساعدة</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* معلومات الاتصال */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="p-4 bg-blue-50 border-b">
              <h2 className="text-lg font-medium text-gray-800">معلومات الاتصال</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="mr-4">
                  <h3 className="text-sm font-medium text-gray-800">البريد الإلكتروني</h3>
                  <p className="text-sm text-gray-600">support@officeonway.com</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div className="mr-4">
                  <h3 className="text-sm font-medium text-gray-800">رقم الهاتف</h3>
                  <p className="text-sm text-gray-600">+966 12 345 6789</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                  </svg>
                </div>
                <div className="mr-4">
                  <h3 className="text-sm font-medium text-gray-800">الدردشة المباشرة</h3>
                  <p className="text-sm text-gray-600">متاحة من 8 صباحًا حتى 8 مساءً</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="mr-4">
                  <h3 className="text-sm font-medium text-gray-800">ساعات العمل</h3>
                  <p className="text-sm text-gray-600">الأحد - الخميس: 8 صباحًا - 5 مساءً</p>
                  <p className="text-sm text-gray-600">الجمعة - السبت: مغلق</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden mt-6">
            <div className="p-4 bg-blue-50 border-b">
              <h2 className="text-lg font-medium text-gray-800">روابط سريعة</h2>
            </div>
            <div className="p-4">
              <ul className="divide-y divide-gray-200">
                <li className="py-2">
                  <Link href="/dashboard/help/faq" className="text-blue-600 hover:text-blue-800">
                    الأسئلة الشائعة
                  </Link>
                </li>
                <li className="py-2">
                  <Link href="/dashboard/help/documentation" className="text-blue-600 hover:text-blue-800">
                    دليل المستخدم
                  </Link>
                </li>
                <li className="py-2">
                  <Link href="/dashboard/help/tutorials" className="text-blue-600 hover:text-blue-800">
                    الفيديوهات التعليمية
                  </Link>
                </li>
                <li className="py-2">
                  <Link href="/dashboard/help/support-ticket" className="text-blue-600 hover:text-blue-800">
                    تقديم طلب دعم
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* نموذج الاتصال */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="p-4 bg-blue-50 border-b">
              <h2 className="text-lg font-medium text-gray-800">نموذج الاتصال</h2>
            </div>
            <div className="p-6">
              <form>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      الاسم
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="أدخل اسمك"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      البريد الإلكتروني
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="أدخل بريدك الإلكتروني"
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    الموضوع
                  </label>
                  <input
                    type="text"
                    id="subject"
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="أدخل موضوع الرسالة"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    نوع الاستفسار
                  </label>
                  <select
                    id="category"
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">اختر نوع الاستفسار</option>
                    <option value="technical">مشكلة تقنية</option>
                    <option value="account">استفسار عن الحساب</option>
                    <option value="billing">استفسار عن الفوترة</option>
                    <option value="feature">اقتراح ميزة جديدة</option>
                    <option value="other">أخرى</option>
                  </select>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    الرسالة
                  </label>
                  <textarea
                    id="message"
                    rows={6}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="اكتب رسالتك هنا..."
                    required
                  ></textarea>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="attachment" className="block text-sm font-medium text-gray-700 mb-1">
                    إرفاق ملف (اختياري)
                  </label>
                  <input
                    type="file"
                    id="attachment"
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    يمكنك إرفاق ملف بحجم أقصى 5 ميجابايت (PDF، JPG، PNG)
                  </p>
                </div>
                
                <div className="flex items-center mb-4">
                  <input
                    id="terms"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    required
                  />
                  <label htmlFor="terms" className="mr-2 block text-sm text-gray-700">
                    أوافق على سياسة الخصوصية وشروط الاستخدام
                  </label>
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    إرسال الرسالة
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
