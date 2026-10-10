import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const PayrollLineEarningPlain = t.Object(
  {
    id: t.String(),
    lineId: t.String(),
    type: t.Union(
      [
        t.Literal("ALLOWANCE"),
        t.Literal("BONUS"),
        t.Literal("COMMISSION"),
        t.Literal("EXPENSE_REIMBURSEMENT"),
      ],
      { additionalProperties: false },
    ),
    amount: t.Number(),
    note: __nullable__(t.String()),
    createdAt: t.Date(),
  },
  { additionalProperties: false },
);

export const PayrollLineEarningRelations = t.Object(
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
  },
  { additionalProperties: false },
);

export const PayrollLineEarningPlainInputCreate = t.Object(
  {
    type: t.Union(
      [
        t.Literal("ALLOWANCE"),
        t.Literal("BONUS"),
        t.Literal("COMMISSION"),
        t.Literal("EXPENSE_REIMBURSEMENT"),
      ],
      { additionalProperties: false },
    ),
    amount: t.Number(),
    note: t.Optional(__nullable__(t.String())),
  },
  { additionalProperties: false },
);

export const PayrollLineEarningPlainInputUpdate = t.Object(
  {
    type: t.Optional(
      t.Union(
        [
          t.Literal("ALLOWANCE"),
          t.Literal("BONUS"),
          t.Literal("COMMISSION"),
          t.Literal("EXPENSE_REIMBURSEMENT"),
        ],
        { additionalProperties: false },
      ),
    ),
    amount: t.Optional(t.Number()),
    note: t.Optional(__nullable__(t.String())),
  },
  { additionalProperties: false },
);

export const PayrollLineEarningRelationsInputCreate = t.Object(
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
  },
  { additionalProperties: false },
);

export const PayrollLineEarningRelationsInputUpdate = t.Partial(
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
    },
    { additionalProperties: false },
  ),
);

export const PayrollLineEarningWhere = t.Partial(
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
              t.Literal("ALLOWANCE"),
              t.Literal("BONUS"),
              t.Literal("COMMISSION"),
              t.Literal("EXPENSE_REIMBURSEMENT"),
            ],
            { additionalProperties: false },
          ),
          amount: t.Number(),
          note: t.String(),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "PayrollLineEarning" },
  ),
);

export const PayrollLineEarningWhereUnique = t.Recursive(
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
              lineId: t.String(),
              type: t.Union(
                [
                  t.Literal("ALLOWANCE"),
                  t.Literal("BONUS"),
                  t.Literal("COMMISSION"),
                  t.Literal("EXPENSE_REIMBURSEMENT"),
                ],
                { additionalProperties: false },
              ),
              amount: t.Number(),
              note: t.String(),
              createdAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "PayrollLineEarning" },
);

export const PayrollLineEarningSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      lineId: t.Boolean(),
      type: t.Boolean(),
      amount: t.Boolean(),
      note: t.Boolean(),
      createdAt: t.Boolean(),
      line: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const PayrollLineEarningInclude = t.Partial(
  t.Object(
    { type: t.Boolean(), line: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const PayrollLineEarningOrderBy = t.Partial(
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
      createdAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const PayrollLineEarning = t.Composite(
  [PayrollLineEarningPlain, PayrollLineEarningRelations],
  { additionalProperties: false },
);

export const PayrollLineEarningInputCreate = t.Composite(
  [PayrollLineEarningPlainInputCreate, PayrollLineEarningRelationsInputCreate],
  { additionalProperties: false },
);

export const PayrollLineEarningInputUpdate = t.Composite(
  [PayrollLineEarningPlainInputUpdate, PayrollLineEarningRelationsInputUpdate],
  { additionalProperties: false },
);
