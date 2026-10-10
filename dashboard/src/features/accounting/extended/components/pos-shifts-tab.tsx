import { IconPlus } from "@tabler/icons-react";
import { useState } from "react";

import { DateField } from "@/components/common/date-field";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCell } from "@/components/ui/table";
import {
	DataTable,
	TabIntro,
	TabShell,
} from "@/features/accounting/extended/components/extended-shared";
import { PosProfileSheet } from "@/features/accounting/extended/components/pos-profile-sheet";
import { usePosRegister } from "@/features/accounting/extended/hooks/use-extended";
import { usePosProfiles } from "@/features/accounting/extended/hooks/use-pos-shift";
import { formatAmount, formatDisplayDate } from "@/features/accounting/utils/format-amount";
import { cn } from "@/lib/utils";

/**
 * [P12.14] Tab «ورديات نقطة البيع» (§16) — the POS Register, plus the profiles a shift opens
 * against.
 *
 * THE DIFFERENCE COLUMN IS THE POINT OF THE SCREEN, so it is coloured by sign and never
 * blank: a zero shows as «٠» rather than «—», because "counted exactly right" and "not
 * counted at all" are completely different facts about a cashier's shift and a dash would
 * conflate them.
 *
 * [P12.15] THE PROFILES BLOCK SITS ABOVE THE REGISTER because it is the precondition for it.
 * A clinic with no profile cannot open a shift, so the register was permanently empty and its
 * empty state could only apologise. Creating a profile is the first step of the §16 flow; the
 * remaining two (open, close) happen in the till itself, where the cashier and the drawer
 * are, and the empty state now says exactly that.
 */

const today = () => new Date().toISOString().slice(0, 10);
const monthAgo = () => {
	const date = new Date();
	date.setUTCMonth(date.getUTCMonth() - 1);
	return date.toISOString().slice(0, 10);
};

export const PosShiftsTab = () => {
	const [from, setFrom] = useState(monthAgo);
	const [to, setTo] = useState(today);
	const [profileSheet, setProfileSheet] = useState(false);
	const { register, isLoading } = usePosRegister(from, to);
	const { profiles, isLoading: profilesLoading } = usePosProfiles();

	return (
		<>
			<TabIntro
				title="سجلّ ورديات نقطة البيع"
				hint="لكل وردية: المتوقَّع في الدرج مشتقًّا من العهدة ومبيعات الوردية نفسها، مقابل ما عُدّ فعلًا. الفرق يتجاوز حدّ الملف يُرفض إقفاله — العجز الكبير قرار إداري لا قيد صامت. فتح الوردية وإقفالها من داخل نقطة البيع نفسها."
			/>

			{/* [P12.15] الملفات أوّلًا: بلا ملف لا وردية، وبلا وردية يبقى السجلّ فارغًا للأبد */}
			<div className="border-b px-4 py-3">
				<div className="flex flex-wrap items-center gap-2">
					<p className="font-medium text-sm">ملفات نقطة البيع</p>
					<p className="text-muted-foreground text-xs">
						الملف يحمل حساب فروق الدرج وحدّ الشطب — قرارات محاسبية لا يضبطها الكاشير.
					</p>
					<Button
						size="xs"
						className="ms-auto"
						onClick={() => setProfileSheet(true)}
					>
						<IconPlus className="size-3.5" />
						ملف جديد
					</Button>
				</div>
				<div className="mt-2 flex flex-wrap gap-2">
					{profilesLoading ? (
						<span className="text-muted-foreground text-xs">جارٍ التحميل…</span>
					) : profiles.length === 0 ? (
						<span className="text-muted-foreground text-xs">
							لا ملفات بعد — أنشئ واحدًا ليصبح فتح الوردية ممكنًا من نقطة البيع.
						</span>
					) : (
						profiles.map((profile) => (
							<div
								key={profile.id}
								className="flex items-center gap-2 rounded-[4px] border px-2.5 py-1.5 text-xs"
							>
								<span className="font-medium">{profile.name}</span>
								<span className="text-muted-foreground">
									حدّ الشطب {formatAmount(String(profile.writeOffLimit))}
								</span>
								{profile.writeOffAccountId ? null : (
									<Badge variant="destructive">بلا حساب فروق</Badge>
								)}
								{profile.disabled ? <Badge variant="secondary">معطَّل</Badge> : null}
							</div>
						))
					)}
				</div>
			</div>

			<div className="flex flex-wrap items-center gap-2 border-b px-4 py-2">
				<DateField
					value={from}
					onChange={setFrom}
					placeholder="من تاريخ"
				/>
				<DateField
					value={to}
					onChange={setTo}
					placeholder="إلى تاريخ"
				/>
			</div>
			<TabShell>
				<DataTable
					headers={[
						{ label: "الملف" },
						{ label: "الكاشير" },
						{ label: "الفتح", className: "w-28" },
						{ label: "الإقفال", className: "w-28" },
						{ label: "المبيعات", className: "w-20 text-end" },
						{ label: "الإجمالي", className: "w-28 text-end" },
						{ label: "الفرق", className: "w-28 text-end" },
						{ label: "الحالة", className: "w-24" },
					]}
					rows={register}
					isLoading={isLoading}
					emptyMessage="لا ورديات في هذا المدى. الوردية تُفتح وتُقفل من شاشة نقطة البيع — أنشئ ملفًا أعلاه إن لم يكن هناك ملف، ثم افتح وردية من «نقطة البيع»."
					rowKey={(row) => row.openingId}
					renderRow={(row) => (
						<>
							<TableCell className="truncate">{row.profileName}</TableCell>
							<TableCell className="truncate">{row.cashierName}</TableCell>
							<TableCell>{formatDisplayDate(row.openedAt)}</TableCell>
							<TableCell>
								{row.closedAt ? (
									formatDisplayDate(row.closedAt)
								) : (
									<span className="text-muted-foreground">مفتوحة</span>
								)}
							</TableCell>
							<TableCell className="text-end">{row.saleCount}</TableCell>
							<TableCell className="text-end tabular-nums">{row.salesTotal}</TableCell>
							<TableCell
								className={cn(
									"text-end font-medium tabular-nums",
									row.totalDifference !== null &&
										Number(row.totalDifference) !== 0 &&
										"text-destructive",
								)}
							>
								{row.totalDifference === null ? (
									<span className="font-normal text-muted-foreground">لم تُقفل</span>
								) : (
									row.totalDifference
								)}
							</TableCell>
							<TableCell>
								<Badge variant={row.status === "OPEN" ? "secondary" : "default"}>
									{row.status === "OPEN" ? "مفتوحة" : "مقفلة"}
								</Badge>
							</TableCell>
						</>
					)}
				/>
			</TabShell>

			<PosProfileSheet
				open={profileSheet}
				onOpenChange={setProfileSheet}
			/>
		</>
	);
};
