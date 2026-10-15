import { useState } from "react";
import {
	IconChevronDown,
	IconDownload,
	IconFileSpreadsheet,
	IconFilter,
	IconPlus,
} from "@tabler/icons-react";

import { TableToolbar } from "@/components/common/table-toolbar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
	onExportCsv,
}: {
	searchValue?: string;
	onSearchChange?: (val: string) => void;
	statusFilter?: string;
	onStatusFilterChange?: (val: string) => void;
	onExport?: () => void;
	onExportCsv?: () => void;
}) {
	const [isSheetOpen, setIsSheetOpen] = useState(false);

	return (
		<>
			<TableToolbar
				searchValue={searchValue}
				onSearchChange={onSearchChange}
				searchPlaceholder="ابحث بالحملة، الرمز، أو الفئة العمرية..."
				onExport={onExport}
				showExport={!onExportCsv && !!onExport}
				showFilter={false}
				leftExtra={
					<div className="flex items-center gap-2">
						{statusFilter !== undefined && onStatusFilterChange ? (
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
						) : null}

						{onExport && onExportCsv && (
							<DropdownMenu dir="rtl">
								<DropdownMenuTrigger asChild>
									<Button
										type="button"
										size="sm"
										variant="outline"
										className="h-8 gap-1.5 text-xs font-normal hover:bg-muted"
									>
										<IconFileSpreadsheet className="size-3.5 text-emerald-600" />
										<span>تصدير الحملات</span>
										<IconChevronDown className="size-3 text-muted-foreground" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end" className="w-52 text-xs">
									<DropdownMenuItem onClick={onExport} className="cursor-pointer gap-2 py-2">
										<IconFileSpreadsheet className="size-4 text-emerald-600" />
										<div className="flex flex-col text-start">
											<span className="font-medium text-foreground">تصدير Excel (.xlsx)</span>
											<span className="text-[10px] text-muted-foreground">ملف منسق مع جداول وتنسيق RTL</span>
										</div>
									</DropdownMenuItem>
									<DropdownMenuItem onClick={onExportCsv} className="cursor-pointer gap-2 py-2">
										<IconDownload className="size-4 text-muted-foreground" />
										<div className="flex flex-col text-start">
											<span className="font-medium text-foreground">تصدير CSV (.csv)</span>
											<span className="text-[10px] text-muted-foreground">ملف نصي بترميز UTF-8</span>
										</div>
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						)}
					</div>
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
