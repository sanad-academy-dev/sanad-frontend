import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const ReminderRulePlain = t.Object(
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
);

export const ReminderRuleRelations = t.Object(
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
    outbox: t.Array(
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
      ),
      { additionalProperties: false },
    ),
  },
  {
    additionalProperties: false,
    description: `قاعدةٌ واحدة: متى نُذكِّر، بأيّ قنوات، وبأيّ نصّ.
وهي أيضًا الوجهة التي **يجب** أن تُشير إليها مفاتيح شاشة الإعدادات: قبل هذه
الوحدة كانت \`ClinicNotificationSettings.emailReminder*Enabled\` تُكتب ولا يقرؤها
أيّ مسار خادم — أي أن العيادة تُشغّل «تذكير قبل ٢٤ ساعة» ولا يحدث شيء أبدًا.`,
  },
);

export const ReminderRulePlainInputCreate = t.Object(
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
    name: t.String(),
    active: t.Optional(
      t.Boolean({
        description: `مُطفأة افتراضيًّا: وحدةٌ تبدأ بإرسال رسائل لمالكين حقيقيّين لحظةَ الترحيل
ليست ميزةً بل حادثة.`,
      }),
    ),
    offsetHours: t.Optional(
      t.Integer({
        description: `كم **ساعة قبل** الاستحقاق تُدرَج الرسالة. صفر = يوم الاستحقاق. السالب = بعده
(للاستدعاء المتأخّر: «تأخّرت ٧ أيام»).`,
      }),
    ),
    repeatAfterDays: t.Optional(
      __nullable__(
        t.Integer({
          description: `تذكيرٌ ثانٍ بعد N يومًا إن بقي السبب قائمًا (لم يُحجز موعد). \`null\` = مرّة واحدة.`,
        }),
      ),
    ),
    maxSends: t.Optional(
      t.Integer({
        description: `السقف الكلّي لعدد الرسائل لنفس السبب — الحدّ الذي يفصل التذكير عن الإزعاج`,
      }),
    ),
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
    subjectTemplate: t.Optional(__nullable__(t.String())),
    bodyTemplate: t.String({
      description: `نصّ بعلامات {{...}} — يُحلّ بدالّة خالصة مُختبَرة (\`reminder-template.ts\`)`,
    }),
    quietHoursStart: t.Optional(
      __nullable__(
        t.Integer({
          description: `ساعات الهدوء بالدقائق من منتصف الليل بتوقيت العيادة. رسالةٌ تقع داخلها
تُؤجَّل إلى نهايتها لا تُلغى.`,
        }),
      ),
    ),
    quietHoursEnd: t.Optional(__nullable__(t.Integer())),
    horizonDays: t.Optional(
      t.Integer({
        description: `مدى الاستباق للمحرّكات التي تقبله (التطعيمات/التجميل) — بالأيام`,
      }),
    ),
  },
  {
    additionalProperties: false,
    description: `قاعدةٌ واحدة: متى نُذكِّر، بأيّ قنوات، وبأيّ نصّ.
وهي أيضًا الوجهة التي **يجب** أن تُشير إليها مفاتيح شاشة الإعدادات: قبل هذه
الوحدة كانت \`ClinicNotificationSettings.emailReminder*Enabled\` تُكتب ولا يقرؤها
أيّ مسار خادم — أي أن العيادة تُشغّل «تذكير قبل ٢٤ ساعة» ولا يحدث شيء أبدًا.`,
  },
);

export const ReminderRulePlainInputUpdate = t.Object(
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
    name: t.Optional(t.String()),
    active: t.Optional(
      t.Boolean({
        description: `مُطفأة افتراضيًّا: وحدةٌ تبدأ بإرسال رسائل لمالكين حقيقيّين لحظةَ الترحيل
ليست ميزةً بل حادثة.`,
      }),
    ),
    offsetHours: t.Optional(
      t.Integer({
        description: `كم **ساعة قبل** الاستحقاق تُدرَج الرسالة. صفر = يوم الاستحقاق. السالب = بعده
(للاستدعاء المتأخّر: «تأخّرت ٧ أيام»).`,
      }),
    ),
    repeatAfterDays: t.Optional(
      __nullable__(
        t.Integer({
          description: `تذكيرٌ ثانٍ بعد N يومًا إن بقي السبب قائمًا (لم يُحجز موعد). \`null\` = مرّة واحدة.`,
        }),
      ),
    ),
    maxSends: t.Optional(
      t.Integer({
        description: `السقف الكلّي لعدد الرسائل لنفس السبب — الحدّ الذي يفصل التذكير عن الإزعاج`,
      }),
    ),
    channels: t.Optional(
      t.Array(
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
    ),
    subjectTemplate: t.Optional(__nullable__(t.String())),
    bodyTemplate: t.Optional(
      t.String({
        description: `نصّ بعلامات {{...}} — يُحلّ بدالّة خالصة مُختبَرة (\`reminder-template.ts\`)`,
      }),
    ),
    quietHoursStart: t.Optional(
      __nullable__(
        t.Integer({
          description: `ساعات الهدوء بالدقائق من منتصف الليل بتوقيت العيادة. رسالةٌ تقع داخلها
تُؤجَّل إلى نهايتها لا تُلغى.`,
        }),
      ),
    ),
    quietHoursEnd: t.Optional(__nullable__(t.Integer())),
    horizonDays: t.Optional(
      t.Integer({
        description: `مدى الاستباق للمحرّكات التي تقبله (التطعيمات/التجميل) — بالأيام`,
      }),
    ),
  },
  {
    additionalProperties: false,
    description: `قاعدةٌ واحدة: متى نُذكِّر، بأيّ قنوات، وبأيّ نصّ.
وهي أيضًا الوجهة التي **يجب** أن تُشير إليها مفاتيح شاشة الإعدادات: قبل هذه
الوحدة كانت \`ClinicNotificationSettings.emailReminder*Enabled\` تُكتب ولا يقرؤها
أيّ مسار خادم — أي أن العيادة تُشغّل «تذكير قبل ٢٤ ساعة» ولا يحدث شيء أبدًا.`,
  },
);

export const ReminderRuleRelationsInputCreate = t.Object(
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
    outbox: t.Optional(
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
  {
    additionalProperties: false,
    description: `قاعدةٌ واحدة: متى نُذكِّر، بأيّ قنوات، وبأيّ نصّ.
وهي أيضًا الوجهة التي **يجب** أن تُشير إليها مفاتيح شاشة الإعدادات: قبل هذه
الوحدة كانت \`ClinicNotificationSettings.emailReminder*Enabled\` تُكتب ولا يقرؤها
أيّ مسار خادم — أي أن العيادة تُشغّل «تذكير قبل ٢٤ ساعة» ولا يحدث شيء أبدًا.`,
  },
);

export const ReminderRuleRelationsInputUpdate = t.Partial(
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
      outbox: t.Partial(
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
    {
      additionalProperties: false,
      description: `قاعدةٌ واحدة: متى نُذكِّر، بأيّ قنوات، وبأيّ نصّ.
وهي أيضًا الوجهة التي **يجب** أن تُشير إليها مفاتيح شاشة الإعدادات: قبل هذه
الوحدة كانت \`ClinicNotificationSettings.emailReminder*Enabled\` تُكتب ولا يقرؤها
أيّ مسار خادم — أي أن العيادة تُشغّل «تذكير قبل ٢٤ ساعة» ولا يحدث شيء أبدًا.`,
    },
  ),
);

export const ReminderRuleWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
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
          repeatAfterDays: t.Integer({
            description: `تذكيرٌ ثانٍ بعد N يومًا إن بقي السبب قائمًا (لم يُحجز موعد). \`null\` = مرّة واحدة.`,
          }),
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
          subjectTemplate: t.String(),
          bodyTemplate: t.String({
            description: `نصّ بعلامات {{...}} — يُحلّ بدالّة خالصة مُختبَرة (\`reminder-template.ts\`)`,
          }),
          quietHoursStart: t.Integer({
            description: `ساعات الهدوء بالدقائق من منتصف الليل بتوقيت العيادة. رسالةٌ تقع داخلها
تُؤجَّل إلى نهايتها لا تُلغى.`,
          }),
          quietHoursEnd: t.Integer(),
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
    { $id: "ReminderRule" },
  ),
);

export const ReminderRuleWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            {
              id: t.String(),
              clinicId_trigger_name: t.Object(
                {
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
                },
                { additionalProperties: false },
              ),
            },
            {
              additionalProperties: false,
              description: `قاعدةٌ واحدة: متى نُذكِّر، بأيّ قنوات، وبأيّ نصّ.
وهي أيضًا الوجهة التي **يجب** أن تُشير إليها مفاتيح شاشة الإعدادات: قبل هذه
الوحدة كانت \`ClinicNotificationSettings.emailReminder*Enabled\` تُكتب ولا يقرؤها
أيّ مسار خادم — أي أن العيادة تُشغّل «تذكير قبل ٢٤ ساعة» ولا يحدث شيء أبدًا.`,
            },
          ),
          { additionalProperties: false },
        ),
        t.Union(
          [
            t.Object({ id: t.String() }),
            t.Object({
              clinicId_trigger_name: t.Object(
                {
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
                },
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
              repeatAfterDays: t.Integer({
                description: `تذكيرٌ ثانٍ بعد N يومًا إن بقي السبب قائمًا (لم يُحجز موعد). \`null\` = مرّة واحدة.`,
              }),
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
              subjectTemplate: t.String(),
              bodyTemplate: t.String({
                description: `نصّ بعلامات {{...}} — يُحلّ بدالّة خالصة مُختبَرة (\`reminder-template.ts\`)`,
              }),
              quietHoursStart: t.Integer({
                description: `ساعات الهدوء بالدقائق من منتصف الليل بتوقيت العيادة. رسالةٌ تقع داخلها
تُؤجَّل إلى نهايتها لا تُلغى.`,
              }),
              quietHoursEnd: t.Integer(),
              horizonDays: t.Integer({
                description: `مدى الاستباق للمحرّكات التي تقبله (التطعيمات/التجميل) — بالأيام`,
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
  { $id: "ReminderRule" },
);

export const ReminderRuleSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      clinicId: t.Boolean(),
      trigger: t.Boolean(),
      name: t.Boolean(),
      active: t.Boolean(),
      offsetHours: t.Boolean(),
      repeatAfterDays: t.Boolean(),
      maxSends: t.Boolean(),
      channels: t.Boolean(),
      subjectTemplate: t.Boolean(),
      bodyTemplate: t.Boolean(),
      quietHoursStart: t.Boolean(),
      quietHoursEnd: t.Boolean(),
      horizonDays: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinic: t.Boolean(),
      outbox: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `قاعدةٌ واحدة: متى نُذكِّر، بأيّ قنوات، وبأيّ نصّ.
وهي أيضًا الوجهة التي **يجب** أن تُشير إليها مفاتيح شاشة الإعدادات: قبل هذه
الوحدة كانت \`ClinicNotificationSettings.emailReminder*Enabled\` تُكتب ولا يقرؤها
أيّ مسار خادم — أي أن العيادة تُشغّل «تذكير قبل ٢٤ ساعة» ولا يحدث شيء أبدًا.`,
    },
  ),
);

export const ReminderRuleInclude = t.Partial(
  t.Object(
    {
      trigger: t.Boolean(),
      channels: t.Boolean(),
      clinic: t.Boolean(),
      outbox: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `قاعدةٌ واحدة: متى نُذكِّر، بأيّ قنوات، وبأيّ نصّ.
وهي أيضًا الوجهة التي **يجب** أن تُشير إليها مفاتيح شاشة الإعدادات: قبل هذه
الوحدة كانت \`ClinicNotificationSettings.emailReminder*Enabled\` تُكتب ولا يقرؤها
أيّ مسار خادم — أي أن العيادة تُشغّل «تذكير قبل ٢٤ ساعة» ولا يحدث شيء أبدًا.`,
    },
  ),
);

export const ReminderRuleOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clinicId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      name: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      active: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      offsetHours: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      repeatAfterDays: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      maxSends: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      subjectTemplate: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      bodyTemplate: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      quietHoursStart: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      quietHoursEnd: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      horizonDays: t.Union([t.Literal("asc"), t.Literal("desc")], {
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
      description: `قاعدةٌ واحدة: متى نُذكِّر، بأيّ قنوات، وبأيّ نصّ.
وهي أيضًا الوجهة التي **يجب** أن تُشير إليها مفاتيح شاشة الإعدادات: قبل هذه
الوحدة كانت \`ClinicNotificationSettings.emailReminder*Enabled\` تُكتب ولا يقرؤها
أيّ مسار خادم — أي أن العيادة تُشغّل «تذكير قبل ٢٤ ساعة» ولا يحدث شيء أبدًا.`,
    },
  ),
);

export const ReminderRule = t.Composite(
  [ReminderRulePlain, ReminderRuleRelations],
  { additionalProperties: false },
);

export const ReminderRuleInputCreate = t.Composite(
  [ReminderRulePlainInputCreate, ReminderRuleRelationsInputCreate],
  { additionalProperties: false },
);

export const ReminderRuleInputUpdate = t.Composite(
  [ReminderRulePlainInputUpdate, ReminderRuleRelationsInputUpdate],
  { additionalProperties: false },
);
