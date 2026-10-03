import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const UserInboxSettingsPlain = t.Object(
  {
    id: t.String(),
    userId: t.String(),
    clinicId: t.String(),
    liveEnabled: t.Boolean(),
    toastEnabled: t.Boolean(),
    soundEnabled: t.Boolean(),
    soundName: t.Union(
      [
        t.Literal("CHIME"),
        t.Literal("PING"),
        t.Literal("MARIMBA"),
        t.Literal("KNOCK"),
      ],
      { additionalProperties: false },
    ),
    soundVolume: t.Integer(),
    desktopEnabled: t.Boolean(),
    onlyHighImportance: t.Boolean(),
    typeAppointments: t.Boolean(),
    typeLab: t.Boolean(),
    typeRadiology: t.Boolean(),
    typeTasks: t.Boolean(),
    typeStock: t.Boolean(),
    typeInvoices: t.Boolean(),
    typeMentions: t.Boolean(),
    typeApprovals: t.Boolean(),
    typeSystem: t.Boolean(),
    typeInpatients: t.Boolean(),
  },
  { additionalProperties: false },
);

export const UserInboxSettingsRelations = t.Object(
  {
    user: t.Object(
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

export const UserInboxSettingsPlainInputCreate = t.Object(
  {
    liveEnabled: t.Optional(t.Boolean()),
    toastEnabled: t.Optional(t.Boolean()),
    soundEnabled: t.Optional(t.Boolean()),
    soundName: t.Optional(
      t.Union(
        [
          t.Literal("CHIME"),
          t.Literal("PING"),
          t.Literal("MARIMBA"),
          t.Literal("KNOCK"),
        ],
        { additionalProperties: false },
      ),
    ),
    soundVolume: t.Optional(t.Integer()),
    desktopEnabled: t.Optional(t.Boolean()),
    onlyHighImportance: t.Optional(t.Boolean()),
    typeAppointments: t.Optional(t.Boolean()),
    typeLab: t.Optional(t.Boolean()),
    typeRadiology: t.Optional(t.Boolean()),
    typeTasks: t.Optional(t.Boolean()),
    typeStock: t.Optional(t.Boolean()),
    typeInvoices: t.Optional(t.Boolean()),
    typeMentions: t.Optional(t.Boolean()),
    typeApprovals: t.Optional(t.Boolean()),
    typeSystem: t.Optional(t.Boolean()),
    typeInpatients: t.Optional(t.Boolean()),
  },
  { additionalProperties: false },
);

export const UserInboxSettingsPlainInputUpdate = t.Object(
  {
    liveEnabled: t.Optional(t.Boolean()),
    toastEnabled: t.Optional(t.Boolean()),
    soundEnabled: t.Optional(t.Boolean()),
    soundName: t.Optional(
      t.Union(
        [
          t.Literal("CHIME"),
          t.Literal("PING"),
          t.Literal("MARIMBA"),
          t.Literal("KNOCK"),
        ],
        { additionalProperties: false },
      ),
    ),
    soundVolume: t.Optional(t.Integer()),
    desktopEnabled: t.Optional(t.Boolean()),
    onlyHighImportance: t.Optional(t.Boolean()),
    typeAppointments: t.Optional(t.Boolean()),
    typeLab: t.Optional(t.Boolean()),
    typeRadiology: t.Optional(t.Boolean()),
    typeTasks: t.Optional(t.Boolean()),
    typeStock: t.Optional(t.Boolean()),
    typeInvoices: t.Optional(t.Boolean()),
    typeMentions: t.Optional(t.Boolean()),
    typeApprovals: t.Optional(t.Boolean()),
    typeSystem: t.Optional(t.Boolean()),
    typeInpatients: t.Optional(t.Boolean()),
  },
  { additionalProperties: false },
);

export const UserInboxSettingsRelationsInputCreate = t.Object(
  {
    user: t.Object(
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

export const UserInboxSettingsRelationsInputUpdate = t.Partial(
  t.Object(
    {
      user: t.Object(
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

export const UserInboxSettingsWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          userId: t.String(),
          clinicId: t.String(),
          liveEnabled: t.Boolean(),
          toastEnabled: t.Boolean(),
          soundEnabled: t.Boolean(),
          soundName: t.Union(
            [
              t.Literal("CHIME"),
              t.Literal("PING"),
              t.Literal("MARIMBA"),
              t.Literal("KNOCK"),
            ],
            { additionalProperties: false },
          ),
          soundVolume: t.Integer(),
          desktopEnabled: t.Boolean(),
          onlyHighImportance: t.Boolean(),
          typeAppointments: t.Boolean(),
          typeLab: t.Boolean(),
          typeRadiology: t.Boolean(),
          typeTasks: t.Boolean(),
          typeStock: t.Boolean(),
          typeInvoices: t.Boolean(),
          typeMentions: t.Boolean(),
          typeApprovals: t.Boolean(),
          typeSystem: t.Boolean(),
          typeInpatients: t.Boolean(),
        },
        { additionalProperties: false },
      ),
    { $id: "UserInboxSettings" },
  ),
);

export const UserInboxSettingsWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            {
              id: t.String(),
              userId_clinicId: t.Object(
                { userId: t.String(), clinicId: t.String() },
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
              userId_clinicId: t.Object(
                { userId: t.String(), clinicId: t.String() },
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
              userId: t.String(),
              clinicId: t.String(),
              liveEnabled: t.Boolean(),
              toastEnabled: t.Boolean(),
              soundEnabled: t.Boolean(),
              soundName: t.Union(
                [
                  t.Literal("CHIME"),
                  t.Literal("PING"),
                  t.Literal("MARIMBA"),
                  t.Literal("KNOCK"),
                ],
                { additionalProperties: false },
              ),
              soundVolume: t.Integer(),
              desktopEnabled: t.Boolean(),
              onlyHighImportance: t.Boolean(),
              typeAppointments: t.Boolean(),
              typeLab: t.Boolean(),
              typeRadiology: t.Boolean(),
              typeTasks: t.Boolean(),
              typeStock: t.Boolean(),
              typeInvoices: t.Boolean(),
              typeMentions: t.Boolean(),
              typeApprovals: t.Boolean(),
              typeSystem: t.Boolean(),
              typeInpatients: t.Boolean(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "UserInboxSettings" },
);

export const UserInboxSettingsSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      userId: t.Boolean(),
      clinicId: t.Boolean(),
      liveEnabled: t.Boolean(),
      toastEnabled: t.Boolean(),
      soundEnabled: t.Boolean(),
      soundName: t.Boolean(),
      soundVolume: t.Boolean(),
      desktopEnabled: t.Boolean(),
      onlyHighImportance: t.Boolean(),
      typeAppointments: t.Boolean(),
      typeLab: t.Boolean(),
      typeRadiology: t.Boolean(),
      typeTasks: t.Boolean(),
      typeStock: t.Boolean(),
      typeInvoices: t.Boolean(),
      typeMentions: t.Boolean(),
      typeApprovals: t.Boolean(),
      typeSystem: t.Boolean(),
      typeInpatients: t.Boolean(),
      user: t.Boolean(),
      clinic: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const UserInboxSettingsInclude = t.Partial(
  t.Object(
    {
      soundName: t.Boolean(),
      user: t.Boolean(),
      clinic: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const UserInboxSettingsOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      userId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clinicId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      liveEnabled: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      toastEnabled: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      soundEnabled: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      soundVolume: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      desktopEnabled: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      onlyHighImportance: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      typeAppointments: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      typeLab: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      typeRadiology: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      typeTasks: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      typeStock: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      typeInvoices: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      typeMentions: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      typeApprovals: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      typeSystem: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      typeInpatients: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const UserInboxSettings = t.Composite(
  [UserInboxSettingsPlain, UserInboxSettingsRelations],
  { additionalProperties: false },
);

export const UserInboxSettingsInputCreate = t.Composite(
  [UserInboxSettingsPlainInputCreate, UserInboxSettingsRelationsInputCreate],
  { additionalProperties: false },
);

export const UserInboxSettingsInputUpdate = t.Composite(
  [UserInboxSettingsPlainInputUpdate, UserInboxSettingsRelationsInputUpdate],
  { additionalProperties: false },
);
