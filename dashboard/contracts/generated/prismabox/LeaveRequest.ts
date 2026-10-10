import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const LeaveRequestPlain = t.Object(
  {
    id: t.String(),
    clinicId: t.String(),
    staffId: t.String(),
    code: t.String(),
    type: t.String(),
    startDate: t.Date(),
    endDate: t.Date(),
    days: t.Integer(),
    notes: __nullable__(t.String()),
    substituteStaffId: __nullable__(t.String()),
    status: t.Union(
      [t.Literal("PENDING"), t.Literal("APPROVED"), t.Literal("REJECTED")],
      { additionalProperties: false },
    ),
    createdById: __nullable__(t.String()),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  },
  { additionalProperties: false },
);

export const LeaveRequestRelations = t.Object(
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
    staff: t.Object(
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
    substitute: __nullable__(
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
    attachments: t.Array(
      t.Object(
        {
          id: t.String(),
          requestId: t.String(),
          kind: t.String(),
          name: __nullable__(t.String()),
          url: t.String(),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    approvals: t.Array(
      t.Object(
        {
          id: t.String(),
          requestId: t.String(),
          order: t.Integer(),
          title: t.String(),
          status: t.String(),
          actorName: __nullable__(t.String()),
          at: __nullable__(t.Date()),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const LeaveRequestPlainInputCreate = t.Object(
  {
    code: t.String(),
    type: t.String(),
    startDate: t.Date(),
    endDate: t.Date(),
    days: t.Integer(),
    notes: t.Optional(__nullable__(t.String())),
    status: t.Optional(
      t.Union(
        [t.Literal("PENDING"), t.Literal("APPROVED"), t.Literal("REJECTED")],
        { additionalProperties: false },
      ),
    ),
  },
  { additionalProperties: false },
);

export const LeaveRequestPlainInputUpdate = t.Object(
  {
    code: t.Optional(t.String()),
    type: t.Optional(t.String()),
    startDate: t.Optional(t.Date()),
    endDate: t.Optional(t.Date()),
    days: t.Optional(t.Integer()),
    notes: t.Optional(__nullable__(t.String())),
    status: t.Optional(
      t.Union(
        [t.Literal("PENDING"), t.Literal("APPROVED"), t.Literal("REJECTED")],
        { additionalProperties: false },
      ),
    ),
  },
  { additionalProperties: false },
);

export const LeaveRequestRelationsInputCreate = t.Object(
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
    staff: t.Object(
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
    substitute: t.Optional(
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
    attachments: t.Optional(
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
    approvals: t.Optional(
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

export const LeaveRequestRelationsInputUpdate = t.Partial(
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
      staff: t.Object(
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
      substitute: t.Partial(
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
      attachments: t.Partial(
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
      approvals: t.Partial(
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

export const LeaveRequestWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          clinicId: t.String(),
          staffId: t.String(),
          code: t.String(),
          type: t.String(),
          startDate: t.Date(),
          endDate: t.Date(),
          days: t.Integer(),
          notes: t.String(),
          substituteStaffId: t.String(),
          status: t.Union(
            [
              t.Literal("PENDING"),
              t.Literal("APPROVED"),
              t.Literal("REJECTED"),
            ],
            { additionalProperties: false },
          ),
          createdById: t.String(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "LeaveRequest" },
  ),
);

export const LeaveRequestWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.String(), code: t.String() },
            { additionalProperties: false },
          ),
          { additionalProperties: false },
        ),
        t.Union(
          [t.Object({ id: t.String() }), t.Object({ code: t.String() })],
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
              staffId: t.String(),
              code: t.String(),
              type: t.String(),
              startDate: t.Date(),
              endDate: t.Date(),
              days: t.Integer(),
              notes: t.String(),
              substituteStaffId: t.String(),
              status: t.Union(
                [
                  t.Literal("PENDING"),
                  t.Literal("APPROVED"),
                  t.Literal("REJECTED"),
                ],
                { additionalProperties: false },
              ),
              createdById: t.String(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "LeaveRequest" },
);

export const LeaveRequestSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      clinicId: t.Boolean(),
      staffId: t.Boolean(),
      code: t.Boolean(),
      type: t.Boolean(),
      startDate: t.Boolean(),
      endDate: t.Boolean(),
      days: t.Boolean(),
      notes: t.Boolean(),
      substituteStaffId: t.Boolean(),
      status: t.Boolean(),
      createdById: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinic: t.Boolean(),
      staff: t.Boolean(),
      substitute: t.Boolean(),
      attachments: t.Boolean(),
      approvals: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const LeaveRequestInclude = t.Partial(
  t.Object(
    {
      status: t.Boolean(),
      clinic: t.Boolean(),
      staff: t.Boolean(),
      substitute: t.Boolean(),
      attachments: t.Boolean(),
      approvals: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const LeaveRequestOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clinicId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      staffId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      code: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      type: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      startDate: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      endDate: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      days: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      notes: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      substituteStaffId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdById: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const LeaveRequest = t.Composite(
  [LeaveRequestPlain, LeaveRequestRelations],
  { additionalProperties: false },
);

export const LeaveRequestInputCreate = t.Composite(
  [LeaveRequestPlainInputCreate, LeaveRequestRelationsInputCreate],
  { additionalProperties: false },
);

export const LeaveRequestInputUpdate = t.Composite(
  [LeaveRequestPlainInputUpdate, LeaveRequestRelationsInputUpdate],
  { additionalProperties: false },
);
