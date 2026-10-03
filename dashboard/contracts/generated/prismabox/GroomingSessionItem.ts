import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const GroomingSessionItemPlain = t.Object(
  {
    id: t.String(),
    sessionId: t.String(),
    definitionId: __nullable__(t.String()),
    serviceId: __nullable__(t.String()),
    nameSnapshot: t.String(),
    laneSnapshot: t.Union([t.Literal("COSMETIC"), t.Literal("MEDICAL")], {
      additionalProperties: false,
      description: `مسار الجلسة — تجميلي أم طبي. يقرّر أي البوابات إلزامية وأي اللوحات تظهر (§3).`,
    }),
    priceSnapshot: t.Number(),
    durationSnapshot: t.Integer(),
    dryingSnapshot: t.Integer(),
    priceLevelSnapshot: __nullable__(t.String()),
    matchedRuleId: __nullable__(t.String()),
    quantity: t.Integer(),
    performed: t.Boolean(),
    performedByStaffId: __nullable__(t.String()),
    notes: __nullable__(t.String()),
    createdAt: t.Date(),
  },
  {
    additionalProperties: false,
    description: `بند خدمة داخل الجلسة — لقطات وقت الإضافة: الكتالوج يتغيّر والجلسة لا`,
  },
);

export const GroomingSessionItemRelations = t.Object(
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
    description: `بند خدمة داخل الجلسة — لقطات وقت الإضافة: الكتالوج يتغيّر والجلسة لا`,
  },
);

export const GroomingSessionItemPlainInputCreate = t.Object(
  {
    nameSnapshot: t.String(),
    laneSnapshot: t.Optional(
      t.Union([t.Literal("COSMETIC"), t.Literal("MEDICAL")], {
        additionalProperties: false,
        description: `مسار الجلسة — تجميلي أم طبي. يقرّر أي البوابات إلزامية وأي اللوحات تظهر (§3).`,
      }),
    ),
    priceSnapshot: t.Number(),
    durationSnapshot: t.Integer(),
    dryingSnapshot: t.Optional(t.Integer()),
    priceLevelSnapshot: t.Optional(__nullable__(t.String())),
    quantity: t.Optional(t.Integer()),
    performed: t.Optional(t.Boolean()),
    notes: t.Optional(__nullable__(t.String())),
  },
  {
    additionalProperties: false,
    description: `بند خدمة داخل الجلسة — لقطات وقت الإضافة: الكتالوج يتغيّر والجلسة لا`,
  },
);

export const GroomingSessionItemPlainInputUpdate = t.Object(
  {
    nameSnapshot: t.Optional(t.String()),
    laneSnapshot: t.Optional(
      t.Union([t.Literal("COSMETIC"), t.Literal("MEDICAL")], {
        additionalProperties: false,
        description: `مسار الجلسة — تجميلي أم طبي. يقرّر أي البوابات إلزامية وأي اللوحات تظهر (§3).`,
      }),
    ),
    priceSnapshot: t.Optional(t.Number()),
    durationSnapshot: t.Optional(t.Integer()),
    dryingSnapshot: t.Optional(t.Integer()),
    priceLevelSnapshot: t.Optional(__nullable__(t.String())),
    quantity: t.Optional(t.Integer()),
    performed: t.Optional(t.Boolean()),
    notes: t.Optional(__nullable__(t.String())),
  },
  {
    additionalProperties: false,
    description: `بند خدمة داخل الجلسة — لقطات وقت الإضافة: الكتالوج يتغيّر والجلسة لا`,
  },
);

export const GroomingSessionItemRelationsInputCreate = t.Object(
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
    description: `بند خدمة داخل الجلسة — لقطات وقت الإضافة: الكتالوج يتغيّر والجلسة لا`,
  },
);

export const GroomingSessionItemRelationsInputUpdate = t.Partial(
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
      description: `بند خدمة داخل الجلسة — لقطات وقت الإضافة: الكتالوج يتغيّر والجلسة لا`,
    },
  ),
);

export const GroomingSessionItemWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          sessionId: t.String(),
          definitionId: t.String(),
          serviceId: t.String(),
          nameSnapshot: t.String(),
          laneSnapshot: t.Union([t.Literal("COSMETIC"), t.Literal("MEDICAL")], {
            additionalProperties: false,
            description: `مسار الجلسة — تجميلي أم طبي. يقرّر أي البوابات إلزامية وأي اللوحات تظهر (§3).`,
          }),
          priceSnapshot: t.Number(),
          durationSnapshot: t.Integer(),
          dryingSnapshot: t.Integer(),
          priceLevelSnapshot: t.String(),
          matchedRuleId: t.String(),
          quantity: t.Integer(),
          performed: t.Boolean(),
          performedByStaffId: t.String(),
          notes: t.String(),
          createdAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `بند خدمة داخل الجلسة — لقطات وقت الإضافة: الكتالوج يتغيّر والجلسة لا`,
        },
      ),
    { $id: "GroomingSessionItem" },
  ),
);

export const GroomingSessionItemWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.String() },
            {
              additionalProperties: false,
              description: `بند خدمة داخل الجلسة — لقطات وقت الإضافة: الكتالوج يتغيّر والجلسة لا`,
            },
          ),
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
              sessionId: t.String(),
              definitionId: t.String(),
              serviceId: t.String(),
              nameSnapshot: t.String(),
              laneSnapshot: t.Union(
                [t.Literal("COSMETIC"), t.Literal("MEDICAL")],
                {
                  additionalProperties: false,
                  description: `مسار الجلسة — تجميلي أم طبي. يقرّر أي البوابات إلزامية وأي اللوحات تظهر (§3).`,
                },
              ),
              priceSnapshot: t.Number(),
              durationSnapshot: t.Integer(),
              dryingSnapshot: t.Integer(),
              priceLevelSnapshot: t.String(),
              matchedRuleId: t.String(),
              quantity: t.Integer(),
              performed: t.Boolean(),
              performedByStaffId: t.String(),
              notes: t.String(),
              createdAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "GroomingSessionItem" },
);

export const GroomingSessionItemSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      sessionId: t.Boolean(),
      definitionId: t.Boolean(),
      serviceId: t.Boolean(),
      nameSnapshot: t.Boolean(),
      laneSnapshot: t.Boolean(),
      priceSnapshot: t.Boolean(),
      durationSnapshot: t.Boolean(),
      dryingSnapshot: t.Boolean(),
      priceLevelSnapshot: t.Boolean(),
      matchedRuleId: t.Boolean(),
      quantity: t.Boolean(),
      performed: t.Boolean(),
      performedByStaffId: t.Boolean(),
      notes: t.Boolean(),
      createdAt: t.Boolean(),
      session: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `بند خدمة داخل الجلسة — لقطات وقت الإضافة: الكتالوج يتغيّر والجلسة لا`,
    },
  ),
);

export const GroomingSessionItemInclude = t.Partial(
  t.Object(
    { laneSnapshot: t.Boolean(), session: t.Boolean(), _count: t.Boolean() },
    {
      additionalProperties: false,
      description: `بند خدمة داخل الجلسة — لقطات وقت الإضافة: الكتالوج يتغيّر والجلسة لا`,
    },
  ),
);

export const GroomingSessionItemOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      sessionId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      definitionId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      serviceId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      nameSnapshot: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      priceSnapshot: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      durationSnapshot: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      dryingSnapshot: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      priceLevelSnapshot: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      matchedRuleId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      quantity: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      performed: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      performedByStaffId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      notes: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    {
      additionalProperties: false,
      description: `بند خدمة داخل الجلسة — لقطات وقت الإضافة: الكتالوج يتغيّر والجلسة لا`,
    },
  ),
);

export const GroomingSessionItem = t.Composite(
  [GroomingSessionItemPlain, GroomingSessionItemRelations],
  { additionalProperties: false },
);

export const GroomingSessionItemInputCreate = t.Composite(
  [
    GroomingSessionItemPlainInputCreate,
    GroomingSessionItemRelationsInputCreate,
  ],
  { additionalProperties: false },
);

export const GroomingSessionItemInputUpdate = t.Composite(
  [
    GroomingSessionItemPlainInputUpdate,
    GroomingSessionItemRelationsInputUpdate,
  ],
  { additionalProperties: false },
);
