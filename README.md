# MP3 và Ảnh Trực Tiếp

Web app `Next.js` cho phép:

- tải file video hoặc audio từ máy, chuyển đổi sang MP3 ngay trong trình duyệt bằng `ffmpeg.wasm`, rồi upload MP3 lên `Vercel Blob` để nhận direct audio URL ổn định
- tải file ảnh gốc lên `Vercel Blob` để nhận direct image URL và xem trước ảnh ngay trên trang

## Tính năng

- Chuyển audio hoặc video thành MP3 ngay trong browser
- Upload MP3 lên Blob storage và nhận link audio trực tiếp
- Upload ảnh giữ nguyên chất lượng và nhận link ảnh trực tiếp
- Xem trước audio và ảnh ngay trên giao diện
- Giao diện tiếng Việt, desktop chia hai khối `MP3` và `Ảnh`

## Công nghệ

- `Next.js`
- `React`
- `TypeScript`
- `Vitest` + `Testing Library`
- `@ffmpeg/ffmpeg`
- `@vercel/blob`

## Chạy local

```bash
npm install
npm run dev
```

Mở `http://localhost:3000`.

## Cấu hình Blob storage

App can `Vercel Blob` de tao direct audio URL on dinh.

1. Deploy repo lên Vercel
2. Trong project Vercel, tạo hoặc connect `Blob` store
3. Đảm bảo env `BLOB_READ_WRITE_TOKEN` có sẵn trong project
4. Redeploy nếu bạn vừa mới thêm Blob store

Nếu Blob chưa được cấu hình, route `/api/audio/upload` và `/api/image/upload` sẽ trả về lỗi `503` với thông điệp rõ ràng.

## Test và build

```bash
npm test -- --run
npm run build
```

## Deploy lên Vercel

Preview deploy:

```bash
vercel deploy -y
```

Production deploy:

```bash
vercel deploy --prod -y
```

## Ghi chú

- Ban đầu tải `ffmpeg.wasm` sẽ mất thêm thời gian vì cần tải runtime WebAssembly.
- MP3 là định dạng nén lossy, vì vậy file đầu ra không thể giữ bit-perfect với các nguồn không phải MP3.
- Giới hạn dung lượng hiện tại được đặt ở `64 MB` để tránh quá tải bộ nhớ trên trình duyệt.
