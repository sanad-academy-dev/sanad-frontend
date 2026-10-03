import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const LoyaltyLedgerEntryPlain = t.Object(
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
      [t.Literal("CLINIC_INVOICE"), t.Literal("POS_SALE"), t.Literal("MANUAL")],
      { additionalProperties: false, description: `[LY-P1] §9 — مصدر الحركة.` },
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
);

export const LoyaltyLedgerEntryRelations = t.Object(
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
    allocations: t.Array(
      t.Object(
        {
          id: t.String(),
          redemptionId: t.String(),
          ledgerEntryId: t.String({ description: `صفّ الكسب المستهلَك منه` }),
          points: t.Integer(),
          expiresAtSnapshot: __nullable__(
            t.Date({
              description: `لقطة \`expiresAt\` لصفّ الكسب وقت التخصيص — شرطُ الردّ (BR-L6.3 خطوة ٤)`,
            }),
          ),
        },
        {
          additionalProperties: false,
          description: `[LY-P2] من أيّ صفوف كسبٍ استُهلكت النقاط (BR-L6.4 — الأقدم انتهاءً أولًا).
موجودٌ لأنّ الردّ يُعيد النقاط **إلى صفوفها** ولا يُعيدها كمنحةٍ جديدة (BR-L6.3 خطوة ٤):
نقطةٌ عمرها أحد عشر شهرًا يجب أن تعود بتاريخ انتهائها الأصلي، لا أن تُولد من جديد بسنة
كاملة. و\`expiresAtSnapshot\` محفوظٌ هنا ليُحسم شرطُ «غير المنتهية» بلا قراءة ثانية.`,
        },
      ),
      { additionalProperties: false },
    ),
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
);

export const LoyaltyLedgerEntryPlainInputCreate = t.Object(
  {
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
    pointsConsumed: t.Optional(
      t.Integer({
        description: `على صفوف الكسب وحدها: كم استُهلك منها (FIFO، §6.4). يبدأ صفرًا ولا يتجاوز \`points\`.`,
      }),
    ),
    earnRateSnapshot: t.Optional(
      __nullable__(
        t.Number({
          description: `BR-L3.2 — المعدّلات كما كانت لحظة الحركة، لا كما هي اليوم. تعديل البرنامج لا يمسّ
نقاطًا مُنحت ولا خصومًا أُعطيت — نفس انضباط لقطات مزايا العضوية وتغطية التأمين.`,
        }),
      ),
    ),
    redemptionRateSnapshot: t.Optional(__nullable__(t.Number())),
    multiplierSnapshot: t.Optional(
      __nullable__(
        t.Number({
          description: `المضاعِف الفعليّ المطبَّق (المستوى × العضوية) — يُفسّر الرقم بعد أشهر`,
        }),
      ),
    ),
    earnBaseAmount: t.Optional(
      __nullable__(
        t.Number({
          description: `الأساس الذي حُسب عليه الكسب: صافي المالك قبل الضريبة (BR-L5.2)`,
        }),
      ),
    ),
    sourceType: t.Union(
      [t.Literal("CLINIC_INVOICE"), t.Literal("POS_SALE"), t.Literal("MANUAL")],
      { additionalProperties: false, description: `[LY-P1] §9 — مصدر الحركة.` },
    ),
    earnedAt: t.Optional(t.Date()),
    expiresAt: t.Optional(
      __nullable__(
        t.Date({
          description: `على صفوف الكسب وحدها: \`earnedAt + program.pointsValidityMonths\` (BR-L7.1)`,
        }),
      ),
    ),
    note: t.Optional(
      __nullable__(
        t.String({
          description: `إلزاميّ على التسوية اليدوية (BR-L9.2) — منحةٌ بلا سبب لا تُراجَع`,
        }),
      ),
    ),
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
);

export const LoyaltyLedgerEntryPlainInputUpdate = t.Object(
  {
    kind: t.Optional(
      t.Union(
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
    ),
    points: t.Optional(
      t.Integer({
        description: `**موقَّعة**: الكسب موجب، والاستبدال والانتهاء والعكس سالبة. الرصيد مجموعها.`,
      }),
    ),
    pointsConsumed: t.Optional(
      t.Integer({
        description: `على صفوف الكسب وحدها: كم استُهلك منها (FIFO، §6.4). يبدأ صفرًا ولا يتجاوز \`points\`.`,
      }),
    ),
    earnRateSnapshot: t.Optional(
      __nullable__(
        t.Number({
          description: `BR-L3.2 — المعدّلات كما كانت لحظة الحركة، لا كما هي اليوم. تعديل البرنامج لا يمسّ
نقاطًا مُنحت ولا خصومًا أُعطيت — نفس انضباط لقطات مزايا العضوية وتغطية التأمين.`,
        }),
      ),
    ),
    redemptionRateSnapshot: t.Optional(__nullable__(t.Number())),
    multiplierSnapshot: t.Optional(
      __nullable__(
        t.Number({
          description: `المضاعِف الفعليّ المطبَّق (المستوى × العضوية) — يُفسّر الرقم بعد أشهر`,
        }),
      ),
    ),
    earnBaseAmount: t.Optional(
      __nullable__(
        t.Number({
          description: `الأساس الذي حُسب عليه الكسب: صافي المالك قبل الضريبة (BR-L5.2)`,
        }),
      ),
    ),
    sourceType: t.Optional(
      t.Union(
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
    ),
    earnedAt: t.Optional(t.Date()),
    expiresAt: t.Optional(
      __nullable__(
        t.Date({
          description: `على صفوف الكسب وحدها: \`earnedAt + program.pointsValidityMonths\` (BR-L7.1)`,
        }),
      ),
    ),
    note: t.Optional(
      __nullable__(
        t.String({
          description: `إلزاميّ على التسوية اليدوية (BR-L9.2) — منحةٌ بلا سبب لا تُراجَع`,
        }),
      ),
    ),
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
);

export const LoyaltyLedgerEntryRelationsInputCreate = t.Object(
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
    allocations: t.Optional(
      t.Object(
        {
          connect: t.Array(
            t.Object(
              {
                id: t.String({
                  additionalProperties: false,
                  description: `[LY-P2] تخصيصات الاستبدال التي استهلكت من هذا الصفّ (FIFO، BR-L6.4)`,
                }),
              },
              {
                additionalProperties: false,
                description: `[LY-P2] تخصيصات الاستبدال التي استهلكت من هذا الصفّ (FIFO، BR-L6.4)`,
              },
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
    description: `[LY-P1] §9.1 — دفتر النقاط.
**لا عمود رصيد في أيّ مكان (BR-L9.1).** الرصيد مجموع الصفوف، تمامًا كما يُشتقّ مستحقّ
الطرف من \`payment_ledger_entry\`. عمودُ رصيدٍ مخزَّن مصدرُ حقيقةٍ ثانٍ، ولهذا المستودع
قراراتٌ مكتوبة ضدّه بعينه.
**والدفتر يُضاف إليه فقط (BR-L9.3):** لا صفّ يُعدَّل ولا يُحذف؛ التصحيح صفٌّ جديد.
الاستثناء الوحيد \`pointsConsumed\` على صفوف الكسب — وهو ليس تعديلًا للواقعة بل عدّاد
استهلاكٍ يخصّ ترتيب FIFO في §6.4، ويُكتب بتحديثٍ شرطيّ ذرّي كما تفعل استحقاقات
العضوية (\`membership-pricing.service.ts\`).`,
  },
);

export const LoyaltyLedgerEntryRelationsInputUpdate = t.Partial(
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
      allocations: t.Partial(
        t.Object(
          {
            connect: t.Array(
              t.Object(
                {
                  id: t.String({
                    additionalProperties: false,
                    description: `[LY-P2] تخصيصات الاستبدال التي استهلكت من هذا الصفّ (FIFO، BR-L6.4)`,
                  }),
                },
                {
                  additionalProperties: false,
                  description: `[LY-P2] تخصيصات الاستبدال التي استهلكت من هذا الصفّ (FIFO، BR-L6.4)`,
                },
              ),
              { additionalProperties: false },
            ),
            disconnect: t.Array(
              t.Object(
                {
                  id: t.String({
                    additionalProperties: false,
                    description: `[LY-P2] تخصيصات الاستبدال التي استهلكت من هذا الصفّ (FIFO، BR-L6.4)`,
                  }),
                },
                {
                  additionalProperties: false,
                  description: `[LY-P2] تخصيصات الاستبدال التي استهلكت من هذا الصفّ (FIFO، BR-L6.4)`,
                },
              ),
              { additionalProperties: false },
            ),
          },
          {
            additionalProperties: false,
            description: `[LY-P2] تخصيصات الاستبدال التي استهلكت من هذا الصفّ (FIFO، BR-L6.4)`,
          },
        ),
      ),
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
);

export const LoyaltyLedgerEntryWhere = t.Partial(
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
          earnRateSnapshot: t.Number({
            description: `BR-L3.2 — المعدّلات كما كانت لحظة الحركة، لا كما هي اليوم. تعديل البرنامج لا يمسّ
نقاطًا مُنحت ولا خصومًا أُعطيت — نفس انضباط لقطات مزايا العضوية وتغطية التأمين.`,
          }),
          redemptionRateSnapshot: t.Number(),
          multiplierSnapshot: t.Number({
            description: `المضاعِف الفعليّ المطبَّق (المستوى × العضوية) — يُفسّر الرقم بعد أشهر`,
          }),
          earnBaseAmount: t.Number({
            description: `الأساس الذي حُسب عليه الكسب: صافي المالك قبل الضريبة (BR-L5.2)`,
          }),
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
          expiresAt: t.Date({
            description: `على صفوف الكسب وحدها: \`earnedAt + program.pointsValidityMonths\` (BR-L7.1)`,
          }),
          note: t.String({
            description: `إلزاميّ على التسوية اليدوية (BR-L9.2) — منحةٌ بلا سبب لا تُراجَع`,
          }),
          createdByUserId: t.String(),
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
    { $id: "LoyaltyLedgerEntry" },
  ),
);

export const LoyaltyLedgerEntryWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            {
              id: t.String(),
              sourceType_sourceId_kind: t.Object(
                {
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
                },
                { additionalProperties: false },
              ),
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
        t.Union(
          [
            t.Object({ id: t.String() }),
            t.Object({
              sourceType_sourceId_kind: t.Object(
                {
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
              earnRateSnapshot: t.Number({
                description: `BR-L3.2 — المعدّلات كما كانت لحظة الحركة، لا كما هي اليوم. تعديل البرنامج لا يمسّ
نقاطًا مُنحت ولا خصومًا أُعطيت — نفس انضباط لقطات مزايا العضوية وتغطية التأمين.`,
              }),
              redemptionRateSnapshot: t.Number(),
              multiplierSnapshot: t.Number({
                description: `المضاعِف الفعليّ المطبَّق (المستوى × العضوية) — يُفسّر الرقم بعد أشهر`,
              }),
              earnBaseAmount: t.Number({
                description: `الأساس الذي حُسب عليه الكسب: صافي المالك قبل الضريبة (BR-L5.2)`,
              }),
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
              expiresAt: t.Date({
                description: `على صفوف الكسب وحدها: \`earnedAt + program.pointsValidityMonths\` (BR-L7.1)`,
              }),
              note: t.String({
                description: `إلزاميّ على التسوية اليدوية (BR-L9.2) — منحةٌ بلا سبب لا تُراجَع`,
              }),
              createdByUserId: t.String(),
              createdAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "LoyaltyLedgerEntry" },
);

export const LoyaltyLedgerEntrySelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      clinicId: t.Boolean(),
      ownerId: t.Boolean(),
      programId: t.Boolean(),
      kind: t.Boolean(),
      points: t.Boolean(),
      pointsConsumed: t.Boolean(),
      earnRateSnapshot: t.Boolean(),
      redemptionRateSnapshot: t.Boolean(),
      multiplierSnapshot: t.Boolean(),
      earnBaseAmount: t.Boolean(),
      sourceType: t.Boolean(),
      sourceId: t.Boolean(),
      earnedAt: t.Boolean(),
      expiresAt: t.Boolean(),
      note: t.Boolean(),
      createdByUserId: t.Boolean(),
      createdAt: t.Boolean(),
      clinic: t.Boolean(),
      owner: t.Boolean(),
      program: t.Boolean(),
      allocations: t.Boolean(),
      _count: t.Boolean(),
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
);

export const LoyaltyLedgerEntryInclude = t.Partial(
  t.Object(
    {
      kind: t.Boolean(),
      sourceType: t.Boolean(),
      clinic: t.Boolean(),
      owner: t.Boolean(),
      program: t.Boolean(),
      allocations: t.Boolean(),
      _count: t.Boolean(),
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
);

export const LoyaltyLedgerEntryOrderBy = t.Partial(
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
      points: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      pointsConsumed: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      earnRateSnapshot: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      redemptionRateSnapshot: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      multiplierSnapshot: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      earnBaseAmount: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      sourceId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      earnedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      expiresAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      note: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdByUserId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
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
);

export const LoyaltyLedgerEntry = t.Composite(
  [LoyaltyLedgerEntryPlain, LoyaltyLedgerEntryRelations],
  { additionalProperties: false },
);

export const LoyaltyLedgerEntryInputCreate = t.Composite(
  [LoyaltyLedgerEntryPlainInputCreate, LoyaltyLedgerEntryRelationsInputCreate],
  { additionalProperties: false },
);

export const LoyaltyLedgerEntryInputUpdate = t.Composite(
  [LoyaltyLedgerEntryPlainInputUpdate, LoyaltyLedgerEntryRelationsInputUpdate],
  { additionalProperties: false },
);
