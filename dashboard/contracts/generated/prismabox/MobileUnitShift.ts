import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const MobileUnitShiftPlain = t.Object(
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
);

export const MobileUnitShiftRelations = t.Object(
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
    openedByStaff: t.Object(
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
    locations: t.Array(
      t.Object(
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
      ),
      { additionalProperties: false },
    ),
    visits: t.Array(
      t.Object(
        {
          id: t.String(),
          appointmentId: t.String(),
          clinicId: t.String(),
          mobileUnitId: __nullable__(t.String()),
          shiftId: __nullable__(t.String()),
          serviceAddressId: t.String(),
          sequence: __nullable__(t.Integer()),
          windowStart: __nullable__(t.Date()),
          windowEnd: __nullable__(t.Date()),
          etaAt: __nullable__(t.Date()),
          dispatchStage: t.Union(
            [
              t.Literal("PENDING"),
              t.Literal("ASSIGNED"),
              t.Literal("EN_ROUTE"),
              t.Literal("ARRIVED"),
              t.Literal("IN_SERVICE"),
              t.Literal("COMPLETED"),
              t.Literal("FAILED"),
              t.Literal("CANCELLED"),
            ],
            { additionalProperties: false },
          ),
          enRouteAt: __nullable__(t.Date()),
          arrivedAt: __nullable__(t.Date()),
          departedAt: __nullable__(t.Date()),
          arrivalLat: __nullable__(t.Number()),
          arrivalLng: __nullable__(t.Number()),
          arrivalDriftM: __nullable__(t.Integer()),
          distanceKm: __nullable__(t.Number()),
          travelMinutes: __nullable__(t.Integer()),
          travelFee: __nullable__(t.Number()),
          failureReason: __nullable__(
            t.Union(
              [
                t.Literal("NO_ANSWER"),
                t.Literal("ADDRESS_NOT_FOUND"),
                t.Literal("ACCESS_DENIED"),
                t.Literal("PET_UNAVAILABLE"),
                t.Literal("OWNER_CANCELLED"),
                t.Literal("VEHICLE_ISSUE"),
                t.Literal("WEATHER"),
                t.Literal("OTHER"),
              ],
              { additionalProperties: false },
            ),
          ),
          failureNote: __nullable__(t.String()),
          signatureUrl: __nullable__(t.String()),
          photos: t.Array(t.String(), { additionalProperties: false }),
          trackingToken: t.String(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const MobileUnitShiftPlainInputCreate = t.Object(
  {
    startedAt: t.Optional(t.Date()),
    endedAt: t.Optional(__nullable__(t.Date())),
    odometerStart: t.Optional(__nullable__(t.Integer())),
    odometerEnd: t.Optional(__nullable__(t.Integer())),
    startLat: t.Optional(__nullable__(t.Number())),
    startLng: t.Optional(__nullable__(t.Number())),
    distanceKm: t.Optional(__nullable__(t.Number())),
    notes: t.Optional(__nullable__(t.String())),
  },
  { additionalProperties: false },
);

export const MobileUnitShiftPlainInputUpdate = t.Object(
  {
    startedAt: t.Optional(t.Date()),
    endedAt: t.Optional(__nullable__(t.Date())),
    odometerStart: t.Optional(__nullable__(t.Integer())),
    odometerEnd: t.Optional(__nullable__(t.Integer())),
    startLat: t.Optional(__nullable__(t.Number())),
    startLng: t.Optional(__nullable__(t.Number())),
    distanceKm: t.Optional(__nullable__(t.Number())),
    notes: t.Optional(__nullable__(t.String())),
  },
  { additionalProperties: false },
);

export const MobileUnitShiftRelationsInputCreate = t.Object(
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
    openedByStaff: t.Object(
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
    locations: t.Optional(
      t.Object(
        {
          connect: t.Array(
            t.Object(
              {
                id: t.String({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
    ),
    visits: t.Optional(
      t.Object(
        {
          connect: t.Array(
            t.Object(
              {
                id: t.String({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
    ),
  },
  { additionalProperties: false },
);

export const MobileUnitShiftRelationsInputUpdate = t.Partial(
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
      openedByStaff: t.Object(
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
      locations: t.Partial(
        t.Object(
          {
            connect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
            disconnect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
          },
          { additionalProperties: false },
        ),
      ),
      visits: t.Partial(
        t.Object(
          {
            connect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
            disconnect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
          },
          { additionalProperties: false },
        ),
      ),
    },
    { additionalProperties: false },
  ),
);

export const MobileUnitShiftWhere = t.Partial(
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
          openedByStaffId: t.String(),
          startedAt: t.Date(),
          endedAt: t.Date(),
          odometerStart: t.Integer(),
          odometerEnd: t.Integer(),
          startLat: t.Number(),
          startLng: t.Number(),
          distanceKm: t.Number(),
          notes: t.String(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "MobileUnitShift" },
  ),
);

export const MobileUnitShiftWhereUnique = t.Recursive(
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
              openedByStaffId: t.String(),
              startedAt: t.Date(),
              endedAt: t.Date(),
              odometerStart: t.Integer(),
              odometerEnd: t.Integer(),
              startLat: t.Number(),
              startLng: t.Number(),
              distanceKm: t.Number(),
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
  { $id: "MobileUnitShift" },
);

export const MobileUnitShiftSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      clinicId: t.Boolean(),
      mobileUnitId: t.Boolean(),
      openedByStaffId: t.Boolean(),
      startedAt: t.Boolean(),
      endedAt: t.Boolean(),
      odometerStart: t.Boolean(),
      odometerEnd: t.Boolean(),
      startLat: t.Boolean(),
      startLng: t.Boolean(),
      distanceKm: t.Boolean(),
      notes: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinic: t.Boolean(),
      mobileUnit: t.Boolean(),
      openedByStaff: t.Boolean(),
      locations: t.Boolean(),
      visits: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const MobileUnitShiftInclude = t.Partial(
  t.Object(
    {
      clinic: t.Boolean(),
      mobileUnit: t.Boolean(),
      openedByStaff: t.Boolean(),
      locations: t.Boolean(),
      visits: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const MobileUnitShiftOrderBy = t.Partial(
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
      openedByStaffId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      startedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      endedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      odometerStart: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      odometerEnd: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      startLat: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      startLng: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      distanceKm: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const MobileUnitShift = t.Composite(
  [MobileUnitShiftPlain, MobileUnitShiftRelations],
  { additionalProperties: false },
);

export const MobileUnitShiftInputCreate = t.Composite(
  [MobileUnitShiftPlainInputCreate, MobileUnitShiftRelationsInputCreate],
  { additionalProperties: false },
);

export const MobileUnitShiftInputUpdate = t.Composite(
  [MobileUnitShiftPlainInputUpdate, MobileUnitShiftRelationsInputUpdate],
  { additionalProperties: false },
);
