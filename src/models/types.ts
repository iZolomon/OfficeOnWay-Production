// نماذج البيانات الأساسية للتطبيق

// نموذج المكتب
export interface Office {
  id: string;
  name: string;
  city: string;
  businessType: 'taxi' | 'delivery' | 'private' | 'other';
  logoUrl?: string;
  createdAt: Date;
  isActive: boolean;
  subscriptionStatus: 'active' | 'trial' | 'suspended';
  subscriptionEndDate?: Date;
  ownerId: string;
}

// نموذج السائق
export interface Driver {
  id: string;
  officeId: string;
  name: string;
  phone: string;
  identityNumber: string;
  joinDate: Date;
  isActive: boolean;
  currentVehicleId?: string;
  complianceRate: number; // نسبة الالتزام (0-100)
  tags?: string[]; // وسوم للسائق (مثلاً: "سائق ممتاز"، "سائق جديد")
}

// نموذج السيارة
export interface Vehicle {
  id: string;
  officeId: string;
  plateNumber: string;
  model: string;
  year?: number;
  color?: string;
  currentDriverId?: string;
  isActive: boolean;
  images?: string[]; // روابط لصور السيارة
  technicalStatus?: 'excellent' | 'good' | 'fair' | 'poor';
}

// نموذج العقد
export interface Contract {
  id: string;
  officeId: string;
  driverId: string;
  vehicleId: string;
  contractType: 'rental' | 'ownership' | 'monthly' | 'other';
  startDate: Date;
  endDate: Date;
  totalAmount: number;
  status: 'active' | 'completed' | 'cancelled';
  paymentFrequency: 'daily' | 'weekly' | 'monthly' | 'custom';
  notes?: string;
}

// نموذج الدفعة
export interface Payment {
  id: string;
  officeId: string;
  contractId: string;
  driverId: string;
  vehicleId: string;
  dueDate: Date;
  amount: number;
  status: 'paid' | 'due' | 'overdue' | 'cancelled';
  paidDate?: Date;
  notes?: string;
}

// نموذج الوثيقة
export interface Document {
  id: string;
  officeId: string;
  entityType: 'driver' | 'vehicle';
  entityId: string; // معرف السائق أو السيارة
  documentType: 'license' | 'insurance' | 'registration' | 'other';
  title: string;
  fileUrl: string;
  issueDate: Date;
  expiryDate: Date;
  status: 'valid' | 'expiring_soon' | 'expired';
  notes?: string;
}

// نموذج التنبيه
export interface Alert {
  id: string;
  officeId: string;
  title: string;
  description: string;
  createdAt: Date;
  priority: 'info' | 'warning' | 'critical';
  status: 'open' | 'closed';
  entityType?: 'driver' | 'vehicle' | 'contract' | 'document';
  entityId?: string; // معرف الكيان المرتبط (إن وجد)
  isRead: boolean;
}

// نموذج المستخدم/الموظف
export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: 'owner' | 'admin' | 'staff' | 'accountant' | 'supervisor';
  isActive: boolean;
  createdAt: Date;
  lastLogin?: Date;
  officeAccess: OfficeAccess[]; // المكاتب التي يمكن للمستخدم الوصول إليها
}

// نموذج صلاحيات الوصول للمكتب
export interface OfficeAccess {
  officeId: string;
  permissions: Permission[];
}

// أنواع الصلاحيات
export type Permission = 
  | 'manage_drivers'
  | 'manage_vehicles'
  | 'manage_contracts'
  | 'manage_payments'
  | 'manage_documents'
  | 'manage_alerts'
  | 'manage_staff'
  | 'view_analytics'
  | 'manage_settings';

// نموذج سجل النشاطات
export interface ActivityLog {
  id: string;
  officeId: string;
  userId: string;
  action: string;
  description: string;
  timestamp: Date;
  entityType?: 'driver' | 'vehicle' | 'contract' | 'document' | 'payment' | 'user' | 'office';
  entityId?: string;
}

// نموذج الإحصائيات
export interface Analytics {
  officeId: string;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  startDate: Date;
  endDate: Date;
  totalDrivers: number;
  totalVehicles: number;
  activeContracts: number;
  completedContracts: number;
  cancelledContracts: number;
  totalRevenue: number;
  paidPayments: number;
  overduePayments: number;
  averageComplianceRate: number;
  expiredDocuments: number;
  expiringDocuments: number;
}
