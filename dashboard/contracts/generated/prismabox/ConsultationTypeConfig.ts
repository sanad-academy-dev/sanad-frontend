import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const ConsultationTypeConfigPlain = t.Object(
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
);

export const ConsultationTypeConfigRelations = t.Object(
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
    consultationType: t.Object(
      {
        id: t.String(),
        clinicId: __nullable__(t.String()),
        name: t.String(),
        isDefault: t.Boolean(),
        active: t.Boolean(),
        order: t.Integer(),
        createdAt: t.Date(),
        updatedAt: t.Date(),
      },
      { additionalProperties: false },
    ),
    examTemplate: __nullable__(
      t.Object(
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
      ),
    ),
  },
  { additionalProperties: false },
);

export const ConsultationTypeConfigPlainInputCreate = t.Object(
  { price: t.Optional(__nullable__(t.Number())) },
  { additionalProperties: false },
);

export const ConsultationTypeConfigPlainInputUpdate = t.Object(
  { price: t.Optional(__nullable__(t.Number())) },
  { additionalProperties: false },
);

export const ConsultationTypeConfigRelationsInputCreate = t.Object(
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
    consultationType: t.Object(
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
    examTemplate: t.Optional(
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
  { additionalProperties: false },
);

export const ConsultationTypeConfigRelationsInputUpdate = t.Partial(
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
      consultationType: t.Object(
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
      examTemplate: t.Partial(
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
    { additionalProperties: false },
  ),
);

export const ConsultationTypeConfigWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          clinicId: t.String(),
          consultationTypeId: t.String(),
          price: t.Number(),
          examTemplateId: t.String({
            description: `قالب الفحص الافتراضي لهذا الكشف. null = لا تخصيص، فيسقط الترشيح إلى القالب
العامّ (GENERAL_V1) كما كان. الموضع هنا لا على \`ConsultationType\` نفسه لأن
أنواع الكشف قد تكون عالمية (\`clinicId = null\`)، والقالب مِلك عيادة بعينها —
وهذا الجدول هو بالضبط «إعداد هذه العيادة لهذا النوع».
SetNull لا Cascade: حذف قالب لا يجوز أن يحذف تسعيرة الكشف معه.`,
          }),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "ConsultationTypeConfig" },
  ),
);

export const ConsultationTypeConfigWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            {
              id: t.String(),
              clinicId_consultationTypeId: t.Object(
                { clinicId: t.String(), consultationTypeId: t.String() },
                { additionalProperties: false },
              ),
            },
            { additionalProperties: false },
          ),
          { additionalProperties: false },
        ),
        t.Union(
          [
            t.Object({ id: t.String() }),
            t.Object({
              clinicId_consultationTypeId: t.Object(
                { clinicId: t.String(), consultationTypeId: t.String() },
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
              consultationTypeId: t.String(),
              price: t.Number(),
              examTemplateId: t.String({
                description: `قالب الفحص الافتراضي لهذا الكشف. null = لا تخصيص، فيسقط الترشيح إلى القالب
العامّ (GENERAL_V1) كما كان. الموضع هنا لا على \`ConsultationType\` نفسه لأن
أنواع الكشف قد تكون عالمية (\`clinicId = null\`)، والقالب مِلك عيادة بعينها —
وهذا الجدول هو بالضبط «إعداد هذه العيادة لهذا النوع».
SetNull لا Cascade: حذف قالب لا يجوز أن يحذف تسعيرة الكشف معه.`,
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
  { $id: "ConsultationTypeConfig" },
);

export const ConsultationTypeConfigSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      clinicId: t.Boolean(),
      consultationTypeId: t.Boolean(),
      price: t.Boolean(),
      examTemplateId: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinic: t.Boolean(),
      consultationType: t.Boolean(),
      examTemplate: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const ConsultationTypeConfigInclude = t.Partial(
  t.Object(
    {
      clinic: t.Boolean(),
      consultationType: t.Boolean(),
      examTemplate: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const ConsultationTypeConfigOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clinicId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      consultationTypeId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      price: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      examTemplateId: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const ConsultationTypeConfig = t.Composite(
  [ConsultationTypeConfigPlain, ConsultationTypeConfigRelations],
  { additionalProperties: false },
);

export const ConsultationTypeConfigInputCreate = t.Composite(
  [
    ConsultationTypeConfigPlainInputCreate,
    ConsultationTypeConfigRelationsInputCreate,
  ],
  { additionalProperties: false },
);

export const ConsultationTypeConfigInputUpdate = t.Composite(
  [
    ConsultationTypeConfigPlainInputUpdate,
    ConsultationTypeConfigRelationsInputUpdate,
  ],
  { additionalProperties: false },
);
