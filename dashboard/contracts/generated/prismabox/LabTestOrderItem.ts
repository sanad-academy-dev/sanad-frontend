import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const LabTestOrderItemPlain = t.Object(
  {
    id: t.String(),
    orderId: t.String(),
    serviceId: t.String(),
    priceSnapshot: t.Number(),
    status: t.Union(
      [
        t.Literal("QUEUE"),
        t.Literal("SCHEDULED"),
        t.Literal("SAMPLE_COLLECTION"),
        t.Literal("IN_LAB"),
        t.Literal("UNDER_REVIEW"),
        t.Literal("COMPLETED"),
        t.Literal("CANCELLED"),
      ],
      { additionalProperties: false },
    ),
    sampleStage: t.Union(
      [
        t.Literal("NOT_COLLECTED"),
        t.Literal("COLLECTED"),
        t.Literal("QUALITY_CHECK"),
        t.Literal("LABEL_PRINT"),
        t.Literal("ANALYZER_ASSIGNMENT"),
        t.Literal("HANDOVER_SUMMARY"),
        t.Literal("ANALYZING"),
        t.Literal("RESULTS_READY"),
      ],
      { additionalProperties: false },
    ),
    assignedToId: __nullable__(t.String()),
    scheduledAt: __nullable__(t.Date()),
    report: __nullable__(t.String()),
    reviewedById: __nullable__(t.String()),
    reviewedAt: __nullable__(t.Date()),
    rejectedById: __nullable__(t.String()),
    rejectedAt: __nullable__(t.Date()),
    rejectionReason: __nullable__(t.String()),
    completedAt: __nullable__(t.Date()),
    paidAt: __nullable__(t.Date()),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  },
  { additionalProperties: false },
);

export const LabTestOrderItemRelations = t.Object(
  {
    order: t.Object(
      {
        id: t.String(),
        code: t.String(),
        clinicId: t.String(),
        branchId: t.String(),
        patientId: t.String(),
        ownerId: t.String(),
        appointmentId: __nullable__(t.String()),
        inpatientStayId: __nullable__(
          t.String({
            description: `*
* [IP2] طُلب من داخل إقامة تنويم. عمود قياسيّ بلا علاقة Prisma عن قصد: العلاقة
* تُضاف طرفين، وطرفها الثاني يوسّع رسم أنواع \`InpatientStay\` الضخم أصلًا حتى
* يتجاوز سقف عمق TypeScript (نفس ما وقع عند إضافة نماذج التنويم أول مرّة).
* الاستعلام هنا دائمًا «طلبات هذه الإقامة»، وهو استعلام مستقلّ لا تضمين متداخل.`,
          }),
        ),
        requestedById: __nullable__(t.String()),
        priority: __nullable__(
          t.Union(
            [
              t.Literal("LOW"),
              t.Literal("MEDIUM"),
              t.Literal("HIGH"),
              t.Literal("URGENT"),
            ],
            { additionalProperties: false },
          ),
        ),
        isUrgent: t.Boolean(),
        notes: __nullable__(t.String()),
        isDeleted: t.Boolean(),
        deletedAt: __nullable__(t.Date()),
        createdAt: t.Date(),
        updatedAt: t.Date(),
        qcReviewedAt: __nullable__(t.Date()),
        qcReviewedById: __nullable__(t.String()),
        qcRules: t.Array(t.String(), { additionalProperties: false }),
        releasedToOwnerAt: __nullable__(
          t.Date({
            description: `*
* [D6] نشر النتيجة لمالك الحيوان — القرار السريري الذي يفتح بوّابة التطبيق.
* النتيجة **لا تصل تطبيق المالك** حتى يُملأ هذا الحقل. القيمة الفارغة هي الحالة
* الطبيعية لا النقص: قيمةٌ خارج المدى المرجعي تُقرأ كارثةً وهي طبيعية لنوعها،
* وأخرى تبدو سليمة يعرف الطبيب وحده أنها تستدعي إعادة. فالنشر فعلُ طبيبٍ يُسجَّل
* باسمه ووقته، لا أثرٌ جانبيّ لاكتمال التحليل.`,
          }),
        ),
        releasedByStaffId: __nullable__(t.String()),
        releaseSummary: __nullable__(
          t.String({
            description: `*
* ملخّصٌ بلغة المالك يكتبه الطبيب عند النشر — لا يُعرض التقرير الخام.`,
          }),
        ),
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
    assignedTo: __nullable__(
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
    reviewedBy: __nullable__(
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
    rejectedBy: __nullable__(
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
    results: t.Array(
      t.Object(
        {
          id: t.String(),
          itemId: t.String(),
          parameterId: __nullable__(t.String()),
          section: __nullable__(t.String()),
          name: t.String(),
          unit: __nullable__(t.String()),
          refLow: __nullable__(t.Number()),
          refHigh: __nullable__(t.Number()),
          value: __nullable__(t.String()),
          numericValue: __nullable__(t.Number()),
          flag: t.Union(
            [t.Literal("NORMAL"), t.Literal("LOW"), t.Literal("HIGH")],
            { additionalProperties: false },
          ),
          notes: __nullable__(t.String()),
          order: t.Integer(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    reportMentions: t.Array(
      t.Object(
        {
          id: t.String(),
          itemId: t.String(),
          staffId: t.String(),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    sampleCollection: __nullable__(
      t.Object(
        {
          id: t.String(),
          itemId: t.String(),
          tubeType: __nullable__(
            t.Union(
              [
                t.Literal("EDTA"),
                t.Literal("SST"),
                t.Literal("CITRATE"),
                t.Literal("HEPARIN"),
                t.Literal("URINE"),
                t.Literal("SWAB"),
              ],
              { additionalProperties: false },
            ),
          ),
          collectedById: __nullable__(t.String()),
          drawSite: __nullable__(t.String()),
          volumeMl: __nullable__(t.Number()),
          attempts: __nullable__(t.Integer()),
          collectedAt: __nullable__(t.Date()),
          quality: __nullable__(
            t.Union(
              [
                t.Literal("EXCELLENT"),
                t.Literal("GOOD"),
                t.Literal("ACCEPTABLE"),
                t.Literal("REJECTED"),
              ],
              { additionalProperties: false },
            ),
          ),
          collectionNotes: __nullable__(t.String()),
          analyzerId: __nullable__(t.String()),
          analyzerName: __nullable__(t.String()),
          handedOverAt: __nullable__(t.Date()),
          labelsPrinted: __nullable__(t.Integer()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    ),
    sopRun: __nullable__(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          templateId: t.String(),
          templateVersion: t.Integer(),
          domain: t.Union(
            [t.Literal("LAB"), t.Literal("RADIOLOGY"), t.Literal("OPERATION")],
            { additionalProperties: false },
          ),
          labItemId: __nullable__(t.String()),
          radiologyItemId: __nullable__(t.String()),
          operationCaseId: __nullable__(t.String()),
          startedById: __nullable__(t.String()),
          completedAt: __nullable__(t.Date()),
          completedById: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    ),
  },
  { additionalProperties: false },
);

export const LabTestOrderItemPlainInputCreate = t.Object(
  {
    priceSnapshot: t.Optional(t.Number()),
    status: t.Optional(
      t.Union(
        [
          t.Literal("QUEUE"),
          t.Literal("SCHEDULED"),
          t.Literal("SAMPLE_COLLECTION"),
          t.Literal("IN_LAB"),
          t.Literal("UNDER_REVIEW"),
          t.Literal("COMPLETED"),
          t.Literal("CANCELLED"),
        ],
        { additionalProperties: false },
      ),
    ),
    sampleStage: t.Optional(
      t.Union(
        [
          t.Literal("NOT_COLLECTED"),
          t.Literal("COLLECTED"),
          t.Literal("QUALITY_CHECK"),
          t.Literal("LABEL_PRINT"),
          t.Literal("ANALYZER_ASSIGNMENT"),
          t.Literal("HANDOVER_SUMMARY"),
          t.Literal("ANALYZING"),
          t.Literal("RESULTS_READY"),
        ],
        { additionalProperties: false },
      ),
    ),
    scheduledAt: t.Optional(__nullable__(t.Date())),
    report: t.Optional(__nullable__(t.String())),
    reviewedAt: t.Optional(__nullable__(t.Date())),
    rejectedAt: t.Optional(__nullable__(t.Date())),
    rejectionReason: t.Optional(__nullable__(t.String())),
    completedAt: t.Optional(__nullable__(t.Date())),
    paidAt: t.Optional(__nullable__(t.Date())),
  },
  { additionalProperties: false },
);

export const LabTestOrderItemPlainInputUpdate = t.Object(
  {
    priceSnapshot: t.Optional(t.Number()),
    status: t.Optional(
      t.Union(
        [
          t.Literal("QUEUE"),
          t.Literal("SCHEDULED"),
          t.Literal("SAMPLE_COLLECTION"),
          t.Literal("IN_LAB"),
          t.Literal("UNDER_REVIEW"),
          t.Literal("COMPLETED"),
          t.Literal("CANCELLED"),
        ],
        { additionalProperties: false },
      ),
    ),
    sampleStage: t.Optional(
      t.Union(
        [
          t.Literal("NOT_COLLECTED"),
          t.Literal("COLLECTED"),
          t.Literal("QUALITY_CHECK"),
          t.Literal("LABEL_PRINT"),
          t.Literal("ANALYZER_ASSIGNMENT"),
          t.Literal("HANDOVER_SUMMARY"),
          t.Literal("ANALYZING"),
          t.Literal("RESULTS_READY"),
        ],
        { additionalProperties: false },
      ),
    ),
    scheduledAt: t.Optional(__nullable__(t.Date())),
    report: t.Optional(__nullable__(t.String())),
    reviewedAt: t.Optional(__nullable__(t.Date())),
    rejectedAt: t.Optional(__nullable__(t.Date())),
    rejectionReason: t.Optional(__nullable__(t.String())),
    completedAt: t.Optional(__nullable__(t.Date())),
    paidAt: t.Optional(__nullable__(t.Date())),
  },
  { additionalProperties: false },
);

export const LabTestOrderItemRelationsInputCreate = t.Object(
  {
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
    assignedTo: t.Optional(
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
    reviewedBy: t.Optional(
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
    rejectedBy: t.Optional(
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
    results: t.Optional(
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
    reportMentions: t.Optional(
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
    sampleCollection: t.Optional(
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
    sopRun: t.Optional(
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

export const LabTestOrderItemRelationsInputUpdate = t.Partial(
  t.Object(
    {
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
      assignedTo: t.Partial(
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
      reviewedBy: t.Partial(
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
      rejectedBy: t.Partial(
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
      results: t.Partial(
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
      reportMentions: t.Partial(
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
      sampleCollection: t.Partial(
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
      sopRun: t.Partial(
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

export const LabTestOrderItemWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          orderId: t.String(),
          serviceId: t.String(),
          priceSnapshot: t.Number(),
          status: t.Union(
            [
              t.Literal("QUEUE"),
              t.Literal("SCHEDULED"),
              t.Literal("SAMPLE_COLLECTION"),
              t.Literal("IN_LAB"),
              t.Literal("UNDER_REVIEW"),
              t.Literal("COMPLETED"),
              t.Literal("CANCELLED"),
            ],
            { additionalProperties: false },
          ),
          sampleStage: t.Union(
            [
              t.Literal("NOT_COLLECTED"),
              t.Literal("COLLECTED"),
              t.Literal("QUALITY_CHECK"),
              t.Literal("LABEL_PRINT"),
              t.Literal("ANALYZER_ASSIGNMENT"),
              t.Literal("HANDOVER_SUMMARY"),
              t.Literal("ANALYZING"),
              t.Literal("RESULTS_READY"),
            ],
            { additionalProperties: false },
          ),
          assignedToId: t.String(),
          scheduledAt: t.Date(),
          report: t.String(),
          reviewedById: t.String(),
          reviewedAt: t.Date(),
          rejectedById: t.String(),
          rejectedAt: t.Date(),
          rejectionReason: t.String(),
          completedAt: t.Date(),
          paidAt: t.Date(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "LabTestOrderItem" },
  ),
);

export const LabTestOrderItemWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            {
              id: t.String(),
              orderId_serviceId: t.Object(
                { orderId: t.String(), serviceId: t.String() },
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
              orderId_serviceId: t.Object(
                { orderId: t.String(), serviceId: t.String() },
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
              orderId: t.String(),
              serviceId: t.String(),
              priceSnapshot: t.Number(),
              status: t.Union(
                [
                  t.Literal("QUEUE"),
                  t.Literal("SCHEDULED"),
                  t.Literal("SAMPLE_COLLECTION"),
                  t.Literal("IN_LAB"),
                  t.Literal("UNDER_REVIEW"),
                  t.Literal("COMPLETED"),
                  t.Literal("CANCELLED"),
                ],
                { additionalProperties: false },
              ),
              sampleStage: t.Union(
                [
                  t.Literal("NOT_COLLECTED"),
                  t.Literal("COLLECTED"),
                  t.Literal("QUALITY_CHECK"),
                  t.Literal("LABEL_PRINT"),
                  t.Literal("ANALYZER_ASSIGNMENT"),
                  t.Literal("HANDOVER_SUMMARY"),
                  t.Literal("ANALYZING"),
                  t.Literal("RESULTS_READY"),
                ],
                { additionalProperties: false },
              ),
              assignedToId: t.String(),
              scheduledAt: t.Date(),
              report: t.String(),
              reviewedById: t.String(),
              reviewedAt: t.Date(),
              rejectedById: t.String(),
              rejectedAt: t.Date(),
              rejectionReason: t.String(),
              completedAt: t.Date(),
              paidAt: t.Date(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "LabTestOrderItem" },
);

export const LabTestOrderItemSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      orderId: t.Boolean(),
      serviceId: t.Boolean(),
      priceSnapshot: t.Boolean(),
      status: t.Boolean(),
      sampleStage: t.Boolean(),
      assignedToId: t.Boolean(),
      scheduledAt: t.Boolean(),
      report: t.Boolean(),
      reviewedById: t.Boolean(),
      reviewedAt: t.Boolean(),
      rejectedById: t.Boolean(),
      rejectedAt: t.Boolean(),
      rejectionReason: t.Boolean(),
      completedAt: t.Boolean(),
      paidAt: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      order: t.Boolean(),
      service: t.Boolean(),
      assignedTo: t.Boolean(),
      reviewedBy: t.Boolean(),
      rejectedBy: t.Boolean(),
      results: t.Boolean(),
      reportMentions: t.Boolean(),
      sampleCollection: t.Boolean(),
      sopRun: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const LabTestOrderItemInclude = t.Partial(
  t.Object(
    {
      status: t.Boolean(),
      sampleStage: t.Boolean(),
      order: t.Boolean(),
      service: t.Boolean(),
      assignedTo: t.Boolean(),
      reviewedBy: t.Boolean(),
      rejectedBy: t.Boolean(),
      results: t.Boolean(),
      reportMentions: t.Boolean(),
      sampleCollection: t.Boolean(),
      sopRun: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const LabTestOrderItemOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      orderId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      serviceId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      priceSnapshot: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      assignedToId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      scheduledAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      report: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      reviewedById: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      reviewedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      rejectedById: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      rejectedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      rejectionReason: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      completedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      paidAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const LabTestOrderItem = t.Composite(
  [LabTestOrderItemPlain, LabTestOrderItemRelations],
  { additionalProperties: false },
);

export const LabTestOrderItemInputCreate = t.Composite(
  [LabTestOrderItemPlainInputCreate, LabTestOrderItemRelationsInputCreate],
  { additionalProperties: false },
);

export const LabTestOrderItemInputUpdate = t.Composite(
  [LabTestOrderItemPlainInputUpdate, LabTestOrderItemRelationsInputUpdate],
  { additionalProperties: false },
);
