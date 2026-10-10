import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const ClinicLoyaltySettingsPlain = t.Object(
  {
    id: t.String(),
    clinicId: t.String(),
    enableLoyaltyModule: t.Boolean({
      description: `§0.3 — وعد الوحدة المركزي. مطفأ ⇒ لا أثر ملحوظ في أيّ مكان.`,
    }),
    loyaltyTierWindowMonths: t.Integer({
      description: `§4 — النافذة المتدحرجة التي يُحسب عليها الإنفاق المؤهِّل للمستوى (BR-L4.1)`,
    }),
    loyaltyExpiryNoticeDays: t.Integer({
      description: `§13 — «تنتهي قريبًا»: كم يومًا قبل الانتهاء تُعدّ النقاط وشيكة (§10.3، §11.4)`,
    }),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  },
  {
    additionalProperties: false,
    description: `[LY-P0] §13 — إعدادات الوحدة، جدولٌ **مكتوب الأعمدة** خاص بالنطاق.
ولماذا ليست في سجلّ \`AccountsSetting\`: ذلك السجلّ محكومٌ بصلاحية
\`accounting.accounts_settings.write\`، فوضع مفتاح وحدةٍ أماميّة فيه كان سيوجب على مدير
الاستقبال صلاحيةً محاسبية ليفعّل وحدةً ليست محاسبية. هذا هو حلّ CRM-P0 نفسه، وهو ما
تفعله كل وحدة غير محاسبية في المستودع (ثمانية جداول \`Clinic*Settings\`).`,
  },
);

export const ClinicLoyaltySettingsRelations = t.Object(
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
  },
  {
    additionalProperties: false,
    description: `[LY-P0] §13 — إعدادات الوحدة، جدولٌ **مكتوب الأعمدة** خاص بالنطاق.
ولماذا ليست في سجلّ \`AccountsSetting\`: ذلك السجلّ محكومٌ بصلاحية
\`accounting.accounts_settings.write\`، فوضع مفتاح وحدةٍ أماميّة فيه كان سيوجب على مدير
الاستقبال صلاحيةً محاسبية ليفعّل وحدةً ليست محاسبية. هذا هو حلّ CRM-P0 نفسه، وهو ما
تفعله كل وحدة غير محاسبية في المستودع (ثمانية جداول \`Clinic*Settings\`).`,
  },
);

export const ClinicLoyaltySettingsPlainInputCreate = t.Object(
  {
    enableLoyaltyModule: t.Optional(
      t.Boolean({
        description: `§0.3 — وعد الوحدة المركزي. مطفأ ⇒ لا أثر ملحوظ في أيّ مكان.`,
      }),
    ),
    loyaltyTierWindowMonths: t.Optional(
      t.Integer({
        description: `§4 — النافذة المتدحرجة التي يُحسب عليها الإنفاق المؤهِّل للمستوى (BR-L4.1)`,
      }),
    ),
    loyaltyExpiryNoticeDays: t.Optional(
      t.Integer({
        description: `§13 — «تنتهي قريبًا»: كم يومًا قبل الانتهاء تُعدّ النقاط وشيكة (§10.3، §11.4)`,
      }),
    ),
  },
  {
    additionalProperties: false,
    description: `[LY-P0] §13 — إعدادات الوحدة، جدولٌ **مكتوب الأعمدة** خاص بالنطاق.
ولماذا ليست في سجلّ \`AccountsSetting\`: ذلك السجلّ محكومٌ بصلاحية
\`accounting.accounts_settings.write\`، فوضع مفتاح وحدةٍ أماميّة فيه كان سيوجب على مدير
الاستقبال صلاحيةً محاسبية ليفعّل وحدةً ليست محاسبية. هذا هو حلّ CRM-P0 نفسه، وهو ما
تفعله كل وحدة غير محاسبية في المستودع (ثمانية جداول \`Clinic*Settings\`).`,
  },
);

export const ClinicLoyaltySettingsPlainInputUpdate = t.Object(
  {
    enableLoyaltyModule: t.Optional(
      t.Boolean({
        description: `§0.3 — وعد الوحدة المركزي. مطفأ ⇒ لا أثر ملحوظ في أيّ مكان.`,
      }),
    ),
    loyaltyTierWindowMonths: t.Optional(
      t.Integer({
        description: `§4 — النافذة المتدحرجة التي يُحسب عليها الإنفاق المؤهِّل للمستوى (BR-L4.1)`,
      }),
    ),
    loyaltyExpiryNoticeDays: t.Optional(
      t.Integer({
        description: `§13 — «تنتهي قريبًا»: كم يومًا قبل الانتهاء تُعدّ النقاط وشيكة (§10.3، §11.4)`,
      }),
    ),
  },
  {
    additionalProperties: false,
    description: `[LY-P0] §13 — إعدادات الوحدة، جدولٌ **مكتوب الأعمدة** خاص بالنطاق.
ولماذا ليست في سجلّ \`AccountsSetting\`: ذلك السجلّ محكومٌ بصلاحية
\`accounting.accounts_settings.write\`، فوضع مفتاح وحدةٍ أماميّة فيه كان سيوجب على مدير
الاستقبال صلاحيةً محاسبية ليفعّل وحدةً ليست محاسبية. هذا هو حلّ CRM-P0 نفسه، وهو ما
تفعله كل وحدة غير محاسبية في المستودع (ثمانية جداول \`Clinic*Settings\`).`,
  },
);

export const ClinicLoyaltySettingsRelationsInputCreate = t.Object(
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
  },
  {
    additionalProperties: false,
    description: `[LY-P0] §13 — إعدادات الوحدة، جدولٌ **مكتوب الأعمدة** خاص بالنطاق.
ولماذا ليست في سجلّ \`AccountsSetting\`: ذلك السجلّ محكومٌ بصلاحية
\`accounting.accounts_settings.write\`، فوضع مفتاح وحدةٍ أماميّة فيه كان سيوجب على مدير
الاستقبال صلاحيةً محاسبية ليفعّل وحدةً ليست محاسبية. هذا هو حلّ CRM-P0 نفسه، وهو ما
تفعله كل وحدة غير محاسبية في المستودع (ثمانية جداول \`Clinic*Settings\`).`,
  },
);

export const ClinicLoyaltySettingsRelationsInputUpdate = t.Partial(
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
    },
    {
      additionalProperties: false,
      description: `[LY-P0] §13 — إعدادات الوحدة، جدولٌ **مكتوب الأعمدة** خاص بالنطاق.
ولماذا ليست في سجلّ \`AccountsSetting\`: ذلك السجلّ محكومٌ بصلاحية
\`accounting.accounts_settings.write\`، فوضع مفتاح وحدةٍ أماميّة فيه كان سيوجب على مدير
الاستقبال صلاحيةً محاسبية ليفعّل وحدةً ليست محاسبية. هذا هو حلّ CRM-P0 نفسه، وهو ما
تفعله كل وحدة غير محاسبية في المستودع (ثمانية جداول \`Clinic*Settings\`).`,
    },
  ),
);

export const ClinicLoyaltySettingsWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          clinicId: t.String(),
          enableLoyaltyModule: t.Boolean({
            description: `§0.3 — وعد الوحدة المركزي. مطفأ ⇒ لا أثر ملحوظ في أيّ مكان.`,
          }),
          loyaltyTierWindowMonths: t.Integer({
            description: `§4 — النافذة المتدحرجة التي يُحسب عليها الإنفاق المؤهِّل للمستوى (BR-L4.1)`,
          }),
          loyaltyExpiryNoticeDays: t.Integer({
            description: `§13 — «تنتهي قريبًا»: كم يومًا قبل الانتهاء تُعدّ النقاط وشيكة (§10.3، §11.4)`,
          }),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `[LY-P0] §13 — إعدادات الوحدة، جدولٌ **مكتوب الأعمدة** خاص بالنطاق.
ولماذا ليست في سجلّ \`AccountsSetting\`: ذلك السجلّ محكومٌ بصلاحية
\`accounting.accounts_settings.write\`، فوضع مفتاح وحدةٍ أماميّة فيه كان سيوجب على مدير
الاستقبال صلاحيةً محاسبية ليفعّل وحدةً ليست محاسبية. هذا هو حلّ CRM-P0 نفسه، وهو ما
تفعله كل وحدة غير محاسبية في المستودع (ثمانية جداول \`Clinic*Settings\`).`,
        },
      ),
    { $id: "ClinicLoyaltySettings" },
  ),
);

export const ClinicLoyaltySettingsWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.String(), clinicId: t.String() },
            {
              additionalProperties: false,
              description: `[LY-P0] §13 — إعدادات الوحدة، جدولٌ **مكتوب الأعمدة** خاص بالنطاق.
ولماذا ليست في سجلّ \`AccountsSetting\`: ذلك السجلّ محكومٌ بصلاحية
\`accounting.accounts_settings.write\`، فوضع مفتاح وحدةٍ أماميّة فيه كان سيوجب على مدير
الاستقبال صلاحيةً محاسبية ليفعّل وحدةً ليست محاسبية. هذا هو حلّ CRM-P0 نفسه، وهو ما
تفعله كل وحدة غير محاسبية في المستودع (ثمانية جداول \`Clinic*Settings\`).`,
            },
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
              enableLoyaltyModule: t.Boolean({
                description: `§0.3 — وعد الوحدة المركزي. مطفأ ⇒ لا أثر ملحوظ في أيّ مكان.`,
              }),
              loyaltyTierWindowMonths: t.Integer({
                description: `§4 — النافذة المتدحرجة التي يُحسب عليها الإنفاق المؤهِّل للمستوى (BR-L4.1)`,
              }),
              loyaltyExpiryNoticeDays: t.Integer({
                description: `§13 — «تنتهي قريبًا»: كم يومًا قبل الانتهاء تُعدّ النقاط وشيكة (§10.3، §11.4)`,
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
  { $id: "ClinicLoyaltySettings" },
);

export const ClinicLoyaltySettingsSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      clinicId: t.Boolean(),
      enableLoyaltyModule: t.Boolean(),
      loyaltyTierWindowMonths: t.Boolean(),
      loyaltyExpiryNoticeDays: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinic: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `[LY-P0] §13 — إعدادات الوحدة، جدولٌ **مكتوب الأعمدة** خاص بالنطاق.
ولماذا ليست في سجلّ \`AccountsSetting\`: ذلك السجلّ محكومٌ بصلاحية
\`accounting.accounts_settings.write\`، فوضع مفتاح وحدةٍ أماميّة فيه كان سيوجب على مدير
الاستقبال صلاحيةً محاسبية ليفعّل وحدةً ليست محاسبية. هذا هو حلّ CRM-P0 نفسه، وهو ما
تفعله كل وحدة غير محاسبية في المستودع (ثمانية جداول \`Clinic*Settings\`).`,
    },
  ),
);

export const ClinicLoyaltySettingsInclude = t.Partial(
  t.Object(
    { clinic: t.Boolean(), _count: t.Boolean() },
    {
      additionalProperties: false,
      description: `[LY-P0] §13 — إعدادات الوحدة، جدولٌ **مكتوب الأعمدة** خاص بالنطاق.
ولماذا ليست في سجلّ \`AccountsSetting\`: ذلك السجلّ محكومٌ بصلاحية
\`accounting.accounts_settings.write\`، فوضع مفتاح وحدةٍ أماميّة فيه كان سيوجب على مدير
الاستقبال صلاحيةً محاسبية ليفعّل وحدةً ليست محاسبية. هذا هو حلّ CRM-P0 نفسه، وهو ما
تفعله كل وحدة غير محاسبية في المستودع (ثمانية جداول \`Clinic*Settings\`).`,
    },
  ),
);

export const ClinicLoyaltySettingsOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clinicId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      enableLoyaltyModule: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      loyaltyTierWindowMonths: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      loyaltyExpiryNoticeDays: t.Union([t.Literal("asc"), t.Literal("desc")], {
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
      description: `[LY-P0] §13 — إعدادات الوحدة، جدولٌ **مكتوب الأعمدة** خاص بالنطاق.
ولماذا ليست في سجلّ \`AccountsSetting\`: ذلك السجلّ محكومٌ بصلاحية
\`accounting.accounts_settings.write\`، فوضع مفتاح وحدةٍ أماميّة فيه كان سيوجب على مدير
الاستقبال صلاحيةً محاسبية ليفعّل وحدةً ليست محاسبية. هذا هو حلّ CRM-P0 نفسه، وهو ما
تفعله كل وحدة غير محاسبية في المستودع (ثمانية جداول \`Clinic*Settings\`).`,
    },
  ),
);

export const ClinicLoyaltySettings = t.Composite(
  [ClinicLoyaltySettingsPlain, ClinicLoyaltySettingsRelations],
  { additionalProperties: false },
);

export const ClinicLoyaltySettingsInputCreate = t.Composite(
  [
    ClinicLoyaltySettingsPlainInputCreate,
    ClinicLoyaltySettingsRelationsInputCreate,
  ],
  { additionalProperties: false },
);

export const ClinicLoyaltySettingsInputUpdate = t.Composite(
  [
    ClinicLoyaltySettingsPlainInputUpdate,
    ClinicLoyaltySettingsRelationsInputUpdate,
  ],
  { additionalProperties: false },
);
