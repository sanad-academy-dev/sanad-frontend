import { IconSparkles } from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import { GROUP_LABELS, type RbacGroup } from "@sanad/contracts/runtime/lib/rbac/rbac-registry";
import {
	ROLE_TEMPLATES,
	type RoleTemplate,
	resolveTemplateGrants,
} from "@sanad/contracts/runtime/lib/rbac/rbac-role-templates";
import { cn } from "@/lib/utils";

/**
 * [RBAC P6] The ready-made roles, offered when creating one.
 *
 * A blank role against 447 permissions is a correct system nobody can operate — whoever
 * sets up a clinic knows "we need a receptionist", not which twenty-three keys that means.
 * Each card states the separation of duty it encodes, because the *omissions* are the point
 * of these templates: the cashier that cannot refund, the technician that cannot approve
 * their own results.
 *
 * Applying one produces an ordinary, fully editable role — not a special kind of role.
 */

type Props = {
	onPick: (templateKey: string) => void;
	onSkip: () => void;
	disabled?: boolean;
};

export const RoleTemplatePicker = ({ onPick, onSkip, disabled }: Props) => {
	const byGroup = new Map<RbacGroup, RoleTemplate[]>();
	for (const template of ROLE_TEMPLATES) {
		const bucket = byGroup.get(template.group);
		if (bucket) bucket.push(template);
		else byGroup.set(template.group, [template]);
	}

	return (
		<div className="flex flex-col gap-4">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<IconSparkles className="size-4 text-muted-foreground" />
					<span className="text-sm font-medium">ابدأ من دور جاهز</span>
				</div>
				<button
					type="button"
					className="text-sm text-muted-foreground underline-offset-4 hover:underline"
					onClick={onSkip}
					disabled={disabled}
				>
					أو ابدأ من دور فارغ
				</button>
			</div>

			{[...byGroup].map(([group, templates]) => (
				<div
					key={group}
					className="flex flex-col gap-2"
				>
					<h3 className="text-sm font-semibold text-foreground">{GROUP_LABELS[group].ar}</h3>
					<div className="grid gap-2 sm:grid-cols-2">
						{templates.map((template) => (
							<button
								key={template.key}
								type="button"
								onClick={() => onPick(template.key)}
								disabled={disabled}
								className={cn(
									"flex flex-col gap-1.5 rounded-lg border border-border p-3 text-start transition-colors",
									!disabled && "hover:border-primary/40 hover:bg-muted/40",
									disabled && "opacity-60",
								)}
							>
								<div className="flex items-center gap-2">
									<span className="text-sm font-medium">{template.labelAr}</span>
									<Badge
										variant="secondary"
										className="text-[10px]"
									>
										{resolveTemplateGrants(template).length} صلاحية
									</Badge>
								</div>
								<p className="text-xs leading-relaxed text-muted-foreground">
									{template.descriptionAr}
								</p>
							</button>
						))}
					</div>
				</div>
			))}
		</div>
	);
};
