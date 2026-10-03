import { z } from "zod";

import type { Prisma } from "@/generated/prisma/client";

/**
 * [P0.4] Accounts Settings — the ERPNext-equivalent accounting flag set (BRD §19).
 *
 * Every key of §19 is declared here once, with its value type, default, group and the BRD
 * clause it serves. The registry is the single source of truth: the DB stores only
 * `(clinicId, key, value)` strings, and every read/write is decoded/validated through these
 * definitions — an unknown key or an out-of-range value never reaches the table. Types for
 * the service, the API and the settings screen are all *derived* from it, so adding a key
 * here is the only edit a new flag needs.
 *
 * **Role-typed §19 keys are deliberately absent.** §19 lists a frozen-accounts-modifier
 * role, a credit-controller role and an over-billing role; [P0.3] resolved those to
 * permission slugs on `StaffRole` (`ACCOUNTING_ROLES`), because this repo has no global
 * role registry. Storing a role *name* here too would give the same rule two homes. The
 * numeric `over_billing_allowance` below is the settings half of that pair. The internal-
 * transfer rate-override role (§19, `maintain_same_internal_transaction_rate`) is left for
 * P12.8 when inter-company transactions land, rather than guessed at now.
 *
 * Flags whose engine is not built yet are still shipped (BRD §22 requires the full flag
 * set) and tagged with the phase that consumes them.
 */

export type AccountsSettingType =
	| "boolean"
	| "int"
	| "decimal"
	| "date"
	| "enum"
	| "string"
	| "string_list";

type BaseDefinition = {
	group: AccountsSettingsGroupId;
	labelAr: string;
	labelEn: string;
	descriptionAr: string;
	descriptionEn: string;
	/** governing BRD clause */
	brd: string;
	/** phase whose code consumes the flag — omitted when it is already live */
	phase?: string;
	/**
	 * [LY-P0] المفتاح **متجاوَز**: بقي في السجلّ لأنّ §19 يُلزم بمجموعة مفاتيح ERPNext
	 * كاملة («Full flag set»، مصفوفة التتبّع §22)، لكنّ سلوكه انتقل إلى مكانٍ آخر.
	 *
	 * لماذا لم يُحذف: حذفه كان سيكسر تعاقدًا معلَنًا في BRD وحدةٍ أخرى — وقاعدة CLAUDE.md
	 * السادسة تمنع نقض BRD بصمت. ولماذا لا يُترك كما هو: الشاشة ترسم **كل** مفتاح في
	 * السجلّ بلا استثناء، فكان مفتاحًا حيًّا يُقلَب ولا يفعل شيئًا — وبعد وصول مفتاح
	 * الولاء الحقيقي كان المستخدم سيرى مفتاحين متشابهين أحدهما كاذب.
	 *
	 * القيمة نصٌّ عربيّ يُعرض للمستخدم يقول أين المفتاح الحقيقي، والشاشة تعطّل التحكّم.
	 */
	supersededBy?: string;
};

export type AccountsSettingDefinition = BaseDefinition &
	(
		| { type: "boolean"; default: boolean }
		| { type: "int"; default: number; min?: number; max?: number }
		| { type: "decimal"; default: string }
		| { type: "date"; default: string | null }
		| { type: "enum"; options: readonly string[]; default: string }
		| { type: "string"; default: string }
		| { type: "string_list"; default: readonly string[] }
	);

export const ACCOUNTS_SETTINGS_GROUPS = [
	{ id: "ledger", labelAr: "الدفتر والترحيل", labelEn: "Ledger & Posting" },
	{ id: "period", labelAr: "التجميد وإقفال الفترات", labelEn: "Period Control" },
	{ id: "receivables", labelAr: "الذمم والمدفوعات", labelEn: "Receivables & Payments" },
	{ id: "invoicing", labelAr: "الفوترة والضرائب", labelEn: "Invoicing & Tax" },
	{ id: "printing", labelAr: "الطباعة", labelEn: "Printing" },
	{ id: "currency", labelAr: "العملات وأسعار الصرف", labelEn: "Currency & Exchange" },
	{ id: "reconciliation", labelAr: "التسوية", labelEn: "Reconciliation" },
	{ id: "deferred", labelAr: "الاستحقاق المؤجل", labelEn: "Deferred Accounting" },
	{ id: "features", labelAr: "تفعيل الخصائص", labelEn: "Feature Toggles" },
] as const;

export type AccountsSettingsGroupId = (typeof ACCOUNTS_SETTINGS_GROUPS)[number]["id"];

export const ACCOUNTS_SETTINGS_DEFINITIONS = {
	// ── الدفتر والترحيل ─────────────────────────────────────────────────────────────────
	enable_immutable_ledger: {
		group: "ledger",
		type: "boolean",
		default: false,
		labelAr: "الدفتر غير القابل للتعديل",
		labelEn: "Enable immutable ledger",
		descriptionAr:
			"عند التفعيل تبقى القيود الأصلية سارية ويُضاف عكسها بتاريخ الإلغاء؛ وعند الإيقاف (الوضع الافتراضي) تُعلَّم القيود الأصلية وعكسها كملغاة.",
		descriptionEn:
			"When on, original entries stay live and a reversal is posted at the cancellation date; when off (default) the original and its mirror are both flagged cancelled.",
		brd: "AR-2",
		phase: "P2.3",
	},
	merge_similar_account_heads: {
		group: "ledger",
		type: "boolean",
		default: true,
		labelAr: "دمج القيود المتشابهة",
		labelEn: "Merge similar account heads",
		descriptionAr: "دمج أسطر القيد المتطابقة في المفتاح قبل الحفظ لتقليل عدد الأسطر.",
		descriptionEn:
			"Merge ledger rows that share the same merge key before persisting, to keep entry counts down.",
		brd: "§6 step 5b",
		phase: "P2.2",
	},
	delete_linked_ledger_entries: {
		group: "ledger",
		type: "boolean",
		default: false,
		labelAr: "حذف القيود المرتبطة عند حذف المستند",
		labelEn: "Delete linked ledger entries",
		descriptionAr: "خطير — يحذف قيود الأستاذ نهائيًا بدل الإبقاء على أثر التدقيق. يُترك مغلقًا.",
		descriptionEn:
			"Dangerous — hard-deletes ledger entries instead of preserving the audit trail. Leave off.",
		brd: "§19",
	},
	ignore_account_closing_balance: {
		group: "ledger",
		type: "boolean",
		default: false,
		labelAr: "تجاهل أرصدة الإقفال المخزّنة",
		labelEn: "Ignore account closing balance",
		descriptionAr:
			"تجاوز مسار الأرصدة المخزّنة في تقارير الميزانية والاعتماد على القيود مباشرة.",
		descriptionEn:
			"Bypass the stored closing-balance fast path and read balance-sheet figures straight from the ledger.",
		brd: "§5.3",
		phase: "P10.2",
	},
	auto_create_fiscal_year: {
		group: "ledger",
		type: "boolean",
		default: true,
		labelAr: "إنشاء السنة المالية التالية تلقائيًا",
		labelEn: "Auto-create next fiscal year",
		descriptionAr:
			"قرب نهاية السنة المالية يُنشئ النظام السنة التالية تلقائيًا — لا يُرحَّل شيء فعليًا؛ الأرصدة الافتتاحية تُشتق من الدفاتر (FR-12.5).",
		descriptionEn:
			"Near fiscal-year end the system creates the next year automatically — nothing is carried physically; opening balances derive from the ledger (FR-12.5).",
		brd: "FR-12.5",
		phase: "P10.5",
	},
	ignore_is_opening_check_for_reporting: {
		group: "ledger",
		type: "boolean",
		default: false,
		labelAr: "السماح بالقيود الافتتاحية بعد الإقفال (لأغراض التقارير)",
		labelEn: "Ignore is-opening check for reporting",
		descriptionAr:
			"يسمح بترحيل قيود افتتاحية بتاريخ يسبق آخر سند إقفال — لتصحيحات الأرصدة الافتتاحية فقط (BR-12.4).",
		descriptionEn:
			"Allow all-opening batches to post on/before the last Period Closing Voucher — opening-balance corrections only (BR-12.4).",
		brd: "BR-12.4",
		phase: "P10.2",
	},
	general_ledger_remarks_length: {
		group: "ledger",
		type: "int",
		default: 0,
		min: 0,
		max: 1000,
		labelAr: "حد طول الملاحظات في الأستاذ العام",
		labelEn: "GL remarks length limit",
		descriptionAr: "صفر يعني بلا حد.",
		descriptionEn: "Zero means no limit.",
		brd: "§5.1",
		phase: "P2.1",
	},
	receivable_payable_remarks_length: {
		group: "ledger",
		type: "int",
		default: 0,
		min: 0,
		max: 1000,
		labelAr: "حد طول الملاحظات في الذمم",
		labelEn: "AR/AP remarks length limit",
		descriptionAr: "صفر يعني بلا حد.",
		descriptionEn: "Zero means no limit.",
		brd: "§5.2",
		phase: "P3.2",
	},

	// ── التجميد وإقفال الفترات ──────────────────────────────────────────────────────────
	accounts_frozen_upto: {
		group: "period",
		type: "date",
		default: null,
		labelAr: "تجميد القيود حتى تاريخ",
		labelEn: "Accounts frozen upto",
		descriptionAr:
			"يمنع أي ترحيل أو إلغاء بتاريخ ترحيل ≤ هذا التاريخ، إلا لمن يملك صلاحية «تعديل الفترات المجمّدة».",
		descriptionEn:
			"Blocks any posting or cancellation dated on or before this date, except for holders of the frozen-accounts modifier permission.",
		brd: "FR-12.1",
		phase: "P2.8",
	},
	period_closing_voucher_job_timeout: {
		group: "period",
		type: "int",
		default: 3600,
		min: 60,
		max: 86400,
		labelAr: "مهلة مهمة سند الإقفال (ثانية)",
		labelEn: "Period Closing Voucher job timeout (s)",
		descriptionAr: "الحد الأقصى لزمن تنفيذ مهمة الإقفال في الخلفية قبل اعتبارها فاشلة.",
		descriptionEn:
			"Maximum runtime for the background closing job before it is marked failed.",
		brd: "FR-12.3",
		phase: "P10.2",
	},
	confirm_before_resetting_posting_date: {
		group: "period",
		type: "boolean",
		default: true,
		labelAr: "تأكيد قبل تغيير تاريخ الترحيل",
		labelEn: "Confirm before resetting posting date",
		descriptionAr: "طلب تأكيد صريح عند تعديل تاريخ ترحيل مستند.",
		descriptionEn: "Ask for explicit confirmation when a document's posting date is changed.",
		brd: "§19",
	},

	// ── الذمم والمدفوعات ────────────────────────────────────────────────────────────────
	unlink_payment_on_cancellation_of_invoice: {
		group: "receivables",
		type: "boolean",
		default: true,
		labelAr: "فك ارتباط الدفعات عند إلغاء الفاتورة",
		labelEn: "Unlink payment on cancellation of invoice",
		descriptionAr: "عند الإيقاف يُمنع إلغاء فاتورة مرتبطة بدفعة بدل فك الارتباط تلقائيًا.",
		descriptionEn:
			"When off, cancelling an invoice that has linked payments is blocked instead of auto-unlinking them.",
		brd: "BR-10.4",
		phase: "P7.8",
	},
	unlink_advance_payment_on_cancelation_of_order: {
		group: "receivables",
		type: "boolean",
		default: false,
		labelAr: "فك ارتباط الدفعة المقدمة عند إلغاء الطلب",
		labelEn: "Unlink advance payment on cancellation of order",
		descriptionAr: "يحكم إلغاء الطلبات المرتبطة بدفعات مقدمة.",
		descriptionEn: "Governs cancellation of orders that carry advance payments.",
		brd: "BR-10.4",
		phase: "P7.8",
	},
	make_payment_via_journal_entry: {
		group: "receivables",
		type: "boolean",
		default: false,
		labelAr: "إنشاء المدفوعات كقيد يومية",
		labelEn: "Make payment via Journal Entry",
		descriptionAr: "استخدام قيد يومية بدل سند القبض/الصرف عند تسجيل الدفع.",
		descriptionEn: "Record payments as journal entries instead of payment entries.",
		brd: "§19",
		phase: "P7.1",
	},
	automatically_fetch_payment_terms: {
		group: "receivables",
		type: "boolean",
		default: false,
		labelAr: "جلب شروط الدفع تلقائيًا",
		labelEn: "Automatically fetch payment terms",
		descriptionAr: "تعبئة جدول الاستحقاق من قالب شروط الدفع عند حفظ الفاتورة.",
		descriptionEn:
			"Fill the payment schedule from the payment-terms template when an invoice is saved.",
		brd: "BR-4.9.1",
		phase: "P5.4",
	},
	default_ageing_range: {
		group: "receivables",
		type: "string",
		default: "30, 60, 90, 120",
		labelAr: "فترات أعمار الديون الافتراضية",
		labelEn: "Default ageing range",
		descriptionAr: "حدود شرائح أعمار الديون بالأيام، مفصولة بفواصل.",
		descriptionEn: "Ageing bucket boundaries in days, comma separated.",
		brd: "§18.3",
		phase: "P9.3",
	},

	// ── الفوترة والضرائب ────────────────────────────────────────────────────────────────
	check_supplier_invoice_uniqueness: {
		group: "invoicing",
		type: "boolean",
		default: false,
		labelAr: "التحقق من عدم تكرار فاتورة المورّد",
		labelEn: "Check supplier invoice uniqueness",
		descriptionAr: "منع تكرار رقم فاتورة المورّد لنفس المورّد داخل المنشأة.",
		descriptionEn:
			"Reject a duplicate supplier bill number for the same supplier within the company.",
		brd: "BR-7.3.1",
		phase: "P6.1",
	},
	over_billing_allowance: {
		group: "invoicing",
		type: "decimal",
		default: "0",
		labelAr: "نسبة السماح بتجاوز الفوترة (%)",
		labelEn: "Over billing allowance (%)",
		descriptionAr:
			"النسبة المسموح بتجاوزها فوق قيمة الطلب/الاستلام؛ التجاوز الأكبر يحتاج صلاحية «تجاوز حد الفوترة».",
		descriptionEn:
			"Percentage a document may exceed its order/receipt by; anything beyond needs the over-billing permission.",
		brd: "§19",
		phase: "P5.2",
	},
	add_taxes_from_item_tax_template: {
		group: "invoicing",
		type: "boolean",
		default: true,
		labelAr: "إضافة الضرائب من قالب ضريبة الصنف",
		labelEn: "Add taxes from Item Tax Template",
		descriptionAr: "إدراج صفوف الضريبة الناقصة من قالب ضريبة الصنف.",
		descriptionEn: "Insert missing tax rows from the item's tax template.",
		brd: "§8 step 5",
		phase: "P4.2",
	},
	add_taxes_from_taxes_and_charges_template: {
		group: "invoicing",
		type: "boolean",
		default: true,
		labelAr: "إضافة الضرائب من قالب الضرائب والرسوم",
		labelEn: "Add taxes from Taxes and Charges Template",
		descriptionAr: "تعبئة صفوف الضريبة من القالب الافتراضي عند إنشاء المستند.",
		descriptionEn: "Populate tax rows from the default template when a document is created.",
		brd: "§4.11",
		phase: "P4.2",
	},
	determine_address_tax_category_from: {
		group: "invoicing",
		type: "enum",
		options: ["Billing Address", "Shipping Address"],
		default: "Billing Address",
		labelAr: "مصدر فئة الضريبة من العنوان",
		labelEn: "Determine address tax category from",
		descriptionAr: "أي عنوان يُستخدم لاختيار فئة الضريبة عند مطابقة قواعد الضريبة.",
		descriptionEn: "Which address decides the tax category when matching tax rules.",
		brd: "§4.11",
		phase: "P4.1",
	},
	round_row_wise_tax: {
		group: "invoicing",
		type: "boolean",
		default: false,
		labelAr: "تقريب الضريبة لكل صف",
		labelEn: "Round row-wise tax",
		descriptionAr: "تقريب مبلغ الضريبة على مستوى الصف بدل المجموع فقط.",
		descriptionEn: "Round the tax amount per row rather than only on the total.",
		brd: "§8 step 6",
		phase: "P4.2",
	},
	book_tax_discount_loss: {
		group: "invoicing",
		type: "boolean",
		default: false,
		labelAr: "ترحيل فرق ضريبة الخصم",
		labelEn: "Book tax discount loss",
		descriptionAr: "ترحيل الجزء الضريبي من الخصم إلى حساب مستقل.",
		descriptionEn: "Post the tax portion of a discount to a separate account.",
		brd: "§8 step 8",
		phase: "P5.3",
	},
	enable_discount_accounting: {
		group: "invoicing",
		type: "boolean",
		default: false,
		labelAr: "محاسبة الخصومات",
		labelEn: "Enable discount accounting",
		descriptionAr: "ترحيل الخصم إلى حساب خصم مستقل بدل تخفيض الإيراد مباشرة.",
		descriptionEn:
			"Post discounts to a dedicated discount account instead of netting them off income.",
		brd: "§7.2 posting map row 7",
		phase: "P5.3",
	},

	// ── الطباعة ─────────────────────────────────────────────────────────────────────────
	show_inclusive_tax_in_print: {
		group: "printing",
		type: "boolean",
		default: false,
		labelAr: "إظهار الضريبة المتضمَّنة في الطباعة",
		labelEn: "Show inclusive tax in print",
		descriptionAr: "إظهار مبلغ الضريبة المتضمَّنة في السعر ضمن نسخة الطباعة.",
		descriptionEn: "Show the tax included in the rate on the printed document.",
		brd: "§19",
		phase: "P5.9",
	},
	show_payment_schedule_in_print: {
		group: "printing",
		type: "boolean",
		default: false,
		labelAr: "إظهار جدول الاستحقاق في الطباعة",
		labelEn: "Show payment schedule in print",
		descriptionAr: "طباعة أقساط الاستحقاق ضمن الفاتورة.",
		descriptionEn: "Print the instalment schedule on the invoice.",
		brd: "§19",
		phase: "P5.9",
	},
	show_taxes_as_table_in_print: {
		group: "printing",
		type: "boolean",
		default: false,
		labelAr: "إظهار الضرائب كجدول في الطباعة",
		labelEn: "Show taxes as table in print",
		descriptionAr: "عرض تفصيل الضرائب في جدول مستقل عند الطباعة.",
		descriptionEn: "Render the tax breakdown as its own table when printing.",
		brd: "§19",
		phase: "P5.9",
	},

	// ── العملات وأسعار الصرف ────────────────────────────────────────────────────────────
	allow_stale: {
		group: "currency",
		type: "boolean",
		default: true,
		labelAr: "السماح بسعر صرف قديم",
		labelEn: "Allow stale exchange rates",
		descriptionAr: "عند الإيقاف تُمنع الحركة إذا كان أحدث سعر صرف أقدم من المدة المحددة.",
		descriptionEn:
			"When off, transactions are blocked if the latest exchange rate is older than the configured window.",
		brd: "§4.7",
		phase: "P1.8",
	},
	stale_days: {
		group: "currency",
		type: "int",
		default: 1,
		min: 0,
		max: 365,
		labelAr: "مدة صلاحية سعر الصرف (يوم)",
		labelEn: "Stale days",
		descriptionAr: "عدد الأيام التي يُعتبر بعدها سعر الصرف قديمًا.",
		descriptionEn: "Number of days after which an exchange rate counts as stale.",
		brd: "§4.7",
		phase: "P1.8",
	},
	allow_multi_currency_invoices_against_single_party_account: {
		group: "currency",
		type: "boolean",
		default: false,
		labelAr: "السماح بعملات متعددة على حساب طرف واحد",
		labelEn: "Allow multi-currency invoices against single party account",
		descriptionAr: "تجاوز قاعدة توحيد عملة حساب الطرف بعد أول حركة.",
		descriptionEn:
			"Override the rule that fixes a party account's currency after its first entry.",
		brd: "BR-4.10.2",
		phase: "P8.3",
	},
	rate_provider: {
		group: "currency",
		type: "enum",
		options: ["None", "frankfurter.dev"],
		default: "None",
		labelAr: "مزوّد أسعار الصرف",
		labelEn: "Exchange rate provider",
		descriptionAr: "المصدر الآلي لأسعار الصرف (§4.7) — «None» يعتمد الأسعار اليدوية فقط.",
		descriptionEn: "Automatic rate source (§4.7); None keeps manual rates only.",
		brd: "§4.7",
		phase: "P8.5",
	},
	exchange_gain_loss_posting_date: {
		group: "currency",
		type: "enum",
		options: ["Invoice", "Payment", "Reconciliation Date"],
		default: "Reconciliation Date",
		labelAr: "تاريخ ترحيل فروق الصرف",
		labelEn: "Exchange gain/loss posting date",
		descriptionAr: "التاريخ المستخدم لقيد فرق سعر الصرف المحقق.",
		descriptionEn: "Date used for the realised exchange gain/loss entry.",
		brd: "BR-7.4.4",
		phase: "P8.2",
	},
	maintain_same_internal_transaction_rate: {
		group: "currency",
		type: "boolean",
		default: false,
		labelAr: "توحيد سعر الصرف في الحركات الداخلية",
		labelEn: "Maintain same internal transaction rate",
		descriptionAr: "إلزام الطرفين في الحركات بين الشركات بنفس سعر الصرف.",
		descriptionEn:
			"Force both sides of an inter-company transaction to use the same exchange rate.",
		brd: "FR-9.1",
		phase: "P12.8",
	},
	maintain_same_rate_action: {
		group: "currency",
		type: "enum",
		options: ["Stop", "Warn"],
		default: "Stop",
		labelAr: "إجراء اختلاف السعر الداخلي",
		labelEn: "Maintain same rate action",
		descriptionAr: "منع الحفظ أو الاكتفاء بتنبيه عند اختلاف السعر.",
		descriptionEn: "Block the save or only warn when the rates differ.",
		brd: "FR-9.1",
		phase: "P12.8",
	},

	// ── التسوية ─────────────────────────────────────────────────────────────────────────
	auto_reconcile_payments: {
		group: "reconciliation",
		type: "boolean",
		default: true,
		labelAr: "التسوية التلقائية للمدفوعات",
		labelEn: "Auto reconcile payments",
		descriptionAr: "تشغيل مهمة مطابقة الدفعات بالفواتير دوريًا.",
		descriptionEn: "Run the payment-to-invoice matching job on a schedule.",
		brd: "FR-10.2",
		phase: "P12.7",
	},
	reconciliation_queue_size: {
		group: "reconciliation",
		type: "int",
		default: 5,
		min: 1,
		max: 100,
		labelAr: "حجم دفعة التسوية",
		labelEn: "Reconciliation queue size",
		descriptionAr: "عدد السجلات التي تعالجها المهمة في الدفعة الواحدة.",
		descriptionEn: "How many records the job processes per batch.",
		brd: "FR-10.1",
		phase: "P7.6",
	},
	auto_reconciliation_job_trigger: {
		group: "reconciliation",
		type: "int",
		default: 15,
		min: 1,
		max: 1440,
		labelAr: "تكرار مهمة التسوية (دقيقة)",
		labelEn: "Auto reconciliation job trigger (min)",
		descriptionAr: "الفاصل الزمني بين تشغيلات مهمة التسوية التلقائية.",
		descriptionEn: "Interval between runs of the auto-reconciliation job.",
		brd: "FR-10.2",
		phase: "P12.7",
	},
	enable_party_matching: {
		group: "reconciliation",
		type: "boolean",
		default: false,
		labelAr: "مطابقة الأطراف في التسوية البنكية",
		labelEn: "Enable party matching",
		descriptionAr: "ترشيح المستندات المرشّحة اعتمادًا على اسم الطرف في الحركة البنكية.",
		descriptionEn: "Use the party name on a bank transaction to narrow candidate vouchers.",
		brd: "FR-14.2",
		phase: "P11.3",
	},
	enable_fuzzy_matching: {
		group: "reconciliation",
		type: "boolean",
		default: false,
		labelAr: "المطابقة التقريبية",
		labelEn: "Enable fuzzy matching",
		descriptionAr: "السماح بمطابقة الأوصاف المتقاربة لا المطابقة الحرفية فقط.",
		descriptionEn: "Allow near-matching descriptions rather than exact matches only.",
		brd: "FR-14.2",
		phase: "P11.3",
	},
	enable_bank_transaction_rules: {
		group: "reconciliation",
		type: "boolean",
		default: false,
		labelAr: "قواعد الحركات البنكية",
		labelEn: "Enable bank transaction rules",
		descriptionAr:
			"تفعيل محرك القواعد المرتّبة لتصنيف حركات الكشف وإنشاء قيودها تلقائيًا (FR-14.3).",
		descriptionEn:
			"Enable the ordered rules engine that auto-classifies statement rows and books their entries.",
		brd: "FR-14.3",
		phase: "P11.5",
	},
	automatically_run_rules_on_unreconciled_transactions: {
		group: "reconciliation",
		type: "boolean",
		default: false,
		labelAr: "تشغيل القواعد تلقائيًا بعد الاستيراد",
		labelEn: "Automatically run rules on unreconciled transactions",
		descriptionAr: "تشغيل جولة القواعد على الحركات غير المسوّاة مباشرة بعد كل استيراد كشف.",
		descriptionEn:
			"Run the rules sweep on unreconciled transactions right after every import.",
		brd: "FR-14.3",
		phase: "P11.5",
	},
	transfer_match_days: {
		group: "reconciliation",
		type: "int",
		default: 2,
		labelAr: "نافذة مطابقة التحويلات الداخلية (أيام)",
		labelEn: "Transfer match days",
		descriptionAr: "أقصى فارق أيام بين ساقي تحويل داخلي بين حسابين بنكيين حتى يُقترَح الإقران.",
		descriptionEn:
			"Maximum day gap between the two legs of an internal bank transfer for pairing.",
		brd: "FR-14.2",
		phase: "P11.3",
	},

	// ── محولات الوحدات التشغيلية (§C3, [P12A.2]) ────────────────────────────────────────
	enable_clinic_invoice_adapter: {
		group: "features",
		type: "boolean",
		default: false,
		labelAr: "تفعيل محول فواتير الأكاديمية",
		labelEn: "Enable clinic invoice adapter",
		descriptionAr:
			"ترحيل فواتير الأكاديمية التشغيلية المدفوعة إلى دفتر الأستاذ عبر جولات المحول — إيقافه يجمّد الترحيل دون المساس بالتشغيل.",
		descriptionEn:
			"Post paid operational clinic invoices into the ledger via adapter runs — OFF freezes posting without touching operations.",
		brd: "§C3",
		phase: "P12A.2",
	},
	enable_expense_adapter: {
		group: "features",
		type: "boolean",
		default: false,
		labelAr: "تفعيل محول المصروفات",
		labelEn: "Enable expense adapter",
		descriptionAr:
			"ترحيل المصروفات التشغيلية المدفوعة إلى دفتر الأستاذ عبر جولات المحول — إيقافه يجمّد الترحيل دون المساس بالتشغيل.",
		descriptionEn:
			"Post paid operational expenses into the ledger via adapter runs — OFF freezes posting without touching operations.",
		brd: "§C3",
		phase: "P12A.2",
	},
	adapter_vat_account_id: {
		group: "features",
		type: "string",
		default: "",
		labelAr: "حساب ضريبة المحول",
		labelEn: "Adapter VAT account",
		descriptionAr:
			"معرّف حساب الضريبة الذي يستقبل ضريبة فواتير الأكاديمية المرحّلة — مطلوب متى حملت فاتورة ضريبة.",
		descriptionEn:
			"Ledger account id credited with VAT from adapted clinic invoices — required whenever an invoice carries VAT.",
		brd: "§C3",
		phase: "P12A.2",
	},
	enable_pos_sale_adapter: {
		group: "features",
		type: "boolean",
		default: false,
		labelAr: "تفعيل محول نقطة البيع",
		labelEn: "Enable POS sale adapter",
		descriptionAr:
			"ترحيل مبيعات نقطة البيع المدفوعة إلى دفتر الأستاذ عبر جولات المحول — إيقافه يجمّد الترحيل دون المساس بالبيع.",
		descriptionEn:
			"Post paid point-of-sale sales into the ledger via adapter runs — OFF freezes posting without touching selling.",
		brd: "§C3",
		phase: "P12B.4",
	},
	book_advance_payments_in_separate_party_account: {
		group: "features",
		type: "boolean",
		default: false,
		labelAr: "ترحيل الدفعات المقدمة إلى حساب منفصل",
		labelEn: "Book advance payments in a separate party account",
		descriptionAr:
			"باقي الدفعة غير المخصَّص يُقيَّد على «دفعات مقدمة مقبوضة/مدفوعة» بدل حساب الذمم، ولا ينتقل إلى الذمم إلا عند تخصيصه على فاتورة. إيقافه يُبقي السلوك الحالي كما هو تمامًا.",
		descriptionEn:
			"The unallocated remainder of a payment books to Advance Received/Paid instead of the AR/AP account, and moves to receivables only when applied to an invoice. OFF keeps today's behaviour bit-identical.",
		brd: "FR-11.3",
		phase: "P12.6",
	},
	default_advance_received_account_id: {
		group: "features",
		type: "string",
		default: "",
		labelAr: "حساب الدفعات المقدمة المقبوضة",
		labelEn: "Advance received account",
		descriptionAr:
			"حساب التزام يستقبل مقدَّمات العملاء — مطلوب لتفعيل الترحيل المنفصل على سندات القبض.",
		descriptionEn:
			"Liability account holding customer advances — required by separate booking on receive payments.",
		brd: "FR-11.3",
		phase: "P12.6",
	},
	default_advance_paid_account_id: {
		group: "features",
		type: "string",
		default: "",
		labelAr: "حساب الدفعات المقدمة المدفوعة",
		labelEn: "Advance paid account",
		descriptionAr:
			"حساب أصل يستقبل مقدَّمات الموردين — مطلوب لتفعيل الترحيل المنفصل على سندات الدفع.",
		descriptionEn:
			"Asset account holding supplier advances — required by separate booking on pay payments.",
		brd: "FR-11.3",
		phase: "P12.6",
	},
	adapter_cogs_account_id: {
		group: "features",
		type: "string",
		default: "",
		labelAr: "حساب تكلفة البضاعة المباعة",
		labelEn: "Cost of goods sold account",
		descriptionAr:
			"حساب المصروف الذي يُقيَّد عليه مدينًا بتكلفة أصناف نقطة البيع وقت صرفها (BRD §7.2 سطر 5) — مطلوب لتفعيل محول نقطة البيع.",
		descriptionEn:
			"Expense account debited with the valuation cost of POS items at issue (BRD §7.2 row 5) — required by the POS adapter.",
		brd: "§7.2",
		phase: "P12B.5",
	},
	adapter_stock_account_id: {
		group: "features",
		type: "string",
		default: "",
		labelAr: "حساب المخزون",
		labelEn: "Stock account",
		descriptionAr:
			"حساب الأصل الذي يُقيَّد عليه دائنًا بنفس التكلفة عند صرف أصناف نقطة البيع — الطرف المقابل لتكلفة البضاعة المباعة.",
		descriptionEn:
			"Asset account credited with the same cost when POS items are issued — the counter-leg of COGS.",
		brd: "§7.2",
		phase: "P12B.5",
	},

	// ── الاستحقاق المؤجل ────────────────────────────────────────────────────────────────
	automatically_process_deferred_accounting_entry: {
		group: "deferred",
		type: "boolean",
		default: true,
		labelAr: "معالجة الاستحقاق المؤجل تلقائيًا",
		labelEn: "Automatically process deferred accounting entry",
		descriptionAr: "تشغيل مهمة الاعتراف الشهري بالإيراد/المصروف المؤجل.",
		descriptionEn: "Run the monthly deferred revenue/expense recognition job.",
		brd: "§15",
		phase: "P12.2",
	},
	book_deferred_entries_via_journal_entry: {
		group: "deferred",
		type: "boolean",
		default: false,
		labelAr: "ترحيل الاستحقاق المؤجل عبر قيد يومية",
		labelEn: "Book deferred entries via Journal Entry",
		descriptionAr: "إنشاء قيود يومية بدل الترحيل المباشر إلى الأستاذ.",
		descriptionEn: "Create journal entries instead of posting straight to the ledger.",
		brd: "§15",
		phase: "P12.2",
	},
	submit_journal_entries: {
		group: "deferred",
		type: "boolean",
		default: false,
		labelAr: "ترحيل قيود الاستحقاق تلقائيًا",
		labelEn: "Submit journal entries",
		descriptionAr: "ترحيل القيود المُنشأة تلقائيًا بدل تركها مسودات.",
		descriptionEn:
			"Submit the generated entries automatically instead of leaving them as drafts.",
		brd: "§15",
		phase: "P12.2",
	},
	book_deferred_entries_based_on: {
		group: "deferred",
		type: "enum",
		options: ["Days", "Months"],
		default: "Days",
		labelAr: "أساس توزيع الاستحقاق المؤجل",
		labelEn: "Book deferred entries based on",
		descriptionAr: "توزيع المبلغ على الأيام أو على الأشهر.",
		descriptionEn: "Spread the amount over days or over months.",
		brd: "§15",
		phase: "P12.2",
	},
	book_asset_depreciation_entry_automatically: {
		group: "deferred",
		type: "boolean",
		default: true,
		labelAr: "ترحيل الإهلاك تلقائيًا",
		labelEn: "Book asset depreciation entry automatically",
		descriptionAr: "خاص بوحدة الأصول الثابتة عند إضافتها.",
		descriptionEn: "Applies to the fixed-assets module once it is added.",
		brd: "§19",
	},

	// ── تفعيل الخصائص ───────────────────────────────────────────────────────────────────
	enable_common_party_accounting: {
		group: "features",
		type: "boolean",
		default: false,
		labelAr: "محاسبة الطرف المشترك",
		labelEn: "Enable common party accounting",
		descriptionAr: "معاملة العميل والمورّد المرتبطين كطرف واحد وترحيل قيد المقاصة.",
		descriptionEn:
			"Treat a linked customer and supplier as one party and post the offsetting entry.",
		brd: "§4.10",
		phase: "P12.8",
	},
	enable_accounting_dimensions: {
		group: "features",
		type: "boolean",
		default: false,
		labelAr: "الأبعاد المحاسبية",
		labelEn: "Enable accounting dimensions",
		descriptionAr: "تفعيل الأبعاد التحليلية على المستندات والقيود.",
		descriptionEn: "Enable analytical dimensions on documents and ledger entries.",
		brd: "§4.5",
		phase: "P10.4",
	},
	enable_subscriptions: {
		group: "features",
		type: "boolean",
		default: false,
		labelAr: "الاشتراكات والفوترة الدورية",
		labelEn: "Enable subscriptions",
		descriptionAr: "توليد فواتير دورية من خطط الاشتراك.",
		descriptionEn: "Generate recurring invoices from subscription plans.",
		brd: "FR-17.2",
		phase: "P12.5",
	},
	enable_loyalty_programs: {
		group: "features",
		type: "boolean",
		default: false,
		labelAr: "برامج الولاء (متجاوَز)",
		labelEn: "Enable loyalty programs (superseded)",
		descriptionAr:
			"لم يعد هذا المفتاح يفعل شيئًا. تُفعَّل وحدة الولاء من «المالية ← الولاء ← برنامج الولاء».",
		descriptionEn:
			"This flag no longer does anything. Enable the loyalty module from Finance → Loyalty → Loyalty Program.",
		brd: "§1.3",
		supersededBy: "clinic_loyalty_settings.enableLoyaltyModule",
	},
	show_balance_in_coa: {
		group: "features",
		type: "boolean",
		default: true,
		labelAr: "إظهار الأرصدة في دليل الحسابات",
		labelEn: "Show balance in Chart of Accounts",
		descriptionAr: "عرض عمود الرصيد ضمن شجرة الحسابات.",
		descriptionEn: "Show the balance column in the chart-of-accounts tree.",
		brd: "§19",
		phase: "P1.2",
	},
	repost_allowed_types: {
		group: "features",
		type: "string_list",
		default: [],
		labelAr: "أنواع المستندات المسموح بإعادة ترحيلها",
		labelEn: "Repost allowed doctypes",
		descriptionAr: "المستندات التي تقبل إعادة بناء قيودها بعد الترحيل.",
		descriptionEn: "Documents whose ledger entries may be rebuilt after submission.",
		brd: "FR-6.9",
		phase: "P12.9",
	},

	// ── وحدة العضويات والتأمين (MI BRD §7.3, [MI-P0]) ──────────────────────────────────
	enable_membership_module: {
		group: "features",
		type: "boolean",
		default: false,
		labelAr: "تفعيل وحدة العضويات",
		labelEn: "Enable membership module",
		descriptionAr:
			"العلم الرئيسي لوحدة العضويات — إيقافه يُبقي مسار تسعير الفواتير كما هو اليوم تمامًا (تمرير محايد، انضباط FR-11.3).",
		descriptionEn:
			"Master flag for the membership module — OFF keeps the invoice pricing path byte-identical to today (FR-11.3 flag discipline).",
		brd: "MI §7.3",
		phase: "MI-P0",
	},
	enable_insurance_module: {
		group: "features",
		type: "boolean",
		default: false,
		labelAr: "تفعيل وحدة التأمين",
		labelEn: "Enable insurance module",
		descriptionAr:
			"العلم الرئيسي لوحدة التأمين — إيقافه يُبقي شاشة الدفع وتقسيم الفواتير كما هما اليوم تمامًا (تمرير محايد).",
		descriptionEn:
			"Master flag for the insurance module — OFF keeps the pay screen and invoice splitting exactly as they are today (neutral pass-through).",
		brd: "MI §7.3",
		phase: "MI-P0",
	},
	membership_income_account_id: {
		group: "features",
		type: "string",
		default: "",
		labelAr: "حساب إيراد العضويات",
		labelEn: "Membership income account",
		descriptionAr:
			"حساب الإيراد الذي تُقيَّد عليه رسوم اشتراكات العضوية — يُفحص عند أول استخدام بعد تفعيل الوحدة، لا عند الحفظ (قرار MI-P0).",
		descriptionEn:
			"Income account credited with membership subscription fees — checked at first use after enabling the module, not at save (MI-P0 decision).",
		brd: "MI §7.3",
		phase: "MI-P0",
	},
	membership_deferred_account_id: {
		group: "features",
		type: "string",
		default: "",
		labelAr: "حساب الإيراد المؤجل للعضويات",
		labelEn: "Membership deferred revenue account",
		descriptionAr:
			"حساب التزام يستقبل رسوم العضوية عند التأجيل — مطلوب فقط متى وُجدت خطة تؤجل الإيراد، ويُفحص عند الاستخدام (MI-P1).",
		descriptionEn:
			"Liability account holding deferred membership fees — required only when some plan defers revenue, checked at use (MI-P1).",
		brd: "MI §7.3",
		phase: "MI-P0",
	},
	membership_active_on_enroll: {
		group: "features",
		type: "boolean",
		default: false,
		labelAr: "تفعيل العضوية فور التسجيل",
		labelEn: "Membership active on enroll",
		descriptionAr:
			"تصبح العضوية فعّالة عند التسجيل دون انتظار سداد أول فاتورة (بيع كاونتر والنقد في اليد) — الافتراضي انتظار السداد.",
		descriptionEn:
			"Membership turns ACTIVE at enrollment without waiting for the first invoice to be paid (counter sale, cash in hand) — default waits for payment.",
		brd: "MI FR-M5.1",
		phase: "MI-P0",
	},
	membership_stacks_with_coupons: {
		group: "features",
		type: "boolean",
		default: true,
		labelAr: "جمع خصم العضوية مع الكوبونات",
		labelEn: "Membership stacks with coupons",
		descriptionAr:
			"خصم العضوية أولًا ثم الكوبون على المتبقي (ترتيب §6.4) — إيقافه يُطبّق التخفيض الأكبر وحده.",
		descriptionEn:
			"Membership discount first, then the coupon on the remainder (§6.4 order) — OFF applies only the larger single reduction.",
		brd: "MI BR-M6.6",
		phase: "MI-P0",
	},
} as const satisfies Record<string, AccountsSettingDefinition>;

type Definitions = typeof ACCOUNTS_SETTINGS_DEFINITIONS;

export type AccountsSettingsKey = keyof Definitions;

/** Value type implied by a definition — keeps the service/API/form types in lockstep. */
type ValueOfDefinition<D> = D extends { type: "boolean" }
	? boolean
	: D extends { type: "int" }
		? number
		: // decimals travel as strings: JS floats are forbidden on accounting money (contract C2)
			D extends { type: "decimal" }
			? string
			: D extends { type: "date" }
				? string | null
				: D extends { type: "enum"; options: readonly (infer O)[] }
					? O
					: D extends { type: "string" }
						? string
						: D extends { type: "string_list" }
							? string[]
							: never;

/** The fully-resolved settings object (every §19 key present, defaults filled in). */
export type AccountsSettingsValues = {
	[K in AccountsSettingsKey]: ValueOfDefinition<Definitions[K]>;
};

/** A partial update — what the PATCH endpoint and the settings form submit. */
export type UpdateAccountsSettingsInput = Partial<AccountsSettingsValues>;

export const ACCOUNTS_SETTINGS_KEYS = Object.keys(
	ACCOUNTS_SETTINGS_DEFINITIONS,
) as AccountsSettingsKey[];

export function isAccountsSettingsKey(key: string): key is AccountsSettingsKey {
	return Object.hasOwn(ACCOUNTS_SETTINGS_DEFINITIONS, key);
}

export function accountsSettingDefinition(
	key: AccountsSettingsKey,
): AccountsSettingDefinition {
	return ACCOUNTS_SETTINGS_DEFINITIONS[key];
}

/**
 * Form validation for the settings screen, generated FROM the registry rather than written
 * beside it: a hand-kept 44-key Zod object would drift from the definitions the first time
 * a flag is added, and the definitions are what the server actually enforces.
 */
function zodForDefinition(definition: AccountsSettingDefinition): z.ZodType {
	switch (definition.type) {
		case "boolean":
			return z.boolean({ error: `قيمة «${definition.labelAr}» يجب أن تكون نعم أو لا` });
		case "int": {
			let schema = z.coerce
				.number({ error: `قيمة «${definition.labelAr}» يجب أن تكون رقمًا` })
				.int(`قيمة «${definition.labelAr}» يجب أن تكون رقمًا صحيحًا`);
			if (definition.min !== undefined) {
				schema = schema.min(
					definition.min,
					`قيمة «${definition.labelAr}» يجب ألا تقل عن ${definition.min}`,
				);
			}
			if (definition.max !== undefined) {
				schema = schema.max(
					definition.max,
					`قيمة «${definition.labelAr}» يجب ألا تزيد عن ${definition.max}`,
				);
			}
			return schema;
		}
		case "decimal":
			return z
				.string({ error: `قيمة «${definition.labelAr}» يجب أن تكون رقمًا` })
				.regex(/^-?\d+(\.\d+)?$/, `قيمة «${definition.labelAr}» يجب أن تكون رقمًا`);
		case "date":
			return z
				.string()
				.regex(
					/^\d{4}-\d{2}-\d{2}$/,
					`قيمة «${definition.labelAr}» يجب أن تكون تاريخًا بصيغة YYYY-MM-DD`,
				)
				.nullable();
		case "enum":
			return z.enum(definition.options as [string, ...string[]], {
				error: `قيمة «${definition.labelAr}» غير مسموحة`,
			});
		case "string":
			return z.string({ error: `قيمة «${definition.labelAr}» يجب أن تكون نصًا` });
		case "string_list":
			return z.array(z.string(), {
				error: `قيمة «${definition.labelAr}» يجب أن تكون قائمة نصوص`,
			});
	}
}

export const accountsSettingsFormSchema = z.object(
	Object.fromEntries(
		(Object.keys(ACCOUNTS_SETTINGS_DEFINITIONS) as AccountsSettingsKey[]).map((key) => [
			key,
			zodForDefinition(ACCOUNTS_SETTINGS_DEFINITIONS[key]),
		]),
	),
) as unknown as z.ZodType<AccountsSettingsValues, AccountsSettingsValues>;

export const accountsSettingSelect = {
	key: true,
	value: true,
} as const satisfies Prisma.AccountsSettingSelect;

export type AccountsSettingRow = Prisma.AccountsSettingGetPayload<{
	select: typeof accountsSettingSelect;
}>;

export type UpsertAccountsSettingInput = Pick<
	Prisma.AccountsSettingUncheckedCreateInput,
	"clinicId" | "key" | "value"
>;
