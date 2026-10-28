import { IconAlertTriangle, IconTrash, IconUsers } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { useDeleteClassroom } from "@/features/services/classrooms/hooks/use-classroom-mutations";
import type { ClassroomResponse } from "@/server/classrooms/classrooms.type";

interface DeleteClassroomDialogProps {
	classroom: ClassroomResponse | null;
	onClose: () => void;
}

export function DeleteClassroomDialog({
	classroom,
	onClose,
}: DeleteClassroomDialogProps) {
	const { mutate: deleteClassroom, isPending } = useDeleteClassroom();

	const enrolledCount = Number(
		classroom?.enrolledCount || classroom?.students?.length || 0,
	);
	const hasStudents = enrolledCount > 0;

	const handleDelete = () => {
		if (!classroom || hasStudents) return;
		deleteClassroom(classroom.id, {
			onSuccess: () => onClose(),
		});
	};

	const studentLabel =
		enrolledCount === 1
			? "طالب واحد مسجل"
			: enrolledCount === 2
				? "طالبين اثنين مسجلين"
				: enrolledCount >= 3 && enrolledCount <= 10
					? `${enrolledCount} طلاب مسجلين`
					: `${enrolledCount} طالباً مسجلاً`;

	return (
		<Dialog open={Boolean(classroom)} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="max-w-md p-6" dir="rtl">
				<DialogHeader className="text-right space-y-2">
					<div className="flex items-center gap-3">
						<div
							className={`size-10 rounded-xl flex items-center justify-center shrink-0 ${
								hasStudents
									? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
									: "bg-destructive/10 text-destructive border border-destructive/20"
							}`}
						>
							{hasStudents ? (
								<IconAlertTriangle className="size-5" />
							) : (
								<IconTrash className="size-5" />
							)}
						</div>
						<div className="min-w-0">
							<DialogTitle className="text-base font-bold text-foreground">
								{hasStudents ? "لا يمكن حذف هذا الفصل" : "هل أنت متأكد من حذف الفصل؟"}
							</DialogTitle>
							<span className="text-xs text-muted-foreground block truncate font-mono">
								{classroom?.name} {classroom?.code ? `(#${classroom.code})` : ""}
							</span>
						</div>
					</div>

					<DialogDescription asChild>
						<div className="pt-2 text-right">
							{hasStudents ? (
								<div className="space-y-3">
									<div className="p-3.5 rounded-xl border border-amber-500/25 bg-amber-500/10 text-right space-y-2">
										<div className="flex items-center justify-between">
											<div className="flex items-center gap-2">
												<IconUsers className="size-4 text-amber-600 dark:text-amber-400 shrink-0" />
												<span className="text-xs font-bold text-amber-900 dark:text-amber-200">
													مرتبط بالطلاب
												</span>
											</div>
											<span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-800 dark:text-amber-300 font-mono">
												{studentLabel}
											</span>
										</div>
										<p className="text-xs text-amber-900/90 dark:text-amber-200/90 leading-relaxed font-medium">
											لا يمكن حذف هذا الفصل لأنه مربوط بالطلاب حالياً ({studentLabel}).
										</p>
									</div>

									<p className="text-xs text-muted-foreground leading-normal">
										للحفاظ على السجلات الأكاديمية وبيانات الحضور، يرجى نقل الطلاب إلى فصل آخر أو إلغاء تسجيلهم من الفصل أولاً لتتمكن من حذفه.
									</p>
								</div>
							) : (
								<div className="space-y-2">
									<p className="text-xs text-foreground leading-relaxed">
										سيتم حذف فصل <span className="font-bold">"{classroom?.name}"</span> نهائياً من قائمة الفصول.
									</p>
									<p className="text-xs text-muted-foreground">
										هذا الفصل لا يحتوي على أي طلاب مسجلين حالياً. لا يمكن التراجع عن هذا الإجراء بعد التأكيد.
									</p>
								</div>
							)}
						</div>
					</DialogDescription>
				</DialogHeader>

				<DialogFooter className="gap-2 sm:gap-2 mt-4 flex-row-reverse sm:justify-start">
					{hasStudents ? (
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={onClose}
							className="w-full sm:w-auto font-medium text-xs h-9 px-5 cursor-pointer"
						>
							فهمت ذلك
						</Button>
					) : (
						<>
							<Button
								type="button"
								variant="destructive"
								size="sm"
								onClick={handleDelete}
								disabled={isPending}
								className="gap-1.5 text-xs h-9 px-4 cursor-pointer"
							>
								{isPending && <Spinner className="size-3.5" />}
								<span>{isPending ? "جاري الحذف..." : "تأكيد الحذف"}</span>
							</Button>
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={onClose}
								disabled={isPending}
								className="text-xs h-9 px-4 cursor-pointer"
							>
								إلغاء
							</Button>
						</>
					)}
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
