# Copy Link UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Thay phần URL thô và link mở trong kết quả MP3/Ảnh bằng nút `Copy link` dễ sao chép hơn.

**Architecture:** Tạo một component `CopyLinkButton` dùng chung để gom logic clipboard và trạng thái `Đã copy`. Hai form kết quả chỉ render preview tương ứng và truyền URL trực tiếp vào nút copy, giữ thay đổi tối thiểu và tránh lặp logic.

**Tech Stack:** Next.js, React, TypeScript, Vitest, Testing Library

---

### Task 1: Lock the new result behavior with tests

**Files:**
- Modify: `src/components/upload-to-mp3-form.test.tsx`
- Modify: `src/components/image-upload-form.test.tsx`

- [ ] **Step 1: Write a failing test for MP3 success state showing `Copy link` instead of raw URL/open link**
- [ ] **Step 2: Run `npm test -- --run src/components/upload-to-mp3-form.test.tsx` and verify it fails**
- [ ] **Step 3: Write a failing test for image success state showing `Copy link` instead of raw URL/open link**
- [ ] **Step 4: Run `npm test -- --run src/components/image-upload-form.test.tsx` and verify it fails**

### Task 2: Implement the shared copy button

**Files:**
- Create: `src/components/copy-link-button.tsx`
- Modify: `src/components/upload-to-mp3-form.tsx`
- Modify: `src/components/image-upload-form.tsx`

- [ ] **Step 1: Implement the minimal shared clipboard button**
- [ ] **Step 2: Update MP3 result UI to use the button**
- [ ] **Step 3: Update image result UI to use the button**
- [ ] **Step 4: Re-run `npm test -- --run src/components/upload-to-mp3-form.test.tsx src/components/image-upload-form.test.tsx` and confirm pass**

### Task 3: Verify the project

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Run `npm test -- --run`**
- [ ] **Step 2: Run `npm run build`**
