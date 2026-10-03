import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const StaffWorkingHourPlain = t.Object(
  {
    id: t.String(),
    staffId: t.String(),
    weekday: t.Union(
      [
        t.Literal("SUNDAY"),
        t.Literal("MONDAY"),
        t.Literal("TUESDAY"),
        t.Literal("WEDNESDAY"),
        t.Literal("THURSDAY"),
        t.Literal("FRIDAY"),
        t.Literal("SATURDAY"),
      ],
      { additionalProperties: false },
    ),
    isWorking: t.Boolean(),
    startMinute: __nullable__(t.Integer()),
    endMinute: __nullable__(t.Integer()),
  },
  { additionalProperties: false },
);

export const StaffWorkingHourRelations = t.Object(
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

export const StaffWorkingHourPlainInputCreate = t.Object(
  {
    weekday: t.Union(
      [
        t.Literal("SUNDAY"),
        t.Literal("MONDAY"),
        t.Literal("TUESDAY"),
        t.Literal("WEDNESDAY"),
        t.Literal("THURSDAY"),
        t.Literal("FRIDAY"),
        t.Literal("SATURDAY"),
      ],
      { additionalProperties: false },
    ),
    isWorking: t.Optional(t.Boolean()),
    startMinute: t.Optional(__nullable__(t.Integer())),
    endMinute: t.Optional(__nullable__(t.Integer())),
  },
  { additionalProperties: false },
);

export const StaffWorkingHourPlainInputUpdate = t.Object(
  {
    weekday: t.Optional(
      t.Union(
        [
          t.Literal("SUNDAY"),
          t.Literal("MONDAY"),
          t.Literal("TUESDAY"),
          t.Literal("WEDNESDAY"),
          t.Literal("THURSDAY"),
          t.Literal("FRIDAY"),
          t.Literal("SATURDAY"),
        ],
        { additionalProperties: false },
      ),
    ),
    isWorking: t.Optional(t.Boolean()),
    startMinute: t.Optional(__nullable__(t.Integer())),
    endMinute: t.Optional(__nullable__(t.Integer())),
  },
  { additionalProperties: false },
);

export const StaffWorkingHourRelationsInputCreate = t.Object(
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

export const StaffWorkingHourRelationsInputUpdate = t.Partial(
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

export const StaffWorkingHourWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          staffId: t.String(),
          weekday: t.Union(
            [
              t.Literal("SUNDAY"),
              t.Literal("MONDAY"),
              t.Literal("TUESDAY"),
              t.Literal("WEDNESDAY"),
              t.Literal("THURSDAY"),
              t.Literal("FRIDAY"),
              t.Literal("SATURDAY"),
            ],
            { additionalProperties: false },
          ),
          isWorking: t.Boolean(),
          startMinute: t.Integer(),
          endMinute: t.Integer(),
        },
        { additionalProperties: false },
      ),
    { $id: "StaffWorkingHour" },
  ),
);

export const StaffWorkingHourWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            {
              id: t.String(),
              staffId_weekday: t.Object(
                {
                  staffId: t.String(),
                  weekday: t.Union(
                    [
                      t.Literal("SUNDAY"),
                      t.Literal("MONDAY"),
                      t.Literal("TUESDAY"),
                      t.Literal("WEDNESDAY"),
                      t.Literal("THURSDAY"),
                      t.Literal("FRIDAY"),
                      t.Literal("SATURDAY"),
                    ],
                    { additionalProperties: false },
                  ),
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
            t.Object({
              staffId_weekday: t.Object(
                {
                  staffId: t.String(),
                  weekday: t.Union(
                    [
                      t.Literal("SUNDAY"),
                      t.Literal("MONDAY"),
                      t.Literal("TUESDAY"),
                      t.Literal("WEDNESDAY"),
                      t.Literal("THURSDAY"),
                      t.Literal("FRIDAY"),
                      t.Literal("SATURDAY"),
                    ],
                    { additionalProperties: false },
                  ),
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
              staffId: t.String(),
              weekday: t.Union(
                [
                  t.Literal("SUNDAY"),
                  t.Literal("MONDAY"),
                  t.Literal("TUESDAY"),
                  t.Literal("WEDNESDAY"),
                  t.Literal("THURSDAY"),
                  t.Literal("FRIDAY"),
                  t.Literal("SATURDAY"),
                ],
                { additionalProperties: false },
              ),
              isWorking: t.Boolean(),
              startMinute: t.Integer(),
              endMinute: t.Integer(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "StaffWorkingHour" },
);

export const StaffWorkingHourSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      staffId: t.Boolean(),
      weekday: t.Boolean(),
      isWorking: t.Boolean(),
      startMinute: t.Boolean(),
      endMinute: t.Boolean(),
      staff: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const StaffWorkingHourInclude = t.Partial(
  t.Object(
    { weekday: t.Boolean(), staff: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const StaffWorkingHourOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      staffId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      isWorking: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      startMinute: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      endMinute: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const StaffWorkingHour = t.Composite(
  [StaffWorkingHourPlain, StaffWorkingHourRelations],
  { additionalProperties: false },
);

export const StaffWorkingHourInputCreate = t.Composite(
  [StaffWorkingHourPlainInputCreate, StaffWorkingHourRelationsInputCreate],
  { additionalProperties: false },
);

export const StaffWorkingHourInputUpdate = t.Composite(
  [StaffWorkingHourPlainInputUpdate, StaffWorkingHourRelationsInputUpdate],
  { additionalProperties: false },
);
