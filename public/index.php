
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Smart Energy Dashboard</title>
  <link rel="stylesheet" href="styles.css" />
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 20px;
      max-width: 900px;
    }
    header {
      margin-bottom: 20px;
    }
    section {
      margin-bottom: 40px;
    }
    canvas {
      background: #f4f4f4;
      border: 1px solid #ccc;
      padding: 10px;
    }
    button {
      margin-top: 10px;
      padding: 8px 16px;
      font-size: 16px;
      cursor: pointer;
    }
  </style>
</head>
<body>
  <header>
    <h1>Smart Energy Dashboard</h1>
    <p>Welcome, <span id="username">User</span>!</p>
  </header>

  <main>
    <section>
      <h2>Solar Panel Voltage & Current</h2>
      <canvas id="solarChart" width="800" height="300"></canvas>
    </section>

    <section>
      <h2>Power Consumption & Hydrogen Production</h2>
      <canvas id="powerChart" width="800" height="300"></canvas>
    </section>

    <section>
      <h2>Temperatures (Inside & Outside)</h2>
      <canvas id="tempChart" width="800" height="300"></canvas>
    </section>

    <section>
      <h2>Battery Level & CO2 Concentration</h2>
      <canvas id="batteryCO2Chart" width="800" height="300"></canvas>
    </section>

    <button id="refreshBtn">Refresh Data</button>
  </main>

  <script src="js/dashboard.js"></script>
</body>
</html>