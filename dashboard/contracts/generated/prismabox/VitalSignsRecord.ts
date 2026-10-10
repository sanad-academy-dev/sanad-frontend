import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const VitalSignsRecordPlain = t.Object(
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
);

export const VitalSignsRecordRelations = t.Object(
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
    branch: __nullable__(
      t.Object(
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
    recordedBy: __nullable__(
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
    labOrder: __nullable__(
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
    ),
    radiologyOrder: __nullable__(
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
    ),
    operationCase: __nullable__(
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
    ),
    inpatientStay: __nullable__(
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
    ),
    corrects: __nullable__(
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
    ),
    correction: __nullable__(
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
    ),
    admissionForStay: __nullable__(
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
    ),
    inpatientAdministration: __nullable__(
      t.Object(
        {
          id: t.String(),
          stayId: t.String(),
          orderId: t.String(),
          dueAt: t.Date(),
          status: t.Union(
            [
              t.Literal("PENDING"),
              t.Literal("GIVEN"),
              t.Literal("SKIPPED"),
              t.Literal("HELD"),
            ],
            {
              additionalProperties: false,
              description: `حالة صفّ الإعطاء الواحد. لا قيمة MISSED هنا عمدًا: الفائت اشتقاق من
(\`dueAt\` + المهلة < الآن) على صفٍّ ما زال PENDING. تخزينه يحتاج وظيفةً دوريّة
تكتبه — ولا مجدول في هذا المستودع — فيصبح الحقل كذبةً كلما نام النظام.`,
            },
          ),
          givenAt: __nullable__(t.Date()),
          performedById: __nullable__(t.String()),
          witnessId: __nullable__(
            t.String({
              description: `الشاهد — إلزامي للمواد المراقَبة، ويجب أن يختلف عن المنفّذ (قاعدة سجل المراقَبة)`,
            }),
          ),
          doseGivenAmount: __nullable__(t.Number()),
          doseGivenUnit: __nullable__(t.String()),
          stockQuantity: __nullable__(
            t.Integer({
              description: `الكمّية المخصومة من المخزون بوحدات المخزون — عدد صحيح عمدًا كما في
\`DispenseEvent.quantity\`: الجرعة السريرية (٢٥٠ مجم) والوحدة المخزنية
(أمبولة) رقمان مختلفان، وخلطُهما يجعل الصيدلية تختلف مع الدفتر إلى الأبد.
null = لم يُخصم مخزون (مراقبة، تغذية، صنف غير مرتبط).`,
            }),
          ),
          warehouseId: __nullable__(t.String()),
          priceSnapshot: __nullable__(
            t.Number({
              description: `سعر الوحدة لحظة الإعطاء — الفوترة تقرأه ولا تعود إلى الكتالوج`,
            }),
          ),
          batchId: __nullable__(
            t.String({
              description: `لقطة الدفعة كما في \`DispenseEvent\`: الدفعة قد تُحذف أو يتغيّر رقمها، وما
دخل جسم الحيوان لا يتغيّر.`,
            }),
          ),
          batchNoSnapshot: __nullable__(t.String()),
          expiryDateSnapshot: __nullable__(t.Date()),
          vitalSignsRecordId: __nullable__(
            t.String({
              description: `أوامر المراقبة تنتهي بقياس — الصفّ يربط السجل الذي أُنشئ عند تنفيذه`,
            }),
          ),
          eatenFraction: __nullable__(
            t.Number({
              description: `حقول ورقة الرعاية المهيكلة — تُملأ لأوامر التغذية والملاحظة، لا للدواء.
مهيكلة لا نصّية لأنها ما يُرسم منه اتجاه: «لم يأكل منذ يومين» لا يُقرأ من ملاحظات.
0.00–1.00 من الوجبة المقدَّمة`,
            }),
          ),
          urination: __nullable__(t.Boolean()),
          defecation: __nullable__(t.Boolean()),
          vomiting: __nullable__(t.Boolean()),
          notesAr: __nullable__(t.String()),
          skipReasonAr: __nullable__(t.String()),
          correctsId: __nullable__(
            t.String({
              description: `سلسلة التصحيح — نفس آلية \`VitalSignsRecord.correctsId\``,
            }),
          ),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `صفّ التنفيذ الواحد — «الجرعة الثامنة مساءً» سطرًا قائمًا بذاته.
هذا هو جوهر الوحدة: ورقة العلاج التي تُملأ على القفص. الصفوف تُولَّد مقدَّمًا من
جدول الأمر، فتظهر في القائمة قبل موعدها، وتُعلَّم عند التنفيذ. صفٌّ حالته GIVEN
لا يُعدَّل أبدًا — التصحيح صفٌّ جديد يشير إليه، تمامًا كسجل العلامات الحيوية.`,
        },
      ),
    ),
    triageAssessment: __nullable__(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          branchId: t.String(),
          appointmentId: t.String(),
          patientId: __nullable__(
            t.String({
              description: `فارغ لحيوان مجهول لم يُسجَّل بعد (القرار D2)`,
            }),
          ),
          proposedCategory: t.Union(
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
          category: t.Union(
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
          overrideReason: __nullable__(t.String()),
          discriminators: t.Array(
            t.String({
              description: `أكواد مُميِّزات VTL المُختارة — المرجع في \`triage-discriminators.data.ts\``,
            }),
            { additionalProperties: false },
          ),
          attScore: __nullable__(
            t.Integer({
              description: `درجة ATT (0–18). \`null\` حين لا تكتمل محاورها — لا تُلفَّق درجة من محور ناقص،
فدرجةٌ ملفَّقة تُقرأ كتنبّؤ بالنجاة وهي ليست كذلك.`,
            }),
          ),
          vitalsRecordId: __nullable__(t.String()),
          supersedesId: __nullable__(
            t.String({ description: `سلسلة إعادة الفرز` }),
          ),
          assessedById: t.String(),
          assessedAt: t.Date(),
          notes: __nullable__(t.String()),
        },
        {
          additionalProperties: false,
          description: `تقييم فرز واحد — **صفٌّ يُضاف ولا يُعدَّل أبدًا** (درس \`InpatientAdministration\`
و\`AnesthesiaEvent\`).
الفرز سلسلة لا حدث: الحيوان يتدهور في غرفة الانتظار، وإعادة الفرز هي ما يلتقط
ذلك. فالتقييم الجديد يشير إلى الذي حلّ محلّه (\`supersedesId\`) بدل أن يكتب فوقه،
ويبقى الأصل شاهدًا على ما كان معلومًا في تلك اللحظة.`,
        },
      ),
    ),
    clinicalExams: t.Array(
      t.Object(
        {
          id: t.String(),
          appointmentId: t.String(),
          startedAt: __nullable__(t.Date()),
          completedAt: __nullable__(t.Date()),
          currentStep: t.Integer(),
          chiefComplaint: __nullable__(t.String()),
          duration: __nullable__(t.String()),
          presentIllnessHistory: __nullable__(t.String()),
          ownerNotes: __nullable__(t.String()),
          symptoms: t.Array(
            t.Union(
              [
                t.Literal("VOMITING"),
                t.Literal("DIARRHEA"),
                t.Literal("COUGH"),
                t.Literal("SNEEZING"),
                t.Literal("LETHARGY"),
              ],
              { additionalProperties: false },
            ),
            { additionalProperties: false },
          ),
          urination: __nullable__(
            t.Union(
              [
                t.Literal("NORMAL"),
                t.Literal("INCREASED"),
                t.Literal("DECREASED"),
                t.Literal("ABSENT"),
              ],
              { additionalProperties: false },
            ),
          ),
          defecation: __nullable__(
            t.Union(
              [
                t.Literal("NORMAL"),
                t.Literal("INCREASED"),
                t.Literal("DECREASED"),
                t.Literal("ABSENT"),
              ],
              { additionalProperties: false },
            ),
          ),
          appetite: __nullable__(
            t.Union(
              [
                t.Literal("NORMAL"),
                t.Literal("INCREASED"),
                t.Literal("DECREASED"),
                t.Literal("ABSENT"),
              ],
              { additionalProperties: false },
            ),
          ),
          waterIntake: __nullable__(
            t.Union(
              [
                t.Literal("NORMAL"),
                t.Literal("INCREASED"),
                t.Literal("DECREASED"),
                t.Literal("ABSENT"),
              ],
              { additionalProperties: false },
            ),
          ),
          vitalsRecordId: __nullable__(t.String()),
          weight: __nullable__(t.Number()),
          temperature: __nullable__(t.Number()),
          heartRate: __nullable__(t.Number()),
          respiratoryRate: __nullable__(t.Number()),
          oxygenSaturation: __nullable__(t.Number()),
          bloodPressure: __nullable__(t.String()),
          painScore: __nullable__(t.Number()),
          bodyConditionScore: __nullable__(t.Number()),
          hydration: __nullable__(
            t.Union(
              [
                t.Literal("NORMAL"),
                t.Literal("ABNORMAL"),
                t.Literal("NOT_EXAMINED"),
              ],
              { additionalProperties: false },
            ),
          ),
          skinCondition: __nullable__(
            t.Union(
              [
                t.Literal("NORMAL"),
                t.Literal("ABNORMAL"),
                t.Literal("NOT_EXAMINED"),
              ],
              { additionalProperties: false },
            ),
          ),
          hairCondition: __nullable__(
            t.Union(
              [
                t.Literal("NORMAL"),
                t.Literal("ABNORMAL"),
                t.Literal("NOT_EXAMINED"),
              ],
              { additionalProperties: false },
            ),
          ),
          eyeCondition: __nullable__(
            t.Union(
              [
                t.Literal("NORMAL"),
                t.Literal("ABNORMAL"),
                t.Literal("NOT_EXAMINED"),
              ],
              { additionalProperties: false },
            ),
          ),
          boneCondition: __nullable__(
            t.Union(
              [
                t.Literal("NORMAL"),
                t.Literal("ABNORMAL"),
                t.Literal("NOT_EXAMINED"),
              ],
              { additionalProperties: false },
            ),
          ),
          respiratorySystem: __nullable__(
            t.Union(
              [
                t.Literal("NORMAL"),
                t.Literal("ABNORMAL"),
                t.Literal("NOT_EXAMINED"),
              ],
              { additionalProperties: false },
            ),
          ),
          digestiveSystem: __nullable__(
            t.Union(
              [
                t.Literal("NORMAL"),
                t.Literal("ABNORMAL"),
                t.Literal("NOT_EXAMINED"),
              ],
              { additionalProperties: false },
            ),
          ),
          nervousSystem: __nullable__(
            t.Union(
              [
                t.Literal("NORMAL"),
                t.Literal("ABNORMAL"),
                t.Literal("NOT_EXAMINED"),
              ],
              { additionalProperties: false },
            ),
          ),
          earCondition: __nullable__(
            t.Union(
              [
                t.Literal("NORMAL"),
                t.Literal("ABNORMAL"),
                t.Literal("NOT_EXAMINED"),
              ],
              { additionalProperties: false },
            ),
          ),
          checklistPatientData: t.Boolean(),
          checklistChiefComplaint: t.Boolean(),
          checklistSymptomDuration: t.Boolean(),
          checklistDiet: t.Boolean(),
          checklistVaccinations: t.Boolean(),
          checklistPreviousTreatments: t.Boolean(),
          checklistTemperature: t.Boolean(),
          checklistHeartRate: t.Boolean(),
          checklistBloodPressure: t.Boolean(),
          checklistHydration: t.Boolean(),
          checklistBehavior: t.Boolean(),
          checklistAppetite: t.Boolean(),
          checklistOxygen: t.Boolean(),
          checklistSkin: t.Boolean(),
          checklistSeverity: t.Boolean(),
          checklistAppearance: t.Boolean(),
          checklistRespiration: t.Boolean(),
          checklistDigestive: t.Boolean(),
          checklistNervous: t.Boolean(),
          checklistEar: t.Boolean(),
          checklistVomiting: t.Boolean(),
          checklistConsciousness: t.Boolean(),
          checklistDiagnosis: t.Boolean(),
          checklistUltrasound: t.Boolean(),
          checklistReferral: t.Boolean(),
          checklistXray: t.Boolean(),
          checklistFollowup: t.Boolean(),
          preliminaryDiagnosis: __nullable__(t.String()),
          severity: __nullable__(
            t.Union(
              [
                t.Literal("MILD"),
                t.Literal("MODERATE"),
                t.Literal("SEVERE"),
                t.Literal("CRITICAL"),
              ],
              { additionalProperties: false },
            ),
          ),
          diagnosisDescription: __nullable__(t.String()),
          dietPlan: __nullable__(t.String()),
          monitoringPlan: __nullable__(t.String()),
          vaccinationReviewedAt: __nullable__(t.Date()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    clinicalNotes: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          patientId: t.String({
            description: `مالك السجل هو الحيوان لا الموعد — ولهذا يبقى السجل حين يُحذف الموعد`,
          }),
          appointmentId: __nullable__(
            t.String({
              description: `null = ملاحظة بلا زيارة: استشارة هاتفية، فرز مراجع، أو رأي طبيب ثانٍ
(القرار §11-A). الموعد الواحد يحتمل أكثر من ملاحظة.`,
            }),
          ),
          templateId: __nullable__(
            t.String({
              description: `لقطة القالب — يبقى \`templateKey\`/\`templateVersion\` مقروءَين حتى لو حُذف الصف`,
            }),
          ),
          templateKey: __nullable__(t.String()),
          templateVersion: __nullable__(t.Integer()),
          authorUserId: t.String(),
          status: t.Union(
            [t.Literal("DRAFT"), t.Literal("FINAL"), t.Literal("AMENDED")],
            { additionalProperties: false },
          ),
          subjective: __nullable__(
            t.String({
              description: `النصّ المُركَّب — ما يقرأه إنسان. يُجمَّد عند التوثيق، ولا يتغيّر إذا عُدّل
القالب لاحقًا. هي نفس غريزة \`Invoice.priceSnapshot\`.`,
            }),
          ),
          objective: __nullable__(t.String()),
          assessment: __nullable__(t.String()),
          plan: __nullable__(t.String()),
          answers: t.Any({
            description: `{ [blockId]: value } — البنية القابلة للاستعلام، وهي ما تقرأه التقارير`,
          }),
          vitalsRecordId: __nullable__(
            t.String({
              description: `يُشار إلى القياس ولا يُعاد التقاطه — وحدة العلامات الحيوية تبقى الكاتب الوحيد`,
            }),
          ),
          finalizedAt: __nullable__(t.Date()),
          finalizedById: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `ملاحظة سريرية واحدة — مسوَّدة تُكتب بحرّية، ثم تُوثَّق فلا تُعدَّل بعدها أبدًا.`,
        },
      ),
      { additionalProperties: false },
    ),
    preAnalyticals: t.Array(
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
      { additionalProperties: false },
    ),
    safetyScreenings: t.Array(
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
          pregnancyPossible: __nullable__(t.Boolean()),
          metalImplants: __nullable__(t.Boolean()),
          implantNotes: __nullable__(t.String()),
          priorContrastReaction: __nullable__(t.Boolean()),
          allergies: __nullable__(t.String()),
          asaClass: __nullable__(t.Integer()),
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
      { additionalProperties: false },
    ),
    preAnestheticAssessments: t.Array(
      t.Object(
        {
          id: t.String(),
          caseId: t.String(),
          asaClass: __nullable__(t.Integer()),
          asaEmergency: t.Boolean(),
          lastFoodAt: __nullable__(t.Date()),
          lastWaterAt: __nullable__(t.Date()),
          fastingVerified: t.Boolean(),
          vitalsRecordId: __nullable__(t.String()),
          physicalFindings: __nullable__(t.String()),
          airwayAssessment: __nullable__(t.String()),
          medications: __nullable__(t.String()),
          allergies: __nullable__(t.String()),
          bloodworkReviewed: t.Boolean(),
          imagingReviewed: t.Boolean(),
          labOrderId: __nullable__(t.String()),
          radiologyOrderId: __nullable__(t.String()),
          riskNotes: __nullable__(t.String()),
          premedPlan: __nullable__(t.String()),
          assessedById: __nullable__(t.String()),
          assessedAt: __nullable__(t.Date()),
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

export const VitalSignsRecordPlainInputCreate = t.Object(
  {
    code: t.String(),
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
    weight: t.Optional(__nullable__(t.Number())),
    temperature: t.Optional(__nullable__(t.Number())),
    heartRate: t.Optional(__nullable__(t.Integer())),
    respiratoryRate: t.Optional(__nullable__(t.Integer())),
    oxygenSaturation: t.Optional(__nullable__(t.Integer())),
    bloodPressure: t.Optional(__nullable__(t.String())),
    painScore: t.Optional(__nullable__(t.Integer())),
    bodyConditionScore: t.Optional(__nullable__(t.Integer())),
    capillaryRefillSec: t.Optional(__nullable__(t.Number())),
    mucousMembrane: t.Optional(
      __nullable__(
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
    ),
    notes: t.Optional(__nullable__(t.String())),
    isDeleted: t.Optional(t.Boolean()),
    deletedAt: t.Optional(__nullable__(t.Date())),
    editsCount: t.Optional(t.Integer()),
  },
  { additionalProperties: false },
);

export const VitalSignsRecordPlainInputUpdate = t.Object(
  {
    code: t.Optional(t.String()),
    recordedAt: t.Optional(t.Date()),
    source: t.Optional(
      t.Union(
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
    ),
    weight: t.Optional(__nullable__(t.Number())),
    temperature: t.Optional(__nullable__(t.Number())),
    heartRate: t.Optional(__nullable__(t.Integer())),
    respiratoryRate: t.Optional(__nullable__(t.Integer())),
    oxygenSaturation: t.Optional(__nullable__(t.Integer())),
    bloodPressure: t.Optional(__nullable__(t.String())),
    painScore: t.Optional(__nullable__(t.Integer())),
    bodyConditionScore: t.Optional(__nullable__(t.Integer())),
    capillaryRefillSec: t.Optional(__nullable__(t.Number())),
    mucousMembrane: t.Optional(
      __nullable__(
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
    ),
    notes: t.Optional(__nullable__(t.String())),
    isDeleted: t.Optional(t.Boolean()),
    deletedAt: t.Optional(__nullable__(t.Date())),
    editsCount: t.Optional(t.Integer()),
  },
  { additionalProperties: false },
);

export const VitalSignsRecordRelationsInputCreate = t.Object(
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
    branch: t.Optional(
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
    recordedBy: t.Optional(
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
    labOrder: t.Optional(
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
    radiologyOrder: t.Optional(
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
    operationCase: t.Optional(
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
    inpatientStay: t.Optional(
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
    corrects: t.Optional(
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
    correction: t.Optional(
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
    admissionForStay: t.Optional(
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
    inpatientAdministration: t.Optional(
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
    triageAssessment: t.Optional(
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
    clinicalExams: t.Optional(
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
    clinicalNotes: t.Optional(
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
    preAnalyticals: t.Optional(
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
    safetyScreenings: t.Optional(
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
    preAnestheticAssessments: t.Optional(
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

export const VitalSignsRecordRelationsInputUpdate = t.Partial(
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
      branch: t.Partial(
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
      recordedBy: t.Partial(
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
      labOrder: t.Partial(
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
      radiologyOrder: t.Partial(
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
      operationCase: t.Partial(
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
      inpatientStay: t.Partial(
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
      corrects: t.Partial(
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
      correction: t.Partial(
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
      admissionForStay: t.Partial(
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
      inpatientAdministration: t.Partial(
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
      triageAssessment: t.Partial(
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
      clinicalExams: t.Partial(
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
      clinicalNotes: t.Partial(
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
      preAnalyticals: t.Partial(
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
      safetyScreenings: t.Partial(
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
      preAnestheticAssessments: t.Partial(
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

export const VitalSignsRecordWhere = t.Partial(
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
          recordedById: t.String(),
          appointmentId: t.String(),
          labOrderId: t.String(),
          radiologyOrderId: t.String(),
          operationId: t.String(),
          inpatientStayId: t.String(),
          weight: t.Number(),
          temperature: t.Number(),
          heartRate: t.Integer(),
          respiratoryRate: t.Integer(),
          oxygenSaturation: t.Integer(),
          bloodPressure: t.String(),
          painScore: t.Integer(),
          bodyConditionScore: t.Integer(),
          capillaryRefillSec: t.Number(),
          mucousMembrane: t.Union(
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
          notes: t.String(),
          correctsId: t.String(),
          isDeleted: t.Boolean(),
          deletedAt: t.Date(),
          editsCount: t.Integer(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "VitalSignsRecord" },
  ),
);

export const VitalSignsRecordWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.String(), code: t.String(), correctsId: t.String() },
            { additionalProperties: false },
          ),
          { additionalProperties: false },
        ),
        t.Union(
          [
            t.Object({ id: t.String() }),
            t.Object({ code: t.String() }),
            t.Object({ correctsId: t.String() }),
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
              branchId: t.String(),
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
              recordedById: t.String(),
              appointmentId: t.String(),
              labOrderId: t.String(),
              radiologyOrderId: t.String(),
              operationId: t.String(),
              inpatientStayId: t.String(),
              weight: t.Number(),
              temperature: t.Number(),
              heartRate: t.Integer(),
              respiratoryRate: t.Integer(),
              oxygenSaturation: t.Integer(),
              bloodPressure: t.String(),
              painScore: t.Integer(),
              bodyConditionScore: t.Integer(),
              capillaryRefillSec: t.Number(),
              mucousMembrane: t.Union(
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
              notes: t.String(),
              correctsId: t.String(),
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
  { $id: "VitalSignsRecord" },
);

export const VitalSignsRecordSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      code: t.Boolean(),
      clinicId: t.Boolean(),
      branchId: t.Boolean(),
      patientId: t.Boolean(),
      recordedAt: t.Boolean(),
      source: t.Boolean(),
      recordedById: t.Boolean(),
      appointmentId: t.Boolean(),
      labOrderId: t.Boolean(),
      radiologyOrderId: t.Boolean(),
      operationId: t.Boolean(),
      inpatientStayId: t.Boolean(),
      weight: t.Boolean(),
      temperature: t.Boolean(),
      heartRate: t.Boolean(),
      respiratoryRate: t.Boolean(),
      oxygenSaturation: t.Boolean(),
      bloodPressure: t.Boolean(),
      painScore: t.Boolean(),
      bodyConditionScore: t.Boolean(),
      capillaryRefillSec: t.Boolean(),
      mucousMembrane: t.Boolean(),
      notes: t.Boolean(),
      correctsId: t.Boolean(),
      isDeleted: t.Boolean(),
      deletedAt: t.Boolean(),
      editsCount: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinic: t.Boolean(),
      branch: t.Boolean(),
      patient: t.Boolean(),
      recordedBy: t.Boolean(),
      appointment: t.Boolean(),
      labOrder: t.Boolean(),
      radiologyOrder: t.Boolean(),
      operationCase: t.Boolean(),
      inpatientStay: t.Boolean(),
      corrects: t.Boolean(),
      correction: t.Boolean(),
      admissionForStay: t.Boolean(),
      inpatientAdministration: t.Boolean(),
      triageAssessment: t.Boolean(),
      clinicalExams: t.Boolean(),
      clinicalNotes: t.Boolean(),
      preAnalyticals: t.Boolean(),
      safetyScreenings: t.Boolean(),
      preAnestheticAssessments: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const VitalSignsRecordInclude = t.Partial(
  t.Object(
    {
      source: t.Boolean(),
      mucousMembrane: t.Boolean(),
      clinic: t.Boolean(),
      branch: t.Boolean(),
      patient: t.Boolean(),
      recordedBy: t.Boolean(),
      appointment: t.Boolean(),
      labOrder: t.Boolean(),
      radiologyOrder: t.Boolean(),
      operationCase: t.Boolean(),
      inpatientStay: t.Boolean(),
      corrects: t.Boolean(),
      correction: t.Boolean(),
      admissionForStay: t.Boolean(),
      inpatientAdministration: t.Boolean(),
      triageAssessment: t.Boolean(),
      clinicalExams: t.Boolean(),
      clinicalNotes: t.Boolean(),
      preAnalyticals: t.Boolean(),
      safetyScreenings: t.Boolean(),
      preAnestheticAssessments: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const VitalSignsRecordOrderBy = t.Partial(
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
      recordedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      recordedById: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      appointmentId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      labOrderId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      radiologyOrderId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      operationId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      inpatientStayId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      weight: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      temperature: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      heartRate: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      respiratoryRate: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      oxygenSaturation: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      bloodPressure: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      painScore: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      bodyConditionScore: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      capillaryRefillSec: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      notes: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      correctsId: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const VitalSignsRecord = t.Composite(
  [VitalSignsRecordPlain, VitalSignsRecordRelations],
  { additionalProperties: false },
);

export const VitalSignsRecordInputCreate = t.Composite(
  [VitalSignsRecordPlainInputCreate, VitalSignsRecordRelationsInputCreate],
  { additionalProperties: false },
);

export const VitalSignsRecordInputUpdate = t.Composite(
  [VitalSignsRecordPlainInputUpdate, VitalSignsRecordRelationsInputUpdate],
  { additionalProperties: false },
);
