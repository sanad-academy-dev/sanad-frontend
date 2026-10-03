import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const VaccineSpeciesPlain = t.Object(
  {
    id: t.String(),
    vaccineId: t.String(),
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
  },
  { additionalProperties: false },
);

export const VaccineSpeciesRelations = t.Object(
  {
    vaccine: t.Object(
      {
        id: t.String(),
        code: t.String(),
        clinicId: t.String(),
        name: t.String(),
        nameEn: __nullable__(t.String()),
        kind: t.Union(
          [
            t.Literal("MODIFIED_LIVE"),
            t.Literal("KILLED"),
            t.Literal("RECOMBINANT"),
            t.Literal("TOXOID"),
            t.Literal("SUBUNIT"),
            t.Literal("OTHER"),
          ],
          { additionalProperties: false },
        ),
        manufacturerName: __nullable__(t.String()),
        catalogProductId: __nullable__(t.String()),
        inventoryItemId: __nullable__(t.String()),
        primarySeriesDoses: t.Integer(),
        primarySeriesIntervalDays: __nullable__(t.Integer()),
        boosterIntervalDays: __nullable__(t.Integer()),
        immunityOnsetDays: t.Integer(),
        defaultRoute: t.Union(
          [
            t.Literal("SUBCUTANEOUS"),
            t.Literal("INTRAMUSCULAR"),
            t.Literal("INTRANASAL"),
            t.Literal("ORAL"),
            t.Literal("INTRADERMAL"),
            t.Literal("TOPICAL"),
            t.Literal("OTHER"),
          ],
          { additionalProperties: false },
        ),
        defaultSite: __nullable__(
          t.Union(
            [
              t.Literal("LEFT_SHOULDER"),
              t.Literal("RIGHT_SHOULDER"),
              t.Literal("LEFT_HIND_LIMB"),
              t.Literal("RIGHT_HIND_LIMB"),
              t.Literal("INTERSCAPULAR"),
              t.Literal("LEFT_FLANK"),
              t.Literal("RIGHT_FLANK"),
              t.Literal("NASAL"),
              t.Literal("ORAL"),
              t.Literal("OTHER"),
            ],
            { additionalProperties: false },
          ),
        ),
        defaultDoseVolumeMl: __nullable__(t.Number()),
        notes: __nullable__(t.String()),
        active: t.Boolean(),
        isDeleted: t.Boolean(),
        deletedAt: __nullable__(t.Date()),
        editsCount: t.Integer(),
        createdAt: t.Date(),
        updatedAt: t.Date(),
      },
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const VaccineSpeciesPlainInputCreate = t.Object(
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
  },
  { additionalProperties: false },
);

export const VaccineSpeciesPlainInputUpdate = t.Object(
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
  },
  { additionalProperties: false },
);

export const VaccineSpeciesRelationsInputCreate = t.Object(
  {
    vaccine: t.Object(
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

export const VaccineSpeciesRelationsInputUpdate = t.Partial(
  t.Object(
    {
      vaccine: t.Object(
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

export const VaccineSpeciesWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          vaccineId: t.String(),
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
        },
        { additionalProperties: false },
      ),
    { $id: "VaccineSpecies" },
  ),
);

export const VaccineSpeciesWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            {
              id: t.String(),
              vaccineId_species: t.Object(
                {
                  vaccineId: t.String(),
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
              vaccineId_species: t.Object(
                {
                  vaccineId: t.String(),
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
              vaccineId: t.String(),
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
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "VaccineSpecies" },
);

export const VaccineSpeciesSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      vaccineId: t.Boolean(),
      species: t.Boolean(),
      vaccine: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const VaccineSpeciesInclude = t.Partial(
  t.Object(
    { species: t.Boolean(), vaccine: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const VaccineSpeciesOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      vaccineId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const VaccineSpecies = t.Composite(
  [VaccineSpeciesPlain, VaccineSpeciesRelations],
  { additionalProperties: false },
);

export const VaccineSpeciesInputCreate = t.Composite(
  [VaccineSpeciesPlainInputCreate, VaccineSpeciesRelationsInputCreate],
  { additionalProperties: false },
);

export const VaccineSpeciesInputUpdate = t.Composite(
  [VaccineSpeciesPlainInputUpdate, VaccineSpeciesRelationsInputUpdate],
  { additionalProperties: false },
);
