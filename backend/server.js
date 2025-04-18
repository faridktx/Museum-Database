import express from "express";
import mysql from "mysql2";
import cors from "cors";
import dotenv from "dotenv";
import { body, validationResult } from "express-validator";
import { ACQUISITIONTYPES, ROLES, NATIONALITIES } from "./constants.js";
import { clerkClient } from "@clerk/clerk-sdk-node";

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

const executeSQLReturn = async (res, query) => {
  try {
    const [rows] = await promisePool.query(query);
    return rows;
  } catch (err) {
    res.status(500).json({ errors: ["Database error"] });
    console.log("Error retrieving entires...");
    console.log(err);
  }
};

const executeSQLQuery = async (res, query, fields) => {
  try {
    await promisePool.query(query, fields);
    res.status(200).json({ errors: [] });
  } catch (err) {
    res.status(500).json({ errors: ["Database error"] });
    console.log("Error modifying database...");
    console.log(err);
  }
};

const deleteRecord = async (table, column, recordID, res) => {
  const query = `DELETE FROM ${table} WHERE ${column} = ?`;

  try {
    const [result] = await promisePool.query(query, [recordID]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ errors: ["Inserted ID does not exist."] });
    }
    res.status(200).json({ errors: [] });
  } catch (err) {
    res.status(500).json({ errors: ["Database error"] });
    console.log("Error modifying database...");
    console.log(err);
  }
};

const insertRecord = async (table, res, fields) => {
  let insertVariables = [];
  let insertColumns = [];
  const insertQs = fields.map(() => "?").join(", ");
  fields.forEach((field) => {
    const value = !field.value ? null : field.value;
    insertVariables.push(value);
    insertColumns.push(field.column);
  });
  const query = `INSERT INTO ${table} (${insertColumns.join(", ")}) VALUES (${insertQs})`;
  await executeSQLQuery(res, query, insertVariables);
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

    try {
      const [result] = await promisePool.query(query, setVariables);
      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ errors: ["Inserted ID does not exist."] });
      }
      res.status(200).json({ errors: [] });
    } catch (err) {
      res.status(500).json({ errors: ["Database error"] });
      console.log("Error modifying database...");
      console.log(err);
    }
  } else {
    res
      .status(400)
      .json({ errors: ["No fields to be modified were provided"] });
  }
};

app.get("/api/getartists/", async (_, res) => {
  const query = "SELECT artist_id as id, artist_name as name FROM artists";
  const data = await executeSQLReturn(res, query);
  res.status(200).json(data);
});

app.get("/api/getexhibits/", async (_, res) => {
  const query = "SELECT exhibit_id as id, exhibit_name as name FROM exhibits";
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
    const { id } = req.body;
    if (!id) {
      return res
        .status(401)
        .json({ errors: ["Do not have authorized access"] });
    }

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
    const { id } = req.body;
    if (!id) {
      return res
        .status(401)
        .json({ errors: ["Do not have authorized access"] });
    }

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
    const { id } = req.body;
    if (!id) {
      return res
        .status(401)
        .json({ errors: ["Do not have authorized access"] });
    }

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
    const { id } = req.body;
    if (!id) {
      return res
        .status(401)
        .json({ errors: ["Do not have authorized access"] });
    }

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
    const { id } = req.body;
    if (!id) {
      return res
        .status(401)
        .json({ errors: ["Do not have authorized access"] });
    }

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
    const { id } = req.body;
    if (!id) {
      return res
        .status(401)
        .json({ errors: ["Do not have authorized access"] });
    }

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
    const fields = [
      { column: "employee_name", value: employeeName },
      { column: "exhibit_id", value: exhibitID },
      { column: "ssn", value: ssn },
      { column: "personal_email", value: personalEmail },
      { column: "work_email", value: workEmail },
      { column: "phone_number", value: phoneNumber },
      { column: "birth_date", value: birthDate },
      { column: "hiring_date", value: hiringDate },
      { column: "role", value: role },
      { column: "fired_date", value: firedDate },
      { column: "salary", value: salary },
      { column: "address", value: address },
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
    const { id } = req.body;
    if (!id) {
      return res
        .status(401)
        .json({ errors: ["Do not have authorized access"] });
    }

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
    const { id } = req.body;
    if (!id) {
      return res
        .status(401)
        .json({ errors: ["Do not have authorized access"] });
    }

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
    const { id } = req.body;
    if (!id) {
      return res
        .status(401)
        .json({ errors: ["Do not have authorized access"] });
    }

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
    const fields = [
      { column: "employee_name", value: employeeName },
      { column: "ssn", value: ssn },
      { column: "phone_number", value: phoneNumber },
      { column: "personal_email", value: personalEmail },
      { column: "work_email", value: workEmail },
      { column: "address", value: address },
      { column: "birth_date", value: birthDate },
      { column: "hiring_date", value: hiringDate },
      { column: "fired_date", value: null },
      { column: "salary", value: salary },
      { column: "role", value: role },
      { column: "exhibit_id", value: exhibitID },
    ];
    await insertRecord("employees", res, fields);
  },
);

app.post(
  "/api/memberships",
  [
    body("membership")
      .isIn(["individual", "dual", "family", "benefactor"])
      .withMessage("Membership type must be within accepted categories"),
  ],
  async (req, res) => {
    if (validationErrorCheck(req, res)) return;

    const { id } = req.body;
    if (!id) {
      return res
        .status(401)
        .json({ errors: ["Do not have authorized access"] });
    }
    const { membership } = req.body;

    const query = `UPDATE guests SET membership_type = ?, paid_date = ? WHERE guest_id = ?`;
    await executeSQLQuery(res, query, [
      membership,
      new Date().toISOString().split("T")[0],
      id,
    ]);
  },
);

app.get("/api/gettickets/", async (req, res) => {
  const id = req.query.id;
  if (!id) {
    return res.status(401).json({ errors: ["Do not have authorized access"] });
  }

  const query = "SELECT * FROM ticket_types";
  const data = await executeSQLReturn(res, query);
  res.status(200).json(data);
});

app.get("/api/getgiftshopitems/", async (req, res) => {
  const id = req.query.id;
  if (!id) {
    return res.status(401).json({ errors: ["Do not have authorized access"] });
  }

  const query = "SELECT * FROM gift_shop_inventory";
  const data = await executeSQLReturn(res, query);
  res.status(200).json(data);
});

app.get("/api/getexhibitnames/", async (req, res) => {
  const id = req.query.id;
  if (!id) {
    return res.status(401).json({ errors: ["Do not have authorized access"] });
  }

  const query = "SELECT exhibit_id, exhibit_name FROM exhibits";
  const data = await executeSQLReturn(res, query);
  res.status(200).json(data);
});

app.get("/api/getmemberships/", async (req, res) => {
  const id = req.query.id;
  if (!id) {
    return res.status(401).json({ errors: ["Do not have authorized access"] });
  }

  const query = "SELECT * FROM membership_types";
  const data = await executeSQLReturn(res, query);
  res.status(200).json(data);
});

app.get("/api/role", async (req, res) => {
  const id = req.query.id;
  if (!id) {
    return res.status(401).json({ errors: ["Do not have authorized access"] });
  }

  const query = "SELECT role FROM users WHERE user_id = ?";
  const [rows] = await promisePool.query(query, [id]);
  res.json({ role: rows[0]?.role });
});

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
    `INSERT IGNORE INTO users (user_id, email, phone_number, first_name, last_name, role)
    VALUES (?, ?, ?, ?, ?, ?)
    `,
    [id, email, phone, firstName, lastName, "guest"],
  );
  res.status(200).json({ errors: [] });
});

app.patch("/api/guest/modify", async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(401).json({ errors: ["Do not have authorized access"] });
  }

  if (validationErrorCheck(req, res)) return;
  const {
    guestID,
    firstName,
    lastName,
    email,
    phoneNumber,
    paidDate,
    membershipType,
  } = req.body;
  const fields = [
    { column: "first_name", value: firstName },
    { column: "last_name", value: lastName },
    { column: "email", value: email },
    { column: "phone_number", value: phoneNumber },
    { column: "paid_date", value: paidDate },
    { column: "membership_type", value: membershipType },
  ];
  await modifyRecord(res, guestID, "guest_id", "guests", fields);
});

app.delete("/api/guest/delete", async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(401).json({ errors: ["Do not have authorized access"] });
  }

  if (validationErrorCheck(req, res)) return;
  const { guestID } = req.body;
  await deleteRecord("guests", "guest_id", guestID, res);
});

app.post("/api/exhibit/insert", async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(401).json({ errors: ["Do not have authorized access"] });
  }

  if (validationErrorCheck(req, res)) return;
  const { exhibitName, description, startDate, endDate } = req.body;
  const fields = [
    { column: "exhibit_name", value: exhibitName },
    { column: "description", value: description },
    { column: "start_date", value: startDate },
    { column: "end_date", value: endDate },
  ];
  await insertRecord("exhibits", res, fields);
});

app.patch("/api/exhibit/modify", async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(401).json({ errors: ["Do not have authorized access"] });
  }

  if (validationErrorCheck(req, res)) return;
  const { exhibitID, exhibitName, description, startDate, endDate } = req.body;
  const fields = [
    { column: "exhibit_name", value: exhibitName },
    { column: "description", value: description },
    { column: "start_date", value: startDate },
    { column: "end_date", value: endDate },
  ];
  await modifyRecord(res, exhibitID, "exhibit_id", "exhibits", fields);
});

app.delete("/api/exhibit/delete", async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(401).json({ errors: ["Do not have authorized access"] });
  }

  if (validationErrorCheck(req, res)) return;
  const { exhibitID } = req.body;
  await deleteRecord("exhibits", "exhibit_id", exhibitID, res);
});

app.post("/api/inventory/insert", async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(401).json({ errors: ["Do not have authorized access"] });
  }

  if (validationErrorCheck(req, res)) return;
  const { itemName, description, category, quantity, unitPrice } = req.body;
  const fields = [
    { column: "item_name", value: itemName },
    { column: "description", value: description },
    { column: "category", value: category },
    { column: "quantity", value: quantity },
    { column: "unit_price", value: unitPrice },
  ];
  await insertRecord("gift_shop_inventory", res, fields);
});

app.patch("/api/inventory/modify", async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(401).json({ errors: ["Do not have authorized access"] });
  }

  if (validationErrorCheck(req, res)) return;
  const { itemID, itemName, description, category, quantity, unitPrice } =
    req.body;
  const fields = [
    { column: "item_name", value: itemName },
    { column: "description", value: description },
    { column: "category", value: category },
    { column: "quantity", value: quantity },
    { column: "unit_price", value: unitPrice },
  ];
  await modifyRecord(res, itemID, "item_id", "gift_shop_inventory", fields);
});

app.delete("/api/inventory/delete", async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(401).json({ errors: ["Do not have authorized access"] });
  }

  if (validationErrorCheck(req, res)) return;
  const { itemID } = req.body;
  await deleteRecord("gift_shop_inventory", "item_id", itemID, res);
});

app.post("/api/sales/insert", async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(401).json({ errors: ["Do not have authorized access"] });
  }

  if (validationErrorCheck(req, res)) return;
  const { itemID, guestID, saleDate, quantity, totalCost } = req.body;
  const fields = [
    { column: "item_id", value: itemID },
    { column: "guest_id", value: guestID },
    { column: "sale_date", value: saleDate },
    { column: "quantity", value: quantity },
    { column: "total_cost", value: totalCost },
  ];
  await insertRecord("gift_shop_sales", res, fields);
});

app.patch("/api/sales/modify", async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(401).json({ errors: ["Do not have authorized access"] });
  }

  if (validationErrorCheck(req, res)) return;
  const { saleID, itemID, guestID, saleDate, quantity, totalCost } = req.body;
  const fields = [
    { column: "item_id", value: itemID },
    { column: "guest_id", value: guestID },
    { column: "sale_date", value: saleDate },
    { column: "quantity", value: quantity },
    { column: "total_cost", value: totalCost },
  ];
  await modifyRecord(res, saleID, "sale_id", "gift_shop_sales", fields);
});

app.delete("/api/sales/delete", async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(401).json({ errors: ["Do not have authorized access"] });
  }

  if (validationErrorCheck(req, res)) return;
  const { saleID } = req.body;
  await deleteRecord("gift_shop_sales", "sale_id", saleID, res);
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

app.get("/api/artifact-graph", async (_, res) => {
  const query = `
  SELECT
    YEAR(a.acquisition_date) AS acquisition_year,
    ar.nationality,
    COUNT(*) AS total_artifacts,
    SUM(a.value) AS total_value
    FROM railway.artifacts a
    JOIN railway.artists ar ON a.artist_id = ar.artist_id
    GROUP BY acquisition_year, ar.nationality
    ORDER BY acquisition_year, total_value DESC
  `;
  const data = await executeSQLReturn(res, query);
  res.status(200).json(data);
});

app.get("/api/artifact-report", async (_, res) => {
  const query = `
          SELECT 
            a.Artifact_ID, 
            a.Artifact_Name,
            a.description, 
            a.Value, 
            ar.Artist_Name, 
            ar.Nationality
          FROM artifacts a
          JOIN artists ar ON a.Artist_ID = ar.Artist_ID
          ORDER BY a.Artifact_ID;
  `;
  const data = await executeSQLReturn(res, query);
  res.status(200).json(data);
});


app.get("/api/department-report", async (_, res) => {
  const query = `
  SELECT
    e.exhibit_name,
    emp.role,
    COUNT(*) AS total_employees,
    COUNT(CASE WHEN emp.fired_date IS NULL THEN 1 END) AS active_employees,
    AVG(emp.salary) AS average_salary
  FROM railway.employees AS emp
  JOIN railway.exhibits AS e ON emp.exhibit_id = e.exhibit_id
  GROUP BY e.exhibit_name, emp.role
  ORDER BY e.exhibit_name, emp.role
  `;
  const data = await executeSQLReturn(res, query);
  res.status(200).json(data);
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

app.get("/api/artists-list", async (_, res) => {
  const query = `
    SELECT 
      artist_id,
      artist_name,
      birth_date,
      death_date,
      nationality
    FROM artists
    ORDER BY artist_name;
  `;
  const data = await executeSQLReturn(res, query);
  res.status(200).json(data);
});

app.get("/api/giftshop-inventory", async (_, res) => {
  const query = `
    SELECT 
      item_id,
      item_name,
      description,
      category,
      quantity,
      unit_price
    FROM gift_shop_inventory
    ORDER BY item_name;
  `;
  const data = await executeSQLReturn(res, query);
  res.status(200).json(data);
});

app.get("/api/giftshop-sales", async (_, res) => {
  const query = `
    SELECT 
      sale_id,
      item_id,
      guest_id,
      sale_date,
      quantity,
      total_cost
    FROM gift_shop_sales
    ORDER BY sale_date DESC;
  `;
  const data = await executeSQLReturn(res, query);
  res.status(200).json(data);
});
// for sales report
app.get("/api/giftshop-names", async (_, res) => {
  const query = `
    SELECT 
      item_id,
      item_name,
      category
    FROM gift_shop_inventory;
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
    res.status(500).json({ success: false, errors: [err.message || "Server error"] });
  }
});

// GET - Ticket Types
app.get("/api/custom/ticket-types", async (req, res) => {
  try {
    const [rows] = await promisePool.query(`SELECT * FROM ticket_types`);
    res.status(200).json({ success: true, data: rows });
  } catch (err) {
    console.error("Error fetching ticket types:", err);
    res.status(500).json({ success: false, errors: [err.message || "Server error"] });
  }
});

// GET - Exhibits
app.get("/api/custom/exhibit-names", async (req, res) => {
  try {
    const [rows] = await promisePool.query(`SELECT DISTINCT exhibit_name FROM exhibits`);
    const exhibits = rows.map(row => ({ exhibit_name: row.exhibit_name }));
    res.status(200).json({ success: true, data: exhibits });
  } catch (err) {
    console.error("Error fetching exhibits:", err);
    res.status(500).json({ success: false, errors: [err.message || "Server error"] });
  }
});

// GET - Membership Plans
app.get("/api/custom/memberships", async (req, res) => {
  try {
    const [rows] = await promisePool.query(`SELECT * FROM membership_types`);
    res.status(200).json({ success: true, data: rows });
  } catch (err) {
    console.error("Error fetching membership options:", err);
    res.status(500).json({ success: false, errors: [err.message || "Server error"] });
  }
});


app.post("/api/combined-sales", async (req, res) => {
  const { accountId, sales } = req.body;

  if (!accountId || !Array.isArray(sales) || sales.length === 0) {
    return res.status(400).json({ success: false, errors: ["Invalid sale submission"] });
  }

  try {
    const connection = await promisePool.getConnection();
    await connection.beginTransaction();

    let [idRows] = await connection.query(`SELECT MAX(sale_id) AS max FROM combined_sales`);
    let nextId = (idRows[0]?.max || 0) + 1;

    for (const sale of sales) {
      await connection.query(
        `INSERT INTO combined_sales (
          sale_id, account_id, item_id, qty_sold, ticket_type, quantity, purchase_date, sale_cost
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          nextId++,
          accountId,
          sale.item_id || null,
          sale.qty_sold || null,
          sale.ticket_type || null,
          sale.quantity || null,
          sale.purchase_date || new Date().toISOString().split("T")[0],
          sale.sale_cost
        ]
      );
    }

    await connection.commit();
    connection.release();
    res.status(200).json({ success: true, message: "Sales recorded successfully" });
  } catch (err) {
    console.error("Combined sales insert error:", err);
    res.status(500).json({ success: false, errors: ["Failed to insert combined sales"] });
  }
});

app.post("/api/account-id", async (req, res) => {
  const { email, phone } = req.body;

  if (!email && !phone) {
    return res.status(400).json({ success: false, errors: ["Missing email or phone"] });
  }

  try {
    const [rows] = await promisePool.query(
      `SELECT account_id FROM users WHERE email = ? OR phone_number = ? LIMIT 1`,
      [email?.trim(), phone?.trim()]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, errors: ["Account not found"] });
    }

    res.status(200).json({ success: true, accountId: rows[0].account_id });
  } catch (err) {
    console.error("Account lookup error:", err);
    res.status(500).json({ success: false, errors: ["Database error"] });
  }
});

app.post("/api/register-account", async (req, res) => {
  const { name, email, phone } = req.body;

  if (!name || (!email && !phone)) {
    return res.status(400).json({ success: false, errors: ["Missing name and email or phone"] });
  }

  try {
    const firstName = name.trim().split(" ")[0];
    const lastName = name.trim().split(" ").slice(1).join(" ") || "N/A";

    const userId = Math.floor(100000 + Math.random() * 900000).toString();

    await promisePool.query(
      `INSERT INTO users (user_id, email, phone_number, first_name, last_name)
       VALUES (?, ?, ?, ?, ?)`,
      [userId, email || null, phone || null, firstName, lastName]
    );

    const [rows] = await promisePool.query(
      `SELECT account_id FROM users WHERE user_id = ? LIMIT 1`,
      [userId]
    );

    const accountId = rows[0]?.account_id;
    res.status(201).json({ success: true, accountId });
  } catch (err) {
    console.error("Register account error:", err);
    res.status(500).json({ success: false, errors: ["Failed to register account"] });
  }
});

app.post("/api/custom/checkout", async (req, res) => {
  const { accountId, tickets = {}, exhibits = {}, membership = null, giftshop = {} } = req.body;

  if (!accountId) {
    return res.status(400).json({ success: false, errors: ["Missing accountId"] });
  }

  const today = new Date().toISOString().split("T")[0];
  const saleIds = [];

  try {
    const connection = await promisePool.getConnection();
    await connection.beginTransaction();

    const [maxRow] = await connection.query(`SELECT MAX(sale_id) AS max FROM combined_sales`);
    let nextSaleId = (maxRow[0].max || 0) + 1;

    const insert = async (data) => {
      const {
        item_id = null,
        ticket_type = null,
        quantity = null,
        sale_cost = 0,
      } = data;

      await connection.query(
        `INSERT INTO combined_sales (sale_id, account_id, item_id, ticket_type, quantity, sale_cost, purchase_date)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [nextSaleId, accountId, item_id, ticket_type, quantity, sale_cost, today]
      );
      saleIds.push(nextSaleId++);
    };

    // Tickets
    for (const [type, count] of Object.entries(tickets)) {
      if (count > 0) {
        const [[ticket]] = await connection.query(
          `SELECT price FROM ticket_types WHERE ticket_type = ? LIMIT 1`,
          [type]
        );
        if (ticket) {
          await insert({
            ticket_type: type,
            quantity: count,
            sale_cost: ticket.price * count,
          });
        }
      }
    }

    // Exhibits
    for (const [name, count] of Object.entries(exhibits)) {
      if (count > 0) {
        const [[exhibit]] = await connection.query(
          `SELECT price FROM ticket_types WHERE ticket_type = ? LIMIT 1`,
          [name]
        );
        if (exhibit) {
          await insert({
            ticket_type: name,
            quantity: count,
            sale_cost: exhibit.price * count,
          });
        }
      }
    }

    // Membership
    if (membership) {
      const [[member]] = await connection.query(
        `SELECT price FROM membership_types WHERE membership_type = ? LIMIT 1`,
        [membership]
      );
      if (member) {
        await insert({
          ticket_type: membership,
          quantity: 1,
          sale_cost: member.price,
        });
      }
    }

    // Gift Shop
    for (const [itemId, count] of Object.entries(giftshop)) {
      if (count > 0) {
        const [[item]] = await connection.query(
          `SELECT unit_price FROM gift_shop_inventory WHERE item_id = ? LIMIT 1`,
          [itemId]
        );
        if (item) {
          await insert({
            item_id: itemId,
            quantity: count,
            sale_cost: item.unit_price * count,
          });
        }
      }
    }

    await connection.commit();
    connection.release();

    if (saleIds.length === 0) {
      return res.status(400).json({ success: false, errors: ["No valid items to checkout"] });
    }

    res.status(200).json({ success: true, saleIds });
  } catch (err) {
    console.error("❌ Checkout insert failed:", err);
    res.status(500).json({ success: false, errors: [err.message || "Checkout error"] });
  }
});


app.get("/api/featured-exhibits", async (req, res) => {
  try {
    const [rows] = await db.query(`
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