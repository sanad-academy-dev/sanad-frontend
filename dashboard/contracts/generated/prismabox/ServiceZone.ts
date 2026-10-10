import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const ServiceZonePlain = t.Object(
  {
    id: t.String(),
    clinicId: t.String(),
    name: t.String(),
    color: __nullable__(t.String()),
    shape: t.Union([t.Literal("CIRCLE"), t.Literal("POLYGON")], {
      additionalProperties: false,
    }),
    centerLat: __nullable__(t.Number()),
    centerLng: __nullable__(t.Number()),
    radiusKm: __nullable__(t.Number()),
    polygon: __nullable__(t.Any()),
    travelFee: __nullable__(t.Number()),
    active: t.Boolean(),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  },
  { additionalProperties: false },
);

export const ServiceZoneRelations = t.Object(
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
    requests: t.Array(
      t.Object(
        {
          id: t.String(),
          code: t.String(),
          clinicId: t.String(),
          ownerName: t.String(),
          phone: t.String(),
          email: __nullable__(t.String()),
          ownerId: __nullable__(t.String()),
          addressLine: t.String(),
          district: __nullable__(t.String()),
          city: __nullable__(t.String()),
          lat: __nullable__(t.Number()),
          lng: __nullable__(t.Number()),
          landmark: __nullable__(t.String()),
          animalTypeId: __nullable__(t.String()),
          petName: __nullable__(t.String()),
          petNotes: __nullable__(t.String()),
          serviceIds: t.Array(t.String(), { additionalProperties: false }),
          preferredDate: __nullable__(t.Date()),
          preferredWindow: __nullable__(
            t.Union(
              [
                t.Literal("MORNING"),
                t.Literal("AFTERNOON"),
                t.Literal("EVENING"),
                t.Literal("ANY"),
              ],
              { additionalProperties: false },
            ),
          ),
          notes: __nullable__(t.String()),
          attachments: t.Array(t.String(), { additionalProperties: false }),
          status: t.Union(
            [
              t.Literal("NEW"),
              t.Literal("CONTACTED"),
              t.Literal("SCHEDULED"),
              t.Literal("REJECTED"),
              t.Literal("SPAM"),
            ],
            { additionalProperties: false },
          ),
          zoneId: __nullable__(t.String()),
          appointmentId: __nullable__(t.String()),
          handledById: __nullable__(t.String()),
          handledAt: __nullable__(t.Date()),
          rejectionReason: __nullable__(t.String()),
          ipHash: __nullable__(t.String()),
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

export const ServiceZonePlainInputCreate = t.Object(
  {
    name: t.String(),
    color: t.Optional(__nullable__(t.String())),
    shape: t.Optional(
      t.Union([t.Literal("CIRCLE"), t.Literal("POLYGON")], {
        additionalProperties: false,
      }),
    ),
    centerLat: t.Optional(__nullable__(t.Number())),
    centerLng: t.Optional(__nullable__(t.Number())),
    radiusKm: t.Optional(__nullable__(t.Number())),
    polygon: t.Optional(__nullable__(t.Any())),
    travelFee: t.Optional(__nullable__(t.Number())),
    active: t.Optional(t.Boolean()),
  },
  { additionalProperties: false },
);

export const ServiceZonePlainInputUpdate = t.Object(
  {
    name: t.Optional(t.String()),
    color: t.Optional(__nullable__(t.String())),
    shape: t.Optional(
      t.Union([t.Literal("CIRCLE"), t.Literal("POLYGON")], {
        additionalProperties: false,
      }),
    ),
    centerLat: t.Optional(__nullable__(t.Number())),
    centerLng: t.Optional(__nullable__(t.Number())),
    radiusKm: t.Optional(__nullable__(t.Number())),
    polygon: t.Optional(__nullable__(t.Any())),
    travelFee: t.Optional(__nullable__(t.Number())),
    active: t.Optional(t.Boolean()),
  },
  { additionalProperties: false },
);

export const ServiceZoneRelationsInputCreate = t.Object(
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
    requests: t.Optional(
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

export const ServiceZoneRelationsInputUpdate = t.Partial(
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
      requests: t.Partial(
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

export const ServiceZoneWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          clinicId: t.String(),
          name: t.String(),
          color: t.String(),
          shape: t.Union([t.Literal("CIRCLE"), t.Literal("POLYGON")], {
            additionalProperties: false,
          }),
          centerLat: t.Number(),
          centerLng: t.Number(),
          radiusKm: t.Number(),
          polygon: t.Any(),
          travelFee: t.Number(),
          active: t.Boolean(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "ServiceZone" },
  ),
);

export const ServiceZoneWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            {
              id: t.String(),
              clinicId_name: t.Object(
                { clinicId: t.String(), name: t.String() },
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
              clinicId_name: t.Object(
                { clinicId: t.String(), name: t.String() },
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
              name: t.String(),
              color: t.String(),
              shape: t.Union([t.Literal("CIRCLE"), t.Literal("POLYGON")], {
                additionalProperties: false,
              }),
              centerLat: t.Number(),
              centerLng: t.Number(),
              radiusKm: t.Number(),
              polygon: t.Any(),
              travelFee: t.Number(),
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
  { $id: "ServiceZone" },
);

export const ServiceZoneSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      clinicId: t.Boolean(),
      name: t.Boolean(),
      color: t.Boolean(),
      shape: t.Boolean(),
      centerLat: t.Boolean(),
      centerLng: t.Boolean(),
      radiusKm: t.Boolean(),
      polygon: t.Boolean(),
      travelFee: t.Boolean(),
      active: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinic: t.Boolean(),
      requests: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const ServiceZoneInclude = t.Partial(
  t.Object(
    {
      shape: t.Boolean(),
      clinic: t.Boolean(),
      requests: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const ServiceZoneOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clinicId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      name: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      color: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      centerLat: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      centerLng: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      radiusKm: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      polygon: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      travelFee: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const ServiceZone = t.Composite(
  [ServiceZonePlain, ServiceZoneRelations],
  { additionalProperties: false },
);

export const ServiceZoneInputCreate = t.Composite(
  [ServiceZonePlainInputCreate, ServiceZoneRelationsInputCreate],
  { additionalProperties: false },
);

export const ServiceZoneInputUpdate = t.Composite(
  [ServiceZonePlainInputUpdate, ServiceZoneRelationsInputUpdate],
  { additionalProperties: false },
);
