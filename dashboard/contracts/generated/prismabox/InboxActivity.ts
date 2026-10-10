import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const InboxActivityPlain = t.Object(
  {
    id: t.String(),
    itemId: t.String(),
    authorUserId: t.String(),
    type: t.Union(
      [
        t.Literal("CREATED"),
        t.Literal("COMMENT"),
        t.Literal("ACCEPTED"),
        t.Literal("REJECTED"),
        t.Literal("STATUS_CHANGED"),
      ],
      { additionalProperties: false },
    ),
    body: __nullable__(t.String()),
    metadata: __nullable__(t.Any()),
    createdAt: t.Date(),
  },
  { additionalProperties: false },
);

export const InboxActivityRelations = t.Object(
  {
    item: t.Object(
      {
        id: t.String(),
        clinicId: t.String(),
        kind: t.Union([t.Literal("NOTIFICATION"), t.Literal("APPROVAL")], {
          additionalProperties: false,
        }),
        type: t.Union(
          [
            t.Literal("MEMBERSHIP"),
            t.Literal("INSURANCE"),
            t.Literal("LEAD"),
            t.Literal("DEAL"),
            t.Literal("APPOINTMENT_CANCELLED"),
            t.Literal("APPOINTMENT_NEW"),
            t.Literal("APPOINTMENT_PENDING"),
            t.Literal("APPOINTMENT_CONFIRMED"),
            t.Literal("INVOICE"),
            t.Literal("TASK"),
            t.Literal("SYSTEM"),
            t.Literal("LAB"),
            t.Literal("RADIOLOGY"),
            t.Literal("CARE"),
            t.Literal("STOCK"),
            t.Literal("MENTION"),
            t.Literal("OPERATION"),
            t.Literal("VACCINATION"),
            t.Literal("GROOMING"),
            t.Literal("INPATIENT"),
            t.Literal("TRIAGE"),
          ],
          { additionalProperties: false },
        ),
        title: t.String(),
        importance: t.Union(
          [t.Literal("LOW"), t.Literal("NORMAL"), t.Literal("HIGH")],
          { additionalProperties: false },
        ),
        status: t.Union(
          [t.Literal("DRAFT"), t.Literal("OPEN"), t.Literal("RESOLVED")],
          { additionalProperties: false },
        ),
        approvalStatus: __nullable__(
          t.Union(
            [
              t.Literal("PENDING"),
              t.Literal("ACCEPTED"),
              t.Literal("REJECTED"),
            ],
            { additionalProperties: false },
          ),
        ),
        patientId: __nullable__(t.String()),
        ownerId: __nullable__(t.String()),
        staffId: __nullable__(t.String()),
        appointmentId: __nullable__(t.String()),
        taskId: __nullable__(t.String()),
        conversationId: __nullable__(t.String()),
        operationId: __nullable__(t.String()),
        groomingSessionId: __nullable__(t.String()),
        leadId: __nullable__(t.String()),
        dealId: __nullable__(t.String()),
        inpatientStayId: __nullable__(t.String()),
        recipientUserId: __nullable__(t.String()),
        createdById: __nullable__(t.String()),
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
  },
  { additionalProperties: false },
);

export const InboxActivityPlainInputCreate = t.Object(
  {
    type: t.Union(
      [
        t.Literal("CREATED"),
        t.Literal("COMMENT"),
        t.Literal("ACCEPTED"),
        t.Literal("REJECTED"),
        t.Literal("STATUS_CHANGED"),
      ],
      { additionalProperties: false },
    ),
    body: t.Optional(__nullable__(t.String())),
    metadata: t.Optional(__nullable__(t.Any())),
  },
  { additionalProperties: false },
);

export const InboxActivityPlainInputUpdate = t.Object(
  {
    type: t.Optional(
      t.Union(
        [
          t.Literal("CREATED"),
          t.Literal("COMMENT"),
          t.Literal("ACCEPTED"),
          t.Literal("REJECTED"),
          t.Literal("STATUS_CHANGED"),
        ],
        { additionalProperties: false },
      ),
    ),
    body: t.Optional(__nullable__(t.String())),
    metadata: t.Optional(__nullable__(t.Any())),
  },
  { additionalProperties: false },
);

export const InboxActivityRelationsInputCreate = t.Object(
  {
    item: t.Object(
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
  },
  { additionalProperties: false },
);

export const InboxActivityRelationsInputUpdate = t.Partial(
  t.Object(
    {
      item: t.Object(
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
    },
    { additionalProperties: false },
  ),
);

export const InboxActivityWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          itemId: t.String(),
          authorUserId: t.String(),
          type: t.Union(
            [
              t.Literal("CREATED"),
              t.Literal("COMMENT"),
              t.Literal("ACCEPTED"),
              t.Literal("REJECTED"),
              t.Literal("STATUS_CHANGED"),
            ],
            { additionalProperties: false },
          ),
          body: t.String(),
          metadata: t.Any(),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "InboxActivity" },
  ),
);

export const InboxActivityWhereUnique = t.Recursive(
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
              itemId: t.String(),
              authorUserId: t.String(),
              type: t.Union(
                [
                  t.Literal("CREATED"),
                  t.Literal("COMMENT"),
                  t.Literal("ACCEPTED"),
                  t.Literal("REJECTED"),
                  t.Literal("STATUS_CHANGED"),
                ],
                { additionalProperties: false },
              ),
              body: t.String(),
              metadata: t.Any(),
              createdAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "InboxActivity" },
);

export const InboxActivitySelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      itemId: t.Boolean(),
      authorUserId: t.Boolean(),
      type: t.Boolean(),
      body: t.Boolean(),
      metadata: t.Boolean(),
      createdAt: t.Boolean(),
      item: t.Boolean(),
      author: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const InboxActivityInclude = t.Partial(
  t.Object(
    {
      type: t.Boolean(),
      item: t.Boolean(),
      author: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const InboxActivityOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      itemId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      authorUserId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      body: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      metadata: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const InboxActivity = t.Composite(
  [InboxActivityPlain, InboxActivityRelations],
  { additionalProperties: false },
);

export const InboxActivityInputCreate = t.Composite(
  [InboxActivityPlainInputCreate, InboxActivityRelationsInputCreate],
  { additionalProperties: false },
);

export const InboxActivityInputUpdate = t.Composite(
  [InboxActivityPlainInputUpdate, InboxActivityRelationsInputUpdate],
  { additionalProperties: false },
);
