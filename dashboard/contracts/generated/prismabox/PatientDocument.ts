import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const PatientDocumentPlain = t.Object(
  {
    id: t.String(),
    patientId: t.String(),
    type: t.Union(
      [
        t.Literal("BIRTH_CERTIFICATE"),
        t.Literal("VACCINATION_CARD"),
        t.Literal("GUARDIAN_ID"),
        t.Literal("MEDICAL_REPORT"),
        t.Literal("OTHER"),
      ],
      { additionalProperties: false },
    ),
    title: t.String(),
    fileUrl: t.String(),
    fileSize: __nullable__(t.String()),
    mimeType: __nullable__(t.String()),
    source: __nullable__(t.String()),
    uploadedAt: t.Date(),
  },
  { additionalProperties: false },
);

export const PatientDocumentRelations = t.Object(
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

export const PatientDocumentPlainInputCreate = t.Object(
  {
    type: t.Optional(
      t.Union(
        [
          t.Literal("BIRTH_CERTIFICATE"),
          t.Literal("VACCINATION_CARD"),
          t.Literal("GUARDIAN_ID"),
          t.Literal("MEDICAL_REPORT"),
          t.Literal("OTHER"),
        ],
        { additionalProperties: false },
      ),
    ),
    title: t.String(),
    fileUrl: t.String(),
    fileSize: t.Optional(__nullable__(t.String())),
    mimeType: t.Optional(__nullable__(t.String())),
    source: t.Optional(__nullable__(t.String())),
    uploadedAt: t.Optional(t.Date()),
  },
  { additionalProperties: false },
);

export const PatientDocumentPlainInputUpdate = t.Object(
  {
    type: t.Optional(
      t.Union(
        [
          t.Literal("BIRTH_CERTIFICATE"),
          t.Literal("VACCINATION_CARD"),
          t.Literal("GUARDIAN_ID"),
          t.Literal("MEDICAL_REPORT"),
          t.Literal("OTHER"),
        ],
        { additionalProperties: false },
      ),
    ),
    title: t.Optional(t.String()),
    fileUrl: t.Optional(t.String()),
    fileSize: t.Optional(__nullable__(t.String())),
    mimeType: t.Optional(__nullable__(t.String())),
    source: t.Optional(__nullable__(t.String())),
    uploadedAt: t.Optional(t.Date()),
  },
  { additionalProperties: false },
);

export const PatientDocumentRelationsInputCreate = t.Object(
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
  },
  { additionalProperties: false },
);

export const PatientDocumentRelationsInputUpdate = t.Partial(
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
    },
    { additionalProperties: false },
  ),
);

export const PatientDocumentWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          patientId: t.String(),
          type: t.Union(
            [
              t.Literal("BIRTH_CERTIFICATE"),
              t.Literal("VACCINATION_CARD"),
              t.Literal("GUARDIAN_ID"),
              t.Literal("MEDICAL_REPORT"),
              t.Literal("OTHER"),
            ],
            { additionalProperties: false },
          ),
          title: t.String(),
          fileUrl: t.String(),
          fileSize: t.String(),
          mimeType: t.String(),
          source: t.String(),
          uploadedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "PatientDocument" },
  ),
);

export const PatientDocumentWhereUnique = t.Recursive(
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
              type: t.Union(
                [
                  t.Literal("BIRTH_CERTIFICATE"),
                  t.Literal("VACCINATION_CARD"),
                  t.Literal("GUARDIAN_ID"),
                  t.Literal("MEDICAL_REPORT"),
                  t.Literal("OTHER"),
                ],
                { additionalProperties: false },
              ),
              title: t.String(),
              fileUrl: t.String(),
              fileSize: t.String(),
              mimeType: t.String(),
              source: t.String(),
              uploadedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "PatientDocument" },
);

export const PatientDocumentSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      patientId: t.Boolean(),
      type: t.Boolean(),
      title: t.Boolean(),
      fileUrl: t.Boolean(),
      fileSize: t.Boolean(),
      mimeType: t.Boolean(),
      source: t.Boolean(),
      uploadedAt: t.Boolean(),
      patient: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const PatientDocumentInclude = t.Partial(
  t.Object(
    { type: t.Boolean(), patient: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const PatientDocumentOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      patientId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      title: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      fileUrl: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      fileSize: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      mimeType: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      source: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      uploadedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const PatientDocument = t.Composite(
  [PatientDocumentPlain, PatientDocumentRelations],
  { additionalProperties: false },
);

export const PatientDocumentInputCreate = t.Composite(
  [PatientDocumentPlainInputCreate, PatientDocumentRelationsInputCreate],
  { additionalProperties: false },
);

export const PatientDocumentInputUpdate = t.Composite(
  [PatientDocumentPlainInputUpdate, PatientDocumentRelationsInputUpdate],
  { additionalProperties: false },
);
