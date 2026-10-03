import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const GroomingStatus = t.Union(
  [
    t.Literal("SCHEDULED"),
    t.Literal("CHECK_IN"),
    t.Literal("INTAKE"),
    t.Literal("IN_PROGRESS"),
    t.Literal("FINISHING"),
    t.Literal("READY"),
    t.Literal("PICKED_UP"),
    t.Literal("COMPLETED"),
    t.Literal("CANCELLED"),
    t.Literal("NO_SHOW"),
    t.Literal("ESCALATED"),
  ],
  { additionalProperties: false, description: `أعمدة لوحة التجميل (§6.1).` },
);
