import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const CurrencyExchangePlain = t.Object(
  {
    id: t.String(),
    clinicId: t.String(),
    date: t.Date(),
    fromCurrencyCode: t.String(),
    toCurrencyCode: t.String(),
    exchangeRate: t.Number(),
    forBuying: t.Boolean(),
    forSelling: t.Boolean(),
    createdById: __nullable__(t.String()),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  },
  { additionalProperties: false },
);

export const CurrencyExchangeRelations = t.Object(
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
    fromCurrency: t.Object(
      {
        code: t.String(),
        name: t.String(),
        nameAr: t.String(),
        symbol: __nullable__(t.String()),
        fractionUnits: t.Integer(),
        fractionNameEn: __nullable__(t.String()),
        fractionNameAr: __nullable__(t.String()),
        smallestUnit: t.Number(),
        enabled: t.Boolean(),
        createdAt: t.Date(),
        updatedAt: t.Date(),
      },
      { additionalProperties: false },
    ),
    toCurrency: t.Object(
      {
        code: t.String(),
        name: t.String(),
        nameAr: t.String(),
        symbol: __nullable__(t.String()),
        fractionUnits: t.Integer(),
        fractionNameEn: __nullable__(t.String()),
        fractionNameAr: __nullable__(t.String()),
        smallestUnit: t.Number(),
        enabled: t.Boolean(),
        createdAt: t.Date(),
        updatedAt: t.Date(),
      },
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const CurrencyExchangePlainInputCreate = t.Object(
  {
    date: t.Date(),
    fromCurrencyCode: t.String(),
    toCurrencyCode: t.String(),
    exchangeRate: t.Number(),
    forBuying: t.Optional(t.Boolean()),
    forSelling: t.Optional(t.Boolean()),
  },
  { additionalProperties: false },
);

export const CurrencyExchangePlainInputUpdate = t.Object(
  {
    date: t.Optional(t.Date()),
    fromCurrencyCode: t.Optional(t.String()),
    toCurrencyCode: t.Optional(t.String()),
    exchangeRate: t.Optional(t.Number()),
    forBuying: t.Optional(t.Boolean()),
    forSelling: t.Optional(t.Boolean()),
  },
  { additionalProperties: false },
);

export const CurrencyExchangeRelationsInputCreate = t.Object(
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
    fromCurrency: t.Object(
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
    toCurrency: t.Object(
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

export const CurrencyExchangeRelationsInputUpdate = t.Partial(
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
      fromCurrency: t.Object(
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
      toCurrency: t.Object(
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

export const CurrencyExchangeWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          clinicId: t.String(),
          date: t.Date(),
          fromCurrencyCode: t.String(),
          toCurrencyCode: t.String(),
          exchangeRate: t.Number(),
          forBuying: t.Boolean(),
          forSelling: t.Boolean(),
          createdById: t.String(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "CurrencyExchange" },
  ),
);

export const CurrencyExchangeWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            {
              id: t.String(),
              clinicId_date_fromCurrencyCode_toCurrencyCode_forBuying_forSelling:
                t.Object(
                  {
                    clinicId: t.String(),
                    date: t.Date(),
                    fromCurrencyCode: t.String(),
                    toCurrencyCode: t.String(),
                    forBuying: t.Boolean(),
                    forSelling: t.Boolean(),
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
              clinicId_date_fromCurrencyCode_toCurrencyCode_forBuying_forSelling:
                t.Object(
                  {
                    clinicId: t.String(),
                    date: t.Date(),
                    fromCurrencyCode: t.String(),
                    toCurrencyCode: t.String(),
                    forBuying: t.Boolean(),
                    forSelling: t.Boolean(),
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
              date: t.Date(),
              fromCurrencyCode: t.String(),
              toCurrencyCode: t.String(),
              exchangeRate: t.Number(),
              forBuying: t.Boolean(),
              forSelling: t.Boolean(),
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
  { $id: "CurrencyExchange" },
);

export const CurrencyExchangeSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      clinicId: t.Boolean(),
      date: t.Boolean(),
      fromCurrencyCode: t.Boolean(),
      toCurrencyCode: t.Boolean(),
      exchangeRate: t.Boolean(),
      forBuying: t.Boolean(),
      forSelling: t.Boolean(),
      createdById: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinic: t.Boolean(),
      fromCurrency: t.Boolean(),
      toCurrency: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const CurrencyExchangeInclude = t.Partial(
  t.Object(
    {
      clinic: t.Boolean(),
      fromCurrency: t.Boolean(),
      toCurrency: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const CurrencyExchangeOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clinicId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      date: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      fromCurrencyCode: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      toCurrencyCode: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      exchangeRate: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      forBuying: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      forSelling: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const CurrencyExchange = t.Composite(
  [CurrencyExchangePlain, CurrencyExchangeRelations],
  { additionalProperties: false },
);

export const CurrencyExchangeInputCreate = t.Composite(
  [CurrencyExchangePlainInputCreate, CurrencyExchangeRelationsInputCreate],
  { additionalProperties: false },
);

export const CurrencyExchangeInputUpdate = t.Composite(
  [CurrencyExchangePlainInputUpdate, CurrencyExchangeRelationsInputUpdate],
  { additionalProperties: false },
);
