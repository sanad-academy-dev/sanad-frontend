import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const ConversationMemberPlain = t.Object(
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
);

export const ConversationMemberRelations = t.Object(
  {
    conversation: t.Object(
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

export const ConversationMemberPlainInputCreate = t.Object(
  {
    pinned: t.Optional(t.Boolean()),
    muted: t.Optional(t.Boolean()),
    lastReadAt: t.Optional(t.Date()),
    joinedAt: t.Optional(t.Date()),
  },
  { additionalProperties: false },
);

export const ConversationMemberPlainInputUpdate = t.Object(
  {
    pinned: t.Optional(t.Boolean()),
    muted: t.Optional(t.Boolean()),
    lastReadAt: t.Optional(t.Date()),
    joinedAt: t.Optional(t.Date()),
  },
  { additionalProperties: false },
);

export const ConversationMemberRelationsInputCreate = t.Object(
  {
    conversation: t.Object(
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

export const ConversationMemberRelationsInputUpdate = t.Partial(
  t.Object(
    {
      conversation: t.Object(
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

export const ConversationMemberWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
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
    { $id: "ConversationMember" },
  ),
);

export const ConversationMemberWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            {
              id: t.String(),
              conversationId_userId: t.Object(
                { conversationId: t.String(), userId: t.String() },
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
              conversationId_userId: t.Object(
                { conversationId: t.String(), userId: t.String() },
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
              conversationId: t.String(),
              userId: t.String(),
              pinned: t.Boolean(),
              muted: t.Boolean(),
              lastReadAt: t.Date(),
              joinedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "ConversationMember" },
);

export const ConversationMemberSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      conversationId: t.Boolean(),
      userId: t.Boolean(),
      pinned: t.Boolean(),
      muted: t.Boolean(),
      lastReadAt: t.Boolean(),
      joinedAt: t.Boolean(),
      conversation: t.Boolean(),
      user: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const ConversationMemberInclude = t.Partial(
  t.Object(
    { conversation: t.Boolean(), user: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const ConversationMemberOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      conversationId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      userId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      pinned: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      muted: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      lastReadAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      joinedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const ConversationMember = t.Composite(
  [ConversationMemberPlain, ConversationMemberRelations],
  { additionalProperties: false },
);

export const ConversationMemberInputCreate = t.Composite(
  [ConversationMemberPlainInputCreate, ConversationMemberRelationsInputCreate],
  { additionalProperties: false },
);

export const ConversationMemberInputUpdate = t.Composite(
  [ConversationMemberPlainInputUpdate, ConversationMemberRelationsInputUpdate],
  { additionalProperties: false },
);
