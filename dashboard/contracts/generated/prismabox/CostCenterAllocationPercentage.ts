import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const CostCenterAllocationPercentagePlain = t.Object(
  {
    id: t.String(),
    allocationId: t.String(),
    costCenterId: t.String(),
    percentage: t.Number(),
  },
  { additionalProperties: false },
);

export const CostCenterAllocationPercentageRelations = t.Object(
  {
    allocation: t.Object(
      {
        id: t.String(),
        clinicId: t.String(),
        documentNo: __nullable__(t.String()),
        docstatus: t.Union(
          [t.Literal("DRAFT"), t.Literal("SUBMITTED"), t.Literal("CANCELLED")],
          { additionalProperties: false },
        ),
        amendedFromId: __nullable__(t.String()),
        mainCostCenterId: t.String(),
        validFrom: t.Date(),
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
    costCenter: t.Object(
      {
        id: t.String(),
        clinicId: t.String(),
        costCenterName: t.String(),
        costCenterNumber: __nullable__(t.String()),
        parentCostCenterId: __nullable__(t.String()),
        isGroup: t.Boolean(),
        disabled: t.Boolean(),
        lft: t.Integer(),
        rgt: t.Integer(),
        createdById: __nullable__(t.String()),
        createdAt: t.Date(),
        updatedAt: t.Date(),
      },
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const CostCenterAllocationPercentagePlainInputCreate = t.Object(
  { percentage: t.Number() },
  { additionalProperties: false },
);

export const CostCenterAllocationPercentagePlainInputUpdate = t.Object(
  { percentage: t.Optional(t.Number()) },
  { additionalProperties: false },
);

export const CostCenterAllocationPercentageRelationsInputCreate = t.Object(
  {
    allocation: t.Object(
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
    costCenter: t.Object(
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

export const CostCenterAllocationPercentageRelationsInputUpdate = t.Partial(
  t.Object(
    {
      allocation: t.Object(
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
      costCenter: t.Object(
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

export const CostCenterAllocationPercentageWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          allocationId: t.String(),
          costCenterId: t.String(),
          percentage: t.Number(),
        },
        { additionalProperties: false },
      ),
    { $id: "CostCenterAllocationPercentage" },
  ),
);

export const CostCenterAllocationPercentageWhereUnique = t.Recursive(
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
              allocationId: t.String(),
              costCenterId: t.String(),
              percentage: t.Number(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "CostCenterAllocationPercentage" },
);

export const CostCenterAllocationPercentageSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      allocationId: t.Boolean(),
      costCenterId: t.Boolean(),
      percentage: t.Boolean(),
      allocation: t.Boolean(),
      costCenter: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const CostCenterAllocationPercentageInclude = t.Partial(
  t.Object(
    { allocation: t.Boolean(), costCenter: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const CostCenterAllocationPercentageOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      allocationId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      costCenterId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      percentage: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const CostCenterAllocationPercentage = t.Composite(
  [
    CostCenterAllocationPercentagePlain,
    CostCenterAllocationPercentageRelations,
  ],
  { additionalProperties: false },
);

export const CostCenterAllocationPercentageInputCreate = t.Composite(
  [
    CostCenterAllocationPercentagePlainInputCreate,
    CostCenterAllocationPercentageRelationsInputCreate,
  ],
  { additionalProperties: false },
);

export const CostCenterAllocationPercentageInputUpdate = t.Composite(
  [
    CostCenterAllocationPercentagePlainInputUpdate,
    CostCenterAllocationPercentageRelationsInputUpdate,
  ],
  { additionalProperties: false },
);
