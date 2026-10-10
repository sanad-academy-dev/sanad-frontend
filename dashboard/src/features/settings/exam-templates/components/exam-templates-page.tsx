import { IconCopy, IconPencil, IconPlus } from "@tabler/icons-react";
import { useState } from "react";

import { Container, ContainerRow } from "@/components/common/container";
import { Spinner } from "@/components/common/spinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	draftFromTemplate,
	ExamTemplateEditorDialog,
	emptyDraft,
	type TemplateDraft,
} from "@/features/settings/exam-templates/components/exam-template-editor-dialog";
import { useExamTemplates } from "@/features/settings/exam-templates/hooks/use-exam-templates";
import type { ExamTemplateResponse } from "@/server/clinical-notes/clinical-notes.type";

/**
 * [S3] قوالب الفحص السريري.
 *
 * قوالب النظام وقوالب الأكاديمية في قائمة واحدة، لأن المدرّب يبحث عن قالب لشكوى لا عن
 * وليّ أمره. الفرق الوحيد الظاهر أن قالب النظام يُنسخ ولا يُعدَّل.
 */
/**
 * محتوى الشاشة بلا غلاف — تستعمله صفحة الفرع داخل `BranchDetailsShell`.
 *
 * `scopeNote` تقول للمستخدم إنّ القوالب مشتركة بين الفروع. القوالب مِلك الأكاديمية
 * (`ExamTemplate.clinicId`، ولا عمود فرع)، وعرضُها داخل إعدادات فرع بلا هذه
 * الجملة يوهم بأن التعديل يخصّ الفرع وحده.
 */
export const ExamTemplatesPanel = ({ scopeNote }: { scopeNote?: string }) => {
	const { templates, isLoading } = useExamTemplates();
	const [draft, setDraft] = useState<TemplateDraft | null>(null);

	if (isLoading) return <Spinner />;

	const blockCount = (template: ExamTemplateResponse) =>
		Array.isArray(template.blocks) ? template.blocks.length : 0;

	return (
		<>
			{scopeNote && (
				<p className="rounded-[4px] border bg-muted/40 p-3 text-xs leading-relaxed">
					{scopeNote}
				</p>
			)}
			<Container
				title="قوالب الفحص السريري"
				description="القالب يُولّد نموذج الزيارة ونصّ الملاحظة معًا. لكل شكوى قالبها."
				action={
					<Button
						size="sm"
						onClick={() => setDraft(emptyDraft())}
					>
						<IconPlus className="size-3.5" />
						قالب جديد
					</Button>
				}
			>
				{templates.length === 0 ? (
					<p className="text-muted-foreground text-xs">لا قوالب بعد.</p>
				) : (
					templates.map((template) => {
						const isSystem = template.clinicId === null;
						return (
							<ContainerRow
								key={template.id}
								title={template.titleAr}
								badge={
									<>
										<Badge
											variant={isSystem ? "outline" : "secondary"}
											className="text-xs"
										>
											{isSystem ? "قالب نظام" : "الأكاديمية"}
										</Badge>
										{!template.active && (
											<Badge
												variant="outline"
												className="text-xs"
											>
												معطّل
											</Badge>
										)}
										{template.isDefault && (
											<Badge
												variant="outline"
												className="text-xs"
											>
												افتراضي
											</Badge>
										)}
									</>
								}
								foregroundTitle={`إصدار ${template.version}`}
								subtitle={[
									template.presentingComplaint
										? `الشكوى: ${template.presentingComplaint}`
										: "كل الشكاوى",
									`${blockCount(template)} كتلة`,
									template._count.notes > 0
										? `${template._count.notes} ملاحظة`
										: "بلا ملاحظات",
								].join(" · ")}
								action={
									<Button
										variant="outline"
										size="sm"
										onClick={() => setDraft(draftFromTemplate(template))}
									>
										{isSystem ? (
											<>
												<IconCopy className="size-3.5" />
												نسخ
											</>
										) : (
											<>
												<IconPencil className="size-3.5" />
												تعديل
											</>
										)}
									</Button>
								}
							/>
						);
					})
				)}
			</Container>

			<ExamTemplateEditorDialog
				draft={draft}
				onClose={() => setDraft(null)}
			/>
		</>
	);
};
