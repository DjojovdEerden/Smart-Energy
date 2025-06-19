document.getElementById('username').textContent = 'Jane Doe';

// CSV data snippet (semicolon separated) - you would normally fetch this from backend or API
const csvData = `
Tijdstip;Zonnepaneelspanning (V);Zonnepaneelstroom (A);Waterstofproductie (L/u);Stroomverbruik woning (kW);Waterstofverbruik auto (L/u);Buitentemperatuur (°C);Binnentemperatuur (°C);Luchtdruk (hPa);Luchtvochtigheid (%);Accuniveau (%);CO2-concentratie binnen (ppm);Waterstofopslag woning (%);Waterstofopslag auto (%)
14-6-2025 00:00;4,1;0,098042185;0,017399685;0,744267307;0;3,858237262;20,81984231;1012,138969;71,23386847;99,92935564;495,0305955;0;71,8
14-6-2025 00:15;4,1;0,103300228;0,018332837;0,693933438;0;3,669635562;21,47318476;1011,389408;72,95322835;99,86396944;496,5594982;0;73,6
14-6-2025 00:30;4,1;0,05738134;0,010183547;0,733039975;0;5,07684934;20,98148044;1012,242442;71,40510026;99,79280687;485,3073681;0;75,4
14-6-2025 00:45;4,1;0,129589924;0,022998506;0,802378178;0;3,926729007;21,18895439;1012,485733;69,90138336;99,71761258;516,6757626;0;77,2
14-6-2025 01:00;4,1;0,11713194;0,02078757;0,815920276;0;3,94527299;21,08943365;1012,388864;68,98064681;99,64055719;503,948662;0;79
`;

// Helper: Parse CSV data into JS array of objects
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
      // Convert comma decimals to dot decimals, then to number if applicable
      val = val.replace(',', '.');
      if (!isNaN(val) && val !== '') {
        val = Number(val);
      }
      obj[header] = val;
    });
    return obj;
  });
}

// Parsed data
let energyData = parseCSV(csvData);

// Create Chart instances
const solarCtx = document.getElementById('solarChart').getContext('2d');
const powerCtx = document.getElementById('powerChart').getContext('2d');
const tempCtx = document.getElementById('tempChart').getContext('2d');
const batteryCO2Ctx = document.getElementById('batteryCO2Chart').getContext('2d');

let solarChart, powerChart, tempChart, batteryCO2Chart;

function createCharts() {
  // Common options
  const options = {
    responsive: true,
    scales: {
      x: { title: { display: true, text: 'Time' } },
      y: { beginAtZero: true }
    }
  };

  // Solar Panel Voltage & Current
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
    options: options
  });

  // Power Consumption & Hydrogen Production
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
    options: options
  });

  // Temperatures (Inside & Outside)
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
    options: options
  });

  // Battery Level & CO2 Concentration
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
    options: options
  });
}

// Update charts with new data (for refresh button)
function updateCharts() {
  const labels = energyData.map(d => d['Tijdstip']);

  solarChart.data.labels = labels;
  solarChart.data.datasets[0].data = energyData.map(d => d['Zonnepaneelspanning (V)']);
  solarChart.data.datasets[1].data = energyData.map(d => d['Zonnepaneelstroom (A)']);
  solarChart.update();

  powerChart.data.labels = labels;
  powerChart.data.datasets[0].data = energyData.map(d => d['Stroomverbruik woning (kW)']);
  powerChart.data.datasets[1].data = energyData.map(d => d['Waterstofproductie (L/u)']);
  powerChart.update();

  tempChart.data.labels = labels;
  tempChart.data.datasets[0].data = energyData.map(d => d['Buitentemperatuur (°C)']);
  tempChart.data.datasets[1].data = energyData.map(d => d['Binnentemperatuur (°C)']);
  tempChart.update();

  batteryCO2Chart.data.labels = labels;
  batteryCO2Chart.data.datasets[0].data = energyData.map(d => d['Accuniveau (%)']);
  batteryCO2Chart.data.datasets[1].data = energyData.map(d => d['CO2-concentratie binnen (ppm)']);
  batteryCO2Chart.update();
}

// Simulate fetching new CSV data (replace with actual fetch from PHP API)
function fetchEnergyData() {
  // In real use, you'd do something like:
  // return fetch('/backend/api/energyData.php')
  //   .then(res => res.text())
  //   .then(text => {
  //     energyData = parseCSV(text);
  //     updateCharts();
  //   });

  // For demo, simulate delay and refresh charts with the same data
  setTimeout(() => {
    // Could update energyData here with new data from server
    updateCharts();
  }, 500);
}

// Initialize charts and data on load
createCharts();
fetchEnergyData();

document.getElementById('refreshBtn').addEventListener('click', fetchEnergyData);