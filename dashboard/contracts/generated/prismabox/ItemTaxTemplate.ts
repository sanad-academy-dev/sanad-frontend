import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const ItemTaxTemplatePlain = t.Object(
  {
    id: t.String(),
    clinicId: t.String(),
    title: t.String(),
    disabled: t.Boolean(),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  },
  { additionalProperties: false },
);

export const ItemTaxTemplateRelations = t.Object(
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
    rows: t.Array(
      t.Object(
        {
          id: t.String(),
          templateId: t.String(),
          taxTypeAccountId: t.String(),
          taxRate: t.Number(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    salesInvoiceItems: t.Array(
      t.Object(
        {
          id: t.String(),
          salesInvoiceId: t.String(),
          idx: t.Integer(),
          itemCode: __nullable__(t.String()),
          itemName: t.String(),
          description: __nullable__(t.String()),
          qty: t.Number(),
          uom: __nullable__(t.String()),
          conversionFactor: t.Number(),
          priceListRate: __nullable__(t.Number()),
          marginType: __nullable__(
            t.Union([t.Literal("PERCENTAGE"), t.Literal("AMOUNT")], {
              additionalProperties: false,
            }),
          ),
          marginRateOrAmount: __nullable__(t.Number()),
          discountPercentage: __nullable__(t.Number()),
          discountAmount: __nullable__(t.Number()),
          rate: t.Number(),
          amount: t.Number(),
          netRate: t.Number(),
          netAmount: t.Number(),
          isFreeItem: t.Boolean(),
          incomeAccountId: t.String(),
          costCenterId: t.String(),
          discountAccountId: __nullable__(t.String()),
          itemTaxTemplateId: __nullable__(t.String()),
          itemTaxRates: __nullable__(t.String()),
          enableDeferredRevenue: t.Boolean(),
          deferredAccountId: __nullable__(t.String()),
          serviceStartDate: __nullable__(t.Date()),
          serviceEndDate: __nullable__(t.Date()),
          serviceStopDate: __nullable__(t.Date()),
          salesOrderRef: __nullable__(t.String()),
          soDetailRef: __nullable__(t.String()),
          projectId: __nullable__(t.String()),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    purchaseInvoiceItems: t.Array(
      t.Object(
        {
          id: t.String(),
          purchaseInvoiceId: t.String(),
          idx: t.Integer(),
          itemCode: __nullable__(t.String()),
          itemName: t.String(),
          description: __nullable__(t.String()),
          qty: t.Number(),
          uom: __nullable__(t.String()),
          conversionFactor: t.Number(),
          priceListRate: __nullable__(t.Number()),
          marginType: __nullable__(
            t.Union([t.Literal("PERCENTAGE"), t.Literal("AMOUNT")], {
              additionalProperties: false,
            }),
          ),
          marginRateOrAmount: __nullable__(t.Number()),
          discountPercentage: __nullable__(t.Number()),
          discountAmount: __nullable__(t.Number()),
          rate: t.Number(),
          amount: t.Number(),
          netRate: t.Number(),
          netAmount: t.Number(),
          isFreeItem: t.Boolean(),
          expenseAccountId: t.String(),
          costCenterId: t.String(),
          itemTaxTemplateId: __nullable__(t.String()),
          itemTaxRates: __nullable__(t.String()),
          enableDeferredExpense: t.Boolean(),
          deferredAccountId: __nullable__(t.String()),
          serviceStartDate: __nullable__(t.Date()),
          serviceEndDate: __nullable__(t.Date()),
          serviceStopDate: __nullable__(t.Date()),
          projectId: __nullable__(t.String()),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    inventoryItems: t.Array(
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
      { additionalProperties: false },
    ),
    clinicServiceConfigs: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          serviceId: t.String(),
          price: __nullable__(t.Number()),
          duration: __nullable__(t.Integer()),
          isActive: t.Boolean(),
          itemTaxTemplateId: __nullable__(t.String()),
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

export const ItemTaxTemplatePlainInputCreate = t.Object(
  { title: t.String(), disabled: t.Optional(t.Boolean()) },
  { additionalProperties: false },
);

export const ItemTaxTemplatePlainInputUpdate = t.Object(
  { title: t.Optional(t.String()), disabled: t.Optional(t.Boolean()) },
  { additionalProperties: false },
);

export const ItemTaxTemplateRelationsInputCreate = t.Object(
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
    rows: t.Optional(
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
    salesInvoiceItems: t.Optional(
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
    purchaseInvoiceItems: t.Optional(
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
    inventoryItems: t.Optional(
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
    clinicServiceConfigs: t.Optional(
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

export const ItemTaxTemplateRelationsInputUpdate = t.Partial(
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
      rows: t.Partial(
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
      salesInvoiceItems: t.Partial(
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
      purchaseInvoiceItems: t.Partial(
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
      inventoryItems: t.Partial(
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
      clinicServiceConfigs: t.Partial(
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

export const ItemTaxTemplateWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          clinicId: t.String(),
          title: t.String(),
          disabled: t.Boolean(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "ItemTaxTemplate" },
  ),
);

export const ItemTaxTemplateWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            {
              id: t.String(),
              clinicId_title: t.Object(
                { clinicId: t.String(), title: t.String() },
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
              clinicId_title: t.Object(
                { clinicId: t.String(), title: t.String() },
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
              clinicId: t.String(),
              title: t.String(),
              disabled: t.Boolean(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "ItemTaxTemplate" },
);

export const ItemTaxTemplateSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      clinicId: t.Boolean(),
      title: t.Boolean(),
      disabled: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinic: t.Boolean(),
      rows: t.Boolean(),
      salesInvoiceItems: t.Boolean(),
      purchaseInvoiceItems: t.Boolean(),
      inventoryItems: t.Boolean(),
      clinicServiceConfigs: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const ItemTaxTemplateInclude = t.Partial(
  t.Object(
    {
      clinic: t.Boolean(),
      rows: t.Boolean(),
      salesInvoiceItems: t.Boolean(),
      purchaseInvoiceItems: t.Boolean(),
      inventoryItems: t.Boolean(),
      clinicServiceConfigs: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const ItemTaxTemplateOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clinicId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      title: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      disabled: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const ItemTaxTemplate = t.Composite(
  [ItemTaxTemplatePlain, ItemTaxTemplateRelations],
  { additionalProperties: false },
);

export const ItemTaxTemplateInputCreate = t.Composite(
  [ItemTaxTemplatePlainInputCreate, ItemTaxTemplateRelationsInputCreate],
  { additionalProperties: false },
);

export const ItemTaxTemplateInputUpdate = t.Composite(
  [ItemTaxTemplatePlainInputUpdate, ItemTaxTemplateRelationsInputUpdate],
  { additionalProperties: false },
);
