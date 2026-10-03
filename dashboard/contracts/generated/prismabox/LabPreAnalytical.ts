import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const LabPreAnalyticalPlain = t.Object(
  {
    id: t.String(),
    orderId: t.String(),
    fastingStatus: __nullable__(
      t.Union(
        [t.Literal("FASTED"), t.Literal("PARTIAL"), t.Literal("NOT_FASTED")],
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
);

export const LabPreAnalyticalRelations = t.Object(
  {
    order: t.Object(
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
  },
  { additionalProperties: false },
);

export const LabPreAnalyticalPlainInputCreate = t.Object(
  {
    fastingStatus: t.Optional(
      __nullable__(
        t.Union(
          [t.Literal("FASTED"), t.Literal("PARTIAL"), t.Literal("NOT_FASTED")],
          { additionalProperties: false },
        ),
      ),
    ),
    fastingHours: t.Optional(__nullable__(t.Integer())),
    medications: t.Array(t.String(), { additionalProperties: false }),
    ivFluids24h: t.Optional(__nullable__(t.Boolean())),
    weight: t.Optional(__nullable__(t.Number())),
    temperature: t.Optional(__nullable__(t.Number())),
    heartRate: t.Optional(__nullable__(t.Integer())),
    respiratoryRate: t.Optional(__nullable__(t.Integer())),
  },
  { additionalProperties: false },
);

export const LabPreAnalyticalPlainInputUpdate = t.Object(
  {
    fastingStatus: t.Optional(
      __nullable__(
        t.Union(
          [t.Literal("FASTED"), t.Literal("PARTIAL"), t.Literal("NOT_FASTED")],
          { additionalProperties: false },
        ),
      ),
    ),
    fastingHours: t.Optional(__nullable__(t.Integer())),
    medications: t.Optional(
      t.Array(t.String(), { additionalProperties: false }),
    ),
    ivFluids24h: t.Optional(__nullable__(t.Boolean())),
    weight: t.Optional(__nullable__(t.Number())),
    temperature: t.Optional(__nullable__(t.Number())),
    heartRate: t.Optional(__nullable__(t.Integer())),
    respiratoryRate: t.Optional(__nullable__(t.Integer())),
  },
  { additionalProperties: false },
);

export const LabPreAnalyticalRelationsInputCreate = t.Object(
  {
    order: t.Object(
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
  },
  { additionalProperties: false },
);

export const LabPreAnalyticalRelationsInputUpdate = t.Partial(
  t.Object(
    {
      order: t.Object(
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
    },
    { additionalProperties: false },
  ),
);

export const LabPreAnalyticalWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          orderId: t.String(),
          fastingStatus: t.Union(
            [
              t.Literal("FASTED"),
              t.Literal("PARTIAL"),
              t.Literal("NOT_FASTED"),
            ],
            { additionalProperties: false },
          ),
          fastingHours: t.Integer(),
          medications: t.Array(t.String(), { additionalProperties: false }),
          ivFluids24h: t.Boolean(),
          vitalsRecordId: t.String(),
          weight: t.Number(),
          temperature: t.Number(),
          heartRate: t.Integer(),
          respiratoryRate: t.Integer(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "LabPreAnalytical" },
  ),
);

export const LabPreAnalyticalWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.String(), orderId: t.String() },
            { additionalProperties: false },
          ),
          { additionalProperties: false },
        ),
        t.Union(
          [t.Object({ id: t.String() }), t.Object({ orderId: t.String() })],
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
              orderId: t.String(),
              fastingStatus: t.Union(
                [
                  t.Literal("FASTED"),
                  t.Literal("PARTIAL"),
                  t.Literal("NOT_FASTED"),
                ],
                { additionalProperties: false },
              ),
              fastingHours: t.Integer(),
              medications: t.Array(t.String(), { additionalProperties: false }),
              ivFluids24h: t.Boolean(),
              vitalsRecordId: t.String(),
              weight: t.Number(),
              temperature: t.Number(),
              heartRate: t.Integer(),
              respiratoryRate: t.Integer(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "LabPreAnalytical" },
);

export const LabPreAnalyticalSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      orderId: t.Boolean(),
      fastingStatus: t.Boolean(),
      fastingHours: t.Boolean(),
      medications: t.Boolean(),
      ivFluids24h: t.Boolean(),
      vitalsRecordId: t.Boolean(),
      weight: t.Boolean(),
      temperature: t.Boolean(),
      heartRate: t.Boolean(),
      respiratoryRate: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      order: t.Boolean(),
      vitalsRecord: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const LabPreAnalyticalInclude = t.Partial(
  t.Object(
    {
      fastingStatus: t.Boolean(),
      order: t.Boolean(),
      vitalsRecord: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const LabPreAnalyticalOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      orderId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      fastingHours: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      medications: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      ivFluids24h: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      vitalsRecordId: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const LabPreAnalytical = t.Composite(
  [LabPreAnalyticalPlain, LabPreAnalyticalRelations],
  { additionalProperties: false },
);

export const LabPreAnalyticalInputCreate = t.Composite(
  [LabPreAnalyticalPlainInputCreate, LabPreAnalyticalRelationsInputCreate],
  { additionalProperties: false },
);

export const LabPreAnalyticalInputUpdate = t.Composite(
  [LabPreAnalyticalPlainInputUpdate, LabPreAnalyticalRelationsInputUpdate],
  { additionalProperties: false },
);
