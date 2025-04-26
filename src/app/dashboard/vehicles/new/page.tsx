"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { vehicleService } from '@/services/firestore';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FaArrowRight } from 'react-icons/fa';

const vehicleSchema = z.object({
  make: z.string().min(1, 'الشركة المصنعة مطلوبة'),
  model: z.string().min(1, 'الموديل مطلوب'),
  year: z.string().min(1, 'سنة الصنع مطلوبة'),
  plateNumber: z.string().min(1, 'رقم اللوحة مطلوب'),
  color: z.string().min(1, 'اللون مطلوب'),
  vin: z.string().min(1, 'رقم الهيكل مطلوب'),
  registrationNumber: z.string().min(1, 'رقم التسجيل مطلوب'),
  registrationExpiry: z.string().min(1, 'تاريخ انتهاء التسجيل مطلوب'),
  insuranceNumber: z.string().min(1, 'رقم التأمين مطلوب'),
  insuranceExpiry: z.string().min(1, 'تاريخ انتهاء التأمين مطلوب'),
  status: z.enum(['active', 'maintenance', 'inactive']),
  notes: z.string().optional(),
});

type VehicleFormData = z.infer<typeof vehicleSchema>;

export default function NewVehiclePage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      status: 'active',
    }
  });

  const onSubmit = async (data: VehicleFormData) => {
    setSubmitting(true);
    try {
      // In a real app, we would get the officeId from the authenticated user
      const officeId = 'demo-office-id';
      
      await vehicleService.addVehicle({
        ...data,
        year: parseInt(data.year),
        officeId,
        createdAt: new Date().toISOString(),
      });
      
      router.push('/dashboard/vehicles');
    } catch (error) {
      console.error('Error creating vehicle:', error);
      alert('حدث خطأ أثناء إنشاء المركبة');
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
        <h1 className="text-2xl font-bold mr-4">إضافة مركبة جديدة</h1>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 mb-2">الشركة المصنعة</label>
              <input
                type="text"
                {...register('make')}
                className="w-full px-4 py-2 border rounded-md"
                placeholder="أدخل الشركة المصنعة"
              />
              {errors.make && <p className="text-red-500 mt-1">{errors.make.message}</p>}
            </div>

            <div>
              <label className="block text-gray-700 mb-2">الموديل</label>
              <input
                type="text"
                {...register('model')}
                className="w-full px-4 py-2 border rounded-md"
                placeholder="أدخل الموديل"
              />
              {errors.model && <p className="text-red-500 mt-1">{errors.model.message}</p>}
            </div>

            <div>
              <label className="block text-gray-700 mb-2">سنة الصنع</label>
              <input
                type="number"
                {...register('year')}
                className="w-full px-4 py-2 border rounded-md"
                placeholder="أدخل سنة الصنع"
              />
              {errors.year && <p className="text-red-500 mt-1">{errors.year.message}</p>}
            </div>

            <div>
              <label className="block text-gray-700 mb-2">رقم اللوحة</label>
              <input
                type="text"
                {...register('plateNumber')}
                className="w-full px-4 py-2 border rounded-md"
                placeholder="أدخل رقم اللوحة"
              />
              {errors.plateNumber && <p className="text-red-500 mt-1">{errors.plateNumber.message}</p>}
            </div>

            <div>
              <label className="block text-gray-700 mb-2">اللون</label>
              <input
                type="text"
                {...register('color')}
                className="w-full px-4 py-2 border rounded-md"
                placeholder="أدخل اللون"
              />
              {errors.color && <p className="text-red-500 mt-1">{errors.color.message}</p>}
            </div>

            <div>
              <label className="block text-gray-700 mb-2">رقم الهيكل (VIN)</label>
              <input
                type="text"
                {...register('vin')}
                className="w-full px-4 py-2 border rounded-md"
                placeholder="أدخل رقم الهيكل"
              />
              {errors.vin && <p className="text-red-500 mt-1">{errors.vin.message}</p>}
            </div>

            <div>
              <label className="block text-gray-700 mb-2">رقم التسجيل</label>
              <input
                type="text"
                {...register('registrationNumber')}
                className="w-full px-4 py-2 border rounded-md"
                placeholder="أدخل رقم التسجيل"
              />
              {errors.registrationNumber && <p className="text-red-500 mt-1">{errors.registrationNumber.message}</p>}
            </div>

            <div>
              <label className="block text-gray-700 mb-2">تاريخ انتهاء التسجيل</label>
              <input
                type="date"
                {...register('registrationExpiry')}
                className="w-full px-4 py-2 border rounded-md"
              />
              {errors.registrationExpiry && <p className="text-red-500 mt-1">{errors.registrationExpiry.message}</p>}
            </div>

            <div>
              <label className="block text-gray-700 mb-2">رقم التأمين</label>
              <input
                type="text"
                {...register('insuranceNumber')}
                className="w-full px-4 py-2 border rounded-md"
                placeholder="أدخل رقم التأمين"
              />
              {errors.insuranceNumber && <p className="text-red-500 mt-1">{errors.insuranceNumber.message}</p>}
            </div>

            <div>
              <label className="block text-gray-700 mb-2">تاريخ انتهاء التأمين</label>
              <input
                type="date"
                {...register('insuranceExpiry')}
                className="w-full px-4 py-2 border rounded-md"
              />
              {errors.insuranceExpiry && <p className="text-red-500 mt-1">{errors.insuranceExpiry.message}</p>}
            </div>

            <div>
              <label className="block text-gray-700 mb-2">الحالة</label>
              <select
                {...register('status')}
                className="w-full px-4 py-2 border rounded-md"
              >
                <option value="active">نشطة</option>
                <option value="maintenance">في الصيانة</option>
                <option value="inactive">غير نشطة</option>
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
              {submitting ? 'جاري الحفظ...' : 'حفظ المركبة'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
