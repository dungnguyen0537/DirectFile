# Split Layout Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Khôi phục cảm giác desktop chia đôi rõ ràng như layout ban đầu và làm nút `Copy link` tròn, dày, chuyên nghiệp hơn.

**Architecture:** Giữ nguyên logic upload hiện tại và chỉ chỉnh lại page structure cùng CSS. Nút copy tiếp tục dùng component chung, nhưng được nâng style để hợp với bố cục split 50/50.

**Tech Stack:** Next.js, React, TypeScript, Vitest, Testing Library, CSS

---

### Task 1: Lock the chosen presentation

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Review the current page structure against the approved split layout**
- [ ] **Step 2: Identify the minimal class and markup changes needed to restore a stronger 50/50 desktop split**

### Task 2: Implement the layout and button polish

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/app/globals.css`
- Modify: `src/components/copy-link-button.tsx`

- [ ] **Step 1: Adjust page markup for the restored split emphasis**
- [ ] **Step 2: Update split-layout CSS for stronger side-by-side presentation on desktop**
- [ ] **Step 3: Refine the shared `Copy link` button styling**
- [ ] **Step 4: Check that mobile stacking remains intact**

### Task 3: Verify the project

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Run `npm test -- --run`**
- [ ] **Step 2: Run `npm run build`**
