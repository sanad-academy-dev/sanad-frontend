import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const InpatientOrderPlain = t.Object(
  {
    id: t.String(),
    stayId: t.String(),
    idx: t.Integer(),
    kind: t.Union(
      [
        t.Literal("MEDICATION"),
        t.Literal("FLUID"),
        t.Literal("MONITORING"),
        t.Literal("FEEDING"),
        t.Literal("ACTIVITY"),
        t.Literal("WOUND_CARE"),
        t.Literal("LAB"),
        t.Literal("IMAGING"),
        t.Literal("OTHER"),
      ],
      {
        additionalProperties: false,
        description: `نوع الأمر الطبي. متطابق عمدًا مع \`PostOpOrderKind\` في مواضعه المشتركة، فتحويل
أوامر ما بعد العملية إلى أوامر تنويم يبقى ترجمةً واحدة لواحد.`,
      },
    ),
    status: t.Union(
      [
        t.Literal("ACTIVE"),
        t.Literal("PAUSED"),
        t.Literal("COMPLETED"),
        t.Literal("DISCONTINUED"),
      ],
      { additionalProperties: false },
    ),
    inventoryItemId: __nullable__(
      t.String({
        description: `أحد ثلاثة مصادر للمادة: صنف مخزون، أو منتج كتالوج، أو نصّ حرّ. الاسم مُثبَّت
دائمًا فلا يتغيّر ما هو مكتوب على السجل بتعديل الكتالوج.`,
      }),
    ),
    catalogProductId: __nullable__(t.String()),
    nameSnapshot: t.String(),
    prescriptionItemId: __nullable__(
      t.String({
        description: `[IP3] بند الوصفة الذي صُرف فأنشأ هذا الأمر. حين يُضبط: المخزون خُصم في
الصيدلية لحظة الصرف، فإعطاء الجرعة لا يخصم ثانيةً ولا يُسعِّر. عمود قياسيّ.`,
      }),
    ),
    doseAmount: __nullable__(t.Number()),
    doseUnit: __nullable__(t.String()),
    route: __nullable__(
      t.Union(
        [
          t.Literal("IV"),
          t.Literal("IM"),
          t.Literal("SC"),
          t.Literal("PO"),
          t.Literal("INHALATION"),
          t.Literal("TOPICAL"),
          t.Literal("EPIDURAL"),
          t.Literal("OTHER"),
        ],
        { additionalProperties: false },
      ),
    ),
    rateMlPerHour: __nullable__(t.Number()),
    doseSource: __nullable__(
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
    overrideReasonAr: __nullable__(t.String()),
    scheduleIntervalHours: __nullable__(
      t.Integer({
        description: `الجدولة: إمّا كل N ساعة، أو أوقات محدّدة من اليوم، أو عند اللزوم (بلا صفوف).
الثلاثة يتبادلن: \`prn\` صحيحة تُلغي التوليد المسبق أصلًا.`,
      }),
    ),
    scheduleTimes: t.Array(
      t.String({ description: `"08:00" بتوقيت العيادة` }),
      { additionalProperties: false },
    ),
    prn: t.Boolean(),
    startAt: t.Date(),
    endAt: __nullable__(t.Date()),
    instructionsAr: __nullable__(t.String()),
    orderedById: __nullable__(t.String()),
    discontinuedById: __nullable__(t.String()),
    discontinuedAt: __nullable__(t.Date()),
    discontinueReasonAr: __nullable__(t.String()),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  },
  {
    additionalProperties: false,
    description: `أمر طبي قائم على الإقامة. الحقول الدوائية مطابقة لـ\`PrescriptionItem\` عمدًا:
نفس محرّك الجرعة يتحقّق منها، ونفس مصدر الوزن، ونفس تصنيف التجاوز.`,
  },
);

export const InpatientOrderRelations = t.Object(
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
    orderedBy: __nullable__(
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
    discontinuedBy: __nullable__(
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
    administrations: t.Array(
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
  {
    additionalProperties: false,
    description: `أمر طبي قائم على الإقامة. الحقول الدوائية مطابقة لـ\`PrescriptionItem\` عمدًا:
نفس محرّك الجرعة يتحقّق منها، ونفس مصدر الوزن، ونفس تصنيف التجاوز.`,
  },
);

export const InpatientOrderPlainInputCreate = t.Object(
  {
    idx: t.Optional(t.Integer()),
    kind: t.Union(
      [
        t.Literal("MEDICATION"),
        t.Literal("FLUID"),
        t.Literal("MONITORING"),
        t.Literal("FEEDING"),
        t.Literal("ACTIVITY"),
        t.Literal("WOUND_CARE"),
        t.Literal("LAB"),
        t.Literal("IMAGING"),
        t.Literal("OTHER"),
      ],
      {
        additionalProperties: false,
        description: `نوع الأمر الطبي. متطابق عمدًا مع \`PostOpOrderKind\` في مواضعه المشتركة، فتحويل
أوامر ما بعد العملية إلى أوامر تنويم يبقى ترجمةً واحدة لواحد.`,
      },
    ),
    status: t.Optional(
      t.Union(
        [
          t.Literal("ACTIVE"),
          t.Literal("PAUSED"),
          t.Literal("COMPLETED"),
          t.Literal("DISCONTINUED"),
        ],
        { additionalProperties: false },
      ),
    ),
    nameSnapshot: t.String(),
    doseAmount: t.Optional(__nullable__(t.Number())),
    doseUnit: t.Optional(__nullable__(t.String())),
    route: t.Optional(
      __nullable__(
        t.Union(
          [
            t.Literal("IV"),
            t.Literal("IM"),
            t.Literal("SC"),
            t.Literal("PO"),
            t.Literal("INHALATION"),
            t.Literal("TOPICAL"),
            t.Literal("EPIDURAL"),
            t.Literal("OTHER"),
          ],
          { additionalProperties: false },
        ),
      ),
    ),
    rateMlPerHour: t.Optional(__nullable__(t.Number())),
    doseSource: t.Optional(
      __nullable__(
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
    ),
    overrideReasonAr: t.Optional(__nullable__(t.String())),
    scheduleIntervalHours: t.Optional(
      __nullable__(
        t.Integer({
          description: `الجدولة: إمّا كل N ساعة، أو أوقات محدّدة من اليوم، أو عند اللزوم (بلا صفوف).
الثلاثة يتبادلن: \`prn\` صحيحة تُلغي التوليد المسبق أصلًا.`,
        }),
      ),
    ),
    scheduleTimes: t.Array(
      t.String({ description: `"08:00" بتوقيت العيادة` }),
      { additionalProperties: false },
    ),
    prn: t.Optional(t.Boolean()),
    startAt: t.Date(),
    endAt: t.Optional(__nullable__(t.Date())),
    instructionsAr: t.Optional(__nullable__(t.String())),
    discontinuedAt: t.Optional(__nullable__(t.Date())),
    discontinueReasonAr: t.Optional(__nullable__(t.String())),
  },
  {
    additionalProperties: false,
    description: `أمر طبي قائم على الإقامة. الحقول الدوائية مطابقة لـ\`PrescriptionItem\` عمدًا:
نفس محرّك الجرعة يتحقّق منها، ونفس مصدر الوزن، ونفس تصنيف التجاوز.`,
  },
);

export const InpatientOrderPlainInputUpdate = t.Object(
  {
    idx: t.Optional(t.Integer()),
    kind: t.Optional(
      t.Union(
        [
          t.Literal("MEDICATION"),
          t.Literal("FLUID"),
          t.Literal("MONITORING"),
          t.Literal("FEEDING"),
          t.Literal("ACTIVITY"),
          t.Literal("WOUND_CARE"),
          t.Literal("LAB"),
          t.Literal("IMAGING"),
          t.Literal("OTHER"),
        ],
        {
          additionalProperties: false,
          description: `نوع الأمر الطبي. متطابق عمدًا مع \`PostOpOrderKind\` في مواضعه المشتركة، فتحويل
أوامر ما بعد العملية إلى أوامر تنويم يبقى ترجمةً واحدة لواحد.`,
        },
      ),
    ),
    status: t.Optional(
      t.Union(
        [
          t.Literal("ACTIVE"),
          t.Literal("PAUSED"),
          t.Literal("COMPLETED"),
          t.Literal("DISCONTINUED"),
        ],
        { additionalProperties: false },
      ),
    ),
    nameSnapshot: t.Optional(t.String()),
    doseAmount: t.Optional(__nullable__(t.Number())),
    doseUnit: t.Optional(__nullable__(t.String())),
    route: t.Optional(
      __nullable__(
        t.Union(
          [
            t.Literal("IV"),
            t.Literal("IM"),
            t.Literal("SC"),
            t.Literal("PO"),
            t.Literal("INHALATION"),
            t.Literal("TOPICAL"),
            t.Literal("EPIDURAL"),
            t.Literal("OTHER"),
          ],
          { additionalProperties: false },
        ),
      ),
    ),
    rateMlPerHour: t.Optional(__nullable__(t.Number())),
    doseSource: t.Optional(
      __nullable__(
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
    ),
    overrideReasonAr: t.Optional(__nullable__(t.String())),
    scheduleIntervalHours: t.Optional(
      __nullable__(
        t.Integer({
          description: `الجدولة: إمّا كل N ساعة، أو أوقات محدّدة من اليوم، أو عند اللزوم (بلا صفوف).
الثلاثة يتبادلن: \`prn\` صحيحة تُلغي التوليد المسبق أصلًا.`,
        }),
      ),
    ),
    scheduleTimes: t.Optional(
      t.Array(t.String({ description: `"08:00" بتوقيت العيادة` }), {
        additionalProperties: false,
      }),
    ),
    prn: t.Optional(t.Boolean()),
    startAt: t.Optional(t.Date()),
    endAt: t.Optional(__nullable__(t.Date())),
    instructionsAr: t.Optional(__nullable__(t.String())),
    discontinuedAt: t.Optional(__nullable__(t.Date())),
    discontinueReasonAr: t.Optional(__nullable__(t.String())),
  },
  {
    additionalProperties: false,
    description: `أمر طبي قائم على الإقامة. الحقول الدوائية مطابقة لـ\`PrescriptionItem\` عمدًا:
نفس محرّك الجرعة يتحقّق منها، ونفس مصدر الوزن، ونفس تصنيف التجاوز.`,
  },
);

export const InpatientOrderRelationsInputCreate = t.Object(
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
    orderedBy: t.Optional(
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
    discontinuedBy: t.Optional(
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
    administrations: t.Optional(
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
    description: `أمر طبي قائم على الإقامة. الحقول الدوائية مطابقة لـ\`PrescriptionItem\` عمدًا:
نفس محرّك الجرعة يتحقّق منها، ونفس مصدر الوزن، ونفس تصنيف التجاوز.`,
  },
);

export const InpatientOrderRelationsInputUpdate = t.Partial(
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
      orderedBy: t.Partial(
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
      discontinuedBy: t.Partial(
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
      administrations: t.Partial(
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
      description: `أمر طبي قائم على الإقامة. الحقول الدوائية مطابقة لـ\`PrescriptionItem\` عمدًا:
نفس محرّك الجرعة يتحقّق منها، ونفس مصدر الوزن، ونفس تصنيف التجاوز.`,
    },
  ),
);

export const InpatientOrderWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          stayId: t.String(),
          idx: t.Integer(),
          kind: t.Union(
            [
              t.Literal("MEDICATION"),
              t.Literal("FLUID"),
              t.Literal("MONITORING"),
              t.Literal("FEEDING"),
              t.Literal("ACTIVITY"),
              t.Literal("WOUND_CARE"),
              t.Literal("LAB"),
              t.Literal("IMAGING"),
              t.Literal("OTHER"),
            ],
            {
              additionalProperties: false,
              description: `نوع الأمر الطبي. متطابق عمدًا مع \`PostOpOrderKind\` في مواضعه المشتركة، فتحويل
أوامر ما بعد العملية إلى أوامر تنويم يبقى ترجمةً واحدة لواحد.`,
            },
          ),
          status: t.Union(
            [
              t.Literal("ACTIVE"),
              t.Literal("PAUSED"),
              t.Literal("COMPLETED"),
              t.Literal("DISCONTINUED"),
            ],
            { additionalProperties: false },
          ),
          inventoryItemId: t.String({
            description: `أحد ثلاثة مصادر للمادة: صنف مخزون، أو منتج كتالوج، أو نصّ حرّ. الاسم مُثبَّت
دائمًا فلا يتغيّر ما هو مكتوب على السجل بتعديل الكتالوج.`,
          }),
          catalogProductId: t.String(),
          nameSnapshot: t.String(),
          prescriptionItemId: t.String({
            description: `[IP3] بند الوصفة الذي صُرف فأنشأ هذا الأمر. حين يُضبط: المخزون خُصم في
الصيدلية لحظة الصرف، فإعطاء الجرعة لا يخصم ثانيةً ولا يُسعِّر. عمود قياسيّ.`,
          }),
          doseAmount: t.Number(),
          doseUnit: t.String(),
          route: t.Union(
            [
              t.Literal("IV"),
              t.Literal("IM"),
              t.Literal("SC"),
              t.Literal("PO"),
              t.Literal("INHALATION"),
              t.Literal("TOPICAL"),
              t.Literal("EPIDURAL"),
              t.Literal("OTHER"),
            ],
            { additionalProperties: false },
          ),
          rateMlPerHour: t.Number(),
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
          overrideReasonAr: t.String(),
          scheduleIntervalHours: t.Integer({
            description: `الجدولة: إمّا كل N ساعة، أو أوقات محدّدة من اليوم، أو عند اللزوم (بلا صفوف).
الثلاثة يتبادلن: \`prn\` صحيحة تُلغي التوليد المسبق أصلًا.`,
          }),
          scheduleTimes: t.Array(
            t.String({ description: `"08:00" بتوقيت العيادة` }),
            { additionalProperties: false },
          ),
          prn: t.Boolean(),
          startAt: t.Date(),
          endAt: t.Date(),
          instructionsAr: t.String(),
          orderedById: t.String(),
          discontinuedById: t.String(),
          discontinuedAt: t.Date(),
          discontinueReasonAr: t.String(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `أمر طبي قائم على الإقامة. الحقول الدوائية مطابقة لـ\`PrescriptionItem\` عمدًا:
نفس محرّك الجرعة يتحقّق منها، ونفس مصدر الوزن، ونفس تصنيف التجاوز.`,
        },
      ),
    { $id: "InpatientOrder" },
  ),
);

export const InpatientOrderWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.String() },
            {
              additionalProperties: false,
              description: `أمر طبي قائم على الإقامة. الحقول الدوائية مطابقة لـ\`PrescriptionItem\` عمدًا:
نفس محرّك الجرعة يتحقّق منها، ونفس مصدر الوزن، ونفس تصنيف التجاوز.`,
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
              idx: t.Integer(),
              kind: t.Union(
                [
                  t.Literal("MEDICATION"),
                  t.Literal("FLUID"),
                  t.Literal("MONITORING"),
                  t.Literal("FEEDING"),
                  t.Literal("ACTIVITY"),
                  t.Literal("WOUND_CARE"),
                  t.Literal("LAB"),
                  t.Literal("IMAGING"),
                  t.Literal("OTHER"),
                ],
                {
                  additionalProperties: false,
                  description: `نوع الأمر الطبي. متطابق عمدًا مع \`PostOpOrderKind\` في مواضعه المشتركة، فتحويل
أوامر ما بعد العملية إلى أوامر تنويم يبقى ترجمةً واحدة لواحد.`,
                },
              ),
              status: t.Union(
                [
                  t.Literal("ACTIVE"),
                  t.Literal("PAUSED"),
                  t.Literal("COMPLETED"),
                  t.Literal("DISCONTINUED"),
                ],
                { additionalProperties: false },
              ),
              inventoryItemId: t.String({
                description: `أحد ثلاثة مصادر للمادة: صنف مخزون، أو منتج كتالوج، أو نصّ حرّ. الاسم مُثبَّت
دائمًا فلا يتغيّر ما هو مكتوب على السجل بتعديل الكتالوج.`,
              }),
              catalogProductId: t.String(),
              nameSnapshot: t.String(),
              prescriptionItemId: t.String({
                description: `[IP3] بند الوصفة الذي صُرف فأنشأ هذا الأمر. حين يُضبط: المخزون خُصم في
الصيدلية لحظة الصرف، فإعطاء الجرعة لا يخصم ثانيةً ولا يُسعِّر. عمود قياسيّ.`,
              }),
              doseAmount: t.Number(),
              doseUnit: t.String(),
              route: t.Union(
                [
                  t.Literal("IV"),
                  t.Literal("IM"),
                  t.Literal("SC"),
                  t.Literal("PO"),
                  t.Literal("INHALATION"),
                  t.Literal("TOPICAL"),
                  t.Literal("EPIDURAL"),
                  t.Literal("OTHER"),
                ],
                { additionalProperties: false },
              ),
              rateMlPerHour: t.Number(),
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
              overrideReasonAr: t.String(),
              scheduleIntervalHours: t.Integer({
                description: `الجدولة: إمّا كل N ساعة، أو أوقات محدّدة من اليوم، أو عند اللزوم (بلا صفوف).
الثلاثة يتبادلن: \`prn\` صحيحة تُلغي التوليد المسبق أصلًا.`,
              }),
              scheduleTimes: t.Array(
                t.String({ description: `"08:00" بتوقيت العيادة` }),
                { additionalProperties: false },
              ),
              prn: t.Boolean(),
              startAt: t.Date(),
              endAt: t.Date(),
              instructionsAr: t.String(),
              orderedById: t.String(),
              discontinuedById: t.String(),
              discontinuedAt: t.Date(),
              discontinueReasonAr: t.String(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "InpatientOrder" },
);

export const InpatientOrderSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      stayId: t.Boolean(),
      idx: t.Boolean(),
      kind: t.Boolean(),
      status: t.Boolean(),
      inventoryItemId: t.Boolean(),
      catalogProductId: t.Boolean(),
      nameSnapshot: t.Boolean(),
      prescriptionItemId: t.Boolean(),
      doseAmount: t.Boolean(),
      doseUnit: t.Boolean(),
      route: t.Boolean(),
      rateMlPerHour: t.Boolean(),
      doseSource: t.Boolean(),
      overrideReasonAr: t.Boolean(),
      scheduleIntervalHours: t.Boolean(),
      scheduleTimes: t.Boolean(),
      prn: t.Boolean(),
      startAt: t.Boolean(),
      endAt: t.Boolean(),
      instructionsAr: t.Boolean(),
      orderedById: t.Boolean(),
      discontinuedById: t.Boolean(),
      discontinuedAt: t.Boolean(),
      discontinueReasonAr: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      stay: t.Boolean(),
      inventoryItem: t.Boolean(),
      catalogProduct: t.Boolean(),
      orderedBy: t.Boolean(),
      discontinuedBy: t.Boolean(),
      administrations: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `أمر طبي قائم على الإقامة. الحقول الدوائية مطابقة لـ\`PrescriptionItem\` عمدًا:
نفس محرّك الجرعة يتحقّق منها، ونفس مصدر الوزن، ونفس تصنيف التجاوز.`,
    },
  ),
);

export const InpatientOrderInclude = t.Partial(
  t.Object(
    {
      kind: t.Boolean(),
      status: t.Boolean(),
      route: t.Boolean(),
      doseSource: t.Boolean(),
      stay: t.Boolean(),
      inventoryItem: t.Boolean(),
      catalogProduct: t.Boolean(),
      orderedBy: t.Boolean(),
      discontinuedBy: t.Boolean(),
      administrations: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `أمر طبي قائم على الإقامة. الحقول الدوائية مطابقة لـ\`PrescriptionItem\` عمدًا:
نفس محرّك الجرعة يتحقّق منها، ونفس مصدر الوزن، ونفس تصنيف التجاوز.`,
    },
  ),
);

export const InpatientOrderOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      stayId: t.Union([t.Literal("asc"), t.Literal("desc")], {
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
      prescriptionItemId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      doseAmount: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      doseUnit: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      rateMlPerHour: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      overrideReasonAr: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      scheduleIntervalHours: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      scheduleTimes: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      prn: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      startAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      endAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      instructionsAr: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      orderedById: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      discontinuedById: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      discontinuedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      discontinueReasonAr: t.Union([t.Literal("asc"), t.Literal("desc")], {
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
      description: `أمر طبي قائم على الإقامة. الحقول الدوائية مطابقة لـ\`PrescriptionItem\` عمدًا:
نفس محرّك الجرعة يتحقّق منها، ونفس مصدر الوزن، ونفس تصنيف التجاوز.`,
    },
  ),
);

export const InpatientOrder = t.Composite(
  [InpatientOrderPlain, InpatientOrderRelations],
  { additionalProperties: false },
);

export const InpatientOrderInputCreate = t.Composite(
  [InpatientOrderPlainInputCreate, InpatientOrderRelationsInputCreate],
  { additionalProperties: false },
);

export const InpatientOrderInputUpdate = t.Composite(
  [InpatientOrderPlainInputUpdate, InpatientOrderRelationsInputUpdate],
  { additionalProperties: false },
);
