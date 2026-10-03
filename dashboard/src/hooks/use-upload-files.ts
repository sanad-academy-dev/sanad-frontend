import { api } from "@/lib/api";

export const uploadFiles = async (files: File[]): Promise<string[]> => {
	const res = await api.uploads["presign-multiple"].post({
		files: files.map((f) => ({ name: f.name, mimeType: f.type })),
	});
	if (res.error) throw new Error("Failed to upload files");

	await Promise.all(
		res.data.files.map(({ uploadUrl }, i) =>
			fetch(uploadUrl, {
				method: "PUT",
				body: files[i],
				headers: { "Content-Type": files[i].type },
			}),
		),
	);

	return res.data.files.map((f: { key: string }) => f.key);
};
