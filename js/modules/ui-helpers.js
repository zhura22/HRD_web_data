import { getState, setState } from '../core/state.js';
import { renderCurrentPage } from './navigation.js';

export function initGlobalSearch() {
  const searchInput = document.getElementById('globalSearch');
  if (!searchInput) return;
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    setState({ searchQuery: query, karyawanPage: 1 });
    // Only re-render if we are on karyawan page (or make all pages search-aware)
    const { currentPage } = getState();
    if (currentPage === 'karyawan') {
      renderCurrentPage();
    }
  });
}

export function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('open');
}

export function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.add('open');
}

// Attach modal close listeners to all [data-close]
export function initModalClosers() {
  document.querySelectorAll('[data-close]').forEach(btn => {
    btn.addEventListener('click', () => {
      const modalId = btn.getAttribute('data-close');
      closeModal(modalId);
    });
  });
  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('open');
    });
  });
}