import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const InsuranceClaimPlain = t.Object(
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
);

export const InsuranceClaimRelations = t.Object(
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
    invoice: t.Object(
      {
        id: t.String(),
        code: t.String(),
        clinicId: t.String(),
        appointmentId: __nullable__(t.String()),
        labOrderId: __nullable__(t.String()),
        radiologyOrderId: __nullable__(t.String()),
        operationId: __nullable__(t.String()),
        groomingSessionId: __nullable__(t.String()),
        inpatientStayId: __nullable__(t.String()),
        subtotal: t.Number(),
        vatRate: t.Number(),
        vatAmount: t.Number(),
        taxTemplateId: __nullable__(t.String()),
        discount: t.Number(),
        total: t.Number(),
        amountPaid: t.Number(),
        currencyCode: t.String(),
        membershipId: __nullable__(t.String()),
        insurerShare: __nullable__(t.Number()),
        copayShare: __nullable__(t.Number()),
        status: t.Union(
          [
            t.Literal("PENDING"),
            t.Literal("PARTIAL"),
            t.Literal("PAID"),
            t.Literal("VOIDED"),
            t.Literal("REFUNDED"),
          ],
          { additionalProperties: false },
        ),
        paymentMethod: __nullable__(
          t.Union(
            [t.Literal("CASH"), t.Literal("CARD"), t.Literal("TRANSFER")],
            { additionalProperties: false },
          ),
        ),
        paidAt: __nullable__(t.Date()),
        refundedAt: __nullable__(t.Date()),
        refundReason: __nullable__(t.String()),
        refundedById: __nullable__(t.String()),
        stripePaymentIntentId: __nullable__(t.String()),
        createdAt: t.Date(),
        updatedAt: t.Date(),
      },
      { additionalProperties: false },
    ),
    policy: t.Object(
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
    ),
    insurer: t.Object(
      {
        id: t.String(),
        code: t.String(),
        clinicId: t.String(),
        name: t.String(),
        phone: __nullable__(t.String()),
        email: __nullable__(t.String()),
        contactPerson: __nullable__(t.String()),
        address: __nullable__(t.String()),
        settlementDays: t.Integer(),
        notes: __nullable__(t.String()),
        active: t.Boolean(),
        isDeleted: t.Boolean(),
        deletedAt: __nullable__(t.Date()),
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
    owner: t.Object(
      {
        id: t.String(),
        code: t.String(),
        clinicId: t.String(),
        name: t.String(),
        phone: t.String(),
        phoneE164: __nullable__(t.String()),
        email: __nullable__(t.String()),
        gender: __nullable__(
          t.Union(
            [t.Literal("MALE"), t.Literal("FEMALE"), t.Literal("UNKNOWN")],
            { additionalProperties: false },
          ),
        ),
        ownerType: t.Union(
          [
            t.Literal("ALL"),
            t.Literal("VIP"),
            t.Literal("LOYALTY"),
            t.Literal("NEW"),
            t.Literal("CURRENT"),
          ],
          { additionalProperties: false },
        ),
        relationship: __nullable__(
          t.Union(
            [
              t.Literal("OWNER"),
              t.Literal("GUARDIAN"),
              t.Literal("DELEGATE"),
              t.Literal("EMERGENCY"),
            ],
            { additionalProperties: false },
          ),
        ),
        country: __nullable__(t.String()),
        city: __nullable__(t.String()),
        address: __nullable__(t.String()),
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
    lines: t.Array(
      t.Object(
        {
          id: t.String(),
          claimId: t.String(),
          idx: t.Integer(),
          lineRef: t.String(),
          description: t.String(),
          lineTotal: t.Number(),
          coveragePercent: t.Number(),
          insurerAmount: t.Number(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    resolutionJournalEntry: __nullable__(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          documentNo: __nullable__(t.String()),
          docstatus: t.Union(
            [
              t.Literal("DRAFT"),
              t.Literal("SUBMITTED"),
              t.Literal("CANCELLED"),
            ],
            { additionalProperties: false },
          ),
          postingDate: t.Date(),
          amendedFromId: __nullable__(t.String()),
          voucherType: t.String(),
          chequeNo: __nullable__(t.String()),
          chequeDate: __nullable__(t.Date()),
          remark: __nullable__(t.String()),
          multiCurrency: t.Boolean(),
          isSystemGenerated: t.Boolean(),
          totalDebit: t.Number(),
          totalCredit: t.Number(),
          dim1: __nullable__(t.String()),
          dim2: __nullable__(t.String()),
          dim3: __nullable__(t.String()),
          dim4: __nullable__(t.String()),
          createdById: __nullable__(t.String()),
          submittedAt: __nullable__(t.Date()),
          submittedById: __nullable__(t.String()),
          cancelledAt: __nullable__(t.Date()),
          cancelledById: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    ),
  },
  { additionalProperties: false },
);

export const InsuranceClaimPlainInputCreate = t.Object(
  {
    documentNo: t.Optional(__nullable__(t.String())),
    policyNumberSnapshot: t.String(),
    serviceDate: t.Date(),
    claimedAmount: t.Number(),
    approvedAmount: t.Optional(__nullable__(t.Number())),
    settledAmount: t.Optional(t.Number()),
    status: t.Optional(
      t.Union(
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
    ),
    coverageSnapshot: t.Any(),
    submittedAt: t.Optional(__nullable__(t.Date())),
    adjudicatedAt: t.Optional(__nullable__(t.Date())),
    rejectionReason: t.Optional(__nullable__(t.String())),
    insurerReference: t.Optional(__nullable__(t.String())),
    rejectionResolution: t.Optional(
      __nullable__(
        t.Union([t.Literal("REBILL_OWNER"), t.Literal("WRITE_OFF")], {
          additionalProperties: false,
        }),
      ),
    ),
    resolvedAt: t.Optional(__nullable__(t.Date())),
  },
  { additionalProperties: false },
);

export const InsuranceClaimPlainInputUpdate = t.Object(
  {
    documentNo: t.Optional(__nullable__(t.String())),
    policyNumberSnapshot: t.Optional(t.String()),
    serviceDate: t.Optional(t.Date()),
    claimedAmount: t.Optional(t.Number()),
    approvedAmount: t.Optional(__nullable__(t.Number())),
    settledAmount: t.Optional(t.Number()),
    status: t.Optional(
      t.Union(
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
    ),
    coverageSnapshot: t.Optional(t.Any()),
    submittedAt: t.Optional(__nullable__(t.Date())),
    adjudicatedAt: t.Optional(__nullable__(t.Date())),
    rejectionReason: t.Optional(__nullable__(t.String())),
    insurerReference: t.Optional(__nullable__(t.String())),
    rejectionResolution: t.Optional(
      __nullable__(
        t.Union([t.Literal("REBILL_OWNER"), t.Literal("WRITE_OFF")], {
          additionalProperties: false,
        }),
      ),
    ),
    resolvedAt: t.Optional(__nullable__(t.Date())),
  },
  { additionalProperties: false },
);

export const InsuranceClaimRelationsInputCreate = t.Object(
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
    invoice: t.Object(
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
    policy: t.Object(
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
    insurer: t.Object(
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
    owner: t.Object(
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
    lines: t.Optional(
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
    resolutionJournalEntry: t.Optional(
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

export const InsuranceClaimRelationsInputUpdate = t.Partial(
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
      invoice: t.Object(
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
      policy: t.Object(
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
      insurer: t.Object(
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
      owner: t.Object(
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
      lines: t.Partial(
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
      resolutionJournalEntry: t.Partial(
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

export const InsuranceClaimWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          clinicId: t.String(),
          documentNo: t.String(),
          invoiceId: t.String(),
          policyId: t.String(),
          insurerId: t.String(),
          patientId: t.String(),
          ownerId: t.String(),
          policyNumberSnapshot: t.String(),
          serviceDate: t.Date(),
          claimedAmount: t.Number(),
          approvedAmount: t.Number(),
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
          submittedAt: t.Date(),
          adjudicatedAt: t.Date(),
          rejectionReason: t.String(),
          insurerReference: t.String(),
          rejectionResolution: t.Union(
            [t.Literal("REBILL_OWNER"), t.Literal("WRITE_OFF")],
            { additionalProperties: false },
          ),
          resolutionJournalEntryId: t.String(),
          resolvedAt: t.Date(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "InsuranceClaim" },
  ),
);

export const InsuranceClaimWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.String(), documentNo: t.String(), invoiceId: t.String() },
            { additionalProperties: false },
          ),
          { additionalProperties: false },
        ),
        t.Union(
          [
            t.Object({ id: t.String() }),
            t.Object({ documentNo: t.String() }),
            t.Object({ invoiceId: t.String() }),
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
              documentNo: t.String(),
              invoiceId: t.String(),
              policyId: t.String(),
              insurerId: t.String(),
              patientId: t.String(),
              ownerId: t.String(),
              policyNumberSnapshot: t.String(),
              serviceDate: t.Date(),
              claimedAmount: t.Number(),
              approvedAmount: t.Number(),
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
              submittedAt: t.Date(),
              adjudicatedAt: t.Date(),
              rejectionReason: t.String(),
              insurerReference: t.String(),
              rejectionResolution: t.Union(
                [t.Literal("REBILL_OWNER"), t.Literal("WRITE_OFF")],
                { additionalProperties: false },
              ),
              resolutionJournalEntryId: t.String(),
              resolvedAt: t.Date(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "InsuranceClaim" },
);

export const InsuranceClaimSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      clinicId: t.Boolean(),
      documentNo: t.Boolean(),
      invoiceId: t.Boolean(),
      policyId: t.Boolean(),
      insurerId: t.Boolean(),
      patientId: t.Boolean(),
      ownerId: t.Boolean(),
      policyNumberSnapshot: t.Boolean(),
      serviceDate: t.Boolean(),
      claimedAmount: t.Boolean(),
      approvedAmount: t.Boolean(),
      settledAmount: t.Boolean(),
      status: t.Boolean(),
      coverageSnapshot: t.Boolean(),
      submittedAt: t.Boolean(),
      adjudicatedAt: t.Boolean(),
      rejectionReason: t.Boolean(),
      insurerReference: t.Boolean(),
      rejectionResolution: t.Boolean(),
      resolutionJournalEntryId: t.Boolean(),
      resolvedAt: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinic: t.Boolean(),
      invoice: t.Boolean(),
      policy: t.Boolean(),
      insurer: t.Boolean(),
      patient: t.Boolean(),
      owner: t.Boolean(),
      lines: t.Boolean(),
      resolutionJournalEntry: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const InsuranceClaimInclude = t.Partial(
  t.Object(
    {
      status: t.Boolean(),
      rejectionResolution: t.Boolean(),
      clinic: t.Boolean(),
      invoice: t.Boolean(),
      policy: t.Boolean(),
      insurer: t.Boolean(),
      patient: t.Boolean(),
      owner: t.Boolean(),
      lines: t.Boolean(),
      resolutionJournalEntry: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const InsuranceClaimOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clinicId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      documentNo: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      invoiceId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      policyId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      insurerId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      patientId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      ownerId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      policyNumberSnapshot: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      serviceDate: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      claimedAmount: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      approvedAmount: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      settledAmount: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      coverageSnapshot: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      submittedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      adjudicatedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      rejectionReason: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      insurerReference: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      resolutionJournalEntryId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      resolvedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const InsuranceClaim = t.Composite(
  [InsuranceClaimPlain, InsuranceClaimRelations],
  { additionalProperties: false },
);

export const InsuranceClaimInputCreate = t.Composite(
  [InsuranceClaimPlainInputCreate, InsuranceClaimRelationsInputCreate],
  { additionalProperties: false },
);

export const InsuranceClaimInputUpdate = t.Composite(
  [InsuranceClaimPlainInputUpdate, InsuranceClaimRelationsInputUpdate],
  { additionalProperties: false },
);
