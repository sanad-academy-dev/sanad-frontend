import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const GroomingFindingPlain = t.Object(
  {
    id: t.String(),
    sessionId: t.String(),
    patientId: t.String(),
    clinicId: t.String(),
    category: t.Union(
      [
        t.Literal("SKIN"),
        t.Literal("EARS"),
        t.Literal("EYES"),
        t.Literal("NAILS"),
        t.Literal("DENTAL"),
        t.Literal("LUMP"),
        t.Literal("PARASITE"),
        t.Literal("WEIGHT"),
        t.Literal("PAIN"),
        t.Literal("BEHAVIOR"),
        t.Literal("OTHER"),
      ],
      { additionalProperties: false },
    ),
    bodyZone: __nullable__(t.String()),
    severity: t.Union(
      [t.Literal("INFO"), t.Literal("ATTENTION"), t.Literal("URGENT")],
      { additionalProperties: false },
    ),
    note: t.String(),
    photoId: __nullable__(t.String()),
    acknowledgedByStaffId: __nullable__(t.String()),
    acknowledgedAt: __nullable__(t.Date()),
    referralAppointmentId: __nullable__(t.String()),
    labOrderId: __nullable__(t.String()),
    dismissedReason: __nullable__(t.String()),
    createdByStaffId: __nullable__(t.String()),
    createdAt: t.Date(),
  },
  {
    additionalProperties: false,
    description: `الجسر السريري (§8) — السبب الذي يجعل التجميل جزءًا من نظام بيطري لا صالونًا.
المُجمِّل يمرّ بيده على كامل الحيوان كل أربعة إلى ثمانية أسابيع؛ ما يراه كان
يتبخّر، وهنا يصير سطرًا في السجل الطبي وربما زيارة.`,
  },
);

export const GroomingFindingRelations = t.Object(
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
  },
  {
    additionalProperties: false,
    description: `الجسر السريري (§8) — السبب الذي يجعل التجميل جزءًا من نظام بيطري لا صالونًا.
المُجمِّل يمرّ بيده على كامل الحيوان كل أربعة إلى ثمانية أسابيع؛ ما يراه كان
يتبخّر، وهنا يصير سطرًا في السجل الطبي وربما زيارة.`,
  },
);

export const GroomingFindingPlainInputCreate = t.Object(
  {
    category: t.Union(
      [
        t.Literal("SKIN"),
        t.Literal("EARS"),
        t.Literal("EYES"),
        t.Literal("NAILS"),
        t.Literal("DENTAL"),
        t.Literal("LUMP"),
        t.Literal("PARASITE"),
        t.Literal("WEIGHT"),
        t.Literal("PAIN"),
        t.Literal("BEHAVIOR"),
        t.Literal("OTHER"),
      ],
      { additionalProperties: false },
    ),
    bodyZone: t.Optional(__nullable__(t.String())),
    severity: t.Optional(
      t.Union(
        [t.Literal("INFO"), t.Literal("ATTENTION"), t.Literal("URGENT")],
        { additionalProperties: false },
      ),
    ),
    note: t.String(),
    acknowledgedAt: t.Optional(__nullable__(t.Date())),
    dismissedReason: t.Optional(__nullable__(t.String())),
  },
  {
    additionalProperties: false,
    description: `الجسر السريري (§8) — السبب الذي يجعل التجميل جزءًا من نظام بيطري لا صالونًا.
المُجمِّل يمرّ بيده على كامل الحيوان كل أربعة إلى ثمانية أسابيع؛ ما يراه كان
يتبخّر، وهنا يصير سطرًا في السجل الطبي وربما زيارة.`,
  },
);

export const GroomingFindingPlainInputUpdate = t.Object(
  {
    category: t.Optional(
      t.Union(
        [
          t.Literal("SKIN"),
          t.Literal("EARS"),
          t.Literal("EYES"),
          t.Literal("NAILS"),
          t.Literal("DENTAL"),
          t.Literal("LUMP"),
          t.Literal("PARASITE"),
          t.Literal("WEIGHT"),
          t.Literal("PAIN"),
          t.Literal("BEHAVIOR"),
          t.Literal("OTHER"),
        ],
        { additionalProperties: false },
      ),
    ),
    bodyZone: t.Optional(__nullable__(t.String())),
    severity: t.Optional(
      t.Union(
        [t.Literal("INFO"), t.Literal("ATTENTION"), t.Literal("URGENT")],
        { additionalProperties: false },
      ),
    ),
    note: t.Optional(t.String()),
    acknowledgedAt: t.Optional(__nullable__(t.Date())),
    dismissedReason: t.Optional(__nullable__(t.String())),
  },
  {
    additionalProperties: false,
    description: `الجسر السريري (§8) — السبب الذي يجعل التجميل جزءًا من نظام بيطري لا صالونًا.
المُجمِّل يمرّ بيده على كامل الحيوان كل أربعة إلى ثمانية أسابيع؛ ما يراه كان
يتبخّر، وهنا يصير سطرًا في السجل الطبي وربما زيارة.`,
  },
);

export const GroomingFindingRelationsInputCreate = t.Object(
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
  },
  {
    additionalProperties: false,
    description: `الجسر السريري (§8) — السبب الذي يجعل التجميل جزءًا من نظام بيطري لا صالونًا.
المُجمِّل يمرّ بيده على كامل الحيوان كل أربعة إلى ثمانية أسابيع؛ ما يراه كان
يتبخّر، وهنا يصير سطرًا في السجل الطبي وربما زيارة.`,
  },
);

export const GroomingFindingRelationsInputUpdate = t.Partial(
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
    },
    {
      additionalProperties: false,
      description: `الجسر السريري (§8) — السبب الذي يجعل التجميل جزءًا من نظام بيطري لا صالونًا.
المُجمِّل يمرّ بيده على كامل الحيوان كل أربعة إلى ثمانية أسابيع؛ ما يراه كان
يتبخّر، وهنا يصير سطرًا في السجل الطبي وربما زيارة.`,
    },
  ),
);

export const GroomingFindingWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          sessionId: t.String(),
          patientId: t.String(),
          clinicId: t.String(),
          category: t.Union(
            [
              t.Literal("SKIN"),
              t.Literal("EARS"),
              t.Literal("EYES"),
              t.Literal("NAILS"),
              t.Literal("DENTAL"),
              t.Literal("LUMP"),
              t.Literal("PARASITE"),
              t.Literal("WEIGHT"),
              t.Literal("PAIN"),
              t.Literal("BEHAVIOR"),
              t.Literal("OTHER"),
            ],
            { additionalProperties: false },
          ),
          bodyZone: t.String(),
          severity: t.Union(
            [t.Literal("INFO"), t.Literal("ATTENTION"), t.Literal("URGENT")],
            { additionalProperties: false },
          ),
          note: t.String(),
          photoId: t.String(),
          acknowledgedByStaffId: t.String(),
          acknowledgedAt: t.Date(),
          referralAppointmentId: t.String(),
          labOrderId: t.String(),
          dismissedReason: t.String(),
          createdByStaffId: t.String(),
          createdAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `الجسر السريري (§8) — السبب الذي يجعل التجميل جزءًا من نظام بيطري لا صالونًا.
المُجمِّل يمرّ بيده على كامل الحيوان كل أربعة إلى ثمانية أسابيع؛ ما يراه كان
يتبخّر، وهنا يصير سطرًا في السجل الطبي وربما زيارة.`,
        },
      ),
    { $id: "GroomingFinding" },
  ),
);

export const GroomingFindingWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.String() },
            {
              additionalProperties: false,
              description: `الجسر السريري (§8) — السبب الذي يجعل التجميل جزءًا من نظام بيطري لا صالونًا.
المُجمِّل يمرّ بيده على كامل الحيوان كل أربعة إلى ثمانية أسابيع؛ ما يراه كان
يتبخّر، وهنا يصير سطرًا في السجل الطبي وربما زيارة.`,
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
              patientId: t.String(),
              clinicId: t.String(),
              category: t.Union(
                [
                  t.Literal("SKIN"),
                  t.Literal("EARS"),
                  t.Literal("EYES"),
                  t.Literal("NAILS"),
                  t.Literal("DENTAL"),
                  t.Literal("LUMP"),
                  t.Literal("PARASITE"),
                  t.Literal("WEIGHT"),
                  t.Literal("PAIN"),
                  t.Literal("BEHAVIOR"),
                  t.Literal("OTHER"),
                ],
                { additionalProperties: false },
              ),
              bodyZone: t.String(),
              severity: t.Union(
                [
                  t.Literal("INFO"),
                  t.Literal("ATTENTION"),
                  t.Literal("URGENT"),
                ],
                { additionalProperties: false },
              ),
              note: t.String(),
              photoId: t.String(),
              acknowledgedByStaffId: t.String(),
              acknowledgedAt: t.Date(),
              referralAppointmentId: t.String(),
              labOrderId: t.String(),
              dismissedReason: t.String(),
              createdByStaffId: t.String(),
              createdAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "GroomingFinding" },
);

export const GroomingFindingSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      sessionId: t.Boolean(),
      patientId: t.Boolean(),
      clinicId: t.Boolean(),
      category: t.Boolean(),
      bodyZone: t.Boolean(),
      severity: t.Boolean(),
      note: t.Boolean(),
      photoId: t.Boolean(),
      acknowledgedByStaffId: t.Boolean(),
      acknowledgedAt: t.Boolean(),
      referralAppointmentId: t.Boolean(),
      labOrderId: t.Boolean(),
      dismissedReason: t.Boolean(),
      createdByStaffId: t.Boolean(),
      createdAt: t.Boolean(),
      session: t.Boolean(),
      patient: t.Boolean(),
      clinic: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `الجسر السريري (§8) — السبب الذي يجعل التجميل جزءًا من نظام بيطري لا صالونًا.
المُجمِّل يمرّ بيده على كامل الحيوان كل أربعة إلى ثمانية أسابيع؛ ما يراه كان
يتبخّر، وهنا يصير سطرًا في السجل الطبي وربما زيارة.`,
    },
  ),
);

export const GroomingFindingInclude = t.Partial(
  t.Object(
    {
      category: t.Boolean(),
      severity: t.Boolean(),
      session: t.Boolean(),
      patient: t.Boolean(),
      clinic: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `الجسر السريري (§8) — السبب الذي يجعل التجميل جزءًا من نظام بيطري لا صالونًا.
المُجمِّل يمرّ بيده على كامل الحيوان كل أربعة إلى ثمانية أسابيع؛ ما يراه كان
يتبخّر، وهنا يصير سطرًا في السجل الطبي وربما زيارة.`,
    },
  ),
);

export const GroomingFindingOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      sessionId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      patientId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clinicId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      bodyZone: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      note: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      photoId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      acknowledgedByStaffId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      acknowledgedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      referralAppointmentId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      labOrderId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      dismissedReason: t.Union([t.Literal("asc"), t.Literal("desc")], {
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
      description: `الجسر السريري (§8) — السبب الذي يجعل التجميل جزءًا من نظام بيطري لا صالونًا.
المُجمِّل يمرّ بيده على كامل الحيوان كل أربعة إلى ثمانية أسابيع؛ ما يراه كان
يتبخّر، وهنا يصير سطرًا في السجل الطبي وربما زيارة.`,
    },
  ),
);

export const GroomingFinding = t.Composite(
  [GroomingFindingPlain, GroomingFindingRelations],
  { additionalProperties: false },
);

export const GroomingFindingInputCreate = t.Composite(
  [GroomingFindingPlainInputCreate, GroomingFindingRelationsInputCreate],
  { additionalProperties: false },
);

export const GroomingFindingInputUpdate = t.Composite(
  [GroomingFindingPlainInputUpdate, GroomingFindingRelationsInputUpdate],
  { additionalProperties: false },
);
