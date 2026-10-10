import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const PrescriptionPlain = t.Object(
  {
    id: t.String(),
    code: t.String(),
    clinicId: t.String(),
    patientId: t.String(),
    appointmentId: __nullable__(t.String()),
    inpatientStayId: __nullable__(
      t.String({
        description: `[IP3] وُصفت من داخل إقامة تنويم: تُصرف بلا سداد وتُحاسَب على فاتورة الإقامة،
وصرفُها هو ما يُنشئ أمر ورقة العلاج. عمود قياسيّ بلا علاقة Prisma عن قصد —
نفس سبب \`LabTestOrder.inpatientStayId\`.`,
      }),
    ),
    prescriberId: __nullable__(t.String()),
    status: t.Union(
      [
        t.Literal("DRAFT"),
        t.Literal("ACTIVE"),
        t.Literal("COMPLETED"),
        t.Literal("CANCELLED"),
      ],
      { additionalProperties: false },
    ),
    weightKgSnapshot: __nullable__(
      t.Number({
        description: `لقطة الوزن التي حُسبت عليها الجرعات، مع وقت قياسه. الوزن يتغيّر، والوصفة
المطبوعة لا؛ فبدون اللقطة تصير مراجعة جرعة قديمة مستحيلة. المصدر
\`VitalSignsRecord\` وحده — لا \`Patient.weight\` (§5.2).`,
      }),
    ),
    weightRecordedAt: __nullable__(t.Date()),
    notesAr: __nullable__(t.String()),
    issuedAt: __nullable__(t.Date()),
    cancelledAt: __nullable__(t.Date()),
    cancelReasonAr: __nullable__(t.String()),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  },
  {
    additionalProperties: false,
    description: `[PH1] وصفة طبية — BRD_Pharmacy_Module.md §4.`,
  },
);

export const PrescriptionRelations = t.Object(
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
    prescriber: __nullable__(
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
          prescriptionId: t.String(),
          idx: t.Integer(),
          inventoryItemId: __nullable__(
            t.String({
              description: `أحد ثلاثة يُحلّ: صنف مخزون، أو مستحضر مسجَّل بلا مخزون، أو نصّ حرّ. نفس
تسامح \`appointment_product\` مع الصنف الحرّ — الطبيب قد يصف ما لا تبيعه العيادة.`,
            }),
          ),
          catalogProductId: __nullable__(t.String()),
          nameSnapshot: t.String(),
          doseAmount: __nullable__(t.Number()),
          doseUnit: __nullable__(t.String()),
          route: __nullable__(t.String()),
          frequency: __nullable__(t.String()),
          durationDays: __nullable__(t.Integer()),
          quantity: t.Number({
            description: `ما يستهلكه الصرف والفوترة (BR-P4.2.1)`,
          }),
          quantityUnit: t.String(),
          prn: t.Boolean(),
          instructionsAr: t.String(),
          refillsAllowed: t.Integer(),
          refillsUsed: t.Integer(),
          doseSource: t.Union(
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
          overrideReasonAr: __nullable__(
            t.String({
              description: `سبب تجاوز المدى الموثّق — إلزامي عند \`doseSource = OVERRIDE\` (BR-P6.2).
التجاوز مسموح، والصمت عنه ليس كذلك.`,
            }),
          ),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `[PH1] بند وصفة — BRD §4.2.`,
        },
      ),
      { additionalProperties: false },
    ),
  },
  {
    additionalProperties: false,
    description: `[PH1] وصفة طبية — BRD_Pharmacy_Module.md §4.`,
  },
);

export const PrescriptionPlainInputCreate = t.Object(
  {
    code: t.String(),
    status: t.Optional(
      t.Union(
        [
          t.Literal("DRAFT"),
          t.Literal("ACTIVE"),
          t.Literal("COMPLETED"),
          t.Literal("CANCELLED"),
        ],
        { additionalProperties: false },
      ),
    ),
    weightKgSnapshot: t.Optional(
      __nullable__(
        t.Number({
          description: `لقطة الوزن التي حُسبت عليها الجرعات، مع وقت قياسه. الوزن يتغيّر، والوصفة
المطبوعة لا؛ فبدون اللقطة تصير مراجعة جرعة قديمة مستحيلة. المصدر
\`VitalSignsRecord\` وحده — لا \`Patient.weight\` (§5.2).`,
        }),
      ),
    ),
    weightRecordedAt: t.Optional(__nullable__(t.Date())),
    notesAr: t.Optional(__nullable__(t.String())),
    issuedAt: t.Optional(__nullable__(t.Date())),
    cancelledAt: t.Optional(__nullable__(t.Date())),
    cancelReasonAr: t.Optional(__nullable__(t.String())),
  },
  {
    additionalProperties: false,
    description: `[PH1] وصفة طبية — BRD_Pharmacy_Module.md §4.`,
  },
);

export const PrescriptionPlainInputUpdate = t.Object(
  {
    code: t.Optional(t.String()),
    status: t.Optional(
      t.Union(
        [
          t.Literal("DRAFT"),
          t.Literal("ACTIVE"),
          t.Literal("COMPLETED"),
          t.Literal("CANCELLED"),
        ],
        { additionalProperties: false },
      ),
    ),
    weightKgSnapshot: t.Optional(
      __nullable__(
        t.Number({
          description: `لقطة الوزن التي حُسبت عليها الجرعات، مع وقت قياسه. الوزن يتغيّر، والوصفة
المطبوعة لا؛ فبدون اللقطة تصير مراجعة جرعة قديمة مستحيلة. المصدر
\`VitalSignsRecord\` وحده — لا \`Patient.weight\` (§5.2).`,
        }),
      ),
    ),
    weightRecordedAt: t.Optional(__nullable__(t.Date())),
    notesAr: t.Optional(__nullable__(t.String())),
    issuedAt: t.Optional(__nullable__(t.Date())),
    cancelledAt: t.Optional(__nullable__(t.Date())),
    cancelReasonAr: t.Optional(__nullable__(t.String())),
  },
  {
    additionalProperties: false,
    description: `[PH1] وصفة طبية — BRD_Pharmacy_Module.md §4.`,
  },
);

export const PrescriptionRelationsInputCreate = t.Object(
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
              id: t.String({ additionalProperties: false }),
            },
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
    ),
    prescriber: t.Optional(
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
  },
  {
    additionalProperties: false,
    description: `[PH1] وصفة طبية — BRD_Pharmacy_Module.md §4.`,
  },
);

export const PrescriptionRelationsInputUpdate = t.Partial(
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
                id: t.String({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
            disconnect: t.Boolean(),
          },
          { additionalProperties: false },
        ),
      ),
      prescriber: t.Partial(
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
    },
    {
      additionalProperties: false,
      description: `[PH1] وصفة طبية — BRD_Pharmacy_Module.md §4.`,
    },
  ),
);

export const PrescriptionWhere = t.Partial(
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
          patientId: t.String(),
          appointmentId: t.String(),
          inpatientStayId: t.String({
            description: `[IP3] وُصفت من داخل إقامة تنويم: تُصرف بلا سداد وتُحاسَب على فاتورة الإقامة،
وصرفُها هو ما يُنشئ أمر ورقة العلاج. عمود قياسيّ بلا علاقة Prisma عن قصد —
نفس سبب \`LabTestOrder.inpatientStayId\`.`,
          }),
          prescriberId: t.String(),
          status: t.Union(
            [
              t.Literal("DRAFT"),
              t.Literal("ACTIVE"),
              t.Literal("COMPLETED"),
              t.Literal("CANCELLED"),
            ],
            { additionalProperties: false },
          ),
          weightKgSnapshot: t.Number({
            description: `لقطة الوزن التي حُسبت عليها الجرعات، مع وقت قياسه. الوزن يتغيّر، والوصفة
المطبوعة لا؛ فبدون اللقطة تصير مراجعة جرعة قديمة مستحيلة. المصدر
\`VitalSignsRecord\` وحده — لا \`Patient.weight\` (§5.2).`,
          }),
          weightRecordedAt: t.Date(),
          notesAr: t.String(),
          issuedAt: t.Date(),
          cancelledAt: t.Date(),
          cancelReasonAr: t.String(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `[PH1] وصفة طبية — BRD_Pharmacy_Module.md §4.`,
        },
      ),
    { $id: "Prescription" },
  ),
);

export const PrescriptionWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.String(), code: t.String() },
            {
              additionalProperties: false,
              description: `[PH1] وصفة طبية — BRD_Pharmacy_Module.md §4.`,
            },
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
              patientId: t.String(),
              appointmentId: t.String(),
              inpatientStayId: t.String({
                description: `[IP3] وُصفت من داخل إقامة تنويم: تُصرف بلا سداد وتُحاسَب على فاتورة الإقامة،
وصرفُها هو ما يُنشئ أمر ورقة العلاج. عمود قياسيّ بلا علاقة Prisma عن قصد —
نفس سبب \`LabTestOrder.inpatientStayId\`.`,
              }),
              prescriberId: t.String(),
              status: t.Union(
                [
                  t.Literal("DRAFT"),
                  t.Literal("ACTIVE"),
                  t.Literal("COMPLETED"),
                  t.Literal("CANCELLED"),
                ],
                { additionalProperties: false },
              ),
              weightKgSnapshot: t.Number({
                description: `لقطة الوزن التي حُسبت عليها الجرعات، مع وقت قياسه. الوزن يتغيّر، والوصفة
المطبوعة لا؛ فبدون اللقطة تصير مراجعة جرعة قديمة مستحيلة. المصدر
\`VitalSignsRecord\` وحده — لا \`Patient.weight\` (§5.2).`,
              }),
              weightRecordedAt: t.Date(),
              notesAr: t.String(),
              issuedAt: t.Date(),
              cancelledAt: t.Date(),
              cancelReasonAr: t.String(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "Prescription" },
);

export const PrescriptionSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      code: t.Boolean(),
      clinicId: t.Boolean(),
      patientId: t.Boolean(),
      appointmentId: t.Boolean(),
      inpatientStayId: t.Boolean(),
      prescriberId: t.Boolean(),
      status: t.Boolean(),
      weightKgSnapshot: t.Boolean(),
      weightRecordedAt: t.Boolean(),
      notesAr: t.Boolean(),
      issuedAt: t.Boolean(),
      cancelledAt: t.Boolean(),
      cancelReasonAr: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinic: t.Boolean(),
      patient: t.Boolean(),
      appointment: t.Boolean(),
      prescriber: t.Boolean(),
      items: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `[PH1] وصفة طبية — BRD_Pharmacy_Module.md §4.`,
    },
  ),
);

export const PrescriptionInclude = t.Partial(
  t.Object(
    {
      status: t.Boolean(),
      clinic: t.Boolean(),
      patient: t.Boolean(),
      appointment: t.Boolean(),
      prescriber: t.Boolean(),
      items: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `[PH1] وصفة طبية — BRD_Pharmacy_Module.md §4.`,
    },
  ),
);

export const PrescriptionOrderBy = t.Partial(
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
      patientId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      appointmentId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      inpatientStayId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      prescriberId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      weightKgSnapshot: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      weightRecordedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      notesAr: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      issuedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      cancelledAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      cancelReasonAr: t.Union([t.Literal("asc"), t.Literal("desc")], {
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
      description: `[PH1] وصفة طبية — BRD_Pharmacy_Module.md §4.`,
    },
  ),
);

export const Prescription = t.Composite(
  [PrescriptionPlain, PrescriptionRelations],
  { additionalProperties: false },
);

export const PrescriptionInputCreate = t.Composite(
  [PrescriptionPlainInputCreate, PrescriptionRelationsInputCreate],
  { additionalProperties: false },
);

export const PrescriptionInputUpdate = t.Composite(
  [PrescriptionPlainInputUpdate, PrescriptionRelationsInputUpdate],
  { additionalProperties: false },
);
