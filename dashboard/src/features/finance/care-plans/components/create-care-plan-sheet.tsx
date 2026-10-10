import {
	IconChevronDown,
	IconPencil,
	IconPlus,
	IconSparkles,
	IconStethoscope,
	IconTrash,
	IconX,
} from "@tabler/icons-react";
import { useHotkey } from "@tanstack/react-hotkeys";
import { useNavigate } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { FormFooter } from "@/components/common/form-footer";
import { FormHeader } from "@/components/common/form-header";
import { RequiredMark } from "@/components/common/required-mark";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { useServicesForPicker } from "@/features/appointments/hooks/use-services-for-picker";
import { MedicationsSettingsPanel } from "@/features/finance/care-plans/components/medications-settings-panel";
import { MultiVisitPanel } from "@/features/finance/care-plans/components/multi-visit-panel";
import { UnsavedCarePlanChangesDialog } from "@/features/finance/care-plans/components/unsaved-care-plan-changes-dialog";
import {
	CARE_PLAN_REQUIRED_FIELDS,
	type CarePlanMedicationItem,
	type CarePlanVisit,
	CREATE_CARE_PLAN_FORM_DEFAULTS,
	type CreateCarePlanFormValues,
	createEmptyVisit,
	fromCarePlanDetailResponse,
	getModifiedCarePlanFields,
	toCreateCarePlanPayload,
	VISIT_DURATION_OPTIONS,
} from "@/features/finance/care-plans/data/care-plans";
import { useCarePlan } from "@/features/finance/care-plans/hooks/use-care-plan";
import { useCarePlanMutations } from "@/features/finance/care-plans/hooks/use-care-plan-mutations";
import { useAnimalStrains } from "@/features/settings/animals/hooks/use-animal-strains";
import { useAnimalTypes } from "@/features/settings/animals/hooks/use-animal-types";
import { cn } from "@/lib/utils";
import type { CarePlanListItemResponse } from "@/server/care-plans/care-plans.type";

function SectionTitle({ children }: { children: string }) {
	return (
		<div
			className="flex items-center gap-1.5"
			dir="rtl"
		>
			<span className="text-[11px] font-semibold text-foreground whitespace-nowrap">
				{children}
			</span>
			<span className="h-px flex-1 bg-border" />
		</div>
	);
}

function IconChecklist({ className }: { className?: string }) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="15"
			height="14"
			viewBox="0 0 15 14"
			fill="none"
			className={className}
			aria-hidden="true"
		>
			<g clipPath="url(#clip0_1927_30092)">
				<path
					d="M10.6406 13.3438H4.35938C3.30469 13.3438 2.46094 12.5563 2.46094 11.5719V3.52188C2.46094 2.5375 3.30469 1.75 4.35938 1.75H4.80469C4.99219 1.75 5.15625 1.90313 5.15625 2.07812C5.15625 2.25313 4.99219 2.40625 4.80469 2.40625H4.35938C3.70313 2.40625 3.16406 2.90938 3.16406 3.52188V11.5719C3.16406 12.1844 3.70313 12.6875 4.35938 12.6875H10.6406C11.2969 12.6875 11.8359 12.1844 11.8359 11.5719V3.52188C11.8359 2.90938 11.2969 2.40625 10.6406 2.40625H10.1953C10.0078 2.40625 9.84375 2.25313 9.84375 2.07812C9.84375 1.90313 10.0078 1.75 10.1953 1.75H10.6406C11.6953 1.75 12.5391 2.5375 12.5391 3.52188V11.5719C12.5391 12.5563 11.6953 13.3438 10.6406 13.3438Z"
					fill="#9B9B9D"
				/>
				<path
					d="M9.70313 0.984375H5.29688C5.02505 0.984375 4.80469 1.19004 4.80469 1.44375V2.16562C4.80469 2.41933 5.02505 2.625 5.29688 2.625H9.70313C9.97495 2.625 10.1953 2.41933 10.1953 2.16562V1.44375C10.1953 1.19004 9.97495 0.984375 9.70313 0.984375Z"
					fill="#9B9B9D"
				/>
				<path
					d="M9.70313 2.95352H5.27344C4.80469 2.95352 4.42969 2.60352 4.42969 2.16602V1.42227C4.42969 0.984766 4.80469 0.634766 5.27344 0.634766H9.70313C10.1719 0.634766 10.5469 0.984766 10.5469 1.42227V2.16602C10.5469 2.60352 10.1719 2.95352 9.70313 2.95352ZM5.29688 1.31289C5.22656 1.31289 5.15625 1.37852 5.15625 1.44414V2.18789C5.15625 2.25352 5.22656 2.31914 5.29688 2.31914H9.72656C9.79688 2.31914 9.86719 2.25352 9.86719 2.18789V1.44414C9.86719 1.37852 9.79688 1.31289 9.72656 1.31289H5.29688Z"
					fill="#9B9B9D"
				/>
				<path
					d="M10.8984 9.1875H4.33594C4.14844 9.1875 3.98438 9.03438 3.98438 8.85938C3.98438 8.68438 4.14844 8.53125 4.33594 8.53125H10.8984C11.0859 8.53125 11.25 8.68438 11.25 8.85938C11.25 9.03438 11.0859 9.1875 10.8984 9.1875Z"
					fill="#9B9B9D"
				/>
				<path
					d="M10.8984 10.9375H4.33594C4.14844 10.9375 3.98438 10.7844 3.98438 10.6094C3.98438 10.4344 4.14844 10.2812 4.33594 10.2812H10.8984C11.0859 10.2812 11.25 10.4344 11.25 10.6094C11.25 10.7844 11.0859 10.9375 10.8984 10.9375Z"
					fill="#9B9B9D"
				/>
				<path
					d="M7.5 7.21875C7.3125 7.21875 7.14844 7.06562 7.14844 6.89062V4.04688C7.14844 3.87188 7.3125 3.71875 7.5 3.71875C7.6875 3.71875 7.85156 3.87188 7.85156 4.04688V6.89062C7.85156 7.06562 7.6875 7.21875 7.5 7.21875Z"
					fill="#9B9B9D"
				/>
				<path
					d="M9.02344 5.79688H5.97656C5.78906 5.79688 5.625 5.64375 5.625 5.46875C5.625 5.29375 5.78906 5.14062 5.97656 5.14062H9.02344C9.21094 5.14062 9.375 5.29375 9.375 5.46875C9.375 5.64375 9.21094 5.79688 9.02344 5.79688Z"
					fill="#9B9B9D"
				/>
			</g>
			<defs>
				<clipPath id="clip0_1927_30092">
					<rect
						width="15"
						height="14"
						fill="white"
					/>
				</clipPath>
			</defs>
		</svg>
	);
}

function IconBox({ className }: { className?: string }) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="14"
			height="14"
			viewBox="0 0 14 14"
			fill="none"
			className={className}
			aria-hidden="true"
		>
			<g clipPath="url(#clip0_1996_15247)">
				<path
					d="M6.41309 12.6685C6.59034 12.7709 6.79142 12.8248 6.99609 12.8248C7.20077 12.8248 7.40184 12.7709 7.5791 12.6685L11.6602 10.3365C11.8372 10.2343 11.9843 10.0873 12.0866 9.91024C12.189 9.73321 12.243 9.53238 12.2432 9.32791V4.66384C12.243 4.45937 12.189 4.25854 12.0866 4.08151C11.9843 3.90448 11.8372 3.75748 11.6602 3.65524L7.5791 1.32321C7.40184 1.22087 7.20077 1.16699 6.99609 1.16699C6.79142 1.16699 6.59034 1.22087 6.41309 1.32321L2.33203 3.65524C2.15495 3.75748 2.00787 3.90448 1.90554 4.08151C1.80321 4.25854 1.74923 4.45937 1.74902 4.66384V9.32791C1.74923 9.53238 1.80321 9.73321 1.90554 9.91024C2.00787 10.0873 2.15495 10.2343 2.33203 10.3365L6.41309 12.6685Z"
					stroke="#9B9B9D"
					strokeWidth="1.16602"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<path
					d="M6.99609 12.8262V6.99609"
					stroke="#9B9B9D"
					strokeWidth="1.16602"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<path
					d="M1.91797 4.08105L6.99597 6.99609L12.074 4.08105"
					stroke="#9B9B9D"
					strokeWidth="1.16602"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</g>
			<defs>
				<clipPath id="clip0_1996_15247">
					<rect
						width="13.9922"
						height="13.9922"
						fill="white"
					/>
				</clipPath>
			</defs>
		</svg>
	);
}

function ToggleSettingRow({
	icon,
	actionLabel,
	title,
	description,
	onAction,
	onDelete,
	readOnly,
}: {
	icon: ReactNode;
	actionLabel: string;
	title: string;
	description: string;
	onAction: () => void;
	onDelete?: () => void;
	readOnly?: boolean;
}) {
	return (
		<div
			className="flex items-center justify-between gap-3 rounded-[4px] border bg-muted/40 px-3 py-2.5"
			dir="rtl"
		>
			<button
				type="button"
				onClick={onAction}
				disabled={readOnly}
				className="flex size-7.25 shrink-0 items-center justify-center rounded-full border bg-muted disabled:opacity-50"
			>
				{icon}
			</button>
			<div className="flex flex-1 items-center justify-between gap-3">
				<div className="space-y-0.5 text-right">
					<p className="text-xs font-semibold">{title}</p>
					<p className="text-[10px] text-muted-foreground">{description}</p>
				</div>
				{onDelete ? (
					<div className="flex items-center gap-1.5">
						<Button
							type="button"
							size="sm"
							variant="outline"
							className="border-primary text-primary hover:bg-primary/5"
							onClick={onAction}
							disabled={readOnly}
						>
							<IconPencil className="size-3" />
							تعديل
						</Button>
						<Button
							type="button"
							size="sm"
							variant="outline"
							className="border-destructive text-destructive hover:bg-destructive/5"
							onClick={onDelete}
							disabled={readOnly}
						>
							<IconTrash className="size-3" />
							حذف
						</Button>
					</div>
				) : (
					<Button
						type="button"
						size="sm"
						variant="outline"
						className="border-primary text-primary hover:bg-primary/5"
						onClick={onAction}
						disabled={readOnly}
					>
						<IconPlus className="size-3" />
						{actionLabel}
					</Button>
				)}
			</div>
		</div>
	);
}

export function CreateCarePlanSheet({
	open,
	onOpenChange,
	plan,
	readOnly = false,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	plan?: CarePlanListItemResponse | null;
	readOnly?: boolean;
}) {
	const isEditing = !!plan;

	const [values, setValues] = useState<CreateCarePlanFormValues>(
		CREATE_CARE_PLAN_FORM_DEFAULTS,
	);
	const [continueAdding, setContinueAdding] = useState(false);
	const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
	const [isGeneratingPlanWithAi, setIsGeneratingPlanWithAi] = useState(false);
	const [aiSuggestionAvailable, setAiSuggestionAvailable] = useState(false);
	const [multiVisitOpen, setMultiVisitOpen] = useState(false);
	const [visits, setVisits] = useState<CarePlanVisit[]>([]);
	const [planMedications, setPlanMedications] = useState<CarePlanMedicationItem[]>([]);
	const [medicationsPanelFor, setMedicationsPanelFor] = useState<"plan" | string | null>(null);
	const [unsavedOpen, setUnsavedOpen] = useState(false);
	const [serviceOpen, setServiceOpen] = useState(false);

	const navigate = useNavigate();
	const { services, accordionGroups, isLoading: servicesLoading } = useServicesForPicker();
	const selectedService = services.find((s) => s.id === values.serviceId);
	const { animalTypes, isLoading: typesLoading } = useAnimalTypes();
	const { strains, isLoading: strainsLoading } = useAnimalStrains();
	const { create, update, isCreating, isUpdating } = useCarePlanMutations();
	const { plan: planDetail, isLoading: isLoadingDetail } = useCarePlan(
		isEditing ? plan.id : undefined,
	);
	const isSaving = isCreating || isUpdating;

	const filteredStrains = values.animalTypeId
		? strains.filter((s) => s.animalTypeId === values.animalTypeId)
		: strains;

	useEffect(() => {
		if (!open) return;
		if (!isEditing) {
			setValues(CREATE_CARE_PLAN_FORM_DEFAULTS);
			setVisits([]);
			setPlanMedications([]);
		}
		setContinueAdding(false);
		setIsGeneratingDescription(false);
		setIsGeneratingPlanWithAi(false);
		setMultiVisitOpen(false);
		setMedicationsPanelFor(null);
	}, [open, isEditing]);

	const [baseline, setBaseline] = useState<{
		values: CreateCarePlanFormValues;
		visitsKey: string;
		medicationsKey: string;
	} | null>(null);

	useEffect(() => {
		if (!open || !isEditing || !planDetail) return;
		const mapped = fromCarePlanDetailResponse(planDetail);
		setValues(mapped.values);
		setVisits(mapped.visits);
		setPlanMedications(mapped.planMedications);
		setBaseline({
			values: mapped.values,
			visitsKey: JSON.stringify(mapped.visits),
			medicationsKey: JSON.stringify(mapped.planMedications),
		});
	}, [open, isEditing, planDetail]);

	const setField = <K extends keyof CreateCarePlanFormValues>(
		key: K,
		value: CreateCarePlanFormValues[K],
	) => setValues((prev) => ({ ...prev, [key]: value }));

	const handleGenerateDescription = () => {
		// عرض توضيحي فقط — لا يوجد اتصال حقيقي بالذكاء الاصطناعي حتى الآن
		if (!values.name.trim()) {
			toast.info("أدخل اسم الخطة أولاً لتوليد وصف للخطة بدقة");
			return;
		}
		setIsGeneratingDescription(true);
		setTimeout(() => {
			setField("notes", `خطة رعاية شاملة تتضمن متابعة دورية لـ"${values.name.trim()}".`);
			setIsGeneratingDescription(false);
		}, 1200);
	};

	const handleOpenMultiVisit = () => {
		if (readOnly) return;
		if (visits.length === 0) {
			setVisits([createEmptyVisit()]);
		}
		setMultiVisitOpen(true);
	};

	const handleGeneratePlanWithAi = () => {
		// عرض توضيحي فقط — لا يوجد اتصال حقيقي بالذكاء الاصطناعي حتى الآن
		if (!values.name.trim()) {
			toast.info("أدخل اسم الخطة أولاً لتوليد الزيارات بدقة");
			return;
		}
		setIsGeneratingPlanWithAi(true);
		setTimeout(() => {
			setVisits([createEmptyVisit()]);
			setIsGeneratingPlanWithAi(false);
			setAiSuggestionAvailable(true);
		}, 1200);
	};

	const visitsSummary = useMemo(() => {
		const names = visits
			.map((v) => services.find((s) => s.id === v.serviceId)?.name)
			.filter((name): name is string => !!name);
		return names.join(" ← ");
	}, [visits, services]);

	const currentMedications =
		medicationsPanelFor === "plan"
			? planMedications
			: (visits.find((v) => v.id === medicationsPanelFor)?.medications ?? []);

	const handleMedicationsChange = (items: CarePlanMedicationItem[]) => {
		if (medicationsPanelFor === "plan") {
			setPlanMedications(items);
		} else if (medicationsPanelFor) {
			setVisits((prev) =>
				prev.map((v) => (v.id === medicationsPanelFor ? { ...v, medications: items } : v)),
			);
		}
	};

	const filledCount = useMemo(
		() => CARE_PLAN_REQUIRED_FIELDS.filter((f) => !!values[f]).length,
		[values],
	);
	const progress = Math.round((filledCount / CARE_PLAN_REQUIRED_FIELDS.length) * 100);
	const isValid = filledCount === CARE_PLAN_REQUIRED_FIELDS.length;

	const modifiedFields = useMemo(() => {
		if (isEditing) {
			if (!baseline) return [];
			return getModifiedCarePlanFields(
				values,
				JSON.stringify(visits) !== baseline.visitsKey,
				JSON.stringify(planMedications) !== baseline.medicationsKey,
				baseline.values,
			);
		}
		return getModifiedCarePlanFields(values, visits.length > 0, planMedications.length > 0);
	}, [values, visits, planMedications, isEditing, baseline]);
	const isDirty = !readOnly && modifiedFields.length > 0;

	// عند محاولة الإغلاق مع وجود تغييرات غير محفوظة → نطلب التأكيد بدل الإغلاق المباشر
	const requestClose = () => {
		if (isDirty) {
			setUnsavedOpen(true);
			return;
		}
		onOpenChange(false);
	};

	const discardAndClose = () => {
		setUnsavedOpen(false);
		onOpenChange(false);
	};

	const handleSubmit = async () => {
		const payload = toCreateCarePlanPayload(values, visits, planMedications);
		try {
			if (isEditing && plan) {
				await update(plan.id, payload);
				onOpenChange(false);
				return;
			}
			await create(payload);
			if (continueAdding) {
				setValues(CREATE_CARE_PLAN_FORM_DEFAULTS);
				setVisits([]);
				setPlanMedications([]);
			} else {
				onOpenChange(false);
			}
		} catch {
			// toast handled by hook
		}
	};

	useHotkey(
		"Mod+Enter",
		() => {
			if (!isValid || readOnly) return;
			handleSubmit();
		},
		{ enabled: open },
	);

	return (
		<Sheet
			open={open}
			onOpenChange={(isOpen) => {
				if (!isOpen) {
					requestClose();
					return;
				}
				onOpenChange(isOpen);
			}}
		>
			<SheetContent
				side="left"
				dir="rtl"
				showCloseButton={false}
				className={cn(
					"w-full flex-row items-stretch gap-3 border-none! bg-transparent! p-0 shadow-none! sm:max-w-xl!",
					multiVisitOpen &&
						!medicationsPanelFor &&
						"sm:max-w-[calc(var(--container-xl)*2+12px)]!",
					multiVisitOpen &&
						medicationsPanelFor &&
						"sm:max-w-[calc(var(--container-xl)*3+24px)]!",
					!multiVisitOpen &&
						medicationsPanelFor &&
						"sm:max-w-[calc(var(--container-xl)*2+12px)]!",
				)}
			>
				<div
					className="relative order-2 flex min-h-0 flex-1 flex-col rounded-lg border bg-popover"
					dir="rtl"
				>
					<button
						type="button"
						onClick={requestClose}
						className="absolute top-3 left-3 flex size-7 items-center justify-center rounded hover:bg-muted"
					>
						<IconX className="size-4" />
						<span className="sr-only">إغلاق</span>
					</button>
					{/* هذه اللوحة بحالة useState بلا مخطط Zod، فنمرّر العدّادات المحسوبة يدويًا */}
					<FormHeader
						title={readOnly ? "عرض خطة" : isEditing ? "تعديل خطة" : "أنشئ خطة جديد"}
						identity={
							isEditing && values.name ? { name: values.name, code: plan?.code } : null
						}
						changesCount={planDetail?.editsCount ?? plan?.editsCount ?? 0}
						progress={
							readOnly
								? null
								: {
										filledCount,
										requiredCount: CARE_PLAN_REQUIRED_FIELDS.length,
										progress,
										isComplete: progress === 100,
									}
						}
					/>

					<div className="flex-1 space-y-5 overflow-y-auto p-4">
						{/* ─── معلومات الأساسية ─── */}
						<div className="space-y-3">
							<SectionTitle>معلومات الأساسية</SectionTitle>

							<div className="flex items-start gap-3">
								<Field className="w-28 shrink-0">
									<Label className="justify-start gap-1 text-[11px]">
										المعرّف
										{!isEditing && (
											<span className="text-[10px] font-normal text-muted-foreground">
												يُولد تلقائياً
											</span>
										)}
									</Label>
									<Input
										placeholder="مثال: CP-0001"
										value={plan?.code ?? ""}
										disabled
										className="bg-muted/40"
									/>
								</Field>

								<Field className="flex-1">
									<Label className="justify-start gap-1.5">
										اسم الخطة
										<RequiredMark />
									</Label>
									<Input
										placeholder="مثال: خطة تطعيم الجراء"
										value={values.name}
										disabled={readOnly}
										onChange={(e) => setField("name", e.target.value)}
									/>
								</Field>
							</div>

							<Field>
								<Label className="justify-start gap-1.5">
									نوع الدورة
									<RequiredMark />
								</Label>
								<Popover
									open={serviceOpen}
									onOpenChange={setServiceOpen}
								>
									<PopoverTrigger asChild>
										<Button
											type="button"
											variant="outline"
											disabled={servicesLoading || readOnly}
											className="w-full justify-start gap-2 font-normal"
										>
											<IconStethoscope className="size-4" />
											{selectedService ? selectedService.name : "اختر..."}
										</Button>
									</PopoverTrigger>
									<PopoverContent
										align="start"
										dir="rtl"
										className="w-(--radix-popover-trigger-width) p-0"
									>
										<div className="flex items-center justify-between gap-2 border-b p-2">
											<Label className="text-xs text-muted-foreground">اختر الدورة...</Label>
											<Button
												type="button"
												variant="ghost"
												className="h-7 gap-1 text-xs"
												onClick={() => {
													setServiceOpen(false);
													void navigate({ to: "/management/settings/services" });
												}}
											>
												<IconPlus className="size-3.5" />
												إضافة دورة جديدة
											</Button>
										</div>
										<div className="max-h-96 space-y-1 overflow-y-auto p-2">
											{servicesLoading ? (
												<p className="py-4 text-center text-sm text-muted-foreground">
													جاري التحميل...
												</p>
											) : (
												accordionGroups.map((cat) => {
													const { items } = cat;
													return (
														<Collapsible key={cat.id}>
															<CollapsibleTrigger
																type="button"
																dir="rtl"
																className="flex w-full items-center justify-between gap-2 rounded-md border border-input/40 bg-input/20 px-3 py-2 text-sm font-medium hover:bg-accent"
															>
																<IconChevronDown className="size-4 text-muted-foreground transition-transform data-[state=open]:rotate-180" />
																<span className="flex-1 text-right">{cat.name}</span>
															</CollapsibleTrigger>
															<CollapsibleContent className="space-y-1 pt-1.5 ps-2">
																{items.length === 0 ? (
																	<p className="px-2 py-2 text-xs text-muted-foreground">
																		لا توجد دورات
																	</p>
																) : (
																	items.map((item) => {
																		const checked = values.serviceId === item.id;
																		const disabled = !item.isActive || item.duration == null;
																		return (
																			<button
																				key={item.id}
																				type="button"
																				disabled={disabled}
																				onClick={() => {
																					setField("serviceId", checked ? "" : item.id);
																					setServiceOpen(false);
																				}}
																				className={cn(
																					"flex w-full items-start gap-3 rounded-md p-2 text-start hover:bg-accent",
																					disabled && "cursor-not-allowed opacity-50",
																				)}
																			>
																				<Checkbox
																					checked={checked}
																					disabled={disabled}
																					onCheckedChange={() => undefined}
																					className="mt-0.5"
																				/>
																				<div className="min-w-0 flex-1">
																					<p className="truncate text-sm font-medium">
																						{item.name}
																					</p>
																					<p className="text-xs text-muted-foreground">
																						{item.price ?? 0} ر.س · {item.duration ?? 0} دقيقة
																					</p>
																				</div>
																			</button>
																		);
																	})
																)}
															</CollapsibleContent>
														</Collapsible>
													);
												})
											)}
										</div>
									</PopoverContent>
								</Popover>
							</Field>

							<div className="grid grid-cols-2 gap-3">
								<Field>
									<Label className="justify-start gap-1.5">
										نوع الطفل المستفيد
										<RequiredMark />
									</Label>
									<Select
										value={values.animalTypeId}
										onValueChange={(v) => {
											setField("animalTypeId", v);
											if (values.animalStrainId) setField("animalStrainId", undefined);
										}}
										disabled={typesLoading || readOnly}
										dir="rtl"
									>
										<SelectTrigger className="w-full">
											<SelectValue placeholder="اختر..." />
										</SelectTrigger>
										<SelectContent dir="rtl">
											{animalTypes.map((type) => (
												<SelectItem
													key={type.id}
													value={type.id}
													className="text-right"
												>
													{type.arName}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</Field>

								<Field>
									<Label className="justify-start gap-1.5">
										السلالة المستفيد
										<RequiredMark />
									</Label>
									<Select
										value={values.animalStrainId}
										onValueChange={(v) => setField("animalStrainId", v)}
										disabled={!values.animalTypeId || strainsLoading || readOnly}
										dir="rtl"
									>
										<SelectTrigger className="w-full">
											<SelectValue
												placeholder={values.animalTypeId ? "اختر..." : "اختر النوع أولاً"}
											/>
										</SelectTrigger>
										<SelectContent dir="rtl">
											{filteredStrains.map((strain) => (
												<SelectItem
													key={strain.id}
													value={strain.id}
													className="text-right"
												>
													{strain.arName}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</Field>
							</div>

							<Field>
								<div
									className="flex items-center justify-between"
									dir="rtl"
								>
									<span className="text-xs font-medium">ملاحظات</span>
									<span className="text-[10px] text-muted-foreground">
										{values.notes.length}/200
									</span>
								</div>
								<div className="relative">
									<Textarea
										placeholder={
											isGeneratingDescription ? "جاري توليد الوصف..." : "أضف وصف للخطة..."
										}
										className="min-h-20 pl-7"
										maxLength={200}
										disabled={isGeneratingDescription || readOnly}
										value={values.notes}
										onChange={(e) => setField("notes", e.target.value)}
									/>
									{!readOnly && (
										<button
											type="button"
											onClick={handleGenerateDescription}
											disabled={isGeneratingDescription}
											title="توليد وصف بالذكاء الاصطناعي"
											className="absolute top-2 left-2 flex size-5 items-center justify-center rounded text-primary hover:bg-primary/10 disabled:opacity-50"
										>
											<IconSparkles
												className={cn("size-3.5", isGeneratingDescription && "animate-pulse")}
											/>
										</button>
									)}
								</div>
							</Field>
						</div>

						{/* ─── تعيين الزيارات المتعددة ─── */}
						<div className="space-y-3">
							<SectionTitle>تعين الزيارات المتعددة</SectionTitle>

							<ToggleSettingRow
								icon={<IconChecklist className="size-3.5" />}
								actionLabel="إعداد"
								title="تعين زيارات متعددة"
								description={
									visitsSummary ||
									"قم بإنشاء زيارات متعددة إذا كانت العلاج يتطلب زيارات متابعة متكررة."
								}
								onAction={handleOpenMultiVisit}
								readOnly={readOnly}
							/>
							{visits.length > 0 && (
								<p className="text-[10px] text-muted-foreground">
									تم تعيين {visits.length} زيارات —{" "}
									{visits.filter((v) => v.serviceId || v.consultationTypeId).length} مكتملة
								</p>
							)}

							<div className="grid grid-cols-2 gap-3">
								<Field>
									<Label className="justify-start gap-1.5">
										السعر
										<RequiredMark />
									</Label>
									<InputGroup className="h-10">
										<InputGroupInput
											type="number"
											min={0}
											placeholder="00"
											value={values.price}
											disabled={readOnly}
											onChange={(e) => setField("price", e.target.value)}
										/>
										<InputGroupAddon align="inline-end">ر.س</InputGroupAddon>
									</InputGroup>
									<p className="text-[10px] text-muted-foreground">
										سعر شامل جميع زيارات العلاج
									</p>
								</Field>

								<Field>
									<Label className="justify-start gap-1.5">
										المدة التقديرية
										<RequiredMark />
									</Label>
									<Select
										value={values.visitDuration}
										onValueChange={(v) => setField("visitDuration", v)}
										disabled={readOnly}
										dir="rtl"
									>
										<SelectTrigger className="w-full">
											<SelectValue placeholder="اختر..." />
										</SelectTrigger>
										<SelectContent dir="rtl">
											{VISIT_DURATION_OPTIONS.map((opt) => (
												<SelectItem
													key={opt.value}
													value={opt.value}
													className="text-right"
												>
													{opt.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<p className="text-[10px] text-muted-foreground">مدة الزيارة الواحدة</p>
								</Field>
							</div>
						</div>

						{/* ─── معدل النجاح المتوقع ─── */}
						<div className="space-y-2">
							<div
								className="flex items-center justify-between"
								dir="rtl"
							>
								<span className="text-xs font-medium">معدل النجاح المتوقع</span>
								<span className="text-[10px] font-semibold text-primary">0%</span>
							</div>
							<div className="h-[5px] w-full overflow-hidden rounded-full bg-muted" />
						</div>

						{/* ─── إعدادات الأدوية والمستلزمات ─── */}
						<ToggleSettingRow
							icon={<IconBox className="size-3.5" />}
							actionLabel="إضافة"
							title="إعدادات الأدوية والمستلزمات المستخدمه"
							description="حدد والمستلزمات والأدوات المتوقع استخدمها في الإجراء الطبي وخصمها مباشر من المخزون"
							onAction={() => setMedicationsPanelFor("plan")}
							onDelete={planMedications.length > 0 ? () => setPlanMedications([]) : undefined}
							readOnly={readOnly}
						/>
					</div>

					{/* Footer */}
					<FormFooter
						continueAdding={continueAdding}
						onContinueAddingChange={readOnly || isEditing ? undefined : setContinueAdding}
						disabled={isSaving}
						showShortcut={!readOnly}
					>
						<Button
							type="button"
							size="sm"
							variant="outline"
							onClick={requestClose}
							disabled={isSaving}
						>
							{readOnly ? "إغلاق" : "إلغاء"}
						</Button>
						{!readOnly && (
							<Button
								type="button"
								size="sm"
								disabled={!isValid || isSaving || (isEditing && isLoadingDetail)}
								onClick={handleSubmit}
							>
								{isEditing ? "حفظ التعديلات" : "حفظ الخطة"}
							</Button>
						)}
					</FormFooter>
				</div>

				{multiVisitOpen && (
					<MultiVisitPanel
						visits={visits}
						onChange={setVisits}
						onBack={() => setMultiVisitOpen(false)}
						onSave={() => setMultiVisitOpen(false)}
						onOpenMedications={(visitId) => setMedicationsPanelFor(visitId)}
						isGeneratingWithAi={isGeneratingPlanWithAi}
						onGenerateWithAi={handleGeneratePlanWithAi}
						aiSuggestionAvailable={aiSuggestionAvailable}
					/>
				)}

				{medicationsPanelFor && (
					<MedicationsSettingsPanel
						items={currentMedications}
						onChange={handleMedicationsChange}
						onBack={() => setMedicationsPanelFor(null)}
						onSave={() => setMedicationsPanelFor(null)}
					/>
				)}
			</SheetContent>

			<UnsavedCarePlanChangesDialog
				open={unsavedOpen}
				planName={values.name || undefined}
				planCode={plan?.code}
				modifiedFields={modifiedFields}
				onDiscard={discardAndClose}
				onResume={() => setUnsavedOpen(false)}
			/>
		</Sheet>
	);
}
