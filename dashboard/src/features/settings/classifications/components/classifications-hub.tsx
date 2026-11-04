"use client";

import {
	IconBriefcase,
	IconChevronLeft,
	IconDots,
	IconInfoCircle,
	IconRoute,
	IconSchool,
	IconSettings,
} from "@tabler/icons-react";
import { Link, useRouter } from "@tanstack/react-router";
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
import { useClassroomClassifications } from "@/features/services/classrooms/hooks/use-classrooms";
import { useTrackClassifications } from "@/features/settings/tracks/hooks/use-track-classifications";
import { useSpecializationsTree } from "@/features/settings/specializations/hooks/use-specializations-tree";
import { usePageHeaderTakeover } from "@/hooks/use-page-header-takeover";
import { cn } from "@/lib/utils";
import { StagesClassificationDialog } from "./stages-classification-dialog";

interface ClassificationItem {
	id: string;
	title: string;
	description: string;
	badge?: string;
	isAvailable: boolean;
	onClick?: () => void;
}

export function ClassificationsHub() {
	const router = useRouter();
	const [stagesDialogOpen, setStagesDialogOpen] = useState(false);

	const { classifications: classroomClassifications } = useClassroomClassifications();
	const { tree: specializationsTree } = useSpecializationsTree();
	const { trackClassifications } = useTrackClassifications();

	const stagesCount = classroomClassifications?.length || 6;
	const specialtiesCount = useMemo(() => {
		if (!specializationsTree || specializationsTree.length === 0) return 6;
		const activeCount = specializationsTree.filter((c) => c.isActive).length;
		return activeCount || 6;
	}, [specializationsTree]);
	const tracksCount = useMemo(() => {
		if (!trackClassifications || trackClassifications.length === 0) return 6;
		const activeCount = trackClassifications.filter((t) => t.isActive).length;
		return activeCount || 6;
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
		<div className="flex items-center gap-2" dir="rtl">
			<Link
				to="/management/settings"
				className="whitespace-nowrap text-xs font-semibold text-foreground hover:underline"
			>
				الإعدادات
			</Link>
			<IconChevronLeft className="size-3 shrink-0 text-muted-foreground ltr:rotate-180" />
			<span className="whitespace-nowrap text-xs font-bold text-foreground">
				التصنيفات
			</span>

			<span className="h-4 w-px bg-border shrink-0" />

			{/* زر خيارات إضافية في الهيدر */}
			<div className="flex items-center gap-1.5">
				<DropdownMenu dir="rtl">
					<DropdownMenuTrigger asChild>
						<Button
							variant="ghost"
							size="icon"
							className="size-7 text-muted-foreground hover:text-foreground"
						>
							<IconDots className="size-3.5" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="start">
						<DropdownMenuItem
							className="gap-2 text-xs"
							onSelect={() => router.navigate({ to: "/management/settings/academic-stages" })}
						>
							<IconSchool className="size-3.5" />
							المراحل الدراسية
						</DropdownMenuItem>
						<DropdownMenuItem
							className="gap-2 text-xs"
							onSelect={() => router.navigate({ to: "/management/settings/tracks" })}
						>
							<IconRoute className="size-3.5" />
							المسارات
						</DropdownMenuItem>
						<DropdownMenuItem
							className="gap-2 text-xs"
							onSelect={() => router.navigate({ to: "/management/settings/specialties" })}
						>
							<IconBriefcase className="size-3.5" />
							تخصصات الموظفين
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							className="gap-2 text-xs"
							onSelect={() => router.navigate({ to: "/management/settings" })}
						>
							<IconSettings className="size-3.5" />
							العودة إلى الإعدادات
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</div>
	);

	const items: ClassificationItem[] = [
		{
			id: "academic-stages",
			title: "المراحل الدراسيه",
			description: "إدارة تصنيفات المراحل والمستويات التعليمية.",
			badge: `${stagesCount} تصنيفات مفعلة`,
			isAvailable: true,
			onClick: () => {
				router.navigate({ to: "/management/settings/academic-stages" });
			},
		},
		{
			id: "employee-specialties",
			title: "تخصصات الموظفين",
			description: "إدارة تصنيفات تخصصات ومجالات عمل الموظفين.",
			badge: `${specialtiesCount} تصنيفات مفعلة`,
			isAvailable: true,
			onClick: () => {
				router.navigate({ to: "/management/settings/specialties" });
			},
		},
		{
			id: "courses",
			title: "الدورات",
			description: "إدارة تصنيفات الدورات والمجالات التعليمية.",
			isAvailable: false,
		},
		{
			id: "tracks",
			title: "المسارات",
			description: "إدارة تصنيفات المسارات التعليمية.",
			badge: `${tracksCount} تصنيفات مفعلة`,
			isAvailable: true,
			onClick: () => {
				router.navigate({ to: "/management/settings/tracks" });
			},
		},
		{
			id: "sessions",
			title: "الجلسات",
			description: "إدارة تصنيفات أنواع الجلسات.",
			isAvailable: false,
		},
		{
			id: "inventory",
			title: "المخزون",
			description: "إدارة تصنيفات المنتجات والأصناف.",
			isAvailable: false,
		},
		{
			id: "care-lodging",
			title: "الرعاية والإقامة",
			description: "إدارة أنواع خدمات الرعاية والإقامة.",
			isAvailable: false,
		},
		{
			id: "transportation",
			title: "النقل",
			description: "إدارة تصنيفات خدمات النقل والرحلات المدرسية.",
			isAvailable: false,
		},
		{
			id: "meals",
			title: "الوجبات",
			description: "إدارة تصنيفات الوجبات وخطط التغذية.",
			isAvailable: false,
		},
		{
			id: "expenses",
			title: "المصروفات",
			description: "إدارة تصنيفات الوجبات وخطط التغذية.",
			isAvailable: false,
		},
		{
			id: "hr",
			title: "الموارد البشرية",
			description: "الإدارات، المسميات الوظيفية، أنواع العقود، أنواع الإجازات.",
			isAvailable: false,
		},
		{
			id: "assessments",
			title: "التقييمات والاختبارات",
			description: "أنواع التقييمات، أنواع الاختبارات، أنواع الأسئلة.",
			isAvailable: false,
		},
		{
			id: "activities",
			title: "الأنشطة والفعاليات",
			description: "إدارة تصنيفات الأنشطة والفعاليات المختلفة.",
			isAvailable: false,
		},
	];

	return (
		<div className="flex flex-1 flex-col p-6 max-w-5xl">
			{slot && createPortal(headerContent, slot)}

			{/* Page Header */}
			<div className="space-y-1.5">
				<h1 className="text-2xl font-bold tracking-tight text-foreground">التصنيفات</h1>
				<p className="text-sm text-muted-foreground">
					نظّم تصنيفات مؤسستك الافتراضية، وحدّد طريقة لكل تصنيف، لتسهيل إدارتها وربطها من مكان واحد.
				</p>
			</div>

			{/* Classifications List Card */}
			<div className="mt-6 rounded-2xl border border-border/80 bg-card shadow-xs overflow-hidden">
				<div className="divide-y divide-border/60">
					{items.map((item) => (
						<div
							key={item.id}
							onClick={item.isAvailable ? item.onClick : undefined}
							className={cn(
								"flex items-center justify-between px-6 py-4.5 transition-colors select-none",
								item.isAvailable
									? "hover:bg-muted/40 cursor-pointer"
									: "opacity-60 cursor-default",
							)}
						>
							{/* Right side: Icon + Title + Description */}
							<div className="flex items-center gap-4">
								<div className="flex size-10 items-center justify-center rounded-full border border-border/80 bg-background text-muted-foreground/80 shrink-0 shadow-2xs">
									<IconInfoCircle className="size-5" />
								</div>
								<div>
									<h3 className="text-base font-semibold text-foreground">{item.title}</h3>
									<p className="text-sm text-muted-foreground mt-0.5">{item.description}</p>
								</div>
							</div>

							{/* Left side: Badge + Chevron */}
							<div className="flex items-center gap-3">
								{item.isAvailable ? (
									<span className="text-xs font-medium text-muted-foreground px-2.5 py-1 rounded-md bg-muted/50 border border-border/50">
										{item.badge}
									</span>
								) : (
									<span className="text-xs font-normal text-muted-foreground/70">
										متاح قريباً
									</span>
								)}
								<IconChevronLeft
									className={cn(
										"size-4 shrink-0 transition-transform",
										item.isAvailable
											? "text-muted-foreground/70"
											: "text-muted-foreground/30",
									)}
								/>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Academic Stages Dialog */}
			<StagesClassificationDialog
				open={stagesDialogOpen}
				onOpenChange={setStagesDialogOpen}
			/>
		</div>
	);
}

