import { IconDownload, IconPencil, IconUsersGroup } from "@tabler/icons-react";
import { useMemo, useState } from "react";

import { Stats } from "@/components/common/stats";
import { TableToolbar } from "@/components/common/table-toolbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PartySheet } from "@/features/accounting/parties/components/party-sheet";
import { useParties } from "@/features/accounting/parties/hooks/use-parties";
import { downloadCsv } from "@/features/accounting/utils/export-csv";
import type { StatItem } from "@/features/dashboard/types/dashboard.types";
import {
	PARTY_TYPES,
	type PartyListRow,
	type PartyTypeKey,
} from "@sanad/contracts/runtime/server/accounting/party/party.type";

/**
 * [P3.1] «حسابات الأطراف» (BRD §4.10) — standard list anatomy. Parties are the operational
 * masters (Owners / Suppliers / Staff) seen through their accounting configuration; the
 * screen edits the accounting children only and never creates a party.
 */

const TYPE_LABEL: Record<PartyTypeKey, string> = Object.fromEntries(
	PARTY_TYPES.map((d) => [d.key, d.labelAr]),
) as Record<PartyTypeKey, string>;

export const PartiesPage = () => {
	const { parties, isLoading } = useParties();

	const [search, setSearch] = useState("");
	const [editing, setEditing] = useState<PartyListRow | null>(null);
	const [sheetOpen, setSheetOpen] = useState(false);

	const stats = useMemo<StatItem[]>(
		() => [
			{
				title: "العملاء",
				value: parties.filter((p) => p.partyType === "Owner").length,
				tooltip: "مُلّاك الأطفال — جانب الذمم المدينة.",
			},
			{
				title: "الموردون",
				value: parties.filter((p) => p.partyType === "Supplier").length,
				tooltip: "الموردون — جانب الذمم الدائنة.",
			},
			{
				title: "الموظفون",
				value: parties.filter((p) => p.partyType === "Staff").length,
				tooltip: "الموظفون كأطراف (مصروفات وسلف) — جانب الذمم الدائنة.",
			},
			{
				// [MI-P3] كانت البطاقات تُعدّ ثلاثة أنواع بقائمة يدوية بينما القائمة نفسها
				// مبنية على السجل — شركة تأمين كانت تظهر في الصفوف بلا بطاقة تعدّها
				title: "شركات التأمين",
				value: parties.filter((p) => p.partyType === "Insurer").length,
				tooltip: "شركات التأمين — جانب الذمم المدينة (مطالبات المِلاك المؤمَّنين).",
			},
			{
				title: "بإعدادات خاصة",
				value: parties.filter((p) => p.account || p.creditLimit || p.config).length,
				tooltip: "أطراف لها حساب مخصص أو حد ائتمان أو حالة تجميد/تعطيل.",
			},
		],
		[parties],
	);

	const visible = useMemo(() => {
		const q = search.trim().toLowerCase();
		if (!q) return parties;
		return parties.filter(
			(p) =>
				p.name.toLowerCase().includes(q) ||
				(p.code ?? "").toLowerCase().includes(q) ||
				TYPE_LABEL[p.partyType].includes(q),
		);
	}, [search, parties]);

	const exportCsv = () =>
		downloadCsv(
			"parties",
			["النوع", "الاسم", "الكود", "الحساب المخصص", "حد الائتمان", "مجمّد", "معطّل"],
			visible.map((p) => [
				TYPE_LABEL[p.partyType],
				p.name,
				p.code ?? "",
				p.account?.account.accountName ?? "",
				p.creditLimit ? String(p.creditLimit.creditLimit) : "",
				p.config?.isFrozen ? "نعم" : "لا",
				p.config?.disabled ? "نعم" : "لا",
			]),
		);

	const openEdit = (p: PartyListRow) => {
		setEditing(p);
		setSheetOpen(true);
	};

	return (
		<div className="flex min-h-0 flex-1 flex-col overflow-hidden">
			<div className="px-4 pt-3">
				<h1 className="font-medium text-lg">حسابات الأطراف</h1>
				<p className="text-muted-foreground text-sm">
					حسابات الذمم وحدود الائتمان وحالات التجميد للعملاء والموردين والموظفين (
					{parties.length}).
				</p>
			</div>

			<Stats
				className="px-4 grid-cols-4"
				stats={stats}
			/>

			<TableToolbar
				className="border-t"
				searchPlaceholder="ابحث بالاسم أو الكود أو النوع..."
				searchValue={search}
				onSearchChange={setSearch}
				buttonSize="xs"
				showExport={false}
				leftExtra={
					<Button
						type="button"
						variant="outline"
						size="xs"
						onClick={exportCsv}
						disabled={visible.length === 0}
						className="gap-1.5 px-2"
					>
						<IconDownload className="size-3.5" />
						تصدير
					</Button>
				}
			/>

			<div className="min-h-0 flex-1 overflow-auto border-t">
				{!isLoading && visible.length === 0 ? (
					<div className="flex h-full flex-col items-center justify-center gap-2 p-8 text-muted-foreground text-sm">
						<IconUsersGroup className="size-6" />
						{search ? "لا نتائج" : "لا أطراف بعد — تُنشأ من شاشات أولياء الأمور والموردين والموظفين."}
					</div>
				) : (
					visible.map((p) => (
						<div
							key={`${p.partyType}:${p.partyId}`}
							className="flex items-center gap-3 border-b px-3 py-2"
						>
							<Badge
								variant="outline"
								className="w-24 justify-center"
							>
								{TYPE_LABEL[p.partyType]}
							</Badge>
							<span className="min-w-0 flex-1 truncate font-medium text-sm">{p.name}</span>
							<span
								className="w-24 shrink-0 truncate text-muted-foreground text-xs"
								dir="ltr"
							>
								{p.code ?? ""}
							</span>
							<span className="w-44 shrink-0 truncate text-muted-foreground text-xs">
								{p.account?.account.accountName ?? "افتراضي الشركة"}
							</span>
							<span
								className="w-24 shrink-0 truncate text-muted-foreground text-xs tabular-nums"
								dir="ltr"
							>
								{p.creditLimit ? String(p.creditLimit.creditLimit) : "—"}
							</span>
							{p.config?.isFrozen && (
								<Badge
									variant="secondary"
									className="text-[10px]"
								>
									مجمّد
								</Badge>
							)}
							{p.config?.disabled && (
								<Badge
									variant="destructive"
									className="text-[10px]"
								>
									معطّل
								</Badge>
							)}
							<Button
								variant="ghost"
								size="icon-xs"
								aria-label="تعديل"
								onClick={() => openEdit(p)}
							>
								<IconPencil className="size-4" />
							</Button>
						</div>
					))
				)}
			</div>

			<PartySheet
				open={sheetOpen}
				onOpenChange={setSheetOpen}
				party={editing}
			/>
		</div>
	);
};
