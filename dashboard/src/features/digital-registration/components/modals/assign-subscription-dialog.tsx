import { useEffect, useMemo, useRef, useState } from "react";
import {
	IconBuildingBank,
	IconCheck,
	IconClock,
	IconCurrencyDollar,
	IconFilter,
	IconLoader2,
	IconSearch,
	IconStack2,
	IconStarFilled,
	IconX,
} from "@tabler/icons-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useClinicInfo } from "@/features/settings/services/hooks/use-clinic-info";
import {
	useDigitalRegistrationCapabilities,
	useQuickUpdateRequest,
} from "../../hooks/use-digital-registration";
import {
	useRegistrationSubscriptionPlans,
	type SubscriptionPlanCardItem,
} from "../../hooks/use-registration-plans";
import { resolveClinicCurrencySymbol } from "../../utils/payment-helpers";
import type { CampaignRequestItem } from "../../types/campaign-request.types";
import { RegistrationDrawerHeader } from "./registration-drawer-header";

export type { SubscriptionPlanCardItem };

interface AssignSubscriptionDialogProps {
	request: CampaignRequestItem | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	campaignId?: string;
	onSuccess?: (plan?: SubscriptionPlanCardItem, updatedRequest?: any) => void;
	isExpanded?: boolean;
}

export function AssignSubscriptionDialog({
	request,
	open,
	onOpenChange,
	campaignId = "",
	onSuccess,
	isExpanded = false,
}: AssignSubscriptionDialogProps) {
	const [search, setSearch] = useState("");
	const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
	const [filterType, setFilterType] = useState<"ALL" | "شهري" | "فصلي" | "سنوي">("ALL");
	const [sortBy, setSortBy] = useState<"DEFAULT" | "PRICE_ASC" | "PRICE_DESC" | "RATING">("DEFAULT");
	const [filterPopoverOpen, setFilterPopoverOpen] = useState(false);

	const scrollContainerRef = useRef<HTMLDivElement>(null);

	const { clinicInfo } = useClinicInfo();
	const currency = resolveClinicCurrencySymbol(clinicInfo?.currencyCode);
	const { capabilities } = useDigitalRegistrationCapabilities(campaignId);
	const { plans: allPlans, isLoading: isCarePlansLoading } = useRegistrationSubscriptionPlans();
	const quickUpdateMutation = useQuickUpdateRequest(campaignId);

	// مزامنة الخطة المحددة عند فتح اللوحة
	useEffect(() => {
		if (open && request) {
			setSelectedPlanId(request.subscriptionPlanId || null);
			setSearch("");
			setFilterType("ALL");
			setSortBy("DEFAULT");
		}
	}, [open, request]);

	// تصفية وترتيب الخطط
	const filteredPlans = useMemo(() => {
		let list = [...allPlans];
		const term = search.trim().toLowerCase();

		if (term) {
			list = list.filter(
				(p) =>
					p.name.toLowerCase().includes(term) ||
					(p.code && p.code.toLowerCase().includes(term)) ||
					p.description.toLowerCase().includes(term) ||
					p.type.toLowerCase().includes(term),
			);
		}

		if (filterType !== "ALL") {
			list = list.filter((p) => p.type === filterType);
		}

		if (sortBy === "PRICE_ASC") {
			list.sort((a, b) => a.price - b.price);
		} else if (sortBy === "PRICE_DESC") {
			list.sort((a, b) => b.price - a.price);
		} else if (sortBy === "RATING") {
			list.sort((a, b) => b.rating - a.rating);
		}

		return list;
	}, [allPlans, search, filterType, sortBy]);

	const selectedPlan = useMemo(
		() => allPlans.find((p) => p.id === selectedPlanId),
		[allPlans, selectedPlanId],
	);

	// إيقاف انتقال تمرير عجلة الماوس إلى الصفحة الخلفية
	const handleDrawerWheel = (e: React.WheelEvent<HTMLElement>) => {
		const target = e.target as HTMLElement | null;
		const scrollable = target?.closest(".overflow-y-auto") as HTMLElement | null;
		if (!scrollable) {
			e.stopPropagation();
			return;
		}
		const { scrollTop, scrollHeight, clientHeight } = scrollable;
		const isAtTop = scrollTop <= 0;
		const isAtBottom = Math.abs(scrollHeight - clientHeight - scrollTop) <= 1;
		if ((e.deltaY < 0 && isAtTop) || (e.deltaY > 0 && isAtBottom)) {
			e.preventDefault();
		}
		e.stopPropagation();
	};

	const handleAssign = () => {
		if (!request || !selectedPlan) {
			toast.error("يرجى اختيار باقة اشتراك أولاً");
			return;
		}
		if (!capabilities.canEdit) {
			toast.error("ليس لديك صلاحية تعديل بيانات الطلب");
			return;
		}

		quickUpdateMutation.mutate(
			{
				requestId: request.id,
				data: {
					subscriptionPlanId: selectedPlan.id,
					subscriptionPlanName: selectedPlan.name,
					subscriptionAmount: selectedPlan.price,
				},
			},
			{
				onSuccess: (updatedReq: any) => {
					toast.success(`تم تعيين خطة "${selectedPlan.name}" بنجاح`);
					onOpenChange(false);
					onSuccess?.(selectedPlan, updatedReq);
				},
				onError: (err: any) => {
					toast.error(err.message || "فشل تعيين خطة الاشتراك");
				},
			},
		);
	};

	if (!open || !request) return null;

	const hasActiveFilter = filterType !== "ALL" || sortBy !== "DEFAULT";

	return (
		<aside
			data-slot="subscription-drawer"
			onWheel={handleDrawerWheel}
			className={cn(
				"fixed z-50 w-full lg:w-[28vw]! lg:min-w-[20rem]! lg:max-w-[28rem]! lg:right-auto! p-0 gap-0 overflow-hidden font-sans border border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col bg-background h-[calc(100dvh-1rem)]! max-h-[calc(100dvh-1rem)]! inset-y-2! rounded-lg animate-in fade-in-0 duration-200 select-text",
				isExpanded ? "lg:left-[calc(65vw+0.75rem)]!" : "lg:left-[calc(60vw+0.75rem)]!",
			)}
			dir="rtl"
		>
			{/* 1. رأس اللوحة الموحد كباقي اللوحات تماماً */}
			<RegistrationDrawerHeader
				title="تعيين خطة اشتراك"
				patientName={request.patientName}
				code={request.code}
				onClose={() => onOpenChange(false)}
			/>

			{/* 2. شريط البحث والفلترة */}
			<div className="p-3 border-b border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 shrink-0">
				<div className="flex items-center gap-2">
					<div className="relative flex-1">
						<IconSearch className="absolute inset-y-0 right-2.5 my-auto size-4 text-muted-foreground pointer-events-none" />
						<Input
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							placeholder="ابحث عن الخطة/الاشتراك بالاسم، المعرف..."
							className="h-9 pr-8 pl-8 text-right text-xs"
						/>
						{search && (
							<button
								type="button"
								onClick={() => setSearch("")}
								className="absolute inset-y-0 left-2.5 my-auto size-4 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
							>
								<IconX className="size-3.5" />
							</button>
						)}
					</div>

					{/* زر الفلترة */}
					<Popover open={filterPopoverOpen} onOpenChange={setFilterPopoverOpen}>
						<PopoverTrigger asChild>
							<Button
								size="sm"
								variant="outline"
								className={cn(
									"h-9 shrink-0 gap-1.5 text-xs border-zinc-200 dark:border-zinc-800 cursor-pointer",
									hasActiveFilter && "border-primary text-primary bg-primary/5",
								)}
							>
								<IconFilter className="size-3.5" />
								<span>فلترة</span>
								{hasActiveFilter && (
									<span className="size-1.5 rounded-full bg-primary shrink-0" />
								)}
							</Button>
						</PopoverTrigger>
						<PopoverContent align="start" className="w-60 p-3 space-y-3 z-50 text-right" dir="rtl">
							<div className="flex items-center justify-between pb-1 border-b border-border/50">
								<span className="text-xs font-bold text-foreground">خيارات الفلترة والترتيب</span>
								{hasActiveFilter && (
									<button
										type="button"
										onClick={() => {
											setFilterType("ALL");
											setSortBy("DEFAULT");
										}}
										className="text-[10px] text-primary hover:underline cursor-pointer"
									>
										إعادة ضبط
									</button>
								)}
							</div>

							{/* نوع الباقة */}
							<div className="space-y-1.5">
								<label className="text-[11px] font-semibold text-muted-foreground block">
									دورية الباقة
								</label>
								<div className="grid grid-cols-2 gap-1">
									{[
										{ id: "ALL", label: "الكل" },
										{ id: "شهري", label: "شهري" },
										{ id: "فصلي", label: "فصلي" },
										{ id: "سنوي", label: "سنوي" },
									].map((opt) => (
										<button
											key={opt.id}
											type="button"
											onClick={() => setFilterType(opt.id as any)}
											className={cn(
												"h-7 text-[11px] rounded-md border text-center transition-colors cursor-pointer",
												filterType === opt.id
													? "bg-primary text-white border-primary font-bold"
													: "border-border hover:bg-muted text-foreground",
											)}
										>
											{opt.label}
										</button>
									))}
								</div>
							</div>

							{/* الترتيب */}
							<div className="space-y-1.5 pt-1 border-t border-border/50">
								<label className="text-[11px] font-semibold text-muted-foreground block">
									الترتيب حسب
								</label>
								<div className="space-y-1">
									{[
										{ id: "DEFAULT", label: "الافتراضي" },
										{ id: "PRICE_ASC", label: "السعر: من الأقل للأعلى" },
										{ id: "PRICE_DESC", label: "السعر: من الأعلى للأقل" },
										{ id: "RATING", label: "الأعلى تقييماً" },
									].map((s) => (
										<button
											key={s.id}
											type="button"
											onClick={() => setSortBy(s.id as any)}
											className={cn(
												"w-full text-right px-2 py-1 text-[11px] rounded transition-colors cursor-pointer block",
												sortBy === s.id
													? "bg-primary/10 text-primary font-bold"
													: "hover:bg-muted text-foreground",
											)}
										>
											{s.label}
										</button>
									))}
								</div>
							</div>
						</PopoverContent>
					</Popover>
				</div>
			</div>

			{/* 3. قائمة كروت الخطط القابلة للتمرير */}
			<div
				ref={scrollContainerRef}
				className="p-3.5 space-y-2.5 flex-1 min-h-0 overflow-y-auto scrollbar-thin select-text text-right"
				style={{ touchAction: "pan-y" }}
			>
				{isCarePlansLoading && allPlans.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-12 gap-2 text-muted-foreground text-xs">
						<IconLoader2 className="size-5 animate-spin text-primary" />
						<span>جاري تحميل خطط الاشتراك...</span>
					</div>
				) : filteredPlans.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-12 text-center text-xs text-muted-foreground">
						<p className="font-semibold text-zinc-700 dark:text-zinc-300">لا توجد خطط اشتراك مطابقة</p>
						<p className="text-[11px] mt-1">جرب البحث بكلمات أخرى أو تغيير إعدادات الفلترة.</p>
					</div>
				) : (
					filteredPlans.map((plan) => {
						const isSelected = selectedPlanId === plan.id;

						return (
							<button
								key={plan.id}
								type="button"
								onClick={() => setSelectedPlanId(plan.id)}
								className={cn(
									"w-full text-right p-3 rounded-xl border transition-all flex flex-col gap-2.5 cursor-pointer bg-white dark:bg-zinc-900",
									isSelected
										? "border-primary ring-1.5 ring-primary bg-primary/5 dark:bg-primary/10 shadow-xs"
										: "border-zinc-200/90 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/40",
								)}
							>
								{/* السطر العلوي: العنوان والتفاصيل + بادج الدورة */}
								<div className="flex items-start justify-between gap-2">
									<div className="flex items-start gap-2.5 min-w-0">
										<div
											className={cn(
												"size-8 rounded-lg flex items-center justify-center shrink-0 border transition-colors",
												isSelected
													? "bg-primary text-white border-primary"
													: "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border-zinc-200/60 dark:border-zinc-700/60",
											)}
										>
											<IconBuildingBank className="size-4" />
										</div>
										<div className="min-w-0">
											<div className="flex items-center gap-1.5">
												<span className="text-[13px] font-bold text-zinc-900 dark:text-zinc-100 truncate">
													{plan.name}
												</span>
											</div>
											{plan.description && (
												<p className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-1 mt-0.5">
													{plan.description}
												</p>
											)}
										</div>
									</div>

									<Badge
										variant="outline"
										className="text-[10px] font-medium px-2 py-0.5 shrink-0 bg-indigo-50/70 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800"
									>
										{plan.type}
									</Badge>
								</div>

								{/* السطر السفلي: السعر، الجلسات، المستويات، والتقييم */}
								<div className="flex items-center gap-2 text-[11px] text-zinc-500 dark:text-zinc-400 flex-wrap pt-1 border-t border-zinc-100 dark:border-zinc-800/70">
									<span className="flex items-center gap-1 font-bold text-zinc-900 dark:text-zinc-100 font-mono">
										<IconCurrencyDollar className="size-3.5 text-zinc-400" />
										<span>{plan.price.toLocaleString("ar-EG-u-nu-latn")} {currency}</span>
									</span>
									<span className="text-zinc-300 dark:text-zinc-600">•</span>
									<span className="flex items-center gap-1">
										<IconClock className="size-3.5 text-zinc-400" />
										<span>{plan.durationLabel}</span>
									</span>
									<span className="text-zinc-300 dark:text-zinc-600">•</span>
									<span className="flex items-center gap-1">
										<IconStack2 className="size-3.5 text-zinc-400" />
										<span>{plan.levelsLabel}</span>
									</span>
									<span className="text-zinc-300 dark:text-zinc-600">•</span>
									<span className="flex items-center gap-1">
										<IconStarFilled className="size-3 text-amber-500 fill-amber-500" />
										<span className="font-semibold text-zinc-800 dark:text-zinc-200 font-mono">
											{plan.rating}
										</span>
										<span className="text-[10px] text-zinc-400">({plan.reviewsCount} تقييم)</span>
									</span>
								</div>
							</button>
						);
					})
				)}
			</div>

			{/* 4. الفوتر المثبت بالأسفل مع زر تعيين الخطة والإلغاء */}
			<div className="p-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/50 shrink-0 mt-auto">
				<Button
					variant="outline"
					size="sm"
					onClick={() => onOpenChange(false)}
					disabled={quickUpdateMutation.isPending}
					className="h-8 text-xs cursor-pointer"
				>
					إلغاء
				</Button>

				<Button
					size="sm"
					onClick={handleAssign}
					disabled={!selectedPlanId || quickUpdateMutation.isPending}
					className="h-8 text-xs font-semibold px-4 gap-1.5 bg-blue-600 hover:bg-blue-700 text-white shadow-2xs cursor-pointer disabled:opacity-50"
				>
					{quickUpdateMutation.isPending ? (
						<IconLoader2 className="size-3.5 animate-spin" />
					) : (
						<IconCheck className="size-3.5" />
					)}
					<span>
						{quickUpdateMutation.isPending ? "جاري التعيين..." : "تعيين الخطة"}
					</span>
				</Button>
			</div>
		</aside>
	);
}
