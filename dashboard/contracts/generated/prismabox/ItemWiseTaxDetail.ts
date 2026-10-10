import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const ItemWiseTaxDetailPlain = t.Object(
  {
    id: t.String(),
    clinicId: t.String(),
    voucherType: t.String(),
    voucherId: t.String(),
    itemRowId: t.String(),
    taxRowId: t.String(),
    rate: t.Number(),
    amount: t.Number(),
    taxableAmount: t.Number(),
    createdAt: t.Date(),
  },
  { additionalProperties: false },
);

export const ItemWiseTaxDetailRelations = t.Object(
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
  },
  { additionalProperties: false },
);

export const ItemWiseTaxDetailPlainInputCreate = t.Object(
  {
    voucherType: t.String(),
    rate: t.Optional(t.Number()),
    amount: t.Optional(t.Number()),
    taxableAmount: t.Optional(t.Number()),
  },
  { additionalProperties: false },
);

export const ItemWiseTaxDetailPlainInputUpdate = t.Object(
  {
    voucherType: t.Optional(t.String()),
    rate: t.Optional(t.Number()),
    amount: t.Optional(t.Number()),
    taxableAmount: t.Optional(t.Number()),
  },
  { additionalProperties: false },
);

export const ItemWiseTaxDetailRelationsInputCreate = t.Object(
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
  },
  { additionalProperties: false },
);

export const ItemWiseTaxDetailRelationsInputUpdate = t.Partial(
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
    },
    { additionalProperties: false },
  ),
);

export const ItemWiseTaxDetailWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          clinicId: t.String(),
          voucherType: t.String(),
          voucherId: t.String(),
          itemRowId: t.String(),
          taxRowId: t.String(),
          rate: t.Number(),
          amount: t.Number(),
          taxableAmount: t.Number(),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "ItemWiseTaxDetail" },
  ),
);

export const ItemWiseTaxDetailWhereUnique = t.Recursive(
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
              clinicId: t.String(),
              voucherType: t.String(),
              voucherId: t.String(),
              itemRowId: t.String(),
              taxRowId: t.String(),
              rate: t.Number(),
              amount: t.Number(),
              taxableAmount: t.Number(),
              createdAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "ItemWiseTaxDetail" },
);

export const ItemWiseTaxDetailSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      clinicId: t.Boolean(),
      voucherType: t.Boolean(),
      voucherId: t.Boolean(),
      itemRowId: t.Boolean(),
      taxRowId: t.Boolean(),
      rate: t.Boolean(),
      amount: t.Boolean(),
      taxableAmount: t.Boolean(),
      createdAt: t.Boolean(),
      clinic: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const ItemWiseTaxDetailInclude = t.Partial(
  t.Object(
    { clinic: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const ItemWiseTaxDetailOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clinicId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      voucherType: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      voucherId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      itemRowId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      taxRowId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      rate: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      amount: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      taxableAmount: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const ItemWiseTaxDetail = t.Composite(
  [ItemWiseTaxDetailPlain, ItemWiseTaxDetailRelations],
  { additionalProperties: false },
);

export const ItemWiseTaxDetailInputCreate = t.Composite(
  [ItemWiseTaxDetailPlainInputCreate, ItemWiseTaxDetailRelationsInputCreate],
  { additionalProperties: false },
);

export const ItemWiseTaxDetailInputUpdate = t.Composite(
  [ItemWiseTaxDetailPlainInputUpdate, ItemWiseTaxDetailRelationsInputUpdate],
  { additionalProperties: false },
);
