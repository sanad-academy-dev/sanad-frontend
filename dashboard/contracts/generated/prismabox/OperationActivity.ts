import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const OperationActivityPlain = t.Object(
  {
    id: t.String(),
    caseId: t.String(),
    type: t.Union(
      [
        t.Literal("CREATED"),
        t.Literal("STATUS_CHANGED"),
        t.Literal("STAGE_CHANGED"),
        t.Literal("SCHEDULE_CHANGED"),
        t.Literal("TEAM_CHANGED"),
        t.Literal("URGENCY_CHANGED"),
        t.Literal("GATE_OVERRIDDEN"),
        t.Literal("CANCELLED"),
        t.Literal("NOTE"),
        t.Literal("CONSENT_SIGNED"),
        t.Literal("CONSENT_REVOKED"),
        t.Literal("ASSESSMENT_UPDATED"),
        t.Literal("CHECKLIST_COMPLETED"),
        t.Literal("NOTE_SIGNED"),
      ],
      { additionalProperties: false },
    ),
    detail: __nullable__(t.String()),
    authorUserId: __nullable__(t.String()),
    createdAt: t.Date(),
  },
  { additionalProperties: false },
);

export const OperationActivityRelations = t.Object(
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
    author: __nullable__(
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

export const OperationActivityPlainInputCreate = t.Object(
  {
    type: t.Union(
      [
        t.Literal("CREATED"),
        t.Literal("STATUS_CHANGED"),
        t.Literal("STAGE_CHANGED"),
        t.Literal("SCHEDULE_CHANGED"),
        t.Literal("TEAM_CHANGED"),
        t.Literal("URGENCY_CHANGED"),
        t.Literal("GATE_OVERRIDDEN"),
        t.Literal("CANCELLED"),
        t.Literal("NOTE"),
        t.Literal("CONSENT_SIGNED"),
        t.Literal("CONSENT_REVOKED"),
        t.Literal("ASSESSMENT_UPDATED"),
        t.Literal("CHECKLIST_COMPLETED"),
        t.Literal("NOTE_SIGNED"),
      ],
      { additionalProperties: false },
    ),
    detail: t.Optional(__nullable__(t.String())),
  },
  { additionalProperties: false },
);

export const OperationActivityPlainInputUpdate = t.Object(
  {
    type: t.Optional(
      t.Union(
        [
          t.Literal("CREATED"),
          t.Literal("STATUS_CHANGED"),
          t.Literal("STAGE_CHANGED"),
          t.Literal("SCHEDULE_CHANGED"),
          t.Literal("TEAM_CHANGED"),
          t.Literal("URGENCY_CHANGED"),
          t.Literal("GATE_OVERRIDDEN"),
          t.Literal("CANCELLED"),
          t.Literal("NOTE"),
          t.Literal("CONSENT_SIGNED"),
          t.Literal("CONSENT_REVOKED"),
          t.Literal("ASSESSMENT_UPDATED"),
          t.Literal("CHECKLIST_COMPLETED"),
          t.Literal("NOTE_SIGNED"),
        ],
        { additionalProperties: false },
      ),
    ),
    detail: t.Optional(__nullable__(t.String())),
  },
  { additionalProperties: false },
);

export const OperationActivityRelationsInputCreate = t.Object(
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
    author: t.Optional(
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

export const OperationActivityRelationsInputUpdate = t.Partial(
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
      author: t.Partial(
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

export const OperationActivityWhere = t.Partial(
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
            [
              t.Literal("CREATED"),
              t.Literal("STATUS_CHANGED"),
              t.Literal("STAGE_CHANGED"),
              t.Literal("SCHEDULE_CHANGED"),
              t.Literal("TEAM_CHANGED"),
              t.Literal("URGENCY_CHANGED"),
              t.Literal("GATE_OVERRIDDEN"),
              t.Literal("CANCELLED"),
              t.Literal("NOTE"),
              t.Literal("CONSENT_SIGNED"),
              t.Literal("CONSENT_REVOKED"),
              t.Literal("ASSESSMENT_UPDATED"),
              t.Literal("CHECKLIST_COMPLETED"),
              t.Literal("NOTE_SIGNED"),
            ],
            { additionalProperties: false },
          ),
          detail: t.String(),
          authorUserId: t.String(),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "OperationActivity" },
  ),
);

export const OperationActivityWhereUnique = t.Recursive(
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
              type: t.Union(
                [
                  t.Literal("CREATED"),
                  t.Literal("STATUS_CHANGED"),
                  t.Literal("STAGE_CHANGED"),
                  t.Literal("SCHEDULE_CHANGED"),
                  t.Literal("TEAM_CHANGED"),
                  t.Literal("URGENCY_CHANGED"),
                  t.Literal("GATE_OVERRIDDEN"),
                  t.Literal("CANCELLED"),
                  t.Literal("NOTE"),
                  t.Literal("CONSENT_SIGNED"),
                  t.Literal("CONSENT_REVOKED"),
                  t.Literal("ASSESSMENT_UPDATED"),
                  t.Literal("CHECKLIST_COMPLETED"),
                  t.Literal("NOTE_SIGNED"),
                ],
                { additionalProperties: false },
              ),
              detail: t.String(),
              authorUserId: t.String(),
              createdAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "OperationActivity" },
);

export const OperationActivitySelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      caseId: t.Boolean(),
      type: t.Boolean(),
      detail: t.Boolean(),
      authorUserId: t.Boolean(),
      createdAt: t.Boolean(),
      case: t.Boolean(),
      author: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const OperationActivityInclude = t.Partial(
  t.Object(
    {
      type: t.Boolean(),
      case: t.Boolean(),
      author: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const OperationActivityOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      caseId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      detail: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      authorUserId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const OperationActivity = t.Composite(
  [OperationActivityPlain, OperationActivityRelations],
  { additionalProperties: false },
);

export const OperationActivityInputCreate = t.Composite(
  [OperationActivityPlainInputCreate, OperationActivityRelationsInputCreate],
  { additionalProperties: false },
);

export const OperationActivityInputUpdate = t.Composite(
  [OperationActivityPlainInputUpdate, OperationActivityRelationsInputUpdate],
  { additionalProperties: false },
);
