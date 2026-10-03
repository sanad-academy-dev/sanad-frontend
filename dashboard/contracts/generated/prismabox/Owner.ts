import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const OwnerPlain = t.Object(
  {
    id: t.String(),
    code: t.String(),
    clinicId: t.String(),
    name: t.String(),
    phone: t.String(),
    phoneE164: __nullable__(t.String()),
    email: __nullable__(t.String()),
    gender: __nullable__(
      t.Union([t.Literal("MALE"), t.Literal("FEMALE"), t.Literal("UNKNOWN")], {
        additionalProperties: false,
      }),
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
);

export const OwnerRelations = t.Object(
  {
    crmDeals: t.Array(
      t.Object(
        {
          id: t.String(),
          code: t.String(),
          clinicId: t.String(),
          leadId: __nullable__(
            t.String({ description: `أصل الصفقة حين جاءت من عميل محتمل (§5)` }),
          ),
          ownerId: __nullable__(
            t.String({
              description: `مالكٌ قائم في elite-vet حين كان الشخص معروفًا مسبقًا (BR-C5.3)`,
            }),
          ),
          sourceId: __nullable__(
            t.String({
              description: `مصدر الصفقة — لقطةٌ تُنسخ عند التحويل وتبقى قابلة للتحرير (§5، §17.2 صفّ ٩).
عمودٌ على الصفقة لا قراءةً عبر \`leadId\`: قمع §12 يجمع بالمصدر، و\`leadId\` قابل
للإفراغ (\`SetNull\`)، فقراءةٌ عبره تفقد المصدر متى حُذف العميل المحتمل.`,
            }),
          ),
          firstName: t.String(),
          lastName: __nullable__(t.String()),
          fullName: t.String(),
          gender: __nullable__(
            t.Union(
              [t.Literal("MALE"), t.Literal("FEMALE"), t.Literal("UNKNOWN")],
              { additionalProperties: false },
            ),
          ),
          mobile: t.String(),
          mobileNormalized: __nullable__(
            t.String({
              description: `الشكل القابل للمقارنة — نفس اشتقاق العميل المحتمل (\`@/lib/validation/phone\`)`,
            }),
          ),
          phone: __nullable__(t.String()),
          email: __nullable__(t.String()),
          city: __nullable__(t.String()),
          address: __nullable__(t.String()),
          petSpecies: __nullable__(t.String()),
          petCount: __nullable__(t.Integer()),
          petNotes: __nullable__(t.String()),
          statusId: t.String(),
          probability: t.Number({
            description: `نسبة النجاح؛ تُملأ افتراضًا من الحالة (§2) ما لم يتجاوزها المستخدم (BR-C4.2)`,
          }),
          probabilityOverridden: t.Boolean({
            description: `BR-C4.2 — الانحراف المقصود عن النظام المرجعي: هذا العلم يمنع إعادة الافتراض الصامت`,
          }),
          expectedCloseDate: __nullable__(t.Date()),
          closedDate: __nullable__(
            t.Date({
              description: `يُختم تلقائيًّا عند دخول حالة من نوع WON (§4.1)`,
            }),
          ),
          dealValue: t.Number({
            description: `Σ سطور المنتجات حين توجد، وإلّا يدويّ (BR-C6.1)`,
          }),
          expectedValue: t.Number({
            description: `dealValue × probability ÷ 100 — يُعاد حسابه عند تغيّر أيٍّ منهما (BR-C4.2)`,
          }),
          wonOwnerId: __nullable__(
            t.String({
              description: `المالك الذي حُسم إليه الفوز (§7.2) — يُختم داخل معاملة الفوز`,
            }),
          ),
          lostReasonId: __nullable__(t.String()),
          lostNotes: __nullable__(t.String()),
          slaPolicyId: __nullable__(
            t.String({
              description: `§10 — حقول اتفاقية مستوى الخدمة، فارغة حتى CRM-P5 يبني المحرّك`,
            }),
          ),
          responseBy: __nullable__(t.Date()),
          firstRespondedAt: __nullable__(t.Date()),
          firstResponseDuration: __nullable__(t.Integer()),
          slaStatus: __nullable__(
            t.Union(
              [t.Literal("DUE"), t.Literal("FULFILLED"), t.Literal("FAILED")],
              {
                additionalProperties: false,
                description: `[CRM-P2] §10.3 — حالة اتفاقية مستوى الخدمة. العمود يُشحن فارغًا الآن؛ المحرّك في CRM-P5.`,
              },
            ),
          ),
          ownerUserId: __nullable__(t.String()),
          notes: __nullable__(t.String()),
          active: t.Boolean(),
          isDeleted: t.Boolean(),
          deletedAt: __nullable__(t.Date()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `[CRM-P2] §4.1 — الصفقة. تُنشأ من التحويل (§5) أو مباشرةً، ولا تصير «مكسوبة» إلا عبر
مسار §7 داخل المعاملة نفسها (BR-C4.1).`,
        },
      ),
      { additionalProperties: false },
    ),
    crmWonDeals: t.Array(
      t.Object(
        {
          id: t.String(),
          code: t.String(),
          clinicId: t.String(),
          leadId: __nullable__(
            t.String({ description: `أصل الصفقة حين جاءت من عميل محتمل (§5)` }),
          ),
          ownerId: __nullable__(
            t.String({
              description: `مالكٌ قائم في elite-vet حين كان الشخص معروفًا مسبقًا (BR-C5.3)`,
            }),
          ),
          sourceId: __nullable__(
            t.String({
              description: `مصدر الصفقة — لقطةٌ تُنسخ عند التحويل وتبقى قابلة للتحرير (§5، §17.2 صفّ ٩).
عمودٌ على الصفقة لا قراءةً عبر \`leadId\`: قمع §12 يجمع بالمصدر، و\`leadId\` قابل
للإفراغ (\`SetNull\`)، فقراءةٌ عبره تفقد المصدر متى حُذف العميل المحتمل.`,
            }),
          ),
          firstName: t.String(),
          lastName: __nullable__(t.String()),
          fullName: t.String(),
          gender: __nullable__(
            t.Union(
              [t.Literal("MALE"), t.Literal("FEMALE"), t.Literal("UNKNOWN")],
              { additionalProperties: false },
            ),
          ),
          mobile: t.String(),
          mobileNormalized: __nullable__(
            t.String({
              description: `الشكل القابل للمقارنة — نفس اشتقاق العميل المحتمل (\`@/lib/validation/phone\`)`,
            }),
          ),
          phone: __nullable__(t.String()),
          email: __nullable__(t.String()),
          city: __nullable__(t.String()),
          address: __nullable__(t.String()),
          petSpecies: __nullable__(t.String()),
          petCount: __nullable__(t.Integer()),
          petNotes: __nullable__(t.String()),
          statusId: t.String(),
          probability: t.Number({
            description: `نسبة النجاح؛ تُملأ افتراضًا من الحالة (§2) ما لم يتجاوزها المستخدم (BR-C4.2)`,
          }),
          probabilityOverridden: t.Boolean({
            description: `BR-C4.2 — الانحراف المقصود عن النظام المرجعي: هذا العلم يمنع إعادة الافتراض الصامت`,
          }),
          expectedCloseDate: __nullable__(t.Date()),
          closedDate: __nullable__(
            t.Date({
              description: `يُختم تلقائيًّا عند دخول حالة من نوع WON (§4.1)`,
            }),
          ),
          dealValue: t.Number({
            description: `Σ سطور المنتجات حين توجد، وإلّا يدويّ (BR-C6.1)`,
          }),
          expectedValue: t.Number({
            description: `dealValue × probability ÷ 100 — يُعاد حسابه عند تغيّر أيٍّ منهما (BR-C4.2)`,
          }),
          wonOwnerId: __nullable__(
            t.String({
              description: `المالك الذي حُسم إليه الفوز (§7.2) — يُختم داخل معاملة الفوز`,
            }),
          ),
          lostReasonId: __nullable__(t.String()),
          lostNotes: __nullable__(t.String()),
          slaPolicyId: __nullable__(
            t.String({
              description: `§10 — حقول اتفاقية مستوى الخدمة، فارغة حتى CRM-P5 يبني المحرّك`,
            }),
          ),
          responseBy: __nullable__(t.Date()),
          firstRespondedAt: __nullable__(t.Date()),
          firstResponseDuration: __nullable__(t.Integer()),
          slaStatus: __nullable__(
            t.Union(
              [t.Literal("DUE"), t.Literal("FULFILLED"), t.Literal("FAILED")],
              {
                additionalProperties: false,
                description: `[CRM-P2] §10.3 — حالة اتفاقية مستوى الخدمة. العمود يُشحن فارغًا الآن؛ المحرّك في CRM-P5.`,
              },
            ),
          ),
          ownerUserId: __nullable__(t.String()),
          notes: __nullable__(t.String()),
          active: t.Boolean(),
          isDeleted: t.Boolean(),
          deletedAt: __nullable__(t.Date()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `[CRM-P2] §4.1 — الصفقة. تُنشأ من التحويل (§5) أو مباشرةً، ولا تصير «مكسوبة» إلا عبر
مسار §7 داخل المعاملة نفسها (BR-C4.1).`,
        },
      ),
      { additionalProperties: false },
    ),
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
    patients: t.Array(
      t.Object(
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
      { additionalProperties: false },
    ),
    appointments: t.Array(
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
      { additionalProperties: false },
    ),
    portalLinks: t.Array(
      t.Object(
        {
          id: t.String(),
          accountId: t.String(),
          ownerId: t.String(),
          clinicId: t.String(),
          source: t.Union(
            [t.Literal("PHONE_MATCH"), t.Literal("STAFF_ISSUED")],
            {
              additionalProperties: false,
              description: `*
* كيف نشأ الربط بين حساب المالك وسجلّه في عيادة بعينها.`,
            },
          ),
          hiddenByOwner: t.Boolean({
            description: `*
* المالك أخفى العيادة من تطبيقه — لا يقطع الربط ولا يمسّ سجلّه لديها.`,
          }),
          revokedAt: __nullable__(t.Date()),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    inboxItems: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          kind: t.Union([t.Literal("NOTIFICATION"), t.Literal("APPROVAL")], {
            additionalProperties: false,
          }),
          type: t.Union(
            [
              t.Literal("MEMBERSHIP"),
              t.Literal("INSURANCE"),
              t.Literal("LEAD"),
              t.Literal("DEAL"),
              t.Literal("APPOINTMENT_CANCELLED"),
              t.Literal("APPOINTMENT_NEW"),
              t.Literal("APPOINTMENT_PENDING"),
              t.Literal("APPOINTMENT_CONFIRMED"),
              t.Literal("INVOICE"),
              t.Literal("TASK"),
              t.Literal("SYSTEM"),
              t.Literal("LAB"),
              t.Literal("RADIOLOGY"),
              t.Literal("CARE"),
              t.Literal("STOCK"),
              t.Literal("MENTION"),
              t.Literal("OPERATION"),
              t.Literal("VACCINATION"),
              t.Literal("GROOMING"),
              t.Literal("INPATIENT"),
              t.Literal("TRIAGE"),
            ],
            { additionalProperties: false },
          ),
          title: t.String(),
          importance: t.Union(
            [t.Literal("LOW"), t.Literal("NORMAL"), t.Literal("HIGH")],
            { additionalProperties: false },
          ),
          status: t.Union(
            [t.Literal("DRAFT"), t.Literal("OPEN"), t.Literal("RESOLVED")],
            { additionalProperties: false },
          ),
          approvalStatus: __nullable__(
            t.Union(
              [
                t.Literal("PENDING"),
                t.Literal("ACCEPTED"),
                t.Literal("REJECTED"),
              ],
              { additionalProperties: false },
            ),
          ),
          patientId: __nullable__(t.String()),
          ownerId: __nullable__(t.String()),
          staffId: __nullable__(t.String()),
          appointmentId: __nullable__(t.String()),
          taskId: __nullable__(t.String()),
          conversationId: __nullable__(t.String()),
          operationId: __nullable__(t.String()),
          groomingSessionId: __nullable__(t.String()),
          leadId: __nullable__(t.String()),
          dealId: __nullable__(t.String()),
          inpatientStayId: __nullable__(t.String()),
          recipientUserId: __nullable__(t.String()),
          createdById: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    labTestOrders: t.Array(
      t.Object(
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
      ),
      { additionalProperties: false },
    ),
    radiologyOrders: t.Array(
      t.Object(
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
          clinicalInfo: __nullable__(t.String()),
          notes: __nullable__(t.String()),
          isDeleted: t.Boolean(),
          deletedAt: __nullable__(t.Date()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
          releasedToOwnerAt: __nullable__(
            t.Date({
              description: `*
* [D6] نشر النتيجة لمالك الحيوان — انظر الشرح على \`LabTestOrder.releasedToOwnerAt\`.`,
            }),
          ),
          releasedByStaffId: __nullable__(t.String()),
          releaseSummary: __nullable__(t.String()),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    operationCases: t.Array(
      t.Object(
        {
          id: t.String(),
          code: t.String(),
          clinicId: t.String(),
          branchId: t.String(),
          patientId: t.String(),
          ownerId: t.String(),
          appointmentId: __nullable__(t.String()),
          status: t.Union(
            [
              t.Literal("SCHEDULED"),
              t.Literal("PREP"),
              t.Literal("ANESTHESIA"),
              t.Literal("SURGERY"),
              t.Literal("RECOVERY"),
              t.Literal("DISCHARGE"),
              t.Literal("FOLLOW_UP"),
              t.Literal("COMPLETED"),
              t.Literal("CANCELLED"),
            ],
            { additionalProperties: false },
          ),
          stage: __nullable__(
            t.Union(
              [
                t.Literal("CONSENT"),
                t.Literal("FASTING_CHECK"),
                t.Literal("ASSESSMENT"),
                t.Literal("PREMED"),
                t.Literal("SIGN_IN"),
                t.Literal("INDUCTION"),
                t.Literal("MAINTENANCE"),
                t.Literal("TIME_OUT"),
                t.Literal("IN_PROGRESS"),
                t.Literal("CLOSING"),
                t.Literal("SIGN_OUT"),
                t.Literal("MONITORING"),
                t.Literal("READY_FOR_DISCHARGE"),
              ],
              { additionalProperties: false },
            ),
          ),
          tier: t.Union(
            [t.Literal("MINOR"), t.Literal("INTERMEDIATE"), t.Literal("MAJOR")],
            { additionalProperties: false },
          ),
          tierOverrideReason: __nullable__(t.String()),
          urgency: t.Union(
            [
              t.Literal("IMMEDIATE"),
              t.Literal("URGENT"),
              t.Literal("EXPEDITED"),
              t.Literal("ELECTIVE"),
            ],
            { additionalProperties: false },
          ),
          plannedAnesthesia: t.Union(
            [
              t.Literal("NONE"),
              t.Literal("ANXIOLYSIS"),
              t.Literal("SEDATION"),
              t.Literal("GENERAL_ANESTHESIA"),
            ],
            { additionalProperties: false },
          ),
          scheduledAt: __nullable__(t.Date()),
          estimatedDurationMin: t.Integer(),
          ssiSurveillanceUntil: __nullable__(t.Date()),
          roomId: __nullable__(t.String()),
          diagnosis: __nullable__(t.String()),
          clinicalSummary: __nullable__(t.String()),
          cancelKind: __nullable__(
            t.Union(
              [t.Literal("OWNER"), t.Literal("CLINIC"), t.Literal("CLINICAL")],
              { additionalProperties: false },
            ),
          ),
          cancelReason: __nullable__(t.String()),
          isDeleted: t.Boolean(),
          deletedAt: __nullable__(t.Date()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    serviceAddresses: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          ownerId: __nullable__(t.String()),
          label: __nullable__(t.String()),
          line1: t.String(),
          district: __nullable__(t.String()),
          city: __nullable__(t.String()),
          landmark: __nullable__(t.String()),
          lat: __nullable__(t.Number()),
          lng: __nullable__(t.Number()),
          geocodeSource: __nullable__(
            t.Union(
              [
                t.Literal("MANUAL_PIN"),
                t.Literal("NOMINATIM"),
                t.Literal("DEVICE_GPS"),
              ],
              { additionalProperties: false },
            ),
          ),
          accessNotes: __nullable__(t.String()),
          isDefault: t.Boolean(),
          isDeleted: t.Boolean(),
          deletedAt: __nullable__(t.Date()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    mobileBookingRequests: t.Array(
      t.Object(
        {
          id: t.String(),
          code: t.String(),
          clinicId: t.String(),
          ownerName: t.String(),
          phone: t.String(),
          email: __nullable__(t.String()),
          ownerId: __nullable__(t.String()),
          addressLine: t.String(),
          district: __nullable__(t.String()),
          city: __nullable__(t.String()),
          lat: __nullable__(t.Number()),
          lng: __nullable__(t.Number()),
          landmark: __nullable__(t.String()),
          animalTypeId: __nullable__(t.String()),
          petName: __nullable__(t.String()),
          petNotes: __nullable__(t.String()),
          serviceIds: t.Array(t.String(), { additionalProperties: false }),
          preferredDate: __nullable__(t.Date()),
          preferredWindow: __nullable__(
            t.Union(
              [
                t.Literal("MORNING"),
                t.Literal("AFTERNOON"),
                t.Literal("EVENING"),
                t.Literal("ANY"),
              ],
              { additionalProperties: false },
            ),
          ),
          notes: __nullable__(t.String()),
          attachments: t.Array(t.String(), { additionalProperties: false }),
          status: t.Union(
            [
              t.Literal("NEW"),
              t.Literal("CONTACTED"),
              t.Literal("SCHEDULED"),
              t.Literal("REJECTED"),
              t.Literal("SPAM"),
            ],
            { additionalProperties: false },
          ),
          zoneId: __nullable__(t.String()),
          appointmentId: __nullable__(t.String()),
          handledById: __nullable__(t.String()),
          handledAt: __nullable__(t.Date()),
          rejectionReason: __nullable__(t.String()),
          ipHash: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    consents: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          patientId: t.String(),
          ownerId: t.String(),
          templateId: __nullable__(t.String()),
          templateKey: t.String(),
          templateVersion: t.Integer(),
          type: t.Union(
            [
              t.Literal("SURGICAL"),
              t.Literal("ANESTHESIA"),
              t.Literal("BLOOD_PRODUCTS"),
              t.Literal("EUTHANASIA"),
              t.Literal("FINANCIAL_ESTIMATE"),
              t.Literal("HIGH_RISK_SURGICAL"),
              t.Literal("HOSPITALIZATION"),
              t.Literal("DISCHARGE_HEALTHY"),
              t.Literal("DISCHARGE_HOME_TREATMENT"),
              t.Literal("DISCHARGE_AGAINST_ADVICE"),
              t.Literal("BOARDING"),
              t.Literal("GROOMING"),
              t.Literal("EMERGENCY_TREATMENT"),
            ],
            { additionalProperties: false },
          ),
          locale: t.Union(
            [t.Literal("AR"), t.Literal("EN"), t.Literal("BOTH")],
            { additionalProperties: false },
          ),
          status: t.Union(
            [
              t.Literal("DRAFT"),
              t.Literal("AWAITING_SIGNATURE"),
              t.Literal("SIGNED"),
              t.Literal("REVOKED"),
            ],
            { additionalProperties: false },
          ),
          operationCaseId: __nullable__(t.String()),
          appointmentId: __nullable__(t.String()),
          inpatientStayId: __nullable__(t.String()),
          fieldValues: t.Any(),
          textSnapshot: t.String(),
          signerName: __nullable__(t.String()),
          signerRelationship: __nullable__(t.String()),
          signatureMethod: __nullable__(
            t.Union(
              [
                t.Literal("DRAWN"),
                t.Literal("TYPED"),
                t.Literal("UPLOADED"),
                t.Literal("VERBAL_WITNESSED"),
              ],
              { additionalProperties: false },
            ),
          ),
          signatureUrl: __nullable__(t.String()),
          witnessStaffId: __nullable__(t.String()),
          signedByStaffId: __nullable__(t.String()),
          signedAt: __nullable__(t.Date()),
          revokedAt: __nullable__(t.Date()),
          revokeReason: __nullable__(t.String()),
          sourceScanUrl: __nullable__(t.String()),
          extractedByAi: t.Boolean(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    groomingSessions: t.Array(
      t.Object(
        {
          id: t.String(),
          code: t.String(),
          clinicId: t.String(),
          branchId: t.String(),
          patientId: t.String(),
          ownerId: t.String(),
          appointmentId: __nullable__(t.String()),
          groomerId: t.String(),
          assistantId: __nullable__(t.String()),
          stationId: __nullable__(t.String()),
          lane: t.Union([t.Literal("COSMETIC"), t.Literal("MEDICAL")], {
            additionalProperties: false,
            description: `مسار الجلسة — تجميلي أم طبي. يقرّر أي البوابات إلزامية وأي اللوحات تظهر (§3).`,
          }),
          status: t.Union(
            [
              t.Literal("SCHEDULED"),
              t.Literal("CHECK_IN"),
              t.Literal("INTAKE"),
              t.Literal("IN_PROGRESS"),
              t.Literal("FINISHING"),
              t.Literal("READY"),
              t.Literal("PICKED_UP"),
              t.Literal("COMPLETED"),
              t.Literal("CANCELLED"),
              t.Literal("NO_SHOW"),
              t.Literal("ESCALATED"),
            ],
            {
              additionalProperties: false,
              description: `أعمدة لوحة التجميل (§6.1).`,
            },
          ),
          stage: __nullable__(
            t.Union(
              [
                t.Literal("QUOTE_APPROVAL"),
                t.Literal("BATH"),
                t.Literal("DRYING"),
                t.Literal("CLIP"),
                t.Literal("SCISSOR"),
                t.Literal("NAILS_EARS"),
                t.Literal("FINISH_CHECK"),
                t.Literal("PHOTOS"),
              ],
              {
                additionalProperties: false,
                description: `المرحلة الفرعية داخل الجلسة — تقود لوحة العمل.`,
              },
            ),
          ),
          vetOrderStaffId: __nullable__(t.String()),
          vetOrderNote: __nullable__(t.String()),
          sedationPlanned: t.Boolean(),
          scheduledAt: t.Date(),
          dropOffAt: __nullable__(t.Date()),
          estimatedDurationMin: t.Integer(),
          estimatedDryingMin: t.Integer(),
          promisedReadyAt: __nullable__(t.Date()),
          checkedInAt: __nullable__(t.Date()),
          startedAt: __nullable__(t.Date()),
          dryingStartedAt: __nullable__(t.Date()),
          readyAt: __nullable__(t.Date()),
          pickedUpAt: __nullable__(t.Date()),
          completedAt: __nullable__(t.Date()),
          dryingMethod: __nullable__(
            t.Union(
              [
                t.Literal("HAND_ROOM_TEMP"),
                t.Literal("FAN_ONLY"),
                t.Literal("CAGE_UNHEATED"),
                t.Literal("FORCED_AIR"),
                t.Literal("CAGE_HEATED"),
              ],
              {
                additionalProperties: false,
                description: `طريقة التجفيف — البوابة G5 ترفض CAGE_HEATED للحيوانات الممنوعة من الحرارة،
بلا أي مسار تجاوز. المرجع: إرشادات AAHA وصناعة التجميل حول قصيري الخطم.`,
              },
            ),
          ),
          quoteSubtotal: t.Number(),
          quoteAdjustments: t.Number(),
          quoteTotal: t.Number(),
          bookedQuoteTotal: t.Number(),
          ownerApprovedQuoteAt: __nullable__(t.Date()),
          cancelKind: __nullable__(
            t.Union(
              [
                t.Literal("OWNER_CANCELLED"),
                t.Literal("CLINIC_CANCELLED"),
                t.Literal("NO_SHOW"),
                t.Literal("HEALTH_REFUSAL"),
                t.Literal("BEHAVIOR_REFUSAL"),
              ],
              {
                additionalProperties: false,
                description: `سبب إنهاء الجلسة قبل أوانها`,
              },
            ),
          ),
          cancelReason: __nullable__(t.String()),
          isDeleted: t.Boolean(),
          deletedAt: __nullable__(t.Date()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `جلسة التجميل — الكيان المركزي. مسار واحد لكل الجلسات، والمسار (lane) يقرّر
أي البوابات إلزامية لا أي الأعمدة تظهر (الخطة §4.3، §6).`,
        },
      ),
      { additionalProperties: false },
    ),
    memberships: t.Array(
      t.Object(
        {
          id: t.String(),
          code: t.String(),
          clinicId: t.String(),
          ownerId: t.String(),
          planId: t.String(),
          subscriptionId: t.String({
            description: `الاشتراك المحاسبي الحامل للفوترة (MI-C2) — واحد لواحد`,
          }),
          status: t.Union(
            [
              t.Literal("PENDING_PAYMENT"),
              t.Literal("ACTIVE"),
              t.Literal("PAST_DUE"),
              t.Literal("LAPSED"),
              t.Literal("CANCELLED"),
              t.Literal("EXPIRED"),
            ],
            {
              additionalProperties: false,
              description: `§5.2 — CANCELLED وEXPIRED نهائيتان دومًا؛ LAPSED نهائية بعد انقضاء فترتها فقط
(قرار المالك MI-P1 س5: داخل الفترة تبقى غير نهائية لأنها قابلة للإحياء بالدفع).`,
            },
          ),
          currentPeriodStart: t.Date(),
          currentPeriodEnd: t.Date(),
          feeSnapshot: t.Number(),
          intervalSnapshot: t.Union(
            [
              t.Literal("DAY"),
              t.Literal("WEEK"),
              t.Literal("MONTH"),
              t.Literal("YEAR"),
            ],
            { additionalProperties: false },
          ),
          intervalCountSnapshot: t.Integer(),
          graceDaysSnapshot: t.Integer(),
          autoRenewSnapshot: t.Boolean(),
          scheduledPlanId: __nullable__(
            t.String({
              description: `BR-M5.4.2: تبديل الخطة المجدول — يُطبَّق عند التدوير التالي ثم يُصفَّر`,
            }),
          ),
          cancelledAt: __nullable__(t.Date()),
          cancelReason: __nullable__(t.String()),
          cancelledByUserId: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `عضوية مالك — FR-M5.1. اللقطات (AR-M2) تجمّد شروط الخطة وقت التسجيل؛ تعديل الخطة
لا يمسّها إلا عند تدوير الفترة (BR-M5.4.1). تفرُّد BR-M5.1.1 (عضوية واحدة غير
نهائية لكل مالك) يُفرَض في معاملة التسجيل التسلسلية — فهرس جزئي شرطي لا يُعبَّر
عنه في برزما ولا يمرّ من فحص انجراف الهجرات (قاعدة 8).`,
        },
      ),
      { additionalProperties: false },
    ),
    insuranceClaims: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          documentNo: __nullable__(t.String()),
          invoiceId: t.String(),
          policyId: t.String(),
          insurerId: t.String(),
          patientId: t.String(),
          ownerId: t.String(),
          policyNumberSnapshot: t.String(),
          serviceDate: t.Date(),
          claimedAmount: t.Number(),
          approvedAmount: __nullable__(t.Number()),
          settledAmount: t.Number(),
          status: t.Union(
            [
              t.Literal("DRAFT"),
              t.Literal("SUBMITTED"),
              t.Literal("APPROVED"),
              t.Literal("PARTIALLY_APPROVED"),
              t.Literal("REJECTED"),
              t.Literal("SETTLED"),
              t.Literal("CANCELLED"),
            ],
            { additionalProperties: false },
          ),
          coverageSnapshot: t.Any(),
          submittedAt: __nullable__(t.Date()),
          adjudicatedAt: __nullable__(t.Date()),
          rejectionReason: __nullable__(t.String()),
          insurerReference: __nullable__(t.String()),
          rejectionResolution: __nullable__(
            t.Union([t.Literal("REBILL_OWNER"), t.Literal("WRITE_OFF")], {
              additionalProperties: false,
            }),
          ),
          resolutionJournalEntryId: __nullable__(t.String()),
          resolvedAt: __nullable__(t.Date()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    loyaltyLedger: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          ownerId: t.String(),
          programId: t.String({
            description: `لقطةُ مرجع: البرنامج الذي حكم هذه الحركة. \`Restrict\` — لا يُحذف برنامجٌ له حركات
(BR-L3.3)، والحذف الناعم هو الطريق.`,
          }),
          kind: t.Union(
            [
              t.Literal("EARN"),
              t.Literal("REDEEM"),
              t.Literal("EXPIRY"),
              t.Literal("REVERSAL"),
              t.Literal("REDEMPTION_RESTORE"),
              t.Literal("ADJUSTMENT"),
            ],
            {
              additionalProperties: false,
              description: `[LY-P1] §9 — نوع حركة النقاط.`,
            },
          ),
          points: t.Integer({
            description: `**موقَّعة**: الكسب موجب، والاستبدال والانتهاء والعكس سالبة. الرصيد مجموعها.`,
          }),
          pointsConsumed: t.Integer({
            description: `على صفوف الكسب وحدها: كم استُهلك منها (FIFO، §6.4). يبدأ صفرًا ولا يتجاوز \`points\`.`,
          }),
          earnRateSnapshot: __nullable__(
            t.Number({
              description: `BR-L3.2 — المعدّلات كما كانت لحظة الحركة، لا كما هي اليوم. تعديل البرنامج لا يمسّ
نقاطًا مُنحت ولا خصومًا أُعطيت — نفس انضباط لقطات مزايا العضوية وتغطية التأمين.`,
            }),
          ),
          redemptionRateSnapshot: __nullable__(t.Number()),
          multiplierSnapshot: __nullable__(
            t.Number({
              description: `المضاعِف الفعليّ المطبَّق (المستوى × العضوية) — يُفسّر الرقم بعد أشهر`,
            }),
          ),
          earnBaseAmount: __nullable__(
            t.Number({
              description: `الأساس الذي حُسب عليه الكسب: صافي المالك قبل الضريبة (BR-L5.2)`,
            }),
          ),
          sourceType: t.Union(
            [
              t.Literal("CLINIC_INVOICE"),
              t.Literal("POS_SALE"),
              t.Literal("MANUAL"),
            ],
            {
              additionalProperties: false,
              description: `[LY-P1] §9 — مصدر الحركة.`,
            },
          ),
          sourceId: t.String({
            description: `معرّف المستند المصدر — أو \`cuid()\` مستقلّ لصفوف التسوية اليدوية`,
          }),
          earnedAt: t.Date(),
          expiresAt: __nullable__(
            t.Date({
              description: `على صفوف الكسب وحدها: \`earnedAt + program.pointsValidityMonths\` (BR-L7.1)`,
            }),
          ),
          note: __nullable__(
            t.String({
              description: `إلزاميّ على التسوية اليدوية (BR-L9.2) — منحةٌ بلا سبب لا تُراجَع`,
            }),
          ),
          createdByUserId: __nullable__(t.String()),
          createdAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `[LY-P1] §9.1 — دفتر النقاط.
**لا عمود رصيد في أيّ مكان (BR-L9.1).** الرصيد مجموع الصفوف، تمامًا كما يُشتقّ مستحقّ
الطرف من \`payment_ledger_entry\`. عمودُ رصيدٍ مخزَّن مصدرُ حقيقةٍ ثانٍ، ولهذا المستودع
قراراتٌ مكتوبة ضدّه بعينه.
**والدفتر يُضاف إليه فقط (BR-L9.3):** لا صفّ يُعدَّل ولا يُحذف؛ التصحيح صفٌّ جديد.
الاستثناء الوحيد \`pointsConsumed\` على صفوف الكسب — وهو ليس تعديلًا للواقعة بل عدّاد
استهلاكٍ يخصّ ترتيب FIFO في §6.4، ويُكتب بتحديثٍ شرطيّ ذرّي كما تفعل استحقاقات
العضوية (\`membership-pricing.service.ts\`).`,
        },
      ),
      { additionalProperties: false },
    ),
    loyaltyRedemptions: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          ownerId: t.String(),
          programId: t.String(),
          sourceType: t.Union(
            [
              t.Literal("CLINIC_INVOICE"),
              t.Literal("POS_SALE"),
              t.Literal("MANUAL"),
            ],
            {
              additionalProperties: false,
              description: `[LY-P1] §9 — مصدر الحركة.`,
            },
          ),
          sourceId: t.String(),
          points: t.Integer({
            description: `النقاط المطلوب استبدالها — موجبة دائمًا؛ الإشارة تُوضَع على صفّ الدفتر لا هنا`,
          }),
          discountAmount: t.Number({
            description: `الخصم الناتج قبل الضريبة (BR-M6.4 خطوة ٤) — بعد سقف \`maxRedemptionPercent\``,
          }),
          redemptionRateSnapshot: t.Number({
            description: `BR-L3.2 — معدّل الاستبدال لحظة التسعير، لا كما صار بعدها`,
          }),
          consumedAt: __nullable__(
            t.Date({
              description: `\`null\` = نيّةٌ لم تقع. تُملأ داخل معاملة الدفع وحدها (BR-L6.3 خطوة ٢).`,
            }),
          ),
          createdByUserId: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `[LY-P2] **نيّة استبدال** على مستند واحد (BR-L6.3). صفٌّ واحد لكل مستند: يُكتب عند
التسعير ولا يستهلك شيئًا، ويُلتزم داخل معاملة الدفع فيكتب صفّ REDEEM في الدفتر.
لماذا جدولٌ مستقلّ لا صفّ REDEEM مباشرةً: الدفتر إلحاقيّ ونهائيّ (BR-L9.3) — صفٌّ فيه
يعني «وقع». والنيّة قد لا تقع أبدًا: فاتورة تُسعَّر ثم تُهجَر، أو تُعاد تسعيرها بنقاط
أقلّ. كتابةُ النيّة في الدفتر كانت ستجعل رصيدًا معلّقًا على مستندات لم تُدفع.`,
        },
      ),
      { additionalProperties: false },
    ),
    loyaltyOwnerTiers: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          ownerId: t.String(),
          programId: t.String(),
          tierId: __nullable__(
            t.String({
              description: `\`null\` = لا مستوى مؤهَّل بعد (BR-L4.4: برنامجٌ بلا مستويات شرعيّ)`,
            }),
          ),
          qualifyingSpend: t.Number({
            description: `إنفاق النافذة المتدحرجة وقت الحساب — يُفسّر «لماذا هذا المستوى» بلا إعادة اشتقاق`,
          }),
          windowMonths: t.Integer(),
          computedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `[LY-P3] **لقطة** مستوى المالك — كاشٌ تكتبه المهمّة اليومية، لا مصدرَ حقيقة.
BR-L4.1 يقول إنّ المستوى **مشتقّ لا مُسنَد**، وهذا الجدول لا ينقض ذلك: كلّ قراءة
تخصّ مالكًا بعينه تشتقّ المستوى من الدفتر عند القراءة، ولا تسأل هذا الصفّ قطّ. وجوده
لغرضٍ واحد لا تستطيع القراءة تقديمه: التصفية والتجميع عبر آلاف المُلّاك في تقارير
§11 بلا استعلامٍ لكلّ مالك — نفس الدور الذي يؤدّيه \`slaStatus\` في CRM-P5 و\`nextDueAt\`
في التنويم.
ولا عمود «اجعل هذا المالك ذهبيًا»: لا \`tierId\` يُكتب بيد، ولا مسار يكتبه إلّا إعادةُ
الحساب. صفٌّ متقادم يعني كاشًا متأخّرًا، لا مالكًا في مستوى خاطئ.`,
        },
      ),
      { additionalProperties: false },
    ),
    sales: t.Array(
      t.Object(
        {
          id: t.String(),
          code: t.String(),
          clinicId: t.String(),
          status: t.Union(
            [t.Literal("PENDING"), t.Literal("PAID"), t.Literal("REFUNDED")],
            { additionalProperties: false },
          ),
          subtotal: t.Number(),
          discount: t.Number(),
          discountCode: __nullable__(t.String()),
          netTotal: t.Number(),
          taxRate: t.Number(),
          taxAmount: t.Number(),
          total: t.Number(),
          taxTemplateId: __nullable__(t.String()),
          cogsAmount: t.Number(),
          paymentMethod: t.Union(
            [t.Literal("CASH"), t.Literal("CARD"), t.Literal("TRANSFER")],
            { additionalProperties: false },
          ),
          createdById: __nullable__(t.String()),
          posOpeningEntryId: __nullable__(t.String()),
          membershipId: __nullable__(t.String()),
          customerName: __nullable__(t.String()),
          customerPhone: __nullable__(t.String()),
          ownerId: __nullable__(
            t.String({
              description: `[LY-P1] المالك المختار على الكاشير — يُحفظ الآن بعد أن كان يُمرَّر للتسعير ويُرمى.
\`partyId\` كان يصل \`priceSale\` (قالب الضريبة) و\`membership.ownerId\` (خصم العضوية)
ثمّ لا يُكتب في أيّ عمود، فبيعٌ لمالكٍ غير عضو كان يفقد هويّته تمامًا. وذلك يجعل
كسب النقاط على نقطة البيع مستحيلًا (BR-L5.2 «نفس القاعدة بلا بُعد تأمين»)،
والاستبدال في LY-P2 كذلك (BR-L6.5 يشترط طرفًا مربوطًا). §17.2 صفّ ٧.
\`SetNull\` لا \`Cascade\`: حذف مالكٍ لا يجوز أن يمحو بيعًا — البيع واقعةٌ محاسبية.`,
            }),
          ),
          notes: __nullable__(t.String()),
          paidAt: __nullable__(t.Date()),
          fulfillment: t.Union(
            [t.Literal("AT_PAYMENT"), t.Literal("ON_DISPENSE")],
            { additionalProperties: false },
          ),
          dispensedAt: __nullable__(t.Date()),
          dispensedById: __nullable__(t.String()),
          refundedAt: __nullable__(t.Date()),
          refundReason: __nullable__(t.String()),
          refundedById: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    inpatientStays: t.Array(
      t.Object(
        {
          id: t.String(),
          code: t.String({ description: `IP-XXXX` }),
          clinicId: t.String(),
          branchId: t.String({
            description: `إلزامي: الحيوان المنوَّم موجود فيزيائيًا في فرع واحد`,
          }),
          patientId: t.String(),
          ownerId: t.String(),
          kind: t.Union(
            [
              t.Literal("MEDICAL"),
              t.Literal("SURGICAL"),
              t.Literal("ICU"),
              t.Literal("ISOLATION"),
              t.Literal("BOARDING"),
            ],
            {
              additionalProperties: false,
              description: `نوع الإقامة — يقرّر البوابات الإلزامية وقواعد الإسكان لا شكل السجل.`,
            },
          ),
          status: t.Union(
            [
              t.Literal("REQUESTED"),
              t.Literal("ADMITTED"),
              t.Literal("IN_CARE"),
              t.Literal("DISCHARGE_PENDING"),
              t.Literal("DISCHARGED"),
              t.Literal("CANCELLED"),
            ],
            {
              additionalProperties: false,
              description: `حالات الإقامة. المسار خطّي قصير عمدًا: الإقامة ليست سير عمل بمراحل، بل مدّة
زمنية لها بداية ونهاية وما بينهما رعاية متكرّرة.`,
            },
          ),
          acuity: t.Union(
            [
              t.Literal("LOW"),
              t.Literal("MEDIUM"),
              t.Literal("HIGH"),
              t.Literal("CRITICAL"),
            ],
            {
              additionalProperties: false,
              description: `درجة الحرجية — يدوية في الإصدار الأول (القرار D7). حسابها آليًا من العلامات
الحيوية ممكن لاحقًا وبيانات اللوحة تكفيه، لكن رقمًا محسوبًا يُعرض كأنه حكم
سريري قبل أن يُعاير على أنواع الحيوانات خطرٌ لا فائدة.`,
            },
          ),
          attendingStaffId: t.String({
            description: `الطبيب المعالج — إليه تُصعَّد الإنذارات الحرجة`,
          }),
          admittedById: __nullable__(t.String()),
          appointmentId: __nullable__(
            t.String({
              description: `أبواب الدخول — كلاهما اختياري، فالدخول المباشر (طوارئ) لا يمرّ بأيّهما`,
            }),
          ),
          operationCaseId: __nullable__(t.String()),
          presentingComplaint: __nullable__(t.String()),
          admissionDiagnosis: __nullable__(t.String()),
          isolationReason: __nullable__(t.String()),
          admissionWeightRecordId: __nullable__(
            t.String({
              description: `وزن الدخول كسجل علامات حيوية لا كرقم — الجرعة تُحسب منه، ومصدر الوزن الوحيد
المقبول في هذا النظام هو \`VitalSignsRecord\` (نفس قاعدة \`Prescription\`).`,
            }),
          ),
          monitoringIntervalMinutes: t.Integer({
            description: `دورية قياس العلامات الحيوية بالدقائق — أساس بند «القياس مستحق» في محرّك الاستحقاق`,
          }),
          dailyRateServiceId: __nullable__(
            t.String({
              description: `سعر اليوم — خدمة من كتالوج العيادة، وسعرها مُثبَّت لحظة الدخول فلا يتغيّر
أثر تعديل الكتالوج على إقامة جارية.`,
            }),
          ),
          dailyRateSnapshot: __nullable__(t.Number()),
          requestedAt: t.Date({
            description: `وقت كتابة الطلب. الطلب يسبق الدخول، فـ\`admittedAt\` تبقى فارغة حتى الإسكان
ولا تُقرأ كبداية للإقامة قبله — مدّة الإقامة تُحسب من الدخول لا من الطلب.`,
          }),
          admittedAt: __nullable__(t.Date()),
          expectedDischargeAt: __nullable__(t.Date()),
          dischargedAt: __nullable__(t.Date()),
          dischargeKind: __nullable__(
            t.Union(
              [
                t.Literal("ROUTINE"),
                t.Literal("AGAINST_MEDICAL_ADVICE"),
                t.Literal("TRANSFERRED"),
                t.Literal("DIED"),
                t.Literal("EUTHANIZED"),
              ],
              {
                additionalProperties: false,
                description: `طريقة انتهاء الإقامة. ليست تفصيلًا إحصائيًا: النافق والمُيسَّر موته يتجاوزان
بوابات الأوامر (لا معنى لطلب إيقاف مضادّ حيوي على حيوان نفق) ويستلزمان سببًا.`,
              },
            ),
          ),
          dischargedById: __nullable__(t.String()),
          dischargeSummaryAr: __nullable__(t.String()),
          dischargeInstructionsAr: __nullable__(t.String()),
          cancelReasonAr: __nullable__(t.String()),
          nextDueAt: __nullable__(
            t.Date({
              description: `كاش أقرب استحقاق عبر كل أوامر الإقامة — نفس فكرة \`VaccinationRecord.nextDueAt\`:
«من يحتاج شيئًا الآن؟» يصير مسحًا مفهرسًا بدل حساب لكل إقامة على حدة.
يُعاد حسابه في كل كتابة تحرّكه، ولا يُقرأ قطّ كمصدر حقيقة للعرض التفصيلي.`,
            }),
          ),
          isDeleted: t.Boolean(),
          deletedAt: __nullable__(t.Date()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `الإقامة — التجميعة الجذر للوحدة.`,
        },
      ),
      { additionalProperties: false },
    ),
    petOwnerRequests: t.Array(
      t.Object(
        {
          id: t.String(),
          code: t.String(),
          accountId: t.String(),
          clinicId: t.String(),
          ownerId: t.String(),
          patientId: __nullable__(t.String()),
          kind: t.Union(
            [
              t.Literal("REFILL"),
              t.Literal("RECORDS"),
              t.Literal("CERTIFICATE"),
              t.Literal("CALLBACK"),
              t.Literal("QUESTION"),
              t.Literal("CANCEL_APPOINTMENT"),
            ],
            { additionalProperties: false },
          ),
          body: __nullable__(t.String()),
          status: t.Union(
            [
              t.Literal("NEW"),
              t.Literal("IN_REVIEW"),
              t.Literal("APPROVED"),
              t.Literal("DECLINED"),
              t.Literal("FULFILLED"),
              t.Literal("CANCELLED"),
            ],
            { additionalProperties: false },
          ),
          handledById: __nullable__(t.String()),
          handledAt: __nullable__(t.Date()),
          declineReason: __nullable__(t.String()),
          reply: __nullable__(
            t.String({
              description: `*
* ردّ العيادة كما يقرؤه المالك — منفصل عن سبب الرفض.`,
            }),
          ),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `*
* ما قرأه المالك من التنبيهات.
* التنبيهات **مشتقّة** من السجلّات (جرعة مستحقّة، موعد قادم، فاتورة غير مدفوعة) ولا
* تُخزَّن صفوفًا — فلا يوجد ما يُعلَّم عليه «مقروء». هذا الجدول يحفظ المفتاح الثابت
* للتنبيه المشتقّ وحده، فيبقى الاشتقاق مصدر الحقيقة وتبقى حالة القراءة للمالك.
*
* [PP] طلبٌ مكتوب من مالك عبر التطبيق — تجديد دواء، تقرير، شهادة، سؤال، طلب اتصال.
* جدولٌ مستقلّ لا إعادة استعمال لـ\`MobileBookingRequest\`: ذاك طابور الزيارات المنزلية،
* وحشرُ طلب تجديدِ دواءٍ فيه يُفسد الطابور الذي تعمل عليه المركبات كل يوم.
* \`ownerId\` مطلوب: الطلب من حسابٍ موثَّق دائمًا، فلا مطابقة أرقام هنا ولا طلبٌ يتيم.`,
        },
      ),
      { additionalProperties: false },
    ),
    emergencyArrivals: t.Array(
      t.Object(
        {
          id: t.String(),
          code: t.String({ description: `ER-XXXX عبر generateUniqueCode` }),
          clinicId: t.String(),
          branchId: t.String(),
          status: t.Union(
            [
              t.Literal("EN_ROUTE"),
              t.Literal("ARRIVED"),
              t.Literal("TRIAGED"),
              t.Literal("DISPOSED"),
              t.Literal("LEFT_WITHOUT_TRIAGE"),
              t.Literal("CANCELLED"),
            ],
            { additionalProperties: false },
          ),
          source: t.Union(
            [
              t.Literal("WALK_IN"),
              t.Literal("PHONE"),
              t.Literal("PUBLIC_BOOKING"),
              t.Literal("PET_PORTAL"),
              t.Literal("AGENT"),
              t.Literal("REFERRAL"),
              t.Literal("MOBILE_REQUEST"),
              t.Literal("SCHEDULED_VISIT"),
            ],
            { additionalProperties: false },
          ),
          expectedAt: __nullable__(
            t.Date({
              description: `«في الطريق»: الوصول المتوقّع. يبقى للمقارنة بعد الوصول الفعلي`,
            }),
          ),
          arrivedAt: __nullable__(t.Date()),
          patientId: __nullable__(
            t.String({
              description: `المريض والمالك — فارغان لحيوان مجهول (كلب شارد، حيوان أحضره غريب). القرار
D2: الفراغ هنا مسموح، أمّا التحويل إلى زيارة فيشترط تسجيل المريض أوّلًا.`,
            }),
          ),
          ownerId: __nullable__(t.String()),
          provisionalLabel: __nullable__(
            t.String({
              description: `وصف مؤقّت لحيوان مجهول: «كلب بنّي، ذكر، ~20 كجم، أُحضر من طريق الملك فهد»`,
            }),
          ),
          presentingComplaint: t.String(),
          appointmentId: __nullable__(
            t.String({
              description: `الزيارة التي تحوّل إليها الوصول عند الفرز — فارغة قبله، وتبقى فارغة لمن غادر`,
            }),
          ),
          createdById: __nullable__(t.String()),
          leftReason: __nullable__(
            t.String({
              description: `سبب المغادرة قبل الفرز أو الإلغاء — مسجَّل دائمًا، فالرقم بلا سبب لا يُحسَّن`,
            }),
          ),
          stability: __nullable__(
            t.Union(
              [
                t.Literal("STABLE"),
                t.Literal("UNSTABLE"),
                t.Literal("CRITICAL"),
              ],
              {
                additionalProperties: false,
                description: `[E5] استقرار الحالة كما قدّره آخر تقييم — يُغيّر «جاهز للقرار» على اللوحة.`,
              },
            ),
          ),
          lastReassessedAt: __nullable__(
            t.Date({
              description: `آخر تقييم (فرز أو إعادة فرز) — منه يُحسب تأخّر إعادة التقييم حسب إيقاع اللون`,
            }),
          ),
          dispositionKind: __nullable__(
            t.Union(
              [
                t.Literal("DISCHARGED"),
                t.Literal("ADMITTED"),
                t.Literal("TO_SURGERY"),
                t.Literal("TRANSFERRED"),
                t.Literal("LEFT_AGAINST_ADVICE"),
                t.Literal("DIED"),
                t.Literal("EUTHANIZED"),
              ],
              {
                additionalProperties: false,
                description: `[E5] مآل حالة الطوارئ — القرار الذي يُقفل الحلقة ويسلّم إلى الوحدة التالية.
كل قيمة تسلّم إلى شيء قائم: الإدخال يكتب **طلب** تنويم (لا إسكانًا — الفصل الذي
اختارته وحدة التنويم بين قرار الطبيب وفعل العنبر)، والجراحة تفتح حالة عملية
بالإلحاح الموروث، والخروج يُكمل مسار الزيارة العادي إلى الدفع.`,
              },
            ),
          ),
          dispositionAt: __nullable__(t.Date()),
          dispositionById: __nullable__(t.String()),
          dispositionNotes: __nullable__(t.String()),
          transferDestination: __nullable__(
            t.String({
              description: `وجهة التحويل — إلزامية حين \`dispositionKind = TRANSFERRED\``,
            }),
          ),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `وصول إلى الطوارئ — **الباب الوحيد الذي لا تملكه آلة الزيارات**.
الزيارة تشترط طبيبًا ووقتًا ومدّة، وثلاثتها مجهولة لحيوان دهسته سيارة في
الثانية فجرًا. هذا السجلّ يحمل تلك الفجوة حتى يسدّها الفرز، فلا نضطرّ إلى
تلفيق طبيب وموعد لنفتح ملفًّا — ولا إلى جعل \`staffId\` اختياريًّا في نموذج
تقرؤه كل شاشة في التطبيق.`,
        },
      ),
      { additionalProperties: false },
    ),
    notificationOutbox: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          channel: t.Union(
            [
              t.Literal("INBOX"),
              t.Literal("EMAIL"),
              t.Literal("WHATSAPP"),
              t.Literal("SMS"),
              t.Literal("PUSH"),
            ],
            { additionalProperties: false },
          ),
          status: t.Union(
            [
              t.Literal("QUEUED"),
              t.Literal("SENDING"),
              t.Literal("SENT"),
              t.Literal("FAILED"),
              t.Literal("SKIPPED"),
              t.Literal("CANCELLED"),
              t.Literal("AWAITING_MANUAL"),
            ],
            { additionalProperties: false },
          ),
          recipientKind: t.Union(
            [t.Literal("OWNER"), t.Literal("USER"), t.Literal("CLINIC")],
            { additionalProperties: false },
          ),
          ownerId: __nullable__(t.String()),
          recipientUserId: __nullable__(t.String()),
          toAddress: __nullable__(
            t.String({
              description: `عنوان التسليم وقت الإدراج (بريد أو رقم E.164) — لقطة: تغيير رقم المالك
لاحقًا يجب ألّا يُعيد كتابة إلى أين ذهبت رسالةُ الأمس`,
            }),
          ),
          subject: __nullable__(t.String()),
          body: t.String(),
          trigger: __nullable__(
            t.Union(
              [
                t.Literal("VACCINATION_DUE"),
                t.Literal("GROOMING_DUE"),
                t.Literal("NUTRITION_RECHECK_DUE"),
                t.Literal("APPOINTMENT_UPCOMING"),
                t.Literal("APPOINTMENT_NO_SHOW"),
                t.Literal("CARE_PLAN_VISIT_DUE"),
                t.Literal("INVOICE_OVERDUE"),
                t.Literal("MEMBERSHIP_RENEWAL"),
                t.Literal("POST_OP_FOLLOW_UP"),
              ],
              {
                additionalProperties: false,
                description: `سببُ التذكير. كلٌّ منها مربوطٌ بمحرّك استحقاق **قائم بالفعل** — لا يعيد أيٌّ
منها حساب موعدٍ من جديد، وهذا شرطٌ لا تفصيل: نسخةٌ ثانية من منطق الجدولة تختلف
عن الأولى حتمًا، فيصير التذكير يقول غير ما تقوله الشاشة.`,
              },
            ),
          ),
          ruleId: __nullable__(t.String()),
          patientId: __nullable__(t.String()),
          appointmentId: __nullable__(t.String()),
          dedupeKey: t.String(),
          scheduledFor: t.Date(),
          attempts: t.Integer(),
          maxAttempts: t.Integer(),
          sentAt: __nullable__(t.Date()),
          failedAt: __nullable__(t.Date()),
          lastError: __nullable__(t.String()),
          manualLink: __nullable__(
            t.String({
              description: `مزوّد واتساب MANUAL: رابط wa.me الجاهز. وجودُه يعني أن الإرسال فعلٌ بشريّ
موثَّق، لا وعدٌ بإرسالٍ آليّ لا يحدث.`,
            }),
          ),
          manualSentById: __nullable__(
            t.String({
              description: `من ضغط الرابط — به يصير الإرسال اليدويّ حدثًا مسجَّلًا لا افتراضًا`,
            }),
          ),
          metadata: __nullable__(t.Any()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `رسالةٌ صادرة واحدة، بقناةٍ واحدة، لمستلِمٍ واحد.
**\`dedupeKey\` هو العمود الحامل.** صيغته
\`{trigger}:{subjectId}:{بصمة الاستحقاق}\` — مثلًا
\`VACCINATION_DUE:pat_123:RABIES:2026-10-01\`. وفرادتُه على مستوى العيادة هي ما
يجعل المُجدوِل عديمَ الأثر عند التكرار: أوّلُ إدراجٍ يفوز، وما بعده يُهمَل بهدوء.
بدونه كان كل تشغيل cron يُنشئ رسالةً جديدة للسبب نفسه.
والجسد **لقطة** لا قالبٌ يُحلّ عند الإرسال: تعديل القالب غدًا يجب ألّا يغيّر ما
أُرسل أمس (نفس منطق \`VaccinationRecord.vaccineNameSnapshot\`).`,
        },
      ),
      { additionalProperties: false },
    ),
    recallContacts: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          ownerId: t.String(),
          patientId: __nullable__(t.String()),
          trigger: t.Union(
            [
              t.Literal("VACCINATION_DUE"),
              t.Literal("GROOMING_DUE"),
              t.Literal("NUTRITION_RECHECK_DUE"),
              t.Literal("APPOINTMENT_UPCOMING"),
              t.Literal("APPOINTMENT_NO_SHOW"),
              t.Literal("CARE_PLAN_VISIT_DUE"),
              t.Literal("INVOICE_OVERDUE"),
              t.Literal("MEMBERSHIP_RENEWAL"),
              t.Literal("POST_OP_FOLLOW_UP"),
            ],
            {
              additionalProperties: false,
              description: `سببُ التذكير. كلٌّ منها مربوطٌ بمحرّك استحقاق **قائم بالفعل** — لا يعيد أيٌّ
منها حساب موعدٍ من جديد، وهذا شرطٌ لا تفصيل: نسخةٌ ثانية من منطق الجدولة تختلف
عن الأولى حتمًا، فيصير التذكير يقول غير ما تقوله الشاشة.`,
            },
          ),
          dedupeKey: t.String({
            description: `نفس بصمة \`NotificationOutbox.dedupeKey\` — بها يُربط التواصل باستحقاقٍ بعينه
ويُكتم من قائمة العمل ما عولج فعلًا`,
          }),
          channel: t.Union(
            [
              t.Literal("PHONE"),
              t.Literal("WHATSAPP"),
              t.Literal("EMAIL"),
              t.Literal("SMS"),
              t.Literal("IN_PERSON"),
              t.Literal("INBOX"),
            ],
            { additionalProperties: false },
          ),
          outcome: t.Union(
            [
              t.Literal("BOOKED"),
              t.Literal("NO_ANSWER"),
              t.Literal("CALLBACK_REQUESTED"),
              t.Literal("DECLINED"),
              t.Literal("WRONG_NUMBER"),
              t.Literal("SNOOZED"),
              t.Literal("INFORMED"),
            ],
            { additionalProperties: false },
          ),
          notes: __nullable__(t.String()),
          snoozedUntil: __nullable__(
            t.Date({
              description: `تأجيلٌ صريح — قائمة اليوم تتخطّاه حتى هذا التاريخ`,
            }),
          ),
          bookedAppointmentId: __nullable__(
            t.String({
              description: `الموعد الذي أُغلق به الاستدعاء حين \`outcome = BOOKED\``,
            }),
          ),
          contactedById: __nullable__(t.String()),
          contactedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `«كلّمنا هذا المالك». الصفّ الذي لم يكن موجودًا قبل هذه الوحدة إطلاقًا — ولا
\`lastContactedAt\` ولا عدّاد محاولات ولا تأجيل. أثرُ غيابه ملموس: قائمة استدعاءٍ
يعمل عليها موظّفان فيُكلَّم المالك مرّتين، ونسبة الالتزام (المقياس الذي تبيعه
أنظمة الاستدعاء التجارية) غير قابلة للحساب أصلًا.`,
        },
      ),
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const OwnerPlainInputCreate = t.Object(
  {
    code: t.String(),
    name: t.String(),
    phone: t.String(),
    phoneE164: t.Optional(__nullable__(t.String())),
    email: t.Optional(__nullable__(t.String())),
    gender: t.Optional(
      __nullable__(
        t.Union(
          [t.Literal("MALE"), t.Literal("FEMALE"), t.Literal("UNKNOWN")],
          { additionalProperties: false },
        ),
      ),
    ),
    ownerType: t.Optional(
      t.Union(
        [
          t.Literal("ALL"),
          t.Literal("VIP"),
          t.Literal("LOYALTY"),
          t.Literal("NEW"),
          t.Literal("CURRENT"),
        ],
        { additionalProperties: false },
      ),
    ),
    relationship: t.Optional(
      __nullable__(
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
    ),
    country: t.Optional(__nullable__(t.String())),
    city: t.Optional(__nullable__(t.String())),
    address: t.Optional(__nullable__(t.String())),
    notes: t.Optional(__nullable__(t.String())),
    active: t.Optional(t.Boolean()),
    isDeleted: t.Optional(t.Boolean()),
    deletedAt: t.Optional(__nullable__(t.Date())),
    editsCount: t.Optional(t.Integer()),
  },
  { additionalProperties: false },
);

export const OwnerPlainInputUpdate = t.Object(
  {
    code: t.Optional(t.String()),
    name: t.Optional(t.String()),
    phone: t.Optional(t.String()),
    phoneE164: t.Optional(__nullable__(t.String())),
    email: t.Optional(__nullable__(t.String())),
    gender: t.Optional(
      __nullable__(
        t.Union(
          [t.Literal("MALE"), t.Literal("FEMALE"), t.Literal("UNKNOWN")],
          { additionalProperties: false },
        ),
      ),
    ),
    ownerType: t.Optional(
      t.Union(
        [
          t.Literal("ALL"),
          t.Literal("VIP"),
          t.Literal("LOYALTY"),
          t.Literal("NEW"),
          t.Literal("CURRENT"),
        ],
        { additionalProperties: false },
      ),
    ),
    relationship: t.Optional(
      __nullable__(
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
    ),
    country: t.Optional(__nullable__(t.String())),
    city: t.Optional(__nullable__(t.String())),
    address: t.Optional(__nullable__(t.String())),
    notes: t.Optional(__nullable__(t.String())),
    active: t.Optional(t.Boolean()),
    isDeleted: t.Optional(t.Boolean()),
    deletedAt: t.Optional(__nullable__(t.Date())),
    editsCount: t.Optional(t.Integer()),
  },
  { additionalProperties: false },
);

export const OwnerRelationsInputCreate = t.Object(
  {
    crmDeals: t.Optional(
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
    crmWonDeals: t.Optional(
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
    patients: t.Optional(
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
    appointments: t.Optional(
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
    portalLinks: t.Optional(
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
    inboxItems: t.Optional(
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
    labTestOrders: t.Optional(
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
    radiologyOrders: t.Optional(
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
    operationCases: t.Optional(
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
    serviceAddresses: t.Optional(
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
    mobileBookingRequests: t.Optional(
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
    consents: t.Optional(
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
    groomingSessions: t.Optional(
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
    memberships: t.Optional(
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
    insuranceClaims: t.Optional(
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
    loyaltyLedger: t.Optional(
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
    loyaltyRedemptions: t.Optional(
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
    loyaltyOwnerTiers: t.Optional(
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
    sales: t.Optional(
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
    inpatientStays: t.Optional(
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
    petOwnerRequests: t.Optional(
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
    emergencyArrivals: t.Optional(
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
    notificationOutbox: t.Optional(
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
    recallContacts: t.Optional(
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

export const OwnerRelationsInputUpdate = t.Partial(
  t.Object(
    {
      crmDeals: t.Partial(
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
      crmWonDeals: t.Partial(
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
      patients: t.Partial(
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
      appointments: t.Partial(
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
      portalLinks: t.Partial(
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
      inboxItems: t.Partial(
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
      labTestOrders: t.Partial(
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
      radiologyOrders: t.Partial(
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
      operationCases: t.Partial(
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
      serviceAddresses: t.Partial(
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
      mobileBookingRequests: t.Partial(
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
      consents: t.Partial(
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
      groomingSessions: t.Partial(
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
      memberships: t.Partial(
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
      insuranceClaims: t.Partial(
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
      loyaltyLedger: t.Partial(
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
      loyaltyRedemptions: t.Partial(
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
      loyaltyOwnerTiers: t.Partial(
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
      sales: t.Partial(
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
      inpatientStays: t.Partial(
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
      petOwnerRequests: t.Partial(
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
      emergencyArrivals: t.Partial(
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
      notificationOutbox: t.Partial(
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
      recallContacts: t.Partial(
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

export const OwnerWhere = t.Partial(
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
          name: t.String(),
          phone: t.String(),
          phoneE164: t.String(),
          email: t.String(),
          gender: t.Union(
            [t.Literal("MALE"), t.Literal("FEMALE"), t.Literal("UNKNOWN")],
            { additionalProperties: false },
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
          relationship: t.Union(
            [
              t.Literal("OWNER"),
              t.Literal("GUARDIAN"),
              t.Literal("DELEGATE"),
              t.Literal("EMERGENCY"),
            ],
            { additionalProperties: false },
          ),
          country: t.String(),
          city: t.String(),
          address: t.String(),
          notes: t.String(),
          active: t.Boolean(),
          isDeleted: t.Boolean(),
          deletedAt: t.Date(),
          editsCount: t.Integer(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "Owner" },
  ),
);

export const OwnerWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            {
              id: t.String(),
              code: t.String(),
              clinicId_phone: t.Object(
                { clinicId: t.String(), phone: t.String() },
                { additionalProperties: false },
              ),
              clinicId_phoneE164: t.Object(
                { clinicId: t.String(), phoneE164: t.String() },
                { additionalProperties: false },
              ),
            },
            { additionalProperties: false },
          ),
          { additionalProperties: false },
        ),
        t.Union(
          [
            t.Object({ id: t.String() }),
            t.Object({ code: t.String() }),
            t.Object({
              clinicId_phone: t.Object(
                { clinicId: t.String(), phone: t.String() },
                { additionalProperties: false },
              ),
            }),
            t.Object({
              clinicId_phoneE164: t.Object(
                { clinicId: t.String(), phoneE164: t.String() },
                { additionalProperties: false },
              ),
            }),
          ],
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
              name: t.String(),
              phone: t.String(),
              phoneE164: t.String(),
              email: t.String(),
              gender: t.Union(
                [t.Literal("MALE"), t.Literal("FEMALE"), t.Literal("UNKNOWN")],
                { additionalProperties: false },
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
              relationship: t.Union(
                [
                  t.Literal("OWNER"),
                  t.Literal("GUARDIAN"),
                  t.Literal("DELEGATE"),
                  t.Literal("EMERGENCY"),
                ],
                { additionalProperties: false },
              ),
              country: t.String(),
              city: t.String(),
              address: t.String(),
              notes: t.String(),
              active: t.Boolean(),
              isDeleted: t.Boolean(),
              deletedAt: t.Date(),
              editsCount: t.Integer(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "Owner" },
);

export const OwnerSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      code: t.Boolean(),
      crmDeals: t.Boolean(),
      crmWonDeals: t.Boolean(),
      clinicId: t.Boolean(),
      name: t.Boolean(),
      phone: t.Boolean(),
      phoneE164: t.Boolean(),
      email: t.Boolean(),
      gender: t.Boolean(),
      ownerType: t.Boolean(),
      relationship: t.Boolean(),
      country: t.Boolean(),
      city: t.Boolean(),
      address: t.Boolean(),
      notes: t.Boolean(),
      active: t.Boolean(),
      isDeleted: t.Boolean(),
      deletedAt: t.Boolean(),
      editsCount: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinic: t.Boolean(),
      patients: t.Boolean(),
      appointments: t.Boolean(),
      portalLinks: t.Boolean(),
      inboxItems: t.Boolean(),
      labTestOrders: t.Boolean(),
      radiologyOrders: t.Boolean(),
      operationCases: t.Boolean(),
      serviceAddresses: t.Boolean(),
      mobileBookingRequests: t.Boolean(),
      consents: t.Boolean(),
      groomingSessions: t.Boolean(),
      memberships: t.Boolean(),
      insuranceClaims: t.Boolean(),
      loyaltyLedger: t.Boolean(),
      loyaltyRedemptions: t.Boolean(),
      loyaltyOwnerTiers: t.Boolean(),
      sales: t.Boolean(),
      inpatientStays: t.Boolean(),
      petOwnerRequests: t.Boolean(),
      emergencyArrivals: t.Boolean(),
      notificationOutbox: t.Boolean(),
      recallContacts: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const OwnerInclude = t.Partial(
  t.Object(
    {
      crmDeals: t.Boolean(),
      crmWonDeals: t.Boolean(),
      gender: t.Boolean(),
      ownerType: t.Boolean(),
      relationship: t.Boolean(),
      clinic: t.Boolean(),
      patients: t.Boolean(),
      appointments: t.Boolean(),
      portalLinks: t.Boolean(),
      inboxItems: t.Boolean(),
      labTestOrders: t.Boolean(),
      radiologyOrders: t.Boolean(),
      operationCases: t.Boolean(),
      serviceAddresses: t.Boolean(),
      mobileBookingRequests: t.Boolean(),
      consents: t.Boolean(),
      groomingSessions: t.Boolean(),
      memberships: t.Boolean(),
      insuranceClaims: t.Boolean(),
      loyaltyLedger: t.Boolean(),
      loyaltyRedemptions: t.Boolean(),
      loyaltyOwnerTiers: t.Boolean(),
      sales: t.Boolean(),
      inpatientStays: t.Boolean(),
      petOwnerRequests: t.Boolean(),
      emergencyArrivals: t.Boolean(),
      notificationOutbox: t.Boolean(),
      recallContacts: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const OwnerOrderBy = t.Partial(
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
      name: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      phone: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      phoneE164: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      email: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      country: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      city: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      address: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      notes: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      active: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      isDeleted: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      deletedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      editsCount: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      updatedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const Owner = t.Composite([OwnerPlain, OwnerRelations], {
  additionalProperties: false,
});

export const OwnerInputCreate = t.Composite(
  [OwnerPlainInputCreate, OwnerRelationsInputCreate],
  { additionalProperties: false },
);

export const OwnerInputUpdate = t.Composite(
  [OwnerPlainInputUpdate, OwnerRelationsInputUpdate],
  { additionalProperties: false },
);
