import { showToast } from '../utils/helpers.js';

export function renderDokumen() {
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
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:18px; flex-wrap:wrap; gap:10px">
        <div class="tabs" id="docTabs">
          ${categories.map(c => `<div class="tab ${c === 'Semua' ? 'active' : ''}" data-cat="${c}">${c}</div>`).join('')}
        </div>
        <button class="btn-primary" id="uploadDocBtn"><i class="fas fa-upload"></i> Upload Dokumen</button>
      </div>
      <div class="row-3col" id="docGrid" style="gap:15px">
        ${docs.map(d => `
          <div class="glass-card card-padding dok-card" data-cat="${d.cat}" style="cursor:pointer">
            <div style="display:flex; justify-content:space-between; margin-bottom:12px">
              <div style="width:40px; height:40px; background:${d.color}18; border-radius:var(--radius-md); display:flex; align-items:center; justify-content:center; color:${d.color}; border:1px solid ${d.color}28"><i class="fas ${d.icon}"></i></div>
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
  document.querySelectorAll('#docTabs .tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('#docTabs .tab').forEach(t => t.classList.remove('active'));
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