import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const MonthlyDistributionPercentagePlain = t.Object(
  {
    id: t.String(),
    distributionId: t.String(),
    month: t.Integer(),
    percentage: t.Number(),
  },
  { additionalProperties: false },
);

export const MonthlyDistributionPercentageRelations = t.Object(
  {
    distribution: t.Object(
      {
        id: t.String(),
        clinicId: t.String(),
        distributionName: t.String(),
        fiscalYear: t.String(),
        createdById: __nullable__(t.String()),
        createdAt: t.Date(),
        updatedAt: t.Date(),
      },
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const MonthlyDistributionPercentagePlainInputCreate = t.Object(
  { month: t.Integer(), percentage: t.Number() },
  { additionalProperties: false },
);

export const MonthlyDistributionPercentagePlainInputUpdate = t.Object(
  { month: t.Optional(t.Integer()), percentage: t.Optional(t.Number()) },
  { additionalProperties: false },
);

export const MonthlyDistributionPercentageRelationsInputCreate = t.Object(
  {
    distribution: t.Object(
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

export const MonthlyDistributionPercentageRelationsInputUpdate = t.Partial(
  t.Object(
    {
      distribution: t.Object(
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

export const MonthlyDistributionPercentageWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          distributionId: t.String(),
          month: t.Integer(),
          percentage: t.Number(),
        },
        { additionalProperties: false },
      ),
    { $id: "MonthlyDistributionPercentage" },
  ),
);

export const MonthlyDistributionPercentageWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            {
              id: t.String(),
              distributionId_month: t.Object(
                { distributionId: t.String(), month: t.Integer() },
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
              distributionId_month: t.Object(
                { distributionId: t.String(), month: t.Integer() },
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
              distributionId: t.String(),
              month: t.Integer(),
              percentage: t.Number(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "MonthlyDistributionPercentage" },
);

export const MonthlyDistributionPercentageSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      distributionId: t.Boolean(),
      month: t.Boolean(),
      percentage: t.Boolean(),
      distribution: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const MonthlyDistributionPercentageInclude = t.Partial(
  t.Object(
    { distribution: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const MonthlyDistributionPercentageOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      distributionId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      month: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      percentage: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const MonthlyDistributionPercentage = t.Composite(
  [MonthlyDistributionPercentagePlain, MonthlyDistributionPercentageRelations],
  { additionalProperties: false },
);

export const MonthlyDistributionPercentageInputCreate = t.Composite(
  [
    MonthlyDistributionPercentagePlainInputCreate,
    MonthlyDistributionPercentageRelationsInputCreate,
  ],
  { additionalProperties: false },
);

export const MonthlyDistributionPercentageInputUpdate = t.Composite(
  [
    MonthlyDistributionPercentagePlainInputUpdate,
    MonthlyDistributionPercentageRelationsInputUpdate,
  ],
  { additionalProperties: false },
);
