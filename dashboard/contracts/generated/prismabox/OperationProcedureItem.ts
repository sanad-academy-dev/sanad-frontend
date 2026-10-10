import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const OperationProcedureItemPlain = t.Object(
  {
    id: t.String(),
    caseId: t.String(),
    serviceId: t.String(),
    nameSnapshot: t.String(),
    priceSnapshot: t.Number(),
    tierSnapshot: t.Union(
      [t.Literal("MINOR"), t.Literal("INTERMEDIATE"), t.Literal("MAJOR")],
      { additionalProperties: false },
    ),
    anesthesiaSnapshot: t.Union(
      [
        t.Literal("NONE"),
        t.Literal("ANXIOLYSIS"),
        t.Literal("SEDATION"),
        t.Literal("GENERAL_ANESTHESIA"),
      ],
      { additionalProperties: false },
    ),
    laterality: t.Union(
      [
        t.Literal("NONE"),
        t.Literal("LEFT"),
        t.Literal("RIGHT"),
        t.Literal("BILATERAL"),
      ],
      { additionalProperties: false },
    ),
    site: __nullable__(t.String()),
    woundClass: __nullable__(
      t.Union(
        [
          t.Literal("CLEAN"),
          t.Literal("CLEAN_CONTAMINATED"),
          t.Literal("CONTAMINATED"),
          t.Literal("DIRTY"),
        ],
        { additionalProperties: false },
      ),
    ),
    performed: t.Boolean(),
    createdAt: t.Date(),
  },
  { additionalProperties: false },
);

export const OperationProcedureItemRelations = t.Object(
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
    service: t.Object(
      {
        id: t.String(),
        name: t.String(),
        level: t.Union(
          [t.Literal("CATEGORY"), t.Literal("SUBCATEGORY"), t.Literal("ITEM")],
          { additionalProperties: false },
        ),
        parentId: __nullable__(t.String()),
        isDefault: t.Boolean(),
        clinicId: __nullable__(t.String()),
        order: t.Integer(),
        isLabCategory: t.Boolean(),
        isRadiologyCategory: t.Boolean(),
        isOperationCategory: t.Boolean(),
        isGroomingCategory: t.Boolean(),
        consentCode: __nullable__(t.String()),
        createdAt: t.Date(),
      },
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const OperationProcedureItemPlainInputCreate = t.Object(
  {
    nameSnapshot: t.String(),
    priceSnapshot: t.Optional(t.Number()),
    tierSnapshot: t.Union(
      [t.Literal("MINOR"), t.Literal("INTERMEDIATE"), t.Literal("MAJOR")],
      { additionalProperties: false },
    ),
    anesthesiaSnapshot: t.Union(
      [
        t.Literal("NONE"),
        t.Literal("ANXIOLYSIS"),
        t.Literal("SEDATION"),
        t.Literal("GENERAL_ANESTHESIA"),
      ],
      { additionalProperties: false },
    ),
    laterality: t.Optional(
      t.Union(
        [
          t.Literal("NONE"),
          t.Literal("LEFT"),
          t.Literal("RIGHT"),
          t.Literal("BILATERAL"),
        ],
        { additionalProperties: false },
      ),
    ),
    site: t.Optional(__nullable__(t.String())),
    woundClass: t.Optional(
      __nullable__(
        t.Union(
          [
            t.Literal("CLEAN"),
            t.Literal("CLEAN_CONTAMINATED"),
            t.Literal("CONTAMINATED"),
            t.Literal("DIRTY"),
          ],
          { additionalProperties: false },
        ),
      ),
    ),
    performed: t.Optional(t.Boolean()),
  },
  { additionalProperties: false },
);

export const OperationProcedureItemPlainInputUpdate = t.Object(
  {
    nameSnapshot: t.Optional(t.String()),
    priceSnapshot: t.Optional(t.Number()),
    tierSnapshot: t.Optional(
      t.Union(
        [t.Literal("MINOR"), t.Literal("INTERMEDIATE"), t.Literal("MAJOR")],
        { additionalProperties: false },
      ),
    ),
    anesthesiaSnapshot: t.Optional(
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
    laterality: t.Optional(
      t.Union(
        [
          t.Literal("NONE"),
          t.Literal("LEFT"),
          t.Literal("RIGHT"),
          t.Literal("BILATERAL"),
        ],
        { additionalProperties: false },
      ),
    ),
    site: t.Optional(__nullable__(t.String())),
    woundClass: t.Optional(
      __nullable__(
        t.Union(
          [
            t.Literal("CLEAN"),
            t.Literal("CLEAN_CONTAMINATED"),
            t.Literal("CONTAMINATED"),
            t.Literal("DIRTY"),
          ],
          { additionalProperties: false },
        ),
      ),
    ),
    performed: t.Optional(t.Boolean()),
  },
  { additionalProperties: false },
);

export const OperationProcedureItemRelationsInputCreate = t.Object(
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
    service: t.Object(
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

export const OperationProcedureItemRelationsInputUpdate = t.Partial(
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
      service: t.Object(
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

export const OperationProcedureItemWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          caseId: t.String(),
          serviceId: t.String(),
          nameSnapshot: t.String(),
          priceSnapshot: t.Number(),
          tierSnapshot: t.Union(
            [t.Literal("MINOR"), t.Literal("INTERMEDIATE"), t.Literal("MAJOR")],
            { additionalProperties: false },
          ),
          anesthesiaSnapshot: t.Union(
            [
              t.Literal("NONE"),
              t.Literal("ANXIOLYSIS"),
              t.Literal("SEDATION"),
              t.Literal("GENERAL_ANESTHESIA"),
            ],
            { additionalProperties: false },
          ),
          laterality: t.Union(
            [
              t.Literal("NONE"),
              t.Literal("LEFT"),
              t.Literal("RIGHT"),
              t.Literal("BILATERAL"),
            ],
            { additionalProperties: false },
          ),
          site: t.String(),
          woundClass: t.Union(
            [
              t.Literal("CLEAN"),
              t.Literal("CLEAN_CONTAMINATED"),
              t.Literal("CONTAMINATED"),
              t.Literal("DIRTY"),
            ],
            { additionalProperties: false },
          ),
          performed: t.Boolean(),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "OperationProcedureItem" },
  ),
);

export const OperationProcedureItemWhereUnique = t.Recursive(
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
              serviceId: t.String(),
              nameSnapshot: t.String(),
              priceSnapshot: t.Number(),
              tierSnapshot: t.Union(
                [
                  t.Literal("MINOR"),
                  t.Literal("INTERMEDIATE"),
                  t.Literal("MAJOR"),
                ],
                { additionalProperties: false },
              ),
              anesthesiaSnapshot: t.Union(
                [
                  t.Literal("NONE"),
                  t.Literal("ANXIOLYSIS"),
                  t.Literal("SEDATION"),
                  t.Literal("GENERAL_ANESTHESIA"),
                ],
                { additionalProperties: false },
              ),
              laterality: t.Union(
                [
                  t.Literal("NONE"),
                  t.Literal("LEFT"),
                  t.Literal("RIGHT"),
                  t.Literal("BILATERAL"),
                ],
                { additionalProperties: false },
              ),
              site: t.String(),
              woundClass: t.Union(
                [
                  t.Literal("CLEAN"),
                  t.Literal("CLEAN_CONTAMINATED"),
                  t.Literal("CONTAMINATED"),
                  t.Literal("DIRTY"),
                ],
                { additionalProperties: false },
              ),
              performed: t.Boolean(),
              createdAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "OperationProcedureItem" },
);

export const OperationProcedureItemSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      caseId: t.Boolean(),
      serviceId: t.Boolean(),
      nameSnapshot: t.Boolean(),
      priceSnapshot: t.Boolean(),
      tierSnapshot: t.Boolean(),
      anesthesiaSnapshot: t.Boolean(),
      laterality: t.Boolean(),
      site: t.Boolean(),
      woundClass: t.Boolean(),
      performed: t.Boolean(),
      createdAt: t.Boolean(),
      case: t.Boolean(),
      service: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const OperationProcedureItemInclude = t.Partial(
  t.Object(
    {
      tierSnapshot: t.Boolean(),
      anesthesiaSnapshot: t.Boolean(),
      laterality: t.Boolean(),
      woundClass: t.Boolean(),
      case: t.Boolean(),
      service: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const OperationProcedureItemOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      caseId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      serviceId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      nameSnapshot: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      priceSnapshot: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      site: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      performed: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const OperationProcedureItem = t.Composite(
  [OperationProcedureItemPlain, OperationProcedureItemRelations],
  { additionalProperties: false },
);

export const OperationProcedureItemInputCreate = t.Composite(
  [
    OperationProcedureItemPlainInputCreate,
    OperationProcedureItemRelationsInputCreate,
  ],
  { additionalProperties: false },
);

export const OperationProcedureItemInputUpdate = t.Composite(
  [
    OperationProcedureItemPlainInputUpdate,
    OperationProcedureItemRelationsInputUpdate,
  ],
  { additionalProperties: false },
);
