import { IconAlertTriangle, IconArrowLeft, IconCircleCheck } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAccountingReadiness } from "@/features/accounting/governance/hooks/use-accounting-readiness";
import { cn } from "@/lib/utils";

/**
 * [P12C.2] Tab «الجاهزية» — the "is this clinic ready to post?" surface (contract KL-7).
 *
 * It configures nothing. Every row reads real state and links to the screen that already
 * fixes it — the KL-7 finding was that those screens exist but nothing orders them, says
 * which are done, or surfaces what is missing until a posting fails with an Arabic error.
 *
 * RTL: the row is an RTL flow, so DOM order is label → detail → spacer → action, and the
 * "go to the screen" arrow points **left** (`IconArrowLeft`) because that is forward in RTL.
 *
 * The destination lives HERE, not on the server: a typed `<Link to>` breaks at compile time
 * when a route is renamed, where a server-supplied string would have to be cast past the
 * router's typing and would then fail silently in front of an owner who is already stuck.
 */

/** `key` from the readiness service → the screen that fixes it. */
const FIX_LINKS = {
	chart_of_accounts: { to: "/management/accounting/accounts" },
	fiscal_year: { to: "/management/accounting/fiscal-years" },
	posting_defaults: { to: "/management/accounting/settings" },
	sales_tax_template: { to: "/management/accounting/taxes" },
	adapter_legs: {
		to: "/management/accounting/governance",
		search: { tab: "adapters" as const },
	},
} as const;

export const ReadinessTab = () => {
	const { readiness, isLoading } = useAccountingReadiness();

	if (isLoading) {
		return (
			<div className="flex flex-col gap-2 p-4">
				{[0, 1, 2, 3, 4].map((row) => (
					<Skeleton
						key={row}
						className="h-16 w-full"
					/>
				))}
			</div>
		);
	}

	if (!readiness) {
		return <p className="p-4 text-muted-foreground text-sm">تعذّر تحميل حالة الجاهزية.</p>;
	}

	return (
		<div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-4">
			<div
				className={cn(
					"flex items-center gap-3 rounded-lg border p-4",
					readiness.ready
						? "border-emerald-600/30 bg-emerald-600/5"
						: readiness.canPost
							? "border-amber-600/30 bg-amber-600/5"
							: "border-destructive/30 bg-destructive/5",
				)}
			>
				{readiness.ready ? (
					<IconCircleCheck className="size-5 shrink-0 text-emerald-600" />
				) : (
					<IconAlertTriangle
						className={cn(
							"size-5 shrink-0",
							readiness.canPost ? "text-amber-600" : "text-destructive",
						)}
					/>
				)}
				<div className="flex flex-col gap-0.5">
					<p className="font-medium text-sm">
						{readiness.ready
							? "الأكاديمية جاهزة للترحيل"
							: readiness.canPost
								? "الأكاديمية تستطيع الترحيل، مع نواقص"
								: "الأكاديمية لا تستطيع ترحيل أي مستند بعد"}
					</p>
					<p className="text-muted-foreground text-xs">
						{readiness.doneCount} من {readiness.totalCount} خطوة مكتملة. الخطوات المعلَّمة «يمنع
						الترحيل» تُرفض عندها كل مستند حتى تُستكمل.
					</p>
				</div>
			</div>

			{readiness.items.map((item) => {
				const link = FIX_LINKS[item.key as keyof typeof FIX_LINKS];
				return (
					<div
						key={item.key}
						className="flex items-center gap-3 rounded-lg border p-3"
					>
						{item.done ? (
							<IconCircleCheck className="size-5 shrink-0 text-emerald-600" />
						) : (
							<IconAlertTriangle
								className={cn(
									"size-5 shrink-0",
									item.severity === "blocking" ? "text-destructive" : "text-amber-600",
								)}
							/>
						)}

						<div className="flex min-w-0 flex-col gap-0.5">
							<div className="flex items-center gap-2">
								<span className="font-medium text-sm">{item.label}</span>
								{!item.done && (
									<Badge variant={item.severity === "blocking" ? "destructive" : "secondary"}>
										{item.severity === "blocking" ? "يمنع الترحيل" : "يؤخّر الترحيل"}
									</Badge>
								)}
							</div>
							<span className="truncate text-muted-foreground text-xs">{item.detail}</span>
						</div>

						<div className="flex-1" />

						{!item.done && link && (
							<Button
								asChild
								size="xs"
								variant="outline"
							>
								<Link {...link}>
									{item.fixLabel}
									<IconArrowLeft className="size-3.5" />
								</Link>
							</Button>
						)}
					</div>
				);
			})}
		</div>
	);
};
