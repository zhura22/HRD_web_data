import { getEmployees } from '../core/data.js';
import { showToast } from '../utils/helpers.js';
import { getDivisiColor } from '../utils/helpers.js';

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
let currentWeekStart = getWeekStart(new Date());
let filterDivisi = 'Semua';
let filterStatus = 'Semua';

export function renderAbsensi(){
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
    <div style="display:flex;gap:10px;align-items:center;margin-bottom:14px;flex-wrap:wrap">
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
    <div class="kpi-grid" style="grid-template-columns:repeat(4,1fr)">
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
