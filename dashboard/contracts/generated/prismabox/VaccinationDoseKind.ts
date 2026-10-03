import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const VaccinationDoseKind = t.Union(
  [
    t.Literal("PRIMARY"),
    t.Literal("BOOSTER"),
    t.Literal("ANNUAL"),
    t.Literal("CATCH_UP"),
  ],
  { additionalProperties: false },
);
