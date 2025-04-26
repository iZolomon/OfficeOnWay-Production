"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { alertService } from '@/services/firestore';
import { Alert } from '@/models/types';
import Link from 'next/link';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaBell } from 'react-icons/fa';

export default function AlertsPage() {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchAlerts = async () => {
      if (user?.officeId) {
        try {
          const alertsData = await alertService.getAlertsByOffice(user.officeId);
          setAlerts(alertsData);
        } catch (error) {
          console.error('Error fetching alerts:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchAlerts();
  }, [user]);

  const handleDelete = async (alertId: string) => {
    if (window.confirm('هل أنت متأكد من رغبتك في حذف هذا التنبيه؟')) {
      try {
        await alertService.deleteAlert(alertId);
        setAlerts(alerts.filter(alert => alert.id !== alertId));
      } catch (error) {
        console.error('Error deleting alert:', error);
      }
    }
  };

  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'عالية';
      case 'medium':
        return 'متوسطة';
      case 'low':
        return 'منخفضة';
      default:
        return priority;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'resolved':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'نشط';
      case 'resolved':
        return 'تم الحل';
      default:
        return status;
    }
  };

  const filteredAlerts = alerts.filter(alert => 
    alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    alert.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getPriorityText(alert.priority).includes(searchTerm) ||
    getStatusText(alert.status).includes(searchTerm)
  );

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><div className="loader"></div></div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">إدارة التنبيهات</h1>
        <Link href="/dashboard/alerts/new" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center">
          <FaPlus className="mr-2" /> إضافة تنبيه جديد
        </Link>
      </div>

      <div className="mb-6 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FaSearch className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="البحث عن تنبيهات..."
          className="w-full pl-10 pr-4 py-2 border rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredAlerts.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">لا توجد تنبيهات متاحة</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-right">العنوان</th>
                <th className="py-3 px-4 text-right">الوصف</th>
                <th className="py-3 px-4 text-right">تاريخ التنبيه</th>
                <th className="py-3 px-4 text-right">الأولوية</th>
                <th className="py-3 px-4 text-right">الحالة</th>
                <th className="py-3 px-4 text-right">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredAlerts.map((alert) => (
                <tr key={alert.id} className="border-t hover:bg-gray-50">
                  <td className="py-3 px-4 flex items-center">
                    <FaBell className={`mr-2 ${alert.priority === 'high' ? 'text-red-500' : alert.priority === 'medium' ? 'text-yellow-500' : 'text-blue-500'}`} />
                    {alert.title}
                  </td>
                  <td className="py-3 px-4">{alert.description}</td>
                  <td className="py-3 px-4">{new Date(alert.alertDate).toLocaleDateString('ar-SA')}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${getPriorityClass(alert.priority)}`}>
                      {getPriorityText(alert.priority)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusClass(alert.status)}`}>
                      {getStatusText(alert.status)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2 rtl:space-x-reverse">
                      <Link href={`/dashboard/alerts/edit/${alert.id}`} className="text-blue-600 hover:text-blue-800" title="تعديل">
                        <FaEdit />
                      </Link>
                      <button
                        onClick={() => handleDelete(alert.id)}
                        className="text-red-600 hover:text-red-800"
                        title="حذف"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
