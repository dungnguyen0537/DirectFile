import { upload } from "@vercel/blob/client";
import { createImageFileName } from "./file-rules";

type ProgressCallback = (progress: number) => void;

export async function uploadImageToBlob(
  file: File,
  onProgress: ProgressCallback
) {
  const pathname = `image/${createImageFileName(file.name)}`;
  const result = await upload(pathname, file, {
    access: "public",
    contentType: file.type || "image/jpeg",
    handleUploadUrl: "/api/image/upload",
    onUploadProgress: ({ percentage }) => {
      onProgress(Math.round(percentage));
    }
  });

  return {
    url: result.url
  };
}
