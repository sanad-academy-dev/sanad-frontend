import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const AgentMessagePlain = t.Object(
  {
    id: t.String(),
    conversationId: t.String(),
    role: t.Union([t.Literal("USER"), t.Literal("ASSISTANT")], {
      additionalProperties: false,
    }),
    content: t.String(),
    createdAt: t.Date(),
  },
  { additionalProperties: false },
);

export const AgentMessageRelations = t.Object(
  {
    conversation: t.Object(
      {
        id: t.String(),
        clinicId: t.String(),
        userId: t.String(),
        title: t.String(),
        createdAt: t.Date(),
        updatedAt: t.Date(),
      },
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const AgentMessagePlainInputCreate = t.Object(
  {
    role: t.Union([t.Literal("USER"), t.Literal("ASSISTANT")], {
      additionalProperties: false,
    }),
    content: t.String(),
  },
  { additionalProperties: false },
);

export const AgentMessagePlainInputUpdate = t.Object(
  {
    role: t.Optional(
      t.Union([t.Literal("USER"), t.Literal("ASSISTANT")], {
        additionalProperties: false,
      }),
    ),
    content: t.Optional(t.String()),
  },
  { additionalProperties: false },
);

export const AgentMessageRelationsInputCreate = t.Object(
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
  },
  { additionalProperties: false },
);

export const AgentMessageRelationsInputUpdate = t.Partial(
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
    },
    { additionalProperties: false },
  ),
);

export const AgentMessageWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          conversationId: t.String(),
          role: t.Union([t.Literal("USER"), t.Literal("ASSISTANT")], {
            additionalProperties: false,
          }),
          content: t.String(),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "AgentMessage" },
  ),
);

export const AgentMessageWhereUnique = t.Recursive(
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
              conversationId: t.String(),
              role: t.Union([t.Literal("USER"), t.Literal("ASSISTANT")], {
                additionalProperties: false,
              }),
              content: t.String(),
              createdAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "AgentMessage" },
);

export const AgentMessageSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      conversationId: t.Boolean(),
      role: t.Boolean(),
      content: t.Boolean(),
      createdAt: t.Boolean(),
      conversation: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const AgentMessageInclude = t.Partial(
  t.Object(
    { role: t.Boolean(), conversation: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const AgentMessageOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      conversationId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      content: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const AgentMessage = t.Composite(
  [AgentMessagePlain, AgentMessageRelations],
  { additionalProperties: false },
);

export const AgentMessageInputCreate = t.Composite(
  [AgentMessagePlainInputCreate, AgentMessageRelationsInputCreate],
  { additionalProperties: false },
);

export const AgentMessageInputUpdate = t.Composite(
  [AgentMessagePlainInputUpdate, AgentMessageRelationsInputUpdate],
  { additionalProperties: false },
);
