import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const StaffConsultationTypePlain = t.Object(
  {
    id: t.String(),
    staffId: t.String(),
    consultationTypeId: t.String(),
    isActive: t.Boolean(),
    usageCount: t.Integer(),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  },
  { additionalProperties: false },
);

export const StaffConsultationTypeRelations = t.Object(
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
    consultationType: t.Object(
      {
        id: t.String(),
        clinicId: __nullable__(t.String()),
        name: t.String(),
        isDefault: t.Boolean(),
        active: t.Boolean(),
        order: t.Integer(),
        createdAt: t.Date(),
        updatedAt: t.Date(),
      },
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const StaffConsultationTypePlainInputCreate = t.Object(
  { isActive: t.Optional(t.Boolean()), usageCount: t.Optional(t.Integer()) },
  { additionalProperties: false },
);

export const StaffConsultationTypePlainInputUpdate = t.Object(
  { isActive: t.Optional(t.Boolean()), usageCount: t.Optional(t.Integer()) },
  { additionalProperties: false },
);

export const StaffConsultationTypeRelationsInputCreate = t.Object(
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
    consultationType: t.Object(
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

export const StaffConsultationTypeRelationsInputUpdate = t.Partial(
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
      consultationType: t.Object(
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

export const StaffConsultationTypeWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          staffId: t.String(),
          consultationTypeId: t.String(),
          isActive: t.Boolean(),
          usageCount: t.Integer(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "StaffConsultationType" },
  ),
);

export const StaffConsultationTypeWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            {
              id: t.String(),
              staffId_consultationTypeId: t.Object(
                { staffId: t.String(), consultationTypeId: t.String() },
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
              staffId_consultationTypeId: t.Object(
                { staffId: t.String(), consultationTypeId: t.String() },
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
              consultationTypeId: t.String(),
              isActive: t.Boolean(),
              usageCount: t.Integer(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "StaffConsultationType" },
);

export const StaffConsultationTypeSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      staffId: t.Boolean(),
      consultationTypeId: t.Boolean(),
      isActive: t.Boolean(),
      usageCount: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      staff: t.Boolean(),
      consultationType: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const StaffConsultationTypeInclude = t.Partial(
  t.Object(
    { staff: t.Boolean(), consultationType: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const StaffConsultationTypeOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      staffId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      consultationTypeId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      isActive: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      usageCount: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const StaffConsultationType = t.Composite(
  [StaffConsultationTypePlain, StaffConsultationTypeRelations],
  { additionalProperties: false },
);

export const StaffConsultationTypeInputCreate = t.Composite(
  [
    StaffConsultationTypePlainInputCreate,
    StaffConsultationTypeRelationsInputCreate,
  ],
  { additionalProperties: false },
);

export const StaffConsultationTypeInputUpdate = t.Composite(
  [
    StaffConsultationTypePlainInputUpdate,
    StaffConsultationTypeRelationsInputUpdate,
  ],
  { additionalProperties: false },
);
