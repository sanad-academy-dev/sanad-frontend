import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const OperationChecklistRunPlain = t.Object(
  {
    id: t.String(),
    caseId: t.String(),
    scope: t.Union(
      [
        t.Literal("OPERATION_SIGN_IN"),
        t.Literal("OPERATION_TIME_OUT"),
        t.Literal("OPERATION_SIGN_OUT"),
        t.Literal("OPERATION_MINOR_COMBINED"),
      ],
      { additionalProperties: false },
    ),
    templateId: t.String(),
    templateVersion: t.Integer(),
    startedById: __nullable__(t.String()),
    completedAt: __nullable__(t.Date()),
    completedById: __nullable__(t.String()),
    createdAt: t.Date(),
  },
  { additionalProperties: false },
);

export const OperationChecklistRunRelations = t.Object(
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
    items: t.Array(
      t.Object(
        {
          id: t.String(),
          runId: t.String(),
          order: t.Integer(),
          textSnapshot: t.String(),
          required: t.Boolean(),
          responseType: t.Union(
            [
              t.Literal("CONFIRM"),
              t.Literal("YES_NO_NA"),
              t.Literal("TEXT"),
              t.Literal("NUMBER"),
            ],
            { additionalProperties: false },
          ),
          response: __nullable__(
            t.Union(
              [
                t.Literal("CONFIRMED"),
                t.Literal("YES"),
                t.Literal("NO"),
                t.Literal("NA"),
              ],
              { additionalProperties: false },
            ),
          ),
          valueText: __nullable__(t.String()),
          valueNumber: __nullable__(t.Number()),
          respondedById: __nullable__(t.String()),
          respondedAt: __nullable__(t.Date()),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const OperationChecklistRunPlainInputCreate = t.Object(
  {
    scope: t.Union(
      [
        t.Literal("OPERATION_SIGN_IN"),
        t.Literal("OPERATION_TIME_OUT"),
        t.Literal("OPERATION_SIGN_OUT"),
        t.Literal("OPERATION_MINOR_COMBINED"),
      ],
      { additionalProperties: false },
    ),
    templateVersion: t.Integer(),
    completedAt: t.Optional(__nullable__(t.Date())),
  },
  { additionalProperties: false },
);

export const OperationChecklistRunPlainInputUpdate = t.Object(
  {
    scope: t.Optional(
      t.Union(
        [
          t.Literal("OPERATION_SIGN_IN"),
          t.Literal("OPERATION_TIME_OUT"),
          t.Literal("OPERATION_SIGN_OUT"),
          t.Literal("OPERATION_MINOR_COMBINED"),
        ],
        { additionalProperties: false },
      ),
    ),
    templateVersion: t.Optional(t.Integer()),
    completedAt: t.Optional(__nullable__(t.Date())),
  },
  { additionalProperties: false },
);

export const OperationChecklistRunRelationsInputCreate = t.Object(
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
    items: t.Optional(
      t.Object(
        {
          connect: t.Array(
            t.Object(
              {
                id: t.String({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
    ),
  },
  { additionalProperties: false },
);

export const OperationChecklistRunRelationsInputUpdate = t.Partial(
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
      items: t.Partial(
        t.Object(
          {
            connect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
            disconnect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
          },
          { additionalProperties: false },
        ),
      ),
    },
    { additionalProperties: false },
  ),
);

export const OperationChecklistRunWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          caseId: t.String(),
          scope: t.Union(
            [
              t.Literal("OPERATION_SIGN_IN"),
              t.Literal("OPERATION_TIME_OUT"),
              t.Literal("OPERATION_SIGN_OUT"),
              t.Literal("OPERATION_MINOR_COMBINED"),
            ],
            { additionalProperties: false },
          ),
          templateId: t.String(),
          templateVersion: t.Integer(),
          startedById: t.String(),
          completedAt: t.Date(),
          completedById: t.String(),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "OperationChecklistRun" },
  ),
);

export const OperationChecklistRunWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            {
              id: t.String(),
              caseId_scope: t.Object(
                {
                  caseId: t.String(),
                  scope: t.Union(
                    [
                      t.Literal("OPERATION_SIGN_IN"),
                      t.Literal("OPERATION_TIME_OUT"),
                      t.Literal("OPERATION_SIGN_OUT"),
                      t.Literal("OPERATION_MINOR_COMBINED"),
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
              caseId_scope: t.Object(
                {
                  caseId: t.String(),
                  scope: t.Union(
                    [
                      t.Literal("OPERATION_SIGN_IN"),
                      t.Literal("OPERATION_TIME_OUT"),
                      t.Literal("OPERATION_SIGN_OUT"),
                      t.Literal("OPERATION_MINOR_COMBINED"),
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
              scope: t.Union(
                [
                  t.Literal("OPERATION_SIGN_IN"),
                  t.Literal("OPERATION_TIME_OUT"),
                  t.Literal("OPERATION_SIGN_OUT"),
                  t.Literal("OPERATION_MINOR_COMBINED"),
                ],
                { additionalProperties: false },
              ),
              templateId: t.String(),
              templateVersion: t.Integer(),
              startedById: t.String(),
              completedAt: t.Date(),
              completedById: t.String(),
              createdAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "OperationChecklistRun" },
);

export const OperationChecklistRunSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      caseId: t.Boolean(),
      scope: t.Boolean(),
      templateId: t.Boolean(),
      templateVersion: t.Boolean(),
      startedById: t.Boolean(),
      completedAt: t.Boolean(),
      completedById: t.Boolean(),
      createdAt: t.Boolean(),
      case: t.Boolean(),
      items: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const OperationChecklistRunInclude = t.Partial(
  t.Object(
    {
      scope: t.Boolean(),
      case: t.Boolean(),
      items: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const OperationChecklistRunOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      caseId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      templateId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      templateVersion: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      startedById: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      completedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      completedById: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const OperationChecklistRun = t.Composite(
  [OperationChecklistRunPlain, OperationChecklistRunRelations],
  { additionalProperties: false },
);

export const OperationChecklistRunInputCreate = t.Composite(
  [
    OperationChecklistRunPlainInputCreate,
    OperationChecklistRunRelationsInputCreate,
  ],
  { additionalProperties: false },
);

export const OperationChecklistRunInputUpdate = t.Composite(
  [
    OperationChecklistRunPlainInputUpdate,
    OperationChecklistRunRelationsInputUpdate,
  ],
  { additionalProperties: false },
);
