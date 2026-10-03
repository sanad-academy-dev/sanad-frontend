import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const CarePlanVisitPlain = t.Object(
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
);

export const CarePlanVisitRelations = t.Object(
  {
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
    service: __nullable__(
      t.Object(
        {
          id: t.String(),
          name: t.String(),
          level: t.Union(
            [
              t.Literal("CATEGORY"),
              t.Literal("SUBCATEGORY"),
              t.Literal("ITEM"),
            ],
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
    ),
    consultationType: __nullable__(
      t.Object(
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
    ),
    vaccinationProtocolDose: __nullable__(
      t.Object(
        {
          id: t.String(),
          protocolId: t.String(),
          order: t.Integer(),
          antigenCode: t.String(),
          label: t.String(),
          kind: t.Union(
            [
              t.Literal("PRIMARY"),
              t.Literal("BOOSTER"),
              t.Literal("ANNUAL"),
              t.Literal("CATCH_UP"),
            ],
            { additionalProperties: false },
          ),
          ageWeeksMin: __nullable__(t.Integer()),
          ageWeeksMax: __nullable__(t.Integer()),
          intervalDaysFromPrev: __nullable__(t.Integer()),
          boosterIntervalDays: __nullable__(t.Integer()),
          notes: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    ),
    medications: t.Array(
      t.Object(
        {
          id: t.String(),
          carePlanVisitId: t.String(),
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
  },
  { additionalProperties: false },
);

export const CarePlanVisitPlainInputCreate = t.Object(
  {
    order: t.Integer(),
    durationMins: t.Optional(__nullable__(t.Integer())),
    details: t.Optional(__nullable__(t.String())),
    intervalUnit: t.Optional(
      t.Union([t.Literal("DAY"), t.Literal("WEEK")], {
        additionalProperties: false,
      }),
    ),
    intervalValue: t.Optional(t.Integer()),
  },
  { additionalProperties: false },
);

export const CarePlanVisitPlainInputUpdate = t.Object(
  {
    order: t.Optional(t.Integer()),
    durationMins: t.Optional(__nullable__(t.Integer())),
    details: t.Optional(__nullable__(t.String())),
    intervalUnit: t.Optional(
      t.Union([t.Literal("DAY"), t.Literal("WEEK")], {
        additionalProperties: false,
      }),
    ),
    intervalValue: t.Optional(t.Integer()),
  },
  { additionalProperties: false },
);

export const CarePlanVisitRelationsInputCreate = t.Object(
  {
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
    service: t.Optional(
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
    consultationType: t.Optional(
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
    vaccinationProtocolDose: t.Optional(
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
  },
  { additionalProperties: false },
);

export const CarePlanVisitRelationsInputUpdate = t.Partial(
  t.Object(
    {
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
      service: t.Partial(
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
      consultationType: t.Partial(
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
      vaccinationProtocolDose: t.Partial(
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
    },
    { additionalProperties: false },
  ),
);

export const CarePlanVisitWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          carePlanId: t.String(),
          order: t.Integer(),
          serviceId: t.String(),
          consultationTypeId: t.String(),
          durationMins: t.Integer(),
          details: t.String(),
          intervalUnit: t.Union([t.Literal("DAY"), t.Literal("WEEK")], {
            additionalProperties: false,
          }),
          intervalValue: t.Integer(),
          vaccinationProtocolDoseId: t.String(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "CarePlanVisit" },
  ),
);

export const CarePlanVisitWhereUnique = t.Recursive(
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
              carePlanId: t.String(),
              order: t.Integer(),
              serviceId: t.String(),
              consultationTypeId: t.String(),
              durationMins: t.Integer(),
              details: t.String(),
              intervalUnit: t.Union([t.Literal("DAY"), t.Literal("WEEK")], {
                additionalProperties: false,
              }),
              intervalValue: t.Integer(),
              vaccinationProtocolDoseId: t.String(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "CarePlanVisit" },
);

export const CarePlanVisitSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      carePlanId: t.Boolean(),
      order: t.Boolean(),
      serviceId: t.Boolean(),
      consultationTypeId: t.Boolean(),
      durationMins: t.Boolean(),
      details: t.Boolean(),
      intervalUnit: t.Boolean(),
      intervalValue: t.Boolean(),
      vaccinationProtocolDoseId: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      carePlan: t.Boolean(),
      service: t.Boolean(),
      consultationType: t.Boolean(),
      vaccinationProtocolDose: t.Boolean(),
      medications: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const CarePlanVisitInclude = t.Partial(
  t.Object(
    {
      intervalUnit: t.Boolean(),
      carePlan: t.Boolean(),
      service: t.Boolean(),
      consultationType: t.Boolean(),
      vaccinationProtocolDose: t.Boolean(),
      medications: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const CarePlanVisitOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      carePlanId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      order: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      serviceId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      consultationTypeId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      durationMins: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      details: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      intervalValue: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      vaccinationProtocolDoseId: t.Union(
        [t.Literal("asc"), t.Literal("desc")],
        { additionalProperties: false },
      ),
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

export const CarePlanVisit = t.Composite(
  [CarePlanVisitPlain, CarePlanVisitRelations],
  { additionalProperties: false },
);

export const CarePlanVisitInputCreate = t.Composite(
  [CarePlanVisitPlainInputCreate, CarePlanVisitRelationsInputCreate],
  { additionalProperties: false },
);

export const CarePlanVisitInputUpdate = t.Composite(
  [CarePlanVisitPlainInputUpdate, CarePlanVisitRelationsInputUpdate],
  { additionalProperties: false },
);
