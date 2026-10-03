import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const AnimalStrainPlain = t.Object(
  {
    id: t.String(),
    code: __nullable__(t.String()),
    arName: t.String(),
    enName: t.String(),
    animalTypeId: t.String(),
    avgWeightMin: __nullable__(t.Integer()),
    avgWeightMax: __nullable__(t.Integer()),
    avgAgeMin: __nullable__(t.Integer()),
    avgAgeMax: __nullable__(t.Integer()),
    originCountry: __nullable__(t.String()),
    hairType: __nullable__(
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
    activityLevel: __nullable__(
      t.Union([t.Literal("LOW"), t.Literal("MEDIUM"), t.Literal("HIGH")], {
        additionalProperties: false,
      }),
    ),
    groomingNeeds: __nullable__(
      t.Union([t.Literal("LOW"), t.Literal("MEDIUM"), t.Literal("HIGH")], {
        additionalProperties: false,
      }),
    ),
    isBrachycephalic: t.Boolean(),
    commonDiseases: t.Array(t.String(), { additionalProperties: false }),
    isDefault: t.Boolean(),
    clinicId: __nullable__(t.String()),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  },
  { additionalProperties: false },
);

export const AnimalStrainRelations = t.Object(
  {
    animalType: t.Object(
      {
        id: t.String(),
        code: __nullable__(t.String()),
        arName: t.String(),
        enName: t.String(),
        isDefault: t.Boolean(),
        clinicId: __nullable__(t.String()),
        createdAt: t.Date(),
        species: __nullable__(
          t.Union(
            [
              t.Literal("DOG"),
              t.Literal("CAT"),
              t.Literal("HORSE"),
              t.Literal("CATTLE"),
              t.Literal("SHEEP"),
              t.Literal("GOAT"),
              t.Literal("CAMEL"),
              t.Literal("POULTRY"),
              t.Literal("RABBIT"),
              t.Literal("SWINE"),
              t.Literal("FISH"),
              t.Literal("BEE"),
            ],
            { additionalProperties: false },
          ),
        ),
      },
      { additionalProperties: false },
    ),
    clinic: __nullable__(
      t.Object(
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
    ),
    patients: t.Array(
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
      { additionalProperties: false },
    ),
    carePlans: t.Array(
      t.Object(
        {
          id: t.String(),
          code: t.String(),
          clinicId: t.String(),
          name: t.String(),
          serviceId: t.String(),
          animalTypeId: t.String(),
          animalStrainId: t.String(),
          notes: __nullable__(t.String()),
          visitDurationMins: __nullable__(t.Integer()),
          price: t.Number(),
          durationDays: t.Integer(),
          status: t.Union([t.Literal("ACTIVE"), t.Literal("INACTIVE")], {
            additionalProperties: false,
          }),
          usageCount: t.Integer(),
          subscribersCount: t.Integer(),
          ratingSum: t.Integer(),
          ratingCount: t.Integer(),
          editsCount: t.Integer(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    vaccinationProtocols: t.Array(
      t.Object(
        {
          id: t.String(),
          code: t.String(),
          clinicId: __nullable__(t.String()),
          name: t.String(),
          nameEn: __nullable__(t.String()),
          species: t.Union(
            [
              t.Literal("DOG"),
              t.Literal("CAT"),
              t.Literal("HORSE"),
              t.Literal("CATTLE"),
              t.Literal("SHEEP"),
              t.Literal("GOAT"),
              t.Literal("CAMEL"),
              t.Literal("POULTRY"),
              t.Literal("RABBIT"),
              t.Literal("SWINE"),
              t.Literal("FISH"),
              t.Literal("BEE"),
            ],
            { additionalProperties: false },
          ),
          animalTypeId: __nullable__(t.String()),
          animalStrainId: __nullable__(t.String()),
          isCore: t.Boolean(),
          isDefault: t.Boolean(),
          active: t.Boolean(),
          notes: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    groomingPriceRules: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          definitionId: t.String(),
          animalTypeId: __nullable__(t.String()),
          animalStrainId: __nullable__(t.String()),
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
          price: t.Number(),
          durationMin: t.Integer(),
          dryingMinutes: __nullable__(t.Integer()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `صفّ في مصفوفة السعر/المدة (§5). الأخصّ يفوز، وسُلَّم الحلّ مذكور في
grooming-pricing.service.ts ومختبَر رتبةً رتبة. الأعمدة الاختيارية هي أبعاد
المطابقة: NULL تعني «لا يقيّد هذا البعد».`,
        },
      ),
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const AnimalStrainPlainInputCreate = t.Object(
  {
    code: t.Optional(__nullable__(t.String())),
    arName: t.String(),
    enName: t.String(),
    avgWeightMin: t.Optional(__nullable__(t.Integer())),
    avgWeightMax: t.Optional(__nullable__(t.Integer())),
    avgAgeMin: t.Optional(__nullable__(t.Integer())),
    avgAgeMax: t.Optional(__nullable__(t.Integer())),
    originCountry: t.Optional(__nullable__(t.String())),
    hairType: t.Optional(
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
    activityLevel: t.Optional(
      __nullable__(
        t.Union([t.Literal("LOW"), t.Literal("MEDIUM"), t.Literal("HIGH")], {
          additionalProperties: false,
        }),
      ),
    ),
    groomingNeeds: t.Optional(
      __nullable__(
        t.Union([t.Literal("LOW"), t.Literal("MEDIUM"), t.Literal("HIGH")], {
          additionalProperties: false,
        }),
      ),
    ),
    isBrachycephalic: t.Optional(t.Boolean()),
    commonDiseases: t.Array(t.String(), { additionalProperties: false }),
    isDefault: t.Optional(t.Boolean()),
  },
  { additionalProperties: false },
);

export const AnimalStrainPlainInputUpdate = t.Object(
  {
    code: t.Optional(__nullable__(t.String())),
    arName: t.Optional(t.String()),
    enName: t.Optional(t.String()),
    avgWeightMin: t.Optional(__nullable__(t.Integer())),
    avgWeightMax: t.Optional(__nullable__(t.Integer())),
    avgAgeMin: t.Optional(__nullable__(t.Integer())),
    avgAgeMax: t.Optional(__nullable__(t.Integer())),
    originCountry: t.Optional(__nullable__(t.String())),
    hairType: t.Optional(
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
    activityLevel: t.Optional(
      __nullable__(
        t.Union([t.Literal("LOW"), t.Literal("MEDIUM"), t.Literal("HIGH")], {
          additionalProperties: false,
        }),
      ),
    ),
    groomingNeeds: t.Optional(
      __nullable__(
        t.Union([t.Literal("LOW"), t.Literal("MEDIUM"), t.Literal("HIGH")], {
          additionalProperties: false,
        }),
      ),
    ),
    isBrachycephalic: t.Optional(t.Boolean()),
    commonDiseases: t.Optional(
      t.Array(t.String(), { additionalProperties: false }),
    ),
    isDefault: t.Optional(t.Boolean()),
  },
  { additionalProperties: false },
);

export const AnimalStrainRelationsInputCreate = t.Object(
  {
    animalType: t.Object(
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
    clinic: t.Optional(
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
    patients: t.Optional(
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
    carePlans: t.Optional(
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
    vaccinationProtocols: t.Optional(
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
    groomingPriceRules: t.Optional(
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

export const AnimalStrainRelationsInputUpdate = t.Partial(
  t.Object(
    {
      animalType: t.Object(
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
      clinic: t.Partial(
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
      patients: t.Partial(
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
      carePlans: t.Partial(
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
      vaccinationProtocols: t.Partial(
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
      groomingPriceRules: t.Partial(
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

export const AnimalStrainWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          code: t.String(),
          arName: t.String(),
          enName: t.String(),
          animalTypeId: t.String(),
          avgWeightMin: t.Integer(),
          avgWeightMax: t.Integer(),
          avgAgeMin: t.Integer(),
          avgAgeMax: t.Integer(),
          originCountry: t.String(),
          hairType: t.Union(
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
          activityLevel: t.Union(
            [t.Literal("LOW"), t.Literal("MEDIUM"), t.Literal("HIGH")],
            { additionalProperties: false },
          ),
          groomingNeeds: t.Union(
            [t.Literal("LOW"), t.Literal("MEDIUM"), t.Literal("HIGH")],
            { additionalProperties: false },
          ),
          isBrachycephalic: t.Boolean(),
          commonDiseases: t.Array(t.String(), { additionalProperties: false }),
          isDefault: t.Boolean(),
          clinicId: t.String(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "AnimalStrain" },
  ),
);

export const AnimalStrainWhereUnique = t.Recursive(
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
              arName: t.String(),
              enName: t.String(),
              animalTypeId: t.String(),
              avgWeightMin: t.Integer(),
              avgWeightMax: t.Integer(),
              avgAgeMin: t.Integer(),
              avgAgeMax: t.Integer(),
              originCountry: t.String(),
              hairType: t.Union(
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
              activityLevel: t.Union(
                [t.Literal("LOW"), t.Literal("MEDIUM"), t.Literal("HIGH")],
                { additionalProperties: false },
              ),
              groomingNeeds: t.Union(
                [t.Literal("LOW"), t.Literal("MEDIUM"), t.Literal("HIGH")],
                { additionalProperties: false },
              ),
              isBrachycephalic: t.Boolean(),
              commonDiseases: t.Array(t.String(), {
                additionalProperties: false,
              }),
              isDefault: t.Boolean(),
              clinicId: t.String(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "AnimalStrain" },
);

export const AnimalStrainSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      code: t.Boolean(),
      arName: t.Boolean(),
      enName: t.Boolean(),
      animalTypeId: t.Boolean(),
      avgWeightMin: t.Boolean(),
      avgWeightMax: t.Boolean(),
      avgAgeMin: t.Boolean(),
      avgAgeMax: t.Boolean(),
      originCountry: t.Boolean(),
      hairType: t.Boolean(),
      activityLevel: t.Boolean(),
      groomingNeeds: t.Boolean(),
      isBrachycephalic: t.Boolean(),
      commonDiseases: t.Boolean(),
      isDefault: t.Boolean(),
      clinicId: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      animalType: t.Boolean(),
      clinic: t.Boolean(),
      patients: t.Boolean(),
      carePlans: t.Boolean(),
      vaccinationProtocols: t.Boolean(),
      groomingPriceRules: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const AnimalStrainInclude = t.Partial(
  t.Object(
    {
      hairType: t.Boolean(),
      activityLevel: t.Boolean(),
      groomingNeeds: t.Boolean(),
      animalType: t.Boolean(),
      clinic: t.Boolean(),
      patients: t.Boolean(),
      carePlans: t.Boolean(),
      vaccinationProtocols: t.Boolean(),
      groomingPriceRules: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const AnimalStrainOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      code: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      arName: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      enName: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      animalTypeId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      avgWeightMin: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      avgWeightMax: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      avgAgeMin: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      avgAgeMax: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      originCountry: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      isBrachycephalic: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      commonDiseases: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      isDefault: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clinicId: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const AnimalStrain = t.Composite(
  [AnimalStrainPlain, AnimalStrainRelations],
  { additionalProperties: false },
);

export const AnimalStrainInputCreate = t.Composite(
  [AnimalStrainPlainInputCreate, AnimalStrainRelationsInputCreate],
  { additionalProperties: false },
);

export const AnimalStrainInputUpdate = t.Composite(
  [AnimalStrainPlainInputUpdate, AnimalStrainRelationsInputUpdate],
  { additionalProperties: false },
);
