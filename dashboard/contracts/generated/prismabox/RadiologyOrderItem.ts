import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const RadiologyOrderItemPlain = t.Object(
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
);

export const RadiologyOrderItemRelations = t.Object(
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
        clinicalInfo: __nullable__(t.String()),
        notes: __nullable__(t.String()),
        isDeleted: t.Boolean(),
        deletedAt: __nullable__(t.Date()),
        createdAt: t.Date(),
        updatedAt: t.Date(),
        releasedToOwnerAt: __nullable__(
          t.Date({
            description: `*
* [D6] نشر النتيجة لمالك الحيوان — انظر الشرح على \`LabTestOrder.releasedToOwnerAt\`.`,
          }),
        ),
        releasedByStaffId: __nullable__(t.String()),
        releaseSummary: __nullable__(t.String()),
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
    execution: __nullable__(
      t.Object(
        {
          id: t.String(),
          itemId: t.String(),
          machineId: __nullable__(t.String()),
          machineName: __nullable__(t.String()),
          roomName: __nullable__(t.String()),
          positioning: __nullable__(t.String()),
          sedationUsed: __nullable__(
            t.Union(
              [
                t.Literal("NONE"),
                t.Literal("ANXIOLYSIS"),
                t.Literal("SEDATION"),
                t.Literal("GENERAL_ANESTHESIA"),
              ],
              { additionalProperties: false },
            ),
          ),
          sedationAgent: __nullable__(t.String()),
          readyAt: __nullable__(t.Date()),
          performedById: __nullable__(t.String()),
          startedAt: __nullable__(t.Date()),
          finishedAt: __nullable__(t.Date()),
          viewsPerformed: t.Array(t.String(), { additionalProperties: false }),
          exposuresCount: __nullable__(t.Integer()),
          retakeCount: __nullable__(t.Integer()),
          kvp: __nullable__(t.Number()),
          mas: __nullable__(t.Number()),
          doseDap: __nullable__(t.Number()),
          ctdiVol: __nullable__(t.Number()),
          dlp: __nullable__(t.Number()),
          contrastUsed: __nullable__(t.Boolean()),
          contrastAgent: __nullable__(t.String()),
          contrastRoute: __nullable__(
            t.Union(
              [
                t.Literal("IV"),
                t.Literal("ORAL"),
                t.Literal("RECTAL"),
                t.Literal("INTRA_ARTICULAR"),
                t.Literal("OTHER"),
              ],
              { additionalProperties: false },
            ),
          ),
          contrastVolumeMl: __nullable__(t.Number()),
          contrastLot: __nullable__(t.String()),
          imageQuality: __nullable__(
            t.Union(
              [
                t.Literal("DIAGNOSTIC"),
                t.Literal("LIMITED"),
                t.Literal("NON_DIAGNOSTIC"),
              ],
              { additionalProperties: false },
            ),
          ),
          qcNotes: __nullable__(t.String()),
          executionNotes: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    ),
    report: __nullable__(
      t.Object(
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
      ),
    ),
    studies: t.Array(
      t.Object(
        {
          id: t.String(),
          itemId: t.String(),
          studyUid: t.String(),
          description: __nullable__(t.String()),
          studyDate: __nullable__(t.Date()),
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
          uploadedById: __nullable__(t.String()),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
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

export const RadiologyOrderItemPlainInputCreate = t.Object(
  {
    accession: t.String(),
    priceSnapshot: t.Optional(t.Number()),
    status: t.Optional(
      t.Union(
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
    ),
    stage: t.Optional(
      t.Union(
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
    ),
    modality: t.Optional(
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
    bodyPart: t.Optional(__nullable__(t.String())),
    laterality: t.Optional(
      t.Union(
        [
          t.Literal("NONE"),
          t.Literal("LEFT"),
          t.Literal("RIGHT"),
          t.Literal("BILATERAL"),
        ],
        { additionalProperties: false },
      ),
    ),
    views: t.Optional(t.Array(t.String(), { additionalProperties: false })),
    withContrast: t.Optional(t.Boolean()),
    scheduledAt: t.Optional(__nullable__(t.Date())),
    reviewedAt: t.Optional(__nullable__(t.Date())),
    rejectedAt: t.Optional(__nullable__(t.Date())),
    rejectionReason: t.Optional(__nullable__(t.String())),
    completedAt: t.Optional(__nullable__(t.Date())),
    paidAt: t.Optional(__nullable__(t.Date())),
  },
  { additionalProperties: false },
);

export const RadiologyOrderItemPlainInputUpdate = t.Object(
  {
    accession: t.Optional(t.String()),
    priceSnapshot: t.Optional(t.Number()),
    status: t.Optional(
      t.Union(
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
    ),
    stage: t.Optional(
      t.Union(
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
    ),
    modality: t.Optional(
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
    bodyPart: t.Optional(__nullable__(t.String())),
    laterality: t.Optional(
      t.Union(
        [
          t.Literal("NONE"),
          t.Literal("LEFT"),
          t.Literal("RIGHT"),
          t.Literal("BILATERAL"),
        ],
        { additionalProperties: false },
      ),
    ),
    views: t.Optional(t.Array(t.String(), { additionalProperties: false })),
    withContrast: t.Optional(t.Boolean()),
    scheduledAt: t.Optional(__nullable__(t.Date())),
    reviewedAt: t.Optional(__nullable__(t.Date())),
    rejectedAt: t.Optional(__nullable__(t.Date())),
    rejectionReason: t.Optional(__nullable__(t.String())),
    completedAt: t.Optional(__nullable__(t.Date())),
    paidAt: t.Optional(__nullable__(t.Date())),
  },
  { additionalProperties: false },
);

export const RadiologyOrderItemRelationsInputCreate = t.Object(
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
    execution: t.Optional(
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
    report: t.Optional(
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
    studies: t.Optional(
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

export const RadiologyOrderItemRelationsInputUpdate = t.Partial(
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
      execution: t.Partial(
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
      report: t.Partial(
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
      studies: t.Partial(
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

export const RadiologyOrderItemWhere = t.Partial(
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
          bodyPart: t.String(),
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
          assignedToId: t.String(),
          scheduledAt: t.Date(),
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
    { $id: "RadiologyOrderItem" },
  ),
);

export const RadiologyOrderItemWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            {
              id: t.String(),
              accession: t.String(),
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
            t.Object({ accession: t.String() }),
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
              bodyPart: t.String(),
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
              assignedToId: t.String(),
              scheduledAt: t.Date(),
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
  { $id: "RadiologyOrderItem" },
);

export const RadiologyOrderItemSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      orderId: t.Boolean(),
      serviceId: t.Boolean(),
      accession: t.Boolean(),
      priceSnapshot: t.Boolean(),
      status: t.Boolean(),
      stage: t.Boolean(),
      modality: t.Boolean(),
      bodyPart: t.Boolean(),
      laterality: t.Boolean(),
      views: t.Boolean(),
      withContrast: t.Boolean(),
      assignedToId: t.Boolean(),
      scheduledAt: t.Boolean(),
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
      execution: t.Boolean(),
      report: t.Boolean(),
      studies: t.Boolean(),
      sopRun: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const RadiologyOrderItemInclude = t.Partial(
  t.Object(
    {
      status: t.Boolean(),
      stage: t.Boolean(),
      modality: t.Boolean(),
      laterality: t.Boolean(),
      order: t.Boolean(),
      service: t.Boolean(),
      assignedTo: t.Boolean(),
      reviewedBy: t.Boolean(),
      rejectedBy: t.Boolean(),
      execution: t.Boolean(),
      report: t.Boolean(),
      studies: t.Boolean(),
      sopRun: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const RadiologyOrderItemOrderBy = t.Partial(
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
      accession: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      priceSnapshot: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      bodyPart: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      views: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      withContrast: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      assignedToId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      scheduledAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const RadiologyOrderItem = t.Composite(
  [RadiologyOrderItemPlain, RadiologyOrderItemRelations],
  { additionalProperties: false },
);

export const RadiologyOrderItemInputCreate = t.Composite(
  [RadiologyOrderItemPlainInputCreate, RadiologyOrderItemRelationsInputCreate],
  { additionalProperties: false },
);

export const RadiologyOrderItemInputUpdate = t.Composite(
  [RadiologyOrderItemPlainInputUpdate, RadiologyOrderItemRelationsInputUpdate],
  { additionalProperties: false },
);
