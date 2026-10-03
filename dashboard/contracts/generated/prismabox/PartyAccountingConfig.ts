import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const PartyAccountingConfigPlain = t.Object(
  {
    id: t.String(),
    clinicId: t.String(),
    partyType: t.String(),
    partyId: t.String(),
    defaultCurrencyCode: __nullable__(t.String()),
    paymentTermsTemplateId: __nullable__(t.String()),
    isFrozen: t.Boolean(),
    disabled: t.Boolean(),
    isInternal: t.Boolean(),
    representsCompany: __nullable__(t.String()),
    taxWithholdingCategoryId: __nullable__(t.String()),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  },
  { additionalProperties: false },
);

export const PartyAccountingConfigRelations = t.Object(
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
    taxWithholdingCategory: __nullable__(
      t.Object(
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
    ),
  },
  { additionalProperties: false },
);

export const PartyAccountingConfigPlainInputCreate = t.Object(
  {
    partyType: t.String(),
    defaultCurrencyCode: t.Optional(__nullable__(t.String())),
    isFrozen: t.Optional(t.Boolean()),
    disabled: t.Optional(t.Boolean()),
    isInternal: t.Optional(t.Boolean()),
    representsCompany: t.Optional(__nullable__(t.String())),
  },
  { additionalProperties: false },
);

export const PartyAccountingConfigPlainInputUpdate = t.Object(
  {
    partyType: t.Optional(t.String()),
    defaultCurrencyCode: t.Optional(__nullable__(t.String())),
    isFrozen: t.Optional(t.Boolean()),
    disabled: t.Optional(t.Boolean()),
    isInternal: t.Optional(t.Boolean()),
    representsCompany: t.Optional(__nullable__(t.String())),
  },
  { additionalProperties: false },
);

export const PartyAccountingConfigRelationsInputCreate = t.Object(
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
    taxWithholdingCategory: t.Optional(
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

export const PartyAccountingConfigRelationsInputUpdate = t.Partial(
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
      taxWithholdingCategory: t.Partial(
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

export const PartyAccountingConfigWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          clinicId: t.String(),
          partyType: t.String(),
          partyId: t.String(),
          defaultCurrencyCode: t.String(),
          paymentTermsTemplateId: t.String(),
          isFrozen: t.Boolean(),
          disabled: t.Boolean(),
          isInternal: t.Boolean(),
          representsCompany: t.String(),
          taxWithholdingCategoryId: t.String(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "PartyAccountingConfig" },
  ),
);

export const PartyAccountingConfigWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            {
              id: t.String(),
              clinicId_partyType_partyId: t.Object(
                {
                  clinicId: t.String(),
                  partyType: t.String(),
                  partyId: t.String(),
                },
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
              clinicId_partyType_partyId: t.Object(
                {
                  clinicId: t.String(),
                  partyType: t.String(),
                  partyId: t.String(),
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
              partyType: t.String(),
              partyId: t.String(),
              defaultCurrencyCode: t.String(),
              paymentTermsTemplateId: t.String(),
              isFrozen: t.Boolean(),
              disabled: t.Boolean(),
              isInternal: t.Boolean(),
              representsCompany: t.String(),
              taxWithholdingCategoryId: t.String(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "PartyAccountingConfig" },
);

export const PartyAccountingConfigSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      clinicId: t.Boolean(),
      partyType: t.Boolean(),
      partyId: t.Boolean(),
      defaultCurrencyCode: t.Boolean(),
      paymentTermsTemplateId: t.Boolean(),
      isFrozen: t.Boolean(),
      disabled: t.Boolean(),
      isInternal: t.Boolean(),
      representsCompany: t.Boolean(),
      taxWithholdingCategoryId: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinic: t.Boolean(),
      taxWithholdingCategory: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const PartyAccountingConfigInclude = t.Partial(
  t.Object(
    {
      clinic: t.Boolean(),
      taxWithholdingCategory: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const PartyAccountingConfigOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clinicId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      partyType: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      partyId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      defaultCurrencyCode: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      paymentTermsTemplateId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      isFrozen: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      disabled: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      isInternal: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      representsCompany: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      taxWithholdingCategoryId: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const PartyAccountingConfig = t.Composite(
  [PartyAccountingConfigPlain, PartyAccountingConfigRelations],
  { additionalProperties: false },
);

export const PartyAccountingConfigInputCreate = t.Composite(
  [
    PartyAccountingConfigPlainInputCreate,
    PartyAccountingConfigRelationsInputCreate,
  ],
  { additionalProperties: false },
);

export const PartyAccountingConfigInputUpdate = t.Composite(
  [
    PartyAccountingConfigPlainInputUpdate,
    PartyAccountingConfigRelationsInputUpdate,
  ],
  { additionalProperties: false },
);
