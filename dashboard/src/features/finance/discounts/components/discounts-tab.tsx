import { useState } from "react";

import { Stats } from "@/components/common/stats";
import type { StatItem } from "@/features/dashboard/types/dashboard.types";
import { AddDiscountSheet } from "@/features/finance/discounts/components/add-discount-sheet";
import { DeleteDiscountDialog } from "@/features/finance/discounts/components/delete-discount-dialog";
import { DisableDiscountDialog } from "@/features/finance/discounts/components/disable-discount-dialog";
import { DiscountsEmpty } from "@/features/finance/discounts/components/discounts-empty";
import { DiscountsTable } from "@/features/finance/discounts/components/discounts-table";
import { DiscountsToolbar } from "@/features/finance/discounts/components/discounts-toolbar";
import {
	responseToPayload,
	useDiscountMutations,
} from "@/features/finance/discounts/hooks/use-discount-mutations";
import { useDiscountStats } from "@/features/finance/discounts/hooks/use-discount-stats";
import { useDiscounts } from "@/features/finance/discounts/hooks/use-discounts";
import type { DiscountStatus } from "@/generated/prisma/enums";
import type { DiscountResponse } from "@/server/discounts/discounts.type";

export function DiscountsTab() {
	const { discounts, isLoading } = useDiscounts();
	const { stats } = useDiscountStats();
	const { create, remove, setStatus, isDeleting, isSettingStatus } = useDiscountMutations();

	const [sheetOpen, setSheetOpen] = useState(false);
	const [editing, setEditing] = useState<DiscountResponse | null>(null);
	const [deleting, setDeleting] = useState<DiscountResponse | null>(null);
	const [disabling, setDisabling] = useState<DiscountResponse | null>(null);

	const openCreate = () => {
		setEditing(null);
		setSheetOpen(true);
	};

	const openEdit = (discount: DiscountResponse) => {
		setEditing(discount);
		setSheetOpen(true);
	};

	const handleSheetOpenChange = (open: boolean) => {
		setSheetOpen(open);
		if (!open) setEditing(null);
	};

	const handleDuplicate = (discount: DiscountResponse) => {
		void create(responseToPayload(discount));
	};

	const handleDelete = async () => {
		if (!deleting) return;
		try {
			await remove(deleting.id);
			setDeleting(null);
		} catch {
			// toast handled by hook
		}
	};

	const handleStatusChange = (discount: DiscountResponse, status: DiscountStatus) => {
		// تعطيل الخصم يتطلّب تأكيداً؛ باقي الحالات تُطبَّق مباشرةً
		if (status === "INACTIVE") {
			setDisabling(discount);
			return;
		}
		void setStatus(discount.id, status);
	};

	const handleConfirmDisable = async () => {
		if (!disabling) return;
		try {
			await setStatus(disabling.id, "INACTIVE");
			setDisabling(null);
		} catch {
			// toast handled by hook
		}
	};

	const discountStats: StatItem[] = [
		{ title: "# الخصومات", value: stats?.total ?? 0, tooltip: "إجمالي عدد الخصومات المسجّلة" },
		{
			title: "# الاستخدامات",
			value: stats?.usages ?? 0,
			tooltip: "إجمالي مرّات استخدام الخصومات",
		},
		{ title: "# نشطة", value: stats?.active ?? 0, tooltip: "الخصومات النشطة حالياً" },
		{
			title: "# التوفير",
			value: stats?.savings ?? 0,
			valueLabel: `${(stats?.savings ?? 0).toLocaleString("ar-SA", { maximumFractionDigits: 2 })} ر.س`,
			tooltip: "إجمالي المبلغ الموفّر عبر الخصومات الثابتة",
		},
		{
			title: "# منتهي الصلاحية",
			value: stats?.expired ?? 0,
			tooltip: "الخصومات المنتهية الصلاحية",
		},
	];

	return (
		<>
			<Stats
				className="px-[9px]"
				stats={discountStats}
				variant="inventory"
			/>
			<hr className="my-2" />
			<DiscountsToolbar onCreate={openCreate} />
			<hr className="my-2" />

			{!isLoading && discounts.length === 0 ? (
				<DiscountsEmpty onCreate={openCreate} />
			) : (
				<DiscountsTable
					discounts={discounts}
					isLoading={isLoading}
					onEdit={openEdit}
					onDuplicate={handleDuplicate}
					onDelete={setDeleting}
					onStatusChange={handleStatusChange}
				/>
			)}

			<AddDiscountSheet
				open={sheetOpen}
				onOpenChange={handleSheetOpenChange}
				discount={editing}
			/>

			<DeleteDiscountDialog
				discount={deleting}
				onOpenChange={(open) => !open && setDeleting(null)}
				onConfirm={handleDelete}
				isDeleting={isDeleting}
			/>

			<DisableDiscountDialog
				discount={disabling}
				onOpenChange={(open) => !open && setDisabling(null)}
				onConfirm={handleConfirmDisable}
				isPending={isSettingStatus}
			/>
		</>
	);
}
