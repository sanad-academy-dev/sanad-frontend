import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const OperationTeamMemberPlain = t.Object(
  {
    id: t.String(),
    caseId: t.String(),
    staffId: t.String(),
    role: t.Union(
      [
        t.Literal("PRIMARY_SURGEON"),
        t.Literal("ASSISTANT_SURGEON"),
        t.Literal("ANESTHETIST"),
        t.Literal("ANESTHESIA_TECH"),
        t.Literal("SCRUB_NURSE"),
        t.Literal("CIRCULATOR"),
        t.Literal("OBSERVER"),
      ],
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const OperationTeamMemberRelations = t.Object(
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
    staff: t.Object(
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
  },
  { additionalProperties: false },
);

export const OperationTeamMemberPlainInputCreate = t.Object(
  {
    role: t.Union(
      [
        t.Literal("PRIMARY_SURGEON"),
        t.Literal("ASSISTANT_SURGEON"),
        t.Literal("ANESTHETIST"),
        t.Literal("ANESTHESIA_TECH"),
        t.Literal("SCRUB_NURSE"),
        t.Literal("CIRCULATOR"),
        t.Literal("OBSERVER"),
      ],
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const OperationTeamMemberPlainInputUpdate = t.Object(
  {
    role: t.Optional(
      t.Union(
        [
          t.Literal("PRIMARY_SURGEON"),
          t.Literal("ASSISTANT_SURGEON"),
          t.Literal("ANESTHETIST"),
          t.Literal("ANESTHESIA_TECH"),
          t.Literal("SCRUB_NURSE"),
          t.Literal("CIRCULATOR"),
          t.Literal("OBSERVER"),
        ],
        { additionalProperties: false },
      ),
    ),
  },
  { additionalProperties: false },
);

export const OperationTeamMemberRelationsInputCreate = t.Object(
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
    staff: t.Object(
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

export const OperationTeamMemberRelationsInputUpdate = t.Partial(
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
      staff: t.Object(
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

export const OperationTeamMemberWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          caseId: t.String(),
          staffId: t.String(),
          role: t.Union(
            [
              t.Literal("PRIMARY_SURGEON"),
              t.Literal("ASSISTANT_SURGEON"),
              t.Literal("ANESTHETIST"),
              t.Literal("ANESTHESIA_TECH"),
              t.Literal("SCRUB_NURSE"),
              t.Literal("CIRCULATOR"),
              t.Literal("OBSERVER"),
            ],
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
    { $id: "OperationTeamMember" },
  ),
);

export const OperationTeamMemberWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            {
              id: t.String(),
              caseId_staffId_role: t.Object(
                {
                  caseId: t.String(),
                  staffId: t.String(),
                  role: t.Union(
                    [
                      t.Literal("PRIMARY_SURGEON"),
                      t.Literal("ASSISTANT_SURGEON"),
                      t.Literal("ANESTHETIST"),
                      t.Literal("ANESTHESIA_TECH"),
                      t.Literal("SCRUB_NURSE"),
                      t.Literal("CIRCULATOR"),
                      t.Literal("OBSERVER"),
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
              caseId_staffId_role: t.Object(
                {
                  caseId: t.String(),
                  staffId: t.String(),
                  role: t.Union(
                    [
                      t.Literal("PRIMARY_SURGEON"),
                      t.Literal("ASSISTANT_SURGEON"),
                      t.Literal("ANESTHETIST"),
                      t.Literal("ANESTHESIA_TECH"),
                      t.Literal("SCRUB_NURSE"),
                      t.Literal("CIRCULATOR"),
                      t.Literal("OBSERVER"),
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
              staffId: t.String(),
              role: t.Union(
                [
                  t.Literal("PRIMARY_SURGEON"),
                  t.Literal("ASSISTANT_SURGEON"),
                  t.Literal("ANESTHETIST"),
                  t.Literal("ANESTHESIA_TECH"),
                  t.Literal("SCRUB_NURSE"),
                  t.Literal("CIRCULATOR"),
                  t.Literal("OBSERVER"),
                ],
                { additionalProperties: false },
              ),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "OperationTeamMember" },
);

export const OperationTeamMemberSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      caseId: t.Boolean(),
      staffId: t.Boolean(),
      role: t.Boolean(),
      case: t.Boolean(),
      staff: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const OperationTeamMemberInclude = t.Partial(
  t.Object(
    {
      role: t.Boolean(),
      case: t.Boolean(),
      staff: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const OperationTeamMemberOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      caseId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      staffId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const OperationTeamMember = t.Composite(
  [OperationTeamMemberPlain, OperationTeamMemberRelations],
  { additionalProperties: false },
);

export const OperationTeamMemberInputCreate = t.Composite(
  [
    OperationTeamMemberPlainInputCreate,
    OperationTeamMemberRelationsInputCreate,
  ],
  { additionalProperties: false },
);

export const OperationTeamMemberInputUpdate = t.Composite(
  [
    OperationTeamMemberPlainInputUpdate,
    OperationTeamMemberRelationsInputUpdate,
  ],
  { additionalProperties: false },
);
