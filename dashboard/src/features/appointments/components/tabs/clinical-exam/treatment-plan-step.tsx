import { IconEye, IconMicrophone, IconPlus, IconTrash } from "@tabler/icons-react";
import { useMemo, useState } from "react";
import type { UseFormReturn } from "react-hook-form";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
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
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useAppointment } from "@/features/appointments/hooks/use-appointment";
import { useAppointmentServices } from "@/features/appointments/hooks/use-appointment-services";
import { useInvoice } from "@/features/appointments/hooks/use-invoice";
import { CarePlanEnrollmentsPanel } from "@/features/finance/care-plans/components/care-plan-enrollments-panel";
import { MedicationsPanel } from "@/features/pharmacy/components/medications-panel";
import { useCreateLabTest } from "@/features/services/lab-tests/hooks/use-create-lab-test";
import { useLabTemplates } from "@/features/services/lab-tests/hooks/use-lab-templates";
import { useLabTestsByAppointment } from "@/features/services/lab-tests/hooks/use-lab-tests-by-appointment";
import { useCreateRadiologyOrder } from "@/features/services/radiology/hooks/use-create-radiology-order";
import { useRadiologyByAppointment } from "@/features/services/radiology/hooks/use-radiology-by-appointment";
import { useRadiologyTemplates } from "@/features/services/radiology/hooks/use-radiology-templates";
import { ConfirmDiscard } from "@/features/settings/components/confirm-discard";
import { useServicesTree } from "@/features/settings/services/hooks/use-services-tree";
import type { AppointmentServiceResponse } from "@/server/appointments/appointments.type";
import type { TreatmentPlanFormInput } from "@/server/clinical-exams/clinical-exams.type";
import { LAB_STATUS_LABELS } from "@sanad/contracts/runtime/server/lab-tests/lab-tests.workflow";
import { RADIOLOGY_STATUS_LABELS } from "@sanad/contracts/runtime/server/radiology/radiology.workflow";
import type { ServiceItemResponse } from "@/server/services/services.type";

import { AISuggestionsBanner } from "./ai-suggestions-banner";
import {
	ExamResultsDialog,
	type ExamResultsTarget,
	hasLabResults,
	hasRadiologyResults,
} from "./exam-results-dialog";
import { step4Suggestions } from "./mock-ai-suggestions";

// ── Procedures table ───────────────────────────────────────────────────────────

interface ServiceDraft {
	serviceId: string;
	quantity: number;
}

const DRAFT_INITIAL: ServiceDraft = { serviceId: "", quantity: 1 };

/**
 * ما تحفظه الحالة عن الفحص المفتوح: نوعه ومعرّفه لا كائنه. الكائن يُشتقّ من
 * بيانات الاستعلام عند كل تصيير، فتبقى النافذة مواكِبة لما يجري في المختبر
 * أو قسم الأشعة بدل عرض لقطة قديمة التُقطت لحظة الفتح.
 */
type ExamResultsRef = { kind: ExamResultsTarget["kind"]; itemId: string };

/**
 * إجراء «عرض النتائج» لصفوف التحاليل والأشعة. يبقى ظاهرًا قبل صدور النتيجة
 * لكن معطّلًا — الشارة في عمود الفئة تشرح سبب التعطيل.
 */
function ViewResultsButton({
	target,
	onOpen,
}: {
	target: ExamResultsTarget;
	onOpen: (ref: ExamResultsRef) => void;
}) {
	const ready =
		target.kind === "LAB" ? hasLabResults(target.item) : hasRadiologyResults(target.item);

	return (
		<Button
			type="button"
			size="icon"
			variant="ghost"
			className="h-6 w-6 text-muted-foreground hover:text-foreground"
			disabled={!ready}
			title={ready ? "عرض النتائج" : "لم تصدر النتائج بعد"}
			aria-label={ready ? `عرض نتائج ${target.item.service.name}` : "لم تصدر النتائج بعد"}
			onClick={() => onOpen({ kind: target.kind, itemId: target.item.id })}
		>
			<IconEye className="size-3.5" />
		</Button>
	);
}

interface ProceduresTableProps {
	appointmentId: string;
	disabled?: boolean;
}

/**
 * [S4] مُصدَّر ليستعمله قسم «الخطة» في ملاحظة SOAP كما هو. الطلبات هي «P» في SOAP،
 * وهذه الأسلاك تعمل — نسخُها كان سيُنشئ مسارَي طلبٍ يفترقان بصمت.
 */
export function ProceduresTable({ appointmentId, disabled }: ProceduresTableProps) {
	const {
		services,
		addService,
		deleteService,
		updateService,
		isAdding,
		isDeleting,
		isUpdating,
	} = useAppointmentServices(appointmentId);
	const { invoice } = useInvoice(appointmentId);
	const { tree } = useServicesTree();
	const { appointment } = useAppointment(appointmentId);
	// الربط المزدوج مع التحاليل: قوالب التحاليل لمعرفة أي دورة هي تحليل،
	// وتحاليل هذه الزيارة لعرضها هنا ولو أُنشئت من لوحة التحاليل.
	const { templates: labTemplates } = useLabTemplates();
	const { labTests: labOrders } = useLabTestsByAppointment(appointmentId);
	const { createLabTest, isPending: isCreatingLab } = useCreateLabTest();
	// نفس الربط المزدوج مع الأشعة: قوالبها لمعرفة أي دورة فحص تصوير،
	// وطلبات هذه الزيارة لعرضها هنا ولو أُنشئت من لوحة الأشعة.
	const { templates: radiologyTemplates } = useRadiologyTemplates();
	const { radiologyOrders } = useRadiologyByAppointment(appointmentId);
	const { createOrder: createRadiologyOrder, isPending: isCreatingRadiology } =
		useCreateRadiologyOrder();
	const isLocked = invoice?.status === "PAID";

	const labServiceIds = useMemo(
		() => new Set(labTemplates.map((t) => t.serviceId)),
		[labTemplates],
	);
	// الطلب الواحد قد يضم عدة تحاليل — نُسطّح عناصره لنطابق كل دورة بعنصرها
	const labItems = useMemo(
		() => labOrders.flatMap((order) => order.items.map((item) => ({ order, item }))),
		[labOrders],
	);
	// عنصر التحليل المقابل لكل دورة تحليل مضافة للزيارة
	const labItemByService = useMemo(
		() => new Map(labItems.map((entry) => [entry.item.serviceId, entry])),
		[labItems],
	);
	// تحاليل مرتبطة بالزيارة بلا صف دورة (أُنشئت من لوحة التحاليل) — تُعرض كصفوف إضافية
	const unbilledLabItems = useMemo(() => {
		const billed = new Set(services.map((s) => s.serviceId));
		return labItems.filter((entry) => !billed.has(entry.item.serviceId));
	}, [labItems, services]);

	const radiologyServiceIds = useMemo(
		() => new Set(radiologyTemplates.map((t) => t.serviceId)),
		[radiologyTemplates],
	);
	const radiologyItems = useMemo(
		() => radiologyOrders.flatMap((order) => order.items.map((item) => ({ order, item }))),
		[radiologyOrders],
	);
	const radiologyItemByService = useMemo(
		() => new Map(radiologyItems.map((entry) => [entry.item.serviceId, entry])),
		[radiologyItems],
	);
	// فحوصات أشعة مرتبطة بالزيارة بلا صف دورة (أُنشئت من لوحة الأشعة)
	const unbilledRadiologyItems = useMemo(() => {
		const billed = new Set(services.map((s) => s.serviceId));
		return radiologyItems.filter((entry) => !billed.has(entry.item.serviceId));
	}, [radiologyItems, services]);

	const [isAddingRow, setIsAddingRow] = useState(false);
	const [draft, setDraft] = useState<ServiceDraft>(DRAFT_INITIAL);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [editQty, setEditQty] = useState(1);
	// الفحص المعروضة نتيجته في النافذة — null يعني مغلقة
	const [resultsRef, setResultsRef] = useState<ExamResultsRef | null>(null);

	// يُشتقّ من أحدث بيانات الاستعلام: لو حُذفت صورة أو اعتُمد التقرير والنافذة
	// مفتوحة، انعكس ذلك فورًا. واختفاء الفحص من القائمة يغلقها من تلقائه.
	const resultsTarget = useMemo<ExamResultsTarget | null>(() => {
		if (!resultsRef) return null;
		if (resultsRef.kind === "LAB") {
			const entry = labItems.find((e) => e.item.id === resultsRef.itemId);
			return entry ? { kind: "LAB", order: entry.order, item: entry.item } : null;
		}
		const entry = radiologyItems.find((e) => e.item.id === resultsRef.itemId);
		return entry ? { kind: "RADIOLOGY", order: entry.order, item: entry.item } : null;
	}, [resultsRef, labItems, radiologyItems]);

	type ServiceItemWithPricing = ServiceItemResponse & { price: number; duration: number };
	const flatItems = useMemo<ServiceItemWithPricing[]>(
		() =>
			tree
				.flatMap((cat) => cat.children.flatMap((sub) => sub.children))
				.filter(
					(item): item is ServiceItemWithPricing =>
						item.price !== null && item.duration !== null,
				),
		[tree],
	);

	const selectedItem = flatItems.find((i) => i.id === draft.serviceId);

	const handleConfirmAdd = async () => {
		if (!selectedItem || isAdding) return;
		const isLabService = labServiceIds.has(selectedItem.id);
		const isRadiologyService = radiologyServiceIds.has(selectedItem.id);

		// التحليل يُفوتَر على فاتورة طلبه المخبري وحدها — فلا نُضيفه بندًا على
		// فاتورة الزيارة، وإلا حُوسِب المبلغ مرتين بعَلَمَي سداد مستقلَّين.
		if (isLabService) {
			const alreadyOrdered = labItemByService.has(selectedItem.id);
			if (!alreadyOrdered && appointment) {
				try {
					await createLabTest({
						branchId: appointment.branchId,
						patientId: appointment.patient.id,
						ownerId: appointment.ownerId,
						serviceIds: [selectedItem.id],
						appointmentId,
						isUrgent: false,
						// طلب المدرّب من الزيارة يدخل الطابور لمراجعة المختبر
						origin: "VISIT",
					});
				} catch {
					return; // التوست يعرض السبب — لا نغلق الصف حتى يعيد المحاولة
				}
			}
		} else if (isRadiologyService) {
			// فحص الأشعة يُفوتَر على فاتورة طلبه هو الآخر — نفس منطق التحليل
			const alreadyOrdered = radiologyItemByService.has(selectedItem.id);
			if (!alreadyOrdered && appointment) {
				try {
					await createRadiologyOrder({
						branchId: appointment.branchId,
						patientId: appointment.patient.id,
						ownerId: appointment.ownerId,
						serviceIds: [selectedItem.id],
						appointmentId,
						isUrgent: false,
						// السبب السريري إلزامي — تفاصيله في ملف الزيارة المرتبطة
						clinicalInfo: "طُلب من خطة علاج الزيارة — راجع ملف الزيارة",
						views: [],
						// طلب المدرّب من الزيارة يدخل الطلبات لمراجعة قسم الأشعة
						origin: "VISIT",
					});
				} catch {
					return; // التوست يعرض السبب — لا نغلق الصف حتى يعيد المحاولة
				}
			}
		} else {
			await addService({
				serviceId: selectedItem.id,
				quantity: draft.quantity,
				priceSnapshot: selectedItem.price,
				durationSnapshot: selectedItem.duration,
			});
		}

		setDraft(DRAFT_INITIAL);
		setIsAddingRow(false);
	};

	const handleConfirmEdit = async (row: AppointmentServiceResponse) => {
		await updateService(row.id, { quantity: editQty });
		setEditingId(null);
	};

	const startEdit = (row: AppointmentServiceResponse) => {
		setEditingId(row.id);
		setEditQty(row.quantity);
	};

	const isBusy =
		isAdding ||
		isDeleting ||
		isUpdating ||
		isCreatingLab ||
		isCreatingRadiology ||
		!!disabled ||
		isLocked;

	return (
		<div className="flex flex-col gap-3">
			<div className="flex items-center justify-between">
				<h3 className="text-sm font-semibold">الإجراءات والفحوصات التشخيصية</h3>
				<Button
					type="button"
					variant="outline"
					size="sm"
					className="gap-1.5"
					disabled={isBusy || isAddingRow}
					onClick={() => setIsAddingRow(true)}
				>
					<IconPlus className="size-3.5" />
					أضف فحص
				</Button>
			</div>

			{(services.length > 0 ||
				unbilledLabItems.length > 0 ||
				unbilledRadiologyItems.length > 0 ||
				isAddingRow) && (
				<div className="rounded-md border">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="text-right">الفحص</TableHead>
								<TableHead className="text-center">الفئة</TableHead>
								<TableHead className="text-center">الوقت</TableHead>
								<TableHead className="text-center">العدد</TableHead>
								<TableHead className="text-center">الإجمالي</TableHead>
								<TableHead />
							</TableRow>
						</TableHeader>
						<TableBody>
							{services.map((row) => {
								// دورة تحليل/أشعة → نعرض حالة الطلب المرتبط بها بدل شارة "فحص"
								const labEntry = labItemByService.get(row.serviceId);
								const radiologyEntry = radiologyItemByService.get(row.serviceId);
								return (
									<TableRow key={row.id}>
										<TableCell className="text-sm font-medium">{row.service.name}</TableCell>
										<TableCell className="text-center">
											{labEntry ? (
												<div className="flex items-center justify-center gap-1.5">
													<Badge
														variant="secondary"
														className="rounded-sm text-xs"
													>
														تحليل
													</Badge>
													<Badge
														variant="outline"
														className="rounded-sm text-[10px]"
													>
														{LAB_STATUS_LABELS[labEntry.item.status]}
													</Badge>
												</div>
											) : radiologyEntry ? (
												<div className="flex items-center justify-center gap-1.5">
													<Badge
														variant="secondary"
														className="rounded-sm text-xs"
													>
														أشعة
													</Badge>
													<Badge
														variant="outline"
														className="rounded-sm text-[10px]"
													>
														{RADIOLOGY_STATUS_LABELS[radiologyEntry.item.status]}
													</Badge>
												</div>
											) : (
												<Badge
													variant="secondary"
													className="rounded-sm text-xs"
												>
													فحص
												</Badge>
											)}
										</TableCell>
										<TableCell className="text-center text-sm text-muted-foreground">
											{row.durationSnapshot} دقيقة
										</TableCell>
										<TableCell className="text-center">
											{editingId === row.id ? (
												<Input
													type="number"
													min={1}
													value={editQty}
													onChange={(e) => setEditQty(Number(e.target.value))}
													className="h-7 w-16 text-center"
												/>
											) : (
												<button
													type="button"
													className="text-sm hover:underline"
													onClick={() => startEdit(row)}
													disabled={isBusy}
												>
													{row.quantity}
												</button>
											)}
										</TableCell>
										<TableCell className="text-center text-sm tabular-nums">
											{(Number(row.priceSnapshot) * row.quantity).toLocaleString()} ر.س
										</TableCell>
										<TableCell>
											{editingId === row.id ? (
												<ConfirmDiscard
													onConfirm={() => void handleConfirmEdit(row)}
													onDiscard={() => setEditingId(null)}
													disabled={isBusy}
													confirmDisabled={isBusy || editQty < 1}
												/>
											) : (
												<div className="flex items-center gap-1">
													{labEntry && (
														<ViewResultsButton
															target={{
																kind: "LAB",
																order: labEntry.order,
																item: labEntry.item,
															}}
															onOpen={setResultsRef}
														/>
													)}
													{radiologyEntry && (
														<ViewResultsButton
															target={{
																kind: "RADIOLOGY",
																order: radiologyEntry.order,
																item: radiologyEntry.item,
															}}
															onOpen={setResultsRef}
														/>
													)}
													<Button
														type="button"
														size="icon"
														variant="ghost"
														className="h-6 w-6 text-muted-foreground hover:text-destructive"
														disabled={isBusy}
														onClick={() => void deleteService(row.id)}
													>
														<IconTrash className="size-3.5" />
													</Button>
												</div>
											)}
										</TableCell>
									</TableRow>
								);
							})}

							{/* فحوصات أشعة مرتبطة بهذه الزيارة أُنشئت من لوحة الأشعة — تظهر هنا للاطلاع */}
							{unbilledRadiologyItems.map(({ order, item }) => (
								<TableRow
									key={item.id}
									className="bg-muted/20"
								>
									<TableCell className="text-sm font-medium">{item.service.name}</TableCell>
									<TableCell className="text-center">
										<div className="flex items-center justify-center gap-1.5">
											<Badge
												variant="secondary"
												className="rounded-sm text-xs"
											>
												أشعة
											</Badge>
											<Badge
												variant="outline"
												className="rounded-sm text-[10px]"
											>
												{RADIOLOGY_STATUS_LABELS[item.status]}
											</Badge>
										</div>
									</TableCell>
									<TableCell className="text-center text-sm text-muted-foreground">
										—
									</TableCell>
									<TableCell className="text-center text-sm text-muted-foreground">
										1
									</TableCell>
									<TableCell className="text-center text-xs text-muted-foreground">
										غير مُفوتر
									</TableCell>
									<TableCell>
										<ViewResultsButton
											target={{ kind: "RADIOLOGY", order, item }}
											onOpen={setResultsRef}
										/>
									</TableCell>
								</TableRow>
							))}

							{/* تحاليل مرتبطة بهذه الزيارة أُنشئت من لوحة التحاليل — تظهر هنا للاطلاع */}
							{unbilledLabItems.map(({ order, item }) => (
								<TableRow
									key={item.id}
									className="bg-muted/20"
								>
									<TableCell className="text-sm font-medium">{item.service.name}</TableCell>
									<TableCell className="text-center">
										<div className="flex items-center justify-center gap-1.5">
											<Badge
												variant="secondary"
												className="rounded-sm text-xs"
											>
												تحليل
											</Badge>
											<Badge
												variant="outline"
												className="rounded-sm text-[10px]"
											>
												{LAB_STATUS_LABELS[item.status]}
											</Badge>
										</div>
									</TableCell>
									<TableCell className="text-center text-sm text-muted-foreground">
										—
									</TableCell>
									<TableCell className="text-center text-sm text-muted-foreground">
										1
									</TableCell>
									<TableCell className="text-center text-xs text-muted-foreground">
										غير مُفوتر
									</TableCell>
									<TableCell>
										<ViewResultsButton
											target={{ kind: "LAB", order, item }}
											onOpen={setResultsRef}
										/>
									</TableCell>
								</TableRow>
							))}

							{isAddingRow && (
								<TableRow>
									<TableCell colSpan={2}>
										<Select
											value={draft.serviceId}
											onValueChange={(v) => setDraft((d) => ({ ...d, serviceId: v }))}
											dir="rtl"
										>
											<SelectTrigger className="h-7 w-full text-sm">
												<SelectValue placeholder="اختر دورة..." />
											</SelectTrigger>
											<SelectContent>
												{flatItems.map((item) => (
													<SelectItem
														key={item.id}
														value={item.id}
													>
														{item.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</TableCell>
									<TableCell className="text-center text-sm text-muted-foreground">
										{selectedItem ? `${selectedItem.duration} دقيقة` : "—"}
									</TableCell>
									<TableCell className="text-center">
										<Input
											type="number"
											min={1}
											value={draft.quantity}
											onChange={(e) =>
												setDraft((d) => ({ ...d, quantity: Number(e.target.value) }))
											}
											className="h-7 w-16 text-center"
										/>
									</TableCell>
									<TableCell className="text-center text-sm tabular-nums">
										{selectedItem
											? `${(selectedItem.price * draft.quantity).toLocaleString()} ر.س`
											: "—"}
									</TableCell>
									<TableCell>
										<ConfirmDiscard
											onConfirm={() => void handleConfirmAdd()}
											onDiscard={() => {
												setIsAddingRow(false);
												setDraft(DRAFT_INITIAL);
											}}
											disabled={isAdding}
											confirmDisabled={isAdding || !draft.serviceId}
										/>
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>
			)}

			<ExamResultsDialog
				target={resultsTarget}
				onOpenChange={(open) => {
					if (!open) setResultsRef(null);
				}}
			/>
		</div>
	);
}

// ── TreatmentPlanStep ─────────────────────────────────────────────────────────

interface TreatmentPlanStepProps {
	form: UseFormReturn<TreatmentPlanFormInput>;
	appointmentId: string;
	disabled?: boolean;
	isCompleted?: boolean;
}

export function TreatmentPlanStep({
	form,
	appointmentId,
	disabled = false,
	isCompleted = false,
}: TreatmentPlanStepProps) {
	const { appointment } = useAppointment(appointmentId);

	return (
		<div className="flex flex-col gap-8">
			{!isCompleted && (
				<AISuggestionsBanner
					form={form}
					suggestions={step4Suggestions}
					headerText="تشخيص AI: بناءً على التشخيص الطبي:"
					subLabel="نقترح خطة علاج رفيق AI:"
				/>
			)}

			<ProceduresTable
				appointmentId={appointmentId}
				disabled={disabled}
			/>

			{/* [PH9.1] الأدوية — بعد الإجراءات وقبل النظام الغذائي: الترتيب يتبع مسار
			    التفكير السريري (ماذا فُعل ← بماذا يُعالَج ← كيف يُتابَع). القسم يختفي
			    كليًّا حين تكون وحدة الصيدلية مطفأة. */}
			<MedicationsPanel
				appointmentId={appointmentId}
				patientId={appointment?.patient.id ?? null}
				disabled={disabled}
			/>

			<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
				<Field>
					<div className="flex items-center justify-between">
						<Label htmlFor="dietPlan">النظام الغذائي</Label>
						<button
							type="button"
							aria-label="إدخال صوتي (قريباً)"
							title="قريباً"
							disabled
							className="cursor-not-allowed text-primary opacity-60"
						>
							<IconMicrophone className="size-4" />
						</button>
					</div>
					<Textarea
						id="dietPlan"
						placeholder="مثال: طعام قليل الدهون، وجبات صغيرة متكررة..."
						className="min-h-36 resize-none"
						disabled={disabled}
						{...form.register("dietPlan")}
					/>
				</Field>

				<Field>
					<div className="flex items-center justify-between">
						<Label htmlFor="monitoringPlan">المراقبة والمتابعة</Label>
						<button
							type="button"
							aria-label="إدخال صوتي (قريباً)"
							title="قريباً"
							disabled
							className="cursor-not-allowed text-primary opacity-60"
						>
							<IconMicrophone className="size-4" />
						</button>
					</div>
					<Textarea
						id="monitoringPlan"
						placeholder="مثال: مراقبة القيء والإسهال، قياس الحرارة يومياً..."
						className="min-h-36 resize-none"
						disabled={disabled}
						{...form.register("monitoringPlan")}
					/>
				</Field>
			</div>

			{/* خطط علاجية — تعيين ومتابعة اشتراكات خطط الرعاية للطفل (بدلاً من زيارات المتابعة) */}
			<CarePlanEnrollmentsPanel
				patientId={appointment?.patient.id ?? null}
				sourceAppointmentId={appointmentId}
			/>
		</div>
	);
}
