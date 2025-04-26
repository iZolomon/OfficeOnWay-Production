"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { driverService } from '@/services/firestore';
import { Driver } from '@/models/types';
import Link from 'next/link';
import { FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';

export default function DriversPage() {
  const { user } = useAuth();
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchDrivers = async () => {
      if (user?.officeId) {
        try {
          const driversData = await driverService.getDriversByOffice(user.officeId);
          setDrivers(driversData);
        } catch (error) {
          console.error('Error fetching drivers:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchDrivers();
  }, [user]);

  const handleDelete = async (driverId: string) => {
    if (window.confirm('هل أنت متأكد من رغبتك في حذف هذا السائق؟')) {
      try {
        await driverService.deleteDriver(driverId);
        setDrivers(drivers.filter(driver => driver.id !== driverId));
      } catch (error) {
        console.error('Error deleting driver:', error);
      }
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      case 'onLeave':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'نشط';
      case 'inactive':
        return 'غير نشط';
      case 'onLeave':
        return 'في إجازة';
      default:
        return status;
    }
  };

  const filteredDrivers = drivers.filter(driver => 
    driver.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.phone.includes(searchTerm) ||
    driver.licenseNumber.includes(searchTerm)
  );

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><div className="loader"></div></div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">إدارة السائقين</h1>
        <Link href="/dashboard/drivers/new" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center">
          <FaPlus className="mr-2" /> إضافة سائق جديد
        </Link>
      </div>

      <div className="mb-6 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FaSearch className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="البحث عن سائقين..."
          className="w-full pl-10 pr-4 py-2 border rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredDrivers.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">لا يوجد سائقين متاحين</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-right">الاسم</th>
                <th className="py-3 px-4 text-right">رقم الهاتف</th>
                <th className="py-3 px-4 text-right">رقم الرخصة</th>
                <th className="py-3 px-4 text-right">تاريخ انتهاء الرخصة</th>
                <th className="py-3 px-4 text-right">الحالة</th>
                <th className="py-3 px-4 text-right">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredDrivers.map((driver) => (
                <tr key={driver.id} className="border-t hover:bg-gray-50">
                  <td className="py-3 px-4">{driver.firstName} {driver.lastName}</td>
                  <td className="py-3 px-4">{driver.phone}</td>
                  <td className="py-3 px-4">{driver.licenseNumber}</td>
                  <td className="py-3 px-4">{new Date(driver.licenseExpiry).toLocaleDateString('ar-SA')}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusClass(driver.status)}`}>
                      {getStatusText(driver.status)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2 rtl:space-x-reverse">
                      <Link href={`/dashboard/drivers/edit/${driver.id}`} className="text-blue-600 hover:text-blue-800" title="تعديل">
                        <FaEdit />
                      </Link>
                      <button
                        onClick={() => handleDelete(driver.id)}
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
