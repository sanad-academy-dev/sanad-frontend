import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const PosOpeningEntryPlain = t.Object(
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
);

export const PosOpeningEntryRelations = t.Object(
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
    profile: t.Object(
      {
        id: t.String(),
        clinicId: t.String(),
        name: t.String(),
        warehouseId: __nullable__(t.String()),
        writeOffLimit: t.Number({
          description: `فرق النقد الذي يُقبل شطبه تلقائيًا عند الإقفال؛ ما فوقه يحتاج قرارًا`,
        }),
        writeOffAccountId: __nullable__(
          t.String({
            description: `حساب فروق النقد (زيادة/عجز الدرج) — بلا حساب يُرفض الإقفال بفارق`,
          }),
        ),
        disabled: t.Boolean(),
        createdAt: t.Date(),
        updatedAt: t.Date(),
      },
      {
        additionalProperties: false,
        description: `ملف نقطة بيع: الإعدادات التي تحكم طاولة الكاشير في هذه العيادة.`,
      },
    ),
    cashier: t.Object(
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
    balances: t.Array(
      t.Object(
        {
          id: t.String(),
          openingId: t.String(),
          paymentMethod: t.Union(
            [t.Literal("CASH"), t.Literal("CARD"), t.Literal("TRANSFER")],
            { additionalProperties: false },
          ),
          amount: t.Number(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    closingEntry: __nullable__(
      t.Object(
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
      ),
    ),
    sales: t.Array(
      t.Object(
        {
          id: t.String(),
          code: t.String(),
          clinicId: t.String(),
          status: t.Union(
            [t.Literal("PENDING"), t.Literal("PAID"), t.Literal("REFUNDED")],
            { additionalProperties: false },
          ),
          subtotal: t.Number(),
          discount: t.Number(),
          discountCode: __nullable__(t.String()),
          netTotal: t.Number(),
          taxRate: t.Number(),
          taxAmount: t.Number(),
          total: t.Number(),
          taxTemplateId: __nullable__(t.String()),
          cogsAmount: t.Number(),
          paymentMethod: t.Union(
            [t.Literal("CASH"), t.Literal("CARD"), t.Literal("TRANSFER")],
            { additionalProperties: false },
          ),
          createdById: __nullable__(t.String()),
          posOpeningEntryId: __nullable__(t.String()),
          membershipId: __nullable__(t.String()),
          customerName: __nullable__(t.String()),
          customerPhone: __nullable__(t.String()),
          ownerId: __nullable__(
            t.String({
              description: `[LY-P1] المالك المختار على الكاشير — يُحفظ الآن بعد أن كان يُمرَّر للتسعير ويُرمى.
\`partyId\` كان يصل \`priceSale\` (قالب الضريبة) و\`membership.ownerId\` (خصم العضوية)
ثمّ لا يُكتب في أيّ عمود، فبيعٌ لمالكٍ غير عضو كان يفقد هويّته تمامًا. وذلك يجعل
كسب النقاط على نقطة البيع مستحيلًا (BR-L5.2 «نفس القاعدة بلا بُعد تأمين»)،
والاستبدال في LY-P2 كذلك (BR-L6.5 يشترط طرفًا مربوطًا). §17.2 صفّ ٧.
\`SetNull\` لا \`Cascade\`: حذف مالكٍ لا يجوز أن يمحو بيعًا — البيع واقعةٌ محاسبية.`,
            }),
          ),
          notes: __nullable__(t.String()),
          paidAt: __nullable__(t.Date()),
          fulfillment: t.Union(
            [t.Literal("AT_PAYMENT"), t.Literal("ON_DISPENSE")],
            { additionalProperties: false },
          ),
          dispensedAt: __nullable__(t.Date()),
          dispensedById: __nullable__(t.String()),
          refundedAt: __nullable__(t.Date()),
          refundReason: __nullable__(t.String()),
          refundedById: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
  },
  {
    additionalProperties: false,
    description: `فتح وردية: الكاشير ورصيد الدرج الافتتاحي لكل وسيلة دفع.`,
  },
);

export const PosOpeningEntryPlainInputCreate = t.Object(
  {
    openedAt: t.Optional(t.Date()),
    status: t.Optional(
      t.Union([t.Literal("OPEN"), t.Literal("CLOSED")], {
        additionalProperties: false,
      }),
    ),
  },
  {
    additionalProperties: false,
    description: `فتح وردية: الكاشير ورصيد الدرج الافتتاحي لكل وسيلة دفع.`,
  },
);

export const PosOpeningEntryPlainInputUpdate = t.Object(
  {
    openedAt: t.Optional(t.Date()),
    status: t.Optional(
      t.Union([t.Literal("OPEN"), t.Literal("CLOSED")], {
        additionalProperties: false,
      }),
    ),
  },
  {
    additionalProperties: false,
    description: `فتح وردية: الكاشير ورصيد الدرج الافتتاحي لكل وسيلة دفع.`,
  },
);

export const PosOpeningEntryRelationsInputCreate = t.Object(
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
    profile: t.Object(
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
    cashier: t.Object(
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
    closingEntry: t.Optional(
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
    sales: t.Optional(
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
    description: `فتح وردية: الكاشير ورصيد الدرج الافتتاحي لكل وسيلة دفع.`,
  },
);

export const PosOpeningEntryRelationsInputUpdate = t.Partial(
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
      profile: t.Object(
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
      cashier: t.Object(
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
      closingEntry: t.Partial(
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
      sales: t.Partial(
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
      description: `فتح وردية: الكاشير ورصيد الدرج الافتتاحي لكل وسيلة دفع.`,
    },
  ),
);

export const PosOpeningEntryWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
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
    { $id: "PosOpeningEntry" },
  ),
);

export const PosOpeningEntryWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.String() },
            {
              additionalProperties: false,
              description: `فتح وردية: الكاشير ورصيد الدرج الافتتاحي لكل وسيلة دفع.`,
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
              profileId: t.String(),
              cashierUserId: t.String(),
              openedAt: t.Date(),
              status: t.Union([t.Literal("OPEN"), t.Literal("CLOSED")], {
                additionalProperties: false,
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
  { $id: "PosOpeningEntry" },
);

export const PosOpeningEntrySelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      clinicId: t.Boolean(),
      profileId: t.Boolean(),
      cashierUserId: t.Boolean(),
      openedAt: t.Boolean(),
      status: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinic: t.Boolean(),
      profile: t.Boolean(),
      cashier: t.Boolean(),
      balances: t.Boolean(),
      closingEntry: t.Boolean(),
      sales: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `فتح وردية: الكاشير ورصيد الدرج الافتتاحي لكل وسيلة دفع.`,
    },
  ),
);

export const PosOpeningEntryInclude = t.Partial(
  t.Object(
    {
      status: t.Boolean(),
      clinic: t.Boolean(),
      profile: t.Boolean(),
      cashier: t.Boolean(),
      balances: t.Boolean(),
      closingEntry: t.Boolean(),
      sales: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `فتح وردية: الكاشير ورصيد الدرج الافتتاحي لكل وسيلة دفع.`,
    },
  ),
);

export const PosOpeningEntryOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clinicId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      profileId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      cashierUserId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      openedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
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
      description: `فتح وردية: الكاشير ورصيد الدرج الافتتاحي لكل وسيلة دفع.`,
    },
  ),
);

export const PosOpeningEntry = t.Composite(
  [PosOpeningEntryPlain, PosOpeningEntryRelations],
  { additionalProperties: false },
);

export const PosOpeningEntryInputCreate = t.Composite(
  [PosOpeningEntryPlainInputCreate, PosOpeningEntryRelationsInputCreate],
  { additionalProperties: false },
);

export const PosOpeningEntryInputUpdate = t.Composite(
  [PosOpeningEntryPlainInputUpdate, PosOpeningEntryRelationsInputUpdate],
  { additionalProperties: false },
);
