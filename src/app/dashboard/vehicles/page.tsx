"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { vehicleService } from '@/services/firestore';
import { Vehicle } from '@/models/types';
import Link from 'next/link';
import { FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';

export default function VehiclesPage() {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchVehicles = async () => {
      if (user?.officeId) {
        try {
          const vehiclesData = await vehicleService.getVehiclesByOffice(user.officeId);
          setVehicles(vehiclesData);
        } catch (error) {
          console.error('Error fetching vehicles:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchVehicles();
  }, [user]);

  const handleDelete = async (vehicleId: string) => {
    if (window.confirm('هل أنت متأكد من رغبتك في حذف هذه المركبة؟')) {
      try {
        await vehicleService.deleteVehicle(vehicleId);
        setVehicles(vehicles.filter(vehicle => vehicle.id !== vehicleId));
      } catch (error) {
        console.error('Error deleting vehicle:', error);
      }
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'نشطة';
      case 'maintenance':
        return 'في الصيانة';
      case 'inactive':
        return 'غير نشطة';
      default:
        return status;
    }
  };

  const filteredVehicles = vehicles.filter(vehicle => 
    vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.plateNumber.includes(searchTerm) ||
    vehicle.year.toString().includes(searchTerm)
  );

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><div className="loader"></div></div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">إدارة المركبات</h1>
        <Link href="/dashboard/vehicles/new" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center">
          <FaPlus className="mr-2" /> إضافة مركبة جديدة
        </Link>
      </div>

      <div className="mb-6 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FaSearch className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="البحث عن مركبات..."
          className="w-full pl-10 pr-4 py-2 border rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredVehicles.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">لا توجد مركبات متاحة</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-right">الشركة المصنعة</th>
                <th className="py-3 px-4 text-right">الموديل</th>
                <th className="py-3 px-4 text-right">رقم اللوحة</th>
                <th className="py-3 px-4 text-right">سنة الصنع</th>
                <th className="py-3 px-4 text-right">تاريخ انتهاء التأمين</th>
                <th className="py-3 px-4 text-right">الحالة</th>
                <th className="py-3 px-4 text-right">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredVehicles.map((vehicle) => (
                <tr key={vehicle.id} className="border-t hover:bg-gray-50">
                  <td className="py-3 px-4">{vehicle.make}</td>
                  <td className="py-3 px-4">{vehicle.model}</td>
                  <td className="py-3 px-4">{vehicle.plateNumber}</td>
                  <td className="py-3 px-4">{vehicle.year}</td>
                  <td className="py-3 px-4">{new Date(vehicle.insuranceExpiry).toLocaleDateString('ar-SA')}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusClass(vehicle.status)}`}>
                      {getStatusText(vehicle.status)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2 rtl:space-x-reverse">
                      <Link href={`/dashboard/vehicles/edit/${vehicle.id}`} className="text-blue-600 hover:text-blue-800" title="تعديل">
                        <FaEdit />
                      </Link>
                      <button
                        onClick={() => handleDelete(vehicle.id)}
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
