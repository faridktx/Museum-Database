const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 3000;

// Enable CORS
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
  let title;
  switch (type) {
    case 'Collection':
      query = `
        SELECT Artifact_ID, Artifact_Name, Artifact_Description, Acquisition_Type, Acquisition_Date
        FROM artifacts
      `; // Replace with your collection table query
      title = 'Collection Overview Report';
      break;
    case 'Exhibits':
      query = `
        SELECT Exhibit_ID, Exhibit_Name, Description, Exhibit_Type
        FROM exhibits
      `; // Replace with your conservation table query
      title = 'Exhibit Status Report';
      break;
    case 'Employee':
      query = `
        SELECT Employee_ID, Employee_name, Address, Hiring_Date, SSN
        FROM employees
      `; // Replace with your loan table query
      title = 'Employee Report';
      break;
    default:
      return res.status(400).send('Invalid report type');
  }

  // Execute the SQL query
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err.stack);
      res.status(500).send('Error executing query');
      return;
    }

    // Generate the HTML report
    const htmlReport = generateHTMLReport(results, title);

    // Send the HTML report as a response
    res.send(htmlReport);
  });
});

// Function to generate HTML report
function generateHTMLReport(data, title) {
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
  `;

  // Generate table headers dynamically based on the keys of the first row
  if (data.length > 0) {
    const columns = Object.keys(data[0]);
    html += columns.map((column) => `<th>${column}</th>`).join('');
  }

  html += `
          </tr>
        </thead>
        <tbody>
  `;

  // Generate table rows dynamically
  data.forEach((row) => {
    html += `
      <tr>
        ${Object.values(row).map((value) => `<td>${value}</td>`).join('')}
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