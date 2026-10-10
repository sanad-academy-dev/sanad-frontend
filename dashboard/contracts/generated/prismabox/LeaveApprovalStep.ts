import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const LeaveApprovalStepPlain = t.Object(
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
);

export const LeaveApprovalStepRelations = t.Object(
  {
    request: t.Object(
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
    ),
  },
  { additionalProperties: false },
);

export const LeaveApprovalStepPlainInputCreate = t.Object(
  {
    order: t.Integer(),
    title: t.String(),
    status: t.String(),
    actorName: t.Optional(__nullable__(t.String())),
    at: t.Optional(__nullable__(t.Date())),
  },
  { additionalProperties: false },
);

export const LeaveApprovalStepPlainInputUpdate = t.Object(
  {
    order: t.Optional(t.Integer()),
    title: t.Optional(t.String()),
    status: t.Optional(t.String()),
    actorName: t.Optional(__nullable__(t.String())),
    at: t.Optional(__nullable__(t.Date())),
  },
  { additionalProperties: false },
);

export const LeaveApprovalStepRelationsInputCreate = t.Object(
  {
    request: t.Object(
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

export const LeaveApprovalStepRelationsInputUpdate = t.Partial(
  t.Object(
    {
      request: t.Object(
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

export const LeaveApprovalStepWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          requestId: t.String(),
          order: t.Integer(),
          title: t.String(),
          status: t.String(),
          actorName: t.String(),
          at: t.Date(),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "LeaveApprovalStep" },
  ),
);

export const LeaveApprovalStepWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object({ id: t.String() }, { additionalProperties: false }),
          { additionalProperties: false },
        ),
        t.Union([t.Object({ id: t.String() })], {
          additionalProperties: false,
        }),
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
              requestId: t.String(),
              order: t.Integer(),
              title: t.String(),
              status: t.String(),
              actorName: t.String(),
              at: t.Date(),
              createdAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "LeaveApprovalStep" },
);

export const LeaveApprovalStepSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      requestId: t.Boolean(),
      order: t.Boolean(),
      title: t.Boolean(),
      status: t.Boolean(),
      actorName: t.Boolean(),
      at: t.Boolean(),
      createdAt: t.Boolean(),
      request: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const LeaveApprovalStepInclude = t.Partial(
  t.Object(
    { request: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const LeaveApprovalStepOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      requestId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      order: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      title: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      status: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      actorName: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      at: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const LeaveApprovalStep = t.Composite(
  [LeaveApprovalStepPlain, LeaveApprovalStepRelations],
  { additionalProperties: false },
);

export const LeaveApprovalStepInputCreate = t.Composite(
  [LeaveApprovalStepPlainInputCreate, LeaveApprovalStepRelationsInputCreate],
  { additionalProperties: false },
);

export const LeaveApprovalStepInputUpdate = t.Composite(
  [LeaveApprovalStepPlainInputUpdate, LeaveApprovalStepRelationsInputUpdate],
  { additionalProperties: false },
);
