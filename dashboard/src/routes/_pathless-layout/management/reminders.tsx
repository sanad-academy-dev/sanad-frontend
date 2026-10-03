import { IconPlus, IconRefresh, IconSend } from "@tabler/icons-react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { Stats } from "@/components/common/stats";
import { TableToolbar } from "@/components/common/table-toolbar";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { JobsTable } from "@/features/reminders/components/jobs-table";
import { LogContactDialog } from "@/features/reminders/components/log-contact-dialog";
import { OutboxTable } from "@/features/reminders/components/outbox-table";
import { PreviewDialog } from "@/features/reminders/components/preview-dialog";
import { RecallBoard } from "@/features/reminders/components/recall-board";
import { RemindersHeader } from "@/features/reminders/components/reminders-header";
import { RuleSheet } from "@/features/reminders/components/rule-sheet";
import { RulesTable } from "@/features/reminders/components/rules-table";
import {
	ALL_TRIGGERS,
	REMINDER_TABS,
	type ReminderTab,
} from "@/features/reminders/data/reminders";
import {
	useOutbox,
	useOutboxActions,
	useRecallBoard,
	useReminderMeta,
	useReminderRules,
	useRuleMutations,
	useRulePreview,
	useRunRule,
	useRunScheduler,
	useSchedulerJobs,
} from "@/features/reminders/hooks/use-reminders";
import type { OutboxStatus } from "@/generated/prisma/enums";
import { usePermissions } from "@/hooks/use-permissions";
import type {
	RecallItem,
	RecallOwnerRow,
	ReminderRuleResponse,
} from "@/server/reminders/reminders.type";

/**
 * [RC0] شاشة التذكيرات والاستدعاء.
 *
 * أربعة تبويبات تتبع مسار المعلومة نفسه: **من نتّصل به** (الطاولة) ← **بأيّ
 * قاعدة** ← **ماذا خرج** (الصندوق الصادر) ← **هل عمل المُجدوِل**. وترتيبُها هو
 * ترتيب السؤال حين يتعطّل شيء.
 *
 * وحالة الشاشة تعيش في الرابط كما في لوحتَي الطوارئ والتنويم: تُشارَك وتُعاد
 * بحالتها بعد التحديث.
 */

type RemindersSearch = {
	tab: ReminderTab;
	q: string;
	trigger: string;
	horizon: string;
	handled: boolean;
	status: string;
};

export const Route = createFileRoute("/_pathless-layout/management/reminders")({
	validateSearch: (search): RemindersSearch => {
		const raw = search as Record<string, unknown>;
		const tab = REMINDER_TABS.some((t) => t.value === raw.tab)
			? (raw.tab as ReminderTab)
			: "recall";
		return {
			tab,
			q: String(raw.q ?? "").slice(0, 120),
			trigger: String(raw.trigger ?? ALL_TRIGGERS),
			horizon: String(raw.horizon ?? "14"),
			handled: raw.handled === true || raw.handled === "true",
			status: String(raw.status ?? "ALL"),
		};
	},
	component: RouteComponent,
});

function RouteComponent() {
	const { tab, q, trigger, horizon, handled, status } = Route.useSearch();
	const navigate = useNavigate({ from: Route.fullPath });
	const setSearch = (patch: Partial<RemindersSearch>) =>
		navigate({ search: (prev) => ({ ...prev, ...patch }), replace: true });

	const { hasPermission, isAdmin } = usePermissions();
	const canSend = isAdmin || hasPermission("reminders.send_reminders");
	const canEdit = isAdmin || hasPermission("reminders.update");
	const canRun = isAdmin || hasPermission("reminders.run");

	const { triggers, channels, templateTags } = useReminderMeta();
	const triggerLabels = useMemo(
		() => Object.fromEntries(triggers.map((t) => [t.key, t.label])),
		[triggers],
	);
	const channelLabels = useMemo(
		() => Object.fromEntries(channels.map((c) => [c.key, c.label])),
		[channels],
	);

	// ── الطاولة ──────────────────────────────────────────────────────────────
	const recall = useRecallBoard({
		q,
		horizonDays: horizon,
		triggers: trigger === ALL_TRIGGERS ? undefined : trigger,
		includeHandled: handled,
		includeSnoozed: handled,
	});

	const [contactTarget, setContactTarget] = useState<{
		row: RecallOwnerRow;
		item: RecallItem | null;
	} | null>(null);

	// ── القواعد ──────────────────────────────────────────────────────────────
	const { rules, isLoading: rulesLoading } = useReminderRules();
	const { toggleRule, deleteRule } = useRuleMutations();
	const { runRule } = useRunRule();
	const preview = useRulePreview();

	const [ruleSheet, setRuleSheet] = useState<{
		open: boolean;
		rule: ReminderRuleResponse | null;
	}>({ open: false, rule: null });
	const [previewRule, setPreviewRule] = useState<ReminderRuleResponse | null>(null);

	// ── الصندوق الصادر والمُجدوِل ────────────────────────────────────────────
	const { messages, isLoading: outboxLoading } = useOutbox({
		// المرشِّح يعيش في الرابط نصًّا، والخادم يقبل تعدادًا — فالتضييق هنا عند الحدّ
		status: status === "ALL" ? undefined : (status as OutboxStatus),
	});
	const { markSent, cancelMessage, dispatchNow } = useOutboxActions();
	const { jobs, isLoading: jobsLoading } = useSchedulerJobs();
	const { runNow } = useRunScheduler();

	const openPreview = async (rule: ReminderRuleResponse) => {
		setPreviewRule(rule);
		await preview.preview({ id: rule.id, limit: 10 }).catch(() => undefined);
	};

	return (
		<div className="flex min-h-0 flex-1 flex-col">
			<RemindersHeader
				active={tab}
				onChange={(next) => setSearch({ tab: next })}
			/>

			{tab === "recall" && (
				<>
					<Stats
						className="px-4"
						stats={recall.statItems}
					/>

					<TableToolbar
						searchValue={q}
						onSearchChange={(value) => setSearch({ q: value })}
						searchPlaceholder="ابحث باسم وليّ الأمر أو الطفل أو الهاتف..."
						showFilter={false}
						leftExtra={
							<>
								<Select
									value={trigger}
									onValueChange={(value) => setSearch({ trigger: value })}
								>
									<SelectTrigger
										size="sm"
										className="w-44"
									>
										<SelectValue />
									</SelectTrigger>
									{/* position="popper" لازم في RTL — الافتراضي يُصيّر خارج الشاشة */}
									<SelectContent position="popper">
										<SelectItem value={ALL_TRIGGERS}>كل الأسباب</SelectItem>
										{triggers.map((t) => (
											<SelectItem
												key={t.key}
												value={t.key}
											>
												{t.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>

								<Select
									value={horizon}
									onValueChange={(value) => setSearch({ horizon: value })}
								>
									<SelectTrigger
										size="sm"
										className="w-32"
									>
										<SelectValue />
									</SelectTrigger>
									<SelectContent position="popper">
										<SelectItem value="7">٧ أيام</SelectItem>
										<SelectItem value="14">١٤ يومًا</SelectItem>
										<SelectItem value="30">٣٠ يومًا</SelectItem>
										<SelectItem value="90">٩٠ يومًا</SelectItem>
									</SelectContent>
								</Select>

								{/*
								  ليست <label>: `Switch` زرّ Radix لا <input>، فالربط الذي تفحصه
								  قاعدة a11y لا يتحقّق أصلًا. الوسمُ يُقدَّم للقارئ الآلي عبر
								  `aria-label` على الزرّ نفسه، وهو ما يعمل فعلًا.
								*/}
								<div className="flex items-center gap-2 text-muted-foreground text-xs">
									<Switch
										size="sm"
										checked={handled}
										aria-label="أظهر ما عُولج والمؤجَّل"
										onCheckedChange={(checked) => setSearch({ handled: checked })}
									/>
									<span>أظهر ما عُولج والمؤجَّل</span>
								</div>
							</>
						}
						actions={
							<Button
								size="sm"
								variant="outline"
								disabled={recall.isFetching}
								onClick={() => void recall.refetch()}
							>
								<IconRefresh className="size-4" />
								تحديث
							</Button>
						}
					/>

					<div className="min-h-0 flex-1 overflow-y-auto">
						<RecallBoard
							rows={recall.rows}
							isLoading={recall.isLoading}
							canAct={canSend}
							onLogContact={(row, item) => setContactTarget({ row, item })}
							onMarkSent={(id) => void markSent(id)}
						/>
					</div>
				</>
			)}

			{tab === "rules" && (
				<>
					<TableToolbar
						searchValue=""
						searchPlaceholder="القواعد"
						showFilter={false}
						showExport={false}
						showView={false}
						actions={
							canEdit ? (
								<Button
									size="sm"
									onClick={() => setRuleSheet({ open: true, rule: null })}
								>
									<IconPlus className="size-4" />
									قاعدة جديدة
								</Button>
							) : undefined
						}
					/>
					<div className="min-h-0 flex-1 overflow-y-auto">
						<RulesTable
							rules={rules}
							isLoading={rulesLoading}
							channelLabels={channelLabels}
							triggerLabels={triggerLabels}
							canEdit={canEdit}
							canSend={canSend}
							onEdit={(rule) => setRuleSheet({ open: true, rule })}
							onPreview={(rule) => void openPreview(rule)}
							onRun={(rule) => void runRule(rule.id)}
							onToggle={(rule, active) => void toggleRule(rule.id, active)}
							onDelete={(rule) => void deleteRule(rule.id)}
						/>
					</div>
				</>
			)}

			{tab === "outbox" && (
				<>
					<TableToolbar
						searchValue=""
						searchPlaceholder="الصندوق الصادر"
						showFilter={false}
						showExport={false}
						showView={false}
						leftExtra={
							<Select
								value={status}
								onValueChange={(value) => setSearch({ status: value })}
							>
								<SelectTrigger
									size="sm"
									className="w-40"
								>
									<SelectValue />
								</SelectTrigger>
								<SelectContent position="popper">
									<SelectItem value="ALL">كل الحالات</SelectItem>
									<SelectItem value="QUEUED">بانتظار الموعد</SelectItem>
									<SelectItem value="AWAITING_MANUAL">بانتظار إرسالك</SelectItem>
									<SelectItem value="SENT">أُرسلت</SelectItem>
									<SelectItem value="SKIPPED">متعذّرة</SelectItem>
									<SelectItem value="FAILED">فشلت</SelectItem>
									<SelectItem value="CANCELLED">أُلغيت</SelectItem>
								</SelectContent>
							</Select>
						}
						actions={
							canSend ? (
								<Button
									size="sm"
									variant="outline"
									onClick={() => void dispatchNow()}
								>
									<IconSend className="size-4" />
									سلّم المستحق الآن
								</Button>
							) : undefined
						}
					/>
					<div className="min-h-0 flex-1 overflow-y-auto">
						<OutboxTable
							messages={messages}
							isLoading={outboxLoading}
							triggerLabels={triggerLabels}
							canAct={canSend}
							onMarkSent={(id) => void markSent(id)}
							onCancel={(id) => void cancelMessage(id)}
						/>
					</div>
				</>
			)}

			{tab === "jobs" && (
				<>
					<TableToolbar
						searchValue=""
						searchPlaceholder="المُجدوِل"
						showFilter={false}
						showExport={false}
						showView={false}
						actions={
							canRun ? (
								<Button
									size="sm"
									variant="outline"
									onClick={() => void runNow()}
								>
									<IconRefresh className="size-4" />
									شغّل الآن
								</Button>
							) : undefined
						}
					/>
					<div className="min-h-0 flex-1 overflow-y-auto">
						<JobsTable
							jobs={jobs}
							isLoading={jobsLoading}
						/>
					</div>
				</>
			)}

			<LogContactDialog
				open={Boolean(contactTarget)}
				onOpenChange={(open) => !open && setContactTarget(null)}
				row={contactTarget?.row ?? null}
				item={contactTarget?.item ?? null}
			/>

			<RuleSheet
				open={ruleSheet.open}
				onOpenChange={(open) => setRuleSheet((prev) => ({ ...prev, open }))}
				rule={ruleSheet.rule}
				channels={channels}
				triggerLabels={triggerLabels}
				templateTags={[...templateTags]}
			/>

			<PreviewDialog
				open={Boolean(previewRule)}
				onOpenChange={(open) => {
					if (!open) {
						setPreviewRule(null);
						preview.reset();
					}
				}}
				ruleName={previewRule?.name ?? ""}
				isPending={preview.isPending}
				summary={preview.result?.summary}
				rows={preview.result?.preview ?? []}
			/>
		</div>
	);
}
