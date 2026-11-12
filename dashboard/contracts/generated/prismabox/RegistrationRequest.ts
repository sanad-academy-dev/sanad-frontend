import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const RegistrationRequestPlain = t.Object(
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
);

export const RegistrationRequestRelations = t.Object(
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
    convertedPatient: __nullable__(
      t.Object(
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
    ),
    convertedOwner: __nullable__(
      t.Object(
        {
          id: t.String(),
          code: t.String(),
          clinicId: t.String(),
          name: t.String(),
          phone: t.String(),
          phoneE164: __nullable__(t.String()),
          email: __nullable__(t.String()),
          gender: __nullable__(
            t.Union(
              [t.Literal("MALE"), t.Literal("FEMALE"), t.Literal("UNKNOWN")],
              { additionalProperties: false },
            ),
          ),
          ownerType: t.Union(
            [
              t.Literal("ALL"),
              t.Literal("VIP"),
              t.Literal("LOYALTY"),
              t.Literal("NEW"),
              t.Literal("CURRENT"),
            ],
            { additionalProperties: false },
          ),
          relationship: __nullable__(
            t.Union(
              [
                t.Literal("OWNER"),
                t.Literal("GUARDIAN"),
                t.Literal("DELEGATE"),
                t.Literal("EMERGENCY"),
              ],
              { additionalProperties: false },
            ),
          ),
          country: __nullable__(t.String()),
          city: __nullable__(t.String()),
          address: __nullable__(t.String()),
          emergencyContactName: __nullable__(t.String()),
          emergencyContactPhone: __nullable__(t.String()),
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
    ),
    assignedStaff: __nullable__(
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
    referredToStaff: __nullable__(
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
    documents: t.Array(
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
          fileSize: __nullable__(t.String()),
          mimeType: __nullable__(t.String()),
          uploadedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    comments: t.Array(
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
      { additionalProperties: false },
    ),
    timelineSteps: t.Array(
      t.Object(
        {
          id: t.String(),
          requestId: t.String(),
          title: t.String(),
          actorName: t.String(),
          statusBadge: __nullable__(t.String()),
          isCompleted: t.Boolean(),
          completedAt: __nullable__(t.Date()),
          order: t.Integer(),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const RegistrationRequestPlainInputCreate = t.Object(
  {
    code: t.String(),
    status: t.Optional(
      t.Union(
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
    ),
    source: t.Optional(
      t.Union(
        [
          t.Literal("WEBSITE"),
          t.Literal("DIRECT_LINK"),
          t.Literal("REFERRAL"),
          t.Literal("SOCIAL"),
          t.Literal("OTHER"),
        ],
        { additionalProperties: false },
      ),
    ),
    studentName: t.String(),
    gender: t.Union(
      [t.Literal("MALE"), t.Literal("FEMALE"), t.Literal("UNKNOWN")],
      { additionalProperties: false },
    ),
    birthDate: t.Optional(__nullable__(t.Date())),
    ageLabel: t.Optional(__nullable__(t.String())),
    targetClass: t.Optional(__nullable__(t.String())),
    bloodType: t.Optional(__nullable__(t.String())),
    allergies: t.Optional(__nullable__(t.String())),
    hasChronicDiseases: t.Optional(t.Boolean()),
    chronicDiseases: t.Optional(__nullable__(t.String())),
    learningMode: t.Optional(__nullable__(t.String())),
    preferredShift: t.Optional(__nullable__(t.String())),
    experienceLevel: t.Optional(__nullable__(t.String())),
    priority: t.Optional(__nullable__(t.String())),
    appointmentDate: t.Optional(__nullable__(t.Date())),
    roomName: t.Optional(__nullable__(t.String())),
    notes: t.Optional(__nullable__(t.String())),
    notifyWhatsapp: t.Optional(t.Boolean()),
    links: t.Optional(__nullable__(t.Any())),
    proposedTrack: t.Optional(__nullable__(t.String())),
    interviewDurationMinutes: t.Optional(t.Integer()),
    attendanceProbability: t.Optional(t.Integer()),
    subscriptionPlanName: t.Optional(__nullable__(t.String())),
    subscriptionAmount: t.Optional(__nullable__(t.Number())),
    includeMeals: t.Optional(t.Boolean()),
    enableDailyStipend: t.Optional(t.Boolean()),
    medications: t.Optional(__nullable__(t.Any())),
    allergiesList: t.Optional(__nullable__(t.Any())),
    referralReason: t.Optional(__nullable__(t.String())),
    rejectionReason: t.Optional(__nullable__(t.String())),
    rejectionNotes: t.Optional(__nullable__(t.String())),
    deletionReason: t.Optional(__nullable__(t.String())),
    deletionNotes: t.Optional(__nullable__(t.String())),
    guardianName: t.String(),
    guardianPhone: t.String(),
    guardianEmail: t.Optional(__nullable__(t.String())),
    submittedAt: t.Optional(t.Date()),
  },
  { additionalProperties: false },
);

export const RegistrationRequestPlainInputUpdate = t.Object(
  {
    code: t.Optional(t.String()),
    status: t.Optional(
      t.Union(
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
    ),
    source: t.Optional(
      t.Union(
        [
          t.Literal("WEBSITE"),
          t.Literal("DIRECT_LINK"),
          t.Literal("REFERRAL"),
          t.Literal("SOCIAL"),
          t.Literal("OTHER"),
        ],
        { additionalProperties: false },
      ),
    ),
    studentName: t.Optional(t.String()),
    gender: t.Optional(
      t.Union([t.Literal("MALE"), t.Literal("FEMALE"), t.Literal("UNKNOWN")], {
        additionalProperties: false,
      }),
    ),
    birthDate: t.Optional(__nullable__(t.Date())),
    ageLabel: t.Optional(__nullable__(t.String())),
    targetClass: t.Optional(__nullable__(t.String())),
    bloodType: t.Optional(__nullable__(t.String())),
    allergies: t.Optional(__nullable__(t.String())),
    hasChronicDiseases: t.Optional(t.Boolean()),
    chronicDiseases: t.Optional(__nullable__(t.String())),
    learningMode: t.Optional(__nullable__(t.String())),
    preferredShift: t.Optional(__nullable__(t.String())),
    experienceLevel: t.Optional(__nullable__(t.String())),
    priority: t.Optional(__nullable__(t.String())),
    appointmentDate: t.Optional(__nullable__(t.Date())),
    roomName: t.Optional(__nullable__(t.String())),
    notes: t.Optional(__nullable__(t.String())),
    notifyWhatsapp: t.Optional(t.Boolean()),
    links: t.Optional(__nullable__(t.Any())),
    proposedTrack: t.Optional(__nullable__(t.String())),
    interviewDurationMinutes: t.Optional(t.Integer()),
    attendanceProbability: t.Optional(t.Integer()),
    subscriptionPlanName: t.Optional(__nullable__(t.String())),
    subscriptionAmount: t.Optional(__nullable__(t.Number())),
    includeMeals: t.Optional(t.Boolean()),
    enableDailyStipend: t.Optional(t.Boolean()),
    medications: t.Optional(__nullable__(t.Any())),
    allergiesList: t.Optional(__nullable__(t.Any())),
    referralReason: t.Optional(__nullable__(t.String())),
    rejectionReason: t.Optional(__nullable__(t.String())),
    rejectionNotes: t.Optional(__nullable__(t.String())),
    deletionReason: t.Optional(__nullable__(t.String())),
    deletionNotes: t.Optional(__nullable__(t.String())),
    guardianName: t.Optional(t.String()),
    guardianPhone: t.Optional(t.String()),
    guardianEmail: t.Optional(__nullable__(t.String())),
    submittedAt: t.Optional(t.Date()),
  },
  { additionalProperties: false },
);

export const RegistrationRequestRelationsInputCreate = t.Object(
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
    convertedPatient: t.Optional(
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
    convertedOwner: t.Optional(
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
    assignedStaff: t.Optional(
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
    referredToStaff: t.Optional(
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
    documents: t.Optional(
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
    comments: t.Optional(
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
    timelineSteps: t.Optional(
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

export const RegistrationRequestRelationsInputUpdate = t.Partial(
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
      convertedPatient: t.Partial(
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
      convertedOwner: t.Partial(
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
      assignedStaff: t.Partial(
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
      referredToStaff: t.Partial(
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
      documents: t.Partial(
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
      comments: t.Partial(
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
      timelineSteps: t.Partial(
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

export const RegistrationRequestWhere = t.Partial(
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
          birthDate: t.Date(),
          ageLabel: t.String(),
          targetClass: t.String(),
          bloodType: t.String(),
          allergies: t.String(),
          hasChronicDiseases: t.Boolean(),
          chronicDiseases: t.String(),
          learningMode: t.String(),
          preferredShift: t.String(),
          experienceLevel: t.String(),
          priority: t.String(),
          appointmentDate: t.Date(),
          appointmentId: t.String(),
          roomId: t.String(),
          roomName: t.String(),
          notes: t.String(),
          notifyWhatsapp: t.Boolean(),
          links: t.Any(),
          proposedTrack: t.String(),
          interviewDurationMinutes: t.Integer(),
          attendanceProbability: t.Integer(),
          subscriptionPlanId: t.String(),
          subscriptionPlanName: t.String(),
          subscriptionAmount: t.Number(),
          includeMeals: t.Boolean(),
          enableDailyStipend: t.Boolean(),
          medications: t.Any(),
          allergiesList: t.Any(),
          referredToStaffId: t.String(),
          referralReason: t.String(),
          rejectionReason: t.String(),
          rejectionNotes: t.String(),
          deletionReason: t.String(),
          deletionNotes: t.String(),
          guardianName: t.String(),
          guardianPhone: t.String(),
          guardianEmail: t.String(),
          guardianNationalId: t.String(),
          convertedPatientId: t.String(),
          convertedOwnerId: t.String(),
          assignedStaffId: t.String(),
          submittedAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "RegistrationRequest" },
  ),
);

export const RegistrationRequestWhereUnique = t.Recursive(
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
              birthDate: t.Date(),
              ageLabel: t.String(),
              targetClass: t.String(),
              bloodType: t.String(),
              allergies: t.String(),
              hasChronicDiseases: t.Boolean(),
              chronicDiseases: t.String(),
              learningMode: t.String(),
              preferredShift: t.String(),
              experienceLevel: t.String(),
              priority: t.String(),
              appointmentDate: t.Date(),
              appointmentId: t.String(),
              roomId: t.String(),
              roomName: t.String(),
              notes: t.String(),
              notifyWhatsapp: t.Boolean(),
              links: t.Any(),
              proposedTrack: t.String(),
              interviewDurationMinutes: t.Integer(),
              attendanceProbability: t.Integer(),
              subscriptionPlanId: t.String(),
              subscriptionPlanName: t.String(),
              subscriptionAmount: t.Number(),
              includeMeals: t.Boolean(),
              enableDailyStipend: t.Boolean(),
              medications: t.Any(),
              allergiesList: t.Any(),
              referredToStaffId: t.String(),
              referralReason: t.String(),
              rejectionReason: t.String(),
              rejectionNotes: t.String(),
              deletionReason: t.String(),
              deletionNotes: t.String(),
              guardianName: t.String(),
              guardianPhone: t.String(),
              guardianEmail: t.String(),
              guardianNationalId: t.String(),
              convertedPatientId: t.String(),
              convertedOwnerId: t.String(),
              assignedStaffId: t.String(),
              submittedAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "RegistrationRequest" },
);

export const RegistrationRequestSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      code: t.Boolean(),
      clinicId: t.Boolean(),
      campaignId: t.Boolean(),
      status: t.Boolean(),
      source: t.Boolean(),
      studentName: t.Boolean(),
      gender: t.Boolean(),
      birthDate: t.Boolean(),
      ageLabel: t.Boolean(),
      targetClass: t.Boolean(),
      bloodType: t.Boolean(),
      allergies: t.Boolean(),
      hasChronicDiseases: t.Boolean(),
      chronicDiseases: t.Boolean(),
      learningMode: t.Boolean(),
      preferredShift: t.Boolean(),
      experienceLevel: t.Boolean(),
      priority: t.Boolean(),
      appointmentDate: t.Boolean(),
      appointmentId: t.Boolean(),
      roomId: t.Boolean(),
      roomName: t.Boolean(),
      notes: t.Boolean(),
      notifyWhatsapp: t.Boolean(),
      links: t.Boolean(),
      proposedTrack: t.Boolean(),
      interviewDurationMinutes: t.Boolean(),
      attendanceProbability: t.Boolean(),
      subscriptionPlanId: t.Boolean(),
      subscriptionPlanName: t.Boolean(),
      subscriptionAmount: t.Boolean(),
      includeMeals: t.Boolean(),
      enableDailyStipend: t.Boolean(),
      medications: t.Boolean(),
      allergiesList: t.Boolean(),
      referredToStaffId: t.Boolean(),
      referralReason: t.Boolean(),
      rejectionReason: t.Boolean(),
      rejectionNotes: t.Boolean(),
      deletionReason: t.Boolean(),
      deletionNotes: t.Boolean(),
      guardianName: t.Boolean(),
      guardianPhone: t.Boolean(),
      guardianEmail: t.Boolean(),
      guardianNationalId: t.Boolean(),
      convertedPatientId: t.Boolean(),
      convertedOwnerId: t.Boolean(),
      assignedStaffId: t.Boolean(),
      submittedAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinic: t.Boolean(),
      campaign: t.Boolean(),
      convertedPatient: t.Boolean(),
      convertedOwner: t.Boolean(),
      assignedStaff: t.Boolean(),
      referredToStaff: t.Boolean(),
      documents: t.Boolean(),
      comments: t.Boolean(),
      timelineSteps: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const RegistrationRequestInclude = t.Partial(
  t.Object(
    {
      status: t.Boolean(),
      source: t.Boolean(),
      gender: t.Boolean(),
      clinic: t.Boolean(),
      campaign: t.Boolean(),
      convertedPatient: t.Boolean(),
      convertedOwner: t.Boolean(),
      assignedStaff: t.Boolean(),
      referredToStaff: t.Boolean(),
      documents: t.Boolean(),
      comments: t.Boolean(),
      timelineSteps: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const RegistrationRequestOrderBy = t.Partial(
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
      campaignId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      studentName: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      birthDate: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      ageLabel: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      targetClass: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      bloodType: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      allergies: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      hasChronicDiseases: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      chronicDiseases: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      learningMode: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      preferredShift: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      experienceLevel: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      priority: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      appointmentDate: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      appointmentId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      roomId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      roomName: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      notes: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      notifyWhatsapp: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      links: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      proposedTrack: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      interviewDurationMinutes: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      attendanceProbability: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      subscriptionPlanId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      subscriptionPlanName: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      subscriptionAmount: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      includeMeals: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      enableDailyStipend: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      medications: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      allergiesList: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      referredToStaffId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      referralReason: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      rejectionReason: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      rejectionNotes: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      deletionReason: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      deletionNotes: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      guardianName: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      guardianPhone: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      guardianEmail: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      guardianNationalId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      convertedPatientId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      convertedOwnerId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      assignedStaffId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      submittedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      updatedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const RegistrationRequest = t.Composite(
  [RegistrationRequestPlain, RegistrationRequestRelations],
  { additionalProperties: false },
);

export const RegistrationRequestInputCreate = t.Composite(
  [
    RegistrationRequestPlainInputCreate,
    RegistrationRequestRelationsInputCreate,
  ],
  { additionalProperties: false },
);

export const RegistrationRequestInputUpdate = t.Composite(
  [
    RegistrationRequestPlainInputUpdate,
    RegistrationRequestRelationsInputUpdate,
  ],
  { additionalProperties: false },
);
