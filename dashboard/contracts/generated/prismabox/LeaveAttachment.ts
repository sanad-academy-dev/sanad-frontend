import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const LeaveAttachmentPlain = t.Object(
  {
    id: t.String(),
    requestId: t.String(),
    kind: t.String(),
    name: __nullable__(t.String()),
    url: t.String(),
    createdAt: t.Date(),
  },
  { additionalProperties: false },
);

export const LeaveAttachmentRelations = t.Object(
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

export const LeaveAttachmentPlainInputCreate = t.Object(
  {
    kind: t.String(),
    name: t.Optional(__nullable__(t.String())),
    url: t.String(),
  },
  { additionalProperties: false },
);

export const LeaveAttachmentPlainInputUpdate = t.Object(
  {
    kind: t.Optional(t.String()),
    name: t.Optional(__nullable__(t.String())),
    url: t.Optional(t.String()),
  },
  { additionalProperties: false },
);

export const LeaveAttachmentRelationsInputCreate = t.Object(
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

export const LeaveAttachmentRelationsInputUpdate = t.Partial(
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

export const LeaveAttachmentWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          requestId: t.String(),
          kind: t.String(),
          name: t.String(),
          url: t.String(),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "LeaveAttachment" },
  ),
);

export const LeaveAttachmentWhereUnique = t.Recursive(
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
              kind: t.String(),
              name: t.String(),
              url: t.String(),
              createdAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "LeaveAttachment" },
);

export const LeaveAttachmentSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      requestId: t.Boolean(),
      kind: t.Boolean(),
      name: t.Boolean(),
      url: t.Boolean(),
      createdAt: t.Boolean(),
      request: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const LeaveAttachmentInclude = t.Partial(
  t.Object(
    { request: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const LeaveAttachmentOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      requestId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      kind: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      name: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      url: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const LeaveAttachment = t.Composite(
  [LeaveAttachmentPlain, LeaveAttachmentRelations],
  { additionalProperties: false },
);

export const LeaveAttachmentInputCreate = t.Composite(
  [LeaveAttachmentPlainInputCreate, LeaveAttachmentRelationsInputCreate],
  { additionalProperties: false },
);

export const LeaveAttachmentInputUpdate = t.Composite(
  [LeaveAttachmentPlainInputUpdate, LeaveAttachmentRelationsInputUpdate],
  { additionalProperties: false },
);
