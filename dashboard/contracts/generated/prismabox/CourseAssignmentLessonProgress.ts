import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const CourseAssignmentLessonProgressPlain = t.Object(
  {
    id: t.String(),
    assignmentId: t.String(),
    lessonId: t.String(),
    completedAt: t.Date(),
  },
  { additionalProperties: false },
);

export const CourseAssignmentLessonProgressRelations = t.Object(
  {
    assignment: t.Object(
      {
        id: t.String(),
        code: t.String(),
        clinicId: t.String(),
        courseId: t.String(),
        staffId: t.String(),
        cycle: t.Integer(),
        source: t.Union(
          [t.Literal("MANUAL"), t.Literal("AUTO"), t.Literal("ENROLL_ALL")],
          { additionalProperties: false },
        ),
        status: t.Union(
          [
            t.Literal("ASSIGNED"),
            t.Literal("IN_PROGRESS"),
            t.Literal("COMPLETED"),
          ],
          { additionalProperties: false },
        ),
        progress: t.Integer(),
        assignedAt: t.Date(),
        startedAt: __nullable__(t.Date()),
        completedAt: __nullable__(t.Date()),
        startDate: __nullable__(t.Date()),
        dueDate: __nullable__(t.Date()),
        createdAt: t.Date(),
        updatedAt: t.Date(),
      },
      { additionalProperties: false },
    ),
    lesson: t.Object(
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
  },
  { additionalProperties: false },
);

export const CourseAssignmentLessonProgressPlainInputCreate = t.Object(
  { completedAt: t.Optional(t.Date()) },
  { additionalProperties: false },
);

export const CourseAssignmentLessonProgressPlainInputUpdate = t.Object(
  { completedAt: t.Optional(t.Date()) },
  { additionalProperties: false },
);

export const CourseAssignmentLessonProgressRelationsInputCreate = t.Object(
  {
    assignment: t.Object(
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
    lesson: t.Object(
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

export const CourseAssignmentLessonProgressRelationsInputUpdate = t.Partial(
  t.Object(
    {
      assignment: t.Object(
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
      lesson: t.Object(
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

export const CourseAssignmentLessonProgressWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          assignmentId: t.String(),
          lessonId: t.String(),
          completedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "CourseAssignmentLessonProgress" },
  ),
);

export const CourseAssignmentLessonProgressWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            {
              id: t.String(),
              assignmentId_lessonId: t.Object(
                { assignmentId: t.String(), lessonId: t.String() },
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
              assignmentId_lessonId: t.Object(
                { assignmentId: t.String(), lessonId: t.String() },
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
              assignmentId: t.String(),
              lessonId: t.String(),
              completedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "CourseAssignmentLessonProgress" },
);

export const CourseAssignmentLessonProgressSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      assignmentId: t.Boolean(),
      lessonId: t.Boolean(),
      completedAt: t.Boolean(),
      assignment: t.Boolean(),
      lesson: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const CourseAssignmentLessonProgressInclude = t.Partial(
  t.Object(
    { assignment: t.Boolean(), lesson: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const CourseAssignmentLessonProgressOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      assignmentId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      lessonId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      completedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const CourseAssignmentLessonProgress = t.Composite(
  [
    CourseAssignmentLessonProgressPlain,
    CourseAssignmentLessonProgressRelations,
  ],
  { additionalProperties: false },
);

export const CourseAssignmentLessonProgressInputCreate = t.Composite(
  [
    CourseAssignmentLessonProgressPlainInputCreate,
    CourseAssignmentLessonProgressRelationsInputCreate,
  ],
  { additionalProperties: false },
);

export const CourseAssignmentLessonProgressInputUpdate = t.Composite(
  [
    CourseAssignmentLessonProgressPlainInputUpdate,
    CourseAssignmentLessonProgressRelationsInputUpdate,
  ],
  { additionalProperties: false },
);
