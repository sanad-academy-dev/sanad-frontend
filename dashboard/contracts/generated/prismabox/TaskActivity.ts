import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const TaskActivityPlain = t.Object(
  {
    id: t.String(),
    taskId: t.String(),
    authorUserId: t.String(),
    type: t.Union(
      [
        t.Literal("STATUS_CHANGED"),
        t.Literal("COMMENT"),
        t.Literal("TASK_ACCEPTED"),
        t.Literal("TASK_DECLINED"),
      ],
      { additionalProperties: false },
    ),
    body: __nullable__(t.String()),
    metadata: __nullable__(t.Any()),
    createdAt: t.Date(),
  },
  { additionalProperties: false },
);

export const TaskActivityRelations = t.Object(
  {
    task: t.Object(
      {
        id: t.String(),
        clinicId: t.String(),
        code: t.String(),
        title: t.String(),
        content: __nullable__(t.String()),
        type: t.Union(
          [
            t.Literal("ADMINISTRATIVE"),
            t.Literal("PHARMACEUTICALS"),
            t.Literal("INVENTORY"),
            t.Literal("FINANCE"),
            t.Literal("LABORATORY"),
            t.Literal("COSMETICS"),
            t.Literal("MEDICAL"),
          ],
          { additionalProperties: false },
        ),
        status: t.Union(
          [
            t.Literal("PENDING"),
            t.Literal("NOT_YET_STARTED"),
            t.Literal("IN_PROGRESS"),
            t.Literal("COMPLETED"),
            t.Literal("CANCELLED"),
            t.Literal("DUPLICATE"),
            t.Literal("QUEUE"),
          ],
          { additionalProperties: false },
        ),
        priority: t.Union(
          [
            t.Literal("LOW"),
            t.Literal("MEDIUM"),
            t.Literal("HIGH"),
            t.Literal("URGENT"),
          ],
          { additionalProperties: false },
        ),
        createdById: __nullable__(t.String()),
        deadline: __nullable__(t.Date()),
        images: t.Array(t.String(), { additionalProperties: false }),
        declinedAt: __nullable__(t.Date()),
        declineReason: __nullable__(t.String()),
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
          activityId: t.String(),
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

export const TaskActivityPlainInputCreate = t.Object(
  {
    type: t.Union(
      [
        t.Literal("STATUS_CHANGED"),
        t.Literal("COMMENT"),
        t.Literal("TASK_ACCEPTED"),
        t.Literal("TASK_DECLINED"),
      ],
      { additionalProperties: false },
    ),
    body: t.Optional(__nullable__(t.String())),
    metadata: t.Optional(__nullable__(t.Any())),
  },
  { additionalProperties: false },
);

export const TaskActivityPlainInputUpdate = t.Object(
  {
    type: t.Optional(
      t.Union(
        [
          t.Literal("STATUS_CHANGED"),
          t.Literal("COMMENT"),
          t.Literal("TASK_ACCEPTED"),
          t.Literal("TASK_DECLINED"),
        ],
        { additionalProperties: false },
      ),
    ),
    body: t.Optional(__nullable__(t.String())),
    metadata: t.Optional(__nullable__(t.Any())),
  },
  { additionalProperties: false },
);

export const TaskActivityRelationsInputCreate = t.Object(
  {
    task: t.Object(
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

export const TaskActivityRelationsInputUpdate = t.Partial(
  t.Object(
    {
      task: t.Object(
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

export const TaskActivityWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          taskId: t.String(),
          authorUserId: t.String(),
          type: t.Union(
            [
              t.Literal("STATUS_CHANGED"),
              t.Literal("COMMENT"),
              t.Literal("TASK_ACCEPTED"),
              t.Literal("TASK_DECLINED"),
            ],
            { additionalProperties: false },
          ),
          body: t.String(),
          metadata: t.Any(),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "TaskActivity" },
  ),
);

export const TaskActivityWhereUnique = t.Recursive(
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
              taskId: t.String(),
              authorUserId: t.String(),
              type: t.Union(
                [
                  t.Literal("STATUS_CHANGED"),
                  t.Literal("COMMENT"),
                  t.Literal("TASK_ACCEPTED"),
                  t.Literal("TASK_DECLINED"),
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
  { $id: "TaskActivity" },
);

export const TaskActivitySelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      taskId: t.Boolean(),
      authorUserId: t.Boolean(),
      type: t.Boolean(),
      body: t.Boolean(),
      metadata: t.Boolean(),
      createdAt: t.Boolean(),
      task: t.Boolean(),
      author: t.Boolean(),
      mentions: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const TaskActivityInclude = t.Partial(
  t.Object(
    {
      type: t.Boolean(),
      task: t.Boolean(),
      author: t.Boolean(),
      mentions: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const TaskActivityOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      taskId: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const TaskActivity = t.Composite(
  [TaskActivityPlain, TaskActivityRelations],
  { additionalProperties: false },
);

export const TaskActivityInputCreate = t.Composite(
  [TaskActivityPlainInputCreate, TaskActivityRelationsInputCreate],
  { additionalProperties: false },
);

export const TaskActivityInputUpdate = t.Composite(
  [TaskActivityPlainInputUpdate, TaskActivityRelationsInputUpdate],
  { additionalProperties: false },
);
