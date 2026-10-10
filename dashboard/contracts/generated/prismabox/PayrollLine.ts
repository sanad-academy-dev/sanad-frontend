import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const PayrollLinePlain = t.Object(
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
      t.Union([t.Literal("TRANSFER"), t.Literal("CASH"), t.Literal("CHECK")], {
        additionalProperties: false,
      }),
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
);

export const PayrollLineRelations = t.Object(
  {
    run: t.Object(
      {
        id: t.String(),
        code: t.String(),
        clinicId: t.String(),
        type: t.Union([t.Literal("REGULAR"), t.Literal("OFF_CYCLE")], {
          additionalProperties: false,
        }),
        status: t.Union(
          [
            t.Literal("DRAFT"),
            t.Literal("CALCULATED"),
            t.Literal("PENDING_APPROVAL"),
            t.Literal("APPROVED"),
            t.Literal("PAID"),
            t.Literal("CANCELLED"),
          ],
          { additionalProperties: false },
        ),
        periodYear: t.Integer(),
        periodMonth: t.Integer(),
        payDate: __nullable__(t.Date()),
        scope: t.Union(
          [
            t.Literal("ALL"),
            t.Literal("BRANCH"),
            t.Literal("DEPARTMENT"),
            t.Literal("CONTRACT"),
            t.Literal("SPECIFIC"),
          ],
          { additionalProperties: false },
        ),
        scopeBranchId: __nullable__(t.String()),
        scopeRoleId: __nullable__(t.String()),
        totalGross: __nullable__(t.Number()),
        totalEmployeeGosi: __nullable__(t.Number()),
        totalCompanyGosi: __nullable__(t.Number()),
        totalNet: __nullable__(t.Number()),
        totalCompanyCost: __nullable__(t.Number()),
        distribution: __nullable__(t.Any()),
        approvedAt: __nullable__(t.Date()),
        paidAt: __nullable__(t.Date()),
        cancelledAt: __nullable__(t.Date()),
        createdById: __nullable__(t.String()),
        createdAt: t.Date(),
        updatedAt: t.Date(),
      },
      { additionalProperties: false },
    ),
    staff: t.Object(
      {
        id: t.String(),
        code: t.String(),
        clinicId: t.String(),
        userId: __nullable__(t.String()),
        roleId: t.String(),
        branchId: t.String(),
        name: t.String(),
        gender: __nullable__(
          t.Union(
            [t.Literal("MALE"), t.Literal("FEMALE"), t.Literal("UNKNOWN")],
            { additionalProperties: false },
          ),
        ),
        prefix: __nullable__(
          t.Union(
            [
              t.Literal("MR"),
              t.Literal("MRS"),
              t.Literal("MS"),
              t.Literal("DR"),
              t.Literal("PROF"),
            ],
            { additionalProperties: false },
          ),
        ),
        age: __nullable__(t.Integer()),
        licenseNumber: __nullable__(t.String()),
        email: t.String(),
        phone: __nullable__(t.String()),
        country: __nullable__(t.String()),
        city: __nullable__(t.String()),
        address: __nullable__(t.String()),
        notes: __nullable__(t.String()),
        bio: __nullable__(t.String()),
        educationalQualification: __nullable__(t.String()),
        nationality: __nullable__(t.String()),
        avatar: __nullable__(t.String()),
        primarySpecializationId: __nullable__(t.String()),
        secondarySpecializationId: __nullable__(t.String()),
        employmentType: __nullable__(
          t.Union([t.Literal("FULL_TIME"), t.Literal("PART_TIME")], {
            additionalProperties: false,
          }),
        ),
        hireDate: __nullable__(t.Date()),
        isSaudi: t.Boolean(),
        status: t.Union(
          [t.Literal("PENDING"), t.Literal("ACTIVE"), t.Literal("INACTIVE")],
          { additionalProperties: false },
        ),
        active: t.Boolean(),
        isDeleted: t.Boolean(),
        deletedAt: __nullable__(t.Date()),
        createdAt: t.Date(),
        updatedAt: t.Date(),
      },
      { additionalProperties: false },
    ),
    earnings: t.Array(
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
          note: __nullable__(t.String()),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    deductions: t.Array(
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
          note: __nullable__(t.String()),
          sourceExpenseId: __nullable__(t.String()),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const PayrollLinePlainInputCreate = t.Object(
  {
    staffName: t.String(),
    staffCode: t.String(),
    baseSalary: t.Number(),
    allowancesTotal: t.Number(),
    overtimeHoursSuggested: t.Optional(t.Number()),
    overtimeHoursOverride: t.Optional(__nullable__(t.Number())),
    paymentMethodSuggested: t.Optional(
      t.Union([t.Literal("TRANSFER"), t.Literal("CASH"), t.Literal("CHECK")], {
        additionalProperties: false,
      }),
    ),
    paymentMethodOverride: t.Optional(
      __nullable__(
        t.Union(
          [t.Literal("TRANSFER"), t.Literal("CASH"), t.Literal("CHECK")],
          { additionalProperties: false },
        ),
      ),
    ),
    note: t.Optional(__nullable__(t.String())),
    overtimePay: t.Number(),
    leaveDeduction: t.Number(),
    grossEarnings: t.Number(),
    gosiBase: t.Number(),
    employeeGosi: t.Number(),
    companyGosi: t.Number(),
    netPay: t.Number(),
    companyCost: t.Number(),
    issues: t.Optional(__nullable__(t.Any())),
    excluded: t.Optional(t.Boolean()),
  },
  { additionalProperties: false },
);

export const PayrollLinePlainInputUpdate = t.Object(
  {
    staffName: t.Optional(t.String()),
    staffCode: t.Optional(t.String()),
    baseSalary: t.Optional(t.Number()),
    allowancesTotal: t.Optional(t.Number()),
    overtimeHoursSuggested: t.Optional(t.Number()),
    overtimeHoursOverride: t.Optional(__nullable__(t.Number())),
    paymentMethodSuggested: t.Optional(
      t.Union([t.Literal("TRANSFER"), t.Literal("CASH"), t.Literal("CHECK")], {
        additionalProperties: false,
      }),
    ),
    paymentMethodOverride: t.Optional(
      __nullable__(
        t.Union(
          [t.Literal("TRANSFER"), t.Literal("CASH"), t.Literal("CHECK")],
          { additionalProperties: false },
        ),
      ),
    ),
    note: t.Optional(__nullable__(t.String())),
    overtimePay: t.Optional(t.Number()),
    leaveDeduction: t.Optional(t.Number()),
    grossEarnings: t.Optional(t.Number()),
    gosiBase: t.Optional(t.Number()),
    employeeGosi: t.Optional(t.Number()),
    companyGosi: t.Optional(t.Number()),
    netPay: t.Optional(t.Number()),
    companyCost: t.Optional(t.Number()),
    issues: t.Optional(__nullable__(t.Any())),
    excluded: t.Optional(t.Boolean()),
  },
  { additionalProperties: false },
);

export const PayrollLineRelationsInputCreate = t.Object(
  {
    run: t.Object(
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
    staff: t.Object(
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
    earnings: t.Optional(
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

export const PayrollLineRelationsInputUpdate = t.Partial(
  t.Object(
    {
      run: t.Object(
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
      staff: t.Object(
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
      earnings: t.Partial(
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

export const PayrollLineWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          runId: t.String(),
          staffId: t.String(),
          staffName: t.String(),
          staffCode: t.String(),
          baseSalary: t.Number(),
          allowancesTotal: t.Number(),
          overtimeHoursSuggested: t.Number(),
          overtimeHoursOverride: t.Number(),
          paymentMethodSuggested: t.Union(
            [t.Literal("TRANSFER"), t.Literal("CASH"), t.Literal("CHECK")],
            { additionalProperties: false },
          ),
          paymentMethodOverride: t.Union(
            [t.Literal("TRANSFER"), t.Literal("CASH"), t.Literal("CHECK")],
            { additionalProperties: false },
          ),
          note: t.String(),
          overtimePay: t.Number(),
          leaveDeduction: t.Number(),
          grossEarnings: t.Number(),
          gosiBase: t.Number(),
          employeeGosi: t.Number(),
          companyGosi: t.Number(),
          netPay: t.Number(),
          companyCost: t.Number(),
          issues: t.Any(),
          excluded: t.Boolean(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "PayrollLine" },
  ),
);

export const PayrollLineWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            {
              id: t.String(),
              runId_staffId: t.Object(
                { runId: t.String(), staffId: t.String() },
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
              runId_staffId: t.Object(
                { runId: t.String(), staffId: t.String() },
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
              runId: t.String(),
              staffId: t.String(),
              staffName: t.String(),
              staffCode: t.String(),
              baseSalary: t.Number(),
              allowancesTotal: t.Number(),
              overtimeHoursSuggested: t.Number(),
              overtimeHoursOverride: t.Number(),
              paymentMethodSuggested: t.Union(
                [t.Literal("TRANSFER"), t.Literal("CASH"), t.Literal("CHECK")],
                { additionalProperties: false },
              ),
              paymentMethodOverride: t.Union(
                [t.Literal("TRANSFER"), t.Literal("CASH"), t.Literal("CHECK")],
                { additionalProperties: false },
              ),
              note: t.String(),
              overtimePay: t.Number(),
              leaveDeduction: t.Number(),
              grossEarnings: t.Number(),
              gosiBase: t.Number(),
              employeeGosi: t.Number(),
              companyGosi: t.Number(),
              netPay: t.Number(),
              companyCost: t.Number(),
              issues: t.Any(),
              excluded: t.Boolean(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "PayrollLine" },
);

export const PayrollLineSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      runId: t.Boolean(),
      staffId: t.Boolean(),
      staffName: t.Boolean(),
      staffCode: t.Boolean(),
      baseSalary: t.Boolean(),
      allowancesTotal: t.Boolean(),
      overtimeHoursSuggested: t.Boolean(),
      overtimeHoursOverride: t.Boolean(),
      paymentMethodSuggested: t.Boolean(),
      paymentMethodOverride: t.Boolean(),
      note: t.Boolean(),
      overtimePay: t.Boolean(),
      leaveDeduction: t.Boolean(),
      grossEarnings: t.Boolean(),
      gosiBase: t.Boolean(),
      employeeGosi: t.Boolean(),
      companyGosi: t.Boolean(),
      netPay: t.Boolean(),
      companyCost: t.Boolean(),
      issues: t.Boolean(),
      excluded: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      run: t.Boolean(),
      staff: t.Boolean(),
      earnings: t.Boolean(),
      deductions: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const PayrollLineInclude = t.Partial(
  t.Object(
    {
      paymentMethodSuggested: t.Boolean(),
      paymentMethodOverride: t.Boolean(),
      run: t.Boolean(),
      staff: t.Boolean(),
      earnings: t.Boolean(),
      deductions: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const PayrollLineOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      runId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      staffId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      staffName: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      staffCode: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      baseSalary: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      allowancesTotal: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      overtimeHoursSuggested: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      overtimeHoursOverride: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      note: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      overtimePay: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      leaveDeduction: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      grossEarnings: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      gosiBase: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      employeeGosi: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      companyGosi: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      netPay: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      companyCost: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      issues: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      excluded: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const PayrollLine = t.Composite(
  [PayrollLinePlain, PayrollLineRelations],
  { additionalProperties: false },
);

export const PayrollLineInputCreate = t.Composite(
  [PayrollLinePlainInputCreate, PayrollLineRelationsInputCreate],
  { additionalProperties: false },
);

export const PayrollLineInputUpdate = t.Composite(
  [PayrollLinePlainInputUpdate, PayrollLineRelationsInputUpdate],
  { additionalProperties: false },
);
