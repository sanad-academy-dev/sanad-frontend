import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const SaleTaxPlain = t.Object(
  {
    id: t.String(),
    saleId: t.String(),
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

export const SaleTaxRelations = t.Object(
  {
    sale: t.Object(
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

export const SaleTaxPlainInputCreate = t.Object(
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

export const SaleTaxPlainInputUpdate = t.Object(
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

export const SaleTaxRelationsInputCreate = t.Object(
  {
    sale: t.Object(
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

export const SaleTaxRelationsInputUpdate = t.Partial(
  t.Object(
    {
      sale: t.Object(
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

export const SaleTaxWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          saleId: t.String(),
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
    { $id: "SaleTax" },
  ),
);

export const SaleTaxWhereUnique = t.Recursive(
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
              saleId: t.String(),
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
  { $id: "SaleTax" },
);

export const SaleTaxSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      saleId: t.Boolean(),
      idx: t.Boolean(),
      chargeType: t.Boolean(),
      accountHeadId: t.Boolean(),
      rate: t.Boolean(),
      taxAmount: t.Boolean(),
      total: t.Boolean(),
      rowId: t.Boolean(),
      description: t.Boolean(),
      includedInPrintRate: t.Boolean(),
      sale: t.Boolean(),
      accountHead: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const SaleTaxInclude = t.Partial(
  t.Object(
    {
      chargeType: t.Boolean(),
      sale: t.Boolean(),
      accountHead: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const SaleTaxOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      saleId: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const SaleTax = t.Composite([SaleTaxPlain, SaleTaxRelations], {
  additionalProperties: false,
});

export const SaleTaxInputCreate = t.Composite(
  [SaleTaxPlainInputCreate, SaleTaxRelationsInputCreate],
  { additionalProperties: false },
);

export const SaleTaxInputUpdate = t.Composite(
  [SaleTaxPlainInputUpdate, SaleTaxRelationsInputUpdate],
  { additionalProperties: false },
);
