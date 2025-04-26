import { NextRequest, NextResponse } from 'next/server';
import twilio from 'twilio';

// تكوين Twilio
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

// إنشاء عميل Twilio
const twilioClient = twilio(accountSid, authToken);

// دالة لإرسال رسالة SMS
export async function POST(request: NextRequest) {
  try {
    // استخراج البيانات من الطلب
    const { phoneNumber, message } = await request.json();

    // التحقق من وجود البيانات المطلوبة
    if (!phoneNumber || !message) {
      return NextResponse.json(
        { success: false, error: 'Phone number and message are required' },
        { status: 400 }
      );
    }

    // تنسيق رقم الهاتف بالصيغة الدولية إذا لم يكن كذلك
    const formattedPhone = phoneNumber.startsWith('+') 
      ? phoneNumber 
      : `+${phoneNumber}`;

    // إرسال الرسالة
    const result = await twilioClient.messages.create({
      body: message,
      from: twilioPhoneNumber,
      to: formattedPhone
    });

    // إرجاع النتيجة
    return NextResponse.json({
      success: true,
      messageId: result.sid
    });
  } catch (error) {
    console.error('Error sending SMS:', error);
    
    return NextResponse.json(
      { success: false, error: 'Failed to send SMS' },
      { status: 500 }
    );
  }
}
