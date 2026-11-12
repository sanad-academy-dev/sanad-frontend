import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const RegistrationDocumentPlain = t.Object(
  {
    id: t.String(),
    requestId: t.String(),
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
    uploadedAt: t.Date(),
  },
  { additionalProperties: false },
);

export const RegistrationDocumentRelations = t.Object(
  {
    request: t.Object(
      {
        id: t.String(),
        code: t.String(),
        clinicId: t.String(),
        campaignId: t.String(),
        status: t.Union(
          [
            t.Literal("QUEUE"),
            t.Literal("SHORTLIST"),
            t.Literal("INTERVIEW"),
            t.Literal("ACCEPTED"),
            t.Literal("AWAITING_PAYMENT"),
            t.Literal("REJECTED"),
            t.Literal("DUPLICATE"),
            t.Literal("IN_EVALUATION"),
            t.Literal("WAITLIST"),
            t.Literal("EVALUATION"),
            t.Literal("REVIEW"),
            t.Literal("AWAITING_REPLY"),
          ],
          { additionalProperties: false },
        ),
        source: t.Union(
          [
            t.Literal("WEBSITE"),
            t.Literal("DIRECT_LINK"),
            t.Literal("REFERRAL"),
            t.Literal("SOCIAL"),
            t.Literal("OTHER"),
          ],
          { additionalProperties: false },
        ),
        studentName: t.String(),
        gender: t.Union(
          [t.Literal("MALE"), t.Literal("FEMALE"), t.Literal("UNKNOWN")],
          { additionalProperties: false },
        ),
        birthDate: __nullable__(t.Date()),
        ageLabel: __nullable__(t.String()),
        targetClass: __nullable__(t.String()),
        bloodType: __nullable__(t.String()),
        allergies: __nullable__(t.String()),
        hasChronicDiseases: t.Boolean(),
        chronicDiseases: __nullable__(t.String()),
        learningMode: __nullable__(t.String()),
        preferredShift: __nullable__(t.String()),
        experienceLevel: __nullable__(t.String()),
        priority: __nullable__(t.String()),
        appointmentDate: __nullable__(t.Date()),
        appointmentId: __nullable__(t.String()),
        roomId: __nullable__(t.String()),
        roomName: __nullable__(t.String()),
        notes: __nullable__(t.String()),
        notifyWhatsapp: t.Boolean(),
        links: __nullable__(t.Any()),
        proposedTrack: __nullable__(t.String()),
        interviewDurationMinutes: t.Integer(),
        attendanceProbability: t.Integer(),
        subscriptionPlanId: __nullable__(t.String()),
        subscriptionPlanName: __nullable__(t.String()),
        subscriptionAmount: __nullable__(t.Number()),
        includeMeals: t.Boolean(),
        enableDailyStipend: t.Boolean(),
        medications: __nullable__(t.Any()),
        allergiesList: __nullable__(t.Any()),
        referredToStaffId: __nullable__(t.String()),
        referralReason: __nullable__(t.String()),
        rejectionReason: __nullable__(t.String()),
        rejectionNotes: __nullable__(t.String()),
        deletionReason: __nullable__(t.String()),
        deletionNotes: __nullable__(t.String()),
        guardianName: t.String(),
        guardianPhone: t.String(),
        guardianEmail: __nullable__(t.String()),
        guardianNationalId: __nullable__(t.String()),
        convertedPatientId: __nullable__(t.String()),
        convertedOwnerId: __nullable__(t.String()),
        assignedStaffId: __nullable__(t.String()),
        submittedAt: t.Date(),
        updatedAt: t.Date(),
      },
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const RegistrationDocumentPlainInputCreate = t.Object(
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
    uploadedAt: t.Optional(t.Date()),
  },
  { additionalProperties: false },
);

export const RegistrationDocumentPlainInputUpdate = t.Object(
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
    uploadedAt: t.Optional(t.Date()),
  },
  { additionalProperties: false },
);

export const RegistrationDocumentRelationsInputCreate = t.Object(
  {
    request: t.Object(
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

export const RegistrationDocumentRelationsInputUpdate = t.Partial(
  t.Object(
    {
      request: t.Object(
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

export const RegistrationDocumentWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          requestId: t.String(),
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
          uploadedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "RegistrationDocument" },
  ),
);

export const RegistrationDocumentWhereUnique = t.Recursive(
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
              requestId: t.String(),
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
              uploadedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "RegistrationDocument" },
);

export const RegistrationDocumentSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      requestId: t.Boolean(),
      type: t.Boolean(),
      title: t.Boolean(),
      fileUrl: t.Boolean(),
      fileSize: t.Boolean(),
      mimeType: t.Boolean(),
      uploadedAt: t.Boolean(),
      request: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const RegistrationDocumentInclude = t.Partial(
  t.Object(
    { type: t.Boolean(), request: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const RegistrationDocumentOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      requestId: t.Union([t.Literal("asc"), t.Literal("desc")], {
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
      uploadedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const RegistrationDocument = t.Composite(
  [RegistrationDocumentPlain, RegistrationDocumentRelations],
  { additionalProperties: false },
);

export const RegistrationDocumentInputCreate = t.Composite(
  [
    RegistrationDocumentPlainInputCreate,
    RegistrationDocumentRelationsInputCreate,
  ],
  { additionalProperties: false },
);

export const RegistrationDocumentInputUpdate = t.Composite(
  [
    RegistrationDocumentPlainInputUpdate,
    RegistrationDocumentRelationsInputUpdate,
  ],
  { additionalProperties: false },
);
