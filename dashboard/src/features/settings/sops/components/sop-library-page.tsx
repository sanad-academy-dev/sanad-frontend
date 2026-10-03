import { IconChecklist, IconPencil } from "@tabler/icons-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	BranchDetailsShell,
	SectionHeading,
} from "@/features/settings/branches/components/branch-details/shared";
import { useBranch } from "@/features/settings/branches/hooks/use-branch";
import { SopEditorDialog } from "@/features/settings/sops/components/sop-editor-dialog";
import { useServiceSop, useSopLibrary } from "@/features/settings/sops/hooks/use-sops";
import { SopDomain } from "@/generated/prisma/enums";
import { SOP_DOMAIN_LABELS } from "@sanad/contracts/runtime/server/sops/sops.type";

// مكتبة بروتوكولات العمل القياسية — كل دورات الوحدة في جدول واحد مع حالة
// بروتوكولها. التحرير من هنا أو من لوحة إعدادات العنصر، وكلاهما ينشئ نسخة
// أكاديمية جديدة بنفس العقد.

const DOMAIN_TABS = [SopDomain.LAB, SopDomain.RADIOLOGY, SopDomain.OPERATION] as const;

/** صف قيد التحرير — القالب الفعّال يُجلب عند الفتح لا مع الجدول كله */
function SopEditorLauncher({
	domain,
	serviceId,
	serviceName,
	onClose,
}: {
	domain: SopDomain;
	serviceId: string;
	serviceName: string;
	onClose: () => void;
}) {
	const { resolved } = useServiceSop(serviceId);

	return (
		<SopEditorDialog
			domain={domain}
			serviceId={serviceId}
			serviceName={serviceName}
			resolved={resolved}
			open
			onOpenChange={(next) => {
				if (!next) onClose();
			}}
		/>
	);
}

export function SopLibraryPage({ branchId }: { branchId: string }) {
	const { branch, isLoading: isBranchLoading } = useBranch(branchId);
	const [domain, setDomain] = useState<SopDomain>(SopDomain.LAB);
	const [editing, setEditing] = useState<{ serviceId: string; serviceName: string } | null>(
		null,
	);
	const { rows, isLoading } = useSopLibrary(domain);

	if (isBranchLoading || !branch) {
		return (
			<div className="flex w-full flex-col gap-4 px-4 pt-10">
				<Skeleton className="h-8 w-48" />
				<Skeleton className="h-96 w-full rounded-[4px]" />
			</div>
		);
	}

	const withSop = rows.filter((row) => row.origin !== "NONE").length;

	return (
		<BranchDetailsShell
			branchName={branch.name}
			branchId={branch.id}
			section="بروتوكولات العمل القياسية"
			wide
		>
			<SectionHeading
				title="بروتوكولات العمل القياسية (SOP)"
				description="خطوات التنفيذ التي تظهر لفريق العمل داخل كل طلب. القوائم على مستوى المنشأة وتشترك فيها كل الفروع، والعنصر بلا بروتوكول خاص يرث بروتوكول مجموعته."
			/>

			<Tabs
				value={domain}
				onValueChange={(v) => setDomain(v as SopDomain)}
			>
				<TabsList>
					{DOMAIN_TABS.map((option) => (
						<TabsTrigger
							key={option}
							value={option}
						>
							{SOP_DOMAIN_LABELS[option]}
						</TabsTrigger>
					))}
				</TabsList>
			</Tabs>

			<div className="flex items-center justify-between gap-2">
				<span className="text-xs text-muted-foreground">
					{isLoading ? "جارٍ التحميل..." : `${withSop} من ${rows.length} دورة لها بروتوكول`}
				</span>
			</div>

			{isLoading ? (
				<Skeleton className="h-96 w-full rounded-[4px]" />
			) : (
				<div className="overflow-x-auto rounded-md border">
					<table className="w-full min-w-160 text-xs">
						<thead className="border-b bg-muted/40">
							<tr className="text-start">
								<th className="px-3 py-2 text-start font-semibold">الدورة</th>
								<th className="px-3 py-2 text-start font-semibold">المجموعة</th>
								<th className="px-3 py-2 text-start font-semibold">البروتوكول</th>
								<th className="px-3 py-2 text-start font-semibold">المصدر</th>
								<th className="px-3 py-2 text-start font-semibold">الخطوات</th>
								<th className="px-3 py-2 text-start font-semibold" />
							</tr>
						</thead>
						<tbody>
							{rows.map((row) => (
								<tr
									key={row.serviceId}
									className="border-b last:border-b-0"
								>
									<td className="px-3 py-2 font-medium">{row.serviceName}</td>
									<td className="px-3 py-2 text-muted-foreground">{row.categoryName}</td>
									<td className="px-3 py-2">
										{row.title ? (
											<span className="flex items-center gap-1.5">
												<IconChecklist className="size-3.5 shrink-0 text-muted-foreground" />
												{row.title}
												<span className="rounded-sm bg-muted px-1.5 py-0.5 text-[10px] tabular-nums text-muted-foreground">
													ن{row.version}
												</span>
											</span>
										) : (
											<span className="text-muted-foreground">—</span>
										)}
									</td>
									<td className="px-3 py-2">
										{row.origin === "NONE" ? (
											<span className="text-muted-foreground">بلا بروتوكول</span>
										) : row.isClinicOverride ? (
											<span className="rounded-sm bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
												مخصّص للأكاديمية
											</span>
										) : row.origin === "INHERITED" ? (
											<span className="rounded-sm bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-medium text-amber-700 dark:text-amber-500">
												موروث من «{row.inheritedFromName}»
											</span>
										) : (
											<span className="text-muted-foreground">قالب النظام</span>
										)}
									</td>
									<td className="px-3 py-2 tabular-nums text-muted-foreground">
										{row.stepCount > 0 ? (
											<span className="flex items-center gap-1.5">
												{row.stepCount}
												{row.criticalCount > 0 && (
													<span className="text-destructive">({row.criticalCount} حرجة)</span>
												)}
											</span>
										) : (
											"—"
										)}
									</td>
									<td className="px-3 py-2 text-end">
										<Button
											type="button"
											size="sm"
											variant="outline"
											className="h-7 text-[11px]"
											onClick={() =>
												setEditing({
													serviceId: row.serviceId,
													serviceName: row.serviceName,
												})
											}
										>
											<IconPencil className="size-3.5" />
											{row.origin === "NONE" ? "إنشاء" : "تحرير"}
										</Button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}

			{editing && (
				<SopEditorLauncher
					key={editing.serviceId}
					domain={domain}
					serviceId={editing.serviceId}
					serviceName={editing.serviceName}
					onClose={() => setEditing(null)}
				/>
			)}
		</BranchDetailsShell>
	);
}
