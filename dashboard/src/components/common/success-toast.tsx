import { IconCircleCheckFilled, IconX } from "@tabler/icons-react";
import type { ReactNode } from "react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";

// توست نجاح بنمط الديزاين سيستم: بطاقة بيضاء + علامة صح خضراء + زر إغلاق — أسفل يسار الشاشة.
// textClassName يسمح بتخصيص لون/حجم النص (أخضر افتراضيًا، أو داكن حسب التصميم).
// iconAtStart يعكس الترتيب: علامة الصح يمينًا وزر الإغلاق يسارًا (Figma node 4571-481889).
// icon يستبدل علامة الصح بأيقونة أخرى (مثل الإرسال أو الحذف في وحدة الرسائل).
export function showSuccessToast(
	message: string,
	opts?: {
		textClassName?: string;
		cardClassName?: string;
		iconClassName?: string;
		iconAtStart?: boolean;
		icon?: ReactNode;
	},
) {
	const closeButton = (id: string | number) => (
		<button
			type="button"
			onClick={() => toast.dismiss(id)}
			aria-label="إغلاق"
			className="flex size-5 shrink-0 items-center justify-center rounded-[4px] text-[#9B9B9D] opacity-40 hover:opacity-100"
		>
			<IconX className="size-3" />
		</button>
	);

	const icon = opts?.icon ?? (
		<IconCircleCheckFilled
			className={cn("size-5 shrink-0 text-[#008A2E]", opts?.iconClassName)}
		/>
	);

	toast.custom(
		(id) => (
			<div
				dir="rtl"
				className={cn(
					"flex w-[345px] items-center gap-2 rounded-[4px] border-[0.75px] border-[#E5E5E5] bg-white px-1 py-3 shadow-[0px_4px_24px_rgba(0,0,0,0.08)]",
					opts?.cardClassName,
				)}
			>
				{/* في RTL أول عنصر يظهر يمينًا */}
				{opts?.iconAtStart ? icon : closeButton(id)}
				<span
					className={cn(
						"flex-1 text-right leading-5",
						opts?.textClassName ??
							"text-[13px] font-medium tracking-[-0.076px] text-[#008A2E]",
					)}
				>
					{message}
				</span>
				{opts?.iconAtStart ? closeButton(id) : icon}
			</div>
		),
		{ position: "bottom-left", duration: 4000 },
	);
}
