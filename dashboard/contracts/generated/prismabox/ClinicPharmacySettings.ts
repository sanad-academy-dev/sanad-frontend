import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const ClinicPharmacySettingsPlain = t.Object(
  {
    id: t.String(),
    clinicId: t.String(),
    enabled: t.Boolean({
      description: `راية الوحدة (BRD §0.3). مطفأة افتراضيًا: الوعد المركزي للوحدة أن إطفاءها
يعني «لا تغيير ملحوظ في أي مكان»، وهو ما تُثبته اختبارات الخمول في كل مرحلة.`,
    }),
    requireWitnessOnWaste: t.Boolean({
      description: `شاهد إلزامي على إتلاف مادة مراقبة (BRD §8.3). التوقيع المنفرد على الإتلاف
هو طريق التسريب الكلاسيكي، وإغلاقه هو سبب وجود السجل أصلًا.`,
    }),
    defaultLabelCopies: t.Integer({
      description: `عدد نسخ الملصق المطبوعة لكل صنف مصروف (BRD §9).`,
    }),
    fefoSuggestion: t.Boolean({
      description: `اقتراح أقرب صلاحية أولًا (FEFO) عند اختيار الدفعة. اقتراح لا إلزام
(BR-P7.3.3): قد يكون للطبيب سبب، والسجل يُظهر الدفعة التي خرجت فعلًا.`,
    }),
    blockExpiredDispense: t.Boolean({
      description: `منع صرف دفعة منتهية الصلاحية (BR-P7.3.4). موجود كعمود ليشرح نفسه في الشاشة،
لا ليُطفأ: الواجهة تعرضه معطّلًا مع سبب. صرف دواء منتهٍ ليس تفضيلًا للعيادة.`,
    }),
    controlledRegisterEnabled: t.Boolean({
      description: `تفعيل سجل المواد المراقبة (BRD §8). يبقى مطفأً حتى يُحسم O-PH-1 — مصدر
جدول الجدولة الرقابي — لأن \`legalStatus\` في الطبقة الأولى لا يصلح مصدرًا:
صفّان اثنان من ١٣٦٥ في سجل الغذاء والدواء (BRD §2.3).`,
    }),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  },
  {
    additionalProperties: false,
    description: `[PH0.2] إعدادات الصيدلية لكل عيادة — نمط \`ClinicPayrollSettings\` و
\`ClinicSchedulingSettings\` (نموذج مُصنَّف لكل مجال، لا حقيبة مفاتيح عامّة:
لا يوجد سجلّ مفاتيح خارج \`AccountsSetting\` المحاسبي، فلا يُخترع واحد).`,
  },
);

export const ClinicPharmacySettingsRelations = t.Object(
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
    description: `[PH0.2] إعدادات الصيدلية لكل عيادة — نمط \`ClinicPayrollSettings\` و
\`ClinicSchedulingSettings\` (نموذج مُصنَّف لكل مجال، لا حقيبة مفاتيح عامّة:
لا يوجد سجلّ مفاتيح خارج \`AccountsSetting\` المحاسبي، فلا يُخترع واحد).`,
  },
);

export const ClinicPharmacySettingsPlainInputCreate = t.Object(
  {
    enabled: t.Optional(
      t.Boolean({
        description: `راية الوحدة (BRD §0.3). مطفأة افتراضيًا: الوعد المركزي للوحدة أن إطفاءها
يعني «لا تغيير ملحوظ في أي مكان»، وهو ما تُثبته اختبارات الخمول في كل مرحلة.`,
      }),
    ),
    requireWitnessOnWaste: t.Optional(
      t.Boolean({
        description: `شاهد إلزامي على إتلاف مادة مراقبة (BRD §8.3). التوقيع المنفرد على الإتلاف
هو طريق التسريب الكلاسيكي، وإغلاقه هو سبب وجود السجل أصلًا.`,
      }),
    ),
    defaultLabelCopies: t.Optional(
      t.Integer({
        description: `عدد نسخ الملصق المطبوعة لكل صنف مصروف (BRD §9).`,
      }),
    ),
    fefoSuggestion: t.Optional(
      t.Boolean({
        description: `اقتراح أقرب صلاحية أولًا (FEFO) عند اختيار الدفعة. اقتراح لا إلزام
(BR-P7.3.3): قد يكون للطبيب سبب، والسجل يُظهر الدفعة التي خرجت فعلًا.`,
      }),
    ),
    blockExpiredDispense: t.Optional(
      t.Boolean({
        description: `منع صرف دفعة منتهية الصلاحية (BR-P7.3.4). موجود كعمود ليشرح نفسه في الشاشة،
لا ليُطفأ: الواجهة تعرضه معطّلًا مع سبب. صرف دواء منتهٍ ليس تفضيلًا للعيادة.`,
      }),
    ),
    controlledRegisterEnabled: t.Optional(
      t.Boolean({
        description: `تفعيل سجل المواد المراقبة (BRD §8). يبقى مطفأً حتى يُحسم O-PH-1 — مصدر
جدول الجدولة الرقابي — لأن \`legalStatus\` في الطبقة الأولى لا يصلح مصدرًا:
صفّان اثنان من ١٣٦٥ في سجل الغذاء والدواء (BRD §2.3).`,
      }),
    ),
  },
  {
    additionalProperties: false,
    description: `[PH0.2] إعدادات الصيدلية لكل عيادة — نمط \`ClinicPayrollSettings\` و
\`ClinicSchedulingSettings\` (نموذج مُصنَّف لكل مجال، لا حقيبة مفاتيح عامّة:
لا يوجد سجلّ مفاتيح خارج \`AccountsSetting\` المحاسبي، فلا يُخترع واحد).`,
  },
);

export const ClinicPharmacySettingsPlainInputUpdate = t.Object(
  {
    enabled: t.Optional(
      t.Boolean({
        description: `راية الوحدة (BRD §0.3). مطفأة افتراضيًا: الوعد المركزي للوحدة أن إطفاءها
يعني «لا تغيير ملحوظ في أي مكان»، وهو ما تُثبته اختبارات الخمول في كل مرحلة.`,
      }),
    ),
    requireWitnessOnWaste: t.Optional(
      t.Boolean({
        description: `شاهد إلزامي على إتلاف مادة مراقبة (BRD §8.3). التوقيع المنفرد على الإتلاف
هو طريق التسريب الكلاسيكي، وإغلاقه هو سبب وجود السجل أصلًا.`,
      }),
    ),
    defaultLabelCopies: t.Optional(
      t.Integer({
        description: `عدد نسخ الملصق المطبوعة لكل صنف مصروف (BRD §9).`,
      }),
    ),
    fefoSuggestion: t.Optional(
      t.Boolean({
        description: `اقتراح أقرب صلاحية أولًا (FEFO) عند اختيار الدفعة. اقتراح لا إلزام
(BR-P7.3.3): قد يكون للطبيب سبب، والسجل يُظهر الدفعة التي خرجت فعلًا.`,
      }),
    ),
    blockExpiredDispense: t.Optional(
      t.Boolean({
        description: `منع صرف دفعة منتهية الصلاحية (BR-P7.3.4). موجود كعمود ليشرح نفسه في الشاشة،
لا ليُطفأ: الواجهة تعرضه معطّلًا مع سبب. صرف دواء منتهٍ ليس تفضيلًا للعيادة.`,
      }),
    ),
    controlledRegisterEnabled: t.Optional(
      t.Boolean({
        description: `تفعيل سجل المواد المراقبة (BRD §8). يبقى مطفأً حتى يُحسم O-PH-1 — مصدر
جدول الجدولة الرقابي — لأن \`legalStatus\` في الطبقة الأولى لا يصلح مصدرًا:
صفّان اثنان من ١٣٦٥ في سجل الغذاء والدواء (BRD §2.3).`,
      }),
    ),
  },
  {
    additionalProperties: false,
    description: `[PH0.2] إعدادات الصيدلية لكل عيادة — نمط \`ClinicPayrollSettings\` و
\`ClinicSchedulingSettings\` (نموذج مُصنَّف لكل مجال، لا حقيبة مفاتيح عامّة:
لا يوجد سجلّ مفاتيح خارج \`AccountsSetting\` المحاسبي، فلا يُخترع واحد).`,
  },
);

export const ClinicPharmacySettingsRelationsInputCreate = t.Object(
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
    description: `[PH0.2] إعدادات الصيدلية لكل عيادة — نمط \`ClinicPayrollSettings\` و
\`ClinicSchedulingSettings\` (نموذج مُصنَّف لكل مجال، لا حقيبة مفاتيح عامّة:
لا يوجد سجلّ مفاتيح خارج \`AccountsSetting\` المحاسبي، فلا يُخترع واحد).`,
  },
);

export const ClinicPharmacySettingsRelationsInputUpdate = t.Partial(
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
      description: `[PH0.2] إعدادات الصيدلية لكل عيادة — نمط \`ClinicPayrollSettings\` و
\`ClinicSchedulingSettings\` (نموذج مُصنَّف لكل مجال، لا حقيبة مفاتيح عامّة:
لا يوجد سجلّ مفاتيح خارج \`AccountsSetting\` المحاسبي، فلا يُخترع واحد).`,
    },
  ),
);

export const ClinicPharmacySettingsWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          clinicId: t.String(),
          enabled: t.Boolean({
            description: `راية الوحدة (BRD §0.3). مطفأة افتراضيًا: الوعد المركزي للوحدة أن إطفاءها
يعني «لا تغيير ملحوظ في أي مكان»، وهو ما تُثبته اختبارات الخمول في كل مرحلة.`,
          }),
          requireWitnessOnWaste: t.Boolean({
            description: `شاهد إلزامي على إتلاف مادة مراقبة (BRD §8.3). التوقيع المنفرد على الإتلاف
هو طريق التسريب الكلاسيكي، وإغلاقه هو سبب وجود السجل أصلًا.`,
          }),
          defaultLabelCopies: t.Integer({
            description: `عدد نسخ الملصق المطبوعة لكل صنف مصروف (BRD §9).`,
          }),
          fefoSuggestion: t.Boolean({
            description: `اقتراح أقرب صلاحية أولًا (FEFO) عند اختيار الدفعة. اقتراح لا إلزام
(BR-P7.3.3): قد يكون للطبيب سبب، والسجل يُظهر الدفعة التي خرجت فعلًا.`,
          }),
          blockExpiredDispense: t.Boolean({
            description: `منع صرف دفعة منتهية الصلاحية (BR-P7.3.4). موجود كعمود ليشرح نفسه في الشاشة،
لا ليُطفأ: الواجهة تعرضه معطّلًا مع سبب. صرف دواء منتهٍ ليس تفضيلًا للعيادة.`,
          }),
          controlledRegisterEnabled: t.Boolean({
            description: `تفعيل سجل المواد المراقبة (BRD §8). يبقى مطفأً حتى يُحسم O-PH-1 — مصدر
جدول الجدولة الرقابي — لأن \`legalStatus\` في الطبقة الأولى لا يصلح مصدرًا:
صفّان اثنان من ١٣٦٥ في سجل الغذاء والدواء (BRD §2.3).`,
          }),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `[PH0.2] إعدادات الصيدلية لكل عيادة — نمط \`ClinicPayrollSettings\` و
\`ClinicSchedulingSettings\` (نموذج مُصنَّف لكل مجال، لا حقيبة مفاتيح عامّة:
لا يوجد سجلّ مفاتيح خارج \`AccountsSetting\` المحاسبي، فلا يُخترع واحد).`,
        },
      ),
    { $id: "ClinicPharmacySettings" },
  ),
);

export const ClinicPharmacySettingsWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.String(), clinicId: t.String() },
            {
              additionalProperties: false,
              description: `[PH0.2] إعدادات الصيدلية لكل عيادة — نمط \`ClinicPayrollSettings\` و
\`ClinicSchedulingSettings\` (نموذج مُصنَّف لكل مجال، لا حقيبة مفاتيح عامّة:
لا يوجد سجلّ مفاتيح خارج \`AccountsSetting\` المحاسبي، فلا يُخترع واحد).`,
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
              enabled: t.Boolean({
                description: `راية الوحدة (BRD §0.3). مطفأة افتراضيًا: الوعد المركزي للوحدة أن إطفاءها
يعني «لا تغيير ملحوظ في أي مكان»، وهو ما تُثبته اختبارات الخمول في كل مرحلة.`,
              }),
              requireWitnessOnWaste: t.Boolean({
                description: `شاهد إلزامي على إتلاف مادة مراقبة (BRD §8.3). التوقيع المنفرد على الإتلاف
هو طريق التسريب الكلاسيكي، وإغلاقه هو سبب وجود السجل أصلًا.`,
              }),
              defaultLabelCopies: t.Integer({
                description: `عدد نسخ الملصق المطبوعة لكل صنف مصروف (BRD §9).`,
              }),
              fefoSuggestion: t.Boolean({
                description: `اقتراح أقرب صلاحية أولًا (FEFO) عند اختيار الدفعة. اقتراح لا إلزام
(BR-P7.3.3): قد يكون للطبيب سبب، والسجل يُظهر الدفعة التي خرجت فعلًا.`,
              }),
              blockExpiredDispense: t.Boolean({
                description: `منع صرف دفعة منتهية الصلاحية (BR-P7.3.4). موجود كعمود ليشرح نفسه في الشاشة،
لا ليُطفأ: الواجهة تعرضه معطّلًا مع سبب. صرف دواء منتهٍ ليس تفضيلًا للعيادة.`,
              }),
              controlledRegisterEnabled: t.Boolean({
                description: `تفعيل سجل المواد المراقبة (BRD §8). يبقى مطفأً حتى يُحسم O-PH-1 — مصدر
جدول الجدولة الرقابي — لأن \`legalStatus\` في الطبقة الأولى لا يصلح مصدرًا:
صفّان اثنان من ١٣٦٥ في سجل الغذاء والدواء (BRD §2.3).`,
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
  { $id: "ClinicPharmacySettings" },
);

export const ClinicPharmacySettingsSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      clinicId: t.Boolean(),
      enabled: t.Boolean(),
      requireWitnessOnWaste: t.Boolean(),
      defaultLabelCopies: t.Boolean(),
      fefoSuggestion: t.Boolean(),
      blockExpiredDispense: t.Boolean(),
      controlledRegisterEnabled: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinic: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `[PH0.2] إعدادات الصيدلية لكل عيادة — نمط \`ClinicPayrollSettings\` و
\`ClinicSchedulingSettings\` (نموذج مُصنَّف لكل مجال، لا حقيبة مفاتيح عامّة:
لا يوجد سجلّ مفاتيح خارج \`AccountsSetting\` المحاسبي، فلا يُخترع واحد).`,
    },
  ),
);

export const ClinicPharmacySettingsInclude = t.Partial(
  t.Object(
    { clinic: t.Boolean(), _count: t.Boolean() },
    {
      additionalProperties: false,
      description: `[PH0.2] إعدادات الصيدلية لكل عيادة — نمط \`ClinicPayrollSettings\` و
\`ClinicSchedulingSettings\` (نموذج مُصنَّف لكل مجال، لا حقيبة مفاتيح عامّة:
لا يوجد سجلّ مفاتيح خارج \`AccountsSetting\` المحاسبي، فلا يُخترع واحد).`,
    },
  ),
);

export const ClinicPharmacySettingsOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clinicId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      enabled: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      requireWitnessOnWaste: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      defaultLabelCopies: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      fefoSuggestion: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      blockExpiredDispense: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      controlledRegisterEnabled: t.Union(
        [t.Literal("asc"), t.Literal("desc")],
        { additionalProperties: false },
      ),
      createdAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      updatedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    {
      additionalProperties: false,
      description: `[PH0.2] إعدادات الصيدلية لكل عيادة — نمط \`ClinicPayrollSettings\` و
\`ClinicSchedulingSettings\` (نموذج مُصنَّف لكل مجال، لا حقيبة مفاتيح عامّة:
لا يوجد سجلّ مفاتيح خارج \`AccountsSetting\` المحاسبي، فلا يُخترع واحد).`,
    },
  ),
);

export const ClinicPharmacySettings = t.Composite(
  [ClinicPharmacySettingsPlain, ClinicPharmacySettingsRelations],
  { additionalProperties: false },
);

export const ClinicPharmacySettingsInputCreate = t.Composite(
  [
    ClinicPharmacySettingsPlainInputCreate,
    ClinicPharmacySettingsRelationsInputCreate,
  ],
  { additionalProperties: false },
);

export const ClinicPharmacySettingsInputUpdate = t.Composite(
  [
    ClinicPharmacySettingsPlainInputUpdate,
    ClinicPharmacySettingsRelationsInputUpdate,
  ],
  { additionalProperties: false },
);
