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
export type AccountsSettingType = "boolean" | "int" | "decimal" | "date" | "enum" | "string" | "string_list";
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
export type AccountsSettingDefinition = BaseDefinition & ({
    type: "boolean";
    default: boolean;
} | {
    type: "int";
    default: number;
    min?: number;
    max?: number;
} | {
    type: "decimal";
    default: string;
} | {
    type: "date";
    default: string | null;
} | {
    type: "enum";
    options: readonly string[];
    default: string;
} | {
    type: "string";
    default: string;
} | {
    type: "string_list";
    default: readonly string[];
});
export declare const ACCOUNTS_SETTINGS_GROUPS: readonly [{
    readonly id: "ledger";
    readonly labelAr: "الدفتر والترحيل";
    readonly labelEn: "Ledger & Posting";
}, {
    readonly id: "period";
    readonly labelAr: "التجميد وإقفال الفترات";
    readonly labelEn: "Period Control";
}, {
    readonly id: "receivables";
    readonly labelAr: "الذمم والمدفوعات";
    readonly labelEn: "Receivables & Payments";
}, {
    readonly id: "invoicing";
    readonly labelAr: "الفوترة والضرائب";
    readonly labelEn: "Invoicing & Tax";
}, {
    readonly id: "printing";
    readonly labelAr: "الطباعة";
    readonly labelEn: "Printing";
}, {
    readonly id: "currency";
    readonly labelAr: "العملات وأسعار الصرف";
    readonly labelEn: "Currency & Exchange";
}, {
    readonly id: "reconciliation";
    readonly labelAr: "التسوية";
    readonly labelEn: "Reconciliation";
}, {
    readonly id: "deferred";
    readonly labelAr: "الاستحقاق المؤجل";
    readonly labelEn: "Deferred Accounting";
}, {
    readonly id: "features";
    readonly labelAr: "تفعيل الخصائص";
    readonly labelEn: "Feature Toggles";
}];
export type AccountsSettingsGroupId = (typeof ACCOUNTS_SETTINGS_GROUPS)[number]["id"];
export declare const ACCOUNTS_SETTINGS_DEFINITIONS: {
    readonly enable_immutable_ledger: {
        readonly group: "ledger";
        readonly type: "boolean";
        readonly default: false;
        readonly labelAr: "الدفتر غير القابل للتعديل";
        readonly labelEn: "Enable immutable ledger";
        readonly descriptionAr: "عند التفعيل تبقى القيود الأصلية سارية ويُضاف عكسها بتاريخ الإلغاء؛ وعند الإيقاف (الوضع الافتراضي) تُعلَّم القيود الأصلية وعكسها كملغاة.";
        readonly descriptionEn: "When on, original entries stay live and a reversal is posted at the cancellation date; when off (default) the original and its mirror are both flagged cancelled.";
        readonly brd: "AR-2";
        readonly phase: "P2.3";
    };
    readonly merge_similar_account_heads: {
        readonly group: "ledger";
        readonly type: "boolean";
        readonly default: true;
        readonly labelAr: "دمج القيود المتشابهة";
        readonly labelEn: "Merge similar account heads";
        readonly descriptionAr: "دمج أسطر القيد المتطابقة في المفتاح قبل الحفظ لتقليل عدد الأسطر.";
        readonly descriptionEn: "Merge ledger rows that share the same merge key before persisting, to keep entry counts down.";
        readonly brd: "§6 step 5b";
        readonly phase: "P2.2";
    };
    readonly delete_linked_ledger_entries: {
        readonly group: "ledger";
        readonly type: "boolean";
        readonly default: false;
        readonly labelAr: "حذف القيود المرتبطة عند حذف المستند";
        readonly labelEn: "Delete linked ledger entries";
        readonly descriptionAr: "خطير — يحذف قيود الأستاذ نهائيًا بدل الإبقاء على أثر التدقيق. يُترك مغلقًا.";
        readonly descriptionEn: "Dangerous — hard-deletes ledger entries instead of preserving the audit trail. Leave off.";
        readonly brd: "§19";
    };
    readonly ignore_account_closing_balance: {
        readonly group: "ledger";
        readonly type: "boolean";
        readonly default: false;
        readonly labelAr: "تجاهل أرصدة الإقفال المخزّنة";
        readonly labelEn: "Ignore account closing balance";
        readonly descriptionAr: "تجاوز مسار الأرصدة المخزّنة في تقارير الميزانية والاعتماد على القيود مباشرة.";
        readonly descriptionEn: "Bypass the stored closing-balance fast path and read balance-sheet figures straight from the ledger.";
        readonly brd: "§5.3";
        readonly phase: "P10.2";
    };
    readonly auto_create_fiscal_year: {
        readonly group: "ledger";
        readonly type: "boolean";
        readonly default: true;
        readonly labelAr: "إنشاء السنة المالية التالية تلقائيًا";
        readonly labelEn: "Auto-create next fiscal year";
        readonly descriptionAr: "قرب نهاية السنة المالية يُنشئ النظام السنة التالية تلقائيًا — لا يُرحَّل شيء فعليًا؛ الأرصدة الافتتاحية تُشتق من الدفاتر (FR-12.5).";
        readonly descriptionEn: "Near fiscal-year end the system creates the next year automatically — nothing is carried physically; opening balances derive from the ledger (FR-12.5).";
        readonly brd: "FR-12.5";
        readonly phase: "P10.5";
    };
    readonly ignore_is_opening_check_for_reporting: {
        readonly group: "ledger";
        readonly type: "boolean";
        readonly default: false;
        readonly labelAr: "السماح بالقيود الافتتاحية بعد الإقفال (لأغراض التقارير)";
        readonly labelEn: "Ignore is-opening check for reporting";
        readonly descriptionAr: "يسمح بترحيل قيود افتتاحية بتاريخ يسبق آخر سند إقفال — لتصحيحات الأرصدة الافتتاحية فقط (BR-12.4).";
        readonly descriptionEn: "Allow all-opening batches to post on/before the last Period Closing Voucher — opening-balance corrections only (BR-12.4).";
        readonly brd: "BR-12.4";
        readonly phase: "P10.2";
    };
    readonly general_ledger_remarks_length: {
        readonly group: "ledger";
        readonly type: "int";
        readonly default: 0;
        readonly min: 0;
        readonly max: 1000;
        readonly labelAr: "حد طول الملاحظات في الأستاذ العام";
        readonly labelEn: "GL remarks length limit";
        readonly descriptionAr: "صفر يعني بلا حد.";
        readonly descriptionEn: "Zero means no limit.";
        readonly brd: "§5.1";
        readonly phase: "P2.1";
    };
    readonly receivable_payable_remarks_length: {
        readonly group: "ledger";
        readonly type: "int";
        readonly default: 0;
        readonly min: 0;
        readonly max: 1000;
        readonly labelAr: "حد طول الملاحظات في الذمم";
        readonly labelEn: "AR/AP remarks length limit";
        readonly descriptionAr: "صفر يعني بلا حد.";
        readonly descriptionEn: "Zero means no limit.";
        readonly brd: "§5.2";
        readonly phase: "P3.2";
    };
    readonly accounts_frozen_upto: {
        readonly group: "period";
        readonly type: "date";
        readonly default: null;
        readonly labelAr: "تجميد القيود حتى تاريخ";
        readonly labelEn: "Accounts frozen upto";
        readonly descriptionAr: "يمنع أي ترحيل أو إلغاء بتاريخ ترحيل ≤ هذا التاريخ، إلا لمن يملك صلاحية «تعديل الفترات المجمّدة».";
        readonly descriptionEn: "Blocks any posting or cancellation dated on or before this date, except for holders of the frozen-accounts modifier permission.";
        readonly brd: "FR-12.1";
        readonly phase: "P2.8";
    };
    readonly period_closing_voucher_job_timeout: {
        readonly group: "period";
        readonly type: "int";
        readonly default: 3600;
        readonly min: 60;
        readonly max: 86400;
        readonly labelAr: "مهلة مهمة سند الإقفال (ثانية)";
        readonly labelEn: "Period Closing Voucher job timeout (s)";
        readonly descriptionAr: "الحد الأقصى لزمن تنفيذ مهمة الإقفال في الخلفية قبل اعتبارها فاشلة.";
        readonly descriptionEn: "Maximum runtime for the background closing job before it is marked failed.";
        readonly brd: "FR-12.3";
        readonly phase: "P10.2";
    };
    readonly confirm_before_resetting_posting_date: {
        readonly group: "period";
        readonly type: "boolean";
        readonly default: true;
        readonly labelAr: "تأكيد قبل تغيير تاريخ الترحيل";
        readonly labelEn: "Confirm before resetting posting date";
        readonly descriptionAr: "طلب تأكيد صريح عند تعديل تاريخ ترحيل مستند.";
        readonly descriptionEn: "Ask for explicit confirmation when a document's posting date is changed.";
        readonly brd: "§19";
    };
    readonly unlink_payment_on_cancellation_of_invoice: {
        readonly group: "receivables";
        readonly type: "boolean";
        readonly default: true;
        readonly labelAr: "فك ارتباط الدفعات عند إلغاء الفاتورة";
        readonly labelEn: "Unlink payment on cancellation of invoice";
        readonly descriptionAr: "عند الإيقاف يُمنع إلغاء فاتورة مرتبطة بدفعة بدل فك الارتباط تلقائيًا.";
        readonly descriptionEn: "When off, cancelling an invoice that has linked payments is blocked instead of auto-unlinking them.";
        readonly brd: "BR-10.4";
        readonly phase: "P7.8";
    };
    readonly unlink_advance_payment_on_cancelation_of_order: {
        readonly group: "receivables";
        readonly type: "boolean";
        readonly default: false;
        readonly labelAr: "فك ارتباط الدفعة المقدمة عند إلغاء الطلب";
        readonly labelEn: "Unlink advance payment on cancellation of order";
        readonly descriptionAr: "يحكم إلغاء الطلبات المرتبطة بدفعات مقدمة.";
        readonly descriptionEn: "Governs cancellation of orders that carry advance payments.";
        readonly brd: "BR-10.4";
        readonly phase: "P7.8";
    };
    readonly make_payment_via_journal_entry: {
        readonly group: "receivables";
        readonly type: "boolean";
        readonly default: false;
        readonly labelAr: "إنشاء المدفوعات كقيد يومية";
        readonly labelEn: "Make payment via Journal Entry";
        readonly descriptionAr: "استخدام قيد يومية بدل سند القبض/الصرف عند تسجيل الدفع.";
        readonly descriptionEn: "Record payments as journal entries instead of payment entries.";
        readonly brd: "§19";
        readonly phase: "P7.1";
    };
    readonly automatically_fetch_payment_terms: {
        readonly group: "receivables";
        readonly type: "boolean";
        readonly default: false;
        readonly labelAr: "جلب شروط الدفع تلقائيًا";
        readonly labelEn: "Automatically fetch payment terms";
        readonly descriptionAr: "تعبئة جدول الاستحقاق من قالب شروط الدفع عند حفظ الفاتورة.";
        readonly descriptionEn: "Fill the payment schedule from the payment-terms template when an invoice is saved.";
        readonly brd: "BR-4.9.1";
        readonly phase: "P5.4";
    };
    readonly default_ageing_range: {
        readonly group: "receivables";
        readonly type: "string";
        readonly default: "30, 60, 90, 120";
        readonly labelAr: "فترات أعمار الديون الافتراضية";
        readonly labelEn: "Default ageing range";
        readonly descriptionAr: "حدود شرائح أعمار الديون بالأيام، مفصولة بفواصل.";
        readonly descriptionEn: "Ageing bucket boundaries in days, comma separated.";
        readonly brd: "§18.3";
        readonly phase: "P9.3";
    };
    readonly check_supplier_invoice_uniqueness: {
        readonly group: "invoicing";
        readonly type: "boolean";
        readonly default: false;
        readonly labelAr: "التحقق من عدم تكرار فاتورة المورّد";
        readonly labelEn: "Check supplier invoice uniqueness";
        readonly descriptionAr: "منع تكرار رقم فاتورة المورّد لنفس المورّد داخل المنشأة.";
        readonly descriptionEn: "Reject a duplicate supplier bill number for the same supplier within the company.";
        readonly brd: "BR-7.3.1";
        readonly phase: "P6.1";
    };
    readonly over_billing_allowance: {
        readonly group: "invoicing";
        readonly type: "decimal";
        readonly default: "0";
        readonly labelAr: "نسبة السماح بتجاوز الفوترة (%)";
        readonly labelEn: "Over billing allowance (%)";
        readonly descriptionAr: "النسبة المسموح بتجاوزها فوق قيمة الطلب/الاستلام؛ التجاوز الأكبر يحتاج صلاحية «تجاوز حد الفوترة».";
        readonly descriptionEn: "Percentage a document may exceed its order/receipt by; anything beyond needs the over-billing permission.";
        readonly brd: "§19";
        readonly phase: "P5.2";
    };
    readonly add_taxes_from_item_tax_template: {
        readonly group: "invoicing";
        readonly type: "boolean";
        readonly default: true;
        readonly labelAr: "إضافة الضرائب من قالب ضريبة الصنف";
        readonly labelEn: "Add taxes from Item Tax Template";
        readonly descriptionAr: "إدراج صفوف الضريبة الناقصة من قالب ضريبة الصنف.";
        readonly descriptionEn: "Insert missing tax rows from the item's tax template.";
        readonly brd: "§8 step 5";
        readonly phase: "P4.2";
    };
    readonly add_taxes_from_taxes_and_charges_template: {
        readonly group: "invoicing";
        readonly type: "boolean";
        readonly default: true;
        readonly labelAr: "إضافة الضرائب من قالب الضرائب والرسوم";
        readonly labelEn: "Add taxes from Taxes and Charges Template";
        readonly descriptionAr: "تعبئة صفوف الضريبة من القالب الافتراضي عند إنشاء المستند.";
        readonly descriptionEn: "Populate tax rows from the default template when a document is created.";
        readonly brd: "§4.11";
        readonly phase: "P4.2";
    };
    readonly determine_address_tax_category_from: {
        readonly group: "invoicing";
        readonly type: "enum";
        readonly options: readonly ["Billing Address", "Shipping Address"];
        readonly default: "Billing Address";
        readonly labelAr: "مصدر فئة الضريبة من العنوان";
        readonly labelEn: "Determine address tax category from";
        readonly descriptionAr: "أي عنوان يُستخدم لاختيار فئة الضريبة عند مطابقة قواعد الضريبة.";
        readonly descriptionEn: "Which address decides the tax category when matching tax rules.";
        readonly brd: "§4.11";
        readonly phase: "P4.1";
    };
    readonly round_row_wise_tax: {
        readonly group: "invoicing";
        readonly type: "boolean";
        readonly default: false;
        readonly labelAr: "تقريب الضريبة لكل صف";
        readonly labelEn: "Round row-wise tax";
        readonly descriptionAr: "تقريب مبلغ الضريبة على مستوى الصف بدل المجموع فقط.";
        readonly descriptionEn: "Round the tax amount per row rather than only on the total.";
        readonly brd: "§8 step 6";
        readonly phase: "P4.2";
    };
    readonly book_tax_discount_loss: {
        readonly group: "invoicing";
        readonly type: "boolean";
        readonly default: false;
        readonly labelAr: "ترحيل فرق ضريبة الخصم";
        readonly labelEn: "Book tax discount loss";
        readonly descriptionAr: "ترحيل الجزء الضريبي من الخصم إلى حساب مستقل.";
        readonly descriptionEn: "Post the tax portion of a discount to a separate account.";
        readonly brd: "§8 step 8";
        readonly phase: "P5.3";
    };
    readonly enable_discount_accounting: {
        readonly group: "invoicing";
        readonly type: "boolean";
        readonly default: false;
        readonly labelAr: "محاسبة الخصومات";
        readonly labelEn: "Enable discount accounting";
        readonly descriptionAr: "ترحيل الخصم إلى حساب خصم مستقل بدل تخفيض الإيراد مباشرة.";
        readonly descriptionEn: "Post discounts to a dedicated discount account instead of netting them off income.";
        readonly brd: "§7.2 posting map row 7";
        readonly phase: "P5.3";
    };
    readonly show_inclusive_tax_in_print: {
        readonly group: "printing";
        readonly type: "boolean";
        readonly default: false;
        readonly labelAr: "إظهار الضريبة المتضمَّنة في الطباعة";
        readonly labelEn: "Show inclusive tax in print";
        readonly descriptionAr: "إظهار مبلغ الضريبة المتضمَّنة في السعر ضمن نسخة الطباعة.";
        readonly descriptionEn: "Show the tax included in the rate on the printed document.";
        readonly brd: "§19";
        readonly phase: "P5.9";
    };
    readonly show_payment_schedule_in_print: {
        readonly group: "printing";
        readonly type: "boolean";
        readonly default: false;
        readonly labelAr: "إظهار جدول الاستحقاق في الطباعة";
        readonly labelEn: "Show payment schedule in print";
        readonly descriptionAr: "طباعة أقساط الاستحقاق ضمن الفاتورة.";
        readonly descriptionEn: "Print the instalment schedule on the invoice.";
        readonly brd: "§19";
        readonly phase: "P5.9";
    };
    readonly show_taxes_as_table_in_print: {
        readonly group: "printing";
        readonly type: "boolean";
        readonly default: false;
        readonly labelAr: "إظهار الضرائب كجدول في الطباعة";
        readonly labelEn: "Show taxes as table in print";
        readonly descriptionAr: "عرض تفصيل الضرائب في جدول مستقل عند الطباعة.";
        readonly descriptionEn: "Render the tax breakdown as its own table when printing.";
        readonly brd: "§19";
        readonly phase: "P5.9";
    };
    readonly allow_stale: {
        readonly group: "currency";
        readonly type: "boolean";
        readonly default: true;
        readonly labelAr: "السماح بسعر صرف قديم";
        readonly labelEn: "Allow stale exchange rates";
        readonly descriptionAr: "عند الإيقاف تُمنع الحركة إذا كان أحدث سعر صرف أقدم من المدة المحددة.";
        readonly descriptionEn: "When off, transactions are blocked if the latest exchange rate is older than the configured window.";
        readonly brd: "§4.7";
        readonly phase: "P1.8";
    };
    readonly stale_days: {
        readonly group: "currency";
        readonly type: "int";
        readonly default: 1;
        readonly min: 0;
        readonly max: 365;
        readonly labelAr: "مدة صلاحية سعر الصرف (يوم)";
        readonly labelEn: "Stale days";
        readonly descriptionAr: "عدد الأيام التي يُعتبر بعدها سعر الصرف قديمًا.";
        readonly descriptionEn: "Number of days after which an exchange rate counts as stale.";
        readonly brd: "§4.7";
        readonly phase: "P1.8";
    };
    readonly allow_multi_currency_invoices_against_single_party_account: {
        readonly group: "currency";
        readonly type: "boolean";
        readonly default: false;
        readonly labelAr: "السماح بعملات متعددة على حساب طرف واحد";
        readonly labelEn: "Allow multi-currency invoices against single party account";
        readonly descriptionAr: "تجاوز قاعدة توحيد عملة حساب الطرف بعد أول حركة.";
        readonly descriptionEn: "Override the rule that fixes a party account's currency after its first entry.";
        readonly brd: "BR-4.10.2";
        readonly phase: "P8.3";
    };
    readonly rate_provider: {
        readonly group: "currency";
        readonly type: "enum";
        readonly options: readonly ["None", "frankfurter.dev"];
        readonly default: "None";
        readonly labelAr: "مزوّد أسعار الصرف";
        readonly labelEn: "Exchange rate provider";
        readonly descriptionAr: "المصدر الآلي لأسعار الصرف (§4.7) — «None» يعتمد الأسعار اليدوية فقط.";
        readonly descriptionEn: "Automatic rate source (§4.7); None keeps manual rates only.";
        readonly brd: "§4.7";
        readonly phase: "P8.5";
    };
    readonly exchange_gain_loss_posting_date: {
        readonly group: "currency";
        readonly type: "enum";
        readonly options: readonly ["Invoice", "Payment", "Reconciliation Date"];
        readonly default: "Reconciliation Date";
        readonly labelAr: "تاريخ ترحيل فروق الصرف";
        readonly labelEn: "Exchange gain/loss posting date";
        readonly descriptionAr: "التاريخ المستخدم لقيد فرق سعر الصرف المحقق.";
        readonly descriptionEn: "Date used for the realised exchange gain/loss entry.";
        readonly brd: "BR-7.4.4";
        readonly phase: "P8.2";
    };
    readonly maintain_same_internal_transaction_rate: {
        readonly group: "currency";
        readonly type: "boolean";
        readonly default: false;
        readonly labelAr: "توحيد سعر الصرف في الحركات الداخلية";
        readonly labelEn: "Maintain same internal transaction rate";
        readonly descriptionAr: "إلزام الطرفين في الحركات بين الشركات بنفس سعر الصرف.";
        readonly descriptionEn: "Force both sides of an inter-company transaction to use the same exchange rate.";
        readonly brd: "FR-9.1";
        readonly phase: "P12.8";
    };
    readonly maintain_same_rate_action: {
        readonly group: "currency";
        readonly type: "enum";
        readonly options: readonly ["Stop", "Warn"];
        readonly default: "Stop";
        readonly labelAr: "إجراء اختلاف السعر الداخلي";
        readonly labelEn: "Maintain same rate action";
        readonly descriptionAr: "منع الحفظ أو الاكتفاء بتنبيه عند اختلاف السعر.";
        readonly descriptionEn: "Block the save or only warn when the rates differ.";
        readonly brd: "FR-9.1";
        readonly phase: "P12.8";
    };
    readonly auto_reconcile_payments: {
        readonly group: "reconciliation";
        readonly type: "boolean";
        readonly default: true;
        readonly labelAr: "التسوية التلقائية للمدفوعات";
        readonly labelEn: "Auto reconcile payments";
        readonly descriptionAr: "تشغيل مهمة مطابقة الدفعات بالفواتير دوريًا.";
        readonly descriptionEn: "Run the payment-to-invoice matching job on a schedule.";
        readonly brd: "FR-10.2";
        readonly phase: "P12.7";
    };
    readonly reconciliation_queue_size: {
        readonly group: "reconciliation";
        readonly type: "int";
        readonly default: 5;
        readonly min: 1;
        readonly max: 100;
        readonly labelAr: "حجم دفعة التسوية";
        readonly labelEn: "Reconciliation queue size";
        readonly descriptionAr: "عدد السجلات التي تعالجها المهمة في الدفعة الواحدة.";
        readonly descriptionEn: "How many records the job processes per batch.";
        readonly brd: "FR-10.1";
        readonly phase: "P7.6";
    };
    readonly auto_reconciliation_job_trigger: {
        readonly group: "reconciliation";
        readonly type: "int";
        readonly default: 15;
        readonly min: 1;
        readonly max: 1440;
        readonly labelAr: "تكرار مهمة التسوية (دقيقة)";
        readonly labelEn: "Auto reconciliation job trigger (min)";
        readonly descriptionAr: "الفاصل الزمني بين تشغيلات مهمة التسوية التلقائية.";
        readonly descriptionEn: "Interval between runs of the auto-reconciliation job.";
        readonly brd: "FR-10.2";
        readonly phase: "P12.7";
    };
    readonly enable_party_matching: {
        readonly group: "reconciliation";
        readonly type: "boolean";
        readonly default: false;
        readonly labelAr: "مطابقة الأطراف في التسوية البنكية";
        readonly labelEn: "Enable party matching";
        readonly descriptionAr: "ترشيح المستندات المرشّحة اعتمادًا على اسم الطرف في الحركة البنكية.";
        readonly descriptionEn: "Use the party name on a bank transaction to narrow candidate vouchers.";
        readonly brd: "FR-14.2";
        readonly phase: "P11.3";
    };
    readonly enable_fuzzy_matching: {
        readonly group: "reconciliation";
        readonly type: "boolean";
        readonly default: false;
        readonly labelAr: "المطابقة التقريبية";
        readonly labelEn: "Enable fuzzy matching";
        readonly descriptionAr: "السماح بمطابقة الأوصاف المتقاربة لا المطابقة الحرفية فقط.";
        readonly descriptionEn: "Allow near-matching descriptions rather than exact matches only.";
        readonly brd: "FR-14.2";
        readonly phase: "P11.3";
    };
    readonly enable_bank_transaction_rules: {
        readonly group: "reconciliation";
        readonly type: "boolean";
        readonly default: false;
        readonly labelAr: "قواعد الحركات البنكية";
        readonly labelEn: "Enable bank transaction rules";
        readonly descriptionAr: "تفعيل محرك القواعد المرتّبة لتصنيف حركات الكشف وإنشاء قيودها تلقائيًا (FR-14.3).";
        readonly descriptionEn: "Enable the ordered rules engine that auto-classifies statement rows and books their entries.";
        readonly brd: "FR-14.3";
        readonly phase: "P11.5";
    };
    readonly automatically_run_rules_on_unreconciled_transactions: {
        readonly group: "reconciliation";
        readonly type: "boolean";
        readonly default: false;
        readonly labelAr: "تشغيل القواعد تلقائيًا بعد الاستيراد";
        readonly labelEn: "Automatically run rules on unreconciled transactions";
        readonly descriptionAr: "تشغيل جولة القواعد على الحركات غير المسوّاة مباشرة بعد كل استيراد كشف.";
        readonly descriptionEn: "Run the rules sweep on unreconciled transactions right after every import.";
        readonly brd: "FR-14.3";
        readonly phase: "P11.5";
    };
    readonly transfer_match_days: {
        readonly group: "reconciliation";
        readonly type: "int";
        readonly default: 2;
        readonly labelAr: "نافذة مطابقة التحويلات الداخلية (أيام)";
        readonly labelEn: "Transfer match days";
        readonly descriptionAr: "أقصى فارق أيام بين ساقي تحويل داخلي بين حسابين بنكيين حتى يُقترَح الإقران.";
        readonly descriptionEn: "Maximum day gap between the two legs of an internal bank transfer for pairing.";
        readonly brd: "FR-14.2";
        readonly phase: "P11.3";
    };
    readonly enable_clinic_invoice_adapter: {
        readonly group: "features";
        readonly type: "boolean";
        readonly default: false;
        readonly labelAr: "تفعيل محول فواتير الأكاديمية";
        readonly labelEn: "Enable clinic invoice adapter";
        readonly descriptionAr: "ترحيل فواتير الأكاديمية التشغيلية المدفوعة إلى دفتر الأستاذ عبر جولات المحول — إيقافه يجمّد الترحيل دون المساس بالتشغيل.";
        readonly descriptionEn: "Post paid operational clinic invoices into the ledger via adapter runs — OFF freezes posting without touching operations.";
        readonly brd: "§C3";
        readonly phase: "P12A.2";
    };
    readonly enable_expense_adapter: {
        readonly group: "features";
        readonly type: "boolean";
        readonly default: false;
        readonly labelAr: "تفعيل محول المصروفات";
        readonly labelEn: "Enable expense adapter";
        readonly descriptionAr: "ترحيل المصروفات التشغيلية المدفوعة إلى دفتر الأستاذ عبر جولات المحول — إيقافه يجمّد الترحيل دون المساس بالتشغيل.";
        readonly descriptionEn: "Post paid operational expenses into the ledger via adapter runs — OFF freezes posting without touching operations.";
        readonly brd: "§C3";
        readonly phase: "P12A.2";
    };
    readonly adapter_vat_account_id: {
        readonly group: "features";
        readonly type: "string";
        readonly default: "";
        readonly labelAr: "حساب ضريبة المحول";
        readonly labelEn: "Adapter VAT account";
        readonly descriptionAr: "معرّف حساب الضريبة الذي يستقبل ضريبة فواتير الأكاديمية المرحّلة — مطلوب متى حملت فاتورة ضريبة.";
        readonly descriptionEn: "Ledger account id credited with VAT from adapted clinic invoices — required whenever an invoice carries VAT.";
        readonly brd: "§C3";
        readonly phase: "P12A.2";
    };
    readonly enable_pos_sale_adapter: {
        readonly group: "features";
        readonly type: "boolean";
        readonly default: false;
        readonly labelAr: "تفعيل محول نقطة البيع";
        readonly labelEn: "Enable POS sale adapter";
        readonly descriptionAr: "ترحيل مبيعات نقطة البيع المدفوعة إلى دفتر الأستاذ عبر جولات المحول — إيقافه يجمّد الترحيل دون المساس بالبيع.";
        readonly descriptionEn: "Post paid point-of-sale sales into the ledger via adapter runs — OFF freezes posting without touching selling.";
        readonly brd: "§C3";
        readonly phase: "P12B.4";
    };
    readonly book_advance_payments_in_separate_party_account: {
        readonly group: "features";
        readonly type: "boolean";
        readonly default: false;
        readonly labelAr: "ترحيل الدفعات المقدمة إلى حساب منفصل";
        readonly labelEn: "Book advance payments in a separate party account";
        readonly descriptionAr: "باقي الدفعة غير المخصَّص يُقيَّد على «دفعات مقدمة مقبوضة/مدفوعة» بدل حساب الذمم، ولا ينتقل إلى الذمم إلا عند تخصيصه على فاتورة. إيقافه يُبقي السلوك الحالي كما هو تمامًا.";
        readonly descriptionEn: "The unallocated remainder of a payment books to Advance Received/Paid instead of the AR/AP account, and moves to receivables only when applied to an invoice. OFF keeps today's behaviour bit-identical.";
        readonly brd: "FR-11.3";
        readonly phase: "P12.6";
    };
    readonly default_advance_received_account_id: {
        readonly group: "features";
        readonly type: "string";
        readonly default: "";
        readonly labelAr: "حساب الدفعات المقدمة المقبوضة";
        readonly labelEn: "Advance received account";
        readonly descriptionAr: "حساب التزام يستقبل مقدَّمات العملاء — مطلوب لتفعيل الترحيل المنفصل على سندات القبض.";
        readonly descriptionEn: "Liability account holding customer advances — required by separate booking on receive payments.";
        readonly brd: "FR-11.3";
        readonly phase: "P12.6";
    };
    readonly default_advance_paid_account_id: {
        readonly group: "features";
        readonly type: "string";
        readonly default: "";
        readonly labelAr: "حساب الدفعات المقدمة المدفوعة";
        readonly labelEn: "Advance paid account";
        readonly descriptionAr: "حساب أصل يستقبل مقدَّمات الموردين — مطلوب لتفعيل الترحيل المنفصل على سندات الدفع.";
        readonly descriptionEn: "Asset account holding supplier advances — required by separate booking on pay payments.";
        readonly brd: "FR-11.3";
        readonly phase: "P12.6";
    };
    readonly adapter_cogs_account_id: {
        readonly group: "features";
        readonly type: "string";
        readonly default: "";
        readonly labelAr: "حساب تكلفة البضاعة المباعة";
        readonly labelEn: "Cost of goods sold account";
        readonly descriptionAr: "حساب المصروف الذي يُقيَّد عليه مدينًا بتكلفة أصناف نقطة البيع وقت صرفها (BRD §7.2 سطر 5) — مطلوب لتفعيل محول نقطة البيع.";
        readonly descriptionEn: "Expense account debited with the valuation cost of POS items at issue (BRD §7.2 row 5) — required by the POS adapter.";
        readonly brd: "§7.2";
        readonly phase: "P12B.5";
    };
    readonly adapter_stock_account_id: {
        readonly group: "features";
        readonly type: "string";
        readonly default: "";
        readonly labelAr: "حساب المخزون";
        readonly labelEn: "Stock account";
        readonly descriptionAr: "حساب الأصل الذي يُقيَّد عليه دائنًا بنفس التكلفة عند صرف أصناف نقطة البيع — الطرف المقابل لتكلفة البضاعة المباعة.";
        readonly descriptionEn: "Asset account credited with the same cost when POS items are issued — the counter-leg of COGS.";
        readonly brd: "§7.2";
        readonly phase: "P12B.5";
    };
    readonly automatically_process_deferred_accounting_entry: {
        readonly group: "deferred";
        readonly type: "boolean";
        readonly default: true;
        readonly labelAr: "معالجة الاستحقاق المؤجل تلقائيًا";
        readonly labelEn: "Automatically process deferred accounting entry";
        readonly descriptionAr: "تشغيل مهمة الاعتراف الشهري بالإيراد/المصروف المؤجل.";
        readonly descriptionEn: "Run the monthly deferred revenue/expense recognition job.";
        readonly brd: "§15";
        readonly phase: "P12.2";
    };
    readonly book_deferred_entries_via_journal_entry: {
        readonly group: "deferred";
        readonly type: "boolean";
        readonly default: false;
        readonly labelAr: "ترحيل الاستحقاق المؤجل عبر قيد يومية";
        readonly labelEn: "Book deferred entries via Journal Entry";
        readonly descriptionAr: "إنشاء قيود يومية بدل الترحيل المباشر إلى الأستاذ.";
        readonly descriptionEn: "Create journal entries instead of posting straight to the ledger.";
        readonly brd: "§15";
        readonly phase: "P12.2";
    };
    readonly submit_journal_entries: {
        readonly group: "deferred";
        readonly type: "boolean";
        readonly default: false;
        readonly labelAr: "ترحيل قيود الاستحقاق تلقائيًا";
        readonly labelEn: "Submit journal entries";
        readonly descriptionAr: "ترحيل القيود المُنشأة تلقائيًا بدل تركها مسودات.";
        readonly descriptionEn: "Submit the generated entries automatically instead of leaving them as drafts.";
        readonly brd: "§15";
        readonly phase: "P12.2";
    };
    readonly book_deferred_entries_based_on: {
        readonly group: "deferred";
        readonly type: "enum";
        readonly options: readonly ["Days", "Months"];
        readonly default: "Days";
        readonly labelAr: "أساس توزيع الاستحقاق المؤجل";
        readonly labelEn: "Book deferred entries based on";
        readonly descriptionAr: "توزيع المبلغ على الأيام أو على الأشهر.";
        readonly descriptionEn: "Spread the amount over days or over months.";
        readonly brd: "§15";
        readonly phase: "P12.2";
    };
    readonly book_asset_depreciation_entry_automatically: {
        readonly group: "deferred";
        readonly type: "boolean";
        readonly default: true;
        readonly labelAr: "ترحيل الإهلاك تلقائيًا";
        readonly labelEn: "Book asset depreciation entry automatically";
        readonly descriptionAr: "خاص بوحدة الأصول الثابتة عند إضافتها.";
        readonly descriptionEn: "Applies to the fixed-assets module once it is added.";
        readonly brd: "§19";
    };
    readonly enable_common_party_accounting: {
        readonly group: "features";
        readonly type: "boolean";
        readonly default: false;
        readonly labelAr: "محاسبة الطرف المشترك";
        readonly labelEn: "Enable common party accounting";
        readonly descriptionAr: "معاملة العميل والمورّد المرتبطين كطرف واحد وترحيل قيد المقاصة.";
        readonly descriptionEn: "Treat a linked customer and supplier as one party and post the offsetting entry.";
        readonly brd: "§4.10";
        readonly phase: "P12.8";
    };
    readonly enable_accounting_dimensions: {
        readonly group: "features";
        readonly type: "boolean";
        readonly default: false;
        readonly labelAr: "الأبعاد المحاسبية";
        readonly labelEn: "Enable accounting dimensions";
        readonly descriptionAr: "تفعيل الأبعاد التحليلية على المستندات والقيود.";
        readonly descriptionEn: "Enable analytical dimensions on documents and ledger entries.";
        readonly brd: "§4.5";
        readonly phase: "P10.4";
    };
    readonly enable_subscriptions: {
        readonly group: "features";
        readonly type: "boolean";
        readonly default: false;
        readonly labelAr: "الاشتراكات والفوترة الدورية";
        readonly labelEn: "Enable subscriptions";
        readonly descriptionAr: "توليد فواتير دورية من خطط الاشتراك.";
        readonly descriptionEn: "Generate recurring invoices from subscription plans.";
        readonly brd: "FR-17.2";
        readonly phase: "P12.5";
    };
    readonly enable_loyalty_programs: {
        readonly group: "features";
        readonly type: "boolean";
        readonly default: false;
        readonly labelAr: "برامج الولاء (متجاوَز)";
        readonly labelEn: "Enable loyalty programs (superseded)";
        readonly descriptionAr: "لم يعد هذا المفتاح يفعل شيئًا. تُفعَّل وحدة الولاء من «المالية ← الولاء ← برنامج الولاء».";
        readonly descriptionEn: "This flag no longer does anything. Enable the loyalty module from Finance → Loyalty → Loyalty Program.";
        readonly brd: "§1.3";
        readonly supersededBy: "clinic_loyalty_settings.enableLoyaltyModule";
    };
    readonly show_balance_in_coa: {
        readonly group: "features";
        readonly type: "boolean";
        readonly default: true;
        readonly labelAr: "إظهار الأرصدة في دليل الحسابات";
        readonly labelEn: "Show balance in Chart of Accounts";
        readonly descriptionAr: "عرض عمود الرصيد ضمن شجرة الحسابات.";
        readonly descriptionEn: "Show the balance column in the chart-of-accounts tree.";
        readonly brd: "§19";
        readonly phase: "P1.2";
    };
    readonly repost_allowed_types: {
        readonly group: "features";
        readonly type: "string_list";
        readonly default: readonly [];
        readonly labelAr: "أنواع المستندات المسموح بإعادة ترحيلها";
        readonly labelEn: "Repost allowed doctypes";
        readonly descriptionAr: "المستندات التي تقبل إعادة بناء قيودها بعد الترحيل.";
        readonly descriptionEn: "Documents whose ledger entries may be rebuilt after submission.";
        readonly brd: "FR-6.9";
        readonly phase: "P12.9";
    };
    readonly enable_membership_module: {
        readonly group: "features";
        readonly type: "boolean";
        readonly default: false;
        readonly labelAr: "تفعيل وحدة العضويات";
        readonly labelEn: "Enable membership module";
        readonly descriptionAr: "العلم الرئيسي لوحدة العضويات — إيقافه يُبقي مسار تسعير الفواتير كما هو اليوم تمامًا (تمرير محايد، انضباط FR-11.3).";
        readonly descriptionEn: "Master flag for the membership module — OFF keeps the invoice pricing path byte-identical to today (FR-11.3 flag discipline).";
        readonly brd: "MI §7.3";
        readonly phase: "MI-P0";
    };
    readonly enable_insurance_module: {
        readonly group: "features";
        readonly type: "boolean";
        readonly default: false;
        readonly labelAr: "تفعيل وحدة التأمين";
        readonly labelEn: "Enable insurance module";
        readonly descriptionAr: "العلم الرئيسي لوحدة التأمين — إيقافه يُبقي شاشة الدفع وتقسيم الفواتير كما هما اليوم تمامًا (تمرير محايد).";
        readonly descriptionEn: "Master flag for the insurance module — OFF keeps the pay screen and invoice splitting exactly as they are today (neutral pass-through).";
        readonly brd: "MI §7.3";
        readonly phase: "MI-P0";
    };
    readonly membership_income_account_id: {
        readonly group: "features";
        readonly type: "string";
        readonly default: "";
        readonly labelAr: "حساب إيراد العضويات";
        readonly labelEn: "Membership income account";
        readonly descriptionAr: "حساب الإيراد الذي تُقيَّد عليه رسوم اشتراكات العضوية — يُفحص عند أول استخدام بعد تفعيل الوحدة، لا عند الحفظ (قرار MI-P0).";
        readonly descriptionEn: "Income account credited with membership subscription fees — checked at first use after enabling the module, not at save (MI-P0 decision).";
        readonly brd: "MI §7.3";
        readonly phase: "MI-P0";
    };
    readonly membership_deferred_account_id: {
        readonly group: "features";
        readonly type: "string";
        readonly default: "";
        readonly labelAr: "حساب الإيراد المؤجل للعضويات";
        readonly labelEn: "Membership deferred revenue account";
        readonly descriptionAr: "حساب التزام يستقبل رسوم العضوية عند التأجيل — مطلوب فقط متى وُجدت خطة تؤجل الإيراد، ويُفحص عند الاستخدام (MI-P1).";
        readonly descriptionEn: "Liability account holding deferred membership fees — required only when some plan defers revenue, checked at use (MI-P1).";
        readonly brd: "MI §7.3";
        readonly phase: "MI-P0";
    };
    readonly membership_active_on_enroll: {
        readonly group: "features";
        readonly type: "boolean";
        readonly default: false;
        readonly labelAr: "تفعيل العضوية فور التسجيل";
        readonly labelEn: "Membership active on enroll";
        readonly descriptionAr: "تصبح العضوية فعّالة عند التسجيل دون انتظار سداد أول فاتورة (بيع كاونتر والنقد في اليد) — الافتراضي انتظار السداد.";
        readonly descriptionEn: "Membership turns ACTIVE at enrollment without waiting for the first invoice to be paid (counter sale, cash in hand) — default waits for payment.";
        readonly brd: "MI FR-M5.1";
        readonly phase: "MI-P0";
    };
    readonly membership_stacks_with_coupons: {
        readonly group: "features";
        readonly type: "boolean";
        readonly default: true;
        readonly labelAr: "جمع خصم العضوية مع الكوبونات";
        readonly labelEn: "Membership stacks with coupons";
        readonly descriptionAr: "خصم العضوية أولًا ثم الكوبون على المتبقي (ترتيب §6.4) — إيقافه يُطبّق التخفيض الأكبر وحده.";
        readonly descriptionEn: "Membership discount first, then the coupon on the remainder (§6.4 order) — OFF applies only the larger single reduction.";
        readonly brd: "MI BR-M6.6";
        readonly phase: "MI-P0";
    };
};
type Definitions = typeof ACCOUNTS_SETTINGS_DEFINITIONS;
export type AccountsSettingsKey = keyof Definitions;
/** Value type implied by a definition — keeps the service/API/form types in lockstep. */
type ValueOfDefinition<D> = D extends {
    type: "boolean";
} ? boolean : D extends {
    type: "int";
} ? number : D extends {
    type: "decimal";
} ? string : D extends {
    type: "date";
} ? string | null : D extends {
    type: "enum";
    options: readonly (infer O)[];
} ? O : D extends {
    type: "string";
} ? string : D extends {
    type: "string_list";
} ? string[] : never;
/** The fully-resolved settings object (every §19 key present, defaults filled in). */
export type AccountsSettingsValues = {
    [K in AccountsSettingsKey]: ValueOfDefinition<Definitions[K]>;
};
/** A partial update — what the PATCH endpoint and the settings form submit. */
export type UpdateAccountsSettingsInput = Partial<AccountsSettingsValues>;
export declare const ACCOUNTS_SETTINGS_KEYS: AccountsSettingsKey[];
export declare function isAccountsSettingsKey(key: string): key is AccountsSettingsKey;
export declare function accountsSettingDefinition(key: AccountsSettingsKey): AccountsSettingDefinition;
export declare const accountsSettingsFormSchema: z.ZodType<AccountsSettingsValues, AccountsSettingsValues>;
export declare const accountsSettingSelect: {
    readonly key: true;
    readonly value: true;
};
export type AccountsSettingRow = Prisma.AccountsSettingGetPayload<{
    select: typeof accountsSettingSelect;
}>;
export type UpsertAccountsSettingInput = Pick<Prisma.AccountsSettingUncheckedCreateInput, "clinicId" | "key" | "value">;
export {};
