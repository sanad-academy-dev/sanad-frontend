import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const DunningOverduePlain = t.Object(
  {
    id: t.String(),
    dunningId: t.String(),
    salesInvoiceId: t.String(),
    invoiceNo: t.String(),
    dueDate: t.Date(),
    overdueDays: t.Integer(),
    outstanding: t.Number(),
    interest: t.Number(),
  },
  { additionalProperties: false },
);

export const DunningOverdueRelations = t.Object(
  {
    dunning: t.Object(
      {
        id: t.String(),
        clinicId: t.String(),
        typeId: __nullable__(t.String()),
        partyType: t.String(),
        partyId: t.String(),
        postingDate: t.Date(),
        status: t.Union(
          [
            t.Literal("DRAFT"),
            t.Literal("UNRESOLVED"),
            t.Literal("RESOLVED"),
            t.Literal("CANCELLED"),
          ],
          { additionalProperties: false },
        ),
        rateOfInterest: t.Number(),
        dunningFee: t.Number(),
        totalOutstanding: t.Number({
          description: `مجموع أصل المتأخّرات وقت الإصدار — لقطة، لا يُعاد حسابها`,
        }),
        totalInterest: t.Number(),
        dunningAmount: t.Number({
          description: `الفائدة + الرسم = ما تطالب به المطالبة زيادةً على الأصل`,
        }),
        journalEntryId: __nullable__(
          t.String({
            description: `قيد الفائدة والرسم المُرحَّل عند اعتماد المطالبة — منه تُحصَّل عبر سند قبض عادي`,
          }),
        ),
        createdById: __nullable__(t.String()),
        createdAt: t.Date(),
        updatedAt: t.Date(),
      },
      {
        additionalProperties: false,
        description: `مطالبة على طرف: تجمع فواتيره المتأخّرة وتضيف الفائدة والرسم.`,
      },
    ),
  },
  { additionalProperties: false },
);

export const DunningOverduePlainInputCreate = t.Object(
  {
    invoiceNo: t.String(),
    dueDate: t.Date(),
    overdueDays: t.Integer(),
    outstanding: t.Number(),
    interest: t.Optional(t.Number()),
  },
  { additionalProperties: false },
);

export const DunningOverduePlainInputUpdate = t.Object(
  {
    invoiceNo: t.Optional(t.String()),
    dueDate: t.Optional(t.Date()),
    overdueDays: t.Optional(t.Integer()),
    outstanding: t.Optional(t.Number()),
    interest: t.Optional(t.Number()),
  },
  { additionalProperties: false },
);

export const DunningOverdueRelationsInputCreate = t.Object(
  {
    dunning: t.Object(
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

export const DunningOverdueRelationsInputUpdate = t.Partial(
  t.Object(
    {
      dunning: t.Object(
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

export const DunningOverdueWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          dunningId: t.String(),
          salesInvoiceId: t.String(),
          invoiceNo: t.String(),
          dueDate: t.Date(),
          overdueDays: t.Integer(),
          outstanding: t.Number(),
          interest: t.Number(),
        },
        { additionalProperties: false },
      ),
    { $id: "DunningOverdue" },
  ),
);

export const DunningOverdueWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            {
              id: t.String(),
              dunningId_salesInvoiceId: t.Object(
                { dunningId: t.String(), salesInvoiceId: t.String() },
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
              dunningId_salesInvoiceId: t.Object(
                { dunningId: t.String(), salesInvoiceId: t.String() },
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
              dunningId: t.String(),
              salesInvoiceId: t.String(),
              invoiceNo: t.String(),
              dueDate: t.Date(),
              overdueDays: t.Integer(),
              outstanding: t.Number(),
              interest: t.Number(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "DunningOverdue" },
);

export const DunningOverdueSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      dunningId: t.Boolean(),
      salesInvoiceId: t.Boolean(),
      invoiceNo: t.Boolean(),
      dueDate: t.Boolean(),
      overdueDays: t.Boolean(),
      outstanding: t.Boolean(),
      interest: t.Boolean(),
      dunning: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const DunningOverdueInclude = t.Partial(
  t.Object(
    { dunning: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const DunningOverdueOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      dunningId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      salesInvoiceId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      invoiceNo: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      dueDate: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      overdueDays: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      outstanding: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      interest: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const DunningOverdue = t.Composite(
  [DunningOverduePlain, DunningOverdueRelations],
  { additionalProperties: false },
);

export const DunningOverdueInputCreate = t.Composite(
  [DunningOverduePlainInputCreate, DunningOverdueRelationsInputCreate],
  { additionalProperties: false },
);

export const DunningOverdueInputUpdate = t.Composite(
  [DunningOverduePlainInputUpdate, DunningOverdueRelationsInputUpdate],
  { additionalProperties: false },
);
