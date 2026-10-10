import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const RecallOutcome = t.Union(
  [
    t.Literal("BOOKED"),
    t.Literal("NO_ANSWER"),
    t.Literal("CALLBACK_REQUESTED"),
    t.Literal("DECLINED"),
    t.Literal("WRONG_NUMBER"),
    t.Literal("SNOOZED"),
    t.Literal("INFORMED"),
  ],
  { additionalProperties: false },
);
