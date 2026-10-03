import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const ClinicOnboardingProfilePlain = t.Object(
  {
    id: t.String(),
    clinicId: t.String(),
    specialtyType: __nullable__(
      t.Union(
        [
          t.Literal("VET_CLINIC"),
          t.Literal("VET_HOSPITAL"),
          t.Literal("GROOMING_CENTER"),
          t.Literal("MOBILE_SERVICES"),
          t.Literal("SPECIALIZED_SURGERY"),
          t.Literal("MULTI_SERVICES"),
        ],
        { additionalProperties: false },
      ),
    ),
    mainGoal: __nullable__(
      t.Union(
        [
          t.Literal("APPOINTMENTS_MANAGEMENT"),
          t.Literal("PATIENTS_MANAGEMENT"),
          t.Literal("INVENTORY_MANAGEMENT"),
          t.Literal("BILLING_MANAGEMENT"),
          t.Literal("REVENUE_IMPROVEMENT"),
          t.Literal("WORKFLOW_AUTOMATION"),
          t.Literal("PAPERWORK_REDUCTION"),
          t.Literal("CUSTOMER_EXPERIENCE"),
        ],
        { additionalProperties: false },
      ),
    ),
    clinicSize: __nullable__(
      t.Union(
        [
          t.Literal("SOLO"),
          t.Literal("SMALL"),
          t.Literal("MEDIUM"),
          t.Literal("MEDICAL_CENTER"),
          t.Literal("HOSPITAL"),
        ],
        { additionalProperties: false },
      ),
    ),
    animalTypes: t.Array(t.String(), { additionalProperties: false }),
    monthlyVisits: __nullable__(
      t.Union(
        [
          t.Literal("UNDER_50"),
          t.Literal("RANGE_50_100"),
          t.Literal("RANGE_101_250"),
          t.Literal("OVER_1000"),
        ],
        { additionalProperties: false },
      ),
    ),
    monthlyPatients: __nullable__(
      t.Union(
        [
          t.Literal("UNDER_50"),
          t.Literal("RANGE_50_100"),
          t.Literal("RANGE_101_250"),
          t.Literal("OVER_1000"),
        ],
        { additionalProperties: false },
      ),
    ),
    multiBranch: __nullable__(t.Boolean()),
    serviceDelivery: __nullable__(
      t.Union(
        [
          t.Literal("IN_CLINIC"),
          t.Literal("REMOTE"),
          t.Literal("MOBILE_CLINIC"),
          t.Literal("ALL"),
        ],
        { additionalProperties: false },
      ),
    ),
    referralSource: __nullable__(
      t.Union(
        [
          t.Literal("FRIEND"),
          t.Literal("GOOGLE"),
          t.Literal("TWITTER"),
          t.Literal("LINKEDIN"),
          t.Literal("BLOG"),
          t.Literal("NEWSLETTER"),
          t.Literal("PODCAST"),
          t.Literal("OTHER"),
        ],
        { additionalProperties: false },
      ),
    ),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  },
  { additionalProperties: false },
);

export const ClinicOnboardingProfileRelations = t.Object(
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
  },
  { additionalProperties: false },
);

export const ClinicOnboardingProfilePlainInputCreate = t.Object(
  {
    specialtyType: t.Optional(
      __nullable__(
        t.Union(
          [
            t.Literal("VET_CLINIC"),
            t.Literal("VET_HOSPITAL"),
            t.Literal("GROOMING_CENTER"),
            t.Literal("MOBILE_SERVICES"),
            t.Literal("SPECIALIZED_SURGERY"),
            t.Literal("MULTI_SERVICES"),
          ],
          { additionalProperties: false },
        ),
      ),
    ),
    mainGoal: t.Optional(
      __nullable__(
        t.Union(
          [
            t.Literal("APPOINTMENTS_MANAGEMENT"),
            t.Literal("PATIENTS_MANAGEMENT"),
            t.Literal("INVENTORY_MANAGEMENT"),
            t.Literal("BILLING_MANAGEMENT"),
            t.Literal("REVENUE_IMPROVEMENT"),
            t.Literal("WORKFLOW_AUTOMATION"),
            t.Literal("PAPERWORK_REDUCTION"),
            t.Literal("CUSTOMER_EXPERIENCE"),
          ],
          { additionalProperties: false },
        ),
      ),
    ),
    clinicSize: t.Optional(
      __nullable__(
        t.Union(
          [
            t.Literal("SOLO"),
            t.Literal("SMALL"),
            t.Literal("MEDIUM"),
            t.Literal("MEDICAL_CENTER"),
            t.Literal("HOSPITAL"),
          ],
          { additionalProperties: false },
        ),
      ),
    ),
    animalTypes: t.Array(t.String(), { additionalProperties: false }),
    monthlyVisits: t.Optional(
      __nullable__(
        t.Union(
          [
            t.Literal("UNDER_50"),
            t.Literal("RANGE_50_100"),
            t.Literal("RANGE_101_250"),
            t.Literal("OVER_1000"),
          ],
          { additionalProperties: false },
        ),
      ),
    ),
    monthlyPatients: t.Optional(
      __nullable__(
        t.Union(
          [
            t.Literal("UNDER_50"),
            t.Literal("RANGE_50_100"),
            t.Literal("RANGE_101_250"),
            t.Literal("OVER_1000"),
          ],
          { additionalProperties: false },
        ),
      ),
    ),
    multiBranch: t.Optional(__nullable__(t.Boolean())),
    serviceDelivery: t.Optional(
      __nullable__(
        t.Union(
          [
            t.Literal("IN_CLINIC"),
            t.Literal("REMOTE"),
            t.Literal("MOBILE_CLINIC"),
            t.Literal("ALL"),
          ],
          { additionalProperties: false },
        ),
      ),
    ),
    referralSource: t.Optional(
      __nullable__(
        t.Union(
          [
            t.Literal("FRIEND"),
            t.Literal("GOOGLE"),
            t.Literal("TWITTER"),
            t.Literal("LINKEDIN"),
            t.Literal("BLOG"),
            t.Literal("NEWSLETTER"),
            t.Literal("PODCAST"),
            t.Literal("OTHER"),
          ],
          { additionalProperties: false },
        ),
      ),
    ),
  },
  { additionalProperties: false },
);

export const ClinicOnboardingProfilePlainInputUpdate = t.Object(
  {
    specialtyType: t.Optional(
      __nullable__(
        t.Union(
          [
            t.Literal("VET_CLINIC"),
            t.Literal("VET_HOSPITAL"),
            t.Literal("GROOMING_CENTER"),
            t.Literal("MOBILE_SERVICES"),
            t.Literal("SPECIALIZED_SURGERY"),
            t.Literal("MULTI_SERVICES"),
          ],
          { additionalProperties: false },
        ),
      ),
    ),
    mainGoal: t.Optional(
      __nullable__(
        t.Union(
          [
            t.Literal("APPOINTMENTS_MANAGEMENT"),
            t.Literal("PATIENTS_MANAGEMENT"),
            t.Literal("INVENTORY_MANAGEMENT"),
            t.Literal("BILLING_MANAGEMENT"),
            t.Literal("REVENUE_IMPROVEMENT"),
            t.Literal("WORKFLOW_AUTOMATION"),
            t.Literal("PAPERWORK_REDUCTION"),
            t.Literal("CUSTOMER_EXPERIENCE"),
          ],
          { additionalProperties: false },
        ),
      ),
    ),
    clinicSize: t.Optional(
      __nullable__(
        t.Union(
          [
            t.Literal("SOLO"),
            t.Literal("SMALL"),
            t.Literal("MEDIUM"),
            t.Literal("MEDICAL_CENTER"),
            t.Literal("HOSPITAL"),
          ],
          { additionalProperties: false },
        ),
      ),
    ),
    animalTypes: t.Optional(
      t.Array(t.String(), { additionalProperties: false }),
    ),
    monthlyVisits: t.Optional(
      __nullable__(
        t.Union(
          [
            t.Literal("UNDER_50"),
            t.Literal("RANGE_50_100"),
            t.Literal("RANGE_101_250"),
            t.Literal("OVER_1000"),
          ],
          { additionalProperties: false },
        ),
      ),
    ),
    monthlyPatients: t.Optional(
      __nullable__(
        t.Union(
          [
            t.Literal("UNDER_50"),
            t.Literal("RANGE_50_100"),
            t.Literal("RANGE_101_250"),
            t.Literal("OVER_1000"),
          ],
          { additionalProperties: false },
        ),
      ),
    ),
    multiBranch: t.Optional(__nullable__(t.Boolean())),
    serviceDelivery: t.Optional(
      __nullable__(
        t.Union(
          [
            t.Literal("IN_CLINIC"),
            t.Literal("REMOTE"),
            t.Literal("MOBILE_CLINIC"),
            t.Literal("ALL"),
          ],
          { additionalProperties: false },
        ),
      ),
    ),
    referralSource: t.Optional(
      __nullable__(
        t.Union(
          [
            t.Literal("FRIEND"),
            t.Literal("GOOGLE"),
            t.Literal("TWITTER"),
            t.Literal("LINKEDIN"),
            t.Literal("BLOG"),
            t.Literal("NEWSLETTER"),
            t.Literal("PODCAST"),
            t.Literal("OTHER"),
          ],
          { additionalProperties: false },
        ),
      ),
    ),
  },
  { additionalProperties: false },
);

export const ClinicOnboardingProfileRelationsInputCreate = t.Object(
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
  },
  { additionalProperties: false },
);

export const ClinicOnboardingProfileRelationsInputUpdate = t.Partial(
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
    },
    { additionalProperties: false },
  ),
);

export const ClinicOnboardingProfileWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          clinicId: t.String(),
          specialtyType: t.Union(
            [
              t.Literal("VET_CLINIC"),
              t.Literal("VET_HOSPITAL"),
              t.Literal("GROOMING_CENTER"),
              t.Literal("MOBILE_SERVICES"),
              t.Literal("SPECIALIZED_SURGERY"),
              t.Literal("MULTI_SERVICES"),
            ],
            { additionalProperties: false },
          ),
          mainGoal: t.Union(
            [
              t.Literal("APPOINTMENTS_MANAGEMENT"),
              t.Literal("PATIENTS_MANAGEMENT"),
              t.Literal("INVENTORY_MANAGEMENT"),
              t.Literal("BILLING_MANAGEMENT"),
              t.Literal("REVENUE_IMPROVEMENT"),
              t.Literal("WORKFLOW_AUTOMATION"),
              t.Literal("PAPERWORK_REDUCTION"),
              t.Literal("CUSTOMER_EXPERIENCE"),
            ],
            { additionalProperties: false },
          ),
          clinicSize: t.Union(
            [
              t.Literal("SOLO"),
              t.Literal("SMALL"),
              t.Literal("MEDIUM"),
              t.Literal("MEDICAL_CENTER"),
              t.Literal("HOSPITAL"),
            ],
            { additionalProperties: false },
          ),
          animalTypes: t.Array(t.String(), { additionalProperties: false }),
          monthlyVisits: t.Union(
            [
              t.Literal("UNDER_50"),
              t.Literal("RANGE_50_100"),
              t.Literal("RANGE_101_250"),
              t.Literal("OVER_1000"),
            ],
            { additionalProperties: false },
          ),
          monthlyPatients: t.Union(
            [
              t.Literal("UNDER_50"),
              t.Literal("RANGE_50_100"),
              t.Literal("RANGE_101_250"),
              t.Literal("OVER_1000"),
            ],
            { additionalProperties: false },
          ),
          multiBranch: t.Boolean(),
          serviceDelivery: t.Union(
            [
              t.Literal("IN_CLINIC"),
              t.Literal("REMOTE"),
              t.Literal("MOBILE_CLINIC"),
              t.Literal("ALL"),
            ],
            { additionalProperties: false },
          ),
          referralSource: t.Union(
            [
              t.Literal("FRIEND"),
              t.Literal("GOOGLE"),
              t.Literal("TWITTER"),
              t.Literal("LINKEDIN"),
              t.Literal("BLOG"),
              t.Literal("NEWSLETTER"),
              t.Literal("PODCAST"),
              t.Literal("OTHER"),
            ],
            { additionalProperties: false },
          ),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "ClinicOnboardingProfile" },
  ),
);

export const ClinicOnboardingProfileWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.String(), clinicId: t.String() },
            { additionalProperties: false },
          ),
          { additionalProperties: false },
        ),
        t.Union(
          [t.Object({ id: t.String() }), t.Object({ clinicId: t.String() })],
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
              clinicId: t.String(),
              specialtyType: t.Union(
                [
                  t.Literal("VET_CLINIC"),
                  t.Literal("VET_HOSPITAL"),
                  t.Literal("GROOMING_CENTER"),
                  t.Literal("MOBILE_SERVICES"),
                  t.Literal("SPECIALIZED_SURGERY"),
                  t.Literal("MULTI_SERVICES"),
                ],
                { additionalProperties: false },
              ),
              mainGoal: t.Union(
                [
                  t.Literal("APPOINTMENTS_MANAGEMENT"),
                  t.Literal("PATIENTS_MANAGEMENT"),
                  t.Literal("INVENTORY_MANAGEMENT"),
                  t.Literal("BILLING_MANAGEMENT"),
                  t.Literal("REVENUE_IMPROVEMENT"),
                  t.Literal("WORKFLOW_AUTOMATION"),
                  t.Literal("PAPERWORK_REDUCTION"),
                  t.Literal("CUSTOMER_EXPERIENCE"),
                ],
                { additionalProperties: false },
              ),
              clinicSize: t.Union(
                [
                  t.Literal("SOLO"),
                  t.Literal("SMALL"),
                  t.Literal("MEDIUM"),
                  t.Literal("MEDICAL_CENTER"),
                  t.Literal("HOSPITAL"),
                ],
                { additionalProperties: false },
              ),
              animalTypes: t.Array(t.String(), { additionalProperties: false }),
              monthlyVisits: t.Union(
                [
                  t.Literal("UNDER_50"),
                  t.Literal("RANGE_50_100"),
                  t.Literal("RANGE_101_250"),
                  t.Literal("OVER_1000"),
                ],
                { additionalProperties: false },
              ),
              monthlyPatients: t.Union(
                [
                  t.Literal("UNDER_50"),
                  t.Literal("RANGE_50_100"),
                  t.Literal("RANGE_101_250"),
                  t.Literal("OVER_1000"),
                ],
                { additionalProperties: false },
              ),
              multiBranch: t.Boolean(),
              serviceDelivery: t.Union(
                [
                  t.Literal("IN_CLINIC"),
                  t.Literal("REMOTE"),
                  t.Literal("MOBILE_CLINIC"),
                  t.Literal("ALL"),
                ],
                { additionalProperties: false },
              ),
              referralSource: t.Union(
                [
                  t.Literal("FRIEND"),
                  t.Literal("GOOGLE"),
                  t.Literal("TWITTER"),
                  t.Literal("LINKEDIN"),
                  t.Literal("BLOG"),
                  t.Literal("NEWSLETTER"),
                  t.Literal("PODCAST"),
                  t.Literal("OTHER"),
                ],
                { additionalProperties: false },
              ),
              createdAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "ClinicOnboardingProfile" },
);

export const ClinicOnboardingProfileSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      clinicId: t.Boolean(),
      specialtyType: t.Boolean(),
      mainGoal: t.Boolean(),
      clinicSize: t.Boolean(),
      animalTypes: t.Boolean(),
      monthlyVisits: t.Boolean(),
      monthlyPatients: t.Boolean(),
      multiBranch: t.Boolean(),
      serviceDelivery: t.Boolean(),
      referralSource: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinic: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const ClinicOnboardingProfileInclude = t.Partial(
  t.Object(
    {
      specialtyType: t.Boolean(),
      mainGoal: t.Boolean(),
      clinicSize: t.Boolean(),
      monthlyVisits: t.Boolean(),
      monthlyPatients: t.Boolean(),
      serviceDelivery: t.Boolean(),
      referralSource: t.Boolean(),
      clinic: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const ClinicOnboardingProfileOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clinicId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      animalTypes: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      multiBranch: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const ClinicOnboardingProfile = t.Composite(
  [ClinicOnboardingProfilePlain, ClinicOnboardingProfileRelations],
  { additionalProperties: false },
);

export const ClinicOnboardingProfileInputCreate = t.Composite(
  [
    ClinicOnboardingProfilePlainInputCreate,
    ClinicOnboardingProfileRelationsInputCreate,
  ],
  { additionalProperties: false },
);

export const ClinicOnboardingProfileInputUpdate = t.Composite(
  [
    ClinicOnboardingProfilePlainInputUpdate,
    ClinicOnboardingProfileRelationsInputUpdate,
  ],
  { additionalProperties: false },
);
