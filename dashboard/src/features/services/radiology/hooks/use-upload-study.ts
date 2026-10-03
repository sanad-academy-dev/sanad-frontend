import { useMutation, useQueryClient } from "@tanstack/react-query";
import dicomParser from "dicom-parser";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import type { RadiologyModality } from "@/generated/prisma/enums";
import { api } from "@/lib/api";

// رفع دراسة تصوير: يقرأ العميل ترويسات DICOM (المعرّفات العالمية، السلسلة،
// الأبعاد) ثم يرفع الملفات للتخزين ويسجّل التسلسل دراسة←سلاسل←صور على الخادم.
// الصور العادية (JPEG من السونار) تُقبل أيضًا بسلسلة مولَّدة المعرّفات.

type ParsedInstance = {
	file: File;
	kind: "DICOM" | "IMAGE";
	sopUid: string;
	instanceNumber: number | null;
	transferSyntax: string | null;
	rows: number | null;
	columns: number | null;
	frames: number | null;
	mimeType: string;
};

type ParsedSeries = {
	seriesUid: string;
	seriesNumber: number | null;
	modalityCode: string | null;
	description: string | null;
	bodyPart: string | null;
	instances: ParsedInstance[];
};

type ParsedStudy = {
	studyUid: string;
	description: string | null;
	studyDate: string | null;
	modality: RadiologyModality | null;
	series: Map<string, ParsedSeries>;
};

export type UploadStudyProgress = {
	phase: "idle" | "parsing" | "uploading" | "registering";
	done: number;
	total: number;
};

const IDLE: UploadStudyProgress = { phase: "idle", done: 0, total: 0 };

/** معرّف UID مولَّد للملفات غير DICOM — جذر 2.25 القياسي للمعرّفات العشوائية */
const generatedUid = () =>
	`2.25.${Date.now()}${String(Math.floor(Math.random() * 1_000_000_000)).padStart(9, "0")}`;

/** رمز DICOM للطريقة → قيمة RadiologyModality */
const modalityFromCode = (code: string | null): RadiologyModality | null => {
	switch (code) {
		case "DX":
		case "CR":
		case "DR":
			return "XRAY";
		case "CT":
			return "CT";
		case "MR":
			return "MRI";
		case "US":
			return "ULTRASOUND";
		case "RF":
		case "XA":
			return "FLUOROSCOPY";
		case "MG":
			return "MAMMOGRAPHY";
		case "NM":
			return "NUCLEAR";
		case "PT":
			return "PET";
		case "IO":
			return "DENTAL";
		default:
			return code ? "OTHER" : null;
	}
};

/** تاريخ DICOM (YYYYMMDD) → ISO */
const isoFromDicomDate = (raw: string | undefined): string | null => {
	if (!raw || raw.length < 8) return null;
	const y = Number(raw.slice(0, 4));
	const m = Number(raw.slice(4, 6));
	const d = Number(raw.slice(6, 8));
	if (!y || !m || !d) return null;
	const date = new Date(Date.UTC(y, m - 1, d));
	return Number.isNaN(date.getTime()) ? null : date.toISOString();
};

const intOrNull = (raw: string | undefined): number | null => {
	if (raw == null) return null;
	const n = Number.parseInt(raw, 10);
	return Number.isFinite(n) ? n : null;
};

type ParseOutcome =
	| {
			ok: true;
			study: Omit<ParsedStudy, "series">;
			seriesKey: ParsedSeries;
			instance: ParsedInstance;
	  }
	| { ok: false };

/** يقرأ ترويسة ملف واحد: DICOM يُحلَّل، والصورة العادية تُقبل بمعرّفات مولَّدة */
const parseOne = async (file: File, fallback: { studyUid: string; seriesUid: string }) => {
	const bytes = new Uint8Array(await file.arrayBuffer());

	try {
		const dataSet = dicomParser.parseDicom(bytes, { untilTag: "x7fe00010" });
		const studyUid = dataSet.string("x0020000d");
		const seriesUid = dataSet.string("x0020000e");
		const sopUid = dataSet.string("x00080018");
		if (!studyUid || !seriesUid || !sopUid) return { ok: false } as ParseOutcome;

		const modalityCode = dataSet.string("x00080060") ?? null;
		return {
			ok: true,
			study: {
				studyUid,
				description: dataSet.string("x00081030") ?? null,
				studyDate: isoFromDicomDate(dataSet.string("x00080020")),
				modality: modalityFromCode(modalityCode),
			},
			seriesKey: {
				seriesUid,
				seriesNumber: intOrNull(dataSet.string("x00200011")),
				modalityCode,
				description: dataSet.string("x0008103e") ?? null,
				bodyPart: dataSet.string("x00180015") ?? null,
				instances: [],
			},
			instance: {
				file,
				kind: "DICOM",
				sopUid,
				instanceNumber: intOrNull(dataSet.string("x00200013")),
				transferSyntax: dataSet.string("x00020010") ?? null,
				rows: dataSet.uint16("x00280010") ?? null,
				columns: dataSet.uint16("x00280011") ?? null,
				frames: intOrNull(dataSet.string("x00280008")) ?? 1,
				mimeType: "application/dicom",
			},
		} as ParseOutcome;
	} catch {
		// ليس DICOM — الصور العادية تُقبل بسلسلة مولَّدة، وغيرها يُرفض
		if (!file.type.startsWith("image/")) return { ok: false } as ParseOutcome;
		return {
			ok: true,
			study: {
				studyUid: fallback.studyUid,
				description: null,
				studyDate: null,
				modality: null,
			},
			seriesKey: {
				seriesUid: fallback.seriesUid,
				seriesNumber: null,
				modalityCode: null,
				description: "صور غير DICOM",
				bodyPart: null,
				instances: [],
			},
			instance: {
				file,
				kind: "IMAGE",
				sopUid: generatedUid(),
				instanceNumber: null,
				transferSyntax: null,
				rows: null,
				columns: null,
				frames: 1,
				mimeType: file.type,
			},
		} as ParseOutcome;
	}
};

/** حذف صور مرفوعة — صورة أو سلسلة أو دراسة كاملة */
export const useDeleteRadiologyImages = () => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async ({
			kind,
			id,
		}: {
			kind: "instance" | "series" | "study";
			id: string;
			orderId: string;
		}) => {
			const res = await api.radiology.images({ kind })({ id }).delete();
			if (res.error) {
				const data = res.error.value as { message?: string } | undefined;
				throw new Error(data?.message ?? "تعذّر حذف الصور");
			}
			return res.data;
		},
		onSuccess: (_d, v) => {
			void queryClient.invalidateQueries({ queryKey: ["radiology"] });
			void queryClient.invalidateQueries({ queryKey: ["radiology-order", v.orderId] });
		},
	});

	const deleteImages = (input: {
		kind: "instance" | "series" | "study";
		id: string;
		orderId: string;
	}) => {
		const p = mutation.mutateAsync(input);
		toast.promise(p, {
			loading: "جارٍ الحذف...",
			success:
				input.kind === "study"
					? "حُذفت الدراسة"
					: input.kind === "series"
						? "حُذفت السلسلة"
						: "حُذفت الصورة",
			error: (err: Error) => err.message || "فشل حذف الصور",
		});
		return p;
	};

	return { deleteImages, isPending: mutation.isPending };
};

export const useUploadStudy = () => {
	const queryClient = useQueryClient();
	const [progress, setProgress] = useState<UploadStudyProgress>(IDLE);
	const [isUploading, setIsUploading] = useState(false);

	const uploadStudies = useCallback(
		async (input: { itemId: string; orderId: string; files: File[] }) => {
			const { itemId, orderId, files } = input;
			if (files.length === 0) return;

			setIsUploading(true);
			const run = (async () => {
				try {
					// ① قراءة الترويسات وتجميع دراسة←سلاسل←صور
					setProgress({ phase: "parsing", done: 0, total: files.length });
					const fallback = { studyUid: generatedUid(), seriesUid: generatedUid() };
					const studies = new Map<string, ParsedStudy>();
					let skipped = 0;

					for (const [index, file] of files.entries()) {
						const parsed = await parseOne(file, fallback);
						setProgress({ phase: "parsing", done: index + 1, total: files.length });
						if (!parsed.ok) {
							skipped += 1;
							continue;
						}
						const study =
							studies.get(parsed.study.studyUid) ??
							({ ...parsed.study, series: new Map() } as ParsedStudy);
						const series = study.series.get(parsed.seriesKey.seriesUid) ?? {
							...parsed.seriesKey,
						};
						series.instances.push(parsed.instance);
						study.series.set(series.seriesUid, series);
						studies.set(study.studyUid, study);
					}

					const instances = [...studies.values()].flatMap((s) =>
						[...s.series.values()].flatMap((se) => se.instances),
					);
					if (instances.length === 0) {
						throw new Error("لا توجد ملفات DICOM أو صور صالحة بين الملفات المختارة");
					}

					// ② رفع الملفات للتخزين (ثلاثة ملفات في آنٍ واحد)
					setProgress({ phase: "uploading", done: 0, total: instances.length });
					const keyByInstance = new Map<ParsedInstance, string>();
					let uploaded = 0;
					const CONCURRENCY = 3;
					for (let i = 0; i < instances.length; i += CONCURRENCY) {
						const batch = instances.slice(i, i + CONCURRENCY);
						await Promise.all(
							batch.map(async (inst) => {
								// المتصفح لا يعرف نوع ‎.dcm — نلفّ الملف بنوع صريح يقبله الخادم
								const wrapped =
									inst.file.type === inst.mimeType
										? inst.file
										: new File([inst.file], inst.file.name, { type: inst.mimeType });
								const res = await api.uploads.direct.post({ file: wrapped });
								if (res.error || !res.data) {
									throw new Error(`تعذّر رفع الملف ${inst.file.name}`);
								}
								keyByInstance.set(inst, res.data.key);
								uploaded += 1;
								setProgress({ phase: "uploading", done: uploaded, total: instances.length });
							}),
						);
					}

					// ③ تسجيل التسلسل على الخادم — دراسة واحدة في كل نداء
					const studyList = [...studies.values()];
					setProgress({ phase: "registering", done: 0, total: studyList.length });
					for (const [index, study] of studyList.entries()) {
						const res = await api.radiology.items({ itemId }).studies.post({
							studyUid: study.studyUid,
							description: study.description,
							studyDate: study.studyDate,
							modality: study.modality,
							series: [...study.series.values()].map((series) => ({
								seriesUid: series.seriesUid,
								seriesNumber: series.seriesNumber,
								modalityCode: series.modalityCode,
								description: series.description,
								bodyPart: series.bodyPart,
								instances: series.instances.map((inst) => ({
									sopUid: inst.sopUid,
									instanceNumber: inst.instanceNumber,
									kind: inst.kind,
									fileKey: keyByInstance.get(inst) as string,
									fileName: inst.file.name,
									sizeBytes: inst.file.size,
									mimeType: inst.mimeType,
									transferSyntax: inst.transferSyntax,
									rows: inst.rows,
									columns: inst.columns,
									frames: inst.frames,
								})),
							})),
						});
						if (res.error) {
							const data = res.error.value as { message?: string } | undefined;
							throw new Error(data?.message ?? "تعذّر تسجيل الدراسة على الخادم");
						}
						setProgress({ phase: "registering", done: index + 1, total: studyList.length });
					}

					void queryClient.invalidateQueries({ queryKey: ["radiology"] });
					void queryClient.invalidateQueries({ queryKey: ["radiology-order", orderId] });

					return { uploaded: instances.length, skipped };
				} finally {
					setIsUploading(false);
					setProgress(IDLE);
				}
			})();

			toast.promise(run, {
				loading: "جارٍ رفع الصور...",
				success: (r) =>
					r
						? `رُفعت ${r.uploaded} صورة${r.skipped ? ` — تُخُطّي ${r.skipped} ملف غير صالح` : ""}`
						: "تم الرفع",
				error: (err: Error) => err.message || "فشل رفع الصور",
			});
			return run;
		},
		[queryClient],
	);

	return { uploadStudies, progress, isUploading };
};
