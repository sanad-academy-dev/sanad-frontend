import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const OperationComplicationPlain = t.Object(
  {
    id: t.String(),
    caseId: t.String(),
    phase: t.Union(
      [t.Literal("INTRA_OP"), t.Literal("RECOVERY"), t.Literal("POST_OP")],
      { additionalProperties: false },
    ),
    clavienDindoGrade: __nullable__(
      t.Union(
        [
          t.Literal("GRADE_I"),
          t.Literal("GRADE_II"),
          t.Literal("GRADE_IIIA"),
          t.Literal("GRADE_IIIB"),
          t.Literal("GRADE_IVA"),
          t.Literal("GRADE_IVB"),
          t.Literal("GRADE_V"),
        ],
        { additionalProperties: false },
      ),
    ),
    isSSI: t.Boolean(),
    kind: t.String(),
    occurredAt: t.Date(),
    detail: __nullable__(t.String()),
    reportedById: t.String(),
    createdAt: t.Date(),
  },
  { additionalProperties: false },
);

export const OperationComplicationRelations = t.Object(
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
    reportedBy: t.Object(
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

export const OperationComplicationPlainInputCreate = t.Object(
  {
    phase: t.Union(
      [t.Literal("INTRA_OP"), t.Literal("RECOVERY"), t.Literal("POST_OP")],
      { additionalProperties: false },
    ),
    clavienDindoGrade: t.Optional(
      __nullable__(
        t.Union(
          [
            t.Literal("GRADE_I"),
            t.Literal("GRADE_II"),
            t.Literal("GRADE_IIIA"),
            t.Literal("GRADE_IIIB"),
            t.Literal("GRADE_IVA"),
            t.Literal("GRADE_IVB"),
            t.Literal("GRADE_V"),
          ],
          { additionalProperties: false },
        ),
      ),
    ),
    isSSI: t.Optional(t.Boolean()),
    kind: t.String(),
    occurredAt: t.Optional(t.Date()),
    detail: t.Optional(__nullable__(t.String())),
  },
  { additionalProperties: false },
);

export const OperationComplicationPlainInputUpdate = t.Object(
  {
    phase: t.Optional(
      t.Union(
        [t.Literal("INTRA_OP"), t.Literal("RECOVERY"), t.Literal("POST_OP")],
        { additionalProperties: false },
      ),
    ),
    clavienDindoGrade: t.Optional(
      __nullable__(
        t.Union(
          [
            t.Literal("GRADE_I"),
            t.Literal("GRADE_II"),
            t.Literal("GRADE_IIIA"),
            t.Literal("GRADE_IIIB"),
            t.Literal("GRADE_IVA"),
            t.Literal("GRADE_IVB"),
            t.Literal("GRADE_V"),
          ],
          { additionalProperties: false },
        ),
      ),
    ),
    isSSI: t.Optional(t.Boolean()),
    kind: t.Optional(t.String()),
    occurredAt: t.Optional(t.Date()),
    detail: t.Optional(__nullable__(t.String())),
  },
  { additionalProperties: false },
);

export const OperationComplicationRelationsInputCreate = t.Object(
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
    reportedBy: t.Object(
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

export const OperationComplicationRelationsInputUpdate = t.Partial(
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
      reportedBy: t.Object(
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

export const OperationComplicationWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          caseId: t.String(),
          phase: t.Union(
            [
              t.Literal("INTRA_OP"),
              t.Literal("RECOVERY"),
              t.Literal("POST_OP"),
            ],
            { additionalProperties: false },
          ),
          clavienDindoGrade: t.Union(
            [
              t.Literal("GRADE_I"),
              t.Literal("GRADE_II"),
              t.Literal("GRADE_IIIA"),
              t.Literal("GRADE_IIIB"),
              t.Literal("GRADE_IVA"),
              t.Literal("GRADE_IVB"),
              t.Literal("GRADE_V"),
            ],
            { additionalProperties: false },
          ),
          isSSI: t.Boolean(),
          kind: t.String(),
          occurredAt: t.Date(),
          detail: t.String(),
          reportedById: t.String(),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "OperationComplication" },
  ),
);

export const OperationComplicationWhereUnique = t.Recursive(
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
              phase: t.Union(
                [
                  t.Literal("INTRA_OP"),
                  t.Literal("RECOVERY"),
                  t.Literal("POST_OP"),
                ],
                { additionalProperties: false },
              ),
              clavienDindoGrade: t.Union(
                [
                  t.Literal("GRADE_I"),
                  t.Literal("GRADE_II"),
                  t.Literal("GRADE_IIIA"),
                  t.Literal("GRADE_IIIB"),
                  t.Literal("GRADE_IVA"),
                  t.Literal("GRADE_IVB"),
                  t.Literal("GRADE_V"),
                ],
                { additionalProperties: false },
              ),
              isSSI: t.Boolean(),
              kind: t.String(),
              occurredAt: t.Date(),
              detail: t.String(),
              reportedById: t.String(),
              createdAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "OperationComplication" },
);

export const OperationComplicationSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      caseId: t.Boolean(),
      phase: t.Boolean(),
      clavienDindoGrade: t.Boolean(),
      isSSI: t.Boolean(),
      kind: t.Boolean(),
      occurredAt: t.Boolean(),
      detail: t.Boolean(),
      reportedById: t.Boolean(),
      createdAt: t.Boolean(),
      case: t.Boolean(),
      reportedBy: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const OperationComplicationInclude = t.Partial(
  t.Object(
    {
      phase: t.Boolean(),
      clavienDindoGrade: t.Boolean(),
      case: t.Boolean(),
      reportedBy: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const OperationComplicationOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      caseId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      isSSI: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      kind: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      occurredAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      detail: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      reportedById: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const OperationComplication = t.Composite(
  [OperationComplicationPlain, OperationComplicationRelations],
  { additionalProperties: false },
);

export const OperationComplicationInputCreate = t.Composite(
  [
    OperationComplicationPlainInputCreate,
    OperationComplicationRelationsInputCreate,
  ],
  { additionalProperties: false },
);

export const OperationComplicationInputUpdate = t.Composite(
  [
    OperationComplicationPlainInputUpdate,
    OperationComplicationRelationsInputUpdate,
  ],
  { additionalProperties: false },
);
