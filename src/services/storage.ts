import { storage } from '@/services/firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

// خدمة التخزين للملفات والصور
export const storageService = {
  // رفع ملف إلى Firebase Storage
  async uploadFile(file: File, path: string): Promise<string> {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  },
  
  // رفع صورة مع تحديد مسار مخصص
  async uploadImage(file: File, folder: string, fileName: string): Promise<string> {
    const fileExtension = file.name.split('.').pop();
    const path = `${folder}/${fileName}.${fileExtension}`;
    return this.uploadFile(file, path);
  },
  
  // رفع صورة لوجو المكتب
  async uploadOfficeLogo(file: File, officeId: string): Promise<string> {
    return this.uploadImage(file, 'offices', `logo_${officeId}`);
  },
  
  // رفع صورة سيارة
  async uploadVehicleImage(file: File, vehicleId: string, index: number = 0): Promise<string> {
    return this.uploadImage(file, 'vehicles', `vehicle_${vehicleId}_${index}`);
  },
  
  // رفع صورة وثيقة
  async uploadDocumentFile(file: File, entityType: 'driver' | 'vehicle', entityId: string, documentType: string): Promise<string> {
    return this.uploadImage(file, 'documents', `${entityType}_${entityId}_${documentType}`);
  },
  
  // الحصول على رابط تحميل ملف
  async getFileURL(path: string): Promise<string> {
    const storageRef = ref(storage, path);
    return getDownloadURL(storageRef);
  },
  
  // حذف ملف
  async deleteFile(path: string): Promise<void> {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  }
};
