import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const ClinicCrmSettingsPlain = t.Object(
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
);

export const ClinicCrmSettingsRelations = t.Object(
  {
    crmDefaultSlaPolicy: __nullable__(
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
      ),
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
  },
  { additionalProperties: false },
);

export const ClinicCrmSettingsPlainInputCreate = t.Object(
  {
    enableCrmModule: t.Optional(t.Boolean()),
    crmWhatsappProvider: t.Optional(
      t.Union([t.Literal("MANUAL"), t.Literal("GREEN_API")], {
        additionalProperties: false,
      }),
    ),
    crmEmailFromName: t.Optional(__nullable__(t.String())),
    waInstanceIdSealed: t.Optional(
      __nullable__(
        t.String({
          description: `[CRM-P4] بيانات اعتماد Green API — **مشفَّرة عند الراحة** بصيغة \`v1.<nonce>.<ct>\`
عبر \`@/lib/crypto/secret-box\` (§17.2 صفّ ١٩). لا تُعاد إلى العميل أبدًا، ولو مشفَّرة.`,
        }),
      ),
    ),
    waApiTokenSealed: t.Optional(__nullable__(t.String())),
    waConnectionState: t.Optional(
      __nullable__(
        t.String({
          description: `آخر حالة اتصالٍ معروفة من \`stateInstanceChanged\` — تُعرض ولا يُبنى عليها منطق إرسال`,
        }),
      ),
    ),
    waCheckedAt: t.Optional(__nullable__(t.Date())),
  },
  { additionalProperties: false },
);

export const ClinicCrmSettingsPlainInputUpdate = t.Object(
  {
    enableCrmModule: t.Optional(t.Boolean()),
    crmWhatsappProvider: t.Optional(
      t.Union([t.Literal("MANUAL"), t.Literal("GREEN_API")], {
        additionalProperties: false,
      }),
    ),
    crmEmailFromName: t.Optional(__nullable__(t.String())),
    waInstanceIdSealed: t.Optional(
      __nullable__(
        t.String({
          description: `[CRM-P4] بيانات اعتماد Green API — **مشفَّرة عند الراحة** بصيغة \`v1.<nonce>.<ct>\`
عبر \`@/lib/crypto/secret-box\` (§17.2 صفّ ١٩). لا تُعاد إلى العميل أبدًا، ولو مشفَّرة.`,
        }),
      ),
    ),
    waApiTokenSealed: t.Optional(__nullable__(t.String())),
    waConnectionState: t.Optional(
      __nullable__(
        t.String({
          description: `آخر حالة اتصالٍ معروفة من \`stateInstanceChanged\` — تُعرض ولا يُبنى عليها منطق إرسال`,
        }),
      ),
    ),
    waCheckedAt: t.Optional(__nullable__(t.Date())),
  },
  { additionalProperties: false },
);

export const ClinicCrmSettingsRelationsInputCreate = t.Object(
  {
    crmDefaultSlaPolicy: t.Optional(
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
  },
  { additionalProperties: false },
);

export const ClinicCrmSettingsRelationsInputUpdate = t.Partial(
  t.Object(
    {
      crmDefaultSlaPolicy: t.Partial(
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
    },
    { additionalProperties: false },
  ),
);

export const ClinicCrmSettingsWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          clinicId: t.String(),
          enableCrmModule: t.Boolean(),
          crmDefaultSlaPolicyId: t.String({
            description: `§10 — [CRM-P5] صار علاقةً حقيقية كما وعد تعليق CRM-P0: الجدول موجود الآن.
\`SetNull\` لا \`Restrict\`: حذف سياسةٍ يترك العيادة بلا سياسةٍ افتراضية، وهي حالة
صحيحة (§10.1 «أوّل سياسةٍ فعّالة مطابِقة» تعمل بلا افتراضيّ أصلًا).`,
          }),
          crmWhatsappProvider: t.Union(
            [t.Literal("MANUAL"), t.Literal("GREEN_API")],
            { additionalProperties: false },
          ),
          crmEmailFromName: t.String(),
          waInstanceIdSealed: t.String({
            description: `[CRM-P4] بيانات اعتماد Green API — **مشفَّرة عند الراحة** بصيغة \`v1.<nonce>.<ct>\`
عبر \`@/lib/crypto/secret-box\` (§17.2 صفّ ١٩). لا تُعاد إلى العميل أبدًا، ولو مشفَّرة.`,
          }),
          waApiTokenSealed: t.String(),
          waConnectionState: t.String({
            description: `آخر حالة اتصالٍ معروفة من \`stateInstanceChanged\` — تُعرض ولا يُبنى عليها منطق إرسال`,
          }),
          waCheckedAt: t.Date(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "ClinicCrmSettings" },
  ),
);

export const ClinicCrmSettingsWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.String(), clinicId: t.String() },
            { additionalProperties: false },
          ),
          { additionalProperties: false },
        ),
        t.Union(
          [t.Object({ id: t.String() }), t.Object({ clinicId: t.String() })],
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
              enableCrmModule: t.Boolean(),
              crmDefaultSlaPolicyId: t.String({
                description: `§10 — [CRM-P5] صار علاقةً حقيقية كما وعد تعليق CRM-P0: الجدول موجود الآن.
\`SetNull\` لا \`Restrict\`: حذف سياسةٍ يترك العيادة بلا سياسةٍ افتراضية، وهي حالة
صحيحة (§10.1 «أوّل سياسةٍ فعّالة مطابِقة» تعمل بلا افتراضيّ أصلًا).`,
              }),
              crmWhatsappProvider: t.Union(
                [t.Literal("MANUAL"), t.Literal("GREEN_API")],
                { additionalProperties: false },
              ),
              crmEmailFromName: t.String(),
              waInstanceIdSealed: t.String({
                description: `[CRM-P4] بيانات اعتماد Green API — **مشفَّرة عند الراحة** بصيغة \`v1.<nonce>.<ct>\`
عبر \`@/lib/crypto/secret-box\` (§17.2 صفّ ١٩). لا تُعاد إلى العميل أبدًا، ولو مشفَّرة.`,
              }),
              waApiTokenSealed: t.String(),
              waConnectionState: t.String({
                description: `آخر حالة اتصالٍ معروفة من \`stateInstanceChanged\` — تُعرض ولا يُبنى عليها منطق إرسال`,
              }),
              waCheckedAt: t.Date(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "ClinicCrmSettings" },
);

export const ClinicCrmSettingsSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      clinicId: t.Boolean(),
      enableCrmModule: t.Boolean(),
      crmDefaultSlaPolicyId: t.Boolean(),
      crmDefaultSlaPolicy: t.Boolean(),
      crmWhatsappProvider: t.Boolean(),
      crmEmailFromName: t.Boolean(),
      waInstanceIdSealed: t.Boolean(),
      waApiTokenSealed: t.Boolean(),
      waConnectionState: t.Boolean(),
      waCheckedAt: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinic: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const ClinicCrmSettingsInclude = t.Partial(
  t.Object(
    {
      crmDefaultSlaPolicy: t.Boolean(),
      crmWhatsappProvider: t.Boolean(),
      clinic: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const ClinicCrmSettingsOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clinicId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      enableCrmModule: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      crmDefaultSlaPolicyId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      crmEmailFromName: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      waInstanceIdSealed: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      waApiTokenSealed: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      waConnectionState: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      waCheckedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const ClinicCrmSettings = t.Composite(
  [ClinicCrmSettingsPlain, ClinicCrmSettingsRelations],
  { additionalProperties: false },
);

export const ClinicCrmSettingsInputCreate = t.Composite(
  [ClinicCrmSettingsPlainInputCreate, ClinicCrmSettingsRelationsInputCreate],
  { additionalProperties: false },
);

export const ClinicCrmSettingsInputUpdate = t.Composite(
  [ClinicCrmSettingsPlainInputUpdate, ClinicCrmSettingsRelationsInputUpdate],
  { additionalProperties: false },
);
