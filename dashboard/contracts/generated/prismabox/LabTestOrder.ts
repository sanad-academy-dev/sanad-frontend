import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const LabTestOrderPlain = t.Object(
  {
    id: t.String(),
    code: t.String(),
    clinicId: t.String(),
    branchId: t.String(),
    patientId: t.String(),
    ownerId: t.String(),
    appointmentId: __nullable__(t.String()),
    inpatientStayId: __nullable__(
      t.String({
        description: `*
* [IP2] طُلب من داخل إقامة تنويم. عمود قياسيّ بلا علاقة Prisma عن قصد: العلاقة
* تُضاف طرفين، وطرفها الثاني يوسّع رسم أنواع \`InpatientStay\` الضخم أصلًا حتى
* يتجاوز سقف عمق TypeScript (نفس ما وقع عند إضافة نماذج التنويم أول مرّة).
* الاستعلام هنا دائمًا «طلبات هذه الإقامة»، وهو استعلام مستقلّ لا تضمين متداخل.`,
      }),
    ),
    requestedById: __nullable__(t.String()),
    priority: __nullable__(
      t.Union(
        [
          t.Literal("LOW"),
          t.Literal("MEDIUM"),
          t.Literal("HIGH"),
          t.Literal("URGENT"),
        ],
        { additionalProperties: false },
      ),
    ),
    isUrgent: t.Boolean(),
    notes: __nullable__(t.String()),
    isDeleted: t.Boolean(),
    deletedAt: __nullable__(t.Date()),
    createdAt: t.Date(),
    updatedAt: t.Date(),
    qcReviewedAt: __nullable__(t.Date()),
    qcReviewedById: __nullable__(t.String()),
    qcRules: t.Array(t.String(), { additionalProperties: false }),
    releasedToOwnerAt: __nullable__(
      t.Date({
        description: `*
* [D6] نشر النتيجة لمالك الحيوان — القرار السريري الذي يفتح بوّابة التطبيق.
* النتيجة **لا تصل تطبيق المالك** حتى يُملأ هذا الحقل. القيمة الفارغة هي الحالة
* الطبيعية لا النقص: قيمةٌ خارج المدى المرجعي تُقرأ كارثةً وهي طبيعية لنوعها،
* وأخرى تبدو سليمة يعرف الطبيب وحده أنها تستدعي إعادة. فالنشر فعلُ طبيبٍ يُسجَّل
* باسمه ووقته، لا أثرٌ جانبيّ لاكتمال التحليل.`,
      }),
    ),
    releasedByStaffId: __nullable__(t.String()),
    releaseSummary: __nullable__(
      t.String({
        description: `*
* ملخّصٌ بلغة المالك يكتبه الطبيب عند النشر — لا يُعرض التقرير الخام.`,
      }),
    ),
  },
  { additionalProperties: false },
);

export const LabTestOrderRelations = t.Object(
  {
    clinic: t.Object(
      {
        id: t.String(),
        name: t.String(),
        slug: __nullable__(t.String()),
        plan: t.Union(
          [t.Literal("FREE"), t.Literal("BASIC"), t.Literal("PRO")],
          { additionalProperties: false },
        ),
        trialEndsAt: __nullable__(t.Date()),
        onboardingCompleted: t.Boolean(),
        rbacVersion: t.Integer({
          description: `[RBAC P4] يُرفَع عند أيّ كتابة على دور أو منحة أو إسناد. الجلسة تحمل النسخة التي
بُنيت منها لقطتُها، فتُعيد بناءها ذاتيًا عند الاختلاف بدل حذف الجلسات وإخراج المستخدم.`,
        }),
        createdAt: t.Date(),
        updatedAt: t.Date(),
      },
      { additionalProperties: false },
    ),
    branch: t.Object(
      {
        id: t.String(),
        branchCode: t.String(),
        clinicId: t.String(),
        name: t.String(),
        icon: __nullable__(t.String()),
        type: t.Union([t.Literal("PRIMARY"), t.Literal("SUB")], {
          additionalProperties: false,
        }),
        managerId: __nullable__(t.String()),
        email: __nullable__(t.String()),
        city: __nullable__(t.String()),
        phone: __nullable__(t.String()),
        address: __nullable__(t.String()),
        active: t.Boolean(),
        emergencyNotifications: t.Boolean(),
        settings: __nullable__(t.Any()),
        isDeleted: t.Boolean(),
        deletedAt: __nullable__(t.Date()),
        createdAt: t.Date(),
        updatedAt: t.Date(),
      },
      { additionalProperties: false },
    ),
    patient: t.Object(
      {
        id: t.String(),
        code: t.String(),
        clinicId: t.String(),
        ownerId: __nullable__(t.String()),
        name: t.String(),
        nameNormalized: t.String(),
        gender: t.Union(
          [t.Literal("MALE"), t.Literal("FEMALE"), t.Literal("UNKNOWN")],
          { additionalProperties: false },
        ),
        animalTypeId: t.String(),
        animalStrainId: __nullable__(t.String()),
        age: __nullable__(t.Number()),
        birthDate: __nullable__(t.Date()),
        weight: __nullable__(t.Number()),
        microchipNumber: __nullable__(t.String()),
        coat: __nullable__(t.String()),
        notes: __nullable__(t.String()),
        active: t.Boolean(),
        isDeleted: t.Boolean(),
        deletedAt: __nullable__(t.Date()),
        editsCount: t.Integer(),
        createdAt: t.Date(),
        updatedAt: t.Date(),
      },
      { additionalProperties: false },
    ),
    owner: t.Object(
      {
        id: t.String(),
        code: t.String(),
        clinicId: t.String(),
        name: t.String(),
        phone: t.String(),
        phoneE164: __nullable__(t.String()),
        email: __nullable__(t.String()),
        gender: __nullable__(
          t.Union(
            [t.Literal("MALE"), t.Literal("FEMALE"), t.Literal("UNKNOWN")],
            { additionalProperties: false },
          ),
        ),
        ownerType: t.Union(
          [
            t.Literal("ALL"),
            t.Literal("VIP"),
            t.Literal("LOYALTY"),
            t.Literal("NEW"),
            t.Literal("CURRENT"),
          ],
          { additionalProperties: false },
        ),
        relationship: __nullable__(
          t.Union(
            [
              t.Literal("OWNER"),
              t.Literal("GUARDIAN"),
              t.Literal("DELEGATE"),
              t.Literal("EMERGENCY"),
            ],
            { additionalProperties: false },
          ),
        ),
        country: __nullable__(t.String()),
        city: __nullable__(t.String()),
        address: __nullable__(t.String()),
        notes: __nullable__(t.String()),
        active: t.Boolean(),
        isDeleted: t.Boolean(),
        deletedAt: __nullable__(t.Date()),
        editsCount: t.Integer(),
        createdAt: t.Date(),
        updatedAt: t.Date(),
      },
      { additionalProperties: false },
    ),
    appointment: __nullable__(
      t.Object(
        {
          id: t.String(),
          code: t.String(),
          clinicId: t.String(),
          branchId: t.String(),
          ownerId: t.String(),
          patientId: t.String(),
          staffId: t.String(),
          roomId: __nullable__(t.String()),
          startsAt: t.Date(),
          durationMinutes: t.Integer(),
          location: t.Union(
            [
              t.Literal("IN_CLINIC"),
              t.Literal("REMOTE"),
              t.Literal("HOME_VISIT"),
              t.Literal("MOBILE_CLINIC"),
            ],
            { additionalProperties: false },
          ),
          status: t.Union(
            [
              t.Literal("SCHEDULED"),
              t.Literal("WAITING"),
              t.Literal("CHECK_IN"),
              t.Literal("IN_SERVICE"),
              t.Literal("HOSPITALIZED"),
              t.Literal("AWAITING_PAYMENT"),
              t.Literal("DONE"),
              t.Literal("CANCELLED"),
            ],
            { additionalProperties: false },
          ),
          queueStatus: __nullable__(
            t.Union(
              [
                t.Literal("ON_HOLD"),
                t.Literal("NO_SHOW"),
                t.Literal("CONFIRMED"),
              ],
              { additionalProperties: false },
            ),
          ),
          priority: __nullable__(
            t.Union(
              [
                t.Literal("LOW"),
                t.Literal("MEDIUM"),
                t.Literal("HIGH"),
                t.Literal("URGENT"),
              ],
              { additionalProperties: false },
            ),
          ),
          isEmergency: t.Boolean({
            description: `[E0] يبقى كما هو، ويصبح **إسقاطًا** لا مدخلًا حين تُفعَّل طبقة الطوارئ على الفرع:
\`isEmergency = triageCategory ∈ {RED, ORANGE}\` تُكتب في نفس معاملة التقييم. نفس
سابقة \`isUrgent ⇔ priority === URGENT\` في التحاليل والأشعة. مع الطبقة مُطفأة يبقى
مفتاحًا يدويًّا كما كان، فكل مستهلك قائم (ترتيب الطابور، الشارة، صفّ الإنذار،
الوكيل، معالج الحجز) يعمل بلا تعديل سطر واحد.`,
          }),
          triageCategory: __nullable__(
            t.Union(
              [
                t.Literal("RED"),
                t.Literal("ORANGE"),
                t.Literal("YELLOW"),
                t.Literal("GREEN"),
                t.Literal("BLUE"),
              ],
              {
                additionalProperties: false,
                description: `فئات قائمة الفرز البيطرية (VTL — Ruys et al. 2012) المشتقّة من مقياس مانشستر.
الأهداف الزمنية لكل فئة في \`emergency.rules.ts\` لا هنا: العتبة التي تقرّر من
يُرى أوّلًا تُراجَع في طلب دمج ويوقّعها إنسان، ولا تُحرَّر من شاشة إعدادات.`,
              },
            ),
          ),
          arrivedAt: __nullable__(
            t.Date({
              description: `[E0] وقت الوصول الفعلي — لا وقت الموعد. \`startsAt\` هو ما كان مجدولًا، وهذا ما
حدث. كل هدف انتظار وكل مقياس «من الباب إلى الطبيب» يُقاس من هنا، ولا يُشتقّ من
\`startsAt\` لأن مريض الطوارئ يصل قبل موعده أو بلا موعد أصلًا.`,
            }),
          ),
          reason: __nullable__(t.String()),
          symptoms: __nullable__(t.String()),
          clinicalNotes: __nullable__(t.String()),
          consultationTypeId: __nullable__(t.String()),
          serviceAddressId: __nullable__(t.String()),
          consultationFeeSnapshot: __nullable__(t.Number()),
          consultationPaidAt: __nullable__(t.Date()),
          whatsappReminderEnabled: t.Boolean(),
          images: t.Array(t.String(), { additionalProperties: false }),
          recurringGroupId: __nullable__(t.String()),
          recurringIndex: __nullable__(t.Integer()),
          recurringTotal: __nullable__(t.Integer()),
          repeatUnit: __nullable__(
            t.Union(
              [
                t.Literal("DAY"),
                t.Literal("WEEK"),
                t.Literal("TWO_WEEKS"),
                t.Literal("MONTH"),
                t.Literal("YEAR"),
              ],
              { additionalProperties: false },
            ),
          ),
          isDeleted: t.Boolean(),
          deletedAt: __nullable__(t.Date()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    ),
    requestedBy: __nullable__(
      t.Object(
        {
          id: t.String(),
          name: t.String(),
          email: t.String(),
          emailVerified: t.Boolean(),
          image: __nullable__(t.String()),
          phone: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    ),
    qcReviewedBy: __nullable__(
      t.Object(
        {
          id: t.String(),
          name: t.String(),
          email: t.String(),
          emailVerified: t.Boolean(),
          image: __nullable__(t.String()),
          phone: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    ),
    items: t.Array(
      t.Object(
        {
          id: t.String(),
          orderId: t.String(),
          serviceId: t.String(),
          priceSnapshot: t.Number(),
          status: t.Union(
            [
              t.Literal("QUEUE"),
              t.Literal("SCHEDULED"),
              t.Literal("SAMPLE_COLLECTION"),
              t.Literal("IN_LAB"),
              t.Literal("UNDER_REVIEW"),
              t.Literal("COMPLETED"),
              t.Literal("CANCELLED"),
            ],
            { additionalProperties: false },
          ),
          sampleStage: t.Union(
            [
              t.Literal("NOT_COLLECTED"),
              t.Literal("COLLECTED"),
              t.Literal("QUALITY_CHECK"),
              t.Literal("LABEL_PRINT"),
              t.Literal("ANALYZER_ASSIGNMENT"),
              t.Literal("HANDOVER_SUMMARY"),
              t.Literal("ANALYZING"),
              t.Literal("RESULTS_READY"),
            ],
            { additionalProperties: false },
          ),
          assignedToId: __nullable__(t.String()),
          scheduledAt: __nullable__(t.Date()),
          report: __nullable__(t.String()),
          reviewedById: __nullable__(t.String()),
          reviewedAt: __nullable__(t.Date()),
          rejectedById: __nullable__(t.String()),
          rejectedAt: __nullable__(t.Date()),
          rejectionReason: __nullable__(t.String()),
          completedAt: __nullable__(t.Date()),
          paidAt: __nullable__(t.Date()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    invoice: __nullable__(
      t.Object(
        {
          id: t.String(),
          code: t.String(),
          clinicId: t.String(),
          appointmentId: __nullable__(t.String()),
          labOrderId: __nullable__(t.String()),
          radiologyOrderId: __nullable__(t.String()),
          operationId: __nullable__(t.String()),
          groomingSessionId: __nullable__(t.String()),
          inpatientStayId: __nullable__(t.String()),
          subtotal: t.Number(),
          vatRate: t.Number(),
          vatAmount: t.Number(),
          taxTemplateId: __nullable__(t.String()),
          discount: t.Number(),
          total: t.Number(),
          amountPaid: t.Number(),
          currencyCode: t.String(),
          membershipId: __nullable__(t.String()),
          insurerShare: __nullable__(t.Number()),
          copayShare: __nullable__(t.Number()),
          status: t.Union(
            [
              t.Literal("PENDING"),
              t.Literal("PARTIAL"),
              t.Literal("PAID"),
              t.Literal("VOIDED"),
              t.Literal("REFUNDED"),
            ],
            { additionalProperties: false },
          ),
          paymentMethod: __nullable__(
            t.Union(
              [t.Literal("CASH"), t.Literal("CARD"), t.Literal("TRANSFER")],
              { additionalProperties: false },
            ),
          ),
          paidAt: __nullable__(t.Date()),
          refundedAt: __nullable__(t.Date()),
          refundReason: __nullable__(t.String()),
          refundedById: __nullable__(t.String()),
          stripePaymentIntentId: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    ),
    activity: t.Array(
      t.Object(
        {
          id: t.String(),
          orderId: t.String(),
          itemId: __nullable__(t.String()),
          type: t.Union(
            [
              t.Literal("CREATED"),
              t.Literal("STATUS_CHANGED"),
              t.Literal("STAGE_CHANGED"),
              t.Literal("ASSIGNED"),
              t.Literal("SAMPLE_COLLECTED"),
              t.Literal("RESULTS_SAVED"),
              t.Literal("SENT_TO_REVIEW"),
              t.Literal("QC_REVIEWED"),
              t.Literal("APPROVED"),
              t.Literal("REJECTED"),
              t.Literal("DECLINED"),
              t.Literal("INVOICE_PAID"),
            ],
            { additionalProperties: false },
          ),
          detail: __nullable__(t.String()),
          authorUserId: __nullable__(t.String()),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    comments: t.Array(
      t.Object(
        {
          id: t.String(),
          orderId: t.String(),
          authorUserId: t.String(),
          body: t.String(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    preAnalytical: __nullable__(
      t.Object(
        {
          id: t.String(),
          orderId: t.String(),
          fastingStatus: __nullable__(
            t.Union(
              [
                t.Literal("FASTED"),
                t.Literal("PARTIAL"),
                t.Literal("NOT_FASTED"),
              ],
              { additionalProperties: false },
            ),
          ),
          fastingHours: __nullable__(t.Integer()),
          medications: t.Array(t.String(), { additionalProperties: false }),
          ivFluids24h: __nullable__(t.Boolean()),
          vitalsRecordId: __nullable__(t.String()),
          weight: __nullable__(t.Number()),
          temperature: __nullable__(t.Number()),
          heartRate: __nullable__(t.Integer()),
          respiratoryRate: __nullable__(t.Integer()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    ),
    vitalSignsRecords: t.Array(
      t.Object(
        {
          id: t.String(),
          code: t.String(),
          clinicId: t.String(),
          branchId: __nullable__(t.String()),
          patientId: t.String(),
          recordedAt: t.Date(),
          source: t.Union(
            [
              t.Literal("MANUAL"),
              t.Literal("VISIT"),
              t.Literal("LAB"),
              t.Literal("RADIOLOGY"),
              t.Literal("OPERATION"),
              t.Literal("GROOMING"),
              t.Literal("INPATIENT"),
              t.Literal("TRIAGE"),
            ],
            { additionalProperties: false },
          ),
          recordedById: __nullable__(t.String()),
          appointmentId: __nullable__(t.String()),
          labOrderId: __nullable__(t.String()),
          radiologyOrderId: __nullable__(t.String()),
          operationId: __nullable__(t.String()),
          inpatientStayId: __nullable__(t.String()),
          weight: __nullable__(t.Number()),
          temperature: __nullable__(t.Number()),
          heartRate: __nullable__(t.Integer()),
          respiratoryRate: __nullable__(t.Integer()),
          oxygenSaturation: __nullable__(t.Integer()),
          bloodPressure: __nullable__(t.String()),
          painScore: __nullable__(t.Integer()),
          bodyConditionScore: __nullable__(t.Integer()),
          capillaryRefillSec: __nullable__(t.Number()),
          mucousMembrane: __nullable__(
            t.Union(
              [
                t.Literal("PINK"),
                t.Literal("PALE"),
                t.Literal("CYANOTIC"),
                t.Literal("ICTERIC"),
                t.Literal("CONGESTED"),
                t.Literal("MUDDY"),
              ],
              { additionalProperties: false },
            ),
          ),
          notes: __nullable__(t.String()),
          correctsId: __nullable__(t.String()),
          isDeleted: t.Boolean(),
          deletedAt: __nullable__(t.Date()),
          editsCount: t.Integer(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const LabTestOrderPlainInputCreate = t.Object(
  {
    code: t.String(),
    priority: t.Optional(
      __nullable__(
        t.Union(
          [
            t.Literal("LOW"),
            t.Literal("MEDIUM"),
            t.Literal("HIGH"),
            t.Literal("URGENT"),
          ],
          { additionalProperties: false },
        ),
      ),
    ),
    isUrgent: t.Optional(t.Boolean()),
    notes: t.Optional(__nullable__(t.String())),
    isDeleted: t.Optional(t.Boolean()),
    deletedAt: t.Optional(__nullable__(t.Date())),
    qcReviewedAt: t.Optional(__nullable__(t.Date())),
    qcRules: t.Optional(t.Array(t.String(), { additionalProperties: false })),
    releasedToOwnerAt: t.Optional(
      __nullable__(
        t.Date({
          description: `*
* [D6] نشر النتيجة لمالك الحيوان — القرار السريري الذي يفتح بوّابة التطبيق.
* النتيجة **لا تصل تطبيق المالك** حتى يُملأ هذا الحقل. القيمة الفارغة هي الحالة
* الطبيعية لا النقص: قيمةٌ خارج المدى المرجعي تُقرأ كارثةً وهي طبيعية لنوعها،
* وأخرى تبدو سليمة يعرف الطبيب وحده أنها تستدعي إعادة. فالنشر فعلُ طبيبٍ يُسجَّل
* باسمه ووقته، لا أثرٌ جانبيّ لاكتمال التحليل.`,
        }),
      ),
    ),
    releaseSummary: t.Optional(
      __nullable__(
        t.String({
          description: `*
* ملخّصٌ بلغة المالك يكتبه الطبيب عند النشر — لا يُعرض التقرير الخام.`,
        }),
      ),
    ),
  },
  { additionalProperties: false },
);

export const LabTestOrderPlainInputUpdate = t.Object(
  {
    code: t.Optional(t.String()),
    priority: t.Optional(
      __nullable__(
        t.Union(
          [
            t.Literal("LOW"),
            t.Literal("MEDIUM"),
            t.Literal("HIGH"),
            t.Literal("URGENT"),
          ],
          { additionalProperties: false },
        ),
      ),
    ),
    isUrgent: t.Optional(t.Boolean()),
    notes: t.Optional(__nullable__(t.String())),
    isDeleted: t.Optional(t.Boolean()),
    deletedAt: t.Optional(__nullable__(t.Date())),
    qcReviewedAt: t.Optional(__nullable__(t.Date())),
    qcRules: t.Optional(t.Array(t.String(), { additionalProperties: false })),
    releasedToOwnerAt: t.Optional(
      __nullable__(
        t.Date({
          description: `*
* [D6] نشر النتيجة لمالك الحيوان — القرار السريري الذي يفتح بوّابة التطبيق.
* النتيجة **لا تصل تطبيق المالك** حتى يُملأ هذا الحقل. القيمة الفارغة هي الحالة
* الطبيعية لا النقص: قيمةٌ خارج المدى المرجعي تُقرأ كارثةً وهي طبيعية لنوعها،
* وأخرى تبدو سليمة يعرف الطبيب وحده أنها تستدعي إعادة. فالنشر فعلُ طبيبٍ يُسجَّل
* باسمه ووقته، لا أثرٌ جانبيّ لاكتمال التحليل.`,
        }),
      ),
    ),
    releaseSummary: t.Optional(
      __nullable__(
        t.String({
          description: `*
* ملخّصٌ بلغة المالك يكتبه الطبيب عند النشر — لا يُعرض التقرير الخام.`,
        }),
      ),
    ),
  },
  { additionalProperties: false },
);

export const LabTestOrderRelationsInputCreate = t.Object(
  {
    clinic: t.Object(
      {
        connect: t.Object(
          {
            id: t.String({ additionalProperties: false }),
          },
          { additionalProperties: false },
        ),
      },
      { additionalProperties: false },
    ),
    branch: t.Object(
      {
        connect: t.Object(
          {
            id: t.String({ additionalProperties: false }),
          },
          { additionalProperties: false },
        ),
      },
      { additionalProperties: false },
    ),
    patient: t.Object(
      {
        connect: t.Object(
          {
            id: t.String({ additionalProperties: false }),
          },
          { additionalProperties: false },
        ),
      },
      { additionalProperties: false },
    ),
    owner: t.Object(
      {
        connect: t.Object(
          {
            id: t.String({ additionalProperties: false }),
          },
          { additionalProperties: false },
        ),
      },
      { additionalProperties: false },
    ),
    appointment: t.Optional(
      t.Object(
        {
          connect: t.Object(
            {
              id: t.String({ additionalProperties: false }),
            },
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
    ),
    requestedBy: t.Optional(
      t.Object(
        {
          connect: t.Object(
            {
              id: t.String({ additionalProperties: false }),
            },
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
    ),
    qcReviewedBy: t.Optional(
      t.Object(
        {
          connect: t.Object(
            {
              id: t.String({ additionalProperties: false }),
            },
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
    ),
    items: t.Optional(
      t.Object(
        {
          connect: t.Array(
            t.Object(
              {
                id: t.String({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
    ),
    invoice: t.Optional(
      t.Object(
        {
          connect: t.Object(
            {
              id: t.String({ additionalProperties: false }),
            },
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
    ),
    activity: t.Optional(
      t.Object(
        {
          connect: t.Array(
            t.Object(
              {
                id: t.String({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
    ),
    comments: t.Optional(
      t.Object(
        {
          connect: t.Array(
            t.Object(
              {
                id: t.String({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
    ),
    preAnalytical: t.Optional(
      t.Object(
        {
          connect: t.Object(
            {
              id: t.String({ additionalProperties: false }),
            },
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
    ),
    vitalSignsRecords: t.Optional(
      t.Object(
        {
          connect: t.Array(
            t.Object(
              {
                id: t.String({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
    ),
  },
  { additionalProperties: false },
);

export const LabTestOrderRelationsInputUpdate = t.Partial(
  t.Object(
    {
      clinic: t.Object(
        {
          connect: t.Object(
            {
              id: t.String({ additionalProperties: false }),
            },
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
      branch: t.Object(
        {
          connect: t.Object(
            {
              id: t.String({ additionalProperties: false }),
            },
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
      patient: t.Object(
        {
          connect: t.Object(
            {
              id: t.String({ additionalProperties: false }),
            },
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
      owner: t.Object(
        {
          connect: t.Object(
            {
              id: t.String({ additionalProperties: false }),
            },
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
      appointment: t.Partial(
        t.Object(
          {
            connect: t.Object(
              {
                id: t.String({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
            disconnect: t.Boolean(),
          },
          { additionalProperties: false },
        ),
      ),
      requestedBy: t.Partial(
        t.Object(
          {
            connect: t.Object(
              {
                id: t.String({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
            disconnect: t.Boolean(),
          },
          { additionalProperties: false },
        ),
      ),
      qcReviewedBy: t.Partial(
        t.Object(
          {
            connect: t.Object(
              {
                id: t.String({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
            disconnect: t.Boolean(),
          },
          { additionalProperties: false },
        ),
      ),
      items: t.Partial(
        t.Object(
          {
            connect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
            disconnect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
          },
          { additionalProperties: false },
        ),
      ),
      invoice: t.Partial(
        t.Object(
          {
            connect: t.Object(
              {
                id: t.String({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
            disconnect: t.Boolean(),
          },
          { additionalProperties: false },
        ),
      ),
      activity: t.Partial(
        t.Object(
          {
            connect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
            disconnect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
          },
          { additionalProperties: false },
        ),
      ),
      comments: t.Partial(
        t.Object(
          {
            connect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
            disconnect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
          },
          { additionalProperties: false },
        ),
      ),
      preAnalytical: t.Partial(
        t.Object(
          {
            connect: t.Object(
              {
                id: t.String({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
            disconnect: t.Boolean(),
          },
          { additionalProperties: false },
        ),
      ),
      vitalSignsRecords: t.Partial(
        t.Object(
          {
            connect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
            disconnect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
          },
          { additionalProperties: false },
        ),
      ),
    },
    { additionalProperties: false },
  ),
);

export const LabTestOrderWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          code: t.String(),
          clinicId: t.String(),
          branchId: t.String(),
          patientId: t.String(),
          ownerId: t.String(),
          appointmentId: t.String(),
          inpatientStayId: t.String({
            description: `*
* [IP2] طُلب من داخل إقامة تنويم. عمود قياسيّ بلا علاقة Prisma عن قصد: العلاقة
* تُضاف طرفين، وطرفها الثاني يوسّع رسم أنواع \`InpatientStay\` الضخم أصلًا حتى
* يتجاوز سقف عمق TypeScript (نفس ما وقع عند إضافة نماذج التنويم أول مرّة).
* الاستعلام هنا دائمًا «طلبات هذه الإقامة»، وهو استعلام مستقلّ لا تضمين متداخل.`,
          }),
          requestedById: t.String(),
          priority: t.Union(
            [
              t.Literal("LOW"),
              t.Literal("MEDIUM"),
              t.Literal("HIGH"),
              t.Literal("URGENT"),
            ],
            { additionalProperties: false },
          ),
          isUrgent: t.Boolean(),
          notes: t.String(),
          isDeleted: t.Boolean(),
          deletedAt: t.Date(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
          qcReviewedAt: t.Date(),
          qcReviewedById: t.String(),
          qcRules: t.Array(t.String(), { additionalProperties: false }),
          releasedToOwnerAt: t.Date({
            description: `*
* [D6] نشر النتيجة لمالك الحيوان — القرار السريري الذي يفتح بوّابة التطبيق.
* النتيجة **لا تصل تطبيق المالك** حتى يُملأ هذا الحقل. القيمة الفارغة هي الحالة
* الطبيعية لا النقص: قيمةٌ خارج المدى المرجعي تُقرأ كارثةً وهي طبيعية لنوعها،
* وأخرى تبدو سليمة يعرف الطبيب وحده أنها تستدعي إعادة. فالنشر فعلُ طبيبٍ يُسجَّل
* باسمه ووقته، لا أثرٌ جانبيّ لاكتمال التحليل.`,
          }),
          releasedByStaffId: t.String(),
          releaseSummary: t.String({
            description: `*
* ملخّصٌ بلغة المالك يكتبه الطبيب عند النشر — لا يُعرض التقرير الخام.`,
          }),
        },
        { additionalProperties: false },
      ),
    { $id: "LabTestOrder" },
  ),
);

export const LabTestOrderWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.String(), code: t.String() },
            { additionalProperties: false },
          ),
          { additionalProperties: false },
        ),
        t.Union(
          [t.Object({ id: t.String() }), t.Object({ code: t.String() })],
          { additionalProperties: false },
        ),
        t.Partial(
          t.Object({
            AND: t.Union([
              Self,
              t.Array(Self, { additionalProperties: false }),
            ]),
            NOT: t.Union([
              Self,
              t.Array(Self, { additionalProperties: false }),
            ]),
            OR: t.Array(Self, { additionalProperties: false }),
          }),
          { additionalProperties: false },
        ),
        t.Partial(
          t.Object(
            {
              id: t.String(),
              code: t.String(),
              clinicId: t.String(),
              branchId: t.String(),
              patientId: t.String(),
              ownerId: t.String(),
              appointmentId: t.String(),
              inpatientStayId: t.String({
                description: `*
* [IP2] طُلب من داخل إقامة تنويم. عمود قياسيّ بلا علاقة Prisma عن قصد: العلاقة
* تُضاف طرفين، وطرفها الثاني يوسّع رسم أنواع \`InpatientStay\` الضخم أصلًا حتى
* يتجاوز سقف عمق TypeScript (نفس ما وقع عند إضافة نماذج التنويم أول مرّة).
* الاستعلام هنا دائمًا «طلبات هذه الإقامة»، وهو استعلام مستقلّ لا تضمين متداخل.`,
              }),
              requestedById: t.String(),
              priority: t.Union(
                [
                  t.Literal("LOW"),
                  t.Literal("MEDIUM"),
                  t.Literal("HIGH"),
                  t.Literal("URGENT"),
                ],
                { additionalProperties: false },
              ),
              isUrgent: t.Boolean(),
              notes: t.String(),
              isDeleted: t.Boolean(),
              deletedAt: t.Date(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
              qcReviewedAt: t.Date(),
              qcReviewedById: t.String(),
              qcRules: t.Array(t.String(), { additionalProperties: false }),
              releasedToOwnerAt: t.Date({
                description: `*
* [D6] نشر النتيجة لمالك الحيوان — القرار السريري الذي يفتح بوّابة التطبيق.
* النتيجة **لا تصل تطبيق المالك** حتى يُملأ هذا الحقل. القيمة الفارغة هي الحالة
* الطبيعية لا النقص: قيمةٌ خارج المدى المرجعي تُقرأ كارثةً وهي طبيعية لنوعها،
* وأخرى تبدو سليمة يعرف الطبيب وحده أنها تستدعي إعادة. فالنشر فعلُ طبيبٍ يُسجَّل
* باسمه ووقته، لا أثرٌ جانبيّ لاكتمال التحليل.`,
              }),
              releasedByStaffId: t.String(),
              releaseSummary: t.String({
                description: `*
* ملخّصٌ بلغة المالك يكتبه الطبيب عند النشر — لا يُعرض التقرير الخام.`,
              }),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "LabTestOrder" },
);

export const LabTestOrderSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      code: t.Boolean(),
      clinicId: t.Boolean(),
      branchId: t.Boolean(),
      patientId: t.Boolean(),
      ownerId: t.Boolean(),
      appointmentId: t.Boolean(),
      inpatientStayId: t.Boolean(),
      requestedById: t.Boolean(),
      priority: t.Boolean(),
      isUrgent: t.Boolean(),
      notes: t.Boolean(),
      isDeleted: t.Boolean(),
      deletedAt: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      qcReviewedAt: t.Boolean(),
      qcReviewedById: t.Boolean(),
      qcRules: t.Boolean(),
      releasedToOwnerAt: t.Boolean(),
      releasedByStaffId: t.Boolean(),
      releaseSummary: t.Boolean(),
      clinic: t.Boolean(),
      branch: t.Boolean(),
      patient: t.Boolean(),
      owner: t.Boolean(),
      appointment: t.Boolean(),
      requestedBy: t.Boolean(),
      qcReviewedBy: t.Boolean(),
      items: t.Boolean(),
      invoice: t.Boolean(),
      activity: t.Boolean(),
      comments: t.Boolean(),
      preAnalytical: t.Boolean(),
      vitalSignsRecords: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const LabTestOrderInclude = t.Partial(
  t.Object(
    {
      priority: t.Boolean(),
      clinic: t.Boolean(),
      branch: t.Boolean(),
      patient: t.Boolean(),
      owner: t.Boolean(),
      appointment: t.Boolean(),
      requestedBy: t.Boolean(),
      qcReviewedBy: t.Boolean(),
      items: t.Boolean(),
      invoice: t.Boolean(),
      activity: t.Boolean(),
      comments: t.Boolean(),
      preAnalytical: t.Boolean(),
      vitalSignsRecords: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const LabTestOrderOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      code: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clinicId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      branchId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      patientId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      ownerId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      appointmentId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      inpatientStayId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      requestedById: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      isUrgent: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      notes: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      isDeleted: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      deletedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      updatedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      qcReviewedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      qcReviewedById: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      qcRules: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      releasedToOwnerAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      releasedByStaffId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      releaseSummary: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const LabTestOrder = t.Composite(
  [LabTestOrderPlain, LabTestOrderRelations],
  { additionalProperties: false },
);

export const LabTestOrderInputCreate = t.Composite(
  [LabTestOrderPlainInputCreate, LabTestOrderRelationsInputCreate],
  { additionalProperties: false },
);

export const LabTestOrderInputUpdate = t.Composite(
  [LabTestOrderPlainInputUpdate, LabTestOrderRelationsInputUpdate],
  { additionalProperties: false },
);
