import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const ExpenseAttachmentPlain = t.Object(
  {
    id: t.String(),
    expenseId: t.String(),
    kind: t.Union([t.Literal("LINK"), t.Literal("DOCUMENT")], {
      additionalProperties: false,
    }),
    label: t.String(),
    url: t.String(),
    sizeBytes: __nullable__(t.Integer()),
    createdAt: t.Date(),
  },
  { additionalProperties: false },
);

export const ExpenseAttachmentRelations = t.Object(
  {
    expense: t.Object(
      {
        id: t.String(),
        code: t.String(),
        clinicId: t.String(),
        name: t.String(),
        status: t.Union(
          [
            t.Literal("DRAFT"),
            t.Literal("PENDING_REVIEW"),
            t.Literal("APPROVED"),
            t.Literal("REJECTED"),
            t.Literal("PAID"),
            t.Literal("CANCELED"),
          ],
          { additionalProperties: false },
        ),
        amount: t.Number(),
        source: t.Union(
          [
            t.Literal("MANUAL"),
            t.Literal("PAYROLL_RUN"),
            t.Literal("END_OF_SERVICE"),
            t.Literal("PURCHASE_ORDER"),
          ],
          { additionalProperties: false },
        ),
        sourceId: __nullable__(t.String()),
        expenseDate: __nullable__(t.Date()),
        staffId: __nullable__(t.String()),
        recoverFromPayroll: t.Boolean(),
        paymentMethod: __nullable__(
          t.Union(
            [
              t.Literal("CASH"),
              t.Literal("BANK_TRANSFER"),
              t.Literal("CARD"),
              t.Literal("CHEQUE"),
              t.Literal("TREASURY"),
            ],
            { additionalProperties: false },
          ),
        ),
        categoryLabel: __nullable__(t.String()),
        departmentLabel: __nullable__(t.String()),
        branchId: __nullable__(t.String()),
        requesterId: t.String(),
        supplierId: __nullable__(t.String()),
        notes: __nullable__(t.String()),
        reminderEnabled: t.Boolean(),
        reminderOffset: __nullable__(
          t.Union(
            [
              t.Literal("ONE_DAY"),
              t.Literal("TWO_DAYS"),
              t.Literal("THREE_DAYS"),
            ],
            { additionalProperties: false },
          ),
        ),
        rejectionReason: __nullable__(t.String()),
        cancelReason: __nullable__(t.String()),
        signed: t.Boolean(),
        signatureName: __nullable__(t.String()),
        decisionAt: __nullable__(t.Date()),
        decidedById: __nullable__(t.String()),
        reviewSubject: __nullable__(t.String()),
        reviewBody: __nullable__(t.String()),
        reviewRecipientIds: t.Array(t.String(), {
          additionalProperties: false,
        }),
        reviewSentAt: __nullable__(t.Date()),
        editsCount: t.Integer(),
        createdAt: t.Date(),
        updatedAt: t.Date(),
      },
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const ExpenseAttachmentPlainInputCreate = t.Object(
  {
    kind: t.Union([t.Literal("LINK"), t.Literal("DOCUMENT")], {
      additionalProperties: false,
    }),
    label: t.String(),
    url: t.String(),
    sizeBytes: t.Optional(__nullable__(t.Integer())),
  },
  { additionalProperties: false },
);

export const ExpenseAttachmentPlainInputUpdate = t.Object(
  {
    kind: t.Optional(
      t.Union([t.Literal("LINK"), t.Literal("DOCUMENT")], {
        additionalProperties: false,
      }),
    ),
    label: t.Optional(t.String()),
    url: t.Optional(t.String()),
    sizeBytes: t.Optional(__nullable__(t.Integer())),
  },
  { additionalProperties: false },
);

export const ExpenseAttachmentRelationsInputCreate = t.Object(
  {
    expense: t.Object(
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

export const ExpenseAttachmentRelationsInputUpdate = t.Partial(
  t.Object(
    {
      expense: t.Object(
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

export const ExpenseAttachmentWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          expenseId: t.String(),
          kind: t.Union([t.Literal("LINK"), t.Literal("DOCUMENT")], {
            additionalProperties: false,
          }),
          label: t.String(),
          url: t.String(),
          sizeBytes: t.Integer(),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "ExpenseAttachment" },
  ),
);

export const ExpenseAttachmentWhereUnique = t.Recursive(
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
              expenseId: t.String(),
              kind: t.Union([t.Literal("LINK"), t.Literal("DOCUMENT")], {
                additionalProperties: false,
              }),
              label: t.String(),
              url: t.String(),
              sizeBytes: t.Integer(),
              createdAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "ExpenseAttachment" },
);

export const ExpenseAttachmentSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      expenseId: t.Boolean(),
      kind: t.Boolean(),
      label: t.Boolean(),
      url: t.Boolean(),
      sizeBytes: t.Boolean(),
      createdAt: t.Boolean(),
      expense: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const ExpenseAttachmentInclude = t.Partial(
  t.Object(
    { kind: t.Boolean(), expense: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const ExpenseAttachmentOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      expenseId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      label: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      url: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      sizeBytes: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const ExpenseAttachment = t.Composite(
  [ExpenseAttachmentPlain, ExpenseAttachmentRelations],
  { additionalProperties: false },
);

export const ExpenseAttachmentInputCreate = t.Composite(
  [ExpenseAttachmentPlainInputCreate, ExpenseAttachmentRelationsInputCreate],
  { additionalProperties: false },
);

export const ExpenseAttachmentInputUpdate = t.Composite(
  [ExpenseAttachmentPlainInputUpdate, ExpenseAttachmentRelationsInputUpdate],
  { additionalProperties: false },
);
