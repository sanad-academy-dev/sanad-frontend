import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const RadiologyReportPlain = t.Object(
  {
    id: t.String(),
    itemId: t.String(),
    technique: __nullable__(t.String()),
    comparison: __nullable__(t.String()),
    findings: __nullable__(t.String()),
    impression: __nullable__(t.String()),
    recommendations: __nullable__(t.String()),
    criticalFinding: t.Boolean(),
    criticalNotifiedAt: __nullable__(t.Date()),
    criticalNotifiedTo: __nullable__(t.String()),
    criticalNotifiedToId: __nullable__(t.String()),
    aiDrafted: t.Boolean(),
    authoredById: __nullable__(t.String()),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  },
  { additionalProperties: false },
);

export const RadiologyReportRelations = t.Object(
  {
    item: t.Object(
      {
        id: t.String(),
        orderId: t.String(),
        serviceId: t.String(),
        accession: t.String(),
        priceSnapshot: t.Number(),
        status: t.Union(
          [
            t.Literal("QUEUE"),
            t.Literal("SCHEDULED"),
            t.Literal("PREPARATION"),
            t.Literal("IMAGING"),
            t.Literal("REPORTING"),
            t.Literal("UNDER_REVIEW"),
            t.Literal("COMPLETED"),
            t.Literal("CANCELLED"),
          ],
          { additionalProperties: false },
        ),
        stage: t.Union(
          [
            t.Literal("SAFETY_SCREENING"),
            t.Literal("PATIENT_PREP"),
            t.Literal("ROOM_ASSIGNMENT"),
            t.Literal("READY_CHECK"),
            t.Literal("ACQUISITION"),
            t.Literal("IMAGE_UPLOAD"),
            t.Literal("IMAGE_QC"),
          ],
          { additionalProperties: false },
        ),
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
        bodyPart: __nullable__(t.String()),
        laterality: t.Union(
          [
            t.Literal("NONE"),
            t.Literal("LEFT"),
            t.Literal("RIGHT"),
            t.Literal("BILATERAL"),
          ],
          { additionalProperties: false },
        ),
        views: t.Array(t.String(), { additionalProperties: false }),
        withContrast: t.Boolean(),
        assignedToId: __nullable__(t.String()),
        scheduledAt: __nullable__(t.Date()),
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
    ),
    authoredBy: __nullable__(
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
    criticalNotifiedUser: __nullable__(
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
    addenda: t.Array(
      t.Object(
        {
          id: t.String(),
          reportId: t.String(),
          text: t.String(),
          authoredById: __nullable__(t.String()),
          createdAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `ملحق تقرير — التقرير المعتمد لا يُعدَّل، فالتصحيح أو الإضافة بعده تُلحَق
كسطر مستقل مؤرَّخ وموقَّع. هذا مطلب توثيقي: الأصل يبقى كما اعتُمد.`,
        },
      ),
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const RadiologyReportPlainInputCreate = t.Object(
  {
    technique: t.Optional(__nullable__(t.String())),
    comparison: t.Optional(__nullable__(t.String())),
    findings: t.Optional(__nullable__(t.String())),
    impression: t.Optional(__nullable__(t.String())),
    recommendations: t.Optional(__nullable__(t.String())),
    criticalFinding: t.Optional(t.Boolean()),
    criticalNotifiedAt: t.Optional(__nullable__(t.Date())),
    criticalNotifiedTo: t.Optional(__nullable__(t.String())),
    aiDrafted: t.Optional(t.Boolean()),
  },
  { additionalProperties: false },
);

export const RadiologyReportPlainInputUpdate = t.Object(
  {
    technique: t.Optional(__nullable__(t.String())),
    comparison: t.Optional(__nullable__(t.String())),
    findings: t.Optional(__nullable__(t.String())),
    impression: t.Optional(__nullable__(t.String())),
    recommendations: t.Optional(__nullable__(t.String())),
    criticalFinding: t.Optional(t.Boolean()),
    criticalNotifiedAt: t.Optional(__nullable__(t.Date())),
    criticalNotifiedTo: t.Optional(__nullable__(t.String())),
    aiDrafted: t.Optional(t.Boolean()),
  },
  { additionalProperties: false },
);

export const RadiologyReportRelationsInputCreate = t.Object(
  {
    item: t.Object(
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
    authoredBy: t.Optional(
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
    criticalNotifiedUser: t.Optional(
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
    addenda: t.Optional(
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

export const RadiologyReportRelationsInputUpdate = t.Partial(
  t.Object(
    {
      item: t.Object(
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
      authoredBy: t.Partial(
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
      criticalNotifiedUser: t.Partial(
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
      addenda: t.Partial(
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

export const RadiologyReportWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          itemId: t.String(),
          technique: t.String(),
          comparison: t.String(),
          findings: t.String(),
          impression: t.String(),
          recommendations: t.String(),
          criticalFinding: t.Boolean(),
          criticalNotifiedAt: t.Date(),
          criticalNotifiedTo: t.String(),
          criticalNotifiedToId: t.String(),
          aiDrafted: t.Boolean(),
          authoredById: t.String(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "RadiologyReport" },
  ),
);

export const RadiologyReportWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.String(), itemId: t.String() },
            { additionalProperties: false },
          ),
          { additionalProperties: false },
        ),
        t.Union(
          [t.Object({ id: t.String() }), t.Object({ itemId: t.String() })],
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
              itemId: t.String(),
              technique: t.String(),
              comparison: t.String(),
              findings: t.String(),
              impression: t.String(),
              recommendations: t.String(),
              criticalFinding: t.Boolean(),
              criticalNotifiedAt: t.Date(),
              criticalNotifiedTo: t.String(),
              criticalNotifiedToId: t.String(),
              aiDrafted: t.Boolean(),
              authoredById: t.String(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "RadiologyReport" },
);

export const RadiologyReportSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      itemId: t.Boolean(),
      technique: t.Boolean(),
      comparison: t.Boolean(),
      findings: t.Boolean(),
      impression: t.Boolean(),
      recommendations: t.Boolean(),
      criticalFinding: t.Boolean(),
      criticalNotifiedAt: t.Boolean(),
      criticalNotifiedTo: t.Boolean(),
      criticalNotifiedToId: t.Boolean(),
      aiDrafted: t.Boolean(),
      authoredById: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      item: t.Boolean(),
      authoredBy: t.Boolean(),
      criticalNotifiedUser: t.Boolean(),
      addenda: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const RadiologyReportInclude = t.Partial(
  t.Object(
    {
      item: t.Boolean(),
      authoredBy: t.Boolean(),
      criticalNotifiedUser: t.Boolean(),
      addenda: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const RadiologyReportOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      itemId: t.Union([t.Literal("asc"), t.Literal("desc")], {
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
      criticalFinding: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      criticalNotifiedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      criticalNotifiedTo: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      criticalNotifiedToId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      aiDrafted: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      authoredById: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const RadiologyReport = t.Composite(
  [RadiologyReportPlain, RadiologyReportRelations],
  { additionalProperties: false },
);

export const RadiologyReportInputCreate = t.Composite(
  [RadiologyReportPlainInputCreate, RadiologyReportRelationsInputCreate],
  { additionalProperties: false },
);

export const RadiologyReportInputUpdate = t.Composite(
  [RadiologyReportPlainInputUpdate, RadiologyReportRelationsInputUpdate],
  { additionalProperties: false },
);
