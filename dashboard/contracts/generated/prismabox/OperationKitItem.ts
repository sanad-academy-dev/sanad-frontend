import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const OperationKitItemPlain = t.Object(
  {
    id: t.String(),
    definitionId: t.String(),
    inventoryItemId: t.String(),
    quantity: t.Integer(),
  },
  { additionalProperties: false },
);

export const OperationKitItemRelations = t.Object(
  {
    definition: t.Object(
      {
        id: t.String(),
        clinicId: t.String(),
        serviceId: t.String(),
        defaultTier: t.Union(
          [t.Literal("MINOR"), t.Literal("INTERMEDIATE"), t.Literal("MAJOR")],
          { additionalProperties: false },
        ),
        defaultAnesthesia: t.Union(
          [
            t.Literal("NONE"),
            t.Literal("ANXIOLYSIS"),
            t.Literal("SEDATION"),
            t.Literal("GENERAL_ANESTHESIA"),
          ],
          { additionalProperties: false },
        ),
        defaultWoundClass: __nullable__(
          t.Union(
            [
              t.Literal("CLEAN"),
              t.Literal("CLEAN_CONTAMINATED"),
              t.Literal("CONTAMINATED"),
              t.Literal("DIRTY"),
            ],
            { additionalProperties: false },
          ),
        ),
        requiresLaterality: t.Boolean(),
        bodySystem: __nullable__(t.String()),
        codes: __nullable__(t.Any()),
        specializationId: __nullable__(t.String()),
        prepNotes: __nullable__(t.String()),
        active: t.Boolean(),
        createdAt: t.Date(),
        updatedAt: t.Date(),
      },
      { additionalProperties: false },
    ),
    inventoryItem: t.Object(
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
  },
  { additionalProperties: false },
);

export const OperationKitItemPlainInputCreate = t.Object(
  { quantity: t.Optional(t.Integer()) },
  { additionalProperties: false },
);

export const OperationKitItemPlainInputUpdate = t.Object(
  { quantity: t.Optional(t.Integer()) },
  { additionalProperties: false },
);

export const OperationKitItemRelationsInputCreate = t.Object(
  {
    definition: t.Object(
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
    inventoryItem: t.Object(
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
  },
  { additionalProperties: false },
);

export const OperationKitItemRelationsInputUpdate = t.Partial(
  t.Object(
    {
      definition: t.Object(
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
      inventoryItem: t.Object(
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
    },
    { additionalProperties: false },
  ),
);

export const OperationKitItemWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          definitionId: t.String(),
          inventoryItemId: t.String(),
          quantity: t.Integer(),
        },
        { additionalProperties: false },
      ),
    { $id: "OperationKitItem" },
  ),
);

export const OperationKitItemWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            {
              id: t.String(),
              definitionId_inventoryItemId: t.Object(
                { definitionId: t.String(), inventoryItemId: t.String() },
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
              definitionId_inventoryItemId: t.Object(
                { definitionId: t.String(), inventoryItemId: t.String() },
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
              definitionId: t.String(),
              inventoryItemId: t.String(),
              quantity: t.Integer(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "OperationKitItem" },
);

export const OperationKitItemSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      definitionId: t.Boolean(),
      inventoryItemId: t.Boolean(),
      quantity: t.Boolean(),
      definition: t.Boolean(),
      inventoryItem: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const OperationKitItemInclude = t.Partial(
  t.Object(
    {
      definition: t.Boolean(),
      inventoryItem: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const OperationKitItemOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      definitionId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      inventoryItemId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      quantity: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const OperationKitItem = t.Composite(
  [OperationKitItemPlain, OperationKitItemRelations],
  { additionalProperties: false },
);

export const OperationKitItemInputCreate = t.Composite(
  [OperationKitItemPlainInputCreate, OperationKitItemRelationsInputCreate],
  { additionalProperties: false },
);

export const OperationKitItemInputUpdate = t.Composite(
  [OperationKitItemPlainInputUpdate, OperationKitItemRelationsInputUpdate],
  { additionalProperties: false },
);
