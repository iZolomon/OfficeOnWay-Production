"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { alertService } from '@/services/firestore';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FaArrowRight } from 'react-icons/fa';

const alertSchema = z.object({
  title: z.string().min(1, 'عنوان التنبيه مطلوب'),
  description: z.string().min(1, 'وصف التنبيه مطلوب'),
  alertDate: z.string().min(1, 'تاريخ التنبيه مطلوب'),
  priority: z.enum(['high', 'medium', 'low']),
  status: z.enum(['active', 'resolved']),
  notes: z.string().optional(),
});

type AlertFormData = z.infer<typeof alertSchema>;

export default function NewAlertPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<AlertFormData>({
    resolver: zodResolver(alertSchema),
    defaultValues: {
      priority: 'medium',
      status: 'active',
      alertDate: new Date().toISOString().split('T')[0],
    }
  });

  const onSubmit = async (data: AlertFormData) => {
    setSubmitting(true);
    try {
      // In a real app, we would get the officeId from the authenticated user
      const officeId = 'demo-office-id';
      
      await alertService.addAlert({
        ...data,
        officeId,
        createdAt: new Date().toISOString(),
      });
      
      router.push('/dashboard/alerts');
    } catch (error) {
      console.error('Error creating alert:', error);
      alert('حدث خطأ أثناء إنشاء التنبيه');
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
        <h1 className="text-2xl font-bold mr-4">إضافة تنبيه جديد</h1>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 mb-2">عنوان التنبيه</label>
              <input
                type="text"
                {...register('title')}
                className="w-full px-4 py-2 border rounded-md"
                placeholder="أدخل عنوان التنبيه"
              />
              {errors.title && <p className="text-red-500 mt-1">{errors.title.message}</p>}
            </div>

            <div>
              <label className="block text-gray-700 mb-2">تاريخ التنبيه</label>
              <input
                type="date"
                {...register('alertDate')}
                className="w-full px-4 py-2 border rounded-md"
              />
              {errors.alertDate && <p className="text-red-500 mt-1">{errors.alertDate.message}</p>}
            </div>

            <div>
              <label className="block text-gray-700 mb-2">الأولوية</label>
              <select
                {...register('priority')}
                className="w-full px-4 py-2 border rounded-md"
              >
                <option value="high">عالية</option>
                <option value="medium">متوسطة</option>
                <option value="low">منخفضة</option>
              </select>
              {errors.priority && <p className="text-red-500 mt-1">{errors.priority.message}</p>}
            </div>

            <div>
              <label className="block text-gray-700 mb-2">الحالة</label>
              <select
                {...register('status')}
                className="w-full px-4 py-2 border rounded-md"
              >
                <option value="active">نشط</option>
                <option value="resolved">تم الحل</option>
              </select>
              {errors.status && <p className="text-red-500 mt-1">{errors.status.message}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-700 mb-2">وصف التنبيه</label>
              <textarea
                {...register('description')}
                className="w-full px-4 py-2 border rounded-md"
                rows={3}
                placeholder="أدخل وصف التنبيه"
              ></textarea>
              {errors.description && <p className="text-red-500 mt-1">{errors.description.message}</p>}
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
              {submitting ? 'جاري الحفظ...' : 'حفظ التنبيه'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
