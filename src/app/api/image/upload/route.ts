import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { MAX_FILE_SIZE_BYTES } from "@/lib/file-rules";

const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];

function isImagePathname(pathname: string) {
  const lowerPathname = pathname.toLowerCase();
  return IMAGE_EXTENSIONS.some((extension) => lowerPathname.endsWith(extension));
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
    !isImagePathname(body.payload.pathname)
  ) {
    return NextResponse.json(
      { error: "Chỉ cho phép upload file ảnh hợp lệ." },
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
        allowedContentTypes: ["image/jpeg", "image/png", "image/webp"],
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
