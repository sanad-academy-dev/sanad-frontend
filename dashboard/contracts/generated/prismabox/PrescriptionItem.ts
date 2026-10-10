import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const PrescriptionItemPlain = t.Object(
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
  { additionalProperties: false, description: `[PH1] بند وصفة — BRD §4.2.` },
);

export const PrescriptionItemRelations = t.Object(
  {
    prescription: t.Object(
      {
        id: t.String(),
        code: t.String(),
        clinicId: t.String(),
        patientId: t.String(),
        appointmentId: __nullable__(t.String()),
        inpatientStayId: __nullable__(
          t.String({
            description: `[IP3] وُصفت من داخل إقامة تنويم: تُصرف بلا سداد وتُحاسَب على فاتورة الإقامة،
وصرفُها هو ما يُنشئ أمر ورقة العلاج. عمود قياسيّ بلا علاقة Prisma عن قصد —
نفس سبب \`LabTestOrder.inpatientStayId\`.`,
          }),
        ),
        prescriberId: __nullable__(t.String()),
        status: t.Union(
          [
            t.Literal("DRAFT"),
            t.Literal("ACTIVE"),
            t.Literal("COMPLETED"),
            t.Literal("CANCELLED"),
          ],
          { additionalProperties: false },
        ),
        weightKgSnapshot: __nullable__(
          t.Number({
            description: `لقطة الوزن التي حُسبت عليها الجرعات، مع وقت قياسه. الوزن يتغيّر، والوصفة
المطبوعة لا؛ فبدون اللقطة تصير مراجعة جرعة قديمة مستحيلة. المصدر
\`VitalSignsRecord\` وحده — لا \`Patient.weight\` (§5.2).`,
          }),
        ),
        weightRecordedAt: __nullable__(t.Date()),
        notesAr: __nullable__(t.String()),
        issuedAt: __nullable__(t.Date()),
        cancelledAt: __nullable__(t.Date()),
        cancelReasonAr: __nullable__(t.String()),
        createdAt: t.Date(),
        updatedAt: t.Date(),
      },
      {
        additionalProperties: false,
        description: `[PH1] وصفة طبية — BRD_Pharmacy_Module.md §4.`,
      },
    ),
    inventoryItem: __nullable__(
      t.Object(
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
    ),
    catalogProduct: __nullable__(
      t.Object(
        {
          id: t.String(),
          standardId: t.String(),
          registerNumber: t.String(),
          tradeName: t.String(),
          tradeNameAr: __nullable__(t.String()),
          genericName: t.String(),
          genericNameAr: __nullable__(t.String()),
          genericKey: t.String(),
          strength: __nullable__(t.String()),
          strengthUnit: __nullable__(t.String()),
          dosageForm: __nullable__(t.String()),
          routeOfAdministration: __nullable__(t.String()),
          packageType: __nullable__(t.String()),
          packageSize: __nullable__(t.String()),
          packageUnit: __nullable__(t.String()),
          drugType: __nullable__(t.String()),
          subType: __nullable__(t.String()),
          legalStatus: __nullable__(t.String()),
          authorizationStatus: __nullable__(t.String()),
          marketingStatus: __nullable__(t.String()),
          shelfLifeMonths: __nullable__(t.Integer()),
          storageConditions: __nullable__(t.String()),
          manufacturerName: __nullable__(t.String()),
          manufacturerCountry: __nullable__(t.String()),
          marketingCompany: __nullable__(t.String()),
          agentName: __nullable__(t.String()),
          atcVetCode: __nullable__(t.String()),
          distributionArea: __nullable__(t.String()),
          registrationYear: __nullable__(t.Integer()),
          withdrawalPeriod: __nullable__(t.String()),
          targetAnimalsRaw: __nullable__(t.String()),
          allSpecies: t.Boolean(),
          therapeuticClassCode: __nullable__(t.String()),
          searchText: t.String(),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    ),
    dispenseEvents: t.Array(
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
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false, description: `[PH1] بند وصفة — BRD §4.2.` },
);

export const PrescriptionItemPlainInputCreate = t.Object(
  {
    idx: t.Integer(),
    nameSnapshot: t.String(),
    doseAmount: t.Optional(__nullable__(t.Number())),
    doseUnit: t.Optional(__nullable__(t.String())),
    route: t.Optional(__nullable__(t.String())),
    frequency: t.Optional(__nullable__(t.String())),
    durationDays: t.Optional(__nullable__(t.Integer())),
    quantity: t.Number({
      description: `ما يستهلكه الصرف والفوترة (BR-P4.2.1)`,
    }),
    quantityUnit: t.String(),
    prn: t.Optional(t.Boolean()),
    instructionsAr: t.String(),
    refillsAllowed: t.Optional(t.Integer()),
    refillsUsed: t.Optional(t.Integer()),
    doseSource: t.Optional(
      t.Union(
        [t.Literal("CALCULATED"), t.Literal("MANUAL"), t.Literal("OVERRIDE")],
        {
          additionalProperties: false,
          description: `مصدر الجرعة المكتوبة — يُحفظ دائمًا ويُعرض على البند. الفرق بين «حسبها النظام»
و«كتبها الطبيب» و«تجاوز المدى الموثّق» ليس بيانات وصفية: هو ما يجعل سجل
التجاوزات (§12.3) ممكنًا أصلًا.`,
        },
      ),
    ),
    overrideReasonAr: t.Optional(
      __nullable__(
        t.String({
          description: `سبب تجاوز المدى الموثّق — إلزامي عند \`doseSource = OVERRIDE\` (BR-P6.2).
التجاوز مسموح، والصمت عنه ليس كذلك.`,
        }),
      ),
    ),
  },
  { additionalProperties: false, description: `[PH1] بند وصفة — BRD §4.2.` },
);

export const PrescriptionItemPlainInputUpdate = t.Object(
  {
    idx: t.Optional(t.Integer()),
    nameSnapshot: t.Optional(t.String()),
    doseAmount: t.Optional(__nullable__(t.Number())),
    doseUnit: t.Optional(__nullable__(t.String())),
    route: t.Optional(__nullable__(t.String())),
    frequency: t.Optional(__nullable__(t.String())),
    durationDays: t.Optional(__nullable__(t.Integer())),
    quantity: t.Optional(
      t.Number({ description: `ما يستهلكه الصرف والفوترة (BR-P4.2.1)` }),
    ),
    quantityUnit: t.Optional(t.String()),
    prn: t.Optional(t.Boolean()),
    instructionsAr: t.Optional(t.String()),
    refillsAllowed: t.Optional(t.Integer()),
    refillsUsed: t.Optional(t.Integer()),
    doseSource: t.Optional(
      t.Union(
        [t.Literal("CALCULATED"), t.Literal("MANUAL"), t.Literal("OVERRIDE")],
        {
          additionalProperties: false,
          description: `مصدر الجرعة المكتوبة — يُحفظ دائمًا ويُعرض على البند. الفرق بين «حسبها النظام»
و«كتبها الطبيب» و«تجاوز المدى الموثّق» ليس بيانات وصفية: هو ما يجعل سجل
التجاوزات (§12.3) ممكنًا أصلًا.`,
        },
      ),
    ),
    overrideReasonAr: t.Optional(
      __nullable__(
        t.String({
          description: `سبب تجاوز المدى الموثّق — إلزامي عند \`doseSource = OVERRIDE\` (BR-P6.2).
التجاوز مسموح، والصمت عنه ليس كذلك.`,
        }),
      ),
    ),
  },
  { additionalProperties: false, description: `[PH1] بند وصفة — BRD §4.2.` },
);

export const PrescriptionItemRelationsInputCreate = t.Object(
  {
    prescription: t.Object(
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
    inventoryItem: t.Optional(
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
    catalogProduct: t.Optional(
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
    dispenseEvents: t.Optional(
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
  { additionalProperties: false, description: `[PH1] بند وصفة — BRD §4.2.` },
);

export const PrescriptionItemRelationsInputUpdate = t.Partial(
  t.Object(
    {
      prescription: t.Object(
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
      inventoryItem: t.Partial(
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
      catalogProduct: t.Partial(
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
      dispenseEvents: t.Partial(
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
    { additionalProperties: false, description: `[PH1] بند وصفة — BRD §4.2.` },
  ),
);

export const PrescriptionItemWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          prescriptionId: t.String(),
          idx: t.Integer(),
          inventoryItemId: t.String({
            description: `أحد ثلاثة يُحلّ: صنف مخزون، أو مستحضر مسجَّل بلا مخزون، أو نصّ حرّ. نفس
تسامح \`appointment_product\` مع الصنف الحرّ — الطبيب قد يصف ما لا تبيعه العيادة.`,
          }),
          catalogProductId: t.String(),
          nameSnapshot: t.String(),
          doseAmount: t.Number(),
          doseUnit: t.String(),
          route: t.String(),
          frequency: t.String(),
          durationDays: t.Integer(),
          quantity: t.Number({
            description: `ما يستهلكه الصرف والفوترة (BR-P4.2.1)`,
          }),
          quantityUnit: t.String(),
          prn: t.Boolean(),
          instructionsAr: t.String(),
          refillsAllowed: t.Integer(),
          refillsUsed: t.Integer(),
          doseSource: t.Union(
            [
              t.Literal("CALCULATED"),
              t.Literal("MANUAL"),
              t.Literal("OVERRIDE"),
            ],
            {
              additionalProperties: false,
              description: `مصدر الجرعة المكتوبة — يُحفظ دائمًا ويُعرض على البند. الفرق بين «حسبها النظام»
و«كتبها الطبيب» و«تجاوز المدى الموثّق» ليس بيانات وصفية: هو ما يجعل سجل
التجاوزات (§12.3) ممكنًا أصلًا.`,
            },
          ),
          overrideReasonAr: t.String({
            description: `سبب تجاوز المدى الموثّق — إلزامي عند \`doseSource = OVERRIDE\` (BR-P6.2).
التجاوز مسموح، والصمت عنه ليس كذلك.`,
          }),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `[PH1] بند وصفة — BRD §4.2.`,
        },
      ),
    { $id: "PrescriptionItem" },
  ),
);

export const PrescriptionItemWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            {
              id: t.String(),
              prescriptionId_idx: t.Object(
                { prescriptionId: t.String(), idx: t.Integer() },
                { additionalProperties: false },
              ),
            },
            {
              additionalProperties: false,
              description: `[PH1] بند وصفة — BRD §4.2.`,
            },
          ),
          { additionalProperties: false },
        ),
        t.Union(
          [
            t.Object({ id: t.String() }),
            t.Object({
              prescriptionId_idx: t.Object(
                { prescriptionId: t.String(), idx: t.Integer() },
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
              prescriptionId: t.String(),
              idx: t.Integer(),
              inventoryItemId: t.String({
                description: `أحد ثلاثة يُحلّ: صنف مخزون، أو مستحضر مسجَّل بلا مخزون، أو نصّ حرّ. نفس
تسامح \`appointment_product\` مع الصنف الحرّ — الطبيب قد يصف ما لا تبيعه العيادة.`,
              }),
              catalogProductId: t.String(),
              nameSnapshot: t.String(),
              doseAmount: t.Number(),
              doseUnit: t.String(),
              route: t.String(),
              frequency: t.String(),
              durationDays: t.Integer(),
              quantity: t.Number({
                description: `ما يستهلكه الصرف والفوترة (BR-P4.2.1)`,
              }),
              quantityUnit: t.String(),
              prn: t.Boolean(),
              instructionsAr: t.String(),
              refillsAllowed: t.Integer(),
              refillsUsed: t.Integer(),
              doseSource: t.Union(
                [
                  t.Literal("CALCULATED"),
                  t.Literal("MANUAL"),
                  t.Literal("OVERRIDE"),
                ],
                {
                  additionalProperties: false,
                  description: `مصدر الجرعة المكتوبة — يُحفظ دائمًا ويُعرض على البند. الفرق بين «حسبها النظام»
و«كتبها الطبيب» و«تجاوز المدى الموثّق» ليس بيانات وصفية: هو ما يجعل سجل
التجاوزات (§12.3) ممكنًا أصلًا.`,
                },
              ),
              overrideReasonAr: t.String({
                description: `سبب تجاوز المدى الموثّق — إلزامي عند \`doseSource = OVERRIDE\` (BR-P6.2).
التجاوز مسموح، والصمت عنه ليس كذلك.`,
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
  { $id: "PrescriptionItem" },
);

export const PrescriptionItemSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      prescriptionId: t.Boolean(),
      idx: t.Boolean(),
      inventoryItemId: t.Boolean(),
      catalogProductId: t.Boolean(),
      nameSnapshot: t.Boolean(),
      doseAmount: t.Boolean(),
      doseUnit: t.Boolean(),
      route: t.Boolean(),
      frequency: t.Boolean(),
      durationDays: t.Boolean(),
      quantity: t.Boolean(),
      quantityUnit: t.Boolean(),
      prn: t.Boolean(),
      instructionsAr: t.Boolean(),
      refillsAllowed: t.Boolean(),
      refillsUsed: t.Boolean(),
      doseSource: t.Boolean(),
      overrideReasonAr: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      prescription: t.Boolean(),
      inventoryItem: t.Boolean(),
      catalogProduct: t.Boolean(),
      dispenseEvents: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false, description: `[PH1] بند وصفة — BRD §4.2.` },
  ),
);

export const PrescriptionItemInclude = t.Partial(
  t.Object(
    {
      doseSource: t.Boolean(),
      prescription: t.Boolean(),
      inventoryItem: t.Boolean(),
      catalogProduct: t.Boolean(),
      dispenseEvents: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false, description: `[PH1] بند وصفة — BRD §4.2.` },
  ),
);

export const PrescriptionItemOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      prescriptionId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      idx: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      inventoryItemId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      catalogProductId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      nameSnapshot: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      doseAmount: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      doseUnit: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      route: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      frequency: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      durationDays: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      quantity: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      quantityUnit: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      prn: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      instructionsAr: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      refillsAllowed: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      refillsUsed: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      overrideReasonAr: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      updatedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false, description: `[PH1] بند وصفة — BRD §4.2.` },
  ),
);

export const PrescriptionItem = t.Composite(
  [PrescriptionItemPlain, PrescriptionItemRelations],
  { additionalProperties: false },
);

export const PrescriptionItemInputCreate = t.Composite(
  [PrescriptionItemPlainInputCreate, PrescriptionItemRelationsInputCreate],
  { additionalProperties: false },
);

export const PrescriptionItemInputUpdate = t.Composite(
  [PrescriptionItemPlainInputUpdate, PrescriptionItemRelationsInputUpdate],
  { additionalProperties: false },
);
