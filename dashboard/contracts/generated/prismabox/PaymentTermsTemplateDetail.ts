import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const PaymentTermsTemplateDetailPlain = t.Object(
  {
    id: t.String(),
    templateId: t.String(),
    idx: t.Integer(),
    termId: t.String(),
  },
  { additionalProperties: false },
);

export const PaymentTermsTemplateDetailRelations = t.Object(
  {
    template: t.Object(
      {
        id: t.String(),
        clinicId: t.String(),
        templateName: t.String(),
        allocatePaymentBasedOnPaymentTerms: t.Boolean(),
        createdById: __nullable__(t.String()),
        createdAt: t.Date(),
        updatedAt: t.Date(),
      },
      { additionalProperties: false },
    ),
    term: t.Object(
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
    ),
  },
  { additionalProperties: false },
);

export const PaymentTermsTemplateDetailPlainInputCreate = t.Object(
  { idx: t.Integer() },
  { additionalProperties: false },
);

export const PaymentTermsTemplateDetailPlainInputUpdate = t.Object(
  { idx: t.Optional(t.Integer()) },
  { additionalProperties: false },
);

export const PaymentTermsTemplateDetailRelationsInputCreate = t.Object(
  {
    template: t.Object(
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
    term: t.Object(
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

export const PaymentTermsTemplateDetailRelationsInputUpdate = t.Partial(
  t.Object(
    {
      template: t.Object(
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
      term: t.Object(
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

export const PaymentTermsTemplateDetailWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          templateId: t.String(),
          idx: t.Integer(),
          termId: t.String(),
        },
        { additionalProperties: false },
      ),
    { $id: "PaymentTermsTemplateDetail" },
  ),
);

export const PaymentTermsTemplateDetailWhereUnique = t.Recursive(
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
              templateId: t.String(),
              idx: t.Integer(),
              termId: t.String(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "PaymentTermsTemplateDetail" },
);

export const PaymentTermsTemplateDetailSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      templateId: t.Boolean(),
      idx: t.Boolean(),
      termId: t.Boolean(),
      template: t.Boolean(),
      term: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const PaymentTermsTemplateDetailInclude = t.Partial(
  t.Object(
    { template: t.Boolean(), term: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const PaymentTermsTemplateDetailOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      templateId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      idx: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      termId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const PaymentTermsTemplateDetail = t.Composite(
  [PaymentTermsTemplateDetailPlain, PaymentTermsTemplateDetailRelations],
  { additionalProperties: false },
);

export const PaymentTermsTemplateDetailInputCreate = t.Composite(
  [
    PaymentTermsTemplateDetailPlainInputCreate,
    PaymentTermsTemplateDetailRelationsInputCreate,
  ],
  { additionalProperties: false },
);

export const PaymentTermsTemplateDetailInputUpdate = t.Composite(
  [
    PaymentTermsTemplateDetailPlainInputUpdate,
    PaymentTermsTemplateDetailRelationsInputUpdate,
  ],
  { additionalProperties: false },
);
