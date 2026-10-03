import { Skeleton } from "@/components/ui/skeleton";
import { BranchDetailsShell } from "@/features/settings/branches/components/branch-details/shared";
import { useBranch } from "@/features/settings/branches/hooks/use-branch";
import { ExamTemplatesPanel } from "@/features/settings/exam-templates/components/exam-templates-page";

/**
 * قوالب الفحص داخل إعدادات الفرع — بجوار قوالب تقارير الأشعة.
 *
 * ⚠ القوالب **مِلك الأكاديمية لا الفرع**: `ExamTemplate.clinicId` ولا عمود فرع فيه.
 * فتعديل قالب هنا يغيّره لكل الفروع. وهذه هي حال `RadiologyReportTemplate` نفسها
 * التي تسكن إعدادات الفرع منذ [RD]، غير أنّها لا تقول ذلك للمستخدم — والصفحة هنا
 * تقوله صراحةً بدل أن تترك المدير يكتشفه بتغييرٍ لم يقصده.
 */
export function BranchExamTemplatesPage({ branchId }: { branchId: string }) {
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
			section="قوالب الفحص"
		>
			<ExamTemplatesPanel scopeNote="القوالب مشتركة بين فروع الأكاديمية — تعديلها هنا يسري على كل الفروع." />
		</BranchDetailsShell>
	);
}
