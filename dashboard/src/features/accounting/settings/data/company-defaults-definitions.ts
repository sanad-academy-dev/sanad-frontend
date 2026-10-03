import type { UpdateCompanyAccountingSettingsFormInput } from "@/server/accounting/company-settings/company-settings.type";

/**
 * [P2-fix] Company accounting defaults (BRD §4.1) — the UI registry for the
 * `ClinicAccountingSettings` fields the PATCH API has supported since P0.1 but no screen
 * exposed (the round-off account gap found in the Phase-2 click-through).
 *
 * Same registry-driven pattern as the §19 flags on this page: adding a default later means
 * one entry here, no per-field JSX. Labels live in the registry (settings-area precedent —
 * the §19 definitions do the same) and the locale picks the variant.
 *
 * `defaultPaymentTermsTemplateId` joined at [P3.5] with its master — the full PATCH
 * surface is now covered.
 */

export type CompanyDefaultsKey = keyof UpdateCompanyAccountingSettingsFormInput;

export type CompanyDefaultKind =
	/** postable ledger accounts only (!isGroup && !freezeAccount && !disabled) */
	| "account"
	/** leaf cost centers (!isGroup && !disabled) */
	| "costCenter"
	| "financeBook"
	| "paymentTermsTemplate"
	| "currency"
	/** decimal-as-string money input (contract C2) */
	| "money"
	| "boolean";

export type CompanyDefaultDefinition = {
	kind: CompanyDefaultKind;
	group: (typeof COMPANY_DEFAULTS_GROUPS)[number]["id"];
	labelAr: string;
	labelEn: string;
	descriptionAr: string;
	descriptionEn: string;
};

export const COMPANY_DEFAULTS_GROUPS = [
	{
		id: "currency",
		labelAr: "العملة",
		labelEn: "Currency",
	},
	{
		id: "defaultAccounts",
		labelAr: "الحسابات الافتراضية",
		labelEn: "Default accounts",
	},
	{
		id: "rounding",
		labelAr: "التقريب والشطب والخصم",
		labelEn: "Rounding, write-off & discount",
	},
	{
		id: "advanced",
		labelAr: "حسابات متقدمة (فروق الصرف والمؤجلات والدُفعات المقدمة)",
		labelEn: "Advanced accounts (FX, deferrals & advances)",
	},
	{
		id: "dimensions",
		labelAr: "الأبعاد والدفاتر",
		labelEn: "Dimensions & books",
	},
	{
		id: "credit",
		labelAr: "الائتمان",
		labelEn: "Credit",
	},
] as const;

export const COMPANY_DEFAULTS_DEFINITIONS: Record<
	CompanyDefaultsKey,
	CompanyDefaultDefinition
> = {
	defaultCurrencyCode: {
		kind: "currency",
		group: "currency",
		labelAr: "العملة الافتراضية",
		labelEn: "Default currency",
		descriptionAr: "عملة دفتر الأستاذ الأساسية للمنشأة — تحدد دقة المبالغ عند الترحيل",
		descriptionEn: "The company's base ledger currency — sets posting precision",
	},
	defaultCashAccountId: {
		kind: "account",
		group: "defaultAccounts",
		labelAr: "حساب النقدية الافتراضي",
		labelEn: "Default cash account",
		descriptionAr: "يُقترح تلقائيًا في القيود النقدية وسندات القبض والصرف",
		descriptionEn: "Suggested automatically on cash entries and payment vouchers",
	},
	defaultBankAccountId: {
		kind: "account",
		group: "defaultAccounts",
		labelAr: "حساب البنك الافتراضي",
		labelEn: "Default bank account",
		descriptionAr: "يُقترح تلقائيًا في القيود البنكية والتحويلات",
		descriptionEn: "Suggested automatically on bank entries and transfers",
	},
	defaultIncomeAccountId: {
		kind: "account",
		group: "defaultAccounts",
		labelAr: "حساب الإيرادات الافتراضي",
		labelEn: "Default income account",
		descriptionAr: "يُستخدم عندما لا يحدد بند الفاتورة حساب إيراد خاصًا به",
		descriptionEn: "Used when an invoice line does not carry its own income account",
	},
	defaultExpenseAccountId: {
		kind: "account",
		group: "defaultAccounts",
		labelAr: "حساب المصروفات الافتراضي",
		labelEn: "Default expense account",
		descriptionAr: "يُستخدم عندما لا يحدد بند المشتريات حساب مصروف خاصًا به",
		descriptionEn: "Used when a purchase line does not carry its own expense account",
	},
	defaultReceivableAccountId: {
		kind: "account",
		group: "defaultAccounts",
		labelAr: "حساب الذمم المدينة الافتراضي",
		labelEn: "Default receivable account",
		descriptionAr: "آخر مستوى في ترتيب حسم حساب العميل (BR-4.10.1)",
		descriptionEn: "The last level of the customer account resolution order (BR-4.10.1)",
	},
	defaultPayableAccountId: {
		kind: "account",
		group: "defaultAccounts",
		labelAr: "حساب الذمم الدائنة الافتراضي",
		labelEn: "Default payable account",
		descriptionAr: "آخر مستوى في ترتيب حسم حساب المورّد (BR-4.10.1)",
		descriptionEn: "The last level of the supplier account resolution order (BR-4.10.1)",
	},
	roundOffAccountId: {
		kind: "account",
		group: "rounding",
		labelAr: "حساب التقريب",
		labelEn: "Round-off account",
		descriptionAr:
			"يستوعب فروق التقريب الصغيرة عند الترحيل — مطلوب لسطر التقريب التلقائي (§6)",
		descriptionEn:
			"Absorbs tiny posting differences — required for the automatic round-off line (§6)",
	},
	roundOffForOpeningAccountId: {
		kind: "account",
		group: "rounding",
		labelAr: "حساب تقريب القيود الافتتاحية",
		labelEn: "Round-off for opening account",
		descriptionAr: "إلزامي لموازنة فروق القيود الافتتاحية (BR-4.1.1)",
		descriptionEn: "Mandatory to balance opening-entry differences (BR-4.1.1)",
	},
	roundOffCostCenterId: {
		kind: "costCenter",
		group: "rounding",
		labelAr: "مركز تكلفة التقريب",
		labelEn: "Round-off cost center",
		descriptionAr: "يُسند إليه سطر التقريب التلقائي",
		descriptionEn: "Assigned to the automatic round-off line",
	},
	writeOffAccountId: {
		kind: "account",
		group: "rounding",
		labelAr: "حساب الشطب",
		labelEn: "Write-off account",
		descriptionAr: "لشطب الأرصدة الصغيرة عند سداد الفواتير",
		descriptionEn: "For writing off small balances when settling invoices",
	},
	defaultDiscountAccountId: {
		kind: "account",
		group: "rounding",
		labelAr: "حساب الخصم الافتراضي",
		labelEn: "Default discount account",
		descriptionAr: "حساب خصومات الفواتير عند عدم تحديد حساب خاص",
		descriptionEn: "Invoice discount account when none is set on the document",
	},
	exchangeGainLossAccountId: {
		kind: "account",
		group: "advanced",
		labelAr: "حساب أرباح/خسائر الصرف",
		labelEn: "Exchange gain/loss account",
		descriptionAr: "فروق الصرف المحققة — يعمل مع تعدد العملات (المرحلة P8)",
		descriptionEn: "Realized FX differences — active with multi-currency (phase P8)",
	},
	unrealizedExchangeGainLossAccountId: {
		kind: "account",
		group: "advanced",
		labelAr: "حساب أرباح/خسائر الصرف غير المحققة",
		labelEn: "Unrealized exchange gain/loss account",
		descriptionAr: "فروق إعادة تقييم العملات غير المحققة (المرحلة P8)",
		descriptionEn: "Unrealized revaluation differences (phase P8)",
	},
	unrealizedProfitLossAccountId: {
		kind: "account",
		group: "advanced",
		labelAr: "حساب الأرباح/الخسائر غير المحققة",
		labelEn: "Unrealized profit/loss account",
		descriptionAr: "للأرباح غير المحققة بين الفروع الداخلية",
		descriptionEn: "For unrealized internal profit",
	},
	defaultDeferredRevenueAccountId: {
		kind: "account",
		group: "advanced",
		labelAr: "حساب الإيرادات المؤجلة الافتراضي",
		labelEn: "Default deferred revenue account",
		descriptionAr: "للإيرادات المؤجلة عند تفعيلها",
		descriptionEn: "For deferred revenue when enabled",
	},
	defaultDeferredExpenseAccountId: {
		kind: "account",
		group: "advanced",
		labelAr: "حساب المصروفات المؤجلة الافتراضي",
		labelEn: "Default deferred expense account",
		descriptionAr: "للمصروفات المؤجلة عند تفعيلها",
		descriptionEn: "For deferred expense when enabled",
	},
	defaultAdvanceReceivedAccountId: {
		kind: "account",
		group: "advanced",
		labelAr: "حساب الدُفعات المقدمة المستلمة",
		labelEn: "Advance received account",
		descriptionAr: "التزامات الدُفعات المقدمة من العملاء (المرحلة P7)",
		descriptionEn: "Liability for customer advances (phase P7)",
	},
	defaultAdvancePaidAccountId: {
		kind: "account",
		group: "advanced",
		labelAr: "حساب الدُفعات المقدمة المدفوعة",
		labelEn: "Advance paid account",
		descriptionAr: "أصول الدُفعات المقدمة للمورّدين (المرحلة P7)",
		descriptionEn: "Asset for supplier advances (phase P7)",
	},
	defaultCostCenterId: {
		kind: "costCenter",
		group: "dimensions",
		labelAr: "مركز التكلفة الافتراضي",
		labelEn: "Default cost center",
		descriptionAr: "يُقترح تلقائيًا على سطور المستندات عند غيابه",
		descriptionEn: "Suggested automatically on document lines when missing",
	},
	defaultFinanceBookId: {
		kind: "financeBook",
		group: "dimensions",
		labelAr: "الدفتر المالي الافتراضي",
		labelEn: "Default finance book",
		descriptionAr: "يُسند إلى قيود الأستاذ عند غيابه على المستند",
		descriptionEn: "Stamped on ledger entries when the document carries none",
	},
	defaultPaymentTermsTemplateId: {
		kind: "paymentTermsTemplate",
		group: "credit",
		labelAr: "قالب شروط الدفع الافتراضي",
		labelEn: "Default payment terms template",
		descriptionAr: "يولّد جدول الاستحقاق عند غياب قالب على المستند أو الطرف (BR-4.9.1)",
		descriptionEn: "Generates the payment schedule when doc and party carry none (BR-4.9.1)",
	},
	creditLimit: {
		kind: "money",
		group: "credit",
		labelAr: "حد الائتمان الافتراضي",
		labelEn: "Default credit limit",
		descriptionAr: "الحد الافتراضي للعملاء الذين لا يحملون حدًا خاصًا (صفر = بلا حد)",
		descriptionEn: "Fallback limit for customers without their own (zero = unlimited)",
	},
	bypassCreditLimitCheck: {
		kind: "boolean",
		group: "credit",
		labelAr: "تجاوز فحص حد الائتمان",
		labelEn: "Bypass credit limit check",
		descriptionAr: "إيقاف فحص حد الائتمان عند الترحيل على مستوى المنشأة",
		descriptionEn: "Disables the credit-limit check company-wide",
	},
};

export const COMPANY_DEFAULTS_KEYS = Object.keys(
	COMPANY_DEFAULTS_DEFINITIONS,
) as CompanyDefaultsKey[];
