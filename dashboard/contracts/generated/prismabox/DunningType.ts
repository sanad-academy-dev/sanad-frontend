import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const DunningTypePlain = t.Object(
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
);

export const DunningTypeRelations = t.Object(
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
    incomeAccount: __nullable__(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          accountName: t.String(),
          accountNumber: __nullable__(t.String()),
          parentAccountId: __nullable__(t.String()),
          isGroup: t.Boolean(),
          rootType: t.Union(
            [
              t.Literal("ASSET"),
              t.Literal("LIABILITY"),
              t.Literal("INCOME"),
              t.Literal("EXPENSE"),
              t.Literal("EQUITY"),
            ],
            { additionalProperties: false },
          ),
          reportType: t.Union(
            [t.Literal("BALANCE_SHEET"), t.Literal("PROFIT_AND_LOSS")],
            { additionalProperties: false },
          ),
          accountType: __nullable__(
            t.Union(
              [
                t.Literal("BANK"),
                t.Literal("CASH"),
                t.Literal("RECEIVABLE"),
                t.Literal("PAYABLE"),
                t.Literal("TAX"),
                t.Literal("STOCK"),
                t.Literal("FIXED_ASSET"),
                t.Literal("ACCUMULATED_DEPRECIATION"),
                t.Literal("DEPRECIATION"),
                t.Literal("EXPENSE_ACCOUNT"),
                t.Literal("INCOME_ACCOUNT"),
                t.Literal("CHARGEABLE"),
                t.Literal("ROUND_OFF"),
                t.Literal("ROUND_OFF_FOR_OPENING"),
                t.Literal("TEMPORARY"),
                t.Literal("EQUITY"),
                t.Literal("DIRECT_INCOME"),
                t.Literal("INDIRECT_INCOME"),
                t.Literal("DIRECT_EXPENSE"),
                t.Literal("INDIRECT_EXPENSE"),
                t.Literal("COST_OF_GOODS_SOLD"),
                t.Literal("CURRENT_ASSET"),
                t.Literal("CURRENT_LIABILITY"),
                t.Literal("CAPITAL_WORK_IN_PROGRESS"),
                t.Literal("ASSET_RECEIVED_BUT_NOT_BILLED"),
                t.Literal("STOCK_RECEIVED_BUT_NOT_BILLED"),
                t.Literal("SERVICE_RECEIVED_BUT_NOT_BILLED"),
                t.Literal("STOCK_ADJUSTMENT"),
              ],
              { additionalProperties: false },
            ),
          ),
          accountCurrencyCode: t.String(),
          taxRate: __nullable__(t.Number()),
          balanceMustBe: t.Union(
            [t.Literal("NONE"), t.Literal("DEBIT"), t.Literal("CREDIT")],
            { additionalProperties: false },
          ),
          freezeAccount: t.Boolean(),
          disabled: t.Boolean(),
          lft: t.Integer(),
          rgt: t.Integer(),
          createdById: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    ),
    dunnings: t.Array(
      t.Object(
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
      ),
      { additionalProperties: false },
    ),
  },
  {
    additionalProperties: false,
    description: `نوع مطالبة: الرسوم والفائدة الافتراضية ونصّ الخطاب. النصّ عربي فقط اليوم (قاعدة 5).`,
  },
);

export const DunningTypePlainInputCreate = t.Object(
  {
    title: t.String(),
    rateOfInterest: t.Optional(t.Number()),
    dunningFee: t.Optional(t.Number()),
    letterBody: t.Optional(__nullable__(t.String())),
    disabled: t.Optional(t.Boolean()),
  },
  {
    additionalProperties: false,
    description: `نوع مطالبة: الرسوم والفائدة الافتراضية ونصّ الخطاب. النصّ عربي فقط اليوم (قاعدة 5).`,
  },
);

export const DunningTypePlainInputUpdate = t.Object(
  {
    title: t.Optional(t.String()),
    rateOfInterest: t.Optional(t.Number()),
    dunningFee: t.Optional(t.Number()),
    letterBody: t.Optional(__nullable__(t.String())),
    disabled: t.Optional(t.Boolean()),
  },
  {
    additionalProperties: false,
    description: `نوع مطالبة: الرسوم والفائدة الافتراضية ونصّ الخطاب. النصّ عربي فقط اليوم (قاعدة 5).`,
  },
);

export const DunningTypeRelationsInputCreate = t.Object(
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
    incomeAccount: t.Optional(
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
    dunnings: t.Optional(
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
    description: `نوع مطالبة: الرسوم والفائدة الافتراضية ونصّ الخطاب. النصّ عربي فقط اليوم (قاعدة 5).`,
  },
);

export const DunningTypeRelationsInputUpdate = t.Partial(
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
      incomeAccount: t.Partial(
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
      dunnings: t.Partial(
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
      description: `نوع مطالبة: الرسوم والفائدة الافتراضية ونصّ الخطاب. النصّ عربي فقط اليوم (قاعدة 5).`,
    },
  ),
);

export const DunningTypeWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          clinicId: t.String(),
          title: t.String(),
          rateOfInterest: t.Number(),
          dunningFee: t.Number(),
          letterBody: t.String(),
          incomeAccountId: t.String({
            description: `حساب الإيراد الذي يستقبل الرسوم والفائدة عند التحصيل`,
          }),
          disabled: t.Boolean(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `نوع مطالبة: الرسوم والفائدة الافتراضية ونصّ الخطاب. النصّ عربي فقط اليوم (قاعدة 5).`,
        },
      ),
    { $id: "DunningType" },
  ),
);

export const DunningTypeWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            {
              id: t.String(),
              clinicId_title: t.Object(
                { clinicId: t.String(), title: t.String() },
                { additionalProperties: false },
              ),
            },
            {
              additionalProperties: false,
              description: `نوع مطالبة: الرسوم والفائدة الافتراضية ونصّ الخطاب. النصّ عربي فقط اليوم (قاعدة 5).`,
            },
          ),
          { additionalProperties: false },
        ),
        t.Union(
          [
            t.Object({ id: t.String() }),
            t.Object({
              clinicId_title: t.Object(
                { clinicId: t.String(), title: t.String() },
                { additionalProperties: false },
              ),
            }),
          ],
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
              title: t.String(),
              rateOfInterest: t.Number(),
              dunningFee: t.Number(),
              letterBody: t.String(),
              incomeAccountId: t.String({
                description: `حساب الإيراد الذي يستقبل الرسوم والفائدة عند التحصيل`,
              }),
              disabled: t.Boolean(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "DunningType" },
);

export const DunningTypeSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      clinicId: t.Boolean(),
      title: t.Boolean(),
      rateOfInterest: t.Boolean(),
      dunningFee: t.Boolean(),
      letterBody: t.Boolean(),
      incomeAccountId: t.Boolean(),
      disabled: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinic: t.Boolean(),
      incomeAccount: t.Boolean(),
      dunnings: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `نوع مطالبة: الرسوم والفائدة الافتراضية ونصّ الخطاب. النصّ عربي فقط اليوم (قاعدة 5).`,
    },
  ),
);

export const DunningTypeInclude = t.Partial(
  t.Object(
    {
      clinic: t.Boolean(),
      incomeAccount: t.Boolean(),
      dunnings: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `نوع مطالبة: الرسوم والفائدة الافتراضية ونصّ الخطاب. النصّ عربي فقط اليوم (قاعدة 5).`,
    },
  ),
);

export const DunningTypeOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clinicId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      title: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      rateOfInterest: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      dunningFee: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      letterBody: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      incomeAccountId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      disabled: t.Union([t.Literal("asc"), t.Literal("desc")], {
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
      description: `نوع مطالبة: الرسوم والفائدة الافتراضية ونصّ الخطاب. النصّ عربي فقط اليوم (قاعدة 5).`,
    },
  ),
);

export const DunningType = t.Composite(
  [DunningTypePlain, DunningTypeRelations],
  { additionalProperties: false },
);

export const DunningTypeInputCreate = t.Composite(
  [DunningTypePlainInputCreate, DunningTypeRelationsInputCreate],
  { additionalProperties: false },
);

export const DunningTypeInputUpdate = t.Composite(
  [DunningTypePlainInputUpdate, DunningTypeRelationsInputUpdate],
  { additionalProperties: false },
);
