import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const JournalEntryPlain = t.Object(
  {
    id: t.String(),
    clinicId: t.String(),
    documentNo: __nullable__(t.String()),
    docstatus: t.Union(
      [t.Literal("DRAFT"), t.Literal("SUBMITTED"), t.Literal("CANCELLED")],
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
);

export const JournalEntryRelations = t.Object(
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
    amendedFrom: __nullable__(
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
    amendments: t.Array(
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
      { additionalProperties: false },
    ),
    rows: t.Array(
      t.Object(
        {
          id: t.String(),
          journalEntryId: t.String(),
          idx: t.Integer(),
          accountId: t.String(),
          debit: t.Number(),
          credit: t.Number(),
          costCenterId: __nullable__(t.String()),
          userRemark: __nullable__(t.String()),
          dim1: __nullable__(t.String()),
          dim2: __nullable__(t.String()),
          dim3: __nullable__(t.String()),
          dim4: __nullable__(t.String()),
          clearanceDate: __nullable__(t.Date()),
          exchangeRate: t.Number(),
          debitInAccountCurrency: t.Number(),
          creditInAccountCurrency: t.Number(),
          partyType: __nullable__(t.String()),
          partyId: __nullable__(t.String()),
          referenceType: __nullable__(t.String()),
          referenceId: __nullable__(t.String()),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    deferredSchedule: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          type: t.Union([t.Literal("REVENUE"), t.Literal("EXPENSE")], {
            additionalProperties: false,
          }),
          salesInvoiceItemId: __nullable__(t.String()),
          purchaseInvoiceItemId: __nullable__(t.String()),
          periodEndDate: t.Date({
            description: `آخر يوم في الفترة المعترَف بها — المفتاح الزمني للفريدة`,
          }),
          amount: t.Number(),
          journalEntryId: __nullable__(
            t.String({
              description: `القيد الذي حمل الاعتراف: مباشر إلى الأستاذ أو عبر قيد يومية (§19 علم الإعداد)`,
            }),
          ),
          postedAt: t.Date(),
          createdById: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    posClosingEntries: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          openingId: t.String(),
          closedAt: t.Date(),
          closedById: __nullable__(t.String()),
          totalDifference: t.Number({
            description: `مجموع الفروق (معدود − متوقَّع) عبر الوسائل؛ موجب = زيادة في الدرج`,
          }),
          journalEntryId: __nullable__(
            t.String({ description: `القيد الذي حمل الفرق، إن وُجد فرق` }),
          ),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `إقفال وردية: المتوقَّع مقابل المعدود لكل وسيلة، والفرق يُرحَّل.`,
        },
      ),
      { additionalProperties: false },
    ),
    dunnings: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          typeId: __nullable__(t.String()),
          partyType: t.String(),
          partyId: t.String(),
          postingDate: t.Date(),
          status: t.Union(
            [
              t.Literal("DRAFT"),
              t.Literal("UNRESOLVED"),
              t.Literal("RESOLVED"),
              t.Literal("CANCELLED"),
            ],
            { additionalProperties: false },
          ),
          rateOfInterest: t.Number(),
          dunningFee: t.Number(),
          totalOutstanding: t.Number({
            description: `مجموع أصل المتأخّرات وقت الإصدار — لقطة، لا يُعاد حسابها`,
          }),
          totalInterest: t.Number(),
          dunningAmount: t.Number({
            description: `الفائدة + الرسم = ما تطالب به المطالبة زيادةً على الأصل`,
          }),
          journalEntryId: __nullable__(
            t.String({
              description: `قيد الفائدة والرسم المُرحَّل عند اعتماد المطالبة — منه تُحصَّل عبر سند قبض عادي`,
            }),
          ),
          createdById: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `مطالبة على طرف: تجمع فواتيره المتأخّرة وتضيف الفائدة والرسم.`,
        },
      ),
      { additionalProperties: false },
    ),
    insuranceClaimResolutions: t.Array(
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

export const JournalEntryPlainInputCreate = t.Object(
  {
    documentNo: t.Optional(__nullable__(t.String())),
    docstatus: t.Optional(
      t.Union(
        [t.Literal("DRAFT"), t.Literal("SUBMITTED"), t.Literal("CANCELLED")],
        { additionalProperties: false },
      ),
    ),
    postingDate: t.Date(),
    voucherType: t.Optional(t.String()),
    chequeNo: t.Optional(__nullable__(t.String())),
    chequeDate: t.Optional(__nullable__(t.Date())),
    remark: t.Optional(__nullable__(t.String())),
    multiCurrency: t.Optional(t.Boolean()),
    isSystemGenerated: t.Optional(t.Boolean()),
    totalDebit: t.Optional(t.Number()),
    totalCredit: t.Optional(t.Number()),
    dim1: t.Optional(__nullable__(t.String())),
    dim2: t.Optional(__nullable__(t.String())),
    dim3: t.Optional(__nullable__(t.String())),
    dim4: t.Optional(__nullable__(t.String())),
    submittedAt: t.Optional(__nullable__(t.Date())),
    cancelledAt: t.Optional(__nullable__(t.Date())),
  },
  { additionalProperties: false },
);

export const JournalEntryPlainInputUpdate = t.Object(
  {
    documentNo: t.Optional(__nullable__(t.String())),
    docstatus: t.Optional(
      t.Union(
        [t.Literal("DRAFT"), t.Literal("SUBMITTED"), t.Literal("CANCELLED")],
        { additionalProperties: false },
      ),
    ),
    postingDate: t.Optional(t.Date()),
    voucherType: t.Optional(t.String()),
    chequeNo: t.Optional(__nullable__(t.String())),
    chequeDate: t.Optional(__nullable__(t.Date())),
    remark: t.Optional(__nullable__(t.String())),
    multiCurrency: t.Optional(t.Boolean()),
    isSystemGenerated: t.Optional(t.Boolean()),
    totalDebit: t.Optional(t.Number()),
    totalCredit: t.Optional(t.Number()),
    dim1: t.Optional(__nullable__(t.String())),
    dim2: t.Optional(__nullable__(t.String())),
    dim3: t.Optional(__nullable__(t.String())),
    dim4: t.Optional(__nullable__(t.String())),
    submittedAt: t.Optional(__nullable__(t.Date())),
    cancelledAt: t.Optional(__nullable__(t.Date())),
  },
  { additionalProperties: false },
);

export const JournalEntryRelationsInputCreate = t.Object(
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
    amendedFrom: t.Optional(
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
    amendments: t.Optional(
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
    rows: t.Optional(
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
    deferredSchedule: t.Optional(
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
    posClosingEntries: t.Optional(
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
    dunnings: t.Optional(
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
    insuranceClaimResolutions: t.Optional(
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

export const JournalEntryRelationsInputUpdate = t.Partial(
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
      amendedFrom: t.Partial(
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
      amendments: t.Partial(
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
      rows: t.Partial(
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
      deferredSchedule: t.Partial(
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
      posClosingEntries: t.Partial(
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
      dunnings: t.Partial(
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
      insuranceClaimResolutions: t.Partial(
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

export const JournalEntryWhere = t.Partial(
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
          docstatus: t.Union(
            [
              t.Literal("DRAFT"),
              t.Literal("SUBMITTED"),
              t.Literal("CANCELLED"),
            ],
            { additionalProperties: false },
          ),
          postingDate: t.Date(),
          amendedFromId: t.String(),
          voucherType: t.String(),
          chequeNo: t.String(),
          chequeDate: t.Date(),
          remark: t.String(),
          multiCurrency: t.Boolean(),
          isSystemGenerated: t.Boolean(),
          totalDebit: t.Number(),
          totalCredit: t.Number(),
          dim1: t.String(),
          dim2: t.String(),
          dim3: t.String(),
          dim4: t.String(),
          createdById: t.String(),
          submittedAt: t.Date(),
          submittedById: t.String(),
          cancelledAt: t.Date(),
          cancelledById: t.String(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "JournalEntry" },
  ),
);

export const JournalEntryWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            {
              id: t.String(),
              clinicId_documentNo: t.Object(
                { clinicId: t.String(), documentNo: t.String() },
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
              clinicId_documentNo: t.Object(
                { clinicId: t.String(), documentNo: t.String() },
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
              documentNo: t.String(),
              docstatus: t.Union(
                [
                  t.Literal("DRAFT"),
                  t.Literal("SUBMITTED"),
                  t.Literal("CANCELLED"),
                ],
                { additionalProperties: false },
              ),
              postingDate: t.Date(),
              amendedFromId: t.String(),
              voucherType: t.String(),
              chequeNo: t.String(),
              chequeDate: t.Date(),
              remark: t.String(),
              multiCurrency: t.Boolean(),
              isSystemGenerated: t.Boolean(),
              totalDebit: t.Number(),
              totalCredit: t.Number(),
              dim1: t.String(),
              dim2: t.String(),
              dim3: t.String(),
              dim4: t.String(),
              createdById: t.String(),
              submittedAt: t.Date(),
              submittedById: t.String(),
              cancelledAt: t.Date(),
              cancelledById: t.String(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "JournalEntry" },
);

export const JournalEntrySelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      clinicId: t.Boolean(),
      documentNo: t.Boolean(),
      docstatus: t.Boolean(),
      postingDate: t.Boolean(),
      amendedFromId: t.Boolean(),
      voucherType: t.Boolean(),
      chequeNo: t.Boolean(),
      chequeDate: t.Boolean(),
      remark: t.Boolean(),
      multiCurrency: t.Boolean(),
      isSystemGenerated: t.Boolean(),
      totalDebit: t.Boolean(),
      totalCredit: t.Boolean(),
      dim1: t.Boolean(),
      dim2: t.Boolean(),
      dim3: t.Boolean(),
      dim4: t.Boolean(),
      createdById: t.Boolean(),
      submittedAt: t.Boolean(),
      submittedById: t.Boolean(),
      cancelledAt: t.Boolean(),
      cancelledById: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinic: t.Boolean(),
      amendedFrom: t.Boolean(),
      amendments: t.Boolean(),
      rows: t.Boolean(),
      deferredSchedule: t.Boolean(),
      posClosingEntries: t.Boolean(),
      dunnings: t.Boolean(),
      insuranceClaimResolutions: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const JournalEntryInclude = t.Partial(
  t.Object(
    {
      docstatus: t.Boolean(),
      clinic: t.Boolean(),
      amendedFrom: t.Boolean(),
      amendments: t.Boolean(),
      rows: t.Boolean(),
      deferredSchedule: t.Boolean(),
      posClosingEntries: t.Boolean(),
      dunnings: t.Boolean(),
      insuranceClaimResolutions: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const JournalEntryOrderBy = t.Partial(
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
      postingDate: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      amendedFromId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      voucherType: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      chequeNo: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      chequeDate: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      remark: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      multiCurrency: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      isSystemGenerated: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      totalDebit: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      totalCredit: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      dim1: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      dim2: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      dim3: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      dim4: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdById: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      submittedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      submittedById: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      cancelledAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      cancelledById: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const JournalEntry = t.Composite(
  [JournalEntryPlain, JournalEntryRelations],
  { additionalProperties: false },
);

export const JournalEntryInputCreate = t.Composite(
  [JournalEntryPlainInputCreate, JournalEntryRelationsInputCreate],
  { additionalProperties: false },
);

export const JournalEntryInputUpdate = t.Composite(
  [JournalEntryPlainInputUpdate, JournalEntryRelationsInputUpdate],
  { additionalProperties: false },
);
