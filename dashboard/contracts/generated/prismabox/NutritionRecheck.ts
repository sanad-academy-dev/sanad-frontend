import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const NutritionRecheckPlain = t.Object(
  {
    id: t.String(),
    clinicId: t.String(),
    planId: t.String(),
    recheckedAt: t.Date(),
    performedById: __nullable__(t.String()),
    weightKg: t.Number(),
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
    weightChangeKg: __nullable__(t.Number()),
    weeklyRatePercent: __nullable__(t.Number()),
    outcome: __nullable__(
      t.Union(
        [
          t.Literal("ON_TRACK"),
          t.Literal("TOO_FAST"),
          t.Literal("TOO_SLOW"),
          t.Literal("STALLED"),
          t.Literal("REVERSED"),
          t.Literal("GOAL_REACHED"),
        ],
        { additionalProperties: false },
      ),
    ),
    ownerAdherence: __nullable__(t.Integer()),
    adjustmentPercent: __nullable__(t.Number()),
    newDerKcal: __nullable__(t.Number()),
    adjustmentReason: __nullable__(t.String()),
    notes: __nullable__(t.String()),
    nextRecheckAt: __nullable__(t.Date()),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  },
  { additionalProperties: false },
);

export const NutritionRecheckRelations = t.Object(
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
    performedBy: __nullable__(
      t.Object(
        {
          id: t.String(),
          code: t.String(),
          clinicId: t.String(),
          userId: __nullable__(t.String()),
          roleId: t.String(),
          branchId: t.String(),
          name: t.String(),
          gender: __nullable__(
            t.Union(
              [t.Literal("MALE"), t.Literal("FEMALE"), t.Literal("UNKNOWN")],
              { additionalProperties: false },
            ),
          ),
          prefix: __nullable__(
            t.Union(
              [
                t.Literal("MR"),
                t.Literal("MRS"),
                t.Literal("MS"),
                t.Literal("DR"),
                t.Literal("PROF"),
              ],
              { additionalProperties: false },
            ),
          ),
          age: __nullable__(t.Integer()),
          licenseNumber: __nullable__(t.String()),
          email: t.String(),
          phone: __nullable__(t.String()),
          country: __nullable__(t.String()),
          city: __nullable__(t.String()),
          address: __nullable__(t.String()),
          notes: __nullable__(t.String()),
          bio: __nullable__(t.String()),
          educationalQualification: __nullable__(t.String()),
          nationality: __nullable__(t.String()),
          avatar: __nullable__(t.String()),
          primarySpecializationId: __nullable__(t.String()),
          secondarySpecializationId: __nullable__(t.String()),
          employmentType: __nullable__(
            t.Union([t.Literal("FULL_TIME"), t.Literal("PART_TIME")], {
              additionalProperties: false,
            }),
          ),
          hireDate: __nullable__(t.Date()),
          isSaudi: t.Boolean(),
          status: t.Union(
            [t.Literal("PENDING"), t.Literal("ACTIVE"), t.Literal("INACTIVE")],
            { additionalProperties: false },
          ),
          active: t.Boolean(),
          isDeleted: t.Boolean(),
          deletedAt: __nullable__(t.Date()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    ),
  },
  { additionalProperties: false },
);

export const NutritionRecheckPlainInputCreate = t.Object(
  {
    recheckedAt: t.Optional(t.Date()),
    weightKg: t.Number(),
    bodyConditionScore: t.Optional(__nullable__(t.Integer())),
    muscleConditionScore: t.Optional(
      __nullable__(
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
    ),
    weightChangeKg: t.Optional(__nullable__(t.Number())),
    weeklyRatePercent: t.Optional(__nullable__(t.Number())),
    outcome: t.Optional(
      __nullable__(
        t.Union(
          [
            t.Literal("ON_TRACK"),
            t.Literal("TOO_FAST"),
            t.Literal("TOO_SLOW"),
            t.Literal("STALLED"),
            t.Literal("REVERSED"),
            t.Literal("GOAL_REACHED"),
          ],
          { additionalProperties: false },
        ),
      ),
    ),
    ownerAdherence: t.Optional(__nullable__(t.Integer())),
    adjustmentPercent: t.Optional(__nullable__(t.Number())),
    newDerKcal: t.Optional(__nullable__(t.Number())),
    adjustmentReason: t.Optional(__nullable__(t.String())),
    notes: t.Optional(__nullable__(t.String())),
    nextRecheckAt: t.Optional(__nullable__(t.Date())),
  },
  { additionalProperties: false },
);

export const NutritionRecheckPlainInputUpdate = t.Object(
  {
    recheckedAt: t.Optional(t.Date()),
    weightKg: t.Optional(t.Number()),
    bodyConditionScore: t.Optional(__nullable__(t.Integer())),
    muscleConditionScore: t.Optional(
      __nullable__(
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
    ),
    weightChangeKg: t.Optional(__nullable__(t.Number())),
    weeklyRatePercent: t.Optional(__nullable__(t.Number())),
    outcome: t.Optional(
      __nullable__(
        t.Union(
          [
            t.Literal("ON_TRACK"),
            t.Literal("TOO_FAST"),
            t.Literal("TOO_SLOW"),
            t.Literal("STALLED"),
            t.Literal("REVERSED"),
            t.Literal("GOAL_REACHED"),
          ],
          { additionalProperties: false },
        ),
      ),
    ),
    ownerAdherence: t.Optional(__nullable__(t.Integer())),
    adjustmentPercent: t.Optional(__nullable__(t.Number())),
    newDerKcal: t.Optional(__nullable__(t.Number())),
    adjustmentReason: t.Optional(__nullable__(t.String())),
    notes: t.Optional(__nullable__(t.String())),
    nextRecheckAt: t.Optional(__nullable__(t.Date())),
  },
  { additionalProperties: false },
);

export const NutritionRecheckRelationsInputCreate = t.Object(
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
    performedBy: t.Optional(
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

export const NutritionRecheckRelationsInputUpdate = t.Partial(
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
      performedBy: t.Partial(
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

export const NutritionRecheckWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          clinicId: t.String(),
          planId: t.String(),
          recheckedAt: t.Date(),
          performedById: t.String(),
          weightKg: t.Number(),
          bodyConditionScore: t.Integer(),
          muscleConditionScore: t.Union(
            [
              t.Literal("NORMAL"),
              t.Literal("MILD_LOSS"),
              t.Literal("MODERATE_LOSS"),
              t.Literal("SEVERE_LOSS"),
            ],
            { additionalProperties: false },
          ),
          weightChangeKg: t.Number(),
          weeklyRatePercent: t.Number(),
          outcome: t.Union(
            [
              t.Literal("ON_TRACK"),
              t.Literal("TOO_FAST"),
              t.Literal("TOO_SLOW"),
              t.Literal("STALLED"),
              t.Literal("REVERSED"),
              t.Literal("GOAL_REACHED"),
            ],
            { additionalProperties: false },
          ),
          ownerAdherence: t.Integer(),
          adjustmentPercent: t.Number(),
          newDerKcal: t.Number(),
          adjustmentReason: t.String(),
          notes: t.String(),
          nextRecheckAt: t.Date(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "NutritionRecheck" },
  ),
);

export const NutritionRecheckWhereUnique = t.Recursive(
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
              clinicId: t.String(),
              planId: t.String(),
              recheckedAt: t.Date(),
              performedById: t.String(),
              weightKg: t.Number(),
              bodyConditionScore: t.Integer(),
              muscleConditionScore: t.Union(
                [
                  t.Literal("NORMAL"),
                  t.Literal("MILD_LOSS"),
                  t.Literal("MODERATE_LOSS"),
                  t.Literal("SEVERE_LOSS"),
                ],
                { additionalProperties: false },
              ),
              weightChangeKg: t.Number(),
              weeklyRatePercent: t.Number(),
              outcome: t.Union(
                [
                  t.Literal("ON_TRACK"),
                  t.Literal("TOO_FAST"),
                  t.Literal("TOO_SLOW"),
                  t.Literal("STALLED"),
                  t.Literal("REVERSED"),
                  t.Literal("GOAL_REACHED"),
                ],
                { additionalProperties: false },
              ),
              ownerAdherence: t.Integer(),
              adjustmentPercent: t.Number(),
              newDerKcal: t.Number(),
              adjustmentReason: t.String(),
              notes: t.String(),
              nextRecheckAt: t.Date(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "NutritionRecheck" },
);

export const NutritionRecheckSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      clinicId: t.Boolean(),
      planId: t.Boolean(),
      recheckedAt: t.Boolean(),
      performedById: t.Boolean(),
      weightKg: t.Boolean(),
      bodyConditionScore: t.Boolean(),
      muscleConditionScore: t.Boolean(),
      weightChangeKg: t.Boolean(),
      weeklyRatePercent: t.Boolean(),
      outcome: t.Boolean(),
      ownerAdherence: t.Boolean(),
      adjustmentPercent: t.Boolean(),
      newDerKcal: t.Boolean(),
      adjustmentReason: t.Boolean(),
      notes: t.Boolean(),
      nextRecheckAt: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinic: t.Boolean(),
      plan: t.Boolean(),
      performedBy: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const NutritionRecheckInclude = t.Partial(
  t.Object(
    {
      muscleConditionScore: t.Boolean(),
      outcome: t.Boolean(),
      clinic: t.Boolean(),
      plan: t.Boolean(),
      performedBy: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const NutritionRecheckOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clinicId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      planId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      recheckedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      performedById: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      weightKg: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      bodyConditionScore: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      weightChangeKg: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      weeklyRatePercent: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      ownerAdherence: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      adjustmentPercent: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      newDerKcal: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      adjustmentReason: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      notes: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      nextRecheckAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const NutritionRecheck = t.Composite(
  [NutritionRecheckPlain, NutritionRecheckRelations],
  { additionalProperties: false },
);

export const NutritionRecheckInputCreate = t.Composite(
  [NutritionRecheckPlainInputCreate, NutritionRecheckRelationsInputCreate],
  { additionalProperties: false },
);

export const NutritionRecheckInputUpdate = t.Composite(
  [NutritionRecheckPlainInputUpdate, NutritionRecheckRelationsInputUpdate],
  { additionalProperties: false },
);
