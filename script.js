const API_KEY = 'Q3P1MHAX8XTEGR42';
const FMP_API_KEY = 'K82PmxATSeS4GlzUrbvE8STdvZNgomjI';
const MARKETAUX_API_KEY = '3FfuMcNAS1B05vcBZ7U1i095TutlIWKdSt7VqSxV';

let stockChart, financialChart, grossProfitChart;

document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll('.tab');
  const chartSection = document.getElementById('chart');
  const detailsSection = document.getElementById('details');
  const newsSection = document.getElementById('news');

  chartSection.style.display = 'none';
  newsSection.style.display = 'none';
  detailsSection.style.display = 'block';

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      chartSection.style.display = 'none';
      detailsSection.style.display = 'none';
      newsSection.style.display = 'none';

      if (tab.dataset.tab === 'chart') {
        chartSection.style.display = 'block';
      } else if (tab.dataset.tab === 'details') {
        detailsSection.style.display = 'block';
      } else if (tab.dataset.tab === 'news') {
        newsSection.style.display = 'block';
      }

      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
    });
  });

  document.getElementById('stockForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const symbol = document.getElementById('stockSymbol').value.toUpperCase();
    clearUI();
    const stockData = await fetchStockData(symbol);

    if (stockData) {
      const { labels, prices, volumes, recommendation } = stockData;
      await fetchCompanyDetails(symbol);
      await fetchLatestNews(symbol);
      await fetchFinancialData(symbol, labels, prices, volumes, recommendation);
    }
  });
});

function clearUI() {
  const companyDetailsDiv = document.getElementById('companyDetails');
  const latestNewsDiv = document.getElementById('latestNews');
  const chartContainer = document.getElementById('chart');

  if (companyDetailsDiv) {
    companyDetailsDiv.innerHTML = '<p>Enter a stock symbol to see company details, key ratios, charts and the latest news.</p>';
  }

  if (latestNewsDiv) {
    latestNewsDiv.innerHTML = '<p>Enter a stock symbol to fetch the latest news.</p>';
  }

  if (chartContainer) {
    chartContainer.innerHTML = `
      <canvas id="stockChart"></canvas>
      <div id="stockData" class="chart-data"></div>
      <h3>Yearly Financial Performance</h3>
      <canvas id="financialChart"></canvas>
      <h3>Gross Profit (Annual)</h3>
      <canvas id="grossProfitChart"></canvas>
    `;
  }

  if (stockChart) stockChart.destroy();
  if (financialChart) financialChart.destroy();
  if (grossProfitChart) grossProfitChart.destroy();
}

async function fetchStockData(symbol) {
  const stockDataDiv = document.getElementById('stockData');

  if (!stockDataDiv) {
    console.error('Element with ID "stockData" not found.');
    return null;
  }

  stockDataDiv.innerHTML = '<p>Loading stock data...</p>';

  try {
    const response = await fetch(
      `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${API_KEY}`
    );
    const data = await response.json();

    if (data['Time Series (Daily)']) {
      const timeSeries = data['Time Series (Daily)'];
      const labels = Object.keys(timeSeries).slice(0, 10).reverse();
      const prices = labels.map(date => parseFloat(timeSeries[date]['4. close']));
      const volumes = labels.map(date => parseInt(timeSeries[date]['5. volume']));

      const latestPrice = prices[prices.length - 1];
      const latestVolume = volumes[volumes.length - 1];
      const recommendation = calculateRecommendation(latestPrice, latestVolume);

      stockDataDiv.innerHTML = `
        <h2>${symbol} - Last 10 Days Stock Data</h2>
        <canvas id="stockChart"></canvas>
        <div id="recommendation": center; margin-top: 10px;">
          <p><strong>Recommendation:</strong> ${recommendation}</p>
        </div>`;

      renderChart(labels, prices, volumes);
      return { labels, prices, volumes, recommendation };
    } else {
      stockDataDiv.innerHTML = '<p>No stock data found. Please check the symbol.</p>';
      return null;
    }
  } catch{
    stockDataDiv.innerHTML = '<p>Error fetching stock data. Please try again later.</p>';
    //console.error('Error fetching stock data:', error);
    //return null;
  }
}

async function fetchCompanyDetails(symbol) {
  const companyDetailsDiv = document.getElementById('companyDetails');
  companyDetailsDiv.innerHTML = '<p>Loading company details...</p>';

  try {
    const profileResponse = await fetch(`https://financialmodelingprep.com/api/v3/profile/${symbol}?apikey=${FMP_API_KEY}`);
    const ratiosResponse = await fetch(`https://financialmodelingprep.com/api/v3/ratios/${symbol}?period=annual&apikey=${FMP_API_KEY}`);
    const profileData = await profileResponse.json();
    const ratiosData = await ratiosResponse.json();

    if (!profileData || !ratiosData) throw new Error('Invalid data received.');

    const profile = profileData[0];
    const ratios = ratiosData[0];

    const html = `
      <div class="details-grid">
        <div class="card">
          <h3>Company Profile</h3>
          <p><strong>Name:</strong> ${profile.companyName}</p>
          <p><strong>Industry:</strong> ${profile.industry}</p>
          <p><strong>Description:</strong> ${profile.description}</p>
          <p><strong>Website:</strong> <a href="${profile.website}" target="_blank">${profile.website}</a></p>
        </div>
        <div class="card">
          <h3>Key Ratios</h3>
          <p><strong>P/E Ratio:</strong> ${ratios.priceEarningsRatio.toFixed(2) || 'N/A'}</p>
          <p><strong>Debt-to-Equity Ratio:</strong> ${ratios.debtEquityRatio.toFixed(2) || 'N/A'}</p>
          <p><strong>Return on Equity:</strong> ${ratios.returnOnEquity.toFixed(2) || 'N/A'}</p>
        </div>
      </div>
    `;

    companyDetailsDiv.innerHTML = html;
  } catch {
    companyDetailsDiv.innerHTML = '<p>Error fetching company details. Please try again later.</p>';
    //console.error('Error fetching company details:', error);
  }
}

async function fetchLatestNews(symbol) {
  const latestNewsDiv = document.getElementById('latestNews');
  latestNewsDiv.innerHTML = '<p>Loading latest news...</p>';

  try {
    const response = await fetch(
      `https://api.marketaux.com/v1/news/all?symbols=${symbol}&api_token=${MARKETAUX_API_KEY}`
    );
    const newsData = await response.json();

    if (newsData.data && newsData.data.length) {
      const newsHTML = newsData.data.map(news => `
        <div class="news-item">
          <h4>${news.title}</h4>
          <p>${news.description || 'No description available.'}</p>
          <a href="${news.url}" target="_blank">Read more</a>
        </div>
      `).join('');

      latestNewsDiv.innerHTML = newsHTML;
    } else {
      latestNewsDiv.innerHTML = '<p>No recent news available.</p>';
    }
  } catch {
    latestNewsDiv.innerHTML = '<p>Error fetching news. Please try again later.</p>';
    //console.error('Error fetching news:', error);
  }
}

async function fetchFinancialData(symbol, labels, prices, volumes, recommendation) {
  const financialAPI = `https://financialmodelingprep.com/api/v3/income-statement/${symbol}?period=annual&apikey=${FMP_API_KEY}`;
  const chartSection = document.getElementById('chart');
  chartSection.innerHTML = '<p>Loading financial data...</p>';

  try {
    const response = await fetch(financialAPI);
    const data = await response.json();

    if (!data || data.length === 0) {
      chartSection.innerHTML = '<p>No financial data available for this symbol.</p>';
      return;
    }

    const years = data.map(entry => entry.date.split('-')[0]).reverse();
    const revenues = data.map(entry => (entry.revenue ? entry.revenue / 1e9 : 0)).reverse();
    const netIncomes = data.map(entry => (entry.netIncome ? entry.netIncome / 1e9 : 0)).reverse();
    const grossProfits = data.map(entry => (entry.grossProfit ? entry.grossProfit / 1e9 : 0)).reverse();

    chartSection.innerHTML = `
      <h2>Last 10 Days Stock Data</h2>
      <canvas id="stockChart"></canvas>
      <div id="recommendation" style="text-align: center; margin-top: 10px;">
        <p><strong>Recommendation:</strong> ${recommendation}</p>
      </div>
      <h2>Yearly Financial Performance</h2>
      <canvas id="financialChart"></canvas>
      <h2>Gross Profit (Annual)</h2>
      <canvas id="grossProfitChart"></canvas>
    `;

    renderChart(labels, prices, volumes);
    renderFinancialChart(years, revenues, netIncomes);
    renderGrossProfitChart(years, grossProfits);
  } catch {
    chartSection.innerHTML = '<p>Error fetching financial data. Please try again later.</p>';
    //console.error('Error fetching financial data:', error);
  }
}

function renderChart(labels, prices, volumes) {
  const ctx = document.getElementById('stockChart')?.getContext('2d');
  if (!ctx) {
    console.error('Canvas element for stockChart not found.');
    return;
  }

  if (stockChart) {
    stockChart.destroy();
  }

  stockChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          type: 'line',
          label: 'Stock Price (USD)',
          data: prices,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderWidth: 2,
          yAxisID: 'y-axis-price',
        },
        {
          type: 'bar',
          label: 'Volume',
          data: volumes,
          backgroundColor: 'rgba(192, 75, 75, 0.8)',
          yAxisID: 'y-axis-volume',
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        'y-axis-price': {
          position: 'left',
          title: {
            display: true,
            text: 'Price (USD)',
          },
        },
        'y-axis-volume': {
          position: 'right',
          title: {
            display: true,
            text: 'Volume',
          },
          grid: {
            drawOnChartArea: false,
          },
        },
      },
    },
  });
}

function renderFinancialChart(years, revenues, netIncomes) {
  const ctx = document.getElementById('financialChart')?.getContext('2d');
  if (!ctx) {
    console.error('Canvas element for financialChart not found.');
    return;
  }

  if (financialChart) {
    financialChart.destroy();
  }

  financialChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: years,
      datasets: [
        {
          label: 'Revenue (Billion USD)',
          data: revenues,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
        {
          label: 'Net Income (Billion USD)',
          data: netIncomes,
          backgroundColor: 'rgba(192, 75, 75, 0.6)',
          borderColor: 'rgba(192, 75, 75, 1)',
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        x: { title: { display: true, text: 'Year' } },
        y: { title: { display: true, text: 'Amount (Billion USD)' } },
      },
    },
  });
}

function renderGrossProfitChart(years, grossProfits) {
  const ctx = document.getElementById('grossProfitChart')?.getContext('2d');
  if (!ctx) {
    console.error('Canvas element for grossProfitChart not found.');
    return;
  }

  if (grossProfitChart) {
    grossProfitChart.destroy();
  }

  grossProfitChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: years,
      datasets: [
        {
          label: 'Gross Profit (Billion USD)',
          data: grossProfits,
          backgroundColor: 'rgba(153, 102, 255, 0.6)',
          borderColor: 'rgba(153, 102, 255, 1)',
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        x: { title: { display: true, text: 'Year' } },
        y: { title: { display: true, text: 'Gross Profit (Billion USD)' } },
      },
    },
  });
}

function calculateRecommendation(price, volume) {
  const priceThreshold = 100;
  const volumeThreshold = 1_000_000;

  if (price < priceThreshold && volume > volumeThreshold) {
    return "Buy – High volume and low price indicate potential for growth.";
  } else if (price > priceThreshold * 1.2 && volume < volumeThreshold) {
    return "Sell – High price with low volume indicates overvaluation.";
  } else {
    return "Hold – Price and volume are in a moderate range.";
  }
}