import { IconCircleCheck, IconClock, IconSparkles } from "@tabler/icons-react";
import type { MouseEvent } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AppointmentPayButton } from "@/features/appointments/components/appointment-pay-button";
import { useViewInvoiceStore } from "@/features/appointments/stores/view-invoice.store";
import type { AppointmentCardData } from "@/features/appointments/types/appointment.types";
import { useI18n } from "@/hooks/use-i18n";
import { formatRelative } from "@/lib/date";
import { cn } from "@/lib/utils";

function FooterRow({ children }: { children: React.ReactNode }) {
	return (
		<>
			<Separator />
			<div className="flex items-center justify-between gap-2">{children}</div>
		</>
	);
}

export function AppointmentCardFooter({ data }: { data: AppointmentCardData }) {
	const { lang } = useI18n();
	const openInvoice = useViewInvoiceStore((s) => s.openInvoice);
	const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
	const sinceStatusChange = formatRelative(data.enteredCurrentStatusAt, { timezone, lang });

	// عرض الفاتورة المدفوعة من شارة "مدفوعة" — نوقف انتشار النقرة كي لا تفتح لوحة الزيارة
	const handleViewInvoice = (e: MouseEvent) => {
		e.stopPropagation();
		openInvoice(data.id);
	};

	if (data.column === "queue") return null;

	if (data.column === "check-in") {
		return (
			<>
				<FooterRow>
					<Badge
						variant="outline"
						className="border-emerald-200 bg-emerald-50 text-emerald-600"
					>
						<IconClock />
						في الإنتظار {sinceStatusChange}
					</Badge>
					<Badge className="bg-amber-100 text-amber-700">زيارة مباشرة</Badge>
				</FooterRow>
				{/* شريط ممتد لعرض البطاقة — لم يعد ملتصقًا بحافتها السفلية
				    لأن طبقة «الحالة / السبب» صارت آخر ما فيها */}
				<div
					className={cn(
						"-mx-3 flex items-center justify-between gap-2 bg-violet-50 px-3 py-2 text-xs",
					)}
				>
					<Button
						variant="link"
						size="xs"
						className="h-auto p-0 text-violet-700"
					>
						تعبئة الإستبيان
					</Button>
					<span className="flex items-center gap-1 font-medium text-violet-700">
						بدء الفحص الأولي برفيق AI
						<IconSparkles className="size-3.5" />
					</span>
				</div>
			</>
		);
	}

	if (data.column === "in-service") {
		return (
			<FooterRow>
				<Badge
					variant="outline"
					className="border-amber-200 bg-amber-50 text-amber-600"
				>
					<IconClock />
					بالفحص {sinceStatusChange}
				</Badge>
				<Badge className="bg-amber-100 text-amber-700">زيارة مباشرة</Badge>
			</FooterRow>
		);
	}

	if (data.column === "awaiting-payment") {
		return (
			<FooterRow>
				<AppointmentPayButton appointmentId={data.id} />
				<Badge
					variant="outline"
					className="h-7 border-red-200 bg-red-50 text-red-600"
				>
					<IconClock />
					جاهز للدفع {sinceStatusChange}
				</Badge>
			</FooterRow>
		);
	}

	if (data.column === "done") {
		return (
			<FooterRow>
				<Badge
					asChild
					variant="outline"
					className="border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
				>
					<button
						type="button"
						onClick={handleViewInvoice}
						aria-label="عرض الفاتورة المدفوعة"
					>
						<IconCircleCheck />
						مدفوعة
					</button>
				</Badge>
				<Badge
					variant="outline"
					className="border-muted bg-muted text-muted-foreground"
				>
					تمّت {sinceStatusChange}
				</Badge>
			</FooterRow>
		);
	}

	return null;
}
