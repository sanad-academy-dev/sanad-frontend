import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const ClinicalNotePlain = t.Object(
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
);

export const ClinicalNoteRelations = t.Object(
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
    template: __nullable__(
      t.Object(
        {
          id: t.String(),
          clinicId: __nullable__(
            t.String({
              description: `null = قالب نظام تراه كل العيادات. الكاتب الوحيد لهذا الفرع هو الهجرات:
واجهة القوالب تملأ \`clinicId\` من الجلسة دائمًا، فلا تستطيع عيادة أن تُنشئ
قالب نظام. ولذلك لا قيد فرادة على صفوف النظام — Postgres يعدّ الـNULLات
متمايزة، و\`@@unique\` أدناه يغطّي قوالب العيادات وحدها. القيد الحقيقي على
صفوف النظام هو أن هجرة البذر وحدها تكتبها، وهي تُدرج بشرط عدم الوجود.`,
            }),
          ),
          key: t.String({
            description: `مفتاح ثابت مدى حياة القالب: GENERAL_V1 · VOMITING_V1 · DERM_V1`,
          }),
          version: t.Integer(),
          titleAr: t.String(),
          titleEn: __nullable__(t.String()),
          presentingComplaint: __nullable__(
            t.String({
              description: `الشكوى التي يبحث بها الطبيب عن القالب — «قيء» · «عرج»`,
            }),
          ),
          animalTypeId: __nullable__(
            t.String({
              description: `null = كل الأنواع. مفتاح أجنبي لا نصّ (القرار §11-B): القوالب بيانات تديرها
العيادة، والنصّ المكتوب خطأً يطابق لا شيء بصمت.`,
            }),
          ),
          blocks: t.Any({
            description: `ExamBlock[] — الوصف في §4 من الخطة، ويُتحقَّق منه بـTypeBox عند الكتابة.
كل كتلة تحمل قسمها S|O|A|P — وهذا وحده ما يجعله قالب SOAP لا بانيَ نماذج.`,
          }),
          isDefault: t.Boolean({
            description: `يُقترح تلقائيًا لهذه الشكوى/النوع (نمط \`RadiologyReportTemplate\`)`,
          }),
          active: t.Boolean(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `قالب فحص لكل شكوى — نظامي (\`clinicId = null\`) أو خاصّ بعيادة، ومُصدَّر.`,
        },
      ),
    ),
    author: t.Object(
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
    finalizedBy: __nullable__(
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
    diagnoses: t.Array(
      t.Object(
        {
          id: t.String(),
          noteId: t.String(),
          idx: t.Integer(),
          text: t.String(),
          code: __nullable__(t.String()),
          codeSystem: __nullable__(
            t.String({
              description: `VENOM | SNOMED — يبقى فارغًا في هذه الخطة`,
            }),
          ),
          kind: t.Union(
            [
              t.Literal("DIFFERENTIAL"),
              t.Literal("WORKING"),
              t.Literal("FINAL"),
            ],
            { additionalProperties: false },
          ),
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
          createdAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `التقييم «A» قائمةٌ لا سطر: تفريقي ← عامل ← نهائي.
يُشحن هذا الجدول الآن رغم أن كتالوج الترميز (VeNom/SNOMED) خارج نطاق الخطة —
لأن شحنه لاحقًا يعني ترحيل الملاحظات مرّتين، وشحنه عمودًا نصيًّا يعيد بناء القيد
نفسه الذي وُجدت الخطة لإزالته. \`code\` يبقى فارغًا حتى يصل الكتالوج.`,
        },
      ),
      { additionalProperties: false },
    ),
    addenda: t.Array(
      t.Object(
        {
          id: t.String(),
          noteId: t.String(),
          text: t.String(),
          authoredById: __nullable__(t.String()),
          createdAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `التصحيح بعد التوثيق يُلحَق ولا يُكتب فوقه — نمط \`RadiologyReportAddendum\` نفسه.`,
        },
      ),
      { additionalProperties: false },
    ),
  },
  {
    additionalProperties: false,
    description: `ملاحظة سريرية واحدة — مسوَّدة تُكتب بحرّية، ثم تُوثَّق فلا تُعدَّل بعدها أبدًا.`,
  },
);

export const ClinicalNotePlainInputCreate = t.Object(
  {
    templateKey: t.Optional(__nullable__(t.String())),
    templateVersion: t.Optional(__nullable__(t.Integer())),
    status: t.Optional(
      t.Union([t.Literal("DRAFT"), t.Literal("FINAL"), t.Literal("AMENDED")], {
        additionalProperties: false,
      }),
    ),
    subjective: t.Optional(
      __nullable__(
        t.String({
          description: `النصّ المُركَّب — ما يقرأه إنسان. يُجمَّد عند التوثيق، ولا يتغيّر إذا عُدّل
القالب لاحقًا. هي نفس غريزة \`Invoice.priceSnapshot\`.`,
        }),
      ),
    ),
    objective: t.Optional(__nullable__(t.String())),
    assessment: t.Optional(__nullable__(t.String())),
    plan: t.Optional(__nullable__(t.String())),
    answers: t.Any({
      description: `{ [blockId]: value } — البنية القابلة للاستعلام، وهي ما تقرأه التقارير`,
    }),
    finalizedAt: t.Optional(__nullable__(t.Date())),
  },
  {
    additionalProperties: false,
    description: `ملاحظة سريرية واحدة — مسوَّدة تُكتب بحرّية، ثم تُوثَّق فلا تُعدَّل بعدها أبدًا.`,
  },
);

export const ClinicalNotePlainInputUpdate = t.Object(
  {
    templateKey: t.Optional(__nullable__(t.String())),
    templateVersion: t.Optional(__nullable__(t.Integer())),
    status: t.Optional(
      t.Union([t.Literal("DRAFT"), t.Literal("FINAL"), t.Literal("AMENDED")], {
        additionalProperties: false,
      }),
    ),
    subjective: t.Optional(
      __nullable__(
        t.String({
          description: `النصّ المُركَّب — ما يقرأه إنسان. يُجمَّد عند التوثيق، ولا يتغيّر إذا عُدّل
القالب لاحقًا. هي نفس غريزة \`Invoice.priceSnapshot\`.`,
        }),
      ),
    ),
    objective: t.Optional(__nullable__(t.String())),
    assessment: t.Optional(__nullable__(t.String())),
    plan: t.Optional(__nullable__(t.String())),
    answers: t.Optional(
      t.Any({
        description: `{ [blockId]: value } — البنية القابلة للاستعلام، وهي ما تقرأه التقارير`,
      }),
    ),
    finalizedAt: t.Optional(__nullable__(t.Date())),
  },
  {
    additionalProperties: false,
    description: `ملاحظة سريرية واحدة — مسوَّدة تُكتب بحرّية، ثم تُوثَّق فلا تُعدَّل بعدها أبدًا.`,
  },
);

export const ClinicalNoteRelationsInputCreate = t.Object(
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
    appointment: t.Optional(
      t.Object(
        {
          connect: t.Object(
            {
              id: t.String({
                additionalProperties: false,
                description: `SetNull لا Cascade: حذف الموعد لا يمحو سجلًّا طبيًّا يملكه الحيوان`,
              }),
            },
            {
              additionalProperties: false,
              description: `SetNull لا Cascade: حذف الموعد لا يمحو سجلًّا طبيًّا يملكه الحيوان`,
            },
          ),
        },
        { additionalProperties: false },
      ),
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
    author: t.Object(
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
    finalizedBy: t.Optional(
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
    diagnoses: t.Optional(
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
    addenda: t.Optional(
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
  {
    additionalProperties: false,
    description: `ملاحظة سريرية واحدة — مسوَّدة تُكتب بحرّية، ثم تُوثَّق فلا تُعدَّل بعدها أبدًا.`,
  },
);

export const ClinicalNoteRelationsInputUpdate = t.Partial(
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
      appointment: t.Partial(
        t.Object(
          {
            connect: t.Object(
              {
                id: t.String({
                  additionalProperties: false,
                  description: `SetNull لا Cascade: حذف الموعد لا يمحو سجلًّا طبيًّا يملكه الحيوان`,
                }),
              },
              {
                additionalProperties: false,
                description: `SetNull لا Cascade: حذف الموعد لا يمحو سجلًّا طبيًّا يملكه الحيوان`,
              },
            ),
            disconnect: t.Boolean(),
          },
          {
            additionalProperties: false,
            description: `SetNull لا Cascade: حذف الموعد لا يمحو سجلًّا طبيًّا يملكه الحيوان`,
          },
        ),
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
      author: t.Object(
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
      finalizedBy: t.Partial(
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
      diagnoses: t.Partial(
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
      addenda: t.Partial(
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
    {
      additionalProperties: false,
      description: `ملاحظة سريرية واحدة — مسوَّدة تُكتب بحرّية، ثم تُوثَّق فلا تُعدَّل بعدها أبدًا.`,
    },
  ),
);

export const ClinicalNoteWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          clinicId: t.String(),
          patientId: t.String({
            description: `مالك السجل هو الحيوان لا الموعد — ولهذا يبقى السجل حين يُحذف الموعد`,
          }),
          appointmentId: t.String({
            description: `null = ملاحظة بلا زيارة: استشارة هاتفية، فرز مراجع، أو رأي طبيب ثانٍ
(القرار §11-A). الموعد الواحد يحتمل أكثر من ملاحظة.`,
          }),
          templateId: t.String({
            description: `لقطة القالب — يبقى \`templateKey\`/\`templateVersion\` مقروءَين حتى لو حُذف الصف`,
          }),
          templateKey: t.String(),
          templateVersion: t.Integer(),
          authorUserId: t.String(),
          status: t.Union(
            [t.Literal("DRAFT"), t.Literal("FINAL"), t.Literal("AMENDED")],
            { additionalProperties: false },
          ),
          subjective: t.String({
            description: `النصّ المُركَّب — ما يقرأه إنسان. يُجمَّد عند التوثيق، ولا يتغيّر إذا عُدّل
القالب لاحقًا. هي نفس غريزة \`Invoice.priceSnapshot\`.`,
          }),
          objective: t.String(),
          assessment: t.String(),
          plan: t.String(),
          answers: t.Any({
            description: `{ [blockId]: value } — البنية القابلة للاستعلام، وهي ما تقرأه التقارير`,
          }),
          vitalsRecordId: t.String({
            description: `يُشار إلى القياس ولا يُعاد التقاطه — وحدة العلامات الحيوية تبقى الكاتب الوحيد`,
          }),
          finalizedAt: t.Date(),
          finalizedById: t.String(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `ملاحظة سريرية واحدة — مسوَّدة تُكتب بحرّية، ثم تُوثَّق فلا تُعدَّل بعدها أبدًا.`,
        },
      ),
    { $id: "ClinicalNote" },
  ),
);

export const ClinicalNoteWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.String() },
            {
              additionalProperties: false,
              description: `ملاحظة سريرية واحدة — مسوَّدة تُكتب بحرّية، ثم تُوثَّق فلا تُعدَّل بعدها أبدًا.`,
            },
          ),
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
              patientId: t.String({
                description: `مالك السجل هو الحيوان لا الموعد — ولهذا يبقى السجل حين يُحذف الموعد`,
              }),
              appointmentId: t.String({
                description: `null = ملاحظة بلا زيارة: استشارة هاتفية، فرز مراجع، أو رأي طبيب ثانٍ
(القرار §11-A). الموعد الواحد يحتمل أكثر من ملاحظة.`,
              }),
              templateId: t.String({
                description: `لقطة القالب — يبقى \`templateKey\`/\`templateVersion\` مقروءَين حتى لو حُذف الصف`,
              }),
              templateKey: t.String(),
              templateVersion: t.Integer(),
              authorUserId: t.String(),
              status: t.Union(
                [t.Literal("DRAFT"), t.Literal("FINAL"), t.Literal("AMENDED")],
                { additionalProperties: false },
              ),
              subjective: t.String({
                description: `النصّ المُركَّب — ما يقرأه إنسان. يُجمَّد عند التوثيق، ولا يتغيّر إذا عُدّل
القالب لاحقًا. هي نفس غريزة \`Invoice.priceSnapshot\`.`,
              }),
              objective: t.String(),
              assessment: t.String(),
              plan: t.String(),
              answers: t.Any({
                description: `{ [blockId]: value } — البنية القابلة للاستعلام، وهي ما تقرأه التقارير`,
              }),
              vitalsRecordId: t.String({
                description: `يُشار إلى القياس ولا يُعاد التقاطه — وحدة العلامات الحيوية تبقى الكاتب الوحيد`,
              }),
              finalizedAt: t.Date(),
              finalizedById: t.String(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "ClinicalNote" },
);

export const ClinicalNoteSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      clinicId: t.Boolean(),
      patientId: t.Boolean(),
      appointmentId: t.Boolean(),
      templateId: t.Boolean(),
      templateKey: t.Boolean(),
      templateVersion: t.Boolean(),
      authorUserId: t.Boolean(),
      status: t.Boolean(),
      subjective: t.Boolean(),
      objective: t.Boolean(),
      assessment: t.Boolean(),
      plan: t.Boolean(),
      answers: t.Boolean(),
      vitalsRecordId: t.Boolean(),
      finalizedAt: t.Boolean(),
      finalizedById: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinic: t.Boolean(),
      patient: t.Boolean(),
      appointment: t.Boolean(),
      template: t.Boolean(),
      author: t.Boolean(),
      finalizedBy: t.Boolean(),
      vitalsRecord: t.Boolean(),
      diagnoses: t.Boolean(),
      addenda: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `ملاحظة سريرية واحدة — مسوَّدة تُكتب بحرّية، ثم تُوثَّق فلا تُعدَّل بعدها أبدًا.`,
    },
  ),
);

export const ClinicalNoteInclude = t.Partial(
  t.Object(
    {
      status: t.Boolean(),
      clinic: t.Boolean(),
      patient: t.Boolean(),
      appointment: t.Boolean(),
      template: t.Boolean(),
      author: t.Boolean(),
      finalizedBy: t.Boolean(),
      vitalsRecord: t.Boolean(),
      diagnoses: t.Boolean(),
      addenda: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `ملاحظة سريرية واحدة — مسوَّدة تُكتب بحرّية، ثم تُوثَّق فلا تُعدَّل بعدها أبدًا.`,
    },
  ),
);

export const ClinicalNoteOrderBy = t.Partial(
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
      appointmentId: t.Union([t.Literal("asc"), t.Literal("desc")], {
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
      authorUserId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      subjective: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      objective: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      assessment: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      plan: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      answers: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      vitalsRecordId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      finalizedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      finalizedById: t.Union([t.Literal("asc"), t.Literal("desc")], {
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
      description: `ملاحظة سريرية واحدة — مسوَّدة تُكتب بحرّية، ثم تُوثَّق فلا تُعدَّل بعدها أبدًا.`,
    },
  ),
);

export const ClinicalNote = t.Composite(
  [ClinicalNotePlain, ClinicalNoteRelations],
  { additionalProperties: false },
);

export const ClinicalNoteInputCreate = t.Composite(
  [ClinicalNotePlainInputCreate, ClinicalNoteRelationsInputCreate],
  { additionalProperties: false },
);

export const ClinicalNoteInputUpdate = t.Composite(
  [ClinicalNotePlainInputUpdate, ClinicalNoteRelationsInputUpdate],
  { additionalProperties: false },
);
