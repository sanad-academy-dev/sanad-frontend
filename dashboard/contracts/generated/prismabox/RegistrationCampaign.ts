import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const RegistrationCampaignPlain = t.Object(
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
);

export const RegistrationCampaignRelations = t.Object(
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
    createdBy: __nullable__(
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
    requests: t.Array(
      t.Object(
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
      { additionalProperties: false },
    ),
    collaborators: t.Array(
      t.Object(
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
      ),
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const RegistrationCampaignPlainInputCreate = t.Object(
  {
    code: t.String(),
    name: t.String(),
    ageGroup: t.String(),
    targetClass: t.Optional(__nullable__(t.String())),
    capacity: t.Optional(t.Integer()),
    status: t.Optional(
      t.Union(
        [
          t.Literal("DRAFT"),
          t.Literal("ACTIVE"),
          t.Literal("COMPLETED"),
          t.Literal("CLOSED"),
        ],
        { additionalProperties: false },
      ),
    ),
    startDate: t.Optional(__nullable__(t.Date())),
    endDate: t.Optional(__nullable__(t.Date())),
    requireBirthCert: t.Optional(t.Boolean()),
    requireVaccine: t.Optional(t.Boolean()),
    generalAccess: t.Optional(t.String()),
    notes: t.Optional(__nullable__(t.String())),
  },
  { additionalProperties: false },
);

export const RegistrationCampaignPlainInputUpdate = t.Object(
  {
    code: t.Optional(t.String()),
    name: t.Optional(t.String()),
    ageGroup: t.Optional(t.String()),
    targetClass: t.Optional(__nullable__(t.String())),
    capacity: t.Optional(t.Integer()),
    status: t.Optional(
      t.Union(
        [
          t.Literal("DRAFT"),
          t.Literal("ACTIVE"),
          t.Literal("COMPLETED"),
          t.Literal("CLOSED"),
        ],
        { additionalProperties: false },
      ),
    ),
    startDate: t.Optional(__nullable__(t.Date())),
    endDate: t.Optional(__nullable__(t.Date())),
    requireBirthCert: t.Optional(t.Boolean()),
    requireVaccine: t.Optional(t.Boolean()),
    generalAccess: t.Optional(t.String()),
    notes: t.Optional(__nullable__(t.String())),
  },
  { additionalProperties: false },
);

export const RegistrationCampaignRelationsInputCreate = t.Object(
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
    createdBy: t.Optional(
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
    requests: t.Optional(
      t.Object(
        {
          connect: t.Array(
            t.Object(
              {
                id: t.String({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
    ),
    collaborators: t.Optional(
      t.Object(
        {
          connect: t.Array(
            t.Object(
              {
                id: t.String({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
    ),
  },
  { additionalProperties: false },
);

export const RegistrationCampaignRelationsInputUpdate = t.Partial(
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
      createdBy: t.Partial(
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
      requests: t.Partial(
        t.Object(
          {
            connect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
            disconnect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
          },
          { additionalProperties: false },
        ),
      ),
      collaborators: t.Partial(
        t.Object(
          {
            connect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
            disconnect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
          },
          { additionalProperties: false },
        ),
      ),
    },
    { additionalProperties: false },
  ),
);

export const RegistrationCampaignWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          code: t.String(),
          clinicId: t.String(),
          name: t.String(),
          ageGroup: t.String(),
          targetClass: t.String(),
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
          startDate: t.Date(),
          endDate: t.Date(),
          requireBirthCert: t.Boolean(),
          requireVaccine: t.Boolean(),
          requireId: t.Boolean(),
          generalAccess: t.String(),
          notes: t.String(),
          createdById: t.String(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "RegistrationCampaign" },
  ),
);

export const RegistrationCampaignWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.String(), code: t.String() },
            { additionalProperties: false },
          ),
          { additionalProperties: false },
        ),
        t.Union(
          [t.Object({ id: t.String() }), t.Object({ code: t.String() })],
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
              code: t.String(),
              clinicId: t.String(),
              name: t.String(),
              ageGroup: t.String(),
              targetClass: t.String(),
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
              startDate: t.Date(),
              endDate: t.Date(),
              requireBirthCert: t.Boolean(),
              requireVaccine: t.Boolean(),
              requireId: t.Boolean(),
              generalAccess: t.String(),
              notes: t.String(),
              createdById: t.String(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "RegistrationCampaign" },
);

export const RegistrationCampaignSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      code: t.Boolean(),
      clinicId: t.Boolean(),
      name: t.Boolean(),
      ageGroup: t.Boolean(),
      targetClass: t.Boolean(),
      capacity: t.Boolean(),
      status: t.Boolean(),
      startDate: t.Boolean(),
      endDate: t.Boolean(),
      requireBirthCert: t.Boolean(),
      requireVaccine: t.Boolean(),
      requireId: t.Boolean(),
      generalAccess: t.Boolean(),
      notes: t.Boolean(),
      createdById: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinic: t.Boolean(),
      createdBy: t.Boolean(),
      requests: t.Boolean(),
      collaborators: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const RegistrationCampaignInclude = t.Partial(
  t.Object(
    {
      status: t.Boolean(),
      clinic: t.Boolean(),
      createdBy: t.Boolean(),
      requests: t.Boolean(),
      collaborators: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const RegistrationCampaignOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      code: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clinicId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      name: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      ageGroup: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      targetClass: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      capacity: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      startDate: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      endDate: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      requireBirthCert: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      requireVaccine: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      requireId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      generalAccess: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      notes: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdById: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const RegistrationCampaign = t.Composite(
  [RegistrationCampaignPlain, RegistrationCampaignRelations],
  { additionalProperties: false },
);

export const RegistrationCampaignInputCreate = t.Composite(
  [
    RegistrationCampaignPlainInputCreate,
    RegistrationCampaignRelationsInputCreate,
  ],
  { additionalProperties: false },
);

export const RegistrationCampaignInputUpdate = t.Composite(
  [
    RegistrationCampaignPlainInputUpdate,
    RegistrationCampaignRelationsInputUpdate,
  ],
  { additionalProperties: false },
);
