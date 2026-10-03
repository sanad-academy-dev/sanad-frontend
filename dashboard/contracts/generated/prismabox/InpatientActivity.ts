import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const InpatientActivityPlain = t.Object(
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
);

export const InpatientActivityRelations = t.Object(
  {
    stay: t.Object(
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
    author: __nullable__(
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
  },
  { additionalProperties: false },
);

export const InpatientActivityPlainInputCreate = t.Object(
  {
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
    body: t.Optional(__nullable__(t.String())),
    metadata: t.Optional(__nullable__(t.Any())),
  },
  { additionalProperties: false },
);

export const InpatientActivityPlainInputUpdate = t.Object(
  {
    type: t.Optional(
      t.Union(
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
    ),
    body: t.Optional(__nullable__(t.String())),
    metadata: t.Optional(__nullable__(t.Any())),
  },
  { additionalProperties: false },
);

export const InpatientActivityRelationsInputCreate = t.Object(
  {
    stay: t.Object(
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
    author: t.Optional(
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

export const InpatientActivityRelationsInputUpdate = t.Partial(
  t.Object(
    {
      stay: t.Object(
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
      author: t.Partial(
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

export const InpatientActivityWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          stayId: t.String(),
          authorUserId: t.String(),
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
          body: t.String(),
          metadata: t.Any(),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "InpatientActivity" },
  ),
);

export const InpatientActivityWhereUnique = t.Recursive(
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
              stayId: t.String(),
              authorUserId: t.String(),
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
              body: t.String(),
              metadata: t.Any(),
              createdAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "InpatientActivity" },
);

export const InpatientActivitySelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      stayId: t.Boolean(),
      authorUserId: t.Boolean(),
      type: t.Boolean(),
      body: t.Boolean(),
      metadata: t.Boolean(),
      createdAt: t.Boolean(),
      stay: t.Boolean(),
      author: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const InpatientActivityInclude = t.Partial(
  t.Object(
    {
      type: t.Boolean(),
      stay: t.Boolean(),
      author: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const InpatientActivityOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      stayId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      authorUserId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      body: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      metadata: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const InpatientActivity = t.Composite(
  [InpatientActivityPlain, InpatientActivityRelations],
  { additionalProperties: false },
);

export const InpatientActivityInputCreate = t.Composite(
  [InpatientActivityPlainInputCreate, InpatientActivityRelationsInputCreate],
  { additionalProperties: false },
);

export const InpatientActivityInputUpdate = t.Composite(
  [InpatientActivityPlainInputUpdate, InpatientActivityRelationsInputUpdate],
  { additionalProperties: false },
);
