import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const ClassroomStudentPlain = t.Object(
  {
    id: t.String(),
    classroomId: t.String(),
    patientId: t.String(),
    enrolledAt: t.Date(),
  },
  { additionalProperties: false },
);

export const ClassroomStudentRelations = t.Object(
  {
    classroom: t.Object(
      {
        id: t.String(),
        code: t.String(),
        clinicId: t.String(),
        name: t.String(),
        ageGroup: __nullable__(t.String()),
        academicStage: __nullable__(t.String()),
        category: __nullable__(t.String()),
        classification: __nullable__(t.String()),
        learningMode: t.String(),
        capacity: t.Integer(),
        enrolledCount: t.Integer(),
        active: t.Boolean(),
        notes: __nullable__(t.String()),
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

export const ClassroomStudentPlainInputCreate = t.Object(
  { enrolledAt: t.Optional(t.Date()) },
  { additionalProperties: false },
);

export const ClassroomStudentPlainInputUpdate = t.Object(
  { enrolledAt: t.Optional(t.Date()) },
  { additionalProperties: false },
);

export const ClassroomStudentRelationsInputCreate = t.Object(
  {
    classroom: t.Object(
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

export const ClassroomStudentRelationsInputUpdate = t.Partial(
  t.Object(
    {
      classroom: t.Object(
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

export const ClassroomStudentWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          classroomId: t.String(),
          patientId: t.String(),
          enrolledAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "ClassroomStudent" },
  ),
);

export const ClassroomStudentWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            {
              id: t.String(),
              classroomId_patientId: t.Object(
                { classroomId: t.String(), patientId: t.String() },
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
              classroomId_patientId: t.Object(
                { classroomId: t.String(), patientId: t.String() },
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
              classroomId: t.String(),
              patientId: t.String(),
              enrolledAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "ClassroomStudent" },
);

export const ClassroomStudentSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      classroomId: t.Boolean(),
      patientId: t.Boolean(),
      enrolledAt: t.Boolean(),
      classroom: t.Boolean(),
      patient: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const ClassroomStudentInclude = t.Partial(
  t.Object(
    { classroom: t.Boolean(), patient: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const ClassroomStudentOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      classroomId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      patientId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      enrolledAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const ClassroomStudent = t.Composite(
  [ClassroomStudentPlain, ClassroomStudentRelations],
  { additionalProperties: false },
);

export const ClassroomStudentInputCreate = t.Composite(
  [ClassroomStudentPlainInputCreate, ClassroomStudentRelationsInputCreate],
  { additionalProperties: false },
);

export const ClassroomStudentInputUpdate = t.Composite(
  [ClassroomStudentPlainInputUpdate, ClassroomStudentRelationsInputUpdate],
  { additionalProperties: false },
);
