import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const DrugCatalogProductSpeciesPlain = t.Object(
  {
    id: t.String(),
    productId: t.String(),
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

export const DrugCatalogProductSpeciesRelations = t.Object(
  {
    product: t.Object(
      {
        id: t.String(),
        standardId: t.String(),
        registerNumber: t.String(),
        tradeName: t.String(),
        tradeNameAr: __nullable__(t.String()),
        genericName: t.String(),
        genericNameAr: __nullable__(t.String()),
        genericKey: t.String(),
        strength: __nullable__(t.String()),
        strengthUnit: __nullable__(t.String()),
        dosageForm: __nullable__(t.String()),
        routeOfAdministration: __nullable__(t.String()),
        packageType: __nullable__(t.String()),
        packageSize: __nullable__(t.String()),
        packageUnit: __nullable__(t.String()),
        drugType: __nullable__(t.String()),
        subType: __nullable__(t.String()),
        legalStatus: __nullable__(t.String()),
        authorizationStatus: __nullable__(t.String()),
        marketingStatus: __nullable__(t.String()),
        shelfLifeMonths: __nullable__(t.Integer()),
        storageConditions: __nullable__(t.String()),
        manufacturerName: __nullable__(t.String()),
        manufacturerCountry: __nullable__(t.String()),
        marketingCompany: __nullable__(t.String()),
        agentName: __nullable__(t.String()),
        atcVetCode: __nullable__(t.String()),
        distributionArea: __nullable__(t.String()),
        registrationYear: __nullable__(t.Integer()),
        withdrawalPeriod: __nullable__(t.String()),
        targetAnimalsRaw: __nullable__(t.String()),
        allSpecies: t.Boolean(),
        therapeuticClassCode: __nullable__(t.String()),
        searchText: t.String(),
        createdAt: t.Date(),
      },
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const DrugCatalogProductSpeciesPlainInputCreate = t.Object(
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

export const DrugCatalogProductSpeciesPlainInputUpdate = t.Object(
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

export const DrugCatalogProductSpeciesRelationsInputCreate = t.Object(
  {
    product: t.Object(
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

export const DrugCatalogProductSpeciesRelationsInputUpdate = t.Partial(
  t.Object(
    {
      product: t.Object(
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

export const DrugCatalogProductSpeciesWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          productId: t.String(),
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
    { $id: "DrugCatalogProductSpecies" },
  ),
);

export const DrugCatalogProductSpeciesWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            {
              id: t.String(),
              productId_species: t.Object(
                {
                  productId: t.String(),
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
              productId_species: t.Object(
                {
                  productId: t.String(),
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
              productId: t.String(),
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
  { $id: "DrugCatalogProductSpecies" },
);

export const DrugCatalogProductSpeciesSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      productId: t.Boolean(),
      species: t.Boolean(),
      product: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const DrugCatalogProductSpeciesInclude = t.Partial(
  t.Object(
    { species: t.Boolean(), product: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const DrugCatalogProductSpeciesOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      productId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const DrugCatalogProductSpecies = t.Composite(
  [DrugCatalogProductSpeciesPlain, DrugCatalogProductSpeciesRelations],
  { additionalProperties: false },
);

export const DrugCatalogProductSpeciesInputCreate = t.Composite(
  [
    DrugCatalogProductSpeciesPlainInputCreate,
    DrugCatalogProductSpeciesRelationsInputCreate,
  ],
  { additionalProperties: false },
);

export const DrugCatalogProductSpeciesInputUpdate = t.Composite(
  [
    DrugCatalogProductSpeciesPlainInputUpdate,
    DrugCatalogProductSpeciesRelationsInputUpdate,
  ],
  { additionalProperties: false },
);
