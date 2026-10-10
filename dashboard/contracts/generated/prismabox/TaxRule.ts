import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const TaxRulePlain = t.Object(
  {
    id: t.String(),
    clinicId: t.String(),
    taxType: t.String(),
    salesTaxTemplateId: __nullable__(t.String()),
    purchaseTaxTemplateId: __nullable__(t.String()),
    partyType: __nullable__(t.String()),
    partyId: __nullable__(t.String()),
    itemId: __nullable__(t.String()),
    itemCategory: __nullable__(t.String()),
    taxCategoryId: __nullable__(t.String()),
    fromDate: __nullable__(t.Date()),
    toDate: __nullable__(t.Date()),
    priority: t.Integer(),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  },
  { additionalProperties: false },
);

export const TaxRuleRelations = t.Object(
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
    salesTemplate: __nullable__(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          title: t.String(),
          isDefault: t.Boolean(),
          disabled: t.Boolean(),
          taxCategoryId: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    ),
    purchaseTemplate: __nullable__(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          title: t.String(),
          isDefault: t.Boolean(),
          disabled: t.Boolean(),
          taxCategoryId: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    ),
    taxCategory: __nullable__(
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
  },
  { additionalProperties: false },
);

export const TaxRulePlainInputCreate = t.Object(
  {
    taxType: t.Optional(t.String()),
    partyType: t.Optional(__nullable__(t.String())),
    itemCategory: t.Optional(__nullable__(t.String())),
    fromDate: t.Optional(__nullable__(t.Date())),
    toDate: t.Optional(__nullable__(t.Date())),
    priority: t.Optional(t.Integer()),
  },
  { additionalProperties: false },
);

export const TaxRulePlainInputUpdate = t.Object(
  {
    taxType: t.Optional(t.String()),
    partyType: t.Optional(__nullable__(t.String())),
    itemCategory: t.Optional(__nullable__(t.String())),
    fromDate: t.Optional(__nullable__(t.Date())),
    toDate: t.Optional(__nullable__(t.Date())),
    priority: t.Optional(t.Integer()),
  },
  { additionalProperties: false },
);

export const TaxRuleRelationsInputCreate = t.Object(
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
    salesTemplate: t.Optional(
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
    purchaseTemplate: t.Optional(
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
    taxCategory: t.Optional(
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

export const TaxRuleRelationsInputUpdate = t.Partial(
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
      salesTemplate: t.Partial(
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
      purchaseTemplate: t.Partial(
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
      taxCategory: t.Partial(
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

export const TaxRuleWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          clinicId: t.String(),
          taxType: t.String(),
          salesTaxTemplateId: t.String(),
          purchaseTaxTemplateId: t.String(),
          partyType: t.String(),
          partyId: t.String(),
          itemId: t.String(),
          itemCategory: t.String(),
          taxCategoryId: t.String(),
          fromDate: t.Date(),
          toDate: t.Date(),
          priority: t.Integer(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "TaxRule" },
  ),
);

export const TaxRuleWhereUnique = t.Recursive(
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
              taxType: t.String(),
              salesTaxTemplateId: t.String(),
              purchaseTaxTemplateId: t.String(),
              partyType: t.String(),
              partyId: t.String(),
              itemId: t.String(),
              itemCategory: t.String(),
              taxCategoryId: t.String(),
              fromDate: t.Date(),
              toDate: t.Date(),
              priority: t.Integer(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "TaxRule" },
);

export const TaxRuleSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      clinicId: t.Boolean(),
      taxType: t.Boolean(),
      salesTaxTemplateId: t.Boolean(),
      purchaseTaxTemplateId: t.Boolean(),
      partyType: t.Boolean(),
      partyId: t.Boolean(),
      itemId: t.Boolean(),
      itemCategory: t.Boolean(),
      taxCategoryId: t.Boolean(),
      fromDate: t.Boolean(),
      toDate: t.Boolean(),
      priority: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinic: t.Boolean(),
      salesTemplate: t.Boolean(),
      purchaseTemplate: t.Boolean(),
      taxCategory: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const TaxRuleInclude = t.Partial(
  t.Object(
    {
      clinic: t.Boolean(),
      salesTemplate: t.Boolean(),
      purchaseTemplate: t.Boolean(),
      taxCategory: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const TaxRuleOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clinicId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      taxType: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      salesTaxTemplateId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      purchaseTaxTemplateId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      partyType: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      partyId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      itemId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      itemCategory: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      taxCategoryId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      fromDate: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      toDate: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      priority: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const TaxRule = t.Composite([TaxRulePlain, TaxRuleRelations], {
  additionalProperties: false,
});

export const TaxRuleInputCreate = t.Composite(
  [TaxRulePlainInputCreate, TaxRuleRelationsInputCreate],
  { additionalProperties: false },
);

export const TaxRuleInputUpdate = t.Composite(
  [TaxRulePlainInputUpdate, TaxRuleRelationsInputUpdate],
  { additionalProperties: false },
);
