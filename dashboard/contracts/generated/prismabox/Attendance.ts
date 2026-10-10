import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const AttendancePlain = t.Object(
  {
    id: t.String(),
    clinicId: t.String(),
    staffId: t.String(),
    date: t.Date(),
    checkIn: __nullable__(t.Date()),
    checkOut: __nullable__(t.Date()),
    status: t.Union(
      [
        t.Literal("PRESENT"),
        t.Literal("ABSENT"),
        t.Literal("LATE"),
        t.Literal("LEAVE"),
        t.Literal("MISSION"),
        t.Literal("OVERTIME"),
      ],
      { additionalProperties: false },
    ),
    hours: t.Number(),
    notes: __nullable__(t.String()),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  },
  { additionalProperties: false },
);

export const AttendanceRelations = t.Object(
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
  },
  { additionalProperties: false },
);

export const AttendancePlainInputCreate = t.Object(
  {
    date: t.Date(),
    checkIn: t.Optional(__nullable__(t.Date())),
    checkOut: t.Optional(__nullable__(t.Date())),
    status: t.Optional(
      t.Union(
        [
          t.Literal("PRESENT"),
          t.Literal("ABSENT"),
          t.Literal("LATE"),
          t.Literal("LEAVE"),
          t.Literal("MISSION"),
          t.Literal("OVERTIME"),
        ],
        { additionalProperties: false },
      ),
    ),
    hours: t.Optional(t.Number()),
    notes: t.Optional(__nullable__(t.String())),
  },
  { additionalProperties: false },
);

export const AttendancePlainInputUpdate = t.Object(
  {
    date: t.Optional(t.Date()),
    checkIn: t.Optional(__nullable__(t.Date())),
    checkOut: t.Optional(__nullable__(t.Date())),
    status: t.Optional(
      t.Union(
        [
          t.Literal("PRESENT"),
          t.Literal("ABSENT"),
          t.Literal("LATE"),
          t.Literal("LEAVE"),
          t.Literal("MISSION"),
          t.Literal("OVERTIME"),
        ],
        { additionalProperties: false },
      ),
    ),
    hours: t.Optional(t.Number()),
    notes: t.Optional(__nullable__(t.String())),
  },
  { additionalProperties: false },
);

export const AttendanceRelationsInputCreate = t.Object(
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
  },
  { additionalProperties: false },
);

export const AttendanceRelationsInputUpdate = t.Partial(
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
    },
    { additionalProperties: false },
  ),
);

export const AttendanceWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          clinicId: t.String(),
          staffId: t.String(),
          date: t.Date(),
          checkIn: t.Date(),
          checkOut: t.Date(),
          status: t.Union(
            [
              t.Literal("PRESENT"),
              t.Literal("ABSENT"),
              t.Literal("LATE"),
              t.Literal("LEAVE"),
              t.Literal("MISSION"),
              t.Literal("OVERTIME"),
            ],
            { additionalProperties: false },
          ),
          hours: t.Number(),
          notes: t.String(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "Attendance" },
  ),
);

export const AttendanceWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            {
              id: t.String(),
              staffId_date: t.Object(
                { staffId: t.String(), date: t.Date() },
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
              staffId_date: t.Object(
                { staffId: t.String(), date: t.Date() },
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
              clinicId: t.String(),
              staffId: t.String(),
              date: t.Date(),
              checkIn: t.Date(),
              checkOut: t.Date(),
              status: t.Union(
                [
                  t.Literal("PRESENT"),
                  t.Literal("ABSENT"),
                  t.Literal("LATE"),
                  t.Literal("LEAVE"),
                  t.Literal("MISSION"),
                  t.Literal("OVERTIME"),
                ],
                { additionalProperties: false },
              ),
              hours: t.Number(),
              notes: t.String(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "Attendance" },
);

export const AttendanceSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      clinicId: t.Boolean(),
      staffId: t.Boolean(),
      date: t.Boolean(),
      checkIn: t.Boolean(),
      checkOut: t.Boolean(),
      status: t.Boolean(),
      hours: t.Boolean(),
      notes: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinic: t.Boolean(),
      staff: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const AttendanceInclude = t.Partial(
  t.Object(
    {
      status: t.Boolean(),
      clinic: t.Boolean(),
      staff: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const AttendanceOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clinicId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      staffId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      date: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      checkIn: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      checkOut: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      hours: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      notes: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const Attendance = t.Composite([AttendancePlain, AttendanceRelations], {
  additionalProperties: false,
});

export const AttendanceInputCreate = t.Composite(
  [AttendancePlainInputCreate, AttendanceRelationsInputCreate],
  { additionalProperties: false },
);

export const AttendanceInputUpdate = t.Composite(
  [AttendancePlainInputUpdate, AttendanceRelationsInputUpdate],
  { additionalProperties: false },
);
