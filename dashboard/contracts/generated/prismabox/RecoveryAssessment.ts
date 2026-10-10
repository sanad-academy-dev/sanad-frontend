import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const RecoveryAssessmentPlain = t.Object(
  {
    id: t.String(),
    caseId: t.String(),
    at: t.Date(),
    score: __nullable__(t.Integer()),
    painScale: __nullable__(
      t.Union(
        [
          t.Literal("GLASGOW_CMPS"),
          t.Literal("NRS"),
          t.Literal("VAS"),
          t.Literal("FLACC"),
          t.Literal("OTHER"),
        ],
        { additionalProperties: false },
      ),
    ),
    painScore: __nullable__(t.Integer()),
    notes: __nullable__(t.String()),
    assessedById: t.String(),
  },
  { additionalProperties: false },
);

export const RecoveryAssessmentRelations = t.Object(
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
    assessedBy: t.Object(
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
  },
  { additionalProperties: false },
);

export const RecoveryAssessmentPlainInputCreate = t.Object(
  {
    at: t.Optional(t.Date()),
    score: t.Optional(__nullable__(t.Integer())),
    painScale: t.Optional(
      __nullable__(
        t.Union(
          [
            t.Literal("GLASGOW_CMPS"),
            t.Literal("NRS"),
            t.Literal("VAS"),
            t.Literal("FLACC"),
            t.Literal("OTHER"),
          ],
          { additionalProperties: false },
        ),
      ),
    ),
    painScore: t.Optional(__nullable__(t.Integer())),
    notes: t.Optional(__nullable__(t.String())),
  },
  { additionalProperties: false },
);

export const RecoveryAssessmentPlainInputUpdate = t.Object(
  {
    at: t.Optional(t.Date()),
    score: t.Optional(__nullable__(t.Integer())),
    painScale: t.Optional(
      __nullable__(
        t.Union(
          [
            t.Literal("GLASGOW_CMPS"),
            t.Literal("NRS"),
            t.Literal("VAS"),
            t.Literal("FLACC"),
            t.Literal("OTHER"),
          ],
          { additionalProperties: false },
        ),
      ),
    ),
    painScore: t.Optional(__nullable__(t.Integer())),
    notes: t.Optional(__nullable__(t.String())),
  },
  { additionalProperties: false },
);

export const RecoveryAssessmentRelationsInputCreate = t.Object(
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
    assessedBy: t.Object(
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

export const RecoveryAssessmentRelationsInputUpdate = t.Partial(
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
      assessedBy: t.Object(
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

export const RecoveryAssessmentWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          caseId: t.String(),
          at: t.Date(),
          score: t.Integer(),
          painScale: t.Union(
            [
              t.Literal("GLASGOW_CMPS"),
              t.Literal("NRS"),
              t.Literal("VAS"),
              t.Literal("FLACC"),
              t.Literal("OTHER"),
            ],
            { additionalProperties: false },
          ),
          painScore: t.Integer(),
          notes: t.String(),
          assessedById: t.String(),
        },
        { additionalProperties: false },
      ),
    { $id: "RecoveryAssessment" },
  ),
);

export const RecoveryAssessmentWhereUnique = t.Recursive(
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
              caseId: t.String(),
              at: t.Date(),
              score: t.Integer(),
              painScale: t.Union(
                [
                  t.Literal("GLASGOW_CMPS"),
                  t.Literal("NRS"),
                  t.Literal("VAS"),
                  t.Literal("FLACC"),
                  t.Literal("OTHER"),
                ],
                { additionalProperties: false },
              ),
              painScore: t.Integer(),
              notes: t.String(),
              assessedById: t.String(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "RecoveryAssessment" },
);

export const RecoveryAssessmentSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      caseId: t.Boolean(),
      at: t.Boolean(),
      score: t.Boolean(),
      painScale: t.Boolean(),
      painScore: t.Boolean(),
      notes: t.Boolean(),
      assessedById: t.Boolean(),
      case: t.Boolean(),
      assessedBy: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const RecoveryAssessmentInclude = t.Partial(
  t.Object(
    {
      painScale: t.Boolean(),
      case: t.Boolean(),
      assessedBy: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const RecoveryAssessmentOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      caseId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      at: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      score: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      painScore: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      notes: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      assessedById: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const RecoveryAssessment = t.Composite(
  [RecoveryAssessmentPlain, RecoveryAssessmentRelations],
  { additionalProperties: false },
);

export const RecoveryAssessmentInputCreate = t.Composite(
  [RecoveryAssessmentPlainInputCreate, RecoveryAssessmentRelationsInputCreate],
  { additionalProperties: false },
);

export const RecoveryAssessmentInputUpdate = t.Composite(
  [RecoveryAssessmentPlainInputUpdate, RecoveryAssessmentRelationsInputUpdate],
  { additionalProperties: false },
);
