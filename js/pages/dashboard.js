import { getEmployees } from '../core/data.js';
import { formatRupiah, showToast } from '../utils/helpers.js';
import { createChart, destroyCharts } from '../utils/charts.js';
import { exportToCSV } from '../modules/export.js';

export function renderDashboard() {
  const employees = getEmployees();
  const total = employees.length;
  const tetap = employees.filter(e => e.status === 'Tetap').length;
  const kontrak = total - tetap;
  const totalGaji = employees.reduce((sum, e) => sum + e.gaji, 0);
  const avgKehadiran = total ? Math.round(employees.reduce((s, e) => s + (e.absensi || 0), 0) / total) : 0;
  const avgPerforma = total ? Math.round(employees.reduce((s, e) => s + (e.performance || 0), 0) / total) : 0;

  const divisiMap = {};
  employees.forEach(e => divisiMap[e.divisi] = (divisiMap[e.divisi] || 0) + 1);
  const topDivisi = Object.entries(divisiMap).sort((a, b) => b[1] - a[1])[0] || ['-', 0];

  const recent = [...employees].reverse().slice(0, 5);
  const activities = [
    { color: 'var(--ac)', text: 'Data Budi Santoso diperbarui', time: '2 jam lalu' },
    { color: 'var(--as)', text: 'Karyawan baru: Wahyu Prasetyo bergabung', time: '1 hari lalu' },
    { color: 'var(--ag)', text: 'Gaji Linda Sari direvisi +Rp 200rb', time: '2 hari lalu' },
    { color: 'var(--ap)', text: 'Laporan penggajian Mei digenerate', time: '3 hari lalu' },
    { color: 'var(--ar)', text: 'Kontrak Faisal Abdullah diperpanjang', time: '5 hari lalu' }
  ];
  const alerts = [
    { icon: 'fa-clock', color: 'var(--ag)', bg: 'rgba(240,192,64,0.1)', title: 'Kontrak Hampir Berakhir', desc: 'Rizky Pratama — sisa 15 hari' },
    { icon: 'fa-birthday-cake', color: 'var(--ap)', bg: 'rgba(167,139,250,0.1)', title: 'Ulang Tahun Bulan Ini', desc: 'Ratna Wijayanti — 19 Mei' },
    { icon: 'fa-file-alt', color: 'var(--ac)', bg: 'rgba(0,200,255,0.1)', title: 'Dokumen Review Menunggu', desc: '3 dokumen perlu approval' }
  ];

  const html = `
    <div class="animate-in">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; flex-wrap:wrap; gap:12px">
        <div>
          <div style="font-family:'Sora',sans-serif; font-size:1.35rem; font-weight:800; color:var(--tp)">Selamat Datang, Administrator 👋</div>
          <div style="font-size:0.78rem; color:var(--tm); margin-top:3px">${new Date().toLocaleDateString('id-ID', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}</div>
        </div>
        <div style="display:flex; gap:9px">
          <button class="btn-secondary" id="exportCsvDashboard"><i class="fas fa-download"></i> Export CSV</button>
          <button class="btn-primary" id="quickAddBtn"><i class="fas fa-user-plus"></i> Tambah Karyawan</button>
        </div>
      </div>

      <div class="kpi-grid">
        <div class="glass-card kpi-card" style="--kc:#00c8f0; --kg:linear-gradient(90deg,#00c8f0,#00e8c0)">
          <div class="kpi-label">Total Karyawan</div>
          <div class="kpi-value" id="kpiTotal">0</div>
          <div class="kpi-trend up"><i class="fas fa-arrow-trend-up"></i> +2 bulan ini</div>
          <div class="kpi-icon" style="background:rgba(0,200,255,0.1);color:var(--ac)"><i class="fas fa-users"></i></div>
        </div>
        <div class="glass-card kpi-card" style="--kc:#00e8c0; --kg:linear-gradient(90deg,#00e8c0,#00c8f0)">
          <div class="kpi-label">Karyawan Tetap</div>
          <div class="kpi-value" id="kpiTetap">0</div>
          <div class="kpi-trend up"><i class="fas fa-check-circle"></i> ${total ? Math.round(tetap/total*100) : 0}% dari total</div>
          <div class="kpi-icon" style="background:rgba(0,232,192,0.1);color:var(--as)"><i class="fas fa-user-check"></i></div>
        </div>
        <div class="glass-card kpi-card" style="--kc:#a78bfa; --kg:linear-gradient(90deg,#a78bfa,#64b4ff)">
          <div class="kpi-label">Total Gaji / Bulan</div>
          <div class="kpi-value" id="kpiGaji" style="font-size:1.1rem">Rp 0</div>
          <div class="kpi-trend up"><i class="fas fa-sack-dollar"></i> Budget SDM aktif</div>
          <div class="kpi-icon" style="background:rgba(167,139,250,0.1);color:var(--ap)"><i class="fas fa-money-bill-wave"></i></div>
        </div>
        <div class="glass-card kpi-card" style="--kc:#f0c040; --kg:linear-gradient(90deg,#f0c040,#ff9d4a)">
          <div class="kpi-label">Avg. Kehadiran</div>
          <div class="kpi-value" id="kpiKehadiran">0%</div>
          <div class="kpi-trend ${avgKehadiran>=90 ? 'up' : 'nt'}"><i class="fas fa-calendar-check"></i> ${avgKehadiran>=90 ? 'Sangat Baik' : 'Perlu Monitoring'}</div>
          <div class="kpi-icon" style="background:rgba(240,192,64,0.1);color:var(--ag)"><i class="fas fa-percent"></i></div>
        </div>
      </div>

      <div class="row-2col" style="margin-bottom:18px">
        <div class="glass-card card-padding">
          <div class="section-header"><div class="section-title"><span class="dot"></span> Distribusi Divisi</div><span style="font-size:0.68rem;color:var(--tm)">${Object.keys(divisiMap).length} divisi aktif</span></div>
          <div style="position:relative; height:200px"><canvas id="divisiChart"></canvas></div>
        </div>
        <div class="glass-card card-padding">
          <div class="section-header"><div class="section-title"><span class="dot" style="background:var(--as)"></span> Tren Headcount</div></div>
          <div style="position:relative; height:120px"><canvas id="trendChart"></canvas></div>
          <div style="margin-top:14px; display:grid; grid-template-columns:1fr 1fr; gap:9px">
            <div style="padding:9px; background:var(--s3); border-radius:var(--radius-md); border:1px solid var(--b2)">
              <div style="font-size:0.6rem; color:var(--tm); text-transform:uppercase">Performa Avg</div>
              <div style="font-size:0.85rem; font-weight:700; color:var(--as)">${avgPerforma}%</div>
            </div>
            <div style="padding:9px; background:var(--s3); border-radius:var(--radius-md); border:1px solid var(--b2)">
              <div style="font-size:0.6rem; color:var(--tm); text-transform:uppercase">Divisi Terbesar</div>
              <div style="font-size:0.85rem; font-weight:700; color:${getDivisiColor(topDivisi[0])}">${topDivisi[0]}</div>
            </div>
            <div style="padding:9px; background:var(--s3); border-radius:var(--radius-md); border:1px solid var(--b2)">
              <div style="font-size:0.6rem; color:var(--tm); text-transform:uppercase">Kontrak</div>
              <div style="font-size:0.85rem; font-weight:700; color:var(--ag)">${kontrak} org</div>
            </div>
            <div style="padding:9px; background:var(--s3); border-radius:var(--radius-md); border:1px solid var(--b2)">
              <div style="font-size:0.6rem; color:var(--tm); text-transform:uppercase">Gaji Avg</div>
              <div style="font-size:0.85rem; font-weight:700; color:var(--ac)">${formatRupiah(total ? Math.round(totalGaji/total) : 0)}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="row-2col-equal">
        <div class="glass-card card-padding">
          <div class="section-header"><div class="section-title"><span class="dot" style="background:var(--ag)"></span> Notifikasi & Alert</div></div>
          ${alerts.map(a => `
            <div class="alert-item">
              <div class="alert-icon" style="background:${a.bg}; color:${a.color}"><i class="fas ${a.icon}"></i></div>
              <div><div class="alert-title">${a.title}</div><div class="alert-desc">${a.desc}</div></div>
            </div>
          `).join('')}
        </div>
        <div style="display:flex; flex-direction:column; gap:18px">
          <div class="glass-card card-padding">
            <div class="section-header"><div class="section-title"><span class="dot" style="background:var(--ap)"></span> Karyawan Terbaru</div>
              <button class="btn-secondary" style="font-size:0.7rem; padding:5px 11px" id="gotoKaryawanBtn">Semua</button>
            </div>
            ${recent.map(e => `
              <div class="insight-row" style="cursor:pointer" data-id="${e.id}">
                <div style="display:flex; align-items:center; gap:10px">
                  <div class="avatar" style="width:32px; height:32px; background:${getAvatarColor(e.nama)}; border-radius:var(--radius-sm); display:flex; align-items:center; justify-content:center; color:#fff; font-weight:700">${e.nama.charAt(0)}</div>
                  <div><div style="font-weight:600; font-size:0.8rem">${e.nama}</div><div style="font-size:0.66rem; color:var(--tm)">${e.divisi}</div></div>
                </div>
                <span class="badge ${e.status==='Tetap' ? 'badge-success' : 'badge-warning'}">${e.status}</span>
              </div>
            `).join('')}
          </div>
          <div class="glass-card card-padding">
            <div class="section-header"><div class="section-title"><span class="dot" style="background:var(--ac)"></span> Aktivitas</div></div>
            ${activities.map(a => `
              <div class="activity-item"><div class="activity-dot" style="background:${a.color}"></div><div><div class="activity-text">${a.text}</div><div class="activity-time">${a.time}</div></div></div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;

  document.getElementById('pageContainer').innerHTML = html;

  // Animate numbers
  animateNumber('kpiTotal', total);
  animateNumber('kpiTetap', tetap);
  animateNumber('kpiGaji', totalGaji, true);
  animateNumber('kpiKehadiran', avgKehadiran, false, '%');

  // Setup charts
  destroyCharts();
  const divisiLabels = Object.keys(divisiMap);
  const divisiData = Object.values(divisiMap);
  const divisiColors = divisiLabels.map(l => getDivisiColor(l));
  createChart('divisiChart', 'bar', divisiLabels, divisiData, {
    dataset: { data: divisiData, backgroundColor: divisiColors.map(c => c + '28'), borderColor: divisiColors, borderWidth: 2, borderRadius: 8 }
  });

  const trendLabels = ['Des', 'Jan', 'Feb', 'Mar', 'Apr', 'Mei'];
  const trendData = [total-5, total-4, total-3, total-2, total-1, total];
  createChart('trendChart', 'line', trendLabels, trendData, {
    dataset: { data: trendData, borderColor: '#00c8f0', backgroundColor: 'rgba(0,200,255,0.06)', fill: true, tension: 0.4, pointBackgroundColor: '#00c8f0', pointRadius: 4 }
  });

  // Event listeners
  document.getElementById('exportCsvDashboard')?.addEventListener('click', exportToCSV);
  document.getElementById('quickAddBtn')?.addEventListener('click', () => import('../modules/forms.js').then(m => m.openEmployeeModal()));
  document.getElementById('gotoKaryawanBtn')?.addEventListener('click', () => import('../modules/navigation.js').then(n => n.navigateTo('karyawan')));
  document.querySelectorAll('[data-id]').forEach(el => {
    el.addEventListener('click', (e) => {
      const id = parseInt(el.dataset.id);
      import('../modules/forms.js').then(m => m.openEmployeeModal(getEmployees().find(emp => emp.id === id)));
    });
  });
}

function animateNumber(elId, target, isCurrency = false, suffix = '') {
  const el = document.getElementById(elId);
  if (!el) return;
  let current = 0;
  const step = Math.ceil(target / 60);
  const interval = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(interval);
    }
    let display = isCurrency ? formatRupiah(Math.floor(current)) : Math.floor(current);
    el.textContent = isCurrency ? display : display + suffix;
  }, 16);
}

function getDivisiColor(divisi) {
  const colors = { Produksi: '#00c8f0', HRD: '#a78bfa', Keuangan: '#f0c040', Gudang: '#64b4ff', QC: '#ff9d4a', Marketing: '#ff6b8a', IT: '#00e8c0', Administrasi: '#94a3b8', Direksi: '#ffd700' };
  return colors[divisi] || '#7a9ab8';
}

function getAvatarColor(name) {
  const colors = ['#00a0cc', '#00a882', '#c07800', '#8050d0', '#cc3060', '#0068b8', '#d05c20', '#007070'];
  let sum = 0;
  for (let i = 0; i < name.length; i++) sum += name.charCodeAt(i);
  return colors[sum % colors.length];
}