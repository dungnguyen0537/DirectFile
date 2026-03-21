# Dual Media Upload Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Việt hóa giao diện hiện tại, bỏ link tải file MP3, thêm luồng upload ảnh lấy URL trực tiếp với preview, và đổi layout desktop sang hai cột MP3/Ảnh.

**Architecture:** Giữ trang chủ dạng một page nhưng tách logic thành hai component độc lập cho MP3 và Ảnh. Tạo helper validation và upload riêng cho ảnh, cùng route Blob riêng để ràng buộc MIME type, trong khi giữ luồng MP3 hiện có với thay đổi tối thiểu.

**Tech Stack:** Next.js, React, TypeScript, Vitest, Testing Library, `@ffmpeg/ffmpeg`, `@vercel/blob`

---

### Task 1: Update docs and validation boundaries

**Files:**
- Modify: `README.md`
- Modify: `src/lib/file-rules.ts`
- Test: `src/lib/file-rules.test.ts`

- [ ] **Step 1: Write a failing test for accepted image file types**
- [ ] **Step 2: Run `npm test -- --run src/lib/file-rules.test.ts` and verify it fails for missing image validation**
- [ ] **Step 3: Implement the minimal image validation helpers**
- [ ] **Step 4: Update README copy to describe the dual MP3/image app**
- [ ] **Step 5: Re-run `npm test -- --run src/lib/file-rules.test.ts` and confirm pass**

### Task 2: Add image Blob upload contract

**Files:**
- Create: `src/app/api/image/upload/route.ts`
- Create: `src/app/api/image/upload/route.test.ts`
- Create: `src/lib/image-upload.ts`
- Modify: `src/app/api/audio/upload/route.ts`
- Test: `src/app/api/audio/upload/route.test.ts`

- [ ] **Step 1: Write a failing test for rejecting non-image upload requests**
- [ ] **Step 2: Run `npm test -- --run src/app/api/image/upload/route.test.ts` and verify it fails**
- [ ] **Step 3: Implement the minimal image upload route**
- [ ] **Step 4: Add a failing test for successful public image upload token generation**
- [ ] **Step 5: Run the same test command and verify the new expectation fails first**
- [ ] **Step 6: Implement the image upload helper and keep audio route behavior intact**
- [ ] **Step 7: Run `npm test -- --run src/app/api/audio/upload/route.test.ts src/app/api/image/upload/route.test.ts` and confirm pass**

### Task 3: Update MP3 UI behavior and add image UI

**Files:**
- Modify: `src/components/upload-to-mp3-form.tsx`
- Create: `src/components/image-upload-form.tsx`
- Create: `src/components/image-upload-form.test.tsx`
- Modify: `src/components/upload-to-mp3-form.test.tsx`
- Modify: `src/app/page.tsx`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Write a failing test for the MP3 success state without a download link**
- [ ] **Step 2: Run `npm test -- --run src/components/upload-to-mp3-form.test.tsx` and verify it fails**
- [ ] **Step 3: Update the MP3 component minimally to remove download UI and switch copy to tiếng Việt có dấu**
- [ ] **Step 4: Write a failing test for the image upload success state with preview and direct URL**
- [ ] **Step 5: Run `npm test -- --run src/components/image-upload-form.test.tsx` and verify it fails**
- [ ] **Step 6: Implement the image upload component and page layout**
- [ ] **Step 7: Re-run `npm test -- --run src/components/upload-to-mp3-form.test.tsx src/components/image-upload-form.test.tsx` and confirm pass**

### Task 4: Full verification

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `README.md`

- [ ] **Step 1: Run the full test suite with `npm test -- --run`**
- [ ] **Step 2: Run the production build with `npm run build`**
- [ ] **Step 3: Review UI copy and layout for scope compliance**
