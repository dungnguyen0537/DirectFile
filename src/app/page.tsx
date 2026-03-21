import { ImageUploadForm } from "@/components/image-upload-form";
import { UploadToMp3Form } from "@/components/upload-to-mp3-form";

export default function Home() {
  return (
    <main className="page-shell">
      <section className="page-overview-panel">
        <div className="page-header">
          <p className="page-kicker">Công cụ media trực tiếp trên Vercel</p>
          <h1 className="page-title">Chuyển MP3 và tải ảnh lấy URL trực tiếp</h1>
          <p className="page-summary">
            Chọn audio hoặc video để chuyển thành MP3 ngay trong trình duyệt,
            hoặc tải ảnh gốc lên Blob để lấy đường dẫn trực tiếp và xem trước
            ngay.
          </p>
        </div>
      </section>

      <section className="workspace-grid split-workspace independent-workspace">
        <UploadToMp3Form />
        <ImageUploadForm />
      </section>
    </main>
  );
}
