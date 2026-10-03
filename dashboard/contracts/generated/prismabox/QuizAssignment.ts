import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const QuizAssignmentPlain = t.Object(
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
      [t.Literal("ASSIGNED"), t.Literal("IN_PROGRESS"), t.Literal("COMPLETED")],
      { additionalProperties: false },
    ),
    assignedAt: t.Date(),
    startDate: __nullable__(t.Date()),
    dueDate: __nullable__(t.Date()),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  },
  { additionalProperties: false },
);

export const QuizAssignmentRelations = t.Object(
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
    staff: t.Object(
      {
        id: t.String(),
        code: t.String(),
        clinicId: t.String(),
        userId: __nullable__(t.String()),
        roleId: t.String(),
        branchId: t.String(),
        name: t.String(),
        gender: __nullable__(
          t.Union(
            [t.Literal("MALE"), t.Literal("FEMALE"), t.Literal("UNKNOWN")],
            { additionalProperties: false },
          ),
        ),
        prefix: __nullable__(
          t.Union(
            [
              t.Literal("MR"),
              t.Literal("MRS"),
              t.Literal("MS"),
              t.Literal("DR"),
              t.Literal("PROF"),
            ],
            { additionalProperties: false },
          ),
        ),
        age: __nullable__(t.Integer()),
        licenseNumber: __nullable__(t.String()),
        email: t.String(),
        phone: __nullable__(t.String()),
        country: __nullable__(t.String()),
        city: __nullable__(t.String()),
        address: __nullable__(t.String()),
        notes: __nullable__(t.String()),
        bio: __nullable__(t.String()),
        educationalQualification: __nullable__(t.String()),
        nationality: __nullable__(t.String()),
        avatar: __nullable__(t.String()),
        primarySpecializationId: __nullable__(t.String()),
        secondarySpecializationId: __nullable__(t.String()),
        employmentType: __nullable__(
          t.Union([t.Literal("FULL_TIME"), t.Literal("PART_TIME")], {
            additionalProperties: false,
          }),
        ),
        hireDate: __nullable__(t.Date()),
        isSaudi: t.Boolean(),
        status: t.Union(
          [t.Literal("PENDING"), t.Literal("ACTIVE"), t.Literal("INACTIVE")],
          { additionalProperties: false },
        ),
        active: t.Boolean(),
        isDeleted: t.Boolean(),
        deletedAt: __nullable__(t.Date()),
        createdAt: t.Date(),
        updatedAt: t.Date(),
      },
      { additionalProperties: false },
    ),
    attempts: t.Array(
      t.Object(
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
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const QuizAssignmentPlainInputCreate = t.Object(
  {
    code: t.String(),
    cycle: t.Optional(t.Integer()),
    source: t.Optional(
      t.Union(
        [t.Literal("MANUAL"), t.Literal("AUTO"), t.Literal("ENROLL_ALL")],
        { additionalProperties: false },
      ),
    ),
    status: t.Optional(
      t.Union(
        [
          t.Literal("ASSIGNED"),
          t.Literal("IN_PROGRESS"),
          t.Literal("COMPLETED"),
        ],
        { additionalProperties: false },
      ),
    ),
    assignedAt: t.Optional(t.Date()),
    startDate: t.Optional(__nullable__(t.Date())),
    dueDate: t.Optional(__nullable__(t.Date())),
  },
  { additionalProperties: false },
);

export const QuizAssignmentPlainInputUpdate = t.Object(
  {
    code: t.Optional(t.String()),
    cycle: t.Optional(t.Integer()),
    source: t.Optional(
      t.Union(
        [t.Literal("MANUAL"), t.Literal("AUTO"), t.Literal("ENROLL_ALL")],
        { additionalProperties: false },
      ),
    ),
    status: t.Optional(
      t.Union(
        [
          t.Literal("ASSIGNED"),
          t.Literal("IN_PROGRESS"),
          t.Literal("COMPLETED"),
        ],
        { additionalProperties: false },
      ),
    ),
    assignedAt: t.Optional(t.Date()),
    startDate: t.Optional(__nullable__(t.Date())),
    dueDate: t.Optional(__nullable__(t.Date())),
  },
  { additionalProperties: false },
);

export const QuizAssignmentRelationsInputCreate = t.Object(
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
    staff: t.Object(
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
    attempts: t.Optional(
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

export const QuizAssignmentRelationsInputUpdate = t.Partial(
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
      staff: t.Object(
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
      attempts: t.Partial(
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

export const QuizAssignmentWhere = t.Partial(
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
          startDate: t.Date(),
          dueDate: t.Date(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "QuizAssignment" },
  ),
);

export const QuizAssignmentWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            {
              id: t.String(),
              code: t.String(),
              quizId_staffId_cycle: t.Object(
                { quizId: t.String(), staffId: t.String(), cycle: t.Integer() },
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
            t.Object({ code: t.String() }),
            t.Object({
              quizId_staffId_cycle: t.Object(
                { quizId: t.String(), staffId: t.String(), cycle: t.Integer() },
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
              code: t.String(),
              clinicId: t.String(),
              quizId: t.String(),
              staffId: t.String(),
              cycle: t.Integer(),
              source: t.Union(
                [
                  t.Literal("MANUAL"),
                  t.Literal("AUTO"),
                  t.Literal("ENROLL_ALL"),
                ],
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
              startDate: t.Date(),
              dueDate: t.Date(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "QuizAssignment" },
);

export const QuizAssignmentSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      code: t.Boolean(),
      clinicId: t.Boolean(),
      quizId: t.Boolean(),
      staffId: t.Boolean(),
      cycle: t.Boolean(),
      source: t.Boolean(),
      status: t.Boolean(),
      assignedAt: t.Boolean(),
      startDate: t.Boolean(),
      dueDate: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinic: t.Boolean(),
      quiz: t.Boolean(),
      staff: t.Boolean(),
      attempts: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const QuizAssignmentInclude = t.Partial(
  t.Object(
    {
      source: t.Boolean(),
      status: t.Boolean(),
      clinic: t.Boolean(),
      quiz: t.Boolean(),
      staff: t.Boolean(),
      attempts: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const QuizAssignmentOrderBy = t.Partial(
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
      quizId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      staffId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      cycle: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      assignedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      startDate: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      dueDate: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const QuizAssignment = t.Composite(
  [QuizAssignmentPlain, QuizAssignmentRelations],
  { additionalProperties: false },
);

export const QuizAssignmentInputCreate = t.Composite(
  [QuizAssignmentPlainInputCreate, QuizAssignmentRelationsInputCreate],
  { additionalProperties: false },
);

export const QuizAssignmentInputUpdate = t.Composite(
  [QuizAssignmentPlainInputUpdate, QuizAssignmentRelationsInputUpdate],
  { additionalProperties: false },
);
