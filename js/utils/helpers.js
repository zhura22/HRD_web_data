// ========== FORMATTING ==========
export function formatRupiah(number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
}

export function formatDate(dateStr) {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function tenure(joinDate) {
  if (!joinDate) return '-';
  const ms = Date.now() - new Date(joinDate);
  const years = Math.floor(ms / (365.25 * 86400000));
  const months = Math.floor((ms % (365.25 * 86400000)) / (30.44 * 86400000));
  return years > 0 ? `${years} th ${months} bl` : `${months} bulan`;
}

export function ageFromBirth(birthDate) {
  if (!birthDate) return '-';
  const age = Math.floor((Date.now() - new Date(birthDate)) / (365.25 * 86400000));
  return `${age} th`;
}

// ========== TOAST ==========
export function showToast(message, type = 'info') {
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
export function getAvatarColor(name) {
  const colors = ['#00a0cc', '#00a882', '#c07800', '#8050d0', '#cc3060', '#0068b8', '#d05c20', '#007070'];
  let sum = 0;
  for (let i = 0; i < name.length; i++) sum += name.charCodeAt(i);
  return colors[sum % colors.length];
}

export function getDivisiColor(divisi) {
  const colors = {
    Produksi: '#00c8f0', HRD: '#a78bfa', Keuangan: '#f0c040', Gudang: '#64b4ff',
    QC: '#ff9d4a', Marketing: '#ff6b8a', IT: '#00e8c0', Administrasi: '#94a3b8', Direksi: '#ffd700'
  };
  return colors[divisi] || '#7a9ab8';
}

// ========== DETAIL & SLIP MODAL ==========
export async function showEmployeeDetail(emp) {
  const { formatRupiah, formatDate, tenure, ageFromBirth, getAvatarColor, getDivisiColor } = await import('./helpers.js');
  const tj = Math.round(emp.gaji * 0.15);
  const thp = emp.gaji + tj - Math.round(emp.gaji * 0.03);
  const modal = document.getElementById('detailModal');
  const content = document.getElementById('detailContent');
  if (!modal || !content) return;
  content.innerHTML = `
    <div class="modal-header"><div class="modal-title">Detail Karyawan</div><i class="fas fa-times modal-close" data-close="detailModal"></i></div>
    <div style="display:flex; align-items:center; gap:14px; padding:14px; background:var(--s3); border-radius:var(--radius-lg); margin-bottom:16px">
      <div class="avatar" style="width:54px; height:54px; background:${getAvatarColor(emp.nama)}; border-radius:var(--radius-md); display:flex; align-items:center; justify-content:center; font-size:1.2rem; color:#fff">${emp.nama.charAt(0)}</div>
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
    import('../modules/forms.js').then(m => m.openEmployeeModal(emp));
  });
  document.querySelectorAll('[data-close="detailModal"]').forEach(btn => {
    btn.addEventListener('click', () => modal.classList.remove('open'));
  });
}

export async function showSlipModal(emp) {
  const { formatRupiah, getAvatarColor } = await import('./helpers.js');
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
    <div style="padding:20px; background:var(--s3); border-radius:var(--radius-lg); border:1px solid var(--b1)">
      <div style="text-align:center; margin-bottom:16px">
        <div style="font-family:'Sora',sans-serif; font-size:0.6rem; font-weight:700; letter-spacing:3px; text-transform:uppercase">UD. Karya Muda Surya Utama</div>
        <div style="font-size:0.63rem; color:var(--tm)">Jawa Tengah, Indonesia</div>
        <div style="width:40px; height:2px; background:linear-gradient(90deg,var(--ac),var(--as)); margin:10px auto"></div>
        <div style="font-size:0.68rem; font-weight:600">SLIP GAJI · ${bulan.toUpperCase()}</div>
      </div>
      <div style="display:flex; align-items:center; gap:11px; padding:11px; background:var(--s2); border-radius:var(--radius-md); margin-bottom:14px">
        <div class="avatar" style="width:38px; height:38px; background:${getAvatarColor(emp.nama)}; border-radius:var(--radius-sm); display:flex; align-items:center; justify-content:center; color:#fff">${emp.nama.charAt(0)}</div>
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