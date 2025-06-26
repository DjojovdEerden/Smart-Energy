let energyData = [];
let solarChart, powerChart, tempChart, batteryCO2Chart;


// Make additional functions available to components.js
window.fetchCSVData = fetchCSVData;
window.updateCharts = updateCharts;
window.createCharts = createCharts; // Export createCharts for direct access

// CSV-string in array van objecten omzetten
function parseCSV(data) {
  const lines = data.trim().split('\n');
  // Only use headers up to the last non-empty header
  let headers = lines[0].split(';').map(h => h.trim());
  // Remove trailing empty headers
  while (headers.length && headers[headers.length - 1] === '') {
    headers.pop();
  }
  const rows = lines.slice(1);

  return rows.map(line => {
    const cols = line.split(';');
    const obj = {};
    // Only map columns up to the number of headers
    headers.forEach((header, i) => {
      let val = cols[i];
      if (val === undefined) val = '';
      val = val.replace(',', '.');
      if (!isNaN(val) && val !== '') {
        val = Number(val);
      }
      obj[header] = val;
    });
    return obj;
  });
}

// Initialize chart contexts only if elements exist
function getChartContext(id) {
  const canvas = document.getElementById(id);
  return canvas ? canvas.getContext('2d') : null;
}

// Create all charts
function createCharts() {
  console.log("Creating charts with data points:", energyData.length);
  
  if (!energyData || !energyData.length) {
    console.error("No chart data available");
    return;
  }
  
  if (solarChart) solarChart.destroy();
  if (powerChart) powerChart.destroy();
  if (tempChart) tempChart.destroy();
  if (batteryCO2Chart) batteryCO2Chart.destroy();
  
  const solarCtx = getChartContext('solarChart');
  const powerCtx = getChartContext('powerChart');
  const tempCtx = getChartContext('tempChart');
  const batteryCO2Ctx = getChartContext('batteryCO2Chart');

  // Solar Panel: Line (voltage) + Area (current)
  if (solarCtx && isWidgetVisible('solarWidget')) {
    try {
      const labels = energyData.map(row => row['Tijdstip']);
      const voltage = energyData.map(row => parseFloat(row['Zonnepaneelspanning (V)']));
      const current = energyData.map(row => parseFloat(row['Zonnepaneelstroom (A)']));
      solarChart = new Chart(solarCtx, {
        type: 'line',
        data: {
          labels,
          datasets: [
            {
              label: 'Zonnepaneelspanning (V)',
              data: voltage,
              borderColor: '#3a86ff',
              backgroundColor: 'rgba(58, 134, 255, 0.1)',
              borderWidth: 2,
              fill: false,
              tension: 0.3
            },
            {
              label: 'Zonnepaneelstroom (A)',
              data: current,
              borderColor: '#ff006e',
              backgroundColor: 'rgba(255, 0, 110, 0.2)',
              borderWidth: 2,
              fill: true,
              tension: 0.3
            },
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'top' } },
          scales: {
            x: { title: { display: true, text: 'Tijd' } },
            y: { beginAtZero: true }
          }
        }
      });
    } catch (error) {
      console.error("Error creating solar chart:", error);
    }
  }

  // Power Consumption: Mixed Bar (consumption) + Line (hydrogen)
  if (powerCtx && isWidgetVisible('powerWidget')) {
    try {
      const labels = energyData.map(row => row['Tijdstip']);
      const power = energyData.map(row => row['Stroomverbruik woning (kW)']);
      const hydrogen = energyData.map(row => row['Waterstofproductie (L/u)']);
      powerChart = new Chart(powerCtx, {
        type: 'bar',
        data: {
          labels,
          datasets: [
            {
              type: 'bar',
              label: 'Stroomverbruik woning (kW)',
              data: power,
              backgroundColor: 'rgba(255, 206, 86, 0.7)',
              borderColor: 'rgba(255, 206, 86, 1)',
              borderWidth: 1
            },
            {
              type: 'line',
              label: 'Waterstofproductie (L/u)',
              data: hydrogen,
              borderColor: 'rgb(75, 192, 192)',
              backgroundColor: 'rgba(75, 192, 192, 0.1)',
              borderWidth: 2,
              fill: false,
              tension: 0.3,
              yAxisID: 'y1'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'top' } },
          scales: {
            x: { title: { display: true, text: 'Tijd' } },
            y: { beginAtZero: true, position: 'left', title: { display: true, text: 'kW' } },
            y1: {
              beginAtZero: true,
              position: 'right',
              grid: { drawOnChartArea: false },
              title: { display: true, text: 'L/u' }
            }
          }
        }
      });
    } catch (error) {
      console.error("Error creating power chart:", error);
    }
  }

  // Temperature: Dual smooth lines with gradient
  if (tempCtx && isWidgetVisible('tempWidget')) {
    try {
      const labels = energyData.map(row => row['Tijdstip']);
      const buiten = energyData.map(row => row['Buitentemperatuur (°C)']);
      const binnen = energyData.map(row => row['Binnentemperatuur (°C)']);
      tempChart = new Chart(tempCtx, {
        type: 'line',
        data: {
          labels,
          datasets: [
            {
              label: 'Buitentemperatuur (°C)',
              data: buiten,
              borderColor: 'rgb(153, 102, 255)',
              backgroundColor: getGradient(tempCtx, 'rgb(153, 102, 255)'),
              borderWidth: 2,
              fill: true,
              tension: 0.4
            },
            {
              label: 'Binnentemperatuur (°C)',
              data: binnen,
              borderColor: 'rgb(255, 159, 64)',
              backgroundColor: getGradient(tempCtx, 'rgb(255, 159, 64)'),
              borderWidth: 2,
              fill: true,
              tension: 0.4
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'top' } },
          scales: {
            x: { title: { display: true, text: 'Tijd' } },
            y: { beginAtZero: false, title: { display: true, text: '°C' } }
          }
        }
      });
    } catch (error) {
      console.error("Error creating temp chart:", error);
    }
  }

  // Battery: Doughnut for latest value, CO2: Line
  if (batteryCO2Ctx && isWidgetVisible('batteryCO2Widget')) {
    try {
      const labels = energyData.map(row => row['Tijdstip']);
      const battery = energyData.map(row => row['Accuniveau (%)']);
      const co2 = energyData.map(row => row['CO2-concentratie binnen (ppm)']);
      // Battery as doughnut (latest value)
      const latestBattery = battery[battery.length - 1];
      batteryCO2Chart = new Chart(batteryCO2Ctx, {
        type: 'doughnut',
        data: {
          labels: ['Accuniveau (%)', 'Leeg'],
          datasets: [{
            data: [latestBattery, 100 - latestBattery],
            backgroundColor: ['#38b000', '#e0e0e0'],
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '70%',
          plugins: {
            legend: { position: 'top' },
            title: {
              display: true,
              text: `Accuniveau: ${latestBattery}%`
            }
          }
        }
      });
      // Overlay CO2 as a line chart (separate canvas recommended, but here as a quick overlay)
      // If you want both in one, use a mixed chart, but for clarity, doughnut is for battery only.
    } catch (error) {
      console.error("Error creating battery/CO2 chart:", error);
    }
  }
}

// Helper for gradient fill
function getGradient(ctx, color) {
  const chartArea = ctx.canvas;
  const gradient = ctx.createLinearGradient(0, 0, 0, chartArea.height);
  gradient.addColorStop(0, color.replace(')', ',0.4)').replace('rgb', 'rgba'));
  gradient.addColorStop(1, color.replace(')', ',0)').replace('rgb', 'rgba'));
  return gradient;
}

// Improved check for widget visibility
function isWidgetVisible(widgetId) {
  const widget = document.getElementById(widgetId);
  if (!widget) return false;
  
  const style = window.getComputedStyle(widget);
  return style.display !== 'none';
}

// Update existing charts with new data
function updateCharts() {
  console.log("Updating charts");
  if (!energyData.length) return;
  
  const labels = energyData.map(d => d['Tijdstip']);

  // Update only if chart exists and widget is visible
  if (solarChart && isWidgetVisible('solarWidget')) {
    solarChart.data.labels = labels;
    solarChart.data.datasets[0].data = energyData.map(d => d['Zonnepaneelspanning (V)']);
    solarChart.data.datasets[1].data = energyData.map(d => d['Zonnepaneelstroom (A)']);
    solarChart.update();
  }
  
  // Update other charts similarly
  if (powerChart && isWidgetVisible('powerWidget')) {
    powerChart.data.labels = labels;
    powerChart.data.datasets[0].data = energyData.map(d => d['Stroomverbruik woning (kW)']);
    powerChart.data.datasets[1].data = energyData.map(d => d['Waterstofproductie (L/u)']);
    powerChart.update();
  }
  
  if (tempChart && isWidgetVisible('tempWidget')) {
    tempChart.data.labels = labels;
    tempChart.data.datasets[0].data = energyData.map(d => d['Buitentemperatuur (°C)']);
    tempChart.data.datasets[1].data = energyData.map(d => d['Binnentemperatuur (°C)']);
    tempChart.update();
  }
  
  if (batteryCO2Chart && isWidgetVisible('batteryCO2Widget')) {
    // Only update the doughnut (battery) dataset
    const battery = energyData.map(d => d['Accuniveau (%)']);
    const latestBattery = battery[battery.length - 1];
    batteryCO2Chart.data.datasets[0].data = [latestBattery, 100 - latestBattery];
    batteryCO2Chart.options.plugins.title.text = `Accuniveau: ${latestBattery}%`;
    batteryCO2Chart.update();
  }
}

// Fetch data and initialize/update charts
async function fetchCSVData() {
  try {
    const refreshBtn = document.getElementById('refreshBtn');
    if (refreshBtn) {
      refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Laden...';
      refreshBtn.disabled = true;
    }
    
    // For demo purposes, use a sample CSV URL
    const response = await fetch('data/energy.csv'); 
    if (!response.ok) throw new Error('Failed to load CSV data');
    
    const text = await response.text();
    energyData = parseCSV(text);
    
    console.log("Data loaded:", energyData.length, "data points");
    console.log("Sample data point:", energyData[0]);
    
    // Force chart recreation instead of trying to update
    setTimeout(createCharts, 200);
    
    if (refreshBtn) {
      refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Gegevens Vernieuwen';
      refreshBtn.disabled = false;
    }
  } catch (error) {
    console.error('Error loading data:', error);
    
    const refreshBtn = document.getElementById('refreshBtn');
    if (refreshBtn) {
      refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Opnieuw Proberen';
      refreshBtn.disabled = false;
    }
  }
}

// Add Refresh button event listener when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  const refreshBtn = document.getElementById('refreshBtn');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', fetchCSVData);
  }
  // Initial data load for charts
  fetchCSVData();
});