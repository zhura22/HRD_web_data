import { getEmployees } from '../core/data.js';
import { formatRupiah, showToast, showSlipModal } from '../utils/helpers.js';
import { exportToCSV } from '../modules/export.js';

export function renderPenggajian() {
  const employees = getEmployees();
  const totalGaji = employees.reduce((s, e) => s + e.gaji, 0);
  const rows = employees.map(e => {
    const tunjangan = Math.round(e.gaji * 0.15);
    const bpjsKes = Math.round(e.gaji * 0.01);
    const bpjsTk = Math.round(e.gaji * 0.02);
    const thp = e.gaji + tunjangan - bpjsKes - bpjsTk;
    return { ...e, tunjangan, bpjsKes, bpjsTk, thp };
  });
  const totalTHP = rows.reduce((s, r) => s + r.thp, 0);
  const totalTunjangan = rows.reduce((s, r) => s + r.tunjangan, 0);
  const totalPotongan = rows.reduce((s, r) => s + r.bpjsKes + r.bpjsTk, 0);
  const bulan = new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
  
  const html = `
    <div class="animate-in">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:18px">
        <div style="font-size:0.8rem; color:var(--tm)">Periode: <strong style="color:var(--tp)">${bulan}</strong></div>
        <button class="btn-secondary" id="exportPayrollBtn"><i class="fas fa-download"></i> Export CSV</button>
      </div>
      <div class="kpi-grid" style="margin-bottom:20px">
        ${[
          { label: 'Total Gaji Bruto', value: totalGaji, color: 'var(--ac)' },
          { label: 'Total Tunjangan (15%)', value: totalTunjangan, color: 'var(--as)' },
          { label: 'Total Potongan (BPJS)', value: totalPotongan, color: 'var(--ar)' },
          { label: 'Total Take Home Pay', value: totalTHP, color: 'var(--ap)' }
        ].map(k => `
          <div class="glass-card kpi-card" style="--kc:${k.color}">
            <div class="kpi-label">${k.label}</div>
            <div class="kpi-value" style="font-size:1rem">${formatRupiah(k.value)}</div>
            <div class="kpi-icon" style="background:${k.color}18; color:${k.color}"><i class="fas fa-money-bill-wave"></i></div>
          </div>
        `).join('')}
      </div>
      <div class="glass-card">
        <div class="card-padding" style="border-bottom:1px solid var(--b2)">
          <div class="section-header">
            <div class="section-title"><span class="dot" style="background:var(--ap)"></span> Tabel Penggajian · ${bulan}</div>
            <span style="font-size:0.67rem; color:var(--tm)">Pokok + Tunjangan 15% − BPJS Kes 1% − BPJS TK 2%</span>
          </div>
        </div>
        <div class="table-wrapper">
          <table class="data-table">
            <thead><tr><th style="padding-left:18px">#</th><th>Karyawan</th><th>Divisi</th><th>Gaji Pokok</th><th style="color:var(--as)">+Tunjangan</th><th style="color:var(--ar)">−BPJS Kes</th><th style="color:var(--ar)">−BPJS TK</th><th>Take Home Pay</th><th>Slip</th></tr></thead>
            <tbody>
              ${rows.map((r, i) => `
                <tr>
                  <td style="padding-left:18px">${i+1}</td>
                  <td><div style="display:flex; align-items:center; gap:9px"><div class="avatar" style="width:32px; height:32px; background:${getAvatarColor(r.nama)}; border-radius:var(--radius-sm); display:flex; align-items:center; justify-content:center; color:#fff">${r.nama.charAt(0)}</div><div><div style="font-weight:600">${r.nama}</div><span class="badge ${r.status==='Tetap'?'badge-success':'badge-warning'}" style="font-size:0.57rem">${r.status}</span></div></div></td>
                  <td><span style="background:${getDivisiColor(r.divisi)}18; color:${getDivisiColor(r.divisi)}; padding:2px 8px; border-radius:20px; font-size:0.61rem; font-weight:700">${r.divisi}</span></td>
                  <td style="font-family:'JetBrains Mono', monospace">${formatRupiah(r.gaji)}</td>
                  <td style="color:var(--as)">+${formatRupiah(r.tunjangan)}</td>
                  <td style="color:var(--ar)">-${formatRupiah(r.bpjsKes)}</td>
                  <td style="color:var(--ar)">-${formatRupiah(r.bpjsTk)}</td>
                  <td style="font-weight:700; color:var(--ac)">${formatRupiah(r.thp)}</td>
                  <td><button class="action-btn" data-slip="${r.id}"><i class="fas fa-file-invoice"></i></button></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        <div style="padding:14px 18px; border-top:1px solid var(--b2); display:flex; justify-content:flex-end">
          <div style="background:var(--s3); border-radius:var(--radius-md); padding:10px 18px; text-align:right">
            <div style="font-size:0.6rem; text-transform:uppercase; color:var(--tm)">Total Take Home Pay</div>
            <div style="font-family:'Sora',sans-serif; font-size:1.25rem; font-weight:800; color:var(--ac)">${formatRupiah(totalTHP)}</div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  document.getElementById('pageContainer').innerHTML = html;
  document.getElementById('exportPayrollBtn')?.addEventListener('click', () => exportToCSV());
  document.querySelectorAll('[data-slip]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.slip);
      const emp = getEmployees().find(e => e.id === id);
      if (emp) showSlipModal(emp);
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