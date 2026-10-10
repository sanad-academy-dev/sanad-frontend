import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const AnesthesiaEventPlain = t.Object(
  {
    id: t.String(),
    recordId: t.String(),
    at: t.Date(),
    kind: t.Union(
      [
        t.Literal("DRUG"),
        t.Literal("ABX_PROPHYLAXIS"),
        t.Literal("FLUID"),
        t.Literal("POSITION"),
        t.Literal("EVENT"),
        t.Literal("NOTE"),
      ],
      { additionalProperties: false },
    ),
    inventoryItemId: __nullable__(t.String()),
    agentName: __nullable__(t.String()),
    dose: __nullable__(t.Number()),
    doseUnit: __nullable__(t.String()),
    route: __nullable__(
      t.Union(
        [
          t.Literal("IV"),
          t.Literal("IM"),
          t.Literal("SC"),
          t.Literal("PO"),
          t.Literal("INHALATION"),
          t.Literal("TOPICAL"),
          t.Literal("EPIDURAL"),
          t.Literal("OTHER"),
        ],
        { additionalProperties: false },
      ),
    ),
    detail: __nullable__(t.String()),
    recordedById: t.String(),
    createdAt: t.Date(),
  },
  { additionalProperties: false },
);

export const AnesthesiaEventRelations = t.Object(
  {
    record: t.Object(
      {
        id: t.String(),
        caseId: t.String(),
        planned: t.Union(
          [
            t.Literal("NONE"),
            t.Literal("ANXIOLYSIS"),
            t.Literal("SEDATION"),
            t.Literal("GENERAL_ANESTHESIA"),
          ],
          { additionalProperties: false },
        ),
        actual: __nullable__(
          t.Union(
            [
              t.Literal("NONE"),
              t.Literal("ANXIOLYSIS"),
              t.Literal("SEDATION"),
              t.Literal("GENERAL_ANESTHESIA"),
            ],
            { additionalProperties: false },
          ),
        ),
        airway: __nullable__(t.String()),
        ettSize: __nullable__(t.String()),
        circuit: __nullable__(t.String()),
        ivAccess: __nullable__(t.String()),
        monitoringIntervalMin: t.Integer(),
        premedAt: __nullable__(t.Date()),
        inductionAt: __nullable__(t.Date()),
        incisionAt: __nullable__(t.Date()),
        closureAt: __nullable__(t.Date()),
        endAnesthesiaAt: __nullable__(t.Date()),
        extubationAt: __nullable__(t.Date()),
        anesthetistStaffId: __nullable__(t.String()),
        notes: __nullable__(t.String()),
        createdAt: t.Date(),
        updatedAt: t.Date(),
      },
      { additionalProperties: false },
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
    recordedBy: t.Object(
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
  },
  { additionalProperties: false },
);

export const AnesthesiaEventPlainInputCreate = t.Object(
  {
    at: t.Date(),
    kind: t.Union(
      [
        t.Literal("DRUG"),
        t.Literal("ABX_PROPHYLAXIS"),
        t.Literal("FLUID"),
        t.Literal("POSITION"),
        t.Literal("EVENT"),
        t.Literal("NOTE"),
      ],
      { additionalProperties: false },
    ),
    agentName: t.Optional(__nullable__(t.String())),
    dose: t.Optional(__nullable__(t.Number())),
    doseUnit: t.Optional(__nullable__(t.String())),
    route: t.Optional(
      __nullable__(
        t.Union(
          [
            t.Literal("IV"),
            t.Literal("IM"),
            t.Literal("SC"),
            t.Literal("PO"),
            t.Literal("INHALATION"),
            t.Literal("TOPICAL"),
            t.Literal("EPIDURAL"),
            t.Literal("OTHER"),
          ],
          { additionalProperties: false },
        ),
      ),
    ),
    detail: t.Optional(__nullable__(t.String())),
  },
  { additionalProperties: false },
);

export const AnesthesiaEventPlainInputUpdate = t.Object(
  {
    at: t.Optional(t.Date()),
    kind: t.Optional(
      t.Union(
        [
          t.Literal("DRUG"),
          t.Literal("ABX_PROPHYLAXIS"),
          t.Literal("FLUID"),
          t.Literal("POSITION"),
          t.Literal("EVENT"),
          t.Literal("NOTE"),
        ],
        { additionalProperties: false },
      ),
    ),
    agentName: t.Optional(__nullable__(t.String())),
    dose: t.Optional(__nullable__(t.Number())),
    doseUnit: t.Optional(__nullable__(t.String())),
    route: t.Optional(
      __nullable__(
        t.Union(
          [
            t.Literal("IV"),
            t.Literal("IM"),
            t.Literal("SC"),
            t.Literal("PO"),
            t.Literal("INHALATION"),
            t.Literal("TOPICAL"),
            t.Literal("EPIDURAL"),
            t.Literal("OTHER"),
          ],
          { additionalProperties: false },
        ),
      ),
    ),
    detail: t.Optional(__nullable__(t.String())),
  },
  { additionalProperties: false },
);

export const AnesthesiaEventRelationsInputCreate = t.Object(
  {
    record: t.Object(
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
    recordedBy: t.Object(
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

export const AnesthesiaEventRelationsInputUpdate = t.Partial(
  t.Object(
    {
      record: t.Object(
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
      recordedBy: t.Object(
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

export const AnesthesiaEventWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          recordId: t.String(),
          at: t.Date(),
          kind: t.Union(
            [
              t.Literal("DRUG"),
              t.Literal("ABX_PROPHYLAXIS"),
              t.Literal("FLUID"),
              t.Literal("POSITION"),
              t.Literal("EVENT"),
              t.Literal("NOTE"),
            ],
            { additionalProperties: false },
          ),
          inventoryItemId: t.String(),
          agentName: t.String(),
          dose: t.Number(),
          doseUnit: t.String(),
          route: t.Union(
            [
              t.Literal("IV"),
              t.Literal("IM"),
              t.Literal("SC"),
              t.Literal("PO"),
              t.Literal("INHALATION"),
              t.Literal("TOPICAL"),
              t.Literal("EPIDURAL"),
              t.Literal("OTHER"),
            ],
            { additionalProperties: false },
          ),
          detail: t.String(),
          recordedById: t.String(),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "AnesthesiaEvent" },
  ),
);

export const AnesthesiaEventWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object({ id: t.String() }, { additionalProperties: false }),
          { additionalProperties: false },
        ),
        t.Union([t.Object({ id: t.String() })], {
          additionalProperties: false,
        }),
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
              recordId: t.String(),
              at: t.Date(),
              kind: t.Union(
                [
                  t.Literal("DRUG"),
                  t.Literal("ABX_PROPHYLAXIS"),
                  t.Literal("FLUID"),
                  t.Literal("POSITION"),
                  t.Literal("EVENT"),
                  t.Literal("NOTE"),
                ],
                { additionalProperties: false },
              ),
              inventoryItemId: t.String(),
              agentName: t.String(),
              dose: t.Number(),
              doseUnit: t.String(),
              route: t.Union(
                [
                  t.Literal("IV"),
                  t.Literal("IM"),
                  t.Literal("SC"),
                  t.Literal("PO"),
                  t.Literal("INHALATION"),
                  t.Literal("TOPICAL"),
                  t.Literal("EPIDURAL"),
                  t.Literal("OTHER"),
                ],
                { additionalProperties: false },
              ),
              detail: t.String(),
              recordedById: t.String(),
              createdAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "AnesthesiaEvent" },
);

export const AnesthesiaEventSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      recordId: t.Boolean(),
      at: t.Boolean(),
      kind: t.Boolean(),
      inventoryItemId: t.Boolean(),
      agentName: t.Boolean(),
      dose: t.Boolean(),
      doseUnit: t.Boolean(),
      route: t.Boolean(),
      detail: t.Boolean(),
      recordedById: t.Boolean(),
      createdAt: t.Boolean(),
      record: t.Boolean(),
      inventoryItem: t.Boolean(),
      recordedBy: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const AnesthesiaEventInclude = t.Partial(
  t.Object(
    {
      kind: t.Boolean(),
      route: t.Boolean(),
      record: t.Boolean(),
      inventoryItem: t.Boolean(),
      recordedBy: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const AnesthesiaEventOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      recordId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      at: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      inventoryItemId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      agentName: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      dose: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      doseUnit: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      detail: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      recordedById: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const AnesthesiaEvent = t.Composite(
  [AnesthesiaEventPlain, AnesthesiaEventRelations],
  { additionalProperties: false },
);

export const AnesthesiaEventInputCreate = t.Composite(
  [AnesthesiaEventPlainInputCreate, AnesthesiaEventRelationsInputCreate],
  { additionalProperties: false },
);

export const AnesthesiaEventInputUpdate = t.Composite(
  [AnesthesiaEventPlainInputUpdate, AnesthesiaEventRelationsInputUpdate],
  { additionalProperties: false },
);
