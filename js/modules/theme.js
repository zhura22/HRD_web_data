export function toggleTheme() {
  document.body.classList.toggle('light');
  const isLight = document.body.classList.contains('light');
  localStorage.setItem('kmsu_theme', isLight ? 'light' : 'dark');
  showToast(isLight ? 'Mode terang aktif' : 'Mode gelap aktif', 'info');
}

export function initTheme() {
  const savedTheme = localStorage.getItem('kmsu_theme');
  if (savedTheme === 'light') {
    document.body.classList.add('light');
  }
  document.getElementById('themeToggle')?.addEventListener('click', toggleTheme);
}

// Small helper (toast will be imported dynamically, but for now define simple)
function showToast(msg, type) {
  import('../utils/helpers.js').then(({ showToast }) => showToast(msg, type));
}