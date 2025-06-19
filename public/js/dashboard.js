document.getElementById('username').textContent = 'Jane Doe';

// Parse CSV string into array of objects
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

const solarCtx = document.getElementById('solarChart').getContext('2d');
const powerCtx = document.getElementById('powerChart').getContext('2d');
const tempCtx = document.getElementById('tempChart').getContext('2d');
const batteryCO2Ctx = document.getElementById('batteryCO2Chart').getContext('2d');

let solarChart, powerChart, tempChart, batteryCO2Chart;

function createCharts() {
  const options = {
    responsive: true,
    scales: {
      x: { title: { display: true, text: 'Time' } },
      y: { beginAtZero: true }
    }
  };

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

function updateCharts() {
  const labels = energyData.map(d => d['Tijdstip']);

  const setChart = (chart, keys) => {
    keys.forEach((key, i) => {
      chart.data.datasets[i].data = energyData.map(d => d[key]);
    });
    chart.data.labels = labels;
    chart.update();
  };

  setChart(solarChart, ['Zonnepaneelspanning (V)', 'Zonnepaneelstroom (A)']);
  setChart(powerChart, ['Stroomverbruik woning (kW)', 'Waterstofproductie (L/u)']);
  setChart(tempChart, ['Buitentemperatuur (°C)', 'Binnentemperatuur (°C)']);
  setChart(batteryCO2Chart, ['Accuniveau (%)', 'CO2-concentratie binnen (ppm)']);
}

async function fetchCSVData() {
  try {
    const response = await fetch('data/energy.csv'); // adjust path if needed
    if (!response.ok) throw new Error('Failed to load CSV');
    const text = await response.text();
    energyData = parseCSV(text);

    if (!solarChart) createCharts();
    else updateCharts();
  } catch (error) {
    console.error('Error loading CSV:', error);
  }
}

// Initial fetch
fetchCSVData();

// Refresh button
document.getElementById('refreshBtn').addEventListener('click', fetchCSVData);