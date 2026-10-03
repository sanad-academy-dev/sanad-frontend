import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const CrmEmailTemplatePlain = t.Object(
  {
    id: t.String(),
    clinicId: t.String(),
    name: t.String(),
    subject: t.String(),
    body: t.String({
      description: `نصّ القالب بمتغيّراته الحرفية — يُخزَّن كما كتبه المستخدم، ويُحَلّ عند الإرسال`,
    }),
    active: t.Boolean(),
    isDeleted: t.Boolean(),
    deletedAt: __nullable__(t.Date()),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  },
  {
    additionalProperties: false,
    description: `[CRM-P3] §9.1 — قالب بريد عربي. المتغيّرات \`{{...}}\` تُحَلّ من الكيان عند الإنشاء.`,
  },
);

export const CrmEmailTemplateRelations = t.Object(
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
    messages: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          referenceType: t.Union([t.Literal("LEAD"), t.Literal("DEAL")], {
            additionalProperties: false,
            description: `*
* §8.1 — one polymorphic pattern for every activity and the status log.`,
          }),
          referenceId: t.String(),
          templateId: __nullable__(
            t.String({
              description: `القالب المستعمَل إن وُجد؛ \`SetNull\` فحذف قالبٍ لا يمحو سجلّ ما أُرسل به`,
            }),
          ),
          toAddress: t.String(),
          subject: t.String(),
          body: t.String(),
          replyTo: __nullable__(
            t.String({
              description: `عنوان الردّ الذي ضُبِط فعلًا (§17.2 صفّ ١٣) — يُخزَّن لأن إعدادات العيادة قد تتغيّر،
فالسجلّ يقول أين كانت الردود تذهب وقتها، لا أين تذهب اليوم`,
            }),
          ),
          status: t.Union([t.Literal("SENT"), t.Literal("FAILED")], {
            additionalProperties: false,
            description: `[CRM-P3] §9.1 — حالة رسالة البريد. عضوان فقط، وهذا مقصود (قرار المالك، §17.2 صفّ ١٢).
النقل الحالي (Gmail SMTP عبر nodemailer) يحسم عند **قبول** الخادم للرسالة، لا عند
تسليمها: لا تقارير فتح، ولا إيصالات تسليم، ولا خطّاف ارتداد — الارتدادات تعود بريدًا
إلى الصندوق المُرسِل ولا يقرؤه شيء هنا. فأيّ عضوٍ ثالث (DELIVERED/OPENED) سيكون حالةً
لا يستطيع النظام معرفتها. لا تُضِف عضوًا هنا قبل أن يتغيّر النقل نفسه.`,
          }),
          failureReason: __nullable__(
            t.String({
              description: `رسالة خطأ SMTP حين FAILED — تُعرض للمستخدم كما هي، فهي التشخيص الوحيد المتاح`,
            }),
          ),
          sentByUserId: __nullable__(t.String()),
          sentAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `[CRM-P3] §9.1 — سجلّ الرسائل الصادرة، بنمط §8.1 متعدّد الأشكال ليخدم العميل المحتمل
والصفقة معًا. هذا **أوّل** حفظٍ لبريدٍ صادر في المستودع: المواضع الأربعة القائمة
(المصروفات، الإجازات، كشف الحساب، رمز الدخول) لا تسجّل شيئًا.
المُرسَل يُخزَّن **بعد** حلّ المتغيّرات: القالب قد يتغيّر لاحقًا، وسجلٌّ يعيد التوليد
من قالبٍ مُعدَّل يعرض نصًّا لم يُرسَل قط.`,
        },
      ),
      { additionalProperties: false },
    ),
  },
  {
    additionalProperties: false,
    description: `[CRM-P3] §9.1 — قالب بريد عربي. المتغيّرات \`{{...}}\` تُحَلّ من الكيان عند الإنشاء.`,
  },
);

export const CrmEmailTemplatePlainInputCreate = t.Object(
  {
    name: t.String(),
    subject: t.String(),
    body: t.String({
      description: `نصّ القالب بمتغيّراته الحرفية — يُخزَّن كما كتبه المستخدم، ويُحَلّ عند الإرسال`,
    }),
    active: t.Optional(t.Boolean()),
    isDeleted: t.Optional(t.Boolean()),
    deletedAt: t.Optional(__nullable__(t.Date())),
  },
  {
    additionalProperties: false,
    description: `[CRM-P3] §9.1 — قالب بريد عربي. المتغيّرات \`{{...}}\` تُحَلّ من الكيان عند الإنشاء.`,
  },
);

export const CrmEmailTemplatePlainInputUpdate = t.Object(
  {
    name: t.Optional(t.String()),
    subject: t.Optional(t.String()),
    body: t.Optional(
      t.String({
        description: `نصّ القالب بمتغيّراته الحرفية — يُخزَّن كما كتبه المستخدم، ويُحَلّ عند الإرسال`,
      }),
    ),
    active: t.Optional(t.Boolean()),
    isDeleted: t.Optional(t.Boolean()),
    deletedAt: t.Optional(__nullable__(t.Date())),
  },
  {
    additionalProperties: false,
    description: `[CRM-P3] §9.1 — قالب بريد عربي. المتغيّرات \`{{...}}\` تُحَلّ من الكيان عند الإنشاء.`,
  },
);

export const CrmEmailTemplateRelationsInputCreate = t.Object(
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
    messages: t.Optional(
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
    description: `[CRM-P3] §9.1 — قالب بريد عربي. المتغيّرات \`{{...}}\` تُحَلّ من الكيان عند الإنشاء.`,
  },
);

export const CrmEmailTemplateRelationsInputUpdate = t.Partial(
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
      messages: t.Partial(
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
      description: `[CRM-P3] §9.1 — قالب بريد عربي. المتغيّرات \`{{...}}\` تُحَلّ من الكيان عند الإنشاء.`,
    },
  ),
);

export const CrmEmailTemplateWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          clinicId: t.String(),
          name: t.String(),
          subject: t.String(),
          body: t.String({
            description: `نصّ القالب بمتغيّراته الحرفية — يُخزَّن كما كتبه المستخدم، ويُحَلّ عند الإرسال`,
          }),
          active: t.Boolean(),
          isDeleted: t.Boolean(),
          deletedAt: t.Date(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `[CRM-P3] §9.1 — قالب بريد عربي. المتغيّرات \`{{...}}\` تُحَلّ من الكيان عند الإنشاء.`,
        },
      ),
    { $id: "CrmEmailTemplate" },
  ),
);

export const CrmEmailTemplateWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.String() },
            {
              additionalProperties: false,
              description: `[CRM-P3] §9.1 — قالب بريد عربي. المتغيّرات \`{{...}}\` تُحَلّ من الكيان عند الإنشاء.`,
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
              name: t.String(),
              subject: t.String(),
              body: t.String({
                description: `نصّ القالب بمتغيّراته الحرفية — يُخزَّن كما كتبه المستخدم، ويُحَلّ عند الإرسال`,
              }),
              active: t.Boolean(),
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
  { $id: "CrmEmailTemplate" },
);

export const CrmEmailTemplateSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      clinicId: t.Boolean(),
      name: t.Boolean(),
      subject: t.Boolean(),
      body: t.Boolean(),
      active: t.Boolean(),
      isDeleted: t.Boolean(),
      deletedAt: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinic: t.Boolean(),
      messages: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `[CRM-P3] §9.1 — قالب بريد عربي. المتغيّرات \`{{...}}\` تُحَلّ من الكيان عند الإنشاء.`,
    },
  ),
);

export const CrmEmailTemplateInclude = t.Partial(
  t.Object(
    { clinic: t.Boolean(), messages: t.Boolean(), _count: t.Boolean() },
    {
      additionalProperties: false,
      description: `[CRM-P3] §9.1 — قالب بريد عربي. المتغيّرات \`{{...}}\` تُحَلّ من الكيان عند الإنشاء.`,
    },
  ),
);

export const CrmEmailTemplateOrderBy = t.Partial(
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
      subject: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      body: t.Union([t.Literal("asc"), t.Literal("desc")], {
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
      createdAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      updatedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    {
      additionalProperties: false,
      description: `[CRM-P3] §9.1 — قالب بريد عربي. المتغيّرات \`{{...}}\` تُحَلّ من الكيان عند الإنشاء.`,
    },
  ),
);

export const CrmEmailTemplate = t.Composite(
  [CrmEmailTemplatePlain, CrmEmailTemplateRelations],
  { additionalProperties: false },
);

export const CrmEmailTemplateInputCreate = t.Composite(
  [CrmEmailTemplatePlainInputCreate, CrmEmailTemplateRelationsInputCreate],
  { additionalProperties: false },
);

export const CrmEmailTemplateInputUpdate = t.Composite(
  [CrmEmailTemplatePlainInputUpdate, CrmEmailTemplateRelationsInputUpdate],
  { additionalProperties: false },
);
