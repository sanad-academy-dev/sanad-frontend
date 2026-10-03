import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const MobileUnitPlain = t.Object(
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
);

export const MobileUnitRelations = t.Object(
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
    branch: t.Object(
      {
        id: t.String(),
        branchCode: t.String(),
        clinicId: t.String(),
        name: t.String(),
        icon: __nullable__(t.String()),
        type: t.Union([t.Literal("PRIMARY"), t.Literal("SUB")], {
          additionalProperties: false,
        }),
        managerId: __nullable__(t.String()),
        email: __nullable__(t.String()),
        city: __nullable__(t.String()),
        phone: __nullable__(t.String()),
        address: __nullable__(t.String()),
        active: t.Boolean(),
        emergencyNotifications: t.Boolean(),
        settings: __nullable__(t.Any()),
        isDeleted: t.Boolean(),
        deletedAt: __nullable__(t.Date()),
        createdAt: t.Date(),
        updatedAt: t.Date(),
      },
      { additionalProperties: false },
    ),
    warehouse: t.Object(
      {
        id: t.String(),
        code: t.String(),
        clinicId: t.String(),
        branchId: __nullable__(t.String()),
        name: t.String(),
        isDefault: t.Boolean(),
        isMobile: t.Boolean(),
        active: t.Boolean(),
        isDeleted: t.Boolean(),
        deletedAt: __nullable__(t.Date()),
        editsCount: t.Integer(),
        createdAt: t.Date(),
        updatedAt: t.Date(),
      },
      { additionalProperties: false },
    ),
    crew: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          mobileUnitId: t.String(),
          staffId: t.String(),
          role: t.Union(
            [
              t.Literal("DRIVER"),
              t.Literal("VET"),
              t.Literal("TECHNICIAN"),
              t.Literal("GROOMER"),
              t.Literal("ASSISTANT"),
            ],
            { additionalProperties: false },
          ),
          isPrimary: t.Boolean(),
          active: t.Boolean(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    activity: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          mobileUnitId: t.String(),
          authorUserId: __nullable__(t.String()),
          type: t.Union(
            [
              t.Literal("CREATED"),
              t.Literal("UPDATED"),
              t.Literal("ENABLED"),
              t.Literal("DISABLED"),
              t.Literal("DELETED"),
              t.Literal("STATUS_CHANGED"),
              t.Literal("CREW_ADDED"),
              t.Literal("CREW_REMOVED"),
              t.Literal("DEVICE_PAIRED"),
              t.Literal("DEVICE_REVOKED"),
              t.Literal("SHIFT_STARTED"),
              t.Literal("SHIFT_ENDED"),
              t.Literal("STOCK_RECEIVED"),
              t.Literal("VISIT_ASSIGNED"),
              t.Literal("VISIT_UNASSIGNED"),
            ],
            { additionalProperties: false },
          ),
          body: __nullable__(t.String()),
          metadata: __nullable__(t.Any()),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    devices: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          mobileUnitId: t.String(),
          tokenHash: t.String(),
          tokenPrefix: t.String(),
          label: t.String(),
          platform: __nullable__(t.String()),
          appVersion: __nullable__(t.String()),
          deviceId: __nullable__(t.String()),
          lastSeenAt: __nullable__(t.Date()),
          pairedAt: t.Date(),
          revokedAt: __nullable__(t.Date()),
          createdById: t.String(),
          revokedById: __nullable__(t.String()),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    shifts: t.Array(
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
      { additionalProperties: false },
    ),
    locations: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          mobileUnitId: t.String(),
          shiftId: __nullable__(t.String()),
          lat: t.Number(),
          lng: t.Number(),
          accuracyM: __nullable__(t.Integer()),
          speedKph: __nullable__(t.Number()),
          heading: __nullable__(t.Integer()),
          altitudeM: __nullable__(t.Integer()),
          batteryPct: __nullable__(t.Integer()),
          isMoving: t.Boolean(),
          isCharging: __nullable__(t.Boolean()),
          recordedAt: t.Date(),
          receivedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    visits: t.Array(
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
    mobileUnitServices: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          mobileUnitId: t.String(),
          serviceId: t.String(),
          price: __nullable__(
            t.Number({
              description: `تجاوز سعر الكتالوج لهذه المركبة تحديدًا؛ null ⇒ سعر الكتالوج`,
            }),
          ),
          duration: __nullable__(
            t.Integer({
              description: `تجاوز المدّة بالدقائق؛ null ⇒ مدّة الكتالوج`,
            }),
          ),
          isActive: t.Boolean(),
          notes: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `[MC10.2] ما نُفِّذ فعلًا في الزيارة المتنقلة — سجلّ ميداني مستقلّ عن
\`AppointmentService\`.
لماذا لا يكفي \`AppointmentService\`؟ لأنّه يجيب عن سؤال «بماذا حُجزت الزيارة؟» لا عن
«ماذا جرى في الموقع؟». الفرق بينهما هو عمل الطاقم: خدمة تُلغى لأنّ الحيوان لم يحتجها،
وأخرى تُضاف لأنّ المالك طلبها عند الباب. دمج الاثنين في جدول واحد يمحو هذا الفرق —
ومعه القدرة على مراجعة ما فعله السائق أو تسعير عمل المركبة على حدة.
السطور تُزامَن إلى \`AppointmentService\` عند COMPLETED فتركب الفاتورة والترحيل
المحاسبي كما هي — سجلٌّ منفصل لا مسار فوترة ثانٍ.
ما تستطيع **هذه المركبة** تقديمه من كتالوج العيادة المتنقلة.
طبقةٌ فوق \`MobileServiceCatalog\` لا بديلٌ عنه، والسبب أن الكتالوج يجيب سؤالين
لا مركبة فيهما أصلًا: نموذج الحجز العام يعرض الخدمات قبل إسناد أي مركبة، وتحويل
طلب إلى زيارة قد يجري بلا مركبة (مسار \`PENDING\` الذي يقوم عليه العرض والالتقاط).
فلو صار الكتالوج نفسه لكل مركبة لما بقي مصدرٌ للسعر في هاتين الحالتين.
**غياب الصفوف يعني السماح بالكل.** مركبةٌ بلا قائمة تقدّم كل ما في كتالوج العيادة —
فالتقييد قرار يُتخذ لا حالة افتراضية، ولا تفقد مركبة قائمة قدرتها يوم الترحيل.`,
        },
      ),
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const MobileUnitPlainInputCreate = t.Object(
  {
    code: t.String(),
    name: t.String(),
    plateNumber: t.Optional(__nullable__(t.String())),
    vehicleMake: t.Optional(__nullable__(t.String())),
    vehicleModel: t.Optional(__nullable__(t.String())),
    year: t.Optional(__nullable__(t.Integer())),
    color: t.Optional(__nullable__(t.String())),
    photo: t.Optional(__nullable__(t.String())),
    status: t.Optional(
      t.Union(
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
    ),
    active: t.Optional(t.Boolean()),
    isDeleted: t.Optional(t.Boolean()),
    deletedAt: t.Optional(__nullable__(t.Date())),
    lastLat: t.Optional(__nullable__(t.Number())),
    lastLng: t.Optional(__nullable__(t.Number())),
    lastLocationAt: t.Optional(__nullable__(t.Date())),
    lastSpeedKph: t.Optional(__nullable__(t.Number())),
    lastHeading: t.Optional(__nullable__(t.Integer())),
    lastBatteryPct: t.Optional(__nullable__(t.Integer())),
    settings: t.Optional(__nullable__(t.Any())),
    notes: t.Optional(__nullable__(t.String())),
    editsCount: t.Optional(t.Integer()),
  },
  { additionalProperties: false },
);

export const MobileUnitPlainInputUpdate = t.Object(
  {
    code: t.Optional(t.String()),
    name: t.Optional(t.String()),
    plateNumber: t.Optional(__nullable__(t.String())),
    vehicleMake: t.Optional(__nullable__(t.String())),
    vehicleModel: t.Optional(__nullable__(t.String())),
    year: t.Optional(__nullable__(t.Integer())),
    color: t.Optional(__nullable__(t.String())),
    photo: t.Optional(__nullable__(t.String())),
    status: t.Optional(
      t.Union(
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
    ),
    active: t.Optional(t.Boolean()),
    isDeleted: t.Optional(t.Boolean()),
    deletedAt: t.Optional(__nullable__(t.Date())),
    lastLat: t.Optional(__nullable__(t.Number())),
    lastLng: t.Optional(__nullable__(t.Number())),
    lastLocationAt: t.Optional(__nullable__(t.Date())),
    lastSpeedKph: t.Optional(__nullable__(t.Number())),
    lastHeading: t.Optional(__nullable__(t.Integer())),
    lastBatteryPct: t.Optional(__nullable__(t.Integer())),
    settings: t.Optional(__nullable__(t.Any())),
    notes: t.Optional(__nullable__(t.String())),
    editsCount: t.Optional(t.Integer()),
  },
  { additionalProperties: false },
);

export const MobileUnitRelationsInputCreate = t.Object(
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
    branch: t.Object(
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
    warehouse: t.Object(
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
    crew: t.Optional(
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
    activity: t.Optional(
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
    devices: t.Optional(
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
    shifts: t.Optional(
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
    locations: t.Optional(
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
    visits: t.Optional(
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
    mobileUnitServices: t.Optional(
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

export const MobileUnitRelationsInputUpdate = t.Partial(
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
      branch: t.Object(
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
      warehouse: t.Object(
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
      crew: t.Partial(
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
      activity: t.Partial(
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
      devices: t.Partial(
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
      shifts: t.Partial(
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
      locations: t.Partial(
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
      visits: t.Partial(
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
      mobileUnitServices: t.Partial(
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

export const MobileUnitWhere = t.Partial(
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
          branchId: t.String(),
          warehouseId: t.String(),
          name: t.String(),
          plateNumber: t.String(),
          vehicleMake: t.String(),
          vehicleModel: t.String(),
          year: t.Integer(),
          color: t.String(),
          photo: t.String(),
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
          deletedAt: t.Date(),
          lastLat: t.Number(),
          lastLng: t.Number(),
          lastLocationAt: t.Date(),
          lastSpeedKph: t.Number(),
          lastHeading: t.Integer(),
          lastBatteryPct: t.Integer(),
          settings: t.Any(),
          notes: t.String(),
          editsCount: t.Integer(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "MobileUnit" },
  ),
);

export const MobileUnitWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            {
              id: t.String(),
              code: t.String(),
              warehouseId: t.String(),
              clinicId_name: t.Object(
                { clinicId: t.String(), name: t.String() },
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
            t.Object({ code: t.String() }),
            t.Object({ warehouseId: t.String() }),
            t.Object({
              clinicId_name: t.Object(
                { clinicId: t.String(), name: t.String() },
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
              code: t.String(),
              clinicId: t.String(),
              branchId: t.String(),
              warehouseId: t.String(),
              name: t.String(),
              plateNumber: t.String(),
              vehicleMake: t.String(),
              vehicleModel: t.String(),
              year: t.Integer(),
              color: t.String(),
              photo: t.String(),
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
              deletedAt: t.Date(),
              lastLat: t.Number(),
              lastLng: t.Number(),
              lastLocationAt: t.Date(),
              lastSpeedKph: t.Number(),
              lastHeading: t.Integer(),
              lastBatteryPct: t.Integer(),
              settings: t.Any(),
              notes: t.String(),
              editsCount: t.Integer(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "MobileUnit" },
);

export const MobileUnitSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      code: t.Boolean(),
      clinicId: t.Boolean(),
      branchId: t.Boolean(),
      warehouseId: t.Boolean(),
      name: t.Boolean(),
      plateNumber: t.Boolean(),
      vehicleMake: t.Boolean(),
      vehicleModel: t.Boolean(),
      year: t.Boolean(),
      color: t.Boolean(),
      photo: t.Boolean(),
      status: t.Boolean(),
      active: t.Boolean(),
      isDeleted: t.Boolean(),
      deletedAt: t.Boolean(),
      lastLat: t.Boolean(),
      lastLng: t.Boolean(),
      lastLocationAt: t.Boolean(),
      lastSpeedKph: t.Boolean(),
      lastHeading: t.Boolean(),
      lastBatteryPct: t.Boolean(),
      settings: t.Boolean(),
      notes: t.Boolean(),
      editsCount: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinic: t.Boolean(),
      branch: t.Boolean(),
      warehouse: t.Boolean(),
      crew: t.Boolean(),
      activity: t.Boolean(),
      devices: t.Boolean(),
      shifts: t.Boolean(),
      locations: t.Boolean(),
      visits: t.Boolean(),
      mobileUnitServices: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const MobileUnitInclude = t.Partial(
  t.Object(
    {
      status: t.Boolean(),
      clinic: t.Boolean(),
      branch: t.Boolean(),
      warehouse: t.Boolean(),
      crew: t.Boolean(),
      activity: t.Boolean(),
      devices: t.Boolean(),
      shifts: t.Boolean(),
      locations: t.Boolean(),
      visits: t.Boolean(),
      mobileUnitServices: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const MobileUnitOrderBy = t.Partial(
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
      branchId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      warehouseId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      name: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      plateNumber: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      vehicleMake: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      vehicleModel: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      year: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      color: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      photo: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      active: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      isDeleted: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      deletedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      lastLat: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      lastLng: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      lastLocationAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      lastSpeedKph: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      lastHeading: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      lastBatteryPct: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      settings: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      notes: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      editsCount: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const MobileUnit = t.Composite([MobileUnitPlain, MobileUnitRelations], {
  additionalProperties: false,
});

export const MobileUnitInputCreate = t.Composite(
  [MobileUnitPlainInputCreate, MobileUnitRelationsInputCreate],
  { additionalProperties: false },
);

export const MobileUnitInputUpdate = t.Composite(
  [MobileUnitPlainInputUpdate, MobileUnitRelationsInputUpdate],
  { additionalProperties: false },
);
