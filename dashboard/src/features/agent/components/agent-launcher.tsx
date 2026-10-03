import {
	IconCalendarClock,
	IconCalendarPlus,
	IconCalendarUser,
	IconChecklist,
	IconChevronLeft,
	IconClipboardText,
	IconFileText,
	IconIdBadge2,
	IconListCheck,
	IconListSearch,
	IconReport,
	IconSparkles,
	IconUserPlus,
	IconUserSearch,
	IconUsers,
	type TablerIcon,
} from "@tabler/icons-react";

import { useAgentPresets } from "@/features/agent/hooks/use-agent-presets";
import { useAgentPanelStore } from "@/features/agent/stores/agent-panel.store";
import type { ActionPreset } from "@/features/agent/types/preset.types";
import { useI18n } from "@/hooks/use-i18n";

// أيقونة كل أمر في الشريحة (حسب مفتاحه)
const PRESET_ICON: Record<string, TablerIcon> = {
	"add-employee": IconUserPlus,
	"create-visit": IconCalendarPlus,
	"add-patient": IconUsers,
	"find-patient": IconListSearch,
	"list-visits": IconClipboardText,
	"my-visits": IconCalendarUser,
	"reschedule-visit": IconCalendarClock,
	"weekly-summary": IconReport,
	"my-tasks": IconListCheck,
	"create-task": IconChecklist,
	"create-owner": IconUserPlus,
	"find-staff": IconUserSearch,
	"list-leave-requests": IconIdBadge2,
};

// شريحة أمر واحدة — مطابقة لتصميم Figma (node 4063:413744):
// خلفية #f7f9fb، حواف 5px، مؤشّر دائري (سهم) على اليمين ونص 12px، وأيقونة الفئة على اليسار
const PresetChip = ({ preset, onSelect }: { preset: ActionPreset; onSelect: () => void }) => {
	const Icon = PRESET_ICON[preset.key] ?? IconFileText;
	return (
		<button
			type="button"
			onClick={onSelect}
			className="flex h-7 items-center gap-1.5 rounded-[4px] bg-[#f7f9fb] px-[7px] py-1"
		>
			{/* المؤشّر الدائري (سهم) */}
			<Icon className="size-5 text-[#1c1c1c]" />
			<span className="text-[12px] leading-4 text-[#1c1c1c]">{preset.title}</span>
			<span className="flex size-[18px] mr-3 items-center border-2 border-[#1c1c1c] rounded-full justify-center">
				<IconChevronLeft className="size-3.5 transform rotate-45 text-[#1c1c1c]" />
			</span>
		</button>
	);
};

// شاشة البداية — مطابقة لتصميم Figma (frame 4060):
// أيقونة + ترحيب + زر "إضافة أول مهارة" + صفّ شرائح أوامر بخلفية فاتحة
export const AgentLauncher = () => {
	const { t } = useI18n();
	const { presets } = useAgentPresets();
	const selectPreset = useAgentPanelStore((s) => s.selectPreset);

	// أول 4 أوامر (مرتّبة أصلًا حسب السياق على الخادم)
	const suggested = presets.slice(0, 4);

	return (
		<div className="flex flex-1 flex-col items-center justify-center gap-4 px-4">
			{/* أيقونة داخل إطار صغير */}
			<div className="flex size-9 items-center justify-center rounded-[4px] border-[0.5px] border-[#ededed] bg-white">
				<IconSparkles className="size-6 text-primary" />
			</div>

			<div className="flex flex-col items-center gap-3">
				<div className="flex flex-col items-center gap-1.5">
					<p className="text-center text-[18px] font-bold leading-8 text-[#08090a]">
						{t("agent.greeting")}
					</p>
					<p className="max-w-[340px] text-center text-[14px] font-medium leading-6 text-[#08090a]">
						{t("agent.greetingSubtitle")}
					</p>
				</div>

				<button
					type="button"
					className="flex h-9 items-center justify-center rounded-[4px] border border-[#ededed] bg-white px-4 text-[14px] font-medium text-[#08090a]"
				>
					{t("agent.addFirstSkill")}
				</button>
			</div>

			{/* صفّ الأوامر المقترحة */}
			<div className="flex flex-wrap items-center justify-center gap-[10px]">
				{suggested.map((preset) => (
					<PresetChip
						key={preset.key}
						preset={preset}
						onSelect={() => selectPreset(preset)}
					/>
				))}
			</div>
		</div>
	);
};
