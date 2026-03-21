import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";

const handleUploadMock = vi.fn();
const originalBlobToken = process.env.BLOB_READ_WRITE_TOKEN;

vi.mock("@vercel/blob/client", () => ({
  handleUpload: handleUploadMock
}));

describe("POST /api/image/upload", () => {
  beforeEach(() => {
    handleUploadMock.mockReset();
    process.env.BLOB_READ_WRITE_TOKEN = "test-token";
  });

  it("rejects non-image pathnames before generating a token", async () => {
    const { POST } = await import("./route");
    const request = new Request("http://localhost/api/image/upload", {
      method: "POST",
      body: JSON.stringify({
        type: "blob.generate-client-token",
        payload: {
          pathname: "image/tep-khong-hop-le.mp3",
          multipart: false,
          clientPayload: null
        }
      }),
      headers: {
        "content-type": "application/json"
      }
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: "Chỉ cho phép upload file ảnh hợp lệ."
    });
    expect(handleUploadMock).not.toHaveBeenCalled();
  });

  it("returns the client token contract for valid image uploads", async () => {
    handleUploadMock.mockResolvedValue({
      type: "blob.generate-client-token",
      clientToken: "image-signed-token"
    });

    const { POST } = await import("./route");
    const request = new Request("http://localhost/api/image/upload", {
      method: "POST",
      body: JSON.stringify({
        type: "blob.generate-client-token",
        payload: {
          pathname: "image/anh-demo.webp",
          multipart: false,
          clientPayload: null
        }
      }),
      headers: {
        "content-type": "application/json"
      }
    });

    const response = await POST(request);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual({
      type: "blob.generate-client-token",
      clientToken: "image-signed-token"
    });
    expect(handleUploadMock).toHaveBeenCalledTimes(1);

    const handleUploadOptions = handleUploadMock.mock.calls[0]?.[0];
    const tokenOptions = await handleUploadOptions.onBeforeGenerateToken(
      "image/anh-demo.webp",
      null,
      false
    );

    expect(tokenOptions).toMatchObject({
      addRandomSuffix: true,
      allowedContentTypes: ["image/jpeg", "image/png", "image/webp"]
    });
  });
});

afterAll(() => {
  if (originalBlobToken) {
    process.env.BLOB_READ_WRITE_TOKEN = originalBlobToken;
    return;
  }

  delete process.env.BLOB_READ_WRITE_TOKEN;
});
