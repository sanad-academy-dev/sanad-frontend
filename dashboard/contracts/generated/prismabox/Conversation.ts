import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const ConversationPlain = t.Object(
  {
    id: t.String(),
    clinicId: t.String(),
    kind: t.Union([t.Literal("DIRECT"), t.Literal("GROUP")], {
      additionalProperties: false,
    }),
    title: __nullable__(t.String()),
    createdById: t.String(),
    lastMessageAt: t.Date(),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  },
  { additionalProperties: false },
);

export const ConversationRelations = t.Object(
  {
    clinic: t.Object(
      {
        id: t.String(),
        name: t.String(),
        slug: __nullable__(t.String()),
        plan: t.Union(
          [t.Literal("FREE"), t.Literal("BASIC"), t.Literal("PRO")],
          { additionalProperties: false },
        ),
        trialEndsAt: __nullable__(t.Date()),
        onboardingCompleted: t.Boolean(),
        rbacVersion: t.Integer({
          description: `[RBAC P4] يُرفَع عند أيّ كتابة على دور أو منحة أو إسناد. الجلسة تحمل النسخة التي
بُنيت منها لقطتُها، فتُعيد بناءها ذاتيًا عند الاختلاف بدل حذف الجلسات وإخراج المستخدم.`,
        }),
        createdAt: t.Date(),
        updatedAt: t.Date(),
      },
      { additionalProperties: false },
    ),
    members: t.Array(
      t.Object(
        {
          id: t.String(),
          conversationId: t.String(),
          userId: t.String(),
          pinned: t.Boolean(),
          muted: t.Boolean(),
          lastReadAt: t.Date(),
          joinedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    messages: t.Array(
      t.Object(
        {
          id: t.String(),
          conversationId: t.String(),
          authorId: t.String(),
          body: t.String(),
          attachmentName: __nullable__(t.String()),
          attachmentMime: __nullable__(t.String()),
          attachmentSize: __nullable__(t.Integer()),
          attachmentData: __nullable__(t.Uint8Array()),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    inboxItems: t.Array(
      t.Object(
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
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const ConversationPlainInputCreate = t.Object(
  {
    kind: t.Optional(
      t.Union([t.Literal("DIRECT"), t.Literal("GROUP")], {
        additionalProperties: false,
      }),
    ),
    title: t.Optional(__nullable__(t.String())),
    lastMessageAt: t.Optional(t.Date()),
  },
  { additionalProperties: false },
);

export const ConversationPlainInputUpdate = t.Object(
  {
    kind: t.Optional(
      t.Union([t.Literal("DIRECT"), t.Literal("GROUP")], {
        additionalProperties: false,
      }),
    ),
    title: t.Optional(__nullable__(t.String())),
    lastMessageAt: t.Optional(t.Date()),
  },
  { additionalProperties: false },
);

export const ConversationRelationsInputCreate = t.Object(
  {
    clinic: t.Object(
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
    members: t.Optional(
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
    messages: t.Optional(
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
    inboxItems: t.Optional(
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

export const ConversationRelationsInputUpdate = t.Partial(
  t.Object(
    {
      clinic: t.Object(
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
      members: t.Partial(
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
      messages: t.Partial(
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
      inboxItems: t.Partial(
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

export const ConversationWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          clinicId: t.String(),
          kind: t.Union([t.Literal("DIRECT"), t.Literal("GROUP")], {
            additionalProperties: false,
          }),
          title: t.String(),
          createdById: t.String(),
          lastMessageAt: t.Date(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "Conversation" },
  ),
);

export const ConversationWhereUnique = t.Recursive(
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
              clinicId: t.String(),
              kind: t.Union([t.Literal("DIRECT"), t.Literal("GROUP")], {
                additionalProperties: false,
              }),
              title: t.String(),
              createdById: t.String(),
              lastMessageAt: t.Date(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "Conversation" },
);

export const ConversationSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      clinicId: t.Boolean(),
      kind: t.Boolean(),
      title: t.Boolean(),
      createdById: t.Boolean(),
      lastMessageAt: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinic: t.Boolean(),
      members: t.Boolean(),
      messages: t.Boolean(),
      inboxItems: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const ConversationInclude = t.Partial(
  t.Object(
    {
      kind: t.Boolean(),
      clinic: t.Boolean(),
      members: t.Boolean(),
      messages: t.Boolean(),
      inboxItems: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const ConversationOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clinicId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      title: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdById: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      lastMessageAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const Conversation = t.Composite(
  [ConversationPlain, ConversationRelations],
  { additionalProperties: false },
);

export const ConversationInputCreate = t.Composite(
  [ConversationPlainInputCreate, ConversationRelationsInputCreate],
  { additionalProperties: false },
);

export const ConversationInputUpdate = t.Composite(
  [ConversationPlainInputUpdate, ConversationRelationsInputUpdate],
  { additionalProperties: false },
);
