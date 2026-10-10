import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const PatientGroomingProfilePlain = t.Object(
  {
    id: t.String(),
    clinicId: t.String(),
    patientId: t.String(),
    preferredGroomerId: __nullable__(t.String()),
    sizeBand: __nullable__(
      t.Union(
        [
          t.Literal("TOY"),
          t.Literal("SMALL"),
          t.Literal("MEDIUM"),
          t.Literal("LARGE"),
          t.Literal("GIANT"),
        ],
        {
          additionalProperties: false,
          description: `شريحة الحجم — تُشتق من وزن المريض ويتجاوزها كرت التجميل (القرار D4).`,
        },
      ),
    ),
    coatType: __nullable__(
      t.Union(
        [
          t.Literal("LONG_THICK"),
          t.Literal("SHORT_THICK"),
          t.Literal("LIGHT"),
          t.Literal("MEDIUM"),
          t.Literal("DOUBLE_COAT"),
          t.Literal("NONE"),
        ],
        { additionalProperties: false },
      ),
    ),
    clipperPlan: __nullable__(t.Any()),
    shampooItemId: __nullable__(t.String()),
    sensitivities: t.Array(t.String(), { additionalProperties: false }),
    behaviorScore: t.Union(
      [t.Literal("GREEN"), t.Literal("YELLOW"), t.Literal("RED")],
      {
        additionalProperties: false,
        description: `تقييم سلوك التعامل — إشارة مرور.`,
      },
    ),
    muzzleRequired: t.Boolean(),
    requiresTwoHandlers: t.Boolean(),
    handlingNotes: __nullable__(t.String()),
    heatDryProhibited: t.Boolean(),
    heatDryProhibitedReason: __nullable__(t.String()),
    groomIntervalWeeks: __nullable__(t.Integer()),
    lastGroomedAt: __nullable__(t.Date()),
    nextGroomDueAt: __nullable__(t.Date()),
    customPrice: __nullable__(t.Number()),
    customDurationMin: __nullable__(t.Integer()),
    notes: __nullable__(t.String()),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  },
  {
    additionalProperties: false,
    description: `كرت التجميل — الوثيقة التي يقوم عليها عمل الصالون فعلًا، ويُثريها السجلّ الطبي.
صفّ واحد لكل مريض، يعيش سنوات ويُعدَّل مرارًا (الخطة §4.2).`,
  },
);

export const PatientGroomingProfileRelations = t.Object(
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
    preferredGroomer: __nullable__(
      t.Object(
        {
          id: t.String(),
          code: t.String(),
          clinicId: t.String(),
          userId: __nullable__(t.String()),
          roleId: t.String(),
          branchId: t.String(),
          name: t.String(),
          gender: __nullable__(
            t.Union(
              [t.Literal("MALE"), t.Literal("FEMALE"), t.Literal("UNKNOWN")],
              { additionalProperties: false },
            ),
          ),
          prefix: __nullable__(
            t.Union(
              [
                t.Literal("MR"),
                t.Literal("MRS"),
                t.Literal("MS"),
                t.Literal("DR"),
                t.Literal("PROF"),
              ],
              { additionalProperties: false },
            ),
          ),
          age: __nullable__(t.Integer()),
          licenseNumber: __nullable__(t.String()),
          email: t.String(),
          phone: __nullable__(t.String()),
          country: __nullable__(t.String()),
          city: __nullable__(t.String()),
          address: __nullable__(t.String()),
          notes: __nullable__(t.String()),
          bio: __nullable__(t.String()),
          educationalQualification: __nullable__(t.String()),
          nationality: __nullable__(t.String()),
          avatar: __nullable__(t.String()),
          primarySpecializationId: __nullable__(t.String()),
          secondarySpecializationId: __nullable__(t.String()),
          employmentType: __nullable__(
            t.Union([t.Literal("FULL_TIME"), t.Literal("PART_TIME")], {
              additionalProperties: false,
            }),
          ),
          hireDate: __nullable__(t.Date()),
          isSaudi: t.Boolean(),
          status: t.Union(
            [t.Literal("PENDING"), t.Literal("ACTIVE"), t.Literal("INACTIVE")],
            { additionalProperties: false },
          ),
          active: t.Boolean(),
          isDeleted: t.Boolean(),
          deletedAt: __nullable__(t.Date()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    ),
    shampooItem: __nullable__(
      t.Object(
        {
          id: t.String(),
          code: t.String(),
          clinicId: t.String(),
          name: t.String(),
          category: t.Union(
            [
              t.Literal("ANTIBIOTIC"),
              t.Literal("ANTI_INFLAMMATORY"),
              t.Literal("VACCINE"),
              t.Literal("HORMONE"),
              t.Literal("SUPPLEMENT"),
              t.Literal("CRUSTACEAN"),
              t.Literal("SURGICAL_TOOLS"),
              t.Literal("SUPPLIES"),
            ],
            { additionalProperties: false },
          ),
          stock: t.Integer(),
          reorderPoint: t.Integer(),
          productionDate: __nullable__(t.Date()),
          expiryDate: __nullable__(t.Date()),
          price: t.Number(),
          unitCost: __nullable__(t.Number()),
          valuationRate: t.Number(),
          maxQuantity: __nullable__(t.Integer()),
          sku: __nullable__(t.String()),
          barcode: __nullable__(t.String()),
          supplier: __nullable__(t.String()),
          location: __nullable__(t.String()),
          notes: __nullable__(t.String()),
          tracksBatches: t.Boolean(),
          itemTaxTemplateId: __nullable__(t.String()),
          catalogProductId: __nullable__(t.String()),
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
  },
  {
    additionalProperties: false,
    description: `كرت التجميل — الوثيقة التي يقوم عليها عمل الصالون فعلًا، ويُثريها السجلّ الطبي.
صفّ واحد لكل مريض، يعيش سنوات ويُعدَّل مرارًا (الخطة §4.2).`,
  },
);

export const PatientGroomingProfilePlainInputCreate = t.Object(
  {
    sizeBand: t.Optional(
      __nullable__(
        t.Union(
          [
            t.Literal("TOY"),
            t.Literal("SMALL"),
            t.Literal("MEDIUM"),
            t.Literal("LARGE"),
            t.Literal("GIANT"),
          ],
          {
            additionalProperties: false,
            description: `شريحة الحجم — تُشتق من وزن المريض ويتجاوزها كرت التجميل (القرار D4).`,
          },
        ),
      ),
    ),
    coatType: t.Optional(
      __nullable__(
        t.Union(
          [
            t.Literal("LONG_THICK"),
            t.Literal("SHORT_THICK"),
            t.Literal("LIGHT"),
            t.Literal("MEDIUM"),
            t.Literal("DOUBLE_COAT"),
            t.Literal("NONE"),
          ],
          { additionalProperties: false },
        ),
      ),
    ),
    clipperPlan: t.Optional(__nullable__(t.Any())),
    sensitivities: t.Array(t.String(), { additionalProperties: false }),
    behaviorScore: t.Optional(
      t.Union([t.Literal("GREEN"), t.Literal("YELLOW"), t.Literal("RED")], {
        additionalProperties: false,
        description: `تقييم سلوك التعامل — إشارة مرور.`,
      }),
    ),
    muzzleRequired: t.Optional(t.Boolean()),
    requiresTwoHandlers: t.Optional(t.Boolean()),
    handlingNotes: t.Optional(__nullable__(t.String())),
    heatDryProhibited: t.Optional(t.Boolean()),
    heatDryProhibitedReason: t.Optional(__nullable__(t.String())),
    groomIntervalWeeks: t.Optional(__nullable__(t.Integer())),
    lastGroomedAt: t.Optional(__nullable__(t.Date())),
    nextGroomDueAt: t.Optional(__nullable__(t.Date())),
    customPrice: t.Optional(__nullable__(t.Number())),
    customDurationMin: t.Optional(__nullable__(t.Integer())),
    notes: t.Optional(__nullable__(t.String())),
  },
  {
    additionalProperties: false,
    description: `كرت التجميل — الوثيقة التي يقوم عليها عمل الصالون فعلًا، ويُثريها السجلّ الطبي.
صفّ واحد لكل مريض، يعيش سنوات ويُعدَّل مرارًا (الخطة §4.2).`,
  },
);

export const PatientGroomingProfilePlainInputUpdate = t.Object(
  {
    sizeBand: t.Optional(
      __nullable__(
        t.Union(
          [
            t.Literal("TOY"),
            t.Literal("SMALL"),
            t.Literal("MEDIUM"),
            t.Literal("LARGE"),
            t.Literal("GIANT"),
          ],
          {
            additionalProperties: false,
            description: `شريحة الحجم — تُشتق من وزن المريض ويتجاوزها كرت التجميل (القرار D4).`,
          },
        ),
      ),
    ),
    coatType: t.Optional(
      __nullable__(
        t.Union(
          [
            t.Literal("LONG_THICK"),
            t.Literal("SHORT_THICK"),
            t.Literal("LIGHT"),
            t.Literal("MEDIUM"),
            t.Literal("DOUBLE_COAT"),
            t.Literal("NONE"),
          ],
          { additionalProperties: false },
        ),
      ),
    ),
    clipperPlan: t.Optional(__nullable__(t.Any())),
    sensitivities: t.Optional(
      t.Array(t.String(), { additionalProperties: false }),
    ),
    behaviorScore: t.Optional(
      t.Union([t.Literal("GREEN"), t.Literal("YELLOW"), t.Literal("RED")], {
        additionalProperties: false,
        description: `تقييم سلوك التعامل — إشارة مرور.`,
      }),
    ),
    muzzleRequired: t.Optional(t.Boolean()),
    requiresTwoHandlers: t.Optional(t.Boolean()),
    handlingNotes: t.Optional(__nullable__(t.String())),
    heatDryProhibited: t.Optional(t.Boolean()),
    heatDryProhibitedReason: t.Optional(__nullable__(t.String())),
    groomIntervalWeeks: t.Optional(__nullable__(t.Integer())),
    lastGroomedAt: t.Optional(__nullable__(t.Date())),
    nextGroomDueAt: t.Optional(__nullable__(t.Date())),
    customPrice: t.Optional(__nullable__(t.Number())),
    customDurationMin: t.Optional(__nullable__(t.Integer())),
    notes: t.Optional(__nullable__(t.String())),
  },
  {
    additionalProperties: false,
    description: `كرت التجميل — الوثيقة التي يقوم عليها عمل الصالون فعلًا، ويُثريها السجلّ الطبي.
صفّ واحد لكل مريض، يعيش سنوات ويُعدَّل مرارًا (الخطة §4.2).`,
  },
);

export const PatientGroomingProfileRelationsInputCreate = t.Object(
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
    preferredGroomer: t.Optional(
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
    shampooItem: t.Optional(
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
  {
    additionalProperties: false,
    description: `كرت التجميل — الوثيقة التي يقوم عليها عمل الصالون فعلًا، ويُثريها السجلّ الطبي.
صفّ واحد لكل مريض، يعيش سنوات ويُعدَّل مرارًا (الخطة §4.2).`,
  },
);

export const PatientGroomingProfileRelationsInputUpdate = t.Partial(
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
      preferredGroomer: t.Partial(
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
      shampooItem: t.Partial(
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
    {
      additionalProperties: false,
      description: `كرت التجميل — الوثيقة التي يقوم عليها عمل الصالون فعلًا، ويُثريها السجلّ الطبي.
صفّ واحد لكل مريض، يعيش سنوات ويُعدَّل مرارًا (الخطة §4.2).`,
    },
  ),
);

export const PatientGroomingProfileWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          clinicId: t.String(),
          patientId: t.String(),
          preferredGroomerId: t.String(),
          sizeBand: t.Union(
            [
              t.Literal("TOY"),
              t.Literal("SMALL"),
              t.Literal("MEDIUM"),
              t.Literal("LARGE"),
              t.Literal("GIANT"),
            ],
            {
              additionalProperties: false,
              description: `شريحة الحجم — تُشتق من وزن المريض ويتجاوزها كرت التجميل (القرار D4).`,
            },
          ),
          coatType: t.Union(
            [
              t.Literal("LONG_THICK"),
              t.Literal("SHORT_THICK"),
              t.Literal("LIGHT"),
              t.Literal("MEDIUM"),
              t.Literal("DOUBLE_COAT"),
              t.Literal("NONE"),
            ],
            { additionalProperties: false },
          ),
          clipperPlan: t.Any(),
          shampooItemId: t.String(),
          sensitivities: t.Array(t.String(), { additionalProperties: false }),
          behaviorScore: t.Union(
            [t.Literal("GREEN"), t.Literal("YELLOW"), t.Literal("RED")],
            {
              additionalProperties: false,
              description: `تقييم سلوك التعامل — إشارة مرور.`,
            },
          ),
          muzzleRequired: t.Boolean(),
          requiresTwoHandlers: t.Boolean(),
          handlingNotes: t.String(),
          heatDryProhibited: t.Boolean(),
          heatDryProhibitedReason: t.String(),
          groomIntervalWeeks: t.Integer(),
          lastGroomedAt: t.Date(),
          nextGroomDueAt: t.Date(),
          customPrice: t.Number(),
          customDurationMin: t.Integer(),
          notes: t.String(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `كرت التجميل — الوثيقة التي يقوم عليها عمل الصالون فعلًا، ويُثريها السجلّ الطبي.
صفّ واحد لكل مريض، يعيش سنوات ويُعدَّل مرارًا (الخطة §4.2).`,
        },
      ),
    { $id: "PatientGroomingProfile" },
  ),
);

export const PatientGroomingProfileWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.String(), patientId: t.String() },
            {
              additionalProperties: false,
              description: `كرت التجميل — الوثيقة التي يقوم عليها عمل الصالون فعلًا، ويُثريها السجلّ الطبي.
صفّ واحد لكل مريض، يعيش سنوات ويُعدَّل مرارًا (الخطة §4.2).`,
            },
          ),
          { additionalProperties: false },
        ),
        t.Union(
          [t.Object({ id: t.String() }), t.Object({ patientId: t.String() })],
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
              patientId: t.String(),
              preferredGroomerId: t.String(),
              sizeBand: t.Union(
                [
                  t.Literal("TOY"),
                  t.Literal("SMALL"),
                  t.Literal("MEDIUM"),
                  t.Literal("LARGE"),
                  t.Literal("GIANT"),
                ],
                {
                  additionalProperties: false,
                  description: `شريحة الحجم — تُشتق من وزن المريض ويتجاوزها كرت التجميل (القرار D4).`,
                },
              ),
              coatType: t.Union(
                [
                  t.Literal("LONG_THICK"),
                  t.Literal("SHORT_THICK"),
                  t.Literal("LIGHT"),
                  t.Literal("MEDIUM"),
                  t.Literal("DOUBLE_COAT"),
                  t.Literal("NONE"),
                ],
                { additionalProperties: false },
              ),
              clipperPlan: t.Any(),
              shampooItemId: t.String(),
              sensitivities: t.Array(t.String(), {
                additionalProperties: false,
              }),
              behaviorScore: t.Union(
                [t.Literal("GREEN"), t.Literal("YELLOW"), t.Literal("RED")],
                {
                  additionalProperties: false,
                  description: `تقييم سلوك التعامل — إشارة مرور.`,
                },
              ),
              muzzleRequired: t.Boolean(),
              requiresTwoHandlers: t.Boolean(),
              handlingNotes: t.String(),
              heatDryProhibited: t.Boolean(),
              heatDryProhibitedReason: t.String(),
              groomIntervalWeeks: t.Integer(),
              lastGroomedAt: t.Date(),
              nextGroomDueAt: t.Date(),
              customPrice: t.Number(),
              customDurationMin: t.Integer(),
              notes: t.String(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "PatientGroomingProfile" },
);

export const PatientGroomingProfileSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      clinicId: t.Boolean(),
      patientId: t.Boolean(),
      preferredGroomerId: t.Boolean(),
      sizeBand: t.Boolean(),
      coatType: t.Boolean(),
      clipperPlan: t.Boolean(),
      shampooItemId: t.Boolean(),
      sensitivities: t.Boolean(),
      behaviorScore: t.Boolean(),
      muzzleRequired: t.Boolean(),
      requiresTwoHandlers: t.Boolean(),
      handlingNotes: t.Boolean(),
      heatDryProhibited: t.Boolean(),
      heatDryProhibitedReason: t.Boolean(),
      groomIntervalWeeks: t.Boolean(),
      lastGroomedAt: t.Boolean(),
      nextGroomDueAt: t.Boolean(),
      customPrice: t.Boolean(),
      customDurationMin: t.Boolean(),
      notes: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinic: t.Boolean(),
      patient: t.Boolean(),
      preferredGroomer: t.Boolean(),
      shampooItem: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `كرت التجميل — الوثيقة التي يقوم عليها عمل الصالون فعلًا، ويُثريها السجلّ الطبي.
صفّ واحد لكل مريض، يعيش سنوات ويُعدَّل مرارًا (الخطة §4.2).`,
    },
  ),
);

export const PatientGroomingProfileInclude = t.Partial(
  t.Object(
    {
      sizeBand: t.Boolean(),
      coatType: t.Boolean(),
      behaviorScore: t.Boolean(),
      clinic: t.Boolean(),
      patient: t.Boolean(),
      preferredGroomer: t.Boolean(),
      shampooItem: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `كرت التجميل — الوثيقة التي يقوم عليها عمل الصالون فعلًا، ويُثريها السجلّ الطبي.
صفّ واحد لكل مريض، يعيش سنوات ويُعدَّل مرارًا (الخطة §4.2).`,
    },
  ),
);

export const PatientGroomingProfileOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clinicId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      patientId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      preferredGroomerId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clipperPlan: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      shampooItemId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      sensitivities: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      muzzleRequired: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      requiresTwoHandlers: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      handlingNotes: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      heatDryProhibited: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      heatDryProhibitedReason: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      groomIntervalWeeks: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      lastGroomedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      nextGroomDueAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      customPrice: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      customDurationMin: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      notes: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      updatedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    {
      additionalProperties: false,
      description: `كرت التجميل — الوثيقة التي يقوم عليها عمل الصالون فعلًا، ويُثريها السجلّ الطبي.
صفّ واحد لكل مريض، يعيش سنوات ويُعدَّل مرارًا (الخطة §4.2).`,
    },
  ),
);

export const PatientGroomingProfile = t.Composite(
  [PatientGroomingProfilePlain, PatientGroomingProfileRelations],
  { additionalProperties: false },
);

export const PatientGroomingProfileInputCreate = t.Composite(
  [
    PatientGroomingProfilePlainInputCreate,
    PatientGroomingProfileRelationsInputCreate,
  ],
  { additionalProperties: false },
);

export const PatientGroomingProfileInputUpdate = t.Composite(
  [
    PatientGroomingProfilePlainInputUpdate,
    PatientGroomingProfileRelationsInputUpdate,
  ],
  { additionalProperties: false },
);
