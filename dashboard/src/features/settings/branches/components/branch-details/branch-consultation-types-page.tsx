import { Skeleton } from "@/components/ui/skeleton";
import { BranchDetailsShell } from "@/features/settings/branches/components/branch-details/shared";
import { useBranch } from "@/features/settings/branches/hooks/use-branch";
import { ConsultationTypesTable } from "@/features/settings/consultation-types/components/table";

/**
 * أنواع الكشف داخل إعدادات الفرع.
 *
 * ⚠ أنواع الكشف وتسعيرتها وقالبها **مِلك الأكاديمية لا الفرع**: `ConsultationType`
 * يحمل `clinicId` (أو null لأنواع النظام) و`ConsultationTypeConfig` مفتاحه
 * (clinicId, consultationTypeId) — ولا عمود فرع في أيٍّ منهما. فتعديل هنا يسري
 * على كل الفروع، والجملة أدناه تقول ذلك بدل أن يكتشفه المدير بعد أن يغيّر سعرًا
 * ظنّه خاصًّا بفرعه.
 */
export function BranchConsultationTypesPage({ branchId }: { branchId: string }) {
	const { branch, isLoading } = useBranch(branchId);

	if (isLoading || !branch) {
		return (
			<div className="mx-auto flex w-full max-w-195 flex-col gap-4 px-4 pt-10">
				<Skeleton className="h-8 w-48" />
				<Skeleton className="h-96 w-full rounded-[4px]" />
			</div>
		);
	}

	return (
		<BranchDetailsShell
			branchName={branch.name}
			branchId={branchId}
			section="الدورات"
			sectionTo="/management/settings/branch/$branchId/services"
			subSection="أنواع الكشف"
			wide
		>
			<p className="rounded-[4px] border bg-muted/40 p-3 text-xs leading-relaxed">
				أنواع الكشف وأسعارها وقوالبها مشتركة بين فروع الأكاديمية — تعديلها هنا يسري على كل الفروع.
			</p>
			<ConsultationTypesTable />
		</BranchDetailsShell>
	);
}
