import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const ClinicDocumentCategory = t.Union(
  [
    t.Literal("LICENSE"),
    t.Literal("REGISTRATION"),
    t.Literal("CONTRACT"),
    t.Literal("INSURANCE"),
    t.Literal("POLICY"),
    t.Literal("FINANCIAL"),
    t.Literal("OTHER"),
  ],
  { additionalProperties: false },
);
