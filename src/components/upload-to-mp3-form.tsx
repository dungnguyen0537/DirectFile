"use client";

import { useState } from "react";
import { CopyLinkButton } from "@/components/copy-link-button";
import { uploadAudioToBlob } from "@/lib/blob-upload";
import { convertFileToMp3 } from "@/lib/ffmpeg-client";
import { validateSourceFile } from "@/lib/file-rules";

type UploadResult = {
  url: string;
};

type ProgressCallback = (progress: number) => void;

type UploadToMp3FormProps = {
  convertToMp3?: (file: File, onProgress: ProgressCallback) => Promise<File>;
  uploadAudio?: (
    file: File,
    onProgress: ProgressCallback
  ) => Promise<UploadResult>;
  createPreviewUrl?: (file: File) => string;
};

const defaultCreatePreviewUrl = (file: File) => URL.createObjectURL(file);

export function UploadToMp3Form({
  convertToMp3 = convertFileToMp3,
  uploadAudio = uploadAudioToBlob,
  createPreviewUrl = defaultCreatePreviewUrl
}: UploadToMp3FormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [stage, setStage] = useState<
    "idle" | "converting" | "uploading" | "success" | "error"
  >("idle");
  const [convertProgress, setConvertProgress] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [audioPreviewUrl, setAudioPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<UploadResult | null>(null);

  let statusText = selectedFile ? `Đã chọn: ${selectedFile.name}` : "Sẵn sàng";

  if (stage === "converting") {
    statusText = `Đang chuyển đổi: ${convertProgress}%`;
  } else if (stage === "uploading") {
    statusText = `Đang tải lên: ${uploadProgress}%`;
  } else if (stage === "success") {
    statusText = "Hoàn tất";
  } else if (stage === "error") {
    statusText = "Xử lý thất bại";
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;

    setSelectedFile(file);
    setResult(null);
    setAudioPreviewUrl(null);
    setConvertProgress(0);
    setUploadProgress(0);
    setStage("idle");

    if (!file) {
      setError(null);
      return;
    }

    const validation = validateSourceFile(file);

    if (!validation.ok) {
      setError(validation.error);
      return;
    }

    setError(null);
  }

  async function handleConvert() {
    if (!selectedFile || error) {
      return;
    }

    setError(null);
    setResult(null);
    setAudioPreviewUrl(null);
    setStage("converting");
    setConvertProgress(0);
    setUploadProgress(0);

    try {
      const mp3File = await convertToMp3(selectedFile, setConvertProgress);
      const previewUrl = createPreviewUrl(mp3File);
      setAudioPreviewUrl(previewUrl);
      setStage("uploading");

      const uploaded = await uploadAudio(mp3File, setUploadProgress);
      setResult(uploaded);
      setStage("success");
    } catch (caughtError) {
      const message =
        caughtError instanceof Error
          ? caughtError.message
          : "Đã xảy ra lỗi khi xử lý file.";

      setError(message);
      setStage("error");
    }
  }

  const isBusy = stage === "converting" || stage === "uploading";
  const isSubmitDisabled = !selectedFile || Boolean(error) || isBusy;
  const statusTone =
    stage === "error"
      ? "error"
      : stage === "success"
        ? "success"
        : isBusy
          ? "working"
          : "idle";

  return (
    <section className="converter-card">
      <div className="converter-header">
        <p className="eyebrow">MP3 trực tiếp</p>
        <h1>Chuyển video hoặc audio thành MP3</h1>
        <p className="intro">
          Tệp được xử lý ngay trong trình duyệt, sau đó MP3 sẽ được tải lên
          Blob để nhận link audio trực tiếp.
        </p>
      </div>

      <div className="upload-panel">
        <label className="file-picker" htmlFor="source-file">
          <span>Chọn file</span>
          <input
            id="source-file"
            type="file"
            accept=".aac,.m4a,.mkv,.mov,.mp3,.mp4,.wav,.webm,audio/*,video/*"
            onChange={handleFileChange}
          />
        </label>

        <button
          className="primary-button"
          disabled={isSubmitDisabled}
          onClick={handleConvert}
          type="button"
        >
          {isBusy ? "Đang xử lý..." : "Chuyển đổi sang MP3"}
        </button>
      </div>

      <div className={`status-strip is-${statusTone}`} aria-live="polite">
        <strong>Trạng thái</strong>
        <span>{statusText}</span>
      </div>

      {error ? (
        <p className="message error-message" role="alert">
          {error}
        </p>
      ) : null}

      {result && audioPreviewUrl ? (
        <div className="result-card">
          <p className="result-title">Link audio trực tiếp</p>
          <audio controls role="audio" src={audioPreviewUrl} />
          <div className="result-links">
            <CopyLinkButton url={result.url} />
          </div>
        </div>
      ) : null}
    </section>
  );
}
