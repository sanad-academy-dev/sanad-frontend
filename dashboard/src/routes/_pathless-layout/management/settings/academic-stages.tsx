import {
	IconBriefcase,
	IconChevronLeft,
	IconChevronRight,
	IconDots,
	IconFolders,
	IconRoute,
	IconSettings,
} from "@tabler/icons-react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Stats } from "@/components/common/stats";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StagesTable } from "@/features/settings/academic-stages/components/stages-table";
import { computeStagesStats } from "@/features/settings/academic-stages/data/stats";
import { useAcademicStages } from "@/features/settings/academic-stages/hooks/use-academic-stages";
import { usePageHeaderTakeover } from "@/hooks/use-page-header-takeover";

export const Route = createFileRoute(
	"/_pathless-layout/management/settings/academic-stages",
)({
	component: RouteComponent,
});

function RouteComponent() {
	const navigate = useNavigate();
	const setTitleSuppressed = usePageHeaderTakeover((state) => state.setTitleSuppressed);
	const [slot, setSlot] = useState<HTMLElement | null>(null);

	const { stages } = useAcademicStages();
	const stats = useMemo(() => computeStagesStats(stages), [stages]);

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
			<Link
				to="/management/settings/classifications"
				className="whitespace-nowrap text-xs font-semibold text-foreground hover:underline"
			>
				التصنيفات
			</Link>
			<IconChevronLeft className="size-3 shrink-0 text-muted-foreground ltr:rotate-180" />
			<span className="whitespace-nowrap text-xs font-bold text-foreground">
				المراحل الدراسية
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
							onSelect={() => navigate({ to: "/management/settings/classifications" })}
						>
							<IconFolders className="size-3.5" />
							العودة إلى التصنيفات
						</DropdownMenuItem>
						<DropdownMenuItem
							className="gap-2 text-xs"
							onSelect={() => navigate({ to: "/management/settings/tracks" })}
						>
							<IconRoute className="size-3.5" />
							المسارات
						</DropdownMenuItem>
						<DropdownMenuItem
							className="gap-2 text-xs"
							onSelect={() => navigate({ to: "/management/settings/specialties" })}
						>
							<IconBriefcase className="size-3.5" />
							تخصصات الموظفين
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							className="gap-2 text-xs"
							onSelect={() => navigate({ to: "/management/settings" })}
						>
							<IconSettings className="size-3.5" />
							العودة إلى الإعدادات
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</div>
	);

	return (
		<div className="flex flex-1 flex-col gap-4">
			{slot && createPortal(headerContent, slot)}

			{/* <div className="flex items-center gap-2 px-6 pt-6">
				<Link
					to="/management/settings/classifications"
					className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
				>
					<IconChevronRight className="size-4 rtl:rotate-180" />
					<span>العودة إلى التصنيفات</span>
				</Link>
			</div> */}

			{/* <div className="px-6 pb-1">
				<h1 className="text-2xl font-bold tracking-tight text-foreground">المراحل الدراسية</h1>
				<p className="text-sm text-muted-foreground mt-1">
					إدارة تصنيفات المراحل والمستويات التعليمية المعتمدة لربط وتوزيع الفصول.
				</p>
			</div> */}

			<Stats
				className="px-6"
				stats={stats}
			/>

			<StagesTable />
			
		</div>
	);
}

