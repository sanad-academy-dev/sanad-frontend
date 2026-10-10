import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const QuizQuestionPlain = t.Object(
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
);

export const QuizQuestionRelations = t.Object(
  {
    quiz: t.Object(
      {
        id: t.String(),
        code: t.String(),
        clinicId: t.String(),
        title: t.String(),
        description: __nullable__(t.String()),
        targetRoleId: __nullable__(t.String()),
        coverKey: __nullable__(t.String()),
        status: t.Union(
          [t.Literal("DRAFT"), t.Literal("PUBLISHED"), t.Literal("ARCHIVED")],
          { additionalProperties: false },
        ),
        passMark: t.Integer(),
        timeLimitMinutes: __nullable__(t.Integer()),
        maxAttempts: __nullable__(t.Integer()),
        shuffleQuestions: t.Boolean(),
        showAnswers: t.Boolean(),
        gamificationPoints: t.Integer(),
        editsCount: t.Integer(),
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

export const QuizQuestionPlainInputCreate = t.Object(
  {
    order: t.Integer(),
    text: t.String(),
    answerType: t.Optional(
      t.Union([t.Literal("SINGLE"), t.Literal("MULTIPLE"), t.Literal("TEXT")], {
        additionalProperties: false,
      }),
    ),
    points: t.Optional(t.Integer()),
    options: t.Optional(t.Any()),
    answerText: t.Optional(__nullable__(t.String())),
  },
  { additionalProperties: false },
);

export const QuizQuestionPlainInputUpdate = t.Object(
  {
    order: t.Optional(t.Integer()),
    text: t.Optional(t.String()),
    answerType: t.Optional(
      t.Union([t.Literal("SINGLE"), t.Literal("MULTIPLE"), t.Literal("TEXT")], {
        additionalProperties: false,
      }),
    ),
    points: t.Optional(t.Integer()),
    options: t.Optional(t.Any()),
    answerText: t.Optional(__nullable__(t.String())),
  },
  { additionalProperties: false },
);

export const QuizQuestionRelationsInputCreate = t.Object(
  {
    quiz: t.Object(
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

export const QuizQuestionRelationsInputUpdate = t.Partial(
  t.Object(
    {
      quiz: t.Object(
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

export const QuizQuestionWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
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
          answerText: t.String(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "QuizQuestion" },
  ),
);

export const QuizQuestionWhereUnique = t.Recursive(
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
              quizId: t.String(),
              order: t.Integer(),
              text: t.String(),
              answerType: t.Union(
                [t.Literal("SINGLE"), t.Literal("MULTIPLE"), t.Literal("TEXT")],
                { additionalProperties: false },
              ),
              points: t.Integer(),
              options: t.Any(),
              answerText: t.String(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "QuizQuestion" },
);

export const QuizQuestionSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      quizId: t.Boolean(),
      order: t.Boolean(),
      text: t.Boolean(),
      answerType: t.Boolean(),
      points: t.Boolean(),
      options: t.Boolean(),
      answerText: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      quiz: t.Boolean(),
      answers: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const QuizQuestionInclude = t.Partial(
  t.Object(
    {
      answerType: t.Boolean(),
      quiz: t.Boolean(),
      answers: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const QuizQuestionOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      quizId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      order: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      text: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      points: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      options: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      answerText: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const QuizQuestion = t.Composite(
  [QuizQuestionPlain, QuizQuestionRelations],
  { additionalProperties: false },
);

export const QuizQuestionInputCreate = t.Composite(
  [QuizQuestionPlainInputCreate, QuizQuestionRelationsInputCreate],
  { additionalProperties: false },
);

export const QuizQuestionInputUpdate = t.Composite(
  [QuizQuestionPlainInputUpdate, QuizQuestionRelationsInputUpdate],
  { additionalProperties: false },
);
