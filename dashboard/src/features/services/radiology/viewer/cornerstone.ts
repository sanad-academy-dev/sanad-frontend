import { init as coreInit } from "@cornerstonejs/core";
import { init as dicomImageLoaderInit } from "@cornerstonejs/dicom-image-loader";
import { init as toolsInit } from "@cornerstonejs/tools";

import { backendUrl } from "@/lib/backend-fetch";

// تهيئة Cornerstone3D مرة واحدة لكل جلسة متصفح — محرك العرض ومحمّل DICOM
// وأدوات القياس. تُستدعى كسولًا من صفحة العارض (العميل فقط، بلا SSR).

let initialized = false;
let initPromise: Promise<void> | null = null;

export const ensureCornerstone = async (): Promise<void> => {
	if (initialized) return;
	if (!initPromise) {
		initPromise = (async () => {
			await coreInit();
			toolsInit();
			dicomImageLoaderInit({
				maxWebWorkers: Math.max(1, Math.min(navigator.hardwareConcurrency || 2, 4)),
				// المسار الافتراضي الجديد (naturalized metadata) يفشل في ملفات
				// Implicit VR Little Endian — وهي أشيع صيغة تُصدّرها الأجهزة وأقراص
				// PACS: تعجز عن حلّ الـ VR المبهم (xs/ox) فلا تجد بيانات البكسل.
				// المسار القديم يقرأ الملف بـ dicom-parser ويتعامل معها صحيحًا.
				useLegacyMetadataProvider: true,
			});
			initialized = true;
		})();
	}
	return initPromise;
};

/** معرّف صورة wadouri لنسخة DICOM — يُبثّ الملف من نقطة العرض المصادَق عليها */
export const dicomImageId = (instanceId: string, frame?: number): string => {
	const url = backendUrl(`/api/radiology/instances/${instanceId}/file`);
	return frame != null ? `wadouri:${url}?frame=${frame}` : `wadouri:${url}`;
};

/** رابط بثّ مباشر (للصور العادية غير DICOM) */
export const instanceFileUrl = (instanceId: string): string =>
	backendUrl(`/api/radiology/instances/${instanceId}/file`);
