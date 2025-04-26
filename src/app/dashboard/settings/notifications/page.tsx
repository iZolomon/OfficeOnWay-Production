"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { notificationService } from '@/services/firestore';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FaArrowRight, FaBell } from 'react-icons/fa';

const notificationSchema = z.object({
  smsNotifications: z.boolean(),
  appNotifications: z.boolean(),
  expiryReminders: z.boolean(),
  paymentReminders: z.boolean(),
  contractReminders: z.boolean(),
  maintenanceReminders: z.boolean(),
  daysBeforeExpiry: z.string().min(1, 'عدد الأيام مطلوب'),
});

type NotificationFormData = z.infer<typeof notificationSchema>;

export default function NotificationsSettingsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<NotificationFormData>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      smsNotifications: true,
      appNotifications: true,
      expiryReminders: true,
      paymentReminders: true,
      contractReminders: true,
      maintenanceReminders: true,
      daysBeforeExpiry: '7',
    }
  });

  useEffect(() => {
    const fetchNotificationSettings = async () => {
      if (user?.officeId) {
        try {
          const settings = await notificationService.getNotificationSettings(user.officeId);
          if (settings) {
            reset({
              smsNotifications: settings.smsNotifications,
              appNotifications: settings.appNotifications,
              expiryReminders: settings.expiryReminders,
              paymentReminders: settings.paymentReminders,
              contractReminders: settings.contractReminders,
              maintenanceReminders: settings.maintenanceReminders,
              daysBeforeExpiry: settings.daysBeforeExpiry.toString(),
            });
          }
        } catch (error) {
          console.error('Error fetching notification settings:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchNotificationSettings();
  }, [user, reset]);

  const onSubmit = async (data: NotificationFormData) => {
    setSubmitting(true);
    setSuccess(false);
    try {
      if (user?.officeId) {
        await notificationService.updateNotificationSettings(user.officeId, {
          ...data,
          daysBeforeExpiry: parseInt(data.daysBeforeExpiry),
          updatedAt: new Date().toISOString(),
        });
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Error updating notification settings:', error);
    } finally {
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
          onClick={() => window.history.back()} 
          className="text-blue-600 hover:text-blue-800 flex items-center"
        >
          <FaArrowRight className="ml-2" /> العودة
        </button>
        <h1 className="text-2xl font-bold mr-4">إعدادات الإشعارات</h1>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FaBell className="ml-2 text-blue-600" /> قنوات الإشعارات
            </h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="smsNotifications"
                  {...register('smsNotifications')}
                  className="w-5 h-5 text-blue-600"
                />
                <label htmlFor="smsNotifications" className="mr-2 text-gray-700">
                  إشعارات الرسائل القصيرة (SMS)
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="appNotifications"
                  {...register('appNotifications')}
                  className="w-5 h-5 text-blue-600"
                />
                <label htmlFor="appNotifications" className="mr-2 text-gray-700">
                  إشعارات داخل التطبيق
                </label>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">أنواع التذكيرات</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="expiryReminders"
                  {...register('expiryReminders')}
                  className="w-5 h-5 text-blue-600"
                />
                <label htmlFor="expiryReminders" className="mr-2 text-gray-700">
                  تذكيرات انتهاء الوثائق
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="paymentReminders"
                  {...register('paymentReminders')}
                  className="w-5 h-5 text-blue-600"
                />
                <label htmlFor="paymentReminders" className="mr-2 text-gray-700">
                  تذكيرات المدفوعات
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="contractReminders"
                  {...register('contractReminders')}
                  className="w-5 h-5 text-blue-600"
                />
                <label htmlFor="contractReminders" className="mr-2 text-gray-700">
                  تذكيرات العقود
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="maintenanceReminders"
                  {...register('maintenanceReminders')}
                  className="w-5 h-5 text-blue-600"
                />
                <label htmlFor="maintenanceReminders" className="mr-2 text-gray-700">
                  تذكيرات الصيانة
                </label>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">إعدادات التذكير</h2>
            <div>
              <label className="block text-gray-700 mb-2">عدد الأيام قبل انتهاء الصلاحية للتذكير</label>
              <input
                type="number"
                min="1"
                max="90"
                {...register('daysBeforeExpiry')}
                className="w-full md:w-1/4 px-4 py-2 border rounded-md"
              />
              {errors.daysBeforeExpiry && <p className="text-red-500 mt-1">{errors.daysBeforeExpiry.message}</p>}
            </div>
          </div>

          <div className="mt-6 flex items-center">
            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md disabled:bg-gray-400"
            >
              {submitting ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
            </button>
            {success && (
              <span className="text-green-600 mr-4">
                تم حفظ الإعدادات بنجاح!
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
