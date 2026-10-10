import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BaseDashboardCard } from "@/features/dashboard/components/base-dashboard-card";
import { useStaffWorkload } from "@/features/dashboard/hooks/use-staff-workload";
import type { DashboardCardProps } from "@/features/dashboard/types/dashboard-card.types";
import { useI18n } from "@/hooks/use-i18n";
import { cn } from "@/lib/utils";
import type { DashboardStaffWorkloadDatum } from "@/server/dashboard/dashboard.type";

function initials(name: string) {
	return name
		.trim()
		.split(/\s+/)
		.slice(0, 2)
		.map((part) => part[0]?.toUpperCase() ?? "")
		.join("");
}

function WorkloadRow({ member }: { member: DashboardStaffWorkloadDatum }) {
	const { t } = useI18n();
	const overloaded = member.booked > member.capacity;
	const ratio = member.capacity === 0 ? 0 : Math.min(member.booked / member.capacity, 1);

	return (
		<div className="flex items-center gap-2.5">
			<Avatar className="size-9 shrink-0">
				<AvatarImage
					src={member.avatar ?? undefined}
					alt={member.name}
				/>
				<AvatarFallback className="text-[11px]">{initials(member.name)}</AvatarFallback>
			</Avatar>

			<div className="flex flex-col gap-1.5 flex-1 min-w-0">
				<div className="flex items-center justify-between gap-2">
					<div className="flex flex-col gap-0.5 min-w-0 text-start">
						<p className="text-xs font-medium leading-none truncate">{member.name}</p>
						<p className="text-[11px] text-muted-foreground leading-none truncate">
							{member.roleName}
						</p>
					</div>

					<span
						className={cn(
							"text-xs font-medium tabular-nums shrink-0",
							overloaded && "text-destructive",
						)}
					>
						{overloaded && (
							<span className="me-1">{t("dashboard.cards.staffWorkload.overload")} ·</span>
						)}
						{member.booked}/{member.capacity}
					</span>
				</div>

				<div className="h-1.5 overflow-hidden rounded-full bg-muted/70">
					<div
						className={cn(
							"h-full rounded-full transition-[width]",
							overloaded ? "bg-destructive" : "bg-foreground",
						)}
						style={{ width: `${overloaded ? 100 : ratio * 100}%` }}
					/>
				</div>
			</div>
		</div>
	);
}

export function StaffWorkloadCard({ expanded, onToggleExpanded }: DashboardCardProps) {
	const { t } = useI18n();
	const { workload, isLoading, isError } = useStaffWorkload();

	return (
		<BaseDashboardCard
			cardId="card-11"
			expanded={expanded}
			onToggleExpanded={onToggleExpanded}
			className="justify-start"
		>
			<CardContent className="max-h-70 pt-0 flex-1 overflow-y-auto px-3">
				{isLoading ? (
					<div className="flex flex-col gap-3">
						{Array.from({ length: 4 }).map((_, i) => (
							<div
								key={i}
								className="flex items-center gap-2.5"
							>
								<Skeleton className="size-9 rounded-full shrink-0" />
								<div className="flex flex-col gap-1.5 flex-1">
									<Skeleton className="h-3 w-28" />
									<Skeleton className="h-1.5 w-full rounded-full" />
								</div>
							</div>
						))}
					</div>
				) : isError ? (
					<div className="border rounded-md p-2.5 flex flex-col gap-1">
						<span className="font-bold text-xs">
							{t("dashboard.cards.staffWorkload.errorTitle")}
						</span>
						<span className="text-xs text-muted-foreground">
							{t("common.states.checkConnection")}
						</span>
					</div>
				) : workload.length === 0 ? (
					<div className="border rounded-md p-2.5 flex flex-col gap-1">
						<span className="font-bold text-xs">
							{t("dashboard.cards.staffWorkload.emptyTitle")}
						</span>
						<span className="text-xs text-muted-foreground">
							{t("dashboard.cards.staffWorkload.emptyDescription")}
						</span>
					</div>
				) : (
					<div
						className={cn("grid grid-cols-1 gap-x-6 gap-y-3.5", expanded && "md:grid-cols-2")}
					>
						{workload.map((member) => (
							<WorkloadRow
								key={member.staffId}
								member={member}
							/>
						))}
					</div>
				)}
			</CardContent>
		</BaseDashboardCard>
	);
}
