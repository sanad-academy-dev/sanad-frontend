import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const CourseReviewPlain = t.Object(
  {
    id: t.String(),
    clinicId: t.String(),
    courseId: t.String(),
    staffId: t.String(),
    assignmentId: t.String(),
    rating: t.Integer(),
    comment: __nullable__(t.String()),
    createdAt: t.Date(),
  },
  { additionalProperties: false },
);

export const CourseReviewRelations = t.Object(
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
  },
  { additionalProperties: false },
);

export const CourseReviewPlainInputCreate = t.Object(
  { rating: t.Integer(), comment: t.Optional(__nullable__(t.String())) },
  { additionalProperties: false },
);

export const CourseReviewPlainInputUpdate = t.Object(
  {
    rating: t.Optional(t.Integer()),
    comment: t.Optional(__nullable__(t.String())),
  },
  { additionalProperties: false },
);

export const CourseReviewRelationsInputCreate = t.Object(
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
  },
  { additionalProperties: false },
);

export const CourseReviewRelationsInputUpdate = t.Partial(
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
    },
    { additionalProperties: false },
  ),
);

export const CourseReviewWhere = t.Partial(
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
          staffId: t.String(),
          assignmentId: t.String(),
          rating: t.Integer(),
          comment: t.String(),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "CourseReview" },
  ),
);

export const CourseReviewWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.String(), assignmentId: t.String() },
            { additionalProperties: false },
          ),
          { additionalProperties: false },
        ),
        t.Union(
          [
            t.Object({ id: t.String() }),
            t.Object({ assignmentId: t.String() }),
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
              clinicId: t.String(),
              courseId: t.String(),
              staffId: t.String(),
              assignmentId: t.String(),
              rating: t.Integer(),
              comment: t.String(),
              createdAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "CourseReview" },
);

export const CourseReviewSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      clinicId: t.Boolean(),
      courseId: t.Boolean(),
      staffId: t.Boolean(),
      assignmentId: t.Boolean(),
      rating: t.Boolean(),
      comment: t.Boolean(),
      createdAt: t.Boolean(),
      clinic: t.Boolean(),
      course: t.Boolean(),
      staff: t.Boolean(),
      assignment: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const CourseReviewInclude = t.Partial(
  t.Object(
    {
      clinic: t.Boolean(),
      course: t.Boolean(),
      staff: t.Boolean(),
      assignment: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const CourseReviewOrderBy = t.Partial(
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
      staffId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      assignmentId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      rating: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      comment: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const CourseReview = t.Composite(
  [CourseReviewPlain, CourseReviewRelations],
  { additionalProperties: false },
);

export const CourseReviewInputCreate = t.Composite(
  [CourseReviewPlainInputCreate, CourseReviewRelationsInputCreate],
  { additionalProperties: false },
);

export const CourseReviewInputUpdate = t.Composite(
  [CourseReviewPlainInputUpdate, CourseReviewRelationsInputUpdate],
  { additionalProperties: false },
);
