"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { analyticsService, driverService, vehicleService, contractService, paymentService } from '@/services/firestore';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';

export default function AnalyticsPage() {
  const { user } = useAuth();
  const [selectedOfficeId, setSelectedOfficeId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // بيانات التحليلات
  const [driversStats, setDriversStats] = useState({ total: 0, active: 0, inactive: 0 });
  const [vehiclesStats, setVehiclesStats] = useState({ total: 0, active: 0, inactive: 0 });
  const [contractsStats, setContractsStats] = useState({ total: 0, active: 0, completed: 0, cancelled: 0 });
  const [paymentsStats, setPaymentsStats] = useState({ total: 0, totalAmount: 0, paid: 0, due: 0, overdue: 0 });
  const [monthlyRevenue, setMonthlyRevenue] = useState<any[]>([]);
  const [contractTypes, setContractTypes] = useState<any[]>([]);
  const [vehicleUtilization, setVehicleUtilization] = useState<any[]>([]);

  // ألوان للرسوم البيانية
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  // جلب بيانات التحليلات عند تحميل الصفحة
  useEffect(() => {
    const fetchAnalyticsData = async () => {
      if (!selectedOfficeId) return;
      
      setLoading(true);
      try {
        // جلب إحصائيات السائقين
        const drivers = await driverService.getDriversByOffice(selectedOfficeId);
        setDriversStats({
          total: drivers.length,
          active: drivers.filter(d => d.isActive).length,
          inactive: drivers.filter(d => !d.isActive).length
        });
        
        // جلب إحصائيات المركبات
        const vehicles = await vehicleService.getVehiclesByOffice(selectedOfficeId);
        setVehiclesStats({
          total: vehicles.length,
          active: vehicles.filter(v => v.isActive).length,
          inactive: vehicles.filter(v => !v.isActive).length
        });
        
        // جلب إحصائيات العقود
        const contracts = await contractService.getContractsByOffice(selectedOfficeId);
        setContractsStats({
          total: contracts.length,
          active: contracts.filter(c => c.status === 'active').length,
          completed: contracts.filter(c => c.status === 'completed').length,
          cancelled: contracts.filter(c => c.status === 'cancelled').length
        });
        
        // تحليل أنواع العقود
        const contractTypeData = [
          { name: 'إيجار', value: contracts.filter(c => c.contractType === 'rental').length },
          { name: 'تمليك', value: contracts.filter(c => c.contractType === 'ownership').length },
          { name: 'شهري', value: contracts.filter(c => c.contractType === 'monthly').length },
          { name: 'أخرى', value: contracts.filter(c => c.contractType === 'other').length }
        ];
        setContractTypes(contractTypeData);
        
        // جلب إحصائيات المدفوعات
        const payments = await paymentService.getPaymentsByOffice(selectedOfficeId);
        const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);
        setPaymentsStats({
          total: payments.length,
          totalAmount,
          paid: payments.filter(p => p.status === 'paid').length,
          due: payments.filter(p => p.status === 'due').length,
          overdue: payments.filter(p => p.status === 'overdue').length
        });
        
        // تحليل الإيرادات الشهرية
        const last6Months = Array.from({ length: 6 }, (_, i) => {
          const date = new Date();
          date.setMonth(date.getMonth() - i);
          return {
            month: date.toLocaleDateString('ar-SA', { month: 'long' }),
            date: date
          };
        }).reverse();
        
        const monthlyRevenueData = last6Months.map(month => {
          const monthPayments = payments.filter(p => {
            const paymentDate = new Date(p.paymentDate);
            return paymentDate.getMonth() === month.date.getMonth() && 
                   paymentDate.getFullYear() === month.date.getFullYear();
          });
          
          return {
            name: month.month,
            amount: monthPayments.reduce((sum, p) => sum + p.amount, 0)
          };
        });
        setMonthlyRevenue(monthlyRevenueData);
        
        // تحليل استخدام المركبات
        const vehicleUsageData = vehicles.map(vehicle => {
          const vehicleContracts = contracts.filter(c => c.vehicleId === vehicle.id);
          return {
            name: vehicle.plateNumber,
            contracts: vehicleContracts.length,
            revenue: payments
              .filter(p => p.vehicleId === vehicle.id)
              .reduce((sum, p) => sum + p.amount, 0)
          };
        }).sort((a, b) => b.revenue - a.revenue).slice(0, 5);
        setVehicleUtilization(vehicleUsageData);
        
      } catch (err) {
        console.error('Error fetching analytics data:', err);
        setError('فشل في جلب بيانات التحليلات');
      } finally {
        setLoading(false);
      }
    };
    
    // استخدام المكتب المحدد من URL أو localStorage
    const getSelectedOffice = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const officeId = urlParams.get('office');
      
      if (officeId) {
        setSelectedOfficeId(officeId);
        localStorage.setItem('selectedOfficeId', officeId);
      } else {
        const savedOfficeId = localStorage.getItem('selectedOfficeId');
        if (savedOfficeId) {
          setSelectedOfficeId(savedOfficeId);
        }
      }
    };
    
    getSelectedOffice();
    if (selectedOfficeId) {
      fetchAnalyticsData();
    }
  }, [selectedOfficeId]);

  // تنسيق المبالغ المالية
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'SAR' }).format(amount);
  };

  return (
    <div className="h-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">لوحة التحليلات</h1>
        <p className="text-gray-600">عرض تحليلي لأداء المكتب والإحصائيات الرئيسية</p>
      </div>
      
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="p-6 text-center text-red-500">{error}</div>
      ) : (
        <div className="space-y-6">
          {/* بطاقات الإحصائيات */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* إحصائيات السائقين */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">إجمالي السائقين</p>
                  <p className="text-3xl font-bold text-gray-800">{driversStats.total}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between text-sm">
                <div>
                  <span className="text-green-600 font-medium">{driversStats.active}</span> نشط
                </div>
                <div>
                  <span className="text-red-600 font-medium">{driversStats.inactive}</span> غير نشط
                </div>
              </div>
            </div>
            
            {/* إحصائيات المركبات */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">إجمالي المركبات</p>
                  <p className="text-3xl font-bold text-gray-800">{vehiclesStats.total}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                  <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between text-sm">
                <div>
                  <span className="text-green-600 font-medium">{vehiclesStats.active}</span> نشط
                </div>
                <div>
                  <span className="text-red-600 font-medium">{vehiclesStats.inactive}</span> غير نشط
                </div>
              </div>
            </div>
            
            {/* إحصائيات العقود */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">إجمالي العقود</p>
                  <p className="text-3xl font-bold text-gray-800">{contractsStats.total}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
                  <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between text-sm">
                <div>
                  <span className="text-green-600 font-medium">{contractsStats.active}</span> نشط
                </div>
                <div>
                  <span className="text-blue-600 font-medium">{contractsStats.completed}</span> مكتمل
                </div>
                <div>
                  <span className="text-red-600 font-medium">{contractsStats.cancelled}</span> ملغي
                </div>
              </div>
            </div>
            
            {/* إحصائيات المدفوعات */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">إجمالي المدفوعات</p>
                  <p className="text-3xl font-bold text-gray-800">{formatCurrency(paymentsStats.totalAmount)}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between text-sm">
                <div>
                  <span className="text-green-600 font-medium">{paymentsStats.paid}</span> مدفوع
                </div>
                <div>
                  <span className="text-yellow-600 font-medium">{paymentsStats.due}</span> مستحق
                </div>
                <div>
                  <span className="text-red-600 font-medium">{paymentsStats.overdue}</span> متأخر
                </div>
              </div>
            </div>
          </div>
          
          {/* الرسوم البيانية */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* الإيرادات الشهرية */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">الإيرادات الشهرية</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={monthlyRevenue}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    <Legend />
                    <Bar dataKey="amount" name="الإيرادات" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {/* توزيع أنواع العقود */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">توزيع أنواع العقود</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={contractTypes}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {contractTypes.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => value} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {/* أعلى المركبات من حيث الإيرادات */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">أعلى المركبات من حيث الإيرادات</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={vehicleUtilization}
                    layout="vertical"
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" />
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    <Legend />
                    <Bar dataKey="revenue" name="الإيرادات" fill="#00C49F" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {/* عدد العقود لكل مركبة */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">عدد العقود لكل مركبة</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={vehicleUtilization}
                    layout="vertical"
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="contracts" name="عدد العقود" fill="#0088FE" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          
          {/* ملاحظات وتوصيات */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">ملاحظات وتوصيات</h2>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-medium text-blue-800">تحليل الأداء</h3>
                <p className="mt-1 text-blue-700">
                  بناءً على البيانات المتاحة، يمكن تحسين أداء المكتب من خلال زيادة عدد العقود النشطة وتقليل العقود الملغاة.
                </p>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h3 className="font-medium text-green-800">فرص النمو</h3>
                <p className="mt-1 text-green-700">
                  هناك فرصة لزيادة الإيرادات من خلال التركيز على عقود التمليك والعقود الشهرية التي تظهر أداءً جيداً في التحليلات.
                </p>
              </div>
              
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <h3 className="font-medium text-yellow-800">المدفوعات المتأخرة</h3>
                <p className="mt-1 text-yellow-700">
                  يوجد {paymentsStats.overdue} مدفوعات متأخرة بحاجة إلى متابعة عاجلة لتحسين التدفق النقدي للمكتب.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
