import { getState, setState } from '../core/state.js';
import { renderDashboard } from '../pages/dashboard.js';
import { renderKaryawan } from '../pages/karyawan.js';
import { renderStatistik } from '../pages/statistik.js';
import { renderPenggajian } from '../pages/penggajian.js';
import { renderAbsensi } from '../pages/absensi.js';
import { renderPerforma } from '../pages/performa.js';
import { renderDokumen } from '../pages/dokumen.js';
import { renderPengaturan } from '../pages/pengaturan.js';

const pageRenderers = {
  dashboard: renderDashboard,
  karyawan: renderKaryawan,
  statistik: renderStatistik,
  penggajian: renderPenggajian,
  absensi: renderAbsensi,
  performa: renderPerforma,
  dokumen: renderDokumen,
  pengaturan: renderPengaturan
};

export function navigateTo(page) {
  if (!pageRenderers[page]) return;
  setState({ currentPage: page, karyawanPage: 1, searchQuery: '' });
  updateActiveNav(page);
  renderCurrentPage();
}

function updateActiveNav(page) {
  document.querySelectorAll('.nav-item').forEach(item => {
    if (item.dataset.page === page) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
  const titles = {
    dashboard: 'Dashboard Eksekutif',
    karyawan: 'Data Karyawan',
    statistik: 'Statistik & Analitik',
    penggajian: 'Laporan Penggajian',
    absensi: 'Rekap Absensi',
    performa: 'Review Performa',
    dokumen: 'Dokumen HR',
    pengaturan: 'Pengaturan Sistem'
  };
  const subtitles = {
    dashboard: 'UD. Karya Muda Surya Utama · Jawa Tengah',
    karyawan: 'Manajemen data seluruh karyawan aktif',
    statistik: 'Visualisasi & analitik data SDM',
    penggajian: 'Perhitungan gaji & tunjangan periode aktif',
    absensi: 'Rekap kehadiran karyawan bulanan',
    performa: 'Evaluasi kinerja & KPI karyawan',
    dokumen: 'Manajemen dokumen & template HR',
    pengaturan: 'Konfigurasi sistem & perusahaan'
  };
  document.getElementById('pageTitle').textContent = titles[page] || page;
  document.getElementById('pageSubtitle').textContent = subtitles[page] || '';
}

export function renderCurrentPage() {
  const { currentPage } = getState();
  const renderFn = pageRenderers[currentPage];
  if (renderFn) renderFn();
}

export function initNavigation() {
  const navLinks = document.querySelectorAll('.nav-item');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault(); // Mencegah aksi default
      e.stopPropagation(); // Mencegah bubbling
      const page = link.dataset.page;
      if (page) navigateTo(page);
    });
  });
  renderCurrentPage();
}