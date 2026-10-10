import { IconDownload, IconFileImport } from "@tabler/icons-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useAccountImport } from "@/features/accounting/chart-of-accounts/hooks/use-chart-of-accounts";
import { backendUrl } from "@/lib/backend-fetch";
import type { ImportPlan } from "@/server/accounting/account/coa-import";

/**
 * [P1.3] CoA CSV import dialog (BRD FR-4.3.5): pick a file → server dry-run preview (rows to
 * create + row-level errors) → commit only when there are no errors. Template download and
 * "apply Standard chart" are the two zero-friction entry points.
 */
export const AccountImportDialog = ({
	open,
	onOpenChange,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) => {
	const { preview, commit } = useAccountImport();
	const [csv, setCsv] = useState("");
	const [plan, setPlan] = useState<ImportPlan | null>(null);
	const [busy, setBusy] = useState(false);

	const onFile = async (file: File | undefined) => {
		if (!file) return;
		const text = await file.text();
		setCsv(text);
		setBusy(true);
		try {
			setPlan(await preview(text));
		} catch {
			setPlan(null);
		} finally {
			setBusy(false);
		}
	};

	const reset = () => {
		setCsv("");
		setPlan(null);
	};

	const canCommit = !!plan && plan.errors.length === 0 && plan.accounts.length > 0;

	return (
		<Dialog
			open={open}
			onOpenChange={(o) => {
				if (!o) reset();
				onOpenChange(o);
			}}
		>
			<DialogContent
				dir="rtl"
				className="max-h-[85vh] overflow-hidden sm:max-w-lg!"
			>
				<DialogHeader>
					<DialogTitle>استيراد شجرة الحسابات</DialogTitle>
					<DialogDescription>
						ارفع ملف CSV بالأعمدة: الاسم، الأب (رقم الحساب)، الرقم، مجموعة، التصنيف، الجذر،
						العملة.
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-3 overflow-y-auto">
					<div className="flex items-center gap-2">
						<a
							href={backendUrl("/api/accounting/accounts/import/template")}
							download="coa-template.csv"
						>
							<Button
								type="button"
								variant="outline"
								size="sm"
							>
								<IconDownload className="size-4" /> تنزيل القالب
							</Button>
						</a>
						<input
							type="file"
							accept=".csv,text/csv"
							onChange={(e) => onFile(e.target.files?.[0])}
							className="text-sm"
						/>
					</div>

					{busy && <p className="text-sm text-muted-foreground">جارٍ المعاينة...</p>}

					{plan && (
						<div className="space-y-2">
							<p className="text-sm">
								حسابات ستُنشأ: <strong>{plan.accounts.length}</strong> — أخطاء:{" "}
								<strong className={plan.errors.length ? "text-destructive" : ""}>
									{plan.errors.length}
								</strong>
							</p>
							{plan.errors.length > 0 && (
								<ul className="max-h-40 space-y-1 overflow-y-auto rounded-[4px] border border-destructive/40 bg-destructive/5 p-2 text-xs text-destructive">
									{plan.errors.map((e) => (
										<li key={`${e.line}-${e.message}`}>
											سطر {e.line}: {e.message}
										</li>
									))}
								</ul>
							)}
							{plan.accounts.length > 0 && (
								<ul className="max-h-40 space-y-1 overflow-y-auto rounded-[4px] border p-2 text-xs">
									{plan.accounts.map((a) => (
										<li
											key={`${a.accountNumber}-${a.accountName}`}
											className="flex gap-2"
										>
											{a.accountNumber && (
												<span
													dir="ltr"
													className="font-mono text-muted-foreground"
												>
													{a.accountNumber}
												</span>
											)}
											<span>{a.accountName}</span>
											{a.isGroup && <span className="text-muted-foreground">(مجموعة)</span>}
										</li>
									))}
								</ul>
							)}
						</div>
					)}
				</div>

				<DialogFooter>
					<Button
						variant="outline"
						onClick={() => onOpenChange(false)}
					>
						إلغاء
					</Button>
					<Button
						disabled={!canCommit}
						onClick={() => {
							commit(csv);
							onOpenChange(false);
						}}
					>
						<IconFileImport className="size-4" /> استيراد
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
