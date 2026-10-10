import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const BankTransactionPlain = t.Object(
  {
    id: t.String(),
    clinicId: t.String(),
    documentNo: __nullable__(t.String()),
    docstatus: t.Union(
      [t.Literal("DRAFT"), t.Literal("SUBMITTED"), t.Literal("CANCELLED")],
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
);

export const BankTransactionRelations = t.Object(
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
    bankAccount: t.Object(
      {
        id: t.String(),
        clinicId: t.String(),
        bankId: t.String(),
        accountName: t.String(),
        isCompanyAccount: t.Boolean(),
        glAccountId: __nullable__(t.String()),
        accountType: __nullable__(t.String()),
        accountSubtype: __nullable__(t.String()),
        iban: __nullable__(t.String()),
        branchCode: __nullable__(t.String()),
        bankAccountNo: __nullable__(t.String()),
        partyType: __nullable__(t.String()),
        partyId: __nullable__(t.String()),
        integrationId: __nullable__(t.String()),
        disabled: t.Boolean(),
        createdById: __nullable__(t.String()),
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
    pairedWith: __nullable__(
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
    ),
    pairedBy: t.Array(
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
    import: __nullable__(
      t.Object(
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
      ),
    ),
    payments: t.Array(
      t.Object(
        {
          id: t.String(),
          bankTransactionId: t.String(),
          paymentDocument: t.String(),
          paymentEntryId: t.String(),
          paymentRowId: __nullable__(t.String()),
          allocatedAmount: t.Number(),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const BankTransactionPlainInputCreate = t.Object(
  {
    documentNo: t.Optional(__nullable__(t.String())),
    docstatus: t.Optional(
      t.Union(
        [t.Literal("DRAFT"), t.Literal("SUBMITTED"), t.Literal("CANCELLED")],
        { additionalProperties: false },
      ),
    ),
    postingDate: t.Date(),
    deposit: t.Optional(t.Number()),
    withdrawal: t.Optional(t.Number()),
    currencyCode: t.String(),
    description: t.Optional(__nullable__(t.String())),
    referenceNumber: t.Optional(__nullable__(t.String())),
    status: t.Optional(
      t.Union(
        [
          t.Literal("PENDING"),
          t.Literal("UNRECONCILED"),
          t.Literal("RECONCILED"),
          t.Literal("SETTLED"),
          t.Literal("CANCELLED"),
        ],
        { additionalProperties: false },
      ),
    ),
    partyType: t.Optional(__nullable__(t.String())),
    allocatedAmount: t.Optional(t.Number()),
    unallocatedAmount: t.Optional(t.Number()),
    submittedAt: t.Optional(__nullable__(t.Date())),
    cancelledAt: t.Optional(__nullable__(t.Date())),
  },
  { additionalProperties: false },
);

export const BankTransactionPlainInputUpdate = t.Object(
  {
    documentNo: t.Optional(__nullable__(t.String())),
    docstatus: t.Optional(
      t.Union(
        [t.Literal("DRAFT"), t.Literal("SUBMITTED"), t.Literal("CANCELLED")],
        { additionalProperties: false },
      ),
    ),
    postingDate: t.Optional(t.Date()),
    deposit: t.Optional(t.Number()),
    withdrawal: t.Optional(t.Number()),
    currencyCode: t.Optional(t.String()),
    description: t.Optional(__nullable__(t.String())),
    referenceNumber: t.Optional(__nullable__(t.String())),
    status: t.Optional(
      t.Union(
        [
          t.Literal("PENDING"),
          t.Literal("UNRECONCILED"),
          t.Literal("RECONCILED"),
          t.Literal("SETTLED"),
          t.Literal("CANCELLED"),
        ],
        { additionalProperties: false },
      ),
    ),
    partyType: t.Optional(__nullable__(t.String())),
    allocatedAmount: t.Optional(t.Number()),
    unallocatedAmount: t.Optional(t.Number()),
    submittedAt: t.Optional(__nullable__(t.Date())),
    cancelledAt: t.Optional(__nullable__(t.Date())),
  },
  { additionalProperties: false },
);

export const BankTransactionRelationsInputCreate = t.Object(
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
    bankAccount: t.Object(
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
    pairedWith: t.Optional(
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
    pairedBy: t.Optional(
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
    import: t.Optional(
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
    payments: t.Optional(
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

export const BankTransactionRelationsInputUpdate = t.Partial(
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
      bankAccount: t.Object(
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
      pairedWith: t.Partial(
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
      pairedBy: t.Partial(
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
      import: t.Partial(
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
      payments: t.Partial(
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

export const BankTransactionWhere = t.Partial(
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
          postingDate: t.Date(),
          amendedFromId: t.String(),
          bankAccountId: t.String(),
          deposit: t.Number(),
          withdrawal: t.Number(),
          currencyCode: t.String(),
          description: t.String(),
          referenceNumber: t.String(),
          transactionId: t.String(),
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
          partyType: t.String(),
          partyId: t.String(),
          allocatedAmount: t.Number(),
          unallocatedAmount: t.Number(),
          pairedTransactionId: t.String(),
          importId: t.String(),
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
    { $id: "BankTransaction" },
  ),
);

export const BankTransactionWhereUnique = t.Recursive(
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
              bankAccountId_transactionId: t.Object(
                { bankAccountId: t.String(), transactionId: t.String() },
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
            t.Object({
              bankAccountId_transactionId: t.Object(
                { bankAccountId: t.String(), transactionId: t.String() },
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
              postingDate: t.Date(),
              amendedFromId: t.String(),
              bankAccountId: t.String(),
              deposit: t.Number(),
              withdrawal: t.Number(),
              currencyCode: t.String(),
              description: t.String(),
              referenceNumber: t.String(),
              transactionId: t.String(),
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
              partyType: t.String(),
              partyId: t.String(),
              allocatedAmount: t.Number(),
              unallocatedAmount: t.Number(),
              pairedTransactionId: t.String(),
              importId: t.String(),
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
  { $id: "BankTransaction" },
);

export const BankTransactionSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      clinicId: t.Boolean(),
      documentNo: t.Boolean(),
      docstatus: t.Boolean(),
      postingDate: t.Boolean(),
      amendedFromId: t.Boolean(),
      bankAccountId: t.Boolean(),
      deposit: t.Boolean(),
      withdrawal: t.Boolean(),
      currencyCode: t.Boolean(),
      description: t.Boolean(),
      referenceNumber: t.Boolean(),
      transactionId: t.Boolean(),
      status: t.Boolean(),
      partyType: t.Boolean(),
      partyId: t.Boolean(),
      allocatedAmount: t.Boolean(),
      unallocatedAmount: t.Boolean(),
      pairedTransactionId: t.Boolean(),
      importId: t.Boolean(),
      createdById: t.Boolean(),
      submittedAt: t.Boolean(),
      submittedById: t.Boolean(),
      cancelledAt: t.Boolean(),
      cancelledById: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinic: t.Boolean(),
      bankAccount: t.Boolean(),
      amendedFrom: t.Boolean(),
      amendments: t.Boolean(),
      pairedWith: t.Boolean(),
      pairedBy: t.Boolean(),
      import: t.Boolean(),
      payments: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const BankTransactionInclude = t.Partial(
  t.Object(
    {
      docstatus: t.Boolean(),
      status: t.Boolean(),
      clinic: t.Boolean(),
      bankAccount: t.Boolean(),
      amendedFrom: t.Boolean(),
      amendments: t.Boolean(),
      pairedWith: t.Boolean(),
      pairedBy: t.Boolean(),
      import: t.Boolean(),
      payments: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const BankTransactionOrderBy = t.Partial(
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
      postingDate: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      amendedFromId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      bankAccountId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      deposit: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      withdrawal: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      currencyCode: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      description: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      referenceNumber: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      transactionId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      partyType: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      partyId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      allocatedAmount: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      unallocatedAmount: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      pairedTransactionId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      importId: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const BankTransaction = t.Composite(
  [BankTransactionPlain, BankTransactionRelations],
  { additionalProperties: false },
);

export const BankTransactionInputCreate = t.Composite(
  [BankTransactionPlainInputCreate, BankTransactionRelationsInputCreate],
  { additionalProperties: false },
);

export const BankTransactionInputUpdate = t.Composite(
  [BankTransactionPlainInputUpdate, BankTransactionRelationsInputUpdate],
  { additionalProperties: false },
);
