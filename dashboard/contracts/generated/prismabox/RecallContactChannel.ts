import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const RecallContactChannel = t.Union(
  [
    t.Literal("PHONE"),
    t.Literal("WHATSAPP"),
    t.Literal("EMAIL"),
    t.Literal("SMS"),
    t.Literal("IN_PERSON"),
    t.Literal("INBOX"),
  ],
  { additionalProperties: false },
);
