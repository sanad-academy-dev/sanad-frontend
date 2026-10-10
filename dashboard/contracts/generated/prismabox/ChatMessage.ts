import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const ChatMessagePlain = t.Object(
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
);

export const ChatMessageRelations = t.Object(
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

export const ChatMessagePlainInputCreate = t.Object(
  {
    body: t.String(),
    attachmentName: t.Optional(__nullable__(t.String())),
    attachmentMime: t.Optional(__nullable__(t.String())),
    attachmentSize: t.Optional(__nullable__(t.Integer())),
    attachmentData: t.Optional(__nullable__(t.Uint8Array())),
  },
  { additionalProperties: false },
);

export const ChatMessagePlainInputUpdate = t.Object(
  {
    body: t.Optional(t.String()),
    attachmentName: t.Optional(__nullable__(t.String())),
    attachmentMime: t.Optional(__nullable__(t.String())),
    attachmentSize: t.Optional(__nullable__(t.Integer())),
    attachmentData: t.Optional(__nullable__(t.Uint8Array())),
  },
  { additionalProperties: false },
);

export const ChatMessageRelationsInputCreate = t.Object(
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

export const ChatMessageRelationsInputUpdate = t.Partial(
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

export const ChatMessageWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          conversationId: t.String(),
          authorId: t.String(),
          body: t.String(),
          attachmentName: t.String(),
          attachmentMime: t.String(),
          attachmentSize: t.Integer(),
          attachmentData: t.Uint8Array(),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "ChatMessage" },
  ),
);

export const ChatMessageWhereUnique = t.Recursive(
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
              authorId: t.String(),
              body: t.String(),
              attachmentName: t.String(),
              attachmentMime: t.String(),
              attachmentSize: t.Integer(),
              attachmentData: t.Uint8Array(),
              createdAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "ChatMessage" },
);

export const ChatMessageSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      conversationId: t.Boolean(),
      authorId: t.Boolean(),
      body: t.Boolean(),
      attachmentName: t.Boolean(),
      attachmentMime: t.Boolean(),
      attachmentSize: t.Boolean(),
      attachmentData: t.Boolean(),
      createdAt: t.Boolean(),
      conversation: t.Boolean(),
      author: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const ChatMessageInclude = t.Partial(
  t.Object(
    { conversation: t.Boolean(), author: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const ChatMessageOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      conversationId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      authorId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      body: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      attachmentName: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      attachmentMime: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      attachmentSize: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      attachmentData: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const ChatMessage = t.Composite(
  [ChatMessagePlain, ChatMessageRelations],
  { additionalProperties: false },
);

export const ChatMessageInputCreate = t.Composite(
  [ChatMessagePlainInputCreate, ChatMessageRelationsInputCreate],
  { additionalProperties: false },
);

export const ChatMessageInputUpdate = t.Composite(
  [ChatMessagePlainInputUpdate, ChatMessageRelationsInputUpdate],
  { additionalProperties: false },
);
