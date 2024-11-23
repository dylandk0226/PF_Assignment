const API_KEY = 'Q3P1MHAX8XTEGR42';
const BASE_URL = 'https://www.alphavantage.co/query?';

let stockChart;

document.addEventListener("DOMContentLoaded", () => {
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
        const latestPrice = prices[prices.length - 1];

        stockDataDiv.innerHTML = `<h2>${symbol}</h2><p>Last 10 Days Stock Data:</p>`;

        renderChart(labels, prices);
        const recommendation = calculateRecommendation(latestPrice);
        const recommendationDiv = document.createElement('p');
        recommendationDiv.textContent = `Recommendation: ${recommendation}`;
        stockDataDiv.appendChild(recommendationDiv);
        
      } else {
        stockDataDiv.innerHTML = '<p>No data found. Please check the symbol and try again.</p>';
      }
    } catch (error) {
      stockDataDiv.innerHTML = '<p>Error fetching data. Please try again later.</p>';
      console.error('Error:', error);
    }
  });

  function renderChart(labels, prices) {
    const ctx = document.getElementById("stockChart").getContext("2d");

    if (stockChart) {
      stockChart.destroy();
    }

    stockChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Stock Price (USD)",
            data: prices,
            borderColor: "rgba(75, 192, 192, 1)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          x: {
            title: {
              display: true,
              text: "Date",
            },
          },
          y: {
            title: {
              display: true,
              text: "Price (USD)",
            },
          },
        },
      },
    });
  }

  function calculateRecommendation(price) {
    const threshold = 100;
    if (price < threshold) {
      return "Buy – The stock price is below the threshold, indicating potential for growth.";
    } else if (price > threshold * 1.2) {
      return "Sell – The stock price is high compared to the threshold, indicating potential overvaluation.";
    } else {
      return "Hold – The stock price is within a stable range.";
    }
  }
});
