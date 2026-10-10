import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const UnreconcilePaymentEntryPlain = t.Object(
  {
    id: t.String(),
    clinicId: t.String(),
    unreconcilePaymentId: t.String(),
    idx: t.Integer(),
    againstVoucherType: t.String({
      description: `*
* the invoice whose settlement was released`,
    }),
    againstVoucherId: t.String(),
    unlinkedAmount: t.Number(),
  },
  { additionalProperties: false },
);

export const UnreconcilePaymentEntryRelations = t.Object(
  {
    unreconcilePayment: t.Object(
      {
        id: t.String(),
        clinicId: t.String(),
        voucherType: t.String({
          description: `*
* the payment/credit whose allocations were broken`,
        }),
        voucherId: t.String(),
        remarks: __nullable__(t.String()),
        createdById: __nullable__(t.String()),
        createdAt: t.Date(),
      },
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const UnreconcilePaymentEntryPlainInputCreate = t.Object(
  {
    idx: t.Integer(),
    againstVoucherType: t.String({
      description: `*
* the invoice whose settlement was released`,
    }),
    unlinkedAmount: t.Optional(t.Number()),
  },
  { additionalProperties: false },
);

export const UnreconcilePaymentEntryPlainInputUpdate = t.Object(
  {
    idx: t.Optional(t.Integer()),
    againstVoucherType: t.Optional(
      t.String({
        description: `*
* the invoice whose settlement was released`,
      }),
    ),
    unlinkedAmount: t.Optional(t.Number()),
  },
  { additionalProperties: false },
);

export const UnreconcilePaymentEntryRelationsInputCreate = t.Object(
  {
    unreconcilePayment: t.Object(
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

export const UnreconcilePaymentEntryRelationsInputUpdate = t.Partial(
  t.Object(
    {
      unreconcilePayment: t.Object(
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

export const UnreconcilePaymentEntryWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          clinicId: t.String(),
          unreconcilePaymentId: t.String(),
          idx: t.Integer(),
          againstVoucherType: t.String({
            description: `*
* the invoice whose settlement was released`,
          }),
          againstVoucherId: t.String(),
          unlinkedAmount: t.Number(),
        },
        { additionalProperties: false },
      ),
    { $id: "UnreconcilePaymentEntry" },
  ),
);

export const UnreconcilePaymentEntryWhereUnique = t.Recursive(
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
              unreconcilePaymentId: t.String(),
              idx: t.Integer(),
              againstVoucherType: t.String({
                description: `*
* the invoice whose settlement was released`,
              }),
              againstVoucherId: t.String(),
              unlinkedAmount: t.Number(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "UnreconcilePaymentEntry" },
);

export const UnreconcilePaymentEntrySelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      clinicId: t.Boolean(),
      unreconcilePaymentId: t.Boolean(),
      idx: t.Boolean(),
      againstVoucherType: t.Boolean(),
      againstVoucherId: t.Boolean(),
      unlinkedAmount: t.Boolean(),
      unreconcilePayment: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const UnreconcilePaymentEntryInclude = t.Partial(
  t.Object(
    { unreconcilePayment: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const UnreconcilePaymentEntryOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clinicId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      unreconcilePaymentId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      idx: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      againstVoucherType: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      againstVoucherId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      unlinkedAmount: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const UnreconcilePaymentEntry = t.Composite(
  [UnreconcilePaymentEntryPlain, UnreconcilePaymentEntryRelations],
  { additionalProperties: false },
);

export const UnreconcilePaymentEntryInputCreate = t.Composite(
  [
    UnreconcilePaymentEntryPlainInputCreate,
    UnreconcilePaymentEntryRelationsInputCreate,
  ],
  { additionalProperties: false },
);

export const UnreconcilePaymentEntryInputUpdate = t.Composite(
  [
    UnreconcilePaymentEntryPlainInputUpdate,
    UnreconcilePaymentEntryRelationsInputUpdate,
  ],
  { additionalProperties: false },
);
