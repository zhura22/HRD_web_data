/* KMSU HRIS — Bundle v5 */



/* ── js/utils/helpers.js ── */
// ========== FORMATTING ==========
function formatRupiah(number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
}

function formatDate(dateStr) {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
}

function tenure(joinDate) {
  if (!joinDate) return '-';
  const ms = Date.now() - new Date(joinDate);
  const years = Math.floor(ms / (365.25 * 86400000));
  const months = Math.floor((ms % (365.25 * 86400000)) / (30.44 * 86400000));
  return years > 0 ? `${years} th ${months} bl` : `${months} bulan`;
}

function ageFromBirth(birthDate) {
  if (!birthDate) return '-';
  const age = Math.floor((Date.now() - new Date(birthDate)) / (365.25 * 86400000));
  return `${age} th`;
}

// ========== TOAST ==========
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const icons = { success: 'circle-check', error: 'circle-xmark', info: 'circle-info', warning: 'triangle-exclamation' };
  const colors = { success: '#00e8c0', error: '#ff6b8a', info: '#00c8f0', warning: '#f0c040' };
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<i class="fas fa-${icons[type]}" style="color:${colors[type]}"></i> ${message}`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(20px)';
    setTimeout(() => toast.remove(), 200);
  }, 3000);
}

// ========== COLOR HELPERS ==========
function getAvatarColor(name) {
  const colors = ['#00a0cc', '#00a882', '#c07800', '#8050d0', '#cc3060', '#0068b8', '#d05c20', '#007070'];
  let sum = 0;
  for (let i = 0; i < name.length; i++) sum += name.charCodeAt(i);
  return colors[sum % colors.length];
}

function getDivisiColor(divisi) {
  const colors = {
    "Bahan Baku": "#f0a040",
    "Sawmill"   : "#a0522d",
    "Oven"      : "#ff7043",
    "Produksi"  : "#00c8f0",
    "Press"     : "#cd5c5c",
    "Sezing"    : "#20b2aa",
    "Pengawas"  : "#e07b39",
    "Satpam"    : "#5c7cfa",
    "Staff"     : "#a78bfa"
  };
  return colors[divisi] || '#7a9ab8';
}

// ========== DETAIL & SLIP MODAL ==========
async function showEmployeeDetail(emp) {
  const tj = Math.round(emp.gaji * 0.15);
  const thp = emp.gaji + tj - Math.round(emp.gaji * 0.03);
  const modal = document.getElementById('detailModal');
  const content = document.getElementById('detailContent');
  if (!modal || !content) return;
  content.innerHTML = `
    <div class="modal-header"><div class="modal-title">Detail Karyawan</div><i class="fas fa-times modal-close" data-close="detailModal"></i></div>
    <div style="display:flex; align-items:center; gap:14px; padding:14px; background:var(--s3); border-radius:var(--rad-lg); margin-bottom:16px">
      <div class="avatar" style="width:54px; height:54px; background:${getAvatarColor(emp.nama)}; border-radius:var(--rad); display:flex; align-items:center; justify-content:center; font-size:1.2rem; color:#fff">${emp.nama.charAt(0)}</div>
      <div><div style="font-family:'Sora',sans-serif; font-size:1.05rem; font-weight:700">${emp.nama}</div><div>${emp.jabatan} · <span style="color:${getDivisiColor(emp.divisi)}">${emp.divisi}</span></div><div><span class="badge ${emp.status==='Tetap'?'badge-success':'badge-warning'}">${emp.status}</span><span style="margin-left:8px; font-size:0.62rem">${emp.gender==='L'?'♂ Laki-laki':'♀ Perempuan'}</span></div></div>
    </div>
    <div class="detail-grid">
      <div class="detail-field"><div class="detail-label">NIK</div><div class="detail-value">${emp.nik}</div></div>
      <div class="detail-field"><div class="detail-label">Tanggal Lahir</div><div class="detail-value">${formatDate(emp.birthDate)} (${ageFromBirth(emp.birthDate)})</div></div>
      <div class="detail-field"><div class="detail-label">Bergabung</div><div class="detail-value">${formatDate(emp.joinDate)}</div></div>
      <div class="detail-field"><div class="detail-label">Masa Kerja</div><div class="detail-value">${tenure(emp.joinDate)}</div></div>
      <div class="detail-field"><div class="detail-label">Telepon</div><div class="detail-value">${emp.phone || '-'}</div></div>
      <div class="detail-field"><div class="detail-label">Email</div><div class="detail-value">${emp.email || '-'}</div></div>
      <div class="detail-field"><div class="detail-label">Gaji Pokok</div><div class="detail-value" style="color:var(--ac)">${formatRupiah(emp.gaji)}</div></div>
      <div class="detail-field"><div class="detail-label">Take Home Pay</div><div class="detail-value" style="color:var(--as)">${formatRupiah(thp)}</div></div>
    </div>
    <div class="modal-footer">
      <button class="btn-secondary" data-close="detailModal">Tutup</button>
      <button class="btn-primary" id="editFromDetail">Edit</button>
    </div>
  `;
  modal.classList.add('open');
  document.getElementById('editFromDetail')?.addEventListener('click', () => {
    modal.classList.remove('open');
    openEmployeeModal(emp);
  });
  document.querySelectorAll('[data-close="detailModal"]').forEach(btn => {
    btn.addEventListener('click', () => modal.classList.remove('open'));
  });
}

async function showSlipModal(emp) {
  const tj = Math.round(emp.gaji * 0.15);
  const bk = Math.round(emp.gaji * 0.01);
  const btk = Math.round(emp.gaji * 0.02);
  const thp = emp.gaji + tj - bk - btk;
  const bulan = new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
  const modal = document.getElementById('slipModal');
  const content = document.getElementById('slipContent');
  if (!modal || !content) return;
  content.innerHTML = `
    <div class="modal-header"><div class="modal-title">Slip Gaji</div><i class="fas fa-times modal-close" data-close="slipModal"></i></div>
    <div style="padding:20px; background:var(--s3); border-radius:var(--rad-lg); border:1px solid var(--b1)">
      <div style="text-align:center; margin-bottom:16px">
        <div style="font-family:'Sora',sans-serif; font-size:0.6rem; font-weight:700; letter-spacing:3px; text-transform:uppercase">UD. Karya Muda Surya Utama</div>
        <div style="font-size:0.63rem; color:var(--tm)">Jawa Tengah, Indonesia</div>
        <div style="width:40px; height:2px; background:linear-gradient(90deg,var(--ac),var(--as)); margin:10px auto"></div>
        <div style="font-size:0.68rem; font-weight:600">SLIP GAJI · ${bulan.toUpperCase()}</div>
      </div>
      <div style="display:flex; align-items:center; gap:11px; padding:11px; background:var(--s2); border-radius:var(--rad); margin-bottom:14px">
        <div class="avatar" style="width:38px; height:38px; background:${getAvatarColor(emp.nama)}; border-radius:var(--rad-sm); display:flex; align-items:center; justify-content:center; color:#fff">${emp.nama.charAt(0)}</div>
        <div><div style="font-weight:700">${emp.nama}</div><div style="font-size:0.67rem; color:var(--tm)">${emp.nik} · ${emp.jabatan} · ${emp.divisi}</div></div>
      </div>
      <div class="slip-row"><span>Gaji Pokok</span><span>${formatRupiah(emp.gaji)}</span></div>
      <div class="slip-row"><span style="color:var(--as)">+ Tunjangan (15%)</span><span style="color:var(--as)">+${formatRupiah(tj)}</span></div>
      <div class="slip-divider"></div>
      <div class="slip-row"><span style="color:var(--ar)">− BPJS Kesehatan (1%)</span><span style="color:var(--ar)">-${formatRupiah(bk)}</span></div>
      <div class="slip-row"><span style="color:var(--ar)">− BPJS TK (2%)</span><span style="color:var(--ar)">-${formatRupiah(btk)}</span></div>
      <div class="slip-divider"></div>
      <div class="slip-row" style="padding:10px 0"><span style="font-weight:700">Take Home Pay</span><span style="font-family:'Sora',sans-serif; font-size:1.1rem; font-weight:800; color:var(--ac)">${formatRupiah(thp)}</span></div>
    </div>
    <button class="btn-secondary" data-close="slipModal" style="width:100%; margin-top:10px">Tutup</button>
  `;
  modal.classList.add('open');
  document.querySelectorAll('[data-close="slipModal"]').forEach(btn => {
    btn.addEventListener('click', () => modal.classList.remove('open'));
  });
}


/* ── js/utils/charts.js ── */
let activeCharts = [];

function createChart(canvasId, type, labels, data, customOptions = {}) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) {
    console.warn(`Canvas #${canvasId} not found`);
    return null;
  }
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  // Destructure recognized keys from customOptions
  const { dataset: datasetOverride, options: extraOptions, ...directOptions } = customOptions;

  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: type !== 'doughnut' && type !== 'pie' ? {
      x: { grid: { color: 'rgba(60,130,200,0.07)' }, ticks: { color: '#7a9ab8' } },
      y: { grid: { color: 'rgba(60,130,200,0.07)' }, ticks: { color: '#7a9ab8' } }
    } : {}
  };

  // Build merged options: defaults + direct top-level keys (e.g. indexAxis) + deep merge of extraOptions
  const mergedOptions = {
    ...defaultOptions,
    ...directOptions,
    plugins: {
      ...defaultOptions.plugins,
      ...(extraOptions?.plugins || {})
    },
    scales: {
      ...defaultOptions.scales,
      ...(extraOptions?.scales || {})
    }
  };

  // Apply remaining extraOptions top-level keys (e.g. cutout, animation)
  if (extraOptions) {
    Object.keys(extraOptions).forEach(k => {
      if (k !== 'plugins' && k !== 'scales') {
        mergedOptions[k] = extraOptions[k];
      }
    });
  }

  const dataset = datasetOverride || { data, backgroundColor: '#00c8f028', borderColor: '#00c8f0', borderWidth: 2 };
  if (!dataset.data) dataset.data = data;

  const chartConfig = {
    type,
    data: { labels, datasets: [dataset] },
    options: mergedOptions
  };

  try {
    const chart = new Chart(ctx, chartConfig);
    activeCharts.push(chart);
    return chart;
  } catch (err) {
    console.error(`Failed to create chart ${canvasId}:`, err);
    return null;
  }
}

function destroyCharts() {
  activeCharts.forEach(chart => {
    try { chart.destroy(); } catch(e) {}
  });
  activeCharts = [];
}


/* ── js/core/data.js ── */
const DEFAULT_EMPLOYEES = [
  {"id": 1, "nik": "198501230001", "nama": "Budi Santoso", "jabatan": "Kepala Produksi", "divisi": "Produksi", "status": "Tetap", "gender": "L", "gaji": 8500000, "birthDate": "1985-01-23", "joinDate": "2018-02-10", "phone": "081234000001", "email": "budi@kmsu.co.id", "performance": 88, "absensi": 94},
  {"id": 2, "nik": "199002150002", "nama": "Siti Aminah", "jabatan": "HRD Supervisor", "divisi": "Staff", "status": "Tetap", "gender": "P", "gaji": 7500000, "birthDate": "1990-02-15", "joinDate": "2020-06-15", "phone": "081234000002", "email": "siti@kmsu.co.id", "performance": 91, "absensi": 97},
  {"id": 3, "nik": "199503120003", "nama": "Rizky Pratama", "jabatan": "Operator Mesin I", "divisi": "Produksi", "status": "Kontrak", "gender": "L", "gaji": 3500000, "birthDate": "1995-03-12", "joinDate": "2023-01-20", "phone": "081234000003", "email": "rizky@kmsu.co.id", "performance": 76, "absensi": 88},
  {"id": 4, "nik": "198810050004", "nama": "Dewi Lestari", "jabatan": "Manajer Keuangan", "divisi": "Staff", "status": "Tetap", "gender": "P", "gaji": 12000000, "birthDate": "1988-10-05", "joinDate": "2015-09-01", "phone": "081234000004", "email": "dewi@kmsu.co.id", "performance": 94, "absensi": 98},
  {"id": 5, "nik": "199212200005", "nama": "Agus Wibowo", "jabatan": "Kepala Bahan Baku", "divisi": "Bahan Baku", "status": "Tetap", "gender": "L", "gaji": 6200000, "birthDate": "1992-12-20", "joinDate": "2019-11-11", "phone": "081234000005", "email": "agus@kmsu.co.id", "performance": 85, "absensi": 93},
  {"id": 6, "nik": "199707080006", "nama": "Hendra Kurniawan", "jabatan": "Pengawas QC", "divisi": "Pengawas", "status": "Tetap", "gender": "L", "gaji": 5200000, "birthDate": "1997-07-08", "joinDate": "2021-03-05", "phone": "081234000006", "email": "hendra@kmsu.co.id", "performance": 82, "absensi": 91},
  {"id": 7, "nik": "199305190007", "nama": "Ratna Wijayanti", "jabatan": "Staf Administrasi", "divisi": "Staff", "status": "Tetap", "gender": "P", "gaji": 3800000, "birthDate": "1993-05-19", "joinDate": "2022-08-01", "phone": "081234000007", "email": "ratna@kmsu.co.id", "performance": 87, "absensi": 95},
  {"id": 8, "nik": "200001150008", "nama": "Faisal Abdullah", "jabatan": "Operator Mesin II", "divisi": "Produksi", "status": "Kontrak", "gender": "L", "gaji": 3200000, "birthDate": "2000-01-15", "joinDate": "2024-01-15", "phone": "081234000008", "email": "faisal@kmsu.co.id", "performance": 72, "absensi": 86},
  {"id": 9, "nik": "199609240009", "nama": "Nur Hasanah", "jabatan": "Staf Akuntansi", "divisi": "Staff", "status": "Tetap", "gender": "P", "gaji": 4500000, "birthDate": "1996-09-24", "joinDate": "2021-07-01", "phone": "081234000009", "email": "nur@kmsu.co.id", "performance": 89, "absensi": 96},
  {"id": 10, "nik": "199811030010", "nama": "Dimas Setyawan", "jabatan": "Staf IT", "divisi": "Staff", "status": "Kontrak", "gender": "L", "gaji": 4500000, "birthDate": "1998-11-03", "joinDate": "2023-05-10", "phone": "081234000010", "email": "dimas@kmsu.co.id", "performance": 80, "absensi": 90},
  {"id": 11, "nik": "200103280011", "nama": "Wahyu Prasetyo", "jabatan": "Operator Mesin III", "divisi": "Produksi", "status": "Kontrak", "gender": "L", "gaji": 3200000, "birthDate": "2001-03-28", "joinDate": "2024-03-01", "phone": "081234000011", "email": "wahyu@kmsu.co.id", "performance": 70, "absensi": 84},
  {"id": 12, "nik": "199410120012", "nama": "Linda Sari", "jabatan": "Staf Marketing", "divisi": "Staff", "status": "Tetap", "gender": "P", "gaji": 4200000, "birthDate": "1994-10-12", "joinDate": "2022-04-15", "phone": "081234000012", "email": "linda@kmsu.co.id", "performance": 86, "absensi": 94},
  {"id": 13, "nik": "198205100013", "nama": "Suryanto Pratama", "jabatan": "Direktur Operasional", "divisi": "Staff", "status": "Tetap", "gender": "L", "gaji": 25000000, "birthDate": "1982-05-10", "joinDate": "2010-01-03", "phone": "081234000013", "email": "surya@kmsu.co.id", "performance": 96, "absensi": 99},
  {"id": 14, "nik": "KMSU0014", "nama": "Ahmad Nur Fauzi", "jabatan": "Operator Sawmill", "divisi": "Sawmill", "status": "Tetap", "gender": "L", "gaji": 3487535, "birthDate": "1983-01-24", "joinDate": "2020-04-08", "phone": "081228728463", "email": "ahmadnurfauzi@kmsu.co.id", "performance": 77, "absensi": 96},
  {"id": 15, "nik": "KMSU0015", "nama": "Asnawi", "jabatan": "Operator Sawmill", "divisi": "Sawmill", "status": "Tetap", "gender": "L", "gaji": 3379043, "birthDate": "1982-10-14", "joinDate": "2018-01-03", "phone": "081239345092", "email": "asnawi@kmsu.co.id", "performance": 81, "absensi": 94},
  {"id": 16, "nik": "KMSU0016", "nama": "Mardi", "jabatan": "Kepala Bagian Sawmill", "divisi": "Sawmill", "status": "Tetap", "gender": "L", "gaji": 5644388, "birthDate": "1980-09-07", "joinDate": "2023-11-23", "phone": "081283140807", "email": "mardi@kmsu.co.id", "performance": 87, "absensi": 89},
  {"id": 17, "nik": "KMSU0017", "nama": "Mutaqim", "jabatan": "Operator Sawmill", "divisi": "Sawmill", "status": "Kontrak", "gender": "L", "gaji": 2971029, "birthDate": "1998-05-26", "joinDate": "2024-01-25", "phone": "081231429110", "email": "mutaqim@kmsu.co.id", "performance": 87, "absensi": 91},
  {"id": 18, "nik": "KMSU0018", "nama": "Nur Arifin", "jabatan": "Operator Sawmill", "divisi": "Sawmill", "status": "Kontrak", "gender": "L", "gaji": 2791369, "birthDate": "1984-04-25", "joinDate": "2020-02-03", "phone": "081260992979", "email": "nurarifin@kmsu.co.id", "performance": 77, "absensi": 91},
  {"id": 19, "nik": "KMSU0019", "nama": "Nur Kholis", "jabatan": "Operator Sawmill", "divisi": "Sawmill", "status": "Kontrak", "gender": "L", "gaji": 2860663, "birthDate": "1999-05-26", "joinDate": "2018-12-15", "phone": "081281971316", "email": "nurkholis@kmsu.co.id", "performance": 77, "absensi": 92},
  {"id": 20, "nik": "KMSU0020", "nama": "Ahmad Arifin", "jabatan": "Pengawas Produksi", "divisi": "Pengawas", "status": "Tetap", "gender": "L", "gaji": 4270889, "birthDate": "1997-05-27", "joinDate": "2023-10-28", "phone": "081258537831", "email": "ahmadarifin@kmsu.co.id", "performance": 92, "absensi": 89},
  {"id": 21, "nik": "KMSU0021", "nama": "Budi Nurohmad", "jabatan": "Pengawas Produksi", "divisi": "Pengawas", "status": "Tetap", "gender": "L", "gaji": 4260226, "birthDate": "1981-11-08", "joinDate": "2024-05-03", "phone": "081241244663", "email": "budinurohmad@kmsu.co.id", "performance": 77, "absensi": 92},
  {"id": 22, "nik": "KMSU0022", "nama": "Dul Rohman", "jabatan": "Pengawas Produksi", "divisi": "Pengawas", "status": "Tetap", "gender": "L", "gaji": 4500623, "birthDate": "1994-11-27", "joinDate": "2020-03-12", "phone": "081257683626", "email": "dulrohman@kmsu.co.id", "performance": 80, "absensi": 96},
  {"id": 23, "nik": "KMSU0023", "nama": "Zuchron", "jabatan": "Mandor Produksi", "divisi": "Pengawas", "status": "Tetap", "gender": "L", "gaji": 4487940, "birthDate": "2000-02-20", "joinDate": "2023-03-18", "phone": "081242857966", "email": "zuchron@kmsu.co.id", "performance": 79, "absensi": 93},
  {"id": 24, "nik": "KMSU0024", "nama": "Agus Wigati", "jabatan": "Pengawas Lapangan", "divisi": "Pengawas", "status": "Tetap", "gender": "L", "gaji": 4617675, "birthDate": "1988-11-23", "joinDate": "2022-04-22", "phone": "081253524491", "email": "aguswigati@kmsu.co.id", "performance": 75, "absensi": 89},
  {"id": 25, "nik": "KMSU0025", "nama": "Darmadi", "jabatan": "Pengawas Lapangan", "divisi": "Pengawas", "status": "Tetap", "gender": "L", "gaji": 4217024, "birthDate": "1990-07-09", "joinDate": "2018-04-19", "phone": "081252235350", "email": "darmadi@kmsu.co.id", "performance": 80, "absensi": 96},
  {"id": 26, "nik": "KMSU0026", "nama": "Maryadin", "jabatan": "Pengawas Lapangan", "divisi": "Pengawas", "status": "Tetap", "gender": "L", "gaji": 4755829, "birthDate": "1992-11-15", "joinDate": "2019-05-05", "phone": "081243101783", "email": "maryadin@kmsu.co.id", "performance": 91, "absensi": 94},
  {"id": 27, "nik": "KMSU0027", "nama": "Rohmad Rifandani", "jabatan": "Mandor Lapangan", "divisi": "Pengawas", "status": "Tetap", "gender": "L", "gaji": 4483054, "birthDate": "1998-07-19", "joinDate": "2021-06-08", "phone": "081228566572", "email": "rohmadrifandani@kmsu.co.id", "performance": 90, "absensi": 93},
  {"id": 28, "nik": "KMSU0028", "nama": "Hartono", "jabatan": "Pengawas Shift", "divisi": "Pengawas", "status": "Tetap", "gender": "L", "gaji": 4284857, "birthDate": "1981-02-05", "joinDate": "2023-03-26", "phone": "081266661351", "email": "hartono@kmsu.co.id", "performance": 93, "absensi": 87},
  {"id": 29, "nik": "KMSU0029", "nama": "Nugroho", "jabatan": "Pengawas Shift", "divisi": "Pengawas", "status": "Tetap", "gender": "L", "gaji": 4623802, "birthDate": "1992-10-15", "joinDate": "2022-05-18", "phone": "081211540956", "email": "nugroho@kmsu.co.id", "performance": 77, "absensi": 96},
  {"id": 30, "nik": "KMSU0030", "nama": "Sigit Adi K", "jabatan": "Pengawas Shift", "divisi": "Pengawas", "status": "Tetap", "gender": "L", "gaji": 4799359, "birthDate": "1988-11-11", "joinDate": "2018-05-14", "phone": "081231227574", "email": "sigitadik@kmsu.co.id", "performance": 88, "absensi": 86},
  {"id": 31, "nik": "KMSU0031", "nama": "Supari", "jabatan": "Mandor Shift", "divisi": "Pengawas", "status": "Tetap", "gender": "L", "gaji": 4483801, "birthDate": "1996-03-17", "joinDate": "2018-11-10", "phone": "081295758349", "email": "supari@kmsu.co.id", "performance": 90, "absensi": 95},
  {"id": 32, "nik": "KMSU0032", "nama": "Adimas Purnama", "jabatan": "Operator Bahan Baku", "divisi": "Bahan Baku", "status": "Tetap", "gender": "L", "gaji": 3309430, "birthDate": "1984-06-25", "joinDate": "2019-09-25", "phone": "081281182864", "email": "adimaspurnama@kmsu.co.id", "performance": 74, "absensi": 95},
  {"id": 33, "nik": "KMSU0033", "nama": "Agus Saryadi", "jabatan": "Staf Bahan Baku", "divisi": "Bahan Baku", "status": "Tetap", "gender": "L", "gaji": 3453892, "birthDate": "1995-01-04", "joinDate": "2020-05-08", "phone": "081217774584", "email": "agussaryadi@kmsu.co.id", "performance": 81, "absensi": 95},
  {"id": 34, "nik": "KMSU0034", "nama": "Almuanang", "jabatan": "Operator Bahan Baku", "divisi": "Bahan Baku", "status": "Kontrak", "gender": "L", "gaji": 2796474, "birthDate": "1982-02-24", "joinDate": "2021-02-25", "phone": "081281498611", "email": "almuanang@kmsu.co.id", "performance": 78, "absensi": 88},
  {"id": 35, "nik": "KMSU0035", "nama": "Durrohman", "jabatan": "Operator Bahan Baku", "divisi": "Bahan Baku", "status": "Kontrak", "gender": "L", "gaji": 2645899, "birthDate": "1995-09-06", "joinDate": "2020-09-28", "phone": "081291415657", "email": "durrohman@kmsu.co.id", "performance": 87, "absensi": 89},
  {"id": 36, "nik": "KMSU0036", "nama": "Jumari", "jabatan": "Operator Bahan Baku", "divisi": "Bahan Baku", "status": "Tetap", "gender": "L", "gaji": 3835719, "birthDate": "1997-12-23", "joinDate": "2019-12-10", "phone": "081263551839", "email": "jumari@kmsu.co.id", "performance": 94, "absensi": 91},
  {"id": 37, "nik": "KMSU0037", "nama": "M Yayin", "jabatan": "Operator Bahan Baku", "divisi": "Bahan Baku", "status": "Kontrak", "gender": "L", "gaji": 2529690, "birthDate": "1996-08-04", "joinDate": "2019-04-03", "phone": "081255377076", "email": "myayin@kmsu.co.id", "performance": 74, "absensi": 95},
  {"id": 38, "nik": "KMSU0038", "nama": "Muhaimin", "jabatan": "Operator Bahan Baku", "divisi": "Bahan Baku", "status": "Kontrak", "gender": "L", "gaji": 2590414, "birthDate": "1987-10-08", "joinDate": "2018-02-23", "phone": "081294705205", "email": "muhaimin@kmsu.co.id", "performance": 75, "absensi": 89},
  {"id": 39, "nik": "KMSU0039", "nama": "Munir", "jabatan": "Operator Bahan Baku", "divisi": "Bahan Baku", "status": "Tetap", "gender": "L", "gaji": 3338870, "birthDate": "1981-06-03", "joinDate": "2022-04-09", "phone": "081299788677", "email": "munir@kmsu.co.id", "performance": 89, "absensi": 89},
  {"id": 40, "nik": "KMSU0040", "nama": "Nursalim", "jabatan": "Operator Bahan Baku", "divisi": "Bahan Baku", "status": "Tetap", "gender": "L", "gaji": 3610984, "birthDate": "1984-12-19", "joinDate": "2022-08-08", "phone": "081273481353", "email": "nursalim@kmsu.co.id", "performance": 87, "absensi": 89},
  {"id": 41, "nik": "KMSU0041", "nama": "Nurudin", "jabatan": "Operator Bahan Baku", "divisi": "Bahan Baku", "status": "Kontrak", "gender": "L", "gaji": 2349453, "birthDate": "1983-11-14", "joinDate": "2020-07-14", "phone": "081272682989", "email": "nurudin@kmsu.co.id", "performance": 75, "absensi": 96},
  {"id": 42, "nik": "KMSU0042", "nama": "Nuryanto", "jabatan": "Operator Bahan Baku", "divisi": "Bahan Baku", "status": "Kontrak", "gender": "L", "gaji": 2642598, "birthDate": "2000-02-02", "joinDate": "2021-12-11", "phone": "081224665841", "email": "nuryanto@kmsu.co.id", "performance": 81, "absensi": 89},
  {"id": 43, "nik": "KMSU0043", "nama": "Samidin", "jabatan": "Operator Bahan Baku", "divisi": "Bahan Baku", "status": "Tetap", "gender": "L", "gaji": 3409696, "birthDate": "1997-08-05", "joinDate": "2021-03-09", "phone": "081272092888", "email": "samidin@kmsu.co.id", "performance": 81, "absensi": 87},
  {"id": 44, "nik": "KMSU0044", "nama": "Santoso", "jabatan": "Operator Bahan Baku", "divisi": "Bahan Baku", "status": "Kontrak", "gender": "L", "gaji": 2532328, "birthDate": "1997-02-02", "joinDate": "2023-09-27", "phone": "081211980765", "email": "santoso@kmsu.co.id", "performance": 76, "absensi": 98},
  {"id": 45, "nik": "KMSU0045", "nama": "Suhadi", "jabatan": "Operator Bahan Baku", "divisi": "Bahan Baku", "status": "Tetap", "gender": "L", "gaji": 3352647, "birthDate": "1985-07-16", "joinDate": "2021-04-28", "phone": "081263826716", "email": "suhadi@kmsu.co.id", "performance": 75, "absensi": 88},
  {"id": 46, "nik": "KMSU0046", "nama": "Trimah", "jabatan": "Staf Bahan Baku", "divisi": "Bahan Baku", "status": "Tetap", "gender": "P", "gaji": 3517120, "birthDate": "1980-07-09", "joinDate": "2024-08-10", "phone": "081266775103", "email": "trimah@kmsu.co.id", "performance": 91, "absensi": 96},
  {"id": 47, "nik": "KMSU0047", "nama": "Muhamad Riki", "jabatan": "Operator Bahan Baku", "divisi": "Bahan Baku", "status": "Kontrak", "gender": "L", "gaji": 2576652, "birthDate": "1995-03-07", "joinDate": "2020-04-02", "phone": "081287736262", "email": "muhamadriki@kmsu.co.id", "performance": 91, "absensi": 86},
  {"id": 48, "nik": "KMSU0048", "nama": "Wahyu Rizal A", "jabatan": "Operator Bahan Baku", "divisi": "Bahan Baku", "status": "Kontrak", "gender": "L", "gaji": 2692154, "birthDate": "1990-01-02", "joinDate": "2022-08-17", "phone": "081281286543", "email": "wahyurizala@kmsu.co.id", "performance": 79, "absensi": 86},
  {"id": 49, "nik": "KMSU0049", "nama": "Edy S", "jabatan": "Staf Teknik Senior", "divisi": "Staff", "status": "Tetap", "gender": "L", "gaji": 4985745, "birthDate": "1982-03-03", "joinDate": "2022-02-22", "phone": "081241568532", "email": "edys@kmsu.co.id", "performance": 86, "absensi": 87},
  {"id": 50, "nik": "KMSU0050", "nama": "Henry WCS", "jabatan": "Staf Teknik", "divisi": "Staff", "status": "Tetap", "gender": "L", "gaji": 4177081, "birthDate": "1987-10-20", "joinDate": "2018-10-03", "phone": "081266267415", "email": "henrywcs@kmsu.co.id", "performance": 92, "absensi": 95},
  {"id": 51, "nik": "KMSU0051", "nama": "Heru S", "jabatan": "Staf Teknik", "divisi": "Staff", "status": "Tetap", "gender": "L", "gaji": 4122994, "birthDate": "1990-05-07", "joinDate": "2023-12-11", "phone": "081242035886", "email": "herus@kmsu.co.id", "performance": 82, "absensi": 92},
  {"id": 52, "nik": "KMSU0052", "nama": "Komarudin", "jabatan": "Staf Teknik", "divisi": "Staff", "status": "Tetap", "gender": "L", "gaji": 3670958, "birthDate": "2000-05-15", "joinDate": "2020-02-01", "phone": "081271510041", "email": "komarudin@kmsu.co.id", "performance": 93, "absensi": 95},
  {"id": 53, "nik": "KMSU0053", "nama": "M Andi Suryawan", "jabatan": "Staf Teknik Listrik", "divisi": "Staff", "status": "Tetap", "gender": "L", "gaji": 3635320, "birthDate": "1982-09-07", "joinDate": "2022-05-05", "phone": "081256843172", "email": "mandisuryawan@kmsu.co.id", "performance": 76, "absensi": 89},
  {"id": 54, "nik": "KMSU0054", "nama": "Sarno", "jabatan": "Staf Teknik", "divisi": "Staff", "status": "Kontrak", "gender": "L", "gaji": 3587477, "birthDate": "1989-03-15", "joinDate": "2024-09-23", "phone": "081250603163", "email": "sarno@kmsu.co.id", "performance": 93, "absensi": 98},
  {"id": 55, "nik": "KMSU0055", "nama": "Sihabudin", "jabatan": "Staf Teknik", "divisi": "Staff", "status": "Kontrak", "gender": "L", "gaji": 3885743, "birthDate": "1996-01-22", "joinDate": "2024-09-10", "phone": "081299038526", "email": "sihabudin@kmsu.co.id", "performance": 77, "absensi": 88},
  {"id": 56, "nik": "KMSU0056", "nama": "Sumantri", "jabatan": "Staf Teknik", "divisi": "Staff", "status": "Kontrak", "gender": "L", "gaji": 3477312, "birthDate": "1983-02-24", "joinDate": "2022-03-09", "phone": "081247816686", "email": "sumantri@kmsu.co.id", "performance": 93, "absensi": 89},
  {"id": 57, "nik": "KMSU0057", "nama": "Sunarto", "jabatan": "Staf Teknik Las", "divisi": "Staff", "status": "Tetap", "gender": "L", "gaji": 4347717, "birthDate": "1990-04-22", "joinDate": "2023-05-17", "phone": "081275569635", "email": "sunarto@kmsu.co.id", "performance": 82, "absensi": 86},
  {"id": 58, "nik": "KMSU0058", "nama": "Tatag P", "jabatan": "Staf Teknik", "divisi": "Staff", "status": "Kontrak", "gender": "L", "gaji": 3296781, "birthDate": "2000-07-27", "joinDate": "2020-01-01", "phone": "081254769200", "email": "tatagp@kmsu.co.id", "performance": 78, "absensi": 96},
  {"id": 59, "nik": "KMSU0059", "nama": "Trismiyanto", "jabatan": "Staf Teknik", "divisi": "Staff", "status": "Kontrak", "gender": "L", "gaji": 3474680, "birthDate": "1985-12-15", "joinDate": "2022-12-14", "phone": "081285283645", "email": "trismiyanto@kmsu.co.id", "performance": 74, "absensi": 87},
  {"id": 60, "nik": "KMSU0060", "nama": "Ikhsan Abdul Razaq", "jabatan": "Operator Produksi", "divisi": "Produksi", "status": "Kontrak", "gender": "L", "gaji": 2239449, "birthDate": "1984-09-02", "joinDate": "2024-06-19", "phone": "081284158663", "email": "ikhsanabdulrazaq@kmsu.co.id", "performance": 78, "absensi": 92},
  {"id": 61, "nik": "KMSU0061", "nama": "M Wafiq Fauzan", "jabatan": "Operator Produksi", "divisi": "Produksi", "status": "Kontrak", "gender": "L", "gaji": 2266818, "birthDate": "1981-05-12", "joinDate": "2024-01-12", "phone": "081238195995", "email": "mwafiqfauzan@kmsu.co.id", "performance": 81, "absensi": 96},
  {"id": 62, "nik": "KMSU0062", "nama": "Muhammad D Ulhaq", "jabatan": "Operator Produksi", "divisi": "Produksi", "status": "Kontrak", "gender": "L", "gaji": 2253893, "birthDate": "1991-09-28", "joinDate": "2021-10-24", "phone": "081230743797", "email": "muhammaddulhaq@kmsu.co.id", "performance": 81, "absensi": 88},
  {"id": 63, "nik": "KMSU0063", "nama": "Muhammad Taufik K.H", "jabatan": "Operator Produksi", "divisi": "Produksi", "status": "Kontrak", "gender": "L", "gaji": 2292826, "birthDate": "1993-01-06", "joinDate": "2023-06-26", "phone": "081265259205", "email": "muhammadtaufikkh@kmsu.co.id", "performance": 81, "absensi": 90},
  {"id": 64, "nik": "KMSU0064", "nama": "Muntholib", "jabatan": "Operator Produksi", "divisi": "Produksi", "status": "Kontrak", "gender": "L", "gaji": 2283465, "birthDate": "1983-07-28", "joinDate": "2018-08-08", "phone": "081236786211", "email": "muntholib@kmsu.co.id", "performance": 88, "absensi": 91},
  {"id": 65, "nik": "KMSU0065", "nama": "Nanang Nur Arifin", "jabatan": "Operator Produksi", "divisi": "Produksi", "status": "Kontrak", "gender": "L", "gaji": 2360007, "birthDate": "1987-04-01", "joinDate": "2023-04-13", "phone": "081254058573", "email": "nanangnurarifin@kmsu.co.id", "performance": 82, "absensi": 87},
  {"id": 66, "nik": "KMSU0066", "nama": "Supriyadi Bkl", "jabatan": "Operator Produksi", "divisi": "Produksi", "status": "Kontrak", "gender": "L", "gaji": 2346341, "birthDate": "1991-11-17", "joinDate": "2021-11-27", "phone": "081281969657", "email": "supriyadibkl@kmsu.co.id", "performance": 84, "absensi": 86},
  {"id": 67, "nik": "KMSU0067", "nama": "Surono", "jabatan": "Operator Produksi", "divisi": "Produksi", "status": "Kontrak", "gender": "L", "gaji": 2260472, "birthDate": "1988-03-19", "joinDate": "2020-01-04", "phone": "081290070438", "email": "surono@kmsu.co.id", "performance": 87, "absensi": 91},
  {"id": 68, "nik": "KMSU0068", "nama": "Irfan Yuniyanto", "jabatan": "Operator Produksi", "divisi": "Produksi", "status": "Kontrak", "gender": "L", "gaji": 2581967, "birthDate": "1990-07-20", "joinDate": "2022-02-13", "phone": "081287388337", "email": "irfanyuniyanto@kmsu.co.id", "performance": 80, "absensi": 90},
  {"id": 69, "nik": "KMSU0069", "nama": "Ramadhan Kurniawan", "jabatan": "Operator Produksi", "divisi": "Produksi", "status": "Kontrak", "gender": "L", "gaji": 2223271, "birthDate": "1993-01-17", "joinDate": "2024-09-22", "phone": "081236445607", "email": "ramadhankurniawan@kmsu.co.id", "performance": 85, "absensi": 92},
  {"id": 70, "nik": "KMSU0070", "nama": "A Zaenal Arifin", "jabatan": "Operator Press", "divisi": "Press", "status": "Tetap", "gender": "L", "gaji": 2830709, "birthDate": "1990-10-11", "joinDate": "2023-02-24", "phone": "081250308572", "email": "azaenalarifin@kmsu.co.id", "performance": 90, "absensi": 90},
  {"id": 71, "nik": "KMSU0071", "nama": "Ahmad Maesuri", "jabatan": "Operator Press", "divisi": "Press", "status": "Tetap", "gender": "L", "gaji": 3519215, "birthDate": "1993-06-13", "joinDate": "2023-05-18", "phone": "081227084279", "email": "ahmadmaesuri@kmsu.co.id", "performance": 80, "absensi": 92},
  {"id": 72, "nik": "KMSU0072", "nama": "Asmadi Mustofa", "jabatan": "Operator Press", "divisi": "Press", "status": "Kontrak", "gender": "L", "gaji": 3197229, "birthDate": "1992-11-24", "joinDate": "2019-10-19", "phone": "081250392808", "email": "asmadimustofa@kmsu.co.id", "performance": 86, "absensi": 94},
  {"id": 73, "nik": "KMSU0073", "nama": "Bekti Wibowo", "jabatan": "Operator Press", "divisi": "Press", "status": "Kontrak", "gender": "L", "gaji": 2500425, "birthDate": "1989-05-07", "joinDate": "2021-10-20", "phone": "081297873101", "email": "bektiwibowo@kmsu.co.id", "performance": 84, "absensi": 93},
  {"id": 74, "nik": "KMSU0074", "nama": "Buchori", "jabatan": "Operator Press", "divisi": "Press", "status": "Kontrak", "gender": "L", "gaji": 2963246, "birthDate": "1994-11-07", "joinDate": "2022-08-26", "phone": "081232775593", "email": "buchori@kmsu.co.id", "performance": 76, "absensi": 90},
  {"id": 75, "nik": "KMSU0075", "nama": "Hafiz Putra W", "jabatan": "Operator Press", "divisi": "Press", "status": "Kontrak", "gender": "L", "gaji": 3040490, "birthDate": "2000-10-11", "joinDate": "2018-04-22", "phone": "081251663795", "email": "hafizputraw@kmsu.co.id", "performance": 81, "absensi": 98},
  {"id": 76, "nik": "KMSU0076", "nama": "Hendra Haryanto", "jabatan": "Operator Press", "divisi": "Press", "status": "Kontrak", "gender": "L", "gaji": 2708802, "birthDate": "1984-01-02", "joinDate": "2019-08-20", "phone": "081219774839", "email": "hendraharyanto@kmsu.co.id", "performance": 88, "absensi": 92},
  {"id": 77, "nik": "KMSU0077", "nama": "M Aziz Arafi", "jabatan": "Operator Press", "divisi": "Press", "status": "Kontrak", "gender": "L", "gaji": 3160356, "birthDate": "1998-04-23", "joinDate": "2023-07-16", "phone": "081263640499", "email": "mazizarafi@kmsu.co.id", "performance": 81, "absensi": 88},
  {"id": 78, "nik": "KMSU0078", "nama": "Nurrohmat", "jabatan": "Operator Press", "divisi": "Press", "status": "Kontrak", "gender": "L", "gaji": 3187926, "birthDate": "1980-02-25", "joinDate": "2021-04-06", "phone": "081279519112", "email": "nurrohmat@kmsu.co.id", "performance": 88, "absensi": 86},
  {"id": 79, "nik": "KMSU0079", "nama": "Ragil Widaryanto", "jabatan": "Operator Press", "divisi": "Press", "status": "Kontrak", "gender": "L", "gaji": 3084482, "birthDate": "1987-02-15", "joinDate": "2019-08-22", "phone": "081281287314", "email": "ragilwidaryanto@kmsu.co.id", "performance": 91, "absensi": 95},
  {"id": 80, "nik": "KMSU0080", "nama": "Riza Prihartanto", "jabatan": "Kepala Bagian Press", "divisi": "Press", "status": "Tetap", "gender": "L", "gaji": 5315982, "birthDate": "1994-10-27", "joinDate": "2023-09-14", "phone": "081283534128", "email": "rizaprihartanto@kmsu.co.id", "performance": 88, "absensi": 88},
  {"id": 81, "nik": "KMSU0081", "nama": "Rudi Susanto", "jabatan": "Operator Press", "divisi": "Press", "status": "Kontrak", "gender": "L", "gaji": 2997732, "birthDate": "1994-05-25", "joinDate": "2019-11-09", "phone": "081279967676", "email": "rudisusanto@kmsu.co.id", "performance": 89, "absensi": 96},
  {"id": 82, "nik": "KMSU0082", "nama": "Sarbini", "jabatan": "Operator Press", "divisi": "Press", "status": "Kontrak", "gender": "L", "gaji": 2750867, "birthDate": "1988-08-03", "joinDate": "2023-05-08", "phone": "081246468984", "email": "sarbini@kmsu.co.id", "performance": 84, "absensi": 91},
  {"id": 83, "nik": "KMSU0083", "nama": "Sumarjono", "jabatan": "Operator Press", "divisi": "Press", "status": "Tetap", "gender": "L", "gaji": 3373029, "birthDate": "1982-03-05", "joinDate": "2019-07-23", "phone": "081230509175", "email": "sumarjono@kmsu.co.id", "performance": 80, "absensi": 87},
  {"id": 84, "nik": "KMSU0084", "nama": "Whendi Adi W", "jabatan": "Operator Press", "divisi": "Press", "status": "Kontrak", "gender": "L", "gaji": 2935020, "birthDate": "1993-06-18", "joinDate": "2021-07-02", "phone": "081237760841", "email": "whendiadiw@kmsu.co.id", "performance": 87, "absensi": 92},
  {"id": 85, "nik": "KMSU0085", "nama": "Ahmad Jafar", "jabatan": "Operator Sezing", "divisi": "Sezing", "status": "Tetap", "gender": "L", "gaji": 3423696, "birthDate": "1980-10-13", "joinDate": "2021-01-12", "phone": "081250079111", "email": "ahmadjafar@kmsu.co.id", "performance": 86, "absensi": 92},
  {"id": 86, "nik": "KMSU0086", "nama": "Ahmad Yudi Fahrudin", "jabatan": "Operator Sezing", "divisi": "Sezing", "status": "Tetap", "gender": "L", "gaji": 3370801, "birthDate": "1997-10-08", "joinDate": "2021-04-09", "phone": "081268496914", "email": "ahmadyudifahrudin@kmsu.co.id", "performance": 89, "absensi": 86},
  {"id": 87, "nik": "KMSU0087", "nama": "Azuar Efendi", "jabatan": "Operator Sezing", "divisi": "Sezing", "status": "Tetap", "gender": "L", "gaji": 3198520, "birthDate": "1990-11-22", "joinDate": "2024-07-24", "phone": "081232151928", "email": "azuarefendi@kmsu.co.id", "performance": 88, "absensi": 88},
  {"id": 88, "nik": "KMSU0088", "nama": "Budi Santoso S", "jabatan": "Operator Sezing", "divisi": "Sezing", "status": "Tetap", "gender": "L", "gaji": 3467731, "birthDate": "1997-01-13", "joinDate": "2022-10-22", "phone": "081213637575", "email": "budisantosos@kmsu.co.id", "performance": 76, "absensi": 96},
  {"id": 89, "nik": "KMSU0089", "nama": "M Jauhari", "jabatan": "Operator Sezing", "divisi": "Sezing", "status": "Kontrak", "gender": "L", "gaji": 2949433, "birthDate": "1984-08-06", "joinDate": "2018-05-13", "phone": "081253936531", "email": "mjauhari@kmsu.co.id", "performance": 80, "absensi": 93},
  {"id": 90, "nik": "KMSU0090", "nama": "M Nur Sholeh", "jabatan": "Operator Sezing", "divisi": "Sezing", "status": "Kontrak", "gender": "L", "gaji": 2842722, "birthDate": "1990-07-09", "joinDate": "2024-07-09", "phone": "081220993268", "email": "mnursholeh@kmsu.co.id", "performance": 89, "absensi": 86},
  {"id": 91, "nik": "KMSU0091", "nama": "Puji Widodo", "jabatan": "Kepala Bagian Sezing", "divisi": "Sezing", "status": "Tetap", "gender": "L", "gaji": 5813948, "birthDate": "1997-01-12", "joinDate": "2019-11-03", "phone": "081297477029", "email": "pujiwidodo@kmsu.co.id", "performance": 75, "absensi": 98},
  {"id": 92, "nik": "KMSU0092", "nama": "Rohman K", "jabatan": "Operator Sezing", "divisi": "Sezing", "status": "Kontrak", "gender": "L", "gaji": 2532537, "birthDate": "1987-04-27", "joinDate": "2018-10-05", "phone": "081242016960", "email": "rohmank@kmsu.co.id", "performance": 78, "absensi": 93},
  {"id": 93, "nik": "KMSU0093", "nama": "Slamet Zaedun", "jabatan": "Operator Sezing", "divisi": "Sezing", "status": "Kontrak", "gender": "L", "gaji": 2619946, "birthDate": "1998-04-15", "joinDate": "2023-05-25", "phone": "081259512272", "email": "slametzaedun@kmsu.co.id", "performance": 79, "absensi": 95},
  {"id": 94, "nik": "KMSU0094", "nama": "Supriyadi S", "jabatan": "Operator Sezing", "divisi": "Sezing", "status": "Kontrak", "gender": "L", "gaji": 3136745, "birthDate": "1983-03-10", "joinDate": "2018-10-01", "phone": "081251870192", "email": "supriyadis@kmsu.co.id", "performance": 92, "absensi": 96},
  {"id": 95, "nik": "KMSU0095", "nama": "Suharto", "jabatan": "Operator Sezing", "divisi": "Sezing", "status": "Tetap", "gender": "L", "gaji": 3182890, "birthDate": "1992-12-07", "joinDate": "2018-10-23", "phone": "081294187049", "email": "suharto@kmsu.co.id", "performance": 81, "absensi": 87},
  {"id": 96, "nik": "KMSU0096", "nama": "Bambang Irwanto", "jabatan": "Operator Produksi", "divisi": "Produksi", "status": "Tetap", "gender": "L", "gaji": 3097855, "birthDate": "1999-02-26", "joinDate": "2022-01-12", "phone": "081281503856", "email": "bambangirwanto@kmsu.co.id", "performance": 87, "absensi": 96},
  {"id": 97, "nik": "KMSU0097", "nama": "Irfanudin", "jabatan": "Operator Produksi", "divisi": "Produksi", "status": "Kontrak", "gender": "L", "gaji": 2888571, "birthDate": "1982-09-21", "joinDate": "2020-01-28", "phone": "081266379329", "email": "irfanudin@kmsu.co.id", "performance": 89, "absensi": 87},
  {"id": 98, "nik": "KMSU0098", "nama": "M Hidayat", "jabatan": "Operator Produksi", "divisi": "Produksi", "status": "Kontrak", "gender": "L", "gaji": 2954582, "birthDate": "1991-11-27", "joinDate": "2021-12-05", "phone": "081268450095", "email": "mhidayat@kmsu.co.id", "performance": 79, "absensi": 97},
  {"id": 99, "nik": "KMSU0099", "nama": "M Khoirul Huda", "jabatan": "Operator Produksi", "divisi": "Produksi", "status": "Kontrak", "gender": "L", "gaji": 3047091, "birthDate": "2000-05-20", "joinDate": "2024-09-25", "phone": "081274893936", "email": "mkhoirulhuda@kmsu.co.id", "performance": 88, "absensi": 92},
  {"id": 100, "nik": "KMSU0100", "nama": "Muh Zuhri", "jabatan": "Operator Produksi", "divisi": "Produksi", "status": "Kontrak", "gender": "L", "gaji": 3121254, "birthDate": "1988-06-28", "joinDate": "2019-02-09", "phone": "081270505620", "email": "muhzuhri@kmsu.co.id", "performance": 81, "absensi": 98},
  {"id": 101, "nik": "KMSU0101", "nama": "Sistiyanto", "jabatan": "Operator Produksi", "divisi": "Produksi", "status": "Kontrak", "gender": "L", "gaji": 2987282, "birthDate": "1998-10-22", "joinDate": "2021-06-01", "phone": "081276344695", "email": "sistiyanto@kmsu.co.id", "performance": 84, "absensi": 88},
  {"id": 102, "nik": "KMSU0102", "nama": "Sugiono", "jabatan": "Operator Produksi", "divisi": "Produksi", "status": "Kontrak", "gender": "L", "gaji": 3011233, "birthDate": "1986-06-26", "joinDate": "2020-06-09", "phone": "081290014570", "email": "sugiono@kmsu.co.id", "performance": 82, "absensi": 94},
  {"id": 103, "nik": "KMSU0103", "nama": "Suparjo", "jabatan": "Operator Produksi", "divisi": "Produksi", "status": "Kontrak", "gender": "L", "gaji": 2510644, "birthDate": "1996-04-03", "joinDate": "2019-12-14", "phone": "081275575808", "email": "suparjo@kmsu.co.id", "performance": 91, "absensi": 98},
  {"id": 104, "nik": "KMSU0104", "nama": "Suryadi", "jabatan": "Operator Produksi", "divisi": "Produksi", "status": "Kontrak", "gender": "L", "gaji": 2751997, "birthDate": "1995-11-23", "joinDate": "2021-08-26", "phone": "081212314351", "email": "suryadi@kmsu.co.id", "performance": 76, "absensi": 90},
  {"id": 105, "nik": "KMSU0105", "nama": "Syaiful Apriyanto", "jabatan": "Operator Produksi", "divisi": "Produksi", "status": "Kontrak", "gender": "L", "gaji": 2732360, "birthDate": "1992-12-08", "joinDate": "2020-11-19", "phone": "081259529086", "email": "syaifulapriyanto@kmsu.co.id", "performance": 89, "absensi": 94},
  {"id": 106, "nik": "KMSU0106", "nama": "Timbul", "jabatan": "Operator Produksi", "divisi": "Produksi", "status": "Kontrak", "gender": "L", "gaji": 3056711, "birthDate": "1991-07-24", "joinDate": "2022-06-12", "phone": "081270900658", "email": "timbul@kmsu.co.id", "performance": 82, "absensi": 90},
  {"id": 107, "nik": "KMSU0107", "nama": "Wahyudi", "jabatan": "Operator Produksi", "divisi": "Produksi", "status": "Kontrak", "gender": "L", "gaji": 2763615, "birthDate": "1987-02-24", "joinDate": "2019-06-04", "phone": "081281922443", "email": "wahyudi@kmsu.co.id", "performance": 79, "absensi": 89},
  {"id": 108, "nik": "KMSU0108", "nama": "Zubidin", "jabatan": "Operator Produksi", "divisi": "Produksi", "status": "Kontrak", "gender": "L", "gaji": 2726895, "birthDate": "1995-05-24", "joinDate": "2022-09-20", "phone": "081247983442", "email": "zubidin@kmsu.co.id", "performance": 77, "absensi": 89},
  {"id": 109, "nik": "KMSU0109", "nama": "Agus Pardiyanto", "jabatan": "Operator Produksi", "divisi": "Produksi", "status": "Kontrak", "gender": "L", "gaji": 2810636, "birthDate": "1987-06-06", "joinDate": "2020-01-23", "phone": "081281690398", "email": "aguspardiyanto@kmsu.co.id", "performance": 78, "absensi": 90},
  {"id": 110, "nik": "KMSU0110", "nama": "Arif Muslim", "jabatan": "Operator Produksi", "divisi": "Produksi", "status": "Kontrak", "gender": "L", "gaji": 2547726, "birthDate": "1981-09-10", "joinDate": "2023-03-21", "phone": "081275884623", "email": "arifmuslim@kmsu.co.id", "performance": 77, "absensi": 86},
  {"id": 111, "nik": "KMSU0111", "nama": "Eksan", "jabatan": "Operator Produksi", "divisi": "Produksi", "status": "Kontrak", "gender": "L", "gaji": 3101949, "birthDate": "1989-08-16", "joinDate": "2021-06-06", "phone": "081216895666", "email": "eksan@kmsu.co.id", "performance": 82, "absensi": 93},
  {"id": 112, "nik": "KMSU0112", "nama": "Eksan Nur Huda", "jabatan": "Operator Produksi", "divisi": "Produksi", "status": "Kontrak", "gender": "L", "gaji": 2619629, "birthDate": "1982-07-16", "joinDate": "2018-10-21", "phone": "081217195288", "email": "eksannurhuda@kmsu.co.id", "performance": 78, "absensi": 88},
  {"id": 113, "nik": "KMSU0113", "nama": "Joko Supadi", "jabatan": "Operator Produksi", "divisi": "Produksi", "status": "Kontrak", "gender": "L", "gaji": 3090180, "birthDate": "1989-02-08", "joinDate": "2018-09-25", "phone": "081265857931", "email": "jokosupadi@kmsu.co.id", "performance": 93, "absensi": 95},
  {"id": 114, "nik": "KMSU0114", "nama": "Muh Yudi", "jabatan": "Operator Produksi", "divisi": "Produksi", "status": "Kontrak", "gender": "L", "gaji": 3148458, "birthDate": "1987-09-13", "joinDate": "2021-08-10", "phone": "081288990506", "email": "muhyudi@kmsu.co.id", "performance": 87, "absensi": 90},
  {"id": 115, "nik": "KMSU0115", "nama": "Syarifudin Arif B", "jabatan": "Operator Produksi", "divisi": "Produksi", "status": "Kontrak", "gender": "L", "gaji": 3096251, "birthDate": "1999-01-20", "joinDate": "2023-02-25", "phone": "081237888820", "email": "syarifudinarifb@kmsu.co.id", "performance": 94, "absensi": 89},
  {"id": 116, "nik": "KMSU0116", "nama": "Sigit", "jabatan": "Operator Produksi", "divisi": "Produksi", "status": "Kontrak", "gender": "L", "gaji": 2777501, "birthDate": "1982-03-08", "joinDate": "2019-09-03", "phone": "081231009452", "email": "sigit@kmsu.co.id", "performance": 74, "absensi": 92},
  {"id": 117, "nik": "KMSU0117", "nama": "Ahmad Juari", "jabatan": "Operator Produksi", "divisi": "Produksi", "status": "Kontrak", "gender": "L", "gaji": 2972387, "birthDate": "1999-08-10", "joinDate": "2018-04-10", "phone": "081247945817", "email": "ahmadjuari@kmsu.co.id", "performance": 88, "absensi": 87},
  {"id": 118, "nik": "KMSU0118", "nama": "Dedi Setiawan", "jabatan": "Operator Produksi", "divisi": "Produksi", "status": "Kontrak", "gender": "L", "gaji": 2744762, "birthDate": "1988-11-19", "joinDate": "2023-04-14", "phone": "081225405014", "email": "dedisetiawan@kmsu.co.id", "performance": 91, "absensi": 89},
  {"id": 119, "nik": "KMSU0119", "nama": "Dwi Indra", "jabatan": "Operator Produksi", "divisi": "Produksi", "status": "Kontrak", "gender": "L", "gaji": 3179094, "birthDate": "1984-05-27", "joinDate": "2019-02-02", "phone": "081232269779", "email": "dwiindra@kmsu.co.id", "performance": 83, "absensi": 95},
  {"id": 120, "nik": "KMSU0120", "nama": "Jumar", "jabatan": "Operator Produksi", "divisi": "Produksi", "status": "Kontrak", "gender": "L", "gaji": 3096856, "birthDate": "1989-08-04", "joinDate": "2021-12-10", "phone": "081264023778", "email": "jumar@kmsu.co.id", "performance": 82, "absensi": 94},
  {"id": 121, "nik": "KMSU0121", "nama": "Nurul Huda", "jabatan": "Operator Produksi", "divisi": "Produksi", "status": "Kontrak", "gender": "L", "gaji": 3066211, "birthDate": "1995-08-03", "joinDate": "2022-01-14", "phone": "081253261270", "email": "nurulhuda@kmsu.co.id", "performance": 93, "absensi": 90},
  {"id": 122, "nik": "KMSU0122", "nama": "Subiyanto", "jabatan": "Operator Produksi", "divisi": "Produksi", "status": "Kontrak", "gender": "L", "gaji": 2527121, "birthDate": "1982-04-22", "joinDate": "2024-10-19", "phone": "081212784407", "email": "subiyanto@kmsu.co.id", "performance": 82, "absensi": 95},
  {"id": 123, "nik": "KMSU0123", "nama": "Suharyanto", "jabatan": "Operator Produksi", "divisi": "Produksi", "status": "Kontrak", "gender": "L", "gaji": 2542185, "birthDate": "1985-08-17", "joinDate": "2023-08-09", "phone": "081234359060", "email": "suharyanto@kmsu.co.id", "performance": 92, "absensi": 92},
  {"id": 124, "nik": "KMSU0124", "nama": "Budi Nurrohman", "jabatan": "Operator Produksi", "divisi": "Produksi", "status": "Kontrak", "gender": "L", "gaji": 3165620, "birthDate": "1995-02-16", "joinDate": "2020-07-11", "phone": "081253091709", "email": "budinurrohman@kmsu.co.id", "performance": 77, "absensi": 88},
  {"id": 125, "nik": "KMSU0125", "nama": "Dhimas Wahyu W", "jabatan": "Operator Produksi", "divisi": "Produksi", "status": "Kontrak", "gender": "L", "gaji": 2845824, "birthDate": "1993-12-16", "joinDate": "2020-11-13", "phone": "081283832717", "email": "dhimaswahyuw@kmsu.co.id", "performance": 75, "absensi": 93},
  {"id": 126, "nik": "KMSU0126", "nama": "Muhamad Wahyu S", "jabatan": "Operator Produksi", "divisi": "Produksi", "status": "Kontrak", "gender": "L", "gaji": 2592337, "birthDate": "1990-05-11", "joinDate": "2018-07-28", "phone": "081279067939", "email": "muhamadwahyus@kmsu.co.id", "performance": 74, "absensi": 96},
  {"id": 127, "nik": "KMSU0127", "nama": "Afif Rozan", "jabatan": "Operator Produksi", "divisi": "Produksi", "status": "Kontrak", "gender": "L", "gaji": 3068950, "birthDate": "1994-07-02", "joinDate": "2019-09-12", "phone": "081293568503", "email": "afifrozan@kmsu.co.id", "performance": 89, "absensi": 96},
  {"id": 128, "nik": "KMSU0128", "nama": "Jumarno", "jabatan": "Operator Produksi", "divisi": "Produksi", "status": "Kontrak", "gender": "L", "gaji": 2963513, "birthDate": "1981-04-09", "joinDate": "2022-03-10", "phone": "081268802946", "email": "jumarno@kmsu.co.id", "performance": 89, "absensi": 87},
  {"id": 129, "nik": "KMSU0129", "nama": "Ratmoko", "jabatan": "Operator Produksi", "divisi": "Produksi", "status": "Kontrak", "gender": "L", "gaji": 2530271, "birthDate": "2000-10-26", "joinDate": "2019-12-06", "phone": "081251708177", "email": "ratmoko@kmsu.co.id", "performance": 91, "absensi": 86},
  {"id": 130, "nik": "KMSU0130", "nama": "Ariful Zaenuri", "jabatan": "Operator Produksi", "divisi": "Produksi", "status": "Kontrak", "gender": "L", "gaji": 3079077, "birthDate": "1993-02-08", "joinDate": "2024-02-15", "phone": "081225766039", "email": "arifulzaenuri@kmsu.co.id", "performance": 94, "absensi": 88}
];
let employees = [];

// ========== HELPER INTERNAL ==========
function saveToLocalStorage() {
  localStorage.setItem('kmsu_hris_v4', JSON.stringify(employees));
}

function generateRandomScore() {
  return Math.floor(Math.random() * 20 + 74); // 74-94
}

function generateRandomAbsensi() {
  return Math.floor(Math.random() * 12 + 86); // 86-98
}

// ========== PUBLIC API ==========
function loadInitialData() {
  const stored = localStorage.getItem('kmsu_hris_v4');
  if (stored) {
    employees = JSON.parse(stored);
  } else {
    employees = [...DEFAULT_EMPLOYEES];
    saveToLocalStorage();
  }
}

function getEmployees() {
  return [...employees]; // return copy to avoid mutation
}

function getEmployeeById(id) {
  return employees.find(emp => emp.id === id);
}

function addEmployee(empData) {
  const newId = employees.length ? Math.max(...employees.map(e => e.id)) + 1 : 1;
  const newEmployee = {
    id: newId,
    ...empData,
    performance: generateRandomScore(),
    absensi: generateRandomAbsensi()
  };
  employees.push(newEmployee);
  saveToLocalStorage();
  return newEmployee;
}

function updateEmployee(id, updatedData) {
  const index = employees.findIndex(emp => emp.id === id);
  if (index === -1) return null;
  // Preserve existing performance/absensi unless explicitly provided
  const existing = employees[index];
  const updated = {
    ...existing,
    ...updatedData,
    id: existing.id // ensure id not changed
  };
  employees[index] = updated;
  saveToLocalStorage();
  return updated;
}

function deleteEmployee(id) {
  const index = employees.findIndex(emp => emp.id === id);
  if (index === -1) return false;
  employees.splice(index, 1);
  saveToLocalStorage();
  return true;
}

function resetToDefault() {
  employees = [...DEFAULT_EMPLOYEES];
  saveToLocalStorage();
}

// Optional: get total gaji, etc.
function getTotalGaji() {
  return employees.reduce((sum, emp) => sum + emp.gaji, 0);
}

function getStatistik() {
  const total = employees.length;
  const tetap = employees.filter(e => e.status === 'Tetap').length;
  const kontrak = total - tetap;
  const laki = employees.filter(e => e.gender === 'L').length;
  const perempuan = total - laki;
  const divisiCount = {};
  employees.forEach(e => divisiCount[e.divisi] = (divisiCount[e.divisi] || 0) + 1);
  return { total, tetap, kontrak, laki, perempuan, divisiCount };
}


/* ── js/core/state.js ── */
let state = {
  currentPage: 'dashboard',
  filterDivisi: 'Semua',
  filterStatus: 'Semua',
  karyawanPage: 1,
  itemsPerPage: 8,
  searchQuery: ''
};

const subscribers = [];

function getState() {
  return { ...state };
}

function setState(updates) {
  state = { ...state, ...updates };
  notifySubscribers();
}

function subscribe(callback) {
  subscribers.push(callback);
  return () => {
    const index = subscribers.indexOf(callback);
    if (index !== -1) subscribers.splice(index, 1);
  };
}

function notifySubscribers() {
  subscribers.forEach(cb => cb(state));
}

function initState() {
  notifySubscribers();
}


/* ── js/pages/dashboard.js ── */
function renderDashboard(){
  const employees = getEmployees();
  const total     = employees.length;
  const tetap     = employees.filter(e=>e.status==='Tetap').length;
  const totalGaji = employees.reduce((s,e)=>s+e.gaji,0);
  const avgHadir  = total ? Math.round(employees.reduce((s,e)=>s+(e.absensi||0),0)/total) : 0;
  const avgPerf   = total ? Math.round(employees.reduce((s,e)=>s+(e.performance||0),0)/total) : 0;

  // Divisi breakdown
  const byDivisi = {};
  employees.forEach(e=>{ byDivisi[e.divisi]=(byDivisi[e.divisi]||0)+1; });
  const sortedDivisi = Object.entries(byDivisi).sort((a,b)=>b[1]-a[1]);

  // Recent 5
  const recent = [...employees].sort((a,b)=>new Date(b.joinDate)-new Date(a.joinDate)).slice(0,5);

  const html = `
  <div class="animate-in">
    <div class="kpi-grid mb-4">
      ${[
        {label:'Total Karyawan', val:total,           sub:`${tetap} tetap · ${total-tetap} kontrak`, icon:'users', color:'var(--ac)', id:'kpiTotal'},
        {label:'Total Gaji/Bulan',val:formatRupiah(totalGaji),sub:'gross payroll',icon:'coins',color:'var(--ag)',id:'kpiGaji'},
        {label:'Rata-rata Kehadiran',val:avgHadir+'%', sub:'bulan berjalan',icon:'calendar-check',color:'var(--as)',id:'kpiHadir'},
        {label:'Rata-rata Performa', val:avgPerf+'%',  sub:'skor kinerja',icon:'star',color:'var(--ar)',id:'kpiPerf'},
      ].map(k=>`
        <div class="glass-card kpi-card">
          <div class="kpi-label">${k.label}</div>
          <div class="kpi-val" style="color:${k.color}" id="${k.id}">${k.val}</div>
          <div class="kpi-sub">${k.sub}</div>
          <div class="kpi-icon" style="background:${k.color}18;color:${k.color}"><i class="fas fa-${k.icon}"></i></div>
        </div>
      `).join('')}
    </div>

    <div class="grid-2 mb-4">
      <div class="glass-card card-pad">
        <div class="sec-header">
          <div class="sec-title"><span class="dot"></span>Sebaran per Divisi</div>
          <span style="font-size:.68rem;color:var(--tm)">${Object.keys(byDivisi).length} divisi</span>
        </div>
        <div style="height:195px"><canvas id="chartDivisi"></canvas></div>
      </div>
      <div class="glass-card card-pad">
        <div class="sec-header">
          <div class="sec-title"><span class="dot" style="background:var(--ag)"></span>Status Karyawan</div>
        </div>
        <div style="height:195px"><canvas id="chartStatus"></canvas></div>
      </div>
    </div>

    <div class="glass-card card-pad">
      <div class="sec-header">
        <div class="sec-title"><span class="dot" style="background:var(--ar)"></span>Karyawan Terbaru</div>
        <button class="btn-secondary" id="gotoKaryawanBtn" style="font-size:.72rem;padding:5px 10px">Semua Karyawan</button>
      </div>
      <div class="tbl-wrap">
        <table class="data-table">
          <thead><tr><th>Nama</th><th>Jabatan</th><th>Divisi</th><th>Status</th><th>Bergabung</th></tr></thead>
          <tbody>
            ${recent.map(e=>{
              const dc=getDivisiColor(e.divisi);
              return `<tr style="cursor:pointer" data-id="${e.id}">
                <td>
                  <div style="display:flex;align-items:center;gap:8px">
                    <div class="avatar" style="width:30px;height:30px;font-size:.7rem;background:${getAvatarColor(e.nama)}">${e.nama.charAt(0)}</div>
                    <div><div style="font-weight:600">${e.nama}</div><div style="font-size:.65rem;color:var(--tm)">${e.nik}</div></div>
                  </div>
                </td>
                <td style="color:var(--tm);font-size:.78rem">${e.jabatan}</td>
                <td><span class="divisi-tag" style="background:${dc}18;color:${dc}">${e.divisi}</span></td>
                <td><span class="badge ${e.status==='Tetap'?'badge-success':'badge-warning'}">${e.status}</span></td>
                <td style="font-size:.75rem;color:var(--tm)">${new Date(e.joinDate).toLocaleDateString('id-ID',{day:'2-digit',month:'short',year:'numeric'})}</td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  </div>`;

  document.getElementById('pageContainer').innerHTML = html;
  destroyCharts();

  // Chart divisi
  createChart('chartDivisi','bar',
    sortedDivisi.map(([d])=>d),
    sortedDivisi.map(([,c])=>c),
    { dataset:{ backgroundColor: sortedDivisi.map(([d])=>getDivisiColor(d)+'aa'), borderRadius:4, borderSkipped:false },
      options:{ plugins:{legend:{display:false}}, scales:{x:{ticks:{color:'var(--tm)',font:{size:10}}},y:{ticks:{color:'var(--tm)',stepSize:5}}}}
    }
  );

  // Chart status
  createChart('chartStatus','doughnut',
    ['Tetap','Kontrak'],
    [tetap, total-tetap],
    { dataset:{ backgroundColor:['rgba(0,232,192,.25)','rgba(240,192,64,.25)'], borderColor:['#00e8c0','#f0c040'], borderWidth:2 },
      options:{ cutout:'60%', plugins:{ legend:{ position:'bottom', labels:{ color:'#8b949e', font:{size:11} }}}}
    }
  );

  document.getElementById('gotoKaryawanBtn')?.addEventListener('click',()=>navigateTo('karyawan'));
  document.querySelectorAll('[data-id]').forEach(el=>{
    el.addEventListener('click',()=>{
      const id=parseInt(el.dataset.id);
      openEmployeeModal(getEmployees().find(e=>e.id===id));
    });
  });
}


/* ── js/pages/karyawan.js ── */
function renderKaryawan() {
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
      <div class="card-pad" style="border-bottom:1px solid var(--b2)">
        <div class="sec-header">
          <div class="sec-title"><span class="dot"></span> Daftar Karyawan <span style="color:var(--tm); font-weight:400">(${filtered.length})</span></div>
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
      <div class="tbl-wrap">
        <table class="data-table">
          <thead><tr><th style="padding-left:18px">Karyawan</th><th>NIK</th><th>Jabatan</th><th>Divisi</th><th>Status</th><th>Gaji Pokok</th><th>Masa Kerja</th><th>Usia</th><th>Performa</th><th>Aksi</th></tr></thead>
          <tbody>
            ${paginated.length === 0 ? `<tr><td colspan="10"><div style="text-align:center;padding:30px;color:var(--tm)"><i class="fas fa-magnifying-glass"></i><p>Tidak ada karyawan ditemukan</p></div></td></tr>` : ''}
            ${paginated.map(emp => `
              <tr>
                <td style="padding-left:18px"><div style="display:flex; align-items:center; gap:10px"><div class="avatar" style="width:34px; height:34px; background:${getAvatarColor(emp.nama)}; border-radius:var(--rad-sm); display:flex; align-items:center; justify-content:center; color:#fff; font-weight:700">${emp.nama.charAt(0)}</div><div><div style="font-weight:600">${emp.nama}</div><div style="font-size:0.65rem; color:var(--tm)">${emp.gender === 'L' ? '♂ Laki-laki' : '♀ Perempuan'}</div></div></div></td>
                <td style="font-family:'JetBrains Mono', monospace; font-size:0.72rem">${emp.nik}</td>
                <td>${emp.jabatan}</td>
                <td><span style="background:${getDivisiColor(emp.divisi)}18; color:${getDivisiColor(emp.divisi)}; padding:3px 9px; border-radius:20px; font-size:0.62rem; font-weight:700">${emp.divisi}</span></td>
                <td><span class="badge ${emp.status === 'Tetap' ? 'badge-success' : 'badge-warning'}">${emp.status}</span></td>
                <td style="font-weight:600; font-family:'JetBrains Mono', monospace; color:var(--ac)">${formatRupiah(emp.gaji)}</td>
                <td>${tenure(emp.joinDate)}</td>
                <td>${ageFromBirth(emp.birthDate)}</td>
                <td><div style="display:flex; align-items:center; gap:6px"><div class="prog-bar" style="width:52px"><div class="prog-fill" style="width:${emp.performance}%; background:${emp.performance>=85 ? 'var(--as)' : emp.performance>=70 ? 'var(--ag)' : 'var(--ar)'}"></div></div><span style="font-size:0.68rem; font-weight:700">${emp.performance}%</span></div></td>
                <td><button class="icon-btn" data-view="${emp.id}"><i class="fas fa-eye"></i></button><button class="icon-btn" data-edit="${emp.id}"><i class="fas fa-pen"></i></button><button class="icon-btn" style="color:var(--ar);background:rgba(255,107,138,.08)" data-delete="${emp.id}"><i class="fas fa-trash"></i></button></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 14px;border-top:1px solid var(--b1);flex-wrap:wrap;gap:8px">
        <span style="font-size:.72rem;color:var(--tm)">Menampilkan ${filtered.length===0?0:start+1}–${Math.min(start+itemsPerPage,filtered.length)} dari ${filtered.length} karyawan</span>
        <div class="pagination">
          <button class="page-btn" data-page="prev" ${karyawanPage<=1?'disabled':''}><i class="fas fa-chevron-left"></i></button>
          ${(()=>{
            const pages=[];
            const delta=2;
            const left=karyawanPage-delta;
            const right=karyawanPage+delta;
            let last=0;
            for(let i=1;i<=totalPages;i++){
              if(i===1||i===totalPages||( i>=left&&i<=right)){
                if(last&&i-last>1) pages.push('...');
                pages.push(i);
                last=i;
              }
            }
            return pages.map(p=>p==='...'
              ? `<span style="color:var(--tm);padding:0 4px;font-size:.75rem">…</span>`
              : `<button class="page-btn ${karyawanPage===p?'active':''}" data-page="${p}">${p}</button>`
            ).join('');
          })()}
          <button class="page-btn" data-page="next" ${karyawanPage>=totalPages?'disabled':''}><i class="fas fa-chevron-right"></i></button>
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

/* ── js/pages/statistik.js ── */
function renderStatistik() {
  const employees = getEmployees();
  const total = employees.length;
  const tetap = employees.filter(e => e.status === 'Tetap').length;
  const kontrak = total - tetap;
  const lk = employees.filter(e => e.gender === 'L').length;
  const pr = total - lk;
  
  const divisiMap = {};
  employees.forEach(e => divisiMap[e.divisi] = (divisiMap[e.divisi] || 0) + 1);
  const divisiLabels = Object.keys(divisiMap);
  const divisiData = Object.values(divisiMap);
  
  const gajiPerDivisi = {};
  employees.forEach(e => {
    if (!gajiPerDivisi[e.divisi]) gajiPerDivisi[e.divisi] = { total: 0, count: 0 };
    gajiPerDivisi[e.divisi].total += e.gaji;
    gajiPerDivisi[e.divisi].count++;
  });
  const avgGajiDivisi = Object.keys(gajiPerDivisi).map(d => ({
    divisi: d,
    avg: Math.round(gajiPerDivisi[d].total / gajiPerDivisi[d].count / 1e6)
  })).sort((a,b) => b.avg - a.avg);
  
  const perfBins = { '<70': 0, '70-79': 0, '80-89': 0, '90+': 0 };
  employees.forEach(e => {
    const p = e.performance || 0;
    if (p < 70) perfBins['<70']++;
    else if (p < 80) perfBins['70-79']++;
    else if (p < 90) perfBins['80-89']++;
    else perfBins['90+']++;
  });
  
  const trendLabels = ['Des', 'Jan', 'Feb', 'Mar', 'Apr', 'Mei'];
  const trendData = [total-5, total-4, total-3, total-2, total-1, total];
  
  const html = `
    <div class="animate-in">

      <!-- KPI Strip 3+3 -->
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:14px">
        ${[
          { label:'Total Karyawan',   value:total,              color:'var(--ac)',  icon:'users' },
          { label:'Karyawan Tetap',   value:tetap,              color:'var(--as)',  icon:'user-check' },
          { label:'Karyawan Kontrak', value:kontrak,            color:'var(--ag)',  icon:'user-clock' },
          { label:'Total Divisi',     value:divisiLabels.length,color:'var(--ab)',  icon:'sitemap' },
          { label:'Laki-laki',        value:lk,                 color:'var(--ab)',  icon:'mars' },
          { label:'Perempuan',        value:pr,                 color:'var(--ar)',  icon:'venus' },
        ].map(s=>`
          <div class="glass-card kpi-card" style="text-align:center;padding:12px 10px">
            <div class="kpi-icon" style="background:${s.color}18;color:${s.color};position:static;width:28px;height:28px;border-radius:6px;margin:0 auto 6px;font-size:.75rem;display:flex;align-items:center;justify-content:center">
              <i class="fas fa-${s.icon}"></i>
            </div>
            <div style="font-family:'Sora',sans-serif;font-size:1.4rem;font-weight:800;color:${s.color};line-height:1">${s.value}</div>
            <div style="font-size:.6rem;color:var(--tm);margin-top:3px">${s.label}</div>
          </div>
        `).join('')}
      </div>

      <!-- Chart row 1: Divisi + Status/Gender -->
      <div class="grid-2 mb-4">
        <div class="glass-card card-pad">
          <div class="sec-header"><div class="sec-title"><span class="dot"></span>Karyawan per Divisi</div></div>
          <div style="height:200px"><canvas id="divisiBarChart"></canvas></div>
        </div>
        <div class="glass-card card-pad">
          <div class="sec-header"><div class="sec-title"><span class="dot" style="background:var(--as)"></span>Status & Gender</div></div>
          <div style="height:110px"><canvas id="statusGenderChart"></canvas></div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:10px">
            ${[['Tetap',tetap,'var(--as)'],['Kontrak',kontrak,'var(--ag)'],['Laki-laki',lk,'var(--ab)'],['Perempuan',pr,'var(--ar)']].map(([l,v,c])=>`
              <div style="padding:8px;background:var(--s3);border-radius:8px;text-align:center">
                <div style="font-family:'Sora',sans-serif;font-size:1.2rem;font-weight:800;color:${c}">${v}</div>
                <div style="font-size:.6rem;color:var(--tm)">${l}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- Chart row 2: Trend + Avg Gaji -->
      <div class="grid-2 mb-4">
        <div class="glass-card card-pad">
          <div class="sec-header"><div class="sec-title"><span class="dot" style="background:var(--ac)"></span>Tren Headcount 6 Bulan</div></div>
          <div style="height:175px"><canvas id="trendLineChart"></canvas></div>
        </div>
        <div class="glass-card card-pad">
          <div class="sec-header"><div class="sec-title"><span class="dot" style="background:var(--ag)"></span>Avg. Gaji per Divisi</div></div>
          <div style="height:175px"><canvas id="avgGajiHorizChart"></canvas></div>
        </div>
      </div>

      <!-- Chart row 3: Doughnut + Ringkasan -->
      <div class="grid-2">
        <div class="glass-card card-pad">
          <div class="sec-header"><div class="sec-title"><span class="dot" style="background:var(--ar)"></span>Distribusi Performa</div></div>
          <div style="height:175px"><canvas id="perfDoughnutChart"></canvas></div>
        </div>
        <div class="glass-card card-pad">
          <div class="sec-header"><div class="sec-title"><span class="dot" style="background:var(--as)"></span>Ringkasan per Divisi</div></div>
          ${divisiLabels.map(d=>{
            const count=divisiMap[d];
            const pct=Math.round(count/total*100);
            return `<div style="display:flex;align-items:center;gap:8px;margin-bottom:7px">
              <span style="font-size:.68rem;font-weight:700;color:${getDivisiColor(d)};width:74px;flex-shrink:0">${d}</span>
              <div class="prog-bar" style="flex:1"><div class="prog-fill" style="width:${pct}%;background:${getDivisiColor(d)}"></div></div>
              <span style="font-size:.65rem;color:var(--tm);width:42px;text-align:right;flex-shrink:0">${count} (${pct}%)</span>
            </div>`;
          }).join('')}
        </div>
      </div>
    </div>
  `;
  
  document.getElementById('pageContainer').innerHTML = html;
  destroyCharts();
  
  // Bar chart divisi
  const divisiColors = divisiLabels.map(l => getDivisiColor(l));
  createChart('divisiBarChart', 'bar', divisiLabels, divisiData, {
    dataset: { backgroundColor: divisiColors.map(c => c + '28'), borderColor: divisiColors, borderWidth: 2, borderRadius: 10 }
  });
  
  // Bar chart status vs gender (4 bars)
  createChart('statusGenderChart', 'bar', ['Tetap', 'Kontrak', 'Laki-laki', 'Perempuan'], [tetap, kontrak, lk, pr], {
    dataset: { backgroundColor: ['#00e8c028', '#f0c04028', '#64b4ff28', '#ff6b8a28'], borderColor: ['#00e8c0', '#f0c040', '#64b4ff', '#ff6b8a'], borderWidth: 2, borderRadius: 8 },
    options: { scales: { y: { display: false }, x: { ticks: { color: 'var(--ts)' } } } }
  });
  
  // Line chart trend
  createChart('trendLineChart', 'line', trendLabels, trendData, {
    dataset: { borderColor: '#00c8f0', backgroundColor: 'rgba(0,200,255,0.07)', fill: true, tension: 0.4, pointBackgroundColor: '#00c8f0', pointRadius: 4 }
  });
  
  // Horizontal bar chart avg gaji per divisi
  const avgLabels = avgGajiDivisi.map(d => d.divisi);
  const avgData = avgGajiDivisi.map(d => d.avg);
  createChart('avgGajiHorizChart', 'bar', avgLabels, avgData, {
    indexAxis: 'y',
    dataset: { backgroundColor: avgLabels.map(l => getDivisiColor(l) + '38'), borderColor: avgLabels.map(l => getDivisiColor(l)), borderWidth: 2, borderRadius: 8 },
    options: { scales: { x: { ticks: { callback: v => v + 'jt' } } } }
  });
  
  // Doughnut chart performa
  createChart('perfDoughnutChart', 'doughnut', Object.keys(perfBins), Object.values(perfBins), {
    dataset: { backgroundColor: ['rgba(255,107,138,0.25)', 'rgba(240,192,64,0.25)', 'rgba(0,200,255,0.25)', 'rgba(0,232,192,0.25)'], borderColor: ['#ff6b8a', '#f0c040', '#00c8f0', '#00e8c0'], borderWidth: 2 },
    options: { cutout: '55%', plugins: { legend: { position: 'bottom', labels: { color: 'var(--ts)' } } } }
  });
}

/* ── js/pages/penggajian.js ── */
function renderPenggajian() {
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
        <div class="card-pad" style="border-bottom:1px solid var(--b2)">
          <div class="sec-header">
            <div class="sec-title"><span class="dot" style="background:var(--ap)"></span> Tabel Penggajian · ${bulan}</div>
            <span style="font-size:0.67rem; color:var(--tm)">Pokok + Tunjangan 15% − BPJS Kes 1% − BPJS TK 2%</span>
          </div>
        </div>
        <div class="tbl-wrap">
          <table class="data-table">
            <thead><tr><th style="padding-left:18px">#</th><th>Karyawan</th><th>Divisi</th><th>Gaji Pokok</th><th style="color:var(--as)">+Tunjangan</th><th style="color:var(--ar)">−BPJS Kes</th><th style="color:var(--ar)">−BPJS TK</th><th>Take Home Pay</th><th>Slip</th></tr></thead>
            <tbody>
              ${rows.map((r, i) => `
                <tr>
                  <td style="padding-left:18px">${i+1}</td>
                  <td><div style="display:flex; align-items:center; gap:9px"><div class="avatar" style="width:32px; height:32px; background:${getAvatarColor(r.nama)}; border-radius:var(--rad-sm); display:flex; align-items:center; justify-content:center; color:#fff">${r.nama.charAt(0)}</div><div><div style="font-weight:600">${r.nama}</div><span class="badge ${r.status==='Tetap'?'badge-success':'badge-warning'}" style="font-size:0.57rem">${r.status}</span></div></div></td>
                  <td><span style="background:${getDivisiColor(r.divisi)}18; color:${getDivisiColor(r.divisi)}; padding:2px 8px; border-radius:20px; font-size:0.61rem; font-weight:700">${r.divisi}</span></td>
                  <td style="font-family:'JetBrains Mono', monospace">${formatRupiah(r.gaji)}</td>
                  <td style="color:var(--as)">+${formatRupiah(r.tunjangan)}</td>
                  <td style="color:var(--ar)">-${formatRupiah(r.bpjsKes)}</td>
                  <td style="color:var(--ar)">-${formatRupiah(r.bpjsTk)}</td>
                  <td style="font-weight:700; color:var(--ac)">${formatRupiah(r.thp)}</td>
                  <td><button class="icon-btn" data-slip="${r.id}"><i class="fas fa-file-invoice"></i></button></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        <div style="padding:14px 18px; border-top:1px solid var(--b2); display:flex; justify-content:flex-end">
          <div style="background:var(--s3); border-radius:var(--rad); padding:10px 18px; text-align:right">
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

/* ── js/pages/absensi.js ── */
// ── Sistem Absensi Mingguan Jumat–Kamis ──────────────────────
// Storage key: absensi_{YYYY-MM-DD}  (tanggal Jumat)
// Value: { empId: { jmt:'H', sbt:'H', ahd:'-', snn:'H', ... } }

const KODE = ['H','S','I','L','C','A','-'];
const KODE_LABEL = { H:'Hadir', S:'Sakit', I:'Izin', L:'Lembur', C:'Cuti', A:'Alpha', '-':'Libur' };
const DAY_NAMES = ['JMT','SBT','AHD','SNN','SLS','RAB','KMS'];
const DAY_FULL  = ['Jumat','Sabtu','Ahad','Senin','Selasa','Rabu','Kamis'];

function pad(n){ return String(n).padStart(2,'0'); }
function fmtDate(d){ return `${pad(d.getDate())}/${pad(d.getMonth()+1)}`; }
function fmtKey(d){ return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`; }

// Cari Jumat terdekat (mundur)
function getWeekStart(baseDate){
  const d = new Date(baseDate);
  const dow = d.getDay(); // 0=Sun,1=Mon,...,5=Fri,6=Sat
  const diff = (dow >= 5) ? (dow - 5) : (dow + 2);
  d.setDate(d.getDate() - diff);
  d.setHours(0,0,0,0);
  return d;
}

function getWeekDates(fridayDate){
  return Array.from({length:7}, (_,i) => {
    const d = new Date(fridayDate);
    d.setDate(d.getDate() + i);
    return d;
  });
}

// localStorage wrapper
function loadAbsensi(fridayKey){
  try { return JSON.parse(localStorage.getItem('absensi_'+fridayKey)||'{}'); }
  catch{ return {}; }
}
function saveAbsensi(fridayKey, data){
  localStorage.setItem('absensi_'+fridayKey, JSON.stringify(data));
}

// State modul
let currentWeekStart = null;
let filterDivisi = 'Semua';
let filterStatus = 'Semua';

function renderAbsensi(){
  if (!currentWeekStart) currentWeekStart = getWeekStart(new Date());
  const container = document.getElementById('pageContainer');
  if(!container) return;

  const employees = getEmployees();
  const divisiList = ['Semua',...new Set(employees.map(e=>e.divisi).sort())];

  container.innerHTML = buildUI(employees, divisiList);
  bindEvents(employees);
  renderTable(employees);
}

function buildUI(employees, divisiList){
  return `
  <div class="animate-in">
    <!-- Week Nav -->
    <div class="week-nav">
      <div>
        <div class="week-nav-label" id="weekLabel">–</div>
        <div class="week-nav-sub" id="weekSub">–</div>
      </div>
      <div style="display:flex;gap:6px;align-items:center;margin-left:auto">
        <button class="week-btn" id="prevWeek"><i class="fas fa-chevron-left"></i></button>
        <button class="week-btn" id="todayWeek" title="Minggu ini"><i class="fas fa-calendar-day"></i></button>
        <button class="week-btn" id="nextWeek"><i class="fas fa-chevron-right"></i></button>
        <button class="btn-secondary" id="saveAbsensi" style="margin-left:4px"><i class="fas fa-save"></i> Simpan</button>
        <button class="btn-secondary" id="exportAbsensi"><i class="fas fa-download"></i></button>
      </div>
    </div>

    <!-- Filter & Legenda -->
    <div class="filter-bar">
      <select class="filter-select" id="filterDivisi">
        ${divisiList.map(d=>`<option value="${d}">${d==='Semua'?'Semua Divisi':d}</option>`).join('')}
      </select>
      <select class="filter-select" id="filterStatus">
        <option value="Semua">Semua Status</option>
        <option value="Tetap">Tetap</option>
        <option value="Kontrak">Kontrak</option>
      </select>
      <div class="legenda" style="margin-left:auto">
        ${Object.entries(KODE_LABEL).filter(([k])=>k!=='-').map(([k,v])=>`
          <div class="leg-item">
            <div class="leg-dot" style="background:${kodeColor(k)}"></div>
            <span style="color:var(--tm)">${k} = ${v}</span>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Tabel -->
    <div class="glass-card" style="overflow:hidden">
      <div class="tbl-wrap" id="absensiTableWrap">
        <!-- diisi oleh renderTable() -->
      </div>
    </div>

    <!-- Rekap ringkas -->
    <div class="grid-2" style="margin-top:16px" id="rekapPanel">
    </div>
  </div>`;
}

function kodeColor(k){
  const map = { H:'#00e8c0', S:'#64b4ff', I:'#f0c040', L:'#a78bfa', C:'#ff9d4a', A:'#ff6b8a', '-':'#484f58' };
  return map[k]||'#888';
}

function renderTable(employees){
  const dates   = getWeekDates(currentWeekStart);
  const fridayKey = fmtKey(currentWeekStart);
  const stored  = loadAbsensi(fridayKey);
  const today   = fmtKey(new Date());

  // Update label
  const el = document.getElementById('weekLabel');
  const sub= document.getElementById('weekSub');
  if(el) el.textContent = `Minggu: ${fmtDate(dates[0])} – ${fmtDate(dates[6])} / ${dates[6].getFullYear()}`;
  if(sub) sub.textContent = `${DAY_FULL[0]}, ${dates[0].toLocaleDateString('id-ID',{day:'numeric',month:'long'})} s/d ${DAY_FULL[6]}, ${dates[6].toLocaleDateString('id-ID',{day:'numeric',month:'long',year:'numeric'})}`;

  // Filter karyawan
  const filtered = employees.filter(e=>{
    const dOk = filterDivisi==='Semua' || e.divisi===filterDivisi;
    const sOk = filterStatus==='Semua' || e.status===filterStatus;
    return dOk && sOk;
  });

  // Header kolom hari
  const thDays = dates.map((d,i)=>{
    const key   = fmtKey(d);
    const isAhd = i===2;
    const isTd  = key===today;
    return `<th class="hari-header ${isAhd?'libur':''} ${isTd?'today':''}">
      <span class="hari-day">${DAY_NAMES[i]}</span>
      <span class="hari-date">${fmtDate(d)}</span>
    </th>`;
  }).join('');

  // Baris data
  const rows = filtered.map(emp=>{
    const rec = stored[emp.id] || {};
    const cells = dates.map((d,i)=>{
      const dayKey = ['jmt','sbt','ahd','snn','sls','rab','kms'][i];
      const isAhd  = i===2;
      const val    = rec[dayKey] || (isAhd ? '-' : 'H');
      const cls    = val==='-'?'x':val;
      return `<td class="cell-hadir">
        <select class="kode-select ${cls}" data-emp="${emp.id}" data-day="${dayKey}" ${isAhd?'disabled':''}>
          ${KODE.map(k=>`<option value="${k}" ${k===val?'selected':''}>${k}</option>`).join('')}
        </select>
      </td>`;
    }).join('');

    // Rekap baris
    const dayKeys = ['jmt','sbt','ahd','snn','sls','rab','kms'];
    const counts  = {H:0,S:0,I:0,L:0,C:0,A:0};
    let total=0;
    dayKeys.forEach((dk,i)=>{
      const v = rec[dk]||(i===2?'-':'H');
      if(counts[v]!==undefined){ counts[v]++; total++; }
    });
    const pct = Math.round((counts.H+counts.L+counts.S)/6*100);
    const pctColor = pct>=90?'#00e8c0':pct>=75?'#f0c040':'#ff6b8a';

    const dc = getDivisiColor(emp.divisi);
    return `<tr>
      <td class="col-nama">
        <div style="display:flex;align-items:center;gap:8px">
          <div class="avatar" style="width:28px;height:28px;font-size:.65rem;background:${dc}22;color:${dc}">${emp.nama.charAt(0)}</div>
          <div>
            <div style="font-weight:600;font-size:.78rem">${emp.nama}</div>
            <div style="font-size:.62rem;color:var(--tm)">${emp.nik}</div>
          </div>
        </div>
      </td>
      <td class="col-divisi">
        <span class="divisi-tag" style="background:${dc}18;color:${dc}">${emp.divisi}</span>
      </td>
      ${cells}
      <td style="min-width:62px;text-align:center">
        <div class="rekap-hadir" style="color:${pctColor}">${counts.H+counts.L}</div>
        <div class="pct-bar"><div class="pct-fill" style="width:${pct}%;background:${pctColor}"></div></div>
      </td>
      <td style="text-align:center">
        <span class="${counts.A>0?'rekap-alpha':''}">
          ${counts.A>0?`<i class="fas fa-triangle-exclamation"></i> ${counts.A}`:
            `<span style="color:var(--as)"><i class="fas fa-check"></i></span>`}
        </span>
      </td>
      <td style="text-align:center">
        <div style="font-size:.72rem;font-weight:700;color:${pctColor}">${pct}%</div>
      </td>
    </tr>`;
  }).join('');

  const wrap = document.getElementById('absensiTableWrap');
  if(!wrap) return;
  wrap.innerHTML = `
    <table class="absensi-table">
      <thead>
        <tr>
          <th class="col-nama">Karyawan</th>
          <th class="col-divisi">Divisi</th>
          ${thDays}
          <th style="text-align:center">Hadir</th>
          <th style="text-align:center">Alpha</th>
          <th style="text-align:center">%</th>
        </tr>
      </thead>
      <tbody>${rows||'<tr><td colspan="12" style="text-align:center;padding:20px;color:var(--tm)">Tidak ada karyawan</td></tr>'}</tbody>
    </table>`;

  // Bind select change
  wrap.querySelectorAll('.kode-select').forEach(sel=>{
    sel.addEventListener('change', ()=> onKodeChange(sel, fridayKey));
    updateSelectStyle(sel);
  });

  // Render rekap panel
  renderRekap(filtered, stored);
}

function onKodeChange(sel, fridayKey){
  const stored = loadAbsensi(fridayKey);
  const empId  = parseInt(sel.dataset.emp);
  const day    = sel.dataset.day;
  if(!stored[empId]) stored[empId] = {};
  stored[empId][day] = sel.value;
  saveAbsensi(fridayKey, stored);
  updateSelectStyle(sel);
  // Update baris rekap tanpa re-render penuh
  rekalkulasiRow(empId, stored, fridayKey);
}

function updateSelectStyle(sel){
  KODE.forEach(k=> sel.classList.remove(k==='−'?'x':k));
  sel.classList.remove('x');
  const v = sel.value;
  sel.classList.add(v==='-'?'x':v);
}

function rekalkulasiRow(empId, stored, fridayKey){
  const rec = stored[empId]||{};
  const dayKeys=['jmt','sbt','ahd','snn','sls','rab','kms'];
  const counts={H:0,S:0,I:0,L:0,C:0,A:0};
  dayKeys.forEach((dk,i)=>{
    const v=rec[dk]||(i===2?'-':'H');
    if(counts[v]!==undefined) counts[v]++;
  });
  const pct=Math.round((counts.H+counts.L+counts.S)/6*100);
  const pctColor=pct>=90?'#00e8c0':pct>=75?'#f0c040':'#ff6b8a';
  // Update cells di row
  const row = document.querySelector(`select[data-emp="${empId}"]`)?.closest('tr');
  if(!row) return;
  const tds = row.querySelectorAll('td');
  const lastN = tds.length;
  // td[-3] = hadir, td[-2] = alpha, td[-1] = %
  tds[lastN-3].innerHTML=`<div class="rekap-hadir" style="color:${pctColor}">${counts.H+counts.L}</div><div class="pct-bar"><div class="pct-fill" style="width:${pct}%;background:${pctColor}"></div></div>`;
  tds[lastN-2].innerHTML=counts.A>0?`<span class="rekap-alpha"><i class="fas fa-triangle-exclamation"></i> ${counts.A}</span>`:`<span style="color:var(--as)"><i class="fas fa-check"></i></span>`;
  tds[lastN-1].innerHTML=`<div style="font-size:.72rem;font-weight:700;color:${pctColor}">${pct}%</div>`;
}

function renderRekap(employees, stored){
  const panel = document.getElementById('rekapPanel');
  if(!panel) return;

  let totHadir=0, totAlpha=0, totIzin=0, totSakit=0;
  const dayKeys=['jmt','sbt','ahd','snn','sls','rab','kms'];
  employees.forEach(e=>{
    const rec=stored[e.id]||{};
    dayKeys.forEach((dk,i)=>{
      const v=rec[dk]||(i===2?'-':'H');
      if(v==='H'||v==='L') totHadir++;
      if(v==='A') totAlpha++;
      if(v==='I') totIzin++;
      if(v==='S') totSakit++;
    });
  });
  const total6 = employees.length*6;
  const pctHdr = total6>0?Math.round(totHadir/total6*100):0;

  const kpis=[
    {label:'Total Hadir',val:totHadir,color:'#00e8c0',icon:'calendar-check'},
    {label:'Alpha / Mangkir',val:totAlpha,color:'#ff6b8a',icon:'triangle-exclamation'},
    {label:'Izin',val:totIzin,color:'#f0c040',icon:'envelope'},
    {label:'Sakit',val:totSakit,color:'#64b4ff',icon:'kit-medical'},
  ];
  panel.innerHTML=`
    <div class="kpi-grid">
      ${kpis.map(k=>`
        <div class="glass-card kpi-card">
          <div class="kpi-label">${k.label}</div>
          <div class="kpi-val" style="color:${k.color};font-size:1.5rem">${k.val}</div>
          <div class="kpi-sub">dari ${total6} hari-orang</div>
          <div class="kpi-icon" style="background:${k.color}18;color:${k.color}"><i class="fas fa-${k.icon}"></i></div>
        </div>
      `).join('')}
    </div>
    <div class="glass-card card-pad">
      <div class="sec-header"><div class="sec-title"><span class="dot"></span>% Kehadiran Minggu Ini</div></div>
      <div style="font-family:'Sora',sans-serif;font-size:2.2rem;font-weight:800;color:${pctHdr>=90?'#00e8c0':pctHdr>=75?'#f0c040':'#ff6b8a'}">${pctHdr}%</div>
      <div class="prog-bar" style="height:8px;margin-top:10px"><div class="prog-fill" style="width:${pctHdr}%;background:${pctHdr>=90?'#00e8c0':pctHdr>=75?'#f0c040':'#ff6b8a'}"></div></div>
      <div style="font-size:.72rem;color:var(--tm);margin-top:6px">${employees.length} karyawan · 6 hari kerja</div>
    </div>`;
}

function bindEvents(employees){
  document.getElementById('prevWeek')?.addEventListener('click',()=>{
    currentWeekStart.setDate(currentWeekStart.getDate()-7);
    renderTable(employees);
  });
  document.getElementById('nextWeek')?.addEventListener('click',()=>{
    const next=new Date(currentWeekStart);
    next.setDate(next.getDate()+7);
    if(next<=new Date()) currentWeekStart=next;
    renderTable(employees);
  });
  document.getElementById('todayWeek')?.addEventListener('click',()=>{
    currentWeekStart=getWeekStart(new Date());
    renderTable(employees);
  });
  document.getElementById('filterDivisi')?.addEventListener('change',e=>{
    filterDivisi=e.target.value;
    renderTable(employees);
  });
  document.getElementById('filterStatus')?.addEventListener('change',e=>{
    filterStatus=e.target.value;
    renderTable(employees);
  });
  document.getElementById('saveAbsensi')?.addEventListener('click',()=>{
    showToast('Absensi tersimpan otomatis ✓','success');
  });
  document.getElementById('exportAbsensi')?.addEventListener('click',()=>exportCSV(employees));
}

function exportCSV(employees){
  const fridayKey=fmtKey(currentWeekStart);
  const stored=loadAbsensi(fridayKey);
  const dates=getWeekDates(currentWeekStart);
  const header=['Nama','NIK','Divisi','Status',...DAY_NAMES.map((d,i)=>d+' '+fmtDate(dates[i])),'Hadir','Alpha','%'];
  const rows=employees.map(e=>{
    const rec=stored[e.id]||{};
    const dayKeys=['jmt','sbt','ahd','snn','sls','rab','kms'];
    const vals=dayKeys.map((dk,i)=>rec[dk]||(i===2?'-':'H'));
    const hadir=vals.filter(v=>v==='H'||v==='L').length;
    const alpha=vals.filter(v=>v==='A').length;
    const pct=Math.round(hadir/6*100);
    return [e.nama,e.nik,e.divisi,e.status,...vals,hadir,alpha,pct+'%'];
  });
  const csv=[header,...rows].map(r=>r.join(',')).join('\n');
  const a=document.createElement('a');
  a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8;'}));
  a.download=`Absensi_${fridayKey}.csv`;
  a.click();
  showToast('Export CSV berhasil','success');
}


/* ── js/pages/performa.js ── */
function renderPerforma() {
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
      <div class="grid-2" style="margin-bottom:18px">
        ${[
          { label: 'Avg. Performa', value: `${avgPerforma}%`, color: 'var(--ac)', icon: 'chart-line' },
          { label: 'Karyawan Excellent (≥90%)', value: excellent, color: 'var(--as)', icon: 'star' },
          { label: 'Perlu Pembinaan (<75%)', value: perluBinaan, color: 'var(--ar)', icon: 'triangle-exclamation' },
          { label: 'Total Dievaluasi', value: employees.length, color: 'var(--ap)', icon: 'users' }
        ].map(k => `
          <div class="glass-card" style="padding:18px; background:${k.color}07">
            <div style="display:flex; justify-content:space-between; margin-bottom:10px">
              <div style="font-size:0.62rem; font-weight:700; text-transform:uppercase">${k.label}</div>
              <div style="width:30px; height:30px; background:${k.color}18; border-radius:var(--rad-sm); display:flex; align-items:center; justify-content:center; color:${k.color}"><i class="fas fa-${k.icon}"></i></div>
            </div>
            <div style="font-family:'Sora',sans-serif; font-size:1.6rem; font-weight:800; color:${k.color}">${k.value}</div>
          </div>
        `).join('')}
      </div>
      
      <div style="margin-bottom:18px">
        <div class="sec-header"><div class="sec-title"><span class="dot" style="background:var(--ag)"></span> Top Performer</div></div>
        <div class="grid-auto" style="gap:14px">
          ${top3.map((e, i) => {
            const medals = ['🥇', '🥈', '🥉'];
            const medalColors = ['var(--ag)', '#b0b8c0', '#cd7f32'];
            return `
              <div class="glass-card card-padding" style="text-align:center; position:relative">
                <div style="position:absolute; top:0; left:0; right:0; height:3px; background:${medalColors[i]}; opacity:0.7"></div>
                <div style="font-size:1.8rem">${medals[i]}</div>
                <div class="avatar" style="width:50px; height:50px; font-size:1.1rem; background:${getAvatarColor(e.nama)}; border-radius:var(--rad-lg); margin:0 auto 10px; display:flex; align-items:center; justify-content:center; color:#fff">${e.nama.charAt(0)}</div>
                <div style="font-weight:700">${e.nama}</div>
                <div style="font-size:0.7rem; color:var(--tm)">${e.jabatan} · ${e.divisi}</div>
                <div style="font-family:'Sora',sans-serif; font-size:1.5rem; font-weight:800; color:${medalColors[i]}">${e.performance}%</div>
                <div class="prog-bar" style="margin-top:8px"><div class="prog-fill" style="width:${e.performance}%; background:${medalColors[i]}"></div></div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
      
      <div class="glass-card">
        <div class="card-pad" style="border-bottom:1px solid var(--b2)">
          <div class="sec-title"><span class="dot"></span> Evaluasi Seluruh Karyawan</div>
        </div>
        <div class="tbl-wrap">
          <table class="data-table">
            <thead><tr><th style="padding-left:18px">Rank</th><th>Karyawan</th><th>Divisi</th><th>Skor Performa</th><th>Rate Kehadiran</th><th>Masa Kerja</th><th>Status KPI</th></tr></thead>
            <tbody>
              ${sorted.map((e, i) => {
                const perf = e.performance || 0;
                const color = perf >= 90 ? 'var(--as)' : perf >= 80 ? 'var(--ac)' : perf >= 70 ? 'var(--ag)' : 'var(--ar)';
                const label = perf >= 90 ? 'Excellent' : perf >= 80 ? 'Baik' : perf >= 70 ? 'Cukup' : 'Perlu Pembinaan';
                const badgeClass = perf >= 90 ? 'badge-success' : perf >= 80 ? 'badge-info' : perf >= 70 ? 'badge-warning' : 'badge-danger';
                return `
                  <tr>
                    <td style="padding-left:18px; font-family:'Sora'; font-weight:800; color:${i<3 ? 'var(--ag)' : 'var(--tm)'}">${i+1}</td>
                    <td><div style="display:flex; align-items:center; gap:10px"><div class="avatar" style="width:34px; height:34px; background:${getAvatarColor(e.nama)}; border-radius:var(--rad-sm); display:flex; align-items:center; justify-content:center; color:#fff">${e.nama.charAt(0)}</div><div><div style="font-weight:600">${e.nama}</div><div style="font-size:0.65rem">${e.jabatan}</div></div></div></td>
                    <td><span style="background:${getDivisiColor(e.divisi)}18; color:${getDivisiColor(e.divisi)}; padding:3px 8px; border-radius:20px; font-size:0.62rem; font-weight:700">${e.divisi}</span></td>
                    <td><div style="display:flex; align-items:center; gap:8px"><div class="prog-bar" style="width:80px"><div class="prog-fill" style="width:${perf}%; background:${color}"></div></div><span style="font-weight:700; color:${color}">${perf}%</span></div></td>
                    <td><div class="prog-bar" style="width:52px"><div class="prog-fill" style="width:${e.absensi}%; background:var(--ac)"></div></div> ${e.absensi}%</td>
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

/* ── js/pages/dokumen.js ── */
function renderDokumen() {
  const docs = [
    { icon: 'fa-file-contract', title: 'Kontrak Kerja (PKWT)', desc: 'Template kontrak karyawan kontrak', cat: 'Kontrak', status: 'Aktif', updated: 'Jan 2026', color: 'var(--ac)' },
    { icon: 'fa-file-signature', title: 'Perjanjian Kerja Tetap (PKWTT)', desc: 'Perjanjian karyawan tetap', cat: 'Kontrak', status: 'Aktif', updated: 'Nov 2025', color: 'var(--as)' },
    { icon: 'fa-scroll', title: 'Peraturan Perusahaan', desc: 'Regulasi internal KMSU 2025', cat: 'Regulasi', status: 'Aktif', updated: 'Des 2025', color: 'var(--ap)' },
    { icon: 'fa-certificate', title: 'Surat Pengalaman Kerja', desc: 'Template surat keterangan kerja', cat: 'Sertifikat', status: 'Aktif', updated: 'Feb 2026', color: 'var(--ag)' },
    { icon: 'fa-envelope', title: 'Surat Peringatan (SP)', desc: 'Template SP1, SP2, SP3', cat: 'Disiplin', status: 'Aktif', updated: 'Mar 2026', color: 'var(--ar)' },
    { icon: 'fa-moon', title: 'Pengumuman Hari Libur', desc: 'Template surat cuti & libur', cat: 'Internal', status: 'Aktif', updated: 'Apr 2026', color: 'var(--ao)' },
    { icon: 'fa-clipboard-list', title: 'Form Penilaian Kinerja', desc: 'KPI & evaluasi tahunan', cat: 'Evaluasi', status: 'Draft', updated: 'Mei 2026', color: 'var(--ab)' },
    { icon: 'fa-hand-holding-dollar', title: 'Slip Gaji', desc: 'Rekap payroll bulanan', cat: 'Keuangan', status: 'Aktif', updated: 'Mei 2026', color: 'var(--as)' },
    { icon: 'fa-user-plus', title: 'Formulir Rekrutmen', desc: 'Proses onboarding karyawan baru', cat: 'Rekrutmen', status: 'Aktif', updated: 'Apr 2026', color: 'var(--ap)' },
    { icon: 'fa-building', title: 'Struktur Organisasi', desc: 'Bagan org KMSU 2026', cat: 'Perusahaan', status: 'Aktif', updated: 'Jan 2026', color: 'var(--ac)' },
    { icon: 'fa-shield-halved', title: 'Kebijakan BPJS', desc: 'Panduan BPJS Kes & TK', cat: 'Regulasi', status: 'Aktif', updated: 'Mar 2026', color: 'var(--as)' },
    { icon: 'fa-graduation-cap', title: 'Program Pelatihan', desc: 'Jadwal training & pengembangan SDM', cat: 'Pengembangan', status: 'Draft', updated: 'Mei 2026', color: 'var(--ag)' }
  ];
  const categories = ['Semua', ...new Set(docs.map(d => d.cat))];
  
  const html = `
    <div class="animate-in">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px;flex-wrap:wrap;gap:10px">
        <div style="display:flex;gap:6px;flex-wrap:wrap" id="docTabs">
          ${categories.map(c=>`<button class="doc-tab ${c==='Semua'?'active':''}" data-cat="${c}">${c}</button>`).join('')}
        </div>
        <button class="btn-primary" id="uploadDocBtn"><i class="fas fa-upload"></i><span class="btn-text"> Upload</span></button>
      </div>
      <div class="grid-auto" id="docGrid">
        ${docs.map(d => `
          <div class="glass-card card-padding dok-card" data-cat="${d.cat}" style="cursor:pointer">
            <div style="display:flex; justify-content:space-between; margin-bottom:12px">
              <div style="width:40px; height:40px; background:${d.color}18; border-radius:var(--rad); display:flex; align-items:center; justify-content:center; color:${d.color}; border:1px solid ${d.color}28"><i class="fas ${d.icon}"></i></div>
              <span class="badge ${d.status === 'Aktif' ? 'badge-success' : 'badge-warning'}">${d.status}</span>
            </div>
            <div style="font-weight:700; margin-bottom:4px">${d.title}</div>
            <div style="font-size:0.7rem; color:var(--tm); margin-bottom:12px">${d.desc}</div>
            <div style="display:flex; justify-content:space-between; border-top:1px solid var(--b2); padding-top:10px">
              <span style="font-size:0.62rem; background:${d.color}14; color:${d.color}; padding:2px 7px; border-radius:20px">${d.cat}</span>
              <span style="font-size:0.62rem; color:var(--tm)">Diperbarui ${d.updated}</span>
            </div>
            <div style="display:flex; gap:6px; margin-top:10px">
              <button class="btn-secondary" style="flex:1; justify-content:center; font-size:0.7rem; padding:6px 0" data-download="${d.title}"><i class="fas fa-download"></i> Unduh</button>
              <button class="btn-secondary" style="font-size:0.7rem; padding:6px 10px" data-edit="${d.title}"><i class="fas fa-pen"></i></button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
  
  document.getElementById('pageContainer').innerHTML = html;
  
  // Tab filtering
  document.querySelectorAll('#docTabs .doc-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('#docTabs .doc-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const cat = tab.dataset.cat;
      document.querySelectorAll('.dok-card').forEach(card => {
        card.style.display = (cat === 'Semua' || card.dataset.cat === cat) ? 'block' : 'none';
      });
    });
  });
  
  document.getElementById('uploadDocBtn')?.addEventListener('click', () => showToast('Fitur upload dokumen segera hadir', 'info'));
  document.querySelectorAll('[data-download]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      showToast(`Mengunduh ${btn.dataset.download}...`, 'success');
    });
  });
  document.querySelectorAll('[data-edit]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      showToast(`Edit dokumen ${btn.dataset.edit} akan segera hadir`, 'info');
    });
  });
}


/* ── js/pages/pengaturan.js ── */
function renderPengaturan() {
  const employees = getEmployees();
  const totalGaji = employees.reduce((s, e) => s + e.gaji, 0);
  const totalTetap = employees.filter(e => e.status === 'Tetap').length;
  const uniqueDivisi = new Set(employees.map(e => e.divisi)).size;
  
  const html = `
    <div class="row-2col-equal animate-in">
      <div class="glass-card card-padding">
        <div class="sec-title" style="margin-bottom:18px"><span class="dot"></span> Profil Perusahaan</div>
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
          <div class="sec-title" style="margin-bottom:15px"><span class="dot" style="background:var(--ap)"></span> Data & Ekspor</div>
          <button class="btn-secondary" id="csvExportSetting" style="justify-content:flex-start; gap:11px; width:100%; margin-bottom:9px"><i class="fas fa-download" style="color:var(--as)"></i> Export Data CSV</button>
          <button class="btn-secondary" id="jsonExportSetting" style="justify-content:flex-start; gap:11px; width:100%; margin-bottom:9px"><i class="fas fa-code" style="color:var(--ac)"></i> Export Data JSON</button>
          <button class="btn-secondary" id="resetDataBtn" style="justify-content:flex-start; gap:11px; width:100%"><i class="fas fa-rotate-left" style="color:var(--ar)"></i> Reset ke Data Default</button>
        </div>
        <div class="glass-card card-padding">
          <div class="sec-title" style="margin-bottom:15px"><span class="dot" style="background:var(--ag)"></span> Tampilan & Preferensi</div>
          <div style="display:flex; justify-content:space-between; align-items:center; background:var(--s3); border-radius:var(--rad); padding:11px; margin-bottom:10px">
            <div><div style="font-weight:500">Mode Tampilan</div><div style="font-size:0.67rem; color:var(--tm)">Gelap / Terang</div></div>
            <button class="btn-secondary" id="themeSettingBtn"><i class="fas fa-circle-half-stroke"></i> Toggle</button>
          </div>
          <div style="background:var(--s3); border-radius:var(--rad); padding:11px; margin-bottom:9px">
            <div style="font-size:0.6rem; text-transform:uppercase; color:var(--tm); margin-bottom:4px">Versi Sistem</div>
            <div style="font-family:'JetBrains Mono'; font-size:0.78rem; color:var(--ts)">KMSU HRIS v4.1 · <span style="color:var(--as)">● Aktif</span></div>
          </div>
          <div style="background:var(--s3); border-radius:var(--rad); padding:11px">
            <div style="font-size:0.6rem; text-transform:uppercase; color:var(--tm); margin-bottom:4px">Penyimpanan</div>
            <div style="font-size:0.78rem; color:var(--ts)"><i class="fas fa-database" style="color:var(--ac); margin-right:7px"></i>localStorage · Lokal Browser</div>
          </div>
        </div>
        <div class="glass-card card-padding">
          <div class="sec-title" style="margin-bottom:15px"><span class="dot" style="background:var(--ac)"></span> Statistik Sistem</div>
          ${[
            ['Total Karyawan', employees.length, 'var(--ac)'],
            ['Karyawan Tetap', totalTetap, 'var(--as)'],
            ['Divisi', uniqueDivisi, 'var(--ap)'],
            ['Total Payroll', formatRupiah(totalGaji), 'var(--ag)']
          ].map(([l, v, c]) => `
            <div style="display:flex; justify-content:space-between; background:var(--s3); border-radius:var(--rad); padding:9px 11px; margin-bottom:7px">
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
      renderCurrentPage();
    }
  });
  document.getElementById('themeSettingBtn')?.addEventListener('click', toggleTheme);
  document.getElementById('saveCompanyBtn')?.addEventListener('click', () => showToast('Perubahan perusahaan disimpan (simulasi)', 'success'));
}


/* ── js/modules/export.js ── */
function downloadBlob(content, fileName, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
}

function exportToCSV() {
  const employees = getEmployees();
  const headers = ['ID', 'NIK', 'Nama', 'Jabatan', 'Divisi', 'Status', 'Gender', 'Gaji', 'Bergabung', 'Email', 'Telepon', 'Performa', 'Absensi'];
  const rows = employees.map(e => [
    e.id, e.nik, e.nama, e.jabatan, e.divisi, e.status, e.gender, e.gaji, e.joinDate, e.email || '', e.phone || '', e.performance || 0, e.absensi || 0
  ]);
  const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
  downloadBlob(csvContent, 'KMSU_Karyawan.csv', 'text/csv;charset=utf-8;');
  showToast('Export CSV berhasil', 'success');
}

function exportToJSON() {
  const employees = getEmployees();
  const jsonContent = JSON.stringify(employees, null, 2);
  downloadBlob(jsonContent, 'KMSU_Karyawan.json', 'application/json');
  showToast('Export JSON berhasil', 'success');
}


/* ── js/modules/theme.js ── */
function toggleTheme() {
  document.body.classList.toggle('light');
  const isLight = document.body.classList.contains('light');
  localStorage.setItem('kmsu_theme', isLight ? 'light' : 'dark');
  showToast(isLight ? 'Mode terang aktif' : 'Mode gelap aktif', 'info');
}

function initTheme() {
  const savedTheme = localStorage.getItem('kmsu_theme');
  if (savedTheme === 'light') {
    document.body.classList.add('light');
  }
  document.getElementById('themeToggle')?.addEventListener('click', toggleTheme);
}


/* ── js/modules/ui-helpers.js ── */
function initGlobalSearch() {
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

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('open');
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.add('open');
}

// Attach modal close listeners to all [data-close]
function initModalClosers() {
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


/* ── js/modules/forms.js ── */
function openEmployeeModal(employee = null) {
  const modal = document.getElementById('employeeModal');
  const title = document.getElementById('modalTitle');
  const form = document.getElementById('employeeForm');
  form.reset();
  document.getElementById('empId').value = '';

  if (employee) {
    title.textContent = 'Edit Data Karyawan';
    document.getElementById('empId').value = employee.id;
    document.getElementById('nik').value = employee.nik || '';
    document.getElementById('fullName').value = employee.nama || '';
    document.getElementById('jabatan').value = employee.jabatan || '';
    document.getElementById('divisi').value = employee.divisi || 'Produksi';
    document.getElementById('status').value = employee.status || 'Tetap';
    document.getElementById('gender').value = employee.gender || 'L';
    document.getElementById('gaji').value = employee.gaji || 0;
    document.getElementById('birthDate').value = employee.birthDate || '';
    document.getElementById('joinDate').value = employee.joinDate || '';
    document.getElementById('phone').value = employee.phone || '';
    document.getElementById('email').value = employee.email || '';
  } else {
    title.textContent = 'Tambah Karyawan Baru';
  }
  modal.classList.add('open');
}

function initFormHandler() {
  const form = document.getElementById('employeeForm');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('empId').value;
    const employeeData = {
      nik: document.getElementById('nik').value.trim(),
      nama: document.getElementById('fullName').value.trim(),
      jabatan: document.getElementById('jabatan').value.trim(),
      divisi: document.getElementById('divisi').value,
      status: document.getElementById('status').value,
      gender: document.getElementById('gender').value,
      gaji: parseInt(document.getElementById('gaji').value) || 0,
      birthDate: document.getElementById('birthDate').value,
      joinDate: document.getElementById('joinDate').value || new Date().toISOString().split('T')[0],
      phone: document.getElementById('phone').value.trim(),
      email: document.getElementById('email').value.trim()
    };

    if (id) {
      updateEmployee(parseInt(id), employeeData);
      showToast(`${employeeData.nama} berhasil diperbarui`, 'success');
    } else {
      // check duplicate NIK
      const existing = getEmployees().find(emp => emp.nik === employeeData.nik);
      if (existing) {
        showToast('NIK sudah terdaftar!', 'error');
        return;
      }
      addEmployee(employeeData);
      showToast(`${employeeData.nama} berhasil ditambahkan`, 'success');
    }
    closeModal('employeeModal');
    renderCurrentPage();
  });

  // attach close buttons
  document.querySelectorAll('[data-close="employeeModal"]').forEach(btn => {
    btn.addEventListener('click', () => closeModal('employeeModal'));
  });
}


/* ── js/modules/navigation.js ── */
var pageRenderers = {
  dashboard: renderDashboard,
  karyawan: renderKaryawan,
  statistik: renderStatistik,
  penggajian: renderPenggajian,
  absensi: renderAbsensi,
  performa: renderPerforma,
  dokumen: renderDokumen,
  pengaturan: renderPengaturan
};

function navigateTo(page) {
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

function renderCurrentPage() {
  const { currentPage } = getState();
  const renderFn = pageRenderers[currentPage];
  if (renderFn) renderFn();
}

function initNavigation() {
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


/* ── js/app.js ── */
function initApp() {
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


if(document.readyState==="loading"){
  document.addEventListener("DOMContentLoaded",initApp);
}else{
  initApp();
}
