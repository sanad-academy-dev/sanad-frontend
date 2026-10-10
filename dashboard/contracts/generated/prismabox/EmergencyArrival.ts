import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const EmergencyArrivalPlain = t.Object(
  {
    id: t.String(),
    code: t.String({ description: `ER-XXXX عبر generateUniqueCode` }),
    clinicId: t.String(),
    branchId: t.String(),
    status: t.Union(
      [
        t.Literal("EN_ROUTE"),
        t.Literal("ARRIVED"),
        t.Literal("TRIAGED"),
        t.Literal("DISPOSED"),
        t.Literal("LEFT_WITHOUT_TRIAGE"),
        t.Literal("CANCELLED"),
      ],
      { additionalProperties: false },
    ),
    source: t.Union(
      [
        t.Literal("WALK_IN"),
        t.Literal("PHONE"),
        t.Literal("PUBLIC_BOOKING"),
        t.Literal("PET_PORTAL"),
        t.Literal("AGENT"),
        t.Literal("REFERRAL"),
        t.Literal("MOBILE_REQUEST"),
        t.Literal("SCHEDULED_VISIT"),
      ],
      { additionalProperties: false },
    ),
    expectedAt: __nullable__(
      t.Date({
        description: `«في الطريق»: الوصول المتوقّع. يبقى للمقارنة بعد الوصول الفعلي`,
      }),
    ),
    arrivedAt: __nullable__(t.Date()),
    patientId: __nullable__(
      t.String({
        description: `المريض والمالك — فارغان لحيوان مجهول (كلب شارد، حيوان أحضره غريب). القرار
D2: الفراغ هنا مسموح، أمّا التحويل إلى زيارة فيشترط تسجيل المريض أوّلًا.`,
      }),
    ),
    ownerId: __nullable__(t.String()),
    provisionalLabel: __nullable__(
      t.String({
        description: `وصف مؤقّت لحيوان مجهول: «كلب بنّي، ذكر، ~20 كجم، أُحضر من طريق الملك فهد»`,
      }),
    ),
    presentingComplaint: t.String(),
    appointmentId: __nullable__(
      t.String({
        description: `الزيارة التي تحوّل إليها الوصول عند الفرز — فارغة قبله، وتبقى فارغة لمن غادر`,
      }),
    ),
    createdById: __nullable__(t.String()),
    leftReason: __nullable__(
      t.String({
        description: `سبب المغادرة قبل الفرز أو الإلغاء — مسجَّل دائمًا، فالرقم بلا سبب لا يُحسَّن`,
      }),
    ),
    stability: __nullable__(
      t.Union(
        [t.Literal("STABLE"), t.Literal("UNSTABLE"), t.Literal("CRITICAL")],
        {
          additionalProperties: false,
          description: `[E5] استقرار الحالة كما قدّره آخر تقييم — يُغيّر «جاهز للقرار» على اللوحة.`,
        },
      ),
    ),
    lastReassessedAt: __nullable__(
      t.Date({
        description: `آخر تقييم (فرز أو إعادة فرز) — منه يُحسب تأخّر إعادة التقييم حسب إيقاع اللون`,
      }),
    ),
    dispositionKind: __nullable__(
      t.Union(
        [
          t.Literal("DISCHARGED"),
          t.Literal("ADMITTED"),
          t.Literal("TO_SURGERY"),
          t.Literal("TRANSFERRED"),
          t.Literal("LEFT_AGAINST_ADVICE"),
          t.Literal("DIED"),
          t.Literal("EUTHANIZED"),
        ],
        {
          additionalProperties: false,
          description: `[E5] مآل حالة الطوارئ — القرار الذي يُقفل الحلقة ويسلّم إلى الوحدة التالية.
كل قيمة تسلّم إلى شيء قائم: الإدخال يكتب **طلب** تنويم (لا إسكانًا — الفصل الذي
اختارته وحدة التنويم بين قرار الطبيب وفعل العنبر)، والجراحة تفتح حالة عملية
بالإلحاح الموروث، والخروج يُكمل مسار الزيارة العادي إلى الدفع.`,
        },
      ),
    ),
    dispositionAt: __nullable__(t.Date()),
    dispositionById: __nullable__(t.String()),
    dispositionNotes: __nullable__(t.String()),
    transferDestination: __nullable__(
      t.String({
        description: `وجهة التحويل — إلزامية حين \`dispositionKind = TRANSFERRED\``,
      }),
    ),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  },
  {
    additionalProperties: false,
    description: `وصول إلى الطوارئ — **الباب الوحيد الذي لا تملكه آلة الزيارات**.
الزيارة تشترط طبيبًا ووقتًا ومدّة، وثلاثتها مجهولة لحيوان دهسته سيارة في
الثانية فجرًا. هذا السجلّ يحمل تلك الفجوة حتى يسدّها الفرز، فلا نضطرّ إلى
تلفيق طبيب وموعد لنفتح ملفًّا — ولا إلى جعل \`staffId\` اختياريًّا في نموذج
تقرؤه كل شاشة في التطبيق.`,
  },
);

export const EmergencyArrivalRelations = t.Object(
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
    patient: __nullable__(
      t.Object(
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
    createdBy: __nullable__(
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
    dispositionBy: __nullable__(
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
  },
  {
    additionalProperties: false,
    description: `وصول إلى الطوارئ — **الباب الوحيد الذي لا تملكه آلة الزيارات**.
الزيارة تشترط طبيبًا ووقتًا ومدّة، وثلاثتها مجهولة لحيوان دهسته سيارة في
الثانية فجرًا. هذا السجلّ يحمل تلك الفجوة حتى يسدّها الفرز، فلا نضطرّ إلى
تلفيق طبيب وموعد لنفتح ملفًّا — ولا إلى جعل \`staffId\` اختياريًّا في نموذج
تقرؤه كل شاشة في التطبيق.`,
  },
);

export const EmergencyArrivalPlainInputCreate = t.Object(
  {
    code: t.String({ description: `ER-XXXX عبر generateUniqueCode` }),
    status: t.Optional(
      t.Union(
        [
          t.Literal("EN_ROUTE"),
          t.Literal("ARRIVED"),
          t.Literal("TRIAGED"),
          t.Literal("DISPOSED"),
          t.Literal("LEFT_WITHOUT_TRIAGE"),
          t.Literal("CANCELLED"),
        ],
        { additionalProperties: false },
      ),
    ),
    source: t.Optional(
      t.Union(
        [
          t.Literal("WALK_IN"),
          t.Literal("PHONE"),
          t.Literal("PUBLIC_BOOKING"),
          t.Literal("PET_PORTAL"),
          t.Literal("AGENT"),
          t.Literal("REFERRAL"),
          t.Literal("MOBILE_REQUEST"),
          t.Literal("SCHEDULED_VISIT"),
        ],
        { additionalProperties: false },
      ),
    ),
    expectedAt: t.Optional(
      __nullable__(
        t.Date({
          description: `«في الطريق»: الوصول المتوقّع. يبقى للمقارنة بعد الوصول الفعلي`,
        }),
      ),
    ),
    arrivedAt: t.Optional(__nullable__(t.Date())),
    provisionalLabel: t.Optional(
      __nullable__(
        t.String({
          description: `وصف مؤقّت لحيوان مجهول: «كلب بنّي، ذكر، ~20 كجم، أُحضر من طريق الملك فهد»`,
        }),
      ),
    ),
    presentingComplaint: t.String(),
    leftReason: t.Optional(
      __nullable__(
        t.String({
          description: `سبب المغادرة قبل الفرز أو الإلغاء — مسجَّل دائمًا، فالرقم بلا سبب لا يُحسَّن`,
        }),
      ),
    ),
    stability: t.Optional(
      __nullable__(
        t.Union(
          [t.Literal("STABLE"), t.Literal("UNSTABLE"), t.Literal("CRITICAL")],
          {
            additionalProperties: false,
            description: `[E5] استقرار الحالة كما قدّره آخر تقييم — يُغيّر «جاهز للقرار» على اللوحة.`,
          },
        ),
      ),
    ),
    lastReassessedAt: t.Optional(
      __nullable__(
        t.Date({
          description: `آخر تقييم (فرز أو إعادة فرز) — منه يُحسب تأخّر إعادة التقييم حسب إيقاع اللون`,
        }),
      ),
    ),
    dispositionKind: t.Optional(
      __nullable__(
        t.Union(
          [
            t.Literal("DISCHARGED"),
            t.Literal("ADMITTED"),
            t.Literal("TO_SURGERY"),
            t.Literal("TRANSFERRED"),
            t.Literal("LEFT_AGAINST_ADVICE"),
            t.Literal("DIED"),
            t.Literal("EUTHANIZED"),
          ],
          {
            additionalProperties: false,
            description: `[E5] مآل حالة الطوارئ — القرار الذي يُقفل الحلقة ويسلّم إلى الوحدة التالية.
كل قيمة تسلّم إلى شيء قائم: الإدخال يكتب **طلب** تنويم (لا إسكانًا — الفصل الذي
اختارته وحدة التنويم بين قرار الطبيب وفعل العنبر)، والجراحة تفتح حالة عملية
بالإلحاح الموروث، والخروج يُكمل مسار الزيارة العادي إلى الدفع.`,
          },
        ),
      ),
    ),
    dispositionAt: t.Optional(__nullable__(t.Date())),
    dispositionNotes: t.Optional(__nullable__(t.String())),
    transferDestination: t.Optional(
      __nullable__(
        t.String({
          description: `وجهة التحويل — إلزامية حين \`dispositionKind = TRANSFERRED\``,
        }),
      ),
    ),
  },
  {
    additionalProperties: false,
    description: `وصول إلى الطوارئ — **الباب الوحيد الذي لا تملكه آلة الزيارات**.
الزيارة تشترط طبيبًا ووقتًا ومدّة، وثلاثتها مجهولة لحيوان دهسته سيارة في
الثانية فجرًا. هذا السجلّ يحمل تلك الفجوة حتى يسدّها الفرز، فلا نضطرّ إلى
تلفيق طبيب وموعد لنفتح ملفًّا — ولا إلى جعل \`staffId\` اختياريًّا في نموذج
تقرؤه كل شاشة في التطبيق.`,
  },
);

export const EmergencyArrivalPlainInputUpdate = t.Object(
  {
    code: t.Optional(
      t.String({ description: `ER-XXXX عبر generateUniqueCode` }),
    ),
    status: t.Optional(
      t.Union(
        [
          t.Literal("EN_ROUTE"),
          t.Literal("ARRIVED"),
          t.Literal("TRIAGED"),
          t.Literal("DISPOSED"),
          t.Literal("LEFT_WITHOUT_TRIAGE"),
          t.Literal("CANCELLED"),
        ],
        { additionalProperties: false },
      ),
    ),
    source: t.Optional(
      t.Union(
        [
          t.Literal("WALK_IN"),
          t.Literal("PHONE"),
          t.Literal("PUBLIC_BOOKING"),
          t.Literal("PET_PORTAL"),
          t.Literal("AGENT"),
          t.Literal("REFERRAL"),
          t.Literal("MOBILE_REQUEST"),
          t.Literal("SCHEDULED_VISIT"),
        ],
        { additionalProperties: false },
      ),
    ),
    expectedAt: t.Optional(
      __nullable__(
        t.Date({
          description: `«في الطريق»: الوصول المتوقّع. يبقى للمقارنة بعد الوصول الفعلي`,
        }),
      ),
    ),
    arrivedAt: t.Optional(__nullable__(t.Date())),
    provisionalLabel: t.Optional(
      __nullable__(
        t.String({
          description: `وصف مؤقّت لحيوان مجهول: «كلب بنّي، ذكر، ~20 كجم، أُحضر من طريق الملك فهد»`,
        }),
      ),
    ),
    presentingComplaint: t.Optional(t.String()),
    leftReason: t.Optional(
      __nullable__(
        t.String({
          description: `سبب المغادرة قبل الفرز أو الإلغاء — مسجَّل دائمًا، فالرقم بلا سبب لا يُحسَّن`,
        }),
      ),
    ),
    stability: t.Optional(
      __nullable__(
        t.Union(
          [t.Literal("STABLE"), t.Literal("UNSTABLE"), t.Literal("CRITICAL")],
          {
            additionalProperties: false,
            description: `[E5] استقرار الحالة كما قدّره آخر تقييم — يُغيّر «جاهز للقرار» على اللوحة.`,
          },
        ),
      ),
    ),
    lastReassessedAt: t.Optional(
      __nullable__(
        t.Date({
          description: `آخر تقييم (فرز أو إعادة فرز) — منه يُحسب تأخّر إعادة التقييم حسب إيقاع اللون`,
        }),
      ),
    ),
    dispositionKind: t.Optional(
      __nullable__(
        t.Union(
          [
            t.Literal("DISCHARGED"),
            t.Literal("ADMITTED"),
            t.Literal("TO_SURGERY"),
            t.Literal("TRANSFERRED"),
            t.Literal("LEFT_AGAINST_ADVICE"),
            t.Literal("DIED"),
            t.Literal("EUTHANIZED"),
          ],
          {
            additionalProperties: false,
            description: `[E5] مآل حالة الطوارئ — القرار الذي يُقفل الحلقة ويسلّم إلى الوحدة التالية.
كل قيمة تسلّم إلى شيء قائم: الإدخال يكتب **طلب** تنويم (لا إسكانًا — الفصل الذي
اختارته وحدة التنويم بين قرار الطبيب وفعل العنبر)، والجراحة تفتح حالة عملية
بالإلحاح الموروث، والخروج يُكمل مسار الزيارة العادي إلى الدفع.`,
          },
        ),
      ),
    ),
    dispositionAt: t.Optional(__nullable__(t.Date())),
    dispositionNotes: t.Optional(__nullable__(t.String())),
    transferDestination: t.Optional(
      __nullable__(
        t.String({
          description: `وجهة التحويل — إلزامية حين \`dispositionKind = TRANSFERRED\``,
        }),
      ),
    ),
  },
  {
    additionalProperties: false,
    description: `وصول إلى الطوارئ — **الباب الوحيد الذي لا تملكه آلة الزيارات**.
الزيارة تشترط طبيبًا ووقتًا ومدّة، وثلاثتها مجهولة لحيوان دهسته سيارة في
الثانية فجرًا. هذا السجلّ يحمل تلك الفجوة حتى يسدّها الفرز، فلا نضطرّ إلى
تلفيق طبيب وموعد لنفتح ملفًّا — ولا إلى جعل \`staffId\` اختياريًّا في نموذج
تقرؤه كل شاشة في التطبيق.`,
  },
);

export const EmergencyArrivalRelationsInputCreate = t.Object(
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
    patient: t.Optional(
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
    createdBy: t.Optional(
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
    dispositionBy: t.Optional(
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
  {
    additionalProperties: false,
    description: `وصول إلى الطوارئ — **الباب الوحيد الذي لا تملكه آلة الزيارات**.
الزيارة تشترط طبيبًا ووقتًا ومدّة، وثلاثتها مجهولة لحيوان دهسته سيارة في
الثانية فجرًا. هذا السجلّ يحمل تلك الفجوة حتى يسدّها الفرز، فلا نضطرّ إلى
تلفيق طبيب وموعد لنفتح ملفًّا — ولا إلى جعل \`staffId\` اختياريًّا في نموذج
تقرؤه كل شاشة في التطبيق.`,
  },
);

export const EmergencyArrivalRelationsInputUpdate = t.Partial(
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
      patient: t.Partial(
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
      createdBy: t.Partial(
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
      dispositionBy: t.Partial(
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
    {
      additionalProperties: false,
      description: `وصول إلى الطوارئ — **الباب الوحيد الذي لا تملكه آلة الزيارات**.
الزيارة تشترط طبيبًا ووقتًا ومدّة، وثلاثتها مجهولة لحيوان دهسته سيارة في
الثانية فجرًا. هذا السجلّ يحمل تلك الفجوة حتى يسدّها الفرز، فلا نضطرّ إلى
تلفيق طبيب وموعد لنفتح ملفًّا — ولا إلى جعل \`staffId\` اختياريًّا في نموذج
تقرؤه كل شاشة في التطبيق.`,
    },
  ),
);

export const EmergencyArrivalWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          code: t.String({ description: `ER-XXXX عبر generateUniqueCode` }),
          clinicId: t.String(),
          branchId: t.String(),
          status: t.Union(
            [
              t.Literal("EN_ROUTE"),
              t.Literal("ARRIVED"),
              t.Literal("TRIAGED"),
              t.Literal("DISPOSED"),
              t.Literal("LEFT_WITHOUT_TRIAGE"),
              t.Literal("CANCELLED"),
            ],
            { additionalProperties: false },
          ),
          source: t.Union(
            [
              t.Literal("WALK_IN"),
              t.Literal("PHONE"),
              t.Literal("PUBLIC_BOOKING"),
              t.Literal("PET_PORTAL"),
              t.Literal("AGENT"),
              t.Literal("REFERRAL"),
              t.Literal("MOBILE_REQUEST"),
              t.Literal("SCHEDULED_VISIT"),
            ],
            { additionalProperties: false },
          ),
          expectedAt: t.Date({
            description: `«في الطريق»: الوصول المتوقّع. يبقى للمقارنة بعد الوصول الفعلي`,
          }),
          arrivedAt: t.Date(),
          patientId: t.String({
            description: `المريض والمالك — فارغان لحيوان مجهول (كلب شارد، حيوان أحضره غريب). القرار
D2: الفراغ هنا مسموح، أمّا التحويل إلى زيارة فيشترط تسجيل المريض أوّلًا.`,
          }),
          ownerId: t.String(),
          provisionalLabel: t.String({
            description: `وصف مؤقّت لحيوان مجهول: «كلب بنّي، ذكر، ~20 كجم، أُحضر من طريق الملك فهد»`,
          }),
          presentingComplaint: t.String(),
          appointmentId: t.String({
            description: `الزيارة التي تحوّل إليها الوصول عند الفرز — فارغة قبله، وتبقى فارغة لمن غادر`,
          }),
          createdById: t.String(),
          leftReason: t.String({
            description: `سبب المغادرة قبل الفرز أو الإلغاء — مسجَّل دائمًا، فالرقم بلا سبب لا يُحسَّن`,
          }),
          stability: t.Union(
            [t.Literal("STABLE"), t.Literal("UNSTABLE"), t.Literal("CRITICAL")],
            {
              additionalProperties: false,
              description: `[E5] استقرار الحالة كما قدّره آخر تقييم — يُغيّر «جاهز للقرار» على اللوحة.`,
            },
          ),
          lastReassessedAt: t.Date({
            description: `آخر تقييم (فرز أو إعادة فرز) — منه يُحسب تأخّر إعادة التقييم حسب إيقاع اللون`,
          }),
          dispositionKind: t.Union(
            [
              t.Literal("DISCHARGED"),
              t.Literal("ADMITTED"),
              t.Literal("TO_SURGERY"),
              t.Literal("TRANSFERRED"),
              t.Literal("LEFT_AGAINST_ADVICE"),
              t.Literal("DIED"),
              t.Literal("EUTHANIZED"),
            ],
            {
              additionalProperties: false,
              description: `[E5] مآل حالة الطوارئ — القرار الذي يُقفل الحلقة ويسلّم إلى الوحدة التالية.
كل قيمة تسلّم إلى شيء قائم: الإدخال يكتب **طلب** تنويم (لا إسكانًا — الفصل الذي
اختارته وحدة التنويم بين قرار الطبيب وفعل العنبر)، والجراحة تفتح حالة عملية
بالإلحاح الموروث، والخروج يُكمل مسار الزيارة العادي إلى الدفع.`,
            },
          ),
          dispositionAt: t.Date(),
          dispositionById: t.String(),
          dispositionNotes: t.String(),
          transferDestination: t.String({
            description: `وجهة التحويل — إلزامية حين \`dispositionKind = TRANSFERRED\``,
          }),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `وصول إلى الطوارئ — **الباب الوحيد الذي لا تملكه آلة الزيارات**.
الزيارة تشترط طبيبًا ووقتًا ومدّة، وثلاثتها مجهولة لحيوان دهسته سيارة في
الثانية فجرًا. هذا السجلّ يحمل تلك الفجوة حتى يسدّها الفرز، فلا نضطرّ إلى
تلفيق طبيب وموعد لنفتح ملفًّا — ولا إلى جعل \`staffId\` اختياريًّا في نموذج
تقرؤه كل شاشة في التطبيق.`,
        },
      ),
    { $id: "EmergencyArrival" },
  ),
);

export const EmergencyArrivalWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            {
              id: t.String(),
              code: t.String({ description: `ER-XXXX عبر generateUniqueCode` }),
              appointmentId: t.String({
                description: `الزيارة التي تحوّل إليها الوصول عند الفرز — فارغة قبله، وتبقى فارغة لمن غادر`,
              }),
            },
            {
              additionalProperties: false,
              description: `وصول إلى الطوارئ — **الباب الوحيد الذي لا تملكه آلة الزيارات**.
الزيارة تشترط طبيبًا ووقتًا ومدّة، وثلاثتها مجهولة لحيوان دهسته سيارة في
الثانية فجرًا. هذا السجلّ يحمل تلك الفجوة حتى يسدّها الفرز، فلا نضطرّ إلى
تلفيق طبيب وموعد لنفتح ملفًّا — ولا إلى جعل \`staffId\` اختياريًّا في نموذج
تقرؤه كل شاشة في التطبيق.`,
            },
          ),
          { additionalProperties: false },
        ),
        t.Union(
          [
            t.Object({ id: t.String() }),
            t.Object({
              code: t.String({ description: `ER-XXXX عبر generateUniqueCode` }),
            }),
            t.Object({
              appointmentId: t.String({
                description: `الزيارة التي تحوّل إليها الوصول عند الفرز — فارغة قبله، وتبقى فارغة لمن غادر`,
              }),
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
              code: t.String({ description: `ER-XXXX عبر generateUniqueCode` }),
              clinicId: t.String(),
              branchId: t.String(),
              status: t.Union(
                [
                  t.Literal("EN_ROUTE"),
                  t.Literal("ARRIVED"),
                  t.Literal("TRIAGED"),
                  t.Literal("DISPOSED"),
                  t.Literal("LEFT_WITHOUT_TRIAGE"),
                  t.Literal("CANCELLED"),
                ],
                { additionalProperties: false },
              ),
              source: t.Union(
                [
                  t.Literal("WALK_IN"),
                  t.Literal("PHONE"),
                  t.Literal("PUBLIC_BOOKING"),
                  t.Literal("PET_PORTAL"),
                  t.Literal("AGENT"),
                  t.Literal("REFERRAL"),
                  t.Literal("MOBILE_REQUEST"),
                  t.Literal("SCHEDULED_VISIT"),
                ],
                { additionalProperties: false },
              ),
              expectedAt: t.Date({
                description: `«في الطريق»: الوصول المتوقّع. يبقى للمقارنة بعد الوصول الفعلي`,
              }),
              arrivedAt: t.Date(),
              patientId: t.String({
                description: `المريض والمالك — فارغان لحيوان مجهول (كلب شارد، حيوان أحضره غريب). القرار
D2: الفراغ هنا مسموح، أمّا التحويل إلى زيارة فيشترط تسجيل المريض أوّلًا.`,
              }),
              ownerId: t.String(),
              provisionalLabel: t.String({
                description: `وصف مؤقّت لحيوان مجهول: «كلب بنّي، ذكر، ~20 كجم، أُحضر من طريق الملك فهد»`,
              }),
              presentingComplaint: t.String(),
              appointmentId: t.String({
                description: `الزيارة التي تحوّل إليها الوصول عند الفرز — فارغة قبله، وتبقى فارغة لمن غادر`,
              }),
              createdById: t.String(),
              leftReason: t.String({
                description: `سبب المغادرة قبل الفرز أو الإلغاء — مسجَّل دائمًا، فالرقم بلا سبب لا يُحسَّن`,
              }),
              stability: t.Union(
                [
                  t.Literal("STABLE"),
                  t.Literal("UNSTABLE"),
                  t.Literal("CRITICAL"),
                ],
                {
                  additionalProperties: false,
                  description: `[E5] استقرار الحالة كما قدّره آخر تقييم — يُغيّر «جاهز للقرار» على اللوحة.`,
                },
              ),
              lastReassessedAt: t.Date({
                description: `آخر تقييم (فرز أو إعادة فرز) — منه يُحسب تأخّر إعادة التقييم حسب إيقاع اللون`,
              }),
              dispositionKind: t.Union(
                [
                  t.Literal("DISCHARGED"),
                  t.Literal("ADMITTED"),
                  t.Literal("TO_SURGERY"),
                  t.Literal("TRANSFERRED"),
                  t.Literal("LEFT_AGAINST_ADVICE"),
                  t.Literal("DIED"),
                  t.Literal("EUTHANIZED"),
                ],
                {
                  additionalProperties: false,
                  description: `[E5] مآل حالة الطوارئ — القرار الذي يُقفل الحلقة ويسلّم إلى الوحدة التالية.
كل قيمة تسلّم إلى شيء قائم: الإدخال يكتب **طلب** تنويم (لا إسكانًا — الفصل الذي
اختارته وحدة التنويم بين قرار الطبيب وفعل العنبر)، والجراحة تفتح حالة عملية
بالإلحاح الموروث، والخروج يُكمل مسار الزيارة العادي إلى الدفع.`,
                },
              ),
              dispositionAt: t.Date(),
              dispositionById: t.String(),
              dispositionNotes: t.String(),
              transferDestination: t.String({
                description: `وجهة التحويل — إلزامية حين \`dispositionKind = TRANSFERRED\``,
              }),
              createdAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "EmergencyArrival" },
);

export const EmergencyArrivalSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      code: t.Boolean(),
      clinicId: t.Boolean(),
      branchId: t.Boolean(),
      status: t.Boolean(),
      source: t.Boolean(),
      expectedAt: t.Boolean(),
      arrivedAt: t.Boolean(),
      patientId: t.Boolean(),
      ownerId: t.Boolean(),
      provisionalLabel: t.Boolean(),
      presentingComplaint: t.Boolean(),
      appointmentId: t.Boolean(),
      createdById: t.Boolean(),
      leftReason: t.Boolean(),
      stability: t.Boolean(),
      lastReassessedAt: t.Boolean(),
      dispositionKind: t.Boolean(),
      dispositionAt: t.Boolean(),
      dispositionById: t.Boolean(),
      dispositionNotes: t.Boolean(),
      transferDestination: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinic: t.Boolean(),
      branch: t.Boolean(),
      patient: t.Boolean(),
      owner: t.Boolean(),
      appointment: t.Boolean(),
      createdBy: t.Boolean(),
      dispositionBy: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `وصول إلى الطوارئ — **الباب الوحيد الذي لا تملكه آلة الزيارات**.
الزيارة تشترط طبيبًا ووقتًا ومدّة، وثلاثتها مجهولة لحيوان دهسته سيارة في
الثانية فجرًا. هذا السجلّ يحمل تلك الفجوة حتى يسدّها الفرز، فلا نضطرّ إلى
تلفيق طبيب وموعد لنفتح ملفًّا — ولا إلى جعل \`staffId\` اختياريًّا في نموذج
تقرؤه كل شاشة في التطبيق.`,
    },
  ),
);

export const EmergencyArrivalInclude = t.Partial(
  t.Object(
    {
      status: t.Boolean(),
      source: t.Boolean(),
      stability: t.Boolean(),
      dispositionKind: t.Boolean(),
      clinic: t.Boolean(),
      branch: t.Boolean(),
      patient: t.Boolean(),
      owner: t.Boolean(),
      appointment: t.Boolean(),
      createdBy: t.Boolean(),
      dispositionBy: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `وصول إلى الطوارئ — **الباب الوحيد الذي لا تملكه آلة الزيارات**.
الزيارة تشترط طبيبًا ووقتًا ومدّة، وثلاثتها مجهولة لحيوان دهسته سيارة في
الثانية فجرًا. هذا السجلّ يحمل تلك الفجوة حتى يسدّها الفرز، فلا نضطرّ إلى
تلفيق طبيب وموعد لنفتح ملفًّا — ولا إلى جعل \`staffId\` اختياريًّا في نموذج
تقرؤه كل شاشة في التطبيق.`,
    },
  ),
);

export const EmergencyArrivalOrderBy = t.Partial(
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
      expectedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      arrivedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      patientId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      ownerId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      provisionalLabel: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      presentingComplaint: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      appointmentId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdById: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      leftReason: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      lastReassessedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      dispositionAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      dispositionById: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      dispositionNotes: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      transferDestination: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      updatedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    {
      additionalProperties: false,
      description: `وصول إلى الطوارئ — **الباب الوحيد الذي لا تملكه آلة الزيارات**.
الزيارة تشترط طبيبًا ووقتًا ومدّة، وثلاثتها مجهولة لحيوان دهسته سيارة في
الثانية فجرًا. هذا السجلّ يحمل تلك الفجوة حتى يسدّها الفرز، فلا نضطرّ إلى
تلفيق طبيب وموعد لنفتح ملفًّا — ولا إلى جعل \`staffId\` اختياريًّا في نموذج
تقرؤه كل شاشة في التطبيق.`,
    },
  ),
);

export const EmergencyArrival = t.Composite(
  [EmergencyArrivalPlain, EmergencyArrivalRelations],
  { additionalProperties: false },
);

export const EmergencyArrivalInputCreate = t.Composite(
  [EmergencyArrivalPlainInputCreate, EmergencyArrivalRelationsInputCreate],
  { additionalProperties: false },
);

export const EmergencyArrivalInputUpdate = t.Composite(
  [EmergencyArrivalPlainInputUpdate, EmergencyArrivalRelationsInputUpdate],
  { additionalProperties: false },
);
