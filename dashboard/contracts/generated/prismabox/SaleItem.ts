import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const SaleItemPlain = t.Object(
  {
    id: t.String(),
    saleId: t.String(),
    inventoryItemId: __nullable__(t.String()),
    name: t.String(),
    unitPrice: t.Number(),
    quantity: t.Integer(),
    lineTotal: t.Number(),
  },
  { additionalProperties: false },
);

export const SaleItemRelations = t.Object(
  {
    sale: t.Object(
      {
        id: t.String(),
        code: t.String(),
        clinicId: t.String(),
        status: t.Union(
          [t.Literal("PENDING"), t.Literal("PAID"), t.Literal("REFUNDED")],
          { additionalProperties: false },
        ),
        subtotal: t.Number(),
        discount: t.Number(),
        discountCode: __nullable__(t.String()),
        netTotal: t.Number(),
        taxRate: t.Number(),
        taxAmount: t.Number(),
        total: t.Number(),
        taxTemplateId: __nullable__(t.String()),
        cogsAmount: t.Number(),
        paymentMethod: t.Union(
          [t.Literal("CASH"), t.Literal("CARD"), t.Literal("TRANSFER")],
          { additionalProperties: false },
        ),
        createdById: __nullable__(t.String()),
        posOpeningEntryId: __nullable__(t.String()),
        membershipId: __nullable__(t.String()),
        customerName: __nullable__(t.String()),
        customerPhone: __nullable__(t.String()),
        ownerId: __nullable__(
          t.String({
            description: `[LY-P1] المالك المختار على الكاشير — يُحفظ الآن بعد أن كان يُمرَّر للتسعير ويُرمى.
\`partyId\` كان يصل \`priceSale\` (قالب الضريبة) و\`membership.ownerId\` (خصم العضوية)
ثمّ لا يُكتب في أيّ عمود، فبيعٌ لمالكٍ غير عضو كان يفقد هويّته تمامًا. وذلك يجعل
كسب النقاط على نقطة البيع مستحيلًا (BR-L5.2 «نفس القاعدة بلا بُعد تأمين»)،
والاستبدال في LY-P2 كذلك (BR-L6.5 يشترط طرفًا مربوطًا). §17.2 صفّ ٧.
\`SetNull\` لا \`Cascade\`: حذف مالكٍ لا يجوز أن يمحو بيعًا — البيع واقعةٌ محاسبية.`,
          }),
        ),
        notes: __nullable__(t.String()),
        paidAt: __nullable__(t.Date()),
        fulfillment: t.Union(
          [t.Literal("AT_PAYMENT"), t.Literal("ON_DISPENSE")],
          { additionalProperties: false },
        ),
        dispensedAt: __nullable__(t.Date()),
        dispensedById: __nullable__(t.String()),
        refundedAt: __nullable__(t.Date()),
        refundReason: __nullable__(t.String()),
        refundedById: __nullable__(t.String()),
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

export const SaleItemPlainInputCreate = t.Object(
  {
    name: t.String(),
    unitPrice: t.Number(),
    quantity: t.Integer(),
    lineTotal: t.Number(),
  },
  { additionalProperties: false },
);

export const SaleItemPlainInputUpdate = t.Object(
  {
    name: t.Optional(t.String()),
    unitPrice: t.Optional(t.Number()),
    quantity: t.Optional(t.Integer()),
    lineTotal: t.Optional(t.Number()),
  },
  { additionalProperties: false },
);

export const SaleItemRelationsInputCreate = t.Object(
  {
    sale: t.Object(
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

export const SaleItemRelationsInputUpdate = t.Partial(
  t.Object(
    {
      sale: t.Object(
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

export const SaleItemWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          saleId: t.String(),
          inventoryItemId: t.String(),
          name: t.String(),
          unitPrice: t.Number(),
          quantity: t.Integer(),
          lineTotal: t.Number(),
        },
        { additionalProperties: false },
      ),
    { $id: "SaleItem" },
  ),
);

export const SaleItemWhereUnique = t.Recursive(
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
              saleId: t.String(),
              inventoryItemId: t.String(),
              name: t.String(),
              unitPrice: t.Number(),
              quantity: t.Integer(),
              lineTotal: t.Number(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "SaleItem" },
);

export const SaleItemSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      saleId: t.Boolean(),
      inventoryItemId: t.Boolean(),
      name: t.Boolean(),
      unitPrice: t.Boolean(),
      quantity: t.Boolean(),
      lineTotal: t.Boolean(),
      sale: t.Boolean(),
      inventoryItem: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const SaleItemInclude = t.Partial(
  t.Object(
    { sale: t.Boolean(), inventoryItem: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const SaleItemOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      saleId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      inventoryItemId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      name: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      unitPrice: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      quantity: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      lineTotal: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const SaleItem = t.Composite([SaleItemPlain, SaleItemRelations], {
  additionalProperties: false,
});

export const SaleItemInputCreate = t.Composite(
  [SaleItemPlainInputCreate, SaleItemRelationsInputCreate],
  { additionalProperties: false },
);

export const SaleItemInputUpdate = t.Composite(
  [SaleItemPlainInputUpdate, SaleItemRelationsInputUpdate],
  { additionalProperties: false },
);
