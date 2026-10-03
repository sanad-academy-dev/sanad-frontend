export type StockStatus = "out" | "low" | "in";

export interface StockStatusInfo {
	status: StockStatus;
	label: string;
	dotClass: string;
	textClass: string;
}

// يشتقّ حالة المخزون من الكمية ونقطة إعادة البيع (لا تُخزَّن في القاعدة)
export function getStockStatus(stock: number, reorderPoint: number): StockStatusInfo {
	if (stock <= 0) {
		return { status: "out", label: "نفذ", dotClass: "bg-red-500", textClass: "text-red-600" };
	}
	if (stock <= reorderPoint) {
		return {
			status: "low",
			label: "منخفض",
			dotClass: "bg-red-500",
			textClass: "text-red-600",
		};
	}
	return {
		status: "in",
		label: "متوفر",
		dotClass: "bg-emerald-500",
		textClass: "text-emerald-600",
	};
}
