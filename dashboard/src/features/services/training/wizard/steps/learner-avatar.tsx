import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { avatarColor, initialsOf } from "@/lib/avatar-color";
import { getFileUrl } from "@/lib/file-url";
import { cn } from "@/lib/utils";

// صورة المتدرّب: صورة S3 إن وُجدت، وإلا أحرف أولى بلون حتمي مشتق من الاسم.
export function LearnerAvatar({
	name,
	avatar,
	className,
}: {
	name: string;
	avatar?: string | null;
	className?: string;
}) {
	const color = avatarColor(name);
	return (
		<Avatar className={cn("size-10", className)}>
			<AvatarImage
				src={getFileUrl(avatar) ?? undefined}
				alt={name}
			/>
			<AvatarFallback
				className="text-[12px] font-semibold"
				style={{ backgroundColor: color.bg, color: color.fg }}
			>
				{initialsOf(name)}
			</AvatarFallback>
		</Avatar>
	);
}
