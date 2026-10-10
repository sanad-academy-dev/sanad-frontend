import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const LoyaltyRedemptionPlain = t.Object(
  {
    id: t.String(),
    clinicId: t.String(),
    ownerId: t.String(),
    programId: t.String(),
    sourceType: t.Union(
      [t.Literal("CLINIC_INVOICE"), t.Literal("POS_SALE"), t.Literal("MANUAL")],
      { additionalProperties: false, description: `[LY-P1] §9 — مصدر الحركة.` },
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
);

export const LoyaltyRedemptionRelations = t.Object(
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
    description: `[LY-P2] **نيّة استبدال** على مستند واحد (BR-L6.3). صفٌّ واحد لكل مستند: يُكتب عند
التسعير ولا يستهلك شيئًا، ويُلتزم داخل معاملة الدفع فيكتب صفّ REDEEM في الدفتر.
لماذا جدولٌ مستقلّ لا صفّ REDEEM مباشرةً: الدفتر إلحاقيّ ونهائيّ (BR-L9.3) — صفٌّ فيه
يعني «وقع». والنيّة قد لا تقع أبدًا: فاتورة تُسعَّر ثم تُهجَر، أو تُعاد تسعيرها بنقاط
أقلّ. كتابةُ النيّة في الدفتر كانت ستجعل رصيدًا معلّقًا على مستندات لم تُدفع.`,
  },
);

export const LoyaltyRedemptionPlainInputCreate = t.Object(
  {
    sourceType: t.Union(
      [t.Literal("CLINIC_INVOICE"), t.Literal("POS_SALE"), t.Literal("MANUAL")],
      { additionalProperties: false, description: `[LY-P1] §9 — مصدر الحركة.` },
    ),
    points: t.Integer({
      description: `النقاط المطلوب استبدالها — موجبة دائمًا؛ الإشارة تُوضَع على صفّ الدفتر لا هنا`,
    }),
    discountAmount: t.Number({
      description: `الخصم الناتج قبل الضريبة (BR-M6.4 خطوة ٤) — بعد سقف \`maxRedemptionPercent\``,
    }),
    redemptionRateSnapshot: t.Number({
      description: `BR-L3.2 — معدّل الاستبدال لحظة التسعير، لا كما صار بعدها`,
    }),
    consumedAt: t.Optional(
      __nullable__(
        t.Date({
          description: `\`null\` = نيّةٌ لم تقع. تُملأ داخل معاملة الدفع وحدها (BR-L6.3 خطوة ٢).`,
        }),
      ),
    ),
  },
  {
    additionalProperties: false,
    description: `[LY-P2] **نيّة استبدال** على مستند واحد (BR-L6.3). صفٌّ واحد لكل مستند: يُكتب عند
التسعير ولا يستهلك شيئًا، ويُلتزم داخل معاملة الدفع فيكتب صفّ REDEEM في الدفتر.
لماذا جدولٌ مستقلّ لا صفّ REDEEM مباشرةً: الدفتر إلحاقيّ ونهائيّ (BR-L9.3) — صفٌّ فيه
يعني «وقع». والنيّة قد لا تقع أبدًا: فاتورة تُسعَّر ثم تُهجَر، أو تُعاد تسعيرها بنقاط
أقلّ. كتابةُ النيّة في الدفتر كانت ستجعل رصيدًا معلّقًا على مستندات لم تُدفع.`,
  },
);

export const LoyaltyRedemptionPlainInputUpdate = t.Object(
  {
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
    points: t.Optional(
      t.Integer({
        description: `النقاط المطلوب استبدالها — موجبة دائمًا؛ الإشارة تُوضَع على صفّ الدفتر لا هنا`,
      }),
    ),
    discountAmount: t.Optional(
      t.Number({
        description: `الخصم الناتج قبل الضريبة (BR-M6.4 خطوة ٤) — بعد سقف \`maxRedemptionPercent\``,
      }),
    ),
    redemptionRateSnapshot: t.Optional(
      t.Number({
        description: `BR-L3.2 — معدّل الاستبدال لحظة التسعير، لا كما صار بعدها`,
      }),
    ),
    consumedAt: t.Optional(
      __nullable__(
        t.Date({
          description: `\`null\` = نيّةٌ لم تقع. تُملأ داخل معاملة الدفع وحدها (BR-L6.3 خطوة ٢).`,
        }),
      ),
    ),
  },
  {
    additionalProperties: false,
    description: `[LY-P2] **نيّة استبدال** على مستند واحد (BR-L6.3). صفٌّ واحد لكل مستند: يُكتب عند
التسعير ولا يستهلك شيئًا، ويُلتزم داخل معاملة الدفع فيكتب صفّ REDEEM في الدفتر.
لماذا جدولٌ مستقلّ لا صفّ REDEEM مباشرةً: الدفتر إلحاقيّ ونهائيّ (BR-L9.3) — صفٌّ فيه
يعني «وقع». والنيّة قد لا تقع أبدًا: فاتورة تُسعَّر ثم تُهجَر، أو تُعاد تسعيرها بنقاط
أقلّ. كتابةُ النيّة في الدفتر كانت ستجعل رصيدًا معلّقًا على مستندات لم تُدفع.`,
  },
);

export const LoyaltyRedemptionRelationsInputCreate = t.Object(
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
    description: `[LY-P2] **نيّة استبدال** على مستند واحد (BR-L6.3). صفٌّ واحد لكل مستند: يُكتب عند
التسعير ولا يستهلك شيئًا، ويُلتزم داخل معاملة الدفع فيكتب صفّ REDEEM في الدفتر.
لماذا جدولٌ مستقلّ لا صفّ REDEEM مباشرةً: الدفتر إلحاقيّ ونهائيّ (BR-L9.3) — صفٌّ فيه
يعني «وقع». والنيّة قد لا تقع أبدًا: فاتورة تُسعَّر ثم تُهجَر، أو تُعاد تسعيرها بنقاط
أقلّ. كتابةُ النيّة في الدفتر كانت ستجعل رصيدًا معلّقًا على مستندات لم تُدفع.`,
  },
);

export const LoyaltyRedemptionRelationsInputUpdate = t.Partial(
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
      description: `[LY-P2] **نيّة استبدال** على مستند واحد (BR-L6.3). صفٌّ واحد لكل مستند: يُكتب عند
التسعير ولا يستهلك شيئًا، ويُلتزم داخل معاملة الدفع فيكتب صفّ REDEEM في الدفتر.
لماذا جدولٌ مستقلّ لا صفّ REDEEM مباشرةً: الدفتر إلحاقيّ ونهائيّ (BR-L9.3) — صفٌّ فيه
يعني «وقع». والنيّة قد لا تقع أبدًا: فاتورة تُسعَّر ثم تُهجَر، أو تُعاد تسعيرها بنقاط
أقلّ. كتابةُ النيّة في الدفتر كانت ستجعل رصيدًا معلّقًا على مستندات لم تُدفع.`,
    },
  ),
);

export const LoyaltyRedemptionWhere = t.Partial(
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
          consumedAt: t.Date({
            description: `\`null\` = نيّةٌ لم تقع. تُملأ داخل معاملة الدفع وحدها (BR-L6.3 خطوة ٢).`,
          }),
          createdByUserId: t.String(),
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
    { $id: "LoyaltyRedemption" },
  ),
);

export const LoyaltyRedemptionWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            {
              id: t.String(),
              sourceType_sourceId: t.Object(
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
                  sourceId: t.String(),
                },
                { additionalProperties: false },
              ),
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
        t.Union(
          [
            t.Object({ id: t.String() }),
            t.Object({
              sourceType_sourceId: t.Object(
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
                  sourceId: t.String(),
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
              consumedAt: t.Date({
                description: `\`null\` = نيّةٌ لم تقع. تُملأ داخل معاملة الدفع وحدها (BR-L6.3 خطوة ٢).`,
              }),
              createdByUserId: t.String(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "LoyaltyRedemption" },
);

export const LoyaltyRedemptionSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      clinicId: t.Boolean(),
      ownerId: t.Boolean(),
      programId: t.Boolean(),
      sourceType: t.Boolean(),
      sourceId: t.Boolean(),
      points: t.Boolean(),
      discountAmount: t.Boolean(),
      redemptionRateSnapshot: t.Boolean(),
      consumedAt: t.Boolean(),
      createdByUserId: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinic: t.Boolean(),
      owner: t.Boolean(),
      program: t.Boolean(),
      allocations: t.Boolean(),
      _count: t.Boolean(),
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
);

export const LoyaltyRedemptionInclude = t.Partial(
  t.Object(
    {
      sourceType: t.Boolean(),
      clinic: t.Boolean(),
      owner: t.Boolean(),
      program: t.Boolean(),
      allocations: t.Boolean(),
      _count: t.Boolean(),
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
);

export const LoyaltyRedemptionOrderBy = t.Partial(
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
      sourceId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      points: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      discountAmount: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      redemptionRateSnapshot: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      consumedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdByUserId: t.Union([t.Literal("asc"), t.Literal("desc")], {
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
      description: `[LY-P2] **نيّة استبدال** على مستند واحد (BR-L6.3). صفٌّ واحد لكل مستند: يُكتب عند
التسعير ولا يستهلك شيئًا، ويُلتزم داخل معاملة الدفع فيكتب صفّ REDEEM في الدفتر.
لماذا جدولٌ مستقلّ لا صفّ REDEEM مباشرةً: الدفتر إلحاقيّ ونهائيّ (BR-L9.3) — صفٌّ فيه
يعني «وقع». والنيّة قد لا تقع أبدًا: فاتورة تُسعَّر ثم تُهجَر، أو تُعاد تسعيرها بنقاط
أقلّ. كتابةُ النيّة في الدفتر كانت ستجعل رصيدًا معلّقًا على مستندات لم تُدفع.`,
    },
  ),
);

export const LoyaltyRedemption = t.Composite(
  [LoyaltyRedemptionPlain, LoyaltyRedemptionRelations],
  { additionalProperties: false },
);

export const LoyaltyRedemptionInputCreate = t.Composite(
  [LoyaltyRedemptionPlainInputCreate, LoyaltyRedemptionRelationsInputCreate],
  { additionalProperties: false },
);

export const LoyaltyRedemptionInputUpdate = t.Composite(
  [LoyaltyRedemptionPlainInputUpdate, LoyaltyRedemptionRelationsInputUpdate],
  { additionalProperties: false },
);
