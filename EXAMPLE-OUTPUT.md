# Target shape, not a substitute for your work
One live app or view-only source-folder link, with a short test note.

Show each required check and explain one decision in your own words.

---

### Project: DEEPAK TASK MANAGER (Milestone 3)
- **Live App**: Hosted via GitHub Pages
- **Source Code**: `task-fsd-02-beginner-20261028`

### Required Checks Completed
1. **Add nonblank text**: Form listener prevents empty/space-only inputs and appends validated tasks.
2. **Delete action for each task**: Every item has a Delete button that selectively removes only that task via `tasks.splice(index, 1)`.
3. **Use supplied save/load helper**: State is saved after each add and delete operation using the unmodified EdBytes `save()` helper with key `practice-tasks`.
4. **Refresh persistence**: Previously saved tasks are loaded and rendered automatically upon page initialization or browser refresh.

### One Decision Explained in My Own Words
"I decided to wrap each task text inside a `<span class="task-text">` alongside the `<button class="btn-delete">` inside each `<li>` element. This allowed flexbox CSS layout to easily give the task text flexible width (`flex: 1`) and `word-break: break-word`, ensuring long task descriptions wrap gracefully and never overlap or misalign the Delete button across all desktop and mobile screen sizes."
