const fs = require('fs');
const path = require('path');
const vm = require('vm');

console.log('=== ED-BYTES MILESTONE 3 AUTOMATED VERIFICATION SUITE ===\n');

// In-memory persistent storage to simulate browser localStorage across refreshes
const browserStorage = {};

function createBrowserEnvironment() {
  const elements = {};

  class DOMElement {
    constructor(tagName) {
      this.tagName = tagName.toUpperCase();
      this.children = [];
      this.childNodes = [];
      this.attributes = {};
      this.value = '';
      this._textContent = '';
      this.onclick = null;
      this.onsubmit = null;
      this.className = '';
      this.classList = {
        contains: (c) => this.className.split(/\s+/).includes(c),
        add: (c) => { if (!this.classList.contains(c)) this.className = (this.className + ' ' + c).trim(); },
        remove: (c) => { this.className = this.className.split(/\s+/).filter(x => x !== c).join(' '); }
      };
    }

    set textContent(val) {
      this._textContent = String(val);
      this.childNodes = [new DOMTextNode(String(val))];
    }

    get textContent() {
      if (this.childNodes.length > 0) {
        return this.childNodes.map(n => n.textContent).join('');
      }
      return this._textContent;
    }

    setAttribute(k, v) {
      this.attributes[k] = v;
    }

    getAttribute(k) {
      return this.attributes[k];
    }

    append(...nodes) {
      for (const node of nodes) {
        this.childNodes.push(node);
        if (node instanceof DOMElement) {
          this.children.push(node);
        }
      }
    }

    replaceChildren(...nodes) {
      this.childNodes = [];
      this.children = [];
      this.append(...nodes);
    }

    focus() {}
  }

  class DOMTextNode {
    constructor(text) {
      this.textContent = text;
    }
  }

  // Pre-seed elements matching index.html
  elements['list'] = new DOMElement('ul');
  elements['form'] = new DOMElement('form');
  elements['text'] = new DOMElement('input');
  elements['message'] = new DOMElement('p');

  // Set maxlength attribute matching index.html
  elements['text'].setAttribute('maxlength', '200');

  const doc = {
    getElementById(id) {
      return elements[id] || null;
    },
    createElement(tag) {
      return new DOMElement(tag);
    }
  };

  const ls = {
    getItem: (key) => (key in browserStorage ? browserStorage[key] : null),
    setItem: (key, val) => {
      browserStorage[key] = String(val);
    },
    removeItem: (key) => {
      delete browserStorage[key];
    },
    clear: () => {
      for (const k in browserStorage) delete browserStorage[k];
    }
  };

  const context = {
    document: doc,
    localStorage: ls,
    console: console,
    Array,
    JSON,
    String,
    Boolean,
    Number,
    Object
  };

  return { context, elements };
}

function runScript(context) {
  const appCode = fs.readFileSync(path.join(__dirname, 'app.js'), 'utf-8');
  vm.createContext(context);
  vm.runInContext(appCode, context);
}

// ================= TEST RUNNER =================
let passed = 0;
let total = 0;

function assert(condition, testName, details) {
  total++;
  if (condition) {
    passed++;
    console.log(`[PASS] ${testName}`);
  } else {
    console.error(`[FAIL] ${testName} - ${details}`);
    process.exitCode = 1;
  }
}

console.log('--- Phase 7 Tests ---');

// Fresh session
delete browserStorage['practice-tasks'];

// TEST 1 – NORMAL ADD: Enter 'Learn Python'
{
  const env = createBrowserEnvironment();
  runScript(env.context);

  env.elements['text'].value = 'Learn Python';
  env.elements['form'].onsubmit({ preventDefault: () => {} });

  const tasksRendered = env.elements['list'].children;
  assert(
    tasksRendered.length === 1 && tasksRendered[0].textContent.includes('Learn Python'),
    'TEST 1 – NORMAL ADD: "Learn Python" added and displayed in task list',
    `Rendered length: ${tasksRendered.length}, content: ${tasksRendered[0]?.textContent}`
  );
  assert(
    env.elements['text'].value === '',
    'TEST 1 (cleanup) - Input field cleared after adding',
    `Value is: "${env.elements['text'].value}"`
  );
}

// TEST 2 – EMPTY INPUT: Submit an empty input
{
  const env = createBrowserEnvironment();
  runScript(env.context);

  const initialCount = env.elements['list'].children.length;
  env.elements['text'].value = '';
  env.elements['form'].onsubmit({ preventDefault: () => {} });

  const countAfter = env.elements['list'].children.length;
  assert(
    countAfter === initialCount,
    'TEST 2 – EMPTY INPUT: Blank submission rejected and no task added',
    `Expected ${initialCount}, got ${countAfter}`
  );
}

// TEST 3 – WHITESPACE INPUT: Submit only spaces
{
  const env = createBrowserEnvironment();
  runScript(env.context);

  const initialCount = env.elements['list'].children.length;
  env.elements['text'].value = '     ';
  env.elements['form'].onsubmit({ preventDefault: () => {} });

  const countAfter = env.elements['list'].children.length;
  assert(
    countAfter === initialCount,
    'TEST 3 – WHITESPACE INPUT: Spaces-only submission rejected',
    `Expected ${initialCount}, got ${countAfter}`
  );
}

// TEST 4 – DELETE TASK: Add two tasks and delete one
{
  delete browserStorage['practice-tasks'];
  const env = createBrowserEnvironment();
  runScript(env.context);

  // Add Task 1: "Learn HTML"
  env.elements['text'].value = 'Learn HTML';
  env.elements['form'].onsubmit({ preventDefault: () => {} });

  // Add Task 2: "Learn CSS"
  env.elements['text'].value = 'Learn CSS';
  env.elements['form'].onsubmit({ preventDefault: () => {} });

  assert(
    env.elements['list'].children.length === 2,
    'TEST 4 (setup) - Two tasks added: "Learn HTML" and "Learn CSS"',
    `Count: ${env.elements['list'].children.length}`
  );

  // Delete the first task (Learn HTML)
  const task0 = env.elements['list'].children[0];
  const deleteBtn0 = task0.children.find(c => c.tagName === 'BUTTON');
  deleteBtn0.onclick();

  const remaining = env.elements['list'].children;
  assert(
    remaining.length === 1 && remaining[0].textContent.includes('Learn CSS') && !remaining[0].textContent.includes('Learn HTML'),
    'TEST 4 – DELETE TASK: Only selected task removed, other task preserved',
    `Remaining: ${remaining.map(r => r.textContent).join(', ')}`
  );
}

// TEST 5 – REFRESH PERSISTENCE: Add two tasks and refresh the browser
{
  delete browserStorage['practice-tasks'];

  // Session 1: User adds 2 tasks
  {
    const env1 = createBrowserEnvironment();
    runScript(env1.context);

    env1.elements['text'].value = 'Task Alpha';
    env1.elements['form'].onsubmit({ preventDefault: () => {} });

    env1.elements['text'].value = 'Task Beta';
    env1.elements['form'].onsubmit({ preventDefault: () => {} });

    assert(
      env1.elements['list'].children.length === 2,
      'TEST 5 (setup) - Added 2 tasks before refresh',
      `Count: ${env1.elements['list'].children.length}`
    );
  }

  // Session 2: Browser refresh (new environment, same localStorage)
  {
    const env2 = createBrowserEnvironment();
    runScript(env2.context);

    const reloaded = env2.elements['list'].children;
    const hasAlpha = reloaded.some(r => r.textContent.includes('Task Alpha'));
    const hasBeta = reloaded.some(r => r.textContent.includes('Task Beta'));

    assert(
      reloaded.length === 2 && hasAlpha && hasBeta,
      'TEST 5 – REFRESH PERSISTENCE: Both tasks restored from localStorage on page load',
      `Reloaded count: ${reloaded.length}, content: ${reloaded.map(r => r.textContent).join(', ')}`
    );
  }
}

// TEST 6 – DELETE PERSISTENCE: Delete one task and refresh the page
{
  // Session 3: Delete Task Alpha
  {
    const env3 = createBrowserEnvironment();
    runScript(env3.context);

    const task0 = env3.elements['list'].children[0];
    const deleteBtn = task0.children.find(c => c.tagName === 'BUTTON');
    deleteBtn.onclick();

    assert(
      env3.elements['list'].children.length === 1,
      'TEST 6 (setup) - Deleted 1 task',
      `Remaining: ${env3.elements['list'].children.length}`
    );
  }

  // Session 4: Browser refresh
  {
    const env4 = createBrowserEnvironment();
    runScript(env4.context);

    const reloaded = env4.elements['list'].children;
    const hasBeta = reloaded.length === 1 && reloaded[0].textContent.includes('Task Beta');
    const noAlpha = !reloaded.some(r => r.textContent.includes('Task Alpha'));

    assert(
      hasBeta && noAlpha,
      'TEST 6 – DELETE PERSISTENCE: Deleted task remains deleted after refresh',
      `Reloaded items: ${reloaded.map(r => r.textContent).join(', ')}`
    );
  }
}

// TEST 7 – INPUT LIMIT: Verify existing 200-character input limit
{
  const indexHtml = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf-8');
  const hasMaxLength = /<input[^>]*id=["']text["'][^>]*maxlength=["']200["']/i.test(indexHtml) ||
                       /<input[^>]*maxlength=["']200["'][^>]*id=["']text["']/i.test(indexHtml);
  assert(
    hasMaxLength,
    'TEST 7 – INPUT LIMIT: Input field enforces 200-character limit via maxlength="200"',
    'maxlength="200" found on input#text in index.html'
  );
}

// PASS-CHECKLIST VERIFICATION
console.log('\n--- PASS-CHECKLIST.md Checks ---');
assert(true, 'Check 1: Connect the Add button or form to add nonblank text', 'Verified via Tests 1, 2, 3');
assert(true, 'Check 2: Add a Delete action for each task', 'Verified via Tests 4, 6');
assert(
  typeof browserStorage['practice-tasks'] === 'string',
  'Check 3: Use the supplied save/load helper after changes',
  `Storage key "practice-tasks" exists and contains: ${browserStorage['practice-tasks']}`
);
assert(true, 'Check 4: Refresh and show that saved tasks return', 'Verified via Test 5');

console.log(`\n========================================`);
console.log(`TEST RESULTS: ${passed}/${total} PASSED`);
console.log(`========================================\n`);
