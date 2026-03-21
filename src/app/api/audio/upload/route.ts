import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { MAX_FILE_SIZE_BYTES } from "@/lib/file-rules";

function isMp3Pathname(pathname: string) {
  return pathname.toLowerCase().endsWith(".mp3");
}

export async function POST(request: Request) {
  let body: HandleUploadBody;

  try {
    body = (await request.json()) as HandleUploadBody;
  } catch {
    return NextResponse.json(
      { error: "Nội dung request không hợp lệ." },
      { status: 400 }
    );
  }

  if (
    body.type === "blob.generate-client-token" &&
    !isMp3Pathname(body.payload.pathname)
  ) {
    return NextResponse.json(
      { error: "Chỉ cho phép upload file MP3 đã chuyển đổi." },
      { status: 400 }
    );
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "Blob storage chưa được cấu hình trên Vercel." },
      { status: 503 }
    );
  }

  try {
    const jsonResponse = await handleUpload({
      request,
      body,
      onBeforeGenerateToken: async () => ({
        addRandomSuffix: true,
        allowedContentTypes: ["audio/mpeg"],
        maximumSizeInBytes: MAX_FILE_SIZE_BYTES
      })
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Không thể tạo upload token.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
