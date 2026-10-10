import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const LoyaltyOwnerTierPlain = t.Object(
  {
    id: t.String(),
    clinicId: t.String(),
    ownerId: t.String(),
    programId: t.String(),
    tierId: __nullable__(
      t.String({
        description: `\`null\` = لا مستوى مؤهَّل بعد (BR-L4.4: برنامجٌ بلا مستويات شرعيّ)`,
      }),
    ),
    qualifyingSpend: t.Number({
      description: `إنفاق النافذة المتدحرجة وقت الحساب — يُفسّر «لماذا هذا المستوى» بلا إعادة اشتقاق`,
    }),
    windowMonths: t.Integer(),
    computedAt: t.Date(),
  },
  {
    additionalProperties: false,
    description: `[LY-P3] **لقطة** مستوى المالك — كاشٌ تكتبه المهمّة اليومية، لا مصدرَ حقيقة.
BR-L4.1 يقول إنّ المستوى **مشتقّ لا مُسنَد**، وهذا الجدول لا ينقض ذلك: كلّ قراءة
تخصّ مالكًا بعينه تشتقّ المستوى من الدفتر عند القراءة، ولا تسأل هذا الصفّ قطّ. وجوده
لغرضٍ واحد لا تستطيع القراءة تقديمه: التصفية والتجميع عبر آلاف المُلّاك في تقارير
§11 بلا استعلامٍ لكلّ مالك — نفس الدور الذي يؤدّيه \`slaStatus\` في CRM-P5 و\`nextDueAt\`
في التنويم.
ولا عمود «اجعل هذا المالك ذهبيًا»: لا \`tierId\` يُكتب بيد، ولا مسار يكتبه إلّا إعادةُ
الحساب. صفٌّ متقادم يعني كاشًا متأخّرًا، لا مالكًا في مستوى خاطئ.`,
  },
);

export const LoyaltyOwnerTierRelations = t.Object(
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
    program: t.Object(
      {
        id: t.String(),
        clinicId: t.String(),
        name: t.String(),
        earnRate: t.Number({
          description: `نقاط تُمنح لكل وحدة عملة من الإنفاق المؤهِّل — الكسور طبيعية هنا (§3)`,
        }),
        redemptionRate: t.Number({
          description: `قيمة النقطة الواحدة بالعملة عند الاستبدال (§3)`,
        }),
        minRedemptionPoints: t.Integer({
          description: `الحدّ الأدنى الذي يُرفض الاستبدال دونه (BR-L6.2)`,
        }),
        maxRedemptionPercent: t.Number({
          description: `سقف ما يجوز أن تدفعه النقاط من فاتورةٍ واحدة، نسبةً مئوية (BR-L6.2)`,
        }),
        pointsValidityMonths: t.Integer({
          description: `أشهر صلاحية النقاط المكتسبة (§7، BR-L7.1)`,
        }),
        membershipMultiplier: t.Number({
          description: `مضاعِفٌ يُطبَّق حين يحمل المالك عضويةً فعّالة وقت الدفع (BR-L5.4) — قراءةٌ لا اقتران`,
        }),
        roundingMode: t.Union([t.Literal("FLOOR")], {
          additionalProperties: false,
          description: `[LY-P0] §5.5/BR-L5.5 — معالجة كسور النقاط.
**عضوٌ واحد عمدًا.** §3 يُدرج \`roundingMode\` حقلًا، وBR-L5.5 يقرّر أنّه **ثابت لا
قابل للضبط** في v1 («عبءُ دعمٍ بلا قيمة تجارية»). عمودٌ باتحادٍ مفتوح كان سيَعِد
بخيارٍ يرفض المنتج تقديمه؛ واتحادٌ بعضوٍ واحد يجعل «ثابت في v1» **ضمانة قاعدة
بيانات** لا عُرفًا تتذكّره الشيفرة — وهي نفس حجّة CRM §17.2 صفّ ٥ حين قُسِم اتحادٌ
واحد إلى اثنين ليصير الشرط المُقوَّس ضمانةً. إضافة عضوٍ ثانٍ لاحقًا هجرةٌ واعية.`,
        }),
        active: t.Boolean(),
        isDeleted: t.Boolean(),
        deletedAt: __nullable__(t.Date()),
        createdAt: t.Date(),
        updatedAt: t.Date(),
      },
      {
        additionalProperties: false,
        description: `[LY-P0] §3 — برنامج النقاط.
BR-L3.1: **برنامجٌ فعّالٌ واحد لكل عيادة.** لا يُفرض بقيدٍ جزئي في المخطط لأنّ
Prisma لا يُعبّر عن \`WHERE\`ات الفهارس الجزئية؛ يُفرض في الخدمة برفضٍ عربيّ، ويُختبر.
BR-L3.2: البرنامج **مصدرُ لقطةٍ لا سلطةٌ حيّة** — كل صفّ كسبٍ واستبدالٍ سيخزّن
المعدّلات التي استعملها (LY-P1/P2)، فتعديل البرنامج لا يمسّ نقاطًا مُنحت ولا خصومًا
أُعطيت. نفس انضباط لقطات مزايا العضوية وتغطية التأمين.`,
      },
    ),
    tier: __nullable__(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          programId: t.String(),
          name: t.String(),
          minSpend: t.Number({
            description: `إنفاق النافذة المتدحرجة الذي يؤهّل لهذا المستوى (BR-L4.1)`,
          }),
          earnMultiplier: t.Number({
            description: `مضاعِف الكسب — سلطة المستوى الوحيدة (BR-L4.2)`,
          }),
          order: t.Integer(),
          colorToken: t.String(),
          active: t.Boolean(),
          isDeleted: t.Boolean(),
          deletedAt: __nullable__(t.Date()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `[LY-P0] §4 — مستوى داخل برنامج.
BR-L4.1: المستوى **مشتقّ لا مُسنَد** — لا عمود مستوى على المالك ولا زرّ «اجعله ذهبيًا».
وهذا الجدول يحمل تعريف المستوى وحده؛ الاشتقاق يصل في LY-P3.
BR-L4.2: سلطته الوحيدة \`earnMultiplier\` — لا خصومات ولا خدمات مجانية ولا أولوية.
\`order\` لا «position» (سابقة CRM §17.2 صفّ ١)، و\`colorToken\` **مفتاح رمز تصميم** من
قائمةٍ مغلقة لا قيمة hex (سابقة CRM §17.2 صفّ ٢: لا لون واجهة مخزَّن في قاعدة
البيانات في المستودع كلّه، وقاعدة CLAUDE.md الأولى تمنع الألوان الصريحة).`,
        },
      ),
    ),
  },
  {
    additionalProperties: false,
    description: `[LY-P3] **لقطة** مستوى المالك — كاشٌ تكتبه المهمّة اليومية، لا مصدرَ حقيقة.
BR-L4.1 يقول إنّ المستوى **مشتقّ لا مُسنَد**، وهذا الجدول لا ينقض ذلك: كلّ قراءة
تخصّ مالكًا بعينه تشتقّ المستوى من الدفتر عند القراءة، ولا تسأل هذا الصفّ قطّ. وجوده
لغرضٍ واحد لا تستطيع القراءة تقديمه: التصفية والتجميع عبر آلاف المُلّاك في تقارير
§11 بلا استعلامٍ لكلّ مالك — نفس الدور الذي يؤدّيه \`slaStatus\` في CRM-P5 و\`nextDueAt\`
في التنويم.
ولا عمود «اجعل هذا المالك ذهبيًا»: لا \`tierId\` يُكتب بيد، ولا مسار يكتبه إلّا إعادةُ
الحساب. صفٌّ متقادم يعني كاشًا متأخّرًا، لا مالكًا في مستوى خاطئ.`,
  },
);

export const LoyaltyOwnerTierPlainInputCreate = t.Object(
  {
    qualifyingSpend: t.Number({
      description: `إنفاق النافذة المتدحرجة وقت الحساب — يُفسّر «لماذا هذا المستوى» بلا إعادة اشتقاق`,
    }),
    windowMonths: t.Integer(),
    computedAt: t.Optional(t.Date()),
  },
  {
    additionalProperties: false,
    description: `[LY-P3] **لقطة** مستوى المالك — كاشٌ تكتبه المهمّة اليومية، لا مصدرَ حقيقة.
BR-L4.1 يقول إنّ المستوى **مشتقّ لا مُسنَد**، وهذا الجدول لا ينقض ذلك: كلّ قراءة
تخصّ مالكًا بعينه تشتقّ المستوى من الدفتر عند القراءة، ولا تسأل هذا الصفّ قطّ. وجوده
لغرضٍ واحد لا تستطيع القراءة تقديمه: التصفية والتجميع عبر آلاف المُلّاك في تقارير
§11 بلا استعلامٍ لكلّ مالك — نفس الدور الذي يؤدّيه \`slaStatus\` في CRM-P5 و\`nextDueAt\`
في التنويم.
ولا عمود «اجعل هذا المالك ذهبيًا»: لا \`tierId\` يُكتب بيد، ولا مسار يكتبه إلّا إعادةُ
الحساب. صفٌّ متقادم يعني كاشًا متأخّرًا، لا مالكًا في مستوى خاطئ.`,
  },
);

export const LoyaltyOwnerTierPlainInputUpdate = t.Object(
  {
    qualifyingSpend: t.Optional(
      t.Number({
        description: `إنفاق النافذة المتدحرجة وقت الحساب — يُفسّر «لماذا هذا المستوى» بلا إعادة اشتقاق`,
      }),
    ),
    windowMonths: t.Optional(t.Integer()),
    computedAt: t.Optional(t.Date()),
  },
  {
    additionalProperties: false,
    description: `[LY-P3] **لقطة** مستوى المالك — كاشٌ تكتبه المهمّة اليومية، لا مصدرَ حقيقة.
BR-L4.1 يقول إنّ المستوى **مشتقّ لا مُسنَد**، وهذا الجدول لا ينقض ذلك: كلّ قراءة
تخصّ مالكًا بعينه تشتقّ المستوى من الدفتر عند القراءة، ولا تسأل هذا الصفّ قطّ. وجوده
لغرضٍ واحد لا تستطيع القراءة تقديمه: التصفية والتجميع عبر آلاف المُلّاك في تقارير
§11 بلا استعلامٍ لكلّ مالك — نفس الدور الذي يؤدّيه \`slaStatus\` في CRM-P5 و\`nextDueAt\`
في التنويم.
ولا عمود «اجعل هذا المالك ذهبيًا»: لا \`tierId\` يُكتب بيد، ولا مسار يكتبه إلّا إعادةُ
الحساب. صفٌّ متقادم يعني كاشًا متأخّرًا، لا مالكًا في مستوى خاطئ.`,
  },
);

export const LoyaltyOwnerTierRelationsInputCreate = t.Object(
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
    program: t.Object(
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
    tier: t.Optional(
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
    description: `[LY-P3] **لقطة** مستوى المالك — كاشٌ تكتبه المهمّة اليومية، لا مصدرَ حقيقة.
BR-L4.1 يقول إنّ المستوى **مشتقّ لا مُسنَد**، وهذا الجدول لا ينقض ذلك: كلّ قراءة
تخصّ مالكًا بعينه تشتقّ المستوى من الدفتر عند القراءة، ولا تسأل هذا الصفّ قطّ. وجوده
لغرضٍ واحد لا تستطيع القراءة تقديمه: التصفية والتجميع عبر آلاف المُلّاك في تقارير
§11 بلا استعلامٍ لكلّ مالك — نفس الدور الذي يؤدّيه \`slaStatus\` في CRM-P5 و\`nextDueAt\`
في التنويم.
ولا عمود «اجعل هذا المالك ذهبيًا»: لا \`tierId\` يُكتب بيد، ولا مسار يكتبه إلّا إعادةُ
الحساب. صفٌّ متقادم يعني كاشًا متأخّرًا، لا مالكًا في مستوى خاطئ.`,
  },
);

export const LoyaltyOwnerTierRelationsInputUpdate = t.Partial(
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
      program: t.Object(
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
      tier: t.Partial(
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
      description: `[LY-P3] **لقطة** مستوى المالك — كاشٌ تكتبه المهمّة اليومية، لا مصدرَ حقيقة.
BR-L4.1 يقول إنّ المستوى **مشتقّ لا مُسنَد**، وهذا الجدول لا ينقض ذلك: كلّ قراءة
تخصّ مالكًا بعينه تشتقّ المستوى من الدفتر عند القراءة، ولا تسأل هذا الصفّ قطّ. وجوده
لغرضٍ واحد لا تستطيع القراءة تقديمه: التصفية والتجميع عبر آلاف المُلّاك في تقارير
§11 بلا استعلامٍ لكلّ مالك — نفس الدور الذي يؤدّيه \`slaStatus\` في CRM-P5 و\`nextDueAt\`
في التنويم.
ولا عمود «اجعل هذا المالك ذهبيًا»: لا \`tierId\` يُكتب بيد، ولا مسار يكتبه إلّا إعادةُ
الحساب. صفٌّ متقادم يعني كاشًا متأخّرًا، لا مالكًا في مستوى خاطئ.`,
    },
  ),
);

export const LoyaltyOwnerTierWhere = t.Partial(
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
          programId: t.String(),
          tierId: t.String({
            description: `\`null\` = لا مستوى مؤهَّل بعد (BR-L4.4: برنامجٌ بلا مستويات شرعيّ)`,
          }),
          qualifyingSpend: t.Number({
            description: `إنفاق النافذة المتدحرجة وقت الحساب — يُفسّر «لماذا هذا المستوى» بلا إعادة اشتقاق`,
          }),
          windowMonths: t.Integer(),
          computedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `[LY-P3] **لقطة** مستوى المالك — كاشٌ تكتبه المهمّة اليومية، لا مصدرَ حقيقة.
BR-L4.1 يقول إنّ المستوى **مشتقّ لا مُسنَد**، وهذا الجدول لا ينقض ذلك: كلّ قراءة
تخصّ مالكًا بعينه تشتقّ المستوى من الدفتر عند القراءة، ولا تسأل هذا الصفّ قطّ. وجوده
لغرضٍ واحد لا تستطيع القراءة تقديمه: التصفية والتجميع عبر آلاف المُلّاك في تقارير
§11 بلا استعلامٍ لكلّ مالك — نفس الدور الذي يؤدّيه \`slaStatus\` في CRM-P5 و\`nextDueAt\`
في التنويم.
ولا عمود «اجعل هذا المالك ذهبيًا»: لا \`tierId\` يُكتب بيد، ولا مسار يكتبه إلّا إعادةُ
الحساب. صفٌّ متقادم يعني كاشًا متأخّرًا، لا مالكًا في مستوى خاطئ.`,
        },
      ),
    { $id: "LoyaltyOwnerTier" },
  ),
);

export const LoyaltyOwnerTierWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            {
              id: t.String(),
              clinicId_ownerId: t.Object(
                { clinicId: t.String(), ownerId: t.String() },
                { additionalProperties: false },
              ),
            },
            {
              additionalProperties: false,
              description: `[LY-P3] **لقطة** مستوى المالك — كاشٌ تكتبه المهمّة اليومية، لا مصدرَ حقيقة.
BR-L4.1 يقول إنّ المستوى **مشتقّ لا مُسنَد**، وهذا الجدول لا ينقض ذلك: كلّ قراءة
تخصّ مالكًا بعينه تشتقّ المستوى من الدفتر عند القراءة، ولا تسأل هذا الصفّ قطّ. وجوده
لغرضٍ واحد لا تستطيع القراءة تقديمه: التصفية والتجميع عبر آلاف المُلّاك في تقارير
§11 بلا استعلامٍ لكلّ مالك — نفس الدور الذي يؤدّيه \`slaStatus\` في CRM-P5 و\`nextDueAt\`
في التنويم.
ولا عمود «اجعل هذا المالك ذهبيًا»: لا \`tierId\` يُكتب بيد، ولا مسار يكتبه إلّا إعادةُ
الحساب. صفٌّ متقادم يعني كاشًا متأخّرًا، لا مالكًا في مستوى خاطئ.`,
            },
          ),
          { additionalProperties: false },
        ),
        t.Union(
          [
            t.Object({ id: t.String() }),
            t.Object({
              clinicId_ownerId: t.Object(
                { clinicId: t.String(), ownerId: t.String() },
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
              ownerId: t.String(),
              programId: t.String(),
              tierId: t.String({
                description: `\`null\` = لا مستوى مؤهَّل بعد (BR-L4.4: برنامجٌ بلا مستويات شرعيّ)`,
              }),
              qualifyingSpend: t.Number({
                description: `إنفاق النافذة المتدحرجة وقت الحساب — يُفسّر «لماذا هذا المستوى» بلا إعادة اشتقاق`,
              }),
              windowMonths: t.Integer(),
              computedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "LoyaltyOwnerTier" },
);

export const LoyaltyOwnerTierSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      clinicId: t.Boolean(),
      ownerId: t.Boolean(),
      programId: t.Boolean(),
      tierId: t.Boolean(),
      qualifyingSpend: t.Boolean(),
      windowMonths: t.Boolean(),
      computedAt: t.Boolean(),
      clinic: t.Boolean(),
      owner: t.Boolean(),
      program: t.Boolean(),
      tier: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `[LY-P3] **لقطة** مستوى المالك — كاشٌ تكتبه المهمّة اليومية، لا مصدرَ حقيقة.
BR-L4.1 يقول إنّ المستوى **مشتقّ لا مُسنَد**، وهذا الجدول لا ينقض ذلك: كلّ قراءة
تخصّ مالكًا بعينه تشتقّ المستوى من الدفتر عند القراءة، ولا تسأل هذا الصفّ قطّ. وجوده
لغرضٍ واحد لا تستطيع القراءة تقديمه: التصفية والتجميع عبر آلاف المُلّاك في تقارير
§11 بلا استعلامٍ لكلّ مالك — نفس الدور الذي يؤدّيه \`slaStatus\` في CRM-P5 و\`nextDueAt\`
في التنويم.
ولا عمود «اجعل هذا المالك ذهبيًا»: لا \`tierId\` يُكتب بيد، ولا مسار يكتبه إلّا إعادةُ
الحساب. صفٌّ متقادم يعني كاشًا متأخّرًا، لا مالكًا في مستوى خاطئ.`,
    },
  ),
);

export const LoyaltyOwnerTierInclude = t.Partial(
  t.Object(
    {
      clinic: t.Boolean(),
      owner: t.Boolean(),
      program: t.Boolean(),
      tier: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `[LY-P3] **لقطة** مستوى المالك — كاشٌ تكتبه المهمّة اليومية، لا مصدرَ حقيقة.
BR-L4.1 يقول إنّ المستوى **مشتقّ لا مُسنَد**، وهذا الجدول لا ينقض ذلك: كلّ قراءة
تخصّ مالكًا بعينه تشتقّ المستوى من الدفتر عند القراءة، ولا تسأل هذا الصفّ قطّ. وجوده
لغرضٍ واحد لا تستطيع القراءة تقديمه: التصفية والتجميع عبر آلاف المُلّاك في تقارير
§11 بلا استعلامٍ لكلّ مالك — نفس الدور الذي يؤدّيه \`slaStatus\` في CRM-P5 و\`nextDueAt\`
في التنويم.
ولا عمود «اجعل هذا المالك ذهبيًا»: لا \`tierId\` يُكتب بيد، ولا مسار يكتبه إلّا إعادةُ
الحساب. صفٌّ متقادم يعني كاشًا متأخّرًا، لا مالكًا في مستوى خاطئ.`,
    },
  ),
);

export const LoyaltyOwnerTierOrderBy = t.Partial(
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
      programId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      tierId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      qualifyingSpend: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      windowMonths: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      computedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    {
      additionalProperties: false,
      description: `[LY-P3] **لقطة** مستوى المالك — كاشٌ تكتبه المهمّة اليومية، لا مصدرَ حقيقة.
BR-L4.1 يقول إنّ المستوى **مشتقّ لا مُسنَد**، وهذا الجدول لا ينقض ذلك: كلّ قراءة
تخصّ مالكًا بعينه تشتقّ المستوى من الدفتر عند القراءة، ولا تسأل هذا الصفّ قطّ. وجوده
لغرضٍ واحد لا تستطيع القراءة تقديمه: التصفية والتجميع عبر آلاف المُلّاك في تقارير
§11 بلا استعلامٍ لكلّ مالك — نفس الدور الذي يؤدّيه \`slaStatus\` في CRM-P5 و\`nextDueAt\`
في التنويم.
ولا عمود «اجعل هذا المالك ذهبيًا»: لا \`tierId\` يُكتب بيد، ولا مسار يكتبه إلّا إعادةُ
الحساب. صفٌّ متقادم يعني كاشًا متأخّرًا، لا مالكًا في مستوى خاطئ.`,
    },
  ),
);

export const LoyaltyOwnerTier = t.Composite(
  [LoyaltyOwnerTierPlain, LoyaltyOwnerTierRelations],
  { additionalProperties: false },
);

export const LoyaltyOwnerTierInputCreate = t.Composite(
  [LoyaltyOwnerTierPlainInputCreate, LoyaltyOwnerTierRelationsInputCreate],
  { additionalProperties: false },
);

export const LoyaltyOwnerTierInputUpdate = t.Composite(
  [LoyaltyOwnerTierPlainInputUpdate, LoyaltyOwnerTierRelationsInputUpdate],
  { additionalProperties: false },
);
