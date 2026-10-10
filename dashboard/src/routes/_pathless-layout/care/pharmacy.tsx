import { IconCashRegister, IconPill } from "@tabler/icons-react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { Stats } from "@/components/common/stats";
import { Button } from "@/components/ui/button";
import { CounterSaleDialog } from "@/features/pharmacy/components/counter-sale-dialog";
import { CounterSalesTable } from "@/features/pharmacy/components/counter-sales-table";
import { DispenseSheet } from "@/features/pharmacy/components/dispense-sheet";
import { FormularyPage } from "@/features/pharmacy/components/formulary-page";
import {
	PHARMACY_TABS,
	PharmacyHeader,
	type PharmacyTab,
} from "@/features/pharmacy/components/pharmacy-header";
import { PharmacyReportsPage } from "@/features/pharmacy/components/pharmacy-reports-page";
import { PrescriptionsTable } from "@/features/pharmacy/components/prescriptions-table";
import {
	usePharmacySettings,
	usePrescriptions,
	usePrescriptionsSummary,
} from "@/features/pharmacy/hooks/use-pharmacy";

/** تبويبات هي أقسام مستقلّة لا حالات وصفة */
const SECTION_TABS: string[] = ["COUNTER", "FORMULARY", "REPORTS"];

type PharmacySearch = { tab: PharmacyTab; q: string };

export const Route = createFileRoute("/_pathless-layout/care/pharmacy")({
	// حالة الشاشة تعيش في الرابط: تُشارَك وتُعاد بحالتها بعد التحديث (نمط التجميل)
	validateSearch: (search): PharmacySearch => {
		const raw = search as Record<string, string | undefined>;
		const tab = PHARMACY_TABS.some((t) => t.value === raw.tab)
			? (raw.tab as PharmacyTab)
			: "ACTIVE";
		return { tab, q: String(raw.q ?? "").slice(0, 120) };
	},
	component: PharmacyPage,
});

function PharmacyPage() {
	const { tab, q } = Route.useSearch();
	const navigate = useNavigate({ from: Route.fullPath });

	const setSearch = (next: Partial<PharmacySearch>) =>
		void navigate({ search: (prev) => ({ ...prev, ...next }), replace: true });

	const [selling, setSelling] = useState(false);
	// الوصفة المفتوحة للصرف — نقر الصفّ كان لا يفعل شيئًا
	const [dispensingId, setDispensingId] = useState<string | null>(null);
	const { enabled, isLoading: settingsLoading } = usePharmacySettings();
	// الأقسام الثلاثة ليست حالات وصفة — لا تُستعلم القائمة فيها
	const isQueueTab = !SECTION_TABS.includes(tab);
	const { summary } = usePrescriptionsSummary(enabled);
	const { prescriptions, isLoading } = usePrescriptions(
		{ status: isQueueTab ? (tab as "ACTIVE") : undefined, search: q || undefined },
		enabled && isQueueTab,
	);

	/**
	 * الوحدة مطفأة ⇒ شاشة تشرح وتُوصِّل، لا شاشة فارغة ولا خطأ. النقاط تردّ 404 خلف
	 * الراية (BRD §0.3)، وعرضُ ذلك «خطأ في التحميل» كان سيُرسل المستخدم إلى الدعم.
	 */
	if (!settingsLoading && !enabled)
		return (
			<div className="flex flex-1 flex-col items-center justify-center gap-3 px-4 py-16 text-center">
				<span className="flex size-12 items-center justify-center rounded-[4px] bg-muted">
					<IconPill className="size-6 text-muted-foreground" />
				</span>
				<h2 className="font-semibold text-base">وحدة الصيدلية غير مفعّلة</h2>
				<p className="max-w-md text-muted-foreground text-xs leading-relaxed">
					تُفعَّل من إعدادات الفرع ← الدورات ← الصيدلية. التفعيل لا يغيّر شيئًا في الشاشات الأخرى.
				</p>
				<Button
					size="sm"
					variant="outline"
					asChild
				>
					<Link to="/management/settings/branches-teams">فتح إعدادات الفروع</Link>
				</Button>
			</div>
		);

	return (
		<div className="flex min-h-0 flex-1 flex-col">
			<PharmacyHeader
				active={tab}
				onChange={(next) => setSearch({ tab: next })}
			/>

			{tab === "COUNTER" && <CounterSalesTable onSell={() => setSelling(true)} />}
			{tab === "FORMULARY" && <FormularyPage />}
			{tab === "REPORTS" && <PharmacyReportsPage />}

			{isQueueTab && (
				<>
					<div className="px-4">
						<Stats
							variant="inventory"
							stats={[
								{
									title: "في طابور الصرف",
									value: summary.active,
									tooltip: "وصفات صادرة لم تُصرف بالكامل بعد",
								},
								{
									title: "مسوّدات",
									value: summary.draft,
									tooltip: "وصفات قيد الكتابة لم تُصدَر — لا تُصرف ولا تحرّك مخزونًا",
								},
								{
									title: "مكتملة",
									value: summary.completed,
									tooltip: "بلغ كل بند فيها الكمّية المصرَّح بها",
								},
								{
									title: "ملغاة",
									value: summary.cancelled,
									tooltip: "أُلغيت بعد الإصدار — ما صُرف منها يبقى مسجّلًا",
								},
							]}
						/>
					</div>

					<PrescriptionsTable
						rows={prescriptions}
						isLoading={isLoading || settingsLoading}
						search={q}
						onSearchChange={(value) => setSearch({ q: value })}
						onOpen={setDispensingId}
						emptyState={
							tab === "ACTIVE" && summary.draft > 0
								? {
										title: `لا وصفات في الطابور — و${summary.draft} مسوّدة لم تُصدَر`,
										description:
											"المسوّدة لا تصل الصيدلية ولا الفاتورة. افتح تبويب «المسوّدات» ثم أصدِر الوصفة من داخل الفحص السريري.",
									}
								: undefined
						}
						actions={
							<Button
								size="sm"
								onClick={() => setSelling(true)}
							>
								<IconCashRegister className="size-4" />
								بيع دواء
							</Button>
						}
					/>
				</>
			)}

			<DispenseSheet
				prescriptionId={dispensingId}
				onClose={() => setDispensingId(null)}
			/>

			<CounterSaleDialog
				open={selling}
				onOpenChange={setSelling}
			/>
		</div>
	);
}
