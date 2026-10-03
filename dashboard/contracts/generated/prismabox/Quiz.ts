import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const QuizPlain = t.Object(
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
);

export const QuizRelations = t.Object(
  {
    clinic: t.Object(
      {
        id: t.String(),
        name: t.String(),
        slug: __nullable__(t.String()),
        plan: t.Union(
          [t.Literal("FREE"), t.Literal("BASIC"), t.Literal("PRO")],
          { additionalProperties: false },
        ),
        trialEndsAt: __nullable__(t.Date()),
        onboardingCompleted: t.Boolean(),
        rbacVersion: t.Integer({
          description: `[RBAC P4] يُرفَع عند أيّ كتابة على دور أو منحة أو إسناد. الجلسة تحمل النسخة التي
بُنيت منها لقطتُها، فتُعيد بناءها ذاتيًا عند الاختلاف بدل حذف الجلسات وإخراج المستخدم.`,
        }),
        createdAt: t.Date(),
        updatedAt: t.Date(),
      },
      { additionalProperties: false },
    ),
    targetRole: __nullable__(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          name: t.String(),
          description: __nullable__(t.String()),
          isSuperAdmin: t.Boolean({
            description: `[RBAC D4] يتجاوز كل فحوص الصلاحيات. يُقيَّم قبل أيّ بحث في السجلّ، فلا يمكن
لإدخال خاطئ في سجلّ الموارد أن يقفل الباب على مدير النظام (درس P12A).`,
          }),
          isSystem: t.Boolean({
            description: `دور مُدمَج تُنشئه التهيئة الأولى — لا يُحذف ولا يُعاد تسميته. يحلّ محلّ مقارنة
الاسم العربي «مدير النظام» التي كانت تحرس الدور نصًّا.`,
          }),
          permissions: t.Array(
            t.String({
              description: `[RBAC] العمود القديم — منح مسطَّحة بلا نطاق. يبقى خلال الترحيل مصدرًا للتعبئة
الرجعية فقط، ويُسقَط في P7 بعد التحقّق من \`role_permission\`.`,
            }),
            { additionalProperties: false },
          ),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    ),
    questions: t.Array(
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
          answerText: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    assignments: t.Array(
      t.Object(
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
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const QuizPlainInputCreate = t.Object(
  {
    code: t.String(),
    title: t.String(),
    description: t.Optional(__nullable__(t.String())),
    coverKey: t.Optional(__nullable__(t.String())),
    status: t.Optional(
      t.Union(
        [t.Literal("DRAFT"), t.Literal("PUBLISHED"), t.Literal("ARCHIVED")],
        { additionalProperties: false },
      ),
    ),
    passMark: t.Optional(t.Integer()),
    timeLimitMinutes: t.Optional(__nullable__(t.Integer())),
    maxAttempts: t.Optional(__nullable__(t.Integer())),
    shuffleQuestions: t.Optional(t.Boolean()),
    showAnswers: t.Optional(t.Boolean()),
    gamificationPoints: t.Optional(t.Integer()),
    editsCount: t.Optional(t.Integer()),
  },
  { additionalProperties: false },
);

export const QuizPlainInputUpdate = t.Object(
  {
    code: t.Optional(t.String()),
    title: t.Optional(t.String()),
    description: t.Optional(__nullable__(t.String())),
    coverKey: t.Optional(__nullable__(t.String())),
    status: t.Optional(
      t.Union(
        [t.Literal("DRAFT"), t.Literal("PUBLISHED"), t.Literal("ARCHIVED")],
        { additionalProperties: false },
      ),
    ),
    passMark: t.Optional(t.Integer()),
    timeLimitMinutes: t.Optional(__nullable__(t.Integer())),
    maxAttempts: t.Optional(__nullable__(t.Integer())),
    shuffleQuestions: t.Optional(t.Boolean()),
    showAnswers: t.Optional(t.Boolean()),
    gamificationPoints: t.Optional(t.Integer()),
    editsCount: t.Optional(t.Integer()),
  },
  { additionalProperties: false },
);

export const QuizRelationsInputCreate = t.Object(
  {
    clinic: t.Object(
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
    targetRole: t.Optional(
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
    questions: t.Optional(
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
    assignments: t.Optional(
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

export const QuizRelationsInputUpdate = t.Partial(
  t.Object(
    {
      clinic: t.Object(
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
      targetRole: t.Partial(
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
      questions: t.Partial(
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
      assignments: t.Partial(
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

export const QuizWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          code: t.String(),
          clinicId: t.String(),
          title: t.String(),
          description: t.String(),
          targetRoleId: t.String(),
          coverKey: t.String(),
          status: t.Union(
            [t.Literal("DRAFT"), t.Literal("PUBLISHED"), t.Literal("ARCHIVED")],
            { additionalProperties: false },
          ),
          passMark: t.Integer(),
          timeLimitMinutes: t.Integer(),
          maxAttempts: t.Integer(),
          shuffleQuestions: t.Boolean(),
          showAnswers: t.Boolean(),
          gamificationPoints: t.Integer(),
          editsCount: t.Integer(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "Quiz" },
  ),
);

export const QuizWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.String(), code: t.String() },
            { additionalProperties: false },
          ),
          { additionalProperties: false },
        ),
        t.Union(
          [t.Object({ id: t.String() }), t.Object({ code: t.String() })],
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
              code: t.String(),
              clinicId: t.String(),
              title: t.String(),
              description: t.String(),
              targetRoleId: t.String(),
              coverKey: t.String(),
              status: t.Union(
                [
                  t.Literal("DRAFT"),
                  t.Literal("PUBLISHED"),
                  t.Literal("ARCHIVED"),
                ],
                { additionalProperties: false },
              ),
              passMark: t.Integer(),
              timeLimitMinutes: t.Integer(),
              maxAttempts: t.Integer(),
              shuffleQuestions: t.Boolean(),
              showAnswers: t.Boolean(),
              gamificationPoints: t.Integer(),
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
  { $id: "Quiz" },
);

export const QuizSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      code: t.Boolean(),
      clinicId: t.Boolean(),
      title: t.Boolean(),
      description: t.Boolean(),
      targetRoleId: t.Boolean(),
      coverKey: t.Boolean(),
      status: t.Boolean(),
      passMark: t.Boolean(),
      timeLimitMinutes: t.Boolean(),
      maxAttempts: t.Boolean(),
      shuffleQuestions: t.Boolean(),
      showAnswers: t.Boolean(),
      gamificationPoints: t.Boolean(),
      editsCount: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinic: t.Boolean(),
      targetRole: t.Boolean(),
      questions: t.Boolean(),
      assignments: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const QuizInclude = t.Partial(
  t.Object(
    {
      status: t.Boolean(),
      clinic: t.Boolean(),
      targetRole: t.Boolean(),
      questions: t.Boolean(),
      assignments: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const QuizOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      code: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clinicId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      title: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      description: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      targetRoleId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      coverKey: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      passMark: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      timeLimitMinutes: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      maxAttempts: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      shuffleQuestions: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      showAnswers: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      gamificationPoints: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const Quiz = t.Composite([QuizPlain, QuizRelations], {
  additionalProperties: false,
});

export const QuizInputCreate = t.Composite(
  [QuizPlainInputCreate, QuizRelationsInputCreate],
  { additionalProperties: false },
);

export const QuizInputUpdate = t.Composite(
  [QuizPlainInputUpdate, QuizRelationsInputUpdate],
  { additionalProperties: false },
);
