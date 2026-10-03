import { IconChevronLeft, IconPointFilled, IconSparkles } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";

import { Switch } from "@/components/ui/switch";
import { GENERAL_SETTINGS, SUB_AGENTS } from "@/features/settings/agents/data/sub-agents";
import {
	useAgentSettings,
	useUpdateAgentSettings,
} from "@/features/settings/agents/hooks/use-agent-settings";
import { SettingsPageWrapper } from "@/features/settings/components/settings-page-wrapper";
import { cn } from "@/lib/utils";

// الصفحة الرئيسية لإعدادات "الذكاء الاصطناعي والوكلاء" (frame 4103)
export const AgentSettingsView = () => {
	const { settings } = useAgentSettings();
	const { updateSettings, isPending } = useUpdateAgentSettings();
	const generalEnabled = settings?.generalAssistantEnabled ?? false;

	return (
		<SettingsPageWrapper>
			{/* عنوان القسم */}
			<div className="flex flex-col gap-1">
				<h2 className="text-lg font-bold text-foreground">
					الذكاء الاصطناعي والوكلاء (AI & Agents)
				</h2>
				<p className="text-xs text-muted-foreground">
					قم بإدارة الوكلاء وربطهم ومنحهم صلاحيات النظام، وتخصيص قدراتهم، ومراقبة استخدامهم،
					سير عمل النظام.
				</p>
			</div>

			{/* بطاقة الرصيد */}
			<Link
				to="/management/settings/ai-agents-usage"
				className="flex items-center justify-between rounded-[4px] border px-4 py-3 transition-colors hover:bg-muted/50"
			>
				<div className="flex items-center gap-3">
					<div className="flex size-8 items-center justify-center rounded-[4px] bg-[#f5f5f5]">
						<IconSparkles className="size-4 text-primary" />
					</div>
					<div className="space-y-0.5">
						<p className="text-sm font-bold">استخدام ورصيد الـ AI</p>
						<p className="text-xs text-muted-foreground">
							تتبّع وأدر استخدام ميزات الـ AI والرصيد داخل أكاديميتك.
						</p>
					</div>
				</div>
				<div className="flex items-center gap-2">
					<span className="text-sm text-muted-foreground">متاح 00.00 ر.س</span>
					<IconChevronLeft className="size-4 text-muted-foreground" />
				</div>
			</Link>

			{/* الوكلاء للتشغيل */}
			<section className="flex flex-col gap-3">
				<div className="flex items-center gap-2">
					<h3 className="text-sm font-bold">الوكلاء للتشغيل</h3>
					<span className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
						معاينة
					</span>
				</div>
				<p className="text-xs text-muted-foreground">
					الوكلاء الذكيّون العاملون داخل النظام — اضغط لتخصيص إعداداتهم.
				</p>

				<div className="divide-y rounded-[4px] border">
					{SUB_AGENTS.map((agent) => {
						// الوكيل العام: صف حقيقي — تبديل تشغيل + رابط لصفحة الإعدادات
						const isGeneral = agent.key === "general";
						const enabled = isGeneral ? generalEnabled : agent.enabled;

						const rowInner = (
							<>
								<div className="flex items-center gap-3">
									<div className="flex size-8 items-center justify-center rounded-[4px] bg-[#f5f5f5]">
										<agent.icon className="size-4 text-foreground" />
									</div>
									<div className="space-y-0.5">
										<p className="text-xs font-bold">{agent.title}</p>
										<p className="text-xs text-muted-foreground">{agent.description}</p>
									</div>
								</div>
								<div className="flex shrink-0 items-center gap-2">
									{isGeneral ? (
										<Switch
											checked={generalEnabled}
											onCheckedChange={(v) => updateSettings({ generalAssistantEnabled: v })}
											disabled={isPending || !settings}
											onClick={(e) => e.stopPropagation()}
										/>
									) : (
										<span
											className={cn(
												"flex items-center gap-1 text-[11px]",
												enabled ? "text-emerald-600" : "text-muted-foreground",
											)}
										>
											{enabled && <IconPointFilled className="size-3" />}
											{enabled ? "مفعّل" : "متاح للربط"}
										</span>
									)}
									<IconChevronLeft className="size-4 text-muted-foreground" />
								</div>
							</>
						);

						// الوكيل العام صف قابل للنقر (Link)؛ الباقي أزرار عرض فقط
						return isGeneral ? (
							<Link
								key={agent.key}
								to="/management/settings/ai-agents-general"
								className="flex w-full items-center justify-between px-3 py-2.5 text-start transition-colors hover:bg-muted/40"
							>
								{rowInner}
							</Link>
						) : (
							<button
								key={agent.key}
								type="button"
								className="flex w-full items-center justify-between px-3 py-2.5 text-start transition-colors hover:bg-muted/40"
							>
								{rowInner}
							</button>
						);
					})}
				</div>
			</section>

			{/* إعدادات الذكاء الاصطناعي العامة */}
			<section className="flex flex-col gap-3">
				<h3 className="text-sm font-bold">إعدادات الذكاء الاصطناعي العامة</h3>
				<p className="text-xs text-muted-foreground">
					الأوامر الأكثر استخدامًا — اضغط لتخصيص الـ Prompt.
				</p>

				<div className="divide-y rounded-[4px] border">
					{GENERAL_SETTINGS.map((row) => {
						const rowInner = (
							<>
								<div className="space-y-0.5">
									<p className="text-xs font-bold">{row.title}</p>
									<p className="text-xs text-muted-foreground">{row.description}</p>
								</div>
								<div className="flex shrink-0 items-center gap-2">
									<span className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
										{row.badge}
									</span>
									<IconChevronLeft className="size-4 text-muted-foreground" />
								</div>
							</>
						);
						// صف "الحواجز السلوكية" يفتح صفحته الحقيقية
						return row.key === "guardrails" ? (
							<Link
								key={row.key}
								to="/management/settings/ai-agents-guardrails"
								className="flex w-full items-center justify-between px-3 py-2.5 text-start transition-colors hover:bg-muted/40"
							>
								{rowInner}
							</Link>
						) : (
							<button
								key={row.key}
								type="button"
								className="flex w-full items-center justify-between px-3 py-2.5 text-start transition-colors hover:bg-muted/40"
							>
								{rowInner}
							</button>
						);
					})}
				</div>
			</section>
		</SettingsPageWrapper>
	);
};
