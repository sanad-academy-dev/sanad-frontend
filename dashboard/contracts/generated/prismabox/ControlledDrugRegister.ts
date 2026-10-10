import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const ControlledDrugRegisterPlain = t.Object(
  {
    id: t.String(),
    clinicId: t.String(),
    inventoryItemId: t.String(),
    movementType: t.Union(
      [
        t.Literal("RECEIPT"),
        t.Literal("DISPENSE"),
        t.Literal("WASTE"),
        t.Literal("ADJUSTMENT"),
        t.Literal("TRANSFER"),
      ],
      { additionalProperties: false },
    ),
    quantity: t.Integer({
      description: `موجب للإدخال وسالب للإخراج — التوقيع في الرقم لا في نوع الحركة، فيبقى
المجموع الجاري قابلًا للحساب بجمع واحد`,
    }),
    balanceAfter: t.Integer({
      description: `الرصيد بعد هذه الحركة — يُحفظ ولا يُحسب لاحقًا: صفٌّ يُدرَج بأثر رجعي
(تاريخ سابق) لا يجوز أن يعيد كتابة أرصدة صفوف موقَّعة قبله`,
    }),
    dispenseEventId: __nullable__(t.String()),
    patientId: __nullable__(t.String()),
    prescriberId: __nullable__(t.String()),
    performedById: __nullable__(t.String()),
    witnessId: __nullable__(
      t.String({
        description: `شاهد الإتلاف — يجب أن يختلف عن المنفِّذ (BRD §8.3). التوقيع المنفرد على
الإتلاف هو طريق التسريب الكلاسيكي، وإغلاقه سبب وجود السجل أصلًا.`,
      }),
    ),
    reasonAr: __nullable__(t.String()),
    occurredAt: t.Date({ description: `وقت الحدث الفعلي — قد يُؤرَّخ للخلف` }),
    recordedAt: t.Date({
      description: `وقت التسجيل — لا يُؤرَّخ للخلف أبدًا. الفارق بينهما هو ما يكشف التسجيل المتأخّر`,
    }),
  },
  {
    additionalProperties: false,
    description: `[PH4.2] سجل العهدة — **إلحاقيّ بحت** (BRD §8.1).
لا مسار تعديل ولا مسار حذف: التصحيح صفٌّ معاكس جديد، تمامًا كما تعامل وحدة
المحاسبة مستندًا مُرحَّلًا. سجلٌّ يمكن تعديله ليس سجل عهدة — هو مسوّدة تدّعي أنّها
سجل، والفرق هو كل قيمة السجل.`,
  },
);

export const ControlledDrugRegisterRelations = t.Object(
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
    inventoryItem: t.Object(
      {
        id: t.String(),
        code: t.String(),
        clinicId: t.String(),
        name: t.String(),
        category: t.Union(
          [
            t.Literal("ANTIBIOTIC"),
            t.Literal("ANTI_INFLAMMATORY"),
            t.Literal("VACCINE"),
            t.Literal("HORMONE"),
            t.Literal("SUPPLEMENT"),
            t.Literal("CRUSTACEAN"),
            t.Literal("SURGICAL_TOOLS"),
            t.Literal("SUPPLIES"),
          ],
          { additionalProperties: false },
        ),
        stock: t.Integer(),
        reorderPoint: t.Integer(),
        productionDate: __nullable__(t.Date()),
        expiryDate: __nullable__(t.Date()),
        price: t.Number(),
        unitCost: __nullable__(t.Number()),
        valuationRate: t.Number(),
        maxQuantity: __nullable__(t.Integer()),
        sku: __nullable__(t.String()),
        barcode: __nullable__(t.String()),
        supplier: __nullable__(t.String()),
        location: __nullable__(t.String()),
        notes: __nullable__(t.String()),
        tracksBatches: t.Boolean(),
        itemTaxTemplateId: __nullable__(t.String()),
        catalogProductId: __nullable__(t.String()),
        active: t.Boolean(),
        isDeleted: t.Boolean(),
        deletedAt: __nullable__(t.Date()),
        editsCount: t.Integer(),
        createdAt: t.Date(),
        updatedAt: t.Date(),
      },
      { additionalProperties: false },
    ),
    dispenseEvent: __nullable__(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          prescriptionItemId: t.String(),
          dispensedById: __nullable__(t.String()),
          warehouseId: t.String(),
          quantity: t.Integer({
            description: `**بوحدات المخزون، صحيح** — لا \`Decimal\` كما في \`prescription_item.quantity\`.
دفتر المخزون كلّه \`Int\` (\`stock_ledger_entry.qtyChange\`، \`stock_batch.qty\`)،
وكسرُ ذلك هنا يعني رصيدًا لا يطابق الدفتر. والكمّية الموصوفة قد تكون كسرية
(٢٫٥ مل) بينما المصروف عبوات كاملة — وهما رقمان مختلفان بحقّ، فلا يُحوَّل
أحدهما إلى الآخر بتقريب صامت: الصيدلي يُدخل ما سلّمه فعلًا.`,
          }),
          batchId: __nullable__(
            t.String({
              description: `لقطة الدفعة — تبقى ولو حُذف صفّ الدفعة لاحقًا. الملصق يطبع ما خرج فعلًا (§9.3)`,
            }),
          ),
          batchNoSnapshot: __nullable__(t.String()),
          expiryDateSnapshot: __nullable__(t.Date()),
          isRefill: t.Boolean(),
          notesAr: __nullable__(t.String()),
          priceSnapshot: __nullable__(
            t.Number({
              description: `[IP3] سعر الوحدة لحظة الصرف. مسار الزيارة يأخذ لقطته في \`appointment_product\`؛
المصروف على إقامة تنويم لا صفّ له هناك، فاللقطة هنا كي تُقرأ فاتورة الإقامة
ما صُرف بسعر يومه لا بسعر الكتالوج يوم الخروج.`,
            }),
          ),
          dispensedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `[PH3.1] واقعة صرف — BRD_Pharmacy_Module.md §7.
**صفٌّ لكل واقعة، لا راية على البند.** \`appointment_product\` استعمل \`issuedAt\`
كحارس ضدّ الخصم المزدوج، وهو يكفي لصرفٍ يقع مرّة واحدة. الصرف هنا جزئيّ ومتكرّر
(إعادة صرف)، فالراية لا تكفي: الحارس هو وجود الصفّ نفسه، والمجموع يُقرأ من
الصفوف لا من عمود يُحدَّث (BR-P7.3.1، BR-P7.3.2).`,
        },
      ),
    ),
    patient: __nullable__(
      t.Object(
        {
          id: t.String(),
          code: t.String(),
          clinicId: t.String(),
          ownerId: __nullable__(t.String()),
          name: t.String(),
          nameNormalized: t.String(),
          gender: t.Union(
            [t.Literal("MALE"), t.Literal("FEMALE"), t.Literal("UNKNOWN")],
            { additionalProperties: false },
          ),
          animalTypeId: t.String(),
          animalStrainId: __nullable__(t.String()),
          age: __nullable__(t.Number()),
          birthDate: __nullable__(t.Date()),
          weight: __nullable__(t.Number()),
          microchipNumber: __nullable__(t.String()),
          coat: __nullable__(t.String()),
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
    ),
    performedBy: __nullable__(
      t.Object(
        {
          id: t.String(),
          name: t.String(),
          email: t.String(),
          emailVerified: t.Boolean(),
          image: __nullable__(t.String()),
          phone: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    ),
    witness: __nullable__(
      t.Object(
        {
          id: t.String(),
          name: t.String(),
          email: t.String(),
          emailVerified: t.Boolean(),
          image: __nullable__(t.String()),
          phone: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    ),
  },
  {
    additionalProperties: false,
    description: `[PH4.2] سجل العهدة — **إلحاقيّ بحت** (BRD §8.1).
لا مسار تعديل ولا مسار حذف: التصحيح صفٌّ معاكس جديد، تمامًا كما تعامل وحدة
المحاسبة مستندًا مُرحَّلًا. سجلٌّ يمكن تعديله ليس سجل عهدة — هو مسوّدة تدّعي أنّها
سجل، والفرق هو كل قيمة السجل.`,
  },
);

export const ControlledDrugRegisterPlainInputCreate = t.Object(
  {
    movementType: t.Union(
      [
        t.Literal("RECEIPT"),
        t.Literal("DISPENSE"),
        t.Literal("WASTE"),
        t.Literal("ADJUSTMENT"),
        t.Literal("TRANSFER"),
      ],
      { additionalProperties: false },
    ),
    quantity: t.Integer({
      description: `موجب للإدخال وسالب للإخراج — التوقيع في الرقم لا في نوع الحركة، فيبقى
المجموع الجاري قابلًا للحساب بجمع واحد`,
    }),
    balanceAfter: t.Integer({
      description: `الرصيد بعد هذه الحركة — يُحفظ ولا يُحسب لاحقًا: صفٌّ يُدرَج بأثر رجعي
(تاريخ سابق) لا يجوز أن يعيد كتابة أرصدة صفوف موقَّعة قبله`,
    }),
    reasonAr: t.Optional(__nullable__(t.String())),
    occurredAt: t.Date({ description: `وقت الحدث الفعلي — قد يُؤرَّخ للخلف` }),
    recordedAt: t.Optional(
      t.Date({
        description: `وقت التسجيل — لا يُؤرَّخ للخلف أبدًا. الفارق بينهما هو ما يكشف التسجيل المتأخّر`,
      }),
    ),
  },
  {
    additionalProperties: false,
    description: `[PH4.2] سجل العهدة — **إلحاقيّ بحت** (BRD §8.1).
لا مسار تعديل ولا مسار حذف: التصحيح صفٌّ معاكس جديد، تمامًا كما تعامل وحدة
المحاسبة مستندًا مُرحَّلًا. سجلٌّ يمكن تعديله ليس سجل عهدة — هو مسوّدة تدّعي أنّها
سجل، والفرق هو كل قيمة السجل.`,
  },
);

export const ControlledDrugRegisterPlainInputUpdate = t.Object(
  {
    movementType: t.Optional(
      t.Union(
        [
          t.Literal("RECEIPT"),
          t.Literal("DISPENSE"),
          t.Literal("WASTE"),
          t.Literal("ADJUSTMENT"),
          t.Literal("TRANSFER"),
        ],
        { additionalProperties: false },
      ),
    ),
    quantity: t.Optional(
      t.Integer({
        description: `موجب للإدخال وسالب للإخراج — التوقيع في الرقم لا في نوع الحركة، فيبقى
المجموع الجاري قابلًا للحساب بجمع واحد`,
      }),
    ),
    balanceAfter: t.Optional(
      t.Integer({
        description: `الرصيد بعد هذه الحركة — يُحفظ ولا يُحسب لاحقًا: صفٌّ يُدرَج بأثر رجعي
(تاريخ سابق) لا يجوز أن يعيد كتابة أرصدة صفوف موقَّعة قبله`,
      }),
    ),
    reasonAr: t.Optional(__nullable__(t.String())),
    occurredAt: t.Optional(
      t.Date({ description: `وقت الحدث الفعلي — قد يُؤرَّخ للخلف` }),
    ),
    recordedAt: t.Optional(
      t.Date({
        description: `وقت التسجيل — لا يُؤرَّخ للخلف أبدًا. الفارق بينهما هو ما يكشف التسجيل المتأخّر`,
      }),
    ),
  },
  {
    additionalProperties: false,
    description: `[PH4.2] سجل العهدة — **إلحاقيّ بحت** (BRD §8.1).
لا مسار تعديل ولا مسار حذف: التصحيح صفٌّ معاكس جديد، تمامًا كما تعامل وحدة
المحاسبة مستندًا مُرحَّلًا. سجلٌّ يمكن تعديله ليس سجل عهدة — هو مسوّدة تدّعي أنّها
سجل، والفرق هو كل قيمة السجل.`,
  },
);

export const ControlledDrugRegisterRelationsInputCreate = t.Object(
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
    inventoryItem: t.Object(
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
    dispenseEvent: t.Optional(
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
    patient: t.Optional(
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
    performedBy: t.Optional(
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
    witness: t.Optional(
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
    description: `[PH4.2] سجل العهدة — **إلحاقيّ بحت** (BRD §8.1).
لا مسار تعديل ولا مسار حذف: التصحيح صفٌّ معاكس جديد، تمامًا كما تعامل وحدة
المحاسبة مستندًا مُرحَّلًا. سجلٌّ يمكن تعديله ليس سجل عهدة — هو مسوّدة تدّعي أنّها
سجل، والفرق هو كل قيمة السجل.`,
  },
);

export const ControlledDrugRegisterRelationsInputUpdate = t.Partial(
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
      inventoryItem: t.Object(
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
      dispenseEvent: t.Partial(
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
      patient: t.Partial(
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
      performedBy: t.Partial(
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
      witness: t.Partial(
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
      description: `[PH4.2] سجل العهدة — **إلحاقيّ بحت** (BRD §8.1).
لا مسار تعديل ولا مسار حذف: التصحيح صفٌّ معاكس جديد، تمامًا كما تعامل وحدة
المحاسبة مستندًا مُرحَّلًا. سجلٌّ يمكن تعديله ليس سجل عهدة — هو مسوّدة تدّعي أنّها
سجل، والفرق هو كل قيمة السجل.`,
    },
  ),
);

export const ControlledDrugRegisterWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          clinicId: t.String(),
          inventoryItemId: t.String(),
          movementType: t.Union(
            [
              t.Literal("RECEIPT"),
              t.Literal("DISPENSE"),
              t.Literal("WASTE"),
              t.Literal("ADJUSTMENT"),
              t.Literal("TRANSFER"),
            ],
            { additionalProperties: false },
          ),
          quantity: t.Integer({
            description: `موجب للإدخال وسالب للإخراج — التوقيع في الرقم لا في نوع الحركة، فيبقى
المجموع الجاري قابلًا للحساب بجمع واحد`,
          }),
          balanceAfter: t.Integer({
            description: `الرصيد بعد هذه الحركة — يُحفظ ولا يُحسب لاحقًا: صفٌّ يُدرَج بأثر رجعي
(تاريخ سابق) لا يجوز أن يعيد كتابة أرصدة صفوف موقَّعة قبله`,
          }),
          dispenseEventId: t.String(),
          patientId: t.String(),
          prescriberId: t.String(),
          performedById: t.String(),
          witnessId: t.String({
            description: `شاهد الإتلاف — يجب أن يختلف عن المنفِّذ (BRD §8.3). التوقيع المنفرد على
الإتلاف هو طريق التسريب الكلاسيكي، وإغلاقه سبب وجود السجل أصلًا.`,
          }),
          reasonAr: t.String(),
          occurredAt: t.Date({
            description: `وقت الحدث الفعلي — قد يُؤرَّخ للخلف`,
          }),
          recordedAt: t.Date({
            description: `وقت التسجيل — لا يُؤرَّخ للخلف أبدًا. الفارق بينهما هو ما يكشف التسجيل المتأخّر`,
          }),
        },
        {
          additionalProperties: false,
          description: `[PH4.2] سجل العهدة — **إلحاقيّ بحت** (BRD §8.1).
لا مسار تعديل ولا مسار حذف: التصحيح صفٌّ معاكس جديد، تمامًا كما تعامل وحدة
المحاسبة مستندًا مُرحَّلًا. سجلٌّ يمكن تعديله ليس سجل عهدة — هو مسوّدة تدّعي أنّها
سجل، والفرق هو كل قيمة السجل.`,
        },
      ),
    { $id: "ControlledDrugRegister" },
  ),
);

export const ControlledDrugRegisterWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.String() },
            {
              additionalProperties: false,
              description: `[PH4.2] سجل العهدة — **إلحاقيّ بحت** (BRD §8.1).
لا مسار تعديل ولا مسار حذف: التصحيح صفٌّ معاكس جديد، تمامًا كما تعامل وحدة
المحاسبة مستندًا مُرحَّلًا. سجلٌّ يمكن تعديله ليس سجل عهدة — هو مسوّدة تدّعي أنّها
سجل، والفرق هو كل قيمة السجل.`,
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
              inventoryItemId: t.String(),
              movementType: t.Union(
                [
                  t.Literal("RECEIPT"),
                  t.Literal("DISPENSE"),
                  t.Literal("WASTE"),
                  t.Literal("ADJUSTMENT"),
                  t.Literal("TRANSFER"),
                ],
                { additionalProperties: false },
              ),
              quantity: t.Integer({
                description: `موجب للإدخال وسالب للإخراج — التوقيع في الرقم لا في نوع الحركة، فيبقى
المجموع الجاري قابلًا للحساب بجمع واحد`,
              }),
              balanceAfter: t.Integer({
                description: `الرصيد بعد هذه الحركة — يُحفظ ولا يُحسب لاحقًا: صفٌّ يُدرَج بأثر رجعي
(تاريخ سابق) لا يجوز أن يعيد كتابة أرصدة صفوف موقَّعة قبله`,
              }),
              dispenseEventId: t.String(),
              patientId: t.String(),
              prescriberId: t.String(),
              performedById: t.String(),
              witnessId: t.String({
                description: `شاهد الإتلاف — يجب أن يختلف عن المنفِّذ (BRD §8.3). التوقيع المنفرد على
الإتلاف هو طريق التسريب الكلاسيكي، وإغلاقه سبب وجود السجل أصلًا.`,
              }),
              reasonAr: t.String(),
              occurredAt: t.Date({
                description: `وقت الحدث الفعلي — قد يُؤرَّخ للخلف`,
              }),
              recordedAt: t.Date({
                description: `وقت التسجيل — لا يُؤرَّخ للخلف أبدًا. الفارق بينهما هو ما يكشف التسجيل المتأخّر`,
              }),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "ControlledDrugRegister" },
);

export const ControlledDrugRegisterSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      clinicId: t.Boolean(),
      inventoryItemId: t.Boolean(),
      movementType: t.Boolean(),
      quantity: t.Boolean(),
      balanceAfter: t.Boolean(),
      dispenseEventId: t.Boolean(),
      patientId: t.Boolean(),
      prescriberId: t.Boolean(),
      performedById: t.Boolean(),
      witnessId: t.Boolean(),
      reasonAr: t.Boolean(),
      occurredAt: t.Boolean(),
      recordedAt: t.Boolean(),
      clinic: t.Boolean(),
      inventoryItem: t.Boolean(),
      dispenseEvent: t.Boolean(),
      patient: t.Boolean(),
      performedBy: t.Boolean(),
      witness: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `[PH4.2] سجل العهدة — **إلحاقيّ بحت** (BRD §8.1).
لا مسار تعديل ولا مسار حذف: التصحيح صفٌّ معاكس جديد، تمامًا كما تعامل وحدة
المحاسبة مستندًا مُرحَّلًا. سجلٌّ يمكن تعديله ليس سجل عهدة — هو مسوّدة تدّعي أنّها
سجل، والفرق هو كل قيمة السجل.`,
    },
  ),
);

export const ControlledDrugRegisterInclude = t.Partial(
  t.Object(
    {
      movementType: t.Boolean(),
      clinic: t.Boolean(),
      inventoryItem: t.Boolean(),
      dispenseEvent: t.Boolean(),
      patient: t.Boolean(),
      performedBy: t.Boolean(),
      witness: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `[PH4.2] سجل العهدة — **إلحاقيّ بحت** (BRD §8.1).
لا مسار تعديل ولا مسار حذف: التصحيح صفٌّ معاكس جديد، تمامًا كما تعامل وحدة
المحاسبة مستندًا مُرحَّلًا. سجلٌّ يمكن تعديله ليس سجل عهدة — هو مسوّدة تدّعي أنّها
سجل، والفرق هو كل قيمة السجل.`,
    },
  ),
);

export const ControlledDrugRegisterOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clinicId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      inventoryItemId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      quantity: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      balanceAfter: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      dispenseEventId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      patientId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      prescriberId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      performedById: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      witnessId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      reasonAr: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      occurredAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      recordedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    {
      additionalProperties: false,
      description: `[PH4.2] سجل العهدة — **إلحاقيّ بحت** (BRD §8.1).
لا مسار تعديل ولا مسار حذف: التصحيح صفٌّ معاكس جديد، تمامًا كما تعامل وحدة
المحاسبة مستندًا مُرحَّلًا. سجلٌّ يمكن تعديله ليس سجل عهدة — هو مسوّدة تدّعي أنّها
سجل، والفرق هو كل قيمة السجل.`,
    },
  ),
);

export const ControlledDrugRegister = t.Composite(
  [ControlledDrugRegisterPlain, ControlledDrugRegisterRelations],
  { additionalProperties: false },
);

export const ControlledDrugRegisterInputCreate = t.Composite(
  [
    ControlledDrugRegisterPlainInputCreate,
    ControlledDrugRegisterRelationsInputCreate,
  ],
  { additionalProperties: false },
);

export const ControlledDrugRegisterInputUpdate = t.Composite(
  [
    ControlledDrugRegisterPlainInputUpdate,
    ControlledDrugRegisterRelationsInputUpdate,
  ],
  { additionalProperties: false },
);
