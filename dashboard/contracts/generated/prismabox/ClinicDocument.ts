import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const ClinicDocumentPlain = t.Object(
  {
    id: t.String(),
    clinicId: t.String(),
    branchId: __nullable__(t.String()),
    authorUserId: t.String(),
    category: t.Union(
      [
        t.Literal("LICENSE"),
        t.Literal("REGISTRATION"),
        t.Literal("CONTRACT"),
        t.Literal("INSURANCE"),
        t.Literal("POLICY"),
        t.Literal("FINANCIAL"),
        t.Literal("OTHER"),
      ],
      { additionalProperties: false },
    ),
    title: t.String(),
    description: __nullable__(t.String()),
    kind: t.Union([t.Literal("FILE"), t.Literal("LINK")], {
      additionalProperties: false,
    }),
    url: t.String(),
    mimeType: __nullable__(t.String()),
    sizeBytes: __nullable__(t.Integer()),
    issuedAt: __nullable__(t.Date()),
    expiresAt: __nullable__(t.Date()),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  },
  { additionalProperties: false },
);

export const ClinicDocumentRelations = t.Object(
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
    branch: __nullable__(
      t.Object(
        {
          id: t.String(),
          branchCode: t.String(),
          clinicId: t.String(),
          name: t.String(),
          icon: __nullable__(t.String()),
          type: t.Union([t.Literal("PRIMARY"), t.Literal("SUB")], {
            additionalProperties: false,
          }),
          managerId: __nullable__(t.String()),
          email: __nullable__(t.String()),
          city: __nullable__(t.String()),
          phone: __nullable__(t.String()),
          address: __nullable__(t.String()),
          active: t.Boolean(),
          emergencyNotifications: t.Boolean(),
          settings: __nullable__(t.Any()),
          isDeleted: t.Boolean(),
          deletedAt: __nullable__(t.Date()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
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

export const ClinicDocumentPlainInputCreate = t.Object(
  {
    category: t.Union(
      [
        t.Literal("LICENSE"),
        t.Literal("REGISTRATION"),
        t.Literal("CONTRACT"),
        t.Literal("INSURANCE"),
        t.Literal("POLICY"),
        t.Literal("FINANCIAL"),
        t.Literal("OTHER"),
      ],
      { additionalProperties: false },
    ),
    title: t.String(),
    description: t.Optional(__nullable__(t.String())),
    kind: t.Union([t.Literal("FILE"), t.Literal("LINK")], {
      additionalProperties: false,
    }),
    url: t.String(),
    mimeType: t.Optional(__nullable__(t.String())),
    sizeBytes: t.Optional(__nullable__(t.Integer())),
    issuedAt: t.Optional(__nullable__(t.Date())),
    expiresAt: t.Optional(__nullable__(t.Date())),
  },
  { additionalProperties: false },
);

export const ClinicDocumentPlainInputUpdate = t.Object(
  {
    category: t.Optional(
      t.Union(
        [
          t.Literal("LICENSE"),
          t.Literal("REGISTRATION"),
          t.Literal("CONTRACT"),
          t.Literal("INSURANCE"),
          t.Literal("POLICY"),
          t.Literal("FINANCIAL"),
          t.Literal("OTHER"),
        ],
        { additionalProperties: false },
      ),
    ),
    title: t.Optional(t.String()),
    description: t.Optional(__nullable__(t.String())),
    kind: t.Optional(
      t.Union([t.Literal("FILE"), t.Literal("LINK")], {
        additionalProperties: false,
      }),
    ),
    url: t.Optional(t.String()),
    mimeType: t.Optional(__nullable__(t.String())),
    sizeBytes: t.Optional(__nullable__(t.Integer())),
    issuedAt: t.Optional(__nullable__(t.Date())),
    expiresAt: t.Optional(__nullable__(t.Date())),
  },
  { additionalProperties: false },
);

export const ClinicDocumentRelationsInputCreate = t.Object(
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
    branch: t.Optional(
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

export const ClinicDocumentRelationsInputUpdate = t.Partial(
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
      branch: t.Partial(
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

export const ClinicDocumentWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          clinicId: t.String(),
          branchId: t.String(),
          authorUserId: t.String(),
          category: t.Union(
            [
              t.Literal("LICENSE"),
              t.Literal("REGISTRATION"),
              t.Literal("CONTRACT"),
              t.Literal("INSURANCE"),
              t.Literal("POLICY"),
              t.Literal("FINANCIAL"),
              t.Literal("OTHER"),
            ],
            { additionalProperties: false },
          ),
          title: t.String(),
          description: t.String(),
          kind: t.Union([t.Literal("FILE"), t.Literal("LINK")], {
            additionalProperties: false,
          }),
          url: t.String(),
          mimeType: t.String(),
          sizeBytes: t.Integer(),
          issuedAt: t.Date(),
          expiresAt: t.Date(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "ClinicDocument" },
  ),
);

export const ClinicDocumentWhereUnique = t.Recursive(
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
              branchId: t.String(),
              authorUserId: t.String(),
              category: t.Union(
                [
                  t.Literal("LICENSE"),
                  t.Literal("REGISTRATION"),
                  t.Literal("CONTRACT"),
                  t.Literal("INSURANCE"),
                  t.Literal("POLICY"),
                  t.Literal("FINANCIAL"),
                  t.Literal("OTHER"),
                ],
                { additionalProperties: false },
              ),
              title: t.String(),
              description: t.String(),
              kind: t.Union([t.Literal("FILE"), t.Literal("LINK")], {
                additionalProperties: false,
              }),
              url: t.String(),
              mimeType: t.String(),
              sizeBytes: t.Integer(),
              issuedAt: t.Date(),
              expiresAt: t.Date(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "ClinicDocument" },
);

export const ClinicDocumentSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      clinicId: t.Boolean(),
      branchId: t.Boolean(),
      authorUserId: t.Boolean(),
      category: t.Boolean(),
      title: t.Boolean(),
      description: t.Boolean(),
      kind: t.Boolean(),
      url: t.Boolean(),
      mimeType: t.Boolean(),
      sizeBytes: t.Boolean(),
      issuedAt: t.Boolean(),
      expiresAt: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinic: t.Boolean(),
      branch: t.Boolean(),
      author: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const ClinicDocumentInclude = t.Partial(
  t.Object(
    {
      category: t.Boolean(),
      kind: t.Boolean(),
      clinic: t.Boolean(),
      branch: t.Boolean(),
      author: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const ClinicDocumentOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clinicId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      branchId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      authorUserId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      title: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      description: t.Union([t.Literal("asc"), t.Literal("desc")], {
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
      issuedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      expiresAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const ClinicDocument = t.Composite(
  [ClinicDocumentPlain, ClinicDocumentRelations],
  { additionalProperties: false },
);

export const ClinicDocumentInputCreate = t.Composite(
  [ClinicDocumentPlainInputCreate, ClinicDocumentRelationsInputCreate],
  { additionalProperties: false },
);

export const ClinicDocumentInputUpdate = t.Composite(
  [ClinicDocumentPlainInputUpdate, ClinicDocumentRelationsInputUpdate],
  { additionalProperties: false },
);
