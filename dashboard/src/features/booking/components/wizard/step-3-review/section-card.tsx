import { IconPencil } from "@tabler/icons-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";

type SectionCardProps = {
	title: string;
	icon?: ReactNode;
	onEdit?: () => void;
	editLabel?: string;
	children: ReactNode;
};

export const SectionCard = ({
	title,
	icon,
	onEdit,
	editLabel,
	children,
}: SectionCardProps) => (
	<section className="flex flex-col gap-3">
		<div className="flex items-center justify-between gap-2">
			<h3 className="text-base font-semibold text-foreground">{title}</h3>

			{onEdit ? (
				<Button
					type="button"
					variant="ghost"
					size="icon"
					onClick={onEdit}
					aria-label={editLabel ?? `تعديل ${title}`}
					className="size-7 text-muted-foreground hover:text-foreground"
				>
					<IconPencil className="size-4" />
				</Button>
			) : icon ? (
				<span className="text-muted-foreground">{icon}</span>
			) : (
				<span />
			)}
		</div>
		<div className="rounded-xl border border-border bg-card/40 p-4">{children}</div>
	</section>
);

type ReviewRowProps = {
	label: string;
	value: ReactNode;
};

export const ReviewRow = ({ label, value }: ReviewRowProps) => (
	<div className="flex items-start justify-between gap-3 py-1.5 text-sm">
		<span className="text-muted-foreground">{label} :</span>
		<span className="font-medium text-foreground text-start">{value}</span>
	</div>
);
