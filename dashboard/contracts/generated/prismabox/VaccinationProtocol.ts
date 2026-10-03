import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const VaccinationProtocolPlain = t.Object(
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
);

export const VaccinationProtocolRelations = t.Object(
  {
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
    doses: t.Array(
      t.Object(
        {
          id: t.String(),
          protocolId: t.String(),
          order: t.Integer(),
          antigenCode: t.String(),
          label: t.String(),
          kind: t.Union(
            [
              t.Literal("PRIMARY"),
              t.Literal("BOOSTER"),
              t.Literal("ANNUAL"),
              t.Literal("CATCH_UP"),
            ],
            { additionalProperties: false },
          ),
          ageWeeksMin: __nullable__(t.Integer()),
          ageWeeksMax: __nullable__(t.Integer()),
          intervalDaysFromPrev: __nullable__(t.Integer()),
          boosterIntervalDays: __nullable__(t.Integer()),
          notes: __nullable__(t.String()),
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

export const VaccinationProtocolPlainInputCreate = t.Object(
  {
    code: t.String(),
    name: t.String(),
    nameEn: t.Optional(__nullable__(t.String())),
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
    isCore: t.Optional(t.Boolean()),
    isDefault: t.Optional(t.Boolean()),
    active: t.Optional(t.Boolean()),
    notes: t.Optional(__nullable__(t.String())),
  },
  { additionalProperties: false },
);

export const VaccinationProtocolPlainInputUpdate = t.Object(
  {
    code: t.Optional(t.String()),
    name: t.Optional(t.String()),
    nameEn: t.Optional(__nullable__(t.String())),
    species: t.Optional(
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
    isCore: t.Optional(t.Boolean()),
    isDefault: t.Optional(t.Boolean()),
    active: t.Optional(t.Boolean()),
    notes: t.Optional(__nullable__(t.String())),
  },
  { additionalProperties: false },
);

export const VaccinationProtocolRelationsInputCreate = t.Object(
  {
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
    doses: t.Optional(
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

export const VaccinationProtocolRelationsInputUpdate = t.Partial(
  t.Object(
    {
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
      doses: t.Partial(
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

export const VaccinationProtocolWhere = t.Partial(
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
          nameEn: t.String(),
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
          animalTypeId: t.String(),
          animalStrainId: t.String(),
          isCore: t.Boolean(),
          isDefault: t.Boolean(),
          active: t.Boolean(),
          notes: t.String(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "VaccinationProtocol" },
  ),
);

export const VaccinationProtocolWhereUnique = t.Recursive(
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
              nameEn: t.String(),
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
              animalTypeId: t.String(),
              animalStrainId: t.String(),
              isCore: t.Boolean(),
              isDefault: t.Boolean(),
              active: t.Boolean(),
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
  { $id: "VaccinationProtocol" },
);

export const VaccinationProtocolSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      code: t.Boolean(),
      clinicId: t.Boolean(),
      name: t.Boolean(),
      nameEn: t.Boolean(),
      species: t.Boolean(),
      animalTypeId: t.Boolean(),
      animalStrainId: t.Boolean(),
      isCore: t.Boolean(),
      isDefault: t.Boolean(),
      active: t.Boolean(),
      notes: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinic: t.Boolean(),
      animalType: t.Boolean(),
      animalStrain: t.Boolean(),
      doses: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const VaccinationProtocolInclude = t.Partial(
  t.Object(
    {
      species: t.Boolean(),
      clinic: t.Boolean(),
      animalType: t.Boolean(),
      animalStrain: t.Boolean(),
      doses: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const VaccinationProtocolOrderBy = t.Partial(
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
      nameEn: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      animalTypeId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      animalStrainId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      isCore: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      isDefault: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      active: t.Union([t.Literal("asc"), t.Literal("desc")], {
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
    { additionalProperties: false },
  ),
);

export const VaccinationProtocol = t.Composite(
  [VaccinationProtocolPlain, VaccinationProtocolRelations],
  { additionalProperties: false },
);

export const VaccinationProtocolInputCreate = t.Composite(
  [
    VaccinationProtocolPlainInputCreate,
    VaccinationProtocolRelationsInputCreate,
  ],
  { additionalProperties: false },
);

export const VaccinationProtocolInputUpdate = t.Composite(
  [
    VaccinationProtocolPlainInputUpdate,
    VaccinationProtocolRelationsInputUpdate,
  ],
  { additionalProperties: false },
);
