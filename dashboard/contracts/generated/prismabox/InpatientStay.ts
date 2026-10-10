import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const InpatientStayPlain = t.Object(
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
);

export const InpatientStayRelations = t.Object(
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
    attendingStaff: t.Object(
      {
        id: t.String(),
        code: t.String(),
        clinicId: t.String(),
        userId: __nullable__(t.String()),
        roleId: t.String(),
        branchId: t.String(),
        name: t.String(),
        gender: __nullable__(
          t.Union(
            [t.Literal("MALE"), t.Literal("FEMALE"), t.Literal("UNKNOWN")],
            { additionalProperties: false },
          ),
        ),
        prefix: __nullable__(
          t.Union(
            [
              t.Literal("MR"),
              t.Literal("MRS"),
              t.Literal("MS"),
              t.Literal("DR"),
              t.Literal("PROF"),
            ],
            { additionalProperties: false },
          ),
        ),
        age: __nullable__(t.Integer()),
        licenseNumber: __nullable__(t.String()),
        email: t.String(),
        phone: __nullable__(t.String()),
        country: __nullable__(t.String()),
        city: __nullable__(t.String()),
        address: __nullable__(t.String()),
        notes: __nullable__(t.String()),
        bio: __nullable__(t.String()),
        educationalQualification: __nullable__(t.String()),
        nationality: __nullable__(t.String()),
        avatar: __nullable__(t.String()),
        primarySpecializationId: __nullable__(t.String()),
        secondarySpecializationId: __nullable__(t.String()),
        employmentType: __nullable__(
          t.Union([t.Literal("FULL_TIME"), t.Literal("PART_TIME")], {
            additionalProperties: false,
          }),
        ),
        hireDate: __nullable__(t.Date()),
        isSaudi: t.Boolean(),
        status: t.Union(
          [t.Literal("PENDING"), t.Literal("ACTIVE"), t.Literal("INACTIVE")],
          { additionalProperties: false },
        ),
        active: t.Boolean(),
        isDeleted: t.Boolean(),
        deletedAt: __nullable__(t.Date()),
        createdAt: t.Date(),
        updatedAt: t.Date(),
      },
      { additionalProperties: false },
    ),
    admittedBy: __nullable__(
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
    dischargedBy: __nullable__(
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
    admissionWeightRecord: __nullable__(
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
    dailyRateService: __nullable__(
      t.Object(
        {
          id: t.String(),
          name: t.String(),
          level: t.Union(
            [
              t.Literal("CATEGORY"),
              t.Literal("SUBCATEGORY"),
              t.Literal("ITEM"),
            ],
            { additionalProperties: false },
          ),
          parentId: __nullable__(t.String()),
          isDefault: t.Boolean(),
          clinicId: __nullable__(t.String()),
          order: t.Integer(),
          isLabCategory: t.Boolean(),
          isRadiologyCategory: t.Boolean(),
          isOperationCategory: t.Boolean(),
          isGroomingCategory: t.Boolean(),
          consentCode: __nullable__(t.String()),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    ),
    cageAssignments: t.Array(
      t.Object(
        {
          id: t.String(),
          stayId: t.String(),
          cageId: t.String(),
          assignedAt: t.Date(),
          releasedAt: __nullable__(t.Date()),
          movedById: __nullable__(t.String()),
          reason: __nullable__(
            t.String({
              description: `سبب النقل — يُطلب عند النقل لا عند الإسكان الأول`,
            }),
          ),
        },
        {
          additionalProperties: false,
          description: `إسكان الإقامة في قفص — سجل مُلحَق: كل نقل صفٌّ جديد، والسابق يُغلق بـ
\`releasedAt\`. الإشغال الحالي = الصفوف بلا \`releasedAt\`.
لماذا سجل لا عمود \`cageId\` على الإقامة؟ لأن «أين كان الحيوان الثلاثاء الماضي؟»
سؤال يُطرح فعلًا — عند تتبّع عدوى مثلًا — وعمودٌ يُكتب فوقه يمحو الجواب.`,
        },
      ),
      { additionalProperties: false },
    ),
    orders: t.Array(
      t.Object(
        {
          id: t.String(),
          stayId: t.String(),
          idx: t.Integer(),
          kind: t.Union(
            [
              t.Literal("MEDICATION"),
              t.Literal("FLUID"),
              t.Literal("MONITORING"),
              t.Literal("FEEDING"),
              t.Literal("ACTIVITY"),
              t.Literal("WOUND_CARE"),
              t.Literal("LAB"),
              t.Literal("IMAGING"),
              t.Literal("OTHER"),
            ],
            {
              additionalProperties: false,
              description: `نوع الأمر الطبي. متطابق عمدًا مع \`PostOpOrderKind\` في مواضعه المشتركة، فتحويل
أوامر ما بعد العملية إلى أوامر تنويم يبقى ترجمةً واحدة لواحد.`,
            },
          ),
          status: t.Union(
            [
              t.Literal("ACTIVE"),
              t.Literal("PAUSED"),
              t.Literal("COMPLETED"),
              t.Literal("DISCONTINUED"),
            ],
            { additionalProperties: false },
          ),
          inventoryItemId: __nullable__(
            t.String({
              description: `أحد ثلاثة مصادر للمادة: صنف مخزون، أو منتج كتالوج، أو نصّ حرّ. الاسم مُثبَّت
دائمًا فلا يتغيّر ما هو مكتوب على السجل بتعديل الكتالوج.`,
            }),
          ),
          catalogProductId: __nullable__(t.String()),
          nameSnapshot: t.String(),
          prescriptionItemId: __nullable__(
            t.String({
              description: `[IP3] بند الوصفة الذي صُرف فأنشأ هذا الأمر. حين يُضبط: المخزون خُصم في
الصيدلية لحظة الصرف، فإعطاء الجرعة لا يخصم ثانيةً ولا يُسعِّر. عمود قياسيّ.`,
            }),
          ),
          doseAmount: __nullable__(t.Number()),
          doseUnit: __nullable__(t.String()),
          route: __nullable__(
            t.Union(
              [
                t.Literal("IV"),
                t.Literal("IM"),
                t.Literal("SC"),
                t.Literal("PO"),
                t.Literal("INHALATION"),
                t.Literal("TOPICAL"),
                t.Literal("EPIDURAL"),
                t.Literal("OTHER"),
              ],
              { additionalProperties: false },
            ),
          ),
          rateMlPerHour: __nullable__(t.Number()),
          doseSource: __nullable__(
            t.Union(
              [
                t.Literal("CALCULATED"),
                t.Literal("MANUAL"),
                t.Literal("OVERRIDE"),
              ],
              {
                additionalProperties: false,
                description: `مصدر الجرعة المكتوبة — يُحفظ دائمًا ويُعرض على البند. الفرق بين «حسبها النظام»
و«كتبها الطبيب» و«تجاوز المدى الموثّق» ليس بيانات وصفية: هو ما يجعل سجل
التجاوزات (§12.3) ممكنًا أصلًا.`,
              },
            ),
          ),
          overrideReasonAr: __nullable__(t.String()),
          scheduleIntervalHours: __nullable__(
            t.Integer({
              description: `الجدولة: إمّا كل N ساعة، أو أوقات محدّدة من اليوم، أو عند اللزوم (بلا صفوف).
الثلاثة يتبادلن: \`prn\` صحيحة تُلغي التوليد المسبق أصلًا.`,
            }),
          ),
          scheduleTimes: t.Array(
            t.String({ description: `"08:00" بتوقيت العيادة` }),
            { additionalProperties: false },
          ),
          prn: t.Boolean(),
          startAt: t.Date(),
          endAt: __nullable__(t.Date()),
          instructionsAr: __nullable__(t.String()),
          orderedById: __nullable__(t.String()),
          discontinuedById: __nullable__(t.String()),
          discontinuedAt: __nullable__(t.Date()),
          discontinueReasonAr: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `أمر طبي قائم على الإقامة. الحقول الدوائية مطابقة لـ\`PrescriptionItem\` عمدًا:
نفس محرّك الجرعة يتحقّق منها، ونفس مصدر الوزن، ونفس تصنيف التجاوز.`,
        },
      ),
      { additionalProperties: false },
    ),
    administrations: t.Array(
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
      { additionalProperties: false },
    ),
    activity: t.Array(
      t.Object(
        {
          id: t.String(),
          stayId: t.String(),
          authorUserId: __nullable__(t.String()),
          type: t.Union(
            [
              t.Literal("ADMITTED"),
              t.Literal("STATUS_CHANGED"),
              t.Literal("CAGE_ASSIGNED"),
              t.Literal("CAGE_MOVED"),
              t.Literal("ACUITY_CHANGED"),
              t.Literal("ATTENDING_CHANGED"),
              t.Literal("ORDER_CREATED"),
              t.Literal("ORDER_DISCONTINUED"),
              t.Literal("ADMINISTRATION"),
              t.Literal("VITALS_RECORDED"),
              t.Literal("ALERT"),
              t.Literal("NOTE"),
              t.Literal("HANDOVER"),
              t.Literal("COMPLICATION"),
              t.Literal("INVOICE_PAID"),
              t.Literal("DISCHARGED"),
            ],
            { additionalProperties: false },
          ),
          body: __nullable__(t.String()),
          metadata: __nullable__(t.Any()),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    vitalSigns: t.Array(
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
  },
  {
    additionalProperties: false,
    description: `الإقامة — التجميعة الجذر للوحدة.`,
  },
);

export const InpatientStayPlainInputCreate = t.Object(
  {
    code: t.String({ description: `IP-XXXX` }),
    kind: t.Optional(
      t.Union(
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
    ),
    status: t.Optional(
      t.Union(
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
    ),
    acuity: t.Optional(
      t.Union(
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
    ),
    presentingComplaint: t.Optional(__nullable__(t.String())),
    admissionDiagnosis: t.Optional(__nullable__(t.String())),
    isolationReason: t.Optional(__nullable__(t.String())),
    monitoringIntervalMinutes: t.Optional(
      t.Integer({
        description: `دورية قياس العلامات الحيوية بالدقائق — أساس بند «القياس مستحق» في محرّك الاستحقاق`,
      }),
    ),
    dailyRateSnapshot: t.Optional(__nullable__(t.Number())),
    requestedAt: t.Optional(
      t.Date({
        description: `وقت كتابة الطلب. الطلب يسبق الدخول، فـ\`admittedAt\` تبقى فارغة حتى الإسكان
ولا تُقرأ كبداية للإقامة قبله — مدّة الإقامة تُحسب من الدخول لا من الطلب.`,
      }),
    ),
    admittedAt: t.Optional(__nullable__(t.Date())),
    expectedDischargeAt: t.Optional(__nullable__(t.Date())),
    dischargedAt: t.Optional(__nullable__(t.Date())),
    dischargeKind: t.Optional(
      __nullable__(
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
    ),
    dischargeSummaryAr: t.Optional(__nullable__(t.String())),
    dischargeInstructionsAr: t.Optional(__nullable__(t.String())),
    cancelReasonAr: t.Optional(__nullable__(t.String())),
    nextDueAt: t.Optional(
      __nullable__(
        t.Date({
          description: `كاش أقرب استحقاق عبر كل أوامر الإقامة — نفس فكرة \`VaccinationRecord.nextDueAt\`:
«من يحتاج شيئًا الآن؟» يصير مسحًا مفهرسًا بدل حساب لكل إقامة على حدة.
يُعاد حسابه في كل كتابة تحرّكه، ولا يُقرأ قطّ كمصدر حقيقة للعرض التفصيلي.`,
        }),
      ),
    ),
    isDeleted: t.Optional(t.Boolean()),
    deletedAt: t.Optional(__nullable__(t.Date())),
  },
  {
    additionalProperties: false,
    description: `الإقامة — التجميعة الجذر للوحدة.`,
  },
);

export const InpatientStayPlainInputUpdate = t.Object(
  {
    code: t.Optional(t.String({ description: `IP-XXXX` })),
    kind: t.Optional(
      t.Union(
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
    ),
    status: t.Optional(
      t.Union(
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
    ),
    acuity: t.Optional(
      t.Union(
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
    ),
    presentingComplaint: t.Optional(__nullable__(t.String())),
    admissionDiagnosis: t.Optional(__nullable__(t.String())),
    isolationReason: t.Optional(__nullable__(t.String())),
    monitoringIntervalMinutes: t.Optional(
      t.Integer({
        description: `دورية قياس العلامات الحيوية بالدقائق — أساس بند «القياس مستحق» في محرّك الاستحقاق`,
      }),
    ),
    dailyRateSnapshot: t.Optional(__nullable__(t.Number())),
    requestedAt: t.Optional(
      t.Date({
        description: `وقت كتابة الطلب. الطلب يسبق الدخول، فـ\`admittedAt\` تبقى فارغة حتى الإسكان
ولا تُقرأ كبداية للإقامة قبله — مدّة الإقامة تُحسب من الدخول لا من الطلب.`,
      }),
    ),
    admittedAt: t.Optional(__nullable__(t.Date())),
    expectedDischargeAt: t.Optional(__nullable__(t.Date())),
    dischargedAt: t.Optional(__nullable__(t.Date())),
    dischargeKind: t.Optional(
      __nullable__(
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
    ),
    dischargeSummaryAr: t.Optional(__nullable__(t.String())),
    dischargeInstructionsAr: t.Optional(__nullable__(t.String())),
    cancelReasonAr: t.Optional(__nullable__(t.String())),
    nextDueAt: t.Optional(
      __nullable__(
        t.Date({
          description: `كاش أقرب استحقاق عبر كل أوامر الإقامة — نفس فكرة \`VaccinationRecord.nextDueAt\`:
«من يحتاج شيئًا الآن؟» يصير مسحًا مفهرسًا بدل حساب لكل إقامة على حدة.
يُعاد حسابه في كل كتابة تحرّكه، ولا يُقرأ قطّ كمصدر حقيقة للعرض التفصيلي.`,
        }),
      ),
    ),
    isDeleted: t.Optional(t.Boolean()),
    deletedAt: t.Optional(__nullable__(t.Date())),
  },
  {
    additionalProperties: false,
    description: `الإقامة — التجميعة الجذر للوحدة.`,
  },
);

export const InpatientStayRelationsInputCreate = t.Object(
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
    attendingStaff: t.Object(
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
    admittedBy: t.Optional(
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
    dischargedBy: t.Optional(
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
    admissionWeightRecord: t.Optional(
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
    dailyRateService: t.Optional(
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
    cageAssignments: t.Optional(
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
    orders: t.Optional(
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
    administrations: t.Optional(
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
    vitalSigns: t.Optional(
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
  },
  {
    additionalProperties: false,
    description: `الإقامة — التجميعة الجذر للوحدة.`,
  },
);

export const InpatientStayRelationsInputUpdate = t.Partial(
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
      attendingStaff: t.Object(
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
      admittedBy: t.Partial(
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
      dischargedBy: t.Partial(
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
      admissionWeightRecord: t.Partial(
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
      dailyRateService: t.Partial(
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
      cageAssignments: t.Partial(
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
      orders: t.Partial(
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
      administrations: t.Partial(
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
      vitalSigns: t.Partial(
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
    },
    {
      additionalProperties: false,
      description: `الإقامة — التجميعة الجذر للوحدة.`,
    },
  ),
);

export const InpatientStayWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
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
          admittedById: t.String(),
          appointmentId: t.String({
            description: `أبواب الدخول — كلاهما اختياري، فالدخول المباشر (طوارئ) لا يمرّ بأيّهما`,
          }),
          operationCaseId: t.String(),
          presentingComplaint: t.String(),
          admissionDiagnosis: t.String(),
          isolationReason: t.String(),
          admissionWeightRecordId: t.String({
            description: `وزن الدخول كسجل علامات حيوية لا كرقم — الجرعة تُحسب منه، ومصدر الوزن الوحيد
المقبول في هذا النظام هو \`VitalSignsRecord\` (نفس قاعدة \`Prescription\`).`,
          }),
          monitoringIntervalMinutes: t.Integer({
            description: `دورية قياس العلامات الحيوية بالدقائق — أساس بند «القياس مستحق» في محرّك الاستحقاق`,
          }),
          dailyRateServiceId: t.String({
            description: `سعر اليوم — خدمة من كتالوج العيادة، وسعرها مُثبَّت لحظة الدخول فلا يتغيّر
أثر تعديل الكتالوج على إقامة جارية.`,
          }),
          dailyRateSnapshot: t.Number(),
          requestedAt: t.Date({
            description: `وقت كتابة الطلب. الطلب يسبق الدخول، فـ\`admittedAt\` تبقى فارغة حتى الإسكان
ولا تُقرأ كبداية للإقامة قبله — مدّة الإقامة تُحسب من الدخول لا من الطلب.`,
          }),
          admittedAt: t.Date(),
          expectedDischargeAt: t.Date(),
          dischargedAt: t.Date(),
          dischargeKind: t.Union(
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
          dischargedById: t.String(),
          dischargeSummaryAr: t.String(),
          dischargeInstructionsAr: t.String(),
          cancelReasonAr: t.String(),
          nextDueAt: t.Date({
            description: `كاش أقرب استحقاق عبر كل أوامر الإقامة — نفس فكرة \`VaccinationRecord.nextDueAt\`:
«من يحتاج شيئًا الآن؟» يصير مسحًا مفهرسًا بدل حساب لكل إقامة على حدة.
يُعاد حسابه في كل كتابة تحرّكه، ولا يُقرأ قطّ كمصدر حقيقة للعرض التفصيلي.`,
          }),
          isDeleted: t.Boolean(),
          deletedAt: t.Date(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `الإقامة — التجميعة الجذر للوحدة.`,
        },
      ),
    { $id: "InpatientStay" },
  ),
);

export const InpatientStayWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            {
              id: t.String(),
              code: t.String({ description: `IP-XXXX` }),
              admissionWeightRecordId: t.String({
                description: `وزن الدخول كسجل علامات حيوية لا كرقم — الجرعة تُحسب منه، ومصدر الوزن الوحيد
المقبول في هذا النظام هو \`VitalSignsRecord\` (نفس قاعدة \`Prescription\`).`,
              }),
            },
            {
              additionalProperties: false,
              description: `الإقامة — التجميعة الجذر للوحدة.`,
            },
          ),
          { additionalProperties: false },
        ),
        t.Union(
          [
            t.Object({ id: t.String() }),
            t.Object({ code: t.String({ description: `IP-XXXX` }) }),
            t.Object({
              admissionWeightRecordId: t.String({
                description: `وزن الدخول كسجل علامات حيوية لا كرقم — الجرعة تُحسب منه، ومصدر الوزن الوحيد
المقبول في هذا النظام هو \`VitalSignsRecord\` (نفس قاعدة \`Prescription\`).`,
              }),
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
              admittedById: t.String(),
              appointmentId: t.String({
                description: `أبواب الدخول — كلاهما اختياري، فالدخول المباشر (طوارئ) لا يمرّ بأيّهما`,
              }),
              operationCaseId: t.String(),
              presentingComplaint: t.String(),
              admissionDiagnosis: t.String(),
              isolationReason: t.String(),
              admissionWeightRecordId: t.String({
                description: `وزن الدخول كسجل علامات حيوية لا كرقم — الجرعة تُحسب منه، ومصدر الوزن الوحيد
المقبول في هذا النظام هو \`VitalSignsRecord\` (نفس قاعدة \`Prescription\`).`,
              }),
              monitoringIntervalMinutes: t.Integer({
                description: `دورية قياس العلامات الحيوية بالدقائق — أساس بند «القياس مستحق» في محرّك الاستحقاق`,
              }),
              dailyRateServiceId: t.String({
                description: `سعر اليوم — خدمة من كتالوج العيادة، وسعرها مُثبَّت لحظة الدخول فلا يتغيّر
أثر تعديل الكتالوج على إقامة جارية.`,
              }),
              dailyRateSnapshot: t.Number(),
              requestedAt: t.Date({
                description: `وقت كتابة الطلب. الطلب يسبق الدخول، فـ\`admittedAt\` تبقى فارغة حتى الإسكان
ولا تُقرأ كبداية للإقامة قبله — مدّة الإقامة تُحسب من الدخول لا من الطلب.`,
              }),
              admittedAt: t.Date(),
              expectedDischargeAt: t.Date(),
              dischargedAt: t.Date(),
              dischargeKind: t.Union(
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
              dischargedById: t.String(),
              dischargeSummaryAr: t.String(),
              dischargeInstructionsAr: t.String(),
              cancelReasonAr: t.String(),
              nextDueAt: t.Date({
                description: `كاش أقرب استحقاق عبر كل أوامر الإقامة — نفس فكرة \`VaccinationRecord.nextDueAt\`:
«من يحتاج شيئًا الآن؟» يصير مسحًا مفهرسًا بدل حساب لكل إقامة على حدة.
يُعاد حسابه في كل كتابة تحرّكه، ولا يُقرأ قطّ كمصدر حقيقة للعرض التفصيلي.`,
              }),
              isDeleted: t.Boolean(),
              deletedAt: t.Date(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "InpatientStay" },
);

export const InpatientStaySelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      code: t.Boolean(),
      clinicId: t.Boolean(),
      branchId: t.Boolean(),
      patientId: t.Boolean(),
      ownerId: t.Boolean(),
      kind: t.Boolean(),
      status: t.Boolean(),
      acuity: t.Boolean(),
      attendingStaffId: t.Boolean(),
      admittedById: t.Boolean(),
      appointmentId: t.Boolean(),
      operationCaseId: t.Boolean(),
      presentingComplaint: t.Boolean(),
      admissionDiagnosis: t.Boolean(),
      isolationReason: t.Boolean(),
      admissionWeightRecordId: t.Boolean(),
      monitoringIntervalMinutes: t.Boolean(),
      dailyRateServiceId: t.Boolean(),
      dailyRateSnapshot: t.Boolean(),
      requestedAt: t.Boolean(),
      admittedAt: t.Boolean(),
      expectedDischargeAt: t.Boolean(),
      dischargedAt: t.Boolean(),
      dischargeKind: t.Boolean(),
      dischargedById: t.Boolean(),
      dischargeSummaryAr: t.Boolean(),
      dischargeInstructionsAr: t.Boolean(),
      cancelReasonAr: t.Boolean(),
      nextDueAt: t.Boolean(),
      isDeleted: t.Boolean(),
      deletedAt: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinic: t.Boolean(),
      branch: t.Boolean(),
      patient: t.Boolean(),
      owner: t.Boolean(),
      attendingStaff: t.Boolean(),
      admittedBy: t.Boolean(),
      dischargedBy: t.Boolean(),
      appointment: t.Boolean(),
      operationCase: t.Boolean(),
      admissionWeightRecord: t.Boolean(),
      dailyRateService: t.Boolean(),
      cageAssignments: t.Boolean(),
      orders: t.Boolean(),
      administrations: t.Boolean(),
      activity: t.Boolean(),
      vitalSigns: t.Boolean(),
      consents: t.Boolean(),
      inboxItems: t.Boolean(),
      invoice: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `الإقامة — التجميعة الجذر للوحدة.`,
    },
  ),
);

export const InpatientStayInclude = t.Partial(
  t.Object(
    {
      kind: t.Boolean(),
      status: t.Boolean(),
      acuity: t.Boolean(),
      dischargeKind: t.Boolean(),
      clinic: t.Boolean(),
      branch: t.Boolean(),
      patient: t.Boolean(),
      owner: t.Boolean(),
      attendingStaff: t.Boolean(),
      admittedBy: t.Boolean(),
      dischargedBy: t.Boolean(),
      appointment: t.Boolean(),
      operationCase: t.Boolean(),
      admissionWeightRecord: t.Boolean(),
      dailyRateService: t.Boolean(),
      cageAssignments: t.Boolean(),
      orders: t.Boolean(),
      administrations: t.Boolean(),
      activity: t.Boolean(),
      vitalSigns: t.Boolean(),
      consents: t.Boolean(),
      inboxItems: t.Boolean(),
      invoice: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `الإقامة — التجميعة الجذر للوحدة.`,
    },
  ),
);

export const InpatientStayOrderBy = t.Partial(
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
      attendingStaffId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      admittedById: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      appointmentId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      operationCaseId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      presentingComplaint: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      admissionDiagnosis: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      isolationReason: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      admissionWeightRecordId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      monitoringIntervalMinutes: t.Union(
        [t.Literal("asc"), t.Literal("desc")],
        { additionalProperties: false },
      ),
      dailyRateServiceId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      dailyRateSnapshot: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      requestedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      admittedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      expectedDischargeAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      dischargedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      dischargedById: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      dischargeSummaryAr: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      dischargeInstructionsAr: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      cancelReasonAr: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      nextDueAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
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
    },
    {
      additionalProperties: false,
      description: `الإقامة — التجميعة الجذر للوحدة.`,
    },
  ),
);

export const InpatientStay = t.Composite(
  [InpatientStayPlain, InpatientStayRelations],
  { additionalProperties: false },
);

export const InpatientStayInputCreate = t.Composite(
  [InpatientStayPlainInputCreate, InpatientStayRelationsInputCreate],
  { additionalProperties: false },
);

export const InpatientStayInputUpdate = t.Composite(
  [InpatientStayPlainInputUpdate, InpatientStayRelationsInputUpdate],
  { additionalProperties: false },
);
