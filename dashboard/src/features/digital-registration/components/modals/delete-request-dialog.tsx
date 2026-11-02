import { useState } from "react";
import {
	IconAlertTriangle,
	IconArrowRight,
	IconCalendar,
	IconChevronDown,
	IconTrash,
} from "@tabler/icons-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
	Sheet,
	SheetContent,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { CampaignRequestItem } from "../../types/campaign-request.types";
import { useDeleteRequestWithReason } from "../../hooks/use-digital-registration";

interface DeleteRequestDialogProps {
	request: CampaignRequestItem | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	campaignId?: string;
	onDeletedSuccess?: () => void;
}

const DELETION_REASONS = [
	"طلب ولي الأمر إلغاء التسجيل / الاعتذار",
	"عدم الحضور أو تعذر التواصل مع ولي الأمر",
	"المسار أو التخصص المطلوب غير متاح حالياً",
	"تسجيل مكرر لنفس الطالب بالخطأ",
	"عدم استيفاء شروط ومعايير القبول",
	"الانتقال إلى جهة أو أكاديمية تعليمية أخرى",
	"ظروف عائلية أو خاصة بالطالب",
	"سبب آخر (تحديد يدوي)",
];

export function DeleteRequestDialog({
	request,
	open,
	onOpenChange,
	campaignId = "",
	onDeletedSuccess,
}: DeleteRequestDialogProps) {
	const [reason, setReason] = useState<string>("طلب ولي الأمر إلغاء التسجيل / الاعتذار");
	const [customReason, setCustomReason] = useState("");
	const [notes, setNotes] = useState("");
	const [notifyEmail, setNotifyEmail] = useState(true);
	const [isConfirmed, setIsConfirmed] = useState(false);

	const deleteMutation = useDeleteRequestWithReason(campaignId);

	if (!request) return null;

	const handleDelete = () => {
		const activeReason = reason === "سبب آخر (تحديد يدوي)" ? customReason.trim() : reason;

		if (!activeReason) {
			toast.error("يرجى تحديد أو كتابة سبب الحذف");
			return;
		}

		if (!isConfirmed) {
			toast.error("يرجى تأكيد إقرار مراجعة الحذف أولاً");
			return;
		}

		deleteMutation.mutate(
			{
				requestId: request.id,
				data: {
					reason: activeReason,
					notes: notes.trim() || undefined,
					notifyEmail,
				},
			},
			{
				onSuccess: () => {
					toast.success(`تم حذف طلب الطالب "${request.patientName}" بنجاح`);
					onOpenChange(false);
					onDeletedSuccess?.();
				},
				onError: (err: any) => {
					toast.error(err.message || "فشل حذف طلب التسجيل");
				},
			},
		);
	};

	const canSubmit =
		isConfirmed &&
		!deleteMutation.isPending &&
		(reason !== "سبب آخر (تحديد يدوي)" || customReason.trim().length > 0);

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
				{/* رأس اللوحة مع زر الرجوع والعنوان واسم الطالب بدون كود الطلب المكدس */}
				<div className="p-3 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-right bg-white dark:bg-zinc-900 shrink-0">
					<div className="flex items-center gap-2">
						<button
							type="button"
							onClick={() => onOpenChange(false)}
							className="size-7 rounded-md flex items-center justify-center text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
							title="رجوع"
						>
							<IconArrowRight className="size-4" />
						</button>
						<span className="text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
							<IconTrash className="size-3.5" />
							<span>حذف طلب الطالب</span>
						</span>
					</div>

					<div className="flex items-center gap-1.5 text-xs min-w-0">
						<span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 truncate max-w-[150px]">
							{request.patientName}
						</span>
					</div>
				</div>

				{/* محتوى اللوحة القابل للتمرير */}
				<div className="p-3.5 space-y-3 flex-1 min-h-0 overflow-y-auto overscroll-contain sanad-scrollbar">
					{/* كارت ملخص الطالب وولي الأمر */}
					<div className="rounded-lg border border-rose-100 dark:border-rose-950/60 bg-rose-50/40 dark:bg-rose-950/20 p-2.5 flex items-center justify-between gap-2.5 shadow-2xs">
						<div className="flex items-center gap-2 min-w-0">
							<Avatar className="size-8 border border-rose-200 dark:border-rose-900 shrink-0">
								<AvatarFallback className="bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300 font-bold text-[10px]">
									{request.patientName.slice(0, 2)}
								</AvatarFallback>
							</Avatar>
							<div className="min-w-0">
								<p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
									{request.patientName}
								</p>
								<p className="text-[10px] text-muted-foreground truncate">
									ولي الأمر: {request.guardianName}
								</p>
							</div>
						</div>

						<div className="flex flex-col items-end gap-1 shrink-0">
							<Badge
								variant="outline"
								className="text-[10px] px-1.5 py-0 border-rose-200 dark:border-rose-900/70 text-rose-700 dark:text-rose-300 font-semibold"
							>
								{request.guardianPhone || "بدون هاتف"}
							</Badge>
							{request.appointmentDate && (
								<span className="text-[9.5px] text-amber-700 dark:text-amber-400 font-medium flex items-center gap-1">
									<IconCalendar className="size-2.5" />
									جلسة محجوزة
								</span>
							)}
						</div>
					</div>

					{/* صندوق النتائج والتحذير المترتبة على الحذف بالأحمر الصريح */}
					<div className="rounded-lg border border-rose-200 dark:border-rose-900/60 bg-rose-50/80 dark:bg-rose-950/30 p-3 space-y-2">
						<span className="text-xs font-bold text-rose-800 dark:text-rose-300 flex items-center gap-1.5">
							<IconAlertTriangle className="size-4 text-rose-600 shrink-0" />
							تنبيه أمني والنتائج المترتبة على الحذف:
						</span>
						<ul className="space-y-1.5 text-[11px] text-rose-700 dark:text-rose-300/90 pr-5 list-disc leading-relaxed">
							<li>إلغاء وحذف موعد المقابلة / التقييم المحجوز فوراً وتفريغ المقعد في التقويم.</li>
							<li>استرجاع الطاقة الاستيعابية الشاغرة للحملة أو الفصل المخصص.</li>
							<li>مسح كافة المستندات والروابط والملاحظات المسجلة للطلب.</li>
							<li className="font-bold text-rose-900 dark:text-rose-200">
								⚠️ هذا الإجراء نهائي وغير قابل للتراجع بعد التنفيذ.
							</li>
						</ul>
					</div>

					{/* سبب الحذف */}
					<div className="space-y-1.5">
						<label className="text-[11px] font-bold text-zinc-800 dark:text-zinc-200 block">
							سبب الحذف والاعتذار <span className="text-destructive">*</span>
						</label>
						<DropdownMenu dir="rtl">
							<DropdownMenuTrigger asChild>
								<Button
									variant="outline"
									className="w-full justify-between h-8 text-xs font-medium border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50"
								>
									<span className="truncate">{reason}</span>
									<IconChevronDown className="size-3.5 opacity-60 shrink-0" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width]" align="start">
								{DELETION_REASONS.map((r) => (
									<DropdownMenuItem
										key={r}
										onClick={() => setReason(r)}
										className="text-xs cursor-pointer py-1.5"
									>
										{r}
									</DropdownMenuItem>
								))}
							</DropdownMenuContent>
						</DropdownMenu>

						{reason === "سبب آخر (تحديد يدوي)" && (
							<Input
								value={customReason}
								onChange={(e) => setCustomReason(e.target.value)}
								placeholder="اكتب سبب الحذف بدقة..."
								className="h-8 text-xs mt-1 border-rose-200 focus-visible:ring-rose-500"
								autoFocus
							/>
						)}
					</div>

					{/* ملاحظات إضافية للأرشفة */}
					<div className="space-y-1.5">
						<label className="text-[11px] font-bold text-zinc-800 dark:text-zinc-200 block">
							ملاحظات إدارية وأسباب الأرشفة <span className="text-muted-foreground font-normal">(اختياري)</span>
						</label>
						<Textarea
							value={notes}
							onChange={(e) => setNotes(e.target.value)}
							placeholder="اكتب أي ملاحظات أو توصيات إدارية بخصوص إلغاء الطلب..."
							rows={2}
							className="text-xs font-sans resize-none border-zinc-200 dark:border-zinc-800"
						/>
					</div>

					{/* إقرار الأمان لتأكيد الحذف ومنع الخطأ */}
					<div
						onClick={() => setIsConfirmed(!isConfirmed)}
						className={`rounded-lg border p-2.5 flex items-start gap-2.5 cursor-pointer transition-all ${
							isConfirmed
								? "border-rose-400 bg-rose-100/40 dark:border-rose-800 dark:bg-rose-950/40"
								: "border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900/40 hover:bg-zinc-100/60"
						}`}
					>
						<Checkbox
							id="confirm-delete-request"
							checked={isConfirmed}
							onCheckedChange={(val) => setIsConfirmed(Boolean(val))}
							className="mt-0.5 border-rose-400 data-checked:bg-rose-600 data-checked:border-rose-600"
							onClick={(e) => e.stopPropagation()}
						/>
						<div className="space-y-0.5 min-w-0 select-none">
							<label
								htmlFor="confirm-delete-request"
								className="text-[11px] font-bold text-zinc-900 dark:text-zinc-100 cursor-pointer block"
							>
								أؤكد رغبتي في حذف هذا الطلب نهائياً
							</label>
							<p className="text-[10px] text-muted-foreground leading-normal">
								أقر بأنني قمت بمراجعة بيانات الطالب وأتحمل مسؤولية شطب الطلب وإلغاء موعده ومقعده.
							</p>
						</div>
					</div>
				</div>

				{/* فوتر اللوحة */}
				<div className="p-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/70 dark:bg-zinc-900/70 shrink-0 gap-2 mt-auto">
					<div className="flex items-center gap-2">
						<Switch
							id="notify-email-delete"
							checked={notifyEmail}
							onCheckedChange={setNotifyEmail}
							className="scale-90"
						/>
						<label
							htmlFor="notify-email-delete"
							className="text-[11px] text-muted-foreground cursor-pointer font-medium select-none"
						>
							إشعار ولي الأمر
						</label>
					</div>

					<div className="flex items-center gap-2">
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={() => onOpenChange(false)}
							disabled={deleteMutation.isPending}
							className="h-8 text-xs font-medium border-border/80 hover:bg-muted cursor-pointer rounded-lg text-foreground"
						>
							إلغاء
						</Button>
						<Button
							type="button"
							size="sm"
							onClick={handleDelete}
							disabled={!canSubmit}
							className={canSubmit
								? "h-8 text-xs font-bold px-3.5 gap-1.5 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white rounded-lg shadow-sm transition-all cursor-pointer"
								: "h-8 text-xs font-bold px-3.5 gap-1.5 bg-rose-50 dark:bg-rose-950/40 text-rose-600/70 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50 rounded-lg cursor-not-allowed shadow-none select-none"
							}
						>
							<IconTrash className="size-3.5 shrink-0" />
							<span>{deleteMutation.isPending ? "جاري الحذف..." : "تأكيد الحذف النهائي"}</span>
						</Button>
					</div>
				</div>
			</SheetContent>
		</Sheet>
	);
}
