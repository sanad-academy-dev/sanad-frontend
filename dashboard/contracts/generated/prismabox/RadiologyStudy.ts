import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const RadiologyStudyPlain = t.Object(
  {
    id: t.String(),
    itemId: t.String(),
    studyUid: t.String(),
    description: __nullable__(t.String()),
    studyDate: __nullable__(t.Date()),
    modality: __nullable__(
      t.Union(
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
    ),
    uploadedById: __nullable__(t.String()),
    createdAt: t.Date(),
  },
  { additionalProperties: false },
);

export const RadiologyStudyRelations = t.Object(
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
    uploadedBy: __nullable__(
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
    series: t.Array(
      t.Object(
        {
          id: t.String(),
          studyId: t.String(),
          seriesUid: t.String(),
          seriesNumber: __nullable__(t.Integer()),
          modalityCode: __nullable__(t.String()),
          description: __nullable__(t.String()),
          bodyPart: __nullable__(t.String()),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const RadiologyStudyPlainInputCreate = t.Object(
  {
    description: t.Optional(__nullable__(t.String())),
    studyDate: t.Optional(__nullable__(t.Date())),
    modality: t.Optional(
      __nullable__(
        t.Union(
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
      ),
    ),
  },
  { additionalProperties: false },
);

export const RadiologyStudyPlainInputUpdate = t.Object(
  {
    description: t.Optional(__nullable__(t.String())),
    studyDate: t.Optional(__nullable__(t.Date())),
    modality: t.Optional(
      __nullable__(
        t.Union(
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
      ),
    ),
  },
  { additionalProperties: false },
);

export const RadiologyStudyRelationsInputCreate = t.Object(
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
    uploadedBy: t.Optional(
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
    series: t.Optional(
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

export const RadiologyStudyRelationsInputUpdate = t.Partial(
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
      uploadedBy: t.Partial(
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
      series: t.Partial(
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

export const RadiologyStudyWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          itemId: t.String(),
          studyUid: t.String(),
          description: t.String(),
          studyDate: t.Date(),
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
          uploadedById: t.String(),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "RadiologyStudy" },
  ),
);

export const RadiologyStudyWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.String(), studyUid: t.String() },
            { additionalProperties: false },
          ),
          { additionalProperties: false },
        ),
        t.Union(
          [t.Object({ id: t.String() }), t.Object({ studyUid: t.String() })],
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
              studyUid: t.String(),
              description: t.String(),
              studyDate: t.Date(),
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
              uploadedById: t.String(),
              createdAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "RadiologyStudy" },
);

export const RadiologyStudySelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      itemId: t.Boolean(),
      studyUid: t.Boolean(),
      description: t.Boolean(),
      studyDate: t.Boolean(),
      modality: t.Boolean(),
      uploadedById: t.Boolean(),
      createdAt: t.Boolean(),
      item: t.Boolean(),
      uploadedBy: t.Boolean(),
      series: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const RadiologyStudyInclude = t.Partial(
  t.Object(
    {
      modality: t.Boolean(),
      item: t.Boolean(),
      uploadedBy: t.Boolean(),
      series: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const RadiologyStudyOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      itemId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      studyUid: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      description: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      studyDate: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      uploadedById: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const RadiologyStudy = t.Composite(
  [RadiologyStudyPlain, RadiologyStudyRelations],
  { additionalProperties: false },
);

export const RadiologyStudyInputCreate = t.Composite(
  [RadiologyStudyPlainInputCreate, RadiologyStudyRelationsInputCreate],
  { additionalProperties: false },
);

export const RadiologyStudyInputUpdate = t.Composite(
  [RadiologyStudyPlainInputUpdate, RadiologyStudyRelationsInputUpdate],
  { additionalProperties: false },
);
