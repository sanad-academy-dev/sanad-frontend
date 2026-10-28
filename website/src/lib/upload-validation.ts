const MAX_UPLOAD_BYTES = 15 * 1024 * 1024;

const ALLOWED_TYPES = new Map([
  ["image/jpeg", [".jpg", ".jpeg"]],
  ["image/png", [".png"]],
  ["image/webp", [".webp"]],
  ["image/gif", [".gif"]],
  ["application/pdf", [".pdf"]],
  ["application/msword", [".doc"]],
  [
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    [".docx"],
  ],
]);

function hasSignature(bytes: Uint8Array, signature: number[], offset = 0) {
  return signature.every((byte, index) => bytes[offset + index] === byte);
}

function hasAscii(bytes: Uint8Array, value: string, offset = 0) {
  return hasSignature(bytes, [...value].map((character) => character.charCodeAt(0)), offset);
}

function hasValidSignature(type: string, bytes: Uint8Array) {
  switch (type) {
    case "image/jpeg":
      return hasSignature(bytes, [0xff, 0xd8, 0xff]);
    case "image/png":
      return hasSignature(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    case "image/webp":
      return hasAscii(bytes, "RIFF") && hasAscii(bytes, "WEBP", 8);
    case "image/gif":
      return hasAscii(bytes, "GIF87a") || hasAscii(bytes, "GIF89a");
    case "application/pdf":
      return hasAscii(bytes, "%PDF-");
    case "application/msword":
      return hasSignature(bytes, [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]);
    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      return hasSignature(bytes, [0x50, 0x4b, 0x03, 0x04]);
    default:
      return false;
  }
}

export async function validateUploadedFile(file: File): Promise<string | null> {
  if (file.size === 0 || file.size > MAX_UPLOAD_BYTES) {
    return "حجم الملف غير صالح. الحد الأقصى المسموح به 15 ميجابايت.";
  }

  const extensions = ALLOWED_TYPES.get(file.type);
  const extension = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
  if (!extensions || !extensions.includes(extension)) {
    return "نوع الملف غير مدعوم أو امتداده لا يطابق محتواه.";
  }

  const bytes = new Uint8Array(await file.slice(0, 16).arrayBuffer());
  if (!hasValidSignature(file.type, bytes)) {
    return "تعذر التحقق من محتوى الملف.";
  }

  return null;
}

export function getSafeUploadName(file: File): string {
  const extension = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
  return `upload-${crypto.randomUUID()}${extension}`;
}
