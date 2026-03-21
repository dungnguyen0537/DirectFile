# Dual Media Upload Design

**Goal**

Mở rộng ứng dụng hiện tại thành giao diện hai khối độc lập: một khối chuyển đổi audio/video sang MP3 và một khối upload ảnh giữ nguyên chất lượng để lấy URL trực tiếp.

**Scope**

- Việt hóa toàn bộ giao diện sang tiếng Việt có dấu.
- Bỏ hoàn toàn chức năng tạo đường link tải file MP3.
- Giữ luồng chuyển đổi MP3 trong trình duyệt và upload MP3 lên Vercel Blob.
- Thêm luồng upload ảnh gốc lên Vercel Blob và xem trước ảnh sau khi upload.
- Desktop hiển thị hai cột song song: MP3 bên trái, Ảnh bên phải.
- Mobile hiển thị hai khối theo chiều dọc: MP3 trước, Ảnh sau.

**Out Of Scope**

- Resize, nén, crop, hoặc xử lý lại ảnh trước khi upload.
- Thêm drag-and-drop, đăng nhập, phân quyền, hoặc thư viện upload khác.
- Thêm nút tải xuống cho MP3 hoặc ảnh.

**Architecture**

- Trang chủ tiếp tục là một trang duy nhất, nhưng render hai component riêng biệt cho hai luồng xử lý.
- Luồng MP3 tái sử dụng phần lớn helper hiện có cho kiểm tra file, chuyển đổi bằng `ffmpeg.wasm`, và upload Blob.
- Luồng ảnh dùng helper validation và helper upload riêng, đồng thời có route Blob riêng để ràng buộc MIME type của ảnh.
- Các route upload được tách riêng cho MP3 và Ảnh để giảm nhầm lẫn quy tắc `allowedContentTypes`.

**User Flow**

1. Người dùng vào trang chủ và nhìn thấy hai khối chức năng.
2. Khối MP3 cho phép chọn audio/video hợp lệ, chuyển đổi sang MP3, upload, rồi hiển thị audio preview và URL trực tiếp.
3. Khối Ảnh cho phép chọn ảnh hợp lệ, upload nguyên bản lên Blob, rồi hiển thị ảnh preview và URL trực tiếp.
4. Mỗi khối có trạng thái, lỗi, và kết quả độc lập, không ảnh hưởng khối còn lại.

**Validation Rules**

- MP3 source giữ giới hạn hiện tại cho audio/video đầu vào.
- Ảnh chấp nhận các định dạng phổ biến như `jpg`, `jpeg`, `png`, `webp`.
- Ảnh được upload giữ nguyên chất lượng bản gốc, không tái mã hóa.

**Error Handling**

- Tất cả thông báo lỗi và trạng thái dùng tiếng Việt có dấu.
- Mỗi khối tự hiển thị lỗi riêng, không khóa khối còn lại.
- Thiếu cấu hình Blob vẫn trả lỗi rõ ràng từ server route tương ứng.

**Testing**

- Cập nhật test validation cho tiếng Việt có dấu và thêm test cho file ảnh.
- Thêm test route upload ảnh và giữ test route MP3 hiện có.
- Cập nhật test component MP3 để bỏ kỳ vọng về link tải xuống.
- Thêm test component ảnh cho trạng thái hợp lệ, upload thành công, preview, và URL trực tiếp.

**Deployment**

- Vẫn deploy trên Vercel.
- Cần `Vercel Blob` với `BLOB_READ_WRITE_TOKEN` cho cả hai luồng upload.
