import { useQuery } from "@tanstack/react-query";

import { Badge } from "@/components/ui/badge";
import { formatAmount, formatDisplayDate } from "@/features/accounting/utils/format-amount";
import { api } from "@/lib/api";

/**
 * [MI-P6] §11's patient-profile row: "Policy chip + coverage preview" — insurer, product,
 * validity and cap state, read-only.
 *
 * The cap line is the one that earns its place: `capConsumed` against the product's
 * annual cap is what decides whether the next visit is covered at all, and until now it
 * was only visible inside the «التأمين» hub. Renders nothing when the patient has no
 * policy or the module is off, so it is safe to mount unconditionally.
 */

const STATUS_META: Record<
	string,
	{ label: string; variant: "default" | "secondary" | "outline" }
> = {
	ACTIVE: { label: "سارية", variant: "default" },
	SUSPENDED: { label: "موقوفة", variant: "secondary" },
	EXPIRED: { label: "منتهية", variant: "outline" },
	CANCELLED: { label: "ملغاة", variant: "outline" },
};

export const PatientPolicyCard = ({ patientId }: { patientId: string | null | undefined }) => {
	const { data } = useQuery({
		queryKey: ["accounting", "patient-policies", "by-patient", patientId ?? ""],
		enabled: Boolean(patientId),
		staleTime: 1000 * 30,
		retry: false,
		queryFn: async () => {
			const { data, error } = await api.accounting["patient-policies"].get({
				query: { patientId: patientId as string },
			});
			if (error) return null;
			return data;
		},
	});

	// the §8.3 one-ACTIVE-per-patient rule makes this a single row in practice; a
	// suspended or expired policy still deserves showing, so fall back to the newest
	const policy = data?.find((row) => row.status === "ACTIVE") ?? data?.[0];
	if (!policy) return null;

	const meta = STATUS_META[policy.status] ?? {
		label: policy.status,
		variant: "outline" as const,
	};
	const annualCap = policy.product.annualCap ? policy.product.annualCap.toString() : null;
	const consumed = policy.capConsumed.toString();
	const remaining = annualCap ? Number(annualCap) - Number(consumed) : null;

	return (
		<div className="flex flex-col gap-1.5 rounded-md border bg-muted/30 px-3 py-2">
			<div className="flex flex-wrap items-center gap-2">
				<span className="font-medium text-sm">تأمين «{policy.product.insurer.name}»</span>
				<Badge variant={meta.variant}>{meta.label}</Badge>
			</div>
			<div className="flex flex-col gap-0.5 text-muted-foreground text-xs">
				<span>
					{policy.product.name} — تغطية {Number(policy.product.coveragePercentDefault)}%
					افتراضية
				</span>
				<span
					dir="ltr"
					className="tabular-nums"
				>
					{policy.policyNumber} · {formatDisplayDate(policy.policyStart)} →{" "}
					{formatDisplayDate(policy.policyEnd)}
				</span>
				{annualCap && (
					<span className="tabular-nums">
						السقف السنوي {formatAmount(annualCap)} — مُستهلك {formatAmount(consumed)}
						{remaining !== null && ` · متبقٍ ${formatAmount(remaining.toFixed(2))}`}
					</span>
				)}
			</div>
		</div>
	);
};
