import { getEmployees } from '../core/data.js';
import { tenure, showToast } from '../utils/helpers.js';

export function renderPerforma() {
  const employees = getEmployees();
  const sorted = [...employees].sort((a, b) => (b.performance || 0) - (a.performance || 0));
  const top3 = sorted.slice(0, 3);
  const avgPerforma = Math.round(employees.reduce((s, e) => s + (e.performance || 0), 0) / employees.length);
  const excellent = employees.filter(e => (e.performance || 0) >= 90).length;
  const perluBinaan = employees.filter(e => (e.performance || 0) < 75).length;
  const bulan = new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
  
  const html = `
    <div class="animate-in">
      <div style="display:flex; justify-content:space-between; margin-bottom:18px">
        <div style="font-size:0.8rem; color:var(--tm)">Periode Review: <strong>${bulan}</strong></div>
        <button class="btn-secondary" id="exportPerformaBtn"><i class="fas fa-download"></i> Export Laporan</button>
      </div>
      <div class="row-2col-equal" style="margin-bottom:18px">
        ${[
          { label: 'Avg. Performa', value: `${avgPerforma}%`, color: 'var(--ac)', icon: 'chart-line' },
          { label: 'Karyawan Excellent (≥90%)', value: excellent, color: 'var(--as)', icon: 'star' },
          { label: 'Perlu Pembinaan (<75%)', value: perluBinaan, color: 'var(--ar)', icon: 'triangle-exclamation' },
          { label: 'Total Dievaluasi', value: employees.length, color: 'var(--ap)', icon: 'users' }
        ].map(k => `
          <div class="glass-card" style="padding:18px; background:${k.color}07">
            <div style="display:flex; justify-content:space-between; margin-bottom:10px">
              <div style="font-size:0.62rem; font-weight:700; text-transform:uppercase">${k.label}</div>
              <div style="width:30px; height:30px; background:${k.color}18; border-radius:var(--radius-sm); display:flex; align-items:center; justify-content:center; color:${k.color}"><i class="fas fa-${k.icon}"></i></div>
            </div>
            <div style="font-family:'Sora',sans-serif; font-size:1.6rem; font-weight:800; color:${k.color}">${k.value}</div>
          </div>
        `).join('')}
      </div>
      
      <div style="margin-bottom:18px">
        <div class="section-header"><div class="section-title"><span class="dot" style="background:var(--ag)"></span> Top Performer</div></div>
        <div class="row-3col" style="gap:14px">
          ${top3.map((e, i) => {
            const medals = ['🥇', '🥈', '🥉'];
            const medalColors = ['var(--ag)', '#b0b8c0', '#cd7f32'];
            return `
              <div class="glass-card card-padding" style="text-align:center; position:relative">
                <div style="position:absolute; top:0; left:0; right:0; height:3px; background:${medalColors[i]}; opacity:0.7"></div>
                <div style="font-size:1.8rem">${medals[i]}</div>
                <div class="avatar" style="width:50px; height:50px; font-size:1.1rem; background:${getAvatarColor(e.nama)}; border-radius:var(--radius-lg); margin:0 auto 10px; display:flex; align-items:center; justify-content:center; color:#fff">${e.nama.charAt(0)}</div>
                <div style="font-weight:700">${e.nama}</div>
                <div style="font-size:0.7rem; color:var(--tm)">${e.jabatan} · ${e.divisi}</div>
                <div style="font-family:'Sora',sans-serif; font-size:1.5rem; font-weight:800; color:${medalColors[i]}">${e.performance}%</div>
                <div class="progress-bar" style="margin-top:8px"><div class="progress-fill" style="width:${e.performance}%; background:${medalColors[i]}"></div></div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
      
      <div class="glass-card">
        <div class="card-padding" style="border-bottom:1px solid var(--b2)">
          <div class="section-title"><span class="dot"></span> Evaluasi Seluruh Karyawan</div>
        </div>
        <div class="table-wrapper">
          <table class="data-table">
            <thead><tr><th style="padding-left:18px">Rank</th><th>Karyawan</th><th>Divisi</th><th>Skor Performa</th><th>Rate Kehadiran</th><th>Masa Kerja</th><th>Status KPI</th></thead>
            <tbody>
              ${sorted.map((e, i) => {
                const perf = e.performance || 0;
                const color = perf >= 90 ? 'var(--as)' : perf >= 80 ? 'var(--ac)' : perf >= 70 ? 'var(--ag)' : 'var(--ar)';
                const label = perf >= 90 ? 'Excellent' : perf >= 80 ? 'Baik' : perf >= 70 ? 'Cukup' : 'Perlu Pembinaan';
                const badgeClass = perf >= 90 ? 'badge-success' : perf >= 80 ? 'badge-info' : perf >= 70 ? 'badge-warning' : 'badge-danger';
                return `
                  <tr>
                    <td style="padding-left:18px; font-family:'Sora'; font-weight:800; color:${i<3 ? 'var(--ag)' : 'var(--tm)'}">${i+1}</td>
                    <td><div style="display:flex; align-items:center; gap:10px"><div class="avatar" style="width:34px; height:34px; background:${getAvatarColor(e.nama)}; border-radius:var(--radius-sm); display:flex; align-items:center; justify-content:center; color:#fff">${e.nama.charAt(0)}</div><div><div style="font-weight:600">${e.nama}</div><div style="font-size:0.65rem">${e.jabatan}</div></div></div></td>
                    <td><span style="background:${getDivisiColor(e.divisi)}18; color:${getDivisiColor(e.divisi)}; padding:3px 8px; border-radius:20px; font-size:0.62rem; font-weight:700">${e.divisi}</span></td>
                    <td><div style="display:flex; align-items:center; gap:8px"><div class="progress-bar" style="width:80px"><div class="progress-fill" style="width:${perf}%; background:${color}"></div></div><span style="font-weight:700; color:${color}">${perf}%</span></div></td>
                    <td><div class="progress-bar" style="width:52px"><div class="progress-fill" style="width:${e.absensi}%; background:var(--ac)"></div></div> ${e.absensi}%</td>
                    <td>${tenure(e.joinDate)}</td>
                    <td><span class="badge ${badgeClass}">${label}</span></td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
  
  document.getElementById('pageContainer').innerHTML = html;
  document.getElementById('exportPerformaBtn')?.addEventListener('click', () => exportPerformaCSV(sorted));
}

function exportPerformaCSV(employees) {
  const headers = ['Rank', 'Nama', 'Jabatan', 'Divisi', 'Skor Performa', 'Kehadiran', 'Masa Kerja (thn)'];
  const rows = employees.map((e, i) => [i+1, e.nama, e.jabatan, e.divisi, e.performance, e.absensi, tenure(e.joinDate).replace(' th', '')]);
  const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Performa_Karyawan.csv';
  a.click();
  URL.revokeObjectURL(url);
  showToast('Export laporan performa berhasil', 'success');
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

function showToast(msg, type) {
  import('../utils/helpers.js').then(({ showToast }) => showToast(msg, type));
}