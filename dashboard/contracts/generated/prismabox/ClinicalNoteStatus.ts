import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const ClinicalNoteStatus = t.Union(
  [t.Literal("DRAFT"), t.Literal("FINAL"), t.Literal("AMENDED")],
  { additionalProperties: false },
);
