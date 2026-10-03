export const formatFileSize = (size: number) => {
	if (size === 0) return "0 B";

	const units = ["B", "KB", "MB", "GB"];
	const index = Math.min(Math.floor(Math.log(size) / Math.log(1024)), units.length - 1);
	const value = size / 1024 ** index;

	return `${value.toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
};

export const trimFileName = (fileName: string, maxLength = 32) => {
	if (fileName.length <= maxLength) return fileName;

	const extensionIndex = fileName.lastIndexOf(".");

	if (extensionIndex <= 0 || extensionIndex === fileName.length - 1) {
		return `${fileName.slice(0, maxLength - 3)}...`;
	}

	const extension = fileName.slice(extensionIndex);
	const baseName = fileName.slice(0, extensionIndex);
	const availableLength = maxLength - extension.length - 3;

	if (availableLength <= 0) {
		return `${fileName.slice(0, maxLength - 3)}...`;
	}

	return `${baseName.slice(0, availableLength)}...${extension}`;
};
