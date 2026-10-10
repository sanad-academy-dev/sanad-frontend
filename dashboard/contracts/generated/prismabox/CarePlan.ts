import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const CarePlanPlain = t.Object(
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
);

export const CarePlanRelations = t.Object(
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
    animalType: t.Object(
      {
        id: t.String(),
        code: __nullable__(t.String()),
        arName: t.String(),
        enName: t.String(),
        isDefault: t.Boolean(),
        clinicId: __nullable__(t.String()),
        createdAt: t.Date(),
        species: __nullable__(
          t.Union(
            [
              t.Literal("DOG"),
              t.Literal("CAT"),
              t.Literal("HORSE"),
              t.Literal("CATTLE"),
              t.Literal("SHEEP"),
              t.Literal("GOAT"),
              t.Literal("CAMEL"),
              t.Literal("POULTRY"),
              t.Literal("RABBIT"),
              t.Literal("SWINE"),
              t.Literal("FISH"),
              t.Literal("BEE"),
            ],
            { additionalProperties: false },
          ),
        ),
      },
      { additionalProperties: false },
    ),
    animalStrain: t.Object(
      {
        id: t.String(),
        code: __nullable__(t.String()),
        arName: t.String(),
        enName: t.String(),
        animalTypeId: t.String(),
        avgWeightMin: __nullable__(t.Integer()),
        avgWeightMax: __nullable__(t.Integer()),
        avgAgeMin: __nullable__(t.Integer()),
        avgAgeMax: __nullable__(t.Integer()),
        originCountry: __nullable__(t.String()),
        hairType: __nullable__(
          t.Union(
            [
              t.Literal("LONG_THICK"),
              t.Literal("SHORT_THICK"),
              t.Literal("LIGHT"),
              t.Literal("MEDIUM"),
              t.Literal("DOUBLE_COAT"),
              t.Literal("NONE"),
            ],
            { additionalProperties: false },
          ),
        ),
        activityLevel: __nullable__(
          t.Union([t.Literal("LOW"), t.Literal("MEDIUM"), t.Literal("HIGH")], {
            additionalProperties: false,
          }),
        ),
        groomingNeeds: __nullable__(
          t.Union([t.Literal("LOW"), t.Literal("MEDIUM"), t.Literal("HIGH")], {
            additionalProperties: false,
          }),
        ),
        isBrachycephalic: t.Boolean(),
        commonDiseases: t.Array(t.String(), { additionalProperties: false }),
        isDefault: t.Boolean(),
        clinicId: __nullable__(t.String()),
        createdAt: t.Date(),
        updatedAt: t.Date(),
      },
      { additionalProperties: false },
    ),
    visits: t.Array(
      t.Object(
        {
          id: t.String(),
          carePlanId: t.String(),
          order: t.Integer(),
          serviceId: __nullable__(t.String()),
          consultationTypeId: __nullable__(t.String()),
          durationMins: __nullable__(t.Integer()),
          details: __nullable__(t.String()),
          intervalUnit: t.Union([t.Literal("DAY"), t.Literal("WEEK")], {
            additionalProperties: false,
          }),
          intervalValue: t.Integer(),
          vaccinationProtocolDoseId: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    medications: t.Array(
      t.Object(
        {
          id: t.String(),
          carePlanId: t.String(),
          inventoryItemId: __nullable__(t.String()),
          nameSnapshot: t.String(),
          priceSnapshot: t.Number(),
          quantity: t.Integer(),
          freeQuantity: t.Integer(),
          fullyFree: t.Boolean(),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    enrollments: t.Array(
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
          completedAt: __nullable__(t.Date()),
          notes: __nullable__(t.String()),
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

export const CarePlanPlainInputCreate = t.Object(
  {
    code: t.String(),
    name: t.String(),
    notes: t.Optional(__nullable__(t.String())),
    visitDurationMins: t.Optional(__nullable__(t.Integer())),
    price: t.Number(),
    durationDays: t.Optional(t.Integer()),
    status: t.Optional(
      t.Union([t.Literal("ACTIVE"), t.Literal("INACTIVE")], {
        additionalProperties: false,
      }),
    ),
    usageCount: t.Optional(t.Integer()),
    subscribersCount: t.Optional(t.Integer()),
    ratingSum: t.Optional(t.Integer()),
    ratingCount: t.Optional(t.Integer()),
    editsCount: t.Optional(t.Integer()),
  },
  { additionalProperties: false },
);

export const CarePlanPlainInputUpdate = t.Object(
  {
    code: t.Optional(t.String()),
    name: t.Optional(t.String()),
    notes: t.Optional(__nullable__(t.String())),
    visitDurationMins: t.Optional(__nullable__(t.Integer())),
    price: t.Optional(t.Number()),
    durationDays: t.Optional(t.Integer()),
    status: t.Optional(
      t.Union([t.Literal("ACTIVE"), t.Literal("INACTIVE")], {
        additionalProperties: false,
      }),
    ),
    usageCount: t.Optional(t.Integer()),
    subscribersCount: t.Optional(t.Integer()),
    ratingSum: t.Optional(t.Integer()),
    ratingCount: t.Optional(t.Integer()),
    editsCount: t.Optional(t.Integer()),
  },
  { additionalProperties: false },
);

export const CarePlanRelationsInputCreate = t.Object(
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
    animalType: t.Object(
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
    animalStrain: t.Object(
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
    medications: t.Optional(
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
    enrollments: t.Optional(
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

export const CarePlanRelationsInputUpdate = t.Partial(
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
      animalType: t.Object(
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
      animalStrain: t.Object(
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
      medications: t.Partial(
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
      enrollments: t.Partial(
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

export const CarePlanWhere = t.Partial(
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
          name: t.String(),
          serviceId: t.String(),
          animalTypeId: t.String(),
          animalStrainId: t.String(),
          notes: t.String(),
          visitDurationMins: t.Integer(),
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
    { $id: "CarePlan" },
  ),
);

export const CarePlanWhereUnique = t.Recursive(
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
              name: t.String(),
              serviceId: t.String(),
              animalTypeId: t.String(),
              animalStrainId: t.String(),
              notes: t.String(),
              visitDurationMins: t.Integer(),
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
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "CarePlan" },
);

export const CarePlanSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      code: t.Boolean(),
      clinicId: t.Boolean(),
      name: t.Boolean(),
      serviceId: t.Boolean(),
      animalTypeId: t.Boolean(),
      animalStrainId: t.Boolean(),
      notes: t.Boolean(),
      visitDurationMins: t.Boolean(),
      price: t.Boolean(),
      durationDays: t.Boolean(),
      status: t.Boolean(),
      usageCount: t.Boolean(),
      subscribersCount: t.Boolean(),
      ratingSum: t.Boolean(),
      ratingCount: t.Boolean(),
      editsCount: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinic: t.Boolean(),
      service: t.Boolean(),
      animalType: t.Boolean(),
      animalStrain: t.Boolean(),
      visits: t.Boolean(),
      medications: t.Boolean(),
      enrollments: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const CarePlanInclude = t.Partial(
  t.Object(
    {
      status: t.Boolean(),
      clinic: t.Boolean(),
      service: t.Boolean(),
      animalType: t.Boolean(),
      animalStrain: t.Boolean(),
      visits: t.Boolean(),
      medications: t.Boolean(),
      enrollments: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const CarePlanOrderBy = t.Partial(
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
      name: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      serviceId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      animalTypeId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      animalStrainId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      notes: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      visitDurationMins: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      price: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      durationDays: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      usageCount: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      subscribersCount: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      ratingSum: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      ratingCount: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      editsCount: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const CarePlan = t.Composite([CarePlanPlain, CarePlanRelations], {
  additionalProperties: false,
});

export const CarePlanInputCreate = t.Composite(
  [CarePlanPlainInputCreate, CarePlanRelationsInputCreate],
  { additionalProperties: false },
);

export const CarePlanInputUpdate = t.Composite(
  [CarePlanPlainInputUpdate, CarePlanRelationsInputUpdate],
  { additionalProperties: false },
);
