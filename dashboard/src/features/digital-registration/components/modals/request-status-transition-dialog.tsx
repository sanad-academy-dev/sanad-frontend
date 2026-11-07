import { cn } from "@/lib/utils";
import { useEffect, useState, useRef } from "react";
import { IconAlertTriangle, IconArrowRight, IconCheck, IconInfoCircle } from "@tabler/icons-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateRequestStatus } from "../../hooks/use-digital-registration";
import type { CampaignRequestItem } from "../../types/campaign-request.types";
import {
	RegistrationDrawerHeader,
	RegistrationDrawerGuardianCard,
} from "./registration-drawer-header";

export type RequestTransitionTarget = "QUEUE" | "SHORTLIST" | "WAITLIST" | "AWAITING_PAYMENT" | "DUPLICATE" | "ACCEPTED";

const TRANSITIONS: Record<RequestTransitionTarget, { title: string; description: string; confirm: string; tone: string }> = {
	QUEUE: { title: "إعادة الطلب إلى الطابور", description: "سيعود الطلب إلى مرحلة الاستقبال المبدئي لمتابعته من جديد.", confirm: "نقل إلى الطابور", tone: "bg-zinc-700 hover:bg-zinc-800" },
	SHORTLIST: { title: "نقل إلى القائمة المختصرة", description: "سيُنقل الطلب إلى القائمة المختصرة للمراجعة والتدقيق.", confirm: "نقل إلى القائمة المختصرة", tone: "bg-slate-700 hover:bg-slate-800" },
	WAITLIST: { title: "نقل إلى قائمة الانتظار", description: "سيُنقل الطلب إلى قائمة الانتظار لتحديد الأولوية والدور.", confirm: "نقل إلى قائمة الانتظار", tone: "bg-amber-600 hover:bg-amber-700" },
	AWAITING_PAYMENT: { title: "نقل إلى انتظار الدفع", description: "سيُنقل الطلب إلى مرحلة انتظار سداد الرسوم وتأكيد حجز المقعد.", confirm: "نقل إلى انتظار الدفع", tone: "bg-indigo-600 hover:bg-indigo-700" },
	DUPLICATE: { title: "تعليم كطلب مكرر", description: "سيُعلّم الطلب كمكرر حتى لا يُتابَع كطلب مستقل قبل مراجعة السجل المرتبط.", confirm: "تعليم كمكرر", tone: "bg-amber-600 hover:bg-amber-700" },
	ACCEPTED: { title: "قبول واعتماد الطالب", description: "هذا إجراء نهائي ينشئ الاعتماد الدراسي وفق مسار القبول المعتمد في النظام.", confirm: "تأكيد القبول والاعتماد", tone: "bg-emerald-600 hover:bg-emerald-700" },
};

interface RequestStatusTransitionDialogProps {
	request: CampaignRequestItem | null;
	target: RequestTransitionTarget | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	campaignId?: string;
	onAccept?: (request: CampaignRequestItem) => void;
	onSuccess?: () => void;
	isExpanded?: boolean;
}

export function RequestStatusTransitionDialog({
	request,
	target,
	open,
	onOpenChange,
	campaignId = "",
	onAccept,
	onSuccess,
	isExpanded = false,
}: RequestStatusTransitionDialogProps) {
	const [note, setNote] = useState("");
	const scrollContainerRef = useRef<HTMLDivElement>(null);
	const updateStatus = useUpdateRequestStatus(campaignId);
	const config = target ? TRANSITIONS[target] : null;

	useEffect(() => {
		if (open) setNote("");
	}, [open, target]);

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
		const targetEl = e.target as HTMLElement | null;
		if (targetEl?.tagName === "TEXTAREA") {
			const isTextareaScrollable = targetEl.scrollHeight > targetEl.clientHeight;
			if (isTextareaScrollable) return;
		}
		if (scrollContainerRef.current) {
			scrollContainerRef.current.scrollTop += e.deltaY;
		}
	};

	const isPending = updateStatus.isPending;
	const submit = () => {
		if (!request || !target || !config) return;
		if (target === "ACCEPTED") {
			onAccept?.(request);
			onOpenChange(false);
			onSuccess?.();
			return;
		}
		updateStatus.mutate({ requestId: request.id, status: target, note: note.trim() || undefined }, {
			onSuccess: () => {
				toast.success(`تم ${config.confirm} بنجاح`);
				onOpenChange(false);
				onSuccess?.();
			},
			onError: (error: Error) => toast.error(error.message || "تعذر تحديث حالة الطلب"),
		});
	};

	if (!open || !request || !config) return null;
	return (
		<aside
			data-slot="status-transition-drawer"
			onWheel={handleDrawerWheel}
			className={cn("fixed z-50 w-full lg:w-[28vw]! lg:min-w-[20rem]! lg:max-w-[28rem]!  lg:right-auto! p-0 gap-0 overflow-hidden font-sans border border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col bg-background h-[calc(100dvh-1rem)]! max-h-[calc(100dvh-1rem)]! inset-y-2! rounded-lg animate-in fade-in-0 duration-200 select-text", isExpanded ? "lg:left-[calc(65vw+0.75rem)]!" : "lg:left-[calc(60vw+0.75rem)]!")}
			dir="rtl"
		>
			<RegistrationDrawerHeader
				title={config.title}
				patientName={request.patientName}
				code={request.code}
				onClose={() => onOpenChange(false)}
			/>
			<div
				ref={scrollContainerRef}
				className="p-4 space-y-3.5 flex-1 min-h-0 overflow-y-auto scrollbar-thin select-text"
				style={{ touchAction: "pan-y" }}
			>
				<RegistrationDrawerGuardianCard
					guardianName={request.guardianName}
					guardianPhone={request.guardianPhone}
					guardianEmail={request.guardianEmail}
					patientName={request.patientName}
				/>
				<div className="rounded-lg border border-muted bg-muted/40 p-3 flex gap-2 text-xs leading-5"><IconInfoCircle className="size-4 shrink-0 text-primary mt-0.5" /><p>{config.description}</p></div>
				{target === "QUEUE" && Boolean(request.assessmentAppointment && request.assessmentAppointment.status !== "CANCELLED") && (
					<div className="rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50/70 dark:bg-amber-950/30 p-2.5 flex items-start gap-2 text-xs text-amber-800 dark:text-amber-300">
						<IconAlertTriangle className="size-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
						<div className="space-y-0.5 leading-snug">
							<span className="font-bold">تنبيه الموعد:</span>
							<span> سيتم إلغاء موعد المقابلة المرتبط وتفريغ وقت الأخصائي والقاعة تلقائياً فور النقل للطابور.</span>
						</div>
					</div>
				)}
				<div className="space-y-1.5"><label className="text-[11px] font-bold">ملاحظة داخلية (اختيارية)</label><Textarea value={note} onChange={(event) => setNote(event.target.value)} className="min-h-24 text-xs resize-none" placeholder="سبب النقل أو أي معلومة لفريق العمل..." /></div>
			</div>
			<div className="p-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-end gap-2 shrink-0">
				<Button variant="outline" size="sm" onClick={() => onOpenChange(false)} disabled={isPending} className="cursor-pointer">إلغاء</Button>
				<Button size="sm" onClick={submit} disabled={isPending} className={`gap-1 cursor-pointer ${config.tone}`}><IconCheck className="size-3.5" />{isPending ? "جارٍ الحفظ..." : config.confirm}</Button>
			</div>
		</aside>
	);
}
