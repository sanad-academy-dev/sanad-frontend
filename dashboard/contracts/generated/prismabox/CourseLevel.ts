import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const CourseLevelPlain = t.Object(
  {
    id: t.String(),
    courseId: t.String(),
    name: t.String(),
    order: t.Integer(),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  },
  { additionalProperties: false },
);

export const CourseLevelRelations = t.Object(
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
    units: t.Array(
      t.Object(
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
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const CourseLevelPlainInputCreate = t.Object(
  { name: t.String(), order: t.Integer() },
  { additionalProperties: false },
);

export const CourseLevelPlainInputUpdate = t.Object(
  { name: t.Optional(t.String()), order: t.Optional(t.Integer()) },
  { additionalProperties: false },
);

export const CourseLevelRelationsInputCreate = t.Object(
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
    units: t.Optional(
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

export const CourseLevelRelationsInputUpdate = t.Partial(
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
      units: t.Partial(
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

export const CourseLevelWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          courseId: t.String(),
          name: t.String(),
          order: t.Integer(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "CourseLevel" },
  ),
);

export const CourseLevelWhereUnique = t.Recursive(
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
              name: t.String(),
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
  { $id: "CourseLevel" },
);

export const CourseLevelSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      courseId: t.Boolean(),
      name: t.Boolean(),
      order: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      course: t.Boolean(),
      units: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const CourseLevelInclude = t.Partial(
  t.Object(
    { course: t.Boolean(), units: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const CourseLevelOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      courseId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      name: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const CourseLevel = t.Composite(
  [CourseLevelPlain, CourseLevelRelations],
  { additionalProperties: false },
);

export const CourseLevelInputCreate = t.Composite(
  [CourseLevelPlainInputCreate, CourseLevelRelationsInputCreate],
  { additionalProperties: false },
);

export const CourseLevelInputUpdate = t.Composite(
  [CourseLevelPlainInputUpdate, CourseLevelRelationsInputUpdate],
  { additionalProperties: false },
);
