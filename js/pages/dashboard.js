import { getEmployees } from '../core/data.js';
import { formatRupiah, getDivisiColor, getAvatarColor } from '../utils/helpers.js';
import { createChart, destroyCharts } from '../utils/charts.js';

export function renderDashboard(){
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
    <div class="kpi-grid" style="margin-bottom:16px">
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

    <div class="grid-2" style="margin-bottom:16px">
      <div class="glass-card card-pad">
        <div class="sec-header">
          <div class="sec-title"><span class="dot"></span>Sebaran per Divisi</div>
          <span style="font-size:.68rem;color:var(--tm)">${Object.keys(byDivisi).length} divisi</span>
        </div>
        <div style="height:220px"><canvas id="chartDivisi"></canvas></div>
      </div>
      <div class="glass-card card-pad">
        <div class="sec-header">
          <div class="sec-title"><span class="dot" style="background:var(--ag)"></span>Status Karyawan</div>
        </div>
        <div style="height:220px"><canvas id="chartStatus"></canvas></div>
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
