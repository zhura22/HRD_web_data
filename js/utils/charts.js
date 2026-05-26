let activeCharts = [];

export function createChart(canvasId, type, labels, data, customOptions = {}) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) {
    console.warn(`Canvas #${canvasId} not found`);
    return null;
  }
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: type !== 'doughnut' && type !== 'pie' ? {
      x: { grid: { color: 'rgba(60,130,200,0.07)' }, ticks: { color: '#7a9ab8' } },
      y: { grid: { color: 'rgba(60,130,200,0.07)' }, ticks: { color: '#7a9ab8' } }
    } : {}
  };
  
  const options = { ...defaultOptions, ...customOptions };
  const dataset = customOptions.dataset || { data: data, backgroundColor: '#00c8f028', borderColor: '#00c8f0', borderWidth: 2 };
  if (!dataset.data) dataset.data = data;
  
  const chartConfig = {
    type,
    data: { labels, datasets: [dataset] },
    options
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

export function destroyCharts() {
  activeCharts.forEach(chart => {
    try { chart.destroy(); } catch(e) {}
  });
  activeCharts = [];
}