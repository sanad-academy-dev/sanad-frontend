import { useEffect, useState } from "react";
import { IconAlertTriangle, IconArrowRight, IconCheck, IconInfoCircle } from "@tabler/icons-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateRequestStatus } from "../../hooks/use-digital-registration";
import type { CampaignRequestItem } from "../../types/campaign-request.types";

export type RequestTransitionTarget = "QUEUE" | "SHORTLIST" | "WAITLIST" | "INTERVIEW" | "AWAITING_PAYMENT" | "DUPLICATE" | "ACCEPTED";

const TRANSITIONS: Record<RequestTransitionTarget, { title: string; description: string; confirm: string; tone: string }> = {
	QUEUE: { title: "إعادة الطلب إلى الطابور", description: "سيعود الطلب إلى مرحلة الاستقبال المبدئي لمتابعته من جديد.", confirm: "نقل إلى الطابور", tone: "bg-zinc-700 hover:bg-zinc-800" },
	SHORTLIST: { title: "نقل إلى القائمة المختصرة", description: "سيُنقل الطلب إلى القائمة المختصرة للمراجعة والتدقيق.", confirm: "نقل إلى القائمة المختصرة", tone: "bg-slate-700 hover:bg-slate-800" },
	WAITLIST: { title: "نقل إلى قائمة الانتظار", description: "سيُنقل الطلب إلى قائمة الانتظار لتحديد الأولوية والدور.", confirm: "نقل إلى قائمة الانتظار", tone: "bg-amber-600 hover:bg-amber-700" },
	INTERVIEW: { title: "نقل إلى المقابلة الشخصية", description: "سيُنقل الطلب لمرحلة المقابلة والتقييم. حدّد الموعد من زر الجدولة بعد النقل عند الحاجة.", confirm: "نقل إلى المقابلة", tone: "bg-violet-600 hover:bg-violet-700" },
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
}

export function RequestStatusTransitionDialog({ request, target, open, onOpenChange, campaignId = "", onAccept }: RequestStatusTransitionDialogProps) {
	const [note, setNote] = useState("");
	const updateStatus = useUpdateRequestStatus(campaignId);
	const config = target ? TRANSITIONS[target] : null;

	useEffect(() => {
		if (open) setNote("");
	}, [open, target]);

	const isPending = updateStatus.isPending;
	const submit = () => {
		if (!request || !target || !config) return;
		if (target === "ACCEPTED") {
			onAccept?.(request);
			onOpenChange(false);
			return;
		}
		updateStatus.mutate({ requestId: request.id, status: target, note: note.trim() || undefined }, {
			onSuccess: () => {
				toast.success(`تم ${config.confirm} بنجاح`);
				onOpenChange(false);
			},
			onError: (error: Error) => toast.error(error.message || "تعذر تحديث حالة الطلب"),
		});
	};

	if (!request || !config) return null;
	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent side="left" showOverlay={false} showCloseButton={false} dir="rtl"
				onPointerDownOutside={(event) => {
					const targetElement = event.target as HTMLElement | null;
					if (targetElement?.closest('[data-slot="sheet-content"]') || targetElement?.closest('[role="dialog"]') || targetElement?.closest('[role="menu"]')) event.preventDefault();
				}}
				onFocusOutside={(event) => event.preventDefault()}
				className="w-full lg:w-[28vw]! lg:min-w-[20rem]! lg:max-w-[28rem]! lg:left-[calc(60vw+0.75rem)]! lg:right-auto! p-0 gap-0 overflow-hidden font-sans border border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col bg-background z-50">
				<div className="p-3 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-2 shrink-0">
					<button type="button" onClick={() => onOpenChange(false)} className="size-7 rounded-md flex items-center justify-center text-zinc-400 hover:bg-zinc-100" title="رجوع"><IconArrowRight className="size-4" /></button>
					<div className="min-w-0"><p className="text-xs font-bold truncate">{config.title}</p><p className="text-[10px] text-muted-foreground truncate">{request.patientName} · #{request.code}</p></div>
				</div>
				<div className="p-4 space-y-3 flex-1">
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
					<Button variant="outline" size="sm" onClick={() => onOpenChange(false)} disabled={isPending}>إلغاء</Button>
					<Button size="sm" onClick={submit} disabled={isPending} className={`gap-1 ${config.tone}`}><IconCheck className="size-3.5" />{isPending ? "جارٍ الحفظ..." : config.confirm}</Button>
				</div>
			</SheetContent>
		</Sheet>
	);
}
