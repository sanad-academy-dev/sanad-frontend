import { IconBookmark, IconBookmarkPlus, IconX } from "@tabler/icons-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useReportPresets } from "@/features/accounting/reports/stores/report-presets.store";

/**
 * [P12.11] Saved filter presets for one report. Generic by design — `values` is the screen's
 * own filter state serialized as strings, so a report that gains a filter needs no change
 * here and no store migration.
 *
 * RTL: the popover portals, so it carries `dir="rtl"` explicitly (contract §9 — portaled
 * Radix content does not inherit `<html dir>`).
 */

export const ReportPresetBar = ({
	reportKey,
	values,
	onApply,
}: {
	reportKey: string;
	/** the screen's current filters, serialized */
	values: Record<string, string>;
	onApply: (values: Record<string, string>) => void;
}) => {
	const { presets, savePreset, deletePreset } = useReportPresets(reportKey);
	const [name, setName] = useState("");
	const [open, setOpen] = useState(false);

	return (
		<div className="flex items-center gap-1">
			{presets.map((preset) => (
				<span
					key={preset.id}
					className="flex items-center gap-0.5 rounded-full border border-border ps-2 pe-0.5 text-xs"
				>
					<button
						type="button"
						className="py-0.5 text-muted-foreground hover:text-foreground"
						onClick={() => onApply(preset.values)}
					>
						{preset.name}
					</button>
					<Button
						type="button"
						variant="ghost"
						size="icon-xs"
						aria-label={`حذف ${preset.name}`}
						onClick={() => deletePreset(preset.id)}
					>
						<IconX className="size-3" />
					</Button>
				</span>
			))}

			<Popover
				open={open}
				onOpenChange={setOpen}
			>
				<PopoverTrigger asChild>
					<Button
						type="button"
						variant="outline"
						size="xs"
						className="gap-1.5 px-2"
					>
						{presets.length > 0 ? (
							<IconBookmark className="size-3.5" />
						) : (
							<IconBookmarkPlus className="size-3.5" />
						)}
						حفظ العرض
					</Button>
				</PopoverTrigger>
				<PopoverContent
					dir="rtl"
					className="w-64"
					align="start"
				>
					<p className="mb-2 text-muted-foreground text-xs">
						يحفظ الفلاتر الحالية باسم، محليًّا على هذا المتصفّح.
					</p>
					<div className="flex items-center gap-1">
						<Input
							value={name}
							onChange={(event) => setName(event.target.value)}
							placeholder="اسم العرض"
							className="h-8"
						/>
						<Button
							type="button"
							size="xs"
							disabled={!name.trim()}
							onClick={() => {
								savePreset(name, values);
								setName("");
								setOpen(false);
							}}
						>
							حفظ
						</Button>
					</div>
				</PopoverContent>
			</Popover>
		</div>
	);
};
