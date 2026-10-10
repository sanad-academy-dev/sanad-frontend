import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const OperationNotePlain = t.Object(
  {
    id: t.String(),
    caseId: t.String(),
    proceduresPerformed: __nullable__(t.String()),
    findings: __nullable__(t.String()),
    technique: __nullable__(t.String()),
    estimatedBloodLossMl: __nullable__(t.Integer()),
    complicationsNarrative: __nullable__(t.String()),
    closureDetails: __nullable__(t.String()),
    drainsPlaced: __nullable__(t.String()),
    signedById: __nullable__(t.String()),
    signedAt: __nullable__(t.Date()),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  },
  { additionalProperties: false },
);

export const OperationNoteRelations = t.Object(
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
    signedBy: __nullable__(
      t.Object(
        {
          id: t.String(),
          code: t.String(),
          clinicId: t.String(),
          userId: __nullable__(t.String()),
          roleId: t.String(),
          branchId: t.String(),
          name: t.String(),
          gender: __nullable__(
            t.Union(
              [t.Literal("MALE"), t.Literal("FEMALE"), t.Literal("UNKNOWN")],
              { additionalProperties: false },
            ),
          ),
          prefix: __nullable__(
            t.Union(
              [
                t.Literal("MR"),
                t.Literal("MRS"),
                t.Literal("MS"),
                t.Literal("DR"),
                t.Literal("PROF"),
              ],
              { additionalProperties: false },
            ),
          ),
          age: __nullable__(t.Integer()),
          licenseNumber: __nullable__(t.String()),
          email: t.String(),
          phone: __nullable__(t.String()),
          country: __nullable__(t.String()),
          city: __nullable__(t.String()),
          address: __nullable__(t.String()),
          notes: __nullable__(t.String()),
          bio: __nullable__(t.String()),
          educationalQualification: __nullable__(t.String()),
          nationality: __nullable__(t.String()),
          avatar: __nullable__(t.String()),
          primarySpecializationId: __nullable__(t.String()),
          secondarySpecializationId: __nullable__(t.String()),
          employmentType: __nullable__(
            t.Union([t.Literal("FULL_TIME"), t.Literal("PART_TIME")], {
              additionalProperties: false,
            }),
          ),
          hireDate: __nullable__(t.Date()),
          isSaudi: t.Boolean(),
          status: t.Union(
            [t.Literal("PENDING"), t.Literal("ACTIVE"), t.Literal("INACTIVE")],
            { additionalProperties: false },
          ),
          active: t.Boolean(),
          isDeleted: t.Boolean(),
          deletedAt: __nullable__(t.Date()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    ),
  },
  { additionalProperties: false },
);

export const OperationNotePlainInputCreate = t.Object(
  {
    proceduresPerformed: t.Optional(__nullable__(t.String())),
    findings: t.Optional(__nullable__(t.String())),
    technique: t.Optional(__nullable__(t.String())),
    estimatedBloodLossMl: t.Optional(__nullable__(t.Integer())),
    complicationsNarrative: t.Optional(__nullable__(t.String())),
    closureDetails: t.Optional(__nullable__(t.String())),
    drainsPlaced: t.Optional(__nullable__(t.String())),
    signedAt: t.Optional(__nullable__(t.Date())),
  },
  { additionalProperties: false },
);

export const OperationNotePlainInputUpdate = t.Object(
  {
    proceduresPerformed: t.Optional(__nullable__(t.String())),
    findings: t.Optional(__nullable__(t.String())),
    technique: t.Optional(__nullable__(t.String())),
    estimatedBloodLossMl: t.Optional(__nullable__(t.Integer())),
    complicationsNarrative: t.Optional(__nullable__(t.String())),
    closureDetails: t.Optional(__nullable__(t.String())),
    drainsPlaced: t.Optional(__nullable__(t.String())),
    signedAt: t.Optional(__nullable__(t.Date())),
  },
  { additionalProperties: false },
);

export const OperationNoteRelationsInputCreate = t.Object(
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
    signedBy: t.Optional(
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

export const OperationNoteRelationsInputUpdate = t.Partial(
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
      signedBy: t.Partial(
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

export const OperationNoteWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          caseId: t.String(),
          proceduresPerformed: t.String(),
          findings: t.String(),
          technique: t.String(),
          estimatedBloodLossMl: t.Integer(),
          complicationsNarrative: t.String(),
          closureDetails: t.String(),
          drainsPlaced: t.String(),
          signedById: t.String(),
          signedAt: t.Date(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "OperationNote" },
  ),
);

export const OperationNoteWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.String(), caseId: t.String() },
            { additionalProperties: false },
          ),
          { additionalProperties: false },
        ),
        t.Union(
          [t.Object({ id: t.String() }), t.Object({ caseId: t.String() })],
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
              proceduresPerformed: t.String(),
              findings: t.String(),
              technique: t.String(),
              estimatedBloodLossMl: t.Integer(),
              complicationsNarrative: t.String(),
              closureDetails: t.String(),
              drainsPlaced: t.String(),
              signedById: t.String(),
              signedAt: t.Date(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "OperationNote" },
);

export const OperationNoteSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      caseId: t.Boolean(),
      proceduresPerformed: t.Boolean(),
      findings: t.Boolean(),
      technique: t.Boolean(),
      estimatedBloodLossMl: t.Boolean(),
      complicationsNarrative: t.Boolean(),
      closureDetails: t.Boolean(),
      drainsPlaced: t.Boolean(),
      signedById: t.Boolean(),
      signedAt: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      case: t.Boolean(),
      signedBy: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const OperationNoteInclude = t.Partial(
  t.Object(
    { case: t.Boolean(), signedBy: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const OperationNoteOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      caseId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      proceduresPerformed: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      findings: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      technique: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      estimatedBloodLossMl: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      complicationsNarrative: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      closureDetails: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      drainsPlaced: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      signedById: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      signedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const OperationNote = t.Composite(
  [OperationNotePlain, OperationNoteRelations],
  { additionalProperties: false },
);

export const OperationNoteInputCreate = t.Composite(
  [OperationNotePlainInputCreate, OperationNoteRelationsInputCreate],
  { additionalProperties: false },
);

export const OperationNoteInputUpdate = t.Composite(
  [OperationNotePlainInputUpdate, OperationNoteRelationsInputUpdate],
  { additionalProperties: false },
);
