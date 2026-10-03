import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const InsuranceProductPlain = t.Object(
  {
    id: t.String(),
    code: t.String(),
    clinicId: t.String(),
    insurerId: t.String(),
    name: t.String(),
    coveragePercentDefault: t.Number(),
    annualCap: __nullable__(t.Number()),
    perClaimCap: __nullable__(t.Number()),
    deductibleFixed: t.Number(),
    deductiblePercent: t.Number(),
    active: t.Boolean(),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  },
  { additionalProperties: false },
);

export const InsuranceProductRelations = t.Object(
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
    insurer: t.Object(
      {
        id: t.String(),
        code: t.String(),
        clinicId: t.String(),
        name: t.String(),
        phone: __nullable__(t.String()),
        email: __nullable__(t.String()),
        contactPerson: __nullable__(t.String()),
        address: __nullable__(t.String()),
        settlementDays: t.Integer(),
        notes: __nullable__(t.String()),
        active: t.Boolean(),
        isDeleted: t.Boolean(),
        deletedAt: __nullable__(t.Date()),
        createdAt: t.Date(),
        updatedAt: t.Date(),
      },
      { additionalProperties: false },
    ),
    coverageRows: t.Array(
      t.Object(
        {
          id: t.String(),
          productId: t.String(),
          idx: t.Integer(),
          serviceId: t.String(),
          coveragePercent: t.Number(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    policies: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          patientId: t.String(),
          productId: t.String(),
          policyNumber: t.String(),
          policyStart: t.Date(),
          policyEnd: t.Date(),
          status: t.Union(
            [
              t.Literal("ACTIVE"),
              t.Literal("EXPIRED"),
              t.Literal("SUSPENDED"),
              t.Literal("CANCELLED"),
            ],
            { additionalProperties: false },
          ),
          capConsumed: t.Number(),
          notes: __nullable__(t.String()),
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

export const InsuranceProductPlainInputCreate = t.Object(
  {
    code: t.String(),
    name: t.String(),
    coveragePercentDefault: t.Number(),
    annualCap: t.Optional(__nullable__(t.Number())),
    perClaimCap: t.Optional(__nullable__(t.Number())),
    deductibleFixed: t.Optional(t.Number()),
    deductiblePercent: t.Optional(t.Number()),
    active: t.Optional(t.Boolean()),
  },
  { additionalProperties: false },
);

export const InsuranceProductPlainInputUpdate = t.Object(
  {
    code: t.Optional(t.String()),
    name: t.Optional(t.String()),
    coveragePercentDefault: t.Optional(t.Number()),
    annualCap: t.Optional(__nullable__(t.Number())),
    perClaimCap: t.Optional(__nullable__(t.Number())),
    deductibleFixed: t.Optional(t.Number()),
    deductiblePercent: t.Optional(t.Number()),
    active: t.Optional(t.Boolean()),
  },
  { additionalProperties: false },
);

export const InsuranceProductRelationsInputCreate = t.Object(
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
    insurer: t.Object(
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
    coverageRows: t.Optional(
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
    policies: t.Optional(
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

export const InsuranceProductRelationsInputUpdate = t.Partial(
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
      insurer: t.Object(
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
      coverageRows: t.Partial(
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
      policies: t.Partial(
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

export const InsuranceProductWhere = t.Partial(
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
          insurerId: t.String(),
          name: t.String(),
          coveragePercentDefault: t.Number(),
          annualCap: t.Number(),
          perClaimCap: t.Number(),
          deductibleFixed: t.Number(),
          deductiblePercent: t.Number(),
          active: t.Boolean(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "InsuranceProduct" },
  ),
);

export const InsuranceProductWhereUnique = t.Recursive(
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
              insurerId: t.String(),
              name: t.String(),
              coveragePercentDefault: t.Number(),
              annualCap: t.Number(),
              perClaimCap: t.Number(),
              deductibleFixed: t.Number(),
              deductiblePercent: t.Number(),
              active: t.Boolean(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "InsuranceProduct" },
);

export const InsuranceProductSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      code: t.Boolean(),
      clinicId: t.Boolean(),
      insurerId: t.Boolean(),
      name: t.Boolean(),
      coveragePercentDefault: t.Boolean(),
      annualCap: t.Boolean(),
      perClaimCap: t.Boolean(),
      deductibleFixed: t.Boolean(),
      deductiblePercent: t.Boolean(),
      active: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinic: t.Boolean(),
      insurer: t.Boolean(),
      coverageRows: t.Boolean(),
      policies: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const InsuranceProductInclude = t.Partial(
  t.Object(
    {
      clinic: t.Boolean(),
      insurer: t.Boolean(),
      coverageRows: t.Boolean(),
      policies: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const InsuranceProductOrderBy = t.Partial(
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
      insurerId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      name: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      coveragePercentDefault: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      annualCap: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      perClaimCap: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      deductibleFixed: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      deductiblePercent: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      active: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const InsuranceProduct = t.Composite(
  [InsuranceProductPlain, InsuranceProductRelations],
  { additionalProperties: false },
);

export const InsuranceProductInputCreate = t.Composite(
  [InsuranceProductPlainInputCreate, InsuranceProductRelationsInputCreate],
  { additionalProperties: false },
);

export const InsuranceProductInputUpdate = t.Composite(
  [InsuranceProductPlainInputUpdate, InsuranceProductRelationsInputUpdate],
  { additionalProperties: false },
);
