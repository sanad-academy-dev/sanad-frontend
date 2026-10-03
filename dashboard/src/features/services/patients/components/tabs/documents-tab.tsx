import { TabsContent } from "@/components/ui/tabs";
import type { PatientTabProps } from "@/features/services/patients/types/tabs.types";

export function DocumentsTab(_props: PatientTabProps) {
	return (
		<TabsContent
			value="documents"
			className="m-0 p-3"
			dir="rtl"
		>
			<p className="text-sm text-muted-foreground">لا توجد مستندات</p>
		</TabsContent>
	);
}
