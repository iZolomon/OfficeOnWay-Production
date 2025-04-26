"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { driverService } from '@/services/firestore';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FaArrowRight } from 'react-icons/fa';

const driverSchema = z.object({
  firstName: z.string().min(1, 'الاسم الأول مطلوب'),
  lastName: z.string().min(1, 'الاسم الأخير مطلوب'),
  phone: z.string().min(9, 'رقم الهاتف يجب أن يكون على الأقل 9 أرقام'),
  email: z.string().email('البريد الإلكتروني غير صالح').optional().or(z.literal('')),
  licenseNumber: z.string().min(1, 'رقم الرخصة مطلوب'),
  licenseExpiry: z.string().min(1, 'تاريخ انتهاء الرخصة مطلوب'),
  nationalId: z.string().min(1, 'رقم الهوية مطلوب'),
  address: z.string().optional(),
  status: z.enum(['active', 'inactive', 'onLeave']),
  notes: z.string().optional(),
});

type DriverFormData = z.infer<typeof driverSchema>;

export default function NewDriverPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<DriverFormData>({
    resolver: zodResolver(driverSchema),
    defaultValues: {
      status: 'active',
    }
  });

  const onSubmit = async (data: DriverFormData) => {
    setSubmitting(true);
    try {
      // In a real app, we would get the officeId from the authenticated user
      const officeId = 'demo-office-id';
      
      await driverService.addDriver({
        ...data,
        officeId,
        createdAt: new Date().toISOString(),
      });
      
      router.push('/dashboard/drivers');
    } catch (error) {
      console.error('Error creating driver:', error);
      alert('حدث خطأ أثناء إنشاء السائق');
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <button 
          onClick={() => router.back()} 
          className="text-blue-600 hover:text-blue-800 flex items-center"
        >
          <FaArrowRight className="ml-2" /> العودة
        </button>
        <h1 className="text-2xl font-bold mr-4">إضافة سائق جديد</h1>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 mb-2">الاسم الأول</label>
              <input
                type="text"
                {...register('firstName')}
                className="w-full px-4 py-2 border rounded-md"
                placeholder="أدخل الاسم الأول"
              />
              {errors.firstName && <p className="text-red-500 mt-1">{errors.firstName.message}</p>}
            </div>

            <div>
              <label className="block text-gray-700 mb-2">الاسم الأخير</label>
              <input
                type="text"
                {...register('lastName')}
                className="w-full px-4 py-2 border rounded-md"
                placeholder="أدخل الاسم الأخير"
              />
              {errors.lastName && <p className="text-red-500 mt-1">{errors.lastName.message}</p>}
            </div>

            <div>
              <label className="block text-gray-700 mb-2">رقم الهاتف</label>
              <input
                type="text"
                {...register('phone')}
                className="w-full px-4 py-2 border rounded-md"
                placeholder="أدخل رقم الهاتف"
              />
              {errors.phone && <p className="text-red-500 mt-1">{errors.phone.message}</p>}
            </div>

            <div>
              <label className="block text-gray-700 mb-2">البريد الإلكتروني (اختياري)</label>
              <input
                type="email"
                {...register('email')}
                className="w-full px-4 py-2 border rounded-md"
                placeholder="أدخل البريد الإلكتروني"
              />
              {errors.email && <p className="text-red-500 mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-gray-700 mb-2">رقم الرخصة</label>
              <input
                type="text"
                {...register('licenseNumber')}
                className="w-full px-4 py-2 border rounded-md"
                placeholder="أدخل رقم الرخصة"
              />
              {errors.licenseNumber && <p className="text-red-500 mt-1">{errors.licenseNumber.message}</p>}
            </div>

            <div>
              <label className="block text-gray-700 mb-2">تاريخ انتهاء الرخصة</label>
              <input
                type="date"
                {...register('licenseExpiry')}
                className="w-full px-4 py-2 border rounded-md"
              />
              {errors.licenseExpiry && <p className="text-red-500 mt-1">{errors.licenseExpiry.message}</p>}
            </div>

            <div>
              <label className="block text-gray-700 mb-2">رقم الهوية</label>
              <input
                type="text"
                {...register('nationalId')}
                className="w-full px-4 py-2 border rounded-md"
                placeholder="أدخل رقم الهوية"
              />
              {errors.nationalId && <p className="text-red-500 mt-1">{errors.nationalId.message}</p>}
            </div>

            <div>
              <label className="block text-gray-700 mb-2">الحالة</label>
              <select
                {...register('status')}
                className="w-full px-4 py-2 border rounded-md"
              >
                <option value="active">نشط</option>
                <option value="inactive">غير نشط</option>
                <option value="onLeave">في إجازة</option>
              </select>
              {errors.status && <p className="text-red-500 mt-1">{errors.status.message}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-700 mb-2">العنوان (اختياري)</label>
              <input
                type="text"
                {...register('address')}
                className="w-full px-4 py-2 border rounded-md"
                placeholder="أدخل العنوان"
              />
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
              {submitting ? 'جاري الحفظ...' : 'حفظ السائق'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
