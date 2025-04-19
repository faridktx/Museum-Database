import express from "express";
import mysql from "mysql2";
import cors from "cors";
import dotenv from "dotenv";
// import { body, validationResult } from "express-validator";
// import { ACQUISITIONTYPES, ROLES, NATIONALITIES } from "./constants.js";
// import { clerkClient } from "@clerk/clerk-sdk-node";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  port: process.env.DB_PORT,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 30,
  queueLimit: 0,
});

const promisePool = pool.promise();

app.get("/api/getcustomer/", async (req, res) => {
  const id = req.query.id;
  if (!id) {
    return res
      .status(401)
      .json({ success: false, errors: ["Do not have authorized access"] });
  }
  const query = `
  SELECT
    full_name as name,
    email as email,
    phone_Number as phone,
    address as address,
    membership_type as membershipType,
    DATE_FORMAT(join_date, '%Y-%m-%d') as joinDate,
    DATE_FORMAT(DATE_ADD(join_date, INTERVAL 1 YEAR), '%Y-%m-%d') as membershipExpires
  FROM customers WHERE customer_id = ?
  `;
  try {
    const [rows] = await promisePool.query(query, [id]);
    res.status(200).json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, errors: ["Database error"] });
    console.log("Error retrieving entires...");
    console.log(err);
  }
});

app.get("/api/gettransactions/", async (req, res) => {
  const id = req.query.id;
  if (!id) {
    return res
      .status(401)
      .json({ success: false, errors: ["Do not have authorized access"] });
  }

  const query = `
  SELECT 
    s.sale_id AS id,
    DATE_FORMAT(s.sale_date, '%Y-%m-%d') AS date,
    'Gift Shop' AS type,
    JSON_ARRAYAGG(i.item_name) AS items,
    s.total_cost AS total,
    'Completed' AS status
  FROM gift_shop_sales s
  JOIN gift_shop_inventory i ON s.item_id = i.item_id
  WHERE s.guest_id = ?
  GROUP BY s.sale_id, s.sale_date, s.total_cost
  `;
  try {
    const [rows] = await promisePool.query(query, [id]);
    res.status(200).json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, errors: ["Database error"] });
    console.log("Error retrieving entires...");
    console.log(err);
  }
});

app.get("/api/gettickets/", async (req, res) => {
  const id = req.query.id;
  if (!id) {
    return res
      .status(401)
      .json({ success: false, errors: ["Do not have authorized access"] });
  }

  const query = `
  SELECT 
    t.ticket_id AS id,
    DATE_FORMAT(t.purchase_date, '%Y-%m-%d') AS date,
    t.ticket_type AS type,
    t.quantity,
    (t.quantity * tt.price) AS total,
    'Used' AS status
  FROM tickets t
  JOIN ticket_types tt ON t.ticket_type = tt.ticket_type
  WHERE t.guest_id = ?
  `;
  try {
    const [rows] = await promisePool.query(query, [id]);
    res.status(200).json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, errors: ["Database error"] });
    console.log("Error retrieving entires...");
    console.log(err);
  }
});

app.get("/api/getexhibittickets/", async (req, res) => {
  const id = req.query.id;
  if (!id) {
    return res
      .status(401)
      .json({ success: false, errors: ["Do not have authorized access"] });
  }

  const query = `
  SELECT 
    t.ticket_id AS id,
    DATE_FORMAT(t.purchase_date, '%Y-%m-%d') AS date,
    e.exhibit_name AS name,
    t.quantity,
    t.quantity * 25.00 AS total,
    'Used' AS status
  FROM exhibit_tickets t
  JOIN exhibits e ON t.exhibit_id = e.exhibit_id
  WHERE t.guest_id = ?;
  `;
  try {
    const [rows] = await promisePool.query(query, [id]);
    res.status(200).json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, errors: ["Database error"] });
    console.log("Error retrieving entires...");
    console.log(err);
  }
});

app.patch("/api/setcustomerinfo/", async (req, res) => {
  const id = req.query.id;
  if (!id) {
    return res
      .status(401)
      .json({ success: false, errors: ["Do not have authorized access"] });
  }

  const { name, email, phone, address } = req.body;
  const query = `
    UPDATE customers
    SET 
      full_name = ?,
      email = ?,
      phone_number = ?,
      address = ?
    WHERE customer_id = ?;
  `;
  try {
    await promisePool.query(query, [name, email, phone, address, id]);
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, errors: ["Database error"] });
    console.log("Error retrieving entires...");
    console.log(err);
  }
});

app.get("/api/getgiftshop/", async (req, res) => {
  const id = req.query.id;
  if (!id) {
    return res
      .status(401)
      .json({ success: false, errors: ["Do not have authorized access"] });
  }

  const query = `
  SELECT
    employee_name as name,
    role as title,
    personal_email as email,
    phone_number as phone,
    DATE_FORMAT(hiring_date, '%Y-%m-%d') as startDate
  FROM employees WHERE access_id = ?
  `;
  try {
    const [rows] = await promisePool.query(query, [id]);
    res.status(200).json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, errors: ["Database error"] });
    console.log("Error retrieving entires...");
    console.log(err);
  }
});

app.patch("/api/setemployeeinfo/", async (req, res) => {
  const id = req.query.id;
  if (!id) {
    return res
      .status(401)
      .json({ success: false, errors: ["Do not have authorized access"] });
  }

  const { name, email, phone } = req.body;
  const query = `
    UPDATE employees
    SET 
      employee_name = ?,
      personal_email = ?,
      phone_number = ?
    WHERE access_id = ?
  `;
  try {
    await promisePool.query(query, [name, email, phone, id]);
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, errors: ["Database error"] });
    console.log("Error retrieving entires...");
    console.log(err);
  }
});

app.get("/api/getinventory/", async (req, res) => {
  const id = req.query.id;
  if (!id) {
    return res
      .status(401)
      .json({ success: false, errors: ["Do not have authorized access"] });
  }

  const query = `
  SELECT 
    item_id AS id,
    item_name AS name,
    category,
    description,
    unit_price AS price,
    quantity AS inStock,
    supplier
  FROM gift_shop_inventory
  `;
  try {
    const [rows] = await promisePool.query(query);
    res.status(200).json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, errors: ["Database error"] });
    console.log("Error retrieving entires...");
    console.log(err);
  }
});

app.get("/api/getsales/", async (req, res) => {
  const id = req.query.id;
  if (!id) {
    return res
      .status(401)
      .json({ success: false, errors: ["Do not have authorized access"] });
  }

  const query = `
  SELECT 
    s.sale_id AS id,
    DATE_FORMAT(s.sale_date, '%Y-%m-%d') AS date,
    i.item_id AS product_id,
    i.item_name AS product_name,
    s.quantity,
    i.unit_price AS price,
    c.full_name AS customer,
    s.total_cost AS total,
    'Credit Card' AS paymentMethod,
    'Completed' AS status
  FROM gift_shop_sales s
  JOIN gift_shop_inventory i ON s.item_id = i.item_id
  JOIN customers c ON s.guest_id = c.customer_id
  ORDER BY s.sale_id, i.item_id;
  `;
  try {
    const [rows] = await promisePool.query(query);
    res.status(200).json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, errors: ["Database error"] });
    console.log("Error retrieving entires...");
    console.log(err);
  }
});

app.delete("/api/deleteinventory/", async (req, res) => {
  const id = req.query.id;
  if (!id) {
    return res
      .status(401)
      .json({ success: false, errors: ["Do not have authorized access"] });
  }

  const { itemId } = req.body;
  const query = `DELETE FROM gift_shop_inventory WHERE item_id = ?`;
  try {
    await promisePool.query(query, [itemId]);
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, errors: ["Database error"] });
    console.log("Error retrieving entires...");
    console.log(err);
  }
});

app.post("/api/addinventory/", async (req, res) => {
  const id = req.query.id;
  if (!id) {
    return res
      .status(401)
      .json({ success: false, errors: ["Do not have authorized access"] });
  }

  const { name, category, description, price, inStock, supplier } = req.body;
  const query = `
  INSERT INTO gift_shop_inventory (
    item_name,
    description,
    category,
    quantity,
    unit_price
    supplier
  ) VALUES (?, ?, ?, ?, ?, ?, ?);
  `;
  try {
    await promisePool.query(query, [
      name,
      description,
      category,
      inStock,
      price,
      supplier,
    ]);
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, errors: ["Database error"] });
    console.log("Error retrieving entires...");
    console.log(err);
  }
});

app.patch("/api/setinventory/", async (req, res) => {
  const userId = req.query.id;
  if (!userId) {
    return res
      .status(401)
      .json({ success: false, errors: ["Do not have authorized access"] });
  }

  const { id, name, category, price, inStock, supplier } = req.body;
  const query = `
    UPDATE gift_shop_inventory
    SET 
      item_name = ?,
      category = ?,
      unit_price = ?,
      quantity = ?,
      supplier = ?
    WHERE item_id = ?
  `;
  try {
    await promisePool.query(query, [
      name,
      category,
      price,
      inStock,
      id,
      supplier,
    ]);
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, errors: ["Database error"] });
    console.log("Error retrieving entires...");
    console.log(err);
  }
});

app.get("/api/getcurator/", async (req, res) => {
  const id = req.query.id;
  if (!id) {
    return res
      .status(401)
      .json({ success: false, errors: ["Do not have authorized access"] });
  }

  const query = `
  SELECT
    employee_id as employeeId,
    employee_name as name,
    role as title,
    personal_email as email,
    phone_number as phone,
    DATE_FORMAT(hiring_date, '%Y-%m-%d') as joinDate
  FROM employees WHERE access_id = ?
  `;
  try {
    const [rows] = await promisePool.query(query, [id]);
    res.status(200).json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, errors: ["Database error"] });
    console.log("Error retrieving entires...");
    console.log(err);
  }
});

app.patch("/api/setcuratorinfo/", async (req, res) => {
  const id = req.query.id;
  if (!id) {
    return res
      .status(401)
      .json({ success: false, errors: ["Do not have authorized access"] });
  }

  const { name, email, phone } = req.body;
  const query = `
    UPDATE employees
    SET 
      employee_name = ?,
      personal_email = ?,
      phone_number = ?
    WHERE access_id = ?
  `;
  try {
    await promisePool.query(query, [name, email, phone, id]);
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, errors: ["Database error"] });
    console.log("Error retrieving entires...");
    console.log(err);
  }
});

app.get("/api/getartists/", async (req, res) => {
  const id = req.query.id;
  if (!id) {
    return res
      .status(401)
      .json({ success: false, errors: ["Do not have authorized access"] });
  }

  const query = `
  SELECT 
    a.artist_id AS id,
    a.artist_name AS name,
    birth_year AS birthYear,
    death_year AS deathYear,
    a.nationality,
    a.movement,
    a.notable_works AS notableWorks,
    a.biography
  FROM artists a
  `;
  try {
    const [rows] = await promisePool.query(query);
    res.status(200).json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, errors: ["Database error"] });
    console.log("Error retrieving entires...");
    console.log(err);
  }
});

app.patch("/api/setartist/", async (req, res) => {
  const userId = req.query.id;
  if (!userId) {
    return res
      .status(401)
      .json({ success: false, errors: ["Do not have authorized access"] });
  }

  const {
    id,
    name,
    birthYear,
    deathYear,
    nationality,
    movement,
    notableWorks,
    biography,
  } = req.body;
  const query = `
    UPDATE artists
    SET 
      artist_name = ?,
      nationality = ?,
      birth_year = ?,
      death_year = ?
    WHERE artist_id = ?
  `;
  try {
    await promisePool.query(query, [
      name,
      nationality,
      birthYear,
      deathYear,
      id,
    ]);
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, errors: ["Database error"] });
    console.log("Error retrieving entires...");
    console.log(err);
  }
});

app.delete("/api/deleteartist/", async (req, res) => {
  const id = req.query.id;
  if (!id) {
    return res
      .status(401)
      .json({ success: false, errors: ["Do not have authorized access"] });
  }

  const { artistId } = req.body;
  const query = `DELETE FROM artists WHERE artist_id = ?`;
  try {
    await promisePool.query(query, [artistId]);
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, errors: ["Database error"] });
    console.log("Error retrieving entires...");
    console.log(err);
  }
});

app.get("/api/getartifacts/", async (req, res) => {
  const id = req.query.id;
  if (!id) {
    return res
      .status(401)
      .json({ success: false, errors: ["Do not have authorized access"] });
  }

  const query = `
  SELECT 
    a.artifact_id AS id,
    ar.artist_id AS artistId,
    a.artifact_name AS title,
    ar.artist_name AS artist,
    a.created_year AS year,
    a.description,
    a.dimensions,
    a.medium,
    DATE_FORMAT(a.acquisition_date, '%M %d, %Y') AS acquisitionDate,
    a.value AS acquisitionValue,
    a.condition,
    a.needs_restoration AS needsRestoration,
    e.exhibit_name AS exhibitName
  FROM artifacts a
  JOIN artists ar ON a.artist_id = ar.artist_id
  JOIN exhibits e ON a.exhibit_id = e.exhibit_id;
  `;
  try {
    const [rows] = await promisePool.query(query);
    res.status(200).json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, errors: ["Database error"] });
    console.log("Error retrieving entires...");
    console.log(err);
  }
});

app.delete("/api/deleteartifact/", async (req, res) => {
  const id = req.query.id;
  if (!id) {
    return res
      .status(401)
      .json({ success: false, errors: ["Do not have authorized access"] });
  }

  const { artifactId } = req.body;
  const query = `DELETE FROM artifacts WHERE artifact_id = ?`;
  try {
    await promisePool.query(query, [artifactId]);
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, errors: ["Database error"] });
    console.log("Error retrieving entires...");
    console.log(err);
  }
});

app.patch("/api/setartifact/", async (req, res) => {
  const userId = req.query.id;
  if (!userId) {
    return res
      .status(401)
      .json({ success: false, errors: ["Do not have authorized access"] });
  }

  const {
    id,
    title,
    artistId,
    year,
    medium,
    dimensions,
    location,
    acquisitionDate,
    condition,
    needsRestoration,
  } = req.body;
  const query = `
    UPDATE artifacts
    SET 
      artifact_name = ?,
      artist_id = ?
    WHERE artifact_id = ?
  `;
  try {
    await promisePool.query(query, [title, artistId, id]);
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, errors: ["Database error"] });
    console.log("Error retrieving entires...");
    console.log(err);
  }
});

app.post("/api/addrestored/", async (req, res) => {
  const userId = req.query.id;
  if (!userId) {
    return res
      .status(401)
      .json({ success: false, errors: ["Do not have authorized access"] });
  }

  const { id, employeeId } = req.body;
  const query = `
    INSERT INTO restored (artifact_id, curator_id, date_marked, date_restored)
    SELECT ?, ?, ?, ?
    WHERE NOT EXISTS (
      SELECT 1 FROM restored
      WHERE artifact_id = ? AND curator_id = ? AND date_marked = ?
    )
  `;
  try {
    const dateMarked = new Date().toISOString().split("T")[0];
    await promisePool.query(query, [
      id,
      employeeId,
      dateMarked,
      null,
      id,
      employeeId,
      dateMarked,
    ]);
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, errors: ["Database error"] });
    console.log("Error retrieving entires...");
    console.log(err);
  }
});

app.patch("/api/setrestored/", async (req, res) => {
  const userId = req.query.id;
  if (!userId) {
    return res
      .status(401)
      .json({ success: false, errors: ["Do not have authorized access"] });
  }

  const { id, employeeId } = req.body;
  const query = `
    UPDATE restored
    SET date_restored = ?
    WHERE artifact_id = ? AND curator_id = ? AND date_restored IS NULL
  `;
  try {
    await promisePool.query(query, [
      new Date().toISOString().split("T")[0],
      id,
      employeeId,
    ]);
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, errors: ["Database error"] });
    console.log("Error retrieving entires...");
    console.log(err);
  }
});

app.post("/api/addartist/", async (req, res) => {
  const userId = req.query.id;
  if (!userId) {
    return res
      .status(401)
      .json({ success: false, errors: ["Do not have authorized access"] });
  }

  const {
    name,
    birthYear,
    deathYear,
    nationality,
    movement,
    notableWorks,
    biography,
  } = req.body;
  const query = `
    INSERT INTO artists (
      artist_name, birth_year, death_year, nationality, movement,
      biography, notable_works
    ) VALUES (?, ?, ?, ?, ?, ?, ?);
  `;
  try {
    await promisePool.query(query, [
      name,
      birthYear,
      deathYear,
      nationality,
      movement,
      biography,
      notableWorks,
    ]);
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, errors: ["Database error"] });
    console.log("Error retrieving entires...");
    console.log(err);
  }
});

app.post("/api/addartifact/", async (req, res) => {
  const userId = req.query.id;
  if (!userId) {
    return res
      .status(401)
      .json({ success: false, errors: ["Do not have authorized access"] });
  }

  const {
    title,
    artistId,
    exhibitId,
    createdYear,
    medium,
    description,
    dimensions,
    condition,
    acquisitionType,
    acquisitionValue,
    acquisitionDate,
    needsRestoration,
  } = req.body;
  const query = `
    INSERT INTO artifacts (
      artifact_name,
      exhibit_id,
      artist_id,
      medium,
      description,
      created_year,
      value,
      \`condition\`,
      dimensions,
      acquisition_type,
      acquisition_date,
      needs_restoration
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
  `;
  try {
    await promisePool.query(query, [
      title,
      artistId,
      exhibitId,
      createdYear,
      medium,
      description,
      dimensions,
      condition,
      acquisitionType,
      acquisitionValue,
      acquisitionDate,
      needsRestoration,
    ]);
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, errors: ["Database error"] });
    console.log("Error retrieving entires...");
    console.log(err);
  }
});

app.get("/api/getexhibitsmap/", async (req, res) => {
  const id = req.query.id;
  if (!id) {
    return res
      .status(401)
      .json({ success: false, errors: ["Do not have authorized access"] });
  }

  const query = `
  SELECT exhibit_id as id, exhibit_name as name FROM exhibits
  `;
  try {
    const [rows] = await promisePool.query(query);
    res.status(200).json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, errors: ["Database error"] });
    console.log("Error retrieving entires...");
    console.log(err);
  }
});

app.get("/api/getadmininfo/", async (req, res) => {
  const id = req.query.id;
  if (!id) {
    return res
      .status(401)
      .json({ success: false, errors: ["Do not have authorized access"] });
  }

  const query = `
  SELECT
    employee_name as name,
    role as title,
    personal_email as email,
    phone_number as phone,
    DATE_FORMAT(hiring_date, '%Y-%m-%d') as startDate
  FROM employees WHERE access_id = ?
  `;
  try {
    const [rows] = await promisePool.query(query, [id]);
    res.status(200).json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, errors: ["Database error"] });
    console.log("Error retrieving entires...");
    console.log(err);
  }
});

app.patch("/api/setadmininfo/", async (req, res) => {
  const id = req.query.id;
  if (!id) {
    return res
      .status(401)
      .json({ success: false, errors: ["Do not have authorized access"] });
  }

  const { name, email, phone } = req.body;
  const query = `
    UPDATE employees
    SET 
      employee_name = ?,
      personal_email = ?,
      phone_number = ?
    WHERE access_id = ?
  `;
  try {
    await promisePool.query(query, [name, email, phone, id]);
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, errors: ["Database error"] });
    console.log("Error retrieving entires...");
    console.log(err);
  }
});

app.post("/api/addemployee/", async (req, res) => {
  const id = req.query.id;
  if (!id) {
    return res
      .status(401)
      .json({ success: false, errors: ["Do not have authorized access"] });
  }

  const {
    name,
    ssn,
    phone,
    address,
    personalEmail,
    workEmail,
    birthDate,
    hiringDate,
    firedDate,
    hourlyRate,
    role,
  } = req.body;
  const query = `
    INSERT INTO employees (
      employee_name,
      ssn,
      phone_number,
      address,
      personal_email,
      work_email,
      birth_date,
      hiring_date,
      fired_date,
      salary,
      role
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  try {
    await promisePool.query(query, [
      name,
      ssn,
      phone,
      address,
      personalEmail,
      workEmail,
      birthDate,
      hiringDate,
      firedDate,
      hourlyRate,
      role,
    ]);
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, errors: ["Database error"] });
    console.log("Error retrieving entires...");
    console.log(err);
  }
});

app.get("/api/getemployees/", async (req, res) => {
  const id = req.query.id;
  if (!id) {
    return res
      .status(401)
      .json({ success: false, errors: ["Do not have authorized access"] });
  }

  const query = `
  SELECT 
      employee_id as id,
      employee_name as name,
      ssn,
      phone_number as phone,
      address,
      personal_email as personalEmail,
      work_email as workEmail,
      DATE_FORMAT(birth_date, '%Y-%m-%d') as birthDate,
      DATE_FORMAT(hiring_date, '%Y-%m-%d') as hiringDate,
      DATE_FORMAT(fired_date, '%Y-%m-%d') as firedDate,
      salary,
      role,
      CASE 
        WHEN fired_date IS NULL THEN 'active'
        ELSE 'inactive'
      END AS status
  FROM employees
  `;
  try {
    const [rows] = await promisePool.query(query);
    res.status(200).json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, errors: ["Database error"] });
    console.log("Error retrieving entires...");
    console.log(err);
  }
});

app.patch("/api/setemployee/", async (req, res) => {
  const userId = req.query.id;
  if (!userId) {
    return res
      .status(401)
      .json({ success: false, errors: ["Do not have authorized access"] });
  }

  const { id, name, workEmail, phone, role, startDate, salary } = req.body;
  const query = `
    UPDATE employees
    SET 
      employee_name = ?,
      work_email = ?,
      phone_number = ?,
      role = ?,
      hiring_date = ?,
      salary = ?
    WHERE employee_id = ?
  `;
  try {
    await promisePool.query(query, [
      name,
      workEmail,
      phone,
      role,
      startDate,
      salary,
      id,
    ]);
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, errors: ["Database error"] });
    console.log("Error retrieving entires...");
    console.log(err);
  }
});

app.delete("/api/deleteemployee/", async (req, res) => {
  const id = req.query.id;
  if (!id) {
    return res
      .status(401)
      .json({ success: false, errors: ["Do not have authorized access"] });
  }

  const { employeeId } = req.body;
  const query = `DELETE FROM employees WHERE employee_id = ?`;
  try {
    await promisePool.query(query, [employeeId]);
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, errors: ["Database error"] });
    console.log("Error retrieving entires...");
    console.log(err);
  }
});

app.get("/api/getexhibits/", async (req, res) => {
  const id = req.query.id;
  if (!id) {
    return res
      .status(401)
      .json({ success: false, errors: ["Do not have authorized access"] });
  }

  const query = `
  SELECT 
    e.exhibit_id AS id,
    e.exhibit_name AS title,
    DATE_FORMAT(e.start_date, '%Y-%m-%d') AS startDate,
    DATE_FORMAT(e.end_date, '%Y-%m-%d') AS endDate,
    e.description,
    CASE
      WHEN e.end_date < CURDATE() THEN 'past'
      WHEN e.start_date > CURDATE() THEN 'upcoming'
      ELSE 'ongoing'
    END AS status,
    15 AS ticketPrice,
    COUNT(DISTINCT t.guest_id) AS visitorCount,
    SUM(t.quantity) AS ticketsSold,
    SUM(t.quantity) * 15 AS revenue
  FROM exhibits e
  LEFT JOIN exhibit_tickets t ON e.exhibit_id = t.exhibit_id
  GROUP BY e.exhibit_id, e.exhibit_name, e.start_date, e.end_date, e.description
  `;
  try {
    const [rows] = await promisePool.query(query);
    res.status(200).json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, errors: ["Database error"] });
    console.log("Error retrieving entires...");
    console.log(err);
  }
});

app.delete("/api/deleteexhibit/", async (req, res) => {
  const id = req.query.id;
  if (!id) {
    return res
      .status(401)
      .json({ success: false, errors: ["Do not have authorized access"] });
  }

  const { exhibitId } = req.body;
  const query = `DELETE FROM exhibits WHERE exhibit_id = ?`;
  try {
    await promisePool.query(query, [exhibitId]);
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, errors: ["Database error"] });
    console.log("Error retrieving entires...");
    console.log(err);
  }
});

app.post("/api/addexhibit/", async (req, res) => {
  const id = req.query.id;
  if (!id) {
    return res
      .status(401)
      .json({ success: false, errors: ["Do not have authorized access"] });
  }

  const { title, startDate, endDate, description } = req.body;
  const query = `
    INSERT INTO employees (
      exhibit_name,
      description,
      start_date,
      end_date
    ) VALUES (?, ?, ?, ?)
  `;
  try {
    await promisePool.query(query, [title, startDate, endDate, description]);
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, errors: ["Database error"] });
    console.log("Error retrieving entires...");
    console.log(err);
  }
});

app.patch("/api/setexhibit/", async (req, res) => {
  const userId = req.query.id;
  if (!userId) {
    return res
      .status(401)
      .json({ success: false, errors: ["Do not have authorized access"] });
  }

  const { id, title, startDate, endDate, description } = req.body;
  const query = `
    UPDATE exhibits
    SET 
      exhibit_name = ?,
      description = ?,
      start_date = ?,
      end_date = ?
    WHERE exhibit_id = ?
  `;
  try {
    await promisePool.query(query, [
      title,
      description,
      startDate,
      endDate,
      id,
    ]);
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, errors: ["Database error"] });
    console.log("Error retrieving entires...");
    console.log(err);
  }
});
