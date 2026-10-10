import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const CourseUnitPlain = t.Object(
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
);

export const CourseUnitRelations = t.Object(
  {
    course: t.Object(
      {
        id: t.String(),
        code: t.String(),
        clinicId: t.String(),
        name: t.String(),
        department: t.String(),
        targetRoleId: __nullable__(t.String()),
        type: t.Union(
          [
            t.Literal("INTERNAL"),
            t.Literal("WORKSHOP"),
            t.Literal("ONLINE"),
            t.Literal("CERTIFICATION"),
            t.Literal("CONFERENCE"),
          ],
          { additionalProperties: false },
        ),
        description: __nullable__(t.String()),
        coverKey: __nullable__(t.String()),
        status: t.Union(
          [t.Literal("DRAFT"), t.Literal("PUBLISHED"), t.Literal("ARCHIVED")],
          { additionalProperties: false },
        ),
        category: __nullable__(t.String()),
        priority: t.Union([t.Literal("URGENT"), t.Literal("NORMAL")], {
          additionalProperties: false,
        }),
        estimatedDurationWeeks: __nullable__(t.Integer()),
        language: t.Union([t.Literal("AR"), t.Literal("EN")], {
          additionalProperties: false,
        }),
        orderMode: t.Union([t.Literal("SEQUENTIAL"), t.Literal("FREE")], {
          additionalProperties: false,
        }),
        trainingCost: __nullable__(t.Integer()),
        institution: __nullable__(t.String()),
        locationMode: __nullable__(
          t.Union(
            [t.Literal("ONSITE"), t.Literal("ONLINE"), t.Literal("HYBRID")],
            { additionalProperties: false },
          ),
        ),
        startDate: __nullable__(t.Date()),
        dueDate: __nullable__(t.Date()),
        timezone: __nullable__(t.String()),
        editsCount: t.Integer(),
        createdAt: t.Date(),
        updatedAt: t.Date(),
      },
      { additionalProperties: false },
    ),
    level: __nullable__(
      t.Object(
        {
          id: t.String(),
          courseId: t.String(),
          name: t.String(),
          order: t.Integer(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    ),
    lessons: t.Array(
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
      ),
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const CourseUnitPlainInputCreate = t.Object(
  {
    title: t.String(),
    contentType: t.Optional(
      t.Union([t.Literal("PAGE"), t.Literal("LESSON"), t.Literal("QUIZ")], {
        additionalProperties: false,
      }),
    ),
    status: t.Optional(
      t.Union([t.Literal("DRAFT"), t.Literal("PUBLISHED")], {
        additionalProperties: false,
      }),
    ),
    order: t.Integer(),
  },
  { additionalProperties: false },
);

export const CourseUnitPlainInputUpdate = t.Object(
  {
    title: t.Optional(t.String()),
    contentType: t.Optional(
      t.Union([t.Literal("PAGE"), t.Literal("LESSON"), t.Literal("QUIZ")], {
        additionalProperties: false,
      }),
    ),
    status: t.Optional(
      t.Union([t.Literal("DRAFT"), t.Literal("PUBLISHED")], {
        additionalProperties: false,
      }),
    ),
    order: t.Optional(t.Integer()),
  },
  { additionalProperties: false },
);

export const CourseUnitRelationsInputCreate = t.Object(
  {
    course: t.Object(
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
    level: t.Optional(
      t.Object(
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
    ),
    lessons: t.Optional(
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

export const CourseUnitRelationsInputUpdate = t.Partial(
  t.Object(
    {
      course: t.Object(
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
      level: t.Partial(
        t.Object(
          {
            connect: t.Object(
              {
                id: t.String({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
            disconnect: t.Boolean(),
          },
          { additionalProperties: false },
        ),
      ),
      lessons: t.Partial(
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

export const CourseUnitWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          courseId: t.String(),
          levelId: t.String(),
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
    { $id: "CourseUnit" },
  ),
);

export const CourseUnitWhereUnique = t.Recursive(
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
              courseId: t.String(),
              levelId: t.String(),
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
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "CourseUnit" },
);

export const CourseUnitSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      courseId: t.Boolean(),
      levelId: t.Boolean(),
      title: t.Boolean(),
      contentType: t.Boolean(),
      status: t.Boolean(),
      order: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      course: t.Boolean(),
      level: t.Boolean(),
      lessons: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const CourseUnitInclude = t.Partial(
  t.Object(
    {
      contentType: t.Boolean(),
      status: t.Boolean(),
      course: t.Boolean(),
      level: t.Boolean(),
      lessons: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const CourseUnitOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      courseId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      levelId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      title: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      order: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const CourseUnit = t.Composite([CourseUnitPlain, CourseUnitRelations], {
  additionalProperties: false,
});

export const CourseUnitInputCreate = t.Composite(
  [CourseUnitPlainInputCreate, CourseUnitRelationsInputCreate],
  { additionalProperties: false },
);

export const CourseUnitInputUpdate = t.Composite(
  [CourseUnitPlainInputUpdate, CourseUnitRelationsInputUpdate],
  { additionalProperties: false },
);
