const API_KEY = 'Q3P1MHAX8XTEGR42';
const BASE_URL = 'https://www.alphavantage.co/query?';

let stockChart;

document.getElementById('stockForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const symbol = document.getElementById('stockSymbol').value.toUpperCase();
  const stockDataDiv = document.getElementById('stockData');
  stockDataDiv.innerHTML = '<p>Loading...</p>';

  try {
    let response = await fetch(`${BASE_URL}function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${API_KEY}`, { 
        method: "GET"
      });
      
      const data = await response.json();

    if (data['Time Series (Daily)']) {
      const timeSeries = data['Time Series (Daily)'];
      const labels = Object.keys(timeSeries).slice(0, 10).reverse();
      const prices = labels.map(date => parseFloat(timeSeries[date]['4. close']));

      stockDataDiv.innerHTML = `<h2>${symbol}</h2><p>Last 10 Days Stock Data:</p>`;
      renderChart(labels, prices);
    } else {
      stockDataDiv.innerHTML = '<p>No data found. Please check the symbol and try again.</p>';
    }
  } catch (error) {
    stockDataDiv.innerHTML = '<p>Error fetching data. Please try again later.</p>';
    console.error('Error:', error);
  }
});

function renderChart(labels, prices){

}