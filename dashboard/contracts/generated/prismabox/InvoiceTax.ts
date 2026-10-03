import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const InvoiceTaxPlain = t.Object(
  {
    id: t.String(),
    invoiceId: t.String(),
    idx: t.Integer(),
    chargeType: t.Union(
      [
        t.Literal("ACTUAL"),
        t.Literal("ON_NET_TOTAL"),
        t.Literal("ON_PREVIOUS_ROW_AMOUNT"),
        t.Literal("ON_PREVIOUS_ROW_TOTAL"),
        t.Literal("ON_ITEM_QUANTITY"),
      ],
      { additionalProperties: false },
    ),
    accountHeadId: t.String(),
    rate: t.Number(),
    taxAmount: t.Number(),
    total: t.Number(),
    rowId: __nullable__(t.Integer()),
    description: t.String(),
    includedInPrintRate: t.Boolean(),
  },
  { additionalProperties: false },
);

export const InvoiceTaxRelations = t.Object(
  {
    invoice: t.Object(
      {
        id: t.String(),
        code: t.String(),
        clinicId: t.String(),
        appointmentId: __nullable__(t.String()),
        labOrderId: __nullable__(t.String()),
        radiologyOrderId: __nullable__(t.String()),
        operationId: __nullable__(t.String()),
        groomingSessionId: __nullable__(t.String()),
        inpatientStayId: __nullable__(t.String()),
        subtotal: t.Number(),
        vatRate: t.Number(),
        vatAmount: t.Number(),
        taxTemplateId: __nullable__(t.String()),
        discount: t.Number(),
        total: t.Number(),
        amountPaid: t.Number(),
        currencyCode: t.String(),
        membershipId: __nullable__(t.String()),
        insurerShare: __nullable__(t.Number()),
        copayShare: __nullable__(t.Number()),
        status: t.Union(
          [
            t.Literal("PENDING"),
            t.Literal("PARTIAL"),
            t.Literal("PAID"),
            t.Literal("VOIDED"),
            t.Literal("REFUNDED"),
          ],
          { additionalProperties: false },
        ),
        paymentMethod: __nullable__(
          t.Union(
            [t.Literal("CASH"), t.Literal("CARD"), t.Literal("TRANSFER")],
            { additionalProperties: false },
          ),
        ),
        paidAt: __nullable__(t.Date()),
        refundedAt: __nullable__(t.Date()),
        refundReason: __nullable__(t.String()),
        refundedById: __nullable__(t.String()),
        stripePaymentIntentId: __nullable__(t.String()),
        createdAt: t.Date(),
        updatedAt: t.Date(),
      },
      { additionalProperties: false },
    ),
    accountHead: t.Object(
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
  },
  { additionalProperties: false },
);

export const InvoiceTaxPlainInputCreate = t.Object(
  {
    idx: t.Integer(),
    chargeType: t.Optional(
      t.Union(
        [
          t.Literal("ACTUAL"),
          t.Literal("ON_NET_TOTAL"),
          t.Literal("ON_PREVIOUS_ROW_AMOUNT"),
          t.Literal("ON_PREVIOUS_ROW_TOTAL"),
          t.Literal("ON_ITEM_QUANTITY"),
        ],
        { additionalProperties: false },
      ),
    ),
    rate: t.Optional(t.Number()),
    taxAmount: t.Optional(t.Number()),
    total: t.Optional(t.Number()),
    description: t.String(),
    includedInPrintRate: t.Optional(t.Boolean()),
  },
  { additionalProperties: false },
);

export const InvoiceTaxPlainInputUpdate = t.Object(
  {
    idx: t.Optional(t.Integer()),
    chargeType: t.Optional(
      t.Union(
        [
          t.Literal("ACTUAL"),
          t.Literal("ON_NET_TOTAL"),
          t.Literal("ON_PREVIOUS_ROW_AMOUNT"),
          t.Literal("ON_PREVIOUS_ROW_TOTAL"),
          t.Literal("ON_ITEM_QUANTITY"),
        ],
        { additionalProperties: false },
      ),
    ),
    rate: t.Optional(t.Number()),
    taxAmount: t.Optional(t.Number()),
    total: t.Optional(t.Number()),
    description: t.Optional(t.String()),
    includedInPrintRate: t.Optional(t.Boolean()),
  },
  { additionalProperties: false },
);

export const InvoiceTaxRelationsInputCreate = t.Object(
  {
    invoice: t.Object(
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
    accountHead: t.Object(
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

export const InvoiceTaxRelationsInputUpdate = t.Partial(
  t.Object(
    {
      invoice: t.Object(
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
      accountHead: t.Object(
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

export const InvoiceTaxWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          invoiceId: t.String(),
          idx: t.Integer(),
          chargeType: t.Union(
            [
              t.Literal("ACTUAL"),
              t.Literal("ON_NET_TOTAL"),
              t.Literal("ON_PREVIOUS_ROW_AMOUNT"),
              t.Literal("ON_PREVIOUS_ROW_TOTAL"),
              t.Literal("ON_ITEM_QUANTITY"),
            ],
            { additionalProperties: false },
          ),
          accountHeadId: t.String(),
          rate: t.Number(),
          taxAmount: t.Number(),
          total: t.Number(),
          rowId: t.Integer(),
          description: t.String(),
          includedInPrintRate: t.Boolean(),
        },
        { additionalProperties: false },
      ),
    { $id: "InvoiceTax" },
  ),
);

export const InvoiceTaxWhereUnique = t.Recursive(
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
              invoiceId: t.String(),
              idx: t.Integer(),
              chargeType: t.Union(
                [
                  t.Literal("ACTUAL"),
                  t.Literal("ON_NET_TOTAL"),
                  t.Literal("ON_PREVIOUS_ROW_AMOUNT"),
                  t.Literal("ON_PREVIOUS_ROW_TOTAL"),
                  t.Literal("ON_ITEM_QUANTITY"),
                ],
                { additionalProperties: false },
              ),
              accountHeadId: t.String(),
              rate: t.Number(),
              taxAmount: t.Number(),
              total: t.Number(),
              rowId: t.Integer(),
              description: t.String(),
              includedInPrintRate: t.Boolean(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "InvoiceTax" },
);

export const InvoiceTaxSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      invoiceId: t.Boolean(),
      idx: t.Boolean(),
      chargeType: t.Boolean(),
      accountHeadId: t.Boolean(),
      rate: t.Boolean(),
      taxAmount: t.Boolean(),
      total: t.Boolean(),
      rowId: t.Boolean(),
      description: t.Boolean(),
      includedInPrintRate: t.Boolean(),
      invoice: t.Boolean(),
      accountHead: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const InvoiceTaxInclude = t.Partial(
  t.Object(
    {
      chargeType: t.Boolean(),
      invoice: t.Boolean(),
      accountHead: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const InvoiceTaxOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      invoiceId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      idx: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      accountHeadId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      rate: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      taxAmount: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      total: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      rowId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      description: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      includedInPrintRate: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const InvoiceTax = t.Composite([InvoiceTaxPlain, InvoiceTaxRelations], {
  additionalProperties: false,
});

export const InvoiceTaxInputCreate = t.Composite(
  [InvoiceTaxPlainInputCreate, InvoiceTaxRelationsInputCreate],
  { additionalProperties: false },
);

export const InvoiceTaxInputUpdate = t.Composite(
  [InvoiceTaxPlainInputUpdate, InvoiceTaxRelationsInputUpdate],
  { additionalProperties: false },
);
