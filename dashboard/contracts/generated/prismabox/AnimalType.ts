import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const AnimalTypePlain = t.Object(
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
);

export const AnimalTypeRelations = t.Object(
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
    strains: t.Array(
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
      { additionalProperties: false },
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
    mobileBookingRequests: t.Array(
      t.Object(
        {
          id: t.String(),
          code: t.String(),
          clinicId: t.String(),
          ownerName: t.String(),
          phone: t.String(),
          email: __nullable__(t.String()),
          ownerId: __nullable__(t.String()),
          addressLine: t.String(),
          district: __nullable__(t.String()),
          city: __nullable__(t.String()),
          lat: __nullable__(t.Number()),
          lng: __nullable__(t.Number()),
          landmark: __nullable__(t.String()),
          animalTypeId: __nullable__(t.String()),
          petName: __nullable__(t.String()),
          petNotes: __nullable__(t.String()),
          serviceIds: t.Array(t.String(), { additionalProperties: false }),
          preferredDate: __nullable__(t.Date()),
          preferredWindow: __nullable__(
            t.Union(
              [
                t.Literal("MORNING"),
                t.Literal("AFTERNOON"),
                t.Literal("EVENING"),
                t.Literal("ANY"),
              ],
              { additionalProperties: false },
            ),
          ),
          notes: __nullable__(t.String()),
          attachments: t.Array(t.String(), { additionalProperties: false }),
          status: t.Union(
            [
              t.Literal("NEW"),
              t.Literal("CONTACTED"),
              t.Literal("SCHEDULED"),
              t.Literal("REJECTED"),
              t.Literal("SPAM"),
            ],
            { additionalProperties: false },
          ),
          zoneId: __nullable__(t.String()),
          appointmentId: __nullable__(t.String()),
          handledById: __nullable__(t.String()),
          handledAt: __nullable__(t.Date()),
          rejectionReason: __nullable__(t.String()),
          ipHash: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    examTemplates: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: __nullable__(
            t.String({
              description: `null = قالب نظام تراه كل العيادات. الكاتب الوحيد لهذا الفرع هو الهجرات:
واجهة القوالب تملأ \`clinicId\` من الجلسة دائمًا، فلا تستطيع عيادة أن تُنشئ
قالب نظام. ولذلك لا قيد فرادة على صفوف النظام — Postgres يعدّ الـNULLات
متمايزة، و\`@@unique\` أدناه يغطّي قوالب العيادات وحدها. القيد الحقيقي على
صفوف النظام هو أن هجرة البذر وحدها تكتبها، وهي تُدرج بشرط عدم الوجود.`,
            }),
          ),
          key: t.String({
            description: `مفتاح ثابت مدى حياة القالب: GENERAL_V1 · VOMITING_V1 · DERM_V1`,
          }),
          version: t.Integer(),
          titleAr: t.String(),
          titleEn: __nullable__(t.String()),
          presentingComplaint: __nullable__(
            t.String({
              description: `الشكوى التي يبحث بها الطبيب عن القالب — «قيء» · «عرج»`,
            }),
          ),
          animalTypeId: __nullable__(
            t.String({
              description: `null = كل الأنواع. مفتاح أجنبي لا نصّ (القرار §11-B): القوالب بيانات تديرها
العيادة، والنصّ المكتوب خطأً يطابق لا شيء بصمت.`,
            }),
          ),
          blocks: t.Any({
            description: `ExamBlock[] — الوصف في §4 من الخطة، ويُتحقَّق منه بـTypeBox عند الكتابة.
كل كتلة تحمل قسمها S|O|A|P — وهذا وحده ما يجعله قالب SOAP لا بانيَ نماذج.`,
          }),
          isDefault: t.Boolean({
            description: `يُقترح تلقائيًا لهذه الشكوى/النوع (نمط \`RadiologyReportTemplate\`)`,
          }),
          active: t.Boolean(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `قالب فحص لكل شكوى — نظامي (\`clinicId = null\`) أو خاصّ بعيادة، ومُصدَّر.`,
        },
      ),
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const AnimalTypePlainInputCreate = t.Object(
  {
    code: t.Optional(__nullable__(t.String())),
    arName: t.String(),
    enName: t.String(),
    isDefault: t.Optional(t.Boolean()),
    species: t.Optional(
      __nullable__(
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
    ),
  },
  { additionalProperties: false },
);

export const AnimalTypePlainInputUpdate = t.Object(
  {
    code: t.Optional(__nullable__(t.String())),
    arName: t.Optional(t.String()),
    enName: t.Optional(t.String()),
    isDefault: t.Optional(t.Boolean()),
    species: t.Optional(
      __nullable__(
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
    ),
  },
  { additionalProperties: false },
);

export const AnimalTypeRelationsInputCreate = t.Object(
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
    strains: t.Optional(
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
    mobileBookingRequests: t.Optional(
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
    examTemplates: t.Optional(
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

export const AnimalTypeRelationsInputUpdate = t.Partial(
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
      strains: t.Partial(
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
      mobileBookingRequests: t.Partial(
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
      examTemplates: t.Partial(
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

export const AnimalTypeWhere = t.Partial(
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
          isDefault: t.Boolean(),
          clinicId: t.String(),
          createdAt: t.Date(),
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
        },
        { additionalProperties: false },
      ),
    { $id: "AnimalType" },
  ),
);

export const AnimalTypeWhereUnique = t.Recursive(
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
              isDefault: t.Boolean(),
              clinicId: t.String(),
              createdAt: t.Date(),
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
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "AnimalType" },
);

export const AnimalTypeSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      code: t.Boolean(),
      arName: t.Boolean(),
      enName: t.Boolean(),
      isDefault: t.Boolean(),
      clinicId: t.Boolean(),
      createdAt: t.Boolean(),
      species: t.Boolean(),
      clinic: t.Boolean(),
      strains: t.Boolean(),
      patients: t.Boolean(),
      carePlans: t.Boolean(),
      vaccinationProtocols: t.Boolean(),
      groomingPriceRules: t.Boolean(),
      mobileBookingRequests: t.Boolean(),
      examTemplates: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const AnimalTypeInclude = t.Partial(
  t.Object(
    {
      species: t.Boolean(),
      clinic: t.Boolean(),
      strains: t.Boolean(),
      patients: t.Boolean(),
      carePlans: t.Boolean(),
      vaccinationProtocols: t.Boolean(),
      groomingPriceRules: t.Boolean(),
      mobileBookingRequests: t.Boolean(),
      examTemplates: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const AnimalTypeOrderBy = t.Partial(
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
      isDefault: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clinicId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const AnimalType = t.Composite([AnimalTypePlain, AnimalTypeRelations], {
  additionalProperties: false,
});

export const AnimalTypeInputCreate = t.Composite(
  [AnimalTypePlainInputCreate, AnimalTypeRelationsInputCreate],
  { additionalProperties: false },
);

export const AnimalTypeInputUpdate = t.Composite(
  [AnimalTypePlainInputUpdate, AnimalTypeRelationsInputUpdate],
  { additionalProperties: false },
);
