import { IconX } from "@tabler/icons-react";
import { useState } from "react";

interface AIInfoBannerProps {
	message: string;
}

export function AIInfoBanner({ message }: AIInfoBannerProps) {
	const [dismissed, setDismissed] = useState(false);

	if (dismissed) return null;

	return (
		<div className="flex items-start justify-between gap-3 rounded-lg border border-amber-200 bg-amber-50/60 p-3">
			<p className="text-sm text-amber-800">{message}</p>
			<button
				type="button"
				onClick={() => setDismissed(true)}
				aria-label="تجاهل"
				className="flex shrink-0 items-center gap-1 text-xs text-amber-700/80 hover:text-amber-700"
			>
				تجاهل
				<IconX className="size-3.5" />
			</button>
		</div>
	);
}
