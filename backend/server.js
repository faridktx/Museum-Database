<<<<<<< Updated upstream
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
=======
import express from "express";
import mysql from "mysql2";
import cors from "cors";
import dotenv from "dotenv";
import { body, validationResult } from "express-validator";
import { ACQUISITIONTYPES, ROLES } from "../shared/constants.js";
>>>>>>> Stashed changes

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
  password: "Tuotat1!",
  database: "test_db",
  waitForConnections: true,
  connectionLimit: 30,
  queueLimit: 0,
});

const promisePool = pool.promise();

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

app.delete("/api/artifact/delete/", async (req, res) => {
  deleteRecord("artifacts", "artifact_id", req, res);
});

app.delete("/api/artist/delete/", async (req, res) => {
  deleteRecord("artists", "artist_id", req, res);
});

app.delete("/api/employee/delete", async (req, res) => {
  deleteRecord("employees", "employee_id", req, res);
});
