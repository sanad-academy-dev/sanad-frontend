import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const PaymentSchedulePlain = t.Object(
  {
    id: t.String(),
    clinicId: t.String(),
    parentType: t.String(),
    parentId: t.String(),
    idx: t.Integer(),
    paymentTermId: __nullable__(t.String()),
    description: __nullable__(t.String()),
    dueDate: t.Date(),
    invoicePortion: t.Number(),
    paymentAmount: t.Number(),
    outstanding: t.Number(),
    discountType: __nullable__(
      t.Union([t.Literal("PERCENTAGE"), t.Literal("AMOUNT")], {
        additionalProperties: false,
      }),
    ),
    discount: t.Number(),
    discountDate: __nullable__(t.Date()),
    modeOfPaymentId: __nullable__(t.String()),
  },
  { additionalProperties: false },
);

export const PaymentScheduleRelations = t.Object(
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
    paymentTerm: __nullable__(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          paymentTermName: t.String(),
          invoicePortion: t.Number(),
          dueDateBasedOn: t.Union(
            [
              t.Literal("DAYS_AFTER_INVOICE_DATE"),
              t.Literal("DAYS_AFTER_INVOICE_MONTH_END"),
              t.Literal("MONTHS_AFTER_INVOICE_MONTH_END"),
            ],
            { additionalProperties: false },
          ),
          creditDays: t.Integer(),
          creditMonths: t.Integer(),
          modeOfPaymentId: __nullable__(t.String()),
          discountType: t.Union(
            [t.Literal("PERCENTAGE"), t.Literal("AMOUNT")],
            { additionalProperties: false },
          ),
          discount: t.Number(),
          discountValidityBasedOn: t.Union(
            [
              t.Literal("DAYS_AFTER_INVOICE_DATE"),
              t.Literal("DAYS_AFTER_INVOICE_MONTH_END"),
              t.Literal("MONTHS_AFTER_INVOICE_MONTH_END"),
            ],
            { additionalProperties: false },
          ),
          discountValidity: t.Integer(),
          createdById: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    ),
    modeOfPayment: __nullable__(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          modeOfPaymentName: t.String(),
          type: t.Union(
            [
              t.Literal("CASH"),
              t.Literal("BANK"),
              t.Literal("GENERAL"),
              t.Literal("PHONE"),
            ],
            { additionalProperties: false },
          ),
          enabled: t.Boolean(),
          defaultAccountId: __nullable__(t.String()),
          createdById: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    ),
  },
  { additionalProperties: false },
);

export const PaymentSchedulePlainInputCreate = t.Object(
  {
    parentType: t.String(),
    idx: t.Integer(),
    description: t.Optional(__nullable__(t.String())),
    dueDate: t.Date(),
    invoicePortion: t.Optional(t.Number()),
    paymentAmount: t.Optional(t.Number()),
    outstanding: t.Optional(t.Number()),
    discountType: t.Optional(
      __nullable__(
        t.Union([t.Literal("PERCENTAGE"), t.Literal("AMOUNT")], {
          additionalProperties: false,
        }),
      ),
    ),
    discount: t.Optional(t.Number()),
    discountDate: t.Optional(__nullable__(t.Date())),
  },
  { additionalProperties: false },
);

export const PaymentSchedulePlainInputUpdate = t.Object(
  {
    parentType: t.Optional(t.String()),
    idx: t.Optional(t.Integer()),
    description: t.Optional(__nullable__(t.String())),
    dueDate: t.Optional(t.Date()),
    invoicePortion: t.Optional(t.Number()),
    paymentAmount: t.Optional(t.Number()),
    outstanding: t.Optional(t.Number()),
    discountType: t.Optional(
      __nullable__(
        t.Union([t.Literal("PERCENTAGE"), t.Literal("AMOUNT")], {
          additionalProperties: false,
        }),
      ),
    ),
    discount: t.Optional(t.Number()),
    discountDate: t.Optional(__nullable__(t.Date())),
  },
  { additionalProperties: false },
);

export const PaymentScheduleRelationsInputCreate = t.Object(
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
    paymentTerm: t.Optional(
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
    modeOfPayment: t.Optional(
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

export const PaymentScheduleRelationsInputUpdate = t.Partial(
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
      paymentTerm: t.Partial(
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
      modeOfPayment: t.Partial(
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

export const PaymentScheduleWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          clinicId: t.String(),
          parentType: t.String(),
          parentId: t.String(),
          idx: t.Integer(),
          paymentTermId: t.String(),
          description: t.String(),
          dueDate: t.Date(),
          invoicePortion: t.Number(),
          paymentAmount: t.Number(),
          outstanding: t.Number(),
          discountType: t.Union(
            [t.Literal("PERCENTAGE"), t.Literal("AMOUNT")],
            { additionalProperties: false },
          ),
          discount: t.Number(),
          discountDate: t.Date(),
          modeOfPaymentId: t.String(),
        },
        { additionalProperties: false },
      ),
    { $id: "PaymentSchedule" },
  ),
);

export const PaymentScheduleWhereUnique = t.Recursive(
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
              parentType: t.String(),
              parentId: t.String(),
              idx: t.Integer(),
              paymentTermId: t.String(),
              description: t.String(),
              dueDate: t.Date(),
              invoicePortion: t.Number(),
              paymentAmount: t.Number(),
              outstanding: t.Number(),
              discountType: t.Union(
                [t.Literal("PERCENTAGE"), t.Literal("AMOUNT")],
                { additionalProperties: false },
              ),
              discount: t.Number(),
              discountDate: t.Date(),
              modeOfPaymentId: t.String(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "PaymentSchedule" },
);

export const PaymentScheduleSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      clinicId: t.Boolean(),
      parentType: t.Boolean(),
      parentId: t.Boolean(),
      idx: t.Boolean(),
      paymentTermId: t.Boolean(),
      description: t.Boolean(),
      dueDate: t.Boolean(),
      invoicePortion: t.Boolean(),
      paymentAmount: t.Boolean(),
      outstanding: t.Boolean(),
      discountType: t.Boolean(),
      discount: t.Boolean(),
      discountDate: t.Boolean(),
      modeOfPaymentId: t.Boolean(),
      clinic: t.Boolean(),
      paymentTerm: t.Boolean(),
      modeOfPayment: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const PaymentScheduleInclude = t.Partial(
  t.Object(
    {
      discountType: t.Boolean(),
      clinic: t.Boolean(),
      paymentTerm: t.Boolean(),
      modeOfPayment: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const PaymentScheduleOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clinicId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      parentType: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      parentId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      idx: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      paymentTermId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      description: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      dueDate: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      invoicePortion: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      paymentAmount: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      outstanding: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      discount: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      discountDate: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      modeOfPaymentId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const PaymentSchedule = t.Composite(
  [PaymentSchedulePlain, PaymentScheduleRelations],
  { additionalProperties: false },
);

export const PaymentScheduleInputCreate = t.Composite(
  [PaymentSchedulePlainInputCreate, PaymentScheduleRelationsInputCreate],
  { additionalProperties: false },
);

export const PaymentScheduleInputUpdate = t.Composite(
  [PaymentSchedulePlainInputUpdate, PaymentScheduleRelationsInputUpdate],
  { additionalProperties: false },
);
