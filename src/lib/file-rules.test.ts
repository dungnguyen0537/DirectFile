import { describe, expect, it } from "vitest";
import {
  MAX_FILE_SIZE_BYTES,
  createMp3FileName,
  validateSourceFile
} from "./file-rules";
import * as fileRules from "./file-rules";

describe("validateSourceFile", () => {
  it("accepts supported audio and video files", () => {
    const audioFile = new File(["audio"], "episode.m4a", { type: "audio/mp4" });
    const videoFile = new File(["video"], "clip.webm", { type: "video/webm" });

    expect(validateSourceFile(audioFile)).toEqual({ ok: true });
    expect(validateSourceFile(videoFile)).toEqual({ ok: true });
  });

  it("rejects files above the configured size limit", () => {
    const file = new File(["audio"], "large.mp4", { type: "video/mp4" });
    Object.defineProperty(file, "size", {
      configurable: true,
      value: MAX_FILE_SIZE_BYTES + 1
    });

    expect(validateSourceFile(file)).toEqual({
      ok: false,
      error: "File vượt quá giới hạn 64 MB."
    });
  });

  it("rejects unsupported file types", () => {
    const file = new File(["text"], "notes.txt", { type: "text/plain" });

    expect(validateSourceFile(file)).toEqual({
      ok: false,
      error: "Định dạng file chưa được hỗ trợ."
    });
  });
});

describe("createMp3FileName", () => {
  it("normalizes the base name and adds the mp3 suffix", () => {
    expect(createMp3FileName("Bản ghi thử nghiệm!.MOV")).toBe(
      "ban-ghi-thu-nghiem.mp3"
    );
  });
});

describe("validateImageFile", () => {
  it("accepts supported image files", () => {
    const validateImageFile = (
      fileRules as Record<string, unknown>
    ).validateImageFile;

    expect(typeof validateImageFile).toBe("function");

    const imageFile = new File(["image"], "Ảnh kỷ niệm.PNG", {
      type: "image/png"
    });

    expect(
      (validateImageFile as (file: File) => { ok: true } | { ok: false; error: string })(
        imageFile
      )
    ).toEqual({ ok: true });
  });
});
