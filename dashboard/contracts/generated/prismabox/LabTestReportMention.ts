import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const LabTestReportMentionPlain = t.Object(
  {
    id: t.String(),
    itemId: t.String(),
    staffId: t.String(),
    createdAt: t.Date(),
  },
  { additionalProperties: false },
);

export const LabTestReportMentionRelations = t.Object(
  {
    item: t.Object(
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
    staff: t.Object(
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
  },
  { additionalProperties: false },
);

export const LabTestReportMentionPlainInputCreate = t.Object(
  {},
  { additionalProperties: false },
);

export const LabTestReportMentionPlainInputUpdate = t.Object(
  {},
  { additionalProperties: false },
);

export const LabTestReportMentionRelationsInputCreate = t.Object(
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
    staff: t.Object(
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
  },
  { additionalProperties: false },
);

export const LabTestReportMentionRelationsInputUpdate = t.Partial(
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
      staff: t.Object(
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
    },
    { additionalProperties: false },
  ),
);

export const LabTestReportMentionWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          itemId: t.String(),
          staffId: t.String(),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "LabTestReportMention" },
  ),
);

export const LabTestReportMentionWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            {
              id: t.String(),
              itemId_staffId: t.Object(
                { itemId: t.String(), staffId: t.String() },
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
              itemId_staffId: t.Object(
                { itemId: t.String(), staffId: t.String() },
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
              itemId: t.String(),
              staffId: t.String(),
              createdAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "LabTestReportMention" },
);

export const LabTestReportMentionSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      itemId: t.Boolean(),
      staffId: t.Boolean(),
      createdAt: t.Boolean(),
      item: t.Boolean(),
      staff: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const LabTestReportMentionInclude = t.Partial(
  t.Object(
    { item: t.Boolean(), staff: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const LabTestReportMentionOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      itemId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      staffId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const LabTestReportMention = t.Composite(
  [LabTestReportMentionPlain, LabTestReportMentionRelations],
  { additionalProperties: false },
);

export const LabTestReportMentionInputCreate = t.Composite(
  [
    LabTestReportMentionPlainInputCreate,
    LabTestReportMentionRelationsInputCreate,
  ],
  { additionalProperties: false },
);

export const LabTestReportMentionInputUpdate = t.Composite(
  [
    LabTestReportMentionPlainInputUpdate,
    LabTestReportMentionRelationsInputUpdate,
  ],
  { additionalProperties: false },
);
