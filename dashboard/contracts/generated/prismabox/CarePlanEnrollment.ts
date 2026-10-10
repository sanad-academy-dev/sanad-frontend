import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const CarePlanEnrollmentPlain = t.Object(
  {
    id: t.String(),
    code: t.String(),
    clinicId: t.String(),
    carePlanId: t.String(),
    patientId: t.String(),
    priceSnapshot: t.Number(),
    status: t.Union(
      [t.Literal("ACTIVE"), t.Literal("COMPLETED"), t.Literal("CANCELLED")],
      { additionalProperties: false },
    ),
    startedAt: t.Date(),
    completedAt: __nullable__(t.Date()),
    notes: __nullable__(t.String()),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  },
  { additionalProperties: false },
);

export const CarePlanEnrollmentRelations = t.Object(
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
    carePlan: t.Object(
      {
        id: t.String(),
        code: t.String(),
        clinicId: t.String(),
        name: t.String(),
        serviceId: t.String(),
        animalTypeId: t.String(),
        animalStrainId: t.String(),
        notes: __nullable__(t.String()),
        visitDurationMins: __nullable__(t.Integer()),
        price: t.Number(),
        durationDays: t.Integer(),
        status: t.Union([t.Literal("ACTIVE"), t.Literal("INACTIVE")], {
          additionalProperties: false,
        }),
        usageCount: t.Integer(),
        subscribersCount: t.Integer(),
        ratingSum: t.Integer(),
        ratingCount: t.Integer(),
        editsCount: t.Integer(),
        createdAt: t.Date(),
        updatedAt: t.Date(),
      },
      { additionalProperties: false },
    ),
    patient: t.Object(
      {
        id: t.String(),
        code: t.String(),
        clinicId: t.String(),
        ownerId: __nullable__(t.String()),
        name: t.String(),
        nameNormalized: t.String(),
        gender: t.Union(
          [t.Literal("MALE"), t.Literal("FEMALE"), t.Literal("UNKNOWN")],
          { additionalProperties: false },
        ),
        animalTypeId: t.String(),
        animalStrainId: __nullable__(t.String()),
        age: __nullable__(t.Number()),
        birthDate: __nullable__(t.Date()),
        weight: __nullable__(t.Number()),
        microchipNumber: __nullable__(t.String()),
        coat: __nullable__(t.String()),
        notes: __nullable__(t.String()),
        active: t.Boolean(),
        isDeleted: t.Boolean(),
        deletedAt: __nullable__(t.Date()),
        editsCount: t.Integer(),
        createdAt: t.Date(),
        updatedAt: t.Date(),
      },
      { additionalProperties: false },
    ),
    visits: t.Array(
      t.Object(
        {
          id: t.String(),
          enrollmentId: t.String(),
          order: t.Integer(),
          serviceId: __nullable__(t.String()),
          serviceName: t.String(),
          consultationTypeId: __nullable__(t.String()),
          consultationTypeName: __nullable__(t.String()),
          scheduledAt: t.Date(),
          status: t.Union(
            [
              t.Literal("PENDING"),
              t.Literal("COMPLETED"),
              t.Literal("SKIPPED"),
            ],
            { additionalProperties: false },
          ),
          completedAt: __nullable__(t.Date()),
          appointmentId: __nullable__(t.String()),
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

export const CarePlanEnrollmentPlainInputCreate = t.Object(
  {
    code: t.String(),
    priceSnapshot: t.Number(),
    status: t.Optional(
      t.Union(
        [t.Literal("ACTIVE"), t.Literal("COMPLETED"), t.Literal("CANCELLED")],
        { additionalProperties: false },
      ),
    ),
    startedAt: t.Optional(t.Date()),
    completedAt: t.Optional(__nullable__(t.Date())),
    notes: t.Optional(__nullable__(t.String())),
  },
  { additionalProperties: false },
);

export const CarePlanEnrollmentPlainInputUpdate = t.Object(
  {
    code: t.Optional(t.String()),
    priceSnapshot: t.Optional(t.Number()),
    status: t.Optional(
      t.Union(
        [t.Literal("ACTIVE"), t.Literal("COMPLETED"), t.Literal("CANCELLED")],
        { additionalProperties: false },
      ),
    ),
    startedAt: t.Optional(t.Date()),
    completedAt: t.Optional(__nullable__(t.Date())),
    notes: t.Optional(__nullable__(t.String())),
  },
  { additionalProperties: false },
);

export const CarePlanEnrollmentRelationsInputCreate = t.Object(
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
    carePlan: t.Object(
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
    patient: t.Object(
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

export const CarePlanEnrollmentRelationsInputUpdate = t.Partial(
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
      carePlan: t.Object(
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
      patient: t.Object(
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

export const CarePlanEnrollmentWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          code: t.String(),
          clinicId: t.String(),
          carePlanId: t.String(),
          patientId: t.String(),
          priceSnapshot: t.Number(),
          status: t.Union(
            [
              t.Literal("ACTIVE"),
              t.Literal("COMPLETED"),
              t.Literal("CANCELLED"),
            ],
            { additionalProperties: false },
          ),
          startedAt: t.Date(),
          completedAt: t.Date(),
          notes: t.String(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "CarePlanEnrollment" },
  ),
);

export const CarePlanEnrollmentWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.String(), code: t.String() },
            { additionalProperties: false },
          ),
          { additionalProperties: false },
        ),
        t.Union(
          [t.Object({ id: t.String() }), t.Object({ code: t.String() })],
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
              code: t.String(),
              clinicId: t.String(),
              carePlanId: t.String(),
              patientId: t.String(),
              priceSnapshot: t.Number(),
              status: t.Union(
                [
                  t.Literal("ACTIVE"),
                  t.Literal("COMPLETED"),
                  t.Literal("CANCELLED"),
                ],
                { additionalProperties: false },
              ),
              startedAt: t.Date(),
              completedAt: t.Date(),
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
  { $id: "CarePlanEnrollment" },
);

export const CarePlanEnrollmentSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      code: t.Boolean(),
      clinicId: t.Boolean(),
      carePlanId: t.Boolean(),
      patientId: t.Boolean(),
      priceSnapshot: t.Boolean(),
      status: t.Boolean(),
      startedAt: t.Boolean(),
      completedAt: t.Boolean(),
      notes: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinic: t.Boolean(),
      carePlan: t.Boolean(),
      patient: t.Boolean(),
      visits: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const CarePlanEnrollmentInclude = t.Partial(
  t.Object(
    {
      status: t.Boolean(),
      clinic: t.Boolean(),
      carePlan: t.Boolean(),
      patient: t.Boolean(),
      visits: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const CarePlanEnrollmentOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      code: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clinicId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      carePlanId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      patientId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      priceSnapshot: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      startedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      completedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const CarePlanEnrollment = t.Composite(
  [CarePlanEnrollmentPlain, CarePlanEnrollmentRelations],
  { additionalProperties: false },
);

export const CarePlanEnrollmentInputCreate = t.Composite(
  [CarePlanEnrollmentPlainInputCreate, CarePlanEnrollmentRelationsInputCreate],
  { additionalProperties: false },
);

export const CarePlanEnrollmentInputUpdate = t.Composite(
  [CarePlanEnrollmentPlainInputUpdate, CarePlanEnrollmentRelationsInputUpdate],
  { additionalProperties: false },
);
