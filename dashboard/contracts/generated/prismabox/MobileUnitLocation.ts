import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const MobileUnitLocationPlain = t.Object(
  {
    id: t.String(),
    clinicId: t.String(),
    mobileUnitId: t.String(),
    shiftId: __nullable__(t.String()),
    lat: t.Number(),
    lng: t.Number(),
    accuracyM: __nullable__(t.Integer()),
    speedKph: __nullable__(t.Number()),
    heading: __nullable__(t.Integer()),
    altitudeM: __nullable__(t.Integer()),
    batteryPct: __nullable__(t.Integer()),
    isMoving: t.Boolean(),
    isCharging: __nullable__(t.Boolean()),
    recordedAt: t.Date(),
    receivedAt: t.Date(),
  },
  { additionalProperties: false },
);

export const MobileUnitLocationRelations = t.Object(
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
    shift: __nullable__(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          mobileUnitId: t.String(),
          openedByStaffId: t.String(),
          startedAt: t.Date(),
          endedAt: __nullable__(t.Date()),
          odometerStart: __nullable__(t.Integer()),
          odometerEnd: __nullable__(t.Integer()),
          startLat: __nullable__(t.Number()),
          startLng: __nullable__(t.Number()),
          distanceKm: __nullable__(t.Number()),
          notes: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    ),
  },
  { additionalProperties: false },
);

export const MobileUnitLocationPlainInputCreate = t.Object(
  {
    lat: t.Number(),
    lng: t.Number(),
    accuracyM: t.Optional(__nullable__(t.Integer())),
    speedKph: t.Optional(__nullable__(t.Number())),
    heading: t.Optional(__nullable__(t.Integer())),
    altitudeM: t.Optional(__nullable__(t.Integer())),
    batteryPct: t.Optional(__nullable__(t.Integer())),
    isMoving: t.Optional(t.Boolean()),
    isCharging: t.Optional(__nullable__(t.Boolean())),
    recordedAt: t.Date(),
    receivedAt: t.Optional(t.Date()),
  },
  { additionalProperties: false },
);

export const MobileUnitLocationPlainInputUpdate = t.Object(
  {
    lat: t.Optional(t.Number()),
    lng: t.Optional(t.Number()),
    accuracyM: t.Optional(__nullable__(t.Integer())),
    speedKph: t.Optional(__nullable__(t.Number())),
    heading: t.Optional(__nullable__(t.Integer())),
    altitudeM: t.Optional(__nullable__(t.Integer())),
    batteryPct: t.Optional(__nullable__(t.Integer())),
    isMoving: t.Optional(t.Boolean()),
    isCharging: t.Optional(__nullable__(t.Boolean())),
    recordedAt: t.Optional(t.Date()),
    receivedAt: t.Optional(t.Date()),
  },
  { additionalProperties: false },
);

export const MobileUnitLocationRelationsInputCreate = t.Object(
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
    shift: t.Optional(
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

export const MobileUnitLocationRelationsInputUpdate = t.Partial(
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
      shift: t.Partial(
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

export const MobileUnitLocationWhere = t.Partial(
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
          shiftId: t.String(),
          lat: t.Number(),
          lng: t.Number(),
          accuracyM: t.Integer(),
          speedKph: t.Number(),
          heading: t.Integer(),
          altitudeM: t.Integer(),
          batteryPct: t.Integer(),
          isMoving: t.Boolean(),
          isCharging: t.Boolean(),
          recordedAt: t.Date(),
          receivedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "MobileUnitLocation" },
  ),
);

export const MobileUnitLocationWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            {
              id: t.String(),
              mobileUnitId_recordedAt: t.Object(
                { mobileUnitId: t.String(), recordedAt: t.Date() },
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
              mobileUnitId_recordedAt: t.Object(
                { mobileUnitId: t.String(), recordedAt: t.Date() },
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
              shiftId: t.String(),
              lat: t.Number(),
              lng: t.Number(),
              accuracyM: t.Integer(),
              speedKph: t.Number(),
              heading: t.Integer(),
              altitudeM: t.Integer(),
              batteryPct: t.Integer(),
              isMoving: t.Boolean(),
              isCharging: t.Boolean(),
              recordedAt: t.Date(),
              receivedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "MobileUnitLocation" },
);

export const MobileUnitLocationSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      clinicId: t.Boolean(),
      mobileUnitId: t.Boolean(),
      shiftId: t.Boolean(),
      lat: t.Boolean(),
      lng: t.Boolean(),
      accuracyM: t.Boolean(),
      speedKph: t.Boolean(),
      heading: t.Boolean(),
      altitudeM: t.Boolean(),
      batteryPct: t.Boolean(),
      isMoving: t.Boolean(),
      isCharging: t.Boolean(),
      recordedAt: t.Boolean(),
      receivedAt: t.Boolean(),
      clinic: t.Boolean(),
      mobileUnit: t.Boolean(),
      shift: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const MobileUnitLocationInclude = t.Partial(
  t.Object(
    {
      clinic: t.Boolean(),
      mobileUnit: t.Boolean(),
      shift: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const MobileUnitLocationOrderBy = t.Partial(
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
      shiftId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      lat: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      lng: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      accuracyM: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      speedKph: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      heading: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      altitudeM: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      batteryPct: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      isMoving: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      isCharging: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      recordedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      receivedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const MobileUnitLocation = t.Composite(
  [MobileUnitLocationPlain, MobileUnitLocationRelations],
  { additionalProperties: false },
);

export const MobileUnitLocationInputCreate = t.Composite(
  [MobileUnitLocationPlainInputCreate, MobileUnitLocationRelationsInputCreate],
  { additionalProperties: false },
);

export const MobileUnitLocationInputUpdate = t.Composite(
  [MobileUnitLocationPlainInputUpdate, MobileUnitLocationRelationsInputUpdate],
  { additionalProperties: false },
);
