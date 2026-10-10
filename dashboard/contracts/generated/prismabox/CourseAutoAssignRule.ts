import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const CourseAutoAssignRulePlain = t.Object(
  {
    id: t.String(),
    clinicId: t.String(),
    courseId: t.String(),
    entityType: t.Union(
      [t.Literal("BRANCH"), t.Literal("ROLE"), t.Literal("SPECIALIZATION")],
      { additionalProperties: false },
    ),
    entityId: __nullable__(t.String()),
    createdAt: t.Date(),
  },
  { additionalProperties: false },
);

export const CourseAutoAssignRuleRelations = t.Object(
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
  },
  { additionalProperties: false },
);

export const CourseAutoAssignRulePlainInputCreate = t.Object(
  {
    entityType: t.Union(
      [t.Literal("BRANCH"), t.Literal("ROLE"), t.Literal("SPECIALIZATION")],
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const CourseAutoAssignRulePlainInputUpdate = t.Object(
  {
    entityType: t.Optional(
      t.Union(
        [t.Literal("BRANCH"), t.Literal("ROLE"), t.Literal("SPECIALIZATION")],
        { additionalProperties: false },
      ),
    ),
  },
  { additionalProperties: false },
);

export const CourseAutoAssignRuleRelationsInputCreate = t.Object(
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
  },
  { additionalProperties: false },
);

export const CourseAutoAssignRuleRelationsInputUpdate = t.Partial(
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
    },
    { additionalProperties: false },
  ),
);

export const CourseAutoAssignRuleWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          clinicId: t.String(),
          courseId: t.String(),
          entityType: t.Union(
            [
              t.Literal("BRANCH"),
              t.Literal("ROLE"),
              t.Literal("SPECIALIZATION"),
            ],
            { additionalProperties: false },
          ),
          entityId: t.String(),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "CourseAutoAssignRule" },
  ),
);

export const CourseAutoAssignRuleWhereUnique = t.Recursive(
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
              clinicId: t.String(),
              courseId: t.String(),
              entityType: t.Union(
                [
                  t.Literal("BRANCH"),
                  t.Literal("ROLE"),
                  t.Literal("SPECIALIZATION"),
                ],
                { additionalProperties: false },
              ),
              entityId: t.String(),
              createdAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "CourseAutoAssignRule" },
);

export const CourseAutoAssignRuleSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      clinicId: t.Boolean(),
      courseId: t.Boolean(),
      entityType: t.Boolean(),
      entityId: t.Boolean(),
      createdAt: t.Boolean(),
      clinic: t.Boolean(),
      course: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const CourseAutoAssignRuleInclude = t.Partial(
  t.Object(
    {
      entityType: t.Boolean(),
      clinic: t.Boolean(),
      course: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const CourseAutoAssignRuleOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clinicId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      courseId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      entityId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const CourseAutoAssignRule = t.Composite(
  [CourseAutoAssignRulePlain, CourseAutoAssignRuleRelations],
  { additionalProperties: false },
);

export const CourseAutoAssignRuleInputCreate = t.Composite(
  [
    CourseAutoAssignRulePlainInputCreate,
    CourseAutoAssignRuleRelationsInputCreate,
  ],
  { additionalProperties: false },
);

export const CourseAutoAssignRuleInputUpdate = t.Composite(
  [
    CourseAutoAssignRulePlainInputUpdate,
    CourseAutoAssignRuleRelationsInputUpdate,
  ],
  { additionalProperties: false },
);
