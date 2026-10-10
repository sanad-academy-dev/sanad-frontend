"use client";

import {
	IconBuildingHospital,
	IconBuildingStore,
	IconLanguage,
	IconLogout,
	IconSelector,
	IconSettings,
	IconSunMoon,
} from "@tabler/icons-react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";
import { useBranches } from "@/features/settings/branches/hooks/use-branches";
import { useActiveBranchStore } from "@/features/settings/branches/stores/active-branch.store";
import { useI18n } from "@/hooks/use-i18n";
import { signOut, useSession } from "@/lib/auth/client";
import { LANGUAGES, type Language } from "@/lib/data/constants";

export function NavUser() {
	const { isMobile } = useSidebar();
	const { t, isRtl, lang, setLang } = useI18n();
	const { data: session, isPending } = useSession();
	const navigate = useNavigate();
	const { branches } = useBranches();
	const { activeBranchId, setActiveBranchId } = useActiveBranchStore();

	// الفرع المعروض كنشط: المخزَّن إن كان ضمن فروع الأكاديمية الحالية، وإلا الرئيسي، وإلا الأول
	const activeBranch =
		branches.find((b) => b.id === activeBranchId) ??
		branches.find((b) => b.type === "PRIMARY") ??
		branches[0] ??
		null;

	const user = session?.user;
	const role = session?.session?.role;
	const roleLabel = role ? t(`sidebar.user.roles.${role}`, { defaultValue: role }) : "";
	const name = user?.name ?? "";
	const email = user?.email ?? "";
	const avatar = user?.image ?? "";
	const initials =
		name
			.split(" ")
			.filter(Boolean)
			.map((n) => n[0])
			.join("")
			.toUpperCase()
			.slice(0, 2) || "?";

	if (isPending) return null;

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu dir={isRtl ? "rtl" : "ltr"}>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="lg"
							className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
						>
							<Avatar className="h-8 w-8 rounded-lg">
								<AvatarImage
									src={avatar}
									alt={name}
								/>
								<AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
							</Avatar>
							<div className="grid flex-1 text-start text-sm leading-tight">
								<span className="truncate font-medium">{name}</span>
								<span className="truncate text-xs text-muted-foreground">{roleLabel}</span>
							</div>
							<IconSelector className="ms-auto size-4" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
						side={isMobile ? "bottom" : "right"}
						align="end"
						sideOffset={4}
					>
						<DropdownMenuLabel className="p-0 font-normal">
							<div className="flex items-center gap-2 px-1 py-1.5 text-start text-sm">
								<Avatar className="h-8 w-8 rounded-lg">
									<AvatarImage
										src={avatar}
										alt={name}
									/>
									<AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
								</Avatar>
								<div className="grid flex-1 text-start text-sm leading-tight">
									<span className="truncate font-medium">{name}</span>
									<span className="truncate text-xs">{email}</span>
								</div>
							</div>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem asChild>
							<Link to="/management/settings/clinic-information">
								<IconSettings />
								{t("sidebar.user.settings")}
							</Link>
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						{branches.length > 0 && (
							<>
								<DropdownMenuSub>
									<DropdownMenuSubTrigger>
										<IconBuildingHospital className="size-4 shrink-0" />
										<span className="flex min-w-0 flex-1 flex-col text-start leading-tight">
											<span className="truncate text-xs text-muted-foreground">
												{t("sidebar.user.branchLabel")}
											</span>
											<span className="truncate">{activeBranch?.name}</span>
										</span>
									</DropdownMenuSubTrigger>
									<DropdownMenuSubContent className="min-w-48">
										<DropdownMenuRadioGroup
											value={activeBranch?.id ?? ""}
											onValueChange={setActiveBranchId}
										>
											{branches.map((branch) => (
												<DropdownMenuRadioItem
													key={branch.id}
													value={branch.id}
												>
													<IconBuildingHospital className="size-4 shrink-0" />
													<span className="truncate">{branch.name}</span>
												</DropdownMenuRadioItem>
											))}
										</DropdownMenuRadioGroup>
										<DropdownMenuSeparator />
										<DropdownMenuItem asChild>
											<Link to="/management/settings/branches-teams">
												<IconBuildingStore />
												{t("sidebar.user.manageBranches")}
											</Link>
										</DropdownMenuItem>
									</DropdownMenuSubContent>
								</DropdownMenuSub>
								<DropdownMenuSeparator />
							</>
						)}
						<DropdownMenuItem disabled>
							<IconSunMoon />
							{t("sidebar.user.appearance")}
						</DropdownMenuItem>
						<DropdownMenuSub>
							<DropdownMenuSubTrigger>
								<IconLanguage className="size-4 shrink-0" />
								<span className="truncate">{t("sidebar.user.languageLabel")}</span>
							</DropdownMenuSubTrigger>
							<DropdownMenuSubContent className="min-w-40">
								<DropdownMenuRadioGroup
									value={lang}
									onValueChange={(value) => setLang(value as Language)}
								>
									{LANGUAGES.map((code) => (
										<DropdownMenuRadioItem
											key={code}
											value={code}
										>
											<span className="truncate">{t(`lang.${code}`)}</span>
										</DropdownMenuRadioItem>
									))}
								</DropdownMenuRadioGroup>
							</DropdownMenuSubContent>
						</DropdownMenuSub>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							onClick={() =>
								signOut({
									fetchOptions: {
										onSuccess: () => {
											navigate({ to: "/login" });
										},
									},
								})
							}
						>
							<IconLogout />
							{t("sidebar.user.logout")}
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
