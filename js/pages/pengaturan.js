import { getEmployees, resetToDefault } from '../core/data.js';
import { formatRupiah, showToast } from '../utils/helpers.js';
import { exportToCSV, exportToJSON } from '../modules/export.js';
import { toggleTheme } from '../modules/theme.js';

export function renderPengaturan() {
  const employees = getEmployees();
  const totalGaji = employees.reduce((s, e) => s + e.gaji, 0);
  const totalTetap = employees.filter(e => e.status === 'Tetap').length;
  const uniqueDivisi = new Set(employees.map(e => e.divisi)).size;
  
  const html = `
    <div class="row-2col-equal animate-in">
      <div class="glass-card card-padding">
        <div class="section-title" style="margin-bottom:18px"><span class="dot"></span> Profil Perusahaan</div>
        ${[
          ['Nama Perusahaan', 'UD. Karya Muda Surya Utama'],
          ['Brand / Singkatan', 'KMSU'],
          ['Lokasi', 'Jawa Tengah, Indonesia'],
          ['Industri', 'Pengolahan Kayu Albasia (Falcataria)'],
          ['Produk Utama', 'Laminating Board (LB) & FLB'],
          ['Website', 'www.kmsu.co.id']
        ].map(([l, v]) => `
          <div style="margin-bottom:12px">
            <label style="display:block; font-size:0.61rem; font-weight:700; text-transform:uppercase; color:var(--tm); margin-bottom:5px">${l}</label>
            <input type="text" value="${v}" class="form-input" readonly style="cursor:default">
          </div>
        `).join('')}
        <button class="btn-primary" id="saveCompanyBtn" style="margin-top:4px"><i class="fas fa-floppy-disk"></i> Simpan</button>
      </div>
      <div style="display:flex; flex-direction:column; gap:16px">
        <div class="glass-card card-padding">
          <div class="section-title" style="margin-bottom:15px"><span class="dot" style="background:var(--ap)"></span> Data & Ekspor</div>
          <button class="btn-secondary" id="csvExportSetting" style="justify-content:flex-start; gap:11px; width:100%; margin-bottom:9px"><i class="fas fa-download" style="color:var(--as)"></i> Export Data CSV</button>
          <button class="btn-secondary" id="jsonExportSetting" style="justify-content:flex-start; gap:11px; width:100%; margin-bottom:9px"><i class="fas fa-code" style="color:var(--ac)"></i> Export Data JSON</button>
          <button class="btn-secondary" id="resetDataBtn" style="justify-content:flex-start; gap:11px; width:100%"><i class="fas fa-rotate-left" style="color:var(--ar)"></i> Reset ke Data Default</button>
        </div>
        <div class="glass-card card-padding">
          <div class="section-title" style="margin-bottom:15px"><span class="dot" style="background:var(--ag)"></span> Tampilan & Preferensi</div>
          <div style="display:flex; justify-content:space-between; align-items:center; background:var(--s3); border-radius:var(--radius-md); padding:11px; margin-bottom:10px">
            <div><div style="font-weight:500">Mode Tampilan</div><div style="font-size:0.67rem; color:var(--tm)">Gelap / Terang</div></div>
            <button class="btn-secondary" id="themeSettingBtn"><i class="fas fa-circle-half-stroke"></i> Toggle</button>
          </div>
          <div style="background:var(--s3); border-radius:var(--radius-md); padding:11px; margin-bottom:9px">
            <div style="font-size:0.6rem; text-transform:uppercase; color:var(--tm); margin-bottom:4px">Versi Sistem</div>
            <div style="font-family:'JetBrains Mono'; font-size:0.78rem; color:var(--ts)">KMSU HRIS v4.1 · <span style="color:var(--as)">● Aktif</span></div>
          </div>
          <div style="background:var(--s3); border-radius:var(--radius-md); padding:11px">
            <div style="font-size:0.6rem; text-transform:uppercase; color:var(--tm); margin-bottom:4px">Penyimpanan</div>
            <div style="font-size:0.78rem; color:var(--ts)"><i class="fas fa-database" style="color:var(--ac); margin-right:7px"></i>localStorage · Lokal Browser</div>
          </div>
        </div>
        <div class="glass-card card-padding">
          <div class="section-title" style="margin-bottom:15px"><span class="dot" style="background:var(--ac)"></span> Statistik Sistem</div>
          ${[
            ['Total Karyawan', employees.length, 'var(--ac)'],
            ['Karyawan Tetap', totalTetap, 'var(--as)'],
            ['Divisi', uniqueDivisi, 'var(--ap)'],
            ['Total Payroll', formatRupiah(totalGaji), 'var(--ag)']
          ].map(([l, v, c]) => `
            <div style="display:flex; justify-content:space-between; background:var(--s3); border-radius:var(--radius-md); padding:9px 11px; margin-bottom:7px">
              <span style="font-size:0.77rem; color:var(--ts)">${l}</span>
              <span style="font-size:0.8rem; font-weight:700; color:${c}">${v}</span>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
  
  document.getElementById('pageContainer').innerHTML = html;
  
  document.getElementById('csvExportSetting')?.addEventListener('click', exportToCSV);
  document.getElementById('jsonExportSetting')?.addEventListener('click', exportToJSON);
  document.getElementById('resetDataBtn')?.addEventListener('click', () => {
    if (confirm('Reset semua data ke default? Data yang tersimpan akan hilang.')) {
      resetToDefault();
      showToast('Data berhasil direset ke default', 'info');
      // reload current page to reflect changes
      import('../modules/navigation.js').then(nav => nav.renderCurrentPage());
    }
  });
  document.getElementById('themeSettingBtn')?.addEventListener('click', toggleTheme);
  document.getElementById('saveCompanyBtn')?.addEventListener('click', () => showToast('Perubahan perusahaan disimpan (simulasi)', 'success'));
}