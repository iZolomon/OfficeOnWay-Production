# دليل تثبيت ونشر مشروع OfficeOnWay

## المقدمة

هذا الدليل يشرح كيفية تثبيت ونشر مشروع OfficeOnWay، وهو منصة ويب (PWA) لإدارة مكاتب الأجرة والنقل الخاص والتوصيل. المشروع مبني باستخدام Next.js وFirebase.

## المتطلبات الأساسية

قبل البدء، تأكد من توفر المتطلبات التالية:

1. حساب على [Vercel](https://vercel.com) لنشر الموقع
2. مشروع [Firebase](https://firebase.google.com) مع تفعيل الخدمات التالية:
   - Authentication (المصادقة)
   - Firestore Database (قاعدة البيانات)
   - Storage (التخزين)
3. حساب [Twilio](https://twilio.com) (اختياري، للإشعارات عبر الرسائل القصيرة)
4. نطاق مخصص (اختياري)

## خطوات التثبيت

### 1. إعداد مشروع Firebase

1. قم بإنشاء مشروع جديد في [Firebase Console](https://console.firebase.google.com)
2. قم بتفعيل خدمة المصادقة (Authentication) مع تمكين مزود المصادقة عبر رقم الهاتف
3. قم بتفعيل خدمة Firestore Database
4. قم بتفعيل خدمة Storage
5. انتقل إلى إعدادات المشروع (Project Settings)
6. في قسم "Your apps"، انقر على أيقونة الويب (</>) لإضافة تطبيق ويب جديد
7. قم بتسمية التطبيق (مثل "OfficeOnWay-Web") واتبع الخطوات
8. احتفظ بمفاتيح التكوين (apiKey, authDomain, projectId, إلخ) لاستخدامها لاحقاً

### 2. إعداد حساب Twilio (اختياري)

1. قم بإنشاء حساب على [Twilio](https://twilio.com)
2. قم بشراء رقم هاتف من Twilio
3. احصل على معرف الحساب (Account SID) ومفتاح المصادقة (Auth Token)
4. احتفظ بهذه المعلومات لاستخدامها لاحقاً

### 3. نشر المشروع على Vercel

#### الطريقة الأولى: استخدام واجهة Vercel عبر الإنترنت

1. قم بتسجيل الدخول إلى [Vercel](https://vercel.com)
2. انقر على "New Project" (مشروع جديد)
3. اختر "Import Git Repository" (استيراد مستودع Git) أو "Upload" (رفع) حسب طريقتك المفضلة
4. إذا اخترت الرفع، قم برفع مجلد `src` من هذا المشروع
5. في صفحة التكوين، انتقل إلى قسم "Environment Variables" (متغيرات البيئة)
6. أضف متغيرات البيئة التالية:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
NEXT_PUBLIC_DEFAULT_LANGUAGE=ar
NEXT_PUBLIC_DOMAIN=www.officeonway.com
NEXT_DISABLE_ESLINT=1
```

7. انقر على "Deploy" (نشر) وانتظر حتى اكتمال عملية النشر

#### الطريقة الثانية: استخدام Vercel CLI

1. قم بتثبيت Vercel CLI عبر npm:
```bash
npm install -g vercel
```

2. انتقل إلى مجلد المشروع وقم بتنفيذ الأمر:
```bash
vercel
```

3. اتبع التعليمات على الشاشة وأدخل متغيرات البيئة عند طلبها

### 4. ربط نطاق مخصص (اختياري)

1. في لوحة تحكم Vercel، انتقل إلى مشروعك
2. انقر على تبويب "Domains" (النطاقات)
3. أضف النطاق المخصص الخاص بك (مثل officeonway.com)
4. اتبع التعليمات لتكوين إعدادات DNS

## التحقق من النشر

بعد اكتمال عملية النشر، يمكنك الوصول إلى موقعك من خلال الرابط الذي يوفره Vercel أو من خلال النطاق المخصص إذا قمت بإعداده.

تأكد من اختبار الوظائف التالية:
1. تسجيل الدخول باستخدام رقم الهاتف
2. إدارة السائقين والمركبات
3. إدارة العقود والوثائق
4. نظام المحاسبة والتقارير المالية
5. لوحات التحليلات التفاعلية
6. نظام الإشعارات والتنبيهات

## استكشاف الأخطاء وإصلاحها

### مشاكل في عملية البناء

إذا واجهت أخطاء ESLint أثناء عملية البناء، تأكد من:
1. إضافة متغير البيئة `NEXT_DISABLE_ESLINT=1`
2. استخدام ملف `.eslintrc.json` المتوفر في مجلد `config`
3. استخدام ملف `next.config.js` المتوفر في مجلد `config`

### مشاكل في الاتصال بـ Firebase

إذا واجهت مشاكل في الاتصال بـ Firebase، تحقق من:
1. صحة مفاتيح Firebase في متغيرات البيئة
2. تفعيل خدمات Firebase المطلوبة (Authentication, Firestore, Storage)
3. إعدادات قواعد الأمان في Firebase

### مشاكل في إرسال الرسائل القصيرة

إذا واجهت مشاكل في إرسال الرسائل القصيرة عبر Twilio، تحقق من:
1. صحة معرف الحساب ومفتاح المصادقة ورقم الهاتف في متغيرات البيئة
2. حالة حساب Twilio (تأكد من أنه نشط وبه رصيد كافٍ)

## تحديث الموقع

لتحديث الموقع بعد إجراء تغييرات:

1. قم بتعديل الملفات المطلوبة
2. إذا كنت تستخدم Git، قم بدفع التغييرات إلى المستودع
3. سيقوم Vercel تلقائياً بإعادة نشر الموقع

إذا كنت تستخدم طريقة الرفع المباشر، ستحتاج إلى إعادة رفع الملفات المحدثة وإعادة النشر يدوياً.

## الدعم والمساعدة

إذا واجهت أي مشاكل أو كانت لديك أسئلة، يرجى الرجوع إلى:
1. وثائق المستخدم في مجلد `docs`
2. وثائق المطور في مجلد `docs/developer`
3. قسم استكشاف الأخطاء وإصلاحها في هذا الدليل

نتمنى لك التوفيق في استخدام منصة OfficeOnWay!
