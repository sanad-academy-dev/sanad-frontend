import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const Weekday = t.Union(
  [
    t.Literal("SUNDAY"),
    t.Literal("MONDAY"),
    t.Literal("TUESDAY"),
    t.Literal("WEDNESDAY"),
    t.Literal("THURSDAY"),
    t.Literal("FRIDAY"),
    t.Literal("SATURDAY"),
  ],
  { additionalProperties: false },
);
