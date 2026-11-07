import { cn } from "@/lib/utils";
import { useState, useEffect, useRef } from "react";
import {
	IconArrowRight,
	IconCalendar,
	IconCalendarOff,
	IconCheck,
	IconChevronDown,
	IconFileX,
	IconLoader2,
	IconPhone,
	IconShieldExclamation,
	IconTrash,
	IconUserMinus,
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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { CampaignRequestItem } from "../../types/campaign-request.types";
import { useDeleteRequestWithReason } from "../../hooks/use-digital-registration";
import {
	RegistrationDrawerHeader,
	RegistrationDrawerGuardianCard,
} from "./registration-drawer-header";

interface DeleteRequestDialogProps {
	request: CampaignRequestItem | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	campaignId?: string;
	onDeletedSuccess?: () => void;
	isExpanded?: boolean;
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
	isExpanded = false,
}: DeleteRequestDialogProps) {
	const [reason, setReason] = useState<string>("طلب ولي الأمر إلغاء التسجيل / الاعتذار");
	const [customReason, setCustomReason] = useState("");
	const [notes, setNotes] = useState("");
	const [notifyEmail, setNotifyEmail] = useState(true);
	const [isConfirmed, setIsConfirmed] = useState(false);

	const scrollContainerRef = useRef<HTMLDivElement>(null);

	const deleteMutation = useDeleteRequestWithReason(campaignId);

	useEffect(() => {
		if (open && request) {
			setReason(DELETION_REASONS[0]);
			setCustomReason("");
			setNotes("");
			setNotifyEmail(true);
			setIsConfirmed(false);
		}
	}, [open, request]);

	// إغلاق اللوحة عند الضغط على مفتاح Escape
	useEffect(() => {
		if (!open) return;
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				onOpenChange(false);
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [open, onOpenChange]);

	// معالج تمرير الماوس بالـ wheel لضمان التمرير السلس دائماً عبر عجلة الماوس
	const handleDrawerWheel = (e: React.WheelEvent<HTMLDivElement>) => {
		const target = e.target as HTMLElement | null;
		if (target?.tagName === "TEXTAREA") {
			const isTextareaScrollable = target.scrollHeight > target.clientHeight;
			if (isTextareaScrollable) return;
		}
		if (scrollContainerRef.current) {
			scrollContainerRef.current.scrollTop += e.deltaY;
		}
	};

	if (!open || !request) return null;

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
		<aside
			data-slot="delete-drawer"
			onWheel={handleDrawerWheel}
			className={cn("fixed z-50 w-full lg:w-[28vw]! lg:min-w-[20rem]! lg:max-w-[28rem]!  lg:right-auto! p-0 gap-0 overflow-hidden font-sans border border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col bg-background h-[calc(100dvh-1rem)]! max-h-[calc(100dvh-1rem)]! inset-y-2! rounded-lg animate-in fade-in-0 duration-200 select-text", isExpanded ? "lg:left-[calc(65vw+0.75rem)]!" : "lg:left-[calc(60vw+0.75rem)]!")}
			dir="rtl"
		>
				{/* 1. رأس اللوحة الموحد */}
				<RegistrationDrawerHeader
					title="حذف طلب الطالب"
					patientName={request.patientName}
					code={request.code}
					onClose={() => onOpenChange(false)}
					titleClassName="text-rose-600 dark:text-rose-400"
				/>

				{/* محتوى اللوحة القابل للتمرير */}
				<div
					ref={scrollContainerRef}
					className="p-3.5 space-y-3 flex-1 min-h-0 overflow-y-auto scrollbar-thin select-text"
					style={{ touchAction: "pan-y" }}
				>
					{/* بطاقة ولي الأمر الموحدة */}
					<RegistrationDrawerGuardianCard
						guardianName={request.guardianName}
						guardianPhone={request.guardianPhone}
						guardianEmail={request.guardianEmail}
						patientName={request.patientName}
					/>

					{/* صندوق النتائج والتحذير المترتبة على الحذف بأيقونات حقيقية احترافية */}
					<div className="rounded-lg border border-rose-200 dark:border-rose-900/60 bg-rose-50/80 dark:bg-rose-950/30 p-3 space-y-2.5">
						<span className="text-xs font-bold text-rose-800 dark:text-rose-300 flex items-center gap-1.5">
							<IconShieldExclamation className="size-4 text-rose-600 shrink-0" />
							<span>تنبيه أمني والنتائج المترتبة على الحذف:</span>
						</span>
						<div className="space-y-2 text-[11px] text-rose-700 dark:text-rose-300/90 leading-relaxed pr-0.5">
							<div className="flex items-start gap-2">
								<IconCalendarOff className="size-3.5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
								<span>إلغاء وحذف موعد المقابلة / التقييم المحجوز فوراً وتفريغ المقعد في التقويم.</span>
							</div>
							<div className="flex items-start gap-2">
								<IconUserMinus className="size-3.5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
								<span>استرجاع الطاقة الاستيعابية الشاغرة للحملة أو الفصل المخصص.</span>
							</div>
							<div className="flex items-start gap-2">
								<IconFileX className="size-3.5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
								<span>مسح كافة المستندات والروابط والملاحظات المسجلة للطلب.</span>
							</div>
							<div className="pt-1.5 border-t border-rose-200/60 dark:border-rose-900/40 text-[11px] font-bold text-rose-900 dark:text-rose-200">
								هذا الإجراء نهائي وغير قابل للتراجع بعد التنفيذ.
							</div>
						</div>
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
										className="text-xs cursor-pointer py-1.5 flex items-center justify-between"
									>
										<span>{r}</span>
										{reason === r && <IconCheck className="size-3.5 text-rose-600 shrink-0" />}
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
							{deleteMutation.isPending ? (
								<IconLoader2 className="size-3.5 shrink-0 animate-spin" />
							) : (
								<IconTrash className="size-3.5 shrink-0" />
							)}
							<span>{deleteMutation.isPending ? "جاري الحذف..." : "تأكيد الحذف النهائي"}</span>
						</Button>
					</div>
				</div>
		</aside>
	);
}
