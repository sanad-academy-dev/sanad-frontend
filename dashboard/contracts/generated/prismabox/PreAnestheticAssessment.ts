import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const PreAnestheticAssessmentPlain = t.Object(
  {
    id: t.String(),
    caseId: t.String(),
    asaClass: __nullable__(t.Integer()),
    asaEmergency: t.Boolean(),
    lastFoodAt: __nullable__(t.Date()),
    lastWaterAt: __nullable__(t.Date()),
    fastingVerified: t.Boolean(),
    vitalsRecordId: __nullable__(t.String()),
    physicalFindings: __nullable__(t.String()),
    airwayAssessment: __nullable__(t.String()),
    medications: __nullable__(t.String()),
    allergies: __nullable__(t.String()),
    bloodworkReviewed: t.Boolean(),
    imagingReviewed: t.Boolean(),
    labOrderId: __nullable__(t.String()),
    radiologyOrderId: __nullable__(t.String()),
    riskNotes: __nullable__(t.String()),
    premedPlan: __nullable__(t.String()),
    assessedById: __nullable__(t.String()),
    assessedAt: __nullable__(t.Date()),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  },
  { additionalProperties: false },
);

export const PreAnestheticAssessmentRelations = t.Object(
  {
    case: t.Object(
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
    vitalsRecord: __nullable__(
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
    assessedBy: __nullable__(
      t.Object(
        {
          id: t.String(),
          code: t.String(),
          clinicId: t.String(),
          userId: __nullable__(t.String()),
          roleId: t.String(),
          branchId: t.String(),
          name: t.String(),
          gender: __nullable__(
            t.Union(
              [t.Literal("MALE"), t.Literal("FEMALE"), t.Literal("UNKNOWN")],
              { additionalProperties: false },
            ),
          ),
          prefix: __nullable__(
            t.Union(
              [
                t.Literal("MR"),
                t.Literal("MRS"),
                t.Literal("MS"),
                t.Literal("DR"),
                t.Literal("PROF"),
              ],
              { additionalProperties: false },
            ),
          ),
          age: __nullable__(t.Integer()),
          licenseNumber: __nullable__(t.String()),
          email: t.String(),
          phone: __nullable__(t.String()),
          country: __nullable__(t.String()),
          city: __nullable__(t.String()),
          address: __nullable__(t.String()),
          notes: __nullable__(t.String()),
          bio: __nullable__(t.String()),
          educationalQualification: __nullable__(t.String()),
          nationality: __nullable__(t.String()),
          avatar: __nullable__(t.String()),
          primarySpecializationId: __nullable__(t.String()),
          secondarySpecializationId: __nullable__(t.String()),
          employmentType: __nullable__(
            t.Union([t.Literal("FULL_TIME"), t.Literal("PART_TIME")], {
              additionalProperties: false,
            }),
          ),
          hireDate: __nullable__(t.Date()),
          isSaudi: t.Boolean(),
          status: t.Union(
            [t.Literal("PENDING"), t.Literal("ACTIVE"), t.Literal("INACTIVE")],
            { additionalProperties: false },
          ),
          active: t.Boolean(),
          isDeleted: t.Boolean(),
          deletedAt: __nullable__(t.Date()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    ),
  },
  { additionalProperties: false },
);

export const PreAnestheticAssessmentPlainInputCreate = t.Object(
  {
    asaClass: t.Optional(__nullable__(t.Integer())),
    asaEmergency: t.Optional(t.Boolean()),
    lastFoodAt: t.Optional(__nullable__(t.Date())),
    lastWaterAt: t.Optional(__nullable__(t.Date())),
    fastingVerified: t.Optional(t.Boolean()),
    physicalFindings: t.Optional(__nullable__(t.String())),
    airwayAssessment: t.Optional(__nullable__(t.String())),
    medications: t.Optional(__nullable__(t.String())),
    allergies: t.Optional(__nullable__(t.String())),
    bloodworkReviewed: t.Optional(t.Boolean()),
    imagingReviewed: t.Optional(t.Boolean()),
    riskNotes: t.Optional(__nullable__(t.String())),
    premedPlan: t.Optional(__nullable__(t.String())),
    assessedAt: t.Optional(__nullable__(t.Date())),
  },
  { additionalProperties: false },
);

export const PreAnestheticAssessmentPlainInputUpdate = t.Object(
  {
    asaClass: t.Optional(__nullable__(t.Integer())),
    asaEmergency: t.Optional(t.Boolean()),
    lastFoodAt: t.Optional(__nullable__(t.Date())),
    lastWaterAt: t.Optional(__nullable__(t.Date())),
    fastingVerified: t.Optional(t.Boolean()),
    physicalFindings: t.Optional(__nullable__(t.String())),
    airwayAssessment: t.Optional(__nullable__(t.String())),
    medications: t.Optional(__nullable__(t.String())),
    allergies: t.Optional(__nullable__(t.String())),
    bloodworkReviewed: t.Optional(t.Boolean()),
    imagingReviewed: t.Optional(t.Boolean()),
    riskNotes: t.Optional(__nullable__(t.String())),
    premedPlan: t.Optional(__nullable__(t.String())),
    assessedAt: t.Optional(__nullable__(t.Date())),
  },
  { additionalProperties: false },
);

export const PreAnestheticAssessmentRelationsInputCreate = t.Object(
  {
    case: t.Object(
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
    vitalsRecord: t.Optional(
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
    assessedBy: t.Optional(
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

export const PreAnestheticAssessmentRelationsInputUpdate = t.Partial(
  t.Object(
    {
      case: t.Object(
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
      vitalsRecord: t.Partial(
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
      assessedBy: t.Partial(
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

export const PreAnestheticAssessmentWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          caseId: t.String(),
          asaClass: t.Integer(),
          asaEmergency: t.Boolean(),
          lastFoodAt: t.Date(),
          lastWaterAt: t.Date(),
          fastingVerified: t.Boolean(),
          vitalsRecordId: t.String(),
          physicalFindings: t.String(),
          airwayAssessment: t.String(),
          medications: t.String(),
          allergies: t.String(),
          bloodworkReviewed: t.Boolean(),
          imagingReviewed: t.Boolean(),
          labOrderId: t.String(),
          radiologyOrderId: t.String(),
          riskNotes: t.String(),
          premedPlan: t.String(),
          assessedById: t.String(),
          assessedAt: t.Date(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "PreAnestheticAssessment" },
  ),
);

export const PreAnestheticAssessmentWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.String(), caseId: t.String() },
            { additionalProperties: false },
          ),
          { additionalProperties: false },
        ),
        t.Union(
          [t.Object({ id: t.String() }), t.Object({ caseId: t.String() })],
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
              caseId: t.String(),
              asaClass: t.Integer(),
              asaEmergency: t.Boolean(),
              lastFoodAt: t.Date(),
              lastWaterAt: t.Date(),
              fastingVerified: t.Boolean(),
              vitalsRecordId: t.String(),
              physicalFindings: t.String(),
              airwayAssessment: t.String(),
              medications: t.String(),
              allergies: t.String(),
              bloodworkReviewed: t.Boolean(),
              imagingReviewed: t.Boolean(),
              labOrderId: t.String(),
              radiologyOrderId: t.String(),
              riskNotes: t.String(),
              premedPlan: t.String(),
              assessedById: t.String(),
              assessedAt: t.Date(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "PreAnestheticAssessment" },
);

export const PreAnestheticAssessmentSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      caseId: t.Boolean(),
      asaClass: t.Boolean(),
      asaEmergency: t.Boolean(),
      lastFoodAt: t.Boolean(),
      lastWaterAt: t.Boolean(),
      fastingVerified: t.Boolean(),
      vitalsRecordId: t.Boolean(),
      physicalFindings: t.Boolean(),
      airwayAssessment: t.Boolean(),
      medications: t.Boolean(),
      allergies: t.Boolean(),
      bloodworkReviewed: t.Boolean(),
      imagingReviewed: t.Boolean(),
      labOrderId: t.Boolean(),
      radiologyOrderId: t.Boolean(),
      riskNotes: t.Boolean(),
      premedPlan: t.Boolean(),
      assessedById: t.Boolean(),
      assessedAt: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      case: t.Boolean(),
      vitalsRecord: t.Boolean(),
      assessedBy: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const PreAnestheticAssessmentInclude = t.Partial(
  t.Object(
    {
      case: t.Boolean(),
      vitalsRecord: t.Boolean(),
      assessedBy: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const PreAnestheticAssessmentOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      caseId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      asaClass: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      asaEmergency: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      lastFoodAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      lastWaterAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      fastingVerified: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      vitalsRecordId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      physicalFindings: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      airwayAssessment: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      medications: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      allergies: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      bloodworkReviewed: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      imagingReviewed: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      labOrderId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      radiologyOrderId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      riskNotes: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      premedPlan: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      assessedById: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      assessedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const PreAnestheticAssessment = t.Composite(
  [PreAnestheticAssessmentPlain, PreAnestheticAssessmentRelations],
  { additionalProperties: false },
);

export const PreAnestheticAssessmentInputCreate = t.Composite(
  [
    PreAnestheticAssessmentPlainInputCreate,
    PreAnestheticAssessmentRelationsInputCreate,
  ],
  { additionalProperties: false },
);

export const PreAnestheticAssessmentInputUpdate = t.Composite(
  [
    PreAnestheticAssessmentPlainInputUpdate,
    PreAnestheticAssessmentRelationsInputUpdate,
  ],
  { additionalProperties: false },
);
