import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const RadiologyCommentPlain = t.Object(
  {
    id: t.String(),
    orderId: t.String(),
    authorUserId: t.String(),
    body: t.String(),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  },
  {
    additionalProperties: false,
    description: `تعليق على طلب أشعة — نقاش الفريق حول الطلب، كتعليقات التحاليل`,
  },
);

export const RadiologyCommentRelations = t.Object(
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
    mentions: t.Array(
      t.Object(
        {
          id: t.String(),
          commentId: t.String(),
          staffId: t.String(),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
  },
  {
    additionalProperties: false,
    description: `تعليق على طلب أشعة — نقاش الفريق حول الطلب، كتعليقات التحاليل`,
  },
);

export const RadiologyCommentPlainInputCreate = t.Object(
  { body: t.String() },
  {
    additionalProperties: false,
    description: `تعليق على طلب أشعة — نقاش الفريق حول الطلب، كتعليقات التحاليل`,
  },
);

export const RadiologyCommentPlainInputUpdate = t.Object(
  { body: t.Optional(t.String()) },
  {
    additionalProperties: false,
    description: `تعليق على طلب أشعة — نقاش الفريق حول الطلب، كتعليقات التحاليل`,
  },
);

export const RadiologyCommentRelationsInputCreate = t.Object(
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
    mentions: t.Optional(
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
    description: `تعليق على طلب أشعة — نقاش الفريق حول الطلب، كتعليقات التحاليل`,
  },
);

export const RadiologyCommentRelationsInputUpdate = t.Partial(
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
      mentions: t.Partial(
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
      description: `تعليق على طلب أشعة — نقاش الفريق حول الطلب، كتعليقات التحاليل`,
    },
  ),
);

export const RadiologyCommentWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          orderId: t.String(),
          authorUserId: t.String(),
          body: t.String(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `تعليق على طلب أشعة — نقاش الفريق حول الطلب، كتعليقات التحاليل`,
        },
      ),
    { $id: "RadiologyComment" },
  ),
);

export const RadiologyCommentWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.String() },
            {
              additionalProperties: false,
              description: `تعليق على طلب أشعة — نقاش الفريق حول الطلب، كتعليقات التحاليل`,
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
              orderId: t.String(),
              authorUserId: t.String(),
              body: t.String(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "RadiologyComment" },
);

export const RadiologyCommentSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      orderId: t.Boolean(),
      authorUserId: t.Boolean(),
      body: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      order: t.Boolean(),
      author: t.Boolean(),
      mentions: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `تعليق على طلب أشعة — نقاش الفريق حول الطلب، كتعليقات التحاليل`,
    },
  ),
);

export const RadiologyCommentInclude = t.Partial(
  t.Object(
    {
      order: t.Boolean(),
      author: t.Boolean(),
      mentions: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `تعليق على طلب أشعة — نقاش الفريق حول الطلب، كتعليقات التحاليل`,
    },
  ),
);

export const RadiologyCommentOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      orderId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      authorUserId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      body: t.Union([t.Literal("asc"), t.Literal("desc")], {
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
      description: `تعليق على طلب أشعة — نقاش الفريق حول الطلب، كتعليقات التحاليل`,
    },
  ),
);

export const RadiologyComment = t.Composite(
  [RadiologyCommentPlain, RadiologyCommentRelations],
  { additionalProperties: false },
);

export const RadiologyCommentInputCreate = t.Composite(
  [RadiologyCommentPlainInputCreate, RadiologyCommentRelationsInputCreate],
  { additionalProperties: false },
);

export const RadiologyCommentInputUpdate = t.Composite(
  [RadiologyCommentPlainInputUpdate, RadiologyCommentRelationsInputUpdate],
  { additionalProperties: false },
);
