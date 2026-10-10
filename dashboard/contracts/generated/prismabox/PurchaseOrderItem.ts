import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const PurchaseOrderItemPlain = t.Object(
  {
    id: t.String(),
    purchaseOrderId: t.String(),
    itemId: t.String(),
    qtyOrdered: t.Integer(),
    qtyReceived: t.Integer(),
    unitCost: t.Number(),
  },
  { additionalProperties: false },
);

export const PurchaseOrderItemRelations = t.Object(
  {
    order: t.Object(
      {
        id: t.String(),
        code: t.String(),
        clinicId: t.String(),
        supplierId: t.String(),
        warehouseId: t.String(),
        status: t.Union(
          [
            t.Literal("DRAFT"),
            t.Literal("ORDERED"),
            t.Literal("PARTIALLY_RECEIVED"),
            t.Literal("RECEIVED"),
            t.Literal("CANCELLED"),
          ],
          { additionalProperties: false },
        ),
        notes: __nullable__(t.String()),
        expectedAt: __nullable__(t.Date()),
        createdById: __nullable__(t.String()),
        createdAt: t.Date(),
        updatedAt: t.Date(),
      },
      { additionalProperties: false },
    ),
    item: t.Object(
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

export const PurchaseOrderItemPlainInputCreate = t.Object(
  {
    qtyOrdered: t.Integer(),
    qtyReceived: t.Optional(t.Integer()),
    unitCost: t.Number(),
  },
  { additionalProperties: false },
);

export const PurchaseOrderItemPlainInputUpdate = t.Object(
  {
    qtyOrdered: t.Optional(t.Integer()),
    qtyReceived: t.Optional(t.Integer()),
    unitCost: t.Optional(t.Number()),
  },
  { additionalProperties: false },
);

export const PurchaseOrderItemRelationsInputCreate = t.Object(
  {
    order: t.Object(
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
    item: t.Object(
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

export const PurchaseOrderItemRelationsInputUpdate = t.Partial(
  t.Object(
    {
      order: t.Object(
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
      item: t.Object(
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

export const PurchaseOrderItemWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          purchaseOrderId: t.String(),
          itemId: t.String(),
          qtyOrdered: t.Integer(),
          qtyReceived: t.Integer(),
          unitCost: t.Number(),
        },
        { additionalProperties: false },
      ),
    { $id: "PurchaseOrderItem" },
  ),
);

export const PurchaseOrderItemWhereUnique = t.Recursive(
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
              purchaseOrderId: t.String(),
              itemId: t.String(),
              qtyOrdered: t.Integer(),
              qtyReceived: t.Integer(),
              unitCost: t.Number(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "PurchaseOrderItem" },
);

export const PurchaseOrderItemSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      purchaseOrderId: t.Boolean(),
      itemId: t.Boolean(),
      qtyOrdered: t.Boolean(),
      qtyReceived: t.Boolean(),
      unitCost: t.Boolean(),
      order: t.Boolean(),
      item: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const PurchaseOrderItemInclude = t.Partial(
  t.Object(
    { order: t.Boolean(), item: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const PurchaseOrderItemOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      purchaseOrderId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      itemId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      qtyOrdered: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      qtyReceived: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      unitCost: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const PurchaseOrderItem = t.Composite(
  [PurchaseOrderItemPlain, PurchaseOrderItemRelations],
  { additionalProperties: false },
);

export const PurchaseOrderItemInputCreate = t.Composite(
  [PurchaseOrderItemPlainInputCreate, PurchaseOrderItemRelationsInputCreate],
  { additionalProperties: false },
);

export const PurchaseOrderItemInputUpdate = t.Composite(
  [PurchaseOrderItemPlainInputUpdate, PurchaseOrderItemRelationsInputUpdate],
  { additionalProperties: false },
);
