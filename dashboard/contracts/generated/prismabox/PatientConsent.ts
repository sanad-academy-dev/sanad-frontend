import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const PatientConsentPlain = t.Object(
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
    locale: t.Union([t.Literal("AR"), t.Literal("EN"), t.Literal("BOTH")], {
      additionalProperties: false,
    }),
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
);

export const PatientConsentRelations = t.Object(
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
    template: __nullable__(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          key: t.String(),
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
          version: t.Integer(),
          titleAr: t.String(),
          titleEn: t.String(),
          defaultLocale: t.Union(
            [t.Literal("AR"), t.Literal("EN"), t.Literal("BOTH")],
            { additionalProperties: false },
          ),
          speciesKey: __nullable__(t.String()),
          blocks: t.Any(),
          active: t.Boolean(),
          isDefault: t.Boolean(),
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
    witnessStaff: __nullable__(
      t.Object(
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
    ),
    signedByStaff: __nullable__(
      t.Object(
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
    ),
  },
  { additionalProperties: false },
);

export const PatientConsentPlainInputCreate = t.Object(
  {
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
    locale: t.Optional(
      t.Union([t.Literal("AR"), t.Literal("EN"), t.Literal("BOTH")], {
        additionalProperties: false,
      }),
    ),
    status: t.Optional(
      t.Union(
        [
          t.Literal("DRAFT"),
          t.Literal("AWAITING_SIGNATURE"),
          t.Literal("SIGNED"),
          t.Literal("REVOKED"),
        ],
        { additionalProperties: false },
      ),
    ),
    fieldValues: t.Optional(t.Any()),
    textSnapshot: t.Optional(t.String()),
    signerName: t.Optional(__nullable__(t.String())),
    signerRelationship: t.Optional(__nullable__(t.String())),
    signatureMethod: t.Optional(
      __nullable__(
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
    ),
    signatureUrl: t.Optional(__nullable__(t.String())),
    signedAt: t.Optional(__nullable__(t.Date())),
    revokedAt: t.Optional(__nullable__(t.Date())),
    revokeReason: t.Optional(__nullable__(t.String())),
    sourceScanUrl: t.Optional(__nullable__(t.String())),
    extractedByAi: t.Optional(t.Boolean()),
  },
  { additionalProperties: false },
);

export const PatientConsentPlainInputUpdate = t.Object(
  {
    templateKey: t.Optional(t.String()),
    templateVersion: t.Optional(t.Integer()),
    type: t.Optional(
      t.Union(
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
    ),
    locale: t.Optional(
      t.Union([t.Literal("AR"), t.Literal("EN"), t.Literal("BOTH")], {
        additionalProperties: false,
      }),
    ),
    status: t.Optional(
      t.Union(
        [
          t.Literal("DRAFT"),
          t.Literal("AWAITING_SIGNATURE"),
          t.Literal("SIGNED"),
          t.Literal("REVOKED"),
        ],
        { additionalProperties: false },
      ),
    ),
    fieldValues: t.Optional(t.Any()),
    textSnapshot: t.Optional(t.String()),
    signerName: t.Optional(__nullable__(t.String())),
    signerRelationship: t.Optional(__nullable__(t.String())),
    signatureMethod: t.Optional(
      __nullable__(
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
    ),
    signatureUrl: t.Optional(__nullable__(t.String())),
    signedAt: t.Optional(__nullable__(t.Date())),
    revokedAt: t.Optional(__nullable__(t.Date())),
    revokeReason: t.Optional(__nullable__(t.String())),
    sourceScanUrl: t.Optional(__nullable__(t.String())),
    extractedByAi: t.Optional(t.Boolean()),
  },
  { additionalProperties: false },
);

export const PatientConsentRelationsInputCreate = t.Object(
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
    template: t.Optional(
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
    witnessStaff: t.Optional(
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
    signedByStaff: t.Optional(
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
  { additionalProperties: false },
);

export const PatientConsentRelationsInputUpdate = t.Partial(
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
      template: t.Partial(
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
      witnessStaff: t.Partial(
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
      signedByStaff: t.Partial(
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
    { additionalProperties: false },
  ),
);

export const PatientConsentWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          clinicId: t.String(),
          patientId: t.String(),
          ownerId: t.String(),
          templateId: t.String(),
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
          operationCaseId: t.String(),
          appointmentId: t.String(),
          inpatientStayId: t.String(),
          fieldValues: t.Any(),
          textSnapshot: t.String(),
          signerName: t.String(),
          signerRelationship: t.String(),
          signatureMethod: t.Union(
            [
              t.Literal("DRAWN"),
              t.Literal("TYPED"),
              t.Literal("UPLOADED"),
              t.Literal("VERBAL_WITNESSED"),
            ],
            { additionalProperties: false },
          ),
          signatureUrl: t.String(),
          witnessStaffId: t.String(),
          signedByStaffId: t.String(),
          signedAt: t.Date(),
          revokedAt: t.Date(),
          revokeReason: t.String(),
          sourceScanUrl: t.String(),
          extractedByAi: t.Boolean(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "PatientConsent" },
  ),
);

export const PatientConsentWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object({ id: t.String() }, { additionalProperties: false }),
          { additionalProperties: false },
        ),
        t.Union([t.Object({ id: t.String() })], {
          additionalProperties: false,
        }),
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
              clinicId: t.String(),
              patientId: t.String(),
              ownerId: t.String(),
              templateId: t.String(),
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
              operationCaseId: t.String(),
              appointmentId: t.String(),
              inpatientStayId: t.String(),
              fieldValues: t.Any(),
              textSnapshot: t.String(),
              signerName: t.String(),
              signerRelationship: t.String(),
              signatureMethod: t.Union(
                [
                  t.Literal("DRAWN"),
                  t.Literal("TYPED"),
                  t.Literal("UPLOADED"),
                  t.Literal("VERBAL_WITNESSED"),
                ],
                { additionalProperties: false },
              ),
              signatureUrl: t.String(),
              witnessStaffId: t.String(),
              signedByStaffId: t.String(),
              signedAt: t.Date(),
              revokedAt: t.Date(),
              revokeReason: t.String(),
              sourceScanUrl: t.String(),
              extractedByAi: t.Boolean(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "PatientConsent" },
);

export const PatientConsentSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      clinicId: t.Boolean(),
      patientId: t.Boolean(),
      ownerId: t.Boolean(),
      templateId: t.Boolean(),
      templateKey: t.Boolean(),
      templateVersion: t.Boolean(),
      type: t.Boolean(),
      locale: t.Boolean(),
      status: t.Boolean(),
      operationCaseId: t.Boolean(),
      appointmentId: t.Boolean(),
      inpatientStayId: t.Boolean(),
      fieldValues: t.Boolean(),
      textSnapshot: t.Boolean(),
      signerName: t.Boolean(),
      signerRelationship: t.Boolean(),
      signatureMethod: t.Boolean(),
      signatureUrl: t.Boolean(),
      witnessStaffId: t.Boolean(),
      signedByStaffId: t.Boolean(),
      signedAt: t.Boolean(),
      revokedAt: t.Boolean(),
      revokeReason: t.Boolean(),
      sourceScanUrl: t.Boolean(),
      extractedByAi: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinic: t.Boolean(),
      patient: t.Boolean(),
      owner: t.Boolean(),
      template: t.Boolean(),
      operationCase: t.Boolean(),
      appointment: t.Boolean(),
      inpatientStay: t.Boolean(),
      witnessStaff: t.Boolean(),
      signedByStaff: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const PatientConsentInclude = t.Partial(
  t.Object(
    {
      type: t.Boolean(),
      locale: t.Boolean(),
      status: t.Boolean(),
      signatureMethod: t.Boolean(),
      clinic: t.Boolean(),
      patient: t.Boolean(),
      owner: t.Boolean(),
      template: t.Boolean(),
      operationCase: t.Boolean(),
      appointment: t.Boolean(),
      inpatientStay: t.Boolean(),
      witnessStaff: t.Boolean(),
      signedByStaff: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const PatientConsentOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clinicId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      patientId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      ownerId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      templateId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      templateKey: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      templateVersion: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      operationCaseId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      appointmentId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      inpatientStayId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      fieldValues: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      textSnapshot: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      signerName: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      signerRelationship: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      signatureUrl: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      witnessStaffId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      signedByStaffId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      signedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      revokedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      revokeReason: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      sourceScanUrl: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      extractedByAi: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const PatientConsent = t.Composite(
  [PatientConsentPlain, PatientConsentRelations],
  { additionalProperties: false },
);

export const PatientConsentInputCreate = t.Composite(
  [PatientConsentPlainInputCreate, PatientConsentRelationsInputCreate],
  { additionalProperties: false },
);

export const PatientConsentInputUpdate = t.Composite(
  [PatientConsentPlainInputUpdate, PatientConsentRelationsInputUpdate],
  { additionalProperties: false },
);
