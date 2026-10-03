import { Badge } from "@/components/ui/badge";
import type { AccountingJobStatus, DocStatus } from "@/generated/prisma/enums";

/**
 * [P11.6] The two status badges shared by the governance tabs — one docstatus rendering
 * (same labels/variants as the sibling voucher screens, e.g. revaluations-page) and one
 * background-job rendering for the FR-12.3 closing monitor (AR-7 `gleProcessingStatus`).
 */

type BadgeVariant = "default" | "primary" | "secondary" | "destructive" | "outline";

const DOCSTATUS: Record<DocStatus, { label: string; variant: BadgeVariant }> = {
	DRAFT: { label: "مسودة", variant: "outline" },
	SUBMITTED: { label: "معتمد", variant: "default" },
	CANCELLED: { label: "ملغى", variant: "secondary" },
};

export const DocstatusBadge = ({ docstatus }: { docstatus: DocStatus }) => (
	<Badge variant={DOCSTATUS[docstatus]?.variant ?? "secondary"}>
		{DOCSTATUS[docstatus]?.label ?? docstatus}
	</Badge>
);

const JOB_STATUS: Record<AccountingJobStatus, { label: string; variant: BadgeVariant }> = {
	QUEUED: { label: "في الانتظار", variant: "secondary" },
	IN_PROGRESS: { label: "قيد التنفيذ", variant: "primary" },
	COMPLETED: { label: "مكتمل", variant: "outline" },
	FAILED: { label: "فشل", variant: "destructive" },
};

export const JobStatusBadge = ({ status }: { status: AccountingJobStatus }) => (
	<Badge variant={JOB_STATUS[status]?.variant ?? "secondary"}>
		{JOB_STATUS[status]?.label ?? status}
	</Badge>
);
