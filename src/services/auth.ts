import { 
  PhoneAuthProvider,
  signInWithCredential,
  signOut,
  RecaptchaVerifier,
  signInWithPhoneNumber
} from 'firebase/auth';
import { auth } from './firebase';
import { userService } from './firestore';
import { User } from '@/models/types';

// خدمة المصادقة
export const authService = {
  // Session timeout in minutes
  sessionTimeout: 60,
  // تهيئة reCAPTCHA
  initRecaptcha(containerId: string) {
    if (typeof window !== 'undefined') {
      return new RecaptchaVerifier(auth, containerId, {
        size: 'invisible',
        callback: () => {}
      });
    }
    return null;
  },

  // إرسال رمز التحقق إلى رقم الهاتف
  async sendOTP(phoneNumber: string, recaptchaVerifier: RecaptchaVerifier) {
    try {
      // تنسيق رقم الهاتف بالصيغة الدولية إذا لم يكن كذلك
      const formattedPhone = phoneNumber.startsWith('+') 
        ? phoneNumber 
        : `+${phoneNumber}`;
      
      // إرسال رمز التحقق
      const confirmationResult = await signInWithPhoneNumber(
        auth, 
        formattedPhone, 
        recaptchaVerifier
      );
      
      return {
        success: true,
        confirmationResult
      };
    } catch (error) {
      console.error('Error sending OTP:', error);
      return {
        success: false,
        error
      };
    }
  },

  // التحقق من رمز OTP والدخول
  async verifyOTP(confirmationResult: any, otp: string) {
    try {
      // التحقق من الرمز
      const credential = PhoneAuthProvider.credential(
        confirmationResult.verificationId, 
        otp
      );
      
      // تسجيل الدخول باستخدام الاعتماد
      const userCredential = await signInWithCredential(auth, credential);
      
      // الحصول على معرف المستخدم
      const uid = userCredential.user.uid;
      const phoneNumber = userCredential.user.phoneNumber || '';
      
      // التحقق مما إذا كان المستخدم موجودًا في قاعدة البيانات
      let user = await userService.getUser(uid);
      
      // إذا لم يكن المستخدم موجودًا، قم بإنشاء مستخدم جديد
      if (!user) {
        // إنشاء مستخدم جديد في Firestore
        const newUser: Omit<User, 'id'> = {
          name: 'مستخدم جديد',
          phone: phoneNumber,
          role: 'owner',
          isActive: true,
          createdAt: new Date(),
          officeAccess: []
        };
        
        await userService.createUser({
          ...newUser,
          id: uid
        } as User);
        
        user = await userService.getUser(uid);
      }
      
      // تحديث آخر تسجيل دخول
      await userService.updateUser(uid, {
        lastLogin: new Date()
      });
      
      return {
        success: true,
        user
      };
    } catch (error) {
      console.error('Error verifying OTP:', error);
      return {
        success: false,
        error
      };
    }
  },

  // تسجيل الخروج
  async logout() {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      console.error('Error signing out:', error);
      return {
        success: false,
        error
      };
    }
  },

  // الحصول على المستخدم الحالي
  getCurrentUser() {
    return auth.currentUser;
  },

  // الاستماع لتغييرات حالة المصادقة
  onAuthStateChanged(callback: (user: any) => void) {
    return auth.onAuthStateChanged(callback);
  }
};
