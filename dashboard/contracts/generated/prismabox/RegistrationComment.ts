import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const RegistrationCommentPlain = t.Object(
  {
    id: t.String(),
    requestId: t.String(),
    authorId: t.String(),
    content: t.String(),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  },
  { additionalProperties: false },
);

export const RegistrationCommentRelations = t.Object(
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

export const RegistrationCommentPlainInputCreate = t.Object(
  { content: t.String() },
  { additionalProperties: false },
);

export const RegistrationCommentPlainInputUpdate = t.Object(
  { content: t.Optional(t.String()) },
  { additionalProperties: false },
);

export const RegistrationCommentRelationsInputCreate = t.Object(
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

export const RegistrationCommentRelationsInputUpdate = t.Partial(
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

export const RegistrationCommentWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          requestId: t.String(),
          authorId: t.String(),
          content: t.String(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "RegistrationComment" },
  ),
);

export const RegistrationCommentWhereUnique = t.Recursive(
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
              authorId: t.String(),
              content: t.String(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "RegistrationComment" },
);

export const RegistrationCommentSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      requestId: t.Boolean(),
      authorId: t.Boolean(),
      content: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      request: t.Boolean(),
      author: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const RegistrationCommentInclude = t.Partial(
  t.Object(
    { request: t.Boolean(), author: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const RegistrationCommentOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      requestId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      authorId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      content: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const RegistrationComment = t.Composite(
  [RegistrationCommentPlain, RegistrationCommentRelations],
  { additionalProperties: false },
);

export const RegistrationCommentInputCreate = t.Composite(
  [
    RegistrationCommentPlainInputCreate,
    RegistrationCommentRelationsInputCreate,
  ],
  { additionalProperties: false },
);

export const RegistrationCommentInputUpdate = t.Composite(
  [
    RegistrationCommentPlainInputUpdate,
    RegistrationCommentRelationsInputUpdate,
  ],
  { additionalProperties: false },
);
