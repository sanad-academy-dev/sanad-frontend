import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const MobileVisitPlain = t.Object(
  {
    id: t.String(),
    appointmentId: t.String(),
    clinicId: t.String(),
    mobileUnitId: __nullable__(t.String()),
    shiftId: __nullable__(t.String()),
    serviceAddressId: t.String(),
    sequence: __nullable__(t.Integer()),
    windowStart: __nullable__(t.Date()),
    windowEnd: __nullable__(t.Date()),
    etaAt: __nullable__(t.Date()),
    dispatchStage: t.Union(
      [
        t.Literal("PENDING"),
        t.Literal("ASSIGNED"),
        t.Literal("EN_ROUTE"),
        t.Literal("ARRIVED"),
        t.Literal("IN_SERVICE"),
        t.Literal("COMPLETED"),
        t.Literal("FAILED"),
        t.Literal("CANCELLED"),
      ],
      { additionalProperties: false },
    ),
    enRouteAt: __nullable__(t.Date()),
    arrivedAt: __nullable__(t.Date()),
    departedAt: __nullable__(t.Date()),
    arrivalLat: __nullable__(t.Number()),
    arrivalLng: __nullable__(t.Number()),
    arrivalDriftM: __nullable__(t.Integer()),
    distanceKm: __nullable__(t.Number()),
    travelMinutes: __nullable__(t.Integer()),
    travelFee: __nullable__(t.Number()),
    failureReason: __nullable__(
      t.Union(
        [
          t.Literal("NO_ANSWER"),
          t.Literal("ADDRESS_NOT_FOUND"),
          t.Literal("ACCESS_DENIED"),
          t.Literal("PET_UNAVAILABLE"),
          t.Literal("OWNER_CANCELLED"),
          t.Literal("VEHICLE_ISSUE"),
          t.Literal("WEATHER"),
          t.Literal("OTHER"),
        ],
        { additionalProperties: false },
      ),
    ),
    failureNote: __nullable__(t.String()),
    signatureUrl: __nullable__(t.String()),
    photos: t.Array(t.String(), { additionalProperties: false }),
    trackingToken: t.String(),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  },
  { additionalProperties: false },
);

export const MobileVisitRelations = t.Object(
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
    mobileUnit: __nullable__(
      t.Object(
        {
          id: t.String(),
          code: t.String(),
          clinicId: t.String(),
          branchId: t.String(),
          warehouseId: t.String(),
          name: t.String(),
          plateNumber: __nullable__(t.String()),
          vehicleMake: __nullable__(t.String()),
          vehicleModel: __nullable__(t.String()),
          year: __nullable__(t.Integer()),
          color: __nullable__(t.String()),
          photo: __nullable__(t.String()),
          status: t.Union(
            [
              t.Literal("OFFLINE"),
              t.Literal("AVAILABLE"),
              t.Literal("EN_ROUTE"),
              t.Literal("ON_SITE"),
              t.Literal("RETURNING"),
              t.Literal("ON_BREAK"),
              t.Literal("OUT_OF_SERVICE"),
            ],
            { additionalProperties: false },
          ),
          active: t.Boolean(),
          isDeleted: t.Boolean(),
          deletedAt: __nullable__(t.Date()),
          lastLat: __nullable__(t.Number()),
          lastLng: __nullable__(t.Number()),
          lastLocationAt: __nullable__(t.Date()),
          lastSpeedKph: __nullable__(t.Number()),
          lastHeading: __nullable__(t.Integer()),
          lastBatteryPct: __nullable__(t.Integer()),
          settings: __nullable__(t.Any()),
          notes: __nullable__(t.String()),
          editsCount: t.Integer(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    ),
    shift: __nullable__(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          mobileUnitId: t.String(),
          openedByStaffId: t.String(),
          startedAt: t.Date(),
          endedAt: __nullable__(t.Date()),
          odometerStart: __nullable__(t.Integer()),
          odometerEnd: __nullable__(t.Integer()),
          startLat: __nullable__(t.Number()),
          startLng: __nullable__(t.Number()),
          distanceKm: __nullable__(t.Number()),
          notes: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    ),
    serviceAddress: t.Object(
      {
        id: t.String(),
        clinicId: t.String(),
        ownerId: __nullable__(t.String()),
        label: __nullable__(t.String()),
        line1: t.String(),
        district: __nullable__(t.String()),
        city: __nullable__(t.String()),
        landmark: __nullable__(t.String()),
        lat: __nullable__(t.Number()),
        lng: __nullable__(t.Number()),
        geocodeSource: __nullable__(
          t.Union(
            [
              t.Literal("MANUAL_PIN"),
              t.Literal("NOMINATIM"),
              t.Literal("DEVICE_GPS"),
            ],
            { additionalProperties: false },
          ),
        ),
        accessNotes: __nullable__(t.String()),
        isDefault: t.Boolean(),
        isDeleted: t.Boolean(),
        deletedAt: __nullable__(t.Date()),
        createdAt: t.Date(),
        updatedAt: t.Date(),
      },
      { additionalProperties: false },
    ),
    services: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          mobileVisitId: t.String(),
          serviceId: t.String(),
          quantity: t.Integer(),
          priceSnapshot: t.Number(),
          durationSnapshot: t.Integer(),
          source: t.Union([t.Literal("SCHEDULED"), t.Literal("FIELD")], {
            additionalProperties: false,
            description: `من أين جاء سطر الخدمة: كان على الموعد قبل الانطلاق، أم أضافه الطاقم في الموقع.
التمييز هو ما يجعل تقرير «ما زاد عن المجدول» ممكنًا أصلًا.`,
          }),
          performedAt: t.Date(),
          performedByStaffId: __nullable__(t.String()),
          notes: __nullable__(t.String()),
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

export const MobileVisitPlainInputCreate = t.Object(
  {
    sequence: t.Optional(__nullable__(t.Integer())),
    windowStart: t.Optional(__nullable__(t.Date())),
    windowEnd: t.Optional(__nullable__(t.Date())),
    etaAt: t.Optional(__nullable__(t.Date())),
    dispatchStage: t.Optional(
      t.Union(
        [
          t.Literal("PENDING"),
          t.Literal("ASSIGNED"),
          t.Literal("EN_ROUTE"),
          t.Literal("ARRIVED"),
          t.Literal("IN_SERVICE"),
          t.Literal("COMPLETED"),
          t.Literal("FAILED"),
          t.Literal("CANCELLED"),
        ],
        { additionalProperties: false },
      ),
    ),
    enRouteAt: t.Optional(__nullable__(t.Date())),
    arrivedAt: t.Optional(__nullable__(t.Date())),
    departedAt: t.Optional(__nullable__(t.Date())),
    arrivalLat: t.Optional(__nullable__(t.Number())),
    arrivalLng: t.Optional(__nullable__(t.Number())),
    arrivalDriftM: t.Optional(__nullable__(t.Integer())),
    distanceKm: t.Optional(__nullable__(t.Number())),
    travelMinutes: t.Optional(__nullable__(t.Integer())),
    travelFee: t.Optional(__nullable__(t.Number())),
    failureReason: t.Optional(
      __nullable__(
        t.Union(
          [
            t.Literal("NO_ANSWER"),
            t.Literal("ADDRESS_NOT_FOUND"),
            t.Literal("ACCESS_DENIED"),
            t.Literal("PET_UNAVAILABLE"),
            t.Literal("OWNER_CANCELLED"),
            t.Literal("VEHICLE_ISSUE"),
            t.Literal("WEATHER"),
            t.Literal("OTHER"),
          ],
          { additionalProperties: false },
        ),
      ),
    ),
    failureNote: t.Optional(__nullable__(t.String())),
    signatureUrl: t.Optional(__nullable__(t.String())),
    photos: t.Array(t.String(), { additionalProperties: false }),
    trackingToken: t.String(),
  },
  { additionalProperties: false },
);

export const MobileVisitPlainInputUpdate = t.Object(
  {
    sequence: t.Optional(__nullable__(t.Integer())),
    windowStart: t.Optional(__nullable__(t.Date())),
    windowEnd: t.Optional(__nullable__(t.Date())),
    etaAt: t.Optional(__nullable__(t.Date())),
    dispatchStage: t.Optional(
      t.Union(
        [
          t.Literal("PENDING"),
          t.Literal("ASSIGNED"),
          t.Literal("EN_ROUTE"),
          t.Literal("ARRIVED"),
          t.Literal("IN_SERVICE"),
          t.Literal("COMPLETED"),
          t.Literal("FAILED"),
          t.Literal("CANCELLED"),
        ],
        { additionalProperties: false },
      ),
    ),
    enRouteAt: t.Optional(__nullable__(t.Date())),
    arrivedAt: t.Optional(__nullable__(t.Date())),
    departedAt: t.Optional(__nullable__(t.Date())),
    arrivalLat: t.Optional(__nullable__(t.Number())),
    arrivalLng: t.Optional(__nullable__(t.Number())),
    arrivalDriftM: t.Optional(__nullable__(t.Integer())),
    distanceKm: t.Optional(__nullable__(t.Number())),
    travelMinutes: t.Optional(__nullable__(t.Integer())),
    travelFee: t.Optional(__nullable__(t.Number())),
    failureReason: t.Optional(
      __nullable__(
        t.Union(
          [
            t.Literal("NO_ANSWER"),
            t.Literal("ADDRESS_NOT_FOUND"),
            t.Literal("ACCESS_DENIED"),
            t.Literal("PET_UNAVAILABLE"),
            t.Literal("OWNER_CANCELLED"),
            t.Literal("VEHICLE_ISSUE"),
            t.Literal("WEATHER"),
            t.Literal("OTHER"),
          ],
          { additionalProperties: false },
        ),
      ),
    ),
    failureNote: t.Optional(__nullable__(t.String())),
    signatureUrl: t.Optional(__nullable__(t.String())),
    photos: t.Optional(t.Array(t.String(), { additionalProperties: false })),
    trackingToken: t.Optional(t.String()),
  },
  { additionalProperties: false },
);

export const MobileVisitRelationsInputCreate = t.Object(
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
    mobileUnit: t.Optional(
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
    shift: t.Optional(
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
    serviceAddress: t.Object(
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
    services: t.Optional(
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

export const MobileVisitRelationsInputUpdate = t.Partial(
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
      mobileUnit: t.Partial(
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
      shift: t.Partial(
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
      serviceAddress: t.Object(
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
      services: t.Partial(
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

export const MobileVisitWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          appointmentId: t.String(),
          clinicId: t.String(),
          mobileUnitId: t.String(),
          shiftId: t.String(),
          serviceAddressId: t.String(),
          sequence: t.Integer(),
          windowStart: t.Date(),
          windowEnd: t.Date(),
          etaAt: t.Date(),
          dispatchStage: t.Union(
            [
              t.Literal("PENDING"),
              t.Literal("ASSIGNED"),
              t.Literal("EN_ROUTE"),
              t.Literal("ARRIVED"),
              t.Literal("IN_SERVICE"),
              t.Literal("COMPLETED"),
              t.Literal("FAILED"),
              t.Literal("CANCELLED"),
            ],
            { additionalProperties: false },
          ),
          enRouteAt: t.Date(),
          arrivedAt: t.Date(),
          departedAt: t.Date(),
          arrivalLat: t.Number(),
          arrivalLng: t.Number(),
          arrivalDriftM: t.Integer(),
          distanceKm: t.Number(),
          travelMinutes: t.Integer(),
          travelFee: t.Number(),
          failureReason: t.Union(
            [
              t.Literal("NO_ANSWER"),
              t.Literal("ADDRESS_NOT_FOUND"),
              t.Literal("ACCESS_DENIED"),
              t.Literal("PET_UNAVAILABLE"),
              t.Literal("OWNER_CANCELLED"),
              t.Literal("VEHICLE_ISSUE"),
              t.Literal("WEATHER"),
              t.Literal("OTHER"),
            ],
            { additionalProperties: false },
          ),
          failureNote: t.String(),
          signatureUrl: t.String(),
          photos: t.Array(t.String(), { additionalProperties: false }),
          trackingToken: t.String(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "MobileVisit" },
  ),
);

export const MobileVisitWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            {
              id: t.String(),
              appointmentId: t.String(),
              trackingToken: t.String(),
            },
            { additionalProperties: false },
          ),
          { additionalProperties: false },
        ),
        t.Union(
          [
            t.Object({ id: t.String() }),
            t.Object({ appointmentId: t.String() }),
            t.Object({ trackingToken: t.String() }),
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
              clinicId: t.String(),
              mobileUnitId: t.String(),
              shiftId: t.String(),
              serviceAddressId: t.String(),
              sequence: t.Integer(),
              windowStart: t.Date(),
              windowEnd: t.Date(),
              etaAt: t.Date(),
              dispatchStage: t.Union(
                [
                  t.Literal("PENDING"),
                  t.Literal("ASSIGNED"),
                  t.Literal("EN_ROUTE"),
                  t.Literal("ARRIVED"),
                  t.Literal("IN_SERVICE"),
                  t.Literal("COMPLETED"),
                  t.Literal("FAILED"),
                  t.Literal("CANCELLED"),
                ],
                { additionalProperties: false },
              ),
              enRouteAt: t.Date(),
              arrivedAt: t.Date(),
              departedAt: t.Date(),
              arrivalLat: t.Number(),
              arrivalLng: t.Number(),
              arrivalDriftM: t.Integer(),
              distanceKm: t.Number(),
              travelMinutes: t.Integer(),
              travelFee: t.Number(),
              failureReason: t.Union(
                [
                  t.Literal("NO_ANSWER"),
                  t.Literal("ADDRESS_NOT_FOUND"),
                  t.Literal("ACCESS_DENIED"),
                  t.Literal("PET_UNAVAILABLE"),
                  t.Literal("OWNER_CANCELLED"),
                  t.Literal("VEHICLE_ISSUE"),
                  t.Literal("WEATHER"),
                  t.Literal("OTHER"),
                ],
                { additionalProperties: false },
              ),
              failureNote: t.String(),
              signatureUrl: t.String(),
              photos: t.Array(t.String(), { additionalProperties: false }),
              trackingToken: t.String(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "MobileVisit" },
);

export const MobileVisitSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      appointmentId: t.Boolean(),
      clinicId: t.Boolean(),
      mobileUnitId: t.Boolean(),
      shiftId: t.Boolean(),
      serviceAddressId: t.Boolean(),
      sequence: t.Boolean(),
      windowStart: t.Boolean(),
      windowEnd: t.Boolean(),
      etaAt: t.Boolean(),
      dispatchStage: t.Boolean(),
      enRouteAt: t.Boolean(),
      arrivedAt: t.Boolean(),
      departedAt: t.Boolean(),
      arrivalLat: t.Boolean(),
      arrivalLng: t.Boolean(),
      arrivalDriftM: t.Boolean(),
      distanceKm: t.Boolean(),
      travelMinutes: t.Boolean(),
      travelFee: t.Boolean(),
      failureReason: t.Boolean(),
      failureNote: t.Boolean(),
      signatureUrl: t.Boolean(),
      photos: t.Boolean(),
      trackingToken: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      appointment: t.Boolean(),
      clinic: t.Boolean(),
      mobileUnit: t.Boolean(),
      shift: t.Boolean(),
      serviceAddress: t.Boolean(),
      services: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const MobileVisitInclude = t.Partial(
  t.Object(
    {
      dispatchStage: t.Boolean(),
      failureReason: t.Boolean(),
      appointment: t.Boolean(),
      clinic: t.Boolean(),
      mobileUnit: t.Boolean(),
      shift: t.Boolean(),
      serviceAddress: t.Boolean(),
      services: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const MobileVisitOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      appointmentId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clinicId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      mobileUnitId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      shiftId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      serviceAddressId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      sequence: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      windowStart: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      windowEnd: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      etaAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      enRouteAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      arrivedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      departedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      arrivalLat: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      arrivalLng: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      arrivalDriftM: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      distanceKm: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      travelMinutes: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      travelFee: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      failureNote: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      signatureUrl: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      photos: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      trackingToken: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const MobileVisit = t.Composite(
  [MobileVisitPlain, MobileVisitRelations],
  { additionalProperties: false },
);

export const MobileVisitInputCreate = t.Composite(
  [MobileVisitPlainInputCreate, MobileVisitRelationsInputCreate],
  { additionalProperties: false },
);

export const MobileVisitInputUpdate = t.Composite(
  [MobileVisitPlainInputUpdate, MobileVisitRelationsInputUpdate],
  { additionalProperties: false },
);
