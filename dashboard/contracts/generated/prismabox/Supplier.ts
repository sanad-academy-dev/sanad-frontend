import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const SupplierPlain = t.Object(
  {
    id: t.String(),
    code: t.String(),
    clinicId: t.String(),
    logo: __nullable__(t.String()),
    legalName: t.String(),
    type: t.String(),
    commercialReg: __nullable__(t.String()),
    supplierCode: __nullable__(t.String()),
    description: __nullable__(t.String()),
    rating: __nullable__(t.Number()),
    categories: t.Array(t.String(), { additionalProperties: false }),
    products: t.Array(t.String(), { additionalProperties: false }),
    leadTimeDays: __nullable__(t.Integer()),
    minOrderQty: __nullable__(t.Integer()),
    supportsReturns: t.Boolean(),
    returnPolicy: __nullable__(t.String()),
    contactName: t.String(),
    contactTitle: __nullable__(t.String()),
    phone: t.String(),
    email: __nullable__(t.String()),
    website: __nullable__(t.String()),
    country: __nullable__(t.String()),
    city: __nullable__(t.String()),
    address: __nullable__(t.String()),
    mapUrl: __nullable__(t.String()),
    active: t.Boolean(),
    isDeleted: t.Boolean(),
    deletedAt: __nullable__(t.Date()),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  },
  { additionalProperties: false },
);

export const SupplierRelations = t.Object(
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
    purchaseOrders: t.Array(
      t.Object(
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
      { additionalProperties: false },
    ),
    expenses: t.Array(
      t.Object(
        {
          id: t.String(),
          code: t.String(),
          clinicId: t.String(),
          name: t.String(),
          status: t.Union(
            [
              t.Literal("DRAFT"),
              t.Literal("PENDING_REVIEW"),
              t.Literal("APPROVED"),
              t.Literal("REJECTED"),
              t.Literal("PAID"),
              t.Literal("CANCELED"),
            ],
            { additionalProperties: false },
          ),
          amount: t.Number(),
          source: t.Union(
            [
              t.Literal("MANUAL"),
              t.Literal("PAYROLL_RUN"),
              t.Literal("END_OF_SERVICE"),
              t.Literal("PURCHASE_ORDER"),
            ],
            { additionalProperties: false },
          ),
          sourceId: __nullable__(t.String()),
          expenseDate: __nullable__(t.Date()),
          staffId: __nullable__(t.String()),
          recoverFromPayroll: t.Boolean(),
          paymentMethod: __nullable__(
            t.Union(
              [
                t.Literal("CASH"),
                t.Literal("BANK_TRANSFER"),
                t.Literal("CARD"),
                t.Literal("CHEQUE"),
                t.Literal("TREASURY"),
              ],
              { additionalProperties: false },
            ),
          ),
          categoryLabel: __nullable__(t.String()),
          departmentLabel: __nullable__(t.String()),
          branchId: __nullable__(t.String()),
          requesterId: t.String(),
          supplierId: __nullable__(t.String()),
          notes: __nullable__(t.String()),
          reminderEnabled: t.Boolean(),
          reminderOffset: __nullable__(
            t.Union(
              [
                t.Literal("ONE_DAY"),
                t.Literal("TWO_DAYS"),
                t.Literal("THREE_DAYS"),
              ],
              { additionalProperties: false },
            ),
          ),
          rejectionReason: __nullable__(t.String()),
          cancelReason: __nullable__(t.String()),
          signed: t.Boolean(),
          signatureName: __nullable__(t.String()),
          decisionAt: __nullable__(t.Date()),
          decidedById: __nullable__(t.String()),
          reviewSubject: __nullable__(t.String()),
          reviewBody: __nullable__(t.String()),
          reviewRecipientIds: t.Array(t.String(), {
            additionalProperties: false,
          }),
          reviewSentAt: __nullable__(t.Date()),
          editsCount: t.Integer(),
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

export const SupplierPlainInputCreate = t.Object(
  {
    code: t.String(),
    logo: t.Optional(__nullable__(t.String())),
    legalName: t.String(),
    type: t.String(),
    commercialReg: t.Optional(__nullable__(t.String())),
    supplierCode: t.Optional(__nullable__(t.String())),
    description: t.Optional(__nullable__(t.String())),
    rating: t.Optional(__nullable__(t.Number())),
    categories: t.Array(t.String(), { additionalProperties: false }),
    products: t.Array(t.String(), { additionalProperties: false }),
    leadTimeDays: t.Optional(__nullable__(t.Integer())),
    minOrderQty: t.Optional(__nullable__(t.Integer())),
    supportsReturns: t.Optional(t.Boolean()),
    returnPolicy: t.Optional(__nullable__(t.String())),
    contactName: t.String(),
    contactTitle: t.Optional(__nullable__(t.String())),
    phone: t.String(),
    email: t.Optional(__nullable__(t.String())),
    website: t.Optional(__nullable__(t.String())),
    country: t.Optional(__nullable__(t.String())),
    city: t.Optional(__nullable__(t.String())),
    address: t.Optional(__nullable__(t.String())),
    mapUrl: t.Optional(__nullable__(t.String())),
    active: t.Optional(t.Boolean()),
    isDeleted: t.Optional(t.Boolean()),
    deletedAt: t.Optional(__nullable__(t.Date())),
  },
  { additionalProperties: false },
);

export const SupplierPlainInputUpdate = t.Object(
  {
    code: t.Optional(t.String()),
    logo: t.Optional(__nullable__(t.String())),
    legalName: t.Optional(t.String()),
    type: t.Optional(t.String()),
    commercialReg: t.Optional(__nullable__(t.String())),
    supplierCode: t.Optional(__nullable__(t.String())),
    description: t.Optional(__nullable__(t.String())),
    rating: t.Optional(__nullable__(t.Number())),
    categories: t.Optional(
      t.Array(t.String(), { additionalProperties: false }),
    ),
    products: t.Optional(t.Array(t.String(), { additionalProperties: false })),
    leadTimeDays: t.Optional(__nullable__(t.Integer())),
    minOrderQty: t.Optional(__nullable__(t.Integer())),
    supportsReturns: t.Optional(t.Boolean()),
    returnPolicy: t.Optional(__nullable__(t.String())),
    contactName: t.Optional(t.String()),
    contactTitle: t.Optional(__nullable__(t.String())),
    phone: t.Optional(t.String()),
    email: t.Optional(__nullable__(t.String())),
    website: t.Optional(__nullable__(t.String())),
    country: t.Optional(__nullable__(t.String())),
    city: t.Optional(__nullable__(t.String())),
    address: t.Optional(__nullable__(t.String())),
    mapUrl: t.Optional(__nullable__(t.String())),
    active: t.Optional(t.Boolean()),
    isDeleted: t.Optional(t.Boolean()),
    deletedAt: t.Optional(__nullable__(t.Date())),
  },
  { additionalProperties: false },
);

export const SupplierRelationsInputCreate = t.Object(
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
    purchaseOrders: t.Optional(
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
    expenses: t.Optional(
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

export const SupplierRelationsInputUpdate = t.Partial(
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
      purchaseOrders: t.Partial(
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
      expenses: t.Partial(
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

export const SupplierWhere = t.Partial(
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
          logo: t.String(),
          legalName: t.String(),
          type: t.String(),
          commercialReg: t.String(),
          supplierCode: t.String(),
          description: t.String(),
          rating: t.Number(),
          categories: t.Array(t.String(), { additionalProperties: false }),
          products: t.Array(t.String(), { additionalProperties: false }),
          leadTimeDays: t.Integer(),
          minOrderQty: t.Integer(),
          supportsReturns: t.Boolean(),
          returnPolicy: t.String(),
          contactName: t.String(),
          contactTitle: t.String(),
          phone: t.String(),
          email: t.String(),
          website: t.String(),
          country: t.String(),
          city: t.String(),
          address: t.String(),
          mapUrl: t.String(),
          active: t.Boolean(),
          isDeleted: t.Boolean(),
          deletedAt: t.Date(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "Supplier" },
  ),
);

export const SupplierWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.String(), code: t.String() },
            { additionalProperties: false },
          ),
          { additionalProperties: false },
        ),
        t.Union(
          [t.Object({ id: t.String() }), t.Object({ code: t.String() })],
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
              logo: t.String(),
              legalName: t.String(),
              type: t.String(),
              commercialReg: t.String(),
              supplierCode: t.String(),
              description: t.String(),
              rating: t.Number(),
              categories: t.Array(t.String(), { additionalProperties: false }),
              products: t.Array(t.String(), { additionalProperties: false }),
              leadTimeDays: t.Integer(),
              minOrderQty: t.Integer(),
              supportsReturns: t.Boolean(),
              returnPolicy: t.String(),
              contactName: t.String(),
              contactTitle: t.String(),
              phone: t.String(),
              email: t.String(),
              website: t.String(),
              country: t.String(),
              city: t.String(),
              address: t.String(),
              mapUrl: t.String(),
              active: t.Boolean(),
              isDeleted: t.Boolean(),
              deletedAt: t.Date(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "Supplier" },
);

export const SupplierSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      code: t.Boolean(),
      clinicId: t.Boolean(),
      logo: t.Boolean(),
      legalName: t.Boolean(),
      type: t.Boolean(),
      commercialReg: t.Boolean(),
      supplierCode: t.Boolean(),
      description: t.Boolean(),
      rating: t.Boolean(),
      categories: t.Boolean(),
      products: t.Boolean(),
      leadTimeDays: t.Boolean(),
      minOrderQty: t.Boolean(),
      supportsReturns: t.Boolean(),
      returnPolicy: t.Boolean(),
      contactName: t.Boolean(),
      contactTitle: t.Boolean(),
      phone: t.Boolean(),
      email: t.Boolean(),
      website: t.Boolean(),
      country: t.Boolean(),
      city: t.Boolean(),
      address: t.Boolean(),
      mapUrl: t.Boolean(),
      active: t.Boolean(),
      isDeleted: t.Boolean(),
      deletedAt: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinic: t.Boolean(),
      purchaseOrders: t.Boolean(),
      expenses: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const SupplierInclude = t.Partial(
  t.Object(
    {
      clinic: t.Boolean(),
      purchaseOrders: t.Boolean(),
      expenses: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const SupplierOrderBy = t.Partial(
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
      logo: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      legalName: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      type: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      commercialReg: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      supplierCode: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      description: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      rating: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      categories: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      products: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      leadTimeDays: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      minOrderQty: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      supportsReturns: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      returnPolicy: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      contactName: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      contactTitle: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      phone: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      email: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      website: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      country: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      city: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      address: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      mapUrl: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      active: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      isDeleted: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      deletedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const Supplier = t.Composite([SupplierPlain, SupplierRelations], {
  additionalProperties: false,
});

export const SupplierInputCreate = t.Composite(
  [SupplierPlainInputCreate, SupplierRelationsInputCreate],
  { additionalProperties: false },
);

export const SupplierInputUpdate = t.Composite(
  [SupplierPlainInputUpdate, SupplierRelationsInputUpdate],
  { additionalProperties: false },
);
