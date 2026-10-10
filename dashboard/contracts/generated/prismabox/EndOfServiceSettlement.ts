import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const EndOfServiceSettlementPlain = t.Object(
  {
    id: t.String(),
    code: t.String(),
    clinicId: t.String(),
    staffId: t.String(),
    staffName: t.String(),
    staffCode: t.String(),
    reason: t.Union(
      [
        t.Literal("END_OF_CONTRACT"),
        t.Literal("EMPLOYER_TERMINATION"),
        t.Literal("RESIGNATION"),
        t.Literal("SPECIAL"),
      ],
      { additionalProperties: false },
    ),
    status: t.Union(
      [
        t.Literal("DRAFT"),
        t.Literal("APPROVED"),
        t.Literal("PAID"),
        t.Literal("CANCELLED"),
      ],
      { additionalProperties: false },
    ),
    monthlyWage: t.Number(),
    startDate: t.Date(),
    endDate: t.Date(),
    serviceYears: t.Integer(),
    serviceMonths: t.Integer(),
    serviceDays: t.Integer(),
    firstFiveMonths: t.Number(),
    beyondFiveMonths: t.Number(),
    fullAward: t.Number(),
    factor: t.Number(),
    finalAmount: t.Number(),
    notes: __nullable__(t.String()),
    approvedAt: __nullable__(t.Date()),
    paidAt: __nullable__(t.Date()),
    createdById: __nullable__(t.String()),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  },
  { additionalProperties: false },
);

export const EndOfServiceSettlementRelations = t.Object(
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
    createdBy: __nullable__(
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

export const EndOfServiceSettlementPlainInputCreate = t.Object(
  {
    code: t.String(),
    staffName: t.String(),
    staffCode: t.String(),
    reason: t.Union(
      [
        t.Literal("END_OF_CONTRACT"),
        t.Literal("EMPLOYER_TERMINATION"),
        t.Literal("RESIGNATION"),
        t.Literal("SPECIAL"),
      ],
      { additionalProperties: false },
    ),
    status: t.Optional(
      t.Union(
        [
          t.Literal("DRAFT"),
          t.Literal("APPROVED"),
          t.Literal("PAID"),
          t.Literal("CANCELLED"),
        ],
        { additionalProperties: false },
      ),
    ),
    monthlyWage: t.Number(),
    startDate: t.Date(),
    endDate: t.Date(),
    serviceYears: t.Integer(),
    serviceMonths: t.Integer(),
    serviceDays: t.Integer(),
    firstFiveMonths: t.Number(),
    beyondFiveMonths: t.Number(),
    fullAward: t.Number(),
    factor: t.Number(),
    finalAmount: t.Number(),
    notes: t.Optional(__nullable__(t.String())),
    approvedAt: t.Optional(__nullable__(t.Date())),
    paidAt: t.Optional(__nullable__(t.Date())),
  },
  { additionalProperties: false },
);

export const EndOfServiceSettlementPlainInputUpdate = t.Object(
  {
    code: t.Optional(t.String()),
    staffName: t.Optional(t.String()),
    staffCode: t.Optional(t.String()),
    reason: t.Optional(
      t.Union(
        [
          t.Literal("END_OF_CONTRACT"),
          t.Literal("EMPLOYER_TERMINATION"),
          t.Literal("RESIGNATION"),
          t.Literal("SPECIAL"),
        ],
        { additionalProperties: false },
      ),
    ),
    status: t.Optional(
      t.Union(
        [
          t.Literal("DRAFT"),
          t.Literal("APPROVED"),
          t.Literal("PAID"),
          t.Literal("CANCELLED"),
        ],
        { additionalProperties: false },
      ),
    ),
    monthlyWage: t.Optional(t.Number()),
    startDate: t.Optional(t.Date()),
    endDate: t.Optional(t.Date()),
    serviceYears: t.Optional(t.Integer()),
    serviceMonths: t.Optional(t.Integer()),
    serviceDays: t.Optional(t.Integer()),
    firstFiveMonths: t.Optional(t.Number()),
    beyondFiveMonths: t.Optional(t.Number()),
    fullAward: t.Optional(t.Number()),
    factor: t.Optional(t.Number()),
    finalAmount: t.Optional(t.Number()),
    notes: t.Optional(__nullable__(t.String())),
    approvedAt: t.Optional(__nullable__(t.Date())),
    paidAt: t.Optional(__nullable__(t.Date())),
  },
  { additionalProperties: false },
);

export const EndOfServiceSettlementRelationsInputCreate = t.Object(
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
    createdBy: t.Optional(
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

export const EndOfServiceSettlementRelationsInputUpdate = t.Partial(
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
      createdBy: t.Partial(
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

export const EndOfServiceSettlementWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          code: t.String(),
          clinicId: t.String(),
          staffId: t.String(),
          staffName: t.String(),
          staffCode: t.String(),
          reason: t.Union(
            [
              t.Literal("END_OF_CONTRACT"),
              t.Literal("EMPLOYER_TERMINATION"),
              t.Literal("RESIGNATION"),
              t.Literal("SPECIAL"),
            ],
            { additionalProperties: false },
          ),
          status: t.Union(
            [
              t.Literal("DRAFT"),
              t.Literal("APPROVED"),
              t.Literal("PAID"),
              t.Literal("CANCELLED"),
            ],
            { additionalProperties: false },
          ),
          monthlyWage: t.Number(),
          startDate: t.Date(),
          endDate: t.Date(),
          serviceYears: t.Integer(),
          serviceMonths: t.Integer(),
          serviceDays: t.Integer(),
          firstFiveMonths: t.Number(),
          beyondFiveMonths: t.Number(),
          fullAward: t.Number(),
          factor: t.Number(),
          finalAmount: t.Number(),
          notes: t.String(),
          approvedAt: t.Date(),
          paidAt: t.Date(),
          createdById: t.String(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "EndOfServiceSettlement" },
  ),
);

export const EndOfServiceSettlementWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.String(), code: t.String() },
            { additionalProperties: false },
          ),
          { additionalProperties: false },
        ),
        t.Union(
          [t.Object({ id: t.String() }), t.Object({ code: t.String() })],
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
              code: t.String(),
              clinicId: t.String(),
              staffId: t.String(),
              staffName: t.String(),
              staffCode: t.String(),
              reason: t.Union(
                [
                  t.Literal("END_OF_CONTRACT"),
                  t.Literal("EMPLOYER_TERMINATION"),
                  t.Literal("RESIGNATION"),
                  t.Literal("SPECIAL"),
                ],
                { additionalProperties: false },
              ),
              status: t.Union(
                [
                  t.Literal("DRAFT"),
                  t.Literal("APPROVED"),
                  t.Literal("PAID"),
                  t.Literal("CANCELLED"),
                ],
                { additionalProperties: false },
              ),
              monthlyWage: t.Number(),
              startDate: t.Date(),
              endDate: t.Date(),
              serviceYears: t.Integer(),
              serviceMonths: t.Integer(),
              serviceDays: t.Integer(),
              firstFiveMonths: t.Number(),
              beyondFiveMonths: t.Number(),
              fullAward: t.Number(),
              factor: t.Number(),
              finalAmount: t.Number(),
              notes: t.String(),
              approvedAt: t.Date(),
              paidAt: t.Date(),
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
  { $id: "EndOfServiceSettlement" },
);

export const EndOfServiceSettlementSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      code: t.Boolean(),
      clinicId: t.Boolean(),
      staffId: t.Boolean(),
      staffName: t.Boolean(),
      staffCode: t.Boolean(),
      reason: t.Boolean(),
      status: t.Boolean(),
      monthlyWage: t.Boolean(),
      startDate: t.Boolean(),
      endDate: t.Boolean(),
      serviceYears: t.Boolean(),
      serviceMonths: t.Boolean(),
      serviceDays: t.Boolean(),
      firstFiveMonths: t.Boolean(),
      beyondFiveMonths: t.Boolean(),
      fullAward: t.Boolean(),
      factor: t.Boolean(),
      finalAmount: t.Boolean(),
      notes: t.Boolean(),
      approvedAt: t.Boolean(),
      paidAt: t.Boolean(),
      createdById: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinic: t.Boolean(),
      staff: t.Boolean(),
      createdBy: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const EndOfServiceSettlementInclude = t.Partial(
  t.Object(
    {
      reason: t.Boolean(),
      status: t.Boolean(),
      clinic: t.Boolean(),
      staff: t.Boolean(),
      createdBy: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const EndOfServiceSettlementOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      code: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clinicId: t.Union([t.Literal("asc"), t.Literal("desc")], {
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
      monthlyWage: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      startDate: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      endDate: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      serviceYears: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      serviceMonths: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      serviceDays: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      firstFiveMonths: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      beyondFiveMonths: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      fullAward: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      factor: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      finalAmount: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      notes: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      approvedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      paidAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const EndOfServiceSettlement = t.Composite(
  [EndOfServiceSettlementPlain, EndOfServiceSettlementRelations],
  { additionalProperties: false },
);

export const EndOfServiceSettlementInputCreate = t.Composite(
  [
    EndOfServiceSettlementPlainInputCreate,
    EndOfServiceSettlementRelationsInputCreate,
  ],
  { additionalProperties: false },
);

export const EndOfServiceSettlementInputUpdate = t.Composite(
  [
    EndOfServiceSettlementPlainInputUpdate,
    EndOfServiceSettlementRelationsInputUpdate,
  ],
  { additionalProperties: false },
);
