import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const GroomingIncidentPlain = t.Object(
  {
    id: t.String(),
    sessionId: t.String(),
    kind: t.Union(
      [
        t.Literal("CLIPPER_BURN"),
        t.Literal("NICK_CUT"),
        t.Literal("QUICKED_NAIL"),
        t.Literal("HEAT_STRESS"),
        t.Literal("MEDICAL_EVENT"),
        t.Literal("ESCAPE"),
        t.Literal("BITE_TO_STAFF"),
        t.Literal("EQUIPMENT_FAILURE"),
        t.Literal("OTHER"),
      ],
      {
        additionalProperties: false,
        description: `نوع الحادثة — الإبلاغ إلزامي والسجل إلحاقي (البوابة G10)`,
      },
    ),
    severity: t.Union(
      [t.Literal("MINOR"), t.Literal("MODERATE"), t.Literal("MAJOR")],
      { additionalProperties: false },
    ),
    description: t.String(),
    actionTaken: __nullable__(t.String()),
    photoId: __nullable__(t.String()),
    ownerNotifiedAt: __nullable__(t.Date()),
    ownerNotifiedByStaffId: __nullable__(t.String()),
    vetAssessedByStaffId: __nullable__(t.String()),
    vetAssessmentNote: __nullable__(t.String()),
    followUpAppointmentId: __nullable__(t.String()),
    resolvedAt: __nullable__(t.Date()),
    createdByStaffId: __nullable__(t.String()),
    createdAt: t.Date(),
  },
  {
    additionalProperties: false,
    description: `حادثة داخل الجلسة — البوابة G10 تمنع الإقفال قبل تقييم الطبيب وإبلاغ المالك.
لا تُعدَّل في مكانها ولا تُحذف: حادثة مطموسة بلا أثر هي مسؤولية مدفونة.`,
  },
);

export const GroomingIncidentRelations = t.Object(
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
    description: `حادثة داخل الجلسة — البوابة G10 تمنع الإقفال قبل تقييم الطبيب وإبلاغ المالك.
لا تُعدَّل في مكانها ولا تُحذف: حادثة مطموسة بلا أثر هي مسؤولية مدفونة.`,
  },
);

export const GroomingIncidentPlainInputCreate = t.Object(
  {
    kind: t.Union(
      [
        t.Literal("CLIPPER_BURN"),
        t.Literal("NICK_CUT"),
        t.Literal("QUICKED_NAIL"),
        t.Literal("HEAT_STRESS"),
        t.Literal("MEDICAL_EVENT"),
        t.Literal("ESCAPE"),
        t.Literal("BITE_TO_STAFF"),
        t.Literal("EQUIPMENT_FAILURE"),
        t.Literal("OTHER"),
      ],
      {
        additionalProperties: false,
        description: `نوع الحادثة — الإبلاغ إلزامي والسجل إلحاقي (البوابة G10)`,
      },
    ),
    severity: t.Optional(
      t.Union([t.Literal("MINOR"), t.Literal("MODERATE"), t.Literal("MAJOR")], {
        additionalProperties: false,
      }),
    ),
    description: t.String(),
    actionTaken: t.Optional(__nullable__(t.String())),
    ownerNotifiedAt: t.Optional(__nullable__(t.Date())),
    vetAssessmentNote: t.Optional(__nullable__(t.String())),
    resolvedAt: t.Optional(__nullable__(t.Date())),
  },
  {
    additionalProperties: false,
    description: `حادثة داخل الجلسة — البوابة G10 تمنع الإقفال قبل تقييم الطبيب وإبلاغ المالك.
لا تُعدَّل في مكانها ولا تُحذف: حادثة مطموسة بلا أثر هي مسؤولية مدفونة.`,
  },
);

export const GroomingIncidentPlainInputUpdate = t.Object(
  {
    kind: t.Optional(
      t.Union(
        [
          t.Literal("CLIPPER_BURN"),
          t.Literal("NICK_CUT"),
          t.Literal("QUICKED_NAIL"),
          t.Literal("HEAT_STRESS"),
          t.Literal("MEDICAL_EVENT"),
          t.Literal("ESCAPE"),
          t.Literal("BITE_TO_STAFF"),
          t.Literal("EQUIPMENT_FAILURE"),
          t.Literal("OTHER"),
        ],
        {
          additionalProperties: false,
          description: `نوع الحادثة — الإبلاغ إلزامي والسجل إلحاقي (البوابة G10)`,
        },
      ),
    ),
    severity: t.Optional(
      t.Union([t.Literal("MINOR"), t.Literal("MODERATE"), t.Literal("MAJOR")], {
        additionalProperties: false,
      }),
    ),
    description: t.Optional(t.String()),
    actionTaken: t.Optional(__nullable__(t.String())),
    ownerNotifiedAt: t.Optional(__nullable__(t.Date())),
    vetAssessmentNote: t.Optional(__nullable__(t.String())),
    resolvedAt: t.Optional(__nullable__(t.Date())),
  },
  {
    additionalProperties: false,
    description: `حادثة داخل الجلسة — البوابة G10 تمنع الإقفال قبل تقييم الطبيب وإبلاغ المالك.
لا تُعدَّل في مكانها ولا تُحذف: حادثة مطموسة بلا أثر هي مسؤولية مدفونة.`,
  },
);

export const GroomingIncidentRelationsInputCreate = t.Object(
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
    description: `حادثة داخل الجلسة — البوابة G10 تمنع الإقفال قبل تقييم الطبيب وإبلاغ المالك.
لا تُعدَّل في مكانها ولا تُحذف: حادثة مطموسة بلا أثر هي مسؤولية مدفونة.`,
  },
);

export const GroomingIncidentRelationsInputUpdate = t.Partial(
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
      description: `حادثة داخل الجلسة — البوابة G10 تمنع الإقفال قبل تقييم الطبيب وإبلاغ المالك.
لا تُعدَّل في مكانها ولا تُحذف: حادثة مطموسة بلا أثر هي مسؤولية مدفونة.`,
    },
  ),
);

export const GroomingIncidentWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          sessionId: t.String(),
          kind: t.Union(
            [
              t.Literal("CLIPPER_BURN"),
              t.Literal("NICK_CUT"),
              t.Literal("QUICKED_NAIL"),
              t.Literal("HEAT_STRESS"),
              t.Literal("MEDICAL_EVENT"),
              t.Literal("ESCAPE"),
              t.Literal("BITE_TO_STAFF"),
              t.Literal("EQUIPMENT_FAILURE"),
              t.Literal("OTHER"),
            ],
            {
              additionalProperties: false,
              description: `نوع الحادثة — الإبلاغ إلزامي والسجل إلحاقي (البوابة G10)`,
            },
          ),
          severity: t.Union(
            [t.Literal("MINOR"), t.Literal("MODERATE"), t.Literal("MAJOR")],
            { additionalProperties: false },
          ),
          description: t.String(),
          actionTaken: t.String(),
          photoId: t.String(),
          ownerNotifiedAt: t.Date(),
          ownerNotifiedByStaffId: t.String(),
          vetAssessedByStaffId: t.String(),
          vetAssessmentNote: t.String(),
          followUpAppointmentId: t.String(),
          resolvedAt: t.Date(),
          createdByStaffId: t.String(),
          createdAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `حادثة داخل الجلسة — البوابة G10 تمنع الإقفال قبل تقييم الطبيب وإبلاغ المالك.
لا تُعدَّل في مكانها ولا تُحذف: حادثة مطموسة بلا أثر هي مسؤولية مدفونة.`,
        },
      ),
    { $id: "GroomingIncident" },
  ),
);

export const GroomingIncidentWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.String() },
            {
              additionalProperties: false,
              description: `حادثة داخل الجلسة — البوابة G10 تمنع الإقفال قبل تقييم الطبيب وإبلاغ المالك.
لا تُعدَّل في مكانها ولا تُحذف: حادثة مطموسة بلا أثر هي مسؤولية مدفونة.`,
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
              kind: t.Union(
                [
                  t.Literal("CLIPPER_BURN"),
                  t.Literal("NICK_CUT"),
                  t.Literal("QUICKED_NAIL"),
                  t.Literal("HEAT_STRESS"),
                  t.Literal("MEDICAL_EVENT"),
                  t.Literal("ESCAPE"),
                  t.Literal("BITE_TO_STAFF"),
                  t.Literal("EQUIPMENT_FAILURE"),
                  t.Literal("OTHER"),
                ],
                {
                  additionalProperties: false,
                  description: `نوع الحادثة — الإبلاغ إلزامي والسجل إلحاقي (البوابة G10)`,
                },
              ),
              severity: t.Union(
                [t.Literal("MINOR"), t.Literal("MODERATE"), t.Literal("MAJOR")],
                { additionalProperties: false },
              ),
              description: t.String(),
              actionTaken: t.String(),
              photoId: t.String(),
              ownerNotifiedAt: t.Date(),
              ownerNotifiedByStaffId: t.String(),
              vetAssessedByStaffId: t.String(),
              vetAssessmentNote: t.String(),
              followUpAppointmentId: t.String(),
              resolvedAt: t.Date(),
              createdByStaffId: t.String(),
              createdAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "GroomingIncident" },
);

export const GroomingIncidentSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      sessionId: t.Boolean(),
      kind: t.Boolean(),
      severity: t.Boolean(),
      description: t.Boolean(),
      actionTaken: t.Boolean(),
      photoId: t.Boolean(),
      ownerNotifiedAt: t.Boolean(),
      ownerNotifiedByStaffId: t.Boolean(),
      vetAssessedByStaffId: t.Boolean(),
      vetAssessmentNote: t.Boolean(),
      followUpAppointmentId: t.Boolean(),
      resolvedAt: t.Boolean(),
      createdByStaffId: t.Boolean(),
      createdAt: t.Boolean(),
      session: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `حادثة داخل الجلسة — البوابة G10 تمنع الإقفال قبل تقييم الطبيب وإبلاغ المالك.
لا تُعدَّل في مكانها ولا تُحذف: حادثة مطموسة بلا أثر هي مسؤولية مدفونة.`,
    },
  ),
);

export const GroomingIncidentInclude = t.Partial(
  t.Object(
    {
      kind: t.Boolean(),
      severity: t.Boolean(),
      session: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `حادثة داخل الجلسة — البوابة G10 تمنع الإقفال قبل تقييم الطبيب وإبلاغ المالك.
لا تُعدَّل في مكانها ولا تُحذف: حادثة مطموسة بلا أثر هي مسؤولية مدفونة.`,
    },
  ),
);

export const GroomingIncidentOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      sessionId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      description: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      actionTaken: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      photoId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      ownerNotifiedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      ownerNotifiedByStaffId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      vetAssessedByStaffId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      vetAssessmentNote: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      followUpAppointmentId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      resolvedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdByStaffId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    {
      additionalProperties: false,
      description: `حادثة داخل الجلسة — البوابة G10 تمنع الإقفال قبل تقييم الطبيب وإبلاغ المالك.
لا تُعدَّل في مكانها ولا تُحذف: حادثة مطموسة بلا أثر هي مسؤولية مدفونة.`,
    },
  ),
);

export const GroomingIncident = t.Composite(
  [GroomingIncidentPlain, GroomingIncidentRelations],
  { additionalProperties: false },
);

export const GroomingIncidentInputCreate = t.Composite(
  [GroomingIncidentPlainInputCreate, GroomingIncidentRelationsInputCreate],
  { additionalProperties: false },
);

export const GroomingIncidentInputUpdate = t.Composite(
  [GroomingIncidentPlainInputUpdate, GroomingIncidentRelationsInputUpdate],
  { additionalProperties: false },
);
