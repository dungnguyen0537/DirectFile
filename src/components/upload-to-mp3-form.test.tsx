import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { UploadToMp3Form } from "./upload-to-mp3-form";

describe("UploadToMp3Form", () => {
  it("shows a validation error for unsupported files", async () => {
    render(
      <UploadToMp3Form
        convertToMp3={vi.fn()}
        uploadAudio={vi.fn()}
        createPreviewUrl={vi.fn()}
      />
    );

    const input = screen.getByLabelText("Chọn file");
    const file = new File(["text"], "notes.txt", { type: "text/plain" });

    fireEvent.change(input, { target: { files: [file] } });

    expect(
      await screen.findByText("Định dạng file chưa được hỗ trợ.")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Chuyển đổi sang MP3" })
    ).toBeDisabled();
  });

  it("renders the success state with player and direct url only", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(window.navigator, "clipboard", {
      configurable: true,
      value: { writeText }
    });
    const convertToMp3 = vi.fn().mockResolvedValue(
      new File(["mp3"], "ket-qua.mp3", { type: "audio/mpeg" })
    );
    const uploadAudio = vi.fn().mockResolvedValue({
      url: "https://blob.vercel-storage.com/audio/ket-qua.mp3"
    });
    const createPreviewUrl = vi.fn().mockReturnValue("blob:local-preview");

    render(
      <UploadToMp3Form
        convertToMp3={convertToMp3}
        uploadAudio={uploadAudio}
        createPreviewUrl={createPreviewUrl}
      />
    );

    const input = screen.getByLabelText("Chọn file");
    const file = new File(["video"], "demo.mp4", { type: "video/mp4" });

    fireEvent.change(input, { target: { files: [file] } });
    fireEvent.click(
      screen.getByRole("button", { name: "Chuyển đổi sang MP3" })
    );

    await waitFor(() => {
      expect(convertToMp3).toHaveBeenCalledWith(file, expect.any(Function));
    });

    await waitFor(() => {
      expect(uploadAudio).toHaveBeenCalledWith(
        expect.objectContaining({ name: "ket-qua.mp3" }),
        expect.any(Function)
      );
    });

    expect(await screen.findByText("Hoàn tất")).toBeInTheDocument();
    expect(screen.getByText("Link audio trực tiếp")).toBeInTheDocument();
    expect(screen.getByRole("audio")).toHaveAttribute("src", "blob:local-preview");
    expect(screen.getByText("Trạng thái").closest(".status-strip")).toHaveClass(
      "is-success"
    );

    const copyButton = screen.getByRole("button", { name: "Copy link" });
    expect(copyButton).toHaveClass("copy-link-button");
    fireEvent.click(copyButton);

    await waitFor(() => {
      expect(writeText).toHaveBeenCalledWith(
        "https://blob.vercel-storage.com/audio/ket-qua.mp3"
      );
    });

    expect(screen.getByRole("button", { name: "Đã copy" })).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: "Mở link audio" })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("https://blob.vercel-storage.com/audio/ket-qua.mp3")
    ).not.toBeInTheDocument();
  });
});
