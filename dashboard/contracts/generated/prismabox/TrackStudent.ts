import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const TrackStudentPlain = t.Object(
  {
    id: t.String(),
    trackId: t.String(),
    patientId: t.String(),
    notes: __nullable__(t.String()),
    assignedAt: t.Date(),
  },
  { additionalProperties: false },
);

export const TrackStudentRelations = t.Object(
  {
    track: t.Object(
      {
        id: t.String(),
        code: t.String(),
        clinicId: t.String(),
        name: t.String(),
        category: __nullable__(t.String()),
        coursesCount: t.Integer(),
        locationMode: t.String(),
        locationLabel: __nullable__(t.String()),
        duration: __nullable__(t.String()),
        studentsCount: t.Integer(),
        rating: t.Number(),
        reviewsCount: t.Integer(),
        price: t.Integer(),
        revenue: t.Integer(),
        status: t.String(),
        description: __nullable__(t.String()),
        notes: __nullable__(t.String()),
        academicStage: __nullable__(t.String()),
        ageGroup: __nullable__(t.String()),
        trainers: t.Any(),
        selectedIcon: __nullable__(t.String()),
        selectedColor: __nullable__(t.String()),
        active: t.Boolean(),
        isDeleted: t.Boolean(),
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
        age: __nullable__(t.Number()),
        birthDate: __nullable__(t.Date()),
        weight: __nullable__(t.Number()),
        microchipNumber: __nullable__(t.String()),
        coat: __nullable__(t.String()),
        notes: __nullable__(t.String()),
        active: t.Boolean(),
        status: t.String(),
        nationalId: __nullable__(t.String()),
        ageGroup: __nullable__(t.String()),
        academicStage: __nullable__(t.String()),
        classroom: __nullable__(t.String()),
        bloodType: __nullable__(t.String()),
        developmentStatus: __nullable__(t.String()),
        allergies: __nullable__(t.String()),
        pocketMoneyEnabled: t.Boolean(),
        transportation: __nullable__(t.String()),
        feeType: __nullable__(t.String()),
        healthConditions: __nullable__(t.String()),
        previousNursery: __nullable__(t.String()),
        guardianRelationship: __nullable__(t.String()),
        emergencyContactPhone: __nullable__(t.String()),
        emergencyContactName: __nullable__(t.String()),
        level: __nullable__(t.String()),
        learningMethod: __nullable__(t.String()),
        preferredShift: __nullable__(t.String()),
        address: __nullable__(t.String()),
        isDeleted: t.Boolean(),
        deletedAt: __nullable__(t.Date()),
        editsCount: t.Integer(),
        createdAt: t.Date(),
        updatedAt: t.Date(),
      },
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const TrackStudentPlainInputCreate = t.Object(
  {
    notes: t.Optional(__nullable__(t.String())),
    assignedAt: t.Optional(t.Date()),
  },
  { additionalProperties: false },
);

export const TrackStudentPlainInputUpdate = t.Object(
  {
    notes: t.Optional(__nullable__(t.String())),
    assignedAt: t.Optional(t.Date()),
  },
  { additionalProperties: false },
);

export const TrackStudentRelationsInputCreate = t.Object(
  {
    track: t.Object(
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
  },
  { additionalProperties: false },
);

export const TrackStudentRelationsInputUpdate = t.Partial(
  t.Object(
    {
      track: t.Object(
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
    },
    { additionalProperties: false },
  ),
);

export const TrackStudentWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          trackId: t.String(),
          patientId: t.String(),
          notes: t.String(),
          assignedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "TrackStudent" },
  ),
);

export const TrackStudentWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            {
              id: t.String(),
              trackId_patientId: t.Object(
                { trackId: t.String(), patientId: t.String() },
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
              trackId_patientId: t.Object(
                { trackId: t.String(), patientId: t.String() },
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
              trackId: t.String(),
              patientId: t.String(),
              notes: t.String(),
              assignedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "TrackStudent" },
);

export const TrackStudentSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      trackId: t.Boolean(),
      patientId: t.Boolean(),
      notes: t.Boolean(),
      assignedAt: t.Boolean(),
      track: t.Boolean(),
      patient: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const TrackStudentInclude = t.Partial(
  t.Object(
    { track: t.Boolean(), patient: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const TrackStudentOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      trackId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      patientId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      notes: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      assignedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const TrackStudent = t.Composite(
  [TrackStudentPlain, TrackStudentRelations],
  { additionalProperties: false },
);

export const TrackStudentInputCreate = t.Composite(
  [TrackStudentPlainInputCreate, TrackStudentRelationsInputCreate],
  { additionalProperties: false },
);

export const TrackStudentInputUpdate = t.Composite(
  [TrackStudentPlainInputUpdate, TrackStudentRelationsInputUpdate],
  { additionalProperties: false },
);
