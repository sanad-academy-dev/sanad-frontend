import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const DiscountPlain = t.Object(
  {
    id: t.String(),
    code: t.String(),
    clinicId: t.String(),
    couponCode: t.String(),
    name: t.String(),
    type: t.Union([t.Literal("PERCENTAGE"), t.Literal("FIXED")], {
      additionalProperties: false,
    }),
    value: t.Number(),
    validFrom: __nullable__(t.Date()),
    validTo: __nullable__(t.Date()),
    usageLimit: t.Integer(),
    perCustomerLimit: t.Integer(),
    customerType: t.Union(
      [
        t.Literal("ALL"),
        t.Literal("VIP"),
        t.Literal("LOYALTY"),
        t.Literal("NEW"),
        t.Literal("CURRENT"),
      ],
      { additionalProperties: false },
    ),
    usedCount: t.Integer(),
    status: t.Union(
      [
        t.Literal("ACTIVE"),
        t.Literal("INACTIVE"),
        t.Literal("EXPIRED"),
        t.Literal("SCHEDULED"),
      ],
      { additionalProperties: false },
    ),
    notes: __nullable__(t.String()),
    editsCount: t.Integer(),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  },
  { additionalProperties: false },
);

export const DiscountRelations = t.Object(
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
    services: t.Array(
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
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const DiscountPlainInputCreate = t.Object(
  {
    code: t.String(),
    couponCode: t.String(),
    name: t.String(),
    type: t.Optional(
      t.Union([t.Literal("PERCENTAGE"), t.Literal("FIXED")], {
        additionalProperties: false,
      }),
    ),
    value: t.Number(),
    validFrom: t.Optional(__nullable__(t.Date())),
    validTo: t.Optional(__nullable__(t.Date())),
    usageLimit: t.Optional(t.Integer()),
    perCustomerLimit: t.Optional(t.Integer()),
    customerType: t.Optional(
      t.Union(
        [
          t.Literal("ALL"),
          t.Literal("VIP"),
          t.Literal("LOYALTY"),
          t.Literal("NEW"),
          t.Literal("CURRENT"),
        ],
        { additionalProperties: false },
      ),
    ),
    usedCount: t.Optional(t.Integer()),
    status: t.Optional(
      t.Union(
        [
          t.Literal("ACTIVE"),
          t.Literal("INACTIVE"),
          t.Literal("EXPIRED"),
          t.Literal("SCHEDULED"),
        ],
        { additionalProperties: false },
      ),
    ),
    notes: t.Optional(__nullable__(t.String())),
    editsCount: t.Optional(t.Integer()),
  },
  { additionalProperties: false },
);

export const DiscountPlainInputUpdate = t.Object(
  {
    code: t.Optional(t.String()),
    couponCode: t.Optional(t.String()),
    name: t.Optional(t.String()),
    type: t.Optional(
      t.Union([t.Literal("PERCENTAGE"), t.Literal("FIXED")], {
        additionalProperties: false,
      }),
    ),
    value: t.Optional(t.Number()),
    validFrom: t.Optional(__nullable__(t.Date())),
    validTo: t.Optional(__nullable__(t.Date())),
    usageLimit: t.Optional(t.Integer()),
    perCustomerLimit: t.Optional(t.Integer()),
    customerType: t.Optional(
      t.Union(
        [
          t.Literal("ALL"),
          t.Literal("VIP"),
          t.Literal("LOYALTY"),
          t.Literal("NEW"),
          t.Literal("CURRENT"),
        ],
        { additionalProperties: false },
      ),
    ),
    usedCount: t.Optional(t.Integer()),
    status: t.Optional(
      t.Union(
        [
          t.Literal("ACTIVE"),
          t.Literal("INACTIVE"),
          t.Literal("EXPIRED"),
          t.Literal("SCHEDULED"),
        ],
        { additionalProperties: false },
      ),
    ),
    notes: t.Optional(__nullable__(t.String())),
    editsCount: t.Optional(t.Integer()),
  },
  { additionalProperties: false },
);

export const DiscountRelationsInputCreate = t.Object(
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
    services: t.Optional(
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

export const DiscountRelationsInputUpdate = t.Partial(
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
      services: t.Partial(
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

export const DiscountWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          code: t.String(),
          clinicId: t.String(),
          couponCode: t.String(),
          name: t.String(),
          type: t.Union([t.Literal("PERCENTAGE"), t.Literal("FIXED")], {
            additionalProperties: false,
          }),
          value: t.Number(),
          validFrom: t.Date(),
          validTo: t.Date(),
          usageLimit: t.Integer(),
          perCustomerLimit: t.Integer(),
          customerType: t.Union(
            [
              t.Literal("ALL"),
              t.Literal("VIP"),
              t.Literal("LOYALTY"),
              t.Literal("NEW"),
              t.Literal("CURRENT"),
            ],
            { additionalProperties: false },
          ),
          usedCount: t.Integer(),
          status: t.Union(
            [
              t.Literal("ACTIVE"),
              t.Literal("INACTIVE"),
              t.Literal("EXPIRED"),
              t.Literal("SCHEDULED"),
            ],
            { additionalProperties: false },
          ),
          notes: t.String(),
          editsCount: t.Integer(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "Discount" },
  ),
);

export const DiscountWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            {
              id: t.String(),
              code: t.String(),
              clinicId_couponCode: t.Object(
                { clinicId: t.String(), couponCode: t.String() },
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
            t.Object({ code: t.String() }),
            t.Object({
              clinicId_couponCode: t.Object(
                { clinicId: t.String(), couponCode: t.String() },
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
              code: t.String(),
              clinicId: t.String(),
              couponCode: t.String(),
              name: t.String(),
              type: t.Union([t.Literal("PERCENTAGE"), t.Literal("FIXED")], {
                additionalProperties: false,
              }),
              value: t.Number(),
              validFrom: t.Date(),
              validTo: t.Date(),
              usageLimit: t.Integer(),
              perCustomerLimit: t.Integer(),
              customerType: t.Union(
                [
                  t.Literal("ALL"),
                  t.Literal("VIP"),
                  t.Literal("LOYALTY"),
                  t.Literal("NEW"),
                  t.Literal("CURRENT"),
                ],
                { additionalProperties: false },
              ),
              usedCount: t.Integer(),
              status: t.Union(
                [
                  t.Literal("ACTIVE"),
                  t.Literal("INACTIVE"),
                  t.Literal("EXPIRED"),
                  t.Literal("SCHEDULED"),
                ],
                { additionalProperties: false },
              ),
              notes: t.String(),
              editsCount: t.Integer(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "Discount" },
);

export const DiscountSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      code: t.Boolean(),
      clinicId: t.Boolean(),
      couponCode: t.Boolean(),
      name: t.Boolean(),
      type: t.Boolean(),
      value: t.Boolean(),
      validFrom: t.Boolean(),
      validTo: t.Boolean(),
      usageLimit: t.Boolean(),
      perCustomerLimit: t.Boolean(),
      customerType: t.Boolean(),
      usedCount: t.Boolean(),
      status: t.Boolean(),
      notes: t.Boolean(),
      editsCount: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinic: t.Boolean(),
      services: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const DiscountInclude = t.Partial(
  t.Object(
    {
      type: t.Boolean(),
      customerType: t.Boolean(),
      status: t.Boolean(),
      clinic: t.Boolean(),
      services: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const DiscountOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      code: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clinicId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      couponCode: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      name: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      value: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      validFrom: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      validTo: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      usageLimit: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      perCustomerLimit: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      usedCount: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      notes: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      editsCount: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const Discount = t.Composite([DiscountPlain, DiscountRelations], {
  additionalProperties: false,
});

export const DiscountInputCreate = t.Composite(
  [DiscountPlainInputCreate, DiscountRelationsInputCreate],
  { additionalProperties: false },
);

export const DiscountInputUpdate = t.Composite(
  [DiscountPlainInputUpdate, DiscountRelationsInputUpdate],
  { additionalProperties: false },
);
