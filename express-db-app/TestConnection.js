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
  let columns;
  switch (type) {
    case 'Collection':
      query = 'SELECT * FROM artifacts'; // Replace with your collection table query
      columns = ['Artifact_ID', 'Artifact_Name', 'Artifact_Description', 'Artist_ID']; // Replace with your collection table columns
      break;
    case 'Exhibits':
      query = 'SELECT * FROM exhibits'; // Replace with your conservation table query
      columns = ['Exhibit_ID', 'Exhibit_Name', 'Description', 'Start_Date', 'End_Date']; // Replace with your conservation table columns
      break;
    case 'Employee':
      query = 'SELECT * FROM employees'; // Replace with your loan table query
      columns = ['Employee_ID', 'Employee_Name', 'Work_Email', 'SSN', 'Hiring_Date', 'Address']; // Replace with your loan table columns
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

    // Send the data and columns as a JSON response
    res.json({ columns, data: results });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});