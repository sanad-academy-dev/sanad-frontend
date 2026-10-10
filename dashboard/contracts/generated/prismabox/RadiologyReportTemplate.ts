import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const RadiologyReportTemplatePlain = t.Object(
  {
    id: t.String(),
    clinicId: t.String(),
    name: t.String(),
    modality: __nullable__(
      t.Union(
        [
          t.Literal("XRAY"),
          t.Literal("CT"),
          t.Literal("MRI"),
          t.Literal("ULTRASOUND"),
          t.Literal("FLUOROSCOPY"),
          t.Literal("MAMMOGRAPHY"),
          t.Literal("NUCLEAR"),
          t.Literal("PET"),
          t.Literal("DENTAL"),
          t.Literal("OTHER"),
        ],
        { additionalProperties: false },
      ),
    ),
    serviceId: __nullable__(t.String()),
    technique: __nullable__(t.String()),
    comparison: __nullable__(t.String()),
    findings: __nullable__(t.String()),
    impression: __nullable__(t.String()),
    recommendations: __nullable__(t.String()),
    isDefault: t.Boolean({
      description: `القالب الافتراضي يُقترح تلقائيًا عند فتح محرّر تقرير مطابق`,
    }),
    active: t.Boolean(),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  },
  {
    additionalProperties: false,
    description: `قالب تقرير جاهز — يملأ أقسام التقرير بنقرة بدل إعادة كتابة النص الطبيعي
في كل فحص. يُربط بخدمة بعينها أو بطريقة تصوير كاملة (serviceId فارغ).`,
  },
);

export const RadiologyReportTemplateRelations = t.Object(
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
    service: __nullable__(
      t.Object(
        {
          id: t.String(),
          name: t.String(),
          level: t.Union(
            [
              t.Literal("CATEGORY"),
              t.Literal("SUBCATEGORY"),
              t.Literal("ITEM"),
            ],
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
    ),
  },
  {
    additionalProperties: false,
    description: `قالب تقرير جاهز — يملأ أقسام التقرير بنقرة بدل إعادة كتابة النص الطبيعي
في كل فحص. يُربط بخدمة بعينها أو بطريقة تصوير كاملة (serviceId فارغ).`,
  },
);

export const RadiologyReportTemplatePlainInputCreate = t.Object(
  {
    name: t.String(),
    modality: t.Optional(
      __nullable__(
        t.Union(
          [
            t.Literal("XRAY"),
            t.Literal("CT"),
            t.Literal("MRI"),
            t.Literal("ULTRASOUND"),
            t.Literal("FLUOROSCOPY"),
            t.Literal("MAMMOGRAPHY"),
            t.Literal("NUCLEAR"),
            t.Literal("PET"),
            t.Literal("DENTAL"),
            t.Literal("OTHER"),
          ],
          { additionalProperties: false },
        ),
      ),
    ),
    technique: t.Optional(__nullable__(t.String())),
    comparison: t.Optional(__nullable__(t.String())),
    findings: t.Optional(__nullable__(t.String())),
    impression: t.Optional(__nullable__(t.String())),
    recommendations: t.Optional(__nullable__(t.String())),
    isDefault: t.Optional(
      t.Boolean({
        description: `القالب الافتراضي يُقترح تلقائيًا عند فتح محرّر تقرير مطابق`,
      }),
    ),
    active: t.Optional(t.Boolean()),
  },
  {
    additionalProperties: false,
    description: `قالب تقرير جاهز — يملأ أقسام التقرير بنقرة بدل إعادة كتابة النص الطبيعي
في كل فحص. يُربط بخدمة بعينها أو بطريقة تصوير كاملة (serviceId فارغ).`,
  },
);

export const RadiologyReportTemplatePlainInputUpdate = t.Object(
  {
    name: t.Optional(t.String()),
    modality: t.Optional(
      __nullable__(
        t.Union(
          [
            t.Literal("XRAY"),
            t.Literal("CT"),
            t.Literal("MRI"),
            t.Literal("ULTRASOUND"),
            t.Literal("FLUOROSCOPY"),
            t.Literal("MAMMOGRAPHY"),
            t.Literal("NUCLEAR"),
            t.Literal("PET"),
            t.Literal("DENTAL"),
            t.Literal("OTHER"),
          ],
          { additionalProperties: false },
        ),
      ),
    ),
    technique: t.Optional(__nullable__(t.String())),
    comparison: t.Optional(__nullable__(t.String())),
    findings: t.Optional(__nullable__(t.String())),
    impression: t.Optional(__nullable__(t.String())),
    recommendations: t.Optional(__nullable__(t.String())),
    isDefault: t.Optional(
      t.Boolean({
        description: `القالب الافتراضي يُقترح تلقائيًا عند فتح محرّر تقرير مطابق`,
      }),
    ),
    active: t.Optional(t.Boolean()),
  },
  {
    additionalProperties: false,
    description: `قالب تقرير جاهز — يملأ أقسام التقرير بنقرة بدل إعادة كتابة النص الطبيعي
في كل فحص. يُربط بخدمة بعينها أو بطريقة تصوير كاملة (serviceId فارغ).`,
  },
);

export const RadiologyReportTemplateRelationsInputCreate = t.Object(
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
    service: t.Optional(
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
    description: `قالب تقرير جاهز — يملأ أقسام التقرير بنقرة بدل إعادة كتابة النص الطبيعي
في كل فحص. يُربط بخدمة بعينها أو بطريقة تصوير كاملة (serviceId فارغ).`,
  },
);

export const RadiologyReportTemplateRelationsInputUpdate = t.Partial(
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
      service: t.Partial(
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
      description: `قالب تقرير جاهز — يملأ أقسام التقرير بنقرة بدل إعادة كتابة النص الطبيعي
في كل فحص. يُربط بخدمة بعينها أو بطريقة تصوير كاملة (serviceId فارغ).`,
    },
  ),
);

export const RadiologyReportTemplateWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          clinicId: t.String(),
          name: t.String(),
          modality: t.Union(
            [
              t.Literal("XRAY"),
              t.Literal("CT"),
              t.Literal("MRI"),
              t.Literal("ULTRASOUND"),
              t.Literal("FLUOROSCOPY"),
              t.Literal("MAMMOGRAPHY"),
              t.Literal("NUCLEAR"),
              t.Literal("PET"),
              t.Literal("DENTAL"),
              t.Literal("OTHER"),
            ],
            { additionalProperties: false },
          ),
          serviceId: t.String(),
          technique: t.String(),
          comparison: t.String(),
          findings: t.String(),
          impression: t.String(),
          recommendations: t.String(),
          isDefault: t.Boolean({
            description: `القالب الافتراضي يُقترح تلقائيًا عند فتح محرّر تقرير مطابق`,
          }),
          active: t.Boolean(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `قالب تقرير جاهز — يملأ أقسام التقرير بنقرة بدل إعادة كتابة النص الطبيعي
في كل فحص. يُربط بخدمة بعينها أو بطريقة تصوير كاملة (serviceId فارغ).`,
        },
      ),
    { $id: "RadiologyReportTemplate" },
  ),
);

export const RadiologyReportTemplateWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.String() },
            {
              additionalProperties: false,
              description: `قالب تقرير جاهز — يملأ أقسام التقرير بنقرة بدل إعادة كتابة النص الطبيعي
في كل فحص. يُربط بخدمة بعينها أو بطريقة تصوير كاملة (serviceId فارغ).`,
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
              name: t.String(),
              modality: t.Union(
                [
                  t.Literal("XRAY"),
                  t.Literal("CT"),
                  t.Literal("MRI"),
                  t.Literal("ULTRASOUND"),
                  t.Literal("FLUOROSCOPY"),
                  t.Literal("MAMMOGRAPHY"),
                  t.Literal("NUCLEAR"),
                  t.Literal("PET"),
                  t.Literal("DENTAL"),
                  t.Literal("OTHER"),
                ],
                { additionalProperties: false },
              ),
              serviceId: t.String(),
              technique: t.String(),
              comparison: t.String(),
              findings: t.String(),
              impression: t.String(),
              recommendations: t.String(),
              isDefault: t.Boolean({
                description: `القالب الافتراضي يُقترح تلقائيًا عند فتح محرّر تقرير مطابق`,
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
  { $id: "RadiologyReportTemplate" },
);

export const RadiologyReportTemplateSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      clinicId: t.Boolean(),
      name: t.Boolean(),
      modality: t.Boolean(),
      serviceId: t.Boolean(),
      technique: t.Boolean(),
      comparison: t.Boolean(),
      findings: t.Boolean(),
      impression: t.Boolean(),
      recommendations: t.Boolean(),
      isDefault: t.Boolean(),
      active: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinic: t.Boolean(),
      service: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `قالب تقرير جاهز — يملأ أقسام التقرير بنقرة بدل إعادة كتابة النص الطبيعي
في كل فحص. يُربط بخدمة بعينها أو بطريقة تصوير كاملة (serviceId فارغ).`,
    },
  ),
);

export const RadiologyReportTemplateInclude = t.Partial(
  t.Object(
    {
      modality: t.Boolean(),
      clinic: t.Boolean(),
      service: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `قالب تقرير جاهز — يملأ أقسام التقرير بنقرة بدل إعادة كتابة النص الطبيعي
في كل فحص. يُربط بخدمة بعينها أو بطريقة تصوير كاملة (serviceId فارغ).`,
    },
  ),
);

export const RadiologyReportTemplateOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clinicId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      name: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      serviceId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      technique: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      comparison: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      findings: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      impression: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      recommendations: t.Union([t.Literal("asc"), t.Literal("desc")], {
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
      description: `قالب تقرير جاهز — يملأ أقسام التقرير بنقرة بدل إعادة كتابة النص الطبيعي
في كل فحص. يُربط بخدمة بعينها أو بطريقة تصوير كاملة (serviceId فارغ).`,
    },
  ),
);

export const RadiologyReportTemplate = t.Composite(
  [RadiologyReportTemplatePlain, RadiologyReportTemplateRelations],
  { additionalProperties: false },
);

export const RadiologyReportTemplateInputCreate = t.Composite(
  [
    RadiologyReportTemplatePlainInputCreate,
    RadiologyReportTemplateRelationsInputCreate,
  ],
  { additionalProperties: false },
);

export const RadiologyReportTemplateInputUpdate = t.Composite(
  [
    RadiologyReportTemplatePlainInputUpdate,
    RadiologyReportTemplateRelationsInputUpdate,
  ],
  { additionalProperties: false },
);
