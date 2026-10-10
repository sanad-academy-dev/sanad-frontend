import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const ExamTemplatePlain = t.Object(
  {
    id: t.String(),
    clinicId: __nullable__(
      t.String({
        description: `null = قالب نظام تراه كل العيادات. الكاتب الوحيد لهذا الفرع هو الهجرات:
واجهة القوالب تملأ \`clinicId\` من الجلسة دائمًا، فلا تستطيع عيادة أن تُنشئ
قالب نظام. ولذلك لا قيد فرادة على صفوف النظام — Postgres يعدّ الـNULLات
متمايزة، و\`@@unique\` أدناه يغطّي قوالب العيادات وحدها. القيد الحقيقي على
صفوف النظام هو أن هجرة البذر وحدها تكتبها، وهي تُدرج بشرط عدم الوجود.`,
      }),
    ),
    key: t.String({
      description: `مفتاح ثابت مدى حياة القالب: GENERAL_V1 · VOMITING_V1 · DERM_V1`,
    }),
    version: t.Integer(),
    titleAr: t.String(),
    titleEn: __nullable__(t.String()),
    presentingComplaint: __nullable__(
      t.String({
        description: `الشكوى التي يبحث بها الطبيب عن القالب — «قيء» · «عرج»`,
      }),
    ),
    animalTypeId: __nullable__(
      t.String({
        description: `null = كل الأنواع. مفتاح أجنبي لا نصّ (القرار §11-B): القوالب بيانات تديرها
العيادة، والنصّ المكتوب خطأً يطابق لا شيء بصمت.`,
      }),
    ),
    blocks: t.Any({
      description: `ExamBlock[] — الوصف في §4 من الخطة، ويُتحقَّق منه بـTypeBox عند الكتابة.
كل كتلة تحمل قسمها S|O|A|P — وهذا وحده ما يجعله قالب SOAP لا بانيَ نماذج.`,
    }),
    isDefault: t.Boolean({
      description: `يُقترح تلقائيًا لهذه الشكوى/النوع (نمط \`RadiologyReportTemplate\`)`,
    }),
    active: t.Boolean(),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  },
  {
    additionalProperties: false,
    description: `قالب فحص لكل شكوى — نظامي (\`clinicId = null\`) أو خاصّ بعيادة، ومُصدَّر.`,
  },
);

export const ExamTemplateRelations = t.Object(
  {
    clinic: __nullable__(
      t.Object(
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
    ),
    animalType: __nullable__(
      t.Object(
        {
          id: t.String(),
          code: __nullable__(t.String()),
          arName: t.String(),
          enName: t.String(),
          isDefault: t.Boolean(),
          clinicId: __nullable__(t.String()),
          createdAt: t.Date(),
          species: __nullable__(
            t.Union(
              [
                t.Literal("DOG"),
                t.Literal("CAT"),
                t.Literal("HORSE"),
                t.Literal("CATTLE"),
                t.Literal("SHEEP"),
                t.Literal("GOAT"),
                t.Literal("CAMEL"),
                t.Literal("POULTRY"),
                t.Literal("RABBIT"),
                t.Literal("SWINE"),
                t.Literal("FISH"),
                t.Literal("BEE"),
              ],
              { additionalProperties: false },
            ),
          ),
        },
        { additionalProperties: false },
      ),
    ),
    notes: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          patientId: t.String({
            description: `مالك السجل هو الحيوان لا الموعد — ولهذا يبقى السجل حين يُحذف الموعد`,
          }),
          appointmentId: __nullable__(
            t.String({
              description: `null = ملاحظة بلا زيارة: استشارة هاتفية، فرز مراجع، أو رأي طبيب ثانٍ
(القرار §11-A). الموعد الواحد يحتمل أكثر من ملاحظة.`,
            }),
          ),
          templateId: __nullable__(
            t.String({
              description: `لقطة القالب — يبقى \`templateKey\`/\`templateVersion\` مقروءَين حتى لو حُذف الصف`,
            }),
          ),
          templateKey: __nullable__(t.String()),
          templateVersion: __nullable__(t.Integer()),
          authorUserId: t.String(),
          status: t.Union(
            [t.Literal("DRAFT"), t.Literal("FINAL"), t.Literal("AMENDED")],
            { additionalProperties: false },
          ),
          subjective: __nullable__(
            t.String({
              description: `النصّ المُركَّب — ما يقرأه إنسان. يُجمَّد عند التوثيق، ولا يتغيّر إذا عُدّل
القالب لاحقًا. هي نفس غريزة \`Invoice.priceSnapshot\`.`,
            }),
          ),
          objective: __nullable__(t.String()),
          assessment: __nullable__(t.String()),
          plan: __nullable__(t.String()),
          answers: t.Any({
            description: `{ [blockId]: value } — البنية القابلة للاستعلام، وهي ما تقرأه التقارير`,
          }),
          vitalsRecordId: __nullable__(
            t.String({
              description: `يُشار إلى القياس ولا يُعاد التقاطه — وحدة العلامات الحيوية تبقى الكاتب الوحيد`,
            }),
          ),
          finalizedAt: __nullable__(t.Date()),
          finalizedById: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `ملاحظة سريرية واحدة — مسوَّدة تُكتب بحرّية، ثم تُوثَّق فلا تُعدَّل بعدها أبدًا.`,
        },
      ),
      { additionalProperties: false },
    ),
    consultationConfigs: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          consultationTypeId: t.String(),
          price: __nullable__(t.Number()),
          examTemplateId: __nullable__(
            t.String({
              description: `قالب الفحص الافتراضي لهذا الكشف. null = لا تخصيص، فيسقط الترشيح إلى القالب
العامّ (GENERAL_V1) كما كان. الموضع هنا لا على \`ConsultationType\` نفسه لأن
أنواع الكشف قد تكون عالمية (\`clinicId = null\`)، والقالب مِلك عيادة بعينها —
وهذا الجدول هو بالضبط «إعداد هذه العيادة لهذا النوع».
SetNull لا Cascade: حذف قالب لا يجوز أن يحذف تسعيرة الكشف معه.`,
            }),
          ),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
  },
  {
    additionalProperties: false,
    description: `قالب فحص لكل شكوى — نظامي (\`clinicId = null\`) أو خاصّ بعيادة، ومُصدَّر.`,
  },
);

export const ExamTemplatePlainInputCreate = t.Object(
  {
    key: t.String({
      description: `مفتاح ثابت مدى حياة القالب: GENERAL_V1 · VOMITING_V1 · DERM_V1`,
    }),
    version: t.Optional(t.Integer()),
    titleAr: t.String(),
    titleEn: t.Optional(__nullable__(t.String())),
    presentingComplaint: t.Optional(
      __nullable__(
        t.String({
          description: `الشكوى التي يبحث بها الطبيب عن القالب — «قيء» · «عرج»`,
        }),
      ),
    ),
    blocks: t.Any({
      description: `ExamBlock[] — الوصف في §4 من الخطة، ويُتحقَّق منه بـTypeBox عند الكتابة.
كل كتلة تحمل قسمها S|O|A|P — وهذا وحده ما يجعله قالب SOAP لا بانيَ نماذج.`,
    }),
    isDefault: t.Optional(
      t.Boolean({
        description: `يُقترح تلقائيًا لهذه الشكوى/النوع (نمط \`RadiologyReportTemplate\`)`,
      }),
    ),
    active: t.Optional(t.Boolean()),
  },
  {
    additionalProperties: false,
    description: `قالب فحص لكل شكوى — نظامي (\`clinicId = null\`) أو خاصّ بعيادة، ومُصدَّر.`,
  },
);

export const ExamTemplatePlainInputUpdate = t.Object(
  {
    key: t.Optional(
      t.String({
        description: `مفتاح ثابت مدى حياة القالب: GENERAL_V1 · VOMITING_V1 · DERM_V1`,
      }),
    ),
    version: t.Optional(t.Integer()),
    titleAr: t.Optional(t.String()),
    titleEn: t.Optional(__nullable__(t.String())),
    presentingComplaint: t.Optional(
      __nullable__(
        t.String({
          description: `الشكوى التي يبحث بها الطبيب عن القالب — «قيء» · «عرج»`,
        }),
      ),
    ),
    blocks: t.Optional(
      t.Any({
        description: `ExamBlock[] — الوصف في §4 من الخطة، ويُتحقَّق منه بـTypeBox عند الكتابة.
كل كتلة تحمل قسمها S|O|A|P — وهذا وحده ما يجعله قالب SOAP لا بانيَ نماذج.`,
      }),
    ),
    isDefault: t.Optional(
      t.Boolean({
        description: `يُقترح تلقائيًا لهذه الشكوى/النوع (نمط \`RadiologyReportTemplate\`)`,
      }),
    ),
    active: t.Optional(t.Boolean()),
  },
  {
    additionalProperties: false,
    description: `قالب فحص لكل شكوى — نظامي (\`clinicId = null\`) أو خاصّ بعيادة، ومُصدَّر.`,
  },
);

export const ExamTemplateRelationsInputCreate = t.Object(
  {
    clinic: t.Optional(
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
    animalType: t.Optional(
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
    notes: t.Optional(
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
    consultationConfigs: t.Optional(
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
    description: `قالب فحص لكل شكوى — نظامي (\`clinicId = null\`) أو خاصّ بعيادة، ومُصدَّر.`,
  },
);

export const ExamTemplateRelationsInputUpdate = t.Partial(
  t.Object(
    {
      clinic: t.Partial(
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
      animalType: t.Partial(
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
      notes: t.Partial(
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
      consultationConfigs: t.Partial(
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
      description: `قالب فحص لكل شكوى — نظامي (\`clinicId = null\`) أو خاصّ بعيادة، ومُصدَّر.`,
    },
  ),
);

export const ExamTemplateWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          clinicId: t.String({
            description: `null = قالب نظام تراه كل العيادات. الكاتب الوحيد لهذا الفرع هو الهجرات:
واجهة القوالب تملأ \`clinicId\` من الجلسة دائمًا، فلا تستطيع عيادة أن تُنشئ
قالب نظام. ولذلك لا قيد فرادة على صفوف النظام — Postgres يعدّ الـNULLات
متمايزة، و\`@@unique\` أدناه يغطّي قوالب العيادات وحدها. القيد الحقيقي على
صفوف النظام هو أن هجرة البذر وحدها تكتبها، وهي تُدرج بشرط عدم الوجود.`,
          }),
          key: t.String({
            description: `مفتاح ثابت مدى حياة القالب: GENERAL_V1 · VOMITING_V1 · DERM_V1`,
          }),
          version: t.Integer(),
          titleAr: t.String(),
          titleEn: t.String(),
          presentingComplaint: t.String({
            description: `الشكوى التي يبحث بها الطبيب عن القالب — «قيء» · «عرج»`,
          }),
          animalTypeId: t.String({
            description: `null = كل الأنواع. مفتاح أجنبي لا نصّ (القرار §11-B): القوالب بيانات تديرها
العيادة، والنصّ المكتوب خطأً يطابق لا شيء بصمت.`,
          }),
          blocks: t.Any({
            description: `ExamBlock[] — الوصف في §4 من الخطة، ويُتحقَّق منه بـTypeBox عند الكتابة.
كل كتلة تحمل قسمها S|O|A|P — وهذا وحده ما يجعله قالب SOAP لا بانيَ نماذج.`,
          }),
          isDefault: t.Boolean({
            description: `يُقترح تلقائيًا لهذه الشكوى/النوع (نمط \`RadiologyReportTemplate\`)`,
          }),
          active: t.Boolean(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `قالب فحص لكل شكوى — نظامي (\`clinicId = null\`) أو خاصّ بعيادة، ومُصدَّر.`,
        },
      ),
    { $id: "ExamTemplate" },
  ),
);

export const ExamTemplateWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            {
              id: t.String(),
              clinicId_key_version: t.Object(
                {
                  clinicId: t.String({
                    description: `null = قالب نظام تراه كل العيادات. الكاتب الوحيد لهذا الفرع هو الهجرات:
واجهة القوالب تملأ \`clinicId\` من الجلسة دائمًا، فلا تستطيع عيادة أن تُنشئ
قالب نظام. ولذلك لا قيد فرادة على صفوف النظام — Postgres يعدّ الـNULLات
متمايزة، و\`@@unique\` أدناه يغطّي قوالب العيادات وحدها. القيد الحقيقي على
صفوف النظام هو أن هجرة البذر وحدها تكتبها، وهي تُدرج بشرط عدم الوجود.`,
                  }),
                  key: t.String({
                    description: `مفتاح ثابت مدى حياة القالب: GENERAL_V1 · VOMITING_V1 · DERM_V1`,
                  }),
                  version: t.Integer(),
                },
                { additionalProperties: false },
              ),
            },
            {
              additionalProperties: false,
              description: `قالب فحص لكل شكوى — نظامي (\`clinicId = null\`) أو خاصّ بعيادة، ومُصدَّر.`,
            },
          ),
          { additionalProperties: false },
        ),
        t.Union(
          [
            t.Object({ id: t.String() }),
            t.Object({
              clinicId_key_version: t.Object(
                {
                  clinicId: t.String({
                    description: `null = قالب نظام تراه كل العيادات. الكاتب الوحيد لهذا الفرع هو الهجرات:
واجهة القوالب تملأ \`clinicId\` من الجلسة دائمًا، فلا تستطيع عيادة أن تُنشئ
قالب نظام. ولذلك لا قيد فرادة على صفوف النظام — Postgres يعدّ الـNULLات
متمايزة، و\`@@unique\` أدناه يغطّي قوالب العيادات وحدها. القيد الحقيقي على
صفوف النظام هو أن هجرة البذر وحدها تكتبها، وهي تُدرج بشرط عدم الوجود.`,
                  }),
                  key: t.String({
                    description: `مفتاح ثابت مدى حياة القالب: GENERAL_V1 · VOMITING_V1 · DERM_V1`,
                  }),
                  version: t.Integer(),
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
              clinicId: t.String({
                description: `null = قالب نظام تراه كل العيادات. الكاتب الوحيد لهذا الفرع هو الهجرات:
واجهة القوالب تملأ \`clinicId\` من الجلسة دائمًا، فلا تستطيع عيادة أن تُنشئ
قالب نظام. ولذلك لا قيد فرادة على صفوف النظام — Postgres يعدّ الـNULLات
متمايزة، و\`@@unique\` أدناه يغطّي قوالب العيادات وحدها. القيد الحقيقي على
صفوف النظام هو أن هجرة البذر وحدها تكتبها، وهي تُدرج بشرط عدم الوجود.`,
              }),
              key: t.String({
                description: `مفتاح ثابت مدى حياة القالب: GENERAL_V1 · VOMITING_V1 · DERM_V1`,
              }),
              version: t.Integer(),
              titleAr: t.String(),
              titleEn: t.String(),
              presentingComplaint: t.String({
                description: `الشكوى التي يبحث بها الطبيب عن القالب — «قيء» · «عرج»`,
              }),
              animalTypeId: t.String({
                description: `null = كل الأنواع. مفتاح أجنبي لا نصّ (القرار §11-B): القوالب بيانات تديرها
العيادة، والنصّ المكتوب خطأً يطابق لا شيء بصمت.`,
              }),
              blocks: t.Any({
                description: `ExamBlock[] — الوصف في §4 من الخطة، ويُتحقَّق منه بـTypeBox عند الكتابة.
كل كتلة تحمل قسمها S|O|A|P — وهذا وحده ما يجعله قالب SOAP لا بانيَ نماذج.`,
              }),
              isDefault: t.Boolean({
                description: `يُقترح تلقائيًا لهذه الشكوى/النوع (نمط \`RadiologyReportTemplate\`)`,
              }),
              active: t.Boolean(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "ExamTemplate" },
);

export const ExamTemplateSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      clinicId: t.Boolean(),
      key: t.Boolean(),
      version: t.Boolean(),
      titleAr: t.Boolean(),
      titleEn: t.Boolean(),
      presentingComplaint: t.Boolean(),
      animalTypeId: t.Boolean(),
      blocks: t.Boolean(),
      isDefault: t.Boolean(),
      active: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinic: t.Boolean(),
      animalType: t.Boolean(),
      notes: t.Boolean(),
      consultationConfigs: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `قالب فحص لكل شكوى — نظامي (\`clinicId = null\`) أو خاصّ بعيادة، ومُصدَّر.`,
    },
  ),
);

export const ExamTemplateInclude = t.Partial(
  t.Object(
    {
      clinic: t.Boolean(),
      animalType: t.Boolean(),
      notes: t.Boolean(),
      consultationConfigs: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `قالب فحص لكل شكوى — نظامي (\`clinicId = null\`) أو خاصّ بعيادة، ومُصدَّر.`,
    },
  ),
);

export const ExamTemplateOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clinicId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      key: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      version: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      titleAr: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      titleEn: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      presentingComplaint: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      animalTypeId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      blocks: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      isDefault: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      active: t.Union([t.Literal("asc"), t.Literal("desc")], {
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
      description: `قالب فحص لكل شكوى — نظامي (\`clinicId = null\`) أو خاصّ بعيادة، ومُصدَّر.`,
    },
  ),
);

export const ExamTemplate = t.Composite(
  [ExamTemplatePlain, ExamTemplateRelations],
  { additionalProperties: false },
);

export const ExamTemplateInputCreate = t.Composite(
  [ExamTemplatePlainInputCreate, ExamTemplateRelationsInputCreate],
  { additionalProperties: false },
);

export const ExamTemplateInputUpdate = t.Composite(
  [ExamTemplatePlainInputUpdate, ExamTemplateRelationsInputUpdate],
  { additionalProperties: false },
);
