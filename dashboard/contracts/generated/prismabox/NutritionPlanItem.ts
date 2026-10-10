import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const NutritionPlanItemPlain = t.Object(
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
);

export const NutritionPlanItemRelations = t.Object(
  {
    plan: t.Object(
      {
        id: t.String(),
        code: t.String(),
        clinicId: t.String(),
        patientId: t.String(),
        status: t.Union(
          [
            t.Literal("DRAFT"),
            t.Literal("ACTIVE"),
            t.Literal("COMPLETED"),
            t.Literal("DISCONTINUED"),
          ],
          { additionalProperties: false },
        ),
        goal: t.Union(
          [
            t.Literal("MAINTENANCE"),
            t.Literal("WEIGHT_LOSS"),
            t.Literal("WEIGHT_GAIN"),
            t.Literal("GROWTH"),
            t.Literal("GESTATION"),
            t.Literal("LACTATION"),
            t.Literal("RECOVERY"),
          ],
          { additionalProperties: false },
        ),
        appointmentId: __nullable__(t.String()),
        prescriberId: __nullable__(t.String()),
        assessedAt: t.Date(),
        currentWeightKg: t.Number(),
        bodyConditionScore: __nullable__(t.Integer()),
        muscleConditionScore: __nullable__(
          t.Union(
            [
              t.Literal("NORMAL"),
              t.Literal("MILD_LOSS"),
              t.Literal("MODERATE_LOSS"),
              t.Literal("SEVERE_LOSS"),
            ],
            { additionalProperties: false },
          ),
        ),
        idealWeightKg: __nullable__(t.Number()),
        idealWeightSource: __nullable__(t.String()),
        lifeStage: t.Union(
          [
            t.Literal("GROWTH_UNDER_4M"),
            t.Literal("GROWTH_OVER_4M"),
            t.Literal("ADULT"),
            t.Literal("SENIOR"),
          ],
          { additionalProperties: false },
        ),
        activity: t.Union(
          [
            t.Literal("INACTIVE"),
            t.Literal("LOW"),
            t.Literal("MODERATE"),
            t.Literal("HIGH"),
            t.Literal("WORK_LIGHT"),
            t.Literal("WORK_MODERATE"),
            t.Literal("WORK_HEAVY"),
          ],
          { additionalProperties: false },
        ),
        isNeutered: t.Boolean(),
        riskFactors: t.Array(t.String(), { additionalProperties: false }),
        medicalConditions: t.Array(t.String(), { additionalProperties: false }),
        feedingMethod: t.Union(
          [
            t.Literal("MEAL_FED"),
            t.Literal("FREE_CHOICE"),
            t.Literal("COMBINATION"),
          ],
          { additionalProperties: false },
        ),
        mealsPerDay: t.Integer(),
        currentDietSummary: __nullable__(t.String()),
        treatsSummary: __nullable__(t.String()),
        tableFoodSummary: __nullable__(t.String()),
        supplementsSummary: __nullable__(t.String()),
        medicationFoodSummary: __nullable__(t.String()),
        waterSource: __nullable__(t.String()),
        environmentNotes: __nullable__(t.String()),
        currentTreatCaloriePercent: __nullable__(t.Number()),
        calculationWeightKg: t.Number(),
        rerKcal: t.Number(),
        derFactor: t.Number(),
        derFactorSource: t.String(),
        derKcal: t.Number(),
        treatKcalAllowance: t.Number(),
        targetWeeklyRatePercent: __nullable__(t.Number()),
        estimatedWeeks: __nullable__(t.Integer()),
        recheckIntervalDays: t.Integer(),
        nextRecheckAt: __nullable__(t.Date()),
        feedingInstructions: __nullable__(t.String()),
        clinicalNotes: __nullable__(t.String()),
        transitionDays: __nullable__(t.Integer()),
        draftedByAi: t.Boolean(),
        startedAt: __nullable__(t.Date()),
        completedAt: __nullable__(t.Date()),
        discontinuedAt: __nullable__(t.Date()),
        discontinueReason: __nullable__(t.String()),
        editsCount: t.Integer(),
        createdAt: t.Date(),
        updatedAt: t.Date(),
      },
      { additionalProperties: false },
    ),
    food: __nullable__(
      t.Object(
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
      ),
    ),
  },
  { additionalProperties: false },
);

export const NutritionPlanItemPlainInputCreate = t.Object(
  {
    order: t.Optional(t.Integer()),
    nameSnapshot: t.String(),
    formSnapshot: t.Optional(
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
    energyDensityKcalPerKgSnapshot: t.Number(),
    energySharePercent: t.Optional(t.Number()),
    kcalPerDay: t.Number(),
    gramsPerDay: t.Number(),
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
    householdUnitsPerDay: t.Optional(__nullable__(t.Number())),
    isTreat: t.Optional(t.Boolean()),
    notes: t.Optional(__nullable__(t.String())),
  },
  { additionalProperties: false },
);

export const NutritionPlanItemPlainInputUpdate = t.Object(
  {
    order: t.Optional(t.Integer()),
    nameSnapshot: t.Optional(t.String()),
    formSnapshot: t.Optional(
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
    energyDensityKcalPerKgSnapshot: t.Optional(t.Number()),
    energySharePercent: t.Optional(t.Number()),
    kcalPerDay: t.Optional(t.Number()),
    gramsPerDay: t.Optional(t.Number()),
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
    householdUnitsPerDay: t.Optional(__nullable__(t.Number())),
    isTreat: t.Optional(t.Boolean()),
    notes: t.Optional(__nullable__(t.String())),
  },
  { additionalProperties: false },
);

export const NutritionPlanItemRelationsInputCreate = t.Object(
  {
    plan: t.Object(
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
    food: t.Optional(
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
  },
  { additionalProperties: false },
);

export const NutritionPlanItemRelationsInputUpdate = t.Partial(
  t.Object(
    {
      plan: t.Object(
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
      food: t.Partial(
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
    },
    { additionalProperties: false },
  ),
);

export const NutritionPlanItemWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          planId: t.String(),
          order: t.Integer(),
          dietFoodId: t.String(),
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
          householdUnitGrams: t.Number(),
          householdUnitsPerDay: t.Number(),
          isTreat: t.Boolean(),
          notes: t.String(),
        },
        { additionalProperties: false },
      ),
    { $id: "NutritionPlanItem" },
  ),
);

export const NutritionPlanItemWhereUnique = t.Recursive(
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
              planId: t.String(),
              order: t.Integer(),
              dietFoodId: t.String(),
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
              householdUnitGrams: t.Number(),
              householdUnitsPerDay: t.Number(),
              isTreat: t.Boolean(),
              notes: t.String(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "NutritionPlanItem" },
);

export const NutritionPlanItemSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      planId: t.Boolean(),
      order: t.Boolean(),
      dietFoodId: t.Boolean(),
      nameSnapshot: t.Boolean(),
      formSnapshot: t.Boolean(),
      energyDensityKcalPerKgSnapshot: t.Boolean(),
      energySharePercent: t.Boolean(),
      kcalPerDay: t.Boolean(),
      gramsPerDay: t.Boolean(),
      householdUnit: t.Boolean(),
      householdUnitGrams: t.Boolean(),
      householdUnitsPerDay: t.Boolean(),
      isTreat: t.Boolean(),
      notes: t.Boolean(),
      plan: t.Boolean(),
      food: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const NutritionPlanItemInclude = t.Partial(
  t.Object(
    {
      formSnapshot: t.Boolean(),
      householdUnit: t.Boolean(),
      plan: t.Boolean(),
      food: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const NutritionPlanItemOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      planId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      order: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      dietFoodId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      nameSnapshot: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      energyDensityKcalPerKgSnapshot: t.Union(
        [t.Literal("asc"), t.Literal("desc")],
        { additionalProperties: false },
      ),
      energySharePercent: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      kcalPerDay: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      gramsPerDay: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      householdUnitGrams: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      householdUnitsPerDay: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      isTreat: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      notes: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const NutritionPlanItem = t.Composite(
  [NutritionPlanItemPlain, NutritionPlanItemRelations],
  { additionalProperties: false },
);

export const NutritionPlanItemInputCreate = t.Composite(
  [NutritionPlanItemPlainInputCreate, NutritionPlanItemRelationsInputCreate],
  { additionalProperties: false },
);

export const NutritionPlanItemInputUpdate = t.Composite(
  [NutritionPlanItemPlainInputUpdate, NutritionPlanItemRelationsInputUpdate],
  { additionalProperties: false },
);
