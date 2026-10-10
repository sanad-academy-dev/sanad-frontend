import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const ClinicAgentSettingsPlain = t.Object(
  {
    id: t.String(),
    clinicId: t.String(),
    generalAssistantEnabled: t.Boolean(),
    webSearchEnabled: t.Boolean(),
    mcpEnabled: t.Boolean(),
    enabledGuardrails: t.Array(t.String(), { additionalProperties: false }),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  },
  { additionalProperties: false },
);

export const ClinicAgentSettingsRelations = t.Object(
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
  },
  { additionalProperties: false },
);

export const ClinicAgentSettingsPlainInputCreate = t.Object(
  {
    generalAssistantEnabled: t.Optional(t.Boolean()),
    webSearchEnabled: t.Optional(t.Boolean()),
    mcpEnabled: t.Optional(t.Boolean()),
    enabledGuardrails: t.Optional(
      t.Array(t.String(), { additionalProperties: false }),
    ),
  },
  { additionalProperties: false },
);

export const ClinicAgentSettingsPlainInputUpdate = t.Object(
  {
    generalAssistantEnabled: t.Optional(t.Boolean()),
    webSearchEnabled: t.Optional(t.Boolean()),
    mcpEnabled: t.Optional(t.Boolean()),
    enabledGuardrails: t.Optional(
      t.Array(t.String(), { additionalProperties: false }),
    ),
  },
  { additionalProperties: false },
);

export const ClinicAgentSettingsRelationsInputCreate = t.Object(
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
  },
  { additionalProperties: false },
);

export const ClinicAgentSettingsRelationsInputUpdate = t.Partial(
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
    },
    { additionalProperties: false },
  ),
);

export const ClinicAgentSettingsWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          clinicId: t.String(),
          generalAssistantEnabled: t.Boolean(),
          webSearchEnabled: t.Boolean(),
          mcpEnabled: t.Boolean(),
          enabledGuardrails: t.Array(t.String(), {
            additionalProperties: false,
          }),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "ClinicAgentSettings" },
  ),
);

export const ClinicAgentSettingsWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.String(), clinicId: t.String() },
            { additionalProperties: false },
          ),
          { additionalProperties: false },
        ),
        t.Union(
          [t.Object({ id: t.String() }), t.Object({ clinicId: t.String() })],
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
              clinicId: t.String(),
              generalAssistantEnabled: t.Boolean(),
              webSearchEnabled: t.Boolean(),
              mcpEnabled: t.Boolean(),
              enabledGuardrails: t.Array(t.String(), {
                additionalProperties: false,
              }),
              createdAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "ClinicAgentSettings" },
);

export const ClinicAgentSettingsSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      clinicId: t.Boolean(),
      generalAssistantEnabled: t.Boolean(),
      webSearchEnabled: t.Boolean(),
      mcpEnabled: t.Boolean(),
      enabledGuardrails: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinic: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const ClinicAgentSettingsInclude = t.Partial(
  t.Object(
    { clinic: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const ClinicAgentSettingsOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clinicId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      generalAssistantEnabled: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      webSearchEnabled: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      mcpEnabled: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      enabledGuardrails: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const ClinicAgentSettings = t.Composite(
  [ClinicAgentSettingsPlain, ClinicAgentSettingsRelations],
  { additionalProperties: false },
);

export const ClinicAgentSettingsInputCreate = t.Composite(
  [
    ClinicAgentSettingsPlainInputCreate,
    ClinicAgentSettingsRelationsInputCreate,
  ],
  { additionalProperties: false },
);

export const ClinicAgentSettingsInputUpdate = t.Composite(
  [
    ClinicAgentSettingsPlainInputUpdate,
    ClinicAgentSettingsRelationsInputUpdate,
  ],
  { additionalProperties: false },
);
