import { CustomizeSheet } from "@/features/dashboard/components/customize-sheet";
import { formatHeaderDate, getGreeting } from "@/features/dashboard/utils/header";
import { useI18n } from "@/hooks/use-i18n";
import { useSession } from "@/lib/auth/client";

export function Header() {
	const { lang, t } = useI18n();
	const { data: session, isPending } = useSession();

	const now = new Date();
	const userName = session?.user?.name?.trim();
	const greeting = getGreeting(now, t);
	const formattedDate = formatHeaderDate(now, lang);

	if (isPending) {
		return null;
	}

	return (
		<div className="flex items-center justify-between rounded-[4px] border p-3">
			<div className="flex flex-col gap-1">
				<h1 className="text-lg font-bold">
					{userName ? `${greeting}، ${userName} 👋` : `${greeting} 👋`}
				</h1>
				<p className="text-sm">{formattedDate}</p>
			</div>

			<CustomizeSheet />
		</div>
	);
}
