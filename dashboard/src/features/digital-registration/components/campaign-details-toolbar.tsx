import {
	IconDownload,
	IconFilter,
	IconPlus,
	IconSearch,
	IconX,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
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
}: {
	searchValue?: string;
	onSearchChange?: (val: string) => void;
	genderFilter?: string;
	onGenderFilterChange?: (val: string) => void;
	onOpenAddRequest?: () => void;
	onExport?: () => void;
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
					<Button
						type="button"
						size="sm"
						variant="outline"
						className="h-8 gap-1.5 text-xs font-normal hover:bg-muted"
						onClick={onExport}
					>
						<IconDownload className="size-3.5 text-muted-foreground" />
						تصدير المتقدمين
					</Button>
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
