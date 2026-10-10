import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const CageAssignmentPlain = t.Object(
  {
    id: t.String(),
    stayId: t.String(),
    cageId: t.String(),
    assignedAt: t.Date(),
    releasedAt: __nullable__(t.Date()),
    movedById: __nullable__(t.String()),
    reason: __nullable__(
      t.String({
        description: `سبب النقل — يُطلب عند النقل لا عند الإسكان الأول`,
      }),
    ),
  },
  {
    additionalProperties: false,
    description: `إسكان الإقامة في قفص — سجل مُلحَق: كل نقل صفٌّ جديد، والسابق يُغلق بـ
\`releasedAt\`. الإشغال الحالي = الصفوف بلا \`releasedAt\`.
لماذا سجل لا عمود \`cageId\` على الإقامة؟ لأن «أين كان الحيوان الثلاثاء الماضي؟»
سؤال يُطرح فعلًا — عند تتبّع عدوى مثلًا — وعمودٌ يُكتب فوقه يمحو الجواب.`,
  },
);

export const CageAssignmentRelations = t.Object(
  {
    stay: t.Object(
      {
        id: t.String(),
        code: t.String({ description: `IP-XXXX` }),
        clinicId: t.String(),
        branchId: t.String({
          description: `إلزامي: الحيوان المنوَّم موجود فيزيائيًا في فرع واحد`,
        }),
        patientId: t.String(),
        ownerId: t.String(),
        kind: t.Union(
          [
            t.Literal("MEDICAL"),
            t.Literal("SURGICAL"),
            t.Literal("ICU"),
            t.Literal("ISOLATION"),
            t.Literal("BOARDING"),
          ],
          {
            additionalProperties: false,
            description: `نوع الإقامة — يقرّر البوابات الإلزامية وقواعد الإسكان لا شكل السجل.`,
          },
        ),
        status: t.Union(
          [
            t.Literal("REQUESTED"),
            t.Literal("ADMITTED"),
            t.Literal("IN_CARE"),
            t.Literal("DISCHARGE_PENDING"),
            t.Literal("DISCHARGED"),
            t.Literal("CANCELLED"),
          ],
          {
            additionalProperties: false,
            description: `حالات الإقامة. المسار خطّي قصير عمدًا: الإقامة ليست سير عمل بمراحل، بل مدّة
زمنية لها بداية ونهاية وما بينهما رعاية متكرّرة.`,
          },
        ),
        acuity: t.Union(
          [
            t.Literal("LOW"),
            t.Literal("MEDIUM"),
            t.Literal("HIGH"),
            t.Literal("CRITICAL"),
          ],
          {
            additionalProperties: false,
            description: `درجة الحرجية — يدوية في الإصدار الأول (القرار D7). حسابها آليًا من العلامات
الحيوية ممكن لاحقًا وبيانات اللوحة تكفيه، لكن رقمًا محسوبًا يُعرض كأنه حكم
سريري قبل أن يُعاير على أنواع الحيوانات خطرٌ لا فائدة.`,
          },
        ),
        attendingStaffId: t.String({
          description: `الطبيب المعالج — إليه تُصعَّد الإنذارات الحرجة`,
        }),
        admittedById: __nullable__(t.String()),
        appointmentId: __nullable__(
          t.String({
            description: `أبواب الدخول — كلاهما اختياري، فالدخول المباشر (طوارئ) لا يمرّ بأيّهما`,
          }),
        ),
        operationCaseId: __nullable__(t.String()),
        presentingComplaint: __nullable__(t.String()),
        admissionDiagnosis: __nullable__(t.String()),
        isolationReason: __nullable__(t.String()),
        admissionWeightRecordId: __nullable__(
          t.String({
            description: `وزن الدخول كسجل علامات حيوية لا كرقم — الجرعة تُحسب منه، ومصدر الوزن الوحيد
المقبول في هذا النظام هو \`VitalSignsRecord\` (نفس قاعدة \`Prescription\`).`,
          }),
        ),
        monitoringIntervalMinutes: t.Integer({
          description: `دورية قياس العلامات الحيوية بالدقائق — أساس بند «القياس مستحق» في محرّك الاستحقاق`,
        }),
        dailyRateServiceId: __nullable__(
          t.String({
            description: `سعر اليوم — خدمة من كتالوج العيادة، وسعرها مُثبَّت لحظة الدخول فلا يتغيّر
أثر تعديل الكتالوج على إقامة جارية.`,
          }),
        ),
        dailyRateSnapshot: __nullable__(t.Number()),
        requestedAt: t.Date({
          description: `وقت كتابة الطلب. الطلب يسبق الدخول، فـ\`admittedAt\` تبقى فارغة حتى الإسكان
ولا تُقرأ كبداية للإقامة قبله — مدّة الإقامة تُحسب من الدخول لا من الطلب.`,
        }),
        admittedAt: __nullable__(t.Date()),
        expectedDischargeAt: __nullable__(t.Date()),
        dischargedAt: __nullable__(t.Date()),
        dischargeKind: __nullable__(
          t.Union(
            [
              t.Literal("ROUTINE"),
              t.Literal("AGAINST_MEDICAL_ADVICE"),
              t.Literal("TRANSFERRED"),
              t.Literal("DIED"),
              t.Literal("EUTHANIZED"),
            ],
            {
              additionalProperties: false,
              description: `طريقة انتهاء الإقامة. ليست تفصيلًا إحصائيًا: النافق والمُيسَّر موته يتجاوزان
بوابات الأوامر (لا معنى لطلب إيقاف مضادّ حيوي على حيوان نفق) ويستلزمان سببًا.`,
            },
          ),
        ),
        dischargedById: __nullable__(t.String()),
        dischargeSummaryAr: __nullable__(t.String()),
        dischargeInstructionsAr: __nullable__(t.String()),
        cancelReasonAr: __nullable__(t.String()),
        nextDueAt: __nullable__(
          t.Date({
            description: `كاش أقرب استحقاق عبر كل أوامر الإقامة — نفس فكرة \`VaccinationRecord.nextDueAt\`:
«من يحتاج شيئًا الآن؟» يصير مسحًا مفهرسًا بدل حساب لكل إقامة على حدة.
يُعاد حسابه في كل كتابة تحرّكه، ولا يُقرأ قطّ كمصدر حقيقة للعرض التفصيلي.`,
          }),
        ),
        isDeleted: t.Boolean(),
        deletedAt: __nullable__(t.Date()),
        createdAt: t.Date(),
        updatedAt: t.Date(),
      },
      {
        additionalProperties: false,
        description: `الإقامة — التجميعة الجذر للوحدة.`,
      },
    ),
    cage: t.Object(
      {
        id: t.String(),
        clinicId: t.String(),
        branchId: t.String(),
        roomId: t.String(),
        name: t.String({ description: `اسم/رقم القفص كما هو مكتوب على بابه` }),
        sizeClass: __nullable__(
          t.Union(
            [
              t.Literal("SMALL"),
              t.Literal("MEDIUM"),
              t.Literal("LARGE"),
              t.Literal("WALK_IN"),
            ],
            {
              additionalProperties: false,
              description: `حجم القفص — يُستعمل لاقتراح الإسكان لا لمنعه. حيوان كبير في قفص صغير خطأ
يستحقّ تحذيرًا، لكنّه أحيانًا الخيار الوحيد المتاح ليلة الطوارئ.`,
            },
          ),
        ),
        notes: __nullable__(t.String()),
        active: t.Boolean(),
        isDeleted: t.Boolean(),
        deletedAt: __nullable__(t.Date()),
        createdAt: t.Date(),
        updatedAt: t.Date(),
      },
      {
        additionalProperties: false,
        description: `قفص/سرير داخل غرفة. الغرفة وحدها لا تكفي: \`Room.capacity\` رقمٌ مجرّد لا يعرف
أيّ حيوان في أيّ موضع، ولا يسمح بنقلٍ موثَّق ولا بقاعدة عزل.`,
      },
    ),
    movedBy: __nullable__(
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
    description: `إسكان الإقامة في قفص — سجل مُلحَق: كل نقل صفٌّ جديد، والسابق يُغلق بـ
\`releasedAt\`. الإشغال الحالي = الصفوف بلا \`releasedAt\`.
لماذا سجل لا عمود \`cageId\` على الإقامة؟ لأن «أين كان الحيوان الثلاثاء الماضي؟»
سؤال يُطرح فعلًا — عند تتبّع عدوى مثلًا — وعمودٌ يُكتب فوقه يمحو الجواب.`,
  },
);

export const CageAssignmentPlainInputCreate = t.Object(
  {
    assignedAt: t.Optional(t.Date()),
    releasedAt: t.Optional(__nullable__(t.Date())),
    reason: t.Optional(
      __nullable__(
        t.String({
          description: `سبب النقل — يُطلب عند النقل لا عند الإسكان الأول`,
        }),
      ),
    ),
  },
  {
    additionalProperties: false,
    description: `إسكان الإقامة في قفص — سجل مُلحَق: كل نقل صفٌّ جديد، والسابق يُغلق بـ
\`releasedAt\`. الإشغال الحالي = الصفوف بلا \`releasedAt\`.
لماذا سجل لا عمود \`cageId\` على الإقامة؟ لأن «أين كان الحيوان الثلاثاء الماضي؟»
سؤال يُطرح فعلًا — عند تتبّع عدوى مثلًا — وعمودٌ يُكتب فوقه يمحو الجواب.`,
  },
);

export const CageAssignmentPlainInputUpdate = t.Object(
  {
    assignedAt: t.Optional(t.Date()),
    releasedAt: t.Optional(__nullable__(t.Date())),
    reason: t.Optional(
      __nullable__(
        t.String({
          description: `سبب النقل — يُطلب عند النقل لا عند الإسكان الأول`,
        }),
      ),
    ),
  },
  {
    additionalProperties: false,
    description: `إسكان الإقامة في قفص — سجل مُلحَق: كل نقل صفٌّ جديد، والسابق يُغلق بـ
\`releasedAt\`. الإشغال الحالي = الصفوف بلا \`releasedAt\`.
لماذا سجل لا عمود \`cageId\` على الإقامة؟ لأن «أين كان الحيوان الثلاثاء الماضي؟»
سؤال يُطرح فعلًا — عند تتبّع عدوى مثلًا — وعمودٌ يُكتب فوقه يمحو الجواب.`,
  },
);

export const CageAssignmentRelationsInputCreate = t.Object(
  {
    stay: t.Object(
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
    cage: t.Object(
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
    movedBy: t.Optional(
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
    description: `إسكان الإقامة في قفص — سجل مُلحَق: كل نقل صفٌّ جديد، والسابق يُغلق بـ
\`releasedAt\`. الإشغال الحالي = الصفوف بلا \`releasedAt\`.
لماذا سجل لا عمود \`cageId\` على الإقامة؟ لأن «أين كان الحيوان الثلاثاء الماضي؟»
سؤال يُطرح فعلًا — عند تتبّع عدوى مثلًا — وعمودٌ يُكتب فوقه يمحو الجواب.`,
  },
);

export const CageAssignmentRelationsInputUpdate = t.Partial(
  t.Object(
    {
      stay: t.Object(
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
      cage: t.Object(
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
      movedBy: t.Partial(
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
      description: `إسكان الإقامة في قفص — سجل مُلحَق: كل نقل صفٌّ جديد، والسابق يُغلق بـ
\`releasedAt\`. الإشغال الحالي = الصفوف بلا \`releasedAt\`.
لماذا سجل لا عمود \`cageId\` على الإقامة؟ لأن «أين كان الحيوان الثلاثاء الماضي؟»
سؤال يُطرح فعلًا — عند تتبّع عدوى مثلًا — وعمودٌ يُكتب فوقه يمحو الجواب.`,
    },
  ),
);

export const CageAssignmentWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          stayId: t.String(),
          cageId: t.String(),
          assignedAt: t.Date(),
          releasedAt: t.Date(),
          movedById: t.String(),
          reason: t.String({
            description: `سبب النقل — يُطلب عند النقل لا عند الإسكان الأول`,
          }),
        },
        {
          additionalProperties: false,
          description: `إسكان الإقامة في قفص — سجل مُلحَق: كل نقل صفٌّ جديد، والسابق يُغلق بـ
\`releasedAt\`. الإشغال الحالي = الصفوف بلا \`releasedAt\`.
لماذا سجل لا عمود \`cageId\` على الإقامة؟ لأن «أين كان الحيوان الثلاثاء الماضي؟»
سؤال يُطرح فعلًا — عند تتبّع عدوى مثلًا — وعمودٌ يُكتب فوقه يمحو الجواب.`,
        },
      ),
    { $id: "CageAssignment" },
  ),
);

export const CageAssignmentWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.String() },
            {
              additionalProperties: false,
              description: `إسكان الإقامة في قفص — سجل مُلحَق: كل نقل صفٌّ جديد، والسابق يُغلق بـ
\`releasedAt\`. الإشغال الحالي = الصفوف بلا \`releasedAt\`.
لماذا سجل لا عمود \`cageId\` على الإقامة؟ لأن «أين كان الحيوان الثلاثاء الماضي؟»
سؤال يُطرح فعلًا — عند تتبّع عدوى مثلًا — وعمودٌ يُكتب فوقه يمحو الجواب.`,
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
              stayId: t.String(),
              cageId: t.String(),
              assignedAt: t.Date(),
              releasedAt: t.Date(),
              movedById: t.String(),
              reason: t.String({
                description: `سبب النقل — يُطلب عند النقل لا عند الإسكان الأول`,
              }),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "CageAssignment" },
);

export const CageAssignmentSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      stayId: t.Boolean(),
      cageId: t.Boolean(),
      assignedAt: t.Boolean(),
      releasedAt: t.Boolean(),
      movedById: t.Boolean(),
      reason: t.Boolean(),
      stay: t.Boolean(),
      cage: t.Boolean(),
      movedBy: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `إسكان الإقامة في قفص — سجل مُلحَق: كل نقل صفٌّ جديد، والسابق يُغلق بـ
\`releasedAt\`. الإشغال الحالي = الصفوف بلا \`releasedAt\`.
لماذا سجل لا عمود \`cageId\` على الإقامة؟ لأن «أين كان الحيوان الثلاثاء الماضي؟»
سؤال يُطرح فعلًا — عند تتبّع عدوى مثلًا — وعمودٌ يُكتب فوقه يمحو الجواب.`,
    },
  ),
);

export const CageAssignmentInclude = t.Partial(
  t.Object(
    {
      stay: t.Boolean(),
      cage: t.Boolean(),
      movedBy: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `إسكان الإقامة في قفص — سجل مُلحَق: كل نقل صفٌّ جديد، والسابق يُغلق بـ
\`releasedAt\`. الإشغال الحالي = الصفوف بلا \`releasedAt\`.
لماذا سجل لا عمود \`cageId\` على الإقامة؟ لأن «أين كان الحيوان الثلاثاء الماضي؟»
سؤال يُطرح فعلًا — عند تتبّع عدوى مثلًا — وعمودٌ يُكتب فوقه يمحو الجواب.`,
    },
  ),
);

export const CageAssignmentOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      stayId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      cageId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      assignedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      releasedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      movedById: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      reason: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    {
      additionalProperties: false,
      description: `إسكان الإقامة في قفص — سجل مُلحَق: كل نقل صفٌّ جديد، والسابق يُغلق بـ
\`releasedAt\`. الإشغال الحالي = الصفوف بلا \`releasedAt\`.
لماذا سجل لا عمود \`cageId\` على الإقامة؟ لأن «أين كان الحيوان الثلاثاء الماضي؟»
سؤال يُطرح فعلًا — عند تتبّع عدوى مثلًا — وعمودٌ يُكتب فوقه يمحو الجواب.`,
    },
  ),
);

export const CageAssignment = t.Composite(
  [CageAssignmentPlain, CageAssignmentRelations],
  { additionalProperties: false },
);

export const CageAssignmentInputCreate = t.Composite(
  [CageAssignmentPlainInputCreate, CageAssignmentRelationsInputCreate],
  { additionalProperties: false },
);

export const CageAssignmentInputUpdate = t.Composite(
  [CageAssignmentPlainInputUpdate, CageAssignmentRelationsInputUpdate],
  { additionalProperties: false },
);
