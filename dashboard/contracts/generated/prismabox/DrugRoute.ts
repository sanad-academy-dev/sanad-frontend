import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const DrugRoute = t.Union(
  [
    t.Literal("IV"),
    t.Literal("IM"),
    t.Literal("SC"),
    t.Literal("PO"),
    t.Literal("INHALATION"),
    t.Literal("TOPICAL"),
    t.Literal("EPIDURAL"),
    t.Literal("OTHER"),
  ],
  { additionalProperties: false },
);
