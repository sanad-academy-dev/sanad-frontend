import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const PosClosingBalancePlain = t.Object(
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
);

export const PosClosingBalanceRelations = t.Object(
  {
    closing: t.Object(
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
  },
  { additionalProperties: false },
);

export const PosClosingBalancePlainInputCreate = t.Object(
  {
    paymentMethod: t.Union(
      [t.Literal("CASH"), t.Literal("CARD"), t.Literal("TRANSFER")],
      { additionalProperties: false },
    ),
    expectedAmount: t.Optional(
      t.Number({
        description: `الافتتاحي + مبيعات الوردية بهذه الوسيلة — يحسبه الخادم لا المستخدم`,
      }),
    ),
    countedAmount: t.Optional(
      t.Number({ description: `ما عدّه الكاشير فعلًا` }),
    ),
    difference: t.Optional(t.Number()),
  },
  { additionalProperties: false },
);

export const PosClosingBalancePlainInputUpdate = t.Object(
  {
    paymentMethod: t.Optional(
      t.Union([t.Literal("CASH"), t.Literal("CARD"), t.Literal("TRANSFER")], {
        additionalProperties: false,
      }),
    ),
    expectedAmount: t.Optional(
      t.Number({
        description: `الافتتاحي + مبيعات الوردية بهذه الوسيلة — يحسبه الخادم لا المستخدم`,
      }),
    ),
    countedAmount: t.Optional(
      t.Number({ description: `ما عدّه الكاشير فعلًا` }),
    ),
    difference: t.Optional(t.Number()),
  },
  { additionalProperties: false },
);

export const PosClosingBalanceRelationsInputCreate = t.Object(
  {
    closing: t.Object(
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
  { additionalProperties: false },
);

export const PosClosingBalanceRelationsInputUpdate = t.Partial(
  t.Object(
    {
      closing: t.Object(
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
    { additionalProperties: false },
  ),
);

export const PosClosingBalanceWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
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
    { $id: "PosClosingBalance" },
  ),
);

export const PosClosingBalanceWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            {
              id: t.String(),
              closingId_paymentMethod: t.Object(
                {
                  closingId: t.String(),
                  paymentMethod: t.Union(
                    [
                      t.Literal("CASH"),
                      t.Literal("CARD"),
                      t.Literal("TRANSFER"),
                    ],
                    { additionalProperties: false },
                  ),
                },
                { additionalProperties: false },
              ),
            },
            { additionalProperties: false },
          ),
          { additionalProperties: false },
        ),
        t.Union(
          [
            t.Object({ id: t.String() }),
            t.Object({
              closingId_paymentMethod: t.Object(
                {
                  closingId: t.String(),
                  paymentMethod: t.Union(
                    [
                      t.Literal("CASH"),
                      t.Literal("CARD"),
                      t.Literal("TRANSFER"),
                    ],
                    { additionalProperties: false },
                  ),
                },
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
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "PosClosingBalance" },
);

export const PosClosingBalanceSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      closingId: t.Boolean(),
      paymentMethod: t.Boolean(),
      expectedAmount: t.Boolean(),
      countedAmount: t.Boolean(),
      difference: t.Boolean(),
      closing: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const PosClosingBalanceInclude = t.Partial(
  t.Object(
    { paymentMethod: t.Boolean(), closing: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const PosClosingBalanceOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      closingId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      expectedAmount: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      countedAmount: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      difference: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const PosClosingBalance = t.Composite(
  [PosClosingBalancePlain, PosClosingBalanceRelations],
  { additionalProperties: false },
);

export const PosClosingBalanceInputCreate = t.Composite(
  [PosClosingBalancePlainInputCreate, PosClosingBalanceRelationsInputCreate],
  { additionalProperties: false },
);

export const PosClosingBalanceInputUpdate = t.Composite(
  [PosClosingBalancePlainInputUpdate, PosClosingBalanceRelationsInputUpdate],
  { additionalProperties: false },
);
