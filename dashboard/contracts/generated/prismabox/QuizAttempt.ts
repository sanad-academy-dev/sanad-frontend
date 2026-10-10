import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const QuizAttemptPlain = t.Object(
  {
    id: t.String(),
    assignmentId: t.String(),
    attemptNo: t.Integer(),
    startedAt: t.Date(),
    submittedAt: __nullable__(t.Date()),
    scorePercent: __nullable__(t.Integer()),
    passed: __nullable__(t.Boolean()),
    gradingStatus: t.Union(
      [t.Literal("AUTO_DONE"), t.Literal("NEEDS_MANUAL"), t.Literal("GRADED")],
      { additionalProperties: false },
    ),
    gradedAt: __nullable__(t.Date()),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  },
  { additionalProperties: false },
);

export const QuizAttemptRelations = t.Object(
  {
    assignment: t.Object(
      {
        id: t.String(),
        code: t.String(),
        clinicId: t.String(),
        quizId: t.String(),
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
        assignedAt: t.Date(),
        startDate: __nullable__(t.Date()),
        dueDate: __nullable__(t.Date()),
        createdAt: t.Date(),
        updatedAt: t.Date(),
      },
      { additionalProperties: false },
    ),
    answers: t.Array(
      t.Object(
        {
          id: t.String(),
          attemptId: t.String(),
          questionId: t.String(),
          selectedOptions: t.Array(t.Integer(), {
            additionalProperties: false,
          }),
          answerText: __nullable__(t.String()),
          isCorrect: __nullable__(t.Boolean()),
          awardedPoints: __nullable__(t.Integer()),
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

export const QuizAttemptPlainInputCreate = t.Object(
  {
    attemptNo: t.Optional(t.Integer()),
    startedAt: t.Optional(t.Date()),
    submittedAt: t.Optional(__nullable__(t.Date())),
    scorePercent: t.Optional(__nullable__(t.Integer())),
    passed: t.Optional(__nullable__(t.Boolean())),
    gradingStatus: t.Optional(
      t.Union(
        [
          t.Literal("AUTO_DONE"),
          t.Literal("NEEDS_MANUAL"),
          t.Literal("GRADED"),
        ],
        { additionalProperties: false },
      ),
    ),
    gradedAt: t.Optional(__nullable__(t.Date())),
  },
  { additionalProperties: false },
);

export const QuizAttemptPlainInputUpdate = t.Object(
  {
    attemptNo: t.Optional(t.Integer()),
    startedAt: t.Optional(t.Date()),
    submittedAt: t.Optional(__nullable__(t.Date())),
    scorePercent: t.Optional(__nullable__(t.Integer())),
    passed: t.Optional(__nullable__(t.Boolean())),
    gradingStatus: t.Optional(
      t.Union(
        [
          t.Literal("AUTO_DONE"),
          t.Literal("NEEDS_MANUAL"),
          t.Literal("GRADED"),
        ],
        { additionalProperties: false },
      ),
    ),
    gradedAt: t.Optional(__nullable__(t.Date())),
  },
  { additionalProperties: false },
);

export const QuizAttemptRelationsInputCreate = t.Object(
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
    answers: t.Optional(
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

export const QuizAttemptRelationsInputUpdate = t.Partial(
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
      answers: t.Partial(
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

export const QuizAttemptWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          assignmentId: t.String(),
          attemptNo: t.Integer(),
          startedAt: t.Date(),
          submittedAt: t.Date(),
          scorePercent: t.Integer(),
          passed: t.Boolean(),
          gradingStatus: t.Union(
            [
              t.Literal("AUTO_DONE"),
              t.Literal("NEEDS_MANUAL"),
              t.Literal("GRADED"),
            ],
            { additionalProperties: false },
          ),
          gradedAt: t.Date(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "QuizAttempt" },
  ),
);

export const QuizAttemptWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            {
              id: t.String(),
              assignmentId_attemptNo: t.Object(
                { assignmentId: t.String(), attemptNo: t.Integer() },
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
              assignmentId_attemptNo: t.Object(
                { assignmentId: t.String(), attemptNo: t.Integer() },
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
              attemptNo: t.Integer(),
              startedAt: t.Date(),
              submittedAt: t.Date(),
              scorePercent: t.Integer(),
              passed: t.Boolean(),
              gradingStatus: t.Union(
                [
                  t.Literal("AUTO_DONE"),
                  t.Literal("NEEDS_MANUAL"),
                  t.Literal("GRADED"),
                ],
                { additionalProperties: false },
              ),
              gradedAt: t.Date(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "QuizAttempt" },
);

export const QuizAttemptSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      assignmentId: t.Boolean(),
      attemptNo: t.Boolean(),
      startedAt: t.Boolean(),
      submittedAt: t.Boolean(),
      scorePercent: t.Boolean(),
      passed: t.Boolean(),
      gradingStatus: t.Boolean(),
      gradedAt: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      assignment: t.Boolean(),
      answers: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const QuizAttemptInclude = t.Partial(
  t.Object(
    {
      gradingStatus: t.Boolean(),
      assignment: t.Boolean(),
      answers: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const QuizAttemptOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      assignmentId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      attemptNo: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      startedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      submittedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      scorePercent: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      passed: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      gradedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const QuizAttempt = t.Composite(
  [QuizAttemptPlain, QuizAttemptRelations],
  { additionalProperties: false },
);

export const QuizAttemptInputCreate = t.Composite(
  [QuizAttemptPlainInputCreate, QuizAttemptRelationsInputCreate],
  { additionalProperties: false },
);

export const QuizAttemptInputUpdate = t.Composite(
  [QuizAttemptPlainInputUpdate, QuizAttemptRelationsInputUpdate],
  { additionalProperties: false },
);
