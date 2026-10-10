import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const ClinicProtocolsPlain = t.Object(
  {
    id: t.String(),
    clinicId: t.String(),
    avma: t.Boolean(),
    soapNotes: t.Boolean(),
    avmaMedicine: t.Boolean(),
    fecava: t.Boolean(),
    wsava: t.Boolean(),
    esccap: t.Boolean(),
    operationPaymentGate: t.Boolean(),
    operationCountsForMinor: t.Boolean(),
    operationRecoveryScoreMin: t.Integer(),
  },
  { additionalProperties: false },
);

export const ClinicProtocolsRelations = t.Object(
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

export const ClinicProtocolsPlainInputCreate = t.Object(
  {
    avma: t.Optional(t.Boolean()),
    soapNotes: t.Optional(t.Boolean()),
    avmaMedicine: t.Optional(t.Boolean()),
    fecava: t.Optional(t.Boolean()),
    wsava: t.Optional(t.Boolean()),
    esccap: t.Optional(t.Boolean()),
    operationPaymentGate: t.Optional(t.Boolean()),
    operationCountsForMinor: t.Optional(t.Boolean()),
    operationRecoveryScoreMin: t.Optional(t.Integer()),
  },
  { additionalProperties: false },
);

export const ClinicProtocolsPlainInputUpdate = t.Object(
  {
    avma: t.Optional(t.Boolean()),
    soapNotes: t.Optional(t.Boolean()),
    avmaMedicine: t.Optional(t.Boolean()),
    fecava: t.Optional(t.Boolean()),
    wsava: t.Optional(t.Boolean()),
    esccap: t.Optional(t.Boolean()),
    operationPaymentGate: t.Optional(t.Boolean()),
    operationCountsForMinor: t.Optional(t.Boolean()),
    operationRecoveryScoreMin: t.Optional(t.Integer()),
  },
  { additionalProperties: false },
);

export const ClinicProtocolsRelationsInputCreate = t.Object(
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

export const ClinicProtocolsRelationsInputUpdate = t.Partial(
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

export const ClinicProtocolsWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          clinicId: t.String(),
          avma: t.Boolean(),
          soapNotes: t.Boolean(),
          avmaMedicine: t.Boolean(),
          fecava: t.Boolean(),
          wsava: t.Boolean(),
          esccap: t.Boolean(),
          operationPaymentGate: t.Boolean(),
          operationCountsForMinor: t.Boolean(),
          operationRecoveryScoreMin: t.Integer(),
        },
        { additionalProperties: false },
      ),
    { $id: "ClinicProtocols" },
  ),
);

export const ClinicProtocolsWhereUnique = t.Recursive(
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
              avma: t.Boolean(),
              soapNotes: t.Boolean(),
              avmaMedicine: t.Boolean(),
              fecava: t.Boolean(),
              wsava: t.Boolean(),
              esccap: t.Boolean(),
              operationPaymentGate: t.Boolean(),
              operationCountsForMinor: t.Boolean(),
              operationRecoveryScoreMin: t.Integer(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "ClinicProtocols" },
);

export const ClinicProtocolsSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      clinicId: t.Boolean(),
      avma: t.Boolean(),
      soapNotes: t.Boolean(),
      avmaMedicine: t.Boolean(),
      fecava: t.Boolean(),
      wsava: t.Boolean(),
      esccap: t.Boolean(),
      operationPaymentGate: t.Boolean(),
      operationCountsForMinor: t.Boolean(),
      operationRecoveryScoreMin: t.Boolean(),
      clinic: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const ClinicProtocolsInclude = t.Partial(
  t.Object(
    { clinic: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const ClinicProtocolsOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clinicId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      avma: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      soapNotes: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      avmaMedicine: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      fecava: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      wsava: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      esccap: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      operationPaymentGate: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      operationCountsForMinor: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      operationRecoveryScoreMin: t.Union(
        [t.Literal("asc"), t.Literal("desc")],
        { additionalProperties: false },
      ),
    },
    { additionalProperties: false },
  ),
);

export const ClinicProtocols = t.Composite(
  [ClinicProtocolsPlain, ClinicProtocolsRelations],
  { additionalProperties: false },
);

export const ClinicProtocolsInputCreate = t.Composite(
  [ClinicProtocolsPlainInputCreate, ClinicProtocolsRelationsInputCreate],
  { additionalProperties: false },
);

export const ClinicProtocolsInputUpdate = t.Composite(
  [ClinicProtocolsPlainInputUpdate, ClinicProtocolsRelationsInputUpdate],
  { additionalProperties: false },
);
