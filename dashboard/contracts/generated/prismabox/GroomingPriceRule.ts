import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const GroomingPriceRulePlain = t.Object(
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
);

export const GroomingPriceRuleRelations = t.Object(
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
    definition: t.Object(
      {
        id: t.String(),
        clinicId: t.String(),
        serviceId: t.String(),
        kind: t.Union(
          [
            t.Literal("BATH"),
            t.Literal("FULL_GROOM"),
            t.Literal("TIDY_UP"),
            t.Literal("DESHED"),
            t.Literal("NAIL_TRIM"),
            t.Literal("EAR_CLEAN"),
            t.Literal("ANAL_GLANDS"),
            t.Literal("TEETH_BRUSH"),
            t.Literal("DEMATTING"),
            t.Literal("SHAVE_DOWN"),
            t.Literal("MEDICATED_BATH"),
            t.Literal("PARASITE_DIP"),
            t.Literal("WOUND_CARE_CLIP"),
            t.Literal("SPA_ADDON"),
            t.Literal("OTHER"),
          ],
          {
            additionalProperties: false,
            description: `نوع خدمة التجميل — يقود الأيقونة والافتراضات لا المنطق.`,
          },
        ),
        lane: t.Union([t.Literal("COSMETIC"), t.Literal("MEDICAL")], {
          additionalProperties: false,
          description: `مسار الجلسة — تجميلي أم طبي. يقرّر أي البوابات إلزامية وأي اللوحات تظهر (§3).`,
        }),
        requiresVetOrder: t.Boolean(),
        isAddOn: t.Boolean(),
        basePrice: t.Number(),
        baseDurationMin: t.Integer(),
        dryingMinutes: t.Integer(),
        speciesScope: t.Array(t.String(), { additionalProperties: false }),
        requiresStation: t.Boolean(),
        active: t.Boolean(),
        createdAt: t.Date(),
        updatedAt: t.Date(),
      },
      {
        additionalProperties: false,
        description: `تعريف خدمة تجميل — طبقة فوق عقدة ITEM في شجرة الخدمات، تمامًا كما يفعل
OperationProcedureDefinition. الشجرة تبقى عمود التسعير والصلاحيات، والجدول
هنا يحمل دلالات المجال.`,
      },
    ),
    animalType: __nullable__(
      t.Object(
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
    ),
    animalStrain: __nullable__(
      t.Object(
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
            t.Union(
              [t.Literal("LOW"), t.Literal("MEDIUM"), t.Literal("HIGH")],
              { additionalProperties: false },
            ),
          ),
          groomingNeeds: __nullable__(
            t.Union(
              [t.Literal("LOW"), t.Literal("MEDIUM"), t.Literal("HIGH")],
              { additionalProperties: false },
            ),
          ),
          isBrachycephalic: t.Boolean(),
          commonDiseases: t.Array(t.String(), { additionalProperties: false }),
          isDefault: t.Boolean(),
          clinicId: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    ),
  },
  {
    additionalProperties: false,
    description: `صفّ في مصفوفة السعر/المدة (§5). الأخصّ يفوز، وسُلَّم الحلّ مذكور في
grooming-pricing.service.ts ومختبَر رتبةً رتبة. الأعمدة الاختيارية هي أبعاد
المطابقة: NULL تعني «لا يقيّد هذا البعد».`,
  },
);

export const GroomingPriceRulePlainInputCreate = t.Object(
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
    price: t.Number(),
    durationMin: t.Integer(),
    dryingMinutes: t.Optional(__nullable__(t.Integer())),
  },
  {
    additionalProperties: false,
    description: `صفّ في مصفوفة السعر/المدة (§5). الأخصّ يفوز، وسُلَّم الحلّ مذكور في
grooming-pricing.service.ts ومختبَر رتبةً رتبة. الأعمدة الاختيارية هي أبعاد
المطابقة: NULL تعني «لا يقيّد هذا البعد».`,
  },
);

export const GroomingPriceRulePlainInputUpdate = t.Object(
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
    price: t.Optional(t.Number()),
    durationMin: t.Optional(t.Integer()),
    dryingMinutes: t.Optional(__nullable__(t.Integer())),
  },
  {
    additionalProperties: false,
    description: `صفّ في مصفوفة السعر/المدة (§5). الأخصّ يفوز، وسُلَّم الحلّ مذكور في
grooming-pricing.service.ts ومختبَر رتبةً رتبة. الأعمدة الاختيارية هي أبعاد
المطابقة: NULL تعني «لا يقيّد هذا البعد».`,
  },
);

export const GroomingPriceRuleRelationsInputCreate = t.Object(
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
    definition: t.Object(
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
    animalType: t.Optional(
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
    animalStrain: t.Optional(
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
    description: `صفّ في مصفوفة السعر/المدة (§5). الأخصّ يفوز، وسُلَّم الحلّ مذكور في
grooming-pricing.service.ts ومختبَر رتبةً رتبة. الأعمدة الاختيارية هي أبعاد
المطابقة: NULL تعني «لا يقيّد هذا البعد».`,
  },
);

export const GroomingPriceRuleRelationsInputUpdate = t.Partial(
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
      definition: t.Object(
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
      animalType: t.Partial(
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
      animalStrain: t.Partial(
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
      description: `صفّ في مصفوفة السعر/المدة (§5). الأخصّ يفوز، وسُلَّم الحلّ مذكور في
grooming-pricing.service.ts ومختبَر رتبةً رتبة. الأعمدة الاختيارية هي أبعاد
المطابقة: NULL تعني «لا يقيّد هذا البعد».`,
    },
  ),
);

export const GroomingPriceRuleWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          clinicId: t.String(),
          definitionId: t.String(),
          animalTypeId: t.String(),
          animalStrainId: t.String(),
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
          price: t.Number(),
          durationMin: t.Integer(),
          dryingMinutes: t.Integer(),
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
    { $id: "GroomingPriceRule" },
  ),
);

export const GroomingPriceRuleWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            {
              id: t.String(),
              definitionId_animalTypeId_animalStrainId_sizeBand_coatType:
                t.Object(
                  {
                    definitionId: t.String(),
                    animalTypeId: t.String(),
                    animalStrainId: t.String(),
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
                  },
                  { additionalProperties: false },
                ),
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
        t.Union(
          [
            t.Object({ id: t.String() }),
            t.Object({
              definitionId_animalTypeId_animalStrainId_sizeBand_coatType:
                t.Object(
                  {
                    definitionId: t.String(),
                    animalTypeId: t.String(),
                    animalStrainId: t.String(),
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
                  },
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
              clinicId: t.String(),
              definitionId: t.String(),
              animalTypeId: t.String(),
              animalStrainId: t.String(),
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
              price: t.Number(),
              durationMin: t.Integer(),
              dryingMinutes: t.Integer(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "GroomingPriceRule" },
);

export const GroomingPriceRuleSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      clinicId: t.Boolean(),
      definitionId: t.Boolean(),
      animalTypeId: t.Boolean(),
      animalStrainId: t.Boolean(),
      sizeBand: t.Boolean(),
      coatType: t.Boolean(),
      price: t.Boolean(),
      durationMin: t.Boolean(),
      dryingMinutes: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinic: t.Boolean(),
      definition: t.Boolean(),
      animalType: t.Boolean(),
      animalStrain: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `صفّ في مصفوفة السعر/المدة (§5). الأخصّ يفوز، وسُلَّم الحلّ مذكور في
grooming-pricing.service.ts ومختبَر رتبةً رتبة. الأعمدة الاختيارية هي أبعاد
المطابقة: NULL تعني «لا يقيّد هذا البعد».`,
    },
  ),
);

export const GroomingPriceRuleInclude = t.Partial(
  t.Object(
    {
      sizeBand: t.Boolean(),
      coatType: t.Boolean(),
      clinic: t.Boolean(),
      definition: t.Boolean(),
      animalType: t.Boolean(),
      animalStrain: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `صفّ في مصفوفة السعر/المدة (§5). الأخصّ يفوز، وسُلَّم الحلّ مذكور في
grooming-pricing.service.ts ومختبَر رتبةً رتبة. الأعمدة الاختيارية هي أبعاد
المطابقة: NULL تعني «لا يقيّد هذا البعد».`,
    },
  ),
);

export const GroomingPriceRuleOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clinicId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      definitionId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      animalTypeId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      animalStrainId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      price: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      durationMin: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      dryingMinutes: t.Union([t.Literal("asc"), t.Literal("desc")], {
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
      description: `صفّ في مصفوفة السعر/المدة (§5). الأخصّ يفوز، وسُلَّم الحلّ مذكور في
grooming-pricing.service.ts ومختبَر رتبةً رتبة. الأعمدة الاختيارية هي أبعاد
المطابقة: NULL تعني «لا يقيّد هذا البعد».`,
    },
  ),
);

export const GroomingPriceRule = t.Composite(
  [GroomingPriceRulePlain, GroomingPriceRuleRelations],
  { additionalProperties: false },
);

export const GroomingPriceRuleInputCreate = t.Composite(
  [GroomingPriceRulePlainInputCreate, GroomingPriceRuleRelationsInputCreate],
  { additionalProperties: false },
);

export const GroomingPriceRuleInputUpdate = t.Composite(
  [GroomingPriceRulePlainInputUpdate, GroomingPriceRuleRelationsInputUpdate],
  { additionalProperties: false },
);
