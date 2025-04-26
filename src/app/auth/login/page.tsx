"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function LoginPage() {
  const router = useRouter();
  const { loginWithPhone, verifyOTP } = useAuth();
  
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [verificationId, setVerificationId] = useState('');
  const [showRecoveryInfo, setShowRecoveryInfo] = useState(false);
  
  // إرسال رمز التحقق
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // التحقق من صحة رقم الهاتف
      if (!phoneNumber || phoneNumber.length < 10) {
        throw new Error('يرجى إدخال رقم هاتف صحيح');
      }
      
      // إرسال رمز التحقق
      const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;
      const vid = await loginWithPhone(formattedPhone);
      setVerificationId(vid);
      setStep('otp');
    } catch (err: any) {
      console.error('Error sending OTP:', err);
      setError(err.message || 'فشل في إرسال رمز التحقق. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };
  
  // التحقق من رمز OTP
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // التحقق من صحة رمز التحقق
      if (!otpCode || otpCode.length < 4) {
        throw new Error('يرجى إدخال رمز التحقق الصحيح');
      }
      
      // التحقق من رمز OTP
      await verifyOTP(verificationId, otpCode);
      
      // التوجيه إلى لوحة التحكم
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Error verifying OTP:', err);
      setError(err.message || 'رمز التحقق غير صحيح. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {step === 'phone' ? 'تسجيل الدخول إلى حسابك' : 'التحقق من رمز OTP'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {step === 'phone' 
              ? 'أدخل رقم هاتفك للحصول على رمز التحقق' 
              : 'أدخل رمز التحقق المرسل إلى هاتفك'}
          </p>
        </div>
        
        {step === 'phone' ? (
          <form className="mt-8 space-y-6" onSubmit={handleSendOTP}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="phone-number" className="sr-only">رقم الهاتف</label>
                <input
                  id="phone-number"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="رقم الهاتف (مثال: +966xxxxxxxxx)"
                  dir="ltr"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
            </div>
            
            {error && <div className="text-red-500 text-sm text-center">{error}</div>}
            
            <div>
              <button
                type="submit"
                disabled={loading}
                className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                  loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              >
                {loading ? 'جاري الإرسال...' : 'إرسال رمز التحقق'}
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <Link href="/auth/create-office" className="font-medium text-blue-600 hover:text-blue-500">
                  إنشاء حساب جديد
                </Link>
              </div>
              <div className="text-sm">
                <button
                  type="button"
                  className="font-medium text-blue-600 hover:text-blue-500"
                  onClick={() => setShowRecoveryInfo(!showRecoveryInfo)}
                >
                  فقدت الوصول لرقم الهاتف؟
                </button>
              </div>
            </div>
            
            {showRecoveryInfo && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="text-sm font-medium text-blue-800">استعادة الحساب</h3>
                <p className="mt-1 text-sm text-blue-700">
                  في حالة فقدان الوصول إلى رقم الهاتف المسجل، يرجى التواصل مع إدارة المنصة مباشرة عبر البريد الإلكتروني 
                  <a href="mailto:support@officeonway.com" className="underline"> support@officeonway.com </a>
                  أو الاتصال على الرقم 
                  <a href="tel:+966xxxxxxxxx" className="underline"> +966xxxxxxxxx </a>
                  لإثبات هويتك وإعادة تفعيل الحساب.
                </p>
              </div>
            )}
          </form>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleVerifyOTP}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="otp-code" className="sr-only">رمز التحقق</label>
                <input
                  id="otp-code"
                  name="otp"
                  type="text"
                  autoComplete="one-time-code"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="رمز التحقق"
                  dir="ltr"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                />
              </div>
            </div>
            
            {error && <div className="text-red-500 text-sm text-center">{error}</div>}
            
            <div>
              <button
                type="submit"
                disabled={loading}
                className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                  loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              >
                {loading ? 'جاري التحقق...' : 'تسجيل الدخول'}
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <button
                  type="button"
                  className="font-medium text-blue-600 hover:text-blue-500"
                  onClick={() => setStep('phone')}
                >
                  تغيير رقم الهاتف
                </button>
              </div>
              <div className="text-sm">
                <button
                  type="button"
                  className="font-medium text-blue-600 hover:text-blue-500"
                  onClick={handleSendOTP}
                  disabled={loading}
                >
                  إعادة إرسال الرمز
                </button>
              </div>
            </div>
          </form>
        )}
        
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">
                OfficeOnWay &copy; {new Date().getFullYear()}
              </span>
            </div>
          </div>
          
          <div className="mt-4 text-center text-xs text-gray-500">
            <Link href="/terms" className="hover:text-gray-700">شروط الاستخدام</Link>
            {' | '}
            <Link href="/privacy" className="hover:text-gray-700">سياسة الخصوصية</Link>
            {' | '}
            <Link href="/help" className="hover:text-gray-700">المساعدة والدعم</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
