import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const InsuranceProductCoveragePlain = t.Object(
  {
    id: t.String(),
    productId: t.String(),
    idx: t.Integer(),
    serviceId: t.String(),
    coveragePercent: t.Number(),
  },
  { additionalProperties: false },
);

export const InsuranceProductCoverageRelations = t.Object(
  {
    product: t.Object(
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
    ),
    service: t.Object(
      {
        id: t.String(),
        name: t.String(),
        level: t.Union(
          [t.Literal("CATEGORY"), t.Literal("SUBCATEGORY"), t.Literal("ITEM")],
          { additionalProperties: false },
        ),
        parentId: __nullable__(t.String()),
        isDefault: t.Boolean(),
        clinicId: __nullable__(t.String()),
        order: t.Integer(),
        isLabCategory: t.Boolean(),
        isRadiologyCategory: t.Boolean(),
        isOperationCategory: t.Boolean(),
        isGroomingCategory: t.Boolean(),
        consentCode: __nullable__(t.String()),
        createdAt: t.Date(),
      },
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const InsuranceProductCoveragePlainInputCreate = t.Object(
  { idx: t.Integer(), coveragePercent: t.Number() },
  { additionalProperties: false },
);

export const InsuranceProductCoveragePlainInputUpdate = t.Object(
  { idx: t.Optional(t.Integer()), coveragePercent: t.Optional(t.Number()) },
  { additionalProperties: false },
);

export const InsuranceProductCoverageRelationsInputCreate = t.Object(
  {
    product: t.Object(
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
    service: t.Object(
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

export const InsuranceProductCoverageRelationsInputUpdate = t.Partial(
  t.Object(
    {
      product: t.Object(
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
      service: t.Object(
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

export const InsuranceProductCoverageWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          productId: t.String(),
          idx: t.Integer(),
          serviceId: t.String(),
          coveragePercent: t.Number(),
        },
        { additionalProperties: false },
      ),
    { $id: "InsuranceProductCoverage" },
  ),
);

export const InsuranceProductCoverageWhereUnique = t.Recursive(
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
              productId: t.String(),
              idx: t.Integer(),
              serviceId: t.String(),
              coveragePercent: t.Number(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "InsuranceProductCoverage" },
);

export const InsuranceProductCoverageSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      productId: t.Boolean(),
      idx: t.Boolean(),
      serviceId: t.Boolean(),
      coveragePercent: t.Boolean(),
      product: t.Boolean(),
      service: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const InsuranceProductCoverageInclude = t.Partial(
  t.Object(
    { product: t.Boolean(), service: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const InsuranceProductCoverageOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      productId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      idx: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      serviceId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      coveragePercent: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const InsuranceProductCoverage = t.Composite(
  [InsuranceProductCoveragePlain, InsuranceProductCoverageRelations],
  { additionalProperties: false },
);

export const InsuranceProductCoverageInputCreate = t.Composite(
  [
    InsuranceProductCoveragePlainInputCreate,
    InsuranceProductCoverageRelationsInputCreate,
  ],
  { additionalProperties: false },
);

export const InsuranceProductCoverageInputUpdate = t.Composite(
  [
    InsuranceProductCoveragePlainInputUpdate,
    InsuranceProductCoverageRelationsInputUpdate,
  ],
  { additionalProperties: false },
);
