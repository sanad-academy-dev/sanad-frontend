import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const DietFoodPlain = t.Object(
  {
    id: t.String(),
    code: t.String(),
    clinicId: t.String(),
    seedKey: __nullable__(t.String()),
    name: t.String(),
    nameEn: __nullable__(t.String()),
    brand: __nullable__(t.String()),
    form: t.Union(
      [
        t.Literal("DRY"),
        t.Literal("WET"),
        t.Literal("RAW"),
        t.Literal("HOME_COOKED"),
        t.Literal("TREAT"),
        t.Literal("SUPPLEMENT"),
      ],
      { additionalProperties: false },
    ),
    kind: t.Union(
      [
        t.Literal("MAINTENANCE"),
        t.Literal("THERAPEUTIC"),
        t.Literal("TREAT"),
        t.Literal("SUPPLEMENT"),
      ],
      { additionalProperties: false },
    ),
    metabolizableEnergyKcalPerKg: t.Number(),
    householdUnit: t.Union(
      [
        t.Literal("GRAM"),
        t.Literal("CUP"),
        t.Literal("CAN"),
        t.Literal("SCOOP"),
        t.Literal("PIECE"),
      ],
      { additionalProperties: false },
    ),
    householdUnitGrams: __nullable__(t.Number()),
    proteinPercentDm: __nullable__(t.Number()),
    fatPercentDm: __nullable__(t.Number()),
    fiberPercentDm: __nullable__(t.Number()),
    moisturePercent: __nullable__(t.Number()),
    sodiumPercentDm: __nullable__(t.Number()),
    phosphorusPercentDm: __nullable__(t.Number()),
    species: t.Array(
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
      { additionalProperties: false },
    ),
    indications: t.Array(t.String(), { additionalProperties: false }),
    lifeStages: t.Array(
      t.Union(
        [
          t.Literal("GROWTH_UNDER_4M"),
          t.Literal("GROWTH_OVER_4M"),
          t.Literal("ADULT"),
          t.Literal("SENIOR"),
        ],
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    inventoryItemId: __nullable__(t.String()),
    notes: __nullable__(t.String()),
    active: t.Boolean(),
    isDeleted: t.Boolean(),
    deletedAt: __nullable__(t.Date()),
    editsCount: t.Integer(),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  },
  { additionalProperties: false },
);

export const DietFoodRelations = t.Object(
  {
    clinic: t.Object(
      {
        id: t.String(),
        name: t.String(),
        slug: __nullable__(t.String()),
        plan: t.Union(
          [t.Literal("FREE"), t.Literal("BASIC"), t.Literal("PRO")],
          { additionalProperties: false },
        ),
        trialEndsAt: __nullable__(t.Date()),
        onboardingCompleted: t.Boolean(),
        rbacVersion: t.Integer({
          description: `[RBAC P4] يُرفَع عند أيّ كتابة على دور أو منحة أو إسناد. الجلسة تحمل النسخة التي
بُنيت منها لقطتُها، فتُعيد بناءها ذاتيًا عند الاختلاف بدل حذف الجلسات وإخراج المستخدم.`,
        }),
        createdAt: t.Date(),
        updatedAt: t.Date(),
      },
      { additionalProperties: false },
    ),
    inventoryItem: __nullable__(
      t.Object(
        {
          id: t.String(),
          code: t.String(),
          clinicId: t.String(),
          name: t.String(),
          category: t.Union(
            [
              t.Literal("ANTIBIOTIC"),
              t.Literal("ANTI_INFLAMMATORY"),
              t.Literal("VACCINE"),
              t.Literal("HORMONE"),
              t.Literal("SUPPLEMENT"),
              t.Literal("CRUSTACEAN"),
              t.Literal("SURGICAL_TOOLS"),
              t.Literal("SUPPLIES"),
            ],
            { additionalProperties: false },
          ),
          stock: t.Integer(),
          reorderPoint: t.Integer(),
          productionDate: __nullable__(t.Date()),
          expiryDate: __nullable__(t.Date()),
          price: t.Number(),
          unitCost: __nullable__(t.Number()),
          valuationRate: t.Number(),
          maxQuantity: __nullable__(t.Integer()),
          sku: __nullable__(t.String()),
          barcode: __nullable__(t.String()),
          supplier: __nullable__(t.String()),
          location: __nullable__(t.String()),
          notes: __nullable__(t.String()),
          tracksBatches: t.Boolean(),
          itemTaxTemplateId: __nullable__(t.String()),
          catalogProductId: __nullable__(t.String()),
          active: t.Boolean(),
          isDeleted: t.Boolean(),
          deletedAt: __nullable__(t.Date()),
          editsCount: t.Integer(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    ),
    planItems: t.Array(
      t.Object(
        {
          id: t.String(),
          planId: t.String(),
          order: t.Integer(),
          dietFoodId: __nullable__(t.String()),
          nameSnapshot: t.String(),
          formSnapshot: t.Union(
            [
              t.Literal("DRY"),
              t.Literal("WET"),
              t.Literal("RAW"),
              t.Literal("HOME_COOKED"),
              t.Literal("TREAT"),
              t.Literal("SUPPLEMENT"),
            ],
            { additionalProperties: false },
          ),
          energyDensityKcalPerKgSnapshot: t.Number(),
          energySharePercent: t.Number(),
          kcalPerDay: t.Number(),
          gramsPerDay: t.Number(),
          householdUnit: t.Union(
            [
              t.Literal("GRAM"),
              t.Literal("CUP"),
              t.Literal("CAN"),
              t.Literal("SCOOP"),
              t.Literal("PIECE"),
            ],
            { additionalProperties: false },
          ),
          householdUnitGrams: __nullable__(t.Number()),
          householdUnitsPerDay: __nullable__(t.Number()),
          isTreat: t.Boolean(),
          notes: __nullable__(t.String()),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const DietFoodPlainInputCreate = t.Object(
  {
    code: t.String(),
    seedKey: t.Optional(__nullable__(t.String())),
    name: t.String(),
    nameEn: t.Optional(__nullable__(t.String())),
    brand: t.Optional(__nullable__(t.String())),
    form: t.Optional(
      t.Union(
        [
          t.Literal("DRY"),
          t.Literal("WET"),
          t.Literal("RAW"),
          t.Literal("HOME_COOKED"),
          t.Literal("TREAT"),
          t.Literal("SUPPLEMENT"),
        ],
        { additionalProperties: false },
      ),
    ),
    kind: t.Optional(
      t.Union(
        [
          t.Literal("MAINTENANCE"),
          t.Literal("THERAPEUTIC"),
          t.Literal("TREAT"),
          t.Literal("SUPPLEMENT"),
        ],
        { additionalProperties: false },
      ),
    ),
    metabolizableEnergyKcalPerKg: t.Number(),
    householdUnit: t.Optional(
      t.Union(
        [
          t.Literal("GRAM"),
          t.Literal("CUP"),
          t.Literal("CAN"),
          t.Literal("SCOOP"),
          t.Literal("PIECE"),
        ],
        { additionalProperties: false },
      ),
    ),
    householdUnitGrams: t.Optional(__nullable__(t.Number())),
    proteinPercentDm: t.Optional(__nullable__(t.Number())),
    fatPercentDm: t.Optional(__nullable__(t.Number())),
    fiberPercentDm: t.Optional(__nullable__(t.Number())),
    moisturePercent: t.Optional(__nullable__(t.Number())),
    sodiumPercentDm: t.Optional(__nullable__(t.Number())),
    phosphorusPercentDm: t.Optional(__nullable__(t.Number())),
    species: t.Array(
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
      { additionalProperties: false },
    ),
    indications: t.Array(t.String(), { additionalProperties: false }),
    lifeStages: t.Array(
      t.Union(
        [
          t.Literal("GROWTH_UNDER_4M"),
          t.Literal("GROWTH_OVER_4M"),
          t.Literal("ADULT"),
          t.Literal("SENIOR"),
        ],
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    notes: t.Optional(__nullable__(t.String())),
    active: t.Optional(t.Boolean()),
    isDeleted: t.Optional(t.Boolean()),
    deletedAt: t.Optional(__nullable__(t.Date())),
    editsCount: t.Optional(t.Integer()),
  },
  { additionalProperties: false },
);

export const DietFoodPlainInputUpdate = t.Object(
  {
    code: t.Optional(t.String()),
    seedKey: t.Optional(__nullable__(t.String())),
    name: t.Optional(t.String()),
    nameEn: t.Optional(__nullable__(t.String())),
    brand: t.Optional(__nullable__(t.String())),
    form: t.Optional(
      t.Union(
        [
          t.Literal("DRY"),
          t.Literal("WET"),
          t.Literal("RAW"),
          t.Literal("HOME_COOKED"),
          t.Literal("TREAT"),
          t.Literal("SUPPLEMENT"),
        ],
        { additionalProperties: false },
      ),
    ),
    kind: t.Optional(
      t.Union(
        [
          t.Literal("MAINTENANCE"),
          t.Literal("THERAPEUTIC"),
          t.Literal("TREAT"),
          t.Literal("SUPPLEMENT"),
        ],
        { additionalProperties: false },
      ),
    ),
    metabolizableEnergyKcalPerKg: t.Optional(t.Number()),
    householdUnit: t.Optional(
      t.Union(
        [
          t.Literal("GRAM"),
          t.Literal("CUP"),
          t.Literal("CAN"),
          t.Literal("SCOOP"),
          t.Literal("PIECE"),
        ],
        { additionalProperties: false },
      ),
    ),
    householdUnitGrams: t.Optional(__nullable__(t.Number())),
    proteinPercentDm: t.Optional(__nullable__(t.Number())),
    fatPercentDm: t.Optional(__nullable__(t.Number())),
    fiberPercentDm: t.Optional(__nullable__(t.Number())),
    moisturePercent: t.Optional(__nullable__(t.Number())),
    sodiumPercentDm: t.Optional(__nullable__(t.Number())),
    phosphorusPercentDm: t.Optional(__nullable__(t.Number())),
    species: t.Optional(
      t.Array(
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
        { additionalProperties: false },
      ),
    ),
    indications: t.Optional(
      t.Array(t.String(), { additionalProperties: false }),
    ),
    lifeStages: t.Optional(
      t.Array(
        t.Union(
          [
            t.Literal("GROWTH_UNDER_4M"),
            t.Literal("GROWTH_OVER_4M"),
            t.Literal("ADULT"),
            t.Literal("SENIOR"),
          ],
          { additionalProperties: false },
        ),
        { additionalProperties: false },
      ),
    ),
    notes: t.Optional(__nullable__(t.String())),
    active: t.Optional(t.Boolean()),
    isDeleted: t.Optional(t.Boolean()),
    deletedAt: t.Optional(__nullable__(t.Date())),
    editsCount: t.Optional(t.Integer()),
  },
  { additionalProperties: false },
);

export const DietFoodRelationsInputCreate = t.Object(
  {
    clinic: t.Object(
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
    inventoryItem: t.Optional(
      t.Object(
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
    ),
    planItems: t.Optional(
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

export const DietFoodRelationsInputUpdate = t.Partial(
  t.Object(
    {
      clinic: t.Object(
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
      inventoryItem: t.Partial(
        t.Object(
          {
            connect: t.Object(
              {
                id: t.String({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
            disconnect: t.Boolean(),
          },
          { additionalProperties: false },
        ),
      ),
      planItems: t.Partial(
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

export const DietFoodWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          code: t.String(),
          clinicId: t.String(),
          seedKey: t.String(),
          name: t.String(),
          nameEn: t.String(),
          brand: t.String(),
          form: t.Union(
            [
              t.Literal("DRY"),
              t.Literal("WET"),
              t.Literal("RAW"),
              t.Literal("HOME_COOKED"),
              t.Literal("TREAT"),
              t.Literal("SUPPLEMENT"),
            ],
            { additionalProperties: false },
          ),
          kind: t.Union(
            [
              t.Literal("MAINTENANCE"),
              t.Literal("THERAPEUTIC"),
              t.Literal("TREAT"),
              t.Literal("SUPPLEMENT"),
            ],
            { additionalProperties: false },
          ),
          metabolizableEnergyKcalPerKg: t.Number(),
          householdUnit: t.Union(
            [
              t.Literal("GRAM"),
              t.Literal("CUP"),
              t.Literal("CAN"),
              t.Literal("SCOOP"),
              t.Literal("PIECE"),
            ],
            { additionalProperties: false },
          ),
          householdUnitGrams: t.Number(),
          proteinPercentDm: t.Number(),
          fatPercentDm: t.Number(),
          fiberPercentDm: t.Number(),
          moisturePercent: t.Number(),
          sodiumPercentDm: t.Number(),
          phosphorusPercentDm: t.Number(),
          species: t.Array(
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
            { additionalProperties: false },
          ),
          indications: t.Array(t.String(), { additionalProperties: false }),
          lifeStages: t.Array(
            t.Union(
              [
                t.Literal("GROWTH_UNDER_4M"),
                t.Literal("GROWTH_OVER_4M"),
                t.Literal("ADULT"),
                t.Literal("SENIOR"),
              ],
              { additionalProperties: false },
            ),
            { additionalProperties: false },
          ),
          inventoryItemId: t.String(),
          notes: t.String(),
          active: t.Boolean(),
          isDeleted: t.Boolean(),
          deletedAt: t.Date(),
          editsCount: t.Integer(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "DietFood" },
  ),
);

export const DietFoodWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            {
              id: t.String(),
              code: t.String(),
              clinicId_seedKey: t.Object(
                { clinicId: t.String(), seedKey: t.String() },
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
            t.Object({ code: t.String() }),
            t.Object({
              clinicId_seedKey: t.Object(
                { clinicId: t.String(), seedKey: t.String() },
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
              code: t.String(),
              clinicId: t.String(),
              seedKey: t.String(),
              name: t.String(),
              nameEn: t.String(),
              brand: t.String(),
              form: t.Union(
                [
                  t.Literal("DRY"),
                  t.Literal("WET"),
                  t.Literal("RAW"),
                  t.Literal("HOME_COOKED"),
                  t.Literal("TREAT"),
                  t.Literal("SUPPLEMENT"),
                ],
                { additionalProperties: false },
              ),
              kind: t.Union(
                [
                  t.Literal("MAINTENANCE"),
                  t.Literal("THERAPEUTIC"),
                  t.Literal("TREAT"),
                  t.Literal("SUPPLEMENT"),
                ],
                { additionalProperties: false },
              ),
              metabolizableEnergyKcalPerKg: t.Number(),
              householdUnit: t.Union(
                [
                  t.Literal("GRAM"),
                  t.Literal("CUP"),
                  t.Literal("CAN"),
                  t.Literal("SCOOP"),
                  t.Literal("PIECE"),
                ],
                { additionalProperties: false },
              ),
              householdUnitGrams: t.Number(),
              proteinPercentDm: t.Number(),
              fatPercentDm: t.Number(),
              fiberPercentDm: t.Number(),
              moisturePercent: t.Number(),
              sodiumPercentDm: t.Number(),
              phosphorusPercentDm: t.Number(),
              species: t.Array(
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
                { additionalProperties: false },
              ),
              indications: t.Array(t.String(), { additionalProperties: false }),
              lifeStages: t.Array(
                t.Union(
                  [
                    t.Literal("GROWTH_UNDER_4M"),
                    t.Literal("GROWTH_OVER_4M"),
                    t.Literal("ADULT"),
                    t.Literal("SENIOR"),
                  ],
                  { additionalProperties: false },
                ),
                { additionalProperties: false },
              ),
              inventoryItemId: t.String(),
              notes: t.String(),
              active: t.Boolean(),
              isDeleted: t.Boolean(),
              deletedAt: t.Date(),
              editsCount: t.Integer(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "DietFood" },
);

export const DietFoodSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      code: t.Boolean(),
      clinicId: t.Boolean(),
      seedKey: t.Boolean(),
      name: t.Boolean(),
      nameEn: t.Boolean(),
      brand: t.Boolean(),
      form: t.Boolean(),
      kind: t.Boolean(),
      metabolizableEnergyKcalPerKg: t.Boolean(),
      householdUnit: t.Boolean(),
      householdUnitGrams: t.Boolean(),
      proteinPercentDm: t.Boolean(),
      fatPercentDm: t.Boolean(),
      fiberPercentDm: t.Boolean(),
      moisturePercent: t.Boolean(),
      sodiumPercentDm: t.Boolean(),
      phosphorusPercentDm: t.Boolean(),
      species: t.Boolean(),
      indications: t.Boolean(),
      lifeStages: t.Boolean(),
      inventoryItemId: t.Boolean(),
      notes: t.Boolean(),
      active: t.Boolean(),
      isDeleted: t.Boolean(),
      deletedAt: t.Boolean(),
      editsCount: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinic: t.Boolean(),
      inventoryItem: t.Boolean(),
      planItems: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const DietFoodInclude = t.Partial(
  t.Object(
    {
      form: t.Boolean(),
      kind: t.Boolean(),
      householdUnit: t.Boolean(),
      species: t.Boolean(),
      lifeStages: t.Boolean(),
      clinic: t.Boolean(),
      inventoryItem: t.Boolean(),
      planItems: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const DietFoodOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      code: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clinicId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      seedKey: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      name: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      nameEn: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      brand: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      metabolizableEnergyKcalPerKg: t.Union(
        [t.Literal("asc"), t.Literal("desc")],
        { additionalProperties: false },
      ),
      householdUnitGrams: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      proteinPercentDm: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      fatPercentDm: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      fiberPercentDm: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      moisturePercent: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      sodiumPercentDm: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      phosphorusPercentDm: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      indications: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      inventoryItemId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      notes: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      active: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      isDeleted: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      deletedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      editsCount: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const DietFood = t.Composite([DietFoodPlain, DietFoodRelations], {
  additionalProperties: false,
});

export const DietFoodInputCreate = t.Composite(
  [DietFoodPlainInputCreate, DietFoodRelationsInputCreate],
  { additionalProperties: false },
);

export const DietFoodInputUpdate = t.Composite(
  [DietFoodPlainInputUpdate, DietFoodRelationsInputUpdate],
  { additionalProperties: false },
);
