import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const DrugMonographPlain = t.Object(
  {
    id: t.String(),
    genericKey: t.String(),
    genericName: t.String(),
    genericNameAr: __nullable__(t.String()),
    atcVetCode: __nullable__(t.String()),
    summaryAr: __nullable__(t.String()),
    summaryEn: __nullable__(t.String()),
    sourceCitation: t.String(),
    reviewedBy: __nullable__(t.String()),
    reviewedAt: __nullable__(t.Date()),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  },
  { additionalProperties: false },
);

export const DrugMonographRelations = t.Object(
  {
    doses: t.Array(
      t.Object(
        {
          id: t.String(),
          monographId: t.String(),
          species: t.Union(
            [
              t.Literal("DOG"),
              t.Literal("CAT"),
              t.Literal("HORSE"),
              t.Literal("CATTLE"),
              t.Literal("SHEEP"),
              t.Literal("GOAT"),
              t.Literal("CAMEL"),
              t.Literal("POULTRY"),
              t.Literal("RABBIT"),
              t.Literal("SWINE"),
              t.Literal("FISH"),
              t.Literal("BEE"),
            ],
            { additionalProperties: false },
          ),
          contraindicated: t.Boolean(),
          doseMin: __nullable__(t.Number()),
          doseMax: __nullable__(t.Number()),
          doseUnit: __nullable__(t.String()),
          route: __nullable__(t.String()),
          frequency: __nullable__(t.String()),
          durationNote: __nullable__(t.String()),
          warningAr: __nullable__(t.String()),
          warningEn: __nullable__(t.String()),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const DrugMonographPlainInputCreate = t.Object(
  {
    genericKey: t.String(),
    genericName: t.String(),
    genericNameAr: t.Optional(__nullable__(t.String())),
    atcVetCode: t.Optional(__nullable__(t.String())),
    summaryAr: t.Optional(__nullable__(t.String())),
    summaryEn: t.Optional(__nullable__(t.String())),
    sourceCitation: t.String(),
    reviewedBy: t.Optional(__nullable__(t.String())),
    reviewedAt: t.Optional(__nullable__(t.Date())),
  },
  { additionalProperties: false },
);

export const DrugMonographPlainInputUpdate = t.Object(
  {
    genericKey: t.Optional(t.String()),
    genericName: t.Optional(t.String()),
    genericNameAr: t.Optional(__nullable__(t.String())),
    atcVetCode: t.Optional(__nullable__(t.String())),
    summaryAr: t.Optional(__nullable__(t.String())),
    summaryEn: t.Optional(__nullable__(t.String())),
    sourceCitation: t.Optional(t.String()),
    reviewedBy: t.Optional(__nullable__(t.String())),
    reviewedAt: t.Optional(__nullable__(t.Date())),
  },
  { additionalProperties: false },
);

export const DrugMonographRelationsInputCreate = t.Object(
  {
    doses: t.Optional(
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

export const DrugMonographRelationsInputUpdate = t.Partial(
  t.Object(
    {
      doses: t.Partial(
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

export const DrugMonographWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          genericKey: t.String(),
          genericName: t.String(),
          genericNameAr: t.String(),
          atcVetCode: t.String(),
          summaryAr: t.String(),
          summaryEn: t.String(),
          sourceCitation: t.String(),
          reviewedBy: t.String(),
          reviewedAt: t.Date(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "DrugMonograph" },
  ),
);

export const DrugMonographWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.String(), genericKey: t.String() },
            { additionalProperties: false },
          ),
          { additionalProperties: false },
        ),
        t.Union(
          [t.Object({ id: t.String() }), t.Object({ genericKey: t.String() })],
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
              genericKey: t.String(),
              genericName: t.String(),
              genericNameAr: t.String(),
              atcVetCode: t.String(),
              summaryAr: t.String(),
              summaryEn: t.String(),
              sourceCitation: t.String(),
              reviewedBy: t.String(),
              reviewedAt: t.Date(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "DrugMonograph" },
);

export const DrugMonographSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      genericKey: t.Boolean(),
      genericName: t.Boolean(),
      genericNameAr: t.Boolean(),
      atcVetCode: t.Boolean(),
      summaryAr: t.Boolean(),
      summaryEn: t.Boolean(),
      sourceCitation: t.Boolean(),
      reviewedBy: t.Boolean(),
      reviewedAt: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      doses: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const DrugMonographInclude = t.Partial(
  t.Object(
    { doses: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const DrugMonographOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      genericKey: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      genericName: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      genericNameAr: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      atcVetCode: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      summaryAr: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      summaryEn: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      sourceCitation: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      reviewedBy: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      reviewedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const DrugMonograph = t.Composite(
  [DrugMonographPlain, DrugMonographRelations],
  { additionalProperties: false },
);

export const DrugMonographInputCreate = t.Composite(
  [DrugMonographPlainInputCreate, DrugMonographRelationsInputCreate],
  { additionalProperties: false },
);

export const DrugMonographInputUpdate = t.Composite(
  [DrugMonographPlainInputUpdate, DrugMonographRelationsInputUpdate],
  { additionalProperties: false },
);
