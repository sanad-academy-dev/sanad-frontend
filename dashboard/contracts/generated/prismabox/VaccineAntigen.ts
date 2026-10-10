import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const VaccineAntigenPlain = t.Object(
  { id: t.String(), vaccineId: t.String(), antigenCode: t.String() },
  { additionalProperties: false },
);

export const VaccineAntigenRelations = t.Object(
  {
    vaccine: t.Object(
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
  },
  { additionalProperties: false },
);

export const VaccineAntigenPlainInputCreate = t.Object(
  { antigenCode: t.String() },
  { additionalProperties: false },
);

export const VaccineAntigenPlainInputUpdate = t.Object(
  { antigenCode: t.Optional(t.String()) },
  { additionalProperties: false },
);

export const VaccineAntigenRelationsInputCreate = t.Object(
  {
    vaccine: t.Object(
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
  },
  { additionalProperties: false },
);

export const VaccineAntigenRelationsInputUpdate = t.Partial(
  t.Object(
    {
      vaccine: t.Object(
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
    },
    { additionalProperties: false },
  ),
);

export const VaccineAntigenWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          vaccineId: t.String(),
          antigenCode: t.String(),
        },
        { additionalProperties: false },
      ),
    { $id: "VaccineAntigen" },
  ),
);

export const VaccineAntigenWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            {
              id: t.String(),
              vaccineId_antigenCode: t.Object(
                { vaccineId: t.String(), antigenCode: t.String() },
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
              vaccineId_antigenCode: t.Object(
                { vaccineId: t.String(), antigenCode: t.String() },
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
            { id: t.String(), vaccineId: t.String(), antigenCode: t.String() },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "VaccineAntigen" },
);

export const VaccineAntigenSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      vaccineId: t.Boolean(),
      antigenCode: t.Boolean(),
      vaccine: t.Boolean(),
      antigen: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const VaccineAntigenInclude = t.Partial(
  t.Object(
    { vaccine: t.Boolean(), antigen: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const VaccineAntigenOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      vaccineId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      antigenCode: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const VaccineAntigen = t.Composite(
  [VaccineAntigenPlain, VaccineAntigenRelations],
  { additionalProperties: false },
);

export const VaccineAntigenInputCreate = t.Composite(
  [VaccineAntigenPlainInputCreate, VaccineAntigenRelationsInputCreate],
  { additionalProperties: false },
);

export const VaccineAntigenInputUpdate = t.Composite(
  [VaccineAntigenPlainInputUpdate, VaccineAntigenRelationsInputUpdate],
  { additionalProperties: false },
);
