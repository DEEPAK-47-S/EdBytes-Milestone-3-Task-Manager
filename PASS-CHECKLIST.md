# Required checks
- [x] Connect the Add button or form to add nonblank text.
- [x] Add a Delete action for each task.
- [x] Use the supplied save/load helper after changes.
- [x] Refresh and show that saved tasks return.

Optional, not required for approval: Completion toggles, categories and richer error recovery.

---

## Verification & Submission Notes

### 1. What I Changed
- Completed the form submission event listener in `app.js` to prevent default submit, read and `.trim()` input text, reject blank/whitespace input, push valid text into the `tasks` array, persist data using the supplied `save()` helper, re-render the task list, and clear/refocus the input.
- Completed the `button.onclick` listener inside `render()` to selectively remove only the clicked task using `tasks.splice(index, 1)`, call `save()`, and re-render.
- Preserved the exact EdBytes `save()` helper, initial `try/catch` JSON parse loading, and storage key (`practice-tasks`).
- Refined `index.html` and `style.css` into an attractive, modern, responsive, and accessible "DEEPAK TASK MANAGER" interface with semantic HTML, helpful status messages (`#message`), clear keyboard focus rings, and friendly empty states.

### 2. One Thing I Learned
- **Client-Side State Persistence via LocalStorage**: Learned how browser `localStorage` acts as a synchronous, persistent key-value store that survives page reloads and browser restarts without a backend server, and the importance of JSON serialization (`JSON.stringify` / `JSON.parse`) combined with safe fallback parsing.

### 3. One Ordinary Test
- **Input**: "Learn Python" entered into `#text` and submitted via the Add button (or Enter key).
- **Result**: Successfully added to the `tasks` array, saved to `localStorage` under key `practice-tasks`, and immediately rendered as a new list item in `#list` with its own working Delete button. The input field was cleared and refocused.

### 4. One Boundary / Failure Test
- **Input**: Empty string `""` and whitespace-only string `"     "`.
- **Result**: Safely rejected via `text = input.value.trim()`. No blank task was added to `tasks` or `localStorage`. A clear, accessible notification (`"Please enter a task before adding."`) was displayed in `#message` without disrupting existing tasks.
