/**
 * Dashboard components management
 * Direct injection approach to avoid loading issues
 */

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
  // Inject sidebar and header directly
  injectSidebar();
  injectHeader();
  
  // Setup theme toggle
  setupThemeToggle();
  
  // Setup widget toggles with a small delay to ensure everything is loaded
  setTimeout(setupWidgetToggles, 100);
  
  // Load data after components are ready
  setTimeout(() => {
    if (window.fetchCSVData) {
      window.fetchCSVData();
    }
  }, 300);
});

// Create and inject sidebar directly
function injectSidebar() {
  const sidebarContainer = document.getElementById('sidebar-container');
  if (!sidebarContainer) return;
  
  const sidebarHTML = `
    <aside class="w-60 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-6 flex flex-col transition-all duration-300">
      <div class="flex items-center mb-8 pb-4 border-b border-gray-200 dark:border-gray-700">
        <i class="fas fa-bolt"></i>
        <span class="font-bold text-lg text-primary ml-2">Smart Energy</span>
      </div>
      
      <ul class="space-y-2 mb-8">
        <li>
          <a href="/" class="flex items-center px-4 py-3 rounded-xl bg-primary text-white">
            <i class="fas fa-tachometer-alt w-5 text-center mr-3"></i>
            <span>Dashboard</span>
          </a>
        </li>
        <li>
          <a href="/public/charts/solar.html" class="flex items-center px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
            <i class="fas fa-solar-panel w-5 text-center mr-3"></i>
            <span>Zonnepaneel</span>
          </a>
        </li>
        <li>
          <a href="/public/charts/power.html" class="flex items-center px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
            <i class="fas fa-bolt w-5 text-center mr-3"></i>
            <span>Stroom</span>
          </a>
        </li>
        <li>
          <a href="/public/charts/temp.html" class="flex items-center px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
            <i class="fas fa-temperature-high w-5 text-center mr-3"></i>
            <span>Temperatuur</span>
          </a>
        </li>
        <li>
          <a href="/public/charts/battery.html" class="flex items-center px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
            <i class="fas fa-battery-full w-5 text-center mr-3"></i>
            <span>Accu</span>
          </a>
        </li>
        <li>
          <a href="/settings" class="flex items-center px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
            <i class="fas fa-cog w-5 text-center mr-3"></i>
            <span>Instellingen</span>
          </a>
        </li>
      </ul>
      
      <!-- Widget Controls -->
      <div class="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
        <h3 class="font-medium text-sm uppercase text-gray-500 dark:text-gray-400 mb-3">Widgets</h3>
        
        <div class="space-y-3">
          <label class="flex items-center justify-between cursor-pointer">
            <span class="text-sm">Zonnepaneel</span>
            <div class="relative">
              <input type="checkbox" id="toggleSolar" class="sr-only peer" checked>
              <div class="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
            </div>
          </label>
          
          <label class="flex items-center justify-between cursor-pointer">
            <span class="text-sm">Stroomverbruik</span>
            <div class="relative">
              <input type="checkbox" id="togglePower" class="sr-only peer" checked>
              <div class="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
            </div>
          </label>
          
          <label class="flex items-center justify-between cursor-pointer">
            <span class="text-sm">Temperatuur</span>
            <div class="relative">
              <input type="checkbox" id="toggleTemp" class="sr-only peer" checked>
              <div class="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
            </div>
          </label>
          
          <label class="flex items-center justify-between cursor-pointer">
            <span class="text-sm">Accu & CO2</span>
            <div class="relative">
              <input type="checkbox" id="toggleBatteryCO2" class="sr-only peer" checked>
              <div class="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
            </div>
          </label>
        </div>
      </div>
    </aside>
  `;
  
  sidebarContainer.innerHTML = sidebarHTML;
}

// Create and inject header directly
function injectHeader() {
  const headerContainer = document.getElementById('header-container');
  if (!headerContainer) return;
  
  const headerHTML = `
    <header class="flex justify-between items-center mb-8 pb-4 border-b border-gray-200 dark:border-gray-700">
      <div>
        <h1 class="font-semibold text-2xl m-0">Energy Dashboard</h1>
        <p class="text-gray-600 dark:text-gray-400">Monitor uw energieverbruik in realtime</p>
      </div>
      
      <div class="flex items-center gap-4">
        <!-- Theme Toggle -->
        <button id="themeToggle" class="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-none">
          <i class="fas fa-moon"></i>
        </button>
        
        <!-- User Profile -->
        <div class="flex items-center gap-3 p-2 rounded-xl">
          <div class="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
            <span>JM</span>
          </div>
          <div class="leading-tight">
            <div class="font-semibold" id="username">Joe Mama</div>
            <div class="text-xs opacity-70">Huiseigenaar</div>
          </div>
        </div>
      </div>
    </header>
  `;
  
  headerContainer.innerHTML = headerHTML;
}

// Set up theme toggle functionality
function setupThemeToggle() {
  const themeToggle = document.getElementById('themeToggle');
  if (!themeToggle) return;
  
  // Toggle theme and icon
  themeToggle.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
    const icon = themeToggle.querySelector('i');
    if (document.documentElement.classList.contains('dark')) {
      icon.classList.replace('fa-moon', 'fa-sun');
    } else {
      icon.classList.replace('fa-sun', 'fa-moon');
    }
    
    // Save preference
    localStorage.setItem('darkMode', document.documentElement.classList.contains('dark'));
  });
  
  // Load saved preference
  if (localStorage.getItem('darkMode') === 'true') {
    document.documentElement.classList.add('dark');
    const icon = themeToggle.querySelector('i');
    if (icon) icon.classList.replace('fa-moon', 'fa-sun');
  }
}

// Set up widget toggle functionality
function setupWidgetToggles() {
  // Get toggle elements
  const toggleSolar = document.getElementById('toggleSolar');
  const togglePower = document.getElementById('togglePower');
  const toggleTemp = document.getElementById('toggleTemp');
  const toggleBatteryCO2 = document.getElementById('toggleBatteryCO2');
  
  // Get widget elements
  const solarWidget = document.getElementById('solarWidget');
  const powerWidget = document.getElementById('powerWidget');
  const tempWidget = document.getElementById('tempWidget');
  const batteryCO2Widget = document.getElementById('batteryCO2Widget');
  
  // Skip if any elements are missing
  if (!toggleSolar || !togglePower || !toggleTemp || !toggleBatteryCO2 || 
      !solarWidget || !powerWidget || !tempWidget || !batteryCO2Widget) {
    console.error("Some widget controls or containers are missing");
    return;
  }
  
  // Load saved widget preferences
  const preferences = JSON.parse(localStorage.getItem('widgetPreferences')) || {
    solar: true,
    power: true,
    temp: true,
    batteryCO2: true
  };
  
  console.log("Loaded widget preferences:", preferences);
  
  // Apply preferences to toggles
  toggleSolar.checked = preferences.solar;
  togglePower.checked = preferences.power;
  toggleTemp.checked = preferences.temp;
  toggleBatteryCO2.checked = preferences.batteryCO2;
  
  // Apply visibility - FIX: Corrected the inverted logic for batteryCO2Widget
  solarWidget.style.display = preferences.solar ? 'block' : 'none';
  powerWidget.style.display = preferences.power ? 'block' : 'none';
  tempWidget.style.display = preferences.temp ? 'block' : 'none';
  batteryCO2Widget.style.display = preferences.batteryCO2 ? 'block' : 'none';  // Fixed this line
  
  // Update widget visibility and save preferences
  function updateWidgetVisibility() {
    const newPreferences = {
      solar: toggleSolar.checked,
      power: togglePower.checked,
      temp: toggleTemp.checked,
      batteryCO2: toggleBatteryCO2.checked
    };
    
    console.log("Updating widget visibility:", newPreferences);
    
    // Apply visibility
    solarWidget.style.display = newPreferences.solar ? 'block' : 'none';
    powerWidget.style.display = newPreferences.power ? 'block' : 'none';
    tempWidget.style.display = newPreferences.temp ? 'block' : 'none';
    batteryCO2Widget.style.display = newPreferences.batteryCO2 ? 'block' : 'none';  // Fixed this line
    
    // Save preferences
    localStorage.setItem('widgetPreferences', JSON.stringify(newPreferences));
    
    // Force chart recreation after visibility changes
    setTimeout(() => {
      if (window.createCharts) {
        window.createCharts();
      } else if (window.updateCharts) {
        window.updateCharts();
      }
    }, 100);
  }
  
  // Add change event listeners
  toggleSolar.addEventListener('change', updateWidgetVisibility);
  togglePower.addEventListener('change', updateWidgetVisibility);
  toggleTemp.addEventListener('change', updateWidgetVisibility);
  toggleBatteryCO2.addEventListener('change', updateWidgetVisibility);
  
  // Setup expand buttons
  setupExpandButtons();
}

// Set up expand button functionality
function setupExpandButtons() {
  document.addEventListener('click', function(e) {
    const button = e.target.closest('[id$="Widget"] button');
    if (button) {
      e.preventDefault();
      e.stopPropagation();
      
      let url = '/';
      const widget = button.closest('[id$="Widget"]');
      
      if (widget) {
        const id = widget.id;
        if (id === 'solarWidget') url = '/public/charts/solar.html';
        else if (id === 'powerWidget') url = '/public/charts/power.html';
        else if (id === 'tempWidget') url = '/public/charts/temp.html';
        else if (id === 'batteryCO2Widget') url = '/public/charts/battery.html';
      }
      
      window.location.href = url;
    }
  });
}
