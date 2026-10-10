import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const GroomingSessionAdjustmentPlain = t.Object(
  {
    id: t.String(),
    sessionId: t.String(),
    modifierCode: t.Union(
      [
        t.Literal("MATTING"),
        t.Literal("SHAVE_DOWN"),
        t.Literal("BEHAVIOR"),
        t.Literal("SENIOR"),
        t.Literal("FLEA"),
        t.Literal("SECOND_PET"),
        t.Literal("EXPRESS"),
        t.Literal("OUT_OF_HOURS"),
      ],
      {
        additionalProperties: false,
        description: `رموز الرسوم/الخصوم المشروطة (§5).`,
      },
    ),
    labelSnapshot: t.String(),
    amount: t.Number(),
    source: t.Union(
      [
        t.Literal("AUTO_INTAKE"),
        t.Literal("MANUAL"),
        t.Literal("PACKAGE"),
        t.Literal("OVERRIDE"),
      ],
      {
        additionalProperties: false,
        description: `مصدر الرسم المطبَّق — يُحفظ على الصفّ لا يُستنتج، فيبقى «لماذا هذا المبلغ؟» مقروءًا`,
      },
    ),
    reason: __nullable__(t.String()),
    appliedByStaffId: __nullable__(t.String()),
    approvedByOwnerAt: __nullable__(t.Date()),
    createdAt: t.Date(),
  },
  {
    additionalProperties: false,
    description: `رسم أو خصم مطبَّق، بمصدره وسببه. صفّ مستقل لكل تطبيق عمدًا: مجموعٌ واحد
يخفي لماذا تغيّر الرقم، وهذا بالضبط ما يولّد شكوى «الفاتورة المفاجئة».`,
  },
);

export const GroomingSessionAdjustmentRelations = t.Object(
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
    description: `رسم أو خصم مطبَّق، بمصدره وسببه. صفّ مستقل لكل تطبيق عمدًا: مجموعٌ واحد
يخفي لماذا تغيّر الرقم، وهذا بالضبط ما يولّد شكوى «الفاتورة المفاجئة».`,
  },
);

export const GroomingSessionAdjustmentPlainInputCreate = t.Object(
  {
    modifierCode: t.Union(
      [
        t.Literal("MATTING"),
        t.Literal("SHAVE_DOWN"),
        t.Literal("BEHAVIOR"),
        t.Literal("SENIOR"),
        t.Literal("FLEA"),
        t.Literal("SECOND_PET"),
        t.Literal("EXPRESS"),
        t.Literal("OUT_OF_HOURS"),
      ],
      {
        additionalProperties: false,
        description: `رموز الرسوم/الخصوم المشروطة (§5).`,
      },
    ),
    labelSnapshot: t.String(),
    amount: t.Number(),
    source: t.Optional(
      t.Union(
        [
          t.Literal("AUTO_INTAKE"),
          t.Literal("MANUAL"),
          t.Literal("PACKAGE"),
          t.Literal("OVERRIDE"),
        ],
        {
          additionalProperties: false,
          description: `مصدر الرسم المطبَّق — يُحفظ على الصفّ لا يُستنتج، فيبقى «لماذا هذا المبلغ؟» مقروءًا`,
        },
      ),
    ),
    reason: t.Optional(__nullable__(t.String())),
    approvedByOwnerAt: t.Optional(__nullable__(t.Date())),
  },
  {
    additionalProperties: false,
    description: `رسم أو خصم مطبَّق، بمصدره وسببه. صفّ مستقل لكل تطبيق عمدًا: مجموعٌ واحد
يخفي لماذا تغيّر الرقم، وهذا بالضبط ما يولّد شكوى «الفاتورة المفاجئة».`,
  },
);

export const GroomingSessionAdjustmentPlainInputUpdate = t.Object(
  {
    modifierCode: t.Optional(
      t.Union(
        [
          t.Literal("MATTING"),
          t.Literal("SHAVE_DOWN"),
          t.Literal("BEHAVIOR"),
          t.Literal("SENIOR"),
          t.Literal("FLEA"),
          t.Literal("SECOND_PET"),
          t.Literal("EXPRESS"),
          t.Literal("OUT_OF_HOURS"),
        ],
        {
          additionalProperties: false,
          description: `رموز الرسوم/الخصوم المشروطة (§5).`,
        },
      ),
    ),
    labelSnapshot: t.Optional(t.String()),
    amount: t.Optional(t.Number()),
    source: t.Optional(
      t.Union(
        [
          t.Literal("AUTO_INTAKE"),
          t.Literal("MANUAL"),
          t.Literal("PACKAGE"),
          t.Literal("OVERRIDE"),
        ],
        {
          additionalProperties: false,
          description: `مصدر الرسم المطبَّق — يُحفظ على الصفّ لا يُستنتج، فيبقى «لماذا هذا المبلغ؟» مقروءًا`,
        },
      ),
    ),
    reason: t.Optional(__nullable__(t.String())),
    approvedByOwnerAt: t.Optional(__nullable__(t.Date())),
  },
  {
    additionalProperties: false,
    description: `رسم أو خصم مطبَّق، بمصدره وسببه. صفّ مستقل لكل تطبيق عمدًا: مجموعٌ واحد
يخفي لماذا تغيّر الرقم، وهذا بالضبط ما يولّد شكوى «الفاتورة المفاجئة».`,
  },
);

export const GroomingSessionAdjustmentRelationsInputCreate = t.Object(
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
    description: `رسم أو خصم مطبَّق، بمصدره وسببه. صفّ مستقل لكل تطبيق عمدًا: مجموعٌ واحد
يخفي لماذا تغيّر الرقم، وهذا بالضبط ما يولّد شكوى «الفاتورة المفاجئة».`,
  },
);

export const GroomingSessionAdjustmentRelationsInputUpdate = t.Partial(
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
      description: `رسم أو خصم مطبَّق، بمصدره وسببه. صفّ مستقل لكل تطبيق عمدًا: مجموعٌ واحد
يخفي لماذا تغيّر الرقم، وهذا بالضبط ما يولّد شكوى «الفاتورة المفاجئة».`,
    },
  ),
);

export const GroomingSessionAdjustmentWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          sessionId: t.String(),
          modifierCode: t.Union(
            [
              t.Literal("MATTING"),
              t.Literal("SHAVE_DOWN"),
              t.Literal("BEHAVIOR"),
              t.Literal("SENIOR"),
              t.Literal("FLEA"),
              t.Literal("SECOND_PET"),
              t.Literal("EXPRESS"),
              t.Literal("OUT_OF_HOURS"),
            ],
            {
              additionalProperties: false,
              description: `رموز الرسوم/الخصوم المشروطة (§5).`,
            },
          ),
          labelSnapshot: t.String(),
          amount: t.Number(),
          source: t.Union(
            [
              t.Literal("AUTO_INTAKE"),
              t.Literal("MANUAL"),
              t.Literal("PACKAGE"),
              t.Literal("OVERRIDE"),
            ],
            {
              additionalProperties: false,
              description: `مصدر الرسم المطبَّق — يُحفظ على الصفّ لا يُستنتج، فيبقى «لماذا هذا المبلغ؟» مقروءًا`,
            },
          ),
          reason: t.String(),
          appliedByStaffId: t.String(),
          approvedByOwnerAt: t.Date(),
          createdAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `رسم أو خصم مطبَّق، بمصدره وسببه. صفّ مستقل لكل تطبيق عمدًا: مجموعٌ واحد
يخفي لماذا تغيّر الرقم، وهذا بالضبط ما يولّد شكوى «الفاتورة المفاجئة».`,
        },
      ),
    { $id: "GroomingSessionAdjustment" },
  ),
);

export const GroomingSessionAdjustmentWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.String() },
            {
              additionalProperties: false,
              description: `رسم أو خصم مطبَّق، بمصدره وسببه. صفّ مستقل لكل تطبيق عمدًا: مجموعٌ واحد
يخفي لماذا تغيّر الرقم، وهذا بالضبط ما يولّد شكوى «الفاتورة المفاجئة».`,
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
              modifierCode: t.Union(
                [
                  t.Literal("MATTING"),
                  t.Literal("SHAVE_DOWN"),
                  t.Literal("BEHAVIOR"),
                  t.Literal("SENIOR"),
                  t.Literal("FLEA"),
                  t.Literal("SECOND_PET"),
                  t.Literal("EXPRESS"),
                  t.Literal("OUT_OF_HOURS"),
                ],
                {
                  additionalProperties: false,
                  description: `رموز الرسوم/الخصوم المشروطة (§5).`,
                },
              ),
              labelSnapshot: t.String(),
              amount: t.Number(),
              source: t.Union(
                [
                  t.Literal("AUTO_INTAKE"),
                  t.Literal("MANUAL"),
                  t.Literal("PACKAGE"),
                  t.Literal("OVERRIDE"),
                ],
                {
                  additionalProperties: false,
                  description: `مصدر الرسم المطبَّق — يُحفظ على الصفّ لا يُستنتج، فيبقى «لماذا هذا المبلغ؟» مقروءًا`,
                },
              ),
              reason: t.String(),
              appliedByStaffId: t.String(),
              approvedByOwnerAt: t.Date(),
              createdAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "GroomingSessionAdjustment" },
);

export const GroomingSessionAdjustmentSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      sessionId: t.Boolean(),
      modifierCode: t.Boolean(),
      labelSnapshot: t.Boolean(),
      amount: t.Boolean(),
      source: t.Boolean(),
      reason: t.Boolean(),
      appliedByStaffId: t.Boolean(),
      approvedByOwnerAt: t.Boolean(),
      createdAt: t.Boolean(),
      session: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `رسم أو خصم مطبَّق، بمصدره وسببه. صفّ مستقل لكل تطبيق عمدًا: مجموعٌ واحد
يخفي لماذا تغيّر الرقم، وهذا بالضبط ما يولّد شكوى «الفاتورة المفاجئة».`,
    },
  ),
);

export const GroomingSessionAdjustmentInclude = t.Partial(
  t.Object(
    {
      modifierCode: t.Boolean(),
      source: t.Boolean(),
      session: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `رسم أو خصم مطبَّق، بمصدره وسببه. صفّ مستقل لكل تطبيق عمدًا: مجموعٌ واحد
يخفي لماذا تغيّر الرقم، وهذا بالضبط ما يولّد شكوى «الفاتورة المفاجئة».`,
    },
  ),
);

export const GroomingSessionAdjustmentOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      sessionId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      labelSnapshot: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      amount: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      reason: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      appliedByStaffId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      approvedByOwnerAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    {
      additionalProperties: false,
      description: `رسم أو خصم مطبَّق، بمصدره وسببه. صفّ مستقل لكل تطبيق عمدًا: مجموعٌ واحد
يخفي لماذا تغيّر الرقم، وهذا بالضبط ما يولّد شكوى «الفاتورة المفاجئة».`,
    },
  ),
);

export const GroomingSessionAdjustment = t.Composite(
  [GroomingSessionAdjustmentPlain, GroomingSessionAdjustmentRelations],
  { additionalProperties: false },
);

export const GroomingSessionAdjustmentInputCreate = t.Composite(
  [
    GroomingSessionAdjustmentPlainInputCreate,
    GroomingSessionAdjustmentRelationsInputCreate,
  ],
  { additionalProperties: false },
);

export const GroomingSessionAdjustmentInputUpdate = t.Composite(
  [
    GroomingSessionAdjustmentPlainInputUpdate,
    GroomingSessionAdjustmentRelationsInputUpdate,
  ],
  { additionalProperties: false },
);
