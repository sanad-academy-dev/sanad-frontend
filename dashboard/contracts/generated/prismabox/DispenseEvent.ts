import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const DispenseEventPlain = t.Object(
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
);

export const DispenseEventRelations = t.Object(
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
    prescriptionItem: t.Object(
      {
        id: t.String(),
        prescriptionId: t.String(),
        idx: t.Integer(),
        inventoryItemId: __nullable__(
          t.String({
            description: `أحد ثلاثة يُحلّ: صنف مخزون، أو مستحضر مسجَّل بلا مخزون، أو نصّ حرّ. نفس
تسامح \`appointment_product\` مع الصنف الحرّ — الطبيب قد يصف ما لا تبيعه العيادة.`,
          }),
        ),
        catalogProductId: __nullable__(t.String()),
        nameSnapshot: t.String(),
        doseAmount: __nullable__(t.Number()),
        doseUnit: __nullable__(t.String()),
        route: __nullable__(t.String()),
        frequency: __nullable__(t.String()),
        durationDays: __nullable__(t.Integer()),
        quantity: t.Number({
          description: `ما يستهلكه الصرف والفوترة (BR-P4.2.1)`,
        }),
        quantityUnit: t.String(),
        prn: t.Boolean(),
        instructionsAr: t.String(),
        refillsAllowed: t.Integer(),
        refillsUsed: t.Integer(),
        doseSource: t.Union(
          [t.Literal("CALCULATED"), t.Literal("MANUAL"), t.Literal("OVERRIDE")],
          {
            additionalProperties: false,
            description: `مصدر الجرعة المكتوبة — يُحفظ دائمًا ويُعرض على البند. الفرق بين «حسبها النظام»
و«كتبها الطبيب» و«تجاوز المدى الموثّق» ليس بيانات وصفية: هو ما يجعل سجل
التجاوزات (§12.3) ممكنًا أصلًا.`,
          },
        ),
        overrideReasonAr: __nullable__(
          t.String({
            description: `سبب تجاوز المدى الموثّق — إلزامي عند \`doseSource = OVERRIDE\` (BR-P6.2).
التجاوز مسموح، والصمت عنه ليس كذلك.`,
          }),
        ),
        createdAt: t.Date(),
        updatedAt: t.Date(),
      },
      {
        additionalProperties: false,
        description: `[PH1] بند وصفة — BRD §4.2.`,
      },
    ),
    dispensedBy: __nullable__(
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
    warehouse: t.Object(
      {
        id: t.String(),
        code: t.String(),
        clinicId: t.String(),
        branchId: __nullable__(t.String()),
        name: t.String(),
        isDefault: t.Boolean(),
        isMobile: t.Boolean(),
        active: t.Boolean(),
        isDeleted: t.Boolean(),
        deletedAt: __nullable__(t.Date()),
        editsCount: t.Integer(),
        createdAt: t.Date(),
        updatedAt: t.Date(),
      },
      { additionalProperties: false },
    ),
    batch: __nullable__(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          itemId: t.String(),
          warehouseId: t.String(),
          batchNo: t.String(),
          expiryDate: __nullable__(t.Date()),
          productionDate: __nullable__(t.Date()),
          qty: t.Integer(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    ),
    controlledRegister: t.Array(
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
      { additionalProperties: false },
    ),
  },
  {
    additionalProperties: false,
    description: `[PH3.1] واقعة صرف — BRD_Pharmacy_Module.md §7.
**صفٌّ لكل واقعة، لا راية على البند.** \`appointment_product\` استعمل \`issuedAt\`
كحارس ضدّ الخصم المزدوج، وهو يكفي لصرفٍ يقع مرّة واحدة. الصرف هنا جزئيّ ومتكرّر
(إعادة صرف)، فالراية لا تكفي: الحارس هو وجود الصفّ نفسه، والمجموع يُقرأ من
الصفوف لا من عمود يُحدَّث (BR-P7.3.1، BR-P7.3.2).`,
  },
);

export const DispenseEventPlainInputCreate = t.Object(
  {
    quantity: t.Integer({
      description: `**بوحدات المخزون، صحيح** — لا \`Decimal\` كما في \`prescription_item.quantity\`.
دفتر المخزون كلّه \`Int\` (\`stock_ledger_entry.qtyChange\`، \`stock_batch.qty\`)،
وكسرُ ذلك هنا يعني رصيدًا لا يطابق الدفتر. والكمّية الموصوفة قد تكون كسرية
(٢٫٥ مل) بينما المصروف عبوات كاملة — وهما رقمان مختلفان بحقّ، فلا يُحوَّل
أحدهما إلى الآخر بتقريب صامت: الصيدلي يُدخل ما سلّمه فعلًا.`,
    }),
    batchNoSnapshot: t.Optional(__nullable__(t.String())),
    expiryDateSnapshot: t.Optional(__nullable__(t.Date())),
    isRefill: t.Optional(t.Boolean()),
    notesAr: t.Optional(__nullable__(t.String())),
    priceSnapshot: t.Optional(
      __nullable__(
        t.Number({
          description: `[IP3] سعر الوحدة لحظة الصرف. مسار الزيارة يأخذ لقطته في \`appointment_product\`؛
المصروف على إقامة تنويم لا صفّ له هناك، فاللقطة هنا كي تُقرأ فاتورة الإقامة
ما صُرف بسعر يومه لا بسعر الكتالوج يوم الخروج.`,
        }),
      ),
    ),
    dispensedAt: t.Optional(t.Date()),
  },
  {
    additionalProperties: false,
    description: `[PH3.1] واقعة صرف — BRD_Pharmacy_Module.md §7.
**صفٌّ لكل واقعة، لا راية على البند.** \`appointment_product\` استعمل \`issuedAt\`
كحارس ضدّ الخصم المزدوج، وهو يكفي لصرفٍ يقع مرّة واحدة. الصرف هنا جزئيّ ومتكرّر
(إعادة صرف)، فالراية لا تكفي: الحارس هو وجود الصفّ نفسه، والمجموع يُقرأ من
الصفوف لا من عمود يُحدَّث (BR-P7.3.1، BR-P7.3.2).`,
  },
);

export const DispenseEventPlainInputUpdate = t.Object(
  {
    quantity: t.Optional(
      t.Integer({
        description: `**بوحدات المخزون، صحيح** — لا \`Decimal\` كما في \`prescription_item.quantity\`.
دفتر المخزون كلّه \`Int\` (\`stock_ledger_entry.qtyChange\`، \`stock_batch.qty\`)،
وكسرُ ذلك هنا يعني رصيدًا لا يطابق الدفتر. والكمّية الموصوفة قد تكون كسرية
(٢٫٥ مل) بينما المصروف عبوات كاملة — وهما رقمان مختلفان بحقّ، فلا يُحوَّل
أحدهما إلى الآخر بتقريب صامت: الصيدلي يُدخل ما سلّمه فعلًا.`,
      }),
    ),
    batchNoSnapshot: t.Optional(__nullable__(t.String())),
    expiryDateSnapshot: t.Optional(__nullable__(t.Date())),
    isRefill: t.Optional(t.Boolean()),
    notesAr: t.Optional(__nullable__(t.String())),
    priceSnapshot: t.Optional(
      __nullable__(
        t.Number({
          description: `[IP3] سعر الوحدة لحظة الصرف. مسار الزيارة يأخذ لقطته في \`appointment_product\`؛
المصروف على إقامة تنويم لا صفّ له هناك، فاللقطة هنا كي تُقرأ فاتورة الإقامة
ما صُرف بسعر يومه لا بسعر الكتالوج يوم الخروج.`,
        }),
      ),
    ),
    dispensedAt: t.Optional(t.Date()),
  },
  {
    additionalProperties: false,
    description: `[PH3.1] واقعة صرف — BRD_Pharmacy_Module.md §7.
**صفٌّ لكل واقعة، لا راية على البند.** \`appointment_product\` استعمل \`issuedAt\`
كحارس ضدّ الخصم المزدوج، وهو يكفي لصرفٍ يقع مرّة واحدة. الصرف هنا جزئيّ ومتكرّر
(إعادة صرف)، فالراية لا تكفي: الحارس هو وجود الصفّ نفسه، والمجموع يُقرأ من
الصفوف لا من عمود يُحدَّث (BR-P7.3.1، BR-P7.3.2).`,
  },
);

export const DispenseEventRelationsInputCreate = t.Object(
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
    prescriptionItem: t.Object(
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
    dispensedBy: t.Optional(
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
    warehouse: t.Object(
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
    batch: t.Optional(
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
    controlledRegister: t.Optional(
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
    description: `[PH3.1] واقعة صرف — BRD_Pharmacy_Module.md §7.
**صفٌّ لكل واقعة، لا راية على البند.** \`appointment_product\` استعمل \`issuedAt\`
كحارس ضدّ الخصم المزدوج، وهو يكفي لصرفٍ يقع مرّة واحدة. الصرف هنا جزئيّ ومتكرّر
(إعادة صرف)، فالراية لا تكفي: الحارس هو وجود الصفّ نفسه، والمجموع يُقرأ من
الصفوف لا من عمود يُحدَّث (BR-P7.3.1، BR-P7.3.2).`,
  },
);

export const DispenseEventRelationsInputUpdate = t.Partial(
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
      prescriptionItem: t.Object(
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
      dispensedBy: t.Partial(
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
      warehouse: t.Object(
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
      batch: t.Partial(
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
      controlledRegister: t.Partial(
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
      description: `[PH3.1] واقعة صرف — BRD_Pharmacy_Module.md §7.
**صفٌّ لكل واقعة، لا راية على البند.** \`appointment_product\` استعمل \`issuedAt\`
كحارس ضدّ الخصم المزدوج، وهو يكفي لصرفٍ يقع مرّة واحدة. الصرف هنا جزئيّ ومتكرّر
(إعادة صرف)، فالراية لا تكفي: الحارس هو وجود الصفّ نفسه، والمجموع يُقرأ من
الصفوف لا من عمود يُحدَّث (BR-P7.3.1، BR-P7.3.2).`,
    },
  ),
);

export const DispenseEventWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          clinicId: t.String(),
          prescriptionItemId: t.String(),
          dispensedById: t.String(),
          warehouseId: t.String(),
          quantity: t.Integer({
            description: `**بوحدات المخزون، صحيح** — لا \`Decimal\` كما في \`prescription_item.quantity\`.
دفتر المخزون كلّه \`Int\` (\`stock_ledger_entry.qtyChange\`، \`stock_batch.qty\`)،
وكسرُ ذلك هنا يعني رصيدًا لا يطابق الدفتر. والكمّية الموصوفة قد تكون كسرية
(٢٫٥ مل) بينما المصروف عبوات كاملة — وهما رقمان مختلفان بحقّ، فلا يُحوَّل
أحدهما إلى الآخر بتقريب صامت: الصيدلي يُدخل ما سلّمه فعلًا.`,
          }),
          batchId: t.String({
            description: `لقطة الدفعة — تبقى ولو حُذف صفّ الدفعة لاحقًا. الملصق يطبع ما خرج فعلًا (§9.3)`,
          }),
          batchNoSnapshot: t.String(),
          expiryDateSnapshot: t.Date(),
          isRefill: t.Boolean(),
          notesAr: t.String(),
          priceSnapshot: t.Number({
            description: `[IP3] سعر الوحدة لحظة الصرف. مسار الزيارة يأخذ لقطته في \`appointment_product\`؛
المصروف على إقامة تنويم لا صفّ له هناك، فاللقطة هنا كي تُقرأ فاتورة الإقامة
ما صُرف بسعر يومه لا بسعر الكتالوج يوم الخروج.`,
          }),
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
    { $id: "DispenseEvent" },
  ),
);

export const DispenseEventWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.String() },
            {
              additionalProperties: false,
              description: `[PH3.1] واقعة صرف — BRD_Pharmacy_Module.md §7.
**صفٌّ لكل واقعة، لا راية على البند.** \`appointment_product\` استعمل \`issuedAt\`
كحارس ضدّ الخصم المزدوج، وهو يكفي لصرفٍ يقع مرّة واحدة. الصرف هنا جزئيّ ومتكرّر
(إعادة صرف)، فالراية لا تكفي: الحارس هو وجود الصفّ نفسه، والمجموع يُقرأ من
الصفوف لا من عمود يُحدَّث (BR-P7.3.1، BR-P7.3.2).`,
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
              prescriptionItemId: t.String(),
              dispensedById: t.String(),
              warehouseId: t.String(),
              quantity: t.Integer({
                description: `**بوحدات المخزون، صحيح** — لا \`Decimal\` كما في \`prescription_item.quantity\`.
دفتر المخزون كلّه \`Int\` (\`stock_ledger_entry.qtyChange\`، \`stock_batch.qty\`)،
وكسرُ ذلك هنا يعني رصيدًا لا يطابق الدفتر. والكمّية الموصوفة قد تكون كسرية
(٢٫٥ مل) بينما المصروف عبوات كاملة — وهما رقمان مختلفان بحقّ، فلا يُحوَّل
أحدهما إلى الآخر بتقريب صامت: الصيدلي يُدخل ما سلّمه فعلًا.`,
              }),
              batchId: t.String({
                description: `لقطة الدفعة — تبقى ولو حُذف صفّ الدفعة لاحقًا. الملصق يطبع ما خرج فعلًا (§9.3)`,
              }),
              batchNoSnapshot: t.String(),
              expiryDateSnapshot: t.Date(),
              isRefill: t.Boolean(),
              notesAr: t.String(),
              priceSnapshot: t.Number({
                description: `[IP3] سعر الوحدة لحظة الصرف. مسار الزيارة يأخذ لقطته في \`appointment_product\`؛
المصروف على إقامة تنويم لا صفّ له هناك، فاللقطة هنا كي تُقرأ فاتورة الإقامة
ما صُرف بسعر يومه لا بسعر الكتالوج يوم الخروج.`,
              }),
              dispensedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "DispenseEvent" },
);

export const DispenseEventSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      clinicId: t.Boolean(),
      prescriptionItemId: t.Boolean(),
      dispensedById: t.Boolean(),
      warehouseId: t.Boolean(),
      quantity: t.Boolean(),
      batchId: t.Boolean(),
      batchNoSnapshot: t.Boolean(),
      expiryDateSnapshot: t.Boolean(),
      isRefill: t.Boolean(),
      notesAr: t.Boolean(),
      priceSnapshot: t.Boolean(),
      dispensedAt: t.Boolean(),
      clinic: t.Boolean(),
      prescriptionItem: t.Boolean(),
      dispensedBy: t.Boolean(),
      warehouse: t.Boolean(),
      batch: t.Boolean(),
      controlledRegister: t.Boolean(),
      _count: t.Boolean(),
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
);

export const DispenseEventInclude = t.Partial(
  t.Object(
    {
      clinic: t.Boolean(),
      prescriptionItem: t.Boolean(),
      dispensedBy: t.Boolean(),
      warehouse: t.Boolean(),
      batch: t.Boolean(),
      controlledRegister: t.Boolean(),
      _count: t.Boolean(),
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
);

export const DispenseEventOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clinicId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      prescriptionItemId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      dispensedById: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      warehouseId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      quantity: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      batchId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      batchNoSnapshot: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      expiryDateSnapshot: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      isRefill: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      notesAr: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      priceSnapshot: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      dispensedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
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
);

export const DispenseEvent = t.Composite(
  [DispenseEventPlain, DispenseEventRelations],
  { additionalProperties: false },
);

export const DispenseEventInputCreate = t.Composite(
  [DispenseEventPlainInputCreate, DispenseEventRelationsInputCreate],
  { additionalProperties: false },
);

export const DispenseEventInputUpdate = t.Composite(
  [DispenseEventPlainInputUpdate, DispenseEventRelationsInputUpdate],
  { additionalProperties: false },
);
