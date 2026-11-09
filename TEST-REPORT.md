# EdBytes Milestone 3 – Verification & Test Report

**Project**: DEEPAK TASK MANAGER  
**Date**: November 9, 2026  
**Intern**: Deepakumar S (`DEEPAK-S-47`)  
**Curriculum Module**: TASK-FSD-02 (Beginner)  
**Status**: 100% Complete & Verified  

---

## 1. Required Checks Verification

| # | Check Description | Status | Evidence / Verification Method |
|---|---|---|---|
| **1** | **Add Task**: Connect the Add button or form to add nonblank text | **PASSED** | Validates trimmed input; prevents empty/whitespace submissions; immediately adds nonblank tasks to `tasks` array and DOM. |
| **2** | **Delete Task**: Add a Delete action for each task | **PASSED** | Each rendered task item contains an individual Delete button (`tasks.splice(index, 1)`). Only the selected task is removed. |
| **3** | **Save / Load Helper**: Use the supplied helper after changes | **PASSED** | Unmodified EdBytes `save()` helper persists `tasks` into `localStorage['practice-tasks']` on every add and delete operation. |
| **4** | **Refresh Persistence**: Show that saved tasks return | **PASSED** | Initial page load parses `localStorage['practice-tasks']` and renders all saved tasks. Verified via browser reload simulation & real headless browser automation. |

---

## 2. Test Execution Details (Phase 7 Tests)

### TEST 1 – NORMAL ADD: Task Addition
- **Action**: User enters `"Learn Python"` into `#text` and clicks `"Add"` (or presses Enter).
- **Result**:
  - Task appears immediately at the bottom of the `#list`.
  - Input field is cleared and refocused.
  - State is saved to `localStorage['practice-tasks']`.
- **Verdict**: **PASSED**

### TEST 2 – EMPTY INPUT: Blank Submission
- **Action**: User submits the form with an empty input (`""`).
- **Result**:
  - Input rejection triggered via `text = input.value.trim()`.
  - No new task is appended to `tasks` array or `#list`.
  - Status alert displayed: `"Please enter a task before adding."`.
- **Verdict**: **PASSED**

### TEST 3 – WHITESPACE INPUT: Spaces-Only Input
- **Action**: User enters `"     "` (multiple spaces) and clicks `"Add"`.
- **Result**:
  - `.trim()` results in an empty string `""`.
  - Rejected cleanly without altering state.
- **Verdict**: **PASSED**

### TEST 4 – DELETE TASK: Individual Task Removal
- **Action**: User adds `"Learn HTML"` and `"Learn CSS"`, then clicks `"Delete"` on `"Learn HTML"`.
- **Result**:
  - `tasks.splice(0, 1)` executed.
  - Only `"Learn HTML"` is removed from the list.
  - `"Learn CSS"` remains unchanged in `#list` and `localStorage`.
- **Verdict**: **PASSED**

### TEST 5 – REFRESH PERSISTENCE: Reload Recovery
- **Action**: User adds `"Learn Python"`, `"Learn JavaScript"`, and `"Complete Portfolio"`. Page is refreshed (`Page.reload`).
- **Result**:
  - Browser reinitializes `app.js`.
  - JSON parser reads `localStorage.getItem('practice-tasks')`.
  - All 3 tasks are restored and rendered identically.
- **Verdict**: **PASSED**

### TEST 6 – DELETE PERSISTENCE: Post-Reload Deletion State
- **Action**: User deletes `"Learn JavaScript"` and then refreshes the page.
- **Result**:
  - The deleted task does not reappear; only the 2 remaining tasks are rendered.
- **Verdict**: **PASSED**

### TEST 7 – INPUT LIMIT: 200-Character Constraint
- **Action**: User inspects `#text` input field attribute `maxlength="200"`.
- **Result**:
  - Browser restricts typing beyond 200 characters natively.
- **Verdict**: **PASSED**

---

## 3. Real Browser Screenshots

The headless Chromium browser executed the complete end-to-end user workflow and captured high-resolution evidence in `evidence/`:
1. `evidence/desktop.png` – Desktop view (1280x800) with 3 tasks added.
2. `evidence/mobile.png` – Mobile responsive view (375x750) displaying flexible layout and clear touch targets.
3. `evidence/refreshed.png` – View immediately following page reload showing restored tasks.
4. `evidence/after-delete.png` – View after deleting an individual task.

---

## 4. Code Quality & Standards

- **Untouched Backup**: Stored in `c:\Users\skdee\Downloads\task-fsd-02-beginner-20261028-backup\` and project `originals-backup/`.
- **Supplied Helper Integrity**: `save()` function name, parameter signature, and localStorage key (`practice-tasks`) kept exactly as supplied by EdBytes.
- **Safe DOM Practices**: Strict usage of `textContent` and `createElement` instead of vulnerable `innerHTML`.
- **Accessibility (A11y)**:
  - Form inputs linked via `<label for="text">`.
  - Status announcements via `role="status"` and `aria-live="polite"`.
  - Delete buttons have descriptive `aria-label="Delete task: <name>"`.
  - High-contrast `:focus-visible` outline for keyboard navigation.
- **Responsive CSS**: Modern CSS variables, flexbox layout, mobile-first breakpoints, clean card shadows, and typography.
