import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const PayrollLineDeductionPlain = t.Object(
  {
    id: t.String(),
    lineId: t.String(),
    type: t.Union(
      [
        t.Literal("ADVANCE"),
        t.Literal("LOAN_INSTALLMENT"),
        t.Literal("PENALTY"),
        t.Literal("OTHER"),
      ],
      { additionalProperties: false },
    ),
    amount: t.Number(),
    note: __nullable__(t.String()),
    sourceExpenseId: __nullable__(t.String()),
    createdAt: t.Date(),
  },
  { additionalProperties: false },
);

export const PayrollLineDeductionRelations = t.Object(
  {
    line: t.Object(
      {
        id: t.String(),
        runId: t.String(),
        staffId: t.String(),
        staffName: t.String(),
        staffCode: t.String(),
        baseSalary: t.Number(),
        allowancesTotal: t.Number(),
        overtimeHoursSuggested: t.Number(),
        overtimeHoursOverride: __nullable__(t.Number()),
        paymentMethodSuggested: t.Union(
          [t.Literal("TRANSFER"), t.Literal("CASH"), t.Literal("CHECK")],
          { additionalProperties: false },
        ),
        paymentMethodOverride: __nullable__(
          t.Union(
            [t.Literal("TRANSFER"), t.Literal("CASH"), t.Literal("CHECK")],
            { additionalProperties: false },
          ),
        ),
        note: __nullable__(t.String()),
        overtimePay: t.Number(),
        leaveDeduction: t.Number(),
        grossEarnings: t.Number(),
        gosiBase: t.Number(),
        employeeGosi: t.Number(),
        companyGosi: t.Number(),
        netPay: t.Number(),
        companyCost: t.Number(),
        issues: __nullable__(t.Any()),
        excluded: t.Boolean(),
        createdAt: t.Date(),
        updatedAt: t.Date(),
      },
      { additionalProperties: false },
    ),
    sourceExpense: __nullable__(
      t.Object(
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
    ),
  },
  { additionalProperties: false },
);

export const PayrollLineDeductionPlainInputCreate = t.Object(
  {
    type: t.Union(
      [
        t.Literal("ADVANCE"),
        t.Literal("LOAN_INSTALLMENT"),
        t.Literal("PENALTY"),
        t.Literal("OTHER"),
      ],
      { additionalProperties: false },
    ),
    amount: t.Number(),
    note: t.Optional(__nullable__(t.String())),
  },
  { additionalProperties: false },
);

export const PayrollLineDeductionPlainInputUpdate = t.Object(
  {
    type: t.Optional(
      t.Union(
        [
          t.Literal("ADVANCE"),
          t.Literal("LOAN_INSTALLMENT"),
          t.Literal("PENALTY"),
          t.Literal("OTHER"),
        ],
        { additionalProperties: false },
      ),
    ),
    amount: t.Optional(t.Number()),
    note: t.Optional(__nullable__(t.String())),
  },
  { additionalProperties: false },
);

export const PayrollLineDeductionRelationsInputCreate = t.Object(
  {
    line: t.Object(
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
    sourceExpense: t.Optional(
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

export const PayrollLineDeductionRelationsInputUpdate = t.Partial(
  t.Object(
    {
      line: t.Object(
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
      sourceExpense: t.Partial(
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

export const PayrollLineDeductionWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          lineId: t.String(),
          type: t.Union(
            [
              t.Literal("ADVANCE"),
              t.Literal("LOAN_INSTALLMENT"),
              t.Literal("PENALTY"),
              t.Literal("OTHER"),
            ],
            { additionalProperties: false },
          ),
          amount: t.Number(),
          note: t.String(),
          sourceExpenseId: t.String(),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "PayrollLineDeduction" },
  ),
);

export const PayrollLineDeductionWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.String(), sourceExpenseId: t.String() },
            { additionalProperties: false },
          ),
          { additionalProperties: false },
        ),
        t.Union(
          [
            t.Object({ id: t.String() }),
            t.Object({ sourceExpenseId: t.String() }),
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
              lineId: t.String(),
              type: t.Union(
                [
                  t.Literal("ADVANCE"),
                  t.Literal("LOAN_INSTALLMENT"),
                  t.Literal("PENALTY"),
                  t.Literal("OTHER"),
                ],
                { additionalProperties: false },
              ),
              amount: t.Number(),
              note: t.String(),
              sourceExpenseId: t.String(),
              createdAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "PayrollLineDeduction" },
);

export const PayrollLineDeductionSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      lineId: t.Boolean(),
      type: t.Boolean(),
      amount: t.Boolean(),
      note: t.Boolean(),
      sourceExpenseId: t.Boolean(),
      createdAt: t.Boolean(),
      line: t.Boolean(),
      sourceExpense: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const PayrollLineDeductionInclude = t.Partial(
  t.Object(
    {
      type: t.Boolean(),
      line: t.Boolean(),
      sourceExpense: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const PayrollLineDeductionOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      lineId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      amount: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      note: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      sourceExpenseId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const PayrollLineDeduction = t.Composite(
  [PayrollLineDeductionPlain, PayrollLineDeductionRelations],
  { additionalProperties: false },
);

export const PayrollLineDeductionInputCreate = t.Composite(
  [
    PayrollLineDeductionPlainInputCreate,
    PayrollLineDeductionRelationsInputCreate,
  ],
  { additionalProperties: false },
);

export const PayrollLineDeductionInputUpdate = t.Composite(
  [
    PayrollLineDeductionPlainInputUpdate,
    PayrollLineDeductionRelationsInputUpdate,
  ],
  { additionalProperties: false },
);
