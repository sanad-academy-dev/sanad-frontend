import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const OperationCountPlain = t.Object(
  {
    id: t.String(),
    caseId: t.String(),
    type: t.Union(
      [t.Literal("SPONGE"), t.Literal("NEEDLE"), t.Literal("INSTRUMENT")],
      { additionalProperties: false },
    ),
    initialCount: __nullable__(t.Integer()),
    finalCount: __nullable__(t.Integer()),
    reconciled: t.Boolean(),
    discrepancyNote: __nullable__(t.String()),
    updatedAt: t.Date(),
  },
  { additionalProperties: false },
);

export const OperationCountRelations = t.Object(
  {
    case: t.Object(
      {
        id: t.String(),
        code: t.String(),
        clinicId: t.String(),
        branchId: t.String(),
        patientId: t.String(),
        ownerId: t.String(),
        appointmentId: __nullable__(t.String()),
        status: t.Union(
          [
            t.Literal("SCHEDULED"),
            t.Literal("PREP"),
            t.Literal("ANESTHESIA"),
            t.Literal("SURGERY"),
            t.Literal("RECOVERY"),
            t.Literal("DISCHARGE"),
            t.Literal("FOLLOW_UP"),
            t.Literal("COMPLETED"),
            t.Literal("CANCELLED"),
          ],
          { additionalProperties: false },
        ),
        stage: __nullable__(
          t.Union(
            [
              t.Literal("CONSENT"),
              t.Literal("FASTING_CHECK"),
              t.Literal("ASSESSMENT"),
              t.Literal("PREMED"),
              t.Literal("SIGN_IN"),
              t.Literal("INDUCTION"),
              t.Literal("MAINTENANCE"),
              t.Literal("TIME_OUT"),
              t.Literal("IN_PROGRESS"),
              t.Literal("CLOSING"),
              t.Literal("SIGN_OUT"),
              t.Literal("MONITORING"),
              t.Literal("READY_FOR_DISCHARGE"),
            ],
            { additionalProperties: false },
          ),
        ),
        tier: t.Union(
          [t.Literal("MINOR"), t.Literal("INTERMEDIATE"), t.Literal("MAJOR")],
          { additionalProperties: false },
        ),
        tierOverrideReason: __nullable__(t.String()),
        urgency: t.Union(
          [
            t.Literal("IMMEDIATE"),
            t.Literal("URGENT"),
            t.Literal("EXPEDITED"),
            t.Literal("ELECTIVE"),
          ],
          { additionalProperties: false },
        ),
        plannedAnesthesia: t.Union(
          [
            t.Literal("NONE"),
            t.Literal("ANXIOLYSIS"),
            t.Literal("SEDATION"),
            t.Literal("GENERAL_ANESTHESIA"),
          ],
          { additionalProperties: false },
        ),
        scheduledAt: __nullable__(t.Date()),
        estimatedDurationMin: t.Integer(),
        ssiSurveillanceUntil: __nullable__(t.Date()),
        roomId: __nullable__(t.String()),
        diagnosis: __nullable__(t.String()),
        clinicalSummary: __nullable__(t.String()),
        cancelKind: __nullable__(
          t.Union(
            [t.Literal("OWNER"), t.Literal("CLINIC"), t.Literal("CLINICAL")],
            { additionalProperties: false },
          ),
        ),
        cancelReason: __nullable__(t.String()),
        isDeleted: t.Boolean(),
        deletedAt: __nullable__(t.Date()),
        createdAt: t.Date(),
        updatedAt: t.Date(),
      },
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const OperationCountPlainInputCreate = t.Object(
  {
    type: t.Union(
      [t.Literal("SPONGE"), t.Literal("NEEDLE"), t.Literal("INSTRUMENT")],
      { additionalProperties: false },
    ),
    initialCount: t.Optional(__nullable__(t.Integer())),
    finalCount: t.Optional(__nullable__(t.Integer())),
    reconciled: t.Optional(t.Boolean()),
    discrepancyNote: t.Optional(__nullable__(t.String())),
  },
  { additionalProperties: false },
);

export const OperationCountPlainInputUpdate = t.Object(
  {
    type: t.Optional(
      t.Union(
        [t.Literal("SPONGE"), t.Literal("NEEDLE"), t.Literal("INSTRUMENT")],
        { additionalProperties: false },
      ),
    ),
    initialCount: t.Optional(__nullable__(t.Integer())),
    finalCount: t.Optional(__nullable__(t.Integer())),
    reconciled: t.Optional(t.Boolean()),
    discrepancyNote: t.Optional(__nullable__(t.String())),
  },
  { additionalProperties: false },
);

export const OperationCountRelationsInputCreate = t.Object(
  {
    case: t.Object(
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

export const OperationCountRelationsInputUpdate = t.Partial(
  t.Object(
    {
      case: t.Object(
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

export const OperationCountWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          caseId: t.String(),
          type: t.Union(
            [t.Literal("SPONGE"), t.Literal("NEEDLE"), t.Literal("INSTRUMENT")],
            { additionalProperties: false },
          ),
          initialCount: t.Integer(),
          finalCount: t.Integer(),
          reconciled: t.Boolean(),
          discrepancyNote: t.String(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "OperationCount" },
  ),
);

export const OperationCountWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            {
              id: t.String(),
              caseId_type: t.Object(
                {
                  caseId: t.String(),
                  type: t.Union(
                    [
                      t.Literal("SPONGE"),
                      t.Literal("NEEDLE"),
                      t.Literal("INSTRUMENT"),
                    ],
                    { additionalProperties: false },
                  ),
                },
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
              caseId_type: t.Object(
                {
                  caseId: t.String(),
                  type: t.Union(
                    [
                      t.Literal("SPONGE"),
                      t.Literal("NEEDLE"),
                      t.Literal("INSTRUMENT"),
                    ],
                    { additionalProperties: false },
                  ),
                },
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
              caseId: t.String(),
              type: t.Union(
                [
                  t.Literal("SPONGE"),
                  t.Literal("NEEDLE"),
                  t.Literal("INSTRUMENT"),
                ],
                { additionalProperties: false },
              ),
              initialCount: t.Integer(),
              finalCount: t.Integer(),
              reconciled: t.Boolean(),
              discrepancyNote: t.String(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "OperationCount" },
);

export const OperationCountSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      caseId: t.Boolean(),
      type: t.Boolean(),
      initialCount: t.Boolean(),
      finalCount: t.Boolean(),
      reconciled: t.Boolean(),
      discrepancyNote: t.Boolean(),
      updatedAt: t.Boolean(),
      case: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const OperationCountInclude = t.Partial(
  t.Object(
    { type: t.Boolean(), case: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const OperationCountOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      caseId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      initialCount: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      finalCount: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      reconciled: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      discrepancyNote: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      updatedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const OperationCount = t.Composite(
  [OperationCountPlain, OperationCountRelations],
  { additionalProperties: false },
);

export const OperationCountInputCreate = t.Composite(
  [OperationCountPlainInputCreate, OperationCountRelationsInputCreate],
  { additionalProperties: false },
);

export const OperationCountInputUpdate = t.Composite(
  [OperationCountPlainInputUpdate, OperationCountRelationsInputUpdate],
  { additionalProperties: false },
);
