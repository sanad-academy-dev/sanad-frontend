import { createFileRoute, redirect } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { Stats } from "@/components/common/stats";
import { BatchesView } from "@/features/inventory/components/batches/batches-view";
import {
	InventoryHeader,
	type InventoryTab,
} from "@/features/inventory/components/inventory-header";
import { InventoryTable } from "@/features/inventory/components/inventory-table";
import { POSView } from "@/features/inventory/components/pos/pos-view";
import { PurchasesView } from "@/features/inventory/components/purchasing/purchases-view";
import { ReportsView } from "@/features/inventory/components/reports/reports-view";
import { MovementsView } from "@/features/inventory/components/stock/movements-view";
import { SuppliersTable } from "@/features/inventory/components/suppliers-table";
import { WarehousesView } from "@/features/inventory/components/warehouses/warehouses-view";
import {
	BATCHES_STATS,
	buildBatchesStats,
	buildInventoryStats,
	INVENTORY_STATS,
	MOVEMENTS_STATS,
	POS_STATS,
	PURCHASES_STATS,
	REPORTS_STATS,
	SUPPLIERS_STATS,
	WAREHOUSES_STATS,
} from "@/features/inventory/data/stats";
import { useStockOverview } from "@/features/inventory/hooks/use-stock-overview";
import { useWarehouses } from "@/features/inventory/hooks/use-warehouses";
import { getSession } from "@/functions/get-session";
import { PERMISSIONS } from "@/lib/permissions";
import { parseBranchSettings } from "@sanad/contracts/runtime/server/branches/branches.type";

export const Route = createFileRoute("/_pathless-layout/management/inventory")({
	component: RouteComponent,
	beforeLoad: async () => {
		const { session } = await getSession();
		if (session?.session.role === "MEMBER") {
			const perms: string[] = JSON.parse(session.session.permissions ?? "[]");
			const canView =
				perms.includes(PERMISSIONS.INVENTORY_VIEW_LIMITED) ||
				perms.includes(PERMISSIONS.INVENTORY_VIEW_FULL);
			if (!canView) throw redirect({ to: "/dashboard" });
		}
	},
});

const STATIC_STATS_BY_TAB: Record<InventoryTab, typeof INVENTORY_STATS> = {
	products: INVENTORY_STATS,
	movements: MOVEMENTS_STATS,
	warehouses: WAREHOUSES_STATS,
	purchases: PURCHASES_STATS,
	batches: BATCHES_STATS,
	reports: REPORTS_STATS,
	suppliers: SUPPLIERS_STATS,
	pos: POS_STATS,
};

function RouteComponent() {
	const [tab, setTab] = useState<InventoryTab>("products");
	const [poSheetOpen, setPoSheetOpen] = useState(false);
	const { overview } = useStockOverview();
	const { warehouses, isLoading: warehousesLoading } = useWarehouses();

	// تبويب طلب الشراء يُخفى عندما لا يوجد أي مستودع مفعل يقبل طلبات الشراء
	// (مستودع مركزي بلا فرع يقبل دائمًا؛ مستودع فرع يخضع لإعداد الفرع)
	const purchasingEnabled = useMemo(
		() =>
			warehouses.some(
				(w) =>
					w.active &&
					(!w.branch || parseBranchSettings(w.branch.settings).warehouse.purchaseOrders),
			),
		[warehouses],
	);
	const purchasesHidden = !warehousesLoading && !purchasingEnabled;

	useEffect(() => {
		if (purchasesHidden && tab === "purchases") setTab("products");
	}, [purchasesHidden, tab]);

	// زر "طلب شراء" في تبويب المنتجات → ينتقل لتبويب المشتريات ويفتح نموذج الأمر
	const requestPurchase = () => {
		if (purchasesHidden) {
			toast.error("طلبات الشراء معطلة لجميع المستودعات — فعّلها من إعدادات الفرع");
			return;
		}
		setTab("purchases");
		setPoSheetOpen(true);
	};

	// بطاقات حيّة للمنتجات/الصلاحية من ملخّص المخزون، والباقي ثابت
	// (memoized لتفادي إنشاء مصفوفة جديدة كل render تُمرَّر إلى <Stats>)
	const stats = useMemo(
		() =>
			tab === "products"
				? buildInventoryStats(overview)
				: tab === "batches"
					? buildBatchesStats(overview)
					: STATIC_STATS_BY_TAB[tab],
		[tab, overview],
	);

	return (
		<div className="flex flex-1 flex-col overflow-hidden">
			<InventoryHeader
				active={tab}
				onChange={setTab}
				hiddenTabs={purchasesHidden ? ["purchases"] : undefined}
			/>
			<Stats
				className="px-[9px]"
				stats={stats}
				variant="inventory"
			/>
			{tab === "movements" && <MovementsView />}
			{tab === "warehouses" && <WarehousesView />}
			{tab === "batches" && <BatchesView />}
			{tab === "reports" && <ReportsView />}
			{tab === "purchases" && (
				<PurchasesView
					sheetOpen={poSheetOpen}
					setSheetOpen={setPoSheetOpen}
				/>
			)}
			{tab === "suppliers" && <SuppliersTable />}
			{tab === "pos" && <POSView />}
			{tab === "products" && (
				<InventoryTable
					onRequestPurchase={requestPurchase}
					onShowMovements={() => setTab("movements")}
					onShowExpiry={() => setTab("batches")}
				/>
			)}
		</div>
	);
}
