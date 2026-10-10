import { useState } from "react";
import { toast } from "sonner";

import { Switch } from "@/components/ui/switch";
import type { InboxDesktopActionProps } from "@/features/settings/notifications/types/inbox-action.types";

/**
 * مفتاح إشعارات سطح المكتب — يطلب إذن المتصفّح قبل الحفظ.
 * لا نحفظ التفعيل إلّا بعد منح الإذن فعليًا، وإلّا بقي الإعداد مفعّلًا بلا أثر.
 */
export const InboxDesktopAction = ({
	desktopEnabled,
	isPending,
	onEnabledChange,
}: InboxDesktopActionProps) => {
	const [requesting, setRequesting] = useState(false);

	const handleChange = async (checked: boolean) => {
		if (!checked) {
			onEnabledChange(false);
			return;
		}

		if (typeof Notification === "undefined") {
			toast.error("متصفّحك لا يدعم إشعارات سطح المكتب");
			return;
		}

		if (Notification.permission === "denied") {
			toast.error("إشعارات سطح المكتب محظورة لهذا الموقع — فعّلها من إعدادات المتصفّح");
			return;
		}

		if (Notification.permission === "granted") {
			onEnabledChange(true);
			return;
		}

		setRequesting(true);
		try {
			const permission = await Notification.requestPermission();
			if (permission === "granted") {
				onEnabledChange(true);
			} else {
				toast.error("لم يُمنح إذن إشعارات سطح المكتب");
			}
		} finally {
			setRequesting(false);
		}
	};

	return (
		<Switch
			size="sm"
			checked={desktopEnabled}
			disabled={isPending || requesting}
			onCheckedChange={(checked) => void handleChange(checked)}
		/>
	);
};
