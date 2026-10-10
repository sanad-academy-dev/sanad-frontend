import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const CalendarType = t.Union(
  [t.Literal("GREGORIAN"), t.Literal("HIJRI")],
  { additionalProperties: false },
);
