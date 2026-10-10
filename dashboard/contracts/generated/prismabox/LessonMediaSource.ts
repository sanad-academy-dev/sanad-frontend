import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const LessonMediaSource = t.Union(
  [t.Literal("DEVICE"), t.Literal("URL")],
  { additionalProperties: false },
);
