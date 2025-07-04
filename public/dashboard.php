<?php
session_start();
if (!isset($_SESSION['user_id'])) {
    header('Location: Login-register/login.html');
    exit();
}
?>
<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Smart Energy Dashboard</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          fontFamily: {
            sans: ['Inter', 'sans-serif'],
          },
          colors: {
            primary: {
              DEFAULT: '#3a86ff',
              hover: '#2b78e4',
            },
            secondary: '#8338ec',
            success: '#38b000',
            warning: '#ffbe0b',
            danger: '#ff006e',
          },
          transitionProperty: {
            'height': 'height',
          }
        }
      }
    }
  </script>
</head>
<body class="bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-50 transition-colors duration-300">
  <div class="flex min-h-screen">
    <!-- Sidebar Container -->
    <div id="sidebar-container">
      <!-- Sidebar will be injected by components.js -->
    </div>
    
    <!-- Main Content -->
    <div class="flex-1 p-6 overflow-y-auto">
      <div class="flex justify-end mb-4">
        <a href="Login-register/logout.php" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Logout</a>
      </div>
      <!-- Header Container -->
      <div id="header-container">
        <!-- Header will be injected by components.js -->
      </div>
      
      <!-- Grid Layout with widgets -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Solar Panel Card -->
        <div id="solarWidget" class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-semibold m-0">Zonnepaneel Prestaties</h2>
            <div class="flex gap-2">
              <button class="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-none">
                <i class="fas fa-expand"></i>
              </button>
            </div>
          </div>
          <div class="relative" style="height: 300px">
            <canvas id="solarChart" class="w-full h-full"></canvas>
          </div>
        </div>
        
        <!-- Power Consumption Card -->
        <div id="powerWidget" class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-semibold m-0">Stroomverbruik Woning</h2>
            <div class="flex gap-2">
              <button class="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-none">
                <i class="fas fa-expand"></i>
              </button>
            </div>
          </div>
          <div class="relative" style="height: 300px">
            <canvas id="powerChart" class="w-full h-full"></canvas>
          </div>
        </div>
        
        <!-- Temperature Card -->
        <div id="tempWidget" class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-semibold m-0">Temperatuur Monitoring</h2>
            <div class="flex gap-2">
              <button class="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-none">
                <i class="fas fa-expand"></i>
              </button>
            </div>
          </div>
          <div class="relative" style="height: 300px">
            <canvas id="tempChart" class="w-full h-full"></canvas>
          </div>
        </div>
        
        <!-- Battery and CO2 Card -->
        <div id="batteryCO2Widget" class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-semibold m-0">Accuniveau & Luchtkwaliteit</h2>
            <div class="flex gap-2">
              <button class="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-none">
                <i class="fas fa-expand"></i>
              </button>
            </div>
          </div>
          <div class="relative" style="height: 300px">
            <canvas id="batteryCO2Chart" class="w-full h-full"></canvas>
          </div>
        </div>
      </div>
      
      <!-- Refresh Button -->
      <div class="mt-8 flex justify-center">
        <button id="refreshBtn" class="flex items-center gap-2 py-3 px-5 bg-primary text-white rounded-xl font-semibold cursor-pointer hover:bg-primary-hover transition-colors duration-200">
          <i class="fas fa-sync-alt"></i> Gegevens Vernieuwen
        </button>
      </div>
    </div>
  </div>

  <!-- Scripts - dashboard.js must be first for proper initialization -->
  <script src="js/dashboard.js"></script>
  <script src="js/components.js"></script>
</body>
</html> 