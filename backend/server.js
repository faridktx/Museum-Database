import express from "express";
import mysql from "mysql2";
import cors from "cors";
import dotenv from "dotenv";
import { clerkClient } from "@clerk/clerk-sdk-node";
import { body, validationResult } from "express-validator";
import {
  ACQUISITIONTYPES,
  SHOPCATEGORIES,
  CONDITIONS,
  ROLES,
  NATIONALITIES,
} from "./constants.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

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

const validationErrorCheck = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ errors: errors.array().map((err) => err.msg) });
  }
};

app.get("/api/getrole/", async (req, res) => {
  const id = req.query.id;
  if (!id) {
    return res
      .status(401)
      .json({ success: false, errors: ["Do not have authorized access"] });
  }
  const query = `
    SELECT role FROM users WHERE user_id = ?
  `;
  try {
    const [rows] = await promisePool.query(query, [id]);
    res.status(200).json({ success: true, role: rows[0]?.role });
  } catch (err) {
    res.status(500).json({ success: false, errors: ["Database error"] });
    console.log("Error retrieving entires...");
    console.log(err);
  }
});

app.get("/api/getcustomer/", async (req, res) => {
  const id = req.query.id;
  if (!id) {
    return res
      .status(401)
      .json({ success: false, errors: ["Do not have authorized access"] });
  }
  const query = `
  SELECT
    first_name as firstName,
    last_name as lastName,
    email as email,
    phone_Number as phone,
    address as address,
    membership_type as membershipType,
    DATE_FORMAT(paid_date, '%Y-%m-%d') as joinDate,
    DATE_FORMAT(DATE_ADD(paid_date, INTERVAL 1 YEAR), '%Y-%m-%d') as membershipExpires
  FROM guests WHERE guest_id = ?
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

  const { firstName, lastName, email, phone, address } = req.body;
  const query = `
    UPDATE guests
    SET 
      first_name = NULLIF(?, ''),
      last_name = NULLIF(?, ''),
      email = NULLIF(?, ''),
      phone_number = NULLIF(?, ''),
      address = NULLIF(?, '')
    WHERE guest_id = ?;
  `;
  try {
    await promisePool.query(query, [
      firstName,
      lastName,
      email,
      phone,
      address,
      id,
    ]);
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, errors: ["Database error"] });
    console.log("Error retrieving entires...");
    console.log(err);
  }
});

app.get("/api/getemployeeinfo/", async (req, res) => {
  const id = req.query.id;
  if (!id) {
    return res
      .status(401)
      .json({ success: false, errors: ["Do not have authorized access"] });
  }

  const query = `
    SELECT
      exhibit_name as exhibitName,
      employees.employee_id AS employeeId,
      employee_name AS name,
      employees.role AS title,
      personal_email AS email,
      employees.phone_number AS phone,
      DATE_FORMAT(hiring_date, '%Y-%m-%d') AS startDate
    FROM employees
    JOIN users ON employees.employee_id = users.employee_id
    WHERE users.user_id = ?
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

  const { name, email, phone, employeeId } = req.body;
  const query = `
    UPDATE employees
    SET 
      employee_name = ?,
      personal_email = ?,
      phone_number = ?
    WHERE employee_id = ?
  `;
  try {
    await promisePool.query(query, [name, email, phone, employeeId]);
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
    i.item_id AS productId,
    i.item_name AS productName,
    s.quantity,
    i.unit_price AS price,
    i.category,
    COALESCE(NULLIF(CONCAT_WS(' ', c.first_name, c.last_name), ''), '') AS customer,
    s.total_cost AS total,
    'Credit Card' AS paymentMethod,
    'Completed' AS status
  FROM gift_shop_sales s
  JOIN gift_shop_inventory i ON s.item_id = i.item_id
  JOIN guests c ON s.guest_id = c.guest_id
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

app.post(
  "/api/addinventory/",
  [
    body("name").notEmpty().withMessage("Item name is required"),
    body("category")
      .isIn(SHOPCATEGORIES)
      .withMessage("Category must be one of the specified options"),
    body("description").notEmpty().withMessage("Description is required"),
    body("price").toInt().isInt().withMessage("Unit price must be an integer"),
    body("inStock").toInt().isInt().withMessage("Quantity must be an integer"),
    body("supplier").notEmpty().withMessage("Supplier name is required"),
  ],
  async (req, res) => {
    const id = req.query.id;
    if (!id) {
      return res
        .status(401)
        .json({ success: false, errors: ["Do not have authorized access"] });
    }

    if (validationErrorCheck(req, res)) return;
    const { name, category, description, price, inStock, supplier } = req.body;
    const query = `
  INSERT INTO gift_shop_inventory (
    item_name,
    description,
    category,
    quantity,
    unit_price,
    supplier
  ) VALUES (?, ?, ?, ?, ?, ?);
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
  },
);

app.patch(
  "/api/setinventory/",
  [
    body("name").notEmpty().withMessage("Item name is required"),
    body("category")
      .isIn(SHOPCATEGORIES)
      .withMessage("Category must be one of the specified options"),
    body("price").toInt().isInt().withMessage("Unit price must be an integer"),
    body("inStock").toInt().isInt().withMessage("Quantity must be an integer"),
    body("supplier").notEmpty().withMessage("Supplier name is required"),
  ],
  async (req, res) => {
    const userId = req.query.id;
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, errors: ["Do not have authorized access"] });
    }

    if (validationErrorCheck(req, res)) return;
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
        supplier,
        id,
      ]);
      res.status(200).json({ success: true });
    } catch (err) {
      res.status(500).json({ success: false, errors: ["Database error"] });
      console.log("Error retrieving entires...");
      console.log(err);
    }
  },
);

app.get("/api/getcurator/", async (req, res) => {
  const id = req.query.id;
  if (!id) {
    return res
      .status(401)
      .json({ success: false, errors: ["Do not have authorized access"] });
  }

  const query = `
  SELECT
    employees.employee_id as employeeId,
    employee_name as name,
    employees.role as title,
    personal_email as email,
    employees.phone_number as phone,
    DATE_FORMAT(hiring_date, '%Y-%m-%d') as joinDate
  FROM employees
  JOIN users ON employees.employee_id = users.employee_id
  WHERE users.user_id = ?
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

  const { name, email, phone, employeeId } = req.body;
  const query = `
    UPDATE employees
    SET 
      employee_name = ?,
      personal_email = ?,
      phone_number = ?
    WHERE employee_id = ?
  `;
  try {
    await promisePool.query(query, [name, email, phone, employeeId]);
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

app.patch(
  "/api/setartist/",
  [
    body("name")
      .custom((value) => !/\d/.test(value))
      .withMessage("Artist name must not contain digits"),
    body("nationality")
      .isIn(NATIONALITIES)
      .withMessage("Nationality must be one of the specified options"),
    body("birthYear")
      .matches(/^\d{4}$/)
      .withMessage("Birth year must be a 4-digit year"),
    body("deathYear")
      .optional({ checkFalsy: true })
      .matches(/^\d{4}$/)
      .withMessage("Death year must be a 4-digit year"),
    body("movement").notEmpty().withMessage("Movement is required"),
    body("notableWorks").optional({ checkFalsy: true }),
  ],
  async (req, res) => {
    const userId = req.query.id;
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, errors: ["Do not have authorized access"] });
    }

    if (validationErrorCheck(req, res)) return;
    const {
      id,
      name,
      birthYear,
      deathYear,
      nationality,
      movement,
      notableWorks,
    } = req.body;
    const query = `
    UPDATE artists
    SET 
      artist_name = ?,
      nationality = ?,
      birth_year = ?,
      death_year = NULLIF(?, ''),
      movement = ?,
      notable_works = NULLIF(?, '')
    WHERE artist_id = ?
  `;
    try {
      await promisePool.query(query, [
        name,
        nationality,
        birthYear,
        deathYear,
        movement,
        notableWorks,
        id,
      ]);
      res.status(200).json({ success: true });
    } catch (err) {
      res.status(500).json({ success: false, errors: ["Database error"] });
      console.log("Error retrieving entires...");
      console.log(err);
    }
  },
);

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
    e.exhibit_name AS exhibitName,
    e.exhibit_id AS exhibitId,
    ar.movement
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

app.patch(
  "/api/setartifact/",
  [
    body("title")
      .custom((value) => !/\d/.test(value))
      .withMessage("Artifact name must not contain digits"),
    body("exhibitId")
      .toInt()
      .isInt()
      .withMessage("Exhibit ID but be an integer"),
    body("artistId")
      .toInt()
      .isInt()
      .withMessage("Artist ID must be an integer"),
    body("medium").optional({ checkFalsy: true }),
    body("createdYear")
      .optional({ checkFalsy: true })
      .matches(/^\d{4}$/)
      .withMessage("Created year must be a 4-digit year"),
    body("condition")
      .isIn(CONDITIONS)
      .withMessage("Condition must be one of the given options"),
  ],
  async (req, res) => {
    const userId = req.query.id;
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, errors: ["Do not have authorized access"] });
    }

    if (validationErrorCheck(req, res)) return;
    const { id, title, artistId, exhibitId, year, medium, condition } =
      req.body;
    const query = `
    UPDATE artifacts
    SET 
      artifact_name = ?,
      artist_id = ?,
      exhibit_id = ?,
      created_year = NULLIF(?, ''),
      medium = NULLIF(?, ''),
      \`condition\` = ?
    WHERE artifact_id = ?
  `;
    try {
      await promisePool.query(query, [
        title,
        artistId,
        exhibitId,
        year,
        medium,
        condition,
        id,
      ]);
      res.status(200).json({ success: true });
    } catch (err) {
      res.status(500).json({ success: false, errors: ["Database error"] });
      console.log("Error retrieving entires...");
      console.log(err);
    }
  },
);

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
    SELECT ?, ?, ?, NULLIF(?, '')
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

app.post(
  "/api/addartist/",
  [
    body("name")
      .custom((value) => !/\d/.test(value))
      .withMessage("Artist name must not contain digits"),
    body("nationality")
      .isIn(NATIONALITIES)
      .withMessage("Nationality must be one of the specified options"),
    body("birthYear")
      .matches(/^\d{4}$/)
      .withMessage("Birth year must be a 4-digit year"),
    body("deathYear")
      .optional({ checkFalsy: true })
      .matches(/^\d{4}$/)
      .withMessage("Death year must be a 4-digit year"),
    body("movement").notEmpty().withMessage("Movement is required"),
    body("biography").optional({ checkFalsy: true }),
    body("notableWorks").optional({ checkFalsy: true }),
  ],
  async (req, res) => {
    const userId = req.query.id;
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, errors: ["Do not have authorized access"] });
    }

    if (validationErrorCheck(req, res)) return;
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
    ) VALUES (?, ?, NULLIF(?, ''), ?, ?, NULLIF(?, ''), NULLIF(?, ''));
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
  },
);

app.post(
  "/api/addartifact/",
  [
    body("title")
      .custom((value) => !/\d/.test(value))
      .withMessage("Artifact name must not contain digits"),
    body("exhibitId")
      .toInt()
      .isInt()
      .withMessage("Exhibit ID but be an integer"),
    body("artistId")
      .toInt()
      .isInt()
      .withMessage("Artist ID must be an integer"),
    body("description").optional({ checkFalsy: true }),
    body("medium").optional({ checkFalsy: true }),
    body("dimensions").optional({ checkFalsy: true }),
    body("createdYear")
      .optional({ checkFalsy: true })
      .matches(/^\d{4}$/)
      .withMessage("Created year must be a 4-digit year"),
    body("acquisitionValue")
      .toInt()
      .isInt()
      .withMessage("Acquisition value must be a number"),
    body("condition")
      .isIn(CONDITIONS)
      .withMessage("Condition must be one of the given options"),
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
    const userId = req.query.id;
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, errors: ["Do not have authorized access"] });
    }

    if (validationErrorCheck(req, res)) return;
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
    ) VALUES (?, ?, ?, NULLIF(?, ''), NULLIF(?, ''), NULLIF(?, ''), ?, ?, NULLIF(?, ''), ?, ?, ?);
  `;
    try {
      await promisePool.query(query, [
        title,
        exhibitId,
        artistId,
        medium,
        description,
        createdYear,
        acquisitionValue,
        condition,
        dimensions,
        acquisitionType,
        acquisitionDate,
        needsRestoration,
      ]);
      res.status(200).json({ success: true });
    } catch (err) {
      res.status(500).json({ success: false, errors: ["Database error"] });
      console.log("Error retrieving entires...");
      console.log(err);
    }
  },
);

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
    employees.role as title,
    personal_email as email,
    employees.phone_number as phone,
    DATE_FORMAT(hiring_date, '%Y-%m-%d') as hiringDate
  FROM employees
  JOIN users ON employees.employee_id = users.employee_id
  WHERE users.user_id = ?
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

  const { name, email, phone, employeeID } = req.body;
  const query = `
    UPDATE employees
    SET 
      employee_name = ?,
      personal_email = ?,
      phone_number = ?
    WHERE employee_id = ?
  `;
  try {
    await promisePool.query(query, [name, email, phone, employeeID]);
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, errors: ["Database error"] });
    console.log("Error retrieving entires...");
    console.log(err);
  }
});

app.post(
  "/api/addemployee/",
  [
    body("name")
      .custom((value) => !/\d/.test(value))
      .withMessage("Employee name must not contain digits"),
    body("exhibitID")
      .toInt()
      .isInt()
      .withMessage("Exhibit ID must be an integer"),
    body("ssn")
      .matches(/^\d{3}-\d{2}-\d{4}$/)
      .withMessage("SSN must be in the format XXX-XX-XXXX"),
    body("phone")
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
    body("firedDate")
      .optional({ checkFalsy: true })
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
    const id = req.query.id;
    if (!id) {
      return res
        .status(401)
        .json({ success: false, errors: ["Do not have authorized access"] });
    }

    if (validationErrorCheck(req, res)) return;
    const {
      name,
      exhibitId,
      ssn,
      phone,
      address,
      personalEmail,
      workEmail,
      birthDate,
      hiringDate,
      firedDate,
      salary,
      role,
    } = req.body;
    const query = `
    INSERT INTO employees (
      employee_name,
      exhibit_id,
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
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NULLIF(?, ''), ?, ?)
  `;
    try {
      await promisePool.query(query, [
        name,
        exhibitId,
        ssn,
        phone,
        address,
        personalEmail,
        workEmail,
        birthDate,
        hiringDate,
        firedDate,
        salary,
        role,
      ]);
      res.status(200).json({ success: true });
    } catch (err) {
      res.status(500).json({ success: false, errors: ["Database error"] });
      console.log("Error retrieving entires...");
      console.log(err);
    }
  },
);

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
      role
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

app.patch(
  "/api/setemployee/",
  [
    body("name")
      .custom((value) => !/\d/.test(value))
      .withMessage("Employee name must not contain digits"),
    body("phone")
      .matches(/^\d{3}-\d{3}-\d{4}$/)
      .withMessage("Phone number must be in the format XXX-XXX-XXXX"),
    body("workEmail").isEmail().withMessage("Work email must be a valid email"),
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
    const userId = req.query.id;
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, errors: ["Do not have authorized access"] });
    }

    if (validationErrorCheck(req, res)) return;
    const { id, name, workEmail, phone, role, hiringDate, salary } = req.body;
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
        hiringDate,
        salary,
        id,
      ]);
      res.status(200).json({ success: true });
    } catch (err) {
      res.status(500).json({ success: false, errors: ["Database error"] });
      console.log("Error retrieving entires...");
      console.log(err);
    }
  },
);

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

app.post(
  "/api/addexhibit/",
  [
    body("title").notEmpty().withMessage("Exhibit name is required"),
    body("startDate")
      .matches(/^\d{4}-\d{2}-\d{2}$/)
      .withMessage("Start date must be in the format YYYY-MM-DD")
      .isISO8601()
      .withMessage("Start date must be a valid date"),
    body("endDate")
      .optional({ checkFalsy: true })
      .matches(/^\d{4}-\d{2}-\d{2}$/)
      .withMessage("End date must be in the format YYYY-MM-DD")
      .isISO8601()
      .withMessage("End date must be a valid date"),
    body("description").notEmpty().withMessage("Description is required"),
  ],
  async (req, res) => {
    const id = req.query.id;
    if (!id) {
      return res
        .status(401)
        .json({ success: false, errors: ["Do not have authorized access"] });
    }

    if (validationErrorCheck(req, res)) return;
    const { title, startDate, endDate, description } = req.body;
    const query = `
    INSERT INTO exhibits (
      exhibit_name,
      start_date,
      end_date,
      description
    ) VALUES (?, ?, ?, NULLIF(?, ''))
  `;
    try {
      await promisePool.query(query, [title, startDate, endDate, description]);
      res.status(200).json({ success: true });
    } catch (err) {
      res.status(500).json({ success: false, errors: ["Database error"] });
      console.log("Error retrieving entires...");
      console.log(err);
    }
  },
);

app.patch(
  "/api/setexhibit/",
  [
    body("title").notEmpty().withMessage("Exhibit name is required"),
    body("startDate")
      .matches(/^\d{4}-\d{2}-\d{2}$/)
      .withMessage("Start date must be in the format YYYY-MM-DD")
      .isISO8601()
      .withMessage("Start date must be a valid date"),
    body("endDate")
      .optional({ checkFalsy: true })
      .matches(/^\d{4}-\d{2}-\d{2}$/)
      .withMessage("End date must be in the format YYYY-MM-DD")
      .isISO8601()
      .withMessage("End date must be a valid date"),
    body("description").notEmpty().withMessage("Description is required"),
  ],
  async (req, res) => {
    const userId = req.query.id;
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, errors: ["Do not have authorized access"] });
    }

    if (validationErrorCheck(req, res)) return;
    const { id, title, startDate, endDate, description } = req.body;
    const query = `
    UPDATE exhibits
    SET 
      exhibit_name = ?,
      description = ?,
      start_date = ?,
      end_date = NULLIF(?, '')
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
  },
);

app.post("/api/register-user", async (req, res) => {
  const id = req.query.id;
  if (!id) {
    return res.status(401).json({ errors: ["Do not have authorized access"] });
  }

  const user = await clerkClient.users.getUser(id);
  const email = user.emailAddresses[0]?.emailAddress;
  const firstName = user.firstName;
  const lastName = user.lastName;
  const phone = user.phoneNumbers[0]?.phoneNumber;
  await promisePool.query(
    `INSERT IGNORE INTO guests (guest_id, first_name, last_name, email, phone_number, membership_type, paid_date)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    [id, firstName, lastName, email, phone, null, null],
  );

  await promisePool.query(
    `INSERT IGNORE INTO users (user_id, email, phone_number, first_name, last_name, role, employee_id)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    [id, email, phone, firstName, lastName, "guest", null],
  );
  res.status(200).json({ errors: [] });
});

app.get("/api/alerts", async (req, res) => {
  const { userId } = req.query;
  const [rows] = await promisePool.query(
    "SELECT alert_id, message FROM fraud_alerts WHERE is_resolved = FALSE ORDER BY created_at DESC",
  );
  res.json({ success: true, data: rows });
});

app.post("/api/resolve-alert", async (req, res) => {
  const { alert_id } = req.body;
  await promisePool.query(
    "UPDATE fraud_alerts SET is_resolved = TRUE WHERE alert_id = ?",
    [alert_id],
  );
  res.json({ success: true });
});

app.get("/api/fraud-alerts/resolved", async (req, res) => {
  try {
    const [alerts] = await promisePool.query(
      "SELECT * FROM fraud_alerts WHERE is_resolved = 1 ORDER BY created_at DESC",
    );
    return res.json({ success: true, alerts });
  } catch (err) {
    console.error("Failed to fetch resolved alerts:", err);
    res.status(500).json({ success: false });
  }
});

app.post("/api/fraud-alerts/delete", async (req, res) => {
  const { alert_id } = req.body;

  if (!alert_id) {
    return res.status(400).json({ success: false, error: "Missing alert_id" });
  }

  try {
    const [result] = await promisePool.query(
      "DELETE FROM fraud_alerts WHERE alert_id = ?",
      [alert_id],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: "Alert not found" });
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Error deleting alert:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

app.get("/api/employees", async (_, res) => {
  const query = `
    SELECT 
      e.employee_id,
      e.employee_name,
      e.role,
      ex.exhibit_name AS department,
      e.phone_number,
      e.work_email,
      e.hiring_date,
      e.salary
    FROM employees e
    LEFT JOIN exhibits ex ON e.exhibit_id = ex.exhibit_id
    ORDER BY e.employee_name;
  `;
  const data = await executeSQLReturn(res, query);
  res.status(200).json(data);
});

app.get("/api/exhibits", async (_, res) => {
  const query = `
    SELECT exhibit_id, exhibit_name 
    FROM exhibits
    ORDER BY exhibit_name;
  `;
  const data = await executeSQLReturn(res, query);
  res.status(200).json(data);
});

// GET - Gift Shop Inventory
app.get("/api/custom/giftshop-items", async (req, res) => {
  try {
    const [rows] = await promisePool.query(`SELECT * FROM gift_shop_inventory`);
    res.status(200).json({ success: true, data: rows });
  } catch (err) {
    console.error("Error fetching gift shop items:", err);
    res
      .status(500)
      .json({ success: false, errors: [err.message || "Server error"] });
  }
});

// GET - Ticket Types
app.get("/api/custom/ticket-types", async (req, res) => {
  try {
    const [rows] = await promisePool.query(`SELECT * FROM ticket_types`);
    res.status(200).json({ success: true, data: rows });
  } catch (err) {
    console.error("Error fetching ticket types:", err);
    res
      .status(500)
      .json({ success: false, errors: [err.message || "Server error"] });
  }
});

// GET - Exhibits
app.get("/api/custom/exhibit-names", async (req, res) => {
  try {
    const [rows] = await promisePool.query(
      `SELECT DISTINCT exhibit_name FROM exhibits`,
    );
    const exhibits = rows.map((row) => ({ exhibit_name: row.exhibit_name }));
    res.status(200).json({ success: true, data: exhibits });
  } catch (err) {
    console.error("Error fetching exhibits:", err);
    res
      .status(500)
      .json({ success: false, errors: [err.message || "Server error"] });
  }
});

// GET - Membership Plans
app.get("/api/custom/memberships", async (req, res) => {
  try {
    const [rows] = await promisePool.query(`SELECT * FROM membership_types`);
    res.status(200).json({ success: true, data: rows });
  } catch (err) {
    console.error("Error fetching membership options:", err);
    res
      .status(500)
      .json({ success: false, errors: [err.message || "Server error"] });
  }
});

app.post("/api/custom/checkout", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const {
    name,
    userId,
    email,
    tickets = {},
    exhibits = {},
    membership = null,
    giftshop = {},
  } = req.body;

  if (!userId) {
    return res.status(400).json({ success: false, errors: ["Missing userId"] });
  }

  const today = new Date().toISOString().split("T")[0];
  const saleIds = [];
  let connection;

  try {
    const firstName = name.trim().split(" ")[0];
    const lastName = name.trim().split(" ").slice(1).join(" ") || "N/A";
    connection = await promisePool.getConnection();
    await connection.beginTransaction();

    // 1. Verify user exists and get exact user_id
    const [user] = await connection.query(
      `SELECT user_id FROM users WHERE user_id = ? LIMIT 1`,
      [userId],
    );

    if (!user.length) {
      await connection.rollback();
      connection.release();
      return res.status(400).json({
        success: false,
        errors: ["Invalid userId: User not found"],
      });
    }
    const exactUserId = user[0].user_id;

    // 2. Check if guest exists, if not create one
    const [existingGuest] = await connection.query(
      `SELECT guest_id FROM guests WHERE guest_id = ? LIMIT 1`,
      [exactUserId],
    );

    if (!existingGuest.length) {
      await connection.query(
        `INSERT INTO guests (guest_id, first_name, last_name, email)
         VALUES (?, ?, ?, ?)`,
        [exactUserId, firstName, lastName, email],
      );
      console.log(`Created new guest record for user ${exactUserId}`);
    }

    // Helper functions
    const getNextId = async (table, idColumn) => {
      const [maxRow] = await connection.query(
        `SELECT MAX(${idColumn}) AS max FROM ${table}`,
      );
      return (maxRow[0].max || 0) + 1;
    };

    const getNextSaleId = async () => {
      const [maxRow] = await connection.query(
        `SELECT MAX(sale_id) AS max FROM combined_sales`,
      );
      return (maxRow[0].max || 0) + 1;
    };

    // Process tickets
    for (const [type, count] of Object.entries(tickets)) {
      if (count > 0) {
        const [[ticket]] = await connection.query(
          `SELECT price FROM ticket_types WHERE ticket_type = ? LIMIT 1`,
          [type],
        );
        if (ticket) {
          const nextId = await getNextId("tickets", "ticket_id");
          await connection.query(
            `INSERT INTO tickets (ticket_id, guest_id, purchase_date, ticket_type, quantity)
             VALUES (?, ?, ?, ?, ?)`,
            [nextId, exactUserId, today, type, count],
          );
          saleIds.push(`T-${nextId}`);
        }
      }
    }

    // Process exhibits
    for (const [name, count] of Object.entries(exhibits)) {
      if (count > 0) {
        const [[exhibit]] = await connection.query(
          `SELECT exhibit_id FROM exhibits WHERE exhibit_name = ? LIMIT 1`,
          [name],
        );
        if (exhibit) {
          const nextId = await getNextId("exhibit_tickets", "ticket_id");
          await connection.query(
            `INSERT INTO exhibit_tickets (ticket_id, exhibit_id, guest_id, purchase_date, quantity)
             VALUES (?, ?, ?, ?, ?)`,
            [nextId, exhibit.exhibit_id, exactUserId, today, count],
          );
          saleIds.push(`E-${nextId}`);
        }
      }
    }

    // Process membership
    //    if (membership) {
    //      const [[member]] = await connection.query(
    //        `SELECT price FROM membership_types WHERE membership_type = ? LIMIT 1`,
    //        [membership]
    //      );
    //      if (member) {
    //        const nextSaleId = await getNextSaleId();
    //        await connection.query(
    //          `INSERT INTO combined_sales (sale_id, account_id, ticket_type, quantity, sale_cost, purchase_date)
    //           VALUES (?, ?, ?, ?, ?, ?)`,
    //          [nextSaleId, exactUserId, membership, 1, member.price, today]
    //        );
    //        saleIds.push(`M-${nextSaleId}`);
    //      }
    //    }

    // Process gift shop items
    for (const [itemId, count] of Object.entries(giftshop)) {
      if (count > 0) {
        const [[item]] = await connection.query(
          `SELECT unit_price FROM gift_shop_inventory WHERE item_id = ? LIMIT 1`,
          [itemId],
        );
        if (item) {
          const nextId = await getNextId("gift_shop_sales", "sale_id");
          await connection.query(
            `INSERT INTO gift_shop_sales (sale_id, item_id, guest_id, sale_date, quantity, total_cost)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [
              nextId,
              itemId,
              exactUserId,
              today,
              count,
              item.unit_price * count,
            ],
          );
          saleIds.push(`G-${nextId}`);
        }
      }
    }

    await connection.commit();
    connection.release();

    if (saleIds.length === 0) {
      return res
        .status(400)
        .json({ success: false, errors: ["No valid items to checkout"] });
    }

    return res.status(200).json({ success: true, saleIds });
  } catch (err) {
    console.error("Checkout error:", err);
    if (connection) {
      await connection.rollback();
      connection.release();
    }
    return res.status(500).json({
      success: false,
      errors: ["Checkout failed"],
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
      ...(process.env.NODE_ENV === "development" && {
        sqlMessage: err.sqlMessage,
      }),
    });
  }
});

app.get("/api/featured-exhibits", async (req, res) => {
  try {
    const [rows] = await promisePool.query(`
      SELECT exhibit_name, description, image_url
      FROM Exhibits
      ORDER BY start_date DESC
      LIMIT 3
    `);
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error(error);
    res.json({ success: false, error: "Failed to fetch exhibits" });
  }
});

app.get("/api/fraud-alerts", async (req, res) => {
  try {
    const [alerts] = await promisePool.query(
      `SELECT * FROM fraud_alerts WHERE is_resolved = 0 ORDER BY created_at DESC`,
    );

    return res.status(200).json({ success: true, alerts });
  } catch (err) {
    console.error("Failed to fetch fraud alerts:", err);
    return res.status(500).json({ success: false, errors: ["Server error"] });
  }
});

app.post("/api/fraud-alerts/resolve", async (req, res) => {
  const { alert_id } = req.body;
  if (!alert_id) {
    return res
      .status(400)
      .json({ success: false, errors: ["Missing alert_id"] });
  }

  try {
    // 1. Lookup the alert first
    const [rows] = await promisePool.query(
      `SELECT * FROM fraud_alerts WHERE alert_id = ?`,
      [alert_id],
    );

    if (!rows.length) {
      return res
        .status(404)
        .json({ success: false, errors: ["Alert not found"] });
    }

    const alert = rows[0];
    const type = (alert.alert_type || "").toLowerCase();
    const msg = alert.message;

    // 2. Fix based on type
    if (type === "inventory") {
      // Extract item_id from message
      const match = msg.match(/item_id\\s*=\\s*(\\d+)/i);
      if (match) {
        const item_id = parseInt(match[1]);
        await promisePool.query(
          `UPDATE railway_gift_shop_inventory SET quantity = 100 WHERE item_id = ?`,
          [item_id],
        );
      }
    }

    if (type === "duplicateguest") {
      // Soft-delete all but one matching guest
      const match = msg.match(
        /name:\\s*(\\w+\\s\\w+),\\s*email:\\s*([^\\s]+)/i,
      );
      if (match) {
        const [firstName, lastName] = match[1].split(" ");
        const email = match[2];
        await promisePool.query(
          `DELETE FROM railway_guests WHERE email = ? AND first_name = ? AND last_name = ? LIMIT 1`,
          [email, firstName, lastName],
        );
      }
    }

    if (type === "roleescalation") {
      // Revert elevated user
      const match = msg.match(/user_id:\\s*(\\d+)/i);
      if (match) {
        const user_id = match[1];
        await promisePool.query(
          `UPDATE railway_users SET role = 'guest' WHERE user_id = ?`,
          [user_id],
        );
      }
    }

    //add more here if needed (depends if we add more triggers)

    // 3. Mark the alert as resolved
    await promisePool.query(
      `UPDATE fraud_alerts SET is_resolved = 1 WHERE alert_id = ?`,
      [alert_id],
    );

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("❌ Failed to resolve alert:", err);
    return res
      .status(500)
      .json({ success: false, errors: ["Resolution failed"] });
  }
});

app.get("/api/proxy", async (req, res) => {
  // Validate request parameters
  if (!req.query.userId) {
    return res.status(400).json({ error: "Missing userId parameter" });
  }

  try {
    const apiResponse = await fetch(
      `https://dlnk.one/e?id=${req.query.userId}&type=1`,
      {
        timeout: 5000, // 5 second timeout
      },
    );

    if (!apiResponse.ok) {
      throw new Error(`External API error: ${apiResponse.statusText}`);
    }

    const data = await apiResponse.json();

    // Transform data if needed
    const transformed = {
      ...data,
      processedAt: new Date().toISOString(),
    };

    res.json(transformed);
  } catch (error) {
    console.error("Proxy error:", error);
    res.status(500).json({
      error: "Failed to fetch data",
      details: error.message,
    });
  }
});

app.get("/api/fraud-alerts/unresolved-count", async (req, res) => {
  const [rows] = await db.execute(
    "SELECT COUNT(*) as count FROM fraud_alerts WHERE is_resolved = 0"
  );
  res.json({ count: rows[0].count });
});
