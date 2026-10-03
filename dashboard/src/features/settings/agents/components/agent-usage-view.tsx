import { IconChevronRight } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import { useState } from "react";

import { Container, ContainerRow } from "@/components/common/container";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { AddBalanceModal } from "@/features/settings/agents/components/add-balance-modal";
import { AgentUsageChart } from "@/features/settings/agents/components/agent-usage-chart";
import { AgentUsageLogTable } from "@/features/settings/agents/components/agent-usage-log-table";
import { SettingsPageWrapper } from "@/features/settings/components/settings-page-wrapper";

// صفحة "الاستخدام ورصيد الـ AI" (frame 4170)
export const AgentUsageView = () => {
	const [balance, setBalance] = useState(100);
	const [autoRefill, setAutoRefill] = useState(false);
	const [modalOpen, setModalOpen] = useState(false);

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
				<span>الذكاء الاصطناعي والوكلاء › الاستخدام ورصيد الـ AI</span>
			</div>

			{/* الرصيد */}
			<Container title="الرصيد">
				<ContainerRow
					title={`متاح ${balance.toFixed(2)} ر.س`}
					subtitle="رصيدك الحالي المتاح لتشغيل الوكلاء الذكيين."
					action={
						<Button
							type="button"
							size="sm"
							className="rounded-md"
							onClick={() => setModalOpen(true)}
						>
							إضافة رصيد
						</Button>
					}
				/>
				<ContainerRow
					title="إعادة شحن الرصيد تلقائي"
					subtitle="يعاد الشحن تلقائيًا عند انخفاض الرصيد."
					action={
						<Switch
							checked={autoRefill}
							onCheckedChange={setAutoRefill}
						/>
					}
				/>
			</Container>

			{/* إجمالي الإنفاق */}
			<div className="flex flex-col gap-3">
				<div className="flex items-center justify-between">
					<p className="text-lg font-bold">إجمالي الإنفاق</p>
					<span className="rounded-md border px-3 py-1 text-xs text-muted-foreground">
						6 - 12 يوليو
					</span>
				</div>
				<div className="rounded-[4px] border p-4">
					<AgentUsageChart />
				</div>
			</div>

			{/* سجل الاستخدام */}
			<div className="flex flex-col gap-3">
				<div>
					<p className="text-lg font-bold">سجل الاستخدام</p>
					<p className="text-xs text-muted-foreground">
						آخر 7 عمليات منفذة بواسطة الوكلاء الذكيين.
					</p>
				</div>
				<AgentUsageLogTable />
			</div>

			<AddBalanceModal
				open={modalOpen}
				onOpenChange={setModalOpen}
				onAdd={(amount) => setBalance((b) => b + amount)}
			/>
		</SettingsPageWrapper>
	);
};
