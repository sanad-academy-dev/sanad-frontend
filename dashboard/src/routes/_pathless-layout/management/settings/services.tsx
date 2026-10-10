import { createFileRoute } from "@tanstack/react-router";
import { Stats } from "@/components/common/stats";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ServicesTable } from "@/features/settings/services/components/table";
import { SERVICES_STATS } from "@/features/settings/services/data/stats";

export const Route = createFileRoute("/_pathless-layout/management/settings/services")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="flex flex-1 flex-col">
			<Stats
				className="px-4"
				stats={SERVICES_STATS}
			/>
			{/* «الكشف» انتقل إلى إعدادات الفرع ← الدورات ← أنواع الكشف. التبويب باقٍ
			    بتبويبة واحدة لأن فئات الدورات ستعود إليه، ولأن حذفه يغيّر مسار صفحة قائمة. */}
			<Tabs
				defaultValue="services"
				className="flex flex-1 flex-col gap-0"
				dir="rtl"
			>
				<div className="px-3 py-2">
					<TabsList className="w-full justify-start">
						<TabsTrigger
							className="flex-none px-2.5 py-2"
							value="services"
						>
							الدورات
						</TabsTrigger>
					</TabsList>
				</div>

				<TabsContent value="services">
					{/* فئة «التحاليل» انتقلت إلى إعدادات المختبر داخل دورات الفرع */}
					<ServicesTable scope="non-lab" />
				</TabsContent>
			</Tabs>
		</div>
	);
}
