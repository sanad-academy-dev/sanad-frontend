import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const InboxItemReadPlain = t.Object(
  { id: t.String(), itemId: t.String(), userId: t.String(), readAt: t.Date() },
  { additionalProperties: false },
);

export const InboxItemReadRelations = t.Object(
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
    user: t.Object(
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

export const InboxItemReadPlainInputCreate = t.Object(
  { readAt: t.Optional(t.Date()) },
  { additionalProperties: false },
);

export const InboxItemReadPlainInputUpdate = t.Object(
  { readAt: t.Optional(t.Date()) },
  { additionalProperties: false },
);

export const InboxItemReadRelationsInputCreate = t.Object(
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
    user: t.Object(
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

export const InboxItemReadRelationsInputUpdate = t.Partial(
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
      user: t.Object(
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

export const InboxItemReadWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          itemId: t.String(),
          userId: t.String(),
          readAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "InboxItemRead" },
  ),
);

export const InboxItemReadWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            {
              id: t.String(),
              itemId_userId: t.Object(
                { itemId: t.String(), userId: t.String() },
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
              itemId_userId: t.Object(
                { itemId: t.String(), userId: t.String() },
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
              itemId: t.String(),
              userId: t.String(),
              readAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "InboxItemRead" },
);

export const InboxItemReadSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      itemId: t.Boolean(),
      userId: t.Boolean(),
      readAt: t.Boolean(),
      item: t.Boolean(),
      user: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const InboxItemReadInclude = t.Partial(
  t.Object(
    { item: t.Boolean(), user: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const InboxItemReadOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      itemId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      userId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      readAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const InboxItemRead = t.Composite(
  [InboxItemReadPlain, InboxItemReadRelations],
  { additionalProperties: false },
);

export const InboxItemReadInputCreate = t.Composite(
  [InboxItemReadPlainInputCreate, InboxItemReadRelationsInputCreate],
  { additionalProperties: false },
);

export const InboxItemReadInputUpdate = t.Composite(
  [InboxItemReadPlainInputUpdate, InboxItemReadRelationsInputUpdate],
  { additionalProperties: false },
);
