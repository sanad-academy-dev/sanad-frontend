# Documents Module — `/management/documents`

**الحالة:** ✅ مُنفَّذ (2026-08-16). `typecheck` و`build` بخروج 0، و11 اختبارًا جديدًا يمرّ.
لم يُتحقَّق بصريًا من RTL محليًا — لا توجد قاعدة بيانات محلية (انظر §11).
**النطاق المُقَرّ (قرار المالك):** خزانة مستندات العيادة (نموذج جديد) + تتبّع انتهاء الصلاحية +
تصنيفات ثابتة + نطاق العيادة مع وسم فرع اختياري.

---

## 1. لماذا هذه الوحدة

الشريط الجانبي يشير إلى `/management/documents` منذ الآن
([`app-sidebar.tsx:261`](../src/components/sidebar/app-sidebar.tsx#L261)) والمفتاح
`sidebar.items.documents` مترجَم في اللغتين — لكن **المسار غير موجود**، فالرابط ميّت.

المستندات في التطبيق اليوم كلها **مربوطة بسجلّ أب**:

| النموذج | النطاق | تصنيفات |
|---|---|---|
| `StaffDocument` ([schema.prisma:2260](../prisma/schema.prisma#L2260)) | موظف واحد | ✅ `StaffDocumentCategory` |
| `AppointmentDocument` ([schema.prisma:3240](../prisma/schema.prisma#L3240)) | زيارة واحدة | ❌ |
| مستندات المريض | مريض واحد | ❌ |

**لا يوجد نموذج على مستوى العيادة نفسها.** أوراق العيادة — رخصة المزاولة، السجل التجاري،
الشهادة الضريبية، عقد الإيجار، وثائق التأمين، عقود المورّدين، السياسات الداخلية — ليس لها مكان.
هذه هي الفجوة التي تسدّها الوحدة.

### ما هو **خارج** النطاق

- **ليست مُجمِّعًا** لمستندات الموظفين/الزيارات/المرضى. تلك تبقى في شاشات أصحابها.
- لا شجرة مجلدات، ولا وسوم حرّة (تصنيفات ثابتة فقط — القرار 3).
- لا إصدارات (versioning) ولا توقيع إلكتروني في هذه المرحلة.

---

## 2. ما يُعاد استخدامه (لا كود جديد مطلوب)

| الحاجة | الموجود |
|---|---|
| رفع الملفات | `POST /uploads/direct` — [`uploads.controller.ts`](../src/server/uploads/uploads.controller.ts). S3 مع سقوط تلقائي إلى `public/uploads` محليًا، سقف 512MB، قائمة MIME مسموحة |
| خطّاف الرفع | [`useUploadFile`](../src/features/appointments/hooks/use-upload-file.ts) |
| بناء رابط الملف | [`getFileUrl`](../src/lib/file-url.ts) |
| ثوابت الرفع | `ACCEPTED_FILE_TYPES` / `MAX_FILE_SIZE_BYTES` — [`add-document-modal.ts`](../src/features/appointments/data/add-document-modal.ts) |
| نوع المستند | `enum DocumentKind { FILE, LINK }` — موجود، يُعاد استخدامه كما هو |
| هيكل الصفحة | `Stats` + `TableToolbar` + `TableDataView` + `ToggleChip` — نمط [`reports-list-page.tsx`](../src/features/reports/components/reports-list-page.tsx) |
| نموذج الإضافة | `FormHeader` + `FormFooter` + `DateField` من `components/common` |
| ترقيم الصفحات | `TablePagination` (مدمج داخل `TableDataView`) |

المرجع الأقرب للسلوك: [`documents-tab.tsx`](../src/features/services/staff/components/tabs/documents-tab.tsx)
(نمط ملف/رابط + الرفع ثم الإنشاء) و[`staff-documents`](../src/server/staff-documents/) للخادم.

---

## 3. نموذج البيانات

```prisma
enum ClinicDocumentCategory {
  LICENSE       // التراخيص والتصاريح
  REGISTRATION  // السجلات الرسمية (سجل تجاري، شهادة ضريبية)
  CONTRACT      // العقود والاتفاقيات
  INSURANCE     // وثائق التأمين
  POLICY        // السياسات والإجراءات الداخلية
  FINANCIAL     // مستندات مالية
  OTHER         // أخرى
}

model ClinicDocument {
  id           String                 @id @default(cuid())
  clinicId     String
  branchId     String?                // null = يخصّ العيادة كلها
  authorUserId String
  category     ClinicDocumentCategory
  title        String
  description  String?
  kind         DocumentKind           // معاد استخدامه — FILE | LINK
  url          String
  mimeType     String?
  sizeBytes    Int?
  issuedAt     DateTime?              @db.Date
  expiresAt    DateTime?              @db.Date
  createdAt    DateTime               @default(now())
  updatedAt    DateTime               @updatedAt

  clinic Clinic  @relation(fields: [clinicId], references: [id], onDelete: Cascade)
  branch Branch? @relation(fields: [branchId], references: [id], onDelete: SetNull)
  author User    @relation("AuthoredClinicDocuments", fields: [authorUserId], references: [id])

  @@index([clinicId, category, createdAt])
  @@index([clinicId, expiresAt])
  @@map("clinic_document")
}
```

مراجع عكسية تُضاف على `Clinic.clinicDocuments`، `Branch.clinicDocuments`،
`User.authoredClinicDocuments`.

**حالة الصلاحية** مشتقّة لا مخزّنة (دالة نقية مشتركة بين الخادم والعميل):

| الحالة | الشرط |
|---|---|
| `NONE` | `expiresAt == null` |
| `EXPIRED` | `expiresAt < today` |
| `EXPIRING` | خلال 30 يومًا |
| `VALID` | غير ذلك |

**الحذف:** حذف فعلي (hard delete) + إزالة الملف المحلي — مطابق لـ
[`staff-documents.dao.ts`](../src/server/staff-documents/staff-documents.dao.ts).
يسبقه حوار تأكيد لأن فقد رخصة أمر مكلف.
*(إن رغب المالك في أرشفة بدل حذف، يُضاف `isDeleted` لاحقًا كترحيل إضافي غير كاسر.)*

---

## 4. الخادم — `src/server/clinic-documents/`

أربعة ملفات حسب اتفاقية المستودع:

- **`clinic-documents.type.ts`** — مخطط Zod للنموذج (`discriminatedUnion` على `kind` كما في
  مستندات الموظفين)، `CreateClinicDocumentInput` مشتقّ من
  `Prisma.ClinicDocumentUncheckedCreateInput`، `ClinicDocumentResponse` من `GetPayload`،
  ودالة `resolveExpiryStatus` النقية.
- **`clinic-documents.model.ts`** — TypeBox + `ClinicDocumentCategory` و`DocumentKind` من
  `generated/prismabox/`.
- **`clinic-documents.dao.ts`** — استعلامات Prisma فقط.
- **`clinic-documents.controller.ts`** — بادئة `/clinic-documents`، ماكرو `requireClinic`.
- **`clinic-documents.where.ts`** *(أُضيف أثناء التنفيذ)* — بناء شروط الاستعلام، وحدة نقيّة
  لا تستورد `@/lib/db` (ومن ثمّ لا `@/env`) فتُختبر بلا قاعدة بيانات ولا متغيّرات بيئة.
- **`clinic-documents.where.test.ts`** — 11 اختبارًا تثبّت عزل نطاق الفرع وحساب الصلاحية.

### التسجيل — قيد غير متوقّع

سلسلة [`src/server/index.ts`](../src/server/index.ts) بلغت **سقف عمق استنتاج الأنواع في
TypeScript**. إضافة أي حلقة `‎.use()‎` جديدة — ولو لمتحكّم تافه بمسار واحد يعيد
`{ ok: true }` — تُفجّر `TS2589` في `src/server/app.ts` (ملف لم نلمسه). القياس: السلسلة
النظيفة تمرّ، وأي إضافة تسقط، ومحو النوع بـ `as unknown as Elysia` لا ينفع. **العدد هو
القيد لا حجم النوع** — فتخفيف المتحكّم (تسطيح الاتحاد، إزالة الدوال من الماكرو) لا يحلّها.

الحل: تجميع المتحكّمات في نسخة Elysia فرعية ليبقى طول السلسلة العليا ثابتًا — نفس ما يفعله
`accountingServer`:

```ts
const documentsServer = new Elysia()
	.use(staffDocumentsController)
	.use(clinicDocumentsController); // ‎.use()‎ واحد بدل اثنين
```

**الوحدة التالية ستصطدم بالسقف نفسه** — اضممها إلى مجموعة قائمة ولا تُطِل السلسلة.

### المسارات

| الطريقة | المسار | الوصف |
|---|---|---|
| `GET` | `/clinic-documents` | استعلام: `category?`, `branchId?`, `expiry?` (`all\|expiring\|expired\|valid`), `search?` |
| `GET` | `/clinic-documents/summary` | أعداد بطاقات الإحصاء |
| `POST` | `/clinic-documents` | إنشاء (ملف أو رابط) |
| `PATCH` | `/clinic-documents/:id` | تعديل البيانات الوصفية |
| `DELETE` | `/clinic-documents/:id` | حذف + تنظيف الملف |

كل مسار يتحقّق من `clinicId` من الجلسة — لا يُقبل `clinicId` من العميل أبدًا.
رسائل الخطأ بالعربية حسب [`app.ts`](../src/server/app.ts).

---

## 5. الصلاحيات

جديدة في [`permissions.ts`](../src/lib/permissions.ts):

```ts
DOCUMENTS_VIEW_LIMITED: "documents.view_limited",  // مستندات فرعه فقط
DOCUMENTS_VIEW_FULL:    "documents.view_full",     // كل مستندات العيادة
DOCUMENTS_CREATE:       "documents.create",
DOCUMENTS_EDIT:         "documents.edit",
DOCUMENTS_DELETE:       "documents.delete",
```

`view_limited` يعني مستندات فرع المستخدم + المستندات العامة (`branchId = null`) — وهذا
ما يجعل بُعد الفرع (القرار 4) ذا معنى فعلي.

- قسم جديد في [`permissions-editor.tsx`](../src/features/settings/roles-permissions/components/permissions-editor.tsx)
  بعنوان «المستندات».
- **ترحيل تعبئة رجعية** يمنح `documents.view_full` لكل `StaffRole` قائم — نفس منطق
  `FINANCE_DEFAULT_GRANT`: الصلاحية لم تكن موجودة، فلا يجوز أن يفقد أحد وصولًا يوم الترحيل.
- حارس `beforeLoad` على المسار كنمط [`inventory.tsx`](../src/routes/_pathless-layout/management/inventory.tsx).
- الترشيح على الخادم أيضًا — الحارس يخفي فقط، ولا يؤمّن.

---

## 6. العميل — `src/features/documents/`

```
components/
  documents-page.tsx        # الغلاف: Stats + TableToolbar + TableDataView
  documents-table.tsx       # تعريف الأعمدة + useReactTable
  add-document-sheet.tsx    # FormHeader + النموذج + FormFooter (ملف | رابط)
  expiry-badge.tsx          # شارة الصلاحية
hooks/
  use-clinic-documents.ts
  use-clinic-documents-summary.ts
  use-create-clinic-document.ts
  use-update-clinic-document.ts
  use-delete-clinic-document.ts
data/
  categories.ts             # تصنيف → تسمية + أيقونة
utils/
  expiry.ts                 # يعيد تصدير الدالة النقية من الخادم
```

المسار: `src/routes/_pathless-layout/management/documents.tsx` → يعرض `DocumentsPage`.

### تخطيط الشاشة

```
┌──────────┬──────────────┬──────────┬─────────────────┐
│ الإجمالي │ تنتهي قريبًا │ منتهية   │ أُضيفت هذا الشهر │   ← <Stats variant="compact">
└──────────┴──────────────┴──────────┴─────────────────┘
[بحث…]  [الكل][التراخيص][السجلات][العقود][التأمين][السياسات][مالية][أخرى]
                                        [كل الفروع ▾]      [+ رفع مستند]   ← <TableToolbar>
┌────────────────────────────────────────────────────────────────────────┐
│ المستند │ التصنيف │ الفرع │ تاريخ الانتهاء │ الحجم │ أضافه │ التاريخ │ ⋯ │
└────────────────────────────────────────────────────────────────────────┘
```

- عمود «المستند»: العنوان + أيقونة حسب `mimeType`، والرابط يفتح في تبويب جديد.
- عمود «تاريخ الانتهاء»: التاريخ + `ExpiryBadge` (أحمر منتهية / كهرماني تنتهي قريبًا).
- إجراءات الصف: عرض / تنزيل / تعديل / حذف.
- الحالة الفارغة عبر خاصية `emptyState` في `TableDataView`.

### قواعد RTL (من AGENTS.md والذاكرة)

- خصائص منطقية فقط (`ps-*`/`pe-*`/`start-*`/`text-start`) — لا `pl`/`pr`/`left`/`right`.
- `DropdownMenu dir="rtl"`.
- **`SelectContent position="popper"`** — الافتراضي يخرج خارج الشاشة في RTL.
- ترتيب DOM يحدّد الجهة؛ لا `justify-between` لإصلاح جهة.
- زر إغلاق واحد في الـ Sheet (`showCloseButton={false}` عند وجود X مخصّص).
- ترويسة/تذييل كل لوحة: `border-b px-4 py-2` / `border-t px-4 py-2` + أزرار `size="sm"`.

---

## 7. الترجمة

مفاتيح `documents.*` في **اللغتين** (`src/locales/ar` و`src/locales/en`) — على نمط
`reports.*`، وهي الجارة الأقرب في نفس مجموعة التنقّل. `sidebar.items.documents` موجود
بالفعل ولا يُمَس.

---

## 8. الترحيلات — لا قاعدة بيانات محلية

`bun run db:migrate` مربوط بـ `--name init` و`migrate dev` محجوب في هذه الأصداف. الطريقة:
توليد SQL عبر `prisma migrate diff` (schema→schema) ← إنشاء مجلد الترحيل يدويًا ←
الدفع ← **CI هي مصدر الحقيقة**. `db:push` ممنوع.

| # | الترحيل | المحتوى |
|---|---|---|
| 1 | `add_clinic_document` | الجدول + `ClinicDocumentCategory` + الفهرسان |
| 2 | `backfill_documents_permissions` | منح `documents.view_full` لكل دور قائم |

بعدها `prisma generate` لتوليد أنواع Prisma وprismabox، وتجديد `routeTree` بتشغيل
`vite dev` القصير على منفذ بديل (منفذ 3001 قد يكون مشغولًا بجلسة المالك).

---

## 9. ترتيب التنفيذ (كل بند = كوميت)

1. `feat(documents): clinic_document schema + migration`
2. `feat(documents): server module (4 files) + register controller`
3. `feat(documents): permissions + editor section + backfill migration + route guard`
4. `feat(documents): query/mutation hooks`
5. `feat(documents): page shell — stats, toolbar, table`
6. `feat(documents): add/edit sheet with upload + expiry`
7. `feat(documents): i18n keys (ar + en)`
8. `chore(documents): RTL verification + typecheck + build`

---

## 10. معايير القبول

- [ ] `/management/documents` يفتح من الشريط الجانبي — لا رابط ميّت.
- [ ] رفع ملف (PDF/صورة/Word/Excel) ينشئ صفًّا؛ الرابط يفتح الملف فعليًا.
- [ ] إضافة رابط خارجي (`kind = LINK`) تعمل بلا رفع.
- [ ] مستند بتاريخ انتهاء خلال 30 يومًا يظهر بشارة كهرمانية ويُحتسب في «تنتهي قريبًا».
- [ ] مستند منتهٍ يظهر بشارة حمراء ويُحتسب في «منتهية».
- [ ] رقائق التصنيف + فلتر الفرع + البحث تُرشِّح فعليًا.
- [ ] الحذف يزيل الصف والملف المحلي، بعد تأكيد.
- [ ] دور بلا `documents.view_*` يُعاد توجيهه من المسار، وتُرفض مسارات الـ API.
- [ ] كل الأدوار القائمة تحتفظ بالوصول بعد الترحيل الرجعي.
- [ ] لا تسريب بين العيادات — الترشيح دائمًا على `clinicId` من الجلسة.
- [ ] `bun run typecheck` و`bun run build` بخروج 0؛ فحص RTL بصري للشاشة والنموذج.
- [ ] تشغيل CI أخضر بعد الدفع.

---

## 11. ما تحقّق فعليًا وما بقي

| البند | الحالة |
|---|---|
| `bun run typecheck` | ✅ خروج 0 |
| `bun run build` | ✅ خروج 0 |
| `bun test` | ✅ 616 ناجحًا (+11 جديدًا)، و66 إخفاقًا **سابقًا للتغيير** (نفس العدد على HEAD النظيف) |
| فحص RTL بصري | ❌ متعذّر محليًا |
| تشغيل CI | ⏳ بعد الدفع |

**الإخفاقات الـ66 سابقة للتغيير**: سببها غياب متغيّرات البيئة محليًا
(`Invalid environment variables` من `src/env.ts`) — تظهر بالعدد نفسه على HEAD قبل أي تعديل.

**لماذا تعذّر الفحص البصري:** لا يوجد `DATABASE_URL` محلي (قاعدة CLAUDE.md رقم 8: CI هي
مصدر الحقيقة)، فلا يقلع خادم التطوير ولا تُعرض الشاشة ببيانات. بديلًا عن التخمين، طُبّقت
قواعد RTL نصًّا وتُراجَع بصريًا عند أول تشغيل:
خصائص منطقية فقط، و`position="popper"` على كل `SelectContent`، و`dir` صريح على محتوى Radix
المنقول خارج الشجرة (Select/Dropdown/Dialog)، وزر إغلاق واحد (`showCloseButton={false}`)،
وجهة الـ Sheet تتبع اللغة، و`dir="ltr"` على حقل الرابط وحده كجزيرة لاتينية.

**ثغرة أُصلحت أثناء المراجعة (تسريب صلاحيات):** كانت شروط `where` تُدمَج بالنشر في كائن
واحد، وثلاثة مصادر منها تُصدِر مفتاح `OR` (نطاق الفرع، فلتر «سارية»، البحث) فيدهس المتأخّرُ
السابقَ بصمت — أي أن مستخدمًا بصلاحية `view_limited` كان يرى مستندات الفروع كلّها بمجرّد
الكتابة في حقل البحث. الشروط الآن تُجمَع في `AND`، ويثبّت ذلك اختبارٌ يسقط على النسخة
المعيبة (تُحقِّق من ذلك بإرجاع الدمج القديم: 4 اختبارات تفشل).
