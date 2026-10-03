import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const CrmCommentPlain = t.Object(
  {
    id: t.String(),
    clinicId: t.String(),
    referenceType: t.Union([t.Literal("LEAD"), t.Literal("DEAL")], {
      additionalProperties: false,
      description: `*
* §8.1 — one polymorphic pattern for every activity and the status log.`,
    }),
    referenceId: t.String(),
    content: t.String(),
    mentionedUserIds: t.Array(t.String(), { additionalProperties: false }),
    authorUserId: __nullable__(t.String()),
    isDeleted: t.Boolean(),
    deletedAt: __nullable__(t.Date()),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  },
  {
    additionalProperties: false,
    description: `§8.2 — تعليق مع إشارات. المُشار إليهم يُخزَّنون على الصف نفسه (لا جدول وصل): القراءة
دائمًا مع التعليق، والكتابة مرّة واحدة، ولا استعلام ثانٍ في الخيط الزمني.`,
  },
);

export const CrmCommentRelations = t.Object(
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
  {
    additionalProperties: false,
    description: `§8.2 — تعليق مع إشارات. المُشار إليهم يُخزَّنون على الصف نفسه (لا جدول وصل): القراءة
دائمًا مع التعليق، والكتابة مرّة واحدة، ولا استعلام ثانٍ في الخيط الزمني.`,
  },
);

export const CrmCommentPlainInputCreate = t.Object(
  {
    referenceType: t.Union([t.Literal("LEAD"), t.Literal("DEAL")], {
      additionalProperties: false,
      description: `*
* §8.1 — one polymorphic pattern for every activity and the status log.`,
    }),
    content: t.String(),
    mentionedUserIds: t.Optional(
      t.Array(t.String(), { additionalProperties: false }),
    ),
    isDeleted: t.Optional(t.Boolean()),
    deletedAt: t.Optional(__nullable__(t.Date())),
  },
  {
    additionalProperties: false,
    description: `§8.2 — تعليق مع إشارات. المُشار إليهم يُخزَّنون على الصف نفسه (لا جدول وصل): القراءة
دائمًا مع التعليق، والكتابة مرّة واحدة، ولا استعلام ثانٍ في الخيط الزمني.`,
  },
);

export const CrmCommentPlainInputUpdate = t.Object(
  {
    referenceType: t.Optional(
      t.Union([t.Literal("LEAD"), t.Literal("DEAL")], {
        additionalProperties: false,
        description: `*
* §8.1 — one polymorphic pattern for every activity and the status log.`,
      }),
    ),
    content: t.Optional(t.String()),
    mentionedUserIds: t.Optional(
      t.Array(t.String(), { additionalProperties: false }),
    ),
    isDeleted: t.Optional(t.Boolean()),
    deletedAt: t.Optional(__nullable__(t.Date())),
  },
  {
    additionalProperties: false,
    description: `§8.2 — تعليق مع إشارات. المُشار إليهم يُخزَّنون على الصف نفسه (لا جدول وصل): القراءة
دائمًا مع التعليق، والكتابة مرّة واحدة، ولا استعلام ثانٍ في الخيط الزمني.`,
  },
);

export const CrmCommentRelationsInputCreate = t.Object(
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
  {
    additionalProperties: false,
    description: `§8.2 — تعليق مع إشارات. المُشار إليهم يُخزَّنون على الصف نفسه (لا جدول وصل): القراءة
دائمًا مع التعليق، والكتابة مرّة واحدة، ولا استعلام ثانٍ في الخيط الزمني.`,
  },
);

export const CrmCommentRelationsInputUpdate = t.Partial(
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
    {
      additionalProperties: false,
      description: `§8.2 — تعليق مع إشارات. المُشار إليهم يُخزَّنون على الصف نفسه (لا جدول وصل): القراءة
دائمًا مع التعليق، والكتابة مرّة واحدة، ولا استعلام ثانٍ في الخيط الزمني.`,
    },
  ),
);

export const CrmCommentWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          clinicId: t.String(),
          referenceType: t.Union([t.Literal("LEAD"), t.Literal("DEAL")], {
            additionalProperties: false,
            description: `*
* §8.1 — one polymorphic pattern for every activity and the status log.`,
          }),
          referenceId: t.String(),
          content: t.String(),
          mentionedUserIds: t.Array(t.String(), {
            additionalProperties: false,
          }),
          authorUserId: t.String(),
          isDeleted: t.Boolean(),
          deletedAt: t.Date(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `§8.2 — تعليق مع إشارات. المُشار إليهم يُخزَّنون على الصف نفسه (لا جدول وصل): القراءة
دائمًا مع التعليق، والكتابة مرّة واحدة، ولا استعلام ثانٍ في الخيط الزمني.`,
        },
      ),
    { $id: "CrmComment" },
  ),
);

export const CrmCommentWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.String() },
            {
              additionalProperties: false,
              description: `§8.2 — تعليق مع إشارات. المُشار إليهم يُخزَّنون على الصف نفسه (لا جدول وصل): القراءة
دائمًا مع التعليق، والكتابة مرّة واحدة، ولا استعلام ثانٍ في الخيط الزمني.`,
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
              referenceType: t.Union([t.Literal("LEAD"), t.Literal("DEAL")], {
                additionalProperties: false,
                description: `*
* §8.1 — one polymorphic pattern for every activity and the status log.`,
              }),
              referenceId: t.String(),
              content: t.String(),
              mentionedUserIds: t.Array(t.String(), {
                additionalProperties: false,
              }),
              authorUserId: t.String(),
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
  { $id: "CrmComment" },
);

export const CrmCommentSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      clinicId: t.Boolean(),
      referenceType: t.Boolean(),
      referenceId: t.Boolean(),
      content: t.Boolean(),
      mentionedUserIds: t.Boolean(),
      authorUserId: t.Boolean(),
      isDeleted: t.Boolean(),
      deletedAt: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinic: t.Boolean(),
      author: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `§8.2 — تعليق مع إشارات. المُشار إليهم يُخزَّنون على الصف نفسه (لا جدول وصل): القراءة
دائمًا مع التعليق، والكتابة مرّة واحدة، ولا استعلام ثانٍ في الخيط الزمني.`,
    },
  ),
);

export const CrmCommentInclude = t.Partial(
  t.Object(
    {
      referenceType: t.Boolean(),
      clinic: t.Boolean(),
      author: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `§8.2 — تعليق مع إشارات. المُشار إليهم يُخزَّنون على الصف نفسه (لا جدول وصل): القراءة
دائمًا مع التعليق، والكتابة مرّة واحدة، ولا استعلام ثانٍ في الخيط الزمني.`,
    },
  ),
);

export const CrmCommentOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clinicId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      referenceId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      content: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      mentionedUserIds: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      authorUserId: t.Union([t.Literal("asc"), t.Literal("desc")], {
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
      description: `§8.2 — تعليق مع إشارات. المُشار إليهم يُخزَّنون على الصف نفسه (لا جدول وصل): القراءة
دائمًا مع التعليق، والكتابة مرّة واحدة، ولا استعلام ثانٍ في الخيط الزمني.`,
    },
  ),
);

export const CrmComment = t.Composite([CrmCommentPlain, CrmCommentRelations], {
  additionalProperties: false,
});

export const CrmCommentInputCreate = t.Composite(
  [CrmCommentPlainInputCreate, CrmCommentRelationsInputCreate],
  { additionalProperties: false },
);

export const CrmCommentInputUpdate = t.Composite(
  [CrmCommentPlainInputUpdate, CrmCommentRelationsInputUpdate],
  { additionalProperties: false },
);
