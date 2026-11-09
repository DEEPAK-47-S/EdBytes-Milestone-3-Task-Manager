const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function run() {
  const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'edge-cdp-'));
  const port = 9333;

  const evidenceDir = path.join(__dirname, 'evidence');
  if (!fs.existsSync(evidenceDir)) {
    fs.mkdirSync(evidenceDir, { recursive: true });
  }

  console.log('Launching headless Edge on port', port);
  const browserProc = spawn(edgePath, [
    `--headless=new`,
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${tempDir}`,
    `--disable-gpu`,
    `--no-first-run`,
    `--no-default-browser-check`
  ], { stdio: 'ignore' });

  try {
    let versionData = null;
    for (let i = 0; i < 20; i++) {
      try {
        const res = await fetch(`http://127.0.0.1:${port}/json/version`);
        if (res.ok) {
          versionData = await res.json();
          break;
        }
      } catch (e) {
        await sleep(300);
      }
    }

    if (!versionData || !versionData.webSocketDebuggerUrl) {
      throw new Error('Failed to connect to Edge CDP endpoint');
    }

    console.log('Connected to Edge CDP.');

    const targetRes = await fetch(`http://127.0.0.1:${port}/json/new?file:///C:/Users/skdee/Downloads/task-fsd-02-beginner-20261028/index.html`, { method: 'PUT' });
    const targetData = await targetRes.json();

    const ws = new WebSocket(targetData.webSocketDebuggerUrl);
    let msgId = 1;
    const callbacks = new Map();

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.id && callbacks.has(data.id)) {
        const cb = callbacks.get(data.id);
        callbacks.delete(data.id);
        cb(data);
      }
    };

    await new Promise(r => ws.onopen = r);

    function sendCommand(method, params = {}) {
      return new Promise((resolve) => {
        const id = msgId++;
        callbacks.set(id, (res) => resolve(res.result));
        ws.send(JSON.stringify({ id, method, params }));
      });
    }

    await sendCommand('Page.enable');
    await sendCommand('DOM.enable');

    await sleep(800);

    console.log('Adding practice tasks into the UI (including Learn Python)...');
    await sendCommand('Runtime.evaluate', {
      expression: `
        (() => {
          const input = document.getElementById('text');
          const form = document.getElementById('form');

          function addTask(name) {
            input.value = name;
            form.dispatchEvent(new Event('submit', { cancelable: true }));
          }

          addTask('Learn Python');
          addTask('Learn JavaScript');
          addTask('Complete Portfolio');
        })()
      `
    });

    await sleep(400);

    // 1. Desktop Screenshot (1280 x 800)
    console.log('Taking Desktop screenshot...');
    await sendCommand('Emulation.setDeviceMetricsOverride', {
      width: 1280,
      height: 800,
      deviceScaleFactor: 1,
      mobile: false
    });
    await sleep(300);

    const shot1 = await sendCommand('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(evidenceDir, 'desktop.png'), Buffer.from(shot1.data, 'base64'));
    console.log('Saved evidence/desktop.png');

    // 2. Mobile Screenshot (375 x 750)
    console.log('Taking Mobile screenshot...');
    await sendCommand('Emulation.setDeviceMetricsOverride', {
      width: 375,
      height: 750,
      deviceScaleFactor: 2,
      mobile: true
    });
    await sleep(300);

    const shot2 = await sendCommand('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(evidenceDir, 'mobile.png'), Buffer.from(shot2.data, 'base64'));
    console.log('Saved evidence/mobile.png');

    // 3. Test Refresh Persistence
    console.log('Reloading page to test browser refresh persistence...');
    await sendCommand('Page.reload');
    await sleep(600);

    const checkTasks = await sendCommand('Runtime.evaluate', {
      expression: `
        (() => {
          const items = Array.from(document.querySelectorAll('#list li .task-text')).map(el => el.textContent);
          return { count: items.length, items };
        })()
      `,
      returnByValue: true
    });
    console.log('Tasks returned after refresh:', checkTasks.result.value);

    const shot3 = await sendCommand('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(evidenceDir, 'refreshed.png'), Buffer.from(shot3.data, 'base64'));
    console.log('Saved evidence/refreshed.png');

    // 4. Test Deleting one task
    console.log('Deleting second task (Learn JavaScript)...');
    await sendCommand('Runtime.evaluate', {
      expression: `
        (() => {
          const deleteButtons = document.querySelectorAll('#list li .btn-delete');
          if (deleteButtons.length > 1) {
            deleteButtons[1].click();
          }
        })()
      `
    });
    await sleep(300);

    const afterDelete = await sendCommand('Runtime.evaluate', {
      expression: `
        (() => {
          const items = Array.from(document.querySelectorAll('#list li .task-text')).map(el => el.textContent);
          return { count: items.length, items };
        })()
      `,
      returnByValue: true
    });
    console.log('Tasks after deletion:', afterDelete.result.value);

    const shot4 = await sendCommand('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(evidenceDir, 'after-delete.png'), Buffer.from(shot4.data, 'base64'));
    console.log('Saved evidence/after-delete.png');

    ws.close();
    console.log('\nAll in-browser UI operations and screenshots completed successfully!');
  } finally {
    browserProc.kill();
    try {
      fs.rmSync(tempDir, { recursive: true, force: true });
    } catch {}
  }
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
