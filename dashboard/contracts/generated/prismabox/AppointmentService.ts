import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const AppointmentServicePlain = t.Object(
  {
    id: t.String(),
    appointmentId: t.String(),
    serviceId: t.String(),
    quantity: t.Integer(),
    priceSnapshot: t.Number(),
    durationSnapshot: t.Integer(),
    paidAt: __nullable__(t.Date()),
  },
  { additionalProperties: false },
);

export const AppointmentServiceRelations = t.Object(
  {
    appointment: t.Object(
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
    service: t.Object(
      {
        id: t.String(),
        name: t.String(),
        level: t.Union(
          [t.Literal("CATEGORY"), t.Literal("SUBCATEGORY"), t.Literal("ITEM")],
          { additionalProperties: false },
        ),
        parentId: __nullable__(t.String()),
        isDefault: t.Boolean(),
        clinicId: __nullable__(t.String()),
        order: t.Integer(),
        isLabCategory: t.Boolean(),
        isRadiologyCategory: t.Boolean(),
        isOperationCategory: t.Boolean(),
        isGroomingCategory: t.Boolean(),
        consentCode: __nullable__(t.String()),
        createdAt: t.Date(),
      },
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const AppointmentServicePlainInputCreate = t.Object(
  {
    quantity: t.Optional(t.Integer()),
    priceSnapshot: t.Number(),
    durationSnapshot: t.Integer(),
    paidAt: t.Optional(__nullable__(t.Date())),
  },
  { additionalProperties: false },
);

export const AppointmentServicePlainInputUpdate = t.Object(
  {
    quantity: t.Optional(t.Integer()),
    priceSnapshot: t.Optional(t.Number()),
    durationSnapshot: t.Optional(t.Integer()),
    paidAt: t.Optional(__nullable__(t.Date())),
  },
  { additionalProperties: false },
);

export const AppointmentServiceRelationsInputCreate = t.Object(
  {
    appointment: t.Object(
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
    service: t.Object(
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
  { additionalProperties: false },
);

export const AppointmentServiceRelationsInputUpdate = t.Partial(
  t.Object(
    {
      appointment: t.Object(
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
      service: t.Object(
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
    { additionalProperties: false },
  ),
);

export const AppointmentServiceWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          appointmentId: t.String(),
          serviceId: t.String(),
          quantity: t.Integer(),
          priceSnapshot: t.Number(),
          durationSnapshot: t.Integer(),
          paidAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "AppointmentService" },
  ),
);

export const AppointmentServiceWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            {
              id: t.String(),
              appointmentId_serviceId: t.Object(
                { appointmentId: t.String(), serviceId: t.String() },
                { additionalProperties: false },
              ),
            },
            { additionalProperties: false },
          ),
          { additionalProperties: false },
        ),
        t.Union(
          [
            t.Object({ id: t.String() }),
            t.Object({
              appointmentId_serviceId: t.Object(
                { appointmentId: t.String(), serviceId: t.String() },
                { additionalProperties: false },
              ),
            }),
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
              appointmentId: t.String(),
              serviceId: t.String(),
              quantity: t.Integer(),
              priceSnapshot: t.Number(),
              durationSnapshot: t.Integer(),
              paidAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "AppointmentService" },
);

export const AppointmentServiceSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      appointmentId: t.Boolean(),
      serviceId: t.Boolean(),
      quantity: t.Boolean(),
      priceSnapshot: t.Boolean(),
      durationSnapshot: t.Boolean(),
      paidAt: t.Boolean(),
      appointment: t.Boolean(),
      service: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const AppointmentServiceInclude = t.Partial(
  t.Object(
    { appointment: t.Boolean(), service: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const AppointmentServiceOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      appointmentId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      serviceId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      quantity: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      priceSnapshot: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      durationSnapshot: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      paidAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const AppointmentService = t.Composite(
  [AppointmentServicePlain, AppointmentServiceRelations],
  { additionalProperties: false },
);

export const AppointmentServiceInputCreate = t.Composite(
  [AppointmentServicePlainInputCreate, AppointmentServiceRelationsInputCreate],
  { additionalProperties: false },
);

export const AppointmentServiceInputUpdate = t.Composite(
  [AppointmentServicePlainInputUpdate, AppointmentServiceRelationsInputUpdate],
  { additionalProperties: false },
);
