import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const MobileUnitCrewRole = t.Union(
  [
    t.Literal("DRIVER"),
    t.Literal("VET"),
    t.Literal("TECHNICIAN"),
    t.Literal("GROOMER"),
    t.Literal("ASSISTANT"),
  ],
  { additionalProperties: false },
);
