import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const TaxWithholdingEntryPlain = t.Object(
  {
    id: t.String(),
    clinicId: t.String(),
    categoryId: t.String(),
    partyType: t.String(),
    partyId: t.String(),
    voucherType: t.String(),
    voucherId: t.String(),
    voucherNo: t.String(),
    postingDate: t.Date(),
    taxableAmount: t.Number({
      description: `المبلغ الذي طُبِّقت عليه النسبة (قد يكون الزائد عن العتبة وحده)`,
    }),
    rate: t.Number(),
    taxAmount: t.Number(),
    certificateNo: __nullable__(
      t.String({
        description: `رقم الشهادة يُدخله المستخدم لاحقًا حين تصدرها الجهة`,
      }),
    ),
    createdById: __nullable__(t.String()),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  },
  {
    additionalProperties: false,
    description: `أثر استقطاع فعليّ على مستند — مصدر تقرير الاستقطاع وأساس شهادة الخصم.`,
  },
);

export const TaxWithholdingEntryRelations = t.Object(
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
    category: t.Object(
      {
        id: t.String(),
        clinicId: t.String(),
        title: t.String(),
        basis: t.Union([t.Literal("GROSS"), t.Literal("NET")], {
          additionalProperties: false,
        }),
        taxOnExcessAmount: t.Boolean({
          description: `الضريبة على ما تجاوز العتبة فقط، لا على المبلغ كاملًا`,
        }),
        roundOffTaxAmount: t.Boolean(),
        disableSingleThreshold: t.Boolean(),
        disableCumulativeThreshold: t.Boolean(),
        disabled: t.Boolean(),
        accountId: __nullable__(
          t.String({
            description: `حساب الالتزام الذي يُقيَّد عليه المبلغ المستقطَع (دائن على فاتورة الشراء)`,
          }),
        ),
        createdAt: t.Date(),
        updatedAt: t.Date(),
      },
      {
        additionalProperties: false,
        description: `فئة استقطاع: نِسَبها بنوافذ تاريخية، وحسابها لكل شركة، وسلوك عتباتها.`,
      },
    ),
  },
  {
    additionalProperties: false,
    description: `أثر استقطاع فعليّ على مستند — مصدر تقرير الاستقطاع وأساس شهادة الخصم.`,
  },
);

export const TaxWithholdingEntryPlainInputCreate = t.Object(
  {
    partyType: t.String(),
    voucherType: t.String(),
    voucherNo: t.String(),
    postingDate: t.Date(),
    taxableAmount: t.Number({
      description: `المبلغ الذي طُبِّقت عليه النسبة (قد يكون الزائد عن العتبة وحده)`,
    }),
    rate: t.Number(),
    taxAmount: t.Number(),
    certificateNo: t.Optional(
      __nullable__(
        t.String({
          description: `رقم الشهادة يُدخله المستخدم لاحقًا حين تصدرها الجهة`,
        }),
      ),
    ),
  },
  {
    additionalProperties: false,
    description: `أثر استقطاع فعليّ على مستند — مصدر تقرير الاستقطاع وأساس شهادة الخصم.`,
  },
);

export const TaxWithholdingEntryPlainInputUpdate = t.Object(
  {
    partyType: t.Optional(t.String()),
    voucherType: t.Optional(t.String()),
    voucherNo: t.Optional(t.String()),
    postingDate: t.Optional(t.Date()),
    taxableAmount: t.Optional(
      t.Number({
        description: `المبلغ الذي طُبِّقت عليه النسبة (قد يكون الزائد عن العتبة وحده)`,
      }),
    ),
    rate: t.Optional(t.Number()),
    taxAmount: t.Optional(t.Number()),
    certificateNo: t.Optional(
      __nullable__(
        t.String({
          description: `رقم الشهادة يُدخله المستخدم لاحقًا حين تصدرها الجهة`,
        }),
      ),
    ),
  },
  {
    additionalProperties: false,
    description: `أثر استقطاع فعليّ على مستند — مصدر تقرير الاستقطاع وأساس شهادة الخصم.`,
  },
);

export const TaxWithholdingEntryRelationsInputCreate = t.Object(
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
    category: t.Object(
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
  {
    additionalProperties: false,
    description: `أثر استقطاع فعليّ على مستند — مصدر تقرير الاستقطاع وأساس شهادة الخصم.`,
  },
);

export const TaxWithholdingEntryRelationsInputUpdate = t.Partial(
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
      category: t.Object(
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
    {
      additionalProperties: false,
      description: `أثر استقطاع فعليّ على مستند — مصدر تقرير الاستقطاع وأساس شهادة الخصم.`,
    },
  ),
);

export const TaxWithholdingEntryWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          clinicId: t.String(),
          categoryId: t.String(),
          partyType: t.String(),
          partyId: t.String(),
          voucherType: t.String(),
          voucherId: t.String(),
          voucherNo: t.String(),
          postingDate: t.Date(),
          taxableAmount: t.Number({
            description: `المبلغ الذي طُبِّقت عليه النسبة (قد يكون الزائد عن العتبة وحده)`,
          }),
          rate: t.Number(),
          taxAmount: t.Number(),
          certificateNo: t.String({
            description: `رقم الشهادة يُدخله المستخدم لاحقًا حين تصدرها الجهة`,
          }),
          createdById: t.String(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `أثر استقطاع فعليّ على مستند — مصدر تقرير الاستقطاع وأساس شهادة الخصم.`,
        },
      ),
    { $id: "TaxWithholdingEntry" },
  ),
);

export const TaxWithholdingEntryWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            {
              id: t.String(),
              clinicId_voucherType_voucherId: t.Object(
                {
                  clinicId: t.String(),
                  voucherType: t.String(),
                  voucherId: t.String(),
                },
                { additionalProperties: false },
              ),
            },
            {
              additionalProperties: false,
              description: `أثر استقطاع فعليّ على مستند — مصدر تقرير الاستقطاع وأساس شهادة الخصم.`,
            },
          ),
          { additionalProperties: false },
        ),
        t.Union(
          [
            t.Object({ id: t.String() }),
            t.Object({
              clinicId_voucherType_voucherId: t.Object(
                {
                  clinicId: t.String(),
                  voucherType: t.String(),
                  voucherId: t.String(),
                },
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
              categoryId: t.String(),
              partyType: t.String(),
              partyId: t.String(),
              voucherType: t.String(),
              voucherId: t.String(),
              voucherNo: t.String(),
              postingDate: t.Date(),
              taxableAmount: t.Number({
                description: `المبلغ الذي طُبِّقت عليه النسبة (قد يكون الزائد عن العتبة وحده)`,
              }),
              rate: t.Number(),
              taxAmount: t.Number(),
              certificateNo: t.String({
                description: `رقم الشهادة يُدخله المستخدم لاحقًا حين تصدرها الجهة`,
              }),
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
  { $id: "TaxWithholdingEntry" },
);

export const TaxWithholdingEntrySelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      clinicId: t.Boolean(),
      categoryId: t.Boolean(),
      partyType: t.Boolean(),
      partyId: t.Boolean(),
      voucherType: t.Boolean(),
      voucherId: t.Boolean(),
      voucherNo: t.Boolean(),
      postingDate: t.Boolean(),
      taxableAmount: t.Boolean(),
      rate: t.Boolean(),
      taxAmount: t.Boolean(),
      certificateNo: t.Boolean(),
      createdById: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinic: t.Boolean(),
      category: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `أثر استقطاع فعليّ على مستند — مصدر تقرير الاستقطاع وأساس شهادة الخصم.`,
    },
  ),
);

export const TaxWithholdingEntryInclude = t.Partial(
  t.Object(
    { clinic: t.Boolean(), category: t.Boolean(), _count: t.Boolean() },
    {
      additionalProperties: false,
      description: `أثر استقطاع فعليّ على مستند — مصدر تقرير الاستقطاع وأساس شهادة الخصم.`,
    },
  ),
);

export const TaxWithholdingEntryOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clinicId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      categoryId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      partyType: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      partyId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      voucherType: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      voucherId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      voucherNo: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      postingDate: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      taxableAmount: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      rate: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      taxAmount: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      certificateNo: t.Union([t.Literal("asc"), t.Literal("desc")], {
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
    {
      additionalProperties: false,
      description: `أثر استقطاع فعليّ على مستند — مصدر تقرير الاستقطاع وأساس شهادة الخصم.`,
    },
  ),
);

export const TaxWithholdingEntry = t.Composite(
  [TaxWithholdingEntryPlain, TaxWithholdingEntryRelations],
  { additionalProperties: false },
);

export const TaxWithholdingEntryInputCreate = t.Composite(
  [
    TaxWithholdingEntryPlainInputCreate,
    TaxWithholdingEntryRelationsInputCreate,
  ],
  { additionalProperties: false },
);

export const TaxWithholdingEntryInputUpdate = t.Composite(
  [
    TaxWithholdingEntryPlainInputUpdate,
    TaxWithholdingEntryRelationsInputUpdate,
  ],
  { additionalProperties: false },
);
