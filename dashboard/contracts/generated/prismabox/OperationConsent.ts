import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const OperationConsentPlain = t.Object(
  {
    id: t.String(),
    caseId: t.String(),
    type: t.Union(
      [
        t.Literal("SURGICAL"),
        t.Literal("ANESTHESIA"),
        t.Literal("BLOOD_PRODUCTS"),
        t.Literal("EUTHANASIA"),
        t.Literal("FINANCIAL_ESTIMATE"),
        t.Literal("HIGH_RISK_SURGICAL"),
        t.Literal("HOSPITALIZATION"),
        t.Literal("DISCHARGE_HEALTHY"),
        t.Literal("DISCHARGE_HOME_TREATMENT"),
        t.Literal("DISCHARGE_AGAINST_ADVICE"),
        t.Literal("BOARDING"),
        t.Literal("GROOMING"),
        t.Literal("EMERGENCY_TREATMENT"),
      ],
      { additionalProperties: false },
    ),
    textSnapshot: t.String(),
    estimateLow: __nullable__(t.Number()),
    estimateHigh: __nullable__(t.Number()),
    signerName: __nullable__(t.String()),
    signerRelationship: __nullable__(t.String()),
    signatureMethod: __nullable__(
      t.Union(
        [
          t.Literal("DRAWN"),
          t.Literal("TYPED"),
          t.Literal("UPLOADED"),
          t.Literal("VERBAL_WITNESSED"),
        ],
        { additionalProperties: false },
      ),
    ),
    signatureUrl: __nullable__(t.String()),
    witnessStaffId: __nullable__(t.String()),
    signedAt: __nullable__(t.Date()),
    revokedAt: __nullable__(t.Date()),
    revokeReason: __nullable__(t.String()),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  },
  { additionalProperties: false },
);

export const OperationConsentRelations = t.Object(
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
    witnessStaff: __nullable__(
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

export const OperationConsentPlainInputCreate = t.Object(
  {
    type: t.Union(
      [
        t.Literal("SURGICAL"),
        t.Literal("ANESTHESIA"),
        t.Literal("BLOOD_PRODUCTS"),
        t.Literal("EUTHANASIA"),
        t.Literal("FINANCIAL_ESTIMATE"),
        t.Literal("HIGH_RISK_SURGICAL"),
        t.Literal("HOSPITALIZATION"),
        t.Literal("DISCHARGE_HEALTHY"),
        t.Literal("DISCHARGE_HOME_TREATMENT"),
        t.Literal("DISCHARGE_AGAINST_ADVICE"),
        t.Literal("BOARDING"),
        t.Literal("GROOMING"),
        t.Literal("EMERGENCY_TREATMENT"),
      ],
      { additionalProperties: false },
    ),
    textSnapshot: t.String(),
    estimateLow: t.Optional(__nullable__(t.Number())),
    estimateHigh: t.Optional(__nullable__(t.Number())),
    signerName: t.Optional(__nullable__(t.String())),
    signerRelationship: t.Optional(__nullable__(t.String())),
    signatureMethod: t.Optional(
      __nullable__(
        t.Union(
          [
            t.Literal("DRAWN"),
            t.Literal("TYPED"),
            t.Literal("UPLOADED"),
            t.Literal("VERBAL_WITNESSED"),
          ],
          { additionalProperties: false },
        ),
      ),
    ),
    signatureUrl: t.Optional(__nullable__(t.String())),
    signedAt: t.Optional(__nullable__(t.Date())),
    revokedAt: t.Optional(__nullable__(t.Date())),
    revokeReason: t.Optional(__nullable__(t.String())),
  },
  { additionalProperties: false },
);

export const OperationConsentPlainInputUpdate = t.Object(
  {
    type: t.Optional(
      t.Union(
        [
          t.Literal("SURGICAL"),
          t.Literal("ANESTHESIA"),
          t.Literal("BLOOD_PRODUCTS"),
          t.Literal("EUTHANASIA"),
          t.Literal("FINANCIAL_ESTIMATE"),
          t.Literal("HIGH_RISK_SURGICAL"),
          t.Literal("HOSPITALIZATION"),
          t.Literal("DISCHARGE_HEALTHY"),
          t.Literal("DISCHARGE_HOME_TREATMENT"),
          t.Literal("DISCHARGE_AGAINST_ADVICE"),
          t.Literal("BOARDING"),
          t.Literal("GROOMING"),
          t.Literal("EMERGENCY_TREATMENT"),
        ],
        { additionalProperties: false },
      ),
    ),
    textSnapshot: t.Optional(t.String()),
    estimateLow: t.Optional(__nullable__(t.Number())),
    estimateHigh: t.Optional(__nullable__(t.Number())),
    signerName: t.Optional(__nullable__(t.String())),
    signerRelationship: t.Optional(__nullable__(t.String())),
    signatureMethod: t.Optional(
      __nullable__(
        t.Union(
          [
            t.Literal("DRAWN"),
            t.Literal("TYPED"),
            t.Literal("UPLOADED"),
            t.Literal("VERBAL_WITNESSED"),
          ],
          { additionalProperties: false },
        ),
      ),
    ),
    signatureUrl: t.Optional(__nullable__(t.String())),
    signedAt: t.Optional(__nullable__(t.Date())),
    revokedAt: t.Optional(__nullable__(t.Date())),
    revokeReason: t.Optional(__nullable__(t.String())),
  },
  { additionalProperties: false },
);

export const OperationConsentRelationsInputCreate = t.Object(
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
    witnessStaff: t.Optional(
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

export const OperationConsentRelationsInputUpdate = t.Partial(
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
      witnessStaff: t.Partial(
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

export const OperationConsentWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          caseId: t.String(),
          type: t.Union(
            [
              t.Literal("SURGICAL"),
              t.Literal("ANESTHESIA"),
              t.Literal("BLOOD_PRODUCTS"),
              t.Literal("EUTHANASIA"),
              t.Literal("FINANCIAL_ESTIMATE"),
              t.Literal("HIGH_RISK_SURGICAL"),
              t.Literal("HOSPITALIZATION"),
              t.Literal("DISCHARGE_HEALTHY"),
              t.Literal("DISCHARGE_HOME_TREATMENT"),
              t.Literal("DISCHARGE_AGAINST_ADVICE"),
              t.Literal("BOARDING"),
              t.Literal("GROOMING"),
              t.Literal("EMERGENCY_TREATMENT"),
            ],
            { additionalProperties: false },
          ),
          textSnapshot: t.String(),
          estimateLow: t.Number(),
          estimateHigh: t.Number(),
          signerName: t.String(),
          signerRelationship: t.String(),
          signatureMethod: t.Union(
            [
              t.Literal("DRAWN"),
              t.Literal("TYPED"),
              t.Literal("UPLOADED"),
              t.Literal("VERBAL_WITNESSED"),
            ],
            { additionalProperties: false },
          ),
          signatureUrl: t.String(),
          witnessStaffId: t.String(),
          signedAt: t.Date(),
          revokedAt: t.Date(),
          revokeReason: t.String(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "OperationConsent" },
  ),
);

export const OperationConsentWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object({ id: t.String() }, { additionalProperties: false }),
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
              caseId: t.String(),
              type: t.Union(
                [
                  t.Literal("SURGICAL"),
                  t.Literal("ANESTHESIA"),
                  t.Literal("BLOOD_PRODUCTS"),
                  t.Literal("EUTHANASIA"),
                  t.Literal("FINANCIAL_ESTIMATE"),
                  t.Literal("HIGH_RISK_SURGICAL"),
                  t.Literal("HOSPITALIZATION"),
                  t.Literal("DISCHARGE_HEALTHY"),
                  t.Literal("DISCHARGE_HOME_TREATMENT"),
                  t.Literal("DISCHARGE_AGAINST_ADVICE"),
                  t.Literal("BOARDING"),
                  t.Literal("GROOMING"),
                  t.Literal("EMERGENCY_TREATMENT"),
                ],
                { additionalProperties: false },
              ),
              textSnapshot: t.String(),
              estimateLow: t.Number(),
              estimateHigh: t.Number(),
              signerName: t.String(),
              signerRelationship: t.String(),
              signatureMethod: t.Union(
                [
                  t.Literal("DRAWN"),
                  t.Literal("TYPED"),
                  t.Literal("UPLOADED"),
                  t.Literal("VERBAL_WITNESSED"),
                ],
                { additionalProperties: false },
              ),
              signatureUrl: t.String(),
              witnessStaffId: t.String(),
              signedAt: t.Date(),
              revokedAt: t.Date(),
              revokeReason: t.String(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "OperationConsent" },
);

export const OperationConsentSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      caseId: t.Boolean(),
      type: t.Boolean(),
      textSnapshot: t.Boolean(),
      estimateLow: t.Boolean(),
      estimateHigh: t.Boolean(),
      signerName: t.Boolean(),
      signerRelationship: t.Boolean(),
      signatureMethod: t.Boolean(),
      signatureUrl: t.Boolean(),
      witnessStaffId: t.Boolean(),
      signedAt: t.Boolean(),
      revokedAt: t.Boolean(),
      revokeReason: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      case: t.Boolean(),
      witnessStaff: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const OperationConsentInclude = t.Partial(
  t.Object(
    {
      type: t.Boolean(),
      signatureMethod: t.Boolean(),
      case: t.Boolean(),
      witnessStaff: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const OperationConsentOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      caseId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      textSnapshot: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      estimateLow: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      estimateHigh: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      signerName: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      signerRelationship: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      signatureUrl: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      witnessStaffId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      signedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      revokedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      revokeReason: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const OperationConsent = t.Composite(
  [OperationConsentPlain, OperationConsentRelations],
  { additionalProperties: false },
);

export const OperationConsentInputCreate = t.Composite(
  [OperationConsentPlainInputCreate, OperationConsentRelationsInputCreate],
  { additionalProperties: false },
);

export const OperationConsentInputUpdate = t.Composite(
  [OperationConsentPlainInputUpdate, OperationConsentRelationsInputUpdate],
  { additionalProperties: false },
);
