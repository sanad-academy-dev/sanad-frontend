import { IconLock, IconLockOpen } from "@tabler/icons-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
	CloseShiftDialog,
	OpenShiftDialog,
} from "@/features/accounting/extended/components/pos-shift-dialogs";
import { useCurrentShift } from "@/features/accounting/extended/hooks/use-pos-shift";
import { sumAmountStrings } from "@/features/accounting/utils/amount-strings";
import { formatAmount } from "@/features/accounting/utils/format-amount";

/**
 * [P12.15] The shift strip above the till — §16's cash custody, where the cashier is.
 *
 * IT SITS IN THE POS, NOT IN THE ACCOUNTING HUB. A shift is opened by whoever is about to
 * sell, at the moment they start selling, with the drawer in front of them; asking them to
 * navigate into a management screen first is how the feature goes unused and the POS Register
 * stays empty — which is exactly the state the owner's UI pass found.
 *
 * IT NEVER BLOCKS SELLING. Sales without an open shift are still allowed and simply attach to
 * no shift (`sales.dao` reads the cashier's open shift and stores `null` when there is none).
 * A till that refuses to serve a customer because a bookkeeping document is missing is a
 * worse product than one whose register has a gap, and §16 asks for custody tracking, not for
 * a gate. The strip says so plainly rather than leaving the cashier to guess.
 */
export const PosShiftBar = () => {
	const { shift, isLoading } = useCurrentShift();
	const [openDialog, setOpenDialog] = useState(false);
	const [closeDialog, setCloseDialog] = useState(false);

	if (isLoading) {
		return (
			<div className="flex items-center gap-3 border-b px-4 py-2">
				<Skeleton className="h-6 w-40" />
			</div>
		);
	}

	const float = shift
		? sumAmountStrings(shift.balances.map((row) => String(row.amount)))
		: "0";

	return (
		<>
			<div className="flex flex-wrap items-center gap-3 border-b bg-muted/30 px-4 py-2">
				{shift ? (
					<>
						<Badge variant="default">وردية مفتوحة</Badge>
						<span className="text-sm">{shift.profile.name}</span>
						<span className="text-muted-foreground text-xs">
							فُتحت{" "}
							{new Date(shift.openedAt).toLocaleTimeString("ar", {
								hour: "2-digit",
								minute: "2-digit",
							})}{" "}
							· عهدة {formatAmount(float)}
						</span>
						<Button
							size="sm"
							variant="outline"
							className="ms-auto"
							onClick={() => setCloseDialog(true)}
						>
							<IconLock className="size-4" />
							إقفال الوردية
						</Button>
					</>
				) : (
					<>
						<Badge variant="secondary">لا وردية مفتوحة</Badge>
						<span className="text-muted-foreground text-xs">
							البيع متاح، لكن ما يُباع الآن لن يُنسب إلى أي وردية ولن يظهر في سجلّ الورديات.
						</span>
						<Button
							size="sm"
							className="ms-auto"
							onClick={() => setOpenDialog(true)}
						>
							<IconLockOpen className="size-4" />
							فتح وردية
						</Button>
					</>
				)}
			</div>

			<OpenShiftDialog
				open={openDialog}
				onOpenChange={setOpenDialog}
			/>
			<CloseShiftDialog
				open={closeDialog}
				onOpenChange={setCloseDialog}
			/>
		</>
	);
};
