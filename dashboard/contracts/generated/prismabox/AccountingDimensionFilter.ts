import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const AccountingDimensionFilterPlain = t.Object(
  {
    id: t.String(),
    clinicId: t.String(),
    dimensionId: t.String(),
    allowOnly: t.Boolean(),
    disabled: t.Boolean(),
    createdById: __nullable__(t.String()),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  },
  { additionalProperties: false },
);

export const AccountingDimensionFilterRelations = t.Object(
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
    dimension: t.Object(
      {
        id: t.String(),
        clinicId: t.String(),
        slot: t.Integer(),
        dimensionName: t.String(),
        referenceDoctype: __nullable__(t.String()),
        disabled: t.Boolean(),
        mandatoryForBalanceSheet: t.Boolean(),
        mandatoryForProfitAndLoss: t.Boolean(),
        defaultDimensionValue: __nullable__(t.String()),
        autoPostBalancingEntry: t.Boolean(),
        offsettingAccountId: __nullable__(t.String()),
        createdById: __nullable__(t.String()),
        createdAt: t.Date(),
        updatedAt: t.Date(),
      },
      { additionalProperties: false },
    ),
    accounts: t.Array(
      t.Object(
        { id: t.String(), filterId: t.String(), accountId: t.String() },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    values: t.Array(
      t.Object(
        { id: t.String(), filterId: t.String(), dimValue: t.String() },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const AccountingDimensionFilterPlainInputCreate = t.Object(
  { allowOnly: t.Optional(t.Boolean()), disabled: t.Optional(t.Boolean()) },
  { additionalProperties: false },
);

export const AccountingDimensionFilterPlainInputUpdate = t.Object(
  { allowOnly: t.Optional(t.Boolean()), disabled: t.Optional(t.Boolean()) },
  { additionalProperties: false },
);

export const AccountingDimensionFilterRelationsInputCreate = t.Object(
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
    dimension: t.Object(
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
    accounts: t.Optional(
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
    values: t.Optional(
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

export const AccountingDimensionFilterRelationsInputUpdate = t.Partial(
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
      dimension: t.Object(
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
      accounts: t.Partial(
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
      values: t.Partial(
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

export const AccountingDimensionFilterWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          clinicId: t.String(),
          dimensionId: t.String(),
          allowOnly: t.Boolean(),
          disabled: t.Boolean(),
          createdById: t.String(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "AccountingDimensionFilter" },
  ),
);

export const AccountingDimensionFilterWhereUnique = t.Recursive(
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
              dimensionId: t.String(),
              allowOnly: t.Boolean(),
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
  { $id: "AccountingDimensionFilter" },
);

export const AccountingDimensionFilterSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      clinicId: t.Boolean(),
      dimensionId: t.Boolean(),
      allowOnly: t.Boolean(),
      disabled: t.Boolean(),
      createdById: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinic: t.Boolean(),
      dimension: t.Boolean(),
      accounts: t.Boolean(),
      values: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const AccountingDimensionFilterInclude = t.Partial(
  t.Object(
    {
      clinic: t.Boolean(),
      dimension: t.Boolean(),
      accounts: t.Boolean(),
      values: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const AccountingDimensionFilterOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clinicId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      dimensionId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      allowOnly: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const AccountingDimensionFilter = t.Composite(
  [AccountingDimensionFilterPlain, AccountingDimensionFilterRelations],
  { additionalProperties: false },
);

export const AccountingDimensionFilterInputCreate = t.Composite(
  [
    AccountingDimensionFilterPlainInputCreate,
    AccountingDimensionFilterRelationsInputCreate,
  ],
  { additionalProperties: false },
);

export const AccountingDimensionFilterInputUpdate = t.Composite(
  [
    AccountingDimensionFilterPlainInputUpdate,
    AccountingDimensionFilterRelationsInputUpdate,
  ],
  { additionalProperties: false },
);
