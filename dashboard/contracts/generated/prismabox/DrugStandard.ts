import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const DrugStandardPlain = t.Object(
  {
    id: t.String(),
    code: t.String(),
    nameEn: t.String(),
    nameAr: t.String(),
    countryCode: t.String(),
    authorityEn: t.String(),
    authorityAr: t.String(),
    sourceUrl: t.String(),
    dataVersion: t.String(),
    fetchedAt: t.Date(),
    productCount: t.Integer(),
    isActive: t.Boolean(),
    coverageNoteAr: __nullable__(t.String()),
    coverageNoteEn: __nullable__(t.String()),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  },
  { additionalProperties: false },
);

export const DrugStandardRelations = t.Object(
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
    clinicConfigs: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          standardId: t.String(),
          enabled: t.Boolean(),
          enabledAt: __nullable__(t.Date()),
          enabledById: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const DrugStandardPlainInputCreate = t.Object(
  {
    code: t.String(),
    nameEn: t.String(),
    nameAr: t.String(),
    countryCode: t.String(),
    authorityEn: t.String(),
    authorityAr: t.String(),
    sourceUrl: t.String(),
    dataVersion: t.String(),
    fetchedAt: t.Date(),
    productCount: t.Optional(t.Integer()),
    isActive: t.Optional(t.Boolean()),
    coverageNoteAr: t.Optional(__nullable__(t.String())),
    coverageNoteEn: t.Optional(__nullable__(t.String())),
  },
  { additionalProperties: false },
);

export const DrugStandardPlainInputUpdate = t.Object(
  {
    code: t.Optional(t.String()),
    nameEn: t.Optional(t.String()),
    nameAr: t.Optional(t.String()),
    countryCode: t.Optional(t.String()),
    authorityEn: t.Optional(t.String()),
    authorityAr: t.Optional(t.String()),
    sourceUrl: t.Optional(t.String()),
    dataVersion: t.Optional(t.String()),
    fetchedAt: t.Optional(t.Date()),
    productCount: t.Optional(t.Integer()),
    isActive: t.Optional(t.Boolean()),
    coverageNoteAr: t.Optional(__nullable__(t.String())),
    coverageNoteEn: t.Optional(__nullable__(t.String())),
  },
  { additionalProperties: false },
);

export const DrugStandardRelationsInputCreate = t.Object(
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
    clinicConfigs: t.Optional(
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

export const DrugStandardRelationsInputUpdate = t.Partial(
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
      clinicConfigs: t.Partial(
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

export const DrugStandardWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          code: t.String(),
          nameEn: t.String(),
          nameAr: t.String(),
          countryCode: t.String(),
          authorityEn: t.String(),
          authorityAr: t.String(),
          sourceUrl: t.String(),
          dataVersion: t.String(),
          fetchedAt: t.Date(),
          productCount: t.Integer(),
          isActive: t.Boolean(),
          coverageNoteAr: t.String(),
          coverageNoteEn: t.String(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "DrugStandard" },
  ),
);

export const DrugStandardWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.String(), code: t.String() },
            { additionalProperties: false },
          ),
          { additionalProperties: false },
        ),
        t.Union(
          [t.Object({ id: t.String() }), t.Object({ code: t.String() })],
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
              code: t.String(),
              nameEn: t.String(),
              nameAr: t.String(),
              countryCode: t.String(),
              authorityEn: t.String(),
              authorityAr: t.String(),
              sourceUrl: t.String(),
              dataVersion: t.String(),
              fetchedAt: t.Date(),
              productCount: t.Integer(),
              isActive: t.Boolean(),
              coverageNoteAr: t.String(),
              coverageNoteEn: t.String(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "DrugStandard" },
);

export const DrugStandardSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      code: t.Boolean(),
      nameEn: t.Boolean(),
      nameAr: t.Boolean(),
      countryCode: t.Boolean(),
      authorityEn: t.Boolean(),
      authorityAr: t.Boolean(),
      sourceUrl: t.Boolean(),
      dataVersion: t.Boolean(),
      fetchedAt: t.Boolean(),
      productCount: t.Boolean(),
      isActive: t.Boolean(),
      coverageNoteAr: t.Boolean(),
      coverageNoteEn: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      products: t.Boolean(),
      clinicConfigs: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const DrugStandardInclude = t.Partial(
  t.Object(
    { products: t.Boolean(), clinicConfigs: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const DrugStandardOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      code: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      nameEn: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      nameAr: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      countryCode: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      authorityEn: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      authorityAr: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      sourceUrl: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      dataVersion: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      fetchedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      productCount: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      isActive: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      coverageNoteAr: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      coverageNoteEn: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const DrugStandard = t.Composite(
  [DrugStandardPlain, DrugStandardRelations],
  { additionalProperties: false },
);

export const DrugStandardInputCreate = t.Composite(
  [DrugStandardPlainInputCreate, DrugStandardRelationsInputCreate],
  { additionalProperties: false },
);

export const DrugStandardInputUpdate = t.Composite(
  [DrugStandardPlainInputUpdate, DrugStandardRelationsInputUpdate],
  { additionalProperties: false },
);
