import { getEmployees } from '../core/data.js';
import { showToast } from '../utils/helpers.js';
import { createChart, destroyCharts } from '../utils/charts.js';

export function renderAbsensi() {
  const employees = getEmployees();
  const hariKerja = 22;
  const data = employees.map(e => {
    const hadir = Math.round(hariKerja * (e.absensi / 100));
    const sakit = Math.floor(Math.random() * 2);
    const izin = Math.floor(Math.random() * 2);
    const alpha = Math.max(0, hariKerja - hadir - sakit - izin);
    return { ...e, hadir, sakit, izin, alpha };
  });
  const totalHadir = data.reduce((s, e) => s + e.hadir, 0);
  const totalSakit = data.reduce((s, e) => s + e.sakit, 0);
  const totalIzin = data.reduce((s, e) => s + e.izin, 0);
  const totalAlpha = data.reduce((s, e) => s + e.alpha, 0);
  const avgHadir = Math.round(totalHadir / employees.length);
  const bulan = new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
  
  const html = `
    <div class="animate-in">
      <div style="display:flex; justify-content:space-between; margin-bottom:18px">
        <div style="font-size:0.8rem; color:var(--tm)">Periode: <strong>${bulan}</strong> · Hari Kerja: ${hariKerja} hari</div>
        <button class="btn-secondary" id="exportAbsensiBtn"><i class="fas fa-download"></i> Export Rekap</button>
      </div>
      <div class="kpi-grid" style="margin-bottom:20px">
        ${[
          { label: 'Total Hadir', value: totalHadir, color: 'var(--as)', icon: 'calendar-check' },
          { label: 'Sakit', value: totalSakit, color: 'var(--ab)', icon: 'kit-medical' },
          { label: 'Izin', value: totalIzin, color: 'var(--ag)', icon: 'envelope-open-text' },
          { label: 'Alpha', value: totalAlpha, color: 'var(--ar)', icon: 'triangle-exclamation' }
        ].map(k => `
          <div class="glass-card kpi-card" style="--kc:${k.color}">
            <div class="kpi-label">${k.label}</div>
            <div class="kpi-value" style="color:${k.color}">${k.value}</div>
            <div class="kpi-trend up"><i class="fas fa-${k.icon}"></i> ${k.label === 'Total Hadir' ? `Avg ${avgHadir} hari/org` : 'hari kumulatif'}</div>
            <div class="kpi-icon" style="background:${k.color}18; color:${k.color}"><i class="fas fa-${k.icon}"></i></div>
          </div>
        `).join('')}
      </div>
      <div class="row-2col">
        <div class="glass-card card-padding">
          <div class="section-header"><div class="section-title"><span class="dot"></span> Rekap Absensi per Karyawan</div></div>
          <div class="table-wrapper">
            <table class="data-table">
              <thead><tr><th>Karyawan</th><th>Divisi</th><th>Hadir</th><th>Sakit</th><th>Izin</th><th>Alpha</th><th>Rate</th><th>Status</th></tr></thead>
              <tbody>
                ${data.map(e => `
                  <tr>
                    <td><div style="display:flex; align-items:center; gap:9px"><div class="avatar" style="width:30px; height:30px; background:${getAvatarColor(e.nama)}; border-radius:var(--radius-sm); display:flex; align-items:center; justify-content:center; color:#fff">${e.nama.charAt(0)}</div><span style="font-weight:600">${e.nama}</span></div></td>
                    <td><span style="background:${getDivisiColor(e.divisi)}18; color:${getDivisiColor(e.divisi)}; padding:2px 7px; border-radius:20px; font-size:0.61rem; font-weight:700">${e.divisi}</span></td>
                    <td style="color:var(--as); font-weight:700">${e.hadir}</td>
                    <td style="color:var(--ab)">${e.sakit}</td>
                    <td style="color:var(--ag)">${e.izin}</td>
                    <td style="color:${e.alpha > 0 ? 'var(--ar)' : 'var(--tm)'}">${e.alpha}</td>
                    <td><div class="progress-bar" style="width:52px"><div class="progress-fill" style="width:${e.absensi}%; background:${e.absensi>=95 ? 'var(--as)' : e.absensi>=85 ? 'var(--ac)' : 'var(--ar)'}"></div></div> ${e.absensi}%</td>
                    <td><span class="badge ${e.alpha > 0 ? 'badge-danger' : (e.absensi>=95 ? 'badge-success' : 'badge-info')}">${e.alpha > 0 ? 'Perhatian' : (e.absensi>=95 ? 'Sangat Baik' : 'Baik')}</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
        <div class="glass-card card-padding">
          <div class="section-header"><div class="section-title"><span class="dot" style="background:var(--as)"></span> Komposisi Kehadiran</div></div>
          <div style="height:220px"><canvas id="absensiDoughnut"></canvas></div>
          <div style="margin-top:14px">
            ${[
              ['Hadir', totalHadir, '#00e8c0'],
              ['Sakit', totalSakit, '#64b4ff'],
              ['Izin', totalIzin, '#f0c040'],
              ['Alpha', totalAlpha, '#ff6b8a']
            ].map(([l, v, c]) => `
              <div style="display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid var(--b2)">
                <div><div style="width:8px; height:8px; border-radius:2px; background:${c}; display:inline-block; margin-right:7px"></div><span>${l}</span></div>
                <span style="font-family:'JetBrains Mono'; font-weight:700; color:${c}">${v}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
  
  document.getElementById('pageContainer').innerHTML = html;
  destroyCharts();
  createChart('absensiDoughnut', 'doughnut', ['Hadir', 'Sakit', 'Izin', 'Alpha'], [totalHadir, totalSakit, totalIzin, totalAlpha], {
    dataset: { backgroundColor: ['rgba(0,232,192,0.22)', 'rgba(100,180,255,0.22)', 'rgba(240,192,64,0.22)', 'rgba(255,107,138,0.22)'], borderColor: ['#00e8c0', '#64b4ff', '#f0c040', '#ff6b8a'], borderWidth: 2 },
    options: { cutout: '60%', plugins: { legend: { display: false } } }
  });
  document.getElementById('exportAbsensiBtn')?.addEventListener('click', () => exportAbsensiCSV(data));
}

function exportAbsensiCSV(data) {
  const headers = ['Nama', 'Divisi', 'Hadir', 'Sakit', 'Izin', 'Alpha', 'Rate %'];
  const rows = data.map(e => [e.nama, e.divisi, e.hadir, e.sakit, e.izin, e.alpha, e.absensi]);
  const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Rekap_Absensi.csv';
  a.click();
  URL.revokeObjectURL(url);
  showToast('Export rekap absensi berhasil', 'success');
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

