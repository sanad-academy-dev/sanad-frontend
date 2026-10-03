import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const CarePlanEnrollmentVisitMedicationPlain = t.Object(
  {
    id: t.String(),
    enrollmentVisitId: t.String(),
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

export const CarePlanEnrollmentVisitMedicationRelations = t.Object(
  {
    enrollmentVisit: t.Object(
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
          [t.Literal("PENDING"), t.Literal("COMPLETED"), t.Literal("SKIPPED")],
          { additionalProperties: false },
        ),
        completedAt: __nullable__(t.Date()),
        appointmentId: __nullable__(t.String()),
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

export const CarePlanEnrollmentVisitMedicationPlainInputCreate = t.Object(
  {
    nameSnapshot: t.String(),
    priceSnapshot: t.Number(),
    quantity: t.Optional(t.Integer()),
    freeQuantity: t.Optional(t.Integer()),
    fullyFree: t.Optional(t.Boolean()),
  },
  { additionalProperties: false },
);

export const CarePlanEnrollmentVisitMedicationPlainInputUpdate = t.Object(
  {
    nameSnapshot: t.Optional(t.String()),
    priceSnapshot: t.Optional(t.Number()),
    quantity: t.Optional(t.Integer()),
    freeQuantity: t.Optional(t.Integer()),
    fullyFree: t.Optional(t.Boolean()),
  },
  { additionalProperties: false },
);

export const CarePlanEnrollmentVisitMedicationRelationsInputCreate = t.Object(
  {
    enrollmentVisit: t.Object(
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

export const CarePlanEnrollmentVisitMedicationRelationsInputUpdate = t.Partial(
  t.Object(
    {
      enrollmentVisit: t.Object(
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

export const CarePlanEnrollmentVisitMedicationWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          enrollmentVisitId: t.String(),
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
    { $id: "CarePlanEnrollmentVisitMedication" },
  ),
);

export const CarePlanEnrollmentVisitMedicationWhereUnique = t.Recursive(
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
              enrollmentVisitId: t.String(),
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
  { $id: "CarePlanEnrollmentVisitMedication" },
);

export const CarePlanEnrollmentVisitMedicationSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      enrollmentVisitId: t.Boolean(),
      inventoryItemId: t.Boolean(),
      nameSnapshot: t.Boolean(),
      priceSnapshot: t.Boolean(),
      quantity: t.Boolean(),
      freeQuantity: t.Boolean(),
      fullyFree: t.Boolean(),
      createdAt: t.Boolean(),
      enrollmentVisit: t.Boolean(),
      inventoryItem: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const CarePlanEnrollmentVisitMedicationInclude = t.Partial(
  t.Object(
    {
      enrollmentVisit: t.Boolean(),
      inventoryItem: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const CarePlanEnrollmentVisitMedicationOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      enrollmentVisitId: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const CarePlanEnrollmentVisitMedication = t.Composite(
  [
    CarePlanEnrollmentVisitMedicationPlain,
    CarePlanEnrollmentVisitMedicationRelations,
  ],
  { additionalProperties: false },
);

export const CarePlanEnrollmentVisitMedicationInputCreate = t.Composite(
  [
    CarePlanEnrollmentVisitMedicationPlainInputCreate,
    CarePlanEnrollmentVisitMedicationRelationsInputCreate,
  ],
  { additionalProperties: false },
);

export const CarePlanEnrollmentVisitMedicationInputUpdate = t.Composite(
  [
    CarePlanEnrollmentVisitMedicationPlainInputUpdate,
    CarePlanEnrollmentVisitMedicationRelationsInputUpdate,
  ],
  { additionalProperties: false },
);
