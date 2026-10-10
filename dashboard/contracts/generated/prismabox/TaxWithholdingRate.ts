import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const TaxWithholdingRatePlain = t.Object(
  {
    id: t.String(),
    categoryId: t.String(),
    fromDate: t.Date(),
    toDate: t.Date(),
    rate: t.Number(),
    singleThreshold: t.Number(),
    cumulativeThreshold: t.Number(),
  },
  {
    additionalProperties: false,
    description: `نسبة الفئة في نافذة تاريخية بعتبتيها. النوافذ لا يجوز تداخلها (يُتحقَّق في الخدمة).`,
  },
);

export const TaxWithholdingRateRelations = t.Object(
  {
    category: t.Object(
      {
        id: t.String(),
        clinicId: t.String(),
        title: t.String(),
        basis: t.Union([t.Literal("GROSS"), t.Literal("NET")], {
          additionalProperties: false,
        }),
        taxOnExcessAmount: t.Boolean({
          description: `الضريبة على ما تجاوز العتبة فقط، لا على المبلغ كاملًا`,
        }),
        roundOffTaxAmount: t.Boolean(),
        disableSingleThreshold: t.Boolean(),
        disableCumulativeThreshold: t.Boolean(),
        disabled: t.Boolean(),
        accountId: __nullable__(
          t.String({
            description: `حساب الالتزام الذي يُقيَّد عليه المبلغ المستقطَع (دائن على فاتورة الشراء)`,
          }),
        ),
        createdAt: t.Date(),
        updatedAt: t.Date(),
      },
      {
        additionalProperties: false,
        description: `فئة استقطاع: نِسَبها بنوافذ تاريخية، وحسابها لكل شركة، وسلوك عتباتها.`,
      },
    ),
  },
  {
    additionalProperties: false,
    description: `نسبة الفئة في نافذة تاريخية بعتبتيها. النوافذ لا يجوز تداخلها (يُتحقَّق في الخدمة).`,
  },
);

export const TaxWithholdingRatePlainInputCreate = t.Object(
  {
    fromDate: t.Date(),
    toDate: t.Date(),
    rate: t.Optional(t.Number()),
    singleThreshold: t.Optional(t.Number()),
    cumulativeThreshold: t.Optional(t.Number()),
  },
  {
    additionalProperties: false,
    description: `نسبة الفئة في نافذة تاريخية بعتبتيها. النوافذ لا يجوز تداخلها (يُتحقَّق في الخدمة).`,
  },
);

export const TaxWithholdingRatePlainInputUpdate = t.Object(
  {
    fromDate: t.Optional(t.Date()),
    toDate: t.Optional(t.Date()),
    rate: t.Optional(t.Number()),
    singleThreshold: t.Optional(t.Number()),
    cumulativeThreshold: t.Optional(t.Number()),
  },
  {
    additionalProperties: false,
    description: `نسبة الفئة في نافذة تاريخية بعتبتيها. النوافذ لا يجوز تداخلها (يُتحقَّق في الخدمة).`,
  },
);

export const TaxWithholdingRateRelationsInputCreate = t.Object(
  {
    category: t.Object(
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
  },
  {
    additionalProperties: false,
    description: `نسبة الفئة في نافذة تاريخية بعتبتيها. النوافذ لا يجوز تداخلها (يُتحقَّق في الخدمة).`,
  },
);

export const TaxWithholdingRateRelationsInputUpdate = t.Partial(
  t.Object(
    {
      category: t.Object(
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
    },
    {
      additionalProperties: false,
      description: `نسبة الفئة في نافذة تاريخية بعتبتيها. النوافذ لا يجوز تداخلها (يُتحقَّق في الخدمة).`,
    },
  ),
);

export const TaxWithholdingRateWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          categoryId: t.String(),
          fromDate: t.Date(),
          toDate: t.Date(),
          rate: t.Number(),
          singleThreshold: t.Number(),
          cumulativeThreshold: t.Number(),
        },
        {
          additionalProperties: false,
          description: `نسبة الفئة في نافذة تاريخية بعتبتيها. النوافذ لا يجوز تداخلها (يُتحقَّق في الخدمة).`,
        },
      ),
    { $id: "TaxWithholdingRate" },
  ),
);

export const TaxWithholdingRateWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.String() },
            {
              additionalProperties: false,
              description: `نسبة الفئة في نافذة تاريخية بعتبتيها. النوافذ لا يجوز تداخلها (يُتحقَّق في الخدمة).`,
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
              categoryId: t.String(),
              fromDate: t.Date(),
              toDate: t.Date(),
              rate: t.Number(),
              singleThreshold: t.Number(),
              cumulativeThreshold: t.Number(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "TaxWithholdingRate" },
);

export const TaxWithholdingRateSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      categoryId: t.Boolean(),
      fromDate: t.Boolean(),
      toDate: t.Boolean(),
      rate: t.Boolean(),
      singleThreshold: t.Boolean(),
      cumulativeThreshold: t.Boolean(),
      category: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `نسبة الفئة في نافذة تاريخية بعتبتيها. النوافذ لا يجوز تداخلها (يُتحقَّق في الخدمة).`,
    },
  ),
);

export const TaxWithholdingRateInclude = t.Partial(
  t.Object(
    { category: t.Boolean(), _count: t.Boolean() },
    {
      additionalProperties: false,
      description: `نسبة الفئة في نافذة تاريخية بعتبتيها. النوافذ لا يجوز تداخلها (يُتحقَّق في الخدمة).`,
    },
  ),
);

export const TaxWithholdingRateOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      categoryId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      fromDate: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      toDate: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      rate: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      singleThreshold: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      cumulativeThreshold: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    {
      additionalProperties: false,
      description: `نسبة الفئة في نافذة تاريخية بعتبتيها. النوافذ لا يجوز تداخلها (يُتحقَّق في الخدمة).`,
    },
  ),
);

export const TaxWithholdingRate = t.Composite(
  [TaxWithholdingRatePlain, TaxWithholdingRateRelations],
  { additionalProperties: false },
);

export const TaxWithholdingRateInputCreate = t.Composite(
  [TaxWithholdingRatePlainInputCreate, TaxWithholdingRateRelationsInputCreate],
  { additionalProperties: false },
);

export const TaxWithholdingRateInputUpdate = t.Composite(
  [TaxWithholdingRatePlainInputUpdate, TaxWithholdingRateRelationsInputUpdate],
  { additionalProperties: false },
);
