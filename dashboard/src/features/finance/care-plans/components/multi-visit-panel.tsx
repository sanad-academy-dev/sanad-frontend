import {
	IconArrowNarrowDown,
	IconArrowNarrowUp,
	IconChevronDown,
	IconMinus,
	IconPlus,
	IconSettings,
	IconSparkles,
	IconStethoscope,
	IconTrash,
} from "@tabler/icons-react";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { RequiredMark } from "@/components/common/required-mark";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Field } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useServicesForPicker } from "@/features/appointments/hooks/use-services-for-picker";
import {
	type CarePlanVisit,
	createEmptyVisit,
	INTERVAL_UNIT_OPTIONS,
	MOCK_VISIT_AI_SUGGESTION,
	VISIT_DURATION_OPTIONS,
} from "@/features/finance/care-plans/data/care-plans";
import { useInventory } from "@/features/inventory/hooks/use-inventory";
import { useConsultationTypes } from "@/features/settings/consultation-types/hooks/use-consultation-types";
import type { CarePlanIntervalUnit } from "@/generated/prisma/enums";
import { cn } from "@/lib/utils";

function IconArrowFromRight({ className }: { className?: string }) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="13"
			height="13"
			viewBox="0 0 13 13"
			fill="none"
			className={className}
			aria-hidden="true"
		>
			<path
				d="M1.625 2.16667C1.48134 2.16667 1.34357 2.22373 1.24198 2.32532C1.1404 2.4269 1.08333 2.56467 1.08333 2.70833V10.2917C1.08333 10.4353 1.1404 10.5731 1.24198 10.6747C1.34357 10.7763 1.48134 10.8333 1.625 10.8333C1.76866 10.8333 1.90643 10.7763 2.00802 10.6747C2.1096 10.5731 2.16667 10.4353 2.16667 10.2917V2.70833C2.16667 2.56467 2.1096 2.4269 2.00802 2.32532C1.90643 2.22373 1.76866 2.16667 1.625 2.16667ZM11.8733 6.29417C11.8476 6.22768 11.8089 6.16693 11.7596 6.11542L9.59292 3.94875C9.54241 3.89825 9.48245 3.85818 9.41647 3.83085C9.35048 3.80352 9.27976 3.78945 9.20833 3.78945C9.13691 3.78945 9.06618 3.80352 9.0002 3.83085C8.93421 3.85818 8.87425 3.89825 8.82375 3.94875C8.77325 3.99925 8.73318 4.05921 8.70585 4.1252C8.67852 4.19118 8.66445 4.26191 8.66445 4.33333C8.66445 4.40476 8.67852 4.47548 8.70585 4.54147C8.73318 4.60746 8.77325 4.66741 8.82375 4.71792L10.0696 5.95833H3.79167C3.64801 5.95833 3.51023 6.0154 3.40865 6.11698C3.30707 6.21857 3.25 6.35634 3.25 6.5C3.25 6.64366 3.30707 6.78143 3.40865 6.88302C3.51023 6.9846 3.64801 7.04167 3.79167 7.04167H10.0696L8.82375 8.28208C8.77298 8.33244 8.73268 8.39235 8.70518 8.45835C8.67768 8.52436 8.66353 8.59516 8.66353 8.66667C8.66353 8.73817 8.67768 8.80897 8.70518 8.87498C8.73268 8.94099 8.77298 9.00089 8.82375 9.05125C8.8741 9.10202 8.93401 9.14232 9.00002 9.16982C9.06603 9.19732 9.13683 9.21147 9.20833 9.21147C9.27984 9.21147 9.35064 9.19732 9.41665 9.16982C9.48265 9.14232 9.54256 9.10202 9.59292 9.05125L11.7596 6.88458C11.8089 6.83307 11.8476 6.77232 11.8733 6.70583C11.9275 6.57396 11.9275 6.42604 11.8733 6.29417Z"
				fill="black"
				fillOpacity="0.62"
			/>
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

function AiSuggestionBanner({ onApply }: { onApply: () => void }) {
	const s = MOCK_VISIT_AI_SUGGESTION;
	return (
		<div
			className="space-y-2 rounded-[4px] border border-amber-300 bg-amber-50 px-3 py-2.5"
			dir="rtl"
		>
			<div className="flex items-center gap-1.5 text-amber-800">
				<IconSparkles className="size-3.5" />
				<span className="text-[11px] font-semibold">
					اقتراح AI: بناء على نوع الخطة وفئة الأليف والسلالة، نقترح:
				</span>
			</div>
			<div className="flex items-start gap-3">
				<Button
					type="button"
					size="sm"
					variant="outline"
					className="shrink-0 border-amber-400 bg-white text-amber-800 hover:bg-amber-100"
					onClick={onApply}
				>
					تطبيق
				</Button>
				<div className="space-y-1 text-[11px] text-amber-900">
					<p>
						<span className="font-medium">الدورة/الإجراء:</span> {s.serviceName}
						<span className="mx-2 font-medium">المدة التقديرية:</span> {s.duration} دقيقة
					</p>
					<p>
						<span className="font-medium">تفاصيل الزيارة:</span> {s.details}
					</p>
					<p>
						<span className="font-medium">المستلزمات:</span> {s.medicationNames.join("، ")}
					</p>
				</div>
			</div>
		</div>
	);
}

function VisitCard({
	visit,
	index,
	total,
	onChange,
	onRemove,
	onMoveUp,
	onMoveDown,
	onOpenMedications,
	aiSuggestionAvailable,
}: {
	visit: CarePlanVisit;
	index: number;
	total: number;
	onChange: (patch: Partial<CarePlanVisit>) => void;
	onRemove: () => void;
	onMoveUp: () => void;
	onMoveDown: () => void;
	onOpenMedications: () => void;
	aiSuggestionAvailable: boolean;
}) {
	const { services, accordionGroups, isLoading: servicesLoading } = useServicesForPicker();
	const { types: consultationTypes } = useConsultationTypes();
	const { inventory } = useInventory();
	const navigate = useNavigate();
	const [reasonOpen, setReasonOpen] = useState(false);
	const selectedService = services.find((s) => s.id === visit.serviceId);
	const selectedConsultationType = consultationTypes.find(
		(t) => t.id === visit.consultationTypeId,
	);

	const medicationNames = visit.medications
		.map((m) => inventory.find((i) => i.id === m.inventoryItemId)?.name)
		.filter((name): name is string => !!name);

	const isEmpty =
		!visit.serviceId && !visit.consultationTypeId && !visit.duration && !visit.details.trim();

	const applyAiSuggestion = () => {
		const s = MOCK_VISIT_AI_SUGGESTION;
		const suggestedService = services.find((svc) => svc.name === s.serviceName);
		onChange({
			serviceId: suggestedService?.id ?? visit.serviceId,
			duration: s.duration,
			details: s.details,
		});
	};

	return (
		<div
			className="flex items-start gap-2"
			dir="rtl"
		>
			<div className="flex flex-col gap-1 pt-1">
				<button
					type="button"
					onClick={onMoveUp}
					disabled={index === 0}
					className="flex size-7 items-center justify-center rounded-full border bg-muted disabled:opacity-30"
				>
					<IconArrowNarrowUp
						className="size-4"
						style={index !== 0 ? { color: "#6366F1" } : undefined}
					/>
				</button>
				<button
					type="button"
					onClick={onMoveDown}
					disabled={index === total - 1}
					className="flex size-7 items-center justify-center rounded-full border bg-muted disabled:opacity-30"
				>
					<IconArrowNarrowDown
						className="size-4"
						style={index !== total - 1 ? { color: "#6366F1" } : undefined}
					/>
				</button>
			</div>

			<div className="flex flex-1 flex-col gap-3 rounded-[4px] border bg-white">
				<div className="flex items-center justify-between border-b px-3 py-2">
					<div className="flex items-center gap-2">
						<span className="text-xs font-semibold">زيارة #{index + 1}</span>
						{visit.medications.length > 0 && (
							<span className="rounded-[4px] bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
								{visit.medications.length} مستلزمات
							</span>
						)}
					</div>
					{total > 1 && (
						<button
							type="button"
							onClick={onRemove}
							className="text-muted-foreground hover:text-destructive"
						>
							<IconTrash className="size-3.5" />
						</button>
					)}
				</div>

				<div className="space-y-3 px-3 pb-3">
					{isEmpty && aiSuggestionAvailable && (
						<AiSuggestionBanner onApply={applyAiSuggestion} />
					)}

					<Field>
						<Label className="justify-start gap-1.5">
							السبب / الدورات
							<RequiredMark />
						</Label>
						<Popover
							open={reasonOpen}
							onOpenChange={setReasonOpen}
						>
							<PopoverTrigger asChild>
								<Button
									type="button"
									variant="outline"
									className="w-full justify-start gap-2 font-normal"
								>
									<IconStethoscope className="size-4" />
									<span className="truncate">
										{selectedConsultationType
											? selectedConsultationType.name
											: "اختر السبب أو الدورات..."}
										{selectedService ? ` · ${selectedService.name}` : ""}
									</span>
								</Button>
							</PopoverTrigger>
							<PopoverContent
								align="start"
								dir="rtl"
								className="w-(--radix-popover-trigger-width) p-0"
							>
								<Tabs defaultValue="reason">
									<TabsList className="w-full rounded-b-none">
										<TabsTrigger value="reason">الكشوفات</TabsTrigger>
										<TabsTrigger value="services">الدورات</TabsTrigger>
									</TabsList>

									<TabsContent
										value="reason"
										className="max-h-72 overflow-y-auto p-2"
									>
										<div
											className="space-y-1"
											dir="rtl"
										>
											{consultationTypes
												.filter((t) => t.active)
												.map((t) => {
													const checked = visit.consultationTypeId === t.id;
													return (
														<button
															key={t.id}
															type="button"
															onClick={() => {
																onChange({
																	consultationTypeId: checked ? undefined : t.id,
																});
															}}
															className="flex w-full items-center justify-between gap-2 rounded-md p-2 text-start text-sm hover:bg-accent"
														>
															<span className="flex items-center gap-2">
																<Checkbox
																	checked={checked}
																	tabIndex={-1}
																	className="pointer-events-none"
																/>
																{t.name}
															</span>
															{t.price != null && (
																<span className="text-xs text-blue-500 tabular-nums">
																	{t.price.toLocaleString()} ر.س
																</span>
															)}
														</button>
													);
												})}
										</div>
									</TabsContent>

									<TabsContent
										value="services"
										className="max-h-72 overflow-y-auto p-2"
									>
										<div className="space-y-1">
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
																		const checked = visit.serviceId === item.id;
																		const disabled = !item.isActive || item.duration == null;
																		return (
																			<button
																				key={item.id}
																				type="button"
																				disabled={disabled}
																				onClick={() => {
																					onChange({
																						serviceId: checked ? undefined : item.id,
																					});
																				}}
																				className={cn(
																					"flex w-full items-start gap-3 rounded-md p-2 text-start hover:bg-accent",
																					disabled && "cursor-not-allowed opacity-50",
																				)}
																			>
																				<Checkbox
																					checked={checked}
																					disabled={disabled}
																					tabIndex={-1}
																					className="mt-0.5 pointer-events-none"
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
											<Button
												type="button"
												variant="ghost"
												className="w-full gap-1 text-xs"
												onClick={() => {
													setReasonOpen(false);
													void navigate({ to: "/management/settings/services" });
												}}
											>
												<IconPlus className="size-3.5" />
												إضافة دورة جديدة
											</Button>
										</div>
									</TabsContent>
								</Tabs>
							</PopoverContent>
						</Popover>
					</Field>

					<Field>
						<Label className="justify-start gap-1.5">المدة التقديرية</Label>
						<Select
							value={visit.duration}
							onValueChange={(v) => onChange({ duration: v })}
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
					</Field>

					<Field>
						<div
							className="flex items-center justify-between"
							dir="rtl"
						>
							<span className="text-xs font-medium">تفاصيل الزيارة</span>
							<span className="text-[10px] text-muted-foreground">
								{visit.details.length}/200
							</span>
						</div>
						<Textarea
							placeholder="مثال: الفحص السريري للحالة وتقييم الاستجابة للعلاج وتحديث الخطة العلاجية."
							className="min-h-20"
							maxLength={200}
							value={visit.details}
							onChange={(e) => onChange({ details: e.target.value })}
						/>
					</Field>

					<div
						className="flex items-center justify-between gap-3 rounded-[4px] border bg-muted/40 px-3 py-2.5"
						dir="rtl"
					>
						<button
							type="button"
							onClick={onOpenMedications}
							className="flex size-7.25 shrink-0 items-center justify-center rounded-full border bg-muted"
						>
							<IconBox className="size-3.5" />
						</button>
						<div className="flex flex-1 items-center justify-between gap-3">
							<div className="space-y-0.5 text-right">
								<p className="text-xs font-semibold">إعدادات الأدوية والمستلزمات المستخدمه</p>
								<p className="text-[10px] text-muted-foreground">
									{medicationNames.length > 0
										? medicationNames.join("، ")
										: "حدد والمستلزمات والأدوات المتوقع استخدمها في الإجراء الطبي وخصمها مباشر من المخزون"}
								</p>
							</div>
							<Button
								type="button"
								size="sm"
								variant="outline"
								className="border-primary text-primary hover:bg-primary/5"
								onClick={onOpenMedications}
							>
								<IconPlus className="size-3" />
								{visit.medications.length > 0 ? "تعديل" : "إضافة"}
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

function IntervalDivider({
	value,
	unit,
	onValueChange,
	onUnitChange,
}: {
	value: number;
	unit: CarePlanIntervalUnit;
	onValueChange: (value: number) => void;
	onUnitChange: (unit: CarePlanIntervalUnit) => void;
}) {
	return (
		<div
			className="flex items-center gap-3"
			dir="rtl"
		>
			<span className="h-px flex-1 bg-border" />
			<div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
				<span>الفاصل الزمني</span>
				<div className="flex items-center gap-1 rounded-[4px] border px-1.5 py-1">
					<button
						type="button"
						onClick={() => onValueChange(Math.max(0, value - 1))}
						className="flex size-4 items-center justify-center hover:text-foreground"
					>
						<IconMinus className="size-3" />
					</button>
					<span className="w-5 text-center tabular-nums">
						{value.toString().padStart(2, "0")}
					</span>
					<button
						type="button"
						onClick={() => onValueChange(value + 1)}
						className="flex size-4 items-center justify-center hover:text-foreground"
					>
						<IconPlus className="size-3" />
					</button>
				</div>
				<Select
					value={unit}
					onValueChange={(v) => onUnitChange(v as CarePlanIntervalUnit)}
					dir="rtl"
				>
					<SelectTrigger className="h-7 w-20 text-[11px]">
						<SelectValue />
					</SelectTrigger>
					<SelectContent dir="rtl">
						{INTERVAL_UNIT_OPTIONS.map((opt) => (
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
			</div>
			<span className="h-px flex-1 bg-border" />
		</div>
	);
}

export function MultiVisitPanel({
	visits,
	onChange,
	onBack,
	onSave,
	onOpenMedications,
	isGeneratingWithAi,
	onGenerateWithAi,
	aiSuggestionAvailable,
}: {
	visits: CarePlanVisit[];
	onChange: (visits: CarePlanVisit[]) => void;
	onBack: () => void;
	onSave: () => void;
	onOpenMedications: (visitId: string) => void;
	isGeneratingWithAi: boolean;
	onGenerateWithAi: () => void;
	aiSuggestionAvailable: boolean;
}) {
	const updateVisit = (id: string, patch: Partial<CarePlanVisit>) =>
		onChange(visits.map((v) => (v.id === id ? { ...v, ...patch } : v)));

	const removeVisit = (id: string) => onChange(visits.filter((v) => v.id !== id));

	const addVisit = () => onChange([...visits, createEmptyVisit()]);

	const moveVisit = (index: number, direction: -1 | 1) => {
		const target = index + direction;
		if (target < 0 || target >= visits.length) return;
		const next = [...visits];
		[next[index], next[target]] = [next[target], next[index]];
		onChange(next);
	};

	const completedCount = visits.filter((v) => v.serviceId || v.consultationTypeId).length;

	return (
		<div
			className="order-1 flex h-full flex-1 flex-col rounded-lg border bg-popover"
			dir="rtl"
		>
			{/* Header */}
			<div className="flex items-center justify-between gap-2 border-b px-4 py-2">
				<h2 className="text-sm font-bold text-foreground">تعيين زيارات متعددة</h2>
				<button
					type="button"
					onClick={onBack}
					className="flex size-6.25 items-center justify-center rounded-full bg-[#E5E5E5]"
				>
					<IconArrowFromRight className="size-3.25 scale-x-[-1]" />
				</button>
			</div>

			{/* Toolbar */}
			<div className="flex items-center justify-between gap-2 border-b p-3">
				<h3 className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
					<IconSettings className="size-3.5" />
					إعدادات الزيارات
				</h3>
				<div className="flex items-center gap-2">
					<Button
						type="button"
						size="sm"
						variant="outline"
						disabled={isGeneratingWithAi}
						onClick={onGenerateWithAi}
						className="h-9 border-[#4F6AE0] text-[#4F6AE0] hover:bg-[#4F6AE0]/5"
					>
						<IconSparkles className={cn("size-3.5", isGeneratingWithAi && "animate-pulse")} />
						{isGeneratingWithAi ? "جاري التوليد..." : "توليد خطة بال AI"}
					</Button>
					<Button
						type="button"
						size="sm"
						onClick={addVisit}
						className="h-9 border font-bold border-black bg-white text-black/90 hover:bg-white/80"
					>
						<IconPlus className="size-5" />
						إضافة زيارة جديدة
					</Button>
				</div>
			</div>

			{/* Visit list */}
			<div className="flex-1 space-y-3 overflow-y-auto p-3">
				{visits.map((visit, index) => (
					<div
						key={visit.id}
						className="space-y-3"
					>
						<VisitCard
							visit={visit}
							index={index}
							total={visits.length}
							onChange={(patch) => updateVisit(visit.id, patch)}
							onRemove={() => removeVisit(visit.id)}
							onMoveUp={() => moveVisit(index, -1)}
							onMoveDown={() => moveVisit(index, 1)}
							onOpenMedications={() => onOpenMedications(visit.id)}
							aiSuggestionAvailable={aiSuggestionAvailable}
						/>
						{index < visits.length - 1 && (
							<IntervalDivider
								value={visit.intervalValue}
								unit={visit.intervalUnit}
								onValueChange={(v) => updateVisit(visit.id, { intervalValue: v })}
								onUnitChange={(u) => updateVisit(visit.id, { intervalUnit: u })}
							/>
						)}
					</div>
				))}
			</div>

			{/* Footer */}
			<div className="flex items-center justify-between gap-3 border-t px-4 py-2">
				<Button
					type="button"
					size="sm"
					onClick={onSave}
				>
					حفظ
				</Button>
				<span className="text-[11px] text-muted-foreground">
					{completedCount}/{visits.length} مكملة
				</span>
			</div>
		</div>
	);
}
