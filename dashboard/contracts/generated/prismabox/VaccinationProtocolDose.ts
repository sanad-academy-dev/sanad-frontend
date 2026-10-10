import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const VaccinationProtocolDosePlain = t.Object(
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
);

export const VaccinationProtocolDoseRelations = t.Object(
  {
    protocol: t.Object(
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
    antigen: t.Object(
      {
        code: t.String(),
        nameEn: t.String(),
        nameAr: t.String(),
        noteAr: __nullable__(t.String()),
        order: t.Integer(),
        immunityOnsetDays: t.Integer(),
      },
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
    carePlanVisits: t.Array(
      t.Object(
        {
          id: t.String(),
          carePlanId: t.String(),
          order: t.Integer(),
          serviceId: __nullable__(t.String()),
          consultationTypeId: __nullable__(t.String()),
          durationMins: __nullable__(t.Integer()),
          details: __nullable__(t.String()),
          intervalUnit: t.Union([t.Literal("DAY"), t.Literal("WEEK")], {
            additionalProperties: false,
          }),
          intervalValue: t.Integer(),
          vaccinationProtocolDoseId: __nullable__(t.String()),
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

export const VaccinationProtocolDosePlainInputCreate = t.Object(
  {
    order: t.Integer(),
    antigenCode: t.String(),
    label: t.String(),
    kind: t.Optional(
      t.Union(
        [
          t.Literal("PRIMARY"),
          t.Literal("BOOSTER"),
          t.Literal("ANNUAL"),
          t.Literal("CATCH_UP"),
        ],
        { additionalProperties: false },
      ),
    ),
    ageWeeksMin: t.Optional(__nullable__(t.Integer())),
    ageWeeksMax: t.Optional(__nullable__(t.Integer())),
    intervalDaysFromPrev: t.Optional(__nullable__(t.Integer())),
    boosterIntervalDays: t.Optional(__nullable__(t.Integer())),
    notes: t.Optional(__nullable__(t.String())),
  },
  { additionalProperties: false },
);

export const VaccinationProtocolDosePlainInputUpdate = t.Object(
  {
    order: t.Optional(t.Integer()),
    antigenCode: t.Optional(t.String()),
    label: t.Optional(t.String()),
    kind: t.Optional(
      t.Union(
        [
          t.Literal("PRIMARY"),
          t.Literal("BOOSTER"),
          t.Literal("ANNUAL"),
          t.Literal("CATCH_UP"),
        ],
        { additionalProperties: false },
      ),
    ),
    ageWeeksMin: t.Optional(__nullable__(t.Integer())),
    ageWeeksMax: t.Optional(__nullable__(t.Integer())),
    intervalDaysFromPrev: t.Optional(__nullable__(t.Integer())),
    boosterIntervalDays: t.Optional(__nullable__(t.Integer())),
    notes: t.Optional(__nullable__(t.String())),
  },
  { additionalProperties: false },
);

export const VaccinationProtocolDoseRelationsInputCreate = t.Object(
  {
    protocol: t.Object(
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
    antigen: t.Object(
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
    carePlanVisits: t.Optional(
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

export const VaccinationProtocolDoseRelationsInputUpdate = t.Partial(
  t.Object(
    {
      protocol: t.Object(
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
      antigen: t.Object(
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
      carePlanVisits: t.Partial(
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

export const VaccinationProtocolDoseWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
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
          ageWeeksMin: t.Integer(),
          ageWeeksMax: t.Integer(),
          intervalDaysFromPrev: t.Integer(),
          boosterIntervalDays: t.Integer(),
          notes: t.String(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "VaccinationProtocolDose" },
  ),
);

export const VaccinationProtocolDoseWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            {
              id: t.String(),
              protocolId_order: t.Object(
                { protocolId: t.String(), order: t.Integer() },
                { additionalProperties: false },
              ),
            },
            { additionalProperties: false },
          ),
          { additionalProperties: false },
        ),
        t.Union(
          [
            t.Object({ id: t.String() }),
            t.Object({
              protocolId_order: t.Object(
                { protocolId: t.String(), order: t.Integer() },
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
              ageWeeksMin: t.Integer(),
              ageWeeksMax: t.Integer(),
              intervalDaysFromPrev: t.Integer(),
              boosterIntervalDays: t.Integer(),
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
  { $id: "VaccinationProtocolDose" },
);

export const VaccinationProtocolDoseSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      protocolId: t.Boolean(),
      order: t.Boolean(),
      antigenCode: t.Boolean(),
      label: t.Boolean(),
      kind: t.Boolean(),
      ageWeeksMin: t.Boolean(),
      ageWeeksMax: t.Boolean(),
      intervalDaysFromPrev: t.Boolean(),
      boosterIntervalDays: t.Boolean(),
      notes: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      protocol: t.Boolean(),
      antigen: t.Boolean(),
      records: t.Boolean(),
      carePlanVisits: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const VaccinationProtocolDoseInclude = t.Partial(
  t.Object(
    {
      kind: t.Boolean(),
      protocol: t.Boolean(),
      antigen: t.Boolean(),
      records: t.Boolean(),
      carePlanVisits: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const VaccinationProtocolDoseOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      protocolId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      order: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      antigenCode: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      label: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      ageWeeksMin: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      ageWeeksMax: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      intervalDaysFromPrev: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      boosterIntervalDays: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const VaccinationProtocolDose = t.Composite(
  [VaccinationProtocolDosePlain, VaccinationProtocolDoseRelations],
  { additionalProperties: false },
);

export const VaccinationProtocolDoseInputCreate = t.Composite(
  [
    VaccinationProtocolDosePlainInputCreate,
    VaccinationProtocolDoseRelationsInputCreate,
  ],
  { additionalProperties: false },
);

export const VaccinationProtocolDoseInputUpdate = t.Composite(
  [
    VaccinationProtocolDosePlainInputUpdate,
    VaccinationProtocolDoseRelationsInputUpdate,
  ],
  { additionalProperties: false },
);
