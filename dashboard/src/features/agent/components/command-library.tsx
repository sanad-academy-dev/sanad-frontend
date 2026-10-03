import { IconChevronLeft, IconSearch } from "@tabler/icons-react";
import { useMemo, useState } from "react";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useAgentPresets } from "@/features/agent/hooks/use-agent-presets";
import { useAgentPanelStore } from "@/features/agent/stores/agent-panel.store";
import type { ActionPreset } from "@/features/agent/types/preset.types";
import { cn } from "@/lib/utils";

// مكتبة الأوامر — قائمة قابلة للبحث ومجمّعة بالوكيل الفرعي (frame 4230)
export const CommandLibrary = ({ trigger }: { trigger: React.ReactNode }) => {
	const [open, setOpen] = useState(false);
	const [q, setQ] = useState("");
	const { subAgents } = useAgentPresets();
	const selectPreset = useAgentPanelStore((s) => s.selectPreset);

	const groups = useMemo(() => {
		if (!q) return subAgents.filter((g) => g.presets.length > 0);
		return subAgents
			.map((g) => ({
				...g,
				presets: g.presets.filter((p) => p.title.includes(q) || p.description.includes(q)),
			}))
			.filter((g) => g.presets.length > 0);
	}, [subAgents, q]);

	const pick = (preset: ActionPreset) => {
		selectPreset(preset);
		setOpen(false);
		setQ("");
	};

	return (
		<Popover
			open={open}
			onOpenChange={setOpen}
		>
			<PopoverTrigger asChild>{trigger}</PopoverTrigger>
			<PopoverContent
				align="start"
				dir="rtl"
				className="w-96 p-2"
			>
				<div className="mb-2 flex items-center justify-between">
					<span className="text-sm font-semibold">مكتبة الأوامر</span>
				</div>
				<div className="mb-2 flex items-center gap-2 rounded-md border px-2">
					<IconSearch className="size-4 text-muted-foreground" />
					<input
						type="text"
						value={q}
						onChange={(e) => setQ(e.target.value)}
						placeholder="بحث باسم الأمر..."
						className="w-full bg-transparent py-2 text-start text-sm outline-none"
					/>
				</div>
				<div className="max-h-80 overflow-y-auto">
					{groups.length === 0 ? (
						<p className="px-2 py-3 text-center text-sm text-muted-foreground">
							لا توجد أوامر مطابقة
						</p>
					) : (
						groups.map((group) => (
							<div
								key={group.key}
								className="mb-1"
							>
								<p className="px-2 py-1 text-[11px] font-semibold text-muted-foreground">
									{group.title}
								</p>
								{group.presets.map((preset) => (
									<button
										key={preset.key}
										type="button"
										onClick={() => pick(preset)}
										className={cn(
											"flex w-full items-center justify-between rounded-md px-2 py-2 text-start hover:bg-muted",
										)}
									>
										<span className="text-sm font-medium">{preset.title}</span>
										<IconChevronLeft className="size-4 text-muted-foreground" />
									</button>
								))}
							</div>
						))
					)}
				</div>
			</PopoverContent>
		</Popover>
	);
};
