import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const UnreconcilePaymentPlain = t.Object(
  {
    id: t.String(),
    clinicId: t.String(),
    voucherType: t.String({
      description: `*
* the payment/credit whose allocations were broken`,
    }),
    voucherId: t.String(),
    remarks: __nullable__(t.String()),
    createdById: __nullable__(t.String()),
    createdAt: t.Date(),
  },
  { additionalProperties: false },
);

export const UnreconcilePaymentRelations = t.Object(
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
    entries: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          unreconcilePaymentId: t.String(),
          idx: t.Integer(),
          againstVoucherType: t.String({
            description: `*
* the invoice whose settlement was released`,
          }),
          againstVoucherId: t.String(),
          unlinkedAmount: t.Number(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const UnreconcilePaymentPlainInputCreate = t.Object(
  {
    voucherType: t.String({
      description: `*
* the payment/credit whose allocations were broken`,
    }),
    remarks: t.Optional(__nullable__(t.String())),
  },
  { additionalProperties: false },
);

export const UnreconcilePaymentPlainInputUpdate = t.Object(
  {
    voucherType: t.Optional(
      t.String({
        description: `*
* the payment/credit whose allocations were broken`,
      }),
    ),
    remarks: t.Optional(__nullable__(t.String())),
  },
  { additionalProperties: false },
);

export const UnreconcilePaymentRelationsInputCreate = t.Object(
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
    entries: t.Optional(
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

export const UnreconcilePaymentRelationsInputUpdate = t.Partial(
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
      entries: t.Partial(
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

export const UnreconcilePaymentWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          clinicId: t.String(),
          voucherType: t.String({
            description: `*
* the payment/credit whose allocations were broken`,
          }),
          voucherId: t.String(),
          remarks: t.String(),
          createdById: t.String(),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "UnreconcilePayment" },
  ),
);

export const UnreconcilePaymentWhereUnique = t.Recursive(
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
              voucherType: t.String({
                description: `*
* the payment/credit whose allocations were broken`,
              }),
              voucherId: t.String(),
              remarks: t.String(),
              createdById: t.String(),
              createdAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "UnreconcilePayment" },
);

export const UnreconcilePaymentSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      clinicId: t.Boolean(),
      voucherType: t.Boolean(),
      voucherId: t.Boolean(),
      remarks: t.Boolean(),
      createdById: t.Boolean(),
      createdAt: t.Boolean(),
      clinic: t.Boolean(),
      entries: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const UnreconcilePaymentInclude = t.Partial(
  t.Object(
    { clinic: t.Boolean(), entries: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const UnreconcilePaymentOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clinicId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      voucherType: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      voucherId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      remarks: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const UnreconcilePayment = t.Composite(
  [UnreconcilePaymentPlain, UnreconcilePaymentRelations],
  { additionalProperties: false },
);

export const UnreconcilePaymentInputCreate = t.Composite(
  [UnreconcilePaymentPlainInputCreate, UnreconcilePaymentRelationsInputCreate],
  { additionalProperties: false },
);

export const UnreconcilePaymentInputUpdate = t.Composite(
  [UnreconcilePaymentPlainInputUpdate, UnreconcilePaymentRelationsInputUpdate],
  { additionalProperties: false },
);
