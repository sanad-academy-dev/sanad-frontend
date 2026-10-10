import { IconChartBar, IconPlus } from "@tabler/icons-react";

import { TableToolbar } from "@/components/common/table-toolbar";
import { Button } from "@/components/ui/button";

export function DiscountsToolbar({ onCreate }: { onCreate: () => void }) {
	return (
		<TableToolbar
			searchPlaceholder="ابحث باسم الخصم، للمعرّف..."
			actions={
				<>
					<Button
						variant="outline"
						size="sm"
					>
						<IconChartBar />
					</Button>
					<Button
						size="sm"
						onClick={onCreate}
					>
						<IconPlus />
						إنشاء خصم جديد
					</Button>
				</>
			}
		/>
	);
}
