import { IconEye, IconPlayerPlay, IconTrash } from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { minutesToClock, offsetLabel } from "@/features/reminders/data/reminders";
import type { ReminderRuleResponse } from "@/server/reminders/reminders.type";

/**
 * [RC3] قواعد التذكير.
 *
 * مفتاح التفعيل في الصفّ مباشرةً لا داخل ورقة التحرير: «شغّل تذكير التطعيم» قرارٌ
 * من نقرة، وإخفاؤه خلف نموذجٍ من سبعة حقول يجعل الوحدة تبدو أثقل ممّا هي.
 *
 * وكل قاعدة تصل **مُطفأة**: وحدةٌ تبدأ بمراسلة أولياء أمور حقيقيّين لحظةَ الترحيل ليست
 * ميزةً بل حادثة.
 */
export function RulesTable({
	rules,
	isLoading,
	channelLabels,
	triggerLabels,
	onEdit,
	onPreview,
	onRun,
	onToggle,
	onDelete,
	canEdit,
	canSend,
}: {
	rules: ReminderRuleResponse[];
	isLoading: boolean;
	channelLabels: Record<string, string>;
	triggerLabels: Record<string, string>;
	onEdit: (rule: ReminderRuleResponse) => void;
	onPreview: (rule: ReminderRuleResponse) => void;
	onRun: (rule: ReminderRuleResponse) => void;
	onToggle: (rule: ReminderRuleResponse, active: boolean) => void;
	onDelete: (rule: ReminderRuleResponse) => void;
	canEdit: boolean;
	canSend: boolean;
}) {
	if (isLoading) {
		return (
			<div className="flex flex-col gap-2 p-4">
				{Array.from({ length: 5 }).map((_, i) => (
					<Skeleton
						key={i}
						className="h-12 w-full rounded-md"
					/>
				))}
			</div>
		);
	}

	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead className="w-[70px]">مُفعّلة</TableHead>
					<TableHead>القاعدة</TableHead>
					<TableHead>السبب</TableHead>
					<TableHead>التوقيت</TableHead>
					<TableHead>القنوات</TableHead>
					<TableHead>التكرار</TableHead>
					<TableHead>ساعات الهدوء</TableHead>
					<TableHead className="w-[150px]" />
				</TableRow>
			</TableHeader>
			<TableBody>
				{rules.map((rule) => (
					<TableRow key={rule.id}>
						<TableCell>
							<Switch
								size="sm"
								checked={rule.active}
								disabled={!canEdit}
								onCheckedChange={(checked) => onToggle(rule, checked)}
								aria-label={`تفعيل ${rule.name}`}
							/>
						</TableCell>

						<TableCell>
							<button
								type="button"
								className="text-start font-medium text-sm hover:underline"
								onClick={() => onEdit(rule)}
							>
								{rule.name}
							</button>
						</TableCell>

						<TableCell>
							<Badge
								variant="outline"
								className="text-xs"
							>
								{triggerLabels[rule.trigger] ?? rule.trigger}
							</Badge>
						</TableCell>

						<TableCell className="whitespace-nowrap text-sm">
							{offsetLabel(rule.offsetHours)}
							<span className="block text-muted-foreground text-xs">
								مدى {rule.horizonDays} يوم
							</span>
						</TableCell>

						<TableCell>
							<div className="flex flex-wrap gap-1">
								{rule.channels.map((channel) => (
									<Badge
										key={channel}
										variant="secondary"
										className="text-xs"
									>
										{channelLabels[channel] ?? channel}
									</Badge>
								))}
							</div>
						</TableCell>

						<TableCell className="whitespace-nowrap text-sm">
							{rule.repeatAfterDays
								? `كل ${rule.repeatAfterDays} يوم · حتى ${rule.maxSends}`
								: "مرة واحدة"}
						</TableCell>

						<TableCell className="whitespace-nowrap text-muted-foreground text-xs">
							{rule.quietHoursStart === null
								? "—"
								: `${minutesToClock(rule.quietHoursStart)} → ${minutesToClock(rule.quietHoursEnd)}`}
						</TableCell>

						<TableCell>
							<div className="flex items-center justify-end gap-1">
								<Tooltip>
									<TooltipTrigger asChild>
										<Button
											size="icon-sm"
											variant="ghost"
											onClick={() => onPreview(rule)}
										>
											<IconEye className="size-4" />
										</Button>
									</TooltipTrigger>
									<TooltipContent>معاينة — لا يُرسَل شيء</TooltipContent>
								</Tooltip>

								{canSend && (
									<Tooltip>
										<TooltipTrigger asChild>
											<Button
												size="icon-sm"
												variant="ghost"
												onClick={() => onRun(rule)}
											>
												<IconPlayerPlay className="size-4" />
											</Button>
										</TooltipTrigger>
										<TooltipContent>
											تشغيل الآن — يُدرج الرسائل في الصندوق الصادر
										</TooltipContent>
									</Tooltip>
								)}

								{canEdit && (
									<Tooltip>
										<TooltipTrigger asChild>
											<Button
												size="icon-sm"
												variant="ghost"
												onClick={() => onDelete(rule)}
											>
												<IconTrash className="size-4" />
											</Button>
										</TooltipTrigger>
										<TooltipContent>حذف القاعدة</TooltipContent>
									</Tooltip>
								)}
							</div>
						</TableCell>
					</TableRow>
				))}

				{rules.length === 0 && (
					<TableRow>
						<TableCell
							colSpan={8}
							className="py-12 text-center text-muted-foreground text-sm"
						>
							لا قواعد بعد.
						</TableCell>
					</TableRow>
				)}
			</TableBody>
		</Table>
	);
}
