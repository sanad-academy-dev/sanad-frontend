import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const WarehousePlain = t.Object(
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
);

export const WarehouseRelations = t.Object(
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
    branch: __nullable__(
      t.Object(
        {
          id: t.String(),
          branchCode: t.String(),
          clinicId: t.String(),
          name: t.String(),
          icon: __nullable__(t.String()),
          type: t.Union([t.Literal("PRIMARY"), t.Literal("SUB")], {
            additionalProperties: false,
          }),
          managerId: __nullable__(t.String()),
          email: __nullable__(t.String()),
          city: __nullable__(t.String()),
          phone: __nullable__(t.String()),
          address: __nullable__(t.String()),
          active: t.Boolean(),
          emergencyNotifications: t.Boolean(),
          settings: __nullable__(t.Any()),
          isDeleted: t.Boolean(),
          deletedAt: __nullable__(t.Date()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    ),
    stockLedgerEntries: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          itemId: t.String(),
          warehouseId: t.String(),
          batchId: __nullable__(t.String()),
          qtyChange: t.Integer(),
          balanceQty: t.Integer(),
          inRate: __nullable__(t.Number()),
          valuationRate: __nullable__(t.Number()),
          voucherType: t.Union(
            [
              t.Literal("OPENING"),
              t.Literal("RECEIPT"),
              t.Literal("ISSUE"),
              t.Literal("SALE"),
              t.Literal("SALE_RETURN"),
              t.Literal("ADJUSTMENT"),
              t.Literal("TRANSFER"),
              t.Literal("CARE_PLAN"),
              t.Literal("VACCINATION"),
              t.Literal("MOBILE_CLINIC"),
              t.Literal("PHARMACY_DISPENSE"),
              t.Literal("INPATIENT_ADMINISTRATION"),
            ],
            { additionalProperties: false },
          ),
          voucherId: __nullable__(t.String()),
          note: __nullable__(t.String()),
          createdById: __nullable__(t.String()),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    bins: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          itemId: t.String(),
          warehouseId: t.String(),
          qty: t.Integer(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    purchaseOrders: t.Array(
      t.Object(
        {
          id: t.String(),
          code: t.String(),
          clinicId: t.String(),
          supplierId: t.String(),
          warehouseId: t.String(),
          status: t.Union(
            [
              t.Literal("DRAFT"),
              t.Literal("ORDERED"),
              t.Literal("PARTIALLY_RECEIVED"),
              t.Literal("RECEIVED"),
              t.Literal("CANCELLED"),
            ],
            { additionalProperties: false },
          ),
          notes: __nullable__(t.String()),
          expectedAt: __nullable__(t.Date()),
          createdById: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    batches: t.Array(
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
      { additionalProperties: false },
    ),
    mobileUnit: __nullable__(
      t.Object(
        {
          id: t.String(),
          code: t.String(),
          clinicId: t.String(),
          branchId: t.String(),
          warehouseId: t.String(),
          name: t.String(),
          plateNumber: __nullable__(t.String()),
          vehicleMake: __nullable__(t.String()),
          vehicleModel: __nullable__(t.String()),
          year: __nullable__(t.Integer()),
          color: __nullable__(t.String()),
          photo: __nullable__(t.String()),
          status: t.Union(
            [
              t.Literal("OFFLINE"),
              t.Literal("AVAILABLE"),
              t.Literal("EN_ROUTE"),
              t.Literal("ON_SITE"),
              t.Literal("RETURNING"),
              t.Literal("ON_BREAK"),
              t.Literal("OUT_OF_SERVICE"),
            ],
            { additionalProperties: false },
          ),
          active: t.Boolean(),
          isDeleted: t.Boolean(),
          deletedAt: __nullable__(t.Date()),
          lastLat: __nullable__(t.Number()),
          lastLng: __nullable__(t.Number()),
          lastLocationAt: __nullable__(t.Date()),
          lastSpeedKph: __nullable__(t.Number()),
          lastHeading: __nullable__(t.Integer()),
          lastBatteryPct: __nullable__(t.Integer()),
          settings: __nullable__(t.Any()),
          notes: __nullable__(t.String()),
          editsCount: t.Integer(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    ),
    posProfiles: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          name: t.String(),
          warehouseId: __nullable__(t.String()),
          writeOffLimit: t.Number({
            description: `فرق النقد الذي يُقبل شطبه تلقائيًا عند الإقفال؛ ما فوقه يحتاج قرارًا`,
          }),
          writeOffAccountId: __nullable__(
            t.String({
              description: `حساب فروق النقد (زيادة/عجز الدرج) — بلا حساب يُرفض الإقفال بفارق`,
            }),
          ),
          disabled: t.Boolean(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `ملف نقطة بيع: الإعدادات التي تحكم طاولة الكاشير في هذه العيادة.`,
        },
      ),
      { additionalProperties: false },
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
    inpatientAdministrations: t.Array(
      t.Object(
        {
          id: t.String(),
          stayId: t.String(),
          orderId: t.String(),
          dueAt: t.Date(),
          status: t.Union(
            [
              t.Literal("PENDING"),
              t.Literal("GIVEN"),
              t.Literal("SKIPPED"),
              t.Literal("HELD"),
            ],
            {
              additionalProperties: false,
              description: `حالة صفّ الإعطاء الواحد. لا قيمة MISSED هنا عمدًا: الفائت اشتقاق من
(\`dueAt\` + المهلة < الآن) على صفٍّ ما زال PENDING. تخزينه يحتاج وظيفةً دوريّة
تكتبه — ولا مجدول في هذا المستودع — فيصبح الحقل كذبةً كلما نام النظام.`,
            },
          ),
          givenAt: __nullable__(t.Date()),
          performedById: __nullable__(t.String()),
          witnessId: __nullable__(
            t.String({
              description: `الشاهد — إلزامي للمواد المراقَبة، ويجب أن يختلف عن المنفّذ (قاعدة سجل المراقَبة)`,
            }),
          ),
          doseGivenAmount: __nullable__(t.Number()),
          doseGivenUnit: __nullable__(t.String()),
          stockQuantity: __nullable__(
            t.Integer({
              description: `الكمّية المخصومة من المخزون بوحدات المخزون — عدد صحيح عمدًا كما في
\`DispenseEvent.quantity\`: الجرعة السريرية (٢٥٠ مجم) والوحدة المخزنية
(أمبولة) رقمان مختلفان، وخلطُهما يجعل الصيدلية تختلف مع الدفتر إلى الأبد.
null = لم يُخصم مخزون (مراقبة، تغذية، صنف غير مرتبط).`,
            }),
          ),
          warehouseId: __nullable__(t.String()),
          priceSnapshot: __nullable__(
            t.Number({
              description: `سعر الوحدة لحظة الإعطاء — الفوترة تقرأه ولا تعود إلى الكتالوج`,
            }),
          ),
          batchId: __nullable__(
            t.String({
              description: `لقطة الدفعة كما في \`DispenseEvent\`: الدفعة قد تُحذف أو يتغيّر رقمها، وما
دخل جسم الحيوان لا يتغيّر.`,
            }),
          ),
          batchNoSnapshot: __nullable__(t.String()),
          expiryDateSnapshot: __nullable__(t.Date()),
          vitalSignsRecordId: __nullable__(
            t.String({
              description: `أوامر المراقبة تنتهي بقياس — الصفّ يربط السجل الذي أُنشئ عند تنفيذه`,
            }),
          ),
          eatenFraction: __nullable__(
            t.Number({
              description: `حقول ورقة الرعاية المهيكلة — تُملأ لأوامر التغذية والملاحظة، لا للدواء.
مهيكلة لا نصّية لأنها ما يُرسم منه اتجاه: «لم يأكل منذ يومين» لا يُقرأ من ملاحظات.
0.00–1.00 من الوجبة المقدَّمة`,
            }),
          ),
          urination: __nullable__(t.Boolean()),
          defecation: __nullable__(t.Boolean()),
          vomiting: __nullable__(t.Boolean()),
          notesAr: __nullable__(t.String()),
          skipReasonAr: __nullable__(t.String()),
          correctsId: __nullable__(
            t.String({
              description: `سلسلة التصحيح — نفس آلية \`VitalSignsRecord.correctsId\``,
            }),
          ),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `صفّ التنفيذ الواحد — «الجرعة الثامنة مساءً» سطرًا قائمًا بذاته.
هذا هو جوهر الوحدة: ورقة العلاج التي تُملأ على القفص. الصفوف تُولَّد مقدَّمًا من
جدول الأمر، فتظهر في القائمة قبل موعدها، وتُعلَّم عند التنفيذ. صفٌّ حالته GIVEN
لا يُعدَّل أبدًا — التصحيح صفٌّ جديد يشير إليه، تمامًا كسجل العلامات الحيوية.`,
        },
      ),
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const WarehousePlainInputCreate = t.Object(
  {
    code: t.String(),
    name: t.String(),
    isDefault: t.Optional(t.Boolean()),
    isMobile: t.Optional(t.Boolean()),
    active: t.Optional(t.Boolean()),
    isDeleted: t.Optional(t.Boolean()),
    deletedAt: t.Optional(__nullable__(t.Date())),
    editsCount: t.Optional(t.Integer()),
  },
  { additionalProperties: false },
);

export const WarehousePlainInputUpdate = t.Object(
  {
    code: t.Optional(t.String()),
    name: t.Optional(t.String()),
    isDefault: t.Optional(t.Boolean()),
    isMobile: t.Optional(t.Boolean()),
    active: t.Optional(t.Boolean()),
    isDeleted: t.Optional(t.Boolean()),
    deletedAt: t.Optional(__nullable__(t.Date())),
    editsCount: t.Optional(t.Integer()),
  },
  { additionalProperties: false },
);

export const WarehouseRelationsInputCreate = t.Object(
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
    branch: t.Optional(
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
    stockLedgerEntries: t.Optional(
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
    bins: t.Optional(
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
    purchaseOrders: t.Optional(
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
    batches: t.Optional(
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
    mobileUnit: t.Optional(
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
    posProfiles: t.Optional(
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
    inpatientAdministrations: t.Optional(
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
  { additionalProperties: false },
);

export const WarehouseRelationsInputUpdate = t.Partial(
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
      branch: t.Partial(
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
      stockLedgerEntries: t.Partial(
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
      bins: t.Partial(
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
      purchaseOrders: t.Partial(
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
      batches: t.Partial(
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
      mobileUnit: t.Partial(
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
      posProfiles: t.Partial(
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
      inpatientAdministrations: t.Partial(
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
    { additionalProperties: false },
  ),
);

export const WarehouseWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          code: t.String(),
          clinicId: t.String(),
          branchId: t.String(),
          name: t.String(),
          isDefault: t.Boolean(),
          isMobile: t.Boolean(),
          active: t.Boolean(),
          isDeleted: t.Boolean(),
          deletedAt: t.Date(),
          editsCount: t.Integer(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "Warehouse" },
  ),
);

export const WarehouseWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.String(), code: t.String() },
            { additionalProperties: false },
          ),
          { additionalProperties: false },
        ),
        t.Union(
          [t.Object({ id: t.String() }), t.Object({ code: t.String() })],
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
              code: t.String(),
              clinicId: t.String(),
              branchId: t.String(),
              name: t.String(),
              isDefault: t.Boolean(),
              isMobile: t.Boolean(),
              active: t.Boolean(),
              isDeleted: t.Boolean(),
              deletedAt: t.Date(),
              editsCount: t.Integer(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "Warehouse" },
);

export const WarehouseSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      code: t.Boolean(),
      clinicId: t.Boolean(),
      branchId: t.Boolean(),
      name: t.Boolean(),
      isDefault: t.Boolean(),
      isMobile: t.Boolean(),
      active: t.Boolean(),
      isDeleted: t.Boolean(),
      deletedAt: t.Boolean(),
      editsCount: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinic: t.Boolean(),
      branch: t.Boolean(),
      stockLedgerEntries: t.Boolean(),
      bins: t.Boolean(),
      purchaseOrders: t.Boolean(),
      batches: t.Boolean(),
      mobileUnit: t.Boolean(),
      posProfiles: t.Boolean(),
      dispenseEvents: t.Boolean(),
      inpatientAdministrations: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const WarehouseInclude = t.Partial(
  t.Object(
    {
      clinic: t.Boolean(),
      branch: t.Boolean(),
      stockLedgerEntries: t.Boolean(),
      bins: t.Boolean(),
      purchaseOrders: t.Boolean(),
      batches: t.Boolean(),
      mobileUnit: t.Boolean(),
      posProfiles: t.Boolean(),
      dispenseEvents: t.Boolean(),
      inpatientAdministrations: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const WarehouseOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      code: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clinicId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      branchId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      name: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      isDefault: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      isMobile: t.Union([t.Literal("asc"), t.Literal("desc")], {
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
      editsCount: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      updatedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const Warehouse = t.Composite([WarehousePlain, WarehouseRelations], {
  additionalProperties: false,
});

export const WarehouseInputCreate = t.Composite(
  [WarehousePlainInputCreate, WarehouseRelationsInputCreate],
  { additionalProperties: false },
);

export const WarehouseInputUpdate = t.Composite(
  [WarehousePlainInputUpdate, WarehouseRelationsInputUpdate],
  { additionalProperties: false },
);
