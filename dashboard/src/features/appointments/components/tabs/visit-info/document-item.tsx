import { IconDots, IconExternalLink, IconFile, IconSparkles } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDeleteAppointmentDocument } from "@/features/appointments/hooks/use-delete-appointment-document";
import { cn } from "@/lib/utils";
import type { AppointmentDocumentResponse } from "@/server/appointments/appointments.type";

interface DocumentItemProps {
	appointmentId: string;
	document: AppointmentDocumentResponse;
}

const dateFormatter = new Intl.DateTimeFormat("ar-SA", {
	day: "numeric",
	month: "long",
});

const dateFormatterWithYear = new Intl.DateTimeFormat("ar-SA", {
	day: "numeric",
	month: "long",
	year: "numeric",
});

function formatDate(value: Date) {
	const now = new Date();
	return value.getFullYear() === now.getFullYear()
		? dateFormatter.format(value)
		: dateFormatterWithYear.format(value);
}

export function DocumentItem({ appointmentId, document }: DocumentItemProps) {
	const { deleteDocument, isPending } = useDeleteAppointmentDocument(appointmentId);
	const isFile = document.kind === "FILE";
	const formatted = formatDate(new Date(document.createdAt));

	return (
		<div
			className={cn(
				"flex items-center gap-3 rounded-md border bg-card px-3 py-2",
				isPending && "opacity-50",
			)}
		>
			<a
				href={document.url}
				target="_blank"
				rel="noopener noreferrer"
				className="flex min-w-0 flex-1 items-center gap-3"
			>
				<span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
					{isFile ? <IconFile className="size-4" /> : <IconExternalLink className="size-4" />}
				</span>
				<span className="min-w-0 flex-1 truncate text-sm font-medium">{document.title}</span>
			</a>
			<span className="text-xs text-muted-foreground">{formatted}</span>
			<IconSparkles className="size-3.5 text-indigo-500" />
			<DropdownMenu dir="rtl">
				<DropdownMenuTrigger asChild>
					<Button
						size="icon-xs"
						variant="ghost"
						className="size-7"
						disabled={isPending}
					>
						<IconDots className="size-3.5" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="start">
					<DropdownMenuItem
						onSelect={() => {
							void deleteDocument(document.id);
						}}
						disabled={isPending}
					>
						حذف
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
