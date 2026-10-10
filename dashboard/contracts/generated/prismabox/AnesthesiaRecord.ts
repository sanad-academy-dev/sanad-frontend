import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const AnesthesiaRecordPlain = t.Object(
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
);

export const AnesthesiaRecordRelations = t.Object(
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
    anesthetistStaff: __nullable__(
      t.Object(
        {
          id: t.String(),
          code: t.String(),
          clinicId: t.String(),
          userId: __nullable__(t.String()),
          roleId: t.String(),
          branchId: t.String(),
          name: t.String(),
          gender: __nullable__(
            t.Union(
              [t.Literal("MALE"), t.Literal("FEMALE"), t.Literal("UNKNOWN")],
              { additionalProperties: false },
            ),
          ),
          prefix: __nullable__(
            t.Union(
              [
                t.Literal("MR"),
                t.Literal("MRS"),
                t.Literal("MS"),
                t.Literal("DR"),
                t.Literal("PROF"),
              ],
              { additionalProperties: false },
            ),
          ),
          age: __nullable__(t.Integer()),
          licenseNumber: __nullable__(t.String()),
          email: t.String(),
          phone: __nullable__(t.String()),
          country: __nullable__(t.String()),
          city: __nullable__(t.String()),
          address: __nullable__(t.String()),
          notes: __nullable__(t.String()),
          bio: __nullable__(t.String()),
          educationalQualification: __nullable__(t.String()),
          nationality: __nullable__(t.String()),
          avatar: __nullable__(t.String()),
          primarySpecializationId: __nullable__(t.String()),
          secondarySpecializationId: __nullable__(t.String()),
          employmentType: __nullable__(
            t.Union([t.Literal("FULL_TIME"), t.Literal("PART_TIME")], {
              additionalProperties: false,
            }),
          ),
          hireDate: __nullable__(t.Date()),
          isSaudi: t.Boolean(),
          status: t.Union(
            [t.Literal("PENDING"), t.Literal("ACTIVE"), t.Literal("INACTIVE")],
            { additionalProperties: false },
          ),
          active: t.Boolean(),
          isDeleted: t.Boolean(),
          deletedAt: __nullable__(t.Date()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    ),
    events: t.Array(
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
      ),
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const AnesthesiaRecordPlainInputCreate = t.Object(
  {
    planned: t.Optional(
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
    actual: t.Optional(
      __nullable__(
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
    ),
    airway: t.Optional(__nullable__(t.String())),
    ettSize: t.Optional(__nullable__(t.String())),
    circuit: t.Optional(__nullable__(t.String())),
    ivAccess: t.Optional(__nullable__(t.String())),
    monitoringIntervalMin: t.Optional(t.Integer()),
    premedAt: t.Optional(__nullable__(t.Date())),
    inductionAt: t.Optional(__nullable__(t.Date())),
    incisionAt: t.Optional(__nullable__(t.Date())),
    closureAt: t.Optional(__nullable__(t.Date())),
    endAnesthesiaAt: t.Optional(__nullable__(t.Date())),
    extubationAt: t.Optional(__nullable__(t.Date())),
    notes: t.Optional(__nullable__(t.String())),
  },
  { additionalProperties: false },
);

export const AnesthesiaRecordPlainInputUpdate = t.Object(
  {
    planned: t.Optional(
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
    actual: t.Optional(
      __nullable__(
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
    ),
    airway: t.Optional(__nullable__(t.String())),
    ettSize: t.Optional(__nullable__(t.String())),
    circuit: t.Optional(__nullable__(t.String())),
    ivAccess: t.Optional(__nullable__(t.String())),
    monitoringIntervalMin: t.Optional(t.Integer()),
    premedAt: t.Optional(__nullable__(t.Date())),
    inductionAt: t.Optional(__nullable__(t.Date())),
    incisionAt: t.Optional(__nullable__(t.Date())),
    closureAt: t.Optional(__nullable__(t.Date())),
    endAnesthesiaAt: t.Optional(__nullable__(t.Date())),
    extubationAt: t.Optional(__nullable__(t.Date())),
    notes: t.Optional(__nullable__(t.String())),
  },
  { additionalProperties: false },
);

export const AnesthesiaRecordRelationsInputCreate = t.Object(
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
    anesthetistStaff: t.Optional(
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
    events: t.Optional(
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

export const AnesthesiaRecordRelationsInputUpdate = t.Partial(
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
      anesthetistStaff: t.Partial(
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
      events: t.Partial(
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

export const AnesthesiaRecordWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
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
          actual: t.Union(
            [
              t.Literal("NONE"),
              t.Literal("ANXIOLYSIS"),
              t.Literal("SEDATION"),
              t.Literal("GENERAL_ANESTHESIA"),
            ],
            { additionalProperties: false },
          ),
          airway: t.String(),
          ettSize: t.String(),
          circuit: t.String(),
          ivAccess: t.String(),
          monitoringIntervalMin: t.Integer(),
          premedAt: t.Date(),
          inductionAt: t.Date(),
          incisionAt: t.Date(),
          closureAt: t.Date(),
          endAnesthesiaAt: t.Date(),
          extubationAt: t.Date(),
          anesthetistStaffId: t.String(),
          notes: t.String(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "AnesthesiaRecord" },
  ),
);

export const AnesthesiaRecordWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.String(), caseId: t.String() },
            { additionalProperties: false },
          ),
          { additionalProperties: false },
        ),
        t.Union(
          [t.Object({ id: t.String() }), t.Object({ caseId: t.String() })],
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
              actual: t.Union(
                [
                  t.Literal("NONE"),
                  t.Literal("ANXIOLYSIS"),
                  t.Literal("SEDATION"),
                  t.Literal("GENERAL_ANESTHESIA"),
                ],
                { additionalProperties: false },
              ),
              airway: t.String(),
              ettSize: t.String(),
              circuit: t.String(),
              ivAccess: t.String(),
              monitoringIntervalMin: t.Integer(),
              premedAt: t.Date(),
              inductionAt: t.Date(),
              incisionAt: t.Date(),
              closureAt: t.Date(),
              endAnesthesiaAt: t.Date(),
              extubationAt: t.Date(),
              anesthetistStaffId: t.String(),
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
  { $id: "AnesthesiaRecord" },
);

export const AnesthesiaRecordSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      caseId: t.Boolean(),
      planned: t.Boolean(),
      actual: t.Boolean(),
      airway: t.Boolean(),
      ettSize: t.Boolean(),
      circuit: t.Boolean(),
      ivAccess: t.Boolean(),
      monitoringIntervalMin: t.Boolean(),
      premedAt: t.Boolean(),
      inductionAt: t.Boolean(),
      incisionAt: t.Boolean(),
      closureAt: t.Boolean(),
      endAnesthesiaAt: t.Boolean(),
      extubationAt: t.Boolean(),
      anesthetistStaffId: t.Boolean(),
      notes: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      case: t.Boolean(),
      anesthetistStaff: t.Boolean(),
      events: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const AnesthesiaRecordInclude = t.Partial(
  t.Object(
    {
      planned: t.Boolean(),
      actual: t.Boolean(),
      case: t.Boolean(),
      anesthetistStaff: t.Boolean(),
      events: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const AnesthesiaRecordOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      caseId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      airway: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      ettSize: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      circuit: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      ivAccess: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      monitoringIntervalMin: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      premedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      inductionAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      incisionAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      closureAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      endAnesthesiaAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      extubationAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      anesthetistStaffId: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const AnesthesiaRecord = t.Composite(
  [AnesthesiaRecordPlain, AnesthesiaRecordRelations],
  { additionalProperties: false },
);

export const AnesthesiaRecordInputCreate = t.Composite(
  [AnesthesiaRecordPlainInputCreate, AnesthesiaRecordRelationsInputCreate],
  { additionalProperties: false },
);

export const AnesthesiaRecordInputUpdate = t.Composite(
  [AnesthesiaRecordPlainInputUpdate, AnesthesiaRecordRelationsInputUpdate],
  { additionalProperties: false },
);
