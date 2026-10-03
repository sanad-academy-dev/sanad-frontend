import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const BankStatementImportPlain = t.Object(
  {
    id: t.String(),
    clinicId: t.String(),
    bankAccountId: t.String(),
    mappingId: __nullable__(t.String()),
    fileName: t.String(),
    totalRows: t.Integer(),
    importedRows: t.Integer(),
    duplicateRows: t.Integer(),
    errorRows: t.Integer(),
    errors: __nullable__(t.Any()),
    createdById: __nullable__(t.String()),
    createdAt: t.Date(),
  },
  { additionalProperties: false },
);

export const BankStatementImportRelations = t.Object(
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
    transactions: t.Array(
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
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const BankStatementImportPlainInputCreate = t.Object(
  {
    fileName: t.String(),
    totalRows: t.Optional(t.Integer()),
    importedRows: t.Optional(t.Integer()),
    duplicateRows: t.Optional(t.Integer()),
    errorRows: t.Optional(t.Integer()),
    errors: t.Optional(__nullable__(t.Any())),
  },
  { additionalProperties: false },
);

export const BankStatementImportPlainInputUpdate = t.Object(
  {
    fileName: t.Optional(t.String()),
    totalRows: t.Optional(t.Integer()),
    importedRows: t.Optional(t.Integer()),
    duplicateRows: t.Optional(t.Integer()),
    errorRows: t.Optional(t.Integer()),
    errors: t.Optional(__nullable__(t.Any())),
  },
  { additionalProperties: false },
);

export const BankStatementImportRelationsInputCreate = t.Object(
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
    transactions: t.Optional(
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

export const BankStatementImportRelationsInputUpdate = t.Partial(
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
      transactions: t.Partial(
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

export const BankStatementImportWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          clinicId: t.String(),
          bankAccountId: t.String(),
          mappingId: t.String(),
          fileName: t.String(),
          totalRows: t.Integer(),
          importedRows: t.Integer(),
          duplicateRows: t.Integer(),
          errorRows: t.Integer(),
          errors: t.Any(),
          createdById: t.String(),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "BankStatementImport" },
  ),
);

export const BankStatementImportWhereUnique = t.Recursive(
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
              bankAccountId: t.String(),
              mappingId: t.String(),
              fileName: t.String(),
              totalRows: t.Integer(),
              importedRows: t.Integer(),
              duplicateRows: t.Integer(),
              errorRows: t.Integer(),
              errors: t.Any(),
              createdById: t.String(),
              createdAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "BankStatementImport" },
);

export const BankStatementImportSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      clinicId: t.Boolean(),
      bankAccountId: t.Boolean(),
      mappingId: t.Boolean(),
      fileName: t.Boolean(),
      totalRows: t.Boolean(),
      importedRows: t.Boolean(),
      duplicateRows: t.Boolean(),
      errorRows: t.Boolean(),
      errors: t.Boolean(),
      createdById: t.Boolean(),
      createdAt: t.Boolean(),
      clinic: t.Boolean(),
      transactions: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const BankStatementImportInclude = t.Partial(
  t.Object(
    { clinic: t.Boolean(), transactions: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const BankStatementImportOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clinicId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      bankAccountId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      mappingId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      fileName: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      totalRows: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      importedRows: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      duplicateRows: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      errorRows: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      errors: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdById: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const BankStatementImport = t.Composite(
  [BankStatementImportPlain, BankStatementImportRelations],
  { additionalProperties: false },
);

export const BankStatementImportInputCreate = t.Composite(
  [
    BankStatementImportPlainInputCreate,
    BankStatementImportRelationsInputCreate,
  ],
  { additionalProperties: false },
);

export const BankStatementImportInputUpdate = t.Composite(
  [
    BankStatementImportPlainInputUpdate,
    BankStatementImportRelationsInputUpdate,
  ],
  { additionalProperties: false },
);
