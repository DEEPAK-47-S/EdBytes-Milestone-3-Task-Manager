const list = document.getElementById('list');
let tasks = [];

try {
  const saved = JSON.parse(localStorage.getItem('practice-tasks') || '[]');
  if (Array.isArray(saved)) {
    tasks = saved.filter(x => typeof x === 'string');
  }
} catch {}

function save() {
  localStorage.setItem('practice-tasks', JSON.stringify(tasks));
}

function render() {
  list.replaceChildren();
  const message = document.getElementById('message');

  if (tasks.length === 0) {
    if (message) {
      message.textContent = 'No tasks yet. Add a task above to get started!';
      message.className = 'status-empty';
    }
  } else {
    if (message && message.className === 'status-empty') {
      message.textContent = '';
      message.className = '';
    }
  }

  tasks.forEach((text, index) => {
    const row = document.createElement('li');
    row.className = 'task-item';

    const textSpan = document.createElement('span');
    textSpan.className = 'task-text';
    textSpan.textContent = text;

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'btn-delete';
    button.textContent = 'Delete';
    button.setAttribute('aria-label', `Delete task: ${text}`);
    button.onclick = () => {
      tasks.splice(index, 1);
      save();
      render();
    };

    row.append(textSpan, button);
    list.append(row);
  });
}

document.getElementById('form').onsubmit = e => {
  e.preventDefault();
  const input = document.getElementById('text');
  const text = input.value.trim();
  const message = document.getElementById('message');

  if (!text) {
    if (message) {
      message.textContent = 'Please enter a task before adding.';
      message.className = 'status-error';
    }
    input.focus();
    return;
  }

  tasks.push(text);
  save();
  render();
  input.value = '';
  input.focus();
};

render();
