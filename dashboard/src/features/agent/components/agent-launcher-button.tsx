import { IconSparkles } from "@tabler/icons-react";

import { HEADER_ICON_BUTTON } from "@/components/common/header-icon-button";
import { Button } from "@/components/ui/button";
import { useAgentPanelStore } from "@/features/agent/stores/agent-panel.store";
import { useAgentSettings } from "@/features/settings/agents/hooks/use-agent-settings";
import { useI18n } from "@/hooks/use-i18n";
import { cn } from "@/lib/utils";

export const AgentLauncherButton = () => {
	const { t } = useI18n();
	const toggle = useAgentPanelStore((s) => s.toggle);
	const { settings, isLoading } = useAgentSettings();

	// نُخفي الزر إن كان المساعد مُطفأً (أو أثناء تحميل الإعدادات لتفادي وميض)
	if (isLoading || !settings?.generalAssistantEnabled) return null;

	return (
		<Button
			type="button"
			variant="outline"
			size="icon-sm"
			className={cn(
				HEADER_ICON_BUTTON,
				"border-primary text-primary hover:bg-primary/10 hover:text-primary",
			)}
			aria-label={t("agent.open")}
			onClick={toggle}
		>
			<IconSparkles />
		</Button>
	);
};
