# Upload To MP3 Design

**Goal**

Build a Vercel-deployable web app where a user uploads a local video or audio file, the browser converts it to MP3, and the app returns a stable direct audio URL plus a download option.

**Scope**

- Input is a file uploaded from the user's device.
- Output is an MP3 file, an audio player preview, a download action, and a public direct URL.
- Conversion runs in the browser with `ffmpeg.wasm`.
- Stable file hosting uses `Vercel Blob`.

**Out Of Scope**

- Processing URLs from TikTok or other third-party platforms.
- Background jobs, queues, or resumable uploads.
- User accounts, auth, billing, and analytics.
- Multiple output formats beyond MP3.

**Architecture**

- `Next.js` App Router provides the UI and the server route for Blob upload token generation.
- A client-side conversion flow uses `@ffmpeg/ffmpeg` and `@ffmpeg/util`.
- The converted MP3 is uploaded from the browser to `Vercel Blob` using the official client upload flow.
- The app renders the returned Blob URL as the direct audio URL and download target.

**User Flow**

1. User selects a local file.
2. The app validates type and size before conversion.
3. The app loads `ffmpeg.wasm` on demand.
4. The file is converted to MP3 in the browser.
5. The resulting MP3 is uploaded to Blob storage.
6. The app shows the direct audio URL, player, and download link.

**File Rules**

- Supported inputs: common audio and video formats such as `mp3`, `wav`, `m4a`, `aac`, `mp4`, `mov`, `webm`, `mkv`.
- The first version caps file size to keep browser memory usage reasonable.
- Output file names are normalized to safe ASCII-like slugs with an `.mp3` suffix.

**Quality Rules**

- The app preserves quality as much as practical for MP3 output.
- Because MP3 is a lossy format, non-MP3 sources cannot remain bit-identical to the original.
- The first version uses a high-quality MP3 encoding setting rather than adding user-facing tuning controls.

**Error Handling**

- Unsupported file type: block early with a clear message.
- File too large: block early with a clear limit.
- Conversion failure: show a retryable error.
- Upload failure: allow local MP3 download if conversion succeeded, even when the stable URL could not be created.
- Missing Blob configuration: explain that storage must be connected on Vercel for direct URLs to work.

**Testing**

- Unit tests for file validation, output naming, and result formatting helpers.
- Component tests for the main page states: idle, invalid file, conversion progress, upload progress, success, and failure.
- Manual smoke checks for audio input, video input, and storage-misconfigured behavior.

**Deployment**

- Deploy on Vercel as a preview by default.
- The app requires Blob storage to be connected in Vercel for stable public URLs.
- Environment variables and storage setup will be documented in the README.
