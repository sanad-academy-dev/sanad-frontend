import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const TriageAssessmentPlain = t.Object(
  {
    id: t.String(),
    clinicId: t.String(),
    branchId: t.String(),
    appointmentId: t.String(),
    patientId: __nullable__(
      t.String({ description: `فارغ لحيوان مجهول لم يُسجَّل بعد (القرار D2)` }),
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
    supersedesId: __nullable__(t.String({ description: `سلسلة إعادة الفرز` })),
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
);

export const TriageAssessmentRelations = t.Object(
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
    appointment: t.Object(
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
    patient: __nullable__(
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
    ),
    vitalsRecord: __nullable__(
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
    assessedBy: t.Object(
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
    supersedes: __nullable__(
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
    supersededBy: __nullable__(
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
  },
  {
    additionalProperties: false,
    description: `تقييم فرز واحد — **صفٌّ يُضاف ولا يُعدَّل أبدًا** (درس \`InpatientAdministration\`
و\`AnesthesiaEvent\`).
الفرز سلسلة لا حدث: الحيوان يتدهور في غرفة الانتظار، وإعادة الفرز هي ما يلتقط
ذلك. فالتقييم الجديد يشير إلى الذي حلّ محلّه (\`supersedesId\`) بدل أن يكتب فوقه،
ويبقى الأصل شاهدًا على ما كان معلومًا في تلك اللحظة.`,
  },
);

export const TriageAssessmentPlainInputCreate = t.Object(
  {
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
    overrideReason: t.Optional(__nullable__(t.String())),
    discriminators: t.Array(
      t.String({
        description: `أكواد مُميِّزات VTL المُختارة — المرجع في \`triage-discriminators.data.ts\``,
      }),
      { additionalProperties: false },
    ),
    attScore: t.Optional(
      __nullable__(
        t.Integer({
          description: `درجة ATT (0–18). \`null\` حين لا تكتمل محاورها — لا تُلفَّق درجة من محور ناقص،
فدرجةٌ ملفَّقة تُقرأ كتنبّؤ بالنجاة وهي ليست كذلك.`,
        }),
      ),
    ),
    assessedAt: t.Optional(t.Date()),
    notes: t.Optional(__nullable__(t.String())),
  },
  {
    additionalProperties: false,
    description: `تقييم فرز واحد — **صفٌّ يُضاف ولا يُعدَّل أبدًا** (درس \`InpatientAdministration\`
و\`AnesthesiaEvent\`).
الفرز سلسلة لا حدث: الحيوان يتدهور في غرفة الانتظار، وإعادة الفرز هي ما يلتقط
ذلك. فالتقييم الجديد يشير إلى الذي حلّ محلّه (\`supersedesId\`) بدل أن يكتب فوقه،
ويبقى الأصل شاهدًا على ما كان معلومًا في تلك اللحظة.`,
  },
);

export const TriageAssessmentPlainInputUpdate = t.Object(
  {
    proposedCategory: t.Optional(
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
    category: t.Optional(
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
    overrideReason: t.Optional(__nullable__(t.String())),
    discriminators: t.Optional(
      t.Array(
        t.String({
          description: `أكواد مُميِّزات VTL المُختارة — المرجع في \`triage-discriminators.data.ts\``,
        }),
        { additionalProperties: false },
      ),
    ),
    attScore: t.Optional(
      __nullable__(
        t.Integer({
          description: `درجة ATT (0–18). \`null\` حين لا تكتمل محاورها — لا تُلفَّق درجة من محور ناقص،
فدرجةٌ ملفَّقة تُقرأ كتنبّؤ بالنجاة وهي ليست كذلك.`,
        }),
      ),
    ),
    assessedAt: t.Optional(t.Date()),
    notes: t.Optional(__nullable__(t.String())),
  },
  {
    additionalProperties: false,
    description: `تقييم فرز واحد — **صفٌّ يُضاف ولا يُعدَّل أبدًا** (درس \`InpatientAdministration\`
و\`AnesthesiaEvent\`).
الفرز سلسلة لا حدث: الحيوان يتدهور في غرفة الانتظار، وإعادة الفرز هي ما يلتقط
ذلك. فالتقييم الجديد يشير إلى الذي حلّ محلّه (\`supersedesId\`) بدل أن يكتب فوقه،
ويبقى الأصل شاهدًا على ما كان معلومًا في تلك اللحظة.`,
  },
);

export const TriageAssessmentRelationsInputCreate = t.Object(
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
    appointment: t.Object(
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
    patient: t.Optional(
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
    vitalsRecord: t.Optional(
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
    assessedBy: t.Object(
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
    supersedes: t.Optional(
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
    supersededBy: t.Optional(
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
    description: `تقييم فرز واحد — **صفٌّ يُضاف ولا يُعدَّل أبدًا** (درس \`InpatientAdministration\`
و\`AnesthesiaEvent\`).
الفرز سلسلة لا حدث: الحيوان يتدهور في غرفة الانتظار، وإعادة الفرز هي ما يلتقط
ذلك. فالتقييم الجديد يشير إلى الذي حلّ محلّه (\`supersedesId\`) بدل أن يكتب فوقه،
ويبقى الأصل شاهدًا على ما كان معلومًا في تلك اللحظة.`,
  },
);

export const TriageAssessmentRelationsInputUpdate = t.Partial(
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
      appointment: t.Object(
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
      patient: t.Partial(
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
      vitalsRecord: t.Partial(
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
      assessedBy: t.Object(
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
      supersedes: t.Partial(
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
      supersededBy: t.Partial(
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
      description: `تقييم فرز واحد — **صفٌّ يُضاف ولا يُعدَّل أبدًا** (درس \`InpatientAdministration\`
و\`AnesthesiaEvent\`).
الفرز سلسلة لا حدث: الحيوان يتدهور في غرفة الانتظار، وإعادة الفرز هي ما يلتقط
ذلك. فالتقييم الجديد يشير إلى الذي حلّ محلّه (\`supersedesId\`) بدل أن يكتب فوقه،
ويبقى الأصل شاهدًا على ما كان معلومًا في تلك اللحظة.`,
    },
  ),
);

export const TriageAssessmentWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          clinicId: t.String(),
          branchId: t.String(),
          appointmentId: t.String(),
          patientId: t.String({
            description: `فارغ لحيوان مجهول لم يُسجَّل بعد (القرار D2)`,
          }),
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
          overrideReason: t.String(),
          discriminators: t.Array(
            t.String({
              description: `أكواد مُميِّزات VTL المُختارة — المرجع في \`triage-discriminators.data.ts\``,
            }),
            { additionalProperties: false },
          ),
          attScore: t.Integer({
            description: `درجة ATT (0–18). \`null\` حين لا تكتمل محاورها — لا تُلفَّق درجة من محور ناقص،
فدرجةٌ ملفَّقة تُقرأ كتنبّؤ بالنجاة وهي ليست كذلك.`,
          }),
          vitalsRecordId: t.String(),
          supersedesId: t.String({ description: `سلسلة إعادة الفرز` }),
          assessedById: t.String(),
          assessedAt: t.Date(),
          notes: t.String(),
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
    { $id: "TriageAssessment" },
  ),
);

export const TriageAssessmentWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            {
              id: t.String(),
              vitalsRecordId: t.String(),
              supersedesId: t.String({ description: `سلسلة إعادة الفرز` }),
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
          { additionalProperties: false },
        ),
        t.Union(
          [
            t.Object({ id: t.String() }),
            t.Object({ vitalsRecordId: t.String() }),
            t.Object({
              supersedesId: t.String({ description: `سلسلة إعادة الفرز` }),
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
              clinicId: t.String(),
              branchId: t.String(),
              appointmentId: t.String(),
              patientId: t.String({
                description: `فارغ لحيوان مجهول لم يُسجَّل بعد (القرار D2)`,
              }),
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
              overrideReason: t.String(),
              discriminators: t.Array(
                t.String({
                  description: `أكواد مُميِّزات VTL المُختارة — المرجع في \`triage-discriminators.data.ts\``,
                }),
                { additionalProperties: false },
              ),
              attScore: t.Integer({
                description: `درجة ATT (0–18). \`null\` حين لا تكتمل محاورها — لا تُلفَّق درجة من محور ناقص،
فدرجةٌ ملفَّقة تُقرأ كتنبّؤ بالنجاة وهي ليست كذلك.`,
              }),
              vitalsRecordId: t.String(),
              supersedesId: t.String({ description: `سلسلة إعادة الفرز` }),
              assessedById: t.String(),
              assessedAt: t.Date(),
              notes: t.String(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "TriageAssessment" },
);

export const TriageAssessmentSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      clinicId: t.Boolean(),
      branchId: t.Boolean(),
      appointmentId: t.Boolean(),
      patientId: t.Boolean(),
      proposedCategory: t.Boolean(),
      category: t.Boolean(),
      overrideReason: t.Boolean(),
      discriminators: t.Boolean(),
      attScore: t.Boolean(),
      vitalsRecordId: t.Boolean(),
      supersedesId: t.Boolean(),
      assessedById: t.Boolean(),
      assessedAt: t.Boolean(),
      notes: t.Boolean(),
      clinic: t.Boolean(),
      appointment: t.Boolean(),
      patient: t.Boolean(),
      vitalsRecord: t.Boolean(),
      assessedBy: t.Boolean(),
      supersedes: t.Boolean(),
      supersededBy: t.Boolean(),
      _count: t.Boolean(),
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
);

export const TriageAssessmentInclude = t.Partial(
  t.Object(
    {
      proposedCategory: t.Boolean(),
      category: t.Boolean(),
      clinic: t.Boolean(),
      appointment: t.Boolean(),
      patient: t.Boolean(),
      vitalsRecord: t.Boolean(),
      assessedBy: t.Boolean(),
      supersedes: t.Boolean(),
      supersededBy: t.Boolean(),
      _count: t.Boolean(),
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
);

export const TriageAssessmentOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clinicId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      branchId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      appointmentId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      patientId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      overrideReason: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      discriminators: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      attScore: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      vitalsRecordId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      supersedesId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      assessedById: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      assessedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      notes: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
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
);

export const TriageAssessment = t.Composite(
  [TriageAssessmentPlain, TriageAssessmentRelations],
  { additionalProperties: false },
);

export const TriageAssessmentInputCreate = t.Composite(
  [TriageAssessmentPlainInputCreate, TriageAssessmentRelationsInputCreate],
  { additionalProperties: false },
);

export const TriageAssessmentInputUpdate = t.Composite(
  [TriageAssessmentPlainInputUpdate, TriageAssessmentRelationsInputUpdate],
  { additionalProperties: false },
);
