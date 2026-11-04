"use client";

import { IconPlus, IconTrash, IconX } from "@tabler/icons-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
	useAddClassroomClassification,
	useDeleteClassroomClassification,
} from "@/features/services/classrooms/hooks/use-classroom-mutations";
import { useClassroomClassifications } from "@/features/services/classrooms/hooks/use-classrooms";

interface StagesClassificationDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function StagesClassificationDialog({
	open,
	onOpenChange,
}: StagesClassificationDialogProps) {
	const { classifications, isLoading } = useClassroomClassifications();
	const addMutation = useAddClassroomClassification();
	const deleteMutation = useDeleteClassroomClassification();
	const [newName, setNewName] = useState("");

	const handleAdd = async (e: React.FormEvent) => {
		e.preventDefault();
		const trimmed = newName.trim();
		if (!trimmed) return;
		await addMutation.mutateAsync(trimmed);
		setNewName("");
	};

	const handleDelete = async (name: string) => {
		await deleteMutation.mutateAsync(name);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>المراحل الدراسية والمستويات التعليمية</DialogTitle>
					<DialogDescription>
						إدارة تصنيفات المراحل الدراسية والمستويات التعليمية المعتمدة للفصول.
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleAdd} className="flex items-center gap-2 pt-2">
					<Input
						value={newName}
						onChange={(e) => setNewName(e.target.value)}
						placeholder="اسم المرحلة أو التصنيف الجديد..."
						className="flex-1"
					/>
					<Button
						type="submit"
						disabled={!newName.trim() || addMutation.isPending}
						size="sm"
						className="gap-1.5"
					>
						<IconPlus className="size-4" />
						<span>إضافة</span>
					</Button>
				</form>

				<div className="mt-4 max-h-[340px] overflow-y-auto rounded-lg border border-border/70 divide-y divide-border/60">
					{isLoading ? (
						<div className="p-6 text-center text-sm text-muted-foreground">
							جاري التحميل...
						</div>
					) : classifications.length === 0 ? (
						<div className="p-6 text-center text-sm text-muted-foreground">
							لا توجد تصنيفات حالياً. يمكنك إضافة تصنيف جديد أعلاه.
						</div>
					) : (
						classifications.map((item) => (
							<div
								key={item}
								className="flex items-center justify-between px-4 py-3 hover:bg-muted/30 transition-colors"
							>
								<span className="text-sm font-medium text-foreground">{item}</span>
								<Button
									type="button"
									variant="ghost"
									size="icon"
									className="size-8 text-muted-foreground hover:text-destructive"
									disabled={deleteMutation.isPending}
									onClick={() => handleDelete(item)}
									title="حذف التصنيف"
								>
									<IconTrash className="size-4" />
								</Button>
							</div>
						))
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}

