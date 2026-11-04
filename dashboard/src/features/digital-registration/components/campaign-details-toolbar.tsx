import {
	IconAdjustmentsHorizontal,
	IconChartBar,
	IconDownload,
	IconFileSpreadsheet,
	IconFilter,
	IconLayoutColumns,
	IconPlus,
	IconSearch,
	IconSettings,
	IconShare,
	IconSparkles,
	IconUserPlus,
	IconX,
} from "@tabler/icons-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";

export function CampaignDetailsToolbar({
	searchValue,
	onSearchChange,
	genderFilter,
	onGenderFilterChange,
	onOpenAddRequest,
	onExport,
	onExportCsv,
	onOpenAssistant,
	onToggleStats,
	onOpenSettings,
}: {
	searchValue?: string;
	onSearchChange?: (val: string) => void;
	genderFilter?: string;
	onGenderFilterChange?: (val: string) => void;
	onOpenAddRequest?: () => void;
	onExport?: () => void;
	onExportCsv?: () => void;
	onOpenAssistant?: () => void;
	onToggleStats?: () => void;
	onOpenSettings?: () => void;
}) {
	const handleCopyPublicLink = () => {
		const publicUrl =
			typeof window !== "undefined"
				? `${window.location.origin}/register`
				: "https://sanad.app/register";

		navigator.clipboard.writeText(publicUrl);
		toast.success("تم نسخ رابط التسجيل المباشر بنجاح!");
	};

	return (
		<div
			className="flex items-center justify-between gap-2 px-3 py-1.5 border-b border-border/40 bg-background select-none flex-nowrap overflow-x-auto min-w-0"
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

				{/* العرض (View Layout) */}
				<Button
					type="button"
					variant="outline"
					size="sm"
					className="h-7.5 px-2.5 gap-1 text-[11px] font-medium text-muted-foreground hover:text-foreground shrink-0 cursor-pointer"
				>
					<IconLayoutColumns className="size-3 text-muted-foreground/80" />
					<span>العرض</span>
				</Button>

				{/* التصفية (Sort) */}
				<Button
					type="button"
					variant="outline"
					size="sm"
					className="h-7.5 px-2.5 gap-1 text-[11px] font-medium text-muted-foreground hover:text-foreground shrink-0 cursor-pointer"
				>
					<IconAdjustmentsHorizontal className="size-3 text-muted-foreground/80" />
					<span>التصفية</span>
				</Button>

				{/* مساعدك الذكي (Assistant) */}
				<Button
					type="button"
					variant="outline"
					size="sm"
					className="h-7.5 px-2.5 gap-1 text-[11px] font-medium text-muted-foreground hover:text-foreground shrink-0 cursor-pointer"
					onClick={onOpenAssistant}
				>
					<IconSparkles className="size-3 text-amber-500" />
					<span>مساعدك</span>
				</Button>
			</div>

			{/* Left Section: Compact Buttons & Team Avatars */}
			<div className="flex items-center gap-1.5 shrink-0 flex-nowrap" dir="ltr">
				{/* 1. Primary Action Button: + تسجيل طالب جديد */}
				{onOpenAddRequest && (
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
					<div className="flex items-center -space-x-1.5">
						<div
							className="size-6 rounded-full bg-[#FCE7F3] text-[#BE185D] border-2 border-background flex items-center justify-center text-[9px] font-bold shadow-2xs select-none"
							title="سارة خالد"
						>
							SC
						</div>
						<div
							className="size-6 rounded-full bg-[#E0F2FE] text-[#0369A1] border-2 border-background flex items-center justify-center text-[9px] font-bold shadow-2xs select-none"
							title="جمال عادل"
						>
							JC
						</div>
						<div
							className="size-6 rounded-full bg-[#CCFBF1] text-[#0F766E] border-2 border-background flex items-center justify-center text-[9px] font-bold shadow-2xs select-none"
							title="إيمان وائل"
						>
							EW
						</div>
					</div>

					<button
						type="button"
						className="size-6.5 ms-1 rounded-md hover:bg-muted/70 text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors cursor-pointer"
						title="دعوة عضو فريق"
						onClick={onOpenSettings}
					>
						<IconUserPlus className="size-3.5" />
					</button>
				</div>

				{/* 5. Share Button */}
				<Button
					type="button"
					variant="outline"
					size="sm"
					className="h-7.5 px-2.5 rounded-md border-border/80 bg-background hover:bg-muted/60 text-foreground text-[11px] font-medium flex items-center gap-1 shadow-2xs transition-colors cursor-pointer whitespace-nowrap"
					onClick={handleCopyPublicLink}
					title="مشاركة رابط التسجيل المباشر"
				>
					<IconShare className="size-3 text-muted-foreground" />
					<span>Share</span>
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
		</div>
	);
}
