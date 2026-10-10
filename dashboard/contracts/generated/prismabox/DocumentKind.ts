import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const DocumentKind = t.Union([t.Literal("FILE"), t.Literal("LINK")], {
  additionalProperties: false,
});
