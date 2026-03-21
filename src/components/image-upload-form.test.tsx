import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ImageUploadForm } from "./image-upload-form";

describe("ImageUploadForm", () => {
  it("renders the success state with image preview and direct url", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(window.navigator, "clipboard", {
      configurable: true,
      value: { writeText }
    });
    const uploadImage = vi.fn().mockResolvedValue({
      url: "https://blob.vercel-storage.com/image/anh-demo.jpg"
    });
    const createPreviewUrl = vi.fn().mockReturnValue("blob:image-preview");

    render(
      <ImageUploadForm
        uploadImage={uploadImage}
        createPreviewUrl={createPreviewUrl}
      />
    );

    const input = screen.getByLabelText("Chọn ảnh");
    const file = new File(["image"], "ảnh-demo.jpg", { type: "image/jpeg" });

    fireEvent.change(input, { target: { files: [file] } });
    fireEvent.click(screen.getByRole("button", { name: "Tải ảnh lên" }));

    await waitFor(() => {
      expect(uploadImage).toHaveBeenCalledWith(file, expect.any(Function));
    });

    expect(await screen.findByText("Hoàn tất")).toBeInTheDocument();
    expect(screen.getByAltText("Ảnh đã tải lên")).toHaveAttribute(
      "src",
      "blob:image-preview"
    );
    expect(screen.getByText("Link ảnh trực tiếp")).toBeInTheDocument();
    expect(screen.getByText("Trạng thái").closest(".status-strip")).toHaveClass(
      "is-success"
    );

    const copyButton = screen.getByRole("button", { name: "Copy link" });
    expect(copyButton).toHaveClass("copy-link-button");
    fireEvent.click(copyButton);

    await waitFor(() => {
      expect(writeText).toHaveBeenCalledWith(
        "https://blob.vercel-storage.com/image/anh-demo.jpg"
      );
    });

    expect(screen.getByRole("button", { name: "Đã copy" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Mở ảnh" })).not.toBeInTheDocument();
    expect(
      screen.queryByText("https://blob.vercel-storage.com/image/anh-demo.jpg")
    ).not.toBeInTheDocument();
  });
});
