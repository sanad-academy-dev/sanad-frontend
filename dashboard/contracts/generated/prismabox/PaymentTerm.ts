import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const PaymentTermPlain = t.Object(
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
    discountType: t.Union([t.Literal("PERCENTAGE"), t.Literal("AMOUNT")], {
      additionalProperties: false,
    }),
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
);

export const PaymentTermRelations = t.Object(
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
    templateRows: t.Array(
      t.Object(
        {
          id: t.String(),
          templateId: t.String(),
          idx: t.Integer(),
          termId: t.String(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    scheduleRows: t.Array(
      t.Object(
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
      ),
      { additionalProperties: false },
    ),
    paymentEntryReferences: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          paymentEntryId: t.String(),
          idx: t.Integer(),
          referenceDoctype: t.String(),
          referenceId: t.String(),
          dueDate: __nullable__(t.Date()),
          billNo: __nullable__(t.String()),
          totalAmount: t.Number(),
          outstandingAmount: t.Number(),
          allocatedAmount: t.Number(),
          exchangeRate: t.Number(),
          exchangeGainLossJeId: __nullable__(t.String()),
          exchangeGainLoss: t.Number(),
          paymentTermId: __nullable__(t.String()),
          accountId: __nullable__(t.String()),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const PaymentTermPlainInputCreate = t.Object(
  {
    paymentTermName: t.String(),
    invoicePortion: t.Optional(t.Number()),
    dueDateBasedOn: t.Optional(
      t.Union(
        [
          t.Literal("DAYS_AFTER_INVOICE_DATE"),
          t.Literal("DAYS_AFTER_INVOICE_MONTH_END"),
          t.Literal("MONTHS_AFTER_INVOICE_MONTH_END"),
        ],
        { additionalProperties: false },
      ),
    ),
    creditDays: t.Optional(t.Integer()),
    creditMonths: t.Optional(t.Integer()),
    discountType: t.Optional(
      t.Union([t.Literal("PERCENTAGE"), t.Literal("AMOUNT")], {
        additionalProperties: false,
      }),
    ),
    discount: t.Optional(t.Number()),
    discountValidityBasedOn: t.Optional(
      t.Union(
        [
          t.Literal("DAYS_AFTER_INVOICE_DATE"),
          t.Literal("DAYS_AFTER_INVOICE_MONTH_END"),
          t.Literal("MONTHS_AFTER_INVOICE_MONTH_END"),
        ],
        { additionalProperties: false },
      ),
    ),
    discountValidity: t.Optional(t.Integer()),
  },
  { additionalProperties: false },
);

export const PaymentTermPlainInputUpdate = t.Object(
  {
    paymentTermName: t.Optional(t.String()),
    invoicePortion: t.Optional(t.Number()),
    dueDateBasedOn: t.Optional(
      t.Union(
        [
          t.Literal("DAYS_AFTER_INVOICE_DATE"),
          t.Literal("DAYS_AFTER_INVOICE_MONTH_END"),
          t.Literal("MONTHS_AFTER_INVOICE_MONTH_END"),
        ],
        { additionalProperties: false },
      ),
    ),
    creditDays: t.Optional(t.Integer()),
    creditMonths: t.Optional(t.Integer()),
    discountType: t.Optional(
      t.Union([t.Literal("PERCENTAGE"), t.Literal("AMOUNT")], {
        additionalProperties: false,
      }),
    ),
    discount: t.Optional(t.Number()),
    discountValidityBasedOn: t.Optional(
      t.Union(
        [
          t.Literal("DAYS_AFTER_INVOICE_DATE"),
          t.Literal("DAYS_AFTER_INVOICE_MONTH_END"),
          t.Literal("MONTHS_AFTER_INVOICE_MONTH_END"),
        ],
        { additionalProperties: false },
      ),
    ),
    discountValidity: t.Optional(t.Integer()),
  },
  { additionalProperties: false },
);

export const PaymentTermRelationsInputCreate = t.Object(
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
    templateRows: t.Optional(
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
    scheduleRows: t.Optional(
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
    paymentEntryReferences: t.Optional(
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

export const PaymentTermRelationsInputUpdate = t.Partial(
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
      templateRows: t.Partial(
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
      scheduleRows: t.Partial(
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
      paymentEntryReferences: t.Partial(
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

export const PaymentTermWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
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
          modeOfPaymentId: t.String(),
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
          createdById: t.String(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "PaymentTerm" },
  ),
);

export const PaymentTermWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            {
              id: t.String(),
              clinicId_paymentTermName: t.Object(
                { clinicId: t.String(), paymentTermName: t.String() },
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
              clinicId_paymentTermName: t.Object(
                { clinicId: t.String(), paymentTermName: t.String() },
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
              modeOfPaymentId: t.String(),
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
              createdById: t.String(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "PaymentTerm" },
);

export const PaymentTermSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      clinicId: t.Boolean(),
      paymentTermName: t.Boolean(),
      invoicePortion: t.Boolean(),
      dueDateBasedOn: t.Boolean(),
      creditDays: t.Boolean(),
      creditMonths: t.Boolean(),
      modeOfPaymentId: t.Boolean(),
      discountType: t.Boolean(),
      discount: t.Boolean(),
      discountValidityBasedOn: t.Boolean(),
      discountValidity: t.Boolean(),
      createdById: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinic: t.Boolean(),
      modeOfPayment: t.Boolean(),
      templateRows: t.Boolean(),
      scheduleRows: t.Boolean(),
      paymentEntryReferences: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const PaymentTermInclude = t.Partial(
  t.Object(
    {
      dueDateBasedOn: t.Boolean(),
      discountType: t.Boolean(),
      discountValidityBasedOn: t.Boolean(),
      clinic: t.Boolean(),
      modeOfPayment: t.Boolean(),
      templateRows: t.Boolean(),
      scheduleRows: t.Boolean(),
      paymentEntryReferences: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const PaymentTermOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clinicId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      paymentTermName: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      invoicePortion: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      creditDays: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      creditMonths: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      modeOfPaymentId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      discount: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      discountValidity: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdById: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const PaymentTerm = t.Composite(
  [PaymentTermPlain, PaymentTermRelations],
  { additionalProperties: false },
);

export const PaymentTermInputCreate = t.Composite(
  [PaymentTermPlainInputCreate, PaymentTermRelationsInputCreate],
  { additionalProperties: false },
);

export const PaymentTermInputUpdate = t.Composite(
  [PaymentTermPlainInputUpdate, PaymentTermRelationsInputUpdate],
  { additionalProperties: false },
);
