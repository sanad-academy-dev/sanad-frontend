import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const ServiceAddressPlain = t.Object(
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
);

export const ServiceAddressRelations = t.Object(
  {
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
    owner: __nullable__(
      t.Object(
        {
          id: t.String(),
          code: t.String(),
          clinicId: t.String(),
          name: t.String(),
          phone: t.String(),
          phoneE164: __nullable__(t.String()),
          email: __nullable__(t.String()),
          gender: __nullable__(
            t.Union(
              [t.Literal("MALE"), t.Literal("FEMALE"), t.Literal("UNKNOWN")],
              { additionalProperties: false },
            ),
          ),
          ownerType: t.Union(
            [
              t.Literal("ALL"),
              t.Literal("VIP"),
              t.Literal("LOYALTY"),
              t.Literal("NEW"),
              t.Literal("CURRENT"),
            ],
            { additionalProperties: false },
          ),
          relationship: __nullable__(
            t.Union(
              [
                t.Literal("OWNER"),
                t.Literal("GUARDIAN"),
                t.Literal("DELEGATE"),
                t.Literal("EMERGENCY"),
              ],
              { additionalProperties: false },
            ),
          ),
          country: __nullable__(t.String()),
          city: __nullable__(t.String()),
          address: __nullable__(t.String()),
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
    ),
    mobileVisits: t.Array(
      t.Object(
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
      ),
      { additionalProperties: false },
    ),
    appointments: t.Array(
      t.Object(
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
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const ServiceAddressPlainInputCreate = t.Object(
  {
    label: t.Optional(__nullable__(t.String())),
    line1: t.String(),
    district: t.Optional(__nullable__(t.String())),
    city: t.Optional(__nullable__(t.String())),
    landmark: t.Optional(__nullable__(t.String())),
    lat: t.Optional(__nullable__(t.Number())),
    lng: t.Optional(__nullable__(t.Number())),
    geocodeSource: t.Optional(
      __nullable__(
        t.Union(
          [
            t.Literal("MANUAL_PIN"),
            t.Literal("NOMINATIM"),
            t.Literal("DEVICE_GPS"),
          ],
          { additionalProperties: false },
        ),
      ),
    ),
    accessNotes: t.Optional(__nullable__(t.String())),
    isDefault: t.Optional(t.Boolean()),
    isDeleted: t.Optional(t.Boolean()),
    deletedAt: t.Optional(__nullable__(t.Date())),
  },
  { additionalProperties: false },
);

export const ServiceAddressPlainInputUpdate = t.Object(
  {
    label: t.Optional(__nullable__(t.String())),
    line1: t.Optional(t.String()),
    district: t.Optional(__nullable__(t.String())),
    city: t.Optional(__nullable__(t.String())),
    landmark: t.Optional(__nullable__(t.String())),
    lat: t.Optional(__nullable__(t.Number())),
    lng: t.Optional(__nullable__(t.Number())),
    geocodeSource: t.Optional(
      __nullable__(
        t.Union(
          [
            t.Literal("MANUAL_PIN"),
            t.Literal("NOMINATIM"),
            t.Literal("DEVICE_GPS"),
          ],
          { additionalProperties: false },
        ),
      ),
    ),
    accessNotes: t.Optional(__nullable__(t.String())),
    isDefault: t.Optional(t.Boolean()),
    isDeleted: t.Optional(t.Boolean()),
    deletedAt: t.Optional(__nullable__(t.Date())),
  },
  { additionalProperties: false },
);

export const ServiceAddressRelationsInputCreate = t.Object(
  {
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
    owner: t.Optional(
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
    mobileVisits: t.Optional(
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
    appointments: t.Optional(
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

export const ServiceAddressRelationsInputUpdate = t.Partial(
  t.Object(
    {
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
      owner: t.Partial(
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
      mobileVisits: t.Partial(
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
      appointments: t.Partial(
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

export const ServiceAddressWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          clinicId: t.String(),
          ownerId: t.String(),
          label: t.String(),
          line1: t.String(),
          district: t.String(),
          city: t.String(),
          landmark: t.String(),
          lat: t.Number(),
          lng: t.Number(),
          geocodeSource: t.Union(
            [
              t.Literal("MANUAL_PIN"),
              t.Literal("NOMINATIM"),
              t.Literal("DEVICE_GPS"),
            ],
            { additionalProperties: false },
          ),
          accessNotes: t.String(),
          isDefault: t.Boolean(),
          isDeleted: t.Boolean(),
          deletedAt: t.Date(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "ServiceAddress" },
  ),
);

export const ServiceAddressWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object({ id: t.String() }, { additionalProperties: false }),
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
              clinicId: t.String(),
              ownerId: t.String(),
              label: t.String(),
              line1: t.String(),
              district: t.String(),
              city: t.String(),
              landmark: t.String(),
              lat: t.Number(),
              lng: t.Number(),
              geocodeSource: t.Union(
                [
                  t.Literal("MANUAL_PIN"),
                  t.Literal("NOMINATIM"),
                  t.Literal("DEVICE_GPS"),
                ],
                { additionalProperties: false },
              ),
              accessNotes: t.String(),
              isDefault: t.Boolean(),
              isDeleted: t.Boolean(),
              deletedAt: t.Date(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "ServiceAddress" },
);

export const ServiceAddressSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      clinicId: t.Boolean(),
      ownerId: t.Boolean(),
      label: t.Boolean(),
      line1: t.Boolean(),
      district: t.Boolean(),
      city: t.Boolean(),
      landmark: t.Boolean(),
      lat: t.Boolean(),
      lng: t.Boolean(),
      geocodeSource: t.Boolean(),
      accessNotes: t.Boolean(),
      isDefault: t.Boolean(),
      isDeleted: t.Boolean(),
      deletedAt: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinic: t.Boolean(),
      owner: t.Boolean(),
      mobileVisits: t.Boolean(),
      appointments: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const ServiceAddressInclude = t.Partial(
  t.Object(
    {
      geocodeSource: t.Boolean(),
      clinic: t.Boolean(),
      owner: t.Boolean(),
      mobileVisits: t.Boolean(),
      appointments: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const ServiceAddressOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clinicId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      ownerId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      label: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      line1: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      district: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      city: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      landmark: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      lat: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      lng: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      accessNotes: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      isDefault: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      isDeleted: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      deletedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const ServiceAddress = t.Composite(
  [ServiceAddressPlain, ServiceAddressRelations],
  { additionalProperties: false },
);

export const ServiceAddressInputCreate = t.Composite(
  [ServiceAddressPlainInputCreate, ServiceAddressRelationsInputCreate],
  { additionalProperties: false },
);

export const ServiceAddressInputUpdate = t.Composite(
  [ServiceAddressPlainInputUpdate, ServiceAddressRelationsInputUpdate],
  { additionalProperties: false },
);
