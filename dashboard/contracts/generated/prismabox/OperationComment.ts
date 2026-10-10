import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const OperationCommentPlain = t.Object(
  {
    id: t.String(),
    caseId: t.String(),
    authorUserId: t.String(),
    body: t.String(),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  },
  { additionalProperties: false },
);

export const OperationCommentRelations = t.Object(
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
    author: t.Object(
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
    mentions: t.Array(
      t.Object(
        {
          id: t.String(),
          commentId: t.String(),
          staffId: t.String(),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const OperationCommentPlainInputCreate = t.Object(
  { body: t.String() },
  { additionalProperties: false },
);

export const OperationCommentPlainInputUpdate = t.Object(
  { body: t.Optional(t.String()) },
  { additionalProperties: false },
);

export const OperationCommentRelationsInputCreate = t.Object(
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
    author: t.Object(
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
    mentions: t.Optional(
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

export const OperationCommentRelationsInputUpdate = t.Partial(
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
      author: t.Object(
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
      mentions: t.Partial(
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

export const OperationCommentWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          caseId: t.String(),
          authorUserId: t.String(),
          body: t.String(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "OperationComment" },
  ),
);

export const OperationCommentWhereUnique = t.Recursive(
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
              authorUserId: t.String(),
              body: t.String(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "OperationComment" },
);

export const OperationCommentSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      caseId: t.Boolean(),
      authorUserId: t.Boolean(),
      body: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      case: t.Boolean(),
      author: t.Boolean(),
      mentions: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const OperationCommentInclude = t.Partial(
  t.Object(
    {
      case: t.Boolean(),
      author: t.Boolean(),
      mentions: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const OperationCommentOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      caseId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      authorUserId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      body: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const OperationComment = t.Composite(
  [OperationCommentPlain, OperationCommentRelations],
  { additionalProperties: false },
);

export const OperationCommentInputCreate = t.Composite(
  [OperationCommentPlainInputCreate, OperationCommentRelationsInputCreate],
  { additionalProperties: false },
);

export const OperationCommentInputUpdate = t.Composite(
  [OperationCommentPlainInputUpdate, OperationCommentRelationsInputUpdate],
  { additionalProperties: false },
);
