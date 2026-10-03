import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const RadiologySafetyScreeningPlain = t.Object(
  {
    id: t.String(),
    orderId: t.String(),
    fastingStatus: __nullable__(
      t.Union(
        [t.Literal("FASTED"), t.Literal("PARTIAL"), t.Literal("NOT_FASTED")],
        { additionalProperties: false },
      ),
    ),
    fastingHours: __nullable__(t.Integer()),
    medications: t.Array(t.String(), { additionalProperties: false }),
    pregnancyPossible: __nullable__(t.Boolean()),
    metalImplants: __nullable__(t.Boolean()),
    implantNotes: __nullable__(t.String()),
    priorContrastReaction: __nullable__(t.Boolean()),
    allergies: __nullable__(t.String()),
    asaClass: __nullable__(t.Integer()),
    vitalsRecordId: __nullable__(t.String()),
    weight: __nullable__(t.Number()),
    temperature: __nullable__(t.Number()),
    heartRate: __nullable__(t.Integer()),
    respiratoryRate: __nullable__(t.Integer()),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  },
  { additionalProperties: false },
);

export const RadiologySafetyScreeningRelations = t.Object(
  {
    order: t.Object(
      {
        id: t.String(),
        code: t.String(),
        clinicId: t.String(),
        branchId: t.String(),
        patientId: t.String(),
        ownerId: t.String(),
        appointmentId: __nullable__(t.String()),
        inpatientStayId: __nullable__(
          t.String({
            description: `*
* [IP2] طُلب من داخل إقامة تنويم. عمود قياسيّ بلا علاقة Prisma عن قصد: العلاقة
* تُضاف طرفين، وطرفها الثاني يوسّع رسم أنواع \`InpatientStay\` الضخم أصلًا حتى
* يتجاوز سقف عمق TypeScript (نفس ما وقع عند إضافة نماذج التنويم أول مرّة).
* الاستعلام هنا دائمًا «طلبات هذه الإقامة»، وهو استعلام مستقلّ لا تضمين متداخل.`,
          }),
        ),
        requestedById: __nullable__(t.String()),
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
        isUrgent: t.Boolean(),
        clinicalInfo: __nullable__(t.String()),
        notes: __nullable__(t.String()),
        isDeleted: t.Boolean(),
        deletedAt: __nullable__(t.Date()),
        createdAt: t.Date(),
        updatedAt: t.Date(),
        releasedToOwnerAt: __nullable__(
          t.Date({
            description: `*
* [D6] نشر النتيجة لمالك الحيوان — انظر الشرح على \`LabTestOrder.releasedToOwnerAt\`.`,
          }),
        ),
        releasedByStaffId: __nullable__(t.String()),
        releaseSummary: __nullable__(t.String()),
      },
      { additionalProperties: false },
    ),
    vitalsRecord: __nullable__(
      t.Object(
        {
          id: t.String(),
          code: t.String(),
          clinicId: t.String(),
          branchId: __nullable__(t.String()),
          patientId: t.String(),
          recordedAt: t.Date(),
          source: t.Union(
            [
              t.Literal("MANUAL"),
              t.Literal("VISIT"),
              t.Literal("LAB"),
              t.Literal("RADIOLOGY"),
              t.Literal("OPERATION"),
              t.Literal("GROOMING"),
              t.Literal("INPATIENT"),
              t.Literal("TRIAGE"),
            ],
            { additionalProperties: false },
          ),
          recordedById: __nullable__(t.String()),
          appointmentId: __nullable__(t.String()),
          labOrderId: __nullable__(t.String()),
          radiologyOrderId: __nullable__(t.String()),
          operationId: __nullable__(t.String()),
          inpatientStayId: __nullable__(t.String()),
          weight: __nullable__(t.Number()),
          temperature: __nullable__(t.Number()),
          heartRate: __nullable__(t.Integer()),
          respiratoryRate: __nullable__(t.Integer()),
          oxygenSaturation: __nullable__(t.Integer()),
          bloodPressure: __nullable__(t.String()),
          painScore: __nullable__(t.Integer()),
          bodyConditionScore: __nullable__(t.Integer()),
          capillaryRefillSec: __nullable__(t.Number()),
          mucousMembrane: __nullable__(
            t.Union(
              [
                t.Literal("PINK"),
                t.Literal("PALE"),
                t.Literal("CYANOTIC"),
                t.Literal("ICTERIC"),
                t.Literal("CONGESTED"),
                t.Literal("MUDDY"),
              ],
              { additionalProperties: false },
            ),
          ),
          notes: __nullable__(t.String()),
          correctsId: __nullable__(t.String()),
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

export const RadiologySafetyScreeningPlainInputCreate = t.Object(
  {
    fastingStatus: t.Optional(
      __nullable__(
        t.Union(
          [t.Literal("FASTED"), t.Literal("PARTIAL"), t.Literal("NOT_FASTED")],
          { additionalProperties: false },
        ),
      ),
    ),
    fastingHours: t.Optional(__nullable__(t.Integer())),
    medications: t.Array(t.String(), { additionalProperties: false }),
    pregnancyPossible: t.Optional(__nullable__(t.Boolean())),
    metalImplants: t.Optional(__nullable__(t.Boolean())),
    implantNotes: t.Optional(__nullable__(t.String())),
    priorContrastReaction: t.Optional(__nullable__(t.Boolean())),
    allergies: t.Optional(__nullable__(t.String())),
    asaClass: t.Optional(__nullable__(t.Integer())),
    weight: t.Optional(__nullable__(t.Number())),
    temperature: t.Optional(__nullable__(t.Number())),
    heartRate: t.Optional(__nullable__(t.Integer())),
    respiratoryRate: t.Optional(__nullable__(t.Integer())),
  },
  { additionalProperties: false },
);

export const RadiologySafetyScreeningPlainInputUpdate = t.Object(
  {
    fastingStatus: t.Optional(
      __nullable__(
        t.Union(
          [t.Literal("FASTED"), t.Literal("PARTIAL"), t.Literal("NOT_FASTED")],
          { additionalProperties: false },
        ),
      ),
    ),
    fastingHours: t.Optional(__nullable__(t.Integer())),
    medications: t.Optional(
      t.Array(t.String(), { additionalProperties: false }),
    ),
    pregnancyPossible: t.Optional(__nullable__(t.Boolean())),
    metalImplants: t.Optional(__nullable__(t.Boolean())),
    implantNotes: t.Optional(__nullable__(t.String())),
    priorContrastReaction: t.Optional(__nullable__(t.Boolean())),
    allergies: t.Optional(__nullable__(t.String())),
    asaClass: t.Optional(__nullable__(t.Integer())),
    weight: t.Optional(__nullable__(t.Number())),
    temperature: t.Optional(__nullable__(t.Number())),
    heartRate: t.Optional(__nullable__(t.Integer())),
    respiratoryRate: t.Optional(__nullable__(t.Integer())),
  },
  { additionalProperties: false },
);

export const RadiologySafetyScreeningRelationsInputCreate = t.Object(
  {
    order: t.Object(
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
    vitalsRecord: t.Optional(
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

export const RadiologySafetyScreeningRelationsInputUpdate = t.Partial(
  t.Object(
    {
      order: t.Object(
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
      vitalsRecord: t.Partial(
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

export const RadiologySafetyScreeningWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          orderId: t.String(),
          fastingStatus: t.Union(
            [
              t.Literal("FASTED"),
              t.Literal("PARTIAL"),
              t.Literal("NOT_FASTED"),
            ],
            { additionalProperties: false },
          ),
          fastingHours: t.Integer(),
          medications: t.Array(t.String(), { additionalProperties: false }),
          pregnancyPossible: t.Boolean(),
          metalImplants: t.Boolean(),
          implantNotes: t.String(),
          priorContrastReaction: t.Boolean(),
          allergies: t.String(),
          asaClass: t.Integer(),
          vitalsRecordId: t.String(),
          weight: t.Number(),
          temperature: t.Number(),
          heartRate: t.Integer(),
          respiratoryRate: t.Integer(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "RadiologySafetyScreening" },
  ),
);

export const RadiologySafetyScreeningWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.String(), orderId: t.String() },
            { additionalProperties: false },
          ),
          { additionalProperties: false },
        ),
        t.Union(
          [t.Object({ id: t.String() }), t.Object({ orderId: t.String() })],
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
              orderId: t.String(),
              fastingStatus: t.Union(
                [
                  t.Literal("FASTED"),
                  t.Literal("PARTIAL"),
                  t.Literal("NOT_FASTED"),
                ],
                { additionalProperties: false },
              ),
              fastingHours: t.Integer(),
              medications: t.Array(t.String(), { additionalProperties: false }),
              pregnancyPossible: t.Boolean(),
              metalImplants: t.Boolean(),
              implantNotes: t.String(),
              priorContrastReaction: t.Boolean(),
              allergies: t.String(),
              asaClass: t.Integer(),
              vitalsRecordId: t.String(),
              weight: t.Number(),
              temperature: t.Number(),
              heartRate: t.Integer(),
              respiratoryRate: t.Integer(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "RadiologySafetyScreening" },
);

export const RadiologySafetyScreeningSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      orderId: t.Boolean(),
      fastingStatus: t.Boolean(),
      fastingHours: t.Boolean(),
      medications: t.Boolean(),
      pregnancyPossible: t.Boolean(),
      metalImplants: t.Boolean(),
      implantNotes: t.Boolean(),
      priorContrastReaction: t.Boolean(),
      allergies: t.Boolean(),
      asaClass: t.Boolean(),
      vitalsRecordId: t.Boolean(),
      weight: t.Boolean(),
      temperature: t.Boolean(),
      heartRate: t.Boolean(),
      respiratoryRate: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      order: t.Boolean(),
      vitalsRecord: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const RadiologySafetyScreeningInclude = t.Partial(
  t.Object(
    {
      fastingStatus: t.Boolean(),
      order: t.Boolean(),
      vitalsRecord: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const RadiologySafetyScreeningOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      orderId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      fastingHours: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      medications: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      pregnancyPossible: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      metalImplants: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      implantNotes: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      priorContrastReaction: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      allergies: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      asaClass: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      vitalsRecordId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      weight: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      temperature: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      heartRate: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      respiratoryRate: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const RadiologySafetyScreening = t.Composite(
  [RadiologySafetyScreeningPlain, RadiologySafetyScreeningRelations],
  { additionalProperties: false },
);

export const RadiologySafetyScreeningInputCreate = t.Composite(
  [
    RadiologySafetyScreeningPlainInputCreate,
    RadiologySafetyScreeningRelationsInputCreate,
  ],
  { additionalProperties: false },
);

export const RadiologySafetyScreeningInputUpdate = t.Composite(
  [
    RadiologySafetyScreeningPlainInputUpdate,
    RadiologySafetyScreeningRelationsInputUpdate,
  ],
  { additionalProperties: false },
);
