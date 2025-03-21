const express = require('express');
const mysql = require('mysql2');
const cors = require('cors'); // Import the cors package

const app = express();
const port = 3000;

// Enable CORS for all routes
app.use(cors());

// Create a connection to the database
const connection = mysql.createConnection({
  host: 'localhost',      // Replace with your database host
  user: 'root',           // Replace with your database username
  password: 'Sponge12368!',   // Replace with your database password
  database: 'mydb'  // Replace with your database name
});

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    return;
  }
  console.log('Connected to the database with ID:', connection.threadId);
});

// Endpoint to generate a report
app.get('/api/report', (req, res) => {
  const { type } = req.query; // Get the report type from the query parameter

  let query;
  switch (type) {
    case 'collection':
      query = 'SELECT * FROM artifacts'; // Replace with your collection table query
      break;
    case 'conservation':
      query = 'SELECT * FROM exhibits'; // Replace with your conservation table query
      break;
    case 'loan':
      query = 'SELECT * FROM employees'; // Replace with your loan table query
      break;
    default:
      return res.status(400).send('Invalid report type');
  }

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err.stack);
      res.status(500).send('Error executing query');
      return;
    }

    // Generate HTML report
    const htmlReport = generateHTMLReport(results, type);

    // Send the HTML report as a response
    res.send(htmlReport);
  });
});

// Function to generate HTML report
function generateHTMLReport(data, type) {
  let title;
  switch (type) {
    case 'collection':
      title = 'Collection Overview Report';
      break;
    case 'conservation':
      title = 'Conservation Status Report';
      break;
    case 'loan':
      title = 'Loan History Report';
      break;
    default:
      title = 'Database Report';
  }

  let html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 20px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
        }
        th {
          background-color: #f4f4f4;
        }
        tr:nth-child(even) {
          background-color: #f9f9f9;
        }
      </style>
    </head>
    <body>
      <h1>${title}</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Details</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
  `;

  // Loop through the data and add rows to the table
  data.forEach((row) => {
    html += `
      <tr>
        <td>${row.id}</td>
        <td>${row.name}</td>
        <td>${row.details}</td>
        <td>${row.date}</td>
      </tr>
    `;
  });

  // Close the HTML
  html += `
        </tbody>
      </table>
    </body>
    </html>
  `;

  return html;
}

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});