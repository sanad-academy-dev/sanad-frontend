import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const VaccineRoute = t.Union(
  [
    t.Literal("SUBCUTANEOUS"),
    t.Literal("INTRAMUSCULAR"),
    t.Literal("INTRANASAL"),
    t.Literal("ORAL"),
    t.Literal("INTRADERMAL"),
    t.Literal("TOPICAL"),
    t.Literal("OTHER"),
  ],
  { additionalProperties: false },
);
