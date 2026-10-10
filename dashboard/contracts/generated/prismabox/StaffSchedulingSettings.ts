import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const StaffSchedulingSettingsPlain = t.Object(
  {
    id: t.String(),
    staffId: t.String(),
    shift: __nullable__(
      t.Union([t.Literal("MORNING"), t.Literal("EVENING"), t.Literal("BOTH")], {
        additionalProperties: false,
      }),
    ),
    morningStartMinute: __nullable__(t.Integer()),
    morningEndMinute: __nullable__(t.Integer()),
    eveningStartMinute: __nullable__(t.Integer()),
    eveningEndMinute: __nullable__(t.Integer()),
    onlineBookingEnabled: t.Boolean(),
    inClinicAppointmentsEnabled: t.Boolean(),
    mobileClinicAppointmentsEnabled: t.Boolean(),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  },
  { additionalProperties: false },
);

export const StaffSchedulingSettingsRelations = t.Object(
  {
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

export const StaffSchedulingSettingsPlainInputCreate = t.Object(
  {
    shift: t.Optional(
      __nullable__(
        t.Union(
          [t.Literal("MORNING"), t.Literal("EVENING"), t.Literal("BOTH")],
          { additionalProperties: false },
        ),
      ),
    ),
    morningStartMinute: t.Optional(__nullable__(t.Integer())),
    morningEndMinute: t.Optional(__nullable__(t.Integer())),
    eveningStartMinute: t.Optional(__nullable__(t.Integer())),
    eveningEndMinute: t.Optional(__nullable__(t.Integer())),
    onlineBookingEnabled: t.Optional(t.Boolean()),
    inClinicAppointmentsEnabled: t.Optional(t.Boolean()),
    mobileClinicAppointmentsEnabled: t.Optional(t.Boolean()),
  },
  { additionalProperties: false },
);

export const StaffSchedulingSettingsPlainInputUpdate = t.Object(
  {
    shift: t.Optional(
      __nullable__(
        t.Union(
          [t.Literal("MORNING"), t.Literal("EVENING"), t.Literal("BOTH")],
          { additionalProperties: false },
        ),
      ),
    ),
    morningStartMinute: t.Optional(__nullable__(t.Integer())),
    morningEndMinute: t.Optional(__nullable__(t.Integer())),
    eveningStartMinute: t.Optional(__nullable__(t.Integer())),
    eveningEndMinute: t.Optional(__nullable__(t.Integer())),
    onlineBookingEnabled: t.Optional(t.Boolean()),
    inClinicAppointmentsEnabled: t.Optional(t.Boolean()),
    mobileClinicAppointmentsEnabled: t.Optional(t.Boolean()),
  },
  { additionalProperties: false },
);

export const StaffSchedulingSettingsRelationsInputCreate = t.Object(
  {
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

export const StaffSchedulingSettingsRelationsInputUpdate = t.Partial(
  t.Object(
    {
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

export const StaffSchedulingSettingsWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          staffId: t.String(),
          shift: t.Union(
            [t.Literal("MORNING"), t.Literal("EVENING"), t.Literal("BOTH")],
            { additionalProperties: false },
          ),
          morningStartMinute: t.Integer(),
          morningEndMinute: t.Integer(),
          eveningStartMinute: t.Integer(),
          eveningEndMinute: t.Integer(),
          onlineBookingEnabled: t.Boolean(),
          inClinicAppointmentsEnabled: t.Boolean(),
          mobileClinicAppointmentsEnabled: t.Boolean(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "StaffSchedulingSettings" },
  ),
);

export const StaffSchedulingSettingsWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.String(), staffId: t.String() },
            { additionalProperties: false },
          ),
          { additionalProperties: false },
        ),
        t.Union(
          [t.Object({ id: t.String() }), t.Object({ staffId: t.String() })],
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
              staffId: t.String(),
              shift: t.Union(
                [t.Literal("MORNING"), t.Literal("EVENING"), t.Literal("BOTH")],
                { additionalProperties: false },
              ),
              morningStartMinute: t.Integer(),
              morningEndMinute: t.Integer(),
              eveningStartMinute: t.Integer(),
              eveningEndMinute: t.Integer(),
              onlineBookingEnabled: t.Boolean(),
              inClinicAppointmentsEnabled: t.Boolean(),
              mobileClinicAppointmentsEnabled: t.Boolean(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "StaffSchedulingSettings" },
);

export const StaffSchedulingSettingsSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      staffId: t.Boolean(),
      shift: t.Boolean(),
      morningStartMinute: t.Boolean(),
      morningEndMinute: t.Boolean(),
      eveningStartMinute: t.Boolean(),
      eveningEndMinute: t.Boolean(),
      onlineBookingEnabled: t.Boolean(),
      inClinicAppointmentsEnabled: t.Boolean(),
      mobileClinicAppointmentsEnabled: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      staff: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const StaffSchedulingSettingsInclude = t.Partial(
  t.Object(
    { shift: t.Boolean(), staff: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const StaffSchedulingSettingsOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      staffId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      morningStartMinute: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      morningEndMinute: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      eveningStartMinute: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      eveningEndMinute: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      onlineBookingEnabled: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      inClinicAppointmentsEnabled: t.Union(
        [t.Literal("asc"), t.Literal("desc")],
        { additionalProperties: false },
      ),
      mobileClinicAppointmentsEnabled: t.Union(
        [t.Literal("asc"), t.Literal("desc")],
        { additionalProperties: false },
      ),
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

export const StaffSchedulingSettings = t.Composite(
  [StaffSchedulingSettingsPlain, StaffSchedulingSettingsRelations],
  { additionalProperties: false },
);

export const StaffSchedulingSettingsInputCreate = t.Composite(
  [
    StaffSchedulingSettingsPlainInputCreate,
    StaffSchedulingSettingsRelationsInputCreate,
  ],
  { additionalProperties: false },
);

export const StaffSchedulingSettingsInputUpdate = t.Composite(
  [
    StaffSchedulingSettingsPlainInputUpdate,
    StaffSchedulingSettingsRelationsInputUpdate,
  ],
  { additionalProperties: false },
);
