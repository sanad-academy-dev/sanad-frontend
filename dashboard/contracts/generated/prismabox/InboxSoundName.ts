import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const InboxSoundName = t.Union(
  [
    t.Literal("CHIME"),
    t.Literal("PING"),
    t.Literal("MARIMBA"),
    t.Literal("KNOCK"),
  ],
  { additionalProperties: false },
);
