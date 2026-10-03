import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const VaccineKind = t.Union(
  [
    t.Literal("MODIFIED_LIVE"),
    t.Literal("KILLED"),
    t.Literal("RECOMBINANT"),
    t.Literal("TOXOID"),
    t.Literal("SUBUNIT"),
    t.Literal("OTHER"),
  ],
  { additionalProperties: false },
);
