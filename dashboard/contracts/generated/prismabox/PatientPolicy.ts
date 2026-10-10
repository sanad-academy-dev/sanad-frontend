import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const PatientPolicyPlain = t.Object(
  {
    id: t.String(),
    clinicId: t.String(),
    patientId: t.String(),
    productId: t.String(),
    policyNumber: t.String(),
    policyStart: t.Date(),
    policyEnd: t.Date(),
    status: t.Union(
      [
        t.Literal("ACTIVE"),
        t.Literal("EXPIRED"),
        t.Literal("SUSPENDED"),
        t.Literal("CANCELLED"),
      ],
      { additionalProperties: false },
    ),
    capConsumed: t.Number(),
    notes: __nullable__(t.String()),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  },
  { additionalProperties: false },
);

export const PatientPolicyRelations = t.Object(
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
    patient: t.Object(
      {
        id: t.String(),
        code: t.String(),
        clinicId: t.String(),
        ownerId: __nullable__(t.String()),
        name: t.String(),
        nameNormalized: t.String(),
        gender: t.Union(
          [t.Literal("MALE"), t.Literal("FEMALE"), t.Literal("UNKNOWN")],
          { additionalProperties: false },
        ),
        animalTypeId: t.String(),
        animalStrainId: __nullable__(t.String()),
        age: __nullable__(t.Number()),
        birthDate: __nullable__(t.Date()),
        weight: __nullable__(t.Number()),
        microchipNumber: __nullable__(t.String()),
        coat: __nullable__(t.String()),
        notes: __nullable__(t.String()),
        active: t.Boolean(),
        isDeleted: t.Boolean(),
        deletedAt: __nullable__(t.Date()),
        editsCount: t.Integer(),
        createdAt: t.Date(),
        updatedAt: t.Date(),
      },
      { additionalProperties: false },
    ),
    product: t.Object(
      {
        id: t.String(),
        code: t.String(),
        clinicId: t.String(),
        insurerId: t.String(),
        name: t.String(),
        coveragePercentDefault: t.Number(),
        annualCap: __nullable__(t.Number()),
        perClaimCap: __nullable__(t.Number()),
        deductibleFixed: t.Number(),
        deductiblePercent: t.Number(),
        active: t.Boolean(),
        createdAt: t.Date(),
        updatedAt: t.Date(),
      },
      { additionalProperties: false },
    ),
    claims: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          documentNo: __nullable__(t.String()),
          invoiceId: t.String(),
          policyId: t.String(),
          insurerId: t.String(),
          patientId: t.String(),
          ownerId: t.String(),
          policyNumberSnapshot: t.String(),
          serviceDate: t.Date(),
          claimedAmount: t.Number(),
          approvedAmount: __nullable__(t.Number()),
          settledAmount: t.Number(),
          status: t.Union(
            [
              t.Literal("DRAFT"),
              t.Literal("SUBMITTED"),
              t.Literal("APPROVED"),
              t.Literal("PARTIALLY_APPROVED"),
              t.Literal("REJECTED"),
              t.Literal("SETTLED"),
              t.Literal("CANCELLED"),
            ],
            { additionalProperties: false },
          ),
          coverageSnapshot: t.Any(),
          submittedAt: __nullable__(t.Date()),
          adjudicatedAt: __nullable__(t.Date()),
          rejectionReason: __nullable__(t.String()),
          insurerReference: __nullable__(t.String()),
          rejectionResolution: __nullable__(
            t.Union([t.Literal("REBILL_OWNER"), t.Literal("WRITE_OFF")], {
              additionalProperties: false,
            }),
          ),
          resolutionJournalEntryId: __nullable__(t.String()),
          resolvedAt: __nullable__(t.Date()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const PatientPolicyPlainInputCreate = t.Object(
  {
    policyNumber: t.String(),
    policyStart: t.Date(),
    policyEnd: t.Date(),
    status: t.Optional(
      t.Union(
        [
          t.Literal("ACTIVE"),
          t.Literal("EXPIRED"),
          t.Literal("SUSPENDED"),
          t.Literal("CANCELLED"),
        ],
        { additionalProperties: false },
      ),
    ),
    capConsumed: t.Optional(t.Number()),
    notes: t.Optional(__nullable__(t.String())),
  },
  { additionalProperties: false },
);

export const PatientPolicyPlainInputUpdate = t.Object(
  {
    policyNumber: t.Optional(t.String()),
    policyStart: t.Optional(t.Date()),
    policyEnd: t.Optional(t.Date()),
    status: t.Optional(
      t.Union(
        [
          t.Literal("ACTIVE"),
          t.Literal("EXPIRED"),
          t.Literal("SUSPENDED"),
          t.Literal("CANCELLED"),
        ],
        { additionalProperties: false },
      ),
    ),
    capConsumed: t.Optional(t.Number()),
    notes: t.Optional(__nullable__(t.String())),
  },
  { additionalProperties: false },
);

export const PatientPolicyRelationsInputCreate = t.Object(
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
    patient: t.Object(
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
    product: t.Object(
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
    claims: t.Optional(
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

export const PatientPolicyRelationsInputUpdate = t.Partial(
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
      patient: t.Object(
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
      product: t.Object(
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
      claims: t.Partial(
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

export const PatientPolicyWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          clinicId: t.String(),
          patientId: t.String(),
          productId: t.String(),
          policyNumber: t.String(),
          policyStart: t.Date(),
          policyEnd: t.Date(),
          status: t.Union(
            [
              t.Literal("ACTIVE"),
              t.Literal("EXPIRED"),
              t.Literal("SUSPENDED"),
              t.Literal("CANCELLED"),
            ],
            { additionalProperties: false },
          ),
          capConsumed: t.Number(),
          notes: t.String(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "PatientPolicy" },
  ),
);

export const PatientPolicyWhereUnique = t.Recursive(
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
              clinicId: t.String(),
              patientId: t.String(),
              productId: t.String(),
              policyNumber: t.String(),
              policyStart: t.Date(),
              policyEnd: t.Date(),
              status: t.Union(
                [
                  t.Literal("ACTIVE"),
                  t.Literal("EXPIRED"),
                  t.Literal("SUSPENDED"),
                  t.Literal("CANCELLED"),
                ],
                { additionalProperties: false },
              ),
              capConsumed: t.Number(),
              notes: t.String(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "PatientPolicy" },
);

export const PatientPolicySelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      clinicId: t.Boolean(),
      patientId: t.Boolean(),
      productId: t.Boolean(),
      policyNumber: t.Boolean(),
      policyStart: t.Boolean(),
      policyEnd: t.Boolean(),
      status: t.Boolean(),
      capConsumed: t.Boolean(),
      notes: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinic: t.Boolean(),
      patient: t.Boolean(),
      product: t.Boolean(),
      claims: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const PatientPolicyInclude = t.Partial(
  t.Object(
    {
      status: t.Boolean(),
      clinic: t.Boolean(),
      patient: t.Boolean(),
      product: t.Boolean(),
      claims: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const PatientPolicyOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clinicId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      patientId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      productId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      policyNumber: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      policyStart: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      policyEnd: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      capConsumed: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      notes: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const PatientPolicy = t.Composite(
  [PatientPolicyPlain, PatientPolicyRelations],
  { additionalProperties: false },
);

export const PatientPolicyInputCreate = t.Composite(
  [PatientPolicyPlainInputCreate, PatientPolicyRelationsInputCreate],
  { additionalProperties: false },
);

export const PatientPolicyInputUpdate = t.Composite(
  [PatientPolicyPlainInputUpdate, PatientPolicyRelationsInputUpdate],
  { additionalProperties: false },
);
