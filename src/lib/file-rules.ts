const SUPPORTED_SOURCE_EXTENSIONS = new Set([
  "aac",
  "m4a",
  "mkv",
  "mov",
  "mp3",
  "mp4",
  "wav",
  "webm"
]);

const SUPPORTED_SOURCE_MIME_TYPES = new Set([
  "audio/aac",
  "audio/mp3",
  "audio/mp4",
  "audio/mpeg",
  "audio/wav",
  "audio/x-wav",
  "video/mp4",
  "video/quicktime",
  "video/webm",
  "video/x-matroska"
]);

const SUPPORTED_IMAGE_EXTENSIONS = new Set(["jpg", "jpeg", "png", "webp"]);

const SUPPORTED_IMAGE_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp"
]);

export const MAX_FILE_SIZE_MB = 64;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

type ValidationResult = { ok: true } | { ok: false; error: string };

function getFileExtension(fileName: string) {
  const segments = fileName.split(".");
  return segments.length > 1 ? segments.at(-1)?.toLowerCase() ?? "" : "";
}

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-")
    .toLowerCase();
}

export function validateSourceFile(file: File): ValidationResult {
  const extension = getFileExtension(file.name);
  const hasSupportedType =
    SUPPORTED_SOURCE_MIME_TYPES.has(file.type) ||
    SUPPORTED_SOURCE_EXTENSIONS.has(extension);

  if (!hasSupportedType) {
    return {
      ok: false,
      error: "Định dạng file chưa được hỗ trợ."
    };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      ok: false,
      error: `File vượt quá giới hạn ${MAX_FILE_SIZE_MB} MB.`
    };
  }

  return { ok: true };
}

export function validateImageFile(file: File): ValidationResult {
  const extension = getFileExtension(file.name);
  const hasSupportedType =
    SUPPORTED_IMAGE_MIME_TYPES.has(file.type) ||
    SUPPORTED_IMAGE_EXTENSIONS.has(extension);

  if (!hasSupportedType) {
    return {
      ok: false,
      error: "Định dạng ảnh chưa được hỗ trợ."
    };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      ok: false,
      error: `Ảnh vượt quá giới hạn ${MAX_FILE_SIZE_MB} MB.`
    };
  }

  return { ok: true };
}

export function createMp3FileName(sourceName: string) {
  const baseName = sourceName.replace(/\.[^.]+$/, "");
  const slug = slugify(baseName);

  return `${slug || "audio"}.mp3`;
}

export function createImageFileName(sourceName: string) {
  const baseName = sourceName.replace(/\.[^.]+$/, "");
  const slug = slugify(baseName);
  const extension = getFileExtension(sourceName);
  const safeExtension = SUPPORTED_IMAGE_EXTENSIONS.has(extension)
    ? extension
    : "jpg";

  return `${slug || "image"}.${safeExtension}`;
}
