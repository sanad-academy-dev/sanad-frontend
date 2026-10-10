import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const LabTestActivityPlain = t.Object(
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
);

export const LabTestActivityRelations = t.Object(
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

export const LabTestActivityPlainInputCreate = t.Object(
  {
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
    detail: t.Optional(__nullable__(t.String())),
  },
  { additionalProperties: false },
);

export const LabTestActivityPlainInputUpdate = t.Object(
  {
    type: t.Optional(
      t.Union(
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
    ),
    detail: t.Optional(__nullable__(t.String())),
  },
  { additionalProperties: false },
);

export const LabTestActivityRelationsInputCreate = t.Object(
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

export const LabTestActivityRelationsInputUpdate = t.Partial(
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

export const LabTestActivityWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          orderId: t.String(),
          itemId: t.String(),
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
          detail: t.String(),
          authorUserId: t.String(),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "LabTestActivity" },
  ),
);

export const LabTestActivityWhereUnique = t.Recursive(
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
              orderId: t.String(),
              itemId: t.String(),
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
              detail: t.String(),
              authorUserId: t.String(),
              createdAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "LabTestActivity" },
);

export const LabTestActivitySelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      orderId: t.Boolean(),
      itemId: t.Boolean(),
      type: t.Boolean(),
      detail: t.Boolean(),
      authorUserId: t.Boolean(),
      createdAt: t.Boolean(),
      order: t.Boolean(),
      author: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const LabTestActivityInclude = t.Partial(
  t.Object(
    {
      type: t.Boolean(),
      order: t.Boolean(),
      author: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const LabTestActivityOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      orderId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      itemId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      detail: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      authorUserId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const LabTestActivity = t.Composite(
  [LabTestActivityPlain, LabTestActivityRelations],
  { additionalProperties: false },
);

export const LabTestActivityInputCreate = t.Composite(
  [LabTestActivityPlainInputCreate, LabTestActivityRelationsInputCreate],
  { additionalProperties: false },
);

export const LabTestActivityInputUpdate = t.Composite(
  [LabTestActivityPlainInputUpdate, LabTestActivityRelationsInputUpdate],
  { additionalProperties: false },
);
