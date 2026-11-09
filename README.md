# DEEPAK TASK MANAGER – EdBytes Milestone 3

A clean, modern, and accessible client-side Task Management application built with vanilla HTML, CSS, and JavaScript. Developed as part of the **EdBytes Full Stack Development Internship (Milestone 3 / TASK-FSD-02)**.

---

## 📌 Features

- **Add New Tasks**: Quickly add tasks by typing in the input and clicking "Add" or pressing Enter.
- **Input Validation**: Safely trims whitespace and rejects empty or spaces-only task submissions with friendly error messages.
- **Delete Individual Tasks**: Every task has its own dedicated Delete button that removes only the selected item.
- **Local Data Persistence**: Automatically loads and saves tasks using browser `localStorage` with the EdBytes key `practice-tasks`. Tasks persist seamlessly across page refreshes.
- **Friendly Empty State**: Helpful guidance message displayed when no tasks exist.
- **Modern & Responsive Design**: Clean card-based interface styled with pure CSS, fully responsive across desktop, tablet, and mobile devices.
- **Accessibility**: Semantic HTML5 markup, ARIA roles (`role="status"`, `aria-live="polite"`, `aria-label`), explicit labels, and visible keyboard focus rings.
- **Zero External Dependencies**: 100% vanilla JavaScript, HTML5, and CSS3.

---

## 📂 Project Structure

```
task-fsd-02-beginner-20261028/
├── originals-backup/        # Untouched backup of original EdBytes starter files
├── evidence/                # Automated browser test screenshots
│   ├── desktop.png          # Desktop view (1280x800)
│   ├── mobile.png           # Mobile view (375x750)
│   ├── refreshed.png        # View after browser reload showing persisted tasks
│   └── after-delete.png     # View after deleting an individual task
├── index.html               # Semantic HTML markup
├── style.css                # Pure CSS styling & responsive layout
├── app.js                   # JavaScript functionality with LocalStorage persistence
├── test-milestone3.js       # Automated test suite (14/14 tests passed)
├── capture.js               # Headless browser automation script for evidence
├── PASS-CHECKLIST.md        # Completed EdBytes evaluation checklist
├── EXAMPLE-OUTPUT.md        # Target shape and design decision documentation
├── TEST-REPORT.md           # Comprehensive testing verification report
├── START-HERE.md            # EdBytes getting started instructions
├── guide.md                 # EdBytes curriculum guide
├── LICENSE.txt              # Project licence
└── README.md                # Project documentation & running guide
```

---

## 🚀 How to Run Locally

Since this is a client-side web application, no build tools or package managers are required!

### Option 1: Direct in Browser
Simply double-click `index.html` or right-click and choose **Open with** -> **Google Chrome** / **Microsoft Edge** / **Firefox**.

### Option 2: Using a Local HTTP Server (Python)
```bash
python -m http.server 8000
```
Then visit: `http://localhost:8000/index.html`

### Option 3: Using Node.js `npx serve` or VS Code Live Server
```bash
npx serve .
```

---

## 🧪 Automated Testing

An automated test suite is included in `test-milestone3.js` covering normal, boundary, deletion, refresh, and storage persistence cases.

To run the test suite:
```bash
node test-milestone3.js
```

To run the headless Chromium end-to-end browser verification and regenerate screenshots:
```bash
node capture.js
```

---

## 📜 EdBytes Pass Checklist Verification

- [x] Connect the Add button or form to add nonblank text.
- [x] Add a Delete action for each task.
- [x] Use the supplied save/load helper after changes (`save()` + `practice-tasks`).
- [x] Refresh and show that saved tasks return.

---

## 👨‍💻 Author

**Deepakumar S** (`DEEPAK-S-47`)  
Full Stack Development Intern &bull; EdBytes
