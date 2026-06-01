import { showToast } from '../utils/helpers.js';

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
