import {
	IconChevronDown,
	IconDownload,
	IconFileSpreadsheet,
	IconFilter,
	IconPlus,
	IconSearch,
	IconX,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

export function CampaignDetailsToolbar({
	searchValue,
	onSearchChange,
	genderFilter,
	onGenderFilterChange,
	onOpenAddRequest,
	onExport,
	onExportCsv,
}: {
	searchValue?: string;
	onSearchChange?: (val: string) => void;
	genderFilter?: string;
	onGenderFilterChange?: (val: string) => void;
	onOpenAddRequest?: () => void;
	onExport?: () => void;
	onExportCsv?: () => void;
}) {
	return (
		<div className="flex flex-wrap items-center justify-between gap-3 px-4 py-1.5" dir="rtl">
			{/* Left controls: search & gender filter */}
			<div className="flex flex-wrap items-center gap-2">
				<InputGroup className="w-64 h-8">
					<InputGroupAddon align="inline-start">
						<IconSearch className="size-3.5 text-muted-foreground" />
					</InputGroupAddon>
					<InputGroupInput
						value={searchValue || ""}
						onChange={(e) => onSearchChange?.(e.target.value)}
						placeholder="ابحث بالطالب، الهاتف، الكود..."
						className="text-xs"
					/>
					{searchValue && (
						<InputGroupAddon align="inline-end">
							<button
								type="button"
								onClick={() => onSearchChange?.("")}
								className="text-muted-foreground hover:text-foreground p-0.5"
							>
								<IconX className="size-3.5" />
							</button>
						</InputGroupAddon>
					)}
				</InputGroup>

				{genderFilter !== undefined && onGenderFilterChange && (
					<Select value={genderFilter} onValueChange={onGenderFilterChange}>
						<SelectTrigger className="h-8 text-xs w-32 gap-1.5">
							<IconFilter className="size-3.5 text-muted-foreground" />
							<SelectValue placeholder="الجنس" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="ALL">جميع الطلاب</SelectItem>
							<SelectItem value="MALE">بنين (ذكور)</SelectItem>
							<SelectItem value="FEMALE">بنات (إناث)</SelectItem>
						</SelectContent>
					</Select>
				)}
			</div>

			{/* Right actions: Export and Add Request button */}
			<div className="flex items-center gap-2">
				{onExport && (
					onExportCsv ? (
						<DropdownMenu dir="rtl">
							<DropdownMenuTrigger asChild>
								<Button
									type="button"
									size="sm"
									variant="outline"
									className="h-8 gap-1.5 text-xs font-normal hover:bg-muted"
								>
									<IconFileSpreadsheet className="size-3.5 text-emerald-600" />
									<span>تصدير المتقدمين</span>
									<IconChevronDown className="size-3 text-muted-foreground" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="w-52 text-xs">
								<DropdownMenuItem onClick={onExport} className="cursor-pointer gap-2 py-2">
									<IconFileSpreadsheet className="size-4 text-emerald-600" />
									<div className="flex flex-col text-start">
										<span className="font-medium text-foreground">تصدير Excel (.xlsx)</span>
										<span className="text-[10px] text-muted-foreground">ملف منسق مع جداول وتنسيق RTL</span>
									</div>
								</DropdownMenuItem>
								<DropdownMenuItem onClick={onExportCsv} className="cursor-pointer gap-2 py-2">
									<IconDownload className="size-4 text-muted-foreground" />
									<div className="flex flex-col text-start">
										<span className="font-medium text-foreground">تصدير CSV (.csv)</span>
										<span className="text-[10px] text-muted-foreground">ملف نصي بترميز UTF-8</span>
									</div>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					) : (
						<Button
							type="button"
							size="sm"
							variant="outline"
							className="h-8 gap-1.5 text-xs font-normal hover:bg-muted"
							onClick={onExport}
						>
							<IconFileSpreadsheet className="size-3.5 text-emerald-600" />
							تصدير المتقدمين
						</Button>
					)
				)}

				{onOpenAddRequest && (
					<Button
						type="button"
						size="sm"
						className="h-8 gap-1.5 text-xs font-bold bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
						onClick={onOpenAddRequest}
					>
						<IconPlus className="size-3.5" />
						تسجيل متقدم جديد
					</Button>
				)}
			</div>
		</div>
	);
}
