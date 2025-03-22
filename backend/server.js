const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Sponge12368!",
  database: "mydb",
  waitForConnections: true,
  connectionLimit: 30,
  queueLimit: 0,
});

const promisePool = pool.promise();

// Function to delete a record
const deleteRecord = async (table, column, req, res) => {
  const { recordID } = req.body;
  try {
    await promisePool.query(`DELETE FROM ${table} WHERE ${column} = ?`, [
      recordID,
    ]);
    res.status(200).json({ message: "Deletion successful" });
  } catch (err) {
    res.status(500).json({ message: "Database error" });
    console.log("Error submitting deletion form.", err);
  }
};

// Endpoint to delete an artifact
app.delete("/api/artifact/delete/", async (req, res) => {
  deleteRecord("artifacts", "artifact_id", req, res);
});

// Endpoint to delete an artist
app.delete("/api/artist/delete/", async (req, res) => {
  deleteRecord("artists", "artist_id", req, res);
});

// Endpoint to delete an employee
app.delete("/api/employee/delete", async (req, res) => {
  deleteRecord("employees", "employee_id", req, res);
});

// Endpoint to generate a report
app.get("/api/report", async (req, res) => {
  const { type } = req.query; // Get the report type from the query parameter

  let query;
  let title;
  switch (type) {
    case "collection":
      query = `
        SELECT Artifact_ID, Artifact_Name, Artifact_Description, Value
        FROM artifacts
      `; // Replace with your collection table query
      title = "Collection Overview Report";
      break;
    case "exhibits":
      query = `
        SELECT Exhibit_ID, Exhibit_Name, Description, Start_Date, Exhibit_Type
        FROM exhibits
      `; // Replace with your exhibits table query
      title = "Exhibit Status Report";
      break;
    case "employee":
      query = `
        SELECT Employee_ID, Employee_Name, Address, Salary, Work_Email
        FROM employees
      `; // Replace with your employee table query
      title = "Employee History Report";
      break;
    default:
      return res.status(400).send("Invalid report type");
  }

  try {
    // Execute the SQL query
    const [results] = await promisePool.query(query);

    // Generate the HTML report
    const htmlReport = generateHTMLReport(results, title);

    // Send the HTML report as a response
    res.send(htmlReport);
  } catch (err) {
    console.error("Error executing query:", err);
    res.status(500).send("Error executing query");
  }
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
    html += columns.map((column) => `<th>${column}</th>`).join("");
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
        ${Object.values(row).map((value) => `<td>${value}</td>`).join("")}
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