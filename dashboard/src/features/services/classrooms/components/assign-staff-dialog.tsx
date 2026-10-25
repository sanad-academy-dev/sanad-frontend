import { useState, useEffect } from "react";
import { IconCheck, IconUser } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useStaff } from "@/features/services/staff/hooks/use-staff";
import { useAssignClassroomStaff } from "@/features/services/classrooms/hooks/use-classroom-mutations";
import type { ClassroomResponse } from "@/server/classrooms/classrooms.type";
import { cn } from "@/lib/utils";

interface AssignStaffDialogProps {
	classroom: ClassroomResponse | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function AssignStaffDialog({
	classroom,
	open,
	onOpenChange,
}: AssignStaffDialogProps) {
	const { staff, isLoading: isStaffLoading } = useStaff();
	const { mutate: assignStaff, isPending } = useAssignClassroomStaff();
	const [selectedStaffIds, setSelectedStaffIds] = useState<string[]>([]);

	useEffect(() => {
		if (classroom) {
			setSelectedStaffIds(classroom.teachers.map((t) => t.id));
		} else {
			setSelectedStaffIds([]);
		}
	}, [classroom]);

	const toggleStaff = (id: string) => {
		setSelectedStaffIds((prev) =>
			prev.includes(id) ? prev.filter((sId) => sId !== id) : [...prev, id],
		);
	};

	const handleSave = () => {
		if (!classroom) return;
		assignStaff(
			{ id: classroom.id, staffIds: selectedStaffIds },
			{
				onSuccess: () => onOpenChange(false),
			},
		);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-md" dir="rtl">
				<DialogHeader>
					<DialogTitle>تعيين المشرفين والمعلمين</DialogTitle>
					<DialogDescription>
						حدد المعلمين والمشرفين المسؤولين عن فصل "{classroom?.name}"
					</DialogDescription>
				</DialogHeader>

				<div className="py-2 max-h-[300px] overflow-y-auto space-y-1.5">
					{isStaffLoading ? (
						<p className="text-center text-xs text-muted-foreground py-4">جاري تحميل قائمة المعلمين...</p>
					) : staff.length === 0 ? (
						<p className="text-center text-xs text-muted-foreground py-4">لا يوجد موظفون متاحون</p>
					) : (
						staff.map((s) => {
							const isSelected = selectedStaffIds.includes(s.id);
							return (
								<button
									key={s.id}
									type="button"
									onClick={() => toggleStaff(s.id)}
									className={cn(
										"flex items-center justify-between w-full p-2.5 rounded-lg border text-right transition-colors",
										isSelected
											? "border-primary/50 bg-primary/5 text-primary"
											: "border-border hover:bg-muted/50 text-foreground",
									)}
								>
									<div className="flex items-center gap-2.5">
										<div className="size-7 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
											{s.name?.[0] || <IconUser className="size-3.5" />}
										</div>
										<div>
											<p className="text-xs font-semibold">{s.name}</p>
											<p className="text-[10px] text-muted-foreground">{s.phone || s.email || "معلم"}</p>
										</div>
									</div>

									<div
										className={cn(
											"size-5 rounded border flex items-center justify-center transition-colors",
											isSelected
												? "bg-primary border-primary text-primary-foreground"
												: "border-muted-foreground/30",
										)}
									>
										{isSelected && <IconCheck className="size-3.5" />}
									</div>
								</button>
							);
						})
					)}
				</div>

				<DialogFooter className="gap-2 sm:gap-0">
					<Button variant="outline" size="sm" onClick={() => onOpenChange(false)} disabled={isPending}>
						إلغاء
					</Button>
					<Button size="sm" onClick={handleSave} disabled={isPending}>
						{isPending ? "جاري الحفظ..." : "حفظ التعيينات"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
