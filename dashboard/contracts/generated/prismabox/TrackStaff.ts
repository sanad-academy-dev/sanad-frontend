import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const TrackStaffPlain = t.Object(
  {
    id: t.String(),
    trackId: t.String(),
    staffId: t.String(),
    role: __nullable__(t.String()),
    assignedAt: t.Date(),
  },
  { additionalProperties: false },
);

export const TrackStaffRelations = t.Object(
  {
    track: t.Object(
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

export const TrackStaffPlainInputCreate = t.Object(
  {
    role: t.Optional(__nullable__(t.String())),
    assignedAt: t.Optional(t.Date()),
  },
  { additionalProperties: false },
);

export const TrackStaffPlainInputUpdate = t.Object(
  {
    role: t.Optional(__nullable__(t.String())),
    assignedAt: t.Optional(t.Date()),
  },
  { additionalProperties: false },
);

export const TrackStaffRelationsInputCreate = t.Object(
  {
    track: t.Object(
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

export const TrackStaffRelationsInputUpdate = t.Partial(
  t.Object(
    {
      track: t.Object(
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

export const TrackStaffWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          trackId: t.String(),
          staffId: t.String(),
          role: t.String(),
          assignedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "TrackStaff" },
  ),
);

export const TrackStaffWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            {
              id: t.String(),
              trackId_staffId: t.Object(
                { trackId: t.String(), staffId: t.String() },
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
              trackId_staffId: t.Object(
                { trackId: t.String(), staffId: t.String() },
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
              trackId: t.String(),
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
  { $id: "TrackStaff" },
);

export const TrackStaffSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      trackId: t.Boolean(),
      staffId: t.Boolean(),
      role: t.Boolean(),
      assignedAt: t.Boolean(),
      track: t.Boolean(),
      staff: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const TrackStaffInclude = t.Partial(
  t.Object(
    { track: t.Boolean(), staff: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const TrackStaffOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      trackId: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const TrackStaff = t.Composite([TrackStaffPlain, TrackStaffRelations], {
  additionalProperties: false,
});

export const TrackStaffInputCreate = t.Composite(
  [TrackStaffPlainInputCreate, TrackStaffRelationsInputCreate],
  { additionalProperties: false },
);

export const TrackStaffInputUpdate = t.Composite(
  [TrackStaffPlainInputUpdate, TrackStaffRelationsInputUpdate],
  { additionalProperties: false },
);
