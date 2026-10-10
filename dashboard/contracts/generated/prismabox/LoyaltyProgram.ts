import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const LoyaltyProgramPlain = t.Object(
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
);

export const LoyaltyProgramRelations = t.Object(
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
    tiers: t.Array(
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
      { additionalProperties: false },
    ),
    ledger: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          ownerId: t.String(),
          programId: t.String({
            description: `لقطةُ مرجع: البرنامج الذي حكم هذه الحركة. \`Restrict\` — لا يُحذف برنامجٌ له حركات
(BR-L3.3)، والحذف الناعم هو الطريق.`,
          }),
          kind: t.Union(
            [
              t.Literal("EARN"),
              t.Literal("REDEEM"),
              t.Literal("EXPIRY"),
              t.Literal("REVERSAL"),
              t.Literal("REDEMPTION_RESTORE"),
              t.Literal("ADJUSTMENT"),
            ],
            {
              additionalProperties: false,
              description: `[LY-P1] §9 — نوع حركة النقاط.`,
            },
          ),
          points: t.Integer({
            description: `**موقَّعة**: الكسب موجب، والاستبدال والانتهاء والعكس سالبة. الرصيد مجموعها.`,
          }),
          pointsConsumed: t.Integer({
            description: `على صفوف الكسب وحدها: كم استُهلك منها (FIFO، §6.4). يبدأ صفرًا ولا يتجاوز \`points\`.`,
          }),
          earnRateSnapshot: __nullable__(
            t.Number({
              description: `BR-L3.2 — المعدّلات كما كانت لحظة الحركة، لا كما هي اليوم. تعديل البرنامج لا يمسّ
نقاطًا مُنحت ولا خصومًا أُعطيت — نفس انضباط لقطات مزايا العضوية وتغطية التأمين.`,
            }),
          ),
          redemptionRateSnapshot: __nullable__(t.Number()),
          multiplierSnapshot: __nullable__(
            t.Number({
              description: `المضاعِف الفعليّ المطبَّق (المستوى × العضوية) — يُفسّر الرقم بعد أشهر`,
            }),
          ),
          earnBaseAmount: __nullable__(
            t.Number({
              description: `الأساس الذي حُسب عليه الكسب: صافي المالك قبل الضريبة (BR-L5.2)`,
            }),
          ),
          sourceType: t.Union(
            [
              t.Literal("CLINIC_INVOICE"),
              t.Literal("POS_SALE"),
              t.Literal("MANUAL"),
            ],
            {
              additionalProperties: false,
              description: `[LY-P1] §9 — مصدر الحركة.`,
            },
          ),
          sourceId: t.String({
            description: `معرّف المستند المصدر — أو \`cuid()\` مستقلّ لصفوف التسوية اليدوية`,
          }),
          earnedAt: t.Date(),
          expiresAt: __nullable__(
            t.Date({
              description: `على صفوف الكسب وحدها: \`earnedAt + program.pointsValidityMonths\` (BR-L7.1)`,
            }),
          ),
          note: __nullable__(
            t.String({
              description: `إلزاميّ على التسوية اليدوية (BR-L9.2) — منحةٌ بلا سبب لا تُراجَع`,
            }),
          ),
          createdByUserId: __nullable__(t.String()),
          createdAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `[LY-P1] §9.1 — دفتر النقاط.
**لا عمود رصيد في أيّ مكان (BR-L9.1).** الرصيد مجموع الصفوف، تمامًا كما يُشتقّ مستحقّ
الطرف من \`payment_ledger_entry\`. عمودُ رصيدٍ مخزَّن مصدرُ حقيقةٍ ثانٍ، ولهذا المستودع
قراراتٌ مكتوبة ضدّه بعينه.
**والدفتر يُضاف إليه فقط (BR-L9.3):** لا صفّ يُعدَّل ولا يُحذف؛ التصحيح صفٌّ جديد.
الاستثناء الوحيد \`pointsConsumed\` على صفوف الكسب — وهو ليس تعديلًا للواقعة بل عدّاد
استهلاكٍ يخصّ ترتيب FIFO في §6.4، ويُكتب بتحديثٍ شرطيّ ذرّي كما تفعل استحقاقات
العضوية (\`membership-pricing.service.ts\`).`,
        },
      ),
      { additionalProperties: false },
    ),
    redemptions: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          ownerId: t.String(),
          programId: t.String(),
          sourceType: t.Union(
            [
              t.Literal("CLINIC_INVOICE"),
              t.Literal("POS_SALE"),
              t.Literal("MANUAL"),
            ],
            {
              additionalProperties: false,
              description: `[LY-P1] §9 — مصدر الحركة.`,
            },
          ),
          sourceId: t.String(),
          points: t.Integer({
            description: `النقاط المطلوب استبدالها — موجبة دائمًا؛ الإشارة تُوضَع على صفّ الدفتر لا هنا`,
          }),
          discountAmount: t.Number({
            description: `الخصم الناتج قبل الضريبة (BR-M6.4 خطوة ٤) — بعد سقف \`maxRedemptionPercent\``,
          }),
          redemptionRateSnapshot: t.Number({
            description: `BR-L3.2 — معدّل الاستبدال لحظة التسعير، لا كما صار بعدها`,
          }),
          consumedAt: __nullable__(
            t.Date({
              description: `\`null\` = نيّةٌ لم تقع. تُملأ داخل معاملة الدفع وحدها (BR-L6.3 خطوة ٢).`,
            }),
          ),
          createdByUserId: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `[LY-P2] **نيّة استبدال** على مستند واحد (BR-L6.3). صفٌّ واحد لكل مستند: يُكتب عند
التسعير ولا يستهلك شيئًا، ويُلتزم داخل معاملة الدفع فيكتب صفّ REDEEM في الدفتر.
لماذا جدولٌ مستقلّ لا صفّ REDEEM مباشرةً: الدفتر إلحاقيّ ونهائيّ (BR-L9.3) — صفٌّ فيه
يعني «وقع». والنيّة قد لا تقع أبدًا: فاتورة تُسعَّر ثم تُهجَر، أو تُعاد تسعيرها بنقاط
أقلّ. كتابةُ النيّة في الدفتر كانت ستجعل رصيدًا معلّقًا على مستندات لم تُدفع.`,
        },
      ),
      { additionalProperties: false },
    ),
    ownerTiers: t.Array(
      t.Object(
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
      ),
      { additionalProperties: false },
    ),
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
);

export const LoyaltyProgramPlainInputCreate = t.Object(
  {
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
    membershipMultiplier: t.Optional(
      t.Number({
        description: `مضاعِفٌ يُطبَّق حين يحمل المالك عضويةً فعّالة وقت الدفع (BR-L5.4) — قراءةٌ لا اقتران`,
      }),
    ),
    roundingMode: t.Optional(
      t.Union([t.Literal("FLOOR")], {
        additionalProperties: false,
        description: `[LY-P0] §5.5/BR-L5.5 — معالجة كسور النقاط.
**عضوٌ واحد عمدًا.** §3 يُدرج \`roundingMode\` حقلًا، وBR-L5.5 يقرّر أنّه **ثابت لا
قابل للضبط** في v1 («عبءُ دعمٍ بلا قيمة تجارية»). عمودٌ باتحادٍ مفتوح كان سيَعِد
بخيارٍ يرفض المنتج تقديمه؛ واتحادٌ بعضوٍ واحد يجعل «ثابت في v1» **ضمانة قاعدة
بيانات** لا عُرفًا تتذكّره الشيفرة — وهي نفس حجّة CRM §17.2 صفّ ٥ حين قُسِم اتحادٌ
واحد إلى اثنين ليصير الشرط المُقوَّس ضمانةً. إضافة عضوٍ ثانٍ لاحقًا هجرةٌ واعية.`,
      }),
    ),
    active: t.Optional(t.Boolean()),
    isDeleted: t.Optional(t.Boolean()),
    deletedAt: t.Optional(__nullable__(t.Date())),
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
);

export const LoyaltyProgramPlainInputUpdate = t.Object(
  {
    name: t.Optional(t.String()),
    earnRate: t.Optional(
      t.Number({
        description: `نقاط تُمنح لكل وحدة عملة من الإنفاق المؤهِّل — الكسور طبيعية هنا (§3)`,
      }),
    ),
    redemptionRate: t.Optional(
      t.Number({
        description: `قيمة النقطة الواحدة بالعملة عند الاستبدال (§3)`,
      }),
    ),
    minRedemptionPoints: t.Optional(
      t.Integer({
        description: `الحدّ الأدنى الذي يُرفض الاستبدال دونه (BR-L6.2)`,
      }),
    ),
    maxRedemptionPercent: t.Optional(
      t.Number({
        description: `سقف ما يجوز أن تدفعه النقاط من فاتورةٍ واحدة، نسبةً مئوية (BR-L6.2)`,
      }),
    ),
    pointsValidityMonths: t.Optional(
      t.Integer({ description: `أشهر صلاحية النقاط المكتسبة (§7، BR-L7.1)` }),
    ),
    membershipMultiplier: t.Optional(
      t.Number({
        description: `مضاعِفٌ يُطبَّق حين يحمل المالك عضويةً فعّالة وقت الدفع (BR-L5.4) — قراءةٌ لا اقتران`,
      }),
    ),
    roundingMode: t.Optional(
      t.Union([t.Literal("FLOOR")], {
        additionalProperties: false,
        description: `[LY-P0] §5.5/BR-L5.5 — معالجة كسور النقاط.
**عضوٌ واحد عمدًا.** §3 يُدرج \`roundingMode\` حقلًا، وBR-L5.5 يقرّر أنّه **ثابت لا
قابل للضبط** في v1 («عبءُ دعمٍ بلا قيمة تجارية»). عمودٌ باتحادٍ مفتوح كان سيَعِد
بخيارٍ يرفض المنتج تقديمه؛ واتحادٌ بعضوٍ واحد يجعل «ثابت في v1» **ضمانة قاعدة
بيانات** لا عُرفًا تتذكّره الشيفرة — وهي نفس حجّة CRM §17.2 صفّ ٥ حين قُسِم اتحادٌ
واحد إلى اثنين ليصير الشرط المُقوَّس ضمانةً. إضافة عضوٍ ثانٍ لاحقًا هجرةٌ واعية.`,
      }),
    ),
    active: t.Optional(t.Boolean()),
    isDeleted: t.Optional(t.Boolean()),
    deletedAt: t.Optional(__nullable__(t.Date())),
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
);

export const LoyaltyProgramRelationsInputCreate = t.Object(
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
    tiers: t.Optional(
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
    ledger: t.Optional(
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
    redemptions: t.Optional(
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
    ownerTiers: t.Optional(
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
    description: `[LY-P0] §3 — برنامج النقاط.
BR-L3.1: **برنامجٌ فعّالٌ واحد لكل عيادة.** لا يُفرض بقيدٍ جزئي في المخطط لأنّ
Prisma لا يُعبّر عن \`WHERE\`ات الفهارس الجزئية؛ يُفرض في الخدمة برفضٍ عربيّ، ويُختبر.
BR-L3.2: البرنامج **مصدرُ لقطةٍ لا سلطةٌ حيّة** — كل صفّ كسبٍ واستبدالٍ سيخزّن
المعدّلات التي استعملها (LY-P1/P2)، فتعديل البرنامج لا يمسّ نقاطًا مُنحت ولا خصومًا
أُعطيت. نفس انضباط لقطات مزايا العضوية وتغطية التأمين.`,
  },
);

export const LoyaltyProgramRelationsInputUpdate = t.Partial(
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
      tiers: t.Partial(
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
      ledger: t.Partial(
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
      redemptions: t.Partial(
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
      ownerTiers: t.Partial(
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
      description: `[LY-P0] §3 — برنامج النقاط.
BR-L3.1: **برنامجٌ فعّالٌ واحد لكل عيادة.** لا يُفرض بقيدٍ جزئي في المخطط لأنّ
Prisma لا يُعبّر عن \`WHERE\`ات الفهارس الجزئية؛ يُفرض في الخدمة برفضٍ عربيّ، ويُختبر.
BR-L3.2: البرنامج **مصدرُ لقطةٍ لا سلطةٌ حيّة** — كل صفّ كسبٍ واستبدالٍ سيخزّن
المعدّلات التي استعملها (LY-P1/P2)، فتعديل البرنامج لا يمسّ نقاطًا مُنحت ولا خصومًا
أُعطيت. نفس انضباط لقطات مزايا العضوية وتغطية التأمين.`,
    },
  ),
);

export const LoyaltyProgramWhere = t.Partial(
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
          deletedAt: t.Date(),
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
    { $id: "LoyaltyProgram" },
  ),
);

export const LoyaltyProgramWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.String() },
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
  { $id: "LoyaltyProgram" },
);

export const LoyaltyProgramSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      clinicId: t.Boolean(),
      name: t.Boolean(),
      earnRate: t.Boolean(),
      redemptionRate: t.Boolean(),
      minRedemptionPoints: t.Boolean(),
      maxRedemptionPercent: t.Boolean(),
      pointsValidityMonths: t.Boolean(),
      membershipMultiplier: t.Boolean(),
      roundingMode: t.Boolean(),
      active: t.Boolean(),
      isDeleted: t.Boolean(),
      deletedAt: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinic: t.Boolean(),
      tiers: t.Boolean(),
      ledger: t.Boolean(),
      redemptions: t.Boolean(),
      ownerTiers: t.Boolean(),
      _count: t.Boolean(),
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
);

export const LoyaltyProgramInclude = t.Partial(
  t.Object(
    {
      roundingMode: t.Boolean(),
      clinic: t.Boolean(),
      tiers: t.Boolean(),
      ledger: t.Boolean(),
      redemptions: t.Boolean(),
      ownerTiers: t.Boolean(),
      _count: t.Boolean(),
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
);

export const LoyaltyProgramOrderBy = t.Partial(
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
      earnRate: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      redemptionRate: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      minRedemptionPoints: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      maxRedemptionPercent: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      pointsValidityMonths: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      membershipMultiplier: t.Union([t.Literal("asc"), t.Literal("desc")], {
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
      description: `[LY-P0] §3 — برنامج النقاط.
BR-L3.1: **برنامجٌ فعّالٌ واحد لكل عيادة.** لا يُفرض بقيدٍ جزئي في المخطط لأنّ
Prisma لا يُعبّر عن \`WHERE\`ات الفهارس الجزئية؛ يُفرض في الخدمة برفضٍ عربيّ، ويُختبر.
BR-L3.2: البرنامج **مصدرُ لقطةٍ لا سلطةٌ حيّة** — كل صفّ كسبٍ واستبدالٍ سيخزّن
المعدّلات التي استعملها (LY-P1/P2)، فتعديل البرنامج لا يمسّ نقاطًا مُنحت ولا خصومًا
أُعطيت. نفس انضباط لقطات مزايا العضوية وتغطية التأمين.`,
    },
  ),
);

export const LoyaltyProgram = t.Composite(
  [LoyaltyProgramPlain, LoyaltyProgramRelations],
  { additionalProperties: false },
);

export const LoyaltyProgramInputCreate = t.Composite(
  [LoyaltyProgramPlainInputCreate, LoyaltyProgramRelationsInputCreate],
  { additionalProperties: false },
);

export const LoyaltyProgramInputUpdate = t.Composite(
  [LoyaltyProgramPlainInputUpdate, LoyaltyProgramRelationsInputUpdate],
  { additionalProperties: false },
);
