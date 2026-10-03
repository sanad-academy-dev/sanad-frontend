import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const MobileVisitServicePlain = t.Object(
  {
    id: t.String(),
    clinicId: t.String(),
    mobileVisitId: t.String(),
    serviceId: t.String(),
    quantity: t.Integer(),
    priceSnapshot: t.Number(),
    durationSnapshot: t.Integer(),
    source: t.Union([t.Literal("SCHEDULED"), t.Literal("FIELD")], {
      additionalProperties: false,
      description: `من أين جاء سطر الخدمة: كان على الموعد قبل الانطلاق، أم أضافه الطاقم في الموقع.
التمييز هو ما يجعل تقرير «ما زاد عن المجدول» ممكنًا أصلًا.`,
    }),
    performedAt: t.Date(),
    performedByStaffId: __nullable__(t.String()),
    notes: __nullable__(t.String()),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  },
  { additionalProperties: false },
);

export const MobileVisitServiceRelations = t.Object(
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
    visit: t.Object(
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
    service: t.Object(
      {
        id: t.String(),
        name: t.String(),
        level: t.Union(
          [t.Literal("CATEGORY"), t.Literal("SUBCATEGORY"), t.Literal("ITEM")],
          { additionalProperties: false },
        ),
        parentId: __nullable__(t.String()),
        isDefault: t.Boolean(),
        clinicId: __nullable__(t.String()),
        order: t.Integer(),
        isLabCategory: t.Boolean(),
        isRadiologyCategory: t.Boolean(),
        isOperationCategory: t.Boolean(),
        isGroomingCategory: t.Boolean(),
        consentCode: __nullable__(t.String()),
        createdAt: t.Date(),
      },
      { additionalProperties: false },
    ),
    performedBy: __nullable__(
      t.Object(
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
    ),
  },
  { additionalProperties: false },
);

export const MobileVisitServicePlainInputCreate = t.Object(
  {
    quantity: t.Optional(t.Integer()),
    priceSnapshot: t.Number(),
    durationSnapshot: t.Integer(),
    source: t.Optional(
      t.Union([t.Literal("SCHEDULED"), t.Literal("FIELD")], {
        additionalProperties: false,
        description: `من أين جاء سطر الخدمة: كان على الموعد قبل الانطلاق، أم أضافه الطاقم في الموقع.
التمييز هو ما يجعل تقرير «ما زاد عن المجدول» ممكنًا أصلًا.`,
      }),
    ),
    performedAt: t.Optional(t.Date()),
    notes: t.Optional(__nullable__(t.String())),
  },
  { additionalProperties: false },
);

export const MobileVisitServicePlainInputUpdate = t.Object(
  {
    quantity: t.Optional(t.Integer()),
    priceSnapshot: t.Optional(t.Number()),
    durationSnapshot: t.Optional(t.Integer()),
    source: t.Optional(
      t.Union([t.Literal("SCHEDULED"), t.Literal("FIELD")], {
        additionalProperties: false,
        description: `من أين جاء سطر الخدمة: كان على الموعد قبل الانطلاق، أم أضافه الطاقم في الموقع.
التمييز هو ما يجعل تقرير «ما زاد عن المجدول» ممكنًا أصلًا.`,
      }),
    ),
    performedAt: t.Optional(t.Date()),
    notes: t.Optional(__nullable__(t.String())),
  },
  { additionalProperties: false },
);

export const MobileVisitServiceRelationsInputCreate = t.Object(
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
    visit: t.Object(
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
    service: t.Object(
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
    performedBy: t.Optional(
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

export const MobileVisitServiceRelationsInputUpdate = t.Partial(
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
      visit: t.Object(
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
      service: t.Object(
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
      performedBy: t.Partial(
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

export const MobileVisitServiceWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          clinicId: t.String(),
          mobileVisitId: t.String(),
          serviceId: t.String(),
          quantity: t.Integer(),
          priceSnapshot: t.Number(),
          durationSnapshot: t.Integer(),
          source: t.Union([t.Literal("SCHEDULED"), t.Literal("FIELD")], {
            additionalProperties: false,
            description: `من أين جاء سطر الخدمة: كان على الموعد قبل الانطلاق، أم أضافه الطاقم في الموقع.
التمييز هو ما يجعل تقرير «ما زاد عن المجدول» ممكنًا أصلًا.`,
          }),
          performedAt: t.Date(),
          performedByStaffId: t.String(),
          notes: t.String(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "MobileVisitService" },
  ),
);

export const MobileVisitServiceWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            {
              id: t.String(),
              mobileVisitId_serviceId: t.Object(
                { mobileVisitId: t.String(), serviceId: t.String() },
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
              mobileVisitId_serviceId: t.Object(
                { mobileVisitId: t.String(), serviceId: t.String() },
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
              mobileVisitId: t.String(),
              serviceId: t.String(),
              quantity: t.Integer(),
              priceSnapshot: t.Number(),
              durationSnapshot: t.Integer(),
              source: t.Union([t.Literal("SCHEDULED"), t.Literal("FIELD")], {
                additionalProperties: false,
                description: `من أين جاء سطر الخدمة: كان على الموعد قبل الانطلاق، أم أضافه الطاقم في الموقع.
التمييز هو ما يجعل تقرير «ما زاد عن المجدول» ممكنًا أصلًا.`,
              }),
              performedAt: t.Date(),
              performedByStaffId: t.String(),
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
  { $id: "MobileVisitService" },
);

export const MobileVisitServiceSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      clinicId: t.Boolean(),
      mobileVisitId: t.Boolean(),
      serviceId: t.Boolean(),
      quantity: t.Boolean(),
      priceSnapshot: t.Boolean(),
      durationSnapshot: t.Boolean(),
      source: t.Boolean(),
      performedAt: t.Boolean(),
      performedByStaffId: t.Boolean(),
      notes: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinic: t.Boolean(),
      visit: t.Boolean(),
      service: t.Boolean(),
      performedBy: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const MobileVisitServiceInclude = t.Partial(
  t.Object(
    {
      source: t.Boolean(),
      clinic: t.Boolean(),
      visit: t.Boolean(),
      service: t.Boolean(),
      performedBy: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const MobileVisitServiceOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clinicId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      mobileVisitId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      serviceId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      quantity: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      priceSnapshot: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      durationSnapshot: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      performedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      performedByStaffId: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const MobileVisitService = t.Composite(
  [MobileVisitServicePlain, MobileVisitServiceRelations],
  { additionalProperties: false },
);

export const MobileVisitServiceInputCreate = t.Composite(
  [MobileVisitServicePlainInputCreate, MobileVisitServiceRelationsInputCreate],
  { additionalProperties: false },
);

export const MobileVisitServiceInputUpdate = t.Composite(
  [MobileVisitServicePlainInputUpdate, MobileVisitServiceRelationsInputUpdate],
  { additionalProperties: false },
);
