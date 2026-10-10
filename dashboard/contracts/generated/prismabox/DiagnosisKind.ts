import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const DiagnosisKind = t.Union(
  [t.Literal("DIFFERENTIAL"), t.Literal("WORKING"), t.Literal("FINAL")],
  { additionalProperties: false },
);
