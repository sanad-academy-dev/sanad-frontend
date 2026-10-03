import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const MobileBookingRequestPlain = t.Object(
  {
    id: t.String(),
    code: t.String(),
    clinicId: t.String(),
    ownerName: t.String(),
    phone: t.String(),
    email: __nullable__(t.String()),
    ownerId: __nullable__(t.String()),
    addressLine: t.String(),
    district: __nullable__(t.String()),
    city: __nullable__(t.String()),
    lat: __nullable__(t.Number()),
    lng: __nullable__(t.Number()),
    landmark: __nullable__(t.String()),
    animalTypeId: __nullable__(t.String()),
    petName: __nullable__(t.String()),
    petNotes: __nullable__(t.String()),
    serviceIds: t.Array(t.String(), { additionalProperties: false }),
    preferredDate: __nullable__(t.Date()),
    preferredWindow: __nullable__(
      t.Union(
        [
          t.Literal("MORNING"),
          t.Literal("AFTERNOON"),
          t.Literal("EVENING"),
          t.Literal("ANY"),
        ],
        { additionalProperties: false },
      ),
    ),
    notes: __nullable__(t.String()),
    attachments: t.Array(t.String(), { additionalProperties: false }),
    status: t.Union(
      [
        t.Literal("NEW"),
        t.Literal("CONTACTED"),
        t.Literal("SCHEDULED"),
        t.Literal("REJECTED"),
        t.Literal("SPAM"),
      ],
      { additionalProperties: false },
    ),
    zoneId: __nullable__(t.String()),
    appointmentId: __nullable__(t.String()),
    handledById: __nullable__(t.String()),
    handledAt: __nullable__(t.Date()),
    rejectionReason: __nullable__(t.String()),
    ipHash: __nullable__(t.String()),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  },
  { additionalProperties: false },
);

export const MobileBookingRequestRelations = t.Object(
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
    animalType: __nullable__(
      t.Object(
        {
          id: t.String(),
          code: __nullable__(t.String()),
          arName: t.String(),
          enName: t.String(),
          isDefault: t.Boolean(),
          clinicId: __nullable__(t.String()),
          createdAt: t.Date(),
          species: __nullable__(
            t.Union(
              [
                t.Literal("DOG"),
                t.Literal("CAT"),
                t.Literal("HORSE"),
                t.Literal("CATTLE"),
                t.Literal("SHEEP"),
                t.Literal("GOAT"),
                t.Literal("CAMEL"),
                t.Literal("POULTRY"),
                t.Literal("RABBIT"),
                t.Literal("SWINE"),
                t.Literal("FISH"),
                t.Literal("BEE"),
              ],
              { additionalProperties: false },
            ),
          ),
        },
        { additionalProperties: false },
      ),
    ),
    appointment: __nullable__(
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
    ),
    handledBy: __nullable__(
      t.Object(
        {
          id: t.String(),
          name: t.String(),
          email: t.String(),
          emailVerified: t.Boolean(),
          image: __nullable__(t.String()),
          phone: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    ),
    zone: __nullable__(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          name: t.String(),
          color: __nullable__(t.String()),
          shape: t.Union([t.Literal("CIRCLE"), t.Literal("POLYGON")], {
            additionalProperties: false,
          }),
          centerLat: __nullable__(t.Number()),
          centerLng: __nullable__(t.Number()),
          radiusKm: __nullable__(t.Number()),
          polygon: __nullable__(t.Any()),
          travelFee: __nullable__(t.Number()),
          active: t.Boolean(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    ),
  },
  { additionalProperties: false },
);

export const MobileBookingRequestPlainInputCreate = t.Object(
  {
    code: t.String(),
    ownerName: t.String(),
    phone: t.String(),
    email: t.Optional(__nullable__(t.String())),
    addressLine: t.String(),
    district: t.Optional(__nullable__(t.String())),
    city: t.Optional(__nullable__(t.String())),
    lat: t.Optional(__nullable__(t.Number())),
    lng: t.Optional(__nullable__(t.Number())),
    landmark: t.Optional(__nullable__(t.String())),
    petName: t.Optional(__nullable__(t.String())),
    petNotes: t.Optional(__nullable__(t.String())),
    serviceIds: t.Array(t.String(), { additionalProperties: false }),
    preferredDate: t.Optional(__nullable__(t.Date())),
    preferredWindow: t.Optional(
      __nullable__(
        t.Union(
          [
            t.Literal("MORNING"),
            t.Literal("AFTERNOON"),
            t.Literal("EVENING"),
            t.Literal("ANY"),
          ],
          { additionalProperties: false },
        ),
      ),
    ),
    notes: t.Optional(__nullable__(t.String())),
    attachments: t.Array(t.String(), { additionalProperties: false }),
    status: t.Optional(
      t.Union(
        [
          t.Literal("NEW"),
          t.Literal("CONTACTED"),
          t.Literal("SCHEDULED"),
          t.Literal("REJECTED"),
          t.Literal("SPAM"),
        ],
        { additionalProperties: false },
      ),
    ),
    handledAt: t.Optional(__nullable__(t.Date())),
    rejectionReason: t.Optional(__nullable__(t.String())),
    ipHash: t.Optional(__nullable__(t.String())),
  },
  { additionalProperties: false },
);

export const MobileBookingRequestPlainInputUpdate = t.Object(
  {
    code: t.Optional(t.String()),
    ownerName: t.Optional(t.String()),
    phone: t.Optional(t.String()),
    email: t.Optional(__nullable__(t.String())),
    addressLine: t.Optional(t.String()),
    district: t.Optional(__nullable__(t.String())),
    city: t.Optional(__nullable__(t.String())),
    lat: t.Optional(__nullable__(t.Number())),
    lng: t.Optional(__nullable__(t.Number())),
    landmark: t.Optional(__nullable__(t.String())),
    petName: t.Optional(__nullable__(t.String())),
    petNotes: t.Optional(__nullable__(t.String())),
    serviceIds: t.Optional(
      t.Array(t.String(), { additionalProperties: false }),
    ),
    preferredDate: t.Optional(__nullable__(t.Date())),
    preferredWindow: t.Optional(
      __nullable__(
        t.Union(
          [
            t.Literal("MORNING"),
            t.Literal("AFTERNOON"),
            t.Literal("EVENING"),
            t.Literal("ANY"),
          ],
          { additionalProperties: false },
        ),
      ),
    ),
    notes: t.Optional(__nullable__(t.String())),
    attachments: t.Optional(
      t.Array(t.String(), { additionalProperties: false }),
    ),
    status: t.Optional(
      t.Union(
        [
          t.Literal("NEW"),
          t.Literal("CONTACTED"),
          t.Literal("SCHEDULED"),
          t.Literal("REJECTED"),
          t.Literal("SPAM"),
        ],
        { additionalProperties: false },
      ),
    ),
    handledAt: t.Optional(__nullable__(t.Date())),
    rejectionReason: t.Optional(__nullable__(t.String())),
    ipHash: t.Optional(__nullable__(t.String())),
  },
  { additionalProperties: false },
);

export const MobileBookingRequestRelationsInputCreate = t.Object(
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
    animalType: t.Optional(
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
    appointment: t.Optional(
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
    handledBy: t.Optional(
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
    zone: t.Optional(
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

export const MobileBookingRequestRelationsInputUpdate = t.Partial(
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
      animalType: t.Partial(
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
      appointment: t.Partial(
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
      handledBy: t.Partial(
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
      zone: t.Partial(
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

export const MobileBookingRequestWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          code: t.String(),
          clinicId: t.String(),
          ownerName: t.String(),
          phone: t.String(),
          email: t.String(),
          ownerId: t.String(),
          addressLine: t.String(),
          district: t.String(),
          city: t.String(),
          lat: t.Number(),
          lng: t.Number(),
          landmark: t.String(),
          animalTypeId: t.String(),
          petName: t.String(),
          petNotes: t.String(),
          serviceIds: t.Array(t.String(), { additionalProperties: false }),
          preferredDate: t.Date(),
          preferredWindow: t.Union(
            [
              t.Literal("MORNING"),
              t.Literal("AFTERNOON"),
              t.Literal("EVENING"),
              t.Literal("ANY"),
            ],
            { additionalProperties: false },
          ),
          notes: t.String(),
          attachments: t.Array(t.String(), { additionalProperties: false }),
          status: t.Union(
            [
              t.Literal("NEW"),
              t.Literal("CONTACTED"),
              t.Literal("SCHEDULED"),
              t.Literal("REJECTED"),
              t.Literal("SPAM"),
            ],
            { additionalProperties: false },
          ),
          zoneId: t.String(),
          appointmentId: t.String(),
          handledById: t.String(),
          handledAt: t.Date(),
          rejectionReason: t.String(),
          ipHash: t.String(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "MobileBookingRequest" },
  ),
);

export const MobileBookingRequestWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.String(), code: t.String(), appointmentId: t.String() },
            { additionalProperties: false },
          ),
          { additionalProperties: false },
        ),
        t.Union(
          [
            t.Object({ id: t.String() }),
            t.Object({ code: t.String() }),
            t.Object({ appointmentId: t.String() }),
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
              code: t.String(),
              clinicId: t.String(),
              ownerName: t.String(),
              phone: t.String(),
              email: t.String(),
              ownerId: t.String(),
              addressLine: t.String(),
              district: t.String(),
              city: t.String(),
              lat: t.Number(),
              lng: t.Number(),
              landmark: t.String(),
              animalTypeId: t.String(),
              petName: t.String(),
              petNotes: t.String(),
              serviceIds: t.Array(t.String(), { additionalProperties: false }),
              preferredDate: t.Date(),
              preferredWindow: t.Union(
                [
                  t.Literal("MORNING"),
                  t.Literal("AFTERNOON"),
                  t.Literal("EVENING"),
                  t.Literal("ANY"),
                ],
                { additionalProperties: false },
              ),
              notes: t.String(),
              attachments: t.Array(t.String(), { additionalProperties: false }),
              status: t.Union(
                [
                  t.Literal("NEW"),
                  t.Literal("CONTACTED"),
                  t.Literal("SCHEDULED"),
                  t.Literal("REJECTED"),
                  t.Literal("SPAM"),
                ],
                { additionalProperties: false },
              ),
              zoneId: t.String(),
              appointmentId: t.String(),
              handledById: t.String(),
              handledAt: t.Date(),
              rejectionReason: t.String(),
              ipHash: t.String(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "MobileBookingRequest" },
);

export const MobileBookingRequestSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      code: t.Boolean(),
      clinicId: t.Boolean(),
      ownerName: t.Boolean(),
      phone: t.Boolean(),
      email: t.Boolean(),
      ownerId: t.Boolean(),
      addressLine: t.Boolean(),
      district: t.Boolean(),
      city: t.Boolean(),
      lat: t.Boolean(),
      lng: t.Boolean(),
      landmark: t.Boolean(),
      animalTypeId: t.Boolean(),
      petName: t.Boolean(),
      petNotes: t.Boolean(),
      serviceIds: t.Boolean(),
      preferredDate: t.Boolean(),
      preferredWindow: t.Boolean(),
      notes: t.Boolean(),
      attachments: t.Boolean(),
      status: t.Boolean(),
      zoneId: t.Boolean(),
      appointmentId: t.Boolean(),
      handledById: t.Boolean(),
      handledAt: t.Boolean(),
      rejectionReason: t.Boolean(),
      ipHash: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinic: t.Boolean(),
      owner: t.Boolean(),
      animalType: t.Boolean(),
      appointment: t.Boolean(),
      handledBy: t.Boolean(),
      zone: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const MobileBookingRequestInclude = t.Partial(
  t.Object(
    {
      preferredWindow: t.Boolean(),
      status: t.Boolean(),
      clinic: t.Boolean(),
      owner: t.Boolean(),
      animalType: t.Boolean(),
      appointment: t.Boolean(),
      handledBy: t.Boolean(),
      zone: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const MobileBookingRequestOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      code: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clinicId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      ownerName: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      phone: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      email: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      ownerId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      addressLine: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      district: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      city: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      lat: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      lng: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      landmark: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      animalTypeId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      petName: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      petNotes: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      serviceIds: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      preferredDate: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      notes: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      attachments: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      zoneId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      appointmentId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      handledById: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      handledAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      rejectionReason: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      ipHash: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const MobileBookingRequest = t.Composite(
  [MobileBookingRequestPlain, MobileBookingRequestRelations],
  { additionalProperties: false },
);

export const MobileBookingRequestInputCreate = t.Composite(
  [
    MobileBookingRequestPlainInputCreate,
    MobileBookingRequestRelationsInputCreate,
  ],
  { additionalProperties: false },
);

export const MobileBookingRequestInputUpdate = t.Composite(
  [
    MobileBookingRequestPlainInputUpdate,
    MobileBookingRequestRelationsInputUpdate,
  ],
  { additionalProperties: false },
);
