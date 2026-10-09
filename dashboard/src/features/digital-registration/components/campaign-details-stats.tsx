import { Card } from "@/components/ui/card";

export function CampaignDetailsStats() {
	return (
		<div className="flex w-full flex-col gap-4 p-4 mt-4" dir="rtl">
			{/* Top Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				<Card className="flex flex-col items-center justify-center p-6 gap-2 rounded-md shadow-none">
					<span className="text-3xl font-bold text-foreground">28</span>
					<span className="text-sm text-muted-foreground">الطلبات</span>
				</Card>
				<Card className="flex flex-col items-center justify-center p-6 gap-2 rounded-md shadow-none">
					<span className="text-3xl font-bold text-emerald-600">18</span>
					<span className="text-sm text-muted-foreground">مقبول</span>
				</Card>
				<Card className="flex flex-col items-center justify-center p-6 gap-2 rounded-md shadow-none">
					<span className="text-3xl font-bold text-amber-500">5</span>
					<span className="text-sm text-muted-foreground">قيد المراجعة</span>
				</Card>
				<Card className="flex flex-col items-center justify-center p-6 gap-2 rounded-md shadow-none">
					<span className="text-3xl font-bold text-red-500">3</span>
					<span className="text-sm text-muted-foreground">مرفوض</span>
				</Card>
			</div>

			{/* Middle Progress */}
			<Card className="flex flex-col p-6 gap-4 rounded-md shadow-none">
				<div className="flex justify-between items-center w-full">
					<span className="text-sm font-medium text-muted-foreground">نسبة الامتلاء</span>
					<span className="text-[15px] font-bold text-[#0f3d37]">60%</span>
				</div>
				<div className="h-3 w-full rounded-full bg-muted overflow-hidden flex" dir="ltr">
					<div className="h-full bg-[#0f3d37] w-[60%] rounded-e-full" />
				</div>
				<div className="flex justify-between items-center w-full text-xs text-muted-foreground">
					<span>18 مقبول</span>
					<span>30 مقعد</span>
				</div>
			</Card>

			{/* Bottom Sources */}
			<Card className="flex flex-col p-6 gap-4 rounded-md shadow-none">
				<span className="text-[15px] font-bold text-foreground self-start mb-2">مصادر التسجيل</span>
				<div className="flex flex-col gap-3">
					<div className="flex justify-between items-center">
						<span className="text-[13px] text-muted-foreground">الموقع الإلكتروني</span>
						<span className="text-sm font-bold text-foreground">2</span>
					</div>
					<div className="flex justify-between items-center">
						<span className="text-[13px] text-muted-foreground">رابط مباشر</span>
						<span className="text-sm font-bold text-foreground">1</span>
					</div>
					<div className="flex justify-between items-center">
						<span className="text-[13px] text-muted-foreground">إحالة</span>
						<span className="text-sm font-bold text-foreground">1</span>
					</div>
					<div className="flex justify-between items-center">
						<span className="text-[13px] text-muted-foreground">تواصل اجتماعي</span>
						<span className="text-sm font-bold text-foreground">1</span>
					</div>
				</div>
			</Card>
		</div>
	);
}
