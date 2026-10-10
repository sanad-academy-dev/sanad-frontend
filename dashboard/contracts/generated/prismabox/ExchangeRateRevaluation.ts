import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const ExchangeRateRevaluationPlain = t.Object(
  {
    id: t.String(),
    clinicId: t.String(),
    documentNo: __nullable__(t.String()),
    docstatus: t.Union(
      [t.Literal("DRAFT"), t.Literal("SUBMITTED"), t.Literal("CANCELLED")],
      { additionalProperties: false },
    ),
    postingDate: t.Date(),
    amendedFromId: __nullable__(t.String()),
    roundingLossAllowance: t.Number(),
    totalGainLoss: t.Number(),
    journalEntryId: __nullable__(t.String()),
    createdById: __nullable__(t.String()),
    submittedAt: __nullable__(t.Date()),
    submittedById: __nullable__(t.String()),
    cancelledAt: __nullable__(t.Date()),
    cancelledById: __nullable__(t.String()),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  },
  { additionalProperties: false },
);

export const ExchangeRateRevaluationRelations = t.Object(
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
    amendedFrom: __nullable__(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          documentNo: __nullable__(t.String()),
          docstatus: t.Union(
            [
              t.Literal("DRAFT"),
              t.Literal("SUBMITTED"),
              t.Literal("CANCELLED"),
            ],
            { additionalProperties: false },
          ),
          postingDate: t.Date(),
          amendedFromId: __nullable__(t.String()),
          roundingLossAllowance: t.Number(),
          totalGainLoss: t.Number(),
          journalEntryId: __nullable__(t.String()),
          createdById: __nullable__(t.String()),
          submittedAt: __nullable__(t.Date()),
          submittedById: __nullable__(t.String()),
          cancelledAt: __nullable__(t.Date()),
          cancelledById: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    ),
    amendments: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          documentNo: __nullable__(t.String()),
          docstatus: t.Union(
            [
              t.Literal("DRAFT"),
              t.Literal("SUBMITTED"),
              t.Literal("CANCELLED"),
            ],
            { additionalProperties: false },
          ),
          postingDate: t.Date(),
          amendedFromId: __nullable__(t.String()),
          roundingLossAllowance: t.Number(),
          totalGainLoss: t.Number(),
          journalEntryId: __nullable__(t.String()),
          createdById: __nullable__(t.String()),
          submittedAt: __nullable__(t.Date()),
          submittedById: __nullable__(t.String()),
          cancelledAt: __nullable__(t.Date()),
          cancelledById: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    rows: t.Array(
      t.Object(
        {
          id: t.String(),
          revaluationId: t.String(),
          idx: t.Integer(),
          accountId: t.String(),
          accountCurrencyCode: t.String(),
          partyType: __nullable__(t.String()),
          partyId: __nullable__(t.String()),
          balanceInAccountCurrency: t.Number(),
          bookedBase: t.Number(),
          currentExchangeRate: t.Number(),
          newBase: t.Number(),
          gainLoss: t.Number(),
          isZeroForeignSweep: t.Boolean(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const ExchangeRateRevaluationPlainInputCreate = t.Object(
  {
    documentNo: t.Optional(__nullable__(t.String())),
    docstatus: t.Optional(
      t.Union(
        [t.Literal("DRAFT"), t.Literal("SUBMITTED"), t.Literal("CANCELLED")],
        { additionalProperties: false },
      ),
    ),
    postingDate: t.Date(),
    roundingLossAllowance: t.Optional(t.Number()),
    totalGainLoss: t.Optional(t.Number()),
    submittedAt: t.Optional(__nullable__(t.Date())),
    cancelledAt: t.Optional(__nullable__(t.Date())),
  },
  { additionalProperties: false },
);

export const ExchangeRateRevaluationPlainInputUpdate = t.Object(
  {
    documentNo: t.Optional(__nullable__(t.String())),
    docstatus: t.Optional(
      t.Union(
        [t.Literal("DRAFT"), t.Literal("SUBMITTED"), t.Literal("CANCELLED")],
        { additionalProperties: false },
      ),
    ),
    postingDate: t.Optional(t.Date()),
    roundingLossAllowance: t.Optional(t.Number()),
    totalGainLoss: t.Optional(t.Number()),
    submittedAt: t.Optional(__nullable__(t.Date())),
    cancelledAt: t.Optional(__nullable__(t.Date())),
  },
  { additionalProperties: false },
);

export const ExchangeRateRevaluationRelationsInputCreate = t.Object(
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
    amendedFrom: t.Optional(
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
    amendments: t.Optional(
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
    rows: t.Optional(
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

export const ExchangeRateRevaluationRelationsInputUpdate = t.Partial(
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
      amendedFrom: t.Partial(
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
      amendments: t.Partial(
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
      rows: t.Partial(
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

export const ExchangeRateRevaluationWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          clinicId: t.String(),
          documentNo: t.String(),
          docstatus: t.Union(
            [
              t.Literal("DRAFT"),
              t.Literal("SUBMITTED"),
              t.Literal("CANCELLED"),
            ],
            { additionalProperties: false },
          ),
          postingDate: t.Date(),
          amendedFromId: t.String(),
          roundingLossAllowance: t.Number(),
          totalGainLoss: t.Number(),
          journalEntryId: t.String(),
          createdById: t.String(),
          submittedAt: t.Date(),
          submittedById: t.String(),
          cancelledAt: t.Date(),
          cancelledById: t.String(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "ExchangeRateRevaluation" },
  ),
);

export const ExchangeRateRevaluationWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            {
              id: t.String(),
              clinicId_documentNo: t.Object(
                { clinicId: t.String(), documentNo: t.String() },
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
              clinicId_documentNo: t.Object(
                { clinicId: t.String(), documentNo: t.String() },
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
              documentNo: t.String(),
              docstatus: t.Union(
                [
                  t.Literal("DRAFT"),
                  t.Literal("SUBMITTED"),
                  t.Literal("CANCELLED"),
                ],
                { additionalProperties: false },
              ),
              postingDate: t.Date(),
              amendedFromId: t.String(),
              roundingLossAllowance: t.Number(),
              totalGainLoss: t.Number(),
              journalEntryId: t.String(),
              createdById: t.String(),
              submittedAt: t.Date(),
              submittedById: t.String(),
              cancelledAt: t.Date(),
              cancelledById: t.String(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "ExchangeRateRevaluation" },
);

export const ExchangeRateRevaluationSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      clinicId: t.Boolean(),
      documentNo: t.Boolean(),
      docstatus: t.Boolean(),
      postingDate: t.Boolean(),
      amendedFromId: t.Boolean(),
      roundingLossAllowance: t.Boolean(),
      totalGainLoss: t.Boolean(),
      journalEntryId: t.Boolean(),
      createdById: t.Boolean(),
      submittedAt: t.Boolean(),
      submittedById: t.Boolean(),
      cancelledAt: t.Boolean(),
      cancelledById: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinic: t.Boolean(),
      amendedFrom: t.Boolean(),
      amendments: t.Boolean(),
      rows: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const ExchangeRateRevaluationInclude = t.Partial(
  t.Object(
    {
      docstatus: t.Boolean(),
      clinic: t.Boolean(),
      amendedFrom: t.Boolean(),
      amendments: t.Boolean(),
      rows: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const ExchangeRateRevaluationOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clinicId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      documentNo: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      postingDate: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      amendedFromId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      roundingLossAllowance: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      totalGainLoss: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      journalEntryId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdById: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      submittedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      submittedById: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      cancelledAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      cancelledById: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const ExchangeRateRevaluation = t.Composite(
  [ExchangeRateRevaluationPlain, ExchangeRateRevaluationRelations],
  { additionalProperties: false },
);

export const ExchangeRateRevaluationInputCreate = t.Composite(
  [
    ExchangeRateRevaluationPlainInputCreate,
    ExchangeRateRevaluationRelationsInputCreate,
  ],
  { additionalProperties: false },
);

export const ExchangeRateRevaluationInputUpdate = t.Composite(
  [
    ExchangeRateRevaluationPlainInputUpdate,
    ExchangeRateRevaluationRelationsInputUpdate,
  ],
  { additionalProperties: false },
);
