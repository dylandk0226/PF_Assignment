# Market Master

Market Master is a web application that provides real-time stock insights, financial performance data, and market news for publicly traded companies. Users can search for stock symbols, view detailed company information, track historical performance, and gain actionable recommendations such as "Buy," "Sell," or "Hold" based on key metrics like price and volume.

This project is designed to be an intuitive and efficient tool for investors, analysts, and anyone interested in monitoring the financial markets. With seamless data updates and visually engaging charts, Market Master enhances decision-making in a dynamic financial environment.

---

## Design Process

Market Master was designed with accessibility and simplicity in mind. The primary audience includes retail investors, finance enthusiasts, and professional traders. The website enables users to:
- Look up detailed information about companies using their stock symbols.
- View financial performance charts for informed investment decisions.
- Stay updated on the latest market news.

### User Stories:
1. **As a retail investor**, I want to know whether to buy, hold, or sell a stock so that I can make informed investment decisions.
2. **As a finance enthusiast**, I want to analyze a company's financial data over time so that I can understand its growth trends.
3. **As a professional trader**, I want to monitor news for a specific stock so that I can react quickly to market changes.

---

## Features

### Existing Features:
1. **Search Stock Data**: Users can search for stocks using their symbols (e.g., AAPL for Apple Inc.) and view the latest 10 days of price and volume data.
2. **Actionable Recommendations**: Users receive clear "Buy," "Sell," or "Hold" recommendations based on price thresholds and trading volumes.
3. **Company Details**: Displays key ratios (e.g., P/E Ratio, Debt-to-Equity Ratio) and company profiles.
4. **Financial Charts**: Includes visualizations of yearly financial performance and gross profit over time.
5. **Market News**: Aggregates the latest news articles related to the searched stock.
6. **Seamless Data Refresh**: Allows users to input a new stock symbol without requiring a page refresh.

### Features Left to Implement:
1. Integration with additional stock APIs for extended data coverage.
2. Advanced filtering options for financial ratios and performance metrics.
3. A dashboard for tracking multiple stocks at once.
4. Real-time notifications for news or stock price alerts.

---

## Technologies Used

1. **HTML5**: For the structure of the web pages.
2. **CSS3**: For styling and responsive design.
3. **JavaScript**: For dynamic functionality, API integrations, and data visualization.
4. **Chart.js**: [Chart.js](https://www.chartjs.org/) was used to create interactive and responsive charts for stock performance and financial data.
5. **Bootstrap 5**: [Bootstrap](https://getbootstrap.com/) was used for styling, layout, and responsive design.
6. **Alpha Vantage API**: [Alpha Vantage](https://www.alphavantage.co/) provides the stock data for time series analysis.
7. **Financial Modeling Prep API**: [FMP API](https://financialmodelingprep.com/) supplies detailed company profiles and financial ratios.
8. **MarketAux API**: [MarketAux](https://marketaux.com/) delivers the latest stock-related news.

---

## Testing

### Manual Testing:
1. **Stock Search Form**:
   - Input a valid stock symbol and verify data is displayed.
   - Input an invalid stock symbol and confirm an error message appears.
   - Submit the form twice with different symbols to ensure seamless refresh functionality.
2. **Charts**:
   - Verify charts render correctly on various browsers (e.g., Chrome, Firefox, Edge).
   - Test resizing the window to ensure responsive design works for all screen sizes.
3. **Recommendations**:
   - Validate that the "Buy," "Sell," or "Hold" recommendation is accurate based on sample data.
4. **News Section**:
   - Confirm that clicking a news link opens the correct article in a new tab.
5. **Cross-Browser Compatibility**:
   - Verified on Chrome, Firefox, Edge, and Safari for consistency.
6. **Mobile Responsiveness**:
   - Tested the application on multiple screen sizes to ensure usability on mobile devices.

---

## Credits

### Content:
- Financial data sourced from [Alpha Vantage](https://www.alphavantage.co/) and [Financial Modeling Prep](https://financialmodelingprep.com/).
- News articles powered by [MarketAux](https://marketaux.com/).
- [Github](https://dylandk0226.github.io/PF_Assignment/)
- [Render](https://master-market-106z.onrender.com/)

### Acknowledgements:
- Special thanks to the [Chart.js](https://www.chartjs.org/) and [Bootstrap](https://getbootstrap.com/) communities for their comprehensive documentation and examples.
- This project was inspired by the need for accessible and real-time financial tools for retail investors.
