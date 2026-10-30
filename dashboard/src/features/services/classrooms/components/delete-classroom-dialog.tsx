import {
	IconAlertCircle,
	IconAlertTriangle,
	IconChevronLeft,
	IconCircleX,
	IconUsers,
} from "@tabler/icons-react";
import { useHotkey } from "@tanstack/react-hotkeys";
import { useState } from "react";
import { toast } from "sonner";
import { InitialsAvatar } from "@/components/common/initials-avatar";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { useDeleteClassroom } from "@/features/services/classrooms/hooks/use-classroom-mutations";
import { useClassrooms } from "@/features/services/classrooms/hooks/use-classrooms";
import type { ClassroomResponse } from "@/server/classrooms/classrooms.type";

interface DeleteClassroomDialogProps {
	classroom: ClassroomResponse | null;
	onClose: () => void;
	onSuccess?: (deletedId: string) => void;
}

export function DeleteClassroomDialog({
	classroom,
	onClose,
	onSuccess,
}: DeleteClassroomDialogProps) {
	const [targetClassroomId, setTargetClassroomId] = useState("");
	const [notifyStaff, setNotifyStaff] = useState(false);
	const { mutateAsync: deleteClassroom, isPending } = useDeleteClassroom();
	const { classrooms } = useClassrooms();

	const enrolledCount = Number(classroom?.enrolledCount || classroom?.students?.length || 0);
	const hasStudents = enrolledCount > 0;
	const otherClassrooms = (classrooms || []).filter((c) => c.id !== classroom?.id && c.active);
	const canConfirm =
		!hasStudents || (otherClassrooms.length > 0 && Boolean(targetClassroomId));

	const studentLabel =
		enrolledCount === 1
			? "طالب واحد مسجل"
			: enrolledCount === 2
				? "طالبين اثنين مسجلين"
				: enrolledCount >= 3 && enrolledCount <= 10
					? `${enrolledCount} طلاب مسجلين`
					: `${enrolledCount} طالباً مسجلاً`;

	const handleDelete = async () => {
		if (!classroom) return;
		if (hasStudents && !targetClassroomId) {
			toast.error("يرجى اختيار فصل بديل لنقل الطلاب إليه أولاً");
			return;
		}

		try {
			const id = classroom.id;
			await deleteClassroom({
				id,
				targetClassroomId: targetClassroomId || undefined,
			});
			if (notifyStaff) {
				toast.success("تم إرسال إشعار للكادر التدريسي والإدارة");
			}
			onSuccess?.(id);
			onClose();
		} catch {
			// الخطأ يظهر عبر هوك useDeleteClassroom
		}
	};

	const handleOpenChange = (open: boolean) => {
		if (!open) {
			setTargetClassroomId("");
			setNotifyStaff(false);
			onClose();
		}
	};

	useHotkey("Mod+Enter", () => void handleDelete(), {
		enabled: Boolean(classroom) && !isPending && canConfirm,
	});

	return (
		<Dialog
			open={Boolean(classroom)}
			onOpenChange={handleOpenChange}
		>
			<DialogContent
				className="sm:max-w-xl! p-0 gap-0"
				dir="rtl"
			>
				<DialogHeader className="px-4 py-3 border-b flex-row items-center gap-2 space-y-0">
					<DialogTitle className="text-destructive font-semibold text-sm">
						حذف الفصل الدراسي
					</DialogTitle>
					{classroom && (
						<>
							<IconChevronLeft className="size-3.5 text-muted-foreground" />
							<div className="flex items-center gap-1.5 min-w-0">
								<InitialsAvatar
									name={classroom.name}
									className="size-6"
								/>
								<span className="text-sm font-medium truncate">{classroom.name}</span>
								{classroom.code && (
									<span className="text-xs text-muted-foreground font-mono tabular-nums shrink-0">
										#{classroom.code}
									</span>
								)}
							</div>
						</>
					)}
				</DialogHeader>

				<DialogDescription className="sr-only">
					تأكيد حذف الفصل الدراسي من النظام ونقل الطلاب المسجلين
				</DialogDescription>

				<div className="px-5 py-5 flex flex-col gap-4">
					<p className="text-sm text-foreground leading-relaxed">
						هل أنت متأكد من حذف الفصل الدراسي &ldquo;{classroom?.name}&rdquo;؟ لا يمكن التراجع
						عن هذا الإجراء.
					</p>

					{/* مربع التنبيه والنتائج المترتبة — مطابق لنمط وليّ الأمر */}
					<div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 flex flex-col gap-2.5">
						<p className="text-sm font-semibold text-destructive flex items-center gap-1.5">
							<IconAlertCircle className="size-4" />
							النتائج المترتبة:
						</p>
						<ul className="flex flex-col gap-1.5">
							<li className="flex items-start gap-2 text-sm text-foreground">
								<IconCircleX className="size-4 text-destructive shrink-0 mt-0.5" />
								لن يظهر الفصل الدراسي داخل النظام أو في الجداول بعد الآن
							</li>
							<li className="flex items-start gap-2 text-sm text-foreground">
								<IconCircleX className="size-4 text-destructive shrink-0 mt-0.5" />
								سيتم فك ارتباط الكادر التعليمي والموظفين المسندين للفصل
							</li>
							<li className="flex items-start gap-2 text-sm text-foreground">
								<IconAlertTriangle className="size-4 text-amber-500 shrink-0 mt-0.5" />
								ستتوقف سجلات الحضور والانصراف والمناوبات المرتبطة بهذا الفصل
							</li>
						</ul>
					</div>

					{/* قسم نقل الطلاب إذا كان الفصل يحتوي على طلاب — مطابق لنمط وليّ الأمر */}
					{hasStudents && (
						<div className="flex flex-col gap-2.5 rounded-lg border border-amber-500/25 bg-amber-500/5 p-4">
							<div className="flex items-center justify-between">
								<p className="text-sm text-foreground font-semibold flex items-center gap-1.5">
									<IconUsers className="size-4 text-amber-600 dark:text-amber-400" />
									<span>نقل الطلاب إلى فصل بديل قبل الحذف</span>
									<span className="text-destructive">*</span>
								</p>
								<span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-900 dark:text-amber-200 font-mono">
									{studentLabel}
								</span>
							</div>

							<p className="text-xs text-muted-foreground leading-relaxed">
								هذا الفصل مرتبط بـ ({studentLabel}). يرجى تحديد فصل دراسي بديل لنقل جميع الطلاب
								وسجلاتهم الأكاديمية إليه تلقائياً قبل الحذف.
							</p>

							{otherClassrooms.length > 0 ? (
								<Select
									value={targetClassroomId}
									onValueChange={setTargetClassroomId}
									dir="rtl"
									disabled={isPending}
								>
									<SelectTrigger className="w-full h-10 text-xs bg-background">
										<SelectValue placeholder="اختر الفصل البديل لنقل الطلاب إليه..." />
									</SelectTrigger>
									<SelectContent
										dir="rtl"
										className="max-h-56"
									>
										{otherClassrooms.map((c) => (
											<SelectItem
												key={c.id}
												value={c.id}
												className="text-xs cursor-pointer py-2"
											>
												<div className="flex items-center justify-between gap-4 w-full">
													<div className="flex items-center gap-2">
														<InitialsAvatar
															name={c.name}
															className="size-5 text-[9px]"
														/>
														<span className="font-semibold text-foreground">{c.name}</span>
														{c.code && (
															<span className="text-muted-foreground text-[10px] font-mono">
																#{c.code}
															</span>
														)}
													</div>
													<div className="flex items-center gap-2 text-[10px] text-muted-foreground shrink-0">
														<span className="px-1.5 py-0.5 rounded bg-muted">
															{c.category}
														</span>
														<span>
															{c.enrolledCount || 0} / {c.capacity} طالب
														</span>
													</div>
												</div>
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							) : (
								<div className="p-3 rounded-lg border border-destructive/25 bg-destructive/10 text-xs text-destructive font-medium">
									لا توجد فصول دراسية بديلة متاحة حالياً لنقل الطلاب إليها. يرجى إنشاء فصل دراسي
									بديل أولاً لتتمكن من حذف هذا الفصل.
								</div>
							)}
						</div>
					)}
				</div>

				{/* الشريط السفلي — مطابق لنمط وليّ الأمر */}
				<div className="px-5 py-4 border-t flex gap-2 items-center justify-between">
					<label
						htmlFor="notify-staff-delete-classroom"
						className="flex items-center gap-2 cursor-pointer select-none"
					>
						<Switch
							id="notify-staff-delete-classroom"
							checked={notifyStaff}
							onCheckedChange={setNotifyStaff}
							disabled={isPending}
						/>
						<span className="text-xs text-muted-foreground">
							إشعار المعلمين والإدارة عبر البريد
						</span>
					</label>

					<div className="flex items-center gap-2">
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={onClose}
							disabled={isPending}
							className="text-xs cursor-pointer"
						>
							إلغاء
						</Button>

						<Button
							type="button"
							onClick={handleDelete}
							disabled={isPending || !canConfirm}
							className="gap-2 flex bg-destructive text-destructive-foreground hover:bg-destructive/90 text-xs font-medium cursor-pointer"
						>
							{isPending && <Spinner className="size-3.5" />}
							<span>حذف</span>
							<kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-0.5 rounded border border-destructive-foreground/30 bg-destructive-foreground/10 px-1.5 font-mono text-[10px] opacity-60">
								<span>⌘</span>
								<span>↵</span>
							</kbd>
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
