import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const ChecklistResponseType = t.Union(
  [
    t.Literal("CONFIRM"),
    t.Literal("YES_NO_NA"),
    t.Literal("TEXT"),
    t.Literal("NUMBER"),
  ],
  { additionalProperties: false },
);
