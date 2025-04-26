"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { documentService, driverService, vehicleService } from '@/services/firestore';
import { Document as DocumentModel, Driver, Vehicle } from '@/models/types';
import Link from 'next/link';
import { FaPlus, FaDownload, FaTrash, FaSearch } from 'react-icons/fa';

export default function DocumentsPage() {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<DocumentModel[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (user?.officeId) {
        try {
          const [docsData, driversData, vehiclesData] = await Promise.all([
            documentService.getDocumentsByOffice(user.officeId),
            driverService.getDriversByOffice(user.officeId),
            vehicleService.getVehiclesByOffice(user.officeId)
          ]);
          setDocuments(docsData);
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

  const getEntityName = (entityId: string, entityType: 'driver' | 'vehicle') => {
    if (entityType === 'driver') {
      const driver = drivers.find(d => d.id === entityId);
      return driver ? `${driver.firstName} ${driver.lastName}` : 'غير معروف';
    } else {
      const vehicle = vehicles.find(v => v.id === entityId);
      return vehicle ? `${vehicle.make} ${vehicle.model} - ${vehicle.plateNumber}` : 'غير معروف';
    }
  };

  const handleDownload = async (document: DocumentModel) => {
    try {
      const url = await documentService.getDocumentDownloadUrl(document.id);
      window.open(url, '_blank');
    } catch (error) {
      console.error('Error downloading document:', error);
    }
  };

  const handleDelete = async (documentId: string) => {
    if (window.confirm('هل أنت متأكد من رغبتك في حذف هذا المستند؟')) {
      try {
        await documentService.deleteDocument(documentId);
        setDocuments(documents.filter(doc => doc.id !== documentId));
      } catch (error) {
        console.error('Error deleting document:', error);
      }
    }
  };

  const filteredDocuments = documents.filter(doc => 
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getEntityName(doc.entityId, doc.entityType).toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><div className="loader"></div></div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">إدارة الوثائق</h1>
        <Link href="/dashboard/documents/new" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center">
          <FaPlus className="mr-2" /> إضافة وثيقة جديدة
        </Link>
      </div>

      <div className="mb-6 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FaSearch className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="البحث عن وثائق..."
          className="w-full pl-10 pr-4 py-2 border rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredDocuments.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">لا توجد وثائق متاحة</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-right">اسم الوثيقة</th>
                <th className="py-3 px-4 text-right">النوع</th>
                <th className="py-3 px-4 text-right">متعلقة بـ</th>
                <th className="py-3 px-4 text-right">تاريخ الرفع</th>
                <th className="py-3 px-4 text-right">تاريخ الانتهاء</th>
                <th className="py-3 px-4 text-right">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredDocuments.map((doc) => (
                <tr key={doc.id} className="border-t hover:bg-gray-50">
                  <td className="py-3 px-4">{doc.name}</td>
                  <td className="py-3 px-4">{doc.type}</td>
                  <td className="py-3 px-4">{getEntityName(doc.entityId, doc.entityType)}</td>
                  <td className="py-3 px-4">{new Date(doc.uploadDate).toLocaleDateString('ar-SA')}</td>
                  <td className="py-3 px-4">
                    {doc.expiryDate ? new Date(doc.expiryDate).toLocaleDateString('ar-SA') : 'غير محدد'}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2 rtl:space-x-reverse">
                      <button
                        onClick={() => handleDownload(doc)}
                        className="text-blue-600 hover:text-blue-800"
                        title="تحميل"
                      >
                        <FaDownload />
                      </button>
                      <button
                        onClick={() => handleDelete(doc.id)}
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
