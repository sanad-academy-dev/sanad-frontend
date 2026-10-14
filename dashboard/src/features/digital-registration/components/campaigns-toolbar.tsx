import { useState } from "react";
import { IconFilter, IconPlus } from "@tabler/icons-react";

import { TableToolbar } from "@/components/common/table-toolbar";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { AddCampaignSheet } from "@/features/digital-registration/components/add-campaign-sheet";

export function CampaignsToolbar({
	searchValue,
	onSearchChange,
	statusFilter,
	onStatusFilterChange,
	onExport,
}: {
	searchValue?: string;
	onSearchChange?: (val: string) => void;
	statusFilter?: string;
	onStatusFilterChange?: (val: string) => void;
	onExport?: () => void;
}) {
	const [isSheetOpen, setIsSheetOpen] = useState(false);

	return (
		<>
			<TableToolbar
				searchValue={searchValue}
				onSearchChange={onSearchChange}
				searchPlaceholder="ابحث بالحملة، الرمز، أو الفئة العمرية..."
				onExport={onExport}
				showFilter={false}
				leftExtra={
					statusFilter !== undefined && onStatusFilterChange ? (
						<Select value={statusFilter} onValueChange={onStatusFilterChange}>
							<SelectTrigger className="h-8 text-xs w-36 gap-1.5" dir="rtl">
								<IconFilter className="size-3.5 text-muted-foreground" />
								<SelectValue placeholder="حالة الحملة" />
							</SelectTrigger>
							<SelectContent dir="rtl">
								<SelectItem value="ALL">جميع الحالات</SelectItem>
								<SelectItem value="ACTIVE">نشطة</SelectItem>
								<SelectItem value="COMPLETED">مكتملة</SelectItem>
								<SelectItem value="DRAFT">مسودة</SelectItem>
								<SelectItem value="CLOSED">مغلقة</SelectItem>
							</SelectContent>
						</Select>
					) : undefined
				}
				actions={
					<Button
						type="button"
						size="sm"
						className="h-8 gap-1.5 text-xs font-bold"
						onClick={() => setIsSheetOpen(true)}
					>
						<IconPlus className="size-3.5" />
						حملة جديدة
					</Button>
				}
			/>
			<AddCampaignSheet open={isSheetOpen} onClose={() => setIsSheetOpen(false)} />
		</>
	);
}
