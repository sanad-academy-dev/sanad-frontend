import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const DunningPlain = t.Object(
  {
    id: t.String(),
    clinicId: t.String(),
    typeId: __nullable__(t.String()),
    partyType: t.String(),
    partyId: t.String(),
    postingDate: t.Date(),
    status: t.Union(
      [
        t.Literal("DRAFT"),
        t.Literal("UNRESOLVED"),
        t.Literal("RESOLVED"),
        t.Literal("CANCELLED"),
      ],
      { additionalProperties: false },
    ),
    rateOfInterest: t.Number(),
    dunningFee: t.Number(),
    totalOutstanding: t.Number({
      description: `مجموع أصل المتأخّرات وقت الإصدار — لقطة، لا يُعاد حسابها`,
    }),
    totalInterest: t.Number(),
    dunningAmount: t.Number({
      description: `الفائدة + الرسم = ما تطالب به المطالبة زيادةً على الأصل`,
    }),
    journalEntryId: __nullable__(
      t.String({
        description: `قيد الفائدة والرسم المُرحَّل عند اعتماد المطالبة — منه تُحصَّل عبر سند قبض عادي`,
      }),
    ),
    createdById: __nullable__(t.String()),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  },
  {
    additionalProperties: false,
    description: `مطالبة على طرف: تجمع فواتيره المتأخّرة وتضيف الفائدة والرسم.`,
  },
);

export const DunningRelations = t.Object(
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
    type: __nullable__(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          title: t.String(),
          rateOfInterest: t.Number(),
          dunningFee: t.Number(),
          letterBody: __nullable__(t.String()),
          incomeAccountId: __nullable__(
            t.String({
              description: `حساب الإيراد الذي يستقبل الرسوم والفائدة عند التحصيل`,
            }),
          ),
          disabled: t.Boolean(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `نوع مطالبة: الرسوم والفائدة الافتراضية ونصّ الخطاب. النصّ عربي فقط اليوم (قاعدة 5).`,
        },
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
    overdues: t.Array(
      t.Object(
        {
          id: t.String(),
          dunningId: t.String(),
          salesInvoiceId: t.String(),
          invoiceNo: t.String(),
          dueDate: t.Date(),
          overdueDays: t.Integer(),
          outstanding: t.Number(),
          interest: t.Number(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
  },
  {
    additionalProperties: false,
    description: `مطالبة على طرف: تجمع فواتيره المتأخّرة وتضيف الفائدة والرسم.`,
  },
);

export const DunningPlainInputCreate = t.Object(
  {
    partyType: t.String(),
    postingDate: t.Date(),
    status: t.Optional(
      t.Union(
        [
          t.Literal("DRAFT"),
          t.Literal("UNRESOLVED"),
          t.Literal("RESOLVED"),
          t.Literal("CANCELLED"),
        ],
        { additionalProperties: false },
      ),
    ),
    rateOfInterest: t.Optional(t.Number()),
    dunningFee: t.Optional(t.Number()),
    totalOutstanding: t.Optional(
      t.Number({
        description: `مجموع أصل المتأخّرات وقت الإصدار — لقطة، لا يُعاد حسابها`,
      }),
    ),
    totalInterest: t.Optional(t.Number()),
    dunningAmount: t.Optional(
      t.Number({
        description: `الفائدة + الرسم = ما تطالب به المطالبة زيادةً على الأصل`,
      }),
    ),
  },
  {
    additionalProperties: false,
    description: `مطالبة على طرف: تجمع فواتيره المتأخّرة وتضيف الفائدة والرسم.`,
  },
);

export const DunningPlainInputUpdate = t.Object(
  {
    partyType: t.Optional(t.String()),
    postingDate: t.Optional(t.Date()),
    status: t.Optional(
      t.Union(
        [
          t.Literal("DRAFT"),
          t.Literal("UNRESOLVED"),
          t.Literal("RESOLVED"),
          t.Literal("CANCELLED"),
        ],
        { additionalProperties: false },
      ),
    ),
    rateOfInterest: t.Optional(t.Number()),
    dunningFee: t.Optional(t.Number()),
    totalOutstanding: t.Optional(
      t.Number({
        description: `مجموع أصل المتأخّرات وقت الإصدار — لقطة، لا يُعاد حسابها`,
      }),
    ),
    totalInterest: t.Optional(t.Number()),
    dunningAmount: t.Optional(
      t.Number({
        description: `الفائدة + الرسم = ما تطالب به المطالبة زيادةً على الأصل`,
      }),
    ),
  },
  {
    additionalProperties: false,
    description: `مطالبة على طرف: تجمع فواتيره المتأخّرة وتضيف الفائدة والرسم.`,
  },
);

export const DunningRelationsInputCreate = t.Object(
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
    type: t.Optional(
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
    overdues: t.Optional(
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
    description: `مطالبة على طرف: تجمع فواتيره المتأخّرة وتضيف الفائدة والرسم.`,
  },
);

export const DunningRelationsInputUpdate = t.Partial(
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
      type: t.Partial(
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
      overdues: t.Partial(
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
      description: `مطالبة على طرف: تجمع فواتيره المتأخّرة وتضيف الفائدة والرسم.`,
    },
  ),
);

export const DunningWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          clinicId: t.String(),
          typeId: t.String(),
          partyType: t.String(),
          partyId: t.String(),
          postingDate: t.Date(),
          status: t.Union(
            [
              t.Literal("DRAFT"),
              t.Literal("UNRESOLVED"),
              t.Literal("RESOLVED"),
              t.Literal("CANCELLED"),
            ],
            { additionalProperties: false },
          ),
          rateOfInterest: t.Number(),
          dunningFee: t.Number(),
          totalOutstanding: t.Number({
            description: `مجموع أصل المتأخّرات وقت الإصدار — لقطة، لا يُعاد حسابها`,
          }),
          totalInterest: t.Number(),
          dunningAmount: t.Number({
            description: `الفائدة + الرسم = ما تطالب به المطالبة زيادةً على الأصل`,
          }),
          journalEntryId: t.String({
            description: `قيد الفائدة والرسم المُرحَّل عند اعتماد المطالبة — منه تُحصَّل عبر سند قبض عادي`,
          }),
          createdById: t.String(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `مطالبة على طرف: تجمع فواتيره المتأخّرة وتضيف الفائدة والرسم.`,
        },
      ),
    { $id: "Dunning" },
  ),
);

export const DunningWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.String() },
            {
              additionalProperties: false,
              description: `مطالبة على طرف: تجمع فواتيره المتأخّرة وتضيف الفائدة والرسم.`,
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
              typeId: t.String(),
              partyType: t.String(),
              partyId: t.String(),
              postingDate: t.Date(),
              status: t.Union(
                [
                  t.Literal("DRAFT"),
                  t.Literal("UNRESOLVED"),
                  t.Literal("RESOLVED"),
                  t.Literal("CANCELLED"),
                ],
                { additionalProperties: false },
              ),
              rateOfInterest: t.Number(),
              dunningFee: t.Number(),
              totalOutstanding: t.Number({
                description: `مجموع أصل المتأخّرات وقت الإصدار — لقطة، لا يُعاد حسابها`,
              }),
              totalInterest: t.Number(),
              dunningAmount: t.Number({
                description: `الفائدة + الرسم = ما تطالب به المطالبة زيادةً على الأصل`,
              }),
              journalEntryId: t.String({
                description: `قيد الفائدة والرسم المُرحَّل عند اعتماد المطالبة — منه تُحصَّل عبر سند قبض عادي`,
              }),
              createdById: t.String(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "Dunning" },
);

export const DunningSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      clinicId: t.Boolean(),
      typeId: t.Boolean(),
      partyType: t.Boolean(),
      partyId: t.Boolean(),
      postingDate: t.Boolean(),
      status: t.Boolean(),
      rateOfInterest: t.Boolean(),
      dunningFee: t.Boolean(),
      totalOutstanding: t.Boolean(),
      totalInterest: t.Boolean(),
      dunningAmount: t.Boolean(),
      journalEntryId: t.Boolean(),
      createdById: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinic: t.Boolean(),
      type: t.Boolean(),
      journalEntry: t.Boolean(),
      overdues: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `مطالبة على طرف: تجمع فواتيره المتأخّرة وتضيف الفائدة والرسم.`,
    },
  ),
);

export const DunningInclude = t.Partial(
  t.Object(
    {
      status: t.Boolean(),
      clinic: t.Boolean(),
      type: t.Boolean(),
      journalEntry: t.Boolean(),
      overdues: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `مطالبة على طرف: تجمع فواتيره المتأخّرة وتضيف الفائدة والرسم.`,
    },
  ),
);

export const DunningOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clinicId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      typeId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      partyType: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      partyId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      postingDate: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      rateOfInterest: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      dunningFee: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      totalOutstanding: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      totalInterest: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      dunningAmount: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      journalEntryId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdById: t.Union([t.Literal("asc"), t.Literal("desc")], {
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
      description: `مطالبة على طرف: تجمع فواتيره المتأخّرة وتضيف الفائدة والرسم.`,
    },
  ),
);

export const Dunning = t.Composite([DunningPlain, DunningRelations], {
  additionalProperties: false,
});

export const DunningInputCreate = t.Composite(
  [DunningPlainInputCreate, DunningRelationsInputCreate],
  { additionalProperties: false },
);

export const DunningInputUpdate = t.Composite(
  [DunningPlainInputUpdate, DunningRelationsInputUpdate],
  { additionalProperties: false },
);
