import { upload } from "@vercel/blob/client";
import { createMp3FileName } from "./file-rules";

type ProgressCallback = (progress: number) => void;

export async function uploadAudioToBlob(
  file: File,
  onProgress: ProgressCallback
) {
  const pathname = `audio/${createMp3FileName(file.name)}`;
  const result = await upload(pathname, file, {
    access: "public",
    contentType: file.type || "audio/mpeg",
    handleUploadUrl: "/api/audio/upload",
    onUploadProgress: ({ percentage }) => {
      onProgress(Math.round(percentage));
    }
  });

  return {
    url: result.url
  };
}
