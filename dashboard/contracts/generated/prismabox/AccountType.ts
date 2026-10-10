import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const AccountType = t.Union(
  [
    t.Literal("BANK"),
    t.Literal("CASH"),
    t.Literal("RECEIVABLE"),
    t.Literal("PAYABLE"),
    t.Literal("TAX"),
    t.Literal("STOCK"),
    t.Literal("FIXED_ASSET"),
    t.Literal("ACCUMULATED_DEPRECIATION"),
    t.Literal("DEPRECIATION"),
    t.Literal("EXPENSE_ACCOUNT"),
    t.Literal("INCOME_ACCOUNT"),
    t.Literal("CHARGEABLE"),
    t.Literal("ROUND_OFF"),
    t.Literal("ROUND_OFF_FOR_OPENING"),
    t.Literal("TEMPORARY"),
    t.Literal("EQUITY"),
    t.Literal("DIRECT_INCOME"),
    t.Literal("INDIRECT_INCOME"),
    t.Literal("DIRECT_EXPENSE"),
    t.Literal("INDIRECT_EXPENSE"),
    t.Literal("COST_OF_GOODS_SOLD"),
    t.Literal("CURRENT_ASSET"),
    t.Literal("CURRENT_LIABILITY"),
    t.Literal("CAPITAL_WORK_IN_PROGRESS"),
    t.Literal("ASSET_RECEIVED_BUT_NOT_BILLED"),
    t.Literal("STOCK_RECEIVED_BUT_NOT_BILLED"),
    t.Literal("SERVICE_RECEIVED_BUT_NOT_BILLED"),
    t.Literal("STOCK_ADJUSTMENT"),
  ],
  { additionalProperties: false },
);
