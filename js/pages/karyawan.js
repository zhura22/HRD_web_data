import { getEmployees, deleteEmployee } from '../core/data.js';
import { getState, setState } from '../core/state.js';
import { formatRupiah, tenure, ageFromBirth, showToast, showEmployeeDetail } from '../utils/helpers.js';
import { exportToCSV, exportToJSON } from '../modules/export.js';
import { openEmployeeModal } from '../modules/forms.js';

export function renderKaryawan() {
  const employees = getEmployees();
  const { filterDivisi, filterStatus, karyawanPage, itemsPerPage, searchQuery } = getState();
  
  let filtered = employees.filter(emp => {
    const matchSearch = !searchQuery || 
      [emp.nama, emp.nik, emp.jabatan, emp.divisi].some(field => field?.toLowerCase().includes(searchQuery));
    const matchDivisi = filterDivisi === 'Semua' || emp.divisi === filterDivisi;
    const matchStatus = filterStatus === 'Semua' || emp.status === filterStatus;
    return matchSearch && matchDivisi && matchStatus;
  });
  
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const start = (karyawanPage - 1) * itemsPerPage;
  const paginated = filtered.slice(start, start + itemsPerPage);
  const totalGajiFiltered = filtered.reduce((s, e) => s + e.gaji, 0);
  
  const divisiOptions = ['Semua', ...new Set(employees.map(e => e.divisi))];
  
  const html = `
    <div class="glass-card animate-in">
      <div class="card-padding" style="border-bottom:1px solid var(--b2)">
        <div class="section-header">
          <div class="section-title"><span class="dot"></span> Daftar Karyawan <span style="color:var(--tm); font-weight:400">(${filtered.length})</span></div>
          <div style="display:flex; gap:8px">
            <button class="btn-secondary" id="csvKaryawan"><i class="fas fa-file-csv"></i> CSV</button>
            <button class="btn-secondary" id="jsonKaryawan"><i class="fas fa-code"></i> JSON</button>
            <button class="btn-primary" id="addKaryawanBtn"><i class="fas fa-plus"></i> Tambah</button>
          </div>
        </div>
        <div class="filter-bar">
          <select class="filter-select" id="filterDivisiSelect">
            ${divisiOptions.map(d => `<option value="${d}" ${filterDivisi === d ? 'selected' : ''}>${d === 'Semua' ? 'Semua Divisi' : d}</option>`).join('')}
          </select>
          <select class="filter-select" id="filterStatusSelect">
            <option value="Semua" ${filterStatus === 'Semua' ? 'selected' : ''}>Semua Status</option>
            <option value="Tetap" ${filterStatus === 'Tetap' ? 'selected' : ''}>Tetap</option>
            <option value="Kontrak" ${filterStatus === 'Kontrak' ? 'selected' : ''}>Kontrak</option>
          </select>
          <span style="font-size:0.71rem; color:var(--tm)">Total payroll terpilih: <strong style="color:var(--ac)">${formatRupiah(totalGajiFiltered)}</strong></span>
        </div>
      </div>
      <div class="table-wrapper">
        <table class="data-table">
          <thead><tr><th style="padding-left:18px">Karyawan</th><th>NIK</th><th>Jabatan</th><th>Divisi</th><th>Status</th><th>Gaji Pokok</th><th>Masa Kerja</th><th>Usia</th><th>Performa</th><th>Aksi</th></tr></thead>
          <tbody>
            ${paginated.length === 0 ? `<tr><td colspan="10"><div class="empty-state"><i class="fas fa-magnifying-glass"></i><p>Tidak ada karyawan ditemukan</p></div></td></tr>` : ''}
            ${paginated.map(emp => `
              <tr>
                <td style="padding-left:18px"><div style="display:flex; align-items:center; gap:10px"><div class="avatar" style="width:34px; height:34px; background:${getAvatarColor(emp.nama)}; border-radius:var(--radius-sm); display:flex; align-items:center; justify-content:center; color:#fff; font-weight:700">${emp.nama.charAt(0)}</div><div><div style="font-weight:600">${emp.nama}</div><div style="font-size:0.65rem; color:var(--tm)">${emp.gender === 'L' ? '♂ Laki-laki' : '♀ Perempuan'}</div></div></div></td>
                <td style="font-family:'JetBrains Mono', monospace; font-size:0.72rem">${emp.nik}</td>
                <td>${emp.jabatan}</td>
                <td><span style="background:${getDivisiColor(emp.divisi)}18; color:${getDivisiColor(emp.divisi)}; padding:3px 9px; border-radius:20px; font-size:0.62rem; font-weight:700">${emp.divisi}</span></td>
                <td><span class="badge ${emp.status === 'Tetap' ? 'badge-success' : 'badge-warning'}">${emp.status}</span></td>
                <td style="font-weight:600; font-family:'JetBrains Mono', monospace; color:var(--ac)">${formatRupiah(emp.gaji)}</td>
                <td>${tenure(emp.joinDate)}</td>
                <td>${ageFromBirth(emp.birthDate)}</td>
                <td><div style="display:flex; align-items:center; gap:6px"><div class="progress-bar" style="width:52px"><div class="progress-fill" style="width:${emp.performance}%; background:${emp.performance>=85 ? 'var(--as)' : emp.performance>=70 ? 'var(--ag)' : 'var(--ar)'}"></div></div><span style="font-size:0.68rem; font-weight:700">${emp.performance}%</span></div></td>
                <td><button class="action-btn" data-view="${emp.id}"><i class="fas fa-eye"></i></button><button class="action-btn" data-edit="${emp.id}"><i class="fas fa-pen"></i></button><button class="action-btn danger" data-delete="${emp.id}"><i class="fas fa-trash"></i></button></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      <div class="pagination">
        <span>Menampilkan ${filtered.length === 0 ? 0 : start+1}–${Math.min(start+itemsPerPage, filtered.length)} dari ${filtered.length} karyawan</span>
        <div class="pagination-buttons">
          <button class="page-btn" data-page="prev" ${karyawanPage <= 1 ? 'disabled' : ''}><i class="fas fa-chevron-left"></i></button>
          ${Array.from({ length: totalPages }, (_, i) => `<button class="page-btn ${karyawanPage === i+1 ? 'active' : ''}" data-page="${i+1}">${i+1}</button>`).join('')}
          <button class="page-btn" data-page="next" ${karyawanPage >= totalPages ? 'disabled' : ''}><i class="fas fa-chevron-right"></i></button>
        </div>
      </div>
    </div>
  `;
  
  document.getElementById('pageContainer').innerHTML = html;
  
  // Event listeners
  document.getElementById('csvKaryawan')?.addEventListener('click', exportToCSV);
  document.getElementById('jsonKaryawan')?.addEventListener('click', exportToJSON);
  document.getElementById('addKaryawanBtn')?.addEventListener('click', () => openEmployeeModal());
  document.getElementById('filterDivisiSelect')?.addEventListener('change', (e) => { setState({ filterDivisi: e.target.value, karyawanPage: 1 }); renderKaryawan(); });
  document.getElementById('filterStatusSelect')?.addEventListener('change', (e) => { setState({ filterStatus: e.target.value, karyawanPage: 1 }); renderKaryawan(); });
  
  document.querySelectorAll('[data-page]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      let newPage = btn.dataset.page;
      if (newPage === 'prev') newPage = karyawanPage - 1;
      if (newPage === 'next') newPage = karyawanPage + 1;
      newPage = parseInt(newPage);
      if (!isNaN(newPage) && newPage >= 1 && newPage <= totalPages) {
        setState({ karyawanPage: newPage });
        renderKaryawan();
      }
    });
  });
  
  document.querySelectorAll('[data-view]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.view);
      const emp = getEmployees().find(e => e.id === id);
      if (emp) showEmployeeDetail(emp);
    });
  });
  document.querySelectorAll('[data-edit]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.edit);
      const emp = getEmployees().find(e => e.id === id);
      if (emp) openEmployeeModal(emp);
    });
  });
  document.querySelectorAll('[data-delete]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = parseInt(btn.dataset.delete);
      const emp = getEmployees().find(e => e.id === id);
      if (emp && confirm(`Hapus karyawan "${emp.nama}"?`)) {
        deleteEmployee(id);
        showToast(`${emp.nama} dihapus`, 'error');
        renderKaryawan();
      }
    });
  });
}

function getAvatarColor(name) {
  const colors = ['#00a0cc', '#00a882', '#c07800', '#8050d0', '#cc3060', '#0068b8', '#d05c20', '#007070'];
  let sum = 0;
  for (let i = 0; i < name.length; i++) sum += name.charCodeAt(i);
  return colors[sum % colors.length];
}

function getDivisiColor(divisi) {
  const colors = { Produksi: '#00c8f0', HRD: '#a78bfa', Keuangan: '#f0c040', Gudang: '#64b4ff', QC: '#ff9d4a', Marketing: '#ff6b8a', IT: '#00e8c0', Administrasi: '#94a3b8', Direksi: '#ffd700' };
  return colors[divisi] || '#7a9ab8';
}