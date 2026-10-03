import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const QuizAnswerPlain = t.Object(
  {
    id: t.String(),
    attemptId: t.String(),
    questionId: t.String(),
    selectedOptions: t.Array(t.Integer(), { additionalProperties: false }),
    answerText: __nullable__(t.String()),
    isCorrect: __nullable__(t.Boolean()),
    awardedPoints: __nullable__(t.Integer()),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  },
  { additionalProperties: false },
);

export const QuizAnswerRelations = t.Object(
  {
    attempt: t.Object(
      {
        id: t.String(),
        assignmentId: t.String(),
        attemptNo: t.Integer(),
        startedAt: t.Date(),
        submittedAt: __nullable__(t.Date()),
        scorePercent: __nullable__(t.Integer()),
        passed: __nullable__(t.Boolean()),
        gradingStatus: t.Union(
          [
            t.Literal("AUTO_DONE"),
            t.Literal("NEEDS_MANUAL"),
            t.Literal("GRADED"),
          ],
          { additionalProperties: false },
        ),
        gradedAt: __nullable__(t.Date()),
        createdAt: t.Date(),
        updatedAt: t.Date(),
      },
      { additionalProperties: false },
    ),
    question: t.Object(
      {
        id: t.String(),
        quizId: t.String(),
        order: t.Integer(),
        text: t.String(),
        answerType: t.Union(
          [t.Literal("SINGLE"), t.Literal("MULTIPLE"), t.Literal("TEXT")],
          { additionalProperties: false },
        ),
        points: t.Integer(),
        options: t.Any(),
        answerText: __nullable__(t.String()),
        createdAt: t.Date(),
        updatedAt: t.Date(),
      },
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const QuizAnswerPlainInputCreate = t.Object(
  {
    selectedOptions: t.Optional(
      t.Array(t.Integer(), { additionalProperties: false }),
    ),
    answerText: t.Optional(__nullable__(t.String())),
    isCorrect: t.Optional(__nullable__(t.Boolean())),
    awardedPoints: t.Optional(__nullable__(t.Integer())),
  },
  { additionalProperties: false },
);

export const QuizAnswerPlainInputUpdate = t.Object(
  {
    selectedOptions: t.Optional(
      t.Array(t.Integer(), { additionalProperties: false }),
    ),
    answerText: t.Optional(__nullable__(t.String())),
    isCorrect: t.Optional(__nullable__(t.Boolean())),
    awardedPoints: t.Optional(__nullable__(t.Integer())),
  },
  { additionalProperties: false },
);

export const QuizAnswerRelationsInputCreate = t.Object(
  {
    attempt: t.Object(
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
    question: t.Object(
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

export const QuizAnswerRelationsInputUpdate = t.Partial(
  t.Object(
    {
      attempt: t.Object(
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
      question: t.Object(
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

export const QuizAnswerWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          attemptId: t.String(),
          questionId: t.String(),
          selectedOptions: t.Array(t.Integer(), {
            additionalProperties: false,
          }),
          answerText: t.String(),
          isCorrect: t.Boolean(),
          awardedPoints: t.Integer(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "QuizAnswer" },
  ),
);

export const QuizAnswerWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            {
              id: t.String(),
              attemptId_questionId: t.Object(
                { attemptId: t.String(), questionId: t.String() },
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
              attemptId_questionId: t.Object(
                { attemptId: t.String(), questionId: t.String() },
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
              attemptId: t.String(),
              questionId: t.String(),
              selectedOptions: t.Array(t.Integer(), {
                additionalProperties: false,
              }),
              answerText: t.String(),
              isCorrect: t.Boolean(),
              awardedPoints: t.Integer(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "QuizAnswer" },
);

export const QuizAnswerSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      attemptId: t.Boolean(),
      questionId: t.Boolean(),
      selectedOptions: t.Boolean(),
      answerText: t.Boolean(),
      isCorrect: t.Boolean(),
      awardedPoints: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      attempt: t.Boolean(),
      question: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const QuizAnswerInclude = t.Partial(
  t.Object(
    { attempt: t.Boolean(), question: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const QuizAnswerOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      attemptId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      questionId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      selectedOptions: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      answerText: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      isCorrect: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      awardedPoints: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const QuizAnswer = t.Composite([QuizAnswerPlain, QuizAnswerRelations], {
  additionalProperties: false,
});

export const QuizAnswerInputCreate = t.Composite(
  [QuizAnswerPlainInputCreate, QuizAnswerRelationsInputCreate],
  { additionalProperties: false },
);

export const QuizAnswerInputUpdate = t.Composite(
  [QuizAnswerPlainInputUpdate, QuizAnswerRelationsInputUpdate],
  { additionalProperties: false },
);
