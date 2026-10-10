import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const NutritionPlanPlain = t.Object(
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
);

export const NutritionPlanRelations = t.Object(
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
    patient: t.Object(
      {
        id: t.String(),
        code: t.String(),
        clinicId: t.String(),
        ownerId: __nullable__(t.String()),
        name: t.String(),
        nameNormalized: t.String(),
        gender: t.Union(
          [t.Literal("MALE"), t.Literal("FEMALE"), t.Literal("UNKNOWN")],
          { additionalProperties: false },
        ),
        animalTypeId: t.String(),
        animalStrainId: __nullable__(t.String()),
        age: __nullable__(t.Number()),
        birthDate: __nullable__(t.Date()),
        weight: __nullable__(t.Number()),
        microchipNumber: __nullable__(t.String()),
        coat: __nullable__(t.String()),
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
    appointment: __nullable__(
      t.Object(
        {
          id: t.String(),
          code: t.String(),
          clinicId: t.String(),
          branchId: t.String(),
          ownerId: t.String(),
          patientId: t.String(),
          staffId: t.String(),
          roomId: __nullable__(t.String()),
          startsAt: t.Date(),
          durationMinutes: t.Integer(),
          location: t.Union(
            [
              t.Literal("IN_CLINIC"),
              t.Literal("REMOTE"),
              t.Literal("HOME_VISIT"),
              t.Literal("MOBILE_CLINIC"),
            ],
            { additionalProperties: false },
          ),
          status: t.Union(
            [
              t.Literal("SCHEDULED"),
              t.Literal("WAITING"),
              t.Literal("CHECK_IN"),
              t.Literal("IN_SERVICE"),
              t.Literal("HOSPITALIZED"),
              t.Literal("AWAITING_PAYMENT"),
              t.Literal("DONE"),
              t.Literal("CANCELLED"),
            ],
            { additionalProperties: false },
          ),
          queueStatus: __nullable__(
            t.Union(
              [
                t.Literal("ON_HOLD"),
                t.Literal("NO_SHOW"),
                t.Literal("CONFIRMED"),
              ],
              { additionalProperties: false },
            ),
          ),
          priority: __nullable__(
            t.Union(
              [
                t.Literal("LOW"),
                t.Literal("MEDIUM"),
                t.Literal("HIGH"),
                t.Literal("URGENT"),
              ],
              { additionalProperties: false },
            ),
          ),
          isEmergency: t.Boolean({
            description: `[E0] يبقى كما هو، ويصبح **إسقاطًا** لا مدخلًا حين تُفعَّل طبقة الطوارئ على الفرع:
\`isEmergency = triageCategory ∈ {RED, ORANGE}\` تُكتب في نفس معاملة التقييم. نفس
سابقة \`isUrgent ⇔ priority === URGENT\` في التحاليل والأشعة. مع الطبقة مُطفأة يبقى
مفتاحًا يدويًّا كما كان، فكل مستهلك قائم (ترتيب الطابور، الشارة، صفّ الإنذار،
الوكيل، معالج الحجز) يعمل بلا تعديل سطر واحد.`,
          }),
          triageCategory: __nullable__(
            t.Union(
              [
                t.Literal("RED"),
                t.Literal("ORANGE"),
                t.Literal("YELLOW"),
                t.Literal("GREEN"),
                t.Literal("BLUE"),
              ],
              {
                additionalProperties: false,
                description: `فئات قائمة الفرز البيطرية (VTL — Ruys et al. 2012) المشتقّة من مقياس مانشستر.
الأهداف الزمنية لكل فئة في \`emergency.rules.ts\` لا هنا: العتبة التي تقرّر من
يُرى أوّلًا تُراجَع في طلب دمج ويوقّعها إنسان، ولا تُحرَّر من شاشة إعدادات.`,
              },
            ),
          ),
          arrivedAt: __nullable__(
            t.Date({
              description: `[E0] وقت الوصول الفعلي — لا وقت الموعد. \`startsAt\` هو ما كان مجدولًا، وهذا ما
حدث. كل هدف انتظار وكل مقياس «من الباب إلى الطبيب» يُقاس من هنا، ولا يُشتقّ من
\`startsAt\` لأن مريض الطوارئ يصل قبل موعده أو بلا موعد أصلًا.`,
            }),
          ),
          reason: __nullable__(t.String()),
          symptoms: __nullable__(t.String()),
          clinicalNotes: __nullable__(t.String()),
          consultationTypeId: __nullable__(t.String()),
          serviceAddressId: __nullable__(t.String()),
          consultationFeeSnapshot: __nullable__(t.Number()),
          consultationPaidAt: __nullable__(t.Date()),
          whatsappReminderEnabled: t.Boolean(),
          images: t.Array(t.String(), { additionalProperties: false }),
          recurringGroupId: __nullable__(t.String()),
          recurringIndex: __nullable__(t.Integer()),
          recurringTotal: __nullable__(t.Integer()),
          repeatUnit: __nullable__(
            t.Union(
              [
                t.Literal("DAY"),
                t.Literal("WEEK"),
                t.Literal("TWO_WEEKS"),
                t.Literal("MONTH"),
                t.Literal("YEAR"),
              ],
              { additionalProperties: false },
            ),
          ),
          isDeleted: t.Boolean(),
          deletedAt: __nullable__(t.Date()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    ),
    prescriber: __nullable__(
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
    items: t.Array(
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
    rechecks: t.Array(
      t.Object(
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
      ),
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const NutritionPlanPlainInputCreate = t.Object(
  {
    code: t.String(),
    status: t.Optional(
      t.Union(
        [
          t.Literal("DRAFT"),
          t.Literal("ACTIVE"),
          t.Literal("COMPLETED"),
          t.Literal("DISCONTINUED"),
        ],
        { additionalProperties: false },
      ),
    ),
    goal: t.Optional(
      t.Union(
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
    ),
    assessedAt: t.Optional(t.Date()),
    currentWeightKg: t.Number(),
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
    idealWeightKg: t.Optional(__nullable__(t.Number())),
    idealWeightSource: t.Optional(__nullable__(t.String())),
    lifeStage: t.Optional(
      t.Union(
        [
          t.Literal("GROWTH_UNDER_4M"),
          t.Literal("GROWTH_OVER_4M"),
          t.Literal("ADULT"),
          t.Literal("SENIOR"),
        ],
        { additionalProperties: false },
      ),
    ),
    activity: t.Optional(
      t.Union(
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
    ),
    isNeutered: t.Optional(t.Boolean()),
    riskFactors: t.Array(t.String(), { additionalProperties: false }),
    medicalConditions: t.Array(t.String(), { additionalProperties: false }),
    feedingMethod: t.Optional(
      t.Union(
        [
          t.Literal("MEAL_FED"),
          t.Literal("FREE_CHOICE"),
          t.Literal("COMBINATION"),
        ],
        { additionalProperties: false },
      ),
    ),
    mealsPerDay: t.Optional(t.Integer()),
    currentDietSummary: t.Optional(__nullable__(t.String())),
    treatsSummary: t.Optional(__nullable__(t.String())),
    tableFoodSummary: t.Optional(__nullable__(t.String())),
    supplementsSummary: t.Optional(__nullable__(t.String())),
    medicationFoodSummary: t.Optional(__nullable__(t.String())),
    waterSource: t.Optional(__nullable__(t.String())),
    environmentNotes: t.Optional(__nullable__(t.String())),
    currentTreatCaloriePercent: t.Optional(__nullable__(t.Number())),
    calculationWeightKg: t.Number(),
    rerKcal: t.Number(),
    derFactor: t.Number(),
    derFactorSource: t.String(),
    derKcal: t.Number(),
    treatKcalAllowance: t.Number(),
    targetWeeklyRatePercent: t.Optional(__nullable__(t.Number())),
    estimatedWeeks: t.Optional(__nullable__(t.Integer())),
    recheckIntervalDays: t.Optional(t.Integer()),
    nextRecheckAt: t.Optional(__nullable__(t.Date())),
    feedingInstructions: t.Optional(__nullable__(t.String())),
    clinicalNotes: t.Optional(__nullable__(t.String())),
    transitionDays: t.Optional(__nullable__(t.Integer())),
    draftedByAi: t.Optional(t.Boolean()),
    startedAt: t.Optional(__nullable__(t.Date())),
    completedAt: t.Optional(__nullable__(t.Date())),
    discontinuedAt: t.Optional(__nullable__(t.Date())),
    discontinueReason: t.Optional(__nullable__(t.String())),
    editsCount: t.Optional(t.Integer()),
  },
  { additionalProperties: false },
);

export const NutritionPlanPlainInputUpdate = t.Object(
  {
    code: t.Optional(t.String()),
    status: t.Optional(
      t.Union(
        [
          t.Literal("DRAFT"),
          t.Literal("ACTIVE"),
          t.Literal("COMPLETED"),
          t.Literal("DISCONTINUED"),
        ],
        { additionalProperties: false },
      ),
    ),
    goal: t.Optional(
      t.Union(
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
    ),
    assessedAt: t.Optional(t.Date()),
    currentWeightKg: t.Optional(t.Number()),
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
    idealWeightKg: t.Optional(__nullable__(t.Number())),
    idealWeightSource: t.Optional(__nullable__(t.String())),
    lifeStage: t.Optional(
      t.Union(
        [
          t.Literal("GROWTH_UNDER_4M"),
          t.Literal("GROWTH_OVER_4M"),
          t.Literal("ADULT"),
          t.Literal("SENIOR"),
        ],
        { additionalProperties: false },
      ),
    ),
    activity: t.Optional(
      t.Union(
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
    ),
    isNeutered: t.Optional(t.Boolean()),
    riskFactors: t.Optional(
      t.Array(t.String(), { additionalProperties: false }),
    ),
    medicalConditions: t.Optional(
      t.Array(t.String(), { additionalProperties: false }),
    ),
    feedingMethod: t.Optional(
      t.Union(
        [
          t.Literal("MEAL_FED"),
          t.Literal("FREE_CHOICE"),
          t.Literal("COMBINATION"),
        ],
        { additionalProperties: false },
      ),
    ),
    mealsPerDay: t.Optional(t.Integer()),
    currentDietSummary: t.Optional(__nullable__(t.String())),
    treatsSummary: t.Optional(__nullable__(t.String())),
    tableFoodSummary: t.Optional(__nullable__(t.String())),
    supplementsSummary: t.Optional(__nullable__(t.String())),
    medicationFoodSummary: t.Optional(__nullable__(t.String())),
    waterSource: t.Optional(__nullable__(t.String())),
    environmentNotes: t.Optional(__nullable__(t.String())),
    currentTreatCaloriePercent: t.Optional(__nullable__(t.Number())),
    calculationWeightKg: t.Optional(t.Number()),
    rerKcal: t.Optional(t.Number()),
    derFactor: t.Optional(t.Number()),
    derFactorSource: t.Optional(t.String()),
    derKcal: t.Optional(t.Number()),
    treatKcalAllowance: t.Optional(t.Number()),
    targetWeeklyRatePercent: t.Optional(__nullable__(t.Number())),
    estimatedWeeks: t.Optional(__nullable__(t.Integer())),
    recheckIntervalDays: t.Optional(t.Integer()),
    nextRecheckAt: t.Optional(__nullable__(t.Date())),
    feedingInstructions: t.Optional(__nullable__(t.String())),
    clinicalNotes: t.Optional(__nullable__(t.String())),
    transitionDays: t.Optional(__nullable__(t.Integer())),
    draftedByAi: t.Optional(t.Boolean()),
    startedAt: t.Optional(__nullable__(t.Date())),
    completedAt: t.Optional(__nullable__(t.Date())),
    discontinuedAt: t.Optional(__nullable__(t.Date())),
    discontinueReason: t.Optional(__nullable__(t.String())),
    editsCount: t.Optional(t.Integer()),
  },
  { additionalProperties: false },
);

export const NutritionPlanRelationsInputCreate = t.Object(
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
    patient: t.Object(
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
    appointment: t.Optional(
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
    prescriber: t.Optional(
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
    items: t.Optional(
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
    rechecks: t.Optional(
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

export const NutritionPlanRelationsInputUpdate = t.Partial(
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
      patient: t.Object(
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
      appointment: t.Partial(
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
      prescriber: t.Partial(
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
      items: t.Partial(
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
      rechecks: t.Partial(
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

export const NutritionPlanWhere = t.Partial(
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
          appointmentId: t.String(),
          prescriberId: t.String(),
          assessedAt: t.Date(),
          currentWeightKg: t.Number(),
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
          idealWeightKg: t.Number(),
          idealWeightSource: t.String(),
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
          medicalConditions: t.Array(t.String(), {
            additionalProperties: false,
          }),
          feedingMethod: t.Union(
            [
              t.Literal("MEAL_FED"),
              t.Literal("FREE_CHOICE"),
              t.Literal("COMBINATION"),
            ],
            { additionalProperties: false },
          ),
          mealsPerDay: t.Integer(),
          currentDietSummary: t.String(),
          treatsSummary: t.String(),
          tableFoodSummary: t.String(),
          supplementsSummary: t.String(),
          medicationFoodSummary: t.String(),
          waterSource: t.String(),
          environmentNotes: t.String(),
          currentTreatCaloriePercent: t.Number(),
          calculationWeightKg: t.Number(),
          rerKcal: t.Number(),
          derFactor: t.Number(),
          derFactorSource: t.String(),
          derKcal: t.Number(),
          treatKcalAllowance: t.Number(),
          targetWeeklyRatePercent: t.Number(),
          estimatedWeeks: t.Integer(),
          recheckIntervalDays: t.Integer(),
          nextRecheckAt: t.Date(),
          feedingInstructions: t.String(),
          clinicalNotes: t.String(),
          transitionDays: t.Integer(),
          draftedByAi: t.Boolean(),
          startedAt: t.Date(),
          completedAt: t.Date(),
          discontinuedAt: t.Date(),
          discontinueReason: t.String(),
          editsCount: t.Integer(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "NutritionPlan" },
  ),
);

export const NutritionPlanWhereUnique = t.Recursive(
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
              appointmentId: t.String(),
              prescriberId: t.String(),
              assessedAt: t.Date(),
              currentWeightKg: t.Number(),
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
              idealWeightKg: t.Number(),
              idealWeightSource: t.String(),
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
              medicalConditions: t.Array(t.String(), {
                additionalProperties: false,
              }),
              feedingMethod: t.Union(
                [
                  t.Literal("MEAL_FED"),
                  t.Literal("FREE_CHOICE"),
                  t.Literal("COMBINATION"),
                ],
                { additionalProperties: false },
              ),
              mealsPerDay: t.Integer(),
              currentDietSummary: t.String(),
              treatsSummary: t.String(),
              tableFoodSummary: t.String(),
              supplementsSummary: t.String(),
              medicationFoodSummary: t.String(),
              waterSource: t.String(),
              environmentNotes: t.String(),
              currentTreatCaloriePercent: t.Number(),
              calculationWeightKg: t.Number(),
              rerKcal: t.Number(),
              derFactor: t.Number(),
              derFactorSource: t.String(),
              derKcal: t.Number(),
              treatKcalAllowance: t.Number(),
              targetWeeklyRatePercent: t.Number(),
              estimatedWeeks: t.Integer(),
              recheckIntervalDays: t.Integer(),
              nextRecheckAt: t.Date(),
              feedingInstructions: t.String(),
              clinicalNotes: t.String(),
              transitionDays: t.Integer(),
              draftedByAi: t.Boolean(),
              startedAt: t.Date(),
              completedAt: t.Date(),
              discontinuedAt: t.Date(),
              discontinueReason: t.String(),
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
  { $id: "NutritionPlan" },
);

export const NutritionPlanSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      code: t.Boolean(),
      clinicId: t.Boolean(),
      patientId: t.Boolean(),
      status: t.Boolean(),
      goal: t.Boolean(),
      appointmentId: t.Boolean(),
      prescriberId: t.Boolean(),
      assessedAt: t.Boolean(),
      currentWeightKg: t.Boolean(),
      bodyConditionScore: t.Boolean(),
      muscleConditionScore: t.Boolean(),
      idealWeightKg: t.Boolean(),
      idealWeightSource: t.Boolean(),
      lifeStage: t.Boolean(),
      activity: t.Boolean(),
      isNeutered: t.Boolean(),
      riskFactors: t.Boolean(),
      medicalConditions: t.Boolean(),
      feedingMethod: t.Boolean(),
      mealsPerDay: t.Boolean(),
      currentDietSummary: t.Boolean(),
      treatsSummary: t.Boolean(),
      tableFoodSummary: t.Boolean(),
      supplementsSummary: t.Boolean(),
      medicationFoodSummary: t.Boolean(),
      waterSource: t.Boolean(),
      environmentNotes: t.Boolean(),
      currentTreatCaloriePercent: t.Boolean(),
      calculationWeightKg: t.Boolean(),
      rerKcal: t.Boolean(),
      derFactor: t.Boolean(),
      derFactorSource: t.Boolean(),
      derKcal: t.Boolean(),
      treatKcalAllowance: t.Boolean(),
      targetWeeklyRatePercent: t.Boolean(),
      estimatedWeeks: t.Boolean(),
      recheckIntervalDays: t.Boolean(),
      nextRecheckAt: t.Boolean(),
      feedingInstructions: t.Boolean(),
      clinicalNotes: t.Boolean(),
      transitionDays: t.Boolean(),
      draftedByAi: t.Boolean(),
      startedAt: t.Boolean(),
      completedAt: t.Boolean(),
      discontinuedAt: t.Boolean(),
      discontinueReason: t.Boolean(),
      editsCount: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinic: t.Boolean(),
      patient: t.Boolean(),
      appointment: t.Boolean(),
      prescriber: t.Boolean(),
      items: t.Boolean(),
      rechecks: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const NutritionPlanInclude = t.Partial(
  t.Object(
    {
      status: t.Boolean(),
      goal: t.Boolean(),
      muscleConditionScore: t.Boolean(),
      lifeStage: t.Boolean(),
      activity: t.Boolean(),
      feedingMethod: t.Boolean(),
      clinic: t.Boolean(),
      patient: t.Boolean(),
      appointment: t.Boolean(),
      prescriber: t.Boolean(),
      items: t.Boolean(),
      rechecks: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const NutritionPlanOrderBy = t.Partial(
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
      patientId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      appointmentId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      prescriberId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      assessedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      currentWeightKg: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      bodyConditionScore: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      idealWeightKg: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      idealWeightSource: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      isNeutered: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      riskFactors: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      medicalConditions: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      mealsPerDay: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      currentDietSummary: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      treatsSummary: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      tableFoodSummary: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      supplementsSummary: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      medicationFoodSummary: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      waterSource: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      environmentNotes: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      currentTreatCaloriePercent: t.Union(
        [t.Literal("asc"), t.Literal("desc")],
        { additionalProperties: false },
      ),
      calculationWeightKg: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      rerKcal: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      derFactor: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      derFactorSource: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      derKcal: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      treatKcalAllowance: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      targetWeeklyRatePercent: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      estimatedWeeks: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      recheckIntervalDays: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      nextRecheckAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      feedingInstructions: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clinicalNotes: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      transitionDays: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      draftedByAi: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      startedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      completedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      discontinuedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      discontinueReason: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const NutritionPlan = t.Composite(
  [NutritionPlanPlain, NutritionPlanRelations],
  { additionalProperties: false },
);

export const NutritionPlanInputCreate = t.Composite(
  [NutritionPlanPlainInputCreate, NutritionPlanRelationsInputCreate],
  { additionalProperties: false },
);

export const NutritionPlanInputUpdate = t.Composite(
  [NutritionPlanPlainInputUpdate, NutritionPlanRelationsInputUpdate],
  { additionalProperties: false },
);
