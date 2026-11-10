import type { ReactNode } from "react";
import { toast } from "sonner";

/**
 * دالة موحدة لإظهار إشعار النجاح عبر محرك Sonner الموحد.
 * تستفيد تلقائيًا من زر الإغلاق الموحد (X)، أيقونة النجاح المعتمدة، وتدعم خيارات التخصيص.
 */
export function showSuccessToast(
	message: string,
	opts?: {
		textClassName?: string;
		cardClassName?: string;
		iconClassName?: string;
		iconAtStart?: boolean;
		icon?: ReactNode;
		duration?: number;
	},
) {
	if (opts?.icon) {
		return toast(message, {
			icon: opts.icon,
			duration: opts.duration ?? 5000,
		});
	}
	return toast.success(message, {
		duration: opts.duration ?? 5000,
	});
}
