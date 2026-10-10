import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";

import { Container, ContainerRow } from "@/components/common/container";
import { Switch } from "@/components/ui/switch";
import {
	useAgentSettings,
	useUpdateAgentSettings,
} from "@/features/settings/agents/hooks/use-agent-settings";
import { SettingsPageWrapper } from "@/features/settings/components/settings-page-wrapper";

// صفحة إعدادات "مساعد أونكس العام" (frame 4175)
export const GeneralAssistantView = () => {
	const { settings } = useAgentSettings();
	const { updateSettings, isPending } = useUpdateAgentSettings();

	return (
		<SettingsPageWrapper>
			{/* رجوع + مسار */}
			<div className="flex items-center gap-1 text-xs text-muted-foreground">
				<Link
					to="/management/settings/ai-agents"
					className="flex items-center gap-1 hover:text-foreground"
				>
					<IconChevronRight className="size-4" />
					عودة
				</Link>
				<span className="mx-1">/</span>
				<span>الذكاء الاصطناعي والوكلاء › مساعد أونكس العام</span>
			</div>

			{/* العنوان */}
			<div className="flex flex-col gap-1">
				<h2 className="text-lg font-bold text-foreground">مساعد أونكس العام</h2>
				<p className="text-xs text-muted-foreground">
					إنشاء المهام بالأوامر والإجابة عن الأسئلة حول النظام.
				</p>
			</div>

			{/* مفاتيح المساعد */}
			<Container>
				<ContainerRow
					title="تفعيل وكيل أونكس العام"
					subtitle="السماح بالمحادثات وإنشاء المهام داخل نظامك."
					action={
						<Switch
							checked={settings?.generalAssistantEnabled ?? false}
							onCheckedChange={(v) => updateSettings({ generalAssistantEnabled: v })}
							disabled={isPending || !settings}
						/>
					}
				/>
				<ContainerRow
					title="تفعيل البحث في الويب"
					subtitle="السماح للوكيل بالبحث في الإنترنت للحصول على معلومات حديثة عند الحاجة."
					action={
						<Switch
							checked={settings?.webSearchEnabled ?? false}
							onCheckedChange={(v) => updateSettings({ webSearchEnabled: v })}
							disabled={isPending || !settings}
						/>
					}
				/>
			</Container>

			{/* خوادم MCP */}
			<Container
				title="خوادم MCP"
				description="السماح لوكلاء أونكس بالوصول إلى خوادم MCP المتصلة من مستخدمي النظام، إدارة الخوادم من إعدادات التخصيص."
			>
				<ContainerRow
					title="تفعيل خوادم MCP"
					subtitle="السماح للوكيل باستخدام خوادم MCP المتصلة داخل النظام."
					action={
						<Switch
							checked={settings?.mcpEnabled ?? false}
							onCheckedChange={(v) => updateSettings({ mcpEnabled: v })}
							disabled={isPending || !settings}
						/>
					}
				/>
				<ContainerRow
					title="الخوادم المسموح بها"
					subtitle="إدارة الخوادم MCP المسموح بالوصول عليها داخل هذا النظام."
					action={<IconChevronLeft className="size-4 text-muted-foreground" />}
				/>
			</Container>
		</SettingsPageWrapper>
	);
};
