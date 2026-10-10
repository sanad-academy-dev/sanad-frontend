import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const MobileUnitDevicePlain = t.Object(
  {
    id: t.String(),
    clinicId: t.String(),
    mobileUnitId: t.String(),
    tokenHash: t.String(),
    tokenPrefix: t.String(),
    label: t.String(),
    platform: __nullable__(t.String()),
    appVersion: __nullable__(t.String()),
    deviceId: __nullable__(t.String()),
    lastSeenAt: __nullable__(t.Date()),
    pairedAt: t.Date(),
    revokedAt: __nullable__(t.Date()),
    createdById: t.String(),
    revokedById: __nullable__(t.String()),
  },
  { additionalProperties: false },
);

export const MobileUnitDeviceRelations = t.Object(
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
    createdBy: t.Object(
      {
        id: t.String(),
        name: t.String(),
        email: t.String(),
        emailVerified: t.Boolean(),
        image: __nullable__(t.String()),
        phone: __nullable__(t.String()),
        createdAt: t.Date(),
        updatedAt: t.Date(),
      },
      { additionalProperties: false },
    ),
    revokedBy: __nullable__(
      t.Object(
        {
          id: t.String(),
          name: t.String(),
          email: t.String(),
          emailVerified: t.Boolean(),
          image: __nullable__(t.String()),
          phone: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    ),
  },
  { additionalProperties: false },
);

export const MobileUnitDevicePlainInputCreate = t.Object(
  {
    tokenHash: t.String(),
    tokenPrefix: t.String(),
    label: t.String(),
    platform: t.Optional(__nullable__(t.String())),
    appVersion: t.Optional(__nullable__(t.String())),
    lastSeenAt: t.Optional(__nullable__(t.Date())),
    pairedAt: t.Optional(t.Date()),
    revokedAt: t.Optional(__nullable__(t.Date())),
  },
  { additionalProperties: false },
);

export const MobileUnitDevicePlainInputUpdate = t.Object(
  {
    tokenHash: t.Optional(t.String()),
    tokenPrefix: t.Optional(t.String()),
    label: t.Optional(t.String()),
    platform: t.Optional(__nullable__(t.String())),
    appVersion: t.Optional(__nullable__(t.String())),
    lastSeenAt: t.Optional(__nullable__(t.Date())),
    pairedAt: t.Optional(t.Date()),
    revokedAt: t.Optional(__nullable__(t.Date())),
  },
  { additionalProperties: false },
);

export const MobileUnitDeviceRelationsInputCreate = t.Object(
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
    createdBy: t.Object(
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
    revokedBy: t.Optional(
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

export const MobileUnitDeviceRelationsInputUpdate = t.Partial(
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
      createdBy: t.Object(
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
      revokedBy: t.Partial(
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

export const MobileUnitDeviceWhere = t.Partial(
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
          tokenHash: t.String(),
          tokenPrefix: t.String(),
          label: t.String(),
          platform: t.String(),
          appVersion: t.String(),
          deviceId: t.String(),
          lastSeenAt: t.Date(),
          pairedAt: t.Date(),
          revokedAt: t.Date(),
          createdById: t.String(),
          revokedById: t.String(),
        },
        { additionalProperties: false },
      ),
    { $id: "MobileUnitDevice" },
  ),
);

export const MobileUnitDeviceWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.String(), tokenHash: t.String() },
            { additionalProperties: false },
          ),
          { additionalProperties: false },
        ),
        t.Union(
          [t.Object({ id: t.String() }), t.Object({ tokenHash: t.String() })],
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
              tokenHash: t.String(),
              tokenPrefix: t.String(),
              label: t.String(),
              platform: t.String(),
              appVersion: t.String(),
              deviceId: t.String(),
              lastSeenAt: t.Date(),
              pairedAt: t.Date(),
              revokedAt: t.Date(),
              createdById: t.String(),
              revokedById: t.String(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "MobileUnitDevice" },
);

export const MobileUnitDeviceSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      clinicId: t.Boolean(),
      mobileUnitId: t.Boolean(),
      tokenHash: t.Boolean(),
      tokenPrefix: t.Boolean(),
      label: t.Boolean(),
      platform: t.Boolean(),
      appVersion: t.Boolean(),
      deviceId: t.Boolean(),
      lastSeenAt: t.Boolean(),
      pairedAt: t.Boolean(),
      revokedAt: t.Boolean(),
      createdById: t.Boolean(),
      revokedById: t.Boolean(),
      clinic: t.Boolean(),
      mobileUnit: t.Boolean(),
      createdBy: t.Boolean(),
      revokedBy: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const MobileUnitDeviceInclude = t.Partial(
  t.Object(
    {
      clinic: t.Boolean(),
      mobileUnit: t.Boolean(),
      createdBy: t.Boolean(),
      revokedBy: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const MobileUnitDeviceOrderBy = t.Partial(
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
      tokenHash: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      tokenPrefix: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      label: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      platform: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      appVersion: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      deviceId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      lastSeenAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      pairedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      revokedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdById: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      revokedById: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const MobileUnitDevice = t.Composite(
  [MobileUnitDevicePlain, MobileUnitDeviceRelations],
  { additionalProperties: false },
);

export const MobileUnitDeviceInputCreate = t.Composite(
  [MobileUnitDevicePlainInputCreate, MobileUnitDeviceRelationsInputCreate],
  { additionalProperties: false },
);

export const MobileUnitDeviceInputUpdate = t.Composite(
  [MobileUnitDevicePlainInputUpdate, MobileUnitDeviceRelationsInputUpdate],
  { additionalProperties: false },
);
