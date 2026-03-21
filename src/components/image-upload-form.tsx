"use client";

import { useState } from "react";
import { CopyLinkButton } from "@/components/copy-link-button";
import { uploadImageToBlob } from "@/lib/image-upload";
import { validateImageFile } from "@/lib/file-rules";

type UploadResult = {
  url: string;
};

type ProgressCallback = (progress: number) => void;

type ImageUploadFormProps = {
  uploadImage?: (
    file: File,
    onProgress: ProgressCallback
  ) => Promise<UploadResult>;
  createPreviewUrl?: (file: File) => string;
};

const defaultCreatePreviewUrl = (file: File) => URL.createObjectURL(file);

export function ImageUploadForm({
  uploadImage = uploadImageToBlob,
  createPreviewUrl = defaultCreatePreviewUrl
}: ImageUploadFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [stage, setStage] = useState<"idle" | "uploading" | "success" | "error">(
    "idle"
  );
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<UploadResult | null>(null);

  let statusText = selectedFile ? `Đã chọn: ${selectedFile.name}` : "Sẵn sàng";

  if (stage === "uploading") {
    statusText = `Đang tải ảnh lên: ${uploadProgress}%`;
  } else if (stage === "success") {
    statusText = "Hoàn tất";
  } else if (stage === "error") {
    statusText = "Xử lý thất bại";
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;

    setSelectedFile(file);
    setError(null);
    setStage("idle");
    setUploadProgress(0);
    setPreviewUrl(null);
    setResult(null);

    if (!file) {
      return;
    }

    const validation = validateImageFile(file);

    if (!validation.ok) {
      setError(validation.error);
    }
  }

  async function handleUpload() {
    if (!selectedFile || error) {
      return;
    }

    setError(null);
    setStage("uploading");
    setUploadProgress(0);
    setPreviewUrl(null);
    setResult(null);

    try {
      const uploaded = await uploadImage(selectedFile, setUploadProgress);
      setPreviewUrl(createPreviewUrl(selectedFile));
      setResult(uploaded);
      setStage("success");
    } catch (caughtError) {
      const message =
        caughtError instanceof Error
          ? caughtError.message
          : "Đã xảy ra lỗi khi tải ảnh.";

      setError(message);
      setStage("error");
    }
  }

  const isBusy = stage === "uploading";
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
        <p className="eyebrow">Ảnh trực tiếp</p>
        <h1>Tải ảnh giữ nguyên chất lượng</h1>
        <p className="intro">
          Ảnh được tải nguyên bản lên Blob để nhận URL trực tiếp và xem trước
          ngay trên trang.
        </p>
      </div>

      <div className="upload-panel">
        <label className="file-picker" htmlFor="image-file">
          <span>Chọn ảnh</span>
          <input
            id="image-file"
            type="file"
            accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
          />
        </label>

        <button
          className="primary-button"
          disabled={isSubmitDisabled}
          onClick={handleUpload}
          type="button"
        >
          {isBusy ? "Đang tải ảnh..." : "Tải ảnh lên"}
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

      {result && previewUrl ? (
        <div className="result-card">
          <p className="result-title">Link ảnh trực tiếp</p>
          <img
            alt="Ảnh đã tải lên"
            className="image-preview"
            src={previewUrl}
          />
          <div className="result-links">
            <CopyLinkButton url={result.url} />
          </div>
        </div>
      ) : null}
    </section>
  );
}
