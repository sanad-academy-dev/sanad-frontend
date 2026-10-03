import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const RadiologyAddendumMentionPlain = t.Object(
  {
    id: t.String(),
    addendumId: t.String(),
    staffId: t.String(),
    createdAt: t.Date(),
  },
  {
    additionalProperties: false,
    description: `إشارة إلى موظّف داخل ملحق — يُخطَر بها في صندوق الوارد`,
  },
);

export const RadiologyAddendumMentionRelations = t.Object(
  {
    addendum: t.Object(
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
  {
    additionalProperties: false,
    description: `إشارة إلى موظّف داخل ملحق — يُخطَر بها في صندوق الوارد`,
  },
);

export const RadiologyAddendumMentionPlainInputCreate = t.Object(
  {},
  {
    additionalProperties: false,
    description: `إشارة إلى موظّف داخل ملحق — يُخطَر بها في صندوق الوارد`,
  },
);

export const RadiologyAddendumMentionPlainInputUpdate = t.Object(
  {},
  {
    additionalProperties: false,
    description: `إشارة إلى موظّف داخل ملحق — يُخطَر بها في صندوق الوارد`,
  },
);

export const RadiologyAddendumMentionRelationsInputCreate = t.Object(
  {
    addendum: t.Object(
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
  {
    additionalProperties: false,
    description: `إشارة إلى موظّف داخل ملحق — يُخطَر بها في صندوق الوارد`,
  },
);

export const RadiologyAddendumMentionRelationsInputUpdate = t.Partial(
  t.Object(
    {
      addendum: t.Object(
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
    {
      additionalProperties: false,
      description: `إشارة إلى موظّف داخل ملحق — يُخطَر بها في صندوق الوارد`,
    },
  ),
);

export const RadiologyAddendumMentionWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          addendumId: t.String(),
          staffId: t.String(),
          createdAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `إشارة إلى موظّف داخل ملحق — يُخطَر بها في صندوق الوارد`,
        },
      ),
    { $id: "RadiologyAddendumMention" },
  ),
);

export const RadiologyAddendumMentionWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            {
              id: t.String(),
              addendumId_staffId: t.Object(
                { addendumId: t.String(), staffId: t.String() },
                { additionalProperties: false },
              ),
            },
            {
              additionalProperties: false,
              description: `إشارة إلى موظّف داخل ملحق — يُخطَر بها في صندوق الوارد`,
            },
          ),
          { additionalProperties: false },
        ),
        t.Union(
          [
            t.Object({ id: t.String() }),
            t.Object({
              addendumId_staffId: t.Object(
                { addendumId: t.String(), staffId: t.String() },
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
              addendumId: t.String(),
              staffId: t.String(),
              createdAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "RadiologyAddendumMention" },
);

export const RadiologyAddendumMentionSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      addendumId: t.Boolean(),
      staffId: t.Boolean(),
      createdAt: t.Boolean(),
      addendum: t.Boolean(),
      staff: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `إشارة إلى موظّف داخل ملحق — يُخطَر بها في صندوق الوارد`,
    },
  ),
);

export const RadiologyAddendumMentionInclude = t.Partial(
  t.Object(
    { addendum: t.Boolean(), staff: t.Boolean(), _count: t.Boolean() },
    {
      additionalProperties: false,
      description: `إشارة إلى موظّف داخل ملحق — يُخطَر بها في صندوق الوارد`,
    },
  ),
);

export const RadiologyAddendumMentionOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      addendumId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      staffId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    {
      additionalProperties: false,
      description: `إشارة إلى موظّف داخل ملحق — يُخطَر بها في صندوق الوارد`,
    },
  ),
);

export const RadiologyAddendumMention = t.Composite(
  [RadiologyAddendumMentionPlain, RadiologyAddendumMentionRelations],
  { additionalProperties: false },
);

export const RadiologyAddendumMentionInputCreate = t.Composite(
  [
    RadiologyAddendumMentionPlainInputCreate,
    RadiologyAddendumMentionRelationsInputCreate,
  ],
  { additionalProperties: false },
);

export const RadiologyAddendumMentionInputUpdate = t.Composite(
  [
    RadiologyAddendumMentionPlainInputUpdate,
    RadiologyAddendumMentionRelationsInputUpdate,
  ],
  { additionalProperties: false },
);
