"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { paymentService, driverService, contractService } from '@/services/firestore';
import { Payment, Driver, Contract } from '@/models/types';
import Link from 'next/link';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaFileInvoiceDollar } from 'react-icons/fa';

export default function PaymentsPage() {
  const { user } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (user?.officeId) {
        try {
          const [paymentsData, driversData, contractsData] = await Promise.all([
            paymentService.getPaymentsByOffice(user.officeId),
            driverService.getDriversByOffice(user.officeId),
            contractService.getContractsByOffice(user.officeId)
          ]);
          setPayments(paymentsData);
          setDrivers(driversData);
          setContracts(contractsData);
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

  const getContractNumber = (contractId: string) => {
    const contract = contracts.find(c => c.id === contractId);
    return contract ? contract.contractNumber : 'غير معروف';
  };

  const handleDelete = async (paymentId: string) => {
    if (window.confirm('هل أنت متأكد من رغبتك في حذف هذه الدفعة؟')) {
      try {
        await paymentService.deletePayment(paymentId);
        setPayments(payments.filter(payment => payment.id !== paymentId));
      } catch (error) {
        console.error('Error deleting payment:', error);
      }
    }
  };

  const getTypeClass = (type: string) => {
    switch (type) {
      case 'income':
        return 'bg-green-100 text-green-800';
      case 'expense':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'income':
        return 'إيراد';
      case 'expense':
        return 'مصروف';
      default:
        return type;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'مكتملة';
      case 'pending':
        return 'قيد الانتظار';
      case 'cancelled':
        return 'ملغية';
      default:
        return status;
    }
  };

  const filteredPayments = payments.filter(payment => 
    payment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getTypeText(payment.type).includes(searchTerm) ||
    getStatusText(payment.status).includes(searchTerm) ||
    (payment.driverId && getDriverName(payment.driverId).toLowerCase().includes(searchTerm.toLowerCase())) ||
    (payment.contractId && getContractNumber(payment.contractId).toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><div className="loader"></div></div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">إدارة المدفوعات</h1>
        <Link href="/dashboard/payments/new" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center">
          <FaPlus className="mr-2" /> إضافة دفعة جديدة
        </Link>
      </div>

      <div className="mb-6 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FaSearch className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="البحث عن مدفوعات..."
          className="w-full pl-10 pr-4 py-2 border rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredPayments.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">لا توجد مدفوعات متاحة</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-right">الوصف</th>
                <th className="py-3 px-4 text-right">النوع</th>
                <th className="py-3 px-4 text-right">المبلغ</th>
                <th className="py-3 px-4 text-right">تاريخ الدفع</th>
                <th className="py-3 px-4 text-right">طريقة الدفع</th>
                <th className="py-3 px-4 text-right">متعلقة بـ</th>
                <th className="py-3 px-4 text-right">الحالة</th>
                <th className="py-3 px-4 text-right">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="border-t hover:bg-gray-50">
                  <td className="py-3 px-4 flex items-center">
                    <FaFileInvoiceDollar className={`mr-2 ${payment.type === 'income' ? 'text-green-500' : 'text-red-500'}`} />
                    {payment.description}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${getTypeClass(payment.type)}`}>
                      {getTypeText(payment.type)}
                    </span>
                  </td>
                  <td className="py-3 px-4">{payment.amount} ريال</td>
                  <td className="py-3 px-4">{new Date(payment.paymentDate).toLocaleDateString('ar-SA')}</td>
                  <td className="py-3 px-4">{payment.paymentMethod}</td>
                  <td className="py-3 px-4">
                    {payment.driverId && (
                      <span>سائق: {getDriverName(payment.driverId)}</span>
                    )}
                    {payment.contractId && (
                      <span>عقد: {getContractNumber(payment.contractId)}</span>
                    )}
                    {!payment.driverId && !payment.contractId && (
                      <span>-</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusClass(payment.status)}`}>
                      {getStatusText(payment.status)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2 rtl:space-x-reverse">
                      <Link href={`/dashboard/payments/edit/${payment.id}`} className="text-blue-600 hover:text-blue-800" title="تعديل">
                        <FaEdit />
                      </Link>
                      <button
                        onClick={() => handleDelete(payment.id)}
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
