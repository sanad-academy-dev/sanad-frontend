import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const AccountingDimensionFilterValuePlain = t.Object(
  { id: t.String(), filterId: t.String(), dimValue: t.String() },
  { additionalProperties: false },
);

export const AccountingDimensionFilterValueRelations = t.Object(
  {
    filter: t.Object(
      {
        id: t.String(),
        clinicId: t.String(),
        dimensionId: t.String(),
        allowOnly: t.Boolean(),
        disabled: t.Boolean(),
        createdById: __nullable__(t.String()),
        createdAt: t.Date(),
        updatedAt: t.Date(),
      },
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const AccountingDimensionFilterValuePlainInputCreate = t.Object(
  { dimValue: t.String() },
  { additionalProperties: false },
);

export const AccountingDimensionFilterValuePlainInputUpdate = t.Object(
  { dimValue: t.Optional(t.String()) },
  { additionalProperties: false },
);

export const AccountingDimensionFilterValueRelationsInputCreate = t.Object(
  {
    filter: t.Object(
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

export const AccountingDimensionFilterValueRelationsInputUpdate = t.Partial(
  t.Object(
    {
      filter: t.Object(
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

export const AccountingDimensionFilterValueWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          filterId: t.String(),
          dimValue: t.String(),
        },
        { additionalProperties: false },
      ),
    { $id: "AccountingDimensionFilterValue" },
  ),
);

export const AccountingDimensionFilterValueWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            {
              id: t.String(),
              filterId_dimValue: t.Object(
                { filterId: t.String(), dimValue: t.String() },
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
              filterId_dimValue: t.Object(
                { filterId: t.String(), dimValue: t.String() },
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
            { id: t.String(), filterId: t.String(), dimValue: t.String() },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "AccountingDimensionFilterValue" },
);

export const AccountingDimensionFilterValueSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      filterId: t.Boolean(),
      dimValue: t.Boolean(),
      filter: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const AccountingDimensionFilterValueInclude = t.Partial(
  t.Object(
    { filter: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const AccountingDimensionFilterValueOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      filterId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      dimValue: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const AccountingDimensionFilterValue = t.Composite(
  [
    AccountingDimensionFilterValuePlain,
    AccountingDimensionFilterValueRelations,
  ],
  { additionalProperties: false },
);

export const AccountingDimensionFilterValueInputCreate = t.Composite(
  [
    AccountingDimensionFilterValuePlainInputCreate,
    AccountingDimensionFilterValueRelationsInputCreate,
  ],
  { additionalProperties: false },
);

export const AccountingDimensionFilterValueInputUpdate = t.Composite(
  [
    AccountingDimensionFilterValuePlainInputUpdate,
    AccountingDimensionFilterValueRelationsInputUpdate,
  ],
  { additionalProperties: false },
);
