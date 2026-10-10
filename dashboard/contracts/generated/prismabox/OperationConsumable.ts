import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const OperationConsumablePlain = t.Object(
  {
    id: t.String(),
    caseId: t.String(),
    inventoryItemId: __nullable__(t.String()),
    nameSnapshot: t.String(),
    quantity: t.Integer(),
    priceSnapshot: t.Number(),
    type: t.Union(
      [t.Literal("KIT"), t.Literal("BURNED"), t.Literal("ADDITIONAL")],
      { additionalProperties: false },
    ),
    countedQuantity: __nullable__(t.Integer()),
    countNote: __nullable__(t.String()),
    issuedAt: __nullable__(t.Date()),
    createdAt: t.Date(),
  },
  { additionalProperties: false },
);

export const OperationConsumableRelations = t.Object(
  {
    case: t.Object(
      {
        id: t.String(),
        code: t.String(),
        clinicId: t.String(),
        branchId: t.String(),
        patientId: t.String(),
        ownerId: t.String(),
        appointmentId: __nullable__(t.String()),
        status: t.Union(
          [
            t.Literal("SCHEDULED"),
            t.Literal("PREP"),
            t.Literal("ANESTHESIA"),
            t.Literal("SURGERY"),
            t.Literal("RECOVERY"),
            t.Literal("DISCHARGE"),
            t.Literal("FOLLOW_UP"),
            t.Literal("COMPLETED"),
            t.Literal("CANCELLED"),
          ],
          { additionalProperties: false },
        ),
        stage: __nullable__(
          t.Union(
            [
              t.Literal("CONSENT"),
              t.Literal("FASTING_CHECK"),
              t.Literal("ASSESSMENT"),
              t.Literal("PREMED"),
              t.Literal("SIGN_IN"),
              t.Literal("INDUCTION"),
              t.Literal("MAINTENANCE"),
              t.Literal("TIME_OUT"),
              t.Literal("IN_PROGRESS"),
              t.Literal("CLOSING"),
              t.Literal("SIGN_OUT"),
              t.Literal("MONITORING"),
              t.Literal("READY_FOR_DISCHARGE"),
            ],
            { additionalProperties: false },
          ),
        ),
        tier: t.Union(
          [t.Literal("MINOR"), t.Literal("INTERMEDIATE"), t.Literal("MAJOR")],
          { additionalProperties: false },
        ),
        tierOverrideReason: __nullable__(t.String()),
        urgency: t.Union(
          [
            t.Literal("IMMEDIATE"),
            t.Literal("URGENT"),
            t.Literal("EXPEDITED"),
            t.Literal("ELECTIVE"),
          ],
          { additionalProperties: false },
        ),
        plannedAnesthesia: t.Union(
          [
            t.Literal("NONE"),
            t.Literal("ANXIOLYSIS"),
            t.Literal("SEDATION"),
            t.Literal("GENERAL_ANESTHESIA"),
          ],
          { additionalProperties: false },
        ),
        scheduledAt: __nullable__(t.Date()),
        estimatedDurationMin: t.Integer(),
        ssiSurveillanceUntil: __nullable__(t.Date()),
        roomId: __nullable__(t.String()),
        diagnosis: __nullable__(t.String()),
        clinicalSummary: __nullable__(t.String()),
        cancelKind: __nullable__(
          t.Union(
            [t.Literal("OWNER"), t.Literal("CLINIC"), t.Literal("CLINICAL")],
            { additionalProperties: false },
          ),
        ),
        cancelReason: __nullable__(t.String()),
        isDeleted: t.Boolean(),
        deletedAt: __nullable__(t.Date()),
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
  },
  { additionalProperties: false },
);

export const OperationConsumablePlainInputCreate = t.Object(
  {
    nameSnapshot: t.String(),
    quantity: t.Optional(t.Integer()),
    priceSnapshot: t.Optional(t.Number()),
    type: t.Optional(
      t.Union(
        [t.Literal("KIT"), t.Literal("BURNED"), t.Literal("ADDITIONAL")],
        { additionalProperties: false },
      ),
    ),
    countedQuantity: t.Optional(__nullable__(t.Integer())),
    countNote: t.Optional(__nullable__(t.String())),
    issuedAt: t.Optional(__nullable__(t.Date())),
  },
  { additionalProperties: false },
);

export const OperationConsumablePlainInputUpdate = t.Object(
  {
    nameSnapshot: t.Optional(t.String()),
    quantity: t.Optional(t.Integer()),
    priceSnapshot: t.Optional(t.Number()),
    type: t.Optional(
      t.Union(
        [t.Literal("KIT"), t.Literal("BURNED"), t.Literal("ADDITIONAL")],
        { additionalProperties: false },
      ),
    ),
    countedQuantity: t.Optional(__nullable__(t.Integer())),
    countNote: t.Optional(__nullable__(t.String())),
    issuedAt: t.Optional(__nullable__(t.Date())),
  },
  { additionalProperties: false },
);

export const OperationConsumableRelationsInputCreate = t.Object(
  {
    case: t.Object(
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
  },
  { additionalProperties: false },
);

export const OperationConsumableRelationsInputUpdate = t.Partial(
  t.Object(
    {
      case: t.Object(
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
    },
    { additionalProperties: false },
  ),
);

export const OperationConsumableWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          caseId: t.String(),
          inventoryItemId: t.String(),
          nameSnapshot: t.String(),
          quantity: t.Integer(),
          priceSnapshot: t.Number(),
          type: t.Union(
            [t.Literal("KIT"), t.Literal("BURNED"), t.Literal("ADDITIONAL")],
            { additionalProperties: false },
          ),
          countedQuantity: t.Integer(),
          countNote: t.String(),
          issuedAt: t.Date(),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "OperationConsumable" },
  ),
);

export const OperationConsumableWhereUnique = t.Recursive(
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
              caseId: t.String(),
              inventoryItemId: t.String(),
              nameSnapshot: t.String(),
              quantity: t.Integer(),
              priceSnapshot: t.Number(),
              type: t.Union(
                [
                  t.Literal("KIT"),
                  t.Literal("BURNED"),
                  t.Literal("ADDITIONAL"),
                ],
                { additionalProperties: false },
              ),
              countedQuantity: t.Integer(),
              countNote: t.String(),
              issuedAt: t.Date(),
              createdAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "OperationConsumable" },
);

export const OperationConsumableSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      caseId: t.Boolean(),
      inventoryItemId: t.Boolean(),
      nameSnapshot: t.Boolean(),
      quantity: t.Boolean(),
      priceSnapshot: t.Boolean(),
      type: t.Boolean(),
      countedQuantity: t.Boolean(),
      countNote: t.Boolean(),
      issuedAt: t.Boolean(),
      createdAt: t.Boolean(),
      case: t.Boolean(),
      inventoryItem: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const OperationConsumableInclude = t.Partial(
  t.Object(
    {
      type: t.Boolean(),
      case: t.Boolean(),
      inventoryItem: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const OperationConsumableOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      caseId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      inventoryItemId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      nameSnapshot: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      quantity: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      priceSnapshot: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      countedQuantity: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      countNote: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      issuedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const OperationConsumable = t.Composite(
  [OperationConsumablePlain, OperationConsumableRelations],
  { additionalProperties: false },
);

export const OperationConsumableInputCreate = t.Composite(
  [
    OperationConsumablePlainInputCreate,
    OperationConsumableRelationsInputCreate,
  ],
  { additionalProperties: false },
);

export const OperationConsumableInputUpdate = t.Composite(
  [
    OperationConsumablePlainInputUpdate,
    OperationConsumableRelationsInputUpdate,
  ],
  { additionalProperties: false },
);
