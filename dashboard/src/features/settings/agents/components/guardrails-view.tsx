import { IconChevronRight } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";

import { Switch } from "@/components/ui/switch";
import {
	useAgentSettings,
	useUpdateAgentSettings,
} from "@/features/settings/agents/hooks/use-agent-settings";
import { SettingsPageWrapper } from "@/features/settings/components/settings-page-wrapper";
import { GUARDRAILS } from "@sanad/contracts/runtime/server/agent/guardrails";

// صفحة "الحواجز السلوكية" (frame 4220) — مفاتيح تحكم سلوك الوكيل، محفوظة في قاعدة البيانات.
export const GuardrailsView = () => {
	const { settings } = useAgentSettings();
	const { updateSettings, isPending } = useUpdateAgentSettings();
	const enabled = settings?.enabledGuardrails ?? [];

	const toggle = (key: string, on: boolean) => {
		const next = on ? [...new Set([...enabled, key])] : enabled.filter((k) => k !== key);
		updateSettings({ enabledGuardrails: next });
	};

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
				<span>الذكاء الاصطناعي والوكلاء › الحواجز السلوكية</span>
			</div>

			{/* العنوان + الوصف */}
			<div className="flex flex-col gap-1">
				<h2 className="text-lg font-bold text-foreground">الحواجز السلوكية</h2>
				<p className="text-xs text-muted-foreground">
					حدّد السياسات والقيود التي تحكم سلوك وكيل الذكاء الاصطناعي داخل النظام، لضمان حماية
					بيانات الأكاديمية والالتزام بالسياسات الطبية.
				</p>
			</div>

			{/* قائمة الحواجز */}
			<div className="divide-y rounded-[4px] border">
				{GUARDRAILS.map((g) => {
					const isOn = enabled.includes(g.key);
					return (
						<div
							key={g.key}
							className="flex items-center gap-3 px-3 py-3"
						>
							{/* الصفحة RTL: أول عنصر يمينًا — النص ثم المفتاح، بلا justify مضاد */}
							<div className="flex flex-1 flex-col gap-0.5">
								<div className="flex items-center gap-1.5">
									<p className="text-[13px] font-bold text-[#08090a]">{g.title}</p>
									{g.enforcement === "gate" && (
										<span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[9px] text-primary">
											مُطبّق في الكود
										</span>
									)}
								</div>
								<p className="text-xs text-muted-foreground">{g.description}</p>
							</div>
							<Switch
								checked={isOn}
								onCheckedChange={(v) => toggle(g.key, v)}
								disabled={isPending || !settings}
							/>
						</div>
					);
				})}
			</div>
		</SettingsPageWrapper>
	);
};
