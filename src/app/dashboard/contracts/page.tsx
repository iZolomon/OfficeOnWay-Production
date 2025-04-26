"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { contractService, driverService, vehicleService } from '@/services/firestore';
import { Contract, Driver, Vehicle } from '@/models/types';
import Link from 'next/link';
import { FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';

export default function ContractsPage() {
  const { user } = useAuth();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (user?.officeId) {
        try {
          const [contractsData, driversData, vehiclesData] = await Promise.all([
            contractService.getContractsByOffice(user.officeId),
            driverService.getDriversByOffice(user.officeId),
            vehicleService.getVehiclesByOffice(user.officeId)
          ]);
          setContracts(contractsData);
          setDrivers(driversData);
          setVehicles(vehiclesData);
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [user]);

  const getDriverName = (driverId: string) => {
    const driver = drivers.find(d => d.id === driverId);
    return driver ? `${driver.firstName} ${driver.lastName}` : 'غير معروف';
  };

  const getVehicleName = (vehicleId: string) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    return vehicle ? `${vehicle.make} ${vehicle.model} - ${vehicle.plateNumber}` : 'غير معروف';
  };

  const handleDelete = async (contractId: string) => {
    if (window.confirm('هل أنت متأكد من رغبتك في حذف هذا العقد؟')) {
      try {
        await contractService.deleteContract(contractId);
        setContracts(contracts.filter(contract => contract.id !== contractId));
      } catch (error) {
        console.error('Error deleting contract:', error);
      }
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'نشط';
      case 'pending':
        return 'قيد الانتظار';
      case 'completed':
        return 'مكتمل';
      case 'cancelled':
        return 'ملغي';
      default:
        return status;
    }
  };

  const filteredContracts = contracts.filter(contract => 
    contract.contractNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getDriverName(contract.driverId).toLowerCase().includes(searchTerm.toLowerCase()) ||
    getVehicleName(contract.vehicleId).toLowerCase().includes(searchTerm.toLowerCase()) ||
    contract.clientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><div className="loader"></div></div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">إدارة العقود</h1>
        <Link href="/dashboard/contracts/new" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center">
          <FaPlus className="mr-2" /> إضافة عقد جديد
        </Link>
      </div>

      <div className="mb-6 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FaSearch className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="البحث عن عقود..."
          className="w-full pl-10 pr-4 py-2 border rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredContracts.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">لا توجد عقود متاحة</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-right">رقم العقد</th>
                <th className="py-3 px-4 text-right">السائق</th>
                <th className="py-3 px-4 text-right">المركبة</th>
                <th className="py-3 px-4 text-right">العميل</th>
                <th className="py-3 px-4 text-right">تاريخ البدء</th>
                <th className="py-3 px-4 text-right">تاريخ الانتهاء</th>
                <th className="py-3 px-4 text-right">القيمة</th>
                <th className="py-3 px-4 text-right">الحالة</th>
                <th className="py-3 px-4 text-right">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredContracts.map((contract) => (
                <tr key={contract.id} className="border-t hover:bg-gray-50">
                  <td className="py-3 px-4">{contract.contractNumber}</td>
                  <td className="py-3 px-4">{getDriverName(contract.driverId)}</td>
                  <td className="py-3 px-4">{getVehicleName(contract.vehicleId)}</td>
                  <td className="py-3 px-4">{contract.clientName}</td>
                  <td className="py-3 px-4">{new Date(contract.startDate).toLocaleDateString('ar-SA')}</td>
                  <td className="py-3 px-4">{new Date(contract.endDate).toLocaleDateString('ar-SA')}</td>
                  <td className="py-3 px-4">{contract.amount} ريال</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusClass(contract.status)}`}>
                      {getStatusText(contract.status)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2 rtl:space-x-reverse">
                      <Link href={`/dashboard/contracts/edit/${contract.id}`} className="text-blue-600 hover:text-blue-800" title="تعديل">
                        <FaEdit />
                      </Link>
                      <button
                        onClick={() => handleDelete(contract.id)}
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
