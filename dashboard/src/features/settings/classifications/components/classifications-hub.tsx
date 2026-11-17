"use client";

import {
	IconBook2,
	IconBriefcase,
	IconBuildingHospital,
	IconBus,
	IconChevronLeft,
	IconClock,
	IconDots,
	IconPackages,
	IconPointFilled,
	IconReceipt2,
	IconRosetteDiscountCheck,
	IconRoute,
	IconSchool,
	IconSearch,
	IconSettings,
	IconSparkles,
	IconToolsKitchen2,
	IconUsers,
	IconX,
} from "@tabler/icons-react";
import { Link, useRouter } from "@tanstack/react-router";
import type { ComponentType } from "react";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useClassroomClassifications } from "@/features/services/classrooms/hooks/use-classrooms";
import { SettingsPageWrapper } from "@/features/settings/components/settings-page-wrapper";
import { useSpecializationsTree } from "@/features/settings/specializations/hooks/use-specializations-tree";
import { useTrackClassifications } from "@/features/settings/tracks/hooks/use-track-classifications";
import { usePageHeaderTakeover } from "@/hooks/use-page-header-takeover";
import { StagesClassificationDialog } from "./stages-classification-dialog";

interface ClassificationItem {
	id: string;
	title: string;
	description: string;
	badge?: string;
	isAvailable: boolean;
	icon: ComponentType<{ className?: string }>;
	url?: string;
}

export function ClassificationsHub() {
	const router = useRouter();
	const [stagesDialogOpen, setStagesDialogOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");

	const { classifications: classroomClassifications } = useClassroomClassifications();
	const { tree: specializationsTree } = useSpecializationsTree();
	const { trackClassifications } = useTrackClassifications();

	const stagesCount = classroomClassifications?.length || 8;
	const specialtiesCount = useMemo(() => {
		if (!specializationsTree || specializationsTree.length === 0) return 6;
		const activeCount = specializationsTree.filter((c) => c.isActive).length;
		return activeCount || 6;
	}, [specializationsTree]);
	const tracksCount = useMemo(() => {
		if (!trackClassifications || trackClassifications.length === 0) return 7;
		const activeCount = trackClassifications.filter((t) => t.isActive).length;
		return activeCount || 7;
	}, [trackClassifications]);

	// فتحة الهيدر العلوي الموحد
	const setTitleSuppressed = usePageHeaderTakeover((state) => state.setTitleSuppressed);
	const [slot, setSlot] = useState<HTMLElement | null>(null);

	useEffect(() => {
		setSlot(document.getElementById("page-header-slot"));
	}, []);

	useEffect(() => {
		setTitleSuppressed(true);
		return () => setTitleSuppressed(false);
	}, [setTitleSuppressed]);

	const headerContent = (
		<div
			className="flex items-center gap-2"
			dir="rtl"
		>
			<Link
				to="/management/settings"
				className="whitespace-nowrap text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
			>
				الإعدادات
			</Link>
			<IconChevronLeft className="size-3 shrink-0 text-muted-foreground ltr:rotate-180" />
			<span className="whitespace-nowrap text-xs font-bold text-foreground">التصنيفات</span>

			<span className="h-4 w-px bg-border shrink-0 mx-1" />

			{/* زر خيارات إضافية في الهيدر */}
			<div className="flex items-center gap-1.5">
				<DropdownMenu dir="rtl">
					<DropdownMenuTrigger asChild>
						<Button
							variant="ghost"
							size="icon"
							className="size-7 text-muted-foreground hover:text-foreground cursor-pointer"
						>
							<IconDots className="size-3.5" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						align="start"
						className="w-48"
					>
						<DropdownMenuItem
							className="gap-2 text-xs cursor-pointer"
							onSelect={() => router.navigate({ to: "/management/settings/academic-stages" })}
						>
							<IconSchool className="size-3.5 text-purple-600" />
							المراحل الدراسية
						</DropdownMenuItem>
						<DropdownMenuItem
							className="gap-2 text-xs cursor-pointer"
							onSelect={() => router.navigate({ to: "/management/settings/tracks" })}
						>
							<IconRoute className="size-3.5 text-indigo-600" />
							المسارات التعليمية
						</DropdownMenuItem>
						<DropdownMenuItem
							className="gap-2 text-xs cursor-pointer"
							onSelect={() => router.navigate({ to: "/management/settings/specialties" })}
						>
							<IconBriefcase className="size-3.5 text-sky-600" />
							تخصصات الموظفين
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							className="gap-2 text-xs cursor-pointer"
							onSelect={() => router.navigate({ to: "/management/settings" })}
						>
							<IconSettings className="size-3.5 text-muted-foreground" />
							العودة إلى الإعدادات
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</div>
	);

	// التصنيفات النشطة المتاحة حالياً
	const activeItems: ClassificationItem[] = useMemo(
		() => [
			{
				id: "academic-stages",
				title: "المراحل الدراسية",
				description: "إدارة تصنيفات المراحل والمستويات التعليمية والسنوات الدراسية.",
				badge: `${stagesCount} تصنيفات مفعلة`,
				isAvailable: true,
				icon: IconSchool,
				url: "/management/settings/academic-stages",
			},
			{
				id: "employee-specialties",
				title: "تخصصات الموظفين",
				description: "إدارة تصنيفات تخصصات ومجالات عمل الموظفين والكوادر.",
				badge: `${specialtiesCount} تصنيفات مفعلة`,
				isAvailable: true,
				icon: IconBriefcase,
				url: "/management/settings/specialties",
			},
			{
				id: "tracks",
				title: "المسارات التعليمية",
				description: "إدارة تصنيفات المسارات والخطط التدريبية والبرامج التعليمية.",
				badge: `${tracksCount} تصنيفات مفعلة`,
				isAvailable: true,
				icon: IconRoute,
				url: "/management/settings/tracks",
			},
		],
		[stagesCount, specialtiesCount, tracksCount],
	);

	// التصنيفات المستقبلية (متاحة قريباً)
	const upcomingItems: ClassificationItem[] = useMemo(
		() => [
			{
				id: "courses",
				title: "الدورات التدريبية",
				description: "إدارة تصنيفات ومجالات الدورات والمناهج التعليمية.",
				isAvailable: false,
				icon: IconBook2,
			},
			{
				id: "assessments",
				title: "التقييمات والاختبارات",
				description: "تصنيفات أنواع التقييمات، بنوك الأسئلة، ومقاييس الأداء.",
				isAvailable: false,
				icon: IconRosetteDiscountCheck,
			},
			{
				id: "sessions",
				title: "أنواع الجلسات",
				description: "إدارة تصنيفات الجلسات الفردية والجماعية والاستشارية.",
				isAvailable: false,
				icon: IconClock,
			},
			{
				id: "activities",
				title: "الأنشطة والفعاليات",
				description: "إدارة تصنيفات الأنشطة اللامنهجية، الورش والفعاليات.",
				isAvailable: false,
				icon: IconSparkles,
			},
			{
				id: "care-lodging",
				title: "الرعاية والإقامة",
				description: "إدارة أنواع وخدمات الرعاية اليومية والإقامة والتأهيل.",
				isAvailable: false,
				icon: IconBuildingHospital,
			},
			{
				id: "inventory",
				title: "المخزون والأصناف",
				description: "إدارة تصنيفات المنتجات، الأدوات التعليمية، والمستلزمات.",
				isAvailable: false,
				icon: IconPackages,
			},
			{
				id: "transportation",
				title: "خدمات النقل",
				description: "إدارة تصنيفات خطوط وسيارات النقل والرحلات المدرسية.",
				isAvailable: false,
				icon: IconBus,
			},
			{
				id: "meals",
				title: "الوجبات والتغذية",
				description: "إدارة تصنيفات الوجبات والأنظمة الغذائية وخطط الإعاشة.",
				isAvailable: false,
				icon: IconToolsKitchen2,
			},
			{
				id: "expenses",
				title: "المصروفات والمشتريات",
				description: "إدارة بنود وتصنيفات المصروفات التشغيلية وفواتير المشتريات.",
				isAvailable: false,
				icon: IconReceipt2,
			},
			{
				id: "hr",
				title: "الموارد البشرية",
				description: "الأقسام، المسميات الوظيفية، أنواع العقود، وأنواع الإجازات.",
				isAvailable: false,
				icon: IconUsers,
			},
		],
		[],
	);

	const q = searchQuery.trim().toLowerCase();
	const filteredActive = useMemo(
		() =>
			activeItems.filter(
				(item) =>
					!q ||
					item.title.toLowerCase().includes(q) ||
					item.description.toLowerCase().includes(q),
			),
		[activeItems, q],
	);

	const filteredUpcoming = useMemo(
		() =>
			upcomingItems.filter(
				(item) =>
					!q ||
					item.title.toLowerCase().includes(q) ||
					item.description.toLowerCase().includes(q),
			),
		[upcomingItems, q],
	);

	return (
		<SettingsPageWrapper>
			{slot && createPortal(headerContent, slot)}

			{/* عنوان الصفحة ووصفها الأساسي المطابق لصفحة الذكاء الاصطناعي والإعدادات */}
			<div className="flex flex-col gap-1 text-right">
				<h2 className="text-lg font-bold text-foreground">التصنيفات</h2>
				<p className="text-xs text-muted-foreground">
					نظّم تصنيفات مؤسستك الافتراضية، وحّد طريقة لكل تصنيف، لتسهيل إدارتها وربطها من مكان
					واحد.
				</p>
			</div>

			{/* حقل البحث السريع المدمج */}
			<div className="relative w-full max-w-sm">
				<IconSearch className="absolute right-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
				<Input
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					placeholder="بحث في التصنيفات..."
					className="h-8.5 pr-8.5 pl-8 text-xs bg-background rounded-[4px] border-border text-right"
				/>
				{searchQuery && (
					<button
						type="button"
						onClick={() => setSearchQuery("")}
						className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer p-0.5"
						title="مسح البحث"
					>
						<IconX className="size-3" />
					</button>
				)}
			</div>

			{/* القسم الأول: التصنيفات المفعّلة والجاهزة للإدارة */}
			{filteredActive.length > 0 && (
				<section className="flex flex-col gap-3 text-right">
					<div className="flex items-center gap-2">
						<h3 className="text-sm font-bold text-foreground">التصنيفات المتاحة للتهيئة</h3>
						<span className="rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/50 px-2 py-0.5 text-[10px] font-semibold">
							{filteredActive.length} مفعّل
						</span>
					</div>
					<p className="text-xs text-muted-foreground">
						التصنيفات المربوطة والمفعّلة داخل النظام — اضغط لإدارة العناصر والمستويات.
					</p>

					<div className="divide-y rounded-[4px] border border-border bg-card overflow-hidden">
						{filteredActive.map((item) => {
							const ItemIcon = item.icon;
							return (
								<Link
									key={item.id}
									to={item.url || "/management/settings/classifications"}
									className="flex w-full items-center justify-between px-3 py-2.5 text-start transition-colors hover:bg-muted/40 cursor-pointer"
								>
									<div className="flex items-center gap-3 min-w-0">
										<div className="flex size-8 items-center justify-center rounded-[4px] bg-[#f5f5f5] dark:bg-muted shrink-0 text-foreground">
											<ItemIcon className="size-4" />
										</div>
										<div className="space-y-0.5 min-w-0 text-right">
											<p className="text-xs font-bold text-foreground truncate">
												{item.title}
											</p>
											<p className="text-xs text-muted-foreground truncate">
												{item.description}
											</p>
										</div>
									</div>
									<div className="flex shrink-0 items-center gap-2">
										<span className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
											<IconPointFilled className="size-3" />
											{item.badge}
										</span>
										<IconChevronLeft className="size-4 text-muted-foreground" />
									</div>
								</Link>
							);
						})}
					</div>
				</section>
			)}

			{/* القسم الثاني: التصنيفات القادمة (متاحة قريباً) */}
			{filteredUpcoming.length > 0 && (
				<section className="flex flex-col gap-3 text-right">
					<div className="flex items-center gap-2">
						<h3 className="text-sm font-bold text-foreground">تصنيفات النظام الإضافية</h3>
						<span className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
							متاح قريباً
						</span>
					</div>
					<p className="text-xs text-muted-foreground">
						أقسام تصنيف إضافية سيتم تفعيلها تباعاً لربط كافة خدمات المؤسسة.
					</p>

					<div className="divide-y rounded-[4px] border border-border bg-card overflow-hidden">
						{filteredUpcoming.map((item) => {
							const ItemIcon = item.icon;
							return (
								<div
									key={item.id}
									className="flex w-full items-center justify-between px-3 py-2.5 text-start opacity-60 select-none"
								>
									<div className="flex items-center gap-3 min-w-0">
										<div className="flex size-8 items-center justify-center rounded-[4px] bg-[#f5f5f5] dark:bg-muted shrink-0 text-muted-foreground">
											<ItemIcon className="size-4" />
										</div>
										<div className="space-y-0.5 min-w-0 text-right">
											<p className="text-xs font-bold text-foreground truncate">
												{item.title}
											</p>
											<p className="text-xs text-muted-foreground truncate">
												{item.description}
											</p>
										</div>
									</div>
									<div className="flex shrink-0 items-center gap-2">
										<span className="text-[11px] text-muted-foreground">متاح قريباً</span>
										<IconChevronLeft className="size-4 text-muted-foreground/30" />
									</div>
								</div>
							);
						})}
					</div>
				</section>
			)}

			{/* في حالة عدم وجود أي نتائج بحث */}
			{filteredActive.length === 0 && filteredUpcoming.length === 0 && (
				<div className="py-12 text-center text-xs text-muted-foreground flex flex-col items-center justify-center gap-2 rounded-[4px] border border-dashed border-border bg-card">
					<IconSearch className="size-8 stroke-[1.5] text-muted-foreground/40" />
					<p className="font-bold text-foreground text-sm">لا توجد تصنيفات مطابقة للبحث</p>
					<Button
						variant="outline"
						size="sm"
						onClick={() => setSearchQuery("")}
						className="h-7 text-xs mt-1 cursor-pointer"
					>
						إعادة الضبط
					</Button>
				</div>
			)}

			{/* نافذة المراحل الدراسية المنبثقة إن استُدعيت */}
			<StagesClassificationDialog
				open={stagesDialogOpen}
				onOpenChange={setStagesDialogOpen}
			/>
		</SettingsPageWrapper>
	);
}
