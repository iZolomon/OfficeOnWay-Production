import React from 'react';
import Link from 'next/link';

export default function HelpPage() {
  return (
    <div className="h-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">المساعدة والدعم الفني</h1>
        <p className="text-gray-600">مركز المساعدة لنظام OfficeOnWay لإدارة مكاتب الأجرة والنقل الخاص</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* دليل المستخدم */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h2 className="text-lg font-medium text-gray-800 mb-2">دليل المستخدم</h2>
            <p className="text-gray-600 mb-4">دليل شامل لاستخدام نظام OfficeOnWay وجميع ميزاته وإمكانياته.</p>
            <Link href="/dashboard/help/documentation" className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center">
              تصفح الدليل
              <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
        
        {/* الأسئلة الشائعة */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="p-6">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-lg font-medium text-gray-800 mb-2">الأسئلة الشائعة</h2>
            <p className="text-gray-600 mb-4">إجابات على الأسئلة الأكثر شيوعًا حول استخدام النظام وحل المشكلات الشائعة.</p>
            <Link href="/dashboard/help/faq" className="text-purple-600 hover:text-purple-800 font-medium inline-flex items-center">
              عرض الأسئلة الشائعة
              <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
        
        {/* فيديوهات تعليمية */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="p-6">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-lg font-medium text-gray-800 mb-2">فيديوهات تعليمية</h2>
            <p className="text-gray-600 mb-4">مجموعة من الفيديوهات التعليمية لشرح كيفية استخدام مختلف ميزات النظام.</p>
            <Link href="/dashboard/help/tutorials" className="text-red-600 hover:text-red-800 font-medium inline-flex items-center">
              مشاهدة الفيديوهات
              <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
        
        {/* اتصل بنا */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="p-6">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-lg font-medium text-gray-800 mb-2">اتصل بنا</h2>
            <p className="text-gray-600 mb-4">تواصل مع فريق الدعم الفني للحصول على المساعدة في حل المشكلات أو الاستفسارات.</p>
            <Link href="/dashboard/help/contact" className="text-green-600 hover:text-green-800 font-medium inline-flex items-center">
              تواصل معنا
              <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
        
        {/* تقديم طلب دعم */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="p-6">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-lg font-medium text-gray-800 mb-2">تقديم طلب دعم</h2>
            <p className="text-gray-600 mb-4">قم بتقديم طلب دعم فني لحل مشكلة تقنية أو الحصول على مساعدة متخصصة.</p>
            <Link href="/dashboard/help/support-ticket" className="text-yellow-600 hover:text-yellow-800 font-medium inline-flex items-center">
              تقديم طلب
              <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
        
        {/* التحديثات والإصدارات */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="p-6">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <h2 className="text-lg font-medium text-gray-800 mb-2">التحديثات والإصدارات</h2>
            <p className="text-gray-600 mb-4">تعرف على أحدث التحديثات والميزات الجديدة في نظام OfficeOnWay.</p>
            <Link href="/dashboard/help/updates" className="text-indigo-600 hover:text-indigo-800 font-medium inline-flex items-center">
              عرض التحديثات
              <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
      
      {/* الأسئلة الشائعة المختصرة */}
      <div className="mt-8 bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="p-4 bg-blue-50 border-b">
          <h2 className="text-lg font-medium text-gray-800">الأسئلة الأكثر شيوعًا</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-md font-medium text-gray-800 mb-2">كيف يمكنني إضافة سائق جديد؟</h3>
              <p className="text-gray-600">يمكنك إضافة سائق جديد من خلال الانتقال إلى صفحة "السائقين" في لوحة التحكم، ثم النقر على زر "إضافة سائق جديد" وملء النموذج بالمعلومات المطلوبة.</p>
            </div>
            <div>
              <h3 className="text-md font-medium text-gray-800 mb-2">كيف يمكنني تتبع المدفوعات المستحقة؟</h3>
              <p className="text-gray-600">يمكنك تتبع المدفوعات المستحقة من خلال صفحة "المدفوعات" في لوحة التحكم، حيث يمكنك تصفية المدفوعات حسب الحالة (مدفوعة، مستحقة، متأخرة) ومتابعة المدفوعات القادمة.</p>
            </div>
            <div>
              <h3 className="text-md font-medium text-gray-800 mb-2">كيف يمكنني إنشاء تقارير مخصصة؟</h3>
              <p className="text-gray-600">يمكنك إنشاء تقارير مخصصة من خلال صفحة "التحليلات" في لوحة التحكم، حيث يمكنك اختيار نوع التقرير والفترة الزمنية والمعايير الأخرى، ثم تصدير التقرير بتنسيق PDF.</p>
            </div>
            <div>
              <h3 className="text-md font-medium text-gray-800 mb-2">كيف يمكنني إدارة الوثائق المنتهية؟</h3>
              <p className="text-gray-600">يمكنك إدارة الوثائق المنتهية من خلال صفحة "الوثائق" في لوحة التحكم، حيث يمكنك تصفية الوثائق حسب الحالة (سارية، تنتهي قريبًا، منتهية) ومتابعة تواريخ انتهاء الوثائق.</p>
            </div>
          </div>
          <div className="mt-6 text-center">
            <Link href="/dashboard/help/faq" className="text-blue-600 hover:text-blue-800 font-medium">
              عرض المزيد من الأسئلة الشائعة
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
