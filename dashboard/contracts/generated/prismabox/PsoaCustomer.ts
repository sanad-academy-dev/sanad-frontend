import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const PsoaCustomerPlain = t.Object(
  {
    id: t.String(),
    psoaId: t.String(),
    partyType: t.String(),
    partyId: t.String(),
    email: __nullable__(
      t.String({
        description: `بريد المُرسَل إليه — فارغ ⇒ يُقرأ من سجلّ الطرف عند الإرسال`,
      }),
    ),
  },
  { additionalProperties: false },
);

export const PsoaCustomerRelations = t.Object(
  {
    psoa: t.Object(
      {
        id: t.String(),
        clinicId: t.String(),
        title: t.String(),
        reportType: t.Union(
          [t.Literal("PARTY_LEDGER"), t.Literal("RECEIVABLE_AGEING")],
          { additionalProperties: false },
        ),
        frequency: t.Union(
          [
            t.Literal("MANUAL"),
            t.Literal("WEEKLY"),
            t.Literal("MONTHLY"),
            t.Literal("QUARTERLY"),
          ],
          { additionalProperties: false },
        ),
        fromDate: __nullable__(
          t.Date({
            description: `نافذة ثابتة اختيارية؛ فارغة ⇒ تُشتقّ من التكرار عند كل إرسال`,
          }),
        ),
        toDate: __nullable__(t.Date()),
        subject: __nullable__(t.String()),
        bodyText: __nullable__(t.String()),
        ccEmails: t.Array(t.String(), { additionalProperties: false }),
        enabled: t.Boolean(),
        lastSentAt: __nullable__(t.Date()),
        createdById: __nullable__(t.String()),
        createdAt: t.Date(),
        updatedAt: t.Date(),
      },
      {
        additionalProperties: false,
        description: `[P12.7] FR-17.4 — تهيئة محفوظة لإرسال كشوف الحساب دوريًا إلى العملاء.`,
      },
    ),
  },
  { additionalProperties: false },
);

export const PsoaCustomerPlainInputCreate = t.Object(
  {
    partyType: t.String(),
    email: t.Optional(
      __nullable__(
        t.String({
          description: `بريد المُرسَل إليه — فارغ ⇒ يُقرأ من سجلّ الطرف عند الإرسال`,
        }),
      ),
    ),
  },
  { additionalProperties: false },
);

export const PsoaCustomerPlainInputUpdate = t.Object(
  {
    partyType: t.Optional(t.String()),
    email: t.Optional(
      __nullable__(
        t.String({
          description: `بريد المُرسَل إليه — فارغ ⇒ يُقرأ من سجلّ الطرف عند الإرسال`,
        }),
      ),
    ),
  },
  { additionalProperties: false },
);

export const PsoaCustomerRelationsInputCreate = t.Object(
  {
    psoa: t.Object(
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

export const PsoaCustomerRelationsInputUpdate = t.Partial(
  t.Object(
    {
      psoa: t.Object(
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

export const PsoaCustomerWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          psoaId: t.String(),
          partyType: t.String(),
          partyId: t.String(),
          email: t.String({
            description: `بريد المُرسَل إليه — فارغ ⇒ يُقرأ من سجلّ الطرف عند الإرسال`,
          }),
        },
        { additionalProperties: false },
      ),
    { $id: "PsoaCustomer" },
  ),
);

export const PsoaCustomerWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            {
              id: t.String(),
              psoaId_partyType_partyId: t.Object(
                {
                  psoaId: t.String(),
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
              psoaId_partyType_partyId: t.Object(
                {
                  psoaId: t.String(),
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
              psoaId: t.String(),
              partyType: t.String(),
              partyId: t.String(),
              email: t.String({
                description: `بريد المُرسَل إليه — فارغ ⇒ يُقرأ من سجلّ الطرف عند الإرسال`,
              }),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "PsoaCustomer" },
);

export const PsoaCustomerSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      psoaId: t.Boolean(),
      partyType: t.Boolean(),
      partyId: t.Boolean(),
      email: t.Boolean(),
      psoa: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const PsoaCustomerInclude = t.Partial(
  t.Object(
    { psoa: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const PsoaCustomerOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      psoaId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      partyType: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      partyId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      email: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const PsoaCustomer = t.Composite(
  [PsoaCustomerPlain, PsoaCustomerRelations],
  { additionalProperties: false },
);

export const PsoaCustomerInputCreate = t.Composite(
  [PsoaCustomerPlainInputCreate, PsoaCustomerRelationsInputCreate],
  { additionalProperties: false },
);

export const PsoaCustomerInputUpdate = t.Composite(
  [PsoaCustomerPlainInputUpdate, PsoaCustomerRelationsInputUpdate],
  { additionalProperties: false },
);
