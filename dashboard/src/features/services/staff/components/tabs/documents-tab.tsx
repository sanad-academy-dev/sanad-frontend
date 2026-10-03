import {
	IconCheck,
	IconDots,
	IconExternalLink,
	IconLink,
	IconLoader2,
	IconPlus,
	IconTrash,
	IconUpload,
	IconX,
} from "@tabler/icons-react";
import { format } from "date-fns";
import { arSA } from "date-fns/locale";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { TabsContent } from "@/components/ui/tabs";
import {
	ACCEPTED_FILE_TYPES,
	MAX_FILE_SIZE_BYTES,
} from "@/features/appointments/data/add-document-modal";
import { useUploadFile } from "@/features/appointments/hooks/use-upload-file";
import { trimFileName } from "@/features/dashboard/utils/file";
import { useCreateStaffDocument } from "@/features/services/staff/hooks/use-create-staff-document";
import { useDeleteStaffDocument } from "@/features/services/staff/hooks/use-delete-staff-document";
import { useStaffDocuments } from "@/features/services/staff/hooks/use-staff-documents";
import type { StaffTabProps } from "@/features/services/staff/types/tabs.types";
import type {
	StaffDocumentCategory,
	StaffDocumentResponse,
} from "@/server/staff-documents/staff-documents.type";

const stripExtension = (name: string) => {
	const dot = name.lastIndexOf(".");
	return dot <= 0 ? name : name.slice(0, dot);
};

/** Confirm (✓) / cancel (✕) actions shown at the start of an inline add-row. */
function RowActions({
	onConfirm,
	onCancel,
	confirmDisabled,
	pending,
}: {
	onConfirm: () => void;
	onCancel: () => void;
	confirmDisabled: boolean;
	pending: boolean;
}) {
	return (
		<div className="flex shrink-0 items-center gap-1.5">
			<button
				type="button"
				onClick={onCancel}
				disabled={pending}
				aria-label="إلغاء"
				className="flex size-6 items-center justify-center rounded-full border text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-50"
			>
				<IconX className="size-3.5" />
			</button>
			<button
				type="button"
				onClick={onConfirm}
				disabled={confirmDisabled || pending}
				aria-label="تأكيد"
				className="flex size-6 items-center justify-center rounded-full border text-emerald-600 transition-colors hover:bg-emerald-50 disabled:opacity-50"
			>
				{pending ? (
					<IconLoader2 className="size-3.5 animate-spin" />
				) : (
					<IconCheck className="size-3.5" />
				)}
			</button>
		</div>
	);
}

/** The inline "add document/link" row — toggles between file-upload and URL modes. */
function AddDocumentRow({
	staffId,
	category,
	onClose,
}: {
	staffId: string;
	category: StaffDocumentCategory;
	onClose: () => void;
}) {
	const [mode, setMode] = useState<"file" | "link">("file");
	const [name, setName] = useState("");
	const [url, setUrl] = useState("");
	const [file, setFile] = useState<File | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const { uploadFile, isPending: isUploading } = useUploadFile();
	const { createDocument, isPending: isCreating } = useCreateStaffDocument(staffId);
	const pending = isUploading || isCreating;

	const title = name.trim() || (file ? stripExtension(file.name) : "");
	const canConfirm =
		mode === "file" ? !!file && !!title : /^https?:\/\//i.test(url) && !!title;

	const onPickFile = (picked: File | null) => {
		if (!picked) return;
		if (picked.size > MAX_FILE_SIZE_BYTES) {
			toast.error("حجم الملف كبير جدًا");
			return;
		}
		setFile(picked);
		if (!name.trim()) setName(stripExtension(picked.name));
	};

	const onConfirm = async () => {
		try {
			if (mode === "file") {
				if (!file) return;
				const uploaded = await uploadFile(file);
				await createDocument({
					category,
					kind: "FILE",
					title,
					url: uploaded.url,
					mimeType: uploaded.mimeType,
					sizeBytes: uploaded.size,
				});
			} else {
				await createDocument({ category, kind: "LINK", title, url });
			}
			onClose();
		} catch (err) {
			if (err instanceof Error) toast.error(err.message || "فشل رفع الملف");
		}
	};

	return (
		<div className="flex items-center gap-3 rounded-md border p-1.5">
			<RowActions
				onConfirm={onConfirm}
				onCancel={onClose}
				confirmDisabled={!canConfirm}
				pending={pending}
			/>

			<Input
				value={name}
				onChange={(e) => setName(e.target.value)}
				placeholder="الاسم (اختياري)"
				disabled={pending}
				className="h-8 w-56 text-xs"
			/>

			{mode === "file" ? (
				<>
					<button
						type="button"
						onClick={() => fileInputRef.current?.click()}
						disabled={pending}
						className="flex h-8 flex-1 items-center justify-between gap-2 rounded-md border border-dashed px-3 text-xs text-muted-foreground transition-colors hover:bg-muted/50 disabled:opacity-50"
					>
						<IconUpload className="size-4 shrink-0" />
						<span className="truncate">
							{file
								? trimFileName(file.name)
								: "أضف مستندًا بسحب والإفلات أو الضغط على الأيقون للتحميل"}
						</span>
						<span className="w-4 shrink-0" />
					</button>
					<input
						ref={fileInputRef}
						type="file"
						accept={ACCEPTED_FILE_TYPES}
						className="sr-only"
						onChange={(e) => onPickFile(e.target.files?.[0] ?? null)}
					/>
				</>
			) : (
				<Input
					value={url}
					onChange={(e) => setUrl(e.target.value)}
					placeholder="https://www.example.com"
					dir="ltr"
					disabled={pending}
					className="h-8 flex-1 text-xs"
				/>
			)}

			<Button
				type="button"
				variant="ghost"
				size="icon"
				className="size-8 shrink-0"
				disabled={pending}
				aria-label={mode === "file" ? "التبديل إلى رابط" : "التبديل إلى ملف"}
				onClick={() => setMode((m) => (m === "file" ? "link" : "file"))}
			>
				{mode === "file" ? <IconLink className="size-4" /> : <IconUpload className="size-4" />}
			</Button>
		</div>
	);
}

/** An existing document/link entry row. */
function DocumentItemRow({
	staffId,
	doc,
	category,
}: {
	staffId: string;
	doc: StaffDocumentResponse;
	category: StaffDocumentCategory;
}) {
	const { deleteDocument, isPending } = useDeleteStaffDocument(staffId, category);

	return (
		<div className="flex items-center justify-between gap-3 px-1 py-1.5">
			<div className="flex items-center gap-1.5 text-muted-foreground">
				<DropdownMenu dir="rtl">
					<DropdownMenuTrigger asChild>
						<Button
							type="button"
							variant="ghost"
							size="icon"
							className="size-7"
							aria-label="خيارات"
						>
							<IconDots className="size-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="start">
						<DropdownMenuItem
							className="gap-2 text-destructive"
							disabled={isPending}
							onSelect={() => {
								void deleteDocument(doc.id);
							}}
						>
							<IconTrash className="size-4" />
							حذف
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
				<span className="text-xs tabular-nums">
					{format(new Date(doc.createdAt), "d MMMM", { locale: arSA })}
				</span>
			</div>

			<a
				href={doc.url}
				target="_blank"
				rel="noopener noreferrer"
				className="flex items-center gap-2 hover:underline"
			>
				<span className="text-sm font-medium">{doc.title}</span>
				<IconExternalLink className="size-4 text-muted-foreground" />
			</a>
		</div>
	);
}

function DocumentSection({
	staffId,
	category,
	title,
	addLabel,
}: {
	staffId: string;
	category: StaffDocumentCategory;
	title: string;
	addLabel: string;
}) {
	const { documents, isLoading } = useStaffDocuments(staffId, category);
	const [adding, setAdding] = useState(false);

	return (
		<div className="flex flex-col gap-3">
			<div className="flex items-center justify-between gap-3">
				<Button
					type="button"
					variant="outline"
					size="sm"
					className="h-7 gap-1.5 text-xs"
					onClick={() => setAdding(true)}
				>
					<IconPlus className="size-3.5" />
					{addLabel}
				</Button>
				<p className="text-sm font-semibold">{title}</p>
			</div>

			{(documents.length > 0 || adding || isLoading) && (
				<div className="flex flex-col gap-2">
					{documents.map((doc) => (
						<DocumentItemRow
							key={doc.id}
							staffId={staffId}
							doc={doc}
							category={category}
						/>
					))}
					{adding && (
						<AddDocumentRow
							staffId={staffId}
							category={category}
							onClose={() => setAdding(false)}
						/>
					)}
				</div>
			)}
		</div>
	);
}

export function DocumentsTab({ staffId }: StaffTabProps) {
	if (!staffId) {
		return (
			<TabsContent
				value="documents"
				className="m-0 p-4"
				dir="rtl"
			/>
		);
	}

	return (
		<TabsContent
			value="documents"
			className="m-0 flex flex-col gap-4 p-4"
			dir="rtl"
		>
			<DocumentSection
				staffId={staffId}
				category="DOCUMENT"
				title="المستندات والروابط"
				addLabel="أضف مستندًا أو رابطًا"
			/>

			<Separator />

			<DocumentSection
				staffId={staffId}
				category="CERTIFICATE"
				title="الشهادات والاعتمادات"
				addLabel="أضف شهادة"
			/>

			<Separator />

			<DocumentSection
				staffId={staffId}
				category="IMAGE"
				title="الصور"
				addLabel="أضف صورة"
			/>
		</TabsContent>
	);
}
