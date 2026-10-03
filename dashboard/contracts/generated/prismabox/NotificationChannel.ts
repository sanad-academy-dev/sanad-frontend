import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const NotificationChannel = t.Union(
  [
    t.Literal("INBOX"),
    t.Literal("EMAIL"),
    t.Literal("WHATSAPP"),
    t.Literal("SMS"),
    t.Literal("PUSH"),
  ],
  { additionalProperties: false },
);
