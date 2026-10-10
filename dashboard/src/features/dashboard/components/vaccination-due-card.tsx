import { IconArrowLeft } from "@tabler/icons-react";
import { useNavigate } from "@tanstack/react-router";

import { CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BaseDashboardCard } from "@/features/dashboard/components/base-dashboard-card";
import type { DashboardCardProps } from "@/features/dashboard/types/dashboard-card.types";
import { VaccinationStatusBadge } from "@/features/services/vaccinations/components/vaccination-status-badge";
import { useVaccinationDue } from "@/features/services/vaccinations/hooks/use-vaccinations";

const VACCINATIONS_ROUTE = "/services/vaccinations";
// شاشة التطعيمات تحمل حالتها في الرابط، فالانتقال إليها يمرّر الحالة الافتتاحية صراحةً
const VACCINATIONS_SEARCH = { tab: "due", q: "", species: "ALL" } as const;

const dateFmt = new Intl.DateTimeFormat("ar", { dateStyle: "medium" });

/**
 * بطاقة الجرعات المستحقة — أول ما يجب أن يراه فريق الأكاديمية صباحًا.
 *
 * الترتيب: الأشدّ تأخّرًا أولًا كما يصل من الخادم. البطاقة تعرض العشرة الأوائل فقط
 * وتقول العدد الكامل صراحةً، فالاقتصاص المصمت يُقرأ «لا شيء غيرهم».
 */
export function VaccinationDueCard({ expanded, onToggleExpanded }: DashboardCardProps) {
	const navigate = useNavigate();
	const { rows, isLoading, isError } = useVaccinationDue();

	const goToVaccinations = () =>
		navigate({ to: VACCINATIONS_ROUTE, search: VACCINATIONS_SEARCH });
	const shown = rows.slice(0, 10);

	return (
		<BaseDashboardCard
			cardId="card-13"
			expanded={expanded}
			onToggleExpanded={onToggleExpanded}
			headerAction={
				<button
					type="button"
					onClick={goToVaccinations}
					className="flex items-center gap-1 rounded-sm p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
					aria-label="فتح شاشة التطعيمات"
				>
					<IconArrowLeft
						className="size-4"
						stroke={1.5}
					/>
				</button>
			}
		>
			<CardContent className="flex-1 overflow-y-auto px-3 pt-0">
				{isLoading ? (
					<div className="flex flex-col gap-1.5">
						{Array.from({ length: 5 }).map((_, i) => (
							<Skeleton
								key={i}
								className="h-10 w-full rounded-sm"
							/>
						))}
					</div>
				) : isError ? (
					// لا تُعرض «لا جرعات» عند الفشل — البطاقة تُقرأ صباحًا كطمأنينة
					<p className="py-6 text-center text-xs text-destructive">
						تعذّر جلب الجرعات المستحقة.
					</p>
				) : rows.length === 0 ? (
					<p className="py-6 text-center text-xs text-muted-foreground">
						لا جرعات مستحقة حاليًا.
					</p>
				) : (
					<div className="flex flex-col gap-1.5">
						{shown.map((row) => (
							<button
								key={row.patientId}
								type="button"
								onClick={goToVaccinations}
								className="flex items-center justify-between gap-3 rounded-sm border px-2 py-2 text-start transition-colors hover:bg-accent"
							>
								<div className="flex min-w-0 flex-col">
									<span className="truncate text-xs font-medium">{row.patientName}</span>
									<span className="truncate text-[11px] text-muted-foreground">
										{row.dueAntigens.join("، ")}
									</span>
								</div>
								<div className="flex shrink-0 items-center gap-2">
									<span className="text-[11px] text-muted-foreground tabular-nums">
										{row.dueAt ? dateFmt.format(new Date(row.dueAt)) : "—"}
									</span>
									<VaccinationStatusBadge status={row.status} />
								</div>
							</button>
						))}

						{rows.length > shown.length && (
							<button
								type="button"
								onClick={goToVaccinations}
								className="py-1 text-center text-[11px] text-muted-foreground hover:text-foreground"
							>
								و{rows.length - shown.length} طفلًا آخر — افتح الشاشة الكاملة
							</button>
						)}
					</div>
				)}
			</CardContent>
		</BaseDashboardCard>
	);
}
