import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const ProductCommentPlain = t.Object(
  {
    id: t.String(),
    clinicId: t.String(),
    itemId: t.String(),
    authorId: t.String(),
    body: t.String(),
    createdAt: t.Date(),
  },
  { additionalProperties: false },
);

export const ProductCommentRelations = t.Object(
  {
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
    author: t.Object(
      {
        id: t.String(),
        name: t.String(),
        email: t.String(),
        emailVerified: t.Boolean(),
        image: __nullable__(t.String()),
        phone: __nullable__(t.String()),
        createdAt: t.Date(),
        updatedAt: t.Date(),
      },
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const ProductCommentPlainInputCreate = t.Object(
  { body: t.String() },
  { additionalProperties: false },
);

export const ProductCommentPlainInputUpdate = t.Object(
  { body: t.Optional(t.String()) },
  { additionalProperties: false },
);

export const ProductCommentRelationsInputCreate = t.Object(
  {
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
    author: t.Object(
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

export const ProductCommentRelationsInputUpdate = t.Partial(
  t.Object(
    {
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
      author: t.Object(
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

export const ProductCommentWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          clinicId: t.String(),
          itemId: t.String(),
          authorId: t.String(),
          body: t.String(),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "ProductComment" },
  ),
);

export const ProductCommentWhereUnique = t.Recursive(
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
              itemId: t.String(),
              authorId: t.String(),
              body: t.String(),
              createdAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "ProductComment" },
);

export const ProductCommentSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      clinicId: t.Boolean(),
      itemId: t.Boolean(),
      authorId: t.Boolean(),
      body: t.Boolean(),
      createdAt: t.Boolean(),
      item: t.Boolean(),
      author: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const ProductCommentInclude = t.Partial(
  t.Object(
    { item: t.Boolean(), author: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const ProductCommentOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clinicId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      itemId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      authorId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      body: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const ProductComment = t.Composite(
  [ProductCommentPlain, ProductCommentRelations],
  { additionalProperties: false },
);

export const ProductCommentInputCreate = t.Composite(
  [ProductCommentPlainInputCreate, ProductCommentRelationsInputCreate],
  { additionalProperties: false },
);

export const ProductCommentInputUpdate = t.Composite(
  [ProductCommentPlainInputUpdate, ProductCommentRelationsInputUpdate],
  { additionalProperties: false },
);
