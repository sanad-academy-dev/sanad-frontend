import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const RepostAccountingLedgerPlain = t.Object(
  {
    id: t.String(),
    clinicId: t.String(),
    status: t.Union(
      [
        t.Literal("QUEUED"),
        t.Literal("IN_PROGRESS"),
        t.Literal("COMPLETED"),
        t.Literal("FAILED"),
      ],
      { additionalProperties: false },
    ),
    reason: t.String({
      description: `سبب إعادة الترحيل — يظهر في السجلّ ويُطالَب به لأن إعادة الترحيل حدث استثنائي`,
    }),
    errorMessage: __nullable__(t.String()),
    createdById: __nullable__(t.String()),
    createdAt: t.Date(),
    completedAt: __nullable__(t.Date()),
  },
  {
    additionalProperties: false,
    description: `[P12.9] FR-6.9 — أداة إعادة ترحيل الدفتر: تعكس قيود مستند مُرحَّل ثم تُعيد بناءها.`,
  },
);

export const RepostAccountingLedgerRelations = t.Object(
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
    items: t.Array(
      t.Object(
        {
          id: t.String(),
          repostId: t.String(),
          voucherType: t.String(),
          voucherId: t.String(),
          voucherNo: __nullable__(t.String()),
          status: t.Union(
            [
              t.Literal("QUEUED"),
              t.Literal("IN_PROGRESS"),
              t.Literal("COMPLETED"),
              t.Literal("FAILED"),
            ],
            { additionalProperties: false },
          ),
          errorMessage: __nullable__(t.String()),
          glCountAfter: __nullable__(
            t.Integer({
              description: `عدد قيود الدفتر بعد إعادة البناء — دليل ملموس على أنّ الإعادة فعلت شيئًا`,
            }),
          ),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
  },
  {
    additionalProperties: false,
    description: `[P12.9] FR-6.9 — أداة إعادة ترحيل الدفتر: تعكس قيود مستند مُرحَّل ثم تُعيد بناءها.`,
  },
);

export const RepostAccountingLedgerPlainInputCreate = t.Object(
  {
    status: t.Optional(
      t.Union(
        [
          t.Literal("QUEUED"),
          t.Literal("IN_PROGRESS"),
          t.Literal("COMPLETED"),
          t.Literal("FAILED"),
        ],
        { additionalProperties: false },
      ),
    ),
    reason: t.String({
      description: `سبب إعادة الترحيل — يظهر في السجلّ ويُطالَب به لأن إعادة الترحيل حدث استثنائي`,
    }),
    errorMessage: t.Optional(__nullable__(t.String())),
    completedAt: t.Optional(__nullable__(t.Date())),
  },
  {
    additionalProperties: false,
    description: `[P12.9] FR-6.9 — أداة إعادة ترحيل الدفتر: تعكس قيود مستند مُرحَّل ثم تُعيد بناءها.`,
  },
);

export const RepostAccountingLedgerPlainInputUpdate = t.Object(
  {
    status: t.Optional(
      t.Union(
        [
          t.Literal("QUEUED"),
          t.Literal("IN_PROGRESS"),
          t.Literal("COMPLETED"),
          t.Literal("FAILED"),
        ],
        { additionalProperties: false },
      ),
    ),
    reason: t.Optional(
      t.String({
        description: `سبب إعادة الترحيل — يظهر في السجلّ ويُطالَب به لأن إعادة الترحيل حدث استثنائي`,
      }),
    ),
    errorMessage: t.Optional(__nullable__(t.String())),
    completedAt: t.Optional(__nullable__(t.Date())),
  },
  {
    additionalProperties: false,
    description: `[P12.9] FR-6.9 — أداة إعادة ترحيل الدفتر: تعكس قيود مستند مُرحَّل ثم تُعيد بناءها.`,
  },
);

export const RepostAccountingLedgerRelationsInputCreate = t.Object(
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
    description: `[P12.9] FR-6.9 — أداة إعادة ترحيل الدفتر: تعكس قيود مستند مُرحَّل ثم تُعيد بناءها.`,
  },
);

export const RepostAccountingLedgerRelationsInputUpdate = t.Partial(
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
      description: `[P12.9] FR-6.9 — أداة إعادة ترحيل الدفتر: تعكس قيود مستند مُرحَّل ثم تُعيد بناءها.`,
    },
  ),
);

export const RepostAccountingLedgerWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          clinicId: t.String(),
          status: t.Union(
            [
              t.Literal("QUEUED"),
              t.Literal("IN_PROGRESS"),
              t.Literal("COMPLETED"),
              t.Literal("FAILED"),
            ],
            { additionalProperties: false },
          ),
          reason: t.String({
            description: `سبب إعادة الترحيل — يظهر في السجلّ ويُطالَب به لأن إعادة الترحيل حدث استثنائي`,
          }),
          errorMessage: t.String(),
          createdById: t.String(),
          createdAt: t.Date(),
          completedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `[P12.9] FR-6.9 — أداة إعادة ترحيل الدفتر: تعكس قيود مستند مُرحَّل ثم تُعيد بناءها.`,
        },
      ),
    { $id: "RepostAccountingLedger" },
  ),
);

export const RepostAccountingLedgerWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.String() },
            {
              additionalProperties: false,
              description: `[P12.9] FR-6.9 — أداة إعادة ترحيل الدفتر: تعكس قيود مستند مُرحَّل ثم تُعيد بناءها.`,
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
              status: t.Union(
                [
                  t.Literal("QUEUED"),
                  t.Literal("IN_PROGRESS"),
                  t.Literal("COMPLETED"),
                  t.Literal("FAILED"),
                ],
                { additionalProperties: false },
              ),
              reason: t.String({
                description: `سبب إعادة الترحيل — يظهر في السجلّ ويُطالَب به لأن إعادة الترحيل حدث استثنائي`,
              }),
              errorMessage: t.String(),
              createdById: t.String(),
              createdAt: t.Date(),
              completedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "RepostAccountingLedger" },
);

export const RepostAccountingLedgerSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      clinicId: t.Boolean(),
      status: t.Boolean(),
      reason: t.Boolean(),
      errorMessage: t.Boolean(),
      createdById: t.Boolean(),
      createdAt: t.Boolean(),
      completedAt: t.Boolean(),
      clinic: t.Boolean(),
      items: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `[P12.9] FR-6.9 — أداة إعادة ترحيل الدفتر: تعكس قيود مستند مُرحَّل ثم تُعيد بناءها.`,
    },
  ),
);

export const RepostAccountingLedgerInclude = t.Partial(
  t.Object(
    {
      status: t.Boolean(),
      clinic: t.Boolean(),
      items: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `[P12.9] FR-6.9 — أداة إعادة ترحيل الدفتر: تعكس قيود مستند مُرحَّل ثم تُعيد بناءها.`,
    },
  ),
);

export const RepostAccountingLedgerOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clinicId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      reason: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      errorMessage: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdById: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      completedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    {
      additionalProperties: false,
      description: `[P12.9] FR-6.9 — أداة إعادة ترحيل الدفتر: تعكس قيود مستند مُرحَّل ثم تُعيد بناءها.`,
    },
  ),
);

export const RepostAccountingLedger = t.Composite(
  [RepostAccountingLedgerPlain, RepostAccountingLedgerRelations],
  { additionalProperties: false },
);

export const RepostAccountingLedgerInputCreate = t.Composite(
  [
    RepostAccountingLedgerPlainInputCreate,
    RepostAccountingLedgerRelationsInputCreate,
  ],
  { additionalProperties: false },
);

export const RepostAccountingLedgerInputUpdate = t.Composite(
  [
    RepostAccountingLedgerPlainInputUpdate,
    RepostAccountingLedgerRelationsInputUpdate,
  ],
  { additionalProperties: false },
);
