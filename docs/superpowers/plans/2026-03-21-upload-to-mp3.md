# Upload To MP3 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Next.js app that accepts a local upload, converts it to MP3 in the browser, uploads the MP3 to Vercel Blob, and returns a stable direct audio URL.

**Architecture:** Use a small Next.js App Router app with a client component for file selection and conversion, utility modules for validation and naming, and one server route for Blob upload token generation. Keep conversion in the browser to stay compatible with Vercel free-tier limits and use tests to drive behavior around validation and UI state transitions.

**Tech Stack:** Next.js, React, TypeScript, Vitest, Testing Library, `@ffmpeg/ffmpeg`, `@ffmpeg/util`, `@vercel/blob`

---

### Task 1: Bootstrap the app and test harness

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `next-env.d.ts`
- Create: `src/app/layout.tsx`
- Create: `src/app/page.tsx`
- Create: `src/app/globals.css`
- Create: `src/lib/constants.ts`
- Create: `vitest.config.ts`
- Create: `vitest.setup.ts`
- Create: `.gitignore`

- [ ] **Step 1: Create the minimal Next.js and Vitest project files**
- [ ] **Step 2: Install dependencies**
Run: `npm install`
Expected: lockfile created with no install errors
- [ ] **Step 3: Run the empty test suite**
Run: `npm test -- --run`
Expected: zero failing tests, possibly zero test files

### Task 2: Add validation and naming utilities with TDD

**Files:**
- Create: `src/lib/file-rules.ts`
- Test: `src/lib/file-rules.test.ts`

- [ ] **Step 1: Write a failing test for accepted file types**
- [ ] **Step 2: Run `npm test -- --run src/lib/file-rules.test.ts` and verify it fails for missing implementation**
- [ ] **Step 3: Write the minimal implementation to pass**
- [ ] **Step 4: Add a failing test for file size limits**
- [ ] **Step 5: Run the same test command and verify the new test fails**
- [ ] **Step 6: Extend the implementation minimally**
- [ ] **Step 7: Add a failing test for MP3 output file naming**
- [ ] **Step 8: Run the same test command and verify the new test fails**
- [ ] **Step 9: Finish the helper implementation**
- [ ] **Step 10: Run `npm test -- --run src/lib/file-rules.test.ts` and confirm all tests pass**

### Task 3: Add the Blob upload route

**Files:**
- Create: `src/app/api/audio/upload/route.ts`
- Modify: `src/lib/file-rules.ts`
- Test: `src/app/api/audio/upload/route.test.ts`

- [ ] **Step 1: Write a failing test for rejecting non-MP3 upload requests**
- [ ] **Step 2: Run `npm test -- --run src/app/api/audio/upload/route.test.ts` and verify it fails**
- [ ] **Step 3: Implement the minimal route helpers needed for validation**
- [ ] **Step 4: Write a failing test for a valid upload token response contract**
- [ ] **Step 5: Run the same test command and verify it fails for missing behavior**
- [ ] **Step 6: Implement the route using the official Vercel Blob client upload handler**
- [ ] **Step 7: Run `npm test -- --run src/app/api/audio/upload/route.test.ts` and confirm pass**

### Task 4: Build the upload and convert UI with TDD

**Files:**
- Create: `src/components/upload-to-mp3-form.tsx`
- Create: `src/lib/ffmpeg-client.ts`
- Create: `src/lib/blob-upload.ts`
- Modify: `src/app/page.tsx`
- Modify: `src/app/globals.css`
- Test: `src/components/upload-to-mp3-form.test.tsx`

- [ ] **Step 1: Write a failing component test for invalid file feedback**
- [ ] **Step 2: Run `npm test -- --run src/components/upload-to-mp3-form.test.tsx` and verify it fails**
- [ ] **Step 3: Implement the minimal UI for file selection and validation**
- [ ] **Step 4: Write a failing component test for the success state with player and direct URL**
- [ ] **Step 5: Run the same test command and verify it fails**
- [ ] **Step 6: Implement conversion and upload orchestration with clear idle, converting, uploading, success, and error states**
- [ ] **Step 7: Run `npm test -- --run src/components/upload-to-mp3-form.test.tsx` and confirm pass**

### Task 5: Document and verify the project

**Files:**
- Create: `README.md`
- Modify: `package.json`

- [ ] **Step 1: Write README setup and deployment instructions for Blob storage**
- [ ] **Step 2: Run the full test suite**
Run: `npm test -- --run`
Expected: all tests pass
- [ ] **Step 3: Run the production build**
Run: `npm run build`
Expected: successful Next.js build
- [ ] **Step 4: Commit the completed project when verification is green**
