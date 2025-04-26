"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { documentService, driverService, vehicleService, storageService } from '@/services/firestore';
import { Driver, Vehicle } from '@/models/types';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FaUpload, FaArrowRight } from 'react-icons/fa';

const documentSchema = z.object({
  name: z.string().min(1, 'اسم الوثيقة مطلوب'),
  type: z.string().min(1, 'نوع الوثيقة مطلوب'),
  entityType: z.enum(['driver', 'vehicle']),
  entityId: z.string().min(1, 'يجب اختيار سائق أو مركبة'),
  expiryDate: z.string().optional(),
  notes: z.string().optional(),
});

type DocumentFormData = z.infer<typeof documentSchema>;

export default function NewDocumentPage() {
  const router = useRouter();
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const { register, handleSubmit, control, watch, formState: { errors } } = useForm<DocumentFormData>({
    resolver: zodResolver(documentSchema),
    defaultValues: {
      entityType: 'driver',
    }
  });

  const entityType = watch('entityType');

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const onSubmit = async (data: DocumentFormData) => {
    if (!file) {
      alert('الرجاء اختيار ملف للرفع');
      return;
    }

    setUploading(true);
    try {
      // In a real app, we would get the officeId from the authenticated user
      const officeId = 'demo-office-id';
      
      // Upload file to storage
      const filePath = `offices/${officeId}/documents/${Date.now()}_${file.name}`;
      const uploadTask = storageService.uploadFile(filePath, file);
      
      // Monitor upload progress
      uploadTask.on('state_changed', 
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          console.error('Error uploading file:', error);
          alert('حدث خطأ أثناء رفع الملف');
          setUploading(false);
        },
        async () => {
          // Get download URL
          const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
          
          // Create document record
          await documentService.addDocument({
            name: data.name,
            type: data.type,
            entityType: data.entityType,
            entityId: data.entityId,
            filePath,
            fileUrl: downloadURL,
            uploadDate: new Date().toISOString(),
            expiryDate: data.expiryDate ? new Date(data.expiryDate).toISOString() : undefined,
            notes: data.notes,
            officeId,
          });
          
          router.push('/dashboard/documents');
        }
      );
    } catch (error) {
      console.error('Error creating document:', error);
      alert('حدث خطأ أثناء إنشاء الوثيقة');
      setUploading(false);
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
        <h1 className="text-2xl font-bold mr-4">إضافة وثيقة جديدة</h1>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 mb-2">اسم الوثيقة</label>
              <input
                type="text"
                {...register('name')}
                className="w-full px-4 py-2 border rounded-md"
                placeholder="أدخل اسم الوثيقة"
              />
              {errors.name && <p className="text-red-500 mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-gray-700 mb-2">نوع الوثيقة</label>
              <select
                {...register('type')}
                className="w-full px-4 py-2 border rounded-md"
              >
                <option value="">اختر نوع الوثيقة</option>
                <option value="رخصة قيادة">رخصة قيادة</option>
                <option value="تأمين">تأمين</option>
                <option value="استمارة">استمارة</option>
                <option value="فحص فني">فحص فني</option>
                <option value="عقد">عقد</option>
                <option value="أخرى">أخرى</option>
              </select>
              {errors.type && <p className="text-red-500 mt-1">{errors.type.message}</p>}
            </div>

            <div>
              <label className="block text-gray-700 mb-2">متعلقة بـ</label>
              <div className="flex space-x-4 rtl:space-x-reverse">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    value="driver"
                    {...register('entityType')}
                    className="form-radio"
                  />
                  <span className="mr-2">سائق</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    value="vehicle"
                    {...register('entityType')}
                    className="form-radio"
                  />
                  <span className="mr-2">مركبة</span>
                </label>
              </div>
              {errors.entityType && <p className="text-red-500 mt-1">{errors.entityType.message}</p>}
            </div>

            <div>
              <label className="block text-gray-700 mb-2">
                {entityType === 'driver' ? 'السائق' : 'المركبة'}
              </label>
              <select
                {...register('entityId')}
                className="w-full px-4 py-2 border rounded-md"
              >
                <option value="">
                  {entityType === 'driver' ? 'اختر السائق' : 'اختر المركبة'}
                </option>
                {entityType === 'driver' ? (
                  drivers.map(driver => (
                    <option key={driver.id} value={driver.id}>
                      {driver.firstName} {driver.lastName}
                    </option>
                  ))
                ) : (
                  vehicles.map(vehicle => (
                    <option key={vehicle.id} value={vehicle.id}>
                      {vehicle.make} {vehicle.model} - {vehicle.plateNumber}
                    </option>
                  ))
                )}
              </select>
              {errors.entityId && <p className="text-red-500 mt-1">{errors.entityId.message}</p>}
            </div>

            <div>
              <label className="block text-gray-700 mb-2">تاريخ الانتهاء (اختياري)</label>
              <input
                type="date"
                {...register('expiryDate')}
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">ملاحظات (اختياري)</label>
              <textarea
                {...register('notes')}
                className="w-full px-4 py-2 border rounded-md"
                rows={3}
                placeholder="أدخل أي ملاحظات إضافية"
              ></textarea>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">الملف</label>
              <div className="border-2 border-dashed border-gray-300 rounded-md p-4">
                <div className="flex items-center justify-center">
                  <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
                    <div className="flex flex-col items-center justify-center">
                      <FaUpload className="text-gray-400 text-3xl mb-2" />
                      <p className="text-sm text-gray-500">
                        {file ? file.name : 'انقر لاختيار ملف أو اسحب الملف هنا'}
                      </p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleFileChange}
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    />
                  </label>
                </div>
              </div>
              {!file && <p className="text-red-500 mt-1">الملف مطلوب</p>}
            </div>
          </div>

          {uploading && (
            <div className="mt-6">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-center mt-2">{Math.round(uploadProgress)}% مكتمل</p>
            </div>
          )}

          <div className="mt-6">
            <button
              type="submit"
              disabled={uploading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md disabled:bg-gray-400"
            >
              {uploading ? 'جاري الرفع...' : 'رفع الوثيقة'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
