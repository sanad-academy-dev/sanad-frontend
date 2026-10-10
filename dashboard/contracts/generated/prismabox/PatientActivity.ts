import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const PatientActivityPlain = t.Object(
  {
    id: t.String(),
    patientId: t.String(),
    authorUserId: t.String(),
    type: t.Union(
      [t.Literal("OWNERSHIP_TRANSFERRED"), t.Literal("GROOMING_FINDING")],
      { additionalProperties: false },
    ),
    body: __nullable__(t.String()),
    metadata: __nullable__(t.Any()),
    createdAt: t.Date(),
  },
  { additionalProperties: false },
);

export const PatientActivityRelations = t.Object(
  {
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

export const PatientActivityPlainInputCreate = t.Object(
  {
    type: t.Union(
      [t.Literal("OWNERSHIP_TRANSFERRED"), t.Literal("GROOMING_FINDING")],
      { additionalProperties: false },
    ),
    body: t.Optional(__nullable__(t.String())),
    metadata: t.Optional(__nullable__(t.Any())),
  },
  { additionalProperties: false },
);

export const PatientActivityPlainInputUpdate = t.Object(
  {
    type: t.Optional(
      t.Union(
        [t.Literal("OWNERSHIP_TRANSFERRED"), t.Literal("GROOMING_FINDING")],
        { additionalProperties: false },
      ),
    ),
    body: t.Optional(__nullable__(t.String())),
    metadata: t.Optional(__nullable__(t.Any())),
  },
  { additionalProperties: false },
);

export const PatientActivityRelationsInputCreate = t.Object(
  {
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

export const PatientActivityRelationsInputUpdate = t.Partial(
  t.Object(
    {
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

export const PatientActivityWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          patientId: t.String(),
          authorUserId: t.String(),
          type: t.Union(
            [t.Literal("OWNERSHIP_TRANSFERRED"), t.Literal("GROOMING_FINDING")],
            { additionalProperties: false },
          ),
          body: t.String(),
          metadata: t.Any(),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "PatientActivity" },
  ),
);

export const PatientActivityWhereUnique = t.Recursive(
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
              patientId: t.String(),
              authorUserId: t.String(),
              type: t.Union(
                [
                  t.Literal("OWNERSHIP_TRANSFERRED"),
                  t.Literal("GROOMING_FINDING"),
                ],
                { additionalProperties: false },
              ),
              body: t.String(),
              metadata: t.Any(),
              createdAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "PatientActivity" },
);

export const PatientActivitySelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      patientId: t.Boolean(),
      authorUserId: t.Boolean(),
      type: t.Boolean(),
      body: t.Boolean(),
      metadata: t.Boolean(),
      createdAt: t.Boolean(),
      patient: t.Boolean(),
      author: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const PatientActivityInclude = t.Partial(
  t.Object(
    {
      type: t.Boolean(),
      patient: t.Boolean(),
      author: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const PatientActivityOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      patientId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      authorUserId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      body: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      metadata: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const PatientActivity = t.Composite(
  [PatientActivityPlain, PatientActivityRelations],
  { additionalProperties: false },
);

export const PatientActivityInputCreate = t.Composite(
  [PatientActivityPlainInputCreate, PatientActivityRelationsInputCreate],
  { additionalProperties: false },
);

export const PatientActivityInputUpdate = t.Composite(
  [PatientActivityPlainInputUpdate, PatientActivityRelationsInputUpdate],
  { additionalProperties: false },
);
