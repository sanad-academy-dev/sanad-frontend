import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const LabFastingStatus = t.Union(
  [t.Literal("FASTED"), t.Literal("PARTIAL"), t.Literal("NOT_FASTED")],
  { additionalProperties: false },
);
