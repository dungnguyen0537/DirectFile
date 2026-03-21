import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import { createMp3FileName } from "./file-rules";

type ProgressCallback = (progress: number) => void;

let ffmpeg: FFmpeg | null = null;
let isLoaded = false;
let activeProgressHandler: ((event: { progress: number }) => void) | null = null;

async function loadFfmpeg(onProgress: ProgressCallback) {
  if (!ffmpeg) {
    ffmpeg = new FFmpeg();
  }

  if (activeProgressHandler) {
    ffmpeg.off("progress", activeProgressHandler);
  }

  activeProgressHandler = ({ progress }) => {
    onProgress(Math.min(100, Math.max(0, Math.round(progress * 100))));
  };
  ffmpeg.on("progress", activeProgressHandler);

  if (isLoaded) {
    return;
  }

  const baseUrl = "https://unpkg.com/@ffmpeg/core@0.12.9/dist/umd";
  await ffmpeg.load({
    coreURL: await toBlobURL(`${baseUrl}/ffmpeg-core.js`, "text/javascript"),
    wasmURL: await toBlobURL(`${baseUrl}/ffmpeg-core.wasm`, "application/wasm")
  });
  isLoaded = true;
}

export async function convertFileToMp3(
  file: File,
  onProgress: ProgressCallback
) {
  await loadFfmpeg(onProgress);

  if (!ffmpeg) {
    throw new Error("Không thể khởi tạo ffmpeg.");
  }

  const inputName = `input.${file.name.split(".").pop() || "bin"}`;
  const outputName = createMp3FileName(file.name);

  await ffmpeg.writeFile(inputName, await fetchFile(file));
  await ffmpeg.exec([
    "-i",
    inputName,
    "-vn",
    "-codec:a",
    "libmp3lame",
    "-q:a",
    "2",
    outputName
  ]);

  const output = await ffmpeg.readFile(outputName);

  await ffmpeg.deleteFile(inputName);
  await ffmpeg.deleteFile(outputName);

  if (typeof output === "string") {
    throw new Error("ffmpeg trả về dữ liệu không hợp lệ.");
  }

  const fileBytes = new Uint8Array(output.byteLength);
  fileBytes.set(output);

  onProgress(100);

  return new File([fileBytes], outputName, {
    type: "audio/mpeg"
  });
}
