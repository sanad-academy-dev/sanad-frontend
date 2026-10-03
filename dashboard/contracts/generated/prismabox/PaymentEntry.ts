import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const PaymentEntryPlain = t.Object(
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
      [t.Literal("RECEIVE"), t.Literal("PAY"), t.Literal("INTERNAL_TRANSFER")],
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
);

export const PaymentEntryRelations = t.Object(
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
    amendedFrom: __nullable__(
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
    ),
    amendments: t.Array(
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
    modeOfPayment: __nullable__(
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
          defaultAccountId: __nullable__(t.String()),
          createdById: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    ),
    paidFrom: t.Object(
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
    paidTo: t.Object(
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
    references: t.Array(
      t.Object(
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
      ),
      { additionalProperties: false },
    ),
    deductions: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          paymentEntryId: t.String(),
          idx: t.Integer(),
          accountId: t.String(),
          costCenterId: t.String(),
          amount: t.Number(),
          isExchangeGainLoss: t.Boolean(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const PaymentEntryPlainInputCreate = t.Object(
  {
    documentNo: t.Optional(__nullable__(t.String())),
    docstatus: t.Optional(
      t.Union(
        [t.Literal("DRAFT"), t.Literal("SUBMITTED"), t.Literal("CANCELLED")],
        { additionalProperties: false },
      ),
    ),
    status: t.Optional(
      t.Union(
        [t.Literal("DRAFT"), t.Literal("SUBMITTED"), t.Literal("CANCELLED")],
        { additionalProperties: false },
      ),
    ),
    paymentType: t.Union(
      [t.Literal("RECEIVE"), t.Literal("PAY"), t.Literal("INTERNAL_TRANSFER")],
      { additionalProperties: false },
    ),
    postingDate: t.Date(),
    partyType: t.Optional(__nullable__(t.String())),
    paidFromAccountCurrencyCode: t.Optional(__nullable__(t.String())),
    paidToAccountCurrencyCode: t.Optional(__nullable__(t.String())),
    paidAmount: t.Optional(t.Number()),
    sourceExchangeRate: t.Optional(t.Number()),
    basePaidAmount: t.Optional(t.Number()),
    receivedAmount: t.Optional(t.Number()),
    targetExchangeRate: t.Optional(t.Number()),
    baseReceivedAmount: t.Optional(t.Number()),
    totalAllocatedAmount: t.Optional(t.Number()),
    unallocatedAmount: t.Optional(t.Number()),
    differenceAmount: t.Optional(t.Number()),
    referenceNo: t.Optional(__nullable__(t.String())),
    referenceDate: t.Optional(__nullable__(t.Date())),
    clearanceDate: t.Optional(__nullable__(t.Date())),
    isOpening: t.Optional(t.Boolean()),
    bookAdvanceInSeparateAccount: t.Optional(
      t.Boolean({
        description: `[P12.6] FR-11.3 — snapshot of \`book_advance_payments_in_separate_party_account\` taken
when the draft was created. Snapshotted, not read live: a flag toggled between draft
and submit would post the advance somewhere other than where the operator was told,
and the document must record the regime it was written under.`,
      }),
    ),
    dim1: t.Optional(__nullable__(t.String())),
    dim2: t.Optional(__nullable__(t.String())),
    dim3: t.Optional(__nullable__(t.String())),
    dim4: t.Optional(__nullable__(t.String())),
    inWords: t.Optional(__nullable__(t.String())),
    remarks: t.Optional(__nullable__(t.String())),
    submittedAt: t.Optional(__nullable__(t.Date())),
    cancelledAt: t.Optional(__nullable__(t.Date())),
  },
  { additionalProperties: false },
);

export const PaymentEntryPlainInputUpdate = t.Object(
  {
    documentNo: t.Optional(__nullable__(t.String())),
    docstatus: t.Optional(
      t.Union(
        [t.Literal("DRAFT"), t.Literal("SUBMITTED"), t.Literal("CANCELLED")],
        { additionalProperties: false },
      ),
    ),
    status: t.Optional(
      t.Union(
        [t.Literal("DRAFT"), t.Literal("SUBMITTED"), t.Literal("CANCELLED")],
        { additionalProperties: false },
      ),
    ),
    paymentType: t.Optional(
      t.Union(
        [
          t.Literal("RECEIVE"),
          t.Literal("PAY"),
          t.Literal("INTERNAL_TRANSFER"),
        ],
        { additionalProperties: false },
      ),
    ),
    postingDate: t.Optional(t.Date()),
    partyType: t.Optional(__nullable__(t.String())),
    paidFromAccountCurrencyCode: t.Optional(__nullable__(t.String())),
    paidToAccountCurrencyCode: t.Optional(__nullable__(t.String())),
    paidAmount: t.Optional(t.Number()),
    sourceExchangeRate: t.Optional(t.Number()),
    basePaidAmount: t.Optional(t.Number()),
    receivedAmount: t.Optional(t.Number()),
    targetExchangeRate: t.Optional(t.Number()),
    baseReceivedAmount: t.Optional(t.Number()),
    totalAllocatedAmount: t.Optional(t.Number()),
    unallocatedAmount: t.Optional(t.Number()),
    differenceAmount: t.Optional(t.Number()),
    referenceNo: t.Optional(__nullable__(t.String())),
    referenceDate: t.Optional(__nullable__(t.Date())),
    clearanceDate: t.Optional(__nullable__(t.Date())),
    isOpening: t.Optional(t.Boolean()),
    bookAdvanceInSeparateAccount: t.Optional(
      t.Boolean({
        description: `[P12.6] FR-11.3 — snapshot of \`book_advance_payments_in_separate_party_account\` taken
when the draft was created. Snapshotted, not read live: a flag toggled between draft
and submit would post the advance somewhere other than where the operator was told,
and the document must record the regime it was written under.`,
      }),
    ),
    dim1: t.Optional(__nullable__(t.String())),
    dim2: t.Optional(__nullable__(t.String())),
    dim3: t.Optional(__nullable__(t.String())),
    dim4: t.Optional(__nullable__(t.String())),
    inWords: t.Optional(__nullable__(t.String())),
    remarks: t.Optional(__nullable__(t.String())),
    submittedAt: t.Optional(__nullable__(t.Date())),
    cancelledAt: t.Optional(__nullable__(t.Date())),
  },
  { additionalProperties: false },
);

export const PaymentEntryRelationsInputCreate = t.Object(
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
    amendedFrom: t.Optional(
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
    amendments: t.Optional(
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
    modeOfPayment: t.Optional(
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
    paidFrom: t.Object(
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
    paidTo: t.Object(
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
    references: t.Optional(
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
    deductions: t.Optional(
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

export const PaymentEntryRelationsInputUpdate = t.Partial(
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
      amendedFrom: t.Partial(
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
      amendments: t.Partial(
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
      modeOfPayment: t.Partial(
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
      paidFrom: t.Object(
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
      paidTo: t.Object(
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
      references: t.Partial(
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
      deductions: t.Partial(
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

export const PaymentEntryWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          clinicId: t.String(),
          documentNo: t.String(),
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
          amendedFromId: t.String(),
          paymentType: t.Union(
            [
              t.Literal("RECEIVE"),
              t.Literal("PAY"),
              t.Literal("INTERNAL_TRANSFER"),
            ],
            { additionalProperties: false },
          ),
          postingDate: t.Date(),
          partyType: t.String(),
          partyId: t.String(),
          modeOfPaymentId: t.String(),
          paidFromId: t.String(),
          paidFromAccountCurrencyCode: t.String(),
          paidToId: t.String(),
          paidToAccountCurrencyCode: t.String(),
          paidAmount: t.Number(),
          sourceExchangeRate: t.Number(),
          basePaidAmount: t.Number(),
          receivedAmount: t.Number(),
          targetExchangeRate: t.Number(),
          baseReceivedAmount: t.Number(),
          totalAllocatedAmount: t.Number(),
          unallocatedAmount: t.Number(),
          differenceAmount: t.Number(),
          referenceNo: t.String(),
          referenceDate: t.Date(),
          clearanceDate: t.Date(),
          isOpening: t.Boolean(),
          bookAdvanceInSeparateAccount: t.Boolean({
            description: `[P12.6] FR-11.3 — snapshot of \`book_advance_payments_in_separate_party_account\` taken
when the draft was created. Snapshotted, not read live: a flag toggled between draft
and submit would post the advance somewhere other than where the operator was told,
and the document must record the regime it was written under.`,
          }),
          costCenterId: t.String(),
          projectId: t.String(),
          dim1: t.String(),
          dim2: t.String(),
          dim3: t.String(),
          dim4: t.String(),
          inWords: t.String(),
          remarks: t.String(),
          createdById: t.String(),
          submittedAt: t.Date(),
          submittedById: t.String(),
          cancelledAt: t.Date(),
          cancelledById: t.String(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "PaymentEntry" },
  ),
);

export const PaymentEntryWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            {
              id: t.String(),
              clinicId_documentNo: t.Object(
                { clinicId: t.String(), documentNo: t.String() },
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
              clinicId_documentNo: t.Object(
                { clinicId: t.String(), documentNo: t.String() },
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
              documentNo: t.String(),
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
              amendedFromId: t.String(),
              paymentType: t.Union(
                [
                  t.Literal("RECEIVE"),
                  t.Literal("PAY"),
                  t.Literal("INTERNAL_TRANSFER"),
                ],
                { additionalProperties: false },
              ),
              postingDate: t.Date(),
              partyType: t.String(),
              partyId: t.String(),
              modeOfPaymentId: t.String(),
              paidFromId: t.String(),
              paidFromAccountCurrencyCode: t.String(),
              paidToId: t.String(),
              paidToAccountCurrencyCode: t.String(),
              paidAmount: t.Number(),
              sourceExchangeRate: t.Number(),
              basePaidAmount: t.Number(),
              receivedAmount: t.Number(),
              targetExchangeRate: t.Number(),
              baseReceivedAmount: t.Number(),
              totalAllocatedAmount: t.Number(),
              unallocatedAmount: t.Number(),
              differenceAmount: t.Number(),
              referenceNo: t.String(),
              referenceDate: t.Date(),
              clearanceDate: t.Date(),
              isOpening: t.Boolean(),
              bookAdvanceInSeparateAccount: t.Boolean({
                description: `[P12.6] FR-11.3 — snapshot of \`book_advance_payments_in_separate_party_account\` taken
when the draft was created. Snapshotted, not read live: a flag toggled between draft
and submit would post the advance somewhere other than where the operator was told,
and the document must record the regime it was written under.`,
              }),
              costCenterId: t.String(),
              projectId: t.String(),
              dim1: t.String(),
              dim2: t.String(),
              dim3: t.String(),
              dim4: t.String(),
              inWords: t.String(),
              remarks: t.String(),
              createdById: t.String(),
              submittedAt: t.Date(),
              submittedById: t.String(),
              cancelledAt: t.Date(),
              cancelledById: t.String(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "PaymentEntry" },
);

export const PaymentEntrySelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      clinicId: t.Boolean(),
      documentNo: t.Boolean(),
      docstatus: t.Boolean(),
      status: t.Boolean(),
      amendedFromId: t.Boolean(),
      paymentType: t.Boolean(),
      postingDate: t.Boolean(),
      partyType: t.Boolean(),
      partyId: t.Boolean(),
      modeOfPaymentId: t.Boolean(),
      paidFromId: t.Boolean(),
      paidFromAccountCurrencyCode: t.Boolean(),
      paidToId: t.Boolean(),
      paidToAccountCurrencyCode: t.Boolean(),
      paidAmount: t.Boolean(),
      sourceExchangeRate: t.Boolean(),
      basePaidAmount: t.Boolean(),
      receivedAmount: t.Boolean(),
      targetExchangeRate: t.Boolean(),
      baseReceivedAmount: t.Boolean(),
      totalAllocatedAmount: t.Boolean(),
      unallocatedAmount: t.Boolean(),
      differenceAmount: t.Boolean(),
      referenceNo: t.Boolean(),
      referenceDate: t.Boolean(),
      clearanceDate: t.Boolean(),
      isOpening: t.Boolean(),
      bookAdvanceInSeparateAccount: t.Boolean(),
      costCenterId: t.Boolean(),
      projectId: t.Boolean(),
      dim1: t.Boolean(),
      dim2: t.Boolean(),
      dim3: t.Boolean(),
      dim4: t.Boolean(),
      inWords: t.Boolean(),
      remarks: t.Boolean(),
      createdById: t.Boolean(),
      submittedAt: t.Boolean(),
      submittedById: t.Boolean(),
      cancelledAt: t.Boolean(),
      cancelledById: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinic: t.Boolean(),
      amendedFrom: t.Boolean(),
      amendments: t.Boolean(),
      modeOfPayment: t.Boolean(),
      paidFrom: t.Boolean(),
      paidTo: t.Boolean(),
      costCenter: t.Boolean(),
      references: t.Boolean(),
      deductions: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const PaymentEntryInclude = t.Partial(
  t.Object(
    {
      docstatus: t.Boolean(),
      status: t.Boolean(),
      paymentType: t.Boolean(),
      clinic: t.Boolean(),
      amendedFrom: t.Boolean(),
      amendments: t.Boolean(),
      modeOfPayment: t.Boolean(),
      paidFrom: t.Boolean(),
      paidTo: t.Boolean(),
      costCenter: t.Boolean(),
      references: t.Boolean(),
      deductions: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const PaymentEntryOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clinicId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      documentNo: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      amendedFromId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      postingDate: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      partyType: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      partyId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      modeOfPaymentId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      paidFromId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      paidFromAccountCurrencyCode: t.Union(
        [t.Literal("asc"), t.Literal("desc")],
        { additionalProperties: false },
      ),
      paidToId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      paidToAccountCurrencyCode: t.Union(
        [t.Literal("asc"), t.Literal("desc")],
        { additionalProperties: false },
      ),
      paidAmount: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      sourceExchangeRate: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      basePaidAmount: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      receivedAmount: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      targetExchangeRate: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      baseReceivedAmount: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      totalAllocatedAmount: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      unallocatedAmount: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      differenceAmount: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      referenceNo: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      referenceDate: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clearanceDate: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      isOpening: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      bookAdvanceInSeparateAccount: t.Union(
        [t.Literal("asc"), t.Literal("desc")],
        { additionalProperties: false },
      ),
      costCenterId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      projectId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      dim1: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      dim2: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      dim3: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      dim4: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      inWords: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      remarks: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdById: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      submittedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      submittedById: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      cancelledAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      cancelledById: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const PaymentEntry = t.Composite(
  [PaymentEntryPlain, PaymentEntryRelations],
  { additionalProperties: false },
);

export const PaymentEntryInputCreate = t.Composite(
  [PaymentEntryPlainInputCreate, PaymentEntryRelationsInputCreate],
  { additionalProperties: false },
);

export const PaymentEntryInputUpdate = t.Composite(
  [PaymentEntryPlainInputUpdate, PaymentEntryRelationsInputUpdate],
  { additionalProperties: false },
);
