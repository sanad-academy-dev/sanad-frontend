import { IconCamera, IconPhotoUp } from "@tabler/icons-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useUploadFile } from "@/features/appointments/hooks/use-upload-file";
import { useGroomingMutations } from "@/features/care/grooming/hooks/use-grooming";
import type { GroomingPhotoKind } from "@/generated/prisma/enums";
import { getFileUrl } from "@/lib/file-url";
import type { GroomingSessionDetail } from "@/server/grooming/grooming.type";
import { GROOMING_PHOTO_KIND_LABELS } from "@sanad/contracts/runtime/server/grooming/grooming.type";

// صور الجلسة — رفع من الجهاز أو التقاط بالكاميرا مباشرةً.
//
// التوثيق المصوَّر ليس تزيينًا: صور «قبل» تُثبت حالة الفرو التي بُني عليها السعر،
// وصور «بعد» هي ما يُغلق نزاع «أعدتموه لي هكذا». لذلك يعيش الرفع داخل خطوة
// التجفيف والتشطيب لا في صفحة منفصلة يتذكّرها أحد بعد أن يغادر الطفل.
//
// `capture="environment"` يفتح الكاميرا الخلفية على الهاتف والجهاز اللوحي —
// وهما ما يُمسك فعلًا في الصالون — ويتصرّف كاختيار ملف عادي على سطح المكتب.

export function GroomingPhotoPanel({
	session,
	kind,
	title,
	description,
}: {
	session: GroomingSessionDetail;
	kind: GroomingPhotoKind;
	title: string;
	description?: string;
}) {
	const fileRef = useRef<HTMLInputElement>(null);
	const cameraRef = useRef<HTMLInputElement>(null);
	const { uploadFile, isPending: isUploading } = useUploadFile();
	const { addPhoto } = useGroomingMutations();
	const [busy, setBusy] = useState(false);
	const [preview, setPreview] = useState<string | null>(null);

	const photos = session.photos.filter((p) => p.kind === kind);

	const handleFiles = async (list: FileList | null) => {
		if (!list || list.length === 0) return;
		setBusy(true);
		try {
			for (const file of [...list]) {
				const uploaded = await uploadFile(file);
				await addPhoto({ id: session.id, kind, url: uploaded.url });
			}
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "تعذّر رفع الصورة");
		} finally {
			setBusy(false);
			// إعادة الضبط حتى يُقبل اختيار الملف نفسه مرّة أخرى
			if (fileRef.current) fileRef.current.value = "";
			if (cameraRef.current) cameraRef.current.value = "";
		}
	};

	const disabled = busy || isUploading;

	return (
		<div className="flex flex-col gap-3">
			<div className="flex items-center justify-between gap-2">
				<p className="font-medium text-sm">{title}</p>
				<Badge
					variant="outline"
					className="text-[10px] tabular-nums"
				>
					{photos.length} صورة
				</Badge>
			</div>

			{description && (
				<p className="text-muted-foreground text-xs leading-relaxed">{description}</p>
			)}

			<input
				ref={fileRef}
				type="file"
				accept="image/*"
				multiple
				className="hidden"
				onChange={(e) => void handleFiles(e.target.files)}
			/>
			<input
				ref={cameraRef}
				type="file"
				accept="image/*"
				capture="environment"
				className="hidden"
				onChange={(e) => void handleFiles(e.target.files)}
			/>

			<div className="flex flex-wrap gap-2">
				<Button
					type="button"
					size="sm"
					className="gap-1.5"
					disabled={disabled}
					onClick={() => cameraRef.current?.click()}
				>
					<IconCamera className="size-3.5" />
					التقاط صورة
				</Button>
				<Button
					type="button"
					size="sm"
					variant="outline"
					className="gap-1.5"
					disabled={disabled}
					onClick={() => fileRef.current?.click()}
				>
					<IconPhotoUp className="size-3.5" />
					رفع من الجهاز
				</Button>
				{disabled && (
					<span className="self-center text-muted-foreground text-xs">جارٍ الرفع...</span>
				)}
			</div>

			{photos.length === 0 ? (
				<p className="rounded-[4px] border border-dashed p-3 text-center text-muted-foreground text-xs">
					لا صور {GROOMING_PHOTO_KIND_LABELS[kind]} بعد
				</p>
			) : (
				<div className="grid grid-cols-3 gap-2">
					{photos.map((photo) => (
						<button
							key={photo.id}
							type="button"
							className="group relative aspect-square overflow-hidden rounded-[4px] border"
							onClick={() => setPreview(getFileUrl(photo.url))}
						>
							<img
								src={getFileUrl(photo.url)}
								alt={photo.caption ?? GROOMING_PHOTO_KIND_LABELS[photo.kind]}
								className="size-full object-cover"
							/>
						</button>
					))}
				</div>
			)}

			{/* معاينة بحجم الشاشة — الصورة الصغيرة لا تُثبت شيئًا عند المراجعة */}
			{preview && (
				<button
					type="button"
					aria-label="إغلاق المعاينة"
					className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-6"
					onClick={() => setPreview(null)}
				>
					<img
						src={preview}
						alt="معاينة"
						className="max-h-full max-w-full rounded-[4px] object-contain"
					/>
				</button>
			)}
		</div>
	);
}
