import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const ReportCardChannel = t.Union(
  [
    t.Literal("WHATSAPP"),
    t.Literal("EMAIL"),
    t.Literal("SMS"),
    t.Literal("IN_APP"),
    t.Literal("PRINTED"),
  ],
  { additionalProperties: false },
);
