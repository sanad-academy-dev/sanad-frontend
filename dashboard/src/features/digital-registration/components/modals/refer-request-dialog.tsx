import { useState } from "react";
import {
	IconArrowRight,
	IconArrowsExchange,
	IconCheck,
	IconChevronDown,
	IconUser,
	IconX,
} from "@tabler/icons-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
} from "@/components/ui/sheet";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { CampaignRequestItem } from "../../types/campaign-request.types";
import { useReferRequest, useRegistrationReviewers } from "../../hooks/use-digital-registration";

interface ReferRequestDialogProps {
	request: CampaignRequestItem | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	campaignId?: string;
}

export function ReferRequestDialog({
	request,
	open,
	onOpenChange,
	campaignId = "",
}: ReferRequestDialogProps) {
	const [reason, setReason] = useState("");
	const [referredToStaffId, setReferredToStaffId] = useState<string | null>(null);
	const [notifyEmail, setNotifyEmail] = useState(false);

	const { data: staff = [], isLoading: staffLoading } = useRegistrationReviewers();
	const referMutation = useReferRequest(campaignId);

	if (!request) return null;

	const handleSubmit = () => {
		if (!referredToStaffId) {
			toast.error("يرجى اختيار الأخصائي أو المعلم المحال إليه ملف الطالب");
			return;
		}
		if (!reason.trim()) {
			toast.error("يرجى كتابة سبب الإحالة");
			return;
		}

		referMutation.mutate(
			{
				requestId: request.id,
				data: {
					referredToStaffId,
					reason: reason.trim(),
					notifyEmail,
				},
			},
			{
				onSuccess: () => {
					toast.success(`تمت إحالة ملف الطالب "${request.patientName}" بنجاح`);
					onOpenChange(false);
				},
				onError: (err: any) => {
					toast.error(err.message || "فشل إحالة الطالب");
				},
			},
		);
	};

	const selectedStaffMember = staff.find((s) => s.id === referredToStaffId);

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent
				side="left"
				showOverlay={false}
				showCloseButton={false}
				onPointerDownOutside={(e) => {
					const target = e.target as HTMLElement | null;
					if (
						target?.closest('[data-slot="sheet-content"]') ||
						target?.closest('[role="dialog"]') ||
						target?.closest('[role="menu"]') ||
						target?.closest('[data-radix-portal]') ||
						target?.closest('[data-radix-popper-content-wrapper]')
					) {
						e.preventDefault();
					}
				}}
				onFocusOutside={(e) => e.preventDefault()}
				className="w-full lg:w-[28vw]! lg:min-w-[20rem]! lg:max-w-[28rem]! lg:left-[calc(60vw+0.75rem)]! lg:right-auto! p-0 gap-0 overflow-hidden font-sans border border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col bg-background z-50 h-[calc(100dvh-1rem)]! max-h-[calc(100dvh-1rem)]! inset-y-2!"
				dir="rtl"
			>
				{/* رأس اللوحة مع زر الرجوع واسم الطالب بدون كود الطلب المكدس */}
				<div className="p-3 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-right bg-white dark:bg-zinc-900 shrink-0">
					<div className="flex items-center gap-2">
						<button
							type="button"
							onClick={() => onOpenChange(false)}
							className="size-7 rounded-md flex items-center justify-center text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
							title="رجوع"
						>
							<IconArrowRight className="size-4" />
						</button>
						<span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
							إحالة ملف الطالب لجهة / أخصائي آخر
						</span>
					</div>

					<div className="flex items-center gap-1.5 text-xs min-w-0">
						<span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 truncate max-w-[150px]">
							{request.patientName}
						</span>
					</div>
				</div>

				{/* محتوى اللوحة */}
				<div className="p-3.5 space-y-3.5 flex-1 min-h-0 overflow-y-auto overscroll-contain sanad-scrollbar">
					{/* اختيار الأخصائي / المراجع */}
					<div className="space-y-1.5">
						<label className="text-[11px] font-bold text-zinc-800 dark:text-zinc-200 block">
							إحالة إلى (الأخصائي أو المراجع) <span className="text-destructive">*</span>
						</label>
						<DropdownMenu dir="rtl">
							<DropdownMenuTrigger asChild>
								<Button
									variant="outline"
									className="w-full justify-between h-9 text-xs font-medium border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50"
								>
									<span className="flex items-center gap-2 truncate">
										<IconUser className="size-3.5 text-zinc-400 shrink-0" />
										<span className="truncate">{selectedStaffMember ? selectedStaffMember.name : "اختر الأخصائي المستهدف..."}</span>
									</span>
									<IconChevronDown className="size-3.5 opacity-60 shrink-0" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width]" align="start">
								{staffLoading ? (
									<div className="p-2 text-center text-xs text-muted-foreground">جاري التحميل...</div>
								) : staff.length === 0 ? (
									<div className="p-2 text-center text-xs text-muted-foreground">لا يوجد موظفون متاحون</div>
								) : (
									staff.map((s) => (
										<DropdownMenuItem
											key={s.id}
											onClick={() => setReferredToStaffId(s.id)}
											className="flex items-center gap-2 text-xs"
										>
											<Avatar className="size-6">
												<AvatarFallback className="text-[9px] bg-primary/10 text-primary font-bold">
													{s.name.slice(0, 2)}
												</AvatarFallback>
											</Avatar>
											<span className="truncate">{s.name}</span>
										</DropdownMenuItem>
									))
								)}
							</DropdownMenuContent>
						</DropdownMenu>
					</div>

					{/* سبب وملاحظات الإحالة */}
					<div className="space-y-1.5">
						<label className="text-[11px] font-bold text-zinc-800 dark:text-zinc-200 block">
							سبب وتفاصيل الإحالة <span className="text-destructive">*</span>
						</label>
						<Textarea
							value={reason}
							onChange={(e) => setReason(e.target.value)}
							placeholder="اكتب أسباب إحالة ملف الطالب والتوصيات الخاصة بالفحص أو المتابعة الأكاديمية..."
							className="min-h-28 text-xs leading-relaxed resize-none font-sans"
						/>
					</div>
				</div>

				{/* فوتر اللوحة */}
				<div className="p-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/50 shrink-0 mt-auto">
					<div className="flex items-center gap-2">
						<Switch
							id="notify-email-refer"
							checked={notifyEmail}
							onCheckedChange={setNotifyEmail}
						/>
						<label
							htmlFor="notify-email-refer"
							className="text-[11px] text-muted-foreground cursor-pointer font-medium"
						>
							إشعار عبر البريد
						</label>
					</div>

					<div className="flex items-center gap-2">
						<Button
							variant="outline"
							size="sm"
							onClick={() => onOpenChange(false)}
							disabled={referMutation.isPending}
							className="text-xs h-8"
						>
							إلغاء
						</Button>
						<Button
							size="sm"
							onClick={handleSubmit}
							disabled={referMutation.isPending}
							className="text-xs h-8 font-semibold px-4 gap-1.5 bg-primary text-primary-foreground"
						>
							<IconArrowsExchange className="size-3.5" />
							<span>{referMutation.isPending ? "جاري الإحالة..." : "تأكيد الإحالة"}</span>
						</Button>
					</div>
				</div>
			</SheetContent>
		</Sheet>
	);
}
