document.getElementById('username').textContent = 'Joe Mama';

// CSV-string in array van objecten omzetten
function parseCSV(data) {
  const lines = data.trim().split('\n');
  const headers = lines[0].split(';').map(h => h.trim());
  const rows = lines.slice(1);

  return rows.map(line => {
    const cols = line.split(';');
    const obj = {};
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

let energyData = [];

// Initialize chart contexts only if elements exist
function getChartContext(id) {
  const canvas = document.getElementById(id);
  return canvas ? canvas.getContext('2d') : null;
}

let solarChart, powerChart, tempChart, batteryCO2Chart;
let solarCtx, powerCtx, tempCtx, batteryCO2Ctx;

// Initialize chart contexts after DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  solarCtx = getChartContext('solarChart');
  powerCtx = getChartContext('powerChart');
  tempCtx = getChartContext('tempChart');
  batteryCO2Ctx = getChartContext('batteryCO2Chart');
});

function createCharts() {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { title: { display: true, text: 'Tijd' } },
      y: { beginAtZero: true }
    }
  };

  // Only create charts if their containers are visible and contexts exist
  if (solarCtx && isWidgetVisible('solarWidget')) {
    solarChart = new Chart(solarCtx, {
      type: 'line',
      data: {
        labels: energyData.map(d => d['Tijdstip']),
        datasets: [
          {
            label: 'Zonnepaneelspanning (V)',
            data: energyData.map(d => d['Zonnepaneelspanning (V)']),
            borderColor: 'rgb(255, 99, 132)',
            fill: false,
            tension: 0.2
          },
          {
            label: 'Zonnepaneelstroom (A)',
            data: energyData.map(d => d['Zonnepaneelstroom (A)']),
            borderColor: 'rgb(54, 162, 235)',
            fill: false,
            tension: 0.2
          }
        ]
      },
      options
    });
  }

  if (powerCtx && isWidgetVisible('powerWidget')) {
    powerChart = new Chart(powerCtx, {
      type: 'line',
      data: {
        labels: energyData.map(d => d['Tijdstip']),
        datasets: [
          {
            label: 'Stroomverbruik woning (kW)',
            data: energyData.map(d => d['Stroomverbruik woning (kW)']),
            borderColor: 'rgb(255, 206, 86)',
            fill: false,
            tension: 0.2
          },
          {
            label: 'Waterstofproductie (L/u)',
            data: energyData.map(d => d['Waterstofproductie (L/u)']),
            borderColor: 'rgb(75, 192, 192)',
            fill: false,
            tension: 0.2
          }
        ]
      },
      options
    });
  }

  if (tempCtx && isWidgetVisible('tempWidget')) {
    tempChart = new Chart(tempCtx, {
      type: 'line',
      data: {
        labels: energyData.map(d => d['Tijdstip']),
        datasets: [
          {
            label: 'Buitentemperatuur (°C)',
            data: energyData.map(d => d['Buitentemperatuur (°C)']),
            borderColor: 'rgb(153, 102, 255)',
            fill: false,
            tension: 0.2
          },
          {
            label: 'Binnentemperatuur (°C)',
            data: energyData.map(d => d['Binnentemperatuur (°C)']),
            borderColor: 'rgb(255, 159, 64)',
            fill: false,
            tension: 0.2
          }
        ]
      },
      options
    });
  }

  if (batteryCO2Ctx && isWidgetVisible('batteryCO2Widget')) {
    batteryCO2Chart = new Chart(batteryCO2Ctx, {
      type: 'line',
      data: {
        labels: energyData.map(d => d['Tijdstip']),
        datasets: [
          {
            label: 'Accuniveau (%)',
            data: energyData.map(d => d['Accuniveau (%)']),
            borderColor: 'rgb(0, 128, 0)',
            fill: false,
            tension: 0.2
          },
          {
            label: 'CO2-concentratie binnen (ppm)',
            data: energyData.map(d => d['CO2-concentratie binnen (ppm)']),
            borderColor: 'rgb(128, 0, 0)',
            fill: false,
            tension: 0.2
          }
        ]
      },
      options
    });
  }
}

// Helper function to check if widget is visible
function isWidgetVisible(widgetId) {
  const widget = document.getElementById(widgetId);
  return widget && widget.style.display !== 'none';
}

function updateCharts() {
  const labels = energyData.map(d => d['Tijdstip']);

  const setChart = (chart, keys) => {
    if (!chart) return;
    
    keys.forEach((key, i) => {
      chart.data.datasets[i].data = energyData.map(d => d[key]);
    });
    chart.data.labels = labels;
    chart.update();
  };

  // Only update charts that exist and are visible
  if (solarChart && isWidgetVisible('solarWidget')) {
    setChart(solarChart, ['Zonnepaneelspanning (V)', 'Zonnepaneelstroom (A)']);
  }
  
  if (powerChart && isWidgetVisible('powerWidget')) {
    setChart(powerChart, ['Stroomverbruik woning (kW)', 'Waterstofproductie (L/u)']);
  }
  
  if (tempChart && isWidgetVisible('tempWidget')) {
    setChart(tempChart, ['Buitentemperatuur (°C)', 'Binnentemperatuur (°C)']);
  }
  
  if (batteryCO2Chart && isWidgetVisible('batteryCO2Widget')) {
    setChart(batteryCO2Chart, ['Accuniveau (%)', 'CO2-concentratie binnen (ppm)']);
  }
}

async function fetchCSVData() {
  try {
    const refreshBtn = document.getElementById('refreshBtn');
    // Laadstatus weergeven
    refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Laden...';
    refreshBtn.disabled = true;
    
    const response = await fetch('data/energy.csv'); // pad indien nodig aanpassen
    if (!response.ok) throw new Error('CSV laden mislukt');
    const text = await response.text();
    energyData = parseCSV(text);

    // Create or update charts only after DOM and widget preferences are loaded
    if (!solarChart && !powerChart && !tempChart && !batteryCO2Chart) {
      // Wait for DOM to be fully loaded
      if (document.readyState === 'complete') {
        createCharts();
      } else {
        window.addEventListener('load', createCharts);
      }
    } else {
      updateCharts();
    }
    
    // Knopstatus herstellen
    refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Gegevens Vernieuwen';
    refreshBtn.disabled = false;
  } catch (error) {
    console.error('Fout bij laden CSV:', error);
    // Knopstatus herstellen en fout weergeven
    const refreshBtn = document.getElementById('refreshBtn');
    refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Opnieuw Proberen';
    refreshBtn.disabled = false;
  }
}

// Initiële gegevensophaling
fetchCSVData();

// Vernieuw-knop
document.getElementById('refreshBtn').addEventListener('click', fetchCSVData);