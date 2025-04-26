"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { contractService, driverService, vehicleService } from '@/services/firestore';
import { Driver, Vehicle } from '@/models/types';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FaArrowRight } from 'react-icons/fa';

const contractSchema = z.object({
  contractNumber: z.string().min(1, 'رقم العقد مطلوب'),
  driverId: z.string().min(1, 'يجب اختيار سائق'),
  vehicleId: z.string().min(1, 'يجب اختيار مركبة'),
  clientName: z.string().min(1, 'اسم العميل مطلوب'),
  clientPhone: z.string().min(9, 'رقم الهاتف يجب أن يكون على الأقل 9 أرقام'),
  startDate: z.string().min(1, 'تاريخ البدء مطلوب'),
  endDate: z.string().min(1, 'تاريخ الانتهاء مطلوب'),
  amount: z.string().min(1, 'قيمة العقد مطلوبة'),
  status: z.enum(['active', 'pending', 'completed', 'cancelled']),
  notes: z.string().optional(),
});

type ContractFormData = z.infer<typeof contractSchema>;

export default function NewContractPage() {
  const router = useRouter();
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ContractFormData>({
    resolver: zodResolver(contractSchema),
    defaultValues: {
      status: 'active',
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real app, we would get the officeId from the authenticated user
        const officeId = 'demo-office-id';
        const [driversData, vehiclesData] = await Promise.all([
          driverService.getDriversByOffice(officeId),
          vehicleService.getVehiclesByOffice(officeId)
        ]);
        setDrivers(driversData);
        setVehicles(vehiclesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const onSubmit = async (data: ContractFormData) => {
    setSubmitting(true);
    try {
      // In a real app, we would get the officeId from the authenticated user
      const officeId = 'demo-office-id';
      
      await contractService.addContract({
        ...data,
        amount: parseFloat(data.amount),
        officeId,
        createdAt: new Date().toISOString(),
      });
      
      router.push('/dashboard/contracts');
    } catch (error) {
      console.error('Error creating contract:', error);
      alert('حدث خطأ أثناء إنشاء العقد');
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><div className="loader"></div></div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <button 
          onClick={() => router.back()} 
          className="text-blue-600 hover:text-blue-800 flex items-center"
        >
          <FaArrowRight className="ml-2" /> العودة
        </button>
        <h1 className="text-2xl font-bold mr-4">إضافة عقد جديد</h1>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 mb-2">رقم العقد</label>
              <input
                type="text"
                {...register('contractNumber')}
                className="w-full px-4 py-2 border rounded-md"
                placeholder="أدخل رقم العقد"
              />
              {errors.contractNumber && <p className="text-red-500 mt-1">{errors.contractNumber.message}</p>}
            </div>

            <div>
              <label className="block text-gray-700 mb-2">السائق</label>
              <select
                {...register('driverId')}
                className="w-full px-4 py-2 border rounded-md"
              >
                <option value="">اختر السائق</option>
                {drivers.map(driver => (
                  <option key={driver.id} value={driver.id}>
                    {driver.firstName} {driver.lastName}
                  </option>
                ))}
              </select>
              {errors.driverId && <p className="text-red-500 mt-1">{errors.driverId.message}</p>}
            </div>

            <div>
              <label className="block text-gray-700 mb-2">المركبة</label>
              <select
                {...register('vehicleId')}
                className="w-full px-4 py-2 border rounded-md"
              >
                <option value="">اختر المركبة</option>
                {vehicles.map(vehicle => (
                  <option key={vehicle.id} value={vehicle.id}>
                    {vehicle.make} {vehicle.model} - {vehicle.plateNumber}
                  </option>
                ))}
              </select>
              {errors.vehicleId && <p className="text-red-500 mt-1">{errors.vehicleId.message}</p>}
            </div>

            <div>
              <label className="block text-gray-700 mb-2">اسم العميل</label>
              <input
                type="text"
                {...register('clientName')}
                className="w-full px-4 py-2 border rounded-md"
                placeholder="أدخل اسم العميل"
              />
              {errors.clientName && <p className="text-red-500 mt-1">{errors.clientName.message}</p>}
            </div>

            <div>
              <label className="block text-gray-700 mb-2">رقم هاتف العميل</label>
              <input
                type="text"
                {...register('clientPhone')}
                className="w-full px-4 py-2 border rounded-md"
                placeholder="أدخل رقم هاتف العميل"
              />
              {errors.clientPhone && <p className="text-red-500 mt-1">{errors.clientPhone.message}</p>}
            </div>

            <div>
              <label className="block text-gray-700 mb-2">تاريخ البدء</label>
              <input
                type="date"
                {...register('startDate')}
                className="w-full px-4 py-2 border rounded-md"
              />
              {errors.startDate && <p className="text-red-500 mt-1">{errors.startDate.message}</p>}
            </div>

            <div>
              <label className="block text-gray-700 mb-2">تاريخ الانتهاء</label>
              <input
                type="date"
                {...register('endDate')}
                className="w-full px-4 py-2 border rounded-md"
              />
              {errors.endDate && <p className="text-red-500 mt-1">{errors.endDate.message}</p>}
            </div>

            <div>
              <label className="block text-gray-700 mb-2">قيمة العقد (ريال)</label>
              <input
                type="number"
                {...register('amount')}
                className="w-full px-4 py-2 border rounded-md"
                placeholder="أدخل قيمة العقد"
              />
              {errors.amount && <p className="text-red-500 mt-1">{errors.amount.message}</p>}
            </div>

            <div>
              <label className="block text-gray-700 mb-2">حالة العقد</label>
              <select
                {...register('status')}
                className="w-full px-4 py-2 border rounded-md"
              >
                <option value="active">نشط</option>
                <option value="pending">قيد الانتظار</option>
                <option value="completed">مكتمل</option>
                <option value="cancelled">ملغي</option>
              </select>
              {errors.status && <p className="text-red-500 mt-1">{errors.status.message}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-700 mb-2">ملاحظات (اختياري)</label>
              <textarea
                {...register('notes')}
                className="w-full px-4 py-2 border rounded-md"
                rows={3}
                placeholder="أدخل أي ملاحظات إضافية"
              ></textarea>
            </div>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md disabled:bg-gray-400"
            >
              {submitting ? 'جاري الحفظ...' : 'حفظ العقد'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
