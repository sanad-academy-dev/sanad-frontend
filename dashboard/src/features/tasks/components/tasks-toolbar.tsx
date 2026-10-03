import {
	IconBolt,
	IconDownload,
	IconFilter,
	IconLayoutGrid,
	IconQuestionMark,
	IconSearch,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Kbd } from "@/components/ui/kbd";
import { Separator } from "@/components/ui/separator";
import { AddTaskModal } from "@/features/tasks/components/add-task-modal";
import { useI18n } from "@/hooks/use-i18n";

export function TasksToolbar() {
	const { t } = useI18n();

	return (
		<div className="flex items-center justify-between gap-3 px-4">
			<div className="flex items-center gap-2">
				<InputGroup className="w-64">
					<InputGroupInput placeholder={t("tasks.toolbar.searchPlaceholder")} />
					<InputGroupAddon align="inline-end">
						<IconSearch />
					</InputGroupAddon>
					<InputGroupAddon align="inline-end">
						<Kbd className="text-primary bg-primary/10">/</Kbd>
						<IconBolt className="text-primary" />
					</InputGroupAddon>
				</InputGroup>

				<Separator
					orientation="vertical"
					className="h-5 my-auto"
				/>

				<Button
					size="sm"
					variant="outline"
				>
					<IconFilter />
					{t("tasks.toolbar.filter")}
				</Button>

				<Button
					size="sm"
					variant="outline"
				>
					<IconQuestionMark />
					{t("tasks.toolbar.help")}
				</Button>
				<Button
					size="sm"
					variant="outline"
				>
					<IconDownload />
					{t("tasks.toolbar.export")}
				</Button>
				<Button
					size="sm"
					variant="outline"
				>
					<IconLayoutGrid />
					{t("tasks.toolbar.view")}
				</Button>
			</div>

			<AddTaskModal />
		</div>
	);
}
