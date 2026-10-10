import { useCallback, useRef, useState } from "react";

import { backendUrl } from "@/lib/backend-fetch";

export type UploadedMedia = { key: string; name: string; size: number };

type UploadState = "idle" | "uploading" | "done" | "error";

/**
 * يرفع ملفًا عبر الـ API (`POST /api/uploads/direct`) مع نسبة تقدّم حقيقية.
 * الرفع يمرّ بالخادم لا مباشرةً إلى S3 — فلا حاجة لإعداد CORS على الحاوية،
 * ويعمل محليًا بلا مفاتيح AWS (تخزين في public/uploads).
 * لا يمكن استخدام `useUploadFile` المشترك هنا لأنه يعتمد على `fetch`
 * الذي لا يوفّر أحداث تقدّم للرفع — لذلك نستخدم XMLHttpRequest.
 */
export const useUploadMedia = () => {
	const [progress, setProgress] = useState(0);
	const [state, setState] = useState<UploadState>("idle");
	const xhrRef = useRef<XMLHttpRequest | null>(null);

	const reset = useCallback(() => {
		xhrRef.current?.abort();
		xhrRef.current = null;
		setProgress(0);
		setState("idle");
	}, []);

	const upload = useCallback(async (file: File): Promise<UploadedMedia> => {
		setState("uploading");
		setProgress(0);

		const form = new FormData();
		form.append("file", file);

		const key = await new Promise<string>((resolve, reject) => {
			const xhr = new XMLHttpRequest();
			xhrRef.current = xhr;
			xhr.open("POST", backendUrl("/api/uploads/direct"));
			xhr.withCredentials = true;

			xhr.upload.onprogress = (e) => {
				if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100));
			};
			xhr.onload = () => {
				if (xhr.status >= 200 && xhr.status < 300) {
					try {
						const uploadedKey = JSON.parse(xhr.responseText)?.key;
						if (uploadedKey) return resolve(uploadedKey as string);
					} catch {
						/* استجابة غير متوقّعة — نعامله كفشل */
					}
					return reject(new Error("تعذّر رفع الملف"));
				}
				// رسالة الخادم إن وُجدت (نوع ملف غير مدعوم مثلًا)
				let message = "تعذّر رفع الملف";
				try {
					message = JSON.parse(xhr.responseText)?.message ?? message;
				} catch {
					/* نُبقي الرسالة الافتراضية */
				}
				reject(new Error(message));
			};
			xhr.onerror = () => reject(new Error("تعذّر رفع الملف"));
			xhr.onabort = () => reject(new Error("أُلغي الرفع"));
			xhr.send(form);
		}).catch((e) => {
			setState("error");
			throw e;
		});

		xhrRef.current = null;
		setProgress(100);
		setState("done");
		return { key, name: file.name, size: file.size };
	}, []);

	return { upload, reset, progress, state, isUploading: state === "uploading" };
};
