import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const ClinicSettingsPlain = t.Object(
  {
    id: t.String(),
    clinicId: t.String(),
    name: __nullable__(t.String()),
    logo: __nullable__(t.String()),
    email: __nullable__(t.String()),
    phone: __nullable__(t.String()),
    licenseNumber: __nullable__(t.String()),
    taxRegistryNumber: __nullable__(t.String()),
    website: __nullable__(t.String()),
    city: __nullable__(t.String()),
    address: __nullable__(t.String()),
    description: __nullable__(t.String()),
    countryCode: __nullable__(t.String()),
    timezone: t.String(),
    calendarType: t.Union([t.Literal("GREGORIAN"), t.Literal("HIJRI")], {
      additionalProperties: false,
    }),
    timeFormat: t.Union([t.Literal("H12"), t.Literal("H24")], {
      additionalProperties: false,
    }),
    vatRate: t.Number(),
    currencyCode: t.String(),
    attendanceEnabled: t.Boolean(),
    kioskEnabled: t.Boolean(),
    kioskPin: __nullable__(t.String()),
    isVerified: t.Boolean(),
  },
  { additionalProperties: false },
);

export const ClinicSettingsRelations = t.Object(
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

export const ClinicSettingsPlainInputCreate = t.Object(
  {
    name: t.Optional(__nullable__(t.String())),
    logo: t.Optional(__nullable__(t.String())),
    email: t.Optional(__nullable__(t.String())),
    phone: t.Optional(__nullable__(t.String())),
    licenseNumber: t.Optional(__nullable__(t.String())),
    taxRegistryNumber: t.Optional(__nullable__(t.String())),
    website: t.Optional(__nullable__(t.String())),
    city: t.Optional(__nullable__(t.String())),
    address: t.Optional(__nullable__(t.String())),
    description: t.Optional(__nullable__(t.String())),
    countryCode: t.Optional(__nullable__(t.String())),
    timezone: t.Optional(t.String()),
    calendarType: t.Optional(
      t.Union([t.Literal("GREGORIAN"), t.Literal("HIJRI")], {
        additionalProperties: false,
      }),
    ),
    timeFormat: t.Optional(
      t.Union([t.Literal("H12"), t.Literal("H24")], {
        additionalProperties: false,
      }),
    ),
    vatRate: t.Optional(t.Number()),
    currencyCode: t.Optional(t.String()),
    attendanceEnabled: t.Optional(t.Boolean()),
    kioskEnabled: t.Optional(t.Boolean()),
    kioskPin: t.Optional(__nullable__(t.String())),
    isVerified: t.Optional(t.Boolean()),
  },
  { additionalProperties: false },
);

export const ClinicSettingsPlainInputUpdate = t.Object(
  {
    name: t.Optional(__nullable__(t.String())),
    logo: t.Optional(__nullable__(t.String())),
    email: t.Optional(__nullable__(t.String())),
    phone: t.Optional(__nullable__(t.String())),
    licenseNumber: t.Optional(__nullable__(t.String())),
    taxRegistryNumber: t.Optional(__nullable__(t.String())),
    website: t.Optional(__nullable__(t.String())),
    city: t.Optional(__nullable__(t.String())),
    address: t.Optional(__nullable__(t.String())),
    description: t.Optional(__nullable__(t.String())),
    countryCode: t.Optional(__nullable__(t.String())),
    timezone: t.Optional(t.String()),
    calendarType: t.Optional(
      t.Union([t.Literal("GREGORIAN"), t.Literal("HIJRI")], {
        additionalProperties: false,
      }),
    ),
    timeFormat: t.Optional(
      t.Union([t.Literal("H12"), t.Literal("H24")], {
        additionalProperties: false,
      }),
    ),
    vatRate: t.Optional(t.Number()),
    currencyCode: t.Optional(t.String()),
    attendanceEnabled: t.Optional(t.Boolean()),
    kioskEnabled: t.Optional(t.Boolean()),
    kioskPin: t.Optional(__nullable__(t.String())),
    isVerified: t.Optional(t.Boolean()),
  },
  { additionalProperties: false },
);

export const ClinicSettingsRelationsInputCreate = t.Object(
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

export const ClinicSettingsRelationsInputUpdate = t.Partial(
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

export const ClinicSettingsWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          clinicId: t.String(),
          name: t.String(),
          logo: t.String(),
          email: t.String(),
          phone: t.String(),
          licenseNumber: t.String(),
          taxRegistryNumber: t.String(),
          website: t.String(),
          city: t.String(),
          address: t.String(),
          description: t.String(),
          countryCode: t.String(),
          timezone: t.String(),
          calendarType: t.Union([t.Literal("GREGORIAN"), t.Literal("HIJRI")], {
            additionalProperties: false,
          }),
          timeFormat: t.Union([t.Literal("H12"), t.Literal("H24")], {
            additionalProperties: false,
          }),
          vatRate: t.Number(),
          currencyCode: t.String(),
          attendanceEnabled: t.Boolean(),
          kioskEnabled: t.Boolean(),
          kioskPin: t.String(),
          isVerified: t.Boolean(),
        },
        { additionalProperties: false },
      ),
    { $id: "ClinicSettings" },
  ),
);

export const ClinicSettingsWhereUnique = t.Recursive(
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
              name: t.String(),
              logo: t.String(),
              email: t.String(),
              phone: t.String(),
              licenseNumber: t.String(),
              taxRegistryNumber: t.String(),
              website: t.String(),
              city: t.String(),
              address: t.String(),
              description: t.String(),
              countryCode: t.String(),
              timezone: t.String(),
              calendarType: t.Union(
                [t.Literal("GREGORIAN"), t.Literal("HIJRI")],
                { additionalProperties: false },
              ),
              timeFormat: t.Union([t.Literal("H12"), t.Literal("H24")], {
                additionalProperties: false,
              }),
              vatRate: t.Number(),
              currencyCode: t.String(),
              attendanceEnabled: t.Boolean(),
              kioskEnabled: t.Boolean(),
              kioskPin: t.String(),
              isVerified: t.Boolean(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "ClinicSettings" },
);

export const ClinicSettingsSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      clinicId: t.Boolean(),
      name: t.Boolean(),
      logo: t.Boolean(),
      email: t.Boolean(),
      phone: t.Boolean(),
      licenseNumber: t.Boolean(),
      taxRegistryNumber: t.Boolean(),
      website: t.Boolean(),
      city: t.Boolean(),
      address: t.Boolean(),
      description: t.Boolean(),
      countryCode: t.Boolean(),
      timezone: t.Boolean(),
      calendarType: t.Boolean(),
      timeFormat: t.Boolean(),
      vatRate: t.Boolean(),
      currencyCode: t.Boolean(),
      attendanceEnabled: t.Boolean(),
      kioskEnabled: t.Boolean(),
      kioskPin: t.Boolean(),
      isVerified: t.Boolean(),
      clinic: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const ClinicSettingsInclude = t.Partial(
  t.Object(
    {
      calendarType: t.Boolean(),
      timeFormat: t.Boolean(),
      clinic: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const ClinicSettingsOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clinicId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      name: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      logo: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      email: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      phone: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      licenseNumber: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      taxRegistryNumber: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      website: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      city: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      address: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      description: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      countryCode: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      timezone: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      vatRate: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      currencyCode: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      attendanceEnabled: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      kioskEnabled: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      kioskPin: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      isVerified: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const ClinicSettings = t.Composite(
  [ClinicSettingsPlain, ClinicSettingsRelations],
  { additionalProperties: false },
);

export const ClinicSettingsInputCreate = t.Composite(
  [ClinicSettingsPlainInputCreate, ClinicSettingsRelationsInputCreate],
  { additionalProperties: false },
);

export const ClinicSettingsInputUpdate = t.Composite(
  [ClinicSettingsPlainInputUpdate, ClinicSettingsRelationsInputUpdate],
  { additionalProperties: false },
);
