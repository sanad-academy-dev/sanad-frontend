import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const TherapeuticClassPlain = t.Object(
  {
    code: t.String(),
    nameEn: t.String(),
    nameAr: t.String(),
    source: t.String(),
    order: t.Integer(),
  },
  { additionalProperties: false },
);

export const TherapeuticClassRelations = t.Object(
  {
    products: t.Array(
      t.Object(
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
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const TherapeuticClassPlainInputCreate = t.Object(
  {
    nameEn: t.String(),
    nameAr: t.String(),
    source: t.String(),
    order: t.Optional(t.Integer()),
  },
  { additionalProperties: false },
);

export const TherapeuticClassPlainInputUpdate = t.Object(
  {
    nameEn: t.Optional(t.String()),
    nameAr: t.Optional(t.String()),
    source: t.Optional(t.String()),
    order: t.Optional(t.Integer()),
  },
  { additionalProperties: false },
);

export const TherapeuticClassRelationsInputCreate = t.Object(
  {
    products: t.Optional(
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

export const TherapeuticClassRelationsInputUpdate = t.Partial(
  t.Object(
    {
      products: t.Partial(
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

export const TherapeuticClassWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          code: t.String(),
          nameEn: t.String(),
          nameAr: t.String(),
          source: t.String(),
          order: t.Integer(),
        },
        { additionalProperties: false },
      ),
    { $id: "TherapeuticClass" },
  ),
);

export const TherapeuticClassWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object({ code: t.String() }, { additionalProperties: false }),
          { additionalProperties: false },
        ),
        t.Union([t.Object({ code: t.String() })], {
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
              code: t.String(),
              nameEn: t.String(),
              nameAr: t.String(),
              source: t.String(),
              order: t.Integer(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "TherapeuticClass" },
);

export const TherapeuticClassSelect = t.Partial(
  t.Object(
    {
      code: t.Boolean(),
      nameEn: t.Boolean(),
      nameAr: t.Boolean(),
      source: t.Boolean(),
      order: t.Boolean(),
      products: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const TherapeuticClassInclude = t.Partial(
  t.Object(
    { products: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const TherapeuticClassOrderBy = t.Partial(
  t.Object(
    {
      code: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      nameEn: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      nameAr: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      source: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      order: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const TherapeuticClass = t.Composite(
  [TherapeuticClassPlain, TherapeuticClassRelations],
  { additionalProperties: false },
);

export const TherapeuticClassInputCreate = t.Composite(
  [TherapeuticClassPlainInputCreate, TherapeuticClassRelationsInputCreate],
  { additionalProperties: false },
);

export const TherapeuticClassInputUpdate = t.Composite(
  [TherapeuticClassPlainInputUpdate, TherapeuticClassRelationsInputUpdate],
  { additionalProperties: false },
);
