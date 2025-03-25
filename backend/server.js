import express from "express";
import mysql from "mysql2";
import sql from 'mssql'
import cors from "cors";
import dotenv from "dotenv";
import { body, validationResult } from "express-validator";
import { ACQUISITIONTYPES, ROLES, NATIONALITIES } from "../shared/constants.js";

dotenv.config({ path: "./backend/.env" });
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// MSSQL Connection Pool Configuration
const sqlConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_HOST,
  database: process.env.DB_NAME,
  port: 1433,
  options: {
    encrypt: true,
    trustServerCertificate: false,
    enableArithAbort: true
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

const pool = await sql.connect(sqlConfig);
const promisePool = new sql.ConnectionPool(sqlConfig);

const validationErrorCheck = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ errors: errors.array().map((err) => err.msg) });
  }
};

const executeSQLReturn = async (res, query) => {
  try {
    const result = await pool.request().query(query);
    return result.recordset;
  } catch (err) {
    res.status(500).json({ errors: ["Database error"] });
    console.log("Error retrieving entires...");
  }
};

const executeSQLQuery = async (res, query, fields) => {
  const request = pool.request();

  try {
    // Add all fields as parameters
    for (const [key, value] of Object.entries(fields)) {
      let type;
      
      // Determine parameter type
      switch (typeof value) {
        case 'number':
          type = Number.isInteger(value) ? sql.Int : sql.Decimal;
          break;
        case 'string':
          type = sql.NVarChar;
          break;
        case 'boolean':
          type = sql.Bit;
          break;
        default:
          if (value instanceof Date) {
            type = sql.DateTime;
          } else if (value === null || value === undefined) {
            type = sql.NVarChar;
          } else {
            type = sql.NVarChar;
          }
      }
      
      request.input(key, type, value !== null && value !== undefined ? value : null);
    }

    await request.query(query);
    return { success: true };
  } catch (error) {
    console.error('Database error:', error);
    return { success: false, error };
  }
}

const deleteRecord = async (table, column, recordID, res) => {
  const query = `DELETE FROM ${table} WHERE ${column} = ?`;
  await executeSQLQuery(res, query, [recordID]);
};

const insertRecord = async (table, res, fields) => {
  try {
    // Determine if we have an identity column (assuming it's named 'id' or ends with '_ID')
    const hasIdentityColumn = fields.some(f => 
      f.column.toLowerCase() === 'id' || 
      f.column.toUpperCase().endsWith('_ID')
    );

    // Build the column list and parameter placeholders
    const columns = fields.map(field => `[${field.column}]`).join(', ');
    const parameters = fields.map((_, index) => `@param${index}`).join(', ');
    
    // Create the request
    const request = pool.request();
    
    // Add each field as a parameter
    fields.forEach((field, index) => {
      const paramName = `param${index}`;
      const value = field.value !== undefined ? field.value : null;
      
      // Determine the appropriate SQL type
      let sqlType;
      if (value === null) {
        sqlType = sql.Int; // Default type for NULL in identity columns
      } else {
        switch (typeof value) {
          case 'number':
            sqlType = Number.isInteger(value) ? sql.Int : sql.Decimal;
            break;
          case 'string':
            sqlType = sql.NVarChar;
            break;
          case 'boolean':
            sqlType = sql.Bit;
            break;
          default:
            if (value instanceof Date) {
              sqlType = sql.DateTime;
            } else {
              sqlType = sql.NVarChar;
            }
        }
      }
      
      request.input(paramName, sqlType, value);
    });

    // Build the query with conditional IDENTITY_INSERT handling
    let query = `INSERT INTO ${table} (${columns}) VALUES (${parameters}); `;


    // Execute the query
    const result = await request.query(query);
    
    // Return success response
    res.status(200).json({
      success: true,
      rowsAffected: result.rowsAffected[0]
    });
    
  } catch (error) {
    console.error('Error inserting record:', error);
    res.status(500).json({
      success: false,
      message: 'Error inserting record',
      error: error.message,
      details: {
        number: error.number,
        lineNumber: error.lineNumber,
        state: error.state
      }
    });
  }
};

const modifyRecord = async (res, id, id_column, table, fields) => {
  let setVariables = [];
  let setQueries = [];
  fields.forEach((field) => {
    if (field.value) {
      setQueries.push(`${field.column} = ?`);
      setVariables.push(field.value);
    }
  });
  if (setQueries) {
    let setQuery = setQueries.join(", ");
    let query = `UPDATE ${table} SET ${setQuery} WHERE ${id_column} = ?`;
    setVariables.push(id);
    await executeSQLQuery(res, query, setVariables);
  } else {
    res
      .status(400)
      .json({ errors: ["No fields to be modified were provided"] });
  }
};

app.get("/api/getartists/", async (_req, res) => {
  let query = "SELECT artist_id as id, artist_name as name FROM artists";
  const data = await executeSQLReturn(res, query);
  res.status(200).json(data);
});

app.get("/api/getexhibits/", async (_req, res) => {
  let query = "SELECT exhibit_id as id, exhibit_name as name FROM exhibits";
  const data = await executeSQLReturn(res, query);
  res.status(200).json(data);
});

app.delete(
  "/api/artifact/delete/",
  [
    body("artifactID")
      .toInt()
      .isInt()
      .withMessage("Artifact ID must be an integer."),
  ],
  async (req, res) => {
    if (validationErrorCheck(req, res)) return;
    const { artifactID } = req.body;
    await deleteRecord("artifacts", "artifact_id", artifactID, res);
  },
);

app.delete(
  "/api/artist/delete/",
  [
    body("artistID")
      .toInt()
      .isInt()
      .withMessage("Artist ID must be an integer"),
  ],
  async (req, res) => {
    if (validationErrorCheck(req, res)) return;
    const { artistID } = req.body;
    await deleteRecord("artists", "artist_id", artistID, res);
  },
);

app.delete(
  "/api/employee/delete",
  [
    body("employeeID")
      .toInt()
      .isInt()
      .withMessage("Employee ID must be an integer"),
  ],
  async (req, res) => {
    if (validationErrorCheck(req, res)) return;
    const { employeeID } = req.body;
    await deleteRecord("employees", "employee_id", employeeID, res);
  },
);

app.patch(
  "/api/artifact/modify/",
  [
    body("artifactID")
      .toInt()
      .isInt()
      .withMessage("Artifact ID must be an integer."),
    body("exhibitID")
      .optional({ checkFalsy: true })
      .toInt()
      .isInt()
      .withMessage("Exhibit ID must be an integer"),
    body("artistID")
      .optional({ checkFalsy: true })
      .toInt()
      .isInt()
      .withMessage("Artist ID must be an integer"),
    body("artifactName")
      .optional({ checkFalsy: true })
      .custom((value) => !/\d/.test(value))
      .withMessage("Artifact name must not contain digits"),
    body("acquisitionDate")
      .optional({ checkFalsy: true })
      .matches(/^\d{4}-\d{2}-\d{2}$/)
      .withMessage("Acquisition date must be in the format YYYY-MM-DD")
      .isISO8601()
      .withMessage("Acquisition date must be a valid date"),
    body("acquisitionValue")
      .optional({ checkFalsy: true })
      .toInt()
      .isInt()
      .withMessage("Acquisition value must be a number"),
    body("acquisitionType")
      .optional({ checkFalsy: true })
      .isIn(ACQUISITIONTYPES)
      .withMessage("Acquisition type must be one of the given options"),
    body("creationDate")
      .optional({ checkFalsy: true })
      .matches(/^\d{4}-\d{2}-\d{2}$/)
      .withMessage("Acquisition date must be in the format YYYY-MM-DD")
      .isISO8601()
      .withMessage("Acquisition date must be a valid date"),
    body("description").optional({ checkFalsy: true }),
  ],
  async (req, res) => {
    if (validationErrorCheck(req, res)) return;
    const {
      artifactID,
      exhibitID,
      artistID,
      artifactName,
      acquisitionDate,
      acquisitionValue,
      acquisitionType,
      creationDate,
      description,
    } = req.body;
    const fields = [
      { column: "artifact_name", value: artifactName },
      { column: "artist_id", value: artistID },
      { column: "exhibit_id", value: exhibitID },
      { column: "acquisition_date", value: acquisitionDate },
      { column: "value", value: acquisitionValue },
      { column: "acquisition_date", value: acquisitionDate },
      { column: "acquisition_type", value: acquisitionType },
      { column: "creation_date", value: creationDate },
      { column: "artifact_description", value: description },
    ];
    await modifyRecord(res, artifactID, "artifact_id", "artifacts", fields);
  },
);

app.patch(
  "/api/artist/modify/",
  [
    body("artistID")
      .toInt()
      .isInt()
      .withMessage("Artist ID must be an integer"),
    body("artistName")
      .optional({ checkFalsy: true })
      .custom((value) => !/\d/.test(value))
      .withMessage("Artist name must not contain digits"),
    body("nationality")
      .optional({ checkFalsy: true })
      .isIn(NATIONALITIES)
      .withMessage("Nationality must be one of the specified options"),
    body("birthDate")
      .optional({ checkFalsy: true })
      .matches(/^\d{4}-\d{2}-\d{2}$/)
      .withMessage("Birth date must be in the format YYYY-MM-DD")
      .isISO8601()
      .withMessage("Birth date must be a valid date"),
    body("deathDate")
      .optional({ checkFalsy: true })
      .matches(/^\d{4}-\d{2}-\d{2}$/)
      .withMessage("Death date must be in the format YYYY-MM-DD")
      .isISO8601()
      .withMessage("Death date must be a valid date"),
  ],
  async (req, res) => {
    if (validationErrorCheck(req, res)) return;
    const { artistID, artistName, nationality, birthDate, deathDate } =
      req.body;
    const fields = [
      { column: "artist_name", value: artistName },
      { column: "nationality", value: nationality },
      { column: "birth_date", value: birthDate },
      { column: "death_date", value: deathDate },
    ];
    await modifyRecord(res, artistID, "artist_id", "artists", fields);
  },
);

app.patch(
  "/api/employee/modify/",
  [
    body("employeeID")
      .toInt()
      .isInt()
      .withMessage("Employee ID must be an integer"),
    body("employeeName")
      .optional({ checkFalsy: true })
      .custom((value) => !/\d/.test(value))
      .withMessage("Employee name must not contain digits"),
    body("exhibitID")
      .optional({ checkFalsy: true })
      .toInt()
      .isInt()
      .withMessage("Exhibit ID mut be an integer"),
    body("ssn")
      .optional({ checkFalsy: true })
      .matches(/^\d{3}-\d{2}-\d{4}$/)
      .withMessage("SSN must be in the format XXX-XX-XXXX"),
    body("phoneNumber")
      .optional({ checkFalsy: true })
      .matches(/^\d{3}-\d{3}-\d{4}$/)
      .withMessage("Phone number must be in the format XXX-XXX-XXXX"),
    body("address")
      .optional({ checkFalsy: true })
      .isString()
      .withMessage("Address must be a string"),
    body("personalEmail")
      .optional({ checkFalsy: true })
      .isEmail()
      .withMessage("Personal email must be a valid email"),
    body("workEmail")
      .optional({ checkFalsy: true })
      .isEmail()
      .withMessage("Work email must be a valid email"),
    body("birthDate")
      .optional({ checkFalsy: true })
      .matches(/^\d{4}-\d{2}-\d{2}$/)
      .withMessage("Birth date must be in the format YYYY-MM-DD")
      .isISO8601()
      .withMessage("Birth date must be a valid date"),
    body("hiringDate")
      .optional({ checkFalsy: true })
      .matches(/^\d{4}-\d{2}-\d{2}$/)
      .withMessage("Hiring date must be in the format YYYY-MM-DD")
      .isISO8601()
      .withMessage("Hiring date must be a valid date"),
    body("salary")
      .optional({ checkFalsy: true })
      .toInt()
      .isInt()
      .withMessage("Salary must be an integer"),
    body("role")
      .optional({ checkFalsy: true })
      .isIn(ROLES)
      .withMessage("Role must be one of the specified options"),
  ],
  async (req, res) => {
    if (validationErrorCheck(req, res)) return;
    const {
      employeeID,
      exhibitID,
      employeeName,
      ssn,
      phoneNumber,
      address,
      personalEmail,
      workEmail,
      birthDate,
      hiringDate,
      firedDate,
      salary,
      role,
    } = req.body;
    if (role) {
      isGiftShop = role === "Retail";
    }
    const fields = [
      { column: "employee_name", value: employeeName },
      { column: "exhibit_id", value: exhibitID },
      { column: "ssn", value: ssn },
      { column: "personal_email", value: personalEmail },
      { column: "work_email", value: workEmail },
      { column: "phone_number", value: phoneNumber },
      { column: "birthdate", value: birthDate },
      { column: "hiring_date", value: hiringDate },
      { column: "role", value: role },
      { column: "fired_date", value: firedDate },
      { column: "salary", value: salary },
      { column: "address", value: address },
      { column: "is_giftshop", value: isGiftShop },
    ];
    await modifyRecord(res, employeeID, "employee_id", "employees", fields);
  },
);

app.post(
  "/api/artifact/insert/",
  [
    body("artifactName")
      .custom((value) => !/\d/.test(value))
      .withMessage("Artifact name must not contain digits"),
    body("exhibitID")
      .toInt()
      .isInt()
      .withMessage("Exhibit ID but be an integer"),
    body("artistID")
      .toInt()
      .isInt()
      .withMessage("Artist ID must be an integer"),
    body("description").optional({ checkFalsy: true }),
    body("creationDate")
      .optional({ checkFalsy: true })
      .matches(/^\d{4}-\d{2}-\d{2}$/)
      .withMessage("Acquisition date must be in the format YYYY-MM-DD")
      .isISO8601()
      .withMessage("Acquisition date must be a valid date"),
    body("acquisitionValue")
      .toInt()
      .isInt()
      .withMessage("Acquisition value must be a number"),
    body("acquisitionType")
      .isIn(ACQUISITIONTYPES)
      .withMessage("Acquisition type must be one of the given options"),
    body("acquisitionDate")
      .matches(/^\d{4}-\d{2}-\d{2}$/)
      .withMessage("Acquisition date must be in the format YYYY-MM-DD")
      .isISO8601()
      .withMessage("Acquisition date must be a valid date"),
  ],
  async (req, res) => {
    if (validationErrorCheck(req, res)) return;
    const {
      artifactName,
      exhibitID,
      artistID,
      acquisitionDate,
      acquisitionValue,
      acquisitionType,
      creationDate,
      description,
    } = req.body;
    const fields = [
      { column: "artist_id", value: artistID },
      { column: "exhibit_id", value: exhibitID },
      { column: "artifact_name", value: artifactName },
      { column: "artifact_description", value: description },
      { column: "created_date", value: creationDate },
      { column: "value", value: acquisitionValue },
      { column: "acquisition_type", value: acquisitionType },
      { column: "acquisition_date", value: acquisitionDate },
    ];
    await insertRecord("artifacts", res, fields);
  },
);

app.post(
  "/api/artist/insert",
  [
    body("artistName")
      .custom((value) => !/\d/.test(value))
      .withMessage("Artist name must not contain digits"),
    body("nationality")
      .isIn(NATIONALITIES)
      .withMessage("Nationality must be one of the specified options"),
    body("birthDate")
      .optional({ checkFalsy: true })
      .matches(/^\d{4}-\d{2}-\d{2}$/)
      .withMessage("Birth date must be in the format YYYY-MM-DD")
      .isISO8601()
      .withMessage("Birth date must be a valid date"),
    body("deathDate")
      .optional({ checkFalsy: true })
      .matches(/^\d{4}-\d{2}-\d{2}$/)
      .withMessage("Death date must be in the format YYYY-MM-DD")
      .isISO8601()
      .withMessage("Death date must be a valid date"),
  ],
  async (req, res) => {
    if (validationErrorCheck(req, res)) return;
    const { artistName, nationality, birthDate, deathDate } = req.body;
    const fields = [
      { column: "artist_name", value: artistName },
      { column: "nationality", value: nationality },
      { column: "birth_date", value: birthDate },
      { column: "death_date", value: deathDate },
    ];
    await insertRecord("artists", res, fields);
  },
);

app.post(
  "/api/employee/insert",
  [
    body("employeeName")
      .custom((value) => !/\d/.test(value))
      .withMessage("Employee name must not contain digits"),
    body("exhibitID")
      .toInt()
      .isInt()
      .withMessage("Exhibit ID must be an integer"),
    body("ssn")
      .matches(/^\d{3}-\d{2}-\d{4}$/)
      .withMessage("SSN must be in the format XXX-XX-XXXX"),
    body("phoneNumber")
      .matches(/^\d{3}-\d{3}-\d{4}$/)
      .withMessage("Phone number must be in the format XXX-XXX-XXXX"),
    body("address").isString().withMessage("Address must be a string"),
    body("personalEmail")
      .isEmail()
      .withMessage("Personal email must be a valid email"),
    body("workEmail").isEmail().withMessage("Work email must be a valid email"),
    body("birthDate")
      .matches(/^\d{4}-\d{2}-\d{2}$/)
      .withMessage("Birth date must be in the format YYYY-MM-DD")
      .isISO8601()
      .withMessage("Birth date must be a valid date"),
    body("hiringDate")
      .matches(/^\d{4}-\d{2}-\d{2}$/)
      .withMessage("Hiring date must be in the format YYYY-MM-DD")
      .isISO8601()
      .withMessage("Hiring date must be a valid date"),
    body("salary").toInt().isInt().withMessage("Salary must be an integer"),
    body("role")
      .isIn(ROLES)
      .withMessage("Role must be one of the specified options"),
  ],
  async (req, res) => {
    if (validationErrorCheck(req, res)) return;
    const {
      employeeName,
      exhibitID,
      ssn,
      phoneNumber,
      address,
      personalEmail,
      workEmail,
      birthDate,
      hiringDate,
      salary,
      role,
    } = req.body;
    const isGiftShop = role === "Retail";
    const fields = [
      { column: "employee_name", value: employeeName },
      { column: "ssn", value: ssn },
      { column: "phone_number", value: phoneNumber },
      { column: "personal_email", value: personalEmail },
      { column: "work_email", value: workEmail },
      { column: "address", value: address },
      { column: "birthdate", value: birthDate },
      { column: "hiring_date", value: hiringDate },
      { column: "fired_date", value: null },
      { column: "salary", value: salary },
      { column: "role", value: role },
      { column: "is_giftshop", value: isGiftShop },
      { column: "exhibit_id", value: exhibitID },
    ];
    await insertRecord("employees", res, fields);
  },
);



app.get("/api/report", async (req, res) => {
  const { type } = req.query;

  let query;
  let title;
  switch (type) {
    case "collection":
      query = `
        SELECT 
        a.Artifact_ID, 
        a.Artifact_Name, 
        a.Artifact_Description, 
        a.Value, 
        ar.Artist_Name, 
        ar.Nationality
        FROM artifacts a
        JOIN artists ar ON a.Artist_ID = ar.Artist_ID;
      `;
      title = "Collection Overview Report";
      break;
    case "exhibits":
      query = `
        SELECT 
        e.Exhibit_ID, 
        e.Exhibit_Name, 
        e.Description, 
        e.Start_Date, 
        e.Exhibit_Type, 
        ev.Event_Name, 
        ev.Start_Date
        FROM exhibits e
        JOIN events ev ON e.Exhibit_ID = ev.Included_Exhibits;
      `;
      title = "Exhibit Status Report";
      break;
    case "employee":
      query = `
        SELECT 
        emp.Employee_ID, 
        emp.Employee_Name, 
        emp.Address, 
        emp.Salary, 
        emp.Work_Email, 
        e.Exhibit_Name
        FROM employees emp
        JOIN exhibits e ON emp.Exhibit_ID = e.Exhibit_ID;
      `;
      title = "Employee History Report";
      break;
    default:
      return res.status(400).send("Invalid report type");
  }

  try {
    const pool = await sql.connect(sqlConfig);
    const result = await pool.request().query(query);
    const htmlReport = generateHTMLReport(result.recordset, title);
    res.send(htmlReport);
  } catch (err) {
    console.error("Error executing report query:", err);
    res.status(500).json({ error: "Error generating report" });
  }
});

// HTML generator function
function generateHTMLReport(data, title) {
  if (!data || data.length === 0) {
    return `
      <!DOCTYPE html>
      <html>
      <head><title>${title}</title></head>
      <body>
        <h1>${title}</h1>
        <p>No data available</p>
      </body>
      </html>
    `;
  }

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f4f4f4; }
        tr:nth-child(even) { background-color: #f9f9f9; }
      </style>
    </head>
    <body>
      <h1>${title}</h1>
      <table>
        <thead>
          <tr>
            ${Object.keys(data[0]).map(col => `<th>${col}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${data.map(row => `
            <tr>
              ${Object.values(row).map(val => `<td>${val !== null ? val : ''}</td>`).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
    </body>
    </html>
  `;
}

app.post(
  "/api/login",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password").notEmpty().withMessage("Password is required"), // you can relax this if not using passwords yet
  ],
  async (req, res) => {
    if (validationErrorCheck(req, res)) return;

    const { email, password } = req.body;

    try {
      const query = `SELECT * FROM employees WHERE work_email = ?`;
      const [rows] = await promisePool.query(query, [email]);

      if (rows.length === 0) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const user = rows[0];
      console.log("User from DB:", user);

      // TEMP: Password checking is skipped here
      // In production: Compare with hashed password (e.g., bcrypt.compare(password, user.password))

      return res.status(200).json({
        id: user.employee_id,
        name: user.employee_name,
        role: user.role,
        email: user.work_email,
      });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  },
);
