import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const MobileUnitActivityPlain = t.Object(
  {
    id: t.String(),
    clinicId: t.String(),
    mobileUnitId: t.String(),
    authorUserId: __nullable__(t.String()),
    type: t.Union(
      [
        t.Literal("CREATED"),
        t.Literal("UPDATED"),
        t.Literal("ENABLED"),
        t.Literal("DISABLED"),
        t.Literal("DELETED"),
        t.Literal("STATUS_CHANGED"),
        t.Literal("CREW_ADDED"),
        t.Literal("CREW_REMOVED"),
        t.Literal("DEVICE_PAIRED"),
        t.Literal("DEVICE_REVOKED"),
        t.Literal("SHIFT_STARTED"),
        t.Literal("SHIFT_ENDED"),
        t.Literal("STOCK_RECEIVED"),
        t.Literal("VISIT_ASSIGNED"),
        t.Literal("VISIT_UNASSIGNED"),
      ],
      { additionalProperties: false },
    ),
    body: __nullable__(t.String()),
    metadata: __nullable__(t.Any()),
    createdAt: t.Date(),
  },
  { additionalProperties: false },
);

export const MobileUnitActivityRelations = t.Object(
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
    author: __nullable__(
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

export const MobileUnitActivityPlainInputCreate = t.Object(
  {
    type: t.Union(
      [
        t.Literal("CREATED"),
        t.Literal("UPDATED"),
        t.Literal("ENABLED"),
        t.Literal("DISABLED"),
        t.Literal("DELETED"),
        t.Literal("STATUS_CHANGED"),
        t.Literal("CREW_ADDED"),
        t.Literal("CREW_REMOVED"),
        t.Literal("DEVICE_PAIRED"),
        t.Literal("DEVICE_REVOKED"),
        t.Literal("SHIFT_STARTED"),
        t.Literal("SHIFT_ENDED"),
        t.Literal("STOCK_RECEIVED"),
        t.Literal("VISIT_ASSIGNED"),
        t.Literal("VISIT_UNASSIGNED"),
      ],
      { additionalProperties: false },
    ),
    body: t.Optional(__nullable__(t.String())),
    metadata: t.Optional(__nullable__(t.Any())),
  },
  { additionalProperties: false },
);

export const MobileUnitActivityPlainInputUpdate = t.Object(
  {
    type: t.Optional(
      t.Union(
        [
          t.Literal("CREATED"),
          t.Literal("UPDATED"),
          t.Literal("ENABLED"),
          t.Literal("DISABLED"),
          t.Literal("DELETED"),
          t.Literal("STATUS_CHANGED"),
          t.Literal("CREW_ADDED"),
          t.Literal("CREW_REMOVED"),
          t.Literal("DEVICE_PAIRED"),
          t.Literal("DEVICE_REVOKED"),
          t.Literal("SHIFT_STARTED"),
          t.Literal("SHIFT_ENDED"),
          t.Literal("STOCK_RECEIVED"),
          t.Literal("VISIT_ASSIGNED"),
          t.Literal("VISIT_UNASSIGNED"),
        ],
        { additionalProperties: false },
      ),
    ),
    body: t.Optional(__nullable__(t.String())),
    metadata: t.Optional(__nullable__(t.Any())),
  },
  { additionalProperties: false },
);

export const MobileUnitActivityRelationsInputCreate = t.Object(
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
    author: t.Optional(
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

export const MobileUnitActivityRelationsInputUpdate = t.Partial(
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
      author: t.Partial(
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

export const MobileUnitActivityWhere = t.Partial(
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
          authorUserId: t.String(),
          type: t.Union(
            [
              t.Literal("CREATED"),
              t.Literal("UPDATED"),
              t.Literal("ENABLED"),
              t.Literal("DISABLED"),
              t.Literal("DELETED"),
              t.Literal("STATUS_CHANGED"),
              t.Literal("CREW_ADDED"),
              t.Literal("CREW_REMOVED"),
              t.Literal("DEVICE_PAIRED"),
              t.Literal("DEVICE_REVOKED"),
              t.Literal("SHIFT_STARTED"),
              t.Literal("SHIFT_ENDED"),
              t.Literal("STOCK_RECEIVED"),
              t.Literal("VISIT_ASSIGNED"),
              t.Literal("VISIT_UNASSIGNED"),
            ],
            { additionalProperties: false },
          ),
          body: t.String(),
          metadata: t.Any(),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "MobileUnitActivity" },
  ),
);

export const MobileUnitActivityWhereUnique = t.Recursive(
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
              clinicId: t.String(),
              mobileUnitId: t.String(),
              authorUserId: t.String(),
              type: t.Union(
                [
                  t.Literal("CREATED"),
                  t.Literal("UPDATED"),
                  t.Literal("ENABLED"),
                  t.Literal("DISABLED"),
                  t.Literal("DELETED"),
                  t.Literal("STATUS_CHANGED"),
                  t.Literal("CREW_ADDED"),
                  t.Literal("CREW_REMOVED"),
                  t.Literal("DEVICE_PAIRED"),
                  t.Literal("DEVICE_REVOKED"),
                  t.Literal("SHIFT_STARTED"),
                  t.Literal("SHIFT_ENDED"),
                  t.Literal("STOCK_RECEIVED"),
                  t.Literal("VISIT_ASSIGNED"),
                  t.Literal("VISIT_UNASSIGNED"),
                ],
                { additionalProperties: false },
              ),
              body: t.String(),
              metadata: t.Any(),
              createdAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "MobileUnitActivity" },
);

export const MobileUnitActivitySelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      clinicId: t.Boolean(),
      mobileUnitId: t.Boolean(),
      authorUserId: t.Boolean(),
      type: t.Boolean(),
      body: t.Boolean(),
      metadata: t.Boolean(),
      createdAt: t.Boolean(),
      clinic: t.Boolean(),
      mobileUnit: t.Boolean(),
      author: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const MobileUnitActivityInclude = t.Partial(
  t.Object(
    {
      type: t.Boolean(),
      clinic: t.Boolean(),
      mobileUnit: t.Boolean(),
      author: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const MobileUnitActivityOrderBy = t.Partial(
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
      authorUserId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      body: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      metadata: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const MobileUnitActivity = t.Composite(
  [MobileUnitActivityPlain, MobileUnitActivityRelations],
  { additionalProperties: false },
);

export const MobileUnitActivityInputCreate = t.Composite(
  [MobileUnitActivityPlainInputCreate, MobileUnitActivityRelationsInputCreate],
  { additionalProperties: false },
);

export const MobileUnitActivityInputUpdate = t.Composite(
  [MobileUnitActivityPlainInputUpdate, MobileUnitActivityRelationsInputUpdate],
  { additionalProperties: false },
);
