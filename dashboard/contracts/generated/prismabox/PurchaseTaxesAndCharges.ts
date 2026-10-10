import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const PurchaseTaxesAndChargesPlain = t.Object(
  {
    id: t.String(),
    templateId: t.String(),
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
    rowId: __nullable__(t.Integer()),
    description: t.String(),
    includedInPrintRate: t.Boolean(),
    costCenterId: __nullable__(t.String()),
    category: t.Union(
      [
        t.Literal("TOTAL"),
        t.Literal("VALUATION"),
        t.Literal("VALUATION_AND_TOTAL"),
      ],
      { additionalProperties: false },
    ),
    addDeductTax: t.Union([t.Literal("ADD"), t.Literal("DEDUCT")], {
      additionalProperties: false,
    }),
  },
  { additionalProperties: false },
);

export const PurchaseTaxesAndChargesRelations = t.Object(
  {
    template: t.Object(
      {
        id: t.String(),
        clinicId: t.String(),
        title: t.String(),
        isDefault: t.Boolean(),
        disabled: t.Boolean(),
        taxCategoryId: __nullable__(t.String()),
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
    costCenter: __nullable__(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          costCenterName: t.String(),
          costCenterNumber: __nullable__(t.String()),
          parentCostCenterId: __nullable__(t.String()),
          isGroup: t.Boolean(),
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

export const PurchaseTaxesAndChargesPlainInputCreate = t.Object(
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
    description: t.String(),
    includedInPrintRate: t.Optional(t.Boolean()),
    category: t.Optional(
      t.Union(
        [
          t.Literal("TOTAL"),
          t.Literal("VALUATION"),
          t.Literal("VALUATION_AND_TOTAL"),
        ],
        { additionalProperties: false },
      ),
    ),
    addDeductTax: t.Optional(
      t.Union([t.Literal("ADD"), t.Literal("DEDUCT")], {
        additionalProperties: false,
      }),
    ),
  },
  { additionalProperties: false },
);

export const PurchaseTaxesAndChargesPlainInputUpdate = t.Object(
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
    description: t.Optional(t.String()),
    includedInPrintRate: t.Optional(t.Boolean()),
    category: t.Optional(
      t.Union(
        [
          t.Literal("TOTAL"),
          t.Literal("VALUATION"),
          t.Literal("VALUATION_AND_TOTAL"),
        ],
        { additionalProperties: false },
      ),
    ),
    addDeductTax: t.Optional(
      t.Union([t.Literal("ADD"), t.Literal("DEDUCT")], {
        additionalProperties: false,
      }),
    ),
  },
  { additionalProperties: false },
);

export const PurchaseTaxesAndChargesRelationsInputCreate = t.Object(
  {
    template: t.Object(
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
    costCenter: t.Optional(
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

export const PurchaseTaxesAndChargesRelationsInputUpdate = t.Partial(
  t.Object(
    {
      template: t.Object(
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
      costCenter: t.Partial(
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

export const PurchaseTaxesAndChargesWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          templateId: t.String(),
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
          rowId: t.Integer(),
          description: t.String(),
          includedInPrintRate: t.Boolean(),
          costCenterId: t.String(),
          category: t.Union(
            [
              t.Literal("TOTAL"),
              t.Literal("VALUATION"),
              t.Literal("VALUATION_AND_TOTAL"),
            ],
            { additionalProperties: false },
          ),
          addDeductTax: t.Union([t.Literal("ADD"), t.Literal("DEDUCT")], {
            additionalProperties: false,
          }),
        },
        { additionalProperties: false },
      ),
    { $id: "PurchaseTaxesAndCharges" },
  ),
);

export const PurchaseTaxesAndChargesWhereUnique = t.Recursive(
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
              templateId: t.String(),
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
              rowId: t.Integer(),
              description: t.String(),
              includedInPrintRate: t.Boolean(),
              costCenterId: t.String(),
              category: t.Union(
                [
                  t.Literal("TOTAL"),
                  t.Literal("VALUATION"),
                  t.Literal("VALUATION_AND_TOTAL"),
                ],
                { additionalProperties: false },
              ),
              addDeductTax: t.Union([t.Literal("ADD"), t.Literal("DEDUCT")], {
                additionalProperties: false,
              }),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "PurchaseTaxesAndCharges" },
);

export const PurchaseTaxesAndChargesSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      templateId: t.Boolean(),
      idx: t.Boolean(),
      chargeType: t.Boolean(),
      accountHeadId: t.Boolean(),
      rate: t.Boolean(),
      taxAmount: t.Boolean(),
      rowId: t.Boolean(),
      description: t.Boolean(),
      includedInPrintRate: t.Boolean(),
      costCenterId: t.Boolean(),
      category: t.Boolean(),
      addDeductTax: t.Boolean(),
      template: t.Boolean(),
      accountHead: t.Boolean(),
      costCenter: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const PurchaseTaxesAndChargesInclude = t.Partial(
  t.Object(
    {
      chargeType: t.Boolean(),
      category: t.Boolean(),
      addDeductTax: t.Boolean(),
      template: t.Boolean(),
      accountHead: t.Boolean(),
      costCenter: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const PurchaseTaxesAndChargesOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      templateId: t.Union([t.Literal("asc"), t.Literal("desc")], {
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
      rowId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      description: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      includedInPrintRate: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      costCenterId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const PurchaseTaxesAndCharges = t.Composite(
  [PurchaseTaxesAndChargesPlain, PurchaseTaxesAndChargesRelations],
  { additionalProperties: false },
);

export const PurchaseTaxesAndChargesInputCreate = t.Composite(
  [
    PurchaseTaxesAndChargesPlainInputCreate,
    PurchaseTaxesAndChargesRelationsInputCreate,
  ],
  { additionalProperties: false },
);

export const PurchaseTaxesAndChargesInputUpdate = t.Composite(
  [
    PurchaseTaxesAndChargesPlainInputUpdate,
    PurchaseTaxesAndChargesRelationsInputUpdate,
  ],
  { additionalProperties: false },
);
