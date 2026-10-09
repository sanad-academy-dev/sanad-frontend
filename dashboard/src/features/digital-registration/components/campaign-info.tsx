import { IconCopy, IconExternalLink } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function CampaignInfo() {
	return (
		<div className="flex w-full flex-col gap-4 p-4 mt-4" dir="rtl">
			{/* Grid Info */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				<div className="flex flex-col gap-1.5 rounded-md border p-4 bg-white text-start">
					<span className="text-[11px] text-muted-foreground font-medium">الفئة العمرية</span>
					<span className="text-sm font-bold text-foreground">2-3 سنوات</span>
				</div>
				<div className="flex flex-col gap-1.5 rounded-md border p-4 bg-white text-start">
					<span className="text-[11px] text-muted-foreground font-medium">الفصل</span>
					<span className="text-sm font-bold text-foreground">النجوم</span>
				</div>

				<div className="flex flex-col gap-1.5 rounded-md border p-4 bg-white text-start">
					<span className="text-[11px] text-muted-foreground font-medium">السعة</span>
					<span className="text-sm font-bold text-foreground">30 مقعد</span>
				</div>
				<div className="flex flex-col gap-1.5 rounded-md border p-4 bg-white text-start">
					<span className="text-[11px] text-muted-foreground font-medium">المقاعد المتبقية</span>
					<span className="text-sm font-bold text-foreground">12</span>
				</div>

				<div className="flex flex-col gap-1.5 rounded-md border p-4 bg-white text-start">
					<span className="text-[11px] text-muted-foreground font-medium">تاريخ البدء</span>
					<span className="text-sm font-bold text-foreground">01/01/2026</span>
				</div>
				<div className="flex flex-col gap-1.5 rounded-md border p-4 bg-white text-start">
					<span className="text-[11px] text-muted-foreground font-medium">تاريخ الانتهاء</span>
					<span className="text-sm font-bold text-foreground">28/01/2026</span>
				</div>

				<div className="flex flex-col gap-1.5 rounded-md border p-4 bg-white text-start">
					<span className="text-[11px] text-muted-foreground font-medium">المنشئ</span>
					<span className="text-sm font-bold text-foreground">أحمد المالكي</span>
				</div>
				<div className="hidden lg:block"></div>
			</div>

			{/* Registration Link */}
			<div className="flex flex-col gap-3 rounded-md border p-4 bg-[#F3F4F6] text-start">
				<span className="text-sm font-bold text-foreground">رابط التسجيل</span>
				<div className="flex items-center gap-2">
					<Input 
						className="flex-1 text-muted-foreground bg-transparent border-[#D1D5DB]" 
						value="https://sanad.app/register/CMP-7001" 
						readOnly 
						dir="ltr"
					/>
					<Button variant="outline" size="sm" className="bg-white hover:bg-muted text-foreground px-4">
						<IconCopy className="me-1.5 size-4" />
						نسخ
					</Button>
					<Button variant="outline" size="sm" className="bg-white hover:bg-muted text-foreground px-4">
						<IconExternalLink className="me-1.5 size-4" />
						فتح
					</Button>
				</div>
			</div>

			{/* Requirements */}
			<div className="flex flex-col gap-2 rounded-md border p-4 bg-white text-start">
				<span className="text-sm font-bold text-foreground">المتطلبات</span>
				<span className="text-sm text-muted-foreground font-medium">شهادة ميلاد، صورة هوية ولي الأمر، شهادة تطعيم</span>
			</div>
		</div>
	);
}
