import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const ChecklistScope = t.Union(
  [
    t.Literal("OPERATION_SIGN_IN"),
    t.Literal("OPERATION_TIME_OUT"),
    t.Literal("OPERATION_SIGN_OUT"),
    t.Literal("OPERATION_MINOR_COMBINED"),
  ],
  { additionalProperties: false },
);
