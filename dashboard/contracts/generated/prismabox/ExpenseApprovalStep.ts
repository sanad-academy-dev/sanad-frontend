import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const ExpenseApprovalStepPlain = t.Object(
  {
    id: t.String(),
    expenseId: t.String(),
    type: t.Union(
      [
        t.Literal("CREATED"),
        t.Literal("SENT_FOR_REVIEW"),
        t.Literal("MANAGER_REVIEW"),
        t.Literal("FINANCE_APPROVAL"),
        t.Literal("DISBURSEMENT"),
      ],
      { additionalProperties: false },
    ),
    state: t.Union(
      [
        t.Literal("PENDING"),
        t.Literal("SENT"),
        t.Literal("APPROVED"),
        t.Literal("REJECTED"),
        t.Literal("DONE"),
      ],
      { additionalProperties: false },
    ),
    order: t.Integer(),
    actorId: __nullable__(t.String()),
    actedAt: __nullable__(t.Date()),
    comment: __nullable__(t.String()),
    createdAt: t.Date(),
  },
  { additionalProperties: false },
);

export const ExpenseApprovalStepRelations = t.Object(
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
    actor: __nullable__(
      t.Object(
        {
          id: t.String(),
          name: t.String(),
          email: t.String(),
          emailVerified: t.Boolean(),
          image: __nullable__(t.String()),
          phone: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    ),
  },
  { additionalProperties: false },
);

export const ExpenseApprovalStepPlainInputCreate = t.Object(
  {
    type: t.Union(
      [
        t.Literal("CREATED"),
        t.Literal("SENT_FOR_REVIEW"),
        t.Literal("MANAGER_REVIEW"),
        t.Literal("FINANCE_APPROVAL"),
        t.Literal("DISBURSEMENT"),
      ],
      { additionalProperties: false },
    ),
    state: t.Optional(
      t.Union(
        [
          t.Literal("PENDING"),
          t.Literal("SENT"),
          t.Literal("APPROVED"),
          t.Literal("REJECTED"),
          t.Literal("DONE"),
        ],
        { additionalProperties: false },
      ),
    ),
    order: t.Integer(),
    actedAt: t.Optional(__nullable__(t.Date())),
    comment: t.Optional(__nullable__(t.String())),
  },
  { additionalProperties: false },
);

export const ExpenseApprovalStepPlainInputUpdate = t.Object(
  {
    type: t.Optional(
      t.Union(
        [
          t.Literal("CREATED"),
          t.Literal("SENT_FOR_REVIEW"),
          t.Literal("MANAGER_REVIEW"),
          t.Literal("FINANCE_APPROVAL"),
          t.Literal("DISBURSEMENT"),
        ],
        { additionalProperties: false },
      ),
    ),
    state: t.Optional(
      t.Union(
        [
          t.Literal("PENDING"),
          t.Literal("SENT"),
          t.Literal("APPROVED"),
          t.Literal("REJECTED"),
          t.Literal("DONE"),
        ],
        { additionalProperties: false },
      ),
    ),
    order: t.Optional(t.Integer()),
    actedAt: t.Optional(__nullable__(t.Date())),
    comment: t.Optional(__nullable__(t.String())),
  },
  { additionalProperties: false },
);

export const ExpenseApprovalStepRelationsInputCreate = t.Object(
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
    actor: t.Optional(
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

export const ExpenseApprovalStepRelationsInputUpdate = t.Partial(
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
      actor: t.Partial(
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

export const ExpenseApprovalStepWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          expenseId: t.String(),
          type: t.Union(
            [
              t.Literal("CREATED"),
              t.Literal("SENT_FOR_REVIEW"),
              t.Literal("MANAGER_REVIEW"),
              t.Literal("FINANCE_APPROVAL"),
              t.Literal("DISBURSEMENT"),
            ],
            { additionalProperties: false },
          ),
          state: t.Union(
            [
              t.Literal("PENDING"),
              t.Literal("SENT"),
              t.Literal("APPROVED"),
              t.Literal("REJECTED"),
              t.Literal("DONE"),
            ],
            { additionalProperties: false },
          ),
          order: t.Integer(),
          actorId: t.String(),
          actedAt: t.Date(),
          comment: t.String(),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "ExpenseApprovalStep" },
  ),
);

export const ExpenseApprovalStepWhereUnique = t.Recursive(
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
              type: t.Union(
                [
                  t.Literal("CREATED"),
                  t.Literal("SENT_FOR_REVIEW"),
                  t.Literal("MANAGER_REVIEW"),
                  t.Literal("FINANCE_APPROVAL"),
                  t.Literal("DISBURSEMENT"),
                ],
                { additionalProperties: false },
              ),
              state: t.Union(
                [
                  t.Literal("PENDING"),
                  t.Literal("SENT"),
                  t.Literal("APPROVED"),
                  t.Literal("REJECTED"),
                  t.Literal("DONE"),
                ],
                { additionalProperties: false },
              ),
              order: t.Integer(),
              actorId: t.String(),
              actedAt: t.Date(),
              comment: t.String(),
              createdAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "ExpenseApprovalStep" },
);

export const ExpenseApprovalStepSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      expenseId: t.Boolean(),
      type: t.Boolean(),
      state: t.Boolean(),
      order: t.Boolean(),
      actorId: t.Boolean(),
      actedAt: t.Boolean(),
      comment: t.Boolean(),
      createdAt: t.Boolean(),
      expense: t.Boolean(),
      actor: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const ExpenseApprovalStepInclude = t.Partial(
  t.Object(
    {
      type: t.Boolean(),
      state: t.Boolean(),
      expense: t.Boolean(),
      actor: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const ExpenseApprovalStepOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      expenseId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      order: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      actorId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      actedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      comment: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const ExpenseApprovalStep = t.Composite(
  [ExpenseApprovalStepPlain, ExpenseApprovalStepRelations],
  { additionalProperties: false },
);

export const ExpenseApprovalStepInputCreate = t.Composite(
  [
    ExpenseApprovalStepPlainInputCreate,
    ExpenseApprovalStepRelationsInputCreate,
  ],
  { additionalProperties: false },
);

export const ExpenseApprovalStepInputUpdate = t.Composite(
  [
    ExpenseApprovalStepPlainInputUpdate,
    ExpenseApprovalStepRelationsInputUpdate,
  ],
  { additionalProperties: false },
);
