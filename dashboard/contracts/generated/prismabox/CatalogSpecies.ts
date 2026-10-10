import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const CatalogSpecies = t.Union(
  [
    t.Literal("DOG"),
    t.Literal("CAT"),
    t.Literal("HORSE"),
    t.Literal("CATTLE"),
    t.Literal("SHEEP"),
    t.Literal("GOAT"),
    t.Literal("CAMEL"),
    t.Literal("POULTRY"),
    t.Literal("RABBIT"),
    t.Literal("SWINE"),
    t.Literal("FISH"),
    t.Literal("BEE"),
  ],
  { additionalProperties: false },
);
