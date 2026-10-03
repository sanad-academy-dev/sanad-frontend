import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const OperationTeamRole = t.Union(
  [
    t.Literal("PRIMARY_SURGEON"),
    t.Literal("ASSISTANT_SURGEON"),
    t.Literal("ANESTHETIST"),
    t.Literal("ANESTHESIA_TECH"),
    t.Literal("SCRUB_NURSE"),
    t.Literal("CIRCULATOR"),
    t.Literal("OBSERVER"),
  ],
  { additionalProperties: false },
);
