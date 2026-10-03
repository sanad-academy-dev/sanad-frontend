import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const NotificationOutboxPlain = t.Object(
  {
    id: t.String(),
    clinicId: t.String(),
    channel: t.Union(
      [
        t.Literal("INBOX"),
        t.Literal("EMAIL"),
        t.Literal("WHATSAPP"),
        t.Literal("SMS"),
        t.Literal("PUSH"),
      ],
      { additionalProperties: false },
    ),
    status: t.Union(
      [
        t.Literal("QUEUED"),
        t.Literal("SENDING"),
        t.Literal("SENT"),
        t.Literal("FAILED"),
        t.Literal("SKIPPED"),
        t.Literal("CANCELLED"),
        t.Literal("AWAITING_MANUAL"),
      ],
      { additionalProperties: false },
    ),
    recipientKind: t.Union(
      [t.Literal("OWNER"), t.Literal("USER"), t.Literal("CLINIC")],
      { additionalProperties: false },
    ),
    ownerId: __nullable__(t.String()),
    recipientUserId: __nullable__(t.String()),
    toAddress: __nullable__(
      t.String({
        description: `عنوان التسليم وقت الإدراج (بريد أو رقم E.164) — لقطة: تغيير رقم المالك
لاحقًا يجب ألّا يُعيد كتابة إلى أين ذهبت رسالةُ الأمس`,
      }),
    ),
    subject: __nullable__(t.String()),
    body: t.String(),
    trigger: __nullable__(
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
    ruleId: __nullable__(t.String()),
    patientId: __nullable__(t.String()),
    appointmentId: __nullable__(t.String()),
    dedupeKey: t.String(),
    scheduledFor: t.Date(),
    attempts: t.Integer(),
    maxAttempts: t.Integer(),
    sentAt: __nullable__(t.Date()),
    failedAt: __nullable__(t.Date()),
    lastError: __nullable__(t.String()),
    manualLink: __nullable__(
      t.String({
        description: `مزوّد واتساب MANUAL: رابط wa.me الجاهز. وجودُه يعني أن الإرسال فعلٌ بشريّ
موثَّق، لا وعدٌ بإرسالٍ آليّ لا يحدث.`,
      }),
    ),
    manualSentById: __nullable__(
      t.String({
        description: `من ضغط الرابط — به يصير الإرسال اليدويّ حدثًا مسجَّلًا لا افتراضًا`,
      }),
    ),
    metadata: __nullable__(t.Any()),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  },
  {
    additionalProperties: false,
    description: `رسالةٌ صادرة واحدة، بقناةٍ واحدة، لمستلِمٍ واحد.
**\`dedupeKey\` هو العمود الحامل.** صيغته
\`{trigger}:{subjectId}:{بصمة الاستحقاق}\` — مثلًا
\`VACCINATION_DUE:pat_123:RABIES:2026-10-01\`. وفرادتُه على مستوى العيادة هي ما
يجعل المُجدوِل عديمَ الأثر عند التكرار: أوّلُ إدراجٍ يفوز، وما بعده يُهمَل بهدوء.
بدونه كان كل تشغيل cron يُنشئ رسالةً جديدة للسبب نفسه.
والجسد **لقطة** لا قالبٌ يُحلّ عند الإرسال: تعديل القالب غدًا يجب ألّا يغيّر ما
أُرسل أمس (نفس منطق \`VaccinationRecord.vaccineNameSnapshot\`).`,
  },
);

export const NotificationOutboxRelations = t.Object(
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
    recipient: __nullable__(
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
    rule: __nullable__(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
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
          name: t.String(),
          active: t.Boolean({
            description: `مُطفأة افتراضيًّا: وحدةٌ تبدأ بإرسال رسائل لمالكين حقيقيّين لحظةَ الترحيل
ليست ميزةً بل حادثة.`,
          }),
          offsetHours: t.Integer({
            description: `كم **ساعة قبل** الاستحقاق تُدرَج الرسالة. صفر = يوم الاستحقاق. السالب = بعده
(للاستدعاء المتأخّر: «تأخّرت ٧ أيام»).`,
          }),
          repeatAfterDays: __nullable__(
            t.Integer({
              description: `تذكيرٌ ثانٍ بعد N يومًا إن بقي السبب قائمًا (لم يُحجز موعد). \`null\` = مرّة واحدة.`,
            }),
          ),
          maxSends: t.Integer({
            description: `السقف الكلّي لعدد الرسائل لنفس السبب — الحدّ الذي يفصل التذكير عن الإزعاج`,
          }),
          channels: t.Array(
            t.Union(
              [
                t.Literal("INBOX"),
                t.Literal("EMAIL"),
                t.Literal("WHATSAPP"),
                t.Literal("SMS"),
                t.Literal("PUSH"),
              ],
              { additionalProperties: false },
            ),
            { additionalProperties: false },
          ),
          subjectTemplate: __nullable__(t.String()),
          bodyTemplate: t.String({
            description: `نصّ بعلامات {{...}} — يُحلّ بدالّة خالصة مُختبَرة (\`reminder-template.ts\`)`,
          }),
          quietHoursStart: __nullable__(
            t.Integer({
              description: `ساعات الهدوء بالدقائق من منتصف الليل بتوقيت العيادة. رسالةٌ تقع داخلها
تُؤجَّل إلى نهايتها لا تُلغى.`,
            }),
          ),
          quietHoursEnd: __nullable__(t.Integer()),
          horizonDays: t.Integer({
            description: `مدى الاستباق للمحرّكات التي تقبله (التطعيمات/التجميل) — بالأيام`,
          }),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `قاعدةٌ واحدة: متى نُذكِّر، بأيّ قنوات، وبأيّ نصّ.
وهي أيضًا الوجهة التي **يجب** أن تُشير إليها مفاتيح شاشة الإعدادات: قبل هذه
الوحدة كانت \`ClinicNotificationSettings.emailReminder*Enabled\` تُكتب ولا يقرؤها
أيّ مسار خادم — أي أن العيادة تُشغّل «تذكير قبل ٢٤ ساعة» ولا يحدث شيء أبدًا.`,
        },
      ),
    ),
  },
  {
    additionalProperties: false,
    description: `رسالةٌ صادرة واحدة، بقناةٍ واحدة، لمستلِمٍ واحد.
**\`dedupeKey\` هو العمود الحامل.** صيغته
\`{trigger}:{subjectId}:{بصمة الاستحقاق}\` — مثلًا
\`VACCINATION_DUE:pat_123:RABIES:2026-10-01\`. وفرادتُه على مستوى العيادة هي ما
يجعل المُجدوِل عديمَ الأثر عند التكرار: أوّلُ إدراجٍ يفوز، وما بعده يُهمَل بهدوء.
بدونه كان كل تشغيل cron يُنشئ رسالةً جديدة للسبب نفسه.
والجسد **لقطة** لا قالبٌ يُحلّ عند الإرسال: تعديل القالب غدًا يجب ألّا يغيّر ما
أُرسل أمس (نفس منطق \`VaccinationRecord.vaccineNameSnapshot\`).`,
  },
);

export const NotificationOutboxPlainInputCreate = t.Object(
  {
    channel: t.Union(
      [
        t.Literal("INBOX"),
        t.Literal("EMAIL"),
        t.Literal("WHATSAPP"),
        t.Literal("SMS"),
        t.Literal("PUSH"),
      ],
      { additionalProperties: false },
    ),
    status: t.Optional(
      t.Union(
        [
          t.Literal("QUEUED"),
          t.Literal("SENDING"),
          t.Literal("SENT"),
          t.Literal("FAILED"),
          t.Literal("SKIPPED"),
          t.Literal("CANCELLED"),
          t.Literal("AWAITING_MANUAL"),
        ],
        { additionalProperties: false },
      ),
    ),
    recipientKind: t.Union(
      [t.Literal("OWNER"), t.Literal("USER"), t.Literal("CLINIC")],
      { additionalProperties: false },
    ),
    toAddress: t.Optional(
      __nullable__(
        t.String({
          description: `عنوان التسليم وقت الإدراج (بريد أو رقم E.164) — لقطة: تغيير رقم المالك
لاحقًا يجب ألّا يُعيد كتابة إلى أين ذهبت رسالةُ الأمس`,
        }),
      ),
    ),
    subject: t.Optional(__nullable__(t.String())),
    body: t.String(),
    trigger: t.Optional(
      __nullable__(
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
    ),
    dedupeKey: t.String(),
    scheduledFor: t.Optional(t.Date()),
    attempts: t.Optional(t.Integer()),
    maxAttempts: t.Optional(t.Integer()),
    sentAt: t.Optional(__nullable__(t.Date())),
    failedAt: t.Optional(__nullable__(t.Date())),
    lastError: t.Optional(__nullable__(t.String())),
    manualLink: t.Optional(
      __nullable__(
        t.String({
          description: `مزوّد واتساب MANUAL: رابط wa.me الجاهز. وجودُه يعني أن الإرسال فعلٌ بشريّ
موثَّق، لا وعدٌ بإرسالٍ آليّ لا يحدث.`,
        }),
      ),
    ),
    metadata: t.Optional(__nullable__(t.Any())),
  },
  {
    additionalProperties: false,
    description: `رسالةٌ صادرة واحدة، بقناةٍ واحدة، لمستلِمٍ واحد.
**\`dedupeKey\` هو العمود الحامل.** صيغته
\`{trigger}:{subjectId}:{بصمة الاستحقاق}\` — مثلًا
\`VACCINATION_DUE:pat_123:RABIES:2026-10-01\`. وفرادتُه على مستوى العيادة هي ما
يجعل المُجدوِل عديمَ الأثر عند التكرار: أوّلُ إدراجٍ يفوز، وما بعده يُهمَل بهدوء.
بدونه كان كل تشغيل cron يُنشئ رسالةً جديدة للسبب نفسه.
والجسد **لقطة** لا قالبٌ يُحلّ عند الإرسال: تعديل القالب غدًا يجب ألّا يغيّر ما
أُرسل أمس (نفس منطق \`VaccinationRecord.vaccineNameSnapshot\`).`,
  },
);

export const NotificationOutboxPlainInputUpdate = t.Object(
  {
    channel: t.Optional(
      t.Union(
        [
          t.Literal("INBOX"),
          t.Literal("EMAIL"),
          t.Literal("WHATSAPP"),
          t.Literal("SMS"),
          t.Literal("PUSH"),
        ],
        { additionalProperties: false },
      ),
    ),
    status: t.Optional(
      t.Union(
        [
          t.Literal("QUEUED"),
          t.Literal("SENDING"),
          t.Literal("SENT"),
          t.Literal("FAILED"),
          t.Literal("SKIPPED"),
          t.Literal("CANCELLED"),
          t.Literal("AWAITING_MANUAL"),
        ],
        { additionalProperties: false },
      ),
    ),
    recipientKind: t.Optional(
      t.Union([t.Literal("OWNER"), t.Literal("USER"), t.Literal("CLINIC")], {
        additionalProperties: false,
      }),
    ),
    toAddress: t.Optional(
      __nullable__(
        t.String({
          description: `عنوان التسليم وقت الإدراج (بريد أو رقم E.164) — لقطة: تغيير رقم المالك
لاحقًا يجب ألّا يُعيد كتابة إلى أين ذهبت رسالةُ الأمس`,
        }),
      ),
    ),
    subject: t.Optional(__nullable__(t.String())),
    body: t.Optional(t.String()),
    trigger: t.Optional(
      __nullable__(
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
    ),
    dedupeKey: t.Optional(t.String()),
    scheduledFor: t.Optional(t.Date()),
    attempts: t.Optional(t.Integer()),
    maxAttempts: t.Optional(t.Integer()),
    sentAt: t.Optional(__nullable__(t.Date())),
    failedAt: t.Optional(__nullable__(t.Date())),
    lastError: t.Optional(__nullable__(t.String())),
    manualLink: t.Optional(
      __nullable__(
        t.String({
          description: `مزوّد واتساب MANUAL: رابط wa.me الجاهز. وجودُه يعني أن الإرسال فعلٌ بشريّ
موثَّق، لا وعدٌ بإرسالٍ آليّ لا يحدث.`,
        }),
      ),
    ),
    metadata: t.Optional(__nullable__(t.Any())),
  },
  {
    additionalProperties: false,
    description: `رسالةٌ صادرة واحدة، بقناةٍ واحدة، لمستلِمٍ واحد.
**\`dedupeKey\` هو العمود الحامل.** صيغته
\`{trigger}:{subjectId}:{بصمة الاستحقاق}\` — مثلًا
\`VACCINATION_DUE:pat_123:RABIES:2026-10-01\`. وفرادتُه على مستوى العيادة هي ما
يجعل المُجدوِل عديمَ الأثر عند التكرار: أوّلُ إدراجٍ يفوز، وما بعده يُهمَل بهدوء.
بدونه كان كل تشغيل cron يُنشئ رسالةً جديدة للسبب نفسه.
والجسد **لقطة** لا قالبٌ يُحلّ عند الإرسال: تعديل القالب غدًا يجب ألّا يغيّر ما
أُرسل أمس (نفس منطق \`VaccinationRecord.vaccineNameSnapshot\`).`,
  },
);

export const NotificationOutboxRelationsInputCreate = t.Object(
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
    recipient: t.Optional(
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
    rule: t.Optional(
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
    description: `رسالةٌ صادرة واحدة، بقناةٍ واحدة، لمستلِمٍ واحد.
**\`dedupeKey\` هو العمود الحامل.** صيغته
\`{trigger}:{subjectId}:{بصمة الاستحقاق}\` — مثلًا
\`VACCINATION_DUE:pat_123:RABIES:2026-10-01\`. وفرادتُه على مستوى العيادة هي ما
يجعل المُجدوِل عديمَ الأثر عند التكرار: أوّلُ إدراجٍ يفوز، وما بعده يُهمَل بهدوء.
بدونه كان كل تشغيل cron يُنشئ رسالةً جديدة للسبب نفسه.
والجسد **لقطة** لا قالبٌ يُحلّ عند الإرسال: تعديل القالب غدًا يجب ألّا يغيّر ما
أُرسل أمس (نفس منطق \`VaccinationRecord.vaccineNameSnapshot\`).`,
  },
);

export const NotificationOutboxRelationsInputUpdate = t.Partial(
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
      recipient: t.Partial(
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
      rule: t.Partial(
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
      description: `رسالةٌ صادرة واحدة، بقناةٍ واحدة، لمستلِمٍ واحد.
**\`dedupeKey\` هو العمود الحامل.** صيغته
\`{trigger}:{subjectId}:{بصمة الاستحقاق}\` — مثلًا
\`VACCINATION_DUE:pat_123:RABIES:2026-10-01\`. وفرادتُه على مستوى العيادة هي ما
يجعل المُجدوِل عديمَ الأثر عند التكرار: أوّلُ إدراجٍ يفوز، وما بعده يُهمَل بهدوء.
بدونه كان كل تشغيل cron يُنشئ رسالةً جديدة للسبب نفسه.
والجسد **لقطة** لا قالبٌ يُحلّ عند الإرسال: تعديل القالب غدًا يجب ألّا يغيّر ما
أُرسل أمس (نفس منطق \`VaccinationRecord.vaccineNameSnapshot\`).`,
    },
  ),
);

export const NotificationOutboxWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          clinicId: t.String(),
          channel: t.Union(
            [
              t.Literal("INBOX"),
              t.Literal("EMAIL"),
              t.Literal("WHATSAPP"),
              t.Literal("SMS"),
              t.Literal("PUSH"),
            ],
            { additionalProperties: false },
          ),
          status: t.Union(
            [
              t.Literal("QUEUED"),
              t.Literal("SENDING"),
              t.Literal("SENT"),
              t.Literal("FAILED"),
              t.Literal("SKIPPED"),
              t.Literal("CANCELLED"),
              t.Literal("AWAITING_MANUAL"),
            ],
            { additionalProperties: false },
          ),
          recipientKind: t.Union(
            [t.Literal("OWNER"), t.Literal("USER"), t.Literal("CLINIC")],
            { additionalProperties: false },
          ),
          ownerId: t.String(),
          recipientUserId: t.String(),
          toAddress: t.String({
            description: `عنوان التسليم وقت الإدراج (بريد أو رقم E.164) — لقطة: تغيير رقم المالك
لاحقًا يجب ألّا يُعيد كتابة إلى أين ذهبت رسالةُ الأمس`,
          }),
          subject: t.String(),
          body: t.String(),
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
          ruleId: t.String(),
          patientId: t.String(),
          appointmentId: t.String(),
          dedupeKey: t.String(),
          scheduledFor: t.Date(),
          attempts: t.Integer(),
          maxAttempts: t.Integer(),
          sentAt: t.Date(),
          failedAt: t.Date(),
          lastError: t.String(),
          manualLink: t.String({
            description: `مزوّد واتساب MANUAL: رابط wa.me الجاهز. وجودُه يعني أن الإرسال فعلٌ بشريّ
موثَّق، لا وعدٌ بإرسالٍ آليّ لا يحدث.`,
          }),
          manualSentById: t.String({
            description: `من ضغط الرابط — به يصير الإرسال اليدويّ حدثًا مسجَّلًا لا افتراضًا`,
          }),
          metadata: t.Any(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `رسالةٌ صادرة واحدة، بقناةٍ واحدة، لمستلِمٍ واحد.
**\`dedupeKey\` هو العمود الحامل.** صيغته
\`{trigger}:{subjectId}:{بصمة الاستحقاق}\` — مثلًا
\`VACCINATION_DUE:pat_123:RABIES:2026-10-01\`. وفرادتُه على مستوى العيادة هي ما
يجعل المُجدوِل عديمَ الأثر عند التكرار: أوّلُ إدراجٍ يفوز، وما بعده يُهمَل بهدوء.
بدونه كان كل تشغيل cron يُنشئ رسالةً جديدة للسبب نفسه.
والجسد **لقطة** لا قالبٌ يُحلّ عند الإرسال: تعديل القالب غدًا يجب ألّا يغيّر ما
أُرسل أمس (نفس منطق \`VaccinationRecord.vaccineNameSnapshot\`).`,
        },
      ),
    { $id: "NotificationOutbox" },
  ),
);

export const NotificationOutboxWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            {
              id: t.String(),
              clinicId_dedupeKey: t.Object(
                { clinicId: t.String(), dedupeKey: t.String() },
                { additionalProperties: false },
              ),
            },
            {
              additionalProperties: false,
              description: `رسالةٌ صادرة واحدة، بقناةٍ واحدة، لمستلِمٍ واحد.
**\`dedupeKey\` هو العمود الحامل.** صيغته
\`{trigger}:{subjectId}:{بصمة الاستحقاق}\` — مثلًا
\`VACCINATION_DUE:pat_123:RABIES:2026-10-01\`. وفرادتُه على مستوى العيادة هي ما
يجعل المُجدوِل عديمَ الأثر عند التكرار: أوّلُ إدراجٍ يفوز، وما بعده يُهمَل بهدوء.
بدونه كان كل تشغيل cron يُنشئ رسالةً جديدة للسبب نفسه.
والجسد **لقطة** لا قالبٌ يُحلّ عند الإرسال: تعديل القالب غدًا يجب ألّا يغيّر ما
أُرسل أمس (نفس منطق \`VaccinationRecord.vaccineNameSnapshot\`).`,
            },
          ),
          { additionalProperties: false },
        ),
        t.Union(
          [
            t.Object({ id: t.String() }),
            t.Object({
              clinicId_dedupeKey: t.Object(
                { clinicId: t.String(), dedupeKey: t.String() },
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
              clinicId: t.String(),
              channel: t.Union(
                [
                  t.Literal("INBOX"),
                  t.Literal("EMAIL"),
                  t.Literal("WHATSAPP"),
                  t.Literal("SMS"),
                  t.Literal("PUSH"),
                ],
                { additionalProperties: false },
              ),
              status: t.Union(
                [
                  t.Literal("QUEUED"),
                  t.Literal("SENDING"),
                  t.Literal("SENT"),
                  t.Literal("FAILED"),
                  t.Literal("SKIPPED"),
                  t.Literal("CANCELLED"),
                  t.Literal("AWAITING_MANUAL"),
                ],
                { additionalProperties: false },
              ),
              recipientKind: t.Union(
                [t.Literal("OWNER"), t.Literal("USER"), t.Literal("CLINIC")],
                { additionalProperties: false },
              ),
              ownerId: t.String(),
              recipientUserId: t.String(),
              toAddress: t.String({
                description: `عنوان التسليم وقت الإدراج (بريد أو رقم E.164) — لقطة: تغيير رقم المالك
لاحقًا يجب ألّا يُعيد كتابة إلى أين ذهبت رسالةُ الأمس`,
              }),
              subject: t.String(),
              body: t.String(),
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
              ruleId: t.String(),
              patientId: t.String(),
              appointmentId: t.String(),
              dedupeKey: t.String(),
              scheduledFor: t.Date(),
              attempts: t.Integer(),
              maxAttempts: t.Integer(),
              sentAt: t.Date(),
              failedAt: t.Date(),
              lastError: t.String(),
              manualLink: t.String({
                description: `مزوّد واتساب MANUAL: رابط wa.me الجاهز. وجودُه يعني أن الإرسال فعلٌ بشريّ
موثَّق، لا وعدٌ بإرسالٍ آليّ لا يحدث.`,
              }),
              manualSentById: t.String({
                description: `من ضغط الرابط — به يصير الإرسال اليدويّ حدثًا مسجَّلًا لا افتراضًا`,
              }),
              metadata: t.Any(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "NotificationOutbox" },
);

export const NotificationOutboxSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      clinicId: t.Boolean(),
      channel: t.Boolean(),
      status: t.Boolean(),
      recipientKind: t.Boolean(),
      ownerId: t.Boolean(),
      recipientUserId: t.Boolean(),
      toAddress: t.Boolean(),
      subject: t.Boolean(),
      body: t.Boolean(),
      trigger: t.Boolean(),
      ruleId: t.Boolean(),
      patientId: t.Boolean(),
      appointmentId: t.Boolean(),
      dedupeKey: t.Boolean(),
      scheduledFor: t.Boolean(),
      attempts: t.Boolean(),
      maxAttempts: t.Boolean(),
      sentAt: t.Boolean(),
      failedAt: t.Boolean(),
      lastError: t.Boolean(),
      manualLink: t.Boolean(),
      manualSentById: t.Boolean(),
      metadata: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinic: t.Boolean(),
      owner: t.Boolean(),
      recipient: t.Boolean(),
      patient: t.Boolean(),
      appointment: t.Boolean(),
      rule: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `رسالةٌ صادرة واحدة، بقناةٍ واحدة، لمستلِمٍ واحد.
**\`dedupeKey\` هو العمود الحامل.** صيغته
\`{trigger}:{subjectId}:{بصمة الاستحقاق}\` — مثلًا
\`VACCINATION_DUE:pat_123:RABIES:2026-10-01\`. وفرادتُه على مستوى العيادة هي ما
يجعل المُجدوِل عديمَ الأثر عند التكرار: أوّلُ إدراجٍ يفوز، وما بعده يُهمَل بهدوء.
بدونه كان كل تشغيل cron يُنشئ رسالةً جديدة للسبب نفسه.
والجسد **لقطة** لا قالبٌ يُحلّ عند الإرسال: تعديل القالب غدًا يجب ألّا يغيّر ما
أُرسل أمس (نفس منطق \`VaccinationRecord.vaccineNameSnapshot\`).`,
    },
  ),
);

export const NotificationOutboxInclude = t.Partial(
  t.Object(
    {
      channel: t.Boolean(),
      status: t.Boolean(),
      recipientKind: t.Boolean(),
      trigger: t.Boolean(),
      clinic: t.Boolean(),
      owner: t.Boolean(),
      recipient: t.Boolean(),
      patient: t.Boolean(),
      appointment: t.Boolean(),
      rule: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `رسالةٌ صادرة واحدة، بقناةٍ واحدة، لمستلِمٍ واحد.
**\`dedupeKey\` هو العمود الحامل.** صيغته
\`{trigger}:{subjectId}:{بصمة الاستحقاق}\` — مثلًا
\`VACCINATION_DUE:pat_123:RABIES:2026-10-01\`. وفرادتُه على مستوى العيادة هي ما
يجعل المُجدوِل عديمَ الأثر عند التكرار: أوّلُ إدراجٍ يفوز، وما بعده يُهمَل بهدوء.
بدونه كان كل تشغيل cron يُنشئ رسالةً جديدة للسبب نفسه.
والجسد **لقطة** لا قالبٌ يُحلّ عند الإرسال: تعديل القالب غدًا يجب ألّا يغيّر ما
أُرسل أمس (نفس منطق \`VaccinationRecord.vaccineNameSnapshot\`).`,
    },
  ),
);

export const NotificationOutboxOrderBy = t.Partial(
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
      recipientUserId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      toAddress: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      subject: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      body: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      ruleId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      patientId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      appointmentId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      dedupeKey: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      scheduledFor: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      attempts: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      maxAttempts: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      sentAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      failedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      lastError: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      manualLink: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      manualSentById: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      metadata: t.Union([t.Literal("asc"), t.Literal("desc")], {
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
      description: `رسالةٌ صادرة واحدة، بقناةٍ واحدة، لمستلِمٍ واحد.
**\`dedupeKey\` هو العمود الحامل.** صيغته
\`{trigger}:{subjectId}:{بصمة الاستحقاق}\` — مثلًا
\`VACCINATION_DUE:pat_123:RABIES:2026-10-01\`. وفرادتُه على مستوى العيادة هي ما
يجعل المُجدوِل عديمَ الأثر عند التكرار: أوّلُ إدراجٍ يفوز، وما بعده يُهمَل بهدوء.
بدونه كان كل تشغيل cron يُنشئ رسالةً جديدة للسبب نفسه.
والجسد **لقطة** لا قالبٌ يُحلّ عند الإرسال: تعديل القالب غدًا يجب ألّا يغيّر ما
أُرسل أمس (نفس منطق \`VaccinationRecord.vaccineNameSnapshot\`).`,
    },
  ),
);

export const NotificationOutbox = t.Composite(
  [NotificationOutboxPlain, NotificationOutboxRelations],
  { additionalProperties: false },
);

export const NotificationOutboxInputCreate = t.Composite(
  [NotificationOutboxPlainInputCreate, NotificationOutboxRelationsInputCreate],
  { additionalProperties: false },
);

export const NotificationOutboxInputUpdate = t.Composite(
  [NotificationOutboxPlainInputUpdate, NotificationOutboxRelationsInputUpdate],
  { additionalProperties: false },
);
