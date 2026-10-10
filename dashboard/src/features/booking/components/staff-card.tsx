import { IconStarFilled, IconUserCircle } from "@tabler/icons-react";
import { getFileUrl } from "@/lib/file-url";
import { cn } from "@/lib/utils";
import type { PublicClinicStaffResponse } from "@/server/public/public.type";

const STATIC_YEARS_EXPERIENCE = 5;
const STATIC_RATING = 4.8;
const STATIC_REVIEW_COUNT = 120;

const getInitials = (name: string) =>
	name
		.trim()
		.split(/\s+/)
		.slice(0, 2)
		.map((part) => part[0])
		.join("")
		.toUpperCase();

type StaffCardProps = {
	staff: PublicClinicStaffResponse;
	selected: boolean;
	onSelect: () => void;
};

export const StaffCard = ({ staff, selected, onSelect }: StaffCardProps) => {
	const avatarUrl = getFileUrl(staff.avatar);
	const specialization = staff.primarySpecialization?.name ?? null;
	const displayName = staff.prefix ? `د. ${staff.name}` : staff.name;

	return (
		<button
			type="button"
			onClick={onSelect}
			aria-pressed={selected}
			className={cn(
				"flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-5 text-center transition-colors duration-150",
				"hover:bg-muted/40",
				selected && "bg-[#F2F2F2] hover:bg-[#F2F2F2]",
			)}
		>
			<div className="flex size-20 items-center justify-center overflow-hidden rounded-full bg-primary/10">
				{avatarUrl ? (
					<img
						src={avatarUrl}
						alt={displayName}
						className="size-full object-cover"
					/>
				) : staff.name ? (
					<span className="text-lg font-semibold text-primary">{getInitials(staff.name)}</span>
				) : (
					<IconUserCircle className="size-10 text-primary" />
				)}
			</div>

			<div className="flex flex-col gap-1">
				<h3 className="text-sm font-semibold text-foreground">{displayName}</h3>
				{specialization && <p className="text-xs text-muted-foreground">{specialization}</p>}
			</div>

			<p className="text-xs text-muted-foreground">{STATIC_YEARS_EXPERIENCE} سنوات خبرة</p>

			<div className="flex items-center gap-1 text-xs text-muted-foreground">
				<IconStarFilled className="size-3.5 text-amber-500" />
				<span className="font-medium text-foreground">{STATIC_RATING}</span>
				<span>({STATIC_REVIEW_COUNT})</span>
			</div>
		</button>
	);
};
