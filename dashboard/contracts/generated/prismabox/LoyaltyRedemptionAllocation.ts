import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const LoyaltyRedemptionAllocationPlain = t.Object(
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
);

export const LoyaltyRedemptionAllocationRelations = t.Object(
  {
    redemption: t.Object(
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
    ledgerEntry: t.Object(
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
  },
  {
    additionalProperties: false,
    description: `[LY-P2] من أيّ صفوف كسبٍ استُهلكت النقاط (BR-L6.4 — الأقدم انتهاءً أولًا).
موجودٌ لأنّ الردّ يُعيد النقاط **إلى صفوفها** ولا يُعيدها كمنحةٍ جديدة (BR-L6.3 خطوة ٤):
نقطةٌ عمرها أحد عشر شهرًا يجب أن تعود بتاريخ انتهائها الأصلي، لا أن تُولد من جديد بسنة
كاملة. و\`expiresAtSnapshot\` محفوظٌ هنا ليُحسم شرطُ «غير المنتهية» بلا قراءة ثانية.`,
  },
);

export const LoyaltyRedemptionAllocationPlainInputCreate = t.Object(
  {
    points: t.Integer(),
    expiresAtSnapshot: t.Optional(
      __nullable__(
        t.Date({
          description: `لقطة \`expiresAt\` لصفّ الكسب وقت التخصيص — شرطُ الردّ (BR-L6.3 خطوة ٤)`,
        }),
      ),
    ),
  },
  {
    additionalProperties: false,
    description: `[LY-P2] من أيّ صفوف كسبٍ استُهلكت النقاط (BR-L6.4 — الأقدم انتهاءً أولًا).
موجودٌ لأنّ الردّ يُعيد النقاط **إلى صفوفها** ولا يُعيدها كمنحةٍ جديدة (BR-L6.3 خطوة ٤):
نقطةٌ عمرها أحد عشر شهرًا يجب أن تعود بتاريخ انتهائها الأصلي، لا أن تُولد من جديد بسنة
كاملة. و\`expiresAtSnapshot\` محفوظٌ هنا ليُحسم شرطُ «غير المنتهية» بلا قراءة ثانية.`,
  },
);

export const LoyaltyRedemptionAllocationPlainInputUpdate = t.Object(
  {
    points: t.Optional(t.Integer()),
    expiresAtSnapshot: t.Optional(
      __nullable__(
        t.Date({
          description: `لقطة \`expiresAt\` لصفّ الكسب وقت التخصيص — شرطُ الردّ (BR-L6.3 خطوة ٤)`,
        }),
      ),
    ),
  },
  {
    additionalProperties: false,
    description: `[LY-P2] من أيّ صفوف كسبٍ استُهلكت النقاط (BR-L6.4 — الأقدم انتهاءً أولًا).
موجودٌ لأنّ الردّ يُعيد النقاط **إلى صفوفها** ولا يُعيدها كمنحةٍ جديدة (BR-L6.3 خطوة ٤):
نقطةٌ عمرها أحد عشر شهرًا يجب أن تعود بتاريخ انتهائها الأصلي، لا أن تُولد من جديد بسنة
كاملة. و\`expiresAtSnapshot\` محفوظٌ هنا ليُحسم شرطُ «غير المنتهية» بلا قراءة ثانية.`,
  },
);

export const LoyaltyRedemptionAllocationRelationsInputCreate = t.Object(
  {
    redemption: t.Object(
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
    ledgerEntry: t.Object(
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
    description: `[LY-P2] من أيّ صفوف كسبٍ استُهلكت النقاط (BR-L6.4 — الأقدم انتهاءً أولًا).
موجودٌ لأنّ الردّ يُعيد النقاط **إلى صفوفها** ولا يُعيدها كمنحةٍ جديدة (BR-L6.3 خطوة ٤):
نقطةٌ عمرها أحد عشر شهرًا يجب أن تعود بتاريخ انتهائها الأصلي، لا أن تُولد من جديد بسنة
كاملة. و\`expiresAtSnapshot\` محفوظٌ هنا ليُحسم شرطُ «غير المنتهية» بلا قراءة ثانية.`,
  },
);

export const LoyaltyRedemptionAllocationRelationsInputUpdate = t.Partial(
  t.Object(
    {
      redemption: t.Object(
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
      ledgerEntry: t.Object(
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
      description: `[LY-P2] من أيّ صفوف كسبٍ استُهلكت النقاط (BR-L6.4 — الأقدم انتهاءً أولًا).
موجودٌ لأنّ الردّ يُعيد النقاط **إلى صفوفها** ولا يُعيدها كمنحةٍ جديدة (BR-L6.3 خطوة ٤):
نقطةٌ عمرها أحد عشر شهرًا يجب أن تعود بتاريخ انتهائها الأصلي، لا أن تُولد من جديد بسنة
كاملة. و\`expiresAtSnapshot\` محفوظٌ هنا ليُحسم شرطُ «غير المنتهية» بلا قراءة ثانية.`,
    },
  ),
);

export const LoyaltyRedemptionAllocationWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          redemptionId: t.String(),
          ledgerEntryId: t.String({ description: `صفّ الكسب المستهلَك منه` }),
          points: t.Integer(),
          expiresAtSnapshot: t.Date({
            description: `لقطة \`expiresAt\` لصفّ الكسب وقت التخصيص — شرطُ الردّ (BR-L6.3 خطوة ٤)`,
          }),
        },
        {
          additionalProperties: false,
          description: `[LY-P2] من أيّ صفوف كسبٍ استُهلكت النقاط (BR-L6.4 — الأقدم انتهاءً أولًا).
موجودٌ لأنّ الردّ يُعيد النقاط **إلى صفوفها** ولا يُعيدها كمنحةٍ جديدة (BR-L6.3 خطوة ٤):
نقطةٌ عمرها أحد عشر شهرًا يجب أن تعود بتاريخ انتهائها الأصلي، لا أن تُولد من جديد بسنة
كاملة. و\`expiresAtSnapshot\` محفوظٌ هنا ليُحسم شرطُ «غير المنتهية» بلا قراءة ثانية.`,
        },
      ),
    { $id: "LoyaltyRedemptionAllocation" },
  ),
);

export const LoyaltyRedemptionAllocationWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.String() },
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
              redemptionId: t.String(),
              ledgerEntryId: t.String({
                description: `صفّ الكسب المستهلَك منه`,
              }),
              points: t.Integer(),
              expiresAtSnapshot: t.Date({
                description: `لقطة \`expiresAt\` لصفّ الكسب وقت التخصيص — شرطُ الردّ (BR-L6.3 خطوة ٤)`,
              }),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "LoyaltyRedemptionAllocation" },
);

export const LoyaltyRedemptionAllocationSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      redemptionId: t.Boolean(),
      ledgerEntryId: t.Boolean(),
      points: t.Boolean(),
      expiresAtSnapshot: t.Boolean(),
      redemption: t.Boolean(),
      ledgerEntry: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `[LY-P2] من أيّ صفوف كسبٍ استُهلكت النقاط (BR-L6.4 — الأقدم انتهاءً أولًا).
موجودٌ لأنّ الردّ يُعيد النقاط **إلى صفوفها** ولا يُعيدها كمنحةٍ جديدة (BR-L6.3 خطوة ٤):
نقطةٌ عمرها أحد عشر شهرًا يجب أن تعود بتاريخ انتهائها الأصلي، لا أن تُولد من جديد بسنة
كاملة. و\`expiresAtSnapshot\` محفوظٌ هنا ليُحسم شرطُ «غير المنتهية» بلا قراءة ثانية.`,
    },
  ),
);

export const LoyaltyRedemptionAllocationInclude = t.Partial(
  t.Object(
    { redemption: t.Boolean(), ledgerEntry: t.Boolean(), _count: t.Boolean() },
    {
      additionalProperties: false,
      description: `[LY-P2] من أيّ صفوف كسبٍ استُهلكت النقاط (BR-L6.4 — الأقدم انتهاءً أولًا).
موجودٌ لأنّ الردّ يُعيد النقاط **إلى صفوفها** ولا يُعيدها كمنحةٍ جديدة (BR-L6.3 خطوة ٤):
نقطةٌ عمرها أحد عشر شهرًا يجب أن تعود بتاريخ انتهائها الأصلي، لا أن تُولد من جديد بسنة
كاملة. و\`expiresAtSnapshot\` محفوظٌ هنا ليُحسم شرطُ «غير المنتهية» بلا قراءة ثانية.`,
    },
  ),
);

export const LoyaltyRedemptionAllocationOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      redemptionId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      ledgerEntryId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      points: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      expiresAtSnapshot: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    {
      additionalProperties: false,
      description: `[LY-P2] من أيّ صفوف كسبٍ استُهلكت النقاط (BR-L6.4 — الأقدم انتهاءً أولًا).
موجودٌ لأنّ الردّ يُعيد النقاط **إلى صفوفها** ولا يُعيدها كمنحةٍ جديدة (BR-L6.3 خطوة ٤):
نقطةٌ عمرها أحد عشر شهرًا يجب أن تعود بتاريخ انتهائها الأصلي، لا أن تُولد من جديد بسنة
كاملة. و\`expiresAtSnapshot\` محفوظٌ هنا ليُحسم شرطُ «غير المنتهية» بلا قراءة ثانية.`,
    },
  ),
);

export const LoyaltyRedemptionAllocation = t.Composite(
  [LoyaltyRedemptionAllocationPlain, LoyaltyRedemptionAllocationRelations],
  { additionalProperties: false },
);

export const LoyaltyRedemptionAllocationInputCreate = t.Composite(
  [
    LoyaltyRedemptionAllocationPlainInputCreate,
    LoyaltyRedemptionAllocationRelationsInputCreate,
  ],
  { additionalProperties: false },
);

export const LoyaltyRedemptionAllocationInputUpdate = t.Composite(
  [
    LoyaltyRedemptionAllocationPlainInputUpdate,
    LoyaltyRedemptionAllocationRelationsInputUpdate,
  ],
  { additionalProperties: false },
);
