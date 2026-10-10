import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const FinanceBookPlain = t.Object(
  {
    id: t.String(),
    clinicId: t.String(),
    financeBookName: t.String(),
    disabled: t.Boolean(),
    createdById: __nullable__(t.String()),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  },
  { additionalProperties: false },
);

export const FinanceBookRelations = t.Object(
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
    glEntries: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          postingDate: t.Date(),
          transactionDate: __nullable__(t.Date()),
          fiscalYear: t.String(),
          accountId: t.String(),
          accountCurrencyCode: t.String(),
          debit: t.Number(),
          credit: t.Number(),
          debitInAccountCurrency: t.Number(),
          creditInAccountCurrency: t.Number(),
          transactionCurrencyCode: __nullable__(t.String()),
          transactionExchangeRate: __nullable__(t.Number()),
          debitInTransactionCurrency: t.Number(),
          creditInTransactionCurrency: t.Number(),
          partyType: __nullable__(t.String()),
          partyId: __nullable__(t.String()),
          against: __nullable__(t.String()),
          voucherType: t.String(),
          voucherSubtype: __nullable__(t.String()),
          voucherId: t.String(),
          voucherNo: t.String(),
          voucherDetailNo: __nullable__(t.String()),
          againstVoucherType: __nullable__(t.String()),
          againstVoucherId: __nullable__(t.String()),
          costCenterId: __nullable__(t.String()),
          projectId: __nullable__(t.String()),
          financeBookId: __nullable__(t.String()),
          dim1: __nullable__(t.String()),
          dim2: __nullable__(t.String()),
          dim3: __nullable__(t.String()),
          dim4: __nullable__(t.String()),
          isOpening: t.Boolean(),
          isAdvance: t.Boolean(),
          isCancelled: t.Boolean(),
          dueDate: __nullable__(t.Date()),
          remarks: __nullable__(t.String()),
          createdById: __nullable__(t.String()),
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

export const FinanceBookPlainInputCreate = t.Object(
  { financeBookName: t.String(), disabled: t.Optional(t.Boolean()) },
  { additionalProperties: false },
);

export const FinanceBookPlainInputUpdate = t.Object(
  {
    financeBookName: t.Optional(t.String()),
    disabled: t.Optional(t.Boolean()),
  },
  { additionalProperties: false },
);

export const FinanceBookRelationsInputCreate = t.Object(
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
    glEntries: t.Optional(
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

export const FinanceBookRelationsInputUpdate = t.Partial(
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
      glEntries: t.Partial(
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

export const FinanceBookWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          clinicId: t.String(),
          financeBookName: t.String(),
          disabled: t.Boolean(),
          createdById: t.String(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "FinanceBook" },
  ),
);

export const FinanceBookWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            {
              id: t.String(),
              clinicId_financeBookName: t.Object(
                { clinicId: t.String(), financeBookName: t.String() },
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
              clinicId_financeBookName: t.Object(
                { clinicId: t.String(), financeBookName: t.String() },
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
              financeBookName: t.String(),
              disabled: t.Boolean(),
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
  { $id: "FinanceBook" },
);

export const FinanceBookSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      clinicId: t.Boolean(),
      financeBookName: t.Boolean(),
      disabled: t.Boolean(),
      createdById: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinic: t.Boolean(),
      glEntries: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const FinanceBookInclude = t.Partial(
  t.Object(
    { clinic: t.Boolean(), glEntries: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const FinanceBookOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clinicId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      financeBookName: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      disabled: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const FinanceBook = t.Composite(
  [FinanceBookPlain, FinanceBookRelations],
  { additionalProperties: false },
);

export const FinanceBookInputCreate = t.Composite(
  [FinanceBookPlainInputCreate, FinanceBookRelationsInputCreate],
  { additionalProperties: false },
);

export const FinanceBookInputUpdate = t.Composite(
  [FinanceBookPlainInputUpdate, FinanceBookRelationsInputUpdate],
  { additionalProperties: false },
);
