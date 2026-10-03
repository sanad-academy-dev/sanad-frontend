import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const BranchType = t.Union([t.Literal("PRIMARY"), t.Literal("SUB")], {
  additionalProperties: false,
});
