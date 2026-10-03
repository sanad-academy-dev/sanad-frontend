import { IconChevronDown, IconChevronLeft, IconSearch } from "@tabler/icons-react";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { buildCatalogueGroups, type CatalogueResource } from "@sanad/contracts/runtime/lib/rbac/rbac-catalogue";
import type { PermissionScope } from "@sanad/contracts/runtime/lib/rbac/rbac-registry";
import { cn } from "@/lib/utils";

/**
 * [RBAC P6] The roles editor, rendered from the catalogue.
 *
 * Replaces an editor whose section list was a hardcoded array maintained separately from
 * the permissions it claimed to expose. That drift is why four sections shipped
 * "متاح قريباً" with empty toggles while their permissions were already enforced
 * server-side, and why the ~110 accounting permissions appeared **zero** times — making
 * them grantable to nobody but a super admin.
 *
 * Here every checkbox is generated, so a permission that exists is a permission you can
 * grant, always.
 */

/** key → scope. Absent key = not granted. */
export type GrantMap = Record<string, PermissionScope>;

type Props = {
	grants: GrantMap;
	onChange: (grants: GrantMap) => void;
	disabled?: boolean;
};

const SCOPE_LABELS: Record<PermissionScope, string> = {
	ALL: "كل الأكاديمية",
	BRANCH: "فرعه فقط",
	OWN: "سجلّاته فقط",
};

export const RbacPermissionsEditor = ({ grants, onChange, disabled }: Props) => {
	const groups = useMemo(() => buildCatalogueGroups(), []);
	const [search, setSearch] = useState("");

	const query = search.trim();
	const filtered = useMemo(() => {
		if (!query) return groups;
		return groups
			.map((group) => ({
				...group,
				resources: group.resources.filter(
					(resource) =>
						resource.labelAr.includes(query) ||
						resource.labelEn.toLowerCase().includes(query.toLowerCase()) ||
						resource.permissions.some((p) => p.key.includes(query)),
				),
			}))
			.filter((group) => group.resources.length > 0);
	}, [groups, query]);

	const grantedCount = Object.keys(grants).length;

	return (
		<div className="flex flex-col gap-3">
			<div className="flex items-center gap-3">
				<div className="relative flex-1">
					<IconSearch className="pointer-events-none absolute end-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
					<Input
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						placeholder="ابحث عن صلاحية أو وحدة..."
						className="pe-9"
						disabled={disabled}
					/>
				</div>
				<Badge variant="secondary">{grantedCount} صلاحية ممنوحة</Badge>
			</div>

			{filtered.length === 0 ? (
				<p className="py-8 text-center text-sm text-muted-foreground">
					لا توجد صلاحيات مطابقة لبحثك
				</p>
			) : (
				filtered.map((group) => (
					<div
						key={group.id}
						className="flex flex-col gap-2"
					>
						<h3 className="text-sm font-semibold text-foreground">{group.labelAr}</h3>
						{group.resources.map((resource) => (
							<ResourceRow
								key={resource.key}
								resource={resource}
								grants={grants}
								onChange={onChange}
								disabled={disabled}
								defaultOpen={Boolean(query)}
							/>
						))}
					</div>
				))
			)}
		</div>
	);
};

type ResourceRowProps = {
	resource: CatalogueResource;
	grants: GrantMap;
	onChange: (grants: GrantMap) => void;
	disabled?: boolean;
	defaultOpen: boolean;
};

const ResourceRow = ({
	resource,
	grants,
	onChange,
	disabled,
	defaultOpen,
}: ResourceRowProps) => {
	const [open, setOpen] = useState(defaultOpen);

	const held = resource.permissions.filter((p) => p.key in grants);
	const allHeld = held.length === resource.permissions.length;

	/**
	 * The scope is per-resource in the UI even though it is stored per-grant: an operator
	 * thinks "this role sees its own branch's appointments", not "…read at BRANCH but update
	 * at ALL". Storing it per grant keeps the model general; presenting it per resource keeps
	 * it comprehensible.
	 */
	const scope: PermissionScope = held[0] ? (grants[held[0].key] ?? "ALL") : "ALL";

	const setScope = (next: PermissionScope) => {
		const updated = { ...grants };
		for (const permission of resource.permissions) {
			if (permission.key in updated) updated[permission.key] = next;
		}
		onChange(updated);
	};

	const toggle = (key: string, enabled: boolean) => {
		const updated = { ...grants };
		if (enabled) updated[key] = scope;
		else delete updated[key];
		onChange(updated);
	};

	const toggleAll = () => {
		const updated = { ...grants };
		for (const permission of resource.permissions) {
			if (allHeld) delete updated[permission.key];
			else updated[permission.key] = scope;
		}
		onChange(updated);
	};

	return (
		<div className="rounded-lg border border-border">
			<div className="flex items-center gap-2 px-4 py-2">
				<button
					type="button"
					className="flex flex-1 items-center gap-2 text-start text-sm font-medium text-foreground"
					onClick={() => setOpen((o) => !o)}
					disabled={disabled}
				>
					{open ? (
						<IconChevronDown className="size-4 text-muted-foreground" />
					) : (
						<IconChevronLeft className="size-4 text-muted-foreground" />
					)}
					<span>{resource.labelAr}</span>
					{held.length > 0 && (
						<Badge
							variant="secondary"
							className="text-xs"
						>
							{held.length}/{resource.permissions.length}
						</Badge>
					)}
				</button>

				{held.length > 0 && resource.scopes.length > 0 && (
					<Select
						value={scope}
						onValueChange={(v) => setScope(v as PermissionScope)}
						disabled={disabled}
					>
						<SelectTrigger className="h-8 w-[150px] text-sm">
							<SelectValue />
						</SelectTrigger>
						{/* position="popper" مطلوب: الافتراضي يُحاذي العنصر ويخرج خارج الشاشة في RTL */}
						<SelectContent position="popper">
							<SelectItem value="ALL">{SCOPE_LABELS.ALL}</SelectItem>
							{resource.scopes.includes("BRANCH") && (
								<SelectItem value="BRANCH">{SCOPE_LABELS.BRANCH}</SelectItem>
							)}
							{resource.scopes.includes("OWN") && (
								<SelectItem value="OWN">{SCOPE_LABELS.OWN}</SelectItem>
							)}
						</SelectContent>
					</Select>
				)}

				<Button
					type="button"
					variant="ghost"
					size="sm"
					onClick={toggleAll}
					disabled={disabled}
				>
					{allHeld ? "إلغاء الكل" : "تحديد الكل"}
				</Button>
			</div>

			{open && (
				<div className="grid gap-2 border-t border-border px-4 py-3 sm:grid-cols-2">
					{resource.permissions.map((permission) => {
						const checked = permission.key in grants;
						return (
							<label
								key={permission.key}
								htmlFor={`perm-${permission.key}`}
								className={cn(
									"flex items-center gap-2 rounded px-2 py-1.5 text-sm",
									!disabled && "cursor-pointer hover:bg-muted/40",
								)}
							>
								<Checkbox
									id={`perm-${permission.key}`}
									checked={checked}
									onCheckedChange={(value) => toggle(permission.key, value === true)}
									disabled={disabled}
								/>
								<span className="flex-1">{permission.labelAr}</span>
								{/* المفتاح مسار تقنيّ لا نصّ عربي — يبقى LTR كي لا تنقلب نقطته */}
								<code
									dir="ltr"
									className="text-[10px] text-muted-foreground"
								>
									{permission.key}
								</code>
							</label>
						);
					})}
				</div>
			)}
		</div>
	);
};

/** Grants as the API wants them: a list of `{key, scope}` rather than a map. */
export const grantsToList = (grants: GrantMap) =>
	Object.entries(grants).map(([key, scope]) => ({ key, scope }));

export const ALL_SCOPE_LABELS = SCOPE_LABELS;
