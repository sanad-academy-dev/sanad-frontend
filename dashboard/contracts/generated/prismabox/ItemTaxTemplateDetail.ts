import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const ItemTaxTemplateDetailPlain = t.Object(
  {
    id: t.String(),
    templateId: t.String(),
    taxTypeAccountId: t.String(),
    taxRate: t.Number(),
  },
  { additionalProperties: false },
);

export const ItemTaxTemplateDetailRelations = t.Object(
  {
    template: t.Object(
      {
        id: t.String(),
        clinicId: t.String(),
        title: t.String(),
        disabled: t.Boolean(),
        createdAt: t.Date(),
        updatedAt: t.Date(),
      },
      { additionalProperties: false },
    ),
    taxType: t.Object(
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

export const ItemTaxTemplateDetailPlainInputCreate = t.Object(
  { taxRate: t.Optional(t.Number()) },
  { additionalProperties: false },
);

export const ItemTaxTemplateDetailPlainInputUpdate = t.Object(
  { taxRate: t.Optional(t.Number()) },
  { additionalProperties: false },
);

export const ItemTaxTemplateDetailRelationsInputCreate = t.Object(
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
    taxType: t.Object(
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

export const ItemTaxTemplateDetailRelationsInputUpdate = t.Partial(
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
      taxType: t.Object(
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

export const ItemTaxTemplateDetailWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          templateId: t.String(),
          taxTypeAccountId: t.String(),
          taxRate: t.Number(),
        },
        { additionalProperties: false },
      ),
    { $id: "ItemTaxTemplateDetail" },
  ),
);

export const ItemTaxTemplateDetailWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            {
              id: t.String(),
              templateId_taxTypeAccountId: t.Object(
                { templateId: t.String(), taxTypeAccountId: t.String() },
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
              templateId_taxTypeAccountId: t.Object(
                { templateId: t.String(), taxTypeAccountId: t.String() },
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
              templateId: t.String(),
              taxTypeAccountId: t.String(),
              taxRate: t.Number(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "ItemTaxTemplateDetail" },
);

export const ItemTaxTemplateDetailSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      templateId: t.Boolean(),
      taxTypeAccountId: t.Boolean(),
      taxRate: t.Boolean(),
      template: t.Boolean(),
      taxType: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const ItemTaxTemplateDetailInclude = t.Partial(
  t.Object(
    { template: t.Boolean(), taxType: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const ItemTaxTemplateDetailOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      templateId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      taxTypeAccountId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      taxRate: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const ItemTaxTemplateDetail = t.Composite(
  [ItemTaxTemplateDetailPlain, ItemTaxTemplateDetailRelations],
  { additionalProperties: false },
);

export const ItemTaxTemplateDetailInputCreate = t.Composite(
  [
    ItemTaxTemplateDetailPlainInputCreate,
    ItemTaxTemplateDetailRelationsInputCreate,
  ],
  { additionalProperties: false },
);

export const ItemTaxTemplateDetailInputUpdate = t.Composite(
  [
    ItemTaxTemplateDetailPlainInputUpdate,
    ItemTaxTemplateDetailRelationsInputUpdate,
  ],
  { additionalProperties: false },
);
