import {
	IconBriefcase,
	IconChevronLeft,
	IconDots,
	IconFolders,
	IconSchool,
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
import { TracksTable } from "@/features/settings/tracks/components/tracks-table";
import { computeTracksStats } from "@/features/settings/tracks/data/stats";
import { useTrackClassifications } from "@/features/settings/tracks/hooks/use-track-classifications";
import { usePageHeaderTakeover } from "@/hooks/use-page-header-takeover";

export const Route = createFileRoute(
	"/_pathless-layout/management/settings/tracks",
)({
	component: RouteComponent,
});

function RouteComponent() {
	const navigate = useNavigate();
	const setTitleSuppressed = usePageHeaderTakeover((state) => state.setTitleSuppressed);
	const [slot, setSlot] = useState<HTMLElement | null>(null);

	const { trackClassifications } = useTrackClassifications();
	const stats = useMemo(() => computeTracksStats(trackClassifications), [trackClassifications]);

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
				المسارات
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
							onSelect={() => navigate({ to: "/management/settings/academic-stages" })}
						>
							<IconSchool className="size-3.5" />
							المراحل الدراسية
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

			<Stats
				className="px-6"
				stats={stats}
			/>

			<TracksTable />
		</div>
	);
}

