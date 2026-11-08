"use client";

import { useState } from "react";
import { Copy, Check, Upload, FileText, Loader2, CheckCircle2 } from "lucide-react";
import type { PaymentViewData } from "../types";

export function ManualBankTab({ data }: { data: PaymentViewData }) {
	const [copiedField, setCopiedField] = useState<string | null>(null);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [notes, setNotes] = useState("");
	const [isUploading, setIsUploading] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(Boolean(data.paymentReceiptUrl));
	const [error, setError] = useState<string | null>(null);

	const handleCopy = (text: string, fieldName: string) => {
		navigator.clipboard.writeText(text);
		setCopiedField(fieldName);
		setTimeout(() => setCopiedField(null), 2000);
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			setSelectedFile(e.target.files[0]);
			setError(null);
		}
	};

	const handleSubmitReceipt = async () => {
		if (!selectedFile) {
			setError("يرجى اختيار صورة إيصال التحويل أولاً");
			return;
		}

		setIsUploading(true);
		setError(null);

		try {
			// 1. Upload receipt file via /api/upload
			const formData = new FormData();
			formData.append("file", selectedFile);

			const uploadRes = await fetch("/api/upload", {
				method: "POST",
				body: formData,
			});

			const uploadData = await uploadRes.json();
			if (!uploadRes.ok) {
				throw new Error(uploadData.message || "فشل رفع ملف الإيصال");
			}

			const receiptUrl = uploadData.url || uploadData.key || "";

			// 2. Submit manual payment receipt via /api/pay/manual-transfer
			const transferRes = await fetch("/api/pay/manual-transfer", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					token: data.paymentToken,
					receiptUrl,
					method: "INSTAPAY",
					notes: notes.trim() || undefined,
				}),
			});

			const transferData = await transferRes.json();
			if (!transferRes.ok) {
				throw new Error(transferData.message || "تعذر إرسال الإيصال");
			}

			setIsSubmitted(true);
		} catch (err: any) {
			setError(err?.message || "حدث خطأ أثناء إرسال الإيصال، يرجى المحاولة مرة أخرى");
		} finally {
			setIsUploading(false);
		}
	};

	if (isSubmitted) {
		return (
			<div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/5 p-6 text-center">
				<div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
					<CheckCircle2 className="h-6 w-6" />
				</div>
				<h4 className="mt-3 text-sm font-bold text-foreground sm:text-base">تم استلام إيصال التحويل بنجاح!</h4>
				<p className="mt-1 text-xs text-muted-foreground leading-relaxed max-w-md mx-auto">
					يقوم فريق الحسابات والقبول بمراجعة وتأكيد عملية التحويل الآن، وسيتم تحديث حالة القيد وإشعاركم فور الاعتماد النهائي.
				</p>
			</div>
		);
	}

	const bank = data.clinic.bankDetails;

	return (
		<div className="space-y-4">
			{error && (
				<div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-3 text-xs font-medium text-red-600 dark:text-red-400">
					{error}
				</div>
			)}

			<div className="rounded-2xl border border-border/80 bg-muted/20 p-4 space-y-3">
				<h4 className="text-xs font-bold text-foreground">بيانات الحساب البنكي وإنستاباي:</h4>

				<div className="space-y-2 text-xs">
					<div className="flex items-center justify-between rounded-xl bg-background/80 p-2.5 border border-border/60">
						<div>
							<span className="block text-[10px] text-muted-foreground">البنك والمستفيد</span>
							<span className="font-semibold text-foreground">{bank.bankName} - {bank.accountHolder}</span>
						</div>
					</div>

					<div className="flex items-center justify-between rounded-xl bg-background/80 p-2.5 border border-border/60">
						<div>
							<span className="block text-[10px] text-muted-foreground">عنوان الدفع إنستاباي (InstaPay Handle)</span>
							<span className="font-mono font-bold text-primary" dir="ltr">{bank.instaPayHandle}</span>
						</div>
						<button
							type="button"
							onClick={() => handleCopy(bank.instaPayHandle, "instapay")}
							className="inline-flex items-center gap-1 rounded-lg bg-muted px-2.5 py-1 text-[11px] font-semibold text-foreground hover:bg-muted/80 transition-colors"
						>
							{copiedField === "instapay" ? (
								<>
									<Check className="h-3 w-3 text-emerald-500" />
									<span>تم النسخ</span>
								</>
							) : (
								<>
									<Copy className="h-3 w-3" />
									<span>نسخ</span>
								</>
							)}
						</button>
					</div>

					<div className="flex items-center justify-between rounded-xl bg-background/80 p-2.5 border border-border/60">
						<div className="min-w-0 pr-2">
							<span className="block text-[10px] text-muted-foreground">رقم الآيبان الدولي (IBAN)</span>
							<span className="font-mono text-xs font-semibold text-foreground truncate block" dir="ltr">{bank.iban}</span>
						</div>
						<button
							type="button"
							onClick={() => handleCopy(bank.iban, "iban")}
							className="shrink-0 inline-flex items-center gap-1 rounded-lg bg-muted px-2.5 py-1 text-[11px] font-semibold text-foreground hover:bg-muted/80 transition-colors"
						>
							{copiedField === "iban" ? (
								<>
									<Check className="h-3 w-3 text-emerald-500" />
									<span>تم النسخ</span>
								</>
							) : (
								<>
									<Copy className="h-3 w-3" />
									<span>نسخ</span>
								</>
							)}
						</button>
					</div>
				</div>
			</div>

			<div className="rounded-2xl border-2 border-dashed border-border/80 p-4 text-center hover:border-primary/50 transition-colors">
				<input
					type="file"
					id="receipt-file"
					accept="image/png,image/jpeg,image/webp,application/pdf"
					onChange={handleFileChange}
					className="hidden"
				/>
				<label htmlFor="receipt-file" className="cursor-pointer block">
					<Upload className="mx-auto h-8 w-8 text-muted-foreground" />
					<span className="mt-2 block text-xs font-bold text-foreground">
						{selectedFile ? selectedFile.name : "انقر هنا لاختيار صورة إيصال التحويل أو ملف PDF"}
					</span>
					<span className="mt-0.5 block text-[10px] text-muted-foreground">
						الحد الأقصى لحجم الملف 5 ميجابايت (PNG, JPG, PDF)
					</span>
				</label>
			</div>

			<div>
				<textarea
					rows={2}
					value={notes}
					onChange={(e) => setNotes(e.target.value)}
					placeholder="ملاحظات إضافية (مثل: اسم صاحب الحساب المحول منه)..."
					className="w-full rounded-xl border border-border/80 bg-background/50 px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
				/>
			</div>

			<button
				type="button"
				onClick={handleSubmitReceipt}
				disabled={!selectedFile || isUploading}
				className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:opacity-95 active:scale-[0.99] disabled:pointer-events-none disabled:opacity-50"
			>
				{isUploading ? (
					<>
						<Loader2 className="h-4 w-4 animate-spin" />
						<span>جاري رفع وتأكيد الإيصال...</span>
					</>
				) : (
					<>
						<FileText className="h-4 w-4" />
						<span>تأكيد وإرسال إيصال التحويل</span>
					</>
				)}
			</button>
		</div>
	);
}
