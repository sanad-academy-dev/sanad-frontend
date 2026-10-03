import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const DrugMonographDosePlain = t.Object(
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
);

export const DrugMonographDoseRelations = t.Object(
  {
    monograph: t.Object(
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
    ),
  },
  { additionalProperties: false },
);

export const DrugMonographDosePlainInputCreate = t.Object(
  {
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
    contraindicated: t.Optional(t.Boolean()),
    doseMin: t.Optional(__nullable__(t.Number())),
    doseMax: t.Optional(__nullable__(t.Number())),
    doseUnit: t.Optional(__nullable__(t.String())),
    route: t.Optional(__nullable__(t.String())),
    frequency: t.Optional(__nullable__(t.String())),
    durationNote: t.Optional(__nullable__(t.String())),
    warningAr: t.Optional(__nullable__(t.String())),
    warningEn: t.Optional(__nullable__(t.String())),
  },
  { additionalProperties: false },
);

export const DrugMonographDosePlainInputUpdate = t.Object(
  {
    species: t.Optional(
      t.Union(
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
    ),
    contraindicated: t.Optional(t.Boolean()),
    doseMin: t.Optional(__nullable__(t.Number())),
    doseMax: t.Optional(__nullable__(t.Number())),
    doseUnit: t.Optional(__nullable__(t.String())),
    route: t.Optional(__nullable__(t.String())),
    frequency: t.Optional(__nullable__(t.String())),
    durationNote: t.Optional(__nullable__(t.String())),
    warningAr: t.Optional(__nullable__(t.String())),
    warningEn: t.Optional(__nullable__(t.String())),
  },
  { additionalProperties: false },
);

export const DrugMonographDoseRelationsInputCreate = t.Object(
  {
    monograph: t.Object(
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

export const DrugMonographDoseRelationsInputUpdate = t.Partial(
  t.Object(
    {
      monograph: t.Object(
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

export const DrugMonographDoseWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
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
          doseMin: t.Number(),
          doseMax: t.Number(),
          doseUnit: t.String(),
          route: t.String(),
          frequency: t.String(),
          durationNote: t.String(),
          warningAr: t.String(),
          warningEn: t.String(),
        },
        { additionalProperties: false },
      ),
    { $id: "DrugMonographDose" },
  ),
);

export const DrugMonographDoseWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            {
              id: t.String(),
              monographId_species_route: t.Object(
                {
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
                  route: t.String(),
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
              monographId_species_route: t.Object(
                {
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
                  route: t.String(),
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
              doseMin: t.Number(),
              doseMax: t.Number(),
              doseUnit: t.String(),
              route: t.String(),
              frequency: t.String(),
              durationNote: t.String(),
              warningAr: t.String(),
              warningEn: t.String(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "DrugMonographDose" },
);

export const DrugMonographDoseSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      monographId: t.Boolean(),
      species: t.Boolean(),
      contraindicated: t.Boolean(),
      doseMin: t.Boolean(),
      doseMax: t.Boolean(),
      doseUnit: t.Boolean(),
      route: t.Boolean(),
      frequency: t.Boolean(),
      durationNote: t.Boolean(),
      warningAr: t.Boolean(),
      warningEn: t.Boolean(),
      monograph: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const DrugMonographDoseInclude = t.Partial(
  t.Object(
    { species: t.Boolean(), monograph: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const DrugMonographDoseOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      monographId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      contraindicated: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      doseMin: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      doseMax: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      doseUnit: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      route: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      frequency: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      durationNote: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      warningAr: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      warningEn: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const DrugMonographDose = t.Composite(
  [DrugMonographDosePlain, DrugMonographDoseRelations],
  { additionalProperties: false },
);

export const DrugMonographDoseInputCreate = t.Composite(
  [DrugMonographDosePlainInputCreate, DrugMonographDoseRelationsInputCreate],
  { additionalProperties: false },
);

export const DrugMonographDoseInputUpdate = t.Composite(
  [DrugMonographDosePlainInputUpdate, DrugMonographDoseRelationsInputUpdate],
  { additionalProperties: false },
);
