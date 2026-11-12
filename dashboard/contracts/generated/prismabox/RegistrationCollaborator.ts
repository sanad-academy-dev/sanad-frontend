import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const RegistrationCollaboratorPlain = t.Object(
  {
    id: t.String(),
    campaignId: t.String(),
    clinicId: t.String(),
    userId: __nullable__(t.String()),
    email: __nullable__(t.String()),
    accessLevel: t.String(),
    isPending: t.Boolean(),
    invitedById: __nullable__(t.String()),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  },
  { additionalProperties: false },
);

export const RegistrationCollaboratorRelations = t.Object(
  {
    campaign: t.Object(
      {
        id: t.String(),
        code: t.String(),
        clinicId: t.String(),
        name: t.String(),
        ageGroup: t.String(),
        targetClass: __nullable__(t.String()),
        capacity: t.Integer(),
        status: t.Union(
          [
            t.Literal("DRAFT"),
            t.Literal("ACTIVE"),
            t.Literal("COMPLETED"),
            t.Literal("CLOSED"),
          ],
          { additionalProperties: false },
        ),
        startDate: __nullable__(t.Date()),
        endDate: __nullable__(t.Date()),
        requireBirthCert: t.Boolean(),
        requireVaccine: t.Boolean(),
        requireId: t.Boolean(),
        generalAccess: t.String(),
        notes: __nullable__(t.String()),
        createdById: __nullable__(t.String()),
        createdAt: t.Date(),
        updatedAt: t.Date(),
      },
      { additionalProperties: false },
    ),
    user: __nullable__(
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
  },
  { additionalProperties: false },
);

export const RegistrationCollaboratorPlainInputCreate = t.Object(
  {
    email: t.Optional(__nullable__(t.String())),
    accessLevel: t.Optional(t.String()),
    isPending: t.Optional(t.Boolean()),
  },
  { additionalProperties: false },
);

export const RegistrationCollaboratorPlainInputUpdate = t.Object(
  {
    email: t.Optional(__nullable__(t.String())),
    accessLevel: t.Optional(t.String()),
    isPending: t.Optional(t.Boolean()),
  },
  { additionalProperties: false },
);

export const RegistrationCollaboratorRelationsInputCreate = t.Object(
  {
    campaign: t.Object(
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
    user: t.Optional(
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

export const RegistrationCollaboratorRelationsInputUpdate = t.Partial(
  t.Object(
    {
      campaign: t.Object(
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
      user: t.Partial(
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

export const RegistrationCollaboratorWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          campaignId: t.String(),
          clinicId: t.String(),
          userId: t.String(),
          email: t.String(),
          accessLevel: t.String(),
          isPending: t.Boolean(),
          invitedById: t.String(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "RegistrationCollaborator" },
  ),
);

export const RegistrationCollaboratorWhereUnique = t.Recursive(
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
              campaignId: t.String(),
              clinicId: t.String(),
              userId: t.String(),
              email: t.String(),
              accessLevel: t.String(),
              isPending: t.Boolean(),
              invitedById: t.String(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "RegistrationCollaborator" },
);

export const RegistrationCollaboratorSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      campaignId: t.Boolean(),
      clinicId: t.Boolean(),
      userId: t.Boolean(),
      email: t.Boolean(),
      accessLevel: t.Boolean(),
      isPending: t.Boolean(),
      invitedById: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      campaign: t.Boolean(),
      user: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const RegistrationCollaboratorInclude = t.Partial(
  t.Object(
    { campaign: t.Boolean(), user: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const RegistrationCollaboratorOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      campaignId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clinicId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      userId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      email: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      accessLevel: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      isPending: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      invitedById: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const RegistrationCollaborator = t.Composite(
  [RegistrationCollaboratorPlain, RegistrationCollaboratorRelations],
  { additionalProperties: false },
);

export const RegistrationCollaboratorInputCreate = t.Composite(
  [
    RegistrationCollaboratorPlainInputCreate,
    RegistrationCollaboratorRelationsInputCreate,
  ],
  { additionalProperties: false },
);

export const RegistrationCollaboratorInputUpdate = t.Composite(
  [
    RegistrationCollaboratorPlainInputUpdate,
    RegistrationCollaboratorRelationsInputUpdate,
  ],
  { additionalProperties: false },
);
