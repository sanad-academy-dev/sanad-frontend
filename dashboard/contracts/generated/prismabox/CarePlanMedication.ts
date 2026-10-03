import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const CarePlanMedicationPlain = t.Object(
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
);

export const CarePlanMedicationRelations = t.Object(
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
    inventoryItem: __nullable__(
      t.Object(
        {
          id: t.String(),
          code: t.String(),
          clinicId: t.String(),
          name: t.String(),
          category: t.Union(
            [
              t.Literal("ANTIBIOTIC"),
              t.Literal("ANTI_INFLAMMATORY"),
              t.Literal("VACCINE"),
              t.Literal("HORMONE"),
              t.Literal("SUPPLEMENT"),
              t.Literal("CRUSTACEAN"),
              t.Literal("SURGICAL_TOOLS"),
              t.Literal("SUPPLIES"),
            ],
            { additionalProperties: false },
          ),
          stock: t.Integer(),
          reorderPoint: t.Integer(),
          productionDate: __nullable__(t.Date()),
          expiryDate: __nullable__(t.Date()),
          price: t.Number(),
          unitCost: __nullable__(t.Number()),
          valuationRate: t.Number(),
          maxQuantity: __nullable__(t.Integer()),
          sku: __nullable__(t.String()),
          barcode: __nullable__(t.String()),
          supplier: __nullable__(t.String()),
          location: __nullable__(t.String()),
          notes: __nullable__(t.String()),
          tracksBatches: t.Boolean(),
          itemTaxTemplateId: __nullable__(t.String()),
          catalogProductId: __nullable__(t.String()),
          active: t.Boolean(),
          isDeleted: t.Boolean(),
          deletedAt: __nullable__(t.Date()),
          editsCount: t.Integer(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    ),
  },
  { additionalProperties: false },
);

export const CarePlanMedicationPlainInputCreate = t.Object(
  {
    nameSnapshot: t.String(),
    priceSnapshot: t.Number(),
    quantity: t.Optional(t.Integer()),
    freeQuantity: t.Optional(t.Integer()),
    fullyFree: t.Optional(t.Boolean()),
  },
  { additionalProperties: false },
);

export const CarePlanMedicationPlainInputUpdate = t.Object(
  {
    nameSnapshot: t.Optional(t.String()),
    priceSnapshot: t.Optional(t.Number()),
    quantity: t.Optional(t.Integer()),
    freeQuantity: t.Optional(t.Integer()),
    fullyFree: t.Optional(t.Boolean()),
  },
  { additionalProperties: false },
);

export const CarePlanMedicationRelationsInputCreate = t.Object(
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
    inventoryItem: t.Optional(
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

export const CarePlanMedicationRelationsInputUpdate = t.Partial(
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
      inventoryItem: t.Partial(
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

export const CarePlanMedicationWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          carePlanId: t.String(),
          inventoryItemId: t.String(),
          nameSnapshot: t.String(),
          priceSnapshot: t.Number(),
          quantity: t.Integer(),
          freeQuantity: t.Integer(),
          fullyFree: t.Boolean(),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "CarePlanMedication" },
  ),
);

export const CarePlanMedicationWhereUnique = t.Recursive(
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
              inventoryItemId: t.String(),
              nameSnapshot: t.String(),
              priceSnapshot: t.Number(),
              quantity: t.Integer(),
              freeQuantity: t.Integer(),
              fullyFree: t.Boolean(),
              createdAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "CarePlanMedication" },
);

export const CarePlanMedicationSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      carePlanId: t.Boolean(),
      inventoryItemId: t.Boolean(),
      nameSnapshot: t.Boolean(),
      priceSnapshot: t.Boolean(),
      quantity: t.Boolean(),
      freeQuantity: t.Boolean(),
      fullyFree: t.Boolean(),
      createdAt: t.Boolean(),
      carePlan: t.Boolean(),
      inventoryItem: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const CarePlanMedicationInclude = t.Partial(
  t.Object(
    { carePlan: t.Boolean(), inventoryItem: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const CarePlanMedicationOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      carePlanId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      inventoryItemId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      nameSnapshot: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      priceSnapshot: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      quantity: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      freeQuantity: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      fullyFree: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const CarePlanMedication = t.Composite(
  [CarePlanMedicationPlain, CarePlanMedicationRelations],
  { additionalProperties: false },
);

export const CarePlanMedicationInputCreate = t.Composite(
  [CarePlanMedicationPlainInputCreate, CarePlanMedicationRelationsInputCreate],
  { additionalProperties: false },
);

export const CarePlanMedicationInputUpdate = t.Composite(
  [CarePlanMedicationPlainInputUpdate, CarePlanMedicationRelationsInputUpdate],
  { additionalProperties: false },
);
