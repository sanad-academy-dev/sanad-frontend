import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const StaffDocumentPlain = t.Object(
  {
    id: t.String(),
    staffId: t.String(),
    authorUserId: t.String(),
    category: t.Union(
      [t.Literal("DOCUMENT"), t.Literal("CERTIFICATE"), t.Literal("IMAGE")],
      { additionalProperties: false },
    ),
    title: t.String(),
    kind: t.Union([t.Literal("FILE"), t.Literal("LINK")], {
      additionalProperties: false,
    }),
    url: t.String(),
    mimeType: __nullable__(t.String()),
    sizeBytes: __nullable__(t.Integer()),
    createdAt: t.Date(),
  },
  { additionalProperties: false },
);

export const StaffDocumentRelations = t.Object(
  {
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
    author: t.Object(
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
  },
  { additionalProperties: false },
);

export const StaffDocumentPlainInputCreate = t.Object(
  {
    category: t.Union(
      [t.Literal("DOCUMENT"), t.Literal("CERTIFICATE"), t.Literal("IMAGE")],
      { additionalProperties: false },
    ),
    title: t.String(),
    kind: t.Union([t.Literal("FILE"), t.Literal("LINK")], {
      additionalProperties: false,
    }),
    url: t.String(),
    mimeType: t.Optional(__nullable__(t.String())),
    sizeBytes: t.Optional(__nullable__(t.Integer())),
  },
  { additionalProperties: false },
);

export const StaffDocumentPlainInputUpdate = t.Object(
  {
    category: t.Optional(
      t.Union(
        [t.Literal("DOCUMENT"), t.Literal("CERTIFICATE"), t.Literal("IMAGE")],
        { additionalProperties: false },
      ),
    ),
    title: t.Optional(t.String()),
    kind: t.Optional(
      t.Union([t.Literal("FILE"), t.Literal("LINK")], {
        additionalProperties: false,
      }),
    ),
    url: t.Optional(t.String()),
    mimeType: t.Optional(__nullable__(t.String())),
    sizeBytes: t.Optional(__nullable__(t.Integer())),
  },
  { additionalProperties: false },
);

export const StaffDocumentRelationsInputCreate = t.Object(
  {
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
    author: t.Object(
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

export const StaffDocumentRelationsInputUpdate = t.Partial(
  t.Object(
    {
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
      author: t.Object(
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

export const StaffDocumentWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          staffId: t.String(),
          authorUserId: t.String(),
          category: t.Union(
            [
              t.Literal("DOCUMENT"),
              t.Literal("CERTIFICATE"),
              t.Literal("IMAGE"),
            ],
            { additionalProperties: false },
          ),
          title: t.String(),
          kind: t.Union([t.Literal("FILE"), t.Literal("LINK")], {
            additionalProperties: false,
          }),
          url: t.String(),
          mimeType: t.String(),
          sizeBytes: t.Integer(),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "StaffDocument" },
  ),
);

export const StaffDocumentWhereUnique = t.Recursive(
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
              staffId: t.String(),
              authorUserId: t.String(),
              category: t.Union(
                [
                  t.Literal("DOCUMENT"),
                  t.Literal("CERTIFICATE"),
                  t.Literal("IMAGE"),
                ],
                { additionalProperties: false },
              ),
              title: t.String(),
              kind: t.Union([t.Literal("FILE"), t.Literal("LINK")], {
                additionalProperties: false,
              }),
              url: t.String(),
              mimeType: t.String(),
              sizeBytes: t.Integer(),
              createdAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "StaffDocument" },
);

export const StaffDocumentSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      staffId: t.Boolean(),
      authorUserId: t.Boolean(),
      category: t.Boolean(),
      title: t.Boolean(),
      kind: t.Boolean(),
      url: t.Boolean(),
      mimeType: t.Boolean(),
      sizeBytes: t.Boolean(),
      createdAt: t.Boolean(),
      staff: t.Boolean(),
      author: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const StaffDocumentInclude = t.Partial(
  t.Object(
    {
      category: t.Boolean(),
      kind: t.Boolean(),
      staff: t.Boolean(),
      author: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const StaffDocumentOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      staffId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      authorUserId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      title: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      url: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      mimeType: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      sizeBytes: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const StaffDocument = t.Composite(
  [StaffDocumentPlain, StaffDocumentRelations],
  { additionalProperties: false },
);

export const StaffDocumentInputCreate = t.Composite(
  [StaffDocumentPlainInputCreate, StaffDocumentRelationsInputCreate],
  { additionalProperties: false },
);

export const StaffDocumentInputUpdate = t.Composite(
  [StaffDocumentPlainInputUpdate, StaffDocumentRelationsInputUpdate],
  { additionalProperties: false },
);
