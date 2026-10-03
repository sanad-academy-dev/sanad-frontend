import { IconBell, IconPlus } from "@tabler/icons-react";

import { TableToolbar } from "@/components/common/table-toolbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface InvoicesToolbarProps {
	search: string;
	onSearchChange: (value: string) => void;
}

export function InvoicesToolbar({ search, onSearchChange }: InvoicesToolbarProps) {
	return (
		<TableToolbar
			searchPlaceholder="ابحث برقم الفاتورة، اسم العميل..."
			searchValue={search}
			onSearchChange={onSearchChange}
			actions={
				<>
					<Button
						variant="outline"
						className="relative"
						size="sm"
					>
						<IconBell />
						تذكيرات
						<Badge className="absolute -top-1.5 -left-1.5 flex size-4 items-center justify-center rounded-full p-0 text-[10px]">
							3
						</Badge>
					</Button>

					<Button
						disabled
						size="sm"
					>
						<IconPlus />
						إنشاء فاتورة جديد
					</Button>
				</>
			}
		/>
	);
}
