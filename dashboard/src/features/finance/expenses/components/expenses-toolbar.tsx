import {
	IconBell,
	IconChartBar,
	IconCheck,
	IconLayoutGrid,
	IconLayoutList,
	IconPlus,
} from "@tabler/icons-react";

import { TableToolbar } from "@/components/common/table-toolbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ExpensesViewMode } from "@/features/finance/expenses/data/expense-records";
import { cn } from "@/lib/utils";

interface ExpensesToolbarProps {
	search: string;
	onSearchChange: (value: string) => void;
	onCreate: () => void;
	view: ExpensesViewMode;
	onViewChange: (view: ExpensesViewMode) => void;
	/** فتح لوحة "طلبات الاعتمادات" (المصروفات التي تنتظر إجراء المستخدم) */
	onOpenApprovals: () => void;
	/** عدد الطلبات التي تنتظر إجراء المستخدم */
	approvalsCount: number;
}

export function ExpensesToolbar({
	search,
	onSearchChange,
	onCreate,
	view,
	onViewChange,
	onOpenApprovals,
	approvalsCount,
}: ExpensesToolbarProps) {
	return (
		<TableToolbar
			searchPlaceholder="ابحث عن مصروف..."
			searchValue={search}
			onSearchChange={onSearchChange}
			showView={false}
			leftExtra={
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							size="sm"
							variant="outline"
						>
							{view === "grid" ? <IconLayoutGrid /> : <IconLayoutList />}
							العرض
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						align="start"
						className="w-40"
					>
						<DropdownMenuItem onClick={() => onViewChange("grid")}>
							<IconLayoutGrid className="size-4" />
							بطاقات
							<IconCheck
								className={cn("ms-auto size-4", view === "grid" ? "opacity-100" : "opacity-0")}
							/>
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => onViewChange("list")}>
							<IconLayoutList className="size-4" />
							قائمة
							<IconCheck
								className={cn("ms-auto size-4", view === "list" ? "opacity-100" : "opacity-0")}
							/>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			}
			actions={
				<>
					<Button
						size="sm"
						variant="outline"
						className="relative px-4"
						onClick={onOpenApprovals}
					>
						<IconBell />
						طلبات الاعتمادات
						{approvalsCount > 0 && (
							<Badge className="absolute -top-1.5 -left-1.5 flex size-4 items-center justify-center rounded-full p-0 text-[10px]">
								{approvalsCount}
							</Badge>
						)}
					</Button>
					<Button
						size="sm"
						variant="outline"
						className="px-4"
					>
						<IconChartBar />
						التقارير
					</Button>
					<Button
						size="sm"
						onClick={onCreate}
					>
						<IconPlus />
						إنشاء مصروف
					</Button>
				</>
			}
		/>
	);
}
