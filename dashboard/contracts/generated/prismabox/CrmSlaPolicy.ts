import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const CrmSlaPolicyPlain = t.Object(
  {
    id: t.String(),
    clinicId: t.String(),
    name: t.String(),
    appliesTo: t.Union(
      [t.Literal("LEAD"), t.Literal("DEAL"), t.Literal("BOTH")],
      {
        additionalProperties: false,
        description: `[CRM-P5] §10.1 — على أيّ كيانٍ تنطبق السياسة.`,
      },
    ),
    firstResponseMinutes: t.Integer({
      description: `الهدف بالدقائق، محسوبًا على **وقت العمل** لا الساعة الجدارية (§17.2 صفّ ٢٢).`,
    }),
    order: t.Integer(),
    isActive: t.Boolean(),
    isDeleted: t.Boolean(),
    deletedAt: __nullable__(t.Date()),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  },
  {
    additionalProperties: false,
    description: `[CRM-P5] §10.1 — سياسة استجابةٍ أولى واحدة، مسطَّحة عمدًا.
النظام المرجعيّ يحمل مصفوفة أولويّات (هدفٌ لكل أولوية × كل مصدر). v1 يسطّحها إلى
**هدفٍ واحد للسياسة** + تجاوزات اختيارية لكل مصدر في صفوفٍ ابنة، لأنّ المصفوفة
الكاملة بلا محرّك دوراتٍ متجدّدة (§10.5، مؤجَّل [P2]) تكون تعقيدًا بلا ثمرة.
**الاختيار: أوّل سياسةٍ فعّالة مطابِقة تنطبق عند الإنشاء** (قاعدة النظام المرجعيّ).
«مطابِقة» = بلا صفوف مصادر (تنطبق على الكلّ) أو أنّ مصدر السجلّ ضمن صفوفها.
و\`order\` يفضّ التعادل صراحةً: بلا ترتيبٍ ثابت تصير «الأولى» رهنَ ترتيب الاستعلام.`,
  },
);

export const CrmSlaPolicyRelations = t.Object(
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
    sources: t.Array(
      t.Object(
        {
          id: t.String(),
          policyId: t.String(),
          sourceId: t.String(),
          firstResponseMinutes: __nullable__(
            t.Integer({
              description: `تجاوزٌ اختياريّ لهدف الأمّ. فارغ = استعمل هدف السياسة.`,
            }),
          ),
          createdAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `[CRM-P5] §10.1 — صفٌّ ابن يقصر السياسة على مصدرٍ بعينه، ويجوز أن يتجاوز هدفها.
دوران في واحد بقصد: وجود الصفّ يقول «هذه السياسة تخصّ هذا المصدر»، و
\`firstResponseMinutes\` غير الفارغ يقول «وبهذا الهدف بدل هدف الأمّ». سياسةٌ بلا
صفوفٍ تنطبق على كلّ المصادر — وهو الفرق بين «لم يُحدَّد مصدر» و«حُدِّد ولم يُطابِق».`,
        },
      ),
      { additionalProperties: false },
    ),
    defaultForClinics: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          enableCrmModule: t.Boolean(),
          crmDefaultSlaPolicyId: __nullable__(
            t.String({
              description: `§10 — [CRM-P5] صار علاقةً حقيقية كما وعد تعليق CRM-P0: الجدول موجود الآن.
\`SetNull\` لا \`Restrict\`: حذف سياسةٍ يترك العيادة بلا سياسةٍ افتراضية، وهي حالة
صحيحة (§10.1 «أوّل سياسةٍ فعّالة مطابِقة» تعمل بلا افتراضيّ أصلًا).`,
            }),
          ),
          crmWhatsappProvider: t.Union(
            [t.Literal("MANUAL"), t.Literal("GREEN_API")],
            { additionalProperties: false },
          ),
          crmEmailFromName: __nullable__(t.String()),
          waInstanceIdSealed: __nullable__(
            t.String({
              description: `[CRM-P4] بيانات اعتماد Green API — **مشفَّرة عند الراحة** بصيغة \`v1.<nonce>.<ct>\`
عبر \`@/lib/crypto/secret-box\` (§17.2 صفّ ١٩). لا تُعاد إلى العميل أبدًا، ولو مشفَّرة.`,
            }),
          ),
          waApiTokenSealed: __nullable__(t.String()),
          waConnectionState: __nullable__(
            t.String({
              description: `آخر حالة اتصالٍ معروفة من \`stateInstanceChanged\` — تُعرض ولا يُبنى عليها منطق إرسال`,
            }),
          ),
          waCheckedAt: __nullable__(t.Date()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
  },
  {
    additionalProperties: false,
    description: `[CRM-P5] §10.1 — سياسة استجابةٍ أولى واحدة، مسطَّحة عمدًا.
النظام المرجعيّ يحمل مصفوفة أولويّات (هدفٌ لكل أولوية × كل مصدر). v1 يسطّحها إلى
**هدفٍ واحد للسياسة** + تجاوزات اختيارية لكل مصدر في صفوفٍ ابنة، لأنّ المصفوفة
الكاملة بلا محرّك دوراتٍ متجدّدة (§10.5، مؤجَّل [P2]) تكون تعقيدًا بلا ثمرة.
**الاختيار: أوّل سياسةٍ فعّالة مطابِقة تنطبق عند الإنشاء** (قاعدة النظام المرجعيّ).
«مطابِقة» = بلا صفوف مصادر (تنطبق على الكلّ) أو أنّ مصدر السجلّ ضمن صفوفها.
و\`order\` يفضّ التعادل صراحةً: بلا ترتيبٍ ثابت تصير «الأولى» رهنَ ترتيب الاستعلام.`,
  },
);

export const CrmSlaPolicyPlainInputCreate = t.Object(
  {
    name: t.String(),
    appliesTo: t.Optional(
      t.Union([t.Literal("LEAD"), t.Literal("DEAL"), t.Literal("BOTH")], {
        additionalProperties: false,
        description: `[CRM-P5] §10.1 — على أيّ كيانٍ تنطبق السياسة.`,
      }),
    ),
    firstResponseMinutes: t.Integer({
      description: `الهدف بالدقائق، محسوبًا على **وقت العمل** لا الساعة الجدارية (§17.2 صفّ ٢٢).`,
    }),
    order: t.Optional(t.Integer()),
    isActive: t.Optional(t.Boolean()),
    isDeleted: t.Optional(t.Boolean()),
    deletedAt: t.Optional(__nullable__(t.Date())),
  },
  {
    additionalProperties: false,
    description: `[CRM-P5] §10.1 — سياسة استجابةٍ أولى واحدة، مسطَّحة عمدًا.
النظام المرجعيّ يحمل مصفوفة أولويّات (هدفٌ لكل أولوية × كل مصدر). v1 يسطّحها إلى
**هدفٍ واحد للسياسة** + تجاوزات اختيارية لكل مصدر في صفوفٍ ابنة، لأنّ المصفوفة
الكاملة بلا محرّك دوراتٍ متجدّدة (§10.5، مؤجَّل [P2]) تكون تعقيدًا بلا ثمرة.
**الاختيار: أوّل سياسةٍ فعّالة مطابِقة تنطبق عند الإنشاء** (قاعدة النظام المرجعيّ).
«مطابِقة» = بلا صفوف مصادر (تنطبق على الكلّ) أو أنّ مصدر السجلّ ضمن صفوفها.
و\`order\` يفضّ التعادل صراحةً: بلا ترتيبٍ ثابت تصير «الأولى» رهنَ ترتيب الاستعلام.`,
  },
);

export const CrmSlaPolicyPlainInputUpdate = t.Object(
  {
    name: t.Optional(t.String()),
    appliesTo: t.Optional(
      t.Union([t.Literal("LEAD"), t.Literal("DEAL"), t.Literal("BOTH")], {
        additionalProperties: false,
        description: `[CRM-P5] §10.1 — على أيّ كيانٍ تنطبق السياسة.`,
      }),
    ),
    firstResponseMinutes: t.Optional(
      t.Integer({
        description: `الهدف بالدقائق، محسوبًا على **وقت العمل** لا الساعة الجدارية (§17.2 صفّ ٢٢).`,
      }),
    ),
    order: t.Optional(t.Integer()),
    isActive: t.Optional(t.Boolean()),
    isDeleted: t.Optional(t.Boolean()),
    deletedAt: t.Optional(__nullable__(t.Date())),
  },
  {
    additionalProperties: false,
    description: `[CRM-P5] §10.1 — سياسة استجابةٍ أولى واحدة، مسطَّحة عمدًا.
النظام المرجعيّ يحمل مصفوفة أولويّات (هدفٌ لكل أولوية × كل مصدر). v1 يسطّحها إلى
**هدفٍ واحد للسياسة** + تجاوزات اختيارية لكل مصدر في صفوفٍ ابنة، لأنّ المصفوفة
الكاملة بلا محرّك دوراتٍ متجدّدة (§10.5، مؤجَّل [P2]) تكون تعقيدًا بلا ثمرة.
**الاختيار: أوّل سياسةٍ فعّالة مطابِقة تنطبق عند الإنشاء** (قاعدة النظام المرجعيّ).
«مطابِقة» = بلا صفوف مصادر (تنطبق على الكلّ) أو أنّ مصدر السجلّ ضمن صفوفها.
و\`order\` يفضّ التعادل صراحةً: بلا ترتيبٍ ثابت تصير «الأولى» رهنَ ترتيب الاستعلام.`,
  },
);

export const CrmSlaPolicyRelationsInputCreate = t.Object(
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
    sources: t.Optional(
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
    defaultForClinics: t.Optional(
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
    description: `[CRM-P5] §10.1 — سياسة استجابةٍ أولى واحدة، مسطَّحة عمدًا.
النظام المرجعيّ يحمل مصفوفة أولويّات (هدفٌ لكل أولوية × كل مصدر). v1 يسطّحها إلى
**هدفٍ واحد للسياسة** + تجاوزات اختيارية لكل مصدر في صفوفٍ ابنة، لأنّ المصفوفة
الكاملة بلا محرّك دوراتٍ متجدّدة (§10.5، مؤجَّل [P2]) تكون تعقيدًا بلا ثمرة.
**الاختيار: أوّل سياسةٍ فعّالة مطابِقة تنطبق عند الإنشاء** (قاعدة النظام المرجعيّ).
«مطابِقة» = بلا صفوف مصادر (تنطبق على الكلّ) أو أنّ مصدر السجلّ ضمن صفوفها.
و\`order\` يفضّ التعادل صراحةً: بلا ترتيبٍ ثابت تصير «الأولى» رهنَ ترتيب الاستعلام.`,
  },
);

export const CrmSlaPolicyRelationsInputUpdate = t.Partial(
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
      sources: t.Partial(
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
      defaultForClinics: t.Partial(
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
      description: `[CRM-P5] §10.1 — سياسة استجابةٍ أولى واحدة، مسطَّحة عمدًا.
النظام المرجعيّ يحمل مصفوفة أولويّات (هدفٌ لكل أولوية × كل مصدر). v1 يسطّحها إلى
**هدفٍ واحد للسياسة** + تجاوزات اختيارية لكل مصدر في صفوفٍ ابنة، لأنّ المصفوفة
الكاملة بلا محرّك دوراتٍ متجدّدة (§10.5، مؤجَّل [P2]) تكون تعقيدًا بلا ثمرة.
**الاختيار: أوّل سياسةٍ فعّالة مطابِقة تنطبق عند الإنشاء** (قاعدة النظام المرجعيّ).
«مطابِقة» = بلا صفوف مصادر (تنطبق على الكلّ) أو أنّ مصدر السجلّ ضمن صفوفها.
و\`order\` يفضّ التعادل صراحةً: بلا ترتيبٍ ثابت تصير «الأولى» رهنَ ترتيب الاستعلام.`,
    },
  ),
);

export const CrmSlaPolicyWhere = t.Partial(
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
          appliesTo: t.Union(
            [t.Literal("LEAD"), t.Literal("DEAL"), t.Literal("BOTH")],
            {
              additionalProperties: false,
              description: `[CRM-P5] §10.1 — على أيّ كيانٍ تنطبق السياسة.`,
            },
          ),
          firstResponseMinutes: t.Integer({
            description: `الهدف بالدقائق، محسوبًا على **وقت العمل** لا الساعة الجدارية (§17.2 صفّ ٢٢).`,
          }),
          order: t.Integer(),
          isActive: t.Boolean(),
          isDeleted: t.Boolean(),
          deletedAt: t.Date(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `[CRM-P5] §10.1 — سياسة استجابةٍ أولى واحدة، مسطَّحة عمدًا.
النظام المرجعيّ يحمل مصفوفة أولويّات (هدفٌ لكل أولوية × كل مصدر). v1 يسطّحها إلى
**هدفٍ واحد للسياسة** + تجاوزات اختيارية لكل مصدر في صفوفٍ ابنة، لأنّ المصفوفة
الكاملة بلا محرّك دوراتٍ متجدّدة (§10.5، مؤجَّل [P2]) تكون تعقيدًا بلا ثمرة.
**الاختيار: أوّل سياسةٍ فعّالة مطابِقة تنطبق عند الإنشاء** (قاعدة النظام المرجعيّ).
«مطابِقة» = بلا صفوف مصادر (تنطبق على الكلّ) أو أنّ مصدر السجلّ ضمن صفوفها.
و\`order\` يفضّ التعادل صراحةً: بلا ترتيبٍ ثابت تصير «الأولى» رهنَ ترتيب الاستعلام.`,
        },
      ),
    { $id: "CrmSlaPolicy" },
  ),
);

export const CrmSlaPolicyWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.String() },
            {
              additionalProperties: false,
              description: `[CRM-P5] §10.1 — سياسة استجابةٍ أولى واحدة، مسطَّحة عمدًا.
النظام المرجعيّ يحمل مصفوفة أولويّات (هدفٌ لكل أولوية × كل مصدر). v1 يسطّحها إلى
**هدفٍ واحد للسياسة** + تجاوزات اختيارية لكل مصدر في صفوفٍ ابنة، لأنّ المصفوفة
الكاملة بلا محرّك دوراتٍ متجدّدة (§10.5، مؤجَّل [P2]) تكون تعقيدًا بلا ثمرة.
**الاختيار: أوّل سياسةٍ فعّالة مطابِقة تنطبق عند الإنشاء** (قاعدة النظام المرجعيّ).
«مطابِقة» = بلا صفوف مصادر (تنطبق على الكلّ) أو أنّ مصدر السجلّ ضمن صفوفها.
و\`order\` يفضّ التعادل صراحةً: بلا ترتيبٍ ثابت تصير «الأولى» رهنَ ترتيب الاستعلام.`,
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
              appliesTo: t.Union(
                [t.Literal("LEAD"), t.Literal("DEAL"), t.Literal("BOTH")],
                {
                  additionalProperties: false,
                  description: `[CRM-P5] §10.1 — على أيّ كيانٍ تنطبق السياسة.`,
                },
              ),
              firstResponseMinutes: t.Integer({
                description: `الهدف بالدقائق، محسوبًا على **وقت العمل** لا الساعة الجدارية (§17.2 صفّ ٢٢).`,
              }),
              order: t.Integer(),
              isActive: t.Boolean(),
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
  { $id: "CrmSlaPolicy" },
);

export const CrmSlaPolicySelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      clinicId: t.Boolean(),
      name: t.Boolean(),
      appliesTo: t.Boolean(),
      firstResponseMinutes: t.Boolean(),
      order: t.Boolean(),
      isActive: t.Boolean(),
      isDeleted: t.Boolean(),
      deletedAt: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinic: t.Boolean(),
      sources: t.Boolean(),
      defaultForClinics: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `[CRM-P5] §10.1 — سياسة استجابةٍ أولى واحدة، مسطَّحة عمدًا.
النظام المرجعيّ يحمل مصفوفة أولويّات (هدفٌ لكل أولوية × كل مصدر). v1 يسطّحها إلى
**هدفٍ واحد للسياسة** + تجاوزات اختيارية لكل مصدر في صفوفٍ ابنة، لأنّ المصفوفة
الكاملة بلا محرّك دوراتٍ متجدّدة (§10.5، مؤجَّل [P2]) تكون تعقيدًا بلا ثمرة.
**الاختيار: أوّل سياسةٍ فعّالة مطابِقة تنطبق عند الإنشاء** (قاعدة النظام المرجعيّ).
«مطابِقة» = بلا صفوف مصادر (تنطبق على الكلّ) أو أنّ مصدر السجلّ ضمن صفوفها.
و\`order\` يفضّ التعادل صراحةً: بلا ترتيبٍ ثابت تصير «الأولى» رهنَ ترتيب الاستعلام.`,
    },
  ),
);

export const CrmSlaPolicyInclude = t.Partial(
  t.Object(
    {
      appliesTo: t.Boolean(),
      clinic: t.Boolean(),
      sources: t.Boolean(),
      defaultForClinics: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `[CRM-P5] §10.1 — سياسة استجابةٍ أولى واحدة، مسطَّحة عمدًا.
النظام المرجعيّ يحمل مصفوفة أولويّات (هدفٌ لكل أولوية × كل مصدر). v1 يسطّحها إلى
**هدفٍ واحد للسياسة** + تجاوزات اختيارية لكل مصدر في صفوفٍ ابنة، لأنّ المصفوفة
الكاملة بلا محرّك دوراتٍ متجدّدة (§10.5، مؤجَّل [P2]) تكون تعقيدًا بلا ثمرة.
**الاختيار: أوّل سياسةٍ فعّالة مطابِقة تنطبق عند الإنشاء** (قاعدة النظام المرجعيّ).
«مطابِقة» = بلا صفوف مصادر (تنطبق على الكلّ) أو أنّ مصدر السجلّ ضمن صفوفها.
و\`order\` يفضّ التعادل صراحةً: بلا ترتيبٍ ثابت تصير «الأولى» رهنَ ترتيب الاستعلام.`,
    },
  ),
);

export const CrmSlaPolicyOrderBy = t.Partial(
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
      firstResponseMinutes: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      order: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      isActive: t.Union([t.Literal("asc"), t.Literal("desc")], {
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
      description: `[CRM-P5] §10.1 — سياسة استجابةٍ أولى واحدة، مسطَّحة عمدًا.
النظام المرجعيّ يحمل مصفوفة أولويّات (هدفٌ لكل أولوية × كل مصدر). v1 يسطّحها إلى
**هدفٍ واحد للسياسة** + تجاوزات اختيارية لكل مصدر في صفوفٍ ابنة، لأنّ المصفوفة
الكاملة بلا محرّك دوراتٍ متجدّدة (§10.5، مؤجَّل [P2]) تكون تعقيدًا بلا ثمرة.
**الاختيار: أوّل سياسةٍ فعّالة مطابِقة تنطبق عند الإنشاء** (قاعدة النظام المرجعيّ).
«مطابِقة» = بلا صفوف مصادر (تنطبق على الكلّ) أو أنّ مصدر السجلّ ضمن صفوفها.
و\`order\` يفضّ التعادل صراحةً: بلا ترتيبٍ ثابت تصير «الأولى» رهنَ ترتيب الاستعلام.`,
    },
  ),
);

export const CrmSlaPolicy = t.Composite(
  [CrmSlaPolicyPlain, CrmSlaPolicyRelations],
  { additionalProperties: false },
);

export const CrmSlaPolicyInputCreate = t.Composite(
  [CrmSlaPolicyPlainInputCreate, CrmSlaPolicyRelationsInputCreate],
  { additionalProperties: false },
);

export const CrmSlaPolicyInputUpdate = t.Composite(
  [CrmSlaPolicyPlainInputUpdate, CrmSlaPolicyRelationsInputUpdate],
  { additionalProperties: false },
);
