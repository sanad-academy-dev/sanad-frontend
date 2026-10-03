import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const RadiologyExamExecutionPlain = t.Object(
  {
    id: t.String(),
    itemId: t.String(),
    machineId: __nullable__(t.String()),
    machineName: __nullable__(t.String()),
    roomName: __nullable__(t.String()),
    positioning: __nullable__(t.String()),
    sedationUsed: __nullable__(
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
    sedationAgent: __nullable__(t.String()),
    readyAt: __nullable__(t.Date()),
    performedById: __nullable__(t.String()),
    startedAt: __nullable__(t.Date()),
    finishedAt: __nullable__(t.Date()),
    viewsPerformed: t.Array(t.String(), { additionalProperties: false }),
    exposuresCount: __nullable__(t.Integer()),
    retakeCount: __nullable__(t.Integer()),
    kvp: __nullable__(t.Number()),
    mas: __nullable__(t.Number()),
    doseDap: __nullable__(t.Number()),
    ctdiVol: __nullable__(t.Number()),
    dlp: __nullable__(t.Number()),
    contrastUsed: __nullable__(t.Boolean()),
    contrastAgent: __nullable__(t.String()),
    contrastRoute: __nullable__(
      t.Union(
        [
          t.Literal("IV"),
          t.Literal("ORAL"),
          t.Literal("RECTAL"),
          t.Literal("INTRA_ARTICULAR"),
          t.Literal("OTHER"),
        ],
        { additionalProperties: false },
      ),
    ),
    contrastVolumeMl: __nullable__(t.Number()),
    contrastLot: __nullable__(t.String()),
    imageQuality: __nullable__(
      t.Union(
        [
          t.Literal("DIAGNOSTIC"),
          t.Literal("LIMITED"),
          t.Literal("NON_DIAGNOSTIC"),
        ],
        { additionalProperties: false },
      ),
    ),
    qcNotes: __nullable__(t.String()),
    executionNotes: __nullable__(t.String()),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  },
  { additionalProperties: false },
);

export const RadiologyExamExecutionRelations = t.Object(
  {
    item: t.Object(
      {
        id: t.String(),
        orderId: t.String(),
        serviceId: t.String(),
        accession: t.String(),
        priceSnapshot: t.Number(),
        status: t.Union(
          [
            t.Literal("QUEUE"),
            t.Literal("SCHEDULED"),
            t.Literal("PREPARATION"),
            t.Literal("IMAGING"),
            t.Literal("REPORTING"),
            t.Literal("UNDER_REVIEW"),
            t.Literal("COMPLETED"),
            t.Literal("CANCELLED"),
          ],
          { additionalProperties: false },
        ),
        stage: t.Union(
          [
            t.Literal("SAFETY_SCREENING"),
            t.Literal("PATIENT_PREP"),
            t.Literal("ROOM_ASSIGNMENT"),
            t.Literal("READY_CHECK"),
            t.Literal("ACQUISITION"),
            t.Literal("IMAGE_UPLOAD"),
            t.Literal("IMAGE_QC"),
          ],
          { additionalProperties: false },
        ),
        modality: t.Union(
          [
            t.Literal("XRAY"),
            t.Literal("CT"),
            t.Literal("MRI"),
            t.Literal("ULTRASOUND"),
            t.Literal("FLUOROSCOPY"),
            t.Literal("MAMMOGRAPHY"),
            t.Literal("NUCLEAR"),
            t.Literal("PET"),
            t.Literal("DENTAL"),
            t.Literal("OTHER"),
          ],
          { additionalProperties: false },
        ),
        bodyPart: __nullable__(t.String()),
        laterality: t.Union(
          [
            t.Literal("NONE"),
            t.Literal("LEFT"),
            t.Literal("RIGHT"),
            t.Literal("BILATERAL"),
          ],
          { additionalProperties: false },
        ),
        views: t.Array(t.String(), { additionalProperties: false }),
        withContrast: t.Boolean(),
        assignedToId: __nullable__(t.String()),
        scheduledAt: __nullable__(t.Date()),
        reviewedById: __nullable__(t.String()),
        reviewedAt: __nullable__(t.Date()),
        rejectedById: __nullable__(t.String()),
        rejectedAt: __nullable__(t.Date()),
        rejectionReason: __nullable__(t.String()),
        completedAt: __nullable__(t.Date()),
        paidAt: __nullable__(t.Date()),
        createdAt: t.Date(),
        updatedAt: t.Date(),
      },
      { additionalProperties: false },
    ),
    performedBy: __nullable__(
      t.Object(
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
    ),
  },
  { additionalProperties: false },
);

export const RadiologyExamExecutionPlainInputCreate = t.Object(
  {
    machineName: t.Optional(__nullable__(t.String())),
    roomName: t.Optional(__nullable__(t.String())),
    positioning: t.Optional(__nullable__(t.String())),
    sedationUsed: t.Optional(
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
    sedationAgent: t.Optional(__nullable__(t.String())),
    readyAt: t.Optional(__nullable__(t.Date())),
    startedAt: t.Optional(__nullable__(t.Date())),
    finishedAt: t.Optional(__nullable__(t.Date())),
    viewsPerformed: t.Optional(
      t.Array(t.String(), { additionalProperties: false }),
    ),
    exposuresCount: t.Optional(__nullable__(t.Integer())),
    retakeCount: t.Optional(__nullable__(t.Integer())),
    kvp: t.Optional(__nullable__(t.Number())),
    mas: t.Optional(__nullable__(t.Number())),
    doseDap: t.Optional(__nullable__(t.Number())),
    ctdiVol: t.Optional(__nullable__(t.Number())),
    dlp: t.Optional(__nullable__(t.Number())),
    contrastUsed: t.Optional(__nullable__(t.Boolean())),
    contrastAgent: t.Optional(__nullable__(t.String())),
    contrastRoute: t.Optional(
      __nullable__(
        t.Union(
          [
            t.Literal("IV"),
            t.Literal("ORAL"),
            t.Literal("RECTAL"),
            t.Literal("INTRA_ARTICULAR"),
            t.Literal("OTHER"),
          ],
          { additionalProperties: false },
        ),
      ),
    ),
    contrastVolumeMl: t.Optional(__nullable__(t.Number())),
    contrastLot: t.Optional(__nullable__(t.String())),
    imageQuality: t.Optional(
      __nullable__(
        t.Union(
          [
            t.Literal("DIAGNOSTIC"),
            t.Literal("LIMITED"),
            t.Literal("NON_DIAGNOSTIC"),
          ],
          { additionalProperties: false },
        ),
      ),
    ),
    qcNotes: t.Optional(__nullable__(t.String())),
    executionNotes: t.Optional(__nullable__(t.String())),
  },
  { additionalProperties: false },
);

export const RadiologyExamExecutionPlainInputUpdate = t.Object(
  {
    machineName: t.Optional(__nullable__(t.String())),
    roomName: t.Optional(__nullable__(t.String())),
    positioning: t.Optional(__nullable__(t.String())),
    sedationUsed: t.Optional(
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
    sedationAgent: t.Optional(__nullable__(t.String())),
    readyAt: t.Optional(__nullable__(t.Date())),
    startedAt: t.Optional(__nullable__(t.Date())),
    finishedAt: t.Optional(__nullable__(t.Date())),
    viewsPerformed: t.Optional(
      t.Array(t.String(), { additionalProperties: false }),
    ),
    exposuresCount: t.Optional(__nullable__(t.Integer())),
    retakeCount: t.Optional(__nullable__(t.Integer())),
    kvp: t.Optional(__nullable__(t.Number())),
    mas: t.Optional(__nullable__(t.Number())),
    doseDap: t.Optional(__nullable__(t.Number())),
    ctdiVol: t.Optional(__nullable__(t.Number())),
    dlp: t.Optional(__nullable__(t.Number())),
    contrastUsed: t.Optional(__nullable__(t.Boolean())),
    contrastAgent: t.Optional(__nullable__(t.String())),
    contrastRoute: t.Optional(
      __nullable__(
        t.Union(
          [
            t.Literal("IV"),
            t.Literal("ORAL"),
            t.Literal("RECTAL"),
            t.Literal("INTRA_ARTICULAR"),
            t.Literal("OTHER"),
          ],
          { additionalProperties: false },
        ),
      ),
    ),
    contrastVolumeMl: t.Optional(__nullable__(t.Number())),
    contrastLot: t.Optional(__nullable__(t.String())),
    imageQuality: t.Optional(
      __nullable__(
        t.Union(
          [
            t.Literal("DIAGNOSTIC"),
            t.Literal("LIMITED"),
            t.Literal("NON_DIAGNOSTIC"),
          ],
          { additionalProperties: false },
        ),
      ),
    ),
    qcNotes: t.Optional(__nullable__(t.String())),
    executionNotes: t.Optional(__nullable__(t.String())),
  },
  { additionalProperties: false },
);

export const RadiologyExamExecutionRelationsInputCreate = t.Object(
  {
    item: t.Object(
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
    performedBy: t.Optional(
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

export const RadiologyExamExecutionRelationsInputUpdate = t.Partial(
  t.Object(
    {
      item: t.Object(
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
      performedBy: t.Partial(
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

export const RadiologyExamExecutionWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          itemId: t.String(),
          machineId: t.String(),
          machineName: t.String(),
          roomName: t.String(),
          positioning: t.String(),
          sedationUsed: t.Union(
            [
              t.Literal("NONE"),
              t.Literal("ANXIOLYSIS"),
              t.Literal("SEDATION"),
              t.Literal("GENERAL_ANESTHESIA"),
            ],
            { additionalProperties: false },
          ),
          sedationAgent: t.String(),
          readyAt: t.Date(),
          performedById: t.String(),
          startedAt: t.Date(),
          finishedAt: t.Date(),
          viewsPerformed: t.Array(t.String(), { additionalProperties: false }),
          exposuresCount: t.Integer(),
          retakeCount: t.Integer(),
          kvp: t.Number(),
          mas: t.Number(),
          doseDap: t.Number(),
          ctdiVol: t.Number(),
          dlp: t.Number(),
          contrastUsed: t.Boolean(),
          contrastAgent: t.String(),
          contrastRoute: t.Union(
            [
              t.Literal("IV"),
              t.Literal("ORAL"),
              t.Literal("RECTAL"),
              t.Literal("INTRA_ARTICULAR"),
              t.Literal("OTHER"),
            ],
            { additionalProperties: false },
          ),
          contrastVolumeMl: t.Number(),
          contrastLot: t.String(),
          imageQuality: t.Union(
            [
              t.Literal("DIAGNOSTIC"),
              t.Literal("LIMITED"),
              t.Literal("NON_DIAGNOSTIC"),
            ],
            { additionalProperties: false },
          ),
          qcNotes: t.String(),
          executionNotes: t.String(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "RadiologyExamExecution" },
  ),
);

export const RadiologyExamExecutionWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.String(), itemId: t.String() },
            { additionalProperties: false },
          ),
          { additionalProperties: false },
        ),
        t.Union(
          [t.Object({ id: t.String() }), t.Object({ itemId: t.String() })],
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
              itemId: t.String(),
              machineId: t.String(),
              machineName: t.String(),
              roomName: t.String(),
              positioning: t.String(),
              sedationUsed: t.Union(
                [
                  t.Literal("NONE"),
                  t.Literal("ANXIOLYSIS"),
                  t.Literal("SEDATION"),
                  t.Literal("GENERAL_ANESTHESIA"),
                ],
                { additionalProperties: false },
              ),
              sedationAgent: t.String(),
              readyAt: t.Date(),
              performedById: t.String(),
              startedAt: t.Date(),
              finishedAt: t.Date(),
              viewsPerformed: t.Array(t.String(), {
                additionalProperties: false,
              }),
              exposuresCount: t.Integer(),
              retakeCount: t.Integer(),
              kvp: t.Number(),
              mas: t.Number(),
              doseDap: t.Number(),
              ctdiVol: t.Number(),
              dlp: t.Number(),
              contrastUsed: t.Boolean(),
              contrastAgent: t.String(),
              contrastRoute: t.Union(
                [
                  t.Literal("IV"),
                  t.Literal("ORAL"),
                  t.Literal("RECTAL"),
                  t.Literal("INTRA_ARTICULAR"),
                  t.Literal("OTHER"),
                ],
                { additionalProperties: false },
              ),
              contrastVolumeMl: t.Number(),
              contrastLot: t.String(),
              imageQuality: t.Union(
                [
                  t.Literal("DIAGNOSTIC"),
                  t.Literal("LIMITED"),
                  t.Literal("NON_DIAGNOSTIC"),
                ],
                { additionalProperties: false },
              ),
              qcNotes: t.String(),
              executionNotes: t.String(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "RadiologyExamExecution" },
);

export const RadiologyExamExecutionSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      itemId: t.Boolean(),
      machineId: t.Boolean(),
      machineName: t.Boolean(),
      roomName: t.Boolean(),
      positioning: t.Boolean(),
      sedationUsed: t.Boolean(),
      sedationAgent: t.Boolean(),
      readyAt: t.Boolean(),
      performedById: t.Boolean(),
      startedAt: t.Boolean(),
      finishedAt: t.Boolean(),
      viewsPerformed: t.Boolean(),
      exposuresCount: t.Boolean(),
      retakeCount: t.Boolean(),
      kvp: t.Boolean(),
      mas: t.Boolean(),
      doseDap: t.Boolean(),
      ctdiVol: t.Boolean(),
      dlp: t.Boolean(),
      contrastUsed: t.Boolean(),
      contrastAgent: t.Boolean(),
      contrastRoute: t.Boolean(),
      contrastVolumeMl: t.Boolean(),
      contrastLot: t.Boolean(),
      imageQuality: t.Boolean(),
      qcNotes: t.Boolean(),
      executionNotes: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      item: t.Boolean(),
      performedBy: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const RadiologyExamExecutionInclude = t.Partial(
  t.Object(
    {
      sedationUsed: t.Boolean(),
      contrastRoute: t.Boolean(),
      imageQuality: t.Boolean(),
      item: t.Boolean(),
      performedBy: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const RadiologyExamExecutionOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      itemId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      machineId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      machineName: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      roomName: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      positioning: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      sedationAgent: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      readyAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      performedById: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      startedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      finishedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      viewsPerformed: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      exposuresCount: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      retakeCount: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      kvp: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      mas: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      doseDap: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      ctdiVol: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      dlp: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      contrastUsed: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      contrastAgent: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      contrastVolumeMl: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      contrastLot: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      qcNotes: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      executionNotes: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const RadiologyExamExecution = t.Composite(
  [RadiologyExamExecutionPlain, RadiologyExamExecutionRelations],
  { additionalProperties: false },
);

export const RadiologyExamExecutionInputCreate = t.Composite(
  [
    RadiologyExamExecutionPlainInputCreate,
    RadiologyExamExecutionRelationsInputCreate,
  ],
  { additionalProperties: false },
);

export const RadiologyExamExecutionInputUpdate = t.Composite(
  [
    RadiologyExamExecutionPlainInputUpdate,
    RadiologyExamExecutionRelationsInputUpdate,
  ],
  { additionalProperties: false },
);
