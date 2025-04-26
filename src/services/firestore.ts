import { db, storage } from './firebase';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  orderBy,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { User, Driver, Vehicle, Contract, Payment, Document, Alert, Office, Notification } from '@/models/types';

// User Service
export const userService = {
  getUserById: async (userId: string): Promise<User> => {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (!userDoc.exists()) {
      throw new Error('User not found');
    }
    return { id: userDoc.id, ...userDoc.data() } as User;
  },
  
  updateUser: async (userId: string, userData: Partial<User>): Promise<User> => {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, { ...userData, updatedAt: serverTimestamp() });
    const updatedUser = await getDoc(userRef);
    return { id: updatedUser.id, ...updatedUser.data() } as User;
  }
};

// Office Service
export const officeService = {
  getOfficeById: async (officeId: string): Promise<Office> => {
    const officeDoc = await getDoc(doc(db, 'offices', officeId));
    if (!officeDoc.exists()) {
      throw new Error('Office not found');
    }
    return { id: officeDoc.id, ...officeDoc.data() } as Office;
  },
  
  createOffice: async (officeData: Partial<Office>): Promise<string> => {
    const officeRef = await addDoc(collection(db, 'offices'), {
      ...officeData,
      driversCount: 0,
      vehiclesCount: 0,
      contractsCount: 0,
      paymentsCount: 0,
      documentsCount: 0,
      alertsCount: 0,
      createdAt: serverTimestamp()
    });
    return officeRef.id;
  },
  
  updateOffice: async (officeId: string, officeData: Partial<Office>): Promise<void> => {
    const officeRef = doc(db, 'offices', officeId);
    await updateDoc(officeRef, { ...officeData, updatedAt: serverTimestamp() });
  },
  
  updateUserOffice: async (userId: string, officeId: string): Promise<void> => {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, { 
      officeId, 
      role: 'admin',
      updatedAt: serverTimestamp() 
    });
  }
};

// Driver Service
export const driverService = {
  getDriversByOffice: async (officeId: string): Promise<Driver[]> => {
    const driversQuery = query(
      collection(db, 'drivers'),
      where('officeId', '==', officeId),
      orderBy('createdAt', 'desc')
    );
    const driverDocs = await getDocs(driversQuery);
    return driverDocs.docs.map(doc => ({ id: doc.id, ...doc.data() } as Driver));
  },
  
  getDriverById: async (driverId: string): Promise<Driver> => {
    const driverDoc = await getDoc(doc(db, 'drivers', driverId));
    if (!driverDoc.exists()) {
      throw new Error('Driver not found');
    }
    return { id: driverDoc.id, ...driverDoc.data() } as Driver;
  },
  
  addDriver: async (driverData: Partial<Driver>): Promise<string> => {
    const driverRef = await addDoc(collection(db, 'drivers'), {
      ...driverData,
      createdAt: serverTimestamp()
    });
    
    // Update office driver count
    const officeRef = doc(db, 'offices', driverData.officeId as string);
    const officeDoc = await getDoc(officeRef);
    if (officeDoc.exists()) {
      const officeData = officeDoc.data();
      await updateDoc(officeRef, {
        driversCount: (officeData.driversCount || 0) + 1,
        updatedAt: serverTimestamp()
      });
    }
    
    return driverRef.id;
  },
  
  updateDriver: async (driverId: string, driverData: Partial<Driver>): Promise<void> => {
    const driverRef = doc(db, 'drivers', driverId);
    await updateDoc(driverRef, { ...driverData, updatedAt: serverTimestamp() });
  },
  
  deleteDriver: async (driverId: string): Promise<void> => {
    const driverRef = doc(db, 'drivers', driverId);
    const driverDoc = await getDoc(driverRef);
    
    if (driverDoc.exists()) {
      const driverData = driverDoc.data();
      await deleteDoc(driverRef);
      
      // Update office driver count
      const officeRef = doc(db, 'offices', driverData.officeId);
      const officeDoc = await getDoc(officeRef);
      if (officeDoc.exists()) {
        const officeData = officeDoc.data();
        await updateDoc(officeRef, {
          driversCount: Math.max((officeData.driversCount || 0) - 1, 0),
          updatedAt: serverTimestamp()
        });
      }
    }
  }
};

// Vehicle Service
export const vehicleService = {
  getVehiclesByOffice: async (officeId: string): Promise<Vehicle[]> => {
    const vehiclesQuery = query(
      collection(db, 'vehicles'),
      where('officeId', '==', officeId),
      orderBy('createdAt', 'desc')
    );
    const vehicleDocs = await getDocs(vehiclesQuery);
    return vehicleDocs.docs.map(doc => ({ id: doc.id, ...doc.data() } as Vehicle));
  },
  
  getVehicleById: async (vehicleId: string): Promise<Vehicle> => {
    const vehicleDoc = await getDoc(doc(db, 'vehicles', vehicleId));
    if (!vehicleDoc.exists()) {
      throw new Error('Vehicle not found');
    }
    return { id: vehicleDoc.id, ...vehicleDoc.data() } as Vehicle;
  },
  
  addVehicle: async (vehicleData: Partial<Vehicle>): Promise<string> => {
    const vehicleRef = await addDoc(collection(db, 'vehicles'), {
      ...vehicleData,
      createdAt: serverTimestamp()
    });
    
    // Update office vehicle count
    const officeRef = doc(db, 'offices', vehicleData.officeId as string);
    const officeDoc = await getDoc(officeRef);
    if (officeDoc.exists()) {
      const officeData = officeDoc.data();
      await updateDoc(officeRef, {
        vehiclesCount: (officeData.vehiclesCount || 0) + 1,
        updatedAt: serverTimestamp()
      });
    }
    
    return vehicleRef.id;
  },
  
  updateVehicle: async (vehicleId: string, vehicleData: Partial<Vehicle>): Promise<void> => {
    const vehicleRef = doc(db, 'vehicles', vehicleId);
    await updateDoc(vehicleRef, { ...vehicleData, updatedAt: serverTimestamp() });
  },
  
  deleteVehicle: async (vehicleId: string): Promise<void> => {
    const vehicleRef = doc(db, 'vehicles', vehicleId);
    const vehicleDoc = await getDoc(vehicleRef);
    
    if (vehicleDoc.exists()) {
      const vehicleData = vehicleDoc.data();
      await deleteDoc(vehicleRef);
      
      // Update office vehicle count
      const officeRef = doc(db, 'offices', vehicleData.officeId);
      const officeDoc = await getDoc(officeRef);
      if (officeDoc.exists()) {
        const officeData = officeDoc.data();
        await updateDoc(officeRef, {
          vehiclesCount: Math.max((officeData.vehiclesCount || 0) - 1, 0),
          updatedAt: serverTimestamp()
        });
      }
    }
  }
};

// Contract Service
export const contractService = {
  getContractsByOffice: async (officeId: string): Promise<Contract[]> => {
    const contractsQuery = query(
      collection(db, 'contracts'),
      where('officeId', '==', officeId),
      orderBy('createdAt', 'desc')
    );
    const contractDocs = await getDocs(contractsQuery);
    return contractDocs.docs.map(doc => ({ id: doc.id, ...doc.data() } as Contract));
  },
  
  getContractById: async (contractId: string): Promise<Contract> => {
    const contractDoc = await getDoc(doc(db, 'contracts', contractId));
    if (!contractDoc.exists()) {
      throw new Error('Contract not found');
    }
    return { id: contractDoc.id, ...contractDoc.data() } as Contract;
  },
  
  addContract: async (contractData: Partial<Contract>): Promise<string> => {
    const contractRef = await addDoc(collection(db, 'contracts'), {
      ...contractData,
      createdAt: serverTimestamp()
    });
    
    // Update office contract count
    const officeRef = doc(db, 'offices', contractData.officeId as string);
    const officeDoc = await getDoc(officeRef);
    if (officeDoc.exists()) {
      const officeData = officeDoc.data();
      await updateDoc(officeRef, {
        contractsCount: (officeData.contractsCount || 0) + 1,
        updatedAt: serverTimestamp()
      });
    }
    
    return contractRef.id;
  },
  
  updateContract: async (contractId: string, contractData: Partial<Contract>): Promise<void> => {
    const contractRef = doc(db, 'contracts', contractId);
    await updateDoc(contractRef, { ...contractData, updatedAt: serverTimestamp() });
  },
  
  deleteContract: async (contractId: string): Promise<void> => {
    const contractRef = doc(db, 'contracts', contractId);
    const contractDoc = await getDoc(contractRef);
    
    if (contractDoc.exists()) {
      const contractData = contractDoc.data();
      await deleteDoc(contractRef);
      
      // Update office contract count
      const officeRef = doc(db, 'offices', contractData.officeId);
      const officeDoc = await getDoc(officeRef);
      if (officeDoc.exists()) {
        const officeData = officeDoc.data();
        await updateDoc(officeRef, {
          contractsCount: Math.max((officeData.contractsCount || 0) - 1, 0),
          updatedAt: serverTimestamp()
        });
      }
    }
  }
};

// Payment Service
export const paymentService = {
  getPaymentsByOffice: async (officeId: string): Promise<Payment[]> => {
    const paymentsQuery = query(
      collection(db, 'payments'),
      where('officeId', '==', officeId),
      orderBy('createdAt', 'desc')
    );
    const paymentDocs = await getDocs(paymentsQuery);
    return paymentDocs.docs.map(doc => ({ id: doc.id, ...doc.data() } as Payment));
  },
  
  getPaymentById: async (paymentId: string): Promise<Payment> => {
    const paymentDoc = await getDoc(doc(db, 'payments', paymentId));
    if (!paymentDoc.exists()) {
      throw new Error('Payment not found');
    }
    return { id: paymentDoc.id, ...paymentDoc.data() } as Payment;
  },
  
  addPayment: async (paymentData: Partial<Payment>): Promise<string> => {
    const paymentRef = await addDoc(collection(db, 'payments'), {
      ...paymentData,
      createdAt: serverTimestamp()
    });
    
    // Update office payment count
    const officeRef = doc(db, 'offices', paymentData.officeId as string);
    const officeDoc = await getDoc(officeRef);
    if (officeDoc.exists()) {
      const officeData = officeDoc.data();
      await updateDoc(officeRef, {
        paymentsCount: (officeData.paymentsCount || 0) + 1,
        updatedAt: serverTimestamp()
      });
    }
    
    return paymentRef.id;
  },
  
  updatePayment: async (paymentId: string, paymentData: Partial<Payment>): Promise<void> => {
    const paymentRef = doc(db, 'payments', paymentId);
    await updateDoc(paymentRef, { ...paymentData, updatedAt: serverTimestamp() });
  },
  
  deletePayment: async (paymentId: string): Promise<void> => {
    const paymentRef = doc(db, 'payments', paymentId);
    const paymentDoc = await getDoc(paymentRef);
    
    if (paymentDoc.exists()) {
      const paymentData = paymentDoc.data();
      await deleteDoc(paymentRef);
      
      // Update office payment count
      const officeRef = doc(db, 'offices', paymentData.officeId);
      const officeDoc = await getDoc(officeRef);
      if (officeDoc.exists()) {
        const officeData = officeDoc.data();
        await updateDoc(officeRef, {
          paymentsCount: Math.max((officeData.paymentsCount || 0) - 1, 0),
          updatedAt: serverTimestamp()
        });
      }
    }
  }
};

// Document Service
export const documentService = {
  getDocumentsByOffice: async (officeId: string): Promise<Document[]> => {
    const documentsQuery = query(
      collection(db, 'documents'),
      where('officeId', '==', officeId),
      orderBy('createdAt', 'desc')
    );
    const documentDocs = await getDocs(documentsQuery);
    return documentDocs.docs.map(doc => ({ id: doc.id, ...doc.data() } as Document));
  },
  
  getDocumentById: async (documentId: string): Promise<Document> => {
    const documentDoc = await getDoc(doc(db, 'documents', documentId));
    if (!documentDoc.exists()) {
      throw new Error('Document not found');
    }
    return { id: documentDoc.id, ...documentDoc.data() } as Document;
  },
  
  addDocument: async (documentData: Partial<Document>): Promise<string> => {
    const documentRef = await addDoc(collection(db, 'documents'), {
      ...documentData,
      createdAt: serverTimestamp()
    });
    
    // Update office document count
    const officeRef = doc(db, 'offices', documentData.officeId as string);
    const officeDoc = await getDoc(officeRef);
    if (officeDoc.exists()) {
      const officeData = officeDoc.data();
      await updateDoc(officeRef, {
        documentsCount: (officeData.documentsCount || 0) + 1,
        updatedAt: serverTimestamp()
      });
    }
    
    return documentRef.id;
  },
  
  updateDocument: async (documentId: string, documentData: Partial<Document>): Promise<void> => {
    const documentRef = doc(db, 'documents', documentId);
    await updateDoc(documentRef, { ...documentData, updatedAt: serverTimestamp() });
  },
  
  deleteDocument: async (documentId: string): Promise<void> => {
    const documentRef = doc(db, 'documents', documentId);
    const documentDoc = await getDoc(documentRef);
    
    if (documentDoc.exists()) {
      const documentData = documentDoc.data();
      
      // Delete file from storage if exists
      if (documentData.fileUrl) {
        try {
          const fileRef = ref(storage, documentData.fileUrl);
          await deleteObject(fileRef);
        } catch (error) {
          console.error('Error deleting file:', error);
        }
      }
      
      await deleteDoc(documentRef);
      
      // Update office document count
      const officeRef = doc(db, 'offices', documentData.officeId);
      const officeDoc = await getDoc(officeRef);
      if (officeDoc.exists()) {
        const officeData = officeDoc.data();
        await updateDoc(officeRef, {
          documentsCount: Math.max((officeData.documentsCount || 0) - 1, 0),
          updatedAt: serverTimestamp()
        });
      }
    }
  }
};

// Alert Service
export const alertService = {
  getAlertsByOffice: async (officeId: string): Promise<Alert[]> => {
    const alertsQuery = query(
      collection(db, 'alerts'),
      where('officeId', '==', officeId),
      orderBy('createdAt', 'desc')
    );
    const alertDocs = await getDocs(alertsQuery);
    return alertDocs.docs.map(doc => ({ id: doc.id, ...doc.data() } as Alert));
  },
  
  getAlertById: async (alertId: string): Promise<Alert> => {
    const alertDoc = await getDoc(doc(db, 'alerts', alertId));
    if (!alertDoc.exists()) {
      throw new Error('Alert not found');
    }
    return { id: alertDoc.id, ...alertDoc.data() } as Alert;
  },
  
  addAlert: async (alertData: Partial<Alert>): Promise<string> => {
    const alertRef = await addDoc(collection(db, 'alerts'), {
      ...alertData,
      createdAt: serverTimestamp()
    });
    
    // Update office alert count
    const officeRef = doc(db, 'offices', alertData.officeId as string);
    const officeDoc = await getDoc(officeRef);
    if (officeDoc.exists()) {
      const officeData = officeDoc.data();
      await updateDoc(officeRef, {
        alertsCount: (officeData.alertsCount || 0) + 1,
        updatedAt: serverTimestamp()
      });
    }
    
    return alertRef.id;
  },
  
  updateAlert: async (alertId: string, alertData: Partial<Alert>): Promise<void> => {
    const alertRef = doc(db, 'alerts', alertId);
    await updateDoc(alertRef, { ...alertData, updatedAt: serverTimestamp() });
  },
  
  deleteAlert: async (alertId: string): Promise<void> => {
    const alertRef = doc(db, 'alerts', alertId);
    const alertDoc = await getDoc(alertRef);
    
    if (alertDoc.exists()) {
      const alertData = alertDoc.data();
      await deleteDoc(alertRef);
      
      // Update office alert count
      const officeRef = doc(db, 'offices', alertData.officeId);
      const officeDoc = await getDoc(officeRef);
      if (officeDoc.exists()) {
        const officeData = officeDoc.data();
        await updateDoc(officeRef, {
          alertsCount: Math.max((officeData.alertsCount || 0) - 1, 0),
          updatedAt: serverTimestamp()
        });
      }
    }
  }
};

// Storage Service
export const storageService = {
  uploadFile: async (file: File, path: string): Promise<string> => {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  },
  
  deleteFile: async (path: string): Promise<void> => {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  }
};

// Notification Service
export const notificationService = {
  getNotificationsByOffice: async (officeId: string): Promise<Notification[]> => {
    const notificationsQuery = query(
      collection(db, 'notifications'),
      where('officeId', '==', officeId),
      orderBy('createdAt', 'desc')
    );
    const notificationDocs = await getDocs(notificationsQuery);
    return notificationDocs.docs.map(doc => ({ id: doc.id, ...doc.data() } as Notification));
  },
  
  getNotificationSettings: async (officeId: string): Promise<any> => {
    const settingsQuery = query(
      collection(db, 'notificationSettings'),
      where('officeId', '==', officeId)
    );
    const settingsDocs = await getDocs(settingsQuery);
    if (settingsDocs.empty) {
      return null;
    }
    return { id: settingsDocs.docs[0].id, ...settingsDocs.docs[0].data() };
  },
  
  updateNotificationSettings: async (officeId: string, settingsData: any): Promise<void> => {
    const settingsQuery = query(
      collection(db, 'notificationSettings'),
      where('officeId', '==', officeId)
    );
    const settingsDocs = await getDocs(settingsQuery);
    
    if (settingsDocs.empty) {
      await addDoc(collection(db, 'notificationSettings'), {
        ...settingsData,
        officeId,
        createdAt: serverTimestamp()
      });
    } else {
      const settingsRef = doc(db, 'notificationSettings', settingsDocs.docs[0].id);
      await updateDoc(settingsRef, { ...settingsData, updatedAt: serverTimestamp() });
    }
  },
  
  addNotification: async (notificationData: Partial<Notification>): Promise<string> => {
    const notificationRef = await addDoc(collection(db, 'notifications'), {
      ...notificationData,
      read: false,
      createdAt: serverTimestamp()
    });
    return notificationRef.id;
  },
  
  markNotificationAsRead: async (notificationId: string): Promise<void> => {
    const notificationRef = doc(db, 'notifications', notificationId);
    await updateDoc(notificationRef, { 
      read: true, 
      updatedAt: serverTimestamp() 
    });
  },
  
  deleteNotification: async (notificationId: string): Promise<void> => {
    const notificationRef = doc(db, 'notifications', notificationId);
    await deleteDoc(notificationRef);
  }
};
