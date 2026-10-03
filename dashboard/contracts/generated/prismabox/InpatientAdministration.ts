import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const InpatientAdministrationPlain = t.Object(
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
);

export const InpatientAdministrationRelations = t.Object(
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
    order: t.Object(
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
    warehouse: __nullable__(
      t.Object(
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
    ),
    vitalSignsRecord: __nullable__(
      t.Object(
        {
          id: t.String(),
          code: t.String(),
          clinicId: t.String(),
          branchId: __nullable__(t.String()),
          patientId: t.String(),
          recordedAt: t.Date(),
          source: t.Union(
            [
              t.Literal("MANUAL"),
              t.Literal("VISIT"),
              t.Literal("LAB"),
              t.Literal("RADIOLOGY"),
              t.Literal("OPERATION"),
              t.Literal("GROOMING"),
              t.Literal("INPATIENT"),
              t.Literal("TRIAGE"),
            ],
            { additionalProperties: false },
          ),
          recordedById: __nullable__(t.String()),
          appointmentId: __nullable__(t.String()),
          labOrderId: __nullable__(t.String()),
          radiologyOrderId: __nullable__(t.String()),
          operationId: __nullable__(t.String()),
          inpatientStayId: __nullable__(t.String()),
          weight: __nullable__(t.Number()),
          temperature: __nullable__(t.Number()),
          heartRate: __nullable__(t.Integer()),
          respiratoryRate: __nullable__(t.Integer()),
          oxygenSaturation: __nullable__(t.Integer()),
          bloodPressure: __nullable__(t.String()),
          painScore: __nullable__(t.Integer()),
          bodyConditionScore: __nullable__(t.Integer()),
          capillaryRefillSec: __nullable__(t.Number()),
          mucousMembrane: __nullable__(
            t.Union(
              [
                t.Literal("PINK"),
                t.Literal("PALE"),
                t.Literal("CYANOTIC"),
                t.Literal("ICTERIC"),
                t.Literal("CONGESTED"),
                t.Literal("MUDDY"),
              ],
              { additionalProperties: false },
            ),
          ),
          notes: __nullable__(t.String()),
          correctsId: __nullable__(t.String()),
          isDeleted: t.Boolean(),
          deletedAt: __nullable__(t.Date()),
          editsCount: t.Integer(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    ),
    corrects: __nullable__(
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
    ),
    correction: __nullable__(
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
    ),
  },
  {
    additionalProperties: false,
    description: `صفّ التنفيذ الواحد — «الجرعة الثامنة مساءً» سطرًا قائمًا بذاته.
هذا هو جوهر الوحدة: ورقة العلاج التي تُملأ على القفص. الصفوف تُولَّد مقدَّمًا من
جدول الأمر، فتظهر في القائمة قبل موعدها، وتُعلَّم عند التنفيذ. صفٌّ حالته GIVEN
لا يُعدَّل أبدًا — التصحيح صفٌّ جديد يشير إليه، تمامًا كسجل العلامات الحيوية.`,
  },
);

export const InpatientAdministrationPlainInputCreate = t.Object(
  {
    dueAt: t.Date(),
    status: t.Optional(
      t.Union(
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
    ),
    givenAt: t.Optional(__nullable__(t.Date())),
    doseGivenAmount: t.Optional(__nullable__(t.Number())),
    doseGivenUnit: t.Optional(__nullable__(t.String())),
    stockQuantity: t.Optional(
      __nullable__(
        t.Integer({
          description: `الكمّية المخصومة من المخزون بوحدات المخزون — عدد صحيح عمدًا كما في
\`DispenseEvent.quantity\`: الجرعة السريرية (٢٥٠ مجم) والوحدة المخزنية
(أمبولة) رقمان مختلفان، وخلطُهما يجعل الصيدلية تختلف مع الدفتر إلى الأبد.
null = لم يُخصم مخزون (مراقبة، تغذية، صنف غير مرتبط).`,
        }),
      ),
    ),
    priceSnapshot: t.Optional(
      __nullable__(
        t.Number({
          description: `سعر الوحدة لحظة الإعطاء — الفوترة تقرأه ولا تعود إلى الكتالوج`,
        }),
      ),
    ),
    batchNoSnapshot: t.Optional(__nullable__(t.String())),
    expiryDateSnapshot: t.Optional(__nullable__(t.Date())),
    eatenFraction: t.Optional(
      __nullable__(
        t.Number({
          description: `حقول ورقة الرعاية المهيكلة — تُملأ لأوامر التغذية والملاحظة، لا للدواء.
مهيكلة لا نصّية لأنها ما يُرسم منه اتجاه: «لم يأكل منذ يومين» لا يُقرأ من ملاحظات.
0.00–1.00 من الوجبة المقدَّمة`,
        }),
      ),
    ),
    urination: t.Optional(__nullable__(t.Boolean())),
    defecation: t.Optional(__nullable__(t.Boolean())),
    vomiting: t.Optional(__nullable__(t.Boolean())),
    notesAr: t.Optional(__nullable__(t.String())),
    skipReasonAr: t.Optional(__nullable__(t.String())),
  },
  {
    additionalProperties: false,
    description: `صفّ التنفيذ الواحد — «الجرعة الثامنة مساءً» سطرًا قائمًا بذاته.
هذا هو جوهر الوحدة: ورقة العلاج التي تُملأ على القفص. الصفوف تُولَّد مقدَّمًا من
جدول الأمر، فتظهر في القائمة قبل موعدها، وتُعلَّم عند التنفيذ. صفٌّ حالته GIVEN
لا يُعدَّل أبدًا — التصحيح صفٌّ جديد يشير إليه، تمامًا كسجل العلامات الحيوية.`,
  },
);

export const InpatientAdministrationPlainInputUpdate = t.Object(
  {
    dueAt: t.Optional(t.Date()),
    status: t.Optional(
      t.Union(
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
    ),
    givenAt: t.Optional(__nullable__(t.Date())),
    doseGivenAmount: t.Optional(__nullable__(t.Number())),
    doseGivenUnit: t.Optional(__nullable__(t.String())),
    stockQuantity: t.Optional(
      __nullable__(
        t.Integer({
          description: `الكمّية المخصومة من المخزون بوحدات المخزون — عدد صحيح عمدًا كما في
\`DispenseEvent.quantity\`: الجرعة السريرية (٢٥٠ مجم) والوحدة المخزنية
(أمبولة) رقمان مختلفان، وخلطُهما يجعل الصيدلية تختلف مع الدفتر إلى الأبد.
null = لم يُخصم مخزون (مراقبة، تغذية، صنف غير مرتبط).`,
        }),
      ),
    ),
    priceSnapshot: t.Optional(
      __nullable__(
        t.Number({
          description: `سعر الوحدة لحظة الإعطاء — الفوترة تقرأه ولا تعود إلى الكتالوج`,
        }),
      ),
    ),
    batchNoSnapshot: t.Optional(__nullable__(t.String())),
    expiryDateSnapshot: t.Optional(__nullable__(t.Date())),
    eatenFraction: t.Optional(
      __nullable__(
        t.Number({
          description: `حقول ورقة الرعاية المهيكلة — تُملأ لأوامر التغذية والملاحظة، لا للدواء.
مهيكلة لا نصّية لأنها ما يُرسم منه اتجاه: «لم يأكل منذ يومين» لا يُقرأ من ملاحظات.
0.00–1.00 من الوجبة المقدَّمة`,
        }),
      ),
    ),
    urination: t.Optional(__nullable__(t.Boolean())),
    defecation: t.Optional(__nullable__(t.Boolean())),
    vomiting: t.Optional(__nullable__(t.Boolean())),
    notesAr: t.Optional(__nullable__(t.String())),
    skipReasonAr: t.Optional(__nullable__(t.String())),
  },
  {
    additionalProperties: false,
    description: `صفّ التنفيذ الواحد — «الجرعة الثامنة مساءً» سطرًا قائمًا بذاته.
هذا هو جوهر الوحدة: ورقة العلاج التي تُملأ على القفص. الصفوف تُولَّد مقدَّمًا من
جدول الأمر، فتظهر في القائمة قبل موعدها، وتُعلَّم عند التنفيذ. صفٌّ حالته GIVEN
لا يُعدَّل أبدًا — التصحيح صفٌّ جديد يشير إليه، تمامًا كسجل العلامات الحيوية.`,
  },
);

export const InpatientAdministrationRelationsInputCreate = t.Object(
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
    order: t.Object(
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
    warehouse: t.Optional(
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
    vitalSignsRecord: t.Optional(
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
    corrects: t.Optional(
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
    correction: t.Optional(
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
    description: `صفّ التنفيذ الواحد — «الجرعة الثامنة مساءً» سطرًا قائمًا بذاته.
هذا هو جوهر الوحدة: ورقة العلاج التي تُملأ على القفص. الصفوف تُولَّد مقدَّمًا من
جدول الأمر، فتظهر في القائمة قبل موعدها، وتُعلَّم عند التنفيذ. صفٌّ حالته GIVEN
لا يُعدَّل أبدًا — التصحيح صفٌّ جديد يشير إليه، تمامًا كسجل العلامات الحيوية.`,
  },
);

export const InpatientAdministrationRelationsInputUpdate = t.Partial(
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
      order: t.Object(
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
      warehouse: t.Partial(
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
      vitalSignsRecord: t.Partial(
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
      corrects: t.Partial(
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
      correction: t.Partial(
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
      description: `صفّ التنفيذ الواحد — «الجرعة الثامنة مساءً» سطرًا قائمًا بذاته.
هذا هو جوهر الوحدة: ورقة العلاج التي تُملأ على القفص. الصفوف تُولَّد مقدَّمًا من
جدول الأمر، فتظهر في القائمة قبل موعدها، وتُعلَّم عند التنفيذ. صفٌّ حالته GIVEN
لا يُعدَّل أبدًا — التصحيح صفٌّ جديد يشير إليه، تمامًا كسجل العلامات الحيوية.`,
    },
  ),
);

export const InpatientAdministrationWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
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
          givenAt: t.Date(),
          performedById: t.String(),
          witnessId: t.String({
            description: `الشاهد — إلزامي للمواد المراقَبة، ويجب أن يختلف عن المنفّذ (قاعدة سجل المراقَبة)`,
          }),
          doseGivenAmount: t.Number(),
          doseGivenUnit: t.String(),
          stockQuantity: t.Integer({
            description: `الكمّية المخصومة من المخزون بوحدات المخزون — عدد صحيح عمدًا كما في
\`DispenseEvent.quantity\`: الجرعة السريرية (٢٥٠ مجم) والوحدة المخزنية
(أمبولة) رقمان مختلفان، وخلطُهما يجعل الصيدلية تختلف مع الدفتر إلى الأبد.
null = لم يُخصم مخزون (مراقبة، تغذية، صنف غير مرتبط).`,
          }),
          warehouseId: t.String(),
          priceSnapshot: t.Number({
            description: `سعر الوحدة لحظة الإعطاء — الفوترة تقرأه ولا تعود إلى الكتالوج`,
          }),
          batchId: t.String({
            description: `لقطة الدفعة كما في \`DispenseEvent\`: الدفعة قد تُحذف أو يتغيّر رقمها، وما
دخل جسم الحيوان لا يتغيّر.`,
          }),
          batchNoSnapshot: t.String(),
          expiryDateSnapshot: t.Date(),
          vitalSignsRecordId: t.String({
            description: `أوامر المراقبة تنتهي بقياس — الصفّ يربط السجل الذي أُنشئ عند تنفيذه`,
          }),
          eatenFraction: t.Number({
            description: `حقول ورقة الرعاية المهيكلة — تُملأ لأوامر التغذية والملاحظة، لا للدواء.
مهيكلة لا نصّية لأنها ما يُرسم منه اتجاه: «لم يأكل منذ يومين» لا يُقرأ من ملاحظات.
0.00–1.00 من الوجبة المقدَّمة`,
          }),
          urination: t.Boolean(),
          defecation: t.Boolean(),
          vomiting: t.Boolean(),
          notesAr: t.String(),
          skipReasonAr: t.String(),
          correctsId: t.String({
            description: `سلسلة التصحيح — نفس آلية \`VitalSignsRecord.correctsId\``,
          }),
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
    { $id: "InpatientAdministration" },
  ),
);

export const InpatientAdministrationWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            {
              id: t.String(),
              vitalSignsRecordId: t.String({
                description: `أوامر المراقبة تنتهي بقياس — الصفّ يربط السجل الذي أُنشئ عند تنفيذه`,
              }),
              correctsId: t.String({
                description: `سلسلة التصحيح — نفس آلية \`VitalSignsRecord.correctsId\``,
              }),
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
        t.Union(
          [
            t.Object({ id: t.String() }),
            t.Object({
              vitalSignsRecordId: t.String({
                description: `أوامر المراقبة تنتهي بقياس — الصفّ يربط السجل الذي أُنشئ عند تنفيذه`,
              }),
            }),
            t.Object({
              correctsId: t.String({
                description: `سلسلة التصحيح — نفس آلية \`VitalSignsRecord.correctsId\``,
              }),
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
              givenAt: t.Date(),
              performedById: t.String(),
              witnessId: t.String({
                description: `الشاهد — إلزامي للمواد المراقَبة، ويجب أن يختلف عن المنفّذ (قاعدة سجل المراقَبة)`,
              }),
              doseGivenAmount: t.Number(),
              doseGivenUnit: t.String(),
              stockQuantity: t.Integer({
                description: `الكمّية المخصومة من المخزون بوحدات المخزون — عدد صحيح عمدًا كما في
\`DispenseEvent.quantity\`: الجرعة السريرية (٢٥٠ مجم) والوحدة المخزنية
(أمبولة) رقمان مختلفان، وخلطُهما يجعل الصيدلية تختلف مع الدفتر إلى الأبد.
null = لم يُخصم مخزون (مراقبة، تغذية، صنف غير مرتبط).`,
              }),
              warehouseId: t.String(),
              priceSnapshot: t.Number({
                description: `سعر الوحدة لحظة الإعطاء — الفوترة تقرأه ولا تعود إلى الكتالوج`,
              }),
              batchId: t.String({
                description: `لقطة الدفعة كما في \`DispenseEvent\`: الدفعة قد تُحذف أو يتغيّر رقمها، وما
دخل جسم الحيوان لا يتغيّر.`,
              }),
              batchNoSnapshot: t.String(),
              expiryDateSnapshot: t.Date(),
              vitalSignsRecordId: t.String({
                description: `أوامر المراقبة تنتهي بقياس — الصفّ يربط السجل الذي أُنشئ عند تنفيذه`,
              }),
              eatenFraction: t.Number({
                description: `حقول ورقة الرعاية المهيكلة — تُملأ لأوامر التغذية والملاحظة، لا للدواء.
مهيكلة لا نصّية لأنها ما يُرسم منه اتجاه: «لم يأكل منذ يومين» لا يُقرأ من ملاحظات.
0.00–1.00 من الوجبة المقدَّمة`,
              }),
              urination: t.Boolean(),
              defecation: t.Boolean(),
              vomiting: t.Boolean(),
              notesAr: t.String(),
              skipReasonAr: t.String(),
              correctsId: t.String({
                description: `سلسلة التصحيح — نفس آلية \`VitalSignsRecord.correctsId\``,
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
  { $id: "InpatientAdministration" },
);

export const InpatientAdministrationSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      stayId: t.Boolean(),
      orderId: t.Boolean(),
      dueAt: t.Boolean(),
      status: t.Boolean(),
      givenAt: t.Boolean(),
      performedById: t.Boolean(),
      witnessId: t.Boolean(),
      doseGivenAmount: t.Boolean(),
      doseGivenUnit: t.Boolean(),
      stockQuantity: t.Boolean(),
      warehouseId: t.Boolean(),
      priceSnapshot: t.Boolean(),
      batchId: t.Boolean(),
      batchNoSnapshot: t.Boolean(),
      expiryDateSnapshot: t.Boolean(),
      vitalSignsRecordId: t.Boolean(),
      eatenFraction: t.Boolean(),
      urination: t.Boolean(),
      defecation: t.Boolean(),
      vomiting: t.Boolean(),
      notesAr: t.Boolean(),
      skipReasonAr: t.Boolean(),
      correctsId: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      stay: t.Boolean(),
      order: t.Boolean(),
      performedBy: t.Boolean(),
      witness: t.Boolean(),
      batch: t.Boolean(),
      warehouse: t.Boolean(),
      vitalSignsRecord: t.Boolean(),
      corrects: t.Boolean(),
      correction: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `صفّ التنفيذ الواحد — «الجرعة الثامنة مساءً» سطرًا قائمًا بذاته.
هذا هو جوهر الوحدة: ورقة العلاج التي تُملأ على القفص. الصفوف تُولَّد مقدَّمًا من
جدول الأمر، فتظهر في القائمة قبل موعدها، وتُعلَّم عند التنفيذ. صفٌّ حالته GIVEN
لا يُعدَّل أبدًا — التصحيح صفٌّ جديد يشير إليه، تمامًا كسجل العلامات الحيوية.`,
    },
  ),
);

export const InpatientAdministrationInclude = t.Partial(
  t.Object(
    {
      status: t.Boolean(),
      stay: t.Boolean(),
      order: t.Boolean(),
      performedBy: t.Boolean(),
      witness: t.Boolean(),
      batch: t.Boolean(),
      warehouse: t.Boolean(),
      vitalSignsRecord: t.Boolean(),
      corrects: t.Boolean(),
      correction: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `صفّ التنفيذ الواحد — «الجرعة الثامنة مساءً» سطرًا قائمًا بذاته.
هذا هو جوهر الوحدة: ورقة العلاج التي تُملأ على القفص. الصفوف تُولَّد مقدَّمًا من
جدول الأمر، فتظهر في القائمة قبل موعدها، وتُعلَّم عند التنفيذ. صفٌّ حالته GIVEN
لا يُعدَّل أبدًا — التصحيح صفٌّ جديد يشير إليه، تمامًا كسجل العلامات الحيوية.`,
    },
  ),
);

export const InpatientAdministrationOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      stayId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      orderId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      dueAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      givenAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      performedById: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      witnessId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      doseGivenAmount: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      doseGivenUnit: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      stockQuantity: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      warehouseId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      priceSnapshot: t.Union([t.Literal("asc"), t.Literal("desc")], {
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
      vitalSignsRecordId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      eatenFraction: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      urination: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      defecation: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      vomiting: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      notesAr: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      skipReasonAr: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      correctsId: t.Union([t.Literal("asc"), t.Literal("desc")], {
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
      description: `صفّ التنفيذ الواحد — «الجرعة الثامنة مساءً» سطرًا قائمًا بذاته.
هذا هو جوهر الوحدة: ورقة العلاج التي تُملأ على القفص. الصفوف تُولَّد مقدَّمًا من
جدول الأمر، فتظهر في القائمة قبل موعدها، وتُعلَّم عند التنفيذ. صفٌّ حالته GIVEN
لا يُعدَّل أبدًا — التصحيح صفٌّ جديد يشير إليه، تمامًا كسجل العلامات الحيوية.`,
    },
  ),
);

export const InpatientAdministration = t.Composite(
  [InpatientAdministrationPlain, InpatientAdministrationRelations],
  { additionalProperties: false },
);

export const InpatientAdministrationInputCreate = t.Composite(
  [
    InpatientAdministrationPlainInputCreate,
    InpatientAdministrationRelationsInputCreate,
  ],
  { additionalProperties: false },
);

export const InpatientAdministrationInputUpdate = t.Composite(
  [
    InpatientAdministrationPlainInputUpdate,
    InpatientAdministrationRelationsInputUpdate,
  ],
  { additionalProperties: false },
);
