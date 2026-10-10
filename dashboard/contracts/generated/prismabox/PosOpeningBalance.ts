import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const PosOpeningBalancePlain = t.Object(
  {
    id: t.String(),
    openingId: t.String(),
    paymentMethod: t.Union(
      [t.Literal("CASH"), t.Literal("CARD"), t.Literal("TRANSFER")],
      { additionalProperties: false },
    ),
    amount: t.Number(),
  },
  { additionalProperties: false },
);

export const PosOpeningBalanceRelations = t.Object(
  {
    opening: t.Object(
      {
        id: t.String(),
        clinicId: t.String(),
        profileId: t.String(),
        cashierUserId: t.String(),
        openedAt: t.Date(),
        status: t.Union([t.Literal("OPEN"), t.Literal("CLOSED")], {
          additionalProperties: false,
        }),
        createdAt: t.Date(),
        updatedAt: t.Date(),
      },
      {
        additionalProperties: false,
        description: `فتح وردية: الكاشير ورصيد الدرج الافتتاحي لكل وسيلة دفع.`,
      },
    ),
  },
  { additionalProperties: false },
);

export const PosOpeningBalancePlainInputCreate = t.Object(
  {
    paymentMethod: t.Union(
      [t.Literal("CASH"), t.Literal("CARD"), t.Literal("TRANSFER")],
      { additionalProperties: false },
    ),
    amount: t.Optional(t.Number()),
  },
  { additionalProperties: false },
);

export const PosOpeningBalancePlainInputUpdate = t.Object(
  {
    paymentMethod: t.Optional(
      t.Union([t.Literal("CASH"), t.Literal("CARD"), t.Literal("TRANSFER")], {
        additionalProperties: false,
      }),
    ),
    amount: t.Optional(t.Number()),
  },
  { additionalProperties: false },
);

export const PosOpeningBalanceRelationsInputCreate = t.Object(
  {
    opening: t.Object(
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

export const PosOpeningBalanceRelationsInputUpdate = t.Partial(
  t.Object(
    {
      opening: t.Object(
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

export const PosOpeningBalanceWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          openingId: t.String(),
          paymentMethod: t.Union(
            [t.Literal("CASH"), t.Literal("CARD"), t.Literal("TRANSFER")],
            { additionalProperties: false },
          ),
          amount: t.Number(),
        },
        { additionalProperties: false },
      ),
    { $id: "PosOpeningBalance" },
  ),
);

export const PosOpeningBalanceWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            {
              id: t.String(),
              openingId_paymentMethod: t.Object(
                {
                  openingId: t.String(),
                  paymentMethod: t.Union(
                    [
                      t.Literal("CASH"),
                      t.Literal("CARD"),
                      t.Literal("TRANSFER"),
                    ],
                    { additionalProperties: false },
                  ),
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
              openingId_paymentMethod: t.Object(
                {
                  openingId: t.String(),
                  paymentMethod: t.Union(
                    [
                      t.Literal("CASH"),
                      t.Literal("CARD"),
                      t.Literal("TRANSFER"),
                    ],
                    { additionalProperties: false },
                  ),
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
              openingId: t.String(),
              paymentMethod: t.Union(
                [t.Literal("CASH"), t.Literal("CARD"), t.Literal("TRANSFER")],
                { additionalProperties: false },
              ),
              amount: t.Number(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "PosOpeningBalance" },
);

export const PosOpeningBalanceSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      openingId: t.Boolean(),
      paymentMethod: t.Boolean(),
      amount: t.Boolean(),
      opening: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const PosOpeningBalanceInclude = t.Partial(
  t.Object(
    { paymentMethod: t.Boolean(), opening: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const PosOpeningBalanceOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      openingId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      amount: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const PosOpeningBalance = t.Composite(
  [PosOpeningBalancePlain, PosOpeningBalanceRelations],
  { additionalProperties: false },
);

export const PosOpeningBalanceInputCreate = t.Composite(
  [PosOpeningBalancePlainInputCreate, PosOpeningBalanceRelationsInputCreate],
  { additionalProperties: false },
);

export const PosOpeningBalanceInputUpdate = t.Composite(
  [PosOpeningBalancePlainInputUpdate, PosOpeningBalanceRelationsInputUpdate],
  { additionalProperties: false },
);
