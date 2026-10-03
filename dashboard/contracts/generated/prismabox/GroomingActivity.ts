import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const GroomingActivityPlain = t.Object(
  {
    id: t.String(),
    sessionId: t.String(),
    type: t.Union(
      [
        t.Literal("CREATED"),
        t.Literal("STATUS_CHANGED"),
        t.Literal("STAGE_CHANGED"),
        t.Literal("GATE_OVERRIDDEN"),
        t.Literal("QUOTE_RECALCULATED"),
        t.Literal("QUOTE_APPROVED"),
        t.Literal("LANE_ESCALATED"),
        t.Literal("INTAKE_RECORDED"),
        t.Literal("ITEM_CHANGED"),
        t.Literal("PRODUCT_ISSUED"),
        t.Literal("PHOTO_ADDED"),
        t.Literal("FINDING_ADDED"),
        t.Literal("FINDING_ESCALATED"),
        t.Literal("INCIDENT_REPORTED"),
        t.Literal("INCIDENT_RESOLVED"),
        t.Literal("REPORT_CARD_SENT"),
        t.Literal("INVOICE_ISSUED"),
        t.Literal("INVOICE_PAID"),
        t.Literal("COMMENT"),
      ],
      {
        additionalProperties: false,
        description: `نوع حدث في سجل نشاط الجلسة — السجل إلحاقي لا يُعدَّل ولا يُحذف`,
      },
    ),
    detail: __nullable__(t.String()),
    gate: __nullable__(t.String()),
    authorUserId: __nullable__(t.String()),
    createdAt: t.Date(),
  },
  {
    additionalProperties: false,
    description: `سجل نشاط الجلسة — إلحاقي فقط، لا يُعدَّل ولا يُحذف. كل تجاوز بوابة يهبط هنا.`,
  },
);

export const GroomingActivityRelations = t.Object(
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
    description: `سجل نشاط الجلسة — إلحاقي فقط، لا يُعدَّل ولا يُحذف. كل تجاوز بوابة يهبط هنا.`,
  },
);

export const GroomingActivityPlainInputCreate = t.Object(
  {
    type: t.Union(
      [
        t.Literal("CREATED"),
        t.Literal("STATUS_CHANGED"),
        t.Literal("STAGE_CHANGED"),
        t.Literal("GATE_OVERRIDDEN"),
        t.Literal("QUOTE_RECALCULATED"),
        t.Literal("QUOTE_APPROVED"),
        t.Literal("LANE_ESCALATED"),
        t.Literal("INTAKE_RECORDED"),
        t.Literal("ITEM_CHANGED"),
        t.Literal("PRODUCT_ISSUED"),
        t.Literal("PHOTO_ADDED"),
        t.Literal("FINDING_ADDED"),
        t.Literal("FINDING_ESCALATED"),
        t.Literal("INCIDENT_REPORTED"),
        t.Literal("INCIDENT_RESOLVED"),
        t.Literal("REPORT_CARD_SENT"),
        t.Literal("INVOICE_ISSUED"),
        t.Literal("INVOICE_PAID"),
        t.Literal("COMMENT"),
      ],
      {
        additionalProperties: false,
        description: `نوع حدث في سجل نشاط الجلسة — السجل إلحاقي لا يُعدَّل ولا يُحذف`,
      },
    ),
    detail: t.Optional(__nullable__(t.String())),
    gate: t.Optional(__nullable__(t.String())),
  },
  {
    additionalProperties: false,
    description: `سجل نشاط الجلسة — إلحاقي فقط، لا يُعدَّل ولا يُحذف. كل تجاوز بوابة يهبط هنا.`,
  },
);

export const GroomingActivityPlainInputUpdate = t.Object(
  {
    type: t.Optional(
      t.Union(
        [
          t.Literal("CREATED"),
          t.Literal("STATUS_CHANGED"),
          t.Literal("STAGE_CHANGED"),
          t.Literal("GATE_OVERRIDDEN"),
          t.Literal("QUOTE_RECALCULATED"),
          t.Literal("QUOTE_APPROVED"),
          t.Literal("LANE_ESCALATED"),
          t.Literal("INTAKE_RECORDED"),
          t.Literal("ITEM_CHANGED"),
          t.Literal("PRODUCT_ISSUED"),
          t.Literal("PHOTO_ADDED"),
          t.Literal("FINDING_ADDED"),
          t.Literal("FINDING_ESCALATED"),
          t.Literal("INCIDENT_REPORTED"),
          t.Literal("INCIDENT_RESOLVED"),
          t.Literal("REPORT_CARD_SENT"),
          t.Literal("INVOICE_ISSUED"),
          t.Literal("INVOICE_PAID"),
          t.Literal("COMMENT"),
        ],
        {
          additionalProperties: false,
          description: `نوع حدث في سجل نشاط الجلسة — السجل إلحاقي لا يُعدَّل ولا يُحذف`,
        },
      ),
    ),
    detail: t.Optional(__nullable__(t.String())),
    gate: t.Optional(__nullable__(t.String())),
  },
  {
    additionalProperties: false,
    description: `سجل نشاط الجلسة — إلحاقي فقط، لا يُعدَّل ولا يُحذف. كل تجاوز بوابة يهبط هنا.`,
  },
);

export const GroomingActivityRelationsInputCreate = t.Object(
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
    description: `سجل نشاط الجلسة — إلحاقي فقط، لا يُعدَّل ولا يُحذف. كل تجاوز بوابة يهبط هنا.`,
  },
);

export const GroomingActivityRelationsInputUpdate = t.Partial(
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
      description: `سجل نشاط الجلسة — إلحاقي فقط، لا يُعدَّل ولا يُحذف. كل تجاوز بوابة يهبط هنا.`,
    },
  ),
);

export const GroomingActivityWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          sessionId: t.String(),
          type: t.Union(
            [
              t.Literal("CREATED"),
              t.Literal("STATUS_CHANGED"),
              t.Literal("STAGE_CHANGED"),
              t.Literal("GATE_OVERRIDDEN"),
              t.Literal("QUOTE_RECALCULATED"),
              t.Literal("QUOTE_APPROVED"),
              t.Literal("LANE_ESCALATED"),
              t.Literal("INTAKE_RECORDED"),
              t.Literal("ITEM_CHANGED"),
              t.Literal("PRODUCT_ISSUED"),
              t.Literal("PHOTO_ADDED"),
              t.Literal("FINDING_ADDED"),
              t.Literal("FINDING_ESCALATED"),
              t.Literal("INCIDENT_REPORTED"),
              t.Literal("INCIDENT_RESOLVED"),
              t.Literal("REPORT_CARD_SENT"),
              t.Literal("INVOICE_ISSUED"),
              t.Literal("INVOICE_PAID"),
              t.Literal("COMMENT"),
            ],
            {
              additionalProperties: false,
              description: `نوع حدث في سجل نشاط الجلسة — السجل إلحاقي لا يُعدَّل ولا يُحذف`,
            },
          ),
          detail: t.String(),
          gate: t.String(),
          authorUserId: t.String(),
          createdAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `سجل نشاط الجلسة — إلحاقي فقط، لا يُعدَّل ولا يُحذف. كل تجاوز بوابة يهبط هنا.`,
        },
      ),
    { $id: "GroomingActivity" },
  ),
);

export const GroomingActivityWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.String() },
            {
              additionalProperties: false,
              description: `سجل نشاط الجلسة — إلحاقي فقط، لا يُعدَّل ولا يُحذف. كل تجاوز بوابة يهبط هنا.`,
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
              type: t.Union(
                [
                  t.Literal("CREATED"),
                  t.Literal("STATUS_CHANGED"),
                  t.Literal("STAGE_CHANGED"),
                  t.Literal("GATE_OVERRIDDEN"),
                  t.Literal("QUOTE_RECALCULATED"),
                  t.Literal("QUOTE_APPROVED"),
                  t.Literal("LANE_ESCALATED"),
                  t.Literal("INTAKE_RECORDED"),
                  t.Literal("ITEM_CHANGED"),
                  t.Literal("PRODUCT_ISSUED"),
                  t.Literal("PHOTO_ADDED"),
                  t.Literal("FINDING_ADDED"),
                  t.Literal("FINDING_ESCALATED"),
                  t.Literal("INCIDENT_REPORTED"),
                  t.Literal("INCIDENT_RESOLVED"),
                  t.Literal("REPORT_CARD_SENT"),
                  t.Literal("INVOICE_ISSUED"),
                  t.Literal("INVOICE_PAID"),
                  t.Literal("COMMENT"),
                ],
                {
                  additionalProperties: false,
                  description: `نوع حدث في سجل نشاط الجلسة — السجل إلحاقي لا يُعدَّل ولا يُحذف`,
                },
              ),
              detail: t.String(),
              gate: t.String(),
              authorUserId: t.String(),
              createdAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "GroomingActivity" },
);

export const GroomingActivitySelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      sessionId: t.Boolean(),
      type: t.Boolean(),
      detail: t.Boolean(),
      gate: t.Boolean(),
      authorUserId: t.Boolean(),
      createdAt: t.Boolean(),
      session: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `سجل نشاط الجلسة — إلحاقي فقط، لا يُعدَّل ولا يُحذف. كل تجاوز بوابة يهبط هنا.`,
    },
  ),
);

export const GroomingActivityInclude = t.Partial(
  t.Object(
    { type: t.Boolean(), session: t.Boolean(), _count: t.Boolean() },
    {
      additionalProperties: false,
      description: `سجل نشاط الجلسة — إلحاقي فقط، لا يُعدَّل ولا يُحذف. كل تجاوز بوابة يهبط هنا.`,
    },
  ),
);

export const GroomingActivityOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      sessionId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      detail: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      gate: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      authorUserId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    {
      additionalProperties: false,
      description: `سجل نشاط الجلسة — إلحاقي فقط، لا يُعدَّل ولا يُحذف. كل تجاوز بوابة يهبط هنا.`,
    },
  ),
);

export const GroomingActivity = t.Composite(
  [GroomingActivityPlain, GroomingActivityRelations],
  { additionalProperties: false },
);

export const GroomingActivityInputCreate = t.Composite(
  [GroomingActivityPlainInputCreate, GroomingActivityRelationsInputCreate],
  { additionalProperties: false },
);

export const GroomingActivityInputUpdate = t.Composite(
  [GroomingActivityPlainInputUpdate, GroomingActivityRelationsInputUpdate],
  { additionalProperties: false },
);
