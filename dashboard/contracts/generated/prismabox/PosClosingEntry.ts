import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const PosClosingEntryPlain = t.Object(
  {
    id: t.String(),
    clinicId: t.String(),
    openingId: t.String(),
    closedAt: t.Date(),
    closedById: __nullable__(t.String()),
    totalDifference: t.Number({
      description: `مجموع الفروق (معدود − متوقَّع) عبر الوسائل؛ موجب = زيادة في الدرج`,
    }),
    journalEntryId: __nullable__(
      t.String({ description: `القيد الذي حمل الفرق، إن وُجد فرق` }),
    ),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  },
  {
    additionalProperties: false,
    description: `إقفال وردية: المتوقَّع مقابل المعدود لكل وسيلة، والفرق يُرحَّل.`,
  },
);

export const PosClosingEntryRelations = t.Object(
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
    opening: t.Object(
      {
        id: t.String(),
        clinicId: t.String(),
        profileId: t.String(),
        cashierUserId: t.String(),
        openedAt: t.Date(),
        status: t.Union([t.Literal("OPEN"), t.Literal("CLOSED")], {
          additionalProperties: false,
        }),
        createdAt: t.Date(),
        updatedAt: t.Date(),
      },
      {
        additionalProperties: false,
        description: `فتح وردية: الكاشير ورصيد الدرج الافتتاحي لكل وسيلة دفع.`,
      },
    ),
    closedBy: __nullable__(
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
    journalEntry: __nullable__(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          documentNo: __nullable__(t.String()),
          docstatus: t.Union(
            [
              t.Literal("DRAFT"),
              t.Literal("SUBMITTED"),
              t.Literal("CANCELLED"),
            ],
            { additionalProperties: false },
          ),
          postingDate: t.Date(),
          amendedFromId: __nullable__(t.String()),
          voucherType: t.String(),
          chequeNo: __nullable__(t.String()),
          chequeDate: __nullable__(t.Date()),
          remark: __nullable__(t.String()),
          multiCurrency: t.Boolean(),
          isSystemGenerated: t.Boolean(),
          totalDebit: t.Number(),
          totalCredit: t.Number(),
          dim1: __nullable__(t.String()),
          dim2: __nullable__(t.String()),
          dim3: __nullable__(t.String()),
          dim4: __nullable__(t.String()),
          createdById: __nullable__(t.String()),
          submittedAt: __nullable__(t.Date()),
          submittedById: __nullable__(t.String()),
          cancelledAt: __nullable__(t.Date()),
          cancelledById: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    ),
    balances: t.Array(
      t.Object(
        {
          id: t.String(),
          closingId: t.String(),
          paymentMethod: t.Union(
            [t.Literal("CASH"), t.Literal("CARD"), t.Literal("TRANSFER")],
            { additionalProperties: false },
          ),
          expectedAmount: t.Number({
            description: `الافتتاحي + مبيعات الوردية بهذه الوسيلة — يحسبه الخادم لا المستخدم`,
          }),
          countedAmount: t.Number({ description: `ما عدّه الكاشير فعلًا` }),
          difference: t.Number(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
  },
  {
    additionalProperties: false,
    description: `إقفال وردية: المتوقَّع مقابل المعدود لكل وسيلة، والفرق يُرحَّل.`,
  },
);

export const PosClosingEntryPlainInputCreate = t.Object(
  {
    closedAt: t.Optional(t.Date()),
    totalDifference: t.Optional(
      t.Number({
        description: `مجموع الفروق (معدود − متوقَّع) عبر الوسائل؛ موجب = زيادة في الدرج`,
      }),
    ),
  },
  {
    additionalProperties: false,
    description: `إقفال وردية: المتوقَّع مقابل المعدود لكل وسيلة، والفرق يُرحَّل.`,
  },
);

export const PosClosingEntryPlainInputUpdate = t.Object(
  {
    closedAt: t.Optional(t.Date()),
    totalDifference: t.Optional(
      t.Number({
        description: `مجموع الفروق (معدود − متوقَّع) عبر الوسائل؛ موجب = زيادة في الدرج`,
      }),
    ),
  },
  {
    additionalProperties: false,
    description: `إقفال وردية: المتوقَّع مقابل المعدود لكل وسيلة، والفرق يُرحَّل.`,
  },
);

export const PosClosingEntryRelationsInputCreate = t.Object(
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
    opening: t.Object(
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
    closedBy: t.Optional(
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
    journalEntry: t.Optional(
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
    balances: t.Optional(
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
    description: `إقفال وردية: المتوقَّع مقابل المعدود لكل وسيلة، والفرق يُرحَّل.`,
  },
);

export const PosClosingEntryRelationsInputUpdate = t.Partial(
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
      opening: t.Object(
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
      closedBy: t.Partial(
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
      journalEntry: t.Partial(
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
      balances: t.Partial(
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
      description: `إقفال وردية: المتوقَّع مقابل المعدود لكل وسيلة، والفرق يُرحَّل.`,
    },
  ),
);

export const PosClosingEntryWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          clinicId: t.String(),
          openingId: t.String(),
          closedAt: t.Date(),
          closedById: t.String(),
          totalDifference: t.Number({
            description: `مجموع الفروق (معدود − متوقَّع) عبر الوسائل؛ موجب = زيادة في الدرج`,
          }),
          journalEntryId: t.String({
            description: `القيد الذي حمل الفرق، إن وُجد فرق`,
          }),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `إقفال وردية: المتوقَّع مقابل المعدود لكل وسيلة، والفرق يُرحَّل.`,
        },
      ),
    { $id: "PosClosingEntry" },
  ),
);

export const PosClosingEntryWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.String(), openingId: t.String() },
            {
              additionalProperties: false,
              description: `إقفال وردية: المتوقَّع مقابل المعدود لكل وسيلة، والفرق يُرحَّل.`,
            },
          ),
          { additionalProperties: false },
        ),
        t.Union(
          [t.Object({ id: t.String() }), t.Object({ openingId: t.String() })],
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
              openingId: t.String(),
              closedAt: t.Date(),
              closedById: t.String(),
              totalDifference: t.Number({
                description: `مجموع الفروق (معدود − متوقَّع) عبر الوسائل؛ موجب = زيادة في الدرج`,
              }),
              journalEntryId: t.String({
                description: `القيد الذي حمل الفرق، إن وُجد فرق`,
              }),
              createdAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "PosClosingEntry" },
);

export const PosClosingEntrySelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      clinicId: t.Boolean(),
      openingId: t.Boolean(),
      closedAt: t.Boolean(),
      closedById: t.Boolean(),
      totalDifference: t.Boolean(),
      journalEntryId: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinic: t.Boolean(),
      opening: t.Boolean(),
      closedBy: t.Boolean(),
      journalEntry: t.Boolean(),
      balances: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `إقفال وردية: المتوقَّع مقابل المعدود لكل وسيلة، والفرق يُرحَّل.`,
    },
  ),
);

export const PosClosingEntryInclude = t.Partial(
  t.Object(
    {
      clinic: t.Boolean(),
      opening: t.Boolean(),
      closedBy: t.Boolean(),
      journalEntry: t.Boolean(),
      balances: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `إقفال وردية: المتوقَّع مقابل المعدود لكل وسيلة، والفرق يُرحَّل.`,
    },
  ),
);

export const PosClosingEntryOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clinicId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      openingId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      closedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      closedById: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      totalDifference: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      journalEntryId: t.Union([t.Literal("asc"), t.Literal("desc")], {
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
      description: `إقفال وردية: المتوقَّع مقابل المعدود لكل وسيلة، والفرق يُرحَّل.`,
    },
  ),
);

export const PosClosingEntry = t.Composite(
  [PosClosingEntryPlain, PosClosingEntryRelations],
  { additionalProperties: false },
);

export const PosClosingEntryInputCreate = t.Composite(
  [PosClosingEntryPlainInputCreate, PosClosingEntryRelationsInputCreate],
  { additionalProperties: false },
);

export const PosClosingEntryInputUpdate = t.Composite(
  [PosClosingEntryPlainInputUpdate, PosClosingEntryRelationsInputUpdate],
  { additionalProperties: false },
);
