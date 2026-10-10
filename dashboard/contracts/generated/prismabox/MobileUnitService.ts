import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const MobileUnitServicePlain = t.Object(
  {
    id: t.String(),
    clinicId: t.String(),
    mobileUnitId: t.String(),
    serviceId: t.String(),
    price: __nullable__(
      t.Number({
        description: `تجاوز سعر الكتالوج لهذه المركبة تحديدًا؛ null ⇒ سعر الكتالوج`,
      }),
    ),
    duration: __nullable__(
      t.Integer({ description: `تجاوز المدّة بالدقائق؛ null ⇒ مدّة الكتالوج` }),
    ),
    isActive: t.Boolean(),
    notes: __nullable__(t.String()),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  },
  {
    additionalProperties: false,
    description: `[MC10.2] ما نُفِّذ فعلًا في الزيارة المتنقلة — سجلّ ميداني مستقلّ عن
\`AppointmentService\`.
لماذا لا يكفي \`AppointmentService\`؟ لأنّه يجيب عن سؤال «بماذا حُجزت الزيارة؟» لا عن
«ماذا جرى في الموقع؟». الفرق بينهما هو عمل الطاقم: خدمة تُلغى لأنّ الحيوان لم يحتجها،
وأخرى تُضاف لأنّ المالك طلبها عند الباب. دمج الاثنين في جدول واحد يمحو هذا الفرق —
ومعه القدرة على مراجعة ما فعله السائق أو تسعير عمل المركبة على حدة.
السطور تُزامَن إلى \`AppointmentService\` عند COMPLETED فتركب الفاتورة والترحيل
المحاسبي كما هي — سجلٌّ منفصل لا مسار فوترة ثانٍ.
ما تستطيع **هذه المركبة** تقديمه من كتالوج العيادة المتنقلة.
طبقةٌ فوق \`MobileServiceCatalog\` لا بديلٌ عنه، والسبب أن الكتالوج يجيب سؤالين
لا مركبة فيهما أصلًا: نموذج الحجز العام يعرض الخدمات قبل إسناد أي مركبة، وتحويل
طلب إلى زيارة قد يجري بلا مركبة (مسار \`PENDING\` الذي يقوم عليه العرض والالتقاط).
فلو صار الكتالوج نفسه لكل مركبة لما بقي مصدرٌ للسعر في هاتين الحالتين.
**غياب الصفوف يعني السماح بالكل.** مركبةٌ بلا قائمة تقدّم كل ما في كتالوج العيادة —
فالتقييد قرار يُتخذ لا حالة افتراضية، ولا تفقد مركبة قائمة قدرتها يوم الترحيل.`,
  },
);

export const MobileUnitServiceRelations = t.Object(
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
    mobileUnit: t.Object(
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
    service: t.Object(
      {
        id: t.String(),
        name: t.String(),
        level: t.Union(
          [t.Literal("CATEGORY"), t.Literal("SUBCATEGORY"), t.Literal("ITEM")],
          { additionalProperties: false },
        ),
        parentId: __nullable__(t.String()),
        isDefault: t.Boolean(),
        clinicId: __nullable__(t.String()),
        order: t.Integer(),
        isLabCategory: t.Boolean(),
        isRadiologyCategory: t.Boolean(),
        isOperationCategory: t.Boolean(),
        isGroomingCategory: t.Boolean(),
        consentCode: __nullable__(t.String()),
        createdAt: t.Date(),
      },
      { additionalProperties: false },
    ),
  },
  {
    additionalProperties: false,
    description: `[MC10.2] ما نُفِّذ فعلًا في الزيارة المتنقلة — سجلّ ميداني مستقلّ عن
\`AppointmentService\`.
لماذا لا يكفي \`AppointmentService\`؟ لأنّه يجيب عن سؤال «بماذا حُجزت الزيارة؟» لا عن
«ماذا جرى في الموقع؟». الفرق بينهما هو عمل الطاقم: خدمة تُلغى لأنّ الحيوان لم يحتجها،
وأخرى تُضاف لأنّ المالك طلبها عند الباب. دمج الاثنين في جدول واحد يمحو هذا الفرق —
ومعه القدرة على مراجعة ما فعله السائق أو تسعير عمل المركبة على حدة.
السطور تُزامَن إلى \`AppointmentService\` عند COMPLETED فتركب الفاتورة والترحيل
المحاسبي كما هي — سجلٌّ منفصل لا مسار فوترة ثانٍ.
ما تستطيع **هذه المركبة** تقديمه من كتالوج العيادة المتنقلة.
طبقةٌ فوق \`MobileServiceCatalog\` لا بديلٌ عنه، والسبب أن الكتالوج يجيب سؤالين
لا مركبة فيهما أصلًا: نموذج الحجز العام يعرض الخدمات قبل إسناد أي مركبة، وتحويل
طلب إلى زيارة قد يجري بلا مركبة (مسار \`PENDING\` الذي يقوم عليه العرض والالتقاط).
فلو صار الكتالوج نفسه لكل مركبة لما بقي مصدرٌ للسعر في هاتين الحالتين.
**غياب الصفوف يعني السماح بالكل.** مركبةٌ بلا قائمة تقدّم كل ما في كتالوج العيادة —
فالتقييد قرار يُتخذ لا حالة افتراضية، ولا تفقد مركبة قائمة قدرتها يوم الترحيل.`,
  },
);

export const MobileUnitServicePlainInputCreate = t.Object(
  {
    price: t.Optional(
      __nullable__(
        t.Number({
          description: `تجاوز سعر الكتالوج لهذه المركبة تحديدًا؛ null ⇒ سعر الكتالوج`,
        }),
      ),
    ),
    duration: t.Optional(
      __nullable__(
        t.Integer({
          description: `تجاوز المدّة بالدقائق؛ null ⇒ مدّة الكتالوج`,
        }),
      ),
    ),
    isActive: t.Optional(t.Boolean()),
    notes: t.Optional(__nullable__(t.String())),
  },
  {
    additionalProperties: false,
    description: `[MC10.2] ما نُفِّذ فعلًا في الزيارة المتنقلة — سجلّ ميداني مستقلّ عن
\`AppointmentService\`.
لماذا لا يكفي \`AppointmentService\`؟ لأنّه يجيب عن سؤال «بماذا حُجزت الزيارة؟» لا عن
«ماذا جرى في الموقع؟». الفرق بينهما هو عمل الطاقم: خدمة تُلغى لأنّ الحيوان لم يحتجها،
وأخرى تُضاف لأنّ المالك طلبها عند الباب. دمج الاثنين في جدول واحد يمحو هذا الفرق —
ومعه القدرة على مراجعة ما فعله السائق أو تسعير عمل المركبة على حدة.
السطور تُزامَن إلى \`AppointmentService\` عند COMPLETED فتركب الفاتورة والترحيل
المحاسبي كما هي — سجلٌّ منفصل لا مسار فوترة ثانٍ.
ما تستطيع **هذه المركبة** تقديمه من كتالوج العيادة المتنقلة.
طبقةٌ فوق \`MobileServiceCatalog\` لا بديلٌ عنه، والسبب أن الكتالوج يجيب سؤالين
لا مركبة فيهما أصلًا: نموذج الحجز العام يعرض الخدمات قبل إسناد أي مركبة، وتحويل
طلب إلى زيارة قد يجري بلا مركبة (مسار \`PENDING\` الذي يقوم عليه العرض والالتقاط).
فلو صار الكتالوج نفسه لكل مركبة لما بقي مصدرٌ للسعر في هاتين الحالتين.
**غياب الصفوف يعني السماح بالكل.** مركبةٌ بلا قائمة تقدّم كل ما في كتالوج العيادة —
فالتقييد قرار يُتخذ لا حالة افتراضية، ولا تفقد مركبة قائمة قدرتها يوم الترحيل.`,
  },
);

export const MobileUnitServicePlainInputUpdate = t.Object(
  {
    price: t.Optional(
      __nullable__(
        t.Number({
          description: `تجاوز سعر الكتالوج لهذه المركبة تحديدًا؛ null ⇒ سعر الكتالوج`,
        }),
      ),
    ),
    duration: t.Optional(
      __nullable__(
        t.Integer({
          description: `تجاوز المدّة بالدقائق؛ null ⇒ مدّة الكتالوج`,
        }),
      ),
    ),
    isActive: t.Optional(t.Boolean()),
    notes: t.Optional(__nullable__(t.String())),
  },
  {
    additionalProperties: false,
    description: `[MC10.2] ما نُفِّذ فعلًا في الزيارة المتنقلة — سجلّ ميداني مستقلّ عن
\`AppointmentService\`.
لماذا لا يكفي \`AppointmentService\`؟ لأنّه يجيب عن سؤال «بماذا حُجزت الزيارة؟» لا عن
«ماذا جرى في الموقع؟». الفرق بينهما هو عمل الطاقم: خدمة تُلغى لأنّ الحيوان لم يحتجها،
وأخرى تُضاف لأنّ المالك طلبها عند الباب. دمج الاثنين في جدول واحد يمحو هذا الفرق —
ومعه القدرة على مراجعة ما فعله السائق أو تسعير عمل المركبة على حدة.
السطور تُزامَن إلى \`AppointmentService\` عند COMPLETED فتركب الفاتورة والترحيل
المحاسبي كما هي — سجلٌّ منفصل لا مسار فوترة ثانٍ.
ما تستطيع **هذه المركبة** تقديمه من كتالوج العيادة المتنقلة.
طبقةٌ فوق \`MobileServiceCatalog\` لا بديلٌ عنه، والسبب أن الكتالوج يجيب سؤالين
لا مركبة فيهما أصلًا: نموذج الحجز العام يعرض الخدمات قبل إسناد أي مركبة، وتحويل
طلب إلى زيارة قد يجري بلا مركبة (مسار \`PENDING\` الذي يقوم عليه العرض والالتقاط).
فلو صار الكتالوج نفسه لكل مركبة لما بقي مصدرٌ للسعر في هاتين الحالتين.
**غياب الصفوف يعني السماح بالكل.** مركبةٌ بلا قائمة تقدّم كل ما في كتالوج العيادة —
فالتقييد قرار يُتخذ لا حالة افتراضية، ولا تفقد مركبة قائمة قدرتها يوم الترحيل.`,
  },
);

export const MobileUnitServiceRelationsInputCreate = t.Object(
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
    mobileUnit: t.Object(
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
    service: t.Object(
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
    description: `[MC10.2] ما نُفِّذ فعلًا في الزيارة المتنقلة — سجلّ ميداني مستقلّ عن
\`AppointmentService\`.
لماذا لا يكفي \`AppointmentService\`؟ لأنّه يجيب عن سؤال «بماذا حُجزت الزيارة؟» لا عن
«ماذا جرى في الموقع؟». الفرق بينهما هو عمل الطاقم: خدمة تُلغى لأنّ الحيوان لم يحتجها،
وأخرى تُضاف لأنّ المالك طلبها عند الباب. دمج الاثنين في جدول واحد يمحو هذا الفرق —
ومعه القدرة على مراجعة ما فعله السائق أو تسعير عمل المركبة على حدة.
السطور تُزامَن إلى \`AppointmentService\` عند COMPLETED فتركب الفاتورة والترحيل
المحاسبي كما هي — سجلٌّ منفصل لا مسار فوترة ثانٍ.
ما تستطيع **هذه المركبة** تقديمه من كتالوج العيادة المتنقلة.
طبقةٌ فوق \`MobileServiceCatalog\` لا بديلٌ عنه، والسبب أن الكتالوج يجيب سؤالين
لا مركبة فيهما أصلًا: نموذج الحجز العام يعرض الخدمات قبل إسناد أي مركبة، وتحويل
طلب إلى زيارة قد يجري بلا مركبة (مسار \`PENDING\` الذي يقوم عليه العرض والالتقاط).
فلو صار الكتالوج نفسه لكل مركبة لما بقي مصدرٌ للسعر في هاتين الحالتين.
**غياب الصفوف يعني السماح بالكل.** مركبةٌ بلا قائمة تقدّم كل ما في كتالوج العيادة —
فالتقييد قرار يُتخذ لا حالة افتراضية، ولا تفقد مركبة قائمة قدرتها يوم الترحيل.`,
  },
);

export const MobileUnitServiceRelationsInputUpdate = t.Partial(
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
      mobileUnit: t.Object(
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
      service: t.Object(
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
      description: `[MC10.2] ما نُفِّذ فعلًا في الزيارة المتنقلة — سجلّ ميداني مستقلّ عن
\`AppointmentService\`.
لماذا لا يكفي \`AppointmentService\`؟ لأنّه يجيب عن سؤال «بماذا حُجزت الزيارة؟» لا عن
«ماذا جرى في الموقع؟». الفرق بينهما هو عمل الطاقم: خدمة تُلغى لأنّ الحيوان لم يحتجها،
وأخرى تُضاف لأنّ المالك طلبها عند الباب. دمج الاثنين في جدول واحد يمحو هذا الفرق —
ومعه القدرة على مراجعة ما فعله السائق أو تسعير عمل المركبة على حدة.
السطور تُزامَن إلى \`AppointmentService\` عند COMPLETED فتركب الفاتورة والترحيل
المحاسبي كما هي — سجلٌّ منفصل لا مسار فوترة ثانٍ.
ما تستطيع **هذه المركبة** تقديمه من كتالوج العيادة المتنقلة.
طبقةٌ فوق \`MobileServiceCatalog\` لا بديلٌ عنه، والسبب أن الكتالوج يجيب سؤالين
لا مركبة فيهما أصلًا: نموذج الحجز العام يعرض الخدمات قبل إسناد أي مركبة، وتحويل
طلب إلى زيارة قد يجري بلا مركبة (مسار \`PENDING\` الذي يقوم عليه العرض والالتقاط).
فلو صار الكتالوج نفسه لكل مركبة لما بقي مصدرٌ للسعر في هاتين الحالتين.
**غياب الصفوف يعني السماح بالكل.** مركبةٌ بلا قائمة تقدّم كل ما في كتالوج العيادة —
فالتقييد قرار يُتخذ لا حالة افتراضية، ولا تفقد مركبة قائمة قدرتها يوم الترحيل.`,
    },
  ),
);

export const MobileUnitServiceWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          clinicId: t.String(),
          mobileUnitId: t.String(),
          serviceId: t.String(),
          price: t.Number({
            description: `تجاوز سعر الكتالوج لهذه المركبة تحديدًا؛ null ⇒ سعر الكتالوج`,
          }),
          duration: t.Integer({
            description: `تجاوز المدّة بالدقائق؛ null ⇒ مدّة الكتالوج`,
          }),
          isActive: t.Boolean(),
          notes: t.String(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `[MC10.2] ما نُفِّذ فعلًا في الزيارة المتنقلة — سجلّ ميداني مستقلّ عن
\`AppointmentService\`.
لماذا لا يكفي \`AppointmentService\`؟ لأنّه يجيب عن سؤال «بماذا حُجزت الزيارة؟» لا عن
«ماذا جرى في الموقع؟». الفرق بينهما هو عمل الطاقم: خدمة تُلغى لأنّ الحيوان لم يحتجها،
وأخرى تُضاف لأنّ المالك طلبها عند الباب. دمج الاثنين في جدول واحد يمحو هذا الفرق —
ومعه القدرة على مراجعة ما فعله السائق أو تسعير عمل المركبة على حدة.
السطور تُزامَن إلى \`AppointmentService\` عند COMPLETED فتركب الفاتورة والترحيل
المحاسبي كما هي — سجلٌّ منفصل لا مسار فوترة ثانٍ.
ما تستطيع **هذه المركبة** تقديمه من كتالوج العيادة المتنقلة.
طبقةٌ فوق \`MobileServiceCatalog\` لا بديلٌ عنه، والسبب أن الكتالوج يجيب سؤالين
لا مركبة فيهما أصلًا: نموذج الحجز العام يعرض الخدمات قبل إسناد أي مركبة، وتحويل
طلب إلى زيارة قد يجري بلا مركبة (مسار \`PENDING\` الذي يقوم عليه العرض والالتقاط).
فلو صار الكتالوج نفسه لكل مركبة لما بقي مصدرٌ للسعر في هاتين الحالتين.
**غياب الصفوف يعني السماح بالكل.** مركبةٌ بلا قائمة تقدّم كل ما في كتالوج العيادة —
فالتقييد قرار يُتخذ لا حالة افتراضية، ولا تفقد مركبة قائمة قدرتها يوم الترحيل.`,
        },
      ),
    { $id: "MobileUnitService" },
  ),
);

export const MobileUnitServiceWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            {
              id: t.String(),
              mobileUnitId_serviceId: t.Object(
                { mobileUnitId: t.String(), serviceId: t.String() },
                { additionalProperties: false },
              ),
            },
            {
              additionalProperties: false,
              description: `[MC10.2] ما نُفِّذ فعلًا في الزيارة المتنقلة — سجلّ ميداني مستقلّ عن
\`AppointmentService\`.
لماذا لا يكفي \`AppointmentService\`؟ لأنّه يجيب عن سؤال «بماذا حُجزت الزيارة؟» لا عن
«ماذا جرى في الموقع؟». الفرق بينهما هو عمل الطاقم: خدمة تُلغى لأنّ الحيوان لم يحتجها،
وأخرى تُضاف لأنّ المالك طلبها عند الباب. دمج الاثنين في جدول واحد يمحو هذا الفرق —
ومعه القدرة على مراجعة ما فعله السائق أو تسعير عمل المركبة على حدة.
السطور تُزامَن إلى \`AppointmentService\` عند COMPLETED فتركب الفاتورة والترحيل
المحاسبي كما هي — سجلٌّ منفصل لا مسار فوترة ثانٍ.
ما تستطيع **هذه المركبة** تقديمه من كتالوج العيادة المتنقلة.
طبقةٌ فوق \`MobileServiceCatalog\` لا بديلٌ عنه، والسبب أن الكتالوج يجيب سؤالين
لا مركبة فيهما أصلًا: نموذج الحجز العام يعرض الخدمات قبل إسناد أي مركبة، وتحويل
طلب إلى زيارة قد يجري بلا مركبة (مسار \`PENDING\` الذي يقوم عليه العرض والالتقاط).
فلو صار الكتالوج نفسه لكل مركبة لما بقي مصدرٌ للسعر في هاتين الحالتين.
**غياب الصفوف يعني السماح بالكل.** مركبةٌ بلا قائمة تقدّم كل ما في كتالوج العيادة —
فالتقييد قرار يُتخذ لا حالة افتراضية، ولا تفقد مركبة قائمة قدرتها يوم الترحيل.`,
            },
          ),
          { additionalProperties: false },
        ),
        t.Union(
          [
            t.Object({ id: t.String() }),
            t.Object({
              mobileUnitId_serviceId: t.Object(
                { mobileUnitId: t.String(), serviceId: t.String() },
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
              mobileUnitId: t.String(),
              serviceId: t.String(),
              price: t.Number({
                description: `تجاوز سعر الكتالوج لهذه المركبة تحديدًا؛ null ⇒ سعر الكتالوج`,
              }),
              duration: t.Integer({
                description: `تجاوز المدّة بالدقائق؛ null ⇒ مدّة الكتالوج`,
              }),
              isActive: t.Boolean(),
              notes: t.String(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "MobileUnitService" },
);

export const MobileUnitServiceSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      clinicId: t.Boolean(),
      mobileUnitId: t.Boolean(),
      serviceId: t.Boolean(),
      price: t.Boolean(),
      duration: t.Boolean(),
      isActive: t.Boolean(),
      notes: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinic: t.Boolean(),
      mobileUnit: t.Boolean(),
      service: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `[MC10.2] ما نُفِّذ فعلًا في الزيارة المتنقلة — سجلّ ميداني مستقلّ عن
\`AppointmentService\`.
لماذا لا يكفي \`AppointmentService\`؟ لأنّه يجيب عن سؤال «بماذا حُجزت الزيارة؟» لا عن
«ماذا جرى في الموقع؟». الفرق بينهما هو عمل الطاقم: خدمة تُلغى لأنّ الحيوان لم يحتجها،
وأخرى تُضاف لأنّ المالك طلبها عند الباب. دمج الاثنين في جدول واحد يمحو هذا الفرق —
ومعه القدرة على مراجعة ما فعله السائق أو تسعير عمل المركبة على حدة.
السطور تُزامَن إلى \`AppointmentService\` عند COMPLETED فتركب الفاتورة والترحيل
المحاسبي كما هي — سجلٌّ منفصل لا مسار فوترة ثانٍ.
ما تستطيع **هذه المركبة** تقديمه من كتالوج العيادة المتنقلة.
طبقةٌ فوق \`MobileServiceCatalog\` لا بديلٌ عنه، والسبب أن الكتالوج يجيب سؤالين
لا مركبة فيهما أصلًا: نموذج الحجز العام يعرض الخدمات قبل إسناد أي مركبة، وتحويل
طلب إلى زيارة قد يجري بلا مركبة (مسار \`PENDING\` الذي يقوم عليه العرض والالتقاط).
فلو صار الكتالوج نفسه لكل مركبة لما بقي مصدرٌ للسعر في هاتين الحالتين.
**غياب الصفوف يعني السماح بالكل.** مركبةٌ بلا قائمة تقدّم كل ما في كتالوج العيادة —
فالتقييد قرار يُتخذ لا حالة افتراضية، ولا تفقد مركبة قائمة قدرتها يوم الترحيل.`,
    },
  ),
);

export const MobileUnitServiceInclude = t.Partial(
  t.Object(
    {
      clinic: t.Boolean(),
      mobileUnit: t.Boolean(),
      service: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `[MC10.2] ما نُفِّذ فعلًا في الزيارة المتنقلة — سجلّ ميداني مستقلّ عن
\`AppointmentService\`.
لماذا لا يكفي \`AppointmentService\`؟ لأنّه يجيب عن سؤال «بماذا حُجزت الزيارة؟» لا عن
«ماذا جرى في الموقع؟». الفرق بينهما هو عمل الطاقم: خدمة تُلغى لأنّ الحيوان لم يحتجها،
وأخرى تُضاف لأنّ المالك طلبها عند الباب. دمج الاثنين في جدول واحد يمحو هذا الفرق —
ومعه القدرة على مراجعة ما فعله السائق أو تسعير عمل المركبة على حدة.
السطور تُزامَن إلى \`AppointmentService\` عند COMPLETED فتركب الفاتورة والترحيل
المحاسبي كما هي — سجلٌّ منفصل لا مسار فوترة ثانٍ.
ما تستطيع **هذه المركبة** تقديمه من كتالوج العيادة المتنقلة.
طبقةٌ فوق \`MobileServiceCatalog\` لا بديلٌ عنه، والسبب أن الكتالوج يجيب سؤالين
لا مركبة فيهما أصلًا: نموذج الحجز العام يعرض الخدمات قبل إسناد أي مركبة، وتحويل
طلب إلى زيارة قد يجري بلا مركبة (مسار \`PENDING\` الذي يقوم عليه العرض والالتقاط).
فلو صار الكتالوج نفسه لكل مركبة لما بقي مصدرٌ للسعر في هاتين الحالتين.
**غياب الصفوف يعني السماح بالكل.** مركبةٌ بلا قائمة تقدّم كل ما في كتالوج العيادة —
فالتقييد قرار يُتخذ لا حالة افتراضية، ولا تفقد مركبة قائمة قدرتها يوم الترحيل.`,
    },
  ),
);

export const MobileUnitServiceOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clinicId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      mobileUnitId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      serviceId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      price: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      duration: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      isActive: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      notes: t.Union([t.Literal("asc"), t.Literal("desc")], {
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
      description: `[MC10.2] ما نُفِّذ فعلًا في الزيارة المتنقلة — سجلّ ميداني مستقلّ عن
\`AppointmentService\`.
لماذا لا يكفي \`AppointmentService\`؟ لأنّه يجيب عن سؤال «بماذا حُجزت الزيارة؟» لا عن
«ماذا جرى في الموقع؟». الفرق بينهما هو عمل الطاقم: خدمة تُلغى لأنّ الحيوان لم يحتجها،
وأخرى تُضاف لأنّ المالك طلبها عند الباب. دمج الاثنين في جدول واحد يمحو هذا الفرق —
ومعه القدرة على مراجعة ما فعله السائق أو تسعير عمل المركبة على حدة.
السطور تُزامَن إلى \`AppointmentService\` عند COMPLETED فتركب الفاتورة والترحيل
المحاسبي كما هي — سجلٌّ منفصل لا مسار فوترة ثانٍ.
ما تستطيع **هذه المركبة** تقديمه من كتالوج العيادة المتنقلة.
طبقةٌ فوق \`MobileServiceCatalog\` لا بديلٌ عنه، والسبب أن الكتالوج يجيب سؤالين
لا مركبة فيهما أصلًا: نموذج الحجز العام يعرض الخدمات قبل إسناد أي مركبة، وتحويل
طلب إلى زيارة قد يجري بلا مركبة (مسار \`PENDING\` الذي يقوم عليه العرض والالتقاط).
فلو صار الكتالوج نفسه لكل مركبة لما بقي مصدرٌ للسعر في هاتين الحالتين.
**غياب الصفوف يعني السماح بالكل.** مركبةٌ بلا قائمة تقدّم كل ما في كتالوج العيادة —
فالتقييد قرار يُتخذ لا حالة افتراضية، ولا تفقد مركبة قائمة قدرتها يوم الترحيل.`,
    },
  ),
);

export const MobileUnitService = t.Composite(
  [MobileUnitServicePlain, MobileUnitServiceRelations],
  { additionalProperties: false },
);

export const MobileUnitServiceInputCreate = t.Composite(
  [MobileUnitServicePlainInputCreate, MobileUnitServiceRelationsInputCreate],
  { additionalProperties: false },
);

export const MobileUnitServiceInputUpdate = t.Composite(
  [MobileUnitServicePlainInputUpdate, MobileUnitServiceRelationsInputUpdate],
  { additionalProperties: false },
);
