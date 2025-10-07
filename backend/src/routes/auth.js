const express = require("express");
const router = express.Router();
const db = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { registerValidator } = require("../middlewares/validators");

const JWT_SECRET = process.env.JWT_SECRET || "c2VjcmV0OmtleQ==";
const SALT_ROUNDS = 12;

// POST /auth/register
router.post("/register", registerValidator, async (req, res) => {
  try {
    const { username, password } = req.body;
    const userExists = await db.query("SELECT id FROM users WHERE username=$1", [username]);
    if (userExists.rows.length) return res.status(409).json({ ok: false, message: "Usuario ya existe" });

    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const result = await db.query("INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING id, username, role", [username, hash, "user"]);
    const user = result.rows[0];
    return res.status(201).json({ ok: true, user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, message: "Error en server" });
  }
});

// POST /auth/login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await db.query("SELECT id, username, password, role FROM users WHERE username=$1", [username]);
    if (!result.rows.length) return res.status(401).json({ ok: false, message: "Credenciales invalidas" });
    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ ok: false, message: "Credenciales invalidas" });

    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: "8h" });
    return res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, message: "Error en server" });
  }
});

module.exports = router;
