import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const RoomType = t.Union(
  [
    t.Literal("EXAMINATION"),
    t.Literal("LABORATORY"),
    t.Literal("WAITING"),
    t.Literal("OPERATING"),
    t.Literal("VACCINATION"),
    t.Literal("ICU"),
    t.Literal("GROOMING"),
    t.Literal("WARD"),
    t.Literal("ISOLATION"),
  ],
  { additionalProperties: false },
);
