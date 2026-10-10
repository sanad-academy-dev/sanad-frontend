import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const CrmReferenceType = t.Union(
  [t.Literal("LEAD"), t.Literal("DEAL")],
  {
    additionalProperties: false,
    description: `*
* §8.1 — one polymorphic pattern for every activity and the status log.`,
  },
);
