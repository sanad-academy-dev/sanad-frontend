import { IconMoodEmpty } from "@tabler/icons-react";
import { useI18n } from "@/hooks/use-i18n";

export function NoResultsTableView() {
	const { t } = useI18n();

	return (
		<div className="flex flex-col items-center justify-center gap-2 py-8 text-muted-foreground">
			<IconMoodEmpty className="size-8 opacity-40" />
			<span className="text-sm">{t("table.noResults")}</span>
		</div>
	);
}
