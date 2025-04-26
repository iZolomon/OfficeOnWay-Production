"use client";

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { officeService } from '@/services/firestore';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Office } from '@/models/types';
import { FaCar, FaUserTie, FaFileContract, FaFileInvoiceDollar, FaFileAlt, FaBell, FaChartBar } from 'react-icons/fa';

export default function DashboardPage() {
  const { user } = useAuth();
  const [office, setOffice] = useState<Office | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOfficeData = async () => {
      if (user?.officeId) {
        try {
          const officeData = await officeService.getOfficeById(user.officeId);
          setOffice(officeData);
        } catch (error) {
          console.error('Error fetching office data:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchOfficeData();
  }, [user]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><div className="loader"></div></div>;
  }

  const dashboardCards = [
    {
      title: 'السائقين',
      count: office?.driversCount || 0,
      icon: <FaUserTie className="text-blue-500 text-4xl" />,
      link: '/dashboard/drivers',
      maxCount: 35,
      color: 'bg-blue-50 border-blue-200',
    },
    {
      title: 'المركبات',
      count: office?.vehiclesCount || 0,
      icon: <FaCar className="text-green-500 text-4xl" />,
      link: '/dashboard/vehicles',
      maxCount: 30,
      color: 'bg-green-50 border-green-200',
    },
    {
      title: 'العقود',
      count: office?.contractsCount || 0,
      icon: <FaFileContract className="text-purple-500 text-4xl" />,
      link: '/dashboard/contracts',
      color: 'bg-purple-50 border-purple-200',
    },
    {
      title: 'المدفوعات',
      count: office?.paymentsCount || 0,
      icon: <FaFileInvoiceDollar className="text-yellow-500 text-4xl" />,
      link: '/dashboard/payments',
      color: 'bg-yellow-50 border-yellow-200',
    },
    {
      title: 'الوثائق',
      count: office?.documentsCount || 0,
      icon: <FaFileAlt className="text-red-500 text-4xl" />,
      link: '/dashboard/documents',
      color: 'bg-red-50 border-red-200',
    },
    {
      title: 'التنبيهات',
      count: office?.alertsCount || 0,
      icon: <FaBell className="text-orange-500 text-4xl" />,
      link: '/dashboard/alerts',
      color: 'bg-orange-50 border-orange-200',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">مرحباً بك في لوحة التحكم</h1>
        <p className="text-gray-600">
          {office ? `مكتب: ${office.name}` : 'مرحباً بك في نظام إدارة مكاتب الأجرة والنقل الخاص'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {dashboardCards.map((card, index) => (
          <Link href={card.link} key={index}>
            <div className={`p-6 rounded-lg border ${card.color} hover:shadow-md transition-shadow`}>
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold mb-2">{card.title}</h2>
                  <p className="text-3xl font-bold">{card.count}</p>
                  {card.maxCount && (
                    <p className="text-sm text-gray-500">
                      الحد الأقصى: {card.maxCount}
                    </p>
                  )}
                </div>
                <div>{card.icon}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">التحليلات والإحصائيات</h2>
          <Link href="/dashboard/analytics" className="text-blue-600 hover:text-blue-800">
            عرض التفاصيل
          </Link>
        </div>
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <FaChartBar className="text-blue-500 text-6xl mx-auto mb-4" />
            <p className="text-gray-600">
              اضغط لعرض التحليلات التفصيلية للإيرادات والمصروفات والأداء
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">التنبيهات الأخيرة</h2>
          {office?.recentAlerts && office.recentAlerts.length > 0 ? (
            <ul className="space-y-3">
              {office.recentAlerts.map((alert, index) => (
                <li key={index} className="border-b pb-2">
                  <div className="flex items-start">
                    <FaBell className={`mt-1 mr-2 ${alert.priority === 'high' ? 'text-red-500' : 'text-yellow-500'}`} />
                    <div>
                      <p className="font-medium">{alert.title}</p>
                      <p className="text-sm text-gray-600">{new Date(alert.date).toLocaleDateString('ar-SA')}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-center py-4">لا توجد تنبيهات حديثة</p>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">الوثائق التي تنتهي قريباً</h2>
          {office?.expiringDocuments && office.expiringDocuments.length > 0 ? (
            <ul className="space-y-3">
              {office.expiringDocuments.map((doc, index) => (
                <li key={index} className="border-b pb-2">
                  <div className="flex items-start">
                    <FaFileAlt className="mt-1 mr-2 text-orange-500" />
                    <div>
                      <p className="font-medium">{doc.title}</p>
                      <p className="text-sm text-gray-600">تنتهي في: {new Date(doc.expiryDate).toLocaleDateString('ar-SA')}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-center py-4">لا توجد وثائق تنتهي قريباً</p>
          )}
        </div>
      </div>
    </div>
  );
}
