# وثيقة عقد واجهات برمجة التطبيقات (API Contract)
# Sanad Academy Platform & Backend API Specification

وثيقة مرجعية شاملة لكافة نقاط الاتصال (Endpoints) والأنماط المعمارية للربط بين خادم الباك إند المستقل (`backend/`)، وموقع الأكاديمية الخارجي (`Next.js`)، ولوحة الإدارة والتحكم (`Dashboard`).

---

## 1. المعايير العامة والأسس المعمارية (Architecture & Conventions)

### 1.1 عناوين الخادم (Base URLs)
| البيئة | Base URL | الوصف |
| :--- | :--- | :--- |
| **التطوير المحلي (Local Dev)** | `http://localhost:5180/api` | المنفذ الافتراضي للباك إند المستقل |
| **فحص الصحة (Root Health)** | `http://localhost:5180/health` | فحص عمل الخادم دون بادئة `/api` |
| **واجهة التوثيق التفاعلية** | `http://localhost:5180/api/swagger` | Scalar / OpenAPI Documentation UI |
| **الإنتاج (Production)** | `https://api.sanad.academy/api` | النطاق الإنتاجي للخدمات السحابية |

### 1.2 ترويسات الطلب القياسية (Request Headers)
- `Content-Type: application/json`: إلزامي لجميع طلبات `POST`, `PUT`, `PATCH`.
- `Authorization: Bearer <session_token>`: مطلوب للطلبات المحمية (Dashboard & Admin).
- `Origin: <client_origin>`: يُرسل تلقائياً من المتصفحات للتحقق من CORS.
- `x-mobile-unit-token`: مخصص لعمليات الوحدات المتنقلة إن وُجدت.

### 1.3 النسق العام للردود (Response Formatting)
- **الردود الناجحة (Success):** تُعاد البيانات إما مباشرة كـ Object أو Array، أو ضمن هيكل `{ data: ... }`.
- **الردود الخالية (No Content - 204):** تُعاد برأس خالي من الجسم لتفادي أخطاء الـ HTTP Parsers.
- **أخطاء التحقق والمدخلات (Validation Error - 422 / 400):**
  ```json
  {
    "message": "بيانات الطلب غير صالحة",
    "issues": [
      {
        "field": "customerPhone",
        "message": "رقم جوال غير صالح"
      }
    ]
  }
  ```
- **أخطاء الأمان والمصادقة (Auth - 401 / 403):**
  ```json
  {
    "message": "غير مصرح"
  }
  ```
- **أخطاء الخادم غير المتوقعة (Server Error - 500):**
  ```json
  {
    "message": "حدث خطأ غير متوقع"
  }
  ```

---

## 2. واجهات الموقع الخارجي العامة (Public Endpoints)

> **ملاحظة أمان:** هذه المسارات متاحة للعامة بدون توثيق (Unauthenticated) وتُستخدم من قبل موقع الـ Next.js لجلب بيانات الدورات والتصنيفات وحجز المقاعد وتقييم المستويات.

### 2.1 جلب بيانات الأكاديمية (Get Academy Details)
- **المسار:** `GET /public/clinic/:slug`
- **المعلمات (Params):** `slug` (مثال: `sanad`)
- **حالات الرد:**
  - `200 OK`:
    ```json
    {
      "id": "cuid...",
      "name": "أكاديمية سند",
      "slug": "sanad",
      "plan": "PRO",
      "onboardingCompleted": true
    }
    ```
  - `404 Not Found`: `{ "message": "الأكاديمية غير موجودة" }`

---

### 2.2 قائمة الدورات والمسارات التدريبية (List Courses / Services)
- **المسار:** `GET /public/clinic/:slug/services`
- **الوصف:** جلب كافة الدورات والمسارات التدريبية المفعلة والمتاحة للتسجيل بالأكاديمية.
- **الاستخدام في الموقع:** `src/lib/courses.ts -> getCourses()`
- **حالات الرد:**
  - `200 OK`:
    ```json
    [
      {
        "id": "srv_123",
        "name": "دورة تطوير مواقع الويب الشاملة",
        "durationMinutes": 3600,
        "price": 1200,
        "categoryId": "cat_web",
        "category": {
          "id": "cat_web",
          "name": "تطوير مواقع الويب"
        }
      },
      {
        "id": "srv_124",
        "name": "دورة الذكاء الاصطناعي وتعلم الآلة",
        "durationMinutes": 2400,
        "price": 1500,
        "categoryId": "cat_ai"
      }
    ]
    ```

---

### 2.3 تصنيفات الدورات والمسارات (List Categories)
- **المسار:** `GET /public/clinic/:slug/categories`
- **الوصف:** جلب تصنيفات الدورات وعدد الدورات المسجلة تحت كل تصنيف.
- **الاستخدام في الموقع:** `src/lib/courses.ts -> getCategories()`
- **حالات الرد:**
  - `200 OK`:
    ```json
    [
      {
        "id": "cat_programming",
        "name": "البرمجة",
        "courseCount": 12
      },
      {
        "id": "cat_ai",
        "name": "الذكاء الاصطناعي",
        "courseCount": 8
      },
      {
        "id": "cat_design",
        "name": "تصميم واجهة وتجربة المستخدم",
        "courseCount": 5
      }
    ]
    ```

---

### 2.4 قائمة المدربين والمحاضرين (List Staff / Instructors)
- **المسار:** `GET /public/clinic/:slug/staff`
- **الوصف:** جلب المدربين المتاحين للحجز والمحاضرات.
- **حالات الرد:**
  - `200 OK`:
    ```json
    [
      {
        "id": "stf_01",
        "name": "م. أحمد الشمري",
        "prefix": "مهندس",
        "role": "مدرب أول بايثون وذكاء اصطناعي",
        "avatarUrl": "https://..."
      }
    ]
    ```

---

### 2.5 الاستعلام عن المواعيد الشاغرة للحجز (Available Slots)
- **المسار:** `GET /public/clinic/:slug/staff/:staffId/slots`
- **Query Parameters:**
  - `from`: تاريخ البداية بنسق ISO (مثال: `2026-10-01`)
  - `to`: تاريخ النهاية بنسق ISO (مثال: `2026-10-07`)
  - `serviceId`: (اختياري) معرف الدورة أو الجلسة
- **حالات الرد:**
  - `200 OK`:
    ```json
    {
      "staffId": "stf_01",
      "slots": [
        {
          "date": "2026-10-02",
          "startTime": "16:00",
          "endTime": "17:00",
          "available": true
        },
        {
          "date": "2026-10-02",
          "startTime": "17:00",
          "endTime": "18:00",
          "available": false
        }
      ]
    }
    ```
  - `400 Bad Request`: `{ "message": "تاريخ غير صالح" }` أو نطاق تاريخ خاطئ.

---

### 2.6 حجز موعد / حصة تقييمية (Create Public Booking)
- **المسار:** `POST /public-bookings`
- **معدل الطلبات (Rate Limiting):**
  - أقصى محاولات: 20 محاولة في الساعة لكل IP.
  - أقصى نجاحات: 5 حجوزات مؤكدة في الساعة لكل IP.
- **جسم الطلب (Request Body):**
  ```json
  {
    "slug": "sanad",
    "staffId": "stf_01",
    "serviceId": "srv_123",
    "date": "2026-10-02",
    "startTime": "16:00",
    "ownerName": "سعود العتيبي",
    "ownerPhone": "0501234567",
    "ownerEmail": "saud@example.com",
    "patientName": "فهد العتيبي (اسم الطالب)",
    "notes": "طلب اختبار تحديد مستوى"
  }
  ```
- **حالات الرد:**
  - `200 OK`:
    ```json
    {
      "success": true,
      "bookingId": "bk_987",
      "message": "تم استلام طلب الحجز بنجاح"
    }
    ```
  - `409 Conflict`: `{ "message": "الموعد المحدد لم يعد متاحاً" }`
  - `422 Unprocessable Entity`: `{ "message": "بيانات الطلب غير صالحة" }`
  - `429 Too Many Requests`: `{ "message": "تم تجاوز الحد المسموح، حاول لاحقًا" }`

---

## 3. مسارات المصادقة وإدارة الجلسات (Authentication & Sessions)

تعتمد على مكتبة `Better-Auth` مع حماية الجلسات و الكوكيز المشفرة.

| المسار | الطريقة | الوصف | الحماية |
| :--- | :--- | :--- | :--- |
| `/auth/sign-in/email` | `POST` | تسجيل دخول بالبريد وكلمة المرور | عام |
| `/auth/sign-up/email` | `POST` | إنشاء حساب جديد | عام |
| `/auth/sign-out` | `POST` | تسجيل الخروج وإنهاء الجلسة | مصادق |
| `/auth/session` | `GET` | استرجاع بيانات المستخدم والجلسة الحالية والصلاحيات | مصادق |
| `/auth/email-otp/send-verification-otp` | `POST` | إرسال رمز التحقق بالبريد OTP | عام |
| `/auth/callback/google` | `GET` | عودة تسجيل الدخول عبر Google OAuth | عام |

---

## 4. مسارات لوحة التحكم وإدارة الأكاديمية (Dashboard & Admin APIs)

تتطلب جميع هذه المسارات جلسة نشطة (`activeClinicId`) وتخضع لفحص صلاحيات `RBAC`.

### 4.1 إدارة الدورات والخدمات (Services & Courses)
- `GET /services`: قائمة الدورات والأسعار التابعة للأكاديمية.
- `POST /services`: إنشاء دورة جديدة (الاسم، المدة، السعر، التصنيف، المتطلبات).
- `PUT /services/:id`: تعديل بيانات دورة قائمة.
- `DELETE /services/:id`: أرشفة أو إيقاف دورة.
- `GET /services/categories`: شجرة تصنيفات الدورات والوحدات.
- `POST /services/categories`: إضافة تصنيف جديد.

### 4.2 إدارة المواعيد والجداول (Appointments & Scheduling)
- `GET /appointments`: استعلام المواعيد حسب التاريخ، المدرب، أو حالة الطالب.
- `POST /appointments`: حجز موعد جديد مباشرة من الداشبورد.
- `PATCH /appointments/:id/status`: تغيير حالة الموعد (`SCHEDULED` -> `IN_SERVICE` -> `DONE` -> إلخ).
- `GET /staff-scheduling`: جداول مناوبات وأوقات دوام المدربين.
- `POST /staff-scheduling`: ضبط دوام مدرب وتحديد فترات التفرغ والاستراحة.

### 4.3 إدارة شؤون الطلاب والعملاء (CRM & Leads)
- `GET /crm/leads`: قائمة العملاء المحتملين وأولياء الأمور الجدد.
- `POST /crm/leads`: إضافة عميل محتمل جديد.
- `PATCH /crm/leads/:id`: تحديث حالة الطالب أو العميل ومرحلة المتابعة.
- `GET /crm/deals`: صفقات التسجيل والاشتراكات.
- `POST /crm/whatsapp/send`: إرسال رسالة واتساب آلية أو يدوية للطالب/ولي الأمر.

### 4.4 الفوترة والمحاسبة (Invoices & Accounting)
- `GET /invoices`: استعراض فواتير الدورات والرسوم.
- `POST /invoices`: إصدار فاتورة جديدة لدورة أو حقيبة تعليمية.
- `POST /invoices/:id/pay`: تسجيل سداد دفعة نقدية أو بنكية.
- `GET /accounting/reports`: موازين المراجعة، الأرباح والخسائر، والتقارير المالية.

### 4.5 الموظفون والمدربون (Staff Management)
- `GET /staff`: قائمة المدربين والموظفين وسجلاتهم.
- `POST /staff`: إضافة ملف مدرب جديد وإسناد الدور التدريبي له.
- `GET /staff/:id/documents`: المستندات والعقود المرفقة بالمدرب.
- `POST /invites`: دعوة موظف أو مدرب جديد للانضمام للأكاديمية عبر البريد.

---

## 5. أمثلة برمجية للاستدعاء والتكامل (Integration Examples)

### 5.1 الاستدعاء في موقع Next.js (Server-Side)
```typescript
// src/lib/courses.ts
const DASHBOARD_API = process.env.DASHBOARD_API_URL ?? "http://localhost:5180/api";
const ACADEMY_SLUG = process.env.ACADEMY_SLUG ?? "sanad";

export async function fetchAcademyCourses() {
  const res = await fetch(`${DASHBOARD_API}/public/clinic/${ACADEMY_SLUG}/services`, {
    next: { revalidate: 60 } // تحديث كل 60 ثانية
  });
  if (!res.ok) throw new Error("تعذر جلب الدورات من الخادم");
  return res.json();
}
```

### 5.2 الاستدعاء عبر عميل Eden Treaty (Type-Safe Client)
```typescript
import { treaty } from "@elysiajs/eden";
import type { App } from "backend/src/server/app";

export const client = treaty<App>("http://localhost:5180");

// استدعاء بنوع مؤكد 100% (End-to-End Type Safety):
const { data, error } = await client.api.public.clinic({ slug: "sanad" }).services.get();
```

---

## 6. استراتيجية الترحيل والتشغيل المستقبلي (Migration Strategy)
1. **المرحلة الحالية:** تشغيل الباك إند المستقل في `backend/` على المنفذ `5180`.
2. **الربط:** يظل الموقع (`Next.js`) يشير إلى `http://localhost:5180/api` كما هو دون أي تغيير في مساراته.
3. **الداشبورد:** بعد اختبار واستقرار الباك إند بالكامل، يمكن توجيه الداشبورد للاتصال بالخادم المستقل عبر تغيير `VITE_API_URL`.
