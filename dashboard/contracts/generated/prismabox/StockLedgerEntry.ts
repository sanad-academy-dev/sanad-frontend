import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const StockLedgerEntryPlain = t.Object(
  {
    id: t.String(),
    clinicId: t.String(),
    itemId: t.String(),
    warehouseId: t.String(),
    batchId: __nullable__(t.String()),
    qtyChange: t.Integer(),
    balanceQty: t.Integer(),
    inRate: __nullable__(t.Number()),
    valuationRate: __nullable__(t.Number()),
    voucherType: t.Union(
      [
        t.Literal("OPENING"),
        t.Literal("RECEIPT"),
        t.Literal("ISSUE"),
        t.Literal("SALE"),
        t.Literal("SALE_RETURN"),
        t.Literal("ADJUSTMENT"),
        t.Literal("TRANSFER"),
        t.Literal("CARE_PLAN"),
        t.Literal("VACCINATION"),
        t.Literal("MOBILE_CLINIC"),
        t.Literal("PHARMACY_DISPENSE"),
        t.Literal("INPATIENT_ADMINISTRATION"),
      ],
      { additionalProperties: false },
    ),
    voucherId: __nullable__(t.String()),
    note: __nullable__(t.String()),
    createdById: __nullable__(t.String()),
    createdAt: t.Date(),
  },
  { additionalProperties: false },
);

export const StockLedgerEntryRelations = t.Object(
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
    warehouse: t.Object(
      {
        id: t.String(),
        code: t.String(),
        clinicId: t.String(),
        branchId: __nullable__(t.String()),
        name: t.String(),
        isDefault: t.Boolean(),
        isMobile: t.Boolean(),
        active: t.Boolean(),
        isDeleted: t.Boolean(),
        deletedAt: __nullable__(t.Date()),
        editsCount: t.Integer(),
        createdAt: t.Date(),
        updatedAt: t.Date(),
      },
      { additionalProperties: false },
    ),
    batch: __nullable__(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          itemId: t.String(),
          warehouseId: t.String(),
          batchNo: t.String(),
          expiryDate: __nullable__(t.Date()),
          productionDate: __nullable__(t.Date()),
          qty: t.Integer(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    ),
    createdBy: __nullable__(
      t.Object(
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
    ),
  },
  { additionalProperties: false },
);

export const StockLedgerEntryPlainInputCreate = t.Object(
  {
    qtyChange: t.Integer(),
    balanceQty: t.Integer(),
    inRate: t.Optional(__nullable__(t.Number())),
    valuationRate: t.Optional(__nullable__(t.Number())),
    voucherType: t.Union(
      [
        t.Literal("OPENING"),
        t.Literal("RECEIPT"),
        t.Literal("ISSUE"),
        t.Literal("SALE"),
        t.Literal("SALE_RETURN"),
        t.Literal("ADJUSTMENT"),
        t.Literal("TRANSFER"),
        t.Literal("CARE_PLAN"),
        t.Literal("VACCINATION"),
        t.Literal("MOBILE_CLINIC"),
        t.Literal("PHARMACY_DISPENSE"),
        t.Literal("INPATIENT_ADMINISTRATION"),
      ],
      { additionalProperties: false },
    ),
    note: t.Optional(__nullable__(t.String())),
  },
  { additionalProperties: false },
);

export const StockLedgerEntryPlainInputUpdate = t.Object(
  {
    qtyChange: t.Optional(t.Integer()),
    balanceQty: t.Optional(t.Integer()),
    inRate: t.Optional(__nullable__(t.Number())),
    valuationRate: t.Optional(__nullable__(t.Number())),
    voucherType: t.Optional(
      t.Union(
        [
          t.Literal("OPENING"),
          t.Literal("RECEIPT"),
          t.Literal("ISSUE"),
          t.Literal("SALE"),
          t.Literal("SALE_RETURN"),
          t.Literal("ADJUSTMENT"),
          t.Literal("TRANSFER"),
          t.Literal("CARE_PLAN"),
          t.Literal("VACCINATION"),
          t.Literal("MOBILE_CLINIC"),
          t.Literal("PHARMACY_DISPENSE"),
          t.Literal("INPATIENT_ADMINISTRATION"),
        ],
        { additionalProperties: false },
      ),
    ),
    note: t.Optional(__nullable__(t.String())),
  },
  { additionalProperties: false },
);

export const StockLedgerEntryRelationsInputCreate = t.Object(
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
    warehouse: t.Object(
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
    batch: t.Optional(
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
    createdBy: t.Optional(
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

export const StockLedgerEntryRelationsInputUpdate = t.Partial(
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
      warehouse: t.Object(
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
      batch: t.Partial(
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
      createdBy: t.Partial(
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

export const StockLedgerEntryWhere = t.Partial(
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
          warehouseId: t.String(),
          batchId: t.String(),
          qtyChange: t.Integer(),
          balanceQty: t.Integer(),
          inRate: t.Number(),
          valuationRate: t.Number(),
          voucherType: t.Union(
            [
              t.Literal("OPENING"),
              t.Literal("RECEIPT"),
              t.Literal("ISSUE"),
              t.Literal("SALE"),
              t.Literal("SALE_RETURN"),
              t.Literal("ADJUSTMENT"),
              t.Literal("TRANSFER"),
              t.Literal("CARE_PLAN"),
              t.Literal("VACCINATION"),
              t.Literal("MOBILE_CLINIC"),
              t.Literal("PHARMACY_DISPENSE"),
              t.Literal("INPATIENT_ADMINISTRATION"),
            ],
            { additionalProperties: false },
          ),
          voucherId: t.String(),
          note: t.String(),
          createdById: t.String(),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "StockLedgerEntry" },
  ),
);

export const StockLedgerEntryWhereUnique = t.Recursive(
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
              warehouseId: t.String(),
              batchId: t.String(),
              qtyChange: t.Integer(),
              balanceQty: t.Integer(),
              inRate: t.Number(),
              valuationRate: t.Number(),
              voucherType: t.Union(
                [
                  t.Literal("OPENING"),
                  t.Literal("RECEIPT"),
                  t.Literal("ISSUE"),
                  t.Literal("SALE"),
                  t.Literal("SALE_RETURN"),
                  t.Literal("ADJUSTMENT"),
                  t.Literal("TRANSFER"),
                  t.Literal("CARE_PLAN"),
                  t.Literal("VACCINATION"),
                  t.Literal("MOBILE_CLINIC"),
                  t.Literal("PHARMACY_DISPENSE"),
                  t.Literal("INPATIENT_ADMINISTRATION"),
                ],
                { additionalProperties: false },
              ),
              voucherId: t.String(),
              note: t.String(),
              createdById: t.String(),
              createdAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "StockLedgerEntry" },
);

export const StockLedgerEntrySelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      clinicId: t.Boolean(),
      itemId: t.Boolean(),
      warehouseId: t.Boolean(),
      batchId: t.Boolean(),
      qtyChange: t.Boolean(),
      balanceQty: t.Boolean(),
      inRate: t.Boolean(),
      valuationRate: t.Boolean(),
      voucherType: t.Boolean(),
      voucherId: t.Boolean(),
      note: t.Boolean(),
      createdById: t.Boolean(),
      createdAt: t.Boolean(),
      clinic: t.Boolean(),
      item: t.Boolean(),
      warehouse: t.Boolean(),
      batch: t.Boolean(),
      createdBy: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const StockLedgerEntryInclude = t.Partial(
  t.Object(
    {
      voucherType: t.Boolean(),
      clinic: t.Boolean(),
      item: t.Boolean(),
      warehouse: t.Boolean(),
      batch: t.Boolean(),
      createdBy: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const StockLedgerEntryOrderBy = t.Partial(
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
      warehouseId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      batchId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      qtyChange: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      balanceQty: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      inRate: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      valuationRate: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      voucherId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      note: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdById: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const StockLedgerEntry = t.Composite(
  [StockLedgerEntryPlain, StockLedgerEntryRelations],
  { additionalProperties: false },
);

export const StockLedgerEntryInputCreate = t.Composite(
  [StockLedgerEntryPlainInputCreate, StockLedgerEntryRelationsInputCreate],
  { additionalProperties: false },
);

export const StockLedgerEntryInputUpdate = t.Composite(
  [StockLedgerEntryPlainInputUpdate, StockLedgerEntryRelationsInputUpdate],
  { additionalProperties: false },
);
