import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const GroomingIntakePlain = t.Object(
  {
    id: t.String(),
    sessionId: t.String(),
    weightKg: __nullable__(t.Number()),
    temperatureC: __nullable__(t.Number()),
    vitalSignsRecordId: __nullable__(t.String()),
    mattingGrade: t.Union(
      [
        t.Literal("NONE"),
        t.Literal("LIGHT"),
        t.Literal("MODERATE"),
        t.Literal("SEVERE"),
        t.Literal("PELTED"),
      ],
      {
        additionalProperties: false,
        description: `درجة تعقّد الفرو — سلّم 0–4 المتعارف عليه في الصناعة.`,
      },
    ),
    coatCondition: t.Union(
      [
        t.Literal("HEALTHY"),
        t.Literal("DRY"),
        t.Literal("GREASY"),
        t.Literal("DANDRUFF"),
        t.Literal("SHEDDING_HEAVY"),
        t.Literal("DAMAGED"),
      ],
      { additionalProperties: false },
    ),
    parasiteFinding: t.Union(
      [
        t.Literal("NONE"),
        t.Literal("FLEAS"),
        t.Literal("TICKS"),
        t.Literal("LICE"),
        t.Literal("MITES_SUSPECTED"),
        t.Literal("MULTIPLE"),
      ],
      {
        additionalProperties: false,
        description: `نتيجة فحص الطفيليات — أي قيمة غير NONE تُفعّل بروتوكول G7.`,
      },
    ),
    skinFindings: t.Array(t.String(), { additionalProperties: false }),
    earCondition: t.Union(
      [
        t.Literal("NORMAL"),
        t.Literal("WAXY"),
        t.Literal("REDNESS"),
        t.Literal("ODOR"),
        t.Literal("DISCHARGE"),
        t.Literal("PAINFUL"),
      ],
      { additionalProperties: false },
    ),
    nailCondition: t.Union(
      [
        t.Literal("NORMAL"),
        t.Literal("OVERGROWN"),
        t.Literal("SPLIT"),
        t.Literal("INGROWN"),
        t.Literal("MISSING"),
      ],
      { additionalProperties: false },
    ),
    dentalNote: __nullable__(t.String()),
    behaviorScore: t.Union(
      [t.Literal("GREEN"), t.Literal("YELLOW"), t.Literal("RED")],
      {
        additionalProperties: false,
        description: `تقييم سلوك التعامل — إشارة مرور.`,
      },
    ),
    muzzleUsed: t.Boolean(),
    rabiesValidUntil: __nullable__(t.Date()),
    vaccinationOverrideReason: __nullable__(t.String()),
    shaveDownRecommended: t.Boolean(),
    shaveDownApprovedAt: __nullable__(t.Date()),
    shaveDownApprovedBy: __nullable__(t.String()),
    heatDryProhibitedSnapshot: t.Boolean(),
    heatDryReasonsSnapshot: t.Array(t.String(), {
      additionalProperties: false,
    }),
    parasiteTreatedAt: __nullable__(t.Date()),
    parasiteOwnerNotifiedAt: __nullable__(t.Date()),
    isolationAcknowledgedAt: __nullable__(t.Date()),
    belongings: t.Array(t.String(), { additionalProperties: false }),
    notes: __nullable__(t.String()),
    performedByStaffId: __nullable__(t.String()),
    performedAt: t.Date(),
  },
  {
    additionalProperties: false,
    description: `الفحص القبلي — بوابة الدخول إلى العمل، ومصدر معظم الرسوم والملاحظات (§4.4)`,
  },
);

export const GroomingIntakeRelations = t.Object(
  {
    session: t.Object(
      {
        id: t.String(),
        code: t.String(),
        clinicId: t.String(),
        branchId: t.String(),
        patientId: t.String(),
        ownerId: t.String(),
        appointmentId: __nullable__(t.String()),
        groomerId: t.String(),
        assistantId: __nullable__(t.String()),
        stationId: __nullable__(t.String()),
        lane: t.Union([t.Literal("COSMETIC"), t.Literal("MEDICAL")], {
          additionalProperties: false,
          description: `مسار الجلسة — تجميلي أم طبي. يقرّر أي البوابات إلزامية وأي اللوحات تظهر (§3).`,
        }),
        status: t.Union(
          [
            t.Literal("SCHEDULED"),
            t.Literal("CHECK_IN"),
            t.Literal("INTAKE"),
            t.Literal("IN_PROGRESS"),
            t.Literal("FINISHING"),
            t.Literal("READY"),
            t.Literal("PICKED_UP"),
            t.Literal("COMPLETED"),
            t.Literal("CANCELLED"),
            t.Literal("NO_SHOW"),
            t.Literal("ESCALATED"),
          ],
          {
            additionalProperties: false,
            description: `أعمدة لوحة التجميل (§6.1).`,
          },
        ),
        stage: __nullable__(
          t.Union(
            [
              t.Literal("QUOTE_APPROVAL"),
              t.Literal("BATH"),
              t.Literal("DRYING"),
              t.Literal("CLIP"),
              t.Literal("SCISSOR"),
              t.Literal("NAILS_EARS"),
              t.Literal("FINISH_CHECK"),
              t.Literal("PHOTOS"),
            ],
            {
              additionalProperties: false,
              description: `المرحلة الفرعية داخل الجلسة — تقود لوحة العمل.`,
            },
          ),
        ),
        vetOrderStaffId: __nullable__(t.String()),
        vetOrderNote: __nullable__(t.String()),
        sedationPlanned: t.Boolean(),
        scheduledAt: t.Date(),
        dropOffAt: __nullable__(t.Date()),
        estimatedDurationMin: t.Integer(),
        estimatedDryingMin: t.Integer(),
        promisedReadyAt: __nullable__(t.Date()),
        checkedInAt: __nullable__(t.Date()),
        startedAt: __nullable__(t.Date()),
        dryingStartedAt: __nullable__(t.Date()),
        readyAt: __nullable__(t.Date()),
        pickedUpAt: __nullable__(t.Date()),
        completedAt: __nullable__(t.Date()),
        dryingMethod: __nullable__(
          t.Union(
            [
              t.Literal("HAND_ROOM_TEMP"),
              t.Literal("FAN_ONLY"),
              t.Literal("CAGE_UNHEATED"),
              t.Literal("FORCED_AIR"),
              t.Literal("CAGE_HEATED"),
            ],
            {
              additionalProperties: false,
              description: `طريقة التجفيف — البوابة G5 ترفض CAGE_HEATED للحيوانات الممنوعة من الحرارة،
بلا أي مسار تجاوز. المرجع: إرشادات AAHA وصناعة التجميل حول قصيري الخطم.`,
            },
          ),
        ),
        quoteSubtotal: t.Number(),
        quoteAdjustments: t.Number(),
        quoteTotal: t.Number(),
        bookedQuoteTotal: t.Number(),
        ownerApprovedQuoteAt: __nullable__(t.Date()),
        cancelKind: __nullable__(
          t.Union(
            [
              t.Literal("OWNER_CANCELLED"),
              t.Literal("CLINIC_CANCELLED"),
              t.Literal("NO_SHOW"),
              t.Literal("HEALTH_REFUSAL"),
              t.Literal("BEHAVIOR_REFUSAL"),
            ],
            {
              additionalProperties: false,
              description: `سبب إنهاء الجلسة قبل أوانها`,
            },
          ),
        ),
        cancelReason: __nullable__(t.String()),
        isDeleted: t.Boolean(),
        deletedAt: __nullable__(t.Date()),
        createdAt: t.Date(),
        updatedAt: t.Date(),
      },
      {
        additionalProperties: false,
        description: `جلسة التجميل — الكيان المركزي. مسار واحد لكل الجلسات، والمسار (lane) يقرّر
أي البوابات إلزامية لا أي الأعمدة تظهر (الخطة §4.3، §6).`,
      },
    ),
  },
  {
    additionalProperties: false,
    description: `الفحص القبلي — بوابة الدخول إلى العمل، ومصدر معظم الرسوم والملاحظات (§4.4)`,
  },
);

export const GroomingIntakePlainInputCreate = t.Object(
  {
    weightKg: t.Optional(__nullable__(t.Number())),
    temperatureC: t.Optional(__nullable__(t.Number())),
    mattingGrade: t.Optional(
      t.Union(
        [
          t.Literal("NONE"),
          t.Literal("LIGHT"),
          t.Literal("MODERATE"),
          t.Literal("SEVERE"),
          t.Literal("PELTED"),
        ],
        {
          additionalProperties: false,
          description: `درجة تعقّد الفرو — سلّم 0–4 المتعارف عليه في الصناعة.`,
        },
      ),
    ),
    coatCondition: t.Optional(
      t.Union(
        [
          t.Literal("HEALTHY"),
          t.Literal("DRY"),
          t.Literal("GREASY"),
          t.Literal("DANDRUFF"),
          t.Literal("SHEDDING_HEAVY"),
          t.Literal("DAMAGED"),
        ],
        { additionalProperties: false },
      ),
    ),
    parasiteFinding: t.Optional(
      t.Union(
        [
          t.Literal("NONE"),
          t.Literal("FLEAS"),
          t.Literal("TICKS"),
          t.Literal("LICE"),
          t.Literal("MITES_SUSPECTED"),
          t.Literal("MULTIPLE"),
        ],
        {
          additionalProperties: false,
          description: `نتيجة فحص الطفيليات — أي قيمة غير NONE تُفعّل بروتوكول G7.`,
        },
      ),
    ),
    skinFindings: t.Array(t.String(), { additionalProperties: false }),
    earCondition: t.Optional(
      t.Union(
        [
          t.Literal("NORMAL"),
          t.Literal("WAXY"),
          t.Literal("REDNESS"),
          t.Literal("ODOR"),
          t.Literal("DISCHARGE"),
          t.Literal("PAINFUL"),
        ],
        { additionalProperties: false },
      ),
    ),
    nailCondition: t.Optional(
      t.Union(
        [
          t.Literal("NORMAL"),
          t.Literal("OVERGROWN"),
          t.Literal("SPLIT"),
          t.Literal("INGROWN"),
          t.Literal("MISSING"),
        ],
        { additionalProperties: false },
      ),
    ),
    dentalNote: t.Optional(__nullable__(t.String())),
    behaviorScore: t.Optional(
      t.Union([t.Literal("GREEN"), t.Literal("YELLOW"), t.Literal("RED")], {
        additionalProperties: false,
        description: `تقييم سلوك التعامل — إشارة مرور.`,
      }),
    ),
    muzzleUsed: t.Optional(t.Boolean()),
    rabiesValidUntil: t.Optional(__nullable__(t.Date())),
    vaccinationOverrideReason: t.Optional(__nullable__(t.String())),
    shaveDownRecommended: t.Optional(t.Boolean()),
    shaveDownApprovedAt: t.Optional(__nullable__(t.Date())),
    shaveDownApprovedBy: t.Optional(__nullable__(t.String())),
    heatDryProhibitedSnapshot: t.Optional(t.Boolean()),
    heatDryReasonsSnapshot: t.Array(t.String(), {
      additionalProperties: false,
    }),
    parasiteTreatedAt: t.Optional(__nullable__(t.Date())),
    parasiteOwnerNotifiedAt: t.Optional(__nullable__(t.Date())),
    isolationAcknowledgedAt: t.Optional(__nullable__(t.Date())),
    belongings: t.Array(t.String(), { additionalProperties: false }),
    notes: t.Optional(__nullable__(t.String())),
    performedAt: t.Optional(t.Date()),
  },
  {
    additionalProperties: false,
    description: `الفحص القبلي — بوابة الدخول إلى العمل، ومصدر معظم الرسوم والملاحظات (§4.4)`,
  },
);

export const GroomingIntakePlainInputUpdate = t.Object(
  {
    weightKg: t.Optional(__nullable__(t.Number())),
    temperatureC: t.Optional(__nullable__(t.Number())),
    mattingGrade: t.Optional(
      t.Union(
        [
          t.Literal("NONE"),
          t.Literal("LIGHT"),
          t.Literal("MODERATE"),
          t.Literal("SEVERE"),
          t.Literal("PELTED"),
        ],
        {
          additionalProperties: false,
          description: `درجة تعقّد الفرو — سلّم 0–4 المتعارف عليه في الصناعة.`,
        },
      ),
    ),
    coatCondition: t.Optional(
      t.Union(
        [
          t.Literal("HEALTHY"),
          t.Literal("DRY"),
          t.Literal("GREASY"),
          t.Literal("DANDRUFF"),
          t.Literal("SHEDDING_HEAVY"),
          t.Literal("DAMAGED"),
        ],
        { additionalProperties: false },
      ),
    ),
    parasiteFinding: t.Optional(
      t.Union(
        [
          t.Literal("NONE"),
          t.Literal("FLEAS"),
          t.Literal("TICKS"),
          t.Literal("LICE"),
          t.Literal("MITES_SUSPECTED"),
          t.Literal("MULTIPLE"),
        ],
        {
          additionalProperties: false,
          description: `نتيجة فحص الطفيليات — أي قيمة غير NONE تُفعّل بروتوكول G7.`,
        },
      ),
    ),
    skinFindings: t.Optional(
      t.Array(t.String(), { additionalProperties: false }),
    ),
    earCondition: t.Optional(
      t.Union(
        [
          t.Literal("NORMAL"),
          t.Literal("WAXY"),
          t.Literal("REDNESS"),
          t.Literal("ODOR"),
          t.Literal("DISCHARGE"),
          t.Literal("PAINFUL"),
        ],
        { additionalProperties: false },
      ),
    ),
    nailCondition: t.Optional(
      t.Union(
        [
          t.Literal("NORMAL"),
          t.Literal("OVERGROWN"),
          t.Literal("SPLIT"),
          t.Literal("INGROWN"),
          t.Literal("MISSING"),
        ],
        { additionalProperties: false },
      ),
    ),
    dentalNote: t.Optional(__nullable__(t.String())),
    behaviorScore: t.Optional(
      t.Union([t.Literal("GREEN"), t.Literal("YELLOW"), t.Literal("RED")], {
        additionalProperties: false,
        description: `تقييم سلوك التعامل — إشارة مرور.`,
      }),
    ),
    muzzleUsed: t.Optional(t.Boolean()),
    rabiesValidUntil: t.Optional(__nullable__(t.Date())),
    vaccinationOverrideReason: t.Optional(__nullable__(t.String())),
    shaveDownRecommended: t.Optional(t.Boolean()),
    shaveDownApprovedAt: t.Optional(__nullable__(t.Date())),
    shaveDownApprovedBy: t.Optional(__nullable__(t.String())),
    heatDryProhibitedSnapshot: t.Optional(t.Boolean()),
    heatDryReasonsSnapshot: t.Optional(
      t.Array(t.String(), { additionalProperties: false }),
    ),
    parasiteTreatedAt: t.Optional(__nullable__(t.Date())),
    parasiteOwnerNotifiedAt: t.Optional(__nullable__(t.Date())),
    isolationAcknowledgedAt: t.Optional(__nullable__(t.Date())),
    belongings: t.Optional(
      t.Array(t.String(), { additionalProperties: false }),
    ),
    notes: t.Optional(__nullable__(t.String())),
    performedAt: t.Optional(t.Date()),
  },
  {
    additionalProperties: false,
    description: `الفحص القبلي — بوابة الدخول إلى العمل، ومصدر معظم الرسوم والملاحظات (§4.4)`,
  },
);

export const GroomingIntakeRelationsInputCreate = t.Object(
  {
    session: t.Object(
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
  {
    additionalProperties: false,
    description: `الفحص القبلي — بوابة الدخول إلى العمل، ومصدر معظم الرسوم والملاحظات (§4.4)`,
  },
);

export const GroomingIntakeRelationsInputUpdate = t.Partial(
  t.Object(
    {
      session: t.Object(
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
    {
      additionalProperties: false,
      description: `الفحص القبلي — بوابة الدخول إلى العمل، ومصدر معظم الرسوم والملاحظات (§4.4)`,
    },
  ),
);

export const GroomingIntakeWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          sessionId: t.String(),
          weightKg: t.Number(),
          temperatureC: t.Number(),
          vitalSignsRecordId: t.String(),
          mattingGrade: t.Union(
            [
              t.Literal("NONE"),
              t.Literal("LIGHT"),
              t.Literal("MODERATE"),
              t.Literal("SEVERE"),
              t.Literal("PELTED"),
            ],
            {
              additionalProperties: false,
              description: `درجة تعقّد الفرو — سلّم 0–4 المتعارف عليه في الصناعة.`,
            },
          ),
          coatCondition: t.Union(
            [
              t.Literal("HEALTHY"),
              t.Literal("DRY"),
              t.Literal("GREASY"),
              t.Literal("DANDRUFF"),
              t.Literal("SHEDDING_HEAVY"),
              t.Literal("DAMAGED"),
            ],
            { additionalProperties: false },
          ),
          parasiteFinding: t.Union(
            [
              t.Literal("NONE"),
              t.Literal("FLEAS"),
              t.Literal("TICKS"),
              t.Literal("LICE"),
              t.Literal("MITES_SUSPECTED"),
              t.Literal("MULTIPLE"),
            ],
            {
              additionalProperties: false,
              description: `نتيجة فحص الطفيليات — أي قيمة غير NONE تُفعّل بروتوكول G7.`,
            },
          ),
          skinFindings: t.Array(t.String(), { additionalProperties: false }),
          earCondition: t.Union(
            [
              t.Literal("NORMAL"),
              t.Literal("WAXY"),
              t.Literal("REDNESS"),
              t.Literal("ODOR"),
              t.Literal("DISCHARGE"),
              t.Literal("PAINFUL"),
            ],
            { additionalProperties: false },
          ),
          nailCondition: t.Union(
            [
              t.Literal("NORMAL"),
              t.Literal("OVERGROWN"),
              t.Literal("SPLIT"),
              t.Literal("INGROWN"),
              t.Literal("MISSING"),
            ],
            { additionalProperties: false },
          ),
          dentalNote: t.String(),
          behaviorScore: t.Union(
            [t.Literal("GREEN"), t.Literal("YELLOW"), t.Literal("RED")],
            {
              additionalProperties: false,
              description: `تقييم سلوك التعامل — إشارة مرور.`,
            },
          ),
          muzzleUsed: t.Boolean(),
          rabiesValidUntil: t.Date(),
          vaccinationOverrideReason: t.String(),
          shaveDownRecommended: t.Boolean(),
          shaveDownApprovedAt: t.Date(),
          shaveDownApprovedBy: t.String(),
          heatDryProhibitedSnapshot: t.Boolean(),
          heatDryReasonsSnapshot: t.Array(t.String(), {
            additionalProperties: false,
          }),
          parasiteTreatedAt: t.Date(),
          parasiteOwnerNotifiedAt: t.Date(),
          isolationAcknowledgedAt: t.Date(),
          belongings: t.Array(t.String(), { additionalProperties: false }),
          notes: t.String(),
          performedByStaffId: t.String(),
          performedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `الفحص القبلي — بوابة الدخول إلى العمل، ومصدر معظم الرسوم والملاحظات (§4.4)`,
        },
      ),
    { $id: "GroomingIntake" },
  ),
);

export const GroomingIntakeWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.String(), sessionId: t.String() },
            {
              additionalProperties: false,
              description: `الفحص القبلي — بوابة الدخول إلى العمل، ومصدر معظم الرسوم والملاحظات (§4.4)`,
            },
          ),
          { additionalProperties: false },
        ),
        t.Union(
          [t.Object({ id: t.String() }), t.Object({ sessionId: t.String() })],
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
              sessionId: t.String(),
              weightKg: t.Number(),
              temperatureC: t.Number(),
              vitalSignsRecordId: t.String(),
              mattingGrade: t.Union(
                [
                  t.Literal("NONE"),
                  t.Literal("LIGHT"),
                  t.Literal("MODERATE"),
                  t.Literal("SEVERE"),
                  t.Literal("PELTED"),
                ],
                {
                  additionalProperties: false,
                  description: `درجة تعقّد الفرو — سلّم 0–4 المتعارف عليه في الصناعة.`,
                },
              ),
              coatCondition: t.Union(
                [
                  t.Literal("HEALTHY"),
                  t.Literal("DRY"),
                  t.Literal("GREASY"),
                  t.Literal("DANDRUFF"),
                  t.Literal("SHEDDING_HEAVY"),
                  t.Literal("DAMAGED"),
                ],
                { additionalProperties: false },
              ),
              parasiteFinding: t.Union(
                [
                  t.Literal("NONE"),
                  t.Literal("FLEAS"),
                  t.Literal("TICKS"),
                  t.Literal("LICE"),
                  t.Literal("MITES_SUSPECTED"),
                  t.Literal("MULTIPLE"),
                ],
                {
                  additionalProperties: false,
                  description: `نتيجة فحص الطفيليات — أي قيمة غير NONE تُفعّل بروتوكول G7.`,
                },
              ),
              skinFindings: t.Array(t.String(), {
                additionalProperties: false,
              }),
              earCondition: t.Union(
                [
                  t.Literal("NORMAL"),
                  t.Literal("WAXY"),
                  t.Literal("REDNESS"),
                  t.Literal("ODOR"),
                  t.Literal("DISCHARGE"),
                  t.Literal("PAINFUL"),
                ],
                { additionalProperties: false },
              ),
              nailCondition: t.Union(
                [
                  t.Literal("NORMAL"),
                  t.Literal("OVERGROWN"),
                  t.Literal("SPLIT"),
                  t.Literal("INGROWN"),
                  t.Literal("MISSING"),
                ],
                { additionalProperties: false },
              ),
              dentalNote: t.String(),
              behaviorScore: t.Union(
                [t.Literal("GREEN"), t.Literal("YELLOW"), t.Literal("RED")],
                {
                  additionalProperties: false,
                  description: `تقييم سلوك التعامل — إشارة مرور.`,
                },
              ),
              muzzleUsed: t.Boolean(),
              rabiesValidUntil: t.Date(),
              vaccinationOverrideReason: t.String(),
              shaveDownRecommended: t.Boolean(),
              shaveDownApprovedAt: t.Date(),
              shaveDownApprovedBy: t.String(),
              heatDryProhibitedSnapshot: t.Boolean(),
              heatDryReasonsSnapshot: t.Array(t.String(), {
                additionalProperties: false,
              }),
              parasiteTreatedAt: t.Date(),
              parasiteOwnerNotifiedAt: t.Date(),
              isolationAcknowledgedAt: t.Date(),
              belongings: t.Array(t.String(), { additionalProperties: false }),
              notes: t.String(),
              performedByStaffId: t.String(),
              performedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "GroomingIntake" },
);

export const GroomingIntakeSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      sessionId: t.Boolean(),
      weightKg: t.Boolean(),
      temperatureC: t.Boolean(),
      vitalSignsRecordId: t.Boolean(),
      mattingGrade: t.Boolean(),
      coatCondition: t.Boolean(),
      parasiteFinding: t.Boolean(),
      skinFindings: t.Boolean(),
      earCondition: t.Boolean(),
      nailCondition: t.Boolean(),
      dentalNote: t.Boolean(),
      behaviorScore: t.Boolean(),
      muzzleUsed: t.Boolean(),
      rabiesValidUntil: t.Boolean(),
      vaccinationOverrideReason: t.Boolean(),
      shaveDownRecommended: t.Boolean(),
      shaveDownApprovedAt: t.Boolean(),
      shaveDownApprovedBy: t.Boolean(),
      heatDryProhibitedSnapshot: t.Boolean(),
      heatDryReasonsSnapshot: t.Boolean(),
      parasiteTreatedAt: t.Boolean(),
      parasiteOwnerNotifiedAt: t.Boolean(),
      isolationAcknowledgedAt: t.Boolean(),
      belongings: t.Boolean(),
      notes: t.Boolean(),
      performedByStaffId: t.Boolean(),
      performedAt: t.Boolean(),
      session: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `الفحص القبلي — بوابة الدخول إلى العمل، ومصدر معظم الرسوم والملاحظات (§4.4)`,
    },
  ),
);

export const GroomingIntakeInclude = t.Partial(
  t.Object(
    {
      mattingGrade: t.Boolean(),
      coatCondition: t.Boolean(),
      parasiteFinding: t.Boolean(),
      earCondition: t.Boolean(),
      nailCondition: t.Boolean(),
      behaviorScore: t.Boolean(),
      session: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `الفحص القبلي — بوابة الدخول إلى العمل، ومصدر معظم الرسوم والملاحظات (§4.4)`,
    },
  ),
);

export const GroomingIntakeOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      sessionId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      weightKg: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      temperatureC: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      vitalSignsRecordId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      skinFindings: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      dentalNote: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      muzzleUsed: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      rabiesValidUntil: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      vaccinationOverrideReason: t.Union(
        [t.Literal("asc"), t.Literal("desc")],
        { additionalProperties: false },
      ),
      shaveDownRecommended: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      shaveDownApprovedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      shaveDownApprovedBy: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      heatDryProhibitedSnapshot: t.Union(
        [t.Literal("asc"), t.Literal("desc")],
        { additionalProperties: false },
      ),
      heatDryReasonsSnapshot: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      parasiteTreatedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      parasiteOwnerNotifiedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      isolationAcknowledgedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      belongings: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      notes: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      performedByStaffId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      performedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    {
      additionalProperties: false,
      description: `الفحص القبلي — بوابة الدخول إلى العمل، ومصدر معظم الرسوم والملاحظات (§4.4)`,
    },
  ),
);

export const GroomingIntake = t.Composite(
  [GroomingIntakePlain, GroomingIntakeRelations],
  { additionalProperties: false },
);

export const GroomingIntakeInputCreate = t.Composite(
  [GroomingIntakePlainInputCreate, GroomingIntakeRelationsInputCreate],
  { additionalProperties: false },
);

export const GroomingIntakeInputUpdate = t.Composite(
  [GroomingIntakePlainInputUpdate, GroomingIntakeRelationsInputUpdate],
  { additionalProperties: false },
);
