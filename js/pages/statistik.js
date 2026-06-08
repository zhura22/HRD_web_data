import { getEmployees } from '../core/data.js';
import { formatRupiah } from '../utils/helpers.js';
import { createChart, destroyCharts } from '../utils/charts.js';

export function renderStatistik() {
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
      <div class="row-2col-equal" style="margin-bottom:18px">
        ${[
          { label: 'Total Karyawan', value: total, color: 'var(--ac)' },
          { label: 'Karyawan Tetap', value: tetap, color: 'var(--as)' },
          { label: 'Karyawan Kontrak', value: kontrak, color: 'var(--ag)' },
          { label: 'Total Divisi', value: divisiLabels.length, color: 'var(--ap)' },
          { label: 'Laki-laki', value: lk, color: 'var(--ab)' },
          { label: 'Perempuan', value: pr, color: 'var(--ar)' }
        ].map(s => `
          <div class="glass-card" style="padding:15px; text-align:center">
            <div style="font-family:'Sora',sans-serif; font-size:1.7rem; font-weight:800; color:${s.color}; letter-spacing:-1px">${s.value}</div>
            <div style="font-size:0.65rem; color:var(--tm); margin-top:4px">${s.label}</div>
          </div>
        `).join('')}
      </div>
      
      <div class="row-2col-equal" style="margin-bottom:18px">
        <div class="glass-card card-padding">
          <div class="section-header"><div class="section-title"><span class="dot"></span> Karyawan per Divisi</div></div>
          <div style="height:230px"><canvas id="divisiBarChart"></canvas></div>
        </div>
        <div class="glass-card card-padding">
          <div class="section-header"><div class="section-title"><span class="dot" style="background:var(--as)"></span> Status vs Gender</div></div>
          <div style="height:100px"><canvas id="statusGenderChart"></canvas></div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-top:12px">
            ${[
              ['Tetap', tetap, 'var(--as)'],
              ['Kontrak', kontrak, 'var(--ag)'],
              ['Laki-laki', lk, 'var(--ab)'],
              ['Perempuan', pr, 'var(--ar)']
            ].map(([l, v, c]) => `
              <div style="padding:10px; background:var(--s3); border-radius:var(--radius-md); text-align:center">
                <div style="font-family:'Sora',sans-serif; font-size:1.3rem; font-weight:800; color:${c}">${v}</div>
                <div style="font-size:0.64rem; color:var(--tm)">${l}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
      
      <div class="row-2col-equal" style="margin-bottom:18px">
        <div class="glass-card card-padding">
          <div class="section-header"><div class="section-title"><span class="dot" style="background:var(--ap)"></span> Tren Headcount 6 Bulan</div></div>
          <div style="height:195px"><canvas id="trendLineChart"></canvas></div>
        </div>
        <div class="glass-card card-padding">
          <div class="section-header"><div class="section-title"><span class="dot" style="background:var(--ag)"></span> Avg. Gaji per Divisi (juta)</div></div>
          <div style="height:195px"><canvas id="avgGajiHorizChart"></canvas></div>
        </div>
      </div>
      
      <div class="row-2col-equal">
        <div class="glass-card card-padding">
          <div class="section-header"><div class="section-title"><span class="dot" style="background:var(--ao)"></span> Distribusi Performa</div></div>
          <div style="height:180px"><canvas id="perfDoughnutChart"></canvas></div>
        </div>
        <div class="glass-card card-padding">
          <div class="section-header"><div class="section-title"><span class="dot" style="background:var(--ac)"></span> Ringkasan per Divisi</div></div>
          ${divisiLabels.map(d => {
            const count = divisiMap[d];
            const pct = Math.round(count / total * 100);
            return `
              <div style="display:flex; align-items:center; gap:10px; margin-bottom:8px">
                <span style="font-size:0.7rem; font-weight:700; color:${getDivisiColor(d)}; width:80px">${d}</span>
                <div class="progress-bar" style="flex:1"><div class="progress-fill" style="width:${pct}%; background:${getDivisiColor(d)}"></div></div>
                <span style="font-size:0.7rem; color:var(--tm); width:44px; text-align:right">${count} (${pct}%)</span>
              </div>
            `;
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
    "Staff"     : "#a78bfa",
  };
  return colors[divisi] || '#7a9ab8';
};
  return colors[divisi] || '#7a9ab8';
};
  return colors[divisi] || '#7a9ab8';
}