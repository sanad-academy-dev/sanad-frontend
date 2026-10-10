import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const AccountingPeriodClosedDocumentPlain = t.Object(
  {
    id: t.String(),
    periodId: t.String(),
    documentType: t.String(),
    closed: t.Boolean(),
  },
  { additionalProperties: false },
);

export const AccountingPeriodClosedDocumentRelations = t.Object(
  {
    period: t.Object(
      {
        id: t.String(),
        clinicId: t.String(),
        periodName: t.String(),
        startDate: t.Date(),
        endDate: t.Date(),
        docstatus: t.Union(
          [t.Literal("DRAFT"), t.Literal("SUBMITTED"), t.Literal("CANCELLED")],
          { additionalProperties: false },
        ),
        amendedFromId: __nullable__(t.String()),
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
  },
  { additionalProperties: false },
);

export const AccountingPeriodClosedDocumentPlainInputCreate = t.Object(
  { documentType: t.String(), closed: t.Optional(t.Boolean()) },
  { additionalProperties: false },
);

export const AccountingPeriodClosedDocumentPlainInputUpdate = t.Object(
  { documentType: t.Optional(t.String()), closed: t.Optional(t.Boolean()) },
  { additionalProperties: false },
);

export const AccountingPeriodClosedDocumentRelationsInputCreate = t.Object(
  {
    period: t.Object(
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

export const AccountingPeriodClosedDocumentRelationsInputUpdate = t.Partial(
  t.Object(
    {
      period: t.Object(
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

export const AccountingPeriodClosedDocumentWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          periodId: t.String(),
          documentType: t.String(),
          closed: t.Boolean(),
        },
        { additionalProperties: false },
      ),
    { $id: "AccountingPeriodClosedDocument" },
  ),
);

export const AccountingPeriodClosedDocumentWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            {
              id: t.String(),
              periodId_documentType: t.Object(
                { periodId: t.String(), documentType: t.String() },
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
              periodId_documentType: t.Object(
                { periodId: t.String(), documentType: t.String() },
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
              periodId: t.String(),
              documentType: t.String(),
              closed: t.Boolean(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "AccountingPeriodClosedDocument" },
);

export const AccountingPeriodClosedDocumentSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      periodId: t.Boolean(),
      documentType: t.Boolean(),
      closed: t.Boolean(),
      period: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const AccountingPeriodClosedDocumentInclude = t.Partial(
  t.Object(
    { period: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const AccountingPeriodClosedDocumentOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      periodId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      documentType: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      closed: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const AccountingPeriodClosedDocument = t.Composite(
  [
    AccountingPeriodClosedDocumentPlain,
    AccountingPeriodClosedDocumentRelations,
  ],
  { additionalProperties: false },
);

export const AccountingPeriodClosedDocumentInputCreate = t.Composite(
  [
    AccountingPeriodClosedDocumentPlainInputCreate,
    AccountingPeriodClosedDocumentRelationsInputCreate,
  ],
  { additionalProperties: false },
);

export const AccountingPeriodClosedDocumentInputUpdate = t.Composite(
  [
    AccountingPeriodClosedDocumentPlainInputUpdate,
    AccountingPeriodClosedDocumentRelationsInputUpdate,
  ],
  { additionalProperties: false },
);
