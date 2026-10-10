import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const CourseCompletionSettingsPlain = t.Object(
  {
    id: t.String(),
    courseId: t.String(),
    certificateEnabled: t.Boolean(),
    certReferencePattern: __nullable__(t.String()),
    certValidityDays: __nullable__(t.Integer()),
    certSignatureName: __nullable__(t.String()),
    certPassMark: __nullable__(t.Integer()),
    reEnrollMode: t.Union(
      [
        t.Literal("NONE"),
        t.Literal("AFTER_COMPLETION"),
        t.Literal("BEFORE_EXPIRY"),
      ],
      { additionalProperties: false },
    ),
    reEnrollDays: __nullable__(t.Integer()),
    gamificationPoints: t.Integer(),
    reviewEnabled: t.Boolean(),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  },
  { additionalProperties: false },
);

export const CourseCompletionSettingsRelations = t.Object(
  {
    course: t.Object(
      {
        id: t.String(),
        code: t.String(),
        clinicId: t.String(),
        name: t.String(),
        department: t.String(),
        targetRoleId: __nullable__(t.String()),
        type: t.Union(
          [
            t.Literal("INTERNAL"),
            t.Literal("WORKSHOP"),
            t.Literal("ONLINE"),
            t.Literal("CERTIFICATION"),
            t.Literal("CONFERENCE"),
          ],
          { additionalProperties: false },
        ),
        description: __nullable__(t.String()),
        coverKey: __nullable__(t.String()),
        status: t.Union(
          [t.Literal("DRAFT"), t.Literal("PUBLISHED"), t.Literal("ARCHIVED")],
          { additionalProperties: false },
        ),
        category: __nullable__(t.String()),
        priority: t.Union([t.Literal("URGENT"), t.Literal("NORMAL")], {
          additionalProperties: false,
        }),
        estimatedDurationWeeks: __nullable__(t.Integer()),
        language: t.Union([t.Literal("AR"), t.Literal("EN")], {
          additionalProperties: false,
        }),
        orderMode: t.Union([t.Literal("SEQUENTIAL"), t.Literal("FREE")], {
          additionalProperties: false,
        }),
        trainingCost: __nullable__(t.Integer()),
        institution: __nullable__(t.String()),
        locationMode: __nullable__(
          t.Union(
            [t.Literal("ONSITE"), t.Literal("ONLINE"), t.Literal("HYBRID")],
            { additionalProperties: false },
          ),
        ),
        startDate: __nullable__(t.Date()),
        dueDate: __nullable__(t.Date()),
        timezone: __nullable__(t.String()),
        editsCount: t.Integer(),
        createdAt: t.Date(),
        updatedAt: t.Date(),
      },
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const CourseCompletionSettingsPlainInputCreate = t.Object(
  {
    certificateEnabled: t.Optional(t.Boolean()),
    certReferencePattern: t.Optional(__nullable__(t.String())),
    certValidityDays: t.Optional(__nullable__(t.Integer())),
    certSignatureName: t.Optional(__nullable__(t.String())),
    certPassMark: t.Optional(__nullable__(t.Integer())),
    reEnrollMode: t.Optional(
      t.Union(
        [
          t.Literal("NONE"),
          t.Literal("AFTER_COMPLETION"),
          t.Literal("BEFORE_EXPIRY"),
        ],
        { additionalProperties: false },
      ),
    ),
    reEnrollDays: t.Optional(__nullable__(t.Integer())),
    gamificationPoints: t.Optional(t.Integer()),
    reviewEnabled: t.Optional(t.Boolean()),
  },
  { additionalProperties: false },
);

export const CourseCompletionSettingsPlainInputUpdate = t.Object(
  {
    certificateEnabled: t.Optional(t.Boolean()),
    certReferencePattern: t.Optional(__nullable__(t.String())),
    certValidityDays: t.Optional(__nullable__(t.Integer())),
    certSignatureName: t.Optional(__nullable__(t.String())),
    certPassMark: t.Optional(__nullable__(t.Integer())),
    reEnrollMode: t.Optional(
      t.Union(
        [
          t.Literal("NONE"),
          t.Literal("AFTER_COMPLETION"),
          t.Literal("BEFORE_EXPIRY"),
        ],
        { additionalProperties: false },
      ),
    ),
    reEnrollDays: t.Optional(__nullable__(t.Integer())),
    gamificationPoints: t.Optional(t.Integer()),
    reviewEnabled: t.Optional(t.Boolean()),
  },
  { additionalProperties: false },
);

export const CourseCompletionSettingsRelationsInputCreate = t.Object(
  {
    course: t.Object(
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

export const CourseCompletionSettingsRelationsInputUpdate = t.Partial(
  t.Object(
    {
      course: t.Object(
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

export const CourseCompletionSettingsWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          courseId: t.String(),
          certificateEnabled: t.Boolean(),
          certReferencePattern: t.String(),
          certValidityDays: t.Integer(),
          certSignatureName: t.String(),
          certPassMark: t.Integer(),
          reEnrollMode: t.Union(
            [
              t.Literal("NONE"),
              t.Literal("AFTER_COMPLETION"),
              t.Literal("BEFORE_EXPIRY"),
            ],
            { additionalProperties: false },
          ),
          reEnrollDays: t.Integer(),
          gamificationPoints: t.Integer(),
          reviewEnabled: t.Boolean(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "CourseCompletionSettings" },
  ),
);

export const CourseCompletionSettingsWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.String(), courseId: t.String() },
            { additionalProperties: false },
          ),
          { additionalProperties: false },
        ),
        t.Union(
          [t.Object({ id: t.String() }), t.Object({ courseId: t.String() })],
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
              courseId: t.String(),
              certificateEnabled: t.Boolean(),
              certReferencePattern: t.String(),
              certValidityDays: t.Integer(),
              certSignatureName: t.String(),
              certPassMark: t.Integer(),
              reEnrollMode: t.Union(
                [
                  t.Literal("NONE"),
                  t.Literal("AFTER_COMPLETION"),
                  t.Literal("BEFORE_EXPIRY"),
                ],
                { additionalProperties: false },
              ),
              reEnrollDays: t.Integer(),
              gamificationPoints: t.Integer(),
              reviewEnabled: t.Boolean(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "CourseCompletionSettings" },
);

export const CourseCompletionSettingsSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      courseId: t.Boolean(),
      certificateEnabled: t.Boolean(),
      certReferencePattern: t.Boolean(),
      certValidityDays: t.Boolean(),
      certSignatureName: t.Boolean(),
      certPassMark: t.Boolean(),
      reEnrollMode: t.Boolean(),
      reEnrollDays: t.Boolean(),
      gamificationPoints: t.Boolean(),
      reviewEnabled: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      course: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const CourseCompletionSettingsInclude = t.Partial(
  t.Object(
    { reEnrollMode: t.Boolean(), course: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const CourseCompletionSettingsOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      courseId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      certificateEnabled: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      certReferencePattern: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      certValidityDays: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      certSignatureName: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      certPassMark: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      reEnrollDays: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      gamificationPoints: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      reviewEnabled: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const CourseCompletionSettings = t.Composite(
  [CourseCompletionSettingsPlain, CourseCompletionSettingsRelations],
  { additionalProperties: false },
);

export const CourseCompletionSettingsInputCreate = t.Composite(
  [
    CourseCompletionSettingsPlainInputCreate,
    CourseCompletionSettingsRelationsInputCreate,
  ],
  { additionalProperties: false },
);

export const CourseCompletionSettingsInputUpdate = t.Composite(
  [
    CourseCompletionSettingsPlainInputUpdate,
    CourseCompletionSettingsRelationsInputUpdate,
  ],
  { additionalProperties: false },
);
