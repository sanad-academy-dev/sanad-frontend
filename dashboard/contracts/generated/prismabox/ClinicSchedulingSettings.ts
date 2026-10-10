import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const ClinicSchedulingSettingsPlain = t.Object(
  {
    id: t.String(),
    clinicId: t.String(),
    schedulingEnabled: t.Boolean(),
    workDays: t.Array(
      t.Union(
        [
          t.Literal("SUNDAY"),
          t.Literal("MONDAY"),
          t.Literal("TUESDAY"),
          t.Literal("WEDNESDAY"),
          t.Literal("THURSDAY"),
          t.Literal("FRIDAY"),
          t.Literal("SATURDAY"),
        ],
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    shiftsEnabled: t.Boolean(),
    morningStartMinute: t.Integer(),
    morningEndMinute: t.Integer(),
    eveningStartMinute: t.Integer(),
    eveningEndMinute: t.Integer(),
    bookingRulesEnabled: t.Boolean(),
    appointmentBookingEnabled: t.Boolean(),
    onlineBookingEnabled: t.Boolean(),
    doubleBookingEnabled: t.Boolean(),
    appointmentBufferEnabled: t.Boolean(),
    appointmentBufferMinutes: t.Integer(),
    confirmationTimeoutEnabled: t.Boolean(),
    confirmationTimeoutHours: t.Union([t.Literal("H12"), t.Literal("H24")], {
      additionalProperties: false,
    }),
    minimumBookingNoticeEnabled: t.Boolean(),
    minimumBookingNoticeHours: t.Union([t.Literal("H12"), t.Literal("H24")], {
      additionalProperties: false,
    }),
    rescheduleNoticeEnabled: t.Boolean(),
    rescheduleNoticeHours: t.Union([t.Literal("H12"), t.Literal("H24")], {
      additionalProperties: false,
    }),
  },
  { additionalProperties: false },
);

export const ClinicSchedulingSettingsRelations = t.Object(
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

export const ClinicSchedulingSettingsPlainInputCreate = t.Object(
  {
    schedulingEnabled: t.Optional(t.Boolean()),
    workDays: t.Optional(
      t.Array(
        t.Union(
          [
            t.Literal("SUNDAY"),
            t.Literal("MONDAY"),
            t.Literal("TUESDAY"),
            t.Literal("WEDNESDAY"),
            t.Literal("THURSDAY"),
            t.Literal("FRIDAY"),
            t.Literal("SATURDAY"),
          ],
          { additionalProperties: false },
        ),
        { additionalProperties: false },
      ),
    ),
    shiftsEnabled: t.Optional(t.Boolean()),
    morningStartMinute: t.Optional(t.Integer()),
    morningEndMinute: t.Optional(t.Integer()),
    eveningStartMinute: t.Optional(t.Integer()),
    eveningEndMinute: t.Optional(t.Integer()),
    bookingRulesEnabled: t.Optional(t.Boolean()),
    appointmentBookingEnabled: t.Optional(t.Boolean()),
    onlineBookingEnabled: t.Optional(t.Boolean()),
    doubleBookingEnabled: t.Optional(t.Boolean()),
    appointmentBufferEnabled: t.Optional(t.Boolean()),
    appointmentBufferMinutes: t.Optional(t.Integer()),
    confirmationTimeoutEnabled: t.Optional(t.Boolean()),
    confirmationTimeoutHours: t.Optional(
      t.Union([t.Literal("H12"), t.Literal("H24")], {
        additionalProperties: false,
      }),
    ),
    minimumBookingNoticeEnabled: t.Optional(t.Boolean()),
    minimumBookingNoticeHours: t.Optional(
      t.Union([t.Literal("H12"), t.Literal("H24")], {
        additionalProperties: false,
      }),
    ),
    rescheduleNoticeEnabled: t.Optional(t.Boolean()),
    rescheduleNoticeHours: t.Optional(
      t.Union([t.Literal("H12"), t.Literal("H24")], {
        additionalProperties: false,
      }),
    ),
  },
  { additionalProperties: false },
);

export const ClinicSchedulingSettingsPlainInputUpdate = t.Object(
  {
    schedulingEnabled: t.Optional(t.Boolean()),
    workDays: t.Optional(
      t.Array(
        t.Union(
          [
            t.Literal("SUNDAY"),
            t.Literal("MONDAY"),
            t.Literal("TUESDAY"),
            t.Literal("WEDNESDAY"),
            t.Literal("THURSDAY"),
            t.Literal("FRIDAY"),
            t.Literal("SATURDAY"),
          ],
          { additionalProperties: false },
        ),
        { additionalProperties: false },
      ),
    ),
    shiftsEnabled: t.Optional(t.Boolean()),
    morningStartMinute: t.Optional(t.Integer()),
    morningEndMinute: t.Optional(t.Integer()),
    eveningStartMinute: t.Optional(t.Integer()),
    eveningEndMinute: t.Optional(t.Integer()),
    bookingRulesEnabled: t.Optional(t.Boolean()),
    appointmentBookingEnabled: t.Optional(t.Boolean()),
    onlineBookingEnabled: t.Optional(t.Boolean()),
    doubleBookingEnabled: t.Optional(t.Boolean()),
    appointmentBufferEnabled: t.Optional(t.Boolean()),
    appointmentBufferMinutes: t.Optional(t.Integer()),
    confirmationTimeoutEnabled: t.Optional(t.Boolean()),
    confirmationTimeoutHours: t.Optional(
      t.Union([t.Literal("H12"), t.Literal("H24")], {
        additionalProperties: false,
      }),
    ),
    minimumBookingNoticeEnabled: t.Optional(t.Boolean()),
    minimumBookingNoticeHours: t.Optional(
      t.Union([t.Literal("H12"), t.Literal("H24")], {
        additionalProperties: false,
      }),
    ),
    rescheduleNoticeEnabled: t.Optional(t.Boolean()),
    rescheduleNoticeHours: t.Optional(
      t.Union([t.Literal("H12"), t.Literal("H24")], {
        additionalProperties: false,
      }),
    ),
  },
  { additionalProperties: false },
);

export const ClinicSchedulingSettingsRelationsInputCreate = t.Object(
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

export const ClinicSchedulingSettingsRelationsInputUpdate = t.Partial(
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

export const ClinicSchedulingSettingsWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          clinicId: t.String(),
          schedulingEnabled: t.Boolean(),
          workDays: t.Array(
            t.Union(
              [
                t.Literal("SUNDAY"),
                t.Literal("MONDAY"),
                t.Literal("TUESDAY"),
                t.Literal("WEDNESDAY"),
                t.Literal("THURSDAY"),
                t.Literal("FRIDAY"),
                t.Literal("SATURDAY"),
              ],
              { additionalProperties: false },
            ),
            { additionalProperties: false },
          ),
          shiftsEnabled: t.Boolean(),
          morningStartMinute: t.Integer(),
          morningEndMinute: t.Integer(),
          eveningStartMinute: t.Integer(),
          eveningEndMinute: t.Integer(),
          bookingRulesEnabled: t.Boolean(),
          appointmentBookingEnabled: t.Boolean(),
          onlineBookingEnabled: t.Boolean(),
          doubleBookingEnabled: t.Boolean(),
          appointmentBufferEnabled: t.Boolean(),
          appointmentBufferMinutes: t.Integer(),
          confirmationTimeoutEnabled: t.Boolean(),
          confirmationTimeoutHours: t.Union(
            [t.Literal("H12"), t.Literal("H24")],
            { additionalProperties: false },
          ),
          minimumBookingNoticeEnabled: t.Boolean(),
          minimumBookingNoticeHours: t.Union(
            [t.Literal("H12"), t.Literal("H24")],
            { additionalProperties: false },
          ),
          rescheduleNoticeEnabled: t.Boolean(),
          rescheduleNoticeHours: t.Union([t.Literal("H12"), t.Literal("H24")], {
            additionalProperties: false,
          }),
        },
        { additionalProperties: false },
      ),
    { $id: "ClinicSchedulingSettings" },
  ),
);

export const ClinicSchedulingSettingsWhereUnique = t.Recursive(
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
              schedulingEnabled: t.Boolean(),
              workDays: t.Array(
                t.Union(
                  [
                    t.Literal("SUNDAY"),
                    t.Literal("MONDAY"),
                    t.Literal("TUESDAY"),
                    t.Literal("WEDNESDAY"),
                    t.Literal("THURSDAY"),
                    t.Literal("FRIDAY"),
                    t.Literal("SATURDAY"),
                  ],
                  { additionalProperties: false },
                ),
                { additionalProperties: false },
              ),
              shiftsEnabled: t.Boolean(),
              morningStartMinute: t.Integer(),
              morningEndMinute: t.Integer(),
              eveningStartMinute: t.Integer(),
              eveningEndMinute: t.Integer(),
              bookingRulesEnabled: t.Boolean(),
              appointmentBookingEnabled: t.Boolean(),
              onlineBookingEnabled: t.Boolean(),
              doubleBookingEnabled: t.Boolean(),
              appointmentBufferEnabled: t.Boolean(),
              appointmentBufferMinutes: t.Integer(),
              confirmationTimeoutEnabled: t.Boolean(),
              confirmationTimeoutHours: t.Union(
                [t.Literal("H12"), t.Literal("H24")],
                { additionalProperties: false },
              ),
              minimumBookingNoticeEnabled: t.Boolean(),
              minimumBookingNoticeHours: t.Union(
                [t.Literal("H12"), t.Literal("H24")],
                { additionalProperties: false },
              ),
              rescheduleNoticeEnabled: t.Boolean(),
              rescheduleNoticeHours: t.Union(
                [t.Literal("H12"), t.Literal("H24")],
                { additionalProperties: false },
              ),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "ClinicSchedulingSettings" },
);

export const ClinicSchedulingSettingsSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      clinicId: t.Boolean(),
      schedulingEnabled: t.Boolean(),
      workDays: t.Boolean(),
      shiftsEnabled: t.Boolean(),
      morningStartMinute: t.Boolean(),
      morningEndMinute: t.Boolean(),
      eveningStartMinute: t.Boolean(),
      eveningEndMinute: t.Boolean(),
      bookingRulesEnabled: t.Boolean(),
      appointmentBookingEnabled: t.Boolean(),
      onlineBookingEnabled: t.Boolean(),
      doubleBookingEnabled: t.Boolean(),
      appointmentBufferEnabled: t.Boolean(),
      appointmentBufferMinutes: t.Boolean(),
      confirmationTimeoutEnabled: t.Boolean(),
      confirmationTimeoutHours: t.Boolean(),
      minimumBookingNoticeEnabled: t.Boolean(),
      minimumBookingNoticeHours: t.Boolean(),
      rescheduleNoticeEnabled: t.Boolean(),
      rescheduleNoticeHours: t.Boolean(),
      clinic: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const ClinicSchedulingSettingsInclude = t.Partial(
  t.Object(
    {
      workDays: t.Boolean(),
      confirmationTimeoutHours: t.Boolean(),
      minimumBookingNoticeHours: t.Boolean(),
      rescheduleNoticeHours: t.Boolean(),
      clinic: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const ClinicSchedulingSettingsOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clinicId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      schedulingEnabled: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      shiftsEnabled: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      morningStartMinute: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      morningEndMinute: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      eveningStartMinute: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      eveningEndMinute: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      bookingRulesEnabled: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      appointmentBookingEnabled: t.Union(
        [t.Literal("asc"), t.Literal("desc")],
        { additionalProperties: false },
      ),
      onlineBookingEnabled: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      doubleBookingEnabled: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      appointmentBufferEnabled: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      appointmentBufferMinutes: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      confirmationTimeoutEnabled: t.Union(
        [t.Literal("asc"), t.Literal("desc")],
        { additionalProperties: false },
      ),
      minimumBookingNoticeEnabled: t.Union(
        [t.Literal("asc"), t.Literal("desc")],
        { additionalProperties: false },
      ),
      rescheduleNoticeEnabled: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const ClinicSchedulingSettings = t.Composite(
  [ClinicSchedulingSettingsPlain, ClinicSchedulingSettingsRelations],
  { additionalProperties: false },
);

export const ClinicSchedulingSettingsInputCreate = t.Composite(
  [
    ClinicSchedulingSettingsPlainInputCreate,
    ClinicSchedulingSettingsRelationsInputCreate,
  ],
  { additionalProperties: false },
);

export const ClinicSchedulingSettingsInputUpdate = t.Composite(
  [
    ClinicSchedulingSettingsPlainInputUpdate,
    ClinicSchedulingSettingsRelationsInputUpdate,
  ],
  { additionalProperties: false },
);
