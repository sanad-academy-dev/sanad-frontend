import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const ClinicNotificationSettingsPlain = t.Object(
  {
    id: t.String(),
    clinicId: t.String(),
    emailEnabled: t.Boolean(),
    customerFollowUp: t.Boolean(),
    systemUpdates: t.Boolean(),
    emailBookings: t.Boolean(),
    emailAppointmentUpdates: t.Boolean(),
    emailAppointmentCancellations: t.Boolean(),
    emailReminderApprovalEnabled: t.Boolean(),
    emailReminderApprovalHours: t.Integer(),
    emailReminderFollowUpEnabled: t.Boolean(),
    emailReminderFollowUpHours: t.Integer(),
    emailReminderPaymentEnabled: t.Boolean(),
    emailReminderPaymentHours: t.Integer(),
    emailReminderCommentsEnabled: t.Boolean(),
    emailInvoices: t.Boolean(),
    emailFormRequest: t.Boolean(),
    emailFormFollowUp: t.Boolean(),
    emailTreatmentFollowUp: t.Boolean(),
    vaccinationDueEnabled: t.Boolean(),
    vaccinationDueLeadDays: t.Integer(),
  },
  { additionalProperties: false },
);

export const ClinicNotificationSettingsRelations = t.Object(
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

export const ClinicNotificationSettingsPlainInputCreate = t.Object(
  {
    emailEnabled: t.Optional(t.Boolean()),
    customerFollowUp: t.Optional(t.Boolean()),
    systemUpdates: t.Optional(t.Boolean()),
    emailBookings: t.Optional(t.Boolean()),
    emailAppointmentUpdates: t.Optional(t.Boolean()),
    emailAppointmentCancellations: t.Optional(t.Boolean()),
    emailReminderApprovalEnabled: t.Optional(t.Boolean()),
    emailReminderApprovalHours: t.Optional(t.Integer()),
    emailReminderFollowUpEnabled: t.Optional(t.Boolean()),
    emailReminderFollowUpHours: t.Optional(t.Integer()),
    emailReminderPaymentEnabled: t.Optional(t.Boolean()),
    emailReminderPaymentHours: t.Optional(t.Integer()),
    emailReminderCommentsEnabled: t.Optional(t.Boolean()),
    emailInvoices: t.Optional(t.Boolean()),
    emailFormRequest: t.Optional(t.Boolean()),
    emailFormFollowUp: t.Optional(t.Boolean()),
    emailTreatmentFollowUp: t.Optional(t.Boolean()),
    vaccinationDueEnabled: t.Optional(t.Boolean()),
    vaccinationDueLeadDays: t.Optional(t.Integer()),
  },
  { additionalProperties: false },
);

export const ClinicNotificationSettingsPlainInputUpdate = t.Object(
  {
    emailEnabled: t.Optional(t.Boolean()),
    customerFollowUp: t.Optional(t.Boolean()),
    systemUpdates: t.Optional(t.Boolean()),
    emailBookings: t.Optional(t.Boolean()),
    emailAppointmentUpdates: t.Optional(t.Boolean()),
    emailAppointmentCancellations: t.Optional(t.Boolean()),
    emailReminderApprovalEnabled: t.Optional(t.Boolean()),
    emailReminderApprovalHours: t.Optional(t.Integer()),
    emailReminderFollowUpEnabled: t.Optional(t.Boolean()),
    emailReminderFollowUpHours: t.Optional(t.Integer()),
    emailReminderPaymentEnabled: t.Optional(t.Boolean()),
    emailReminderPaymentHours: t.Optional(t.Integer()),
    emailReminderCommentsEnabled: t.Optional(t.Boolean()),
    emailInvoices: t.Optional(t.Boolean()),
    emailFormRequest: t.Optional(t.Boolean()),
    emailFormFollowUp: t.Optional(t.Boolean()),
    emailTreatmentFollowUp: t.Optional(t.Boolean()),
    vaccinationDueEnabled: t.Optional(t.Boolean()),
    vaccinationDueLeadDays: t.Optional(t.Integer()),
  },
  { additionalProperties: false },
);

export const ClinicNotificationSettingsRelationsInputCreate = t.Object(
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

export const ClinicNotificationSettingsRelationsInputUpdate = t.Partial(
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

export const ClinicNotificationSettingsWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          clinicId: t.String(),
          emailEnabled: t.Boolean(),
          customerFollowUp: t.Boolean(),
          systemUpdates: t.Boolean(),
          emailBookings: t.Boolean(),
          emailAppointmentUpdates: t.Boolean(),
          emailAppointmentCancellations: t.Boolean(),
          emailReminderApprovalEnabled: t.Boolean(),
          emailReminderApprovalHours: t.Integer(),
          emailReminderFollowUpEnabled: t.Boolean(),
          emailReminderFollowUpHours: t.Integer(),
          emailReminderPaymentEnabled: t.Boolean(),
          emailReminderPaymentHours: t.Integer(),
          emailReminderCommentsEnabled: t.Boolean(),
          emailInvoices: t.Boolean(),
          emailFormRequest: t.Boolean(),
          emailFormFollowUp: t.Boolean(),
          emailTreatmentFollowUp: t.Boolean(),
          vaccinationDueEnabled: t.Boolean(),
          vaccinationDueLeadDays: t.Integer(),
        },
        { additionalProperties: false },
      ),
    { $id: "ClinicNotificationSettings" },
  ),
);

export const ClinicNotificationSettingsWhereUnique = t.Recursive(
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
              emailEnabled: t.Boolean(),
              customerFollowUp: t.Boolean(),
              systemUpdates: t.Boolean(),
              emailBookings: t.Boolean(),
              emailAppointmentUpdates: t.Boolean(),
              emailAppointmentCancellations: t.Boolean(),
              emailReminderApprovalEnabled: t.Boolean(),
              emailReminderApprovalHours: t.Integer(),
              emailReminderFollowUpEnabled: t.Boolean(),
              emailReminderFollowUpHours: t.Integer(),
              emailReminderPaymentEnabled: t.Boolean(),
              emailReminderPaymentHours: t.Integer(),
              emailReminderCommentsEnabled: t.Boolean(),
              emailInvoices: t.Boolean(),
              emailFormRequest: t.Boolean(),
              emailFormFollowUp: t.Boolean(),
              emailTreatmentFollowUp: t.Boolean(),
              vaccinationDueEnabled: t.Boolean(),
              vaccinationDueLeadDays: t.Integer(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "ClinicNotificationSettings" },
);

export const ClinicNotificationSettingsSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      clinicId: t.Boolean(),
      emailEnabled: t.Boolean(),
      customerFollowUp: t.Boolean(),
      systemUpdates: t.Boolean(),
      emailBookings: t.Boolean(),
      emailAppointmentUpdates: t.Boolean(),
      emailAppointmentCancellations: t.Boolean(),
      emailReminderApprovalEnabled: t.Boolean(),
      emailReminderApprovalHours: t.Boolean(),
      emailReminderFollowUpEnabled: t.Boolean(),
      emailReminderFollowUpHours: t.Boolean(),
      emailReminderPaymentEnabled: t.Boolean(),
      emailReminderPaymentHours: t.Boolean(),
      emailReminderCommentsEnabled: t.Boolean(),
      emailInvoices: t.Boolean(),
      emailFormRequest: t.Boolean(),
      emailFormFollowUp: t.Boolean(),
      emailTreatmentFollowUp: t.Boolean(),
      vaccinationDueEnabled: t.Boolean(),
      vaccinationDueLeadDays: t.Boolean(),
      clinic: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const ClinicNotificationSettingsInclude = t.Partial(
  t.Object(
    { clinic: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const ClinicNotificationSettingsOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clinicId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      emailEnabled: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      customerFollowUp: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      systemUpdates: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      emailBookings: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      emailAppointmentUpdates: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      emailAppointmentCancellations: t.Union(
        [t.Literal("asc"), t.Literal("desc")],
        { additionalProperties: false },
      ),
      emailReminderApprovalEnabled: t.Union(
        [t.Literal("asc"), t.Literal("desc")],
        { additionalProperties: false },
      ),
      emailReminderApprovalHours: t.Union(
        [t.Literal("asc"), t.Literal("desc")],
        { additionalProperties: false },
      ),
      emailReminderFollowUpEnabled: t.Union(
        [t.Literal("asc"), t.Literal("desc")],
        { additionalProperties: false },
      ),
      emailReminderFollowUpHours: t.Union(
        [t.Literal("asc"), t.Literal("desc")],
        { additionalProperties: false },
      ),
      emailReminderPaymentEnabled: t.Union(
        [t.Literal("asc"), t.Literal("desc")],
        { additionalProperties: false },
      ),
      emailReminderPaymentHours: t.Union(
        [t.Literal("asc"), t.Literal("desc")],
        { additionalProperties: false },
      ),
      emailReminderCommentsEnabled: t.Union(
        [t.Literal("asc"), t.Literal("desc")],
        { additionalProperties: false },
      ),
      emailInvoices: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      emailFormRequest: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      emailFormFollowUp: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      emailTreatmentFollowUp: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      vaccinationDueEnabled: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      vaccinationDueLeadDays: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const ClinicNotificationSettings = t.Composite(
  [ClinicNotificationSettingsPlain, ClinicNotificationSettingsRelations],
  { additionalProperties: false },
);

export const ClinicNotificationSettingsInputCreate = t.Composite(
  [
    ClinicNotificationSettingsPlainInputCreate,
    ClinicNotificationSettingsRelationsInputCreate,
  ],
  { additionalProperties: false },
);

export const ClinicNotificationSettingsInputUpdate = t.Composite(
  [
    ClinicNotificationSettingsPlainInputUpdate,
    ClinicNotificationSettingsRelationsInputUpdate,
  ],
  { additionalProperties: false },
);
