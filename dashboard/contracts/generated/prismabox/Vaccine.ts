import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const VaccinePlain = t.Object(
  {
    id: t.String(),
    code: t.String(),
    clinicId: t.String(),
    name: t.String(),
    nameEn: __nullable__(t.String()),
    kind: t.Union(
      [
        t.Literal("MODIFIED_LIVE"),
        t.Literal("KILLED"),
        t.Literal("RECOMBINANT"),
        t.Literal("TOXOID"),
        t.Literal("SUBUNIT"),
        t.Literal("OTHER"),
      ],
      { additionalProperties: false },
    ),
    manufacturerName: __nullable__(t.String()),
    catalogProductId: __nullable__(t.String()),
    inventoryItemId: __nullable__(t.String()),
    primarySeriesDoses: t.Integer(),
    primarySeriesIntervalDays: __nullable__(t.Integer()),
    boosterIntervalDays: __nullable__(t.Integer()),
    immunityOnsetDays: t.Integer(),
    defaultRoute: t.Union(
      [
        t.Literal("SUBCUTANEOUS"),
        t.Literal("INTRAMUSCULAR"),
        t.Literal("INTRANASAL"),
        t.Literal("ORAL"),
        t.Literal("INTRADERMAL"),
        t.Literal("TOPICAL"),
        t.Literal("OTHER"),
      ],
      { additionalProperties: false },
    ),
    defaultSite: __nullable__(
      t.Union(
        [
          t.Literal("LEFT_SHOULDER"),
          t.Literal("RIGHT_SHOULDER"),
          t.Literal("LEFT_HIND_LIMB"),
          t.Literal("RIGHT_HIND_LIMB"),
          t.Literal("INTERSCAPULAR"),
          t.Literal("LEFT_FLANK"),
          t.Literal("RIGHT_FLANK"),
          t.Literal("NASAL"),
          t.Literal("ORAL"),
          t.Literal("OTHER"),
        ],
        { additionalProperties: false },
      ),
    ),
    defaultDoseVolumeMl: __nullable__(t.Number()),
    notes: __nullable__(t.String()),
    active: t.Boolean(),
    isDeleted: t.Boolean(),
    deletedAt: __nullable__(t.Date()),
    editsCount: t.Integer(),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  },
  { additionalProperties: false },
);

export const VaccineRelations = t.Object(
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
    catalogProduct: __nullable__(
      t.Object(
        {
          id: t.String(),
          standardId: t.String(),
          registerNumber: t.String(),
          tradeName: t.String(),
          tradeNameAr: __nullable__(t.String()),
          genericName: t.String(),
          genericNameAr: __nullable__(t.String()),
          genericKey: t.String(),
          strength: __nullable__(t.String()),
          strengthUnit: __nullable__(t.String()),
          dosageForm: __nullable__(t.String()),
          routeOfAdministration: __nullable__(t.String()),
          packageType: __nullable__(t.String()),
          packageSize: __nullable__(t.String()),
          packageUnit: __nullable__(t.String()),
          drugType: __nullable__(t.String()),
          subType: __nullable__(t.String()),
          legalStatus: __nullable__(t.String()),
          authorizationStatus: __nullable__(t.String()),
          marketingStatus: __nullable__(t.String()),
          shelfLifeMonths: __nullable__(t.Integer()),
          storageConditions: __nullable__(t.String()),
          manufacturerName: __nullable__(t.String()),
          manufacturerCountry: __nullable__(t.String()),
          marketingCompany: __nullable__(t.String()),
          agentName: __nullable__(t.String()),
          atcVetCode: __nullable__(t.String()),
          distributionArea: __nullable__(t.String()),
          registrationYear: __nullable__(t.Integer()),
          withdrawalPeriod: __nullable__(t.String()),
          targetAnimalsRaw: __nullable__(t.String()),
          allSpecies: t.Boolean(),
          therapeuticClassCode: __nullable__(t.String()),
          searchText: t.String(),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    ),
    inventoryItem: __nullable__(
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
    antigens: t.Array(
      t.Object(
        { id: t.String(), vaccineId: t.String(), antigenCode: t.String() },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    species: t.Array(
      t.Object(
        {
          id: t.String(),
          vaccineId: t.String(),
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
      { additionalProperties: false },
    ),
    records: t.Array(
      t.Object(
        {
          id: t.String(),
          code: t.String(),
          clinicId: t.String(),
          patientId: t.String(),
          vaccineId: t.String(),
          appointmentId: __nullable__(t.String()),
          branchId: __nullable__(t.String()),
          administeredById: __nullable__(t.String()),
          administeredAt: t.Date(),
          doseNumber: t.Integer(),
          doseKind: t.Union(
            [
              t.Literal("PRIMARY"),
              t.Literal("BOOSTER"),
              t.Literal("ANNUAL"),
              t.Literal("CATCH_UP"),
            ],
            { additionalProperties: false },
          ),
          route: t.Union(
            [
              t.Literal("SUBCUTANEOUS"),
              t.Literal("INTRAMUSCULAR"),
              t.Literal("INTRANASAL"),
              t.Literal("ORAL"),
              t.Literal("INTRADERMAL"),
              t.Literal("TOPICAL"),
              t.Literal("OTHER"),
            ],
            { additionalProperties: false },
          ),
          site: __nullable__(
            t.Union(
              [
                t.Literal("LEFT_SHOULDER"),
                t.Literal("RIGHT_SHOULDER"),
                t.Literal("LEFT_HIND_LIMB"),
                t.Literal("RIGHT_HIND_LIMB"),
                t.Literal("INTERSCAPULAR"),
                t.Literal("LEFT_FLANK"),
                t.Literal("RIGHT_FLANK"),
                t.Literal("NASAL"),
                t.Literal("ORAL"),
                t.Literal("OTHER"),
              ],
              { additionalProperties: false },
            ),
          ),
          doseVolumeMl: __nullable__(t.Number()),
          batchId: __nullable__(t.String()),
          batchNo: __nullable__(t.String()),
          batchExpiryDate: __nullable__(t.Date()),
          inventoryItemId: __nullable__(t.String()),
          warehouseId: __nullable__(t.String()),
          vaccineNameSnapshot: t.String(),
          manufacturerSnapshot: __nullable__(t.String()),
          adverseReaction: t.Union(
            [
              t.Literal("NONE"),
              t.Literal("MILD"),
              t.Literal("MODERATE"),
              t.Literal("SEVERE"),
              t.Literal("ANAPHYLACTIC"),
            ],
            { additionalProperties: false },
          ),
          adverseReactionNotes: __nullable__(t.String()),
          notes: __nullable__(t.String()),
          immunityOnsetDaysSnapshot: __nullable__(t.Integer()),
          protectiveFromAt: __nullable__(t.Date()),
          boosterIntervalDaysSnapshot: __nullable__(t.Integer()),
          protectiveUntilAt: __nullable__(t.Date()),
          nextDueAt: __nullable__(t.Date()),
          protocolDoseId: __nullable__(t.String()),
          carePlanEnrollmentVisitId: __nullable__(t.String()),
          isVoided: t.Boolean(),
          voidedAt: __nullable__(t.Date()),
          voidedById: __nullable__(t.String()),
          voidReason: __nullable__(t.String()),
          createdById: __nullable__(t.String()),
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

export const VaccinePlainInputCreate = t.Object(
  {
    code: t.String(),
    name: t.String(),
    nameEn: t.Optional(__nullable__(t.String())),
    kind: t.Optional(
      t.Union(
        [
          t.Literal("MODIFIED_LIVE"),
          t.Literal("KILLED"),
          t.Literal("RECOMBINANT"),
          t.Literal("TOXOID"),
          t.Literal("SUBUNIT"),
          t.Literal("OTHER"),
        ],
        { additionalProperties: false },
      ),
    ),
    manufacturerName: t.Optional(__nullable__(t.String())),
    primarySeriesDoses: t.Optional(t.Integer()),
    primarySeriesIntervalDays: t.Optional(__nullable__(t.Integer())),
    boosterIntervalDays: t.Optional(__nullable__(t.Integer())),
    immunityOnsetDays: t.Optional(t.Integer()),
    defaultRoute: t.Optional(
      t.Union(
        [
          t.Literal("SUBCUTANEOUS"),
          t.Literal("INTRAMUSCULAR"),
          t.Literal("INTRANASAL"),
          t.Literal("ORAL"),
          t.Literal("INTRADERMAL"),
          t.Literal("TOPICAL"),
          t.Literal("OTHER"),
        ],
        { additionalProperties: false },
      ),
    ),
    defaultSite: t.Optional(
      __nullable__(
        t.Union(
          [
            t.Literal("LEFT_SHOULDER"),
            t.Literal("RIGHT_SHOULDER"),
            t.Literal("LEFT_HIND_LIMB"),
            t.Literal("RIGHT_HIND_LIMB"),
            t.Literal("INTERSCAPULAR"),
            t.Literal("LEFT_FLANK"),
            t.Literal("RIGHT_FLANK"),
            t.Literal("NASAL"),
            t.Literal("ORAL"),
            t.Literal("OTHER"),
          ],
          { additionalProperties: false },
        ),
      ),
    ),
    defaultDoseVolumeMl: t.Optional(__nullable__(t.Number())),
    notes: t.Optional(__nullable__(t.String())),
    active: t.Optional(t.Boolean()),
    isDeleted: t.Optional(t.Boolean()),
    deletedAt: t.Optional(__nullable__(t.Date())),
    editsCount: t.Optional(t.Integer()),
  },
  { additionalProperties: false },
);

export const VaccinePlainInputUpdate = t.Object(
  {
    code: t.Optional(t.String()),
    name: t.Optional(t.String()),
    nameEn: t.Optional(__nullable__(t.String())),
    kind: t.Optional(
      t.Union(
        [
          t.Literal("MODIFIED_LIVE"),
          t.Literal("KILLED"),
          t.Literal("RECOMBINANT"),
          t.Literal("TOXOID"),
          t.Literal("SUBUNIT"),
          t.Literal("OTHER"),
        ],
        { additionalProperties: false },
      ),
    ),
    manufacturerName: t.Optional(__nullable__(t.String())),
    primarySeriesDoses: t.Optional(t.Integer()),
    primarySeriesIntervalDays: t.Optional(__nullable__(t.Integer())),
    boosterIntervalDays: t.Optional(__nullable__(t.Integer())),
    immunityOnsetDays: t.Optional(t.Integer()),
    defaultRoute: t.Optional(
      t.Union(
        [
          t.Literal("SUBCUTANEOUS"),
          t.Literal("INTRAMUSCULAR"),
          t.Literal("INTRANASAL"),
          t.Literal("ORAL"),
          t.Literal("INTRADERMAL"),
          t.Literal("TOPICAL"),
          t.Literal("OTHER"),
        ],
        { additionalProperties: false },
      ),
    ),
    defaultSite: t.Optional(
      __nullable__(
        t.Union(
          [
            t.Literal("LEFT_SHOULDER"),
            t.Literal("RIGHT_SHOULDER"),
            t.Literal("LEFT_HIND_LIMB"),
            t.Literal("RIGHT_HIND_LIMB"),
            t.Literal("INTERSCAPULAR"),
            t.Literal("LEFT_FLANK"),
            t.Literal("RIGHT_FLANK"),
            t.Literal("NASAL"),
            t.Literal("ORAL"),
            t.Literal("OTHER"),
          ],
          { additionalProperties: false },
        ),
      ),
    ),
    defaultDoseVolumeMl: t.Optional(__nullable__(t.Number())),
    notes: t.Optional(__nullable__(t.String())),
    active: t.Optional(t.Boolean()),
    isDeleted: t.Optional(t.Boolean()),
    deletedAt: t.Optional(__nullable__(t.Date())),
    editsCount: t.Optional(t.Integer()),
  },
  { additionalProperties: false },
);

export const VaccineRelationsInputCreate = t.Object(
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
    catalogProduct: t.Optional(
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
    inventoryItem: t.Optional(
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
    antigens: t.Optional(
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
    species: t.Optional(
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
    records: t.Optional(
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

export const VaccineRelationsInputUpdate = t.Partial(
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
      catalogProduct: t.Partial(
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
      inventoryItem: t.Partial(
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
      antigens: t.Partial(
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
      species: t.Partial(
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
      records: t.Partial(
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

export const VaccineWhere = t.Partial(
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
          kind: t.Union(
            [
              t.Literal("MODIFIED_LIVE"),
              t.Literal("KILLED"),
              t.Literal("RECOMBINANT"),
              t.Literal("TOXOID"),
              t.Literal("SUBUNIT"),
              t.Literal("OTHER"),
            ],
            { additionalProperties: false },
          ),
          manufacturerName: t.String(),
          catalogProductId: t.String(),
          inventoryItemId: t.String(),
          primarySeriesDoses: t.Integer(),
          primarySeriesIntervalDays: t.Integer(),
          boosterIntervalDays: t.Integer(),
          immunityOnsetDays: t.Integer(),
          defaultRoute: t.Union(
            [
              t.Literal("SUBCUTANEOUS"),
              t.Literal("INTRAMUSCULAR"),
              t.Literal("INTRANASAL"),
              t.Literal("ORAL"),
              t.Literal("INTRADERMAL"),
              t.Literal("TOPICAL"),
              t.Literal("OTHER"),
            ],
            { additionalProperties: false },
          ),
          defaultSite: t.Union(
            [
              t.Literal("LEFT_SHOULDER"),
              t.Literal("RIGHT_SHOULDER"),
              t.Literal("LEFT_HIND_LIMB"),
              t.Literal("RIGHT_HIND_LIMB"),
              t.Literal("INTERSCAPULAR"),
              t.Literal("LEFT_FLANK"),
              t.Literal("RIGHT_FLANK"),
              t.Literal("NASAL"),
              t.Literal("ORAL"),
              t.Literal("OTHER"),
            ],
            { additionalProperties: false },
          ),
          defaultDoseVolumeMl: t.Number(),
          notes: t.String(),
          active: t.Boolean(),
          isDeleted: t.Boolean(),
          deletedAt: t.Date(),
          editsCount: t.Integer(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "Vaccine" },
  ),
);

export const VaccineWhereUnique = t.Recursive(
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
              kind: t.Union(
                [
                  t.Literal("MODIFIED_LIVE"),
                  t.Literal("KILLED"),
                  t.Literal("RECOMBINANT"),
                  t.Literal("TOXOID"),
                  t.Literal("SUBUNIT"),
                  t.Literal("OTHER"),
                ],
                { additionalProperties: false },
              ),
              manufacturerName: t.String(),
              catalogProductId: t.String(),
              inventoryItemId: t.String(),
              primarySeriesDoses: t.Integer(),
              primarySeriesIntervalDays: t.Integer(),
              boosterIntervalDays: t.Integer(),
              immunityOnsetDays: t.Integer(),
              defaultRoute: t.Union(
                [
                  t.Literal("SUBCUTANEOUS"),
                  t.Literal("INTRAMUSCULAR"),
                  t.Literal("INTRANASAL"),
                  t.Literal("ORAL"),
                  t.Literal("INTRADERMAL"),
                  t.Literal("TOPICAL"),
                  t.Literal("OTHER"),
                ],
                { additionalProperties: false },
              ),
              defaultSite: t.Union(
                [
                  t.Literal("LEFT_SHOULDER"),
                  t.Literal("RIGHT_SHOULDER"),
                  t.Literal("LEFT_HIND_LIMB"),
                  t.Literal("RIGHT_HIND_LIMB"),
                  t.Literal("INTERSCAPULAR"),
                  t.Literal("LEFT_FLANK"),
                  t.Literal("RIGHT_FLANK"),
                  t.Literal("NASAL"),
                  t.Literal("ORAL"),
                  t.Literal("OTHER"),
                ],
                { additionalProperties: false },
              ),
              defaultDoseVolumeMl: t.Number(),
              notes: t.String(),
              active: t.Boolean(),
              isDeleted: t.Boolean(),
              deletedAt: t.Date(),
              editsCount: t.Integer(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "Vaccine" },
);

export const VaccineSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      code: t.Boolean(),
      clinicId: t.Boolean(),
      name: t.Boolean(),
      nameEn: t.Boolean(),
      kind: t.Boolean(),
      manufacturerName: t.Boolean(),
      catalogProductId: t.Boolean(),
      inventoryItemId: t.Boolean(),
      primarySeriesDoses: t.Boolean(),
      primarySeriesIntervalDays: t.Boolean(),
      boosterIntervalDays: t.Boolean(),
      immunityOnsetDays: t.Boolean(),
      defaultRoute: t.Boolean(),
      defaultSite: t.Boolean(),
      defaultDoseVolumeMl: t.Boolean(),
      notes: t.Boolean(),
      active: t.Boolean(),
      isDeleted: t.Boolean(),
      deletedAt: t.Boolean(),
      editsCount: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinic: t.Boolean(),
      catalogProduct: t.Boolean(),
      inventoryItem: t.Boolean(),
      antigens: t.Boolean(),
      species: t.Boolean(),
      records: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const VaccineInclude = t.Partial(
  t.Object(
    {
      kind: t.Boolean(),
      defaultRoute: t.Boolean(),
      defaultSite: t.Boolean(),
      clinic: t.Boolean(),
      catalogProduct: t.Boolean(),
      inventoryItem: t.Boolean(),
      antigens: t.Boolean(),
      species: t.Boolean(),
      records: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const VaccineOrderBy = t.Partial(
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
      manufacturerName: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      catalogProductId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      inventoryItemId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      primarySeriesDoses: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      primarySeriesIntervalDays: t.Union(
        [t.Literal("asc"), t.Literal("desc")],
        { additionalProperties: false },
      ),
      boosterIntervalDays: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      immunityOnsetDays: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      defaultDoseVolumeMl: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      notes: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      active: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      isDeleted: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      deletedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      editsCount: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const Vaccine = t.Composite([VaccinePlain, VaccineRelations], {
  additionalProperties: false,
});

export const VaccineInputCreate = t.Composite(
  [VaccinePlainInputCreate, VaccineRelationsInputCreate],
  { additionalProperties: false },
);

export const VaccineInputUpdate = t.Composite(
  [VaccinePlainInputUpdate, VaccineRelationsInputUpdate],
  { additionalProperties: false },
);
