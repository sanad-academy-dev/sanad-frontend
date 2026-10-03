import { IconPlus } from "@tabler/icons-react";

import { TableToolbar } from "@/components/common/table-toolbar";
import { Button } from "@/components/ui/button";

export function CarePlansToolbar({
	search,
	onSearchChange,
	onCreate,
}: {
	search: string;
	onSearchChange: (value: string) => void;
	onCreate: () => void;
}) {
	return (
		<TableToolbar
			searchPlaceholder="ابحث باسم الخطة، المعرّف..."
			searchClassName="w-[450px]"
			searchValue={search}
			onSearchChange={onSearchChange}
			actions={
				<Button
					size="sm"
					onClick={onCreate}
				>
					<IconPlus />
					إنشاء خطة جديد
				</Button>
			}
		/>
	);
}
