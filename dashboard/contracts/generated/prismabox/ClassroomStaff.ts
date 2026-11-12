import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const ClassroomStaffPlain = t.Object(
  {
    id: t.String(),
    classroomId: t.String(),
    staffId: t.String(),
    role: __nullable__(t.String()),
    assignedAt: t.Date(),
  },
  { additionalProperties: false },
);

export const ClassroomStaffRelations = t.Object(
  {
    classroom: t.Object(
      {
        id: t.String(),
        code: t.String(),
        clinicId: t.String(),
        name: t.String(),
        ageGroup: __nullable__(t.String()),
        academicStage: __nullable__(t.String()),
        category: __nullable__(t.String()),
        classification: __nullable__(t.String()),
        learningMode: t.String(),
        capacity: t.Integer(),
        enrolledCount: t.Integer(),
        active: t.Boolean(),
        notes: __nullable__(t.String()),
        isDeleted: t.Boolean(),
        deletedAt: __nullable__(t.Date()),
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

export const ClassroomStaffPlainInputCreate = t.Object(
  {
    role: t.Optional(__nullable__(t.String())),
    assignedAt: t.Optional(t.Date()),
  },
  { additionalProperties: false },
);

export const ClassroomStaffPlainInputUpdate = t.Object(
  {
    role: t.Optional(__nullable__(t.String())),
    assignedAt: t.Optional(t.Date()),
  },
  { additionalProperties: false },
);

export const ClassroomStaffRelationsInputCreate = t.Object(
  {
    classroom: t.Object(
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

export const ClassroomStaffRelationsInputUpdate = t.Partial(
  t.Object(
    {
      classroom: t.Object(
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

export const ClassroomStaffWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          classroomId: t.String(),
          staffId: t.String(),
          role: t.String(),
          assignedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "ClassroomStaff" },
  ),
);

export const ClassroomStaffWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            {
              id: t.String(),
              classroomId_staffId: t.Object(
                { classroomId: t.String(), staffId: t.String() },
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
              classroomId_staffId: t.Object(
                { classroomId: t.String(), staffId: t.String() },
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
              classroomId: t.String(),
              staffId: t.String(),
              role: t.String(),
              assignedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "ClassroomStaff" },
);

export const ClassroomStaffSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      classroomId: t.Boolean(),
      staffId: t.Boolean(),
      role: t.Boolean(),
      assignedAt: t.Boolean(),
      classroom: t.Boolean(),
      staff: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const ClassroomStaffInclude = t.Partial(
  t.Object(
    { classroom: t.Boolean(), staff: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const ClassroomStaffOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      classroomId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      staffId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      role: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      assignedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const ClassroomStaff = t.Composite(
  [ClassroomStaffPlain, ClassroomStaffRelations],
  { additionalProperties: false },
);

export const ClassroomStaffInputCreate = t.Composite(
  [ClassroomStaffPlainInputCreate, ClassroomStaffRelationsInputCreate],
  { additionalProperties: false },
);

export const ClassroomStaffInputUpdate = t.Composite(
  [ClassroomStaffPlainInputUpdate, ClassroomStaffRelationsInputUpdate],
  { additionalProperties: false },
);
