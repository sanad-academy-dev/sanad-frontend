import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const CourseLessonPlain = t.Object(
  {
    id: t.String(),
    unitId: t.String(),
    title: t.String(),
    type: t.Union(
      [
        t.Literal("TEXT"),
        t.Literal("VIDEO"),
        t.Literal("DOCUMENT"),
        t.Literal("QUIZ"),
        t.Literal("SURVEY"),
        t.Literal("AUDIO"),
      ],
      { additionalProperties: false },
    ),
    order: t.Integer(),
    description: __nullable__(t.String()),
    mediaSource: __nullable__(
      t.Union([t.Literal("DEVICE"), t.Literal("URL")], {
        additionalProperties: false,
      }),
    ),
    mediaKey: __nullable__(t.String()),
    mediaUrl: __nullable__(t.String()),
    durationSeconds: __nullable__(t.Integer()),
    content: __nullable__(t.String()),
    editsCount: t.Integer(),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  },
  { additionalProperties: false },
);

export const CourseLessonRelations = t.Object(
  {
    unit: t.Object(
      {
        id: t.String(),
        courseId: t.String(),
        levelId: __nullable__(t.String()),
        title: t.String(),
        contentType: t.Union(
          [t.Literal("PAGE"), t.Literal("LESSON"), t.Literal("QUIZ")],
          { additionalProperties: false },
        ),
        status: t.Union([t.Literal("DRAFT"), t.Literal("PUBLISHED")], {
          additionalProperties: false,
        }),
        order: t.Integer(),
        createdAt: t.Date(),
        updatedAt: t.Date(),
      },
      { additionalProperties: false },
    ),
    lessonProgress: t.Array(
      t.Object(
        {
          id: t.String(),
          assignmentId: t.String(),
          lessonId: t.String(),
          completedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const CourseLessonPlainInputCreate = t.Object(
  {
    title: t.String(),
    type: t.Optional(
      t.Union(
        [
          t.Literal("TEXT"),
          t.Literal("VIDEO"),
          t.Literal("DOCUMENT"),
          t.Literal("QUIZ"),
          t.Literal("SURVEY"),
          t.Literal("AUDIO"),
        ],
        { additionalProperties: false },
      ),
    ),
    order: t.Integer(),
    description: t.Optional(__nullable__(t.String())),
    mediaSource: t.Optional(
      __nullable__(
        t.Union([t.Literal("DEVICE"), t.Literal("URL")], {
          additionalProperties: false,
        }),
      ),
    ),
    mediaKey: t.Optional(__nullable__(t.String())),
    mediaUrl: t.Optional(__nullable__(t.String())),
    durationSeconds: t.Optional(__nullable__(t.Integer())),
    content: t.Optional(__nullable__(t.String())),
    editsCount: t.Optional(t.Integer()),
  },
  { additionalProperties: false },
);

export const CourseLessonPlainInputUpdate = t.Object(
  {
    title: t.Optional(t.String()),
    type: t.Optional(
      t.Union(
        [
          t.Literal("TEXT"),
          t.Literal("VIDEO"),
          t.Literal("DOCUMENT"),
          t.Literal("QUIZ"),
          t.Literal("SURVEY"),
          t.Literal("AUDIO"),
        ],
        { additionalProperties: false },
      ),
    ),
    order: t.Optional(t.Integer()),
    description: t.Optional(__nullable__(t.String())),
    mediaSource: t.Optional(
      __nullable__(
        t.Union([t.Literal("DEVICE"), t.Literal("URL")], {
          additionalProperties: false,
        }),
      ),
    ),
    mediaKey: t.Optional(__nullable__(t.String())),
    mediaUrl: t.Optional(__nullable__(t.String())),
    durationSeconds: t.Optional(__nullable__(t.Integer())),
    content: t.Optional(__nullable__(t.String())),
    editsCount: t.Optional(t.Integer()),
  },
  { additionalProperties: false },
);

export const CourseLessonRelationsInputCreate = t.Object(
  {
    unit: t.Object(
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
    lessonProgress: t.Optional(
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

export const CourseLessonRelationsInputUpdate = t.Partial(
  t.Object(
    {
      unit: t.Object(
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
      lessonProgress: t.Partial(
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

export const CourseLessonWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          unitId: t.String(),
          title: t.String(),
          type: t.Union(
            [
              t.Literal("TEXT"),
              t.Literal("VIDEO"),
              t.Literal("DOCUMENT"),
              t.Literal("QUIZ"),
              t.Literal("SURVEY"),
              t.Literal("AUDIO"),
            ],
            { additionalProperties: false },
          ),
          order: t.Integer(),
          description: t.String(),
          mediaSource: t.Union([t.Literal("DEVICE"), t.Literal("URL")], {
            additionalProperties: false,
          }),
          mediaKey: t.String(),
          mediaUrl: t.String(),
          durationSeconds: t.Integer(),
          content: t.String(),
          editsCount: t.Integer(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "CourseLesson" },
  ),
);

export const CourseLessonWhereUnique = t.Recursive(
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
              unitId: t.String(),
              title: t.String(),
              type: t.Union(
                [
                  t.Literal("TEXT"),
                  t.Literal("VIDEO"),
                  t.Literal("DOCUMENT"),
                  t.Literal("QUIZ"),
                  t.Literal("SURVEY"),
                  t.Literal("AUDIO"),
                ],
                { additionalProperties: false },
              ),
              order: t.Integer(),
              description: t.String(),
              mediaSource: t.Union([t.Literal("DEVICE"), t.Literal("URL")], {
                additionalProperties: false,
              }),
              mediaKey: t.String(),
              mediaUrl: t.String(),
              durationSeconds: t.Integer(),
              content: t.String(),
              editsCount: t.Integer(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "CourseLesson" },
);

export const CourseLessonSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      unitId: t.Boolean(),
      title: t.Boolean(),
      type: t.Boolean(),
      order: t.Boolean(),
      description: t.Boolean(),
      mediaSource: t.Boolean(),
      mediaKey: t.Boolean(),
      mediaUrl: t.Boolean(),
      durationSeconds: t.Boolean(),
      content: t.Boolean(),
      editsCount: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      unit: t.Boolean(),
      lessonProgress: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const CourseLessonInclude = t.Partial(
  t.Object(
    {
      type: t.Boolean(),
      mediaSource: t.Boolean(),
      unit: t.Boolean(),
      lessonProgress: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const CourseLessonOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      unitId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      title: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      order: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      description: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      mediaKey: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      mediaUrl: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      durationSeconds: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      content: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      editsCount: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const CourseLesson = t.Composite(
  [CourseLessonPlain, CourseLessonRelations],
  { additionalProperties: false },
);

export const CourseLessonInputCreate = t.Composite(
  [CourseLessonPlainInputCreate, CourseLessonRelationsInputCreate],
  { additionalProperties: false },
);

export const CourseLessonInputUpdate = t.Composite(
  [CourseLessonPlainInputUpdate, CourseLessonRelationsInputUpdate],
  { additionalProperties: false },
);
