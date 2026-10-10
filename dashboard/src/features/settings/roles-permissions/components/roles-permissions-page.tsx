import { zodResolver } from "@hookform/resolvers/zod";
import {
	IconArrowLeft,
	IconInfoCircle,
	IconPlus,
	IconShieldLock,
	IconTrash,
} from "@tabler/icons-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Spinner } from "@/components/common/spinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { SettingsPageWrapper } from "@/features/settings/components/settings-page-wrapper";
import {
	type GrantMap,
	grantsToList,
	RbacPermissionsEditor,
} from "@/features/settings/roles-permissions/components/rbac-permissions-editor";
import { RoleTemplatePicker } from "@/features/settings/roles-permissions/components/role-template-picker";
import {
	useCreateRbacRole,
	useCreateRoleFromTemplate,
	useDeleteRbacRole,
	useRbacRoles,
	useSetRoleGrants,
	useUpdateRbacRole,
} from "@/features/settings/roles-permissions/hooks/use-rbac-roles";
import type { PermissionScope } from "@sanad/contracts/runtime/lib/rbac/rbac-registry";
import {
	type CreateRoleFormInput,
	createRoleSchema,
	type RoleResponse,
} from "@sanad/contracts/runtime/server/rbac/rbac.type";

type View = "list" | "add" | { type: "edit"; roleId: string };

export const RolesPermissionsPage = () => {
	const { roles, isLoading } = useRbacRoles();
	const { deleteRole, isPending: isDeleting } = useDeleteRbacRole();
	const [view, setView] = useState<View>("list");

	const toList = () => setView("list");

	if (view === "add") {
		return (
			<SettingsPageWrapper>
				<RoleFormView
					mode="add"
					onBack={toList}
				/>
			</SettingsPageWrapper>
		);
	}

	if (view !== "list") {
		const role = roles.find((r) => r.id === view.roleId);
		if (role) {
			return (
				<SettingsPageWrapper>
					<RoleFormView
						mode="edit"
						role={role}
						onBack={toList}
					/>
				</SettingsPageWrapper>
			);
		}
	}

	return (
		<SettingsPageWrapper>
			<div>
				<h1 className="text-2xl font-bold">الصلاحيات والأدوار</h1>
				<p className="mt-1 text-sm text-muted-foreground">
					أنشئ أدواراً مخصصة وعيّن لكل دور صلاحيات محددة على وحدات النظام
				</p>
			</div>

			<div className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4">
				<IconInfoCircle className="mt-0.5 size-5 shrink-0 text-amber-500" />
				<div className="text-sm leading-relaxed text-amber-800">
					<p className="mb-1 font-semibold">
						الصلاحية تتكوّن من شيئين: ما الذي يستطيع الدور فعله، وعلى أيّ نطاق يفعله.
					</p>
					<p>
						النطاق يحدّد كم يرى الدور: «كل الأكاديمية» أو «فرعه فقط» أو «سجلّاته فقط». الوحدات التي
						لا تملك تقسيمًا بالفرع لا يظهر لها خيار نطاق — لأنّ التقييد الذي لا يمكن تطبيقه على
						البيانات وعدٌ كاذب.
					</p>
				</div>
			</div>

			<button
				type="button"
				className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
				onClick={() => setView("add")}
			>
				<IconPlus className="size-4" />
				أضف دور جديد
			</button>

			<div className="overflow-hidden rounded-xl border border-border">
				{isLoading ? (
					<Spinner containerClassName="py-10 min-h-0" />
				) : roles.length === 0 ? (
					<p className="py-10 text-center text-sm text-muted-foreground">
						لا توجد أدوار بعد — أضف دوراً جديداً
					</p>
				) : (
					roles.map((role, index) => (
						<div key={role.id}>
							{index > 0 && <Separator />}
							<RoleRow
								role={role}
								onEdit={() => setView({ type: "edit", roleId: role.id })}
								onDelete={() => deleteRole(role.id)}
								isDeleting={isDeleting}
							/>
						</div>
					))
				)}
			</div>
		</SettingsPageWrapper>
	);
};

type RoleRowProps = {
	role: RoleResponse;
	onEdit: () => void;
	onDelete: () => void;
	isDeleting: boolean;
};

const RoleRow = ({ role, onEdit, onDelete, isDeleting }: RoleRowProps) => (
	<div className="flex items-center justify-between px-5 py-4">
		<div className="flex items-center gap-2">
			<span className="text-sm font-medium">{role.name}</span>

			{/* السلطة تُعرَض من العلم لا من ترتيب الصف: الشاشة القديمة كانت تسِم أوّل دور
			    «افتراضي» بحكم موضعه، وهو ما لا يعني شيئًا عن صلاحياته. */}
			{role.isSuperAdmin && (
				<Badge className="gap-1 border-amber-200 bg-amber-100 text-xs text-amber-700">
					<IconShieldLock className="size-3" />
					مدير النظام — يتجاوز كل الفحوص
				</Badge>
			)}
			{role.isSystem && (
				<Badge
					variant="secondary"
					className="text-xs"
				>
					دور مُدمَج
				</Badge>
			)}
			{!role.isSuperAdmin && (
				<Badge
					variant="secondary"
					className="text-xs"
				>
					{Object.keys(role.grants).length} صلاحية
				</Badge>
			)}
			{role.staffCount > 0 && (
				<span className="text-xs text-muted-foreground">{role.staffCount} موظف</span>
			)}
		</div>

		<div className="flex items-center gap-2">
			{!role.isSystem && (
				<Button
					type="button"
					variant="ghost"
					size="icon"
					className="size-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
					disabled={isDeleting}
					onClick={onDelete}
				>
					<IconTrash className="size-4" />
				</Button>
			)}
			<Button
				type="button"
				variant="outline"
				size="sm"
				className="h-8 text-xs"
				onClick={onEdit}
			>
				تعديل
			</Button>
		</div>
	</div>
);

type RoleFormViewProps =
	| { mode: "add"; onBack: () => void }
	| { mode: "edit"; role: RoleResponse; onBack: () => void };

const RoleFormView = (props: RoleFormViewProps) => {
	const { mode, onBack } = props;

	const { createRole, isPending: isCreating } = useCreateRbacRole();
	const { createFromTemplate, isPending: isTemplating } = useCreateRoleFromTemplate();
	const { updateRole } = useUpdateRbacRole();
	const { setGrants, isPending: isSaving } = useSetRoleGrants();

	// في وضع الإضافة يبدأ المستخدم من قائمة الأدوار الجاهزة، وله أن يتخطّاها إلى دور فارغ.
	const [showTemplates, setShowTemplates] = useState(mode === "add");

	const [localGrants, setLocalGrants] = useState<GrantMap>(
		mode === "edit" ? (props.role.grants as GrantMap) : {},
	);
	const [editName, setEditName] = useState(mode === "edit" ? props.role.name : "");

	const { register, handleSubmit } = useForm<CreateRoleFormInput>({
		resolver: zodResolver(createRoleSchema),
	});

	const isPending = isCreating || isSaving || isTemplating;
	const isSuperAdmin = mode === "edit" && props.role.isSuperAdmin;

	const handleGrantsChange = (next: GrantMap) => {
		setLocalGrants(next);
		if (mode === "edit") {
			setGrants({ id: props.role.id, grants: grantsToList(next) });
		}
	};

	const commitName = () => {
		if (mode === "edit") {
			const trimmed = editName.trim();
			if (trimmed && trimmed !== props.role.name) {
				updateRole({ id: props.role.id, name: trimmed });
			} else {
				setEditName(props.role.name);
			}
		}
	};

	const onSubmit = handleSubmit((data) => {
		createRole(data, {
			onSuccess: (role) => {
				const list = grantsToList(localGrants);
				if (list.length > 0) {
					setGrants({ id: role.id, grants: list }, { onSuccess: onBack });
				} else {
					onBack();
				}
			},
		});
	});

	return (
		<div className="w-full">
			<div className="mb-5 flex items-start justify-between">
				<div>
					<h1 className="text-xl font-bold">
						{mode === "add" ? "إضافة دور جديد" : "الصلاحيات والأدوار"}
					</h1>
					<p className="mt-0.5 text-sm text-muted-foreground">
						أنشئ أدواراً مخصصة وعيّن لكل دور صلاحيات محددة على وحدات النظام
					</p>
				</div>
				<Button
					type="button"
					variant="ghost"
					size="sm"
					className="gap-1.5 text-muted-foreground"
					onClick={onBack}
				>
					<IconArrowLeft className="size-4" />
					رجوع
				</Button>
			</div>

			{!showTemplates && (
				<div className="mb-5 flex items-center justify-between rounded-lg border border-border bg-muted/30 px-4 py-2">
					<div className="flex items-center gap-2">
						<Label className="shrink-0 text-xs">اسم الدور</Label>
						{mode === "edit" && isSaving && (
							<Spinner
								className="size-3.5"
								containerClassName="min-h-0"
							/>
						)}
					</div>
					{mode === "add" ? (
						<Input
							{...register("name")}
							placeholder="مثال: مدرّب، موظف استقبال"
							className="h-8 w-48 text-sm font-semibold"
							dir="rtl"
							disabled={isPending}
							autoFocus
						/>
					) : props.role.isSystem ? (
						<span className="text-sm font-semibold text-muted-foreground">
							{props.role.name}
						</span>
					) : (
						<Input
							value={editName}
							onChange={(e) => setEditName(e.target.value)}
							onBlur={commitName}
							onKeyDown={(e) => {
								if (e.key === "Enter") e.currentTarget.blur();
								if (e.key === "Escape") {
									setEditName(props.role.name);
									e.currentTarget.blur();
								}
							}}
							className="h-8 w-48 border-transparent bg-transparent text-sm font-semibold transition-colors hover:border-input focus:border-input focus:bg-background"
							dir="rtl"
						/>
					)}
				</div>
			)}

			{showTemplates ? (
				<RoleTemplatePicker
					onPick={(templateKey) => createFromTemplate({ templateKey }, { onSuccess: onBack })}
					onSkip={() => setShowTemplates(false)}
					disabled={isPending}
				/>
			) : isSuperAdmin ? (
				/* لا محرّر لدور مدير النظام: هو يتجاوز الفحص قبل أي بحث في السجلّ، فعرض
				   مربّعات اختيار له يوحي بأنّ لها أثرًا — وسيأتي من «يُضيّق» عليه لاحقًا
				   منتظرًا نتيجة لا تحدث. */
				<div className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4">
					<IconShieldLock className="mt-0.5 size-5 shrink-0 text-amber-500" />
					<div className="text-sm leading-relaxed text-amber-800">
						<p className="mb-1 font-semibold">هذا الدور يتجاوز كل فحوص الصلاحيات.</p>
						<p>
							من يحمله يصل إلى كل شيء في الأكاديمية بلا استثناء، فلا معنى لتحديد صلاحيات له.
							لتقييد مستخدم، أسند إليه دورًا آخر بدل هذا الدور.
						</p>
					</div>
				</div>
			) : (
				<RbacPermissionsEditor
					grants={localGrants}
					onChange={handleGrantsChange}
					disabled={isPending}
				/>
			)}

			{mode === "add" && !showTemplates && (
				<div className="mt-6 flex justify-end gap-2">
					<Button
						type="button"
						variant="outline"
						onClick={onBack}
						disabled={isPending}
					>
						إلغاء
					</Button>
					<Button
						type="button"
						onClick={onSubmit}
						disabled={isPending}
					>
						{isPending && (
							<Spinner
								className="size-4 me-1.5"
								containerClassName="min-h-0"
							/>
						)}
						إنشاء الدور
					</Button>
				</div>
			)}
		</div>
	);
};

export type { PermissionScope };
