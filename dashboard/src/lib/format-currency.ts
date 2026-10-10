import type { Decimal } from "@/generated/prisma/internal/prismaNamespace";

export const formatCurrency = (
	amount: Decimal | number | string,
	currencyCode: string,
): string => {
	const value = typeof amount === "object" ? amount.toNumber() : Number(amount);
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: currencyCode,
	}).format(value);
};
