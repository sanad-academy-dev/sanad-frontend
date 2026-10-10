import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const MobileUnitCrewPlain = t.Object(
  {
    id: t.String(),
    clinicId: t.String(),
    mobileUnitId: t.String(),
    staffId: t.String(),
    role: t.Union(
      [
        t.Literal("DRIVER"),
        t.Literal("VET"),
        t.Literal("TECHNICIAN"),
        t.Literal("GROOMER"),
        t.Literal("ASSISTANT"),
      ],
      { additionalProperties: false },
    ),
    isPrimary: t.Boolean(),
    active: t.Boolean(),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  },
  { additionalProperties: false },
);

export const MobileUnitCrewRelations = t.Object(
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
    mobileUnit: t.Object(
      {
        id: t.String(),
        code: t.String(),
        clinicId: t.String(),
        branchId: t.String(),
        warehouseId: t.String(),
        name: t.String(),
        plateNumber: __nullable__(t.String()),
        vehicleMake: __nullable__(t.String()),
        vehicleModel: __nullable__(t.String()),
        year: __nullable__(t.Integer()),
        color: __nullable__(t.String()),
        photo: __nullable__(t.String()),
        status: t.Union(
          [
            t.Literal("OFFLINE"),
            t.Literal("AVAILABLE"),
            t.Literal("EN_ROUTE"),
            t.Literal("ON_SITE"),
            t.Literal("RETURNING"),
            t.Literal("ON_BREAK"),
            t.Literal("OUT_OF_SERVICE"),
          ],
          { additionalProperties: false },
        ),
        active: t.Boolean(),
        isDeleted: t.Boolean(),
        deletedAt: __nullable__(t.Date()),
        lastLat: __nullable__(t.Number()),
        lastLng: __nullable__(t.Number()),
        lastLocationAt: __nullable__(t.Date()),
        lastSpeedKph: __nullable__(t.Number()),
        lastHeading: __nullable__(t.Integer()),
        lastBatteryPct: __nullable__(t.Integer()),
        settings: __nullable__(t.Any()),
        notes: __nullable__(t.String()),
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
  },
  { additionalProperties: false },
);

export const MobileUnitCrewPlainInputCreate = t.Object(
  {
    role: t.Union(
      [
        t.Literal("DRIVER"),
        t.Literal("VET"),
        t.Literal("TECHNICIAN"),
        t.Literal("GROOMER"),
        t.Literal("ASSISTANT"),
      ],
      { additionalProperties: false },
    ),
    isPrimary: t.Optional(t.Boolean()),
    active: t.Optional(t.Boolean()),
  },
  { additionalProperties: false },
);

export const MobileUnitCrewPlainInputUpdate = t.Object(
  {
    role: t.Optional(
      t.Union(
        [
          t.Literal("DRIVER"),
          t.Literal("VET"),
          t.Literal("TECHNICIAN"),
          t.Literal("GROOMER"),
          t.Literal("ASSISTANT"),
        ],
        { additionalProperties: false },
      ),
    ),
    isPrimary: t.Optional(t.Boolean()),
    active: t.Optional(t.Boolean()),
  },
  { additionalProperties: false },
);

export const MobileUnitCrewRelationsInputCreate = t.Object(
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
    mobileUnit: t.Object(
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

export const MobileUnitCrewRelationsInputUpdate = t.Partial(
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
      mobileUnit: t.Object(
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

export const MobileUnitCrewWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          clinicId: t.String(),
          mobileUnitId: t.String(),
          staffId: t.String(),
          role: t.Union(
            [
              t.Literal("DRIVER"),
              t.Literal("VET"),
              t.Literal("TECHNICIAN"),
              t.Literal("GROOMER"),
              t.Literal("ASSISTANT"),
            ],
            { additionalProperties: false },
          ),
          isPrimary: t.Boolean(),
          active: t.Boolean(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "MobileUnitCrew" },
  ),
);

export const MobileUnitCrewWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            {
              id: t.String(),
              mobileUnitId_staffId: t.Object(
                { mobileUnitId: t.String(), staffId: t.String() },
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
              mobileUnitId_staffId: t.Object(
                { mobileUnitId: t.String(), staffId: t.String() },
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
              mobileUnitId: t.String(),
              staffId: t.String(),
              role: t.Union(
                [
                  t.Literal("DRIVER"),
                  t.Literal("VET"),
                  t.Literal("TECHNICIAN"),
                  t.Literal("GROOMER"),
                  t.Literal("ASSISTANT"),
                ],
                { additionalProperties: false },
              ),
              isPrimary: t.Boolean(),
              active: t.Boolean(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "MobileUnitCrew" },
);

export const MobileUnitCrewSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      clinicId: t.Boolean(),
      mobileUnitId: t.Boolean(),
      staffId: t.Boolean(),
      role: t.Boolean(),
      isPrimary: t.Boolean(),
      active: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinic: t.Boolean(),
      mobileUnit: t.Boolean(),
      staff: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const MobileUnitCrewInclude = t.Partial(
  t.Object(
    {
      role: t.Boolean(),
      clinic: t.Boolean(),
      mobileUnit: t.Boolean(),
      staff: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const MobileUnitCrewOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clinicId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      mobileUnitId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      staffId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      isPrimary: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      active: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const MobileUnitCrew = t.Composite(
  [MobileUnitCrewPlain, MobileUnitCrewRelations],
  { additionalProperties: false },
);

export const MobileUnitCrewInputCreate = t.Composite(
  [MobileUnitCrewPlainInputCreate, MobileUnitCrewRelationsInputCreate],
  { additionalProperties: false },
);

export const MobileUnitCrewInputUpdate = t.Composite(
  [MobileUnitCrewPlainInputUpdate, MobileUnitCrewRelationsInputUpdate],
  { additionalProperties: false },
);
