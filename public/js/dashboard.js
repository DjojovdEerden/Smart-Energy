let energyData = [];
let solarChart, powerChart, tempChart, batteryCO2Chart;
let solarChart2;


// Make additional functions available to components.js
window.fetchCSVData = fetchCSVData;
window.updateCharts = updateCharts;
window.createCharts = createCharts; // Export createCharts for direct access
window.createSolar2Chart = createSolar2Chart;

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
  
  // Safety check for data
  if (!energyData || !energyData.length) {
    console.error("No chart data available");
    return;
  }
  
  // Destroy existing charts to prevent duplicates
  if (solarChart) solarChart.destroy();
  if (powerChart) powerChart.destroy();
  if (tempChart) tempChart.destroy();
  if (batteryCO2Chart) batteryCO2Chart.destroy();
  if (solarChart2) solarChart2.destroy();
  
  // Get fresh contexts
  const solarCtx = getChartContext('solarChart');
  const powerCtx = getChartContext('powerChart');
  const tempCtx = getChartContext('tempChart');
  const batteryCO2Ctx = getChartContext('batteryCO2Chart');
  const solar2Ctx = getChartContext('solarChart2');
  
  // Debug contexts
  console.log("Chart contexts available:", {
    solar: !!solarCtx,
    power: !!powerCtx,
    temp: !!tempCtx,
    batteryCO2: !!batteryCO2Ctx,
    solar2: !!solar2Ctx
  });
  
  console.log("Widget visibility:", {
    solar: isWidgetVisible('solarWidget'),
    power: isWidgetVisible('powerWidget'),
    temp: isWidgetVisible('tempWidget'),
    batteryCO2: isWidgetVisible('batteryCO2Widget'),
    solar2: isWidgetVisible('solar2Widget')
  });

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { title: { display: true, text: 'Tijd' } },
      y: { beginAtZero: true }
    }
  };

  // Only create charts for visible widgets with valid contexts
  if (solarCtx && isWidgetVisible('solarWidget')) {
    try {
        const labels = energyData.map(row => row['Tijdstip']);
        const voltage = energyData.map(row => parseFloat(row['Zonnepaneelspanning (V)']));
        const current = energyData.map(row => parseFloat(row['Zonnepaneelstroom (A)']));
      solarChart = new Chart(solarCtx, {

        type: 'line',
        data: {
          labels: energyData.map(d => d['Tijdstip']),
          datasets: [
            {
              label: 'Zonnepaneelspanning(V)',
              data: voltage,
              borderColor: '#3a86ff',
              backgroundColor: 'rgba(255, 99, 132, 0.1)',
              borderWidth: 2,
              fill: true,
              tension: 0.2
            },
            {
              label: 'Zonnepaneelstroom(A)',
              data: current,
              borderColor: '#ff006e',
              backgroundColor: 'rgba(255, 99, 132, 0.1)',
              borderWidth: 2,
              fill: true,
              tension: 0.2
            },
          ]
        },
        options
      });
    } catch (error) {
      console.error("Error creating solar chart:", error);
    }
  }

  // Similar try/catch blocks for other charts
  if (powerCtx && isWidgetVisible('powerWidget')) {
    try {
      powerChart = new Chart(powerCtx, {
        type: 'line',
        data: {
          labels: energyData.map(d => d['Tijdstip']),
          datasets: [
            {
              label: 'Stroomverbruik woning (kW)',
              data: energyData.map(d => d['Stroomverbruik woning (kW)']),
              borderColor: 'rgb(255, 206, 86)',
              backgroundColor: 'rgba(255, 206, 86, 0.1)',
              borderWidth: 2,
              fill: true,
              tension: 0.2
            },
            {
              label: 'Waterstofproductie (L/u)',
              data: energyData.map(d => d['Waterstofproductie (L/u)']),
              borderColor: 'rgb(75, 192, 192)',
              backgroundColor: 'rgba(75, 192, 192, 0.1)',
              borderWidth: 2,
              fill: true,
              tension: 0.2
            }
          ]
        },
        options
      });
    } catch (error) {
      console.error("Error creating power chart:", error);
    }
  }

  if (tempCtx && isWidgetVisible('tempWidget')) {
    try {
      tempChart = new Chart(tempCtx, {
        type: 'line',
        data: {
          labels: energyData.map(d => d['Tijdstip']),
          datasets: [
            {
              label: 'Buitentemperatuur (°C)',
              data: energyData.map(d => d['Buitentemperatuur (°C)']),
              borderColor: 'rgb(153, 102, 255)',
              backgroundColor: 'rgba(153, 102, 255, 0.1)',
              borderWidth: 2,
              fill: true,
              tension: 0.2
            },
            {
              label: 'Binnentemperatuur (°C)',
              data: energyData.map(d => d['Binnentemperatuur (°C)']),
              borderColor: 'rgb(255, 159, 64)',
              backgroundColor: 'rgba(255, 159, 64, 0.1)',
              borderWidth: 2,
              fill: true,
              tension: 0.2
            }
          ]
        },
        options
      });
    } catch (error) {
      console.error("Error creating temp chart:", error);
    }
  }

  if (batteryCO2Ctx && isWidgetVisible('batteryCO2Widget')) {
    try {
      batteryCO2Chart = new Chart(batteryCO2Ctx, {
        type: 'line',
        data: {
          labels: energyData.map(d => d['Tijdstip']),
          datasets: [
            {
              label: 'Accuniveau (%)',
              data: energyData.map(d => d['Accuniveau (%)']),
              borderColor: 'rgb(0, 128, 0)',
              backgroundColor: 'rgba(0, 128, 0, 0.1)',
              borderWidth: 2,
              fill: true,
              tension: 0.2
            },
            {
              label: 'CO2-concentratie binnen (ppm)',
              data: energyData.map(d => d['CO2-concentratie binnen (ppm)']),
              borderColor: 'rgb(128, 0, 0)',
              backgroundColor: 'rgba(128, 0, 0, 0.1)',
              borderWidth: 2,
              fill: true,
              tension: 0.2
            }
          ]
        },
        options
      });
    } catch (error) {
      console.error("Error creating battery/CO2 chart:", error);
    }
  }

  if (solar2Ctx && isWidgetVisible('solar2Widget')) {
    try {
      solar2Chart = new Chart(solar2Ctx, {
        type: 'line',
        data: {
          labels: energyData.map(d => d['Tijdstip']),
          datasets: [
            {
              label: 'Zonnepaneelstroom (A)',
              data: energyData.map(d => d['Zonnepaneelstroom (A)']),
              borderColor: 'rgb(117, 0, 128)',
              backgroundColor: 'rgba(0, 128, 0, 0.1)',
              borderWidth: 2,
              fill: true,
              tension: 0.2
            },
            {
              label: 'Zonnepaneelspanning(V)',
              data: energyData.map(d => d['Zonnepaneelspanning (V)']),
              borderColor: '#3a86ff',
              backgroundColor: 'rgba(255, 99, 132, 0.1)',
              borderWidth: 2,
              fill: true,
              tension: 0.2
            },
          ]
        },
        options
      });
    } catch (error) {
      console.error('Error creating solar2 chart:', error);
    }
  }
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
    batteryCO2Chart.data.labels = labels;
    batteryCO2Chart.data.datasets[0].data = energyData.map(d => d['Accuniveau (%)']);
    batteryCO2Chart.data.datasets[1].data = energyData.map(d => d['CO2-concentratie binnen (ppm)']);
    batteryCO2Chart.update();
  }

  if (solar2Ctx && isWidgetVisible('solar2Widget')) {
    solarChart2.data.labels = labels;
    solarChart2.data.datasets[0].data = energyData.map(d => d['Zonnepaneelspanning (V)']);
    solarChart2.update();
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