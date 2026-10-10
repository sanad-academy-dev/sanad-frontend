import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const PaymentEntryReferencePlain = t.Object(
  {
    id: t.String(),
    clinicId: t.String(),
    paymentEntryId: t.String(),
    idx: t.Integer(),
    referenceDoctype: t.String(),
    referenceId: t.String(),
    dueDate: __nullable__(t.Date()),
    billNo: __nullable__(t.String()),
    totalAmount: t.Number(),
    outstandingAmount: t.Number(),
    allocatedAmount: t.Number(),
    exchangeRate: t.Number(),
    exchangeGainLossJeId: __nullable__(t.String()),
    exchangeGainLoss: t.Number(),
    paymentTermId: __nullable__(t.String()),
    accountId: __nullable__(t.String()),
  },
  { additionalProperties: false },
);

export const PaymentEntryReferenceRelations = t.Object(
  {
    paymentEntry: t.Object(
      {
        id: t.String(),
        clinicId: t.String(),
        documentNo: __nullable__(t.String()),
        docstatus: t.Union(
          [t.Literal("DRAFT"), t.Literal("SUBMITTED"), t.Literal("CANCELLED")],
          { additionalProperties: false },
        ),
        status: t.Union(
          [t.Literal("DRAFT"), t.Literal("SUBMITTED"), t.Literal("CANCELLED")],
          { additionalProperties: false },
        ),
        amendedFromId: __nullable__(t.String()),
        paymentType: t.Union(
          [
            t.Literal("RECEIVE"),
            t.Literal("PAY"),
            t.Literal("INTERNAL_TRANSFER"),
          ],
          { additionalProperties: false },
        ),
        postingDate: t.Date(),
        partyType: __nullable__(t.String()),
        partyId: __nullable__(t.String()),
        modeOfPaymentId: __nullable__(t.String()),
        paidFromId: t.String(),
        paidFromAccountCurrencyCode: __nullable__(t.String()),
        paidToId: t.String(),
        paidToAccountCurrencyCode: __nullable__(t.String()),
        paidAmount: t.Number(),
        sourceExchangeRate: t.Number(),
        basePaidAmount: t.Number(),
        receivedAmount: t.Number(),
        targetExchangeRate: t.Number(),
        baseReceivedAmount: t.Number(),
        totalAllocatedAmount: t.Number(),
        unallocatedAmount: t.Number(),
        differenceAmount: t.Number(),
        referenceNo: __nullable__(t.String()),
        referenceDate: __nullable__(t.Date()),
        clearanceDate: __nullable__(t.Date()),
        isOpening: t.Boolean(),
        bookAdvanceInSeparateAccount: t.Boolean({
          description: `[P12.6] FR-11.3 — snapshot of \`book_advance_payments_in_separate_party_account\` taken
when the draft was created. Snapshotted, not read live: a flag toggled between draft
and submit would post the advance somewhere other than where the operator was told,
and the document must record the regime it was written under.`,
        }),
        costCenterId: __nullable__(t.String()),
        projectId: __nullable__(t.String()),
        dim1: __nullable__(t.String()),
        dim2: __nullable__(t.String()),
        dim3: __nullable__(t.String()),
        dim4: __nullable__(t.String()),
        inWords: __nullable__(t.String()),
        remarks: __nullable__(t.String()),
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
    paymentTerm: __nullable__(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          paymentTermName: t.String(),
          invoicePortion: t.Number(),
          dueDateBasedOn: t.Union(
            [
              t.Literal("DAYS_AFTER_INVOICE_DATE"),
              t.Literal("DAYS_AFTER_INVOICE_MONTH_END"),
              t.Literal("MONTHS_AFTER_INVOICE_MONTH_END"),
            ],
            { additionalProperties: false },
          ),
          creditDays: t.Integer(),
          creditMonths: t.Integer(),
          modeOfPaymentId: __nullable__(t.String()),
          discountType: t.Union(
            [t.Literal("PERCENTAGE"), t.Literal("AMOUNT")],
            { additionalProperties: false },
          ),
          discount: t.Number(),
          discountValidityBasedOn: t.Union(
            [
              t.Literal("DAYS_AFTER_INVOICE_DATE"),
              t.Literal("DAYS_AFTER_INVOICE_MONTH_END"),
              t.Literal("MONTHS_AFTER_INVOICE_MONTH_END"),
            ],
            { additionalProperties: false },
          ),
          discountValidity: t.Integer(),
          createdById: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    ),
    account: __nullable__(
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
  },
  { additionalProperties: false },
);

export const PaymentEntryReferencePlainInputCreate = t.Object(
  {
    idx: t.Integer(),
    referenceDoctype: t.String(),
    dueDate: t.Optional(__nullable__(t.Date())),
    billNo: t.Optional(__nullable__(t.String())),
    totalAmount: t.Optional(t.Number()),
    outstandingAmount: t.Optional(t.Number()),
    allocatedAmount: t.Optional(t.Number()),
    exchangeRate: t.Optional(t.Number()),
    exchangeGainLoss: t.Optional(t.Number()),
  },
  { additionalProperties: false },
);

export const PaymentEntryReferencePlainInputUpdate = t.Object(
  {
    idx: t.Optional(t.Integer()),
    referenceDoctype: t.Optional(t.String()),
    dueDate: t.Optional(__nullable__(t.Date())),
    billNo: t.Optional(__nullable__(t.String())),
    totalAmount: t.Optional(t.Number()),
    outstandingAmount: t.Optional(t.Number()),
    allocatedAmount: t.Optional(t.Number()),
    exchangeRate: t.Optional(t.Number()),
    exchangeGainLoss: t.Optional(t.Number()),
  },
  { additionalProperties: false },
);

export const PaymentEntryReferenceRelationsInputCreate = t.Object(
  {
    paymentEntry: t.Object(
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
    paymentTerm: t.Optional(
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
    account: t.Optional(
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
  },
  { additionalProperties: false },
);

export const PaymentEntryReferenceRelationsInputUpdate = t.Partial(
  t.Object(
    {
      paymentEntry: t.Object(
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
      paymentTerm: t.Partial(
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
      account: t.Partial(
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
    },
    { additionalProperties: false },
  ),
);

export const PaymentEntryReferenceWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          clinicId: t.String(),
          paymentEntryId: t.String(),
          idx: t.Integer(),
          referenceDoctype: t.String(),
          referenceId: t.String(),
          dueDate: t.Date(),
          billNo: t.String(),
          totalAmount: t.Number(),
          outstandingAmount: t.Number(),
          allocatedAmount: t.Number(),
          exchangeRate: t.Number(),
          exchangeGainLossJeId: t.String(),
          exchangeGainLoss: t.Number(),
          paymentTermId: t.String(),
          accountId: t.String(),
        },
        { additionalProperties: false },
      ),
    { $id: "PaymentEntryReference" },
  ),
);

export const PaymentEntryReferenceWhereUnique = t.Recursive(
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
              paymentEntryId: t.String(),
              idx: t.Integer(),
              referenceDoctype: t.String(),
              referenceId: t.String(),
              dueDate: t.Date(),
              billNo: t.String(),
              totalAmount: t.Number(),
              outstandingAmount: t.Number(),
              allocatedAmount: t.Number(),
              exchangeRate: t.Number(),
              exchangeGainLossJeId: t.String(),
              exchangeGainLoss: t.Number(),
              paymentTermId: t.String(),
              accountId: t.String(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "PaymentEntryReference" },
);

export const PaymentEntryReferenceSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      clinicId: t.Boolean(),
      paymentEntryId: t.Boolean(),
      idx: t.Boolean(),
      referenceDoctype: t.Boolean(),
      referenceId: t.Boolean(),
      dueDate: t.Boolean(),
      billNo: t.Boolean(),
      totalAmount: t.Boolean(),
      outstandingAmount: t.Boolean(),
      allocatedAmount: t.Boolean(),
      exchangeRate: t.Boolean(),
      exchangeGainLossJeId: t.Boolean(),
      exchangeGainLoss: t.Boolean(),
      paymentTermId: t.Boolean(),
      accountId: t.Boolean(),
      paymentEntry: t.Boolean(),
      paymentTerm: t.Boolean(),
      account: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const PaymentEntryReferenceInclude = t.Partial(
  t.Object(
    {
      paymentEntry: t.Boolean(),
      paymentTerm: t.Boolean(),
      account: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const PaymentEntryReferenceOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clinicId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      paymentEntryId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      idx: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      referenceDoctype: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      referenceId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      dueDate: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      billNo: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      totalAmount: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      outstandingAmount: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      allocatedAmount: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      exchangeRate: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      exchangeGainLossJeId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      exchangeGainLoss: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      paymentTermId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      accountId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const PaymentEntryReference = t.Composite(
  [PaymentEntryReferencePlain, PaymentEntryReferenceRelations],
  { additionalProperties: false },
);

export const PaymentEntryReferenceInputCreate = t.Composite(
  [
    PaymentEntryReferencePlainInputCreate,
    PaymentEntryReferenceRelationsInputCreate,
  ],
  { additionalProperties: false },
);

export const PaymentEntryReferenceInputUpdate = t.Composite(
  [
    PaymentEntryReferencePlainInputUpdate,
    PaymentEntryReferenceRelationsInputUpdate,
  ],
  { additionalProperties: false },
);
