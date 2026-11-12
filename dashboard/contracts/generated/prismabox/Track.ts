import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const TrackPlain = t.Object(
  {
    id: t.String(),
    code: t.String(),
    clinicId: t.String(),
    name: t.String(),
    category: __nullable__(t.String()),
    coursesCount: t.Integer(),
    locationMode: t.String(),
    locationLabel: __nullable__(t.String()),
    duration: __nullable__(t.String()),
    studentsCount: t.Integer(),
    rating: t.Number(),
    reviewsCount: t.Integer(),
    price: t.Integer(),
    revenue: t.Integer(),
    status: t.String(),
    description: __nullable__(t.String()),
    notes: __nullable__(t.String()),
    academicStage: __nullable__(t.String()),
    ageGroup: __nullable__(t.String()),
    trainers: t.Any(),
    selectedIcon: __nullable__(t.String()),
    selectedColor: __nullable__(t.String()),
    active: t.Boolean(),
    isDeleted: t.Boolean(),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  },
  { additionalProperties: false },
);

export const TrackRelations = t.Object(
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
    students: t.Array(
      t.Object(
        {
          id: t.String(),
          trackId: t.String(),
          patientId: t.String(),
          notes: __nullable__(t.String()),
          assignedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    staff: t.Array(
      t.Object(
        {
          id: t.String(),
          trackId: t.String(),
          staffId: t.String(),
          role: __nullable__(t.String()),
          assignedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const TrackPlainInputCreate = t.Object(
  {
    code: t.String(),
    name: t.String(),
    category: t.Optional(__nullable__(t.String())),
    coursesCount: t.Optional(t.Integer()),
    locationMode: t.Optional(t.String()),
    locationLabel: t.Optional(__nullable__(t.String())),
    duration: t.Optional(__nullable__(t.String())),
    studentsCount: t.Optional(t.Integer()),
    rating: t.Optional(t.Number()),
    reviewsCount: t.Optional(t.Integer()),
    price: t.Optional(t.Integer()),
    revenue: t.Optional(t.Integer()),
    status: t.Optional(t.String()),
    description: t.Optional(__nullable__(t.String())),
    notes: t.Optional(__nullable__(t.String())),
    academicStage: t.Optional(__nullable__(t.String())),
    ageGroup: t.Optional(__nullable__(t.String())),
    trainers: t.Optional(t.Any()),
    selectedIcon: t.Optional(__nullable__(t.String())),
    selectedColor: t.Optional(__nullable__(t.String())),
    active: t.Optional(t.Boolean()),
    isDeleted: t.Optional(t.Boolean()),
  },
  { additionalProperties: false },
);

export const TrackPlainInputUpdate = t.Object(
  {
    code: t.Optional(t.String()),
    name: t.Optional(t.String()),
    category: t.Optional(__nullable__(t.String())),
    coursesCount: t.Optional(t.Integer()),
    locationMode: t.Optional(t.String()),
    locationLabel: t.Optional(__nullable__(t.String())),
    duration: t.Optional(__nullable__(t.String())),
    studentsCount: t.Optional(t.Integer()),
    rating: t.Optional(t.Number()),
    reviewsCount: t.Optional(t.Integer()),
    price: t.Optional(t.Integer()),
    revenue: t.Optional(t.Integer()),
    status: t.Optional(t.String()),
    description: t.Optional(__nullable__(t.String())),
    notes: t.Optional(__nullable__(t.String())),
    academicStage: t.Optional(__nullable__(t.String())),
    ageGroup: t.Optional(__nullable__(t.String())),
    trainers: t.Optional(t.Any()),
    selectedIcon: t.Optional(__nullable__(t.String())),
    selectedColor: t.Optional(__nullable__(t.String())),
    active: t.Optional(t.Boolean()),
    isDeleted: t.Optional(t.Boolean()),
  },
  { additionalProperties: false },
);

export const TrackRelationsInputCreate = t.Object(
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
    students: t.Optional(
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
    staff: t.Optional(
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

export const TrackRelationsInputUpdate = t.Partial(
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
      students: t.Partial(
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
      staff: t.Partial(
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

export const TrackWhere = t.Partial(
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
          category: t.String(),
          coursesCount: t.Integer(),
          locationMode: t.String(),
          locationLabel: t.String(),
          duration: t.String(),
          studentsCount: t.Integer(),
          rating: t.Number(),
          reviewsCount: t.Integer(),
          price: t.Integer(),
          revenue: t.Integer(),
          status: t.String(),
          description: t.String(),
          notes: t.String(),
          academicStage: t.String(),
          ageGroup: t.String(),
          trainers: t.Any(),
          selectedIcon: t.String(),
          selectedColor: t.String(),
          active: t.Boolean(),
          isDeleted: t.Boolean(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "Track" },
  ),
);

export const TrackWhereUnique = t.Recursive(
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
              code: t.String(),
              clinicId: t.String(),
              name: t.String(),
              category: t.String(),
              coursesCount: t.Integer(),
              locationMode: t.String(),
              locationLabel: t.String(),
              duration: t.String(),
              studentsCount: t.Integer(),
              rating: t.Number(),
              reviewsCount: t.Integer(),
              price: t.Integer(),
              revenue: t.Integer(),
              status: t.String(),
              description: t.String(),
              notes: t.String(),
              academicStage: t.String(),
              ageGroup: t.String(),
              trainers: t.Any(),
              selectedIcon: t.String(),
              selectedColor: t.String(),
              active: t.Boolean(),
              isDeleted: t.Boolean(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "Track" },
);

export const TrackSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      code: t.Boolean(),
      clinicId: t.Boolean(),
      name: t.Boolean(),
      category: t.Boolean(),
      coursesCount: t.Boolean(),
      locationMode: t.Boolean(),
      locationLabel: t.Boolean(),
      duration: t.Boolean(),
      studentsCount: t.Boolean(),
      rating: t.Boolean(),
      reviewsCount: t.Boolean(),
      price: t.Boolean(),
      revenue: t.Boolean(),
      status: t.Boolean(),
      description: t.Boolean(),
      notes: t.Boolean(),
      academicStage: t.Boolean(),
      ageGroup: t.Boolean(),
      trainers: t.Boolean(),
      selectedIcon: t.Boolean(),
      selectedColor: t.Boolean(),
      active: t.Boolean(),
      isDeleted: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinic: t.Boolean(),
      students: t.Boolean(),
      staff: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const TrackInclude = t.Partial(
  t.Object(
    {
      clinic: t.Boolean(),
      students: t.Boolean(),
      staff: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const TrackOrderBy = t.Partial(
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
      category: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      coursesCount: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      locationMode: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      locationLabel: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      duration: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      studentsCount: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      rating: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      reviewsCount: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      price: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      revenue: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      status: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      description: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      notes: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      academicStage: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      ageGroup: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      trainers: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      selectedIcon: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      selectedColor: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      active: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      isDeleted: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const Track = t.Composite([TrackPlain, TrackRelations], {
  additionalProperties: false,
});

export const TrackInputCreate = t.Composite(
  [TrackPlainInputCreate, TrackRelationsInputCreate],
  { additionalProperties: false },
);

export const TrackInputUpdate = t.Composite(
  [TrackPlainInputUpdate, TrackRelationsInputUpdate],
  { additionalProperties: false },
);
