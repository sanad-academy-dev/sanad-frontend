import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const GroomingReportCardPlain = t.Object(
  {
    id: t.String(),
    sessionId: t.String(),
    summary: t.String(),
    moodScore: t.Union(
      [
        t.Literal("CALM"),
        t.Literal("HAPPY"),
        t.Literal("ANXIOUS"),
        t.Literal("STRESSED"),
        t.Literal("AGGRESSIVE"),
      ],
      { additionalProperties: false },
    ),
    recommendedIntervalWeeks: __nullable__(t.Integer()),
    nextRecommendedAt: __nullable__(t.Date()),
    publicToken: t.String(),
    sentAt: __nullable__(t.Date()),
    channel: __nullable__(
      t.Union(
        [
          t.Literal("WHATSAPP"),
          t.Literal("EMAIL"),
          t.Literal("SMS"),
          t.Literal("IN_APP"),
          t.Literal("PRINTED"),
        ],
        { additionalProperties: false },
      ),
    ),
    rebookedAppointmentId: __nullable__(t.String()),
    rebookedSessionId: __nullable__(t.String()),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  },
  {
    additionalProperties: false,
    description: `تقرير الجلسة للمالك — صور قبل/بعد وما جرى وموعد الاستحقاق القادم، برابط
عام لا يكشف غير هذه الجلسة. إعادة الحجز منه تُسجَّل ليصير معدّل العودة قياسًا.`,
  },
);

export const GroomingReportCardRelations = t.Object(
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
    description: `تقرير الجلسة للمالك — صور قبل/بعد وما جرى وموعد الاستحقاق القادم، برابط
عام لا يكشف غير هذه الجلسة. إعادة الحجز منه تُسجَّل ليصير معدّل العودة قياسًا.`,
  },
);

export const GroomingReportCardPlainInputCreate = t.Object(
  {
    summary: t.String(),
    moodScore: t.Optional(
      t.Union(
        [
          t.Literal("CALM"),
          t.Literal("HAPPY"),
          t.Literal("ANXIOUS"),
          t.Literal("STRESSED"),
          t.Literal("AGGRESSIVE"),
        ],
        { additionalProperties: false },
      ),
    ),
    recommendedIntervalWeeks: t.Optional(__nullable__(t.Integer())),
    nextRecommendedAt: t.Optional(__nullable__(t.Date())),
    publicToken: t.String(),
    sentAt: t.Optional(__nullable__(t.Date())),
    channel: t.Optional(
      __nullable__(
        t.Union(
          [
            t.Literal("WHATSAPP"),
            t.Literal("EMAIL"),
            t.Literal("SMS"),
            t.Literal("IN_APP"),
            t.Literal("PRINTED"),
          ],
          { additionalProperties: false },
        ),
      ),
    ),
  },
  {
    additionalProperties: false,
    description: `تقرير الجلسة للمالك — صور قبل/بعد وما جرى وموعد الاستحقاق القادم، برابط
عام لا يكشف غير هذه الجلسة. إعادة الحجز منه تُسجَّل ليصير معدّل العودة قياسًا.`,
  },
);

export const GroomingReportCardPlainInputUpdate = t.Object(
  {
    summary: t.Optional(t.String()),
    moodScore: t.Optional(
      t.Union(
        [
          t.Literal("CALM"),
          t.Literal("HAPPY"),
          t.Literal("ANXIOUS"),
          t.Literal("STRESSED"),
          t.Literal("AGGRESSIVE"),
        ],
        { additionalProperties: false },
      ),
    ),
    recommendedIntervalWeeks: t.Optional(__nullable__(t.Integer())),
    nextRecommendedAt: t.Optional(__nullable__(t.Date())),
    publicToken: t.Optional(t.String()),
    sentAt: t.Optional(__nullable__(t.Date())),
    channel: t.Optional(
      __nullable__(
        t.Union(
          [
            t.Literal("WHATSAPP"),
            t.Literal("EMAIL"),
            t.Literal("SMS"),
            t.Literal("IN_APP"),
            t.Literal("PRINTED"),
          ],
          { additionalProperties: false },
        ),
      ),
    ),
  },
  {
    additionalProperties: false,
    description: `تقرير الجلسة للمالك — صور قبل/بعد وما جرى وموعد الاستحقاق القادم، برابط
عام لا يكشف غير هذه الجلسة. إعادة الحجز منه تُسجَّل ليصير معدّل العودة قياسًا.`,
  },
);

export const GroomingReportCardRelationsInputCreate = t.Object(
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
    description: `تقرير الجلسة للمالك — صور قبل/بعد وما جرى وموعد الاستحقاق القادم، برابط
عام لا يكشف غير هذه الجلسة. إعادة الحجز منه تُسجَّل ليصير معدّل العودة قياسًا.`,
  },
);

export const GroomingReportCardRelationsInputUpdate = t.Partial(
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
      description: `تقرير الجلسة للمالك — صور قبل/بعد وما جرى وموعد الاستحقاق القادم، برابط
عام لا يكشف غير هذه الجلسة. إعادة الحجز منه تُسجَّل ليصير معدّل العودة قياسًا.`,
    },
  ),
);

export const GroomingReportCardWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          sessionId: t.String(),
          summary: t.String(),
          moodScore: t.Union(
            [
              t.Literal("CALM"),
              t.Literal("HAPPY"),
              t.Literal("ANXIOUS"),
              t.Literal("STRESSED"),
              t.Literal("AGGRESSIVE"),
            ],
            { additionalProperties: false },
          ),
          recommendedIntervalWeeks: t.Integer(),
          nextRecommendedAt: t.Date(),
          publicToken: t.String(),
          sentAt: t.Date(),
          channel: t.Union(
            [
              t.Literal("WHATSAPP"),
              t.Literal("EMAIL"),
              t.Literal("SMS"),
              t.Literal("IN_APP"),
              t.Literal("PRINTED"),
            ],
            { additionalProperties: false },
          ),
          rebookedAppointmentId: t.String(),
          rebookedSessionId: t.String(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `تقرير الجلسة للمالك — صور قبل/بعد وما جرى وموعد الاستحقاق القادم، برابط
عام لا يكشف غير هذه الجلسة. إعادة الحجز منه تُسجَّل ليصير معدّل العودة قياسًا.`,
        },
      ),
    { $id: "GroomingReportCard" },
  ),
);

export const GroomingReportCardWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.String(), sessionId: t.String(), publicToken: t.String() },
            {
              additionalProperties: false,
              description: `تقرير الجلسة للمالك — صور قبل/بعد وما جرى وموعد الاستحقاق القادم، برابط
عام لا يكشف غير هذه الجلسة. إعادة الحجز منه تُسجَّل ليصير معدّل العودة قياسًا.`,
            },
          ),
          { additionalProperties: false },
        ),
        t.Union(
          [
            t.Object({ id: t.String() }),
            t.Object({ sessionId: t.String() }),
            t.Object({ publicToken: t.String() }),
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
              sessionId: t.String(),
              summary: t.String(),
              moodScore: t.Union(
                [
                  t.Literal("CALM"),
                  t.Literal("HAPPY"),
                  t.Literal("ANXIOUS"),
                  t.Literal("STRESSED"),
                  t.Literal("AGGRESSIVE"),
                ],
                { additionalProperties: false },
              ),
              recommendedIntervalWeeks: t.Integer(),
              nextRecommendedAt: t.Date(),
              publicToken: t.String(),
              sentAt: t.Date(),
              channel: t.Union(
                [
                  t.Literal("WHATSAPP"),
                  t.Literal("EMAIL"),
                  t.Literal("SMS"),
                  t.Literal("IN_APP"),
                  t.Literal("PRINTED"),
                ],
                { additionalProperties: false },
              ),
              rebookedAppointmentId: t.String(),
              rebookedSessionId: t.String(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "GroomingReportCard" },
);

export const GroomingReportCardSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      sessionId: t.Boolean(),
      summary: t.Boolean(),
      moodScore: t.Boolean(),
      recommendedIntervalWeeks: t.Boolean(),
      nextRecommendedAt: t.Boolean(),
      publicToken: t.Boolean(),
      sentAt: t.Boolean(),
      channel: t.Boolean(),
      rebookedAppointmentId: t.Boolean(),
      rebookedSessionId: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      session: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `تقرير الجلسة للمالك — صور قبل/بعد وما جرى وموعد الاستحقاق القادم، برابط
عام لا يكشف غير هذه الجلسة. إعادة الحجز منه تُسجَّل ليصير معدّل العودة قياسًا.`,
    },
  ),
);

export const GroomingReportCardInclude = t.Partial(
  t.Object(
    {
      moodScore: t.Boolean(),
      channel: t.Boolean(),
      session: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `تقرير الجلسة للمالك — صور قبل/بعد وما جرى وموعد الاستحقاق القادم، برابط
عام لا يكشف غير هذه الجلسة. إعادة الحجز منه تُسجَّل ليصير معدّل العودة قياسًا.`,
    },
  ),
);

export const GroomingReportCardOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      sessionId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      summary: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      recommendedIntervalWeeks: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      nextRecommendedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      publicToken: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      sentAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      rebookedAppointmentId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      rebookedSessionId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      updatedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    {
      additionalProperties: false,
      description: `تقرير الجلسة للمالك — صور قبل/بعد وما جرى وموعد الاستحقاق القادم، برابط
عام لا يكشف غير هذه الجلسة. إعادة الحجز منه تُسجَّل ليصير معدّل العودة قياسًا.`,
    },
  ),
);

export const GroomingReportCard = t.Composite(
  [GroomingReportCardPlain, GroomingReportCardRelations],
  { additionalProperties: false },
);

export const GroomingReportCardInputCreate = t.Composite(
  [GroomingReportCardPlainInputCreate, GroomingReportCardRelationsInputCreate],
  { additionalProperties: false },
);

export const GroomingReportCardInputUpdate = t.Composite(
  [GroomingReportCardPlainInputUpdate, GroomingReportCardRelationsInputUpdate],
  { additionalProperties: false },
);
