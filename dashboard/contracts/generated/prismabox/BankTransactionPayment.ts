import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const BankTransactionPaymentPlain = t.Object(
  {
    id: t.String(),
    bankTransactionId: t.String(),
    paymentDocument: t.String(),
    paymentEntryId: t.String(),
    paymentRowId: __nullable__(t.String()),
    allocatedAmount: t.Number(),
    createdAt: t.Date(),
  },
  { additionalProperties: false },
);

export const BankTransactionPaymentRelations = t.Object(
  {
    bankTransaction: t.Object(
      {
        id: t.String(),
        clinicId: t.String(),
        documentNo: __nullable__(t.String()),
        docstatus: t.Union(
          [t.Literal("DRAFT"), t.Literal("SUBMITTED"), t.Literal("CANCELLED")],
          { additionalProperties: false },
        ),
        postingDate: t.Date(),
        amendedFromId: __nullable__(t.String()),
        bankAccountId: t.String(),
        deposit: t.Number(),
        withdrawal: t.Number(),
        currencyCode: t.String(),
        description: __nullable__(t.String()),
        referenceNumber: __nullable__(t.String()),
        transactionId: __nullable__(t.String()),
        status: t.Union(
          [
            t.Literal("PENDING"),
            t.Literal("UNRECONCILED"),
            t.Literal("RECONCILED"),
            t.Literal("SETTLED"),
            t.Literal("CANCELLED"),
          ],
          { additionalProperties: false },
        ),
        partyType: __nullable__(t.String()),
        partyId: __nullable__(t.String()),
        allocatedAmount: t.Number(),
        unallocatedAmount: t.Number(),
        pairedTransactionId: __nullable__(t.String()),
        importId: __nullable__(t.String()),
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
  },
  { additionalProperties: false },
);

export const BankTransactionPaymentPlainInputCreate = t.Object(
  { paymentDocument: t.String(), allocatedAmount: t.Number() },
  { additionalProperties: false },
);

export const BankTransactionPaymentPlainInputUpdate = t.Object(
  {
    paymentDocument: t.Optional(t.String()),
    allocatedAmount: t.Optional(t.Number()),
  },
  { additionalProperties: false },
);

export const BankTransactionPaymentRelationsInputCreate = t.Object(
  {
    bankTransaction: t.Object(
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

export const BankTransactionPaymentRelationsInputUpdate = t.Partial(
  t.Object(
    {
      bankTransaction: t.Object(
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

export const BankTransactionPaymentWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          bankTransactionId: t.String(),
          paymentDocument: t.String(),
          paymentEntryId: t.String(),
          paymentRowId: t.String(),
          allocatedAmount: t.Number(),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "BankTransactionPayment" },
  ),
);

export const BankTransactionPaymentWhereUnique = t.Recursive(
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
              bankTransactionId: t.String(),
              paymentDocument: t.String(),
              paymentEntryId: t.String(),
              paymentRowId: t.String(),
              allocatedAmount: t.Number(),
              createdAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "BankTransactionPayment" },
);

export const BankTransactionPaymentSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      bankTransactionId: t.Boolean(),
      paymentDocument: t.Boolean(),
      paymentEntryId: t.Boolean(),
      paymentRowId: t.Boolean(),
      allocatedAmount: t.Boolean(),
      createdAt: t.Boolean(),
      bankTransaction: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const BankTransactionPaymentInclude = t.Partial(
  t.Object(
    { bankTransaction: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const BankTransactionPaymentOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      bankTransactionId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      paymentDocument: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      paymentEntryId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      paymentRowId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      allocatedAmount: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const BankTransactionPayment = t.Composite(
  [BankTransactionPaymentPlain, BankTransactionPaymentRelations],
  { additionalProperties: false },
);

export const BankTransactionPaymentInputCreate = t.Composite(
  [
    BankTransactionPaymentPlainInputCreate,
    BankTransactionPaymentRelationsInputCreate,
  ],
  { additionalProperties: false },
);

export const BankTransactionPaymentInputUpdate = t.Composite(
  [
    BankTransactionPaymentPlainInputUpdate,
    BankTransactionPaymentRelationsInputUpdate,
  ],
  { additionalProperties: false },
);
