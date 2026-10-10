import { IconUser, IconHeartbeat, IconShield, IconListCheck, IconAlertTriangle, IconX, IconCheck, IconPhone, IconMail, IconMenu2, IconCircleCheckFilled, IconCircle } from "@tabler/icons-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { CampaignRequestItem } from "./campaign-requests-kanban";

export function CampaignRequestDialog({ 
	request, 
	open, 
	onOpenChange 
}: { 
	request: CampaignRequestItem | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	if (!request) return null;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-3xl p-0 gap-0" dir="rtl" showCloseButton={false}>
				{/* Header */}
				<DialogHeader className="px-6 py-4 border-b flex flex-row items-start justify-between">
					<div className="flex items-center gap-3">
						<div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-pink-50 text-pink-500 border border-pink-100 mt-0.5">
							<IconUser size={20} />
						</div>
						<div className="flex flex-col gap-1">
							<DialogTitle className="text-xl font-bold">{request.patientName}</DialogTitle>
							<div className="text-sm text-muted-foreground flex items-center gap-1.5">
								<span>{request.code}</span>
								<span>•</span>
								<span>أنثى</span>
								<span>•</span>
								<span>2 سنوات</span>
							</div>
						</div>
					</div>
					<DialogClose asChild>
						<Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
							<IconX className="size-4" />
						</Button>
					</DialogClose>
				</DialogHeader>

				<div className="p-6 overflow-y-auto max-h-[70vh] flex flex-col gap-4 bg-[#F8FAFC]">
					{/* بيانات الطفل */}
					<div className="bg-white rounded-lg border p-4 shadow-sm">
						<div className="flex items-center gap-2 text-primary font-bold mb-4">
							<IconUser className="size-5 text-[#0f3d37]" />
							<h3 className="text-[#0f3d37]">بيانات الطفل</h3>
						</div>
						<div className="grid grid-cols-3 gap-6">
							<div className="flex flex-col gap-1">
								<span className="text-xs text-muted-foreground">الاسم</span>
								<span className="font-semibold text-sm">ليان محمد</span>
							</div>
							<div className="flex flex-col gap-1">
								<span className="text-xs text-muted-foreground">تاريخ الميلاد</span>
								<span className="font-semibold text-sm">1/01/2023</span>
							</div>
							<div className="flex flex-col gap-1">
								<span className="text-xs text-muted-foreground">الجنس</span>
								<span className="font-semibold text-sm">أنثى</span>
							</div>
							<div className="flex flex-col gap-1">
								<span className="text-xs text-muted-foreground">العمر</span>
								<span className="font-semibold text-sm">2 سنوات</span>
							</div>
							<div className="flex flex-col gap-1">
								<span className="text-xs text-muted-foreground">الفصل المطلوب</span>
								<span className="font-semibold text-sm">النجوم</span>
							</div>
							<div className="flex flex-col gap-1">
								<span className="text-xs text-muted-foreground">تاريخ التقديم</span>
								<span className="font-semibold text-sm">1/02/2026</span>
							</div>
						</div>
					</div>

					{/* المعلومات الطبية */}
					<div className="bg-white rounded-lg border p-4 shadow-sm">
						<div className="flex items-center gap-2 text-destructive font-bold mb-4">
							<IconHeartbeat className="size-5" />
							<h3>المعلومات الطبية</h3>
						</div>
						<div className="flex flex-col gap-4">
							<div className="grid grid-cols-2 gap-6">
								<div className="flex flex-col gap-1">
									<span className="text-xs text-muted-foreground">فصيلة الدم</span>
									<span className="font-semibold text-sm">A+</span>
								</div>
								<div className="flex flex-col gap-1">
									<span className="text-xs text-muted-foreground">حساسية</span>
									<div>
										<Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">حساسية فول سوداني</Badge>
									</div>
								</div>
							</div>
							
							<div className="flex items-center justify-between border rounded-md p-3 bg-red-50/50 border-red-100">
								<div className="flex items-center gap-2 text-destructive font-medium text-sm">
									<IconHeartbeat className="size-4" />
									<span>حالات مزمنة</span>
								</div>
								<Switch checked={true} className="data-[state=checked]:bg-destructive" />
							</div>

							<div className="border rounded-md p-3 bg-red-50/50 border-red-100 text-destructive text-sm font-medium text-center">
								ربو خفيف - الأدوية: بخاخ فنتولين عند الحاجة
							</div>
						</div>
					</div>

					{/* بيانات ولي الأمر */}
					<div className="bg-white rounded-lg border p-4 shadow-sm">
						<div className="flex items-center gap-2 text-primary font-bold mb-4">
							<IconShield className="size-5 text-[#0f3d37]" />
							<h3 className="text-[#0f3d37]">بيانات ولي الأمر</h3>
						</div>
						<div className="flex flex-col gap-4">
							<div className="flex items-center gap-3">
								<div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 font-bold">
									ما
								</div>
								<span className="font-bold">محمد السالم</span>
							</div>
							<div className="grid grid-cols-2 gap-3">
								<div className="relative">
									<Input value="0584505412" readOnly className="pr-10 text-left" dir="ltr" />
									<IconPhone className="size-4 absolute right-3 top-3 text-muted-foreground" />
								</div>
								<div className="relative">
									<Input value="mohammed@email.com" readOnly className="pr-10 text-left" dir="ltr" />
									<IconMail className="size-4 absolute right-3 top-3 text-muted-foreground" />
								</div>
							</div>
						</div>
					</div>

					{/* سلسلة الموافقات */}
					<div className="bg-white rounded-lg border p-4 shadow-sm">
						<div className="flex items-center gap-2 text-primary font-bold mb-4">
							<IconListCheck className="size-5 text-[#0f3d37]" />
							<h3 className="text-[#0f3d37]">سلسلة الموافقات</h3>
						</div>
						<div className="flex flex-col gap-4 relative">
							<div className="absolute right-[9px] top-2 bottom-2 w-px bg-muted"></div>
							
							<div className="flex gap-4 relative z-10">
								<IconCircleCheckFilled className="size-5 text-emerald-600 bg-white" />
								<div className="flex flex-col">
									<span className="font-bold text-sm">استلام الطلب</span>
									<span className="text-xs text-muted-foreground">النظام - 1/02/2026</span>
								</div>
							</div>
							
							<div className="flex gap-4 relative z-10 opacity-60">
								<IconCircle className="size-5 text-muted-foreground bg-white" />
								<div className="flex flex-col">
									<span className="font-bold text-sm">مراجعة المستندات</span>
									<span className="text-xs text-muted-foreground">فاطمة السالم - 1/02/2026</span>
								</div>
							</div>
							
							<div className="flex gap-4 relative z-10 opacity-60">
								<IconCircle className="size-5 text-muted-foreground bg-white" />
								<div className="flex flex-col">
									<span className="font-bold text-sm">مراجعة الطبيب</span>
									<span className="text-xs text-muted-foreground">د. أحمد العمري</span>
								</div>
							</div>
							
							<div className="flex gap-4 relative z-10 opacity-60">
								<IconCircle className="size-5 text-muted-foreground bg-white" />
								<div className="flex flex-col">
									<span className="font-bold text-sm">اعتماد المدير</span>
									<span className="text-xs text-muted-foreground">أحمد المالكي</span>
								</div>
							</div>
							
							<div className="flex gap-4 relative z-10 opacity-60">
								<IconCircle className="size-5 text-muted-foreground bg-white" />
								<div className="flex flex-col">
									<span className="font-bold text-sm">مراجعة المحاسب</span>
									<span className="text-xs text-muted-foreground">سارة المحمد</span>
								</div>
							</div>
						</div>
					</div>

					{/* ملاحظات */}
					<div className="bg-amber-50 rounded-lg border border-amber-200 p-4">
						<div className="flex items-center gap-2 text-amber-600 font-bold mb-2 justify-end flex-row-reverse">
							<h3>ملاحظات</h3>
							<IconAlertTriangle className="size-5" />
						</div>
						<p className="text-sm font-medium text-right w-full text-foreground">
							يحتاج متابعة خاصة في التكيف الاجتماعي
						</p>
					</div>
				</div>

				{/* Footer */}
				<div className="p-4 border-t bg-white flex items-center justify-between">
					<Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-md">
						<IconCheck className="size-4 ml-2" />
						قبول الطلب
					</Button>
					
					<div className="flex items-center gap-2">
						<Button variant="outline" className="rounded-md bg-muted/50 border-muted text-foreground">
							<IconMenu2 className="size-4 ml-2" />
							قائمة الانتظار
						</Button>
						<Button variant="outline" className="rounded-md border-red-200 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700">
							<IconX className="size-4 ml-2" />
							رفض
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
