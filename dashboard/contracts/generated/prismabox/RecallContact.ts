import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const RecallContactPlain = t.Object(
  {
    id: t.String(),
    clinicId: t.String(),
    ownerId: t.String(),
    patientId: __nullable__(t.String()),
    trigger: t.Union(
      [
        t.Literal("VACCINATION_DUE"),
        t.Literal("GROOMING_DUE"),
        t.Literal("NUTRITION_RECHECK_DUE"),
        t.Literal("APPOINTMENT_UPCOMING"),
        t.Literal("APPOINTMENT_NO_SHOW"),
        t.Literal("CARE_PLAN_VISIT_DUE"),
        t.Literal("INVOICE_OVERDUE"),
        t.Literal("MEMBERSHIP_RENEWAL"),
        t.Literal("POST_OP_FOLLOW_UP"),
      ],
      {
        additionalProperties: false,
        description: `سببُ التذكير. كلٌّ منها مربوطٌ بمحرّك استحقاق **قائم بالفعل** — لا يعيد أيٌّ
منها حساب موعدٍ من جديد، وهذا شرطٌ لا تفصيل: نسخةٌ ثانية من منطق الجدولة تختلف
عن الأولى حتمًا، فيصير التذكير يقول غير ما تقوله الشاشة.`,
      },
    ),
    dedupeKey: t.String({
      description: `نفس بصمة \`NotificationOutbox.dedupeKey\` — بها يُربط التواصل باستحقاقٍ بعينه
ويُكتم من قائمة العمل ما عولج فعلًا`,
    }),
    channel: t.Union(
      [
        t.Literal("PHONE"),
        t.Literal("WHATSAPP"),
        t.Literal("EMAIL"),
        t.Literal("SMS"),
        t.Literal("IN_PERSON"),
        t.Literal("INBOX"),
      ],
      { additionalProperties: false },
    ),
    outcome: t.Union(
      [
        t.Literal("BOOKED"),
        t.Literal("NO_ANSWER"),
        t.Literal("CALLBACK_REQUESTED"),
        t.Literal("DECLINED"),
        t.Literal("WRONG_NUMBER"),
        t.Literal("SNOOZED"),
        t.Literal("INFORMED"),
      ],
      { additionalProperties: false },
    ),
    notes: __nullable__(t.String()),
    snoozedUntil: __nullable__(
      t.Date({
        description: `تأجيلٌ صريح — قائمة اليوم تتخطّاه حتى هذا التاريخ`,
      }),
    ),
    bookedAppointmentId: __nullable__(
      t.String({
        description: `الموعد الذي أُغلق به الاستدعاء حين \`outcome = BOOKED\``,
      }),
    ),
    contactedById: __nullable__(t.String()),
    contactedAt: t.Date(),
  },
  {
    additionalProperties: false,
    description: `«كلّمنا هذا المالك». الصفّ الذي لم يكن موجودًا قبل هذه الوحدة إطلاقًا — ولا
\`lastContactedAt\` ولا عدّاد محاولات ولا تأجيل. أثرُ غيابه ملموس: قائمة استدعاءٍ
يعمل عليها موظّفان فيُكلَّم المالك مرّتين، ونسبة الالتزام (المقياس الذي تبيعه
أنظمة الاستدعاء التجارية) غير قابلة للحساب أصلًا.`,
  },
);

export const RecallContactRelations = t.Object(
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
    owner: t.Object(
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
    bookedAppointment: __nullable__(
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
    contactedBy: __nullable__(
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
    description: `«كلّمنا هذا المالك». الصفّ الذي لم يكن موجودًا قبل هذه الوحدة إطلاقًا — ولا
\`lastContactedAt\` ولا عدّاد محاولات ولا تأجيل. أثرُ غيابه ملموس: قائمة استدعاءٍ
يعمل عليها موظّفان فيُكلَّم المالك مرّتين، ونسبة الالتزام (المقياس الذي تبيعه
أنظمة الاستدعاء التجارية) غير قابلة للحساب أصلًا.`,
  },
);

export const RecallContactPlainInputCreate = t.Object(
  {
    trigger: t.Union(
      [
        t.Literal("VACCINATION_DUE"),
        t.Literal("GROOMING_DUE"),
        t.Literal("NUTRITION_RECHECK_DUE"),
        t.Literal("APPOINTMENT_UPCOMING"),
        t.Literal("APPOINTMENT_NO_SHOW"),
        t.Literal("CARE_PLAN_VISIT_DUE"),
        t.Literal("INVOICE_OVERDUE"),
        t.Literal("MEMBERSHIP_RENEWAL"),
        t.Literal("POST_OP_FOLLOW_UP"),
      ],
      {
        additionalProperties: false,
        description: `سببُ التذكير. كلٌّ منها مربوطٌ بمحرّك استحقاق **قائم بالفعل** — لا يعيد أيٌّ
منها حساب موعدٍ من جديد، وهذا شرطٌ لا تفصيل: نسخةٌ ثانية من منطق الجدولة تختلف
عن الأولى حتمًا، فيصير التذكير يقول غير ما تقوله الشاشة.`,
      },
    ),
    dedupeKey: t.String({
      description: `نفس بصمة \`NotificationOutbox.dedupeKey\` — بها يُربط التواصل باستحقاقٍ بعينه
ويُكتم من قائمة العمل ما عولج فعلًا`,
    }),
    channel: t.Union(
      [
        t.Literal("PHONE"),
        t.Literal("WHATSAPP"),
        t.Literal("EMAIL"),
        t.Literal("SMS"),
        t.Literal("IN_PERSON"),
        t.Literal("INBOX"),
      ],
      { additionalProperties: false },
    ),
    outcome: t.Union(
      [
        t.Literal("BOOKED"),
        t.Literal("NO_ANSWER"),
        t.Literal("CALLBACK_REQUESTED"),
        t.Literal("DECLINED"),
        t.Literal("WRONG_NUMBER"),
        t.Literal("SNOOZED"),
        t.Literal("INFORMED"),
      ],
      { additionalProperties: false },
    ),
    notes: t.Optional(__nullable__(t.String())),
    snoozedUntil: t.Optional(
      __nullable__(
        t.Date({
          description: `تأجيلٌ صريح — قائمة اليوم تتخطّاه حتى هذا التاريخ`,
        }),
      ),
    ),
    contactedAt: t.Optional(t.Date()),
  },
  {
    additionalProperties: false,
    description: `«كلّمنا هذا المالك». الصفّ الذي لم يكن موجودًا قبل هذه الوحدة إطلاقًا — ولا
\`lastContactedAt\` ولا عدّاد محاولات ولا تأجيل. أثرُ غيابه ملموس: قائمة استدعاءٍ
يعمل عليها موظّفان فيُكلَّم المالك مرّتين، ونسبة الالتزام (المقياس الذي تبيعه
أنظمة الاستدعاء التجارية) غير قابلة للحساب أصلًا.`,
  },
);

export const RecallContactPlainInputUpdate = t.Object(
  {
    trigger: t.Optional(
      t.Union(
        [
          t.Literal("VACCINATION_DUE"),
          t.Literal("GROOMING_DUE"),
          t.Literal("NUTRITION_RECHECK_DUE"),
          t.Literal("APPOINTMENT_UPCOMING"),
          t.Literal("APPOINTMENT_NO_SHOW"),
          t.Literal("CARE_PLAN_VISIT_DUE"),
          t.Literal("INVOICE_OVERDUE"),
          t.Literal("MEMBERSHIP_RENEWAL"),
          t.Literal("POST_OP_FOLLOW_UP"),
        ],
        {
          additionalProperties: false,
          description: `سببُ التذكير. كلٌّ منها مربوطٌ بمحرّك استحقاق **قائم بالفعل** — لا يعيد أيٌّ
منها حساب موعدٍ من جديد، وهذا شرطٌ لا تفصيل: نسخةٌ ثانية من منطق الجدولة تختلف
عن الأولى حتمًا، فيصير التذكير يقول غير ما تقوله الشاشة.`,
        },
      ),
    ),
    dedupeKey: t.Optional(
      t.String({
        description: `نفس بصمة \`NotificationOutbox.dedupeKey\` — بها يُربط التواصل باستحقاقٍ بعينه
ويُكتم من قائمة العمل ما عولج فعلًا`,
      }),
    ),
    channel: t.Optional(
      t.Union(
        [
          t.Literal("PHONE"),
          t.Literal("WHATSAPP"),
          t.Literal("EMAIL"),
          t.Literal("SMS"),
          t.Literal("IN_PERSON"),
          t.Literal("INBOX"),
        ],
        { additionalProperties: false },
      ),
    ),
    outcome: t.Optional(
      t.Union(
        [
          t.Literal("BOOKED"),
          t.Literal("NO_ANSWER"),
          t.Literal("CALLBACK_REQUESTED"),
          t.Literal("DECLINED"),
          t.Literal("WRONG_NUMBER"),
          t.Literal("SNOOZED"),
          t.Literal("INFORMED"),
        ],
        { additionalProperties: false },
      ),
    ),
    notes: t.Optional(__nullable__(t.String())),
    snoozedUntil: t.Optional(
      __nullable__(
        t.Date({
          description: `تأجيلٌ صريح — قائمة اليوم تتخطّاه حتى هذا التاريخ`,
        }),
      ),
    ),
    contactedAt: t.Optional(t.Date()),
  },
  {
    additionalProperties: false,
    description: `«كلّمنا هذا المالك». الصفّ الذي لم يكن موجودًا قبل هذه الوحدة إطلاقًا — ولا
\`lastContactedAt\` ولا عدّاد محاولات ولا تأجيل. أثرُ غيابه ملموس: قائمة استدعاءٍ
يعمل عليها موظّفان فيُكلَّم المالك مرّتين، ونسبة الالتزام (المقياس الذي تبيعه
أنظمة الاستدعاء التجارية) غير قابلة للحساب أصلًا.`,
  },
);

export const RecallContactRelationsInputCreate = t.Object(
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
    owner: t.Object(
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
    bookedAppointment: t.Optional(
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
    contactedBy: t.Optional(
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
    description: `«كلّمنا هذا المالك». الصفّ الذي لم يكن موجودًا قبل هذه الوحدة إطلاقًا — ولا
\`lastContactedAt\` ولا عدّاد محاولات ولا تأجيل. أثرُ غيابه ملموس: قائمة استدعاءٍ
يعمل عليها موظّفان فيُكلَّم المالك مرّتين، ونسبة الالتزام (المقياس الذي تبيعه
أنظمة الاستدعاء التجارية) غير قابلة للحساب أصلًا.`,
  },
);

export const RecallContactRelationsInputUpdate = t.Partial(
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
      owner: t.Object(
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
      bookedAppointment: t.Partial(
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
      contactedBy: t.Partial(
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
      description: `«كلّمنا هذا المالك». الصفّ الذي لم يكن موجودًا قبل هذه الوحدة إطلاقًا — ولا
\`lastContactedAt\` ولا عدّاد محاولات ولا تأجيل. أثرُ غيابه ملموس: قائمة استدعاءٍ
يعمل عليها موظّفان فيُكلَّم المالك مرّتين، ونسبة الالتزام (المقياس الذي تبيعه
أنظمة الاستدعاء التجارية) غير قابلة للحساب أصلًا.`,
    },
  ),
);

export const RecallContactWhere = t.Partial(
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
          patientId: t.String(),
          trigger: t.Union(
            [
              t.Literal("VACCINATION_DUE"),
              t.Literal("GROOMING_DUE"),
              t.Literal("NUTRITION_RECHECK_DUE"),
              t.Literal("APPOINTMENT_UPCOMING"),
              t.Literal("APPOINTMENT_NO_SHOW"),
              t.Literal("CARE_PLAN_VISIT_DUE"),
              t.Literal("INVOICE_OVERDUE"),
              t.Literal("MEMBERSHIP_RENEWAL"),
              t.Literal("POST_OP_FOLLOW_UP"),
            ],
            {
              additionalProperties: false,
              description: `سببُ التذكير. كلٌّ منها مربوطٌ بمحرّك استحقاق **قائم بالفعل** — لا يعيد أيٌّ
منها حساب موعدٍ من جديد، وهذا شرطٌ لا تفصيل: نسخةٌ ثانية من منطق الجدولة تختلف
عن الأولى حتمًا، فيصير التذكير يقول غير ما تقوله الشاشة.`,
            },
          ),
          dedupeKey: t.String({
            description: `نفس بصمة \`NotificationOutbox.dedupeKey\` — بها يُربط التواصل باستحقاقٍ بعينه
ويُكتم من قائمة العمل ما عولج فعلًا`,
          }),
          channel: t.Union(
            [
              t.Literal("PHONE"),
              t.Literal("WHATSAPP"),
              t.Literal("EMAIL"),
              t.Literal("SMS"),
              t.Literal("IN_PERSON"),
              t.Literal("INBOX"),
            ],
            { additionalProperties: false },
          ),
          outcome: t.Union(
            [
              t.Literal("BOOKED"),
              t.Literal("NO_ANSWER"),
              t.Literal("CALLBACK_REQUESTED"),
              t.Literal("DECLINED"),
              t.Literal("WRONG_NUMBER"),
              t.Literal("SNOOZED"),
              t.Literal("INFORMED"),
            ],
            { additionalProperties: false },
          ),
          notes: t.String(),
          snoozedUntil: t.Date({
            description: `تأجيلٌ صريح — قائمة اليوم تتخطّاه حتى هذا التاريخ`,
          }),
          bookedAppointmentId: t.String({
            description: `الموعد الذي أُغلق به الاستدعاء حين \`outcome = BOOKED\``,
          }),
          contactedById: t.String(),
          contactedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `«كلّمنا هذا المالك». الصفّ الذي لم يكن موجودًا قبل هذه الوحدة إطلاقًا — ولا
\`lastContactedAt\` ولا عدّاد محاولات ولا تأجيل. أثرُ غيابه ملموس: قائمة استدعاءٍ
يعمل عليها موظّفان فيُكلَّم المالك مرّتين، ونسبة الالتزام (المقياس الذي تبيعه
أنظمة الاستدعاء التجارية) غير قابلة للحساب أصلًا.`,
        },
      ),
    { $id: "RecallContact" },
  ),
);

export const RecallContactWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.String() },
            {
              additionalProperties: false,
              description: `«كلّمنا هذا المالك». الصفّ الذي لم يكن موجودًا قبل هذه الوحدة إطلاقًا — ولا
\`lastContactedAt\` ولا عدّاد محاولات ولا تأجيل. أثرُ غيابه ملموس: قائمة استدعاءٍ
يعمل عليها موظّفان فيُكلَّم المالك مرّتين، ونسبة الالتزام (المقياس الذي تبيعه
أنظمة الاستدعاء التجارية) غير قابلة للحساب أصلًا.`,
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
              clinicId: t.String(),
              ownerId: t.String(),
              patientId: t.String(),
              trigger: t.Union(
                [
                  t.Literal("VACCINATION_DUE"),
                  t.Literal("GROOMING_DUE"),
                  t.Literal("NUTRITION_RECHECK_DUE"),
                  t.Literal("APPOINTMENT_UPCOMING"),
                  t.Literal("APPOINTMENT_NO_SHOW"),
                  t.Literal("CARE_PLAN_VISIT_DUE"),
                  t.Literal("INVOICE_OVERDUE"),
                  t.Literal("MEMBERSHIP_RENEWAL"),
                  t.Literal("POST_OP_FOLLOW_UP"),
                ],
                {
                  additionalProperties: false,
                  description: `سببُ التذكير. كلٌّ منها مربوطٌ بمحرّك استحقاق **قائم بالفعل** — لا يعيد أيٌّ
منها حساب موعدٍ من جديد، وهذا شرطٌ لا تفصيل: نسخةٌ ثانية من منطق الجدولة تختلف
عن الأولى حتمًا، فيصير التذكير يقول غير ما تقوله الشاشة.`,
                },
              ),
              dedupeKey: t.String({
                description: `نفس بصمة \`NotificationOutbox.dedupeKey\` — بها يُربط التواصل باستحقاقٍ بعينه
ويُكتم من قائمة العمل ما عولج فعلًا`,
              }),
              channel: t.Union(
                [
                  t.Literal("PHONE"),
                  t.Literal("WHATSAPP"),
                  t.Literal("EMAIL"),
                  t.Literal("SMS"),
                  t.Literal("IN_PERSON"),
                  t.Literal("INBOX"),
                ],
                { additionalProperties: false },
              ),
              outcome: t.Union(
                [
                  t.Literal("BOOKED"),
                  t.Literal("NO_ANSWER"),
                  t.Literal("CALLBACK_REQUESTED"),
                  t.Literal("DECLINED"),
                  t.Literal("WRONG_NUMBER"),
                  t.Literal("SNOOZED"),
                  t.Literal("INFORMED"),
                ],
                { additionalProperties: false },
              ),
              notes: t.String(),
              snoozedUntil: t.Date({
                description: `تأجيلٌ صريح — قائمة اليوم تتخطّاه حتى هذا التاريخ`,
              }),
              bookedAppointmentId: t.String({
                description: `الموعد الذي أُغلق به الاستدعاء حين \`outcome = BOOKED\``,
              }),
              contactedById: t.String(),
              contactedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "RecallContact" },
);

export const RecallContactSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      clinicId: t.Boolean(),
      ownerId: t.Boolean(),
      patientId: t.Boolean(),
      trigger: t.Boolean(),
      dedupeKey: t.Boolean(),
      channel: t.Boolean(),
      outcome: t.Boolean(),
      notes: t.Boolean(),
      snoozedUntil: t.Boolean(),
      bookedAppointmentId: t.Boolean(),
      contactedById: t.Boolean(),
      contactedAt: t.Boolean(),
      clinic: t.Boolean(),
      owner: t.Boolean(),
      patient: t.Boolean(),
      bookedAppointment: t.Boolean(),
      contactedBy: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `«كلّمنا هذا المالك». الصفّ الذي لم يكن موجودًا قبل هذه الوحدة إطلاقًا — ولا
\`lastContactedAt\` ولا عدّاد محاولات ولا تأجيل. أثرُ غيابه ملموس: قائمة استدعاءٍ
يعمل عليها موظّفان فيُكلَّم المالك مرّتين، ونسبة الالتزام (المقياس الذي تبيعه
أنظمة الاستدعاء التجارية) غير قابلة للحساب أصلًا.`,
    },
  ),
);

export const RecallContactInclude = t.Partial(
  t.Object(
    {
      trigger: t.Boolean(),
      channel: t.Boolean(),
      outcome: t.Boolean(),
      clinic: t.Boolean(),
      owner: t.Boolean(),
      patient: t.Boolean(),
      bookedAppointment: t.Boolean(),
      contactedBy: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `«كلّمنا هذا المالك». الصفّ الذي لم يكن موجودًا قبل هذه الوحدة إطلاقًا — ولا
\`lastContactedAt\` ولا عدّاد محاولات ولا تأجيل. أثرُ غيابه ملموس: قائمة استدعاءٍ
يعمل عليها موظّفان فيُكلَّم المالك مرّتين، ونسبة الالتزام (المقياس الذي تبيعه
أنظمة الاستدعاء التجارية) غير قابلة للحساب أصلًا.`,
    },
  ),
);

export const RecallContactOrderBy = t.Partial(
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
      patientId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      dedupeKey: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      notes: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      snoozedUntil: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      bookedAppointmentId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      contactedById: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      contactedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    {
      additionalProperties: false,
      description: `«كلّمنا هذا المالك». الصفّ الذي لم يكن موجودًا قبل هذه الوحدة إطلاقًا — ولا
\`lastContactedAt\` ولا عدّاد محاولات ولا تأجيل. أثرُ غيابه ملموس: قائمة استدعاءٍ
يعمل عليها موظّفان فيُكلَّم المالك مرّتين، ونسبة الالتزام (المقياس الذي تبيعه
أنظمة الاستدعاء التجارية) غير قابلة للحساب أصلًا.`,
    },
  ),
);

export const RecallContact = t.Composite(
  [RecallContactPlain, RecallContactRelations],
  { additionalProperties: false },
);

export const RecallContactInputCreate = t.Composite(
  [RecallContactPlainInputCreate, RecallContactRelationsInputCreate],
  { additionalProperties: false },
);

export const RecallContactInputUpdate = t.Composite(
  [RecallContactPlainInputUpdate, RecallContactRelationsInputUpdate],
  { additionalProperties: false },
);
