import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const SubTaskPlain = t.Object(
  {
    id: t.String(),
    taskId: t.String(),
    title: t.String(),
    isCompleted: t.Boolean(),
    createdAt: t.Date(),
  },
  { additionalProperties: false },
);

export const SubTaskRelations = t.Object(
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
  },
  { additionalProperties: false },
);

export const SubTaskPlainInputCreate = t.Object(
  { title: t.String(), isCompleted: t.Optional(t.Boolean()) },
  { additionalProperties: false },
);

export const SubTaskPlainInputUpdate = t.Object(
  { title: t.Optional(t.String()), isCompleted: t.Optional(t.Boolean()) },
  { additionalProperties: false },
);

export const SubTaskRelationsInputCreate = t.Object(
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
  },
  { additionalProperties: false },
);

export const SubTaskRelationsInputUpdate = t.Partial(
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
    },
    { additionalProperties: false },
  ),
);

export const SubTaskWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          taskId: t.String(),
          title: t.String(),
          isCompleted: t.Boolean(),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "SubTask" },
  ),
);

export const SubTaskWhereUnique = t.Recursive(
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
              title: t.String(),
              isCompleted: t.Boolean(),
              createdAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "SubTask" },
);

export const SubTaskSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      taskId: t.Boolean(),
      title: t.Boolean(),
      isCompleted: t.Boolean(),
      createdAt: t.Boolean(),
      task: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const SubTaskInclude = t.Partial(
  t.Object(
    { task: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const SubTaskOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      taskId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      title: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      isCompleted: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const SubTask = t.Composite([SubTaskPlain, SubTaskRelations], {
  additionalProperties: false,
});

export const SubTaskInputCreate = t.Composite(
  [SubTaskPlainInputCreate, SubTaskRelationsInputCreate],
  { additionalProperties: false },
);

export const SubTaskInputUpdate = t.Composite(
  [SubTaskPlainInputUpdate, SubTaskRelationsInputUpdate],
  { additionalProperties: false },
);
