import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";

const handleUploadMock = vi.fn();
const originalBlobToken = process.env.BLOB_READ_WRITE_TOKEN;

vi.mock("@vercel/blob/client", () => ({
  handleUpload: handleUploadMock
}));

describe("POST /api/audio/upload", () => {
  beforeEach(() => {
    handleUploadMock.mockReset();
    process.env.BLOB_READ_WRITE_TOKEN = "test-token";
  });

  it("rejects non-mp3 pathnames before generating a token", async () => {
    const { POST } = await import("./route");
    const request = new Request("http://localhost/api/audio/upload", {
      method: "POST",
      body: JSON.stringify({
        type: "blob.generate-client-token",
        payload: {
          pathname: "audio/source.wav",
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
      error: "Chỉ cho phép upload file MP3 đã chuyển đổi."
    });
    expect(handleUploadMock).not.toHaveBeenCalled();
  });

  it("returns the client token contract for valid mp3 uploads", async () => {
    handleUploadMock.mockResolvedValue({
      type: "blob.generate-client-token",
      clientToken: "signed-token"
    });

    const { POST } = await import("./route");
    const request = new Request("http://localhost/api/audio/upload", {
      method: "POST",
      body: JSON.stringify({
        type: "blob.generate-client-token",
        payload: {
          pathname: "audio/final-track.mp3",
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
      clientToken: "signed-token"
    });
    expect(handleUploadMock).toHaveBeenCalledTimes(1);

    const handleUploadOptions = handleUploadMock.mock.calls[0]?.[0];
    const tokenOptions = await handleUploadOptions.onBeforeGenerateToken(
      "audio/final-track.mp3",
      null,
      false
    );

    expect(tokenOptions).toMatchObject({
      addRandomSuffix: true,
      allowedContentTypes: ["audio/mpeg"]
    });
  });

  it("explains when Blob storage is not configured", async () => {
    delete process.env.BLOB_READ_WRITE_TOKEN;

    const { POST } = await import("./route");
    const request = new Request("http://localhost/api/audio/upload", {
      method: "POST",
      body: JSON.stringify({
        type: "blob.generate-client-token",
        payload: {
          pathname: "audio/final-track.mp3",
          multipart: false,
          clientPayload: null
        }
      }),
      headers: {
        "content-type": "application/json"
      }
    });

    const response = await POST(request);

    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toEqual({
      error: "Blob storage chưa được cấu hình trên Vercel."
    });
    expect(handleUploadMock).not.toHaveBeenCalled();
  });
});

afterAll(() => {
  if (originalBlobToken) {
    process.env.BLOB_READ_WRITE_TOKEN = originalBlobToken;
    return;
  }

  delete process.env.BLOB_READ_WRITE_TOKEN;
});
