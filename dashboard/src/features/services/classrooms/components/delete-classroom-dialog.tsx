import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
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

	const handleDelete = () => {
		if (!classroom) return;
		deleteClassroom(classroom.id, {
			onSuccess: () => onClose(),
		});
	};

	return (
		<Dialog open={Boolean(classroom)} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="max-w-md" dir="rtl">
				<DialogHeader>
					<DialogTitle>هل أنت متأكد من حذف هذا الفصل؟</DialogTitle>
					<DialogDescription>
						سيتم حذف فصل "{classroom?.name}" ({classroom?.code ? `#${classroom.code}` : ""}) وإلغاء تسجيل الطلاب المرتبطين به.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter className="gap-2 sm:gap-0">
					<Button variant="outline" size="sm" onClick={onClose} disabled={isPending}>
						إلغاء
					</Button>
					<Button
						variant="destructive"
						size="sm"
						onClick={handleDelete}
						disabled={isPending}
					>
						{isPending ? "جاري الحذف..." : "تأكيد الحذف"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
