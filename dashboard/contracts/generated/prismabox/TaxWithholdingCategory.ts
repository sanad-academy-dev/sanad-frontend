import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const TaxWithholdingCategoryPlain = t.Object(
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
);

export const TaxWithholdingCategoryRelations = t.Object(
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
    rates: t.Array(
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
        {
          additionalProperties: false,
          description: `نسبة الفئة في نافذة تاريخية بعتبتيها. النوافذ لا يجوز تداخلها (يُتحقَّق في الخدمة).`,
        },
      ),
      { additionalProperties: false },
    ),
    entries: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          categoryId: t.String(),
          partyType: t.String(),
          partyId: t.String(),
          voucherType: t.String(),
          voucherId: t.String(),
          voucherNo: t.String(),
          postingDate: t.Date(),
          taxableAmount: t.Number({
            description: `المبلغ الذي طُبِّقت عليه النسبة (قد يكون الزائد عن العتبة وحده)`,
          }),
          rate: t.Number(),
          taxAmount: t.Number(),
          certificateNo: __nullable__(
            t.String({
              description: `رقم الشهادة يُدخله المستخدم لاحقًا حين تصدرها الجهة`,
            }),
          ),
          createdById: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `أثر استقطاع فعليّ على مستند — مصدر تقرير الاستقطاع وأساس شهادة الخصم.`,
        },
      ),
      { additionalProperties: false },
    ),
    parties: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          partyType: t.String(),
          partyId: t.String(),
          defaultCurrencyCode: __nullable__(t.String()),
          paymentTermsTemplateId: __nullable__(t.String()),
          isFrozen: t.Boolean(),
          disabled: t.Boolean(),
          isInternal: t.Boolean(),
          representsCompany: __nullable__(t.String()),
          taxWithholdingCategoryId: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    purchaseInvoices: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          documentNo: __nullable__(t.String()),
          docstatus: t.Union(
            [
              t.Literal("DRAFT"),
              t.Literal("SUBMITTED"),
              t.Literal("CANCELLED"),
            ],
            { additionalProperties: false },
          ),
          status: t.Union(
            [
              t.Literal("DRAFT"),
              t.Literal("SUBMITTED"),
              t.Literal("UNPAID"),
              t.Literal("PAID"),
              t.Literal("PARTLY_PAID"),
              t.Literal("OVERDUE"),
              t.Literal("RETURN"),
              t.Literal("DEBIT_NOTE_ISSUED"),
              t.Literal("INTERNAL_TRANSFER"),
              t.Literal("CANCELLED"),
            ],
            { additionalProperties: false },
          ),
          amendedFromId: __nullable__(t.String()),
          postingDate: t.Date(),
          dueDate: __nullable__(t.Date()),
          partyType: t.String(),
          partyId: t.String(),
          currencyCode: t.String(),
          conversionRate: t.Number(),
          creditToId: t.String(),
          partyAccountCurrencyCode: __nullable__(t.String()),
          billNo: __nullable__(t.String()),
          billDate: __nullable__(t.Date()),
          onHold: t.Boolean(),
          releaseDate: __nullable__(t.Date()),
          holdComment: __nullable__(t.String()),
          isPaid: t.Boolean(),
          modeOfPaymentId: __nullable__(t.String()),
          cashBankAccountId: __nullable__(t.String()),
          paidAmount: t.Number(),
          isReturn: t.Boolean(),
          returnAgainstId: __nullable__(t.String()),
          updateOutstandingForSelf: t.Boolean(),
          isOpening: t.Boolean(),
          isInternalSupplier: t.Boolean(),
          unrealizedProfitLossAccountId: __nullable__(t.String()),
          taxesAndChargesTemplateId: __nullable__(t.String()),
          taxCategoryId: __nullable__(t.String()),
          applyTds: t.Boolean(),
          taxWithholdingCategoryId: __nullable__(t.String()),
          taxWithholdingAmount: t.Number(),
          applyDiscountOn: t.Union(
            [t.Literal("GRAND_TOTAL"), t.Literal("NET_TOTAL")],
            { additionalProperties: false },
          ),
          additionalDiscountPercentage: t.Number(),
          discountAmount: t.Number(),
          isCashOrNonTradeDiscount: t.Boolean(),
          additionalDiscountAccountId: __nullable__(t.String()),
          total: t.Number(),
          netTotal: t.Number(),
          totalTaxesAndCharges: t.Number(),
          grandTotal: t.Number(),
          roundingAdjustment: t.Number(),
          roundedTotal: t.Number(),
          disableRoundedTotal: t.Boolean(),
          inWords: __nullable__(t.String()),
          outstandingAmount: t.Number(),
          allocateAdvancesAutomatically: t.Boolean(),
          totalAdvance: t.Number(),
          writeOffAmount: t.Number(),
          writeOffAccountId: __nullable__(t.String()),
          writeOffCostCenterId: __nullable__(t.String()),
          paymentTermsTemplateId: __nullable__(t.String()),
          ignoreDefaultPaymentTermsTemplate: t.Boolean(),
          costCenterId: __nullable__(t.String()),
          projectId: __nullable__(t.String()),
          dim1: __nullable__(t.String()),
          dim2: __nullable__(t.String()),
          dim3: __nullable__(t.String()),
          dim4: __nullable__(t.String()),
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
      { additionalProperties: false },
    ),
  },
  {
    additionalProperties: false,
    description: `فئة استقطاع: نِسَبها بنوافذ تاريخية، وحسابها لكل شركة، وسلوك عتباتها.`,
  },
);

export const TaxWithholdingCategoryPlainInputCreate = t.Object(
  {
    title: t.String(),
    basis: t.Optional(
      t.Union([t.Literal("GROSS"), t.Literal("NET")], {
        additionalProperties: false,
      }),
    ),
    taxOnExcessAmount: t.Optional(
      t.Boolean({
        description: `الضريبة على ما تجاوز العتبة فقط، لا على المبلغ كاملًا`,
      }),
    ),
    roundOffTaxAmount: t.Optional(t.Boolean()),
    disableSingleThreshold: t.Optional(t.Boolean()),
    disableCumulativeThreshold: t.Optional(t.Boolean()),
    disabled: t.Optional(t.Boolean()),
  },
  {
    additionalProperties: false,
    description: `فئة استقطاع: نِسَبها بنوافذ تاريخية، وحسابها لكل شركة، وسلوك عتباتها.`,
  },
);

export const TaxWithholdingCategoryPlainInputUpdate = t.Object(
  {
    title: t.Optional(t.String()),
    basis: t.Optional(
      t.Union([t.Literal("GROSS"), t.Literal("NET")], {
        additionalProperties: false,
      }),
    ),
    taxOnExcessAmount: t.Optional(
      t.Boolean({
        description: `الضريبة على ما تجاوز العتبة فقط، لا على المبلغ كاملًا`,
      }),
    ),
    roundOffTaxAmount: t.Optional(t.Boolean()),
    disableSingleThreshold: t.Optional(t.Boolean()),
    disableCumulativeThreshold: t.Optional(t.Boolean()),
    disabled: t.Optional(t.Boolean()),
  },
  {
    additionalProperties: false,
    description: `فئة استقطاع: نِسَبها بنوافذ تاريخية، وحسابها لكل شركة، وسلوك عتباتها.`,
  },
);

export const TaxWithholdingCategoryRelationsInputCreate = t.Object(
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
    rates: t.Optional(
      t.Object(
        {
          connect: t.Array(
            t.Object(
              {
                id: t.String({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
    ),
    entries: t.Optional(
      t.Object(
        {
          connect: t.Array(
            t.Object(
              {
                id: t.String({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
    ),
    parties: t.Optional(
      t.Object(
        {
          connect: t.Array(
            t.Object(
              {
                id: t.String({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
    ),
    purchaseInvoices: t.Optional(
      t.Object(
        {
          connect: t.Array(
            t.Object(
              {
                id: t.String({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
    ),
  },
  {
    additionalProperties: false,
    description: `فئة استقطاع: نِسَبها بنوافذ تاريخية، وحسابها لكل شركة، وسلوك عتباتها.`,
  },
);

export const TaxWithholdingCategoryRelationsInputUpdate = t.Partial(
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
      rates: t.Partial(
        t.Object(
          {
            connect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
            disconnect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
          },
          { additionalProperties: false },
        ),
      ),
      entries: t.Partial(
        t.Object(
          {
            connect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
            disconnect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
          },
          { additionalProperties: false },
        ),
      ),
      parties: t.Partial(
        t.Object(
          {
            connect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
            disconnect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
          },
          { additionalProperties: false },
        ),
      ),
      purchaseInvoices: t.Partial(
        t.Object(
          {
            connect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
            disconnect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
          },
          { additionalProperties: false },
        ),
      ),
    },
    {
      additionalProperties: false,
      description: `فئة استقطاع: نِسَبها بنوافذ تاريخية، وحسابها لكل شركة، وسلوك عتباتها.`,
    },
  ),
);

export const TaxWithholdingCategoryWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
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
          accountId: t.String({
            description: `حساب الالتزام الذي يُقيَّد عليه المبلغ المستقطَع (دائن على فاتورة الشراء)`,
          }),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `فئة استقطاع: نِسَبها بنوافذ تاريخية، وحسابها لكل شركة، وسلوك عتباتها.`,
        },
      ),
    { $id: "TaxWithholdingCategory" },
  ),
);

export const TaxWithholdingCategoryWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            {
              id: t.String(),
              clinicId_title: t.Object(
                { clinicId: t.String(), title: t.String() },
                { additionalProperties: false },
              ),
            },
            {
              additionalProperties: false,
              description: `فئة استقطاع: نِسَبها بنوافذ تاريخية، وحسابها لكل شركة، وسلوك عتباتها.`,
            },
          ),
          { additionalProperties: false },
        ),
        t.Union(
          [
            t.Object({ id: t.String() }),
            t.Object({
              clinicId_title: t.Object(
                { clinicId: t.String(), title: t.String() },
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
              accountId: t.String({
                description: `حساب الالتزام الذي يُقيَّد عليه المبلغ المستقطَع (دائن على فاتورة الشراء)`,
              }),
              createdAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "TaxWithholdingCategory" },
);

export const TaxWithholdingCategorySelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      clinicId: t.Boolean(),
      title: t.Boolean(),
      basis: t.Boolean(),
      taxOnExcessAmount: t.Boolean(),
      roundOffTaxAmount: t.Boolean(),
      disableSingleThreshold: t.Boolean(),
      disableCumulativeThreshold: t.Boolean(),
      disabled: t.Boolean(),
      accountId: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinic: t.Boolean(),
      account: t.Boolean(),
      rates: t.Boolean(),
      entries: t.Boolean(),
      parties: t.Boolean(),
      purchaseInvoices: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `فئة استقطاع: نِسَبها بنوافذ تاريخية، وحسابها لكل شركة، وسلوك عتباتها.`,
    },
  ),
);

export const TaxWithholdingCategoryInclude = t.Partial(
  t.Object(
    {
      basis: t.Boolean(),
      clinic: t.Boolean(),
      account: t.Boolean(),
      rates: t.Boolean(),
      entries: t.Boolean(),
      parties: t.Boolean(),
      purchaseInvoices: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `فئة استقطاع: نِسَبها بنوافذ تاريخية، وحسابها لكل شركة، وسلوك عتباتها.`,
    },
  ),
);

export const TaxWithholdingCategoryOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clinicId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      title: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      taxOnExcessAmount: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      roundOffTaxAmount: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      disableSingleThreshold: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      disableCumulativeThreshold: t.Union(
        [t.Literal("asc"), t.Literal("desc")],
        { additionalProperties: false },
      ),
      disabled: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      accountId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      updatedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    {
      additionalProperties: false,
      description: `فئة استقطاع: نِسَبها بنوافذ تاريخية، وحسابها لكل شركة، وسلوك عتباتها.`,
    },
  ),
);

export const TaxWithholdingCategory = t.Composite(
  [TaxWithholdingCategoryPlain, TaxWithholdingCategoryRelations],
  { additionalProperties: false },
);

export const TaxWithholdingCategoryInputCreate = t.Composite(
  [
    TaxWithholdingCategoryPlainInputCreate,
    TaxWithholdingCategoryRelationsInputCreate,
  ],
  { additionalProperties: false },
);

export const TaxWithholdingCategoryInputUpdate = t.Composite(
  [
    TaxWithholdingCategoryPlainInputUpdate,
    TaxWithholdingCategoryRelationsInputUpdate,
  ],
  { additionalProperties: false },
);
