import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const InsuranceClaimLinePlain = t.Object(
  {
    id: t.String(),
    claimId: t.String(),
    idx: t.Integer(),
    lineRef: t.String(),
    description: t.String(),
    lineTotal: t.Number(),
    coveragePercent: t.Number(),
    insurerAmount: t.Number(),
  },
  { additionalProperties: false },
);

export const InsuranceClaimLineRelations = t.Object(
  {
    claim: t.Object(
      {
        id: t.String(),
        clinicId: t.String(),
        documentNo: __nullable__(t.String()),
        invoiceId: t.String(),
        policyId: t.String(),
        insurerId: t.String(),
        patientId: t.String(),
        ownerId: t.String(),
        policyNumberSnapshot: t.String(),
        serviceDate: t.Date(),
        claimedAmount: t.Number(),
        approvedAmount: __nullable__(t.Number()),
        settledAmount: t.Number(),
        status: t.Union(
          [
            t.Literal("DRAFT"),
            t.Literal("SUBMITTED"),
            t.Literal("APPROVED"),
            t.Literal("PARTIALLY_APPROVED"),
            t.Literal("REJECTED"),
            t.Literal("SETTLED"),
            t.Literal("CANCELLED"),
          ],
          { additionalProperties: false },
        ),
        coverageSnapshot: t.Any(),
        submittedAt: __nullable__(t.Date()),
        adjudicatedAt: __nullable__(t.Date()),
        rejectionReason: __nullable__(t.String()),
        insurerReference: __nullable__(t.String()),
        rejectionResolution: __nullable__(
          t.Union([t.Literal("REBILL_OWNER"), t.Literal("WRITE_OFF")], {
            additionalProperties: false,
          }),
        ),
        resolutionJournalEntryId: __nullable__(t.String()),
        resolvedAt: __nullable__(t.Date()),
        createdAt: t.Date(),
        updatedAt: t.Date(),
      },
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const InsuranceClaimLinePlainInputCreate = t.Object(
  {
    idx: t.Integer(),
    lineRef: t.String(),
    description: t.String(),
    lineTotal: t.Number(),
    coveragePercent: t.Number(),
    insurerAmount: t.Number(),
  },
  { additionalProperties: false },
);

export const InsuranceClaimLinePlainInputUpdate = t.Object(
  {
    idx: t.Optional(t.Integer()),
    lineRef: t.Optional(t.String()),
    description: t.Optional(t.String()),
    lineTotal: t.Optional(t.Number()),
    coveragePercent: t.Optional(t.Number()),
    insurerAmount: t.Optional(t.Number()),
  },
  { additionalProperties: false },
);

export const InsuranceClaimLineRelationsInputCreate = t.Object(
  {
    claim: t.Object(
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

export const InsuranceClaimLineRelationsInputUpdate = t.Partial(
  t.Object(
    {
      claim: t.Object(
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

export const InsuranceClaimLineWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          claimId: t.String(),
          idx: t.Integer(),
          lineRef: t.String(),
          description: t.String(),
          lineTotal: t.Number(),
          coveragePercent: t.Number(),
          insurerAmount: t.Number(),
        },
        { additionalProperties: false },
      ),
    { $id: "InsuranceClaimLine" },
  ),
);

export const InsuranceClaimLineWhereUnique = t.Recursive(
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
              claimId: t.String(),
              idx: t.Integer(),
              lineRef: t.String(),
              description: t.String(),
              lineTotal: t.Number(),
              coveragePercent: t.Number(),
              insurerAmount: t.Number(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "InsuranceClaimLine" },
);

export const InsuranceClaimLineSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      claimId: t.Boolean(),
      idx: t.Boolean(),
      lineRef: t.Boolean(),
      description: t.Boolean(),
      lineTotal: t.Boolean(),
      coveragePercent: t.Boolean(),
      insurerAmount: t.Boolean(),
      claim: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const InsuranceClaimLineInclude = t.Partial(
  t.Object(
    { claim: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const InsuranceClaimLineOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      claimId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      idx: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      lineRef: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      description: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      lineTotal: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      coveragePercent: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      insurerAmount: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const InsuranceClaimLine = t.Composite(
  [InsuranceClaimLinePlain, InsuranceClaimLineRelations],
  { additionalProperties: false },
);

export const InsuranceClaimLineInputCreate = t.Composite(
  [InsuranceClaimLinePlainInputCreate, InsuranceClaimLineRelationsInputCreate],
  { additionalProperties: false },
);

export const InsuranceClaimLineInputUpdate = t.Composite(
  [InsuranceClaimLinePlainInputUpdate, InsuranceClaimLineRelationsInputUpdate],
  { additionalProperties: false },
);
