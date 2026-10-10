import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const CoursePlain = t.Object(
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
      t.Union([t.Literal("ONSITE"), t.Literal("ONLINE"), t.Literal("HYBRID")], {
        additionalProperties: false,
      }),
    ),
    startDate: __nullable__(t.Date()),
    dueDate: __nullable__(t.Date()),
    timezone: __nullable__(t.String()),
    editsCount: t.Integer(),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  },
  { additionalProperties: false },
);

export const CourseRelations = t.Object(
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
    levels: t.Array(
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
      { additionalProperties: false },
    ),
    assignments: t.Array(
      t.Object(
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
      { additionalProperties: false },
    ),
    autoAssignRules: t.Array(
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
          entityId: __nullable__(t.String()),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    completionSettings: __nullable__(
      t.Object(
        {
          id: t.String(),
          courseId: t.String(),
          certificateEnabled: t.Boolean(),
          certReferencePattern: __nullable__(t.String()),
          certValidityDays: __nullable__(t.Integer()),
          certSignatureName: __nullable__(t.String()),
          certPassMark: __nullable__(t.Integer()),
          reEnrollMode: t.Union(
            [
              t.Literal("NONE"),
              t.Literal("AFTER_COMPLETION"),
              t.Literal("BEFORE_EXPIRY"),
            ],
            { additionalProperties: false },
          ),
          reEnrollDays: __nullable__(t.Integer()),
          gamificationPoints: t.Integer(),
          reviewEnabled: t.Boolean(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    ),
    certificates: t.Array(
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
      { additionalProperties: false },
    ),
    trainers: t.Array(
      t.Object(
        {
          id: t.String(),
          courseId: t.String(),
          staffId: t.String(),
          order: t.Integer(),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    reviews: t.Array(
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
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const CoursePlainInputCreate = t.Object(
  {
    code: t.String(),
    name: t.String(),
    department: t.String(),
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
    description: t.Optional(__nullable__(t.String())),
    coverKey: t.Optional(__nullable__(t.String())),
    status: t.Optional(
      t.Union(
        [t.Literal("DRAFT"), t.Literal("PUBLISHED"), t.Literal("ARCHIVED")],
        { additionalProperties: false },
      ),
    ),
    category: t.Optional(__nullable__(t.String())),
    priority: t.Optional(
      t.Union([t.Literal("URGENT"), t.Literal("NORMAL")], {
        additionalProperties: false,
      }),
    ),
    estimatedDurationWeeks: t.Optional(__nullable__(t.Integer())),
    language: t.Optional(
      t.Union([t.Literal("AR"), t.Literal("EN")], {
        additionalProperties: false,
      }),
    ),
    orderMode: t.Optional(
      t.Union([t.Literal("SEQUENTIAL"), t.Literal("FREE")], {
        additionalProperties: false,
      }),
    ),
    trainingCost: t.Optional(__nullable__(t.Integer())),
    institution: t.Optional(__nullable__(t.String())),
    locationMode: t.Optional(
      __nullable__(
        t.Union(
          [t.Literal("ONSITE"), t.Literal("ONLINE"), t.Literal("HYBRID")],
          { additionalProperties: false },
        ),
      ),
    ),
    startDate: t.Optional(__nullable__(t.Date())),
    dueDate: t.Optional(__nullable__(t.Date())),
    timezone: t.Optional(__nullable__(t.String())),
    editsCount: t.Optional(t.Integer()),
  },
  { additionalProperties: false },
);

export const CoursePlainInputUpdate = t.Object(
  {
    code: t.Optional(t.String()),
    name: t.Optional(t.String()),
    department: t.Optional(t.String()),
    type: t.Optional(
      t.Union(
        [
          t.Literal("INTERNAL"),
          t.Literal("WORKSHOP"),
          t.Literal("ONLINE"),
          t.Literal("CERTIFICATION"),
          t.Literal("CONFERENCE"),
        ],
        { additionalProperties: false },
      ),
    ),
    description: t.Optional(__nullable__(t.String())),
    coverKey: t.Optional(__nullable__(t.String())),
    status: t.Optional(
      t.Union(
        [t.Literal("DRAFT"), t.Literal("PUBLISHED"), t.Literal("ARCHIVED")],
        { additionalProperties: false },
      ),
    ),
    category: t.Optional(__nullable__(t.String())),
    priority: t.Optional(
      t.Union([t.Literal("URGENT"), t.Literal("NORMAL")], {
        additionalProperties: false,
      }),
    ),
    estimatedDurationWeeks: t.Optional(__nullable__(t.Integer())),
    language: t.Optional(
      t.Union([t.Literal("AR"), t.Literal("EN")], {
        additionalProperties: false,
      }),
    ),
    orderMode: t.Optional(
      t.Union([t.Literal("SEQUENTIAL"), t.Literal("FREE")], {
        additionalProperties: false,
      }),
    ),
    trainingCost: t.Optional(__nullable__(t.Integer())),
    institution: t.Optional(__nullable__(t.String())),
    locationMode: t.Optional(
      __nullable__(
        t.Union(
          [t.Literal("ONSITE"), t.Literal("ONLINE"), t.Literal("HYBRID")],
          { additionalProperties: false },
        ),
      ),
    ),
    startDate: t.Optional(__nullable__(t.Date())),
    dueDate: t.Optional(__nullable__(t.Date())),
    timezone: t.Optional(__nullable__(t.String())),
    editsCount: t.Optional(t.Integer()),
  },
  { additionalProperties: false },
);

export const CourseRelationsInputCreate = t.Object(
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
    levels: t.Optional(
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
    autoAssignRules: t.Optional(
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
    completionSettings: t.Optional(
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
    certificates: t.Optional(
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
    trainers: t.Optional(
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
    reviews: t.Optional(
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

export const CourseRelationsInputUpdate = t.Partial(
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
      levels: t.Partial(
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
      autoAssignRules: t.Partial(
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
      completionSettings: t.Partial(
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
      certificates: t.Partial(
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
      trainers: t.Partial(
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
      reviews: t.Partial(
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

export const CourseWhere = t.Partial(
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
          name: t.String(),
          department: t.String(),
          targetRoleId: t.String(),
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
          description: t.String(),
          coverKey: t.String(),
          status: t.Union(
            [t.Literal("DRAFT"), t.Literal("PUBLISHED"), t.Literal("ARCHIVED")],
            { additionalProperties: false },
          ),
          category: t.String(),
          priority: t.Union([t.Literal("URGENT"), t.Literal("NORMAL")], {
            additionalProperties: false,
          }),
          estimatedDurationWeeks: t.Integer(),
          language: t.Union([t.Literal("AR"), t.Literal("EN")], {
            additionalProperties: false,
          }),
          orderMode: t.Union([t.Literal("SEQUENTIAL"), t.Literal("FREE")], {
            additionalProperties: false,
          }),
          trainingCost: t.Integer(),
          institution: t.String(),
          locationMode: t.Union(
            [t.Literal("ONSITE"), t.Literal("ONLINE"), t.Literal("HYBRID")],
            { additionalProperties: false },
          ),
          startDate: t.Date(),
          dueDate: t.Date(),
          timezone: t.String(),
          editsCount: t.Integer(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "Course" },
  ),
);

export const CourseWhereUnique = t.Recursive(
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
              name: t.String(),
              department: t.String(),
              targetRoleId: t.String(),
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
              description: t.String(),
              coverKey: t.String(),
              status: t.Union(
                [
                  t.Literal("DRAFT"),
                  t.Literal("PUBLISHED"),
                  t.Literal("ARCHIVED"),
                ],
                { additionalProperties: false },
              ),
              category: t.String(),
              priority: t.Union([t.Literal("URGENT"), t.Literal("NORMAL")], {
                additionalProperties: false,
              }),
              estimatedDurationWeeks: t.Integer(),
              language: t.Union([t.Literal("AR"), t.Literal("EN")], {
                additionalProperties: false,
              }),
              orderMode: t.Union([t.Literal("SEQUENTIAL"), t.Literal("FREE")], {
                additionalProperties: false,
              }),
              trainingCost: t.Integer(),
              institution: t.String(),
              locationMode: t.Union(
                [t.Literal("ONSITE"), t.Literal("ONLINE"), t.Literal("HYBRID")],
                { additionalProperties: false },
              ),
              startDate: t.Date(),
              dueDate: t.Date(),
              timezone: t.String(),
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
  { $id: "Course" },
);

export const CourseSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      code: t.Boolean(),
      clinicId: t.Boolean(),
      name: t.Boolean(),
      department: t.Boolean(),
      targetRoleId: t.Boolean(),
      type: t.Boolean(),
      description: t.Boolean(),
      coverKey: t.Boolean(),
      status: t.Boolean(),
      category: t.Boolean(),
      priority: t.Boolean(),
      estimatedDurationWeeks: t.Boolean(),
      language: t.Boolean(),
      orderMode: t.Boolean(),
      trainingCost: t.Boolean(),
      institution: t.Boolean(),
      locationMode: t.Boolean(),
      startDate: t.Boolean(),
      dueDate: t.Boolean(),
      timezone: t.Boolean(),
      editsCount: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinic: t.Boolean(),
      targetRole: t.Boolean(),
      units: t.Boolean(),
      levels: t.Boolean(),
      assignments: t.Boolean(),
      autoAssignRules: t.Boolean(),
      completionSettings: t.Boolean(),
      certificates: t.Boolean(),
      trainers: t.Boolean(),
      reviews: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const CourseInclude = t.Partial(
  t.Object(
    {
      type: t.Boolean(),
      status: t.Boolean(),
      priority: t.Boolean(),
      language: t.Boolean(),
      orderMode: t.Boolean(),
      locationMode: t.Boolean(),
      clinic: t.Boolean(),
      targetRole: t.Boolean(),
      units: t.Boolean(),
      levels: t.Boolean(),
      assignments: t.Boolean(),
      autoAssignRules: t.Boolean(),
      completionSettings: t.Boolean(),
      certificates: t.Boolean(),
      trainers: t.Boolean(),
      reviews: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const CourseOrderBy = t.Partial(
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
      name: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      department: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      targetRoleId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      description: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      coverKey: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      category: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      estimatedDurationWeeks: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      trainingCost: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      institution: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      startDate: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      dueDate: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      timezone: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const Course = t.Composite([CoursePlain, CourseRelations], {
  additionalProperties: false,
});

export const CourseInputCreate = t.Composite(
  [CoursePlainInputCreate, CourseRelationsInputCreate],
  { additionalProperties: false },
);

export const CourseInputUpdate = t.Composite(
  [CoursePlainInputUpdate, CourseRelationsInputUpdate],
  { additionalProperties: false },
);
