import { IconLock, IconX } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";

// توست لطيف بنمط الديزاين سيستم: ميزة مقفولة + رابط لصفحة إعداد الحضور والانصراف
export function showFeatureLockedToast({
	title,
	description,
	actionLabel = "الذهاب إلى الإعدادات",
}: {
	title: string;
	description: string;
	actionLabel?: string;
}) {
	toast.custom(
		(id) => (
			<div
				dir="rtl"
				className="flex w-[345px] items-start gap-2.5 rounded-[4px] border-[0.75px] border-[#E5E5E5] bg-white px-3 py-3 shadow-[0px_4px_24px_rgba(0,0,0,0.08)]"
			>
				<div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#F59E0B]/10">
					<IconLock className="size-4 text-[#F59E0B]" />
				</div>
				<div className="flex flex-1 flex-col gap-1 text-right">
					<span className="text-[12px] font-semibold leading-[18px] text-[#08090A]">
						{title}
					</span>
					<span className="text-[11px] leading-[16px] text-[#9B9B9D]">{description}</span>
					<Link
						to="/management/settings/attendance"
						onClick={() => toast.dismiss(id)}
						className="mt-0.5 text-[11px] font-semibold text-[#4F6AE0] hover:underline"
					>
						{actionLabel}
					</Link>
				</div>
				<button
					type="button"
					onClick={() => toast.dismiss(id)}
					aria-label="إغلاق"
					className="flex size-5 shrink-0 items-center justify-center rounded-[4px] text-[#9B9B9D] opacity-40 hover:opacity-100"
				>
					<IconX className="size-3" />
				</button>
			</div>
		),
		{ duration: 5000 },
	);
}
