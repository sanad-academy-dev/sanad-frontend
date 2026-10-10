import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const SopRunPlain = t.Object(
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
);

export const SopRunRelations = t.Object(
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
    template: t.Object(
      {
        id: t.String(),
        clinicId: __nullable__(t.String()),
        domain: t.Union(
          [t.Literal("LAB"), t.Literal("RADIOLOGY"), t.Literal("OPERATION")],
          { additionalProperties: false },
        ),
        serviceId: t.String(),
        titleAr: t.String(),
        titleEn: __nullable__(t.String()),
        reference: __nullable__(t.String()),
        version: t.Integer(),
        active: t.Boolean(),
        createdAt: t.Date(),
        updatedAt: t.Date(),
      },
      { additionalProperties: false },
    ),
    labItem: __nullable__(
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
      ),
    ),
    radiologyItem: __nullable__(
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
    ),
    operationCase: __nullable__(
      t.Object(
        {
          id: t.String(),
          code: t.String(),
          clinicId: t.String(),
          branchId: t.String(),
          patientId: t.String(),
          ownerId: t.String(),
          appointmentId: __nullable__(t.String()),
          status: t.Union(
            [
              t.Literal("SCHEDULED"),
              t.Literal("PREP"),
              t.Literal("ANESTHESIA"),
              t.Literal("SURGERY"),
              t.Literal("RECOVERY"),
              t.Literal("DISCHARGE"),
              t.Literal("FOLLOW_UP"),
              t.Literal("COMPLETED"),
              t.Literal("CANCELLED"),
            ],
            { additionalProperties: false },
          ),
          stage: __nullable__(
            t.Union(
              [
                t.Literal("CONSENT"),
                t.Literal("FASTING_CHECK"),
                t.Literal("ASSESSMENT"),
                t.Literal("PREMED"),
                t.Literal("SIGN_IN"),
                t.Literal("INDUCTION"),
                t.Literal("MAINTENANCE"),
                t.Literal("TIME_OUT"),
                t.Literal("IN_PROGRESS"),
                t.Literal("CLOSING"),
                t.Literal("SIGN_OUT"),
                t.Literal("MONITORING"),
                t.Literal("READY_FOR_DISCHARGE"),
              ],
              { additionalProperties: false },
            ),
          ),
          tier: t.Union(
            [t.Literal("MINOR"), t.Literal("INTERMEDIATE"), t.Literal("MAJOR")],
            { additionalProperties: false },
          ),
          tierOverrideReason: __nullable__(t.String()),
          urgency: t.Union(
            [
              t.Literal("IMMEDIATE"),
              t.Literal("URGENT"),
              t.Literal("EXPEDITED"),
              t.Literal("ELECTIVE"),
            ],
            { additionalProperties: false },
          ),
          plannedAnesthesia: t.Union(
            [
              t.Literal("NONE"),
              t.Literal("ANXIOLYSIS"),
              t.Literal("SEDATION"),
              t.Literal("GENERAL_ANESTHESIA"),
            ],
            { additionalProperties: false },
          ),
          scheduledAt: __nullable__(t.Date()),
          estimatedDurationMin: t.Integer(),
          ssiSurveillanceUntil: __nullable__(t.Date()),
          roomId: __nullable__(t.String()),
          diagnosis: __nullable__(t.String()),
          clinicalSummary: __nullable__(t.String()),
          cancelKind: __nullable__(
            t.Union(
              [t.Literal("OWNER"), t.Literal("CLINIC"), t.Literal("CLINICAL")],
              { additionalProperties: false },
            ),
          ),
          cancelReason: __nullable__(t.String()),
          isDeleted: t.Boolean(),
          deletedAt: __nullable__(t.Date()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    ),
    startedBy: __nullable__(
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
    completedBy: __nullable__(
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
    steps: t.Array(
      t.Object(
        {
          id: t.String(),
          runId: t.String(),
          order: t.Integer(),
          sectionTitle: t.String(),
          textSnapshot: t.String(),
          ownerRole: __nullable__(t.String()),
          duration: __nullable__(t.String()),
          critical: t.Boolean(),
          required: t.Boolean(),
          responseType: t.Union(
            [
              t.Literal("CONFIRM"),
              t.Literal("YES_NO_NA"),
              t.Literal("TEXT"),
              t.Literal("NUMBER"),
            ],
            { additionalProperties: false },
          ),
          response: __nullable__(
            t.Union(
              [
                t.Literal("CONFIRMED"),
                t.Literal("YES"),
                t.Literal("NO"),
                t.Literal("NA"),
              ],
              { additionalProperties: false },
            ),
          ),
          valueText: __nullable__(t.String()),
          valueNumber: __nullable__(t.Number()),
          respondedById: __nullable__(t.String()),
          respondedAt: __nullable__(t.Date()),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const SopRunPlainInputCreate = t.Object(
  {
    templateVersion: t.Integer(),
    domain: t.Union(
      [t.Literal("LAB"), t.Literal("RADIOLOGY"), t.Literal("OPERATION")],
      { additionalProperties: false },
    ),
    completedAt: t.Optional(__nullable__(t.Date())),
  },
  { additionalProperties: false },
);

export const SopRunPlainInputUpdate = t.Object(
  {
    templateVersion: t.Optional(t.Integer()),
    domain: t.Optional(
      t.Union(
        [t.Literal("LAB"), t.Literal("RADIOLOGY"), t.Literal("OPERATION")],
        { additionalProperties: false },
      ),
    ),
    completedAt: t.Optional(__nullable__(t.Date())),
  },
  { additionalProperties: false },
);

export const SopRunRelationsInputCreate = t.Object(
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
    template: t.Object(
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
    labItem: t.Optional(
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
    radiologyItem: t.Optional(
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
    operationCase: t.Optional(
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
    startedBy: t.Optional(
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
    completedBy: t.Optional(
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
    steps: t.Optional(
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

export const SopRunRelationsInputUpdate = t.Partial(
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
      template: t.Object(
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
      labItem: t.Partial(
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
      radiologyItem: t.Partial(
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
      operationCase: t.Partial(
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
      startedBy: t.Partial(
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
      completedBy: t.Partial(
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
      steps: t.Partial(
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

export const SopRunWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          clinicId: t.String(),
          templateId: t.String(),
          templateVersion: t.Integer(),
          domain: t.Union(
            [t.Literal("LAB"), t.Literal("RADIOLOGY"), t.Literal("OPERATION")],
            { additionalProperties: false },
          ),
          labItemId: t.String(),
          radiologyItemId: t.String(),
          operationCaseId: t.String(),
          startedById: t.String(),
          completedAt: t.Date(),
          completedById: t.String(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "SopRun" },
  ),
);

export const SopRunWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            {
              id: t.String(),
              labItemId: t.String(),
              radiologyItemId: t.String(),
              operationCaseId: t.String(),
            },
            { additionalProperties: false },
          ),
          { additionalProperties: false },
        ),
        t.Union(
          [
            t.Object({ id: t.String() }),
            t.Object({ labItemId: t.String() }),
            t.Object({ radiologyItemId: t.String() }),
            t.Object({ operationCaseId: t.String() }),
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
              templateId: t.String(),
              templateVersion: t.Integer(),
              domain: t.Union(
                [
                  t.Literal("LAB"),
                  t.Literal("RADIOLOGY"),
                  t.Literal("OPERATION"),
                ],
                { additionalProperties: false },
              ),
              labItemId: t.String(),
              radiologyItemId: t.String(),
              operationCaseId: t.String(),
              startedById: t.String(),
              completedAt: t.Date(),
              completedById: t.String(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "SopRun" },
);

export const SopRunSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      clinicId: t.Boolean(),
      templateId: t.Boolean(),
      templateVersion: t.Boolean(),
      domain: t.Boolean(),
      labItemId: t.Boolean(),
      radiologyItemId: t.Boolean(),
      operationCaseId: t.Boolean(),
      startedById: t.Boolean(),
      completedAt: t.Boolean(),
      completedById: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinic: t.Boolean(),
      template: t.Boolean(),
      labItem: t.Boolean(),
      radiologyItem: t.Boolean(),
      operationCase: t.Boolean(),
      startedBy: t.Boolean(),
      completedBy: t.Boolean(),
      steps: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const SopRunInclude = t.Partial(
  t.Object(
    {
      domain: t.Boolean(),
      clinic: t.Boolean(),
      template: t.Boolean(),
      labItem: t.Boolean(),
      radiologyItem: t.Boolean(),
      operationCase: t.Boolean(),
      startedBy: t.Boolean(),
      completedBy: t.Boolean(),
      steps: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const SopRunOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clinicId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      templateId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      templateVersion: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      labItemId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      radiologyItemId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      operationCaseId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      startedById: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      completedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      completedById: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const SopRun = t.Composite([SopRunPlain, SopRunRelations], {
  additionalProperties: false,
});

export const SopRunInputCreate = t.Composite(
  [SopRunPlainInputCreate, SopRunRelationsInputCreate],
  { additionalProperties: false },
);

export const SopRunInputUpdate = t.Composite(
  [SopRunPlainInputUpdate, SopRunRelationsInputUpdate],
  { additionalProperties: false },
);
