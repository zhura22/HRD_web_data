import { initState } from './core/state.js';
import { loadInitialData } from './core/data.js';
import { initNavigation } from './modules/navigation.js';
import { initTheme } from './modules/theme.js';
import { initGlobalSearch, initModalClosers } from './modules/ui-helpers.js';
import { initFormHandler, openEmployeeModal } from './modules/forms.js';
import { showToast } from './utils/helpers.js';

async function initApp() {
  try {
    loadInitialData();
    initState();
    initNavigation();
    initTheme();
    initGlobalSearch();
    initFormHandler();
    initModalClosers();

    document.getElementById('notifBtn')?.addEventListener('click', () => showToast('Tidak ada notifikasi baru', 'info'));
    document.getElementById('addEmployeeBtn')?.addEventListener('click', openEmployeeModal);

    const menuBtn = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('mobileOverlay');
    if (menuBtn) {
      menuBtn.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        overlay.classList.toggle('show');
      });
    }
    overlay?.addEventListener('click', () => {
      sidebar.classList.remove('open');
      overlay.classList.remove('show');
    });

    console.log('✅ KMSU HRIS initialized');
  } catch (error) {
    console.error('Initialization failed:', error);
    showToast('Gagal memuat sistem', 'error');
  }
}

initApp();