import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const CourseAssignmentPlain = t.Object(
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
      [t.Literal("ASSIGNED"), t.Literal("IN_PROGRESS"), t.Literal("COMPLETED")],
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
);

export const CourseAssignmentRelations = t.Object(
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
    lessonProgress: t.Array(
      t.Object(
        {
          id: t.String(),
          assignmentId: t.String(),
          lessonId: t.String(),
          completedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    certificate: __nullable__(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          courseId: t.String(),
          staffId: t.String(),
          assignmentId: t.String(),
          referenceNumber: t.String(),
          issuedAt: t.Date(),
          validUntil: __nullable__(t.Date()),
          signatureName: __nullable__(t.String()),
          passMark: __nullable__(t.Integer()),
          pdfKey: __nullable__(t.String()),
        },
        { additionalProperties: false },
      ),
    ),
    review: __nullable__(
      t.Object(
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
      ),
    ),
  },
  { additionalProperties: false },
);

export const CourseAssignmentPlainInputCreate = t.Object(
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
    progress: t.Optional(t.Integer()),
    assignedAt: t.Optional(t.Date()),
    startedAt: t.Optional(__nullable__(t.Date())),
    completedAt: t.Optional(__nullable__(t.Date())),
    startDate: t.Optional(__nullable__(t.Date())),
    dueDate: t.Optional(__nullable__(t.Date())),
  },
  { additionalProperties: false },
);

export const CourseAssignmentPlainInputUpdate = t.Object(
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
    progress: t.Optional(t.Integer()),
    assignedAt: t.Optional(t.Date()),
    startedAt: t.Optional(__nullable__(t.Date())),
    completedAt: t.Optional(__nullable__(t.Date())),
    startDate: t.Optional(__nullable__(t.Date())),
    dueDate: t.Optional(__nullable__(t.Date())),
  },
  { additionalProperties: false },
);

export const CourseAssignmentRelationsInputCreate = t.Object(
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
    lessonProgress: t.Optional(
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
    certificate: t.Optional(
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
    review: t.Optional(
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
  },
  { additionalProperties: false },
);

export const CourseAssignmentRelationsInputUpdate = t.Partial(
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
      lessonProgress: t.Partial(
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
      certificate: t.Partial(
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
      review: t.Partial(
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
    },
    { additionalProperties: false },
  ),
);

export const CourseAssignmentWhere = t.Partial(
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
          startedAt: t.Date(),
          completedAt: t.Date(),
          startDate: t.Date(),
          dueDate: t.Date(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "CourseAssignment" },
  ),
);

export const CourseAssignmentWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            {
              id: t.String(),
              code: t.String(),
              courseId_staffId_cycle: t.Object(
                {
                  courseId: t.String(),
                  staffId: t.String(),
                  cycle: t.Integer(),
                },
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
              courseId_staffId_cycle: t.Object(
                {
                  courseId: t.String(),
                  staffId: t.String(),
                  cycle: t.Integer(),
                },
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
              courseId: t.String(),
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
              progress: t.Integer(),
              assignedAt: t.Date(),
              startedAt: t.Date(),
              completedAt: t.Date(),
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
  { $id: "CourseAssignment" },
);

export const CourseAssignmentSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      code: t.Boolean(),
      clinicId: t.Boolean(),
      courseId: t.Boolean(),
      staffId: t.Boolean(),
      cycle: t.Boolean(),
      source: t.Boolean(),
      status: t.Boolean(),
      progress: t.Boolean(),
      assignedAt: t.Boolean(),
      startedAt: t.Boolean(),
      completedAt: t.Boolean(),
      startDate: t.Boolean(),
      dueDate: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinic: t.Boolean(),
      course: t.Boolean(),
      staff: t.Boolean(),
      lessonProgress: t.Boolean(),
      certificate: t.Boolean(),
      review: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const CourseAssignmentInclude = t.Partial(
  t.Object(
    {
      source: t.Boolean(),
      status: t.Boolean(),
      clinic: t.Boolean(),
      course: t.Boolean(),
      staff: t.Boolean(),
      lessonProgress: t.Boolean(),
      certificate: t.Boolean(),
      review: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const CourseAssignmentOrderBy = t.Partial(
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
      courseId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      staffId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      cycle: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      progress: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      assignedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      startedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      completedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const CourseAssignment = t.Composite(
  [CourseAssignmentPlain, CourseAssignmentRelations],
  { additionalProperties: false },
);

export const CourseAssignmentInputCreate = t.Composite(
  [CourseAssignmentPlainInputCreate, CourseAssignmentRelationsInputCreate],
  { additionalProperties: false },
);

export const CourseAssignmentInputUpdate = t.Composite(
  [CourseAssignmentPlainInputUpdate, CourseAssignmentRelationsInputUpdate],
  { additionalProperties: false },
);
