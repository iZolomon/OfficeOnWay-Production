"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { paymentService, driverService, contractService } from '@/services/firestore';
import { Driver, Contract } from '@/models/types';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FaArrowRight } from 'react-icons/fa';

const paymentSchema = z.object({
  description: z.string().min(1, 'وصف الدفعة مطلوب'),
  amount: z.string().min(1, 'المبلغ مطلوب'),
  paymentDate: z.string().min(1, 'تاريخ الدفع مطلوب'),
  paymentMethod: z.string().min(1, 'طريقة الدفع مطلوبة'),
  type: z.enum(['income', 'expense']),
  status: z.enum(['completed', 'pending', 'cancelled']),
  driverId: z.string().optional(),
  contractId: z.string().optional(),
  notes: z.string().optional(),
});

type PaymentFormData = z.infer<typeof paymentSchema>;

export default function NewPaymentPage() {
  const router = useRouter();
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      type: 'income',
      status: 'completed',
      paymentDate: new Date().toISOString().split('T')[0],
    }
  });

  const paymentType = watch('type');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real app, we would get the officeId from the authenticated user
        const officeId = 'demo-office-id';
        const [driversData, contractsData] = await Promise.all([
          driverService.getDriversByOffice(officeId),
          contractService.getContractsByOffice(officeId)
        ]);
        setDrivers(driversData);
        setContracts(contractsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const onSubmit = async (data: PaymentFormData) => {
    setSubmitting(true);
    try {
      // In a real app, we would get the officeId from the authenticated user
      const officeId = 'demo-office-id';
      
      await paymentService.addPayment({
        ...data,
        amount: parseFloat(data.amount),
        officeId,
        createdAt: new Date().toISOString(),
      });
      
      router.push('/dashboard/payments');
    } catch (error) {
      console.error('Error creating payment:', error);
      alert('حدث خطأ أثناء إنشاء الدفعة');
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
        <h1 className="text-2xl font-bold mr-4">إضافة دفعة جديدة</h1>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 mb-2">وصف الدفعة</label>
              <input
                type="text"
                {...register('description')}
                className="w-full px-4 py-2 border rounded-md"
                placeholder="أدخل وصف الدفعة"
              />
              {errors.description && <p className="text-red-500 mt-1">{errors.description.message}</p>}
            </div>

            <div>
              <label className="block text-gray-700 mb-2">المبلغ (ريال)</label>
              <input
                type="number"
                step="0.01"
                {...register('amount')}
                className="w-full px-4 py-2 border rounded-md"
                placeholder="أدخل المبلغ"
              />
              {errors.amount && <p className="text-red-500 mt-1">{errors.amount.message}</p>}
            </div>

            <div>
              <label className="block text-gray-700 mb-2">تاريخ الدفع</label>
              <input
                type="date"
                {...register('paymentDate')}
                className="w-full px-4 py-2 border rounded-md"
              />
              {errors.paymentDate && <p className="text-red-500 mt-1">{errors.paymentDate.message}</p>}
            </div>

            <div>
              <label className="block text-gray-700 mb-2">طريقة الدفع</label>
              <select
                {...register('paymentMethod')}
                className="w-full px-4 py-2 border rounded-md"
              >
                <option value="">اختر طريقة الدفع</option>
                <option value="نقدي">نقدي</option>
                <option value="بطاقة ائتمان">بطاقة ائتمان</option>
                <option value="تحويل بنكي">تحويل بنكي</option>
                <option value="شيك">شيك</option>
                <option value="أخرى">أخرى</option>
              </select>
              {errors.paymentMethod && <p className="text-red-500 mt-1">{errors.paymentMethod.message}</p>}
            </div>

            <div>
              <label className="block text-gray-700 mb-2">نوع الدفعة</label>
              <div className="flex space-x-4 rtl:space-x-reverse">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    value="income"
                    {...register('type')}
                    className="form-radio"
                  />
                  <span className="mr-2">إيراد</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    value="expense"
                    {...register('type')}
                    className="form-radio"
                  />
                  <span className="mr-2">مصروف</span>
                </label>
              </div>
              {errors.type && <p className="text-red-500 mt-1">{errors.type.message}</p>}
            </div>

            <div>
              <label className="block text-gray-700 mb-2">الحالة</label>
              <select
                {...register('status')}
                className="w-full px-4 py-2 border rounded-md"
              >
                <option value="completed">مكتملة</option>
                <option value="pending">قيد الانتظار</option>
                <option value="cancelled">ملغية</option>
              </select>
              {errors.status && <p className="text-red-500 mt-1">{errors.status.message}</p>}
            </div>

            {paymentType === 'income' && (
              <div>
                <label className="block text-gray-700 mb-2">متعلقة بعقد (اختياري)</label>
                <select
                  {...register('contractId')}
                  className="w-full px-4 py-2 border rounded-md"
                >
                  <option value="">اختر العقد</option>
                  {contracts.map(contract => (
                    <option key={contract.id} value={contract.id}>
                      {contract.contractNumber} - {contract.clientName}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {paymentType === 'expense' && (
              <div>
                <label className="block text-gray-700 mb-2">متعلقة بسائق (اختياري)</label>
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
              </div>
            )}

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
              {submitting ? 'جاري الحفظ...' : 'حفظ الدفعة'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
