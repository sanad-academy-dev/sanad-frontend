import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const PsoaFrequency = t.Union(
  [
    t.Literal("MANUAL"),
    t.Literal("WEEKLY"),
    t.Literal("MONTHLY"),
    t.Literal("QUARTERLY"),
  ],
  { additionalProperties: false },
);
