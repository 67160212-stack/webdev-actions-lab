// ปุ่ม Say Hello: สลับข้อความไปมา
const status = document.querySelector('#status');
const helloBtn = document.querySelector('#helloBtn');
const messages = ['Hello from GitHub Pages!', 'สวัสดีจาก GitHub Actions 👋', 'Ready to deploy'];
let i = 0;

helloBtn.addEventListener('click', () => {
  status.textContent = messages[i % messages.length];
  i++;
});

// ปุ่ม Toggle Theme: สลับ Light/Dark และจำค่าไว้ใน localStorage
const themeBtn = document.querySelector('#themeBtn');

function applyTheme(theme) {
  document.body.classList.toggle('dark', theme === 'dark');
  themeBtn.textContent = theme === 'dark' ? '☀️ Light' : '🌙 Dark';
}

let saved = 'light';
try { saved = localStorage.getItem('theme') || 'light'; } catch (e) {}
applyTheme(saved);

themeBtn.addEventListener('click', () => {
  const next = document.body.classList.contains('dark') ? 'light' : 'dark';
  applyTheme(next);
  try { localStorage.setItem('theme', next); } catch (e) {}
});
