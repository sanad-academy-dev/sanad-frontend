import { useState, useEffect } from "react";
import { IconSchool, IconCheck } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useStaff } from "@/features/services/staff/hooks/use-staff";
import {
	useCreateClassroom,
	useUpdateClassroom,
} from "@/features/services/classrooms/hooks/use-classroom-mutations";
import {
	AGE_GROUPS,
	CATEGORIES,
	LEARNING_MODES,
} from "@/features/services/classrooms/data/constants";
import type { ClassroomResponse, LearningMode } from "@/server/classrooms/classrooms.type";
import { cn } from "@/lib/utils";

interface ClassroomSheetProps {
	open: boolean;
	onClose: () => void;
	classroom?: ClassroomResponse | null;
}

export function ClassroomSheet({
	open,
	onClose,
	classroom,
}: ClassroomSheetProps) {
	const isEdit = Boolean(classroom);
	const { staff } = useStaff();
	const { mutate: createClassroom, isPending: isCreating } = useCreateClassroom();
	const { mutate: updateClassroom, isPending: isUpdating } = useUpdateClassroom();
	const isPending = isCreating || isUpdating;

	const [name, setName] = useState("");
	const [code, setCode] = useState("");
	const [category, setCategory] = useState<string>("البرمجة والمنطق");
	const [ageGroup, setAgeGroup] = useState<string>("8-12 سنة");
	const [learningMode, setLearningMode] = useState<LearningMode>("REMOTE");
	const [capacity, setCapacity] = useState<number>(10);
	const [active, setActive] = useState<boolean>(true);
	const [notes, setNotes] = useState("");
	const [selectedStaffIds, setSelectedStaffIds] = useState<string[]>([]);

	useEffect(() => {
		if (classroom) {
			setName(classroom.name || "");
			setCode(classroom.code || "");
			setCategory(classroom.category || "البرمجة والمنطق");
			setAgeGroup(classroom.ageGroup || "8-12 سنة");
			setLearningMode(classroom.learningMode || "REMOTE");
			setCapacity(classroom.capacity || 10);
			setActive(classroom.active !== false);
			setNotes(classroom.notes || "");
			setSelectedStaffIds(classroom.teachers.map((t) => t.id));
		} else {
			setName("");
			setCode("");
			setCategory("البرمجة والمنطق");
			setAgeGroup("8-12 سنة");
			setLearningMode("REMOTE");
			setCapacity(10);
			setActive(true);
			setNotes("");
			setSelectedStaffIds([]);
		}
	}, [classroom, open]);

	const toggleStaff = (id: string) => {
		setSelectedStaffIds((prev) =>
			prev.includes(id) ? prev.filter((sId) => sId !== id) : [...prev, id],
		);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!name.trim()) return;

		const payload = {
			name: name.trim(),
			code: code.trim() || undefined,
			category,
			ageGroup,
			learningMode,
			capacity: Number(capacity) || 10,
			active,
			notes: notes.trim() || null,
			staffIds: selectedStaffIds,
		};

		if (isEdit && classroom) {
			updateClassroom(
				{ id: classroom.id, data: payload },
				{
					onSuccess: () => onClose(),
				},
			);
		} else {
			createClassroom(payload, {
				onSuccess: () => onClose(),
			});
		}
	};

	return (
		<Sheet open={open} onOpenChange={(next) => !next && onClose()}>
			<SheetContent side="left" className="sm:max-w-md w-full overflow-y-auto" dir="rtl">
				<form onSubmit={handleSubmit} className="flex flex-col h-full">
					<SheetHeader className="text-right">
						<SheetTitle className="flex items-center gap-2">
							<IconSchool className="size-5 text-primary" />
							{isEdit ? "تعديل بيانات الفصل" : "إضافة فصل جديد"}
						</SheetTitle>
						<SheetDescription>
							{isEdit
								? "تحديث بيانات الفصل والمعلمين والمشرفين المسؤولين"
								: "أنشئ فصلاً دراسياً جديداً مع تحديد السعة الاستيعابية ونمط التعلم"}
						</SheetDescription>
					</SheetHeader>

					<div className="flex-1 space-y-4 py-4 text-right">
						{/* اسم الفصل */}
						<div className="space-y-1.5">
							<Label htmlFor="cls-name" className="text-xs font-semibold">
								اسم الفصل <span className="text-destructive">*</span>
							</Label>
							<Input
								id="cls-name"
								placeholder="مثال: المبرمجون الصغار A"
								value={name}
								onChange={(e) => setName(e.target.value)}
								required
								className="text-xs h-9 text-right"
							/>
						</div>

						{/* الكود والسعة */}
						<div className="grid grid-cols-2 gap-3">
							<div className="space-y-1.5">
								<Label htmlFor="cls-code" className="text-xs font-semibold">
									المعرف / الكود
								</Label>
								<Input
									id="cls-code"
									placeholder="تلقائي إن ترك فارغاً"
									value={code}
									onChange={(e) => setCode(e.target.value)}
									className="text-xs h-9 text-right font-mono"
								/>
							</div>

							<div className="space-y-1.5">
								<Label htmlFor="cls-capacity" className="text-xs font-semibold">
									السعة الاستيعابية (طلاب)
								</Label>
								<Input
									id="cls-capacity"
									type="number"
									min={1}
									max={100}
									value={capacity}
									onChange={(e) => setCapacity(Number(e.target.value))}
									className="text-xs h-9 text-right font-mono"
								/>
							</div>
						</div>

						{/* الفئة التعليمية والفئة العمرية */}
						<div className="grid grid-cols-2 gap-3">
							<div className="space-y-1.5">
								<Label className="text-xs font-semibold">الفئة التعليمية</Label>
								<Select value={category} onValueChange={setCategory} dir="rtl">
									<SelectTrigger className="text-xs h-9 text-right">
										<SelectValue />
									</SelectTrigger>
									<SelectContent dir="rtl">
										{CATEGORIES.map((cat) => (
											<SelectItem key={cat} value={cat} className="text-xs">
												{cat}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-1.5">
								<Label className="text-xs font-semibold">الفئة العمرية</Label>
								<Select value={ageGroup} onValueChange={setAgeGroup} dir="rtl">
									<SelectTrigger className="text-xs h-9 text-right">
										<SelectValue />
									</SelectTrigger>
									<SelectContent dir="rtl">
										{AGE_GROUPS.map((ag) => (
											<SelectItem key={ag} value={ag} className="text-xs">
												{ag}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</div>

						{/* نمط التعلم */}
						<div className="space-y-1.5">
							<Label className="text-xs font-semibold">نمط التعلم</Label>
							<div className="grid grid-cols-3 gap-2">
								{(Object.entries(LEARNING_MODES) as [LearningMode, { label: string }][]).map(
									([mode, config]) => {
										const isSelected = learningMode === mode;
										return (
											<button
												key={mode}
												type="button"
												onClick={() => setLearningMode(mode)}
												className={cn(
													"py-2 px-3 text-xs font-medium rounded-lg border text-center transition-all",
													isSelected
														? "border-primary bg-primary/10 text-primary font-semibold shadow-xs"
														: "border-border text-muted-foreground hover:bg-muted/50",
												)}
											>
												{config.label}
											</button>
										);
									},
								)}
							</div>
						</div>

						{/* المعلمون والمشرفون */}
						<div className="space-y-1.5">
							<div className="flex items-center justify-between">
								<Label className="text-xs font-semibold">المشرف / المعلم المسؤول</Label>
								<span className="text-[10px] text-muted-foreground">
									{selectedStaffIds.length} محدد
								</span>
							</div>

							<div className="border rounded-lg p-2 max-h-36 overflow-y-auto space-y-1">
								{staff.length === 0 ? (
									<p className="text-[11px] text-muted-foreground text-center py-2">لا يوجد موظفون</p>
								) : (
									staff.map((s) => {
										const isSelected = selectedStaffIds.includes(s.id);
										return (
											<div
												key={s.id}
												onClick={() => toggleStaff(s.id)}
												className={cn(
													"flex items-center justify-between p-1.5 rounded cursor-pointer transition-colors text-xs",
													isSelected ? "bg-primary/10 text-primary" : "hover:bg-muted/50",
												)}
											>
												<span className="truncate">{s.name}</span>
												<div
													className={cn(
														"size-4 rounded border flex items-center justify-center shrink-0",
														isSelected ? "bg-primary border-primary text-white" : "border-border",
													)}
												>
													{isSelected && <IconCheck className="size-3" />}
												</div>
											</div>
										);
									})
								)}
							</div>
						</div>

						{/* الحالة وملاحظات */}
						<div className="flex items-center justify-between py-1 border-t pt-3">
							<div>
								<Label className="text-xs font-semibold">حالة الفصل (نشط)</Label>
								<p className="text-[11px] text-muted-foreground">تفعيل أو إيقاف استقبال الطلاب في هذا الفصل</p>
							</div>
							<Switch checked={active} onCheckedChange={setActive} />
						</div>

						<div className="space-y-1.5">
							<Label htmlFor="cls-notes" className="text-xs font-semibold">
								ملاحظات إضافية
							</Label>
							<Textarea
								id="cls-notes"
								rows={2}
								placeholder="أي متطلبات أو مواعيد للفصل..."
								value={notes}
								onChange={(e) => setNotes(e.target.value)}
								className="text-xs text-right"
							/>
						</div>
					</div>

					<SheetFooter className="gap-2 sm:gap-0 pt-4 border-t">
						<Button type="button" variant="outline" size="sm" onClick={onClose} disabled={isPending}>
							إلغاء
						</Button>
						<Button type="submit" size="sm" disabled={isPending || !name.trim()}>
							{isPending ? "جاري الحفظ..." : isEdit ? "تحديث الفصل" : "إنشاء الفصل"}
						</Button>
					</SheetFooter>
				</form>
			</SheetContent>
		</Sheet>
	);
}
