import { IconBuildingHospital } from "@tabler/icons-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useAdmitInpatient, useCages } from "@/features/care/inpatients/hooks/use-inpatients";

/**
 * [IP2] **الإدخال** — الخطوة التي تحوّل الطلب إلى إقامة.
 *
 * شاشة سؤال واحد: أين يُسكن؟ لا تكرّر ما قرّره الطلب (النوع، الحرجية، المدرّب)،
 * لأن من يُسكن ليس من كتب الطلب، وإعادةُ عرض قراراته عليه تدعوه إلى تغييرها.
 *
 * إقامة العزل لا تُعرض لها إلا أقفاص غرف العزل: البوّابة G4 سترفضها على الخادم،
 * وعرضُ خيارٍ يُرفض بعد الضغط أسوأ من عدم عرضه.
 */
type CageRow = { id: string; name: string; room: { name: string; type: string } };

export function AdmitRequestDialog({
	stayId,
	stayCode,
	patientName,
	branchId,
	kind,
	open,
	onOpenChange,
}: {
	stayId: string;
	stayCode: string;
	patientName: string;
	branchId: string;
	kind: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const [cageId, setCageId] = useState("");
	const { cages } = useCages({ branchId, onlyFree: true });
	const { mutate: admit, isPending } = useAdmitInpatient(stayId);

	const rows = (cages as unknown as CageRow[]).filter((c) =>
		kind === "ISOLATION" ? c.room.type === "ISOLATION" : true,
	);
	const isolationMissing = kind === "ISOLATION" && rows.length === 0;

	return (
		<Dialog
			open={open}
			onOpenChange={onOpenChange}
		>
			<DialogContent
				dir="rtl"
				showCloseButton={false}
				className="gap-0 p-0 sm:max-w-md"
			>
				<div className="flex items-center gap-2 border-b px-4 py-2">
					<IconBuildingHospital className="size-4 text-muted-foreground" />
					<DialogTitle className="text-base font-semibold">إدخال {patientName}</DialogTitle>
					<span className="ms-auto text-muted-foreground text-xs tabular-nums">
						{stayCode}
					</span>
				</div>

				<div className="space-y-2 p-4">
					<DialogDescription className="text-muted-foreground text-xs">
						اختيار القفص هو الإدخال نفسه — بعده تُفتح ورقة العلاج والمتابعة.
					</DialogDescription>
					<Label className="text-sm">القفص</Label>
					<Select
						value={cageId}
						onValueChange={setCageId}
						disabled={isPending || rows.length === 0}
					>
						<SelectTrigger className="w-full">
							<SelectValue
								placeholder={isolationMissing ? "لا أقفاص عزل شاغرة" : "اختر قفصًا"}
							/>
						</SelectTrigger>
						{/* position="popper" إلزامي — الافتراضي يخرج عن الشاشة في RTL */}
						<SelectContent
							position="popper"
							dir="rtl"
						>
							{rows.map((c) => (
								<SelectItem
									key={c.id}
									value={c.id}
								>
									<span className="truncate">{c.name}</span>
									<span className="ms-auto text-muted-foreground text-xs">{c.room.name}</span>
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					{isolationMissing && (
						<p className="text-[11px] text-destructive">
							إقامة العزل لا تُسكن في قاعة أخرى — عرّف قفصًا في قاعة عزل أولًا
						</p>
					)}
				</div>

				<div className="flex items-center gap-2 border-t px-4 py-2">
					<Button
						size="sm"
						disabled={!cageId || isPending}
						onClick={() => admit({ cageId }, { onSuccess: () => onOpenChange(false) })}
					>
						إدخال وإسكان
					</Button>
					<Button
						size="sm"
						variant="ghost"
						disabled={isPending}
						onClick={() => onOpenChange(false)}
					>
						إلغاء
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
