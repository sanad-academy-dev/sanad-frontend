import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
	DUE_STATUS_LABELS,
	type VaccinationDueStatus,
} from "@sanad/contracts/runtime/server/vaccinations/vaccinations.type";

/**
 * شارة حالة التطعيم. «لم يبدأ» و«متأخّر» متمايزتان بصريًا رغم اشتراكهما في
 * الخطورة: الإجراء مختلف — الأولى تعني بدء سلسلة، والثانية تعني تدارُك تأخّر.
 */
const VARIANTS: Record<VaccinationDueStatus, string> = {
	OVERDUE: "bg-destructive/10 text-destructive",
	NOT_STARTED: "bg-destructive/10 text-destructive",
	DUE: "bg-[#F59E0B]/10 text-[#B45309]",
	DUE_SOON: "bg-[#F59E0B]/10 text-[#B45309]",
	UP_TO_DATE: "bg-green-500/10 text-green-700",
	// ليست حالة خطر بل نقص بيانات — لون محايد يمنع قراءتها كإنذار كاذب
	UNKNOWN_AGE: "bg-muted text-muted-foreground",
};

export function VaccinationStatusBadge({
	status,
	className,
}: {
	status: VaccinationDueStatus | null;
	className?: string;
}) {
	if (!status) {
		return (
			<Badge
				variant="secondary"
				className={className}
			>
				لا بروتوكول
			</Badge>
		);
	}

	return (
		<Badge className={cn("border-transparent", VARIANTS[status], className)}>
			{DUE_STATUS_LABELS[status]}
		</Badge>
	);
}
