import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const ModeOfPaymentPlain = t.Object(
  {
    id: t.String(),
    clinicId: t.String(),
    modeOfPaymentName: t.String(),
    type: t.Union(
      [
        t.Literal("CASH"),
        t.Literal("BANK"),
        t.Literal("GENERAL"),
        t.Literal("PHONE"),
      ],
      { additionalProperties: false },
    ),
    enabled: t.Boolean(),
    defaultAccountId: __nullable__(t.String()),
    createdById: __nullable__(t.String()),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  },
  { additionalProperties: false },
);

export const ModeOfPaymentRelations = t.Object(
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
    defaultAccount: __nullable__(
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
    paymentTerms: t.Array(
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
      { additionalProperties: false },
    ),
    paymentScheduleRows: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          parentType: t.String(),
          parentId: t.String(),
          idx: t.Integer(),
          paymentTermId: __nullable__(t.String()),
          description: __nullable__(t.String()),
          dueDate: t.Date(),
          invoicePortion: t.Number(),
          paymentAmount: t.Number(),
          outstanding: t.Number(),
          discountType: __nullable__(
            t.Union([t.Literal("PERCENTAGE"), t.Literal("AMOUNT")], {
              additionalProperties: false,
            }),
          ),
          discount: t.Number(),
          discountDate: __nullable__(t.Date()),
          modeOfPaymentId: __nullable__(t.String()),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    salesInvoicePayments: t.Array(
      t.Object(
        {
          id: t.String(),
          salesInvoiceId: t.String(),
          idx: t.Integer(),
          modeOfPaymentId: t.String(),
          amount: t.Number(),
          accountId: __nullable__(t.String()),
          isDefault: t.Boolean(),
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
    paymentEntries: t.Array(
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
              t.Literal("CANCELLED"),
            ],
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
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const ModeOfPaymentPlainInputCreate = t.Object(
  {
    modeOfPaymentName: t.String(),
    type: t.Optional(
      t.Union(
        [
          t.Literal("CASH"),
          t.Literal("BANK"),
          t.Literal("GENERAL"),
          t.Literal("PHONE"),
        ],
        { additionalProperties: false },
      ),
    ),
    enabled: t.Optional(t.Boolean()),
  },
  { additionalProperties: false },
);

export const ModeOfPaymentPlainInputUpdate = t.Object(
  {
    modeOfPaymentName: t.Optional(t.String()),
    type: t.Optional(
      t.Union(
        [
          t.Literal("CASH"),
          t.Literal("BANK"),
          t.Literal("GENERAL"),
          t.Literal("PHONE"),
        ],
        { additionalProperties: false },
      ),
    ),
    enabled: t.Optional(t.Boolean()),
  },
  { additionalProperties: false },
);

export const ModeOfPaymentRelationsInputCreate = t.Object(
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
    defaultAccount: t.Optional(
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
    paymentTerms: t.Optional(
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
    paymentScheduleRows: t.Optional(
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
    salesInvoicePayments: t.Optional(
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
    paymentEntries: t.Optional(
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
  { additionalProperties: false },
);

export const ModeOfPaymentRelationsInputUpdate = t.Partial(
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
      defaultAccount: t.Partial(
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
      paymentTerms: t.Partial(
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
      paymentScheduleRows: t.Partial(
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
      salesInvoicePayments: t.Partial(
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
      paymentEntries: t.Partial(
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
    { additionalProperties: false },
  ),
);

export const ModeOfPaymentWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          clinicId: t.String(),
          modeOfPaymentName: t.String(),
          type: t.Union(
            [
              t.Literal("CASH"),
              t.Literal("BANK"),
              t.Literal("GENERAL"),
              t.Literal("PHONE"),
            ],
            { additionalProperties: false },
          ),
          enabled: t.Boolean(),
          defaultAccountId: t.String(),
          createdById: t.String(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "ModeOfPayment" },
  ),
);

export const ModeOfPaymentWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            {
              id: t.String(),
              clinicId_modeOfPaymentName: t.Object(
                { clinicId: t.String(), modeOfPaymentName: t.String() },
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
              clinicId_modeOfPaymentName: t.Object(
                { clinicId: t.String(), modeOfPaymentName: t.String() },
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
              modeOfPaymentName: t.String(),
              type: t.Union(
                [
                  t.Literal("CASH"),
                  t.Literal("BANK"),
                  t.Literal("GENERAL"),
                  t.Literal("PHONE"),
                ],
                { additionalProperties: false },
              ),
              enabled: t.Boolean(),
              defaultAccountId: t.String(),
              createdById: t.String(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "ModeOfPayment" },
);

export const ModeOfPaymentSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      clinicId: t.Boolean(),
      modeOfPaymentName: t.Boolean(),
      type: t.Boolean(),
      enabled: t.Boolean(),
      defaultAccountId: t.Boolean(),
      createdById: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinic: t.Boolean(),
      defaultAccount: t.Boolean(),
      paymentTerms: t.Boolean(),
      paymentScheduleRows: t.Boolean(),
      salesInvoicePayments: t.Boolean(),
      purchaseInvoices: t.Boolean(),
      paymentEntries: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const ModeOfPaymentInclude = t.Partial(
  t.Object(
    {
      type: t.Boolean(),
      clinic: t.Boolean(),
      defaultAccount: t.Boolean(),
      paymentTerms: t.Boolean(),
      paymentScheduleRows: t.Boolean(),
      salesInvoicePayments: t.Boolean(),
      purchaseInvoices: t.Boolean(),
      paymentEntries: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const ModeOfPaymentOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clinicId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      modeOfPaymentName: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      enabled: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      defaultAccountId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdById: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      updatedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const ModeOfPayment = t.Composite(
  [ModeOfPaymentPlain, ModeOfPaymentRelations],
  { additionalProperties: false },
);

export const ModeOfPaymentInputCreate = t.Composite(
  [ModeOfPaymentPlainInputCreate, ModeOfPaymentRelationsInputCreate],
  { additionalProperties: false },
);

export const ModeOfPaymentInputUpdate = t.Composite(
  [ModeOfPaymentPlainInputUpdate, ModeOfPaymentRelationsInputUpdate],
  { additionalProperties: false },
);
