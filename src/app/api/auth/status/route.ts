import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/services/firebase';
import { userService } from '@/services/firestore';

// API route للتحقق من حالة المصادقة
export async function GET(request: NextRequest) {
  try {
    // استخراج token من الطلب
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const token = authHeader.split('Bearer ')[1];
    
    // التحقق من صحة الـ token
    const decodedToken = await auth.verifyIdToken(token);
    
    // الحصول على بيانات المستخدم
    const user = await userService.getUser(decodedToken.uid);
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }
    
    // إرجاع بيانات المستخدم
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        officeAccess: user.officeAccess
      }
    });
  } catch (error) {
    console.error('Error verifying auth status:', error);
    
    return NextResponse.json(
      { success: false, error: 'Authentication failed' },
      { status: 401 }
    );
  }
}
