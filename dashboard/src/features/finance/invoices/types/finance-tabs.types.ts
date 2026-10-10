import { FINANCE_RESOURCES, type FinanceResource } from "@/lib/permissions";

export type FinanceTab = "invoices" | "discounts" | "care-plans" | "enrollments" | "expenses";

/**
 * The legacy billing screen's tab strip. Each tab carries the resource that reveals it, so
 * the strip hides what the sidebar hides — a receptionist with invoices only must not reach
 * الخصومات by clicking a tab the sidebar refused to link.
 */
export const FINANCE_TABS: {
	value: FinanceTab;
	label: string;
	disabled: boolean;
	resource: FinanceResource;
}[] = [
	{
		value: "invoices",
		label: "الفواتير",
		disabled: false,
		resource: FINANCE_RESOURCES.invoices,
	},
	{
		value: "discounts",
		label: "الخصومات",
		disabled: false,
		resource: FINANCE_RESOURCES.discounts,
	},
	{
		value: "care-plans",
		label: "خطط الرعاية",
		disabled: false,
		resource: FINANCE_RESOURCES.carePlans,
	},
	{
		value: "enrollments",
		label: "الاشتراكات",
		disabled: false,
		resource: FINANCE_RESOURCES.carePlans,
	},
	{
		value: "expenses",
		label: "المصروفات",
		disabled: false,
		resource: FINANCE_RESOURCES.expenses,
	},
];

export const FINANCE_TAB_VALUES = FINANCE_TABS.map((tab) => tab.value);

export const isFinanceTab = (value: unknown): value is FinanceTab =>
	typeof value === "string" && FINANCE_TAB_VALUES.includes(value as FinanceTab);
