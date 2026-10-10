import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const StaffAllowancePlain = t.Object(
  {
    id: t.String(),
    compensationId: t.String(),
    type: t.Union(
      [
        t.Literal("HOUSING"),
        t.Literal("TRANSPORT"),
        t.Literal("FOOD"),
        t.Literal("PHONE"),
        t.Literal("OTHER"),
      ],
      { additionalProperties: false },
    ),
    amount: t.Number(),
    note: __nullable__(t.String()),
    createdAt: t.Date(),
  },
  { additionalProperties: false },
);

export const StaffAllowanceRelations = t.Object(
  {
    compensation: t.Object(
      {
        id: t.String(),
        staffId: t.String(),
        baseSalary: t.Number(),
        iban: __nullable__(t.String()),
        bankName: __nullable__(t.String()),
        defaultPaymentMethod: t.Union(
          [t.Literal("TRANSFER"), t.Literal("CASH"), t.Literal("CHECK")],
          { additionalProperties: false },
        ),
        effectiveFrom: __nullable__(t.Date()),
        notes: __nullable__(t.String()),
        createdAt: t.Date(),
        updatedAt: t.Date(),
      },
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const StaffAllowancePlainInputCreate = t.Object(
  {
    type: t.Union(
      [
        t.Literal("HOUSING"),
        t.Literal("TRANSPORT"),
        t.Literal("FOOD"),
        t.Literal("PHONE"),
        t.Literal("OTHER"),
      ],
      { additionalProperties: false },
    ),
    amount: t.Number(),
    note: t.Optional(__nullable__(t.String())),
  },
  { additionalProperties: false },
);

export const StaffAllowancePlainInputUpdate = t.Object(
  {
    type: t.Optional(
      t.Union(
        [
          t.Literal("HOUSING"),
          t.Literal("TRANSPORT"),
          t.Literal("FOOD"),
          t.Literal("PHONE"),
          t.Literal("OTHER"),
        ],
        { additionalProperties: false },
      ),
    ),
    amount: t.Optional(t.Number()),
    note: t.Optional(__nullable__(t.String())),
  },
  { additionalProperties: false },
);

export const StaffAllowanceRelationsInputCreate = t.Object(
  {
    compensation: t.Object(
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

export const StaffAllowanceRelationsInputUpdate = t.Partial(
  t.Object(
    {
      compensation: t.Object(
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

export const StaffAllowanceWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          compensationId: t.String(),
          type: t.Union(
            [
              t.Literal("HOUSING"),
              t.Literal("TRANSPORT"),
              t.Literal("FOOD"),
              t.Literal("PHONE"),
              t.Literal("OTHER"),
            ],
            { additionalProperties: false },
          ),
          amount: t.Number(),
          note: t.String(),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "StaffAllowance" },
  ),
);

export const StaffAllowanceWhereUnique = t.Recursive(
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
              compensationId: t.String(),
              type: t.Union(
                [
                  t.Literal("HOUSING"),
                  t.Literal("TRANSPORT"),
                  t.Literal("FOOD"),
                  t.Literal("PHONE"),
                  t.Literal("OTHER"),
                ],
                { additionalProperties: false },
              ),
              amount: t.Number(),
              note: t.String(),
              createdAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "StaffAllowance" },
);

export const StaffAllowanceSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      compensationId: t.Boolean(),
      type: t.Boolean(),
      amount: t.Boolean(),
      note: t.Boolean(),
      createdAt: t.Boolean(),
      compensation: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const StaffAllowanceInclude = t.Partial(
  t.Object(
    { type: t.Boolean(), compensation: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const StaffAllowanceOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      compensationId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      amount: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      note: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const StaffAllowance = t.Composite(
  [StaffAllowancePlain, StaffAllowanceRelations],
  { additionalProperties: false },
);

export const StaffAllowanceInputCreate = t.Composite(
  [StaffAllowancePlainInputCreate, StaffAllowanceRelationsInputCreate],
  { additionalProperties: false },
);

export const StaffAllowanceInputUpdate = t.Composite(
  [StaffAllowancePlainInputUpdate, StaffAllowanceRelationsInputUpdate],
  { additionalProperties: false },
);
