import { useMutation } from "@tanstack/react-query";

import { api } from "@/lib/api";

export type UploadedFile = {
	url: string;
	name: string;
	size: number;
	mimeType: string;
};

export const useUploadFile = () => {
	const mutation = useMutation({
		// الرفع يمرّ عبر الـ API لا مباشرةً إلى S3 — يتجنّب CORS ويعمل محليًا بلا إعداد AWS
		mutationFn: async (file: File): Promise<UploadedFile> => {
			const res = await api.uploads.direct.post({ file });
			if (res.error) {
				const v = res.error.value as { message?: string } | undefined;
				throw new Error(v?.message ?? "تعذّر رفع الملف");
			}
			return {
				url: res.data.key,
				name: file.name,
				size: file.size,
				mimeType: file.type,
			};
		},
	});

	return { uploadFile: mutation.mutateAsync, isPending: mutation.isPending };
};
