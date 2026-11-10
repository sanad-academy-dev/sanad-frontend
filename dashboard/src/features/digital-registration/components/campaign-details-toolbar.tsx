import { useMemo, useState } from "react";
import {
	IconAdjustmentsHorizontal,
	IconAlertCircle,
	IconCalendarTime,
	IconCheck,
	IconSortAscendingLetters,
	IconChartBar,
	IconDownload,
	IconFileSpreadsheet,
	IconFilter,
	IconPlus,
	IconSearch,
	IconSettings,
	IconSparkles,
	IconUserPlus,
	IconX,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { useAgentPanelStore } from "@/features/agent/stores/agent-panel.store";
import { CampaignShareDialog } from "./campaign-share-dialog";
import { useRegistrationShareAccess, useDigitalRegistrationCapabilities } from "../hooks/use-digital-registration";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";

// Palette matching the Notion/Linear reference design
const AVATAR_COLORS = [
	"bg-[#EDE9FE] text-[#6D28D9] dark:bg-[#4C1D95]/40 dark:text-[#C4B5FD]", // TI Purple
	"bg-[#E0F2FE] text-[#0369A1] dark:bg-[#0C4A6E]/40 dark:text-[#7DD3FC]", // Sky Blue
	"bg-[#FCE7F3] text-[#BE185D] dark:bg-[#831843]/40 dark:text-[#F472B6]", // Soft Pink
	"bg-[#CCFBF1] text-[#0F766E] dark:bg-[#134E4A]/40 dark:text-[#5EEAD4]", // Teal
	"bg-[#FEF3C7] text-[#B45309] dark:bg-[#78350F]/40 dark:text-[#FCD34D]", // Amber
];

function getInitials(name?: string | null): string {
	if (!name) return "م";
	const clean = name
		.trim()
		.replace(/^(د\.|أ\.|م\.|مهندس|دكتور|أستاذ)\s*/i, "")
		.split(/\s+/);
	if (clean.length === 0 || !clean[0]) return "م";
	if (clean.length === 1) return clean[0].slice(0, 2).toUpperCase();
	return `${clean[0][0]}${clean[1][0]}`.toUpperCase();
}

export type CampaignSortOption = "DATE_DESC" | "DATE_ASC" | "PRIORITY_DESC" | "NAME_ASC";

export function CampaignDetailsToolbar({
	searchValue,
	onSearchChange,
	genderFilter,
	sortBy = "DATE_DESC",
	onSortChange,
	onGenderFilterChange,
	onOpenAddRequest,
	onExport,
	onExportCsv,
	onOpenAssistant,
	onToggleStats,
	onOpenSettings,
	campaignId,
	campaignName,
	campaignCode,
}: {
	searchValue?: string;
	onSearchChange?: (val: string) => void;
	genderFilter?: string;
	sortBy?: CampaignSortOption;
	onSortChange?: (sort: CampaignSortOption) => void;
	onGenderFilterChange?: (val: string) => void;
	onOpenAddRequest?: () => void;
	onExport?: () => void;
	onExportCsv?: () => void;
	onOpenAssistant?: () => void;
	onToggleStats?: () => void;
	onOpenSettings?: () => void;
	campaignId?: string;
	campaignName?: string;
	campaignCode?: string;
}) {
	const [shareOpen, setShareOpen] = useState(false);
	const [focusInviteOnOpen, setFocusInviteOnOpen] = useState(false);
	const openAgent = useAgentPanelStore((s) => s.open);
	const handleAssistantClick = onOpenAssistant || openAgent;

	const handleOpenInvite = () => {
		if (!capabilities.canManageTeam) return;
		setFocusInviteOnOpen(true);
		setShareOpen(true);
	};

	const handleOpenShare = () => {
		setFocusInviteOnOpen(false);
		setShareOpen(true);
	};

	const { capabilities } = useDigitalRegistrationCapabilities();
	const { data: shareData, isLoading: isShareLoading } = useRegistrationShareAccess();

	const collaborators = useMemo(() => {
		const list: Array<{
			id: string;
			name: string;
			email?: string;
			image?: string | null;
			title?: string;
			isCurrent?: boolean;
		}> = [];

		if (shareData?.currentUser) {
			list.push({ ...shareData.currentUser, isCurrent: true });
		}
		if (Array.isArray(shareData?.members)) {
			for (const m of shareData.members) {
				if (!list.some((existing) => existing.id === m.id)) {
					list.push(m);
				}
			}
		}
		return list;
	}, [shareData]);

	return (
		<div
			className="flex items-center justify-between gap-2 px-3 py-2 border-b border-border/40 bg-background select-none flex-nowrap overflow-x-auto min-w-0"
			dir="rtl"
		>
			{/* Right Section: Compact Search & Filter Toolbar */}
			<div className="flex items-center gap-1.5 shrink-0 flex-nowrap">
				{/* Search Input */}
				<InputGroup className="w-44 md:w-52 lg:w-60 h-7.5">
					<InputGroupAddon align="inline-start">
						<IconSearch className="size-3.5 text-muted-foreground" />
					</InputGroupAddon>
					<InputGroupInput
						value={searchValue || ""}
						onChange={(e) => onSearchChange?.(e.target.value)}
						placeholder="ابحث عن اسم المتقدم، المعرف..."
						className="text-[11px] h-7.5"
					/>
					{searchValue ? (
						<InputGroupAddon align="inline-end">
							<button
								type="button"
								onClick={() => onSearchChange?.("")}
								className="text-muted-foreground hover:text-foreground p-0.5"
							>
								<IconX className="size-3" />
							</button>
						</InputGroupAddon>
					) : (
						<InputGroupAddon align="inline-end">
							<span className="text-[9px] text-muted-foreground bg-muted px-1 py-0.2 rounded font-mono">
								/
							</span>
						</InputGroupAddon>
					)}
				</InputGroup>

				{/* فلترة (Filter Dropdown) */}
				<DropdownMenu dir="rtl">
					<DropdownMenuTrigger asChild>
						<Button
							type="button"
							variant="outline"
							size="sm"
							className="h-7.5 px-2.5 gap-1 text-[11px] font-medium text-muted-foreground hover:text-foreground shrink-0 cursor-pointer"
						>
							<IconFilter className="size-3 text-muted-foreground/80" />
							<span>فلترة</span>
							{genderFilter && genderFilter !== "ALL" && (
								<span className="size-1.5 rounded-full bg-primary" />
							)}
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="start" className="w-44 text-xs">
						<DropdownMenuLabel className="text-[11px] text-muted-foreground">
							تصفية حسب الجنس
						</DropdownMenuLabel>
						<DropdownMenuItem
							onClick={() => onGenderFilterChange?.("ALL")}
							className="cursor-pointer"
						>
							جميع الطلاب
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => onGenderFilterChange?.("MALE")}
							className="cursor-pointer"
						>
							بنين (ذكور)
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => onGenderFilterChange?.("FEMALE")}
							className="cursor-pointer"
						>
							بنات (إناث)
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>

				{/* تصدير (Export Dropdown) */}
				{capabilities.canExport && (
				<DropdownMenu dir="rtl">
					<DropdownMenuTrigger asChild>
						<Button
							type="button"
							variant="outline"
							size="sm"
							className="h-7.5 px-2.5 gap-1 text-[11px] font-medium text-muted-foreground hover:text-foreground shrink-0 cursor-pointer"
						>
							<IconDownload className="size-3 text-muted-foreground/80" />
							<span>تصدير</span>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="start" className="w-52 text-xs">
						<DropdownMenuItem onClick={onExport} className="cursor-pointer gap-2 py-2">
							<IconFileSpreadsheet className="size-4 text-emerald-600" />
							<div className="flex flex-col text-start">
								<span className="font-semibold text-foreground">تصدير Excel (.xlsx)</span>
								<span className="text-[10px] text-muted-foreground">ملف منسق مع جداول وتنسيق RTL</span>
							</div>
						</DropdownMenuItem>
						<DropdownMenuItem onClick={onExportCsv} className="cursor-pointer gap-2 py-2">
							<IconDownload className="size-4 text-muted-foreground" />
							<div className="flex flex-col text-start">
								<span className="font-semibold text-foreground">تصدير CSV (.csv)</span>
								<span className="text-[10px] text-muted-foreground">ملف نصي بترميز UTF-8</span>
							</div>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
				)}

				{/* التصفية والفرز (Sort & Order) */}
				<DropdownMenu dir="rtl">
					<DropdownMenuTrigger asChild>
						<Button
							type="button"
							variant="outline"
							size="sm"
							className={cn(
								"h-7.5 px-2.5 gap-1 text-[11px] font-medium shrink-0 cursor-pointer transition-colors",
								sortBy && sortBy !== "DATE_DESC"
									? "text-primary border-primary/50 bg-primary/5 font-semibold"
									: "text-muted-foreground hover:text-foreground",
							)}
						>
							<IconAdjustmentsHorizontal className="size-3" />
							<span>التصفية</span>
							{sortBy && sortBy !== "DATE_DESC" && (
								<span className="size-1.5 rounded-full bg-primary" />
							)}
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="start" className="w-56 text-xs select-none">
						<DropdownMenuLabel className="text-[11px] text-muted-foreground">
							ترتيب وفرز الكروت
						</DropdownMenuLabel>
						<DropdownMenuSeparator />

						{/* خيارات تاريخ التقديم */}
						<DropdownMenuItem
							onClick={() => onSortChange?.("DATE_DESC")}
							className="cursor-pointer justify-between py-1.5"
						>
							<div className="flex items-center gap-2">
								<IconCalendarTime className="size-3.5 text-muted-foreground" />
								<span>تاريخ التقديم: الأحدث أولاً</span>
							</div>
							{(!sortBy || sortBy === "DATE_DESC") && (
								<IconCheck className="size-3.5 text-primary" />
							)}
						</DropdownMenuItem>

						<DropdownMenuItem
							onClick={() => onSortChange?.("DATE_ASC")}
							className="cursor-pointer justify-between py-1.5"
						>
							<div className="flex items-center gap-2">
								<IconCalendarTime className="size-3.5 text-muted-foreground" />
								<span>تاريخ التقديم: الأقدم أولاً</span>
							</div>
							{sortBy === "DATE_ASC" && (
								<IconCheck className="size-3.5 text-primary" />
							)}
						</DropdownMenuItem>

						<DropdownMenuSeparator />

						{/* خيار الأولوية */}
						<DropdownMenuItem
							onClick={() => onSortChange?.("PRIORITY_DESC")}
							className="cursor-pointer justify-between py-1.5"
						>
							<div className="flex items-center gap-2">
								<IconAlertCircle className="size-3.5 text-rose-500" />
								<span>الأولوية: من الأعلى إلى الأقل</span>
							</div>
							{sortBy === "PRIORITY_DESC" && (
								<IconCheck className="size-3.5 text-primary" />
							)}
						</DropdownMenuItem>

						<DropdownMenuSeparator />

						{/* خيار أبجدياً */}
						<DropdownMenuItem
							onClick={() => onSortChange?.("NAME_ASC")}
							className="cursor-pointer justify-between py-1.5"
						>
							<div className="flex items-center gap-2">
								<IconSortAscendingLetters className="size-3.5 text-muted-foreground" />
								<span>أبجدياً: حسب اسم الطالب (أ - ي)</span>
							</div>
							{sortBy === "NAME_ASC" && (
								<IconCheck className="size-3.5 text-primary" />
							)}
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>

				{/* مساعدك الذكي (Assistant) */}
				<Button
					type="button"
					variant="outline"
					size="sm"
					className="h-7.5 px-2.5 gap-1 text-[11px] font-medium text-muted-foreground hover:text-foreground shrink-0 cursor-pointer"
					onClick={handleAssistantClick}
				>
					<IconSparkles className="size-3 text-amber-500" />
					<span>مساعدك</span>
				</Button>
			</div>

			{/* Left Section: Compact Buttons & Team Avatars (مطابق تماماً للصورة) */}
			<div className="flex items-center gap-1.5 shrink-0 flex-nowrap" dir="ltr">
				{/* 1. Primary Action Button: + تسجيل طالب جديد */}
				{capabilities.canCreateRequest && onOpenAddRequest && (
					<Button
						type="button"
						size="sm"
						className="h-7.5 px-3 text-[11.5px] font-bold bg-[#5B50E5] hover:bg-[#4E43D8] text-white shadow-xs rounded-md flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap"
						onClick={onOpenAddRequest}
					>
						<IconPlus className="size-3.5 stroke-[2.5]" />
						<span>تسجيل طالب جديد</span>
					</Button>
				)}

				{/* 2. Chart Icon Button */}
				<Button
					type="button"
					variant="ghost"
					size="icon"
					className="size-7.5 rounded-md bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground border border-border/50 transition-colors cursor-pointer"
					onClick={onToggleStats}
					title="مؤشرات وإحصائيات القبول"
				>
					<IconChartBar className="size-3.5 text-muted-foreground" />
				</Button>

				{/* 3. Vertical Separator */}
				<span className="h-4 w-px bg-border/70 mx-0.5" />

				{/* 4. Overlapping Avatars & Invite Icon */}
				<div className="flex items-center">
					{capabilities.canManageTeam && (
						<button
							type="button"
							className="size-6.5 me-1 rounded-md hover:bg-muted/70 text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors cursor-pointer focus:outline-hidden focus:ring-1 focus:ring-ring"
							title="إضافة موظف إلى فريق التسجيل الرقمي"
							aria-label="إضافة موظف إلى فريق التسجيل الرقمي"
							onClick={handleOpenInvite}
						>
							<IconUserPlus className="size-3.5" />
						</button>
					)}
					{isShareLoading ? (
						<div className="flex items-center -space-x-1.5 animate-pulse">
							<div className="size-6 rounded-full bg-muted border-2 border-background" />
							<div className="size-6 rounded-full bg-muted border-2 border-background" />
						</div>
					) : collaborators.length > 0 ? (
						<button
							type="button"
							onClick={handleOpenShare}
							className="flex items-center -space-x-1.5 cursor-pointer group focus:outline-hidden focus:ring-1 focus:ring-ring rounded-full"
							title="الموظفون المصرح لهم في التسجيل الرقمي"
							aria-label="الموظفون المصرح لهم في التسجيل الرقمي"
						>
							{collaborators.slice(0, 3).map((collab, idx) => {
								const colorClass = AVATAR_COLORS[idx % AVATAR_COLORS.length];
								return (
									<div
										key={collab.id || idx}
										className={cn(
											"size-6 rounded-full border-2 border-background flex items-center justify-center text-[9px] font-bold shadow-2xs select-none shrink-0 overflow-hidden transition-transform group-hover:scale-105",
											colorClass,
										)}
										title={`${collab.name}${collab.isCurrent ? " (أنت)" : ""}${collab.title ? ` • ${collab.title}` : ""}`}
									>
										{collab.image ? (
											<img
												src={collab.image}
												alt={collab.name}
												className="size-full object-cover rounded-full"
											/>
										) : (
											<span>{getInitials(collab.name)}</span>
										)}
									</div>
								);
							})}

							{collaborators.length > 3 && (
								<div
									className="size-6 rounded-full bg-muted/80 text-foreground border-2 border-background flex items-center justify-center text-[8.5px] font-bold shadow-2xs select-none shrink-0 transition-transform group-hover:scale-105"
									title={`+${collaborators.length - 3} أعضاء إضافيون`}
								>
									+{collaborators.length - 3}
								</div>
							)}
						</button>
					) : capabilities.canManageTeam ? (
						<button
							type="button"
							onClick={handleOpenInvite}
							className="size-6 rounded-full bg-muted/60 text-muted-foreground border-2 border-background flex items-center justify-center text-[9px] font-medium shadow-2xs cursor-pointer hover:bg-muted"
							title="إضافة موظف إلى فريق التسجيل الرقمي"
						>
							<IconUserPlus className="size-3" />
						</button>
					) : null}

				</div>

				{/* 5. Team Button (مشاركة) */}
				<Button
					type="button"
					variant="outline"
					size="sm"
					className="h-7.5 px-2.5 rounded-md border-border/80 bg-background hover:bg-muted/60 text-foreground text-[11px] font-medium flex items-center gap-1 shadow-2xs transition-colors cursor-pointer whitespace-nowrap"
					onClick={handleOpenShare}
					title="مشاركة"
				>
					<span>مشاركة</span>
				</Button>

				{/* 6. Settings Gear Icon */}
				<Button
					type="button"
					variant="ghost"
					size="icon"
					className="size-7.5 rounded-md hover:bg-muted/70 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
					onClick={onOpenSettings}
					title="إعدادات التسجيل الرقمي"
				>
					<IconSettings className="size-3.5" />
				</Button>
			</div>

			<CampaignShareDialog
				open={shareOpen}
				onOpenChange={(open) => {
					setShareOpen(open);
					if (!open) setFocusInviteOnOpen(false);
				}}
				initialFocusInvite={focusInviteOnOpen}
				campaignCode={campaignCode}
			/>
		</div>
	);
}
