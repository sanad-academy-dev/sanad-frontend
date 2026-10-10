import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const AttendanceStatus = t.Union(
  [
    t.Literal("PRESENT"),
    t.Literal("ABSENT"),
    t.Literal("LATE"),
    t.Literal("LEAVE"),
    t.Literal("MISSION"),
    t.Literal("OVERTIME"),
  ],
  { additionalProperties: false },
);
